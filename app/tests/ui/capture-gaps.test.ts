// Answers that come in by other doors than a scored card. A rule recall grades nothing and a scene turn is not
// a card, and what was typed into them was gone the moment they ended. Drawn the way the framework would (no
// DOM here: hooks keep their values between renders, effects do not run).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnswerField } from '../../src/ui/components/answer';
import { Continue } from '../../src/ui/components/card';
import { ScenePlay } from '../../src/ui/blocks/scene';
import { RuleRecall } from '../../src/ui/blocks/teach';
import { turnOrder } from '../../src/ui/session/scene';
import { fixtureBundle } from './driver';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = v; }];
  },
  useRef: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = { current: init };
    return h.slots[i];
  },
  useMemo: (f: () => unknown) => f(),
  useEffect: () => {},
}));

afterEach(() => { vi.unstubAllGlobals(); });

const expand = (node: any): any => {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node.type === 'function' && node.type !== AnswerField && node.type !== Continue) return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
};
const find = (node: any, pred: (n: any) => boolean, out: any[] = []): any[] => {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => find(n, pred, out)); return out; }
  if (pred(node)) out.push(node);
  find(node.props?.children, pred, out);
  return out;
};

function player(component: (p: any) => any, props: unknown) {
  h.slots = [];
  const draw = () => { h.at = 0; return expand(component(props)); };
  let tree = draw();
  return {
    type(text: string) { find(tree, (n) => n.type === AnswerField)[0].props.onChange(text); tree = draw(); },
    send() { find(tree, (n) => n.props?.['data-primary'] && n.type !== Continue)[0].props.onClick(); tree = draw(); },
    next() { find(tree, (n) => n.type === Continue)[0].props.onClick(); tree = draw(); },
    /** how many answer fields are on the screen */
    fields() { return find(tree, (n) => n.type === AnswerField).length; },
  };
}

const bundle = fixtureBundle();
const scene = bundle.scenes.get('sc-u01-a')!;
const turns = turnOrder(scene);
const runner = () => ({ bundle, scenes: new Map(), addWords: async () => {}, expose: () => {}, answered: vi.fn() });

describe('a scene turn is an answer', () => {
  const props = (run: unknown, kind = 'scene') => ({ block: { kind, scene: scene.id, purpose: 'output' }, run, ui: {}, onDone: () => {} });
  const row = { node: turns[0].focus ?? scene.id, op: 'scene', sentence: `${scene.id}:${turns[0].id}` };

  it('a reply that lands first time is one row, right on the first try', () => {
    const run = runner();
    const p = player(ScenePlay, props(run));
    p.next();
    p.type(turns[0].accept[0]);
    p.send();
    expect(run.answered).toHaveBeenCalledTimes(1);
    expect(run.answered).toHaveBeenCalledWith(row, expect.objectContaining({ correct: true, tries: 1, fmt: 'scene', given: turns[0].accept[0] }));
  });

  it('a reply sent back is logged when the turn ends, once, with the first reply', () => {
    const run = runner();
    const p = player(ScenePlay, props(run));
    p.next();
    p.type('zzz qqq');
    p.send();
    expect(run.answered, 'the turn is still going').not.toHaveBeenCalled();
    p.type('zzz www');
    p.send();
    expect(run.answered).toHaveBeenCalledTimes(1);
    expect(run.answered).toHaveBeenCalledWith(row, expect.objectContaining({ correct: false, tries: 2, given: 'zzz qqq', shown: turns[0].accept[0] }));
  });

  it('a fix that lands counts as landed, on the second try', () => {
    const run = runner();
    const p = player(ScenePlay, props(run));
    p.next();
    p.type('zzz qqq');
    p.send();
    p.type(turns[0].accept[0]);
    p.send();
    expect(run.answered).toHaveBeenCalledWith(row, expect.objectContaining({ correct: true, tries: 2, given: 'zzz qqq' }));
  });

  it('a timed rerun gives no second go, so its one reply ends the turn', () => {
    vi.stubGlobal('window', { clearInterval: () => {}, setInterval: () => 0 });
    const run = runner();
    const p = player(ScenePlay, props(run, 'sceneRerun'));
    p.next();
    p.type('zzz qqq');
    p.send();
    expect(run.answered).toHaveBeenCalledTimes(1);
    expect(run.answered).toHaveBeenCalledWith(row, expect.objectContaining({ correct: false, tries: 1, fmt: 'scene:timed', given: 'zzz qqq' }));
  });
});

describe('a rule recall is an answer', () => {
  it('what the learner could still produce is one row, and no grade', () => {
    const node = [...bundle.scripts.keys()][0];
    const run = runner();
    const p = player(RuleRecall, { block: { kind: 'ruleRecall', node }, run, ui: {}, onDone: () => {} });
    p.type('no me acuerdo');
    p.send();
    p.next();
    expect(run.answered).toHaveBeenCalledTimes(1);
    expect(run.answered).toHaveBeenCalledWith({ node, op: 'ruleRecall' }, expect.objectContaining({ correct: false, given: 'no me acuerdo', fmt: 'type:en>es' }));
  });
});

describe('a rule recall of a point the learner only recognises', () => {
  it('goes straight to the reminder: nobody is asked to type voseo', () => {
    const node = [...bundle.scripts.keys()][0];
    const run = { ...runner(), learner: { node: () => ({ productiveTrack: false }) } };
    const p = player(RuleRecall, { block: { kind: 'ruleRecall', node }, run, ui: {}, onDone: () => {} });
    expect(p.fields()).toBe(0);
    p.next();
    expect(run.answered).not.toHaveBeenCalled();
    // one the learner is to say is still asked first
    const asked = player(RuleRecall, { block: { kind: 'ruleRecall', node }, run: { ...runner(), learner: { node: () => ({ productiveTrack: true }) } }, ui: {}, onDone: () => {} });
    expect(asked.fields()).toBe(1);
  });
});
