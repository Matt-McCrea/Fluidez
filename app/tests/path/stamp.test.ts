// The UI store names the place on every path and lesson it writes, once boot has settled the learner,
// so no writer can forget; and writes what it was given untouched before that.
import { describe, expect, it } from 'vitest';
import { buildCourse, initialPath } from '../../src/compiler';
import type { GraphNode, Unit } from '../../src/content/schema';
import { Learner, MemoryStore } from '../../src/learner';
import { MemoryKV, SESSION_KEY, UiStore, type SavedSession } from '../../src/ui/store/ui';

const day = (key: string) => ({ key, type: 'drill', focus: [], chunks: [], lexemes: [] });
const course = buildCourse([{ id: 'u01', days: [day('u01-d4'), day('u01-d0'), day('u01-d1')] }, { id: 'u02', days: [day('u02-d0')] }] as unknown as Unit[], [] as GraphNode[]);
const lesson = (over: Partial<SavedSession['plan']> = {}): SavedSession => ({
  version: 1, learnerId: 'x', sessionIndex: 1, mode: 'next', capMinutes: 20, startedAt: 0, elapsedMs: 0, savedAt: 0,
  plan: { sessionIndex: 1, seed: 1, tier: 'standard', mode: 'next', type: 'drill', blocks: [], ...over } as never, block: 0, cursor: {},
  runner: { entered: [], skipped: [], presented: [], notPresented: [], lapses: [], learnSteps: [], learnMisses: [], typedOk: [], cardsDone: [], tally: { scored: 0, correct: 0, firstTry: 0 }, scenes: [], reads: [], marked: [], startedAt: 0 },
});

describe('a tracked UI store', () => {
  it('names the place on every path it writes: setPath and the end of a session', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    ui.track(course, 4);
    await ui.setPath({ ...initialPath(), unit: 0, day: 1 });
    expect(kv.data.get('path')).toMatchObject({ unit: 0, day: 1, unitId: 'u01', dayKey: 'u01-d0', contentVersion: 4 });
    const learner = await Learner.open(new MemoryStore(), {});
    await ui.commitSession(learner, { ...initialPath(), unit: 1, day: 0, coreSessions: 1, unitId: 'u01', dayKey: 'u01-d4' }, '2026-01-01');
    expect(ui.path).toMatchObject({ unit: 1, day: 0, unitId: 'u02', dayKey: 'u02-d0', contentVersion: 4 });
  });

  it('names no day once the course is finished', async () => {
    const ui = await new UiStore(new MemoryKV()).load();
    ui.track(course, 1);
    await ui.setPath({ ...initialPath(), unit: 2, day: 0, unitId: 'u02', dayKey: 'u02-d0' });
    expect(ui.path.unitId).toBeUndefined();
    expect(ui.path.dayKey).toBeUndefined();
  });

  it('stamps a saved lesson v2 with the version and the key of the day it plans', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    ui.track(course, 4);
    await ui.saveSession(lesson({ unit: 'u01', day: 2 }));
    expect(kv.data.get(SESSION_KEY)).toMatchObject({ version: 2, contentVersion: 4, dayKey: 'u01-d1' });
    await ui.saveSession(lesson());
    expect(kv.data.get(SESSION_KEY)).toMatchObject({ version: 2, contentVersion: 4 });
    expect((kv.data.get(SESSION_KEY) as SavedSession).dayKey).toBeUndefined();
  });
});

describe('an untracked UI store (a fixture course, or before boot settles)', () => {
  it('writes the path and the lesson as it was given them', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    await ui.setPath({ ...initialPath(), unit: 0, day: 1 });
    expect(kv.data.get('path')).toEqual({ ...initialPath(), unit: 0, day: 1 });
    await ui.saveSession(lesson({ unit: 'u01', day: 2 }));
    expect(kv.data.get(SESSION_KEY)).toMatchObject({ version: 1 });
    expect(ui.contentVersion).toBe(0);
  });
});
