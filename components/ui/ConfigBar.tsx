"use client";

import { useLang, useT } from "@/lib/i18n";
import { useGame, useUI, type Theme } from "@/lib/store";

const THEME_ICON: Record<Theme, string> = { auto: "🌓", light: "☀️", dark: "🌙" };
const NEXT_THEME: Record<Theme, Theme> = { auto: "dark", dark: "light", light: "auto" };

/** Prototype `#cfg` (🌐 / 🎵 / 🔊), plus theme and settings. Shown on every screen. */
export default function ConfigBar() {
  const t = useT();
  const lang = useLang();
  const { musicOn, sfxOn, theme, setLang, toggleMusic, toggleSfx, setTheme } = useGame();
  return (
    <div id="cfg">
      <button id="lg" onClick={() => setLang(lang === "en" ? "es" : "en")} aria-label={t("lang.toggle")}>
        🌐 {lang.toUpperCase()}
      </button>
      <button id="bm" onClick={toggleMusic} aria-label={t("cfg.music")} aria-pressed={musicOn} style={{ opacity: musicOn ? 1 : 0.4 }}>🎵</button>
      <button id="bs" onClick={toggleSfx} aria-label={t("cfg.sound")} aria-pressed={sfxOn} style={{ opacity: sfxOn ? 1 : 0.4 }}>🔊</button>
      <button id="bth"onClick={() => setTheme(NEXT_THEME[theme])} aria-label={`${t("cfg.theme")}: ${t(`theme.${theme}`)}`}>{THEME_ICON[theme]}</button>
      <button id="bg" onClick={() => useUI.getState().openModal({ kind: "settings" })} aria-label={t("cfg.settings")}>⚙️</button>
    </div>
  );
}
