/* ============================================================================
 * HINTS FOR ONE WORD. A gap or a chunk has no sentence to align, so the
 * sentence diagnosis has nothing to say. This looks at the typed word itself:
 * the right verb in the wrong person or tense, a typo, or simply another word.
 * Never gives the answer away.
 * ========================================================================== */
import { deaccent } from '../engine';
import { verbReadings } from '../exercises/spanish';
import { levenshtein } from './translate/hints';

export type WordHintKind = 'person' | 'tense' | 'spelling' | 'other-word';
export interface WordHint { kind: WordHintKind; hint: string }

export const WORD_HINT = {
  person: 'Right verb, but who is doing it?',
  tense: 'Right verb, but when does it happen?',
  spelling: 'Check the spelling.',
} as const;

const clean = (s: string) => deaccent(s.toLowerCase().replace(/[.,;:!?¡¿"“”]/g, '')).replace(/\s+/g, ' ').trim();

/** A hint for a wrong typed word or chunk that is not just an accent slip, or
 *  undefined when nothing specific can be said. `want` is the English of the
 *  word the gap asks for; give it only for a gap (a chunk has no single word to name). */
export function wordHint(input: string, answers: readonly string[], want?: string): WordHint | undefined {
  const typed = clean(input);
  if (!typed || !answers.length) return undefined;
  const oneWord = !/\s/.test(typed);
  if (oneWord) {
    const got = verbReadings(input.trim());
    if (got.length) {
      const rights = answers.filter((a) => !/\s/.test(a.trim())).flatMap((a) => verbReadings(a.trim()));
      const sameVerb = rights.filter((r) => got.some((g) => g.inf.replace(/se$/, '') === r.inf.replace(/se$/, '')));
      if (sameVerb.length) {
        const sameTense = sameVerb.some((r) => got.some((g) => g.tense === r.tense));
        return sameTense ? { kind: 'person', hint: WORD_HINT.person } : { kind: 'tense', hint: WORD_HINT.tense };
      }
    }
  }
  if (answers.some((a) => { const c = clean(a); return c.length >= 3 && levenshtein(typed, c) <= 2; })) {
    return { kind: 'spelling', hint: WORD_HINT.spelling };
  }
  if (want && oneWord && /^\p{L}+$/u.test(typed)) {
    return { kind: 'other-word', hint: `That's a different word. The gap wants "${want}".` };
  }
  return undefined;
}
