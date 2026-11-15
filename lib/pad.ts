"use client";

import { useSyncExternalStore } from "react";
import { useUI } from "./store";

// On-screen controls for phones (components/map/PhoneBar.tsx). The D-pad holds "virtual keys"
// that the map's movement loop (components/map/Stage.tsx) reads exactly like the arrow keys,
// and the action button does what E / Enter does. Input only: no game logic lives here.

/** Arrow keys held per touch/pointer (several fingers can hold the pad at once). */
const held = new Map<number, string[]>();

/** true while any pointer holds the virtual arrow key `k` ("ArrowUp", …). */
export function padHas(k: string) {
  for (const ks of held.values()) if (ks.includes(k)) return true;
  return false;
}

/** All virtual keys held right now (for the pressed look of the D-pad buttons). */
export function padKeys() {
  return new Set([...held.values()].flat());
}

/** Set (or, with an empty list, release) the keys held by pointer `id`. */
export function padSet(id: number, keys: string[]) {
  if (keys.length) held.set(id, keys);
  else held.delete(id);
}

export function padClear() {
  held.clear();
}

let enterFn: (() => void) | null = null;

// Whether the hero stands at a zone (so the Enter button can light up).
let near = false;
const subs = new Set<() => void>();
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};
export function setPadNear(v: boolean) {
  if (v === near) return;
  near = v;
  subs.forEach((f) => f());
}
export const usePadNear = () => useSyncExternalStore(subscribe, () => near, () => false);

/** The map registers what E / Enter does on it (enter the nearby zone). */
export function setPadEnter(fn: (() => void) | null) {
  enterFn = fn;
}

/** The "Entrar / Enter" button: same as pressing Enter — continue the dialogue if one is open,
 *  otherwise enter the zone the hero stands at (if any). */
export function padEnter() {
  const ui = useUI.getState();
  if (ui.talk) ui.advanceTalk();
  else enterFn?.();
}
