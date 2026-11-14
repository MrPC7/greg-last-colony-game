"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { setMusicOn, setSfxOn, unlock } from "@/lib/audio";
import { translate, useLang } from "@/lib/i18n";
import { useGame } from "@/lib/store";
import ConfigBar from "./ConfigBar";
import LanguagePicker from "./LanguagePicker";
import ModalHost from "./Modal";
import SpeechBubble from "./SpeechBubble";

const subscribeHydration = (cb: () => void) => useGame.persist.onFinishHydration(cb);
const getHydrated = () => useGame.persist.hasHydrated();
const getServerHydrated = () => false;

/** Restores the saved game from localStorage, then renders the app plus the global
 *  overlays (config bar, modal, speech bubble, first-launch language picker). */
export default function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeHydration, getHydrated, getServerHydrated);

  useEffect(() => {
    void useGame.persist.rehydrate();
  }, []);

  if (!hydrated) return null;
  return (
    <>
      <Sync />
      <ConfigBar />
      {children}
      <SpeechBubble />
      <ModalHost />
      <LanguagePicker />
    </>
  );
}

/** Side effects that mirror the store onto the document and the audio engine. */
function Sync() {
  const lang = useLang();
  const theme = useGame((s) => s.theme);
  const musicOn = useGame((s) => s.musicOn);
  const sfxOn = useGame((s) => s.sfxOn);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translate(lang, "app.title");
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "auto") delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [theme]);

  useEffect(() => setMusicOn(musicOn), [musicOn]);
  useEffect(() => setSfxOn(sfxOn), [sfxOn]);

  useEffect(() => {
    // Browsers only allow audio after a gesture: create the AudioContext on the first one.
    const onGesture = () => unlock();
    // Prototype: "m" toggles music anywhere.
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey && !e.altKey) useGame.getState().toggleMusic();
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
