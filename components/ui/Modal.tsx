"use client";

import type { ReactNode } from "react";
import { GAMES } from "@/components/games";
import { useT } from "@/lib/i18n";
import { useUI } from "@/lib/store";
import {
  AchievementsPanel,
  ActivityPlaceholder,
  ArPlaceholder,
  BossPlaceholder,
  InventoryPanel,
  MainMissionPanel,
  MissionsPanel,
  SettingsPanel,
  ZoneMenu,
} from "./Panels";

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
      body = Game ? <Game /> : <ActivityPlaceholder id={m.id} />;
      break;
    }
    case "missions": body = <MissionsPanel />; break;
    case "inventory": body = <InventoryPanel />; break;
    case "achievements": body = <AchievementsPanel />; break;
    case "main": body = <MainMissionPanel />; break;
    case "boss": body = <BossPlaceholder />; break;
    case "ar": body = <ArPlaceholder />; break;
    case "settings": body = <SettingsPanel />; break;
  }
  // key: remount when switching panels so local state (e.g. reset confirmation) resets
  return <Modal key={m.kind + ("zone" in m ? m.zone : "id" in m ? m.id : "")}>{body}</Modal>;
}
