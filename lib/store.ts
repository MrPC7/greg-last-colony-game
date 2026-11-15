"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sfx } from "./audio";
import { haptic } from "./haptics";
import { CH, rival } from "./characters";
import {
  BOSS_INTRO,
  MEMORY_ZONES,
  ORD,
  RAY_BEFORE_BOSS,
  RAY_MEMORIES,
  SENAL_OPENED,
  SENAL_UNLOCK,
  SH,
  SHARD_BONUS,
  START_POS,
  ZONE_OUTRO,
  type ActivityId,
  type ZoneId,
} from "./content/story";
import type { Lang, Line, Speaker } from "./content/types";

export type Theme = "auto" | "light" | "dark";

// ---------------------------------------------------------------------------
// Persistent game state (localStorage key "colonia-v1")
// ---------------------------------------------------------------------------

type Progress = {
  pos: { x: number; y: number };
  stars: number;
  /** 💎 crystals: +1 per first completion (prototype `S.gm`) */
  gems: number;
  done: Record<string, boolean>;
  /** activity ids in the order they were first won (prototype `S.fi`, for the inventory) */
  factOrder: string[];
  /** indices into SH of the star fragments collected on the map */
  shards: number[];
  /** Ray's memory fragments (Phase 5): indices into RAY_MEMORIES, in unlock order */
  rayMemories: number[];
  /** Phase 5: PNG data URL thumbnail of the last saved mission patch (shown in the inventory) */
  patch: string | null;
  /** Phase 6: name typed for the certificate. Only kept on this device (localStorage), never sent anywhere. */
  playerName: string;
  /** Phase 6: ISO date of the first win against the Hollow Queen (shown on the certificate). */
  finishedAt: string | null;
  /** The "Misión Lunar – Fase 1" briefing was closed with ¡Comenzar! (shown before the map until then). */
  briefingSeen: boolean;
};

type Settings = {
  character: number;
  /** null until the player picks a language on first launch */
  lang: Lang | null;
  theme: Theme;
  musicOn: boolean;
  sfxOn: boolean;
};

type GameState = Progress &
  Settings & {
    setCharacter: (i: number) => void;
    setLang: (l: Lang) => void;
    setTheme: (t: Theme) => void;
    toggleMusic: () => void;
    toggleSfx: () => void;
    setPos: (x: number, y: number) => void;
    /** Prototype `win()`. Returns true the first time `id` is completed. */
    win: (id: string, stars: number) => boolean;
    /** Collect fragment `i` (+1 ⭐; the 8th also gives the +5 ⭐ bonus). Returns true when that completes the set. */
    addShard: (i: number) => boolean;
    /** Unlock Ray's next memory fragment. Returns its index, or null when all are unlocked. */
    unlockMemory: () => number | null;
    setPatch: (dataUrl: string) => void;
    setPlayerName: (name: string) => void;
    setBriefingSeen: () => void;
    resetProgress: () => void;
  };

