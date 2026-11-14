// Shared content types. Kept dependency-free so scripts/check_i18n.ts can import
// content files directly with Node's TypeScript type stripping.

export type Lang = "es" | "en";

/** A string in both languages, side by side. Every player-visible text uses this. */
export type Localized = { es: string; en: string };

/** Who speaks a dialogue line: a CH index, "H" = the player's hero, "R" = the rival. */
export type Speaker = number | "H" | "R";

/** One speech-bubble line. An array of texts is joined with a space. */
export type Line = [Speaker, Localized | Localized[]];
