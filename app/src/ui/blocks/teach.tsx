// Teaching blocks: new words and phrases (present, then 3–5 interleaved
// retrievals each), a new pattern (hook → examples → rule → read and pick →
// your turn → pitfalls), the drill opener (recall before the reminder) and
// the personal sentence.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { LearnBlock, PersonalBlock, RuleRecallBlock, TeachBlock } from '../../compiler';
import type { TeachingScript } from '../../content/schema';
import { LEARNING_STEPS_MAX } from '../../learner';
import { AnswerField } from '../components/answer';
import { CardRun, CardView, Continue } from '../components/card';
import { Es, Heading, Paras, Rich } from '../components/text';
import { learnRetrieval, scriptCard, sentenceCheck, type Card } from '../session/cards';
import { blockHeading } from '../session/labels';
import type { BlockProps } from './types';

// ---------------------------------------------------------------- learn

type Step = { kind: 'present'; i: number } | { kind: 'ask'; i: number; round: number };

function initialQueue(n: number): Step[] {
  const q: Step[] = [];
  for (let g = 0; g < n; g += 3) {
    const idx = Array.from({ length: Math.min(3, n - g) }, (_, k) => g + k);
    idx.forEach((i) => q.push({ kind: 'present', i }));
    idx.forEach((i) => q.push({ kind: 'ask', i, round: 0 }));
  }
  return q;
}

export function Learn({ block, run, onDone }: BlockProps<LearnBlock>) {
  const [queue, setQueue] = useState<Step[]>(() => initialQueue(block.items.length));
  const [pos, setPos] = useState(0);
  const h = blockHeading(block, run.bundle);
  const step = queue[pos];
  useEffect(() => { if (step?.kind === 'present') run.present(block.items[step.i].node, block.items[step.i].productive); }, [pos]);
  if (!block.items.length || !step) {
    return <><Heading {...h} /><p>All set. You've got these.</p><div class="actions"><Continue onClick={onDone} /></div></>;
  }
  const item = block.items[step.i];
  const advance = (extra?: Step) => {
    const q = extra ? [...queue, extra] : queue;
    if (extra) setQueue(q);
    if (pos + 1 >= q.length) onDone(); else setPos(pos + 1);
  };
  if (step.kind === 'present') {
    const segs = run.bundle.segments(item.node);
    const ex = run.bundle.sentence(item.example);
    return (
      <>
        {pos === 0 ? <Heading {...h} /> : null}
        <section class="card present" key={`p${pos}`}>
          <p class="ask">New</p>
          {segs.length ? segs.map((s, k) => (
            <div class="pair" key={k}><Es block><span class="big">{s.es}</span></Es><p class="en">{s.en}</p></div>
          )) : <p class="big">{run.bundle.title(item.node)}</p>}
          {ex ? <div class="example"><p class="small">In a sentence</p><Es block>{ex.es}</Es><p class="en">{ex.en}</p></div> : null}
          <div class="actions"><Continue label="Got it" onClick={() => advance()} /></div>
        </section>
      </>
    );
  }
  const card: Card = learnRetrieval(item, run.bundle, step.round);
  return (
    <CardView
      key={`a${pos}`} card={card}
      onDone={(o) => {
        let done = true;
        if (item.scoring === 'learning') done = run.learningStep(item.node, o, item.credit, item.productive);
        else run.score(item, o);
        const again = !done && step.round + 1 < LEARNING_STEPS_MAX;
        advance(again ? { kind: 'ask', i: step.i, round: step.round + 1 } : undefined);
      }}
    />
  );
}

// ---------------------------------------------------------------- teach

type Phase = TeachBlock['parts'][number];

export function Teach({ block, run, onDone }: BlockProps<TeachBlock>) {
  const script = run.bundle.scripts.get(block.node);
  const h = blockHeading(block, run.bundle);
  useEffect(() => { run.present(block.node); }, []);
  const phases = useMemo<Phase[]>(() => {
    if (!block.script || !script) return ['examples'];
    return block.parts.filter((p) => {
      if (p === 'readAndPick') return block.items.some((i) => i.op === 'readAndPick');
      if (p === 'yourTurn') return block.items.some((i) => i.op === 'yourTurn');
      if (p === 'pitfalls') return script.pitfalls.length > 0;
      return true;
    });
  }, [block]);
  const [k, setK] = useState(0);
  const phase = phases[k];
  const next = () => (k + 1 >= phases.length ? onDone() : setK(k + 1));
  const node = run.bundle.node(block.node);

  if (!script || !block.script) {
    // no script yet: the idea from the graph, then the bank examples (practice follows)
    const ex = block.examples.map((id) => run.bundle.sentence(id)).filter(Boolean);
    return (
      <>
        <Heading {...h} />
        {node?.es ? <div class="pair"><Es block>{node.es}</Es>{node.en ? <p class="en">{node.en}</p> : null}</div> : null}
        {ex.map((s) => <div class="pair" key={s!.id}><Es block>{s!.es}</Es><p class="en">{s!.en}</p></div>)}
        <p class="handoff">You've seen how it works. Now try it.</p>
        <div class="actions"><Continue onClick={onDone} /></div>
      </>
    );
  }
  return (
    <>
      <Heading title={h.title} />
      <TeachPhase key={phase} phase={phase} script={script} block={block} run={run} onDone={next} />
    </>
  );
}

