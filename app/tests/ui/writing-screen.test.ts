// The writing screen called the checker with no context, so its floor judged
// "is this Spanish" with the English-word fallback alone and word salad built from
// unknown words passed it (F14), and the floor's reason was never shown: the ticks
// just vanished. This draws the screen the way the framework would (no DOM here:
// hooks keep their values between renders, effects do not run).
import { describe, expect, it, vi } from 'vitest';
import { Writing } from '../../src/ui/blocks/writing';
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
const find = (node: any, pred: (n: any) => boolean, out: any[] = []): any[] => {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
  if (pred(node)) out.push(node);
  find(node.props?.children, pred, out);
  return out;
};

const bundle = fixtureBundle();
/** The writing screen with `typed` in the box. */
function screen(typed: string, task = 'wt-u01-1') {
  h.slots = [typed, false, {}];   // text, submitted, rubric
  h.at = 0;
  const run: any = { bundle, expose: () => {}, addWords: async () => {} };
  const ui: any = { state: {}, update: async () => {} };
  return expand(Writing({ block: { kind: 'writing', task, purpose: 'output' } as any, run, ui, onDone: () => {} }));
}

describe('the floor on the writing screen', () => {
  const salad = 'Blorf zaz kemi tulo pran gurt snik. Zorp blat quim fenk dru pol vask.';

  it('is judged against what the course holds, so Spanish-looking nonsense earns no tick and says why', () => {
    const t = screen(salad);
    expect(text(t)).toContain('Most of this is not Spanish yet. Write it in Spanish.');
    expect(find(t, (n) => n.props?.class === 'done')).toHaveLength(0);
  });

  it('says nothing about the floor for real Spanish, and ticks what was done', () => {
    const t = screen('Hola, Vale. Soy Matt. Soy de Toronto. No soy turista.');
    expect(text(t)).not.toMatch(/not Spanish|find a verb|keep coming back/);
    expect(find(t, (n) => n.props?.class === 'done').length).toBeGreaterThan(0);
  });

  it('keeps the ticks of Spanish fragments and says what the app could not find', () => {
    const t = screen('Un tinto con leche. Dos empanadas de pollo. Una botella de agua. La cuenta, por favor. Soy de Toronto.');
    expect(text(t)).toMatch(/find a verb/);
    expect(find(t, (n) => n.props?.class === 'done').length).toBeGreaterThan(0);
  });
});
