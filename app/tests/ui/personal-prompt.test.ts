// The personal sentence's prompt is content with light markup (*Mucho* marks
// Spanish): on screen it goes through Rich, so the learner never sees the
// asterisks (898 of 916 scripts have some).
import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { PersonalBlock } from '../../src/compiler';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';

// no DOM here: hooks hold their first value, which is all one static render needs
vi.mock('preact/hooks', () => ({
  useState: (v: unknown) => [typeof v === 'function' ? (v as () => unknown)() : v, () => {}],
  useMemo: (f: () => unknown) => f(),
  useEffect: () => {},
  useRef: (v: unknown) => ({ current: v }),
}));

/** The text of a vnode tree, calling components as it goes. */
function textOf(node: any): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (typeof node.type === 'function') return textOf(node.type(node.props));
  return textOf(node.props?.children);
}
/** Every element of a vnode tree with this tag. */
function elements(node: any, tag: string, out: any[] = []): any[] {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { node.forEach((n) => elements(n, tag, out)); return out; }
  if (node.type === tag) out.push(node);
  if (typeof node.type === 'function') elements(node.type(node.props), tag, out);
  else elements(node.props?.children, tag, out);
  return out;
}

let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ band: 'A1' }); }, 120_000);

describe('the personal sentence prompt', () => {
  it('shows a prompt written with *marks* as Spanish text, not as asterisks', async () => {
    const { Personal } = await import('../../src/ui/blocks/teach');
    const node = [...bundle.scripts].find(([, s]) => /\*[^*]+\*/.test(s.personal ?? ''))?.[0];
    expect(node, 'some A1 script has a marked prompt').toBeTruthy();
    const block = { kind: 'personal', part: 'core', deliberate: false, node, minutes: 1 } as PersonalBlock;
    const tree = (Personal as any)({ block, run: { bundle }, onDone: () => {} });
    const asks = elements(tree, 'p').filter((p) => p.props?.class === 'ask');
    expect(asks).toHaveLength(1);
    const shown = textOf(asks[0]);
    expect(shown).not.toContain('*');
    const marked = [...(bundle.scripts.get(node!)!.personal ?? '').matchAll(/\*([^*]+)\*/g)].map((m) => m[1]);
    for (const w of marked) expect(shown).toContain(w);
    expect(elements(asks[0], 'em').map(textOf)).toEqual(marked);
  });

  it('every script prompt in the course renders without a stray asterisk', async () => {
    const all = await new ContentLoader().load({ band: 'C1' });
    const { Rich } = await import('../../src/ui/components/text');
    const stray = [...all.scripts].filter(([, s]) => s.personal && textOf((Rich as any)({ text: s.personal })).includes('*')).map(([id]) => id);
    expect(stray).toEqual([]);
  }, 120_000);
});
