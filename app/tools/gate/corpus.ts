/* ============================================================================
 * Corpus-wide checks: near-duplicates, template-frame overuse, supply.
 *
 * NEAR-DUPLICATES (the old app's worst problem was repetition). Every bank
 * sentence, story sentence and scene line is normalised (lowercase, no
 * accents, no punctuation) and shingled into token 4-grams; pairs are found
 * through an inverted index (shingles shared by more than CAP items are too
 * common to be evidence, and are left to the frame check) and scored by
 * Jaccard. Exact duplicates (same token string, 3+ tokens) are always
 * errors. A pair is reported only if at least one side is in the files
 * being gated, but it is compared against the WHOLE corpus.
 *
 * Thresholds (tuned on the 6,000 sentences of the old passages, where a
 * Jaccard of 0.5 on 4-grams is "same sentence, one phrase swapped" and 0.35
 * is "same frame, different content"): >= 0.6 error, >= 0.45 warning.
 *
 * TEMPLATE FRAMES (ported from tools/variety.js): the gates can see that
 * content is correct but not that 81 passages are the same passage. Per
 * unit, a frame (a fixed list, plus any 2-word opener) in more than a
 * quarter of the unit's bank sentences or chapters is reported.
 * ========================================================================== */
import { deaccent } from '../../src/engine';
import { splitSentences } from '../../src/engine/tagger';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BankSentence, Scene, StoryChapter, Unit, WritingTask } from '../../src/content/schema';
import { clip, type Finding } from './findings';
import type { Loaded } from './load';

export const DUP_ERROR = 0.6;
export const DUP_WARN = 0.45;
const CAP = 200;
const MIN_TOKENS = 5;

interface Item { file: string; path: string; text: string; toks: string[]; unit?: string; kind: string }

