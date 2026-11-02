// Real generated sessions for the Guess Test: a learner placed at a unit of the real course, a few days played
// through the same driver the session tests use, every multiple choice card the learner saw kept with where it came from.
import { namesOf } from '../../src/exercises/licence';
import { Learner, IdbStore } from '../../src/learner';
import { boot } from '../../src/ui/app';
import { ContentLoader } from '../../src/ui/data/loader';
import type { PracticeItem } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { plannedPicks, practiceCard, type Card, type McqCard } from '../../src/ui/session/cards';
import { licensedTenses } from '../../src/ui/session/tenses';
import { applyPlacement } from '../../src/ui/session/placement';
import { MemoryKV, PATH_KEY, UI_KEY, emptyUi } from '../../src/ui/store/ui';
import { session } from './driver';

const AT = Date.UTC(2026, 9, 1, 18);
const DAY = 86_400_000;

/** Where a choice card came from: built by the app (`made`), written in a lesson script (`script`), or asked of a chapter (`story`). */
export type Source = 'made' | 'script' | 'story';
export interface Seen { unit: number; card: McqCard; source: Source }

export const sourceOf = (c: McqCard): Source => (c.ask === 'Quick question' ? 'story' : c.ask === 'Read and pick' && !c.feature ? 'script' : 'made');

/** `days` sessions for a learner placed at unit index `unit` (0 = a new learner), answering right: every choice card they met, and the names the bank they met them in writes. */
export async function choiceCardsAt(unit: number, days: number): Promise<{ seen: Seen[]; names: ReadonlySet<string>; picks: Array<{ item: PracticeItem; card: Card; block: number; day: number; taught: ReadonlySet<string> }>; bundle: Bundle; learner: Learner }> {
  const kv = new MemoryKV();
  const clock = { t: AT };
  const now = () => clock.t;
  if (unit > 0) {
    const learner = await Learner.open(new IdbStore(kv), { now });
    const seed = await new ContentLoader().load({ unit });
    const path = applyPlacement(learner, seed, unit, AT);
    learner.startSession(AT);
    await learner.flush();
    await kv.set(UI_KEY, { ...emptyUi('learner-1'), onboarded: true, placedAt: unit });
    await kv.set(PATH_KEY, path);
  } else await kv.set(UI_KEY, { ...emptyUi('learner-1'), onboarded: true });
  const booted = await boot({ kv, loader: new ContentLoader(), now, fixtures: false });
  const w = { clock, kv, store: undefined as never, ...booted, now };
  const out: Seen[] = [];
  const picks: Array<{ item: PracticeItem; card: Card; block: number; day: number; taught: ReadonlySet<string> }> = [];
  for (let d = 0; d < days; d++) {
    clock.t = AT + (d + 1) * DAY;
    const r = await session(w, 'right');
    for (const c of r.walk.cards as Card[]) if (c.type === 'mcq') out.push({ unit, card: c, source: sourceOf(c) });
    // the structured input block as the player builds it
    const taught = plannedPicks(r.plan);
    for (const [at, b] of r.plan.blocks.entries()) {
      if (b.kind !== 'structuredInput') continue;
      const taken = new Set(taught);
      for (const item of b.items as PracticeItem[]) picks.push({ item, card: practiceCard(item, w.bundle, r.plan.seed, licensedTenses(w.learner.nodes(), (id) => w.bundle.node(id)?.tags), taken), block: at, day: d, taught });
    }
    await w.bundle.ensureWindow(w.ui.path.unit);
  }
  return { seen: out, names: namesOf(w.bundle.bank), picks, bundle: w.bundle, learner: w.learner };
}
