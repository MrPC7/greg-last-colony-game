#!/usr/bin/env python3
"""Extract the embedded base64 JPEGs from the prototype HTML into public/img/
and burn the AI-disclosure watermark into them (Space Apps rule for AI images).

The prototype defines three CSS custom properties holding data URLs:
  --map  -> public/img/map.jpg
  --key  -> public/img/keyart.jpg
  --cast -> public/img/cast.jpg

All three are AI-generated, so each file gets a bilingual label burned into its
bottom-right corner ("Imagen generada con IA · AI-generated image") plus a JPEG
comment with the same text. The images are re-encoded with Pillow's
quality="keep" / subsampling="keep", i.e. the original quantisation tables and
chroma subsampling, so quality matches the source. Always run this on the
prototype HTML (the clean originals) — never on already-watermarked files.

The label geometry is defined as fractions of the image width (WM_* below) so
the in-game overlay (components/ui/Watermark.tsx, .wm in app/globals.css) can
sit exactly on top of it.

Requires Pillow (pip install Pillow).

Usage:
  python scripts/extract_assets.py "../Greg and the Last Colony.html"
  python scripts/extract_assets.py <html> --out public/img
  python scripts/extract_assets.py <html> --no-watermark   # raw originals
"""

from __future__ import annotations

import argparse
import base64
import io
import re
import sys
from pathlib import Path

TARGETS = {
    "map": "map.jpg",
    "key": "keyart.jpg",
    "cast": "cast.jpg",
}

PATTERN = re.compile(
    r"--(?P<var>map|key|cast)\s*:\s*url\(\s*['\"]?data:image/jpeg;base64,(?P<data>[A-Za-z0-9+/=\s]+?)['\"]?\s*\)"
)

REPO_ROOT = Path(__file__).resolve().parent.parent

WM_TEXT = "Imagen generada con IA · AI-generated image"
# Geometry as fractions of the image width; mirrored by .wm in app/globals.css.
WM_FONT = 0.011  # text height (font size)
WM_PAD_X = 0.006
WM_PAD_Y = 0.003
WM_MARGIN = 0.006  # distance from the right and bottom edges
WM_FONTS = [
    "arialbd.ttf",  # Windows
    "Arial Bold.ttf",  # macOS
    "DejaVuSans-Bold.ttf",  # Linux
    "LiberationSans-Bold.ttf",
]


def load_font(size: int):
    from PIL import ImageFont

    for name in WM_FONTS:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size=size)


def watermark(jpeg: bytes) -> tuple[bytes, tuple[float, float]]:
    """Burn WM_TEXT into the bottom-right corner. Returns the new JPEG bytes and
    the label box size (width, height) as fractions of the image width."""
    from PIL import Image, ImageDraw

    src = Image.open(io.BytesIO(jpeg))
    w, h = src.size
    font = load_font(max(10, round(WM_FONT * w)))
    pad_x, pad_y, margin = round(WM_PAD_X * w), round(WM_PAD_Y * w), round(WM_MARGIN * w)
    l, t, r, b = font.getbbox(WM_TEXT)
    asc, desc = font.getmetrics()
    box_w, box_h = (r - l) + 2 * pad_x, asc + desc + 2 * pad_y
    x1, y1 = w - margin, h - margin
    x0, y0 = x1 - box_w, y1 - box_h

    overlay = Image.new("RGBA", src.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle((x0, y0, x1, y1), radius=round(box_h * 0.3), fill=(0, 0, 0, 165))
    d.text((x0 + pad_x - l, y0 + pad_y), WM_TEXT, font=font, fill=(255, 255, 255, 235))
    out_img = Image.alpha_composite(src.convert("RGBA"), overlay).convert("RGB")

    buf = io.BytesIO()
    # quality/subsampling "keep" reuse the source's quantisation tables and chroma
    # subsampling, so the re-encode does not lower the original quality.
    params = {"quality": "keep", "subsampling": "keep", "comment": WM_TEXT.encode("utf-8")}
    if src.info.get("icc_profile"):
        params["icc_profile"] = src.info["icc_profile"]
    if src.info.get("progressive"):
        params["progressive"] = True
    # "keep" needs the source JPEG's tables, so encode from an image that carries them.
    src.paste(out_img)
    src.save(buf, "JPEG", **params)
    return buf.getvalue(), (box_w / w, box_h / w)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("html", type=Path, help="Path to the prototype HTML file")
    parser.add_argument(
        "--out",
        type=Path,
        default=REPO_ROOT / "public" / "img",
        help="Output directory (default: <repo>/public/img)",
    )
    parser.add_argument("--no-watermark", action="store_true", help="Write the raw originals (no AI label)")
    args = parser.parse_args()

    if not args.html.is_file():
        print(f"error: HTML file not found: {args.html}", file=sys.stderr)
        return 1

    text = args.html.read_text(encoding="utf-8")
    found: dict[str, bytes] = {}
    for m in PATTERN.finditer(text):
        var = m.group("var")
        if var in found:
            continue
        raw = re.sub(r"\s+", "", m.group("data"))
        img = base64.b64decode(raw, validate=True)
        if not img.startswith(b"\xff\xd8"):
            print(f"error: --{var} does not decode to a JPEG", file=sys.stderr)
            return 1
        found[var] = img

    missing = [v for v in TARGETS if v not in found]
    if missing:
        print(f"error: missing CSS vars in HTML: {', '.join('--' + v for v in missing)}", file=sys.stderr)
        return 1

    args.out.mkdir(parents=True, exist_ok=True)
    for var, filename in TARGETS.items():
        dest = args.out / filename
        data = found[var]
        note = ""
        if not args.no_watermark:
            data, (bw, bh) = watermark(data)
            note = f", AI label {bw * 100:.2f}cqw x {bh * 100:.2f}cqw"
        dest.write_bytes(data)
        print(f"--{var:<4} -> {dest} ({len(found[var]):,} -> {len(data):,} bytes{note})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
