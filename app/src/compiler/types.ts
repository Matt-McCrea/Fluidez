// The session compiler's contract. `compileSession(input)` turns one learner's
// state + the course + the content index into a SessionPlan: an ordered list
// of blocks, each naming the concrete content it serves (sentence ids, chapter
// id, scene id, writing-task id, script parts). The UI renders a plan block by
// block; the simulator runs the same plan against a synthetic learner.
//
// Lifecycle (UI and simulator do exactly this):
//   1. plan = compileSession({ learnerId, learner, path, course, content, now, tier, mode })
//   2. learner.startSession()                       // the plan was compiled for sessionIndex + 1
//   3. run each block; for every ref in servedRefs(plan) the UI actually showed,
//      learner.ledger.markSeen(ref.kind, ref.id, { deliberate: ref.deliberate })
//   4. score items per their `scoring` (see Scoring)
//   5. when the core is finished: path = advancePath(path, plan, true)  (persist it)
//      an abandoned session leaves the path unchanged.
//
// Everything here is plain JSON (no Dates, no class instances, no Sets) so a
// plan or a path can be logged, stored and diffed.
import type { Band, GraphNode, LessonType, NodeId, Unit } from '../content/schema';
import type { CardJSON, Direction, DueCard, LedgerKind, LedgerView, NodeRecord, Settings, Tier } from '../learner';

// ------------------------------------------------------------------ inputs

/**
 * The read-only slice of `Learner` the compiler uses. A `Learner` instance
 * satisfies it structurally; the compiler never mutates it.
 */
export interface LearnerView {
  readonly settings: Readonly<Settings>;
  readonly sessionIndex: number;
  readonly ledger: {
    hasSeen(kind: LedgerKind, id: string): boolean;
    firstSeen(kind: LedgerKind, id: string): Date | undefined;
    lastSeen(kind: LedgerKind, id: string): Date | undefined;
    views(kind: LedgerKind, id: string): readonly LedgerView[];
    seenBetween(kind: LedgerKind, from: number, to: number): string[];
    reviewReusable(id: string, at: number, minDays: number): boolean;
  };
  nodes(): NodeId[];
  /** Introduced nodes that are retained or fresh (absent in minimal views = every known node). */
  stableNodes?(threshold?: number, at?: number): Set<NodeId>;
  node(id: NodeId): NodeRecord | undefined;
  isIntroduced(id: NodeId): boolean;
  hasCard(id: NodeId, direction: Direction): boolean;
  card(id: NodeId, direction: Direction): CardJSON | undefined;
  due(at?: number, direction?: Direction): DueCard[];
  secondsPerReview(direction?: Direction): number;
  /** Output ladder position (absent in minimal views = 0). */
  rung?(id: NodeId): 0 | 1 | 2 | 3;
  rungStreak?(id: NodeId): number;
}

/** The course: units in order (each owns its days) and the skill graph. Build with `buildCourse`. */
export interface Course {
  units: Unit[];
  nodes: Map<NodeId, GraphNode>;
  unitIndex: Map<string, number>;
  /** global day position of each unit's first day (positions count days across the whole course) */
  unitStart: number[];
  /**
   * Where each node is TAUGHT: grammar at the first introduce day that lists
   * it (a grammar node in an output/review focus before then is only
   * previewed), everything else at its first listing.
   */
  teachPos: Map<NodeId, number>;
  /**
   * Lexemes and chunks on no unit day, mapped to the session from which a
   * sentence may use them (max(1, priority)), the same rule the gate applies.
   * They get no cards and are never new items. The Reference tab and weak spots
   * (learner.nodes()) do not list them.
   */
  implicit: Map<NodeId, number>;
  /** Grammar, pattern and contrast nodes on no unit day: never known, reported here. */
  untaught: NodeId[];
}

/** A bank sentence as the compiler sees it. `requires` already includes `targets`. */
export interface SentenceRef {
  id: string;
  requires: NodeId[];
  targets: NodeId[];
  unit?: string;
  question: boolean;
}

/**
 * Chapters, scenes and tasks are gated like sentences. When the content file
 * carries no tagger `requires`, the index uses the POSITION GATE: every node
 * taught by the owning unit up to (and including) the day that lists the item,
 * plus the previous units' nodes are implied by being introduced earlier.
 */
