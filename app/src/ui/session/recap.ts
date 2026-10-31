// "Before you go": what the session's last block re-asks, and how it is
// shown. The compiler only plans an empty block with a capacity; the runner
// calls `planRecap` when the block is reached. Lapses first (they are the
// in-session relearning step and are graded for real), then the new items
// presented today (exposure only), deduplicated, capped by the capacity.
import type { LearnItem, RecapItem, ReviewItem } from '../../compiler';
import type { NodeId } from '../../content/schema';
import type { Direction, Learner } from '../../learner';
import type { Bundle } from '../data/bundle';
import { learnRetrieval, reviewCard, type Card } from './cards';

export interface Lapse { node: NodeId; direction: Direction; sentence?: string }

export interface RecapInput {
  learner: Learner;
  bundle: Bundle;
  capacity: number;
  lapses: readonly Lapse[];
  /** learn-pool items whose node was presented this session, in order */
  newItems: readonly LearnItem[];
  /** retrievals each new node got this session */
  steps: ReadonlyMap<NodeId, number>;
  /** nodes missed at least once while being learned */
  misses?: ReadonlySet<NodeId>;
  /** correct typed answers per node while being learned */
  typedOk?: ReadonlyMap<NodeId, number>;
}

/** A different gated, unseen bank sentence for the node, else the one it was last asked in. */
function otherSentence(i: RecapInput, node: NodeId, was?: string): { sentence?: string; reused?: boolean } {
  const { learner, bundle } = i;
  const ids = [...(bundle.index.byTarget.get(node) ?? []), ...(bundle.index.byRequire.get(node) ?? [])];
  for (const id of ids) {
    if (id === was || learner.ledger.hasSeen('sentence', id)) continue;
    const ref = bundle.index.sentences.get(id);
    if (!ref || ref.question) continue;
    if (ref.requires.every((r) => learner.isIntroduced(r))) return { sentence: id };
  }
  return was ? { sentence: was, reused: true } : {};
}

export function planRecap(i: RecapInput): RecapItem[] {
  const out: RecapItem[] = [];
  const seen = new Set<NodeId>();
  for (const l of i.lapses) {
    if (out.length >= i.capacity) break;
    if (seen.has(l.node) || !i.learner.hasCard(l.node, l.direction)) continue;
    seen.add(l.node);
    out.push({ id: `recap:${l.node}:${l.direction}`, kind: 'lapsed', node: l.node, direction: l.direction, ...otherSentence(i, l.node, l.sentence), credit: [l.node] });
  }
  // missed first, then never typed, then typed once; typed twice only if room is left
  const typed = (n: NodeId) => i.typedOk?.get(n) ?? 0;
  const rank = (it: LearnItem) => (i.misses?.has(it.node) ? 0 : typed(it.node) === 0 ? 1 : 2);
  const fresh = i.newItems.filter((it, k, a) => a.findIndex((x) => x.node === it.node) === k);
  const ordered = fresh.map((it, k) => ({ it, k })).sort((x, y) => rank(x.it) - rank(y.it) || x.k - y.k).map((x) => x.it);
  const twice = (it: LearnItem) => !i.misses?.has(it.node) && typed(it.node) >= 2;
  for (const it of [...ordered.filter((x) => !twice(x)), ...ordered.filter(twice)]) {
    if (out.length >= i.capacity) break;
    if (seen.has(it.node)) continue;
    seen.add(it.node);
    const n = i.steps.get(it.node) ?? 1;
    // a missed item is asked as pick-the-Spanish; typed once already and a production track: ask it typed; else the format it was last asked in
    const round = i.misses?.has(it.node) ? (it.productive === false ? 0 : 1) : Math.min(Math.max(n - 1, 0), it.productive === false ? 0 : 2);
    out.push({
      id: `recap:${it.node}:new`, kind: 'new', node: it.node, direction: round >= 2 ? 'productive' : 'receptive',
      round, learn: it, credit: [it.node],
    });
  }
  return out;
}

/** The card for a recap item, through the same builders as the warm-up and the learn pool. */
export function recapCard(it: RecapItem, b: Bundle): Card {
  if (it.kind === 'new' && it.learn) return { ...learnRetrieval(it.learn, b, it.round ?? 0), key: it.id };
  const r: ReviewItem = {
    op: 'review', id: it.id, scoring: 'review', credit: it.credit, node: it.node, targets: [it.node],
    direction: it.direction, sentence: it.sentence, novel: !it.reused,
  };
  return reviewCard(r, b);
}
