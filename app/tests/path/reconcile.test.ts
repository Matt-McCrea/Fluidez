// reconcile: a learner's documents followed through a course that has been rearranged. A small
// hand-built course here; the real learners and a moved real course are in moved-course.test.ts.
import { describe, expect, it } from 'vitest';
import { buildCourse, initialPath, type PathState } from '../../src/compiler';
import { readContentHistory, type ContentMigration } from '../../src/content/migrations';
import type { GraphNode, Unit } from '../../src/content/schema';
import { emptyAttempts, emptyLog, Learner, type AttemptRow } from '../../src/learner';
import { reconcile, stampPosition, type ReconcileInput, type SessionDoc } from '../../src/learner/reconcile';

const node = (id: string): GraphNode => ({
  id, kind: ({ g: 'grammar', c: 'chunk', l: 'lexeme', p: 'pattern' } as const)[id[0] as 'g'], band: 'A1', priority: 1, title: id,
  requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral',
}) as GraphNode;
type DaySpec = { key: string; focus?: string[]; chunks?: string[]; lexemes?: string[]; type?: Unit['days'][number]['type'] };
const unit = (id: string, days: DaySpec[]): Unit => ({
  id, band: 'A1', title: id, theme: 't', canDo: 'c', storyArc: 's',
  days: days.map((d) => ({ key: d.key, type: d.type ?? 'introduce', focus: d.focus ?? [], chunks: d.chunks ?? [], lexemes: d.lexemes ?? [] })),
}) as Unit;
const ids = ['g:x', 'g:y', 'c:hi', 'l:a', 'l:b', 'l:c', 'l:d', 'g:z', 'l:e'];
const course = (units: Unit[], extra: string[] = []) => buildCourse(units, [...ids, ...extra].map(node));

// u01: d0 g:x + l:a, d1 l:b, d2 g:y + c:hi, d3 l:c ; u02: d0 l:d, d1 g:z
const original = () => [
  unit('u01', [{ key: 'u01-d0', focus: ['g:x'], lexemes: ['l:a'] }, { key: 'u01-d1', lexemes: ['l:b'] }, { key: 'u01-d2', focus: ['g:y'], chunks: ['c:hi'] }, { key: 'u01-d3', lexemes: ['l:c'] }]),
  unit('u02', [{ key: 'u02-d0', lexemes: ['l:d'] }, { key: 'u02-d1', focus: ['g:z'] }]),
];

const AT = Date.UTC(2026, 9, 1, 18);
function learnerWith(known: string[]) {
  const l = Learner.fresh({ now: () => AT });
  for (const id of known) l.introduce(id, { results: [true, true, true] });
  return l;
}
const attempt = (nodeId: string, sentence?: string): AttemptRow => ({ at: AT, node: nodeId, op: 'type', fmt: 'type', given: 'x', ...(sentence ? { sentence } : {}) });

function input(over: Omit<Partial<ReconcileInput<SessionDoc>>, 'path'> & { known?: string[]; path?: Partial<PathState>; units?: Unit[] } = {}): ReconcileInput<SessionDoc> {
  const l = learnerWith(over.known ?? ['g:x', 'l:a', 'l:b']);
  const state = over.state ?? l.toJSON();
  return {
    state, events: over.events ?? { ...emptyLog(), events: l.events() }, attempts: over.attempts ?? emptyAttempts(),
    path: { ...initialPath(), ...over.path } as PathState,
    ui: over.ui, session: over.session,
    course: over.course ?? course(over.units ?? original()),
    history: over.history ?? { migrations: [] },
  };
}
const migration = (n: number, body: Omit<ContentMigration, 'id' | 'note'>): ContentMigration => ({ id: n, note: 'test', ...body });
const history = (...m: ContentMigration[]) => readContentHistory({ migrations: m });

const frozen = <T>(x: T): T => JSON.parse(JSON.stringify(x));

describe('a course that has not moved', () => {
  it('gives a path from before keys its keys, and touches nothing else', () => {
    const i = input({ path: { unit: 0, day: 2 } });
    const out = reconcile(i);
    expect(out.path).toMatchObject({ unit: 0, day: 2, unitId: 'u01', dayKey: 'u01-d2', contentVersion: 0 });
    expect(out.report.place.how).toBe('stamped');
    expect(out.changed).toEqual({ state: false, events: false, attempts: false, path: true, ui: false, session: false });
    expect(out.state).toBe(i.state);
    expect(out.events).toBe(i.events);
    expect(out.report.owed).toEqual([]);
  });

  it('is idempotent: its own output changes nothing and is handed back as it came', () => {
    const first = reconcile(input({ path: { unit: 0, day: 2 } }));
    const again = reconcile({ ...input({ path: { unit: 0, day: 2 } }), path: first.path });
    expect(again.report.noop).toBe(true);
    expect(again.changed).toEqual({ state: false, events: false, attempts: false, path: false, ui: false, session: false });
    expect(again.path).toBe(first.path);
  });

  it('does not change what it was given', () => {
    const i = input({ path: { unit: 0, day: 2, owedNew: ['l:gone'] }, history: history(migration(1, { nodes: { rename: { 'l:a': 'l:aa' } } })) });
    const before = frozen(i);
    reconcile(i);
    expect(frozen(i)).toEqual(before);
  });
});

