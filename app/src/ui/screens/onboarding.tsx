// First run: what Fluidez is and what this week gets you, the learner's goal,
// and where to start (the first lesson, or a short adaptive check that picks
// a starting week). There is no lesson-length choice: every session is the
// standard one.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { Continue } from '../components/card';
import { Heading, Txt, undash } from '../components/text';
import { useApp } from '../context';
import { applyPlacement, contentProbe, type ProbeSource } from '../session/placement';
import type { Goal } from '../store/ui';

const GOALS: Array<{ goal: Goal; label: string; note: string }> = [
  { goal: 'travel', label: 'Travel', note: 'Getting around, ordering, meeting people on the way' },
  { goal: 'people', label: 'Friends and family', note: 'Talking with people you care about' },
  { goal: 'work', label: 'Work', note: 'Colleagues, clients and meetings' },
  { goal: 'me', label: 'Personal interest', note: 'For the pleasure of it' },
];

export function Onboarding({ onDone, probe }: { onDone: () => void; probe?: ProbeSource }) {
  const app = useApp();
  const [step, setStep] = useState<'welcome' | 'goal' | 'start' | 'probe' | 'placed'>('welcome');
  const [goal, setGoal] = useState<Goal | undefined>();
  const [placed, setPlaced] = useState(0);

  const finish = async (unit: number) => {
    app.learner.setSettings({ tier: 'standard' });
    const path = applyPlacement(app.learner, app.bundle, unit, app.now());
    await app.ui.setPath(path);
    await app.ui.update((s) => { s.onboarded = true; s.goal = goal; s.placedAt = unit; });
    await app.learner.flush();
    onDone();
  };

  switch (step) {
    case 'welcome':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="Welcome to Fluidez" lead="Spanish for real conversations, about 20 minutes a day." />
          <p class="promise">By the end of this week you'll be able to introduce yourself, say where you're from and what you do, in Spanish.</p>
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
            <button class="option" data-some onClick={() => setStep('probe')}><strong>Yes, some</strong><br /><span class="small">A short check, about three minutes, so you can skip what you already know.</span></button>
          </div>
        </main>
      );
    case 'probe':
      return <Probe source={probe ?? contentProbe(app.bundle, app.ui.state.learnerId)} onResult={(u) => { setPlaced(u); setStep('placed'); }} />;
    case 'placed': {
      const unit = app.bundle.course.units[placed];
      return (
        <main class="screen onboarding" id="main">
          {placed && unit ? (
            <>
              <Heading title={`You'll start at week ${placed + 1}`} lead={undash(unit.title)} />
              <p>The weeks before it count as known. Their words and phrases will come back now and then over the next few weeks, to make sure they've stuck.</p>
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

function Probe({ source, onResult }: { source: ProbeSource; onResult: (unit: number) => void }) {
  const probe = useMemo(() => source.start(), [source]);
  const [, setTick] = useState(0);
  const it = probe.next();
  useEffect(() => { if (!it && probe.asked > 0) onResult(probe.result()); });
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
