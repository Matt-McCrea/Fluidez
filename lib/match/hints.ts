/* ============================================================================
 * WHERE IS THE MISTAKE? One plain-English hint, from the first difference
 * between the learner's answer and the closest accepted answer.
 *
 * The hint names the KIND of mistake and never gives the answer away: "Check
 * the verb ending: who is doing it?", not "it's comemos". The learner gets
 * one self-correction attempt with it (attempt.ts) before the answer shows.
 *
 * A hint says only what the difference proves. Two forms of one verb are
 * named for how they differ (who, when, mood, aspect, the dictionary form), a
 * swap inside a closed set is named for the set (ser or estar, por or para,
 * an article), and a difference that is none of those is located, not
 * explained: a word is "extra" or "missing" only when that is the whole
 * difference, and no word is ever "not the word here".
 * ========================================================================== */
import { analyzeToken, deaccent, TENSES } from '../engine';
import type { TenseKey } from '../engine';
import { isKnownForm } from './support/lexicon';
import {
  ARTICLES, CLITICS, DEMONSTRATIVES, EXPERIENCER, gerundOf, isInfinitive, nounGender, participleOf, POSSESSIVES, PREPOSITIONS,
} from './support/spanish';

export type HintKind =
  | 'accents' | 'verb-ending' | 'article' | 'agreement' | 'word-order' | 'missing-word' | 'extra-word'
  | 'pronoun' | 'subject' | 'ser-estar' | 'por-para' | 'spelling' | 'attach' | 'wrong-word' | 'empty' | 'fragment'
  | 'experiencer' | 'experiencer-agree' | 'mood' | 'aspect' | 'nonfinite' | 'contraction' | 'number' | 'differs' | 'pitfall';
/** What a gap with one typed word can say: the sentence kinds, plus who and when on their own. */
export type GapKind = HintKind | 'person' | 'tense';

export interface Diagnosis { kind: HintKind; hint: string; at: number }

export const HINT_TEXT = {
  accents: 'Check the accents.',
  'verb-ending': 'Check the verb ending.',
  agreement: 'Check the ending: it has to agree (masculine or feminine, one or more).',
  'word-order': 'Right words, different order: check where each one goes.',
  'missing-word': 'A word is missing.',
  pronoun: 'Check the pronoun (lo, la, le…): who or what does it stand for?',
  subject: 'Check the subject: who is it about?',
  'ser-estar': 'Ser or estar? Think again about which one fits.',
  'por-para': 'Por or para? Check that little word.',
  spelling: 'Check the spelling.',
  attach: 'In a command, the pronoun joins the end of the verb.',
  empty: 'Type your answer in Spanish.',
  fragment: "That's not the whole sentence yet. Say all of it.",
  experiencer: 'With verbs like gustar, the little word (me, te, le) already says who it is for. Leave the pronoun out, or start it with "a".',
  'experiencer-agree': 'With gustar, the verb agrees with the thing you like: one or more than one?',
  mood: "Right verb. Is someone saying it's so, or is it only held up as an idea?",
  aspect: 'Both are in the past. Was it going on, or did it happen?',
  contraction: '"A el" and "de el" join into one word in Spanish.',
  number: 'Check the number against the English.',
} as const;

/** The same verb in a shape the spot does not take. */
export const NONFINITE_TEXT = {
  'to-inf': 'Right verb, but this spot wants its dictionary form.',
  'to-finite': 'Right verb, but here it needs an ending that says who is doing it.',
  'to-ger': 'Right verb, but this spot wants the -ando or -iendo form.',
  'to-part': 'Right verb, but this spot wants the -ado or -ido form.',
} as const;

const GERUND_ESTAR = 'A verb ending in -ando or -iendo goes with estar, not ser.';
const wrongWord = (a: string) => `We had a different word where you wrote "${a}".`;
const lookAgain = (a: string) => `Look again at "${a}" and the words around it.`;

const SMALL = new Set([...ARTICLES, ...PREPOSITIONS, ...CLITICS, 'que', 'no', 'y', 'o', 'se']);

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[m][n];
}

