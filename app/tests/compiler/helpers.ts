// Shared harness for compiler property tests: a small synthetic course, the
// real simulator as the driver, and one function per rule that checks a plan
// against the learner's state at compile time.
import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'vitest';
import { BankSentence, GraphNode, Scene, StoryChapter, TeachingScript, Unit, WritingTask, type NodeId } from '../../src/content/schema';
import {
  buildContentIndex, buildCourse, contrastSides, kindOf, servedRefs, budget, reviewTargets, unmetRequires,
  type CompileInput, type ContentIndex, type Course, type SessionPlan,
} from '../../src/compiler';
import { dayPos } from '../../src/compiler/content';
import type { Profile } from '../../tools/sim/profiles';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile, type ProfileRun } from '../../tools/sim/run';
import { syntheticCorpus, type SyntheticOptions } from '../../tools/sim/synthetic';
import type { Tier } from '../../src/learner';

export const SEEDS = [1, 2, 3, 5, 8, 13, 21, 34];

export function corpus(opts: SyntheticOptions = {}): { course: Course; content: ContentIndex } {
  const c = syntheticCorpus({ maxUnits: 6, ...opts });
  const course = buildCourse(c.units, c.nodes);
  return { course, content: buildContentIndex(c.source, course) };
}

const root = path.resolve(__dirname, '../../content');
const json = (rel: string) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const files = (d: string, keep: (name: string) => boolean) => fs.readdirSync(path.join(root, d)).filter((f) => f.endsWith('.json') && !f.startsWith('_') && keep(f)).sort().map((f) => json(`${d}/${f}`));

/** The shipped content of the first units, as the app's loader would hand it to the compiler. */
export function realCourse(through: number): { course: Course; content: ContentIndex; bank: BankSentence[] } {
  const ids = Array.from({ length: through }, (_, i) => `u${String(i + 1).padStart(2, '0')}`);
  const nodes = ['grammar', 'patterns', 'chunks', 'contrasts', 'candos', 'lexemes'].flatMap((f) => (json(`graph/${f}.json`) as unknown[]).map((n) => GraphNode.parse(n)));
  const units = ids.map((u) => Unit.parse(json(`units/${u}.json`)));
  const course = buildCourse(units, nodes);
  const mine = new Set(ids);
  const ofUnit = (f: string) => mine.has(f.slice(0, 3));
  const bank = files('bank', ofUnit).flat().map((b) => BankSentence.parse(b)).filter((b) => b.unit && mine.has(b.unit));
  const content = buildContentIndex({
    sentences: bank,
    chapters: files('story', () => true).map((c) => StoryChapter.parse(c)).filter((c) => mine.has(c.unit)),
    scenes: files('scenes', (f) => mine.has(f.slice(3, 6))).map((c) => Scene.parse(c)),
    writing: files('writing', ofUnit).flat().map((w) => WritingTask.parse(w)),
    scripts: files('scripts', () => true).map((x) => TeachingScript.parse(x)),
  }, course);
  return { course, content, bank };
}

export interface Seen { plan: SessionPlan; input: CompileInput; known: Set<NodeId> }

/** Run the simulator and hand every (plan, input) to `check` before the session executes. */
export function walk(opts: {
  seed: number; profile?: Profile; days?: number; tier?: Tier; corpus?: { course: Course; content: ContentIndex };
  check?: (s: Seen) => void;
}): { run: ProfileRun; plans: Seen[] } {
  const { course, content } = opts.corpus ?? corpus({ seed: opts.seed });
  const plans: Seen[] = [];
  const run = simulateProfile(opts.profile ?? PROFILES.irregular, {
    days: opts.days ?? 60, tier: opts.tier ?? 'standard', course, content, seed: opts.seed,
    onPlan: (plan, input) => {
      const s = { plan, input, known: new Set(input.learner.nodes()) };
      opts.check?.(s);
      plans.push({ plan, input, known: s.known });
    },
  });
  return { run, plans };
}

// ---------------------------------------------------------------- rule checks

