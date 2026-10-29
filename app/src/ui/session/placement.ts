// Placement: a short adaptive check that picks the learner's starting unit,
// and the seeding that makes "everything before it" known without burying
// them in reviews.
//
// ITEMS. Every item is decided by grammar, never by recognising a name, a
// number or a word that looks like English. A sentence with Bogotá in it can
// be answered by anyone who knows Bogotá is a city; so no item asks about
// meaning. Three kinds, all multiple choice, all built from the unit's own
// bank sentences:
//   form      structured input (exercises/input.ts): two or three Spanish
//             sentences that differ ONLY in one feature (verb ending, ser or
//             estar, gender, number, tense...), and a plain-English question
//             only that feature answers. Every option carries the same names
//             and cognates, so they give nothing away.
//   choose    the verb gapped out of a sentence, its English shown, the right
//             form among minimal-pair forms of the same verb (exercises/ladder).
//   question  the question word gapped (¿___ vives?), the English shown,
//             other question words as the distractors.
// Excluded: any sentence with a digit; any item whose deciding word is
// capitalised mid-sentence (a name or a place) or is a cognate of a word in
// its English (café, hotel, profesor).
//
// THE LADDER. Levels are the units that have at least MIN_ITEMS such items,
// in course order. The check starts in the middle of A1 and is a 2-up/1-down
// staircase: two right in a row at a level moves up one, a wrong answer (or
// "I don't know") moves down one. It asks MAX_ITEMS items (12 to 15), and
// stops early when someone misses four in a row at the bottom level: they are
// starting from zero, and do not need to be told so six more times.
//
// THE RESULT. A level is passed with at least 2 of 3 right (and at least two
// asked). The learner starts at the unit after the highest level passed
// (unit 0 when none is).
//
// SEEDING. Placing at unit k makes the earlier units' nodes known, but not as
// if each had just been learned perfectly (their second and third reviews
// would cluster and the backlog would throttle every session). Cards are
// seeded directly (see applyPlacement) with a stability for how long ago the
// course would have taught them, due dates spread over a window sized to the
// band's warm-up budget.
import { initialPath, type PathState } from '../../compiler';
import { BAND_WARMUP_MINUTES } from '../../compiler/budget';
import type { BankSentence, NodeId } from '../../content/schema';
import { deaccent } from '../../engine';
import { ALL_FEATURES, chooseItem, rng, shuffle, structuredInput } from '../../exercises';
import { LEARNED_STABILITY_DAYS, productivePolicy, type Direction, type Learner } from '../../learner';
import type { Bundle } from '../data/bundle';
import type { Txt } from './cards';

export type ProbeKind = 'form' | 'choose' | 'question';

export interface ProbeItem {
  id: string;
  kind: ProbeKind;
  /** the bank sentence it was built from */
  sentence: string;
  /** index into course.units */
  unit: number;
  ask: string;
  prompt: Txt;
  sub?: Txt;
  options: Txt[];
  answer: number;
}

/** One run of the check: ask `next()`, report with `answer()`, read `result()` when `next()` is undefined. */
export interface Probe {
  readonly max: number;
  readonly asked: number;
  next(): ProbeItem | undefined;
  answer(correct: boolean): void;
  /** the starting unit (index into course.units) */
  result(): number;
}

export interface ProbeSource {
  start(): Probe;
}

export const MAX_ITEMS = 14;
export const MIN_ITEMS = 4;
/** misses in a row at the bottom level that end the check early */
export const EARLY_STOP_MISSES = 4;
export const SEED_RECENT_STABILITY = 10;
export const SEED_STABILITY_PER_UNIT = 7;
export const SEED_MAX_STABILITY = 120;
/** the most recent units whose productive nodes also keep an active receptive card */
export const SEED_FULL_UNITS = 2;
/** share of the band's warm-up minutes the first pass over the seeded cards may take per day */
export const SEED_BUDGET_SHARE = 0.6;
export const SEED_MIN_WINDOW_DAYS = 14;
export const SEED_MAX_WINDOW_DAYS = 120;

const es = (text: string): Txt => ({ text, lang: 'es' });
const en = (text: string): Txt => ({ text, lang: 'en' });

// ---------------------------------------------------------------- what makes an item fair

const words = (s: string) => s.match(/[\p{L}]+/gu) ?? [];

/** Capitalised and not at the start of a sentence: a name or a place. */
function isName(word: string, sentence: string): boolean {
  if (!/^\p{Lu}/u.test(word)) return false;
  const at = sentence.indexOf(word);
  const before = sentence.slice(0, Math.max(0, at)).trim();
  return before !== '' && !/[.?!¿¡]$/.test(before);
}

