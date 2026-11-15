import type { Line, Localized, Speaker } from "./types";

// Story & map data ported 1:1 from the prototype (P, ORD, HT, CL, IN, ZS, PO, ZI, ZXM, ZXS, BG).
// Spanish = prototype original, English = prototype TR table (gaps translated and marked).

export type ZoneId = "aulas" | "lab" | "cancha" | "verdes" | "aud" | "senal";
export type ActivityId =
  | "course" | "aulas" | "lab" | "rad" | "cancha" | "body" | "verdes" | "therm" | "aud" | "ar"
  // Phase 4 — "La Señal de Ray" (NASA data zone)
  | "senal" | "fires"
  // Phase 5 — character features
  | "patch" | "pong";

/** Speaker index of Ray (CH[6] in lib/characters.ts). A literal here because content files
 *  stay import-free for scripts/check_i18n.ts. */
const RAY = 6;

/** `P`: map hotspots, % coordinates on map.jpg. `wx`/`wy`: where the hero stands to enter
 *  (only for hotspots outside the walkable area, y < 24). `n` / `sub`: title and subtitle of the
 *  zone label painted on the map, re-drawn in HTML over it (components/map/MapLabel.tsx). */
export const ZONES: { id: ZoneId; n: Localized; sub?: Localized; x: number; y: number; wx?: number; wy?: number }[] = [
  { id: "aulas", n: { es: "Aulas", en: "Classrooms" }, sub: { es: "Aprende y resuelve", en: "Learn and solve" }, x: 27.1, y: 30.1 },
  { id: "lab", n: { es: "Laboratorio Digital", en: "Digital Lab" }, sub: { es: "Crea e innova", en: "Create and innovate" }, x: 83.4, y: 38.4 },
  { id: "cancha", n: { es: "Cancha Deportiva", en: "Sports Court" }, sub: { es: "Demuestra tu talento", en: "Show your talent" }, x: 16.6, y: 52.5 },
  { id: "verdes", n: { es: "Zonas Verdes", en: "Green Zones" }, sub: { es: "Descansa y recarga", en: "Rest and recharge" }, x: 46.8, y: 70.3 },
  // "Auditorio" alone had no TR entry in the prototype; translated here.
  { id: "aud", n: { es: "Auditorio", en: "Auditorium" }, sub: { es: "Presenta tus ideas", en: "Share your ideas" }, x: 80.6, y: 66.2 },
  // Phase 4: the observatory dome on top of the main building (not part of ORD; unlocks after 2 zones).
  { id: "senal", n: { es: "La Señal de Ray", en: "Ray’s Signal" }, x: 59.3, y: 9.5, wx: 59.3, wy: 26 },
];

/** Index of the NASA data zone in ZONES. */
export const SENAL_INDEX = ZONES.findIndex((z) => z.id === "senal");
/** ORD zones that must be completed before the observatory dome opens. */
export const SENAL_UNLOCK = 2;
export const senalUnlocked = (done: Record<string, boolean>) =>
  ORD.filter((k) => done[k]).length >= SENAL_UNLOCK;

/** `ORD`: recommended zone order (drives the golden "next zone" highlight). */
export const ORD: ZoneId[] = ["aulas", "lab", "cancha", "verdes", "aud"];

/** Start position of the hero on the map (prototype `S.pos`). */
export const START_POS = { x: 52, y: 42 };

