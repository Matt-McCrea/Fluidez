// The story is not held back for words the unit has scheduled and the learner is owed (L7, R26), and a day called a story day
// contains story (F13): the words are glossed, the grammar and the words nobody has scheduled still gate.
import { describe, expect, test } from 'vitest';
import type { GraphNode, Unit } from '../../src/content/schema';
import { buildContentIndex, buildCourse, compileSession, initialPath, type SessionPlan } from '../../src/compiler';
import { Learner } from '../../src/learner';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { sessionLabel } from '../../src/ui/session/labels';
import type { Bundle } from '../../src/ui/data/bundle';
import { realCourse } from './helpers';

const T0 = new Date(2026, 0, 5, 19).getTime();

const node = (id: string, kind: GraphNode['kind'], extra: Partial<GraphNode> = {}): GraphNode =>
  ({ id, kind, band: 'A1', priority: 0, title: id, requires: [], contrasts: [], serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral', ...extra }) as GraphNode;

/** A unit whose first day is the day the learner is on, listing `listed` and a chapter or a scene that needs `requires`. */
function world(type: 'input' | 'output', nodes: GraphNode[], listed: string[], requires: string[], owedNew: string[] = []) {
  const day = { type, focus: [] as string[], chunks: listed.filter((n) => n.startsWith('c:')), lexemes: listed.filter((n) => n.startsWith('l:')), ...(type === 'input' ? { chapter: 'ch001' } : { scene: 'sc-u01-a' }) };
  const units: Unit[] = [{ id: 'u01', band: 'A1', title: 'u', theme: 't', canDo: 'c', storyArc: 'a', days: [day, ...Array.from({ length: 6 }, () => ({ type: 'review' as const, focus: [], chunks: [], lexemes: [] }))] }];
  const course = buildCourse(units, nodes);
  const chapter = { id: 'ch001', unit: 'u01', title: 't', text: 'uno dos tres', gloss: [], hook: 'h', requires, lexemes: [], questions: [1, 2, 3].map((n) => ({ q: `q${n}`, options: ['a', 'b'], answer: 0 })) } as never;
  const scene = { id: 'sc-u01-a', unit: 'u01', title: 's', setting: 's', turns: [1, 2, 3].map((n) => ({ npc: `hola ${n}`, npcEn: `hello ${n}`, goal: 'g', check: 'x' })), requires } as never;
  const content = buildContentIndex({ sentences: [], chapters: type === 'input' ? [chapter] : [], scenes: type === 'output' ? [scene] : [], writing: [], scripts: [] }, course);
  const L = Learner.fresh({ now: () => T0 });
  // a learner past the first-week ramp, so a day takes all its items
  for (let i = 0; i < 3; i++) L.startSession(T0);
  const plan = () => compileSession({ learnerId: 'x', learner: L, path: { ...initialPath(), coreSessions: 3, owedNew }, course, content, now: T0 });
  return { L, plan };
}
const has = (p: SessionPlan, kind: string) => p.blocks.some((b) => b.kind === kind);

describe('words the learner is owed do not hold the story back', () => {
  const owed = [node('l:a', 'lexeme'), node('l:b', 'lexeme'), node('c:hola', 'chunk')];

  test('a chapter that needs words the day teaches is read', () => {
    const { plan } = world('input', owed, ['l:a', 'l:b', 'c:hola'], ['l:a', 'l:b', 'c:hola']);
    expect(has(plan(), 'read')).toBe(true);
  });

  test('so is a chapter that needs words the day cannot teach today, the unit having scheduled them', () => {
    const many = Array.from({ length: 30 }, (_, i) => node(`l:w${i}`, 'lexeme'));
    const { plan } = world('input', many, many.map((n) => n.id), many.map((n) => n.id));
    const p = plan();
    // 16 words a day at most: the others are owed, and the chapter needs every one
    expect(p.newNodes.lexemes.length).toBeLessThan(30);
    expect(has(p, 'read')).toBe(true);
    expect(p.diagnostics.some((d) => d.block === 'read' && /owed/.test(d.message))).toBe(true);
  });

  test('a scene is played on words the unit has scheduled and the learner is owed, however many', () => {
    const many = Array.from({ length: 30 }, (_, i) => node(`l:w${i}`, 'lexeme'));
    const ids = many.map((n) => n.id);
    const { plan } = world('output', many, ids, ids, ids);
    const p = plan();
    expect(has(p, 'scene')).toBe(true);
    expect(p.diagnostics.some((d) => d.block === 'scene' && /owed/.test(d.message))).toBe(true);
  });

  test('a scene that needs a grammar point nobody has taught is not played', () => {
    const nodes = [node('g:x', 'grammar'), node('l:a', 'lexeme')];
    expect(has(world('output', nodes, ['l:a'], ['l:a', 'g:x'], ['l:a']).plan(), 'scene')).toBe(false);
  });

  test('a grammar point nobody has taught still holds a chapter back, and so does a word the unit has not reached', () => {
    const nodes = [node('g:x', 'grammar'), node('l:later', 'lexeme', { priority: 99 }), node('l:a', 'lexeme')];
    expect(has(world('input', nodes, ['l:a'], ['l:a', 'g:x']).plan(), 'read')).toBe(false);
    const { plan } = world('input', nodes, ['l:a'], ['l:a', 'l:later']);
    expect(has(plan(), 'read')).toBe(false);
  });
});

describe('the real course', () => {
  const real = realCourse(3);
  const plans: SessionPlan[] = [];
  const hit = (unit: string, day: number) => plans.find((p) => p.unit === unit && p.day === day && p.tier !== 'minimum');

  test('u01 d4 is a story day with a story, and u02 d8 an output day with its scene, for the learner who left a dozen words owed', () => {
    simulateProfile(PROFILES.average, { days: 80, tier: 'standard', course: real.course, content: real.content, seed: 1, onPlan: (p) => plans.push(p) });
    const input = hit('u01', 4);
    expect(input?.dayType).toBe('input');
    expect(input && has(input, 'read'), 'u01 d4 reads').toBe(true);
    const output = hit('u02', 8);
    expect(output?.dayType).toBe('output');
    expect(output && has(output, 'scene'), 'u02 d8 plays its scene').toBe(true);
  });

  test('a day that is called a story day and has no story is not called one', () => {
    const b = { title: (id: string) => id, story: [], scenes: new Map() } as unknown as Bundle;
    const bare = { type: 'input', blocks: [{ kind: 'warmup' }, { kind: 'learn' }, { kind: 'close' }], unit: 'u01' } as unknown as SessionPlan;
    expect(sessionLabel(bare, b)).not.toMatch(/story/i);
    const told = { type: 'input', blocks: [{ kind: 'warmup' }, { kind: 'read', chapter: 'ch001' }, { kind: 'close' }], unit: 'u01' } as unknown as SessionPlan;
    expect(sessionLabel(told, { ...b, story: [{ id: 'ch001', title: 'Hola' }] } as unknown as Bundle)).toMatch(/Story time/);
  });
});

describe('L6: the first chapter comes early on day 1', () => {
  const real = realCourse(1);
  const first = (coreSessions: number) => compileSession({
    learnerId: 'x', learner: Learner.fresh({ now: () => T0 }), path: { ...initialPath(), coreSessions }, course: real.course, content: real.content, now: T0,
  });
  const upTo = (p: SessionPlan, kind: string) => {
    let t = 0;
    for (const b of p.blocks) { t += b.minutes; if (b.kind === kind) return t; }
    return Infinity;
  };

  test('after the new phrases and before the lesson, so it is read by about minute 8', () => {
    const p = first(0);
    expect(p.dayType).toBe('introduce');
    const kinds = p.blocks.map((b) => b.kind);
    expect(kinds.indexOf('read')).toBeGreaterThan(kinds.indexOf('learn'));
    expect(kinds.indexOf('read')).toBeLessThan(kinds.indexOf('teach'));
    expect(upTo(p, 'read')).toBeLessThanOrEqual(9);
  });

  test('nothing is taken out for it: the same blocks as the same day later on, in another order', () => {
    const p = first(0);
    const later = first(3);
    // (past the first-week ramp the day takes more new words; its blocks are the same and the lesson comes before the chapter, as it always did)
    const kinds = (x: SessionPlan) => x.blocks.map((b) => b.kind).sort();
    expect(kinds(p)).toEqual(kinds(later));
    for (const k of ['teach', 'read', 'personal']) {
      expect(p.blocks.find((b) => b.kind === k)?.minutes, k).toBe(later.blocks.find((b) => b.kind === k)?.minutes);
    }
    const order = later.blocks.map((b) => b.kind);
    expect(order.indexOf('teach')).toBeLessThan(order.indexOf('read'));
  });
});
