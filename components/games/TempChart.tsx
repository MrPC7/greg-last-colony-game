"use client";

import {
  Chart as ChartJS,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { sfx } from "@/lib/audio";
import { DATA_HINTS, DATA_TXT, TEMP, TEMP_TXT } from "@/lib/content/games";
import { useLang, useT } from "@/lib/i18n";
import { fmtDate, fmtSigned, useNasaData, type Gistemp } from "@/lib/nasaData";
import { awardWin } from "@/lib/store";
import HintButton from "@/components/ui/HintButton";
import { DataCaption, DataStatus, RayNote } from "./DataParts";

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Tooltip);

type Year = Gistemp["data"][number];
type Round = [Year, Year];

/** 5 random pairs of different years whose anomalies differ by at least TEMP.minGap °C. */
function makeRounds(data: Year[]): Round[] {
  const out: Round[] = [];
  const used = new Set<string>();
  while (out.length < TEMP.rounds) {
    const a = data[Math.floor(Math.random() * data.length)];
    const b = data[Math.floor(Math.random() * data.length)];
    const key = [a.year, b.year].sort().join("-");
    if (a.year === b.year || used.has(key) || Math.abs(a.anomaly - b.anomaly) < TEMP.minGap) continue;
    used.add(key);
    out.push([a, b]);
  }
  return out;
}

// Colours: one series (warm line on a recessive grid); revealed points: hotter = red, cooler = blue,
// each also named in a key with its year and value, so identity is never colour alone.
// The chart canvas always has the dark surface (global `canvas` style, SURFACE) in both themes, so
// its text and grid use fixed light tokens instead of the page's --fg (dark in the light theme).
const LINE = "#e8590c";
const HOT = "#c92a2a";
const COLD = "#1971c2";
const SURFACE = "#05031a";
const INK = "#ece8ff"; // axis titles and the key
const INK2 = "#c9c2f2"; // tick labels
const GRID = "rgba(201,194,242,.2)";
const ZERO = "rgba(236,232,255,.6)";

/** Key for the two revealed points ("● 2017: +0.91 °C" hotter first), drawn in the top-left corner
 *  of the plot. That corner is always empty: before ~1940 the anomaly stays far below the top of
 *  the scale, so the key never overlaps the line or the points. */
const keyPlugin: Plugin<"line"> = {
  id: "yearKey",
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(1);
    const ds = chart.data.datasets[1] as unknown as { labels?: string[] } | undefined;
    if (!meta || meta.hidden || !ds?.labels || !meta.data.length) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    [HOT, COLD].forEach((col, i) => {
      const x = chartArea.left + 10;
      const y = chartArea.top + 12 + i * 18;
      ctx.beginPath();
      ctx.arc(x + 4, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = INK;
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.fillText(ds.labels![i], x + 14, y);
    });
    ctx.restore();
  },
};

