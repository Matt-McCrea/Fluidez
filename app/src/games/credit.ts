// THE ONLY PLACE A GAME TOUCHES THE LEARNER. Every answer in a game reaches the
// learner model through these calls and nowhere else, so what a game may do to
// the schedule is decided in one file (R23).
//
//   Relámpago (flash)  exposure only. A speed game never moves a card: a slip at
//                      speed is not the learner forgetting, and one touch at any
//                      time would hide a shortfall or lapse a stable card.
//   De corrido         exposure on the words of a chapter already read, once, if
//                      the run counted. Nothing is graded.
//   Rescate            real reviews, and only of cards that are due: no clock,
//                      in the card's own direction, hits and misses both count.
//
// Time never gets in. `ms` is not a field of anything written here, so it cannot
// reach `Learner.recordTime`, and a game cannot change the seconds a review takes
// that every lesson budget divides by (`spr`). All of it goes through the attempt
// seam (ui/session/attempt.ts), which also never lets a clock reading near a grade.
import type { NodeId } from '../content/schema';
import { Rating, type Direction, type Grade, type Learner } from '../learner';
import { reviewSentence, seen, seenAbout } from '../ui/session/attempt';

/** The ops the games write on the event log. Weak spots read both as form drills (learner/weak.ts). */
export const FLASH_OP = 'flash';
export const RESCUE_OP = 'rescue';

export interface FlashAnswer {
  /** the node the answer is about: the tense of a form, or the word */
  target: NodeId;
  /** everything the item showed that the learner owns, the target included; these count as seen */
  credit: readonly NodeId[];
  right: boolean;
  at: number;
  direction?: Direction;
}

/**
 * One answer in a speed round: an exposure, and an event on the target alone (a form
 * is written once, not once for every node it shows). A pass over an item is a miss
 * here as it is anywhere: the learner did not retrieve it.
 */
export function creditFlash(learner: Learner, a: FlashAnswer): void {
  seenAbout(learner, a.target, a.credit, {
    op: FLASH_OP, direction: a.direction ?? 'productive', grade: a.right ? Rating.Good : Rating.Again, tries: 1, novel: false,
  }, a.at);
}

/** The words of a chapter the learner has just read again, counted as seen. Only a run that counted gets here. */
export function creditReading(learner: Learner, nodes: Iterable<NodeId>, at: number): void {
  seen(learner, nodes, at);
}

export interface RescueAnswer {
  node: NodeId;
  direction: Direction;
  grade: Grade;
  at: number;
  tries: 1 | 2;
  sentence?: string;
  novel?: boolean;
  err?: string;
  rule?: string;
  claimed?: boolean;
}

/** Whether a card is due: it exists, is in play, and its time has come. */
export function isDue(learner: Learner, node: NodeId, direction: Direction, at: number): boolean {
  const c = learner.card(node, direction);
  return !!c && !c.suspended && c.due <= at;
}

/**
 * A real review of one due card. A card that is not due is not touched, whatever the
 * caller meant: the schedule is moved by reviews that are asked for, never by a game
 * that happens to show something early. Returns whether the card was reviewed.
 */
export function creditRescue(learner: Learner, a: RescueAnswer): boolean {
  if (!learner.hasCard(a.node, a.direction) || !isDue(learner, a.node, a.direction, a.at)) return false;
  reviewSentence(learner, [a.node], a.direction, a.grade, {
    at: a.at, op: RESCUE_OP, tries: a.tries,
    ...(a.sentence ? { sentence: a.sentence } : {}), ...(a.novel !== undefined ? { novel: a.novel } : {}),
    ...(a.err ? { err: a.err } : {}), ...(a.rule ? { rule: a.rule } : {}), ...(a.claimed ? { claimed: true } : {}),
  });
  return true;
}
