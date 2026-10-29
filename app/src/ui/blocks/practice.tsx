// Card-based blocks: warm-up, leech rescue, the practice blocks (read and
// pick, your turn, cued production, talk about you, remix, reading check,
// extra reading) and the timed recall sprint.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { LeechBlock, PracticeBlock, TimedRecallBlock, WarmupBlock } from '../../compiler';
import { CardRun, CardView, Continue } from '../components/card';
import { Heading } from '../components/text';
import { practiceCard, recallCard, reviewCard } from '../session/cards';
import { blockHeading } from '../session/labels';
import type { BlockProps } from './types';

export function ReviewRun({ block, run, onDone }: BlockProps<WarmupBlock | LeechBlock>) {
  const cards = useMemo(() => block.items.map((it) => reviewCard(it, run.bundle)), [block]);
  const h = blockHeading(block, run.bundle);
  return (
    <>
      <Heading {...h} />
      <CardRun cards={cards} onAnswer={(i, o) => run.score(block.items[i], o)} onDone={onDone} />
    </>
  );
}

export function PracticeRun({ block, run, onDone }: BlockProps<PracticeBlock>) {
  const cards = useMemo(() => block.items.map((it) => practiceCard(it, run.bundle, run.plan.seed)), [block]);
  const h = blockHeading(block, run.bundle);
  const read = block.kind === 'extraReading';
  return (
    <>
      <Heading {...h} />
      <CardRun
        cards={cards}
        onAnswer={(i, o) => {
          run.score(block.items[i], o);
          if (read) { const s = run.bundle.sentence(block.items[i].sentence); if (s) void run.addWords(s.es.split(/\s+/).length, 0); }
        }}
        onDone={onDone}
      />
    </>
  );
}

export function TimedRecall({ block, run, onDone }: BlockProps<TimedRecallBlock>) {
  const cards = useMemo(() => block.items.map((it) => recallCard(it, run.bundle)), [block]);
  const [started, setStarted] = useState(false);
  const [left, setLeft] = useState(block.seconds);
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const over = started && (left <= 0 || i >= cards.length);
  useEffect(() => {
    if (!started || over) return;
    timer.current = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(timer.current);
  }, [started, over]);
  const h = blockHeading(block, run.bundle);
  if (!started) {
    return (
      <>
        <Heading {...h} />
        <p>{cards.length} things you know. Two minutes. Type each one in Spanish; no second tries.</p>
        <div class="actions"><Continue label="Start the clock" onClick={() => setStarted(true)} /></div>
      </>
    );
  }
  if (over) {
    return (
      <>
        <Heading title="Time!" />
        <p class="big-number">{right} <span>of {Math.min(i, cards.length)} right</span></p>
        <p>Quick recall like this is what makes words come out when you need them.</p>
        <div class="actions"><Continue onClick={onDone} /></div>
      </>
    );
  }
  const card = cards[i];
  return (
    <>
      <div class="timer" role="timer" aria-live="off">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</div>
      <CardView
        key={card.key} card={card} pos={{ n: i + 1, of: cards.length }} next="Next"
        onDone={(o) => { run.score(block.items[i], o); if (o.correct) setRight((r) => r + 1); setI(i + 1); }}
      />
    </>
  );
}
