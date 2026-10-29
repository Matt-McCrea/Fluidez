// The session runner: the one place the UI touches the learner model. It
// follows the compiler's lifecycle exactly (see compiler/types.ts):
//   compile → learner.startSession() → run blocks, marking each block's
//   servedRefs in the ledger when the block is shown → score items per their
//   `scoring` → on finishing the core: advancePath, persist the path.
// An abandoned session leaves the path where it was.
import {
  advancePath, canDoAnother, carryOwed, compileSession, reviewTargets, servedRefs, stoppedPath,
  type Block, type Item, type LearnItem, type Mode, type PathState, type RecapBlock, type RecapItem, type ServedRef, type SessionPlan,
} from '../../compiler';
import type { NodeId } from '../../content/schema';
import { Rating, type Direction, type Grade, type Learner, type Tier } from '../../learner';
import type { Bundle } from '../data/bundle';
import type { UiStore } from '../store/ui';
import { planRecap, type Lapse } from './recap';
import { SECONDS } from '../../compiler/budget';
import { attributeGrades, type Evidence } from './attribute';

export interface Outcome {
  correct: boolean;
  /** attempts used (1 = first try) */
  tries: number;
  /** measured time to answer, ms */
  ms: number;
  /** what the card saw, for splitting a miss across a multi-target item (see attribute.ts) */
  evidence?: Evidence;
}

/** First-try pass → Good; pass on the retry → Hard; shown the answer → Again. */
export function gradeOf(o: Pick<Outcome, 'correct' | 'tries'>): Grade {
  if (!o.correct) return Rating.Again;
  return o.tries <= 1 ? Rating.Good : Rating.Hard;
}

const tries12 = (t: number): 1 | 2 => (t > 1 ? 2 : 1);
/** The event-log op for an item: warm-up reviews are 'warmup', everything else its own op. */
const eventOp = (item: Item): string => (item.op === 'review' ? 'warmup' : item.op);

export interface SceneRun { firstTry: number; turns: number; seconds: number }

/**
 * Every session is the standard tier (the learner never picks a length); the
 * minutes come from the compiler's budget for the band being studied.
 */
export function compilePlan(learner: Learner, bundle: Bundle, ui: UiStore, opts: { mode?: Mode; now?: number; tier?: Tier } = {}): SessionPlan {
  return compileSession({
    learnerId: ui.state.learnerId, learner, path: ui.path, course: bundle.course, content: bundle.index,
    now: opts.now ?? Date.now(), tier: opts.tier ?? 'standard', mode: opts.mode ?? 'next',
  });
}

/** Blocks that can go when time is up: nothing here moves the course on. */
export function softBlock(b: Block): boolean {
  return b.kind === 'personal' || b.kind === 'extraReading' || b.kind === 'leech' || b.kind === 'sceneRerun'
    || b.kind === 'recap' || (b.kind === 'reread' && b.purpose === 'fluency');
}

/** Blocks whose cards may be cut short when time is up (each card's content is ledgered as it is shown). */
export function truncatable(b: Block): boolean {
  switch (b.kind) {
    case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
    case 'remix': case 'readingCheck': case 'extraReading': case 'leech':
      return true;
    default:
      return false;
  }
}

/** The "I need to stop" option appears after this many minutes. */
export const STOP_AFTER_MINUTES = 10;

export function anotherAllowed(learner: Learner, bundle: Bundle, ui: UiStore, now = Date.now()): boolean {
  return canDoAnother({ learner, path: ui.path, course: bundle.course, content: bundle.index, learnerId: ui.state.learnerId, now, tier: 'standard' });
}

const refKey = (r: ServedRef) => `${r.kind}\u0000${r.id}\u0000${r.deliberate ? 1 : 0}\u0000${r.reason ?? ''}`;

export class SessionRunner {
  private readonly marked = new Set<string>();
  private started = false;
  private startedAt = 0;
  /** blocks opened (their content ledgered as shown), and blocks skipped for time */
  private readonly entered = new Set<Block>();
  private readonly skipped = new Set<Block>();
  /** nodes whose presentation has been shown */
  private readonly presented = new Set<NodeId>();
  /** learn items never presented (time ran out): owed to the next session */
  private readonly notPresented = new Set<NodeId>();
  /** reviews missed this session, in order (the "Before you go" block re-asks them) */
  private readonly lapses: Lapse[] = [];
  /** in-lesson retrievals each new node has had */
  private readonly learnSteps = new Map<NodeId, number>();
  finished = false;
  /** the learner stopped early: logged as a minimum session, the path did not move */
  stopped = false;
  /** hard cap on the session, minutes (default: the plan's budget) */
  capMinutes: number;
  /** what the first run of a scene scored, for the timed rerun's comparison */
  readonly scenes = new Map<string, SceneRun>();
  /** seconds the first read of a chapter took in this session */
  readonly reads = new Map<string, number>();
  /** log of what was scored (tests and the close screen's tally) */
  readonly tally = { scored: 0, correct: 0, firstTry: 0 };

