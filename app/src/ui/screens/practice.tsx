// Free practice: pickers (Quick review, Verb workout, Translate) and a timed
// run of cards for any PracticeSpec ("Practise this" lands here with a spec).
// Everything is logged by the Freeplay runner; this screen only shows cards,
// a clock and an end screen.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { rng } from '../../exercises/rng';
import { CardView, Continue } from '../components/card';
import { Heading, undash } from '../components/text';
import { useApp } from '../context';
import type { Card } from '../session/cards';
import { bestKey, DEFAULT_MINUTES, Freeplay, taughtTenses, tenseName, verbsMet } from '../session/freeplay';
import type { PracticeSpec } from '../session/practice-spec';

const clock = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

export function Practice({ spec, onDone }: { spec?: PracticeSpec; onDone: () => void }) {
  const [chosen, setChosen] = useState<PracticeSpec | undefined>(spec);
  if (!chosen) return <Pickers onPick={setChosen} onDone={onDone} />;
  return <Ready spec={chosen} onDone={spec ? onDone : () => setChosen(undefined)} onExit={onDone} />;
}

/** Content the run needs: units up to the learner's current one (or the one asked for). */
async function ensureFor(spec: PracticeSpec, app: ReturnType<typeof useApp>): Promise<void> {
  const { bundle, ui } = app;
  if (spec.kind === 'conjugate') return;
  const last = Math.max(0, bundle.course.units.length - 1);
  await bundle.ensureUnits({ to: Math.min(ui.path.unit, last) });
  if (spec.kind === 'translate' && spec.unit) {
    const at = bundle.course.units.findIndex((u) => u.id === spec.unit);
    if (at >= 0) await bundle.ensureUnits({ from: at, to: at });
  }
}

function Ready({ spec, onDone, onExit }: { spec: PracticeSpec; onDone: () => void; onExit: () => void }) {
  const app = useApp();
  const [ready, setReady] = useState(spec.kind === 'conjugate');
  useEffect(() => {
    let live = true;
    void ensureFor(spec, app).catch(() => undefined).then(() => { if (live) setReady(true); });
    return () => { live = false; };
  }, []);
  if (!ready) return <main class="screen" id="main"><p data-loading>Loading</p></main>;
  return <Run spec={spec} onDone={onDone} onExit={onExit} />;
}

// ---------------------------------------------------------------- pickers