function TeachPhase({ phase, script, block, run, onDone }: { phase: Phase; script: TeachingScript; block: TeachBlock; run: BlockProps['run']; onDone: () => void }) {
  switch (phase) {
    case 'hook':
      return (
        <section class="card">
          <p class="lead">Today: {script.hook.line.replace(/^Today:?\s*/i, '')}</p>
          <Es block><span class="big">{script.hook.es}</span></Es>
          <p class="en">{script.hook.en}</p>
          <div class="actions"><Continue label="Show me" onClick={onDone} /></div>
        </section>
      );
    case 'examples':
      return (
        <section class="card">
          <p class="ask">Read these. Spot what they have in common.</p>
          {script.examples.map((e, i) => <div class="pair" key={i}><Es block>{e.es}</Es><p class="en">{e.en}</p></div>)}
          <div class="actions"><Continue label="What's the trick?" onClick={onDone} /></div>
        </section>
      );
    case 'rule':
      return (
        <section class="card rule">
          <p class="ask">Here's the trick</p>
          <Paras text={script.rule} />
          {script.soundTip ? <p class="tip"><strong>Sound tip:</strong> <Rich text={script.soundTip} /></p> : null}
          {script.smallPrint ? <p class="small-print"><Rich text={script.smallPrint} /></p> : null}
          <div class="actions"><Continue label="Let's try it" onClick={onDone} /></div>
        </section>
      );
    case 'readAndPick':
    case 'yourTurn': {
      const items = block.items.filter((i) => i.op === phase);
      const cards = items.map((it) => scriptCard(it, script)).filter((c): c is Card => !!c);
      return (
        <>
          <p class="handoff">{phase === 'readAndPick' ? 'Read and pick. Look closely at the small words.' : "You've seen it a few times. Now try writing it."}</p>
          <CardRun cards={cards} onAnswer={(i, o) => run.score(items[i], o)} onDone={onDone} />
        </>
      );
    }
    case 'pitfalls':
      return (
        <section class="card">
          <p class="ask">Almost everyone slips here at first</p>
          {script.pitfalls.map((p, i) => (
            <div class="pitfall" key={i}>
              <p><s class="es" lang="es">{p.wrong}</s> → <Es>{p.right}</Es></p>
              <p class="why"><Rich text={p.why} /></p>
            </div>
          ))}
          <div class="actions"><Continue onClick={onDone} /></div>
        </section>
      );
  }
}

// ---------------------------------------------------------------- rule recall

export function RuleRecall({ block, run, onDone }: BlockProps<RuleRecallBlock>) {
  const script = run.bundle.scripts.get(block.node);
  const node = run.bundle.node(block.node);
  const [stage, setStage] = useState<'try' | 'remind'>('try');
  const h = blockHeading(block, run.bundle);
  const target = script ? { es: script.hook.es, en: script.hook.en } : node?.es && node.en ? { es: node.es.split(/\s+\/\s+/)[0], en: node.en.split(/\s+\/\s+/)[0] } : null;
  if (!target) return <><Heading {...h} /><div class="actions"><Continue onClick={onDone} /></div></>;
  const card: Card = {
    type: 'type', key: `rr:${block.node}`, ask: `Remember last time? How would you say this?`, prompt: { text: target.en, lang: 'en' },
    answerLang: 'es', placeholder: 'Type it in Spanish', retry: false, check: sentenceCheck({ es: target.es, en: target.en, accept: [] }),
    why: 'Here is the reminder.',
  };
  if (stage === 'try') return <><Heading {...h} /><CardView card={card} next="Show the reminder" onDone={() => setStage('remind')} /></>;
  return (
    <>
      <Heading title="Quick reminder" />
      <section class="card rule">
        {script ? <Paras text={script.rule.split(/\n\s*\n/)[0]} /> : <p>{run.bundle.title(block.node)}</p>}
        {(script?.examples ?? []).slice(0, 2).map((e, i) => <div class="pair" key={i}><Es block>{e.es}</Es><p class="en">{e.en}</p></div>)}
        <div class="actions"><Continue label="Let's practise" onClick={onDone} /></div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------- personal sentence

export function Personal({ block, run, onDone }: BlockProps<PersonalBlock>) {
  const script = run.bundle.scripts.get(block.node);
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const h = blockHeading(block, run.bundle);
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  const submit = () => {
    if (words < 2 || sent) return;
    setSent(true);
    void run.addWords(0, words);
  };
  return (
    <>
      <Heading {...h} />
      <section class="card">
        <p class="ask">{script?.personal ?? 'Write one true sentence about you, using what you learned today.'}</p>
        <AnswerField value={value} onChange={setValue} onSubmit={submit} label="Your sentence" placeholder="Your sentence, in Spanish" lang="es" disabled={sent} autoFocus />
        <div class="feedback" aria-live="polite">
          {sent
            ? <><p class="ok">That's real Spanish about you.</p>{script ? <p class="why">For comparison: <Es>{script.hook.es}</Es></p> : null}</>
            : value && words < 2 ? <p class="hint">A full sentence: two or three words is plenty.</p> : null}
        </div>
        <div class="actions">
          {sent ? <Continue onClick={onDone} /> : <button class="btn primary" data-primary disabled={words < 2} onClick={submit}>Done</button>}
        </div>
      </section>
    </>
  );
}
