// De corrido: a pace counts only when the questions are right and the pace is one a person reads at. The questions a
// chapter carries are not a fair gate on their own (the right option is the longest in nearly all of them from B1), so
// the game asks only those that are fair, and the tests below hold it to that on every real chapter: the gate as the
// chapters carry it is passed by tapping the longest, and the one the game asks is not, nor by any other habit of tapping.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { StoryChapter } from '../../src/content/schema';
import { rng } from '../../src/exercises/rng';
import {
  CHECK_MAX, CHECK_MIN, checkable, COOLDOWN_DAYS, fairQuestions, judge, longestIsRight, MAX_WPM, MIN_AGE_DAYS, pickReading, readingCheck, readingRow,
  rereadCandidates, wordsPerMinute, type Question,
} from '../../src/games/reading';
import { questionCard, type McqCard } from '../../src/ui/session/cards';
import { world } from '../ui/driver';

const DAY = 86_400_000;
const dir = join(__dirname, '../../content/story');
const chapters = readdirSync(dir).filter((f) => /^ch\d+\.json$/.test(f)).map((f) => StoryChapter.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))));

const q = (options: string[], answer: number): Question => ({ q: 'What happened?', options, answer });
const chapterWith = (id: string, questions: Question[], over: Partial<StoryChapter> = {}): StoryChapter => ({
  id, unit: 'u01', title: 'Una mañana', text: 'Tomás abre el café. Vale llega tarde. Simón habla mucho.\n\nHernando pide un tinto.', gloss: [], questions, hook: '',
  rereadQuestions: [], requires: [], lexemes: [], ...over,
});
const LONG = q(['He opened the café early', 'He slept', 'He left', 'Nothing'], 0);
const FAIR = (n: number) => q(['Nothing at all happened', 'Vale arrived', 'Simón spoke very quickly all day', 'Hernando left'], n % 2 === 0 ? 1 : 3);

describe('the gate as the chapters carry it', () => {
  it('is no longer passed by always tapping the longest option in most chapters (3 Nov 2026: the right answers were shortened; the audit found nearly all)', () => {
    const passes = chapters.filter((c) => c.questions.slice(0, 3).filter(longestIsRight).length >= 2).length;
    expect(passes / chapters.length, `${passes} of ${chapters.length}`).toBeLessThan(0.3);
  });
});

describe('the check the game asks', () => {
  const offered = chapters.filter(checkable);
  const cards = (c: StoryChapter) => readingCheck(c).map((x, i) => questionCard(`reread:${c.id}:${i}`, x) as McqCard);
  const rank = (c: McqCard, k: number) => [...c.options.keys()].sort((a, b) => c.options[b].text.length - c.options[a].text.length)[k];
  const habits: Record<string, (c: McqCard) => number> = {
    'the longest option': (c) => rank(c, 0),
    'the second longest': (c) => rank(c, 1),
    'the third longest': (c) => rank(c, 2),
    'the first option': () => 0,
    'the last option': (c) => c.options.length - 1,
  };

  it('is offered for a large part of the course: chapters with at least two fair questions', () => {
    expect(offered.length).toBeGreaterThan(90);
    for (const c of offered) {
      const ask = readingCheck(c);
      expect(ask.length).toBeGreaterThanOrEqual(CHECK_MIN);
      expect(ask.length).toBeLessThanOrEqual(CHECK_MAX);
    }
  });

  it('never holds a question the longest option answers', () => {
    for (const c of offered) for (const x of readingCheck(c)) expect(longestIsRight(x), c.id).toBe(false);
  });

  it('tapping the longest option passes it in no chapter', () => {
    const passes = offered.filter((c) => cards(c).every((k) => rank(k, 0) === k.answer));
    expect(passes).toEqual([]);
  });

  for (const [label, tap] of Object.entries(habits)) {
    it(`${label} passes it in few chapters (pooled over the offered ones)`, () => {
      const passes = offered.filter((c) => cards(c).every((k) => tap(k) === k.answer)).length;
      expect(passes / offered.length, `${label}: ${passes} of ${offered.length}`).toBeLessThanOrEqual(0.15);
    });
  }

  it('the shortest option passes it in few chapters', () => {
    const passes = offered.filter((c) => cards(c).every((k) => [...k.options.keys()].sort((a, b) => k.options[a].text.length - k.options[b].text.length)[0] === k.answer)).length;
    expect(passes / offered.length, `${passes} of ${offered.length}`).toBeLessThanOrEqual(0.15);
  });

  it('answers it by knowing: on the screen, the right answer is the option the chapter says it is', () => {
    for (const c of offered) readingCheck(c).forEach((x, i) => expect(cards(c)[i].options[cards(c)[i].answer].text, c.id).toBe(x.options![x.answer as number]));
    expect(readingCheck(chapterWith('ch900', [FAIR(0), FAIR(1), FAIR(2), LONG])).length).toBe(3);
  });

  it('asks the questions made for a reread first, and only choices of three or more', () => {
    const c = chapterWith('ch901', [FAIR(0), FAIR(1)], { rereadQuestions: [FAIR(3), q(['yes', 'no'], 0), LONG] });
    expect(fairQuestions(c)).toHaveLength(3);
    expect(fairQuestions(c)[0]).toBe(c.rereadQuestions[0]);
    expect(longestIsRight(LONG)).toBe(true);
    expect(longestIsRight(q(['ab', 'abcd', 'abcd'], 1))).toBe(true);
  });

  it('a chapter with fewer than two fair questions is not offered', () => {
    expect(checkable(chapterWith('ch902', [LONG, LONG, FAIR(0)]))).toBe(false);
    expect(checkable(chapterWith('ch903', [LONG, FAIR(0), FAIR(1)]))).toBe(true);
  });
});

