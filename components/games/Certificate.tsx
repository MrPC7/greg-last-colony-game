"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/audio";
import { asset } from "@/lib/asset";
import { CH, CHT, CW } from "@/lib/characters";
import { CERT, CERT_TXT } from "@/lib/content/games";
import { RAY_MEMORIES } from "@/lib/content/story";
import { useLang, useT } from "@/lib/i18n";
import { useGame, useUI } from "@/lib/store";

const { w: W, h: H } = CERT;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "system-ui, 'Segoe UI', sans-serif";

/** Load an image once (null until it has loaded; stays null on error so the certificate still draws). */
function useImage(src: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) return;
    const im = new Image();
    im.onload = () => setImg(im);
    im.src = src;
    return () => {
      im.onload = null;
    };
  }, [src]);
  return src ? img : null;
}

/** Biggest font size (≤ max) at which `text` fits in `width`. */
function fit(x: CanvasRenderingContext2D, text: string, font: (px: number) => string, max: number, width: number) {
  let px = max;
  x.font = font(px);
  while (px > 18 && x.measureText(text).width > width) x.font = font((px -= 2));
}

/** Phase 6 · Certificate "Explorador/a de Selene": the player types their name (kept only in
 *  this browser's localStorage, never sent anywhere) and gets a certificate with the name, the
 *  hero's portrait (with the AI-image label), stars, crystals, Ray's memories and the date of the
 *  victory, drawn on a canvas and downloaded as a PNG. Everything follows the current language. */
