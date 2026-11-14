import type { Line, Localized } from "./types";

// Story & map data ported 1:1 from the prototype (P, ORD, HT, CL, IN, ZS, PO, ZI, ZXM, ZXS, BG).
// Spanish = prototype original, English = prototype TR table (gaps translated and marked).

export type ZoneId = "aulas" | "lab" | "cancha" | "verdes" | "aud";
export type ActivityId =
  | "course" | "aulas" | "lab" | "rad" | "cancha" | "body" | "verdes" | "therm" | "aud" | "ar";

/** `P`: map hotspots, % coordinates on map.jpg. */
export const ZONES: { id: ZoneId; n: Localized; x: number; y: number }[] = [
  { id: "aulas", n: { es: "Aulas", en: "Classrooms" }, x: 27.1, y: 30.1 },
  { id: "lab", n: { es: "Laboratorio Digital", en: "Digital Lab" }, x: 83.4, y: 38.4 },
  { id: "cancha", n: { es: "Cancha Deportiva", en: "Sports Court" }, x: 16.6, y: 52.5 },
  { id: "verdes", n: { es: "Zonas Verdes", en: "Green Zones" }, x: 46.8, y: 70.3 },
  // "Auditorio" alone had no TR entry in the prototype; translated here.
  { id: "aud", n: { es: "Auditorio", en: "Auditorium" }, x: 80.6, y: 66.2 },
];

/** `ORD`: recommended zone order (drives the golden "next zone" highlight). */
export const ORD: ZoneId[] = ["aulas", "lab", "cancha", "verdes", "aud"];

/** Start position of the hero on the map (prototype `S.pos`). */
export const START_POS = { x: 52, y: 42 };

/** Intro dialogue when entering the map (prototype `play`). */
export const INTRO_TALK: Line[] = [
  [2, {
    es: "¡Psst, {n}! Soy Orbi. Capté una señal llamada NOX-Ω desde la Luna. Esta escuela, la I.E. Aula Estelar, es nuestra base.",
    en: "Psst, {n}! I’m Orbi. I picked up a signal called NOX-Ω from the Moon. This school, I.E. Aula Estelar, is our base.",
  }],
  ["H", { es: "¿Una señal? ¿Y qué tengo que hacer?", en: "A signal? And what do I have to do?" }],
  [2, {
    es: "Visitar las cinco zonas. En cada una aprenderás algo que necesitaremos. Te seguiré a todas partes; toca 💡 si te pierdes.",
    en: "Visit the five zones. In each one you will learn something we will need. I will follow you everywhere; tap 💡 if you get lost.",
  }],
];

/** `HT`: Orbi's hint per step of ORD. */
export const HT: Localized[] = [
  { es: "Ve a las Aulas, arriba a la izquierda.", en: "Go to the Classrooms, top left." },
  { es: "Ahora el Laboratorio Digital, a la derecha.", en: "Now the Digital Lab, on the right." },
  { es: "Sigue con la Cancha Deportiva, a la izquierda.", en: "Next, the Sports Court, on the left." },
  { es: "Ahora las Zonas Verdes, abajo en el centro.", en: "Now the Green Zones, bottom center." },
  { es: "Por último, el Auditorio, abajo a la derecha.", en: "Finally, the Auditorium, bottom right." },
];
export const HINT_SUFFIX: Localized = { es: "Te marqué el círculo dorado.", en: "I marked the golden circle for you." };
export const HINT_DONE: Localized = {
  es: "¡Ya visitaste todo, {n}! Toca ¡Vamos! (Misión principal) y enfrenta a la Reina Hueca.",
  en: "You’ve visited everything, {n}! Tap Let’s go! (Main mission) and face the Hollow Queen.",
};

