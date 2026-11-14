"use client";

import { CH } from "@/lib/characters";
import { useT } from "@/lib/i18n";
import { useGame } from "@/lib/store";
import { Portrait } from "@/components/ui/Portrait";
import styles from "./map.module.css";

/** HUD: portrait, name, level, ⭐ stars, 💎 crystals.
 *  Default: over the painted top-right box of the map (wide screens).
 *  `bar`: compact version in the top bar row, shown instead on screens ≤ 820px. */
export default function Hud({ bar }: { bar?: boolean }) {
  const t = useT();
  const ch = useGame((s) => s.character);
  const stars = useGame((s) => s.stars);
  const gems = useGame((s) => s.gems);
  const name = t(CH[ch].n);
  const level = t("hud.level", { lv: 1 + Math.floor(stars / 5) });
  if (bar) {
    return (
      <div className={styles.barHud}>
        <Portrait ch={ch} />
        <div className={styles.bnm}>
          <span>{name}</span>
          <small>{level}</small>
        </div>
        <div className={styles.bct}>
          <span>⭐ {stars}</span>
          <span>💎 {gems}</span>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.hud}>
      <Portrait ch={ch} style={{ width: "16%" }} />
      <div className={styles.nm}>
        {name}
        <br />
        <small>{level}</small>
      </div>
      <div className={styles.ct}>⭐ {stars}</div>
      <div className={styles.ct}>💎 {gems}</div>
    </div>
  );
}
