// The games' ops are read by Weak spots as drills of forms: a miss at speed locates a weak tense or word, and the fix is
// a drill of the forms, never the choice between two tenses (that is what a miss on the choice is for).
import { describe, expect, it } from 'vitest';
import type { GraphNode } from '../../src/content/schema';
import { Rating, type ReviewEvent } from '../../src/learner';
import { weakSpots } from '../../src/learner/weak';

const NOW = Date.UTC(2026, 10, 1);
const NODES: Record<string, Partial<GraphNode>> = {
  'g:pret-vs-imperfect': { id: 'g:pret-vs-imperfect', kind: 'grammar', title: 'Two pasts', contrasts: ['x:pret-imp'] },
  'x:pret-imp': { id: 'x:pret-imp', kind: 'contrast', title: 'Preterite or imperfect' },
  'l:casa': { id: 'l:casa', kind: 'lexeme', title: 'house', freqRank: 300 },
};
const look = (id: string) => NODES[id] as GraphNode | undefined;
const ev = (node: string, op: string, miss: boolean): ReviewEvent => ({
  at: NOW - 86_400_000, node, dir: 'productive', grade: miss ? Rating.Again : Rating.Good, op, tries: 1, novel: false, session: 1, scored: 'exposure',
});
const run = (n: number, f: (i: number) => ReviewEvent) => Array.from({ length: n }, (_, i) => f(i));
const opts = { now: NOW, metVerbs: ['hablar'], introduced: () => true };

describe('weak spots from the games', () => {
  it('misses at speed on a tense are a spot, trained by its forms', () => {
    const spots = weakSpots(run(6, () => ev('g:pret-vs-imperfect', 'flash', true)), look, opts);
    expect(spots.length).toBeGreaterThan(0);
    expect(spots.every((s) => s.spec.kind === 'conjugate')).toBe(true);
  });

  it('the same misses on the choice itself go to the contrast, which a form drill must not do', () => {
    const asChoice = weakSpots(run(6, () => ev('g:pret-vs-imperfect', 'type', true)), look, opts);
    expect(asChoice.some((s) => s.spec.kind === 'nodes' && s.spec.nodes.includes('x:pret-imp'))).toBe(true);
    const asDrill = weakSpots(run(6, () => ev('g:pret-vs-imperfect', 'flash', true)), look, opts);
    expect(asDrill.some((s) => s.spec.kind === 'nodes' && s.spec.nodes.includes('x:pret-imp'))).toBe(false);
  });

  it('a word missed in a round is a spot like a word missed in a drill', () => {
    const spots = weakSpots(run(4, () => ev('l:casa', 'flash', true)), look, opts);
    expect(spots).toHaveLength(1);
    expect(spots[0]).toMatchObject({ kind: 'node', key: 'l:casa' });
  });

  it('a rescued card counts like any review of a form', () => {
    const spots = weakSpots(run(4, () => ev('l:casa', 'rescue', true)), look, opts);
    expect(spots).toHaveLength(1);
  });
});
