import type { Localized } from "./types";

// "Dato NASA / NASA Fact" cards (components/ui/NasaFact.tsx): one real fact per mini-game, written
// in our own kid-friendly words. Every fact was checked against the linked official NASA page
// (all links returned HTTP 200 on 2026-11-15). `title` is the page's own title, shown as-is in the
// "Fuente: NASA — <title>" line. The same list feeds the credits page (grouped by game).

export type NasaFact = {
  /** emoji shown on the card */
  icon: string;
  /** the mini-game, as named on the credits page */
  game: Localized;
  text: Localized;
  /** title of the NASA page (as published by NASA) */
  title: string;
  url: string;
};

export type NasaFactId =
  | "quiz" | "lessons" | "lander" | "radiation" | "thermal" | "jump" | "body"
  | "oxygen" | "timeline" | "patch" | "pong" | "ar" | "boss";

export const NASA_FACTS: Record<NasaFactId, NasaFact> = {
  quiz: {
    icon: "🌕",
    game: { es: "Quiz lunar", en: "Lunar quiz" },
    text: {
      es: "La Luna se aleja de la Tierra muy despacito: cada año está unos 2,5 cm (una pulgada) más lejos.",
      en: "The Moon is slowly drifting away from Earth: every year it gets about 2.5 cm (one inch) farther away.",
    },
    title: "Moon Facts",
    url: "https://science.nasa.gov/moon/facts/",
  },
  lessons: {
    icon: "🌊",
    game: { es: "Curso: la Luna desde cero", en: "Course: the Moon from zero" },
    text: {
      es: "Los científicos creen que la Luna nació de un choque gigantesco hace muchísimo tiempo, y hoy su gravedad ayuda a formar las mareas de los océanos de la Tierra.",
      en: "Scientists think the Moon was born in a gigantic collision long ago, and today its gravity helps create Earth’s ocean tides.",
    },
    title: "Earth’s Moon",
    url: "https://science.nasa.gov/moon/",
  },
  lander: {
    icon: "🦅",
    game: { es: "Aterrizaje lunar", en: "Lunar landing" },
    text: {
      es: "El 20 de julio de 1969 el módulo lunar «Eagle» del Apolo 11 se posó en la Luna, y por radio se escuchó: «Houston, aquí Base Tranquilidad. El Águila ha alunizado».",
      en: "On 20 July 1969 the Apollo 11 lunar module “Eagle” touched down on the Moon, and the radio said: “Houston, Tranquility Base here. The Eagle has landed.”",
    },
    title: "Apollo 11",
    url: "https://www.nasa.gov/mission/apollo-11/",
  },
  radiation: {
    icon: "☢️",
    game: { es: "Tormenta solar", en: "Solar storm" },
    text: {
      es: "En la Tierra, la atmósfera y el campo magnético nos protegen de la radiación. En las naves, la NASA evita escudos pesados de plomo: la radiación choca contra ellos y produce aún más radiación.",
      en: "On Earth, the atmosphere and magnetic field shield us from radiation. For spacecraft, NASA avoids heavy lead shields: radiation smashes into them and creates even more radiation.",
    },
    title: "Positive, Negative or Neutral, It All Matters: NASA Explains Space Radiation",
    url: "https://www.nasa.gov/humans-in-space/positive-negative-or-neutral-it-all-matters-nasa-explains-space-radiation/",
  },
  thermal: {
    icon: "🌡️",
    game: { es: "Control térmico", en: "Thermal control" },
    text: {
      es: "Bajo el Sol, el suelo de la Luna llega a unos 127 °C, pero en la oscuridad baja hasta unos −173 °C. ¡Un refugio lunar debe aguantar los dos extremos!",
      en: "In full sunlight the Moon’s surface reaches about 127 °C, but in darkness it drops to about −173 °C. A Moon shelter must handle both extremes!",
    },
    title: "Moon Facts",
    url: "https://science.nasa.gov/moon/facts/",
  },
  jump: {
    icon: "🦘",
    game: { es: "Salto lunar", en: "Lunar jump" },
    text: {
      es: "La Luna tiene menos masa que la Tierra, así que su gravedad es más débil: allí podrías saltar unas seis veces más alto… ¡pero igual volverías a bajar!",
      en: "The Moon has less mass than Earth, so its gravity is weaker: there you could jump about six times as high… but you would still come back down!",
    },
    title: "Top Moon Questions",
    url: "https://science.nasa.gov/moon/top-moon-questions/",
  },
  body: {
    icon: "🏋️",
    game: { es: "Entrenamiento de astronauta", en: "Astronaut training" },
    text: {
      es: "En la Estación Espacial Internacional, los astronautas hacen ejercicio unas dos horas al día, en promedio, para que sus músculos y huesos no se debiliten sin gravedad.",
      en: "On the International Space Station, astronauts exercise for about two hours a day on average, so their muscles and bones don’t weaken without gravity.",
    },
    title: "Counteracting Bone and Muscle Loss in Microgravity",
    url: "https://www.nasa.gov/missions/station/iss-research/counteracting-bone-and-muscle-loss-in-microgravity/",
  },
  oxygen: {
    icon: "💧",
    game: { es: "Invernadero lunar", en: "Lunar greenhouse" },
    text: {
      es: "La Estación Espacial fabrica oxígeno con agua: una máquina usa electricidad para separar el agua en oxígeno, que va a la cabina para respirar, e hidrógeno.",
      en: "The Space Station makes oxygen from water: a machine uses electricity to split water into oxygen, which goes into the cabin for breathing, and hydrogen.",
    },
    title: "Advanced Oxygen Generation",
    url: "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/advanced-oxygen-generation/",
  },
  timeline: {
    icon: "🛰️",
    game: { es: "Línea del tiempo", en: "Timeline" },
    text: {
      es: "Artemis II despegó el 1 de abril de 2026 con cuatro astronautas que viajaron alrededor de la Luna en la nave Orion: ¡el primer vuelo tripulado a la Luna en más de 50 años!",
      en: "Artemis II launched on 1 April 2026 with four astronauts who flew around the Moon in the Orion spacecraft: the first crewed Moon flight in over 50 years!",
    },
    title: "Artemis II: NASA’s First Crewed Lunar Flyby in 50 Years",
    url: "https://www.nasa.gov/mission/artemis-ii/",
  },
  patch: {
    icon: "🎨",
    game: { es: "Parche de misión", en: "Mission patch" },
    text: {
      es: "El parche del Apolo 11 muestra un águila a punto de posarse en la Luna con una rama de olivo en sus garras: un mensaje de que la tripulación llegaba en paz.",
      en: "The Apollo 11 patch shows an eagle about to land on the Moon holding an olive branch in its talons: a sign that the crew came in peace.",
    },
    title: "Apollo Mission Patches",
    url: "https://science.nasa.gov/resource/apollo-mission-patches/",
  },
  pong: {
    icon: "⛳",
    game: { es: "Ping pong lunar", en: "Lunar ping pong" },
    text: {
      es: "En 1971, en la misión Apolo 14, el astronauta Alan Shepard golpeó pelotas de golf en la Luna: una voló unos 22 metros y otra unos 37 metros.",
      en: "In 1971, on the Apollo 14 mission, astronaut Alan Shepard hit golf balls on the Moon: one flew about 24 yards (22 m) and another about 40 yards (37 m).",
    },
    title: "50 Years Ago: Apollo 14 Lands at Fra Mauro",
    url: "https://www.nasa.gov/history/50-years-ago-apollo-14-lands-at-fra-mauro/",
  },
  ar: {
    icon: "🧑‍🚀",
    game: { es: "Realidad aumentada", en: "Augmented reality" },
    text: {
      es: "La mochila del traje espacial guarda el oxígeno para respirar y quita el dióxido de carbono; por dentro, agua que corre por tubitos mantiene fresco al astronauta.",
      en: "A spacesuit’s backpack holds oxygen for breathing and removes carbon dioxide; inside, water flowing through tubes keeps the astronaut cool.",
    },
    title: "What Is a Spacesuit? (Grades K-4)",
    url: "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-a-spacesuit-grades-k-4/",
  },
  boss: {
    icon: "🌙",
    game: { es: "Batalla final: la Reina del Vacío", en: "Final battle: the Queen of the Void" },
    text: {
      es: "El programa Artemis lleva el nombre de la hermana gemela de Apolo. Con él, la NASA estudia la Luna y aprende cómo los astronautas podrían vivir y trabajar algún día en Marte.",
      en: "The Artemis program is named after Apollo’s twin sister. With it, NASA studies the Moon and learns how astronauts could one day live and work on Mars.",
    },
    title: "What Is the Artemis Program? (Grades K-4)",
    url: "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-the-artemis-program-grades-k-4/",
  },
};

/** Texts of the card and its header button. */
export const NASA_FACT_TXT = {
  button: { es: "🚀 Dato NASA", en: "🚀 NASA Fact" },
  hide: { es: "🚀 Ocultar dato", en: "🚀 Hide fact" },
  title: { es: "Dato NASA", en: "NASA Fact" },
  presenter: { es: "Orbi te cuenta:", en: "Orbi says:" },
  source: { es: "Fuente:", en: "Source:" },
  link: { es: "NASA — {title}", en: "NASA — {title}" },
  newTab: { es: "(se abre en una pestaña nueva)", en: "(opens in a new tab)" },
} satisfies Record<string, Localized>;
