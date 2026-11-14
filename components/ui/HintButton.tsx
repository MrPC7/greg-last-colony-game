"use client";

import { ORBI } from "@/lib/characters";
import type { Localized } from "@/lib/content/types";
import { useT } from "@/lib/i18n";
import { useUI } from "@/lib/store";

/** Phase 5: "💡 Pista de Orbi" on every quiz question — Orbi says the hint in a speech bubble. */
export default function HintButton({ hint, disabled }: { hint: Localized; disabled?: boolean }) {
  const t = useT();
  return (
    <button
      className="b hint"
      disabled={disabled}
      onClick={() => useUI.getState().startTalk([[ORBI, hint]])}
    >
      {t("quiz.hint")}
    </button>
  );
}
