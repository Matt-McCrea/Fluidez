// What the games say when a round ends. Every line is a fact about this round that
// can be checked against it, said the way a person would say it: no praise for
// effort the app cannot see, nothing about where the learner is in the course, and
// nothing that makes a score feel like a debt.
import type { BestResult } from './store';

/** A score against the best before it. Nothing when there was no best and this is not one. */
export function bestLine(score: number, best: BestResult): string {
  if (best.isBest) return best.was === undefined ? 'That is your first score here.' : `A new best. The one before was ${best.was}.`;
  if (best.was === undefined) return '';
  return best.was === score ? 'Level with your best.' : `${best.was - score} short of your best of ${best.was}.`;
}
