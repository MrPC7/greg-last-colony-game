"use client";

import styles from "@/components/map/map.module.css";
import { sfx } from "@/lib/audio";
import { SH, SHARDS_DONE } from "@/lib/content/story";
import { useGame, useUI } from "@/lib/store";

/** Pick-up radius in map %, with the prototype's 0.56 vertical squash. */
const R = 3;

/** Prototype `lp2` shard check: called every frame by the map with the hero's position.
 *  Each fragment gives +1 ⭐ and a chime; the 8th adds the +5 ⭐ bonus and Orbi's line. */
export function collectShards(x: number, y: number) {
  const g = useGame.getState();
  SH.forEach(([sx, sy], i) => {
    if (g.shards.includes(i) || Math.hypot(sx - x, (sy - y) * 0.56) >= R) return;
    const all = useGame.getState().addShard(i);
    sfx("star");
    if (all) useUI.getState().startTalk(SHARDS_DONE);
  });
}

/** The 8 floating ✦ star fragments still on the map (prototype `.sh`). Collected ones stay gone. */
export default function StarShards() {
  const shards = useGame((s) => s.shards);
  return SH.map(([x, y], i) =>
    shards.includes(i) ? null : (
      <div key={i} className={styles.sh} style={{ left: x + "%", top: y + "%" }} aria-hidden>
        ✦
      </div>
    ),
  );
}
