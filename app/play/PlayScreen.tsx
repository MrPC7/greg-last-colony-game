"use client";

import { useEffect } from "react";
import PhoneBar from "@/components/map/PhoneBar";
import RotateHint from "@/components/map/RotateHint";
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
    <div id="app" className="play">
      <RotateHint />
      <div id="hub">
        <Stage />
        {/* Narrow screens only (CSS): the label burned into map.jpg is too small to read there. */}
        <p className="mapcap">{t("ai.watermark")}</p>
        <p className="s">{t("hub.help")}</p>
        {/* Phones only (CSS): [Info] [Control] [Chat] under the map, or beside it in landscape. */}
        <PhoneBar />
      </div>
    </div>
  );
}
