import type { Localized } from "./types";

// Mini-game content ported 1:1 from the prototype (Q, LS, MT and the texts of quiz, course,
// lander, storm, therm, jump, body). Spanish = prototype original, English = prototype TR table.
// Numbers are formatted with toFixed() exactly like the prototype (dot decimals in both languages).
// Strings marked "no TR entry" were left untranslated by the prototype and are translated here.

// ---------------------------------------------------------------------------
// Aulas · MoonQuiz (prototype `Q`, `quiz`)
// ---------------------------------------------------------------------------

export type QuizQuestion = {
  q: Localized;
  options: Localized[];
  answer: number;
  explain: Localized;
  /** Phase 5: Orbi's 💡 hint (a nudge, never the answer itself). */
  hint: Localized;
};

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
    hint: {
      es: "Piensa en los astronautas del Apolo: daban saltos enormes y parecían flotar al caminar.",
      en: "Think of the Apollo astronauts: they made huge hops and seemed to float as they walked.",
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
    hint: {
      es: "El sonido viaja como ondas a través del aire. ¿Qué le falta a la Luna?",
      en: "Sound travels as waves through the air. What is the Moon missing?",
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
    hint: {
      es: "La Luna tarda casi un mes en mostrarnos todas sus fases… y su día dura casi lo mismo.",
      en: "The Moon takes almost a month to show us all its phases… and its day lasts about as long.",
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
    hint: {
      es: "En la Tierra, el aire y el campo magnético nos sirven de escudo. ¿La Luna tiene eso?",
      en: "On Earth, the air and the magnetic field act as our shield. Does the Moon have those?",
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

export type Lesson = {
  icon: string;
  name: Localized;
  text: Localized;
  q: Localized;
  options: Localized[];
  answer: number;
  /** Phase 5: Orbi's 💡 hint. */
  hint: Localized;
};

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
    hint: { es: "Si la Luna tuviera aire, desde allá veríamos un cielo azul. ¿Lo ves en las fotos?", en: "If the Moon had air, we would see a blue sky from up there. Do you see one in the photos?" },
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
    hint: { es: "Las partículas se frenan con capas gruesas y pesadas, no con algo delgado.", en: "Particles are slowed by thick, heavy layers, not by something thin." },
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
    hint: { es: "En la Tierra, el aire funciona como una manta que guarda el calor por la noche.", en: "On Earth, the air works like a blanket that keeps the heat in at night." },
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
    hint: { es: "Los músculos y los huesos se hacen fuertes cuando los usas.", en: "Muscles and bones get stronger when you use them." },
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
    hint: { es: "Una de esas misiones no llevaba personas: solo llegó a chocar contra la Luna.", en: "One of those missions carried no people: it just crashed into the Moon." },
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
    es: "Planifica tu día en una base lunar: con poca gravedad el cuerpo cambia. Elige sueño, ejercicio y trabajo; 3 h son fijas para aseo y comidas.",
    en: "Plan your day on a lunar base: with low gravity the body changes. Choose sleep, exercise and work; 3 h are fixed for hygiene and meals.",
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
  // Phase 5. Artemis I: launched 16 Nov 2022, uncrewed Orion around the Moon.
  { year: 2022, text: { es: "Artemis I: la nave Orión, sin tripulación, viaja alrededor de la Luna", en: "Artemis I: the Orion spacecraft, uncrewed, travels around the Moon" } },
  { year: 2023, text: { es: "Chandrayaan-3: alunizaje cerca del polo sur lunar", en: "Chandrayaan-3: landing near the lunar south pole" } },
  // Phase 5. Artemis II: launched 1 Apr 2026, splashdown 10 Apr 2026 (verified before adding).
  { year: 2026, text: { es: "Artemis II: cuatro astronautas viajan alrededor de la Luna", en: "Artemis II: four astronauts travel around the Moon" } },
];
/** Order the TL entries are shown in (prototype `[2,0,3,1]`, extended with the two Artemis missions). */
export const TL_SHOW = [2, 0, 4, 5, 1, 3];

export const TL_TXT = {
  title: { es: "🎤 Auditorio · Línea de tiempo", en: "🎤 Auditorium · Timeline" },
  desc: { es: "Toca las misiones de la más antigua a la más reciente.", en: "Tap the missions from oldest to most recent." },
  placed: { es: "{year} · {text}", en: "{year} · {text}" },
  win: { es: "✅ ¡Línea del tiempo completa! ⭐ +3", en: "✅ Timeline complete! ⭐ +3" },
  winReplay: { es: "✅ ¡Línea del tiempo completa!", en: "✅ Timeline complete!" },
  wrong: { es: "Esa misión no fue la siguiente. ¡Fíjate en el año!", en: "That mission was not next. Check the year!" },
  // Phase 5: Elen hosts the timeline (speech bubbles inside the game).
  elenStart: {
    es: "Como delegada del salón me tocó presentar esta charla. Ordenar misiones es como mis juegos de mesa: piensa antes de mover la ficha.",
    en: "As class delegate, I was asked to host this talk. Ordering missions is like my board games: think before you move your piece.",
  },
  elenRight: { es: "¡Bien! Esa va ahí. ¿Cuál sigue?", en: "Nice! That one goes there. What comes next?" },
  elenWrong: {
    es: "Mmm, no. Pista: las dos Artemis son las más nuevas, ¡la última es de este año!",
    en: "Hmm, no. Tip: the two Artemis missions are the newest, the last one is from this year!",
  },
  elenWin: {
    es: "¡Perfecto! De Luna 2 a Artemis II: 67 años de historia. Ojalá Joseph hubiera visto esto… digo, ¡todos! 😳",
    en: "Perfect! From Luna 2 to Artemis II: 67 years of history. I wish Joseph had seen this… I mean, everyone! 😳",
  },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Final · BossFight (prototype `BQ`, `fight`, `bturn`, `ba`, `ally`, `bend`)
// Phase 6: a mixed quiz drawn from every zone (incl. La Señal de Ray and the Phase 5 crew
// features). Every correct answer breaks one segment of the Hollow Queen's shield;
// 3 wrong answers → retry.
// ---------------------------------------------------------------------------

/** Where each boss question comes from (one shield segment per topic). */
export type BossTopic = "aulas" | "lab" | "cancha" | "verdes" | "aud" | "gistemp" | "firms" | "crew";

/** Label shown above each boss question. */
export const BOSS_TOPICS: Record<BossTopic, Localized> = {
  aulas: { es: "📚 Aulas", en: "📚 Classrooms" },
  lab: { es: "🚀 Laboratorio Digital", en: "🚀 Digital Lab" },
  cancha: { es: "🏀 Cancha Deportiva", en: "🏀 Sports Court" },
  verdes: { es: "🌱 Zonas Verdes", en: "🌱 Green Zones" },
  aud: { es: "🎤 Auditorio", en: "🎤 Auditorium" },
  gistemp: { es: "📈 La Señal de Ray · NASA GISTEMP", en: "📈 Ray’s Signal · NASA GISTEMP" },
  firms: { es: "🔥 La Señal de Ray · NASA FIRMS", en: "🔥 Ray’s Signal · NASA FIRMS" },
  crew: { es: "🧑‍🤝‍🧑 Tus amigos", en: "🧑‍🤝‍🧑 Your friends" },
};

/** The boss question pool by topic. The 8 prototype `BQ` questions (the 4 Aulas questions +
 *  jump, lander, Chang’e 4, plants) are kept; the rest are new in Phase 6. */
export const BOSS_POOL: Record<BossTopic, QuizQuestion[]> = {
  aulas: Q,
  lab: [
    {
      q: { es: "¿Cómo frena un módulo lunar sin atmósfera?", en: "How does a lunar lander brake without an atmosphere?" },
      options: [{ es: "Con paracaídas", en: "With a parachute" }, { es: "Con su motor", en: "With its engine" }, { es: "Con alas", en: "With wings" }],
      answer: 1,
      explain: { es: "Sin aire no hay paracaídas ni alas: se usa el motor.", en: "With no air there are no parachutes or wings: you use the engine." },
      hint: { es: "Recuerda el Laboratorio: sin aire, ¿qué cosas dejan de funcionar?", en: "Remember the Lab: with no air, which things stop working?" },
    },
    {
      q: { es: "¿Qué materiales frenan mejor la radiación de una tormenta solar?", en: "Which materials best slow the radiation of a solar storm?" },
      options: [
        { es: "El vidrio y el papel", en: "Glass and paper" },
        { es: "El agua y el polietileno, ricos en hidrógeno", en: "Water and polyethylene, rich in hydrogen" },
        { es: "Ninguno: la radiación no se puede frenar", en: "None: radiation cannot be slowed" },
      ],
      answer: 1,
      explain: {
        es: "Los materiales ricos en hidrógeno, como el agua y el polietileno, frenan mejor la radiación.",
        en: "Hydrogen-rich materials, such as water and polyethylene, slow radiation better.",
      },
      hint: {
        es: "Recuerda la tormenta solar del Laboratorio: ¿qué materiales bloqueaban más por cada kilo?",
        en: "Remember the Lab’s solar storm: which materials blocked the most per kilo?",
      },
    },
    {
      q: { es: "¿A qué velocidad máxima debías tocar el suelo en el aterrizaje lunar?", en: "What was the top speed for touching down in the lunar landing?" },
      options: [{ es: "2,5 m/s", en: "2.5 m/s" }, { es: "25 m/s", en: "25 m/s" }, { es: "Da igual la velocidad", en: "Speed doesn’t matter" }],
      answer: 0,
      explain: {
        es: "Para un alunizaje suave había que llegar a 2,5 m/s o menos (≤ 1,2 m/s para 3 ⭐).",
        en: "For a soft landing you had to arrive at 2.5 m/s or less (≤ 1.2 m/s for 3 ⭐).",
      },
      hint: { es: "Un alunizaje tiene que ser muy suave, casi como caminar.", en: "A lunar landing has to be very gentle, almost like walking." },
    },
  ],
  cancha: [
    {
      q: { es: "Con el mismo salto, ¿cuántas veces más alto llegas en la Luna?", en: "With the same jump, how many times higher do you go on the Moon?" },
      // "Igual": no TR entry
      options: [{ es: "≈ 6 veces", en: "≈ 6 times" }, { es: "≈ 2 veces", en: "≈ 2 times" }, { es: "Igual", en: "The same" }],
      answer: 0,
      explain: { es: "La gravedad lunar es ≈ 1/6 de la terrestre.", en: "Lunar gravity is ≈ 1/6 of Earth’s." },
      hint: { es: "Recuerda la Cancha: la gravedad lunar es cerca de la sexta parte de la terrestre.", en: "Remember the Sports Court: lunar gravity is about one sixth of Earth’s." },
    },
    {
      q: { es: "¿Por qué los astronautas entrenan unas 2 horas al día en el espacio?", en: "Why do astronauts train about 2 hours a day in space?" },
      options: [
        { es: "Para no aburrirse", en: "So they don’t get bored" },
        { es: "Para ganar una competencia", en: "To win a competition" },
        { es: "Para que sus huesos y músculos no se debiliten", en: "So their bones and muscles don’t get weaker" },
      ],
      answer: 2,
      explain: {
        es: "Sin ejercicio, en el espacio los huesos pierden densidad y los músculos se debilitan.",
        en: "Without exercise, in space bones lose density and muscles get weaker.",
      },
      hint: { es: "Recuerda el entrenamiento de astronauta: con poca gravedad, el cuerpo casi no hace esfuerzo.", en: "Remember the astronaut training: with little gravity, the body hardly makes any effort." },
    },
  ],
  verdes: [
    {
      q: { es: "¿Qué aportan las plantas en una colonia?", en: "What do plants provide in a colony?" },
      options: [
        { es: "Gravedad", en: "Gravity" }, // no TR entry
        { es: "Oxígeno y parte del ciclo del aire", en: "Oxygen and part of the air cycle" },
        { es: "Protección total contra radiación", en: "Total radiation protection" },
      ],
      answer: 1,
      explain: { es: "Ayudan a cerrar el ciclo del aire junto con sistemas mecánicos.", en: "They help close the air cycle together with mechanical systems." },
      hint: { es: "Recuerda las Zonas Verdes: con la fotosíntesis, las plantas toman CO₂ y liberan algo que respiramos.", en: "Remember the Green Zones: through photosynthesis, plants take in CO₂ and release something we breathe." },
    },
    {
      q: { es: "¿Cuánto oxígeno respira una persona en un día, más o menos?", en: "About how much oxygen does one person breathe in a day?" },
      options: [{ es: "≈ 0,84 kg", en: "≈ 0.84 kg" }, { es: "≈ 84 kg", en: "≈ 84 kg" }, { es: "≈ 8 g", en: "≈ 8 g" }],
      answer: 0,
      explain: {
        es: "Cada persona usa unos 0,84 kg de O₂ al día: por eso el invernadero necesita muchas plantas por tripulante.",
        en: "Each person uses about 0.84 kg of O₂ a day: that’s why the greenhouse needs many plants per crew member.",
      },
      hint: { es: "Recuerda el invernadero lunar: es menos de un kilo, pero más que una cucharita.", en: "Remember the lunar greenhouse: it’s less than a kilo, but more than a teaspoon." },
    },
    {
      q: { es: "¿Cómo cambia la temperatura en el ecuador lunar entre el día y la noche?", en: "How does the temperature at the lunar equator change between day and night?" },
      options: [
        { es: "Siempre está a unos 20 °C", en: "It is always about 20 °C" },
        { es: "Pasa de unos +120 °C a unos −130 °C", en: "It goes from about +120 °C to about −130 °C" },
        { es: "Cambia solo 1 °C", en: "It only changes by 1 °C" },
      ],
      answer: 1,
      explain: {
        es: "Sin atmósfera que guarde el calor, el día lunar quema y la noche congela: la base necesita control térmico.",
        en: "With no atmosphere to hold heat, the lunar day burns and the night freezes: the base needs thermal control.",
      },
      hint: { es: "Recuerda el control térmico: sin aire, los extremos son enormes.", en: "Remember thermal control: without air, the extremes are huge." },
    },
  ],
  aud: [
    {
      q: { es: "¿Qué misión aterrizó primero en la cara oculta de la Luna?", en: "Which mission first landed on the far side of the Moon?" },
      options: [{ es: "Apolo 11", en: "Apollo 11" }, { es: "Chang’e 4", en: "Chang’e 4" }, { es: "Luna 2", en: "Luna 2" }],
      answer: 1,
      explain: { es: "Chang’e 4 lo logró en 2019.", en: "Chang’e 4 did it in 2019." },
      hint: { es: "Recuerda el Auditorio: fue en 2019, y la misión lleva el nombre de una diosa lunar china.", en: "Remember the Auditorium: it was in 2019, and the mission is named after a Chinese Moon goddess." },
    },
    {
      q: { es: "¿Qué misión llevó a las primeras personas a caminar sobre la Luna?", en: "Which mission took the first people to walk on the Moon?" },
      options: [{ es: "Luna 2 (1959)", en: "Luna 2 (1959)" }, { es: "Chandrayaan-3 (2023)", en: "Chandrayaan-3 (2023)" }, { es: "Apolo 11 (1969)", en: "Apollo 11 (1969)" }],
      answer: 2,
      explain: { es: "En 1969 el Apolo 11 llevó a las primeras personas a caminar sobre la Luna.", en: "In 1969 Apollo 11 took the first people to walk on the Moon." },
      hint: { es: "Recuerda la línea del tiempo de Elen: Luna 2 solo fue un impacto, sin personas.", en: "Remember Elen’s timeline: Luna 2 was only a crash impact, with no people." },
    },
  ],
  gistemp: [
    {
      q: { es: "Según NASA GISTEMP, ¿cuánto se calentó la Tierra desde fines del siglo XIX?", en: "According to NASA GISTEMP, how much has Earth warmed since the late 1800s?" },
      options: [{ es: "Nada", en: "Not at all" }, { es: "Más de 1 °C", en: "More than 1 °C" }, { es: "Unos 10 °C", en: "About 10 °C" }],
      answer: 1,
      explain: {
        es: "En 1880 la anomalía era −0,18 °C y en 2024 llegó a +1,28 °C: más de 1 °C de calentamiento.",
        en: "In 1880 the anomaly was −0.18 °C and in 2024 it reached +1.28 °C: more than 1 °C of warming.",
      },
      hint: { es: "Ray dijo que es como si todo el planeta tuviera fiebre: poco, pero importante.", en: "Ray said it’s like the whole planet has a fever: small, but important." },
    },
    {
      q: { es: "En la gráfica de GISTEMP, ¿qué significa una «anomalía» de +1 °C?", en: "On the GISTEMP chart, what does an “anomaly” of +1 °C mean?" },
      options: [
        { es: "Que ese año la Tierra estuvo a 1 °C", en: "That Earth was at 1 °C that year" },
        { es: "Que el termómetro se equivocó", en: "That the thermometer was wrong" },
        { es: "Que ese año fue 1 °C más caliente que el promedio de 1951–1980", en: "That the year was 1 °C hotter than the 1951–1980 average" },
      ],
      answer: 2,
      explain: {
        es: "La anomalía compara cada año con el promedio de 1951–1980: arriba de 0, más caliente; abajo de 0, más frío.",
        en: "The anomaly compares each year with the 1951–1980 average: above 0 is hotter, below 0 is colder.",
      },
      hint: { es: "Recuerda el termómetro de la Tierra: la gráfica no muestra grados normales, sino una comparación.", en: "Remember Earth’s thermometer: the chart doesn’t show normal degrees, but a comparison." },
    },
    {
      q: { es: "En los datos de NASA GISTEMP, ¿cuál fue el año más caluroso desde 1880?", en: "In the NASA GISTEMP data, which was the hottest year since 1880?" },
      options: [{ es: "1998", en: "1998" }, { es: "2024", en: "2024" }, { es: "1880", en: "1880" }],
      answer: 1,
      explain: {
        es: "2024 tuvo la anomalía más alta del registro: +1,28 °C. Los años más recientes casi siempre ganan.",
        en: "2024 had the highest anomaly on record: +1.28 °C. The most recent years almost always win.",
      },
      hint: { es: "En el juego de Ray, ¿qué años solían ganar: los antiguos o los recientes?", en: "In Ray’s game, which years usually won: the old ones or the recent ones?" },
    },
  ],
  firms: [
    {
      q: { es: "¿Cómo detectan los satélites de NASA FIRMS los incendios desde el espacio?", en: "How do NASA FIRMS satellites detect fires from space?" },
      options: [
        { es: "Escuchando el ruido del fuego", en: "By listening to the noise of the fire" },
        { es: "«Sintiendo» el calor que emiten, con luz infrarroja", en: "By “feeling” the heat they give off, with infrared light" },
        { es: "Preguntando a los bomberos", en: "By asking the firefighters" },
      ],
      answer: 1,
      explain: {
        es: "Su cámara especial detecta el calor (luz infrarroja) de los incendios, como tu mano cerca de una fogata.",
        en: "Their special camera detects the heat (infrared light) of fires, like your hand near a campfire.",
      },
      hint: { es: "En el espacio no hay aire, así que el sonido no viaja. ¿Qué otra cosa sale de un fuego?", en: "There is no air in space, so sound doesn’t travel. What else comes out of a fire?" },
    },
    {
      q: { es: "En el mapa de incendios de Ray, ¿qué es cada punto rojo?", en: "On Ray’s fire map, what is each red dot?" },
      options: [
        { es: "Un incendio visto por un satélite en 24 horas", en: "A fire seen by a satellite within 24 hours" },
        { es: "Una ciudad iluminada de noche", en: "A city lit up at night" },
        { es: "Un volcán", en: "A volcano" },
      ],
      answer: 0,
      explain: {
        es: "Cada punto es un incendio activo con confianza alta, detectado por el satélite en las últimas 24 horas.",
        en: "Each dot is a high-confidence active fire, detected by the satellite in the last 24 hours.",
      },
      hint: { es: "El mapa se llama «mapa de incendios» por algo…", en: "It’s called the “fire map” for a reason…" },
    },
    {
      q: { es: "¿Por qué el mapa de FIRMS muestra tantos incendios cada día?", en: "Why does the FIRMS map show so many fires every day?" },
      options: [
        { es: "Son errores del satélite", en: "They are satellite errors" },
        { es: "Todos los causan los rayos", en: "They are all caused by lightning" },
        { es: "Muchos son quemas de pastos o cultivos hechas por personas; otros, incendios forestales", en: "Many are grass or crop burns set by people; others are wildfires" },
      ],
      answer: 2,
      explain: {
        es: "Las quemas agrícolas y los incendios forestales se ven desde el espacio; por eso los científicos vigilan el planeta todos los días.",
        en: "Farm burns and wildfires can be seen from space; that’s why scientists watch the planet every day.",
      },
      hint: { es: "Recuerda lo que explicó Ray al final del mapa: muchos fuegos los encienden las personas.", en: "Remember what Ray explained at the end of the map: people start many fires." },
    },
  ],
  crew: [
    {
      q: { es: "Elen presentó Artemis II (2026). ¿Qué hizo esa misión?", en: "Elen presented Artemis II (2026). What did that mission do?" },
      options: [
        { es: "Cuatro astronautas viajaron alrededor de la Luna", en: "Four astronauts travelled around the Moon" },
        { es: "Aterrizó en Marte", en: "It landed on Mars" },
        { es: "Fue el primer impacto en la Luna", en: "It was the first impact on the Moon" },
      ],
      answer: 0,
      explain: {
        es: "En abril de 2026 la nave Orión llevó a cuatro astronautas alrededor de la Luna: las personas volvieron a viajar a la Luna.",
        en: "In April 2026 the Orion spacecraft took four astronauts around the Moon: people travelled to the Moon again.",
      },
      hint: { es: "Elen dijo que era la misión más nueva de su línea del tiempo… y con tripulación.", en: "Elen said it was the newest mission on her timeline… and it had a crew." },
    },
    {
      q: { es: "Greg diseñó un parche de misión. ¿Para qué sirve un parche de misión?", en: "Greg designed a mission patch. What is a mission patch for?" },
      options: [
        { es: "Para tapar agujeros del traje", en: "To cover holes in the suit" },
        { es: "Es el emblema de cada misión, que la tripulación lleva cosido en el traje", en: "It’s each mission’s emblem, which the crew wears sewn onto their suits" },
        { es: "Para protegerse de la radiación", en: "To protect against radiation" },
      ],
      answer: 1,
      explain: { es: "Cada misión espacial tiene su propio parche, diseñado como un símbolo del equipo.", en: "Every space mission has its own patch, designed as a symbol of the team." },
      hint: { es: "Greg dijo que cada misión tiene el suyo… como el escudo de un equipo de fútbol.", en: "Greg said every mission has its own… like a football team’s badge." },
    },
    {
      q: { es: "En el ping pong lunar de Joseph, ¿por qué la pelota cae más lento en la Luna?", en: "In Joseph’s lunar ping pong, why does the ball fall more slowly on the Moon?" },
      options: [
        { es: "Porque en la Luna hay viento", en: "Because there is wind on the Moon" },
        { es: "Porque la pelota pesa más", en: "Because the ball weighs more" },
        { es: "Porque la gravedad lunar es unas 6 veces menor", en: "Because lunar gravity is about 6 times weaker" },
      ],
      answer: 2,
      explain: {
        es: "Con 1,62 m/s² en vez de 9,81 m/s², la pelota tarda unas 2,5 veces más en caer desde la misma altura.",
        en: "With 1.62 m/s² instead of 9.81 m/s², the ball takes about 2.5 times longer to fall from the same height.",
      },
      hint: { es: "Joseph dijo que en la Luna la pelota «flota más». ¿Qué la hace caer?", en: "Joseph said that on the Moon the ball “floats more”. What makes it fall?" },
    },
    {
      q: { es: "¿De dónde viene Ray, el Sin Raíz?", en: "Where does Ray, the Wanderer, come from?" },
      options: [
        { es: "De Marte", en: "From Mars" },
        { es: "De Selene, la colonia de la Luna", en: "From Selene, the Moon colony" },
        { es: "Del fondo del mar", en: "From the bottom of the sea" },
      ],
      answer: 1,
      explain: {
        es: "Ray cuidaba la gran antena de Selene y envió la señal NOX-Ω antes de escapar a la Tierra.",
        en: "Ray looked after Selene’s great antenna and sent the NOX-Ω signal before escaping to Earth.",
      },
      hint: { es: "Recuerda sus fragmentos de memoria: una cúpula llena de plantas, con cielo negro y polvo gris.", en: "Remember his memory fragments: a dome full of plants, with a black sky and grey dust." },
    },
  ],
};

/** Shield segments (one per topic: the first round of the draw covers every topic), lives,
 *  stars for the first win. */
export const BOSS = { segments: 8, lives: 3, stars: 5 };
/** Ally pool (prototype `[1,3,0].filter(x => x !== S.ch)`): first = hint, second = shield. */
export const BOSS_ALLIES = [1, 3, 0];

export type BossQuestion = QuizQuestion & { topic: BossTopic };

/** Draw a boss quiz: topics in random order, one shuffled question from each topic per round
 *  (so the first 8 questions cover all 8 topics), options shuffled too. `rnd` = Math.random. */
export function drawBossQuiz(rnd: () => number = Math.random): BossQuestion[] {
  const shuffle = <T,>(a: T[]) => a.map((v) => [rnd(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const topics = shuffle(Object.keys(BOSS_POOL) as BossTopic[]);
  const decks = topics.map((k) => shuffle(BOSS_POOL[k]).map((q) => ({ ...q, topic: k })));
  const out: BossQuestion[] = [];
  for (let r = 0; decks.some((d) => r < d.length); r++) {
    for (const d of decks) {
      if (r >= d.length) continue;
      const q = d[r];
      const order = shuffle(q.options.map((_, i) => i));
      out.push({ ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) });
    }
  }
  return out;
}

export const BOSS_TXT = {
  title: { es: "👑 Reina Hueca", en: "👑 Hollow Queen" },
  queen: { es: "Escudo de la Reina", en: "Queen’s shield" },
  art: { es: "La Reina Hueca", en: "The Hollow Queen" }, // new: image aria-label
  segments: { es: "Escudo de la Reina: {k} de {total} segmentos", en: "Queen’s shield: {k} of {total} segments" },
  lives: { es: "Tus vidas: {k} de {total}", en: "Your lives: {k} of {total}" },
  rules: {
    es: "Cada acierto rompe un segmento del escudo. Con 3 errores, la Reina gana esta ronda.",
    en: "Every right answer breaks one shield segment. With 3 mistakes, the Queen wins this round.",
  },
  from: { es: "Pregunta {i} · {topic}", en: "Question {i} · {topic}" },
  remove: { es: "🦊 Orbi: quitar opción", en: "🦊 Orbi: remove option" },
  hint: { es: "💬 {name}: pista", en: "💬 {name}: hint" },
  shield: { es: "🛡️ {name}: escudo", en: "🛡️ {name}: shield" },
  hintMsg: { es: "💬 {text}", en: "💬 {text}" },
  shieldReady: { es: "🛡️ Escudo listo: tu próximo error no te quitará una vida.", en: "🛡️ Shield ready: your next mistake won’t cost you a life." },
  hitMsg: { es: "💥 ¡Acierto! Rompiste un segmento del escudo de la Reina.", en: "💥 Correct! You broke one segment of the Queen’s shield." },
  lastMsg: { es: "💥 ¡El escudo de la Reina se hizo pedazos!", en: "💥 The Queen’s shield shattered!" },
  blocked: { es: "🛡️ ¡El escudo de tu amigo bloqueó el ataque!", en: "🛡️ Your friend’s shield blocked the attack!" },
  counter: { es: "👑 La Reina contraataca: pierdes una vida.", en: "👑 The Queen strikes back: you lose a life." },
  cont: { es: "Continuar", en: "Continue" },
  loseTitle: { es: "La Reina resiste", en: "The Queen resists" },
  loseText: {
    es: "Rompiste {k} de {total} segmentos. Repasa las zonas o usa las pistas de Orbi y de tus amigos.",
    en: "You broke {k} of {total} segments. Review the zones or use the hints from Orbi and your friends.",
  },
  retry: { es: "Reintentar combate", en: "Retry battle" },
  review: { es: "Repasar el mapa", en: "Review the map" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Phase 6 · Certificate "Explorador/a de Selene"
// The player's name is typed in the game and only kept on this device (localStorage).
// ---------------------------------------------------------------------------

/** Canvas size (px) of the certificate PNG. */
export const CERT = { w: 1200, h: 850, maxName: 32 };

export const CERT_TXT = {
  title: { es: "📜 Tu certificado", en: "📜 Your certificate" },
  locked: { es: "Derrota a la Reina Hueca para obtener tu certificado.", en: "Defeat the Hollow Queen to get your certificate." },
  nameLabel: { es: "Escribe tu nombre para el certificado:", en: "Type your name for the certificate:" },
  namePh: { es: "Tu nombre", en: "Your name" },
  privacy: {
    es: "🔒 Tu nombre solo se guarda en este dispositivo: nunca se envía a internet.",
    en: "🔒 Your name is only kept on this device: it is never sent to the internet.",
  },
  canvas: { es: "Vista previa del certificado", en: "Certificate preview" },
  download: { es: "⬇️ Descargar PNG", en: "⬇️ Download PNG" },
  needName: { es: "Escribe tu nombre para poder descargarlo.", en: "Type your name to be able to download it." },
  downloaded: { es: "✅ ¡Certificado descargado!", en: "✅ Certificate downloaded!" },
  file: { es: "certificado-explorador-de-selene", en: "selene-explorer-certificate" },
  // Drawn on the canvas:
  heading: { es: "CERTIFICADO", en: "CERTIFICATE" },
  award: { es: "Explorador/a de Selene", en: "Selene Explorer" },
  certifies: { es: "Se certifica que", en: "This certifies that" },
  noName: { es: "Tu nombre aquí", en: "Your name here" },
  body1: {
    es: "salvó la Colonia Última junto a {hero}, derrotó a la Reina Hueca",
    en: "saved the Last Colony alongside {hero}, defeated the Hollow Queen",
  },
  body2: {
    es: "y aprendió ciencia lunar leyendo datos reales de la NASA.",
    en: "and learned lunar science by reading real NASA data.",
  },
  stars: { es: "{k} estrellas", en: "{k} stars" },
  gems: { es: "{k} cristales", en: "{k} crystals" },
  memories: { es: "{k}/{total} recuerdos de Ray", en: "{k}/{total} of Ray’s memories" },
  date: { es: "Fecha: {date}", en: "Date: {date}" },
  hero: { es: "Personaje: {hero}", en: "Character: {hero}" },
  footer: {
    es: "Greg y la Colonia Última · Space Apps Challenge 2026 · Cajamarca",
    en: "Greg and the Last Colony · Space Apps Challenge 2026 · Cajamarca",
  },
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

// ---------------------------------------------------------------------------
// Phase 4 · La Señal de Ray — real NASA data (public/data/*.json, built by scripts/build_data.py)
// Numbers here are formatted per language with Intl (es-PE / en-US: dot decimals, as used in Peru).
// ---------------------------------------------------------------------------

/** Shared texts of the NASA data games. */
export const DATA_TXT = {
  loading: { es: "Ray está sintonizando la señal…", en: "Ray is tuning in the signal…" },
  error: {
    es: "No pude leer los datos de la señal. Cierra y vuelve a intentarlo.",
    en: "I couldn’t read the signal data. Close and try again.",
  },
  rayTitle: { es: "Ray explica:", en: "Ray explains:" },
  again: { es: "🔁 Jugar otra vez", en: "🔁 Play again" },
} satisfies Record<string, Localized>;

/** Phase 5: Orbi's 💡 hints for the generated questions of the NASA data games. */
export const DATA_HINTS = {
  temp: {
    es: "Piensa en la tendencia: en las últimas décadas la Tierra se ha ido calentando. ¿Cuál de los dos años es más reciente?",
    en: "Think about the trend: in recent decades Earth has been warming up. Which of the two years is more recent?",
  },
  fire: {
    es: "No te fíes del tamaño del continente: busca dónde se amontonan más puntos rojos en el mapa.",
    en: "Don’t go by the size of the continent: look for where the red dots pile up the most on the map.",
  },
} satisfies Record<string, Localized>;

/** TempChart: 5 rounds of "which year was hotter?"; stars by correct answers. */
export const TEMP = { rounds: 5, minGap: 0.1, stars: [[5, 3], [4, 2], [3, 1]] as [number, number][] };

export const TEMP_TXT = {
  title: { es: "📈 El termómetro de la Tierra", en: "📈 Earth’s thermometer" },
  ray: {
    es: "Esta línea es la temperatura de toda la Tierra, año por año, desde 1880. No muestra grados normales: muestra cuánto más caliente (arriba de 0) o más frío (abajo de 0) fue cada año comparado con el promedio de 1951 a 1980. A eso los científicos le llaman «anomalía».",
    en: "This line is the temperature of the whole Earth, year by year, since 1880. It doesn’t show normal degrees: it shows how much hotter (above 0) or colder (below 0) each year was compared with the 1951–1980 average. Scientists call that an “anomaly”.",
  },
  question: { es: "Ronda {r}/{total}: ¿qué año fue más caluroso?", en: "Round {r}/{total}: which year was hotter?" },
  hidden: { es: "🔒 Elige un año para revelar la gráfica", en: "🔒 Pick a year to reveal the chart" },
  right: { es: "✅ ¡Correcto! {hot} fue más caluroso que {cold}.", en: "✅ Correct! {hot} was hotter than {cold}." },
  wrong: { es: "❌ Casi. {hot} fue más caluroso que {cold}.", en: "❌ Not quite. {hot} was hotter than {cold}." },
  values: { es: "{y1}: {a1} °C · {y2}: {a2} °C", en: "{y1}: {a1} °C · {y2}: {a2} °C" },
  next: { es: "Siguiente ronda ▶", en: "Next round ▶" },
  finish: { es: "Ver resultado ▶", en: "See result ▶" },
  score: { es: "Acertaste {c} de {total}.", en: "You got {c} out of {total} right." },
  win: {
    es: "🎉 ¡Sabes leer el termómetro de la Tierra! +{s} ⭐. ¿Notaste algo? Los años más recientes casi siempre ganan: la línea sube.",
    en: "🎉 You can read Earth’s thermometer! +{s} ⭐. Did you notice? The most recent years almost always win: the line goes up.",
  },
  winReplay: {
    es: "🎉 ¡Muy bien! Los años más recientes casi siempre son los más calurosos: la línea sube.",
    en: "🎉 Well done! The most recent years are almost always the hottest: the line goes up.",
  },
  lose: {
    es: "Necesitas al menos 3 aciertos. Pista de Ray: fíjate hacia dónde va la línea con los años.",
    en: "You need at least 3 right answers. Ray’s tip: look at where the line goes over the years.",
  },
  axisY: { es: "Anomalía (°C)", en: "Anomaly (°C)" },
  axisX: { es: "Año", en: "Year" },
  series: { es: "Temperatura global vs. 1951–1980", en: "Global temperature vs. 1951–1980" },
  tooltip: { es: "{y}: {a} °C", en: "{y}: {a} °C" },
  chartLabel: {
    es: "Gráfica de líneas: anomalía de temperatura global de {from} a {to}, de {min} °C a {max} °C.",
    en: "Line chart: global temperature anomaly from {from} to {to}, from {min} °C to {max} °C.",
  },
  caption: {
    es: "NASA — GISTEMP v4, temperatura global ({from}–{to}), datos descargados el {date}",
    en: "NASA — GISTEMP v4, global temperature ({from}–{to}), data downloaded {date}",
  },
} satisfies Record<string, Localized>;

/** Continents for the FireMap game: first matching [latMin, latMax, lonMin, lonMax] box wins.
 *  Rough bounding boxes (good enough to count fires; borders are approximate). */
export const CONTINENTS: { id: string; name: Localized; boxes: [number, number, number, number][] }[] = [
  { id: "oc", name: { es: "Oceanía", en: "Oceania" }, boxes: [[-50, -10, 110, 180], [-11, 0, 141, 180]] },
  { id: "sa", name: { es: "América del Sur", en: "South America" }, boxes: [[-56, 12.5, -82, -34]] },
  { id: "na", name: { es: "América del Norte y Central", en: "North and Central America" }, boxes: [[7, 84, -170, -50]] },
  { id: "af", name: { es: "África", en: "Africa" }, boxes: [[-35, 37.5, -18, 34.5], [-35, 12, 34.5, 52], [12, 22, 34.5, 38.5]] },
  { id: "eu", name: { es: "Europa", en: "Europe" }, boxes: [[42, 72, -25, 50], [50, 72, 50, 60], [36, 42, -25, 26]] },
  { id: "as", name: { es: "Asia", en: "Asia" }, boxes: [[-11, 82, 25, 180]] },
];

export const FIRE = { stars: 3, starsRetry: 1 };

export const FIRE_TXT = {
  title: { es: "🔥 Mapa de incendios", en: "🔥 Fire map" },
  ray: {
    es: "Cada punto es un incendio que un satélite de la NASA vio desde el espacio. Su cámara especial «siente» el calor, como cuando acercas la mano a una fogata. De miles de incendios elegí {n} de los más seguros (confianza alta).",
    en: "Each dot is a fire that a NASA satellite saw from space. Its special camera “feels” heat, like when you hold your hand near a campfire. Out of thousands of fires I picked {n} of the surest ones (high confidence).",
  },
  question: {
    es: "Mira el mapa: ¿en qué continente hubo más incendios en estas 24 horas?",
    en: "Look at the map: which continent had the most fires in these 24 hours?",
  },
  right: { es: "✅ ¡Exacto! {c} tuvo más incendios: {k} de {n} puntos.", en: "✅ Exactly! {c} had the most fires: {k} of {n} dots." },
  wrong: {
    es: "❌ No esta vez. Ganó {c} con {k} de {n} puntos. Mira los números de cada continente.",
    en: "❌ Not this time. {c} won with {k} of {n} dots. Look at each continent’s numbers.",
  },
  win: { es: "+{s} ⭐ ¡Ya sabes leer un mapa de satélite!", en: "+{s} ⭐ Now you can read a satellite map!" },
  why: {
    es: "Ray: muchos incendios son quemas de pastos o de cultivos que hace la gente; otros son incendios forestales. Por eso los científicos vigilan el planeta todos los días.",
    en: "Ray: many fires are grass or crop burns set by people; others are wildfires. That’s why scientists watch the planet every day.",
  },
  count: { es: "{k} incendios", en: "{k} fires" },
  mapLabel: {
    es: "Mapa del mundo con {n} incendios detectados por satélite.",
    en: "World map with {n} fires detected by satellite.",
  },
  dot: { es: "Incendio: {lat}°, {lon}° · {b} K · {d}", en: "Fire: {lat}°, {lon}° · {b} K · {d}" },
  caption: {
    es: "NASA — FIRMS, incendios activos MODIS de 24 h ({date})",
    en: "NASA — FIRMS, MODIS active fires, 24 h ({date})",
  },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Phase 5 · Laboratorio · MissionPatch (Greg) — draw your own mission patch
// ---------------------------------------------------------------------------

/** Canvas size (px), thumbnail size saved in the inventory, stars for the first saved patch. */
export const PATCH = { size: 320, thumb: 128, stars: 2, bg: "#0b1d4d", sizes: [4, 10, 20] };

/** Brush colours (name used for the button's aria-label). */
export const PATCH_COLORS: { c: string; name: Localized }[] = [
  { c: "#ffffff", name: { es: "Blanco", en: "White" } },
  { c: "#ffd54a", name: { es: "Amarillo", en: "Yellow" } },
  { c: "#ff9800", name: { es: "Naranja", en: "Orange" } },
  { c: "#e53935", name: { es: "Rojo", en: "Red" } },
  { c: "#ab47bc", name: { es: "Morado", en: "Purple" } },
  { c: "#22b8cf", name: { es: "Celeste", en: "Sky blue" } },
  { c: "#2ecc71", name: { es: "Verde", en: "Green" } },
  { c: "#8a8a96", name: { es: "Gris lunar", en: "Moon grey" } },
];

export const PATCH_TXT = {
  title: { es: "🎨 Parche de misión", en: "🎨 Mission patch" },
  greg: {
    es: "Estoy en 5.º de secundaria y sueño con trabajar en la NASA. En matemáticas no me va tan bien… ¡pero dibujar es lo mío! Cada misión espacial tiene su propio parche, cosido en el traje. Diseñemos el de nuestra misión a Selene.",
    en: "I’m in my final year of secondary school and I dream of working at NASA. Maths isn’t my best subject… but drawing is my thing! Every space mission has its own patch, sewn onto the suit. Let’s design one for our mission to Selene.",
  },
  canvas: { es: "Lienzo de dibujo del parche de misión", en: "Mission patch drawing canvas" },
  brush: { es: "🖌️ Pincel", en: "🖌️ Brush" },
  eraser: { es: "🧽 Borrador", en: "🧽 Eraser" },
  size: { es: "Grosor", en: "Size" },
  sizeN: { es: "Grosor {k}", en: "Size {k}" },
  colors: { es: "Colores", en: "Colours" },
  template: { es: "⭕ Plantilla circular", en: "⭕ Circle template" },
  clear: { es: "🗑️ Borrar todo", en: "🗑️ Clear all" },
  save: { es: "💾 Guardar", en: "💾 Save" },
  tip: {
    es: "Con la plantilla activa, tu parche se guarda redondo y con borde, como los de verdad.",
    en: "With the template on, your patch is saved round and with a border, just like real ones.",
  },
  saved: { es: "✅ ¡Parche guardado! Lo verás en tu Inventario. ⭐ +{s}", en: "✅ Patch saved! You’ll see it in your Inventory. ⭐ +{s}" },
  savedReplay: { es: "✅ ¡Parche guardado! Lo verás en tu Inventario.", en: "✅ Patch saved! You’ll see it in your Inventory." },
  file: { es: "mi-parche-de-mision", en: "my-mission-patch" },
} satisfies Record<string, Localized>;

// ---------------------------------------------------------------------------
// Phase 5 · Cancha · LunarPingPong (Joseph) — pong with Earth / Moon gravity
// ---------------------------------------------------------------------------

/** Canvas units are px; gravity in px/s² = g (m/s²) × scale. First to `target` points wins.
 *  Joseph aims up to ±aiError × paddle height off the ball on each return, so he can miss.
 *  Stars: 3 if you won at least one point with Earth gravity, else 2. */
export const PONG = {
  w: 360, h: 240, scale: 30, gEarth: 9.81, gMoon: 1.62,
  paddleH: 52, paddleW: 8, ball: 6, serveVx: 170, maxVx: 360, maxVy: 420,
  playerSpeed: 280, aiSpeed: 135, aiError: 0.75, target: 3, starsEarth: 3, stars: 2,
};

export const PONG_TXT = {
  title: { es: "🏓 Ping pong lunar", en: "🏓 Lunar ping pong" },
  joseph: {
    es: "¡La cancha es mi territorio! Juego fútbol y ping pong desde niño. Aquí la pelota cae por la gravedad: con el botón la cambias entre la Tierra y la Luna. ¡A ver si me ganas!",
    en: "The court is my turf! I’ve played football and ping pong since I was little. Here the ball falls because of gravity: the button switches it between Earth and the Moon. Let’s see if you can beat me!",
  },
  desc: {
    es: "Mueve tu paleta (izquierda) arrastrando en la mesa, o con ↑ ↓ / W S. Primero en llegar a {k} puntos gana. Tecla G: cambiar gravedad.",
    en: "Move your paddle (left) by dragging on the table, or with ↑ ↓ / W S. First to {k} points wins. G key: switch gravity.",
  },
  canvas: { es: "Mesa de ping pong: tu paleta a la izquierda, la de Joseph a la derecha", en: "Ping pong table: your paddle on the left, Joseph’s on the right" },
  earth: { es: "🌍 Gravedad: Tierra (9,81 m/s²)", en: "🌍 Gravity: Earth (9.81 m/s²)" },
  moon: { es: "🌙 Gravedad: Luna (1,62 m/s²)", en: "🌙 Gravity: Moon (1.62 m/s²)" },
  start: { es: "▶ Sacar", en: "▶ Serve" },
  again: { es: "🔁 Otra partida", en: "🔁 Another match" },
  score: { es: "Tú {a} – {b} Joseph", en: "You {a} – {b} Joseph" },
  tip3: {
    es: "Para 3 ⭐: gana al menos un punto con la gravedad de la Tierra.",
    en: "For 3 ⭐: win at least one point with Earth’s gravity.",
  },
  point: { es: "¡Punto para ti!", en: "Point for you!" },
  pointAi: { es: "Punto para Joseph.", en: "Point for Joseph." },
  win: { es: "🏆 ¡Le ganaste a Joseph! ⭐ +{s}", en: "🏆 You beat Joseph! ⭐ +{s}" },
  winReplay: { es: "🏆 ¡Le ganaste a Joseph otra vez!", en: "🏆 You beat Joseph again!" },
  lose: { es: "Joseph ganó esta vez. ¡Prueba con la gravedad de la Luna: la pelota cae más lento!", en: "Joseph won this time. Try Moon gravity: the ball falls more slowly!" },
  josephWin: {
    es: "¡Buena partida! ¿Notaste? En la Luna la pelota flota más: tienes más tiempo para llegar.",
    en: "Good game! Did you notice? On the Moon the ball floats more: you have more time to reach it.",
  },
} satisfies Record<string, Localized>;
