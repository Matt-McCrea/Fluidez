/* ============================================================================
 * matchEnglish — the es→en direction. English is the learner's own language,
 * so this is lenient where English is free and strict nowhere it matters:
 * contractions (don't = do not), British/American spelling (colour/color,
 * travelling/traveling), case and punctuation are ignored; "you" passes for
 * "you all"; one typo in a longer word is a near miss, not a fail.
 * ========================================================================== */
import { expandContractions } from '../../exercises/spanish';
import { levenshtein } from './hints';

export interface EnglishResult { pass: boolean; near?: boolean; hint?: string; closest: string }

const SPELL: ReadonlyArray<[RegExp, string]> = [
  [/our\b/g, 'or'], [/ll(ing|ed|er)\b/g, 'l$1'], [/tre\b/g, 'ter'], [/ise(d|s)?\b/g, 'ize$1'], [/yse(d|s)?\b/g, 'yze$1'],
  [/\bgrey\b/g, 'gray'], [/\bmum\b/g, 'mom'], [/\bfavourite\b/g, 'favorite'],
];

export function normEnglish(s: string): string {
  let t = expandContractions(s.toLowerCase()).replace(/[^a-z'\s]/g, ' ').replace(/'/g, '');
  for (const [re, to] of SPELL) t = t.replace(re, to);
  t = t.replace(/\byou (all|guys)\b/g, 'you');
  return t.replace(/\s+/g, ' ').trim();
}

export function matchEnglish(input: string, item: { en: string; acceptEn?: readonly string[] }): EnglishResult {
  const list = [item.en, ...(item.acceptEn ?? [])];
  const ni = normEnglish(input);
  if (!ni) return { pass: false, hint: 'Type your answer in English.', closest: item.en };
  for (const a of list) if (normEnglish(a) === ni) return { pass: true, closest: a };
  const iw = ni.split(' ');
  for (const a of list) {
    const aw = normEnglish(a).split(' ');
    if (aw.length !== iw.length) continue;
    const diffs = aw.map((w, k) => [w, iw[k]] as const).filter(([x, y]) => x !== y);
    if (diffs.length === 1 && diffs[0][0].length >= 4 && levenshtein(diffs[0][0], diffs[0][1]) === 1) {
      return { pass: false, near: true, hint: 'Check the spelling.', closest: a };
    }
  }
  return { pass: false, hint: 'Read the Spanish again.', closest: item.en };
}
