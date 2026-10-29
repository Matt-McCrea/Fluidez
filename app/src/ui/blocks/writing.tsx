// Writing: a live checklist from the writing checker as the learner types,
// a word count, then their text beside a model and a three-question
// self-rubric. Then the self-check and the close.
import { useMemo, useRef, useState } from 'preact/hooks';
import { canDoServers, withRemediate, withoutRemediate, type CloseBlock, type SelfCheckBlock, type WritingBlock } from '../../compiler';
import { checkWriting, type Constraint } from '../../check';
import { AnswerField } from '../components/answer';
import { Continue } from '../components/card';
import { Bar, Es, Heading, Rich, undash } from '../components/text';
import { blockHeading, lessonTypeWord } from '../session/labels';
import { MORE_MIN_STREAK, MORE_MINUTES } from '../session/more';
import { lastWeekCameBack } from '../../learner/metrics';
import type { CanDoMark, RubricAnswer, WritingMark } from '../store/ui';
import type { BlockProps } from './types';

const RUBRIC = [
  'Did you say what you wanted to say?',
  'Did you use what you practised today?',
  'Would a Spanish speaker understand it first time?',
] as const;

const ANSWERS: { label: string; v: RubricAnswer }[] = [{ label: 'Yes', v: 'yes' }, { label: 'Mostly', v: 'mostly' }, { label: 'Not yet', v: 'notyet' }];

/** The most recent earlier mark: this task's, else any task's. */
export function lastWritingMark(writing: Record<string, WritingMark> | undefined, task: string): WritingMark | undefined {
  const all = writing ?? {};
  const own = all[task];
  if (own?.rubric.length) return own;
  return Object.values(all).filter((m) => m.rubric.length).sort((a, b) => b.at - a.at)[0];
}

export function lastTimeLine(m: WritingMark | undefined): string {
  if (!m || !m.rubric.length) return '';
  return `Last time: ${m.rubric.filter((r) => r === 'yes').length} of ${RUBRIC.length} yes`;
}

export function Writing({ block, run, ui, onDone }: BlockProps<WritingBlock>) {
  const task = run.bundle.tasks.get(block.task);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rubric, setRubric] = useState<Record<number, RubricAnswer>>({});
  const before = useRef(lastWritingMark(ui.state.writing, block.task));
  const h = blockHeading(block, run.bundle);
  const constraints = (task?.constraints ?? []) as unknown as Constraint[];
  const result = useMemo(() => (text.trim() ? checkWriting({ constraints }, text) : null), [text]);
  if (!task) return <><Heading {...h} /><div class="actions"><Continue onClick={onDone} /></div></>;
  const n = text.trim().split(/\s+/).filter(Boolean).length;
  const tooShort = n < task.minWords;

  const submit = () => {
    if (tooShort || submitted) return;
    setSubmitted(true);
    run.expose(run.bundle.index.tasks.get(task.id)?.requires ?? []);
    void run.addWords(0, n);
    void remember({});
  };
  const remember = (r: Record<number, RubricAnswer>) => ui.update((s) => {
    s.writing = { ...(s.writing ?? {}), [task!.id]: {
      at: Date.now(), rubric: RUBRIC.map((_, k) => r[k]).filter((x): x is RubricAnswer => !!x),
      words: n, met: result?.passed ?? 0, of: constraints.length,
    } };
  });
  const missing = constraints.length - (result?.passed ?? 0);

  return (
    <>
      <Heading {...h} />
      <section class="card">
        <p class="ask"><Rich text={task.prompt} /></p>
        {constraints.length ? (
          <ul class="checklist" aria-label="Checklist">
            {constraints.map((c, k) => {
              const r = result?.results[k];
              return <li key={k} class={r?.pass ? 'done' : ''}><span aria-hidden="true">{r?.pass ? '✓' : '○'}</span> <Rich text={r?.label ?? c.label ?? ''} />{r?.pass ? <span class="sr-only"> (done)</span> : null}</li>;
            })}
          </ul>
        ) : null}
        <AnswerField value={text} onChange={setText} label="Your text" placeholder="Write in Spanish" lang="es" multiline rows={6} disabled={submitted} autoFocus />
        <p class={`count${n > task.maxWords ? ' over' : ''}`} aria-live="polite">{n} words <span class="small">({task.minWords} to {task.maxWords})</span></p>
        {!submitted ? (
          <>
            {!tooShort && constraints.length && missing > 0 ? <p class="hint" aria-live="polite">You can send it, but {missing} of {constraints.length} things on the list {missing === 1 ? 'is' : 'are'} still missing.</p> : null}
            <div class="actions"><button class="btn primary" data-primary disabled={tooShort} onClick={submit}>{tooShort ? `Write at least ${task.minWords} words` : 'Done, compare it'}</button></div>
          </>
        ) : (
          <>
            <div class="compare">
              <div><p class="small">Yours</p><p lang="es" class="es-plain">{text}</p></div>
              <div><p class="small">One way to write it</p><Es block>{task.model}</Es></div>
            </div>
            <p class="lead">Compare them. What did the model do that you'd like to borrow?</p>
            <fieldset class="rubric">
              <legend>Check your own writing</legend>
              {RUBRIC.map((q, k) => (
                <div class="rubric-q" key={k} role="radiogroup" aria-label={q}>
                  <p>{q}</p>
                  {ANSWERS.map((a) => (
                    <button key={a.v} class={`chip${rubric[k] === a.v ? ' on' : ''}`} role="radio" aria-checked={rubric[k] === a.v} onClick={() => { const r = { ...rubric, [k]: a.v }; setRubric(r); void remember(r); }}>{a.label}</button>
                  ))}
                </div>
              ))}
              {lastTimeLine(before.current) ? <p class="small">{lastTimeLine(before.current)}</p> : null}
            </fieldset>
            <div class="actions"><Continue focus={false} onClick={onDone} /></div>
          </>
        )}
      </section>
    </>
  );
}

