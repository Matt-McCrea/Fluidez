// One question on screen. Multiple choice: tap, see right/wrong with the
// reason. Typed: one self-correction attempt with a hint, then the right
// version and one plain reason. Read: read, peek at the English, move on.
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Card, Check } from '../session/cards';
import type { Outcome } from '../session/runner';
import { AnswerField } from './answer';
import { Es, Rich, Txt } from './text';

export interface CardViewProps {
  card: Card;
  onDone: (o: Outcome, input?: string) => void;
  /** label for the continue button */
  next?: string;
  /** 1-based position, for "3 of 9" */
  pos?: { n: number; of: number };
}

function Position({ pos }: { pos?: { n: number; of: number } }) {
  return pos ? <p class="pos" aria-live="off">{pos.n} of {pos.of}</p> : <p class="pos" aria-hidden="true">&nbsp;</p>;
}

export function CardView(p: CardViewProps) {
  const t0 = useRef(performance.now());
  useEffect(() => { t0.current = performance.now(); }, [p.card.key]);
  const ms = () => Math.round(performance.now() - t0.current);
  switch (p.card.type) {
    case 'mcq': return <McqView {...p} card={p.card} ms={ms} />;
    case 'type': return <TypeView {...p} card={p.card} ms={ms} />;
    case 'read': return <ReadView {...p} card={p.card} ms={ms} />;
  }
}

function Continue({ onClick, label, focus = true }: { onClick: () => void; label?: string; focus?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (focus) ref.current?.focus({ preventScroll: true }); }, []);
  return <button ref={ref} class="btn primary" data-primary onClick={onClick}>{label ?? 'Continue'}</button>;
}

/** What an MCQ reports and says once answered; `picked` is an option index, or 'unsure' for "I don't know". */
export function mcqResult(card: Extract<Card, { type: 'mcq' }>, picked: number | 'unsure', ms: number): { outcome: Outcome; right: boolean; lead: string } {
  const right = picked === card.answer;
  return { outcome: { correct: right, tries: 1, ms, evidence: { picked, feature: card.feature } }, right, lead: picked === 'unsure' ? 'No problem.' : 'Not quite.' };
}

function McqView({ card, onDone, next, pos, ms }: CardViewProps & { card: Extract<Card, { type: 'mcq' }>; ms: () => number }) {
  const [picked, setPicked] = useState<number | 'unsure' | null>(null);
  const [took, setTook] = useState(0);
  const done = picked !== null;
  const right = picked === card.answer;
  return (
    <section class="card" aria-labelledby={`q-${card.key}`}>
      <Position pos={pos} />
      <p class="ask" id={`q-${card.key}`}>{card.ask}</p>
      {card.prompt ? <Txt t={card.prompt} block big /> : null}
      {card.sub ? <Txt t={card.sub} block /> : null}
      <div class="options" role="group" aria-label="Choices">
        {card.options.map((o, i) => {
          const state = !done ? '' : i === card.answer ? ' right' : i === picked ? ' wrong' : ' dim';
          return (
            <button
              key={i} class={`option${state}`} lang={o.lang} disabled={done} data-option={i}
              aria-pressed={picked === i}
              onClick={() => { setTook(ms()); setPicked(i); }}
            >
              <span class={o.lang === 'es' ? 'es' : ''}><Rich text={o.text} /></span>
            </button>
          );
        })}
      </div>
      {done ? null : (
        <div class="actions">
          <button class="btn quiet" data-unsure onClick={() => { setTook(ms()); setPicked('unsure'); }}>{"I don't know"}</button>
        </div>
      )}
      <div class="feedback" aria-live="polite">
        {done ? (
          right
            ? <p class="ok">Yes. {card.after ? <Txt t={card.after} /> : null}</p>
            : <><p class="miss">{mcqResult(card, picked, took).lead} It's <Txt t={card.options[card.answer]} />.</p><p class="why"><Rich text={card.why} /></p></>
        ) : null}
      </div>
      <div class="actions">
        {done ? <Continue label={next} onClick={() => onDone(mcqResult(card, picked, took).outcome)} /> : null}
      </div>
    </section>
  );
}

