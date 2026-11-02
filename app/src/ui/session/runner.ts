// The session runner: the one place the UI touches the learner model. It
// follows the compiler's lifecycle exactly (see compiler/types.ts):
//   compile → learner.startSession() → run blocks, marking each block's
//   servedRefs in the ledger when the block is shown → score items per their
//   `scoring` → on finishing the core: advancePath, persist the path.
// An abandoned session leaves the path where it was.
import {
  advancePath, canDoAnother, carryOwed, compileSession, reviewTargets, servedRefs, stoppedPath, withMiss,
  type Block, type Item, type LearnItem, type Mode, type PathState, type RecapBlock, type RecapItem, type ServedRef, type SessionPlan,
} from '../../compiler';
import type { NodeId } from '../../content/schema';
import type { Direction, ExposureEvent, Learner, Tier } from '../../learner';
import type { Bundle } from '../data/bundle';
import { isResumable, type SavedSession, type UiStore } from '../store/ui';
import { planRecap, type Lapse } from './recap';
import { SECONDS } from '../../compiler/budget';
import { attributeGrades } from './attribute';
import { climb, claimOf, eventOp, gradeOf, lessonStep, logAnswer, missRetest, reviewNode, reviewSentence, seen, seenAbout, slipOf, tries12, type Answered, type Outcome, type Retest } from './attempt';
import { progressNumbers } from './numbers';
import { LearnQueue } from './order';

// An outcome and its grade are the seam's (attempt.ts); the runner is where everyone already imports them from.
export { gradeOf, type Outcome };

export interface SceneRun { firstTry: number; turns: number; seconds: number }

/** The runner's memory of a half-run session, as plain JSON (blocks are named by their index in plan.blocks). */
export interface RunnerSnapshot {
  entered: number[];
  skipped: number[];
  presented: NodeId[];
  notPresented: NodeId[];
  lapses: Lapse[];
  /** practice items missed this session (absent in a session saved before they were kept) */
  retests?: Retest[];
  learnSteps: [NodeId, number][];
  learnMisses: NodeId[];
  typedOk: [NodeId, number][];
  cardsDone: [number, number][];
  tally: { scored: number; correct: number; firstTry: number };
  scenes: [string, SceneRun][];
  reads: [string, number][];
  marked: string[];
  misses?: { node: NodeId; sentence?: string; op: string }[];
  startedAt: number;
}

let fullLessonOnce = false;
/** "Do the full lesson instead": the next session is the standard one, whatever the standing preference. Not a settings change. */
export function requestFullLesson(): void { fullLessonOnce = true; }

/**
 * The tier is the learner's standing preference (Settings), unless `opts.tier`
 * or a pending "full lesson instead" says otherwise for this one session. The
 * minutes come from the compiler's budget for the band and tier.
 */
export function compilePlan(learner: Learner, bundle: Bundle, ui: UiStore, opts: { mode?: Mode; now?: number; tier?: Tier; capMinutes?: number } = {}): SessionPlan {
  const now = opts.now ?? Date.now();
  // a lesson nobody can pick up again is over: what it had begun goes to the scheduler before the next one is planned
  if (!isResumable(ui.session, learner, now, ui.state.learnerId)) sweepIntroductions(learner, now);
  return compileSession({
    learnerId: ui.state.learnerId, learner, path: ui.path, course: bundle.course, content: bundle.index,
    now, tier: opts.tier ?? (fullLessonOnce ? 'standard' : learner.settings.tier), mode: opts.mode ?? 'next',
    ...(ui.state.placedAt ? { placedAt: ui.state.placedAt } : {}),
    ...(opts.capMinutes ? { capMinutes: opts.capMinutes } : {}),
  });
}

/**
 * Hand every node still in its lesson to the scheduler, rated from the steps
 * it had. A node is only in its lesson between its first answer and its last,
 * so after a lesson left behind this is the half that was practised; the half
 * that was only shown never got a record (see `SessionRunner.present`).
 * Returns the nodes it handed over.
 */
export function sweepIntroductions(learner: Learner, at: number): NodeId[] {
  const open = learner.nodes().filter((id) => learner.isLearning(id));
  for (const id of open) learner.completeIntroduction(id, { at });
  return open;
}

