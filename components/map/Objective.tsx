"use client";

import { Fragment } from "react";
import { HINT_DONE, HINT_FINISHED, HINT_SENAL, HT, ORD, senalUnlocked } from "@/lib/content/story";
import type { Localized } from "@/lib/content/types";
import { useT, type UIKey } from "@/lib/i18n";
import { useGame, useUI } from "@/lib/store";

const STEPS: UIKey[] = ["obj.cores", "obj.moon", "obj.queen"];

/** The 3-step goal (5 cores → trip to the Moon → Queen of the Void), read from existing state only:
 *  `step` is the current one (3 = all done), `goal` is the same text Orbi's 💡 hint gives
 *  (Stage.tsx `hint`), without the dialogue. */
export function useObjective() {
  const done = useGame((s) => s.done);
  const fighting = useUI((s) => s.bossScene || s.modal?.kind === "boss");
  const d = ORD.filter((k) => done[k]).length;
  const step = done.boss ? 3 : d < ORD.length ? 0 : fighting ? 2 : 1;
  const n = ORD.findIndex((k) => !done[k]);
  const goal: Localized[] = [done.boss ? HINT_FINISHED : n < 0 ? HINT_DONE : HT[n]];
  if (senalUnlocked(done) && !done.senal) goal.push(HINT_SENAL);
  return { d, total: ORD.length, step, goal };
}

/** "🎯 Núcleos 3/5 → Viaje a la Luna → Reina del Vacío" + "Siguiente: …", current step highlighted.
 *  Class names come from the caller (map overlay on desktop, Info panel on phones). */
export function ObjectiveTracker({ cls }: { cls: { steps: string; on: string; ok: string; next: string } }) {
  const t = useT();
  const { d, total, step, goal } = useObjective();
  return (
    <>
      <p className={cls.steps}>
        <b aria-hidden>🎯</b>{" "}
        {STEPS.map((k, i) => (
          <Fragment key={k}>
            {/* Bare spaces around the arrow: the line may wrap there, never inside a step. */}
            {i > 0 && <>{" "}<i aria-hidden>→</i>{" "}</>}
            <span
              className={i === step ? cls.on : i < step ? cls.ok : undefined}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step && "✓ "}
              {t(k, { d, total })}
            </span>
          </Fragment>
        ))}
      </p>
      <p className={cls.next}>
        <b>{t("pad.next")}</b> {t(goal)}
      </p>
    </>
  );
}

/** Desktop map overlay (top-left, under the AR / Orbi buttons); hidden on phones, where the Info
 *  panel of PhoneBar shows the same tracker. */
export default function ObjectiveBox({ className, cls }: { className: string; cls: Parameters<typeof ObjectiveTracker>[0]["cls"] }) {
  const t = useT();
  return (
    <section data-ui className={className} aria-label={t("obj.label")}>
      <ObjectiveTracker cls={cls} />
    </section>
  );
}
