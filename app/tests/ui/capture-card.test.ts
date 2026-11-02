// What a card reports when it ends. The outcome used to carry a verdict and the last thing typed, and the
// first try, the kind of slip the checker named, the card's look and the time to the first key were gone
// by the time anything could use them. This draws the card the way the framework would (no DOM here:
// hooks keep their values between renders, effects do not run).
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CardView, mcqResult } from '../../src/ui/components/card';
import { AnswerField } from '../../src/ui/components/answer';
import { Continue } from '../../src/ui/components/card';
import type { Card, Check, McqCard, TypeCard } from '../../src/ui/session/cards';
import type { Outcome } from '../../src/ui/session/attempt';

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

afterEach(() => { vi.restoreAllMocks(); });

/** Draw down to the answer field and the buttons, which are left as elements so their handlers can be called. */
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

/** A player at one card: draw, act, draw again. `clock` is what the stopwatch says. */
function player(card: Card) {
  const clock = { t: 1000 };
  vi.spyOn(performance, 'now').mockImplementation(() => clock.t);
  h.slots = [];
  let done: { o: Outcome; input?: string } | undefined;
  const draw = () => { h.at = 0; return expand(CardView({ card, onDone: (o, input) => { done = { o, input }; } })); };
  let tree = draw();
  return {
    clock,
    get done() { return done; },
    type(text: string) { find(tree, (n) => n.type === AnswerField)[0].props.onChange(text); tree = draw(); },
    check() { find(tree, (n) => n.props?.['data-primary'] && n.type !== Continue)[0].props.onClick(); tree = draw(); },
    giveUp() { find(tree, (n) => n.props?.['data-giveup'])[0].props.onClick(); tree = draw(); },
    next() { find(tree, (n) => n.type === Continue)[0].props.onClick(); },
    pick(i: number) { find(tree, (n) => n.props?.['data-option'] === i)[0].props.onClick(); tree = draw(); },
  };
}

const typed = (check: (input: string) => Check): TypeCard => ({
  type: 'type', key: 'k1', ask: 'Say it', prompt: { text: 'The coffee', lang: 'en' }, answerLang: 'es', placeholder: 'Type it', check, retry: true, why: 'because',
});
const wants = (answer: string, onMiss: Partial<Check> = {}) => (input: string): Check => (input === answer ? { pass: true, answer } : { pass: false, answer, ...onMiss });

describe('a typed card', () => {
  it('reports what was given on the first try, how long the first key took, and the card\'s look', () => {
    const p = player(typed(wants('el café')));
    p.clock.t = 3100;
    p.type('el café');
    p.clock.t = 5000;
    p.check();
    p.next();
    expect(p.done!.o).toMatchObject({ correct: true, tries: 1, given: 'el café', firstKeyMs: 2100, fmt: 'type:en>es' });
    expect(p.done!.o.err).toBeUndefined();
    expect(p.done!.o.shown).toBeUndefined();
  });

  it('keeps the first try when the second one fixes it, and names the slip the checker found in the first', () => {
    const p = player(typed(wants('el café', { hint: 'Check the article.', hintKind: 'article', rule: 'gender-café' })));
    p.clock.t = 1900;
    p.type('la café');
    p.clock.t = 4000;
    p.check();
    p.type('el café');
    p.check();
    p.next();
    const o = p.done!.o;
    expect(o).toMatchObject({ correct: true, tries: 2, given: 'la café', err: 'article', rule: 'gender-café', firstKeyMs: 900 });
    expect(o.shown, 'the right version was never shown').toBeUndefined();
    expect(o.evidence).toEqual({ input: 'el café', answer: 'el café' });
  });

  it('on a miss, reports the right version it was shown, and the first try, not the second', () => {
    const p = player(typed(wants('el café', { hintKind: 'wrong-word' })));
    p.type('el té');
    p.check();
    p.type('el jugo');
    p.check();
    p.next();
    expect(p.done!.o).toMatchObject({ correct: false, tries: 2, given: 'el té', shown: 'el café', err: 'wrong-word' });
    expect(p.done!.input).toBe('el jugo');
  });

  it('an accent slip is an accent slip, whether the card forgave it or not', () => {
    const p = player(typed((input) => (input === 'café' ? { pass: true, answer: 'café' } : { pass: false, near: true, answer: 'café' })));
    p.type('cafe');
    p.check();
    p.type('café');
    p.check();
    p.next();
    expect(p.done!.o).toMatchObject({ correct: true, tries: 2, given: 'cafe', err: 'accents' });
  });

  it('showing the answer before typing anything names no slip and gives nothing', () => {
    const p = player(typed(wants('el café', { hint: undefined, hintKind: 'empty' })));
    p.giveUp();
    p.next();
    const o = p.done!.o;
    expect(o).toMatchObject({ correct: false, given: '', shown: 'el café' });
    expect(o.err).toBeUndefined();
    expect(o.firstKeyMs).toBeUndefined();
  });

  it('the time to the first key is the first key, not the last, and a backspace to nothing is not one', () => {
    const p = player(typed(wants('el café')));
    p.clock.t = 1400;
    p.type('');
    p.clock.t = 2000;
    p.type('e');
    p.clock.t = 9000;
    p.type('el café');
    p.check();
    p.next();
    expect(p.done!.o.firstKeyMs).toBe(1000);
  });
});

describe('a card with options', () => {
  const card: McqCard = {
    type: 'mcq', key: 'm1', ask: 'Which one?', prompt: { text: 'Yo hablo', lang: 'es' }, why: 'because',
    options: [{ text: 'I speak', lang: 'en' }, { text: 'I spoke', lang: 'en' }, { text: 'I will speak', lang: 'en' }], answer: 0, feature: 'tense',
  };

  it('reports the option picked and, on a miss, the right one, with the card\'s look', () => {
    const p = player(card);
    p.pick(1);
    p.next();
    expect(p.done!.o).toMatchObject({ correct: false, tries: 1, given: 'I spoke', shown: 'I speak', fmt: 'mcq:es>en', evidence: { picked: 1, feature: 'tense' } });
  });

  it('a right pick shows nothing', () => {
    const p = player(card);
    p.pick(0);
    p.next();
    expect(p.done!.o).toMatchObject({ correct: true, given: 'I speak' });
    expect(p.done!.o.shown).toBeUndefined();
  });

  it('"I don\'t know" gives nothing', () => {
    expect(mcqResult(card, 'unsure', 900).outcome).toMatchObject({ correct: false, given: '', shown: 'I speak' });
  });
});