/** Intro dialogue when entering the map (prototype `play`). */
export const INTRO_TALK: Line[] = [
  [2, {
    es: "¡Psst, {n}! Soy Orbi. Capté una señal llamada NOX-Ω que viaja 384.400 km desde la Luna hasta aquí, a Cajamarca. Tu escuela, la I.E. Aula Estelar, será nuestra base en la Tierra.",
    en: "Psst, {n}! I’m Orbi. I picked up a signal called NOX-Ω that travels 384,400 km from the Moon all the way here, to Cajamarca. Your school, I.E. Aula Estelar, will be our base on Earth.",
  }],
  ["H", { es: "¿Una señal? ¿Y qué tengo que hacer?", en: "A signal? And what do I have to do?" }],
  [2, {
    es: "Visitar las cinco zonas de la escuela. En cada una aprenderás algo que necesitaremos cuando viajemos a la Luna. Te seguiré a todas partes; toca 💡 si te pierdes.",
    en: "Visit the five zones of the school. In each one you will learn something we will need when we travel to the Moon. I will follow you everywhere; tap 💡 if you get lost.",
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
/** Phase 6: Orbi's 💡 hint once the Queen of the Void is defeated. */
export const HINT_FINISHED: Localized = {
  es: "¡Salvaste la colonia, {n}! En la Misión principal puedes ver el final otra vez y descargar tu certificado.",
  en: "You saved the colony, {n}! In the Main mission you can watch the ending again and download your certificate.",
};
export const HINT_DONE: Localized = {
  es: "¡Ya visitaste todo, {n}! Toca ¡Vamos! (Misión principal), viaja a la Luna y enfrenta a la Reina del Vacío.",
  en: "You’ve visited everything, {n}! Tap Let’s go! (Main mission), travel to the Moon and face the Queen of the Void.",
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
  senal: [
    [RAY, {
      es: "Hola, {n}. Me llamo Ray… aunque me dicen el Sin Raíz: no recuerdo de dónde vengo. Pero sé escuchar señales.",
      en: "Hi, {n}. My name is Ray… though they call me the Wanderer: I don’t remember where I come from. But I know how to listen to signals.",
    }],
    ["H", { es: "¿Señales? ¿De dónde?", en: "Signals? From where?" }],
    [RAY, {
      es: "Del cielo. Los satélites de la NASA miran la Tierra todos los días: miden cuánto calor hace y ven los incendios desde el espacio.",
      en: "From the sky. NASA satellites watch Earth every day: they measure how hot it is and spot fires from space.",
    }],
    [RAY, {
      es: "Y algo anda mal: la Reina del Vacío quiere conquistar la Tierra con fuego y calor. Ven, te muestro los datos reales.",
      en: "And something is wrong: the Queen of the Void wants to conquer Earth with fire and heat. Come, I’ll show you the real data.",
    }],
  ],
  aud: [
    // Phase 5: Elen (class delegate) hosts the Auditorium.
    [1, {
      es: "¡Bienvenidos al Auditorio! Soy Elen, la delegada del salón, y hoy presento la historia de las misiones a la Luna.",
      en: "Welcome to the Auditorium! I’m Elen, the class delegate, and today I’m presenting the history of the missions to the Moon.",
    }],
    [1, {
      es: "Hasta agregué las misiones Artemis: ¡en 2026 cuatro astronautas volvieron a viajar alrededor de la Luna!",
      en: "I even added the Artemis missions: in 2026 four astronauts travelled around the Moon again!",
    }],
    [2, {
      es: "En el Auditorio cuentan la historia de las misiones. Ordénalas bien: el último núcleo de energía está en el pasado.",
      en: "The Auditorium tells the story of the missions. Put them in order: the last energy core lies in the past.",
    }],
  ],
};

/** `PO`: dialogue after completing a zone's main activity for the first time (used from Phase 2). */
export const ZONE_OUTRO: Record<ZoneId, Line[]> = {
  aulas: [
    [2, {
      es: "¡Núcleo de energía 1! La señal se repite cada 29,5 días: justo lo que dura un día lunar.",
      en: "Energy core 1! The signal repeats every 29.5 days: exactly one lunar day.",
    }],
    ["H", { es: "Entonces sigue el ritmo de la Luna.", en: "So it follows the rhythm of the Moon." }],
  ],
  lab: [[2, {
    es: "¡Núcleo de energía 2! La señal rebota en la superficie lunar: hay algo esperándonos allá arriba, en la Luna.",
    en: "Energy core 2! The signal bounces off the lunar surface: something is waiting for us up there, on the Moon.",
  }]],
  cancha: [
    ["R", { es: "Vaya… la gravedad me ganó. Cuenten conmigo.", en: "Wow… gravity beat me. Count me in." }],
    [2, { es: "¡Núcleo de energía 3 y un aliado nuevo!", en: "Energy core 3 and a new ally!" }],
  ],
  verdes: [
    [2, { es: "¡Núcleo de energía 4! Algo se movió entre las plantas…", en: "Energy core 4! Something moved among the plants…" }],
    [4, { es: "No… tenemos… hogar.", en: "We… have… no home." }],
    [2, { es: "Un Sin Raíz. Nos vigilan: hay que darse prisa.", en: "A Rootless one. They are watching us: we must hurry." }],
  ],
  senal: [
    [RAY, {
      es: "¿Lo ves, {n}? Desde 1880 la Tierra se calentó más de 1 °C. Parece poco, pero es como si todo el planeta tuviera fiebre.",
      en: "See, {n}? Since 1880 Earth has warmed by more than 1 °C. It sounds small, but it’s like the whole planet has a fever.",
    }],
    ["H", { es: "Entonces la Reina del Vacío ya empezó…", en: "So the Queen of the Void has already started…" }],
    [RAY, {
      es: "Por eso hay que entender los datos. En el domo también tengo el mapa de incendios de hoy. ¡Échale un vistazo!",
      en: "That’s why we need to understand the data. The dome also has today’s fire map. Take a look!",
    }],
  ],
  aud: [
    [2, {
      es: "¡Núcleo de energía 5! Chang’e 4 llegó a la cara oculta: NOX-Ω está allí.",
      en: "Energy core 5! Chang’e 4 reached the far side: NOX-Ω is there.",
    }],
    ["H", { es: "Entonces vamos a enfrentarla.", en: "Then let’s face it." }],
    [5, {
      es: "¿Creen que pueden escuchar mi voz sin perderse en ella?",
      en: "Do you think you can hear my voice without getting lost in it?",
    }],
    [2, {
      es: "Es la Reina del Vacío. Cuando estés listo, toca ¡Vamos! en la Misión principal: viajaremos a la Luna.",
      en: "That is the Queen of the Void. When you are ready, tap Let’s go! on the Main mission: we will travel to the Moon.",
    }],
  ],
};

/** Extra dialogue after a zone's outro (prototype has none): the dome opens after SENAL_UNLOCK zones. */
export const SENAL_OPENED: Line[] = [
  [2, {
    es: "¡Mira, {n}! El domo del observatorio se encendió. Está recibiendo señales de los satélites que miran la Tierra.",
    en: "Look, {n}! The observatory dome just lit up. It is picking up signals from the satellites that watch Earth.",
  }],
  [2, { es: "Sube al domo, arriba en el centro del mapa.", en: "Go up to the dome, at the top center of the map." }],
];
/** Orbi, when the dome is still locked. */
export const SENAL_LOCKED: Line[] = [
  [2, {
    es: "Ese domo capta señales de los satélites que miran la Tierra, pero aún está apagado. Completa {k} zonas para encenderlo ({d}/{k}).",
    en: "That dome picks up signals from the satellites that watch Earth, but it is still switched off. Complete {k} zones to turn it on ({d}/{k}).",
  }],
];
/** Added to Orbi's 💡 hint while the dome is open and not yet done. */
export const HINT_SENAL: Localized = {
  es: "Y no olvides la señal de Ray en el domo del observatorio.",
  en: "And don’t forget Ray’s signal in the observatory dome.",
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
  senal: ["📈", { es: "El termómetro de la Tierra", en: "Earth’s thermometer" }],
  fires: ["🔥", { es: "Mapa de incendios", en: "Fire map" }],
  patch: ["🎨", { es: "Parche de misión (Greg)", en: "Mission patch (Greg)" }],
  pong: ["🏓", { es: "Ping pong lunar (Joseph)", en: "Lunar ping pong (Joseph)" }],
};
export const ACTIVITY_IDS = Object.keys(ZI) as ActivityId[];

/** `ZXM`: activity → index in ZONES. */
export const ZXM: Record<ActivityId, number> = {
  course: 0, aulas: 0, lab: 1, rad: 1, cancha: 2, body: 2, verdes: 3, therm: 3, aud: 4, ar: 4, senal: 5, fires: 5,
  patch: 1, pong: 2,
};

/** `ZXS`: zone sub-menus (title + activities). */
export const ZXS: Record<ZoneId, [Localized, ActivityId[]]> = {
  aulas: [{ es: "📚 Aulas", en: "📚 Classrooms" }, ["course", "aulas"]],
  lab: [{ es: "🚀 Laboratorio Digital", en: "🚀 Digital Lab" }, ["lab", "rad", "patch"]],
  cancha: [{ es: "🏀 Cancha Deportiva", en: "🏀 Sports Court" }, ["cancha", "body", "pong"]],
  verdes: [{ es: "🌱 Zonas Verdes", en: "🌱 Green Zones" }, ["verdes", "therm"]],
  aud: [{ es: "🎤 Auditorio", en: "🎤 Auditorium" }, ["aud", "ar"]],
  senal: [{ es: "📡 La Señal de Ray", en: "📡 Ray’s Signal" }, ["senal", "fires"]],
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
    es: "Entre 1959 y 2026 la exploración lunar pasó de impactos a alunizajes suaves en zonas difíciles, y con Artemis II las personas volvieron a viajar a la Luna.",
    en: "Between 1959 and 2026, lunar exploration went from crash impacts to soft landings in difficult areas, and with Artemis II people travelled to the Moon again.",
  },
  ar: {
    es: "Con realidad aumentada puedes explorar la Luna, la radiación y un traje de astronauta desde tu celular.",
    en: "With augmented reality you can explore the Moon, radiation and an astronaut suit from your phone.",
  },
  senal: {
    es: "Según NASA GISTEMP, la Tierra está más de 1 °C más caliente que a fines del siglo XIX.",
    en: "According to NASA GISTEMP, Earth is more than 1 °C warmer than in the late 1800s.",
  },
  fires: {
    es: "Los satélites de NASA FIRMS detectan incendios desde el espacio gracias al calor que emiten.",
    en: "NASA FIRMS satellites detect fires from space thanks to the heat they give off.",
  },
  patch: {
    es: "Cada misión espacial tiene un parche propio que la tripulación lleva cosido en el traje.",
    en: "Every space mission has its own patch, which the crew wears sewn onto their suits.",
  },
  pong: {
    es: "La gravedad de la Luna es unas 6 veces menor que la de la Tierra: una pelota tarda unas 2,5 veces más en caer desde la misma altura.",
    en: "The Moon’s gravity is about 6 times weaker than Earth’s: a ball takes about 2.5 times longer to fall from the same height.",
  },
  boss: {
    es: "La Reina del Vacío cayó: la lógica y el esfuerzo salvan al universo.",
    en: "The Queen of the Void has fallen: logic and effort save the universe.",
  },
};

/** `CL`: the five energy-core lines of the main mission (one per ORD zone). */
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
    es: "Así que siguieron la señal hasta la Luna… Ahora escucharán mi voz.",
    en: "So you followed the signal all the way to the Moon… Now you will hear my voice.",
  }],
  ["H", { es: "No tenemos miedo. ¡Tenemos ciencia!", en: "We are not afraid. We have science!" }],
  [2, {
    es: "Responde con lógica: cada acierto es un golpe. Tus amigos te ayudarán.",
    en: "Answer with logic: every correct answer is a blow. Your friends will help you.",
  }],
];

