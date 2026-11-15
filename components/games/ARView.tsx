"use client";

import { GameTitle, NasaFactCard } from "@/components/ui/NasaFact";
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { sfx } from "@/lib/audio";
import { AR, AR_TXT } from "@/lib/content/games";
import { translate, useLang, useT, type Lang } from "@/lib/i18n";
import { awardWin } from "@/lib/store";

type Particle = { x: number; y: number; b: number; h?: boolean };
type State = { x: number; y: number; m: number; rot: number; live: boolean; p: Particle[] };

/** Prototype `arl` (final version): one frame of the selected model over the camera (or a space
 *  gradient when there is no camera). 0 Moon day/night, 1 lander, 2 radiation shield, 3 suit. */
function frame(c: HTMLCanvasElement, s: State, z: number, lang: Lang) {
  const x = c.getContext("2d");
  if (!x) return;
  const L2 = (k: keyof typeof AR_TXT, v?: Record<string, number>) => translate(lang, AR_TXT[k], v);
  const { m, x: X, y: Y } = s;
  x.clearRect(0, 0, AR.w, AR.h);
  if (!s.live) {
    const g = x.createLinearGradient(0, 0, 0, AR.h);
    g.addColorStop(0, "#05031a");
    g.addColorStop(1, "#2a1a5e");
    x.fillStyle = g;
    x.fillRect(0, 0, AR.w, AR.h);
  }
  s.rot += 0.01;
  x.shadowColor = "#000";
  x.shadowBlur = 4;
  x.font = "bold 14px system-ui";
  let lb: keyof typeof AR_TXT;
  if (m === 0) {
    lb = "moon";
    x.save();
    x.translate(X, Y);
    x.scale(z, z);
    const R = 70;
    const g = x.createRadialGradient(-20, -20, 10, 0, 0, R);
    g.addColorStop(0, "#eee");
    g.addColorStop(1, "#6d6d78");
    x.fillStyle = g;
    x.beginPath();
    x.arc(0, 0, R, 0, 7);
    x.fill();
    x.save();
    x.beginPath();
    x.arc(0, 0, R, 0, 7);
    x.clip();
    x.rotate(s.rot);
    x.fillStyle = "rgba(255,120,0,.4)";
    x.fillRect(-R, -R, R, 2 * R);
    x.fillStyle = "rgba(0,80,255,.45)";
    x.fillRect(0, -R, R, 2 * R);
    x.restore();
    x.restore();
    x.fillStyle = "#ffb74d";
    x.fillText(L2("day"), X - 80 * z, Y - R * z - 10);
    x.fillStyle = "#90caf9";
    x.fillText(L2("night"), X - 80 * z, Y + R * z + 20);
  } else if (m === 1) {
    lb = "lander";
    x.save();
    x.translate(X, Y);
    x.scale(z, z);
    x.fillStyle = "#ffd54a";
    x.fillRect(-30, -30, 60, 50);
    x.fillStyle = "#9ad";
    x.fillRect(-12, -20, 24, 18);
    x.strokeStyle = "#eee";
    x.lineWidth = 4;
    x.beginPath();
    x.moveTo(-30, 20);
    x.lineTo(-52, 50);
    x.moveTo(30, 20);
    x.lineTo(52, 50);
    x.stroke();
    x.fillStyle = "#ddd";
    x.fillRect(-60, 50, 16, 4);
    x.fillRect(44, 50, 16, 4);
    x.restore();
  } else if (m === 2) {
    lb = "rad";
    if (Math.random() < 0.7) s.p.push({ x: 30, y: Math.random() * AR.h, b: Math.random() });
    const pass = Math.exp(-1.1 * z);
    x.fillStyle = "#ffd54a";
    x.beginPath();
    x.arc(14, 210, 24, 0, 7);
    x.fill();
    s.p = s.p.filter((p) => {
      p.x += 6;
      if (!p.h && Math.abs(p.y - Y) < 50 && p.x > X - 56) {
        p.h = true;
        if (p.b > pass) return false;
      }
      x.fillStyle = p.h ? "#ff5252" : "#ffe082";
      x.fillRect(p.x, p.y, 7, 2);
      return p.x < AR.w;
    });
    x.fillStyle = "#9ad";
    x.beginPath();
    x.arc(X, Y, 30, Math.PI, 0);
    x.fillRect(X - 30, Y, 60, 26);
    x.fill();
    x.strokeStyle = "#7df9ff";
    x.lineWidth = 3 + 5 * z;
    x.beginPath();
    x.arc(X, Y, 48, Math.PI * 0.5, Math.PI * 1.5);
    x.stroke();
    x.fillStyle = "#fff";
    x.fillText(L2("dose", { p: Math.round(pass * 100) }), X - 50, Y + 58);
  } else {
    lb = "suit";
    x.save();
    x.translate(X, Y);
    x.scale(z, z);
    x.fillStyle = "#bbb";
    x.fillRect(-30, -34, 12, 44);
    x.fillStyle = "#fff";
    x.fillRect(-20, -36, 40, 52);
    x.fillRect(-36, -30, 12, 40);
    x.fillRect(24, -30, 12, 40);
    x.fillRect(-18, 16, 16, 44);
    x.fillRect(2, 16, 16, 44);
    x.fillStyle = "#888";
    x.fillRect(-20, 56, 20, 8);
    x.fillRect(2, 56, 20, 8);
    x.beginPath();
    x.arc(0, -60, 22, 0, 7);
    x.fillStyle = "#fff";
    x.fill();
    x.fillStyle = "#f5c542";
    x.beginPath();
    x.ellipse(0, -60, 15, 12, 0, 0, 7);
    x.fill();
    x.restore();
    x.fillStyle = "#fff";
    x.fillText(L2("visor"), X + 30 * z, Y - 70 * z);
    x.fillText(L2("pack"), Math.max(6, X - 210 * z), Y - 10 * z);
    x.fillText(L2("layers"), X + 40 * z, Y + 10 * z);
    x.fillText(L2("boots"), X + 30 * z, Y + 64 * z);
  }
  x.fillStyle = "#fff";
  x.fillText(L2(lb), 12, 404);
  x.shadowBlur = 0;
}