describe('a node renamed by a content migration', () => {
  const h = history(migration(1, { nodes: { rename: { 'l:a': 'l:aa' } }, rows: { rename: { 'u01-0001': 'u01-0101' } } }));
  const renamedCourse = () => buildCourse(original().map((u) => ({ ...u, days: u.days.map((d) => ({ ...d, lexemes: d.lexemes.map((x) => (x === 'l:a' ? 'l:aa' : x)) })) })), [...ids.filter((x) => x !== 'l:a'), 'l:aa'].map(node));

  function world() {
    const l = learnerWith(['g:x', 'l:a', 'l:b']);
    l.review('l:a', 'receptive', 3, { at: AT + 86_400_000, sentence: 'u01-0001', op: 'warmup' });
    l.ledger.markSeen('sentence', 'u01-0001');
    l.ledger.markSeen('item', 'ln:l:a');
    l.ledger.markSeen('item', 'rv:u01-0001');
    l.ledger.markSeen('item', 'rv:l:a:receptive:bare');
    l.ledger.markSeen('item', 'tr:l:a');
    l.ledger.markSeen('item', 'choose:u01-0001');
    l.ledger.markSeen('item', 'recombine:u01-0001:s4');
    l.ledger.markSeen('item', 'ln:l:b');
    return input({
      state: l.toJSON(), events: { ...emptyLog(), events: l.events(), summary: { upTo: 5, counts: { 'l:a': { receptive: 4, productive: 1 }, 'l:b': { receptive: 2, productive: 0 } } } },
      attempts: { version: 1, rows: [attempt('l:a', 'u01-0001'), attempt('l:b')] },
      path: { unit: 0, day: 2, owedNew: ['l:a', 'l:c'], owedGrammar: [], recentGrammar: ['g:x'], pendingDrills: [{ node: 'l:a', at: 1 }], remediate: [{ node: 'l:a', reason: 'lapse', at: 1 }] },
      course: renamedCourse(), history: h,
    });
  }

  it('follows it through the nodes, with every rep', () => {
    const i = world();
    const out = reconcile(i);
    expect(Object.keys(out.state.nodes).sort()).toEqual(['g:x', 'l:aa', 'l:b']);
    expect(out.state.nodes['l:aa']).toEqual({ ...i.state.nodes['l:a'], id: 'l:aa' });
    expect(out.state.nodes['l:aa'].receptive!.reps).toBe(i.state.nodes['l:a'].receptive!.reps);
    expect(out.state.orphans).toEqual({});
    expect(out.report.rewrote.nodes).toBe(1);
  });

  it('follows it through the ledger, the item keys included', () => {
    const out = reconcile(world());
    expect(Object.keys(out.state.ledger.item).sort()).toEqual(['choose:u01-0101', 'ln:l:aa', 'ln:l:b', 'recombine:u01-0101:s4', 'rv:l:aa:receptive:bare', 'rv:u01-0101', 'tr:l:aa']);
    expect(Object.keys(out.state.ledger.sentence)).toEqual(['u01-0101']);
  });

  it('follows it through the events, their summary, the attempts and the path', () => {
    const out = reconcile(world());
    expect(out.events.events.filter((e) => e.node === 'l:a')).toEqual([]);
    expect(out.events.events.some((e) => e.node === 'l:aa' && e.sentence === 'u01-0101')).toBe(true);
    expect(out.events.summary.counts).toEqual({ 'l:aa': { receptive: 4, productive: 1 }, 'l:b': { receptive: 2, productive: 0 } });
    expect(out.attempts.rows.map((a) => [a.node, a.sentence])).toEqual([['l:aa', 'u01-0101'], ['l:b', undefined]]);
    expect(out.path).toMatchObject({ owedNew: ['l:aa', 'l:c'], pendingDrills: [{ node: 'l:aa', at: 1 }], remediate: [{ node: 'l:aa', reason: 'lapse', at: 1 }], contentVersion: 1 });
  });

  it('is applied once: settled documents are left as they are', () => {
    const i = world();
    const first = reconcile(i);
    const again = reconcile({ ...i, state: first.state, events: first.events, attempts: first.attempts, path: first.path });
    expect(again.report.migrations).toEqual([]);
    expect(again.changed).toEqual({ state: false, events: false, attempts: false, path: false, ui: false, session: false });
    expect(again.state).toBe(first.state);
  });

  it('keeps the richer record when the learner already has the node it became', () => {
    const l = learnerWith(['g:x', 'l:a', 'l:aa']);
    l.review('l:a', 'receptive', 3, { at: AT + 86_400_000 });
    const out = reconcile(input({ state: l.toJSON(), path: { unit: 0, day: 2 }, course: renamedCourse(), history: h }));
    expect(out.state.nodes['l:aa'].receptive!.reps).toBe(l.toJSON().nodes['l:a'].receptive!.reps);
    expect(Object.keys(out.state.orphans!)).toEqual(['l:aa']);
    expect(out.state.orphans!['l:aa'].id).toBe('l:aa');
  });

  it('renames the chapters and tasks the ui names', () => {
    const out = reconcile(input({
      ui: { readSeconds: { ch001: 70, ch009: 20 }, writing: { w1: { at: 5 } } }, path: { unit: 0, day: 2 },
      history: history(migration(1, { chapters: { rename: { ch001: 'ch900' } }, tasks: { rename: { w1: 'w2' } } })),
    }));
    expect(out.ui).toEqual({ readSeconds: { ch900: 70, ch009: 20 }, writing: { w2: { at: 5 } } });
  });
});

