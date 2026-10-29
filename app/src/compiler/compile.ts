// The deterministic session compiler. compileSession() is a pure function of
// its input: it reads the learner (never mutates it) and returns a plan plus
// the path the learner will be on once the plan's core is completed.
//
// Rules enforced here (each has a property test in tests/compiler):
//  - the warm-up (SRS) block is in every plan, first; minimum tier = warm-up +
//    re-read + timed recall, no new items, does not advance the path
//  - ≤ 1 grammar introduction per session, never in consecutive core sessions,
//    and each introduction is drilled within DRILL_WITHIN core sessions
//  - chunks have their own 3–5 budget; lexemes have a per-lesson-type cap
//  - contrasts only once both sides are known
//  - content gate: everything served has requires ⊆ known ∪ introduced-this-session
//    (non-transitive: a known chunk satisfies itself, never the grammar it unpacks)
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
import type { Band, GraphNode, LessonType, NodeId, Unit } from '../content/schema';
import { productivePolicy, type Direction, type DueCard, type Tier } from '../learner';
import {
  CHECKPOINT_WARMUP_FACTOR, CHECKPOINT_WINDOW_DAYS, CHUNK_CAP, CONTRAST_CAP, COUNTS, DONE_BAND, DRILL_WITHIN,
  EXTENDED_EXTRA_MINUTES, EXTRA_READING_MAX, LEXEME_CAP, MINIMUM_WARMUP_MINUTES, MULTI_REVIEW_COST, MULTI_REVIEW_MAX, MULTI_REVIEW_SCAN,
  PATTERN_CAP, PATTERNS_DAY_CAP, PATTERNS_TAUGHT, REMIX_WINDOW_DAYS, REPAY_CAP, REREAD_WIDE_DAYS, REREAD_WINDOW_DAYS,
  REVIEW_DAY_EXTRA_MINUTES, REVIEW_REUSE_DAYS, REVIEW_REUSE_REASON,
  SECONDS, SEVERE_FACTOR, THROTTLED_WARMUP_FACTOR, sessionMinutes, throttleMinutes, warmupMinutes,
} from './budget';
import { dayPos, makeRng, sessionSeed, type Rng } from './content';
import type {
  Block, ChapterRef, CloseBlock, CompileInput, Conversion, Diagnostic, LearnItem, LearnerView,
  Mode, PathState, PracticeBlock, PracticeItem, PracticeOp, ReviewItem, ScriptItem, SentenceRef,
  ServedRef, SessionLogEntry, SessionPlan, TeachBlock, WarmupBlock,
} from './types';

const DAY_MS = 86_400_000;
const LOG_MAX = 60;

export function initialPath(): PathState {
  return { version: 1, unit: 0, day: 0, coreSessions: 0, owedNew: [], owedGrammar: [], pendingDrills: [], recentGrammar: [], log: [] };
}

export function compileSession(input: CompileInput): SessionPlan {
  return new Compiler(input).compile();
}

/** The path to persist after a session: plan.pathAfter if the core was completed, else unchanged. */
export function advancePath(path: PathState, plan: SessionPlan, coreCompleted: boolean): PathState {
  return coreCompleted ? structuredClone(plan.pathAfter) : path;
}

