// Shared harness for compiler property tests: a small synthetic course, the
// real simulator as the driver, and one function per rule that checks a plan
// against the learner's state at compile time.
import { expect } from 'vitest';
import type { NodeId } from '../../src/content/schema';
import {
  buildContentIndex, buildCourse, contrastSides, servedRefs, budget,
  type CompileInput, type ContentIndex, type Course, type SessionPlan,
} from '../../src/compiler';
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
}

export function checkMinimum({ plan, input }: Seen) {
  if (plan.tier !== 'minimum') return;
  expect(plan.type).toBe('minimum');
  expect(plan.advancesPath).toBe(false);
  expect(Object.values(plan.newNodes).flat()).toEqual([]);
  for (const b of plan.blocks) expect(['warmup', 'reread', 'timedRecall', 'close']).toContain(b.kind);
  for (const b of plan.blocks) if (b.kind === 'reread' || b.kind === 'timedRecall') expect(b.deliberate).toBe(true);
  expect(plan.pathAfter.unit).toBe(input.path.unit);
  expect(plan.pathAfter.day).toBe(input.path.day);
  expect(plan.pathAfter.coreSessions).toBe(input.path.coreSessions);
}

export function checkBudgets({ plan }: Seen) {
  expect(plan.newNodes.grammar.length).toBeLessThanOrEqual(1);
  expect(plan.newNodes.chunks.length).toBeLessThanOrEqual(budget.CHUNK_CAP);
  expect(plan.newNodes.contrasts.length).toBeLessThanOrEqual(budget.CONTRAST_CAP);
  expect(plan.newNodes.patterns.length).toBeLessThanOrEqual(plan.type === 'patterns' ? budget.PATTERNS_DAY_CAP : budget.PATTERN_CAP);
  const cap = plan.type === 'minimum' ? 0 : Math.max(budget.REPAY_CAP.lexeme, budget.LEXEME_CAP[plan.type]);
  expect(plan.newNodes.lexemes.length).toBeLessThanOrEqual(cap);
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

/** Everything served passes the gate: requires ⊆ known-before ∪ introduced-this-session. */
export function checkGate({ plan, input, known }: Seen) {
  const allowed = new Set([...known, ...Object.values(plan.newNodes).flat()]);
  const ok = (req: NodeId[], what: string) => {
    const missing = req.filter((r) => !allowed.has(r));
    expect(missing, `${what} needs ${missing.join(',')}`).toEqual([]);
  };
  const c = input.content;
  for (const ref of servedRefs(plan)) {
    if (ref.kind === 'sentence') ok(c.sentences.get(ref.id)!.requires, ref.id);
    if (ref.kind === 'chapter') ok(c.chapterById.get(ref.id)!.requires, ref.id);
    if (ref.kind === 'scene') ok(c.scenes.get(ref.id)!.requires, ref.id);
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

/** Review budget: never trimmed. Unthrottled → everything due is served; throttled → at least the budget's worth. */
export function checkReviews({ plan }: Seen) {
  const w = plan.blocks[0];
  if (w.kind !== 'warmup') throw new Error('no warmup');
  const fit = Math.floor((w.budgetMinutes * 60) / plan.budget.secondsPerReview);
  expect(w.items.length).toBeGreaterThanOrEqual(Math.min(plan.budget.due, fit));
  if (!plan.budget.throttled) expect(w.carried).toBe(0);
  expect(w.carried + w.items.length).toBe(plan.budget.due);
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

export const ALL_CHECKS = [checkFrame, checkMinimum, checkBudgets, checkContrasts, checkGate, checkNoRepeats, checkReviews, checkThrottle];

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