describe('a node retired or lost', () => {
  it('a retired node is kept apart whole, and gone from the path', () => {
    const i = input({ path: { unit: 0, day: 2, owedNew: ['l:b', 'l:c'], pendingDrills: [{ node: 'l:b', at: 2 }] }, history: history(migration(1, { nodes: { remove: ['l:b'] } })),
      course: buildCourse(original(), ids.filter((x) => x !== 'l:b').map(node)) });
    const out = reconcile(i);
    expect(out.state.nodes['l:b']).toBeUndefined();
    expect(out.state.orphans!['l:b']).toEqual(i.state.nodes['l:b']);
    expect(out.path.owedNew).toEqual(['l:c']);
    expect(out.path.pendingDrills).toEqual([]);
    expect(out.report.dropped).toEqual(['l:b', 'l:b']);
    expect(out.report.orphaned).toEqual([{ node: 'l:b', why: 'retired' }]);
    expect(Object.keys(out.state.ledger.item)).toEqual(Object.keys(i.state.ledger.item));
  });

  it('a node the course lost with no migration is kept apart the same way, and comes back with its id', () => {
    const without = course(original(), []);
    without.nodes.delete('l:b');
    const gone = reconcile(input({ course: without, path: { unit: 0, day: 2 } }));
    expect(gone.state.nodes['l:b']).toBeUndefined();
    expect(gone.state.orphans!['l:b']).toBeDefined();
    expect(gone.report.orphaned).toEqual([{ node: 'l:b', why: 'unknown' }]);
    const back = reconcile({ ...input({ path: { unit: 0, day: 2 } }), state: gone.state, path: gone.path });
    expect(back.state.nodes['l:b']).toEqual(gone.state.orphans!['l:b']);
    expect(back.state.orphans).toEqual({});
    expect(back.report.restored).toEqual(['l:b']);
  });

  it('leaves a learner alone when most of their nodes are missing: that is the wrong course, not a change', () => {
    const wrong = buildCourse(original(), [node('l:other')]);
    const i = input({ path: { unit: 0, day: 2 }, known: ['g:x', 'l:a', 'l:b', 'l:c', 'l:d', 'l:e', 'g:y'], course: wrong });
    const out = reconcile(i);
    expect(out.state).toBe(i.state);
    expect(out.report.problems.join(' ')).toMatch(/not in this course/);
    expect(out.path.owedNew).toEqual([]);
  });
});

