// Content loading for the browser. Every JSON file under app/content is a
// lazy Vite glob import (its own chunk, precached by the service worker), so
// the app ships one build that works offline and only parses what it needs:
// the graph and units always, the bank/story/scenes/writing/scripts of the
// bands the learner has reached (plus the next one). Empty directories are
// fine. Records that do not parse against the schema are skipped and counted
// (the gate is the authority on content; the UI never "fixes" content).
import type { z } from 'zod';
import type { ContentSource } from '../../compiler';
import {
  Band, BankSentence, GraphNode, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../../content/schema';
import { Bundle } from './bundle';

export type FileLoader = () => Promise<unknown>;
export type FileMap = Record<string, FileLoader>;

export interface ContentFiles {
  graph: FileMap;
  units: FileMap;
  bank: FileMap;
  scripts: FileMap;
  story: FileMap;
  scenes: FileMap;
  writing: FileMap;
}

/** The real content tree. Files and folders starting with `_` are ignored. */
export const CONTENT_FILES: ContentFiles = {
  graph: import.meta.glob(['/content/graph/**/*.json', '/content/vocab/**/*.json', '!**/_*'], { import: 'default' }),
  units: import.meta.glob(['/content/units/**/*.json', '!**/_*'], { import: 'default' }),
  bank: import.meta.glob(['/content/bank/**/*.json', '!**/_*'], { import: 'default' }),
  scripts: import.meta.glob(['/content/scripts/**/*.json', '!**/_*'], { import: 'default' }),
  story: import.meta.glob(['/content/story/**/*.json', '!**/_*'], { import: 'default' }),
  scenes: import.meta.glob(['/content/scenes/**/*.json', '!**/_*'], { import: 'default' }),
  writing: import.meta.glob(['/content/writing/**/*.json', '!**/_*'], { import: 'default' }),
};

const BANDS = Band.options;

/** A file may hold one record, an array, or an object with one array-valued field. */
export function records(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    const arrays = Object.values(raw as Record<string, unknown>).filter(Array.isArray);
    if (!('id' in (raw as object)) && !('node' in (raw as object)) && arrays.length === 1) return arrays[0] as unknown[];
    return [raw];
  }
  return [];
}

function parseAll<T extends z.ZodTypeAny>(raws: unknown[], schema: T, problems: string[], file: string, keepExtra = false): z.infer<T>[] {
  const out: z.infer<T>[] = [];
  for (const raw of raws) {
    for (const rec of records(raw)) {
      const r = schema.safeParse(rec);
      if (r.success) out.push((keepExtra ? { ...(rec as object), ...(r.data as object) } : r.data) as z.infer<T>);
      else problems.push(`${file}: ${r.error.issues[0]?.path.join('.')} ${r.error.issues[0]?.message}`);
    }
  }
  return out;
}

/** The band a content file belongs to, from a unit id or a band name in its path; undefined = every band. */
export function fileBand(path: string, unitBand: ReadonlyMap<string, Band>): Band | undefined {
  const u = path.match(/\b(u\d{2})\b/);
  if (u && unitBand.has(u[1])) return unitBand.get(u[1]);
  const b = path.match(/(?:^|[/_-])(A1|A2|B1|B2|C1)(?:[/_.-]|$)/i);
  return b ? (b[1].toUpperCase() as Band) : undefined;
}

export interface LoadOptions {
  /** Load content for bands up to and including this one (default: every band). */
  band?: Band;
  /** Also load the band after `band` (so the next unit's content is ready offline). Default true. */
  lookahead?: boolean;
}

export class ContentLoader {
  private units?: Unit[];
  private nodes?: GraphNode[];
  private readonly loaded = new Set<string>();
  private readonly src: ContentSource = { sentences: [], chapters: [], scenes: [], writing: [], scripts: [] };
  readonly problems: string[] = [];

  constructor(private readonly files: ContentFiles = CONTENT_FILES) {}

  private async read(map: FileMap, path: string): Promise<unknown> {
    try { return await map[path](); } catch (e) { this.problems.push(`${path}: ${(e as Error).message}`); return undefined; }
  }

  /** Graph + units: always needed (titles, the course order). */
  async core(): Promise<{ units: Unit[]; nodes: GraphNode[] }> {
    if (!this.units || !this.nodes) {
      const unitPaths = Object.keys(this.files.units).sort();
      const graphPaths = Object.keys(this.files.graph).sort();
      const [unitRaw, graphRaw] = await Promise.all([
        Promise.all(unitPaths.map((p) => this.read(this.files.units, p))),
        Promise.all(graphPaths.map((p) => this.read(this.files.graph, p))),
      ]);
      this.units = unitPaths.flatMap((p, i) => parseAll([unitRaw[i]], Unit, this.problems, p));
      const seen = new Set<string>();
      this.nodes = graphPaths.flatMap((p, i) => parseAll([graphRaw[i]], GraphNode, this.problems, p))
        .filter((n) => (seen.has(n.id) ? false : (seen.add(n.id), true)));
    }
    return { units: this.units, nodes: this.nodes };
  }

