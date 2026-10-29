// Load the real content tree (app/content/*) into the compiler's shapes.
// Tolerant of file layout: a file may hold one object, an array, or an object
// with one array-valued field (e.g. { nodes: [...] }, { sentences: [...] }).
// Files that do not parse against the schema are skipped and counted, never
// silently "fixed": the gate is the authority on content validity.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { z } from 'zod';
import {
  BankSentence, GraphNode, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../../src/content/schema';
import type { ContentSource } from '../../src/compiler';

export interface LoadedContent {
  units: Unit[];
  nodes: GraphNode[];
  source: ContentSource;
  problems: string[];
}

function jsonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('_') || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...jsonFiles(p));
    else if (name.endsWith('.json')) out.push(p);
  }
  return out;
}

function records(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    const arrays = Object.values(raw as Record<string, unknown>).filter(Array.isArray);
    if (!('id' in (raw as object)) && !('node' in (raw as object)) && arrays.length === 1) return arrays[0] as unknown[];
    return [raw];
  }
  return [];
}

function load<T extends z.ZodTypeAny>(dir: string, schema: T, problems: string[], keepExtra = false): z.infer<T>[] {
  const out: z.infer<T>[] = [];
  for (const f of jsonFiles(dir)) {
    let raw: unknown;
    try { raw = JSON.parse(readFileSync(f, 'utf8')); } catch (e) { problems.push(`${f}: ${(e as Error).message}`); continue; }
    for (const rec of records(raw)) {
      const r = schema.safeParse(rec);
      if (r.success) out.push((keepExtra ? { ...(rec as object), ...(r.data as object) } : r.data) as z.infer<T>);
      else problems.push(`${f}: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
    }
  }
  return out;
}

export function loadContent(contentDir: string): LoadedContent {
  const problems: string[] = [];
  const units = load(join(contentDir, 'units'), Unit, problems);
  const nodes = load(join(contentDir, 'graph'), GraphNode, problems);
  const sentences = load(join(contentDir, 'bank'), BankSentence, problems);
  // keepExtra: chapters/scenes/tasks may carry tagger `requires` beyond the schema
  const chapters = load(join(contentDir, 'story'), StoryChapter, problems, true);
  const scenes = load(join(contentDir, 'scenes'), Scene, problems, true);
  const writing = load(join(contentDir, 'writing'), WritingTask, problems, true);
  const scripts = load(join(contentDir, 'scripts'), TeachingScript, problems);
  return { units, nodes, source: { sentences, chapters, scenes, writing, scripts }, problems };
}

/**
 * The app's own loader (`ContentLoader`, the same Vite glob over app/content) for bands A1 and A2: real
 * sentences, scripts, chapters, scenes and writing tasks. Only units of the loaded bands that have bank sentences are kept, so the
 * course ends where the content does (maintenance sessions after). Needs Vite's `import.meta.glob`, so
 * `npm run simulate` runs under vite-node.
 */
export async function loadRealBundle(bands: Array<'A1' | 'A2'> = ['A1', 'A2'], maxUnits?: number): Promise<{ units: Unit[]; nodes: GraphNode[]; source: ContentSource; problems: string[] }> {
  const { ContentLoader } = await import('../../src/ui/data/loader');
  const loader = new ContentLoader();
  const top = bands.includes('A2') ? 'A2' : 'A1';
  const bundle = await loader.load({ band: top, lookahead: false });
  // units with bank content only (a unit the burn has not reached would be all shortage)
  const withBank = new Set(bundle.source.sentences.map((x) => x.unit));
  let units = bundle.units.filter((u) => (bands as string[]).includes(u.band) && withBank.has(u.id));
  if (maxUnits) units = units.slice(0, maxUnits);
  return { units, nodes: [...bundle.course.nodes.values()], source: bundle.source, problems: loader.problems };
}