export function checkFrame({ plan }: Seen) {
  expect(plan.blocks[0].kind).toBe('warmup');
  expect(plan.blocks.filter((b) => b.kind === 'warmup')).toHaveLength(1);
  expect(plan.blocks[plan.blocks.length - 1].kind).toBe('close');
  // "Before you go": the last core block of every non-minimum plan
  if (plan.tier !== 'minimum') expect(plan.blocks[plan.blocks.length - 2].kind).toBe('recap');
}

export function checkMinimum({ plan, input }: Seen) {
  if (plan.tier !== 'minimum') return;
  expect(plan.type).toBe('minimum');
  // a short session may teach the next few words of the day and read its chapter (C17); never a grammar point, a pattern or a contrast
  for (const b of plan.blocks) expect(['warmup', 'learn', 'read', 'reread', 'timedRecall', 'close']).toContain(b.kind);
  for (const b of plan.blocks) if (b.kind === 'reread' || b.kind === 'timedRecall') expect(b.deliberate).toBe(true);
  const fresh = Object.values(plan.newNodes).flat();
  expect(plan.newNodes.grammar).toEqual([]);
  expect(plan.newNodes.patterns).toEqual([]);
  expect(plan.newNodes.contrasts).toEqual([]);
  expect(fresh.length).toBeLessThanOrEqual(budget.SHORT_NEW_ITEMS);
  // only a slice of an input day can finish the day; anything else leaves the path where it was
  expect(plan.advancesPath).toBe(plan.pathAfter.unit !== input.path.unit || plan.pathAfter.day !== input.path.day);
  if (plan.advancesPath) expect(plan.dayType).toBe('input');
  expect(plan.pathAfter.coreSessions).toBe(input.path.coreSessions);
  // a slice is only added where it fits what the warm-up leaves of the ten minutes
  if (plan.blocks.some((b) => b.kind === 'learn' || b.kind === 'read')) expect(plan.estimatedMinutes).toBeLessThanOrEqual(budget.MINIMUM_MINUTES + 0.05);
}

export function checkBudgets({ plan }: Seen) {
  expect(plan.newNodes.grammar.length).toBeLessThanOrEqual(1);
  // an output day may pull forward the owed items its scene needs, past the per-kind caps (diagnostic 'repaid')
  if (!plan.diagnostics.some((d) => d.code === 'repaid')) {
    expect(plan.newNodes.chunks.length).toBeLessThanOrEqual(budget.CHUNK_CAP);
    expect(plan.newNodes.contrasts.length).toBeLessThanOrEqual(budget.CONTRAST_CAP);
    expect(plan.newNodes.patterns.length).toBeLessThanOrEqual(plan.type === 'patterns' ? budget.PATTERNS_DAY_CAP : budget.PATTERN_CAP);
    const cap = plan.type === 'minimum' ? budget.SHORT_NEW_ITEMS : Math.max(budget.REPAY_CAP.lexeme, budget.LEXEME_CAP[plan.type]);
    expect(plan.newNodes.lexemes.length).toBeLessThanOrEqual(cap);
  }
  if (plan.budget.severe) expect(Object.values(plan.newNodes).flat()).toEqual([]);
  if (plan.budget.throttled) {
    expect(plan.newNodes.patterns).toEqual([]);
    expect(plan.newNodes.contrasts).toEqual([]);
  }
}

export function checkContrasts({ plan, input, known }: Seen) {
  const sidesKnown = (x: NodeId) => {
    const sides = contrastSides(input.course.nodes.get(x));
    return sides.length > 0 && sides.every((s) => known.has(s));
  };
  for (const x of plan.newNodes.contrasts) expect(sidesKnown(x), x).toBe(true);
  for (const b of plan.blocks) if ('contrast' in b && b.contrast) expect(sidesKnown(b.contrast), b.contrast).toBe(true);
}

/**
 * Everything served passes the gate: requires ⊆ known-before ∪ introduced-this-session. A chapter or a scene may also stand on the
 * chunks, lexemes and patterns the unit has scheduled by the path's day and the learner is owed (R26): glossed, never a grammar point.
 */
