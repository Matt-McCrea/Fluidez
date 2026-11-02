// Uno u otro on screen: the ready card, a round of choices, the end of it. A contrast that earlier text decides has no clock.
import { useEffect, useRef, useState } from 'preact/hooks';
import { rng } from '../../exercises/rng';
import { bestLine, cheer, unoReaction } from '../../games/reactions';
import { SKIP_SECONDS, WRONG_SECONDS } from '../../games/round';
import { unoKey, type GamesDoc } from '../../games/store';
import { UnoGame, type UnoDeck, type UnoResult } from '../../games/uno';
import { Continue, missPunct } from '../components/card';
import { Heading, Rich, Txt } from '../components/text';
import { useApp } from '../context';
import type { PracticeSpec } from '../session/practice-spec';

/** A whole sentence brings its own stop. */
const stopped = (t: string) => !missPunct(t);

export function Uno({ deck, onExit, onPractise }: { deck: UnoDeck; onExit: () => void; onPractise: (spec: PracticeSpec) => void }) {
  const { learner, bundle, ui, now } = useApp();
  const [doc, setDoc] = useState<GamesDoc | null>(null);
  const [game, setGame] = useState<UnoGame | null>(null);
  const [result, setResult] = useState<UnoResult | null | undefined>(undefined);
  useEffect(() => { let live = true; void ui.games.read().then((d) => { if (live) setDoc(d); }); return () => { live = false; }; }, []);
  const begin = () => {
    setResult(undefined);
    setGame(new UnoGame({ learner, bundle, rng: rng(`uno:${deck.id}:${now()}`), now, deck }));
  };
  const over = (r: UnoResult | null) => { setResult(r); void ui.games.read().then(setDoc); };
  const best = doc?.bests[unoKey(deck.id)]?.score;

  if (!game) return <Ready deck={deck} best={best} onStart={begin} onExit={onExit} />;
  if (result === undefined) return <Round game={game} deck={deck} onOver={over} onQuit={onExit} />;
  return <Over deck={deck} result={result} onAgain={begin} onExit={onExit} onPractise={onPractise} />;
}

