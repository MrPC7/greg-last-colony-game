"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useState } from "react";
import { sfx } from "@/lib/audio";
import { VERD, VERD_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

type Result = "win" | "winReplay" | "low" | "high";

/** Prototype `verd` / `vr` / `vup` / `vok`: crew × 0.84 kg O₂/day vs plants m² × 0.08 kg/day.
 *  Win if production ÷ consumption is 0.95–1.2 → 3 ★ (activity "verdes"). The bar is ratio × 50 %. */
export default function OxygenBalance() {
  const t = useT();
  const [crew, setCrew] = useState(VERD.crew.v0);
  const [plants, setPlants] = useState(VERD.plants.v0);
  const [result, setResult] = useState<Result | null>(null);

  const use = crew * VERD.o2PerPerson;
  const make = plants * VERD.o2PerM2;
  const r = make / use;
  const ok = r >= VERD.lo && r <= VERD.hi;

  const confirm = () => {
    if (ok) {
      setResult(awardWin("verdes", 3) ? "win" : "winReplay");
      sfx("ok");
    } else {
      setResult(r < VERD.lo ? "low" : "high");
      sfx("bad");
    }
  };

  return (
    <>
      <GameTitle fact="oxygen">{t(VERD_TXT.title)}</GameTitle>
      <p className="s">{t(VERD_TXT.desc)}</p>
      <label>
        {t(VERD_TXT.crew)} <b id="c1">{crew}</b>
        <input
          type="range"
          id="cr"
          min={VERD.crew.min}
          max={VERD.crew.max}
          value={crew}
          onChange={(e) => setCrew(+e.target.value)}
        />
      </label>
      <label>
        {t(VERD_TXT.plants)} <b id="p1">{plants}</b>
        <input
          type="range"
          id="pl"
          min={VERD.plants.min}
          max={VERD.plants.max}
          value={plants}
          onChange={(e) => setPlants(+e.target.value)}
        />
      </label>
      <div className="s" id="vt">{t(VERD_TXT.flow, { c: use.toFixed(1), p: make.toFixed(1) })}</div>
      <div className="bar2" id="vb" style={{ width: Math.min(100, r * 50) + "%", background: ok ? "#2ecc71" : "#e67e22" }} />
      <br />
      <button className="b" onClick={confirm}>{t(VERD_TXT.confirm)}</button>
      <p id="vm">{result && t(VERD_TXT[result])}</p>
      {result && <NasaFactCard fact="oxygen" />}
    </>
  );
}