export type Op = { op: 'eq' | 'sub' | 'ins' | 'del'; a?: string; b?: string; i: number; j: number };

/** Token alignment, input (a) against expected (b). Accent-only pairs cost
 *  almost nothing, so they align with each other. */
export function align(a: readonly string[], b: readonly string[]): Op[] {
  const m = a.length, n = b.length;
  const cost = (x: string, y: string) => (x === y ? 0 : deaccent(x) === deaccent(y) ? 0.1 : 1);
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost(a[i - 1], b[j - 1]));
  }
  const ops: Op[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + cost(a[i - 1], b[j - 1])) {
      ops.push({ op: a[i - 1] === b[j - 1] ? 'eq' : 'sub', a: a[i - 1], b: b[j - 1], i: i - 1, j: j - 1 }); i--; j--;
    } else if (j > 0 && d[i][j] === d[i][j - 1] + 1) {
      ops.push({ op: 'del', b: b[j - 1], i, j: j - 1 }); j--;
    } else {
      ops.push({ op: 'ins', a: a[i - 1], i: i - 1, j }); i--;
    }
  }
  return ops.reverse();
}

export function distance(a: readonly string[], b: readonly string[]): number {
  return align(a, b).reduce((s, o) => s + (o.op === 'eq' ? 0 : o.op === 'sub' && deaccent(o.a!) === deaccent(o.b!) ? 0.1 : 1), 0);
}

const readings = (w: string) => analyzeToken(w).filter((a) => !a.clitics);
const GENDER_WORD = { m: 'masculine', f: 'feminine' } as const;
const stem = (w: string) => deaccent(w).replace(/(os|as|es|o|a|e|s)$/, '');
const lemma = (inf: string) => inf.replace(/se$/, '');

// ---- one verb, two shapes ------------------------------------------------------------

const GROUP = new Map(TENSES.map((t) => [t.key, t.group]));
const BASE = new Map(TENSES.map((t) => [t.key, t.variantOf ?? t.key]));

interface Form { lemma: string; kind: 'finite' | 'inf' | 'ger' | 'part'; tense?: TenseKey; person?: string }

/** Every way a token reads as a form of a verb the course teaches. */
function formsOf(w: string): Form[] {
  // a form with its accents as written is that form: llegué is the preterite, not also the "llegue" it would be without the accent
  const written = readings(w).filter((a) => a.accentExact);
  // a command is read as one only when nothing else fits: llueve is not also "llueva, usted"
  const all = (written.length ? written : readings(w)).filter((a) => a.target !== false);
  const plain = all.filter((a) => a.tense !== 'imperativo' && a.tense !== 'impneg');
  const out: Form[] = (plain.length ? plain : all).map((a) => ({ lemma: lemma(a.inf), kind: 'finite', tense: a.tense, person: a.person }));
  if (isInfinitive(w)) out.push({ lemma: lemma(w), kind: 'inf' });
  const g = gerundOf(w);
  if (g) out.push({ lemma: lemma(g), kind: 'ger' });
  const p = participleOf(w);
  if (p) out.push({ lemma: lemma(p), kind: 'part' });
  return out;
}

type VerbDiff = 'person' | 'agree' | 'tense' | 'ending' | 'mood' | 'aspect' | 'to-inf' | 'to-finite' | 'to-ger' | 'to-part';
const AGREE_VERBS = new Set([...EXPERIENCER].filter((v) => v !== 'quedar'));
const SHAPE_TO = { finite: 'to-finite', inf: 'to-inf', ger: 'to-ger', part: 'to-part' } as const;
const THIRD = new Set(['él/ella', 'ellos']);

/** How two tenses of one person differ. */
function tenseDiff(a: TenseKey, b: TenseKey): 'mood' | 'aspect' | 'tense' | 'ending' {
  const ga = GROUP.get(a), gb = GROUP.get(b);
  if (BASE.get(a) === BASE.get(b) || ga === 'imperative' || gb === 'imperative') return 'ending';
  if ((ga === 'subjunctive') !== (gb === 'subjunctive')) return 'mood';
  if ((a === 'preterito' && b === 'imperfecto') || (a === 'imperfecto' && b === 'preterito')) return 'aspect';
  return 'tense';
}

