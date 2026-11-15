"use client";

import Link from "next/link";
import Watermark from "@/components/ui/Watermark";
import {
  AI_IMAGE_TOOL,
  AI_IMAGES,
  CREDITS as C,
  LIBRARIES,
  NASA_DATA,
  NASA_RESOURCES,
  SITE_URL,
  TEAM,
  type Source,
} from "@/lib/content/credits";
import { useT } from "@/lib/i18n";

function SourceList({ items }: { items: Source[] }) {
  const t = useT();
  return (
    <ul>
      {items.map((s) => (
        <li key={s.url}>
          <b>{t(s.name)}</b>
          <br />
          <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
          <br />
          <span className="s">{t(s.use)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Credits: team, NASA resources, AI (SI) disclosure, open-source libraries. */
export default function CreditsPage() {
  const t = useT();
  return (
    <div id="app">
      <div id="cred" className="card">
        <h1 style={{ margin: "0 0 4px", fontSize: 26 }}>{t(C.title)}</h1>
        <p>
          <b>{t("app.title")}</b>
          <br />
          {t(C.event)}
          <br />
          {t(C.playOnline)} <a href={SITE_URL} target="_blank" rel="noopener noreferrer">{SITE_URL}</a>
        </p>

        <h2>{t(C.teamTitle)}</h2>
        <ul>
          {TEAM.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <h2>{t(C.nasaTitle)}</h2>
        <p className="s">{t(C.nasaIntro)}</p>
        <SourceList items={NASA_RESOURCES} />

        <h2>{t(C.dataTitle)}</h2>
        <p className="s">{t(C.dataIntro)}</p>
        <SourceList items={NASA_DATA} />
        <p className="s">{t(C.noLogo)}</p>

        <h2>{t(C.aiTitle)}</h2>
        <ul>
          <li>{t(C.aiImages, { tool: t(AI_IMAGE_TOOL) })}</li>
          <li>{t(C.aiCode)}</li>
          <li>{t(C.aiAudio)}</li>
        </ul>
        <p className="s">{t(C.aiGallery)}</p>
        <div className="gal">
          {AI_IMAGES.map((im) => (
            <figure key={im.file}>
              <div className="wmc">
                <div
                  className="th"
                  role="img"
                  aria-label={t(im.name)}
                  style={{ aspectRatio: im.ratio, backgroundImage: `var(${im.cssVar})` }}
                />
                <Watermark />
              </div>
              <figcaption>{t(im.name)}</figcaption>
            </figure>
          ))}
        </div>

        <h2>{t(C.libsTitle)}</h2>
        <p className="s">{t(C.libsIntro)}</p>
        <ul>
          {LIBRARIES.map((l) => (
            <li key={l.name}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">{l.name}</a> ({l.license}) — {t(l.use)}
            </li>
          ))}
        </ul>

        <p>
          <Link className="b" href="/" prefetch={false} style={{ display: "inline-block", textDecoration: "none" }}>{t(C.back)}</Link>
        </p>
      </div>
    </div>
  );
}
