// The deterministic session compiler. compileSession() is a pure function of
// its input: it reads the learner (never mutates it) and returns a plan plus
// the path the learner will be on once the plan's core is completed.
//
// Rules enforced here (each has a property test in tests/compiler):
//  - the warm-up (SRS) block is in every plan, first; minimum tier = warm-up +
//    the next slice of the day (a few of its words, its chapter), or a re-read +
//    timed recall; it advances the path only by finishing an input day
//  - ≤ 1 grammar introduction per session, never in consecutive core sessions,
//    and each introduction is drilled within DRILL_WITHIN core sessions
//  - chunks have their own 3–5 budget; lexemes have a per-lesson-type cap
//  - contrasts only once both sides are known
//  - a recognition-only node (voseo, vosotros, the -se forms, ...) is read, never
//    asked for: no typed card on it, nor on any other node in a row that needs it
//  - content gate: everything served has requires ⊆ known ∪ introduced-this-session
//    (a known chunk satisfies itself; it stands in for the grammar it unpacks only
//    when the same item also requires that chunk, i.e. the grammar sits inside it).
//    The one exception is the story: a chapter or a scene may also stand on chunks,
//    lexemes and patterns the unit has scheduled by today and the learner is owed
//    (R26, L7): they are glossed, and a grammar point still has to be taught
//  - review budget in minutes by band and tier (budget.ts; learner.secondsPerReview);
//    multi-target review items (≤ 3 due nodes in one sentence) cost
//    MULTI_REVIEW_COST × a single review; backlog throttle cuts
//    new items first, converts input/patterns days (and introduce days when
//    severe) into review, never trims reviews
//  - no repeats: nothing in the ledger is served unless its block is deliberate,
//    except a warm-up review context only ever used as one, last shown
//    ≥ REVIEW_REUSE_DAYS ago (ledgered deliberate, reason 'review-context-120d');
//    when supply runs short the block/session converts and a 'shortage' is logged;
//    there is no fallback to ungated or seen content
//  - deterministic: the RNG seed is learner id + session index
import { lackKey, lacksCourse } from '../content/kinds';
import { isCognate } from './cognate';
import { alignedPairs } from '../exercises/pairs';
import type { Band, GraphNode, LessonType, NodeId, Unit } from '../content/schema';
import { productivePolicy, recognitionOnly, SEEDED_REPS, State, type Direction, type DueCard, type Tier } from '../learner';
import {
  CHECKPOINT_WARMUP_FACTOR, CHECKPOINT_WINDOW_DAYS, CHUNK_CAP, CONTRAST_CAP, CONTRAST_RETURN, COUNTS, DEBT, DONE_BAND, DRILL_WITHIN,
  EXTENDED_EXTRA_MINUTES, EXTRA_READING_MAX, LEXEME_CAP, EARLY_NEW_ITEMS_MAX, EARLY_SESSIONS, MINIMUM_MINUTES, MINIMUM_WARMUP_MINUTES, MULTI_REVIEW_COST, MULTI_REVIEW_MAX, MULTI_REVIEW_SCAN,
  PATTERN_CAP, PATTERNS_DAY_CAP, PATTERNS_TAUGHT, RECALL_POOL, RECOGNITION_EXTRA_PICKS, REENTRY, REMIX_WINDOW_DAYS, REPAY_CAP, REREAD_WIDE_DAYS, REREAD_WINDOW_DAYS,
  REVIEW_DAY_EXTRA_MINUTES, REVIEW_REUSE_DAYS, REVIEW_REUSE_REASON,
  SECONDS, SEVERE_FACTOR, learnSeconds, SHORT_NEW_ITEMS, THROTTLED_WARMUP_FACTOR, sessionMinutes, throttleMinutes, warmupMinutes,
} from './budget';
import { admissible, dayPos, hash32, knownSet, unmetRequires, unreadChapters, makeRng, sessionSeed, type Rng } from './content';
import type {
  Block, ChapterRef, CloseBlock, CompileInput, Conversion, Diagnostic, LearnBlock, LearnItem, LearnerView,
  Mode, PathState, PracticeBlock, PracticeItem, PracticeOp, ReviewItem, ScriptItem, SentenceRef,
  ServedRef, SessionLogEntry, SessionPlan, TeachBlock, WarmupBlock,
} from './types';

import { REMEDIATE_MAX_SERVED } from './remediate';

const DAY_MS = 86_400_000;
const LOG_MAX = 60;
/** Most owed items an output day pulls forward for its scene (a unit's first scene can owe a dozen). */
const REPAY_SCENE_MAX = 14;

export function initialPath(): PathState {
  return { version: 3, unit: 0, day: 0, coreSessions: 0, owedNew: [], owedGrammar: [], pendingDrills: [], recentGrammar: [], remediate: [], log: [] };
}

export function compileSession(input: CompileInput): SessionPlan {
  return new Compiler(input).compile();
}

/** The path to persist after a session: plan.pathAfter if the core was completed, else unchanged. */
export function advancePath(path: PathState, plan: SessionPlan, coreCompleted: boolean): PathState {
  if (!coreCompleted) return path;
  const next = structuredClone(plan.pathAfter);
  // marks made during the session (self-check, reading check) live on `path`; the plan only counts servings
  const planned = new Map((plan.pathAfter.remediate ?? []).map((e) => [e.node, e]));
  next.remediate = (path.remediate ?? [])
    .map((e) => { const p = planned.get(e.node); return p && p.at === e.at ? { ...e, served: p.served ?? 0 } : e; })
    .filter((e) => (e.served ?? 0) < REMEDIATE_MAX_SERVED);
  return next;
}

/**
 * New items a session planned but never presented (the learner ran out of
 * time): owed, first in line next session. Never lost.
 */
export function carryOwed(path: PathState, nodes: readonly NodeId[]): PathState {
  if (!nodes.length) return path;
  const p = structuredClone(path);
  p.owedNew = [...nodes, ...p.owedNew.filter((n) => !nodes.includes(n))];
  return p;
}

/**
 * The learner stopped before the core was done ("I need to stop"): logged as
 * a minimum session, the path does not advance. A grammar point that was
 * taught still needs its drill; everything not taught stays where it was
 * (owed, or on the same path day, which comes round again).
 */
export function stoppedPath(path: PathState, plan: SessionPlan, taughtGrammar?: NodeId): PathState {
  const p = structuredClone(path);
  if (taughtGrammar && !p.pendingDrills.some((d) => d.node === taughtGrammar)) {
    p.pendingDrills = [...p.pendingDrills, { node: taughtGrammar, at: p.coreSessions + 1 }];
    p.recentGrammar = [taughtGrammar, ...p.recentGrammar.filter((x) => x !== taughtGrammar)].slice(0, 8);
    p.owedGrammar = p.owedGrammar.filter((x) => x !== taughtGrammar);
  }
  p.log = [...p.log, {
    learnerSession: plan.sessionIndex, type: 'minimum' as const, dayType: plan.dayType, unit: plan.unit, day: plan.day,
    advanced: false, throttled: plan.budget.throttled,
  }].slice(-LOG_MAX);
  return p;
}

/** Whether "do another" should be offered now: not minimum, course not finished, and no backlog over budget. */
export function canDoAnother(input: Pick<CompileInput, 'learner' | 'path' | 'course' | 'now' | 'tier' | 'placedAt'> & { content?: CompileInput['content']; learnerId?: string }): boolean {
  const tier = input.tier ?? input.learner.settings.tier;
  if (tier === 'minimum') return false;
  if (input.path.unit >= input.course.units.length) return false;
  // With the content index: the same grouped (multi-target) cost the compiler
  // will see, so "another" is offered exactly when it would not be throttled.
  // Without it: every due card costed as a single review (an upper bound).
  const dueMin = input.content
    ? new Compiler({ learnerId: input.learnerId ?? '', learner: input.learner, path: input.path, course: input.course, content: input.content, now: input.now, tier, mode: 'another', placedAt: input.placedAt }).dueReviewMinutes()
    : input.learner.due(input.now).length * input.learner.secondsPerReview() / 60;
  return dueMin <= throttleMinutes(tier, bandAt(input.course, input.path));
}

/** The band whose budgets apply on this path position (the last band once the course is finished). */
export function bandAt(course: { units: Unit[] }, path: Pick<PathState, 'unit'>): Band {
  return course.units[path.unit]?.band ?? course.units[course.units.length - 1]?.band ?? DONE_BAND;
}

/** The due nodes a review item reviews (`targets`, or just `node` on a hand-built item). */
export function reviewTargets(it: Pick<ReviewItem, 'node' | 'targets'>): NodeId[] {
  return it.targets?.length ? it.targets : [it.node];
}

/** Time cost of one review item, in single-review units. */
export function reviewCost(targets: number): number {
  return targets > 1 ? MULTI_REVIEW_COST : 1;
}

/** Every ledger entry the runner records once the plan's content is shown. */
export function servedRefs(plan: SessionPlan): ServedRef[] {
  const out: ServedRef[] = [];
  const add = (kind: ServedRef['kind'], id: string | undefined, deliberate: boolean) => { if (id) out.push({ kind, id, deliberate }); };
  for (const b of plan.blocks) {
    switch (b.kind) {
      case 'warmup':
        for (const it of b.items) {
          if (!it.sentence) continue;
          if (it.reused) {
            out.push({ kind: 'sentence', id: it.sentence, deliberate: true, review: true, reason: REVIEW_REUSE_REASON });
            out.push({ kind: 'item', id: it.id, deliberate: true, review: true, reason: REVIEW_REUSE_REASON });
          } else {
            out.push({ kind: 'sentence', id: it.sentence, deliberate: false, review: true });
            out.push({ kind: 'item', id: it.id, deliberate: false, review: true });
          }
        }
        break;
      case 'leech':
        for (const it of b.items) if (it.sentence) { add('sentence', it.sentence, false); add('item', it.id, false); }
        break;
      case 'learn':
        for (const it of b.items) { add('item', it.id, false); add('sentence', it.example, false); }
        break;
      case 'teach':
        for (const it of b.items) add('item', it.id, b.deliberate);   // a drill-day script re-serve is deliberate
        for (const s of b.examples) add('sentence', s, false);
        break;
      case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
      case 'remix': case 'readingCheck': case 'extraReading':
        // a recombine item re-serves a sentence the learner knows on purpose: that repeat is deliberate
        for (const it of b.items) { add('sentence', it.sentence, it.op === 'recombine'); add('item', it.id, false); }
        break;
      case 'read':
        // a chapter read in beats is seen when its last beat is; each beat before that is only counted
        if (b.beat) add('reading', b.chapter, true);
        if (!b.beat || b.beat.ix === b.beat.of - 1) add('chapter', b.chapter, false);
        break;
      case 'reread': add('chapter', b.chapter, true); break;
      case 'scene': add('scene', b.scene, false); break;
      case 'sceneRerun': add('scene', b.scene, true); break;
      case 'writing': add('item', `wt:${b.task}`, false); break;
      case 'timedRecall': for (const it of b.items) add('item', it.id, true); break;
      case 'recap': for (const it of b.items) { add('item', it.id, true); add('sentence', it.sentence, !!it.reused); } break;
      default: break; // ruleRecall, personal, selfCheck, close: nothing new shown
    }
  }
  return out;
}

const LADDER_OPS: readonly PracticeOp[] = ['choose', 'type', 'transform', 'recombine'];

export function kindOf(id: NodeId, nodes: Map<NodeId, GraphNode>): GraphNode['kind'] {
  const k = nodes.get(id)?.kind;
  if (k) return k;
  return ({ g: 'grammar', p: 'pattern', c: 'chunk', l: 'lexeme', x: 'contrast', d: 'cando' } as const)[id[0] as 'g'] ?? 'lexeme';
}

/** The two (or more) sides of a contrast node. */
export function contrastSides(n: GraphNode | undefined): NodeId[] {
  if (!n) return [];
  return n.contrasts.length ? n.contrasts : n.requires;
}

/** A planned review item: due cards of one direction sharing one sentence (or one bare card). */
interface ReviewGroup {
  direction: Direction;
  targets: NodeId[];
  sentence?: SentenceRef;
  reused: boolean;
  /** a contrast's own script item, when there is no sentence (see ReviewItem.script) */
  script?: ReviewItem['script'];
  /** a contrast's own item, when it has any (see ReviewItem.contrast) */
  contrast?: string;
}

interface Decision {
  type: LessonType;
  advances: boolean;
  converted?: Conversion;
  drillNode?: NodeId;
  grammarNode?: NodeId;
}

