// Relámpago on screen: the ready card, a round, the end of it. A round is its own
// component with one input that never unmounts, so the keyboard stays up from the
// first form to the last, and a typed form is the answer the moment it is right.
import { useEffect, useRef, useState } from 'preact/hooks';
import { rng } from '../../exercises/rng';
import { FlashGame, type FlashDeck, type FlashResult } from '../../games/flash';
import { bestLine } from '../../games/reactions';
import { SKIP_SECONDS, WRONG_SECONDS } from '../../games/round';
import { flashKey, type GamesDoc } from '../../games/store';
import type { McqCard } from '../session/cards';
import { AnswerField } from '../components/answer';
import { Continue } from '../components/card';
import { Heading, Rich, Txt } from '../components/text';
import { useApp } from '../context';
import type { PracticeSpec } from '../session/practice-spec';

export function Flash({ deck, onExit, onPractise }: { deck: FlashDeck; onExit: () => void; onPractise: (spec: PracticeSpec) => void }) {
  const { learner, bundle, ui, now } = useApp();
  const [doc, setDoc] = useState<GamesDoc | null>(null);
  const [game, setGame] = useState<FlashGame | null>(null);
  const [result, setResult] = useState<FlashResult | null | undefined>(undefined);
  useEffect(() => { let live = true; void ui.games.read().then((d) => { if (live) setDoc(d); }); return () => { live = false; }; }, []);
  // the round starts in the tap that asked for it, with what is already read: a keyboard asked for later is one iOS may not raise
  const begin = () => {
    setResult(undefined);
    setGame(new FlashGame({ learner, bundle, rng: rng(`flash:${deck.id}:${now()}`), now, deck, cells: doc?.cells }));
  };
  const over = (r: FlashResult | null) => { setResult(r); void ui.games.read().then(setDoc); };
  const best = doc?.bests[flashKey(deck.id)]?.score;
  if (!game) return <Ready deck={deck} best={best} onStart={begin} onExit={onExit} />;
  if (result === undefined) return <Round game={game} deck={deck} onOver={over} onQuit={onExit} />;
  return <Over deck={deck} result={result} onAgain={begin} onExit={onExit} onPractise={onPractise} />;
}

const KIND_OF = (deck: FlashDeck) => (deck.kind === 'forms' ? 'type' : 'choose') as 'type' | 'choose';
const UNIT = (deck: FlashDeck) => (deck.kind === 'forms' ? 'forms' : 'words');

function Ready({ deck, best, onStart, onExit }: { deck: FlashDeck; best: number | undefined; onStart: () => void; onExit: () => void }) {
  return (
    <main class="screen" id="main">
      <button class="btn link" onClick={onExit}>Back</button>
      <Heading title={`Relámpago: ${deck.title}`} lead="Sixty seconds. As many as you can." />
      <section class="card" aria-label="How it works">
        <p>{deck.kind === 'forms' ? 'You see the meaning and type the form. It counts the moment it is right, so there is no Enter to press.' : 'You see a word and tap what it means, or the other way round.'}</p>
        <p>A wrong answer takes {WRONG_SECONDS[KIND_OF(deck)]} seconds off the clock. Passing takes {SKIP_SECONDS} and shows you the answer, so if you don't know it, pass.</p>
        <p class="small">It only uses what you already know. It is practice: your review schedule and today's plan stay as they are.</p>
        {best !== undefined ? <p class="big-number" data-best>{best} <span>{UNIT(deck)} is your best</span></p> : <p data-best>No score here yet.</p>}
        <div class="actions"><button class="btn primary" data-start onClick={onStart}>Start</button></div>
      </section>
    </main>
  );
}

