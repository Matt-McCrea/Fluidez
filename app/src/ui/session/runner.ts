// The session runner: the one place the UI touches the learner model. It
// follows the compiler's lifecycle exactly (see compiler/types.ts):
//   compile → learner.startSession() → run blocks, marking each block's
//   servedRefs in the ledger when the block is shown → score items per their
//   `scoring` → on finishing the core: advancePath, persist the path.
// An abandoned session leaves the path where it was.
import {
  advancePath, canDoAnother, compileSession, reviewTargets, servedRefs,
  type Block, type Item, type Mode, type PathState, type ServedRef, type SessionPlan,
} from '../../compiler';
import type { NodeId } from '../../content/schema';
import { Rating, type Direction, type Grade, type Learner, type Tier } from '../../learner';
import type { Bundle } from '../data/bundle';
import type { UiStore } from '../store/ui';

export interface Outcome {
  correct: boolean;
  /** attempts used (1 = first try) */
  tries: number;
  /** measured time to answer, ms */
  ms: number;
}

/** First-try pass → Good; pass on the retry → Hard; shown the answer → Again. */
export function gradeOf(o: Pick<Outcome, 'correct' | 'tries'>): Grade {
  if (!o.correct) return Rating.Again;
  return o.tries <= 1 ? Rating.Good : Rating.Hard;
}

export interface SceneRun { firstTry: number; turns: number; seconds: number }

export function compilePlan(learner: Learner, bundle: Bundle, ui: UiStore, opts: { mode?: Mode; now?: number; tier?: Tier } = {}): SessionPlan {
  return compileSession({
    learnerId: ui.state.learnerId, learner, path: ui.path, course: bundle.course, content: bundle.index,
    now: opts.now ?? Date.now(), tier: opts.tier, mode: opts.mode ?? 'next',
  });
}

export function anotherAllowed(learner: Learner, bundle: Bundle, ui: UiStore, now = Date.now()): boolean {
  return canDoAnother({ learner, path: ui.path, course: bundle.course, content: bundle.index, learnerId: ui.state.learnerId, now });
}

const refKey = (r: ServedRef) => `${r.kind}\u0000${r.id}\u0000${r.deliberate ? 1 : 0}\u0000${r.reason ?? ''}`;

export class SessionRunner {
  private readonly marked = new Set<string>();
  private started = false;
  finished = false;
  /** what the first run of a scene scored, for the timed rerun's comparison */
  readonly scenes = new Map<string, SceneRun>();
  /** seconds the first read of a chapter took in this session */
  readonly reads = new Map<string, number>();
  /** log of what was scored (tests and the close screen's tally) */
  readonly tally = { scored: 0, correct: 0, firstTry: 0 };

  constructor(
    readonly learner: Learner, readonly bundle: Bundle, readonly ui: UiStore, readonly plan: SessionPlan,
    private readonly now: () => number = Date.now,
  ) {}

  start(): number {
    if (this.started) return this.learner.sessionIndex;
    this.started = true;
    return this.learner.startSession(this.now());
  }

  // ---------------------------------------------------------------- ledger

  /** Record a block's content in the exposure ledger (once). Called when the block is shown. */
  blockShown(block: Block): void {
    for (const r of servedRefs({ ...this.plan, blocks: [block] })) this.mark(r);
  }

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
    if (this.learner.isIntroduced(node)) return;
    const p = productive ?? !(this.plan.receptiveOnly ?? []).includes(node);
    this.learner.introduce(node, { at: this.now(), productive: p });
  }

  /** One in-lesson retrieval. Returns true when the learner model says to stop asking. */
  learningStep(node: NodeId, o: Outcome, credit: NodeId[] = [node], productive?: boolean): boolean {
    this.present(node, productive);
    if (!this.learner.isLearning(node)) { this.learner.expose(credit, { at: this.now() }); return true; }
    const st = this.learner.learningStep(node, o.correct, { at: this.now(), ms: o.ms });
    if (st.done) this.learner.completeIntroduction(node, { at: this.now() });
    return st.done;
  }

  /** Credit one item exactly per its `scoring`. */
  score(item: Item, o: Outcome): void {
    this.tally.scored++;
    if (o.correct) this.tally.correct++;
    if (o.correct && o.tries <= 1) this.tally.firstTry++;
    const at = this.now();
    switch (item.scoring) {
      case 'review': {
        const dir: Direction = 'direction' in item ? item.direction : 'receptive';
        // a review item may target several due nodes in one sentence; the learner answered once
        const targets = (item.op === 'review' ? reviewTargets(item) : [item.node]).filter((t) => this.learner.hasCard(t, dir));
        if (!targets.length) { this.learner.expose(item.credit, { at }); return; }
        const grade = gradeOf(o);
        const sentence = 'sentence' in item ? item.sentence : undefined;
        if (sentence) {
          const novel = item.op === 'review' ? item.novel : true;
          const grades = Object.fromEntries(targets.map((t) => [t, grade]));
          this.learner.creditSentence(item.credit, dir, grade, { targets, grades, novel, at, ms: o.ms });
        } else {
          targets.forEach((t, i) => this.learner.review(t, dir, grade, { at, ms: i === 0 ? o.ms : undefined }));
        }
        return;
      }
      case 'learning':
        this.learningStep(item.node, o, item.credit, item.op === 'learn' ? item.productive : undefined);
        return;
      case 'exposure':
        this.learner.expose(item.credit, { at });
        return;
      case 'none':
        return;
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
   * node to the scheduler, advance and persist the path. Idempotent.
   */
  async finish(): Promise<PathState> {
    if (this.finished) return this.ui.path;
    this.start();
    for (const b of this.plan.blocks) this.blockShown(b);
    for (const n of Object.values(this.plan.newNodes).flat()) {
      this.present(n);
      if (this.learner.isLearning(n)) this.learner.completeIntroduction(n, { at: this.now() });
    }
    const path = advancePath(this.ui.path, this.plan, true);
    this.finished = true;
    await this.ui.setPath(path);
    await this.ui.sessionFinished(this.learner.day(this.now()));
    await this.learner.flush();
    return path;
  }

  /** Leaving early: what was shown stays in the ledger; the path does not move. */
  async abandon(): Promise<void> {
    await this.learner.flush();
  }
}
