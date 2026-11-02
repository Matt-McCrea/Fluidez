// De corrido on screen: a chapter read before, read again against the clock, then the
// questions with the text gone. There is nothing to tap in the text and no English
// behind it: the pace is for reading, and a look-up is a different kind of reading.
import { useEffect, useRef, useState } from 'preact/hooks';
import { rng } from '../../exercises/rng';
import { creditReading } from '../../games/credit';
import { bestLine, cheer, rereadReaction } from '../../games/reactions';
import { judge, MAX_WPM, pickReading, readingRow, type ReadingPick } from '../../games/reading';
import { rereadKey, type BestResult, type ReadingRow } from '../../games/store';
import { CardRun, Continue } from '../components/card';
import { Heading, Txt, lines, undash } from '../components/text';
import { useApp } from '../context';
import { questionCard } from '../session/cards';

export function Corrido({ onExit }: { onExit: () => void }) {
  const { learner, bundle, ui, now } = useApp();
  const [pick, setPick] = useState<ReadingPick | null | undefined>(undefined);
  const [best, setBest] = useState<number | undefined>();
  const [last, setLast] = useState<number | undefined>();
  const choose = async (not: string[] = []) => {
    setPick(undefined);
    const doc = await ui.games.read();
    const p = await pickReading({ learner, bundle, doc, rng: rng(`reread:${now()}`), now }, not);
    setBest(p ? doc.bests[rereadKey(p.band)]?.score : undefined);
    // the pace of the last reading that counted at a chapter like this, to say when this one is faster
    setLast(p ? doc.reading.filter((r) => r.counted && r.band === p.band).at(-1)?.wpm : undefined);
    setPick(p ?? null);
  };
  useEffect(() => { void choose(); }, []);
  if (pick === undefined) return <main class="screen loading" id="main" aria-busy="true"><p>Finding a chapter</p></main>;
  if (pick === null) {
    return (
      <main class="screen" id="main">
        <button class="btn link" onClick={onExit}>Back</button>
        <Heading title="De corrido" lead="No chapter is ready to read again just now." />
      </main>
    );
  }
  return <Reread key={pick.chapter.id} pick={pick} best={best} last={last} onAnother={() => void choose([pick.chapter.id])} onExit={onExit} />;
}

type Phase = 'ready' | 'read' | 'check' | 'over';

/** One reading of one chapter, from the ready card to the end. */
export function Reread({ pick, best, last, onAnother, onExit }: { pick: ReadingPick; best: number | undefined; last?: number; onAnother: () => void; onExit: () => void }) {
  const app = useApp();
  const { learner, bundle, ui, now } = app;
  const [phase, setPhase] = useState<Phase>('ready');
  const [row, setRow] = useState<ReadingRow | null>(null);
  const [kept, setKept] = useState<BestResult | null>(null);
  const started = useRef(0);
  const secs = useRef(0);
  const right = useRef(0);
  const { chapter } = pick;

  const finish = async () => {
    const r = readingRow(pick, { at: now(), secs: secs.current, right: right.current });
    setRow(r);
    setPhase('over');
    if (r.counted) {
      const ref = bundle.index.chapterById.get(chapter.id);
      creditReading(learner, [...(ref?.requires ?? []), ...chapter.lexemes], r.at);
    }
    // saving is tried and not waited on to succeed: a store that refuses it leaves the reading as it is
    const [bestNow] = await Promise.allSettled([ui.games.addReading(r), learner.flush()]);
    if (bestNow.status === 'fulfilled' && bestNow.value) setKept(bestNow.value);
    app.refresh();
  };

  if (phase === 'ready') {
    return (
      <main class="screen" id="main">
        <button class="btn link" onClick={onExit}>Back</button>
        <Heading title="De corrido" lead="Read a chapter you have read before, as fast as you can still follow it." />
        <section class="card" aria-label="How it works">
          <p class="ask">{undash(chapter.title)}</p>
          <p>{pick.words} words. Read it through once, tap when you are done, and answer {pick.check.length} questions with the text gone.</p>
          <p>It counts when the questions are right and the pace is one a person can read at. Nothing in the text is tappable, so the pace is for reading.</p>
          {best !== undefined ? <p class="big-number" data-best>{best} <span>words a minute is your best on a chapter like this</span></p> : <p data-best>No pace kept for chapters like this yet.</p>}
          <div class="actions">
            <button class="btn primary" data-start onClick={() => { started.current = now(); setPhase('read'); }}>Start</button>
            <button class="btn quiet" data-another onClick={onAnother}>A different chapter</button>
          </div>
        </section>
      </main>
    );
  }
  if (phase === 'read') {
    return (
      <main class="screen" id="main">
        <article class="story es corrido" lang="es" aria-label={chapter.title}>
          {chapter.text.split(/\n+/).filter((l) => l.trim()).flatMap(lines).map((p, i) => <p key={i}>{p}</p>)}
        </article>
        <div class="actions"><Continue focus={false} label="I've read it" onClick={() => { secs.current = (now() - started.current) / 1000; right.current = 0; setPhase('check'); }} /></div>
      </main>
    );
  }
  if (phase === 'check') {
    const cards = pick.check.map((q, i) => questionCard(`reread:${chapter.id}:${i}`, q));
    return (
      <main class="screen" id="main">
        <Heading title="A few questions" lead="Answer from memory, the text is gone." />
        <CardRun cards={cards} onAnswer={(_i, o) => { if (o.correct) right.current += 1; }} onDone={() => void finish()} />
      </main>
    );
  }
  const r = row!;
  const why = judge({ words: r.words, secs: secs.current, right: r.right, of: r.of }).why;
  const say = rereadReaction(r, kept, cheer(learner), last);
  return (
    <main class="screen over" id="main">
      <Heading title="De corrido" lead={undash(chapter.title)} />
      <p class="big-number" data-score>{r.wpm} <span>words a minute, {r.right} of {r.of} questions right</span></p>
      {r.counted ? (
        <>
          {kept ? <p class="line" data-best>{bestLine(r.wpm, kept)}</p> : null}
          {say.cheer || say.remark ? <p class="line" data-remark>{say.cheer ? <><Txt t={{ text: say.cheer.es, lang: 'es' }} /> <span class="en">{say.cheer.en}</span> </> : null}{say.remark}</p> : null}
        </>
      ) : (
        <p class="line" data-nocount>
          {why === 'fast' ? `That is faster than a text can be read: more than ${MAX_WPM} words a minute. It does not count.` : `It does not count: a reading counts when every question is right.`}
        </p>
      )}
      <div class="actions">
        <Continue label="Another chapter" onClick={onAnother} />
        <button class="btn quiet" onClick={onExit}>Done</button>
      </div>
    </main>
  );
}