/** `day`: index of the unit day that lists the chapter (undefined = unlisted: read on the unit's first input day with room). */
export interface ChapterRef { id: string; unit: string; order: number; day?: number; requires: NodeId[]; questions: number; minutes: number }
export interface SceneRef { id: string; unit: string; requires: NodeId[]; focus: NodeId[]; turns: number; minutes: number }
export interface TaskRef { id: string; unit: string; requires: NodeId[]; focus?: NodeId; minutes: number }
export interface ScriptRef { node: NodeId; readAndPick: number; yourTurn: number }

/** Lookup structure over all content. Build once with `buildContentIndex`; never mutated. */
export interface ContentIndex {
  sentences: Map<string, SentenceRef>;
  /** node -> sentence ids written to practise it (targets), in file order */
  byTarget: Map<NodeId, string[]>;
  /** node -> sentence ids that merely contain it (requires minus targets) */
  byRequire: Map<NodeId, string[]>;
  /** unit id -> sentence ids tagged with that unit */
  byUnit: Map<string, string[]>;
  chapters: ChapterRef[];                 // linear story order
  chapterById: Map<string, ChapterRef>;
  scenes: Map<string, SceneRef>;
  scenesByUnit: Map<string, string[]>;
  tasks: Map<string, TaskRef>;
  tasksByUnit: Map<string, string[]>;
  scripts: Map<NodeId, ScriptRef>;
}

export type Mode = 'next' | 'another';

export interface CompileInput {
  /** Stable learner id: seeds the RNG with the session index (never the lesson id). */
  learnerId: string;
  learner: LearnerView;
  path: PathState;
  course: Course;
  content: ContentIndex;
  /** epoch ms */
  now: number;
  /** default: learner.settings.tier */
  tier?: Tier;
  /** 'next' = the day's session; 'another' = an extra session the same day (compiles the next path day) */
  mode?: Mode;
}

// ------------------------------------------------------------------ path state

/**
 * Where the learner is in the course, plus the spacing bookkeeping the rules
 * need. Owned by the caller (persist it beside the learner state); only
 * `advancePath` produces a new one. Spacing rules count CORE sessions:
 * completed non-minimum sessions (minimum sessions are streak savers that
 * shift the week by one day; they never advance or reorder anything).
 */
export interface PathState {
  version: 2;
  /** index into course.units; === units.length when the course is finished */
  unit: number;
  /** index into units[unit].days */
  day: number;
  /** completed non-minimum sessions */
  coreSessions: number;
  /** chunks/lexemes/patterns/contrasts cut (throttle, budget, not-ready) and still owed; introduced first when room */
  owedNew: NodeId[];
  /** grammar nodes deferred by the one-per-session cap; taken by the next introduce day */
  owedGrammar: NodeId[];
  /** grammar introduced and not yet drilled; `at` = core session number of the introduction */
  pendingDrills: { node: NodeId; at: number }[];
  /** core session number of the last grammar introduction */
  lastGrammarIntroAt?: number;
  /** most recently introduced grammar first (≤ 8), feeds drill interleaving and remix */
  recentGrammar: NodeId[];
  /** shaky nodes (self-check, reading check) drills and remixes draw from first; `served` counts older-set servings (gone at 2) */
  remediate: { node: NodeId; reason: 'selfcheck' | 'readingCheck' | 'lapse'; at: number; served?: number }[];
  /** the last ≤ 60 completed sessions, newest last */
  log: SessionLogEntry[];
}

export interface SessionLogEntry {
  learnerSession: number;
  coreSession?: number;            // undefined for minimum sessions
  type: LessonType | 'minimum';
  dayType?: LessonType;
  unit?: string;
  day?: number;
  advanced: boolean;
  grammarIntro?: NodeId;
  drilled?: NodeId;
  throttled: boolean;
  converted?: Conversion['reason'];
}

// ------------------------------------------------------------------ items

/**
 * How the runner credits an item to the learner model:
 *  - 'review':   learner.creditSentence(item.credit, direction, grade, { target: node, novel })
 *                (bare items with no sentence: learner.review(node, direction, grade))
 *  - 'learning': in-lesson learning step for a node being introduced (learner.introduce/learningStep)
 *  - 'exposure': learner.expose(item.credit) — practice/reading, never a scored review
 *  - 'none':     nothing (assessment-only or presentation)
 */
export type Scoring = 'review' | 'learning' | 'exposure' | 'none';

interface ItemBase {
  /** Unique, stable id. Ledger kind 'item' unless the block is deliberate. */
  id: string;
  scoring: Scoring;
  /** nodes the item exercises (sentence.requires); the target first */
  credit: NodeId[];
}

