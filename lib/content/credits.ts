import type { Localized } from "./types";

// Credits page content (app/credits/page.tsx): team, NASA resources, AI (SI) disclosure,
// open-source libraries. Every player-visible text is an {es, en} pair.

// ---------------------------------------------------------------------------
// Team — proper names are shown exactly as written (same in both languages).
// ---------------------------------------------------------------------------

/** Team members' names. */
export const TEAM: string[] = [
  "Valeria Alexandra Villacorta Landeo",
  "Pranshu Chaurasia",
  "Elida Nuñez Vásquez",
  "Miguel Angel Vilca Mamani",
];

/** AI tool used to generate the three images (map.jpg, keyart.jpg, cast.jpg). */
export const AI_IMAGE_TOOL: Localized = {
  es: "Herramienta de generación de imágenes con IA (texto a imagen)",
  en: "AI text-to-image generation tool",
};

// ---------------------------------------------------------------------------

export type Source = { name: Localized; url: string; use: Localized };

/** NASA resources used by the game's content (all links checked 2026-11-15). */
export const NASA_RESOURCES: Source[] = [
  {
    name: { es: "NASA Science — La Luna: datos", en: "NASA Science — Moon facts" },
    url: "https://science.nasa.gov/moon/facts/",
    use: {
      es: "Gravedad lunar (1,62 m/s²), atmósfera, temperaturas y demás datos de los quizzes, lecciones y mini-juegos.",
      en: "Lunar gravity (1.62 m/s²), atmosphere, temperatures and other facts in the quizzes, lessons and mini-games.",
    },
  },
  {
    name: { es: "NASA Science — La Luna", en: "NASA Science — Earth’s Moon" },
    url: "https://science.nasa.gov/moon/",
    use: {
      es: "Información general sobre la Luna y su exploración.",
      en: "General information about the Moon and its exploration.",
    },
  },
  {
    name: { es: "NASA — Misión Apolo 11", en: "NASA — Apollo 11 mission" },
    url: "https://www.nasa.gov/mission/apollo-11/",
    use: {
      es: "Datos de Apolo 11 (1969) usados en la línea de tiempo del Auditorio y en las preguntas.",
      en: "Apollo 11 (1969) facts used in the Auditorium timeline and in the questions.",
    },
  },
];

/** NASA Earth data — added in Phase 4 ("La Señal de Ray"). Empty until then. */
export const NASA_DATA: Source[] = [];

/** The three AI-generated images, shown as thumbnails on the credits page. */
export const AI_IMAGES: { file: string; cssVar: string; ratio: string; name: Localized }[] = [
  { file: "img/map.jpg", cssVar: "--map", ratio: "1172/657", name: { es: "Mapa del colegio", en: "School map" } },
  { file: "img/keyart.jpg", cssVar: "--key", ratio: "1170/651", name: { es: "Portada", en: "Key art" } },
  { file: "img/cast.jpg", cssVar: "--cast", ratio: "1476/777", name: { es: "Personajes", en: "Characters" } },
];

export type Library = { name: string; license: string; url: string; use: Localized };

