"use client";

import type { UIKey } from "@/lib/i18n";
import { useT } from "@/lib/i18n";
import { useUI, type ModalSpec } from "@/lib/store";
import { FitText, MapIcon, place, type Box } from "./MapLabel";
import styles from "./map.module.css";

// Boxes in map.jpg px (see MapLabel.tsx). The nav bar stays above y = 768: the burned-in
// AI label runs along the bottom edge under it (x ≈ 580–845) and must stay visible.
const NAV: Box = [506, 688, 934, 767];
const TABS: { key: UIKey; cell: Box; icon: Box; open?: ModalSpec }[] = [
  { key: "nav.map", cell: [510, 689, 604, 767], icon: [536, 696, 574, 741] },
  { key: "nav.inventory", cell: [606, 689, 722, 767], icon: [642, 696, 688, 741], open: { kind: "inventory" } },
  { key: "nav.missions", cell: [722, 689, 830, 767], icon: [750, 697, 800, 739], open: { kind: "missions" } },
  { key: "nav.achievements", cell: [830, 689, 932, 767], icon: [855, 697, 908, 741], open: { kind: "achievements" } },
];
const MIS: Box = [8, 669, 302, 770];
const MAIN: Box = [993, 685, 1400, 775];
const GO: Box = [1250, 703, 1396, 767];

/** HTML copies of the painted bottom bar of map.jpg (Mapa · Inventario · Misiones · Logros),
 *  the left "Misiones" panel and the right "Misión principal" panel: they hide the painted
 *  Spanish text, show it in the current language and are the buttons themselves. */
export default function NavBar({ onMap }: { onMap: () => void }) {
  const t = useT();
  const open = useUI((s) => s.openModal);
  return (
    <>
      <div data-ui className={styles.pn} style={place(NAV)}>
        {TABS.map((b, i) => (
          <button
            key={b.key}
            className={styles.tab + (i === 0 ? " " + styles.on : "")}
            style={place(b.cell, NAV)}
            onClick={() => (b.open ? open(b.open) : onMap())}
          >
            <MapIcon at={b.icon} panel={b.cell} />
            <FitText at={[b.cell[0] + 3, 741, b.cell[2] - 3, 764]} panel={b.cell} className={styles.tl}>
              <b>{t(b.key)}</b>
            </FitText>
          </button>
        ))}
      </div>
      <button data-ui className={`${styles.pn} ${styles.mn}`} style={place(MIS)} onClick={() => open({ kind: "missions" })}>
        <MapIcon at={[32, 684, 84, 736]} panel={MIS} />
        <FitText at={[92, 681, 250, 761]} panel={MIS}>
          <b>{t("nav.missions")}</b>
          <small className={styles.w2}>{t("map.missionsSub")}</small>
        </FitText>
        <MapIcon at={[256, 706, 284, 740]} panel={MIS} />
      </button>
      <button data-ui className={`${styles.pn} ${styles.mn} ${styles.main}`} style={place(MAIN)} onClick={() => open({ kind: "main" })}>
        <MapIcon at={[1008, 696, 1074, 752]} panel={MAIN} />
        <FitText at={[1078, 693, 1244, 767]} panel={MAIN}>
          <b>{t("map.mainTitle")}</b>
          <small className={styles.w2}>{t("map.mainSub")}</small>
        </FitText>
        <span className={styles.go} style={place(GO, MAIN)}>
          <FitText at={[GO[0] + 8, GO[1] + 6, GO[2] - 8, GO[3] - 6]} panel={GO}>
            <b>{t("map.go")}</b>
          </FitText>
        </span>
      </button>
    </>
  );
}
