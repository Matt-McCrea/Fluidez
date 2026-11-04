// Pure helpers for the story import: reading-day splits and question placement.
export const DAY_WORDS: Record<string, number> = { A1: 180, A2: 260, B1: 350, B2: 450, C1: 600 };

export interface Line { text: string; words: number }
export interface GlossPair { es: string; en: string }
export interface Q { q: string; options: string[]; answer: number }

export const lineBody = (l: string) => l.replace(/^[^:\n]{1,30}:\s+/, '');
export const countWords = (s: string) => (s.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
export const toLines = (text: string): Line[] =>
  text.split('\n').filter((l) => l.trim()).map((t) => ({ text: t, words: countWords(lineBody(t)) }));

/** Contiguous groups of whole lines (a line is a paragraph or a speaker turn), as even as possible. Returns start indexes. */
export function splitLines(lines: Line[], limit: number): number[][] {
  const total = lines.reduce((a, l) => a + l.words, 0);
  const k = Math.max(1, Math.ceil(total / limit));
  if (k === 1 || lines.length < 2) return [lines.map((_, i) => i)];
  const parts: number[][] = [];
  let cur: number[] = [];
  let acc = 0; // words consumed before current part
  let curW = 0;
  for (let i = 0; i < lines.length; i++) {
    const left = k - parts.length - 1; // parts still to open after this one
    const target = (total * (parts.length + 1)) / k;
    const remainingLines = lines.length - i;
    const before = acc + curW, after = before + lines[i].words;
    // close the current part before line i if the boundary is closer to the target without it
    if (cur.length && left > 0 && Math.abs(before - target) <= Math.abs(after - target) && after > target) {
      parts.push(cur); acc += curW; cur = []; curW = 0;
    } else if (cur.length && remainingLines <= left) {
      parts.push(cur); acc += curW; cur = []; curW = 0;
    }
    cur.push(i); curW += lines[i].words;
  }
  if (cur.length) parts.push(cur);
  return parts;
}

const STOP = new Set(['the', 'and', 'that', 'this', 'with', 'from', 'what', 'why', 'how', 'who', 'does', 'did', 'are', 'was', 'were', 'his', 'her', 'she', 'they', 'their', 'for', 'about', 'which', 'when', 'where', 'has', 'have', 'had', 'into', 'than', 'then', 'there', 'not', 'but', 'you', 'your', 'him', 'its', 'one', 'say', 'says', 'said', 'will', 'would', 'been', 'being', 'por', 'que', 'los', 'las', 'del', 'una', 'con', 'para']);
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const contentWords = (s: string): string[] =>
  [...new Set(norm(s).match(/[a-zñ]+/g) ?? [])].filter((w) => w.length >= 4 && !STOP.has(w));
const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, '');

/** Line index where the evidence for `words` first appears, or -1. Looks at the Spanish text directly, then through the gloss (English to Spanish phrase). */
export function locate(words: string[], lines: Line[], gloss: GlossPair[]): number {
  if (!words.length) return -1;
  const bodies = lines.map((l) => norm(lineBody(l.text)));
  let best = -1, bestScore = 0;
  bodies.forEach((b, i) => {
    const toks = new Set(b.match(/[a-zñ]+/g) ?? []);
    const sc = words.filter((w) => toks.has(w)).length / words.length;
    if (sc > bestScore) { best = i; bestScore = sc; }
  });
  if (bestScore >= 0.5) return best;
  const ws = words.map(stem);
  let gi = -1, gs = 0;
  gloss.forEach((g, i) => {
    const gw = new Set(contentWords(g.en).map(stem));
    if (!gw.size) return;
    const sc = ws.filter((w) => gw.has(w)).length / ws.length;
    if (sc > gs) { gi = i; gs = sc; }
  });
  if (gi >= 0 && gs >= 0.5) {
    const es = norm(gloss[gi].es);
    const at = bodies.findIndex((b) => b.includes(es));
    if (at >= 0) return at;
  }
  return -1;
}

export interface Placed { q: Q; longest: boolean; located: boolean; how: 'option' | 'question' | 'none' }
export const isLongest = (q: Q) => {
  const L = q.options.map((o) => o.length);
  const m = Math.max(...L);
  return L[q.answer] === m && L.filter((x) => x === m).length === 1;
};

/** Which part (index) each question belongs to: the first part containing the answer's sentence; unlocated goes to the last. */
export function placeQuestions(qs: Q[], lines: Line[], parts: number[][], gloss: GlossPair[]): Array<Placed & { part: number }> {
  const partOf = (line: number) => parts.findIndex((p) => p.includes(line));
  return qs.map((q) => {
    let at = locate(contentWords(q.options[q.answer] ?? ''), lines, gloss);
    let how: Placed['how'] = 'option';
    if (at < 0) { at = locate(contentWords(q.q), lines, gloss); how = 'question'; }
    if (at < 0) how = 'none';
    return { q, longest: isLongest(q), located: at >= 0, how, part: at >= 0 ? partOf(at) : parts.length - 1 };
  });
}
