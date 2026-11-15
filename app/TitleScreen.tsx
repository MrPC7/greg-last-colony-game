"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { Portrait, faceStyle } from "@/components/ui/Portrait";
import Watermark from "@/components/ui/Watermark";
import { music, sfx, unlock } from "@/lib/audio";
import { CH, PL, STATS } from "@/lib/characters";
import { IN, IN_MS } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { useGame, useUI } from "@/lib/store";

/** Title screen: Ken-Burns key art, intro cinematic (IN), character picker. */
export default function TitleScreen() {
  const t = useT();
  const router = useRouter();
  const character = useGame((s) => s.character);
  const pick = useGame((s) => s.setCharacter);
  const [phase, setPhase] = useState<"idle" | "cin" | "ready">("idle");
  const [ci, setCi] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const endCin = () => {
    clearTimeout(timer.current);
    setCi(-1);
    setPhase("ready");
    sfx("ok");
  };
  const show = (i: number) => {
    if (i >= IN.length) return endCin();
    setCi(i);
    sfx("whoosh");
    timer.current = setTimeout(() => show(i + 1), IN_MS);
  };
  const startCin = () => {
    unlock();
    music("cover");
    sfx("click");
    setPhase("cin");
    show(0);
  };

  const line = ci >= 0 ? IN[ci] : null;
  return (
    <div id="app">
      <div id="title" className={phase === "ready" ? "rdy" : undefined}>
        <div className="wmc">
        <div className="art" role="img" aria-label={t("title.artLabel")} />
        <div id="cin">
          <div id="cic" aria-live="polite">
            {line && (
              <Fragment key={ci}>
                <div className="cr">
                  {line.chars.map((i) => (
                    <div key={i}>
                      <Portrait ch={i} />
                      <b>{t(CH[i].n)}</b>
                    </div>
                  ))}
                </div>
                <p className="cp">{t(line.text)}</p>
              </Fragment>
            )}
          </div>
          {phase === "idle" && (
            <button className="b o" id="go" onClick={startCin}>{t("title.start")}</button>
          )}
          {phase === "cin" && (
            <button className="b" id="sk" onClick={endCin}>{t("title.skip")}</button>
          )}
        </div>
        <Watermark />
        </div>
        <div className="bar">
          <span>{t("title.choose")}</span>
          <span id="pks">
            {PL.map((i) => (
              <button
                key={i}
                className={"pk" + (character === i ? " on" : "")}
                style={{ ...faceStyle(i), backgroundColor: "#222" }}
                onClick={() => pick(i)}
                title={t(CH[i].n)}
                aria-label={t(CH[i].n)}
                aria-pressed={character === i}
              >
                <Watermark compact />
              </button>
            ))}
          </span>
          {/* Stat cards (display only), the selected hero highlighted. */}
          <div className="stc">
            {PL.map((i) => (
              <div key={i} className={"stcard" + (character === i ? " on" : "")} style={{ "--cc": CH[i].col } as CSSProperties}>
                <b>{t(CH[i].n)}</b>
                <small>{t(STATS[i].role)}</small>
                <ul>
                  {STATS[i].stats.map(([name, v]) => (
                    <li key={name.es}>
                      <span>{t(name)}</span>
                      <span className="stb" role="img" aria-label={t("title.stat", { stat: t(name), v })}>
                        {[1, 2, 3, 4, 5].map((k) => <i key={k} className={k <= v ? "f" : undefined} />)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className="b" onClick={() => router.push("/play")}>{t("title.play")}</button>
          <button className="b o" onClick={() => useUI.getState().openModal({ kind: "ar" })}>{t("title.tryAr")}</button>
        </div>
        <p className="tl">
          <Link href="/credits" prefetch={false}>{t("credits.link")}</Link>
        </p>
      </div>
    </div>
  );
}
