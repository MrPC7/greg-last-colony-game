"use client";

import { useEffect } from "react";
import { Portrait } from "@/components/ui/Portrait";
import Watermark from "@/components/ui/Watermark";
import { sfx } from "@/lib/audio";
import { RAY } from "@/lib/characters";
import { MEMORY_TXT, RAY_MEMORIES } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { useUI } from "@/lib/store";

/** Phase 5 · Ray's memory fragment cutscene: shown after each completed zone (`fresh`) and
 *  replayable from the inventory. The lines fade in one after the other (static with
 *  prefers-reduced-motion). The 6th memory reveals his origin. */
export default function RayMemory({ i, fresh }: { i: number; fresh?: boolean }) {
  const t = useT();
  const m = RAY_MEMORIES[i];
  const last = i === RAY_MEMORIES.length - 1;
  useEffect(() => {
    if (fresh) sfx("star");
  }, [fresh]);
  return (
    <div className="mem">
      <h3>{t(MEMORY_TXT.title, { icon: m.icon, i: i + 1, total: RAY_MEMORIES.length })}</h3>
      {fresh && <p className="s">{t(MEMORY_TXT.unlocked)}</p>}
      <div className="memv">
        <span className="wmp">
          <Portrait ch={RAY} />
          <Watermark compact />
        </span>
        <div>
          {m.lines.map((l, k) => (
            <p key={k} style={{ animationDelay: `${0.4 + k * 1.4}s` }}>{t(l)}</p>
          ))}
        </div>
      </div>
      <div className="pb"><i style={{ width: `${((i + 1) / RAY_MEMORIES.length) * 100}%` }} /></div>
      {last && <p className="memo"><b>{t(MEMORY_TXT.origin)}</b></p>}
      <button className="b" onClick={() => useUI.getState().closeModal()}>{t("common.continue")}</button>
    </div>
  );
}
