"use client";

import { useEffect, useRef, useState } from "react";
import { cropStyle } from "@/components/ui/Portrait";
import HintButton from "@/components/ui/HintButton";
import Watermark from "@/components/ui/Watermark";
import { music, sfx } from "@/lib/audio";
import { CH } from "@/lib/characters";
import { BOSS, BOSS_ALLIES, BOSS_TXT, BQ, type QuizQuestion } from "@/lib/content/games";
import { BOSS_LOSE_TALK, BOSS_WIN_TALK } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { awardWin, useGame, useUI } from "@/lib/store";

/** Prototype `B`: hero hp, queen hp, turn, shuffled questions, unused allies, shield, streak. */
type Fight = { h: number; q: number; i: number; o: QuizQuestion[]; a: [boolean, boolean, boolean]; sh: boolean; streak: number };
/** One turn (prototype re-renders the modal each turn, which resets all of this). */
type Turn = { picked: number | null; msg: keyof typeof BOSS_TXT | null; removed: number | null; ally: "hint" | "shield" | null };

const freshTurn = (): Turn => ({ picked: null, msg: null, removed: null, ally: null });
const newFight = (): Fight => ({
  h: BOSS.hp,
  q: BOSS.hp,
  i: 0,
  o: BQ.slice().sort(() => Math.random() - 0.5),
  a: [true, true, true],
  sh: false,
  streak: 0,
});

/** Prototype `bend`: close the fight, then the ending dialogue and its result panel. */
function endFight(won: boolean) {
  music("explore");
  sfx(won ? "win" : "lose");
  const ui = useUI.getState();
  ui.closeModal();
  if (won) {
    awardWin("boss", BOSS.stars);
    ui.startTalk(BOSS_WIN_TALK, () => useUI.getState().openModal({ kind: "bossWin" }));
  } else {
    ui.startTalk(BOSS_LOSE_TALK, () => useUI.getState().openModal({ kind: "bossLose" }));
  }
}

/** Prototype `fight` / `bturn` / `ba` / `ally` (+ the streak/critical/shake upgrade): a quiz duel
 *  over BQ. Right answer −25 to the Queen (every 3rd in a row: critical −50); wrong answer −25 to
 *  you unless a shield is up. Three one-use allies: Orbi removes a wrong option, the first friend
 *  gives the explanation as a hint, the second raises a shield. Queen at 0 → win (5 ★, "boss"). */
