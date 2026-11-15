"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/audio";
import { THERM, THERM_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

type View = { te: number; ti: number; t: number; g: boolean } | null;

/** Prototype `therm` / `thk`: a lunar day squeezed into 30 s (outside −5 + 125·cos), the shelter
 *  drifts toward the outside temperature; heater and radiator push it back. Win if it stays in
 *  15–25 °C ≥ 75 % of the ticks → 3 ★ (activity "therm"). Reopen the activity to retry. */
export default function ThermalControl() {
  const t = useT();
  const heat = useRef<HTMLInputElement>(null);
  const cool = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<View>(null);
  const [end, setEnd] = useState<{ ok: boolean; p: number } | null>(null);

  useEffect(() => {
    const TH = { t: 0, ti: THERM.start, ok: 0 };
    const i = setInterval(() => {
      const q = heat.current;
      const c = cool.current;
      if (!q || !c) {
        clearInterval(i);
        return;
      }
      TH.t += 0.1;
      const te = -5 + 125 * Math.cos((TH.t / 30) * 6.2832);
      TH.ti += 0.002 * (te - TH.ti) + 0.004 * (+q.value - +c.value);
      const g = TH.ti >= THERM.lo && TH.ti <= THERM.hi;
      if (g) TH.ok++;
      setView({ te, ti: TH.ti, t: TH.t, g });
      if (TH.t >= THERM.seconds) {
        clearInterval(i);
        const p = Math.round(TH.ok / 3);
        if (p >= THERM.winPct) {
          awardWin("therm", 3);
          sfx("win");
          setEnd({ ok: true, p });
        } else {
          sfx("bad");
          setEnd({ ok: false, p });
        }
      }
    }, THERM.tickMs);
    return () => clearInterval(i);
  }, []);

  const bar = view
    ? { width: Math.max(0, Math.min(100, ((view.ti + 10) / 60) * 100)) + "%", background: view.g ? "#2ecc71" : "#e67e22" }
    : { width: "50%" };

  return (
    <>
      <GameTitle fact="thermal">{t(THERM_TXT.title)}</GameTitle>
      <p className="s">{t(THERM_TXT.desc)}</p>
      <div id="ex">{view && t(THERM_TXT.temps, { te: view.te.toFixed(0), ti: view.ti.toFixed(1) })}</div>
      <div className="pb"><i id="tb" style={bar} /></div>
      <label>
        {t(THERM_TXT.heater)}
        <input type="range" id="th" ref={heat} min={0} max={100} defaultValue={0} />
      </label>
      <label>
        {t(THERM_TXT.radiator)}
        <input type="range" id="tc" ref={cool} min={0} max={100} defaultValue={0} />
      </label>
      <div id="tr" className="s">
        {end
          ? end.ok
            ? t(THERM_TXT.win, { p: end.p })
            : t(THERM_TXT.lose, { p: end.p })
          : view && t(THERM_TXT.timer, { s: Math.max(0, THERM.seconds - view.t).toFixed(0) })}
      </div>
      {end && <NasaFactCard fact="thermal" />}
    </>
  );
}