const freshProgress = (): Progress => ({
  pos: { ...START_POS },
  stars: 0,
  gems: 0,
  done: {},
  factOrder: [],
  shards: [],
  rayMemories: [],
  patch: null,
  playerName: "",
  finishedAt: null,
  briefingSeen: false,
});

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      ...freshProgress(),
      character: 0,
      lang: null,
      theme: "auto",
      musicOn: true,
      sfxOn: true,
      setCharacter: (character) => set({ character }),
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleMusic: () => set((s) => ({ musicOn: !s.musicOn })),
      toggleSfx: () => set((s) => ({ sfxOn: !s.sfxOn })),
      setPos: (x, y) => set({ pos: { x, y } }),
      win: (id, stars) => {
        if (get().done[id]) return false;
        set((s) => ({
          ...(id === "boss" ? { finishedAt: new Date().toISOString() } : {}),
          done: { ...s.done, [id]: true },
          stars: s.stars + stars,
          gems: s.gems + 1,
          factOrder: [...s.factOrder, id],
        }));
        return true;
      },
      addShard: (i) => {
        const { shards } = get();
        if (shards.includes(i)) return false;
        const all = shards.length + 1 === SH.length;
        set((s) => ({ shards: [...s.shards, i], stars: s.stars + 1 + (all ? SHARD_BONUS : 0) }));
        return all;
      },
      unlockMemory: () => {
        const k = get().rayMemories.length;
        if (k >= RAY_MEMORIES.length) return null;
        set((s) => ({ rayMemories: [...s.rayMemories, k] }));
        return k;
      },
      setPatch: (patch) => set({ patch }),
      setPlayerName: (playerName) => set({ playerName }),
      setBriefingSeen: () => set({ briefingSeen: true }),
      resetProgress: () => set(freshProgress()),
    }),
    {
      name: "colonia-v1",
      version: 4,
      // v1 stored `shards` as a count (never collectable before v2): start the list empty.
      // v3 (Phase 5): saves from before Ray's memories get one per memory zone already completed.
      migrate: (persisted, version) => {
        const p = persisted as Partial<Progress> & Record<string, unknown>;
        if (version < 2 && !Array.isArray(p.shards)) p.shards = [];
        if (version < 3) {
          const k = Math.min(RAY_MEMORIES.length, MEMORY_ZONES.filter((z) => p.done?.[z]).length);
          p.rayMemories = Array.from({ length: k }, (_, i) => i);
          p.patch = null;
        }
        // v4 (Phase 6): certificate name + finish date.
        if (version < 4) {
          p.playerName = "";
          p.finishedAt = null;
        }
        return p as unknown as GameState;
      },
      // Hydrated manually by AppShell after mount, so the static HTML and the first
      // client render match.
      skipHydration: true,
      partialize: (s) => ({
        pos: s.pos,
        stars: s.stars,
        gems: s.gems,
        done: s.done,
        factOrder: s.factOrder,
        shards: s.shards,
        rayMemories: s.rayMemories,
        patch: s.patch,
        playerName: s.playerName,
        finishedAt: s.finishedAt,
        briefingSeen: s.briefingSeen,
        character: s.character,
        lang: s.lang,
        theme: s.theme,
        musicOn: s.musicOn,
        sfxOn: s.sfxOn,
      }),
    },
  ),
);

// ---------------------------------------------------------------------------
// Transient UI state: modal + speech bubble (prototype `S.busy`, `modal`, `talk`)
// ---------------------------------------------------------------------------

export type ModalSpec =
  | { kind: "zone"; zone: ZoneId }
  | { kind: "activity"; id: ActivityId }
  | { kind: "missions" }
  | { kind: "inventory" }
  | { kind: "achievements" }
  | { kind: "main" }
  | { kind: "boss" }
  /** Journey to the Moon cutscene: before the boss (`toBoss`), or replayed from the main mission */
  | { kind: "journey"; toBoss?: boolean }
  /** Phase 6: ending cutscene (after the first win, or replayed from the main mission) */
  | { kind: "ending" }
  /** Phase 6: "Explorador/a de Selene" certificate */
  | { kind: "certificate" }
  | { kind: "bossLose"; broke: number }
  | { kind: "ar" }
  /** Phase 5: Ray's memory cutscene (`fresh`: just unlocked, vs. replayed from the inventory) */
  | { kind: "memory"; i: number; fresh?: boolean }
  | { kind: "settings" };

type Talk = { lines: Line[]; i: number; done?: () => void };

type UIState = {
  modal: ModalSpec | null;
  onClose: (() => void) | null;
  talk: Talk | null;
  /** queued after the current modal closes (prototype `S.q`) */
  queued: (() => void) | null;
  /** request from a panel for the map to walk to a zone (prototype `visit(i)`) */
  visitReq: { i: number; nonce: number } | null;
  /** Briefing screen shown in place of the map: replayed from the main mission panel. (The first
   *  time it shows because `briefingSeen` is false; see app/play/PlayScreen.tsx.) */
  briefing: boolean;
  /** Boss intro dialogue running: the "La Luna en Peligro" scene (MoonScene) replaces the map. */
  bossScene: boolean;
  openModal: (m: ModalSpec, onClose?: () => void) => void;
  closeModal: () => void;
  startTalk: (lines: Line[], done?: () => void) => void;
  advanceTalk: () => void;
  requestVisit: (i: number) => void;
  clearAll: () => void;
};

