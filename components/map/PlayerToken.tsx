import type { Ref } from "react";
import { SpriteImg } from "@/components/ui/Portrait";
import { CH } from "@/lib/characters";
import styles from "./map.module.css";

/** Character on the map: transparent cut-out (scripts/make_sprites.py) standing on a soft
 *  elliptical ground shadow. The element's left/top is the point between the feet. Position,
 *  flip, walk bob / float are driven imperatively by the Stage loop through the CSS variables
 *  --fl (facing), --by (lift, in % of the sprite height), --sq (squash) and --ss (shadow scale);
 *  the idle breathing is a CSS animation (off with prefers-reduced-motion). */
export default function PlayerToken({ ch, orbi, ref }: { ch: number; orbi?: boolean; ref?: Ref<HTMLDivElement> }) {
  const sp = CH[ch].sp;
  return (
    <div ref={ref} className={styles.sp + (orbi ? " " + styles.orbi : "")}>
      <i className={styles.shd} />
      <div className={styles.bod}>{sp && <SpriteImg file={sp.file} className={styles.img} />}</div>
    </div>
  );
}
