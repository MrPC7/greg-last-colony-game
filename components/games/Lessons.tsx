"use client";

import { useState } from "react";
import { sfx } from "@/lib/audio";
import { COURSE, LS } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin, useUI } from "@/lib/store";

/** Prototype `course` / `lsn` / `lsa`: 5 mini lessons, each with a check question.
 *  A wrong answer keeps you on the lesson; finishing awards 3 ★ (activity "course"). */
export default function Lessons() {
  const t = useT();
  const [li, setLi] = useState(0);
  const [wrong, setWrong] = useState(false);

  if (li >= LS.length) {
    return (
      <>
        <h3>{t(COURSE.doneTitle)}</h3>
        <p>{t(COURSE.doneText)}</p>
        <button className="b" onClick={() => useUI.getState().closeModal()}>{t("common.continue")}</button>
      </>
    );
  }

  const l = LS[li];
  const answer = (j: number) => {
    if (j === l.answer) {
      sfx("ok");
      sfx("click"); // prototype re-opens the modal for the next lesson
      if (li + 1 >= LS.length) awardWin("course", 3);
      setWrong(false);
      setLi(li + 1);
    } else {
      sfx("bad");
      setWrong(true);
    }
  };

  return (
    <>
      <h3>{t(COURSE.head, { icon: l.icon, name: t(l.name), i: li + 1 })}</h3>
      <div className="pb"><i style={{ width: `${li * 20}%` }} /></div>
      <p>{t(l.text)}</p>
      <p><b>{t(l.q)}</b></p>
      {l.options.map((o, j) => (
        <button key={j} className="op" onClick={() => answer(j)}>{t(o)}</button>
      ))}
      <div id="fb">{wrong ? t(COURSE.wrong) : null}</div>
    </>
  );
}
