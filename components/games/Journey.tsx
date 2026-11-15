"use client";

import { useState } from "react";
import { cropStyle, Portrait } from "@/components/ui/Portrait";
import Watermark from "@/components/ui/Watermark";
import { sfx } from "@/lib/audio";
import { ENDING_TXT, JOURNEY, JOURNEY_TXT } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { resolveSpeaker, startBossIntro, useGame, useUI } from "@/lib/store";

/** Journey to the Moon cutscene, in the style of the ending: the Last Explorers leave Cajamarca,
 *  lift off, see Earth from space and land next to Selene. Scenes show cast portraits and, for the
 *  space scenes, a crop of the key art (with its AI label). `toBoss`: opened by "Face the Hollow
 *  Queen" — the last scene (or Skip) goes on to the boss intro. Otherwise it is a replay from the
 *  main mission and simply closes. */
export default function Journey({ toBoss }: { toBoss: boolean }) {
  const t = useT();
  const hero = useGame((s) => s.character);
  const [i, setI] = useState(0);
  const scene = JOURNEY[i];
  const last = i === JOURNEY.length - 1;

  const go = (k: number) => {
    sfx(k === JOURNEY.length - 1 ? "star" : "click");
    setI(k);
  };
  const finish = () => {
    useUI.getState().closeModal();
    if (toBoss) startBossIntro();
  };

  return (
    <div className="mem end">
      <p className="s">{t(JOURNEY_TXT.scene, { i: i + 1, total: JOURNEY.length })}</p>
      <h3>{t(scene.title)}</h3>
      {/* key: replay the fade-in on every scene */}
      <div key={i}>
        {scene.art && (
          <div
            className="wmc jart"
            role="img"
            aria-label={t(scene.art.alt)}
            style={{
              ...cropStyle(scene.art.rect, "key"),
              aspectRatio: `${scene.art.rect[2]} / ${scene.art.rect[3]}`,
              // full width, but never taller than ~45% of the screen (landscape phones)
              width: `min(100%, ${((45 * scene.art.rect[2]) / scene.art.rect[3]).toFixed(1)}vh)`,
            }}
          >
            <Watermark />
          </div>
        )}
        <div className="memv">
          {scene.chars.length > 0 && (
            <div className="endc">
              {scene.chars.map((c, k) => (
                <span key={k} className="wmp">
                  <Portrait ch={resolveSpeaker(c, hero)} />
                  <Watermark compact />{/* every portrait is a crop of AI art */}
                </span>
              ))}
            </div>
          )}
          <div>
            {scene.lines.map((l, k) => (
              <p key={k} style={{ animationDelay: `${0.3 + k * 1.2}s` }}>{t(l)}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="pb"><i style={{ width: `${((i + 1) / JOURNEY.length) * 100}%` }} /></div>
      {last ? (
        <button className={toBoss ? "b o" : "b"} id="jdone" onClick={finish}>
          {toBoss ? t("main.fight") : t(ENDING_TXT.back)}
        </button>
      ) : (
        <>
          <button className="b" id="jnext" onClick={() => go(i + 1)}>{t(ENDING_TXT.next)}</button>{" "}
          <button className="b o" id="jskip" onClick={finish}>{t(ENDING_TXT.skip)}</button>
        </>
      )}
    </div>
  );
}
