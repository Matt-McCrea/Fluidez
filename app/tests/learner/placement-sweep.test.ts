// A placement seeds cards for every unit it skips. Each seeded card is a
// Review-state card, and ts-fsrs throws "Invalid delta_t" when asked to review
// one at a moment before its last review. seedKnown set last_review to
// dueAt minus the stability, so a card spread to be due later than its
// stability (the window runs to 120 days) was "last reviewed" in the future,
// and the first sentence that gave it partial credit on day 1 to 3 crashed the
// session (`npx vite-node tools/playtest/render.ts 2 7`).
import { beforeAll, describe, expect, test } from 'vitest';
import { DIRECTIONS, Learner, Rating } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { applyPlacement } from '../../src/ui/session/placement';
import { DAY } from './helpers';

const T0 = new Date(2026, 9, 1, 18).getTime();
let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ unit: 0 }); }, 120_000);

const units = () => Array.from({ length: b.course.units.length - 1 }, (_, i) => i + 1);

describe('a placement at every unit', () => {
  test('seeds no card as reviewed after the moment of placement', () => {
    const late: string[] = [];
    for (const u of units()) {
      const L = Learner.fresh({ now: () => T0 });
      applyPlacement(L, b, u, T0);
      for (const id of L.nodes()) {
        for (const d of DIRECTIONS) {
          const c = L.card(id, d);
          if (c?.last_review !== undefined && c.last_review > T0) late.push(`u${u} ${id} ${d}`);
        }
      }
    }
    expect(late.slice(0, 5), `${late.length} cards`).toEqual([]);
  });

  test('keeps the due date it was spread to, and its interval says how far that is from the last review', () => {
    for (const u of units()) {
      const L = Learner.fresh({ now: () => T0 });
      applyPlacement(L, b, u, T0);
      for (const id of L.nodes()) {
        for (const d of DIRECTIONS) {
          const c = L.card(id, d);
          if (!c) continue;
          expect(c.due, `u${u} ${id} ${d}`).toBeGreaterThanOrEqual(T0 + DAY);
          expect(c.scheduled_days, `u${u} ${id} ${d}`).toBe(Math.max(1, Math.round((c.due - c.last_review!) / DAY)));
        }
      }
    }
  });

  test('can be lived in for seven days: every card reviewed when due and credited as part of a sentence, with no throw', () => {
    let now = T0;
    for (const u of units()) {
      const L = Learner.fresh({ now: () => now });
      applyPlacement(L, b, u, T0);
      const ids = L.nodes();
      for (let d = 1; d <= 7; d++) {
        now = T0 + d * DAY;
        for (const due of L.due(now)) L.review(due.node, due.direction, Rating.Good, { at: now });
        for (const dir of DIRECTIONS) {
          const target = ids.find((id) => L.hasCard(id, dir));
          if (target) L.creditSentence(ids, dir, Rating.Good, { at: now, target });
        }
      }
      now = T0;
    }
  }, 120_000);
});