class Compiler {
  private readonly L: LearnerView;
  private readonly now: number;
  private readonly tier: Tier;
  private readonly mode: Mode;
  private readonly path: PathState;
  private readonly sessionIndex: number;
  private readonly seed: number;
  private readonly rng: Rng;
  private readonly spr: number;
  private readonly known: Set<NodeId>;
  /** introduced AND retained or fresh: what reading coverage is measured against */
  private readonly stable: Set<NodeId>;
  /** chapters that passed the gate but not the coverage rule this plan */
  private readonly slipping = new Set<string>();
  private readonly sessionNew = new Set<NodeId>();
  private readonly receptiveOnly: NodeId[] = [];
  private readonly usedSentences = new Set<string>();
  /** the contrast items this session's reviews have asked, so a contrast due twice is not asked the same way twice */
  private readonly usedContrast = new Set<string>();
  private readonly diags: Diagnostic[] = [];
  private readonly blocks: Block[] = [];
  private readonly newNodes: SessionPlan['newNodes'] = { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] };
  private readonly warmupKeys = new Set<string>();
  /** direction in which a non-warm-up block already scores a node as a review */
  private readonly scoredDirection = new Map<string, Direction>();
  /** minutes the warm-up ran over its budget (throttled sessions) */
  private warmupOverrun = 0;
  private due: DueCard[] = [];
  /** the fresh due cards grouped into review items, most overdue first; the warm-up serves a prefix */
  private groups: ReviewGroup[] = [];
  /** the old debt (see budget.ts), grouped the same way; the warm-up pays a capped part of it */
  private debtGroups: ReviewGroup[] = [];
  /** the bank sentences the warm-up's review items are planned in, before the warm-up is built and takes them (a block built ahead of it must not use them) */
  private planned: ReadonlySet<string> = new Set();
  /** debt among the servable due cards, and its minutes */
  private debtCards = 0;
  private debtMinutes = 0;
  /** minutes to review the fresh due cards: what the throttle weighs */
  private dueMinutes = 0;
  /** the learner is back after REENTRY.days or more away */
  private reentry?: { days: number };
  /** debt cards the warm-up pays this session */
  private paidDebt = 0;
  private band: Band = DONE_BAND;
  private minutes = 0;
  private throttled = false;
  private severe = false;
  private owedNew: NodeId[];
  private owedGrammar: NodeId[];
  private drilled?: NodeId;
  private remServed = new Set<NodeId>();
  private readChapter?: string;
  private unit?: Unit;

  constructor(private readonly input: CompileInput) {
    this.L = input.learner;
    this.now = input.now;
    this.tier = input.tier ?? input.learner.settings.tier;
    this.mode = input.mode ?? 'next';
    this.path = input.path;
    this.sessionIndex = this.L.sessionIndex + 1;
    this.seed = sessionSeed(input.learnerId, this.sessionIndex);
    this.rng = makeRng(this.seed);
    this.spr = this.L.secondsPerReview();
    this.known = new Set(this.L.nodes());
    const nowKnown = knownSet(this.L, input.course, this.sessionIndex);
    this.stable = this.L.stableNodes ? this.L.stableNodes(undefined, this.now) : new Set(this.known);
    // lexemes and chunks no unit day teaches: usable in sentences from their priority session, no cards
    for (const id of nowKnown) if (!this.known.has(id)) { this.known.add(id); this.stable.add(id); }
    this.owedNew = [...input.path.owedNew];
    this.owedGrammar = [...input.path.owedGrammar];
  }

  private get course() { return this.input.course; }

  /** Minutes to review the fresh cards due, grouped as the warm-up would serve them (the old debt does not count: it never throttles). */
  dueReviewMinutes(): number {
    this.due = this.L.due(this.now);
    this.planDue();
    return this.dueMinutes;
  }
  private get content() { return this.input.content; }

  // ---------------------------------------------------------------- top level

  compile(): SessionPlan {
    this.unit = this.course.units[this.path.unit];
    this.band = bandAt(this.course, this.path);
    // session length by band and tier (budget.ts); there is no minutes setting
    this.minutes = sessionMinutes(this.tier, this.band);
    this.due = this.L.due(this.now);
    this.planDue();
    const away = this.L.lastSessionAt === undefined ? 0 : (this.now - this.L.lastSessionAt) / DAY_MS;
    if (away >= REENTRY.days) this.reentry = { days: Math.floor(away) };
    const reviewBudget = throttleMinutes(this.tier, this.band);
    this.throttled = this.dueMinutes > reviewBudget;
    this.severe = this.dueMinutes > SEVERE_FACTOR * reviewBudget;
    const day = this.unit?.days[this.path.day];

    if (this.tier === 'minimum') return this.minimum(day);

    if (this.throttled) this.diag({ code: 'throttle', message: `${this.due.length} due ≈ ${this.dueMinutes.toFixed(1)} min > ${reviewBudget} min budget${this.severe ? ' (severe)' : ''}` });
    const d = this.decide(day);
    const c = this.path.coreSessions + 1;

    // built first so its sentences are not taken by the day's blocks (its nodes are marked served if it stays); a return is a warm-up and the story, so the marks wait for the next session
    const remedial = d.converted?.reason === 'reentry' ? undefined : this.backToThese();
    switch (d.type) {
      case 'introduce': this.introduce(day!, d); break;
      case 'drill': this.warmupStd(); this.drill(d.drillNode!, day, d.advances); break;
      case 'input': this.inputDay(day!, d); break;
      case 'patterns': this.patternsDay(day!); break;
      case 'output': this.outputDay(day!, d); break;
      case 'checkpoint': this.checkpointDay(); break;
      case 'review': this.reviewDay(d, day); break;
    }
    if (remedial) {
      let at = 0;
      this.blocks.forEach((x, i) => { if (x.kind === 'warmup') at = i + 1; });
      this.blocks.splice(at, 0, remedial.block);
    }
    this.fitToBudget();
    this.dropBeatOverBudget();
    if (d.type !== 'review') this.storyBeat();
    // a run over misses is an addition, so it goes where the plan cannot hold it (after the new words have been owed to make room); the checkpoint's stays
    if (remedial?.fromMiss && this.blocks.reduce((a, b) => a + b.minutes, 0) + SECONDS.close / 60 + recapMinutes(COUNTS.recapMinCards) > this.minutes + 1e-9) {
      this.blocks.splice(this.blocks.indexOf(remedial.block), 1);
      remedial.nodes = [];
    }
    remedial?.nodes.forEach((n) => this.remServed.add(n));
    if (this.tier === 'extended' && !this.throttled && d.type !== 'review') this.extraReading();
    // placeholder: the runner fills it from the session's lapses and new items
    // its capacity is what the plan has room for (up to 8 cards; fewer or none when the plan is already near its minutes)
    const slack = this.minutes - this.blocks.reduce((a, b) => a + b.minutes, 0) - SECONDS.close / 60;
    const capacity = Math.max(0, Math.min(COUNTS.recapCards, Math.floor((slack + 1e-9) * 60 / SECONDS.recap)));
    this.blocks.push({ kind: 'recap', part: 'core', deliberate: true, capacity, items: [], minutes: recapMinutes(capacity) });
    this.blocks.push(this.close(d, day));

    // Session-level conversion recorded on the block level (input chapter shortage)
    const pathAfter = this.pathAfter(d, c, day);
    const plan: SessionPlan = {
      sessionIndex: this.sessionIndex,
      seed: this.seed,
      tier: this.tier,
      mode: this.mode,
      type: d.type,
      dayType: day?.type,
      unit: this.unit?.id,
      day: day ? this.path.day : undefined,
      converted: d.converted,
      ...(this.reentry ? { reentry: this.reentry } : {}),
      advancesPath: d.advances,
      blocks: this.blocks,
      newNodes: this.newNodes,
      receptiveOnly: this.receptiveOnly,
      budget: {
        band: this.band, minutes: this.minutes, reviewMinutes: reviewBudget, secondsPerReview: this.spr,
        due: this.due.length, dueMinutes: this.dueMinutes, throttled: this.throttled, severe: this.severe,
        ...(this.debtCards ? { debt: { cards: this.debtCards, minutes: round1(this.debtMinutes), paid: this.paidDebt } } : {}),
      },
      estimatedMinutes: round1(this.blocks.reduce((a, b) => a + b.minutes, 0)),
      diagnostics: this.diags,
      pathAfter,
    };
    return plan;
  }

  /** Pick the effective lesson type for this session. Order of precedence: spacing > throttle > the path day. */
  private decide(day: Unit['days'][number] | undefined): Decision {
    const c = this.path.coreSessions + 1;
    if (!day) {
      // course finished: owed drills first, then maintenance review
      const pending = [...this.path.pendingDrills].sort((a, b) => a.at - b.at)[0];
      if (pending) return { type: 'drill', advances: false, drillNode: pending.node };
      this.diag({ code: 'pathDone', message: 'course finished: maintenance review' });
      return { type: 'review', advances: false };
    }
    const dt = day.type;
    // A day whose content this device could not get is not taught as if nobody had written it and then marked done:
    // it is a review day, the path stays, and prepare asks again for what is lacking.
    const lacked = this.lackedBy(day);
    if (lacked.length) {
      this.diag({ code: 'offline', unit: this.unit?.id, message: `${dt} day needs ${lacked.join(', ')}, which this device could not get: reviews only, the path stays` });
      return { type: 'review', advances: false, converted: { from: dt, to: 'review', reason: 'offline' } };
    }
    // Spacing: a pending drill at its last allowed session wins over everything.
    const lastChance = [...this.path.pendingDrills].sort((a, b) => a.at - b.at).find((p) => c - p.at >= DRILL_WITHIN);
    if (lastChance) {
      if (dt === 'drill') return { type: 'drill', advances: true, drillNode: lastChance.node };
      this.diag({ code: 'spacing', node: lastChance.node, message: `drill of ${lastChance.node} due by core session ${lastChance.at + DRILL_WITHIN}` });
      return { type: 'drill', advances: false, drillNode: lastChance.node, converted: { from: dt, to: 'drill', reason: 'spacing' } };
    }
    // back after days away: a short warm-up and the next story beat, and the day waits for the next session
    // (after the spacing rule, which a return does not outrank: a grammar point is drilled within DRILL_WITHIN core sessions however long the break)
    if (this.reentry && this.mode === 'next') return { type: 'review', advances: false, converted: { from: dt, to: 'review', reason: 'reentry' } };
    if (this.throttled && this.mode === 'another') {
      return { type: 'review', advances: false, converted: { from: dt, to: 'review', reason: 'throttle' } };
    }
    if (this.throttled && (dt === 'input' || dt === 'patterns' || (this.severe && dt === 'introduce'))) {
      return { type: 'review', advances: false, converted: { from: dt, to: 'review', reason: 'throttle' } };
    }
    if (dt === 'introduce') {
      const g = this.grammarCandidates(day)[0];
      if (g && this.path.lastGrammarIntroAt === c - 1) {
        const p = [...this.path.pendingDrills].sort((a, b) => a.at - b.at)[0];
        this.diag({ code: 'spacing', node: g, message: 'no grammar introduction in consecutive sessions' });
        if (p) return { type: 'drill', advances: false, drillNode: p.node, converted: { from: dt, to: 'drill', reason: 'spacing' } };
        return { type: 'review', advances: false, converted: { from: dt, to: 'review', reason: 'spacing' } };
      }
      const otherNew = day.focus.some((n) => kindOf(n, this.course.nodes) !== 'grammar' && !this.known.has(n))
        || [...day.chunks, ...day.lexemes].some((n) => !this.known.has(n));
      if (!g && !otherNew) {
        const node = this.drillTarget(day);
        if (node) return { type: 'drill', advances: true, drillNode: node, converted: { from: dt, to: 'drill', reason: 'nothingNew' } };
        return { type: 'review', advances: true, converted: { from: dt, to: 'review', reason: 'nothingNew' } };
      }
      return { type: 'introduce', advances: true, grammarNode: g };
    }
    if (dt === 'drill') {
      const node = this.drillTarget(day);
      if (!node) return { type: 'review', advances: true, converted: { from: dt, to: 'review', reason: 'nothingNew' } };
      return { type: 'drill', advances: true, drillNode: node };
    }
    return { type: dt, advances: true };
  }

  private grammarCandidates(day: Unit['days'][number]): NodeId[] {
    const out: NodeId[] = [];
    for (const n of [...this.owedGrammar, ...day.focus]) {
      if (kindOf(n, this.course.nodes) !== 'grammar' || this.known.has(n) || out.includes(n)) continue;
      out.push(n);
    }
    return out;
  }

  /** What a drill day drills: a pending introduction in the day's focus, else the oldest pending, else the day's known focus. */
  private drillTarget(day: Unit['days'][number]): NodeId | undefined {
    const pending = [...this.path.pendingDrills].sort((a, b) => a.at - b.at);
    const inFocus = pending.find((p) => day.focus.includes(p.node));
    if (inFocus) return inFocus.node;
    if (pending[0]) return pending[0].node;
    const k = day.focus.find((n) => this.known.has(n) && ['grammar', 'pattern'].includes(kindOf(n, this.course.nodes)));
    return k ?? this.path.recentGrammar.find((n) => this.known.has(n));
  }

  // ---------------------------------------------------------------- warm-up

  /**
   * Serve review items (planned groups, most overdue first) while the cost so
   * far is under the cap. A group may overshoot the cap by < MULTI_REVIEW_COST
   * units; fresh reviews are never trimmed below the cap. Then the old debt is
   * paid out of what the warm-up budget has left: at most DEBT.share of it and
   * DEBT.cards cards (more on a review day), none when the fresh cards already
   * fill it. `cards` caps the whole warm-up in cards (a return).
   */
  private warmup(capMinutes: number, budgetMinutes: number, extended: boolean, opts: { cards?: number } = {}): WarmupBlock {
    const capUnits = (capMinutes * 60) / this.spr - 1e-6;
    const items: ReviewItem[] = [];
    let units = 0;
    let covered = 0;
    const room = () => opts.cards === undefined || items.length < opts.cards;
    for (const g of this.groups) {
      if (units >= capUnits || !room()) break;
      items.push(this.reviewItem(g));
      units += reviewCost(g.targets.length);
      covered += g.targets.length;
      for (const t of g.targets) this.warmupKeys.add(t);
    }
    const freshMinutes = units * this.spr / 60;
    this.warmupOverrun = Math.max(0, freshMinutes - budgetMinutes);
    const factor = extended ? DEBT.reviewFactor : 1;
    const debtUnits = (Math.min(DEBT.share * factor * budgetMinutes, Math.max(0, budgetMinutes - freshMinutes)) * 60) / this.spr - 1e-6;
    let paid = 0;
    let spent = 0;
    for (const g of this.debtGroups) {
      if (spent >= debtUnits || paid >= DEBT.cards * factor || !room()) break;
      items.push(this.reviewItem(g));
      spent += reviewCost(g.targets.length);
      covered += g.targets.length;
      paid += g.targets.length;
      for (const t of g.targets) this.warmupKeys.add(t);
    }
    this.paidDebt = paid;
    const minutes = (units + spent) * this.spr / 60;
    const b: WarmupBlock = {
      kind: 'warmup', part: 'warmup', deliberate: false, items,
      minutes: round1(minutes), due: this.due.length, covered, carried: this.due.length - covered,
      budgetMinutes, extended, ...(this.debtCards ? { debt: this.debtCards, paid } : {}),
    };
    this.blocks.push(b);
    return b;
  }

  /** Standard warm-up: everything due fits unless throttled; throttled lets it run over by the cut new items' time. */
  private warmupStd(budget = throttleMinutes(this.tier, this.band)) {
    const cap = this.throttled ? Math.max(budget * THROTTLED_WARMUP_FACTOR, budget) : Math.max(budget, this.dueMinutes);
    return this.warmup(cap, budget, false);
  }

  private reviewItem(g: ReviewGroup): ReviewItem {
    const node = g.targets[0];
    const s = g.sentence;
    if (s) {
      this.usedSentences.add(s.id);
      return {
        op: 'review', id: `rv:${s.id}`, node, targets: [...g.targets], direction: g.direction, sentence: s.id,
        novel: !g.reused, ...(g.reused ? { reused: true } : {}), scoring: 'review', credit: creditOf(node, s),
      };
    }
    if (g.contrast) {
      return { op: 'review', id: `rv:${g.contrast}:${g.direction}`, node, targets: [node], direction: g.direction, contrast: g.contrast, novel: false, scoring: 'review', credit: [node] };
    }
    if (g.script) {
      const { op, index } = g.script;
      return { op: 'review', id: `rv:${node}:${g.direction}:${op === 'readAndPick' ? 'rp' : 'yt'}${index}`, node, targets: [node], direction: g.direction, script: g.script, novel: false, scoring: 'review', credit: [node] };
    }
    this.diag({ code: 'bareReview', block: 'warmup', node, what: 'sentence', wanted: 1, got: 0, message: `no usable sentence for ${node}: bare card` });
    return { op: 'review', id: `rv:${node}:${g.direction}:bare`, node, targets: [node], direction: g.direction, novel: false, scoring: 'review', credit: [node] };
  }

  /**
   * Split what is due into fresh and debt and plan both as review items (the sentence a fresh item takes is not offered to
   * a debt item). Siblings are buried first, over everything due, so a node is still reviewed one way a session.
   */
  private planDue() {
    const servable = this.servableDue();
    const debt = servable.filter((c) => this.isDebt(c));
    const reserved = new Set<string>();
    this.groups = this.planReviews(servable.filter((c) => !debt.includes(c)), reserved);
    this.debtGroups = this.planReviews(debt, reserved);
    this.planned = reserved;
    const cost = (gs: ReviewGroup[]) => gs.reduce((a, g) => a + reviewCost(g.targets.length), 0) * this.spr / 60;
    this.dueMinutes = cost(this.groups);
    this.debtMinutes = cost(this.debtGroups);
    this.debtCards = debt.length;
  }

  /**
   * Old debt: more than DEBT.minDays overdue, or seeded by placement (a node of a unit placement skipped, its card still the
   * one placement made). A reading of the learner's cards; nothing here changes one.
   */
  private isDebt(c: DueCard): boolean {
    if ((this.now - c.due) / DAY_MS > DEBT.minDays) return true;
    const placed = this.input.placedAt;
    if (!placed || (this.course.teachPos.get(c.node) ?? Infinity) >= (this.course.unitStart[placed] ?? 0)) return false;
    return this.L.card(c.node, c.direction)?.reps === SEEDED_REPS;
  }

  /**
   * Due cards minus buried siblings: a node with both cards due is reviewed in
   * one direction per session, since the receptive card shows the Spanish the
   * productive card asks for. Productive wins, unless it is Learning or
   * Relearning while the receptive card is in Review (then receptive wins).
   * The buried card is not rescheduled; it stays due for a later session.
   */
  private servableDue(): DueCard[] {
    const byNode = new Map<NodeId, Partial<Record<Direction, DueCard>>>();
    for (const c of this.due) {
      const e = byNode.get(c.node) ?? {};
      e[c.direction] = c;
      byNode.set(c.node, e);
    }
    return this.due.filter((c) => {
      const e = byNode.get(c.node)!;
      const p = e.productive, r = e.receptive;
      if (!p || !r) return true;
      const keepReceptive = r.state === State.Review && (p.state === State.Learning || p.state === State.Relearning);
      return c.direction === (keepReceptive ? 'receptive' : 'productive');
    });
  }

  /**
   * Group every servable due card into review items. For each card (most overdue
   * first) not yet covered, look at up to MULTI_REVIEW_SCAN usable sentences
   * containing it — unseen, or a review context reusable after
   * REVIEW_REUSE_DAYS — and take the one that also contains the most other
   * uncovered due cards of the same direction (≤ MULTI_REVIEW_MAX targets in
   * all). Ties: an unseen sentence while some target still needs its first
   * recombination pass (novelPasses = 0), else a reused one (saves supply);
   * then scan order. No usable sentence: a bare card.
   */
  private planReviews(due: readonly DueCard[], reserved: Set<string>): ReviewGroup[] {
    const open: Record<Direction, Set<NodeId>> = { receptive: new Set(), productive: new Set() };
    for (const c of due) open[c.direction].add(c.node);
    const novelMemo = new Map<NodeId, boolean>();
    const needsNovel = (id: NodeId) => {
      let v = novelMemo.get(id);
      if (v === undefined) { v = (this.L.node(id)?.novelPasses ?? 0) === 0; novelMemo.set(id, v); }
      return v;
    };
    const groups: ReviewGroup[] = [];
    for (const card of due) {
      const pool = open[card.direction];
      if (!pool.has(card.node)) continue;
      pool.delete(card.node);
      let best: { s: SentenceRef; extras: NodeId[]; reused: boolean; score: number } | undefined;
      let scanned = 0;
      const novelWanted = needsNovel(card.node);
      outer: for (const list of [this.content.byTarget.get(card.node), this.content.byRequire.get(card.node)]) {
        if (!list) continue;
        for (const id of list) {
          if (scanned >= MULTI_REVIEW_SCAN) break outer;
          if (reserved.has(id) || this.usedSentences.has(id)) continue;
          let reused = false;
          if (this.L.ledger.hasSeen('sentence', id)) {
            if (!this.L.ledger.reviewReusable(id, this.now, REVIEW_REUSE_DAYS)) continue;
            reused = true;
          }
          const s = this.content.sentences.get(id)!;
          if (card.direction === 'productive' && s.readOnly) continue;
          if (!this.gated(s.requires)) continue;
          scanned++;
          const extras: NodeId[] = [];
          for (const r of s.requires) {
            if (extras.length >= MULTI_REVIEW_MAX - 1) break;
            if (r !== card.node && pool.has(r)) extras.push(r);
          }
          const wantNovel = novelWanted || (extras.length > 0 && extras.some(needsNovel));
          const fresh = reused ? (wantNovel ? 0 : 1) : (wantNovel ? 1 : 0);
          const score = extras.length * 2 + fresh;
          if (!best || score > best.score) best = { s, extras, reused, score };
          if (extras.length >= MULTI_REVIEW_MAX - 1 && fresh === 1) break outer;
        }
      }
      if (!best) {
        const contrast = this.contrastReview(card.node);
        groups.push({ direction: card.direction, targets: [card.node], reused: false, ...(contrast ? { contrast } : { script: this.scriptReview(card.node, card.direction) }) });
        continue;
      }
      reserved.add(best.s.id);
      for (const x of best.extras) pool.delete(x);
      groups.push({ direction: card.direction, targets: [card.node, ...best.extras], sentence: best.s, reused: best.reused });
    }
    return groups;
  }

  /**
   * The contrast item a due contrast is reviewed with, when the contrast has items the learner can be shown (everything the
   * item's sentence needs is known): the session number moves it on, so two sessions in a row never ask the same one, and a
   * contrast due twice in a session is not asked the same way twice.
   */
  private contrastReview(node: NodeId): string | undefined {
    const pool = (this.content.contrasts.get(node) ?? []).filter((r) => this.gated(r.requires));
    if (!pool.length) return undefined;
    const start = (hash32(node) + this.sessionIndex) % pool.length;
    const pick = pool.map((_, k) => pool[(start + k) % pool.length]).find((r) => !this.usedContrast.has(r.id)) ?? pool[start];
    this.usedContrast.add(pick.id);
    return pick.id;
  }

  /**
   * The script item a due contrast is reviewed with (as is any other node that has no sentence left and no pair to ask about):
   * read-and-pick for a receptive card, your-turn for a productive one and for a contrast a choice cannot test (the other when the script has none of that sort), and the
   * session number moves it on, so two sessions in a row never serve the same one.
   */
  private scriptReview(node: NodeId, direction: Direction): ReviewItem['script'] {
    const n = this.course.nodes.get(node);
    // a node with no pair to ask about has nothing else to be reviewed with once its sentences are used: the card would only be shown, and never graded
    if (kindOf(node, this.course.nodes) !== 'contrast' && (!n || alignedPairs(n).length)) return undefined;
    const sc = this.content.scripts.get(node);
    if (!sc) return undefined;
    // aspect and near-synonyms are typed whichever way round, here as on their own items
    const want = direction === 'receptive' && !this.content.typedContrasts.has(node) ? 'readAndPick' : 'yourTurn';
    const op = sc[want] ? want : want === 'readAndPick' ? 'yourTurn' : 'readAndPick';
    return sc[op] ? { op, index: (hash32(node) + this.sessionIndex) % sc[op] } : undefined;
  }

  // ---------------------------------------------------------------- content selection

  private gated(requires: readonly NodeId[]): boolean {
    return admissible(requires, (r) => this.known.has(r) || this.sessionNew.has(r), this.course.nodes);
  }

  /**
   * Whether what `requires` lacks is only what the learner is owed: chunks, lexemes and patterns the unit has scheduled by
   * today (so the path has passed them) and not yet taught. A chapter or a scene may go ahead on those, glossed (R26); a grammar
   * point, a contrast, or a word the unit has not reached still holds it back.
   */
  private owedOnly(requires: readonly NodeId[]): boolean {
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const missing = unmetRequires(requires, (r) => this.known.has(r) || this.sessionNew.has(r), this.course.nodes);
    return missing.every((r) => ['chunk', 'lexeme', 'pattern'].includes(kindOf(r, this.course.nodes)) && (this.course.teachPos.get(r) ?? Infinity) <= here);
  }

  /** How many of `requires` are owed words the story goes ahead without. */
  private owedCount(requires: readonly NodeId[]): number {
    return unmetRequires(requires, (r) => this.known.has(r) || this.sessionNew.has(r), this.course.nodes).length;
  }

  /**
   * Reading coverage against what is retained, not merely introduced. A
   * required node that is introduced but not stable counts as unknown-glossed:
   * allowed up to 5% of the requirement (at least one); one that is not
   * introduced at all is unknown-unglossed, which is gated out (the 2% cap is
   * under one node for any chapter this size). Items taught today are fresh.
   */
  private coverage(requires: readonly NodeId[]): { required: number; unstable: number; unknown: number; allowed: number; admitted: boolean } {
    const need = [...new Set(requires)];
    let unstable = 0, unknown = 0;
    for (const r of need) {
      if (this.sessionNew.has(r) || this.stable.has(r)) continue;
      if (this.known.has(r)) unstable++; else unknown++;
    }
    const allowed = Math.max(1, Math.floor(need.length * 0.05));
    return { required: need.length, unstable, unknown, allowed, admitted: unstable <= allowed };
  }

  /**
   * Up to n UNSEEN, GATED sentences containing `node`, never one already used
   * in this plan. Sentences written for the node (targets) come first; the
   * RNG only orders candidates within each group. `typed`: the learner will be
   * asked for the Spanish, so a row that needs a recognition-only node is out.
   */
  private pickSentences(node: NodeId, n: number, opts: { question?: boolean; unit?: string; seen?: boolean; avoid?: ReadonlySet<string>; typed?: boolean } = {}): SentenceRef[] {
    if (n <= 0) return [];
    const want = Math.max(n * 2, n + 4);
    const groups: SentenceRef[][] = [];
    let total = 0;
    for (const list of [this.content.byTarget.get(node), this.content.byRequire.get(node)]) {
      const g: SentenceRef[] = [];
      if (list) {
        for (const id of list) {
          if (total + g.length >= want) break;
          if (this.usedSentences.has(id) || opts.avoid?.has(id) || this.L.ledger.hasSeen('sentence', id) !== !!opts.seen) continue;
          const s = this.content.sentences.get(id)!;
          if (opts.question && !s.own) continue;
          if (opts.typed && s.readOnly) continue;
          if (!this.gated(s.requires)) continue;
          g.push(s);
        }
      }
      total += g.length;
      groups.push(this.rng.shuffle(g));
      if (total >= n) break;
    }
    const out = groups.flat().slice(0, n);
    for (const s of out) this.usedSentences.add(s.id);
    return out;
  }

  /** Unseen gated sentences from a unit's bank (extended-tier reading). */
  private pickFromUnit(unitId: string, n: number): SentenceRef[] {
    const out: SentenceRef[] = [];
    for (const id of this.content.byUnit.get(unitId) ?? []) {
      if (out.length >= n) break;
      if (this.usedSentences.has(id) || this.L.ledger.hasSeen('sentence', id)) continue;
      const s = this.content.sentences.get(id)!;
      if (this.gated(s.requires)) { out.push(s); this.usedSentences.add(id); }
    }
    return out;
  }

  /**
   * The chapter to read now: the FIRST unread chapter in story order that the
   * path has reached (earlier units, or this unit up to today) and that passes
   * the gate. A chapter skipped earlier (gated by a throttle cut) is caught up
   * here, so the story is never silently dropped and never re-served. The story
   * is the library's, whole, when the course ships one: a chapter this device
   * has not loaded is passed over, since only a loaded one can be gated or read.
   * A learner placed part way through the course starts at their own unit.
   * `glossed`: the chapter is admitted whatever the coverage rule says (it still has to pass the gate).
   */
  private chapterFor(day: Unit['days'][number] | undefined, probe = false, glossed = false): { ch?: ChapterRef; reason?: 'seen' | 'missing' | 'gated' | 'unavailable'; blocked?: string } {
    let blocked: string | undefined;
    const unread = unreadChapters(this.content.story ?? this.content.chapters, this.course, this.path, this.input.placedAt ?? 0, (id) => this.L.ledger.hasSeen('chapter', id));
    for (const s of unread) {
      const c = this.content.chapterById.get(s.id);
      if (!c) {
        // the next chapter in line is one this device could not get: the story is not read past it
        if (!blocked && this.content.lacking?.has(lackKey('story', s.id))) return { reason: 'unavailable', blocked: s.id };
        continue;
      }
      if (this.gated(c.requires) || this.owedOnly(c.requires)) {
        const cov = this.coverage(c.requires);
        // `glossed`: the reader glosses every word, so words that are slipping do not hold the chapter back (the learner returning after days away)
        if (cov.admitted || glossed) {
          if (cov.unstable && !probe) this.diag({ code: 'coverage', block: 'read', unit: c.unit, coverage: cov, message: `chapter ${c.id}: ${cov.unstable}/${cov.required} required words introduced but slipping (glossed, ${cov.admitted ? 'within' : 'over'} cap ${cov.allowed})` });
          if (cov.unknown && !probe) this.diag({ code: 'coverage', block: 'read', unit: c.unit, coverage: cov, message: `chapter ${c.id}: ${this.owedCount(c.requires)} owed words, glossed` });
          return { ch: c };
        }
        if (!probe) {
          this.slipping.add(c.id);
          this.diag({ code: 'coverage', block: 'read', unit: c.unit, coverage: cov, message: `chapter ${c.id} waits: ${cov.unstable}/${cov.required} required words are slipping (cap ${cov.allowed})` });
        }
      }
      blocked ??= c.id;
    }
    if (blocked) return { reason: 'gated', blocked };
    if (day?.chapter && this.L.ledger.hasSeen('chapter', day.chapter)) return { reason: 'seen' };
    return { reason: day?.chapter && !this.content.chapterById.has(day.chapter) ? 'missing' : 'seen' };
  }

  /**
   * What the day needs that the build has and this device could not get (empty when nothing is lacking, and
   * for anything nobody wrote: a gap in the authoring is a shortage, not a download that failed). The course's
   * own files, without which no day is the right one; then the unit's
   * sentences; the scripts of what it teaches, owed grammar first; the chapter it reads, or one before it that
   * is owed; the scene and the writing of an output day.
   */
  private lackedBy(day: Unit['days'][number]): string[] {
    const lacking = this.content.lacking;
    if (!lacking?.size || !this.unit) return [];
    // the course itself is short: the day under the path is not the learner's, whatever its type, so the path does not move on it
    const course = [...lacking].filter(lacksCourse);
    if (course.length) return course;
    // a review day teaches nothing of its unit's: it needs only what the learner has already met
    if (day.type === 'review') return [];
    const unit = this.unit.id;
    const need = [lackKey('bank', unit)];
    const owed = day.type === 'introduce' ? this.grammarCandidates(day).slice(0, 1) : [];
    for (const n of new Set([...owed, ...day.focus])) if (['grammar', 'pattern', 'contrast'].includes(kindOf(n, this.course.nodes))) need.push(lackKey('scripts', n));
    if (day.type === 'output' || day.type === 'checkpoint') need.push(lackKey('scenes', unit), lackKey('writing', unit));
    const lacked = need.filter((k) => lacking.has(k));
    if (day.chapter && (day.type === 'introduce' || day.type === 'input')) {
      const next = this.chapterFor(day, true);
      if (next.reason === 'unavailable') lacked.push(lackKey('story', next.blocked!));
    }
    return lacked;
  }

  private sceneFor(preferred: string | undefined): string | undefined {
    const ok = (id: string) => {
      const s = this.content.scenes.get(id);
      return !!s && !this.L.ledger.hasSeen('scene', id) && (this.gated(s.requires) || this.owedOnly(s.requires));
    };
    if (preferred && ok(preferred)) return preferred;
    if (preferred && this.L.ledger.hasSeen('scene', preferred)) this.diag({ code: 'alreadySeen', block: 'scene', message: `scene ${preferred} already played` });
    // the unit's other scenes not reserved for another day, then earlier units, most recent first
    const ui = this.path.unit;
    for (let i = ui; i >= 0; i--) {
      const u = this.course.units[i];
      if (!u) continue;
      const reserved = new Set(u.days.map((d) => d.scene).filter(Boolean));
      for (const id of this.content.scenesByUnit.get(u.id) ?? []) if (id !== preferred && !reserved.has(id) && ok(id)) return id;
    }
    return undefined;
  }

  private taskFor(focus?: NodeId): string | undefined {
    const ok = (id: string) => {
      const t = this.content.tasks.get(id);
      return !!t && !this.L.ledger.hasSeen('item', `wt:${id}`) && this.gated(t.requires);
    };
    if (focus) {
      for (const [id, t] of this.content.tasks) if (t.focus === focus && ok(id)) return id;
      return undefined;
    }
    for (let i = this.path.unit; i >= 0; i--) {
      const u = this.course.units[i];
      if (!u) continue;
      const ids = this.content.tasksByUnit.get(u.id) ?? [];
      const unfocused = ids.find((id) => ok(id) && !this.content.tasks.get(id)!.focus);
      if (unfocused) return unfocused;
      const any = ids.find(ok);
      if (any) return any;
    }
    return undefined;
  }

  // ---------------------------------------------------------------- new items

  /**
   * Choose the new chunks/lexemes/patterns/contrasts for this session. Owed
   * items come first (FIFO, so a cut item is never starved), then the day's.
   * Throttled sessions take none. Anything of an advancing day not taken
   * becomes owed, so cutting never loses an item.
   */
  private takeNew(type: LessonType, day: Unit['days'][number] | undefined, advancing: boolean, opts: { focusNonGrammar?: boolean; force?: readonly NodeId[]; max?: number; kinds?: readonly GraphNode['kind'][] } = {}): LearnItem[] {
    // Throttled: the warm-up's overrun comes out of new-item time, lexemes first, then chunks;
    // severe backlog, or a drill day's optional words under a backlog: none at all.
    // Days that teach nothing new of their own (or do not advance) only repay owed items.
    const repay = !advancing || !day || LEXEME_CAP[type] === 0;
    const base = repay
      ? REPAY_CAP
      : { lexeme: LEXEME_CAP[type], chunk: CHUNK_CAP, pattern: type === 'patterns' ? PATTERNS_DAY_CAP : PATTERN_CAP, contrast: CONTRAST_CAP };
    const open = !this.severe && !(this.throttled && (type === 'drill' || repay));
    let cut = this.throttled ? Math.ceil((this.warmupOverrun * 60) / SECONDS.learn) : 0;
    const lexCap = open ? Math.max(0, base.lexeme - cut) : 0;
    cut = Math.max(0, cut - base.lexeme);
    const chunkCap = open ? Math.max(0, base.chunk - cut) : 0;
    const patCap = open && !this.throttled ? base.pattern : 0;
    // a contrast is taught from its script, and only a drill day makes the room for that (see drill): any other day leaves it owed
    const conCap = open && !this.throttled && type === 'drill' ? base.contrast : 0;
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const dayItems: NodeId[] = advancing && day
      ? [...(opts.focusNonGrammar ? day.focus.filter((n) => kindOf(n, this.course.nodes) !== 'grammar') : []), ...day.chunks, ...day.lexemes]
        .filter((n) => (this.course.teachPos.get(n) ?? here) <= here)
      : [];
    const maxTotal = Math.min(this.path.coreSessions < EARLY_SESSIONS ? EARLY_NEW_ITEMS_MAX : Infinity, opts.max ?? Infinity);
    const taken: NodeId[] = [];
    const owed: NodeId[] = [];
    const counts = { chunk: 0, lexeme: 0, pattern: 0, contrast: 0 };
    const caps = { chunk: chunkCap, lexeme: lexCap, pattern: patCap, contrast: conCap };
    const seen = new Set<NodeId>();
    const force = new Set(opts.force ?? []);
    for (const id of [...force, ...this.owedNew, ...dayItems]) { // owed first: a cut item is never starved
      if (seen.has(id)) continue;
      seen.add(id);
      if (this.known.has(id) || this.sessionNew.has(id)) continue;
      const k = kindOf(id, this.course.nodes);
      if (opts.kinds && !opts.kinds.includes(k)) { owed.push(id); continue; }
      const bucket = (k === 'chunk' || k === 'pattern' || k === 'contrast') ? k : 'lexeme';
      if (k === 'contrast' && !this.contrastReady(id)) {
        this.diag({ code: 'notReady', node: id, message: `contrast ${id} waits until both sides are known` });
        owed.push(id); continue;
      }
      if (k === 'pattern') {
        const req = this.course.nodes.get(id)?.requires ?? [];
        if (!req.every((r) => this.known.has(r) || this.sessionNew.has(r) || kindOf(r, this.course.nodes) === 'lexeme')) {
          this.diag({ code: 'notReady', node: id, message: `pattern ${id} waits for its prerequisites` });
          owed.push(id); continue;
        }
      }
      if (force.has(id)) { taken.push(id); this.sessionNew.add(id); }
      else if (counts[bucket] < caps[bucket] && taken.length < maxTotal) { counts[bucket]++; taken.push(id); this.sessionNew.add(id); }
      else owed.push(id);
    }
    if (owed.length && dayItems.length) this.diag({ code: 'deferred', message: `${owed.length} new item(s) owed to later sessions${this.throttled ? ' (throttled)' : ''}` });
    this.owedNew = owed;
    // examples are picked after every new node is in sessionNew
    const items: LearnItem[] = taken.map((id) => {
      const k = kindOf(id, this.course.nodes);
      if (k === 'chunk') this.newNodes.chunks.push(id);
      else if (k === 'pattern') this.newNodes.patterns.push(id);
      else if (k === 'contrast') this.newNodes.contrasts.push(id);
      else this.newNodes.lexemes.push(id);
      const productive = this.productive(id, k);
      if (!productive) this.receptiveOnly.push(id);
      const gn = this.course.nodes.get(id);
      const cognate = k === 'lexeme' && productive && !!gn?.es && !!gn.en && isCognate(gn.es, gn.en);
      return { op: 'learn', id: `ln:${id}`, node: id, nodeKind: k, retrievals: cognate ? 2 : 4, ...(cognate ? { cognate } : {}), productive, scoring: 'learning', credit: [id] } as LearnItem;
    });
    for (const it of items) {
      const [s] = this.pickSentences(it.node, 1);
      if (s) { it.example = s.id; it.credit = creditOf(it.node, s); }
    }
    return items;
  }

  /** Whether the learner is to produce this node: false for one that is recognition only (and for a lexeme kept receptive-only). */
  private producible(id: NodeId): boolean {
    return this.productive(id, kindOf(id, this.course.nodes));
  }

  /** productivePolicy for a node; a lexeme absent from the graph takes the band of the unit teaching it. */
  private productive(id: NodeId, kind: GraphNode['kind']): boolean {
    const n = this.course.nodes.get(id);
    return productivePolicy({ kind, band: n?.band ?? this.unit?.band, freqRank: n?.freqRank, recognition: !!n && recognitionOnly(n) });
  }

  /**
   * The plan must fit the session minutes. Reviews are never trimmed and the
   * day's teaching is the point of the day, so what gives is the learn pool:
   * new items come off its end (owed, first in line next session) until the
   * estimate fits, skipping any item other content in the plan needs.
   */
  private fitToBudget() {
    const learn = this.blocks.find((b): b is LearnBlock => b.kind === 'learn');
    if (!learn) return;
    // the "Before you go" block is appended after this and counts toward the session's minutes (at least RECAP_MIN_CARDS of it)
    const total = () => this.blocks.reduce((a, b) => a + b.minutes, 0) + SECONDS.close / 60 + recapMinutes(COUNTS.recapMinCards);
    const removed: NodeId[] = [];
    for (let i = learn.items.length - 1; i >= 0 && total() > this.minutes + 1e-9; i--) {
      const it = learn.items[i];
      if (this.neededElsewhere(it)) continue;
      learn.items.splice(i, 1);
      learn.minutes = round1(learn.items.reduce((a, it) => a + learnSeconds(it), 0) / 60);
      for (const k of Object.keys(this.newNodes) as (keyof SessionPlan['newNodes'])[]) {
        this.newNodes[k] = this.newNodes[k].filter((n) => n !== it.node);
      }
      const r = this.receptiveOnly.indexOf(it.node);
      if (r >= 0) this.receptiveOnly.splice(r, 1);
      this.sessionNew.delete(it.node);
      removed.unshift(it.node);
    }
    if (!learn.items.length) this.blocks.splice(this.blocks.indexOf(learn), 1);
    if (removed.length) {
      this.owedNew = [...removed, ...this.owedNew.filter((n) => !removed.includes(n))];
      this.diag({ code: 'deferred', block: 'learn', message: `${removed.length} new item(s) owed: the plan was over ${this.minutes} min` });
    }
  }

  /** Whether any other content in the plan (sentences, chapter, scene, task) requires this learn item's node. */
  private neededElsewhere(item: LearnItem): boolean {
    const others = this.blocks.map((b) => (b.kind === 'learn' ? { ...b, items: b.items.filter((x) => x !== item) } : b));
    const plan = { blocks: others } as unknown as SessionPlan;
    for (const ref of servedRefs(plan)) {
      const req = ref.kind === 'sentence' ? this.content.sentences.get(ref.id)?.requires
        : ref.kind === 'chapter' ? this.content.chapterById.get(ref.id)?.requires
          : ref.kind === 'scene' ? this.content.scenes.get(ref.id)?.requires
            : ref.kind === 'item' && ref.id.startsWith('wt:') ? this.content.tasks.get(ref.id.slice(3))?.requires
              : undefined;
      if (req?.includes(item.node)) return true;
    }
    return false;
  }

  private contrastReady(id: NodeId): boolean {
    const sides = contrastSides(this.course.nodes.get(id));
    return sides.length > 0 && sides.every((s) => this.known.has(s));
  }

  private pushLearn(items: LearnItem[]) {
    if (!items.length) return;
    this.blocks.push({ kind: 'learn', part: 'core', deliberate: false, items, minutes: round1(items.reduce((a, it) => a + learnSeconds(it), 0) / 60) });
  }

  // ---------------------------------------------------------------- lesson types

  private introduce(day: Unit['days'][number], d: Decision) {
    this.warmupStd();
    const g = d.grammarNode;
    const rest = this.grammarCandidates(day).filter((n) => n !== g);
    if (g) {
      this.sessionNew.add(g);
      this.newNodes.grammar.push(g);
      if (!this.productive(g, 'grammar')) this.receptiveOnly.push(g);
      const req = this.course.nodes.get(g)?.requires ?? [];
      const missing = req.filter((r) => !this.known.has(r) && !this.sessionNew.has(r));
      if (missing.length) this.diag({ code: 'prereq', node: g, message: `${g} introduced before ${missing.join(', ')}` });
    }
    if (rest.length) this.diag({ code: 'deferred', message: `grammar ${rest.join(', ')} owed (one grammar point per session)` });
    this.owedGrammar = rest;
    const learn = this.takeNew('introduce', day, true, { focusNonGrammar: true });
    this.pushLearn(learn);
    const { ch, reason, blocked } = this.chapterFor(day);
    // Day 1 of the course: the first chapter comes after the new phrases and before the lesson (L6), so the story is read by about minute 8
    // instead of minute 14. It uses the phrases it has just been given; nothing is taken out, the lesson follows it.
    const early = this.path.coreSessions === 0 && this.path.unit === 0 && this.path.day === 0 && !!ch;
    if (early) this.pushRead(ch!);
    if (g) this.blocks.push(...this.teach(g, 'full'));
    if (!early) {
      if (ch) this.pushRead(ch);
      else if (day.chapter) this.chapterProblem(blocked ?? day.chapter, reason!);
    }
    // a point the learner only recognises is not said about themselves, any more than it is drilled that way
    if (g && this.content.scripts.has(g) && this.producible(g)) this.blocks.push({ kind: 'personal', part: 'core', deliberate: false, node: g, minutes: round1(SECONDS.personal / 60) });
  }

  /**
   * Teach one node from its script; falls back to bank examples + practice when the script is missing.
   * `reason` labels the block; `introduced`: the learner already has the node, so nothing in the script is a learning step.
   */
  private teach(node: NodeId, depth: 'full' | 'light', opts: { reason?: TeachBlock['reason']; introduced?: boolean } = {}): Block[] {
    const script = this.content.scripts.get(node);
    const kind = kindOf(node, this.course.nodes);
    const items: ScriptItem[] = [];
    if (!script) {
      this.diag({ code: 'shortage', block: 'teach', node, what: 'script', wanted: 1, got: 0, unit: this.unit?.id, message: `no TeachingScript for ${node}` });
      const examples = this.pickSentences(node, 3).map((s) => s.id);
      const out: Block[] = [{ kind: 'teach', part: 'core', deliberate: false, node, nodeKind: kind, script: false, parts: ['examples'], items, examples, minutes: round1((SECONDS.examples + SECONDS.rule) / 60) }];
      // the in-lesson learning steps come from bank practice instead of the script's yourTurn
      const si = this.practice('structuredInput', node, 6, ['pick'], 'receptive', { focus: node, push: false });
      const co = this.practice('controlledOutput', node, 5, ['choose', 'type', 'transform'], 'productive', { focus: node, push: false, ladder: true });
      co?.items.forEach((it) => { it.scoring = 'learning'; });
      if (si) out.push(si);
      if (co) out.push(co);
      return out;
    }
    const rp = depth === 'full' ? script.readAndPick : Math.min(4, script.readAndPick);
    const yt = depth === 'full' ? script.yourTurn : Math.min(3, script.yourTurn);
    for (let i = 0; i < rp; i++) items.push({ op: 'readAndPick', id: `sc:${node}:rp:${i}`, node, index: i, scoring: 'exposure', credit: [node] });
    for (let i = 0; i < yt; i++) items.push({ op: 'yourTurn', id: `sc:${node}:yt:${i}`, node, index: i, scoring: i < 5 && !opts.introduced ? 'learning' : 'exposure', credit: [node] });
    const secs = (depth === 'full' ? SECONDS.hook + SECONDS.rule : 0) + SECONDS.examples + rp * SECONDS.readAndPick + yt * SECONDS.yourTurn;
    const parts: TeachBlock['parts'] = depth === 'full' ? ['hook', 'examples', 'rule', 'readAndPick', 'yourTurn', 'pitfalls'] : ['examples', 'readAndPick', 'yourTurn'];
    return [{ kind: 'teach', part: 'core', deliberate: false, node, nodeKind: kind, script: true, parts, items, examples: [], minutes: round1(secs / 60), ...(opts.reason ? { reason: opts.reason } : {}) }];
  }

  /** A practice block on one node; returns undefined (and logs a shortage) when nothing gated and unseen is left. */
  private practice(
    kind: PracticeBlock['kind'], node: NodeId, n: number, ops: PracticeOp[], direction: 'receptive' | 'productive',
    opts: { focus?: NodeId; firstScoring?: 'review' | 'exposure'; question?: boolean; push?: boolean; ladder?: boolean; fallbackOp?: PracticeOp } = {},
  ): PracticeBlock | undefined {
    // rung-3 slots re-inflect a sentence already seen; with none, they fall back to transform on an unseen one
    const want = opts.ladder ? this.ladderOps(node, n) : undefined;
    const reSlots = want ? want.filter((o) => o === 'recombine').length : 0;
    const typed = direction === 'productive';
    const seenQ = reSlots ? this.pickSentences(node, reSlots, { seen: true, typed }) : [];
    const unseenN = n - seenQ.length;
    let sents = this.pickSentences(node, unseenN, { question: opts.question, typed });
    const nQ = sents.length;
    if (opts.question && sents.length < unseenN) sents = sents.concat(this.pickSentences(node, unseenN - sents.length, { typed }));
    const laddered: PracticeOp[] | undefined = want ? [] : undefined;
    if (want) {
      const pool = [...sents];
      const seenPool = [...seenQ];
      const picked: SentenceRef[] = [];
      for (const o of want) {
        if (o === 'recombine' && seenPool.length) { picked.push(seenPool.shift()!); laddered!.push('recombine'); continue; }
        const u = pool.shift();
        if (u) { picked.push(u); laddered!.push(o === 'recombine' ? 'transform' : o); }
      }
      sents = picked;
    }
    if (sents.length < n) this.diag({ code: 'shortage', block: kind, node, what: 'sentence', wanted: n, got: sents.length, unit: this.unit?.id, message: `${kind}: ${sents.length}/${n} unseen gated sentences for ${node}` });
    if (opts.question && nQ < unseenN) this.diag({ code: 'shortage', block: kind, node, what: 'question', wanted: unseenN, got: nQ, unit: this.unit?.id, message: `${kind}: ${nQ}/${unseenN} unseen gated questions for ${node}` });
    if (!sents.length) return undefined;
    const items = sents.map((s, i) => this.practiceItem(laddered ? laddered[i] : opts.question && i >= nQ ? (opts.fallbackOp ?? ops[i % ops.length]) : ops[i % ops.length], node, s, direction, i === 0 ? (opts.firstScoring ?? 'exposure') : 'exposure'));
    const b: PracticeBlock = { kind, part: 'core', deliberate: false, focus: opts.focus, items, minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60) };
    if (opts.push !== false) this.blocks.push(b);
    return b;
  }

  /**
   * The ops for `n` items on one node, from its ladder rung: choose, type,
   * transform, recombine. From rung 1 up, about one
   * item in four is a translation. At streak 1 the last item is a probe at
   * the next rung, so a climb can happen inside the block.
   */
  private ladderOps(node: NodeId, n: number): PracticeOp[] {
    const cap = kindOf(node, this.course.nodes) === 'lexeme' ? 1 : 3;
    const rung = Math.min((this.L.rung?.(node) ?? 0), cap);
    const out: PracticeOp[] = [];
    for (let i = 0; i < n; i++) out.push(rung >= 1 && i % 4 === 3 ? 'translate' : LADDER_OPS[rung]);
    if (n > 1 && rung < cap && (this.L.rungStreak?.(node) ?? 0) === 1) out[n - 1] = LADDER_OPS[rung + 1];
    return out;
  }

  /** One older-point item's op: its own rung's op, with the same translate share by position. */
  private ladderOp(node: NodeId, k: number): PracticeOp {
    const cap = kindOf(node, this.course.nodes) === 'lexeme' ? 1 : 3;
    const rung = Math.min((this.L.rung?.(node) ?? 0), cap);
    const op = rung >= 1 && k % 4 === 3 ? 'translate' : LADDER_OPS[rung];
    return op === 'recombine' ? 'transform' : op;   // an older point's sentence is unseen: nothing to re-inflect
  }

  private practiceItem(op: PracticeOp, node: NodeId, s: SentenceRef, direction: 'receptive' | 'productive', scoring: 'review' | 'exposure' | 'none'): PracticeItem {
    // a recombine item re-serves a known sentence: its id carries the session so the item (and its variant) is new each time
    const id = op === 'recombine' ? `${op}:${s.id}:s${this.sessionIndex}` : `${op}:${s.id}`;
    return { op, id, node, sentence: s.id, direction, scoring, credit: creditOf(node, s) };
  }

  /** Scoring for the first item on a node: a real review if the card exists and the warm-up did not already review it. */
  private firstScoring(node: NodeId, direction: 'receptive' | 'productive'): 'review' | 'exposure' {
    // a node is scored in one direction per session (the other card is buried)
    const other = this.scoredDirection.get(node);
    if (!this.L.hasCard(node, direction) || this.warmupKeys.has(node) || (other && other !== direction)) return 'exposure';
    this.scoredDirection.set(node, direction);
    return 'review';
  }

  /** Known remediation nodes still owed servings, oldest mark first (at most `max`). */
  private shakyNodes(max: number): NodeId[] {
    return [...(this.path.remediate ?? [])]
      .filter((e) => (e.served ?? 0) < REMEDIATE_MAX_SERVED && this.known.has(e.node))
      .sort((a, b) => a.at - b.at)
      .map((e) => e.node)
      .slice(0, max);
  }

  /**
   * The session after a checkpoint opens (after the warm-up) with a short run over what was marked shaky, and so does one after a
   * session in which practice items were missed (F7), over those targets, in sentences not seen: three items at most, since it comes
   * on top of the day. Each mark is served this way once.
   */
  private backToThese(): { block: PracticeBlock; nodes: NodeId[]; fromMiss: boolean } | undefined {
    const last = this.path.log[this.path.log.length - 1];
    const afterCheck = last?.dayType === 'checkpoint';
    const missed = (this.path.remediate ?? []).filter((e) => e.reason === 'miss' && !e.served && this.known.has(e.node)).sort((a, b) => a.at - b.at).map((e) => e.node);
    if (!afterCheck && !missed.length) return undefined;
    const nodes = (afterCheck ? this.shakyNodes(3) : missed.slice(0, 3)).filter((n) => this.producible(n));
    if (!nodes.length) return undefined;
    const items: PracticeItem[] = [];
    for (let i = 0; items.length < (afterCheck ? 6 : 3) && i < 18; i++) {
      const src = nodes[i % nodes.length];
      const [s] = this.pickSentences(src, 1, { avoid: this.planned, typed: true });
      if (s) items.push(this.practiceItem(this.ladderOp(src, items.length), src, s, 'productive', 'exposure'));
    }
    if (!items.length) return undefined;
    const b: PracticeBlock = { kind: 'controlledOutput', part: 'core', deliberate: false, remedial: afterCheck ? true : 'miss', focus: nodes[0], items, minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60) };
    return { block: b, nodes, fromMiss: !afterCheck };
  }

  private drill(node: NodeId, day: Unit['days'][number] | undefined, advancing: boolean) {
    this.drilled = node;
    this.blocks.push({ kind: 'ruleRecall', part: 'core', deliberate: true, node, minutes: round1(SECONDS.ruleRecall / 60) });
    // A recognition-only point (voseo, the future subjunctive) is drilled by reading: more picks, and nothing the learner would have to say
    const produce = this.producible(node);
    const nPicks = COUNTS.structuredInput + (produce ? 0 : RECOGNITION_EXTRA_PICKS);
    const si = this.practice('structuredInput', node, nPicks, ['pick'], 'receptive', { focus: node, firstScoring: this.firstScoring(node, 'receptive') });
    this.scriptFallback(node, 'readAndPick', nPicks - (si?.items.length ?? 0));

    // Controlled output, interleaved: ~60% latest, ~40% older points + a known contrast.
    const total = COUNTS.controlledOutput;
    const shaky = this.shakyNodes(2).filter((n) => n !== node && this.producible(n));
    const older = !produce ? [] : [
      ...shaky,
      ...(day?.focus ?? []).filter((n) => n !== node && this.known.has(n) && ['grammar', 'pattern'].includes(kindOf(n, this.course.nodes)) && this.producible(n)),
      ...this.path.recentGrammar.filter((n) => n !== node && this.known.has(n) && this.producible(n)),
    ].filter((n, i, a) => a.indexOf(n) === i).slice(0, 3);
    for (const n of older) if (shaky.includes(n)) this.remServed.add(n);
    const contrast = produce ? this.pickContrast([node, ...older]) : undefined;
    const nLatest = older.length || contrast ? Math.round(total * COUNTS.latestShare) : total;
    const ops: PracticeOp[] = ['choose', 'type', 'transform', 'translate'];
    const latest = produce ? this.practice('controlledOutput', node, nLatest, ops, 'productive', { push: false, ladder: true, firstScoring: this.firstScoring(node, 'productive') }) : undefined;
    const items: PracticeItem[] = latest ? [...latest.items] : [];
    const oldSources: NodeId[] = [...older, ...(contrast ? [contrast] : [])];
    const olderItems: PracticeItem[] = [];
    let need = produce ? total - nLatest : 0;
    // the contrast has no bank sentence: its turn in the rotation is one of its own items, where it has one the learner can be shown
    const own = contrast && need > 0 ? this.contrastPractice(contrast) : undefined;
    if (own) { olderItems.push(own); need--; }
    for (let i = 0; need > 0 && oldSources.length && i < total * 2; i++) {
      const src = oldSources[i % oldSources.length];
      if (src === contrast) continue;
      const [s] = this.pickSentences(src, 1, { typed: true });
      if (s) { olderItems.push(this.practiceItem(this.ladderOp(src, olderItems.length), src, s, 'productive', 'exposure')); need--; }
    }
    // the latest node's items keep their rung order; older points are dropped in among them
    for (const it of olderItems) items.splice(Math.floor(this.rng.next() * (items.length + 1)), 0, it);
    if (items.length) {
      this.blocks.push({ kind: 'controlledOutput', part: 'core', deliberate: false, focus: node, contrast, items, minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60) });
    }
    if (produce) this.scriptFallback(node, 'yourTurn', total - items.length);
    // the freer practice is built first and kept or dropped once the day's new items are known: a contrast taught whole takes its minutes (R21)
    const freer = this.diags.length;
    const comm = produce ? this.practice('communicative', node, COUNTS.communicative, ['respond'], 'productive', { focus: node, question: true, fallbackOp: 'translate', push: false }) : undefined;
    const task = produce ? this.taskFor(node) : undefined;
    let writing: Block | undefined;
    if (task) writing = { kind: 'writing', part: 'core', deliberate: false, task, purpose: 'freer', focus: node, minutes: this.content.tasks.get(task)!.minutes };
    else if (produce) {
      const waiting = [...this.content.tasks.values()].some((t) => t.focus === node && !this.L.ledger.hasSeen('item', `wt:${t.id}`) && this.waitingOnOwed(t.requires));
      if (waiting) this.diag({ code: 'deferred', block: 'writing', node, message: `writing task on ${node} waits for owed items` });
      else this.diag({ code: 'shortage', block: 'writing', node, what: 'task', wanted: 1, got: 0, unit: this.unit?.id, message: `no unseen gated writing task focused on ${node}` });
    }
    const freerDiags = this.diags.length - freer;
    // optional new words, only if the backlog allows (takeNew returns none when throttled)
    const learn = this.takeNew('drill', day, advancing, { focusNonGrammar: true });
    const lessons = learn.filter((it) => it.nodeKind === 'contrast' && this.content.scripts.has(it.node));
    if (lessons.length) {
      this.diags.splice(freer, freerDiags);
      for (const it of lessons) this.blocks.push(...this.teach(it.node, 'full', { reason: 'contrast' }));
    } else {
      if (comm) this.blocks.push(comm);
      if (writing) this.blocks.push(writing);
    }
    this.pushLearn(learn.filter((it) => !lessons.includes(it)));
  }

  /**
   * A drill day whose node has too few bank rows re-serves the node's script items instead of
   * running short: those ids were ledgered on the introduce day, so the block is deliberate.
   */
  private scriptFallback(node: NodeId, part: 'readAndPick' | 'yourTurn', shortfall: number) {
    const script = this.content.scripts.get(node);
    if (!script || shortfall <= 0) return;
    const have = part === 'readAndPick' ? script.readAndPick : script.yourTurn;
    const n = Math.min(have, shortfall);
    if (n <= 0) return;
    const items: ScriptItem[] = Array.from({ length: n }, (_, i) => this.scriptItem(node, part, i));
    this.diag({ code: 'fallback', block: 'teach', node, unit: this.unit?.id, wanted: shortfall, got: n, message: `${node}: bank too thin for the drill, ${n} ${part} items from the script` });
    this.blocks.push({
      kind: 'teach', part: 'core', deliberate: true, node, nodeKind: kindOf(node, this.course.nodes), script: true, parts: [part], items, examples: [], reason: 'drill',
      minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60),
    });
  }

  /**
   * A review day returns to a contrast it lists and the learner knows, one a day. One that was never taught from its
   * script (the learner met it before scripts were taught; the ledger has no `sc:x:…:rp:0`) is taught now, whole. One that
   * was gets a few of its own items, a different few each session, as a deliberate re-serve.
   */
  private contrastBack(day: Unit['days'][number]): TeachBlock | undefined {
    const listed = day.focus.filter((n) => kindOf(n, this.course.nodes) === 'contrast' && this.known.has(n) && this.content.scripts.has(n));
    if (!listed.length) return undefined;
    const taught = (n: NodeId) => this.L.ledger.hasSeen('item', `sc:${n}:rp:0`);
    const node = listed.find((n) => !taught(n)) ?? listed[this.sessionIndex % listed.length];
    if (!taught(node)) return this.teach(node, 'full', { reason: 'contrast', introduced: true })[0] as TeachBlock;
    const script = this.content.scripts.get(node)!;
    const items: ScriptItem[] = [
      ...this.rotation(node, 'readAndPick', script.readAndPick, CONTRAST_RETURN.readAndPick).map((i) => this.scriptItem(node, 'readAndPick', i)),
      ...this.rotation(node, 'yourTurn', script.yourTurn, CONTRAST_RETURN.yourTurn).map((i) => this.scriptItem(node, 'yourTurn', i)),
    ];
    if (!items.length) return undefined;
    this.diag({ code: 'fallback', block: 'teach', node, unit: this.unit?.id, message: `${node}: ${items.length} items from its script, a different few each session` });
    return {
      kind: 'teach', part: 'core', deliberate: true, node, nodeKind: 'contrast', script: true, parts: ['readAndPick', 'yourTurn'], items, examples: [], reason: 'return',
      minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60),
    };
  }

  /**
   * `k` of a script's `count` items: the ones the ledger showed longest ago, so a return is never the last return's until the script has
   * gone round. (Review days fall a fixed number of sessions apart, so a place that only moved on with the session number kept landing
   * on the same items.) Ties, as on a first return, go from a place that starts elsewhere for each node and moves on with the session.
   */
  private rotation(node: NodeId, part: 'readAndPick' | 'yourTurn', count: number, k: number): number[] {
    const start = (hash32(node) + this.sessionIndex * Math.min(k, count)) % Math.max(1, count);
    return Array.from({ length: count }, (_, j) => (start + j) % count)
      .map((i) => ({ i, at: this.L.ledger.lastSeen('item', this.scriptItem(node, part, i).id)?.getTime() ?? 0 }))
      .sort((a, b) => a.at - b.at)
      .slice(0, k)
      .map((x) => x.i);
  }

  private scriptItem(node: NodeId, part: 'readAndPick' | 'yourTurn', index: number): ScriptItem {
    return { op: part, id: `sc:${node}:${part === 'readAndPick' ? 'rp' : 'yt'}:${index}`, node, index, scoring: 'exposure', credit: [node] };
  }

  /** A practice item that is one of a known contrast's own items (see PracticeItem.contrast), the store's pick as in a warm-up review. */
  private contrastPractice(node: NodeId): PracticeItem | undefined {
    const contrast = this.contrastReview(node);
    return contrast ? { op: 'choose', id: `ct:${contrast}:s${this.sessionIndex}`, node, sentence: '', direction: 'productive', scoring: 'exposure', credit: [node], contrast } : undefined;
  }

  /** A contrast node whose sides are all known and that involves one of `nodes` (or any, if none involves them). */
  private pickContrast(nodes: NodeId[]): NodeId | undefined {
    let any: NodeId | undefined;
    for (const n of this.course.nodes.values()) {
      if (n.kind !== 'contrast' || !this.contrastReady(n.id)) continue;
      const sides = contrastSides(n);
      if (sides.some((s) => nodes.includes(s))) return n.id;
      any ??= n.id;
    }
    return any;
  }

  /** The next beat of the chapter when it is cut into beats (a minute of it), else the chapter whole. */
  private pushRead(ch: ChapterRef) {
    this.readChapter = ch.id;
    const of = ch.beats?.length ?? 1;
    const ix = Math.min(of - 1, this.L.ledger.views('reading', ch.id).length);
    const beat = ch.beats?.[ix];
    this.blocks.push({
      kind: 'read', part: 'core', deliberate: false, chapter: ch.id, questions: beat?.questions ?? ch.questions, minutes: beat?.minutes ?? ch.minutes,
      ...(beat ? { beat: { ix, of } } : {}),
    });
    return ix === of - 1;
  }

  /** A beat of a chapter is the one part of the day that can wait: where the day is still over its minutes after the new words were owed, it waits. */
  private dropBeatOverBudget() {
    const total = () => this.blocks.reduce((a, b) => a + b.minutes, 0) + SECONDS.close / 60 + recapMinutes(COUNTS.recapMinCards);
    const at = this.blocks.findIndex((b) => b.kind === 'read' && !!b.beat);
    if (at >= 0 && total() > this.minutes + 1e-9) this.blocks.splice(at, 1);
  }

  /** A day with no story of its own carries the next beat of the chapter in hand, so the story reaches most days. */
  private storyBeat() {
    if (this.throttled || this.blocks.some((b) => b.kind === 'read' || b.kind === 'reread' || b.kind === 'scene')) return;
    const { ch } = this.chapterFor(undefined);
    if (!ch?.beats) return;
    // the beat is an extra: it rides only where the day has the minute to spare, so a short day's bar does not move
    const total = this.blocks.reduce((a, b) => a + b.minutes, 0) + SECONDS.close / 60 + recapMinutes(COUNTS.recapMinCards);
    const beat = ch.beats[Math.min(ch.beats.length - 1, this.L.ledger.views('reading', ch.id).length)];
    if (total + beat.minutes > this.minutes + 1e-9) return;
    this.pushRead(ch);
  }

  /**
   * A gated item whose missing nodes should all be known by now (owed after a
   * throttle cut) is only DEFERRED: it is served once they are introduced.
   * Anything else is a real supply shortage.
   */
  private waitingOnOwed(requires: readonly NodeId[]): boolean {
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const missing = unmetRequires(requires, (r) => this.known.has(r) || this.sessionNew.has(r), this.course.nodes);
    return missing.length > 0 && missing.every((r) => (this.course.teachPos.get(r) ?? Infinity) <= here);
  }

  /** Returns true when it was a real shortage (false = deferred or already seen). */
  private chapterProblem(id: string, reason: 'seen' | 'missing' | 'gated' | 'unavailable'): boolean {
    if (reason === 'seen') { this.diag({ code: 'alreadySeen', block: 'read', message: `chapter ${id} already read: skipped, not repeated` }); return false; }
    const ch = this.content.chapterById.get(id);
    if (reason === 'gated' && this.slipping.has(id)) {
      this.diag({ code: 'deferred', block: 'read', message: `chapter ${id} waits for slipping words to be reviewed; caught up in story order later` });
      return false;
    }
    if (reason === 'gated' && ch && this.waitingOnOwed(ch.requires)) {
      this.diag({ code: 'deferred', block: 'read', message: `chapter ${id} waits for owed items; caught up in story order later` });
      return false;
    }
    this.diag({ code: 'shortage', block: 'read', what: 'chapter', wanted: 1, got: 0, unit: this.unit?.id, message: `chapter ${id ?? '(none)'} ${reason === 'gated' ? 'needs nodes not taught by this point' : 'is not in the content'}` });
    return true;
  }

  private inputDay(day: Unit['days'][number], d: Decision) {
    this.warmupStd();
    const learn = this.takeNew('input', day, true, { focusNonGrammar: true });
    this.pushLearn(learn);
    const { ch, reason, blocked } = this.chapterFor(day);
    let shortage = false;
    let whole = false;
    if (ch) whole = this.pushRead(ch);
    else shortage = this.chapterProblem(blocked ?? day.chapter ?? '(unit chapter)', reason!);
    // cued production on today's new words
    const items: PracticeItem[] = [];
    for (const it of learn) {
      if (items.length >= COUNTS.cuedMax) break;
      const [s] = this.pickSentences(it.node, COUNTS.cuedPerLexeme, { typed: true });
      if (s) items.push(this.practiceItem(items.length % 2 ? 'translate' : 'gap', it.node, s, 'productive', 'exposure'));
    }
    if (items.length) this.blocks.push({ kind: 'cuedProduction', part: 'core', deliberate: false, items, minutes: round1(items.reduce((a, x) => a + SECONDS[x.op], 0) / 60) });
    if (ch && whole) this.blocks.push({ kind: 'reread', part: 'core', deliberate: true, chapter: ch.id, purpose: 'fluency', timed: true, minutes: round1(ch.minutes * 0.5) });
    if (!ch && reason !== 'seen') {
      // the reading slot becomes review practice; never another text
      if (shortage) d.converted = learn.length ? { from: 'input', to: 'review', reason: 'shortage', partial: true } : { from: 'input', to: 'review', reason: 'shortage' };
      this.remix();
      this.leech();
    }
  }

  private patternsDay(day: Unit['days'][number]) {
    this.warmupStd();
    // pattern nodes in focus are taught (light scripts); other new items go to the learn pool
    const pats = day.focus.filter((n) => kindOf(n, this.course.nodes) === 'pattern');
    const learn = this.takeNew('patterns', day, true, { focusNonGrammar: true });
    const taught = learn.filter((it) => it.nodeKind === 'pattern').slice(0, PATTERNS_TAUGHT);
    this.pushLearn(learn.filter((it) => !taught.includes(it)));
    for (const it of taught) this.blocks.push(...this.teach(it.node, 'light'));
    const practiced = pats.filter((n) => this.known.has(n) || this.sessionNew.has(n));
    for (const [i, p] of practiced.entries()) {
      const nIn = Math.ceil(COUNTS.patternsInput / practiced.length);
      const nOut = Math.ceil(COUNTS.patternsOutput / practiced.length);
      this.practice('structuredInput', p, nIn, ['pick'], 'receptive', { focus: p, firstScoring: i < 2 ? this.firstScoring(p, 'receptive') : 'exposure' });
      this.practice('controlledOutput', p, nOut, ['choose', 'type', 'translate'], 'productive', { focus: p, ladder: true });
    }
  }

  private outputDay(day: Unit['days'][number], d: Decision) {
    this.warmupStd();
    // repay owed items first, so the scene/task they gate can be served today
    const repay = this.repayFor(day.scene);
    this.pushLearn(this.takeNew('output', day, false, { force: repay }));
    const repaid = repay.filter((n) => this.sessionNew.has(n));
    if (repaid.length) this.diag({ code: 'repaid', block: 'learn', message: `introduced ${repaid.join(', ')} ahead of the caps so the output scene can be served` });
    const scene = this.sceneFor(day.scene);
    const task = this.taskFor();
    if (scene) this.pushScene(scene, 'output');
    else this.sceneProblem('output day');
    if (task) this.blocks.push({ kind: 'writing', part: 'core', deliberate: false, task, purpose: 'output', minutes: this.content.tasks.get(task)!.minutes });
    else this.diag({ code: 'shortage', block: 'writing', what: 'task', wanted: 1, got: 0, unit: this.unit?.id, message: 'no unseen gated writing task for the output day' });
    if (scene) this.blocks.push({ kind: 'sceneRerun', part: 'core', deliberate: true, scene, timed: true, minutes: round1(this.content.scenes.get(scene)!.minutes * 0.6) });
    if (!scene && !task) {
      d.converted = { from: 'output', to: 'review', reason: 'shortage' };
      this.remix();
      this.leech();
    }
  }

  /**
   * The unit's own owed or scheduled items (chunks, lexemes, patterns) that are the only thing
   * keeping an unseen scene from being admitted; at most REPAY_SCENE_MAX of them, else none.
   */
  private repayFor(sceneId: string | undefined): NodeId[] {
    const sc = sceneId ? this.content.scenes.get(sceneId) : undefined;
    if (!sc || this.severe || this.throttled || this.L.ledger.hasSeen('scene', sc.id)) return [];
    const have = (r: NodeId) => this.known.has(r) || this.sessionNew.has(r);
    const unmet = unmetRequires(sc.requires, have, this.course.nodes);
    if (!unmet.length || unmet.length > REPAY_SCENE_MAX) return [];
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const scheduled = new Set<NodeId>(this.owedNew);
    for (const d of this.unit?.days ?? []) for (const n of [...d.chunks, ...d.lexemes, ...d.focus]) if ((this.course.teachPos.get(n) ?? Infinity) <= here) scheduled.add(n);
    const ok = unmet.every((n) => ['chunk', 'lexeme', 'pattern'].includes(kindOf(n, this.course.nodes)) && scheduled.has(n));
    return ok ? unmet : [];
  }

  private pushScene(scene: string, purpose: 'output' | 'checkpoint') {
    const s = this.content.scenes.get(scene)!;
    const owed = this.owedCount(s.requires);
    if (owed) this.diag({ code: 'coverage', block: 'scene', unit: s.unit, message: `scene ${scene}: ${owed} owed words, one tap from English` });
    this.blocks.push({ kind: 'scene', part: 'core', deliberate: false, scene, purpose, minutes: s.minutes });
  }

  /** No scene: deferred if an unseen scene of this unit only waits on owed items, else a shortage. */
  private sceneProblem(what: string) {
    const waiting = (this.content.scenesByUnit.get(this.unit?.id ?? '') ?? [])
      .some((id) => !this.L.ledger.hasSeen('scene', id) && this.waitingOnOwed(this.content.scenes.get(id)?.requires ?? []));
    if (waiting) this.diag({ code: 'deferred', block: 'scene', message: `${what}: the unit's scenes wait for owed items` });
    else this.diag({ code: 'shortage', block: 'scene', what: 'scene', wanted: 1, got: 0, unit: this.unit?.id, message: `no unseen gated scene for the ${what}` });
  }

  private checkpointDay() {
    this.warmupStd(warmupMinutes(this.tier, this.band) * CHECKPOINT_WARMUP_FACTOR);
    this.pushLearn(this.takeNew('checkpoint', undefined, false));
    const [lo, hi] = CHECKPOINT_WINDOW_DAYS;
    const window = this.L.nodes().filter((id) => {
      const r = this.L.node(id);
      return r && r.introducedAt <= this.now - lo * DAY_MS && r.introducedAt >= this.now - hi * DAY_MS;
    });
    const pool = window.length ? window : this.L.nodes().slice(-40);
    this.rng.shuffle(pool);
    const items: PracticeItem[] = [];
    for (const n of pool) {
      if (items.length >= COUNTS.readingCheck) break;
      const [s] = this.pickSentences(n, 1);
      if (s) items.push(this.practiceItem('comprehend', n, s, 'receptive', 'exposure'));
    }
    if (items.length < COUNTS.readingCheck) this.diag({ code: 'shortage', block: 'readingCheck', what: 'sentence', wanted: COUNTS.readingCheck, got: items.length, unit: this.unit?.id, message: 'checkpoint reading short of unseen gated sentences' });
    if (items.length) this.blocks.push({ kind: 'readingCheck', part: 'core', deliberate: false, items, minutes: round1(items.length * SECONDS.comprehend / 60) });
    const task = this.taskFor();
    if (task) this.blocks.push({ kind: 'writing', part: 'core', deliberate: false, task, purpose: 'checkpoint', minutes: this.content.tasks.get(task)!.minutes });
    else this.diag({ code: 'shortage', block: 'writing', what: 'task', wanted: 1, got: 0, unit: this.unit?.id, message: 'no writing task for the checkpoint' });
    const scene = this.sceneFor(undefined);
    if (scene) this.pushScene(scene, 'checkpoint');
    else this.sceneProblem('checkpoint interaction');
    if (this.unit) this.blocks.push({ kind: 'selfCheck', part: 'core', deliberate: false, unit: this.unit.id, canDo: this.unit.canDo, minutes: round1(SECONDS.selfCheck / 60) });
  }

  private reviewDay(d: Decision, day: Unit['days'][number] | undefined) {
    if (d.converted?.reason === 'reentry') return this.returnDay();
    const budget = throttleMinutes(this.tier, this.band) + REVIEW_DAY_EXTRA_MINUTES;
    // With a backlog the whole session goes to reviews; otherwise the extended SRS budget (everything due fits).
    const cap = this.throttled ? Math.max(budget, this.minutes - 1) : Math.max(budget, this.dueMinutes);
    const w = this.warmup(cap, budget, true);
    let left = this.minutes - w.minutes - SECONDS.close / 60;
    const back = day ? this.contrastBack(day) : undefined;
    if (back && left >= back.minutes) { this.blocks.push(back); left -= back.minutes; }
    const catchUp = day ? this.chapterFor(undefined).ch : undefined;
    if (catchUp && left >= catchUp.minutes) { this.pushRead(catchUp); left -= catchUp.minutes; }
    if (left >= 3) left -= this.remix()?.minutes ?? 0;
    if (left >= 3) left -= this.notice()?.minutes ?? 0;
    if (left >= 1.5) this.leech();
    // owed items are repaid when the backlog allows (also after the course is finished)
    this.pushLearn(this.takeNew('review', day, false));
  }

  /**
   * The first session back after days away: a short warm-up, at most REENTRY.cards cards, and then the next
   * beat of the story, which is where the session ends. The day it replaces waits for the next session.
   */
  private returnDay() {
    const budget = throttleMinutes(this.tier, this.band);
    // the debt is planned most at risk first, which here would be the most forgotten: a return starts on what is likeliest still to be there
    this.debtGroups.reverse();
    this.warmup(budget, budget, false, { cards: REENTRY.cards });
    const { ch } = this.chapterFor(undefined, false, true);
    if (ch) this.pushRead(ch);
  }

  /** Grammar remix across the last units, plus one known contrast. */
  private remix(): PracticeBlock | undefined {
    const recent = this.path.recentGrammar.filter((n) => this.known.has(n));
    const inWindow = recent.filter((n) => (this.L.node(n)?.introducedAt ?? 0) >= this.now - REMIX_WINDOW_DAYS * DAY_MS);
    const shaky = this.shakyNodes(2);
    shaky.forEach((n) => this.remServed.add(n));
    const nodes = [...shaky, ...(inWindow.length >= 2 ? inWindow : recent.slice(0, 4))].filter((n, i, a) => a.indexOf(n) === i && this.producible(n));
    const contrast = this.pickContrast(nodes);
    const sources = [...nodes, ...(contrast ? [contrast] : [])];
    if (!sources.length) return undefined;
    const items: PracticeItem[] = [];
    const ops: PracticeOp[] = ['choose', 'type', 'transform', 'translate'];
    const own = contrast ? this.contrastPractice(contrast) : undefined;
    if (own) items.push(own);
    for (let i = 0; items.length < COUNTS.remix && i < COUNTS.remix * 3; i++) {
      const src = sources[i % sources.length];
      if (src === contrast) continue;
      const [s] = this.pickSentences(src, 1, { typed: true });
      if (s) items.push(this.practiceItem(this.ladderOp(src, items.length), src, s, 'productive', 'exposure'));
    }
    if (items.length < COUNTS.remix) this.diag({ code: 'shortage', block: 'remix', what: 'sentence', wanted: COUNTS.remix, got: items.length, unit: this.unit?.id, message: `remix: ${items.length}/${COUNTS.remix} items` });
    if (!items.length) return undefined;
    this.rng.shuffle(items);
    const b: PracticeBlock = { kind: 'remix', part: 'core', deliberate: false, contrast, items, minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60) };
    this.blocks.push(b);
    return b;
  }

  /** Review day: deliberately re-read a chapter first read 14–21 days ago. */
  private notice() {
    const ch = this.rereadCandidate(REREAD_WINDOW_DAYS) ?? this.rereadCandidate(REREAD_WIDE_DAYS);
    if (!ch) { this.diag({ code: 'noReread', block: 'reread', message: 'no chapter first read 7–35 days ago' }); return undefined; }
    const b = { kind: 'reread' as const, part: 'core' as const, deliberate: true, chapter: ch.id, purpose: 'notice' as const, timed: false, minutes: ch.minutes };
    this.blocks.push(b);
    return b;
  }

  private rereadCandidate([lo, hi]: [number, number], minAgeDays?: number): ChapterRef | undefined {
    let best: ChapterRef | undefined;
    let bestKey: [number, number] = [Infinity, Infinity];
    for (const c of this.content.chapters) {
      const first = this.L.ledger.firstSeen('chapter', c.id)?.getTime();
      if (first === undefined) continue;
      const age = (this.now - first) / DAY_MS;
      if (minAgeDays !== undefined ? age < minAgeDays : (age < lo || age > hi)) continue;
      const views = this.L.ledger.views('chapter', c.id).length;
      const last = this.L.ledger.lastSeen('chapter', c.id)!.getTime();
      const key: [number, number] = [views, last];
      if (key[0] < bestKey[0] || (key[0] === bestKey[0] && key[1] < bestKey[1])) { best = c; bestKey = key; }
    }
    return best;
  }

  /** The most-failed known nodes, in fresh contexts. */
  private leech() {
    const scored: { node: NodeId; lapses: number }[] = [];
    for (const id of this.L.nodes()) {
      if (this.warmupKeys.has(id)) continue;
      const lapses = Math.max(this.L.card(id, 'receptive')?.lapses ?? 0, this.L.card(id, 'productive')?.lapses ?? 0);
      if (lapses >= COUNTS.leechMinLapses) scored.push({ node: id, lapses });
    }
    scored.sort((a, b) => b.lapses - a.lapses || (a.node < b.node ? -1 : 1));
    const items: ReviewItem[] = [];
    for (const { node } of scored) {
      if (items.length >= COUNTS.leech) break;
      const dir = this.L.hasCard(node, 'productive') ? 'productive' : 'receptive';
      const [s] = this.pickSentences(node, 1, { typed: dir === 'productive' });
      if (!s) continue; // a leech without a fresh context waits; never a seen sentence
      items.push({ op: 'review', id: `lr:${s.id}`, node, targets: [node], direction: dir, sentence: s.id, novel: true, scoring: 'exposure', credit: creditOf(node, s) });
    }
    if (items.length) this.blocks.push({ kind: 'leech', part: 'core', deliberate: false, items, minutes: round1(items.length * this.spr * 2 / 60) });
  }

  /** Extended tier: the extra core minutes left after over-budget reviews go to reading from the unit bank. */
  private extraReading() {
    if (!this.unit) return;
    const w = this.blocks[0];
    const reviewOverflow = w?.kind === 'warmup' ? Math.max(0, w.minutes - warmupMinutes(this.tier, this.band)) : 0;
    const left = EXTENDED_EXTRA_MINUTES - reviewOverflow;
    const want = Math.min(EXTRA_READING_MAX, Math.floor((left * 60) / SECONDS.read));
    if (want <= 0) return;
    const sents = this.pickFromUnit(this.unit.id, want);
    const prev = this.course.units[this.path.unit - 1];
    if (sents.length < want && prev) sents.push(...this.pickFromUnit(prev.id, want - sents.length));
    // coverage: the reading as a whole may lean on only a few slipping words
    const lean: NodeId[] = [];
    const covered = sents.filter((s) => {
      if (!s.requires.length) return false;
      const cov = this.coverage([...lean, ...s.requires]);
      if (!cov.admitted) return false;
      lean.push(...s.requires);
      return true;
    });
    if (lean.length) this.diag({ code: 'coverage', block: 'extraReading', unit: this.unit.id, coverage: this.coverage(lean), message: `extra reading: ${covered.length}/${sents.length} sentences within the slipping-word cap` });
    const items = covered.map((s) => this.practiceItem('read', s.targets[0] ?? s.requires[0], s, 'receptive', 'exposure'));
    if (!items.length) return;
    this.blocks.push({ kind: 'extraReading', part: 'core', deliberate: false, items, minutes: round1(items.length * SECONDS.read / 60) });
  }

  // ---------------------------------------------------------------- minimum

  private minimum(day: Unit['days'][number] | undefined): SessionPlan {
    this.warmup(MINIMUM_WARMUP_MINUTES, MINIMUM_WARMUP_MINUTES, false);
    // the next slice of the day on the path, if it has one; otherwise a re-read and a recall
    const slice = day ? this.shortSlice(day) : undefined;
    if (!slice) {
      const ch = this.rereadCandidate([0, 0], 1);
      if (ch) this.blocks.push({ kind: 'reread', part: 'core', deliberate: true, chapter: ch.id, purpose: 'minimum', timed: false, minutes: Math.min(3, ch.minutes) });
      else this.diag({ code: 'noReread', block: 'reread', message: 'no known chapter to re-read yet' });
      const recall = this.recallItems();
      if (recall.length) this.blocks.push({ kind: 'timedRecall', part: 'core', deliberate: true, items: recall, seconds: COUNTS.timedRecallSeconds, minutes: COUNTS.timedRecallSeconds / 60 });
    }
    const d: Decision = { type: 'review', advances: !!slice?.done };
    this.blocks.push(this.close(d, day, true));
    const path = structuredClone(this.path);
    if (slice) {
      path.owedNew = this.owedNew;
      if (slice.done && day) this.consumeDay(path, day);
    }
    path.log = [...path.log, this.logEntry({ type: 'review', advances: d.advances }, undefined, day, true)].slice(-LOG_MAX);
    return {
      sessionIndex: this.sessionIndex, seed: this.seed, tier: 'minimum', mode: this.mode, type: 'minimum',
      dayType: day?.type, unit: this.unit?.id, day: day ? this.path.day : undefined,
      ...(this.reentry ? { reentry: this.reentry } : {}),
      advancesPath: d.advances, blocks: this.blocks, newNodes: this.newNodes, receptiveOnly: this.receptiveOnly,
      budget: {
        band: this.band, minutes: this.minutes, reviewMinutes: MINIMUM_WARMUP_MINUTES, secondsPerReview: this.spr,
        due: this.due.length, dueMinutes: this.dueMinutes, throttled: this.dueMinutes > MINIMUM_WARMUP_MINUTES, severe: false,
        ...(this.debtCards ? { debt: { cards: this.debtCards, minutes: this.debtMinutes, paid: this.paidDebt } } : {}),
      },
      estimatedMinutes: round1(this.blocks.reduce((a, b) => a + b.minutes, 0)),
      diagnostics: this.diags, pathAfter: path,
    };
  }

  /**
   * The timed recall: twelve known items, productive ones first, chosen from the RECALL_POOL practised most lately and, of those,
   * the ones recalled least lately. Recalling an item is an exposure, so the next day's twelve are others, and the pool goes round
   * (before, the twelve most recently practised were the same twelve every day, because recalling them practised nothing).
   */
  private recallItems() {
    const pool = this.L.nodes()
      .filter((id) => !this.warmupKeys.has(id) && (this.L.hasCard(id, 'productive') || this.L.hasCard(id, 'receptive')))
      .map((id) => {
        const p = this.L.card(id, 'productive');
        return { id, prod: p ? 1 : 0, at: (p ?? this.L.card(id, 'receptive'))!.last_review ?? 0 };
      })
      .sort((a, b) => b.prod - a.prod || b.at - a.at || (a.id < b.id ? -1 : 1))
      .slice(0, RECALL_POOL);
    return pool
      .map((x) => ({ ...x, seen: this.L.node(x.id)?.lastExposedAt ?? 0 }))
      .sort((a, b) => a.seen - b.seen || b.prod - a.prod || b.at - a.at || (a.id < b.id ? -1 : 1))
      .slice(0, Math.floor(COUNTS.timedRecallSeconds / SECONDS.recall))
      .map(({ id }) => ({ op: 'recall' as const, id: `tr:${id}`, node: id, direction: 'productive' as const, scoring: 'exposure' as const, credit: [id] }));
  }

  /**
   * What a short session does with the day on the path (C17): the next few of its new words (SHORT_NEW_ITEMS), taught for real;
   * once they are taught, its chapter. A grammar point, a contrast or a pattern is not sliced, since it needs the lesson whole, so a
   * day that has one waits for a full session. `done` says the slice leaves the day finished, which is only so for an input day:
   * its words all taught and its chapter read (or none to read), so short days can add up to that lesson. Undefined: nothing to give.
   */
  private shortSlice(day: Unit['days'][number]): { done: boolean } | undefined {
    if (!['introduce', 'input', 'patterns', 'drill'].includes(day.type) || this.lackedBy(day).length) return undefined;
    // what the warm-up has left of the session's minutes ("Only five minutes?" has five): no more is taken than fits
    const left = Math.min(MINIMUM_MINUTES, this.input.capMinutes ?? MINIMUM_MINUTES) - this.blocks.reduce((a, b) => a + b.minutes, 0) - SECONDS.close / 60;
    const room = Math.min(SHORT_NEW_ITEMS, Math.floor((left * 60 + 1e-9) / SECONDS.learn));
    const owedBefore = [...this.owedNew];
    const learn = room > 0 ? this.takeNew(day.type, day, true, { focusNonGrammar: true, max: room, kinds: ['chunk', 'lexeme'] }) : [];
    // the day has not been consumed: what it lists and this session did not take is still on the day, not owed
    this.owedNew = this.owedNew.filter((n) => owedBefore.includes(n));
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const wordsLeft = [...day.chunks, ...day.lexemes].some((n) => !this.known.has(n) && !this.sessionNew.has(n) && (this.course.teachPos.get(n) ?? here) <= here);
    const reads = day.type === 'input' || day.type === 'introduce';
    if (learn.length) {
      this.pushLearn(learn);
      return { done: day.type === 'input' && !wordsLeft && !(reads && this.chapterFor(day, true).ch) };
    }
    const { ch } = reads ? this.chapterFor(day) : {};
    if (!ch || ch.minutes > left + 1e-9) return undefined;
    this.pushRead(ch);
    return { done: day.type === 'input' && !wordsLeft };
  }

  // ---------------------------------------------------------------- close & path

  private close(d: Decision, day: Unit['days'][number] | undefined, minimum = false): CloseBlock {
    const u = this.unit;
    let next: LessonType | undefined;
    let progress: CloseBlock['progress'];
    if (u && day) {
      const done = this.path.day + (d.advances ? 1 : 0);
      progress = { done, of: u.days.length };
      next = done < u.days.length ? u.days[done].type : this.course.units[this.path.unit + 1]?.days[0]?.type;
    }
    return {
      kind: 'close', part: 'close', deliberate: false, minutes: round1(SECONDS.close / 60),
      unit: u?.id, canDo: u?.canDo, progress, next, hookChapter: this.readChapter,
      offerAnother: !minimum && !this.throttled && !!day,
    };
  }

  private logEntry(d: Decision, c: number | undefined, day: Unit['days'][number] | undefined, minimum = false): SessionLogEntry {
    return {
      learnerSession: this.sessionIndex, coreSession: c,
      type: minimum ? 'minimum' : d.type, dayType: day?.type, unit: this.unit?.id, day: day ? this.path.day : undefined,
      advanced: d.advances, grammarIntro: this.newNodes.grammar[0], drilled: this.drilled,
      throttled: this.throttled, converted: d.converted?.reason,
    };
  }

  private pathAfter(d: Decision, c: number, day: Unit['days'][number] | undefined): PathState {
    const p = structuredClone(this.path);
    p.coreSessions = c;
    const g = this.newNodes.grammar[0];
    if (g) {
      p.pendingDrills = [...p.pendingDrills, { node: g, at: c }];
      p.lastGrammarIntroAt = c;
      p.recentGrammar = [g, ...p.recentGrammar.filter((x) => x !== g)].slice(0, 8);
    }
    if (this.drilled) p.pendingDrills = p.pendingDrills.filter((x) => x.node !== this.drilled);
    p.remediate = (p.remediate ?? []).map((e) => (this.remServed.has(e.node) ? { ...e, served: (e.served ?? 0) + 1 } : e));
    p.owedNew = this.owedNew;
    p.owedGrammar = this.owedGrammar;
    if (d.advances && day) this.consumeDay(p, day);
    p.log = [...p.log, this.logEntry(d, c, day)].slice(-LOG_MAX);
    return p;
  }

  /** The day is consumed: anything it teaches that was not introduced is owed, never lost; the path moves to the next day. */
  private consumeDay(p: PathState, day: Unit['days'][number]) {
    if (!this.unit) return;
    const here = dayPos(this.course, this.path.unit, this.path.day);
    for (const n of [...day.focus, ...day.chunks, ...day.lexemes]) {
      if (this.known.has(n) || this.sessionNew.has(n)) continue;
      if ((this.course.teachPos.get(n) ?? here) > here) continue; // previewed here, taught later
      const k = kindOf(n, this.course.nodes);
      if (k === 'cando') continue;
      if (k === 'grammar') { if (!p.owedGrammar.includes(n)) p.owedGrammar = [...p.owedGrammar, n]; }
      else if (!p.owedNew.includes(n)) p.owedNew = [...p.owedNew, n];
    }
    p.day += 1;
    if (p.day >= this.unit.days.length) { p.unit += 1; p.day = 0; }
  }

  private diag(d: Diagnostic) { this.diags.push(d); }
}

function creditOf(node: NodeId, s: SentenceRef): NodeId[] {
  return [node, ...s.requires.filter((r) => r !== node)];
}

function round1(x: number): number { return Math.round(x * 10) / 10; }
/** Planned minutes of the "Before you go" block. */
function recapMinutes(cards: number): number { return round1(cards * SECONDS.recap / 60); }