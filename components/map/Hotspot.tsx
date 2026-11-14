"use client";

import styles from "./map.module.css";

/** Pulsing zone circle (prototype `.hs`); `next` = golden highlight for the next zone in ORD. */
export default function Hotspot({
  x,
  y,
  label,
  next,
  locked = false,
  onSelect,
}: {
  x: number;
  y: number;
  label: string;
  next: boolean;
  /** dimmed, not pulsing (the dome before SENAL_UNLOCK zones) */
  locked?: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      data-ui
      role="button"
      tabIndex={0}
      className={styles.hs + (next ? " " + styles.nx : "") + (locked ? " " + styles.lk : "")}
      style={{ left: `${x}%`, top: `${y}%` }}
      title={label}
      aria-label={label}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }
      }}
    />
  );
}