  constructor(
    readonly learner: Learner, readonly bundle: Bundle, readonly ui: UiStore, readonly plan: SessionPlan,
    private readonly now: () => number = Date.now,
    opts: { capMinutes?: number } = {},
  ) {
    this.capMinutes = opts.capMinutes ?? plan.budget?.minutes ?? 20;
  }

  start(): number {
    if (this.started) return this.learner.sessionIndex;
    this.started = true;
    this.startedAt = this.now();
    return this.learner.startSession(this.now());
  }

  // ---------------------------------------------------------------- time

  /** Minutes since the session started. */
  elapsed(): number { return this.started ? Math.max(0, (this.now() - this.startedAt) / 60_000) : 0; }

  /** Past the session's minutes: no more new items, no optional extras, card runs end early. */
  overBudget(): boolean { return this.elapsed() >= this.capMinutes; }

  /** Planned minutes of the blocks after `block` that are not optional (they will run whatever the clock says). */
  reserveAfter(block: Block): number {
    const i = this.plan.blocks.indexOf(block);
    if (i < 0) return 0;
    return this.plan.blocks.slice(i + 1).filter((b) => b.kind !== 'close' && !softBlock(b) && !this.skipped.has(b))
      .reduce((a, b) => a + b.minutes, 0);
  }

  /**
   * Time to stop starting new things in `block`: what is left of the session
   * is needed by the blocks after it (a long learn block must not squeeze out
   * the day's teaching).
   */
  outOfTimeFor(block: Block): boolean { return this.elapsed() + this.reserveAfter(block) >= this.capMinutes; }

  /**
   * Honest minutes left: the estimates of the blocks still to come (the
   * current one counted from when it opened), never more than the cap allows.
   */
  minutesLeft(idx: number, blockOpenedAt?: number): number {
    let left = 0;
    this.plan.blocks.forEach((b, i) => {
      if (i < idx || b.kind === 'close' || this.skipped.has(b)) return;
      if (i === idx && blockOpenedAt !== undefined) left += Math.max(0.5, b.minutes - (this.now() - blockOpenedAt) / 60_000);
      else left += b.minutes;
    });
    return Math.max(0, Math.min(left, this.capMinutes - this.elapsed() + 2));
  }

  // ---------------------------------------------------------------- ledger

  /** Record a block's content in the exposure ledger (once). Called when the block is shown. */
  blockShown(block: Block): void {
    this.entered.add(block);
    for (const r of servedRefs({ ...this.plan, blocks: [block] })) this.mark(r);
  }

  /** A block whose cards may be cut short is open: its content is ledgered card by card (`itemShown`). */
  enter(block: Block): void { this.entered.add(block); }

  /** One card of an open block was shown: ledger just that item's content. */
  itemShown(block: Block, i: number): void {
    if (!('items' in block)) return;
    const one = { ...block, items: [block.items[i]] } as Block;
    for (const r of servedRefs({ ...this.plan, blocks: [one] })) this.mark(r);
  }

  /** A block skipped for time: nothing of it is ledgered. */
  skip(block: Block): void { this.skipped.add(block); }

  /** New items the learn block never got to: they are owed, not introduced. */
  notTaught(nodes: Iterable<NodeId>): void { for (const n of nodes) if (!this.presented.has(n)) this.notPresented.add(n); }

  private mark(r: ServedRef) {
    const k = refKey(r);
    if (this.marked.has(k)) return;
    this.marked.add(k);
    this.learner.ledger.markSeen(r.kind, r.id, {
      deliberate: r.deliberate, at: this.now(),
      ...(r.review ? { review: true } : {}), ...(r.reason ? { reason: r.reason } : {}),
    });
  }

  // ---------------------------------------------------------------- learner model

