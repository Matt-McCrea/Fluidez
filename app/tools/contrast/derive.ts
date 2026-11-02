/* ============================================================================
 * DERIVE THE CONTRAST ITEMS —  npx tsx tools/contrast/derive.ts [--write] [--quiet] [x:node ...]
 *
 * Builds content/contrasts/x_<id>.json for each contrast from what the scripts already hold, with no model:
 *   - the twin sets (two read-and-pick items that share their options and differ in the answer, which
 *     are one sentence said two ways: Lo hice para ti. / Lo hice por ti.), in the contrast's own script and in
 *     the scripts of the nodes it contrasts, wherever their pivot is a pair the contrast's own script draws;
 *   - the pitfalls (a wrong sentence and its right one, one word apart);
 *   - the your-turn gaps ("Choose por or para: Gracias ___ el regalo.");
 *   - the read-and-pick sentences and your-turn translations that have no twin, where exactly one word in
 *     them is one of the contrast's pivot words.
 * An item is one sentence with one place in it and the options for that place, in the exact pair of Spanish
 * and English it came with (src/content/schema.ts ContrastItem). Nothing is written that a script did not say.
 * Without --write it prints the report and changes nothing.
 *
 * The report says, for each contrast, how many items it has, from where, and which are thin against R11 (40
 * items, 150 for the big five): the burn tops those up.
 * ========================================================================== */
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ContrastFile, TeachingScript, type ContrastDecides, type GraphNode, type NodeId } from '../../src/content/schema';
import { hash32 } from '../../src/exercises/rng';
import { tagSentence, type TagOptions } from '../../src/engine/tagger';
import { loadCurriculum } from '../gate/load';
import { BIG, DECIDES, TARGET_ITEMS } from './classes';
import { COMMONER_LIMIT, CUE_LIMIT, score } from './cue';
import { caseLike, keyOf, pivotOf, plain, wordsOf } from './pivot';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The share of a deck one answer may be before "always say that one" stops being chance (the Cue Test's 55%, with a little room). */
export const BALANCE = 0.55;

export interface DeriveCtx {
  graph: ReadonlyMap<NodeId, GraphNode>;
  scripts: ReadonlyMap<NodeId, TeachingScript>;
  /** the English of a Spanish sentence of the bank, by keyOf(es): the pair a script sentence has no English for */
  bankEn: ReadonlyMap<string, string>;
  tag: (es: string) => { requires: NodeId[]; features: Array<{ node: NodeId | null; span: [number, number] }>; tokens: Array<{ text: string; punct: boolean }> };
}

type Origin = 'twin' | 'gap' | 'pitfall' | 'pick' | 'turn';
/** Which origin wins when two items are the same sentence with the same gap. */
const WINS: Record<Origin, number> = { gap: 0, pitfall: 1, twin: 2, pick: 3, turn: 4 };

interface Cand {
  src: string;
  origin: Origin;
  from: NodeId;
  es: string;
  gap: [number, number];
  right: string;
  /** the other options, in the order they were found */
  wrong: string[];
  en?: string;
  why?: string;
  rung: 0 | 1 | 2;
}

export interface DeriveStats {
  contrast: NodeId;
  decides: ContrastDecides;
  items: number;
  /** items by origin, and by whether the contrast's own script or a side's gave them */
  origin: Record<Origin, number>;
  fromSides: number;
  /** left out: no English to pair with the Spanish, no place to put a gap, dropped to keep the deck from favouring one answer */
  noEnglish: number;
  balanced: number;
  /** left out because a cue table of the words beside the gap would have passed them (the Cue Test) */
  pruned: number;
  /** how the side of each item was found: the side whose own script it came from, the word in the gap, the sentence, or the contrast's first side */
  side: { script: number; gap: number; sentence: number; first: number };
  /** Spanish sentences that wanted an English from the bank (the first pass collects them) */
  wantEn: string[];
}

const pairKey = (a: string, b: string) => [a.toLowerCase(), b.toLowerCase()].sort().join('|');

/** The contrast's pivot words: for each single word, the words it is set against and how often. */
class Vocab {
  readonly pairs = new Set<string>();
  private readonly single = new Map<string, Map<string, number>>();
  add(a: string, b: string): void {
    this.pairs.add(pairKey(a, b));
    if (/\s/.test(a) || /\s/.test(b)) return;
    for (const [x, y] of [[a, b], [b, a]]) {
      const m = this.single.get(x.toLowerCase()) ?? new Map<string, number>();
      m.set(y.toLowerCase(), (m.get(y.toLowerCase()) ?? 0) + 1);
      this.single.set(x.toLowerCase(), m);
    }
  }
  get size(): number { return this.pairs.size; }
  /** the word it is most often set against, or undefined if it is not a pivot word */
  partner(word: string): string | undefined {
    const m = this.single.get(word.toLowerCase());
    if (!m) return undefined;
    return [...m].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1))[0][0];
  }
  has(word: string): boolean { return this.single.has(word.toLowerCase()); }
}

