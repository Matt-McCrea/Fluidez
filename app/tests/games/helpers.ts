// A learner who owns things, and the real course's graph to deal them from. The graph is real (units and nodes, a few
// hundred kilobytes); the bank, the chapters and the scripts are not loaded, since a game that deals words and forms
// needs none of them.
import { verbByInf } from '../../src/engine';
import { Learner, MemoryStore, Rating } from '../../src/learner';
import { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';

export const DAY = 86_400_000;
export const T0 = Date.UTC(2026, 10, 1, 12);

let graph: Promise<Bundle> | undefined;
/** The real course's graph as a bundle with no sentences. */
export function graphBundle(): Promise<Bundle> {
  return (graph ??= (async () => {
    const { units, nodes } = await new ContentLoader().core();
    return new Bundle(units, nodes, { sentences: [], chapters: [], scenes: [], writing: [], scripts: [], contrasts: [] });
  })());
}

export async function learnerAt(clock: { t: number }): Promise<Learner> {
  return Learner.open(new MemoryStore(), { now: () => clock.t });
}

/** Make a node owned: remembered after a wait, stable for `days`. */
export function own(learner: Learner, id: string, days = 20, at = T0 - 30 * DAY): void {
  learner.seedKnown(id, { at, productive: true, receptive: { stability: days, dueAt: at + days * DAY }, productiveCard: { stability: days, dueAt: at + days * DAY } });
}

/** Ten attempts at a node with no clock, `right` of them well. */
export function calmAttempts(learner: Learner, node: string, right: number, at = T0 - DAY): void {
  for (let i = 0; i < 10; i++) {
    learner.expose([node], { at: at + i, event: { op: 'type', direction: 'productive', grade: i < right ? Rating.Good : Rating.Again, tries: i < right ? 1 : 2, novel: false } });
  }
}

export const VERBS = ['hablar', 'comer', 'vivir', 'tener', 'ir', 'hacer', 'poder', 'decir'];

export const TENSE_NODE = 'g:preterite-ar';

/** Words that are not verbs, so a verb a test owns is only ever a verb of a forms deck. */
export const wordIds = (bundle: Bundle, n: number): string[] =>
  [...bundle.course.nodes.values()].filter((x) => x.kind === 'lexeme' && x.es && x.en && x.id.startsWith('l:') && !verbByInf(x.id.slice(2))).slice(0, n).map((x) => x.id);

/** A learner who owns eight verbs and a tense they have been getting right (`right` of the last ten), and `words` words. */
export async function ready(bundle: Bundle, over: { words?: number; right?: number } = {}) {
  const clock = { t: T0 };
  const learner = await learnerAt(clock);
  for (const v of VERBS) own(learner, `l:${v}`);
  own(learner, TENSE_NODE);
  calmAttempts(learner, TENSE_NODE, over.right ?? 10);
  for (const w of wordIds(bundle, over.words ?? 20)) own(learner, w);
  return { clock, learner };
}