function Ready({ deck, best, onStart, onExit }: { deck: UnoDeck; best: number | undefined; onStart: () => void; onExit: () => void }) {
  return (
    <main class="screen" id="main">
      <button class="btn link" onClick={onExit}>Back</button>
      <Heading title={`Uno u otro: ${deck.title}`} lead={deck.timed ? 'Sixty seconds. As many as you can.' : 'A few at a time, with no clock.'} />
      <section class="card" aria-label="How it works">
        <p>Two ways to say it, and one fits. Tap it.</p>
        {deck.timed
          ? <p>A wrong answer takes {WRONG_SECONDS.choose} seconds off the clock. Passing takes {SKIP_SECONDS} and shows you the answer, so if you don't know it, pass.</p>
          : <p>Nothing is timed. If you don't know it, pass and read the answer.</p>}
        <p class="small">It is practice: your review schedule and today's plan stay as they are.</p>
        {best !== undefined ? <p class="big-number" data-best>{best} <span>right is your best</span></p> : <p data-best>No score here yet.</p>}
        <div class="actions"><button class="btn primary" data-start onClick={onStart}>Start</button></div>
      </section>
    </main>
  );
}

function Round({ game, deck, onOver, onQuit }: { game: UnoGame; deck: UnoDeck; onOver: (r: UnoResult | null) => void; onQuit: () => void }) {
  const { learner, ui } = useApp();
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  const [mark, setMark] = useState({ hit: 0, shake: 0 });
  const ended = useRef(false);
  const end = () => {
    if (ended.current) return;
    ended.current = true;
    void game.finish(ui.games).then(async (r) => { await learner.flush().catch(() => undefined); onOver(r ?? null); });
  };
  useEffect(() => {
    if (!game.item) end();
    if (!deck.timed) return;
    const t = window.setInterval(() => { game.tick(); redraw(); if (game.over) end(); }, 200);
    return () => window.clearInterval(t);
  }, []);

  const it = game.item;
  if (!it) return null;
  const after = () => { redraw(); if (game.over && !game.correction) end(); };
  const onChoose = (i: number) => {
    if (game.correction) return;
    if (game.choose(i)) setMark((m) => ({ ...m, hit: m.hit + 1 })); else setMark((m) => ({ ...m, shake: m.shake + 1 }));
    after();
  };
  const onPass = () => { game.pass(); after(); };
  const onNext = () => { game.resume(); redraw(); if (game.over) end(); };
  const c = game.correction;
  const card = it.card;
  return (
    <main class="screen game" id="main">
      <div class="game-top">
        <span class={`game-score${mark.hit ? ` hit-${mark.hit % 2}` : ''}`} data-score>{game.right}<small>{deck.timed ? 'right' : `right of ${game.total}`}</small></span>
        {deck.timed ? <div class={`timer${game.left <= 10 ? ' low' : ''}`} role="timer" aria-label="Time left" aria-live="off" data-clock>{game.left}</div> : null}
      </div>
      <section class={`card game-card${mark.shake ? ` shake-${mark.shake % 2}` : ''}`} aria-label="Question">
        <p class="ask">{card.ask}</p>
        <div class="prompt"><Txt t={card.prompt} /></div>
        {card.sub ? <p class="sub"><Txt t={card.sub} /></p> : null}
        <div class="options" role="group" aria-label="Choices">
          {card.options.map((o, i) => {
            const state = !c ? '' : i === card.answer ? ' right' : i === c.picked ? ' wrong' : ' dim';
            return (
              <button key={i} class={`option${state}`} lang={o.lang} disabled={!!c} data-option={i} onClick={() => onChoose(i)}>
                <span class={o.lang === 'es' ? 'es' : ''}><Rich text={o.text} /></span>
              </button>
            );
          })}
        </div>
        <div class="feedback" aria-live="polite">
          {c ? (
            <>
              <p class="miss">{c.how === 'skip' ? '' : 'Not that one. '}{stopped(it.answer) ? 'This one fits: ' : 'It is '}<Txt t={{ text: it.answer, lang: it.answerLang }} />{stopped(it.answer) ? '' : '.'}</p>
              {card.why ? <p class="why small"><Rich text={card.why} /></p> : null}
            </>
          ) : null}
        </div>
        <div class="game-actions">
          {c ? <Continue label="Next" focus onClick={onNext} /> : <button class="btn quiet" data-pass onClick={onPass}>I don't know</button>}
        </div>
      </section>
      <div class="actions"><button class="btn link" data-stop onClick={() => (game.state.right + game.state.wrong + game.state.skipped ? end() : onQuit())}>Stop here</button></div>
    </main>
  );
}

function Over({ deck, result, onAgain, onExit }: {
  deck: UnoDeck; result: UnoResult | null; onAgain: () => void; onExit: () => void; onPractise: (spec: PracticeSpec) => void;
}) {
  const { learner } = useApp();
  if (!result) {
    return (
      <main class="screen over" id="main">
        <Heading title="Uno u otro" lead={deck.title} />
        <p>Nothing answered, so nothing kept.</p>
        <div class="actions"><Continue label="Again" onClick={onAgain} /><button class="btn quiet" onClick={onExit}>Done</button></div>
      </main>
    );
  }
  const { score, best } = result;
  const line = bestLine(score, best);
  const say = unoReaction(result, cheer(learner));
  return (
    <main class="screen over" id="main">
      <Heading title="Uno u otro" lead={deck.title} />
      <p class="big-number" data-score>{score} <span>{result.of !== undefined ? `right of ${result.of}` : 'right'}</span></p>
      {line ? <p class="line" data-best>{line}</p> : null}
      {say.cheer || say.remark ? <p class="line" data-remark>{say.cheer ? <><Txt t={{ text: say.cheer.es, lang: 'es' }} /> <span class="en">{say.cheer.en}</span> </> : null}{say.remark}</p> : null}
      {result.wrong || result.skipped ? <p class="small">{result.wrong} wrong, {result.skipped} passed.</p> : null}
      {result.missed.length ? (
        <>
          <p class="ask">What slipped</p>
          <ul class="slips" data-missed>
            {result.missed.map((m) => <li key={m.cue}><Txt t={{ text: m.cue, lang: m.cueLang }} />{stopped(m.cue) ? ' ' : ': '}<Txt t={{ text: m.answer, lang: m.answerLang }} /></li>)}
          </ul>
        </>
      ) : null}
      <div class="actions">
        <Continue label="Again" onClick={onAgain} />
        <button class="btn quiet" onClick={onExit}>Done</button>
      </div>
    </main>
  );
}
