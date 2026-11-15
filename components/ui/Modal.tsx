"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { GAMES } from "@/components/games";
import { useT } from "@/lib/i18n";
import Loading from "./Loading";
import { useUI } from "@/lib/store";
import {
  InventoryPanel,
  MainMissionPanel,
  MissionsPanel,
  SettingsPanel,
  ZoneMenu,
} from "./Panels";

// Code-split: these panels are only downloaded when opened.
const Achievements = dynamic(() => import("@/components/games/registry").then((m) => m.Achievements), { ssr: false, loading: Loading });
const ARView = dynamic(() => import("@/components/games/registry").then((m) => m.ARView), { ssr: false, loading: Loading });
const BossFight = dynamic(() => import("@/components/games/registry").then((m) => m.BossFight), { ssr: false, loading: Loading });
const BossLose = dynamic(() => import("@/components/games/registry").then((m) => m.BossLose), { ssr: false, loading: Loading });
const Certificate = dynamic(() => import("@/components/games/registry").then((m) => m.Certificate), { ssr: false, loading: Loading });
const Ending = dynamic(() => import("@/components/games/registry").then((m) => m.Ending), { ssr: false, loading: Loading });
const RayMemory = dynamic(() => import("@/components/games/registry").then((m) => m.RayMemory), { ssr: false, loading: Loading });

/** Prototype `#md` + `.card` with the ✕ button. */
export function Modal({ children }: { children: ReactNode }) {
  const t = useT();
  const close = useUI((s) => s.closeModal);
  return (
    <div id="md" role="dialog" aria-modal="true">
      <div className="card">
        <button className="b x" onClick={close} aria-label={t("common.close")}>✕</button>
        <div id="mb">{children}</div>
      </div>
    </div>
  );
}

/** Renders the current modal from the UI store. Content is re-rendered from data on every
 *  language switch, so open panels change language instantly. */
export default function ModalHost() {
  const m = useUI((s) => s.modal);
  if (!m) return null;
  let body: ReactNode;
  switch (m.kind) {
    case "zone": body = <ZoneMenu zone={m.zone} />; break;
    case "activity": {
      const Game = GAMES[m.id];
      body = <Game />;
      break;
    }
    case "missions": body = <MissionsPanel />; break;
    case "inventory": body = <InventoryPanel />; break;
    case "achievements": body = <Achievements />; break;
    case "main": body = <MainMissionPanel />; break;
    case "boss": body = <BossFight />; break;
    case "ending": body = <Ending />; break;
    case "certificate": body = <Certificate />; break;
    case "bossLose": body = <BossLose broke={m.broke} />; break;
    case "ar": body = <ARView />; break;
    case "settings": body = <SettingsPanel />; break;
    case "memory": body = <RayMemory i={m.i} fresh={m.fresh} />; break;
  }
  // key: remount when switching panels so local state (e.g. reset confirmation) resets
  return <Modal key={m.kind + ("zone" in m ? m.zone : "id" in m ? m.id : "i" in m ? m.i : "")}>{body}</Modal>;
}