/** A Spanish word that looks like a word in the English: café ~ coffee is fine, café ~ café is not. */
export function isCognate(word: string, english: string): boolean {
  const w = deaccent(word.toLowerCase());
  if (w.length < 4) return false;
  return words(english).some((e) => {
    const x = e.toLowerCase();
    if (x.length < 4) return false;
    if (x === w || x.startsWith(w.slice(0, Math.max(4, w.length - 1))) || w.startsWith(x.slice(0, Math.max(4, x.length - 1)))) return true;
    return editDistance(x, w) <= (w.length >= 7 ? 2 : 1);
  });
}

function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}

/** The words that tell the options apart (in the right option and not in every other). */
function deciding(options: string[], answer: number): string[] {
  const right = words(options[answer]);
  const others = options.filter((_, i) => i !== answer).map((o) => new Set(words(o).map((w) => w.toLowerCase())));
  return right.filter((w) => others.some((o) => !o.has(w.toLowerCase())));
}

/** Whether nothing but grammar decides the item. */
export function fairItem(it: Pick<ProbeItem, 'options' | 'answer'>, sentence: string, english: string): boolean {
  if (/\d/.test(sentence) || /\d/.test(english)) return false;
  const opts = it.options.map((o) => o.text);
  const key = deciding(opts, it.answer);
  if (!key.length) return false;
  return key.every((w) => !isName(w, opts[it.answer]) && !isCognate(w, english));
}

// ---------------------------------------------------------------- building items

const QUESTION_WORDS: Array<{ es: RegExp; word: string; en: RegExp }> = [
  { es: /^¿\s*Dónde\b/u, word: 'Dónde', en: /^Where\b/ },
  { es: /^¿\s*De dónde\b/u, word: 'De dónde', en: /^Where\b.*\bfrom\b/ },
  { es: /^¿\s*Cuándo\b/u, word: 'Cuándo', en: /^When\b/ },
  { es: /^¿\s*Quién\b/u, word: 'Quién', en: /^Who\b/ },
  { es: /^¿\s*Cómo\b/u, word: 'Cómo', en: /^(How|What)\b/ },
  { es: /^¿\s*Qué\b/u, word: 'Qué', en: /^What\b/ },
  { es: /^¿\s*Cuánto\b/u, word: 'Cuánto', en: /^How much\b/ },
  { es: /^¿\s*Cuántos\b/u, word: 'Cuántos', en: /^How many\b/ },
  { es: /^¿\s*Por qué\b/u, word: 'Por qué', en: /^Why\b/ },
];

function questionItem(s: BankSentence, unit: number, seed: string): ProbeItem | null {
  if (!s.es.startsWith('¿') || s.es.includes('\u2014')) return null;
  const q = QUESTION_WORDS.find((x) => x.es.test(s.es) && x.en.test(s.en));
  if (!q) return null;
  // ¿Qué and ¿Cómo can both be "What" ("¿Cómo te llamas?" = "What's your name?"): keep the other out
  const clash = q.word === 'Qué' ? ['Cómo', 'Cuál'] : q.word === 'Cómo' ? ['Qué'] : q.word === 'Dónde' ? ['De dónde'] : q.word === 'De dónde' ? ['Dónde'] : [];
  const pool = QUESTION_WORDS.map((x) => x.word).filter((w) => w !== q.word && !clash.includes(w));
  const r = rng(`${seed}|${s.id}|qw`);
  const wrong = shuffle(pool, r).slice(0, 2);
  const options = shuffle([q.word, ...wrong], r);
  const gapped = s.es.replace(q.es, '¿___');
  const it: ProbeItem = {
    id: `pl:${s.id}:qw`, kind: 'question', sentence: s.id, unit, ask: 'Which word fills the gap?', prompt: es(gapped), sub: en(s.en),
    options: options.map((o) => es(o.toLowerCase())), answer: options.indexOf(q.word),
  };
  return /\d/.test(s.es) || /\d/.test(s.en) ? null : it;
}

/** Every fair item one sentence can give (one per feature for 'form'). */
export function itemsFor(s: BankSentence, unit: number, seed: string): ProbeItem[] {
  const out: ProbeItem[] = [];
  const r = rng(`${seed}|${s.id}`);
  for (const f of shuffle([...ALL_FEATURES], r)) {
    const it = structuredInput(s, f, { seed });
    if (!it) continue;
    const item: ProbeItem = {
      id: `pl:${it.id}`, kind: 'form', sentence: s.id, unit, ask: 'Read them all, then pick one', prompt: en(it.question),
      options: it.options.map(es), answer: it.answer,
    };
    if (fairItem(item, s.es, s.en)) out.push(item);
  }
  const ch = chooseItem(s, { seed, maxDistractors: 2 });
  if (ch) {
    const item: ProbeItem = {
      id: `pl:${ch.id}`, kind: 'choose', sentence: s.id, unit, ask: 'Which form fits?', prompt: es(ch.gapped), sub: en(`${ch.en}  ${ch.cue}`),
      options: ch.options.map(es), answer: ch.answer,
    };
    if (fairItem(item, s.es, s.en)) out.push(item);
  }
  const qw = questionItem(s, unit, seed);
  if (qw) out.push(qw);
  return out;
}