/** Blocks that can go when time is up: nothing here moves the course on. */
export function softBlock(b: Block): boolean {
  return b.kind === 'personal' || b.kind === 'extraReading' || b.kind === 'leech' || b.kind === 'sceneRerun'
    || b.kind === 'recap' || (b.kind === 'reread' && (b.purpose === 'fluency' || b.purpose === 'minimum'));
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
  return canDoAnother({ learner, path: ui.path, course: bundle.course, content: bundle.index, learnerId: ui.state.learnerId, now, tier: learner.settings.tier, ...(ui.state.placedAt ? { placedAt: ui.state.placedAt } : {}) });
}

const refKey = (r: ServedRef) => `${r.kind}\u0000${r.id}\u0000${r.deliberate ? 1 : 0}\u0000${r.reason ?? ''}`;

/** Planned minutes still to come in a saved session: the open block and those after it, minus the ones skipped. */
export function savedMinutesLeft(saved: SavedSession): number {
  const skipped = new Set(saved.runner.skipped);
  return saved.plan.blocks.reduce((a, b, i) => (i < saved.block || b.kind === 'close' || skipped.has(i) ? a : a + b.minutes), 0);
}

export class SessionRunner {
  private readonly marked = new Set<string>();
  private started = false;
  private startedAt = 0;
  /** blocks opened (their content ledgered as shown), and blocks skipped for time */
  private readonly entered = new Set<Block>();
  private readonly skipped = new Set<Block>();
  /** nodes whose presentation has been shown */
  private readonly presented = new Set<NodeId>();
  /** the production flag a node was presented with, for when its record is made */
  private readonly productive = new Map<NodeId, boolean>();
  /** learn items never presented (time ran out): owed to the next session */
  private readonly notPresented = new Set<NodeId>();
  /** reviews missed this session, in order (the "Before you go" block re-asks them) */
  private readonly lapses: Lapse[] = [];
  /** practice items missed this session, in order: their targets come back in "Before you go" and at the start of the next session (F7) */
  readonly retests: Retest[] = [];
  /** in-lesson retrievals each new node has had */
  private readonly learnSteps = new Map<NodeId, number>();
  private readonly learnMisses = new Set<NodeId>();
  private readonly typedOk = new Map<NodeId, number>();
  /** the block on screen, and the cards answered or presented in each block (for the progress bar) */
  private current: Block | undefined;
  private readonly cardsDone = new Map<Block, number>();
  private inScore = false;
  private readonly listeners = new Set<() => void>();
  finished = false;
  /** the learner stopped early: logged as a minimum session, the path did not move */
  stopped = false;
  /** hard cap on the session, minutes (default: the plan's budget) */
  capMinutes: number;
  /** "Only five minutes?": the day is kept for the streak but the full lesson is still offered */
  readonly quick: boolean;
  /** what the first run of a scene scored, for the timed rerun's comparison */
  readonly scenes = new Map<string, SceneRun>();
  /** seconds the first read of a chapter took in this session */
  readonly reads = new Map<string, number>();
  /** log of what was scored (tests and the close screen's tally) */
  readonly tally = { scored: 0, correct: 0, firstTry: 0 };
  /** what went wrong today, one row per node, for the close screen */
  readonly misses: { node: NodeId; sentence?: string; op: string }[] = [];

  constructor(
    readonly learner: Learner, readonly bundle: Bundle, readonly ui: UiStore, readonly plan: SessionPlan,
    private readonly now: () => number = Date.now,
    opts: { capMinutes?: number; quick?: boolean } = {},
  ) {
    fullLessonOnce = false;
    this.quick = !!opts.quick;
    this.capMinutes = opts.capMinutes ?? plan.budget?.minutes ?? 20;
  }

  /** Where the open block is, reported by the block (card index, teach phase, learn queue) so a reload can come back to it. */
  cursor: SavedSession['cursor'] = {};

  setCursor(c: SavedSession['cursor']): void {
    this.cursor = c;
    this.listeners.forEach((f) => f());
  }

  /** Everything the runner holds that a reload would lose. */
  snapshot(): RunnerSnapshot {
    const idx = (b: Block) => this.plan.blocks.indexOf(b);
    const blocks = (set: Iterable<Block>) => [...set].map(idx).filter((i) => i >= 0);
    return structuredClone({
      entered: blocks(this.entered), skipped: blocks(this.skipped),
      presented: [...this.presented], notPresented: [...this.notPresented],
      lapses: this.lapses, retests: this.retests, learnSteps: [...this.learnSteps], learnMisses: [...this.learnMisses], typedOk: [...this.typedOk],
      cardsDone: [...this.cardsDone].map(([b, n]) => [idx(b), n] as [number, number]).filter(([i]) => i >= 0),
      tally: this.tally, misses: this.misses, scenes: [...this.scenes], reads: [...this.reads], marked: [...this.marked], startedAt: this.startedAt,
    });
  }

