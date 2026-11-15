"use client";

import { useId, useState, type ReactNode } from "react";
import { ORBI } from "@/lib/characters";
import { NASA_FACTS, NASA_FACT_TXT, type NasaFactId } from "@/lib/content/nasaFacts";
import { useT } from "@/lib/i18n";
import { Portrait } from "./Portrait";
import Watermark from "./Watermark";

/** "Fuente: NASA — <page title>" line (opens the NASA page in a new tab). Shared by the
 *  NASA Fact cards and the source line under the NASA data games (TempChart, FireMap). */
export function NasaSource({ href, children }: { href: string; children: ReactNode }) {
  const t = useT();
  return (
    <p className="nfs">
      {t(NASA_FACT_TXT.source)}{" "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="vh"> {t(NASA_FACT_TXT.newTab)}</span>
      </a>
    </p>
  );
}

/** "🚀 Dato NASA" card: Orbi presents one real NASA fact with a link to its NASA page.
 *  Purely informative — it never touches game state. */
export function NasaFactCard({ id, fact }: { id?: string; fact: NasaFactId }) {
  const t = useT();
  const f = NASA_FACTS[fact];
  return (
    <aside className="nf" id={id} aria-label={t(NASA_FACT_TXT.title)}>
      <span className="wmp">
        <Portrait ch={ORBI} />
        <Watermark compact />
      </span>
      <div>
        <p className="nfh">
          <span aria-hidden="true">{f.icon}</span> <b>{t(NASA_FACT_TXT.title)}</b> · <span className="s">{t(NASA_FACT_TXT.presenter)}</span>
        </p>
        <p>{t(f.text)}</p>
        <NasaSource href={f.url}>{t(NASA_FACT_TXT.link, { title: f.title })}</NasaSource>
      </div>
    </aside>
  );
}

/** A mini-game's title (h3, stays pinned at the top of the modal) with the small "🚀 Dato NASA"
 *  button that shows / hides the game's NASA Fact card right under it. */
export function GameTitle({ fact, children }: { fact: NasaFactId; children: ReactNode }) {
  const t = useT();
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <>
      <h3 className="gt">
        <span>{children}</span>
        <button className="b nfb" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {t(open ? NASA_FACT_TXT.hide : NASA_FACT_TXT.button)}
        </button>
      </h3>
      {open && <NasaFactCard id={id} fact={fact} />}
    </>
  );
}