/** `ZS[zone][0]`: dialogue before entering a zone for the first time. */
export const ZONE_INTRO: Record<ZoneId, Line[]> = {
  aulas: [[2, {
    es: "Empecemos por las Aulas, {n}. Para entender NOX-Ω primero hay que entender cómo es la Luna.",
    en: "Let’s start in the Classrooms, {n}. To understand NOX-Ω we must first understand what the Moon is like.",
  }]],
  lab: [
    [1, {
      es: "El Laboratorio Digital simula un alunizaje. ¡Allá no hay aire ni paracaídas!",
      en: "The Digital Lab simulates a lunar landing. There is no air or parachutes up there!",
    }],
    [2, { es: "Frena con el motor, {n}. Suave: menos de 2,5 m/s.", en: "Slow down with the engine, {n}. Gently: under 2.5 m/s." }],
  ],
  cancha: [
    ["R", { es: "¿Vas a la Luna? Yo saltaría más alto que tú.", en: "Going to the Moon? I would jump higher than you." }],
    ["H", { es: "Probémoslo con ciencia.", en: "Let’s test it with science." }],
    [2, {
      es: "Con el mismo impulso, en la Luna llegas casi seis veces más alto.",
      en: "With the same push, on the Moon you jump almost six times higher.",
    }],
  ],
  verdes: [[1, {
    es: "En una colonia el aire se cultiva. Hay que equilibrar plantas y tripulación.",
    en: "In a colony, air is grown. You have to balance plants and crew.",
  }]],
  aud: [[2, {
    es: "En el Auditorio cuentan la historia de las misiones. Ordénalas bien: la pista final está en el pasado.",
    en: "The Auditorium tells the story of the missions. Put them in order: the final clue is in the past.",
  }]],
};

/** `PO`: dialogue after completing a zone's main activity for the first time (used from Phase 2). */
export const ZONE_OUTRO: Record<ZoneId, Line[]> = {
  aulas: [
    [2, {
      es: "¡Pista 1! La señal se repite cada 29,5 días: justo lo que dura un día lunar.",
      en: "Clue 1! The signal repeats every 29.5 days: exactly one lunar day.",
    }],
    ["H", { es: "Entonces sigue el ritmo de la Luna.", en: "So it follows the rhythm of the Moon." }],
  ],
  lab: [[2, {
    es: "¡Pista 2! La señal rebota en la superficie: hay algo esperándonos allá abajo.",
    en: "Clue 2! The signal bounces off the surface: something is waiting for us down there.",
  }]],
  cancha: [
    ["R", { es: "Vaya… la gravedad me ganó. Cuenten conmigo.", en: "Wow… gravity beat me. Count me in." }],
    [2, { es: "¡Pista 3 y un aliado nuevo!", en: "Clue 3 and a new ally!" }],
  ],
  verdes: [
    [2, { es: "¡Pista 4! Algo se movió entre las plantas…", en: "Clue 4! Something moved among the plants…" }],
    [4, { es: "No… tenemos… hogar.", en: "We… have… no home." }],
    [2, { es: "Un Sin Raíz. Nos vigilan: hay que darse prisa.", en: "A Rootless one. They are watching us: we must hurry." }],
  ],
  aud: [
    [2, {
      es: "¡Pista 5! Chang’e 4 llegó a la cara oculta: NOX-Ω está allí.",
      en: "Clue 5! Chang’e 4 reached the far side: NOX-Ω is there.",
    }],
    ["H", { es: "Entonces vamos a enfrentarla.", en: "Then let’s face it." }],
    [5, {
      es: "¿Creen que pueden escuchar mi voz sin perderse en ella?",
      en: "Do you think you can hear my voice without getting lost in it?",
    }],
    [2, {
      es: "Es la Reina Hueca. Toca ¡Vamos! en la Misión principal cuando estés listo.",
      en: "That is the Hollow Queen. Tap Let’s go! on the Main mission when you are ready.",
    }],
  ],
};

/** `ZI`: the 10 activities (icon + name). Order matters (missions/inventory lists). */
export const ZI: Record<ActivityId, [string, Localized]> = {
  course: ["📖", { es: "Curso: la Luna desde cero", en: "Course: the Moon from zero" }],
  aulas: ["❓", { es: "Quiz lunar", en: "Lunar quiz" }],
  lab: ["🚀", { es: "Aterrizaje lunar", en: "Lunar landing" }],
  rad: ["☀️", { es: "Tormenta solar", en: "Solar storm" }],
  cancha: ["🏀", { es: "Salto lunar", en: "Lunar jump" }],
  body: ["🧑‍🚀", { es: "Entrenamiento de astronauta", en: "Astronaut training" }],
  verdes: ["🌱", { es: "Invernadero lunar", en: "Lunar greenhouse" }],
  therm: ["🌡️", { es: "Control térmico", en: "Thermal control" }],
  aud: ["🎤", { es: "Línea del tiempo", en: "Timeline" }],
  ar: ["📷", { es: "Realidad aumentada", en: "Augmented reality" }],
};
export const ACTIVITY_IDS = Object.keys(ZI) as ActivityId[];