/**
 * An SRS review: `node` in `direction`, in a sentence that contains it: an
 * UNSEEN one, or (warm-up only) a review context last shown ≥ REVIEW_REUSE_DAYS
 * ago (`reused`), or bare when neither is left.
 *
 * Multi-item review: `targets` lists every due node (same direction) this one
 * sentence reviews, `node` first, at most MULTI_REVIEW_MAX. Each target gets a
 * full review: learner.creditSentence(credit, direction, grade, { targets,
 * grades, novel }). The other nodes in `credit` get the usual partial credit.
 */
export interface ReviewItem extends ItemBase {
  op: 'review';
  node: NodeId;
  /**
   * Due nodes reviewed by this item, `node` first (length 1 = a single
   * review). The compiler always sets it; absent (hand-built items) = [node].
   * Read it with `reviewTargets(item)`.
   */
  targets?: NodeId[];
  direction: Direction;
  /** bank sentence id; undefined = bare card (no fresh context left: a 'bareReview' diagnostic is logged) */
  sentence?: string;
  /** true when the sentence is new to the learner (a recombination) */
  novel: boolean;
  /** a review context re-served after ≥ REVIEW_REUSE_DAYS: ledgered deliberate, reason REVIEW_REUSE_REASON */
  reused?: boolean;
}

/** A new chunk/lexeme/pattern/contrast: present with an example, then 3–5 interleaved retrievals. */
export interface LearnItem extends ItemBase {
  op: 'learn';
  node: NodeId;
  nodeKind: GraphNode['kind'];
  /** an unseen gated example sentence, if one exists */
  example?: string;
  retrievals: number;
  /**
   * Whether the node gets a production card (productivePolicy); the runner
   * passes it to learner.introduce. The compiler always sets it; absent = true.
   */
  productive?: boolean;
}

/**
 * Practice on a sentence.
 *  pick      structured input: read the sentence, choose the meaning/form (receptive)
 *  choose    choose the right form (minimal-pair distractors from the engine)
 *  type      type the form in a gapped sentence
 *  transform change person/tense/polarity (engine-generated target)
 *  recombine a sentence the learner has seen, re-inflected into one they have not (mastery test)
 *  translate en -> es full sentence (translation matcher)
 *  respond   answer a question about yourself (communicative; checked on the focus feature)
 *  gap       gap-fill / cued production from the story's words
 *  comprehend reading check (checkpoint)
 *  read      read for meaning (extended-tier extra reading)
 */
export type PracticeOp = 'pick' | 'choose' | 'type' | 'transform' | 'recombine' | 'translate' | 'respond' | 'gap' | 'comprehend' | 'read';

export interface PracticeItem extends ItemBase {
  op: PracticeOp;
  node: NodeId;
  sentence: string;
  direction: Direction;
}

/** An item from the node's TeachingScript (readAndPick[i] or yourTurn[i]). */
export interface ScriptItem extends ItemBase {
  op: 'readAndPick' | 'yourTurn';
  node: NodeId;
  index: number;
}

/** Timed recall of a known node (minimum session): deliberate, bare, never ledgered as new. */
export interface RecallItem extends ItemBase {
  op: 'recall';
  node: NodeId;
  direction: 'productive';
}

export type Item = ReviewItem | LearnItem | PracticeItem | ScriptItem | RecallItem;

// ------------------------------------------------------------------ blocks

export type BlockPart = 'warmup' | 'core' | 'close';

interface BlockBase {
  part: BlockPart;
  /** estimated minutes */
  minutes: number;
  /**
   * A labelled deliberate re-show (re-read, fluency rerun, rule recall, timed
   * recall). Only deliberate blocks may serve content already in the ledger;
   * their refs are marked `{ deliberate: true }`.
   */
  deliberate: boolean;
}

/** SRS block. Present in EVERY plan (it may be empty when nothing is due). */
export interface WarmupBlock extends BlockBase {
  kind: 'warmup';
  items: ReviewItem[];
  /** cards due at compile time */
  due: number;
  /** due cards reviewed by the items (multi-target items review several) */
  covered: number;
  /** due cards not served in this session (stay due; never dropped) */
  carried: number;
  /** minute budget this block was planned to */
  budgetMinutes: number;
  /** review day / converted session: the extended SRS block */
  extended: boolean;
}

/** New words / chunks / patterns pool: one interleaved pool, 3–5 retrievals each. */
export interface LearnBlock extends BlockBase { kind: 'learn'; items: LearnItem[] }

