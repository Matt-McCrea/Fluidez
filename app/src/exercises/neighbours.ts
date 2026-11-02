/* ============================================================================
 * NEIGHBOURS: the wrong options of a choice card.
 *
 * A choice card tests Spanish only when nothing but the Spanish can pick the
 * right option. So a wrong option is a near neighbour of it: the same kind of
 * sentence (a question beside a question), about the same length, the same
 * names in every option (a name in the prompt must not pick the answer), and
 * never another way of saying what the right option says. Chosen from a pool,
 * closest first with the key breaking ties, so a reload shows the same card.
 *
 * Read from real screens: "Me llamo Tomás." with I'm thirty-four / Well, I
 * don't know / My name is Tomás (the only option with the name); "Are you
 * Rosa? (polite)" with "(polite)" on the answer alone; "success | communist"
 * for a noun beside a noun and a verb.
 * ========================================================================== */
import { deaccent } from '../engine';
import { rng } from './rng';
import { ARTICLES, DETERMINERS, PREPOSITIONS, expandContractions } from './spanish';

/** What a choice is made of: one pair, as the bank or a graph node writes it. */
export interface Pair {
  es: string;
  en: string;
  /** other correct Spanish for the English, other correct English for the Spanish (authored, rare) */
  accept?: readonly string[];
  acceptEn?: readonly string[];
}

const plain = (s: string) => deaccent(s.toLowerCase()).replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- tags

const TAG = /\s*\([^()]*\)\s*$/;

/** "Are you Rosa? (polite)" without its tag. A tag says who is spoken to or by; on one option alone it picks it. */
export const stripTag = (en: string): string => en.replace(TAG, '').trim() || en;

/** Does a text end in a tag? A tag on one option alone picks it, so a wrong option has one when the right option has one. */
export const hasTag = (text: string): boolean => TAG.test(text) && stripTag(text) !== text;

// ---------------------------------------------------------------- names

/** Does a sentence start at `at`: the start of the text or a line, or after a full stop, a question or a speaker's label? */
const startsSentence = (src: string, at: number) => /(^|[.?!¿¡…:\n]\s*)$/.test(src.slice(0, at));

const propers = new WeakMap<ReadonlySet<string>, Map<string, string[]>>();

/**
 * The names in a text: words written with a capital that are not just starting a sentence (Tomás, Bogotá, Japan), and
 * words the bank treats as names wherever they stand. Without accents, lower case, in order, once each. A name is the
 * same word in both languages, so it is the one thing a learner can match without knowing any Spanish.
 */
export function properWords(text: string, names: ReadonlySet<string>): string[] {
  let memo = propers.get(names);
  if (!memo) propers.set(names, memo = new Map());
  let out = memo.get(text);
  if (!out) {
    const found = new Set<string>();
    for (const m of text.matchAll(/\p{Lu}[\p{L}]*/gu)) {
      const k = m[0].toLowerCase();
      if (k === 'i' || (!names.has(k) && startsSentence(text, m.index!))) continue;
      found.add(deaccent(k));
    }
    memo.set(text, out = [...found]);
  }
  return out;
}

/** The names a pair shares between its two languages: what the prompt gives away about the right option. */
export function sharedNames(p: Pair, names: ReadonlySet<string>): string[] {
  const es = properWords(p.es, names);
  return properWords(stripTag(p.en), names).filter((w) => es.includes(w));
}

// ---------------------------------------------------------------- what a sentence says

const EN_LITTLE = new Set([
  'the', 'a', 'an', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'so', 'that', 'this', 'these', 'those', 'it', 'its',
  'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'do', 'does', 'did', 'not', 'no', 'yes', 'will', 'would', 'have', 'has', 'had', 'there', 'then', 'please',
  // "My name is Tomás", "I'm called Tomás" and "I'm Tomás" say one thing
  'name', 'called',
]);
const ES_LITTLE = new Set([
  ...ARTICLES, ...DETERMINERS, ...PREPOSITIONS, 'yo', 'tú', 'él', 'ella', 'usted', 'ustedes', 'nosotros', 'nosotras', 'ellos', 'ellas', 'me', 'te', 'se', 'lo', 'le', 'nos', 'les', 'que', 'y', 'o', 'e', 'no', 'sí', 'si', 'pero', 'ya', 'muy',
  'es', 'son', 'soy', 'eres', 'somos', 'está', 'están', 'estoy', 'estás', 'estamos',
  // "Me llamo Tomás", "Mi nombre es Tomás" and "Soy Tomás" say one thing
  'nombre', 'llamo', 'llamas', 'llama', 'llamamos', 'llaman',
]);

/** A word shortened to what it shares with its plural and its simple forms ("coffees" and "coffee"), for comparing meanings, not for showing. */
const stem = (w: string) => (w.length > 3 ? w.replace(/ies$/, 'y').replace(/(?<!s)s$/, '') : w).replace(/(?<=.{3,})(ing|ed)$/, '');

/** Greetings and thanks that are one word said two ways: "Hi." and "Hey!" are both right for Hola. */
const SAME_EN: Readonly<Record<string, string>> = { hi: 'hello', hey: 'hello', goodbye: 'bye', okay: 'ok', alright: 'ok', thanks: 'thank' };

