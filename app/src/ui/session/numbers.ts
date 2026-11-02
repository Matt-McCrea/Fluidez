// The numbers the Progress screen shows, worked out in one place so the screen
// and each month's kept copy of them (keep.ts) cannot differ. Pure: nothing here writes.
import type { NodeId } from '../../content/schema';
import type { Learner } from '../../learner';
import { backlogMinutes, delayedAccuracy7d, productionShareWeek, wordsThisWeek, type Rate } from '../../learner/metrics';
import type { Bundle } from '../data/bundle';
import { streakStatus, type CanDoMark, type CheckpointResult, type UiStore } from '../store/ui';

export type CanDoState = 'earned' | 'mostly' | 'notyet' | 'unchecked' | 'skipped';
export interface CanDoRow { id: string; canDo: string; state: CanDoState; /** what the state rests on: the learner's word, or a check */ how?: 'said' | 'checked' }

/** A check counts when at least this share of a unit's items came right first time. */
const CHECK_PASS = 0.7;

/**
 * Where each goal stands. A goal is ticked on evidence: the learner said yes, or a check of that
 * unit went well, whichever came last. A unit the path has passed with neither is covered, not
 * checked; one that placement jumped over is skipped. Only finished units, and units with a
 * mark or a check, are listed.
 */
export function canDoGroups(
  units: ReadonlyArray<{ id: string; canDo: string }>, finished: number, placedAt: number,
  marks: readonly CanDoMark[], checkpoints: readonly CheckpointResult[],
): Record<'earned' | 'getting' | 'unchecked' | 'skipped', CanDoRow[]> {
  const said = new Map<string, CanDoMark>();
  for (const m of marks) if (!said.has(m.unit) || m.at >= said.get(m.unit)!.at) said.set(m.unit, m);
  const checked = new Map<string, { at: number; right: number; total: number }>();
  for (const c of checkpoints) {
    for (const [unit, r] of Object.entries(c.byUnit)) {
      if (r.total > 0 && (!checked.has(unit) || c.at >= checked.get(unit)!.at)) checked.set(unit, { at: c.at, ...r });
    }
  }
  const row = (id: string, canDo: string, index: number): CanDoRow | undefined => {
    const m = said.get(id), c = checked.get(id);
    if (m && (!c || m.at > c.at)) return { id, canDo, state: m.feel === 'yes' ? 'earned' : m.feel, how: 'said' };
    if (c) return { id, canDo, state: c.right / c.total >= CHECK_PASS ? 'earned' : 'notyet', how: 'checked' };
    if (index >= finished) return undefined;
    return { id, canDo, state: index < placedAt ? 'skipped' : 'unchecked' };
  };
  const rows = units.map((u, i) => row(u.id, u.canDo, i));
  // a mark for a unit the course no longer has still counts, under the words the learner saw
  for (const m of said.values()) if (!units.some((u) => u.id === m.unit)) rows.push(row(m.unit, m.canDo, Infinity));
  const some = rows.filter((r): r is CanDoRow => !!r);
  return {
    earned: some.filter((r) => r.state === 'earned'),
    getting: some.filter((r) => r.state === 'mostly' || r.state === 'notyet'),
    unchecked: some.filter((r) => r.state === 'unchecked'),
    skipped: some.filter((r) => r.state === 'skipped'),
  };
}

/** What Progress reports, as numbers. The screen decides how many answers are enough to show a rate; these are the raw rates and their counts. */
export interface ProgressNumbers {
  /** words and phrases that have stuck, and those on their way */
  learned: number;
  learning: number;
  sessions: number;
  wordsRead: number;
  wordsWritten: number;
  /** days in a row, and days practised in all */
  streak: number;
  daysPracticed: number;
  /** things from last week still had, and the share of this week's practice that was Spanish produced */
  delayed: Rate;
  produced: Rate;
  /** minutes of reviews waiting */
  waitMinutes: number;
  /** words read and written in the last seven days */
  week: { read: number; written: number };
  /** goals ticked */
  goals: number;
  /** the share of the last check that came right first time */
  check?: number;
}

export function progressNumbers(p: { learner: Learner; ui: Pick<UiStore, 'state' | 'path'>; bundle: Bundle; now: number }): ProgressNumbers {
  const { learner, ui, bundle, now } = p;
  const units = bundle.course.units;
  const words = learner.nodes().filter((id: NodeId) => {
    const k = bundle.node(id)?.kind ?? (id.startsWith('l:') ? 'lexeme' : id.startsWith('c:') ? 'chunk' : '');
    return k === 'lexeme' || k === 'chunk';
  });
  const learned = words.filter((id) => learner.isLearned(id)).length;
  const s = ui.state.stats;
  const today = learner.day(now);
  const events = learner.events();
  const last = ui.state.checkpoints.at(-1);
  const rows = last ? Object.values(last.byUnit) : [];
  const total = rows.reduce((n, r) => n + r.total, 0);
  const done = units.slice(0, Math.min(ui.path.unit, units.length));
  return {
    learned, learning: words.length - learned,
    sessions: s.sessions, wordsRead: s.wordsRead, wordsWritten: s.wordsWritten,
    streak: streakStatus(ui.state, today).days, daysPracticed: s.days.length,
    delayed: delayedAccuracy7d(events, learner, now), produced: productionShareWeek(events, now),
    waitMinutes: backlogMinutes(learner, now), week: wordsThisWeek(ui.state.weekly, today),
    goals: canDoGroups(units, done.length, ui.state.placedAt ?? 0, ui.state.canDos, ui.state.checkpoints).earned.length,
    ...(total ? { check: rows.reduce((n, r) => n + r.right, 0) / total } : {}),
  };
}
