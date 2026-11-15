"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/audio";
import { JUMP, JUMP_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

/** Prototype `jump` / `jup` / `jgo`: same take-off speed on Earth and Moon, height = v²/(2g).
 *  Both balls fly in real time, scaled so the Moon apex is 210 px. Jumping awards 2 ★ (zone "cancha"). */
export default function JumpSim() {
  const t = useT();
  const [v, setV] = useState(JUMP.v0);
  /** UI only: show the NASA Fact card once the player has jumped */
  const [jumped, setJumped] = useState(false);
  const earth = useRef<HTMLElement>(null);
  const moon = useRef<HTMLElement>(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const he = (v * v) / (2 * JUMP.gEarth);
  const hm = (v * v) / (2 * JUMP.gMoon);

  const go = () => {
    sfx("jump");
    cancelAnimationFrame(raf.current);
    const T = (2 * v) / JUMP.gMoon;
    const t0 = performance.now();
    const f = (n: number) => {
      const tt = (n - t0) / 1e3;
      const ye = Math.max(0, v * tt - (JUMP.gEarth / 2) * tt * tt);
      const ym = Math.max(0, v * tt - (JUMP.gMoon / 2) * tt * tt);
      const e = earth.current;
      const m = moon.current;
      if (!e || !m) return;
      e.style.bottom = (ye / hm) * JUMP.px + "px";
      m.style.bottom = (ym / hm) * JUMP.px + "px";
      if (tt < T) raf.current = requestAnimationFrame(f);
    };
    f(t0);
    awardWin("cancha", 2);
    setJumped(true);
  };

  return (
    <>
      <GameTitle fact="jump">{t(JUMP_TXT.title)}</GameTitle>
      <p className="s">{t(JUMP_TXT.desc)}</p>
      <label>
        {t(JUMP_TXT.speed)} <b id="jv">{v.toFixed(1)}</b> {t(JUMP_TXT.unit)}
        <input
          type="range"
          id="jr"
          min={JUMP.min}
          max={JUMP.max}
          step={JUMP.step}
          value={v}
          onChange={(e) => setV(+e.target.value)}
        />
      </label>
      <div className="s" id="jt">
        {t(JUMP_TXT.earthH)} <b>{t(JUMP_TXT.meters, { h: he.toFixed(2) })}</b> {t(JUMP_TXT.moonH)}{" "}
        <b>{t(JUMP_TXT.meters, { h: hm.toFixed(2) })}</b> {t(JUMP_TXT.ratio, { r: (hm / he).toFixed(1) })}
      </div>
      <div className="jf">
        <div className="jc"><i id="je" ref={earth} /><span>{t(JUMP_TXT.earth)}</span></div>
        <div className="jc"><i id="jm" ref={moon} /><span>{t(JUMP_TXT.moon)}</span></div>
      </div>
      <button className="b" onClick={go}>{t(JUMP_TXT.go)}</button>
      {jumped && <NasaFactCard fact="jump" />}
    </>
  );
}
