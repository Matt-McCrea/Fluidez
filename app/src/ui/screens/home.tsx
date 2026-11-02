// Home: today's session in plain words, this week's goal, the story so far.
import { useEffect, useMemo } from 'preact/hooks';
import type { Mode, SessionPlan } from '../../compiler';
import { Bar, Heading, undash } from '../components/text';
import { useApp } from '../context';
import { sessionLabel, weekMap } from '../session/labels';
import { anotherAllowed, compilePlan, requestFullLesson, savedMinutesLeft } from '../session/runner';
import { goalLine } from '../session/goal';
import type { PracticeSpec } from '../session/practice-spec';
import { verbsMet } from '../session/freeplay';
import { weakSpots } from '../../learner/weak';
import { isResumable, streakStatus, type CanDoMark, type CheckpointResult, type SavedSession } from '../store/ui';
import { canDoGroups } from './progress';
import type { Bundle } from '../data/bundle';
import type { Learner } from '../../learner';
import { chapterBefore, chaptersRead } from '../session/storyline';

/** "Only five minutes?": the minimum tier under a five minute cap. */
export interface QuickStart { tier: 'minimum'; cap: number; quick: true }

/** The card that stands in for the week card once the last unit is done. Nothing in it claims what the learner can do. */
export const COURSE_END = {
  title: "That's the end of the course",
  body: "There are no more new lessons. Each day is now a mix of what's due, so the Spanish you've met keeps coming back.",
  next: 'A check shows what has stuck. The chapters you have read are in Story.',
} as const;

/** What Home says when the day's lessons are on the server and this device could not get them: the day is review, and the lesson is still ahead. */
export const OFFLINE_LINE = 'The next lessons need a connection. Today is review.';

/** The line for a plan the compiler held back for want of content this device does not have; nothing for any other plan. */
export function offlineLine(plan: { converted?: { reason: string } } | undefined): string | undefined {
  return plan?.converted?.reason === 'offline' ? OFFLINE_LINE : undefined;
}

/**
 * What Home says to a learner who is back after days away, when the compiler has planned them a gentle first session: how it
 * starts, in plain words. It names no number of days and no number of cards, and says nothing of what was lost.
 */
export function returnLine(plan: Pick<SessionPlan, 'converted' | 'blocks'> | undefined): string | undefined {
  if (plan?.converted?.reason !== 'reentry') return undefined;
  return plan.blocks.some((b) => b.kind === 'read')
    ? 'Welcome back. A few things to warm up, then the next part of the story.'
    : 'Welcome back. Just a few things to warm up today.';
}

/**
 * The first line of a week, when the path has just left a week the learner worked through: which
 * one, and where its goal stands. Not shown for the first week, nor for weeks placement jumped over.
 */
export function finishedWeekLine(
  units: ReadonlyArray<{ id: string; title: string; canDo: string }>, path: { unit: number; day: number }, placedAt: number,
  marks: readonly CanDoMark[], checkpoints: readonly CheckpointResult[],
): string | undefined {
  const i = path.unit - 1;
  const prev = units[i];
  if (!prev || path.day !== 0 || i < placedAt) return undefined;
  const g = canDoGroups(units, path.unit, placedAt, marks, checkpoints);
  const row = [...g.earned, ...g.getting, ...g.unchecked].find((r) => r.id === prev.id);
  const where = !row ? ''
    : row.state === 'earned' ? (row.how === 'checked' ? ' A check went well.' : ' You said you can do it.')
      : row.state === 'unchecked' ? ' Not checked yet: a check on Progress shows where you are.'
        : " You're still working on it.";
  return `You finished "${undash(prev.title)}".${where}`;
}

/**
 * What The story so far says before any chapter is read. Only a learner who started at the
 * beginning is told the story begins at the café door; a placed learner is told nothing, since
 * the first chapter they read is not the first one.
 */
export function storyBeforeTheFirstChapter(path: { unit: number }, placedAt: number | undefined): string | undefined {
  return path.unit === 0 && !placedAt ? 'The story starts in Bogotá, at the door of a café. You\'ll read the first chapter soon.' : undefined;
}

/**
 * The story so far, on Home. What the learner has read, from the library, so it does not depend on which
 * units are loaded. Before any chapter: a learner who started at the beginning is told where the story
 * starts, a placed one is told where it stands at their unit in the words of the chapter before it, and
 * anyone else is told nothing, since there is nothing true to say.
 */
