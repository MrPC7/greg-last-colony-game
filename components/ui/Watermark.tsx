"use client";

import { useT } from "@/lib/i18n";

/** AI-image disclosure (Space Apps rule for AI images).
 *
 *  Default: small semi-transparent "Imagen generada con IA" / "AI-generated image" text in the
 *  bottom-right corner of its container, which must be `position: relative` and a size container
 *  (`.wmc`). It is the only label on the image: the .webp copies the game shows carry no burned
 *  label (scripts/extract_assets.py CLEAN_WEBP); the .jpg files (downloads, previews) keep theirs.
 *
 *  `below`: the same label as a caption line right under the image (credits map thumbnail, whose
 *  burned strip is cropped), so it covers none of the painted buttons.
 *
 *  `compact`: a tiny "IA" / "AI" corner mark for small crops of the AI images (portraits,
 *  sprites, boss art). Its parent must be `position: relative` (`.wmp`, `.wmb`, `.pk`). */
export default function Watermark({ compact, below }: { compact?: boolean; below?: boolean }) {
  const t = useT();
  if (compact) {
    return (
      <span className="wms" role="img" aria-label={t("ai.watermark")} title={t("ai.watermark")}>
        {t("ai.mark")}
      </span>
    );
  }
  return <span className={below ? "wm wmu" : "wm"}>{t("ai.watermark")}</span>;
}
