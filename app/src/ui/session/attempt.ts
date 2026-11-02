// THE ATTEMPT SEAM. An answered card reaches the learner model here and nowhere
// else: the session runner, free practice and the simulator all credit an answer
// through these calls, so what an answer does to a grade, an exposure or the
// output ladder is decided in one file. What each caller decides first (which
// nodes an answer is about, whether a card has a record yet) stays with the
// caller; what is done with that decision is here.
//
// Nothing here chooses a grade or a time. `gradeOf` turns an outcome into a
// grade, and no clock reading ever reaches it (R17).
import type { Item } from '../../compiler';
import type { NodeId } from '../../content/schema';
import type { GapKind } from '../../check/translate/hints';
import type { Feature } from '../../exercises/types';
import {
  Rating, type Direction, type ExposureEvent, type Grade, type Learner, type ReviewOptions, type SentenceCreditOptions, type StepResult,
} from '../../learner';
import { contentRev } from '../data/rev';
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
  // What the attempts log keeps (see logAnswer). None of it is read by `gradeOf`, and no clock reading ever is (R17).
  /** the card's look as delivered (see formatOf) */
  fmt?: string;
  /** what the learner gave on the first try: the text typed, or the option picked ('' for "I don't know") */
  given?: string;
  /** the right version, when the learner was shown it */
  shown?: string;
  /** ms from the card appearing to the first key */
  firstKeyMs?: number;
  /** the kind of slip the checker named on the first try (a HintKind), and the trap rule that named it */
  err?: string;
  rule?: string;
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

// ---------------------------------------------------------------- the attempts log

/** A wrong pick on options that differ in one feature puts the slip on that feature, in the words the checker uses for a typed one. */
const FEATURE_SLIP: Record<Feature, GapKind> = {
  tense: 'tense', person: 'person', mood: 'mood', clitic: 'pronoun', copula: 'ser-estar', porpara: 'por-para', number: 'number', gender: 'agreement',
};

/** The kind of slip an answer made, if one was named, and the rule that named it: the fields an event carries them in, on its first event only. */
export function slipOf(o: Outcome): { err?: string; rule?: string } {
  const picked = o.evidence?.picked, feature = o.evidence?.feature;
  const err = o.err ?? (!o.correct && typeof picked === 'number' && feature ? FEATURE_SLIP[feature] : undefined);
  return { ...(err ? { err } : {}), ...(o.rule ? { rule: o.rule } : {}) };
}

/** What an answer was about, for its row: the node it is graded for, the op its event carries, and the sentence if there was one. */
export interface Answered { node: NodeId; op: string; sentence?: string }

/**
 * Write the attempts-log row for one answered card: once per answer, by whichever caller took it. A card
 * that asked for no answer has none to log. The text of the answer lives here and on no event.
 */
export function logAnswer(learner: Learner, at: number, about: Answered, o: Outcome): void {
  if (o.exposure) return;
  const rev = contentRev();
  learner.recordAttempt({
    at, node: about.node, op: about.op, fmt: o.fmt ?? '', given: o.given ?? '', verdict: o.correct ? 'right' : 'wrong', tries: tries12(o.tries),
    ...(about.sentence ? { sentence: about.sentence } : {}),
    ...(!o.correct && o.shown ? { answer: o.shown } : {}),
    ...slipOf(o),
    ...(o.firstKeyMs !== undefined ? { firstKeyMs: o.firstKeyMs } : {}),
    ...(rev ? { contentRev: rev } : {}),
  });
}

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

// ---------------------------------------------------------------- a miss comes back (F7)

/** A target missed in practice, and the sentence it was missed in: asked again today in another, and again next session. */
export interface Retest { node: NodeId; direction: Direction; sentence: string }

/**
 * Whether an answer is a miss that comes back. A practice item on a sentence, answered wrongly, queues its target for a fresh
 * sentence later in the session ("Before you go") and for a short run at the start of the next one (the remediation list). A warm-up
 * review already comes back as a lapse; a card that asked for no answer, a reading check (the checkpoint marks those itself) and a
 * free-form answer do not: a miss in "Answer for yourself" is signal only, and training goes by form.
 */
export function missRetest(item: Pick<Item, 'op'> & { node: NodeId; sentence?: string; direction?: Direction }, o: Pick<Outcome, 'correct'> & { exposure?: boolean }): Retest | undefined {
  if (o.correct || o.exposure || !item.sentence) return undefined;
  if (!['pick', 'choose', 'type', 'transform', 'recombine', 'translate', 'gap'].includes(item.op)) return undefined;
  return { node: item.node, direction: item.direction ?? 'productive', sentence: item.sentence };
}

/** Move a node on the output ladder by how an answer went. */
export function climb(learner: Learner, node: NodeId, o: Pick<Outcome, 'correct' | 'tries'>): void {
  learner.stepRung(node, ladderMove(o));
}
