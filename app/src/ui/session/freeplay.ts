// Free practice: a small runner that is independent of the session compiler.
// It takes a PracticeSpec and yields cards one at a time; `answer` records the
// outcome of the card just shown. Four modes, four grading rules:
//   quickReview  a real FSRS review (op 'quick'), most at-risk cards first
//   conjugate    exposure only (op 'grind'), never a scheduled review
//   translate    exposure only (op 'grind')
//   nodes        exposure (op 'train') plus the output ladder step
import type { PracticeItem, ReviewItem } from '../../compiler';
import type { NodeId } from '../../content/schema';
import { checkExact } from '../../check';
import { wordHint } from '../../check/wordhint';
import {
  PRODUCTION_IMP_PERSONS, PRODUCTION_PERSONS, acceptedForms, conjugate, enPhrase, personsFor, verbByInf,
  type TenseKey, type Verb,
} from '../../engine';
import { State, type Direction, type Learner } from '../../learner';
import { shuffle, type Rng } from '../../exercises/rng';
import type { Bundle } from '../data/bundle';
import { practiceCard, reviewCard, verbFormWhy, type Card, type Check, type TypeCard } from './cards';
import type { PracticeSpec } from './practice-spec';
import { gradeOf, type Outcome } from './runner';
import { PICKER_TENSES, tenseName, tensesOfNode } from './tenses';

export const DEFAULT_MINUTES: Record<PracticeSpec['kind'], number> = { quickReview: 5, conjugate: 3, translate: 5, nodes: 3 };
/** Items per node in a nodes drill. */
export const ITEMS_PER_NODE = 3;
/** Most cards a quick review lines up. */
const QUICK_MAX = 60;

export interface FreeplayDeps { learner: Learner; bundle: Bundle; rng: Rng; now: () => number }

// ---------------------------------------------------------------- plain names

export { tenseName };
const CUE_NAME: Partial<Record<TenseKey, string>> = {
  presente: 'now', preterito: 'the past', imperfecto: 'used to', futuro: 'the future', condicional: 'would',
  perfecto: 'have done', presubj: 'wishes and doubts',
};

/** The grammar node that says a tense is taught (the first introduced match). */
export function tenseNode(learner: Learner, tense: string): NodeId | undefined {
  return learner.nodes().find((n) => tensesOfNode({ id: n }).includes(tense as TenseKey));
}

/** Tenses the learner has been taught (presente stands in once any verb is known). */
export function taughtTenses(learner: Learner): string[] {
  const out: string[] = PICKER_TENSES.filter((t) => tenseNode(learner, t)) as string[];
  if (!out.includes('presente') && verbsMet(learner).length) out.unshift('presente');
  return out;
}

/** Verbs the learner has met (lexeme nodes whose id is an infinitive), most recent first. */
export function verbsMet(learner: Learner): string[] {
  const rows: Array<{ inf: string; at: number }> = [];
  for (const id of learner.nodes()) {
    if (!id.startsWith('l:')) continue;
    const inf = id.slice(2);
    if (!verbByInf(inf)) continue;
    rows.push({ inf, at: learner.node(id)?.introducedAt ?? 0 });
  }
  return rows.sort((a, b) => b.at - a.at || (a.inf < b.inf ? -1 : 1)).map((r) => r.inf);
}

/** Key a personal best is stored under. */
export function bestKey(spec: PracticeSpec): string {
  if (spec.kind !== 'conjugate') return spec.kind;
  return `conjugate:${[...spec.verbs].sort().join(',')}|${[...spec.tenses].sort().join(',')}`;
}

// ---------------------------------------------------------------- the runner

export class Freeplay {
  readonly spec: PracticeSpec;
  readonly minutes: number;
  /** answered, and right on the first try */
  right = 0;
  answered = 0;
  /** cards lined up, when the mode knows (quick review, nodes) */
  readonly total?: number;
  /** the op of the card just shown (a PracticeOp for sentence modes) */
  lastOp?: string;

  private readonly d: FreeplayDeps;
  private seq = 0;
  private queue: Array<() => Card | undefined> = [];
  private cur?: { grade: (o: Outcome) => void };
  // translate
  private pool: string[] = [];
  private poolAt = 0;
  // conjugate
  private verbs: Verb[] = [];
  private lastCue = '';

