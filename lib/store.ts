"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sfx } from "./audio";
import { CH, rival } from "./characters";
import { SH, SHARD_BONUS, START_POS, ZONE_OUTRO, type ActivityId, type ZoneId } from "./content/story";
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
  /** Ray's memory fragments (Phase 5) */
  rayMemories: number[];
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
      resetProgress: () => set(freshProgress()),
    }),
    {
      name: "colonia-v1",
      version: 2,
      // v1 stored `shards` as a count (never collectable before v2): start the list empty.
      migrate: (persisted, version) => {
        const p = persisted as Partial<Progress> & Record<string, unknown>;
        if (version < 2 && !Array.isArray(p.shards)) p.shards = [];
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
  | { kind: "bossWin" }
  | { kind: "bossLose" }
  | { kind: "ar" }
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
  clearAll: () => set({ modal: null, onClose: null, talk: null, queued: null }),
}));

/** Prototype `S.busy`: a modal or a speech bubble is open. */
export const isBusy = () => {
  const s = useUI.getState();
  return !!s.modal || !!s.talk;
};

/**
 * Award an activity win (prototype `win` with all its wrappers): stars, crystal, fact,
 * victory jingle and, for zone main activities, the post-zone dialogue after the modal closes.
 * Used by the mini-games from Phase 2.
 */
export function awardWin(id: ActivityId | "boss", stars: number) {
  const first = useGame.getState().win(id, stars);
  if (first) {
    sfx("win");
    const outro = (ZONE_OUTRO as Record<string, Line[] | undefined>)[id];
    if (outro) useUI.setState({ queued: () => useUI.getState().startTalk(outro) });
  }
  return first;
}
