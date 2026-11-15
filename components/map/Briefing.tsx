"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { ORBI } from "@/lib/characters";
import { BRIEF_PANELS, BRIEF_TXT, ZI, ZONES, ZXM } from "@/lib/content/story";
import type { Lang, Localized } from "@/lib/content/types";
import { useT } from "@/lib/i18n";
import { setPadEnter } from "@/lib/pad";
import { useUI } from "@/lib/store";
import { ArtWindow, FitText, place, type Box } from "./MapLabel";
import styles from "./briefing.module.css";

/** Size of briefing.jpg in px: every box below is measured on it (as in MapLabel.tsx for the map). */
const BW = 1920;
const BH = 1080;
const FULL: Box = [0, 0, BW, BH];

/** A window onto the briefing art at `at` (stage coordinates). Not rotated, so it always matches the art. */
const ArtIcon = ({ at }: { at: Box }) => <ArtWindow at={at} w={BW} h={BH} className={styles.art} />;

/** Panel box in briefing px, its rotation (to match the painted perspective) and the icons /
 *  pictures painted on it, which are kept as art windows. `title` / `items`: text boxes in px. */
type SideGeo = { panel: Box; rot: number; icons: Box[]; title: Box; items: Box };

const SIDE: Record<string, SideGeo> = {
  suits: { panel: [10, 430, 318, 722], rot: 1.5, icons: [[36, 442, 74, 482], [40, 506, 170, 712]], title: [78, 446, 306, 504], items: [176, 540, 312, 700] },
  missions: { panel: [493, 676, 829, 860], rot: -5, icons: [[506, 738, 674, 862], [466, 786, 566, 882]], title: [508, 682, 790, 730], items: [680, 728, 820, 852] },
  life: { panel: [1630, 326, 1890, 506], rot: -5, icons: [[1646, 350, 1690, 384], [1640, 388, 1698, 510]], title: [1690, 336, 1884, 384], items: [1700, 386, 1884, 500] },
  rad: { panel: [1625, 550, 1906, 716], rot: -2.5, icons: [[1634, 576, 1702, 682]], title: [1706, 560, 1898, 632], items: [1706, 632, 1898, 706] },
  energy: { panel: [1444, 703, 1692, 864], rot: -1.5, icons: [[1456, 722, 1488, 756], [1456, 756, 1516, 852]], title: [1488, 712, 1684, 756], items: [1514, 756, 1684, 850] },
};

const BUBBLE: Box = [702, 16, 1238, 150];
const PILL: Box = [16, 189, 394, 275];
const HUD: Box = [1396, 20, 1752, 134];
const SCHOOL: Box = [16, 950, 454, 1054];
const BOTTOM: Box = [598, 940, 1568, 1052];
const GO: Box = [1268, 955, 1552, 1040];
/** Rotated banner on the classroom wall: centre, size and angle. */
const BANNER = { cx: 1698, cy: 248, w: 232, h: 112, rot: -12 };

/** Orbi's line for a side panel: "Spacesuits: you practice it in Auditorium → Augmented reality
 *  and in Green Zones → Thermal control." Built in both languages, so it follows language switches. */
function learnLine(title: Localized, learn: (keyof typeof ZI)[]): Localized {
  const one = (l: Lang) => {
    const where = learn.map((a) => `${ZONES[ZXM[a]].n[l]} → ${ZI[a][0]} ${ZI[a][1][l]}`).join(` ${BRIEF_TXT.and[l]} `);
    return BRIEF_TXT.learn[l].replace("{topic}", title[l]).replace("{where}", where);
  };
  return { es: one("es"), en: one("en") };
}

/** Briefing screen "Misión Lunar – Fase 1" (public/img/briefing.webp, AI art made by the team).
 *  Every painted text panel is covered by an HTML copy in the art's style (same technique as the
 *  map labels), so ES and EN players both read their language. The five side panels are buttons:
 *  Orbi says which zone and mini-game teach that topic. ¡Comenzar! opens the map. Rendered in place
 *  of the map stage, so the phone layout (PhoneBar beside / under it) stays the same; the phone
 *  "Enter" button also starts. */
