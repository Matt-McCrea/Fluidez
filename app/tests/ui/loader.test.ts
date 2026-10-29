// The windowed loader: only the units around the learner, extended on demand.
import { beforeAll, describe, expect, it } from 'vitest';
import { ContentLoader, WINDOW_AFTER, WINDOW_BEFORE } from '../../src/ui/data/loader';
import type { Bundle } from '../../src/ui/data/bundle';

const unitsOf = (b: Bundle) => [...new Set([...b.sentences.values()].map((s) => s.unit))].sort();

describe('windowed content loader', () => {
  let loader: ContentLoader;
  let b: Bundle;
  beforeAll(async () => { loader = new ContentLoader(); b = await loader.load({ band: 'A1', unit: 'u05' }); }, 120_000);

  it('loads the graph and every unit, but content only for u03 to u08', () => {
    expect(WINDOW_BEFORE).toBe(2);
    expect(WINDOW_AFTER).toBe(3);
    expect(b.course.units.length).toBe(60);
    expect(unitsOf(b)).toEqual(['u03', 'u04', 'u05', 'u06', 'u07', 'u08']);
    for (const s of b.scenes.values()) expect(s.unit).toMatch(/^u0[3-8]$/);
    for (const t of b.tasks.values()) expect(t.unit).toMatch(/^u0[3-8]$/);
    for (const c of b.chapters.values()) expect(c.unit).toMatch(/^u0[3-8]$/);
    expect(b.chapters.size).toBeGreaterThan(0);
    expect(loader.problems).toEqual([]);
  });

  it('clamps the window at the start', async () => {
    const first = await new ContentLoader().load({ unit: 0 });
    expect(unitsOf(first)).toEqual(['u01', 'u02', 'u03', 'u04']);
  });

  it('ensureUnits extends the bundle in place and rebuilds the index', async () => {
    const before = b.sentences.size;
    expect(await b.ensureUnits({ to: 7 })).toBe(true);
    expect(unitsOf(b)).toEqual(['u01', 'u02', 'u03', 'u04', 'u05', 'u06', 'u07', 'u08']);
    expect(b.sentences.size).toBeGreaterThan(before);
    expect(await b.ensureUnits({ to: 7 })).toBe(false);
  });

  it('ensureWindow follows the learner forward', async () => {
    expect(await b.ensureWindow(9)).toBe(true);
    expect(unitsOf(b)).toContain('u12');
  });

  it('scriptFor fetches a missing script once and caches it', async () => {
    const node = 'g:comparatives';
    const fresh = await new ContentLoader().load({ unit: 0 });
    expect(fresh.scripts.has(node)).toBe(false);
    const s = await fresh.scriptFor(node);
    expect(s?.node).toBe(node);
    expect(fresh.scripts.get(node)).toBe(s);
    expect(await fresh.scriptFor(node)).toBe(s);
    expect(await fresh.scriptFor('g:no-such-node')).toBeUndefined();
  });
});
