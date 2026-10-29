/* ============================================================================
 * VOCAB / MEASURE — what the lexeme set buys.
 *
 *   npx tsx tools/vocab/measure.ts
 *
 * 1. Coverage: the share of running words in the two frequency corpora
 *    (OpenSubtitles 2018 Spanish, Leipzig Colombian web 2015) that the
 *    cumulative lexeme set covers at the end of each band, all tiers and taught
 *    only. Word forms are credited to lemmas by tools/vocab/lemmatize.ts.
 * 2. Tagger: the old corpus that `tools/tag.ts --all-old` reads, tagged three
 *    ways — as the tagger ships, with lexemes.json registered the way
 *    tools/gate/load.ts registers graph lexemes (by `es`), and registered by
 *    the lemma in the id — counting "unknown word" tokens each time.
 *    tag.ts --all-old itself never loads the graph, so its own numbers do not
 *    move; this script reproduces its corpus (same files, same splitting).
 * Writes tools/vocab/out/measure.json.
 * ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tagSentence, splitSentences, registerLexemes } from '../../src/engine/tagger';
import { conjugate, PERSONS, IMP_PERSONS, verbByInf } from '../../src/engine';
import type { GraphNode } from '../../src/content/schema';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, '..', '..');
const ROOT = resolve(APP, '..');
const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;

const lex = JSON.parse(readFileSync(join(APP, 'content', 'graph', 'lexemes.json'), 'utf8')) as GraphNode[];
const freq = JSON.parse(readFileSync(join(HERE, 'out', 'lemma-freq.json'), 'utf8')) as Array<{ lemma: string; sub: number; web: number }>;
const taughtIds = new Set<string>();
for (const f of Array.from({ length: 60 }, (_, i) => `u${String(i + 1).padStart(2, '0')}`)) {
  const u = JSON.parse(readFileSync(join(APP, 'content', 'units', f + '.json'), 'utf8'));
  for (const d of u.days) for (const l of d.lexemes) taughtIds.add(l);
}

/* ---- 1. coverage ---------------------------------------------------------- */
const lemmaOf = (id: string) => id.replace(/^l:/, '').replace(/#.*/, '');
const fmap = new Map(freq.map((f) => [f.lemma, f]));
function coverage(ids: Iterable<string>): { sub: number; web: number } {
  const lemmas = new Set<string>();
  for (const id of ids) {
    const l = lemmaOf(id);
    // a pronominal verb shares its base's counts: count the base once
    lemmas.add(fmap.has(l) ? l : l.replace(/se$/, ''));
  }
  let sub = 0, web = 0;
  for (const l of lemmas) { const f = fmap.get(l); if (f) { sub += f.sub; web += f.web; } }
  return { sub: sub / 1e4, web: web / 1e4 };   // per million -> percent
}
const cov: Record<string, { cum: number; all: { sub: number; web: number }; taught: { sub: number; web: number }; taughtCount: number; taughtClosed: { sub: number; web: number } }> = {};
for (const b of BANDS) {
  const upto = lex.filter((n) => BANDS.indexOf(n.band as typeof BANDS[number]) <= BANDS.indexOf(b));
  const taught = upto.filter((n) => taughtIds.has(n.id));
  const tc = upto.filter((n) => taughtIds.has(n.id) || (n.note ?? '').startsWith('closed:'));
  cov[b] = { cum: upto.length, all: coverage(upto.map((n) => n.id)), taught: coverage(taught.map((n) => n.id)), taughtCount: taught.length, taughtClosed: coverage(tc.map((n) => n.id)) };
}
// reference: the top-N lemmas of the combined list (all lemmas, names excluded only by the list itself)
const topN = (n: number) => { let s = 0, w = 0; for (const f of freq.slice(0, n)) { s += f.sub; w += f.web; } return { sub: s / 1e4, web: w / 1e4 }; };

/* ---- 2. tagger unknown-word rate on the old corpus --------------------------- */
function loadOld(): string[] {
  const g = globalThis as unknown as { window: Record<string, unknown> };
  g.window = {};
  for (const f of ['strand-lessons.js', 'passages.js', 'apply.js', 'writing.js']) (0, eval)(readFileSync(join(ROOT, 'data', f), 'utf8'));
  const W = g.window as Record<string, Array<Record<string, unknown>>>;
  const out: string[] = [];
  const push = (t: unknown) => { if (typeof t === 'string' && t.trim()) for (const s of splitSentences(t.replace(/<[^>]+>/g, ''))) out.push(s); };
  for (const l of W.STRAND_LESSONS ?? []) for (const k of ['examples', 'exponents', 'contrasts'] as const) for (const e of (l[k] as Array<{ es?: string }> | undefined) ?? []) push(e.es);
  for (const p of W.PASSAGES ?? []) push(p.text);
  for (const a of W.APPLY_ITEMS ?? []) {
    if (a.type === 'cloze' && typeof a.text === 'string') {
      let fill = '___';
      try {
        const v = verbByInf(String(a.inf)); const t = String(a.tense);
        const idx = t === 'imperativo' ? IMP_PERSONS.indexOf(a.person as never) : PERSONS.indexOf(a.person as never);
        if (v && idx >= 0) fill = conjugate(v, t as never)[idx];
      } catch { /* leave blank */ }
      push(a.text.replace(/___\s*(\([^)]*\))?/, fill));
    } else { push(a.from); push(a.to); }
  }
  for (const t of W.WRITING_TASKS ?? []) { for (const m of (t.models as string[] | undefined) ?? []) push(m); push(t.answer); }
  return out;
}
function unknownRate(sents: string[]): { tokens: number; unknown: number; lowSentences: number; top: Array<[string, number]> } {
  let tokens = 0, unknown = 0, low = 0;
  const m = new Map<string, number>();
  for (const s of sents) {
    const r = tagSentence(s);
    tokens += r.tokens.filter((w) => !w.punct).length;
    if (r.confidence === 'low') low++;
    for (const x of r.lowReasons) if (x.startsWith('unknown word')) { unknown++; const w = x.match(/"(.*)"/)?.[1] ?? x; m.set(w, (m.get(w) ?? 0) + 1); }
  }
  return { tokens, unknown, lowSentences: low, top: [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25) };
}
const sents = loadOld();
const before = unknownRate(sents);
// as tools/gate/load.ts does it: lemma = n.es (nouns carry their article, so they are skipped)
registerLexemes(lex.map((n) => ({ lemma: n.es ?? lemmaOf(n.id), pos: n.pos, gender: n.gender })));
const asGate = unknownRate(sents);
// by the id's lemma (what the gate would get if load.ts preferred the id)
registerLexemes(lex.map((n) => ({ lemma: lemmaOf(n.id), pos: n.pos, gender: n.gender })));
const byId = unknownRate(sents);

