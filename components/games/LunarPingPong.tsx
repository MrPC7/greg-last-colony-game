"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type PointerEvent } from "react";
import HostNote from "@/components/ui/HostNote";
import { sfx } from "@/lib/audio";
import { PONG, PONG_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin } from "@/lib/store";
import { countdownLeft, newSim, paddleX, startMatch, step, toggleGravity, type PongSim } from "./pongSim";

const { w: W, h: H, paddleW: PW, paddleH: AH, ball: R } = PONG;
const JOSEPH = 3;
const { you: PX, joe: AX } = paddleX(PONG);
/** Phones in landscape: put the ▲▼ buttons beside the table instead of below it (same query as the map UI). */
const PHONE_LANDSCAPE = "(orientation: landscape) and (max-height: 520px)";
const COARSE = "(pointer: coarse)";

type Phase = "ready" | "play" | "won" | "lost";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** Best effort: capture throws if the pointer is already gone (e.g. a very quick tap). */
const capture = (el: Element, id: number) => {
  try {
    el.setPointerCapture(id);
  } catch {}
};

function useMedia(q: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(q);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(q).matches,
    () => false,
  );
}

function draw(c: HTMLCanvasElement | null, s: PongSim) {
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
  x.textBaseline = "alphabetic";
  x.fillText(String(s.score[0]), W / 2 - 40, 36);
  x.fillText(String(s.score[1]), W / 2 + 40, 36);
  x.fillStyle = "#22b8cf";
  x.fillRect(PX, s.py, PW, s.ph);
  x.fillStyle = "#e53935";
  x.fillRect(AX, s.ay, PW, AH);
  x.fillStyle = "#ffd54a";
  x.beginPath();
  x.arc(s.bx, s.by, R, 0, Math.PI * 2);
  x.fill();
  // 3-2-1 before every serve, with an arrow showing who receives it.
  const cd = countdownLeft(s, PONG);
  if (cd > 0) {
    x.fillStyle = "#ffffffdd";
    x.font = "bold 56px system-ui, sans-serif";
    x.textBaseline = "middle";
    x.fillText(String(Math.ceil((cd / PONG.countdown) * 3)), W / 2, H * 0.62);
    x.font = "bold 24px system-ui, sans-serif";
    x.fillText(s.serveDir === 1 ? "→" : "←", W / 2, H / 3 - 22);
  }
}

/** Phase 5 · Joseph's feature (Cancha Deportiva): pong against Joseph where the ball falls with
 *  Earth or Moon gravity (toggle any time: button or G). It bounces elastically off the table's
 *  top and bottom. First to 3 points wins: 3 ★ if you won a full Earth-gravity rally, else 2 ★.
 *  Physics and Joseph's AI live in ./pongSim (pure, swept collisions). */
