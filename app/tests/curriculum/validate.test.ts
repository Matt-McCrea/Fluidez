// The curriculum validator: one tiny in-memory course per rule.
import { z } from 'zod';
import { describe, expect, test } from 'vitest';
import { GraphNode, Unit, UnitDay } from '../../src/content/schema';
import { validateCourse, type Course } from '../../tools/curriculum/validate';

const node = (id: string, kind: GraphNode['kind'], priority: number, requires: string[] = []) =>
  GraphNode.parse({ id, kind, band: 'A1', priority, title: id, requires });
type DayIn = z.input<typeof UnitDay>;
const day = (type: DayIn['type'], d: Partial<DayIn> = {}) => UnitDay.parse({ type, ...d });
const unit = (id: string, days: ReturnType<typeof day>[]) =>
  Unit.parse({ id, band: 'A1', title: id, theme: 't', canDo: 'I can', storyArc: 'arc', days });
const pad = (days: ReturnType<typeof day>[]) => { while (days.length < 7) days.push(day('review')); return days; };

function course(over: Partial<Course> & { days?: ReturnType<typeof day>[] }): Course {
  return {
    nodes: over.nodes ?? [node('g:a', 'grammar', 1), node('p:x', 'pattern', 2), node('c:y', 'chunk', 1), node('l:z', 'lexeme', 1)],
    units: over.units ?? [unit('u01', pad(over.days ?? [day('introduce', { focus: ['g:a'], chunks: ['c:y'], lexemes: ['l:z'] })]))],
    chapters: over.chapters ?? new Set(['ch001']),
    scenes: over.scenes ?? new Set(['sc-u01-a']),
  };
}
const rules = (c: Course, rule: string, severity?: 'error' | 'warning') =>
  validateCourse(c).issues.filter((i) => i.rule === rule && (!severity || i.severity === severity));

describe('curriculum validator', () => {
  test('a clean course has no errors', () => {
    const c = course({ days: [day('introduce', { focus: ['g:a'], chunks: ['c:y'], lexemes: ['l:z'], chapter: 'ch001', scene: 'sc-u01-a' })] });
    expect(validateCourse(c).issues.filter((i) => i.severity === 'error')).toEqual([]);
  });

  test('duplicate ids and missing requires are errors', () => {
    const dup = course({ nodes: [node('g:a', 'grammar', 1), node('g:a', 'grammar', 2)] });
    expect(rules(dup, 'ids', 'error').some((i) => /duplicate/.test(i.message))).toBe(true);
    const missing = course({ nodes: [node('g:a', 'grammar', 1, ['g:ghost'])] });
    expect(rules(missing, 'ids', 'error').some((i) => /g:ghost/.test(i.message))).toBe(true);
  });

  test('day ids that are not in the graph are errors', () => {
    const c = course({ days: [day('introduce', { focus: ['g:nope'], chunks: ['c:nope'], lexemes: ['l:nope'] })] });
    expect(rules(c, 'refs', 'error').map((i) => i.message).join(' ')).toMatch(/g:nope[\s\S]*c:nope[\s\S]*l:nope|focus g:nope/);
    expect(rules(c, 'refs', 'error')).toHaveLength(3);
  });

  test('chapter and scene ids must exist on disk (warning: content is still being written)', () => {
    const c = course({ days: [day('input', { chapter: 'ch999', scene: 'sc-ghost' })] });
    expect(rules(c, 'refs', 'warning').map((i) => i.message).join(' ')).toMatch(/ch999[\s\S]*sc-ghost/);
  });

  test('priority may not be earlier than a requirement', () => {
    const c = course({ nodes: [node('g:a', 'grammar', 5), node('g:b', 'grammar', 3, ['g:a'])], days: [day('introduce', { focus: ['g:a'] })] });
    expect(rules(c, 'priority', 'error')).toHaveLength(1);
  });

  test('per-day caps are warnings with the overflow count', () => {
    const lex = Array.from({ length: 8 }, (_, i) => `l:w${i}`);
    const chunks = Array.from({ length: 7 }, (_, i) => `c:k${i}`);
    const pats = Array.from({ length: 11 }, (_, i) => `p:q${i}`);
    const nodes = [...lex.map((id, i) => node(id, 'lexeme', 1 + i)), ...chunks.map((id) => node(id, 'chunk', 1)), ...pats.map((id) => node(id, 'pattern', 3))];
    const c = course({ nodes, days: [day('introduce', { lexemes: lex, chunks }), day('patterns', { focus: pats })] });
    const msgs = rules(c, 'caps', 'warning').map((i) => i.message);
    expect(msgs.find((m) => /lexemes/.test(m))).toMatch(/cap 6 \(over by 2\)/);
    expect(msgs.find((m) => /chunks/.test(m))).toMatch(/over by 2/);
    expect(msgs.find((m) => /patterns on a patterns day/.test(m))).toMatch(/cap 8 \(over by 3\)/);
    const input = course({ nodes, days: [day('input', { focus: pats.slice(0, 6) })] });
    expect(rules(input, 'caps', 'warning')[0].message).toMatch(/6 patterns on a input day, cap 4 \(over by 2\)/);
    expect(rules(input, 'caps', 'error')).toEqual([]);
  });

  test('a node may not be placed before the first day of what it requires', () => {
    const nodes = [node('p:late', 'pattern', 10), node('c:early', 'chunk', 11, ['p:late'])];
    const bad = course({ nodes, days: [day('introduce', { chunks: ['c:early'] }), day('drill', { focus: ['p:late'] })] });
    expect(rules(bad, 'order', 'error')).toHaveLength(1);
    const same = course({ nodes, days: [day('introduce', { chunks: ['c:early'], focus: ['p:late'] })] });
    expect(rules(same, 'order', 'error')).toEqual([]);
    const after = course({ nodes, days: [day('introduce', { focus: ['p:late'] }), day('drill', { chunks: ['c:early'] })] });
    expect(rules(after, 'order', 'error')).toEqual([]);
  });

  test('priority is compared with the first session that lists the node, and the fix is that session', () => {
    const c = course({
      nodes: [node('g:a', 'grammar', 1), node('g:b', 'grammar', 5)],
      days: [day('introduce', { focus: ['g:a'] }), day('drill', { focus: ['g:a'] }), day('introduce', { focus: ['g:b'] })],
    });
    const r = validateCourse(c);
    expect(r.priorityFixes).toEqual([{ id: 'g:b', from: 5, to: 3 }]);
    expect(r.issues.filter((i) => i.rule === 'first-focus')).toHaveLength(1);
  });

  test('sessions count across units', () => {
    const u1 = unit('u01', pad([day('introduce', { focus: ['g:a'] })]));
    const u2 = unit('u02', pad([day('introduce', { focus: ['g:b'] })]));
    const c = course({ nodes: [node('g:a', 'grammar', 1), node('g:b', 'grammar', 8)], units: [u1, u2] });
    expect(validateCourse(c).priorityFixes).toEqual([]);
  });
});