export function checkGate({ plan, input, known }: Seen) {
  const allowed = new Set([...known, ...Object.values(plan.newNodes).flat()]);
  const here = dayPos(input.course, input.path.unit, input.path.day);
  const owed = (r: NodeId) => ['chunk', 'lexeme', 'pattern'].includes(kindOf(r, input.course.nodes)) && (input.course.teachPos.get(r) ?? Infinity) <= here;
  const ok = (req: NodeId[], what: string, glossed = false) => {
    // (a lexeme that is not a graph node is a phantom the tagger could not lemmatise: nothing can teach it, and the gate lets it through)
    const missing = unmetRequires(req, (r) => allowed.has(r), input.course.nodes).filter((r) => !(glossed && owed(r)));
    expect(missing, `${what} needs ${missing.join(',')}`).toEqual([]);
  };
  const c = input.content;
  for (const ref of servedRefs(plan)) {
    if (ref.kind === 'sentence') ok(c.sentences.get(ref.id)!.requires, ref.id);
    if (ref.kind === 'chapter') ok(c.chapterById.get(ref.id)!.requires, ref.id, true);
    if (ref.kind === 'scene') ok(c.scenes.get(ref.id)!.requires, ref.id, true);
    if (ref.kind === 'item' && ref.id.startsWith('wt:')) ok(c.tasks.get(ref.id.slice(3))!.requires, ref.id);
  }
}

/** Nothing already in the ledger unless deliberate; nothing twice in a plan; deliberate re-shows are of seen (or same-session) content. */
export function checkNoRepeats({ plan, input }: Seen) {
  const refs = servedRefs(plan);
  const fresh = new Set<string>();
  for (const r of refs) {
    const key = `${r.kind}|${r.id}`;
    if (r.deliberate) {
      expect(input.learner.ledger.hasSeen(r.kind, r.id) || fresh.has(key) || r.kind === 'item', `deliberate ${key} must be known content`).toBe(true);
      continue;
    }
    expect(input.learner.ledger.hasSeen(r.kind, r.id), `${key} already seen`).toBe(false);
    expect(fresh.has(key), `${key} twice in one plan`).toBe(false);
    fresh.add(key);
  }
  // only deliberate blocks may hold deliberate refs
  for (const b of plan.blocks) if (b.kind === 'reread' || b.kind === 'sceneRerun' || b.kind === 'ruleRecall' || b.kind === 'timedRecall') expect(b.deliberate).toBe(true);
}

/**
 * Review budget. Fresh reviews are never trimmed: unthrottled → every fresh due card is served; throttled → at least the
 * budget's worth (in single-review units; a multi-target item costs MULTI_REVIEW_COST and covers ≥ 2 due cards). The old
 * debt (more than a day overdue, or seeded by placement) is paid at a capped rate out of what the warm-up has left, never
 * more than the budget, and it never throttles. A return's warm-up is held to its own card cap instead.
 */
export function checkReviews({ plan, input }: Seen) {
  const w = plan.blocks[0];
  if (w.kind !== 'warmup') throw new Error('no warmup');
  const fit = Math.floor((w.budgetMinutes * 60) / plan.budget.secondsPerReview);
  // the compiler always sets targets and productive explicitly
  for (const it of w.items) expect(it.targets).toBeDefined();
  const covered = w.items.reduce((a, it) => a + reviewTargets(it).length, 0);
  expect(w.covered).toBe(covered);
  // a node with both cards due is reviewed in one direction; the sibling is buried (still due, carried)
  const dueCards = input.learner.due(input.now);
  const buried = dueCards.length - new Set(dueCards.map((d) => d.node)).size;
  const debt = w.debt ?? 0, paid = w.paid ?? 0;
  const fresh = plan.budget.due - buried - debt;
  expect(w.carried + covered).toBe(plan.budget.due);
  expect(debt).toBeLessThanOrEqual(plan.budget.due - buried);
  // a group may take the payment a card or two past its cap
  expect(paid).toBeLessThanOrEqual(Math.min(debt, budget.DEBT.cards * (w.extended ? budget.DEBT.reviewFactor : 1) + budget.MULTI_REVIEW_MAX - 1));
  if (plan.converted?.reason === 'reentry') {
    expect(w.items.length).toBeLessThanOrEqual(budget.REENTRY.cards);
    return;
  }
  expect(covered - paid).toBeGreaterThanOrEqual(Math.min(fresh, fit));
  if (!plan.budget.throttled) expect(covered - paid).toBe(fresh);
  // the debt is paid out of the budget, so paying it never makes a warm-up longer than the budget (or than the fresh cards alone)
  if (paid && !plan.budget.throttled) expect(w.minutes).toBeLessThanOrEqual(Math.max(w.budgetMinutes, plan.budget.dueMinutes) + 0.1 + (budget.MULTI_REVIEW_COST * plan.budget.secondsPerReview) / 60);
}

