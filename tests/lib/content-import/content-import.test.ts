import { describe, expect, test } from 'vitest';
import { loadGraph, type GraphNode } from '../../../lib/graph';
import { gapOptionOk, hasDash, servingLegalDay } from '../../../tools/content-import-lib';

const n = (id: string, kind: GraphNode['kind']): GraphNode => ({ id, kind, requires: [] });
const g = loadGraph([n('g:a', 'grammar'), n('g:never', 'grammar'), n('x:never', 'contrast'), n('p:never', 'pattern'), n('c:never', 'chunk'), n('c:late', 'chunk'), n('l:casa', 'lexeme')]);
const taught = new Map([['g:a', 0], ['c:late', 5]]);

describe('servingLegalDay', () => {
  test('latest taught day', () => { expect(servingLegalDay(g, taught, ['g:a', 'c:late'], 10)).toBe(5); });
  test('never-taught g: and x: block', () => {
    expect(servingLegalDay(g, taught, ['g:a', 'g:never'], 10)).toBeNull();
    expect(servingLegalDay(g, taught, ['x:never'], 10)).toBeNull();
  });
  test('never-taught p:, c:, l: and unknown ids do not block', () => {
    expect(servingLegalDay(g, taught, ['g:a', 'p:never', 'c:never', 'l:casa', 'g:ghost'], 10)).toBe(0);
  });
  test('no days is null', () => { expect(servingLegalDay(g, taught, [], 0)).toBeNull(); });
});

describe('gapOptionOk', () => {
  const it = { es: 'Estoy de acuerdo con Vale.', gap: [0, 5] as [number, number], options: ['Estoy', 'Soy'], answer: 0 };
  test('right option equals the gap text', () => { expect(gapOptionOk(it)).toBe(true); });
  test('wrong option, bad answer index or out of range fails', () => {
    expect(gapOptionOk({ ...it, answer: 1 })).toBe(false);
    expect(gapOptionOk({ ...it, answer: 5 })).toBe(false);
    expect(gapOptionOk({ ...it, gap: [0, 99] })).toBe(false);
  });
});

test('hasDash', () => { expect(hasDash('a — b')).toBe(true); expect(hasDash('a - b')).toBe(true); expect(hasDash('co-op')).toBe(false); });
