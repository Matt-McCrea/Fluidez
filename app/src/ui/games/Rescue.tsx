// Rescate on screen: the cards that are due, one at a time, with no clock. Each one is a
// review like any other, so the cards are the app's own (CardView) and "I don't know"
// and "Show me" are there as they always are.
import { useRef, useState } from 'preact/hooks';
import { bringRescue, Rescue, rescueCount, RESCUE_MAX, type RescueResult } from '../../games/rescue';
import { cheer, rescueLines, rescueReaction } from '../../games/reactions';
import { CardView, Continue } from '../components/card';
import { Heading, Txt } from '../components/text';
import { useApp } from '../context';
import { withMiss } from '../../compiler/remediate';
import { claimBand } from '../session/freeplay';
import type { Card } from '../session/cards';

export function RescueGame({ onExit }: { onExit: () => void }) {
  const app = useApp();
  const { learner, bundle, ui, now } = app;
  const [phase, setPhase] = useState<'ready' | 'loading' | 'run' | 'over'>('ready');
  const [run, setRun] = useState<Rescue | null>(null);
  const [card, setCard] = useState<Card | undefined>();
  const [shown, setShown] = useState(1);
  const [result, setResult] = useState<RescueResult | null>(null);
  const finished = useRef(false);

  const finish = async (r: Rescue) => {
    if (finished.current) return;
    finished.current = true;
    const res = r.result();
    setResult(res);
    setPhase('over');
    // saving is tried and not waited on to succeed: a store that refuses it leaves the round as it is
    const saves: Promise<unknown>[] = [learner.flush()];
    if (res.of) saves.push(ui.games.addRound({ at: now(), game: 'rescue', deck: 'due', score: res.saved, wrong: res.missed }));
    await Promise.allSettled(saves);
    app.refresh();
  };
  const begin = async () => {
    setPhase('loading');
    finished.current = false;
    await bringRescue(bundle, ui.path.unit).catch(() => undefined);
    const r = new Rescue({ learner, bundle, now, finished: ui.path.unit, retest: (x) => { void ui.setPath({ ...ui.path, remediate: withMiss(ui.path.remediate ?? [], x.node, now()) }); } });
    const c = r.next();
    setRun(r);
    setCard(c);
    setShown(1);
    if (c) setPhase('run'); else void finish(r);
  };

  if (phase === 'ready' || phase === 'loading') {
    const due = rescueCount(learner, now());
    return (
      <main class="screen" id="main">
        <button class="btn link" onClick={onExit}>Back</button>
        <Heading title="Rescate" lead="A short round on the cards that are ready for review." />
        <section class="card" aria-label="How it works">
          <p>{due === 1 ? '1 card is' : `${due} cards are`} ready. This round takes up to {RESCUE_MAX}, the ones most at risk first.</p>
          <p>There is no clock. Each answer is a real review: what you remember waits longer before it comes back, and what you miss comes back sooner. If you don't know one, say so.</p>
          <div class="actions"><button class="btn primary" data-start disabled={phase === 'loading'} onClick={() => void begin()}>{phase === 'loading' ? 'Loading' : 'Start'}</button></div>
        </section>
      </main>
    );
  }
  if (phase === 'over') {
    const res = result;
    const say = res ? rescueReaction(res, cheer(learner)) : {};
    return (
      <main class="screen over" id="main">
        <Heading title="Rescate" lead={res && res.of ? undefined : res && res.stillDue ? 'Nothing answered, so nothing has changed.' : 'Nothing is ready for review right now.'} />
        {res && res.of ? (
          <>
            <p class="big-number" data-score>{res.saved} <span>of {res.of} saved</span></p>
            {say.cheer || say.remark ? <p class="line" data-remark>{say.cheer ? <><Txt t={{ text: say.cheer.es, lang: 'es' }} /> <span class="en">{say.cheer.en}</span> </> : null}{say.remark}</p> : null}
            {rescueLines(res).map((l) => <p class="line" key={l}>{l}</p>)}
            {res.stillDue >= 1 ? <p class="small">{res.stillDue === 1 ? '1 more is' : `${res.stillDue} more are`} ready for review.</p> : null}
          </>
        ) : null}
        <div class="actions">
          {res && res.of && res.stillDue >= 1 ? <Continue label="Another round" onClick={() => void begin()} /> : <Continue label="Done" onClick={onExit} />}
          {res && res.of && res.stillDue >= 1 ? <button class="btn quiet" onClick={onExit}>Done</button> : null}
        </div>
      </main>
    );
  }
  if (!run || !card) return null;
  return (
    <main class="screen game rescue" id="main">
      <p class="ask" data-title>Rescate</p>
      <CardView
        key={card.key} card={card} pos={run.total ? { n: shown, of: run.total } : undefined} next="Next" claim={claimBand(bundle.course, ui.path)}
        onDone={(o) => {
          run.answer(o);
          const c = run.next();
          if (!c) { void finish(run); return; }
          setShown(shown + 1);
          setCard(c);
        }}
      />
      <div class="actions"><button class="btn link" data-stop onClick={() => void finish(run)}>Stop here</button></div>
    </main>
  );
}
