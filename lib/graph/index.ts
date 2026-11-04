// The skill graph, as data in and tagger options out. Pure: no I/O. The caller reads the graph
// JSON (app/content/graph/*.json, or any array of nodes of the same shape) and passes it in.
//
//   const g = loadGraph([...grammar, ...patterns, ...chunks, ...lexemes, ...contrasts, ...candos]);
//   const opts = tagOptions(g);           // registers the graph's lexemes with the tagger (module state)
//   tagSentence('Quiero un café.', opts);
import { closedClass, registerLexemes, registerNames } from '../tagger/lexicon';
import type { ChunkSpec, PatternSpec, TagOptions } from '../tagger/types';

export type NodeKind = 'grammar' | 'pattern' | 'chunk' | 'lexeme' | 'contrast' | 'cando';
export const NODE_PREFIX: Record<NodeKind, string> = { grammar: 'g:', pattern: 'p:', chunk: 'c:', lexeme: 'l:', contrast: 'x:', cando: 'd:' };

/** A graph node as stored in content/graph/*.json (fields the library reads; the rest pass through). */
export interface GraphNode {
  id: string;
  kind: NodeKind;
  band?: string;
  priority?: number;
  title?: string;
  es?: string;
  en?: string;
  requires?: string[];
  contrasts?: string[];
  unpacks?: string;
  serves?: string[];
  match?: string[];
  forms?: Array<{ es: string; en: string }>;
  pos?: string;
  gender?: string;
  [k: string]: unknown;
}

export interface Graph {
  nodes: Map<string, GraphNode>;
  ids: Set<string>;
}

/** Build a graph from node arrays (one per file, or one flat array). Later duplicates of an id win. */
export function loadGraph(files: ReadonlyArray<GraphNode> | ReadonlyArray<ReadonlyArray<GraphNode>>): Graph {
  const nodes = new Map<string, GraphNode>();
  for (const f of files as ReadonlyArray<GraphNode | ReadonlyArray<GraphNode>>) {
    if (Array.isArray(f)) for (const n of f as GraphNode[]) nodes.set(n.id, n);
    else nodes.set((f as GraphNode).id, f as GraphNode);
  }
  return { nodes, ids: new Set(nodes.keys()) };
}

export function nodesByKind(g: Graph, kind: NodeKind): GraphNode[] {
  const out: GraphNode[] = [];
  for (const n of g.nodes.values()) if (n.kind === kind) out.push(n);
  return out;
}

/** Direct prerequisites of a node (empty for an unknown id). */
export function requiresOf(g: Graph, id: string): string[] {
  return g.nodes.get(id)?.requires ?? [];
}

/** Every node `id` transitively requires (not `id` itself), in discovery order; cycle-safe. */
export function ancestors(g: Graph, id: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const stack = [...requiresOf(g, id)].reverse();
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n) || n === id) continue;
    seen.add(n); out.push(n);
    const r = requiresOf(g, n);
    for (let i = r.length - 1; i >= 0; i--) stack.push(r[i]);
  }
  return out;
}

/** Position (0-based) in `order` at which each node is first taught. A taught chunk also
 *  teaches the grammar node it `unpacks`, as the rebuild's gate holds it. */
export function taughtAt(g: Graph, order: readonly string[]): Map<string, number> {
  const at = new Map<string, number>();
  const teach = (id: string, i: number) => { if (!at.has(id)) at.set(id, i); };
  order.forEach((id, i) => {
    teach(id, i);
    const u = g.nodes.get(id)?.unpacks;
    if (u) teach(u, i);
  });
  return at;
}

/** The ids taught by position `upTo` (inclusive; default the whole order). */
export function taughtBy(g: Graph, order: readonly string[], upTo = order.length - 1): Set<string> {
  const out = new Set<string>();
  for (const [id, i] of taughtAt(g, order)) if (i <= upTo) out.add(id);
  return out;
}

/** The ids in `requires` that `order` teaches only after position `upTo`. Lexemes, ids the graph
 *  does not know and nodes `order` never teaches are not held against a row (the gate's rule). */
export function lateRequires(g: Graph, order: readonly string[], requires: readonly string[], upTo: number): string[] {
  const at = taughtAt(g, order);
  return requires.filter((r) => {
    const n = g.nodes.get(r);
    if (!n || n.kind === 'lexeme') return false;
    const t = at.get(r);
    return t !== undefined && t > upTo;
  });
}

/** A chunk's tagger spec: `es`, every aligned form's Spanish and every `match` surface are
 *  "/" alternatives; a two-turn form's turns are joined as reply turns ("A — B"). */
export function chunkSpec(n: Pick<GraphNode, 'id' | 'es' | 'forms' | 'match' | 'unpacks'> & { priority?: number }): ChunkSpec {
  const alts = [n.es ?? '', ...(n.forms ?? []).map((f) => f.es), ...(n.match ?? [])].map((x) => x.replace(/\s*\n\s*/g, ' — ').trim()).filter(Boolean);
  return { id: n.id, es: [...new Set(alts)].join(' / '), ...(n.unpacks ? { unpacks: n.unpacks } : {}), ...(n.priority !== undefined ? { priority: n.priority } : {}) };
}

const EN_STOP = new Set('the a an and but or so if when while this that these those he she it they we you i his her its their our my your in on at to of for with by from as is was are were be has had have do did not no yes then there here what who why how after before during until since because although though once each every all some one two three week day month year first last next new old'.split(' '));
/** Capitalised words inside English story-arc prose that are not sentence words: the cast and places. */
export function castNames(text: string): string[] {
  const out = new Map<string, number>();
  for (const m of text.matchAll(/(?:^|(?<![.!?])\s)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/g)) {
    const w = m[1].toLowerCase();
    if (EN_STOP.has(w) || closedClass(w)) continue;
    out.set(w, (out.get(w) ?? 0) + 1);
  }
  return [...out.keys()];
}

export interface TagOptionsInput {
  /** content/graph/_featuremap.json, when the content has one (the rebuild's graph has none). */
  featureMap?: Record<string, string | null>;
  /** Names to register (the cast): from `castNames(storyArcs.join(' '))`, or given directly. */
  names?: Iterable<string>;
}

/** The options the rebuild's gate tags with (app/tools/gate/load.ts buildCurriculum):
 *  chunks (kind chunk with `es`), patterns (kind pattern, with `match`), graphIds, featureMap.
 *  SIDE EFFECT: registers the graph's lexeme nodes (and `names`) with the tagger's lexicon,
 *  which is module state, exactly as the gate does. Calling again with a different graph adds. */
export function tagOptions(g: Graph, o: TagOptionsInput = {}): TagOptions {
  const all = [...g.nodes.values()];
  registerLexemes(all.filter((n) => n.kind === 'lexeme').map((n) => ({ lemma: n.id.replace(/^l:/, '').replace(/#.*/, ''), pos: n.pos, gender: n.gender })));
  if (o.names) registerNames(o.names);
  const chunks: ChunkSpec[] = all.filter((n) => n.kind === 'chunk' && n.es).map(chunkSpec);
  const patterns: PatternSpec[] = all.filter((n) => n.kind === 'pattern').map((n) => ({ id: n.id, ...(n.match ? { match: n.match } : {}) }));
  return { graphIds: new Set(g.ids), featureMap: o.featureMap, chunks, patterns };
}
