"use client";

import { useEffect } from "react";
import { CH } from "@/lib/characters";
import { useT } from "@/lib/i18n";
import { resolveSpeaker, useGame, useUI } from "@/lib/store";
import { Portrait } from "./Portrait";
import Watermark from "./Watermark";

/** Prototype `talk()` bubble: portrait + name + line; tap / Enter / Space to continue. */
export default function SpeechBubble() {
  const t = useT();
  const talk = useUI((s) => s.talk);
  const advance = useUI((s) => s.advanceTalk);
  const hero = useGame((s) => s.character);
  const open = !!talk;

  useEffect(() => {
    if (!open) return;
    // Capture phase so it runs before the map's key handler (which skips prevented events).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        useUI.getState().advanceTalk();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);

  if (!talk) return null;
  const [who, text] = talk.lines[talk.i];
  const ci = resolveSpeaker(who, hero);
  const c = CH[ci];
  return (
    <div id="bub" role="button" tabIndex={0} aria-live="polite" onClick={advance}>
      <span className="wmp">
        <Portrait id="bp" ch={ci} />
        <Watermark compact />
      </span>
      <div>
        <b id="bn" style={{ color: c.col }}>{t(c.n)}</b>
        <p id="btx">{t(text)}</p>
        <span className="s">{t("bubble.continue")}</span>
      </div>
    </div>
  );
}
