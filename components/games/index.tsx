"use client";

import type { ComponentType } from "react";
import type { ActivityId } from "@/lib/content/story";
import BodyTraining from "./BodyTraining";
import JumpSim from "./JumpSim";
import LanderGame from "./LanderGame";
import Lessons from "./Lessons";
import MoonQuiz from "./MoonQuiz";
import RadiationShield from "./RadiationShield";
import ThermalControl from "./ThermalControl";

/** Ported mini-games by activity id. Activities not listed here still show the placeholder. */
export const GAMES: Partial<Record<ActivityId, ComponentType>> = {
  course: Lessons,
  aulas: MoonQuiz,
  lab: LanderGame,
  rad: RadiationShield,
  cancha: JumpSim,
  body: BodyTraining,
  therm: ThermalControl,
};
