// The learner model: the single owner of everything the app knows about one
// learner. Two FSRS cards per node (receptive es→en, productive en→es), the
// in-lesson learning steps, implicit sentence credit, reading exposure, the
// exposure ledger, session index, settings and measured timing.
//
// Every mutation updates the in-memory state synchronously and schedules a
// coalesced save to the LearnerStore; `flush()` awaits the pending save.
import type { Card, FSRS } from 'ts-fsrs';
import type { NodeId } from '../content/schema';
import { Ledger } from './ledger';
import { fromCard, makeScheduler, newCard, Rating, State, toCard, type Grade } from './scheduler';
import {
  dayKey, DIRECTIONS, emptyState, migrate,
  type CardJSON, type Direction, type LearnerState, type NodeRecord, type Settings,
} from './state';
import type { LearnerStore } from './store';

export { Rating, State };
export type { Grade };

/** Productive stability (days) an item needs before it counts as learned. */
export const LEARNED_STABILITY_DAYS = 60;

/** In-lesson retrievals: at least MIN, at most MAX (BLUEPRINT's 3–5 spaced retrievals). */
export const LEARNING_STEPS_MIN = 3;
export const LEARNING_STEPS_MAX = 5;

/**
 * Implicit credit for the non-target nodes of a reviewed sentence.
 *
 * The target node gets a full FSRS review. Every other node in the sentence
 * that already has a card in Review state in that direction gets a *partial*
 * credit, and only when the sentence was answered Good or Easy:
 *
 *   S_full = the stability a real Good review right now would give (FSRS)
 *   S_new  = S + PARTIAL_WEIGHT × (S_full − S)
 *   capped at S × PARTIAL_STEP_CAP, and at baseStability × PARTIAL_TOTAL_CAP
 *   (baseStability = stability after the last full review).
 *
 * `last_review` is NOT moved, so the due date only slides later by the
 * stability increase; difficulty, reps and lapses are untouched. At most one
 * partial credit per node and direction per day. Consequences:
 *  - FSRS already gives little gain for early reviews, so seeing a word the
 *    day after its review earns almost nothing;
 *  - between two real reviews, partial credits can stretch an interval by at
 *    most 50%, however often the word appears;
 *  - a failed sentence never penalises the non-targets (we do not know which
 *    word was the problem), and partial credit never unlocks a productive
 *    card, never counts as a novel pass, never creates a card.
 */
export const PARTIAL_WEIGHT = 0.3;
export const PARTIAL_STEP_CAP = 1.2;
export const PARTIAL_TOTAL_CAP = 1.5;

/** Timing: per-review times are clamped, and blended with a prior until there is data. */
export const TIMING_PRIOR_SECONDS = 10;
export const TIMING_PRIOR_WEIGHT = 10;
const TIMING_MIN_MS = 300;
const TIMING_MAX_MS = 60_000;

export interface ReviewOptions {
  at?: number;
  ms?: number;          // measured time to answer
  novel?: boolean;      // a recombination: the learner had never seen this sentence
}

export interface ReviewResult {
  node: NodeId;
  direction: Direction;
  grade: Grade;
  due: number;
  stability: number;
  intervalDays: number;
  unlockedProductive: boolean;
}

export interface PartialResult { node: NodeId; before: number; after: number }

export interface DueCard { node: NodeId; direction: Direction; due: number; state: State; stability: number }

export interface StepResult { steps: number; correct: number; done: boolean }

const DAY_MS = 86_400_000;

export interface LearnerOptions {
  now?: () => number;
  /** Debounce for saves; 0 = save after every mutation (still coalesced). */
  saveDelayMs?: number;
}

export class Learner {
  private state: LearnerState;
  private scheduler: FSRS;
  private readonly now: () => number;
  private saving: Promise<void> = Promise.resolve();
  private dirty = false;
  private saveQueued = false;
  readonly ledger: Ledger;

  private constructor(state: LearnerState, private readonly store: LearnerStore | null, opts: LearnerOptions) {
    this.state = state;
    this.now = opts.now ?? Date.now;
    this.scheduler = makeScheduler(state.settings, state.weights);
    this.ledger = new Ledger(() => this.state, () => this.touch(), this.now);
  }

  /** Load (and migrate) the learner from a store, or start fresh. */
  static async open(store: LearnerStore, opts: LearnerOptions = {}): Promise<Learner> {
    const raw = await store.load();
    const state = raw === undefined ? emptyState((opts.now ?? Date.now)()) : migrate(raw);
    const l = new Learner(state, store, opts);
    if (raw === undefined || (raw as any).version !== state.version) { l.touch(); await l.flush(); }
    return l;
  }