interface Level { unit: number; items: ProbeItem[] }

/** The ladder's levels: units with enough fair items, in course order, kinds interleaved. */
export function probeLevels(b: Bundle, seed = 'placement'): Level[] {
  const levels: Level[] = [];
  b.course.units.forEach((u, i) => {
    const ids = b.index.byUnit.get(u.id) ?? [];
    const r = rng(`${seed}|${u.id}`);
    const byKind: Record<ProbeKind, ProbeItem[]> = { form: [], choose: [], question: [] };
    const used = new Set<string>();
    /** form items per feature: the rarest feature a sentence offers wins, so it is not all tense */
    const features = new Map<string, number>();
    const featureOf = (it: ProbeItem) => (it.id.split('|')[2] ?? '').split(':')[0];
    for (const id of shuffle([...ids], r)) {
      const s = b.sentences.get(id);
      if (!s) continue;
      const all = itemsFor(s, i, seed);
      const forms = all.filter((x) => x.kind === 'form').sort((x, y) => (features.get(featureOf(x)) ?? 0) - (features.get(featureOf(y)) ?? 0));
      for (const it of [...forms.slice(0, 1), ...all.filter((x) => x.kind !== 'form')]) {
        if (byKind[it.kind].length >= 12 || used.has(s.id)) continue;
        if (it.kind === 'form') {
          const f = featureOf(it);
          if ((features.get(f) ?? 0) >= 4) continue;
          features.set(f, (features.get(f) ?? 0) + 1);
        }
        byKind[it.kind].push(it);
        used.add(s.id);
      }
      if (byKind.form.length >= 12 && byKind.choose.length >= 12 && byKind.question.length >= 6) break;
    }
    // round robin: form, choose, question, form, ...
    const items: ProbeItem[] = [];
    for (let k = 0; items.length < byKind.form.length + byKind.choose.length + byKind.question.length; k++) {
      for (const kind of ['form', 'choose', 'question'] as ProbeKind[]) if (byKind[kind][k]) items.push(byKind[kind][k]);
    }
    if (items.length >= MIN_ITEMS) levels.push({ unit: i, items });
  });
  return levels;
}

/** The adaptive check over these levels. */
export function ladder(levels: Level[], bands: (unit: number) => string | undefined, max = MAX_ITEMS): Probe {
  const a1 = levels.map((l, k) => (bands(l.unit) === 'A1' ? k : -1)).filter((k) => k >= 0);
  let p = a1.length ? a1[Math.floor((a1.length - 1) / 2)] : Math.floor((levels.length - 1) / 2);
  const cursor = levels.map(() => 0);
  const stats = levels.map(() => ({ right: 0, total: 0 }));
  let streak = 0;
  let missesAtBottom = 0;
  let asked = 0;
  let current: { item: ProbeItem; level: number } | undefined;
  let over = !levels.length;
  const take = (k: number) => (cursor[k] < levels[k].items.length ? levels[k].items[cursor[k]++] : undefined);
  return {
    max,
    get asked() { return asked; },
    next() {
      if (over) return undefined;
      if (current) return current.item;
      if (asked >= max) { over = true; return undefined; }
      // this level's next item, or the nearest level that still has one
      for (let d = 0; d < levels.length; d++) {
        for (const k of d ? [p - d, p + d] : [p]) {
          if (k < 0 || k >= levels.length) continue;
          const it = take(k);
          if (it) { current = { item: it, level: k }; return it; }
        }
      }
      over = true;
      return undefined;
    },
    answer(correct: boolean) {
      if (!current) return;
      const k = current.level;
      current = undefined;
      asked++;
      stats[k].total++;
      if (correct) {
        stats[k].right++;
        missesAtBottom = 0;
        streak++;
        if (streak >= 2 && p < levels.length - 1) { p++; streak = 0; }
      } else {
        streak = 0;
        if (p === 0) missesAtBottom++;
        p = Math.max(0, p - 1);
        if (missesAtBottom >= EARLY_STOP_MISSES) over = true;
      }
    },
    result() {
      let best = -1;
      stats.forEach((s, k) => { if (s.total >= 2 && s.right / s.total >= 2 / 3) best = k; });
      return best < 0 ? 0 : levels[best].unit + 1;
    },
  };
}

