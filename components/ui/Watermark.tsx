"use client";

import { useT } from "@/lib/i18n";

/** AI-image disclosure (Space Apps rule for AI images).
 *
 *  Default: small semi-transparent "Imagen generada con IA" / "AI-generated image" text in the
 *  bottom-right corner of its container, which must be `position: relative` and a size container
 *  (`.wmc`). It sits just above the subtle bilingual label burned into the JPEG by
 *  scripts/extract_assets.py, which stays in the file (and in downloads).
 *
 *  `compact`: a tiny "IA" / "AI" corner mark for small crops of the AI images (portraits,
 *  sprites, boss art). Its parent must be `position: relative` (`.wmp`, `.wmb`, `.pk`). */
export default function Watermark({ compact }: { compact?: boolean }) {
  const t = useT();
  if (compact) {
    return (
      <span className="wms" role="img" aria-label={t("ai.watermark")} title={t("ai.watermark")}>
        {t("ai.mark")}
      </span>
    );
  }
  return <span className="wm">{t("ai.watermark")}</span>;
}
