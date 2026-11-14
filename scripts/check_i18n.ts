// i18n completeness check. Run: npm run check:i18n  (Node ≥ 22.18 runs .ts natively)
//
// Fails (exit 1) when:
//  1. any {es, en} pair in the UI dictionary or content files is missing a language,
//     has an empty string, or uses different {placeholders} in ES and EN;
//  2. a component has hardcoded player-visible text (JSX text, string literals in JSX,
//     or aria-label / title / alt / placeholder string attributes containing letters);
//  3. t("…") is called with a key that is not in the UI dictionary.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import * as characters from "../lib/characters.ts";
import * as credits from "../lib/content/credits.ts";
import * as games from "../lib/content/games.ts";
import * as story from "../lib/content/story.ts";
import { UI } from "../lib/content/ui.ts";

const ROOT = join(import.meta.dirname, "..");
const LANGS = ["es", "en"] as const;
const errors: string[] = [];

// ---- 1. Content pairs -------------------------------------------------------
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
let pairs = 0;

function walk(v: unknown, path: string, seen = new Set<unknown>()) {
  if (v === null || typeof v !== "object" || seen.has(v)) return;
  seen.add(v);
  const o = v as Record<string, unknown>;
  if ("es" in o || "en" in o) {
    pairs++;
    for (const l of LANGS) {
      if (typeof o[l] !== "string" || !(o[l] as string).trim()) errors.push(`${path}: missing or empty "${l}"`);
    }
    if (typeof o.es === "string" && typeof o.en === "string" && placeholders(o.es) !== placeholders(o.en)) {
      errors.push(`${path}: placeholders differ (es: {${placeholders(o.es)}} vs en: {${placeholders(o.en)}})`);
    }
    const extra = Object.keys(o).filter((k) => !LANGS.includes(k as (typeof LANGS)[number]));
    if (extra.length) errors.push(`${path}: unexpected keys ${extra.join(", ")}`);
    return;
  }
  for (const [k, child] of Object.entries(o)) walk(child, `${path}.${k}`, seen);
}

walk(UI, "UI");
for (const [name, mod] of [["story", story], ["games", games], ["characters", characters], ["credits", credits]] as const) {
  for (const [k, v] of Object.entries(mod)) walk(v, `${name}.${k}`);
}

// ---- 2 & 3. Source scan -----------------------------------------------------
const TEXT_ATTRS = new Set(["aria-label", "title", "alt", "placeholder"]);
const hasLetters = (s: string) => /\p{L}/u.test(s);
const uiKeys = new Set(Object.keys(UI));

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
}

let scanned = 0;
for (const file of ["app", "components"].flatMap((d) => files(join(ROOT, d)))) {
  scanned++;
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const where = (n: ts.Node) => {
    const { line } = src.getLineAndCharacterOfPosition(n.getStart());
    return `${relative(ROOT, file)}:${line + 1}`;
  };
  const visit = (n: ts.Node) => {
    if (ts.isJsxText(n) && hasLetters(n.text)) {
      errors.push(`${where(n)}: hardcoded JSX text "${n.text.trim()}"`);
    } else if (ts.isJsxExpression(n) && n.expression && ts.isStringLiteralLike(n.expression) && hasLetters(n.expression.text)
      && !ts.isJsxAttribute(n.parent)) {
      errors.push(`${where(n)}: hardcoded string in JSX "${n.expression.text}"`);
    } else if (ts.isJsxAttribute(n) && TEXT_ATTRS.has(n.name.getText(src)) && n.initializer
      && ts.isStringLiteral(n.initializer) && hasLetters(n.initializer.text)) {
      errors.push(`${where(n)}: hardcoded ${n.name.getText(src)}="${n.initializer.text}"`);
    } else if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "t"
      && n.arguments[0] && ts.isStringLiteral(n.arguments[0]) && !uiKeys.has(n.arguments[0].text)) {
      errors.push(`${where(n)}: unknown i18n key "${n.arguments[0].text}"`);
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
}

if (errors.length) {
  console.error(`✗ i18n check failed (${errors.length}):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ i18n OK — ${uiKeys.size} UI keys, ${pairs} es/en pairs, ${scanned} source files scanned.`);