/** `bend(1)`: dialogue after defeating the Queen of the Void. */
export const BOSS_WIN_TALK: Line[] = [
  [5, { es: "Imposible… mi voz ya no los confunde.", en: "Impossible… my voice no longer confuses them." }],
  [2, { es: "¡Lo lograron! Selene, la colonia, está a salvo.", en: "You did it! Selene, the colony, is safe." }],
  ["H", { es: "Aprendimos que la ciencia y el esfuerzo salvan al universo.", en: "We learned that science and effort save the universe." }],
  // Phase 6: Elen's "Chapter 2" line moved to the last scene of the ENDING cutscene.
];

/** `bend(0)`: dialogue after losing the boss fight. */
export const BOSS_LOSE_TALK: Line[] = [
  [2, { es: "No te rindas, {n}. Repasa las zonas y vuelve a intentarlo.", en: "Don’t give up, {n}. Review the zones and try again." }],
];

/** `SH`: the 8 star fragments on the map (% coordinates). Each gives +1 ⭐; all 8 → +5 ⭐ bonus.
 *  Every spot is open map at all widths (not under a label, the nav/mission panels, the HUD,
 *  the AR/Orbi buttons or the "Enter" prompt), so it can be reached by tapping it. */
export const SH: [number, number][] = [[16, 35], [40, 31], [58, 57], [34, 52], [70, 52], [93, 50], [68, 80], [26, 84]];
export const SHARD_BONUS = 5;
export const SHARDS_DONE: Line[] = [
  [2, { es: "¡Reuniste los 8 fragmentos de estrella, {n}! Bonus: +5 ⭐.", en: "You gathered all 8 star fragments, {n}! Bonus: +5 ⭐." }],
];

