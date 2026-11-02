// Progress ticks a goal only on evidence (audit C13): the learner said yes, or a
// check went well. A unit the path has passed without either is "Covered, not
// yet checked", a unit placement jumped over is "Skipped at placement", and a
// "Not yet" is never listed under "You can now".
import { describe, expect, it } from 'vitest';
import { canDoGroups } from '../../src/ui/screens/progress';
import type { CanDoMark, CheckpointResult } from '../../src/ui/store/ui';

const units = Array.from({ length: 8 }, (_, i) => ({ id: `u0${i + 1}`, canDo: `Goal ${i + 1}` }));
const mark = (unit: string, feel: CanDoMark['feel'], at = 1): CanDoMark => ({ unit, canDo: `Goal ${unit}`, feel, at });
const check = (at: number, byUnit: CheckpointResult['byUnit']): CheckpointResult => ({ at, byUnit });
const ids = (rows: Array<{ id: string }>) => rows.map((r) => r.id);

describe('what Progress lists as something you can do', () => {
  it('a unit passed with no mark and no check is covered, not checked, and never ticked', () => {
    const g = canDoGroups(units, 3, 0, [], []);
    expect(ids(g.earned)).toEqual([]);
    expect(ids(g.unchecked)).toEqual(['u01', 'u02', 'u03']);
    expect(g.skipped).toEqual([]);
  });
  it('units after the path are not listed at all', () => {
    const g = canDoGroups(units, 2, 0, [], []);
    expect(ids([...g.earned, ...g.getting, ...g.unchecked, ...g.skipped])).toEqual(['u01', 'u02']);
  });
  it('"Not yet" is never ticked, however many units the path has passed', () => {
    const g = canDoGroups(units, 4, 0, [mark('u02', 'notyet'), mark('u03', 'mostly')], []);
    expect(ids(g.earned)).toEqual([]);
    expect(g.getting.map((r) => [r.id, r.state])).toEqual([['u02', 'notyet'], ['u03', 'mostly']]);
    expect(ids(g.unchecked)).toEqual(['u01', 'u04']);
  });
  it('a yes earns the tick, even for the unit the path has not left yet', () => {
    const g = canDoGroups(units, 2, 0, [mark('u03', 'yes')], []);
    expect(g.earned.map((r) => [r.id, r.how])).toEqual([['u03', 'said']]);
  });
  it('a check that went well earns it; one that did not, does not', () => {
    const g = canDoGroups(units, 4, 0, [], [check(5, { u01: { right: 2, total: 2 }, u02: { right: 1, total: 3 }, u03: { right: 0, total: 0 } })]);
    expect(g.earned.map((r) => [r.id, r.how])).toEqual([['u01', 'checked']]);
    expect(g.getting.map((r) => [r.id, r.state])).toEqual([['u02', 'notyet']]);
    expect(ids(g.unchecked)).toEqual(['u03', 'u04']);
  });
  it('the latest word on a goal wins, a mark or a check', () => {
    const early = canDoGroups(units, 2, 0, [mark('u01', 'yes', 1)], [check(2, { u01: { right: 0, total: 2 } })]);
    expect(ids(early.earned)).toEqual([]);
    expect(early.getting.map((r) => r.state)).toEqual(['notyet']);
    const late = canDoGroups(units, 2, 0, [mark('u01', 'notyet', 1)], [check(2, { u01: { right: 2, total: 2 } })]);
    expect(ids(late.earned)).toEqual(['u01']);
    const again = canDoGroups(units, 2, 0, [mark('u01', 'notyet', 1), mark('u01', 'yes', 3)], []);
    expect(ids(again.earned)).toEqual(['u01']);
  });
  it('a learner placed at unit 6 has skipped five goals, not earned them', () => {
    const g = canDoGroups(units, 5, 5, [], []);
    expect(ids(g.skipped)).toEqual(['u01', 'u02', 'u03', 'u04', 'u05']);
    expect(ids(g.earned)).toEqual([]);
    expect(ids(g.unchecked)).toEqual([]);
  });
  it('after placement, the units worked through are covered and the skipped ones stay skipped', () => {
    const g = canDoGroups(units, 7, 5, [mark('u03', 'yes')], []);
    expect(ids(g.earned)).toEqual(['u03']);
    expect(ids(g.skipped)).toEqual(['u01', 'u02', 'u04', 'u05']);
    expect(ids(g.unchecked)).toEqual(['u06', 'u07']);
  });
  it('a mark for a unit the course no longer has is still listed, under what the learner said', () => {
    const g = canDoGroups(units, 1, 0, [mark('u99', 'yes')], []);
    expect(ids(g.earned)).toEqual(['u99']);
  });
});
