// Walk synthetic learners through the course: compileSession → run the plan
// against the real Learner (FSRS + ledger) with a response model → advancePath.
// Collects everything the report needs. Deterministic for (seed, profile).
import type { Band, NodeId } from '../../src/content/schema';
import {
  advancePath, budget, canDoAnother, compileSession, initialPath, makeRng, reviewCost, reviewTargets, servedRefs,
  type Block, type CompileInput, type ContentIndex, type Course, type Item, type PathState, type ReviewItem, type SessionPlan,
} from '../../src/compiler';
import { Learner, LEDGER_KINDS, Rating, type Direction, type Grade, type Tier } from '../../src/learner';
import type { Profile } from './profiles';

const DAY_MS = 86_400_000;
export const SIM_START = new Date(2026, 0, 5, 0, 0, 0).getTime();

export interface SimOptions {
  days: number;
  tier: Tier;
  course: Course;
  content: ContentIndex;
  seed?: number;
  /** called after each compile, before the session runs (the learner is still in its pre-session state) */
  onPlan?: (plan: SessionPlan, input: CompileInput) => void;
}

export interface SessionStat {
  day: number;
  band: Band | 'done';
  unit?: string;
  type: SessionPlan['type'];
  tier: Tier;
  mode: 'next' | 'another';
  estMinutes: number;
  simMinutes: number;
  reviewMinutes: number;
  due: number;
  dueMinutes: number;
  budgetMinutes: number;
  throttled: boolean;
  converted?: string;
  newItems: number;
  /** the session moved the path to the next day */
  advanced: boolean;
}

/**
 * Fresh (first-time) content consumed. Sentences are attributed to the unit
 * that OWNS the sentence (its bank file), since that is where the burn writes
 * them; `reviewSentences` is the part first used as a warm-up review context.
 * Chapters to their unit; scenes/tasks to the unit being studied.
 */
export interface Demand { sentences: number; reviewSentences: number; chapters: number; scenes: number; tasks: number }
export const zeroDemand = (): Demand => ({ sentences: 0, reviewSentences: 0, chapters: 0, scenes: 0, tasks: 0 });

export interface ProfileRun {
  profile: string;
  tier: Tier;
  days: number;
  sessions: SessionStat[];
  /** first day index a session ran in the band, and the day the band's last unit was completed */
  bandStart: Partial<Record<Band, number>>;
  bandFinish: Partial<Record<Band, number>>;
  courseFinishedDay?: number;
  finalUnit: number;
  demand: Record<string, Demand>;
  shortages: Record<string, number>;
  /** shortage diagnostics by `block:what` */
  shortageKinds: Record<string, number>;
  bareReviews: Record<string, number>;
  /** sentences consumed with the node as the item's node, by node kind: max and mean */
  nodeDemand: Record<string, { max: number; p95: number; mean: number; nodes: number }>;
  unintendedRepeats: Record<string, number>;
  itemServes: number;
  itemRepeats60: number;
  itemRepeats60Deliberate: number;
  /**
   * By band of the node: nodes old enough to judge, and how many got < 4 scored
   * reviews in their first 60 days. Productive-track nodes only: a
   * receptive-only lexeme has one card (≈ 3 d, 11 d, 35 d → 3 reviews in 60 d
   * by design), judged separately in `underReviewedRecv` against < 3.
   */
  underReviewed: Record<string, { judged: number; under4: number }>;
  underReviewedRecv: Record<string, { judged: number; under3: number }>;
  owedAtEnd: number;
  /** warm-up review items: total, multi-target, targets covered, reused contexts, bare */
  reviewItems: { items: number; multi: number; targets: number; reused: number; bare: number };
  /** nodes introduced receptive-only; receptive cards suspended at the end (recognition-only maintenance) */
  receptiveOnly: number;
  suspendedReceptive: number;
  learned: number;
  /** total fresh sentences consumed (non-deliberate), and deliberate review-context reuses */
  freshSentences: number;
  reusedSentences: number;
}