describe('a course whose days moved', () => {
  it('finds the learner\'s day by its key when days are inserted ahead of it', () => {
    const moved = original();
    moved[0].days.splice(1, 0, ...unit('u01', [{ key: 'u01-d9', lexemes: ['l:e'] }, { key: 'u01-d8', focus: ['g:z'] }]).days);
    const out = reconcile(input({ path: { unit: 0, day: 2, dayKey: 'u01-d2', unitId: 'u01', contentVersion: 0 }, units: moved }));
    expect(out.path).toMatchObject({ unit: 0, day: 4, dayKey: 'u01-d2' });
    expect(out.report.place.how).toBe('moved');
  });

  it('owes what moved in front of the learner and they were never given', () => {
    // g:z (u02 d1) and l:e come to u01's start; the learner is on u01-d2, past them
    const moved = original();
    moved[0].days.unshift(...unit('u01', [{ key: 'u01-d9', lexemes: ['l:e'] }, { key: 'u01-d8', focus: ['g:z'] }]).days);
    moved[1].days.pop();
    const out = reconcile(input({ path: { unit: 0, day: 2, dayKey: 'u01-d2', unitId: 'u01', contentVersion: 0 }, units: moved }));
    expect(out.path).toMatchObject({ day: 4, owedNew: ['l:e'], owedGrammar: ['g:z'] });
    expect(out.report.owed).toEqual(['l:e', 'g:z']);
    expect(reconcile({ ...input({ units: moved }), state: out.state, path: out.path }).report.owed).toEqual([]);
  });

  it('owes a node moved to before the learner, but not one they have, one already owed or one moved ahead', () => {
    const moved = original();
    // l:d (u02) moves into u01 d0; l:a is listed again on d1 (the learner has it); g:z (u02) moves ahead of l:c
    moved[0].days[0].lexemes.push('l:d');
    moved[1].days[0].lexemes = [];
    moved[0].days[1].lexemes.push('l:a');
    const known = ['g:x', 'l:a', 'l:b', 'g:y', 'c:hi'];
    const at = { unit: 0, day: 3, dayKey: 'u01-d3', unitId: 'u01', contentVersion: 0 };
    const owedAlready = reconcile(input({ known, path: { ...at, owedNew: ['l:d'] }, units: moved }));
    expect(owedAlready.path.owedNew).toEqual(['l:d']);
    expect(owedAlready.report.owed).toEqual([]);
    const out = reconcile(input({ known, path: at, units: moved }));
    expect(out.report.owed).toEqual(['l:d']);
    expect(out.path.owedNew).toEqual(['l:d']);
    expect(out.path.owedGrammar).toEqual([]);
  });

  it('follows a day that moved into another unit', () => {
    const moved = original();
    const [d3] = moved[0].days.splice(3, 1);
    moved[1].days.push(d3);
    const out = reconcile(input({ path: { unit: 0, day: 3, dayKey: 'u01-d3', unitId: 'u01', contentVersion: 0 }, units: moved }));
    expect(out.path).toMatchObject({ unit: 1, day: 2, unitId: 'u02', dayKey: 'u01-d3' });
  });

  it('reads a path from before keys against the course its integers were counted in', () => {
    const moved = original();
    moved[0].days.reverse();
    const legacy = { format: 1 as const, units: { u01: ['u01-d0', 'u01-d1', 'u01-d2', 'u01-d3'], u02: ['u02-d0', 'u02-d1'] } };
    const out = reconcile(input({ path: { unit: 0, day: 1 }, units: moved, history: { migrations: [], legacy } }));
    expect(out.path).toMatchObject({ unit: 0, day: 2, dayKey: 'u01-d1' });
    expect(out.report.place.how).toBe('moved');
  });

  it('follows a day key a migration maps on, and says so when the day is gone', () => {
    const moved = original();
    moved[0].days[2].key = 'u01-d7';
    const base = { path: { unit: 0, day: 2, dayKey: 'u01-d2', unitId: 'u01', contentVersion: 0 }, units: moved };
    const mapped = reconcile(input({ ...base, history: history(migration(1, { days: { 'u01-d2': 'u01-d7' } })) }));
    expect(mapped.path).toMatchObject({ unit: 0, day: 2, dayKey: 'u01-d7', contentVersion: 1 });
    const lost = reconcile(input({ ...base, history: history(migration(1, { days: { 'u01-d2': null } })) }));
    expect(lost.report.place.how).toBe('lost');
    expect(lost.report.problems.join(' ')).toMatch(/u01-d2/);
    expect(lost.path).toMatchObject({ unit: 0, day: 2 });
  });

  it('keeps a learner who finished the course where the integers point, when units were added', () => {
    const longer = [...original(), unit('u03', [{ key: 'u03-d0', lexemes: ['l:e'] }, { key: 'u03-d1' }])];
    const legacy = { format: 1 as const, units: { u01: ['u01-d0', 'u01-d1', 'u01-d2', 'u01-d3'], u02: ['u02-d0', 'u02-d1'] } };
    const done = reconcile(input({ path: { unit: 2, day: 0 }, units: original(), history: { migrations: [], legacy } }));
    expect(done.report.place.how).toBe('finished');
    expect(done.path.dayKey).toBeUndefined();
    const more = reconcile(input({ path: { unit: 2, day: 0 }, units: longer, history: { migrations: [], legacy } }));
    expect(more.path).toMatchObject({ unit: 2, day: 0, unitId: 'u03', dayKey: 'u03-d0' });
  });
});

