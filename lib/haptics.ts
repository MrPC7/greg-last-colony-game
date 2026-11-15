"use client";

/** Light haptic tap, when the device supports it and the player has not asked for reduced motion. */
export function haptic(pattern: number | number[]) {
  try {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    navigator.vibrate(pattern);
  } catch {
    // Vibration is a nice-to-have: ignore any browser refusal.
  }
}
