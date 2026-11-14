"use client";

import { useState } from "react";
import { sfx } from "@/lib/audio";
import { TL, TL_SHOW, TL_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

type Msg = "win" | "winReplay" | "wrong" | null;

/** Prototype `aud` / `tt`: tap the 4 missions (shown shuffled as TL_SHOW) from oldest to newest.
 *  A right tap turns green and reveals the year; a wrong one shows a hint. All 4 → 3 ★ (activity "aud"). */
export default function MissionTimeline() {
  const t = useT();
  const [ord, setOrd] = useState(0);
  const [msg, setMsg] = useState<Msg>(null);

  const tap = (i: number) => {
    if (ord >= TL.length) return; // finished: keep the success message
    if (i === ord) {
      const next = ord + 1;
      setOrd(next);
      setMsg(next === TL.length ? (awardWin("aud", 3) ? "win" : "winReplay") : null);
      sfx("ok");
    } else {
      setMsg("wrong");
      sfx("bad");
    }
  };

  return (
    <>
      <h3>{t(TL_TXT.title)}</h3>
      <p className="s">{t(TL_TXT.desc)}</p>
      {TL_SHOW.map((i) => (
        <button key={i} className={"op" + (i < ord ? " ok" : "")} id={"t" + i} onClick={() => tap(i)}>
          {i < ord ? t(TL_TXT.placed, { year: TL[i].year, text: t(TL[i].text) }) : t(TL[i].text)}
        </button>
      ))}
      <div id="tm2" className="s">{msg && t(TL_TXT[msg])}</div>
    </>
  );
}