export const normTokens = (s: string) => deaccent(s.toLowerCase()).replace(/[^a-zñü0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
function shingles(toks: string[], n = 4): Set<string> {
  const out = new Set<string>();
  if (toks.length < n) { out.add(toks.join(' ')); return out; }
  for (let i = 0; i + n <= toks.length; i++) out.add(toks.slice(i, i + n).join(' '));
  return out;
}
export function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

export function collectItems(files: Loaded[]): Item[] {
  const items: Item[] = [];
  for (const f of files) {
    if (!f.ok) continue;
    if (f.kind === 'bank') (f.data as BankSentence[]).forEach((b, i) => items.push({ file: f.rel, path: `[${i}].es`, text: b.es, toks: normTokens(b.es), unit: b.unit, kind: 'bank' }));
    if (f.kind === 'story') {
      const c = f.data as StoryChapter;
      splitSentences(c.text).forEach((s, i) => items.push({ file: f.rel, path: `text#${i + 1}`, text: s, toks: normTokens(s), unit: c.unit, kind: 'story' }));
    }
    if (f.kind === 'scene') {
      const sc = f.data as Scene;
      sc.turns.forEach((t, i) => items.push({ file: f.rel, path: `turns[${i}].npc`, text: t.npc, toks: normTokens(t.npc), unit: sc.unit, kind: 'scene' }));
    }
  }
  return items;
}

/** A running catchphrase: the same short line of dialogue in two story chapters
 *  ("Simón: ¡Chao, chao!"). Story lines of ≤ 6 tokens (speaker included) are exempt
 *  from cross-chapter duplicate checks; bank, scene and story-vs-bank stay strict. */
export const CATCHPHRASE_MAX = 6;
const catchphrase = (a: Item, b: Item) => a.kind === 'story' && b.kind === 'story' && a.toks.length <= CATCHPHRASE_MAX && b.toks.length <= CATCHPHRASE_MAX;

export function nearDuplicates(items: Item[], targets: Set<string>, findings: Finding[]): void {
  // exact duplicates
  const exact = new Map<string, Item[]>();
  for (const it of items) {
    if (it.toks.length < 3) continue;
    const k = it.toks.join(' ');
    const l = exact.get(k); if (l) l.push(it); else exact.set(k, [it]);
  }
  const reported = new Set<string>();
  for (const group of exact.values()) {
    if (group.length < 2) continue;
    for (let i = 1; i < group.length; i++) {
      const a = group[0], b = group[i];
      if (a.file === b.file && a.kind === 'story') continue;
      if (catchphrase(a, b)) continue;
      if (!targets.has(a.file) && !targets.has(b.file)) continue;
      const [x, y] = targets.has(b.file) ? [b, a] : [a, b];
      reported.add(`${a.file}:${a.path}|${b.file}:${b.path}`);
      findings.push({ severity: 'error', check: 'dupe', file: x.file, path: x.path, problem: `exact duplicate of ${y.file}:${y.path} "${clip(y.text, 50)}"`, fix: 'write a new sentence; every cue must be new to the learner' });
    }
  }
  // near duplicates through an inverted index
  const sh = items.map((it) => (it.toks.length >= MIN_TOKENS ? shingles(it.toks) : new Set<string>()));
  const index = new Map<string, number[]>();
  sh.forEach((s, i) => { for (const g of s) { const l = index.get(g); if (l) l.push(i); else index.set(g, [i]); } });
  const isTarget = items.map((it) => targets.has(it.file));
  for (let i = 0; i < items.length; i++) {
    if (!sh[i].size) continue;
    const cands = new Map<number, number>();
    for (const g of sh[i]) {
      const l = index.get(g)!;
      if (l.length > CAP) continue;
      for (const j of l) if (j > i) cands.set(j, (cands.get(j) ?? 0) + 1);
    }
    for (const [j] of cands) {
      if (!isTarget[i] && !isTarget[j]) continue;
      const a = items[i], b = items[j];
      if (a.file === b.file && a.kind === 'story') continue;
      if (catchphrase(a, b)) continue;
      if (a.toks.join(' ') === b.toks.join(' ')) continue;   // exact: reported above
      const J = jaccard(sh[i], sh[j]);
      if (J < DUP_WARN) continue;
      const [x, y] = isTarget[j] ? [b, a] : [a, b];
      findings.push({
        severity: J >= DUP_ERROR ? 'error' : 'warning', check: 'dupe', file: x.file, path: x.path,
        problem: `near-duplicate (${J.toFixed(2)}) of ${y.file}:${y.path}: "${clip(x.text, 45)}" ~ "${clip(y.text, 45)}"`,
        fix: 'change the situation and the sentence frame, not one word',
      });
    }
  }
}

/* ---- frames ------------------------------------------------------------------- */
export const FRAMES: Array<[string, RegExp]> = [
  ['antes de', /\bantes de\b/], ['al principio', /\bal principio\b/], ['dudaba(n) que', /\bdudaba[n]? que\b/],
  ['espera(n) que', /\bespera[n]? que\b/], ['es ADJ que', /\bes (increible|maravilloso|evidente|una pena|normal|logico|natural|curioso|sorprendente|fantastico|estupendo|raro|triste|importante|necesario|posible) que\b/],
  ['para cuando', /\bpara cuando\b/], ['desde que', /\bdesde que\b/], ['lo que mas', /\blo que mas\b/], ['cada vez que', /\bcada vez que\b/],
  ['me gusta(n)', /\bme gustan?\b/], ['mi hermano/a', /\bmi herman[oa]\b/], ['todos los dias', /\btodos los dias\b/],
  ['de repente', /\bde repente\b/], ['por eso', /\bpor eso\b/], ['sin embargo', /\bsin embargo\b/], ['tengo que', /\btengo que\b/],
  ['voy a', /\bvoy a\b/], ['quiero que', /\bquiero que\b/], ['ojala', /\bojala\b/], ['si tuviera', /\bsi tuviera\b/],
];
const FRAME_SHARE = 0.25;
const MIN_UNIT_ITEMS = 12;

export function frameOveruse(items: Item[], units: Set<string>, findings: Finding[], strict: boolean): void {
  const byUnit = new Map<string, Item[]>();
  for (const it of items) if (it.unit && it.kind === 'bank') { const l = byUnit.get(it.unit); if (l) l.push(it); else byUnit.set(it.unit, [it]); }
  for (const [u, list] of byUnit) {
    if (!units.has(u) || list.length < MIN_UNIT_ITEMS) continue;
    const texts = list.map((x) => x.toks.join(' '));
    for (const [name, re] of FRAMES) {
      const n = texts.filter((t) => re.test(t)).length;
      if (n / list.length > FRAME_SHARE) findings.push({ severity: strict ? 'error' : 'warning', check: 'frames', file: list[0].file, problem: `unit ${u}: frame "${name}" in ${n}/${list.length} bank sentences (>${FRAME_SHARE * 100}%)`, fix: 'vary the sentence architecture, not just the nouns' });
    }
    const openers = new Map<string, number>();
    for (const it of list) if (it.toks.length >= 3) { const k = it.toks.slice(0, 2).join(' '); openers.set(k, (openers.get(k) ?? 0) + 1); }
    for (const [k, n] of openers) if (n / list.length > FRAME_SHARE) findings.push({ severity: strict ? 'error' : 'warning', check: 'frames', file: list[0].file, problem: `unit ${u}: ${n}/${list.length} bank sentences open with "${k} …"`, fix: 'vary how sentences start' });
  }
}

/* ---- supply ------------------------------------------------------------------- */
export interface UnitQuota { bankSentences?: number; chapters?: number; scenes?: number; writingTasks?: number; p95Demand?: { sentences?: number } }
/** content/_reports/quotas.json: the one source of per-unit supply targets (simulator-derived, factor 3, p95). */
export function loadQuotas(contentDir: string): Record<string, UnitQuota> {
  const p = join(contentDir, '_reports', 'quotas.json');
  if (!existsSync(p)) return {};
  try { return (JSON.parse(readFileSync(p, 'utf8')).units ?? {}) as Record<string, UnitQuota>; } catch { return {}; }
}
/** What the gate holds a unit to: the first-pass bank target (1.15 x p95 demand, as the burn writes it; the long-run
 *  factor-3 figure when no demand is recorded) and the quota counts of the other kinds. */
function targetFor(q: UnitQuota) {
  const p95 = q.p95Demand?.sentences;
  return {
    bankSentences: p95 ? Math.ceil(1.15 * p95) : q.bankSentences ?? 0,
    chapters: q.chapters ?? 0, scenes: q.scenes ?? 0, writingTasks: q.writingTasks ?? 0,
  };
}

export function supply(files: Loaded[], units: Unit[], quotas: Record<string, UnitQuota>, only: Set<string> | null, findings: Finding[], strict: boolean, complete: Set<string>): string[] {
  const count = (pred: (f: Loaded) => number) => files.filter((f) => f.ok).reduce((a, f) => a + pred(f), 0);
  const report: string[] = [];
  for (const u of units) {
    if (only && !only.has(u.id)) continue;
    const have = {
      bankSentences: count((f) => (f.kind === 'bank' ? (f.data as BankSentence[]).filter((b) => b.unit === u.id).length : 0)),
      chapters: count((f) => (f.kind === 'story' && (f.data as StoryChapter).unit === u.id ? 1 : 0)),
      scenes: count((f) => (f.kind === 'scene' && (f.data as Scene).unit === u.id ? 1 : 0)),
      writingTasks: count((f) => (f.kind === 'writing' ? (f.data as WritingTask[]).filter((w) => w.unit === u.id).length : 0)),
    };
    if (!quotas[u.id]) continue;
    const want = targetFor(quotas[u.id]);
    const short = (Object.keys(have) as Array<keyof typeof have>).filter((k) => have[k] < want[k]);
    report.push(`${u.id} ${u.band}: bank ${have.bankSentences}/${want.bankSentences} · chapters ${have.chapters}/${want.chapters} · scenes ${have.scenes}/${want.scenes} · writing ${have.writingTasks}/${want.writingTasks}${short.length ? '  SHORT' : ''}`);
    if (short.length) {
      const hard = strict || complete.has(u.band);
      findings.push({ severity: hard ? 'error' : 'warning', check: 'supply', file: `content/units/${u.id}.json`, problem: `below quota: ${short.map((k) => `${k} ${have[k]}/${want[k]}`).join(', ')}`, fix: hard ? 'generate the missing content before the band is marked complete' : 'expected while the band is still being generated' });
    }
  }
  return report;
}