describe('what counts', () => {
  it('words a minute are words over seconds', () => {
    expect(wordsPerMinute(200, 100)).toBe(120);
    expect(wordsPerMinute(345, 150)).toBe(138);
    expect(wordsPerMinute(100, 0)).toBe(6000);
  });

  it('every question right at a pace a person can read counts', () => {
    expect(judge({ words: 300, secs: 120, right: 3, of: 3 })).toEqual({ wpm: 150, counted: true });
    expect(judge({ words: 300, secs: 120, right: 2, of: 2 }).counted).toBe(true);
  });

  it('a question missed does not, and says why; so does a pace nobody reads at', () => {
    expect(judge({ words: 300, secs: 120, right: 2, of: 3 })).toMatchObject({ counted: false, why: 'check' });
    expect(judge({ words: 300, secs: 30, right: 3, of: 3 })).toMatchObject({ wpm: 600, counted: false, why: 'fast' });
    expect(judge({ words: 400, secs: 60, right: 3, of: 3 }).counted).toBe(true);
    expect(judge({ words: 401, secs: 60, right: 3, of: 3 }).counted).toBe(false);
    expect(MAX_WPM).toBe(400);
  });

  it('too fast and wrong is the check that stopped it, and too few questions is no check at all', () => {
    expect(judge({ words: 300, secs: 10, right: 0, of: 3 }).why).toBe('check');
    expect(judge({ words: 300, secs: 120, right: 1, of: 1 }).counted).toBe(false);
  });
});

describe('which chapters are offered', () => {
  async function learner() {
    const w = await world();
    w.clock.t += 100 * DAY;
    const seen = (id: string, daysAgo: number) => w.learner.ledger.markSeen('chapter', id, { at: w.clock.t - daysAgo * DAY });
    return { ...w, seen };
  }

  it('only chapters first read at least a week ago', async () => {
    const w = await learner();
    w.seen('ch001', MIN_AGE_DAYS); w.seen('ch002', MIN_AGE_DAYS - 1); w.seen('ch003', 40);
    expect(rereadCandidates(w.learner, { reading: [] }, w.now())).toEqual(['ch001', 'ch003']);
  });

  it('a chapter read again yesterday in a lesson was still first read long ago', async () => {
    const w = await learner();
    w.seen('ch001', 20); w.seen('ch001', 1);
    expect(rereadCandidates(w.learner, { reading: [] }, w.now())).toEqual(['ch001']);
  });

  it('not one the game used this month, counted or not; one it used longer ago is back', async () => {
    const w = await learner();
    w.seen('ch001', 60); w.seen('ch002', 60); w.seen('ch003', 60);
    const row = (chapter: string, daysAgo: number, counted: boolean) => ({ at: w.now() - daysAgo * DAY, chapter, band: 'A1', words: 100, secs: 60, wpm: 100, right: 2, of: 2, counted });
    expect(rereadCandidates(w.learner, { reading: [row('ch001', COOLDOWN_DAYS - 1, true), row('ch002', 2, false), row('ch003', COOLDOWN_DAYS + 1, true)] }, w.now())).toEqual(['ch003']);
  });

  it('nothing for a learner who has read nothing', async () => {
    const w = await learner();
    expect(rereadCandidates(w.learner, { reading: [] }, w.now())).toEqual([]);
  });
});

