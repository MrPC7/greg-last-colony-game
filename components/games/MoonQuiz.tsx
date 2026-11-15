"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useState } from "react";
import HintButton from "@/components/ui/HintButton";
import { sfx } from "@/lib/audio";
import { Q, QUIZ } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin, useUI } from "@/lib/store";

/** Prototype `quiz` / `qq` / `qa`: 4 questions, explanation after each answer.
 *  Stars = max(1, correct answers), awarded once (zone "aulas"); "⭐ +N" only when awarded. */
export default function MoonQuiz() {
  const t = useT();
  const [qi, setQi] = useState(0);
  const [qs, setQs] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  /** stars actually added at the end (0 on a replay: the zone was already completed) */
  const [gained, setGained] = useState(0);

  if (qi >= Q.length) {
    return (
      <>
        <GameTitle fact="quiz">{t(QUIZ.end)}</GameTitle>
        <p>
          {t(QUIZ.score)} <b>{qs}/{Q.length}</b>
          {gained > 0 && <> · ⭐ +{gained}</>}
        </p>
        <NasaFactCard fact="quiz" />
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
    if (qi + 1 >= Q.length) {
      const s = Math.max(1, qs);
      setGained(awardWin("aulas", s) ? s : 0);
    }
    setPicked(null);
    setQi(qi + 1);
  };

  return (
    <>
      <GameTitle fact="quiz">{t(QUIZ.head, { i: qi + 1, n: Q.length })}</GameTitle>
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
      <HintButton hint={q.hint} disabled={picked !== null} />
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