/** Open-source software used to build the game (versions from package.json / pip). */
export const LIBRARIES: Library[] = [
  { name: "Next.js", license: "MIT", url: "https://github.com/vercel/next.js", use: { es: "Framework web y exportación estática", en: "Web framework and static export" } },
  { name: "React / React DOM", license: "MIT", url: "https://github.com/facebook/react", use: { es: "Interfaz de usuario", en: "User interface" } },
  { name: "Zustand", license: "MIT", url: "https://github.com/pmndrs/zustand", use: { es: "Estado del juego y guardado local", en: "Game state and local saving" } },
  { name: "Chart.js", license: "MIT", url: "https://github.com/chartjs/Chart.js", use: { es: "Gráficos de datos", en: "Data charts" } },
  { name: "react-chartjs-2", license: "MIT", url: "https://github.com/reactchartjs/react-chartjs-2", use: { es: "Chart.js en React", en: "Chart.js for React" } },
  { name: "Tailwind CSS", license: "MIT", url: "https://github.com/tailwindlabs/tailwindcss", use: { es: "Estilos", en: "Styling" } },
  { name: "TypeScript", license: "Apache-2.0", url: "https://github.com/microsoft/TypeScript", use: { es: "Lenguaje de programación", en: "Programming language" } },
  { name: "ESLint", license: "MIT", url: "https://github.com/eslint/eslint", use: { es: "Revisión de código", en: "Code linting" } },
  { name: "Pillow", license: "MIT-CMU", url: "https://github.com/python-pillow/Pillow", use: { es: "Marca de agua en las imágenes (script)", en: "Image watermarking (script)" } },
];

/** Texts of the credits page. */
export const CREDITS = {
  title: { es: "📜 Créditos", en: "📜 Credits" },
  back: { es: "← Volver a la portada", en: "← Back to the title screen" },
  event: {
    es: "Proyecto para el NASA Space Apps Challenge 2026 — sede Cajamarca (Perú).",
    en: "Project for the NASA Space Apps Challenge 2026 — Cajamarca (Peru) local event.",
  },
  teamTitle: { es: "👥 Equipo", en: "👥 Team" },

  nasaTitle: { es: "🌕 Recursos de la NASA usados", en: "🌕 NASA resources used" },
  nasaIntro: {
    es: "Los datos científicos del juego provienen de estas páginas públicas de la NASA:",
    en: "The game’s science facts come from these public NASA pages:",
  },
  dataTitle: { es: "🛰️ Datos de la Tierra (NASA)", en: "🛰️ Earth data (NASA)" },
  dataSoon: {
    es: "Próximamente: la zona «La Señal de Ray» usará datos reales de NASA GISTEMP v4 (temperatura global) y NASA FIRMS (incendios activos). Sus fuentes y fechas aparecerán aquí.",
    en: "Coming soon: the “Ray’s Signal” zone will use real data from NASA GISTEMP v4 (global temperature) and NASA FIRMS (active fires). Their sources and dates will be listed here.",
  },
  noLogo: {
    es: "Este juego no usa logotipos, insignias ni marcas de la NASA, y no está respaldado por la NASA.",
    en: "This game does not use NASA logos, insignia or branding, and it is not endorsed by NASA.",
  },

  aiTitle: { es: "🤖 Uso de inteligencia artificial (IA)", en: "🤖 Use of artificial intelligence (AI)" },
  aiImages: {
    es: "Imágenes: el mapa del colegio, la portada y la lámina de personajes fueron generados con IA ({tool}). Llevan la marca «Imagen generada con IA» dentro del propio archivo y también encima de la imagen en el juego. Los retratos y personajes del mapa son recortes de esas mismas imágenes.",
    en: "Images: the school map, the key art and the character sheet were generated with AI ({tool}). They carry the label “AI-generated image” inside the file itself and also on top of the image in the game. The portraits and map characters are crops of those same images.",
  },
  aiCode: {
    es: "Código: escrito con Claude Code (Anthropic), con la dirección del equipo.",
    en: "Code: written with Claude Code (Anthropic), under the team’s direction.",
  },
  aiAudio: {
    es: "Sonido y música: generados en el navegador con Web Audio (sin archivos de audio).",
    en: "Sound and music: synthesised in the browser with Web Audio (no audio files).",
  },
  aiGallery: { es: "Imágenes generadas con IA:", en: "AI-generated images:" },

  libsTitle: { es: "🧩 Software de código abierto", en: "🧩 Open-source software" },
  libsIntro: {
    es: "Gracias a estos proyectos (licencia entre paréntesis):",
    en: "Thanks to these projects (licence in brackets):",
  },
} satisfies Record<string, Localized>;
