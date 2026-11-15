"use client";

import { useEffect } from "react";
import Briefing from "@/components/map/Briefing";
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
  // "Misión Lunar – Fase 1" briefing: in place of the map the first time (until ¡Comenzar!),
  // or when replayed from the main mission panel.
  const firstBriefing = useGame((s) => !s.briefingSeen);
  const replayBriefing = useUI((s) => s.briefing);
  const briefing = firstBriefing || replayBriefing;

  useEffect(() => {
    music("explore");
    return () => useUI.getState().clearAll();
  }, []);

  // Orbi's welcome (prototype `play`), once the first-launch language choice is made. The first
  // time, the briefing comes first and its ¡Comenzar! button starts the welcome instead.
  useEffect(() => {
    if (!langChosen || !useGame.getState().briefingSeen) return;
    useUI.getState().startTalk(INTRO_TALK);
  }, [langChosen]);

  const start = () => {
    const first = !useGame.getState().briefingSeen;
    useUI.setState({ talk: null, briefing: false });
    if (!first) return;
    useGame.getState().setBriefingSeen();
    useUI.getState().startTalk(INTRO_TALK);
  };

  return (
    <div id="app" className="play">
      <RotateHint />
      <div id="hub">
        {briefing ? <Briefing onStart={start} /> : <Stage />}
        {/* Narrow screens only (CSS): the label burned into map.jpg is too small to read there. */}
        <p className="mapcap">{t("ai.watermark")}</p>
        <p className="s">{t("hub.help")}</p>
        {/* Phones only (CSS): [Info] [Control] [Chat] under the map, or beside it in landscape. */}
        <PhoneBar />
      </div>
    </div>
  );
}
