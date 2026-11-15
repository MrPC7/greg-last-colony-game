#!/usr/bin/env python3
"""Cut clean transparent character sprites out of the AI-generated cast sheet.

Reads the CLEAN cast image (the --cast data URL in the prototype HTML, i.e. without the burned-in
AI label), crops each character with the same boxes as lib/characters.ts (CH[i].b, in the
prototype's 1476x777 coordinate space), removes the background with rembg, and writes
public/img/sprites/<name>.webp (+ .png fallback).

Clean-up per sprite:
  * the crop boxes overlap the neighbours, so only the connected alpha component(s) that
    belong to the character in the middle of the box are kept;
  * a slight alpha erode (removes the halo of old background) + feather (soft edge);
  * trimmed to the character and scaled down to at most MAX_H px tall.

The sprites are crops of AI art, so the game shows a tiny "IA" / "AI" mark next to them
(components/ui/Watermark.tsx, compact) and each file carries the disclosure in its metadata.

Requires: pip install "rembg[cpu]" Pillow numpy scipy
Usage:
  python scripts/make_sprites.py "../Greg and the Last Colony.html"
"""

from __future__ import annotations

import argparse
import base64
import io
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CW, CHT = 1476, 777  # prototype coordinate space of the cast sheet (lib/characters.ts)

# name -> crop box [x, y, w, h]; keep in sync with CH[i].b in lib/characters.ts.
SPRITES = {
    "greg": (0, 0, 365, 740),
    "elen": (330, 75, 300, 670),
    "orbi": (585, 200, 330, 555),
    "joseph": (905, 110, 265, 640),
    "ray": (1150, 15, 326, 725),
}
# Per-sprite rembg models; several = union of their masks. isnet-general-use is the cleanest
# on the kids and Ray, but drops Orbi's belly and legs, which u2net keeps.
MODELS = {"orbi": ("isnet-general-use", "u2net")}
DEFAULT_MODELS = ("isnet-general-use",)
# Sheet name labels (and their frames) start at y≈745 (prototype space); crops stop above them.
LABEL_Y = 740
# Extra context above each box: when a box's top edge passes just over a head, rembg keeps the
# sliver of sky it cuts off; with some sky above it, it classifies it as background.
PAD_TOP = 30
MAX_H = 400
ERODE_PX = 2  # at the source resolution
FEATHER_PX = 1.2
WEBP_QUALITY = 86
AI_NOTE = "Imagen generada con IA · AI-generated image (crop of the cast sheet)"

PATTERN = re.compile(r"--cast\s*:\s*url\(\s*['\"]?data:image/jpeg;base64,(?P<data>[A-Za-z0-9+/=\s]+?)['\"]?\s*\)")


def load_cast(html: Path):
    from PIL import Image

    m = PATTERN.search(html.read_text(encoding="utf-8"))
    if not m:
        raise SystemExit("error: --cast data URL not found in the HTML")
    raw = base64.b64decode(re.sub(r"\s+", "", m.group("data")), validate=True)
    return Image.open(io.BytesIO(raw)).convert("RGB")


def keep_main_component(alpha):
    """Keep the alpha components that overlap the central column of the box (the character),
    dropping fragments of the neighbours that the overlapping boxes let in."""
    import numpy as np
    from scipy import ndimage

    solid = alpha > 96
    lab, n = ndimage.label(solid)
    if n == 0:
        return alpha
    h, w = alpha.shape
    centre = lab[:, int(w * 0.35) : int(w * 0.65)]
    sizes = ndimage.sum(solid, lab, range(1, n + 1))
    hits = set(np.unique(centre[centre > 0]).tolist())
    biggest = int(np.argmax(sizes)) + 1
    keep = {i for i in hits if sizes[i - 1] >= 0.02 * sizes[biggest - 1]} or {biggest}
    mask = np.isin(lab, list(keep))
    # Grow the kept core a little so its soft (low-alpha) edge pixels survive.
    mask = ndimage.binary_dilation(mask, iterations=2)
    return np.where(mask, alpha, 0).astype(alpha.dtype)


def clean_alpha(rgba):
    import numpy as np
    from PIL import Image, ImageFilter

    a = np.asarray(rgba.getchannel("A"))
    a = keep_main_component(a)
    am = Image.fromarray(a)
    am = am.filter(ImageFilter.MinFilter(ERODE_PX * 2 + 1))  # erode
    am = am.filter(ImageFilter.GaussianBlur(FEATHER_PX))  # feather
    out = rgba.copy()
    out.putalpha(am)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("html", type=Path, help="Path to the prototype HTML (clean originals)")
    parser.add_argument("--out", type=Path, default=REPO_ROOT / "public" / "img" / "sprites")
    args = parser.parse_args()

    if not args.html.is_file():
        print(f"error: HTML file not found: {args.html}", file=sys.stderr)
        return 1

    from PIL import Image
    from PIL.PngImagePlugin import PngInfo
    from rembg import new_session, remove

    cast = load_cast(args.html)
    kx, ky = cast.width / CW, cast.height / CHT
    sessions: dict = {}

    def cutout(name, crop):
        """rembg cut-out; with several models, the union (max) of their alpha masks."""
        import numpy as np

        alphas = []
        for m in MODELS.get(name, DEFAULT_MODELS):
            if m not in sessions:
                sessions[m] = new_session(m)
            alphas.append(np.asarray(remove(crop, session=sessions[m], post_process_mask=True).getchannel("A")))
        out = crop.convert("RGBA")
        out.putalpha(Image.fromarray(np.maximum.reduce(alphas)))
        return out
    args.out.mkdir(parents=True, exist_ok=True)

    for name, (x, y, w, h) in SPRITES.items():
        box = (round(x * kx), round(max(0, y - PAD_TOP) * ky), round(min(x + w, CW) * kx), round(min(y + h, LABEL_Y) * ky))
        crop = cast.crop(box)
        cut = clean_alpha(cutout(name, crop))
        bbox = cut.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if not bbox:
            print(f"error: {name}: empty mask", file=sys.stderr)
            return 1
        cut = cut.crop(bbox)
        if cut.height > MAX_H:
            cut = cut.resize((round(cut.width * MAX_H / cut.height), MAX_H), Image.LANCZOS)

        webp = args.out / f"{name}.webp"
        png = args.out / f"{name}.png"
        exif = Image.Exif()
        exif[0x010E] = AI_NOTE  # ImageDescription
        cut.save(webp, "WEBP", quality=WEBP_QUALITY, alpha_quality=100, method=6, exif=exif)
        info = PngInfo()
        info.add_text("Description", AI_NOTE)
        cut.save(png, "PNG", optimize=True, pnginfo=info)
        print(f"{name:<7} {cut.width}x{cut.height}  {webp.stat().st_size:,} B webp, {png.stat().st_size:,} B png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
