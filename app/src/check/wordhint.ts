/* ============================================================================
 * HINTS FOR ONE WORD. A gap or a chunk has no sentence to align, so the
 * sentence diagnosis has nothing to say. This looks at the typed word itself:
 * the right verb in the wrong person or tense, ser for estar, a typo, or
 * simply another word. Never gives the answer away, and never calls a
 * different word a typo: the closed pairs the course teaches apart (ser and
 * estar, por and para, the shapes of one verb) are checked before spelling.
 * ========================================================================== */
import { isTypo, relationHint, type GapKind } from './translate/hints';

export type WordHintKind = GapKind | 'other-word';
export interface WordHint { kind: WordHintKind; hint: string }

export const WORD_HINT = {
  person: 'Right verb, but who is doing it?',
  tense: 'Right verb, but when does it happen?',
  spelling: 'Check the spelling.',
} as const;

const clean = (s: string) => s.toLowerCase().replace(/[.,;:!?¡¿"“”]/g, '').replace(/\s+/g, ' ').trim();

/** A hint for a wrong typed word or chunk that is not just an accent slip, or
 *  undefined when nothing specific can be said. `want` is the English of the
 *  word the gap asks for; give it only for a gap (a chunk has no single word to name). */
export function wordHint(input: string, answers: readonly string[], want?: string): WordHint | undefined {
  const typed = clean(input);
  if (!typed || !answers.length) return undefined;
  const oneWord = !/\s/.test(typed);
  const rights = answers.map(clean).filter((a) => a && !/\s/.test(a));
  if (oneWord) {
    for (const right of rights) {
      const r = relationHint(typed, right, { gap: true });
      if (r) return r;
    }
  }
  if (rights.some((a) => isTypo(typed, a))) return { kind: 'spelling', hint: WORD_HINT.spelling };
  if (want && oneWord && /^\p{L}+$/u.test(typed)) return { kind: 'other-word', hint: otherWord(want) };
  return undefined;
}

const otherWord = (want: string) => `That's a different word. The gap wants "${want}".`;
