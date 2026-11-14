import type { Localized } from "./types";

// Mini-game content ported 1:1 from the prototype (Q, LS, MT and the texts of quiz, course,
// lander, storm, therm, jump, body). Spanish = prototype original, English = prototype TR table.
// Numbers are formatted with toFixed() exactly like the prototype (dot decimals in both languages).
// Strings marked "no TR entry" were left untranslated by the prototype and are translated here.

// ---------------------------------------------------------------------------
// Aulas · MoonQuiz (prototype `Q`, `quiz`)
// ---------------------------------------------------------------------------

export type QuizQuestion = { q: Localized; options: Localized[]; answer: number; explain: Localized };

/** `Q`: 4 questions, explanation after each answer. */
export const Q: QuizQuestion[] = [
  {
    q: { es: "¿Cuánta gravedad tiene la Luna comparada con la Tierra?", en: "How much gravity does the Moon have compared to Earth?" },
    options: [
      { es: "Casi la misma", en: "Almost the same" },
      { es: "Cerca de 1/6", en: "About 1/6" },
      { es: "El doble", en: "Double" },
    ],
    answer: 1,
    explain: {
      es: "Unos 1,62 m/s²: cerca de la sexta parte de la gravedad terrestre.",
      en: "About 1.62 m/s²: roughly one sixth of Earth’s gravity.",
    },
  },
  {
    q: { es: "¿Por qué en la Luna no se escuchan sonidos?", en: "Why can’t you hear sounds on the Moon?" },
    options: [
      { es: "Hace mucho frío", en: "It is very cold" },
      { es: "No hay atmósfera que transmita el sonido", en: "There is no atmosphere to carry sound" },
      { es: "Los trajes bloquean el ruido", en: "Spacesuits block the noise" },
    ],
    answer: 1,
    explain: {
      es: "El sonido necesita aire u otro medio para viajar; en la Luna casi no hay atmósfera.",
      en: "Sound needs air or another medium to travel; the Moon has almost no atmosphere.",
    },
  },
  {
    q: { es: "¿Cuánto dura un día lunar completo (de amanecer a amanecer)?", en: "How long is a full lunar day (sunrise to sunrise)?" },
    options: [
      { es: "24 horas", en: "24 hours" },
      { es: "Unos 3 días", en: "About 3 days" },
      { es: "Unos 29,5 días terrestres", en: "About 29.5 Earth days" },
    ],
    answer: 2,
    explain: {
      es: "Por eso las noches lunares duran cerca de dos semanas: ¡un gran reto para la energía solar!",
      en: "That is why lunar nights last about two weeks: a huge challenge for solar power!",
    },
  },
  {
    q: { es: "¿Por qué una base lunar necesita protección contra la radiación?", en: "Why does a lunar base need protection from radiation?" },
    options: [
      { es: "Por los volcanes activos", en: "Because of active volcanoes" },
      { es: "La Luna casi no tiene atmósfera ni campo magnético global", en: "The Moon has almost no atmosphere or global magnetic field" },
      { es: "Por el viento lunar", en: "Because of lunar wind" },
    ],
    answer: 1,
    explain: {
      es: "Sin atmósfera, la radiación solar y cósmica llega directa a la superficie.",
      en: "Without an atmosphere, solar and cosmic radiation reaches the surface directly.",
    },
  },
];

