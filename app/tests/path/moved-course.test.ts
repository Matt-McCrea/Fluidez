// The exit test for stable keys and reconcile: each golden learner, settled against a course that has
// been rearranged under it (a day moved, a day inserted, a node moved in front of them and one behind,
// one renamed, one retired), loses no node and no rep, is left with no card the course does not know,
// stands on a valid day, is owed what it was never given, and settles to the same thing a second time.
// Then the same on many random rearrangements.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildCourse, type Course } from '../../src/compiler';
import { nextDayKey } from '../../src/content/days';
import type { ContentHistory } from '../../src/content/migrations';
import type { GraphNode, Unit } from '../../src/content/schema';
import { IdbStore, Learner, type LearnerState } from '../../src/learner';
import { reconcile, type Reconciled } from '../../src/learner/reconcile';
import { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader, loadBundle } from '../../src/ui/data/loader';
import { compilePlan } from '../../src/ui/session/runner';
import { MemoryKV, UiStore, type SavedSession } from '../../src/ui/store/ui';
import { rng } from '../learner/helpers';
import { copyCourse, findDay, insertDay, keyOf, moveDay, moveNode, renameNode, retireNode, withEntries, type Moved } from './moves';

const DIR = fileURLToPath(new URL('../golden/', import.meta.url));
const NAMES = ['live-ee6aaec', 'head-early', 'head-mid-session', 'head-placed', 'v3-early', 'v3-mid-session'];

const loader = new ContentLoader();

/** A golden learner's documents as the app opens them, before anything settles them against a course. */
async function open(name: string) {
  const g = JSON.parse(readFileSync(`${DIR}${name}.json`, 'utf8')) as { madeAt: number; kv: Record<string, unknown> };
  const kv = new MemoryKV();
  for (const [k, v] of Object.entries(g.kv)) kv.data.set(k, structuredClone(v));
  const learner = await Learner.open(new IdbStore(kv), { now: () => g.madeAt });
  const ui = await new UiStore(kv).load();
  return { g, kv, learner, ui };
}
type World = Awaited<ReturnType<typeof open>>;

/** Every card's reps and lapses and each node's passes and exposures: the memory a learner has built. */
function memory(nodes: LearnerState['nodes']): number[] {
  const out = [0, 0, 0, 0];
  for (const n of Object.values(nodes)) {
    out[0] += n.novelPasses; out[1] += n.exposures;
    for (const d of ['receptive', 'productive'] as const) if (n[d]) { out[2] += n[d]!.reps; out[3] += n[d]!.lapses; }
  }
  return out;
}
const everything = (s: LearnerState) => memory({ ...s.nodes, ...Object.fromEntries(Object.entries(s.orphans ?? {}).map(([k, v]) => [`orphan:${k}`, v])) });

function settle(w: World, m: Moved, real: ContentHistory, extra: Partial<{ session: SavedSession }> = {}): Reconciled<SavedSession> {
  const docs = w.learner.documents();
  return reconcile<SavedSession>({
    ...docs, path: w.ui.path, ui: w.ui.state, session: extra.session ?? w.ui.session,
    course: buildCourse(m.units, m.nodes), history: { migrations: withEntries(real.migrations, m), legacy: real.legacy },
  });
}

/** The node ids a migration entry turned into others, and those it retired. */
function fate(m: Moved, real: ContentHistory, id: string): string | null {
  let cur: string | null = id;
  for (const e of withEntries(real.migrations, m)) {
    if (cur === null) break;
    if (e.nodes?.remove?.includes(cur)) cur = null;
    else if (e.nodes?.rename && Object.hasOwn(e.nodes.rename, cur)) cur = e.nodes.rename[cur];
  }
  return cur;
}

function assertSettled(w: World, m: Moved, real: ContentHistory, out: Reconciled<SavedSession>): Course {
  const course = buildCourse(m.units, m.nodes);
  const before = w.learner.documents().state;

  // no node lost: each is under its new name, or kept apart whole when retired
  for (const id of Object.keys(before.nodes)) {
    const to = fate(m, real, id);
    if (to === null) expect(out.state.orphans?.[id], `${id} retired`).toBeDefined();
    else expect(out.state.nodes[to], `${id} -> ${to}`).toBeDefined();
  }
  expect(Object.keys(out.state.nodes).length + Object.keys(out.state.orphans ?? {}).length).toBe(Object.keys(before.nodes).length);
  // no rep lost
  expect(everything(out.state)).toEqual(everything(before));
  // no card, event or owed node the course does not know (a retired node's old events are history, and stay)
  const retired = new Set(Object.keys(before.nodes).filter((id) => fate(m, real, id) === null));
  expect(Object.entries(out.state.nodes).filter(([id, n]) => (n.receptive || n.productive) && !course.nodes.has(id)).map(([id]) => id)).toEqual([]);
  expect(out.events.events.filter((e) => !course.nodes.has(e.node) && !retired.has(e.node)).map((e) => e.node)).toEqual([]);
  const p = out.path;
  const held = [...p.owedNew, ...p.owedGrammar, ...p.pendingDrills.map((d) => d.node), ...p.recentGrammar, ...p.remediate.map((r) => r.node)];
  expect(held.filter((id) => !course.nodes.has(id))).toEqual([]);
  expect(new Set(p.owedNew).size).toBe(p.owedNew.length);
  expect(new Set(p.owedGrammar).size).toBe(p.owedGrammar.length);

  // a valid place, named, and the integers agree with the name
  expect(p.unit).toBeGreaterThanOrEqual(0);
  expect(p.unit).toBeLessThanOrEqual(course.units.length);
  if (p.unit < course.units.length) {
    expect(p.day).toBeGreaterThanOrEqual(0);
    expect(p.day).toBeLessThan(course.units[p.unit].days.length);
    expect(p.unitId).toBe(course.units[p.unit].id);
    expect(p.dayKey).toBe(keyOf(course.units[p.unit], p.day));
    // nothing the course teaches before this day is left unowed
    const here = course.unitStart[p.unit] + p.day;
    const have = new Set([...Object.keys(out.state.nodes), ...held]);
    expect([...course.teachPos].filter(([id, pos]) => pos < here && !have.has(id) && !id.startsWith('d:')).map(([id]) => id)).toEqual([]);
  }
  return course;
}

