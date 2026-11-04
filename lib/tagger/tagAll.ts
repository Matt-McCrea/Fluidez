// Tag a batch of Spanish rows against a graph: `{id, es}` in, requires + focus span out.
// Built so a later tool can tag the old app's content with the rebuild's tagger.
import { focusSpan, splitSentences, tagSentence } from './index';
import { loadGraph, tagOptions, type Graph, type GraphNode, type TagOptionsInput } from '../graph';
import type { TagOptions } from './types';

export interface TagRow {
  id: string;
  es: string;
  /** The nodes the row is meant to teach; the focus span is for the first. Default: the first non-lexeme require. */
  targets?: string[];
}
export interface TaggedRow {
  id: string;
  requires: string[];
  /** Character offsets [start, end) in the row's `es` of the decision on the first target; null if none or not locatable. */
  focus: { node: string; span: [number, number] } | null;
  confidence: 'high' | 'low';
  lowReasons: string[];
}

type GraphInput = Graph | ReadonlyArray<GraphNode> | ReadonlyArray<ReadonlyArray<GraphNode>>;
const isGraph = (g: GraphInput): g is Graph => !Array.isArray(g) && (g as Graph).nodes instanceof Map;

/** Tag every row. `graph` is a built Graph or the raw node arrays. Each sentence of a row is tagged
 *  on its own (the detectors never look across a full stop) and the requires are unioned, sorted. */
export function tagAll(graph: GraphInput, rows: readonly TagRow[], o: TagOptionsInput = {}): TaggedRow[] {
  const opts: TagOptions = tagOptions(isGraph(graph) ? graph : loadGraph(graph), o);
  return rows.map((row) => tagRow(row, opts));
}

export function tagRow(row: TagRow, opts: TagOptions): TaggedRow {
  const sents = splitSentences(row.es);
  const req = new Set<string>();
  const low: string[] = [];
  let high = true;
  let focus: TaggedRow['focus'] = null;
  let from = 0;
  const results = sents.map((s) => ({ s, r: tagSentence(s, opts) }));
  for (const { r } of results) {
    for (const n of r.requires) req.add(n);
    if (r.confidence === 'low') high = false;
    low.push(...r.lowReasons);
  }
  const target = row.targets?.[0] ?? [...req].sort().find((n) => !n.startsWith('l:'));
  for (const { s, r } of results) {
    const at = row.es.indexOf(s, from);
    if (at >= 0) from = at + s.length;
    if (focus || !target || at < 0) continue;
    const sp = focusSpan(s, r, [target]);
    if (sp) focus = { node: target, span: [at + sp[0], at + sp[1]] };
  }
  return { id: row.id, requires: [...req].sort(), focus, confidence: high ? 'high' : 'low', lowReasons: low };
}
