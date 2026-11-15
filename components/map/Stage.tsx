"use client";

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import StarShards, { collectShards } from "@/components/games/StarShards";
import { sfx } from "@/lib/audio";
import { ORBI } from "@/lib/characters";
import {
  HINT_DONE,
  HINT_FINISHED,
  HINT_SENAL,
  HINT_SUFFIX,
  HT,
  ORD,
  SENAL_LOCKED,
  SENAL_UNLOCK,
  START_POS,
  ZONES,
  ZONE_INTRO,
  senalUnlocked,
} from "@/lib/content/story";
import type { Line, Localized } from "@/lib/content/types";
import { useT } from "@/lib/i18n";
import { padClear, padHas, setPadEnter, setPadNear } from "@/lib/pad";
import { isBusy, useGame, useUI } from "@/lib/store";
import Hotspot from "./Hotspot";
import Hud from "./Hud";
import { ZONE_LABELS, ZoneLabel } from "./MapLabel";
import NavBar from "./NavBar";
import ObjectiveBox from "./Objective";
import PlayerToken from "./PlayerToken";
import styles from "./map.module.css";

type Target = { x: number; y: number; after?: () => void };
type Controller = {
  go: (x: number, y: number, after?: () => void) => void;
  visit: (i: number) => void;
  enter: (i: number) => void;
  resetPos: () => void;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const normKey = (e: KeyboardEvent) => (e.key.length > 1 ? e.key : e.key.toLowerCase());
/** Where the hero stands to enter zone i (the dome hotspot is above the walkable area). */
const walkPoint = (i: number) => ({ x: ZONES[i].wx ?? ZONES[i].x, y: ZONES[i].wy ?? ZONES[i].y });
/** Fill {vars} in both languages (for dialogue lines, which the bubble shows without vars). */
const fill = (l: Localized, v: Record<string, number>): Localized => {
  const f = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? String(v[k]) : m));
  return { es: f(l.es), en: f(l.en) };
};

/** Prototype `enter(p)`: first visit plays the zone's intro dialogue, then opens its sub-menu. */
function enterZone(i: number) {
  if (isBusy()) return;
  const id = ZONES[i].id;
  const ui = useUI.getState();
  const done = useGame.getState().done;
  if (id === "senal" && !senalUnlocked(done)) {
    const d = ORD.filter((k) => done[k]).length;
    ui.startTalk(SENAL_LOCKED.map(([w, l]): Line => [w, fill(l as Localized, { d, k: SENAL_UNLOCK })]));
    return;
  }
  const open = () => useUI.getState().openModal({ kind: "zone", zone: id });
  if (done[id]) open();
  else ui.startTalk(ZONE_INTRO[id], open);
}

/** Prototype `hint()`: Orbi points to the next zone in ORD. */
export function hint() {
  if (isBusy()) return;
  const done = useGame.getState().done;
  const n = ORD.findIndex((k) => !done[k]);
  const lines: Line[] = [[2, done.boss ? HINT_FINISHED : n < 0 ? HINT_DONE : [HT[n], HINT_SUFFIX]]];
  if (senalUnlocked(done) && !done.senal) lines.push([2, HINT_SENAL]);
  useUI.getState().startTalk(lines);
}

