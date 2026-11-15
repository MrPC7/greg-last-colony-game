import type { CSSProperties, Ref } from "react";
import { asset } from "@/lib/asset";
import { CH, crop, type Rect, type Sheet } from "@/lib/characters";

// Background-crop helpers (prototype `cr`, `fc`). The sheets are exposed as the
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

/** Transparent character cut-out (scripts/make_sprites.py): WebP with a PNG fallback.
 *  Decorative (alt=""): the character's name is always shown next to it. */
export function SpriteImg({ file, className, style }: { file: string; className?: string; style?: CSSProperties }) {
  return (
    <picture>
      <source srcSet={asset(`/img/sprites/${file}.webp`)} type="image/webp" />
      <img src={asset(`/img/sprites/${file}.png`)} alt="" draggable={false} decoding="async" className={className} style={style} />
    </picture>
  );
}

/** Round portrait with the character's colour ring (prototype `.pt`). Characters with a
 *  cut-out sprite get a head-and-shoulders bust on a soft gradient in their colour (no
 *  leftover painted background); the others keep the face crop of their sheet. */
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
  const c = CH[ch];
  if (!c.sp) return <div ref={ref} id={id} className="pt" style={{ ...faceStyle(ch), borderColor: c.col, ...style }} />;
  const { file, fx, zoom, top } = c.sp;
  return (
    <div ref={ref} id={id} className="pt pts" style={{ "--c": c.col, borderColor: c.col, ...style } as CSSProperties}>
      <SpriteImg file={file} style={{ height: `${zoom * 100}%`, top: `${top}%`, translate: `${-fx * 100}% 0` }} />
    </div>
  );
}
