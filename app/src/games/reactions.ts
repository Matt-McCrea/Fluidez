// What the games say when a round ends. Every line is a fact about this round that
// can be checked against it, said the way a person would say it: no praise for
// effort the app cannot see, nothing about where the learner is in the course, and
// nothing that makes a score feel like a debt.
import type { RescueResult } from './rescue';
import type { BestResult } from './store';

/** A score against the best before it. Nothing when there was no best and this is not one. */
export function bestLine(score: number, best: BestResult): string {
  if (best.isBest) return best.was === undefined ? 'That is your first score here.' : `A new best. The one before was ${best.was}.`;
  if (best.was === undefined) return '';
  return best.was === score ? 'Level with your best.' : `${best.was - score} short of your best of ${best.was}.`;
}

const days = (n: number) => (n === 1 ? 'a day' : `${n} days`);

/** What a rescue came to, as facts: how many were remembered, when they come back, what comes back sooner. */
export function rescueLines(r: RescueResult): string[] {
  const out: string[] = [`Saved ${r.saved} of ${r.of}.`];
  if (r.within) out.push(r.within.from === r.within.to ? `The ones you saved are set to come back in ${days(r.within.from)}.` : `The ones you saved are set to come back in ${r.within.from} to ${days(r.within.to)}.`);
  if (r.missed) out.push(r.missed === 1 ? 'The one you missed comes back sooner.' : `The ${r.missed} you missed come back sooner.`);
  return out;
}
