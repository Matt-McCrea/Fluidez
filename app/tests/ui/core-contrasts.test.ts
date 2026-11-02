// A contrast's own items (content/contrasts) are core content: a due contrast has to be reviewable and trainable
// wherever the learner is, so every file comes with the bundle, for a learner at the start and for one in the last
// unit, is in the compiler's index, and one that failed to arrive is asked for again (F3).
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_FILES, ContentLoader } from '../../src/ui/data/loader';

const DIR = join(__dirname, '../../content/contrasts');
const nodes = readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '').replace('_', ':'));

describe('the contrasts\' own items are core content', () => {
  it('the course has a file for nearly every contrast', () => {
    expect(nodes.length).toBeGreaterThanOrEqual(90);
  });

  for (const unit of [0, 59]) {
    it(`come with a bundle whose window is unit index ${unit}, and are in the compiler's index`, async () => {
      const b = await new ContentLoader().load({ unit });
      for (const node of nodes) {
        expect(b.contrasts.has(node), node).toBe(true);
        expect(b.index.contrasts.get(node)?.length, node).toBe(b.contrastItems(node).length);
        expect(b.contrastItems(node).length, node).toBeGreaterThan(0);
      }
      // each item by its id
      const some = b.contrastItems('x:por-para')[0];
      expect(b.contrastItem(some.id)).toBe(some);
    }, 120_000);
  }

  it('are not read twice when a window and the core both name them', async () => {
    const loader = new ContentLoader();
    const b = await loader.load({ unit: 0 });
    const n = b.contrasts.size;
    await b.ensureWindow(0);
    expect(b.contrasts.size).toBe(n);
    expect(b.source.contrasts?.length).toBe(n);
    expect(loader.problems).toEqual([]);
  }, 120_000);

  it('a file that fails to arrive is named as lacking and asked for again, and one nobody wrote is not', async () => {
    const net = { up: false };
    const contrasts = Object.fromEntries(Object.entries(CONTENT_FILES.contrasts).map(([p, load]) => [p, async () => { if (!net.up && p.includes('/x_por-para')) throw new Error('net::ERR_FAILED'); return load(); }]));
    const b = await new ContentLoader({ ...CONTENT_FILES, contrasts }).load({ unit: 0 });
    expect(b.contrasts.has('x:por-para')).toBe(false);
    expect(b.source.lacking?.includes('contrasts:x:por-para')).toBe(true);
    expect(b.contrasts.has('x:hay-esta')).toBe(true);
    net.up = true;
    expect((await b.contrastFor('x:por-para')).length).toBeGreaterThan(0);
    expect(b.source.lacking).toEqual([]);
    // a contrast with no file is not asked for twice, and is not lacking
    expect(await b.contrastFor('x:not-a-contrast')).toEqual([]);
    expect(b.source.lacking).toEqual([]);
  }, 120_000);

  it('a file that does not parse is skipped and counted, never fixed', async () => {
    const bad = { 'x_junk.json': async () => ({ node: 'x:junk', decides: 'sometimes', items: [] }) };
    const loader = new ContentLoader({ ...CONTENT_FILES, contrasts: { '/content/contrasts/x_junk.json': bad['x_junk.json'] } });
    const b = await loader.load({ unit: 0 });
    expect(b.contrasts.size).toBe(0);
    expect(loader.problems.some((p) => p.includes('x_junk'))).toBe(true);
  }, 120_000);
});