/** The map: hotspots, walking hero + Orbi follower, HUD and painted nav buttons. */
export default function Stage() {
  const t = useT();
  const character = useGame((s) => s.character);
  const done = useGame((s) => s.done);
  const stageRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  const orbiRef = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const drag = useRef(false);
  const [near, setNear] = useState(-1);
  const next = ORD.findIndex((k) => !done[k]);

  // Movement loop: port of the prototype's `lp2` (acceleration, walk bob, Orbi follow,
  // proximity prompt) plus its key handlers.
  useEffect(() => {
    const p0 = useGame.getState().pos;
    const s = {
      x: p0.x, y: p0.y, vx: 0, vy: 0, fl: 1, stride: 0, lstep: 0,
      ox: p0.x - 5.5, oy: p0.y + 1.2, ovx: 0, ovy: 0, ofl: 1, last: 0, np: -1, moving: false,
      tgt: null as Target | null,
    };
    const K = new Set<string>();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const save = () => useGame.getState().setPos(+s.x.toFixed(2), +s.y.toFixed(2));

    const go = (x: number, y: number, after?: () => void) => {
      s.tgt = { x: clamp(x, 3, 97), y: clamp(y, 24, 93), after };
    };
    const c: Controller = {
      go,
      enter: enterZone,
      visit: (i) => {
        const w = walkPoint(i);
        go(w.x, w.y, () => enterZone(i));
      },
      resetPos: () => {
        s.x = START_POS.x;
        s.y = START_POS.y;
        s.tgt = null;
        save();
      },
    };
    ctrl.current = c;

    let raf = 0;
    const frame = (tm: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (tm - s.last) / 1e3 || 0.016);
      s.last = tm;
      const tk = tokenRef.current;
      if (!tk) return;
      const busy = isBusy();
      let ax = 0;
      let ay = 0;
      if (!busy) {
        // The phone D-pad (lib/pad.ts) holds virtual arrow keys: same movement as the keyboard.
        const has = (k: string) => K.has(k) || padHas(k);
        const dx = +(has("d") || has("ArrowRight")) - +(has("a") || has("ArrowLeft"));
        const dy = +(has("s") || has("ArrowDown")) - +(has("w") || has("ArrowUp"));
        if (dx || dy) {
          s.tgt = null;
          const m = Math.hypot(dx, dy);
          ax = (dx / m) * 30;
          ay = (dy / m) * 30;
        } else if (s.tgt) {
          const ex = s.tgt.x - s.x;
          const ey = (s.tgt.y - s.y) * 0.56;
          const d = Math.hypot(ex, ey);
          if (d < 0.7) {
            s.x = s.tgt.x;
            s.y = s.tgt.y;
            const a = s.tgt.after;
            s.tgt = null;
            if (a) a();
          } else {
            const sp = 30 * Math.min(1, d / 5 + 0.2);
            ax = (ex / d) * sp;
            ay = (ey / d) * sp;
          }
        }
      }
      s.vx += (ax - s.vx) * Math.min(1, dt * 9);
      s.vy += (ay - s.vy) * Math.min(1, dt * 9);
      s.x = clamp(s.x + s.vx * dt, 3, 97);
      s.y = clamp(s.y + (s.vy * dt) / 0.56, 24, 93);
      const sp = Math.hypot(s.vx, s.vy);
      const mv = sp > 2;
      if (Math.abs(s.vx) > 1) s.fl = s.vx < 0 ? -1 : 1;
      s.stride += sp * dt * 0.1;
      const ph = Math.floor((s.stride * 3.1) / Math.PI);
      if (mv && ph !== s.lstep) {
        s.lstep = ph;
        sfx("step");
      }
      tk.style.left = s.x + "%";
      tk.style.top = s.y + "%";
      tk.style.zIndex = String(3 + Math.round(s.y));
      tk.style.setProperty("--fl", String(s.fl));
      // Walk bob (in % of the sprite height) + slight squash; none with reduced motion.
      const bob = mv && !reduce.matches;
      tk.style.setProperty("--by", (bob ? Math.abs(Math.sin(s.stride * 3.1)) * 3 : 0).toFixed(2));
      tk.style.setProperty("--sq", (1 + (bob ? Math.sin(s.stride * 6.2) * 0.025 : 0)).toFixed(4));
      const o = orbiRef.current;
      if (o) {
        // Orbi follows a spot just behind the hero on a critically damped spring (eases in and out).
        const fx = s.x - 5.5 * s.fl;
        const fy = s.y + 1.2;
        const k = 10;
        const c = 2 * Math.sqrt(k);
        s.ovx += ((fx - s.ox) * k - s.ovx * c) * dt;
        s.ovy += ((fy - s.oy) * k - s.ovy * c) * dt;
        s.ox += s.ovx * dt;
        s.oy += s.ovy * dt;
        o.style.left = s.ox + "%";
        o.style.top = s.oy + "%";
        o.style.zIndex = String(3 + Math.round(s.oy));
        if (Math.abs(s.x - s.ox) > 0.6) s.ofl = s.x > s.ox ? 1 : -1;
        o.style.setProperty("--fl", String(s.ofl));
        // Gentle hover above its shadow; the shadow shrinks and fades as it rises.
        const lift = 14 + (reduce.matches ? 0 : Math.sin(tm / 650) * 5);
        o.style.setProperty("--by", lift.toFixed(2));
        o.style.setProperty("--ss", (1.25 - lift / 40).toFixed(3));
      }
      collectShards(s.x, s.y);
      const np = busy ? -1 : ZONES.findIndex((_, i) => {
        const w = walkPoint(i);
        return Math.hypot(w.x - s.x, (w.y - s.y) * 0.56) < 4;
      });
      if (np !== s.np) {
        s.np = np;
        setNear(np);
        setPadNear(np >= 0);
      }
      // Persist the position whenever the hero comes to a stop.
      if (s.moving && !mv && !s.tgt) save();
      s.moving = mv;
    };
    raf = requestAnimationFrame(frame);

    const onDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return; // e.g. consumed by the speech bubble
      const k = normKey(e);
      if ((k === "e" || k === "Enter") && s.np >= 0 && !isBusy()) {
        enterZone(s.np);
        return;
      }
      K.add(k);
      if (k.startsWith("Arrow")) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => K.delete(normKey(e));
    const onBlur = () => {
      K.clear();
      padClear();
    };
    // The phone "Entrar / Enter" button does what E / Enter does here.
    setPadEnter(() => {
      if (s.np >= 0 && !isBusy()) enterZone(s.np);
    });
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);

    // Panels (e.g. Missions) ask the map to walk to a zone.
    const unsub = useUI.subscribe((st, prev) => {
      if (st.visitReq && st.visitReq !== prev.visitReq) c.visit(st.visitReq.i);
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
      setPadEnter(null);
      setPadNear(false);
      padClear();
      unsub();
      save();
      ctrl.current = null;
    };
  }, []);

  const moveTo = (e: RPointerEvent<HTMLDivElement>) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    ctrl.current?.go(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("[data-ui]")) return;
        drag.current = true;
        moveTo(e);
      }}
      onPointerMove={(e) => {
        if (drag.current) moveTo(e);
      }}
      onPointerUp={() => (drag.current = false)}
      onPointerLeave={() => (drag.current = false)}
    >
      {/* HTML copies of the zone labels painted in map.jpg, so EN players don't see Spanish. */}
      {ZONES.map((p, i) => {
        const geo = ZONE_LABELS[p.id];
        return geo && p.sub ? (
          <ZoneLabel key={p.id} geo={geo} title={t(p.n)} sub={t(p.sub)} onSelect={() => ctrl.current?.visit(i)} />
        ) : null;
      })}
      {ZONES.map((p, i) => (
        <Hotspot
          key={p.id}
          x={p.x}
          y={p.y}
          label={t(p.n)}
          next={i === next}
          locked={p.id === "senal" && !senalUnlocked(done)}
          onSelect={() => ctrl.current?.visit(i)}
        />
      ))}
      <StarShards />
      <PlayerToken ref={tokenRef} ch={character} />
      <PlayerToken ref={orbiRef} ch={ORBI} orbi />
      <Hud />
      <NavBar onMap={() => ctrl.current?.resetPos()} />
      <button data-ui className={`b o ${styles.tool} ${styles.tool1}`} onClick={() => useUI.getState().openModal({ kind: "ar" })}>
        {t("hub.ar")}
      </button>
      <button data-ui className={`b o ${styles.tool} ${styles.tool2}`} onClick={hint}>
        {t("hub.hint")}
      </button>
      <ObjectiveBox className={styles.obj} cls={{ steps: styles.objSteps, on: styles.objOn, ok: styles.objOk, next: styles.objNext }} />
      {/* No overlay AI label here: map.jpg carries its own burned-in label along the bottom
          edge (scripts/extract_assets.py), placed clear of the painted buttons. */}
      {near >= 0 && (
        <button data-ui className={`b o ${styles.pr}`} onClick={() => ctrl.current?.enter(near)}>
          {t("hub.enter", { zone: t(ZONES[near].n) })}
          <span className={styles.kh}> {t("hub.enterKey")}</span>
        </button>
      )}
    </div>
  );
}
