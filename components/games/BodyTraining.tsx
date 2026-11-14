"use client";

import { useState } from "react";
import { sfx } from "@/lib/audio";
import { BODY, BODY_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

const mark = (ok: boolean) => (ok ? "✅" : "⚠️");

/** Prototype `body` / `bv` / `bup` / `bok`: plan a 24 h day (3 h fixed). Balanced if
 *  sleep ≥ 7, exercise ≥ 2, work ≥ 6 and free time ≥ 2 → 3 ★ (activity "body"). */
export default function BodyTraining() {
  const t = useT();
  const [s, setS] = useState(BODY.sleep.v0);
  const [e, setE] = useState(BODY.exercise.v0);
  const [w, setW] = useState(BODY.work.v0);
  const [msg, setMsg] = useState<boolean | null>(null);
  const f = 24 - BODY.fixed - s - e - w;

  const confirm = () => {
    if (s >= BODY.sleep.need && e >= BODY.exercise.need && w >= BODY.work.need && f >= BODY.freeNeed) {
      awardWin("body", 3);
      sfx("ok");
      setMsg(true);
    } else {
      sfx("bad");
      setMsg(false);
    }
  };

  const slider = (
    label: typeof BODY_TXT.sleep,
    id: string,
    r: { min: number; max: number; step: number },
    val: number,
    set: (n: number) => void,
  ) => (
    <label>
      {t(label)} <b>{val}</b> {t(BODY_TXT.hours)}
      <input type="range" id={id} min={r.min} max={r.max} step={r.step} value={val} onChange={(ev) => set(+ev.target.value)} />
    </label>
  );

  return (
    <>
      <h3>{t(BODY_TXT.title)}</h3>
      <p className="s">{t(BODY_TXT.desc)}</p>
      {slider(BODY_TXT.sleep, "bs1", BODY.sleep, s, setS)}
      {slider(BODY_TXT.exercise, "be", BODY.exercise, e, setE)}
      {slider(BODY_TXT.work, "bw", BODY.work, w, setW)}
      <div id="bl" className="s">
        {t(BODY_TXT.checks, {
          a: mark(s >= BODY.sleep.need),
          b: mark(e >= BODY.exercise.need),
          c: mark(w >= BODY.work.need),
          d: mark(f >= BODY.freeNeed),
          f,
        })}
      </div>
      <button className="b" onClick={confirm}>{t(BODY_TXT.confirm)}</button>
      <p id="fb">{msg === null ? null : t(msg ? BODY_TXT.ok : BODY_TXT.bad)}</p>
    </>
  );
}
