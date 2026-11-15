"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

const KEY = "colonia-rotate-hint";
/** Touch phone held upright. */
const PORTRAIT_PHONE = "(max-width: 820px) and (orientation: portrait) and (pointer: coarse)";

const seen = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const markSeen = () => {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // per-device convenience only
  }
};

/** First time on a phone in portrait: a small tip to turn the phone sideways for a bigger map.
 *  Gone for good once dismissed or once the player rotates to landscape. */
export default function RotateHint() {
  const t = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (seen()) return;
    const mq = window.matchMedia(PORTRAIT_PHONE);
    const land = window.matchMedia("(orientation: landscape)");
    const sync = () => {
      if (land.matches && window.matchMedia("(pointer: coarse)").matches) {
        markSeen();
        setShow(false);
      } else setShow(mq.matches && !seen());
    };
    sync();
    mq.addEventListener("change", sync);
    land.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      land.removeEventListener("change", sync);
    };
  }, []);

  if (!show) return null;
  return (
    <div id="rot" role="status">
      <span>{t("rotate.hint")}</span>
      <button
        onClick={() => {
          markSeen();
          setShow(false);
        }}
        aria-label={t("rotate.dismiss")}
      >
        ✕
      </button>
    </div>
  );
}
