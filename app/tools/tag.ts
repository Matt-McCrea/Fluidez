/* ============================================================================
 * TAG — print what the feature tagger sees.
 *
 *   npx tsx tools/tag.ts "Quiero que vengas mañana."     one sentence
 *   npx tsx tools/tag.ts content/bank/u03.json             every Spanish string in a content file
 *   npx tsx tools/tag.ts --all-old [--json] [--top N]      the whole old corpus, as a confidence report
 *
 * --all-old reads /Users/Matthew/Fluidez/data/*.js (strand-lessons examples,
 * exponents and contrasts; passages; apply items with the cloze filled by the
 * engine; writing models and answers) and reports how much of it the tagger
 * reads with high confidence, the commonest low-confidence reasons, the
 * feature distribution and what it flags as Peninsular.
 * ========================================================================== */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tagSentence, splitSentences, dialectLint, accentLint } from '../src/engine/tagger';
import { conjugate, PERSONS, IMP_PERSONS, verbByInf } from '../src/engine';
import { extractSpanish } from './gate/extract';
import { loadCurriculum } from './gate/load';
import type { TagOptions } from '../src/engine/tagger';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(APP, '..');

let OPTS: TagOptions = {};
function show(s: string): void {
  const r = tagSentence(s, OPTS);
  console.log(`\n${s}`);
  console.log('  words:   ' + r.tokens.filter((w) => !w.punct).map((w) => `${w.text}/${w.pos}${w.tense ? ':' + w.tense : ''}${w.lemma !== w.w ? '(' + w.lemma + ')' : ''}`).join(' '));
  for (const f of r.features.filter((x) => !x.key.startsWith('lex.'))) {
    console.log(`  ${f.key.padEnd(34)} ${(f.node ?? '-').padEnd(32)} "${f.text}"${f.trigger ? `  trigger: ${f.trigger}` : ''}`);
  }
  console.log('  lexemes: ' + r.features.filter((x) => x.key.startsWith('lex.')).map((x) => x.lemma).join(', '));
  console.log('  requires: ' + r.requires.join(' '));
  console.log(`  confidence: ${r.confidence}${r.lowReasons.length ? ' — ' + r.lowReasons.join('; ') : ''}`);
  for (const d of dialectLint(s, r.tokens)) console.log(`  dialect ${d.severity}: ${d.problem} -> ${d.fix}`);
  for (const a of accentLint(s, r.tokens)) console.log(`  accent ${a.severity}: ${a.problem} -> ${a.fix}`);
}

function loadOld(): Array<{ where: string; text: string }> {
  const g = globalThis as unknown as { window: Record<string, unknown> };
  g.window = {};
  for (const f of ['strand-lessons.js', 'passages.js', 'apply.js', 'writing.js']) (0, eval)(readFileSync(join(ROOT, 'data', f), 'utf8'));
  const W = g.window as Record<string, Array<Record<string, unknown>>>;
  const out: Array<{ where: string; text: string }> = [];
  const push = (where: string, t: unknown) => { if (typeof t === 'string' && t.trim()) for (const s of splitSentences(t.replace(/<[^>]+>/g, ''))) out.push({ where, text: s }); };
  for (const l of W.STRAND_LESSONS ?? []) {
    for (const k of ['examples', 'exponents', 'contrasts'] as const) for (const e of (l[k] as Array<{ es?: string }> | undefined) ?? []) push(`strand:${l.id}:${k}`, e.es);
  }
  for (const p of W.PASSAGES ?? []) push(`passage:${p.id}`, p.text);
  for (const a of W.APPLY_ITEMS ?? []) {
    if (a.type === 'cloze' && typeof a.text === 'string') {
      let fill = '___';
      try {
        const v = verbByInf(String(a.inf));
        const t = String(a.tense);
        const idx = t === 'imperativo' ? IMP_PERSONS.indexOf(a.person as never) : PERSONS.indexOf(a.person as never);
        if (v && idx >= 0) fill = conjugate(v, t as never)[idx];
      } catch { /* leave blank */ }
      push(`apply:cloze`, a.text.replace(/___\s*(\([^)]*\))?/, fill));
    } else { push('apply:transform', a.from); push('apply:transform', a.to); }
  }
  for (const t of W.WRITING_TASKS ?? []) {
    for (const m of (t.models as string[] | undefined) ?? []) push(`writing:${t.id}`, m);
    push(`writing:${t.id}`, t.answer);
  }
  return out;
}

