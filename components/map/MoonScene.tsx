"use client";

import { Portrait } from "@/components/ui/Portrait";
import { CH, ORBI } from "@/lib/characters";
import { MOON_LEARN, MOON_TXT } from "@/lib/content/story";
import type { Localized } from "@/lib/content/types";
import { useT } from "@/lib/i18n";
import { resolveSpeaker, useGame, useUI } from "@/lib/store";
import Watermark from "@/components/ui/Watermark";
import { ArtWindow, FitText, place, type Box } from "./MapLabel";
import styles from "./moon.module.css";

/** Size of scene03.jpg in px: every box below is measured on it. */
const SW = 1920;
const SH = 1080;
const FULL: Box = [0, 0, SW, SH];
const Art = ({ at }: { at: Box }) => <ArtWindow at={at} w={SW} h={SH} className={styles.art} />;

const PILL: Box = [656, 18, 1146, 82];
const MISSION: Box = [20, 204, 338, 442];
const HUD: Box = [1440, 20, 1766, 152];
const LIST: Box = [1580, 588, 1902, 932];
const LIST_ROWS = [670, 715, 762, 806, 850, 895];
const DIALOG: Box = [318, 804, 1252, 992];
const TUTORIAL: Box = [22, 984, 332, 1060];
const GO: Box = [1550, 962, 1900, 1072];
/** Outline of the painted dialogue box (name tab top left, bevelled corners), in px. `tab`: where
 *  the name tab ends (the painted one fits "Orbi"; the live dialogue widens it for longer names). */
const dialogShape = (tab: number): [number, number][] => [
  [330, 806], [tab, 806], [tab + 32, 850], [1235, 850], [1252, 874], [1252, 966], [1232, 990], [340, 990], [318, 966], [318, 830],
];
const clip = (tab: number) => `polygon(${dialogShape(tab).map(([x, y]) =>
  `${+(((x - DIALOG[0]) / (DIALOG[2] - DIALOG[0])) * 100).toFixed(2)}% ${+(((y - DIALOG[1]) / (DIALOG[3] - DIALOG[1])) * 100).toFixed(2)}%`).join(",")})`;
const CLIP_PAINTED = clip(600);
const CLIP_LIVE = clip(800);

/** "La Luna en Peligro" (public/img/scene03.webp, AI art made by the team) with HTML copies of
 *  every painted text panel in ES/EN (same technique as the map labels and the briefing). The HUD
 *  shows the player's live hero, ⭐, 💎 and level.
 *
 *  Static (last scene of the Journey to the Moon): the dialogue box shows Orbi's painted line and
 *  ¡Continuar! calls `onContinue`. `live` (backdrop of the boss intro, in place of the map): the
 *  dialogue box shows the current dialogue line with its speaker, and it and ¡Continuar! advance
 *  the dialogue (the floating speech bubble is hidden meanwhile; phones still use the Chat panel). */
export default function MoonScene({ live, onContinue, alt }: { live?: boolean; onContinue?: () => void; alt?: Localized }) {
  const t = useT();
  const hero = useGame((s) => s.character);
  const stars = useGame((s) => s.stars);
  const gems = useGame((s) => s.gems);
  const talk = useUI((s) => s.talk);
  const line = live && talk ? talk.lines[talk.i] : null;
  const who = line ? resolveSpeaker(line[0], hero) : ORBI;
  const advance = () => useUI.getState().advanceTalk();
  const next = live ? advance : onContinue;

  const dialogText = line ? (
    <span>{t(line[1])}</span>
  ) : (
    <span><b>{t(MOON_TXT.callout)}</b> {t(MOON_TXT.orbi)}</span>
  );

  return (
    <div role="region" className={styles.stage + (live ? " " + styles.live : "")} aria-label={t(alt ?? MOON_TXT.label)} data-moon-live={live || undefined}>
      {/* Scenario pill (top centre) */}
      <div className={`${styles.pn} ${styles.pill}`} style={place(PILL, FULL)}>
        <FitText at={[730, 26, 1132, 74]} panel={PILL}>
          <b>{t(MOON_TXT.scenario)}</b>
        </FitText>
      </div>
      <Art at={[674, 24, 722, 76]} />

      {/* Current mission (top left) */}
      <div className={`${styles.pn} ${styles.mission}`} style={place(MISSION, FULL)}>
        <FitText at={[106, 214, 326, 282]} panel={MISSION} className={styles.mt}>
          <b>{t(MOON_TXT.current)}</b>
          <small>{t(MOON_TXT.rescue)}</small>
        </FitText>
        <span className={styles.rule} style={place([40, 285, 318, 288], MISSION)} />
        <FitText at={[112, 294, 326, 350]} panel={MISSION} className={styles.task}>
          <span>{t(MOON_TXT.task1)}</span>
        </FitText>
        <FitText at={[112, 362, 326, 424]} panel={MISSION} className={styles.task}>
          <span>{t(MOON_TXT.task2)}</span>
        </FitText>
      </div>
      <Art at={[32, 208, 102, 286]} />
      <Art at={[52, 296, 100, 344]} />
      <Art at={[52, 364, 100, 414]} />

      {/* HUD (top right): live values */}
      <div className={`${styles.pn} ${styles.hud}`} style={place(HUD, FULL)}>
        <span className={styles.face} style={place([1455, 34, 1535, 112], HUD)}>
          <span className="wmp">
            <Portrait ch={hero} />
            <Watermark compact />
          </span>
        </span>
        <FitText at={[1552, 34, 1722, 78]} panel={HUD}>
          <b>{t(CH[hero].n)}</b>
        </FitText>
        <FitText at={[1596, 76, 1640, 112]} panel={HUD}>
          <b>{stars}</b>
        </FitText>
        <FitText at={[1690, 76, 1756, 112]} panel={HUD}>
          <b>{gems}</b>
        </FitText>
        <FitText at={[1548, 114, 1634, 148]} panel={HUD} className={styles.lv}>
          <b>{t("hud.level", { lv: 1 + Math.floor(stars / 5) })}</b>
        </FitText>
        <span className={styles.bar} style={place([1638, 122, 1748, 142], HUD)}>
          <i style={{ width: `${((stars % 5) / 5) * 100}%` }} />
        </span>
      </div>
      <Art at={[1548, 74, 1594, 112]} />
      <Art at={[1638, 74, 1682, 112]} />

      {/* "Aprende y prepárate" list (right) */}
      <div className={`${styles.pn} ${styles.list}`} style={place(LIST, FULL)}>
        <FitText at={[1602, 598, 1886, 642]} panel={LIST}>
          <b>{t(MOON_TXT.learn)}</b>
        </FitText>
        <span className={styles.rule} style={place([1600, 646, 1880, 649], LIST)} />
        {MOON_LEARN.map((it, k) => (
          <FitText key={k} at={[1672, LIST_ROWS[k] - 20, 1890, LIST_ROWS[k] + 20]} panel={LIST} className={styles.li}>
            <span>{t(it)}</span>
          </FitText>
        ))}
      </div>
      {LIST_ROWS.map((y) => <Art key={y} at={[1598, y - 27, 1664, y + 27]} />)}

      {/* Dialogue box (bottom): Orbi's painted line, or the live dialogue during the boss intro */}
      <div className={styles.dlg} style={place(DIALOG, FULL)}>
        {live && line ? (
          <button className={styles.dlgIn} style={{ clipPath: CLIP_LIVE }} onClick={advance} aria-live="polite">
            <span className={styles.face} style={place([350, 830, 496, 976], DIALOG)}>
              <span className="wmp">
                <Portrait ch={who} />
                <Watermark compact />
              </span>
            </span>
            <FitText at={[512, 812, 792, 858]} panel={DIALOG} className={styles.nm}>
              <b style={{ color: CH[who].col }}>{t(CH[who].n)}</b>
            </FitText>
            <FitText at={[512, 860, 1176, 978]} panel={DIALOG} className={styles.say}>
              {dialogText}
            </FitText>
          </button>
        ) : (
          <div className={styles.dlgIn} style={{ clipPath: CLIP_PAINTED }}>
            <FitText at={[512, 812, 600, 858]} panel={DIALOG} className={styles.nm}>
              <b>{t(CH[ORBI].n)}</b>
            </FitText>
            <FitText at={[512, 860, 1176, 978]} panel={DIALOG} className={styles.say}>
              {dialogText}
            </FitText>
          </div>
        )}
      </div>
      {!(live && line) && <Art at={[336, 812, 504, 986]} />}
      <Art at={[1180, 936, 1220, 974]} />

      {/* Tutorial STEM (bottom left) */}
      <div className={`${styles.pn} ${styles.tut}`} style={place(TUTORIAL, FULL)}>
        <FitText at={[126, 996, 316, 1048]} panel={TUTORIAL}>
          <b>{t(MOON_TXT.tutorial)}</b>
        </FitText>
      </div>
      <Art at={[38, 990, 114, 1052]} />

      {/* ¡Continuar! */}
      <button className={styles.go} style={place(GO, FULL)} onClick={next} disabled={!next}>
        <FitText at={[1656, 984, 1814, 1050]} panel={GO}>
          <b>{t(MOON_TXT.continue)}</b>
        </FitText>
      </button>
      <Art at={[1574, 976, 1654, 1052]} />
      <Art at={[1816, 986, 1874, 1040]} />
    </div>
  );
}
