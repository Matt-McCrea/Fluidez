/* ============================================================================
 * BUILD THE TAGGER'S LEXICON — run once, or whenever the sources change:
 *
 *   npx tsx tools/gate/build-lexicon.ts
 *
 * Writes two data files the tagger imports (so the tagger itself never touches
 * the filesystem and can run anywhere):
 *
 *   src/engine/tagger/data/lexicon.json  lemma -> [pos, gender?]
 *       From the old data/vocab.js (5,820 entries, PCIC-themed). Nouns carry
 *       their article there, which gives POS and gender for free; bare words
 *       are verbs if they look like infinitives, otherwise "x" (an open-class
 *       word whose exact POS we do not know: adjective, adverb, interjection).
 *
 *   src/engine/tagger/data/forms.json    sorted list of known word forms
 *       Every token of vocab.js and of the PCIC's patterns and 11,834 worked
 *       examples (spec/pcic.json). This is the "is it a real word" filter for
 *       the unknown-word check and the accent lint, exactly as the old
 *       tools/lint-spanish.js used it. It is NEVER used to adjudicate accents
 *       (only the engine's own paradigms are) — Spanish is full of minimal
 *       accent pairs that are both correct (hablo/habló, esta/está).
 *
 * When graph lexeme nodes exist, the gate registers them
 * at runtime on top of this (registerLexemes), so this file is a floor, not
 * the authority.
 * ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERBS } from '../../src/engine';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ROOT = resolve(APP, '..');
const OUT = join(APP, 'src', 'engine', 'tagger', 'data');

function loadWindow(files: string[]): Record<string, unknown> {
  const w: Record<string, unknown> = {};
  const g = globalThis as unknown as { window: Record<string, unknown> };
  const prev = g.window;
  g.window = w;
  for (const f of files) (0, eval)(readFileSync(join(ROOT, f), 'utf8'));
  g.window = prev;
  return w;
}

const tok = (s: string) => s.toLowerCase().replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(Boolean);

const W = loadWindow(['data/vocab.js', 'data/idioms.js', 'data/connectors.js']);
const VOCAB = (W.VOCAB ?? []) as Array<{ es: string; en: string; cefr?: string }>;
const IDIOMS = (W.IDIOMS ?? []) as Array<{ es: string }>;
const CONNECTORS = (W.CONNECTORS ?? []) as Array<{ items: Array<{ es: string }> }>;

const VERB_SET = new Set(VERBS.map((v) => v.inf));
type Entry = [string, ...string[]];             // [pos, gender?]
const lex: Record<string, Entry> = {};
const forms = new Set<string>();
const ART: Record<string, [string, string]> = {
  el: ['n', 'm'], la: ['n', 'f'], los: ['n', 'm'], las: ['n', 'f'], un: ['n', 'm'], una: ['n', 'f'],
};

function add(lemma: string, e: Entry): void {
  const cur = lex[lemma];
  if (!cur) { lex[lemma] = e; return; }
  // a word that is both (el/la estudiante) is mf; a noun reading beats "x"
  if (cur[0] === 'n' && e[0] === 'n' && cur[1] !== e[1]) lex[lemma] = ['n', 'mf'];
  else if (cur[0] === 'x' && e[0] !== 'x') lex[lemma] = e;
}

for (const v of VOCAB) {
  const raw = String(v.es || '').trim();
  tok(raw).forEach((w) => forms.add(w));
  // "el hermano / la hermana", "el/la mártir", "alto/a"
  const mf = raw.match(/^(?:el|la)\/(?:el|la)\s+(\S+)$/i);
  if (mf) { add(mf[1].toLowerCase(), ['n', 'mf']); continue; }
  for (let alt of raw.split(/\s*\/\s*/)) {
    alt = alt.replace(/\(.*?\)/g, '').trim();
    if (alt.length < 3) continue;                  // "alto/a": the "a" is a suffix
    const ws = alt.toLowerCase().split(/\s+/).filter(Boolean);
    if (!ws.length) continue;
    if (ws.length === 2 && ART[ws[0]]) {
      const [pos, g] = ART[ws[0]];
      add(ws[1], [pos, g]);
      continue;
    }
    if (ws.length !== 1) continue;                 // phrases: their words are in `forms`
    const w = ws[0].replace(/[^a-záéíóúñü]/g, '');
    if (!w) continue;
    if (VERB_SET.has(w) || /(ar|er|ir|ír)(se)?$/.test(w) && w.length > 4) add(w, ['v']);
    else add(w, ['x']);
  }
}
for (const v of VERBS) add(v.inf, ['v']);
for (const i of IDIOMS) tok(i.es).forEach((w) => forms.add(w));
for (const c of CONNECTORS) for (const i of c.items) tok(i.es).forEach((w) => forms.add(w));

try {
  const pcic = JSON.parse(readFileSync(join(ROOT, 'spec', 'pcic.json'), 'utf8')) as Array<{ pattern?: string; examples?: string[] }>;
  for (const i of pcic) {
    tok(i.pattern ?? '').forEach((w) => forms.add(w));
    for (const e of i.examples ?? []) tok(e).forEach((w) => forms.add(w));
  }
} catch {
  console.error('spec/pcic.json not found — forms.json will be smaller');
}

mkdirSync(OUT, { recursive: true });
const sortedLex = Object.fromEntries(Object.keys(lex).sort().map((k) => [k, lex[k]]));
writeFileSync(join(OUT, 'lexicon.json'), JSON.stringify(sortedLex) + '\n');
writeFileSync(join(OUT, 'forms.json'), JSON.stringify([...forms].sort()) + '\n');
console.log(`lexicon: ${Object.keys(lex).length} lemmas; forms: ${forms.size}`);
