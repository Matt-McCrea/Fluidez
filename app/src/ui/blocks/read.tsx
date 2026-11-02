// The story reader: tap any word for its meaning (the chapter's gloss first,
// then the word list), save it for later; then a few quick questions. Used for
// first reads, labelled re-reads, and from the Story screen.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ReadBlock, RereadBlock } from '../../compiler';
import type { NodeId, StoryChapter } from '../../content/schema';
import { lexIndex } from '../../check/lexmatch';
import { Rating } from '../../learner';
import type { Outcome, SessionRunner } from '../session/runner';
import { CardRun, Continue } from '../components/card';
import { Es, Heading, fmtSeconds, lines, undash } from '../components/text';
import type { Bundle, TapAt } from '../data/bundle';
import { seenWithEvent, slipOf } from '../session/attempt';
import { questionCard } from '../session/cards';
import { sentencesOf, splitBeats } from '../session/beats';
import { blockHeading } from '../session/labels';
import type { UiStore } from '../store/ui';
import type { BlockProps } from './types';

export function wordCount(text: string): number {
  return (text.match(/\p{L}+/gu) ?? []).length;
}

type Question = StoryChapter['questions'][number];

/** The chapter's lexeme nodes that appear in a question's text (the question and its options). */
export function questionNodes(chapter: StoryChapter, q: Question, bundle: Bundle): NodeId[] {
  const ix = lexIndex([q.q, ...(q.options ?? [])].join(' . '));
  return chapter.lexemes.filter((id) => (bundle.node(id)?.es ?? '').split(/[/;,]/).some((alt) => ix.has(alt)));
}

/** Which question of a chapter this is, for the attempts log: `ch012:q3` on a first read, `ch012:r1` on a reread. */
function questionRef(chapter: StoryChapter, q: Question): string {
  const first = chapter.questions.indexOf(q);
  return `${chapter.id}:${first >= 0 ? `q${first}` : `r${chapter.rereadQuestions.indexOf(q)}`}`;
}

/** One answered comprehension question: an exposure event on the words it used, never a graded review. */
export function logComprehension(run: SessionRunner, chapter: StoryChapter, q: Question, o: Outcome): NodeId[] {
  const ids = questionNodes(chapter, q, run.bundle);
  seenWithEvent(run.learner, ids, { op: 'comprehend', grade: o.correct ? Rating.Good : Rating.Again, tries: o.tries, ms: o.ms, novel: false, ...slipOf(o) });
  // near half the questions use none of the chapter's words: those rows go under the chapter, and every row says which question it was
  run.answered({ node: ids[0] ?? chapter.id, op: 'comprehend', sentence: questionRef(chapter, q) }, o);
  return ids;
}

type Sel = { at: TapAt; word: string; es: string; en?: string; form?: string; how?: string; phrase?: { es: string; en: string }; name?: boolean };

/** Tap-to-gloss state shared by the whole-chapter reader and the beat reader. */
function useGloss(chapter: StoryChapter, bundle: Bundle, ui: UiStore) {
  const [sel, setSel] = useState<Sel | null>(null);
  const [, setTick] = useState(0);
  /** words tapped for their meaning, for the reads kept in the history */
  const taps = useRef(0);
  const isSaved = (es: string) => ui.state.saved.some((s) => s.es.toLowerCase() === es.toLowerCase());
  const tap = (word: string, at: TapAt) => {
    taps.current += 1;
    const g = bundle.gloss(word, chapter, at);
    setSel({ at, word, es: g?.es ?? word, en: g?.en, form: g?.form, how: g?.how, phrase: g?.phrase, name: g?.name });
  };
  const save = async () => {
    if (!sel?.en || sel.name || isSaved(sel.es)) return;
    await ui.update((s) => { s.saved.push({ es: sel.es, en: sel.en!, at: Date.now(), chapter: chapter.id }); });
    setTick((n) => n + 1);
  };
  const panel = (
    <div class="gloss" aria-live="polite">
      {sel ? (
        <div class="gloss-inner">
          <p>
            {sel.form && sel.form.toLowerCase() !== sel.es.toLowerCase()
              ? <><Es><strong>{undash(sel.form)}</strong></Es> <span class="small">from</span> <Es>{undash(sel.es)}</Es>, <span class="en">{undash(sel.en)}</span>{sel.how ? <span class="small"> ({sel.how})</span> : null}</>
              : <><Es><strong>{undash(sel.es)}</strong></Es> {sel.en ? <span class="en">{undash(sel.en)}</span> : <span class="small">No note for this word yet. Guess from the sentence.</span>}</>}
          </p>
          {sel.phrase ? <p class="small">In this phrase: <Es>{undash(sel.phrase.es)}</Es>, <span class="en">{undash(sel.phrase.en)}</span></p> : null}
          <div class="gloss-actions">
            {sel.en && !sel.name ? <button class="btn quiet" disabled={isSaved(sel.es)} onClick={save}>{isSaved(sel.es) ? 'Saved' : 'Save word'}</button> : null}
            <button class="btn quiet" onClick={() => setSel(null)} aria-label="Close the note">Close</button>
          </div>
        </div>
      ) : <p class="small">Tap any word to see what it means.</p>}
    </div>
  );
  return { sel, tap, panel, clear: () => setSel(null), taps: () => taps.current };
}

