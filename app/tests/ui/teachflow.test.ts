// The teach flow's sequencing, over all the real scripts: examples in groups
// of two or three, the rule in two layers, a spot-it pick that holds the
// node's word exactly once.
import { beforeAll, describe, expect, it } from 'vitest';
import type { TeachingScript } from '../../src/content/schema';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { exampleGroups, nodeWords, ruleLayers, spotFeedback, spotIt, TRICK_MAX } from '../../src/ui/session/teachflow';

let bundle: Bundle;
let scripts: TeachingScript[];
beforeAll(async () => {
  bundle = await new ContentLoader().load({ band: 'A1' });
  scripts = [...bundle.scripts.values()];
}, 60_000);

const wc = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

describe('exampleGroups', () => {
  it('shapes', () => {
    const sizes = (n: number) => exampleGroups(Array.from({ length: n }, (_, i) => i)).map((g) => g.length);
    expect(sizes(3)).toEqual([3]);
    expect(sizes(4)).toEqual([2, 2]);
    expect(sizes(7)).toEqual([3, 2, 2]);
    expect(sizes(10)).toEqual([3, 3, 2, 2]);
  });
  it('real scripts: 2 to 3 per group, none lost, order kept, never more than 3 at once', () => {
    expect(scripts.length).toBeGreaterThanOrEqual(200);
    for (const s of scripts) {
      const groups = exampleGroups(s.examples);
      expect(groups.flat(), s.node).toEqual(s.examples);
      for (const g of groups) { expect(g.length, s.node).toBeGreaterThanOrEqual(2); expect(g.length, s.node).toBeLessThanOrEqual(3); }
    }
  });
});

describe('ruleLayers', () => {
  it('real scripts: a short trick, nothing lost', () => {
    for (const s of scripts) {
      const { trick, rest } = ruleLayers(s.rule);
      expect(trick.length, s.node).toBeGreaterThan(0);
      expect(wc(trick), s.node).toBeLessThanOrEqual(TRICK_MAX);
      expect((trick + rest).replace(/\s+/g, ' ').trim(), s.node).toBe(s.rule.replace(/\s+/g, ' ').trim());
      expect(s.rule.startsWith(trick), s.node).toBe(true);
    }
  });
  it('takes two sentences when the first is short', () => {
    const r = ruleLayers('Use ser. It names what things are, and who. More here.');
    expect(r.trick).toBe('Use ser. It names what things are, and who.');
    expect(r.rest.trim()).toBe('More here.');
  });
  it('has no rest for a one-sentence rule', () => {
    expect(ruleLayers('Ser is for what things are, always, and estar is for where they are.').rest).toBe('');
  });
});

describe('spotIt', () => {
  it('real scripts: when built, the node word is in the options exactly once, and in the group', () => {
    let built = 0;
    for (const s of scripts) {
      const node = bundle.node(s.node);
      const nw = nodeWords(node?.es, node?.forms);
      for (const g of exampleGroups(s.examples)) {
        const pick = spotIt(g, nw);
        if (!pick) continue;
        built++;
        expect(pick.options.length, s.node).toBe(3);
        expect(new Set(pick.options).size, s.node).toBe(3);
        const word = pick.options[pick.answer];
        expect(nw, s.node).toContain(word);
        expect(pick.options.filter((o) => nw.includes(o)), s.node).toEqual([word]);
        expect(g.some((e) => e.es.toLowerCase().includes(word)), s.node).toBe(true);
        for (const o of pick.options) expect(g.some((e) => e.es.toLowerCase().includes(o)), `${s.node} ${o}`).toBe(true);
        expect(spotFeedback(pick, pick.answer)).toBe(`Yes, ${word}.`);
        expect(spotFeedback(pick, (pick.answer + 1) % 3)).toBe(`It's ${word}.`);
      }
    }
    expect(built).toBeGreaterThan(100);
  });
  it('skips when the node word is not in the group', () => {
    expect(spotIt([{ es: 'Hola amigo mío.', en: '' }, { es: 'Buenas tardes, señora.', en: '' }], ['quiero'])).toBeNull();
  });
});
