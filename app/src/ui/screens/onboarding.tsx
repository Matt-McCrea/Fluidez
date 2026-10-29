// First run: why you're here, how long a day is, and where to start
// (from zero, or a short read-and-pick probe that picks a starting week).
import { useMemo, useState } from 'preact/hooks';
import type { Tier } from '../../learner';
import { Continue } from '../components/card';
import { Es, Heading } from '../components/text';
import { useApp } from '../context';
import { applyPlacement, contentProbe, placeFrom, type ProbeSource } from '../session/placement';
import type { Goal } from '../store/ui';
import { TIERS } from './settings';

const GOALS: Array<{ goal: Goal; label: string }> = [
  { goal: 'travel', label: 'Travel in Latin America' },
  { goal: 'people', label: 'Talk with friends or family' },
  { goal: 'work', label: 'Use it at work' },
  { goal: 'me', label: 'Just for me' },
];

export function Onboarding({ onDone, probe }: { onDone: () => void; probe?: ProbeSource }) {
  const app = useApp();
  const [step, setStep] = useState<'welcome' | 'goal' | 'time' | 'start' | 'probe' | 'placed'>('welcome');
  const [goal, setGoal] = useState<Goal | undefined>();
  const [tier, setTier] = useState<Tier>('standard');
  const [placed, setPlaced] = useState(0);

  const finish = async (unit: number) => {
    const t = TIERS.find((x) => x.tier === tier)!;
    app.learner.setSettings({ tier: t.tier, minutes: t.minutes });
    const path = applyPlacement(app.learner, app.bundle, unit);
    await app.ui.setPath(path);
    await app.ui.update((s) => { s.onboarded = true; s.goal = goal; s.placedAt = unit; });
    await app.learner.flush();
    onDone();
  };

  switch (step) {
    case 'welcome':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="Spanish you can use" lead="A short lesson every day: remember, learn one thing, then use it for real." />
          <Es block><span class="big">Hola. Me llamo Tomás. Soy de Toronto.</span></Es>
          <p class="en">Hi. My name's Tomás. I'm from Toronto.</p>
          <p>By the end of your first week, you'll be able to say that about yourself, and ask someone else.</p>
          <div class="actions"><Continue label="Let's start" onClick={() => setStep('goal')} /></div>
        </main>
      );
    case 'goal':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="What's it for?" lead="It shapes the examples you'll see first. You can't get this wrong." />
          <div class="options" role="radiogroup" aria-label="Your goal">
            {GOALS.map((g) => (
              <button key={g.goal} role="radio" aria-checked={goal === g.goal} class={`option${goal === g.goal ? ' on' : ''}`} onClick={() => setGoal(g.goal)}>{g.label}</button>
            ))}
          </div>
          <div class="actions"><button class="btn primary" data-primary disabled={!goal} onClick={() => setStep('time')}>Next</button></div>
        </main>
      );
    case 'time':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="How long a day?" lead="Little and often beats long and rare. You can change this any time." />
          <div class="options" role="radiogroup" aria-label="Daily practice">
            {TIERS.map((t) => (
              <button key={t.tier} role="radio" aria-checked={tier === t.tier} class={`option${tier === t.tier ? ' on' : ''}`} onClick={() => setTier(t.tier)}>
                <strong>{t.label}</strong><br /><span class="small">{t.note}</span>
              </button>
            ))}
          </div>
          <div class="actions"><button class="btn primary" data-primary onClick={() => setStep('start')}>Next</button></div>
        </main>
      );
    case 'start':
      return (
        <main class="screen onboarding" id="main">
          <Heading title="Where should we start?" />
          <div class="options">
            <button class="option" data-zero onClick={() => void finish(0)}><strong>Start from zero</strong><br /><span class="small">Never studied, or it's been years.</span></button>
            <button class="option" data-some onClick={() => setStep('probe')}><strong>I know some Spanish</strong><br /><span class="small">A quick check, about two minutes.</span></button>
          </div>
        </main>
      );
    case 'probe':
      return <Probe source={probe ?? contentProbe(app.bundle, app.ui.state.learnerId)} onResult={(u) => { setPlaced(u); setStep('placed'); }} />;
    case 'placed': {
      const unit = app.bundle.course.units[placed];
      return (
        <main class="screen onboarding" id="main">
          <Heading title={placed ? 'You know a fair bit' : "Let's start at the start"} />
          {placed && unit
            ? <p>You'll start at week {placed + 1}: <strong>{unit.title}</strong>. Everything before it counts as known, and comes back in reviews to make sure.</p>
            : <p>The first weeks go quickly if you already know some of it, and the reviews will skip what you know.</p>}
          <div class="actions"><Continue label="Begin" onClick={() => void finish(placed)} /></div>
        </main>
      );
    }
  }
}

function Probe({ source, onResult }: { source: ProbeSource; onResult: (unit: number) => void }) {
  const app = useApp();
  const items = useMemo(() => source.items(15), [source]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  if (!items.length) {
    return (
      <main class="screen onboarding" id="main">
        <Heading title="Quick check" />
        <p>There isn't enough course content on this device to check you yet, so we'll start at the beginning. The early lessons move fast.</p>
        <div class="actions"><Continue label="OK" onClick={() => onResult(0)} /></div>
      </main>
    );
  }
  const it = items[i];
  const pick = (k: number) => {
    const next = [...answers, k === it.answer];
    setAnswers(next);
    if (i + 1 >= items.length) onResult(placeFrom(items, next, app.bundle.course.units.length));
    else setI(i + 1);
  };
  return (
    <main class="screen onboarding" id="main">
      <Heading title="Quick check" lead="Pick what it means. Not sure? Skip it; that's useful too." />
      <p class="pos">{i + 1} of {items.length}</p>
      <section class="card" key={it.id}>
        <Es block><span class="big">{it.es}</span></Es>
        <div class="options">
          {it.options.map((o, k) => <button key={k} class="option" data-option={k} onClick={() => pick(k)}>{o}</button>)}
          <button class="btn quiet" onClick={() => pick(-1)}>I don't know</button>
        </div>
      </section>
    </main>
  );
}