/** In `es`, the one word that is a pivot word of the vocabulary and the word it is set against; undefined when there is none or more than one. */
function gapByVocab(es: string, vocab: Vocab): { gap: [number, number]; right: string; wrong: string } | undefined {
  const hits = wordsOf(es).filter((w) => vocab.has(w.norm));
  if (hits.length !== 1) return undefined;
  const w = hits[0];
  const right = es.slice(w.start, w.end);
  const other = vocab.partner(w.norm)!;
  if (other === w.norm) return undefined;
  return { gap: [w.start, w.end], right, wrong: caseLike(other, right) };
}

const english = (s: string): string | undefined => {
  const t = plain(s);
  return /^[A-Z0-9]/.test(t) && !/[¿¡áéíóúñÁÉÍÓÚÑ]/.test(t) && /[a-z]/.test(t) ? t : undefined;
};

/** The English cue of a prompt ("Say to a friend: I made it for you." gives "I made it for you."), or undefined when the prompt gives none. */
function cueOf(prompt: string): string | undefined {
  const paren = prompt.match(/\(([^()]*)\)\s*$/);
  if (paren && /\s/.test(paren[1].trim()) && /[.!?]$/.test(paren[1].trim())) return english(paren[1]);
  const m = prompt.match(/^(?:say(?:\s+to\s+[^:]+)?|translate|type\s+(?:it\s+)?in\s+spanish|in\s+spanish|say\s+it\s+in\s+spanish|ask(?:\s+[^:]+)?|tell\s+[^:]+)\s*:\s*(.+)$/i);
  if (!m || m[1].includes('*')) return undefined;
  return english(m[1].replace(/\s*\([^()]*\)\s*$/, (x) => (/\s/.test(x.trim().slice(1, -1)) ? x : '')));
}

/** The your-turn gap: the sentence with its blank, its starred options if it names any, and the English it carries if any. */
function gapPrompt(prompt: string): { before: string; after: string; options: string[]; en?: string } | undefined {
  const colon = prompt.search(/:\s/);
  const head = colon >= 0 && !prompt.slice(0, colon).includes('___') ? prompt.slice(0, colon) : '';
  const body = head ? prompt.slice(colon + 1).trim() : prompt;
  const at = body.search(/_{2,}/);
  if (at < 0) return undefined;
  const paren = body.match(/\(([^()]*)\)\s*$/);
  const en = paren && /\s/.test(paren[1].trim()) && /[.!?]$/.test(paren[1].trim()) ? english(paren[1]) : undefined;
  const sentence = (paren && (en || !/\s/.test(paren[1].trim())) ? body.slice(0, paren.index) : body).trim();
  const i = sentence.search(/_{2,}/);
  if (i < 0) return undefined;
  const options = [...head.matchAll(/\*([^*]+)\*/g)].map((m) => m[1].trim());
  return { before: sentence.slice(0, i), after: sentence.slice(i).replace(/^_+/, ''), options, ...(en ? { en } : {}) };
}

