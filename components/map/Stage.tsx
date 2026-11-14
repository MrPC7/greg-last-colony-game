"use client";

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import StarShards, { collectShards } from "@/components/games/StarShards";
import { sfx } from "@/lib/audio";
import { ORBI } from "@/lib/characters";
import { HINT_DONE, HINT_SUFFIX, HT, ORD, START_POS, ZONES, ZONE_INTRO } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { isBusy, useGame, useUI } from "@/lib/store";
import Hotspot from "./Hotspot";
import Hud from "./Hud";
import NavBar from "./NavBar";
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

/** Prototype `enter(p)`: first visit plays the zone's intro dialogue, then opens its sub-menu. */
function enterZone(i: number) {
  if (isBusy()) return;
  const id = ZONES[i].id;
  const ui = useUI.getState();
  const open = () => useUI.getState().openModal({ kind: "zone", zone: id });
  if (useGame.getState().done[id]) open();
  else ui.startTalk(ZONE_INTRO[id], open);
}

/** Prototype `hint()`: Orbi points to the next zone in ORD. */
function hint() {
  if (isBusy()) return;
  const done = useGame.getState().done;
  const n = ORD.findIndex((k) => !done[k]);
  useUI.getState().startTalk([[2, n < 0 ? HINT_DONE : [HT[n], HINT_SUFFIX]]]);
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
      ox: p0.x - 6, oy: p0.y + 1.5, last: 0, np: -1, moving: false,
      tgt: null as Target | null,
    };
    const K = new Set<string>();
    const save = () => useGame.getState().setPos(+s.x.toFixed(2), +s.y.toFixed(2));

    const go = (x: number, y: number, after?: () => void) => {
      s.tgt = { x: clamp(x, 3, 97), y: clamp(y, 24, 93), after };
    };
    const c: Controller = {
      go,
      enter: enterZone,
      visit: (i) => go(ZONES[i].x, ZONES[i].y, () => enterZone(i)),
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
        const dx = +(K.has("d") || K.has("ArrowRight")) - +(K.has("a") || K.has("ArrowLeft"));
        const dy = +(K.has("s") || K.has("ArrowDown")) - +(K.has("w") || K.has("ArrowUp"));
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
      tk.style.setProperty("--by", (mv ? -Math.abs(Math.sin(s.stride * 3.1)) * 5 : 0) + "px");
      tk.style.setProperty("--sq", String(1 + (mv ? Math.sin(s.stride * 6.2) * 0.03 : 0)));
      const o = orbiRef.current;
      if (o) {
        s.ox += (s.x - 6 * s.fl - s.ox) * Math.min(1, dt * 3);
        s.oy += (s.y + 1.5 - s.oy) * Math.min(1, dt * 3);
        o.style.left = s.ox + "%";
        o.style.top = s.oy + "%";
        o.style.zIndex = String(3 + Math.round(s.oy));
        o.style.setProperty("--fl", s.x > s.ox ? "1" : "-1");
        o.style.setProperty("--by", Math.sin(tm / 260) * 4 + "px");
      }
      collectShards(s.x, s.y);
      const np = busy ? -1 : ZONES.findIndex((p) => Math.hypot(p.x - s.x, (p.y - s.y) * 0.56) < 4);
      if (np !== s.np) {
        s.np = np;
        setNear(np);
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
    const onBlur = () => K.clear();
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
      {ZONES.map((p, i) => (
        <Hotspot key={p.id} x={p.x} y={p.y} label={t(p.n)} next={i === next} onSelect={() => ctrl.current?.visit(i)} />
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
      {near >= 0 && (
        <button data-ui className={`b o ${styles.pr}`} onClick={() => ctrl.current?.enter(near)}>
          {t("hub.enter", { zone: t(ZONES[near].n) })}
        </button>
      )}
    </div>
  );
}
