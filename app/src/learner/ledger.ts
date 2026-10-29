// The exposure ledger: every chapter/reading, scene, exercise item and bank
// sentence the learner was shown, with when, and whether a re-show was a
// labelled deliberate re-read. The compiler asks `unseen(kind, ids)` and never
// re-serves anything this says was seen, except as a deliberate re-read.
// Entries are append-only: nothing here deletes or overwrites a view.
import type { LearnerState, LedgerEntry, LedgerKind, LedgerView } from './state';

export class Ledger {
  constructor(private readonly state: () => LearnerState, private readonly changed: () => void, private readonly now: () => number) {}

  private table(kind: LedgerKind): Record<string, LedgerEntry> {
    const t = this.state().ledger[kind];
    if (!t) throw new Error(`unknown ledger kind: ${kind}`);
    return t;
  }

  markSeen(kind: LedgerKind, id: string, opts: { deliberate?: boolean; at?: number; review?: boolean; reason?: string } = {}): LedgerEntry {
    const at = opts.at ?? this.now();
    const view: LedgerView = { at, deliberate: opts.deliberate ?? false };
    if (opts.review) view.review = true;
    if (opts.reason) view.reason = opts.reason;
    const t = this.table(kind);
    const e = t[id];
    if (e) {
      e.views.push(view);
      e.first = Math.min(e.first, at);
      e.last = Math.max(e.last, at);
    } else {
      t[id] = { first: at, last: at, views: [view] };
    }
    this.changed();
    return t[id];
  }

  hasSeen(kind: LedgerKind, id: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.table(kind), id);
  }

  /** Most recent time it was shown, or undefined if never. */
  lastSeen(kind: LedgerKind, id: string): Date | undefined {
    const e = this.table(kind)[id];
    return e ? new Date(e.last) : undefined;
  }

  firstSeen(kind: LedgerKind, id: string): Date | undefined {
    const e = this.table(kind)[id];
    return e ? new Date(e.first) : undefined;
  }

  views(kind: LedgerKind, id: string): readonly LedgerView[] {
    return this.table(kind)[id]?.views ?? [];
  }

  /** The ids from `ids` never shown, in the order given. */
  unseen(kind: LedgerKind, ids: Iterable<string>): string[] {
    const t = this.table(kind);
    const out: string[] = [];
    for (const id of ids) if (!Object.prototype.hasOwnProperty.call(t, id)) out.push(id);
    return out;
  }

  /** Ids shown between `from` and `to` (epoch ms), e.g. for "re-read a chapter from 2–3 weeks ago". */
  seenBetween(kind: LedgerKind, from: number, to: number): string[] {
    return Object.entries(this.table(kind)).filter(([, e]) => e.views.some((v) => v.at >= from && v.at <= to)).map(([id]) => id);
  }

  /**
   * Review-context reuse: a sentence whose every showing so far was as an SRS
   * review context, the last at least `minDays` before `at`, may be served as
   * a review context again (labelled deliberate, reason 'review-context-120d').
   * Anything ever shown another way (example, drill, reading) never qualifies.
   */
  reviewReusable(id: string, at: number, minDays: number): boolean {
    const e = this.table('sentence')[id];
    if (!e) return false;
    if (e.last > at - minDays * 86_400_000) return false;
    return e.views.every((v) => v.review === true);
  }

  /** Re-shows that were not labelled deliberate: should always be 0 (simulator metric). */
  unintendedRepeats(kind: LedgerKind): number {
    let n = 0;
    for (const e of Object.values(this.table(kind))) n += e.views.slice(1).filter((v) => !v.deliberate).length;
    return n;
  }

  count(kind: LedgerKind): number {
    return Object.keys(this.table(kind)).length;
  }
}
