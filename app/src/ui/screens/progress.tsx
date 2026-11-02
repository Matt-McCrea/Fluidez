// Progress: things you can do, words that have stuck, how much you've read
// and written, and days practised. No points.
import { Heading, undash } from '../components/text';
import { useApp } from '../context';
import { reviewBudgetMinutes } from '../../learner/metrics';
import { bandAt } from '../../compiler';
import { canDoGroups, progressNumbers } from '../session/numbers';
import type { PracticeSpec } from '../session/practice-spec';

// the goals' rules and the screen's numbers live in numbers.ts, which the monthly history shares
export { canDoGroups, type CanDoRow, type CanDoState } from '../session/numbers';

/**
 * Where the learner is in the course's five stages ("Stage 2 of 5"). The stages are the course's
 * own; a letter from the CEFR scale would claim a level the app has no evidence the learner has.
 */
export function stageLabel(units: ReadonlyArray<{ band?: string }>, band: string): string | undefined {
  const stages = [...new Set(units.map((u) => u.band).filter((b): b is string => !!b))];
  const i = stages.indexOf(band);
  return i < 0 ? undefined : `Stage ${i + 1} of ${stages.length}`;
}

export function Progress({ onPractise }: { onPractise?: (spec: PracticeSpec) => void } = {}) {
  const { learner, ui, bundle, now } = useApp();
  const units = bundle.course.units;
  const done = units.slice(0, Math.min(ui.path.unit, units.length));
  const goals = canDoGroups(units, done.length, ui.state.placedAt ?? 0, ui.state.canDos, ui.state.checkpoints);
  const next = units[ui.path.unit];
  const at = now();
  const nums = progressNumbers({ learner, ui, bundle, now: at });
  const band = bandAt(bundle.course, ui.path);
  const sameBand = units.filter((u) => u.band === band);
  const stage = stageLabel(units, band);
  const weekNo = Math.max(1, units.slice(0, ui.path.unit).filter((u) => u.band === band).length + 1);
  const { delayed, produced: made, waitMinutes: wait, week } = nums;
  const budget = reviewBudgetMinutes(band);
  const last = ui.state.checkpoints.at(-1);
  const lastShare = nums.check;
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const num = (n: number) => n.toLocaleString('en-US');
  const waitText = wait < 1 ? 'nothing yet' : `about ${Math.round(wait)} ${Math.round(wait) === 1 ? 'minute' : 'minutes'}`;

  return (
    <main class="screen" id="main">
      <Heading title="Progress" />
      <section class="card" data-report>
        {sameBand.length && ui.path.unit < units.length ? <p class="ask" data-week>{stage ? `${stage}, unit` : 'Unit'} {Math.min(weekNo, sameBand.length)} of {sameBand.length}</p> : null}
        <p data-delayed>Things from last week you still have: {delayed.n >= 10 && delayed.value !== undefined ? pct(delayed.value) : 'Not enough yet'}</p>
        <p data-produced>Spanish you produced this week: {made.n >= 10 && made.value !== undefined ? `${pct(made.value)} of practice` : 'Not enough yet'}</p>
        <p data-waiting>Waiting for you: {waitText}{wait >= 1 ? (wait <= budget ? ', under today\'s budget' : ', more than today\'s budget') : ''}</p>
        <p data-week-words>This week: {num(week.read)} words read, {num(week.written)} written</p>
      </section>
      <section class="card" data-checkpoint>
        <p class="ask">Check what has stuck</p>
        <p>{last && lastShare !== undefined
          ? `Last check, ${new Date(last.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${pct(lastShare)} right first time.`
          : 'A mixed check on the units you have finished, to see what you still have.'}</p>
        <div class="actions">
          <button class="btn primary" data-take-check disabled={!done.length || !onPractise} onClick={() => onPractise?.({ kind: 'checkpoint' })}>Take a check (about 10 minutes)</button>
        </div>
        {done.length ? null : <p class="small">Finish your first unit first</p>}
      </section>
      <section class="card" data-cando>
        <p class="ask">You can now…</p>
        {goals.earned.length ? (
          <ul class="cando">
            {goals.earned.map((r) => <li key={r.id}>✓ {undash(r.canDo)} <span class="small">({r.how === 'checked' ? 'a check went well' : 'you said yes'})</span></li>)}
          </ul>
        ) : <p class="small">Nothing yet. A goal is ticked when you say you can do it, or when a check shows it.</p>}
        {goals.getting.length ? (
          <>
            <p class="ask">Still working on</p>
            <ul class="cando" data-getting>
              {goals.getting.map((r) => <li key={r.id}>{undash(r.canDo)} <span class="small">({r.how === 'checked' ? 'the last check was shaky' : r.state === 'mostly' ? 'you said mostly' : 'you said not yet'})</span></li>)}
            </ul>
          </>
        ) : null}
        {next ? <p class="small" data-next-goal>Next: {undash(next.canDo)}</p> : null}
        {goals.unchecked.length ? (
          <details class="later" data-unchecked>
            <summary>Covered, not yet checked ({goals.unchecked.length})</summary>
            <ul class="cando">{goals.unchecked.map((r) => <li key={r.id}>{undash(r.canDo)}</li>)}</ul>
          </details>
        ) : null}
        {goals.skipped.length ? (
          <details class="later" data-skipped>
            <summary>Skipped at placement ({goals.skipped.length})</summary>
            <ul class="cando">{goals.skipped.map((r) => <li key={r.id}>{undash(r.canDo)}</li>)}</ul>
          </details>
        ) : null}
      </section>
      <dl class="stats">
        <div><dt>Words and phrases that have stuck</dt><dd data-stat="learned">{nums.learned}</dd></div>
        <div><dt>On their way</dt><dd data-stat="learning">{nums.learning}</dd></div>
        <div><dt>Sessions</dt><dd data-stat="sessions">{nums.sessions}</dd></div>
        <div><dt>Words read</dt><dd data-stat="read">{nums.wordsRead}</dd></div>
        <div><dt>Words written</dt><dd data-stat="written">{nums.wordsWritten}</dd></div>
        <div><dt>Days in a row</dt><dd data-stat="streak">{nums.streak}</dd></div>
        <div><dt>Days practised</dt><dd>{nums.daysPracticed}</dd></div>
      </dl>
      <p class="small">A word "sticks" once you can still produce it after about two months, including in a sentence you'd never seen.</p>
    </main>
  );
}