describe('an open lesson', () => {
  const plan = (extra: Record<string, unknown> = {}) => ({ unit: 'u01', day: 2, blocks: [{ kind: 'learn', items: [{ node: 'l:b', id: 'ln:l:b' }] }], ...extra });
  const session = (over: Partial<SessionDoc> = {}, p = plan()): SessionDoc => ({ version: 1, plan: p, ...over });
  const at = { unit: 0, day: 2, dayKey: 'u01-d2', unitId: 'u01', contentVersion: 0 };

  it('from before there were versions, and untouched by what changed, is kept and stamped', () => {
    const out = reconcile(input({ path: at, session: session(), history: history(migration(1, { nodes: { rename: { 'l:zzz': 'l:yyy' } } })) }));
    expect(out.session).toEqual({ version: 2, plan: plan(), contentVersion: 1, dayKey: 'u01-d2' });
    expect(out.report.session?.action).toBe('restamped');
  });

  it('is discarded when it names something a migration moved', () => {
    const out = reconcile(input({ path: at, session: session(), history: history(migration(1, { nodes: { rename: { 'l:b': 'l:bb' } } })), course: buildCourse(original(), [...ids.filter((x) => x !== 'l:b'), 'l:bb'].map(node)) }));
    expect(out.session).toBeNull();
    expect(out.report.session).toEqual({ action: 'discarded', why: 'it names l:b, which a content migration has moved' });
  });

  it('is discarded when the day it was planned for is no longer there', () => {
    const moved = original();
    moved[0].days.unshift(...unit('u01', [{ key: 'u01-d9' }]).days);
    const out = reconcile(input({ path: at, session: session({ version: 2, contentVersion: 0, dayKey: 'u01-d2' }), units: moved }));
    expect(out.session).toBeNull();
    expect(out.report.session?.why).toMatch(/no longer unit u01, day 2/);
    // from before keys, the day is read in the course it was counted in
    const legacy = { format: 1 as const, units: { u01: ['u01-d0', 'u01-d1', 'u01-d2', 'u01-d3'], u02: ['u02-d0', 'u02-d1'] } };
    expect(reconcile(input({ path: { unit: 0, day: 2 }, session: session(), units: moved, history: { migrations: [], legacy } })).session).toBeNull();
  });

  it('is left exactly alone when it is current', () => {
    const out = reconcile(input({ path: { ...at, contentVersion: 0 }, session: session({ version: 2, contentVersion: 0, dayKey: 'u01-d2' }) }));
    expect(out.session).toBeUndefined();
    expect(out.report.session).toEqual({ action: 'kept' });
    expect(out.changed.session).toBe(false);
  });

  it('is discarded when a newer build planned it', () => {
    const out = reconcile(input({ path: at, session: session({ version: 2, contentVersion: 5, dayKey: 'u01-d2' }) }));
    expect(out.session).toBeNull();
  });

  it('a lesson with no day (a review) has no place to move', () => {
    const out = reconcile(input({ path: at, session: session({}, { blocks: [] } as never) }));
    expect(out.session).toMatchObject({ version: 2, contentVersion: 0 });
  });
});

describe('documents from a newer build', () => {
  it('apply no migration, say so, and are never taken back to an older version', () => {
    const out = reconcile(input({ path: { unit: 0, day: 2, dayKey: 'u01-d2', unitId: 'u01', contentVersion: 4 }, history: history(migration(1, { nodes: { remove: ['l:b'] } })) }));
    expect(out.state.nodes['l:b']).toBeDefined();
    expect(out.report.problems.join(' ')).toMatch(/newer build/);
    expect(out.path.contentVersion).toBe(4);
  });
});

describe('stampPosition', () => {
  it('names the place, and names none once the course is done', () => {
    const c = course(original());
    expect(stampPosition({ ...initialPath(), unit: 1, day: 1 }, c, 3)).toMatchObject({ unitId: 'u02', dayKey: 'u02-d1', contentVersion: 3 });
    const done = stampPosition({ ...initialPath(), unit: 2, day: 0, unitId: 'u02', dayKey: 'u02-d1' }, c, 3);
    expect(done.unitId).toBeUndefined();
    expect(done.dayKey).toBeUndefined();
  });
});
