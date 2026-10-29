// The story reader: tap any word for its meaning (the chapter's gloss first,
// then the word list), save it for later; then a few quick questions. Used for
// first reads, labelled re-reads, and from the Story screen.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ReadBlock, RereadBlock } from '../../compiler';
import type { StoryChapter } from '../../content/schema';
import { CardRun, Continue } from '../components/card';
import { Es, Heading, fmtSeconds } from '../components/text';
import type { Bundle } from '../data/bundle';
import { questionCard } from '../session/cards';
import { blockHeading } from '../session/labels';
import type { UiStore } from '../store/ui';
import type { BlockProps } from './types';

export function wordCount(text: string): number {
  return (text.match(/\p{L}+/gu) ?? []).length;
}

export function Reader({ chapter, bundle, ui, onFinish, finishLabel = "I've read it", clock }: {
  chapter: StoryChapter; bundle: Bundle; ui: UiStore; onFinish: (seconds: number) => void; finishLabel?: string; clock?: boolean;
}) {
  const [sel, setSel] = useState<{ word: string; es: string; en?: string } | null>(null);
  const [savedTick, setSavedTick] = useState(0);
  const [secs, setSecs] = useState(0);
  const start = useRef(performance.now());
  useEffect(() => {
    if (!clock) return;
    const t = window.setInterval(() => setSecs(Math.round((performance.now() - start.current) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, [clock]);
  const paras = useMemo(() => chapter.text.split(/\n+/).filter((l) => l.trim()), [chapter]);
  const isSaved = (es: string) => ui.state.saved.some((s) => s.es.toLowerCase() === es.toLowerCase());
  const tap = (word: string) => {
    const g = bundle.gloss(word, chapter);
    setSel({ word, es: g?.es ?? word, en: g?.en });
  };
  const save = async () => {
    if (!sel?.en || isSaved(sel.es)) return;
    await ui.update((s) => { s.saved.push({ es: sel.es, en: sel.en!, at: Date.now(), chapter: chapter.id }); });
    setSavedTick(savedTick + 1);
  };
  return (
    <div class="reader">
      {clock ? <div class="timer" role="timer" aria-label="Reading time">{fmtSeconds(secs)}</div> : null}
      <article class="story es" lang="es" aria-label={chapter.title}>
        {paras.map((p, i) => (
          <p key={i}>
            {p.split(/(\p{L}+)/u).map((tok, j) => (/^\p{L}+$/u.test(tok)
              ? <button key={j} type="button" class={`w${sel?.word === tok ? ' on' : ''}`} onClick={() => tap(tok)}>{tok}</button>
              : <span key={j}>{tok}</span>))}
          </p>
        ))}
      </article>
      <div class="gloss" aria-live="polite">
        {sel ? (
          <div class="gloss-inner">
            <p><Es><strong>{sel.es}</strong></Es> {sel.en ? <span class="en">{sel.en}</span> : <span class="small">No note for this word yet. Guess from the sentence.</span>}</p>
            <div class="gloss-actions">
              {sel.en ? <button class="btn quiet" disabled={isSaved(sel.es)} onClick={save}>{isSaved(sel.es) ? 'Saved' : 'Save word'}</button> : null}
              <button class="btn quiet" onClick={() => setSel(null)} aria-label="Close the note">Close</button>
            </div>
          </div>
        ) : <p class="small">Tap any word to see what it means.</p>}
      </div>
      <div class="actions"><Continue focus={false} label={finishLabel} onClick={() => onFinish(Math.round((performance.now() - start.current) / 1000))} /></div>
    </div>
  );
}

export function ReadChapter({ block, run, ui, onDone }: BlockProps<ReadBlock | RereadBlock>) {
  const chapter = run.bundle.chapters.get(block.chapter);
  const [stage, setStage] = useState<'read' | 'questions' | 'after'>('read');
  const [took, setTook] = useState(0);
  const h = blockHeading(block, run.bundle);
  if (!chapter) return <><Heading {...h} /><div class="actions"><Continue onClick={onDone} /></div></>;
  const reread = block.kind === 'reread';
  const firstTime = reread ? run.reads.get(chapter.id) ?? ui.state.readSeconds[chapter.id] : undefined;
  const questions = !reread ? chapter.questions
    : block.purpose === 'fluency' ? [] : (chapter.rereadQuestions.length ? chapter.rereadQuestions : chapter.questions);

  const finishReading = (secs: number) => {
    setTook(secs);
    const ref = run.bundle.index.chapterById.get(chapter.id);
    run.expose([...(ref?.requires ?? []), ...chapter.lexemes]);
    void run.addWords(wordCount(chapter.text), 0);
    if (!reread) {
      run.reads.set(chapter.id, secs);
      void ui.update((s) => { s.readSeconds[chapter.id] = secs; });
    }
    setStage(questions.length ? 'questions' : 'after');
  };

  if (stage === 'read') {
    return (
      <>
        <Heading title={reread ? `${h.title}: ${chapter.title}` : h.title} lead={h.lead} />
        {reread ? <p class="tag">Re-reading</p> : null}
        <Reader chapter={chapter} bundle={run.bundle} ui={ui} onFinish={finishReading} clock={reread && block.timed} />
      </>
    );
  }
  if (stage === 'questions') {
    const cards = questions.map((q, i) => questionCard(`${block.kind}:${chapter.id}:${i}`, q));
    return (
      <>
        <Heading title="A few quick questions" lead="About the story you just read." />
        <CardRun cards={cards} onAnswer={() => { /* comprehension: not a scored review */ }} onDone={() => setStage('after')} />
      </>
    );
  }
  return (
    <>
      <Heading title={reread ? 'Nice reading' : 'Story so far'} />
      {reread && firstTime ? (
        <p>First time: {fmtSeconds(firstTime)}. This time: {fmtSeconds(took)}.{took < firstTime ? ' Faster, and it should feel easier too.' : ' It should feel easier, even if it took as long.'}</p>
      ) : reread ? <p>Notice how much more of it you understood without stopping.</p> : <p>You just read a whole chapter in Spanish: {wordCount(chapter.text)} words.</p>}
      <div class="actions"><Continue onClick={onDone} /></div>
    </>
  );
}