export function StoryCard({ bundle, learner, path, placedAt, onStory }: { bundle: Bundle; learner: Pick<Learner, 'ledger'>; path: { unit: number }; placedAt: number | undefined; onStory: () => void }) {
  const seen = (id: string) => learner.ledger.hasSeen('chapter', id);
  const read = chaptersRead(bundle.story, seen);
  const last = read[read.length - 1];
  const start = last ? undefined : storyBeforeTheFirstChapter(path, placedAt);
  // a placed learner's first chapter is the first one at or after their unit
  const first = !last && !start && placedAt ? bundle.story.find((c) => (bundle.course.unitIndex.get(c.unit) ?? Infinity) >= placedAt) : undefined;
  const standing = first ? chapterBefore(bundle.story, first.id, seen) : undefined;
  if (!last && !start && !standing) return null;
  return (
    <section class="card" aria-labelledby="story-title">
      <p class="ask" id="story-title">The story so far</p>
      {last ? (
        <>
          <p>{read.length} {read.length === 1 ? 'chapter' : 'chapters'} read. Last: <em>{undash(last.title)}</em></p>
          <p class="hook">{undash(last.hook)}</p>
          <button class="btn quiet" onClick={onStory}>Read again</button>
        </>
      ) : start ? <p>{start}</p> : <p class="hook">{undash(standing!.hook)}</p>}
    </section>
  );
}