/**
 * Teach one node from its TeachingScript: hook → examples → rule → readAndPick
 * (structured input) → yourTurn (controlled output, the in-lesson learning
 * steps). `script` false = no script in the content index (shortage logged):
 * the UI teaches from `examples` (bank sentence ids) instead.
 */
export interface TeachBlock extends BlockBase {
  kind: 'teach';
  node: NodeId;
  nodeKind: GraphNode['kind'];
  script: boolean;
  parts: ('hook' | 'examples' | 'rule' | 'readAndPick' | 'yourTurn' | 'pitfalls')[];
  items: ScriptItem[];
  examples: string[];
}

/** Drill opener: recall the rule before seeing it, then a 20 s reminder. Deliberate. */
export interface RuleRecallBlock extends BlockBase { kind: 'ruleRecall'; node: NodeId }

export interface PracticeBlock extends BlockBase {
  /** a short run over shaky nodes, placed after the warm-up the session after a checkpoint */
  remedial?: boolean;
  kind: 'structuredInput' | 'controlledOutput' | 'cuedProduction' | 'communicative' | 'remix' | 'readingCheck' | 'extraReading';
  /** the latest point being practised, when there is one */
  focus?: NodeId;
  /** a contrast node mixed in (only when both sides are known) */
  contrast?: NodeId;
  items: PracticeItem[];
}

/** Leech rescue: the most-failed known nodes in fresh (unseen) contexts. Exposure scoring. */
export interface LeechBlock extends BlockBase { kind: 'leech'; items: ReviewItem[] }

/** First read of a story chapter (never seen before). */
export interface ReadBlock extends BlockBase { kind: 'read'; chapter: string; questions: number }

/**
 * Deliberate re-read of a seen chapter.
 *  fluency: same chapter as earlier in this session, against a gentle timer
 *  notice:  review day, a chapter first read 14–21 days ago ("notice it's easy now")
 *  minimum: minimum session, a known chapter with its comprehension checks
 */
export interface RereadBlock extends BlockBase { kind: 'reread'; chapter: string; purpose: 'fluency' | 'notice' | 'minimum'; timed: boolean }

/** Personal closing prompt from the TeachingScript ("say something true about you"). */
export interface PersonalBlock extends BlockBase { kind: 'personal'; node: NodeId }

export interface SceneBlock extends BlockBase { kind: 'scene'; scene: string; purpose: 'output' | 'checkpoint' }
/** Fluency rerun of the same scene in the same session, timed. Deliberate. */
export interface SceneRerunBlock extends BlockBase { kind: 'sceneRerun'; scene: string; timed: true }

export interface WritingBlock extends BlockBase { kind: 'writing'; task: string; purpose: 'freer' | 'output' | 'checkpoint'; focus?: NodeId }

export interface SelfCheckBlock extends BlockBase { kind: 'selfCheck'; unit: string; canDo: string }

/**
 * "Before you go": a placeholder at compile time (the last core block of every
 * non-minimum plan). Its contents depend on the session: the runner fills
 * `items` when it is reached with this session's lapsed reviews first, then
 * the new items presented, up to `capacity`. Soft (the time cap may skip it);
 * an empty recap is skipped silently. Deliberate: it re-shows content.
 */
export interface RecapItem {
  id: string;
  /** lapsed: a card missed in this session (graded for real, op 'recap'); new: a node introduced today (exposure only) */
  kind: 'lapsed' | 'new';
  node: NodeId;
  direction: Direction;
  /** lapsed: bank sentence for the re-ask (a different one when available); undefined = bare card */
  sentence?: string;
  /** the same sentence as earlier in the session is shown again */
  reused?: boolean;
  /** new: the learn retrieval round to mimic (2 = type it) */
  round?: number;
  /** new: the learn item, for the card builder */
  learn?: LearnItem;
  credit: NodeId[];
}
export interface RecapBlock extends BlockBase { kind: 'recap'; capacity: number; items: RecapItem[] }

/** Minimum session: 2-minute timed typed recall of known items. Deliberate. */
export interface TimedRecallBlock extends BlockBase { kind: 'timedRecall'; items: RecallItem[]; seconds: number }

