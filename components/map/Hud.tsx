"use client";

import { CH } from "@/lib/characters";
import { useT } from "@/lib/i18n";
import { useGame } from "@/lib/store";
import { Portrait } from "@/components/ui/Portrait";
import styles from "./map.module.css";

/** Top-right HUD painted area: portrait, name, level, ⭐ stars, 💎 crystals. */
export default function Hud() {
  const t = useT();
  const ch = useGame((s) => s.character);
  const stars = useGame((s) => s.stars);
  const gems = useGame((s) => s.gems);
  return (
    <div className={styles.hud}>
      <Portrait ch={ch} style={{ width: "16%" }} />
      <div>
        {t(CH[ch].n)}
        <br />
        <small>{t("hud.level", { lv: 1 + Math.floor(stars / 5) })}</small>
      </div>
      <div>⭐ {stars}</div>
      <div>💎 {gems}</div>
    </div>
  );
}
