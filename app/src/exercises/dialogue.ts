/* ============================================================================
 * DIALOGUE ROWS: one turn at a time.
 *
 * A bank row of two (or more) turns keeps them on separate lines:
 *   es "¿Simón habla inglés?\nNo sé."   en "Does Simón speak English?\nI don't know."
 * (some English has the turns split by a literal backslash-n). A learner is
 * never asked to type a whole exchange in one answer. A production card
 * shows the earlier turns in Spanish as context (the other speaker) and asks
 * for ONE turn from its English line, and checks only that turn. By default
 * that is the last turn, the reply; `prefer` picks the turn that practises
 * what the card is about (the target chunk sits in the first turn).
 * Recognition cards may show the whole exchange.
 * ========================================================================== */
import type { BankSentence } from '../content/schema';

const TURN_BREAK = /\n|\\n/;

/** The lines of one side of a row, trimmed, empties dropped. */
export function turnLines(s: string): string[] {
  return s.split(TURN_BREAK).map((x) => x.trim()).filter(Boolean);
}

/** Literal "\n" in content English as a real line break (for display). */
export const fixBreaks = (s: string) => s.replace(/\\n/g, '\n');

/** Is this row a multi-turn exchange? */
export const isMultiTurn = (s: Pick<BankSentence, 'es'>) => turnLines(s.es).length > 1;

export interface TurnView {
  /** The row narrowed to the one turn the learner produces (same id). */
  sentence: BankSentence;
  /** Spanish turns before it, one per line ('' when there are none). */
  context: string;
  /** Their English, one per line. */
  contextEn: string;
  /** Which turn, 0-based. */
  turn: number;
  /** How many turns the row has. */
  turns: number;
}

/** The row narrowed to turn `i`, or null when the two sides do not line up. */
export function turnView(s: BankSentence, i: number): TurnView | null {
  const es = turnLines(s.es);
  const en = turnLines(s.en);
  if (es.length !== en.length || i < 0 || i >= es.length) return null;
  const pick = (xs: readonly string[]) => xs
    .map(turnLines)
    .filter((ls) => ls.length === es.length)                    // a whole-exchange variant: its own turn
    .map((ls) => ls[i])
    .filter((x) => x !== es[i]);
  const acceptEn = s.acceptEn.map(turnLines).filter((ls) => ls.length === en.length).map((ls) => ls[i]);
  return {
    sentence: { ...s, es: es[i], en: en[i], accept: [...new Set(pick(s.accept))], acceptEn: [...new Set(acceptEn.filter((x) => x !== en[i]))] },
    context: es.slice(0, i).join('\n'),
    contextEn: en.slice(0, i).join('\n'),
    turn: i,
    turns: es.length,
  };
}

/** Every usable turn of a row, the preferred ones first, then last to first.
 *  A one-turn row gives itself, unchanged. */
export function turnViews(s: BankSentence, prefer?: (es: string) => boolean): TurnView[] {
  if (!isMultiTurn(s)) return [{ sentence: s, context: '', contextEn: '', turn: 0, turns: 1 }];
  const n = turnLines(s.es).length;
  const views: TurnView[] = [];
  for (let i = n - 1; i >= 0; i--) { const v = turnView(s, i); if (v) views.push(v); }
  if (!prefer) return views;
  return [...views.filter((v) => prefer(v.sentence.es)), ...views.filter((v) => !prefer(v.sentence.es))];
}

/** The turn a production card asks for: the preferred turn, else the reply.
 *  Null only for a row whose Spanish and English turns do not line up. */
export function productionView(s: BankSentence, prefer?: (es: string) => boolean): TurnView | null {
  return turnViews(s, prefer)[0] ?? null;
}

/** The context and the turn as one Spanish text, the gap or turn last. */
export const withContext = (context: string, line: string) => (context ? `${context}\n${line}` : line);
