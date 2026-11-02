// Weak spots that are about a choice are trained on the choice (F11, L5): a miss on the point that sets por against
// para, or the preterite against the imperfect, goes to the contrast's own items when the learner has the contrast, and not
// to a form drill or to a sentence that gaps any verb ("el bus ___ por la puerta cuatro (salir)").
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { GraphNode } from '../../src/content/schema';
import { Rating, type ReviewEvent } from '../../src/learner';
import { weakSpots } from '../../src/learner/weak';

const GRAPH = join(__dirname, '../../content/graph');
const nodes = new Map<string, GraphNode>(readdirSync(GRAPH).filter((f) => f.endsWith('.json') && !f.startsWith('_')).flatMap((f) => (JSON.parse(readFileSync(join(GRAPH, f), 'utf8')) as GraphNode[]).map((n) => [n.id, n] as const)));
const look = (id: string) => nodes.get(id);
const NOW = Date.UTC(2026, 9, 29);
const DAY = 86_400_000;
const ev = (node: string, op: string, miss: boolean, ageDays = 1): ReviewEvent => ({
  at: NOW - ageDays * DAY, node, dir: 'productive', grade: miss ? Rating.Again : Rating.Good, op, tries: miss ? 2 : 1, novel: false, session: 1, scored: 'exposure',
});
const run = (n: number, f: (i: number) => ReviewEvent) => Array.from({ length: n }, (_, i) => f(i));
const has = (...ids: string[]) => (id: string) => ids.includes(id);

describe('a weak spot on a point that sets two things against each other', () => {
  it('the audit\'s case: misses on por and para are trained on por or para, not on whichever verb a sentence holds', () => {
    const events = run(6, (i) => ev('g:por-para-1', 'type', i < 5));
    const old = weakSpots(events, look, { now: NOW });
    expect(old[0].spec).toMatchObject({ kind: 'nodes', nodes: ['g:por-para-1'] });
    const spots = weakSpots(events, look, { now: NOW, introduced: has('x:por-para') });
    expect(spots).toHaveLength(1);
    expect(spots[0]).toMatchObject({ kind: 'node', key: 'g:por-para-1', misses: 5, attempts: 6, nodes: ['x:por-para'] });
    expect(spots[0].spec).toMatchObject({ kind: 'nodes', nodes: ['x:por-para'], title: 'por or para?: a workout' });
  });

  it('is sent to a contrast only when the learner has it: otherwise the spot is as it was', () => {
    const events = run(6, (i) => ev('g:por-para-1', 'type', i < 5));
    expect(weakSpots(events, look, { now: NOW, introduced: has() })[0].spec).toMatchObject({ nodes: ['g:por-para-1'] });
    expect(weakSpots(events, look, { now: NOW })[0].spec).toMatchObject({ nodes: ['g:por-para-1'] });
  });

  it('a miss on a contrast is a spot on the contrast, trained on its items', () => {
    const events = run(5, (i) => ev('x:ser-estar-adj', i % 2 ? 'warmup' : 'train', i < 4));
    const spots = weakSpots(events, look, { now: NOW, introduced: has('x:ser-estar-adj') });
    expect(spots).toHaveLength(1);
    expect(spots[0].spec).toMatchObject({ kind: 'nodes', nodes: ['x:ser-estar-adj'] });
  });

  it('misses on the point that sets two tenses against each other are not misses of a form: the tense spot trains the contrast', () => {
    // the preterite and the imperfect are both past: a learner who knows every form and cannot choose between them is sent to a form drill today
    const choice = run(6, (i) => ev('g:pret-vs-imperfect', 'type', i < 5));
    const spots = weakSpots(choice, look, { now: NOW, introduced: has('x:pret-imp'), metVerbs: ['hablar'] });
    const tense = spots.find((s) => s.kind === 'tense')!;
    expect(tense).toBeDefined();
    expect(tense.spec).toMatchObject({ kind: 'nodes', nodes: ['x:pret-imp'] });
    // and without the contrast it is the drill it was
    const drill = weakSpots(choice, look, { now: NOW, metVerbs: ['hablar'] }).find((s) => s.kind === 'tense')!;
    expect(drill.spec.kind).toBe('conjugate');
  });

  it('a tense missed in its forms is still a form drill, even when the learner has the contrast', () => {
    const forms = run(6, (i) => ev('g:preterite-ar', 'type', i < 5));
    const spots = weakSpots(forms, look, { now: NOW, introduced: has('x:pret-imp', 'x:perfecto-preterito'), metVerbs: ['hablar', 'comer'] });
    expect(spots[0].kind).toBe('tense');
    expect(spots[0].spec).toMatchObject({ kind: 'conjugate', tenses: ['preterito'] });
  });

  it('free-form misses are still only signal: a miss in a translation does not send anyone to a contrast', () => {
    const free = run(6, () => ev('g:por-para-1', 'translate', true));
    const spots = weakSpots(free, look, { now: NOW, introduced: has('x:por-para') });
    // located by a free-form answer, the grammar point is a spot and its drill goes by form: the contrast's items are forms
    expect(spots.every((s) => s.spec.kind !== 'translate')).toBe(true);
  });

  it('claims are neither misses nor attempts here either', () => {
    const claimed = run(6, () => ({ ...ev('g:por-para-1', 'type', true), claimed: true as const }));
    expect(weakSpots(claimed, look, { now: NOW, introduced: has('x:por-para') })).toEqual([]);
  });
});
