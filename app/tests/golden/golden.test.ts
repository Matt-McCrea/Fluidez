// Golden learners: real saved documents, checked in, booted the way the app boots
// (Learner.open and UiStore.load migrate, ui.reconcile repairs, the content window
// loads) and then asked for a session. A change to a schema, a migration or the
// course that would strand a learner already out in the world fails here first.
// The fixtures are made by tools/golden.ts; see README.md before touching them.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Block } from '../../src/compiler';
import { PATH_VERSION, UI_VERSION, MemoryKV, isResumable } from '../../src/ui/store/ui';
import { STATE_VERSION, type LearnerState } from '../../src/learner';
import { boot } from '../../src/ui/app';
import { ContentLoader } from '../../src/ui/data/loader';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';

const DIR = fileURLToPath(new URL('.', import.meta.url));

interface Golden { about: string; build: string; scenario: string; madeAt: number; plan?: string[]; kv: Record<string, any> }
const load = (name: string): Golden => JSON.parse(readFileSync(`${DIR}${name}.json`, 'utf8'));

/**
 * What each fixture is on disk. Written here, not read from the code, so that
 * regenerating one with newer code (and so changing the shape it stands for)
 * fails instead of passing quietly.
 */
const SHAPES: Record<string, { state: number; path: number; ui: number; session: boolean }> = {
  'live-ee6aaec': { state: 2, path: 2, ui: 2, session: false },
  'head-early': { state: 2, path: 2, ui: 3, session: false },
  'head-mid-session': { state: 2, path: 2, ui: 3, session: true },
  'head-placed': { state: 2, path: 2, ui: 3, session: false },
};

const loader = new ContentLoader();

/** Every card's reps and lapses, and each node's novel passes and exposures: the memory a learner has built. */
function memory(s: LearnerState) {
  const out: Record<string, number[]> = {};
  for (const [id, n] of Object.entries(s.nodes)) {
    out[id] = [n.novelPasses, n.exposures];
    for (const d of ['receptive', 'productive'] as const) if (n[d]) out[`${id}|${d}`] = [n[d]!.reps, n[d]!.lapses];
  }
  return out;
}

