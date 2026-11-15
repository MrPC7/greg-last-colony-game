// Pure physics + Joseph's AI for LunarPingPong. No React, no DOM, no imports: the component drives it
// every animation frame, and it can be stepped headlessly (e.g. to tune Joseph's difficulty).

export type PongCfg = {
  w: number; h: number; scale: number; gEarth: number; gMoon: number;
  paddleH: number; playerH: number; playerHTouch: number; paddleW: number; ball: number;
  serveVx: number; serveVy: number; speedUp: number; maxVx: number; maxVy: number; spin: number;
  minBounce: number; playerSpeed: number; dragSpeed: number;
  aiSpeed: number; aiReact: number; aiError: number; countdown: number; pointPause: number; target: number;
};

export type PongSim = {
  bx: number; by: number; vx: number; vy: number;
  /** Paddle tops; `ph` = your paddle height (bigger on touch screens). */
  py: number; ay: number; ph: number;
  /** Pointer / finger target (canvas y) or null; held keys; held on-screen ▲▼ (-1, 0, 1). */
  target: number | null; keys: { up: boolean; down: boolean }; nudge: -1 | 0 | 1;
  /** Joseph: seconds before he starts tracking the ball, and his aiming error (px) for this return. */
  react: number; err: number;
  moon: boolean;
  /** True if the Moon gravity was on at any moment of the current rally (Earth stars need a full Earth rally). */
  rallyMoon: boolean;
  live: boolean;
  /** Seconds until the next serve (0 = no serve pending); the last `cfg.countdown` s are shown as 3-2-1. */
  wait: number; serveDir: 1 | -1;
  score: [number, number]; over: boolean;
};

/** What happened during a step (for sound and UI). `point`: 0 = you scored, 1 = Joseph scored. */
export type PongEvent = { hit?: 0 | 1; point?: 0 | 1; serve?: boolean };

const PX = 14; // left edge of your paddle
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const paddleX = (c: PongCfg) => ({ you: PX, joe: c.w - PX - c.paddleW });

export function newSim(c: PongCfg, touch: boolean): PongSim {
  const ph = touch ? c.playerHTouch : c.playerH;
  return {
    bx: c.w / 2, by: c.h / 3, vx: 0, vy: 0, py: (c.h - ph) / 2, ay: (c.h - c.paddleH) / 2, ph,
    target: null, keys: { up: false, down: false }, nudge: 0,
    react: 0, err: 0, moon: true, rallyMoon: true, live: false, wait: 0, serveDir: 1,
    score: [0, 0], over: false,
  };
}

/** Reset the match (keeps gravity, paddle size and input state) and queue the first serve. */
export function startMatch(s: PongSim, c: PongCfg, rnd: () => number) {
  s.score = [0, 0];
  s.over = false;
  queueServe(s, c, rnd() < 0.5 ? 1 : -1, c.countdown);
}

function queueServe(s: PongSim, c: PongCfg, dir: 1 | -1, delay: number) {
  s.live = false;
  s.bx = c.w / 2;
  s.by = c.h / 3;
  s.vx = 0;
  s.vy = 0;
  s.serveDir = dir;
  s.wait = delay;
}

/** Joseph's reaction delay and aim error, re-rolled every time the ball starts coming his way. */
function rollJoseph(s: PongSim, c: PongCfg, rnd: () => number) {
  s.react = c.aiReact * (0.7 + 0.6 * rnd());
  s.err = (rnd() * 2 - 1) * c.paddleH * c.aiError;
}

export function toggleGravity(s: PongSim) {
  s.moon = !s.moon;
  if (s.moon) s.rallyMoon = true;
}

/** Seconds of the 3-2-1 countdown to show (0 = none). */
export const countdownLeft = (s: PongSim, c: PongCfg) => (s.wait > 0 && s.wait <= c.countdown ? s.wait : 0);