describe('picking one', () => {
  async function setup(chaps: StoryChapter[], seen = chaps.map((c) => c.id)) {
    const w = await world();
    w.clock.t += 100 * DAY;
    for (const c of chaps) w.bundle.chapters.set(c.id, c);
    for (const id of seen) w.learner.ledger.markSeen('chapter', id, { at: w.clock.t - 30 * DAY });
    return { ...w, deps: { learner: w.learner, bundle: w.bundle, doc: { reading: [] as never[] }, rng: rng('p'), now: w.now } };
  }

  it('a chapter with a fair check, its band from its unit, its words counted', async () => {
    const w = await setup([chapterWith('ch801', [FAIR(0), FAIR(1), FAIR(2)])]);
    const p = (await pickReading(w.deps))!;
    expect(p.chapter.id).toBe('ch801');
    expect(p.band).toBe('A1');
    expect(p.words).toBe(14);
    expect(p.check).toHaveLength(3);
  });

  it('passes over a chapter the longest option would pass, and offers the next', async () => {
    const w = await setup([chapterWith('ch802', [LONG, LONG, LONG]), chapterWith('ch803', [FAIR(0), FAIR(1), LONG])]);
    for (let i = 0; i < 10; i++) {
      const p = (await pickReading({ ...w.deps, rng: rng(`x${i}`) }))!;
      expect(p.chapter.id).toBe('ch803');
    }
  });

  it('nothing, when no chapter can be checked or none has been read', async () => {
    const w = await setup([chapterWith('ch804', [LONG, LONG, LONG])]);
    expect(await pickReading(w.deps)).toBeUndefined();
    const none = await setup([chapterWith('ch805', [FAIR(0), FAIR(1)])], []);
    expect(await pickReading(none.deps)).toBeUndefined();
  });

  it('leaves out the chapter just offered when asked for a different one', async () => {
    const w = await setup([chapterWith('ch806', [FAIR(0), FAIR(1)]), chapterWith('ch807', [FAIR(0), FAIR(1)])]);
    const a = (await pickReading(w.deps))!;
    const b = (await pickReading(w.deps, [a.chapter.id]))!;
    expect(b.chapter.id).not.toBe(a.chapter.id);
    expect(await pickReading(w.deps, ['ch806', 'ch807'])).toBeUndefined();
  });

  it('a chapter this device cannot get is passed over', async () => {
    const w = await setup([chapterWith('ch808', [FAIR(0), FAIR(1)])], ['ch808', 'ch999']);
    const p = (await pickReading(w.deps))!;
    expect(p.chapter.id).toBe('ch808');
  });
});

describe('the row kept for a reading', () => {
  it('has the pace, the check and whether it counted; one wrong answer logs the pace and does not count', async () => {
    const w = await world();
    w.bundle.chapters.set('ch810', chapterWith('ch810', [FAIR(0), FAIR(1), FAIR(2)]));
    w.learner.ledger.markSeen('chapter', 'ch810', { at: w.now() - 30 * DAY });
    const p = (await pickReading({ learner: w.learner, bundle: w.bundle, doc: { reading: [] }, rng: rng('r'), now: w.now }))!;
    expect(readingRow(p, { at: 5, secs: 7, right: 3 })).toEqual({ at: 5, chapter: 'ch810', band: 'A1', words: 14, secs: 7, wpm: 120, right: 3, of: 3, counted: true });
    expect(readingRow(p, { at: 5, secs: 7, right: 2 })).toMatchObject({ wpm: 120, right: 2, of: 3, counted: false });
    expect(readingRow(p, { at: 5, secs: 1, right: 3 })).toMatchObject({ wpm: 840, counted: false });
  });
});
