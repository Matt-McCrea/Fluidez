import { describe, expect, test, vi } from 'vitest';
import { initialPath } from '../../src/compiler';
import { IdbStore, Learner } from '../../src/learner';
import { applyStreak, emptyUi, MemoryKV, PATH_KEY, streakStatus, UI_KEY, UiStore } from '../../src/ui/store/ui';

describe('UiStore migrations', () => {
  test('a v1 ui document keeps its learnerId and comes out at v2', async () => {
    const kv = new MemoryKV();
    const old: any = { ...emptyUi('learner-abc'), version: 1, onboarded: true, goal: 'work' };
    await kv.set(UI_KEY, old);
    await kv.set(PATH_KEY, { ...initialPath(), version: 1, coreSessions: 3 });
    const ui = await new UiStore(kv).load();
    expect(ui.state.learnerId).toBe('learner-abc');
    expect(ui.state.version).toBe(2);
    expect(ui.state.goal).toBe('work');
    expect(ui.path.version).toBe(2);
    expect(ui.path.coreSessions).toBe(3);
    expect((await kv.get(UI_KEY) as any).version).toBe(2);
  });

  test('an unversioned ui document keeps its learnerId', async () => {
    const kv = new MemoryKV();
    const { version, ...bare } = emptyUi('keep-me') as any;
    await kv.set(UI_KEY, bare);
    expect((await new UiStore(kv).load()).state.learnerId).toBe('keep-me');
  });

  test('a newer ui or path document throws and is quarantined, never replaced', async () => {
    const kv = new MemoryKV();
    await kv.set(UI_KEY, { ...emptyUi('future'), version: 99 });
    await expect(new UiStore(kv).load()).rejects.toThrow(/newer/);
    expect((await kv.get(UI_KEY) as any).learnerId).toBe('future');
    expect((await kv.get(`${UI_KEY}.quarantine`) as any).version).toBe(99);

    const kv2 = new MemoryKV();
    await kv2.set(PATH_KEY, { ...initialPath(), version: 99 });
    await expect(new UiStore(kv2).load()).rejects.toThrow(/newer/);
    expect(((await kv2.get(PATH_KEY)) as any).version).toBe(99);
  });
});

describe('reconcile and commitSession', () => {
  const entry = (learnerSession: number, core?: number) =>
    ({ learnerSession, coreSession: core, type: 'review', advanced: true, throttled: false }) as any;

  test('a path ahead of the learner is trimmed to the learner', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    await ui.setPath({ ...initialPath(), coreSessions: 3, log: [entry(1, 1), entry(2, 2), entry(3, 3)] });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await ui.reconcile(2)).toBe(true);
    warn.mockRestore();
    expect(ui.path.log.map((e) => e.learnerSession)).toEqual([1, 2]);
    expect(ui.path.coreSessions).toBe(2);
    expect(((await kv.get(PATH_KEY)) as any).log).toHaveLength(2);
  });

  test('consistent paths are untouched', async () => {
    const ui = await new UiStore(new MemoryKV()).load();
    await ui.setPath({ ...initialPath(), coreSessions: 1, log: [entry(1, 1)] });
    expect(await ui.reconcile(1)).toBe(false);
    expect(await ui.reconcile(5)).toBe(false);
  });

  test('commitSession on a shared KV writes state, events, path and ui together', async () => {
    const kv = new MemoryKV();
    const learner = await Learner.open(new IdbStore(kv));
    const ui = await new UiStore(kv).load();
    learner.startSession();
    await ui.commitSession(learner, { ...initialPath(), coreSessions: 1 }, '2026-01-01');
    expect(((await kv.get('state')) as any).session.index).toBe(1);
    expect(((await kv.get(PATH_KEY)) as any).coreSessions).toBe(1);
    expect(((await kv.get(UI_KEY)) as any).stats.sessions).toBe(1);
  });
});

describe('remediation list on the path', () => {
  test('an old path document without remediate loads with an empty list', async () => {
    const kv = new MemoryKV();
    const { remediate: _gone, ...old } = initialPath();
    await kv.set(PATH_KEY, { ...old, coreSessions: 2 });
    const ui = await new UiStore(kv).load();
    expect(ui.path.remediate).toEqual([]);
    expect(ui.path.coreSessions).toBe(2);
  });
});

describe('streak freezes', () => {
  const mk = () => emptyUi('s');
  const run = (u: ReturnType<typeof mk>, days: string[]) => { for (const d of days) applyStreak(u, d); return u; };
  const seq = (start: number, n: number) => Array.from({ length: n }, (_, i) => `2026-10-${String(start + i).padStart(2, '0')}`);

  test('a new document holds one freeze; an old ui document loads with freezes 1', async () => {
    expect(emptyUi('x').freezes).toBe(1);
    const kv = new MemoryKV();
    const { freezes, frozenDays, streakRun, weekly, ...old } = emptyUi('old') as any;
    await kv.set(UI_KEY, { ...old, version: 2 });
    const ui = await new UiStore(kv).load();
    expect(ui.state.freezes).toBe(1);
    expect(ui.state.frozenDays).toEqual([]);
  });

  test('one freeze is earned at 7 in a row and the cap is 2', () => {
    const u = run(mk(), seq(1, 6));
    expect(u.freezes).toBe(1);
    run(u, seq(7, 1));
    expect(u.freezes).toBe(2);
    run(u, seq(8, 14));
    expect(u.freezes).toBe(2);
  });

  test('a missed day uses a freeze and the streak survives', () => {
    const u = run(mk(), ['2026-10-01', '2026-10-02', '2026-10-04']);
    expect(u.freezes).toBe(0);
    expect(u.freezeUsedOn).toBe('2026-10-04');
    expect(u.frozenDays).toEqual(['2026-10-03']);
    expect(streakStatus(u, '2026-10-04')).toEqual({ days: 3, keptWithDayOff: true, freezes: 0 });
    expect(streakStatus(u, '2026-10-05').keptWithDayOff).toBe(false);
  });

  test('with no freeze left, or a longer gap, the streak restarts; reviews are never touched', () => {
    const u = run(mk(), ['2026-10-01', '2026-10-03', '2026-10-06']);
    expect(u.freezes).toBe(0);
    expect(streakStatus(u, '2026-10-06').days).toBe(1);
    const v = run(mk(), ['2026-10-01', '2026-10-05']);
    expect(v.freezes).toBe(1);
    expect(v.streakRun).toBe(1);
  });

  test('a second session on the same day changes nothing, and Home shows a waiting freeze as kept', () => {
    const u = run(mk(), ['2026-10-01', '2026-10-01']);
    expect(u.stats.days).toEqual(['2026-10-01']);
    expect(streakStatus(u, '2026-10-03').days).toBe(1);
  });

  test('words are bucketed by day when the tally changes', async () => {
    const ui = await new UiStore(new MemoryKV()).load();
    await ui.update((s) => { s.stats.wordsRead += 40; s.stats.wordsWritten += 5; });
    const k = Object.keys(ui.state.weekly)[0];
    expect(ui.state.weekly[k]).toEqual({ read: 40, written: 5 });
  });
});