  /**
   * Make sure a node being taught has a record (and its in-lesson learning
   * state). Receptive-only nodes (plan.receptiveOnly, or a learn item's
   * `productive: false`) never get a production card.
   */
  present(node: NodeId, productive?: boolean): void {
    this.presented.add(node);
    this.notPresented.delete(node);
    if (this.learner.isIntroduced(node)) return;
    const p = productive ?? !(this.plan.receptiveOnly ?? []).includes(node);
    this.learner.introduce(node, { at: this.now(), productive: p });
  }

  /** One in-lesson retrieval. Returns true when the learner model says to stop asking. */
  learningStep(node: NodeId, o: Outcome, credit: NodeId[] = [node], productive?: boolean, op = 'learn'): boolean {
    this.present(node, productive);
    this.learnSteps.set(node, (this.learnSteps.get(node) ?? 0) + 1);
    if (!this.learner.isLearning(node)) {
      this.learner.expose(credit, { at: this.now(), event: { op, grade: gradeOf(o), tries: tries12(o.tries), ms: o.ms } });
      return true;
    }
    const st = this.learner.learningStep(node, o.correct, { at: this.now(), ms: o.ms, op, tries: tries12(o.tries) });
    if (st.done) this.learner.completeIntroduction(node, { at: this.now() });
    return st.done;
  }

  /** Output ladder: every choose/type/transform item moves its node's rung, whatever its scoring. */
  private stepLadder(item: Item, o: Outcome): void {
    if (item.op !== 'choose' && item.op !== 'type' && item.op !== 'transform' && item.op !== 'recombine') return;
    this.learner.stepRung(item.node, !o.correct ? 'miss' : o.tries <= 1 ? 'pass' : 'retry');
  }

  /** Credit one item exactly per its `scoring`. */
  score(item: Item, o: Outcome): void {
    this.noteLapse(item, o);
    this.tally.scored++;
    if (o.correct) this.tally.correct++;
    if (o.correct && o.tries <= 1) this.tally.firstTry++;
    this.stepLadder(item, o);
    const at = this.now();
    switch (item.scoring) {
      case 'review': {
        const dir: Direction = 'direction' in item ? item.direction : 'receptive';
        // a review item may target several due nodes in one sentence; the learner answered once
        const targets = (item.op === 'review' ? reviewTargets(item) : [item.node]).filter((t) => this.learner.hasCard(t, dir));
        const grade = gradeOf(o);
        const sentence = 'sentence' in item ? item.sentence : undefined;
        const op = eventOp(item);
        const tries = tries12(o.tries);
        if (!targets.length) {
          this.learner.expose(item.credit, { at, event: { op, direction: dir, grade, tries, ms: o.ms, sentence, novel: item.op === 'review' ? item.novel : undefined } });
          return;
        }
        if (sentence) {
          const novel = item.op === 'review' ? item.novel : true; // a recombine item is novel by construction
          const { grades, expose } = attributeGrades(targets, o.correct, grade, o.evidence, (id) => this.bundle.node(id));
          this.learner.creditSentence(item.credit, dir, grade, { targets: Object.keys(grades), grades, novel, at, ms: o.ms, op, tries, sentence });
          if (expose.length) this.learner.expose(expose, { at });
        } else {
          const { grades, expose } = attributeGrades(targets, o.correct, grade, o.evidence, (id) => this.bundle.node(id));
          Object.keys(grades).forEach((t, i) => this.learner.review(t, dir, grades[t], { at, ms: i === 0 ? o.ms : undefined, op, tries }));
          if (expose.length) this.learner.expose(expose, { at });
        }
        return;
      }
      case 'learning':
        this.learningStep(item.node, o, item.credit, item.op === 'learn' ? item.productive : undefined, eventOp(item));
        return;
      case 'exposure':
        this.learner.expose(item.credit, {
          at, event: {
            op: eventOp(item), direction: 'direction' in item ? item.direction : 'receptive', grade: gradeOf(o), tries: tries12(o.tries), ms: o.ms,
            sentence: 'sentence' in item ? item.sentence : undefined,
          },
        });
        return;
      case 'none':
        return;
    }
  }

  /** Remember a scored review that was missed: it comes back in "Before you go". */
  private noteLapse(item: Item, o: Outcome): void {
    if (o.correct || item.scoring !== 'review' || item.op !== 'review') return;
    const direction = item.direction;
    for (const node of reviewTargets(item)) this.lapses.push({ node, direction, sentence: item.sentence });
  }

  // ---------------------------------------------------------------- "Before you go"