export const QUIZ = {
  head: { es: "📚 Aulas · {i}/{n}", en: "📚 Classrooms · {i}/{n}" },
  end: { es: "📚 Aulas", en: "📚 Classrooms" },
  score: { es: "Aciertos:", en: "Correct:" },
  keepExploring: { es: "Seguir explorando", en: "Keep exploring" },
  next: { es: "Siguiente", en: "Next" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Aulas · Lessons (prototype `LS`, `course`)
// ---------------------------------------------------------------------------

export type Lesson = { icon: string; name: Localized; text: Localized; q: Localized; options: Localized[]; answer: number };

/** `LS`: 5 mini lessons, each with a check question. */
export const LS: Lesson[] = [
  {
    icon: "🌙",
    name: { es: "La Luna", en: "The Moon" },
    text: {
      es: "Está a unos 384.400 km y mide cerca de un cuarto de la Tierra. Casi no tiene atmósfera.",
      en: "It is about 384,400 km away and about a quarter of Earth’s size. It has almost no atmosphere.",
    },
    q: { es: "¿Tiene atmósfera la Luna?", en: "Does the Moon have an atmosphere?" },
    options: [{ es: "Casi no", en: "Almost none" }, { es: "Sí, como la Tierra", en: "Yes, like Earth" }],
    answer: 0,
  },
  {
    icon: "☢️",
    name: { es: "Radiación", en: "Radiation" },
    text: {
      es: "Sin atmósfera ni campo magnético global, el Sol y el espacio envían partículas directo a la superficie. Se protege con capas gruesas: regolito, agua o polietileno.",
      en: "Without an atmosphere or a global magnetic field, the Sun and space send particles straight to the surface. Protection comes from thick layers: regolith, water or polyethylene.",
    },
    q: { es: "¿Qué protege mejor una base?", en: "What protects a base best?" },
    options: [{ es: "Una capa de regolito o agua", en: "A layer of regolith or water" }, { es: "Una tela fina", en: "A thin cloth" }],
    answer: 0,
  },
  {
    icon: "🌡️",
    name: { es: "Temperatura", en: "Temperature" },
    text: {
      es: "En el ecuador lunar la superficie pasa de unos +120 °C de día a unos −130 °C de noche. En cráteres siempre en sombra hace menos de −200 °C.",
      en: "At the lunar equator the surface goes from about +120 °C by day to about −130 °C at night. In permanently shadowed craters it is colder than −200 °C.",
    },
    q: { es: "¿Por qué hay tanta diferencia?", en: "Why is the difference so big?" },
    options: [
      { es: "No hay atmósfera que retenga el calor", en: "There is no atmosphere to hold the heat" },
      { es: "Porque la Luna está muy lejos del Sol", en: "Because the Moon is very far from the Sun" },
    ],
    answer: 0,
  },
  {
    icon: "🧑‍🚀",
    name: { es: "El cuerpo", en: "The body" },
    text: {
      es: "Con poca gravedad los huesos y los músculos se debilitan. Por eso los astronautas hacen ejercicio unas 2 horas al día.",
      en: "With low gravity, bones and muscles weaken. That is why astronauts exercise about 2 hours a day.",
    },
    q: { es: "¿Qué ayuda a mantener fuertes los huesos?", en: "What helps keep bones strong?" },
    options: [{ es: "Ejercicio diario", en: "Daily exercise" }, { es: "Dormir todo el día", en: "Sleeping all day" }],
    answer: 0,
  },
  {
    icon: "🚀",
    name: { es: "Las misiones", en: "The missions" },
    text: {
      es: "Luna 2 (1959) fue la primera en llegar; Apolo 11 (1969) llevó a las primeras personas. Hoy varias agencias preparan volver con bases.",
      en: "Luna 2 (1959) was the first to arrive; Apollo 11 (1969) carried the first people. Today several agencies are preparing to return with bases.",
    },
    q: { es: "¿Qué misión llevó a las primeras personas a caminar en la Luna?", en: "Which mission took the first people to walk on the Moon?" },
    options: [{ es: "Apolo 11", en: "Apollo 11" }, { es: "Luna 2", en: "Luna 2" }],
    answer: 0,
  },
];

export const COURSE = {
  head: { es: "{icon} {name} · {i}/5", en: "{icon} {name} · {i}/5" },
  wrong: { es: "Casi. Lee la lección otra vez e inténtalo.", en: "Almost. Read the lesson again and try once more." },
  doneTitle: { es: "📖 Curso completado", en: "📖 Course complete" },
  doneText: { es: "¡Ya sabes lo básico para tu primera misión!", en: "You now know the basics for your first mission!" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Laboratorio · LanderGame (prototype `lander`)
// ---------------------------------------------------------------------------

/** Lander physics, prototype values. */
export const LANDER = {
  g: 1.62, // lunar gravity, m/s²
  thrust: 4.2, // engine deceleration, m/s²
  burn: 10, // fuel %/s while the engine is on
  y0: 100, // start altitude, m
  winV: 2.5, // max landing speed, m/s
  threeStarV: 1.2, // ≤ this → 3 ★ (else 2 ★)
};

export const LANDER_TXT = {
  title: { es: "🚀 Laboratorio · Aterrizaje lunar", en: "🚀 Lab · Lunar landing" },
  desc: {
    es: "Gravedad lunar: 1,62 m/s². Mantén pulsado el motor para frenar y aterriza a menos de 2,5 m/s. Sin atmósfera no hay paracaídas.",
    en: "Lunar gravity: 1.62 m/s². Hold the engine to slow down and land below 2.5 m/s. With no atmosphere there are no parachutes.",
  },
  status: {
    es: "Altura {y} m · Velocidad {v} m/s · Combustible {f} %",
    en: "Altitude {y} m · Speed {v} m/s · Fuel {f} %",
  },
  engine: { es: "🔥 Mantener motor (Espacio)", en: "🔥 Hold engine (Space)" },
  retry: { es: "Reintentar", en: "Retry" },
  win: { es: "✅ ¡Alunizaje suave a {v} m/s! ⭐ +{s}", en: "✅ Soft landing at {v} m/s! ⭐ +{s}" },
  /** replay of an already-completed landing: no stars added, so no "⭐ +N" */
  winReplay: { es: "✅ ¡Alunizaje suave a {v} m/s!", en: "✅ Soft landing at {v} m/s!" },
  crash: {
    es: "💥 Impacto a {v} m/s. Enciende el motor antes y con más constancia.",
    en: "💥 Impact at {v} m/s. Fire the engine earlier and keep it steady.",
  },
  canvas: { es: "Simulación de alunizaje", en: "Lunar landing simulation" }, // new: canvas aria-label
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Laboratorio · RadiationShield (prototype `MT`, `storm`)
// ---------------------------------------------------------------------------

/** `MT`: shield materials — icon, name, mass, fraction blocked (simplified game values). */
export const MT: { icon: string; name: Localized; mass: number; block: number }[] = [
  { icon: "🧱", name: { es: "Regolito", en: "Regolith" }, mass: 1, block: 0.15 },
  { icon: "🛡️", name: { es: "Aluminio", en: "Aluminum" }, mass: 3, block: 0.25 },
  { icon: "💧", name: { es: "Agua", en: "Water" }, mass: 2, block: 0.3 },
  { icon: "🧪", name: { es: "Polietileno", en: "Polyethylene" }, mass: 2, block: 0.35 },
];
/** Mass budget and the max dose (%) that counts as a safe shelter. */
export const STORM = { budget: 8, safeDose: 35 };

export const STORM_TXT = {
  title: { es: "☀️ Tormenta solar", en: "☀️ Solar storm" },
  desc: {
    es: "¡Llega una tormenta solar! Construye el blindaje del refugio con tu presupuesto de masa (valores simplificados para jugar). Masa libre: {free} / {budget}",
    en: "A solar storm is coming! Build the shelter’s shielding with your mass budget (simplified values for play). Free mass: {free} / {budget}",
  },
  dose: { es: "Dosis esperada: {d} %", en: "Expected dose: {d} %" },
  material: { es: "{icon} {name} · masa {m} · bloquea {b} %", en: "{icon} {name} · mass {m} · blocks {b} %" },
  start: { es: "⚡ Iniciar tormenta", en: "⚡ Start storm" },
  reset: { es: "Reiniciar", en: "Reset" }, // no TR entry
  safe: {
    es: "✅ ¡Refugio seguro! Los materiales ricos en hidrógeno, como el agua y el polietileno, frenan mejor la radiación.",
    en: "✅ Safe shelter! Hydrogen-rich materials, such as water and polyethylene, slow radiation better.",
  },
  tooHigh: {
    es: "⚠️ Dosis demasiado alta ({d} %). Combina capas más eficaces.",
    en: "⚠️ Dose too high ({d} %). Combine more effective layers.",
  },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Zonas Verdes · ThermalControl (prototype `therm`)
// ---------------------------------------------------------------------------

/** A lunar day compressed into 30 s, ticking every 100 ms; win if ≥ 75 % of the time in 15–25 °C. */
export const THERM = { seconds: 30, tickMs: 100, lo: 15, hi: 25, start: 20, winPct: 75 };

export const THERM_TXT = {
  title: { es: "🌡️ Control térmico", en: "🌡️ Thermal control" },
  desc: {
    es: "Un día lunar comprimido en 30 segundos. Mantén el refugio entre 15 °C y 25 °C con el calefactor y el radiador.",
    en: "A lunar day compressed into 30 seconds. Keep the shelter between 15 °C and 25 °C with the heater and the radiator.",
  },
  heater: { es: "🔥 Calefactor", en: "🔥 Heater" },
  radiator: { es: "❄️ Radiador", en: "❄️ Radiator" },
  temps: {
    es: "☀️ Exterior: {te} °C · 🏠 Interior: {ti} °C",
    en: "☀️ Outside: {te} °C · 🏠 Inside: {ti} °C",
  },
  timer: { es: "⏱️ {s} s", en: "⏱️ {s} s" },
  win: { es: "✅ ¡Refugio estable el {p} % del tiempo!", en: "✅ Shelter stable for {p} % of the time!" },
  lose: {
    es: "⚠️ Solo {p} % del tiempo en rango. Necesitas 75 %. Inténtalo otra vez.",
    en: "⚠️ Only {p} % of the time in range. You need 75 %. Try again.",
  },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Cancha · JumpSim (prototype `jump`)
// ---------------------------------------------------------------------------

/** height = v² / (2 g). Earth 9.81 vs Moon 1.62 m/s². */
export const JUMP = { gEarth: 9.81, gMoon: 1.62, min: 1, max: 6, step: 0.5, v0: 3, px: 210 };

export const JUMP_TXT = {
  title: { es: "🏀 Cancha · Salto lunar", en: "🏀 Court · Lunar jump" },
  // no TR entry for the full sentence (the prototype only swapped "Tierra:"/"Luna:"/"Altura")
  desc: {
    es: "Mismo impulso, distinta gravedad. Altura = v² ÷ (2 × g). Tierra: 9,81 m/s² · Luna: 1,62 m/s².",
    en: "Same push, different gravity. Height = v² ÷ (2 × g). Earth: 9.81 m/s² · Moon: 1.62 m/s².",
  },
  speed: { es: "Velocidad de salto:", en: "Jump speed:" },
  unit: { es: "m/s", en: "m/s" },
  earthH: { es: "Tierra:", en: "Earth:" },
  moonH: { es: "· Luna:", en: "· Moon:" },
  meters: { es: "{h} m", en: "{h} m" },
  ratio: { es: "(≈ {r} veces más alto)", en: "(≈ {r} times higher)" },
  earth: { es: "Tierra", en: "Earth" },
  moon: { es: "Luna", en: "Moon" },
  go: { es: "¡Saltar!", en: "Jump!" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Cancha · BodyTraining (prototype `body`)
// ---------------------------------------------------------------------------

/** Daily plan: 3 h fixed for hygiene and meals; win if sleep ≥ 7, exercise ≥ 2, work ≥ 6, free ≥ 2. */
export const BODY = {
  fixed: 3,
  sleep: { min: 4, max: 10, step: 1, v0: 6, need: 7 },
  exercise: { min: 0, max: 4, step: 0.5, v0: 1, need: 2 },
  work: { min: 0, max: 12, step: 1, v0: 10, need: 6 },
  freeNeed: 2,
};

export const BODY_TXT = {
  title: { es: "🧑‍🚀 Entrenamiento de astronauta", en: "🧑‍🚀 Astronaut training" },
  desc: {
    es: "Planifica tu día en la base: con poca gravedad el cuerpo cambia. Elige sueño, ejercicio y trabajo; 3 h son fijas para aseo y comidas.",
    en: "Plan your day on the base: with low gravity the body changes. Choose sleep, exercise and work; 3 h are fixed for hygiene and meals.",
  },
  sleep: { es: "😴 Sueño:", en: "😴 Sleep:" },
  exercise: { es: "🏋️ Ejercicio:", en: "🏋️ Exercise:" },
  work: { es: "🛠️ Trabajo:", en: "🛠️ Work:" },
  hours: { es: "h", en: "h" },
  checks: {
    es: "{a} Sueño ≥ 7 h · {b} Ejercicio ≥ 2 h · {c} Trabajo ≥ 6 h · {d} Tiempo libre ≥ 2 h (te quedan {f} h)",
    en: "{a} Sleep ≥ 7 h · {b} Exercise ≥ 2 h · {c} Work ≥ 6 h · {d} Free time ≥ 2 h (you have {f} h)",
  },
  confirm: { es: "Confirmar plan", en: "Confirm plan" },
  ok: { es: "✅ ¡Plan de astronauta equilibrado!", en: "✅ Balanced astronaut plan!" },
  bad: {
    es: "⚠️ Ajusta el plan: cuida el sueño, el ejercicio y el tiempo libre.",
    en: "⚠️ Adjust the plan: take care of sleep, exercise and free time.",
  },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Zonas Verdes · OxygenBalance (prototype `verd`)
// ---------------------------------------------------------------------------

/** O₂ balance: each person uses 0.84 kg/day, plants make 0.08 kg per m² per day (simplified);
 *  win if production ÷ consumption is in 0.95–1.2 → 3 ★. */
export const VERD = {
  o2PerPerson: 0.84,
  o2PerM2: 0.08,
  lo: 0.95,
  hi: 1.2,
  crew: { min: 2, max: 8, v0: 4 },
  plants: { min: 0, max: 80, v0: 20 },
};

export const VERD_TXT = {
  title: { es: "🌱 Zonas Verdes · Invernadero lunar", en: "🌱 Green Zones · Lunar greenhouse" },
  desc: {
    es: "Equilibra el oxígeno. Cada persona consume ≈ 0,84 kg de O₂ al día. Las plantas lo producen (valor simplificado para jugar: 0,08 kg por m² y día).",
    en: "Balance the oxygen. Each person uses ≈ 0.84 kg of O₂ per day. Plants produce it (simplified game value: 0.08 kg per m² per day).",
  },
  crew: { es: "Tripulación:", en: "Crew:" },
  plants: { es: "Plantas (m²):", en: "Plants (m²):" },
  flow: {
    es: "Consumo {c} kg/día · Producción {p} kg/día",
    en: "Usage {c} kg/day · Output {p} kg/day",
  },
  confirm: { es: "Confirmar diseño", en: "Confirm design" },
  win: { es: "✅ ¡Aire equilibrado! ⭐ +3", en: "✅ Air balanced! ⭐ +3" },
  /** replay of an already-completed design: no stars added, so no "⭐ +3" */
  winReplay: { es: "✅ ¡Aire equilibrado!", en: "✅ Air balanced!" },
  low: {
    es: "⚠️ Falta oxígeno: añade plantas o reduce la tripulación.",
    en: "⚠️ Not enough oxygen: add plants or reduce the crew.",
  },
  high: {
    es: "⚠️ Sobra oxígeno: gastas espacio y agua de más.",
    en: "⚠️ Too much oxygen: you are wasting space and water.",
  },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Auditorio · MissionTimeline (prototype `TL`, `aud`)
// ---------------------------------------------------------------------------

/** `TL`: missions, oldest → newest. */
export const TL: { year: number; text: Localized }[] = [
  { year: 1959, text: { es: "Luna 2: primer objeto humano en llegar a la Luna", en: "Luna 2: first human-made object to reach the Moon" } },
  { year: 1969, text: { es: "Apolo 11: primeras personas en caminar sobre la Luna", en: "Apollo 11: first people to walk on the Moon" } },
  { year: 2019, text: { es: "Chang’e 4: primer alunizaje en la cara oculta", en: "Chang’e 4: first landing on the far side" } },
  { year: 2023, text: { es: "Chandrayaan-3: alunizaje cerca del polo sur lunar", en: "Chandrayaan-3: landing near the lunar south pole" } },
];
/** Order the TL entries are shown in (prototype `[2,0,3,1]`). */
export const TL_SHOW = [2, 0, 3, 1];

export const TL_TXT = {
  title: { es: "🎤 Auditorio · Línea de tiempo", en: "🎤 Auditorium · Timeline" },
  desc: { es: "Toca las misiones de la más antigua a la más reciente.", en: "Tap the missions from oldest to most recent." },
  placed: { es: "{year} · {text}", en: "{year} · {text}" },
  win: { es: "✅ ¡Línea del tiempo completa! ⭐ +3", en: "✅ Timeline complete! ⭐ +3" },
  winReplay: { es: "✅ ¡Línea del tiempo completa!", en: "✅ Timeline complete!" },
  wrong: { es: "Esa misión no fue la siguiente. ¡Fíjate en el año!", en: "That mission was not next. Check the year!" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Final · BossFight (prototype `BQ`, `fight`, `bturn`, `ba`, `ally`, `bend`)
// ---------------------------------------------------------------------------

/** `BQ`: the boss quiz = the 4 Aulas questions + 4 from the other zones (shuffled each fight). */
export const BQ: QuizQuestion[] = Q.concat([
  {
    q: { es: "Con el mismo salto, ¿cuántas veces más alto llegas en la Luna?", en: "With the same jump, how many times higher do you go on the Moon?" },
    // "Igual": no TR entry
    options: [{ es: "≈ 6 veces", en: "≈ 6 times" }, { es: "≈ 2 veces", en: "≈ 2 times" }, { es: "Igual", en: "The same" }],
    answer: 0,
    explain: { es: "La gravedad lunar es ≈ 1/6 de la terrestre.", en: "Lunar gravity is ≈ 1/6 of Earth’s." },
  },
  {
    q: { es: "¿Cómo frena un módulo lunar sin atmósfera?", en: "How does a lunar lander brake without an atmosphere?" },
    options: [{ es: "Con paracaídas", en: "With a parachute" }, { es: "Con su motor", en: "With its engine" }, { es: "Con alas", en: "With wings" }],
    answer: 1,
    explain: { es: "Sin aire no hay paracaídas ni alas: se usa el motor.", en: "With no air there are no parachutes or wings: you use the engine." },
  },
  {
    q: { es: "¿Qué misión aterrizó primero en la cara oculta de la Luna?", en: "Which mission first landed on the far side of the Moon?" },
    options: [{ es: "Apolo 11", en: "Apollo 11" }, { es: "Chang’e 4", en: "Chang’e 4" }, { es: "Luna 2", en: "Luna 2" }],
    answer: 1,
    explain: { es: "Chang’e 4 lo logró en 2019.", en: "Chang’e 4 did it in 2019." },
  },
  {
    q: { es: "¿Qué aportan las plantas en una colonia?", en: "What do plants provide in a colony?" },
    options: [
      { es: "Gravedad", en: "Gravity" }, // no TR entry
      { es: "Oxígeno y parte del ciclo del aire", en: "Oxygen and part of the air cycle" },
      { es: "Protección total contra radiación", en: "Total radiation protection" },
    ],
    answer: 1,
    explain: { es: "Ayudan a cerrar el ciclo del aire junto con sistemas mecánicos.", en: "They help close the air cycle together with mechanical systems." },
  },
]);

/** Both sides start at 100; a hit takes 25, every 3rd correct answer in a row is a critical −50. */
export const BOSS = { hp: 100, hit: 25, crit: 50, streak: 3, stars: 5 };
/** Ally pool (prototype `[1,3,0].filter(x => x !== S.ch)`): first = hint, second = shield. */
export const BOSS_ALLIES = [1, 3, 0];

export const BOSS_TXT = {
  title: { es: "👑 Reina Hueca", en: "👑 Hollow Queen" },
  queen: { es: "Reina", en: "Queen" },
  art: { es: "La Reina Hueca", en: "The Hollow Queen" }, // new: image aria-label
  remove: { es: "🦊 Orbi: quitar opción", en: "🦊 Orbi: remove option" },
  hint: { es: "💬 {name}: pista", en: "💬 {name}: hint" },
  shield: { es: "🛡️ {name}: escudo", en: "🛡️ {name}: shield" },
  hintMsg: { es: "💬 {text}", en: "💬 {text}" },
  shieldReady: { es: "🛡️ Escudo listo para el próximo ataque.", en: "🛡️ Shield ready for the next attack." },
  hitMsg: { es: "💥 ¡Golpe certero! −25 a la Reina.", en: "💥 Direct hit! −25 to the Queen." },
  critMsg: { es: "⚡ ¡CRÍTICO! Racha de 3: −50 a la Reina.", en: "⚡ CRITICAL! 3-hit streak: −50 to the Queen." },
  blocked: { es: "🛡️ ¡El escudo bloqueó el ataque!", en: "🛡️ The shield blocked the attack!" },
  counter: { es: "👑 La Reina contraataca: −25 para ti.", en: "👑 The Queen strikes back: −25 for you." },
  cont: { es: "Continuar", en: "Continue" },
  winTitle: { es: "🏆 ¡Misión cumplida!", en: "🏆 Mission complete!" },
  winText: {
    es: "Descifraste NOX-Ω, derrotaste a la Reina Hueca y salvaste la Colonia Última.",
    en: "You decoded NOX-Ω, defeated the Hollow Queen and saved the Last Colony.",
  },
  back: { es: "Volver al mapa", en: "Back to the map" },
  loseTitle: { es: "La Reina resiste", en: "The Queen resists" },
  retry: { es: "Reintentar combate", en: "Retry battle" },
  review: { es: "Repasar el mapa", en: "Review the map" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Auditorio / menu · ARView (prototype `ar`, `ars`, `arl`, `arm`)
// ---------------------------------------------------------------------------

/** Canvas size, start position of the model, size slider, number of models (all 4 seen → 2 ★). */
export const AR = { w: 640, h: 420, x0: 320, y0: 230, zMin: 0.5, zMax: 2, zStep: 0.1, models: 4, stars: 2 };

export const AR_TXT = {
  title: { es: "📷 Realidad aumentada de bajo costo", en: "📷 Low-cost augmented reality" },
  opening: { es: "Abriendo cámara…", en: "Opening camera…" },
  live: { es: "Cámara activa: arrastra el modelo para colocarlo.", en: "Camera on: drag the model to place it." },
  fail: {
    es: "No pude abrir la cámara (permiso o navegador). Verás el modelo sobre un fondo espacial; en tu celular, permite el acceso a la cámara.",
    en: "I couldn’t open the camera (permission or browser). You will see the model over a space background; on your phone, allow camera access.",
  },
  size: { es: "Tamaño", en: "Size" },
  change: { es: "Cambiar modelo", en: "Change model" },
  how: {
    es: "Cómo funciona: la cámara del celular más un modelo dibujado en pantalla. Arrástralo sobre una mesa o una hoja con un dibujo. No necesita app, marcadores ni equipo especial.",
    en: "How it works: your phone camera plus a model drawn on screen. Drag it over a table or a sheet with a drawing. No app, markers or special equipment needed.",
  },
  canvas: { es: "Vista de realidad aumentada", en: "Augmented reality view" }, // new: canvas aria-label
  // Canvas captions per model (0 Moon, 1 lander, 2 radiation, 3 suit)
  moon: { es: "Luna: ~+120 °C de día y ~−130 °C de noche", en: "Moon: ~+120 °C by day and ~−130 °C at night" },
  day: { es: "☀️ Día: ~+120 °C", en: "☀️ Day: ~+120 °C" },
  night: { es: "🌑 Noche: ~−130 °C", en: "🌑 Night: ~−130 °C" },
  lander: { es: "Módulo lunar (modelo ilustrativo)", en: "Lunar module (illustrative model)" },
  rad: { es: "Radiación: más grosor del escudo (Tamaño) = menos dosis", en: "Radiation: a thicker shield (Size) = less dose" },
  dose: { es: "Dosis dentro: {p} %", en: "Dose inside: {p} %" },
  suit: { es: "Traje de astronauta (modelo ilustrativo)", en: "Astronaut suit (illustrative model)" },
  visor: { es: "Visor dorado: filtra el Sol", en: "Gold visor: filters the Sun" },
  pack: { es: "Mochila: aire, agua y energía", en: "Backpack: air, water and power" },
  layers: { es: "Capas: frío y calor extremos", en: "Layers: extreme cold and heat" },
  boots: { es: "Botas: caminar con 1/6 de gravedad", en: "Boots: walking at 1/6 gravity" },
} satisfies Record<string, Localized>;
