"use client";

import { useMemo, useState } from "react";
import { sfx } from "@/lib/audio";
import { CONTINENTS, FIRE, FIRE_TXT } from "@/lib/content/games";
import { useLang, useT } from "@/lib/i18n";
import { fmtDate, fmtDateRange, fmtNum, useNasaData, type Firms } from "@/lib/nasaData";
import { awardWin } from "@/lib/store";
import { LAND, MAP_LAT, WATER, pathOf, px, py } from "@/lib/worldmap";
import { DataCaption, DataStatus, RayNote } from "./DataParts";

/** Continent id of a point: the first CONTINENTS entry whose boxes contain it (or null: ocean / other). */
function continentOf(lat: number, lon: number): string | null {
  for (const c of CONTINENTS) {
    if (c.boxes.some(([la0, la1, lo0, lo1]) => lat >= la0 && lat <= la1 && lon >= lo0 && lon <= lo1)) return c.id;
  }
  return null;
}

const LAND_D = pathOf(LAND);
const WATER_D = pathOf(WATER);
const VB = `0 ${py(MAP_LAT.top)} 360 ${MAP_LAT.top - MAP_LAT.bottom}`;

function FireGame({ f }: { f: Firms }) {
  const t = useT();
  const lang = useLang();
  const [pick, setPick] = useState<string | null>(null);
  const [first, setFirst] = useState(false);

  const counts = useMemo(() => {
    const m = new Map<string, number>(CONTINENTS.map((c) => [c.id, 0]));
    for (const p of f.points) {
      const c = continentOf(p.lat, p.lon);
      if (c) m.set(c, m.get(c)! + 1);
    }
    return m;
  }, [f]);
  const top = Math.max(...counts.values());
  const winners = CONTINENTS.filter((c) => counts.get(c.id) === top);
  const best = winners[0];
  const n = f.points.length;
  const right = pick !== null && winners.some((c) => c.id === pick);
  const ranked = [...CONTINENTS].sort((a, b) => counts.get(b.id)! - counts.get(a.id)!);

  const choose = (id: string) => {
    if (pick) return;
    setPick(id);
    const ok = winners.some((c) => c.id === id);
    sfx(ok ? "ok" : "bad");
    setFirst(awardWin("fires", ok ? FIRE.stars : FIRE.starsRetry));
  };

  return (
    <>
      <h3>{t(FIRE_TXT.title)}</h3>
      <RayNote text={FIRE_TXT.ray} vars={{ n }} />
      <svg className="fm" viewBox={VB} role="img" aria-label={t(FIRE_TXT.mapLabel, { n })}>
        <rect className="fmw" x={0} y={py(MAP_LAT.top)} width={360} height={MAP_LAT.top - MAP_LAT.bottom} />
        <path className="fml" d={LAND_D} />
        <path className="fmw" d={WATER_D} />
        {pick &&
          best.boxes.map(([la0, la1, lo0, lo1], i) => (
            <rect key={i} className="fmb" x={px(lo0)} y={py(la1)} width={lo1 - lo0} height={la1 - la0} />
          ))}
        {f.points.map((p, i) => (
          <circle key={i} className="fmd" cx={px(p.lon)} cy={py(p.lat)} r={1.6}>
            <title>
              {t(FIRE_TXT.dot, {
                lat: fmtNum(p.lat, lang, 1),
                lon: fmtNum(p.lon, lang, 1),
                b: fmtNum(p.brightness, lang),
                d: fmtDate(p.date, lang),
              })}
            </title>
          </circle>
        ))}
      </svg>
      <p><b>{t(FIRE_TXT.question)}</b></p>
      {!pick ? (
        <div className="yrs">
          {CONTINENTS.map((c) => (
            <button key={c.id} className="op" onClick={() => choose(c.id)}>{t(c.name)}</button>
          ))}
        </div>
      ) : (
        <>
          <p className="s">
            {t(right ? FIRE_TXT.right : FIRE_TXT.wrong, { c: t(best.name), k: top, n })}
            {first && <> {t(FIRE_TXT.win, { s: right ? FIRE.stars : FIRE.starsRetry })}</>}
          </p>
          <div className="cb">
            {ranked.map((c) => (
              <div key={c.id} className={"cbr" + (c.id === pick ? (right ? " ok" : " no") : "")}>
                <span>{t(c.name)}</span>
                <i style={{ width: `${(counts.get(c.id)! / top) * 100}%` }} />
                <b>{t(FIRE_TXT.count, { k: counts.get(c.id)! })}</b>
              </div>
            ))}
          </div>
          <p className="s">{t(FIRE_TXT.why)}</p>
        </>
      )}
      <DataCaption
        text={FIRE_TXT.caption}
        vars={{ date: fmtDateRange(f.acq_dates[0], f.acq_dates[1], lang) }}
        href={f.url}
      />
    </>
  );
}

/** "¿En qué continente hay más incendios hoy?" with real NASA FIRMS data (activity "fires"):
 *  ~300 high-confidence fires of the last 24 h on a hand-drawn world map, counted per continent
 *  by bounding box. Right answer → 3 ★, otherwise 1 ★ after seeing the counts. */
export default function FireMap() {
  const { data, error } = useNasaData<Firms>("firms.json");
  if (!data) return <DataStatus error={error} />;
  return <FireGame f={data} />;
}