const out = { coverage: cov, topN: { 1000: topN(1000), 2000: topN(2000), 3000: topN(3000), 5000: topN(5000) }, tagger: { sentences: sents.length, before, asGate, byId } };
writeFileSync(join(HERE, 'out', 'measure.json'), JSON.stringify(out, null, 1));
const pct = (a: number, b: number) => (100 * a / b).toFixed(2) + '%';
console.log('coverage (all tiers / taught only), subtitles | Colombian web:');
for (const b of BANDS) { const c = cov[b]; console.log(`  ${b} cum ${c.cum}: ${c.all.sub.toFixed(1)}% | ${c.all.web.toFixed(1)}%   taught ${c.taughtCount}: ${c.taught.sub.toFixed(1)}% | ${c.taught.web.toFixed(1)}%   taught+closed: ${c.taughtClosed.sub.toFixed(1)}% | ${c.taughtClosed.web.toFixed(1)}%`); }
for (const [n, c] of Object.entries(out.topN)) console.log(`  reference: top ${n} lemmas of the combined list ${c.sub.toFixed(1)}% | ${c.web.toFixed(1)}%`);
console.log(`tagger, ${sents.length} sentences, ${before.tokens} words: unknown-word tokens ${before.unknown} (${pct(before.unknown, before.tokens)}), low sentences ${before.lowSentences}`);
console.log(`  + lexemes.json registered as the gate does (by es): ${asGate.unknown} (${pct(asGate.unknown, asGate.tokens)}), low ${asGate.lowSentences}`);
console.log(`  + registered by id lemma: ${byId.unknown} (${pct(byId.unknown, byId.tokens)}), low ${byId.lowSentences}`);