  /**
   * Fill the recap from this session's outcomes: lapses first, then the new
   * items presented. Returns false (and skips the block) when there is nothing
   * to ask. Call when the block is reached, before it is shown.
   */
  openRecap(block: RecapBlock): boolean {
    const newItems = this.plan.blocks.flatMap((b) => (b.kind === 'learn' ? b.items : []))
      .filter((it: LearnItem) => this.presented.has(it.node));
    // The recap fills what is left of the session, measured at this learner's
    // real pace, never the compile-time guess: a long learn block must not
    // push the close past the cap.
    const secondsPerCard = Math.max(SECONDS.recap, this.learner.secondsPerReview());
    const left = Math.max(0, this.capMinutes - this.elapsed());
    const capacity = Math.min(block.capacity, Math.floor((left * 60) / secondsPerCard));
    block.items = capacity > 0 ? planRecap({
      learner: this.learner, bundle: this.bundle, capacity, lapses: this.lapses, newItems, steps: this.learnSteps,
    }) : [];
    block.minutes = Math.round((block.items.length * secondsPerCard) / 6) / 10;
    if (!block.items.length) { this.skip(block); return false; }
    return true;
  }

  /**
   * One recap answer. A lapsed card is graded for real (its in-session
   * relearning step, op 'recap'); a new item was already rated at the end of
   * its introduction, so it is exposure with an event, never a second review.
   */
  scoreRecap(item: RecapItem, o: Outcome): void {
    this.tally.scored++;
    if (o.correct) this.tally.correct++;
    if (o.correct && o.tries <= 1) this.tally.firstTry++;
    const at = this.now();
    const grade = gradeOf(o);
    const tries = tries12(o.tries);
    if (item.kind === 'new') {
      this.learner.expose(item.credit, { at, event: { op: 'recap', direction: item.direction, grade, tries, ms: o.ms } });
      return;
    }
    if (!this.learner.hasCard(item.node, item.direction)) return;
    if (item.sentence) {
      this.learner.creditSentence(item.credit, item.direction, grade, {
        targets: [item.node], grades: { [item.node]: grade }, novel: !item.reused, at, ms: o.ms, op: 'recap', tries, sentence: item.sentence,
      });
    } else {
      this.learner.review(item.node, item.direction, grade, { at, ms: o.ms, op: 'recap', tries });
    }
  }

  /** Reading, scenes, writing: implicit exposure, never a scored review. */
  expose(nodes: Iterable<NodeId>): void { this.learner.expose(nodes, { at: this.now() }); }

  async addWords(read: number, written: number): Promise<void> {
    if (!read && !written) return;
    await this.ui.update((s) => { s.stats.wordsRead += read; s.stats.wordsWritten += written; });
  }

  // ---------------------------------------------------------------- end

  /**
   * The core is done: record everything shown, hand any still-learning new
   * node to the scheduler, advance and persist the path. New items the time
   * cap kept from being presented are owed, never introduced. Idempotent.
   */
  async finish(): Promise<PathState> {
    if (this.finished) return this.ui.path;
    this.start();
    for (const b of this.plan.blocks) if (!this.entered.has(b) && !this.skipped.has(b)) this.blockShown(b);
    for (const n of Object.values(this.plan.newNodes).flat()) {
      if (this.notPresented.has(n)) continue;
      this.present(n);
      if (this.learner.isLearning(n)) this.learner.completeIntroduction(n, { at: this.now() });
    }
    const path = carryOwed(advancePath(this.ui.path, this.plan, true), [...this.notPresented]);
    this.finished = true;
    await this.ui.commitSession(this.learner, path, this.learner.day(this.now()));
    return path;
  }

  /**
   * "I need to stop", before the core is done: what was shown stays in the
   * ledger, every item presented is handed to the scheduler, the session is
   * logged as a minimum session (the path does not advance) and the day
   * still counts for the streak.
   */
  async stop(): Promise<PathState> {
    if (this.finished) return this.ui.path;
    this.start();
    const taught = Object.values(this.plan.newNodes).flat().filter((n) => this.presented.has(n));
    for (const n of taught) if (this.learner.isLearning(n)) this.learner.completeIntroduction(n, { at: this.now() });
    const g = this.plan.newNodes.grammar.find((n) => this.presented.has(n));
    const path = stoppedPath(this.ui.path, this.plan, g);
    this.finished = true;
    this.stopped = true;
    await this.ui.commitSession(this.learner, path, this.learner.day(this.now()));
    return path;
  }

  /** Leaving early: what was shown stays in the ledger; the path does not move. */
  async abandon(): Promise<void> {
    await this.learner.flush();
  }
}
