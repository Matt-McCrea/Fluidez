// A contrast's script is core content: a due contrast has to be reviewable wherever the learner is
// (audit 2.13, 2.19), not only while its unit is inside the window. Every x_ script comes with the
// bundle, for a learner at the start and for one in the last unit.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ContentLoader } from '../../src/ui/data/loader';

const SCRIPTS = join(__dirname, '../../content/scripts');
const contrastFiles = readdirSync(SCRIPTS).filter((f) => f.startsWith('x_') && f.endsWith('.json'));

describe('contrast scripts are core content', () => {
  it('the course has contrast scripts to carry', () => {
    expect(contrastFiles.length).toBeGreaterThan(80);
  });

  for (const unit of [0, 29, 59]) {
    it(`come with a bundle whose window is unit index ${unit}, and are in the compiler's index`, async () => {
      const b = await new ContentLoader().load({ unit });
      for (const f of contrastFiles) {
        const node = f.replace(/\.json$/, '').replace('_', ':');
        expect(b.scripts.has(node), node).toBe(true);
        expect(b.index.scripts.has(node), node).toBe(true);
      }
    }, 120_000);
  }

  it('bring no other script with them: those come with their window', async () => {
    const b = await new ContentLoader().load({ unit: 59 });
    const others = [...b.scripts.keys()].filter((n) => !n.startsWith('x:'));
    const far = others.filter((n) => n === 'g:ser-identity');
    expect(far).toEqual([]);
    expect(others.length).toBeGreaterThan(0);
  }, 120_000);

  it('are not read twice when a window and the core both name them', async () => {
    const loader = new ContentLoader();
    const b = await loader.load({ unit: 0 });
    const n = b.scripts.size;
    await b.ensureWindow(0);
    expect(b.scripts.size).toBe(n);
    expect(loader.problems).toEqual([]);
  }, 120_000);
});
