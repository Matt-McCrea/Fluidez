// Weak spots: where the learner keeps missing, found from the event log.
// Sentence-level questions (translate, respond, scene turns) are often marked
// wrong for synonym or phrasing reasons, so they only LOCATE a weak tense or
// feature, and only through grammar-kind nodes. The fix is always a form drill
// on fresh material, never those questions again.
import type { GraphNode, NodeId } from '../content/schema';
import { analyzeToken, tokenize, verbByInf } from '../engine';
import type { PracticeSpec } from '../ui/session/practice-spec';
import { tenseShort, tensesOfNode } from '../ui/session/tenses';
import type { ReviewEvent } from './events';
import { Rating } from './scheduler';

export interface WeakSpot {
  kind: 'tense' | 'node';
  key: string;
  label: string;
  misses: number;
  attempts: number;
  rate: number;
  nodes: NodeId[];
  /** When the learner last attempted it (ms). */
  last: number;
  spec: PracticeSpec;
}

export interface WeakOpts {
  days?: number;
  /** How many spots to return (default 3, the Home card). */
  max?: number;
  minAttempts?: number;
  now?: number;
  /** Verbs the learner has met, most recent first (infinitives). */
  metVerbs?: readonly string[];
  /** Spanish text of a bank sentence id, to find the verbs in a missed sentence. */
  sentenceEs?: (id: string) => string | undefined;
  /**
   * Whether the learner has been taught a node. A spot whose nodes name a contrast the learner has is trained on that contrast's
   * own items, where the decision is, and not on forms or on sentences that gap any verb. Absent: no spot is sent to a contrast.
   */
  introduced?: (id: NodeId) => boolean;
}

const DAY_MS = 86_400_000;
const FREE_FORM = new Set(['translate', 'respond', 'scene', 'recap']);
const FORM = new Set(['warmup', 'pick', 'choose', 'type', 'transform', 'recombine', 'grind', 'train', 'quick', 'checkpoint', 'flash', 'rescue']);
/** Drills of forms and words: a miss in one is a miss of the form, never of the choice between two tenses. */
const DRILL = new Set(['grind', 'flash']);
const GRAMMAR_KINDS = new Set(['grammar', 'pattern', 'contrast']);
const TENSE_RATE = 0.4;
const NODE_RATE = 0.5;
const DEFAULT_MAX_SPOTS = 3;
const MAX_VERBS = 8;

type Nodes = ((id: NodeId) => GraphNode | undefined) | ReadonlyMap<NodeId, GraphNode>;
interface Tally { attempts: number; misses: number; nodes: Set<NodeId>; missed: ReviewEvent[]; last: number }

const tally = (): Tally => ({ attempts: 0, misses: 0, nodes: new Set(), missed: [], last: 0 });

