"use client";

import { CH } from "@/lib/characters";
import type { Localized } from "@/lib/content/types";
import { useT, type Vars } from "@/lib/i18n";
import { Portrait } from "./Portrait";
import Watermark from "./Watermark";

/** Phase 5: a zone host's speech bubble inside a mini-game (Greg, Elen, Joseph…).
 *  `aria-live` so screen readers hear the host's reactions as they change. */
export default function HostNote({ ch, text, vars }: { ch: number; text: Localized; vars?: Vars }) {
  const t = useT();
  const c = CH[ch];
  return (
    <div className="host" style={{ borderColor: c.col }} aria-live="polite">
      <span className="wmp">
        <Portrait ch={ch} />
        <Watermark compact />
      </span>
      <p>
        <b style={{ color: c.col }}>{t(c.n)}:</b> {t(text, vars)}
      </p>
    </div>
  );
}
