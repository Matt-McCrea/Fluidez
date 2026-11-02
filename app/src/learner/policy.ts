// Which nodes get a production (en→es) card. Decided once per node, at
// introduce time; the receptive→productive unlock rule itself is unchanged.
//
//  - grammar, pattern, chunk and contrast nodes: always productive (they are
//    what the learner must be able to say);
//  - lexemes with a frequency rank ≤ PRODUCTIVE_FREQ_RANK: productive;
//  - lexemes without a rank yet (the vocab rebuild has not reached them): by
//    the band that teaches them: A1–B1 productive, B2–C1 receptive-only;
//  - every other lexeme: receptive-only (recognised in reading, never asked
//    for en→es). This is what keeps the B2/C1 review load bounded;
//  - a node that is recognition only, whatever its kind (voseo, vosotros, the
//    future subjunctive, Peninsular chunks): receptive-only. Recognition is a
//    level, not a failure, and nobody is asked to type what the course does not
//    want said (LC1-004, LC1-005).
import type { Band, GraphNode } from '../content/schema';

export const PRODUCTIVE_FREQ_RANK = 3000;
export const PRODUCTIVE_BANDS_WITHOUT_RANK: readonly Band[] = ['A1', 'A2', 'B1'];

export interface PolicyNode { kind: GraphNode['kind']; band?: Band; freqRank?: number; recognition?: boolean }

/**
 * Whether the graph says the learner is to recognise this node and never produce it: a variety that is not neutral, a note that
 * opens "Recognition" (a note that only says some variant of a pattern is recognition only, as p:pasarla-bien's does, does not make
 * the pattern so), the id the content gate has always read (-recognition, -spain, -vosotros, -voseo, -peninsular) or one it names.
 */
export function recognitionOnly(n: Pick<GraphNode, 'id'> & Partial<Pick<GraphNode, 'variety' | 'note'>>): boolean {
  return (n.variety !== undefined && n.variety !== 'neutral') || /^\s*recognition\b/i.test(n.note ?? '') || RECOGNITION_IDS.has(n.id) || /-(recognition|spain|vosotros|voseo|peninsular)$/.test(n.id);
}
/** The grammar points the content gate has always known as recognition (tools/gate/checks.ts RECOGNITION_NODES). */
const RECOGNITION_IDS: ReadonlySet<string> = new Set(['g:vosotros-recognition', 'g:voseo-recognition', 'g:spain-pasts', 'g:se-form-recognition', 'g:future-subj-recognition']);

export function productivePolicy(n: PolicyNode): boolean {
  if (n.recognition) return false;
  switch (n.kind) {
    case 'grammar': case 'pattern': case 'chunk': case 'contrast': return true;
    case 'cando': return false;
    case 'lexeme':
      if (n.freqRank !== undefined) return n.freqRank <= PRODUCTIVE_FREQ_RANK;
      return n.band === undefined || PRODUCTIVE_BANDS_WITHOUT_RANK.includes(n.band);
  }
}
