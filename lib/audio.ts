// Synthesised audio, ported 1:1 from the prototype (no audio files).
// The AudioContext is only created on a user gesture (`unlock`).

export type Sfx =
  | "step" | "click" | "blip" | "ok" | "bad" | "hit" | "crit" | "qhit" | "shield"
  | "star" | "thr" | "jump" | "whoosh" | "win" | "lose";
export type MusicMode = "cover" | "explore" | "battle";

let ac: AudioContext | null = null;
let mg: GainNode;
let sg: GainNode;
let nb: AudioBuffer;
let mus = true;
let sfxOn = true;
let tm: ReturnType<typeof setInterval> | undefined;
let ti = 0;
let mode: MusicMode | null = null;

/** Prototype `au()`; also starts any music requested before the unlock. */
export function unlock() {
  if (typeof window === "undefined") return;
  if (ac) {
    if (ac.state === "suspended") void ac.resume();
    return;
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ac = new AC();
  mg = ac.createGain();
  mg.gain.value = 0.15;
  mg.connect(ac.destination);
  sg = ac.createGain();
  sg.gain.value = 0.55;
  sg.connect(ac.destination);
  nb = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = nb.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  if (mode) music(mode);
}

function tone(f: number, d: number, ty: OscillatorType, v: number, o: AudioNode, sl?: number, t0?: number) {
  if (!ac) return;
  const t = ac.currentTime + (t0 || 0);
  const s = ac.createOscillator();
  const g = ac.createGain();
  s.type = ty;
  s.frequency.setValueAtTime(f, t);
  if (sl) s.frequency.exponentialRampToValueAtTime(sl, t + d);
  g.gain.setValueAtTime(v, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  s.connect(g);
  g.connect(o);
  s.start(t);
  s.stop(t + d);
}

function nz(d: number, v: number, o: AudioNode, fq: number) {
  if (!ac) return;
  const t = ac.currentTime;
  const s = ac.createBufferSource();
  const f = ac.createBiquadFilter();
  const g = ac.createGain();
  s.buffer = nb;
  f.type = "bandpass";
  f.frequency.value = fq;
  g.gain.setValueAtTime(v, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  s.connect(f);
  f.connect(g);
  g.connect(o);
  s.start(t);
  s.stop(t + d);
}

export function sfx(n: Sfx, k = 0) {
  if (!ac || !sfxOn) return;
  const T = (f: number, d: number, y: OscillatorType, v: number, s?: number, t?: number) => tone(f, d, y, v, sg, s, t);
  switch (n) {
    case "step": nz(0.05, 0.08, sg, 700); break;
    case "click": T(660, 0.07, "square", 0.12); break;
    case "blip": T(220 + k * 35, 0.05, "square", 0.07); break;
    case "ok": [523, 659, 784].forEach((f, i) => T(f, 0.18, "triangle", 0.25, 0, i * 0.07)); break;
    case "bad": T(170, 0.3, "sawtooth", 0.22, 80); break;
    case "hit": nz(0.15, 0.6, sg, 300); T(150, 0.2, "square", 0.35, 50); break;
    case "crit": nz(0.25, 0.7, sg, 500); T(220, 0.4, "sawtooth", 0.35, 1200); T(110, 0.4, "square", 0.4, 40); break;
    case "qhit": nz(0.3, 0.5, sg, 200); T(90, 0.45, "sawtooth", 0.5, 35); break;
    case "shield": T(1200, 0.3, "sine", 0.3, 500); break;
    case "star": T(880, 0.12, "triangle", 0.25); T(1320, 0.2, "triangle", 0.25, 0, 0.08); break;
    case "thr": nz(0.14, 0.25, sg, 450); break;
    case "jump": T(200, 0.35, "sine", 0.3, 800); break;
    case "whoosh": nz(0.5, 0.2, sg, 1500); break;
    case "win": [523, 659, 784, 1047, 1319].forEach((f, i) => T(f, 0.45, "triangle", 0.3, 0, i * 0.14)); break;
    case "lose": [392, 330, 262].forEach((f, i) => T(f, 0.4, "sawtooth", 0.2, 0, i * 0.2)); break;
  }
}

export function music(m: MusicMode) {
  mode = m;
  clearInterval(tm);
  ti = 0;
  if (!ac) return;
  tm = setInterval(() => {
    if (!mus || document.hidden) return;
    const i = ti++;
    const bs = [55, 55, 43.65, 49][(i >> 3) & 3];
    const r = [220, 261.6, 329.6, 392, 329.6, 261.6, 293.7, 392];
    const n = r[i % 8] * (m === "battle" && i % 16 > 7 ? 1.5 : 1);
    if (m === "battle") {
      if (i % 4 === 0) tone(120, 0.15, "sine", 0.5, mg, 40);
      if (i % 2) nz(0.03, 0.12, mg, 6000);
      tone(bs, 0.14, "sawtooth", 0.22, mg);
      tone(n, 0.12, "square", 0.12, mg);
    } else {
      if (i % 8 === 0) tone(bs * 2, 2, "triangle", 0.25, mg);
      tone(n, 0.5, "sine", 0.16, mg);
      if (m === "cover" && i % 16 === 0) tone(bs * 4, 3, "sawtooth", 0.05, mg, bs * 6);
    }
  }, m === "battle" ? 150 : m === "cover" ? 420 : 300);
}

export function setMusicOn(on: boolean) {
  mus = on;
}
export function setSfxOn(on: boolean) {
  sfxOn = on;
}
