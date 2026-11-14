"use client";

import type { ComponentType } from "react";
import type { ActivityId } from "@/lib/content/story";
import ARView from "./ARView";
import BodyTraining from "./BodyTraining";
import FireMap from "./FireMap";
import JumpSim from "./JumpSim";
import LanderGame from "./LanderGame";
import LunarPingPong from "./LunarPingPong";
import Lessons from "./Lessons";
import MissionPatch from "./MissionPatch";
import MissionTimeline from "./MissionTimeline";
import MoonQuiz from "./MoonQuiz";
import OxygenBalance from "./OxygenBalance";
import RadiationShield from "./RadiationShield";
import TempChart from "./TempChart";
import ThermalControl from "./ThermalControl";

/** The mini-game of every activity (prototype `ZXS` sub-menu targets). */
export const GAMES: Record<ActivityId, ComponentType> = {
  course: Lessons,
  aulas: MoonQuiz,
  lab: LanderGame,
  rad: RadiationShield,
  cancha: JumpSim,
  body: BodyTraining,
  verdes: OxygenBalance,
  therm: ThermalControl,
  aud: MissionTimeline,
  ar: ARView,
  senal: TempChart,
  fires: FireMap,
  patch: MissionPatch,
  pong: LunarPingPong,
};
