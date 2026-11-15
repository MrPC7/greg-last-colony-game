import type { Localized } from "./content/types";

// Ported from the prototype's `CH` table. Crop rectangles are [x, y, w, h] in the
// prototype's coordinate space of each sheet: cast.jpg = 1476×777, keyart.jpg = 1170×651.
// (The extracted JPEGs are resized but keep the same aspect ratio, so the fractional
// crops below line up exactly.)
export const CW = 1476;
export const CHT = 777;
const KW = 1170;
const KH = 651;

export type Sheet = "cast" | "key";
export type Rect = [number, number, number, number];

export type Character = {
  n: Localized;
  col: string;
  /** face crop (portraits) */
  f: Rect;
  /** full-body box on the cast sheet (input of scripts/make_sprites.py) */
  b?: Rect;
  /** sheet for the face crop; defaults to cast */
  im?: Sheet;
  /** transparent cut-out (public/img/sprites/<file>.webp|png, made by scripts/make_sprites.py
   *  from the `b` box): used on the map and, as a head-and-shoulders bust, in portraits */
  sp?: Sprite;
};

export type Sprite = {
  file: string;
  /** bust framing in a round portrait: head centre as a fraction of the sprite width, sprite
   *  height as a multiple of the portrait size, top offset in % of the portrait */
  fx: number;
  zoom: number;
  top: number;
};

export const CH: Character[] = [
  { n: { es: "Greg", en: "Greg" }, col: "#22b8cf", f: [55, 5, 195, 195], b: [0, 0, 365, 740], sp: { file: "greg", fx: 0.54, zoom: 2.3, top: 6 } },
  { n: { es: "Elen", en: "Elen" }, col: "#ff9800", f: [385, 75, 175, 175], b: [330, 75, 300, 670], sp: { file: "elen", fx: 0.46, zoom: 2.3, top: 6 } },
  { n: { es: "Orbi", en: "Orbi" }, col: "#ffd54a", f: [620, 200, 280, 280], b: [585, 200, 330, 555], sp: { file: "orbi", fx: 0.52, zoom: 2.1, top: 2 } },
  { n: { es: "Joseph", en: "Joseph" }, col: "#e53935", f: [935, 115, 170, 170], b: [905, 110, 265, 640], sp: { file: "joseph", fx: 0.44, zoom: 2.3, top: 6 } },
  { n: { es: "Sin Raíz", en: "Rootless" }, col: "#26c6da", f: [1185, 15, 140, 140], b: [1150, 15, 326, 725], sp: { file: "ray", fx: 0.32, zoom: 3, top: 6 } },
  { n: { es: "Reina Hueca", en: "Hollow Queen" }, col: "#ab47bc", f: [505, 0, 150, 150], im: "key" },
  // Phase 4: Ray, the Rootless one who shows NASA data (same art as CH[4]).
  { n: { es: "Ray, el Sin Raíz", en: "Ray, the Wanderer" }, col: "#26c6da", f: [1185, 15, 140, 140], b: [1150, 15, 326, 725], sp: { file: "ray", fx: 0.32, zoom: 3, top: 6 } },
];

/** Ray (El Sin Raíz / The Wanderer), host of the NASA data zone. */
export const RAY = 6;

/** Playable heroes (Orbi is the guide). */
export const PL = [0, 1, 3];
export const ORBI = 2;

/** Rival: Joseph, unless the hero is Joseph, then Greg (prototype `rv`). */
export const rival = (ch: number) => (ch === 3 ? 0 : 3);

/** Port of the prototype's `cr()`: background-size / background-position for a crop. */
export function crop(s: Rect, im: Sheet): { size: string; position: string } {
  const W = im === "key" ? KW : CW;
  const H = im === "key" ? KH : CHT;
  const x = s[0] / W;
  const w = s[2] / W;
  const y = s[1] / H;
  const h = s[3] / H;
  return {
    size: `${100 / w}% auto`,
    position: `${(x / (1 - w)) * 100}% ${(y / (1 - h)) * 100}%`,
  };
}
