"use client";

import { useEffect, useRef, useState, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { Portrait } from "@/components/ui/Portrait";
import Watermark from "@/components/ui/Watermark";
import { CH } from "@/lib/characters";
import { HINT_DONE, HINT_FINISHED, HINT_SENAL, HT, ORD, senalUnlocked } from "@/lib/content/story";
import type { Localized } from "@/lib/content/types";
import { haptic } from "@/lib/haptics";
import { useT, type UIKey } from "@/lib/i18n";
import { padClear, padEnter, padKeys, padSet, usePadNear } from "@/lib/pad";
import { resolveSpeaker, useGame, useUI } from "@/lib/store";
import { hint } from "./Stage";
import styles from "./phone.module.css";

/** Phone controls under the map (CSS shows it only on phones: ≤ 820px, or phone landscape):
 *  [Info] [Control] [Chat]. In portrait Info + Chat share a row with Control below; in phone
 *  landscape the three stack beside the map. Desktop never sees it. */
export default function PhoneBar() {
  return (
    <div id="pbar" className={styles.bar}>
      <Info />
      <Control />
      <Chat />
    </div>
  );
}

// ---- Info: current goal + compact help, collapsible ------------------------

const INFO_KEY = "colonia-pad-info";

function readInfoOpen() {
  try {
    const v = localStorage.getItem(INFO_KEY);
    if (v !== null) return v === "1";
  } catch {
    // storage blocked: fall back to the default below
  }
  // Default: open in portrait, folded in phone landscape where height is scarce.
  return typeof window === "undefined" || !window.matchMedia("(orientation: landscape) and (max-height: 520px)").matches;
}

function Info() {
  const t = useT();
  const done = useGame((s) => s.done);
  const [open, setOpen] = useState(readInfoOpen);
  const toggle = () => {
    setOpen(!open);
    try {
      localStorage.setItem(INFO_KEY, open ? "0" : "1");
    } catch {
      // per-device convenience only
    }
  };
  // Same goal Orbi's 💡 hint gives (Stage.tsx `hint`), shown without opening a dialogue.
  const n = ORD.findIndex((k) => !done[k]);
  const goal: Localized[] = [done.boss ? HINT_FINISHED : n < 0 ? HINT_DONE : HT[n]];
  if (senalUnlocked(done) && !done.senal) goal.push(HINT_SENAL);
  return (
    <section className={`${styles.panel} ${styles.info}`} aria-label={t("pad.info")}>
      <button className={styles.head} onClick={toggle} aria-expanded={open} aria-label={`${t("pad.info")} · ${t("pad.infoToggle")}`}>
        <span>📖 {t("pad.info")}</span>
        <span aria-hidden className={styles.chev}>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className={styles.body}>
          <p className={styles.goal}>
            <b>🎯 {t("pad.next")}</b> {t(goal)}
          </p>
          <p className={styles.help}>{t("pad.help")}</p>
        </div>
      )}
    </section>
  );
}

// ---- Control: D-pad + Enter ------------------------------------------------

const DIRS: { k: string; label: UIKey; glyph: string; cls: string }[] = [
  { k: "ArrowUp", label: "pad.up", glyph: "▲", cls: styles.up },
  { k: "ArrowLeft", label: "pad.left", glyph: "◀", cls: styles.left },
  { k: "ArrowRight", label: "pad.right", glyph: "▶", cls: styles.right },
  { k: "ArrowDown", label: "pad.down", glyph: "▼", cls: styles.down },
];

/** Keys for a point on the pad: a 3×3 grid, edges = one arrow, corners = diagonal, centre = none.
 *  Points outside the pad clamp to the nearest cell, so sliding the thumb off keeps walking. */
function keysAt(el: HTMLElement, x: number, y: number) {
  const r = el.getBoundingClientRect();
  const col = Math.max(0, Math.min(2, Math.floor(((x - r.left) / r.width) * 3)));
  const row = Math.max(0, Math.min(2, Math.floor(((y - r.top) / r.height) * 3)));
  const ks: string[] = [];
  if (row === 0) ks.push("ArrowUp");
  if (row === 2) ks.push("ArrowDown");
  if (col === 0) ks.push("ArrowLeft");
  if (col === 2) ks.push("ArrowRight");
  return ks;
}

