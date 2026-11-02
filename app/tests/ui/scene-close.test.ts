// F15: sceneVerdict existed and its own tests passed, but the scene screen still
// printed "They understood you" from its own template, so five "no sé" replies
// closed with the old line. This draws the screen's close with the log of a run,
// the way the framework would (no DOM here: hooks keep their values between
// renders, effects do not run).
import { describe, expect, it, vi } from 'vitest';
import { ScenePlay } from '../../src/ui/blocks/scene';
import { turnOrder } from '../../src/ui/session/scene';
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
/** Expand function components, so the text of a whole screen can be read. */
const expand = (node: any): any => {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
};

const bundle = fixtureBundle();
const scene = bundle.scenes.get('sc-u01-a')!;
const turns = turnOrder(scene);

/** The close of a scene whose replies went as `outcomes` say: [first, second]. */
function closeOf(outcomes: [boolean, boolean?][]) {
  const log = turns.map((turn, k) => {
    const [first, second] = outcomes[k % outcomes.length];
    return { turn, first: 'x', firstCheck: { pass: first, model: 'm' }, ...(second === undefined ? {} : { second: 'y', secondCheck: { pass: second, model: 'm' } }) };
  });
  h.slots = [0, log, '', 'end', 0];   // i, log, value, stage, left
  h.at = 0;
  const run: any = { bundle, scenes: new Map(), addWords: async () => {}, expose: () => {} };
  return text(expand(ScenePlay({ block: { kind: 'scene', scene: scene.id, purpose: 'output' } as any, run, ui: {} as any, onDone: () => {} })));
}

describe('the close of a scene', () => {
  it('says nothing landed when nothing did, and does not claim they understood', () => {
    const t = closeOf([[false, false]]);
    expect(t).toContain(`None of the ${turns.length} ${turns.length === 1 ? 'reply' : 'replies'} landed this time.`);
    expect(t).not.toMatch(/understood you|fixed|You did it/);
  });

  it('still says they understood you when every reply landed, first time or after one fix', () => {
    expect(closeOf([[true]])).toMatch(/They understood you\. (All \d+ replies|That reply) landed first time\./);
    if (turns.length > 1) expect(closeOf([[true], [false, true]])).toMatch(/They understood you\. \d+ of \d+ landed first time, and the other \d+ after one fix\./);
  });

  it('a reply that never landed is not counted as fixed', () => {
    if (turns.length > 1) expect(closeOf([[true], [false, false]])).toMatch(/replies landed, \d+ of them first time\./);
  });
});
