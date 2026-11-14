import type { Ref } from "react";
import { spriteStyle } from "@/components/ui/Portrait";
import styles from "./map.module.css";

/** Walking character sprite (prototype `.sp`). Position, flip and bob are driven
 *  imperatively by the Stage loop through CSS variables --fl / --by / --sq. */
export default function PlayerToken({ ch, orbi, ref }: { ch: number; orbi?: boolean; ref?: Ref<HTMLDivElement> }) {
  return <div ref={ref} className={styles.sp + (orbi ? " " + styles.orbi : "")} style={spriteStyle(ch)} />;
}