/** `ZXM`: activity → index in ZONES. */
export const ZXM: Record<ActivityId, number> = {
  course: 0, aulas: 0, lab: 1, rad: 1, cancha: 2, body: 2, verdes: 3, therm: 3, aud: 4, ar: 4,
};

/** `ZXS`: zone sub-menus (title + activities). */
export const ZXS: Record<ZoneId, [Localized, ActivityId[]]> = {
  aulas: [{ es: "📚 Aulas", en: "📚 Classrooms" }, ["course", "aulas"]],
  lab: [{ es: "🚀 Laboratorio Digital", en: "🚀 Digital Lab" }, ["lab", "rad"]],
  cancha: [{ es: "🏀 Cancha Deportiva", en: "🏀 Sports Court" }, ["cancha", "body"]],
  verdes: [{ es: "🌱 Zonas Verdes", en: "🌱 Green Zones" }, ["verdes", "therm"]],
  aud: [{ es: "🎤 Auditorio", en: "🎤 Auditorium" }, ["aud", "ar"]],
};

/** Facts saved to the inventory when an activity is won (prototype `win(id, s, fact)`). */
export const FACTS: Record<ActivityId | "boss", Localized> = {
  course: {
    es: "La Luna está a unos 384.400 km y casi no tiene atmósfera.",
    en: "The Moon is about 384,400 km away and has almost no atmosphere.",
  },
  aulas: { es: "Un día lunar dura unos 29,5 días terrestres.", en: "A lunar day lasts about 29.5 Earth days." },
  lab: {
    es: "Los módulos lunares frenan con motor porque en la Luna no hay atmósfera para usar paracaídas.",
    en: "Lunar landers brake with their engines because the Moon has no atmosphere for parachutes.",
  },
  rad: {
    es: "Los materiales ricos en hidrógeno, como el agua y el polietileno, frenan mejor la radiación.",
    en: "Hydrogen-rich materials, such as water and polyethylene, slow radiation better.",
  },
  cancha: {
    es: "Con el mismo impulso, en la Luna saltarías unas 6 veces más alto que en la Tierra.",
    en: "With the same push, on the Moon you would jump about 6 times higher than on Earth.",
  },
  body: {
    es: "Sin ejercicio, en el espacio los huesos pierden densidad; los astronautas entrenan unas 2 horas al día.",
    en: "Without exercise, bones lose density in space; astronauts train about 2 hours a day.",
  },
  verdes: {
    es: "Una base cierra el ciclo del aire combinando plantas con sistemas mecánicos de soporte vital.",
    en: "A base closes its air cycle by combining plants with mechanical life-support systems.",
  },
  therm: {
    es: "En el ecuador lunar la temperatura pasa de unos +120 °C de día a unos −130 °C de noche.",
    en: "At the lunar equator the temperature goes from about +120 °C by day to about −130 °C at night.",
  },
  aud: {
    es: "Entre 1959 y 2023 la exploración lunar pasó de impactos a alunizajes suaves en zonas difíciles.",
    en: "Between 1959 and 2023, lunar exploration went from crash impacts to soft landings in difficult areas.",
  },
  ar: {
    es: "Con realidad aumentada puedes explorar la Luna, la radiación y un traje de astronauta desde tu celular.",
    en: "With augmented reality you can explore the Moon, radiation and an astronaut suit from your phone.",
  },
  boss: {
    es: "La Reina Hueca cayó: la lógica y el esfuerzo salvan al universo.",
    en: "The Hollow Queen has fallen: logic and effort save the universe.",
  },
};

