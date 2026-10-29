import { describe, expect, it } from 'vitest';
import type { GraphNode } from '../../src/content/schema';
import { Rating, type ReviewEvent } from '../../src/learner';
import { weakSpots } from '../../src/learner/weak';
import { taughtTenses, tensesOfNode } from '../../src/ui/session/tenses';

const NOW = Date.UTC(2026, 9, 29);
const DAY = 86_400_000;
const NODES: Record<string, Partial<GraphNode>> = {
  'g:preterite-ar': { id: 'g:preterite-ar', kind: 'grammar', title: 'Preterite -ar' },
  'p:ir-a': { id: 'p:ir-a', kind: 'pattern', title: 'Going to' },
  'l:casa': { id: 'l:casa', kind: 'lexeme', title: 'house', freqRank: 300 },
};
const look = (id: string) => NODES[id] as GraphNode | undefined;
const ev = (node: string, op: string, miss: boolean, ageDays = 1): ReviewEvent => ({
  at: NOW - ageDays * DAY, node, dir: 'productive', grade: miss ? Rating.Again : Rating.Good, op,
  tries: miss ? 2 : 1, novel: false, session: 1, scored: 'exposure',
});
const run = (n: number, f: (i: number) => ReviewEvent) => Array.from({ length: n }, (_, i) => f(i));

describe('weakSpots', () => {
  it('turns free-form misses on a tense node into a conjugation spot, never a translate spec', () => {
    const spots = weakSpots(run(5, () => ev('g:preterite-ar', 'translate', true)), look, { now: NOW, metVerbs: ['hablar', 'comer'] });
    expect(spots).toHaveLength(1);
    expect(spots[0].kind).toBe('tense');
    expect(spots[0].label).toBe('Preterite');
    expect(spots[0].spec).toMatchObject({ kind: 'conjugate', tenses: ['preterito'], verbs: ['hablar', 'comer'] });
    expect(spots.every((s) => s.spec.kind !== 'translate')).toBe(true);
  });
  it('ignores free-form misses on lexemes', () => {
    expect(weakSpots(run(5, () => ev('l:casa', 'translate', true)), look, { now: NOW })).toEqual([]);
  });
  it('flags a pattern missed 4 of 6 times in typing', () => {
    const events = run(6, (i) => ev('p:ir-a', 'type', i < 4));
    const spots = weakSpots(events, look, { now: NOW });
    expect(spots).toHaveLength(1);
    expect(spots[0]).toMatchObject({ kind: 'node', key: 'p:ir-a', misses: 4, attempts: 6 });
    expect(spots[0].spec).toMatchObject({ kind: 'nodes', nodes: ['p:ir-a'] });
  });
  it('needs the minimum number of attempts', () => {
    expect(weakSpots(run(2, () => ev('p:ir-a', 'type', true)), look, { now: NOW })).toEqual([]);
  });
  it('leaves out events outside the window', () => {
    expect(weakSpots(run(6, () => ev('p:ir-a', 'type', true, 30)), look, { now: NOW })).toEqual([]);
  });
});

describe('shared tense module', () => {
  it('maps real grammar ids to tenses', () => {
    expect(tensesOfNode({ id: 'g:preterite-ar' })).toEqual(['preterito']);
    expect(tensesOfNode({ id: 'g:imperfect-habitual' })).toEqual(['imperfecto']);
    expect(tensesOfNode({ id: 'g:conditional' })).toEqual(['condicional']);
    expect(tensesOfNode({ id: 'g:subj-wanting' })).toEqual(['presubj']);
    expect(tensesOfNode({ id: 'g:pluperfect-subj' })).toEqual(['pluscsubj']);
    expect(taughtTenses(['g:present-ar', 'g:future-promises'])).toEqual(['presente', 'futuro']);
  });
});
