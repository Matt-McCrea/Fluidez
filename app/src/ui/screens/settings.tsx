// Settings: how long a day's practice is, how hard reviews push, and a reset.
import { useState } from 'preact/hooks';
import type { Tier } from '../../learner';
import { Heading } from '../components/text';
import { useApp } from '../context';

export const TIERS: Array<{ tier: Tier; minutes: number; label: string; note: string }> = [
  { tier: 'minimum', minutes: 10, label: '10 minutes', note: 'Keeps everything fresh. Nothing new.' },
  { tier: 'standard', minutes: 20, label: '20 minutes', note: 'The full lesson. Recommended.' },
  { tier: 'extended', minutes: 40, label: 'Extended (30–45 min)', note: 'The lesson plus extra reading.' },
];

const RETENTION = [
  { v: 0.85, label: 'Relaxed', note: 'Fewer reviews; you\'ll forget a bit more.' },
  { v: 0.9, label: 'Balanced', note: 'Recommended.' },
  { v: 0.95, label: 'Thorough', note: 'More reviews; you\'ll forget less.' },
];

export function Settings() {
  const app = useApp();
  const { learner } = app;
  const [, force] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const s = learner.settings;
  const set = async (patch: Parameters<typeof learner.setSettings>[0]) => {
    learner.setSettings(patch);
    await learner.flush();
    force((n) => n + 1);
    app.refresh();
  };
  return (
    <main class="screen" id="main">
      <Heading title="Settings" />
      <fieldset class="choices">
        <legend>Daily practice</legend>
        {TIERS.map((t) => (
          <label key={t.tier} class={`choice${s.tier === t.tier ? ' on' : ''}`}>
            <input type="radio" name="tier" checked={s.tier === t.tier} onChange={() => void set({ tier: t.tier, minutes: t.minutes })} />
            <span><strong>{t.label}</strong><br /><span class="small">{t.note}</span></span>
          </label>
        ))}
      </fieldset>
      <fieldset class="choices">
        <legend>How much to review</legend>
        {RETENTION.map((r) => (
          <label key={r.v} class={`choice${Math.abs(s.retention - r.v) < 0.001 ? ' on' : ''}`}>
            <input type="radio" name="retention" checked={Math.abs(s.retention - r.v) < 0.001} onChange={() => void set({ retention: r.v })} />
            <span><strong>{r.label}</strong><br /><span class="small">{r.note}</span></span>
          </label>
        ))}
      </fieldset>
      <section class="card danger">
        <p class="ask">Start over</p>
        <p class="small">Deletes your progress on this device. This can't be undone.</p>
        {confirm ? (
          <div class="actions stack">
            <button class="btn danger" data-reset onClick={() => void app.resetAll()}>Yes, delete everything</button>
            <button class="btn quiet" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        ) : <div class="actions"><button class="btn quiet" onClick={() => setConfirm(true)}>Reset progress…</button></div>}
      </section>
      {app.bundle.fixture ? <p class="small">Using sample lessons while the full course is being written.</p> : null}
    </main>
  );
}
