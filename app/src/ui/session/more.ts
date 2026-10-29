// "Got 15 more minutes? Keep going." There is no session-length setting: every
// session is the standard one. Now and then, when it would genuinely help and
// cost nothing, the close screen suggests a little more: the learner has
// practised at least three days in a row, the review backlog is low (another
// session would not be throttled, and little is due), and the suggestion has
// not been made in the last few days. Never two days running.
import type { Learner } from '../../learner';
import type { Bundle } from '../data/bundle';
import { anotherAllowed } from './runner';
import { streak, type UiStore } from '../store/ui';

export const MORE_MINUTES = 15;
export const MORE_MIN_STREAK = 3;
/** days between two suggestions */
export const MORE_EVERY_DAYS = 3;
/** "little is due": at most this many reviews due right now */
export const MORE_MAX_DUE = 10;

const dayNum = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return Math.round(new Date(y, m - 1, d).getTime() / 86_400_000);
};

/** Whether to suggest more today; marks today as offered when it does. Call after the session is finished. */
export function offerMore(learner: Learner, bundle: Bundle, ui: UiStore, now: number): boolean {
  const today = learner.day(now);
  const st = ui.state;
  if (streak(st.stats.days, today) < MORE_MIN_STREAK) return false;
  if (st.stats.lastDay === today && st.stats.today > 1) return false; // already did more today
  if (st.moreOfferedOn && dayNum(today) - dayNum(st.moreOfferedOn) < MORE_EVERY_DAYS) return false;
  if (learner.due(now).length > MORE_MAX_DUE) return false;
  if (!anotherAllowed(learner, bundle, ui, now)) return false;
  void ui.update((s) => { s.moreOfferedOn = today; });
  return true;
}
