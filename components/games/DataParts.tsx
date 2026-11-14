"use client";

import { Portrait } from "@/components/ui/Portrait";
import Watermark from "@/components/ui/Watermark";
import { RAY } from "@/lib/characters";
import { DATA_TXT } from "@/lib/content/games";
import type { Localized } from "@/lib/content/types";
import { useT, type Vars } from "@/lib/i18n";

/** Ray's kid-friendly explanation box (portrait + text) used by the NASA data games. */
export function RayNote({ text, vars }: { text: Localized; vars?: Vars }) {
  const t = useT();
  return (
    <div className="ray">
      <span className="wmp">
        <Portrait ch={RAY} />
        <Watermark compact />
      </span>
      <p>
        <b>{t(DATA_TXT.rayTitle)}</b> {t(text, vars)}
      </p>
    </div>
  );
}

/** "Datos: NASA … — fecha" line under every NASA data screen. */
export function DataCaption({ text, vars, href }: { text: Localized; vars: Vars; href: string }) {
  const t = useT();
  return (
    <p className="cap">
      <a href={href} target="_blank" rel="noopener noreferrer">{t(text, vars)}</a>
    </p>
  );
}

/** Loading / error state while the JSON file arrives. */
export function DataStatus({ error }: { error: boolean }) {
  const t = useT();
  return <p className="s" role="status">{t(error ? DATA_TXT.error : DATA_TXT.loading)}</p>;
}
