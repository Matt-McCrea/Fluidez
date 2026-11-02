// De corrido: a chapter the learner has already read, read again against the clock,
// then a few questions with the text gone. The pace is words a minute; the questions
// are what keeps a pace from being a swipe.
//
// A pace counts only if the questions are answered right and the pace is one a person
// can read at. Neither is a judgement of the learner: both are arithmetic on this run.
//
// The questions the chapters carry are not a fair gate as they stand. In 88 to 92 percent
// of them from B1 on, the right option is the longest one, so a reader who read nothing
// and always taps the longest passes (tests/ui/guess.test.ts measures it and holds the
// number where it is, since fixing it means a person writing wrong options again). The
// check here therefore asks only the questions whose right option is not the longest,
// and a chapter with fewer than two of them is not offered.
import type { StoryChapter } from '../content/schema';
import type { Rng } from '../exercises/rng';
import { shuffle } from '../exercises/rng';
import type { Learner } from '../learner';
import type { Bundle } from '../ui/data/bundle';
import { bringChapter } from '../ui/data/prepare';
import { countWords } from '../ui/session/beats';
import type { GamesDoc, ReadingRow } from './store';

const DAY_MS = 86_400_000;

/** A chapter is reread when it was first read at least this many days ago. */
export const MIN_AGE_DAYS = 7;
/** A chapter the game has used is not offered again for this long, counted or not: a second pass over a text is remembered, not read. */
export const COOLDOWN_DAYS = 30;
/** Faster than this is skimming, whatever the answers: no reader of a second language goes through a text at this pace. */
export const MAX_WPM = 400;
/** Questions asked, and the fewest a chapter must have to be offered. */
export const CHECK_MAX = 3;
export const CHECK_MIN = 2;

export type Question = StoryChapter['questions'][number];

/** Whether a question can be passed by tapping the longest option: its right option is the longest, or ties for it. */
export function longestIsRight(q: Question): boolean {
  if (!q.options || typeof q.answer !== 'number' || !q.options[q.answer]) return false;
  return q.options[q.answer].length >= Math.max(...q.options.map((o) => o.length));
}

/** The questions that give nothing away to the longest option: a choice of three or more whose right option is shorter than another. */
export function fairQuestions(chapter: Pick<StoryChapter, 'questions' | 'rereadQuestions'>): Question[] {
  // the questions made for a reread first: the learner has answered the others before, on the first read
  return [...chapter.rereadQuestions, ...chapter.questions].filter((q) => !!q.options && q.options.length >= 3 && typeof q.answer === 'number' && !!q.options[q.answer] && !longestIsRight(q));
}

/** The questions asked after the reading. */
export const readingCheck = (chapter: Pick<StoryChapter, 'questions' | 'rereadQuestions'>): Question[] => fairQuestions(chapter).slice(0, CHECK_MAX);

/** Whether a chapter can be offered: it has enough fair questions to be checked with. */
export const checkable = (chapter: Pick<StoryChapter, 'questions' | 'rereadQuestions'>): boolean => readingCheck(chapter).length >= CHECK_MIN;

export const wordsPerMinute = (words: number, secs: number): number => Math.round((words / Math.max(1, secs)) * 60);

export type Why = 'check' | 'fast';

/** Whether a run counts: every question right, at a pace a person can read at. `why` names what stopped it, the check first. */
export function judge(run: { words: number; secs: number; right: number; of: number }): { wpm: number; counted: boolean; why?: Why } {
  const wpm = wordsPerMinute(run.words, run.secs);
  if (run.of < CHECK_MIN || run.right < run.of) return { wpm, counted: false, why: 'check' };
  if (wpm > MAX_WPM) return { wpm, counted: false, why: 'fast' };
  return { wpm, counted: true };
}

/** Chapters that could be reread now: first read at least a week ago, and not used by the game this month. */
export function rereadCandidates(learner: Learner, doc: Pick<GamesDoc, 'reading'>, at: number): string[] {
  const recent = new Set(doc.reading.filter((r) => r.at > at - COOLDOWN_DAYS * DAY_MS).map((r) => r.chapter));
  return learner.ledger.seenBetween('chapter', 0, at - MIN_AGE_DAYS * DAY_MS).filter((id) => !recent.has(id)).sort();
}

export interface ReadingPick {
  chapter: StoryChapter;
  /** the stage the chapter belongs to, which a best is kept for */
  band: string;
  words: number;
  check: Question[];
}

export interface PickDeps { learner: Learner; bundle: Bundle; doc: Pick<GamesDoc, 'reading'>; rng: Rng; now: () => number }

/** Chapters looked into before giving up: each may have to be fetched. */
const LOOKS = 6;

/** A chapter to reread and the questions to check it with, chosen at random from those that could be, or undefined if none can be. `not` leaves some out (the one just offered). */
export async function pickReading(d: PickDeps, not: readonly string[] = []): Promise<ReadingPick | undefined> {
  const ids = shuffle(rereadCandidates(d.learner, d.doc, d.now()).filter((id) => !not.includes(id)), d.rng).slice(0, LOOKS);
  for (const id of ids) {
    if ((await bringChapter(d.bundle, id)) !== 'ready') continue;
    const chapter = d.bundle.chapters.get(id)!;
    if (!checkable(chapter)) continue;
    const band = d.bundle.course.units.find((u) => u.id === chapter.unit)?.band ?? 'A1';
    return { chapter, band, words: countWords(chapter.text), check: readingCheck(chapter) };
  }
  return undefined;
}

/** The row a reading is kept as. */
export function readingRow(pick: ReadingPick, run: { at: number; secs: number; right: number }): ReadingRow {
  const j = judge({ words: pick.words, secs: run.secs, right: run.right, of: pick.check.length });
  return { at: run.at, chapter: pick.chapter.id, band: pick.band, words: pick.words, secs: Math.round(run.secs), wpm: j.wpm, right: run.right, of: pick.check.length, counted: j.counted };
}