  /** A learner with no store (unit tests, simulator). */
  static fresh(opts: LearnerOptions = {}): Learner {
    return new Learner(emptyState((opts.now ?? Date.now)()), null, opts);
  }

  static fromJSON(json: unknown, opts: LearnerOptions = {}): Learner {
    return new Learner(migrate(json), null, opts);
  }

  /** A deep copy of the whole state, safe to JSON.stringify. */
  toJSON(): LearnerState { return structuredClone(this.state); }

  // ---------------------------------------------------------------- persistence

  private touch(): void {
    this.dirty = true;
    if (!this.store || this.saveQueued) return;
    this.saveQueued = true;
    this.saving = this.saving.then(async () => {
      this.saveQueued = false;
      if (!this.dirty) return;
      this.dirty = false;
      await this.store!.save(structuredClone(this.state));
    });
  }

  /** Resolves once everything mutated so far has been written. */
  async flush(): Promise<void> {
    if (!this.store) return;
    if (this.dirty && !this.saveQueued) this.touch();
    await this.saving;
  }

  // ---------------------------------------------------------------- settings / session

  get settings(): Readonly<Settings> { return this.state.settings; }

  setSettings(patch: Partial<Settings>): void {
    const s = { ...this.state.settings, ...patch };
    if (!(s.retention > 0.7 && s.retention < 0.99)) throw new Error(`retention out of range: ${s.retention}`);
    this.state.settings = s;
    this.scheduler = makeScheduler(s, this.state.weights);
    this.touch();
  }

  /** Install fitted FSRS weights (19 or 21 numbers). undefined restores FSRS-5 defaults. */
  setWeights(w: number[] | undefined): void {
    this.state.weights = w ? [...w] : undefined;
    this.scheduler = makeScheduler(this.state.settings, this.state.weights);
    this.touch();
  }

  get sessionIndex(): number { return this.state.session.index; }

  /** Call when a session starts. Returns the new session index (1-based). */
  startSession(at = this.now()): number {
    const s = this.state.session;
    s.index += 1;
    s.lastStartedAt = at;
    s.lastDay = this.day(at);
    this.touch();
    return s.index;
  }

  day(at = this.now()): string { return dayKey(at, this.state.settings.rolloverHour); }

  // ---------------------------------------------------------------- nodes

  /** A copy of the node's record (mutating it does nothing). */
  node(id: NodeId): NodeRecord | undefined {
    const r = this.state.nodes[id];
    return r && structuredClone(r);
  }
  nodes(): NodeId[] { return Object.keys(this.state.nodes); }
  isIntroduced(id: NodeId): boolean { return id in this.state.nodes; }
  isLearning(id: NodeId): boolean { return !!this.state.nodes[id]?.learning; }
  hasCard(id: NodeId, direction: Direction): boolean { return !!this.state.nodes[id]?.[direction]; }
  isProductiveUnlocked(id: NodeId): boolean { return this.hasCard(id, 'productive'); }

  private rec(id: NodeId): NodeRecord {
    const r = this.state.nodes[id];
    if (!r) throw new Error(`node not introduced: ${id}`);
    return r;
  }

  // ---------------------------------------------------------------- in-lesson learning

  /**
   * Start teaching a node in-lesson. If `results` is given (3–5 retrieval
   * outcomes in order), records them and hands the node to FSRS at once;
   * otherwise the session calls `learningStep` per retrieval and then
   * `completeIntroduction`. Re-introducing a known node is a no-op.
   */
  introduce(id: NodeId, opts: { at?: number; results?: boolean[]; ms?: number[] } = {}): NodeRecord {
    const at = opts.at ?? this.now();
    if (!this.state.nodes[id]) {
      this.state.nodes[id] = { id, introducedAt: at, introDay: this.day(at), learning: { steps: [] }, novelPasses: 0, exposures: 0 };
      this.touch();
    }
    if (opts.results && this.state.nodes[id].learning) {
      opts.results.forEach((ok, i) => this.learningStep(id, ok, { at: at + i * 60_000, ms: opts.ms?.[i] }));
      this.completeIntroduction(id, { at: at + opts.results.length * 60_000 });
    }
    return structuredClone(this.state.nodes[id]);
  }

