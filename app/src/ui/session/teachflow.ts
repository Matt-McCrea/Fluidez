// Sequencing for the teach block, kept pure so it can be tested without a DOM:
// examples in small groups with a one-tap "spot it" between them, the rule in
// two layers (the trick, then the why), the present card one variant at a time.

export interface Pair { es: string; en: string }

/** Groups of 2 or 3 pairs, in order, none lost (a lone pair stays alone). */
export function exampleGroups<T>(examples: readonly T[]): T[][] {
  const n = examples.length;
  if (n <= 3) return n ? [examples.slice()] : [];
  const g = Math.ceil(n / 3);
  const base = Math.floor(n / g);
  const extra = n % g;
  const out: T[][] = [];
  let at = 0;
  for (let i = 0; i < g; i++) {
    const size = base + (i < extra ? 1 : 0);
    out.push(examples.slice(at, at + size));
    at += size;
  }
  return out;
}

const words = (s: string) => s.match(/\p{L}+/gu) ?? [];
const wc = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** The most words a trick may hold. */
export const TRICK_MAX = 30;

/** The rule's first sentence (or two, if the first is under 8 words) and the rest. trick + rest === rule. */
export function ruleLayers(rule: string): { trick: string; rest: string } {
  // a sentence ends at . ! ? : before a space, or at a line break
  const ends: number[] = [];
  const re = /[.!?:](?=\s)|\n+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rule))) {
    const e = m.index + (m[0].startsWith('\n') ? 0 : 1);
    if (e > 0 && rule.slice(0, e).trim()) ends.push(e);
  }
  let cut = ends[0] ?? rule.length;
  if (wc(rule.slice(0, cut)) < 8 && ends[1] !== undefined) cut = ends[1];
  if (wc(rule.slice(0, cut)) > TRICK_MAX) {
    const first = ends[0] ?? rule.length;
    if (first < cut && wc(rule.slice(0, first)) <= TRICK_MAX) cut = first;
    else {
      // a long sentence: break at the last comma or semicolon inside the limit, else at the limit
      const toks = [...rule.matchAll(/\S+/g)];
      const limit = toks[TRICK_MAX - 1];
      const hard = limit.index! + limit[0].length;
      const soft = Math.max(rule.lastIndexOf(', ', hard), rule.lastIndexOf('; ', hard));
      cut = soft > 0 && wc(rule.slice(0, soft + 1)) >= 8 ? soft + 1 : hard;
    }
  }
  const trick = rule.slice(0, cut);
  const rest = rule.slice(cut);
  return { trick: trick.trim(), rest: rest.trim() ? rest : '' };
}

/** The reading text of a layer: the rest, minus the whitespace it starts with. */
export const restText = (rest: string) => rest.replace(/^\s+/, '');

const SMALL = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'a', 'y', 'e', 'o', 'u', 'en']);
const STOP = new Set([
  ...SMALL, 'del', 'al', 'que', 'me', 'te', 'se', 'lo', 'le', 'les', 'nos', 'no', 'es', 'con', 'por', 'para', 'mi', 'tu', 'su',
  'mis', 'tus', 'sus', 'yo', 'tú', 'él', 'ella', 'muy', 'más', 'pero', 'como', 'qué', 'ya', 'sí', 'hay',
]);

export interface SpotPick { prompt: string; options: string[]; answer: number }

const norm = (w: string) => w.toLowerCase();

/** Tokens of the node's Spanish (its `es` and every form), lowercase, unique. */
export function nodeWords(es?: string, forms?: readonly Pair[]): string[] {
  const seen = new Set<string>();
  for (const t of [es ?? '', ...(forms ?? []).map((f) => f.es)]) for (const w of words(t)) seen.add(norm(w));
  return [...seen];
}

/**
 * "Which word is doing the work here?" The answer is the node's own word that
 * turns up in most of the group's sentences; two other content words from the
 * same sentences are the distractors. Null when the node's word is not in the group.
 */
export function spotIt(group: readonly Pair[], node: readonly string[]): SpotPick | null {
  const per = group.map((p) => new Set(words(p.es).map(norm)));
  const own = new Set(node);
  let answer = '';
  let best = 0;
  for (const w of node) {
    if (w.length < 2 || SMALL.has(w)) continue;
    const n = per.filter((s) => s.has(w)).length;
    if (n > best || (n === best && n > 0 && w.length > answer.length)) { best = n; answer = w; }
  }
  if (!answer) return null;
  const distract: string[] = [];
  for (const p of group) {
    for (const w of words(p.es).map(norm)) {
      if (w.length < 4 || STOP.has(w) || own.has(w) || w === answer || distract.includes(w)) continue;
      distract.push(w);
    }
  }
  if (distract.length < 2) return null;
  // two distractors from different sentences where possible: first and last found
  const two = [distract[0], distract[distract.length - 1]];
  const at = [...answer].reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  const options = [...two];
  options.splice(at, 0, answer);
  return { prompt: 'Which word is doing the work here?', options, answer: at };
}

/** One line of feedback after the pick. */
export const spotFeedback = (pick: SpotPick, chosen: number) =>
  chosen === pick.answer ? `Yes, ${pick.options[pick.answer]}.` : `It's ${pick.options[pick.answer]}.`;

/** The variants of a present card: the first shown large, the rest under "Also". */
export function splitVariants<T>(segs: readonly T[]): { first?: T; also: T[] } {
  return { first: segs[0], also: segs.slice(1) };
}
