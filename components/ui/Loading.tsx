"use client";

import { useT } from "@/lib/i18n";

/** Placeholder shown inside a modal while a code-split mini-game / panel chunk downloads. */
export default function Loading() {
  const t = useT();
  return (
    <p className="s" role="status" aria-live="polite">
      {t("common.loading")}
    </p>
  );
}
