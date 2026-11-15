"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import Hud from "@/components/map/Hud";
import { useLang, useT } from "@/lib/i18n";
import { useGame, useUI, type Theme } from "@/lib/store";
import FullscreenButton from "./FullscreenButton";

const THEME_ICON: Record<Theme, string> = { auto: "🌓", light: "☀️", dark: "🌙" };
const NEXT_THEME: Record<Theme, Theme> = { auto: "dark", dark: "light", light: "auto" };

/** Prototype `#cfg` (🌐 / 🎵 / 🔊), plus theme and settings. Shown on every screen.
 *  On the map it also holds the compact HUD, which CSS shows only on screens ≤ 820px. */
export default function ConfigBar() {
  const t = useT();
  const lang = useLang();
  const onMap = usePathname().startsWith("/play");
  const { musicOn, sfxOn, theme, setLang, toggleMusic, toggleSfx, setTheme } = useGame();
  const modalOpen = useUI((s) => !!s.modal);
  const slot = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);

  // Publish the bar's height (--cfgh) so the phone-landscape map can fill the rest of the screen.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--cfgh", el.offsetHeight + "px"));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // While a modal is open, the buttons float above its backdrop (#md, z-index 9) so language,
  // sound, theme and settings stay usable. They are pinned exactly where they sit in the row
  // (or at the top edge if the page is scrolled), and the slot keeps its size so nothing shifts.
  useLayoutEffect(() => {
    const sl = slot.current;
    const b = bar.current;
    if (!sl || !b || !modalOpen) return;
    const place = () => {
      sl.style.width = sl.style.height = "";
      b.classList.remove("lift");
      b.style.top = b.style.right = "";
      const r = sl.getBoundingClientRect();
      sl.style.width = r.width + "px";
      sl.style.height = r.height + "px";
      b.style.top = `max(${r.top}px, calc(env(safe-area-inset-top, 0px) + 6px))`;
      b.style.right = document.documentElement.clientWidth - r.right + "px";
      b.classList.add("lift");
    };
    place();
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      sl.style.width = sl.style.height = "";
      b.classList.remove("lift");
      b.style.top = b.style.right = "";
    };
  }, [modalOpen]);

  return (
    <div id="cfg" ref={row}>
      {onMap && <Hud bar />}
      <div className="cfgs" ref={slot}>
      <div className="cfgb" ref={bar}>
        <FullscreenButton />
        <button id="lg" onClick={() => setLang(lang === "en" ? "es" : "en")} aria-label={`${lang.toUpperCase()} · ${t("lang.toggle")}`}>
          🌐 {lang.toUpperCase()}
        </button>
        <button id="bm" onClick={toggleMusic} aria-label={t("cfg.music")} aria-pressed={musicOn} style={{ opacity: musicOn ? 1 : 0.4 }}>🎵</button>
        <button id="bs" onClick={toggleSfx} aria-label={t("cfg.sound")} aria-pressed={sfxOn} style={{ opacity: sfxOn ? 1 : 0.4 }}>🔊</button>
        <button id="bth" onClick={() => setTheme(NEXT_THEME[theme])} aria-label={`${t("cfg.theme")}: ${t(`theme.${theme}`)}`}>{THEME_ICON[theme]}</button>
        <button id="bg" onClick={() => useUI.getState().openModal({ kind: "settings" })} aria-label={t("cfg.settings")}>⚙️</button>
      </div>
      </div>
    </div>
  );
}