  /**
   * Pick a saved session up again: same plan, same ledger marks, the clock set
   * so the time already spent counts and the gap does not. Does not start a
   * learner session (the saved one is still the learner's current one).
   */
  static resume(learner: Learner, bundle: Bundle, ui: UiStore, saved: SavedSession, now: () => number = Date.now): SessionRunner {
    const run = new SessionRunner(learner, bundle, ui, saved.plan, now, { capMinutes: saved.capMinutes, quick: saved.plan.tier === 'minimum' && saved.capMinutes <= 5 });
    const s = saved.runner;
    const at = (i: number) => saved.plan.blocks[i];
    s.entered.forEach((i) => at(i) && run.entered.add(at(i)));
    s.skipped.forEach((i) => at(i) && run.skipped.add(at(i)));
    s.presented.forEach((n) => run.presented.add(n));
    s.notPresented.forEach((n) => run.notPresented.add(n));
    run.lapses.push(...s.lapses);
    run.retests.push(...(s.retests ?? []));
    s.learnSteps.forEach(([n, c]) => run.learnSteps.set(n, c));
    s.learnMisses.forEach((n) => run.learnMisses.add(n));
    s.typedOk.forEach(([n, c]) => run.typedOk.set(n, c));
    s.cardsDone.forEach(([i, c]) => at(i) && run.cardsDone.set(at(i), c));
    Object.assign(run.tally, s.tally);
    if (s.misses) run.misses.push(...s.misses);
    s.scenes.forEach(([k, v]) => run.scenes.set(k, v));
    s.reads.forEach(([k, v]) => run.reads.set(k, v));
    s.marked.forEach((k) => run.marked.add(k));
    run.cursor = structuredClone(saved.cursor);
    run.started = true;
    run.startedAt = now() - saved.elapsedMs;
    return run;
  }

  start(): number {
    if (this.started) return this.learner.sessionIndex;
    this.started = true;
    this.startedAt = this.now();
    return this.learner.startSession(this.now());
  }

  // ---------------------------------------------------------------- time

  /** A soft block that may be dropped for time: never the recap while something was missed. */
  skippable(b: Block): boolean { return softBlock(b) && !(b.kind === 'recap' && this.lapses.length > 0); }

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

  // ---------------------------------------------------------------- progress

  /** Called after every card step (the screen redraws its bar). Returns an unsubscribe. */
  onProgress(fn: () => void): () => void { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }

  private bump(): void {
    if (this.current) this.cardsDone.set(this.current, (this.cardsDone.get(this.current) ?? 0) + 1);
    this.listeners.forEach((f) => f());
  }

  /**
   * Where the session is, by card: `blocks` core blocks, those before the open
   * one (skipped ones included) done, and the cards of the open block. Card
   * runs count their items (learn: the planned presents and asks); other
   * blocks are one step. A finished session is full.
   */
  progress(): { blocks: number; blocksDone: number; cardsInBlock: number; cardsDoneInBlock: number } {
    const core: Block[] = this.plan.blocks.filter((b) => b.kind !== 'close');
    const blocks = core.length;
    if (this.finished) return { blocks, blocksDone: blocks, cardsInBlock: 1, cardsDoneInBlock: 0 };
    const cur = this.current;
    const at = cur ? core.indexOf(cur) : -1;
    if (!cur || at < 0) return { blocks, blocksDone: cur ? blocks : 0, cardsInBlock: 1, cardsDoneInBlock: 0 };
    let cardsInBlock = 1;
    if (cur.kind === 'learn') cardsInBlock = new LearnQueue(cur.items.length).steps.length;
    else if ('items' in cur && Array.isArray(cur.items)) cardsInBlock = cur.items.length;
    cardsInBlock = Math.max(1, cardsInBlock);
    return { blocks, blocksDone: at, cardsInBlock, cardsDoneInBlock: Math.min(cardsInBlock, this.cardsDone.get(cur) ?? 0) };
  }

  // ---------------------------------------------------------------- ledger

  /** Record a block's content in the exposure ledger (once). Called when the block is shown. */
  blockShown(block: Block): void {
    this.current = block;
    this.entered.add(block);
    // a chapter this tab does not hold has not been shown: ReadChapter records it when it arrives, and one that never does is still owed
    if ((block.kind === 'read' || block.kind === 'reread') && !this.bundle.chapters.has(block.chapter)) return;
    for (const r of servedRefs({ ...this.plan, blocks: [block] })) this.mark(r);
  }

