#!/usr/bin/env python3
"""Extract the embedded base64 JPEGs from the prototype HTML into public/img/.

The prototype defines three CSS custom properties holding data URLs:
  --map  -> public/img/map.jpg
  --key  -> public/img/keyart.jpg
  --cast -> public/img/cast.jpg

Usage:
  python scripts/extract_assets.py "../Greg and the Last Colony.html"
  python scripts/extract_assets.py <html> --out public/img
"""

from __future__ import annotations

import argparse
import base64
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


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("html", type=Path, help="Path to the prototype HTML file")
    parser.add_argument(
        "--out",
        type=Path,
        default=REPO_ROOT / "public" / "img",
        help="Output directory (default: <repo>/public/img)",
    )
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
        dest.write_bytes(found[var])
        print(f"--{var:<4} -> {dest} ({len(found[var]):,} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