export default function BossFight() {
  const t = useT();
  const hero = useGame((s) => s.character);
  const [f, setF] = useState(newFight);
  const [turn, setTurn] = useState(freshTurn);
  const shake = useRef<HTMLDivElement>(null);

  // Battle music while the fight is open (prototype `fight`), back to exploring when it closes.
  useEffect(() => {
    music("battle");
    return () => music("explore");
  }, []);

  const q = f.o[f.i % f.o.length];
  const al = BOSS_ALLIES.filter((x) => x !== hero);
  const locked = turn.picked !== null;

  const answer = (j: number) => {
    if (locked) return;
    const n = { ...f };
    let msg: Turn["msg"];
    if (j === q.answer) {
      n.streak++;
      const crit = n.streak % BOSS.streak === 0;
      n.q -= crit ? BOSS.crit : BOSS.hit;
      msg = crit ? "critMsg" : "hitMsg";
      sfx(crit ? "crit" : "hit");
    } else {
      n.streak = 0;
      if (n.sh) {
        n.sh = false;
        msg = "blocked";
        sfx("shield");
      } else {
        n.h -= BOSS.hit;
        msg = "counter";
        sfx("qhit");
      }
    }
    setF(n);
    setTurn({ ...turn, picked: j, msg, ally: null });
    // Restart the shake animation (prototype: remove class, reflow, add).
    const el = shake.current;
    if (el) {
      el.classList.remove("shk");
      void el.offsetWidth;
      el.classList.add("shk");
    }
  };

  const ally = (k: 0 | 1 | 2) => {
    if (!f.a[k] || locked) return;
    const a: Fight["a"] = [...f.a];
    a[k] = false;
    if (k === 0) {
      setF({ ...f, a });
      setTurn({ ...turn, removed: [0, 1, 2].filter((x) => x !== q.answer)[0] });
    } else if (k === 1) {
      setF({ ...f, a });
      setTurn({ ...turn, ally: "hint" });
    } else {
      setF({ ...f, a, sh: true });
      setTurn({ ...turn, ally: "shield" });
    }
  };

  const next = () => {
    if (f.q <= 0) return endFight(true);
    if (f.h <= 0) return endFight(false);
    sfx("click"); // prototype re-opens the modal for every turn
    setF({ ...f, i: f.i + 1 });
    setTurn(freshTurn());
  };

  return (
    <div ref={shake}>
      <h3>{t(BOSS_TXT.title)}</h3>
      <div
        className="wmb"
        role="img"
        aria-label={t(BOSS_TXT.art)}
        style={{ position: "relative", aspectRatio: 2.2, ...cropStyle([350, 0, 470, 215], "key"), borderRadius: 10 }}
      >
        <Watermark compact />
      </div>
      <div className="s">{t(BOSS_TXT.queen)}</div>
      <div className="bar2" style={{ width: Math.max(0, f.q) + "%", background: "#ab47bc" }} />
      <div className="s">{t(CH[hero].n)}</div>
      <div className="bar2" style={{ width: Math.max(0, f.h) + "%" }} />
      <p><b>{t(q.q)}</b></p>
      {q.options.map((o, j) => (
        <button
          key={j}
          id={"o" + j}
          className={"op" + (!locked ? "" : j === q.answer ? " ok" : j === turn.picked ? " no" : "")}
          style={turn.removed === j ? { display: "none" } : undefined}
          onClick={() => answer(j)}
        >
          {t(o)}
        </button>
      ))}
      <HintButton hint={q.hint} disabled={locked} />
      <br />
      <button className="b" id="al0" disabled={!f.a[0]} onClick={() => ally(0)}>{t(BOSS_TXT.remove)}</button>{" "}
      <button className="b" id="al1" disabled={!f.a[1]} onClick={() => ally(1)}>
        {t(BOSS_TXT.hint, { name: t(CH[al[0]].n) })}
      </button>{" "}
      <button className="b" id="al2" disabled={!f.a[2]} onClick={() => ally(2)}>
        {t(BOSS_TXT.shield, { name: t(CH[al[1]].n) })}
      </button>
      <div id="fb">
        {turn.msg ? (
          <>
            <p>{t(BOSS_TXT[turn.msg])}</p>
            <p className="s">{t(q.explain)}</p>
            <button className="b" onClick={next}>{t(BOSS_TXT.cont)}</button>
          </>
        ) : turn.ally === "hint" ? (
          <p className="s">{t(BOSS_TXT.hintMsg, { text: t(q.explain) })}</p>
        ) : turn.ally === "shield" ? (
          <p className="s">{t(BOSS_TXT.shieldReady)}</p>
        ) : null}
      </div>
    </div>
  );
}

/** Prototype `bend(1)` final panel. */
export function BossWin() {
  const t = useT();
  return (
    <>
      <h3>{t(BOSS_TXT.winTitle)}</h3>
      <p>{t(BOSS_TXT.winText)}</p>
      <button className="b" onClick={() => useUI.getState().closeModal()}>{t(BOSS_TXT.back)}</button>
    </>
  );
}

/** Prototype `bend(0)` panel: retry the fight right away (no intro) or go back to the map. */
export function BossLose() {
  const t = useT();
  const retry = () => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.openModal({ kind: "boss" });
  };
  return (
    <>
      <h3>{t(BOSS_TXT.loseTitle)}</h3>
      <button className="b" onClick={retry}>{t(BOSS_TXT.retry)}</button>{" "}
      <button className="b o" onClick={() => useUI.getState().closeModal()}>{t(BOSS_TXT.review)}</button>
    </>
  );
}
