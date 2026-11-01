/* ============================================================================
 * GENERATOR 3 — TRANSLATION ITEMS from bank sentences, both directions.
 * en→es is checked by matchTranslation (pronoun drop, clitic position,
 * registers of "you", Peninsular forms); es→en by matchEnglish.
 * ========================================================================== */
import type { BankSentence } from '../content/schema';
import { normEnglish } from '../check/translate/english';
import { bankIndex } from './bank-index';
import { productionView } from './dialogue';
import { itemId } from './rng';
import type { TranslateItem } from './types';

/** The bank by the English a row can be answered with (its own and each acceptEn, normalised), in bank order. */
const byEnglish = bankIndex(() => new Map<string, BankSentence[]>(), (m, s) => {
  for (const k of new Set([normEnglish(s.en), ...(s.acceptEn ?? []).map((e) => normEnglish(e))])) {
    const rows = m.get(k);
    if (rows) rows.push(s); else m.set(k, [s]);
  }
});

/** Other Spanish the bank pairs with the same English: all of it is right
 *  (the acceptFor idea from js/gameitems.js). */
export function corpusAlternatives(bank: readonly BankSentence[], s: BankSentence): string[] {
  return (byEnglish(bank).get(normEnglish(s.en)) ?? []).filter((b) => b.id !== s.id && !/\n/.test(b.es)).map((b) => b.es);
}

export interface TranslationOptions {
  dirs?: ReadonlyArray<'en-es' | 'es-en'>;
  /** The bank, to accept other sentences with the same English. */
  bank?: readonly BankSentence[];
  /** For a dialogue row: which turn to ask for (default: the reply). */
  prefer?: (es: string) => boolean;
}

export function translationItems(row: BankSentence, opts: TranslationOptions = {}): TranslateItem[] {
  const dirs = opts.dirs ?? ['en-es', 'es-en'];
  const out: TranslateItem[] = [];
  const view = productionView(row, opts.prefer);
  if (!view) return out;                                    // turns that do not line up: nothing to ask
  const s = view.sentence;
  const context = view.context ? { context: view.context } : {};
  const nodes = [...s.targets];
  if (dirs.includes('en-es')) {
    const also = opts.bank ? corpusAlternatives(opts.bank, s) : [];
    out.push({
      id: itemId('translate', s.id, 'en-es'), generator: 'translate', sentenceId: s.id, nodes,
      kind: 'translate', dir: 'en-es', prompt: s.en, answer: s.es, accept: [...s.accept, ...also.filter((a) => !s.accept.includes(a))], en: s.en, ...context,
    });
  }
  if (dirs.includes('es-en')) {
    out.push({
      id: itemId('translate', s.id, 'es-en'), generator: 'translate', sentenceId: s.id, nodes,
      kind: 'translate', dir: 'es-en', prompt: s.es, answer: s.en, accept: [...s.acceptEn], en: s.en, ...context,
    });
  }
  return out;
}
