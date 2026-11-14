"use client";

import { useState } from "react";
import { sfx } from "@/lib/audio";
import { Q, QUIZ } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin, useGame, useUI } from "@/lib/store";

/** Prototype `quiz` / `qq` / `qa`: 4 questions, explanation after each answer.
 *  Stars = max(1, correct answers), awarded once (zone "aulas"). */
export default function MoonQuiz() {
  const t = useT();
  const doneAulas = useGame((s) => !!s.done.aulas);
  const [qi, setQi] = useState(0);
  const [qs, setQs] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  if (qi >= Q.length) {
    const s = Math.max(1, qs);
    return (
      <>
        <h3>{t(QUIZ.end)}</h3>
        <p>
          {t(QUIZ.score)} <b>{qs}/{Q.length}</b> · ⭐ {doneAulas ? "+" + s : ""}
        </p>
        <button className="b" onClick={() => useUI.getState().closeModal()}>{t(QUIZ.keepExploring)}</button>
      </>
    );
  }

  const q = Q[qi];
  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const right = i === q.answer;
    if (right) setQs(qs + 1);
    sfx(right ? "ok" : "bad");
  };
  const next = () => {
    sfx("click"); // prototype re-opens the modal for each question
    // Prototype awards the win when the result screen opens.
    if (qi + 1 >= Q.length) awardWin("aulas", Math.max(1, qs));
    setPicked(null);
    setQi(qi + 1);
  };

  return (
    <>
      <h3>{t(QUIZ.head, { i: qi + 1, n: Q.length })}</h3>
      <p>{t(q.q)}</p>
      {q.options.map((o, i) => (
        <button
          key={i}
          className={"op" + (picked === null ? "" : i === q.answer ? " ok" : i === picked ? " no" : "")}
          onClick={() => answer(i)}
        >
          {t(o)}
        </button>
      ))}
      <div id="fb">
        {picked !== null && (
          <>
            <p className="s">{t(q.explain)}</p>
            <button className="b" onClick={next}>{t(QUIZ.next)}</button>
          </>
        )}
      </div>
    </>
  );
}