/** Prototype `ar` / `ars` / `arm`: low-cost AR — the rear camera (getUserMedia) with a drawn model
 *  you drag into place; without camera access it falls back to a space background.
 *  "Change model" cycles the 4 models; seeing all 4 → 2 ★ (activity "ar"). */
export default function ARView() {
  const t = useT();
  const lang = useLang();
  const cv = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const size = useRef<HTMLInputElement>(null);
  const st = useRef<State>({ x: AR.x0, y: AR.y0, m: 0, rot: 0, live: false, p: [] });
  const seen = useRef(new Set([0]));
  const langRef = useRef(lang);
  const [cam, setCam] = useState<"opening" | "live" | "fail">("opening");
  /** UI only: show the NASA Fact card once all the models have been seen */
  const [allSeen, setAllSeen] = useState(false);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    let on = true;
    let stream: MediaStream | null = null;
    let r = 0;
    const loop = () => {
      if (!on) return;
      const c = cv.current;
      if (!c) return;
      frame(c, st.current, +(size.current?.value ?? 1), langRef.current);
      r = requestAnimationFrame(loop);
    };
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!on) {
          s.getTracks().forEach((tr) => tr.stop());
          return;
        }
        stream = s;
        if (video.current) video.current.srcObject = s;
        st.current.live = true;
        setCam("live");
      } catch {
        if (on) setCam("fail");
      }
      if (on) r = requestAnimationFrame(loop);
    })();
    return () => {
      on = false;
      cancelAnimationFrame(r);
      stream?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  const place = (e: RPointerEvent<HTMLCanvasElement>) => {
    if (e.type === "pointermove" && !e.buttons) return;
    const r = e.currentTarget.getBoundingClientRect();
    st.current.x = ((e.clientX - r.left) / r.width) * AR.w;
    st.current.y = ((e.clientY - r.top) / r.height) * AR.h;
  };

  const change = () => {
    const s = st.current;
    s.m = (s.m + 1) % AR.models;
    seen.current.add(s.m);
    sfx("click");
    if (seen.current.size >= AR.models) awardWin("ar", AR.stars);
    if (seen.current.size >= AR.models) setAllSeen(true);
  };

  return (
    <>
      <GameTitle fact="ar">{t(AR_TXT.title)}</GameTitle>
      <div className="arw">
        <video ref={video} playsInline muted autoPlay style={cam === "live" ? { display: "block" } : undefined} />
        <canvas
          ref={cv}
          width={AR.w}
          height={AR.h}
          aria-label={t(AR_TXT.canvas)}
          style={{ touchAction: "none" }}
          onPointerDown={place}
          onPointerMove={place}
        />
      </div>
      <p className="s" id="am">{t(AR_TXT[cam])}</p>
      <label>
        {t(AR_TXT.size)}
        <input type="range" id="az" ref={size} min={AR.zMin} max={AR.zMax} step={AR.zStep} defaultValue={1} />
      </label>
      <button className="b" onClick={change}>{t(AR_TXT.change)}</button>
      <p className="s">{t(AR_TXT.how)}</p>
      {allSeen && <NasaFactCard fact="ar" />}
    </>
  );
}