function TempGame({ g }: { g: Gistemp }) {
  const t = useT();
  const lang = useLang();
  const [rounds, setRounds] = useState(() => makeRounds(g.data));
  const [r, setR] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<"win" | "winReplay" | "lose" | null>(null);
  const [stars, setStars] = useState(0);

  const pair = rounds[r];
  const [hot, cold] = pair[0].anomaly > pair[1].anomaly ? pair : [pair[1], pair[0]];
  const revealed = pick !== null || result !== null;
  const first = g.data[0].year;
  const last = g.data[g.data.length - 1].year;
  const fmt = (v: number) => fmtSigned(v, lang);

  const choose = (year: number) => {
    if (pick !== null) return;
    setPick(year);
    if (year === hot.year) {
      setCorrect((c) => c + 1);
      sfx("ok");
    } else sfx("bad");
  };

  const next = () => {
    if (r + 1 < TEMP.rounds) {
      setR(r + 1);
      setPick(null);
      return;
    }
    const s = TEMP.stars.find(([min]) => correct >= min)?.[1] ?? 0;
    setStars(s);
    setResult(s ? (awardWin("senal", s) ? "win" : "winReplay") : "lose");
  };

  const again = () => {
    setRounds(makeRounds(g.data));
    setR(0);
    setPick(null);
    setCorrect(0);
    setResult(null);
  };

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: t(TEMP_TXT.series),
          data: g.data.map((d) => ({ x: d.year, y: d.anomaly })),
          borderColor: LINE,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 6,
          tension: 0.15,
        },
        {
          label: "",
          data: revealed ? [hot, cold].map((d) => ({ x: d.year, y: d.anomaly })) : [],
          labels: [hot, cold].map((d) => `${d.year}: ${fmt(d.anomaly)} °C`),
          showLine: false,
          pointRadius: 6,
          pointHoverRadius: 7,
          pointBackgroundColor: [HOT, COLD],
          pointBorderColor: SURFACE,
          pointBorderWidth: 2,
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fmt/t follow `lang`
    [g, revealed, hot, cold, lang],
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    parsing: false,
    interaction: { mode: "nearest", axis: "x", intersect: false },
    scales: {
      x: {
        type: "linear",
        min: first,
        max: last,
        title: { display: true, text: t(TEMP_TXT.axisX), color: INK, font: { weight: "bold" } },
        ticks: { color: INK2, stepSize: 20, callback: (v) => String(v) },
        grid: { display: false },
        border: { color: GRID },
      },
      y: {
        type: "linear",
        title: { display: true, text: t(TEMP_TXT.axisY), color: INK, font: { weight: "bold" } },
        ticks: { color: INK2, callback: (v) => fmtSigned(Number(v), lang, 1) },
        grid: { color: (c) => (c.tick.value === 0 ? ZERO : GRID) },
        border: { color: GRID },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        filter: (it) => it.datasetIndex === 0,
        displayColors: false,
        callbacks: {
          title: () => "",
          label: (c) => t(TEMP_TXT.tooltip, { y: c.parsed.x ?? "", a: fmt(c.parsed.y ?? 0) }),
        },
      },
    },
  };

  const min = Math.min(...g.data.map((d) => d.anomaly));
  const max = Math.max(...g.data.map((d) => d.anomaly));

  return (
    <>
      <h3>{t(TEMP_TXT.title)}</h3>
      <RayNote text={TEMP_TXT.ray} />
      {result === null ? (
        <>
          <p><b>{t(TEMP_TXT.question, { r: r + 1, total: TEMP.rounds })}</b></p>
          <div className="yrs">
            {pair.map((y) => (
              <button
                key={y.year}
                className={"op" + (pick !== null && y.year === hot.year ? " ok" : pick === y.year ? " no" : "")}
                onClick={() => choose(y.year)}
                disabled={pick !== null}
              >
                {y.year}
              </button>
            ))}
          </div>
          <HintButton hint={DATA_HINTS.temp} disabled={pick !== null} />
        </>
      ) : (
        <p><b>{t(TEMP_TXT.score, { c: correct, total: TEMP.rounds })}</b></p>
      )}
      <div className="tc" aria-label={t(TEMP_TXT.chartLabel, { from: first, to: last, min: fmt(min), max: fmt(max) })} role="img">
        <Line data={chartData} options={options} plugins={[keyPlugin]} />
        {!revealed && <div className="tch">{t(TEMP_TXT.hidden)}</div>}
      </div>
      {pick !== null && result === null && (
        <>
          <p className="s">
            {t(pick === hot.year ? TEMP_TXT.right : TEMP_TXT.wrong, { hot: hot.year, cold: cold.year })}{" "}
            {t(TEMP_TXT.values, { y1: hot.year, a1: fmt(hot.anomaly), y2: cold.year, a2: fmt(cold.anomaly) })}
          </p>
          <button className="b" onClick={next}>{t(r + 1 < TEMP.rounds ? TEMP_TXT.next : TEMP_TXT.finish)}</button>
        </>
      )}
      {result && (
        <>
          <p className="s">{t(TEMP_TXT[result], { s: stars })}</p>
          <button className="b" onClick={again}>{t(DATA_TXT.again)}</button>
        </>
      )}
      <DataCaption
        text={TEMP_TXT.caption}
        vars={{ from: first, to: last, date: fmtDate(g.snapshot, lang) }}
        href={g.url}
      />
    </>
  );
}

/** "¿Qué año fue más caluroso?" with real NASA GISTEMP v4 data (activity "senal", main game of
 *  the zone): 5 rounds of two random years; the line chart reveals each answer.
 *  5/5 → 3 ★, 4/5 → 2 ★, 3/5 → 1 ★, fewer → try again. */
export default function TempChart() {
  const { data, error } = useNasaData<Gistemp>("gistemp.json");
  if (!data) return <DataStatus error={error} />;
  return <TempGame g={data} />;
}
