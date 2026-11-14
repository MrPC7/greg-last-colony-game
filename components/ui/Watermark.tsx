"use client";

import { useT } from "@/lib/i18n";

/** "Imagen generada con IA" / "AI-generated image" label (Space Apps rule for AI images).
 *
 *  Default: absolutely positioned in the bottom-right corner of its container, which must be
 *  `position: relative` and a size container (`.wmc`). It is sized in cqw to cover exactly the
 *  bilingual label burned into the JPEG by scripts/extract_assets.py, so the in-game view shows
 *  one label in the current language, while downloaded files still carry the burned one.
 *
 *  `compact`: a small inline badge for crops of the AI images (portraits, sprites, boss art). */
export default function Watermark({ compact }: { compact?: boolean }) {
  const t = useT();
  return (
    <span className={compact ? "wm wms" : "wm"}>
      {t(compact ? "ai.watermarkShort" : "ai.watermark")}
    </span>
  );
}