/** Where `answer` fills the blank of `before ___ after`: the gap in the sentence the answer is, or in the sentence it makes. */
function fillGap(before: string, after: string, answer: string): { es: string; gap: [number, number] } | undefined {
  const wa = wordsOf(answer), wb = wordsOf(before), wf = wordsOf(after);
  const same = (x: { norm: string }[], y: { norm: string }[], from: number) => y.every((w, k) => x[from + k]?.norm === w.norm);
  if (wa.length > wb.length + wf.length && same(wa, wb, 0) && same(wa, wf, wa.length - wf.length)) {
    const mid = wa.slice(wb.length, wa.length - wf.length);
    if (mid.length && mid.length <= 3) return { es: answer, gap: [mid[0].start, mid[mid.length - 1].end] };
  }
  // the answer is only the word that fills the blank
  if (wa.length <= 3 && !/_/.test(answer) && wa.length) {
    const es = `${before}${answer}${after}`;
    return { es, gap: [before.length, before.length + answer.length] };
  }
  return undefined;
}

const rulesOf = (rule: string): Map<string, string> => {
  const out = new Map<string, string>();
  for (const line of rule.split(/\n/)) {
    const m = line.match(/^\*([^*]+)\*\s+(.+)$/);
    if (m && !out.has(keyOf(m[1]))) out.set(keyOf(m[1]), plain(m[2]));
  }
  return out;
};

interface Source { node: NodeId; script: TeachingScript; own: boolean }

/** Every item one script gives, `vocab` being the pivot pairs it is held to (null: the script draws its own). */
function candidatesOf(src: Source, vocab: Vocab | null, learn: Vocab, lookup: (es: string) => string | undefined): Cand[] {
  const { script, node, own } = src;
  const pre = own ? '' : `${node.replace(':', '.')}.`;
  const out: Cand[] = [];
  const keep = (r: string, w: string) => !vocab || vocab.pairs.has(pairKey(r, w));
  const add = (c: Cand, r: string, w: string) => { if (keep(r, w)) { out.push(c); if (!vocab) learn.add(r, w); } };

  // twins: the read-and-pick items that share their options and differ in the answer
  const groups = new Map<string, number[]>();
  script.readAndPick.forEach((q, i) => {
    const k = JSON.stringify([...q.options].sort());
    groups.set(k, [...(groups.get(k) ?? []), i]);
  });
  const twinned = new Set<number>();
  for (const g of groups.values()) {
    for (const i of g) {
      const a = script.readAndPick[i];
      let best: { j: number; p: NonNullable<ReturnType<typeof pivotOf>> } | undefined;
      for (const j of g) {
        const b = script.readAndPick[j];
        if (j === i || b.options[b.answer] === a.options[a.answer]) continue;
        const p = pivotOf(a.es, b.es);
        if (p && (!best || p.size < best.p.size)) best = { j, p };
      }
      if (!best) continue;
      twinned.add(i);
      add({ src: `${pre}rp${i}`, origin: 'twin', from: node, es: a.es, gap: best.p.a, right: best.p.ta, wrong: [best.p.tb], en: plain(a.options[a.answer]), rung: 1 }, best.p.ta, best.p.tb);
    }
  }

  // pitfalls: the wrong sentence is one word from the right one
  script.pitfalls.forEach((p, i) => {
    const pv = pivotOf(p.right, p.wrong);
    if (!pv) return;
    add({ src: `${pre}pf${i}`, origin: 'pitfall', from: node, es: plain(p.right), gap: pv.a, right: pv.ta, wrong: [pv.tb], en: lookup(plain(p.right)), why: plain(p.why), rung: 1 }, pv.ta, pv.tb);
  });

  // your-turn gaps ("Choose por or para: Gracias ___ el regalo.")
  script.yourTurn.forEach((y, i) => {
    const gp = gapPrompt(y.prompt);
    if (!gp) return;
    const f = fillGap(gp.before, gp.after, plain(y.answer));
    if (!f) return;
    const right = f.es.slice(f.gap[0], f.gap[1]);
    let wrong = gp.options.filter((o) => o.toLowerCase() !== right.toLowerCase()).map((o) => caseLike(o, right));
    if (gp.options.length && !gp.options.some((o) => o.toLowerCase() === right.toLowerCase())) wrong = [];
    if (!wrong.length) {
      const single = gapByVocab(f.es, learn);
      if (single && single.right === right) wrong = [single.wrong];
    }
    if (!wrong.length) return;
    add({ src: `${pre}yt${i}`, origin: 'gap', from: node, es: f.es, gap: f.gap, right, wrong, ...(gp.en ? { en: gp.en } : {}), why: plain(y.why), rung: gp.en ? 1 : 2 }, right, wrong[0]);
  });

  // your-turn translations: the one pivot word in the Spanish they ask for
  script.yourTurn.forEach((y, i) => {
    if (gapPrompt(y.prompt)) return;
    const cue = cueOf(y.prompt);
    const v = gapByVocab(plain(y.answer), learn);
    if (cue && v) add({ src: `${pre}yt${i}`, origin: 'turn', from: node, es: plain(y.answer), gap: v.gap, right: v.right, wrong: [v.wrong], en: cue, why: plain(y.why), rung: 1 }, v.right, v.wrong);
  });

  // read-and-pick sentences with no twin: the one pivot word in them
  script.readAndPick.forEach((q, i) => {
    if (twinned.has(i)) return;
    const v = gapByVocab(q.es, learn);
    if (v) add({ src: `${pre}rp${i}`, origin: 'pick', from: node, es: q.es, gap: v.gap, right: v.right, wrong: [v.wrong], en: plain(q.options[q.answer]), rung: 1 }, v.right, v.wrong);
  });
  return out;
}

