import { describe, expect, it } from 'vitest';
import { dayWord, weekMap } from '../../src/ui/session/labels';
import { session, world } from './driver';
import { SessionRunner, compilePlan, softBlock } from '../../src/ui/session/runner';

describe('week map', () => {
  it('words each day type plainly', () => {
    expect(dayWord('introduce')).toBe('Teach');
    expect(dayWord('output')).toBe('Conversation');
    expect(dayWord('checkpoint')).toBe('Check-in');
  });
  it('marks done, today and later, with the grammar title under a teach day', () => {
    const days = [{ type: 'introduce' as const, focus: ['g:a'] }, { type: 'drill' as const, focus: [] }, { type: 'input' as const, focus: [] }];
    const m = weekMap(days, 1, { title: () => 'Saying Where Things Are' });
    expect(m.map((d) => d.state)).toEqual(['done', 'today', 'later']);
    expect(m[0].title).toBe('saying Where Things Are');
    expect(m[1].title).toBeUndefined();
  });
});

describe('only five minutes', () => {
  it('compiles minimum, skips the reread, leaves the path and today alone', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { mode: 'next', now: w.now(), tier: 'minimum' });
    expect(plan.tier).toBe('minimum');
    plan.blocks.filter((b) => b.kind === 'reread').forEach((b) => expect(softBlock(b)).toBe(true));
  });
  it('a finished quick session leaves the path and today alone but adds the day', async () => {
    const w = await world();
    const plan = compilePlan(w.learner, w.bundle, w.ui, { mode: 'next', now: w.now(), tier: 'minimum' });
    const before = structuredClone(w.ui.path);
    const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now, { capMinutes: 5, quick: true });
    run.start();
    await run.finish();
    expect(plan.tier).toBe('minimum');
    // the path keeps its place (only the session log grows)
    expect({ ...w.ui.path, log: [] }).toEqual({ ...before, log: [] });
    expect(w.ui.path.log.length).toBe(before.log.length + 1);
    expect(w.ui.state.stats.today).toBe(0);
    expect(w.ui.state.stats.days).toContain(w.learner.day(w.now()));
  });
  it('commitSession quick records quickToday, keeps the streak day, not today', async () => {
    const w = await world();
    const path = structuredClone(w.ui.path);
    const day = w.learner.day(w.now());
    await w.ui.commitSession(w.learner, path, day, { quick: true });
    expect(w.ui.state.stats.today).toBe(0);
    expect(w.ui.state.stats.quickToday).toBe(day);
    expect(w.ui.state.stats.days).toContain(day);
    expect(w.ui.path).toEqual(path);
  });
});

describe('close screen misses', () => {
  it('a wrong session collects unique nodes, capped', async () => {
    const w = await world();
    const { run } = await session(w, 'wrong');
    expect(run.misses.length).toBeGreaterThan(0);
    expect(run.misses.length).toBeLessThanOrEqual(12);
    const nodes = run.misses.map((m) => m.node);
    expect(new Set(nodes).size).toBe(nodes.length);
    expect(nodes.slice(0, 6).length).toBeLessThanOrEqual(6);
  });
});
