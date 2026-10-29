// Public API of the exercise generators. Every generator is a pure function
// of (bank sentence | lexeme, options with a seed) and returns items whose
// ids are stable across runs and seeds, for the exposure ledger.
import { checkExact } from '../check/exact';
import { matchEnglish, matchTranslation, type MatchOptions } from '../check/translate';
import type { Item } from './types';

export * from './types';
export { itemId, rng, hash32, shuffle } from './rng';
export { structuredInput, structuredInputAll, ALL_FEATURES } from './input';
export type { InputOptions } from './input';
export { analyseGap, chooseItem, typeFormItem, transformItems, ladder, bareAccepted } from './ladder';
export type { GapAnalysis, LadderOptions } from './ladder';
export { translationItems, corpusAlternatives } from './translation';
export type { TranslationOptions } from './translation';
export { recombinations } from './recombine';
export type { RecombineOptions } from './recombine';
export { cueItem, lexGapItem, lexGapItems, INTERCHANGEABLE } from './lexeme';
export type { LexemeLike } from './lexeme';
export { changePerson, changeTense, negate, affirm, pronominalise, form } from './reinflect';
export { enChangePerson, enNegate } from './english';
export { parseClause } from './spanish';

export interface ItemCheck {
  pass: boolean;
  near?: boolean;
  hint?: string;
  variant?: 'peninsular';
  /** What to show as the answer. */
  answer: string;
}

/** Check a learner's response to any item. `response` is the typed text, or
 *  the chosen option index for read-and-pick / choose / recognition items. */
export function checkItem(item: Item, response: string | number, opts: MatchOptions = {}): ItemCheck {
  switch (item.kind) {
    case 'readAndPick':
    case 'choose':
      return { pass: response === item.answer, answer: item.options[item.answer] };
    case 'typeForm': {
      const r = checkExact(String(response), [item.answer, ...item.accept]);
      return { pass: r.pass, near: r.near, ...(r.near && !r.pass ? { hint: 'Check the accents.' } : {}), answer: item.answer };
    }
    case 'cue':
    case 'lexGap': {
      const r = checkExact(String(response), [item.answer, ...item.accept], { peninsular: item.peninsular });
      return { pass: r.pass, near: r.near, ...(r.variant ? { variant: r.variant } : {}), ...(r.near && !r.pass ? { hint: 'Check the accents.' } : {}), answer: item.answer };
    }
    case 'transform': {
      const r = matchTranslation(String(response), { es: item.answer, en: '', accept: item.accept }, opts);
      return { pass: r.pass, near: r.near, hint: r.hint, ...(r.variant ? { variant: r.variant } : {}), answer: r.closest };
    }
    case 'translate': {
      if (item.dir === 'es-en') {
        const r = matchEnglish(String(response), { en: item.answer, acceptEn: item.accept });
        return { pass: r.pass, near: r.near, hint: r.hint, answer: r.closest };
      }
      const r = matchTranslation(String(response), { es: item.answer, en: item.en, accept: item.accept }, opts);
      return { pass: r.pass, near: r.near, hint: r.hint, ...(r.variant ? { variant: r.variant } : {}), answer: r.closest };
    }
    case 'recombine': {
      if (item.mode === 'recognition') return { pass: response === item.answer, answer: item.options![item.answer!] };
      const r = matchTranslation(String(response), { es: item.es, en: item.en ?? '', accept: item.accept }, opts);
      return { pass: r.pass, near: r.near, hint: r.hint, ...(r.variant ? { variant: r.variant } : {}), answer: r.closest };
    }
  }
}