/** `CL`: the five clue lines of the main mission (one per ORD zone). */
export const CL: Localized[] = [
  { es: "La señal sigue el ritmo de la Luna.", en: "The signal follows the Moon’s rhythm." },
  { es: "Rebota en la superficie.", en: "It bounces off the surface." },
  { es: "Hay un aliado esperando.", en: "An ally is waiting." },
  { es: "Algo se esconde entre las plantas.", en: "Something hides among the plants." },
  { es: "Viene de la cara oculta.", en: "It comes from the far side." },
];

/** `mgo`: dialogue before the boss fight. */
export const BOSS_INTRO: Line[] = [
  [5, {
    es: "Así que encontraron mi señal… Ahora escucharán mi voz.",
    en: "So you found my signal… Now you will hear my voice.",
  }],
  ["H", { es: "No tenemos miedo. ¡Tenemos ciencia!", en: "We are not afraid. We have science!" }],
  [2, {
    es: "Responde con lógica: cada acierto es un golpe. Tus amigos te ayudarán.",
    en: "Answer with logic: every correct answer is a blow. Your friends will help you.",
  }],
];

/** `IN`: intro cinematic lines with the CH portraits that pop in. */
export const IN: { text: Localized; chars: number[] }[] = [
  { text: { es: "Año 2087. Una señal misteriosa llega desde la Luna…", en: "Year 2087. A mysterious signal arrives from the Moon…" }, chars: [] },
  { text: { es: "Greg, un estudiante que sueña con ser astronauta.", en: "Greg, a student who dreams of becoming an astronaut." }, chars: [0] },
  { text: { es: "Elen, la narradora que ve lo que otros no ven.", en: "Elen, the storyteller who sees what others do not." }, chars: [1] },
  { text: { es: "Orbi, un archivista alienígena y tu guía.", en: "Orbi, an alien archivist and your guide." }, chars: [2] },
  { text: { es: "Joseph, un rival con más corazón del que aparenta.", en: "Joseph, a rival with more heart than he seems." }, chars: [3] },
  { text: { es: "Los Sin Raíz y la Reina Hueca quieren devorar la colonia.", en: "The Rootless and the Hollow Queen want to devour the colony." }, chars: [4, 5] },
  { text: { es: "Aprende ciencia real. Salva la Colonia Última.", en: "Learn real science. Save the Last Colony." }, chars: [] },
];
/** Milliseconds each cinematic line stays on screen. */
export const IN_MS = 3600;

export type ProgressView = { done: Record<string, boolean>; shards: number };

/** `BG`: achievements. */
export const BG: { icon: string; name: Localized; desc: Localized; ok: (s: ProgressView) => boolean }[] = [
  { icon: "🥉", name: { es: "Primer paso", en: "First step" }, desc: { es: "Completa una zona", en: "Complete one zone" }, ok: (s) => ORD.some((k) => s.done[k]) },
  { icon: "🥈", name: { es: "Explorador", en: "Explorer" }, desc: { es: "Completa tres zonas", en: "Complete three zones" }, ok: (s) => ORD.filter((k) => s.done[k]).length >= 3 },
  { icon: "🥇", name: { es: "Comandante lunar", en: "Lunar commander" }, desc: { es: "Completa las cinco zonas", en: "Complete all five zones" }, ok: (s) => ORD.every((k) => s.done[k]) },
  { icon: "🛡️", name: { es: "Escudo antirradiación", en: "Radiation shield" }, desc: { es: "Supera la tormenta solar", en: "Survive the solar storm" }, ok: (s) => !!s.done.rad },
  { icon: "🌡️", name: { es: "Ingeniero térmico", en: "Thermal engineer" }, desc: { es: "Domina el control térmico", en: "Master thermal control" }, ok: (s) => !!s.done.therm },
  { icon: "💪", name: { es: "Astronauta en forma", en: "Fit astronaut" }, desc: { es: "Supera el entrenamiento", en: "Pass the training" }, ok: (s) => !!s.done.body },
  { icon: "✨", name: { es: "Cazador de estrellas", en: "Star hunter" }, desc: { es: "Reúne los 8 fragmentos", en: "Collect all 8 fragments" }, ok: (s) => s.shards >= 8 },
  { icon: "👑", name: { es: "Vencedor de la Reina", en: "Queen slayer" }, desc: { es: "Derrota a la Reina Hueca", en: "Defeat the Hollow Queen" }, ok: (s) => !!s.done.boss },
];
