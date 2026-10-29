// A headless learner for the session player: walks a plan block by block and
// answers through the SAME card builders, checkers and runner calls the
// components use, either always right or always wrong.
import type { Block, Item } from '../../src/compiler';
import { checkWriting, type Constraint } from '../../src/check';
import { LEARNING_STEPS_MAX, Learner, MemoryStore } from '../../src/learner';
import { fixtureContent } from '../../src/ui/fixtures';
import { Bundle } from '../../src/ui/data/bundle';
import {
  learnRetrieval, practiceCard, questionCard, recallCard, reviewCard, scriptCard, type Card,
} from '../../src/ui/session/cards';
import { SessionRunner, compilePlan } from '../../src/ui/session/runner';
import { checkTurn, turnOrder } from '../../src/ui/session/scene';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';

export type Mood = 'right' | 'wrong';

export function fixtureBundle(): Bundle {
  const f = fixtureContent();
  return new Bundle(f.units, f.nodes, f.source, true);
}

export async function world(start = new Date(2026, 9, 1, 18).getTime()) {
  const clock = { t: start };
  const now = () => clock.t;
  const kv = new MemoryKV();
  const store = new MemoryStore();
  const learner = await Learner.open(store, { now });
  const ui = await new UiStore(kv).load();
  await ui.update((s) => { s.onboarded = true; });
  return { clock, now, kv, store, learner, ui, bundle: fixtureBundle() };
}

/** The input that answers a card right (or a deliberately wrong one). */
export function answerFor(card: Card, mood: Mood): { mcq?: number; text?: string } {
  if (card.type === 'mcq') return { mcq: mood === 'right' ? card.answer : (card.answer + 1) % card.options.length };
  if (card.type === 'read') return {};
  if (mood === 'wrong') return { text: 'zzz qqq' };
  const shown = card.check('zzz qqq').answer;
  return { text: shown.includes('…') ? shown.replace('…', 'de Toronto.') : shown };
}

/** Answer one card; returns whether it passed (typed cards get their one retry with the same answer). */
export function answer(card: Card, mood: Mood): { correct: boolean; tries: number; ms: number } {
  const a = answerFor(card, mood);
  if (card.type === 'mcq') return { correct: a.mcq === card.answer, tries: 1, ms: 2000 };
  if (card.type === 'read') return { correct: true, tries: 1, ms: 1500 };
  const r = card.check(a.text!);
  if (r.pass) return { correct: true, tries: 1, ms: 4000 };
  if (!card.retry) return { correct: false, tries: 1, ms: 4000 };
  return { correct: card.check(a.text!).pass, tries: 2, ms: 8000 };
}

export interface Walk { cards: Card[]; failures: string[] }

/** Run one block the way its component does. */
export function runBlock(b: Block, run: SessionRunner, mood: Mood, walk: Walk) {
  const bundle = run.bundle;
  const play = (card: Card | undefined, item?: Item) => {
    if (!card) return;
    walk.cards.push(card);
    const o = answer(card, mood);
    if (mood === 'right' && !o.correct) walk.failures.push(`${b.kind} ${card.key}: right answer did not pass`);
    if (item) run.score(item, o);
    return o;
  };
  switch (b.kind) {
    case 'warmup': case 'leech':
      b.items.forEach((it) => play(reviewCard(it, bundle), it));
      break;
    case 'learn':
      for (const it of b.items) {
        run.present(it.node, it.productive);
        for (let round = 0; round < LEARNING_STEPS_MAX; round++) {
          const card = learnRetrieval(it, bundle, round);
          walk.cards.push(card);
          const o = answer(card, mood);
          if (run.learningStep(it.node, o, it.credit, it.productive)) break;
        }
      }
      break;
    case 'teach': {
      run.present(b.node);
      const script = bundle.scripts.get(b.node);
      if (script) b.items.forEach((it) => play(scriptCard(it, script), it));
      break;
    }
    case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
    case 'remix': case 'readingCheck': case 'extraReading':
      b.items.forEach((it) => play(practiceCard(it, bundle, run.plan.seed), it));
      break;
    case 'timedRecall':
      b.items.forEach((it) => play(recallCard(it, bundle), it));
      break;
    case 'read': case 'reread': {
      const ch = bundle.chapters.get(b.chapter)!;
      run.expose([...(bundle.index.chapterById.get(ch.id)?.requires ?? []), ...ch.lexemes]);
      const qs = b.kind === 'read' ? ch.questions : ch.rereadQuestions;
      qs.forEach((q, i) => play(questionCard(`${b.kind}:${ch.id}:${i}`, q)));
      break;
    }
    case 'scene': case 'sceneRerun': {
      const sc = bundle.scenes.get(b.scene)!;
      for (const t of turnOrder(sc)) {
        const c = checkTurn(t, mood === 'right' ? t.accept[0] : 'zzz');
        if (mood === 'right' && !c.pass) walk.failures.push(`scene ${sc.id}/${t.id}: model answer did not pass`);
        if (mood === 'wrong' && (c.pass || !c.reason)) walk.failures.push(`scene ${sc.id}/${t.id}: wrong answer gave no reason`);
      }
      run.expose(bundle.index.scenes.get(sc.id)?.requires ?? []);
      break;
    }
    case 'writing': {
      const task = bundle.tasks.get(b.task)!;
      const r = checkWriting({ constraints: task.constraints as unknown as Constraint[] }, task.model);
      if (!r.allPass && r.total) walk.failures.push(`writing ${task.id}: the model fails its own checklist`);
      run.expose(bundle.index.tasks.get(task.id)?.requires ?? []);
      break;
    }
    case 'ruleRecall': case 'personal': case 'selfCheck': case 'close':
      break;
  }
}

/** Compile, run and finish one session. */
export async function session(w: Awaited<ReturnType<typeof world>>, mood: Mood = 'right', mode: 'next' | 'another' = 'next') {
  const plan = compilePlan(w.learner, w.bundle, w.ui, { mode, now: w.now() });
  const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
  run.start();
  const walk: Walk = { cards: [], failures: [] };
  for (const b of plan.blocks) {
    if (b.kind === 'close') break;
    run.blockShown(b);
    runBlock(b, run, mood, walk);
    w.clock.t += b.minutes * 60_000;
  }
  const pathBefore = structuredClone(w.ui.path);
  await run.finish();
  return { plan, run, walk, pathBefore };
}
