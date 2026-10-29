// Adversarial unit maps: random day-type sequences (adjacent introduce days,
// drills far away or missing), several grammar points per day, over-cap
// chunk/lexeme lists, contrasts whose sides are not known yet. The compiler
// must still keep every rule.
import { describe, expect, test } from 'vitest';
import type { GraphNode, LessonType, NodeId, Unit } from '../../src/content/schema';
import { buildContentIndex, buildCourse, makeRng } from '../../src/compiler';
import { PROFILES } from '../../tools/sim/profiles';
import { syntheticCorpus } from '../../tools/sim/synthetic';
import { ALL_CHECKS, checkSpacing, SEEDS, walk } from './helpers';

const TYPES: LessonType[] = ['introduce', 'introduce', 'introduce', 'drill', 'input', 'patterns', 'output', 'review', 'checkpoint'];

export function randomCourse(seed: number, nUnits = 5): { units: Unit[]; nodes: GraphNode[] } {
  const r = makeRng(seed);
  const nodes: GraphNode[] = [];
  const units: Unit[] = [];
  let n = 0;
  const grammar: NodeId[] = [];
  const mk = (kind: GraphNode['kind'], extra: Partial<GraphNode> = {}) => {
    const prefix = { grammar: 'g', pattern: 'p', chunk: 'c', lexeme: 'l', contrast: 'x', cando: 'd' }[kind];
    const id = `${prefix}:r${++n}`;
    nodes.push({ id, kind, band: 'A1', priority: n, title: id, requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], ...extra } as GraphNode);
    return id;
  };
  for (let u = 0; u < nUnits; u++) {
    const days: Unit['days'] = [];
    const len = r.int(7, 10);
    for (let d = 0; d < len; d++) {
      const type = TYPES[r.int(0, TYPES.length - 1)];
      const focus: NodeId[] = [];
      if (type === 'introduce') {
        const k = r.int(1, 2); // sometimes two grammar points on one day: the cap must hold
        for (let i = 0; i < k; i++) { const g = mk('grammar'); focus.push(g); }
        if (grammar.length >= 2 && r.next() < 0.4) {
          // a contrast whose second side may not be known yet
          focus.push(mk('contrast', { contrasts: [grammar[r.int(0, grammar.length - 1)], r.next() < 0.5 ? focus[0] : grammar[grammar.length - 1]] }));
        }
      }
      if (type === 'drill' && grammar.length) focus.push(grammar[r.int(0, grammar.length - 1)]);
      if (type === 'patterns') for (let i = 0; i < r.int(1, 5); i++) focus.push(mk('pattern', { requires: grammar.slice(-1) }));
      const lex = type === 'input' ? r.int(5, 22) : ['introduce', 'drill', 'patterns'].includes(type) ? r.int(0, 8) : r.int(0, 2);
      const chunks = r.int(0, 8);
      days.push({
        type, focus,
        lexemes: Array.from({ length: lex }, () => mk('lexeme')),
        chunks: Array.from({ length: chunks }, () => mk('chunk')),
      });
      grammar.push(...focus.filter((f) => f.startsWith('g:')));
    }
    units.push({
      id: `u${String(u + 1).padStart(2, '0')}`, band: 'A1', title: `U${u}`, theme: 't', canDo: 'I can', days, storyArc: 'a',
    });
  }
  return { units, nodes };
}

describe('random unit maps', () => {
  test('every rule holds on adversarial courses, for every profile', () => {
    let plans = 0, spacingForced = 0, owedGrammar = 0;
    for (const seed of SEEDS) {
      const base = randomCourse(seed);
      const c = syntheticCorpus({ seed, units: base.units, nodes: base.nodes });
      const course = buildCourse(c.units, c.nodes);
      const content = buildContentIndex(c.source, course);
      for (const profile of [PROFILES.irregular, PROFILES.fast, PROFILES.forgetful]) {
        const { plans: ps } = walk({ seed, profile, days: 50, corpus: { course, content }, check: (s) => { for (const ch of ALL_CHECKS) ch(s); } });
        checkSpacing(ps);
        plans += ps.length;
        spacingForced += ps.filter((p) => p.plan.converted?.reason === 'spacing').length;
        owedGrammar += ps.filter((p) => p.plan.pathAfter.owedGrammar.length > 0).length;
      }
    }
    expect(plans).toBeGreaterThan(400);
    expect(spacingForced).toBeGreaterThan(0);  // adjacent introduce days were actually defused
    expect(owedGrammar).toBeGreaterThan(0);    // two-grammar days were actually split
  }, 30_000); // 24 checked walks: slow under a parallel full-suite run
});