export default function Briefing({ onStart }: { onStart: () => void }) {
  const t = useT();
  const [sel, setSel] = useState<string | null>(null);

  // ¡Comenzar!: Orbi first sums up the 3-step goal; the map opens when that line is closed.
  // Pressing ¡Comenzar! again while Orbi talks just continues.
  const begin = useCallback(() => {
    const ui = useUI.getState();
    if (ui.talk?.lines[0]?.[1] === BRIEF_TXT.goal) return ui.advanceTalk();
    useUI.setState({ talk: null });
    ui.startTalk([[ORBI, BRIEF_TXT.goal]], onStart);
  }, [onStart]);

  useEffect(() => {
    setPadEnter(begin);
    return () => setPadEnter(null);
  }, [begin]);

  const tell = (id: string) => {
    const p = BRIEF_PANELS.find((x) => x.id === id);
    if (!p) return;
    setSel(id);
    useUI.setState({ talk: null });
    useUI.getState().startTalk([[ORBI, learnLine(p.title, p.learn)]]);
  };

  const bannerStyle: CSSProperties = {
    ...place([BANNER.cx - BANNER.w / 2, BANNER.cy - BANNER.h / 2, BANNER.cx + BANNER.w / 2, BANNER.cy + BANNER.h / 2], FULL),
    transform: `rotate(${BANNER.rot}deg)`,
  };

  return (
    <div role="region" className={styles.stage} aria-label={t(BRIEF_TXT.label)}>
      {/* Orbi's speech bubble */}
      <div className={styles.bubble} style={place(BUBBLE, FULL)}>
        <FitText at={[728, 26, 1176, 140]} panel={BUBBLE} className={styles.btx}>
          <span>{t(BRIEF_TXT.orbi)}</span>
        </FitText>
      </div>
      <ArtIcon at={[1176, 34, 1228, 84]} />

      {/* Mission pill (top left) */}
      <div className={`${styles.pn} ${styles.pill}`} style={place(PILL, FULL)}>
        <FitText at={[98, 196, 336, 268]} panel={PILL}>
          <b>{t(BRIEF_TXT.mission)}</b>
          <small>{t(BRIEF_TXT.motto)}</small>
        </FitText>
      </div>
      <ArtIcon at={[26, 198, 96, 266]} />
      <ArtIcon at={[336, 206, 380, 258]} />

      {/* Place + level (top right) */}
      <div className={`${styles.pn} ${styles.hud}`} style={place(HUD, FULL)}>
        <FitText at={[1470, 34, 1652, 80]} panel={HUD}>
          <b>{t(BRIEF_TXT.place)}</b>
        </FitText>
        <span className={styles.flag} style={place([1662, 38, 1712, 74], HUD)} role="img" aria-label={t(BRIEF_TXT.flag)} />
        <FitText at={[1470, 84, 1560, 126]} panel={HUD}>
          <b>{t(BRIEF_TXT.level)}</b>
        </FitText>
      </div>
      <ArtIcon at={[1418, 30, 1466, 82]} />
      <ArtIcon at={[1418, 82, 1468, 128]} />
      <ArtIcon at={[1556, 86, 1730, 124]} />

      {/* Wall banner */}
      <div className={styles.banner} style={bannerStyle}>
        <span>{t(BRIEF_TXT.banner1)}</span>
        <span>{t(BRIEF_TXT.banner2)}</span>
        <span>{t(BRIEF_TXT.banner3)}</span>
      </div>

      {/* The five topic panels: tap to hear where each one is taught */}
      {BRIEF_PANELS.map((p) => {
        const g = SIDE[p.id];
        if (!g) return null;
        return (
          <div key={p.id} className={styles.side}>
            <button
              className={`${styles.pn} ${styles.sp}` + (sel === p.id ? " " + styles.on : "")}
              style={{ ...place(g.panel, FULL), transform: g.rot ? `rotate(${g.rot}deg)` : undefined }}
              aria-pressed={sel === p.id}
              onClick={() => tell(p.id)}
            >
              <FitText at={g.title} panel={g.panel} className={styles.tt}>
                <b>{t(p.title)}</b>
              </FitText>
              <FitText at={g.items} panel={g.panel} className={styles.it}>
                {p.items.map((it, k) => (
                  <small key={k}>
                    <i className={p.id === "missions" && k === 0 ? styles.cky : styles.ck} aria-hidden>✓</i>
                    {t(it)}
                  </small>
                ))}
              </FitText>
            </button>
            {g.icons.map((b, k) => <ArtIcon key={k} at={b} />)}
          </div>
        );
      })}

      {/* School progress (bottom left) */}
      <div className={`${styles.pn} ${styles.school}`} style={place(SCHOOL, FULL)}>
        <FitText at={[96, 962, 330, 1002]} panel={SCHOOL}>
          <b>{t(BRIEF_TXT.school)}</b>
        </FitText>
      </div>
      <ArtIcon at={[34, 964, 90, 1038]} />
      <ArtIcon at={[90, 1002, 434, 1044]} />

      {/* Bottom bar + ¡Comenzar! */}
      <div className={`${styles.pn} ${styles.bottom}`} style={place(BOTTOM, FULL)}>
        <FitText at={[728, 956, 1250, 1036]} panel={BOTTOM} className={styles.btm}>
          <span>{t(BRIEF_TXT.bottom)}</span>
          <small>{t(BRIEF_TXT.tap)}</small>
        </FitText>
        <button className={styles.go} style={place(GO, BOTTOM)} onClick={begin}>
          <FitText at={[GO[0] + 14, GO[1] + 8, GO[2] - 14, GO[3] - 8]} panel={GO}>
            <b>{t(BRIEF_TXT.start)}</b>
          </FitText>
        </button>
      </div>
      <ArtIcon at={[620, 956, 716, 1036]} />
    </div>
  );
}
