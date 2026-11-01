// The shell had no error boundary: a screen that threw while drawing left a
// blank page with no way out, and the boot failure screen offered only "Try
// again". Components are called without a DOM here (hooks keep their values
// between renders; effects do not run).
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary, Trouble, bootTrouble } from '../../src/ui/app';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = typeof v === 'function' ? (v as (x: unknown) => unknown)(h.slots[i]) : v; }];
  },
  useEffect: () => {},
}));

function find(node: any, pred: (n: any) => boolean, out: any[] = []): any[] {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
  if (pred(node)) out.push(node);
  find(node.props?.children, pred, out);
  return out;
}
const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));

describe('the boundary around a screen', () => {
  const boundary = (onHome = vi.fn()) => {
    const b = new ErrorBoundary({ onHome, children: 'the screen' });
    b.setState = vi.fn();
    return { b, onHome };
  };

  it('draws the screen while nothing has gone wrong', () => {
    expect(boundary().b.render()).toBe('the screen');
  });

  it('turns a throw into a state, and the state into a way out', () => {
    const { b, onHome } = boundary();
    b.state = ErrorBoundary.getDerivedStateFromError(new Error('boom'));
    const tree: any = b.render();
    expect(tree.type).toBe(Trouble);
    expect(tree.props.detail).toBe('boom');
    const buttons = find(tree, (n) => n.type === 'button');
    expect(buttons.map((n) => n.props['data-home'] !== undefined ? 'home' : 'reload')).toEqual(['home', 'reload']);
    buttons[0].props.onClick();
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(b.setState).toHaveBeenCalledWith({ error: undefined });
  });

  it('keeps a thrown string or object readable', () => {
    expect(ErrorBoundary.getDerivedStateFromError('plain').error?.message).toBe('plain');
  });

  it('is what the shell wraps every screen in, tabs included', async () => {
    const { App } = await import('../../src/ui/app');
    const ctx = { ui: { state: { onboarded: true }, subscribe: () => () => {}, path: { unit: 0 } }, learner: {}, bundle: {}, now: Date.now, refresh() {}, reloadBundle: async () => {} };
    h.slots = [ctx];   // the first state in App is the booted context
    h.at = 0;
    const tree = App({}) as any;
    const wrapped = find(tree, (n) => n.type === ErrorBoundary);
    expect(wrapped).toHaveLength(1);
    expect(find(wrapped[0], (n) => n.type === 'nav'), 'the tabs are inside it, so a throwing tab screen cannot strand the learner').toHaveLength(1);
  });
});

describe('the boot failure screen', () => {
  it('reads a newer document from its fault, and anything else as it is', () => {
    expect(bootTrouble(Object.assign(new Error('Your progress was saved by a newer version.'), { fault: 'newer' }))).toEqual({ message: 'Your progress was saved by a newer version.', newer: true });
    expect(bootTrouble(Object.assign(new Error('damaged'), { fault: 'unreadable' }))).toEqual({ message: 'damaged', newer: false });
    expect(bootTrouble(new Error('offline'))).toEqual({ message: 'offline', newer: false });
    expect(bootTrouble('plain')).toEqual({ message: 'plain', newer: false });
  });

  it('says what happened and shows the ways out it is given', () => {
    const tree: any = Trouble({ message: 'It broke.', children: 'out' });
    expect(text(tree)).toContain('Something went wrong');
    expect(text(tree)).toContain('It broke.');
    expect(text(tree)).toContain('out');
  });
});
