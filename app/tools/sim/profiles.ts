// Synthetic learner profiles and their response model.
//
// P(correct) on a review = R^exponent + noise, R = the FSRS retrievability of
// the card at that moment (so a learner who forgets faster than FSRS assumes
// has exponent > 1). In-lesson learning steps succeed with `learnP`, rising
// a little per step. Each calendar day the learner may skip, may start a break
// (irregular), may do only a minimum session, or may do two sessions.
import type { Tier } from '../../src/learner';

export interface Profile {
  name: string;
  /** P(skip a given day) */
  skipP: number;
  /** P(a skipped day starts a multi-day break), and its length range */
  breakP: number;
  breakDays: [number, number];
  /** P(a second session that day, when offered) */
  doubleP: number;
  /** P(the day is a minimum session instead of the chosen tier) */
  minimumP: number;
  /** in-lesson retrieval success */
  learnP: number;
  /** P(correct) = R^exponent: < 1 remembers better than FSRS predicts, > 1 worse */
  exponent: number;
  noise: number;
  /** P(Easy) on a correct answer */
  easyP: number;
  /** mean seconds per review */
  secs: number;
}

export const PROFILES: Record<string, Profile> = {
  fast:      { name: 'fast',      skipP: 0.05, breakP: 0,    breakDays: [0, 0],  doubleP: 0.3,  minimumP: 0.05, learnP: 0.9,  exponent: 0.7, noise: 0.04, easyP: 0.15, secs: 7 },
  average:   { name: 'average',   skipP: 0.12, breakP: 0.05, breakDays: [2, 4],  doubleP: 0.1,  minimumP: 0.1,  learnP: 0.8,  exponent: 1.0, noise: 0.05, easyP: 0.05, secs: 10 },
  forgetful: { name: 'forgetful', skipP: 0.15, breakP: 0.05, breakDays: [2, 5],  doubleP: 0.05, minimumP: 0.1,  learnP: 0.7,  exponent: 1.6, noise: 0.06, easyP: 0.02, secs: 12 },
  irregular: { name: 'irregular', skipP: 0.3,  breakP: 0.15, breakDays: [3, 10], doubleP: 0.15, minimumP: 0.25, learnP: 0.8,  exponent: 1.0, noise: 0.05, easyP: 0.05, secs: 10 },
};

export function profileList(names: string[]): Profile[] {
  return names.map((n) => {
    const p = PROFILES[n];
    if (!p) throw new Error(`unknown profile "${n}" (known: ${Object.keys(PROFILES).join(', ')})`);
    return p;
  });
}

export type { Tier };