function allOld(json: boolean, top: number): void {
  const t0 = Date.now();
  const items = loadOld();
  const bySource = new Map<string, { n: number; low: number }>();
  const reasons = new Map<string, number>();
  const reasonKinds = new Map<string, number>();
  const feats = new Map<string, number>();
  const nodes = new Map<string, number>();
  const dialect = new Map<string, number>();
  let low = 0, tokens = 0, unknownTok = 0;
  for (const it of items) {
    const r = tagSentence(it.text);
    const src = it.where.split(':')[0];
    const b = bySource.get(src) ?? { n: 0, low: 0 };
    b.n++;
    if (r.confidence === 'low') { b.low++; low++; }
    bySource.set(src, b);
    tokens += r.tokens.filter((w) => !w.punct).length;
    for (const x of r.lowReasons) {
      reasons.set(x, (reasons.get(x) ?? 0) + 1);
      const kind = x.replace(/".*?"/g, '"…"').replace(/\(engine:.*\)/, '(engine: …)');
      reasonKinds.set(kind, (reasonKinds.get(kind) ?? 0) + 1);
      if (x.startsWith('unknown word')) unknownTok++;
    }
    for (const f of r.features) {
      if (f.key.startsWith('lex.')) continue;
      feats.set(f.key, (feats.get(f.key) ?? 0) + 1);
    }
    for (const n of r.requires) if (!n.startsWith('l:')) nodes.set(n, (nodes.get(n) ?? 0) + 1);
    for (const d of dialectLint(it.text, r.tokens)) {
      const k = `${d.severity} ${d.rule}: ${d.word.toLowerCase()}`;
      dialect.set(k, (dialect.get(k) ?? 0) + 1);
    }
  }
  const ms = Date.now() - t0;
  const sort = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  if (json) {
    console.log(JSON.stringify({ sentences: items.length, low, tokens, ms, bySource: Object.fromEntries(bySource), reasonKinds: Object.fromEntries(sort(reasonKinds)), reasons: sort(reasons).slice(0, top), features: Object.fromEntries(sort(feats)), nodes: Object.fromEntries(sort(nodes)), dialect: sort(dialect).slice(0, top) }, null, 1));
    return;
  }
  const pct = (a: number, b: number) => (b ? (100 * a / b).toFixed(1) : '0') + '%';
  console.log(`Tagged ${items.length} sentences (${tokens} words) from the old corpus in ${(ms / 1000).toFixed(1)}s.`);
  console.log(`High confidence: ${items.length - low} (${pct(items.length - low, items.length)}); low: ${low} (${pct(low, items.length)}).`);
  console.log('\nBy source:');
  for (const [k, v] of bySource) console.log(`  ${k.padEnd(10)} ${String(v.n).padStart(6)} sentences, ${pct(v.low, v.n).padStart(6)} low`);
  console.log('\nLow-confidence reasons by kind:');
  for (const [k, v] of sort(reasonKinds).slice(0, 12)) console.log(`  ${String(v).padStart(6)}  ${k}`);
  console.log(`\nTop ${top} low-confidence reasons:`);
  for (const [k, v] of sort(reasons).slice(0, top)) console.log(`  ${String(v).padStart(6)}  ${k}`);
  console.log('\nFeatures (top 60):');
  for (const [k, v] of sort(feats).slice(0, 60)) console.log(`  ${String(v).padStart(6)}  ${k}`);
  console.log(`\nDialect findings (top ${top}):`);
  for (const [k, v] of sort(dialect).slice(0, top)) console.log(`  ${String(v).padStart(6)}  ${k}`);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: npx tsx tools/tag.ts "<sentence>" | <content file> | --all-old [--json] [--top N]');
  process.exit(2);
}
if (args.includes('--all-old')) {
  const ti = args.indexOf('--top');
  allOld(args.includes('--json'), ti >= 0 ? Number(args[ti + 1]) : 30);
} else {
  OPTS = loadCurriculum(APP).tagOpts;
  for (const a of args) {
    const p = resolve(process.cwd(), a);
    if (existsSync(p) && statSync(p).isFile()) {
      const data = JSON.parse(readFileSync(p, 'utf8'));
      for (const s of extractSpanish(p, data)) { console.log(`\n# ${s.path}`); show(s.text); }
    } else show(a);
  }
}
