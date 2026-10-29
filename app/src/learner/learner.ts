// The learner model: the single owner of everything the app knows about one
// learner. Two FSRS cards per node (receptive es→en, productive en→es), the
// in-lesson learning steps, implicit sentence credit, reading exposure, the
// exposure ledger, session index, settings and measured timing.
//
// Every mutation updates the in-memory state synchronously and schedules a
// coalesced save to the LearnerStore; `flush()` awaits the pending save.
import type { Card, FSRS } from 'ts-fsrs';
import type { NodeId } from '../content/schema';
import { compact, emptyLog, type EventLog, type ReviewEvent } from './events';
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

/**
 * Recognition-only maintenance. Once a node is learned:
 *  - its productive card may grow to MAINTENANCE_MAX_INTERVAL_DAYS (or
 *    settings.maximumInterval, if that is larger), so a learned word comes
 *    back about once a year at most;
 *  - its receptive card is suspended: never due again and no partial credit.
 *    Production subsumes recognition (if you can say it, you can read it), so
 *    the en→es card alone maintains the item. A later productive lapse is
 *    handled by the productive card's own relearning; the receptive card stays
 *    suspended (it is kept, never deleted).
 * Receptive-only nodes (see productivePolicy) are learned on their receptive
 * card (stability ≥ 60 d and a novel pass) and get the maintenance cap there.
 */
export const MAINTENANCE_MAX_INTERVAL_DAYS = 365;

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
  op?: string;          // event log: what produced the outcome (default 'other')
  tries?: number;       // event log: attempts used (clamped to 1 or 2)
  sentence?: string;    // event log: bank sentence id
}

/** Describes an answered item whose credit is exposure only (see Learner.expose). */
export interface ExposureEvent {
  op: string;
  direction?: Direction;
  grade?: Grade;
  tries?: number;
  ms?: number;
  sentence?: string;
  novel?: boolean;
}

const triesOf = (t?: number): 1 | 2 => (t !== undefined && t > 1 ? 2 : 1);

export interface SentenceCreditOptions extends ReviewOptions {
  /** the single target (default: the first id) */
  target?: NodeId;
  /** several targets in one sentence (multi-item review): each gets a full review; overrides `target` */
  targets?: NodeId[];
  /** per-target grades (default: `grade` for every target) */
  grades?: Partial<Record<NodeId, Grade>>;
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

export interface DueCard { node: NodeId; direction: Direction; due: number; state: State; stability: number; r: number }

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
  /** same parameters, maximum interval = the maintenance cap (learned cards) */
  private maintenanceScheduler: FSRS;
  private readonly now: () => number;
  private saving: Promise<void> = Promise.resolve();
  private dirty = false;
  private saveQueued = false;
  readonly ledger: Ledger;
  private log: EventLog = emptyLog();
  private eventsDirty = false;

  private constructor(state: LearnerState, private readonly store: LearnerStore | null, opts: LearnerOptions) {
    this.state = state;
    this.now = opts.now ?? Date.now;
    this.scheduler = makeScheduler(state.settings, state.weights);
    this.maintenanceScheduler = this.makeMaintenance();
    this.ledger = new Ledger(() => this.state, () => this.touch(), this.now);
  }

