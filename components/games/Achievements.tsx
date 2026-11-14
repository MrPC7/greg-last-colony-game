"use client";

import { CloseButton } from "@/components/ui/Panels";
import { BG } from "@/lib/content/story";
import { useT } from "@/lib/i18n";
import { useGame } from "@/lib/store";

/** Prototype `logros()` with the `BG` table: 8 badges, progress bar and n/8 count.
 *  Locked badges are greyed out (`.bd`). */
export default function Achievements() {
  const t = useT();
  const done = useGame((s) => s.done);
  const shards = useGame((s) => s.shards);
  const view = { done, shards };
  const n = BG.filter((b) => b.ok(view)).length;
  return (
    <>
      <h3>{t("ach.title")}</h3>
      <div className="pb"><i style={{ width: `${(n / BG.length) * 100}%` }} /></div>
      <p className="s">{n}/{BG.length}</p>
      <div className="gr">
        {BG.map((b) => (
          <div key={b.icon} className={"sl" + (b.ok(view) ? "" : " bd")}>
            <div className="ic">{b.icon}</div>
            <b>{t(b.name)}</b>
            <small>{t(b.desc)}</small>
          </div>
        ))}
      </div>
      <CloseButton />
    </>
  );
}
