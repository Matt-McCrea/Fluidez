// Weak spots: everything that has tripped you lately, with a workout for each.
import { useMemo } from 'preact/hooks';
import { recentMisses, weakSpots, type RecentMiss } from '../../learner/weak';
import { Heading, undash } from '../components/text';
import { useApp } from '../context';
import { verbsMet } from '../session/freeplay';
import type { PracticeSpec } from '../session/practice-spec';

const DAY_MS = 86_400_000;

export function ago(at: number, now: number): string {
  const d = Math.floor((now - at) / DAY_MS);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
}

/** One line per sentence, newest first: the same sentence missed again, or once for each node it credits, is one line. */
export function distinctMisses(misses: readonly RecentMiss[]): RecentMiss[] {
  const seen = new Set<string>();
  return misses.filter((m) => {
    const key = m.sentence ?? m.node;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function Weak({ onPractise, onBack }: { onPractise: (spec: PracticeSpec) => void; onBack: () => void }) {
  const app = useApp();
  const { learner, bundle } = app;
  const now = app.now();
  const { spots, misses } = useMemo(() => {
    try {
      const look = (id: string) => bundle.node(id);
      return {
        spots: weakSpots(learner.events(), look, {
          now, max: 12, metVerbs: verbsMet(learner), sentenceEs: (id) => bundle.sentence(id)?.es, introduced: (id) => learner.isIntroduced(id),
        }),
        misses: distinctMisses(recentMisses(learner.events(), look, { now, n: 60 })).slice(0, 15),
      };
    } catch { return { spots: [], misses: [] }; }
  }, [learner.sessionIndex]);

  const mixed = (): PracticeSpec => {
    if (spots.every((s) => s.kind === 'tense')) {
      const verbs: string[] = [];
      for (const s of spots) if (s.spec.kind === 'conjugate') for (const v of s.spec.verbs) if (!verbs.includes(v)) verbs.push(v);
      if (verbs.length) return { kind: 'conjugate', verbs, tenses: spots.map((s) => s.key), title: 'Mixed drill' };
    }
    const nodes: string[] = [];
    for (const s of spots) for (const n of s.nodes) if (!nodes.includes(n)) nodes.push(n);
    return { kind: 'nodes', nodes: nodes.slice(0, 6), title: 'Mixed drill' };
  };

  return (
    <main class="screen" id="main">
      <button class="btn link" onClick={onBack}>← Home</button>
      <Heading title="Weak spots" lead="What has tripped you in the last two weeks, and a short workout for each." />
      {spots.length ? (
        <>
          <section class="card" aria-label="Weak spots">
            {spots.map((s) => (
              <div class="actions" key={s.key} data-spot>
                <span>
                  {undash(s.label)}<br />
                  <span class="small">missed {s.misses} of {s.attempts} · {ago(s.last, now)}</span>
                </span>
                <button class="btn quiet" data-train onClick={() => onPractise(s.spec)}>Train it</button>
              </div>
            ))}
          </section>
          <div class="actions">
            <button class="btn primary" data-mixed onClick={() => onPractise(mixed())}>Mixed drill</button>
          </div>
        </>
      ) : <p>Nothing is tripping you yet. Come back after a few sessions.</p>}

      {misses.length ? (
        <>
          <h3>Recent misses</h3>
          <ul class="saved">
            {misses.map((m, i) => {
              const es = m.sentence ? bundle.sentence(m.sentence)?.es : undefined;
              return (
                <li key={`${m.node}-${m.at}-${i}`}>
                  {es ? <span lang="es" class="es">{es}</span> : <span>{undash(m.label)}</span>}
                  <span class="small">{ago(m.at, now)}</span>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </main>
  );
}