/** `IN`: intro cinematic lines with the CH portraits that pop in. */
export const IN: { text: Localized; chars: number[] }[] = [
  { text: { es: "Año 2087. Una señal misteriosa viaja desde la Luna hasta Cajamarca, en el Perú…", en: "Year 2087. A mysterious signal travels from the Moon to Cajamarca, Peru…" }, chars: [] },
  { text: { es: "Greg, el estratega: un estudiante de la I.E. Aula Estelar que sueña con ser astronauta.", en: "Greg, the strategist: a student at I.E. Aula Estelar who dreams of becoming an astronaut." }, chars: [0] },
  { text: { es: "Elen, la científica que ve lo que otros no ven.", en: "Elen, the scientist who sees what others do not." }, chars: [1] },
  { text: { es: "Orbi, un archivista alienígena y tu guía.", en: "Orbi, an alien archivist and your guide." }, chars: [2] },
  { text: { es: "Joseph, el ingeniero: un rival con más corazón del que aparenta.", en: "Joseph, the engineer: a rival with more heart than he seems." }, chars: [3] },
  { text: { es: "Los Sin Raíz y la Reina del Vacío quieren devorar Selene, la colonia de la Luna.", en: "The Rootless and the Queen of the Void want to devour Selene, the colony on the Moon." }, chars: [4, 5] },
  { text: { es: "Aprende ciencia real en la Tierra. Viaja a la Luna. Salva la Colonia Última.", en: "Learn real science on Earth. Travel to the Moon. Save the Last Colony." }, chars: [] },
];
/** Milliseconds each cinematic line stays on screen. */
export const IN_MS = 3600;

export type ProgressView = { done: Record<string, boolean>; shards: number[]; rayMemories: number[] };

/** `BG`: achievements. */
export const BG: { icon: string; name: Localized; desc: Localized; ok: (s: ProgressView) => boolean }[] = [
  { icon: "🥉", name: { es: "Primer paso", en: "First step" }, desc: { es: "Completa una zona", en: "Complete one zone" }, ok: (s) => ORD.some((k) => s.done[k]) },
  { icon: "🥈", name: { es: "Explorador", en: "Explorer" }, desc: { es: "Completa tres zonas", en: "Complete three zones" }, ok: (s) => ORD.filter((k) => s.done[k]).length >= 3 },
  { icon: "🥇", name: { es: "Comandante lunar", en: "Lunar commander" }, desc: { es: "Completa las cinco zonas", en: "Complete all five zones" }, ok: (s) => ORD.every((k) => s.done[k]) },
  { icon: "🛡️", name: { es: "Escudo antirradiación", en: "Radiation shield" }, desc: { es: "Supera la tormenta solar", en: "Survive the solar storm" }, ok: (s) => !!s.done.rad },
  { icon: "🌡️", name: { es: "Ingeniero térmico", en: "Thermal engineer" }, desc: { es: "Domina el control térmico", en: "Master thermal control" }, ok: (s) => !!s.done.therm },
  { icon: "💪", name: { es: "Astronauta en forma", en: "Fit astronaut" }, desc: { es: "Supera el entrenamiento", en: "Pass the training" }, ok: (s) => !!s.done.body },
  { icon: "✨", name: { es: "Cazador de estrellas", en: "Star hunter" }, desc: { es: "Reúne los 8 fragmentos", en: "Collect all 8 fragments" }, ok: (s) => s.shards.length >= 8 },
  { icon: "📡", name: { es: "Lector de señales", en: "Signal reader" }, desc: { es: "Lee los datos de la NASA con Ray", en: "Read NASA data with Ray" }, ok: (s) => !!s.done.senal && !!s.done.fires },
  { icon: "🎨", name: { es: "Artista espacial", en: "Space artist" }, desc: { es: "Diseña tu parche de misión con Greg", en: "Design your mission patch with Greg" }, ok: (s) => !!s.done.patch },
  { icon: "🏓", name: { es: "Campeón de la cancha", en: "Court champion" }, desc: { es: "Gánale a Joseph al ping pong lunar", en: "Beat Joseph at lunar ping pong" }, ok: (s) => !!s.done.pong },
  { icon: "🧠", name: { es: "Guardián de recuerdos", en: "Memory keeper" }, desc: { es: "Recupera los 6 recuerdos de Ray", en: "Recover Ray’s 6 memories" }, ok: (s) => s.rayMemories.length >= RAY_MEMORIES.length },
  { icon: "👑", name: { es: "Vencedor de la Reina", en: "Queen slayer" }, desc: { es: "Derrota a la Reina del Vacío", en: "Defeat the Queen of the Void" }, ok: (s) => !!s.done.boss },
];

