import { describe, expect, test } from 'vitest';
import { lateRequires, loadGraph, type GraphNode } from '../../../lib/graph';
import { bandOf, dropReason, hasDash, legalDay, normText, taughtDays } from '../../../tools/bank/lib';

const n = (id: string, kind: GraphNode['kind'], extra: Partial<GraphNode> = {}): GraphNode => ({ id, kind, requires: [], ...extra });
const g = loadGraph([n('g:a', 'grammar'), n('g:b', 'grammar'), n('g:u', 'grammar'), n('c:hi', 'chunk', { unpacks: 'g:u' }), n('l:casa', 'lexeme'), n('g:never', 'grammar')]);
const days = [{ lesson: 'L0' }, { lesson: null }, { lesson: 'L2' }, { lesson: 'L3' }];
const ln = { L0: { teaches: ['g:a'] }, L2: { teaches: ['c:hi', 'g:a'] }, L3: { teaches: ['g:b'] } };
const taught = taughtDays(g, days, ln);

describe('taught order and legalDay', () => {
  test('first day a lesson teaches the node; a chunk teaches what it unpacks', () => {
    expect(taught.get('g:a')).toBe(0);
    expect(taught.get('c:hi')).toBe(2);
    expect(taught.get('g:u')).toBe(2);
    expect(taught.get('g:b')).toBe(3);
    expect(taught.has('g:never')).toBe(false);
  });
  test('legalDay is the latest taught require; lexemes, unknown and never-taught do not block', () => {
    expect(legalDay(g, taught, ['g:a'], 4)).toBe(0);
    expect(legalDay(g, taught, ['g:a', 'g:b', 'l:casa'], 4)).toBe(3);
    expect(legalDay(g, taught, ['g:u', 'g:never', 'x:unknown'], 4)).toBe(2);
    expect(legalDay(g, taught, [], 4)).toBe(0);
    expect(legalDay(g, taught, ['g:a'], 0)).toBeNull();
  });
  test('agrees with lib/graph lateRequires (order position = day)', () => {
    const order = ['g:a', 'x:filler', 'c:hi', 'g:b'];
    for (const req of [['g:a'], ['g:b', 'g:u'], ['g:u'], ['g:never']]) {
      const d = legalDay(g, taught, req, 4)!;
      expect(lateRequires(g, order, req, d)).toEqual([]);
      if (d > 0) expect(lateRequires(g, order, req, d - 1).length).toBeGreaterThan(0);
    }
  });
  test('bandOf picks the last band starting at or before the day', () => {
    const b = { A1: 0, A2: 107, B1: 188 };
    expect([bandOf(0, b), bandOf(106, b), bandOf(107, b), bandOf(500, b)]).toEqual(['A1', 'A1', 'A2', 'B1']);
  });
});

describe('cleaning rules', () => {
  const ok = { confidence: 'high', lowReasons: [] as string[] };
  test('normalised duplicates drop, first copy stays', () => {
    const seen = new Set<string>();
    expect(normText('¿Dónde  está?')).toBe(normText('dónde está'));
    expect(dropReason({ es: 'Hola, soy Ana.' }, ok, [], seen).reason).toBeNull();
    expect(dropReason({ es: 'hola soy ana' }, ok, [], seen).reason).toBe('duplicate');
    expect(dropReason({ es: 'Él vino.' }, ok, [], seen).reason).toBeNull();
    expect(dropReason({ es: 'El vino.' }, ok, [], seen).reason).toBeNull();
  });
  test('dash, vosotros and voseo drop', () => {
    expect(hasDash('Hola — dijo')).toBe(true);
    expect(hasDash('Hola - dijo')).toBe(true);
    expect(hasDash('Es un ex-jefe.')).toBe(false);
    expect(dropReason({ es: 'a — b' }, ok, [], new Set()).reason).toBe('dash');
    expect(dropReason({ es: 'Vosotros habláis.' }, ok, ['vosotros'], new Set()).reason).toBe('vosotros');
    expect(dropReason({ es: 'Vos tenés.' }, ok, ['voseo'], new Set()).reason).toBe('voseo');
  });
  test('only low-confidence subjunctive without trigger drops', () => {
    const low = { confidence: 'low', lowReasons: ['subjunctive "hable" without a recognised trigger'] };
    expect(dropReason({ es: 'Que hable.' }, low, [], new Set()).reason).toBe('subjunctive-no-trigger');
    expect(dropReason({ es: 'Quiero que hable.' }, { confidence: 'low', lowReasons: ['unknown word "x"'] }, [], new Set()).reason).toBeNull();
  });
});
