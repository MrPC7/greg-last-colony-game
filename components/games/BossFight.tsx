"use client";

import { useEffect, useRef, useState } from "react";
import { cropStyle } from "@/components/ui/Portrait";
import HintButton from "@/components/ui/HintButton";
import Watermark from "@/components/ui/Watermark";
import { music, sfx } from "@/lib/audio";
import { CH } from "@/lib/characters";
import { BOSS, BOSS_ALLIES, BOSS_TOPICS, BOSS_TXT, drawBossQuiz, type BossQuestion } from "@/lib/content/games";
import { BOSS_LOSE_TALK, BOSS_WIN_TALK } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { awardWin, useGame, useUI } from "@/lib/store";

/** Fight state: shield segments left, lives left, question index, the drawn quiz, unused allies,
 *  friend's shield up. */
type Fight = { seg: number; lives: number; i: number; o: BossQuestion[]; a: [boolean, boolean, boolean]; sh: boolean };
/** One turn (prototype re-renders the modal each turn, which resets all of this). */
type Turn = { picked: number | null; msg: keyof typeof BOSS_TXT | null; removed: number | null; ally: "hint" | "shield" | null };

const freshTurn = (): Turn => ({ picked: null, msg: null, removed: null, ally: null });
const newFight = (): Fight => ({
  seg: BOSS.segments,
  lives: BOSS.lives,
  i: 0,
  o: drawBossQuiz(),
  a: [true, true, true],
  sh: false,
});

/** Prototype `bend`: close the fight, then the ending dialogue, then (Phase 6) the ending
 *  cutscene on a win or the retry panel on a loss. */
function endFight(won: boolean, broke: number) {
  music("explore");
  sfx(won ? "win" : "lose");
  const ui = useUI.getState();
  ui.closeModal();
  if (won) {
    awardWin("boss", BOSS.stars);
    ui.startTalk(BOSS_WIN_TALK, () => useUI.getState().openModal({ kind: "ending" }));
  } else {
    ui.startTalk(BOSS_LOSE_TALK, () => useUI.getState().openModal({ kind: "bossLose", broke }));
  }
}

/** Phase 6 BossFight: a mixed quiz drawn from every zone — the 5 ORD zones, La Señal de Ray
 *  (GISTEMP + FIRMS) and the Phase 5 crew features. Each right answer breaks one of the
 *  Hollow Queen's 8 shield segments; each wrong answer costs one of 3 lives (unless a friend's
 *  shield is up); 0 lives → retry. The prototype's three one-use allies stay: Orbi removes a
 *  wrong option, the first friend gives the explanation as a hint, the second raises a shield.
 *  Shield broken → win (5 ★, "boss") → ending cutscene → certificate. */
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
      n.seg--;
      msg = n.seg <= 0 ? "lastMsg" : "hitMsg";
      sfx(n.seg <= 0 ? "crit" : "hit");
    } else if (n.sh) {
      n.sh = false;
      msg = "blocked";
      sfx("shield");
    } else {
      n.lives--;
      msg = "counter";
      sfx("qhit");
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
      setTurn({ ...turn, removed: q.options.findIndex((_, x) => x !== q.answer) });
    } else if (k === 1) {
      setF({ ...f, a });
      setTurn({ ...turn, ally: "hint" });
    } else {
      setF({ ...f, a, sh: true });
      setTurn({ ...turn, ally: "shield" });
    }
  };

  const next = () => {
    if (f.seg <= 0) return endFight(true, BOSS.segments);
    if (f.lives <= 0) return endFight(false, BOSS.segments - f.seg);
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
      <p className="s">{t(BOSS_TXT.rules)}</p>
      <div className="s">{t(BOSS_TXT.queen)}</div>
      <div className="segs" role="img" aria-label={t(BOSS_TXT.segments, { k: f.seg, total: BOSS.segments })}>
        {Array.from({ length: BOSS.segments }, (_, k) => (
          <i key={k} className={k < f.seg ? "" : "off"} />
        ))}
      </div>
      <div className="s">{t(CH[hero].n)}</div>
      <div className="lives" role="img" aria-label={t(BOSS_TXT.lives, { k: f.lives, total: BOSS.lives })}>
        {Array.from({ length: BOSS.lives }, (_, k) => (
          <span key={k} className={k < f.lives ? "" : "off"}>{k < f.lives ? "❤️" : "🖤"}</span>
        ))}
        {f.sh && <span>🛡️</span>}
      </div>
      <p className="s btopic">{t(BOSS_TXT.from, { i: f.i + 1, topic: t(BOSS_TOPICS[q.topic]) })}</p>
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
      <button className="b" id="al0" disabled={!f.a[0] || locked} onClick={() => ally(0)}>{t(BOSS_TXT.remove)}</button>{" "}
      <button className="b" id="al1" disabled={!f.a[1] || locked} onClick={() => ally(1)}>
        {t(BOSS_TXT.hint, { name: t(CH[al[0]].n) })}
      </button>{" "}
      <button className="b" id="al2" disabled={!f.a[2] || locked} onClick={() => ally(2)}>
        {t(BOSS_TXT.shield, { name: t(CH[al[1]].n) })}
      </button>
      <div id="fb" aria-live="polite">
        {turn.msg ? (
          <>
            <p>{t(BOSS_TXT[turn.msg])}</p>
            <p className="s">{t(q.explain)}</p>
            <button className="b" id="bnext" onClick={next}>{t(BOSS_TXT.cont)}</button>
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

/** Prototype `bend(0)` panel: retry the fight right away (no intro) or go back to the map. */
export function BossLose({ broke }: { broke: number }) {
  const t = useT();
  const retry = () => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.openModal({ kind: "boss" });
  };
  return (
    <>
      <h3>{t(BOSS_TXT.loseTitle)}</h3>
      <p className="s">{t(BOSS_TXT.loseText, { k: broke, total: BOSS.segments })}</p>
      <button className="b" onClick={retry}>{t(BOSS_TXT.retry)}</button>{" "}
      <button className="b o" onClick={() => useUI.getState().closeModal()}>{t(BOSS_TXT.review)}</button>
    </>
  );
}