describe('the fixtures', () => {
  it('are exactly those listed', () => {
    expect(readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', '')).sort()).toEqual(Object.keys(SHAPES).sort());
  });
});

describe.each(Object.keys(SHAPES))('golden learner %s', (name) => {
  const g = load(name);
  const shape = SHAPES[name];
  const raw = g.kv.state as LearnerState;
  let w: Awaited<ReturnType<typeof bootOne>>;
  /** what the app said on the console while it booted: a path trimmed back to the learner is a repair, and a fixture should need none */
  const warnings: string[] = [];

  async function bootOne() {
    const kv = new MemoryKV();
    for (const [k, v] of Object.entries(g.kv)) kv.data.set(k, structuredClone(v));
    const ctx = await boot({ kv, loader, now: () => g.madeAt, fixtures: false });
    return { kv, ...ctx };
  }
  const known = (id: string) => w.bundle.course.nodes.has(id);
  const itemsOf = (blocks: Block[]) => blocks.flatMap((b) => ('items' in b ? (b.items as Array<{ node?: string; sentence?: string }>) : []));
  const planNodes = (blocks: Block[]) => itemsOf(blocks).map((i) => i.node).filter((n): n is string => !!n);

  beforeAll(async () => {
    vi.spyOn(console, 'warn').mockImplementation((...a) => { warnings.push(a.join(' ')); });
    w = await bootOne();
  }, 120_000);
  afterAll(() => { vi.restoreAllMocks(); });

  it('is the shape it claims to be', () => {
    expect([raw.version, g.kv.path.version, g.kv.ui.version]).toEqual([shape.state, shape.path, shape.ui]);
    expect('session' in g.kv).toBe(shape.session);
    expect(Object.keys(raw.nodes).length).toBeGreaterThan(20);
  });

  it('boots through migration, writes what it migrated, and quarantines nothing', () => {
    expect(w.learner.toJSON().version).toBe(STATE_VERSION);
    expect(w.ui.state.version).toBe(UI_VERSION);
    expect(w.ui.path.version).toBe(PATH_VERSION);
    expect((w.kv.data.get('ui') as { version: number }).version).toBe(UI_VERSION);
    expect([...w.kv.data.keys()].filter((k) => k.endsWith('.quarantine'))).toEqual([]);
    expect(w.ui.state.learnerId).toBe(g.kv.ui.learnerId);
    expect(w.ui.state.stats.sessions).toBe(g.kv.ui.stats.sessions);
    // an open session is a lesson the path log has not counted yet: that one warning is the only one allowed
    expect(warnings.filter((m) => !(shape.session && /path log ends at session/.test(m)))).toEqual([]);
  });

  it('loses no node and invents none', () => {
    expect(Object.keys(w.learner.toJSON().nodes).sort()).toEqual(Object.keys(raw.nodes).sort());
    expect(Object.keys(raw.nodes).filter((id) => !known(id)), 'nodes the course no longer has').toEqual([]);
  });

  it('keeps every rep', () => {
    const before = memory(raw);
    expect(Object.values(before).reduce((a, [x]) => a + x, 0), 'a fixture with something to lose').toBeGreaterThan(0);
    expect(memory(w.learner.toJSON())).toEqual(before);
    expect(w.learner.events()).toEqual(g.kv.events.events);
    expect(w.learner.sessionIndex).toBe(raw.session.index);
  });

  it('has no card, event or owed node the course does not know', () => {
    const s = w.learner.toJSON();
    expect(Object.entries(s.nodes).filter(([id, n]) => (n.receptive || n.productive) && !known(id)).map(([id]) => id)).toEqual([]);
    expect(w.learner.events().filter((e) => !known(e.node)).map((e) => e.node)).toEqual([]);
    const p = w.ui.path;
    const owed = [...p.owedNew, ...p.owedGrammar, ...p.pendingDrills.map((d) => d.node), ...p.recentGrammar, ...p.remediate.map((r) => r.node)];
    expect(owed.filter((id) => !known(id))).toEqual([]);
    if (w.ui.session) {
      const items = itemsOf(w.ui.session.plan.blocks);
      expect(items.length).toBeGreaterThan(0);
      expect(items.filter((i) => i.node && !known(i.node)).map((i) => i.node)).toEqual([]);
      expect(items.filter((i) => i.sentence && !w.bundle.sentence(i.sentence)).map((i) => i.sentence), 'sentences the saved plan asks for').toEqual([]);
    }
  });

  it('stands at a valid place on the path', async () => {
    const p = w.ui.path;
    const units = w.bundle.course.units;
    expect(p.unit).toBeGreaterThanOrEqual(0);
    expect(p.unit).toBeLessThanOrEqual(units.length);
    if (p.unit < units.length) {
      expect(p.day).toBeGreaterThanOrEqual(0);
      expect(p.day).toBeLessThan(units[p.unit].days.length);
    }
    expect(p.coreSessions).toBeLessThanOrEqual(w.learner.sessionIndex);
    for (const e of p.log) {
      expect(e.learnerSession).toBeLessThanOrEqual(w.learner.sessionIndex);
      if (e.unit) expect(units.some((u) => u.id === e.unit), `log unit ${e.unit}`).toBe(true);
    }
    expect(await w.ui.reconcile(w.learner.sessionIndex), 'a path ahead of the learner').toBe(false);
  });

  it('compiles a session, the same one twice, and leaves the learner as it was', () => {
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: g.madeAt });
    expect(plan.sessionIndex).toBe(w.learner.sessionIndex + 1);
    expect(plan.blocks.length).toBeGreaterThan(2);
    expect(plan.blocks[plan.blocks.length - 1].kind).toBe('close');
    expect(plan.estimatedMinutes).toBeGreaterThan(0);
    expect(planNodes(plan.blocks).length).toBeGreaterThan(0);
    expect(planNodes(plan.blocks).filter((id) => !known(id))).toEqual([]);
    expect(compilePlan(w.learner, w.bundle, w.ui, { now: g.madeAt })).toEqual(plan);
    expect(memory(w.learner.toJSON())).toEqual(memory(raw));
  });

  const open = () => {
    const saved = w.ui.session!;
    const at = g.madeAt + 60_000;
    expect(saved.plan.blocks.map((b) => b.kind)).toEqual(g.plan);
    expect(saved.block).toBeGreaterThan(0);
    expect(saved.block).toBeLessThan(saved.plan.blocks.length);
    expect(isResumable(saved, w.learner, at, w.ui.state.learnerId)).toBe(true);
    const run = SessionRunner.resume(w.learner, w.bundle, w.ui, saved, () => at);
    expect(run.plan).toEqual(saved.plan);
    expect(run.tally).toEqual(saved.runner.tally);
    expect(w.learner.sessionIndex).toBe(saved.sessionIndex);
  };
  if (shape.session) it('keeps an open session it can pick up again', open);
  else it('has no session open', () => { expect(w.ui.session).toBeUndefined(); });
});
