"use client";

import { useT } from "@/lib/i18n";
import { useUI } from "@/lib/store";
import styles from "./map.module.css";

/** Invisible buttons laid over the painted bottom bar of map.jpg:
 *  Mapa · Inventario · Misiones · Logros, the left "Misiones" panel and the right "Misión principal" panel. */
export default function NavBar({ onMap }: { onMap: () => void }) {
  const t = useT();
  const open = useUI((s) => s.openModal);
  return (
    <>
      <div className={styles.nav} data-ui>
        <button onClick={onMap} aria-label={t("nav.map")} title={t("nav.map")} />
        <button onClick={() => open({ kind: "inventory" })} aria-label={t("nav.inventory")} title={t("nav.inventory")} />
        <button onClick={() => open({ kind: "missions" })} aria-label={t("nav.missions")} title={t("nav.missions")} />
        <button onClick={() => open({ kind: "achievements" })} aria-label={t("nav.achievements")} title={t("nav.achievements")} />
      </div>
      <button
        data-ui
        className={styles.mn}
        style={{ left: ".8%", top: "87%", width: "21%", height: "12%" }}
        onClick={() => open({ kind: "missions" })}
        aria-label={t("nav.missions")}
        title={t("nav.missions")}
      />
      <button
        data-ui
        className={styles.mn}
        style={{ left: "71%", top: "88%", width: "28%", height: "11%" }}
        onClick={() => open({ kind: "main" })}
        aria-label={t("nav.main")}
        title={t("nav.main")}
      />
    </>
  );
}
