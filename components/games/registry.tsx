"use client";

// Every lazily loaded mini-game / panel, in ONE module so they share a single chunk.
// Importing each file with its own dynamic() made Turbopack copy the shared content
// tables (lib/content/games.ts, ~48 KB) into all 14 chunks. One chunk is downloaded the
// first time any game opens; the rest then open instantly. TempChart stays separate
// (index.tsx) because it alone pulls in Chart.js.
export { default as Achievements } from "./Achievements";
export { default as ARView } from "./ARView";
export { default as BodyTraining } from "./BodyTraining";
export { default as BossFight, BossLose } from "./BossFight";
export { default as Certificate } from "./Certificate";
export { default as Ending } from "./Ending";
export { default as FireMap } from "./FireMap";
export { default as Journey } from "./Journey";
export { default as JumpSim } from "./JumpSim";
export { default as LanderGame } from "./LanderGame";
export { default as Lessons } from "./Lessons";
export { default as LunarPingPong } from "./LunarPingPong";
export { default as MissionPatch } from "./MissionPatch";
export { default as MissionTimeline } from "./MissionTimeline";
export { default as MoonQuiz } from "./MoonQuiz";
export { default as OxygenBalance } from "./OxygenBalance";
export { default as RadiationShield } from "./RadiationShield";
export { default as RayMemory } from "./RayMemory";
export { default as ThermalControl } from "./ThermalControl";