  /** Load (once) every content file for the bands asked for, and return a fresh bundle. */
  async load(opts: LoadOptions = {}): Promise<Bundle> {
    const { units, nodes } = await this.core();
    const unitBand = new Map(units.map((u) => [u.id, u.band]));
    let maxIdx = BANDS.length - 1;
    if (opts.band) maxIdx = Math.min(BANDS.length - 1, BANDS.indexOf(opts.band) + (opts.lookahead === false ? 0 : 1));
    const want = (p: string) => {
      const b = fileBand(p, unitBand);
      return b === undefined || BANDS.indexOf(b) <= maxIdx;
    };
    const kinds: Array<[keyof ContentFiles, (raw: unknown, p: string) => void]> = [
      ['bank', (raw, p) => this.src.sentences.push(...parseAll([raw], BankSentence, this.problems, p))],
      ['scripts', (raw, p) => this.src.scripts.push(...parseAll([raw], TeachingScript, this.problems, p))],
      ['story', (raw, p) => this.src.chapters.push(...parseAll([raw], StoryChapter, this.problems, p, true))],
      ['scenes', (raw, p) => this.src.scenes.push(...parseAll([raw], Scene, this.problems, p, true))],
      ['writing', (raw, p) => this.src.writing.push(...parseAll([raw], WritingTask, this.problems, p, true))],
    ];
    await Promise.all(kinds.map(async ([kind, add]) => {
      const paths = Object.keys(this.files[kind]).sort().filter((p) => want(p) && !this.loaded.has(p));
      const raws = await Promise.all(paths.map((p) => this.read(this.files[kind], p)));
      paths.forEach((p, i) => { this.loaded.add(p); if (raws[i] !== undefined) add(raws[i], p); });
    }));
    // keep file order stable regardless of which band arrived first
    return new Bundle(units, nodes, {
      sentences: [...this.src.sentences], chapters: [...this.src.chapters], scenes: [...this.src.scenes],
      writing: [...this.src.writing], scripts: [...this.src.scripts],
    });
  }
}

/** The fixture set as a bundle (dynamic import: it is its own chunk). */
export async function fixtureBundle(): Promise<Bundle> {
  const { fixtureContent } = await import('../fixtures');
  const f = fixtureContent();
  return new Bundle(f.units, f.nodes, f.source, true);
}

const FIXTURE_KEY = 'fluidez.fixtures';

/** `?fixtures=force` (remembered): the fixture set even when real content exists (e2e, demos). */
export function fixturesForced(): boolean {
  try {
    const q = new URLSearchParams(globalThis.location?.search ?? '').get('fixtures');
    if (q === 'force') globalThis.localStorage?.setItem(FIXTURE_KEY, 'force');
    return globalThis.localStorage?.getItem(FIXTURE_KEY) === 'force';
  } catch { return false; }
}

/**
 * The dev flag: fixtures are used only when the real bank is empty AND one of
 * these holds: a dev server, a build with VITE_FIXTURES=1, or `?fixtures=1`
 * once in the URL (remembered; `?fixtures=0` forgets it).
 */
export function fixturesEnabled(): boolean {
  try {
    const q = new URLSearchParams(globalThis.location?.search ?? '').get('fixtures');
    if (q === '1') globalThis.localStorage?.setItem(FIXTURE_KEY, '1');
    if (q === 'force') return true;
    if (q === '0') { globalThis.localStorage?.removeItem(FIXTURE_KEY); return false; }
  } catch { /* storage blocked */ }
  if (import.meta.env?.VITE_FIXTURES === '1' || import.meta.env?.DEV) return true;
  try { const v = globalThis.localStorage?.getItem(FIXTURE_KEY); return v === '1' || v === 'force'; } catch { return false; }
}

/**
 * Load what the learner needs. Real content when the bank has anything in it;
 * otherwise the fixture set when the dev flag allows; otherwise the real (thin)
 * content, so the app still runs on graph + units alone.
 */
export async function loadBundle(loader: ContentLoader, opts: LoadOptions & { fixtures?: boolean } = {}): Promise<Bundle> {
  if (opts.fixtures === undefined && fixturesForced()) return fixtureBundle();
  const real = await loader.load(opts);
  if (real.empty && (opts.fixtures ?? fixturesEnabled())) return fixtureBundle();
  return real;
}
