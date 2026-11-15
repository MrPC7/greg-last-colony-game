"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/audio";
import { LANDER, LANDER_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

type Sim = { y: number; v: number; f: number; on: boolean; th: boolean; ts: number; sn: number };
type Result = { ok: boolean; v: number; s: number };

const W = 300;
const H = 380;

/** Prototype `dr()`: stars, ground, lander (+ flame while the engine burns). */
function draw(c: HTMLCanvasElement | null, l: Sim) {
  const x = c?.getContext("2d");
  if (!x) return;
  x.fillStyle = "#05031a";
  x.fillRect(0, 0, W, H);
  x.fillStyle = "#fff";
  for (let i = 0; i < 30; i++) x.fillRect((i * 97) % 300, (i * 53) % 330, 1.5, 1.5);
  x.fillStyle = "#8a8a96";
  x.fillRect(0, 350, 300, 30);
  x.save();
  x.translate(150, 350 - l.y * 3 - 22);
  if (l.th && l.f > 0) {
    x.fillStyle = "#ff9800";
    x.beginPath();
    x.moveTo(-6, 12);
    x.lineTo(0, 34 + Math.random() * 8);
    x.lineTo(6, 12);
    x.fill();
  }
  x.fillStyle = "#ffd54a";
  x.fillRect(-12, -12, 24, 22);
  x.fillStyle = "#9ad";
  x.fillRect(-5, -8, 10, 8);
  x.strokeStyle = "#ddd";
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(-12, 10);
  x.lineTo(-20, 22);
  x.moveTo(12, 10);
  x.lineTo(20, 22);
  x.stroke();
  x.restore();
}

/** Prototype `lander` / `lp` / `fin`: g = 1.62 m/s², hold the engine (button or Space),
 *  win if v ≤ 2.5 m/s (3 ★ if ≤ 1.2, else 2 ★), awarded once (zone "lab"). */
export default function LanderGame() {
  const t = useT();
  const [run, setRun] = useState(0);
  return <Flight key={run} t={t} onRetry={() => { sfx("click"); setRun((r) => r + 1); }} />;
}

function Flight({ t, onRetry }: { t: ReturnType<typeof useT>; onRetry: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const sim = useRef<Sim>({ y: LANDER.y0, v: 0, f: 100, on: true, th: false, ts: 0, sn: 0 });
  const [hud, setHud] = useState({ y: LANDER.y0, v: 0, f: 100 });
  const [result, setResult] = useState<Result | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const l = sim.current;
    let r = 0;
    const lp = (ts: number) => {
      if (!l.on) return;
      const dt = Math.min(0.05, (ts - (l.ts || ts)) / 1e3);
      l.ts = ts;
      let a = LANDER.g;
      if (l.th && l.f > 0) {
        a -= LANDER.thrust;
        l.f = Math.max(0, l.f - LANDER.burn * dt);
      }
      l.v += a * dt;
      l.y -= l.v * dt;
      const landed = l.y <= 0;
      if (landed) {
        l.y = 0;
        l.on = false;
      }
      if (l.th && l.f > 0 && performance.now() - l.sn > 130) {
        l.sn = performance.now();
        sfx("thr");
      }
      draw(cv.current, l);
      setHud({ y: l.y, v: l.v, f: l.f });
      setDrawn(true);
      if (landed) {
        const v = l.v;
        if (v <= LANDER.winV) {
          const s = v <= LANDER.threeStarV ? 3 : 2;
          // s = 0 on a replay (already completed): no "⭐ +N" in the message
          setResult({ ok: true, v, s: awardWin("lab", s) ? s : 0 });
        } else setResult({ ok: false, v, s: 0 });
        sfx(v <= LANDER.winV ? "ok" : "qhit");
        return;
      }
      r = requestAnimationFrame(lp);
    };
    r = requestAnimationFrame(lp);

    // Space holds the engine while flying (prototype document.onkeydown / onkeyup).
    const down = (e: KeyboardEvent) => {
      if (l.on && e.code === "Space") {
        l.th = true;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") l.th = false;
    };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    return () => {
      l.on = false;
      cancelAnimationFrame(r);
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, []);

  const engineOn = () => {
    sim.current.th = true;
  };
  const engineOff = () => {
    sim.current.th = false;
  };

  return (
    <>
      <GameTitle fact="lander">{t(LANDER_TXT.title)}</GameTitle>
      <p className="s">{t(LANDER_TXT.desc)}</p>
      <canvas ref={cv} width={W} height={H} aria-label={t(LANDER_TXT.canvas)} />
      <div id="tm" className="s">
        {result
          ? result.ok
            ? result.s > 0
              ? t(LANDER_TXT.win, { v: result.v.toFixed(1), s: result.s })
              : t(LANDER_TXT.winReplay, { v: result.v.toFixed(1) })
            : t(LANDER_TXT.crash, { v: result.v.toFixed(1) })
          : drawn
            ? t(LANDER_TXT.status, { y: hud.y.toFixed(0), v: hud.v.toFixed(1), f: hud.f.toFixed(0) })
            : null}
      </div>
      <button
        className="b"
        id="bt"
        style={{ touchAction: "none" }}
        onPointerDown={engineOn}
        onPointerUp={engineOff}
        onPointerLeave={engineOff}
        onPointerCancel={engineOff}
        onContextMenu={(e) => e.preventDefault()}
      >
        {t(LANDER_TXT.engine)}
      </button>{" "}
      <button className="b o" onClick={onRetry}>{t(LANDER_TXT.retry)}</button>
      {result && <NasaFactCard fact="lander" />}
    </>
  );
}