/** The default check: the course's own bank sentences. */
export function contentProbe(b: Bundle, seed = 'placement'): ProbeSource {
  return {
    start() {
      const levels = probeLevels(b, seed);
      const units = b.course.units.length;
      const inner = ladder(levels, (u) => b.course.units[u]?.band);
      return {
        get max() { return inner.max; },
        get asked() { return inner.asked; },
        next: () => inner.next(),
        answer: (c: boolean) => inner.answer(c),
        result: () => Math.min(units - 1, inner.result()),
      };
    },
  };
}

// ---------------------------------------------------------------- seeding the skipped units

/**
 * Start the learner at `unit`. The skipped units' nodes become known, seeded
 * directly as Review-state cards (no replayed history, which would make every
 * node's second and third reviews cluster):
 *  - stability says how long ago the course would have taught the node: the
 *    most recent unit 10 days, each earlier unit 7 more, capped at 120;
 *  - difficulty is the FSRS default;
 *  - due dates spread evenly over a window of W days, W sized so the first
 *    pass costs at most 60% of the band's warm-up budget per day (W within
 *    14..120), lowest stability first (never before tomorrow);
 *  - beyond the most recent two units only the direction the productive
 *    policy would unlock is kept active (a productive node's receptive card is
 *    seeded suspended); a node seeded as learned (stability >= 60) has its
 *    receptive card suspended and one novel pass, as maintenance would do.
 * Deterministic given the learner and the clock. Returns the path to persist.
 */
export function applyPlacement(learner: Learner, b: Bundle, unit: number, now = Date.now()): PathState {
  const path = initialPath();
  if (unit <= 0) return path;
  path.unit = Math.min(unit, b.course.units.length);
  interface Seed { id: NodeId; productive: boolean; stability: number; recent: boolean }
  const seeds: Seed[] = [];
  const seen = new Set<NodeId>();
  // most recent unit first
  for (let u = path.unit - 1; u >= 0; u--) {
    const k = path.unit - 1 - u;
    const stability = Math.min(SEED_MAX_STABILITY, SEED_RECENT_STABILITY + SEED_STABILITY_PER_UNIT * k);
    for (const d of b.course.units[u].days) {
      for (const n of [...d.focus, ...d.chunks, ...d.lexemes]) {
        if (seen.has(n) || b.node(n)?.kind === 'cando' || learner.isIntroduced(n)) continue;
        seen.add(n);
        const node = b.node(n);
        const productive = productivePolicy({ kind: node?.kind ?? 'lexeme', band: node?.band, freqRank: node?.freqRank });
        seeds.push({ id: n, productive, stability, recent: k < SEED_FULL_UNITS });
      }
    }
  }
  // the cards that will actually come due
  interface Slot { seed: Seed; dir: Direction }
  const slots: Slot[] = [];
  for (const s of seeds) {
    const learned = s.stability >= LEARNED_STABILITY_DAYS;
    if (!s.productive) slots.push({ seed: s, dir: 'receptive' });
    else {
      slots.push({ seed: s, dir: 'productive' });
      if (s.recent && !learned) slots.push({ seed: s, dir: 'receptive' });
    }
  }
  const band = b.course.units[Math.min(path.unit, b.course.units.length - 1)]?.band ?? 'A1';
  const perDayBudget = SEED_BUDGET_SHARE * BAND_WARMUP_MINUTES[band] * 60 / learner.secondsPerReview();
  const window = Math.min(SEED_MAX_WINDOW_DAYS, Math.max(SEED_MIN_WINDOW_DAYS, Math.ceil(slots.length / Math.max(1, perDayBudget))));
  // lowest stability first; ties keep content order
  const order = slots.map((s, i) => ({ s, i })).sort((a, c) => a.s.seed.stability - c.s.seed.stability || a.i - c.i);
  const dueDay = new Map<Slot, number>();
  order.forEach(({ s }, j) => dueDay.set(s, 1 + Math.floor((j * window) / order.length)));
  const dueAt = (s: Slot | undefined): number => now + (s ? dueDay.get(s)! : 1) * 86_400_000;
  const byKey = new Map<string, Slot>();
  for (const s of slots) byKey.set(`${s.seed.id}|${s.dir}`, s);
  for (const s of seeds) {
    const rs = byKey.get(`${s.id}|receptive`);
    const ps = byKey.get(`${s.id}|productive`);
    learner.seedKnown(s.id, {
      at: now, productive: s.productive,
      // a productive node's receptive card is always kept (suspended when it is not part of the load)
      receptive: { stability: s.stability, dueAt: dueAt(rs ?? ps), suspended: !rs },
      productiveCard: s.productive ? { stability: s.stability, dueAt: dueAt(ps) } : null,
    });
  }
  return path;
}
