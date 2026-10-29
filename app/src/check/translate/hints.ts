/* ============================================================================
 * WHERE IS THE MISTAKE? — one plain-English hint, from the first difference
 * between the learner's answer and the closest accepted answer.
 *
 * The hint names the KIND of mistake and never gives the answer away: "Check
 * the verb ending — who is doing it?", not "it's comemos". The learner gets
 * one self-correction attempt with it (attempt.ts) before the answer shows.
 * ========================================================================== */
import { analyzeToken, deaccent } from '../../engine';
import { ARTICLES, CLITICS, nounGender, PREPOSITIONS } from '../../exercises/spanish';

export type HintKind =
  | 'accents' | 'verb-ending' | 'article' | 'agreement' | 'word-order' | 'missing-word' | 'extra-word'
  | 'pronoun' | 'subject' | 'ser-estar' | 'por-para' | 'spelling' | 'attach' | 'wrong-word' | 'empty';

export interface Diagnosis { kind: HintKind; hint: string; at: number }

export const HINT_TEXT = {
  accents: 'Check the accents.',
  'verb-ending': 'Check the verb ending.',
  agreement: 'Check the ending — it has to agree (masculine or feminine, one or more).',
  'word-order': 'Check the word order.',
  'missing-word': 'A word is missing.',
  pronoun: 'Check the pronoun (lo, la, le…): who or what does it stand for?',
  subject: 'Check the subject — who is it about?',
  'ser-estar': 'Ser or estar? Is it what something is, or how it is right now?',
  'por-para': 'Por or para? Check that little word.',
  spelling: 'Check the spelling.',
  attach: 'In a command, the pronoun joins the end of the verb.',
  empty: 'Type your answer in Spanish.',
} as const;

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

type Op = { op: 'eq' | 'sub' | 'ins' | 'del'; a?: string; b?: string; i: number; j: number };

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

function classifySub(a: string, b: string, next: string | undefined, at: number): Diagnosis {
  if (ARTICLES.has(a) && ARTICLES.has(b)) {
    const ga = nounGender('x', a), gb = nounGender('x', b);
    const pa = /s$/.test(a), pb = /s$/.test(b);
    if (ga && gb && ga !== gb && next) return { kind: 'article', hint: `Check the article — ${next} is ${GENDER_WORD[gb]}.`, at };
    if (pa !== pb && next) return { kind: 'article', hint: `Check the article — one ${next.replace(/s$/, '')} or more than one?`, at };
    return { kind: 'article', hint: 'Check the article: "the" (el, la) or "a" (un, una)?', at };
  }
  if (CLITICS.has(a) && CLITICS.has(b)) return { kind: 'pronoun', hint: HINT_TEXT.pronoun, at };
  if (/^(por|para)$/.test(a) && /^(por|para)$/.test(b)) return { kind: 'por-para', hint: HINT_TEXT['por-para'], at };
  const ra = readings(a), rb = readings(b);
  if (ra.length && rb.length) {
    const infA = new Set(ra.map((x) => x.inf.replace(/se$/, '')));
    const same = rb.filter((x) => infA.has(x.inf.replace(/se$/, '')));
    if (same.length) {
      const sameTense = same.some((x) => ra.some((y) => y.tense === x.tense));
      return { kind: 'verb-ending', hint: sameTense ? 'Check the verb ending — who is doing it?' : 'Check the verb ending — when does it happen?', at };
    }
    const cop = (r: typeof ra) => r.some((x) => x.inf === 'ser') ? 'ser' : r.some((x) => x.inf === 'estar') ? 'estar' : null;
    if (cop(ra) && cop(rb) && cop(ra) !== cop(rb)) return { kind: 'ser-estar', hint: HINT_TEXT['ser-estar'], at };
  }
  if (!ra.length && !rb.length && stem(a) === stem(b) && stem(a).length >= 3) return { kind: 'agreement', hint: HINT_TEXT.agreement, at };
  if (b.length >= 4 && levenshtein(deaccent(a), deaccent(b)) <= 2) return { kind: 'spelling', hint: HINT_TEXT.spelling, at };
  return { kind: 'wrong-word', hint: `"${a}" doesn't fit there — check the meaning.`, at };
}

/** The first real mistake in `input` against `expected` (canonical tokens). */
export function diagnose(input: readonly string[], expected: readonly string[]): Diagnosis {
  if (!input.length) return { kind: 'empty', hint: HINT_TEXT.empty, at: 0 };
  const sortKey = (xs: readonly string[]) => xs.slice().sort().join(' ');
  if (input.length === expected.length && sortKey(input) === sortKey(expected)) {
    const at = input.findIndex((w, i) => w !== expected[i]);
    return { kind: 'word-order', hint: HINT_TEXT['word-order'], at: Math.max(0, at) };
  }
  // "dame lo" for "dámelo"
  for (let i = 0; i + 1 < input.length; i++) {
    const glued = deaccent(input[i] + input[i + 1]);
    const j = expected.findIndex((e) => deaccent(e) === glued);
    if (j >= 0 && CLITICS.has(input[i + 1])) return { kind: 'attach', hint: HINT_TEXT.attach, at: j };
  }
  const ops = align(input, expected);
  const real = ops.find((o) => o.op !== 'eq' && !(o.op === 'sub' && deaccent(o.a!) === deaccent(o.b!)));
  if (!real) {
    const acc = ops.find((o) => o.op === 'sub');
    return { kind: 'accents', hint: HINT_TEXT.accents, at: acc?.j ?? 0 };
  }
  // a word that moved: the same token deleted here and inserted elsewhere
  const dels = ops.filter((o) => o.op === 'del').map((o) => o.b);
  const inss = ops.filter((o) => o.op === 'ins').map((o) => o.a);
  if (real.op !== 'sub' && dels.some((d) => inss.includes(d))) return { kind: 'word-order', hint: HINT_TEXT['word-order'], at: real.j };
  if (real.op === 'del') {
    return { kind: 'missing-word', hint: SMALL.has(real.b!) ? 'A small word is missing.' : HINT_TEXT['missing-word'], at: real.j };
  }
  if (real.op === 'ins') return { kind: 'extra-word', hint: `There's an extra word: "${real.a}".`, at: real.j };
  return classifySub(real.a!, real.b!, expected[real.j + 1], real.j);
}
