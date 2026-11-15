"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import Loading from "@/components/ui/Loading";
import type { ActivityId } from "@/lib/content/story";

// Mini-games are code-split (one shared chunk, see registry.tsx) and only downloaded when a modal opens, keeping the
// map's initial JS small (Chart.js, canvas games, content tables) for mobile Lighthouse.
const ARView = dynamic(() => import("./registry").then((m) => m.ARView), { ssr: false, loading: Loading });
const BodyTraining = dynamic(() => import("./registry").then((m) => m.BodyTraining), { ssr: false, loading: Loading });
const FireMap = dynamic(() => import("./registry").then((m) => m.FireMap), { ssr: false, loading: Loading });
const JumpSim = dynamic(() => import("./registry").then((m) => m.JumpSim), { ssr: false, loading: Loading });
const LanderGame = dynamic(() => import("./registry").then((m) => m.LanderGame), { ssr: false, loading: Loading });
const LunarPingPong = dynamic(() => import("./registry").then((m) => m.LunarPingPong), { ssr: false, loading: Loading });
const Lessons = dynamic(() => import("./registry").then((m) => m.Lessons), { ssr: false, loading: Loading });
const MissionPatch = dynamic(() => import("./registry").then((m) => m.MissionPatch), { ssr: false, loading: Loading });
const MissionTimeline = dynamic(() => import("./registry").then((m) => m.MissionTimeline), { ssr: false, loading: Loading });
const MoonQuiz = dynamic(() => import("./registry").then((m) => m.MoonQuiz), { ssr: false, loading: Loading });
const OxygenBalance = dynamic(() => import("./registry").then((m) => m.OxygenBalance), { ssr: false, loading: Loading });
const RadiationShield = dynamic(() => import("./registry").then((m) => m.RadiationShield), { ssr: false, loading: Loading });
const TempChart = dynamic(() => import("./TempChart"), { ssr: false, loading: Loading });
const ThermalControl = dynamic(() => import("./registry").then((m) => m.ThermalControl), { ssr: false, loading: Loading });

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
