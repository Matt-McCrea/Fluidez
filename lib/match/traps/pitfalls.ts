/* ============================================================================
 * PITFALLS: the wrong sentences the course's own lessons warn about.
 *
 * Every lesson script lists the mistakes an English speaker makes at that
 * point (`pitfalls`: the wrong sentence, the right one, why). 2,933 of them is
 * the most valuable thing the course knows about its learners' errors, and
 * firing them as one global dictionary is wrong five times in twenty: a
 * sentence that is wrong at one node is right at another (contrastive review,
 * section 5; innovation's pilot: 20 hits, 5 wrong). So a pitfall belongs to
 * the node of its script, and speaks only on a card about that node.
 *
 * The table is a derived file (content/_pitfalls/pitfalls.json, built by
 * `npm run pitfalls`, checked by the gate), because a review's script may be
 * outside the window the device has loaded. It holds the canonical key of the
 * wrong sentence, not the sentence, and the lesson's own reason. A pitfall
 * with an unrepaired verified claim against it is left out of the file until
 * the content is fixed (R14: trap rules wait for false pitfalls to be fixed).
 * ========================================================================== */
import { advKey, canon, key } from '../canon';

/** The file: for each node, the canonical key of each wrong sentence and why it is wrong. */
export interface PitfallFile {
  version: 1;
  about: string;
  nodes: Record<string, Array<[wrong: string, why: string]>>;
}

export const PITFALLS_ABOUT = 'The wrong sentences of every lesson script, by node, as canonical keys with the lesson\'s reason. Derived from content/scripts by npm run pitfalls and checked by the gate. Never edited by hand.';

/**
 * The key a sentence is looked up under: its canonical tokens, the way the matcher reads it, and the words canon sets aside. Without those
 * "Ustedes trabajas en Bogotá" would be "Trabajas en Bogotá" and "Es también tarde" would be "Es tarde", and the lesson's reason would
 * speak about a word the learner never wrote.
 */
export const pitfallKey = (text: string): string => {
  const c = canon(text);
  return key(c) && [key(c), [...c.pronouns].sort().join(' '), advKey(c)].join('|');
};

let table: ReadonlyMap<string, ReadonlyMap<string, string>> = new Map();

/** Make a table the one in force: the loader does it with the file, a test with its own. Anything that is not a table is no pitfalls. */
export function registerPitfalls(file: PitfallFile | undefined): void {
  const next = new Map<string, ReadonlyMap<string, string>>();
  if (file && typeof file === 'object' && file.nodes && typeof file.nodes === 'object') {
    for (const [node, rows] of Object.entries(file.nodes)) {
      if (!Array.isArray(rows)) continue;
      next.set(node, new Map(rows.filter((r): r is [string, string] => Array.isArray(r) && typeof r[0] === 'string' && typeof r[1] === 'string')));
    }
  }
  table = next;
}

/** How many nodes have pitfalls in force. */
export const pitfallNodes = (): number => table.size;

/** The lesson's reason for this wrong sentence, when it is one of the pitfalls of a node the card is about. */
export function pitfallFor(nodes: readonly string[] | undefined, input: string): { node: string; why: string } | undefined {
  if (!nodes?.length || !table.size) return undefined;
  const k = pitfallKey(input);
  if (!k) return undefined;
  for (const node of nodes) {
    const why = table.get(node)?.get(k);
    if (why) return { node, why };
  }
  return undefined;
}