// ---------------------------------------------------------------------------
// Phase 5 · Ray's memory fragments
// ---------------------------------------------------------------------------

/** Zones whose main activity unlocks one of Ray's memories the first time it is won
 *  (the five ORD zones + the NASA data zone = 6 fragments). */
export const MEMORY_ZONES: string[] = [...ORD, "senal"];

/** Ray's 6 memories, unlocked in this order whatever the zone order. Together they reveal
 *  his origin before the boss fight. */
export const RAY_MEMORIES: { icon: string; lines: Localized[] }[] = [
  {
    icon: "🌍",
    lines: [
      { es: "Veo la Tierra… azul y pequeña, como una canica.", en: "I see Earth… blue and tiny, like a marble." },
      { es: "No la miro desde abajo. La miro desde muy, muy lejos.", en: "I’m not looking up at it. I’m looking at it from very, very far away." },
    ],
  },
  {
    icon: "🌑",
    lines: [
      { es: "Un cielo negro aunque sea de día. Polvo gris que nunca se va.", en: "A black sky even in the daytime. Grey dust that never goes away." },
      { es: "Y pasos que flotan… como si pesara seis veces menos.", en: "And steps that float… as if I weighed six times less." },
    ],
  },
  {
    icon: "🏡",
    lines: [
      { es: "Una cúpula llena de plantas y de gente que se reía.", en: "A dome full of plants and people laughing." },
      { es: "La llamaban Selene… la Colonia Última, en la Luna.", en: "They called it Selene… the Last Colony, on the Moon." },
    ],
  },
  {
    icon: "📡",
    lines: [
      { es: "Yo cuidaba la gran antena de la colonia.", en: "I looked after the colony’s great antenna." },
      { es: "Mi trabajo era escuchar a la Tierra y guardar los datos que enviaban sus satélites.", en: "My job was to listen to Earth and keep the data its satellites sent." },
    ],
  },
  {
    icon: "👑",
    lines: [
      { es: "Un día llegó una voz del vacío. Quien la escuchaba olvidaba de dónde venía.", en: "One day a voice from the void arrived. Whoever heard it forgot where they came from." },
      { es: "Así nacieron los Sin Raíz… y yo también la escuché.", en: "That is how the Rootless were born… and I heard it too." },
    ],
  },
  {
    icon: "🚀",
    lines: [
      { es: "Antes de olvidar, encendí la antena con un último mensaje: NOX-Ω. ¡Fui yo quien envió la señal!", en: "Before I forgot, I switched on the antenna with one last message: NOX-Ω. I was the one who sent the signal!" },
      { es: "Luego escapé en una cápsula hacia la Tierra. Soy Ray, de Selene… y ya sé contra quién peleamos.", en: "Then I escaped in a capsule to Earth. I’m Ray, from Selene… and now I know who we are fighting." },
    ],
  },
];

export const MEMORY_TXT = {
  title: { es: "{icon} Recuerdo de Ray {i}/{total}", en: "{icon} Ray’s memory {i}/{total}" },
  unlocked: { es: "✨ Un fragmento de memoria volvió a Ray.", en: "✨ A memory fragment came back to Ray." },
  origin: { es: "🌙 ¡Ray recuerda su origen!", en: "🌙 Ray remembers where he comes from!" },
  inv: { es: "🧠 Recuerdos de Ray: {k}/{total}", en: "🧠 Ray’s memories: {k}/{total}" },
  invHelp: {
    es: "Cada zona completada le devuelve un recuerdo a Ray. Toca uno para volver a verlo.",
    en: "Every completed zone gives Ray back one memory. Tap one to see it again.",
  },
} satisfies Record<string, Localized>;

/** Before the boss, once all 6 memories are back (prepended to BOSS_INTRO). */
export const RAY_BEFORE_BOSS: Line[] = [
  [RAY, {
    es: "{n}, espera. Ya lo recuerdo todo: Selene es mi hogar, la colonia de la Luna que la Reina del Vacío invadió.",
    en: "{n}, wait. I remember everything now: Selene is my home, the Moon colony the Queen of the Void invaded.",
  }],
  [RAY, {
    es: "Ahora quiere hacerle lo mismo a la Tierra, con incendios y calor. ¡No la dejemos!",
    en: "Now she wants to do the same to Earth, with fires and heat. Let’s not let her!",
  }],
];


// ---------------------------------------------------------------------------
// Phase 6 · Ending cutscene (after the boss): Ray's origin revealed, the colony saved
// ---------------------------------------------------------------------------

/** One scene of the ending: the portraits shown (CH index / "H" = hero) and lines that fade in. */
export type EndingScene = { chars: Speaker[]; title: Localized; lines: Localized[] };

