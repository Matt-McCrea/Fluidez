// A typed conversation. The other person speaks (tap for English), the
// learner is told what to do in plain words, types a reply, gets one fix and
// a rewrite with both attempts side by side. The timed rerun plays the same
// scene against a clock and compares with the first run.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { SceneBlock, SceneRerunBlock } from '../../compiler';
import { AnswerField } from '../components/answer';
import { Continue } from '../components/card';
import { Es, Heading, Rich, fmtSeconds } from '../components/text';
import { blockHeading } from '../session/labels';
import { checkTurn, turnOrder, turnSeconds, type SceneTurn, type TurnCheck } from '../session/scene';
import type { BlockProps } from './types';

interface TurnLog { turn: SceneTurn; first: string; firstCheck: TurnCheck; second?: string; secondCheck?: TurnCheck }

function NpcBubble({ turn }: { turn: SceneTurn }) {
  const [en, setEn] = useState(false);
  return (
    <div class="bubble npc">
      <Es>{turn.npc}</Es>
      {en ? <p class="en small">{turn.npcEn}</p> : <button class="btn link small" onClick={() => setEn(true)}>English</button>}
    </div>
  );
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function ScenePlay({ block, run, onDone }: BlockProps<SceneBlock | SceneRerunBlock>) {
  const scene = run.bundle.scenes.get(block.scene);
  const timed = block.kind === 'sceneRerun';
  const turns = useMemo(() => (scene ? turnOrder(scene) : []), [scene]);
  const [i, setI] = useState(0);
  const [log, setLog] = useState<TurnLog[]>([]);
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<'intro' | 'answer' | 'fix' | 'compare' | 'passed' | 'end'>('intro');
  const [left, setLeft] = useState(0);
  const started = useRef(0);
  const total = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const h = blockHeading(block, run.bundle);
  const turn = turns[i];
  const cur = log[i];

  const stopTimer = () => window.clearInterval(timer.current);
  useEffect(() => {
    if (!timed || stage !== 'answer' || !turn) return;
    setLeft(turnSeconds(turn));
    started.current = performance.now();
    timer.current = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return stopTimer;
  }, [i, stage === 'answer']);
  useEffect(() => { if (timed && stage === 'answer' && left <= 0 && started.current && turn) send(true); }, [left]);

  if (!scene || !turns.length) return <><Heading {...h} /><div class="actions"><Continue onClick={onDone} /></div></>;

  function send(timeout = false) {
    if (stage !== 'answer' && stage !== 'fix') return;
    const text = value;
    if (!timeout && !text.trim()) return;
    if (timed) { stopTimer(); total.current += (performance.now() - started.current) / 1000; }
    const c = checkTurn(turn, timeout && !text.trim() ? '' : text);
    if (timeout && !text.trim()) c.reason = 'Time ran out. Here is one way to say it.';
    void run.addWords(0, words(text));
    if (stage === 'answer') {
      setLog([...log, { turn, first: text, firstCheck: c }]);
      setStage(c.pass ? 'passed' : timed ? 'compare' : 'fix');
      setValue('');
    } else {
      const next = [...log];
      next[i] = { ...cur, second: text, secondCheck: c };
      setLog(next);
      setStage('compare');
      setValue('');
    }
  }

  function nextTurn() {
    if (i + 1 >= turns.length) {
      const firstTry = log.filter((l) => l.firstCheck.pass).length;
      if (!timed) run.scenes.set(scene!.id, { firstTry, turns: turns.length, seconds: 0 });
      run.expose(run.bundle.index.scenes.get(scene!.id)?.requires ?? []);
      setStage('end');
    } else { setI(i + 1); setStage('answer'); }
  }

  if (stage === 'intro') {
    return (
      <>
        <Heading {...h} />
        <section class="card">
          <p class="brief"><Rich text={scene.brief} /></p>
          {timed ? <p>Same conversation. This time each reply has a timer. Don't stop to polish; just get it out.</p> : <p>{turns.length} replies. If something's off, you'll get one fix and a second go.</p>}
          <div class="actions"><Continue label={timed ? 'Start' : "Let's go"} onClick={() => setStage('answer')} /></div>
        </section>
      </>
    );
  }

  if (stage === 'end') {
    const firstTry = log.filter((l) => l.firstCheck.pass).length;
    const before = run.scenes.get(scene.id);
    return (
      <>
        <Heading title={timed ? 'Faster this time' : 'You did it'} />
        <section class="card">
          {timed && before
            ? <p>First run: {before.firstTry} of {before.turns} right first time. Now: {firstTry} of {turns.length}, in {fmtSeconds(total.current)}.</p>
            : <p>They understood you. {firstTry} of {turns.length} replies landed first time{firstTry < turns.length ? ', and you fixed the rest' : ''}.</p>}
          <div class="actions"><Continue onClick={onDone} /></div>
        </section>
      </>
    );
  }

  return (
    <>
      <Heading title={h.title} />
      {timed && stage === 'answer' ? <div class="timer" role="timer">{Math.max(0, left)} s</div> : null}
      <div class="chat" aria-label="Conversation">
        {log.slice(0, i).map((l, k) => (
          <div key={k}>
            <div class="bubble npc"><Es>{l.turn.npc}</Es></div>
            <div class="bubble me"><span lang="es">{l.second ?? l.first}</span></div>
          </div>
        ))}
        <NpcBubble key={turn.id} turn={turn} />
        {cur ? <div class="bubble me"><span lang="es">{cur.first || '…'}</span></div> : null}
      </div>
      <p class="intent"><strong>Your move:</strong> {turn.intent}</p>
      {stage === 'answer' || stage === 'fix' ? (
        <>
          {stage === 'fix' ? <div class="feedback" aria-live="polite"><p class="hint">They got the idea. One fix: <Rich text={cur.firstCheck.reason ?? ''} /> Try it once more.</p></div> : null}
          <AnswerField value={value} onChange={setValue} onSubmit={() => send()} label="Your reply" placeholder="Your reply, in Spanish" lang="es" autoFocus />
          <div class="actions">
            <button class="btn primary" data-primary disabled={!value.trim()} onClick={() => send()}>{stage === 'fix' ? 'Send again' : 'Send'}</button>
          </div>
        </>
      ) : stage === 'passed' ? (
        <>
          <div class="feedback" aria-live="polite"><p class="ok">That works.</p></div>
          <div class="actions"><Continue label="Next" onClick={nextTurn} /></div>
        </>
      ) : (
        <>
          <div class="feedback" aria-live="polite">
            {cur.second !== undefined ? (
              <div class="compare">
                <div><p class="small">First try</p><p lang="es">{cur.first}</p></div>
                <div><p class="small">Second try</p><p lang="es">{cur.second}</p></div>
              </div>
            ) : <p class="miss"><Rich text={cur.firstCheck.reason ?? ''} /></p>}
            {cur.secondCheck?.pass ? <p class="ok">Better. That works.</p> : null}
            <p class="why">One way to say it: <Es>{cur.firstCheck.model}</Es></p>
          </div>
          <div class="actions"><Continue label="Next" onClick={nextTurn} /></div>
        </>
      )}
    </>
  );
}