  /** A block whose cards may be cut short is open: its content is ledgered card by card (`itemShown`). */
  enter(block: Block): void { this.current = block; this.entered.add(block); }

  /** One card of an open block was shown: ledger just that item's content, or `served`, the script item it asked instead (a re-serve, as a drill day's is). */
  itemShown(block: Block, i: number, served?: string): void {
    if (!('items' in block)) return;
    if (served) { this.mark({ kind: 'item', id: served, deliberate: true }); return; }
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
   * A node's presentation is on screen. Showing it creates no record: a lesson
   * the learner leaves before answering anything must come round again whole,
   * and a record with no card would make the compiler take it for known. The
   * record comes with the first answer (`begin`), or when the lesson closes.
   */
  present(node: NodeId, productive?: boolean): void {
    if (this.current?.kind === 'learn' && !this.presented.has(node)) { this.presented.add(node); this.bump(); }
    this.presented.add(node);
    this.notPresented.delete(node);
    if (productive !== undefined) this.productive.set(node, productive);
  }

  /**
   * Make sure a node being taught has a record (and its in-lesson learning
   * state). Receptive-only nodes (plan.receptiveOnly, or a learn item's
   * `productive: false`) never get a production card.
   */
  private begin(node: NodeId, productive?: boolean): void {
    if (this.learner.isIntroduced(node)) return;
    const p = productive ?? this.productive.get(node) ?? this.plan.blocks.flatMap((b) => (b.kind === 'learn' ? b.items : [])).find((it) => it.node === node)?.productive
      ?? !(this.plan.receptiveOnly ?? []).includes(node);
    this.learner.introduce(node, { at: this.now(), productive: p });
  }

  /** An answered sentence is graded for its target alone (see `seenAbout`). */
  private exposeAbout(target: NodeId, credit: readonly NodeId[], event: ExposureEvent, at = this.now()): void {
    seenAbout(this.learner, target, credit, event, at);
  }

  /** Log one answered card in the attempts log. Whoever takes an answer calls this once. */
  answered(about: Answered, o: Outcome): void { logAnswer(this.learner, this.now(), about, o); }

  /** One in-lesson retrieval. Returns true when the learner model says to stop asking. */
  learningStep(node: NodeId, o: Outcome, credit: NodeId[] = [node], productive?: boolean, op = 'learn', typed = false): boolean {
    this.answered({ node, op }, o);
    return this.step(node, o, credit, productive, op, typed);
  }

  private step(node: NodeId, o: Outcome, credit: NodeId[], productive: boolean | undefined, op: string, typed: boolean): boolean {
    const slip = slipOf(o);
    if (!this.inScore) this.bump();
    this.present(node, productive);
    if (o.exposure) return true; // shown, not asked: not a retrieval to count, nor one to ask again
    this.begin(node, productive);
    if (o.claimed) {
      // "mine says the same thing": the app could not tell, so it is not a retrieval that counts and not one that is skipped; the node is asked again
      this.learnMisses.add(node); this.noteMiss(node, op);
      this.exposeAbout(node, credit, { op, grade: gradeOf(o), tries: tries12(o.tries), ms: o.ms, ...slip, ...claimOf(o) });
      return false;
    }
    this.learnSteps.set(node, (this.learnSteps.get(node) ?? 0) + 1);
    if (!o.correct) { this.learnMisses.add(node); this.noteMiss(node, op); }
    else if (typed) this.typedOk.set(node, (this.typedOk.get(node) ?? 0) + 1);
    if (!this.learner.isLearning(node)) {
      this.exposeAbout(node, credit, { op, grade: gradeOf(o), tries: tries12(o.tries), ms: o.ms, ...slip });
      return true;
    }
    const st = lessonStep(this.learner, node, o.correct, { at: this.now(), ms: o.ms, op, tries: tries12(o.tries), ...slip });
    if (st.done) this.learner.completeIntroduction(node, { at: this.now() });
    return st.done;
  }

  /** Output ladder: every choose/type/transform item moves its node's rung, whatever its scoring. */
  private stepLadder(item: Item, o: Outcome): void {
    if (item.op !== 'choose' && item.op !== 'type' && item.op !== 'transform' && item.op !== 'recombine') return;
    climb(this.learner, item.node, o);
  }

  /** Credit one item exactly per its `scoring`. */
  score(item: Item, o: Outcome): void {
    this.bump();
    this.answered({ node: item.node, op: eventOp(item), sentence: 'sentence' in item ? item.sentence : undefined }, o);
    this.inScore = true;
    try { this.scoreItem(item, o); } finally { this.inScore = false; }
  }

  private noteMiss(node: NodeId, op: string, sentence?: string): void {
    if (this.misses.length >= 12 || this.misses.some((m) => m.node === node)) return;
    this.misses.push({ node, sentence, op });
  }

  private scoreItem(item: Item, o: Outcome): void {
    // a card that asked for no answer cannot grade one: where a grade was due, the card stays as it was
    if (o.exposure && (item.scoring === 'review' || item.scoring === 'learning')) { seen(this.learner, item.credit, this.now()); return; }
    this.noteLapse(item, o);
    this.noteRetest(item, o);
    if (!o.correct) {
      const sid = 'sentence' in item ? item.sentence : undefined;
      this.noteMiss(item.node, eventOp(item), sid ? this.bundle.sentence(sid)?.es : undefined);
    }
    if (!o.exposure) {
      this.tally.scored++;
      // a claim is neither right nor right first time: the app could not tell (R9)
      if (o.correct && !o.claimed) this.tally.correct++;
      if (o.correct && !o.claimed && o.tries <= 1) this.tally.firstTry++;
    }
    if (item.scoring === 'learning') this.begin(item.node, item.op === 'learn' ? item.productive : undefined);
    this.stepLadder(item, o);
    const at = this.now();
    const slip = slipOf(o);
    const claim = claimOf(o);
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
          this.exposeAbout(item.node, item.credit, { op, direction: dir, grade, tries, ms: o.ms, sentence, novel: item.op === 'review' ? item.novel : undefined, ...slip, ...claim }, at);
          return;
        }
        if (sentence) {
          const novel = item.op === 'review' ? item.novel : true; // a recombine item is novel by construction
          const { grades, expose } = attributeGrades(targets, o.correct, grade, o.evidence, (id) => this.bundle.node(id));
          reviewSentence(this.learner, item.credit, dir, grade, { targets: Object.keys(grades), grades, novel, at, ms: o.ms, op, tries, sentence, ...slip, ...claim });
          if (expose.length) seen(this.learner, expose, at);
        } else {
          const { grades, expose } = attributeGrades(targets, o.correct, grade, o.evidence, (id) => this.bundle.node(id));
          Object.keys(grades).forEach((t, i) => reviewNode(this.learner, t, dir, grades[t], { at, ms: i === 0 ? o.ms : undefined, op, tries, ...claim, ...(i === 0 ? slip : {}) }));
          if (expose.length) seen(this.learner, expose, at);
        }
        return;
      }
      case 'learning':
        this.step(item.node, o, item.credit, item.op === 'learn' ? item.productive : undefined, eventOp(item), false);
        return;
      case 'exposure':
        this.exposeAbout(item.node, item.credit, {
          op: eventOp(item), direction: 'direction' in item ? item.direction : 'receptive', grade: gradeOf(o), tries: tries12(o.tries), ms: o.ms,
          sentence: 'sentence' in item ? item.sentence : undefined, ...slip, ...claim,
        }, at);
        return;
      case 'none':
        return;
    }
  }

  /**
   * Remember a practice item that was missed (attempt.ts missRetest): its target comes back in "Before you go" in another sentence,
   * and goes on the remediation list, so the next session opens with a short run over it. The list holds the six most recent (compiler/remediate.ts).
   */
  private noteRetest(item: Item, o: Outcome): void {
    const r = missRetest(item as Parameters<typeof missRetest>[0], o);
    if (!r) return;
    if (!this.retests.some((x) => x.node === r.node)) this.retests.push(r);
    void this.ui.setPath({ ...this.ui.path, remediate: withMiss(this.ui.path.remediate ?? [], r.node, this.now()) });
  }

  /** Remember a scored review that was missed: it comes back in "Before you go". */
  private noteLapse(item: Item, o: Outcome): void {
    if (o.correct || item.scoring !== 'review' || item.op !== 'review') return;
    const direction = item.direction;
    for (const node of reviewTargets(item)) this.lapses.push({ node, direction, sentence: item.sentence, ...(item.contrast ? { contrast: item.contrast } : {}) });
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
    // over budget, a short recap of what was missed still beats none: those misses are tomorrow's lapses otherwise
    const capacity = Math.max(Math.min(block.capacity, Math.floor((left * 60) / secondsPerCard)), Math.min(3, this.lapses.length + this.retests.length));
    block.items = capacity > 0 ? planRecap({
      learner: this.learner, bundle: this.bundle, capacity, lapses: this.lapses, retests: this.retests, newItems, steps: this.learnSteps,
      misses: this.learnMisses, typedOk: this.typedOk,
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
    this.bump();
    this.answered({ node: item.node, op: 'recap', sentence: item.sentence }, o);
    if (o.exposure) { seen(this.learner, item.credit, this.now()); return; }
    this.tally.scored++;
    if (o.correct && !o.claimed) this.tally.correct++;
    if (o.correct && !o.claimed && o.tries <= 1) this.tally.firstTry++;
    const at = this.now();
    const grade = gradeOf(o);
    const tries = tries12(o.tries);
    const slip = slipOf(o);
    const claim = claimOf(o);
    if (item.kind === 'new' || item.kind === 'miss') {
      this.exposeAbout(item.node, item.credit, { op: 'recap', direction: item.direction, grade, tries, ms: o.ms, ...(item.sentence ? { sentence: item.sentence } : {}), ...slip, ...claim }, at);
      return;
    }
    if (!this.learner.hasCard(item.node, item.direction)) return;
    if (item.sentence) {
      reviewSentence(this.learner, item.credit, item.direction, grade, {
        targets: [item.node], grades: { [item.node]: grade }, novel: !item.reused, at, ms: o.ms, op: 'recap', tries, sentence: item.sentence, ...slip, ...claim,
      });
    } else {
      reviewNode(this.learner, item.node, item.direction, grade, { at, ms: o.ms, op: 'recap', tries, ...slip, ...claim });
    }
  }

  /** Reading, scenes, writing: implicit exposure, never a scored review. */
  expose(nodes: Iterable<NodeId>): void { seen(this.learner, nodes, this.now()); }

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
      this.begin(n);
      if (this.learner.isLearning(n)) this.learner.completeIntroduction(n, { at: this.now() });
    }
    const path = carryOwed(advancePath(this.ui.path, this.plan, true), [...this.notPresented]);
    await this.commitClose(path);
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
    // a contrast has no drill to come back to it: one left before a single answer was given was not taught, and its lesson comes round again whole
    const taught = Object.values(this.plan.newNodes).flat().filter((n) => this.presented.has(n) && (!this.plan.newNodes.contrasts.includes(n) || this.learnSteps.has(n)));
    for (const n of taught) {
      this.begin(n);
      if (this.learner.isLearning(n)) this.learner.completeIntroduction(n, { at: this.now() });
    }
    const g = this.plan.newNodes.grammar.find((n) => this.presented.has(n));
    const path = stoppedPath(this.ui.path, this.plan, g);
    await this.commitClose(path, true);
    return path;
  }

  /**
   * Save the close and only then call the session finished. When the write is
   * refused `commitSession` puts the UI documents back and rejects: the resume
   * point stays, and trying again counts the session once.
   */
  private async commitClose(path: PathState, stopped = false): Promise<void> {
    await this.ui.commitSession(this.learner, path, this.learner.day(this.now()), this.quick ? { quick: true } : undefined);
    this.finished = true;
    this.stopped = stopped;
    await this.ui.clearSession();
    this.keepMonth();
  }

  /**
   * Keep this month's numbers, as Progress would show them now: the last session of a month leaves that
   * month's. Capture must never cost a close, so whatever goes wrong here is reported and left behind.
   */
  private keepMonth(): void {
    try {
      const at = this.now();
      void this.ui.keep.snapshotMonth(this.learner.day(at).slice(0, 7), at, progressNumbers({ learner: this.learner, ui: this.ui, bundle: this.bundle, now: at }));
    } catch (e) { console.warn('fluidez: could not work out the month\'s numbers', e); }
  }

  /**
   * Leaving early: what was shown stays in the ledger; the path does not move.
   * `keepSaved` leaves the resume point for the next Start. Without it nothing
   * can resume, so what the lesson had begun goes to the scheduler now; with it,
   * the next plan does that once the resume window has gone (`compilePlan`).
   */
  async abandon(opts: { keepSaved?: boolean } = {}): Promise<void> {
    if (!opts.keepSaved) {
      await this.ui.clearSession();
      sweepIntroductions(this.learner, this.now());
    }
    await this.learner.flush();
  }
}