  /** Record one within-session retrieval. `done` says the session can stop asking. */
  learningStep(id: NodeId, correct: boolean, opts: { at?: number; ms?: number } = {}): StepResult {
    const r = this.rec(id);
    if (!r.learning) throw new Error(`node ${id} is not in in-lesson learning`);
    r.learning.steps.push({ at: opts.at ?? this.now(), correct, ...(opts.ms !== undefined ? { ms: opts.ms } : {}) });
    if (opts.ms !== undefined) this.recordTime('receptive', opts.ms);
    this.touch();
    return this.stepStatus(r);
  }

  private stepStatus(r: NodeRecord): StepResult {
    const steps = r.learning?.steps ?? [];
    const n = steps.length;
    const correct = steps.filter((s) => s.correct).length;
    const lastTwo = n >= 2 && steps[n - 1].correct && steps[n - 2].correct;
    return { steps: n, correct, done: n >= LEARNING_STEPS_MAX || (n >= LEARNING_STEPS_MIN && lastTwo) };
  }

  /**
   * Hand the node to FSRS. The first receptive rating comes from the
   * in-lesson performance: last retrieval wrong → Again; any miss, or fewer
   * than 3 retrievals → Hard; otherwise Good (→ first review in ~3 days).
   */
  completeIntroduction(id: NodeId, opts: { at?: number } = {}): ReviewResult {
    const r = this.rec(id);
    if (!r.learning) throw new Error(`node ${id} already completed its introduction`);
    const steps = r.learning.steps;
    const at = opts.at ?? this.now();
    let grade: Grade;
    if (steps.length === 0 || !steps[steps.length - 1].correct) grade = Rating.Again;
    else if (steps.length < LEARNING_STEPS_MIN || steps.some((s) => !s.correct)) grade = Rating.Hard;
    else grade = Rating.Good;
    const next = this.scheduler.next(toCard(newCard(r.introducedAt)), new Date(at), grade).card;
    r.receptive = fromCard(next, { baseStability: next.stability });
    delete r.learning;
    this.touch();
    return this.result(id, 'receptive', grade, r.receptive, false);
  }

  // ---------------------------------------------------------------- scored reviews

  /** A full, scored FSRS review of one card. */
  review(id: NodeId, direction: Direction, grade: Grade, opts: ReviewOptions = {}): ReviewResult {
    const r = this.rec(id);
    const card = r[direction];
    if (!card) throw new Error(`no ${direction} card for ${id}${direction === 'productive' ? ' (still locked)' : ''}`);
    const at = opts.at ?? this.now();
    const next = this.capInterval(this.scheduler.next(toCard(card), new Date(at), grade).card);
    r[direction] = fromCard(next, { baseStability: next.stability, partials: card.partials });
    if (opts.ms !== undefined) this.recordTime(direction, opts.ms);
    if (opts.novel && grade !== Rating.Again) r.novelPasses += 1;
    let unlocked = false;
    if (direction === 'receptive' && grade !== Rating.Again && !r.productive && this.day(at) > r.introDay) {
      r.productive = newCard(at);
      r.productiveUnlockedAt = at;
      unlocked = true;
    }
    this.touch();
    return this.result(id, direction, grade, r[direction]!, unlocked);
  }

  /**
   * Credit every node in a reviewed sentence. `target` (default: the first
   * id) gets a full review; the others get bounded partial credit, see
   * PARTIAL_WEIGHT. Ids without a usable card are skipped silently.
   */
  creditSentence(nodeIds: NodeId[], direction: Direction, grade: Grade, opts: ReviewOptions & { target?: NodeId } = {}): { target?: ReviewResult; partial: PartialResult[] } {
    const at = opts.at ?? this.now();
    const target = opts.target ?? nodeIds[0];
    const out: { target?: ReviewResult; partial: PartialResult[] } = { partial: [] };
    if (target !== undefined && this.state.nodes[target]?.[direction]) {
      out.target = this.review(target, direction, grade, { ...opts, at });
    }
    if (grade !== Rating.Good && grade !== Rating.Easy) return out;
    const today = this.day(at);
    for (const id of new Set(nodeIds)) {
      if (id === target) continue;
      const card = this.state.nodes[id]?.[direction];
      if (!card || card.state !== State.Review || card.last_review === undefined) continue;
      if (card.lastPartialDay === today || this.day(card.last_review) === today) continue;
      const full = this.scheduler.next(toCard(card), new Date(at), Rating.Good).card.stability;
      const s = card.stability;
      const base = card.baseStability ?? s;
      let ns = s + PARTIAL_WEIGHT * Math.max(0, full - s);
      ns = Math.min(ns, s * PARTIAL_STEP_CAP, Math.max(s, base * PARTIAL_TOTAL_CAP));
      if (ns <= s) { card.lastPartialDay = today; continue; }
      const days = Math.min(this.scheduler.next_interval(ns, 0), this.state.settings.maximumInterval);
      card.stability = ns;
      card.scheduled_days = days;
      card.due = card.last_review + days * DAY_MS;
      card.lastPartialDay = today;
      card.partials = (card.partials ?? 0) + 1;
      out.partial.push({ node: id, before: s, after: ns });
    }
    this.touch();
    return out;
  }

