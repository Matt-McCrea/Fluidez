/* ============================================================================
 * ONE SELF-CORRECTION ATTEMPT, then the answer.
 *
 * The learner types. Right: done. Wrong: they get one plain-English hint and
 * one more try. Wrong again: the answer is shown, with the hint as the
 * reason. A pure state machine, so the UI owns rendering and the session can
 * persist mid-item.
 *
 *   let st = startAttempt(sentence);
 *   const r1 = submitAttempt(st, 'Como pecado');   // r1.status 'retry', r1.result.hint
 *   const r2 = submitAttempt(r1.state, 'Como pescado'); // 'correct', grade 'hard'
 * ========================================================================== */
import { matchTranslation, type MatchOptions, type SentenceLike, type TranslationResult } from './match';

export type AttemptStatus = 'correct' | 'retry' | 'revealed';
/** For the scheduler: first-try pass, second-try pass, or shown. */
export type AttemptGrade = 'good' | 'hard' | 'again';

export interface AttemptState {
  sentence: SentenceLike;
  opts: MatchOptions;
  tries: number;
  done: boolean;
  history: Array<{ input: string; result: TranslationResult }>;
}

export interface AttemptStep {
  state: AttemptState;
  status: AttemptStatus;
  result: TranslationResult;
  /** Set once the item is finished. */
  grade?: AttemptGrade;
  /** On 'revealed': the answer to show (the accepted form closest to what they typed). */
  answer?: string;
}

export const MAX_TRIES = 2;

export function startAttempt(sentence: SentenceLike, opts: MatchOptions = {}): AttemptState {
  return { sentence, opts, tries: 0, done: false, history: [] };
}

export function submitAttempt(state: AttemptState, input: string): AttemptStep {
  if (state.done) throw new Error('attempt already finished');
  const result = matchTranslation(input, state.sentence, state.opts);
  const tries = state.tries + 1;
  const history = [...state.history, { input, result }];
  if (result.pass) {
    return { state: { ...state, tries, done: true, history }, status: 'correct', result, grade: tries === 1 ? 'good' : 'hard' };
  }
  if (tries < MAX_TRIES) return { state: { ...state, tries, history }, status: 'retry', result };
  return { state: { ...state, tries, done: true, history }, status: 'revealed', result, grade: 'again', answer: result.closest };
}
