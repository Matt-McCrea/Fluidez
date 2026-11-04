import { describe, expect, test } from 'vitest';
import { ancestors, castNames, lateRequires, loadGraph, nodesByKind, requiresOf, taughtAt, taughtBy, tagOptions, type GraphNode } from '../../../lib/graph';
import { tagSentence } from '../../../lib/tagger';
import { readGraphFiles } from '../tagger/fixture';

const n = (id: string, kind: GraphNode['kind'], requires: string[] = [], extra: Partial<GraphNode> = {}): GraphNode => ({ id, kind, requires, ...extra });
const small = loadGraph([
  [n('g:a', 'grammar'), n('g:b', 'grammar', ['g:a']), n('g:c', 'grammar', ['g:b', 'g:a'])],
  [n('c:hola', 'chunk', [], { es: 'Hola', unpacks: 'g:c' }), n('l:casa', 'lexeme', [], { pos: 'noun', gender: 'f' }), n('p:x', 'pattern', ['g:c'], { match: ['hola {*}'] })],
]);

describe('graph helpers', () => {
  test('loadGraph accepts nested or flat arrays and keeps the last duplicate', () => {
    expect(small.ids.size).toBe(6);
    const flat = loadGraph([n('g:a', 'grammar'), n('g:a', 'grammar', ['g:z'])]);
    expect(requiresOf(flat, 'g:a')).toEqual(['g:z']);
  });
  test('nodesByKind and requiresOf', () => {
    expect(nodesByKind(small, 'grammar').map((x) => x.id)).toEqual(['g:a', 'g:b', 'g:c']);
    expect(requiresOf(small, 'g:c')).toEqual(['g:b', 'g:a']);
    expect(requiresOf(small, 'g:nope')).toEqual([]);
  });
  test('ancestors are transitive, deduplicated and cycle safe', () => {
    expect(ancestors(small, 'p:x')).toEqual(['g:c', 'g:b', 'g:a']);
    expect(ancestors(small, 'g:a')).toEqual([]);
    const cyc = loadGraph([n('g:a', 'grammar', ['g:b']), n('g:b', 'grammar', ['g:a'])]);
    expect(ancestors(cyc, 'g:a')).toEqual(['g:b']);
  });
  test('taughtAt, taughtBy: a chunk also teaches the grammar it unpacks', () => {
    const order = ['g:a', 'c:hola', 'g:b'];
    expect(taughtAt(small, order).get('g:c')).toBe(1);
    expect([...taughtBy(small, order, 0)]).toEqual(['g:a']);
    expect([...taughtBy(small, order, 1)].sort()).toEqual(['c:hola', 'g:a', 'g:c']);
    expect(taughtBy(small, order).size).toBe(4);
  });
  test('lateRequires ignores lexemes, unknown and unscheduled ids', () => {
    const order = ['g:a', 'g:b', 'g:c'];
    expect(lateRequires(small, order, ['g:a', 'g:c', 'l:casa', 'g:zzz', 'p:x'], 1)).toEqual(['g:c']);
  });
  test('castNames takes capitalised mid-sentence words, not English stop words or closed class', () => {
    expect(castNames('Tomás meets Don Hernando in Bogotá. The week starts.')).toEqual(expect.arrayContaining(['tomás', 'hernando', 'bogotá']));
    expect(castNames('Tomás meets Ana.')).not.toContain('meets');
  });
});

describe('tagOptions', () => {
  test('builds chunks, patterns and graphIds as the gate does, and registers lexemes', () => {
    const o = tagOptions(small);
    expect(o.chunks).toEqual([{ id: 'c:hola', es: 'Hola', unpacks: 'g:c' }]);
    expect(o.patterns).toEqual([{ id: 'p:x', match: ['hola {*}'] }]);
    expect(o.graphIds!.has('l:casa')).toBe(true);
    expect(tagSentence('La casa.', o).requires).toContain('l:casa');
  });
  test('chunk forms and match frames join as / alternatives, line breaks become reply turns', () => {
    const g = loadGraph([n('c:q', 'chunk', [], { es: 'Hola\nChao', forms: [{ es: 'Buenas', en: 'x' }], match: ['Voy'] })]);
    expect(tagOptions(g).chunks![0].es).toBe('Hola — Chao / Buenas / Voy');
  });
  test('featureMap and names pass through', () => {
    const fm = { 'np.article': null };
    expect(tagOptions(small, { featureMap: fm }).featureMap).toBe(fm);
    tagOptions(small, { names: ['zorbalina'] });
    expect(tagSentence('Zorbalina come.').lowReasons.join()).not.toMatch(/zorbalina/i);
  });
});

describe('the real graph', () => {
  const g = loadGraph(readGraphFiles());
  test('loads all six kinds and every requires id exists', () => {
    for (const k of ['grammar', 'pattern', 'chunk', 'lexeme', 'contrast', 'cando'] as const) expect(nodesByKind(g, k).length, k).toBeGreaterThan(0);
    const missing: string[] = [];
    for (const x of g.nodes.values()) for (const r of x.requires ?? []) if (!g.ids.has(r)) missing.push(`${x.id} -> ${r}`);
    expect(missing).toEqual([]);
  });
  test('ancestors of a late grammar node include the early ones, never itself', () => {
    const late = nodesByKind(g, 'grammar').filter((x) => (x.requires ?? []).length).at(-1)!;
    const a = ancestors(g, late.id);
    expect(a).not.toContain(late.id);
    for (const r of late.requires!) expect(a).toContain(r);
  });
});
