"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./map.module.css";

/** Size of map.jpg in px: every box below is measured on it and converted to % of the stage. */
export const MAP_W = 1400;
export const MAP_H = 785;

/** [left, top, right, bottom] in map.jpg pixels. */
export type Box = readonly [number, number, number, number];

const pct = (v: number) => `${+v.toFixed(3)}%`;

/** Absolute position of `b` in % of `outer` (the stage when omitted). */
export function place(b: Box, outer: Box = [0, 0, MAP_W, MAP_H]): CSSProperties {
  const [ol, ot, or, ob] = outer;
  return {
    left: pct(((b[0] - ol) / (or - ol)) * 100),
    top: pct(((b[1] - ot) / (ob - ot)) * 100),
    width: pct(((b[2] - b[0]) / (or - ol)) * 100),
    height: pct(((b[3] - b[1]) / (ob - ot)) * 100),
  };
}

/** A window onto the map art at `at`: shows the painted icon itself (identical look in ES and EN)
 *  on top of the HTML panel that hides the painted Spanish text. Placed in % of `panel`. */
export function MapIcon({ at, panel }: { at: Box; panel: Box }) {
  const w = at[2] - at[0];
  const h = at[3] - at[1];
  return (
    <span
      aria-hidden
      className={styles.mic}
      style={{
        ...place(at, panel),
        backgroundSize: `${pct((MAP_W / w) * 100)} ${pct((MAP_H / h) * 100)}`,
        backgroundPosition: `${pct((at[0] / (MAP_W - w)) * 100)} ${pct((at[1] / (MAP_H - h)) * 100)}`,
      }}
    />
  );
}

/** Window onto a full-screen scene image (W×H px, shown by `className`'s background) at `at`,
 *  in % of the stage: the painted icon or picture itself, feathered into the HTML panel under it.
 *  Used by the briefing and the Moon scene (Briefing.tsx, MoonScene.tsx). */
export function ArtWindow({ at, w: W, h: H, className }: { at: Box; w: number; h: number; className: string }) {
  const w = at[2] - at[0];
  const h = at[3] - at[1];
  return (
    <span
      aria-hidden
      className={className}
      style={{
        ...place(at, [0, 0, W, H]),
        backgroundSize: `${pct((W / w) * 100)} ${pct((H / h) * 100)}`,
        backgroundPosition: `${pct((at[0] / (W - w)) * 100)} ${pct((at[1] / (H - h)) * 100)}`,
      }}
    />
  );
}

/** Shrink the font (CSS var --fit, 0–1) until the content fits the box, in both directions. */
function fit(el: HTMLElement | null) {
  if (!el) return;
  el.style.setProperty("--fit", "1");
  let f = 1;
  for (let i = 0; i < 5; i++) {
    const r = Math.min(el.clientWidth / el.scrollWidth, el.clientHeight / el.scrollHeight);
    if (!(r < 1)) return;
    f *= r * 0.97;
    el.style.setProperty("--fit", f.toFixed(3));
  }
}

/** Text box at `at` (in % of `panel`) whose font auto-shrinks so the text never overflows. */
export function FitText({ at, panel, className, children }: { at: Box; panel: Box; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Re-fit after every render (language change, new text) and whenever the box is resized.
  useLayoutEffect(() => fit(ref.current));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => fit(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={ref} className={`${styles.ft} ${className ?? ""}`} style={place(at, panel)}>
      {children}
    </span>
  );
}

/** Painted zone label (icon + title + subtitle) re-drawn in HTML. */
export type ZoneLabelGeo = { panel: Box; icon: Box; text: Box };

/** Painted zone labels in map.jpg (the observatory dome has none). Panels are measured slightly
 *  outside the painted glow border so it is fully hidden. */
export const ZONE_LABELS: Partial<Record<string, ZoneLabelGeo>> = {
  aulas: { panel: [302, 159, 496, 219], icon: [314, 163, 358, 207], text: [362, 164, 488, 214] },
  lab: { panel: [1062, 216, 1280, 277], icon: [1073, 221, 1111, 272], text: [1115, 221, 1272, 272] },
  cancha: { panel: [130, 314, 350, 377], icon: [138, 322, 183, 370], text: [187, 319, 342, 372] },
  verdes: { panel: [574, 459, 770, 521], icon: [585, 465, 628, 506], text: [632, 464, 762, 516] },
  aud: { panel: [1026, 439, 1220, 501], icon: [1044, 447, 1078, 496], text: [1082, 444, 1212, 496] },
};

export function ZoneLabel({ geo, title, sub, onSelect }: { geo: ZoneLabelGeo; title: string; sub: string; onSelect: () => void }) {
  return (
    <button data-ui className={styles.zl} style={place(geo.panel)} onClick={onSelect}>
      <MapIcon at={geo.icon} panel={geo.panel} />
      <FitText at={geo.text} panel={geo.panel}>
        <b>{title}</b>
        <small>{sub}</small>
      </FitText>
    </button>
  );
}
