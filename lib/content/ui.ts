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
    es: "Greg y la Colonia Última: Greg, Elen, Orbi y Joseph frente a la Reina Hueca",
    en: "Greg and the Last Colony: Greg, Elen, Orbi and Joseph facing the Hollow Queen",
  },
  "title.start": { es: "▶ EMPEZAR", en: "▶ START" },
  "title.skip": { es: "⏭ Saltar", en: "⏭ Skip" },
  "title.choose": { es: "Elige tu personaje:", en: "Choose your character:" },
  "title.play": { es: "¡Jugar!", en: "Play!" },
  "title.tryAr": { es: "📷 Probar realidad aumentada", en: "📷 Try augmented reality" },

  // Map / hub
  "hub.help": {
    es: "Toca el mapa o usa las flechas o WASD para mover a tu personaje. Entra a las zonas con círculo celeste.",
    en: "Tap the map or use the arrow keys or WASD to move your character. Enter the zones marked with a cyan circle.",
  },
  "hub.enter": { es: "Entrar: {zone} [E]", en: "Enter: {zone} [E]" },
  "hub.ar": { es: "📷 RA", en: "📷 AR" },
  "hub.hint": { es: "💡 Orbi", en: "💡 Orbi" },
  "hud.level": { es: "Nivel {lv}", en: "Level {lv}" },
  "nav.map": { es: "Mapa", en: "Map" },
  "nav.inventory": { es: "Inventario", en: "Inventory" },
  "nav.missions": { es: "Misiones", en: "Missions" },
  "nav.achievements": { es: "Logros", en: "Achievements" },
  "nav.main": { es: "Misión principal", en: "Main mission" },

  // Speech bubble
  "bubble.continue": { es: "Toca para continuar ▶", en: "Tap to continue ▶" },

  // Common
  "common.close": { es: "Cerrar", en: "Close" },
  "common.continue": { es: "Seguir", en: "Continue" },

  // Zone menu + placeholder activity (mini-games arrive in Phase 2)
  "zone.choose": { es: "Elige una actividad:", en: "Choose an activity:" },
  "activity.wip": {
    es: "🚧 Esta actividad está en construcción. ¡Muy pronto podrás jugarla!",
    en: "🚧 This activity is under construction. You will be able to play it very soon!",
  },

  // Panels
  "missions.title": { es: "⭐ Misiones", en: "⭐ Missions" },
  "missions.progress": {
    es: "{d}/10 completadas. Toca una para ir a su zona.",
    en: "{d}/10 completed. Tap one to go to its zone.",
  },
  "inv.title": { es: "🎒 Datos desbloqueados", en: "🎒 Unlocked facts" },
  "ach.title": { es: "🏆 Logros", en: "🏆 Achievements" },
  "main.title": { es: "🛰️ Misión principal: el origen de NOX-Ω", en: "🛰️ Main mission: the origin of NOX-Ω" },
  "main.progress": { es: "{d}/5 pistas reunidas", en: "{d}/5 clues gathered" },
  "main.fight": { es: "⚔️ ¡Enfrentar a la Reina Hueca!", en: "⚔️ Face the Hollow Queen!" },
  "main.locked": {
    es: "Completa las cinco zonas para descifrar NOX-Ω.",
    en: "Complete all five zones to decode NOX-Ω.",
  },
  "ar.title": { es: "📷 Realidad aumentada de bajo costo", en: "📷 Low-cost augmented reality" },
  "boss.title": { es: "👑 Reina Hueca", en: "👑 Hollow Queen" },

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
  "settings.home": { es: "🏠 Volver a la portada", en: "🏠 Back to the title screen" },
} satisfies Record<string, Localized>;