export const ENDING: EndingScene[] = [
  {
    chars: [5],
    title: { es: "La voz del vacío se apaga", en: "The voice from the void fades" },
    lines: [
      { es: "Sin preguntas que la confundan, la voz de la Reina del Vacío se deshace como polvo lunar.", en: "With no questions left to confuse anyone, the Queen of the Void’s voice crumbles like moon dust." },
      { es: "En la cara oculta de la Luna, la señal NOX-Ω deja de sonar.", en: "On the far side of the Moon, the NOX-Ω signal falls silent." },
    ],
  },
  {
    chars: [RAY],
    title: { es: "El origen de Ray", en: "Ray’s origin" },
    lines: [
      { es: "Ray: «Ahora lo recuerdo todo. Me llamo Ray y vengo de Selene, la Colonia Última de la Luna.»", en: "Ray: “Now I remember everything. My name is Ray and I come from Selene, the Last Colony on the Moon.”" },
      { es: "«Yo cuidaba su gran antena. Cuando la Reina invadió la Luna, envié NOX-Ω y escapé a la Tierra en una cápsula.»", en: "“I looked after its great antenna. When the Queen invaded the Moon, I sent NOX-Ω and escaped to Earth in a capsule.”" },
      { es: "«Su voz me borró la memoria… pero cada zona que completaste me devolvió un recuerdo.»", en: "“Her voice wiped my memory… but every zone you completed gave me back a memory.”" },
    ],
  },
  {
    chars: [4],
    title: { es: "Los Sin Raíz vuelven a casa", en: "The Rootless go home" },
    lines: [
      { es: "Los Sin Raíz no eran monstruos: eran colonos de Selene que habían olvidado su hogar.", en: "The Rootless were not monsters: they were Selene colonists who had forgotten their home." },
      { es: "Ahora recuerdan sus nombres y regresan a la Luna.", en: "Now they remember their names and return to the Moon." },
    ],
  },
  {
    chars: [2, "H"],
    title: { es: "¡La colonia está a salvo!", en: "The colony is safe!" },
    lines: [
      { es: "Una por una, las cúpulas de Selene se vuelven a encender: luz, aire y plantas.", en: "One by one, Selene’s domes light up again: light, air and plants." },
      { es: "Orbi: «Lo lograste con ciencia, {n}. Guardaré esta historia en mi archivo para siempre.»", en: "Orbi: “You did it with science, {n}. I’ll keep this story in my archive forever.”" },
    ],
  },
  {
    chars: [RAY],
    title: { es: "Un mensaje para la Tierra", en: "A message for Earth" },
    lines: [
      { es: "Ray: «La Reina era parte de este cuento, pero el calor y los incendios que viste en los datos de la NASA son reales.»", en: "Ray: “The Queen was part of this story, but the heat and the fires you saw in the NASA data are real.”" },
      { es: "«Los satélites siguen mirando la Tierra cada día. Entender sus datos es el primer paso para cuidarla.»", en: "“Satellites keep watching Earth every day. Understanding their data is the first step to looking after it.”" },
    ],
  },
  {
    chars: [1, 3, "H"],
    title: { es: "Fin del Capítulo 1", en: "End of Chapter 1" },
    lines: [
      { es: "Elen: «¡Cuando volvamos a Cajamarca, presentaré toda la aventura en el Auditorio de la escuela!»", en: "Elen: “When we get back to Cajamarca, I’ll present the whole adventure in the school Auditorium!”" },
      { es: "Joseph: «Y antes de volver, revancha de ping pong… ¡con gravedad lunar de verdad!»", en: "Joseph: “And before we head home, a ping pong rematch… with real lunar gravity!”" },
      { es: "Continuará… Capítulo 2: «Los que miran desde arriba».", en: "To be continued… Chapter 2: “Those Who Watch from Above”." },
    ],
  },
];

export const ENDING_TXT = {
  scene: { es: "🎬 Final · {i}/{total}", en: "🎬 Ending · {i}/{total}" },
  next: { es: "Siguiente ▶", en: "Next ▶" },
  skip: { es: "⏭ Saltar", en: "⏭ Skip" },
  done: {
    es: "🏆 ¡Misión cumplida! Descifraste NOX-Ω, derrotaste a la Reina del Vacío y salvaste la Colonia Última.",
    en: "🏆 Mission complete! You decoded NOX-Ω, defeated the Queen of the Void and saved the Last Colony.",
  },
  cert: { es: "📜 Obtener mi certificado", en: "📜 Get my certificate" },
  back: { es: "Volver al mapa", en: "Back to the map" },
  replay: { es: "🎬 Ver el final otra vez", en: "🎬 Watch the ending again" },
} satisfies Record<string, Localized>;


// ---------------------------------------------------------------------------
// Journey to the Moon (before the boss): the Last Explorers leave Cajamarca for Selene
// ---------------------------------------------------------------------------

/** A crop of the key art ([x, y, w, h] in its 1170×651 prototype space, see lib/characters.ts)
 *  shown above a scene, with its accessible description. */
export type SceneArt = { rect: [number, number, number, number]; alt: Localized };

/** One scene of the journey: same shape as an ending scene, plus an optional key-art crop or
 *  (`moon`: its accessible description) the full "La Luna en Peligro" scene art (MoonScene.tsx). */
export type JourneyScene = EndingScene & { art?: SceneArt; moon?: Localized };

/** Plays when the player taps "Face the Queen of the Void" (before Ray's lines and BOSS_INTRO), and
 *  can be replayed from the main mission. Uses the key art, the cast portraits and, for the last
 *  scene, scene03 ("La Luna en Peligro"). */
