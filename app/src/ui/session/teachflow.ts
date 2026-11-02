// Sequencing for the teach block, kept pure so it can be tested without a DOM:
// examples in small groups with a one-tap "spot it" between them, the rule in
// two layers (the trick, then the why), the present card one variant at a time.

import { analyzeToken, COMPOUND_OF_HABER } from '../../engine';
import { analyzeWords } from '../../engine/tagger/words';
import { isName } from './names';
import { tensesOfNode } from './tenses';

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
export const TRICK_MAX = 45;
/** A first paragraph that is a colon list of forms stays whole up to this many words. */
export const TRICK_LIST_MAX = 65;

/**
 * The rule's first paragraph when it is short enough (forms list and all),
 * else its first sentence (or two, if the first is under 8 words) cut inside
 * the limit. Never cut at a colon. trick + rest === rule.
 */
export function ruleLayers(rule: string): { trick: string; rest: string } {
  // the first paragraph; one that ends on a colon takes the paragraph under it
  const breaks = [...rule.matchAll(/\n\s*\n/g)].map((m) => m.index!);
  let paraEnd = breaks.shift() ?? rule.length;
  while (rule.slice(0, paraEnd).trimEnd().endsWith(':') && paraEnd < rule.length) paraEnd = breaks.shift() ?? rule.length;
  const para = rule.slice(0, paraEnd);
  let cut: number;
  if (wc(para) <= (para.includes(':') ? TRICK_LIST_MAX : TRICK_MAX)) cut = paraEnd;
  else {
    const ends: number[] = [];
    const re = /[.!?](?=\s|$)|\n+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(para))) {
      const e = m.index + (m[0].startsWith('\n') ? 0 : 1);
      if (e > 0 && para.slice(0, e).trim() && !para.slice(0, e).trimEnd().endsWith(':')) ends.push(e);
    }
    const toks = [...para.matchAll(/\S+/g)];
    const limit = toks[TRICK_MAX - 1];
    const hard = limit.index! + limit[0].length;
    const fits = ends.filter((e) => e <= hard);
    if (fits.length) {
      // the last whole sentence that fits (this also takes a short first sentence plus the next)
      cut = fits[fits.length - 1];
    } else {
      const soft = Math.max(para.lastIndexOf(', ', hard), para.lastIndexOf('; ', hard));
      cut = soft > 0 && wc(para.slice(0, soft + 1)) >= 8 ? soft + 1 : hard;
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

/**
 * The node's own words as they turn up in its script: the forms' tokens when
 * the node lists forms; else the verb forms the engine reads in the node and
 * its examples (seen twice or more when any are); else, for nodes that are
 * not about a verb (articles, questions), the words shared by two examples.
 * A node that teaches a tense takes the forms of that tense its examples use
 * as verbs (hables, not the quiero in front of it; vivo, not the centro that
 * reads like one), and for a compound tense its haber, when there are any.
 * Names (capitalised everywhere or mid-sentence) are never work words.
 */
export function workWords(node: { id?: string; tags?: readonly string[]; es?: string; forms?: readonly Pair[] }, examples: readonly Pair[]): string[] {
  const taught: readonly string[] = node.id ? tensesOfNode({ id: node.id, tags: node.tags }) : [];
  const isTaught = (t: string, inf: string) => taught.includes(t) || (inf === 'haber' && taught.includes(COMPOUND_OF_HABER[t as keyof typeof COMPOUND_OF_HABER] ?? ''));
  const isProper = (set: Set<string>, tok: string) => set.has(tok) && !STOP.has(tok) && !analyzeToken(tok).some((a) => a.accentExact);
  const texts = [node.es ?? '', ...examples.map((e) => e.es)].filter(Boolean);
  const lowerAll = new Set<string>(); // every occurrence capitalised
  const everLower = new Set<string>();
  const midCap = new Set<string>();
  const count = new Map<string, number>();
  for (const t of texts) {
    for (const raw of words(t)) {
      const w = norm(raw);
      count.set(w, (count.get(w) ?? 0) + 1);
      if (/^\p{Lu}/u.test(raw)) { if (isName(raw, t)) midCap.add(w); } else everLower.add(w);
    }
  }
  for (const w of count.keys()) if (!everLower.has(w)) lowerAll.add(w);
  const proper = (w: string) => midCap.has(w) || isProper(lowerAll, w);
  const cands = [...count.keys()].filter((w) => !proper(w));
  const verbs = cands.filter((w) => !STOP.has(w) && analyzeToken(w).some((a) => a.accentExact));
  if (taught.length) {
    const asVerb = new Set(texts.flatMap((t) => analyzeWords(t).filter((w) => w.pos === 'verb').map((w) => norm(w.w))));
    const readings = (w: string) => analyzeToken(w).filter((a) => a.accentExact);
    // crees is crear's subjunctive on paper, and it is the indicative of creer
    const indicative = (w: string) => taught.includes('presubj') && readings(w).some((a) => a.tense === 'presente');
    const forms = verbs.filter((w) => asVerb.has(w) && !indicative(w) && readings(w).some((a) => isTaught(a.tense, a.inf)));
    if (forms.length) return forms;
  }
  if (node.forms?.length) {
    const seen = new Set<string>();
    for (const f of node.forms) for (const w of words(f.es)) if (!proper(norm(w))) seen.add(norm(w));
    return [...seen];
  }
  if (verbs.length) {
    const twice = verbs.filter((w) => (count.get(w) ?? 0) >= 2);
    return twice.length ? twice : verbs;
  }
  const exampleDocs = new Map<string, number>();
  for (const e of examples) for (const w of new Set(words(e.es).map(norm))) exampleDocs.set(w, (exampleDocs.get(w) ?? 0) + 1);
  return cands.filter((w) => (exampleDocs.get(w) ?? 0) >= 2);
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
  const choose = (skipSmall: boolean) => {
    for (const w of node) {
      if (w.length < 2 || (skipSmall && SMALL.has(w))) continue;
      const n = per.filter((s) => s.has(w)).length;
      if (n > best || (n === best && n > 0 && w.length > answer.length)) { best = n; answer = w; }
    }
  };
  choose(true);
  if (!answer) choose(false);
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
