import type { Localized } from "./types";

// UI dictionary used through t("key"). ES strings are the prototype's originals;
// EN strings come from the prototype's TR table where it had them.
// `{n}` is always replaced with the current hero's name; other {vars} are passed to t().
export const UI = {
  "app.title": { es: "Greg y la Colonia Última", en: "Greg and the Last Colony" },
  "app.description": {
    es: "Juego educativo sobre la Luna — NASA Space Apps Challenge 2026 Cajamarca",
    en: "Educational game about the Moon — NASA Space Apps Challenge 2026 Cajamarca",
  },
  "app.ogImageAlt": {
    es: "Arte principal de Greg y la Colonia Última (imagen generada con IA)",
    en: "Greg and the Last Colony key art (AI-generated image)",
  },

  // Language picker
  "lang.choose": { es: "Elige tu idioma", en: "Choose your language" },
  "lang.es": { es: "Español", en: "Español" },
  "lang.en": { es: "English", en: "English" },
  "lang.toggle": { es: "Cambiar idioma", en: "Change language" },

  // Config bar
  "cfg.music": { es: "Música", en: "Music" },
  "cfg.sound": { es: "Sonido", en: "Sound" },
  "cfg.theme": { es: "Tema", en: "Theme" },
  "cfg.settings": { es: "Ajustes", en: "Settings" },

  // Title screen
  "title.artLabel": {
    es: "Greg y la Colonia Última: Greg, Elen, Orbi y Joseph frente a la Reina del Vacío",
    en: "Greg and the Last Colony: Greg, Elen, Orbi and Joseph facing the Queen of the Void",
  },
  "title.start": { es: "▶ EMPEZAR", en: "▶ START" },
  "title.skip": { es: "⏭ Saltar", en: "⏭ Skip" },
  "title.choose": { es: "Elige tu personaje:", en: "Choose your character:" },
  "title.play": { es: "¡Jugar!", en: "Play!" },
  "title.tryAr": { es: "📷 Probar realidad aumentada", en: "📷 Try augmented reality" },
  "title.stat": { es: "{stat}: {v} de 5", en: "{stat}: {v} of 5" },

  // Map / hub
  "hub.help": {
    es: "Toca el mapa o usa las flechas o WASD para mover a tu personaje. Entra a las zonas con círculo celeste.",
    en: "Tap the map or use the arrow keys or WASD to move your character. Enter the zones marked with a cyan circle.",
  },
  "hub.enter": { es: "Entrar: {zone}", en: "Enter: {zone}" },
  // Keyboard hint after the "Enter" prompt; hidden on touch devices (map.module.css .kh).
  "hub.enterKey": { es: "[E]", en: "[E]" },
  "hub.ar": { es: "📷 RA", en: "📷 AR" },
  "hub.hint": { es: "💡 Orbi", en: "💡 Orbi" },
  "hud.level": { es: "Nivel {lv}", en: "Level {lv}" },
  "nav.map": { es: "Mapa", en: "Map" },
  "nav.inventory": { es: "Inventario", en: "Inventory" },
  "nav.missions": { es: "Misiones", en: "Missions" },
  "nav.achievements": { es: "Logros", en: "Achievements" },
  "nav.main": { es: "Misión principal", en: "Main mission" },
  // Panels painted in map.jpg, re-drawn in HTML over the art (components/map/NavBar.tsx).
  "map.missionsSub": { es: "Completa desafíos y avanza en la historia", en: "Complete challenges and move the story forward" },
  "map.mainTitle": { es: "Misión Principal:", en: "Main Mission:" },
  "map.mainSub": { es: "Descubre el origen de NOX-Ω", en: "Discover the origin of NOX-Ω" },
  "map.go": { es: "¡Vamos!", en: "Let’s go!" },

  // Speech bubble
  "bubble.continue": { es: "Toca para continuar ▶", en: "Tap to continue ▶" },

  // Phone controls bar under the map (components/map/PhoneBar.tsx), screens ≤ 820px / phone landscape
  "pad.info": { es: "Info", en: "Info" },
  "pad.infoToggle": { es: "Mostrar u ocultar la ayuda", en: "Show or hide the help" },
  "pad.help": {
    es: "Muévete con la cruceta o tocando el mapa. Acércate a un círculo celeste y pulsa Entrar.",
    en: "Move with the D-pad or by tapping the map. Walk up to a cyan circle and press Enter.",
  },
  "pad.next": { es: "Siguiente:", en: "Next:" },
  "pad.controls": { es: "Controles", en: "Controls" },
  "pad.up": { es: "Arriba", en: "Up" },
  "pad.down": { es: "Abajo", en: "Down" },
  "pad.left": { es: "Izquierda", en: "Left" },
  "pad.right": { es: "Derecha", en: "Right" },
  "pad.enter": { es: "Entrar", en: "Enter" },
  "pad.continue": { es: "Seguir", en: "Next" },
  "pad.chat": { es: "Chat", en: "Chat" },
  "pad.chatIdle": { es: "Aquí aparecerán los mensajes de Orbi, Ray y tus amigos.", en: "Messages from Orbi, Ray and your friends will show up here." },
  "pad.askOrbi": { es: "💡 Pedir pista a Orbi", en: "💡 Ask Orbi for a hint" },

  // Full screen + rotate hint (phones)
  "fs.enter": { es: "Pantalla completa", en: "Full screen" },
  "fs.exit": { es: "Salir de pantalla completa", en: "Exit full screen" },
  "fs.ios": {
    es: "Tu navegador no permite pantalla completa aquí. En iPhone: toca Compartir → «Añadir a pantalla de inicio» y abre el juego desde allí.",
    en: "Your browser doesn’t allow full screen here. On iPhone: tap Share → “Add to Home Screen” and open the game from there.",
  },
  "rotate.hint": { es: "🔄 Gira el teléfono para ver el mapa más grande.", en: "🔄 Turn your phone sideways for a bigger map." },
  "rotate.dismiss": { es: "Cerrar aviso", en: "Dismiss tip" },

  // Common
  "common.close": { es: "Cerrar", en: "Close" },
  "common.continue": { es: "Seguir", en: "Continue" },
  "common.loading": { es: "Cargando…", en: "Loading…" },

  // Zone menu
  "zone.choose": { es: "Elige una actividad:", en: "Choose an activity:" },

  // Panels
  "missions.title": { es: "⭐ Misiones", en: "⭐ Missions" },
  "missions.progress": {
    es: "{d}/{total} completadas. Toca una para ir a su zona.",
    en: "{d}/{total} completed. Tap one to go to its zone.",
  },
  "inv.title": { es: "🎒 Datos desbloqueados", en: "🎒 Unlocked facts" },
  "inv.patch": { es: "🎨 Tu parche de misión", en: "🎨 Your mission patch" },
  "inv.patchAlt": { es: "Parche de misión dibujado por ti", en: "Mission patch drawn by you" },
  "inv.patchNone": {
    es: "Aún no tienes parche. Diséñalo con Greg en el Laboratorio Digital.",
    en: "No patch yet. Design it with Greg in the Digital Lab.",
  },
  "quiz.hint": { es: "💡 Pista de Orbi", en: "💡 Orbi’s hint" },
  "ach.title": { es: "🏆 Logros", en: "🏆 Achievements" },
  "main.title": { es: "🛰️ Misión principal: el origen de NOX-Ω", en: "🛰️ Main mission: the origin of NOX-Ω" },
  "main.progress": { es: "{d}/5 núcleos de energía recuperados", en: "{d}/5 energy cores recovered" },
  "main.fight": { es: "⚔️ ¡Enfrentar a la Reina del Vacío!", en: "⚔️ Face the Queen of the Void!" },
  "main.locked": {
    es: "Completa las cinco zonas para descifrar NOX-Ω.",
    en: "Complete all five zones to decode NOX-Ω.",
  },

  // Settings
  "settings.title": { es: "⚙️ Ajustes", en: "⚙️ Settings" },
  "settings.language": { es: "Idioma", en: "Language" },
  "settings.theme": { es: "Tema", en: "Theme" },
  "theme.auto": { es: "Automático", en: "Automatic" },
  "theme.light": { es: "Claro", en: "Light" },
  "theme.dark": { es: "Oscuro", en: "Dark" },
  "settings.music": { es: "🎵 Música", en: "🎵 Music" },
  "settings.sfx": { es: "🔊 Efectos de sonido", en: "🔊 Sound effects" },
  "settings.on": { es: "Activado", en: "On" },
  "settings.off": { es: "Desactivado", en: "Off" },
  "settings.reset": { es: "🗑️ Reiniciar progreso", en: "🗑️ Reset progress" },
  "settings.resetConfirm": {
    es: "¿Seguro? Se borrarán tus estrellas, cristales y zonas completadas.",
    en: "Are you sure? Your stars, crystals and completed zones will be erased.",
  },
  "settings.resetYes": { es: "Sí, reiniciar", en: "Yes, reset" },
  "settings.cancel": { es: "Cancelar", en: "Cancel" },
  "settings.resetDone": { es: "✅ Progreso reiniciado.", en: "✅ Progress reset." },
  "credits.link": { es: "📜 Créditos y fuentes", en: "📜 Credits and sources" },

  // AI-image watermark (Space Apps rule)
  "ai.watermark": { es: "Imagen generada con IA", en: "AI-generated image" },
  "ai.mark": { es: "IA", en: "AI" },

  "settings.home": { es: "🏠 Volver a la portada", en: "🏠 Back to the title screen" },
} satisfies Record<string, Localized>;