export default function Certificate() {
  const t = useT();
  const lang = useLang();
  const g = useGame();
  const cv = useRef<HTMLCanvasElement>(null);
  const [saved, setSaved] = useState(false);
  const cast = useImage(asset("/img/cast.jpg"));
  const patch = useImage(g.patch);
  const name = g.playerName.trim();
  const won = !!g.done.boss;

  useEffect(() => {
    const c = cv.current;
    const x = c?.getContext("2d");
    if (!c || !x) return;
    const cx = W / 2;
    // Background: night sky with a few fixed stars.
    const bg = x.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0b1d4d");
    bg.addColorStop(1, "#2a1458");
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#ffffff";
    for (let k = 0; k < 70; k++) {
      const sx = (k * 997) % W;
      const sy = (k * 571) % H;
      x.globalAlpha = 0.25 + ((k * 37) % 60) / 100;
      x.fillRect(sx, sy, k % 3 === 0 ? 3 : 2, k % 3 === 0 ? 3 : 2);
    }
    x.globalAlpha = 1;
    // Moon in the corner.
    x.fillStyle = "#d9d4c7";
    x.beginPath();
    x.arc(W - 120, 120, 54, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "#b9b2a3";
    for (const [mx, my, r] of [[-18, -10, 10], [14, 16, 13], [20, -22, 6]]) {
      x.beginPath();
      x.arc(W - 120 + mx, 120 + my, r, 0, Math.PI * 2);
      x.fill();
    }
    // Gold double frame.
    x.strokeStyle = "#ffd54a";
    x.lineWidth = 8;
    x.strokeRect(24, 24, W - 48, H - 48);
    x.lineWidth = 2;
    x.strokeRect(44, 44, W - 88, H - 88);

    x.textAlign = "center";
    x.textBaseline = "alphabetic";
    x.fillStyle = "#ffd54a";
    x.font = `bold 30px ${SANS}`;
    x.fillText(t(CERT_TXT.heading).split("").join(" "), cx, 120);
    x.fillStyle = "#ffffff";
    x.font = `bold 64px ${SERIF}`;
    x.fillText(t(CERT_TXT.award), cx, 200);
    x.font = `italic 28px ${SERIF}`;
    x.fillStyle = "#cfc6ff";
    x.fillText(t(CERT_TXT.certifies), cx, 262);

    // Name (shrinks to fit) on a gold line.
    const shown = name || t(CERT_TXT.noName);
    x.fillStyle = name ? "#ffffff" : "#8a84b8";
    fit(x, shown, (px) => `bold ${px}px ${SERIF}`, 72, 760);
    x.fillText(shown, cx, 350);
    x.strokeStyle = "#ffd54a";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(cx - 380, 372);
    x.lineTo(cx + 380, 372);
    x.stroke();

    const heroName = t(CH[g.character].n);
    x.fillStyle = "#f1ecff";
    x.font = `26px ${SANS}`;
    x.fillText(t(CERT_TXT.body1, { hero: heroName }), cx, 428);
    x.fillText(t(CERT_TXT.body2), cx, 466);

    // Hero portrait (crop of the AI-generated cast sheet) + its AI label.
    const px0 = 230;
    const py0 = 600;
    const pr = 82;
    x.save();
    x.beginPath();
    x.arc(px0, py0, pr, 0, Math.PI * 2);
    x.fillStyle = "#171238";
    x.fill();
    if (cast) {
      x.clip();
      const [fx, fy, fw, fh] = CH[g.character].f;
      const kx = cast.naturalWidth / CW;
      const ky = cast.naturalHeight / CHT;
      x.drawImage(cast, fx * kx, fy * ky, fw * kx, fh * ky, px0 - pr, py0 - pr, pr * 2, pr * 2);
    }
    x.restore();
    x.lineWidth = 6;
    x.strokeStyle = CH[g.character].col;
    x.beginPath();
    x.arc(px0, py0, pr, 0, Math.PI * 2);
    x.stroke();
    // Tiny "IA" / "AI" corner mark (the portrait is a crop of AI art).
    x.save();
    x.font = `bold 13px ${SANS}`;
    x.textAlign = "right";
    x.globalAlpha = 0.7;
    x.shadowColor = "#000";
    x.shadowBlur = 3;
    x.fillStyle = "#ffffff";
    x.fillText(t("ai.mark"), px0 + pr + 6, py0 + pr + 2);
    x.restore();
    x.font = `20px ${SANS}`;
    x.fillStyle = "#cfc6ff";
    x.fillText(t(CERT_TXT.hero, { hero: heroName }), px0, py0 - pr - 16);

    // Player's mission patch (Phase 5), if they drew one.
    const qx = W - 230;
    if (patch) x.drawImage(patch, qx - 80, py0 - 80, 160, 160);

    // Stats + date in the middle column.
    const date = new Date(g.finishedAt ?? Date.now());
    const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-PE" : "en-US", { dateStyle: "long" }).format(date);
    x.font = `bold 28px ${SANS}`;
    x.fillStyle = "#ffd54a";
    x.fillText("⭐ " + t(CERT_TXT.stars, { k: g.stars }), cx, 560);
    x.fillStyle = "#9be7ff";
    x.fillText("💎 " + t(CERT_TXT.gems, { k: g.gems }), cx, 604);
    x.fillStyle = "#b2f5ea";
    x.fillText("🧠 " + t(CERT_TXT.memories, { k: g.rayMemories.length, total: RAY_MEMORIES.length }), cx, 648);
    x.fillStyle = "#ffffff";
    x.font = `24px ${SANS}`;
    x.fillText(t(CERT_TXT.date, { date: fmt }), cx, 706);

    x.font = `18px ${SANS}`;
    x.fillStyle = "#a99ee0";
    x.fillText(t(CERT_TXT.footer), cx, H - 70);
  }, [t, lang, name, cast, patch, g.character, g.stars, g.gems, g.rayMemories.length, g.finishedAt]);

  const download = () => {
    const c = cv.current;
    if (!c || !name) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = t(CERT_TXT.file) + ".png";
    a.click();
    setSaved(true);
    sfx("win");
  };

  if (!won) {
    return (
      <>
        <h3>{t(CERT_TXT.title)}</h3>
        <p>{t(CERT_TXT.locked)}</p>
        <button className="b" onClick={() => useUI.getState().closeModal()}>{t("common.close")}</button>
      </>
    );
  }

  return (
    <>
      <h3>{t(CERT_TXT.title)}</h3>
      <label className="certn">
        <span>{t(CERT_TXT.nameLabel)}</span>
        <input
          id="certname"
          type="text"
          autoComplete="off"
          maxLength={CERT.maxName}
          value={g.playerName}
          placeholder={t(CERT_TXT.namePh)}
          onChange={(e) => {
            g.setPlayerName(e.target.value.slice(0, CERT.maxName));
            setSaved(false);
          }}
        />
      </label>
      <p className="s">{t(CERT_TXT.privacy)}</p>
      <canvas
        ref={cv}
        className="certc"
        width={W}
        height={H}
        role="img"
        aria-label={t(CERT_TXT.canvas) + (name ? ": " + name : "")}
      />
      <button className="b o" id="certdl" disabled={!name} onClick={download}>{t(CERT_TXT.download)}</button>{" "}
      <button className="b" onClick={() => useUI.getState().closeModal()}>{t("common.close")}</button>
      <p className="s" aria-live="polite">{!name ? t(CERT_TXT.needName) : saved ? t(CERT_TXT.downloaded) : ""}</p>
    </>
  );
}