export function simulateProfile(profile: Profile, opts: SimOptions): ProfileRun {
  const seed = (opts.seed ?? 1) * 1000 + hashName(profile.name);
  const r = makeRng(seed);
  let t = SIM_START;
  const clock = { now: () => t };
  const L = Learner.fresh({ now: clock.now });
  L.setSettings({ tier: opts.tier, minutes: opts.tier === 'extended' ? 40 : 20 });
  let path: PathState = initialPath();
  const learnerId = `sim-${profile.name}-${opts.seed ?? 1}`;
  const { course, content } = opts;

  const run: ProfileRun = {
    profile: profile.name, tier: opts.tier, days: opts.days, sessions: [], bandStart: {}, bandFinish: {}, finalUnit: 0,
    demand: {}, shortages: {}, shortageKinds: {}, bareReviews: {}, nodeDemand: {}, unintendedRepeats: {},
    itemServes: 0, itemRepeats60: 0, itemRepeats60Deliberate: 0, underReviewed: {}, underReviewedRecv: {}, owedAtEnd: 0,
    reviewItems: { items: 0, multi: 0, targets: 0, reused: 0, bare: 0 }, receptiveOnly: 0, suspendedReceptive: 0, learned: 0,
    freshSentences: 0, reusedSentences: 0,
  };
  let receptiveOnly = new Set<NodeId>();
  const reviews = new Map<NodeId, number[]>();
  const nodeSentences = new Map<NodeId, number>();
  const itemLast = new Map<string, number>();
  const bandOf = (p: PathState): Band | 'done' => course.units[p.unit]?.band ?? 'done';

  // ------------------------------------------------------------ response model
  const pCorrect = (node: NodeId, dir: Direction): number => {
    let R = L.retrievability(node, dir, t);
    if (R === undefined) R = (L.retrievability(node, 'receptive', t) ?? 0.6) * 0.85;
    const p = Math.pow(R, profile.exponent) + profile.noise * (2 * r.next() - 1);
    return Math.min(0.99, Math.max(0.02, p));
  };
  const steps = (n: number) => Array.from({ length: Math.max(3, Math.min(5, n)) }, (_, i) => r.next() < Math.min(0.98, profile.learnP + 0.05 * i));
  const introduce = (node: NodeId, n = 4) => {
    if (L.isIntroduced(node)) return;
    const results = steps(n);
    const productive = !receptiveOnly.has(node);
    if (!productive) run.receptiveOnly++;
    L.introduce(node, { at: t, results, productive });
    t += results.length * 8_000;
  };
  const answer = (node: NodeId, dir: Direction, credit: NodeId[], sentence: string | undefined, novel: boolean) => {
    const ms = profile.secs * 1000 * (0.6 + 0.8 * r.next());
    if (!L.hasCard(node, dir)) { L.expose(credit, { at: t }); t += ms; return ms; }
    const ok = r.next() < pCorrect(node, dir);
    const grade: Grade = ok ? (r.next() < profile.easyP ? Rating.Easy : Rating.Good) : Rating.Again;
    if (sentence) L.creditSentence(credit, dir, grade, { target: node, novel, at: t, ms });
    else L.review(node, dir, grade, { at: t, ms });
    const list = reviews.get(node) ?? [];
    list.push(t);
    reviews.set(node, list);
    t += ms;
    return ms;
  };

  /** A (multi-target) warm-up review: every target answered on its own retrievability, one item's time. */
  const answerReview = (it: ReviewItem): number => {
    const all = reviewTargets(it);
    const targets = all.filter((n) => L.hasCard(n, it.direction));
    const ms = profile.secs * 1000 * reviewCost(all.length) * (0.6 + 0.8 * r.next());
    if (!targets.length) { L.expose(it.credit, { at: t }); t += ms; return ms; }
    const grades: Record<NodeId, Grade> = {};
    for (const n of targets) {
      const ok = r.next() < pCorrect(n, it.direction);
      grades[n] = ok ? (r.next() < profile.easyP ? Rating.Easy : Rating.Good) : Rating.Again;
      const list = reviews.get(n) ?? [];
      list.push(t);
      reviews.set(n, list);
    }
    if (it.sentence) L.creditSentence(it.credit, it.direction, grades[targets[0]], { targets, grades, novel: it.novel, at: t, ms });
    else L.review(targets[0], it.direction, grades[targets[0]], { at: t, ms });
    t += ms;
    return ms;
  };

  const runItem = (it: Item): number => {
    if (it.op === 'review' && it.scoring === 'review') return answerReview(it);
    if (it.scoring === 'review' && (it.op === 'review' || 'direction' in it)) {
      const dir = (it as { direction: Direction }).direction;
      return answer(it.node, dir, it.credit, (it as { sentence?: string }).sentence, (it as { novel?: boolean }).novel ?? true);
    }
    if (it.scoring === 'learning') { introduce(it.node, it.op === 'learn' ? it.retrievals : 4); return 30_000; }
    if (it.scoring === 'exposure') L.expose(it.credit, { at: t });
    return 0;
  };

  const runBlock = (b: Block): number => {
    const start = t;
    let reviewMs = 0;
    switch (b.kind) {
      case 'warmup':
        for (const it of b.items) {
          reviewMs += runItem(it);
          run.reviewItems.items++;
          const n = reviewTargets(it).length;
          run.reviewItems.targets += n;
          if (n > 1) run.reviewItems.multi++;
          if (it.reused) run.reviewItems.reused++;
          if (!it.sentence) run.reviewItems.bare++;
        }
        break;
      case 'learn':
        for (const it of b.items) { introduce(it.node, it.retrievals); t += 15_000; }
        break;
      case 'teach': {
        const learning = b.items.filter((i) => i.scoring === 'learning').length;
        introduce(b.node, learning || 4);
        for (const it of b.items) if (it.scoring === 'exposure') L.expose(it.credit, { at: t });
        break;
      }
      case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
      case 'remix': case 'readingCheck': case 'extraReading': case 'leech': case 'timedRecall':
        for (const it of b.items) { const ms = runItem(it); if (!ms) t += 1; }
        break;
      case 'read': case 'reread': {
        const ch = content.chapterById.get(b.chapter);
        if (ch) L.expose(ch.requires, { at: t });
        break;
      }
      case 'scene': case 'sceneRerun': {
        const sc = content.scenes.get(b.scene);
        if (sc) L.expose(sc.requires, { at: t });
        break;
      }
      case 'writing': {
        const tk = content.tasks.get(b.task);
        if (tk) L.expose(tk.requires, { at: t });
        break;
      }
      default: break;
    }
    // blocks without per-item timing take their estimate
    const spent = t - start;
    if (spent < b.minutes * 60_000 && b.kind !== 'warmup') t = start + b.minutes * 60_000;
    return reviewMs;
  };

  // ------------------------------------------------------------ one session
  const session = (dayIdx: number, tier: Tier, mode: 'next' | 'another') => {
    const unitBefore = path.unit;
    const band = bandOf(path);
    if (band !== 'done' && run.bandStart[band] === undefined) run.bandStart[band] = dayIdx;
    const input: CompileInput = { learnerId, learner: L, path, course, content, now: t, tier, mode };
    const plan = compileSession(input);
    opts.onPlan?.(plan, input);
    receptiveOnly = new Set(plan.receptiveOnly);
    L.startSession(t);
    const start = t;
    let reviewMs = 0;
    const newNodes = Object.values(plan.newNodes).flat();
    for (const b of plan.blocks) reviewMs += runBlock(b);
    for (const n of newNodes) introduce(n); // anything a block did not introduce (e.g. script-less fallback)
    const unitKey = plan.unit ?? 'done';
    const demOf = (u: string) => (run.demand[u] ??= zeroDemand());
    const dem = demOf(unitKey);
    for (const ref of servedRefs(plan)) {
      L.ledger.markSeen(ref.kind, ref.id, { deliberate: ref.deliberate, review: ref.review, reason: ref.reason, at: t });
      if (ref.kind === 'sentence') { if (ref.deliberate) run.reusedSentences += ref.reason === budget.REVIEW_REUSE_REASON ? 1 : 0; else run.freshSentences++; }
      if (ref.kind === 'item') {
        run.itemServes++;
        const last = itemLast.get(ref.id);
        if (last !== undefined && t - last < 60 * DAY_MS) { if (ref.deliberate) run.itemRepeats60Deliberate++; else run.itemRepeats60++; }
        itemLast.set(ref.id, t);
      }
      if (ref.deliberate) continue;
      if (ref.kind === 'sentence') {
        const d = demOf(content.sentences.get(ref.id)?.unit ?? unitKey);
        d.sentences++;
        if (ref.review) d.reviewSentences++;
      }
      else if (ref.kind === 'chapter') demOf(content.chapterById.get(ref.id)?.unit ?? unitKey).chapters++;
      else if (ref.kind === 'scene') dem.scenes++;
      else if (ref.kind === 'item' && ref.id.startsWith('wt:')) dem.tasks++;
    }
    for (const b of plan.blocks) {
      if (!('items' in b)) continue;
      for (const it of b.items as Item[]) {
        if ((it as { reused?: boolean }).reused) continue; // re-served review contexts are not new supply
        const s = (it as { sentence?: string; example?: string }).sentence ?? (it as { example?: string }).example;
        if (s) nodeSentences.set(it.node, (nodeSentences.get(it.node) ?? 0) + 1);
      }
    }
    for (const d of plan.diagnostics) {
      if (d.code === 'shortage') {
        run.shortages[d.unit ?? unitKey] = (run.shortages[d.unit ?? unitKey] ?? 0) + 1;
        const k = `${d.block}:${d.what}`;
        run.shortageKinds[k] = (run.shortageKinds[k] ?? 0) + 1;
      }
      if (d.code === 'bareReview') run.bareReviews[unitKey] = (run.bareReviews[unitKey] ?? 0) + 1;
    }
    path = advancePath(path, plan, true);
    run.sessions.push({
      day: dayIdx, band, unit: plan.unit, type: plan.type, tier: plan.tier, mode,
      estMinutes: plan.estimatedMinutes, simMinutes: (t - start) / 60_000, reviewMinutes: reviewMs / 60_000,
      due: plan.budget.due, dueMinutes: plan.budget.dueMinutes, budgetMinutes: plan.budget.reviewMinutes,
      throttled: plan.budget.throttled, converted: plan.converted?.reason, newItems: newNodes.length,
      advanced: plan.advancesPath,
    });
    // band finished?
    for (let u = unitBefore; u < path.unit; u++) {
      const b = course.units[u].band;
      const nextBand = course.units[u + 1]?.band;
      if (nextBand !== b && run.bandFinish[b] === undefined) run.bandFinish[b] = dayIdx;
    }
    if (path.unit >= course.units.length && run.courseFinishedDay === undefined) run.courseFinishedDay = dayIdx;
  };

  // ------------------------------------------------------------ calendar
  let onBreak = 0;
  for (let d = 0; d < opts.days; d++) {
    if (onBreak > 0) { onBreak--; continue; }
    if (r.next() < profile.skipP) {
      if (r.next() < profile.breakP) onBreak = r.int(profile.breakDays[0], profile.breakDays[1]);
      continue;
    }
    const tier: Tier = r.next() < profile.minimumP ? 'minimum' : opts.tier;
    t = SIM_START + d * DAY_MS + 18 * 3_600_000 + Math.floor(r.next() * 3 * 3_600_000);
    session(d, tier, 'next');
    if (tier !== 'minimum' && r.next() < profile.doubleP) {
      t += 45 * 60_000;
      if (canDoAnother({ learner: L, path, course, content, now: t, tier, learnerId })) session(d, tier, 'another');
    }
  }

  // ------------------------------------------------------------ end-of-run metrics
  const end = SIM_START + opts.days * DAY_MS;
  for (const k of LEDGER_KINDS) run.unintendedRepeats[k] = L.ledger.unintendedRepeats(k);
  for (const id of L.nodes()) {
    const rec = L.node(id)!;
    const kind = course.nodes.get(id)?.kind ?? id[0];
    if (rec.introducedAt > end - 60 * DAY_MS || kind === 'cando') continue;
    const band = course.nodes.get(id)?.band ?? '?';
    const n = (reviews.get(id) ?? []).filter((x) => x <= rec.introducedAt + 60 * DAY_MS).length;
    if (rec.productiveTrack === false) {
      const u = (run.underReviewedRecv[band] ??= { judged: 0, under3: 0 });
      u.judged++;
      if (n < 3) u.under3++;
      continue;
    }
    const u = (run.underReviewed[band] ??= { judged: 0, under4: 0 });
    u.judged++;
    if (n < 4) u.under4++;
  }
  const byKind = new Map<string, number[]>();
  for (const [node, n] of nodeSentences) {
    const k = course.nodes.get(node)?.kind ?? node[0];
    const list = byKind.get(k) ?? [];
    list.push(n);
    byKind.set(k, list);
  }
  for (const [k, list] of byKind) {
    list.sort((a, b) => a - b);
    run.nodeDemand[k] = { max: list[list.length - 1], p95: list[Math.min(list.length - 1, Math.floor(list.length * 0.95))], mean: list.reduce((a, b) => a + b, 0) / list.length, nodes: list.length };
  }
  for (const id of L.nodes()) {
    if (L.isSuspended(id, 'receptive')) run.suspendedReceptive++;
    if (L.isLearned(id)) run.learned++;
  }
  run.finalUnit = path.unit;
  run.owedAtEnd = path.owedNew.length + path.owedGrammar.length;
  return run;
}

function hashName(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 1000;
}