/** Derive one contrast's file. Pure: the same scripts and bank give the same items, in the same order. */
export function deriveContrast(node: GraphNode, ctx: DeriveCtx, decides: ContrastDecides = DECIDES.get(node.id) ?? 'local'): { file: ContrastFile; stats: DeriveStats } {
  const stats: DeriveStats = {
    contrast: node.id, decides, items: 0, origin: { twin: 0, gap: 0, pitfall: 0, pick: 0, turn: 0 }, fromSides: 0, noEnglish: 0, balanced: 0, pruned: 0,
    side: { script: 0, gap: 0, sentence: 0, first: 0 }, wantEn: [],
  };
  const sides = node.contrasts.length ? node.contrasts : node.requires;
  const own = ctx.scripts.get(node.id);
  const sources: Source[] = [
    ...(own ? [{ node: node.id, script: own, own: true }] : []),
    ...sides.flatMap((s) => (ctx.scripts.get(s) ? [{ node: s, script: ctx.scripts.get(s)!, own: false }] : [])),
  ];
  // the English a script holds for a Spanish sentence, then the bank's
  const held = new Map<string, string>();
  for (const s of sources) {
    for (const e of s.script.examples) if (!held.has(keyOf(e.es))) held.set(keyOf(e.es), plain(e.en));
    for (const q of s.script.readAndPick) if (!held.has(keyOf(q.es))) held.set(keyOf(q.es), plain(q.options[q.answer]));
    for (const y of s.script.yourTurn) { const c = cueOf(y.prompt); if (c && !held.has(keyOf(y.answer))) held.set(keyOf(y.answer), c); }
  }
  const lookup = (es: string) => held.get(keyOf(es)) ?? ctx.bankEn.get(keyOf(es));

  // the contrast's own script draws the pivot pairs; the sides' scripts are held to them
  const learn = new Vocab();
  const cands: Cand[] = [];
  for (const s of sources.filter((x) => x.own)) cands.push(...candidatesOf(s, null, learn, lookup));
  for (const s of sources.filter((x) => !x.own)) cands.push(...candidatesOf(s, learn, learn, lookup));

  // a near-synonym is told apart by retrieving the phrase in a situation (R10): a single pivot word found by the vocabulary in some
  // other sentence (da or dan, de or en) is a decision inside one of the phrases, so a contrast of that class keeps what a person set
  // against each other: the twins, the pitfalls and the gaps. The rest is the burn's to write as phrase cards.
  if (decides === 'synonym') for (let k = cands.length - 1; k >= 0; k--) if (cands[k].origin === 'pick' || cands[k].origin === 'turn') cands.splice(k, 1);

  // the same sentence with the same gap is one item: the sturdier origin keeps it
  const taken = new Map<string, Cand>();
  for (const c of cands) {
    const k = `${c.es}|${c.gap[0]}`;
    const had = taken.get(k);
    if (!had || WINS[c.origin] < WINS[had.origin]) taken.set(k, c);
  }
  // in the order the scripts give them: the contrast's own script first, then each side's
  const place = new Map(cands.map((c, i) => [c, i]));
  let kept = [...taken.values()].sort((a, b) => place.get(a)! - place.get(b)!);

  for (const c of kept) if (!c.en) {
    const e = lookup(c.es);
    if (e) c.en = e; else stats.wantEn.push(c.es);
  }
  const noEn = kept.filter((c) => !c.en);
  stats.noEnglish = noEn.length;
  kept = kept.filter((c) => c.en);

  // a deck of meaning or discourse choices must not favour one answer (the Cue Test's base rate): where one word of a pair is
  // the answer in more than the share allowed, the surplus that no twin holds up is left out
  if (decides === 'meaning' || decides === 'discourse') {
    const byPair = new Map<string, Cand[]>();
    for (const c of kept) byPair.set(pairKey(c.right, c.wrong[0]), [...(byPair.get(pairKey(c.right, c.wrong[0])) ?? []), c]);
    const drop = new Set<Cand>();
    for (const group of byPair.values()) {
      const count = (w: string) => group.filter((c) => !drop.has(c) && c.right.toLowerCase() === w).length;
      const words = [...new Set(group.map((c) => c.right.toLowerCase()))];
      if (words.length !== 2) continue;
      for (;;) {
        const live = group.filter((c) => !drop.has(c)).length;
        const [big] = words.sort((x, y) => count(y) - count(x));
        if (live < 4 || count(big) / live <= BALANCE) break;
        const surplus = group.filter((c) => !drop.has(c) && c.right.toLowerCase() === big && c.origin !== 'twin').sort((a, b) => WINS[b.origin] - WINS[a.origin] || place.get(b)! - place.get(a)!);
        if (!surplus.length) break;
        drop.add(surplus[0]);
      }
    }
    stats.balanced = drop.size;
    kept = kept.filter((c) => !drop.has(c));
  }

  const ownRules = rulesOf(own?.rule ?? '');
  const members = sides.length ? sides : [node.id];
  let built = kept.map((c) => {
    const id = `${node.id}#${c.src}`;
    const options = [c.right, ...c.wrong];
    // the right option stands in a place that does not follow the order the script wrote it in
    const shift = hash32(id) % options.length;
    const rotated = options.map((_, k) => options[(k - shift + options.length) % options.length]);
    const answer = rotated.indexOf(c.right);
    const tagged = ctx.tag(c.es);
    // the side is the node whose word is in the gap; failing that, one whose word is in the sentence; failing that, the first
    const offsets: Array<[number, number]> = [];
    let cursor = 0;
    for (const t of tagged.tokens) { const at = c.es.indexOf(t.text, cursor); offsets.push([at < 0 ? cursor : at, (at < 0 ? cursor : at) + t.text.length]); if (at >= 0) cursor = at + t.text.length; }
    const inGap = (span: [number, number]) => { const a = offsets[span[0]], b = offsets[span[1]]; return !!a && !!b && a[0] < c.gap[1] && b[1] > c.gap[0]; };
    const byGap = members.find((m) => tagged.features.some((f) => f.node === m && inGap(f.span)));
    const bySentence = members.find((m) => tagged.features.some((f) => f.node === m));
    // a sentence written for one of the sides' own lessons is that side's, whatever the tagger can see of it
    const written = c.from !== node.id && members.includes(c.from) ? c.from : undefined;
    const why = c.why || ownRules.get(keyOf(c.es)) || `The English says "${c.en}", so the gap is ${c.right}.`;
    const it = {
      id, node: node.id, side: written ?? byGap ?? bySentence ?? members[0], rung: c.rung, en: c.en!, es: c.es, gap: c.gap, options: rotated, answer, why,
      requires: tagged.requires,
    };
    return { c, it, found: written ? 'script' as const : byGap ? 'gap' as const : bySentence ? 'sentence' as const : 'first' as const };
  });

  // a deck of meaning or earlier text must not be passed by the words beside the gap (the Cue Test, with room to spare):
  // while a cue table would pass it, the item it gets right that no twin holds up and that came last in the script is left out
  if ((decides === 'meaning' || decides === 'discourse') && built.length >= 8) {
    for (;;) {
      const s = score(built.map((b) => b.it));
      if (s.cue <= CUE_LIMIT - 0.05 && s.commoner <= COMMONER_LIMIT - 0.03) break;
      const order = built.map((b, i) => ({ b, i, hit: Math.max(s.byItem.cue[i], s.byItem.commoner[i]) })).filter((x) => x.hit > 0.5)
        .sort((x, y) => Number(x.b.c.origin === 'twin') - Number(y.b.c.origin === 'twin') || WINS[y.b.c.origin] - WINS[x.b.c.origin] || y.i - x.i);
      if (!order.length || built.length <= 4) break;
      built = built.filter((_, i) => i !== order[0].i);
      stats.pruned++;
    }
  }

  for (const { c, found } of built) {
    stats.side[found]++;
    if (c.from !== node.id) stats.fromSides++;
    stats.origin[c.origin]++;
  }
  const items = built.map((b) => b.it);
  stats.items = items.length;
  return { file: { node: node.id, decides, items }, stats };
}

