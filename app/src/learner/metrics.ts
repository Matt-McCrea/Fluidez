// The numbers the progress screen reports, as pure functions over the event
// log and a learner. Nothing here writes.
import type { Band, NodeId } from '../content/schema';
import { BAND_WARMUP_MINUTES } from '../compiler/budget';
import { delayedCounts, productionCounts, type ReviewEvent } from './events';
import type { Direction, NodeRecord } from './state';

const DAY_MS = 86_400_000;

/** The part of a Learner the metrics read (a stub satisfies it in tests). */
export interface MetricsLearner {
  node(id: NodeId): NodeRecord | undefined;
  day(at?: number): string;
  due(at?: number): { node: NodeId; direction: Direction; r: number }[];
  secondsPerReview(direction?: Direction): number;
  retrievability(id: NodeId, direction: Direction, at?: number): number | undefined;
  nodes(): NodeId[];
}

export interface Rate { value?: number; n: number }

const introducedAt = (l: MetricsLearner) => (id: NodeId) => l.node(id)?.introducedAt;

function delayed(events: readonly ReviewEvent[], l: MetricsLearner, now: number, minAgeDays: number, windowDays: number): Rate {
  const { n, ok } = delayedCounts(events, { minAgeDays, since: now - windowDays * DAY_MS, introducedAt: introducedAt(l) });
  return { n, value: n ? ok / n : undefined };
}

/** Reviews in the last 4 weeks of things introduced 7 or more days before. */
export const delayedAccuracy7d = (events: readonly ReviewEvent[], l: MetricsLearner, now: number): Rate => delayed(events, l, now, 7, 28);
/** Reviews in the last 8 weeks of things introduced 28 or more days before. */
export const delayedAccuracy28d = (events: readonly ReviewEvent[], l: MetricsLearner, now: number): Rate => delayed(events, l, now, 28, 56);

/** Share of the last 7 days' scored reviews that were en to es. */
export function productionShareWeek(events: readonly ReviewEvent[], now: number): Rate {
  const { n, productive } = productionCounts(events, now - 7 * DAY_MS);
  return { n, value: n ? productive / n : undefined };
}

/** Minutes the due reviews would take, one direction per node (the most at risk), as the warm-up does. */
export function backlogMinutes(l: MetricsLearner, now: number): number {
  const seen = new Set<NodeId>();
  let count = 0;
  for (const c of l.due(now)) { if (seen.has(c.node)) continue; seen.add(c.node); count += 1; }
  return count * l.secondsPerReview() / 60;
}

export const reviewBudgetMinutes = (band: Band): number => BAND_WARMUP_MINUTES[band];

export interface WeekWords { read: number; written: number }
export interface DatedWords { read: number; written: number }

/** Words read and written in the 7 days ending on `today` (day keys YYYY-MM-DD), from the per-day buckets. */
export function wordsThisWeek(weekly: Record<string, DatedWords> | undefined, today: string): WeekWords {
  const [y, m, d] = today.split('-').map(Number);
  const end = Date.UTC(y, m - 1, d);
  let read = 0, written = 0;
  for (const [k, w] of Object.entries(weekly ?? {})) {
    const [yy, mm, dd] = k.split('-').map(Number);
    const age = Math.round((end - Date.UTC(yy, mm - 1, dd)) / DAY_MS);
    if (age < 0 || age > 6) continue;
    read += w.read; written += w.written;
  }
  return { read, written };
}

/** The n nodes with the lowest recall now among those with at least 3 scored attempts. */
export function weakestNodes(events: readonly ReviewEvent[], l: MetricsLearner, now: number, n: number): NodeId[] {
  const attempts = new Map<NodeId, number>();
  for (const e of events) if (e.scored === 'review') attempts.set(e.node, (attempts.get(e.node) ?? 0) + 1);
  const rows: { id: NodeId; r: number }[] = [];
  for (const [id, a] of attempts) {
    if (a < 3) continue;
    const rs = (['receptive', 'productive'] as const).map((d) => l.retrievability(id, d, now)).filter((x): x is number => x !== undefined);
    if (rs.length) rows.push({ id, r: Math.min(...rs) });
  }
  return rows.sort((a, b) => a.r - b.r || (a.id < b.id ? -1 : 1)).slice(0, n).map((x) => x.id);
}

/**
 * Of the nodes reviewed today that were introduced 5 to 9 days ago, how many
 * passed first try (every review today a pass with no second try).
 */
export function lastWeekCameBack(events: readonly ReviewEvent[], l: MetricsLearner, now: number): { came: number; of: number } {
  const today = l.day(now);
  const per = new Map<NodeId, boolean>();
  for (const e of events) {
    if (e.scored !== 'review' || l.day(e.at) !== today) continue;
    const intro = l.node(e.node)?.introducedAt;
    if (intro === undefined) continue;
    const age = (e.at - intro) / DAY_MS;
    if (age < 5 || age > 9) continue;
    per.set(e.node, (per.get(e.node) ?? true) && e.grade !== 1 && e.tries === 1);
  }
  return { came: [...per.values()].filter(Boolean).length, of: per.size };
}
