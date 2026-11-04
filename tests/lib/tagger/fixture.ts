// Test fixture: the rebuild's real curriculum, read from app/ at test time (the library never reads app/).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { castNames, loadGraph, tagOptions, type GraphNode } from '../../../lib/graph';

export const APP_DIR = join(__dirname, '../../../app');
export const GRAPH_DIR = join(APP_DIR, 'content/graph');

export function readGraphFiles(): GraphNode[][] {
  return readdirSync(GRAPH_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort()
    .map((f) => JSON.parse(readFileSync(join(GRAPH_DIR, f), 'utf8')) as GraphNode[]);
}
interface Unit { id: string; storyArc?: string; days: Array<{ focus: string[]; chunks: string[]; lexemes: string[] }> }
export function readUnits(): Unit[] {
  const dir = join(APP_DIR, 'content/units');
  return readdirSync(dir).filter((f) => /^u\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as Unit);
}
export function readFeatureMap(): Record<string, string | null> | undefined {
  const p = join(GRAPH_DIR, '_featuremap.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : undefined;
}

/** The curriculum as the rebuild's gate builds it (tools/gate/load.ts buildCurriculum), reduced to what the tests use. */
export function loadCurriculum() {
  const graph = loadGraph(readGraphFiles());
  const units = readUnits();
  const tagOpts = tagOptions(graph, { featureMap: readFeatureMap(), names: castNames(units.map((u) => u.storyArc ?? '').join(' ')) });
  const taughtAt = new Map<string, number>();
  let s = 0;
  const teach = (id: string, at: number) => { if (!taughtAt.has(id) || taughtAt.get(id)! > at) taughtAt.set(id, at); };
  for (const u of units) for (const d of u.days) { s++; for (const id of [...d.focus, ...d.chunks, ...d.lexemes]) teach(id, s); }
  for (const n of graph.nodes.values()) {
    if (n.kind === 'lexeme' && units.length) { const t = taughtAt.get(n.id); const p = n.priority ?? 0; if (t !== undefined && p >= 1 && p < t) taughtAt.set(n.id, p); }
  }
  for (const n of graph.nodes.values()) if (!taughtAt.has(n.id) && units.length) taughtAt.set(n.id, Math.max(1, n.priority ?? 0));
  return { graph, nodes: graph.nodes, graphIds: graph.ids, taughtAt, tagOpts };
}
