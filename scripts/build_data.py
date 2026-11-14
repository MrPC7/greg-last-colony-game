#!/usr/bin/env python3
"""Build the NASA data files for the "La Señal de Ray" zone (Phase 4).

Downloads two public NASA datasets and writes small JSON files the game reads
offline from public/data/ (run once, commit the output):

  1. NASA GISTEMP v4 — global annual land-ocean temperature anomaly (°C, vs 1951–1980)
     https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv
     -> public/data/gistemp.json : {"source", "url", "snapshot", "baseline",
                                    "data": [{"year", "anomaly"}, ...]}
     Uses the "J-D" (January–December) column, 1880 -> latest complete year
     (the current year is skipped while its J-D value is still "***").

  2. NASA FIRMS — MODIS Collection 6.1 active fires, global, last 24 hours
     https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_Global_24h.csv
     -> public/data/firms.json : {"source", "url", "snapshot", "acq_dates",
                                  "total_high_confidence", "points": [{"lat", "lon", "brightness", "date"}, ...]}
     Keeps only high-confidence detections (confidence >= 80) and takes a
     reproducible random sample of SAMPLE_SIZE of them. A uniform sample keeps
     the share of fires per continent, which is what the FireMap game asks about.

"snapshot" is the UTC date the CSV was downloaded.

Each CSV is also saved to scripts/raw/ (git-ignored). If a download fails, the
script stops and prints the URL; download that CSV by hand, place it in
scripts/raw/ with the file name shown, and run again with --offline.

Standard library only (no pip installs).

Usage:
  python scripts/build_data.py              # download + build
  python scripts/build_data.py --offline    # build from scripts/raw/*.csv
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import random
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "scripts" / "raw"
OUT = ROOT / "public" / "data"

GISTEMP_URL = "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv"
GISTEMP_RAW = "GLB.Ts+dSST.csv"
FIRMS_URL = (
    "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/"
    "MODIS_C6_1_Global_24h.csv"
)
FIRMS_RAW = "MODIS_C6_1_Global_24h.csv"

SAMPLE_SIZE = 300
MIN_CONFIDENCE = 80  # MODIS confidence is 0–100; >= 80 is "high"
SEED = 2026


def fetch(url: str, name: str, offline: bool) -> tuple[str, str]:
    """Return (csv text, snapshot date). Saves downloads to scripts/raw/<name>."""
    path = RAW / name
    if offline:
        if not path.exists():
            sys.exit(f"Missing {path}. Download {url} and save it there.")
        mtime = datetime.fromtimestamp(path.stat().st_mtime, timezone.utc)
        return path.read_text(encoding="utf-8"), mtime.date().isoformat()
    print(f"Downloading {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "build_data.py (educational game data prep)"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            if r.status != 200:
                raise OSError(f"HTTP {r.status}")
            body = r.read().decode("utf-8")
    except Exception as e:  # noqa: BLE001 — any failure means "download by hand"
        sys.exit(
            f"\nDOWNLOAD FAILED: {url}\n  ({e})\n"
            f"Download it manually, save it as {path}, then run:\n"
            f"  python scripts/build_data.py --offline"
        )
    RAW.mkdir(parents=True, exist_ok=True)
    path.write_text(body, encoding="utf-8")
    return body, datetime.now(timezone.utc).date().isoformat()


def build_gistemp(text: str, snapshot: str) -> dict:
    lines = text.splitlines()
    # First line is a title ("Land-Ocean: Global Means"); the header starts with "Year".
    start = next(i for i, l in enumerate(lines) if l.startswith("Year,"))
    data = []
    for row in csv.DictReader(io.StringIO("\n".join(lines[start:]))):
        year, jd = row.get("Year", ""), (row.get("J-D") or "").strip()
        if not year.isdigit() or not jd or "*" in jd:
            continue  # incomplete (current) year
        data.append({"year": int(year), "anomaly": round(float(jd), 2)})
    if not data or data[0]["year"] != 1880:
        sys.exit("Unexpected GISTEMP format: first year is not 1880.")
    years = [d["year"] for d in data]
    if years != list(range(years[0], years[-1] + 1)):
        sys.exit("Unexpected GISTEMP format: missing years.")
    return {
        "source": "NASA GISTEMP v4 — Global Land-Ocean Temperature Index (J-D annual mean)",
        "url": GISTEMP_URL,
        "snapshot": snapshot,
        "baseline": "1951-1980",
        "data": data,
    }


def build_firms(text: str, snapshot: str) -> dict:
    rows = list(csv.DictReader(io.StringIO(text)))
    if not rows or not {"latitude", "longitude", "brightness", "acq_date", "confidence"} <= rows[0].keys():
        sys.exit("Unexpected FIRMS format (expected MODIS columns).")
    high = [r for r in rows if r["confidence"].strip().isdigit() and int(r["confidence"]) >= MIN_CONFIDENCE]
    if len(high) < SAMPLE_SIZE:
        sys.exit(f"Only {len(high)} high-confidence fires in the file; expected at least {SAMPLE_SIZE}.")
    sample = random.Random(SEED).sample(high, SAMPLE_SIZE)
    points = sorted(
        (
            {
                "lat": round(float(r["latitude"]), 3),
                "lon": round(float(r["longitude"]), 3),
                "brightness": round(float(r["brightness"]), 1),
                "date": r["acq_date"],
            }
            for r in sample
        ),
        key=lambda p: (p["date"], p["lon"]),
    )
    dates = sorted({r["acq_date"] for r in rows})
    return {
        "source": "NASA FIRMS — MODIS Collection 6.1 active fires, global, last 24 h (confidence >= 80)",
        "url": FIRMS_URL,
        "snapshot": snapshot,
        "acq_dates": [dates[0], dates[-1]],
        "total_detections": len(rows),
        "total_high_confidence": len(high),
        "points": points,
    }


def write(name: str, obj: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    path.write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Wrote {path.relative_to(ROOT)} ({path.stat().st_size:,} bytes)")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--offline", action="store_true", help="use scripts/raw/*.csv instead of downloading")
    args = ap.parse_args()

    text, snap = fetch(GISTEMP_URL, GISTEMP_RAW, args.offline)
    g = build_gistemp(text, snap)
    print(f"  GISTEMP: {g['data'][0]['year']}–{g['data'][-1]['year']}, snapshot {snap}")

    text, snap = fetch(FIRMS_URL, FIRMS_RAW, args.offline)
    f = build_firms(text, snap)
    print(f"  FIRMS: {f['total_high_confidence']:,} high-confidence of {f['total_detections']:,}; "
          f"kept {len(f['points'])}; acquired {f['acq_dates'][0]}..{f['acq_dates'][1]}, snapshot {snap}")

    write("gistemp.json", g)
    write("firms.json", f)


if __name__ == "__main__":
    main()