export function Home({ onStart, onStory, onWeak, onPractise, onLook }: { onWeak?: () => void; onLook?: (node: string) => void; onStart: (mode: Mode, o?: SavedSession | QuickStart) => void; onStory: () => void; onPractise: (spec?: PracticeSpec) => void }) {
  const app = useApp();
  const { learner, ui, bundle } = app;
  const now = app.now();
  const today = learner.day(now);
  const doneToday = ui.state.stats.lastDay === today && ui.state.stats.today > 0;
  const quickDone = ui.state.stats.quickToday === today && !doneToday;
  // five minutes is a warm-up plus a sprint: pointless before anything has been learned
  const hasReviews = app.learner.nodes().length > 0;
  const another = doneToday && anotherAllowed(learner, bundle, ui, now);
  const mode: Mode = doneToday ? 'another' : 'next';
  // a half-finished session from the last few hours waits to be picked up
  const saved = isResumable(ui.session, learner, now, ui.state.learnerId) ? ui.session : undefined;
  useEffect(() => { if (ui.session && !saved) void ui.clearSession(); }, [saved, ui.session]);
  const plan = useMemo(() => {
    if (saved) return undefined;
    try { return compilePlan(learner, bundle, ui, { mode, now }); } catch { return undefined; }
  }, [ui.path, learner.sessionIndex, mode, !!saved, bundle.index]);
  const minutesLeft = saved ? Math.max(1, Math.round(savedMinutesLeft(saved))) : 0;
  const spots = useMemo(() => {
    try {
      return weakSpots(learner.events(), (id) => bundle.node(id), {
        now, metVerbs: verbsMet(learner), sentenceEs: (id) => bundle.sentence(id)?.es,
      });
    } catch { return []; }
  }, [learner.sessionIndex, ui.path]);
  const unit = bundle.course.units[ui.path.unit];
  const short = learner.settings.tier === 'minimum';
  const goalNote = goalLine(ui.state.goal, unit);
  const { days, keptWithDayOff } = streakStatus(ui.state, today);
  const map = useMemo(() => (unit ? weekMap(unit.days, ui.path.day, bundle) : []), [unit, ui.path.day]);
  const prev = unit && ui.path.day > 0 ? unit.days[ui.path.day - 1] : undefined;
  const yesterdayNode = prev?.type === 'introduce' ? prev.focus.find((f) => f.startsWith('g:')) : undefined;
  const yesterday = yesterdayNode ? { node: yesterdayNode, title: bundle.title(yesterdayNode) } : undefined;
  const finished = ui.path.unit >= bundle.course.units.length;
  const lastDay = !!unit && ui.path.day === unit.days.length - 1;
  const placedAt = ui.state.placedAt ?? 0;
  const justFinished = finishedWeekLine(bundle.course.units, ui.path, placedAt, ui.state.canDos, ui.state.checkpoints);

  return (
    <main class="screen" id="main">
      <Heading title={doneToday ? 'Nice work today' : 'Hola'} lead={keptWithDayOff ? `Streak kept with a day off. ${days} days in a row.` : days > 1 ? `${days} days in a row.` : undefined} />
      {bundle.fixture ? <p class="tag" title="The real lessons are still being written">Sample lessons</p> : null}

      <section class="card today" aria-labelledby="today-title">
        <p class="ask" id="today-title">{doneToday ? 'Up next' : 'Today'}</p>
        {saved ? <p class="big" data-label>{sessionLabel(saved.plan, bundle)}</p>
          : plan ? <p class="big" data-label>{sessionLabel(plan, bundle)}</p> : <p class="big">Nothing to do yet</p>}
        {offlineLine(plan) ? <p data-offline>{offlineLine(plan)}</p> : null}
        {!saved && returnLine(plan) ? <p data-return>{returnLine(plan)}</p> : null}
        {short ? <p data-short>A short one today</p> : null}
        {saved ? <p class="small" data-left>About {minutesLeft} {minutesLeft === 1 ? 'minute' : 'minutes'} left</p>
          : plan ? <p class="small">About {Math.max(5, Math.round(plan.estimatedMinutes))} minutes</p> : null}
        {goalNote && !short ? <p class="small" data-goal>{goalNote}</p> : null}
        <div class="actions">
          {saved ? (
            <>
              <button class="btn primary" data-resume onClick={() => onStart(saved.mode, saved)}>Pick up where you left off</button>
              <button class="btn link small" data-start-over onClick={() => void ui.clearSession()}>Start over</button>
            </>
          ) : !doneToday ? <button class="btn primary" data-start onClick={() => onStart('next')}>Start</button>
            : another ? <button class="btn primary" data-another onClick={() => onStart('another')}>Do another</button>
              : <p>That's plenty for today. Your reviews need a rest to work. See you tomorrow.</p>}
          {short && !saved ? <button class="btn quiet" data-full onClick={() => { requestFullLesson(); onStart('next'); }}>Do the full lesson instead</button> : null}
          {!doneToday && !saved && !short && hasReviews ? <button class="btn link small" data-five onClick={() => onStart('next', { tier: 'minimum', cap: 5, quick: true })}>Only five minutes?</button> : null}
        </div>
        {quickDone && !saved ? <p class="small" data-quick-done>Five minutes done. The full lesson is still here when you have time.</p> : null}
      </section>

      <section class="card" aria-labelledby="practise-title">
        <p class="ask" id="practise-title">Practise</p>
        <p class="small">Extra work, any time. It never changes today's plan.</p>
        <div class="actions">
          <button class="btn primary" data-quick onClick={() => onPractise({ kind: 'quickReview' })}>Quick review</button>
          <button class="btn quiet" data-more-practice onClick={() => onPractise(undefined)}>More practice</button>
        </div>
      </section>

      {spots.length ? (
        <section class="card" aria-labelledby="trip-title">
          <p class="ask" id="trip-title">Keeps tripping you</p>
          <p class="small">A short workout on each, with fresh sentences.</p>
          {spots.map((s) => (
            <div class="actions" key={s.key} data-spot>
              <span>{undash(s.label)}</span>
              <button class="btn quiet" data-train onClick={() => onPractise(s.spec)}>Train it</button>
            </div>
          ))}
          {onWeak ? <button class="btn link" onClick={onWeak}>See all</button> : null}
        </section>
      ) : null}

      {unit && !finished ? (
        <section class="card" aria-labelledby="week-title">
          {justFinished ? <p class="small" data-week-done>{justFinished}</p> : null}
          <p class="ask" id="week-title">This week: {undash(unit.title)}</p>
          <p>{undash(unit.canDo)}</p>
          <Bar value={ui.path.day} of={unit.days.length} label="Progress through this week" />
          <p class="small">{ui.path.day} of {unit.days.length} lessons</p>
          {lastDay && !doneToday ? <p class="small" data-week-last>Today is the last lesson of this week.</p> : null}
          <ol class="weekmap" aria-label="The days this week">
            {map.map((d, i) => (
              <li key={i} data-day={d.state}>
                {d.state === 'done' ? '\u2713 ' : ''}{d.state === 'today' ? <strong>{d.word} (today)</strong> : d.word}
                {d.title && d.state !== 'done' ? <span class="small">: {undash(d.title)}</span> : null}
              </li>
            ))}
          </ol>
          {yesterday && onLook ? <button class="btn link small" data-yesterday onClick={() => onLook(yesterday.node)}>{doneToday ? "Today's lesson" : "Yesterday's lesson"}: {undash(yesterday.title)}</button> : null}
        </section>
      ) : finished ? (
        <section class="card" aria-labelledby="end-title" data-course-end>
          <p class="ask" id="end-title">{COURSE_END.title}</p>
          <p>{COURSE_END.body}</p>
          <p class="small">{COURSE_END.next}</p>
          <div class="actions">
            <button class="btn primary" data-end-check onClick={() => onPractise({ kind: 'checkpoint' })}>Take a check (about 10 minutes)</button>
          </div>
        </section>
      ) : null}

      <StoryCard bundle={bundle} learner={learner} path={ui.path} placedAt={ui.state.placedAt} onStory={onStory} />
    </main>
  );
}
