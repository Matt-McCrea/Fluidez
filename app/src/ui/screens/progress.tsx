// Progress: things you can do, words that have stuck, how much you've read
// and written, and days practised. No points.
import type { NodeId } from '../../content/schema';
import { Heading, undash } from '../components/text';
import { useApp } from '../context';
import { backlogMinutes, delayedAccuracy7d, productionShareWeek, reviewBudgetMinutes, wordsThisWeek } from '../../learner/metrics';
import { bandAt } from '../../compiler';
import { streakStatus } from '../store/ui';

export function Progress() {
  const { learner, ui, bundle, now } = useApp();
  const units = bundle.course.units;
  const done = units.slice(0, Math.min(ui.path.unit, units.length));
  const marks = new Map(ui.state.canDos.map((m) => [m.unit, m]));
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
  const weekNo = Math.max(1, units.slice(0, ui.path.unit).filter((u) => u.band === band).length + 1);
  const delayed = delayedAccuracy7d(events, learner, at);
  const made = productionShareWeek(events, at);
  const wait = backlogMinutes(learner, at);
  const budget = reviewBudgetMinutes(band);
  const week = wordsThisWeek(ui.state.weekly, today);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const num = (n: number) => n.toLocaleString('en-US');
  const waitText = wait < 1 ? 'nothing yet' : `about ${Math.round(wait)} ${Math.round(wait) === 1 ? 'minute' : 'minutes'}`;

  return (
    <main class="screen" id="main">
      <Heading title="Progress" />
      <section class="card" data-report>
        {sameBand.length && ui.path.unit < units.length ? <p class="ask" data-week>{band}, week {Math.min(weekNo, sameBand.length)} of {sameBand.length}</p> : null}
        <p data-delayed>Things from last week you still have: {delayed.n >= 10 && delayed.value !== undefined ? pct(delayed.value) : 'Not enough yet'}</p>
        <p data-produced>Spanish you produced this week: {made.n >= 10 && made.value !== undefined ? `${pct(made.value)} of practice` : 'Not enough yet'}</p>
        <p data-waiting>Waiting for you: {waitText}{wait >= 1 ? (wait <= budget ? ', under today\'s budget' : ', more than today\'s budget') : ''}</p>
        <p data-week-words>This week: {num(week.read)} words read, {num(week.written)} written</p>
      </section>
      <section class="card">
        <p class="ask">You can now…</p>
        {done.length || marks.size ? (
          <ul class="cando">
            {done.map((u) => <li key={u.id}>✓ {undash(u.canDo)}</li>)}
            {[...marks.values()].filter((m) => !done.some((u) => u.id === m.unit)).map((m) => (
              <li key={m.unit}>{m.feel === 'yes' ? '✓' : '…'} {undash(m.canDo)} <span class="small">({m.feel === 'yes' ? 'you said yes' : m.feel === 'mostly' ? 'mostly' : 'getting there'})</span></li>
            ))}
          </ul>
        ) : <p class="small">Finish your first week to tick off your first goal.</p>}
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