export function step(s: PongSim, c: PongCfg, dt: number, rnd: () => number): PongEvent {
  const ev: PongEvent = {};
  const { w: W, h: H, paddleW: PW, paddleH: AH, ball: R } = c;
  const { you: YX, joe: JX } = paddleX(c);

  // --- Your paddle: keys / ▲▼ at a fixed speed, pointer by following the finger quickly.
  const dir = (s.keys.down ? 1 : 0) - (s.keys.up ? 1 : 0) + s.nudge;
  if (dir) s.py += clamp(dir, -1, 1) * c.playerSpeed * dt;
  else if (s.target !== null) s.py += clamp(s.target - s.ph / 2 - s.py, -c.dragSpeed * dt, c.dragSpeed * dt);
  s.py = clamp(s.py, 0, H - s.ph);

  // --- Joseph: once the ball heads his way he waits `react` s, then chases the ball's *current* height
  // (no prediction) plus his aim error. Otherwise he drifts back to the middle.
  let aim = H / 2;
  if (s.live && s.vx > 0) {
    if (s.react > 0) { s.react -= dt; aim = s.ay + AH / 2; }
    else aim = s.by + s.err;
  }
  s.ay = clamp(s.ay + clamp(aim - AH / 2 - s.ay, -c.aiSpeed * dt, c.aiSpeed * dt), 0, H - AH);

  // --- Serve countdown.
  if (!s.live) {
    if (s.wait > 0 && !s.over) {
      s.wait -= dt;
      if (s.wait <= 0) {
        s.wait = 0;
        s.live = true;
        s.vx = s.serveDir * c.serveVx;
        s.vy = -c.serveVy;
        s.rallyMoon = s.moon;
        if (s.serveDir === 1) rollJoseph(s, c, rnd);
        ev.serve = true;
      }
    }
    return ev;
  }

  // --- Ball: sub-stepped so that it never moves more than R/2 per sub-step, with a swept test against
  // each paddle's face (the ball can't tunnel through even at max speed).
  const g = (s.moon ? c.gMoon : c.gEarth) * c.scale;
  const n = Math.max(1, Math.ceil((Math.hypot(s.vx, s.vy) * dt) / (R / 2)));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.vy = clamp(s.vy + g * h, -c.maxVy, c.maxVy);
    const x0 = s.bx;
    const y0 = s.by;
    s.bx += s.vx * h;
    s.by += s.vy * h;
    // Elastic floor / ceiling, with a minimum rebound speed (the floor bounce reaches at least `minBounce` of
    // the table height), so the ball can't end up rolling along the floor after a dead-centre paddle hit, or
    // sliding along the ceiling in Moon gravity after a slow upward one.
    const vMin = Math.sqrt(2 * g * H * c.minBounce);
    if (s.by > H - R) {
      s.by = H - R - (s.by - (H - R));
      s.vy = -Math.max(Math.abs(s.vy), vMin);
    }
    if (s.by < R) {
      s.by = R + (R - s.by);
      s.vy = Math.max(Math.abs(s.vy), vMin);
    }
    s.by = clamp(s.by, R, H - R);
    // Swept paddle faces: did the ball's leading edge cross the face plane during this sub-step?
    const face = (fx: number, top: number, ph: number, side: 1 | -1): boolean => {
      const e0 = x0 - side * R;
      const e1 = s.bx - side * R;
      if (side === 1 ? !(e0 >= fx && e1 < fx) : !(e0 <= fx && e1 > fx)) return false;
      const t = (e0 - fx) / (e0 - e1);
      const yc = y0 + (s.by - y0) * t;
      if (yc < top - R || yc > top + ph + R) return false;
      const off = clamp((yc - (top + ph / 2)) / (ph / 2), -1, 1);
      const sp = Math.min(c.maxVx, Math.abs(s.vx) * c.speedUp);
      s.vx = side * sp;
      s.vy = clamp(s.vy * 0.4 + off * c.spin, -c.maxVy, c.maxVy);
      s.bx = fx + side * R;
      s.by = clamp(yc, R, H - R);
      return true;
    };
    if (s.vx < 0 && face(YX + PW, s.py, s.ph, 1)) {
      ev.hit = 0;
      rollJoseph(s, c, rnd);
    } else if (s.vx > 0 && face(JX, s.ay, AH, -1)) ev.hit = 1;

    // --- Scoring: exactly once per rally (the rally ends here).
    const out: 0 | 1 | null = s.bx < -R ? 1 : s.bx > W + R ? 0 : null;
    if (out !== null) {
      s.score[out]++;
      ev.point = out;
      if (s.score[out] >= c.target) {
        s.over = true;
        queueServe(s, c, 1, 0);
      } else {
        // The side that lost the point receives the next serve.
        queueServe(s, c, out === 0 ? 1 : -1, c.pointPause + c.countdown);
      }
      break;
    }
  }
  return ev;
}
