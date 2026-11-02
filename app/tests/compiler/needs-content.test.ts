// Content the build has and this device could not get is not content nobody wrote (audit P5, F17).
// A day that needs it is not taught as if it were missing and then marked done: it is a review day
// that does not move the path, and it says why. An authoring gap (nothing was ever written) keeps
// its old behaviour.
import { describe, expect, test } from 'vitest';
import {
  advancePath, buildContentIndex, buildCourse, compileSession, initialPath, kindOf,
  type SessionPlan,
} from '../../src/compiler';
import { lackKey } from '../../src/content/kinds';
import { libraryOf } from '../../src/content/library';
import { Learner } from '../../src/learner';
import { syntheticCorpus } from '../../tools/sim/synthetic';

const T0 = new Date(2026, 0, 5, 19).getTime();
const DAY = 86_400_000;

const synth = syntheticCorpus({ maxUnits: 6, seed: 1 });
const course = buildCourse(synth.units, synth.nodes);
const library = libraryOf(synth.source.chapters).chapters;

/** The index with some files lacking: they are not in hand, as a failed download leaves them. */
function index(opts: { lacking?: string[]; without?: { chapters?: string[]; scripts?: string[]; sentencesOf?: string[] } } = {}) {
  const src = {
    ...synth.source,
    chapters: synth.source.chapters.filter((c) => !opts.without?.chapters?.includes(c.id)),
    scripts: synth.source.scripts.filter((s) => !opts.without?.scripts?.includes(s.node)),
    sentences: synth.source.sentences.filter((s) => !opts.without?.sentencesOf?.includes(s.unit ?? '')),
    library, lacking: opts.lacking,
  };
  return buildContentIndex(src, course);
}

/** A learner who has been through everything before `day` of unit index `at`, reading the chapters on the way except those `unread` names. */
function learnerAt(at: number, day: number, unread: string[] = []) {
  const L = Learner.fresh({ now: () => T0 });
  for (let u = 0; u <= at; u++) {
    for (const [i, d] of course.units[u].days.entries()) {
      if (u === at && i >= day) break;
      for (const n of [...d.focus, ...d.chunks, ...d.lexemes]) if (!L.isIntroduced(n)) L.introduce(n, { results: [true, true, true], at: T0 });
      if (d.chapter && !unread.includes(d.chapter)) L.ledger.markSeen('chapter', d.chapter, { at: T0 });
    }
  }
  return L;
}

const AT = 1;
const dayOfType = (type: string) => course.units[AT].days.findIndex((d) => d.type === type);
const compile = (day: number, content: ReturnType<typeof index>, unread: string[] = []): SessionPlan =>
  compileSession({
    learnerId: 'learner-a', learner: learnerAt(AT, day, unread), path: { ...initialPath(), unit: AT, day, coreSessions: 20 }, course, content, now: T0 + DAY,
  });

const introduceDay = dayOfType('introduce');
const inputDay = dayOfType('input');
const unitId = course.units[AT].id;