  constructor(spec: PracticeSpec, deps: FreeplayDeps) {
    this.spec = spec;
    this.d = deps;
    this.minutes = spec.minutes ?? DEFAULT_MINUTES[spec.kind];
    switch (spec.kind) {
      case 'quickReview': this.queue = this.planQuick(); break;
      case 'nodes': this.queue = this.planNodes(spec.nodes); break;
      case 'translate': this.pool = this.planTranslate(spec); break;
      case 'conjugate': this.verbs = spec.verbs.map((v) => verbByInf(v)).filter((v): v is Verb => !!v); break;
    }
    if (spec.kind === 'quickReview' || spec.kind === 'nodes') this.total = this.queue.length;
  }

  /** The next card, or undefined when nothing is left. The caller stops on the clock. */
  next(): Card | undefined {
    this.cur = undefined;
    switch (this.spec.kind) {
      case 'quickReview':
      case 'nodes':
        while (this.queue.length) {
          const c = this.queue.shift()!();
          if (c) return c;
        }
        return undefined;
      case 'translate': return this.nextTranslate();
      case 'conjugate': return this.nextConjugate();
    }
  }

  /** Record the outcome of the card `next()` just returned. */
  answer(o: Outcome): void {
    if (!this.cur) return;
    this.answered += 1;
    if (o.correct && o.tries <= 1) this.right += 1;
    this.cur.grade(o);
    this.cur = undefined;
  }

  private tries(o: Outcome): 1 | 2 { return o.tries > 1 ? 2 : 1; }

  // ------------------------------------------------------------ gated sentences

  /** Bank sentence ids for a node (its own first), gated by what the learner knows. */
  private sentencesFor(node: NodeId, allow: ReadonlySet<NodeId> = new Set()): string[] {
    const { learner, bundle } = this.d;
    const ix = bundle.index;
    const ids = [...(ix.byTarget.get(node) ?? []), ...(ix.byRequire.get(node) ?? [])];
    return ids.filter((id) => {
      const ref = ix.sentences.get(id);
      return !!ref && ref.requires.every((r) => learner.isIntroduced(r) || allow.has(r));
    });
  }

  /** Unseen ids first (shuffled), then seen ones (shuffled). */
  private unseenFirst(ids: string[]): string[] {
    const { learner, rng } = this.d;
    const fresh = ids.filter((id) => !learner.ledger.hasSeen('sentence', id));
    const old = ids.filter((id) => learner.ledger.hasSeen('sentence', id));
    return [...shuffle(fresh, rng), ...shuffle(old, rng)];
  }

  private markSeen(sentence: string) {
    const { learner, now } = this.d;
    const seen = learner.ledger.hasSeen('sentence', sentence);
    learner.ledger.markSeen('sentence', sentence, { deliberate: seen, at: now(), ...(seen ? { reason: 'free practice' } : {}) });
  }

  // ------------------------------------------------------------ quick review

  private planQuick(): Array<() => Card | undefined> {
    const { learner, now } = this.d;
    const at = now();
    const picked = new Map<NodeId, Direction>();
    const order: NodeId[] = [];
    const usable = (node: NodeId, dir: Direction) => {
      const c = learner.card(node, dir);
      return !!c && !c.suspended && c.state !== State.Learning && !learner.isLearning(node);
    };
    const due = learner.due(at).filter((c) => c.state !== State.Learning && !learner.isLearning(c.node));
    for (const c of due) {
      const had = picked.get(c.node);
      if (had === undefined) order.push(c.node);
      // one direction per node: the productive one when it is due too
      if (had === undefined || c.direction === 'productive') picked.set(c.node, c.direction);
    }
    const rest: Array<{ node: NodeId; dir: Direction; r: number }> = [];
    for (const node of learner.nodes()) {
      if (picked.has(node)) continue;
      const dir: Direction | undefined = usable(node, 'productive') ? 'productive' : usable(node, 'receptive') ? 'receptive' : undefined;
      if (!dir) continue;
      const r = learner.retrievability(node, dir, at);
      if (r !== undefined) rest.push({ node, dir, r });
    }
    rest.sort((a, b) => a.r - b.r || (a.node < b.node ? -1 : 1));
    const all = [...order.map((node) => ({ node, dir: picked.get(node)! })), ...rest].slice(0, QUICK_MAX);
    return all.map(({ node, dir }) => () => this.quickCard(node, dir));
  }

