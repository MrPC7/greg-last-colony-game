"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

// Prefixed Fullscreen API (older Safari / iPadOS).
type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsEl = HTMLElement & { webkitRequestFullscreen?: (o?: FullscreenOptions) => Promise<void> | void };

const fsElement = () => {
  const d = document as FsDoc;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
};

/** "⛶" in the top bar (phones only, see #fs in globals.css): the whole page goes full screen.
 *  Where the browser can't (iPhone Safari only allows it for videos), it shows a short tip on how
 *  to get a full-screen game from the home screen instead (appleWebApp in app/layout.tsx). */
export default function FullscreenButton() {
  const t = useT();
  const [on, setOn] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const sync = () => setOn(!!fsElement());
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  useEffect(() => {
    if (!tip) return;
    const id = setTimeout(() => setTip(false), 8000);
    return () => clearTimeout(id);
  }, [tip]);

  const toggle = async () => {
    const d = document as FsDoc;
    if (fsElement()) {
      await (d.exitFullscreen ?? d.webkitExitFullscreen)?.call(d);
      return;
    }
    const el = document.documentElement as FsEl;
    const req = el.requestFullscreen ?? el.webkitRequestFullscreen;
    const enabled = d.fullscreenEnabled ?? d.webkitFullscreenEnabled ?? false;
    if (!req || !enabled) {
      setTip(true);
      return;
    }
    try {
      await req.call(el, { navigationUI: "hide" });
    } catch {
      setTip(true);
    }
  };

  return (
    <>
      <button id="fs" onClick={toggle} aria-label={t(on ? "fs.exit" : "fs.enter")} aria-pressed={on} title={t(on ? "fs.exit" : "fs.enter")}>
        ⛶
      </button>
      {tip && (
        <p id="fstip" role="status" onClick={() => setTip(false)}>
          {t("fs.ios")}
        </p>
      )}
    </>
  );
}