export interface CloseBlock extends BlockBase {
  kind: 'close';
  unit?: string;
  canDo?: string;
  /** days of the current unit completed after this session, of total */
  progress?: { done: number; of: number };
  /** the next path day's lesson type (tomorrow), if any */
  next?: LessonType;
  /** chapter whose `hook` line sets up tomorrow */
  hookChapter?: string;
  /** whether a second session would be offered after this one (review budget allowing) */
  offerAnother: boolean;
}

export type Block =
  | WarmupBlock | LearnBlock | TeachBlock | RuleRecallBlock | PracticeBlock | LeechBlock
  | ReadBlock | RereadBlock | PersonalBlock | SceneBlock | SceneRerunBlock | WritingBlock
  | SelfCheckBlock | TimedRecallBlock | RecapBlock | CloseBlock;

export type BlockKind = Block['kind'];

// ------------------------------------------------------------------ plan

export interface Conversion {
  from: LessonType;
  to: LessonType;
  /**
   * throttle: due reviews exceed the budget (path does NOT advance)
   * spacing:  a pending drill reached its last allowed session, or an introduce
   *           would follow an introduce (path does NOT advance)
   * shortage: gated, unseen content ran out (the day is consumed: the path advances)
   * nothingNew: an introduce day with nothing left to introduce becomes a drill
   */
  reason: 'throttle' | 'spacing' | 'shortage' | 'nothingNew';
  /** only some blocks were converted (e.g. the chapter of an input day) */
  partial?: boolean;
}

export type DiagnosticCode =
  | 'shortage'         // gated unseen supply ran short; `wanted`/`got` say how much
  | 'bareReview'       // a review had no unseen gated sentence left and is served bare
  | 'throttle'         // backlog throttle fired
  | 'spacing'          // a spacing rule forced the session type
  | 'deferred'         // a new node was owed to a later session (cap / throttle)
  | 'notReady'         // contrast/pattern whose prerequisites are not known yet
  | 'prereq'           // grammar introduced before a `requires` node (course order issue)
  | 'alreadySeen'      // the day's chapter/scene was already shown (skipped, not repeated)
  | 'coverage'         // a chapter or extra reading was weighed against retained (stable) words
  | 'noReread'         // no chapter eligible for a deliberate re-read
  | 'pathDone';        // course finished: maintenance review

export interface Diagnostic {
  code: DiagnosticCode;
  block?: BlockKind;
  node?: NodeId;
  unit?: string;
  /** content kind for shortages */
  what?: 'sentence' | 'chapter' | 'scene' | 'task' | 'script';
  wanted?: number;
  got?: number;
  /** reading coverage: required nodes, of which introduced-but-unstable (glossed), and not introduced (unglossed) */
  coverage?: { required: number; unstable: number; unknown: number; allowed: number; admitted: boolean };
  message: string;
}

export interface SessionPlan {
  /** learner.sessionIndex + 1: the index this session gets from learner.startSession() */
  sessionIndex: number;
  seed: number;
  tier: Tier;
  mode: Mode;
  /** effective lesson type of the core ('review' also for maintenance after the course) */
  type: LessonType | 'minimum';
  /** the path day this session would serve, if any */
  dayType?: LessonType;
  unit?: string;
  day?: number;
  converted?: Conversion;
  /** completing the core moves the path to the next day */
  advancesPath: boolean;
  blocks: Block[];
  /** nodes this session introduces (the runner calls learner.introduce for each) */
  newNodes: { grammar: NodeId[]; patterns: NodeId[]; chunks: NodeId[]; lexemes: NodeId[]; contrasts: NodeId[] };
  /** of newNodes, those introduced receptive-only: learner.introduce(id, { productive: false }) */
  receptiveOnly: NodeId[];
  budget: {
    /** band the session's budgets were taken from */
    band: Band;
    minutes: number;
    /** the backlog-throttle threshold (warm-up budget; + the extra core minutes on the extended tier) */
    reviewMinutes: number;
    secondsPerReview: number;
    due: number;
    /** minutes to review everything due, with multi-target items costed at MULTI_REVIEW_COST */
    dueMinutes: number;
    throttled: boolean;
    severe: boolean;
  };
  estimatedMinutes: number;
  diagnostics: Diagnostic[];
  /** the path after this session's core completes (see advancePath) */
  pathAfter: PathState;
}

/**
 * One thing to record in the exposure ledger after it is shown:
 * learner.ledger.markSeen(kind, id, { deliberate, review, reason }).
 * `review`: shown as an SRS review context (makes it eligible for reuse later).
 */
export interface ServedRef { kind: LedgerKind; id: string; deliberate: boolean; review?: boolean; reason?: string }