/** How the typed token differs from the wanted one when both are the same verb. */
function verbDiff(typed: string, want: string): VerbDiff | null {
  const ta = formsOf(typed), tb = formsOf(want);
  const pairs = tb.flatMap((x) => ta.filter((y) => y.lemma === x.lemma).map((y) => [y, x] as const));
  const fin = pairs.filter(([y, x]) => y.kind === 'finite' && x.kind === 'finite');
  if (fin.length) {
    const who = fin.filter(([y, x]) => y.tense === x.tense && y.person !== x.person);
    // "agree" is one thing liked or more than one; me parezco and me parece are who
    if (who.length) return who.some(([y, x]) => AGREE_VERBS.has(x.lemma) && THIRD.has(y.person!) && THIRD.has(x.person!)) ? 'agree' : 'person';
    const kinds = fin.filter(([y, x]) => y.person === x.person).map(([y, x]) => tenseDiff(y.tense!, x.tense!));
    return (['mood', 'aspect', 'tense'] as const).find((k) => kinds.includes(k)) ?? 'ending';
  }
  const shape = pairs.find(([y, x]) => y.kind !== x.kind);
  return shape ? SHAPE_TO[shape[1].kind] : null;
}

const copula = (w: string) => {
  const r = readings(w);
  return r.some((x) => x.inf === 'ser') ? 'ser' : r.some((x) => x.inf === 'estar') ? 'estar' : null;
};

const DEFINITE = new Set(['el', 'la', 'los', 'las']);

function articleHint(a: string, b: string, noun: string | undefined): string {
  if (DEFINITE.has(a) !== DEFINITE.has(b)) return 'Check the article: "the" (el, la) or "a" (un, una)?';
  const ga = nounGender('x', a), gb = nounGender('x', b);
  const gender = !!ga && !!gb && ga !== gb, number = /s$/.test(a) !== /s$/.test(b);
  if (gender && !number) return noun ? `Check the article: ${noun} is ${GENDER_WORD[gb!]}.` : 'Check the article: masculine or feminine?';
  if (number && !gender) return noun ? `Check the article: one ${noun.replace(/s$/, '')} or more than one?` : 'Check the article: one or more than one?';
  return 'Check the article: it has to match the noun.';
}

export interface RelationOptions {
  /** The word after the wanted one, when there is one (a gap has none). */
  next?: string;
  /** The typed word after the article, when there is one. */
  nextTyped?: string;
  /** The words typed just before this one. */
  before?: readonly string[];
  /** One word in a gap: "who" and "when" stand alone, not as an ending. */
  gap?: boolean;
}

/** What two different words have to do with each other, when they are a pair
 *  the course teaches apart: one verb in two shapes, ser and estar, por and
 *  para, two articles, two pronouns. Null when they are just two words. */
