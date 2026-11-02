// The close screen on a unit's last day looked like every other day's: "9 of 10
// lessons" became "10 of 10 lessons" and nothing else changed. The end of a unit
// is marked, in words that say only what happened.
import { describe, expect, it, vi } from 'vitest';
import type { CloseBlock } from '../../src/compiler';
import { Close, unitEndLine } from '../../src/ui/blocks/writing';
import { undash } from '../../src/ui/components/text';
import { fixtureBundle } from './driver';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = v; }];
  },
  useMemo: (f: () => unknown) => f(),
  useRef: (init: unknown) => ({ current: init }),
  useEffect: () => {},
}));

const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));
const expand = (node: any): any => {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
};

const bundle = fixtureBundle();
const unit = bundle.unit('u01')!;

function closeAfter(done: number, of = unit.days.length) {
  h.slots = []; h.at = 0;
  const block = { kind: 'close', part: 'close', deliberate: false, minutes: 0.5, unit: unit.id, canDo: unit.canDo, progress: { done, of }, offerAnother: false } as CloseBlock;
  const run: any = { bundle, tally: { scored: 0, firstTry: 0 }, misses: [], learner: { events: () => [] } };
  return text(expand(Close({ block, run, more: false, onMore: () => {}, onHome: () => {}, ui: {} as any, onDone: () => {} })));
}

describe('the close screen on the last day of a unit', () => {
  it('says the unit is finished, by its name', () => {
    const n = unit.days.length;
    const t = closeAfter(n);
    expect(t).toContain(`You finished "${undash(unit.title)}".`);
    expect(t).not.toMatch(/[–—]/);   // the fixture's own title has a dash in it
  });

  it('says nothing of the kind on any other day', () => {
    const n = unit.days.length;
    for (const done of [1, Math.floor(n / 2), n - 1]) expect(closeAfter(done), `after lesson ${done}`).not.toMatch(/You finished/);
  });

  it('is a pure line of its own, with no dash and nothing for a close with no progress', () => {
    expect(unitEndLine({ done: 10, of: 10 }, { title: 'Meeting people' })).toBe('You finished "Meeting people".');
    expect(unitEndLine({ done: 9, of: 10 }, { title: 'Meeting people' })).toBeUndefined();
    expect(unitEndLine(undefined, { title: 'Meeting people' })).toBeUndefined();
    expect(unitEndLine({ done: 10, of: 10 }, undefined)).toBeUndefined();
    expect(unitEndLine({ done: 10, of: 10 }, { title: 'Hello — and goodbye' })).not.toMatch(/[–—]/);
  });
});
