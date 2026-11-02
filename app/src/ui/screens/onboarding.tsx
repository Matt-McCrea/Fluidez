// First run: what Fluidez is and what this unit gets you, the learner's goal,
// and where to start (the first lesson, or a short adaptive check that picks
// a starting unit). There is no lesson-length choice: every session is the
// standard one.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Continue } from '../components/card';
import { Heading, Txt, undash } from '../components/text';
import { useApp } from '../context';
import { applyPlacement, contentProbe, owedNodes, type ProbeSource } from '../session/placement';
import type { Band } from '../../content/schema';
import type { Goal } from '../store/ui';

const LEVELS: Array<{ band: Band; label: string; note: string }> = [
  { band: 'A1', label: 'Beginner', note: 'A few words' },
  { band: 'A2', label: 'A bit', note: 'I can order and introduce myself' },
  { band: 'B1', label: 'Intermediate', note: 'I can tell a story in the past' },
  { band: 'B2', label: 'Advanced', note: 'I read and argue in Spanish' },
];

const BAND_ORDER: readonly string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const GOALS: Array<{ goal: Goal; label: string; note: string }> = [
  { goal: 'travel', label: 'Travel', note: 'Getting around, ordering, meeting people on the way' },
  { goal: 'people', label: 'Friends and family', note: 'Talking with people you care about' },
  { goal: 'work', label: 'Work', note: 'Colleagues, clients and meetings' },
  { goal: 'me', label: 'Personal interest', note: 'For the pleasure of it' },
];

export function Onboarding({ onDone, probe }: { onDone: () => void; probe?: ProbeSource }) {
  const app = useApp();
  const [step, setStep] = useState<'welcome' | 'goal' | 'start' | 'howMuch' | 'probe' | 'placed'>('welcome');
  const [from, setFrom] = useState<Band>('A1');
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState<Goal | undefined>();
  const [placed, setPlaced] = useState(0);
  const [owed, setOwed] = useState<string[]>([]);

  const finish = async (unit: number) => {
    app.learner.setSettings({ tier: 'standard' });
    const path = applyPlacement(app.learner, app.bundle, unit, app.now(), owedNodes(app.bundle, owed));
    // each write is tried and none is waited on to succeed: a store that refuses them must not keep the learner here (the work stays in memory and saving is retried)
    await Promise.allSettled([
      app.ui.setPath(path),
      app.ui.update((s) => { s.onboarded = true; s.goal = goal; s.placedAt = unit; }),
      app.learner.flush(),
    ]);
    onDone();
  };

  /** Bring in the course content the check will climb through: one band below the claimed one, up to one above. */
  const chooseLevel = async (band: Band) => {
    setFrom(band);
    setLoading(true);
    try {
      const at = BAND_ORDER.indexOf(band);
      const units = app.bundle.course.units;
      const inBands = (lo: number, hi: number) => units.map((u, i) => (BAND_ORDER.indexOf(u.band ?? 'A1') >= lo && BAND_ORDER.indexOf(u.band ?? 'A1') <= hi ? i : -1)).filter((i) => i >= 0);
      const idx = inBands(Math.max(0, at - 1), at + 1);
      if (idx.length) await app.bundle.ensureUnits({ from: idx[0], to: idx[idx.length - 1] });
    } catch {
      // offline: the check runs on what is already here
    }
    setLoading(false);
    setStep('probe');
  };

  if (loading) return <main class="screen onboarding" id="main"><p data-loading>Loading</p></main>;

  switch (step) {
    case 'welcome':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="Welcome to Fluidez" lead="Spanish for real conversations, about 20 minutes a day." />
          <p class="promise">By the end of this unit you'll be able to introduce yourself, say where you're from and what you do, in Spanish.</p>
          <ul class="welcome-points">
            <li>Each day starts with a quick look back at what you know.</li>
            <li>Then something new, and right away you use it.</li>
            <li>A story set in Bogotá runs through the course.</li>
          </ul>
          <div class="actions"><Continue label="Get started" onClick={() => setStep('goal')} /></div>
        </main>
      );
    case 'goal':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="What's your goal?" lead="So we can tune the examples to you." />
          <div class="options" role="radiogroup" aria-label="Your goal">
            {GOALS.map((g) => (
              <button key={g.goal} role="radio" aria-checked={goal === g.goal} aria-label={g.label} class={`option${goal === g.goal ? ' on' : ''}`} onClick={() => setGoal(g.goal)}>
                <strong>{g.label}</strong><br /><span class="small">{g.note}</span>
              </button>
            ))}
          </div>
          <div class="actions"><button class="btn primary" data-primary disabled={!goal} onClick={() => setStep('start')}>Next</button></div>
        </main>
      );
    case 'start':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="Have you learned any Spanish before?" />
          <div class="options">
            <button class="option" data-zero onClick={() => void finish(0)}><strong>No, I'm new to it</strong><br /><span class="small">Start with the first lesson.</span></button>
            <button class="option" data-some onClick={() => setStep('howMuch')}><strong>Yes, some</strong><br /><span class="small">A short check, about three minutes, so you can skip what you already know.</span></button>
          </div>
        </main>
      );
    case 'howMuch':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="How much Spanish do you have?" lead="Pick the closest. The check will find your real level from there." />
          <div class="options">
            {LEVELS.map((l) => (
              <button key={l.band} class="option" data-level={l.band} onClick={() => void chooseLevel(l.band)}><strong>{l.label}</strong><br /><span class="small">{l.note}</span></button>
            ))}
          </div>
        </main>
      );
    case 'probe':
      return <Probe source={probe ?? contentProbe(app.bundle, app.ui.state.learnerId, { start: from })} onResult={(u, o) => { setPlaced(u); setOwed(o ?? []); setStep('placed'); }} />;
    case 'placed': {
      const unit = app.bundle.course.units[placed];
      return (
        <main class="screen onboarding" id="main">
          {placed && unit ? (
            <>
              <Heading title={`You'll start at unit ${placed + 1}`} lead={undash(unit.title)} />
              <p>The units before it count as known. Their words and phrases will come back now and then as you go, to make sure they've stuck.</p>
            </>
          ) : (
            <>
              <Heading title="We'll start at the beginning" />
              <p>The first lessons go quickly if some of it is familiar, and anything you already know won't come back often.</p>
            </>
          )}
          <div class="actions"><Continue label="Start learning" onClick={() => void finish(placed)} /></div>
        </main>
      );
    }
  }
}