export function relationHint(a: string, b: string, o: RelationOptions = {}): { kind: GapKind; hint: string } | null {
  // an article is blamed only when the noun after it is the same: "el éxito" for "la salida" is the noun
  if (ARTICLES.has(a) && ARTICLES.has(b) && o.nextTyped === o.next) return { kind: 'article', hint: articleHint(a, b, o.next) };
  if (CLITICS.has(a) && CLITICS.has(b)) return { kind: 'pronoun', hint: HINT_TEXT.pronoun };
  if (/^(por|para)$/.test(a) && /^(por|para)$/.test(b)) return { kind: 'por-para', hint: HINT_TEXT['por-para'] };
  if ((POSSESSIVES.has(a) && POSSESSIVES.has(b)) || (DEMONSTRATIVES.has(a) && DEMONSTRATIVES.has(b))) {
    // mi and mis, esta and este are one word that must agree; mi and tu, ese and este are two words
    return stem(a).slice(0, 5) === stem(b).slice(0, 5) ? { kind: 'agreement', hint: HINT_TEXT.agreement } : { kind: 'wrong-word', hint: wrongWord(a) };
  }
  const d = verbDiff(a, b);
  if (d) {
    // "Si tendría tiempo": after si the would and will forms are not used
    const would = (d === 'tense' || d === 'mood') && o.before?.slice(-3).includes('si')
      ? formsOf(a).find((f) => f.kind === 'finite' && (f.tense === 'condicional' || f.tense === 'futuro')) : undefined;
    if (would) return { kind: 'mood', hint: `After "si", this verb does not take the ${would.tense === 'condicional' ? 'would' : 'will'} form.` };
    if (d === 'person') return o.gap ? { kind: 'person', hint: 'Right verb, but who is doing it?' } : { kind: 'verb-ending', hint: 'Check the verb ending: who is doing it?' };
    if (d === 'tense') return o.gap ? { kind: 'tense', hint: 'Right verb, but when does it happen?' } : { kind: 'verb-ending', hint: 'Check the verb ending: when does it happen?' };
    if (d === 'ending') return { kind: 'verb-ending', hint: HINT_TEXT['verb-ending'] };
    if (d === 'agree') return { kind: 'experiencer-agree', hint: HINT_TEXT['experiencer-agree'] };
    if (d === 'mood' || d === 'aspect') return { kind: d, hint: HINT_TEXT[d] };
    return { kind: 'nonfinite', hint: NONFINITE_TEXT[d] };
  }
  const ca = copula(a), cb = copula(b);
  if (ca && cb && ca !== cb) {
    const gerund = cb === 'estar' && !!o.next && formsOf(o.next).some((f) => f.kind === 'ger');
    return { kind: 'ser-estar', hint: gerund ? GERUND_ESTAR : HINT_TEXT['ser-estar'] };
  }
  return null;
}

/** A word is a typo of another only if it is not itself a word of the same
 *  kind: "tomo" for "como" is a different verb, "pescdo" for "pescado" is a slip. */
export function isTypo(typed: string, want: string): boolean {
  const x = deaccent(typed), y = deaccent(want);
  if (y.length < 4 || x === y) return false;
  const known = (w: string) => SMALL.has(w) || readings(w).some((a) => a.target !== false);
  if (known(typed) && known(want)) return false;
  // a word of the language two edits away is another word (momento for momentico), not a slip at it
  if (isKnownForm(typed.toLowerCase()) && levenshtein(x, y) >= 2) return false;
  return levenshtein(x, y) <= (y.length >= 7 ? 2 : 1);
}

function classifySub(input: readonly string[], i: number, expected: readonly string[], j: number, single: boolean): Diagnosis {
  const a = input[i], b = expected[j], at = j;
  if (/^\d/.test(a) && /^\d/.test(b)) return { kind: 'number', hint: HINT_TEXT.number, at };
  const rel = relationHint(a, b, { next: expected[j + 1], nextTyped: input[i + 1], before: input.slice(Math.max(0, i - 3), i) });
  if (rel) return { kind: rel.kind as HintKind, hint: rel.hint, at };
  if (!readings(a).length && !readings(b).length && stem(a) === stem(b) && stem(a).length >= 3) return { kind: 'agreement', hint: HINT_TEXT.agreement, at };
  if (isTypo(a, b)) return { kind: 'spelling', hint: HINT_TEXT.spelling, at };
  return single ? { kind: 'wrong-word', hint: wrongWord(a), at } : { kind: 'differs', hint: lookAgain(a), at };
}

/** Every token of `sub` is in `sup`, counted with repeats. */
function multisetWithin(sub: readonly string[], sup: readonly string[]): boolean {
  const left = new Map<string, number>();
  for (const w of sup) left.set(w, (left.get(w) ?? 0) + 1);
  for (const w of sub) {
    const n = left.get(w) ?? 0;
    if (!n) return false;
    left.set(w, n - 1);
  }
  return true;
}

