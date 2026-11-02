// A seeded replay of everything that grades an answer, kept as a transcript: every event the learner
// logged and where every node's cards ended up. attempt-seam.test.ts digests it, so the digest stands
// for how the app grades. It reads only what grading writes (not the attempts log or any field added
// for it), so it holds still while capture is built around it.
import { createHash } from 'node:crypto';
import { buildContentIndex, buildCourse, type Item } from '../../src/compiler';
import { rng } from '../../src/exercises/rng';
import { Learner, MemoryStore, type ReviewEvent } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { Freeplay, type FreeplayDeps } from '../../src/ui/session/freeplay';
import type { PracticeSpec } from '../../src/ui/session/practice-spec';
import { compilePlan, SessionRunner, truncatable, type Outcome } from '../../src/ui/session/runner';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { syntheticCorpus } from '../../tools/sim/synthetic';
import { answer, session, type Mood } from './driver';

const DAY = 86_400_000;

/** The fields of an event that grading writes. A field capture adds later is left out on purpose. */
const graded = (e: ReviewEvent) => [e.at, e.node, e.dir, e.grade, e.ms ?? null, e.sentence ?? null, e.op, e.tries, e.novel, e.session, e.r ?? null, e.scored];

/** Every node's memory, in a fixed order. */
function memory(L: Learner) {
  return L.nodes().sort().map((id) => {
    const n = L.node(id)!;
    const card = (c: typeof n.receptive) => c && [c.due, c.stability, c.difficulty, c.scheduled_days, c.reps, c.lapses, c.state, c.suspended ?? false, c.partials ?? 0];
    return [id, n.introducedAt, n.novelPasses, n.exposures, n.rung ?? 0, n.rungStreak ?? 0, n.learning?.steps.length ?? -1, card(n.receptive) ?? null, card(n.productive) ?? null];
  });
}

export const digest = (x: unknown): string => createHash('sha256').update(JSON.stringify(x)).digest('hex');

/** What one learner looks like after the replay: how many events, a digest of them, and a digest of the memory and the timing. */
export interface Trace { events: number; eventDigest: string; memoryDigest: string }
export const traceOf = (L: Learner): Trace => ({
  events: L.events().length, eventDigest: digest(L.events().map(graded)), memoryDigest: digest([memory(L), L.toJSON().timing]),
});

/** Ten days on the real A1 course, a bad day now and then, so warm-ups, lessons, recaps and lapses all happen. */
export async function sessions(bundle: Bundle) {
  const clock = { t: new Date(2026, 9, 1, 18).getTime() };
  const now = () => clock.t;
  const learner = await Learner.open(new MemoryStore(), { now });
  const ui = await new UiStore(new MemoryKV()).load();
  await ui.update((s) => { s.onboarded = true; s.learnerId = 'replay'; });
  const w = { clock, now, kv: new MemoryKV(), store: new MemoryStore(), learner, ui, bundle };
  const moods: Mood[] = ['right', 'right', 'wrong', 'right', 'right', 'wrong', 'right', 'right', 'right', 'wrong'];
  for (const mood of moods) {
    await session(w, mood);
    await bundle.ensureWindow(ui.path.unit);
    clock.t += DAY;
  }
  return w;
}

/**
 * Outcomes the driver never makes: a pass on the retry, a lenient pass, a card that asked for no answer, a
 * miss on the first try with evidence of what was typed. Dealt in turn to every item of five days' plans,
 * through the runner's own calls.
 */
const DEAL: Outcome[] = [
  { correct: true, tries: 1, ms: 4000 }, { correct: true, tries: 2, ms: 9000 }, { correct: false, tries: 2, ms: 12000 },
  { correct: true, tries: 1, ms: 3000, lenient: true }, { correct: true, tries: 1, ms: 1500, exposure: true },
  { correct: false, tries: 1, ms: 2500, evidence: { picked: 1 } }, { correct: true, tries: 2, ms: 7000, evidence: { input: 'x', answer: 'y' } },
  { correct: true, tries: 1, ms: 5000 }, { correct: false, tries: 2, ms: 11000, evidence: { input: 'zzz', answer: 'yyy' } },
];

export async function dealt(bundle: Bundle): Promise<Trace> {
  const clock = { t: new Date(2026, 9, 1, 18).getTime() };
  const now = () => clock.t;
  const learner = await Learner.open(new MemoryStore(), { now });
  const ui = await new UiStore(new MemoryKV()).load();
  await ui.update((s) => { s.onboarded = true; s.learnerId = 'deal'; });
  let n = 0;
  const next = (): Outcome => ({ ...DEAL[n++ % DEAL.length] });
  for (let day = 0; day < 5; day++) {
    const plan = compilePlan(learner, bundle, ui, { now: now() });
    const run = new SessionRunner(learner, bundle, ui, plan, now);
    run.start();
    for (const b of plan.blocks) {
      if (b.kind === 'close') break;
      if (b.kind === 'recap') {
        if (!run.openRecap(b)) continue;
        run.blockShown(b);
        b.items.forEach((it) => { run.scoreRecap(it, next()); clock.t += 6000; });
        continue;
      }
      if (truncatable(b)) run.enter(b); else run.blockShown(b);
      if (b.kind === 'learn') {
        for (const it of b.items) {
          run.present(it.node, it.productive);
          for (let k = 0; k < 5; k++) { clock.t += 5000; if (run.learningStep(it.node, next(), it.credit, it.productive, 'learn', k % 2 === 0)) break; }
        }
      } else if ('items' in b) for (const it of b.items as Item[]) { run.score(it, next()); clock.t += 6000; }
    }
    await run.finish();
    await bundle.ensureWindow(ui.path.unit);
    clock.t += DAY;
  }
  return traceOf(learner);
}

/** Free practice of every kind, over the learner the sessions left, answering right, then on the retry, then wrong. */
export function freeplay(w: Awaited<ReturnType<typeof sessions>>): Trace {
  const specs: PracticeSpec[] = [
    { kind: 'quickReview' },
    { kind: 'nodes', nodes: w.learner.nodes().filter((n) => /^[gp]:/.test(n)).slice(0, 3) },
    { kind: 'checkpoint' },
    { kind: 'translate' },
    { kind: 'conjugate', verbs: ['ser', 'tener', 'comer'], tenses: ['presente', 'preterito'] },
  ];
  w.clock.t += 6 * DAY;
  const deps = (finished?: number): FreeplayDeps => ({ learner: w.learner, bundle: w.bundle, now: w.now, rng: rng('replay'), finished });
  specs.forEach((spec) => {
    const fp = new Freeplay(spec, deps(w.ui.path.unit));
    for (let i = 0; i < 12; i++) {
      const card = fp.next();
      if (!card) break;
      const mood: Mood = i % 4 === 3 ? 'wrong' : 'right';
      const o = answer(card, mood);
      // every third answer passes only on the second try
      fp.answer(i % 3 === 2 && o.correct && card.type === 'type' ? { ...o, tries: 2 } : o);
    }
  });
  return traceOf(w.learner);
}

/** The simulator: two profiles on the synthetic course, sixty days each. */
export function simulated(): Record<string, Trace> {
  const c = syntheticCorpus({ seed: 7, maxUnits: 14 });
  const course = buildCourse(c.units, c.nodes);
  const content = buildContentIndex(c.source, course);
  const out: Record<string, Trace> = {};
  for (const name of ['average', 'irregular']) {
    simulateProfile(PROFILES[name], { days: 60, tier: 'standard', course, content, seed: 7, onFinish: (L) => { out[name] = traceOf(L); } });
  }
  return out;
}
