"use client";

import { useCallback } from "react";
import { CH } from "./characters";
import type { Lang, Localized } from "./content/types";
import { UI } from "./content/ui";
import { useGame } from "./store";

export type { Lang, Localized };
export type UIKey = keyof typeof UI;
/** Anything t() accepts: a UI dictionary key, a content {es, en} pair, or several joined by a space. */
export type Text = UIKey | Localized | Localized[];
export type Vars = Record<string, string | number>;

export const LANGS: Lang[] = ["es", "en"];

/** Browser default: Spanish if navigator.language starts with "es", else English. */
export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "es";
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export function translate(lang: Lang, k: Text, vars?: Vars): string {
  const s = Array.isArray(k)
    ? k.map((x) => x[lang]).join(" ")
    : (typeof k === "string" ? UI[k] : k)[lang];
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, v: string) => (v in vars ? String(vars[v]) : m));
}

/** The active language: the saved choice, or the browser default before the first choice. */
export function useLang(): Lang {
  const lang = useGame((s) => s.lang);
  return lang ?? detectLang();
}

/** t(key | {es,en}, vars) — `{n}` defaults to the current hero's name. */
export function useT() {
  const lang = useLang();
  const hero = useGame((s) => s.character);
  return useCallback(
    (k: Text, vars?: Vars) => translate(lang, k, { n: CH[hero].n[lang], ...vars }),
    [lang, hero],
  );
}
