// THE ATTEMPT SEAM. An answered card reaches the learner model here and nowhere
// else: the session runner, free practice and the simulator all credit an answer
// through these calls, so what an answer does to a grade, an exposure or the
// output ladder is decided in one file. What each caller decides first (which
// nodes an answer is about, whether a card has a record yet) stays with the
// caller; what is done with that decision is here.
//
// Nothing here chooses a grade or a time. `gradeOf` turns an outcome into a
// grade, and no clock reading ever reaches it (R17).
import type { NodeId } from '../../content/schema';
import {
  Rating, type Direction, type ExposureEvent, type Grade, type Learner, type ReviewOptions, type SentenceCreditOptions, type StepResult,
} from '../../learner';
import type { Evidence } from './attribute';

export interface Outcome {
  correct: boolean;
  /** attempts used (1 = first try) */
  tries: number;
  /** measured time to answer, ms */
  ms: number;
  /** what the card saw, for splitting a miss across a multi-target item (see attribute.ts) */
  evidence?: Evidence;
  /** passed through an untaught synonym: grades as Hard */
  lenient?: boolean;
  /** the card asked for no answer (a read card): it was shown, so it can be exposure but never a grade */
  exposure?: boolean;
}

/** First-try pass → Good; pass on the retry → Hard; shown the answer → Again. */
export function gradeOf(o: Pick<Outcome, 'correct' | 'tries'> & { lenient?: boolean }): Grade {
  if (!o.correct) return Rating.Again;
  if (o.lenient) return Rating.Hard;
  return o.tries <= 1 ? Rating.Good : Rating.Hard;
}

export const tries12 = (t: number): 1 | 2 => (t > 1 ? 2 : 1);

/** The event-log op for an item: warm-up reviews are 'warmup', everything else its own op. */
export const eventOp = (item: { op: string }): string => (item.op === 'review' ? 'warmup' : item.op);

/** Which way an outcome moves a node on the output ladder. */
export const ladderMove = (o: Pick<Outcome, 'correct' | 'tries'>): 'miss' | 'pass' | 'retry' => (!o.correct ? 'miss' : o.tries <= 1 ? 'pass' : 'retry');

// ---------------------------------------------------------------- crediting an answer

/** Nodes an answer shows the learner, with no grade and no event of their own. */
export function seen(learner: Learner, nodes: Iterable<NodeId>, at: number): void {
  learner.expose(nodes, { at });
}

/**
 * An answered sentence is graded for its target alone. The other nodes it
 * needs are counted as seen, with no event of their own: Weak spots reads the
 * events, and a miss logged for every node would charge the preterite for a
 * por/para slip.
 */
export function seenAbout(learner: Learner, target: NodeId, credit: readonly NodeId[], event: ExposureEvent, at: number): void {
  seen(learner, credit.filter((n) => n !== target), at);
  learner.expose(credit.filter((n) => n === target), { at, event });
}

/** An answer that only counts as exposure, logged as an event on each node. */
export function seenWithEvent(learner: Learner, nodes: Iterable<NodeId>, event: ExposureEvent, at?: number): void {
  learner.expose(nodes, { at, event });
}

/** A scored review of one sentence: its targets are reviewed, the rest of its nodes get partial credit. */
export function reviewSentence(learner: Learner, nodes: NodeId[], direction: Direction, grade: Grade, opts: SentenceCreditOptions): void {
  learner.creditSentence(nodes, direction, grade, opts);
}

/** A scored review of one node with no sentence behind it. */
export function reviewNode(learner: Learner, node: NodeId, direction: Direction, grade: Grade, opts: ReviewOptions): void {
  learner.review(node, direction, grade, opts);
}

/** One in-lesson retrieval of a node being introduced. */
export function lessonStep(learner: Learner, node: NodeId, correct: boolean, opts: Parameters<Learner['learningStep']>[2]): StepResult {
  return learner.learningStep(node, correct, opts);
}

/** Move a node on the output ladder by how an answer went. */
export function climb(learner: Learner, node: NodeId, o: Pick<Outcome, 'correct' | 'tries'>): void {
  learner.stepRung(node, ladderMove(o));
}
