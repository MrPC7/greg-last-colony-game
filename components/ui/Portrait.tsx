import type { CSSProperties, Ref } from "react";
import { CH, crop, type Rect, type Sheet } from "@/lib/characters";

// Background-crop helpers (prototype `cr`, `fc`, `spr`). The sheets are exposed as the
// CSS variables --cast / --key on <body> (see app/layout.tsx, built with lib/asset.ts).

export function cropStyle(s: Rect, im: Sheet): CSSProperties {
  const c = crop(s, im);
  return {
    backgroundImage: `var(--${im})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: c.size,
    backgroundPosition: c.position,
  };
}

/** Face crop (prototype `fc`). */
export const faceStyle = (i: number): CSSProperties => cropStyle(CH[i].f, CH[i].im ?? "cast");

/** Full-body sprite crop (prototype `spr`). */
export function spriteStyle(i: number): CSSProperties {
  const b = CH[i].b ?? CH[i].f;
  return { aspectRatio: (b[2] / b[3]).toFixed(3), ...cropStyle(b, "cast") };
}

/** Round portrait with the character's colour ring (prototype `.pt`). */
export function Portrait({
  ch,
  style,
  id,
  ref,
}: {
  ch: number;
  style?: CSSProperties;
  id?: string;
  ref?: Ref<HTMLDivElement>;
}) {
  return <div ref={ref} id={id} className="pt" style={{ ...faceStyle(ch), borderColor: CH[ch].col, ...style }} />;
}