/** Settle once more from what the first settling produced: nothing changes, and the documents come back as they are. */
function assertIdempotent(w: World, m: Moved, real: ContentHistory, out: Reconciled<SavedSession>) {
  const again = reconcile<SavedSession>({
    state: out.state, events: out.events, attempts: out.attempts, path: out.path, ui: out.ui, session: out.session === null ? undefined : (out.session ?? w.ui.session),
    course: buildCourse(m.units, m.nodes), history: { migrations: withEntries(real.migrations, m), legacy: real.legacy },
  });
  expect(again.changed).toEqual({ state: false, events: false, attempts: false, path: false, ui: false, session: false });
  expect(again.state).toBe(out.state);
  expect(again.events).toBe(out.events);
  expect(again.path).toBe(out.path);
  expect(again.report.noop).toBe(true);
}

let real: ContentHistory;
let units: Unit[];
let nodes: GraphNode[];
beforeAll(async () => {
  ({ units, nodes } = await loader.core());
  real = loader.history();
}, 60_000);

// ---------------------------------------------------------------- the targeted rearrangement

/** A course with a day moved, a day inserted, a node moved in front of the learner and one behind, one renamed, one retired. */
function rearrange(w: World): { m: Moved; owedBy: string[]; ownDay: string } {
  const m = copyCourse(units, nodes);
  const p = w.ui.path;
  const here = m.units[p.unit];
  const ownDay = keyOf(here, p.day);
  const known = (id: string) => w.learner.isIntroduced(id);
  const taken = m.units.flatMap((u) => u.days.map((_, i) => keyOf(u, i)));
  const later = (kind: GraphNode['kind']) => m.nodes.filter((n) => n.kind === kind && !known(n.id) && [...m.units.slice(p.unit + 3)].some((u) => u.days.some((d) => [...d.focus, ...d.chunks, ...d.lexemes].includes(n.id))));
  const lexeme = later('lexeme')[0].id;
  const grammar = later('grammar')[0].id;

  // a day is inserted at the start of the learner's unit, ahead of them, teaching two things they were never given
  const fresh = nextDayKey(here.id, taken);
  insertDay(m, p.unit, 0, { key: fresh, type: 'introduce', focus: [grammar], lexemes: [lexeme] });
  // a day from further on is moved in front of them, with whatever it teaches
  const furtherOn = Math.min(p.unit + 2, m.units.length - 1);
  const future = m.units[furtherOn];
  const comes = keyOf(future, 1);
  // what that day is first to teach: it is taught in front of the learner once the day is
  const original = buildCourse(units, nodes);
  const carried = [...future.days[1].focus, ...future.days[1].chunks, ...future.days[1].lexemes].filter((id) => original.teachPos.get(id) === original.unitStart[furtherOn] + 1);
  moveDay(m, comes, p.unit, 1);
  // a node they have is moved to the very end of the course, and the learner's own day moves into the next unit
  const taught = Object.keys(w.learner.documents().state.nodes).filter((id) => id[0] === 'g' && m.nodes.some((n) => n.id === id));
  if (taught.length) moveNode(m, taught[0], keyOf(m.units[m.units.length - 1], 0));
  if (p.unit + 1 < m.units.length - 1) moveDay(m, ownDay, p.unit + 1, 1);
  // one node they have is renamed, another retired
  const lex = Object.keys(w.learner.documents().state.nodes).filter((id) => id[0] === 'l' && m.nodes.some((n) => n.id === id));
  renameNode(m, lex[0], `${lex[0]}-renamed`);
  retireNode(m, lex[1]);
  return { m, owedBy: [grammar, lexeme, ...carried.filter((id) => !known(id))], ownDay };
}