  /** Load (and migrate) the learner from a store, or start fresh. */
  static async open(store: LearnerStore, opts: LearnerOptions = {}): Promise<Learner> {
    const raw = await store.load();
    const state = raw === undefined ? emptyState((opts.now ?? Date.now)()) : migrate(raw);
    const l = new Learner(state, store, opts);
    const rawLog = await store.loadEvents?.();
    if (rawLog && typeof rawLog === 'object' && Array.isArray((rawLog as any).events)) {
      const lg = rawLog as EventLog;
      l.log = compact({ events: lg.events, summary: lg.summary ?? { upTo: 0, counts: {} } }, 365, l.now());
    }
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
      if (this.eventsDirty && this.store!.saveEvents) {
        this.eventsDirty = false;
        await this.store!.saveEvents(structuredClone(this.log));
      }
    });
  }

  /** The review event log, oldest first (a copy). */
  events(): ReviewEvent[] { return structuredClone(this.log.events); }
  /** The counts of events compacted away. */
  eventSummary(): EventLog['summary'] { return structuredClone(this.log.summary); }

  private record(e: Omit<ReviewEvent, 'session' | 'novel' | 'tries'> & { novel?: boolean; tries?: number }): void {
    const { tries, novel, ...rest } = e;
    this.log.events.push({ ...rest, tries: triesOf(tries), novel: !!novel, session: this.state.session.index });
    this.eventsDirty = true;
    this.dirty = true;
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
    this.maintenanceScheduler = this.makeMaintenance();
    this.touch();
  }

  private makeMaintenance(): FSRS {
    const s = this.state.settings;
    return makeScheduler({ ...s, maximumInterval: Math.max(s.maximumInterval, MAINTENANCE_MAX_INTERVAL_DAYS) }, this.state.weights);
  }

  /** Install fitted FSRS weights (19 or 21 numbers). undefined restores FSRS-5 defaults. */
  setWeights(w: number[] | undefined): void {
    this.state.weights = w ? [...w] : undefined;
    this.scheduler = makeScheduler(this.state.settings, this.state.weights);
    this.maintenanceScheduler = this.makeMaintenance();
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
  /** Whether the node has (or will unlock) a production card. Absent flag = true. */
  hasProductiveTrack(id: NodeId): boolean { return this.state.nodes[id]?.productiveTrack !== false; }

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
   * `productive` (default true) fixes, once, whether the node will ever get a
   * production card (see productivePolicy); it is not changed by a re-introduce.
   */
  introduce(id: NodeId, opts: { at?: number; results?: boolean[]; ms?: number[]; productive?: boolean } = {}): NodeRecord {
    const at = opts.at ?? this.now();
    if (!this.state.nodes[id]) {
      this.state.nodes[id] = { id, introducedAt: at, introDay: this.day(at), learning: { steps: [] }, novelPasses: 0, exposures: 0, productiveTrack: opts.productive ?? true };
      this.touch();
    }
    if (opts.results && this.state.nodes[id].learning) {
      opts.results.forEach((ok, i) => this.learningStep(id, ok, { at: at + i * 60_000, ms: opts.ms?.[i] }));
      this.completeIntroduction(id, { at: at + opts.results.length * 60_000 });
    }
    return structuredClone(this.state.nodes[id]);
  }

  /** Record one within-session retrieval. `done` says the session can stop asking. */
  learningStep(id: NodeId, correct: boolean, opts: { at?: number; ms?: number; op?: string; tries?: number; sentence?: string; novel?: boolean } = {}): StepResult {
    const r = this.rec(id);
    if (!r.learning) throw new Error(`node ${id} is not in in-lesson learning`);
    const at = opts.at ?? this.now();
    r.learning.steps.push({ at, correct, ...(opts.ms !== undefined ? { ms: opts.ms } : {}) });
    this.record({
      at, node: id, dir: 'receptive', grade: correct ? Rating.Good : Rating.Again, op: opts.op ?? 'learn', scored: 'intro',
      tries: opts.tries, novel: opts.novel, ...(opts.ms !== undefined ? { ms: opts.ms } : {}), ...(opts.sentence ? { sentence: opts.sentence } : {}),
    });
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
    const maint = this.isMaintenanceCard(r, direction);
    const ret = this.retrievability(id, direction, at);
    this.record({
      at, node: id, dir: direction, grade, op: opts.op ?? 'other', scored: 'review', tries: opts.tries, novel: opts.novel,
      ...(opts.ms !== undefined ? { ms: opts.ms } : {}), ...(opts.sentence ? { sentence: opts.sentence } : {}),
      ...(ret !== undefined ? { r: ret } : {}),
    });
    const next = this.capInterval((maint ? this.maintenanceScheduler : this.scheduler).next(toCard(card), new Date(at), grade).card, this.maxInterval(r, direction));
    r[direction] = fromCard(next, { baseStability: next.stability, partials: card.partials, suspended: card.suspended });
    if (opts.ms !== undefined) this.recordTime(direction, opts.ms);
    if (opts.novel && grade !== Rating.Again) r.novelPasses += 1;
    let unlocked = false;
    if (direction === 'receptive' && grade !== Rating.Again && !r.productive && r.productiveTrack !== false && this.day(at) > r.introDay) {
      r.productive = newCard(at);
      r.productiveUnlockedAt = at;
      unlocked = true;
    }
    this.maintain(r);
    this.touch();
    return this.result(id, direction, grade, r[direction]!, unlocked);
  }

  /**
   * Credit every node in a reviewed sentence. `target` (default: the first
   * id) gets a full review; the others get bounded partial credit, see
   * PARTIAL_WEIGHT. Ids without a usable card are skipped silently.
   */
  creditSentence(nodeIds: NodeId[], direction: Direction, grade: Grade, opts: SentenceCreditOptions = {}): { target?: ReviewResult; targets: ReviewResult[]; partial: PartialResult[] } {
    const at = opts.at ?? this.now();
    const targets = [...new Set(opts.targets ?? [opts.target ?? nodeIds[0]])].filter((x): x is NodeId => x !== undefined);
    const out: { target?: ReviewResult; targets: ReviewResult[]; partial: PartialResult[] } = { targets: [], partial: [] };
    // Multi-item review: every target gets its own full review (its own grade);
    // only the first target's time is recorded (the item was answered once).
    let allPassed = true;
    targets.forEach((t, i) => {
      const g = opts.grades?.[t] ?? grade;
      if (g !== Rating.Good && g !== Rating.Easy) allPassed = false;
      if (!this.state.nodes[t]?.[direction]) return;
      out.targets.push(this.review(t, direction, g, { ...opts, at, ms: i === 0 ? opts.ms : undefined }));
    });
    out.target = out.targets[0];
    if (!allPassed) return out;
    const today = this.day(at);
    for (const id of new Set(nodeIds)) {
      if (targets.includes(id)) continue;
      const card = this.state.nodes[id]?.[direction];
      if (!card || card.suspended || card.state !== State.Review || card.last_review === undefined) continue;
      if (card.lastPartialDay === today || this.day(card.last_review) === today) continue;
      const rec = this.state.nodes[id]!;
      const full = (this.isMaintenanceCard(rec, direction) ? this.maintenanceScheduler : this.scheduler).next(toCard(card), new Date(at), Rating.Good).card.stability;
      const s = card.stability;
      const base = card.baseStability ?? s;
      let ns = s + PARTIAL_WEIGHT * Math.max(0, full - s);
      ns = Math.min(ns, s * PARTIAL_STEP_CAP, Math.max(s, base * PARTIAL_TOTAL_CAP));
      if (ns <= s) { card.lastPartialDay = today; continue; }
      const days = Math.min(this.maintenanceScheduler.next_interval(ns, 0), this.maxInterval(rec, direction));
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

  /**
   * Reading / context exposure: counts only, never a scored review, never moves
   * a card. Pass `event` when the exposure came from an answered item (not from
   * reading) and an 'exposure' event is logged per introduced node.
   */
  expose(nodeIds: Iterable<NodeId>, opts: { at?: number; event?: ExposureEvent } = {}): void {
    const at = opts.at ?? this.now();
    let changed = false;
    for (const id of new Set(nodeIds)) {
      const r = this.state.nodes[id];
      if (!r) continue;
      r.exposures += 1;
      r.lastExposedAt = at;
      changed = true;
      const ev = opts.event;
      if (ev) {
        this.record({
          at, node: id, dir: ev.direction ?? 'receptive', grade: ev.grade ?? Rating.Good, op: ev.op, scored: 'exposure',
          tries: ev.tries, novel: ev.novel, ...(ev.ms !== undefined ? { ms: ev.ms } : {}), ...(ev.sentence ? { sentence: ev.sentence } : {}),
        });
      }
    }
    if (changed) this.touch();
  }

  // ---------------------------------------------------------------- queries

  /**
   * Cards due at `at` (default now), most at risk first: lowest retrievability
   * (probability of recall) ascending, then earliest due, then node id.
   * Learning and Relearning cards count as r = 0.
   */
  due(at = this.now(), direction?: Direction): DueCard[] {
    const out: DueCard[] = [];
    for (const r of Object.values(this.state.nodes)) {
      for (const d of direction ? [direction] : DIRECTIONS) {
        const c = r[d];
        if (!c || c.suspended || c.due > at) continue;
        const learning = c.state === State.Learning || c.state === State.Relearning;
        const rec = learning || !(c.stability > 0) ? 0 : this.scheduler.get_retrievability(toCard(c), new Date(at), false);
        out.push({ node: r.id, direction: d, due: c.due, state: c.state as State, stability: c.stability, r: rec });
      }
    }
    return out.sort((a, b) => a.r - b.r || a.due - b.due || (a.node < b.node ? -1 : a.node > b.node ? 1 : a.direction < b.direction ? -1 : a.direction > b.direction ? 1 : 0));
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

  /**
   * Learned = productive stability ≥ 60 days AND ≥ 1 passed recombination
   * review. A receptive-only node is learned on its receptive card instead.
   */
  isLearned(id: NodeId): boolean {
    const r = this.state.nodes[id];
    return !!r && this.learnedRec(r);
  }

  private learnedRec(r: NodeRecord): boolean {
    const card = r.productiveTrack === false ? r.receptive : r.productive;
    return !!card && card.stability >= LEARNED_STABILITY_DAYS && r.novelPasses >= 1;
  }

  /** The card that maintains a learned node: productive, or receptive for receptive-only nodes. */
  private maintenanceDirection(r: NodeRecord): Direction {
    return r.productiveTrack === false ? 'receptive' : 'productive';
  }

  private isMaintenanceCard(r: NodeRecord, direction: Direction): boolean {
    return direction === this.maintenanceDirection(r) && this.learnedRec(r);
  }

  private maxInterval(r: NodeRecord, direction: Direction): number {
    const max = this.state.settings.maximumInterval;
    return this.isMaintenanceCard(r, direction) ? Math.max(max, MAINTENANCE_MAX_INTERVAL_DAYS) : max;
  }

  /** Recognition-only maintenance: once learned, the receptive card of a productive node is suspended. */
  private maintain(r: NodeRecord): void {
    if (r.productiveTrack === false || !r.receptive || r.receptive.suspended) return;
    if (this.learnedRec(r)) r.receptive.suspended = true;
  }

  /** Whether the card is suspended (recognition-only maintenance). */
  isSuspended(id: NodeId, direction: Direction): boolean { return !!this.state.nodes[id]?.[direction]?.suspended; }

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
  private capInterval(c: Card, max = this.state.settings.maximumInterval): Card {
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