function Pickers({ onPick, onDone }: { onPick: (s: PracticeSpec) => void; onDone: () => void }) {
  const { learner, bundle, now } = useApp();
  const verbs = useMemo(() => verbsMet(learner), []);
  const tenses = useMemo(() => taughtTenses(learner), []);
  const today = learner.day(now());
  const preVerbs = useMemo(() => {
    const todays = verbs.filter((v) => { const n = learner.node(`l:${v}`); return n && learner.day(n.introducedAt) === today; });
    return new Set(todays.length ? todays : verbs.slice(0, 10));
  }, []);
  const [pickedVerbs, setPickedVerbs] = useState<Set<string>>(preVerbs);
  const [pickedTenses, setPickedTenses] = useState<Set<string>>(new Set(tenses));
  const units = useMemo(
    () => bundle.units.filter((u) => (bundle.index.byUnit.get(u.id) ?? []).some((id) => bundle.index.sentences.get(id)?.requires.every((r) => learner.isIntroduced(r)))),
    [],
  );
  const toggle = (set: Set<string>, v: string, put: (s: Set<string>) => void) => {
    const n = new Set(set);
    if (n.has(v)) n.delete(v); else n.add(v);
    put(n);
  };
  const canWorkout = pickedVerbs.size > 0 && pickedTenses.size > 0;
  return (
    <main class="screen" id="main">
      <button class="btn link" onClick={onDone}>Back</button>
      <Heading title="More practice" lead="Pick something. None of it changes today's plan." />

      <section class="card" aria-labelledby="pq-title">
        <p class="ask" id="pq-title">Quick review</p>
        <p>The things you know best are the first to fade. Five minutes on the ones most at risk.</p>
        <div class="actions"><button class="btn primary" data-quick onClick={() => onPick({ kind: 'quickReview' })}>Start</button></div>
      </section>

      <section class="card" aria-labelledby="pv-title">
        <p class="ask" id="pv-title">Verb workout</p>
        {verbs.length && tenses.length ? (
          <>
            <fieldset class="picks"><legend>Verbs</legend>
              {verbs.map((v) => (
                <label key={v} class="pick"><input type="checkbox" checked={pickedVerbs.has(v)} onChange={() => toggle(pickedVerbs, v, setPickedVerbs)} /> <span lang="es">{v}</span></label>
              ))}
            </fieldset>
            <fieldset class="picks"><legend>Times</legend>
              {tenses.map((t) => (
                <label key={t} class="pick"><input type="checkbox" checked={pickedTenses.has(t)} onChange={() => toggle(pickedTenses, t, setPickedTenses)} /> {tenseName(t)}</label>
              ))}
            </fieldset>
            <div class="actions">
              <button class="btn primary" data-workout disabled={!canWorkout}
                onClick={() => onPick({ kind: 'conjugate', verbs: [...pickedVerbs], tenses: [...pickedTenses] })}>Start</button>
            </div>
          </>
        ) : <p>Verbs show up here once you have met a few and been taught how to use them.</p>}
      </section>

      <section class="card" aria-labelledby="pt-title">
        <p class="ask" id="pt-title">Translate</p>
        <p>Type sentences in Spanish from the English, using only what you have met.</p>
        <div class="actions">
          <button class="btn primary" data-translate-all onClick={() => onPick({ kind: 'translate' })}>Everything so far</button>
          {units.map((u) => <button key={u.id} class="btn quiet" onClick={() => onPick({ kind: 'translate', unit: u.id })}>{undash(u.title)}</button>)}
        </div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------- a run

function Run({ spec, onDone, onExit }: { spec: PracticeSpec; onDone: () => void; onExit: () => void }) {
  const app = useApp();
  const { learner, bundle, ui, now } = app;
  const run = useMemo(() => new Freeplay(spec, { learner, bundle, now, rng: rng(`free:${learner.sessionIndex}:${now()}`) }), []);
  const total = run.minutes * 60 || DEFAULT_MINUTES[spec.kind] * 60;
  const startedAt = useRef(now());
  const [left, setLeft] = useState(total);
  const [card, setCard] = useState<Card | undefined>(() => run.next());
  const [shown, setShown] = useState(1);
  const [over, setOver] = useState(!card);
  const [best, setBest] = useState<{ was: number; now: number } | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    if (over) return;
    const t = window.setInterval(() => setLeft(Math.max(0, total - Math.round((now() - startedAt.current) / 1000))), 1000);
    return () => window.clearInterval(t);
  }, [over]);

  const finish = async () => {
    if (finished.current) return;
    finished.current = true;
    setOver(true);
    if (spec.kind === 'conjugate' || spec.kind === 'translate') {
      const key = bestKey(spec);
      const was = ui.state.bests[key] ?? 0;
      if (run.right > was) {
        setBest({ was, now: run.right });
        await ui.update((s) => { s.bests[key] = run.right; });
      }
    }
    await learner.flush();
    app.refresh();
  };
  useEffect(() => { if (over && !finished.current) void finish(); }, [over]);

  if (over) {
    const live = run.answered;
    return (
      <main class="screen" id="main">
        <Heading title={live ? 'Done' : 'Nothing to practise yet'} lead={spec.title} />
        {live ? (
          <>
            <p class="big-number" data-score>{run.right} <span>of {live} right first time</span></p>
            {best ? <p>{best.was ? `A new best. The one before was ${best.was}.` : 'That is your first score to beat.'}</p> : null}
            {spec.kind === 'quickReview' ? <p>Those reviews are on your schedule now.</p> : <p>This was practice only. Your review schedule is unchanged.</p>}
          </>
        ) : <p>Come back after a lesson or two.</p>}
        <div class="actions">
          <Continue label="Done" onClick={onExit} />
          {spec.kind === 'nodes' ? null : <button class="btn quiet" onClick={onDone}>Pick something else</button>}
        </div>
      </main>
    );
  }
  if (!card) return null;
  return (
    <main class="screen" id="main">
      {spec.title ? <p class="ask" data-title>{spec.title}</p> : null}
      <div class="timer" role="timer" aria-live="off" data-clock>{clock(left)}</div>
      <CardView
        key={card.key} card={card} pos={run.total ? { n: shown, of: run.total } : undefined} next="Next"
        onDone={(o) => {
          run.answer(o);
          const out = left <= 0 || total - Math.round((now() - startedAt.current) / 1000) <= 0;
          const c = out ? undefined : run.next();
          if (!c) { setLeft(Math.max(0, left)); void finish(); return; }
          setShown(shown + 1);
          setCard(c);
        }}
      />
      <div class="actions"><button class="btn link" onClick={() => void finish()}>Finish now</button></div>
    </main>
  );
}
