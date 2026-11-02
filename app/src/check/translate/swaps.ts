/* ============================================================================
 * WHAT A VARIANT SWAPPED, and whether the swap defeats the card.
 *
 * Every accepted form that is not the author's own is the model with
 * something changed. The change is recorded as a Swap, so a pass can say what
 * it went through. Most swaps are free (a clause moved, a synonym on a card
 * about something else). A swap that changes what the card teaches is not:
 * "voy a pagar" for a card on the future is right Spanish and a pass, and
 * still says so (R13), so the point of the card is never quietly removed.
 *
 * Which swaps touch which nodes is a table of node families, not a list of
 * ids, so a node renamed inside its family keeps its note.
 * ========================================================================== */

export type SwapKind =
  | 'clause-order'     // si, cuando, aunque: the clause first or last
  | 'moved-phrase'     // a place or a hace phrase at the front or the end
  | 'synonym'          // another word for the same thing, with its article and its adjectives following
  | 'future-ir-a'      // pagaré and voy a pagar
  | 'pret-perfecto'    // comí and he comido
  | 'cond-ra'          // querría and quisiera, podría and pudiera, debería and debiera
  | 'copula'           // es feliz and está feliz: an adjective that takes either
  | 'result-clause'    // habría llegado and hubiera llegado
  | 'ra-se'            // hablara and hablase
  | 'peninsular'       // coche for carro
  | 'register'         // tú, usted, ustedes
  | 'gender';          // estoy cansada for estoy cansado

export interface Swap {
  kind: SwapKind;
  /** The words of the card's own sentence that were changed, as written there. */
  from: string;
  /** What they became. */
  to: string;
  /** For a word swapped for another word: the dictionary form that was swapped out, which is what a lexeme node is named for. */
  lemma?: string;
}

/** The nodes each kind of swap is about: an id is touched when it matches. A kind with no pattern touches nothing a card can target on its own. */
const FAMILY: Readonly<Record<SwapKind, RegExp | null>> = {
  'clause-order': /(topic-fronting|word-order|discourse-structure|cleft|emphatic|argument-markers)/,
  'moved-phrase': /(topic-fronting|word-order|discourse-structure|cleft|emphatic|argument-markers)/,
  'future-ir-a': /(^|[:-])(future|ir-a)(-|$)/,
  'pret-perfecto': /(^|[:-])(preterite|perfecto|pret|narrative-pasts|spain-pasts)(-|$)/,
  'cond-ra': /(^|[:-])(conditional|softening|imperfect-subj|deber-modal|tense-modal-uses|si-hypothetical)(-|$)/,
  copula: /(^|[:-])(ser|estar)(-|$)/,
  'result-clause': /(conditional-perfect|si-past-unreal|conditional-advanced|pluperfect-subj)/,
  synonym: null,
  'ra-se': null,
  peninsular: null,
  register: null,
  gender: null,
};

/** The one swap whose note is a rule of the language and not a comparison of two phrases. */
export const RESULT_CLAUSE_NOTE = 'Habría and hubiera both work in the result clause.';

/** Does this swap touch one of the card's nodes? A card whose nodes are not known is assumed to be touched by any swap that changes a tense or a mood, and by no other: nobody can say what it was practising. */
export function touches(swap: Swap, targets?: readonly string[]): boolean {
  if (swap.kind === 'synonym') return !!swap.lemma && !!targets?.some((t) => t === `l:${swap.lemma}`);
  const family = FAMILY[swap.kind];
  if (!family) return false;
  return targets ? targets.some((t) => family.test(t)) : swap.kind !== 'clause-order' && swap.kind !== 'moved-phrase' && swap.kind !== 'copula';
}

/** The line a swap earns when it touches the card. */
function lineOf(s: Swap): string {
  if (s.kind === 'result-clause') return RESULT_CLAUSE_NOTE;
  if (s.kind === 'clause-order' || s.kind === 'moved-phrase') return 'That order works too. This card was practising the other one.';
  return `"${s.to}" works too. This card was practising "${s.from}".`;
}

/** The note for a pass that went through swaps: one line for each that touches the card's nodes, none when none does. */
export function swapNote(swaps: readonly Swap[] | undefined, targets?: readonly string[]): string | undefined {
  const lines = (swaps ?? []).filter((s) => touches(s, targets)).map(lineOf);
  const unique = lines.filter((l, i) => lines.indexOf(l) === i);
  return unique.length ? unique.join(' ') : undefined;
}

const key = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

/** What differs between two renderings of one sentence, as the words each has that the other lacks: trims what they share at both ends. */
export function changed(a: string, b: string): { from: string; to: string } {
  const x = key(a).split(' '), y = key(b).split(' ');
  let s = 0;
  while (s < x.length && s < y.length && x[s] === y[s]) s++;
  let e = 0;
  while (e < x.length - s && e < y.length - s && x[x.length - 1 - e] === y[y.length - 1 - e]) e++;
  return { from: x.slice(s, x.length - e).join(' '), to: y.slice(s, y.length - e).join(' ') };
}
