"use client";

import { detectLang, translate, type Lang } from "@/lib/i18n";
import { useGame } from "@/lib/store";

/** First-launch language choice. Shown until a language is saved; the browser language is pre-selected. */
export default function LanguagePicker() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  if (lang) return null;
  const def = detectLang();
  const other: Lang = def === "es" ? "en" : "es";
  const order: Lang[] = ["es", "en"];
  return (
    <div id="lgp" role="dialog" aria-modal="true" aria-labelledby="lgp-t">
      <div className="card">
        <h3 id="lgp-t" lang={def}>🌐 {translate(def, "lang.choose")}</h3>
        <p className="s" lang={other}>{translate(other, "lang.choose")}</p>
        <div className="lb">
          {order.map((l) => (
            <button
              key={l}
              lang={l}
              className={"b" + (l === def ? " on" : "")}
              autoFocus={l === def}
              onClick={() => setLang(l)}
            >
              {translate(l, l === "es" ? "lang.es" : "lang.en")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
