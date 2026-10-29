/* ============================================================================
 * GENERATOR 5 — CUED PRODUCTION FOR WORDS AND CHUNKS.
 *  - cue: English → the Spanish chunk ("the table" → "la mesa").
 *  - gap: the word gapped out of a bank sentence it appears in, with the
 *    sentence's English and the word's gloss as the cue.
 *
 * A gap is dropped when another word would fill it just as well — the old
 * app's Allí / Ahí / Allá problem (js/lessons.js ambiguousOpener): the word
 * belongs to a set of interchangeable words, the word occurs twice, or the
 * answer is longer than two words. A verb lexeme defers to the ladder's
 * ambiguity check (analyseGap).
 * ========================================================================== */
import type { BankSentence, NodeId } from '../content/schema';
import { answerForms } from '../check/exact';
import { deaccent, verbByInf } from '../engine';
import { analyseGap } from './ladder';
import { itemId } from './rng';
import { isPluralWord, low, pluralize, render, replaceCore, toToks } from './spanish';
import type { CueItem, LexGapItem } from './types';

export interface LexemeLike {
  id: NodeId;
  es: string;            // "la mesa", "comer", "por supuesto"
  en: string;            // "the table"
  peninsular?: string;   // "el coche" for "el carro"
}

/** Words any of which fits the same gap. A gap on one of these is dropped. */
export const INTERCHANGEABLE: ReadonlyArray<readonly string[]> = [
  ['allí', 'ahí', 'allá'], ['aquí', 'acá'], ['luego', 'después', 'entonces'], ['pero', 'mas', 'sino'],
  ['muy', 'bastante', 'super'], ['bonito', 'lindo', 'hermoso'], ['bonita', 'linda', 'hermosa'], ['carro', 'auto', 'coche'],
  ['también', 'además'], ['quizás', 'quizá', 'tal vez', 'a lo mejor'], ['enseguida', 'ahora', 'ya'], ['rápido', 'rápidamente'],
  ['empezar', 'comenzar'], ['volver', 'regresar'], ['terminar', 'acabar'], ['cerca', 'junto'], ['hola', 'buenas'],
  ['adiós', 'chao', 'hasta luego'], ['gracias', 'muchas gracias'], ['dinero', 'plata'], ['niño', 'chico'], ['niña', 'chica'],
];

const bare = (es: string) => es.replace(/^(el|la|los|las|un|una)\s+/i, '').trim();
const stripThe = (en: string) => en.replace(/^(the|a|an|to)\s+/i, '').trim();

export function cueItem(lex: LexemeLike): CueItem {
  const peninsular = lex.peninsular ? answerForms(lex.peninsular) : [];
  return {
    id: itemId('lexeme', lex.id, 'cue'), generator: 'lexeme', nodes: [lex.id],
    kind: 'cue', cue: lex.en, answer: lex.es, accept: answerForms(lex.es).filter((a) => a !== lex.es), peninsular,
  };
}

function interchangeable(word: string): boolean {
  const w = deaccent(word.toLowerCase());
  return INTERCHANGEABLE.some((set) => set.some((x) => deaccent(x) === w));
}

/** The lexeme gapped out of one sentence, or null if the gap is not fair. */
export function lexGapItem(lex: LexemeLike, s: BankSentence): LexGapItem | null {
  const word = bare(lex.es).toLowerCase();
  if (!word || word.split(/\s+/).length > 2) return null;
  const nodes = [...new Set([lex.id, ...s.targets])];
  // a verb: the ladder decides whether its gap has one answer
  if (verbByInf(word)) {
    const g = analyseGap(s);
    if (!g || g.clause.choice.inf.replace(/se$/, '') !== word.replace(/se$/, '')) return null;
    return {
      id: itemId('lexeme', s.id, `gap:${lex.id}`), generator: 'lexeme', sentenceId: s.id, nodes,
      kind: 'lexGap', gapped: render(replaceCore(g.clause.toks, g.clause.verb, '___')), en: s.en, cue: g.cue,
      answer: g.answer, accept: g.accept.filter((a) => a !== g.answer), peninsular: [],
    };
  }
  if (interchangeable(word)) return null;
  const ts = toToks(s.es);
  const forms = new Set([word, pluralize(word)]);
  const hits = ts.map((t, i) => (forms.has(low(t)) ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) return null;                              // absent, or twice: which gap?
  const i = hits[0];
  const answer = low(ts[i]);
  const plural = answer !== word && isPluralWord(answer);
  const penBare = lex.peninsular ? bare(lex.peninsular).toLowerCase() : null;
  const peninsular = penBare ? [plural ? pluralize(penBare) : penBare] : [];
  return {
    id: itemId('lexeme', s.id, `gap:${lex.id}`), generator: 'lexeme', sentenceId: s.id, nodes,
    kind: 'lexGap', gapped: render(replaceCore(ts, i, '___')), en: s.en, cue: `(${stripThe(lex.en)}${plural ? ', more than one' : ''})`,
    answer, accept: [], peninsular,
  };
}

/** Every fair gap for a lexeme across the bank. */
export function lexGapItems(lex: LexemeLike, bank: readonly BankSentence[]): LexGapItem[] {
  return bank.map((s) => lexGapItem(lex, s)).filter((x): x is LexGapItem => !!x);
}
