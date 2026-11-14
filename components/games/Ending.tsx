"use client";

import { useState } from "react";
import { Portrait } from "@/components/ui/Portrait";
import Watermark from "@/components/ui/Watermark";
import { sfx } from "@/lib/audio";
import { ENDING, ENDING_TXT } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { resolveSpeaker, useGame, useUI } from "@/lib/store";

/** Phase 6 · Ending cutscene: shown after the Hollow Queen falls (and replayable from the main
 *  mission). Scene by scene — the Queen's voice fades, Ray reveals his origin, the Rootless go
 *  home, the colony is saved, Ray's real-data message, end of Chapter 1 — with the characters'
 *  portraits and lines that fade in (static with prefers-reduced-motion). The last scene leads
 *  to the certificate. */
export default function Ending() {
  const t = useT();
  const hero = useGame((s) => s.character);
  const [i, setI] = useState(0);
  const scene = ENDING[i];
  const last = i === ENDING.length - 1;

  const go = (k: number) => {
    sfx(k === ENDING.length - 1 ? "star" : "click");
    setI(k);
  };
  const toCertificate = () => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.openModal({ kind: "certificate" });
  };

  return (
    <div className="mem end">
      <p className="s">{t(ENDING_TXT.scene, { i: i + 1, total: ENDING.length })}</p>
      <h3>{t(scene.title)}</h3>
      {/* key: replay the fade-in on every scene */}
      <div key={i} className="memv">
        <div className="endc">
          {scene.chars.map((c, k) => (
            <span key={k} className="wmp">
              <Portrait ch={resolveSpeaker(c, hero)} />
              <Watermark compact />{/* every portrait is a crop of AI art */}
            </span>
          ))}
        </div>
        <div>
          {scene.lines.map((l, k) => (
            <p key={k} style={{ animationDelay: `${0.3 + k * 1.2}s` }}>{t(l)}</p>
          ))}
        </div>
      </div>
      <div className="pb"><i style={{ width: `${((i + 1) / ENDING.length) * 100}%` }} /></div>
      {last ? (
        <>
          <p className="memo"><b>{t(ENDING_TXT.done)}</b></p>
          <button className="b o" id="ecert" onClick={toCertificate}>{t(ENDING_TXT.cert)}</button>{" "}
          <button className="b" onClick={() => useUI.getState().closeModal()}>{t(ENDING_TXT.back)}</button>
        </>
      ) : (
        <>
          <button className="b" id="enext" onClick={() => go(i + 1)}>{t(ENDING_TXT.next)}</button>{" "}
          <button className="b o" onClick={() => go(ENDING.length - 1)}>{t(ENDING_TXT.skip)}</button>
        </>
      )}
    </div>
  );
}