// ------------------------------------------------------------------ the tool

function jsonIn(dir: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort() : [];
}

/** The graph, the scripts and a tagger over the course, from the content on disk. The bank is not read here. */
export function loadContext(appDir = APP, bankEn: ReadonlyMap<string, string> = new Map()): DeriveCtx {
  const content = join(appDir, 'content');
  const files = [...jsonIn(join(content, 'graph')).map((f) => join(content, 'graph', f)), ...jsonIn(join(content, 'units')).map((f) => join(content, 'units', f))];
  // the curriculum wants only the graph and the units; the gate's loader reads them as it reads the rest
  const cur = loadCurriculum(appDir, content, files);
  const scripts = new Map<NodeId, TeachingScript>();
  for (const f of jsonIn(join(content, 'scripts'))) {
    const s = TeachingScript.safeParse(JSON.parse(readFileSync(join(content, 'scripts', f), 'utf8')));
    if (s.success) scripts.set(s.data.node, s.data);
  }
  const opts: TagOptions = cur.tagOpts;
  return { graph: cur.nodes, scripts, bankEn, tag: (es) => tagSentence(es, opts) };
}

/** The English of the bank rows whose Spanish is one of `wanted` (by keyOf): the bank is read file by file and nothing else is kept. */
export function bankEnglish(wanted: ReadonlySet<string>, appDir = APP): Map<string, string> {
  const out = new Map<string, string>();
  const dir = join(appDir, 'content', 'bank');
  for (const f of jsonIn(dir)) {
    for (const row of JSON.parse(readFileSync(join(dir, f), 'utf8')) as Array<{ es: string; en: string }>) {
      const k = keyOf(row.es);
      if (wanted.has(k) && !out.has(k) && !/\n/.test(row.es)) out.set(k, plain(row.en));
    }
  }
  return out;
}

