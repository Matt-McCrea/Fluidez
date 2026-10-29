// Which nodes get a production (en→es) card. Decided once per node, at
// introduce time; the receptive→productive unlock rule itself is unchanged.
//
//  - grammar, pattern, chunk and contrast nodes: always productive (they are
//    what the learner must be able to say);
//  - lexemes with a frequency rank ≤ PRODUCTIVE_FREQ_RANK: productive;
//  - lexemes without a rank yet (the vocab rebuild has not reached them): by
//    the band that teaches them: A1–B1 productive, B2–C1 receptive-only;
//  - every other lexeme: receptive-only (recognised in reading, never asked
//    for en→es). This is what keeps the B2/C1 review load bounded.
import type { Band, GraphNode } from '../content/schema';

export const PRODUCTIVE_FREQ_RANK = 3000;
export const PRODUCTIVE_BANDS_WITHOUT_RANK: readonly Band[] = ['A1', 'A2', 'B1'];

export interface PolicyNode { kind: GraphNode['kind']; band?: Band; freqRank?: number }

export function productivePolicy(n: PolicyNode): boolean {
  switch (n.kind) {
    case 'grammar': case 'pattern': case 'chunk': case 'contrast': return true;
    case 'cando': return false;
    case 'lexeme':
      if (n.freqRank !== undefined) return n.freqRank <= PRODUCTIVE_FREQ_RANK;
      return n.band === undefined || PRODUCTIVE_BANDS_WITHOUT_RANK.includes(n.band);
  }
}
