// What the games say when a round ends. Every line is a fact about this round, said the way
// a person would say it: a number that can be checked against the round, a comparison with
// the learner's own earlier rounds, nothing else. No praise for effort the app cannot see,
// nothing about where the learner is in the course or how they compare with anyone, and
// nothing that makes a score feel like a debt (R22). When there is nothing specific and true
// to say, nothing is said.
//
// The one flourish is a word the learner has been taught: "¡Qué bien!" after a new best or
// a clean round, with what it means beside it, and only once the chunk is theirs.
import type { Learner } from '../learner';
import type { FlashResult } from './flash';
import type { RescueResult } from './rescue';
import { SKIP_SECONDS, WRONG_SECONDS } from './round';
import type { BestResult } from './store';

/** A taught exclamation and what it means. Never shown before the chunk it belongs to has been taught. */
export interface Cheer { es: string; en: string }
const CHEERS: ReadonlyArray<{ node: string } & Cheer> = [{ node: 'c:que-bien', es: '¡Qué bien!', en: 'Great!' }];

export function cheer(learner: Pick<Learner, 'isIntroduced'>): Cheer | undefined {
  const c = CHEERS.find((x) => learner.isIntroduced(x.node));
  return c ? { es: c.es, en: c.en } : undefined;
}

/** A score against the best before it. Nothing when there was no best and this is not one. */
export function bestLine(score: number, best: BestResult): string {
  if (best.isBest) return best.was === undefined ? 'That is your first score here.' : `A new best. The one before was ${best.was}.`;
  if (best.was === undefined) return '';
  return best.was === score ? 'Level with your best.' : `${best.was - score} short of your best of ${best.was}.`;
}

const days = (n: number) => (n === 1 ? 'a day' : `${n} days`);
const times = (n: number) => (n === 2 ? 'twice' : n === 3 ? 'three times' : `${n} times`);
const seconds = (n: number) => (n === 1 ? 'a second' : `${n} seconds`);

/** The person of a form that slipped: "preterito|ellos" is "ellos". */
const personOf = (cell: string): string => cell.split('|')[1] ?? cell;

export interface RoundReaction { /** a taught word, when the round earned it */ cheer?: Cheer; /** one sentence that is specific and true, if there is one */ remark?: string }

/**
 * What a Relámpago round earned in words. The first of these that is true is said: a clean minute, a pass
 * chosen over a guess, the form that kept slipping, a climb over the two rounds before, what the wrong
 * answers cost.
 */
export function flashReaction(r: FlashResult, taught: Cheer | undefined): RoundReaction {
  const clean = r.wrong === 0;
  const earned = r.best.isBest && r.best.was !== undefined ? true : clean && r.score >= 5;
  const out: RoundReaction = earned && taught ? { cheer: taught } : {};
  if (clean && r.skipped > 0) return { ...out, remark: `Nothing wrong, and you passed on ${r.skipped} instead of guessing.` };
  if (clean && r.score >= 5) return { ...out, remark: 'Not one wrong in the whole minute.' };
  if (r.slipped) return { ...out, remark: `The ${personOf(r.slipped.cell)} form slipped ${times(r.slipped.times)}.` };
  const [a, b] = r.before.slice(-2);
  if (a !== undefined && b !== undefined && a < b && b < r.score) return { ...out, remark: 'Three rounds in a row, each better than the last.' };
  if (r.wrong >= 3) {
    const kind = r.deck === 'palabras' ? 'choose' : 'type';
    return { ...out, remark: `The ${r.wrong} wrong answers took ${seconds(r.wrong * WRONG_SECONDS[kind])} off the clock. Passing on them would have taken ${seconds(Math.round(r.wrong * SKIP_SECONDS * 10) / 10)}.` };
  }
  return out;
}

/** What a rescue came to, as facts: how many were remembered, when they come back, what comes back sooner. */
export function rescueLines(r: RescueResult): string[] {
  const out: string[] = [];
  if (r.within) out.push(r.within.from === r.within.to ? `The ones you saved are set to come back in ${days(r.within.from)}.` : `The ones you saved are set to come back in ${r.within.from} to ${days(r.within.to)}.`);
  if (r.missed) out.push(r.missed === 1 ? 'The one you missed comes back sooner.' : `The ${r.missed} you missed come back sooner.`);
  return out;
}

export function rescueReaction(r: RescueResult, taught: Cheer | undefined): RoundReaction {
  if (r.of >= 3 && r.missed === 0) return { ...(taught ? { cheer: taught } : {}), remark: 'Not one missed.' };
  return {};
}

/**
 * A reading that counted. Said only if it is better news than the last: faster than the last reading of a chapter like this
 * (`last`, in words a minute). A slower one is not remarked on, and neither is one with nothing before it.
 */
export function rereadReaction(run: { wpm: number; counted: boolean }, best: BestResult | null, taught: Cheer | undefined, last: number | undefined): RoundReaction {
  if (!run.counted) return {};
  const earned = !!best?.isBest && best.was !== undefined;
  return {
    ...(earned && taught ? { cheer: taught } : {}),
    ...(last !== undefined && run.wpm > last ? { remark: `${run.wpm - last} words a minute faster than the last time.` } : {}),
  };
}