export default function LunarPingPong() {
  const t = useT();
  const cv = useRef<HTMLCanvasElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const sim = useRef<PongSim>(newSim(PONG, false));
  /** Pointer currently dragging the paddle (finger / pen / pressed mouse), or null. */
  const drag = useRef<number | null>(null);
  const earthPoint = useRef(false);
  const [view, setView] = useState({ a: 0, b: 0, moon: true });
  const [phase, setPhase] = useState<Phase>("ready");
  const [msg, setMsg] = useState<"point" | "pointAi" | null>(null);
  const [gained, setGained] = useState(0);
  const side = useMedia(PHONE_LANDSCAPE);
  const coarse = useMedia(COARSE);

  // Slightly taller paddle for fingers.
  useEffect(() => {
    const s = sim.current;
    s.ph = coarse ? PONG.playerHTouch : PONG.playerH;
    s.py = clamp(s.py, 0, H - s.ph);
  }, [coarse]);

  const toggle = () => {
    const s = sim.current;
    toggleGravity(s);
    setView((v) => ({ ...v, moon: s.moon }));
    sfx("whoosh");
  };

  useEffect(() => {
    const s = sim.current;
    let raf = 0;
    let last = 0;
    const loop = (ts: number) => {
      const dt = last ? Math.min(0.033, (ts - last) / 1e3) : 0;
      last = ts;
      const ev = step(s, PONG, dt, Math.random);
      if (ev.hit !== undefined) sfx("click");
      if (ev.serve) setMsg(null);
      if (ev.point !== undefined) {
        const [a, b] = s.score;
        if (ev.point === 0 && !s.rallyMoon) earthPoint.current = true;
        setView((v) => ({ ...v, a, b }));
        if (s.over) {
          const won = a > b;
          if (won) {
            const st = earthPoint.current ? PONG.starsEarth : PONG.stars;
            setGained(awardWin("pong", st) ? st : 0);
          } else sfx("lose");
          setMsg(null);
          setPhase(won ? "won" : "lost");
        } else {
          sfx(ev.point === 0 ? "ok" : "bad");
          setMsg(ev.point === 0 ? "point" : "pointAi");
        }
      }
      draw(cv.current, s);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const typing = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    };
    const key = (on: boolean) => (e: KeyboardEvent) => {
      if (typing(e)) return;
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") s.keys.up = on;
      else if (k === "arrowdown" || k === "s") s.keys.down = on;
      else {
        if (k === "g" && on && !e.repeat) toggle();
        return;
      }
      if (k.startsWith("arrow")) e.preventDefault(); // don't scroll the modal
      if (on) s.target = null; // keys take over from a resting mouse pointer
    };
    // Releasing keys / buttons while the window is not focused would leave the paddle running.
    const release = () => {
      s.keys.up = s.keys.down = false;
      s.nudge = 0;
    };
    const kd = key(true);
    const ku = key(false);
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", release);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", kd);
      document.removeEventListener("keyup", ku);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", release);
    };
  }, []);

  /** Start (or restart, also mid-match) a match from a clean state. */
  const start = () => {
    sfx("click");
    const s = sim.current;
    startMatch(s, PONG, Math.random);
    earthPoint.current = false;
    setView((v) => ({ ...v, a: 0, b: 0 }));
    setMsg(null);
    setGained(0);
    setPhase("play");
    area.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  // ---- Pointer: drag anywhere in the game area (mouse also follows on hover) ----
  const toY = (clientY: number) => {
    const r = cv.current?.getBoundingClientRect();
    return r && r.height ? clamp(((clientY - r.top) / r.height) * H, 0, H) : null;
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("button")) return;
    drag.current = e.pointerId;
    sim.current.target = toY(e.clientY);
    capture(e.currentTarget, e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId === drag.current || (drag.current === null && e.pointerType === "mouse")) {
      sim.current.target = toY(e.clientY);
    }
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== drag.current) return;
    drag.current = null;
    if (e.pointerType !== "mouse") sim.current.target = null;
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && drag.current === null) sim.current.target = null;
  };

  // ---- On-screen ▲▼: hold to move (direction in data-dir) ----
  const holdDir = (e: { currentTarget: HTMLElement }) => (e.currentTarget.dataset.dir === "1" ? 1 : -1);
  const holdStart = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sim.current.target = null;
    sim.current.nudge = holdDir(e);
    capture(e.currentTarget, e.pointerId);
  };
  const holdEnd = () => { sim.current.nudge = 0; };
  /** Keyboard activation (Enter / Space on the focused button, detail 0): one step. */
  const holdKey = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail !== 0) return;
    const s = sim.current;
    s.target = null;
    s.py = clamp(s.py + holdDir(e) * 24, 0, H - s.ph);
  };
  const hold = {
    onPointerDown: holdStart, onPointerUp: holdEnd, onPointerCancel: holdEnd, onLostPointerCapture: holdEnd,
    onClick: holdKey, onContextMenu: (e: MouseEvent) => e.preventDefault(),
  };
  const arrowBtn = { width: 56, height: 48, padding: 0, fontSize: 22, touchAction: "none" } as const;

  const josephLine =
    phase === "won" || phase === "lost" ? PONG_TXT.josephWin : PONG_TXT.joseph;

  return (
    <>
      <GameTitle fact="pong">{t(PONG_TXT.title)}</GameTitle>
      <HostNote ch={JOSEPH} text={josephLine} />
      <p className="s">{t(PONG_TXT.desc, { k: PONG.target })}</p>
      <div
        ref={area}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={leave}
        style={{
          display: "flex", flexDirection: side ? "row-reverse" : "column", alignItems: "center", gap: 8,
          touchAction: "none", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none",
        }}
      >
        <canvas
          ref={cv}
          width={W}
          height={H}
          aria-label={t(PONG_TXT.canvas)}
          style={{
            display: "block", flex: side ? "1 1 0" : undefined, minWidth: 0, width: "100%", height: "auto",
            aspectRatio: `${W} / ${H}`, maxWidth: `calc((100dvh - 165px) * ${W / H})`, margin: "0 auto",
          }}
        />
        <div style={{ display: "flex", flexDirection: side ? "column" : "row", gap: 8, alignSelf: side ? "center" : "flex-start" }}>
          <button type="button" className="b" style={arrowBtn} aria-label={t(PONG_TXT.up)} data-dir="-1" {...hold}>▲</button>
          <button type="button" className="b" style={arrowBtn} aria-label={t(PONG_TXT.down)} data-dir="1" {...hold}>▼</button>
        </div>
      </div>
      <div className="s" role="status">
        {t(PONG_TXT.score, { a: view.a, b: view.b })}
        {msg && <> · {t(PONG_TXT[msg])}</>}
      </div>
      <div className="st">
        <button className="b" aria-pressed={!view.moon} onClick={toggle}>
          {t(view.moon ? PONG_TXT.moon : PONG_TXT.earth)}
        </button>
        <button className="b o" onClick={start}>
          {t(phase === "ready" ? PONG_TXT.start : phase === "play" ? PONG_TXT.restart : PONG_TXT.again)}
        </button>
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