describe('a day whose content is lacking on this device', () => {
  test('is the day it would have been when nothing is lacking', () => {
    const plan = compile(introduceDay, index());
    expect(plan.type).toBe('introduce');
    expect(plan.advancesPath).toBe(true);
    expect(plan.converted).toBeUndefined();
  });

  test('its unit\'s sentences lacking: reviews only, the path stays, and the plan says why', () => {
    const plan = compile(introduceDay, index({ lacking: [lackKey('bank', unitId)] }));
    expect(plan.type).toBe('review');
    expect(plan.advancesPath).toBe(false);
    expect(plan.converted).toMatchObject({ from: 'introduce', to: 'review', reason: 'offline' });
    expect(plan.diagnostics.some((d) => d.code === 'offline')).toBe(true);
    expect(Object.values(plan.newNodes).flat()).toEqual([]);
    expect(plan.blocks.some((b) => b.kind === 'teach' || b.kind === 'read')).toBe(false);
    // the learner is where they were, and the day is still ahead of them
    const after = advancePath(initialPath(), plan, true);
    expect(after.day).toBe(0);
    expect(plan.pathAfter).toMatchObject({ unit: AT, day: introduceDay });
  });

  test('the script of what the day teaches lacking: not taught without a script, not marked done', () => {
    const g = course.units[AT].days[introduceDay].focus.find((n) => kindOf(n, course.nodes) === 'grammar')!;
    const plan = compile(introduceDay, index({ lacking: [lackKey('scripts', g)], without: { scripts: [g] } }));
    expect(plan.converted?.reason).toBe('offline');
    expect(plan.advancesPath).toBe(false);
    expect(plan.blocks.some((b) => b.kind === 'teach')).toBe(false);
  });

  test('the day\'s own chapter lacking: the story is not skipped to a shortage, and the day waits', () => {
    const ch = course.units[AT].days[inputDay].chapter!;
    const plan = compile(inputDay, index({ lacking: [lackKey('story', ch)], without: { chapters: [ch] } }));
    expect(plan.converted).toMatchObject({ from: 'input', reason: 'offline' });
    expect(plan.advancesPath).toBe(false);
    expect(plan.diagnostics.some((d) => d.code === 'shortage' && d.what === 'chapter')).toBe(false);
  });

  test('an earlier chapter the learner owes, lacking, holds the day\'s chapter behind it', () => {
    // the story is read in order: a chapter before the day's own that is not here is not read past
    const owed = library[0].id;
    const ch = course.units[AT].days[inputDay].chapter!;
    expect(owed).not.toBe(ch);
    const plan = compile(inputDay, index({ lacking: [lackKey('story', owed)], without: { chapters: [owed] } }), [owed]);
    expect(plan.converted?.reason).toBe('offline');
    expect(plan.advancesPath).toBe(false);
  });

  test('a scene and a writing task lacking on an output day', () => {
    const out = dayOfType('output');
    for (const dir of ['scenes', 'writing'] as const) {
      const plan = compile(out, index({ lacking: [lackKey(dir, unitId)] }));
      expect(plan.converted, dir).toMatchObject({ from: 'output', reason: 'offline' });
      expect(plan.advancesPath, dir).toBe(false);
    }
  });

  test('a drill day wants its unit\'s sentences too', () => {
    const plan = compile(dayOfType('drill'), index({ lacking: [lackKey('bank', unitId)] }));
    expect(plan.advancesPath).toBe(false);
    expect(plan.converted?.reason).toBe('offline');
  });

  test('what another day or another unit needs does not hold this one', () => {
    const other = course.units[AT + 1].id;
    const ch = course.units[AT].days[inputDay].chapter!;
    const here = compile(introduceDay, index({ lacking: [lackKey('bank', other), lackKey('story', ch), lackKey('scenes', unitId)] }));
    expect(here.type).toBe('introduce');
    expect(here.advancesPath).toBe(true);
  });

  test('a review day needs nothing of its unit, so it goes on and the path moves', () => {
    const plan = compile(dayOfType('review'), index({ lacking: [lackKey('bank', unitId), lackKey('scenes', unitId), lackKey('writing', unitId)] }));
    expect(plan.converted?.reason).not.toBe('offline');
    expect(plan.diagnostics.some((d) => d.code === 'offline')).toBe(false);
    expect(plan.advancesPath).toBe(true);
  });

  test('is served again, as itself, once the files are in hand', () => {
    const away = compile(introduceDay, index({ lacking: [lackKey('bank', unitId)] }));
    const back = compile(introduceDay, index());
    expect(away.type).toBe('review');
    expect(back.type).toBe('introduce');
    expect(back.advancesPath).toBe(true);
  });
});

describe('a gap in the authoring is not a download that failed', () => {
  test('a script nobody wrote is still taught from the examples, and the day goes on', () => {
    const g = course.units[AT].days[introduceDay].focus.find((n) => kindOf(n, course.nodes) === 'grammar')!;
    const plan = compile(introduceDay, index({ without: { scripts: [g] } }));
    expect(plan.type).toBe('introduce');
    expect(plan.advancesPath).toBe(true);
    expect(plan.diagnostics.some((d) => d.code === 'shortage' && d.what === 'script')).toBe(true);
  });

  test('a chapter nobody wrote converts the reading slot to review, as before', () => {
    const ch = course.units[AT].days[inputDay].chapter!;
    const plan = compile(inputDay, index({ without: { chapters: [ch] } }));
    expect(plan.converted).toMatchObject({ from: 'input', reason: 'shortage' });
    expect(plan.advancesPath).toBe(true);
  });
});