  /** Reading / context exposure: counts only, never a scored review, never moves a card. */
  expose(nodeIds: Iterable<NodeId>, opts: { at?: number } = {}): void {
    const at = opts.at ?? this.now();
    let changed = false;
    for (const id of new Set(nodeIds)) {
      const r = this.state.nodes[id];
      if (!r) continue;
      r.exposures += 1;
      r.lastExposedAt = at;
      changed = true;
    }
    if (changed) this.touch();
  }

  // ---------------------------------------------------------------- queries

  /** Cards due at `at` (default now), most overdue first. */
  due(at = this.now(), direction?: Direction): DueCard[] {
    const out: DueCard[] = [];
    for (const r of Object.values(this.state.nodes)) {
      for (const d of direction ? [direction] : DIRECTIONS) {
        const c = r[d];
        if (c && c.due <= at) out.push({ node: r.id, direction: d, due: c.due, state: c.state as State, stability: c.stability });
      }
    }
    return out.sort((a, b) => a.due - b.due);
  }

  /** Probability of recall now, per FSRS. undefined if there is no card. */
  retrievability(id: NodeId, direction: Direction, at = this.now()): number | undefined {
    const c = this.state.nodes[id]?.[direction];
    if (!c || c.state === State.New) return undefined;
    return this.scheduler.get_retrievability(toCard(c), new Date(at), false);
  }

  /** A copy of the card (mutating it does nothing). */
  card(id: NodeId, direction: Direction): CardJSON | undefined {
    const c = this.state.nodes[id]?.[direction];
    return c && { ...c };
  }

  /** Learned = productive stability ≥ 60 days AND ≥ 1 passed recombination review. */
  isLearned(id: NodeId): boolean {
    const r = this.state.nodes[id];
    return !!r?.productive && r.productive.stability >= LEARNED_STABILITY_DAYS && r.novelPasses >= 1;
  }

  learnedCount(): number { return Object.keys(this.state.nodes).filter((id) => this.isLearned(id)).length; }

  // ---------------------------------------------------------------- timing

  private recordTime(direction: Direction, ms: number): void {
    if (!Number.isFinite(ms) || ms <= 0) return;
    const t = this.state.timing[direction];
    t.count += 1;
    t.totalMs += Math.min(TIMING_MAX_MS, Math.max(TIMING_MIN_MS, ms));
  }

  /**
   * Average seconds per review for this learner (the compiler's minute
   * budget divides by this). Blended with a 10 s prior worth 10 reviews, so a
   * new learner gets a sane number and one slow answer cannot swing it.
   */
  secondsPerReview(direction?: Direction): number {
    const ts = direction ? [this.state.timing[direction]] : DIRECTIONS.map((d) => this.state.timing[d]);
    const count = ts.reduce((a, t) => a + t.count, 0);
    const total = ts.reduce((a, t) => a + t.totalMs, 0) / 1000;
    return (TIMING_PRIOR_SECONDS * TIMING_PRIOR_WEIGHT + total) / (TIMING_PRIOR_WEIGHT + count);
  }

  // ---------------------------------------------------------------- helpers

  /** ts-fsrs lets Easy exceed maximum_interval by a day or two (easy ≥ good + 1); hold the line. */
  private capInterval(c: Card): Card {
    const max = this.state.settings.maximumInterval;
    if (c.scheduled_days > max && c.last_review) {
      c.scheduled_days = max;
      c.due = new Date(c.last_review.getTime() + max * DAY_MS);
    }
    return c;
  }

  private result(node: NodeId, direction: Direction, grade: Grade, c: CardJSON, unlockedProductive: boolean): ReviewResult {
    return { node, direction, grade, due: c.due, stability: c.stability, intervalDays: c.scheduled_days, unlockedProductive };
  }
}
