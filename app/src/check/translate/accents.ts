// Accent slips in a typed sentence, and whether the accent is what makes the word.
// Most are spelling: cafe for café, comi for comí. Some are another word: hablo is
// not habló, si is not sí, esta is not está. The first stay right with a note
// saying which word (R15); the second do not.
import { analyzeToken, deaccent } from '../../engine';

/** A word as typed against the word it stands for, which differ only in a written accent. */
export interface AccentSlip { typed: string; expected: string }

/** Words a written accent turns into another word, with a meaning of its own. The accent is the whole difference there.
 *  The question words (que, qué; donde, dónde) are not here: the tilde marks the question, and the sentence means what it meant. */
const DIACRITIC: ReadonlyArray<readonly [string, string]> = [
  ['tu', 'tú'], ['el', 'él'], ['mi', 'mí'], ['si', 'sí'], ['se', 'sé'], ['te', 'té'], ['de', 'dé'], ['mas', 'más'], ['aun', 'aún'],
  ['esta', 'está'], ['estas', 'estás'], ['este', 'esté'], ['papa', 'papá'], ['mama', 'mamá'],
];
const PAIRED = new Set(DIACRITIC.flat());

const wordsOf = (s: string): string[] => s.toLowerCase().match(/\p{L}+/gu) ?? [];

/**
 * The words of `typed` that are the words of `expected` but for an accent. Words
 * spelled the same in both are set aside first, so a pronoun left out or an
 * adverb moved does not hide a slip or invent one.
 */
export function accentSlips(typed: string, expected: string): AccentSlip[] {
  const open = wordsOf(expected);
  const left: string[] = [];
  for (const w of wordsOf(typed)) {
    const i = open.indexOf(w);
    if (i >= 0) open.splice(i, 1); else left.push(w);
  }
  const out: AccentSlip[] = [];
  for (const t of left) {
    const i = open.findIndex((e) => deaccent(e) === deaccent(t));
    if (i >= 0) out.push({ typed: t, expected: open.splice(i, 1)[0] });
  }
  return out;
}

/** Whether the word as typed is itself a word: a verb form spelled exactly, or one of the pairs the accent tells apart. */
export function changesWord({ typed }: AccentSlip): boolean {
  return PAIRED.has(typed) || analyzeToken(typed).some((a) => a.accentExact && !a.clitics);
}

/** Which words to watch, for the pass screen. `*word*` is how content marks Spanish. */
export function accentNote(slips: readonly AccentSlip[]): string {
  const one = slips[0];
  if (slips.length === 1) return `Watch the accent on *${one.expected}*: you wrote *${one.typed}*.`;
  const names = slips.map((s) => `*${s.expected}*`);
  return `Watch the accents on ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}.`;
}