/** Record a self-check mark: the progress screen's can-do and, for anything shaky, the path's remediation list (rung back to the start). */
export async function markSelfCheck(run: BlockProps['run'], ui: BlockProps['ui'], block: SelfCheckBlock, feel: CanDoMark['feel']): Promise<void> {
  await ui.update((s) => { s.canDos.push({ unit: block.unit, canDo: block.canDo, feel, at: Date.now() }); });
  // the mark changes what comes back: shaky nodes go on the path's remediation list (rung back to the start)
  const nodes = canDoServers(run.bundle.course, block.unit);
  const at = Date.now();
  let shaky: string[] = [];
  if (feel === 'notyet') shaky = nodes;
  else if (feel === 'mostly') shaky = nodes.filter((n) => (run.learner.retrievability(n, 'productive', at) ?? 1) < 0.8);
  const list = feel === 'yes' ? withoutRemediate(ui.path.remediate ?? [], nodes) : withRemediate(ui.path.remediate ?? [], shaky, 'selfcheck', at);
  for (const n of shaky) run.learner.resetRung(n);
  await ui.setPath({ ...ui.path, remediate: list });
}

export function SelfCheck({ block, run, ui, onDone }: BlockProps<SelfCheckBlock>) {
  const h = blockHeading(block, run.bundle);
  const [sent, setSent] = useState(false);
  const pick = async (feel: CanDoMark['feel']) => {
    if (sent) return;
    setSent(true);
    await markSelfCheck(run, ui, block, feel);
    onDone();
  };
  return (
    <>
      <Heading {...h} />
      <section class="card">
        <p class="ask">Can you do this now?</p>
        <p class="big">{undash(block.canDo)}</p>
        <div class="options">
          <button class="option" disabled={sent} onClick={() => pick('yes')}>Yes, I can</button>
          <button class="option" disabled={sent} onClick={() => pick('mostly')}>Mostly</button>
          <button class="option" disabled={sent} onClick={() => pick('notyet')}>Not yet</button>
        </div>
      </section>
    </>
  );
}

export function Close({ block, run, more, onMore, onHome }: BlockProps<CloseBlock> & { more: boolean; onMore: () => void; onHome: () => void }) {
  const unit = run.bundle.unit(block.unit);
  const hook = block.hookChapter ? run.bundle.chapters.get(block.hookChapter)?.hook : undefined;
  const t = run.tally;
  const offer = block.offerAnother && more;
  const back = useMemo(() => { try { return lastWeekCameBack(run.learner.events(), run.learner, Date.now()); } catch { return { came: 0, of: 0 }; } }, []);
  return (
    <>
      <Heading title="Done for today" lead={t.scored ? `${t.firstTry} of ${t.scored} right first time.` : ''} />
      <section class="card">
        {unit && block.progress ? (
          <>
            <p class="ask">This week</p>
            <p class="big">{undash(unit.canDo)}</p>
            <Bar value={block.progress.done} of={block.progress.of} label="Progress through this week's goal" />
            <p class="small">{block.progress.done} of {block.progress.of} lessons this week</p>
          </>
        ) : null}
        {back.of > 0 ? <p class="small" data-came-back>From last week, {back.came} of {back.of} came back.</p> : null}
        {hook ? <p class="hook">{undash(hook)}</p> : block.next ? <p class="hook">Next time: {lessonTypeWord(block.next)}.</p> : null}
      </section>
      {offer ? (
        <section class="card more" aria-labelledby="more-title">
          <p class="ask" id="more-title">Got {MORE_MINUTES} more minutes?</p>
          <p>You've practised {MORE_MIN_STREAK} days in a row or more, and your reviews are under control. A good day to get ahead.</p>
        </section>
      ) : null}
      <div class="actions stack">
        {offer ? <button class="btn primary" data-another onClick={onMore}>Keep going</button> : null}
        <button class={`btn ${offer ? 'quiet' : 'primary'}`} data-primary data-home onClick={onHome}>{offer ? 'Not today' : 'Back home'}</button>
      </div>
    </>
  );
}
