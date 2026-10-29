// A chapter cut into beats: short stretches of reading, each followed by the
// comprehension questions it answers. Pure and deterministic.

export interface Beat {
  /** the beat's text, paragraphs joined by newlines */
  text: string;
  /** indices into the questions given to splitBeats; every question is in exactly one beat */
  questions: number[];
  words: number;
}

interface Unit { text: string; words: number; paraEnd: boolean }

const MIN_WORDS = 40;

export const countWords = (s: string): number => (s.match(/\p{L}+/gu) ?? []).length;

/** A paragraph's sentences, each kept whole (closing quotes and brackets stay with it). */
export function sentencesOf(para: string): string[] {
  const out = para.match(/(?:[^.!?…]|(?<=\d)\.(?=\d))+(?:(?:[.!?…]+["”»')\]]*)+|$)\s*/gu) ?? [para];
  return out.map((s) => s.trim()).filter(Boolean);
}

const fold = (s: string): string => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const wordsOf = (s: string): string[] => fold(s).match(/\p{L}+/gu) ?? [];

export function splitBeats(
  text: string,
  questions: ReadonlyArray<{ q: string; options?: string[]; answer: number | string }>,
  opts: { target?: number } = {},
): Beat[] {
  const target = opts.target ?? 110;
  const units: Unit[] = [];
  for (const para of text.split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
    const ss = sentencesOf(para);
    ss.forEach((s, i) => units.push({ text: s, words: countWords(s), paraEnd: i === ss.length - 1 }));
  }
  const total = units.reduce((n, u) => n + u.words, 0);
  const t = total / Math.max(1, Math.round(total / target));

  const groups: Unit[][] = [];
  let cur: Unit[] = [];
  let n = 0;
  for (const u of units) {
    if (n >= MIN_WORDS && n + u.words > t * 1.25) { groups.push(cur); cur = []; n = 0; }
    cur.push(u); n += u.words;
    if ((n >= t * 0.9 && u.paraEnd) || n >= t) { groups.push(cur); cur = []; n = 0; }
  }
  if (cur.length) {
    if (n < MIN_WORDS && groups.length) groups[groups.length - 1].push(...cur); else groups.push(cur);
  }
  if (!groups.length) groups.push([]);

  const beats: Beat[] = groups.map((g) => {
    let out = '';
    g.forEach((u, i) => { out += (i === 0 ? '' : g[i - 1].paraEnd ? '\n' : ' ') + u.text; });
    return { text: out, questions: [], words: g.reduce((k, u) => k + u.words, 0) };
  });

  // a question belongs to the earliest beat holding most of its (rarer) words
  const sets = beats.map((b) => new Set(wordsOf(b.text)));
  const spread = (w: string) => sets.filter((s) => s.has(w)).length;
  questions.forEach((q, qi) => {
    const qw = new Set(wordsOf([q.q, ...(q.options ?? []), typeof q.answer === 'string' ? q.answer : ''].join(' ')).filter((w) => w.length >= 4));
    let best = -1;
    let bestScore = 0;
    sets.forEach((s, bi) => {
      let score = 0;
      for (const w of qw) if (s.has(w)) score += 1 / spread(w);
      if (score > bestScore + 1e-9) { best = bi; bestScore = score; }
    });
    beats[best < 0 ? beats.length - 1 : best].questions.push(qi);
  });
  return beats;
}
