// Home: today's session in plain words, this week's goal, the story so far.
import { useMemo } from 'preact/hooks';
import type { Mode } from '../../compiler';
import { Bar, Heading, undash } from '../components/text';
import { useApp } from '../context';
import { sessionLabel } from '../session/labels';
import { anotherAllowed, compilePlan } from '../session/runner';
import type { PracticeSpec } from '../session/practice-spec';
import { verbsMet } from '../session/freeplay';
import { weakSpots } from '../../learner/weak';
import { streak } from '../store/ui';

export function Home({ onStart, onStory, onPractise }: { onStart: (mode: Mode) => void; onStory: () => void; onPractise: (spec?: PracticeSpec) => void }) {
  const app = useApp();
  const { learner, ui, bundle } = app;
  const now = app.now();
  const today = learner.day(now);
  const doneToday = ui.state.stats.lastDay === today && ui.state.stats.today > 0;
  const another = doneToday && anotherAllowed(learner, bundle, ui, now);
  const mode: Mode = doneToday ? 'another' : 'next';
  const plan = useMemo(() => {
    try { return compilePlan(learner, bundle, ui, { mode, now }); } catch { return undefined; }
  }, [ui.path, learner.sessionIndex, mode]);
  const spots = useMemo(() => {
    try {
      return weakSpots(learner.events(), (id) => bundle.node(id), {
        now, metVerbs: verbsMet(learner), sentenceEs: (id) => bundle.sentence(id)?.es,
      });
    } catch { return []; }
  }, [learner.sessionIndex, ui.path]);
  const unit = bundle.course.units[ui.path.unit];
  const chaptersRead = bundle.index.chapters.filter((c) => learner.ledger.hasSeen('chapter', c.id));
  const last = chaptersRead[chaptersRead.length - 1];
  const lastFull = last ? bundle.chapters.get(last.id) : undefined;
  const days = streak(ui.state.stats.days, today);
  const finished = ui.path.unit >= bundle.course.units.length;

  return (
    <main class="screen" id="main">
      <Heading title={doneToday ? 'Nice work today' : 'Hola'} lead={days > 1 ? `${days} days in a row.` : undefined} />
      {bundle.fixture ? <p class="tag" title="The real lessons are still being written">Sample lessons</p> : null}

      <section class="card today" aria-labelledby="today-title">
        <p class="ask" id="today-title">{doneToday ? 'Up next' : 'Today'}</p>
        {plan ? <p class="big" data-label>{sessionLabel(plan, bundle)}</p> : <p class="big">Nothing to do yet</p>}
        {plan ? <p class="small">About {Math.max(5, Math.round(plan.estimatedMinutes))} minutes</p> : null}
        <div class="actions">
          {!doneToday ? <button class="btn primary" data-start onClick={() => onStart('next')}>Start</button>
            : another ? <button class="btn primary" data-another onClick={() => onStart('another')}>Do another</button>
              : <p>That's plenty for today. Your reviews need a rest to work. See you tomorrow.</p>}
        </div>
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
        </section>
      ) : null}

      {unit && !finished ? (
        <section class="card" aria-labelledby="week-title">
          <p class="ask" id="week-title">This week: {undash(unit.title)}</p>
          <p>{undash(unit.canDo)}</p>
          <Bar value={ui.path.day} of={unit.days.length} label="Progress through this week" />
          <p class="small">{ui.path.day} of {unit.days.length} lessons</p>
        </section>
      ) : finished ? <section class="card"><p>You've finished the course. Reviews keep it all fresh.</p></section> : null}

      <section class="card" aria-labelledby="story-title">
        <p class="ask" id="story-title">The story so far</p>
        {lastFull ? (
          <>
            <p>{chaptersRead.length} {chaptersRead.length === 1 ? 'chapter' : 'chapters'} read. Last: <em>{undash(lastFull.title)}</em></p>
            <p class="hook">{undash(lastFull.hook)}</p>
            <button class="btn quiet" onClick={onStory}>Read again</button>
          </>
        ) : <p>Tomás has just landed in Bogotá. You'll read the first chapter soon.</p>}
      </section>
    </main>
  );
}
