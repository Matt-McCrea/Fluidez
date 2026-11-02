// The windowed loader: only the units around the learner, extended on demand.
import { beforeAll, describe, expect, it } from 'vitest';
import { CONTENT_FILES, ContentLoader, WINDOW_AFTER, WINDOW_BEFORE } from '../../src/ui/data/loader';
import { bringChapter } from '../../src/ui/data/prepare';
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

  it('asks again for a script that failed to arrive, and does not take it for one nobody wrote', async () => {
    const net = { up: false };
    const scripts = Object.fromEntries(Object.entries(CONTENT_FILES.scripts).map(([p, load]) => [p, async () => { if (!net.up) throw new Error('net::ERR_FAILED'); return load(); }]));
    const fresh = await new ContentLoader({ ...CONTENT_FILES, scripts }).load({ unit: 0 });
    const node = 'g:comparatives';
    expect(await fresh.scriptFor(node)).toBeUndefined();
    net.up = true;
    expect((await fresh.scriptFor(node))?.node).toBe(node);
    // one nobody wrote is still asked for once
    expect(await fresh.scriptFor('g:no-such-node')).toBeUndefined();
  });

  describe('on a slow connection, a file another call has in the air', () => {
    /** The real files, with one held back until the test lets it go or loses it. */
    function held(kind: 'story' | 'scripts', path: string) {
      let arrive!: () => void;
      let lose!: () => void;
      const gate = new Promise<void>((resolve, reject) => { arrive = resolve; lose = () => reject(new Error('net::ERR_FAILED')); });
      const real = CONTENT_FILES[kind][path];
      const map = { ...CONTENT_FILES[kind], [path]: async () => { await gate; return real(); } };
      return { files: { ...CONTENT_FILES, [kind]: map }, map, real, arrive, lose };
    }

    it('is waited for, not called lacking: the reader shows the chapter prepare is already fetching', async () => {
      const slow = held('story', '/content/story/ch050.json');
      const b = await new ContentLoader(slow.files).load({ unit: 0 });
      const prepare = b.ensureChapters(['ch050']);
      const reader = bringChapter(b, 'ch050');
      slow.arrive();
      expect(await reader).toBe('ready');
      await prepare;
      expect(b.source.chapters.filter((c) => c.id === 'ch050')).toHaveLength(1);
    });

    it('is not remembered as a script nobody wrote when it is lost in the air', async () => {
      const path = '/content/scripts/g_comparatives.json';
      const slow = held('scripts', path);
      const b = await new ContentLoader(slow.files).load({ unit: 0 });
      const first = b.scriptFor('g:comparatives');
      const second = b.scriptFor('g:comparatives');
      slow.lose();
      expect(await first).toBeUndefined();
      expect(await second).toBeUndefined();
      // the connection is back, and it is asked for again
      slow.map[path] = slow.real;
      expect((await b.scriptFor('g:comparatives'))?.node).toBe('g:comparatives');
      expect(b.source.lacking).toEqual([]);
    });
  });
});