/** `sub` appears in `sup` in the same order (gaps allowed). */
function inOrder(sub: readonly string[], sup: readonly string[]): boolean {
  let j = 0;
  for (const w of sup) if (j < sub.length && sub[j] === w) j++;
  return j === sub.length;
}

const orderAt = (input: readonly string[], expected: readonly string[]) => Math.max(0, input.findIndex((w, i) => w !== expected[i]));
const count = (xs: readonly string[], w: string) => xs.filter((x) => x === w).length;

/** The first real mistake in `input` against `expected` (canonical tokens). */
export function diagnose(input: readonly string[], expected: readonly string[]): Diagnosis {
  if (!input.length) return { kind: 'empty', hint: HINT_TEXT.empty, at: 0 };
  // junk or a fragment ("no sé" for a whole sentence): say so honestly
  if (expected.length >= 3 && input.length < expected.length / 2) {
    const hits = input.filter((w) => expected.includes(w)).length;
    if (hits < expected.length / 2) return { kind: 'fragment', hint: HINT_TEXT.fragment, at: 0 };
  }
  // the same words, or some of them, in another order: never blame a right word
  if (multisetWithin(input, expected) && (input.length === expected.length || !inOrder(input, expected))) {
    return { kind: 'word-order', hint: HINT_TEXT['word-order'], at: orderAt(input, expected) };
  }
  // "dame lo" for "dámelo"
  for (let i = 0; i + 1 < input.length; i++) {
    const glued = deaccent(input[i] + input[i + 1]);
    const j = expected.findIndex((e) => deaccent(e) === glued);
    if (j >= 0 && CLITICS.has(input[i + 1])) return { kind: 'attach', hint: HINT_TEXT.attach, at: j };
  }
  // "a el" for "al", "de el" for "del"
  for (let i = 0; i + 1 < input.length; i++) {
    const joined = input[i + 1] === 'el' ? (input[i] === 'a' ? 'al' : input[i] === 'de' ? 'del' : null) : null;
    if (joined && count(expected, joined) > count(input, joined)) return { kind: 'contraction', hint: HINT_TEXT.contraction, at: expected.indexOf(joined) };
  }
  const ops = align(input, expected);
  const edits = ops.filter((o) => o.op !== 'eq' && !(o.op === 'sub' && deaccent(o.a!) === deaccent(o.b!)));
  if (!edits.length) {
    const acc = ops.find((o) => o.op === 'sub');
    return { kind: 'accents', hint: HINT_TEXT.accents, at: acc?.j ?? 0 };
  }
  const first = edits[0];
  const dels = edits.filter((o) => o.op === 'del'), inss = edits.filter((o) => o.op === 'ins');
  // a word that moved: what was taken out here is put back in elsewhere, and nothing else differs
  if (!edits.some((o) => o.op === 'sub') && dels.length === inss.length && multisetWithin(dels.map((o) => o.b!), inss.map((o) => o.a!))) {
    return { kind: 'word-order', hint: HINT_TEXT['word-order'], at: first.j };
  }
  // missing or extra: only when that is the whole difference
  if (!inss.length && !edits.some((o) => o.op === 'sub')) {
    return { kind: 'missing-word', hint: SMALL.has(first.b!) ? 'A small word is missing.' : HINT_TEXT['missing-word'], at: first.j };
  }
  if (!dels.length && !edits.some((o) => o.op === 'sub')) return { kind: 'extra-word', hint: `There's an extra word: "${first.a}".`, at: first.j };
  if (first.op === 'sub') {
    const dg = classifySub(input, first.i, expected, first.j, edits.length === 1);
    // a word the right version has, only somewhere else: the order is the mistake
    if (dg.kind === 'wrong-word' && count(expected, first.a!) >= count(input, first.a!)) return { kind: 'word-order', hint: HINT_TEXT['word-order'], at: first.j };
    return dg;
  }
  // an insertion or a deletion among other differences: point at the place, do not explain it
  return { kind: 'differs', hint: lookAgain(first.op === 'ins' ? first.a! : input[first.i] ?? input[first.i - 1]), at: first.j };
}
