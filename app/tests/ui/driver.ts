// A headless learner for the session player: walks a plan block by block and
// answers through the SAME card builders, checkers and runner calls the
// components use, either always right or always wrong.
import type { Block, Item } from '../../src/compiler';
import { checkWriting, type Constraint } from '../../src/check';
import { LEARNING_STEPS_MAX, Learner, MemoryStore, type Tier } from '../../src/learner';
import { fixtureContent } from '../../src/ui/fixtures';
import { Bundle } from '../../src/ui/data/bundle';
import {
  learnRetrieval, practiceCard, questionCard, recallCard, reviewCard, scriptCard, type Card,
} from '../../src/ui/session/cards';
import { SessionRunner, compilePlan, softBlock, truncatable } from '../../src/ui/session/runner';
import { LearnQueue, breakRuns, formatOf, interleave, teachOrder } from '../../src/ui/session/order';
import { recapCard } from '../../src/ui/session/recap';
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

/**
 * What the learner saw, in order: every card, and `screens` = one format tag
 * per screen ('present', 'teach:rule', the card's formatOf ...), for checks on
 * how long one format runs.
 */
export interface Walk { cards: Card[]; failures: string[]; screens: string[]; /** move the session clock (the walk's estimate of the time each screen takes) */ advance?: (ms: number) => void }

/** Seconds a screen takes, roughly, as a learner on a phone does it. */
export const SCREEN_SECONDS = { mcq: 9, type: 20, typeRetry: 32, read: 8, present: 10 } as const;
/** Block kinds whose time the walk counts card by card. */
const CARD_TIMED = new Set(['warmup', 'leech', 'learn', 'teach', 'structuredInput', 'controlledOutput', 'cuedProduction', 'communicative', 'remix', 'readingCheck', 'extraReading', 'timedRecall', 'recap']);

/** Run one block the way its component does. */
export function runBlock(b: Block, run: SessionRunner, mood: Mood, walk: Walk) {
  const bundle = run.bundle;
  const tick = (card: Card | 'present', tries = 1) => {
    const t = card === 'present' ? SCREEN_SECONDS.present : card.type === 'type' ? (tries > 1 ? SCREEN_SECONDS.typeRetry : SCREEN_SECONDS.type) : SCREEN_SECONDS[card.type];
    walk.advance?.(t * 1000);
  };
  const play = (card: Card | undefined, item?: Item) => {
    if (!card) return;
    walk.cards.push(card);
    walk.screens.push(formatOf(card));
    const o = answer(card, mood);
    tick(card, o.tries);
    if (mood === 'right' && !o.correct) walk.failures.push(`${b.kind} ${card.key}: right answer did not pass`);
    if (item) run.score(item, o);
    return o;
  };
  /** a run of cards the way PracticeRun / ReviewRun order and cut it */
  const runCards = (items: Item[], build: (it: Item) => Card, cut: boolean, alt?: (it: Item) => Card | undefined) => {
    const cards = items.map(build);
    const order = interleave(cards, formatOf);
    if (alt) breakRuns(cards, order, (i) => alt(items[i]));
    for (const k of order) {
      if (cut) run.itemShown(b, k);
      play(cards[k], items[k]);
      if (cut && run.overBudget()) break;
    }
  };
  switch (b.kind) {
    case 'warmup': case 'leech':
      runCards(b.items, (it) => reviewCard(it as never, bundle), b.kind === 'leech', (it) => reviewCard(it as never, bundle, 'pickSpanish'));
      break;
    case 'learn': {
      // the same queue the Learn component walks
      const q = new LearnQueue(b.items.length);
      while (!q.done) {
        if (q.current!.kind === 'present' && run.outOfTimeFor(b)) run.notTaught(q.stopNew().map((i) => b.items[i].node));
        const step = q.current;
        if (!step) break;
        const it = b.items[step.i];
        if (step.kind === 'present') {
          run.present(it.node, it.productive);
          walk.screens.push('present');
          tick('present');
          q.next();
          continue;
        }
        const card = learnRetrieval(it, bundle, step.round);
        walk.cards.push(card);
        walk.screens.push(formatOf(card));
        const o = answer(card, mood);
        tick(card, o.tries);
        if (mood === 'right' && !o.correct) walk.failures.push(`learn ${card.key}: right answer did not pass`);
        const done = run.learningStep(it.node, o, it.credit, it.productive);
        q.next(!done && step.round + 1 < LEARNING_STEPS_MAX && !run.outOfTimeFor(b));
      }
      break;
    }
    case 'teach': {
      run.present(b.node);
      const script = bundle.scripts.get(b.node);
      if (script) {
        for (const p of b.parts) {
          if (p === 'hook' || p === 'examples' || p === 'rule') { walk.screens.push(`teach:${p}`); walk.advance?.({ hook: 30, examples: 60, rule: 90 }[p] * 1000); }
        }
        const { first, mixed } = teachOrder(b.items);
        first.forEach((it) => play(scriptCard(it, script), it));
        walk.screens.push('teach:handoff');
        mixed.forEach((it) => play(scriptCard(it, script), it));
      }
      break;
    }
    case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
    case 'remix': case 'readingCheck': case 'extraReading':
      runCards(b.items, (it) => practiceCard(it as never, bundle, run.plan.seed), true);
      break;
    case 'recap':
      const rc = b.items.map((it) => recapCard(it, bundle));
      interleave(rc, formatOf).forEach((k) => {
        const it = b.items[k];
        const card = rc[k];
        walk.cards.push(card);
        walk.screens.push(formatOf(card));
        const o = answer(card, mood);
        tick(card, o.tries);
        run.scoreRecap(it, o);
      });
      break;
    case 'timedRecall':
      b.items.forEach((it) => play(recallCard(it, bundle), it));
      break;
    case 'read': case 'reread': {
      const ch = bundle.chapters.get(b.chapter)!;
      walk.screens.push('story');
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
export async function session(w: Awaited<ReturnType<typeof world>>, mood: Mood = 'right', mode: 'next' | 'another' = 'next', tier?: Tier) {
  const plan = compilePlan(w.learner, w.bundle, w.ui, { mode, now: w.now(), tier });
  const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
  run.start();
  const walk: Walk = { cards: [], failures: [], screens: [], advance: (ms) => { w.clock.t += ms; } };
  const t0 = w.clock.t;
  for (const b of plan.blocks) {
    if (b.kind === 'close') break;
    if (softBlock(b) && run.overBudget()) { run.skip(b); continue; }
    if (b.kind === 'recap' && !run.openRecap(b)) continue;
    if (truncatable(b)) run.enter(b); else run.blockShown(b);
    runBlock(b, run, mood, walk);
    if (!CARD_TIMED.has(b.kind)) { w.clock.t += b.minutes * 60_000; walk.screens.push(b.kind); }
  }
  const minutes = (w.clock.t - t0) / 60_000;
  const pathBefore = structuredClone(w.ui.path);
  await run.finish();
  return { plan, run, walk, pathBefore, minutes };
}
