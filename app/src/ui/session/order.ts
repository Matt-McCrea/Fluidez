// The order cards come in. Pure, so the player and the headless test driver
// walk a block the same way.
//
//  - New words and phrases: shown three at a time, then asked; every further
//    round of an item comes back a few cards later (never at the end of one
//    long run), and each round of one item is a different format (pick the
//    meaning, pick the Spanish, type it).
//  - A run of cards never keeps one format for long: `interleave` reorders a
//    block's cards so no more than a few in a row look alike.
import type { Card } from './cards';

export type LearnStep = { kind: 'present'; i: number } | { kind: 'ask'; i: number; round: number };

/** How many other cards sit between two rounds of the same item. */
export const RETRY_GAP = 3;
/** New items shown together before they are asked. */
export const LEARN_GROUP = 3;

export class LearnQueue {
  steps: LearnStep[] = [];
  pos = 0;
  readonly presented = new Set<number>();

  constructor(readonly n: number) {
    for (let g = 0; g < n; g += LEARN_GROUP) {
      const idx = Array.from({ length: Math.min(LEARN_GROUP, n - g) }, (_, k) => g + k);
      idx.forEach((i) => this.steps.push({ kind: 'present', i }));
      idx.forEach((i) => this.steps.push({ kind: 'ask', i, round: 0 }));
    }
  }

  get current(): LearnStep | undefined { return this.steps[this.pos]; }
  get done(): boolean { return this.pos >= this.steps.length; }

  /** Move past the current step; `again` = ask this item once more, a few cards later. */
  next(again = false): void {
    const s = this.current;
    if (!s) return;
    if (s.kind === 'present') this.presented.add(s.i);
    if (again && s.kind === 'ask') {
      const at = Math.min(this.steps.length, this.pos + 1 + RETRY_GAP);
      this.steps.splice(at, 0, { kind: 'ask', i: s.i, round: s.round + 1 });
    }
    this.pos++;
  }

  /**
   * Out of time: drop every item not presented yet (returned, to be owed) and
   * any further rounds; the items already presented keep their asks.
   */
  stopNew(): number[] {
    const rest = this.steps.slice(this.pos);
    const dropped = [...new Set(rest.filter((s) => s.kind === 'present').map((s) => s.i))];
    const keep = rest.filter((s) => s.kind === 'ask' && this.presented.has(s.i) && !dropped.includes(s.i));
    // one ask per presented item is enough now
    const seen = new Set<number>();
    const trimmed = keep.filter((s) => (seen.has(s.i) ? false : (seen.add(s.i), true)));
    this.steps = [...this.steps.slice(0, this.pos), ...trimmed];
    return dropped;
  }
}

/** A card's look: its type, and for multiple choice which language is asked and which is picked. */
export function formatOf(card: Card): string {
  if (card.type === 'mcq') return `mcq:${card.prompt?.lang ?? '-'}>${card.options[0]?.lang ?? '-'}`;
  if (card.type === 'type') return `type:${card.prompt?.lang ?? '-'}`;
  return 'read';
}

/**
 * Reorder so no more than `maxRun` items in a row share a format, keeping the
 * original order otherwise. Returns indexes into `xs`.
 */
export function interleave<T>(xs: readonly T[], fmt: (x: T) => string, maxRun = 4): number[] {
  const left = xs.map((_, i) => i);
  const out: number[] = [];
  while (left.length) {
    let pick = 0;
    const last = out.length ? fmt(xs[out[out.length - 1]]) : undefined;
    let run = 0;
    for (let k = out.length - 1; k >= 0 && fmt(xs[out[k]]) === last; k--) run++;
    if (run >= maxRun) {
      const other = left.findIndex((i) => fmt(xs[i]) !== last);
      if (other >= 0) pick = other;
    }
    out.push(left.splice(pick, 1)[0]);
  }
  return out;
}

/**
 * A teaching script's practice: the first few read-and-pick items alone
 * (input before output), then the rest of them woven between the your-turn
 * items. Returns the items in the order they are asked.
 */
export const READ_FIRST = 5;
export function teachOrder<T extends { op: string }>(items: readonly T[]): { first: T[]; mixed: T[] } {
  const rp = items.filter((i) => i.op === 'readAndPick');
  const yt = items.filter((i) => i.op === 'yourTurn');
  const first = rp.slice(0, READ_FIRST);
  const restRp = rp.slice(READ_FIRST);
  const mixed: T[] = [];
  for (let k = 0; k < Math.max(yt.length, restRp.length); k++) {
    if (yt[k]) mixed.push(yt[k]);
    if (restRp[k]) mixed.push(restRp[k]);
  }
  return { first, mixed };
}

/**
 * After `interleave`: where one format still runs past `maxRun` (a warm-up of
 * nothing but receptive reviews), swap in another look of the same card
 * (`alt(i)`, by original index) when there is one. Mutates and returns `cards`.
 */
export function breakRuns(cards: Card[], order: number[], alt: (i: number) => Card | undefined, maxRun = 4): Card[] {
  let run = 0;
  let last = '';
  order.forEach((i, k) => {
    let f = formatOf(cards[i]);
    run = k && f === last ? run + 1 : 1;
    if (run > maxRun) {
      const a = alt(i);
      if (a && formatOf(a) !== f) { cards[i] = a; f = formatOf(a); run = 1; }
    }
    last = f;
  });
  return cards;
}