/**
 * Multi-item reviews: ≤ MULTI_REVIEW_MAX targets, all distinct, all due in the
 * item's direction, every target in the sentence; no due card reviewed twice.
 */
export function checkMultiReviews({ plan, input }: Seen) {
  const w = plan.blocks[0];
  if (w.kind !== 'warmup') return;
  const due = new Set(input.learner.due(input.now).map((d) => `${d.node}|${d.direction}`));
  const seen = new Set<string>();
  for (const it of w.items) {
    const targets = reviewTargets(it);
    expect(targets[0]).toBe(it.node);
    expect(targets.length).toBeLessThanOrEqual(budget.MULTI_REVIEW_MAX);
    if (!it.sentence) expect(targets).toEqual([it.node]);
    const req = it.sentence ? input.content.sentences.get(it.sentence)!.requires : [it.node];
    for (const t of targets) {
      const key = `${t}|${it.direction}`;
      expect(due.has(key), `${key} not due`).toBe(true);
      expect(seen.has(key), `${key} reviewed twice`).toBe(false);
      seen.add(key);
      expect(req, `${t} not in ${it.sentence}`).toContain(t);
      expect(it.credit).toContain(t);
    }
  }
}

/**
 * Review-context reuse: only warm-up review items may re-serve a seen
 * sentence, only one that was ONLY ever a review context and last shown
 * ≥ REVIEW_REUSE_DAYS ago, labelled deliberate with the reuse reason.
 */
export function checkReviewReuse({ plan, input }: Seen) {
  for (const r of servedRefs(plan)) {
    if (r.reason === budget.REVIEW_REUSE_REASON) {
      expect(r.deliberate).toBe(true);
      expect(r.review).toBe(true);
      if (r.kind === 'sentence') {
        const views = input.learner.ledger.views('sentence', r.id);
        expect(views.length).toBeGreaterThan(0);
        expect(views.every((v) => v.review === true), `${r.id} was shown outside a review`).toBe(true);
        expect(input.now - Math.max(...views.map((v) => v.at))).toBeGreaterThanOrEqual(budget.REVIEW_REUSE_DAYS * 86_400_000);
      }
    }
  }
  for (const b of plan.blocks) {
    if (b.kind !== 'warmup' && 'items' in b) for (const it of b.items) expect((it as { reused?: boolean }).reused ?? false).toBe(false);
    if (b.kind === 'warmup') for (const it of b.items) if (it.reused) expect(it.novel).toBe(false);
  }
}

/** Receptive-only new nodes follow productivePolicy (and only lexemes are ever receptive-only). */
export function checkProductivePolicy({ plan, input }: Seen) {
  const all = new Set(Object.values(plan.newNodes).flat());
  for (const id of plan.receptiveOnly) {
    expect(all.has(id)).toBe(true);
    expect(plan.newNodes.lexemes).toContain(id);
  }
  for (const b of plan.blocks) if (b.kind === 'learn') for (const it of b.items) expect(it.productive).toBe(!plan.receptiveOnly.includes(it.node));
}

/** Throttle: an input/patterns day with a backlog becomes review and does not advance (unless a spacing rule took the session). */
export function checkThrottle({ plan }: Seen) {
  if (plan.tier === 'minimum' || !plan.budget.throttled) return;
  if ((plan.dayType === 'input' || plan.dayType === 'patterns') && plan.converted?.reason !== 'spacing') {
    expect(plan.type).toBe('review');
    expect(plan.advancesPath).toBe(false);
  }
  if (plan.mode === 'another' && plan.converted?.reason !== 'spacing') expect(plan.type).toBe('review');
}

