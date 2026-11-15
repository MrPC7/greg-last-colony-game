"use client";

import { useEffect } from "react";
import Stage from "@/components/map/Stage";
import { music } from "@/lib/audio";
import { INTRO_TALK } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { useGame, useUI } from "@/lib/store";

/** Map stage (prototype `#hub`). */
export default function PlayScreen() {
  const t = useT();
  const langChosen = useGame((s) => s.lang !== null);

  useEffect(() => {
    music("explore");
    return () => useUI.getState().clearAll();
  }, []);

  // Orbi's welcome (prototype `play`), once the first-launch language choice is made.
  useEffect(() => {
    if (!langChosen) return;
    useUI.getState().startTalk(INTRO_TALK);
  }, [langChosen]);

  return (
    <div id="app">
      <div id="hub">
        <Stage />
        <p className="s">{t("hub.help")}</p>
      </div>
    </div>
  );
}