/** Whether "do another" should be offered now: not minimum, course not finished, and no backlog over budget. */
export function canDoAnother(input: Pick<CompileInput, 'learner' | 'path' | 'course' | 'now' | 'tier'> & { content?: CompileInput['content']; learnerId?: string }): boolean {
  const tier = input.tier ?? input.learner.settings.tier;
  if (tier === 'minimum') return false;
  if (input.path.unit >= input.course.units.length) return false;
  // With the content index: the same grouped (multi-target) cost the compiler
  // will see, so "another" is offered exactly when it would not be throttled.
  // Without it: every due card costed as a single review (an upper bound).
  const dueMin = input.content
    ? new Compiler({ learnerId: input.learnerId ?? '', learner: input.learner, path: input.path, course: input.course, content: input.content, now: input.now, tier, mode: 'another' }).dueReviewMinutes()
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
        for (const it of b.items) add('item', it.id, false);
        for (const s of b.examples) add('sentence', s, false);
        break;
      case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
      case 'remix': case 'readingCheck': case 'extraReading':
        for (const it of b.items) { add('sentence', it.sentence, false); add('item', it.id, false); }
        break;
      case 'read': add('chapter', b.chapter, false); break;
      case 'reread': add('chapter', b.chapter, true); break;
      case 'scene': add('scene', b.scene, false); break;
      case 'sceneRerun': add('scene', b.scene, true); break;
      case 'writing': add('item', `wt:${b.task}`, false); break;
      case 'timedRecall': for (const it of b.items) add('item', it.id, true); break;
      default: break; // ruleRecall, personal, selfCheck, close: nothing new shown
    }
  }
  return out;
}

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
  private readonly sessionNew = new Set<NodeId>();
  private readonly receptiveOnly: NodeId[] = [];
  private readonly usedSentences = new Set<string>();
  private readonly diags: Diagnostic[] = [];
  private readonly blocks: Block[] = [];
  private readonly newNodes: SessionPlan['newNodes'] = { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] };
  private readonly warmupKeys = new Set<string>();
  /** minutes the warm-up ran over its budget (throttled sessions) */
  private warmupOverrun = 0;
  private due: DueCard[] = [];
  /** every due card grouped into review items, most overdue first; the warm-up serves a prefix */
  private groups: ReviewGroup[] = [];
  private dueMinutes = 0;
  private band: Band = DONE_BAND;
  private minutes = 0;
  private throttled = false;
  private severe = false;
  private owedNew: NodeId[];
  private owedGrammar: NodeId[];
  private drilled?: NodeId;
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
    this.owedNew = [...input.path.owedNew];
    this.owedGrammar = [...input.path.owedGrammar];
  }

  private get course() { return this.input.course; }

  /** Minutes to review everything due, grouped as the warm-up would serve it. */
  dueReviewMinutes(): number {
    this.due = this.L.due(this.now);
    return this.planReviews().reduce((a, g) => a + reviewCost(g.targets.length), 0) * this.spr / 60;
  }
  private get content() { return this.input.content; }

  // ---------------------------------------------------------------- top level

  compile(): SessionPlan {
    this.unit = this.course.units[this.path.unit];
    this.band = bandAt(this.course, this.path);
    // session length by band and tier (budget.ts); settings.minutes is not used for planning
    this.minutes = sessionMinutes(this.tier, this.band);
    this.due = this.L.due(this.now);
    this.groups = this.planReviews();
    this.dueMinutes = this.groups.reduce((a, g) => a + reviewCost(g.targets.length), 0) * this.spr / 60;
    const reviewBudget = throttleMinutes(this.tier, this.band);
    this.throttled = this.dueMinutes > reviewBudget;
    this.severe = this.dueMinutes > SEVERE_FACTOR * reviewBudget;
    const day = this.unit?.days[this.path.day];

    if (this.tier === 'minimum') return this.minimum(day);

    if (this.throttled) this.diag({ code: 'throttle', message: `${this.due.length} due ≈ ${this.dueMinutes.toFixed(1)} min > ${reviewBudget} min budget${this.severe ? ' (severe)' : ''}` });
    const d = this.decide(day);
    const c = this.path.coreSessions + 1;

    switch (d.type) {
      case 'introduce': this.introduce(day!, d); break;
      case 'drill': this.warmupStd(); this.drill(d.drillNode!, day, d.advances); break;
      case 'input': this.inputDay(day!, d); break;
      case 'patterns': this.patternsDay(day!); break;
      case 'output': this.outputDay(day!, d); break;
      case 'checkpoint': this.checkpointDay(); break;
      case 'review': this.reviewDay(d, day); break;
    }
    if (this.tier === 'extended' && !this.throttled && d.type !== 'review') this.extraReading();
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
      advancesPath: d.advances,
      blocks: this.blocks,
      newNodes: this.newNodes,
      receptiveOnly: this.receptiveOnly,
      budget: {
        band: this.band, minutes: this.minutes, reviewMinutes: reviewBudget, secondsPerReview: this.spr,
        due: this.due.length, dueMinutes: this.dueMinutes, throttled: this.throttled, severe: this.severe,
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
    // Spacing: a pending drill at its last allowed session wins over everything.
    const lastChance = [...this.path.pendingDrills].sort((a, b) => a.at - b.at).find((p) => c - p.at >= DRILL_WITHIN);
    if (lastChance) {
      if (dt === 'drill') return { type: 'drill', advances: true, drillNode: lastChance.node };
      this.diag({ code: 'spacing', node: lastChance.node, message: `drill of ${lastChance.node} due by core session ${lastChance.at + DRILL_WITHIN}` });
      return { type: 'drill', advances: false, drillNode: lastChance.node, converted: { from: dt, to: 'drill', reason: 'spacing' } };
    }
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
   * units; reviews are never trimmed below the cap.
   */
  private warmup(capMinutes: number, budgetMinutes: number, extended: boolean): WarmupBlock {
    const capUnits = (capMinutes * 60) / this.spr - 1e-6;
    const items: ReviewItem[] = [];
    let units = 0;
    let covered = 0;
    for (const g of this.groups) {
      if (units >= capUnits) break;
      items.push(this.reviewItem(g));
      units += reviewCost(g.targets.length);
      covered += g.targets.length;
      for (const t of g.targets) this.warmupKeys.add(t);
    }
    const minutes = units * this.spr / 60;
    this.warmupOverrun = Math.max(0, minutes - budgetMinutes);
    const b: WarmupBlock = {
      kind: 'warmup', part: 'warmup', deliberate: false, items,
      minutes: round1(minutes), due: this.due.length, covered, carried: this.due.length - covered,
      budgetMinutes, extended,
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
    this.diag({ code: 'bareReview', block: 'warmup', node, what: 'sentence', wanted: 1, got: 0, message: `no usable sentence for ${node}: bare card` });
    return { op: 'review', id: `rv:${node}:${g.direction}:bare`, node, targets: [node], direction: g.direction, novel: false, scoring: 'review', credit: [node] };
  }

  /**
   * Group every due card into review items. For each card (most overdue
   * first) not yet covered, look at up to MULTI_REVIEW_SCAN usable sentences
   * containing it — unseen, or a review context reusable after
   * REVIEW_REUSE_DAYS — and take the one that also contains the most other
   * uncovered due cards of the same direction (≤ MULTI_REVIEW_MAX targets in
   * all). Ties: an unseen sentence while some target still needs its first
   * recombination pass (novelPasses = 0), else a reused one (saves supply);
   * then scan order. No usable sentence: a bare card.
   */
  private planReviews(): ReviewGroup[] {
    const open: Record<Direction, Set<NodeId>> = { receptive: new Set(), productive: new Set() };
    for (const c of this.due) open[c.direction].add(c.node);
    const reserved = new Set<string>();
    const novelMemo = new Map<NodeId, boolean>();
    const needsNovel = (id: NodeId) => {
      let v = novelMemo.get(id);
      if (v === undefined) { v = (this.L.node(id)?.novelPasses ?? 0) === 0; novelMemo.set(id, v); }
      return v;
    };
    const groups: ReviewGroup[] = [];
    for (const card of this.due) {
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
      if (!best) { groups.push({ direction: card.direction, targets: [card.node], reused: false }); continue; }
      reserved.add(best.s.id);
      for (const x of best.extras) pool.delete(x);
      groups.push({ direction: card.direction, targets: [card.node, ...best.extras], sentence: best.s, reused: best.reused });
    }
    return groups;
  }

  // ---------------------------------------------------------------- content selection

  private gated(requires: readonly NodeId[]): boolean {
    for (const r of requires) if (!this.known.has(r) && !this.sessionNew.has(r)) return false;
    return true;
  }

  /**
   * Up to n UNSEEN, GATED sentences containing `node`, never one already used
   * in this plan. Sentences written for the node (targets) come first; the
   * RNG only orders candidates within each group.
   */
  private pickSentences(node: NodeId, n: number, opts: { question?: boolean; unit?: string } = {}): SentenceRef[] {
    if (n <= 0) return [];
    const want = Math.max(n * 2, n + 4);
    const groups: SentenceRef[][] = [];
    let total = 0;
    for (const list of [this.content.byTarget.get(node), this.content.byRequire.get(node)]) {
      const g: SentenceRef[] = [];
      if (list) {
        for (const id of list) {
          if (total + g.length >= want) break;
          if (this.usedSentences.has(id) || this.L.ledger.hasSeen('sentence', id)) continue;
          const s = this.content.sentences.get(id)!;
          if (opts.question && !s.question) continue;
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
   * here, so the story is never silently dropped and never re-served.
   */
  private chapterFor(day: Unit['days'][number] | undefined): { ch?: ChapterRef; reason?: 'seen' | 'missing' | 'gated'; blocked?: string } {
    const cur = this.path.unit;
    let blocked: string | undefined;
    for (const c of this.content.chapters) {
      const ui = this.course.unitIndex.get(c.unit) ?? Infinity;
      const reached = ui < cur || (ui === cur && (c.day === undefined || c.day <= this.path.day));
      if (!reached) continue;
      if (this.L.ledger.hasSeen('chapter', c.id)) continue;
      if (this.gated(c.requires)) return { ch: c };
      blocked ??= c.id;
    }
    if (blocked) return { reason: 'gated', blocked };
    if (day?.chapter && this.L.ledger.hasSeen('chapter', day.chapter)) return { reason: 'seen' };
    return { reason: day?.chapter && !this.content.chapterById.has(day.chapter) ? 'missing' : 'seen' };
  }

  private sceneFor(preferred: string | undefined): string | undefined {
    const ok = (id: string) => {
      const s = this.content.scenes.get(id);
      return !!s && !this.L.ledger.hasSeen('scene', id) && this.gated(s.requires);
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
  private takeNew(type: LessonType, day: Unit['days'][number] | undefined, advancing: boolean, opts: { focusNonGrammar?: boolean } = {}): LearnItem[] {
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
    const conCap = open && !this.throttled ? base.contrast : 0;
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const dayItems: NodeId[] = advancing && day
      ? [...(opts.focusNonGrammar ? day.focus.filter((n) => kindOf(n, this.course.nodes) !== 'grammar') : []), ...day.chunks, ...day.lexemes]
        .filter((n) => (this.course.teachPos.get(n) ?? here) <= here)
      : [];
    const taken: NodeId[] = [];
    const owed: NodeId[] = [];
    const counts = { chunk: 0, lexeme: 0, pattern: 0, contrast: 0 };
    const caps = { chunk: chunkCap, lexeme: lexCap, pattern: patCap, contrast: conCap };
    const seen = new Set<NodeId>();
    for (const id of [...this.owedNew, ...dayItems]) { // owed first: a cut item is never starved
      if (seen.has(id)) continue;
      seen.add(id);
      if (this.known.has(id) || this.sessionNew.has(id)) continue;
      const k = kindOf(id, this.course.nodes);
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
      if (counts[bucket] < caps[bucket]) { counts[bucket]++; taken.push(id); this.sessionNew.add(id); }
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
      return { op: 'learn', id: `ln:${id}`, node: id, nodeKind: k, retrievals: 4, productive, scoring: 'learning', credit: [id] } as LearnItem;
    });
    for (const it of items) {
      const [s] = this.pickSentences(it.node, 1);
      if (s) { it.example = s.id; it.credit = creditOf(it.node, s); }
    }
    return items;
  }

  /** productivePolicy for a node; a lexeme absent from the graph takes the band of the unit teaching it. */
  private productive(id: NodeId, kind: GraphNode['kind']): boolean {
    const n = this.course.nodes.get(id);
    return productivePolicy({ kind, band: n?.band ?? this.unit?.band, freqRank: n?.freqRank });
  }

  private contrastReady(id: NodeId): boolean {
    const sides = contrastSides(this.course.nodes.get(id));
    return sides.length > 0 && sides.every((s) => this.known.has(s));
  }

  private pushLearn(items: LearnItem[]) {
    if (!items.length) return;
    this.blocks.push({ kind: 'learn', part: 'core', deliberate: false, items, minutes: round1(items.length * SECONDS.learn / 60) });
  }

  // ---------------------------------------------------------------- lesson types

  private introduce(day: Unit['days'][number], d: Decision) {
    this.warmupStd();
    const g = d.grammarNode;
    const rest = this.grammarCandidates(day).filter((n) => n !== g);
    if (g) {
      this.sessionNew.add(g);
      this.newNodes.grammar.push(g);
      const req = this.course.nodes.get(g)?.requires ?? [];
      const missing = req.filter((r) => !this.known.has(r) && !this.sessionNew.has(r));
      if (missing.length) this.diag({ code: 'prereq', node: g, message: `${g} introduced before ${missing.join(', ')}` });
    }
    if (rest.length) this.diag({ code: 'deferred', message: `grammar ${rest.join(', ')} owed (one grammar point per session)` });
    this.owedGrammar = rest;
    const learn = this.takeNew('introduce', day, true, { focusNonGrammar: true });
    this.pushLearn(learn);
    if (g) this.blocks.push(...this.teach(g, 'full'));
    const { ch, reason, blocked } = this.chapterFor(day);
    if (ch) this.pushRead(ch);
    else if (day.chapter) this.chapterProblem(blocked ?? day.chapter, reason!);
    if (g && this.content.scripts.has(g)) this.blocks.push({ kind: 'personal', part: 'core', deliberate: false, node: g, minutes: round1(SECONDS.personal / 60) });
  }

  /** Teach one node from its script; falls back to bank examples + practice when the script is missing. */
  private teach(node: NodeId, depth: 'full' | 'light'): Block[] {
    const script = this.content.scripts.get(node);
    const kind = kindOf(node, this.course.nodes);
    const items: ScriptItem[] = [];
    if (!script) {
      this.diag({ code: 'shortage', block: 'teach', node, what: 'script', wanted: 1, got: 0, unit: this.unit?.id, message: `no TeachingScript for ${node}` });
      const examples = this.pickSentences(node, 3).map((s) => s.id);
      const out: Block[] = [{ kind: 'teach', part: 'core', deliberate: false, node, nodeKind: kind, script: false, parts: ['examples'], items, examples, minutes: round1((SECONDS.examples + SECONDS.rule) / 60) }];
      // the in-lesson learning steps come from bank practice instead of the script's yourTurn
      const si = this.practice('structuredInput', node, 6, ['pick'], 'receptive', { focus: node, push: false });
      const co = this.practice('controlledOutput', node, 5, ['choose', 'type', 'transform'], 'productive', { focus: node, push: false });
      co?.items.forEach((it) => { it.scoring = 'learning'; });
      if (si) out.push(si);
      if (co) out.push(co);
      return out;
    }
    const rp = depth === 'full' ? script.readAndPick : Math.min(4, script.readAndPick);
    const yt = depth === 'full' ? script.yourTurn : Math.min(3, script.yourTurn);
    for (let i = 0; i < rp; i++) items.push({ op: 'readAndPick', id: `sc:${node}:rp:${i}`, node, index: i, scoring: 'exposure', credit: [node] });
    for (let i = 0; i < yt; i++) items.push({ op: 'yourTurn', id: `sc:${node}:yt:${i}`, node, index: i, scoring: i < 5 ? 'learning' : 'exposure', credit: [node] });
    const secs = (depth === 'full' ? SECONDS.hook + SECONDS.rule : 0) + SECONDS.examples + rp * SECONDS.readAndPick + yt * SECONDS.yourTurn;
    const parts: TeachBlock['parts'] = depth === 'full' ? ['hook', 'examples', 'rule', 'readAndPick', 'yourTurn', 'pitfalls'] : ['examples', 'readAndPick', 'yourTurn'];
    return [{ kind: 'teach', part: 'core', deliberate: false, node, nodeKind: kind, script: true, parts, items, examples: [], minutes: round1(secs / 60) }];
  }

  /** A practice block on one node; returns undefined (and logs a shortage) when nothing gated and unseen is left. */
  private practice(
    kind: PracticeBlock['kind'], node: NodeId, n: number, ops: PracticeOp[], direction: 'receptive' | 'productive',
    opts: { focus?: NodeId; firstScoring?: 'review' | 'exposure'; question?: boolean; push?: boolean } = {},
  ): PracticeBlock | undefined {
    let sents = this.pickSentences(node, n, { question: opts.question });
    if (opts.question && sents.length < n) sents = sents.concat(this.pickSentences(node, n - sents.length));
    if (sents.length < n) this.diag({ code: 'shortage', block: kind, node, what: 'sentence', wanted: n, got: sents.length, unit: this.unit?.id, message: `${kind}: ${sents.length}/${n} unseen gated sentences for ${node}` });
    if (!sents.length) return undefined;
    const items = sents.map((s, i) => this.practiceItem(ops[i % ops.length], node, s, direction, i === 0 ? (opts.firstScoring ?? 'exposure') : 'exposure'));
    const b: PracticeBlock = { kind, part: 'core', deliberate: false, focus: opts.focus, items, minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60) };
    if (opts.push !== false) this.blocks.push(b);
    return b;
  }

  private practiceItem(op: PracticeOp, node: NodeId, s: SentenceRef, direction: 'receptive' | 'productive', scoring: 'review' | 'exposure' | 'none'): PracticeItem {
    return { op, id: `${op}:${s.id}`, node, sentence: s.id, direction, scoring, credit: creditOf(node, s) };
  }

  /** Scoring for the first item on a node: a real review if the card exists and the warm-up did not already review it. */
  private firstScoring(node: NodeId, direction: 'receptive' | 'productive'): 'review' | 'exposure' {
    return this.L.hasCard(node, direction) && !this.warmupKeys.has(node) ? 'review' : 'exposure';
  }

  private drill(node: NodeId, day: Unit['days'][number] | undefined, advancing: boolean) {
    this.drilled = node;
    this.blocks.push({ kind: 'ruleRecall', part: 'core', deliberate: true, node, minutes: round1(SECONDS.ruleRecall / 60) });
    this.practice('structuredInput', node, COUNTS.structuredInput, ['pick'], 'receptive', { focus: node, firstScoring: this.firstScoring(node, 'receptive') });

    // Controlled output, interleaved: ~60% latest, ~40% older points + a known contrast.
    const total = COUNTS.controlledOutput;
    const older = [
      ...(day?.focus ?? []).filter((n) => n !== node && this.known.has(n) && ['grammar', 'pattern'].includes(kindOf(n, this.course.nodes))),
      ...this.path.recentGrammar.filter((n) => n !== node && this.known.has(n)),
    ].filter((n, i, a) => a.indexOf(n) === i).slice(0, 3);
    const contrast = this.pickContrast([node, ...older]);
    const nLatest = older.length || contrast ? Math.round(total * COUNTS.latestShare) : total;
    const ops: PracticeOp[] = ['choose', 'type', 'transform', 'translate'];
    const latest = this.practice('controlledOutput', node, nLatest, ops, 'productive', { push: false, firstScoring: this.firstScoring(node, 'productive') });
    const items: PracticeItem[] = latest ? [...latest.items] : [];
    const oldSources: NodeId[] = [...older, ...(contrast ? [contrast] : [])];
    let need = total - nLatest;
    for (let i = 0; need > 0 && oldSources.length && i < total * 2; i++) {
      const src = oldSources[i % oldSources.length];
      const [s] = this.pickSentences(src, 1);
      if (s) { items.push(this.practiceItem(ops[items.length % ops.length], src, s, 'productive', 'exposure')); need--; }
    }
    if (items.length) {
      this.rng.shuffle(items);
      this.blocks.push({ kind: 'controlledOutput', part: 'core', deliberate: false, focus: node, contrast, items, minutes: round1(items.reduce((a, it) => a + SECONDS[it.op], 0) / 60) });
    }
    this.practice('communicative', node, COUNTS.communicative, ['respond'], 'productive', { focus: node, question: true });
    const task = this.taskFor(node);
    if (task) this.blocks.push({ kind: 'writing', part: 'core', deliberate: false, task, purpose: 'freer', focus: node, minutes: this.content.tasks.get(task)!.minutes });
    else {
      const waiting = [...this.content.tasks.values()].some((t) => t.focus === node && !this.L.ledger.hasSeen('item', `wt:${t.id}`) && this.waitingOnOwed(t.requires));
      if (waiting) this.diag({ code: 'deferred', block: 'writing', node, message: `writing task on ${node} waits for owed items` });
      else this.diag({ code: 'shortage', block: 'writing', node, what: 'task', wanted: 1, got: 0, unit: this.unit?.id, message: `no unseen gated writing task focused on ${node}` });
    }
    // optional new words, only if the backlog allows (takeNew returns none when throttled)
    this.pushLearn(this.takeNew('drill', day, advancing, { focusNonGrammar: true }));
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

  private pushRead(ch: ChapterRef) {
    this.readChapter = ch.id;
    this.blocks.push({ kind: 'read', part: 'core', deliberate: false, chapter: ch.id, questions: ch.questions, minutes: ch.minutes });
  }

  /**
   * A gated item whose missing nodes should all be known by now (owed after a
   * throttle cut) is only DEFERRED: it is served once they are introduced.
   * Anything else is a real supply shortage.
   */
  private waitingOnOwed(requires: readonly NodeId[]): boolean {
    const here = dayPos(this.course, this.path.unit, this.path.day);
    const missing = requires.filter((r) => !this.known.has(r) && !this.sessionNew.has(r));
    return missing.length > 0 && missing.every((r) => (this.course.teachPos.get(r) ?? Infinity) <= here);
  }

  /** Returns true when it was a real shortage (false = deferred or already seen). */
  private chapterProblem(id: string, reason: 'seen' | 'missing' | 'gated'): boolean {
    if (reason === 'seen') { this.diag({ code: 'alreadySeen', block: 'read', message: `chapter ${id} already read: skipped, not repeated` }); return false; }
    const ch = this.content.chapterById.get(id);
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
    if (ch) this.pushRead(ch);
    else shortage = this.chapterProblem(blocked ?? day.chapter ?? '(unit chapter)', reason!);
    // cued production on today's new words
    const items: PracticeItem[] = [];
    for (const it of learn) {
      if (items.length >= COUNTS.cuedMax) break;
      const [s] = this.pickSentences(it.node, COUNTS.cuedPerLexeme);
      if (s) items.push(this.practiceItem(items.length % 2 ? 'translate' : 'gap', it.node, s, 'productive', 'exposure'));
    }
    if (items.length) this.blocks.push({ kind: 'cuedProduction', part: 'core', deliberate: false, items, minutes: round1(items.reduce((a, x) => a + SECONDS[x.op], 0) / 60) });
    if (ch) this.blocks.push({ kind: 'reread', part: 'core', deliberate: true, chapter: ch.id, purpose: 'fluency', timed: true, minutes: round1(ch.minutes * 0.5) });
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
      this.practice('controlledOutput', p, nOut, ['choose', 'type', 'translate'], 'productive', { focus: p });
    }
  }

  private outputDay(day: Unit['days'][number], d: Decision) {
    this.warmupStd();
    // repay owed items first, so the scene/task they gate can be served today
    this.pushLearn(this.takeNew('output', day, false));
    const scene = this.sceneFor(day.scene);
    const task = this.taskFor();
    if (scene) this.blocks.push({ kind: 'scene', part: 'core', deliberate: false, scene, purpose: 'output', minutes: this.content.scenes.get(scene)!.minutes });
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
    if (scene) this.blocks.push({ kind: 'scene', part: 'core', deliberate: false, scene, purpose: 'checkpoint', minutes: this.content.scenes.get(scene)!.minutes });
    else this.sceneProblem('checkpoint interaction');
    if (this.unit) this.blocks.push({ kind: 'selfCheck', part: 'core', deliberate: false, unit: this.unit.id, canDo: this.unit.canDo, minutes: round1(SECONDS.selfCheck / 60) });
  }

  private reviewDay(d: Decision, day: Unit['days'][number] | undefined) {
    const budget = throttleMinutes(this.tier, this.band) + REVIEW_DAY_EXTRA_MINUTES;
    // With a backlog the whole session goes to reviews; otherwise the extended SRS budget (everything due fits).
    const cap = this.throttled ? Math.max(budget, this.minutes - 1) : Math.max(budget, this.dueMinutes);
    const w = this.warmup(cap, budget, true);
    let left = this.minutes - w.minutes - SECONDS.close / 60;
    const catchUp = day ? this.chapterFor(undefined).ch : undefined;
    if (catchUp && left >= catchUp.minutes) { this.pushRead(catchUp); left -= catchUp.minutes; }
    if (left >= 3) left -= this.remix()?.minutes ?? 0;
    if (left >= 3) left -= this.notice()?.minutes ?? 0;
    if (left >= 1.5) this.leech();
    // owed items are repaid when the backlog allows (also after the course is finished)
    this.pushLearn(this.takeNew('review', day, false));
  }

  /** Grammar remix across the last units, plus one known contrast. */
  private remix(): PracticeBlock | undefined {
    const recent = this.path.recentGrammar.filter((n) => this.known.has(n));
    const inWindow = recent.filter((n) => (this.L.node(n)?.introducedAt ?? 0) >= this.now - REMIX_WINDOW_DAYS * DAY_MS);
    const nodes = inWindow.length >= 2 ? inWindow : recent.slice(0, 4);
    const contrast = this.pickContrast(nodes);
    const sources = [...nodes, ...(contrast ? [contrast] : [])];
    if (!sources.length) return undefined;
    const items: PracticeItem[] = [];
    const ops: PracticeOp[] = ['choose', 'type', 'transform', 'translate'];
    for (let i = 0; items.length < COUNTS.remix && i < COUNTS.remix * 3; i++) {
      const src = sources[i % sources.length];
      const [s] = this.pickSentences(src, 1);
      if (s) items.push(this.practiceItem(ops[i % ops.length], src, s, 'productive', 'exposure'));
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
      const [s] = this.pickSentences(node, 1);
      if (!s) continue; // a leech without a fresh context waits; never a seen sentence
      const dir = this.L.hasCard(node, 'productive') ? 'productive' : 'receptive';
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
    const items = sents.filter((s) => s.requires.length).map((s) => this.practiceItem('read', s.targets[0] ?? s.requires[0], s, 'receptive', 'exposure'));
    if (!items.length) return;
    this.blocks.push({ kind: 'extraReading', part: 'core', deliberate: false, items, minutes: round1(items.length * SECONDS.read / 60) });
  }

  // ---------------------------------------------------------------- minimum

  private minimum(day: Unit['days'][number] | undefined): SessionPlan {
    this.warmup(MINIMUM_WARMUP_MINUTES, MINIMUM_WARMUP_MINUTES, false);
    const ch = this.rereadCandidate([0, 0], 1);
    if (ch) this.blocks.push({ kind: 'reread', part: 'core', deliberate: true, chapter: ch.id, purpose: 'minimum', timed: false, minutes: Math.min(3, ch.minutes) });
    else this.diag({ code: 'noReread', block: 'reread', message: 'no known chapter to re-read yet' });
    // known items, productive ones first, most recently practised first
    const recall = this.L.nodes()
      .filter((id) => !this.warmupKeys.has(id) && (this.L.hasCard(id, 'productive') || this.L.hasCard(id, 'receptive')))
      .map((id) => {
        const p = this.L.card(id, 'productive');
        return { id, prod: p ? 1 : 0, at: (p ?? this.L.card(id, 'receptive'))!.last_review ?? 0 };
      })
      .sort((a, b) => b.prod - a.prod || b.at - a.at || (a.id < b.id ? -1 : 1))
      .slice(0, Math.floor(COUNTS.timedRecallSeconds / SECONDS.recall))
      .map(({ id }) => ({ op: 'recall' as const, id: `tr:${id}`, node: id, direction: 'productive' as const, scoring: 'exposure' as const, credit: [id] }));
    if (recall.length) this.blocks.push({ kind: 'timedRecall', part: 'core', deliberate: true, items: recall, seconds: COUNTS.timedRecallSeconds, minutes: COUNTS.timedRecallSeconds / 60 });
    this.blocks.push(this.close({ type: 'review', advances: false }, day, true));
    const path = structuredClone(this.path);
    path.log = [...path.log, this.logEntry({ type: 'review', advances: false }, undefined, day, true)].slice(-LOG_MAX);
    return {
      sessionIndex: this.sessionIndex, seed: this.seed, tier: 'minimum', mode: this.mode, type: 'minimum',
      dayType: day?.type, unit: this.unit?.id, day: day ? this.path.day : undefined,
      advancesPath: false, blocks: this.blocks, newNodes: this.newNodes, receptiveOnly: this.receptiveOnly,
      budget: {
        band: this.band, minutes: this.minutes, reviewMinutes: MINIMUM_WARMUP_MINUTES, secondsPerReview: this.spr,
        due: this.due.length, dueMinutes: this.dueMinutes, throttled: this.dueMinutes > MINIMUM_WARMUP_MINUTES, severe: false,
      },
      estimatedMinutes: round1(this.blocks.reduce((a, b) => a + b.minutes, 0)),
      diagnostics: this.diags, pathAfter: path,
    };
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
    p.owedNew = this.owedNew;
    p.owedGrammar = this.owedGrammar;
    if (d.advances && day && this.unit) {
      // the day is consumed: anything it teaches that was not introduced is owed, never lost
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
    p.log = [...p.log, this.logEntry(d, c, day)].slice(-LOG_MAX);
    return p;
  }

  private diag(d: Diagnostic) { this.diags.push(d); }
}

function creditOf(node: NodeId, s: SentenceRef): NodeId[] {
  return [node, ...s.requires.filter((r) => r !== node)];
}

function round1(x: number): number { return Math.round(x * 10) / 10; }