describe.each(NAMES)('golden learner %s on a rearranged course', (name) => {
  let w: World;
  let m: Moved;
  let out: Reconciled<SavedSession>;
  let owedBy: string[];
  let ownDay: string;
  beforeAll(async () => {
    w = await open(name);
    ({ m, owedBy, ownDay } = rearrange(w));
    out = settle(w, m, real);
  }, 60_000);

  it('loses no node and no rep, and leaves no card the course does not know', () => {
    assertSettled(w, m, real, out);
  });

  it('keeps the learner on the day they were on, wherever it went', () => {
    const at = findDay(m, ownDay)!;
    expect(out.path).toMatchObject({ unit: at.unit, day: at.day, dayKey: ownDay });
    expect(out.report.place.how).toBe('moved');
  });

  it('owes what was put in front of them and they were never given', () => {
    const owed = new Set([...out.path.owedNew, ...out.path.owedGrammar]);
    expect(owedBy.length).toBeGreaterThan(2);
    for (const id of owedBy) expect(owed.has(id), id).toBe(true);
  });

  it('follows the rename and the retirement', () => {
    const renamed = Object.keys(m.migrations[0].nodes!.rename!)[0];
    const retired = m.migrations[1].nodes!.remove![0];
    expect(out.state.nodes[`${renamed}-renamed`]).toBeDefined();
    expect(out.state.nodes[renamed]).toBeUndefined();
    expect(out.state.orphans![retired]).toBeDefined();
    // a learner already settled at the real table only meets the two entries these moves add
    const from = w.ui.path.contentVersion ?? 0;
    expect(out.report.migrations).toEqual(Array.from({ length: real.migrations.length + 2 - from }, (_, i) => from + i + 1));
  });

  it('settles to the same thing a second time', () => {
    assertIdempotent(w, m, real, out);
  });

  it('does not change the documents it was given', () => {
    const docs = w.learner.documents();
    const before = JSON.stringify([docs.state, docs.events, w.ui.path]);
    settle(w, m, real);
    expect(JSON.stringify([docs.state, docs.events, w.ui.path])).toBe(before);
  });

  it('compiles a session on the rearranged course, and every node in it is one the course knows', async () => {
    const base = await loadBundle(loader, { unit: w.ui.path.unit, fixtures: false });
    const moved = new Bundle(m.units, m.nodes, base.source);
    const learner = Learner.fromJSON(out.state, { now: () => w.g.madeAt });
    const ui = await new UiStore(new MemoryKV()).load();
    ui.state.learnerId = w.ui.state.learnerId;
    ui.path = out.path;
    const plan = compilePlan(learner, moved, ui, { now: w.g.madeAt });
    const planned = plan.blocks.flatMap((b) => ('items' in b ? (b.items as Array<{ node?: string }>) : [])).map((i) => i.node).filter((n): n is string => !!n);
    expect(plan.blocks.length).toBeGreaterThan(2);
    expect(planned.length).toBeGreaterThan(0);
    expect(planned.filter((id) => !moved.course.nodes.has(id))).toEqual([]);
  }, 60_000);
});

// ---------------------------------------------------------------- the same on random rearrangements

const SEEDS = Array.from({ length: 18 }, (_, i) => 1000 + i * 37);

/** Random moves of every kind, `k` of them. */
function scramble(m: Moved, seed: number, k: number): void {
  const r = rng(seed);
  const taken = () => m.units.flatMap((u) => u.days.map((_, i) => keyOf(u, i)));
  for (let i = 0; i < k; i++) {
    const kind = r.int(0, 5);
    if (kind === 0 || kind === 5) {
      const keys = taken();
      moveDay(m, r.pick(keys), r.int(0, m.units.length - 1), r.int(0, 9));
    } else if (kind === 1) {
      const unit = r.int(0, m.units.length - 1);
      const pool = m.nodes.filter((n) => n.kind !== 'cando');
      const picks = [r.pick(pool).id, r.pick(pool).id];
      insertDay(m, unit, r.int(0, 9), { key: nextDayKey(m.units[unit].id, taken()), type: r.pick(['introduce', 'drill', 'input'] as const), lexemes: picks.filter((id) => id[0] === 'l'), focus: picks.filter((id) => id[0] === 'g' || id[0] === 'p'), chunks: picks.filter((id) => id[0] === 'c') });
    } else if (kind === 2) {
      const listed = m.units.flatMap((u) => u.days.flatMap((d) => [...d.focus, ...d.chunks, ...d.lexemes]));
      moveNode(m, r.pick(listed), r.pick(taken()));
    } else if (kind === 3) {
      const n = r.pick(m.nodes.filter((x) => !x.id.includes('-r')));
      renameNode(m, n.id, `${n.id}-r${i}`);
    } else {
      const n = r.pick(m.nodes.filter((x) => x.kind !== 'cando'));
      retireNode(m, n.id);
    }
  }
}

describe.each(NAMES)('golden learner %s on random rearrangements', (name) => {
  let w: World;
  beforeAll(async () => { w = await open(name); }, 60_000);

  it.each(SEEDS)('seed %i: nothing lost, a valid place, nothing left unowed, and settled twice is settled once', (seed) => {
    const m = copyCourse(units, nodes);
    scramble(m, seed, 12 + (seed % 9));
    const out = settle(w, m, real);
    assertSettled(w, m, real, out);
    assertIdempotent(w, m, real, out);
  });
});
