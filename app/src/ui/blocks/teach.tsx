// Teaching blocks: new words and phrases (present three, then 3 to 5
// retrievals each, every round a different format, spaced a few cards apart), a new pattern (hook → examples → rule → read and pick →
// your turn → pitfalls), the drill opener (recall before the reminder) and
// the personal sentence.
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { LearnBlock, PersonalBlock, RuleRecallBlock, TeachBlock } from '../../compiler';
import type { TeachingScript } from '../../content/schema';
import { checkPersonal } from '../../check/personal';
import { LEARNING_STEPS_MAX } from '../../learner';
import { AnswerField } from '../components/answer';
import { CardRun, CardView, Continue } from '../components/card';
import { Es, Heading, Paras, Rich, undash } from '../components/text';
import { learnRetrieval, SAY, scriptCard, sentenceCheck, type Card } from '../session/cards';
import { LearnQueue, teachOrder } from '../session/order';
import { blockHeading } from '../session/labels';
import { exampleGroups, nodeWords, restText, ruleLayers, spotFeedback, spotIt, splitVariants } from '../session/teachflow';
import { bundleLexicon } from '../session/scene';
import type { BlockProps } from './types';

// ---------------------------------------------------------------- learn

export function Learn({ block, run, onDone }: BlockProps<LearnBlock>) {
  const q = useMemo(() => new LearnQueue(block.items.length), [block]);
  const [, setTick] = useState(0);
  const h = blockHeading(block, run.bundle);
  // out of time: nothing new is presented; what was presented gets one last ask
  if (q.current?.kind === 'present' && run.outOfTimeFor(block)) {
    run.notTaught(q.stopNew().map((i) => block.items[i].node));
  }
  const step = q.current;
  useEffect(() => { if (step?.kind === 'present') run.present(block.items[step.i].node, block.items[step.i].productive); }, [q.pos, step?.kind]);
  if (!block.items.length || !step) {
    return <><Heading {...h} /><p>All set. You've got these.</p><div class="actions"><Continue onClick={onDone} /></div></>;
  }
  const item = block.items[step.i];
  const advance = (again = false) => {
    q.next(again && !run.outOfTimeFor(block));
    if (q.done) onDone(); else setTick((t) => t + 1);
  };
  if (step.kind === 'present') {
    const segs = run.bundle.segments(item.node);
    const node = run.bundle.node(item.node);
    const ex = run.bundle.sentence(item.example);
    // the whole exchange, when the pairs above do not cover it ("— Bien, gracias, ¿y tú?")
    const frags = (node?.es ?? '').split(/\s*[/\u2014\u2013]\s*/).map((x) => x.trim()).filter(Boolean);
    const covered = (f: string) => segs.some((x) => x.es === f || x.accept.includes(f) || f.includes(x.es));
    const more = node?.es && segs.length && !frags.every(covered) ? node : undefined;
    return (
      <>
        {q.pos === 0 ? <Heading {...h} /> : null}
        <section class="card present" key={`p${q.pos}`}>
          <p class="ask">New</p>
          <Variants segs={segs} fallback={undash(run.bundle.title(item.node))} more={more} />
          {ex ? <div class="example"><p class="small">In a sentence</p><Es block>{ex.es}</Es><p class="en"><Rich text={ex.en} /></p></div> : null}
          <div class="actions"><Continue label="Got it" onClick={() => advance()} /></div>
        </section>
      </>
    );
  }
  const card: Card = learnRetrieval(item, run.bundle, step.round);
  return (
    <CardView
      key={`a${q.pos}`} card={card}
      onDone={(o) => {
        let done = true;
        if (item.scoring === 'learning') done = run.learningStep(item.node, o, item.credit, item.productive);
        else run.score(item, o);
        advance(!done && step.round + 1 < LEARNING_STEPS_MAX);
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
      if (p === 'readAndPick') return teachOrder(block.items).first.length > 0;
      if (p === 'yourTurn') return teachOrder(block.items).mixed.length > 0;
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
        {node?.es ? <div class="pair"><Es block>{node.es}</Es>{node.en ? <p class="en">{undash(node.en)}</p> : null}</div> : null}
        {ex.map((s) => <div class="pair" key={s!.id}><Es block>{s!.es}</Es><p class="en"><Rich text={s!.en} /></p></div>)}
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

type Seg = { es: string; en: string };

/** The word or phrase being taught: one variant large, the others a tap away under "Also". */
function Variants({ segs, fallback, more }: { segs: Seg[]; fallback: string; more?: { es?: string; en?: string } }) {
  const [open, setOpen] = useState(false);
  const { first, also } = splitVariants(segs);
  const whole = more ? <div class="example"><p class="small">The whole exchange</p><Es block>{more.es!}</Es>{more.en ? <p class="en"><Rich text={more.en} /></p> : null}</div> : null;
  if (!first) return <p class="big">{fallback}</p>;
  return (
    <>
      <div class="pair"><Es block><span class="big">{first.es}</span></Es><p class="en">{first.en}</p></div>
      {also.length && !open ? (
        <p class="also"><button type="button" class="linkish" aria-expanded="false" onClick={() => setOpen(true)}>Also: {also.map((x) => x.es).join(', ')}</button></p>
      ) : null}
      {open ? also.map((x, k) => <div class="pair" key={k}><Es block><span class="big">{x.es}</span></Es><p class="en">{x.en}</p></div>) : null}
      {!also.length || open ? whole : null}
    </>
  );
}

/** Examples a few at a time, with a one-tap "spot it" between the groups. */
function Examples({ script, node, onDone }: { script: TeachingScript; node?: { es?: string; forms?: Seg[] }; onDone: () => void }) {
  const groups = useMemo(() => exampleGroups(script.examples), [script]);
  const nw = useMemo(() => nodeWords(node?.es, node?.forms), [node]);
  const [g, setG] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const group = groups[g] ?? [];
  const last = g + 1 >= groups.length;
  const pick = useMemo(() => (last ? null : spotIt(group, nw)), [g]);
  const go = () => { setPicked(null); if (last) onDone(); else setG(g + 1); };
  return (
    <section class="card" key={g}>
      <p class="ask">{g === 0 ? 'Read these. Spot what they have in common.' : 'A few more.'}</p>
      {group.map((e, i) => <div class="pair" key={i}><Es block>{e.es}</Es><p class="en"><Rich text={e.en} /></p></div>)}
      {pick ? (
        <div class="spot">
          <p class="small">{pick.prompt}</p>
          <div class="options">
            {pick.options.map((o, i) => (
              <button type="button" key={i} class={`btn${picked !== null && i === pick.answer ? ' primary' : ''}`} disabled={picked !== null} onClick={() => setPicked(i)}><Es>{o}</Es></button>
            ))}
          </div>
          <div class="feedback" aria-live="polite">{picked !== null ? <p class="why">{spotFeedback(pick, picked)}</p> : null}</div>
        </div>
      ) : null}
      <div class="actions">
        {last ? <Continue label="What's the trick?" onClick={go} /> : !pick || picked !== null ? <Continue label="Next" onClick={go} /> : null}
      </div>
    </section>
  );
}

/** The trick first; the why behind a tap. */
function RuleCard({ script, onDone }: { script: TeachingScript; onDone: () => void }) {
  const { trick, rest } = ruleLayers(script.rule);
  const [open, setOpen] = useState(false);
  const why = restText(rest);
  return (
    <section class="card rule">
      <p class="ask">Here's the trick</p>
      <div class="trick"><Paras text={trick} /></div>
      {why && !open ? <p class="also"><button type="button" class="linkish" aria-expanded="false" onClick={() => setOpen(true)}>Why?</button></p> : null}
      {open ? <div class="why-more"><Paras text={why} /></div> : null}
      {(open || !why) && script.soundTip ? <p class="tip"><strong>Sound tip:</strong> <Rich text={script.soundTip} /></p> : null}
      {(open || !why) && script.smallPrint ? <p class="small-print"><Rich text={script.smallPrint} /></p> : null}
      <div class="actions"><Continue label="Let's try it" onClick={onDone} /></div>
    </section>
  );
}

/** One slip at a time. */
function Pitfalls({ script, onDone }: { script: TeachingScript; onDone: () => void }) {
  const [i, setI] = useState(0);
  const p = script.pitfalls[i];
  const last = i + 1 >= script.pitfalls.length;
  return (
    <section class="card" key={i}>
      <p class="ask">Almost everyone slips here at first</p>
      <div class="pitfall">
        <p><s class="es" lang="es">{undash(p.wrong)}</s> → <Es>{p.right}</Es></p>
        <p class="why"><Rich text={p.why} /></p>
      </div>
      <div class="actions"><Continue label={last ? 'Got it' : 'Next'} onClick={() => (last ? onDone() : setI(i + 1))} /></div>
    </section>
  );
}

function TeachPhase({ phase, script, block, run, onDone }: { phase: Phase; script: TeachingScript; block: TeachBlock; run: BlockProps['run']; onDone: () => void }) {
  switch (phase) {
    case 'hook':
      return (
        <section class="card">
          <p class="lead">Today: {script.hook.line.replace(/^Today:?\s*/i, '')}</p>
          <Es block><span class="big">{script.hook.es}</span></Es>
          <p class="en"><Rich text={script.hook.en} /></p>
          <div class="actions"><Continue label="Show me" onClick={onDone} /></div>
        </section>
      );
    case 'examples':
      return <Examples script={script} node={run.bundle.node(block.node)} onDone={onDone} />;
    case 'rule':
      return <RuleCard script={script} onDone={onDone} />;
    case 'readAndPick':
    case 'yourTurn': {
      // a few to read first, then writing it, with the rest of the reading woven in
      const order = teachOrder(block.items);
      const items = (phase === 'readAndPick' ? order.first : order.mixed)
        .filter((it) => !!scriptCard(it, script));
      const cards = items.map((it) => scriptCard(it, script)!);
      return (
        <>
          <p class="handoff">{phase === 'readAndPick' ? 'Read and pick. Look closely at the small words.' : "Now try writing it. There's some reading in between."}</p>
          <CardRun cards={cards} onAnswer={(i, o) => run.score(items[i], o)} onDone={onDone} />
        </>
      );
    }
    case 'pitfalls':
      return <Pitfalls script={script} onDone={onDone} />;
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
    type: 'type', key: `rr:${block.node}`, ask: SAY, prompt: { text: target.en, lang: 'en' },
    answerLang: 'es', placeholder: 'Type it in Spanish', retry: false, check: sentenceCheck({ es: target.es, en: target.en, accept: [] }),
    why: 'Here is the reminder.',
  };
  if (stage === 'try') return <><Heading {...h} /><CardView card={card} next="Show the reminder" onDone={() => setStage('remind')} /></>;
  return (
    <>
      <Heading title="Quick reminder" />
      <section class="card rule">
        {script ? <Paras text={ruleLayers(script.rule).trick} /> : <p>{undash(run.bundle.title(block.node))}</p>}
        {(script?.examples ?? []).slice(0, 2).map((e, i) => <div class="pair" key={i}><Es block>{e.es}</Es><p class="en"><Rich text={e.en} /></p></div>)}
        <div class="actions"><Continue label="Let's practise" onClick={onDone} /></div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------- personal sentence

export function Personal({ block, run, onDone }: BlockProps<PersonalBlock>) {
  const script = run.bundle.scripts.get(block.node);
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [sent, setSent] = useState<null | 'pass' | 'shown'>(null);
  const [hint, setHint] = useState('');
  const h = blockHeading(block, run.bundle);
  const words = value.trim().split(/\s+/).filter(Boolean).length;
  const submit = () => {
    if (words < 2 || sent) return;
    const r = checkPersonal(value, { node: block.node, script, nodes: run.bundle.course.nodes, lexicon: bundleLexicon(run.bundle) });
    const done = (how: 'pass' | 'shown') => { setSent(how); void run.addWords(0, words); };
    if (r.pass) return done('pass');
    if (tries >= 1) return done('shown');
    setTries(1);
    setHint(r.hint ?? '');
  };
  return (
    <>
      <Heading {...h} />
      <section class="card">
        <p class="ask">{script?.personal ?? 'Write one true sentence about you, using what you learned today.'}</p>
        <AnswerField value={value} onChange={setValue} onSubmit={submit} label="Your sentence" placeholder="Your sentence, in Spanish" lang="es" disabled={!!sent} autoFocus />
        <div class="feedback" aria-live="polite">
          {sent === 'pass'
            ? <><p class="ok">The form is right. I can't judge the meaning, so here's one for comparison:</p>{script ? <p class="why"><Es>{script.hook.es}</Es></p> : null}</>
            : sent === 'shown'
              ? <><p class="hint">{hint ? <><Rich text={hint} />{' '}</> : null}Here's one way:</p>{script ? <p class="why"><Es>{script.hook.es}</Es></p> : null}</>
              : tries ? <p class="hint"><Rich text={hint} /> Change it and try once more.</p>
                : value && words < 2 ? <p class="hint">A full sentence: two or three words is plenty.</p> : null}
        </div>
        <div class="actions">
          {sent ? <Continue onClick={onDone} /> : <button class="btn primary" data-primary disabled={words < 2} onClick={submit}>{tries ? 'Check again' : 'Done'}</button>}
        </div>
      </section>
    </>
  );
}