/** The words of a text that carry its meaning: not the little words, not the names. */
export function contentWords(text: string, lang: 'es' | 'en', names: ReadonlySet<string>): Set<string> {
  const little = lang === 'en' ? EN_LITTLE : ES_LITTLE;
  const src = lang === 'en' ? expandContractions(stripTag(text)) : text;
  const out = new Set<string>();
  const proper = new Set(properWords(src, names));
  for (const raw of src.match(/[\p{L}\p{N}']+/gu) ?? []) {
    const lower = raw.toLowerCase().replace(/'s$/, '');
    // the accent tells té from te and él from el, so the little words are matched with it
    if (!lower || little.has(lower) || proper.has(deaccent(lower))) continue;
    out.add(lang === 'en' ? stem(SAME_EN[lower] ?? lower) : deaccent(lower));
  }
  return out;
}

/** What two bits of English say if they say the same: lower case, tag off, contractions open, little articles gone. */
export function meaningKey(en: string): string {
  return plain(expandContractions(stripTag(en))).replace(/\b(the|a|an)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Two sets that are one thing said twice: both bare (nothing but little words and names), one holds the other, or most of them is shared. */
function overlap(a: ReadonlySet<string>, b: ReadonlySet<string>, share: number): boolean {
  if (!a.size || !b.size) return a.size === b.size;
  let both = 0;
  for (const w of a) if (b.has(w)) both++;
  return both === a.size || both === b.size || both / (a.size + b.size - both) >= share;
}

/**
 * Could these two be right for the same prompt? True for the same text, for one authored as an alternative to the other,
 * and for two that differ only by a tag or an article or a word the other holds as well ("My name is Tomás" and "I'm Tomás").
 * `word`: the pair is a word and its gloss, and a gloss lists its senses, so one sense in common is enough (darse and pasar
 * both mean "to happen"). It cannot see two sentences with no word in common that mean the same.
 */
export function sameMeaning(a: Pair, b: Pair, names: ReadonlySet<string>, word = false): boolean {
  if (meaningKey(a.en) === meaningKey(b.en) || plain(a.es) === plain(b.es)) return true;
  const alt = (x: Pair, y: Pair) => !!x.accept?.some((s) => plain(s) === plain(y.es)) || !!x.acceptEn?.some((s) => meaningKey(s) === meaningKey(y.en));
  if (alt(a, b) || alt(b, a)) return true;
  const ea = contentWords(a.en, 'en', names), eb = contentWords(b.en, 'en', names);
  if (word && [...ea].some((w) => eb.has(w))) return true;
  return overlap(ea, eb, 0.5) || overlap(contentWords(a.es, 'es', names), contentWords(b.es, 'es', names), 0.6);
}

/** A question, a dialogue (more than one line) or a statement: a wrong option is never another kind. */
export function shapeOf(text: string): 'q' | 'd' | 's' {
  if (text.split(/\n|\\n/).filter((l) => l.trim()).length > 1) return 'd';
  return /[?¿]/.test(text) ? 'q' : 's';
}

// ---------------------------------------------------------------- the nearest

export interface Near<T> {
  /** the language the options are shown in */
  side: 'es' | 'en';
  n: number;
  /** the same key shows the same card again */
  key: string;
  names: ReadonlySet<string>;
  /** the text each candidate is shown as, apart from the tag (a node's Spanish may be a word with its article) */
  pair: (c: T) => Pair | undefined;
  /** more to add to a candidate's distance (taught long after the right option, another band): 0 is nearest */
  extra?: (c: T) => number;
  /** a candidate that cannot be a wrong option for a reason of its own (another part of speech) */
  allow?: (c: T) => boolean;
  /** the pairs are words and their glosses (see sameMeaning) */
  word?: boolean;
}

/** How far a text may differ in length from the right one: about a quarter, and always a few letters. */
export const lengthRoom = (len: number) => Math.max(5, Math.round(len * 0.25));

/**
 * Up to n candidates that could stand beside `right` as wrong options, nearest first. Nothing that says what `right` says,
 * nothing of another shape, with a tag when `right` has none or none when it has one, with other names in it, or of another
 * length; among those, the closest in length
 * and the least `extra`, with the key breaking ties so the same card is built again.
 */
export function nearest<T>(right: Pair, pool: Iterable<T>, o: Near<T>): T[] {
  const shown = (p: Pair) => (o.side === 'en' ? p.en : p.es);
  const want = shown(right);
  const shape = shapeOf(want);
  const give = sharedNames(right, o.names);
  const named = properWords(want, o.names).length > 0;
  const tagged = hasTag(want);
  const room = lengthRoom(want.length);
  const r = rng(`${o.key}:near`);
  const found: Array<{ c: T; p: Pair; d: number }> = [];
  for (const c of pool) {
    const p = o.pair(c);
    if (!p || (o.allow && !o.allow(c))) continue;
    const text = shown(p);
    const gap = Math.abs(text.length - want.length);
    if (gap > room || text === want || shapeOf(text) !== shape || hasTag(text) !== tagged) continue;
    // the names the prompt gives away are in every option, and an option with a name is not the only one
    const has = properWords(text, o.names);
    if (give.some((w) => !has.includes(w)) || (has.length > 0) !== named) continue;
    found.push({ c, p, d: gap / Math.max(8, want.length) + (o.extra?.(c) ?? 0) + r() * 0.3 });
  }
  found.sort((a, b) => a.d - b.d);
  const out: Array<{ c: T; p: Pair }> = [];
  for (const f of found) {
    // the expensive test last, and only down the ranking until there are enough
    if (sameMeaning(right, f.p, o.names, o.word) || out.some((x) => sameMeaning(x.p, f.p, o.names, o.word))) continue;
    out.push(f);
    if (out.length >= o.n) break;
  }
  return out.map((x) => x.c);
}