export function deriveAll(appDir = APP): Array<{ file: ContrastFile; stats: DeriveStats }> {
  const first = loadContext(appDir);
  const contrasts = [...first.graph.values()].filter((n) => n.kind === 'contrast').sort((a, b) => (a.id < b.id ? -1 : 1));
  // a first pass says which Spanish still wants an English; the bank is read once for those
  const wanted = new Set<string>();
  for (const n of contrasts) for (const es of deriveContrast(n, first).stats.wantEn) wanted.add(keyOf(es));
  const ctx = wanted.size ? { ...first, bankEn: bankEnglish(wanted, appDir) } : first;
  return contrasts.map((n) => deriveContrast(n, ctx));
}

export function report(results: Array<{ file: ContrastFile; stats: DeriveStats }>): string[] {
  const lines = ['contrast | decides | items (target) | twin gap pitfall pick turn | from sides | no English | left out for balance, for the cue'];
  for (const { stats: s } of results) {
    const o = s.origin;
    lines.push(`${s.contrast} | ${s.decides} | ${s.items}/${TARGET_ITEMS(s.contrast)}${BIG.has(s.contrast) ? ' (big)' : ''} | ${o.twin} ${o.gap} ${o.pitfall} ${o.pick} ${o.turn} | ${s.fromSides} | ${s.noEnglish} | ${s.balanced}, ${s.pruned}`);
  }
  const total = results.reduce((a, r) => a + r.stats.items, 0);
  const thin = results.filter((r) => r.stats.items < TARGET_ITEMS(r.stats.contrast));
  const bare = results.filter((r) => r.stats.items < 6);
  lines.push('', `${results.length} contrasts, ${total} items; ${thin.length} below their R11 start, ${bare.length} with fewer than 6`);
  const by = (d: ContrastDecides) => results.filter((r) => r.stats.decides === d);
  for (const d of ['local', 'meaning', 'discourse', 'synonym'] as const) lines.push(`${d}: ${by(d).length} contrasts, ${by(d).reduce((a, r) => a + r.stats.items, 0)} items`);
  const sd = results.reduce((a, r) => ({ script: a.script + r.stats.side.script, gap: a.gap + r.stats.side.gap, sentence: a.sentence + r.stats.side.sentence, first: a.first + r.stats.side.first }), { script: 0, gap: 0, sentence: 0, first: 0 });
  lines.push(`side: from the side's own script ${sd.script}, by the word in the gap ${sd.gap}, by the sentence ${sd.sentence}, the first side ${sd.first}`);
  return lines;
}

function main(): void {
  const args = process.argv.slice(2);
  const only = args.filter((a) => a.startsWith('x:'));
  let results = deriveAll();
  if (only.length) results = results.filter((r) => only.includes(r.stats.contrast));
  const out = join(APP, 'content', 'contrasts');
  if (args.includes('--write')) {
    mkdirSync(out, { recursive: true });
    for (const { file } of results) {
      const path = join(out, `${file.node.replace(':', '_')}.json`);
      // a contrast with nothing to derive has no file (its review and Train it use its script), and no file left from an earlier run
      if (!file.items.length) { if (existsSync(path)) unlinkSync(path); continue; }
      writeFileSync(path, JSON.stringify(file, null, 2) + '\n');
    }
  }
  if (!args.includes('--quiet')) for (const l of report(results)) console.log(l);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
