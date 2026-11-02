// A due contrast in a real session: a learner placed past por and para, on the real course, gets the contrast in the warm-up
// as one of its own items, answers it through the same cards the components use, and it is graded as a review of the contrast (F3).
import { describe, expect, it } from 'vitest';
import { Learner, IdbStore } from '../../src/learner';
import { boot } from '../../src/ui/app';
import { ContentLoader } from '../../src/ui/data/loader';
import { applyPlacement } from '../../src/ui/session/placement';
import { MemoryKV, PATH_KEY, UI_KEY, emptyUi } from '../../src/ui/store/ui';
import { session } from './driver';

const AT = Date.UTC(2026, 9, 1, 18);
const DAY = 86_400_000;

describe('a due contrast in a real session', () => {
  it('is asked as one of its own items in the warm-up, answered, and graded as a review of the contrast', async () => {
    const kv = new MemoryKV();
    const clock = { t: AT };
    const now = () => clock.t;
    const unit = 22;
    const learner = await Learner.open(new IdbStore(kv), { now });
    const seed = await new ContentLoader().load({ unit });
    const path = applyPlacement(learner, seed, unit, AT);
    learner.startSession(AT);
    await learner.flush();
    await kv.set(UI_KEY, { ...emptyUi('learner-1'), onboarded: true, placedAt: unit });
    await kv.set(PATH_KEY, path);
    const booted = await boot({ kv, loader: new ContentLoader(), now, fixtures: false });
    const w = { clock, kv, store: undefined as never, ...booted, now };

    const served: Array<{ node: string; contrast: string; key: string; type: string }> = [];
    for (let d = 0; d < 6 && !served.length; d++) {
      clock.t = AT + (d + 1) * DAY;
      const r = await session(w, 'right');
      expect(r.walk.failures).toEqual([]);
      for (const b of r.plan.blocks) {
        if (b.kind !== 'warmup') continue;
        for (const it of b.items) {
          if (!it.contrast) continue;
          const card = r.walk.cards.find((c) => c.key === it.id);
          served.push({ node: it.node, contrast: it.contrast, key: it.id, type: card?.type ?? 'not shown' });
        }
      }
      await w.bundle.ensureWindow(w.ui.path.unit);
    }
    expect(served.length, 'a contrast came due in six sessions').toBeGreaterThan(0);
    const first = served[0];
    expect(first.node.startsWith('x:')).toBe(true);
    expect(first.contrast.startsWith(`${first.node}#`)).toBe(true);
    expect(['mcq', 'type']).toContain(first.type);
    // graded as a review of the contrast itself
    const ev = w.learner.events().filter((e) => e.node === first.node && e.op === 'warmup');
    expect(ev.length).toBeGreaterThan(0);
    expect(ev.every((e) => e.scored === 'review')).toBe(true);
  }, 180_000);
});