function TypeView({ card, onDone, next, pos, ms }: CardViewProps & { card: Extract<Card, { type: 'type' }>; ms: () => number }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState<Check | null>(null);
  const [first, setFirst] = useState('');
  const [took, setTook] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const passed = !!result?.pass;
  const finished = passed || revealed;
  const retrying = !finished && tries === 1 && !!result;

  const submit = () => {
    if (finished || !value.trim()) return;
    const r = card.check(value);
    const n = tries + 1;
    setTries(n);
    setResult(r);
    if (n === 1) setFirst(value);
    if (!r.pass && (!card.retry || n >= 2)) { setRevealed(true); setTook(ms()); }
    if (r.pass) setTook(ms());
  };
  const giveUp = () => { setTries(Math.max(1, tries)); setRevealed(true); setTook(ms()); if (!result) setResult(card.check(value || ' ')); };

  return (
    <section class="card" aria-labelledby={`q-${card.key}`}>
      <Position pos={pos} />
      <p class="ask" id={`q-${card.key}`}><Rich text={card.ask} /></p>
      {card.prompt ? <Txt t={card.prompt} block big /> : null}
      {card.sub ? <Txt t={card.sub} block /> : null}
      <AnswerField
        value={value} onChange={setValue} onSubmit={submit} label={card.placeholder} placeholder={card.placeholder}
        lang={card.answerLang} disabled={finished} autoFocus
      />
      <div class="feedback" aria-live="polite">
        {passed ? (
          <>
            <p class="ok">{tries > 1 ? 'Got it.' : 'Right.'}{result!.near ? ' Just watch the accents:' : ''} {result!.near || tries > 1 ? <Es>{result!.answer}</Es> : null}</p>
            {result!.variant === 'peninsular' ? <p class="why">That's how they say it in Spain. In Latin America you'll hear <Es>{result!.answer}</Es>.</p> : null}
          </>
        ) : revealed ? (
          <>
            <p class="miss">Here's the right version: <Txt t={{ text: result?.answer ?? '', lang: card.answerLang }} /></p>
            <p class="why"><Rich text={result?.hint && card.why === 'Here is how Spanish says it.' ? result.hint : card.why} /></p>
            {first && first !== value ? <p class="small">You wrote: <span lang={card.answerLang}>{first}</span>, then <span lang={card.answerLang}>{value}</span></p> : null}
          </>
        ) : retrying ? (
          <p class="hint">Almost. <Rich text={result!.hint ?? 'Have another look and try once more.'} /></p>
        ) : null}
      </div>
      <div class="actions">
        {finished
          ? <Continue label={next} onClick={() => onDone({ correct: passed, tries: Math.max(1, tries), ms: took, evidence: { input: value, answer: result?.answer } }, value)} />
          : (
            <>
              <button class="btn primary" data-primary disabled={!value.trim()} onClick={submit}>{retrying ? 'Try again' : 'Check'}</button>
              <button class="btn quiet" data-giveup onClick={giveUp}>Show me</button>
            </>
          )}
      </div>
    </section>
  );
}

function ReadView({ card, onDone, next, pos, ms }: CardViewProps & { card: Extract<Card, { type: 'read' }>; ms: () => number }) {
  const [show, setShow] = useState(false);
  return (
    <section class="card">
      <Position pos={pos} />
      <p class="ask">{card.ask}</p>
      <Es block><span class="big">{card.es}</span></Es>
      <div class="feedback">
        {show ? <p class="en"><Rich text={card.en} /></p> : <button class="btn link" onClick={() => setShow(true)}>Show English</button>}
      </div>
      <div class="actions"><Continue label={next ?? 'Next'} onClick={() => onDone({ correct: true, tries: 1, ms: ms() })} /></div>
    </section>
  );
}

/**
 * A run of cards, one at a time, with a position line. `onShow(i)` fires as
 * each card appears; `stop()` is asked before each next card (out of time:
 * the run ends there).
 */
export function CardRun({ cards, onAnswer, onDone, onShow, stop }: {
  cards: Card[]; onAnswer: (i: number, o: Outcome, input?: string) => void; onDone: () => void;
  onShow?: (i: number) => void; stop?: () => boolean;
}) {
  const [i, setI] = useState(0);
  useEffect(() => { if (i < cards.length) onShow?.(i); }, [i]);
  if (!cards.length) return <div class="actions"><Continue onClick={onDone} /></div>;
  const card = cards[Math.min(i, cards.length - 1)];
  return (
    <CardView
      key={card.key} card={card} pos={{ n: i + 1, of: cards.length }}
      onDone={(o, input) => { onAnswer(i, o, input); if (i + 1 >= cards.length || stop?.()) onDone(); else setI(i + 1); }}
    />
  );
}

export { Continue };
