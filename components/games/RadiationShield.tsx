"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/audio";
import { MT, STORM, STORM_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

const doseOf = (layers: number[]) => layers.reduce((a, i) => a * (1 - MT[i].block), 1);

/** Prototype `storm` / `stm` / `sma` / `smg`: stack shield layers within a mass budget of 8;
 *  the storm passes the product of (1 − block); safe if the dose is ≤ 35 % → 3 ★ (activity "rad"). */
export default function RadiationShield() {
  const t = useT();
  const [layers, setLayers] = useState<number[]>([]);
  // Prototype re-renders the whole modal on every change, which resets the dose bar and the message.
  const [view, setView] = useState(0);
  const [storm, setStorm] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; d: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const used = layers.reduce((a, i) => a + MT[i].mass, 0);
  const p = doseOf(layers);

  const rerender = (next: number[]) => {
    sfx("click");
    setLayers(next);
    setStorm(null);
    setMsg(null);
    setView((v) => v + 1);
  };
  const add = (i: number) => {
    sfx("click");
    rerender([...layers, i]);
  };
  const start = () => {
    const d = Math.round(doseOf(layers) * 100);
    sfx("qhit");
    setStorm(d);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (d <= STORM.safeDose) {
        awardWin("rad", 3);
        sfx("ok");
        setMsg({ ok: true, d });
      } else {
        sfx("bad");
        setMsg({ ok: false, d });
      }
    }, 2100);
  };

  return (
    <>
      <GameTitle fact="radiation">{t(STORM_TXT.title)}</GameTitle>
      <p className="s">{t(STORM_TXT.desc, { free: STORM.budget - used, budget: STORM.budget })}</p>
      <div style={{ minHeight: 40, fontSize: 26 }}>{layers.map((i) => MT[i].icon).join("") || "…"}</div>
      <div className="s">{t(STORM_TXT.dose, { d: Math.round(p * 100) })}</div>
      {MT.map((m, i) => (
        <button key={i} className="op" disabled={used + m.mass > STORM.budget} onClick={() => add(i)}>
          {t(STORM_TXT.material, { icon: m.icon, name: t(m.name), m: m.mass, b: Math.round(m.block * 100) })}
        </button>
      ))}
      <button className="b o" onClick={start}>{t(STORM_TXT.start)}</button>{" "}
      <button className="b" onClick={() => rerender([])}>{t(STORM_TXT.reset)}</button>
      <div className="pb" style={{ marginTop: 8 }}>
        <i
          key={view}
          id="dz"
          style={
            storm === null
              ? { width: 0 }
              : { width: storm + "%", transition: "width 2s", background: storm <= STORM.safeDose ? "#2ecc71" : "#e74c3c" }
          }
        />
      </div>
      <p id="fb" className="s">
        {msg ? (msg.ok ? t(STORM_TXT.safe) : t(STORM_TXT.tooHigh, { d: msg.d })) : null}
      </p>
      {msg && <NasaFactCard fact="radiation" />}
    </>
  );
}