export const JOURNEY: JourneyScene[] = [
  {
    chars: [0, 1, 3],
    title: { es: "Adiós, Cajamarca", en: "Goodbye, Cajamarca" },
    lines: [
      { es: "Al amanecer, los Últimos Exploradores —Greg, Elen y Joseph— se despiden de la I.E. Aula Estelar, en Cajamarca, Perú.", en: "At dawn, the Last Explorers —Greg, Elen and Joseph— say goodbye to I.E. Aula Estelar, in Cajamarca, Peru." },
      { es: "En la mochila llevan los cinco núcleos de energía para Selene y todo lo que aprendieron en su escuela.", en: "In their backpacks they carry the five energy cores for Selene and everything they learned at their school." },
      { es: "{n}: «Selene nos necesita. ¡Vamos a la Luna!»", en: "{n}: “Selene needs us. Let’s go to the Moon!”" },
    ],
  },
  {
    chars: [2, RAY],
    title: { es: "¡Despegue!", en: "Liftoff!" },
    lines: [
      { es: "Orbi: «3… 2… 1… ¡despegue!» El cohete ruge y sube atravesando las nubes.", en: "Orbi: “3… 2… 1… liftoff!” The rocket roars and climbs through the clouds." },
      { es: "Para escapar de la gravedad de la Tierra, hay que viajar a unos 11 km por segundo: ¡más de 40.000 km/h!", en: "To escape Earth’s gravity, you have to travel at about 11 km per second: over 40,000 km/h!" },
      { es: "Ray: «Este es el camino que hice en mi cápsula… pero al revés.»", en: "Ray: “This is the path I took in my capsule… but the other way round.”" },
    ],
  },
  {
    chars: ["H"],
    title: { es: "La Tierra desde el espacio", en: "Earth from space" },
    art: {
      rect: [880, 188, 190, 84],
      alt: { es: "La Tierra, azul y blanca, flotando en el espacio negro", en: "Earth, blue and white, floating in black space" },
    },
    lines: [
      { es: "Por la ventana, la Tierra se ve azul y pequeña, como una canica.", en: "Through the window, Earth looks blue and tiny, like a marble." },
      { es: "{n}: «Desde aquí no se ven fronteras… solo un planeta que hay que cuidar.»", en: "{n}: “From up here you can’t see any borders… just one planet we have to look after.”" },
      { es: "Son unos 384.400 km: unos tres días de viaje, como en las misiones Apolo.", en: "It’s about 384,400 km: around three days of travel, just like the Apollo missions." },
    ],
  },
  {
    chars: [2],
    title: { es: "Alunizaje junto a Selene", en: "Landing near Selene" },
    art: {
      rect: [885, 225, 285, 240],
      alt: { es: "Las cúpulas de Selene en la Luna, con un Sin Raíz delante", en: "Selene’s domes on the Moon, with a Rootless one in front" },
    },
    lines: [
      { es: "Sin aire no hay paracaídas: el módulo frena con su motor y se posa suave, a menos de 2,5 m/s… ¡como en el Laboratorio Digital!", en: "With no air there are no parachutes: the lander brakes with its engine and touches down gently, under 2.5 m/s… just like in the Digital Lab!" },
      { es: "Junto al cráter aparecen las cúpulas de Selene, la Colonia Última. Están en silencio, y entre ellas vagan los Sin Raíz.", en: "Next to the crater stand the domes of Selene, the Last Colony. They are silent, and the Rootless wander between them." },
    ],
  },
  {
    chars: [],
    title: { es: "Los Últimos Exploradores en la Luna", en: "The Last Explorers on the Moon" },
    moon: {
      es: "Desde la cabina de la nave, Greg, Elen, Orbi y Joseph ven la Luna invadida: la Reina del Vacío se alza sobre las cúpulas de Selene entre naves oscuras",
      en: "From the ship’s cockpit, Greg, Elen, Orbi and Joseph see the invaded Moon: the Queen of the Void rises over Selene’s domes among dark ships",
    },
    lines: [
      { es: "Cielo negro, polvo gris y pasos que flotan: pesan seis veces menos que en Cajamarca.", en: "Black sky, grey dust and floating steps: they weigh six times less than in Cajamarca." },
      { es: "Sobre las cúpulas se alza una sombra enorme. La Reina del Vacío los esperaba.", en: "A huge shadow rises over the domes. The Queen of the Void was waiting for them." },
      { es: "Orbi: «Recuerden todo lo que aprendimos en la escuela. ¡Es hora de salvar Selene!»", en: "Orbi: “Remember everything we learned at school. It’s time to save Selene!”" },
    ],
  },
];

