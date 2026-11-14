"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import HostNote from "@/components/ui/HostNote";
import { sfx } from "@/lib/audio";
import { PATCH, PATCH_COLORS, PATCH_TXT } from "@/lib/content/games";
import { useT } from "@/lib/i18n";
import { awardWin, useGame } from "@/lib/store";

const S = PATCH.size;
const GREG = 0;

type Tool = "brush" | "eraser";

/** Circle template: dashed guide on the overlay canvas (never exported). */
function drawGuide(c: HTMLCanvasElement | null, on: boolean) {
  const x = c?.getContext("2d");
  if (!x) return;
  x.clearRect(0, 0, S, S);
  if (!on) return;
  x.save();
  // Darken the corners that will be cut off when saving.
  x.fillStyle = "#0008";
  x.beginPath();
  x.rect(0, 0, S, S);
  x.arc(S / 2, S / 2, S / 2 - 4, 0, Math.PI * 2, true);
  x.fill("evenodd");
  x.setLineDash([8, 6]);
  x.lineWidth = 2;
  x.strokeStyle = "#ffd54a";
  x.beginPath();
  x.arc(S / 2, S / 2, S / 2 - 4, 0, Math.PI * 2);
  x.stroke();
  x.beginPath();
  x.arc(S / 2, S / 2, S / 2 - 40, 0, Math.PI * 2);
  x.stroke();
  x.restore();
}

/** The image to save: the drawing, cut round with a gold border when the template is on. */
function exportCanvas(src: HTMLCanvasElement, round: boolean, size: number) {
  const out = document.createElement("canvas");
  out.width = out.height = size;
  const x = out.getContext("2d")!;
  const k = size / S;
  if (round) {
    x.save();
    x.beginPath();
    x.arc(size / 2, size / 2, size / 2 - 4 * k, 0, Math.PI * 2);
    x.clip();
    x.drawImage(src, 0, 0, size, size);
    x.restore();
    x.lineWidth = 6 * k;
    x.strokeStyle = "#ffd54a";
    x.beginPath();
    x.arc(size / 2, size / 2, size / 2 - 4 * k, 0, Math.PI * 2);
    x.stroke();
  } else {
    x.drawImage(src, 0, 0, size, size);
  }
  return out;
}

/** Phase 5 · Greg's feature (Laboratorio Digital): draw a mission patch with brush, colours,
 *  eraser and a circle template. "Guardar" downloads a PNG and keeps a thumbnail for the
 *  inventory; the first save awards 2 ★ (activity "patch"). */
export default function MissionPatch() {
  const t = useT();
  const cv = useRef<HTMLCanvasElement>(null);
  const guide = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState(PATCH_COLORS[1].c);
  const [size, setSize] = useState(PATCH.sizes[1]);
  const [round, setRound] = useState(true);
  const [saved, setSaved] = useState<number | null>(null);

  const clear = () => {
    const x = cv.current?.getContext("2d");
    if (!x) return;
    x.fillStyle = PATCH.bg;
    x.fillRect(0, 0, S, S);
  };

  useEffect(clear, []);
  useEffect(() => drawGuide(guide.current, round), [round]);

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * S, y: ((e.clientY - r.top) / r.height) * S };
  };

  const stroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const x = cv.current?.getContext("2d");
    if (!x) return;
    x.strokeStyle = x.fillStyle = tool === "eraser" ? PATCH.bg : color;
    x.lineWidth = tool === "eraser" ? size * 2 : size;
    x.lineCap = x.lineJoin = "round";
    x.beginPath();
    x.moveTo(from.x, from.y);
    x.lineTo(to.x, to.y);
    x.stroke();
  };

  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    last.current = p;
    stroke(p, p);
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!last.current) return;
    const p = point(e);
    stroke(last.current, p);
    last.current = p;
  };
  const up = () => {
    last.current = null;
  };

  const save = () => {
    const c = cv.current;
    if (!c) return;
    const a = document.createElement("a");
    a.href = exportCanvas(c, round, S * 2).toDataURL("image/png");
    a.download = t(PATCH_TXT.file) + ".png";
    a.click();
    useGame.getState().setPatch(exportCanvas(c, round, PATCH.thumb).toDataURL("image/png"));
    setSaved(awardWin("patch", PATCH.stars) ? PATCH.stars : 0);
    sfx("ok");
  };

  return (
    <>
      <h3>{t(PATCH_TXT.title)}</h3>
      <HostNote ch={GREG} text={PATCH_TXT.greg} />
      <div className="patchw">
        <canvas
          ref={cv}
          width={S}
          height={S}
          aria-label={t(PATCH_TXT.canvas)}
          style={{ touchAction: "none" }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
        <canvas ref={guide} width={S} height={S} className="patchg" aria-hidden="true" />
      </div>
      <div className="st">
        <button className={"b" + (tool === "brush" ? " on" : "")} aria-pressed={tool === "brush"} onClick={() => setTool("brush")}>
          {t(PATCH_TXT.brush)}
        </button>
        <button className={"b" + (tool === "eraser" ? " on" : "")} aria-pressed={tool === "eraser"} onClick={() => setTool("eraser")}>
          {t(PATCH_TXT.eraser)}
        </button>
        <button className={"b" + (round ? " on" : "")} aria-pressed={round} onClick={() => setRound(!round)}>
          {t(PATCH_TXT.template)}
        </button>
      </div>
      <div className="st" role="group" aria-label={t(PATCH_TXT.colors)}>
        {PATCH_COLORS.map((p) => (
          <button
            key={p.c}
            className={"sw" + (color === p.c && tool === "brush" ? " on" : "")}
            style={{ background: p.c }}
            aria-label={t(p.name)}
            aria-pressed={color === p.c}
            onClick={() => { setColor(p.c); setTool("brush"); }}
          />
        ))}
      </div>
      <div className="st" role="group" aria-label={t(PATCH_TXT.size)}>
        <span className="s">{t(PATCH_TXT.size)}</span>
        {PATCH.sizes.map((k) => (
          <button
            key={k}
            className={"b sz" + (size === k ? " on" : "")}
            aria-label={t(PATCH_TXT.sizeN, { k })}
            aria-pressed={size === k}
            onClick={() => setSize(k)}
          >
            <i style={{ width: k, height: k }} />
          </button>
        ))}
      </div>
      <p className="s">{t(PATCH_TXT.tip)}</p>
      <div className="st">
        <button className="b o" onClick={() => { sfx("click"); clear(); }}>{t(PATCH_TXT.clear)}</button>
        <button className="b" onClick={save}>{t(PATCH_TXT.save)}</button>
      </div>
      <div className="s" role="status">
        {saved !== null && (saved > 0 ? t(PATCH_TXT.saved, { s: saved }) : t(PATCH_TXT.savedReplay))}
      </div>
    </>
  );
}