/** Paragraphs of tappable words; a small EN control after a sentence the bank can translate. */
function Passage({ text, label, bundle, selAt, tap, showEn }: {
  text: string; label: string; bundle: Bundle; selAt?: TapAt; tap: (w: string, at: TapAt) => void; showEn: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const paras = useMemo(() => text.split(/\n+/).filter((l) => l.trim()).flatMap(lines), [text]);
  const toggle = (k: string) => setOpen((o) => { const n = new Set(o); if (!n.delete(k)) n.add(k); return n; });
  return (
    <article class="story es" lang="es" aria-label={label}>
      {paras.map((p, i) => {
        let before = 0; // words of this paragraph ahead of the sentence, so a tap knows its place in the line
        return (
          <p key={i}>
            {sentencesOf(p).map((sent, si) => {
              const en = showEn ? bundle.englishOf(sent) : undefined;
              const k = `${i}:${si}`;
              const first = before;
              before += wordCount(sent);
              return (
                <span key={si}>
                  {si ? ' ' : ''}
                  {sent.split(/(\p{L}+)/u).map((tok, j) => {
                    if (!/^\p{L}+$/u.test(tok)) return <span key={j}>{tok}</span>;
                    const at = { line: p, index: first + (j - 1) / 2 };
                    return <button key={j} type="button" class={`w${selAt && selAt.line === p && selAt.index === at.index ? ' on' : ''}`} onClick={() => tap(tok, at)}>{tok}</button>;
                  })}
                  {en ? <> <button type="button" class="en-toggle" aria-expanded={open.has(k)} aria-label="Show English for this sentence" onClick={() => toggle(k)}>EN</button></> : null}
                  {en && open.has(k) ? <span class="en-line small" lang="en"> {undash(en)}</span> : null}
                </span>
              );
            })}
          </p>
        );
      })}
    </article>
  );
}

export function Reader({ chapter, bundle, ui, onFinish, finishLabel = "I've read it", clock }: {
  chapter: StoryChapter; bundle: Bundle; ui: UiStore; onFinish: (seconds: number, taps: number) => void; finishLabel?: string; clock?: boolean;
}) {
  const [secs, setSecs] = useState(0);
  const start = useRef(performance.now());
  useEffect(() => {
    if (!clock) return;
    const t = window.setInterval(() => setSecs(Math.round((performance.now() - start.current) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, [clock]);
  const g = useGloss(chapter, bundle, ui);
  return (
    <div class="reader">
      {clock ? <div class="timer" role="timer" aria-label="Reading time">{fmtSeconds(secs)}</div> : null}
      <Passage text={chapter.text} label={chapter.title} bundle={bundle} selAt={g.sel?.at} tap={g.tap} showEn={!clock} />
      {g.panel}
      <div class="actions"><Continue focus={false} label={finishLabel} onClick={() => onFinish(Math.round((performance.now() - start.current) / 1000), g.taps())} /></div>
    </div>
  );
}

/** A first read, one beat at a time: the text, then the questions it answers. */
function BeatReader({ chapter, questions, bundle, ui, keyPrefix, onQuestion, onFinish }: {
  chapter: StoryChapter; questions: Question[]; bundle: Bundle; ui: UiStore; keyPrefix: string;
  onQuestion: (i: number, o: Outcome) => void; onFinish: (readSeconds: number, taps: number) => void;
}) {
  const beats = useMemo(() => splitBeats(chapter.text, questions), [chapter, questions]);
  const [ix, setIx] = useState(0);
  const [asking, setAsking] = useState(false);
  const readMs = useRef(0);
  const shown = useRef(performance.now());
  const g = useGloss(chapter, bundle, ui);
  const beat = beats[ix];
  const last = ix === beats.length - 1;
  const advance = () => {
    if (last) { onFinish(Math.round(readMs.current / 1000), g.taps()); return; }
    setAsking(false); setIx(ix + 1); shown.current = performance.now(); g.clear();
  };
  if (asking) {
    const cards = beat.questions.map((i) => questionCard(`${keyPrefix}:${i}`, questions[i]));
    return <CardRun key={`q${ix}`} cards={cards} onAnswer={(i, o) => onQuestion(beat.questions[i], o)} onDone={advance} />;
  }
  const done = () => {
    readMs.current += performance.now() - shown.current;
    if (beat.questions.length) setAsking(true); else advance();
  };
  const label = beat.questions.length ? (beat.questions.length > 1 ? 'Quick questions' : 'A quick question') : last ? "I've read it" : 'Keep reading';
  return (
    <div class="reader">
      {beats.length > 1 ? <p class="small" aria-label={`Part ${ix + 1} of ${beats.length}`}>Part {ix + 1} of {beats.length}</p> : null}
      <Passage key={ix} text={beat.text} label={chapter.title} bundle={bundle} selAt={g.sel?.at} tap={g.tap} showEn />
      {g.panel}
      <div class="actions"><Continue focus={false} label={label} onClick={done} /></div>
    </div>
  );
}

export function ReadChapter({ block, run, ui, onDone }: BlockProps<ReadBlock | RereadBlock>) {
  const chapter = run.bundle.chapters.get(block.chapter);
  const [stage, setStage] = useState<'read' | 'questions' | 'after'>('read');
  const [took, setTook] = useState(0);
  const [right, setRight] = useState(0);
  const h = blockHeading(block, run.bundle);
  if (!chapter) return <><Heading {...h} /><div class="actions"><Continue onClick={onDone} /></div></>;
  const reread = block.kind === 'reread';
  const firstTime = reread ? run.reads.get(chapter.id) ?? ui.state.readSeconds[chapter.id] : undefined;
  const questions = !reread ? chapter.questions
    : block.purpose === 'fluency' ? [] : (chapter.rereadQuestions.length ? chapter.rereadQuestions : chapter.questions);

  const finishReading = (secs: number, taps: number, thenAsk = true) => {
    setTook(secs);
    const ref = run.bundle.index.chapterById.get(chapter.id);
    run.expose([...(ref?.requires ?? []), ...chapter.lexemes]);
    void run.addWords(wordCount(chapter.text), 0);
    void ui.keep.addRead({ at: Date.now(), chapter: chapter.id, words: wordCount(chapter.text), seconds: secs, taps, first: !reread });
    if (!reread) {
      run.reads.set(chapter.id, secs);
      void ui.update((s) => { s.readSeconds[chapter.id] = secs; });
    }
    setStage(thenAsk && questions.length ? 'questions' : 'after');
  };

  if (stage === 'read' && !reread) {
    // a first read: a beat of text, then the questions that beat answers
    return (
      <>
        <Heading title={h.title} lead={h.lead} />
        <BeatReader
          chapter={chapter} questions={questions} bundle={run.bundle} ui={ui} keyPrefix={`${block.kind}:${chapter.id}`}
          onQuestion={(i, o) => { if (o.correct) setRight((n) => n + 1); logComprehension(run, chapter, questions[i], o); }}
          onFinish={(secs, taps) => finishReading(secs, taps, false)}
        />
      </>
    );
  }
  if (stage === 'read') {
    return (
      <>
        <Heading title={reread ? `${h.title}: ${chapter.title}` : h.title} lead={h.lead} />
        {reread ? <p class="tag">Re-reading</p> : null}
        <Reader chapter={chapter} bundle={run.bundle} ui={ui} onFinish={(secs, taps) => finishReading(secs, taps)} clock={reread && block.timed} />
      </>
    );
  }
  if (stage === 'questions') {
    const cards = questions.map((q, i) => questionCard(`${block.kind}:${chapter.id}:${i}`, q));
    return (
      <>
        <Heading title="A few quick questions" lead="About the story you just read." />
        <CardRun cards={cards} onAnswer={(i, o) => { if (o.correct) setRight((n) => n + 1); logComprehension(run, chapter, questions[i], o); }} onDone={() => setStage('after')} />
      </>
    );
  }
  return (
    <>
      <Heading title={reread ? 'Nice reading' : 'Story so far'} />
      {questions.length ? <p class="lead">{right} of {questions.length} questions right.</p> : null}
      {reread && firstTime ? (
        <p>First time: {fmtSeconds(firstTime)}. This time: {fmtSeconds(took)}.{took < firstTime ? ' Faster, and it should feel easier too.' : ' It should feel easier, even if it took as long.'}</p>
      ) : reread ? <p>Notice how much more of it you understood without stopping.</p> : <p>You just read a whole chapter in Spanish: {wordCount(chapter.text)} words.</p>}
      <div class="actions"><Continue onClick={onDone} /></div>
    </>
  );
}