export const resolveSpeaker = (w: Speaker, hero: number) => (w === "H" ? hero : w === "R" ? rival(hero) : w);

const blip = (line: Line) => {
  const c = CH[resolveSpeaker(line[0], useGame.getState().character)];
  sfx("blip", c.n.es.length);
};

export const useUI = create<UIState>()((set, get) => ({
  modal: null,
  onClose: null,
  talk: null,
  queued: null,
  visitReq: null,
  briefing: false,
  bossScene: false,
  openModal: (modal, onClose) => {
    sfx("click");
    set({ modal, onClose: onClose ?? null });
  },
  closeModal: () => {
    const { onClose, queued } = get();
    set({ modal: null, onClose: null, queued: null });
    if (onClose) onClose();
    if (queued) setTimeout(queued, 60);
  },
  startTalk: (lines, done) => {
    if (!lines.length) {
      done?.();
      return;
    }
    set({ talk: { lines, i: 0, done } });
    blip(lines[0]);
  },
  advanceTalk: () => {
    const t = get().talk;
    if (!t) return;
    if (t.i + 1 >= t.lines.length) {
      set({ talk: null });
      t.done?.();
      return;
    }
    set({ talk: { ...t, i: t.i + 1 } });
    blip(t.lines[t.i + 1]);
  },
  requestVisit: (i) => set({ visitReq: { i, nonce: Date.now() } }),
  clearAll: () => set({ modal: null, onClose: null, talk: null, queued: null, briefing: false, bossScene: false }),
}));

/** Prototype `S.busy`: a modal or a speech bubble is open. */
export const isBusy = () => {
  const s = useUI.getState();
  return !!s.modal || !!s.talk;
};

/** The boss intro dialogue, then the fight. Phase 5: with all his memories back, Ray reveals his
 *  origin first. Called at the end of the Journey to the Moon cutscene. The dialogue plays over
 *  the "La Luna en Peligro" scene, shown in place of the map (`bossScene`). */
export function startBossIntro() {
  const memories = useGame.getState().rayMemories;
  const intro = memories.length >= RAY_MEMORIES.length ? [...RAY_BEFORE_BOSS, ...BOSS_INTRO] : BOSS_INTRO;
  useUI.setState({ bossScene: true });
  useUI.getState().startTalk(intro, () => {
    useUI.setState({ bossScene: false });
    useUI.getState().openModal({ kind: "boss" });
  });
}

/**
 * Award an activity win (prototype `win` with all its wrappers): stars, crystal, fact,
 * victory jingle and, for zone main activities, the post-zone dialogue after the modal closes.
 * Used by the mini-games from Phase 2.
 */
export function awardWin(id: ActivityId | "boss", stars: number) {
  const first = useGame.getState().win(id, stars);
  if (first) {
    sfx("win");
    haptic([30, 60, 40]);
    let outro = (ZONE_OUTRO as Record<string, Line[] | undefined>)[id] ?? [];
    // Phase 4: the zone that reaches SENAL_UNLOCK completed zones also opens the observatory dome.
    const done = useGame.getState().done;
    if ((ORD as string[]).includes(id) && ORD.filter((k) => done[k]).length === SENAL_UNLOCK && !done.senal) {
      outro = [...outro, ...SENAL_OPENED];
    }
    // Phase 5: every completed memory zone gives Ray back one memory (cutscene after the outro).
    const mem = MEMORY_ZONES.includes(id) ? useGame.getState().unlockMemory() : null;
    const showMemory = mem === null ? undefined : () => useUI.getState().openModal({ kind: "memory", i: mem, fresh: true });
    if (outro.length) useUI.setState({ queued: () => useUI.getState().startTalk(outro, showMemory) });
    else if (showMemory) useUI.setState({ queued: showMemory });
  }
  return first;
}
