// Walk synthetic learners through the course: compileSession → run the plan
// against the real Learner (FSRS + ledger) with a response model → advancePath.
// Collects everything the report needs. Deterministic for (seed, profile).
import type { Band, NodeId } from '../../src/content/schema';
import {
  advancePath, budget, canDoAnother, compileSession, initialPath, makeRng, reviewCost, reviewTargets, servedRefs,
  type Block, type CompileInput, type ContentIndex, type Course, type Item, type LearnItem, type PathState, type RecapBlock,
  type RecapItem, type ReviewItem, type ServedRef, type SessionPlan,
} from '../../src/compiler';
import { delayedAccuracy, Learner, LEDGER_KINDS, productionShare, Rating, type Direction, type Grade, type ReviewEvent, type Tier } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { attributeGrades } from '../../src/ui/session/attribute';
import { applyPlacement } from '../../src/ui/session/placement';
import { planRecap, type Lapse } from '../../src/ui/session/recap';
import { gradeOf, softBlock, truncatable } from '../../src/ui/session/runner';
import type { Profile } from './profiles';

const DAY_MS = 86_400_000;
export const SIM_START = new Date(2026, 0, 5, 0, 0, 0).getTime();

export interface SimOptions {
  days: number;
  tier: Tier;
  course: Course;
  content: ContentIndex;
  seed?: number;
  /**
   * Place the learner into this unit index before day 1 (skipped units are seeded through the app's
   * `applyPlacement`); no session on day 0, a forced session on day 1. The cost of the day-1 backlog is
   * `ProfileRun.placement`.
   */
  placement?: number;
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

/** Retention measures for one band (or 'all'), from the learner's event log. */
export interface RetentionStats {
  /** scored reviews (op any), and their first-try pass share (grade Good) and not-Again share */
  reviews: number;
  firstTry: number;
  recall: number;
  /** mean FSRS retrievability just before the rating (what the scheduler promised) */
  meanR: number;
  /** delayedAccuracy: not-Again share on nodes introduced >= 7 days earlier; n = such reviews */
  delayed?: number;
  /** the same reviews, first-try pass share (graded Good) */
  delayedFirstTry?: number;
  delayedN: number;
  /** not-Again share on answered `recombine` items (scored reviews and exposure events) */
  recombine?: number;
  recombineN: number;
  /** share of scored reviews that were productive */
  production?: number;
  /** mean stable share of required words over chapters weighed for coverage, and how many were weighed */
  coverage?: number;
  coverageN: number;
  /** chapters that waited at least once for coverage / chapters read or deferred in the band */
  chaptersDeferred: number;
  chaptersRead: number;
}

export interface PlacementStat {
  unit: number;
  unitId?: string;
  seededNodes: number;
  /** the first session, day 1 */
  day1: { due: number; dueMinutes: number; budgetMinutes: number; throttled: boolean; converted?: string };
  peakDueMinutes: number;
  peakDay: number;
  /** sessions over the days run, and how many were throttled or converted */
  throttledSessions: number;
  sessions: number;
  /** first day from which every later session was within budget (undefined = never in the run) */
  settledDay?: number;
}

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
  /** counts of every event grade the run produced (Again/Hard/Good/Easy) */
  gradeCounts: Record<'again' | 'hard' | 'good' | 'easy', number>;
  /** events by op (scored reviews and exposures), e.g. recap, warmup, recombine */
  opCounts: Record<string, number>;
  /** retention by band, plus 'all' */
  retention: Record<string, RetentionStats>;
  /** present when the run started from a placement */
  placement?: PlacementStat;
  /** recap block counts: sessions with a recap, items re-asked (lapsed / new) */
  recap: { blocks: number; lapsed: number; fresh: number; skipped: number };
  /** core blocks or cards cut because the session's planned seconds were spent */
  timeCap: { blocksSkipped: number; sessionsTruncated: number };
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
    gradeCounts: { again: 0, hard: 0, good: 0, easy: 0 }, opCounts: {}, retention: {},
    recap: { blocks: 0, lapsed: 0, fresh: 0, skipped: 0 }, timeCap: { blocksSkipped: 0, sessionsTruncated: 0 },
  };
  const coverageSeen = new Map<string, { band: Band; frac: number; deferredEver: boolean }>();
  const chaptersRead = new Map<string, Band>();
  let receptiveOnly = new Set<NodeId>();
  const reviews = new Map<NodeId, number[]>();
  const nodeSentences = new Map<NodeId, number>();
  const itemLast = new Map<string, number>();
  const bandOf = (p: PathState): Band | 'done' => course.units[p.unit]?.band ?? 'done';

  // ------------------------------------------------------------ response model
  // One answer is pass-first-try (Good), pass-on-retry (Hard) or miss (Again), graded by the app's own
  // `gradeOf`; Easy never occurs, as in the app. The first draw succeeds with P = R^exponent +- noise
  // (R = FSRS retrievability). On a failed first draw the retry succeeds with
  // P2 = P + (1 - P) * profile.retryGain (a second look, at a higher P).
  const nodeOf = (id: NodeId) => course.nodes.get(id);
  const pCorrect = (node: NodeId, dir: Direction): number => {
    let R = L.retrievability(node, dir, t);
    if (R === undefined) R = (L.retrievability(node, 'receptive', t) ?? 0.6) * 0.85;
    const p = Math.pow(R, profile.exponent) + profile.noise * (2 * r.next() - 1);
    return Math.min(0.99, Math.max(0.02, p));
  };
  const attempt = (p: number): { correct: boolean; tries: 1 | 2 } => {
    if (r.next() < p) return { correct: true, tries: 1 };
    const p2 = Math.min(0.99, p + (1 - p) * profile.retryGain);
    return { correct: r.next() < p2, tries: 2 };
  };
  const steps = (n: number) => Array.from({ length: Math.max(3, Math.min(5, n)) }, (_, i) => r.next() < Math.min(0.98, profile.learnP + 0.05 * i));

  // per-session state (the runner's lapses, learn steps, presented nodes, clock and cap)
  interface Ctx {
    plan: SessionPlan; start: number; cap: number;
    lapses: Lapse[]; steps: Map<NodeId, number>; presented: Set<NodeId>; skipped: Set<Block>;
    refs: ServedRef[]; marked: Set<string>; truncated: boolean;
  }
  let ctx!: Ctx;
  const elapsedMin = () => (t - ctx.start) / 60_000;
  const reserveAfter = (blk: Block) => {
    const i = ctx.plan.blocks.indexOf(blk);
    return i < 0 ? 0 : ctx.plan.blocks.slice(i + 1).filter((x) => x.kind !== 'close' && !softBlock(x) && !ctx.skipped.has(x)).reduce((a, x) => a + x.minutes, 0);
  };
  /** Ledger a block's (or one item's) content when shown, once, as the runner does. */
  const markRefs = (blk: Block) => {
    for (const ref of servedRefs({ ...ctx.plan, blocks: [blk] })) {
      const k = `${ref.kind}\u0000${ref.id}\u0000${ref.deliberate ? 1 : 0}\u0000${ref.reason ?? ''}`;
      if (ctx.marked.has(k)) continue;
      ctx.marked.add(k);
      ctx.refs.push(ref);
      L.ledger.markSeen(ref.kind, ref.id, { deliberate: ref.deliberate, review: ref.review, reason: ref.reason, at: t });
    }
  };

  const introduce = (node: NodeId, n = 4) => {
    if (L.isIntroduced(node)) return;
    const results = steps(n);
    const productive = !receptiveOnly.has(node);
    if (!productive) run.receptiveOnly++;
    L.introduce(node, { at: t, results, productive });
    ctx.steps.set(node, results.length);
    ctx.presented.add(node);
    t += results.length * 8_000;
  };
  const noteTime = (node: NodeId) => {
    const list = reviews.get(node) ?? [];
    list.push(t);
    reviews.set(node, list);
  };
  const stepLadder = (it: Item, o: { correct: boolean; tries: 1 | 2 }) => {
    if (it.op !== 'choose' && it.op !== 'type' && it.op !== 'transform' && it.op !== 'recombine') return;
    L.stepRung(it.node, !o.correct ? 'miss' : o.tries <= 1 ? 'pass' : 'retry');
  };
  const eventOp = (it: Item) => (it.op === 'review' ? 'warmup' : it.op);
  const retryMs = (ms: number, o: { tries: 1 | 2 }) => (o.tries > 1 ? Math.round(ms * 1.5) : ms);

  const answer = (it: Item & { node: NodeId }, dir: Direction, credit: NodeId[], sentence: string | undefined, novel: boolean) => {
    const base = profile.secs * 1000 * (0.6 + 0.8 * r.next());
    const o = attempt(pCorrect(it.node, dir));
    const ms = retryMs(base, o);
    const grade = gradeOf(o);
    const op = eventOp(it);
    stepLadder(it, o);
    if (!L.hasCard(it.node, dir)) { L.expose(credit, { at: t, event: { op, direction: dir, grade, tries: o.tries, ms, sentence, novel } }); t += ms; return ms; }
    if (sentence) L.creditSentence(credit, dir, grade, { target: it.node, novel, at: t, ms, op, tries: o.tries, sentence });
    else L.review(it.node, dir, grade, { at: t, ms, op, tries: o.tries });
    noteTime(it.node);
    t += ms;
    return ms;
  };

  /**
   * A (multi-target) warm-up review: answered once, graded uniformly (`gradeOf`), then split by the
   * app's `attributeGrades`. The simulator has no card evidence (typed text, option picked), so
   * attribution sees none and returns the uniform grade, the app's own fallback. The item's chance of
   * passing is the mean of its targets' P(correct), so a multi-target item is not harsher than its parts.
   */
  const answerReview = (it: ReviewItem): number => {
    const all = reviewTargets(it);
    const targets = all.filter((n) => L.hasCard(n, it.direction));
    const base = profile.secs * 1000 * reviewCost(all.length) * (0.6 + 0.8 * r.next());
    const p = targets.length ? targets.reduce((a, n) => a + pCorrect(n, it.direction), 0) / targets.length : pCorrect(it.node, it.direction);
    const o = attempt(p);
    const ms = retryMs(base, o);
    const grade = gradeOf(o);
    if (!o.correct) for (const n of all) ctx.lapses.push({ node: n, direction: it.direction, sentence: it.sentence });
    if (!targets.length) { L.expose(it.credit, { at: t, event: { op: 'warmup', direction: it.direction, grade, tries: o.tries, ms, sentence: it.sentence, novel: it.novel } }); t += ms; return ms; }
    const { grades, expose } = attributeGrades(targets, o.correct, grade, undefined, nodeOf);
    for (const n of Object.keys(grades)) noteTime(n);
    if (it.sentence) L.creditSentence(it.credit, it.direction, grade, { targets: Object.keys(grades), grades, novel: it.novel, at: t, ms, op: 'warmup', tries: o.tries, sentence: it.sentence });
    else Object.keys(grades).forEach((n, i) => L.review(n, it.direction, grades[n], { at: t, ms: i === 0 ? ms : undefined, op: 'warmup', tries: o.tries }));
    if (expose.length) L.expose(expose, { at: t });
    t += ms;
    return ms;
  };

  /** "Before you go": the runner's openRecap capacity rule, `planRecap`, and `scoreRecap`'s two rules. */
  const runRecap = (b: RecapBlock): number => {
    const spc = Math.max(budget.SECONDS.recap, L.secondsPerReview());
    const left = Math.max(0, ctx.cap - elapsedMin());
    const capacity = Math.min(b.capacity, Math.floor((left * 60) / spc));
    const newItems = ctx.plan.blocks.flatMap((x) => (x.kind === 'learn' ? x.items : [])).filter((it: LearnItem) => ctx.presented.has(it.node));
    b.items = capacity > 0 ? planRecap({ learner: L, bundle: { index: content } as unknown as Bundle, capacity, lapses: ctx.lapses, newItems, steps: ctx.steps }) : [];
    if (!b.items.length) { ctx.skipped.add(b); run.recap.skipped++; return 0; }
    run.recap.blocks++;
    markRefs(b);
    let ms = 0;
    for (const it of b.items as RecapItem[]) {
      const base = profile.secs * 1000 * (0.6 + 0.8 * r.next());
      const o = attempt(pCorrect(it.node, it.direction));
      const dt = retryMs(base, o);
      const grade = gradeOf(o);
      if (it.kind === 'new') {
        run.recap.fresh++;
        L.expose(it.credit, { at: t, event: { op: 'recap', direction: it.direction, grade, tries: o.tries, ms: dt } });
      } else {
        run.recap.lapsed++;
        if (L.hasCard(it.node, it.direction)) {
          if (it.sentence) L.creditSentence(it.credit, it.direction, grade, { targets: [it.node], grades: { [it.node]: grade }, novel: !it.reused, at: t, ms: dt, op: 'recap', tries: o.tries, sentence: it.sentence });
          else L.review(it.node, it.direction, grade, { at: t, ms: dt, op: 'recap', tries: o.tries });
          noteTime(it.node);
        }
      }
      t += dt;
      ms += dt;
    }
    return ms;
  };

  const runItem = (it: Item): number => {
    if (it.op === 'review' && it.scoring === 'review') return answerReview(it);
    if (it.scoring === 'review' && (it.op === 'review' || 'direction' in it)) {
      const dir = (it as { direction: Direction }).direction;
      return answer(it, dir, it.credit, (it as { sentence?: string }).sentence, (it as { novel?: boolean }).novel ?? true);
    }
    if (it.scoring === 'learning') {
      introduce(it.node, it.op === 'learn' ? it.retrievals : 4);
      if (it.op !== 'learn') stepLadder(it, attempt(pCorrect(it.node, 'direction' in it ? it.direction : 'receptive')));
      return 30_000;
    }
    if (it.scoring === 'exposure') {
      // an answered item that only counts as exposure: the runner logs an exposure event and steps the ladder
      const dir: Direction = 'direction' in it ? it.direction : 'receptive';
      const sentence = (it as { sentence?: string }).sentence;
      const o = attempt(pCorrect(it.node, dir));
      const ms = retryMs(profile.secs * 1000 * (0.6 + 0.8 * r.next()), o);
      stepLadder(it, o);
      L.expose(it.credit, { at: t, event: { op: eventOp(it), direction: dir, grade: gradeOf(o), tries: o.tries, ms, sentence } });
      t += ms;
      return ms;
    }
    return 0;
  };

  const runBlock = (b: Block): number => {
    const start = t;
    let reviewMs = 0;
    let cut = false;
    if (b.kind === 'recap') return runRecap(b);
    if (!truncatable(b)) markRefs(b);
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
      case 'remix': case 'readingCheck': case 'extraReading': case 'leech':
        for (const it of b.items) {
          // the runner ends a card run when the time left is needed by the core blocks after it
          if (elapsedMin() + reserveAfter(b) >= ctx.cap) { cut = true; break; }
          markRefs({ ...b, items: [it] } as Block);
          const ms = runItem(it);
          if (!ms) t += 1;
        }
        if (cut) { ctx.truncated = true; run.timeCap.blocksSkipped++; }
        break;
      case 'timedRecall':
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
    if (!cut && spent < b.minutes * 60_000 && b.kind !== 'warmup') t = start + b.minutes * 60_000;
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
    ctx = {
      plan, start, cap: plan.budget?.minutes ?? 20, lapses: [], steps: new Map(), presented: new Set(), skipped: new Set(),
      refs: [], marked: new Set(), truncated: false,
    };
    let reviewMs = 0;
    const newNodes = Object.values(plan.newNodes).flat();
    for (const b of plan.blocks) {
      // optional blocks go when the planned time is spent (the runner's overBudget)
      if (b.kind !== 'close' && softBlock(b) && b.kind !== 'recap' && elapsedMin() >= ctx.cap) { ctx.skipped.add(b); run.timeCap.blocksSkipped++; ctx.truncated = true; continue; }
      reviewMs += runBlock(b);
    }
    if (ctx.truncated) run.timeCap.sessionsTruncated++;
    for (const n of newNodes) introduce(n); // anything a block did not introduce (e.g. script-less fallback)
    const unitKey = plan.unit ?? 'done';
    const demOf = (u: string) => (run.demand[u] ??= zeroDemand());
    const dem = demOf(unitKey);
    for (const ref of ctx.refs) {
      if (ref.kind === 'sentence') { if (ref.deliberate) run.reusedSentences += ref.reason === budget.REVIEW_REUSE_REASON ? 1 : 0; else run.freshSentences++; }
      if (ref.kind === 'item') {
        run.itemServes++;
        const last = itemLast.get(ref.id);
        if (last !== undefined && t - last < 60 * DAY_MS) { if (ref.deliberate) run.itemRepeats60Deliberate++; else run.itemRepeats60++; }
        itemLast.set(ref.id, t);
      }
      if (ref.kind === 'chapter' && !ref.deliberate) {
        const cu = content.chapterById.get(ref.id)?.unit;
        const ub = cu !== undefined ? course.units[course.unitIndex.get(cu) ?? -1]?.band : undefined;
        chaptersRead.set(ref.id, ub ?? (band === 'done' ? 'C1' : band));
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
      if (!('items' in b) || b.kind === 'recap') continue;
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
      if (d.code === 'coverage' && d.block === 'read' && d.coverage && d.coverage.required > 0) {
        const m = /^chapter (\S+?):?(?: |$)/.exec(d.message);
        if (m) {
          const cu = d.unit ? course.units[course.unitIndex.get(d.unit) ?? -1]?.band : undefined;
          coverageSeen.set(m[1], { band: cu ?? (band === 'done' ? 'C1' : band), frac: 1 - d.coverage.unstable / d.coverage.required, deferredEver: (coverageSeen.get(m[1])?.deferredEver ?? false) || !d.coverage.admitted });
        }
      }
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
  // A placed learner is placed on the evening of day 0 and studies from day 1 (day 1 is never skipped:
  // the question is the backlog the day after).
  const startDay = opts.placement ? 1 : 0;
  if (opts.placement) {
    t = SIM_START + 18 * 3_600_000;
    const bundleLike = { course, node: nodeOf } as unknown as Bundle;
    path = applyPlacement(L, bundleLike, opts.placement, t);
    run.placement = {
      unit: opts.placement, unitId: course.units[opts.placement]?.id, seededNodes: L.nodes().length,
      day1: { due: 0, dueMinutes: 0, budgetMinutes: 0, throttled: false }, peakDueMinutes: 0, peakDay: 1, throttledSessions: 0, sessions: 0,
    };
  }
  for (let d = startDay; d < opts.days + startDay; d++) {
    if (opts.placement && d === startDay) { /* attend */ }
    else if (onBreak > 0) { onBreak--; continue; }
    else if (r.next() < profile.skipP) {
      if (r.next() < profile.breakP) onBreak = r.int(profile.breakDays[0], profile.breakDays[1]);
      continue;
    }
    const tier: Tier = !(opts.placement && d === startDay) && r.next() < profile.minimumP ? 'minimum' : opts.tier;
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

  // retention, from the learner's event log
  const events = L.events();
  const gname = ['', 'again', 'hard', 'good', 'easy'] as const;
  for (const e of events) {
    run.gradeCounts[gname[e.grade]]++;
    run.opCounts[e.op] = (run.opCounts[e.op] ?? 0) + 1;
  }
  const bandOfNode = (id: NodeId): string => course.nodes.get(id)?.band ?? '?';
  const introAt = (id: NodeId) => L.node(id)?.introducedAt;
  const bandsSeen = new Set<string>([...events.map((e) => bandOfNode(e.node)), ...[...coverageSeen.values()].map((c) => c.band), ...chaptersRead.values()]);
  for (const bd of ['all', ...[...bandsSeen].sort()]) {
    const inBand = (n: NodeId) => bd === 'all' || bandOfNode(n) === bd;
    const ev = events.filter((e) => inBand(e.node));
    const rev = ev.filter((e) => e.scored === 'review');
    const withR = rev.filter((e) => e.r !== undefined);
    const delayed = rev.filter((e) => { const i = introAt(e.node); return i !== undefined && e.at - i >= 7 * DAY_MS; });
    const rec = ev.filter((e) => e.op === 'recombine' && e.scored !== 'intro'); // recombine items score as exposure; counted with any scored review
    const cov = [...coverageSeen.entries()].filter(([, c]) => bd === 'all' || c.band === bd);
    const read = [...chaptersRead.entries()].filter(([, b]) => bd === 'all' || b === bd);
    const fracs = read.map(([id]) => coverageSeen.get(id)?.frac ?? 1);
    const deferred = new Set(cov.filter(([, c]) => c.deferredEver).map(([id]) => id));
    const considered = new Set([...read.map(([id]) => id), ...deferred]);
    run.retention[bd] = {
      reviews: rev.length,
      firstTry: share(rev.filter((e) => e.grade >= Rating.Good).length, rev.length),
      recall: share(rev.filter((e) => e.grade !== Rating.Again).length, rev.length),
      meanR: withR.length ? withR.reduce((a, e) => a + (e.r ?? 0), 0) / withR.length : NaN,
      delayedFirstTry: delayed.length ? share(delayed.filter((e) => e.grade >= Rating.Good).length, delayed.length) : undefined,
      delayed: delayedAccuracy(rev, { minAgeDays: 7, introducedAt: introAt }), delayedN: delayed.length,
      recombine: rec.length ? share(rec.filter((e) => e.grade !== Rating.Again).length, rec.length) : undefined, recombineN: rec.length,
      production: productionShare(rev),
      coverage: fracs.length ? fracs.reduce((a, x) => a + x, 0) / fracs.length : undefined, coverageN: fracs.length,
      chaptersDeferred: deferred.size, chaptersRead: considered.size,
    };
  }
  if (run.placement) {
    const ss = run.sessions;
    const d1 = ss.find((x) => x.day === startDay) ?? ss[0];
    const pl = run.placement;
    if (d1) pl.day1 = { due: d1.due, dueMinutes: d1.dueMinutes, budgetMinutes: d1.budgetMinutes, throttled: d1.throttled, converted: d1.converted };
    pl.sessions = ss.length;
    pl.throttledSessions = ss.filter((x) => x.converted === 'throttle').length;
    for (const x of ss) if (x.dueMinutes > pl.peakDueMinutes) { pl.peakDueMinutes = x.dueMinutes; pl.peakDay = x.day; }
    for (let i = ss.length - 1; i >= 0; i--) { if (ss[i].dueMinutes > ss[i].budgetMinutes) break; pl.settledDay = ss[i].day; }
    if (pl.settledDay !== undefined && pl.settledDay === ss[0]?.day && ss[0].dueMinutes <= ss[0].budgetMinutes) pl.settledDay = ss[0].day;
  }
  return run;
}

function share(a: number, b: number) { return b ? a / b : NaN; }

function hashName(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 1000;
}


