"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import HostNote from "@/components/ui/HostNote";
import { sfx } from "@/lib/audio";
import { PONG, PONG_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

const { w: W, h: H, paddleH: PH, paddleW: PW, ball: R } = PONG;
const JOSEPH = 3;
const PX = 14; // player paddle x (left edge)
const AX = W - 14 - PW; // Joseph's paddle x

type Sim = {
  bx: number; by: number; vx: number; vy: number;
  py: number; ay: number; target: number | null;
  /** Joseph's aiming error for the current return (px), re-rolled every time you hit the ball */
  err: number;
  keys: { up: boolean; down: boolean };
  moon: boolean; live: boolean; ts: number;
};
type Phase = "ready" | "play" | "won" | "lost";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function draw(c: HTMLCanvasElement | null, s: Sim, score: [number, number]) {
  const x = c?.getContext("2d");
  if (!x) return;
  x.fillStyle = s.moon ? "#1b1f3b" : "#0d4f3c";
  x.fillRect(0, 0, W, H);
  x.strokeStyle = "#ffffff55";
  x.lineWidth = 2;
  x.strokeRect(2, 2, W - 4, H - 4);
  x.setLineDash([6, 6]);
  x.beginPath();
  x.moveTo(W / 2, 0);
  x.lineTo(W / 2, H);
  x.stroke();
  x.setLineDash([]);
  x.fillStyle = "#ffffffaa";
  x.font = "bold 28px system-ui, sans-serif";
  x.textAlign = "center";
  x.fillText(String(score[0]), W / 2 - 40, 36);
  x.fillText(String(score[1]), W / 2 + 40, 36);
  x.fillStyle = "#22b8cf";
  x.fillRect(PX, s.py, PW, PH);
  x.fillStyle = "#e53935";
  x.fillRect(AX, s.ay, PW, PH);
  x.fillStyle = "#ffd54a";
  x.beginPath();
  x.arc(s.bx, s.by, R, 0, Math.PI * 2);
  x.fill();
}

/** Phase 5 · Joseph's feature (Cancha Deportiva): pong against Joseph where the ball falls with
 *  Earth or Moon gravity (toggle any time: button or G). It bounces elastically off the table's
 *  top and bottom. First to 3 points wins: 3 ★ if you won a point under Earth gravity, else 2 ★. */
export default function LunarPingPong() {
  const t = useT();
  const cv = useRef<HTMLCanvasElement>(null);
  const sim = useRef<Sim>({
    bx: W / 2, by: H / 3, vx: 0, vy: 0, py: (H - PH) / 2, ay: (H - PH) / 2,
    target: null, err: 0, keys: { up: false, down: false }, moon: true, live: false, ts: 0,
  });
  const score = useRef<[number, number]>([0, 0]);
  const earthPoint = useRef(false);
  const [view, setView] = useState({ a: 0, b: 0, moon: true });
  const [phase, setPhase] = useState<Phase>("ready");
  const [msg, setMsg] = useState<"point" | "pointAi" | null>(null);
  const [gained, setGained] = useState(0);

  const serve = (dir: 1 | -1) => {
    const s = sim.current;
    s.bx = W / 2;
    s.by = H / 3;
    s.vx = dir * PONG.serveVx;
    s.vy = -40;
    s.ts = 0;
    s.live = true;
  };

  const toggle = () => {
    const s = sim.current;
    s.moon = !s.moon;
    setView((v) => ({ ...v, moon: s.moon }));
    sfx("whoosh");
  };

  useEffect(() => {
    const s = sim.current;
    let raf = 0;
    let wait: ReturnType<typeof setTimeout> | undefined;
    const loop = (ts: number) => {
      const dt = Math.min(0.033, (ts - (s.ts || ts)) / 1e3);
      s.ts = ts;
      // Paddles: player by keys or pointer, Joseph follows the ball when it comes his way.
      if (s.keys.up) s.py -= PONG.playerSpeed * dt;
      if (s.keys.down) s.py += PONG.playerSpeed * dt;
      if (s.target !== null) {
        const d = s.target - PH / 2 - s.py;
        s.py += clamp(d, -PONG.playerSpeed * 1.6 * dt, PONG.playerSpeed * 1.6 * dt);
      }
      s.py = clamp(s.py, 0, H - PH);
      // Joseph only reacts once the ball crosses towards his side, and aims a bit off: beatable.
      const aim = s.vx > 0 && s.bx > W * 0.4 ? s.by + s.err : H / 2;
      s.ay += clamp(aim - PH / 2 - s.ay, -PONG.aiSpeed * dt, PONG.aiSpeed * dt);
      s.ay = clamp(s.ay, 0, H - PH);

      if (s.live) {
        const g = (s.moon ? PONG.gMoon : PONG.gEarth) * PONG.scale;
        s.vy = clamp(s.vy + g * dt, -PONG.maxVy, PONG.maxVy);
        s.bx += s.vx * dt;
        s.by += s.vy * dt;
        // Elastic bounce on the floor and the ceiling.
        if (s.by > H - R) { s.by = H - R; s.vy = -Math.abs(s.vy); }
        if (s.by < R) { s.by = R; s.vy = Math.abs(s.vy); }
        const hit = (px: number, py: number, dir: 1 | -1) => {
          const inX = dir === 1 ? s.bx - R <= px + PW && s.bx > px : s.bx + R >= px && s.bx < px + PW;
          if (!inX || s.by < py - R || s.by > py + PH + R || Math.sign(s.vx) === dir) return;
          const off = (s.by - (py + PH / 2)) / (PH / 2);
          s.vx = dir * Math.min(PONG.maxVx, Math.abs(s.vx) * 1.06);
          s.vy = clamp(s.vy * 0.5 + off * 220, -PONG.maxVy, PONG.maxVy);
          s.bx = dir === 1 ? px + PW + R : px - R;
          if (dir === 1) s.err = (Math.random() * 2 - 1) * PH * PONG.aiError;
          sfx("click");
        };
        hit(PX, s.py, 1);
        hit(AX, s.ay, -1);
        // Who scores: 0 = you (ball past Joseph), 1 = Joseph (ball past you).
        const out: 0 | 1 | null = s.bx < -R ? 1 : s.bx > W + R ? 0 : null;
        if (out !== null) {
          s.live = false;
          score.current[out]++;
          if (out === 0 && !s.moon) earthPoint.current = true;
          const [a, b] = score.current;
          setView((v) => ({ ...v, a, b }));
          if (a >= PONG.target || b >= PONG.target) {
            const won = a >= PONG.target;
            if (won) {
              const st = earthPoint.current ? PONG.starsEarth : PONG.stars;
              setGained(awardWin("pong", st) ? st : 0);
            } else sfx("lose");
            setMsg(null);
            setPhase(won ? "won" : "lost");
          } else {
            sfx(out === 0 ? "ok" : "bad");
            setMsg(out === 0 ? "point" : "pointAi");
            // The side that lost the point receives the next serve.
            wait = setTimeout(() => serve(out === 0 ? 1 : -1), 800);
          }
        }
      }
      draw(cv.current, s, score.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const key = (on: boolean) => (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { s.keys.up = on; e.preventDefault(); }
      else if (k === "arrowdown" || k === "s") { s.keys.down = on; e.preventDefault(); }
      else if (k === "g" && on && !e.repeat) toggle();
    };
    const kd = key(true);
    const ku = key(false);
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(wait);
      document.removeEventListener("keydown", kd);
      document.removeEventListener("keyup", ku);
    };
  }, []);

  const start = () => {
    sfx("click");
    score.current = [0, 0];
    earthPoint.current = false;
    setView((v) => ({ ...v, a: 0, b: 0 }));
    setMsg(null);
    setPhase("play");
    serve(Math.random() < 0.5 ? 1 : -1);
  };

  const aimAt = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    sim.current.target = ((e.clientY - r.top) / r.height) * H;
  };

  const josephLine =
    phase === "won" || phase === "lost" ? PONG_TXT.josephWin : PONG_TXT.joseph;

  return (
    <>
      <GameTitle fact="pong">{t(PONG_TXT.title)}</GameTitle>
      <HostNote ch={JOSEPH} text={josephLine} />
      <p className="s">{t(PONG_TXT.desc, { k: PONG.target })}</p>
      <canvas
        ref={cv}
        width={W}
        height={H}
        aria-label={t(PONG_TXT.canvas)}
        style={{ touchAction: "none", width: "100%", height: "auto" }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); aimAt(e); }}
        onPointerMove={aimAt}
        onPointerLeave={() => { sim.current.target = null; }}
      />
      <div className="s" role="status">
        {t(PONG_TXT.score, { a: view.a, b: view.b })}
        {msg && <> · {t(PONG_TXT[msg])}</>}
      </div>
      <div className="st">
        <button className="b" aria-pressed={!view.moon} onClick={toggle}>
          {t(view.moon ? PONG_TXT.moon : PONG_TXT.earth)}
        </button>
        {phase !== "play" && (
          <button className="b o" onClick={start}>{t(phase === "ready" ? PONG_TXT.start : PONG_TXT.again)}</button>
        )}
      </div>
      <p className="s">
        {phase === "won"
          ? gained > 0 ? t(PONG_TXT.win, { s: gained }) : t(PONG_TXT.winReplay)
          : phase === "lost" ? t(PONG_TXT.lose) : t(PONG_TXT.tip3)}
      </p>
      {(phase === "won" || phase === "lost") && <NasaFactCard fact="pong" />}
    </>
  );
}