export function weakSpots(events: readonly ReviewEvent[], nodes: Nodes, opts: WeakOpts = {}): WeakSpot[] {
  const days = opts.days ?? 14;
  const minAttempts = opts.minAttempts ?? 3;
  const since = (opts.now ?? Date.now()) - days * DAY_MS;
  const look = (id: NodeId) => (typeof nodes === 'function' ? nodes(id) : nodes.get(id));

  const byTense = new Map<string, Tally>();
  const byNode = new Map<NodeId, Tally>();
  const add = <K>(m: Map<K, Tally>, k: K, e: ReviewEvent, miss: boolean, id: NodeId) => {
    const t = m.get(k) ?? tally();
    t.attempts += 1; t.nodes.add(id); t.last = Math.max(t.last, e.at);
    if (miss) { t.misses += 1; t.missed.push(e); }
    m.set(k, t);
  };

  for (const e of events) {
    // "mine says the same thing": the app could not tell, so it is neither a miss nor an attempt (R9)
    if (e.at < since || e.claimed) continue;
    const free = FREE_FORM.has(e.op);
    if (!free && !FORM.has(e.op)) continue;
    const n = look(e.node);
    if (!n) continue;
    if (free && !GRAMMAR_KINDS.has(n.kind)) continue;
    const miss = e.grade === Rating.Again || e.tries === 2;
    const tenses = n.kind === 'grammar' || n.kind === 'pattern' ? tensesOfNode(n) : [];
    if (tenses.length) { for (const t of tenses) add(byTense, t, e, miss, e.node); continue; }
    if (n.kind === 'lexeme' && !((n.freqRank ?? Infinity) <= 2000)) continue;
    add(byNode, e.node, e, miss, e.node);
  }

  const met = new Set(opts.metVerbs ?? []);
  const verbsFor = (t: Tally): string[] => {
    const out: string[] = [];
    if (opts.sentenceEs) {
      for (const e of t.missed) {
        const es = e.sentence ? opts.sentenceEs(e.sentence) : undefined;
        if (!es) continue;
        for (const tok of tokenize(es)) {
          for (const a of analyzeToken(tok)) {
            if (a.inf && met.has(a.inf) && verbByInf(a.inf) && !out.includes(a.inf)) out.push(a.inf);
          }
        }
      }
    }
    for (const v of opts.metVerbs ?? []) { if (!out.includes(v)) out.push(v); if (out.length >= MAX_VERBS) break; }
    return out.slice(0, MAX_VERBS);
  };

  // the contrasts a node is one side of, among those the learner has been taught
  const contrastsOf = (id: NodeId): NodeId[] => (look(id)?.contrasts ?? []).filter((x) => x.startsWith('x:') && look(x)?.kind === 'contrast' && !!opts.introduced?.(x));
  // a miss on a point that is about two tenses, away from a drill of forms, is a miss of the choice between them. The future is a side of a
  // contrast too, but a miss on the future is a miss of the future: a tense and its forms are what a form drill is for, and a grind has no choice in it
  const betweenTenses = (e: ReviewEvent): NodeId[] => {
    const n = look(e.node);
    return !DRILL.has(e.op) && n && tensesOfNode(n).length > 1 ? contrastsOf(e.node) : [];
  };

  const spots: WeakSpot[] = [];
  for (const [tense, t] of byTense) {
    const rate = t.misses / t.attempts;
    if (t.attempts < minAttempts || rate < TENSE_RATE) continue;
    const nodeIds = [...t.nodes];
    const verbs = verbsFor(t);
    const label = tenseShort(tense);
    // misses on the point that sets two tenses against each other are not misses of a form: the form is right, the choice is not
    const between = [...new Set(t.missed.flatMap(betweenTenses))];
    const onChoice = t.missed.filter((e) => betweenTenses(e).length).length;
    const toContrast = between.length && onChoice * 2 >= t.misses ? between.slice(0, 2) : undefined;
    spots.push({
      kind: 'tense', key: tense, label, misses: t.misses, attempts: t.attempts, rate, nodes: toContrast ?? nodeIds, last: t.last,
      spec: toContrast
        ? { kind: 'nodes', nodes: toContrast, title: `${look(toContrast[0])?.title ?? label}: a workout` }
        : verbs.length
          ? { kind: 'conjugate', verbs, tenses: [tense], title: `${label}: a workout` }
          : { kind: 'nodes', nodes: nodeIds.slice(0, 3), title: `${label}: a workout` },
    });
  }
  for (const [id, t] of byNode) {
    const rate = t.misses / t.attempts;
    if (t.attempts < minAttempts || rate < NODE_RATE) continue;
    const label = look(id)?.title ?? id;
    const between = contrastsOf(id).slice(0, 2);
    spots.push({
      kind: 'node', key: id, label, misses: t.misses, attempts: t.attempts, rate, nodes: between.length ? between : [id], last: t.last,
      spec: between.length
        ? { kind: 'nodes', nodes: between, title: `${look(between[0])?.title ?? label}: a workout` }
        : { kind: 'nodes', nodes: [id], title: `${label}: a workout` },
    });
  }
  return spots.sort((a, b) => b.misses * b.rate - a.misses * a.rate).slice(0, opts.max ?? DEFAULT_MAX_SPOTS);
}

export interface RecentMiss {
  node: NodeId;
  label: string;
  sentence?: string;
  op: string;
  at: number;
}

/** The last n misses, newest first, by the same rule the spots use. */
export function recentMisses(
  events: readonly ReviewEvent[], nodes: Nodes,
  opts: { now?: number; days?: number; n?: number } = {},
): RecentMiss[] {
  const since = (opts.now ?? Date.now()) - (opts.days ?? 14) * DAY_MS;
  const look = (id: NodeId) => (typeof nodes === 'function' ? nodes(id) : nodes.get(id));
  const out: RecentMiss[] = [];
  for (const e of events) {
    if (e.at < since || e.claimed) continue;
    const free = FREE_FORM.has(e.op);
    if (!free && !FORM.has(e.op)) continue;
    if (!(e.grade === Rating.Again || e.tries === 2)) continue;
    const n = look(e.node);
    if (!n) continue;
    if (free && !GRAMMAR_KINDS.has(n.kind)) continue;
    out.push({ node: e.node, label: n.title ?? e.node, sentence: e.sentence, op: e.op, at: e.at });
  }
  return out.sort((a, b) => b.at - a.at).slice(0, opts.n ?? 15);
}
