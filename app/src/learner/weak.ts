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
  spec: PracticeSpec;
}

export interface WeakOpts {
  days?: number;
  minAttempts?: number;
  now?: number;
  /** Verbs the learner has met, most recent first (infinitives). */
  metVerbs?: readonly string[];
  /** Spanish text of a bank sentence id, to find the verbs in a missed sentence. */
  sentenceEs?: (id: string) => string | undefined;
}

const DAY_MS = 86_400_000;
const FREE_FORM = new Set(['translate', 'respond', 'scene', 'recap']);
const FORM = new Set(['warmup', 'pick', 'choose', 'type', 'transform', 'recombine', 'grind', 'train', 'quick']);
const GRAMMAR_KINDS = new Set(['grammar', 'pattern', 'contrast']);
const TENSE_RATE = 0.4;
const NODE_RATE = 0.5;
const MAX_SPOTS = 3;
const MAX_VERBS = 8;

type Nodes = ((id: NodeId) => GraphNode | undefined) | ReadonlyMap<NodeId, GraphNode>;
interface Tally { attempts: number; misses: number; nodes: Set<NodeId>; missed: ReviewEvent[] }

const tally = (): Tally => ({ attempts: 0, misses: 0, nodes: new Set(), missed: [] });

export function weakSpots(events: readonly ReviewEvent[], nodes: Nodes, opts: WeakOpts = {}): WeakSpot[] {
  const days = opts.days ?? 14;
  const minAttempts = opts.minAttempts ?? 3;
  const since = (opts.now ?? Date.now()) - days * DAY_MS;
  const look = (id: NodeId) => (typeof nodes === 'function' ? nodes(id) : nodes.get(id));

  const byTense = new Map<string, Tally>();
  const byNode = new Map<NodeId, Tally>();
  const add = <K>(m: Map<K, Tally>, k: K, e: ReviewEvent, miss: boolean, id: NodeId) => {
    const t = m.get(k) ?? tally();
    t.attempts += 1; t.nodes.add(id);
    if (miss) { t.misses += 1; t.missed.push(e); }
    m.set(k, t);
  };

  for (const e of events) {
    if (e.at < since) continue;
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

  const spots: WeakSpot[] = [];
  for (const [tense, t] of byTense) {
    const rate = t.misses / t.attempts;
    if (t.attempts < minAttempts || rate < TENSE_RATE) continue;
    const nodeIds = [...t.nodes];
    const verbs = verbsFor(t);
    const label = tenseShort(tense);
    spots.push({
      kind: 'tense', key: tense, label, misses: t.misses, attempts: t.attempts, rate, nodes: nodeIds,
      spec: verbs.length
        ? { kind: 'conjugate', verbs, tenses: [tense], title: `${label}: a workout` }
        : { kind: 'nodes', nodes: nodeIds.slice(0, 3), title: `${label}: a workout` },
    });
  }
  for (const [id, t] of byNode) {
    const rate = t.misses / t.attempts;
    if (t.attempts < minAttempts || rate < NODE_RATE) continue;
    const label = look(id)?.title ?? id;
    spots.push({
      kind: 'node', key: id, label, misses: t.misses, attempts: t.attempts, rate, nodes: [id],
      spec: { kind: 'nodes', nodes: [id], title: `${label}: a workout` },
    });
  }
  return spots.sort((a, b) => b.misses * b.rate - a.misses * a.rate).slice(0, MAX_SPOTS);
}
