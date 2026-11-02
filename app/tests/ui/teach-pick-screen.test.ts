// A lesson's read-and-pick does not give its answer away by the length of the right option (as the structured-input fallback screens).
import { describe, expect, it } from 'vitest';
import { screenPicks } from '../../src/ui/session/cards';
import type { ScriptItem } from '../../src/compiler';
import type { TeachingScript } from '../../src/content/schema';

const item = (op: ScriptItem['op'], index: number): ScriptItem => ({ op, id: `sc:g:a:${op}:${index}`, node: 'g:a', index, scoring: 'exposure', credit: ['g:a'] });
const rp = (options: string[], answer: number) => ({ es: 'x', options, answer });
const script = (picks: ReturnType<typeof rp>[]) => ({ readAndPick: picks, yourTurn: [] }) as unknown as TeachingScript;

describe('screenPicks', () => {
  const fair = rp(['por', 'para', 'con'], 1);
  const long = rp(['a', 'en', 'estaba trabajando mucho'], 2);

  it('drops a pick whose right option is plainly the longest, and keeps the rest and the typed turns', () => {
    const items = [item('readAndPick', 0), item('readAndPick', 1), item('yourTurn', 0)];
    expect(screenPicks(items, script([fair, long])).map((i) => i.id)).toEqual([items[0].id, items[2].id]);
  });

  it('keeps them all when every pick gives itself away, so the lesson is not left empty', () => {
    const items = [item('readAndPick', 0), item('readAndPick', 1)];
    expect(screenPicks(items, script([long, long]))).toHaveLength(2);
  });
});