function Round({ game, deck, onOver, onQuit }: { game: FlashGame; deck: FlashDeck; onOver: (r: FlashResult | null) => void; onQuit: () => void }) {
  const { learner, ui } = useApp();
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  const [typed, setTyped] = useState('');
  const [mark, setMark] = useState({ hit: 0, shake: 0 });
  const ended = useRef(false);
  const end = () => {
    if (ended.current) return;
    ended.current = true;
    // saving is tried and not waited on to succeed: a store that refuses it leaves the round as it is
    void game.finish(ui.games).then(async (r) => { await learner.flush().catch(() => undefined); onOver(r ?? null); });
  };
  useEffect(() => {
    // a deck that cannot deal a single item ends before it starts
    if (!game.item) end();
    const t = window.setInterval(() => { game.tick(); redraw(); if (game.over) end(); }, 200);
    return () => window.clearInterval(t);
  }, []);

  const it = game.item;
  if (!it) return null;
  const paused = game.state.paused;
  const after = () => { redraw(); if (game.over) end(); };
  const onType = (v: string) => {
    if (paused) return;
    if (game.typed(v)) { setTyped(''); setMark((m) => ({ ...m, hit: m.hit + 1 })); } else setTyped(v);
    after();
  };
  const onEnter = () => {
    if (paused) { game.resume(); setTyped(''); redraw(); return; }
    const r = game.submit(typed);
    if (r === 'right') { setTyped(''); setMark((m) => ({ ...m, hit: m.hit + 1 })); }
    if (r === 'wrong') setMark((m) => ({ ...m, shake: m.shake + 1 }));
    after();
  };
  const onChoose = (i: number) => {
    if (paused) return;
    if (game.choose(i)) setMark((m) => ({ ...m, hit: m.hit + 1 })); else setMark((m) => ({ ...m, shake: m.shake + 1 }));
    after();
  };
  const onPass = () => { game.pass(); after(); };
  const onNext = () => { game.resume(); setTyped(''); redraw(); };
  const c = game.correction;
  const card = it.card;
  return (
    <main class="screen game" id="main">
      <div class="game-top">
        <span class={`game-score${mark.hit ? ` hit-${mark.hit % 2}` : ''}`} data-score>{game.state.right}<small>{UNIT(deck)}</small></span>
        <div class={`timer${game.left <= 10 ? ' low' : ''}`} role="timer" aria-label="Time left" aria-live="off" data-clock>{game.left}</div>
      </div>
      <section class={`card game-card${mark.shake ? ` shake-${mark.shake % 2}` : ''}`} aria-label="Question">
        {card.type === 'mcq' ? <p class="ask">{card.ask}</p> : null}
        <div class="prompt"><Txt t={card.prompt} /></div>
        {card.sub ? <p class="sub"><Txt t={card.sub} /></p> : null}
        {it.kind === 'type' ? (
          <AnswerField value={typed} onChange={onType} onSubmit={onEnter} label={card.type === 'type' ? card.placeholder : 'Answer'} placeholder="The form, with accents" lang="es" autoFocus />
        ) : (
          <div class="options" role="group" aria-label="Choices">
            {(card as McqCard).options.map((o, i) => {
              const state = !c ? '' : i === (card as McqCard).answer ? ' right' : i === c.picked ? ' wrong' : ' dim';
              return (
                <button key={i} class={`option${state}`} lang={o.lang} disabled={!!c} data-option={i} onClick={() => onChoose(i)}>
                  <span class={o.lang === 'es' ? 'es' : ''}><Rich text={o.text} /></span>
                </button>
              );
            })}
          </div>
        )}
        <div class="feedback" aria-live="polite">
          {game.hint ? <p class="hint">{game.hint}</p> : null}
          {c ? (
            <>
              <p class="miss">{c.how === 'skip' ? 'It is ' : 'Not that one. It is '}<Txt t={{ text: c.answer, lang: c.answerLang }} />.</p>
              {c.given ? <p class="small">You typed <span lang="es">{c.given}</span>.</p> : null}
              {card.why ? <p class="why small"><Rich text={card.why} /></p> : null}
            </>
          ) : null}
        </div>
        <div class="game-actions">
          {c ? <Continue label="Next" focus={it.kind === 'choose'} onClick={onNext} /> : <button class="btn quiet" data-pass onClick={onPass}>I don't know</button>}
        </div>
      </section>
      <div class="actions"><button class="btn link" data-stop onClick={() => (game.state.right + game.state.wrong + game.state.skipped ? end() : onQuit())}>Stop here</button></div>
    </main>
  );
}

function Over({ deck, result, onAgain, onExit, onPractise }: {
  deck: FlashDeck; result: FlashResult | null; onAgain: () => void; onExit: () => void; onPractise: (spec: PracticeSpec) => void;
}) {
  if (!result) {
    return (
      <main class="screen over" id="main">
        <Heading title="Relámpago" lead={deck.title} />
        <p>Nothing answered, so nothing kept.</p>
        <div class="actions"><Continue label="Again" onClick={onAgain} /><button class="btn quiet" onClick={onExit}>Done</button></div>
      </main>
    );
  }
  const { score, best } = result;
  const line = bestLine(score, best);
  const practise: PracticeSpec | undefined = deck.kind === 'forms' && result.verbs.length && deck.tense
    ? { kind: 'conjugate', verbs: result.verbs, tenses: [deck.tense], title: `${deck.title}: what slipped` }
    : deck.kind === 'words' && result.words.length ? { kind: 'nodes', nodes: result.words, title: 'Words that slipped' } : undefined;
  return (
    <main class="screen over" id="main">
      <Heading title="Relámpago" lead={deck.title} />
      <p class="big-number" data-score>{score} <span>{UNIT(deck)} right</span></p>
      {line ? <p class="line" data-best>{line}</p> : null}
      {result.wrong || result.skipped ? <p class="small">{result.wrong} wrong, {result.skipped} passed.</p> : null}
      {result.missed.length ? (
        <>
          <p class="ask">What slipped</p>
          <ul class="slips" data-missed>
            {result.missed.map((m) => <li key={m.cue}><Txt t={{ text: m.cue, lang: m.cueLang }} />: <Txt t={{ text: m.answer, lang: m.answerLang }} /></li>)}
          </ul>
        </>
      ) : null}
      <div class="actions">
        <Continue label="Again" onClick={onAgain} />
        {practise ? <button class="btn quiet" data-practise onClick={() => onPractise(practise)}>Practise these</button> : null}
        <button class="btn quiet" onClick={onExit}>Done</button>
      </div>
    </main>
  );
}