  private quickCard(node: NodeId, dir: Direction): Card {
    const { learner, bundle } = this.d;
    const pool = this.sentencesFor(node);
    const fresh = pool.filter((id) => !learner.ledger.hasSeen('sentence', id) && !bundle.index.sentences.get(id)?.question);
    const sentence = this.unseenFirst(fresh.length ? fresh : pool)[0];
    const novel = !!sentence && !learner.ledger.hasSeen('sentence', sentence);
    const id = `quick:${++this.seq}:${node}:${dir}`;
    const item: ReviewItem = { op: 'review', id, scoring: 'review', credit: [node], node, targets: [node], direction: dir, sentence, novel };
    const card = reviewCard(item, bundle);
    this.lastOp = 'quick';
    this.cur = {
      grade: (o) => {
        const grade = gradeOf(o);
        const opts = { at: this.d.now(), ms: o.ms, op: 'quick', tries: this.tries(o), sentence, novel };
        if (!learner.hasCard(node, dir)) return;
        learner.creditSentence([node], dir, grade, opts);
        if (sentence) this.markSeen(sentence);
      },
    };
    return card;
  }

  // ------------------------------------------------------------ nodes drill

  private planNodes(nodes: NodeId[]): Array<() => Card | undefined> {
    const allow = new Set(nodes);
    const out: Array<() => Card | undefined> = [];
    for (const node of nodes) {
      const used = new Set<string>();
      for (let k = 0; k < ITEMS_PER_NODE; k++) out.push(() => this.nodeCard(node, allow, used));
    }
    return out;
  }

  /** The practice op for a node's current rung. */
  private opAt(node: NodeId): PracticeItem['op'] {
    const rung = this.d.learner.rung(node);
    if (node.startsWith('l:')) return rung >= 1 ? 'gap' : 'choose';
    return (['choose', 'type', 'transform', 'translate'] as const)[rung];
  }

  private nodeCard(node: NodeId, allow: ReadonlySet<NodeId>, used: Set<string>): Card | undefined {
    const { learner, bundle } = this.d;
    const pool = this.unseenFirst(this.sentencesFor(node, allow)).filter((id) => !used.has(id));
    const sentence = pool[0];
    if (!sentence) return undefined;
    used.add(sentence);
    const novel = !learner.ledger.hasSeen('sentence', sentence);
    const op = this.opAt(node);
    const credit = [...new Set([node, ...(bundle.index.sentences.get(sentence)?.requires ?? [])])];
    const item: PracticeItem = { op, id: `train:${++this.seq}:${node}`, scoring: 'exposure', credit, node, sentence, direction: 'productive' };
    const card = practiceCard(item, bundle, this.d.rng() * 1e9);
    this.lastOp = op;
    this.cur = {
      grade: (o) => {
        learner.expose(credit.filter((n) => learner.isIntroduced(n)), {
          at: this.d.now(), event: { op: 'train', direction: 'productive', grade: gradeOf(o), tries: this.tries(o), ms: o.ms, sentence, novel },
        });
        this.markSeen(sentence);
        learner.stepRung(node, !o.correct ? 'miss' : o.tries <= 1 ? 'pass' : 'retry');
      },
    };
    return card;
  }

  // ------------------------------------------------------------ translation grind

  private planTranslate(spec: Extract<PracticeSpec, { kind: 'translate' }>): string[] {
    const { learner, bundle } = this.d;
    const ix = bundle.index;
    let ids: string[];
    if (spec.nodes?.length) ids = spec.nodes.flatMap((n) => [...(ix.byTarget.get(n) ?? []), ...(ix.byRequire.get(n) ?? [])]);
    else if (spec.unit) ids = ix.byUnit.get(spec.unit) ?? [];
    else ids = [...ix.sentences.keys()];
    const gated = [...new Set(ids)].filter((id) => ix.sentences.get(id)?.requires.every((r) => learner.isIntroduced(r)));
    return this.unseenFirst(gated);
  }

