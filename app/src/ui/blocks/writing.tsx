// Writing: a live checklist from the writing checker as the learner types,
// a word count, then their text beside a model and a three-question
// self-rubric. Then the self-check and the close.
import { useMemo, useState } from 'preact/hooks';
import type { CloseBlock, SelfCheckBlock, WritingBlock } from '../../compiler';
import { checkWriting, type Constraint } from '../../check';
import { AnswerField } from '../components/answer';
import { Continue } from '../components/card';
import { Bar, Es, Heading, Rich } from '../components/text';
import { blockHeading, lessonTypeWord } from '../session/labels';
import type { CanDoMark } from '../store/ui';
import type { BlockProps } from './types';

const RUBRIC = [
  'Did you say what you wanted to say?',
  'Did you use what you practised today?',
  'Would a Spanish speaker understand it first time?',
] as const;

export function Writing({ block, run, onDone }: BlockProps<WritingBlock>) {
  const task = run.bundle.tasks.get(block.task);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [rubric, setRubric] = useState<Record<number, string>>({});
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
  };

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
        <p class={`count${n > task.maxWords ? ' over' : ''}`} aria-live="polite">{n} words <span class="small">({task.minWords}–{task.maxWords})</span></p>
        {!submitted ? (
          <div class="actions"><button class="btn primary" data-primary disabled={tooShort} onClick={submit}>{tooShort ? `Write at least ${task.minWords} words` : 'Done, compare it'}</button></div>
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
                  {['Yes', 'Mostly', 'Not yet'].map((a) => (
                    <button key={a} class={`chip${rubric[k] === a ? ' on' : ''}`} role="radio" aria-checked={rubric[k] === a} onClick={() => setRubric({ ...rubric, [k]: a })}>{a}</button>
                  ))}
                </div>
              ))}
            </fieldset>
            <div class="actions"><Continue focus={false} onClick={onDone} /></div>
          </>
        )}
      </section>
    </>
  );
}

export function SelfCheck({ block, run, ui, onDone }: BlockProps<SelfCheckBlock>) {
  const h = blockHeading(block, run.bundle);
  const [sent, setSent] = useState(false);
  const pick = async (feel: CanDoMark['feel']) => {
    if (sent) return;
    setSent(true);
    await ui.update((s) => { s.canDos.push({ unit: block.unit, canDo: block.canDo, feel, at: Date.now() }); });
    onDone();
  };
  return (
    <>
      <Heading {...h} />
      <section class="card">
        <p class="ask">Can you do this now?</p>
        <p class="big">{block.canDo}</p>
        <div class="options">
          <button class="option" disabled={sent} onClick={() => pick('yes')}>Yes, I can</button>
          <button class="option" disabled={sent} onClick={() => pick('mostly')}>Mostly</button>
          <button class="option" disabled={sent} onClick={() => pick('notyet')}>Not yet</button>
        </div>
      </section>
    </>
  );
}

export function Close({ block, run, another, onAnother, onHome }: BlockProps<CloseBlock> & { another: boolean; onAnother: () => void; onHome: () => void }) {
  const unit = run.bundle.unit(block.unit);
  const hook = block.hookChapter ? run.bundle.chapters.get(block.hookChapter)?.hook : undefined;
  const t = run.tally;
  return (
    <>
      <Heading title="Done for today" lead={t.scored ? `${t.firstTry} of ${t.scored} right first time.` : ''} />
      <section class="card">
        {unit && block.progress ? (
          <>
            <p class="ask">This week</p>
            <p class="big">{unit.canDo}</p>
            <Bar value={block.progress.done} of={block.progress.of} label="Progress through this week's goal" />
            <p class="small">{block.progress.done} of {block.progress.of} lessons this week</p>
          </>
        ) : null}
        {hook ? <p class="hook">{hook}</p> : block.next ? <p class="hook">Next time: {lessonTypeWord(block.next)}.</p> : null}
      </section>
      <div class="actions stack">
        {block.offerAnother && another ? <button class="btn primary" data-another onClick={onAnother}>Do another</button> : null}
        <button class={`btn ${block.offerAnother && another ? 'quiet' : 'primary'}`} data-primary data-home onClick={onHome}>Back home</button>
      </div>
    </>
  );
}
