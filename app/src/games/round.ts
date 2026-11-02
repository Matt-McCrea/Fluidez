// The clock of a timed round, as a pure reducer: (state, event) => state, with time
// handed in and never read, so a test can play a round at any speed.
//
// Sixty seconds. A right answer scores one. A wrong answer takes seconds off the clock
// at once, then the clock stops while the correction is on screen, so reading it is
// free and carelessness is not. Passing over an item costs a little, and always
// less than a wrong answer: not knowing is better than guessing, and the numbers
// below are chosen so that it is (tests/games/round.test.ts holds them to it).
//
// A tap among four can be guessed, so a miss on one costs a lot. A typed form cannot,
// so a miss on one costs less. There is no bonus for a run of rights: rhythm is not
// what is being measured. The score is the count of rights, in the unit the learner
// would say it in ("14 forms"), and means something only inside its own deck.

export const ROUND_SECONDS = 60;

/** How an item is answered: a tap among options, or typed. */
export type Kind = 'choose' | 'type';

/** Seconds off the clock for a wrong answer. */
export const WRONG_SECONDS: Readonly<Record<Kind, number>> = { choose: 7, type: 3 };
/** Seconds off the clock for passing over an item. */
export const SKIP_SECONDS = 1.5;

export interface RoundState {
  /** ms on the clock; the round is over at 0 */
  left: number;
  /** the moment the clock was last brought up to */
  at: number;
  /** a correction is on screen, and the clock is stopped */
  paused: boolean;
  right: number;
  wrong: number;
  skipped: number;
  over: boolean;
}

export type RoundEvent =
  | { t: 'tick'; at: number }
  | { t: 'right'; at: number }
  | { t: 'wrong'; at: number; kind: Kind }
  | { t: 'skip'; at: number }
  | { t: 'resume'; at: number };

export const startRound = (at: number, seconds = ROUND_SECONDS): RoundState => ({ left: seconds * 1000, at, paused: false, right: 0, wrong: 0, skipped: 0, over: false });

/** Bring the clock up to `at`; a stopped clock only moves its mark. */
function advance(s: RoundState, at: number): RoundState {
  if (s.over) return s;
  const gone = s.paused ? 0 : Math.max(0, at - s.at);
  const left = Math.max(0, s.left - gone);
  return { ...s, left, at: Math.max(s.at, at), over: left <= 0 };
}

export function step(state: RoundState, e: RoundEvent): RoundState {
  let s = advance(state, e.at);
  // an answer that comes after the clock ran out is not an answer
  if (s.over || e.t === 'tick') return s;
  switch (e.t) {
    case 'right': s = { ...s, right: s.right + 1 }; break;
    case 'wrong': s = { ...s, wrong: s.wrong + 1, paused: true, left: Math.max(0, s.left - WRONG_SECONDS[e.kind] * 1000) }; break;
    case 'skip': s = { ...s, skipped: s.skipped + 1, paused: true, left: Math.max(0, s.left - SKIP_SECONDS * 1000) }; break;
    case 'resume': s = { ...s, paused: false, at: e.at }; break;
  }
  return { ...s, over: s.left <= 0 };
}

/** Whole seconds left, rounded up, for the screen. */
export const secondsLeft = (s: RoundState): number => Math.ceil(s.left / 1000);

/** Forms right in the round: the score. */
export const scoreOf = (s: RoundState): number => s.right;