  private nextTranslate(): Card | undefined {
    const { learner, bundle } = this.d;
    while (this.poolAt < this.pool.length) {
      const sentence = this.pool[this.poolAt++];
      const s = bundle.sentence(sentence);
      if (!s) continue;
      const ref = bundle.index.sentences.get(sentence)!;
      const novel = !learner.ledger.hasSeen('sentence', sentence);
      const node = ref.targets[0] ?? ref.requires[0];
      if (!node) continue;
      const item: PracticeItem = { op: 'translate', id: `grind:${++this.seq}:${sentence}`, scoring: 'exposure', credit: ref.requires, node, sentence, direction: 'productive' };
      const card = practiceCard(item, bundle, this.d.rng() * 1e9);
      this.lastOp = 'translate';
      this.cur = {
        grade: (o) => {
          learner.expose(ref.requires, {
            at: this.d.now(), event: { op: 'grind', direction: 'productive', grade: gradeOf(o), tries: this.tries(o), ms: o.ms, sentence, novel },
          });
          this.markSeen(sentence);
        },
      };
      return card;
    }
    return undefined;
  }

  // ------------------------------------------------------------ conjugation grind

  /** A random (verb, tense, person) cue; never the same cue twice in a row. */
  pickCue(): { verb: Verb; tense: TenseKey; idx: number } | undefined {
    if (this.spec.kind !== 'conjugate' || !this.verbs.length) return undefined;
    const { rng } = this.d;
    const tenses = this.spec.tenses as TenseKey[];
    if (!tenses.length) return undefined;
    for (let tries = 0; tries < 20; tries++) {
      const verb = this.verbs[Math.floor(rng() * this.verbs.length)];
      const tense = tenses[Math.floor(rng() * tenses.length)];
      const imp = tense === 'imperativo' || tense === 'impneg';
      const people = imp ? PRODUCTION_IMP_PERSONS : PRODUCTION_PERSONS;
      const idx = personsFor(tense).indexOf(people[Math.floor(rng() * people.length)]);
      const key = `${verb.inf}|${tense}|${idx}`;
      if (key === this.lastCue && tries < 19) continue;
      this.lastCue = key;
      return { verb, tense, idx };
    }
    return undefined;
  }

  private nextConjugate(): Card | undefined {
    const cue = this.pickCue();
    if (!cue) return undefined;
    const { learner } = this.d;
    const card = conjugationCard(`grind:${++this.seq}`, cue.verb, cue.tense, cue.idx);
    const credit = [tenseNode(learner, cue.tense), learner.isIntroduced(`l:${cue.verb.inf}`) ? `l:${cue.verb.inf}` : undefined].filter((x): x is NodeId => !!x);
    this.lastOp = 'conjugate';
    this.cur = {
      grade: (o) => {
        learner.expose(credit, { at: this.d.now(), event: { op: 'grind', direction: 'productive', grade: gradeOf(o), tries: this.tries(o), ms: o.ms } });
      },
    };
    return card;
  }
}

/** One conjugation cue as a typed card: "(comer, nosotros, the past)" and its English. Accents are strict. */
export function conjugationCard(key: string, verb: Verb, tense: TenseKey, idx: number): TypeCard {
  const person = personsFor(tense)[idx] as string;
  const cue = `(${verb.inf}, ${person}, ${CUE_NAME[tense] ?? tenseName(tense)})`;
  const answers = acceptedForms(verb, tense, idx);
  const shown = conjugate(verb, tense)[idx] ?? answers[0];
  const check = (input: string): Check => {
    const r = checkExact(input, answers);
    if (r.pass) return { pass: true, answer: shown };
    if (r.near) return { pass: false, near: true, hint: 'Check the accents.', hintKind: 'accents', answer: shown };
    const w = wordHint(input, answers);
    return { pass: false, near: false, hint: w?.hint, hintKind: w?.kind, answer: shown };
  };
  const en = enPhrase(verb, tense, idx).text;
  return {
    type: 'type', key, ask: 'Type the form', prompt: { text: cue, lang: 'en' }, sub: { text: en, lang: 'en' },
    answerLang: 'es', placeholder: 'The form, with accents', check, retry: true,
    why: verbFormWhy({ cue, answer: shown }) ?? `${shown} is the form.`,
  };
}
