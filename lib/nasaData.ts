"use client";

import { useEffect, useState } from "react";
import { asset } from "./asset";
import type { Lang } from "./content/types";

// Loaders for the NASA data files written by scripts/build_data.py (public/data/*.json).
// They are static files of this site, so the zone works offline once the page is cached.

export type Gistemp = {
  source: string;
  url: string;
  /** UTC date the CSV was downloaded (YYYY-MM-DD) */
  snapshot: string;
  baseline: string;
  data: { year: number; anomaly: number }[];
};

export type Firms = {
  source: string;
  url: string;
  snapshot: string;
  /** first and last acquisition date in the 24 h file */
  acq_dates: [string, string];
  total_detections: number;
  total_high_confidence: number;
  points: { lat: number; lon: number; brightness: number; date: string }[];
};

const cache = new Map<string, Promise<unknown>>();

function load<T>(file: string): Promise<T> {
  let p = cache.get(file);
  if (!p) {
    p = fetch(asset(`/data/${file}`)).then((r) => {
      if (!r.ok) throw new Error(`${file}: HTTP ${r.status}`);
      return r.json();
    });
    p.catch(() => cache.delete(file)); // allow a retry after a failure
    cache.set(file, p);
  }
  return p as Promise<T>;
}

type State<T> = { data: T | null; error: boolean };

/** Fetch a NASA data file once per page load. */
export function useNasaData<T>(file: "gistemp.json" | "firms.json"): State<T> {
  const [s, setS] = useState<State<T>>({ data: null, error: false });
  useEffect(() => {
    let live = true;
    load<T>(file).then(
      (data) => live && setS({ data, error: false }),
      () => live && setS({ data: null, error: true }),
    );
    return () => {
      live = false;
    };
  }, [file]);
  return s;
}

const locale = (lang: Lang) => (lang === "es" ? "es-PE" : "en-US");

/** "2026-11-14" → "14 nov 2026" / "Nov 14, 2026" (parsed as UTC, no timezone shift). */
export function fmtDate(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(locale(lang), { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Range of two ISO dates, collapsed when equal. */
export const fmtDateRange = (a: string, b: string, lang: Lang) =>
  a === b ? fmtDate(a, lang) : `${fmtDate(a, lang)} – ${fmtDate(b, lang)}`;

/** Signed number with locale decimals (es-PE / en-US): +1.28 / −0.18. */
export function fmtSigned(v: number, lang: Lang, digits = 2): string {
  const s = Math.abs(v).toLocaleString(locale(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return (v > 0 ? "+" : v < 0 ? "−" : "") + s;
}

export const fmtNum = (v: number, lang: Lang, digits = 0) =>
  v.toLocaleString(locale(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits });
