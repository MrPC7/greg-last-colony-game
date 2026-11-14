"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ACTIVITY_IDS,
  BOSS_INTRO,
  CL,
  ENDING_TXT,
  FACTS,
  MEMORY_TXT,
  ORD,
  RAY_BEFORE_BOSS,
  RAY_MEMORIES,
  ZI,
  ZXM,
  ZXS,
  type ActivityId,
  type ZoneId,
} from "@/lib/content/story";
import { LANGS, useLang, useT } from "@/lib/i18n";
import { useGame, useUI, type ModalSpec, type Theme } from "@/lib/store";

const THEMES: Theme[] = ["auto", "light", "dark"];

export function CloseButton() {
  const t = useT();
  const close = useUI((s) => s.closeModal);
  return <button className="b" onClick={close}>{t("common.close")}</button>;
}

/** Prototype `sub(k)`: zone sub-menu with its two activities. */
export function ZoneMenu({ zone }: { zone: ZoneId }) {
  const t = useT();
  const done = useGame((s) => s.done);
  const [title, acts] = ZXS[zone];
  const open = (id: ActivityId) => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.openModal({ kind: "activity", id });
  };
  return (
    <>
      <h3>{t(title)}</h3>
      <p className="s">{t("zone.choose")}</p>
      {acts.map((a) => (
        <button key={a} className="cd" onClick={() => open(a)}>
          <span className="ic">{ZI[a][0]}</span>
          <b>{t(ZI[a][1])}</b>
          <span>{done[a] ? "✅" : "▶"}</span>
        </button>
      ))}
      <CloseButton />
    </>
  );
}

/** Prototype `mis()` (redesigned version): 10 activities, tap to walk to its zone. */
export function MissionsPanel() {
  const t = useT();
  const done = useGame((s) => s.done);
  const n = ACTIVITY_IDS.filter((k) => done[k]).length;
  const total = ACTIVITY_IDS.length;
  const go = (k: ActivityId) => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.requestVisit(ZXM[k]);
  };
  return (
    <>
      <h3>{t("missions.title")}</h3>
      <div className="pb"><i style={{ width: `${(n / total) * 100}%` }} /></div>
      <p className="s">{t("missions.progress", { d: n, total })}</p>
      {ACTIVITY_IDS.map((k) => (
        <button key={k} className="cd" onClick={() => go(k)}>
          <span className="ic">{ZI[k][0]}</span>
          <b>{t(ZI[k][1])}</b>
          <span>{done[k] ? "✅" : "▶"}</span>
        </button>
      ))}
      <CloseButton />
    </>
  );
}

/** Prototype `inv()`: unlocked facts grid (+ Phase 5: the saved mission patch and Ray's memories). */
export function InventoryPanel() {
  const t = useT();
  const factOrder = useGame((s) => s.factOrder);
  const patch = useGame((s) => s.patch);
  const memories = useGame((s) => s.rayMemories);
  const n = factOrder.filter((k) => k in ZI).length;
  const replay = (i: number) => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.openModal({ kind: "memory", i }, () => useUI.getState().openModal({ kind: "inventory" }));
  };
  return (
    <>
      <h3>{t("inv.patch")}</h3>
      <div className="invp">
        {patch ? (
          // eslint-disable-next-line @next/next/no-img-element -- local data URL thumbnail
          <img src={patch} alt={t("inv.patchAlt")} width={96} height={96} />
        ) : (
          <p className="s">{t("inv.patchNone")}</p>
        )}
      </div>
      <h3>{t(MEMORY_TXT.inv, { k: memories.length, total: RAY_MEMORIES.length })}</h3>
      <p className="s">{t(MEMORY_TXT.invHelp)}</p>
      <div className="st">
        {RAY_MEMORIES.map((m, i) =>
          memories.includes(i) ? (
            <button key={i} className="b" onClick={() => replay(i)}>{m.icon} {i + 1}</button>
          ) : (
            <button key={i} className="b" disabled>🔒 {i + 1}</button>
          ),
        )}
      </div>
      <h3>{t("inv.title")}</h3>
      <div className="pb"><i style={{ width: `${(n / ACTIVITY_IDS.length) * 100}%` }} /></div>
      <div className="gr">
        {ACTIVITY_IDS.map((k) =>
          factOrder.includes(k) ? (
            <div key={k} className="sl">
              <div className="ic">{ZI[k][0]}</div>
              <b>{t(ZI[k][1])}</b>
              <small>{t(FACTS[k])}</small>
            </div>
          ) : (
            <div key={k} className="sl bd">
              <div className="ic">🔒</div>
              <small>{t(ZI[k][1])}</small>
            </div>
          ),
        )}
      </div>
      <CloseButton />
    </>
  );
}

/** Prototype `main()` (redesigned version): the 5 clues of NOX-Ω. */
export function MainMissionPanel() {
  const t = useT();
  const done = useGame((s) => s.done);
  const memories = useGame((s) => s.rayMemories);
  const d = ORD.filter((k) => done[k]).length;
  const fight = () => {
    const ui = useUI.getState();
    ui.closeModal();
    // Phase 5: with all his memories back, Ray reveals his origin before the boss.
    const intro = memories.length >= RAY_MEMORIES.length ? [...RAY_BEFORE_BOSS, ...BOSS_INTRO] : BOSS_INTRO;
    ui.startTalk(intro, () => useUI.getState().openModal({ kind: "boss" }));
  };
  const open = (m: ModalSpec) => {
    const ui = useUI.getState();
    ui.closeModal();
    ui.openModal(m);
  };
  return (
    <>
      <h3>{t("main.title")}</h3>
      <div className="pb"><i style={{ width: `${d * 20}%` }} /></div>
      <p className="s">{t("main.progress", { d })}</p>
      <p className="s">{t(MEMORY_TXT.inv, { k: memories.length, total: RAY_MEMORIES.length })}</p>
      {CL.map((c, i) => (
        <div key={i} className={"cd" + (done[ORD[i]] ? "" : " bd")}>
          <span className="ic">{done[ORD[i]] ? "📡" : "🔒"}</span>
          <span>{t(c)}</span>
          <b>{i + 1}</b>
        </div>
      ))}
      {done.boss && (
        // Phase 6: after the victory, replay the ending or get the certificate again.
        <div className="st">
          <button className="b o" onClick={() => open({ kind: "certificate" })}>{t(ENDING_TXT.cert)}</button>
          <button className="b" onClick={() => open({ kind: "ending" })}>{t(ENDING_TXT.replay)}</button>
        </div>
      )}
      {d >= 5 ? (
        <><button className="b o" onClick={fight}>{t("main.fight")}</button>{" "}</>
      ) : (
        <p className="s">{t("main.locked")}</p>
      )}
      <CloseButton />
    </>
  );
}

/** Settings: language, theme, music, sfx, reset progress. */
export function SettingsPanel() {
  const t = useT();
  const lang = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const g = useGame();
  const [confirm, setConfirm] = useState<"no" | "ask" | "done">("no");
  const onOff = (on: boolean) => t(on ? "settings.on" : "settings.off");
  return (
    <>
      <h3>{t("settings.title")}</h3>
      <div className="st">
        <span>{t("settings.language")}</span>
        {LANGS.map((l) => (
          <button key={l} className={"b" + (lang === l ? " on" : "")} onClick={() => g.setLang(l)}>
            {t(l === "es" ? "lang.es" : "lang.en")}
          </button>
        ))}
      </div>
      <div className="st">
        <span>{t("settings.theme")}</span>
        {THEMES.map((th) => (
          <button key={th} className={"b" + (g.theme === th ? " on" : "")} onClick={() => g.setTheme(th)}>
            {t(`theme.${th}`)}
          </button>
        ))}
      </div>
      <div className="st">
        <span>{t("settings.music")}</span>
        <button className="b" aria-pressed={g.musicOn} onClick={g.toggleMusic}>{onOff(g.musicOn)}</button>
      </div>
      <div className="st">
        <span>{t("settings.sfx")}</span>
        <button className="b" aria-pressed={g.sfxOn} onClick={g.toggleSfx}>{onOff(g.sfxOn)}</button>
      </div>
      <div className="st">
        {confirm === "ask" ? (
          <>
            <p className="s" style={{ width: "100%", margin: 0 }}>{t("settings.resetConfirm")}</p>
            <button className="b o" onClick={() => { g.resetProgress(); setConfirm("done"); }}>{t("settings.resetYes")}</button>
            <button className="b" onClick={() => setConfirm("no")}>{t("settings.cancel")}</button>
          </>
        ) : (
          <>
            <button className="b o" onClick={() => setConfirm("ask")}>{t("settings.reset")}</button>
            {confirm === "done" && <span className="s">{t("settings.resetDone")}</span>}
          </>
        )}
      </div>
      <div className="st">
        <button className="b" onClick={() => { useUI.getState().closeModal(); router.push("/credits"); }}>{t("credits.link")}</button>
      </div>
      {pathname !== "/" && (
        <div className="st">
          <button className="b" onClick={() => { useUI.getState().closeModal(); router.push("/"); }}>{t("settings.home")}</button>
        </div>
      )}
      <CloseButton />
    </>
  );
}
