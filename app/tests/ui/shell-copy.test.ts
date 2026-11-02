// What the shell says about the course (audit L9, R24): stages, not CEFR letters, the end of a
// week marked with where its goal stands, a real ending, and a story line that is true for
// the learner it is shown to.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { ContentLoader } from '../../src/ui/data/loader';
import { COURSE_END, finishedWeekLine, storyBeforeTheFirstChapter } from '../../src/ui/screens/home';
import { stageLabel } from '../../src/ui/screens/progress';
import type { CanDoMark, CheckpointResult } from '../../src/ui/store/ui';

const SCREENS = join(__dirname, '../../src/ui/screens');
const src = (f: string) => readFileSync(join(SCREENS, f), 'utf8');
/** The code without its comments, which may name the CEFR scale to say why it is not shown. */
const code = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '');

describe('stages, not CEFR letters', () => {
  let units: Array<{ band?: string }>;
  beforeAll(async () => { units = (await new ContentLoader().core()).units; }, 120_000);

  it('names the five stages of the course by number', () => {
    const labels = ['A1', 'A2', 'B1', 'B2', 'C1'].map((b) => stageLabel(units, b));
    expect(labels).toEqual(['Stage 1 of 5', 'Stage 2 of 5', 'Stage 3 of 5', 'Stage 4 of 5', 'Stage 5 of 5']);
  });
  it('says nothing for a band the course does not have', () => {
    expect(stageLabel(units, 'C2')).toBeUndefined();
    expect(stageLabel([], 'A1')).toBeUndefined();
    expect(stageLabel([{}, {}], 'A1')).toBeUndefined();
  });
  it('no screen the learner sees names a CEFR level', () => {
    const files = ['home.tsx', 'progress.tsx', 'story.tsx', ...readdirSync(join(SCREENS, 'reference')).filter((f) => /\.tsx?$/.test(f)).map((f) => join('reference', f))];
    for (const f of files) expect(code(src(f)), f).not.toMatch(/\b(?:CEFR|[ABC][12])\b/);
    // and Progress shows the stage, not the band the course data carries
    expect(code(src('progress.tsx'))).not.toMatch(/\{band\}/);
  });
});

describe('the end of a unit', () => {
  const units = [1, 2, 3, 4].map((n) => ({ id: `u0${n}`, title: `Unit ${n} — a title`, canDo: `I can do ${n}.` }));
  const mark = (unit: string, feel: CanDoMark['feel']): CanDoMark => ({ unit, canDo: '', feel, at: 1 });
  const check = (byUnit: CheckpointResult['byUnit']): CheckpointResult => ({ at: 2, byUnit });
  const line = (unit: number, day: number, placedAt = 0, marks: CanDoMark[] = [], cps: CheckpointResult[] = []) =>
    finishedWeekLine(units, { unit, day }, placedAt, marks, cps);

  it('says nothing in the first unit, or part way through a unit', () => {
    expect(line(0, 0)).toBeUndefined();
    expect(line(2, 3)).toBeUndefined();
  });
  it('names the unit just finished, and says it is not checked when nothing shows it', () => {
    expect(line(2, 0)).toBe('You finished "Unit 2, a title". Not checked yet: a check on Progress shows where you are.');
  });
  it('says what the learner said or what a check showed, and never more', () => {
    expect(line(2, 0, 0, [mark('u02', 'yes')])).toBe('You finished "Unit 2, a title". You said you can do it.');
    expect(line(2, 0, 0, [], [check({ u02: { right: 4, total: 5 } })])).toBe('You finished "Unit 2, a title". A check went well.');
    expect(line(2, 0, 0, [mark('u02', 'notyet')])).toBe('You finished "Unit 2, a title". You\'re still working on it.');
    expect(line(2, 0, 0, [], [check({ u02: { right: 1, total: 5 } })])).toMatch(/still working on it/);
  });
  it('says nothing of a unit that placement jumped over', () => {
    expect(line(3, 0, 3)).toBeUndefined();
    expect(line(4, 0, 3)).toMatch(/^You finished "Unit 4/);
  });
});

describe('the ending', () => {
  it('is not the old promise, and claims nothing about the learner', () => {
    const text = Object.values(COURSE_END).join(' ');
    expect(text).not.toMatch(/fresh|you can now|master|fluent|ready/i);
    expect(text).not.toMatch(/[—–]| - /);
    const home = code(src('home.tsx'));
    expect(home).not.toContain('Reviews keep it all fresh');
    expect(home).not.toContain("You've finished the course");
  });
  it('tells the learner what happens next, and offers a check', () => {
    expect(COURSE_END.body).toMatch(/no more new lessons/);
    expect(COURSE_END.body).toMatch(/what's due/);
    expect(code(src('home.tsx'))).toMatch(/data-end-check/);
  });
});

describe('the story line before a first chapter', () => {
  it('a learner who started at the beginning is told where the story starts', () => {
    const t = storyBeforeTheFirstChapter({ unit: 0 }, 0);
    expect(t).toMatch(/Bogotá/);
    expect(t).not.toMatch(/landed/);
  });
  it('a placed learner is told nothing the app cannot show', () => {
    expect(storyBeforeTheFirstChapter({ unit: 12 }, 12)).toBeUndefined();
    expect(storyBeforeTheFirstChapter({ unit: 0 }, 5)).toBeUndefined();
    expect(code(src('home.tsx'))).not.toContain('has just landed');
  });
});

describe('a unit is not called a week', () => {
  it('no screen string says week for a unit of lessons', () => {
    for (const f of ['home.tsx', 'progress.tsx', 'practice.tsx', 'onboarding.tsx', join('reference', 'index.tsx'), join('..', 'blocks', 'writing.tsx')]) {
      const t = code(src(f));
      expect(t, f).not.toMatch(/\b(?:Week \{|From week|first week|this week's goal|week \$\{|your starting week|Progress through this week|lessons this week|The weeks before)/);
    }
  });
});
