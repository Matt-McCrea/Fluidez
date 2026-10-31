// One admissibility rule for requires: known, a phantom lexeme (not a graph node), or covered by a known
// chunk that unpacks it. The output day repays the owed items its scene needs.
import { describe, expect, test } from 'vitest';
import type { GraphNode, Scene, Unit } from '../../src/content/schema';
import { admissible, buildContentIndex, buildCourse, compileSession, initialPath, unmetRequires } from '../../src/compiler';
import { Learner } from '../../src/learner';

const T0 = new Date(2026, 0, 5, 19).getTime();
const node = (id: string, kind: GraphNode['kind'], extra: Partial<GraphNode> = {}): GraphNode =>
  ({ id, kind, band: 'A1', priority: 0, title: id, requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral', ...extra } as GraphNode);

describe('admissible()', () => {
  const nodes = new Map<string, { unpacks?: string }>([['l:a', {}], ['c:x', { unpacks: 'g:late' }], ['g:late', {}], ['g:other', {}]]);
  const known = new Set(['l:a', 'c:x']);
  const has = (id: string) => known.has(id);
  test('a phantom lexeme (not a graph node) does not block; a real unknown node does', () => {
    expect(admissible(['l:a', 'l:buena', 'l:hace'], has, nodes)).toBe(true);
    expect(admissible(['l:a', 'g:other'], has, nodes)).toBe(false);
    expect(unmetRequires(['l:buena', 'g:other'], has, nodes)).toEqual(['g:other']);
  });
  test('a known chunk covers the grammar it unpacks, only if the chunk is in the same requires', () => {
    expect(admissible(['c:x', 'g:late'], has, nodes)).toBe(true);
    expect(admissible(['g:late'], has, nodes)).toBe(false);
  });
});

describe('compiler: phantoms and output-day repayment', () => {
  const scene = (requires: string[]) => ({
    id: 'sc-u01-a', unit: 'u01', title: 'T', brief: 'b', spare: false, requires,
    turns: [1, 2, 3].map((n) => ({ id: `t${n}`, npc: 'Hola.', npcEn: 'Hi.', intent: 'Greet.', accept: ['Hola.'], require: [], next: n < 3 ? `t${n + 1}` : null })),
  }) as unknown as Scene;
  const chunks = ['c:a1', 'c:a2', 'c:a3', 'c:a4', 'c:a5'];
  function world(requires: string[], owed: string[]) {
    const units: Unit[] = [{
      id: 'u01', band: 'A1', title: 'u', theme: 't', canDo: 'c', storyArc: 'a',
      days: [
        { type: 'introduce', focus: [], chunks, lexemes: ['l:a'] },
        ...Array.from({ length: 5 }, () => ({ type: 'review' as const, focus: [], chunks: [], lexemes: [] })),
        { type: 'output', focus: [], chunks: [], lexemes: [], scene: 'sc-u01-a' },
      ],
    }];
    const course = buildCourse(units, [node('l:a', 'lexeme'), ...chunks.map((c) => node(c, 'chunk'))]);
    const content = buildContentIndex({ sentences: [], chapters: [], scenes: [scene(requires)], writing: [], scripts: [] }, course);
    const L = Learner.fresh({ now: () => T0 });
    while (L.sessionIndex < 20) L.startSession(T0);
    L.introduce('l:a', { results: [true, true, true], at: T0 });
    const path = { ...initialPath(), day: 6, coreSessions: 20, owedNew: owed };
    return compileSession({ learnerId: 'x', learner: L, path, course, content, now: T0 });
  }
  test('a phantom lexeme in the scene requires does not block it', () => {
    const plan = world(['l:a', 'l:buena', 'l:hace'], []);
    expect(plan.blocks.some((b) => b.kind === 'scene')).toBe(true);
  });
  test('an output-day scene needing 5 owed chunks (cap 3) gets them introduced that day', () => {
    const plan = world(['l:a', ...chunks], chunks);
    expect(plan.newNodes.chunks).toEqual(expect.arrayContaining(chunks));
    expect(plan.blocks.some((b) => b.kind === 'scene')).toBe(true);
    expect(plan.diagnostics.some((d) => d.code === 'repaid')).toBe(true);
  });
  test('a scene needing a grammar node nobody teaches stays out and nothing is repaid', () => {
    const plan = world(['l:a', 'c:a1', 'g:nope'], chunks);
    expect(plan.blocks.some((b) => b.kind === 'scene')).toBe(false);
    expect(plan.diagnostics.some((d) => d.code === 'repaid')).toBe(false);
  });
});
