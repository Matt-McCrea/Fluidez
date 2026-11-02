// Progress: things you can do, words that have stuck, how much you've read
// and written, and days practised. No points.
import type { NodeId } from '../../content/schema';
import { Heading, undash } from '../components/text';
import { useApp } from '../context';
import { backlogMinutes, delayedAccuracy7d, productionShareWeek, reviewBudgetMinutes, wordsThisWeek } from '../../learner/metrics';
import { bandAt } from '../../compiler';
import { streakStatus, type CanDoMark, type CheckpointResult } from '../store/ui';
import type { PracticeSpec } from '../session/practice-spec';

export type CanDoState = 'earned' | 'mostly' | 'notyet' | 'unchecked' | 'skipped';
export interface CanDoRow { id: string; canDo: string; state: CanDoState; /** what the state rests on: the learner's word, or a check */ how?: 'said' | 'checked' }

/** A check counts when at least this share of a unit's items came right first time. */
const CHECK_PASS = 0.7;

/**
 * Where each goal stands. A goal is ticked on evidence: the learner said yes, or a check of that
 * unit went well, whichever came last. A unit the path has passed with neither is covered, not
 * checked; one that placement jumped over is skipped. Only finished units, and units with a
 * mark or a check, are listed.
 */
export function canDoGroups(
  units: ReadonlyArray<{ id: string; canDo: string }>, finished: number, placedAt: number,
  marks: readonly CanDoMark[], checkpoints: readonly CheckpointResult[],
): Record<'earned' | 'getting' | 'unchecked' | 'skipped', CanDoRow[]> {
  const said = new Map<string, CanDoMark>();
  for (const m of marks) if (!said.has(m.unit) || m.at >= said.get(m.unit)!.at) said.set(m.unit, m);
  const checked = new Map<string, { at: number; right: number; total: number }>();
  for (const c of checkpoints) {
    for (const [unit, r] of Object.entries(c.byUnit)) {
      if (r.total > 0 && (!checked.has(unit) || c.at >= checked.get(unit)!.at)) checked.set(unit, { at: c.at, ...r });
    }
  }
  const row = (id: string, canDo: string, index: number): CanDoRow | undefined => {
    const m = said.get(id), c = checked.get(id);
    if (m && (!c || m.at > c.at)) return { id, canDo, state: m.feel === 'yes' ? 'earned' : m.feel, how: 'said' };
    if (c) return { id, canDo, state: c.right / c.total >= CHECK_PASS ? 'earned' : 'notyet', how: 'checked' };
    if (index >= finished) return undefined;
    return { id, canDo, state: index < placedAt ? 'skipped' : 'unchecked' };
  };
  const rows = units.map((u, i) => row(u.id, u.canDo, i));
  // a mark for a unit the course no longer has still counts, under the words the learner saw
  for (const m of said.values()) if (!units.some((u) => u.id === m.unit)) rows.push(row(m.unit, m.canDo, Infinity));
  const some = rows.filter((r): r is CanDoRow => !!r);
  return {
    earned: some.filter((r) => r.state === 'earned'),
    getting: some.filter((r) => r.state === 'mostly' || r.state === 'notyet'),
    unchecked: some.filter((r) => r.state === 'unchecked'),
    skipped: some.filter((r) => r.state === 'skipped'),
  };
}

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
  const words = learner.nodes().filter((id: NodeId) => {
    const k = bundle.node(id)?.kind ?? (id.startsWith('l:') ? 'lexeme' : id.startsWith('c:') ? 'chunk' : '');
    return k === 'lexeme' || k === 'chunk';
  });
  const learned = words.filter((id) => learner.isLearned(id)).length;
  const s = ui.state.stats;
  const today = learner.day(now());
  const { days } = streakStatus(ui.state, today);
  const at = now();
  const events = learner.events();
  const band = bandAt(bundle.course, ui.path);
  const sameBand = units.filter((u) => u.band === band);
  const stage = stageLabel(units, band);
  const weekNo = Math.max(1, units.slice(0, ui.path.unit).filter((u) => u.band === band).length + 1);
  const delayed = delayedAccuracy7d(events, learner, at);
  const made = productionShareWeek(events, at);
  const wait = backlogMinutes(learner, at);
  const budget = reviewBudgetMinutes(band);
  const week = wordsThisWeek(ui.state.weekly, today);
  const last = ui.state.checkpoints.at(-1);
  const lastShare = last ? (() => {
    const rows = Object.values(last.byUnit);
    const total = rows.reduce((n, r) => n + r.total, 0);
    return total ? rows.reduce((n, r) => n + r.right, 0) / total : undefined;
  })() : undefined;
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const num = (n: number) => n.toLocaleString('en-US');
  const waitText = wait < 1 ? 'nothing yet' : `about ${Math.round(wait)} ${Math.round(wait) === 1 ? 'minute' : 'minutes'}`;

  return (
    <main class="screen" id="main">
      <Heading title="Progress" />
      <section class="card" data-report>
        {sameBand.length && ui.path.unit < units.length ? <p class="ask" data-week>{stage ? `${stage}, week` : 'Week'} {Math.min(weekNo, sameBand.length)} of {sameBand.length}</p> : null}
        <p data-delayed>Things from last week you still have: {delayed.n >= 10 && delayed.value !== undefined ? pct(delayed.value) : 'Not enough yet'}</p>
        <p data-produced>Spanish you produced this week: {made.n >= 10 && made.value !== undefined ? `${pct(made.value)} of practice` : 'Not enough yet'}</p>
        <p data-waiting>Waiting for you: {waitText}{wait >= 1 ? (wait <= budget ? ', under today\'s budget' : ', more than today\'s budget') : ''}</p>
        <p data-week-words>This week: {num(week.read)} words read, {num(week.written)} written</p>
      </section>
      <section class="card" data-checkpoint>
        <p class="ask">Check what has stuck</p>
        <p>{last && lastShare !== undefined
          ? `Last check, ${new Date(last.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${pct(lastShare)} right first time.`
          : 'A mixed check on the weeks you have finished, to see what you still have.'}</p>
        <div class="actions">
          <button class="btn primary" data-take-check disabled={!done.length || !onPractise} onClick={() => onPractise?.({ kind: 'checkpoint' })}>Take a check (about 10 minutes)</button>
        </div>
        {done.length ? null : <p class="small">Finish your first week first</p>}
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
        <div><dt>Words and phrases that have stuck</dt><dd data-stat="learned">{learned}</dd></div>
        <div><dt>On their way</dt><dd data-stat="learning">{words.length - learned}</dd></div>
        <div><dt>Sessions</dt><dd data-stat="sessions">{s.sessions}</dd></div>
        <div><dt>Words read</dt><dd data-stat="read">{s.wordsRead}</dd></div>
        <div><dt>Words written</dt><dd data-stat="written">{s.wordsWritten}</dd></div>
        <div><dt>Days in a row</dt><dd data-stat="streak">{days}</dd></div>
        <div><dt>Days practised</dt><dd>{s.days.length}</dd></div>
      </dl>
      <p class="small">A word "sticks" once you can still produce it after about two months, including in a sentence you'd never seen.</p>
    </main>
  );
}