function Probe({ source, onResult }: { source: ProbeSource; onResult: (unit: number, owed?: string[]) => void }) {
  const probe = useMemo(() => source.start(), [source]);
  const [, setTick] = useState(0);
  const it = probe.next();
  useEffect(() => { if (!it && probe.asked > 0) onResult(probe.result(), probe.owed?.()); });
  if (!it) {
    if (probe.asked === 0) {
      return (
        <main class="screen onboarding" id="main">
          <Heading title="Quick check" />
          <p>There isn't enough of the course on this device to check your level yet, so we'll start at the beginning. The early lessons move quickly.</p>
          <div class="actions"><Continue label="OK" onClick={() => onResult(0)} /></div>
        </main>
      );
    }
    return null;
  }
  const pick = (k: number) => {
    probe.answer(k === it.answer);
    setTick((t) => t + 1);
  };
  return (
    <main class="screen onboarding" id="main">
      <Heading title="Quick check" lead="Pick the answer that fits. If you're not sure, say so rather than guess." />
      <p class="pos">{Math.min(probe.asked + 1, probe.max)} of about {probe.max}</p>
      <section class="card" key={it.id}>
        <p class="ask">{it.ask}</p>
        <Txt t={it.prompt} block big />
        {it.sub ? <Txt t={it.sub} block /> : null}
        <div class="options">
          {it.options.map((o, k) => <button key={k} class="option" lang={o.lang} data-option={k} onClick={() => pick(k)}><span class={o.lang === 'es' ? 'es' : ''}>{o.text}</span></button>)}
          <button class="btn quiet" data-dontknow onClick={() => pick(-1)}>I don't know</button>
        </div>
      </section>
    </main>
  );
}