export const JOURNEY_TXT = {
  scene: { es: "🚀 Viaje a la Luna · {i}/{total}", en: "🚀 Journey to the Moon · {i}/{total}" },
  replay: { es: "🚀 Ver el viaje a la Luna", en: "🚀 Watch the journey to the Moon" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Briefing screen "Misión Lunar – Fase 1" (components/map/Briefing.tsx): HTML copies of every
// text panel painted in public/img/briefing.jpg. Shown after the intro and before the map the
// first time, and replayable from the main mission panel.
// ---------------------------------------------------------------------------

export const BRIEF_TXT = {
  label: { es: "Misión Lunar – Fase 1: sesión informativa", en: "Lunar Mission – Phase 1: briefing" },
  orbi: {
    es: "¡Hola, equipo! Desde Cajamarca, viajaremos a la Luna. Primero, aprendamos cómo hacerlo de forma segura.",
    en: "Hi, team! From Cajamarca, we’ll travel to the Moon. First, let’s learn how to do it safely.",
  },
  mission: { es: "Misión Lunar – Fase 1", en: "Lunar Mission – Phase 1" },
  motto: { es: "Aprende. Practica. Explora.", en: "Learn. Practice. Explore." },
  place: { es: "Cajamarca, Perú", en: "Cajamarca, Peru" },
  flag: { es: "Bandera del Perú", en: "Flag of Peru" },
  level: { es: "Nivel 1", en: "Level 1" },
  banner1: { es: "Uniendo", en: "Uniting" },
  banner2: { es: "ciencia, tecnología", en: "science, technology" },
  banner3: { es: "y sueños", en: "and dreams" },
  school: { es: "Escuela de Cajamarca", en: "Cajamarca School" },
  bottom: {
    es: "Completa los módulos para preparar la misión lunar desde la Tierra.",
    en: "Complete the modules to prepare the lunar mission from Earth.",
  },
  start: { es: "¡Comenzar!", en: "Let’s go!" },
  /** Orbi's summary of the 3-step goal after ¡Comenzar!, before the map opens. */
  goal: {
    es: "¡Listos, {n}! Nuestra misión tiene 3 pasos: 1) recupera los 5 núcleos de energía en las zonas de la escuela, 2) viaja a la Luna y 3) derrota a la Reina del Vacío. ¡Al mapa!",
    en: "Ready, {n}! Our mission has 3 steps: 1) recover the 5 energy cores in the school zones, 2) travel to the Moon and 3) defeat the Queen of the Void. To the map!",
  },
  tap: { es: "Toca un panel para saber dónde se aprende.", en: "Tap a panel to see where you learn it." },
  /** Orbi's line when a side panel is tapped. {topic}, {where} filled in Briefing.tsx. */
  learn: { es: "{topic}: lo practicas en {where}.", en: "{topic}: you practice it in {where}." },
  and: { es: "y en", en: "and in" },
  replay: { es: "🛰️ Ver la sesión informativa (Fase 1)", en: "🛰️ Watch the briefing (Phase 1)" },
} satisfies Record<string, Localized>;

/** The five tappable side panels: painted title + check items, and the activities (zone → game)
 *  that teach the topic. */
export const BRIEF_PANELS: { id: string; title: Localized; items: Localized[]; learn: ActivityId[] }[] = [
  {
    id: "suits",
    title: { es: "Trajes Espaciales", en: "Spacesuits" },
    items: [{ es: "Presión", en: "Pressure" }, { es: "Temperatura", en: "Temperature" }, { es: "Movilidad", en: "Mobility" }],
    learn: ["ar", "therm"],
  },
  {
    id: "missions",
    title: { es: "Misiones Lunares", en: "Lunar Missions" },
    items: [{ es: "Apolo 11", en: "Apollo 11" }, { es: "Apolo 17", en: "Apollo 17" }, { es: "Actuales", en: "Current" }],
    learn: ["aud"],
  },
  {
    id: "life",
    title: { es: "Soporte Vital", en: "Life Support" },
    items: [{ es: "Oxígeno", en: "Oxygen" }, { es: "Agua", en: "Water" }, { es: "Control de CO₂", en: "CO₂ control" }],
    learn: ["verdes"],
  },
  {
    id: "rad",
    title: { es: "Blindaje de Radiación", en: "Radiation Shielding" },
    items: [{ es: "Rayos cósmicos", en: "Cosmic rays" }, { es: "Radiación solar", en: "Solar radiation" }],
    learn: ["rad"],
  },
  {
    id: "energy",
    title: { es: "Energía de la Nave", en: "Ship Energy" },
    items: [{ es: "Paneles solares", en: "Solar panels" }, { es: "Baterías", en: "Batteries" }],
    learn: ["therm"],
  },
];

// ---------------------------------------------------------------------------
// "La Luna en Peligro" scene (public/img/scene03.jpg, components/map/MoonScene.tsx): HTML copies
// of its painted text panels. Last scene of the Journey to the Moon and backdrop of the boss
// intro. The villain is the Reina del Vacío / Queen of the Void (as in the art and the GDD v2).
// ---------------------------------------------------------------------------

export const MOON_TXT = {
  label: { es: "Escenario 02: La Luna en Peligro", en: "Scenario 02: The Moon in Danger" },
  scenario: { es: "Escenario 02 · La Luna en Peligro", en: "Scenario 02 · The Moon in Danger" },
  current: { es: "Misión Actual", en: "Current Mission" },
  rescue: { es: "Rescata la Luna", en: "Rescue the Moon" },
  task1: { es: "Analiza la invasión de la Reina del Vacío", en: "Analyze the Queen of the Void’s invasion" },
  task2: { es: "Protege la nave y prepara el aterrizaje", en: "Protect the ship and prepare the landing" },
  /** Orbi's painted line: "¡{n}!" in bold, then the rest. */
  callout: { es: "¡{n}!", en: "{n}!" },
  orbi: {
    es: "La Reina del Vacío ha invadido la Luna… Debemos aprender todo sobre la misión lunar y prepararnos para enfrentarla.",
    en: "The Queen of the Void has invaded the Moon… We must learn everything about the lunar mission and get ready to face her.",
  },
  learn: { es: "Aprende y prepárate:", en: "Learn and get ready:" },
  tutorial: { es: "Tutorial STEM", en: "STEM Tutorial" },
  continue: { es: "¡Continuar!", en: "Continue!" },
} satisfies Record<string, Localized>;

/** The "Aprende y prepárate" list, in the painted order. */
export const MOON_LEARN: Localized[] = [
  { es: "Trajes Espaciales", en: "Spacesuits" },
  { es: "Blindaje de Radiación", en: "Radiation Shielding" },
  { es: "Soporte Vital", en: "Life Support" },
  { es: "Energía de la Nave", en: "Ship Energy" },
  { es: "Navegación Lunar", en: "Lunar Navigation" },
  { es: "Aterrizaje Seguro", en: "Safe Landing" },
];