/**
 * Sibling burying: no node is reviewed in both directions in one session,
 * across the warm-up and every other block that scores a 'review'.
 */
export function checkNoSiblings({ plan }: Seen) {
  const dirs = new Map<NodeId, Set<string>>();
  const add = (node: NodeId, direction: string) => {
    const s = dirs.get(node) ?? new Set<string>();
    s.add(direction);
    dirs.set(node, s);
  };
  for (const b of plan.blocks) {
    if (!('items' in b)) continue;
    for (const it of b.items as any[]) {
      if (it.scoring !== 'review' || !it.direction) continue;
      if (b.kind === 'warmup') for (const t of reviewTargets(it)) add(t, it.direction);
      else add(it.node, it.direction);
    }
  }
  for (const [node, s] of dirs) expect(s.size, `${node} reviewed in both directions`).toBe(1);
}

/**
 * A contrast with a script is taught from it (F1): a new one is never a learn item, its teach block carries the
 * whole script, and a day that teaches one has no communicative block and no freer writing (R21).
 */
export function checkContrastTeaching({ plan, input }: Seen) {
  for (const b of plan.blocks) if (b.kind === 'learn') for (const it of b.items) {
    expect(it.nodeKind === 'contrast' && input.content.scripts.has(it.node), `${it.node} is a learn item, not a lesson`).toBe(false);
  }
  const taught = plan.blocks.filter((b) => b.kind === 'teach' && b.reason === 'contrast');
  for (const b of taught) {
    if (b.kind !== 'teach') continue;
    const sc = input.content.scripts.get(b.node)!;
    expect(b.nodeKind).toBe('contrast');
    expect(b.script).toBe(true);
    expect(b.deliberate).toBe(false);
    expect(b.parts).toEqual(['hook', 'examples', 'rule', 'readAndPick', 'yourTurn', 'pitfalls']);
    expect(b.items.length).toBe(sc.readAndPick + sc.yourTurn);
  }
  for (const x of plan.newNodes.contrasts) {
    if (!input.content.scripts.has(x)) continue;
    expect(taught.some((b) => b.kind === 'teach' && b.node === x), `${x} is new today and has no lesson`).toBe(true);
  }
  if (taught.length && plan.type === 'drill') {
    expect(plan.blocks.some((b) => b.kind === 'communicative'), 'communicative stays on a contrast day').toBe(false);
    expect(plan.blocks.some((b) => b.kind === 'writing' && b.purpose === 'freer'), 'freer writing stays on a contrast day').toBe(false);
  }
}

export const ALL_CHECKS = [checkNoSiblings, checkFrame, checkMinimum, checkBudgets, checkContrasts, checkContrastTeaching, checkGate, checkNoRepeats, checkReviews, checkThrottle, checkMultiReviews, checkReviewReuse, checkProductivePolicy];

/** Spacing across a walk: grammar intros never in consecutive core sessions; each drilled within 1–3 core sessions. */
export function checkSpacing(plans: Seen[]) {
  const core = plans.filter((p) => p.plan.tier !== 'minimum').map((p) => p.plan);
  let lastIntro = -10;
  const intros: { node: NodeId; at: number }[] = [];
  core.forEach((p, i) => {
    if (p.newNodes.grammar.length) {
      expect(i - lastIntro, `intro at core ${i} right after ${lastIntro}`).toBeGreaterThan(1);
      lastIntro = i;
      intros.push({ node: p.newNodes.grammar[0], at: i });
    }
  });
  for (const { node, at } of intros) {
    if (at + 3 >= core.length) continue;
    const drilled = core.slice(at + 1, at + 4).some((p) => p.blocks.some((b) => b.kind === 'ruleRecall' && b.node === node));
    expect(drilled, `${node} introduced at core ${at} not drilled within 3`).toBe(true);
  }
  return intros.length;
}
