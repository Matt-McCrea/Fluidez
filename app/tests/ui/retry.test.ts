// "Try again" is a chance to change the answer. It used to resubmit the same
// wrong text from the field, which spent the second attempt and revealed the
// answer before the learner had touched it. Driven here through the real
// components, one render at a time, with hooks that keep their values between
// renders (there is no DOM).
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { PersonalBlock } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import type { Card } from '../../src/ui/session/cards';

let slots: unknown[] = [];
let at = 0;
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = at++;
    if (!(i in slots)) slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [slots[i], (v: unknown) => { slots[i] = typeof v === 'function' ? (v as (x: unknown) => unknown)(slots[i]) : v; }];
  },
  useRef: (v: unknown) => { const i = at++; if (!(i in slots)) slots[i] = { current: v }; return slots[i]; },
  useMemo: (f: () => unknown) => f(),
  useEffect: () => {},
}));

/** One render: components are called down to host elements. */
function render(component: unknown, props: unknown): any {
  at = 0;
  let node: any = { type: component, props };
  while (node && typeof node.type === 'function') node = node.type(node.props);
  return node;
}
/** Resolve every component in a tree, leaving host elements. */
function resolve(node: any): any {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(resolve);
  if (typeof node.type === 'function') return resolve(node.type(node.props));
  return { ...node, props: { ...node.props, children: resolve(node.props?.children) } };
}
function find(node: any, pred: (n: any) => boolean, out: any[] = []): any[] {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
  if (pred(node)) out.push(node);
  find(node.props?.children, pred, out);
  return out;
}
const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));

/** The screen as the learner could act on it. */
function screen(component: unknown, props: unknown) {
  const tree = resolve(render(component, props));
  const input = find(tree, (n) => n.type === 'input')[0];
  const primary = find(tree, (n) => n.type === 'button' && n.props['data-primary'] !== undefined)[0];
  return {
    primary, text: text(tree),
    type: (v: string) => input.props.onInput({ currentTarget: { value: v } }),
    enter: () => input.props.onKeyDown({ key: 'Enter', isComposing: false, preventDefault() {} }),
    click: () => primary.props.onClick(),
  };
}

describe('Try again on a typed card', () => {
  const card = (check: (s: string) => any): Card => ({
    type: 'type', key: 'k', ask: 'How do you say this in Spanish?', prompt: { text: 'Where is the bathroom?', lang: 'en' },
    answerLang: 'es', placeholder: 'Type it in Spanish', retry: true, why: 'because', check,
  } as Card);

  it('the same wrong text cannot be sent twice: the button waits for an edit, and so does Enter', async () => {
    const { CardView } = await import('../../src/ui/components/card');
    const check = vi.fn((s: string) => (s === 'dónde está el baño' ? { pass: true, answer: 'dónde está el baño' } : { pass: false, answer: 'dónde está el baño', hint: 'Have another look.' }));
    const onDone = vi.fn();
    const props = { card: card(check), onDone };
    slots = [];

    let s = screen(CardView, props);
    s.type('donde esta');
    s = screen(CardView, props);
    expect(s.primary.props.disabled).toBeFalsy();
    s.click();                                                   // the first attempt
    expect(check).toHaveBeenCalledTimes(1);

    s = screen(CardView, props);
    expect(s.text).toContain('Have another look.');              // asked to try again, answer not shown
    expect(s.text).not.toContain("Here's the right version");
    expect(s.primary.props.disabled, 'nothing has changed yet').toBe(true);
    s.click();
    s.enter();
    expect(check, 'neither a click nor Enter spends the second attempt').toHaveBeenCalledTimes(1);
    s = screen(CardView, props);
    expect(s.text).not.toContain("Here's the right version");

    s.type('donde esta el bano');                               // an edit: a real second attempt
    s = screen(CardView, props);
    expect(s.primary.props.disabled).toBeFalsy();
    s.click();
    expect(check).toHaveBeenCalledTimes(2);
    s = screen(CardView, props);
    expect(s.text).toContain("Here's the right version");
  });

  it('changing the answer back to the first one is not an edit either', async () => {
    const { CardView } = await import('../../src/ui/components/card');
    const check = vi.fn(() => ({ pass: false, answer: 'a', hint: 'h' }));
    const props = { card: card(check), onDone: vi.fn() };
    slots = [];
    let s = screen(CardView, props);
    s.type('uno'); s = screen(CardView, props); s.click();
    s = screen(CardView, props);
    s.type('  uno  '); s = screen(CardView, props);
    expect(s.primary.props.disabled).toBe(true);
  });

  it('a card with no retry reveals at once, as before', async () => {
    const { CardView } = await import('../../src/ui/components/card');
    const check = vi.fn(() => ({ pass: false, answer: 'respuesta' }));
    const props = { card: { ...card(check), retry: false } as Card, onDone: vi.fn() };
    slots = [];
    let s = screen(CardView, props);
    s.type('x'); s = screen(CardView, props); s.click();
    s = screen(CardView, props);
    expect(s.text).toContain("Here's the right version");
  });
});

describe('Check again on the personal sentence', () => {
  let bundle: Bundle;
  beforeAll(async () => { bundle = await new ContentLoader().load({ band: 'A1' }); }, 120_000);

  it('the same sentence cannot be checked twice: it takes an edit', async () => {
    const { Personal } = await import('../../src/ui/blocks/teach');
    const node = [...bundle.scripts.keys()][0];
    const block = { kind: 'personal', part: 'core', deliberate: false, node, minutes: 1 } as PersonalBlock;
    const props = { block, run: { bundle, addWords: vi.fn(), learner: { sessionIndex: 1 } }, ui: { keep: { saveWriting: vi.fn() } }, onDone: vi.fn() };
    slots = [];
    let s = screen(Personal, props);
    s.type('zzz qqq'); s = screen(Personal, props);
    s.click();                                                   // not Spanish: asked to change it
    s = screen(Personal, props);
    expect(s.text).toContain('Change it and try once more');
    expect(s.primary.props.disabled, 'nothing has changed yet').toBe(true);
    s.click();
    s.enter();
    s = screen(Personal, props);
    expect(s.text, 'still asking, not showing the model').not.toContain("Here's one way");
    s.type('zzz qqq www'); s = screen(Personal, props);
    expect(s.primary.props.disabled).toBeFalsy();
    s.click();
    s = screen(Personal, props);
    expect(s.text).toContain("Here's one way");
  });
});