function Control() {
  const t = useT();
  const padRef = useRef<HTMLDivElement>(null);
  const active = useRef(new Map<number, string>());
  const [on, setOn] = useState<Set<string>>(() => new Set());
  const talking = useUI((s) => !!s.talk);
  const near = usePadNear();
  const keyAt = useRef(0);

  useEffect(() => {
    const pad = padRef.current;
    // iOS: a non-passive touchstart stops the long-press magnifier / callout and page scroll while
    // the thumb is on the pad (touch-action covers the rest). Pointer events still fire.
    const stop = (e: TouchEvent) => e.preventDefault();
    pad?.addEventListener("touchstart", stop, { passive: false });
    const release = () => {
      active.current.clear();
      padClear();
      setOn(new Set());
    };
    window.addEventListener("blur", release);
    document.addEventListener("visibilitychange", release);
    return () => {
      pad?.removeEventListener("touchstart", stop);
      window.removeEventListener("blur", release);
      document.removeEventListener("visibilitychange", release);
      release();
    };
  }, []);

  const track = (e: RPointerEvent<HTMLDivElement>, down: boolean) => {
    const pad = padRef.current;
    if (!pad) return;
    const ks = down ? keysAt(pad, e.clientX, e.clientY) : [];
    const sig = ks.join("+");
    if (active.current.get(e.pointerId) === sig) return;
    const was = active.current.get(e.pointerId);
    if (down) active.current.set(e.pointerId, sig);
    else active.current.delete(e.pointerId);
    padSet(e.pointerId, ks);
    // A light tap each time the thumb lands on a new direction.
    if (ks.length && sig !== was) haptic(8);
    setOn(padKeys());
  };

  const onEnterKey = (e: RKeyboardEvent<HTMLButtonElement>) => {
    // Keyboard on the focused button: act once here (the map's own Enter handler then skips the
    // prevented event, and the button's synthetic click is ignored below).
    if (e.defaultPrevented || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    keyAt.current = performance.now();
    padEnter();
  };

  return (
    <section className={`${styles.panel} ${styles.ctrl}`} aria-label={t("pad.controls")}>
      <div
        ref={padRef}
        className={styles.pad}
        role="group"
        aria-label={t("pad.controls")}
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          track(e, true);
        }}
        onPointerMove={(e) => {
          if (active.current.has(e.pointerId)) track(e, true);
        }}
        onPointerUp={(e) => track(e, false)}
        onPointerCancel={(e) => track(e, false)}
        onLostPointerCapture={(e) => track(e, false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {DIRS.map((d) => (
          <button
            key={d.k}
            type="button"
            tabIndex={-1}
            className={`${styles.dir} ${d.cls}`}
            data-on={on.has(d.k) || undefined}
            aria-label={t(d.label)}
          >
            <span aria-hidden>{d.glyph}</span>
          </button>
        ))}
        <span aria-hidden className={styles.hub} />
      </div>
      <button
        type="button"
        className={styles.enter}
        data-talk={talking || undefined}
        data-ready={(!talking && near) || undefined}
        data-idle={(!talking && !near) || undefined}
        onKeyDown={onEnterKey}
        onPointerDown={() => haptic(12)}
        onClick={() => {
          if (performance.now() - keyAt.current < 600) return;
          padEnter();
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {talking ? `${t("pad.continue")} ▶` : t("pad.enter")}
      </button>
    </section>
  );
}

// ---- Chat: the dialogue that the speech bubble shows on larger screens -----

function Chat() {
  const t = useT();
  const talk = useUI((s) => s.talk);
  const advance = useUI((s) => s.advanceTalk);
  const hero = useGame((s) => s.character);

  if (!talk) {
    return (
      <section className={`${styles.panel} ${styles.chat}`} aria-label={t("pad.chat")}>
        <div className={styles.head}>
          <span>💬 {t("pad.chat")}</span>
        </div>
        <div className={styles.body}>
          <p className={styles.idle}>{t("pad.chatIdle")}</p>
          <button type="button" className={styles.ask} onClick={hint}>
            {t("pad.askOrbi")}
          </button>
        </div>
      </section>
    );
  }
  const [who, text] = talk.lines[talk.i];
  const c = CH[resolveSpeaker(who, hero)];
  return (
    <section
      className={`${styles.panel} ${styles.chat} ${styles.live}`}
      aria-label={t("pad.chat")}
      role="button"
      tabIndex={0}
      aria-live="polite"
      onClick={advance}
    >
      <div className={styles.head}>
        <span>💬 {t("pad.chat")}</span>
        <span className={styles.count}>
          {talk.i + 1}/{talk.lines.length}
        </span>
      </div>
      {/* key: replay the fade-in for each new line */}
      <div key={talk.i} className={`${styles.body} ${styles.line}`}>
        <span className={`wmp ${styles.face}`}>
          <Portrait ch={resolveSpeaker(who, hero)} />
          <Watermark compact />
        </span>
        <div className={styles.txt}>
          <b style={{ color: c.col }}>{t(c.n)}</b>
          <p>{t(text)}</p>
          <span className={styles.tap}>{t("bubble.continue")}</span>
        </div>
      </div>
    </section>
  );
}
