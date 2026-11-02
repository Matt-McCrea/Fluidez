// The kinds of course material, listed once. Every folder under app/content that holds lessons is
// here, and everything that has to know the list reads it from here: the gate (what a file is),
// the simulator, the loader's tests, and the service worker's caching in vite.config.ts (via
// tools/build/pwa.ts). Folders starting with `_` are not material (migrations, the shipped
// snapshot, the derived library, the burn's queue) and are never listed.
//
// A new folder is added here, once, and a test fails until it is: a chunk from a folder the build
// config does not name lands in assets/, which the precache takes whole, so a folder missing from
// this list would install its entire contents on every device.
//
// The loader's `import.meta.glob` calls stay literal (Vite reads them as text), so a test holds
// ContentFiles to this list instead.

export interface ContentKindSpec {
  /** the folder under content/ */
  readonly dir: string;
  /** what the gate calls one file of it */
  readonly kind: 'graph' | 'unit' | 'bank' | 'script' | 'contrast' | 'story' | 'scene' | 'writing';
  /** core: read at boot, whole, and installed with the app. window: fetched with the units around the learner and cached when first used */
  readonly load: 'core' | 'window';
  /** the names of the files that are material; other files in the folder are not */
  readonly file?: RegExp;
  /** of a window kind, the files whose names start with this are core all the same: read at boot and installed (a contrast's script is reviewed wherever the learner is) */
  readonly corePrefix?: string;
}

export const CONTENT_KINDS = [
  { dir: 'graph', kind: 'graph', load: 'core' },
  { dir: 'units', kind: 'unit', load: 'core', file: /^u\d{2}\.json$/ },
  { dir: 'bank', kind: 'bank', load: 'window' },
  { dir: 'scripts', kind: 'script', load: 'window', corePrefix: 'x_' },
  // a contrast comes due wherever the learner is, so its items are read with the course and installed with the app, one file for each contrast
  { dir: 'contrasts', kind: 'contrast', load: 'core', file: /^x_[^/]+\.json$/ },
  { dir: 'story', kind: 'story', load: 'window', file: /^ch\d{3}\.json$/ },
  { dir: 'scenes', kind: 'scene', load: 'window' },
  { dir: 'writing', kind: 'writing', load: 'window' },
] as const satisfies readonly ContentKindSpec[];

export type ContentDir = (typeof CONTENT_KINDS)[number]['dir'];
export type ContentKind = (typeof CONTENT_KINDS)[number]['kind'];

/** The folders, in registry order. */
export const contentDirs = (): ContentDir[] => CONTENT_KINDS.map((k) => k.dir);

/** The folder a kind lives in. */
export const dirOf = (kind: ContentKind): ContentDir => CONTENT_KINDS.find((k) => k.kind === kind)!.dir;

const specs: readonly ContentKindSpec[] = CONTENT_KINDS;
const base = (p: string) => p.replace(/^.*\//, '');
const parent = (p: string) => base(p.replace(/\/[^/]*$/, ''));

/** What a content file is, by its folder and name; undefined for anything that is not material (a private file, an unlisted folder, a stray name). */
export function kindOfFile(file: string): ContentKind | undefined {
  const name = base(file);
  if (name.startsWith('_')) return undefined;
  const spec = specs.find((k) => k.dir === parent(file));
  return spec && (!spec.file || spec.file.test(name)) ? spec.kind : undefined;
}

/** Whether a file of a window kind is core all the same (read at boot, installed with the app). */
export function isCoreFile(dir: string, name: string): boolean {
  const spec = specs.find((k) => k.dir === dir);
  return !!spec && (spec.load === 'core' || (!!spec.corePrefix && name.startsWith(spec.corePrefix)));
}

/** The folders among `dirs` that are not registered: material the build config would not know how to cache. */
export function unregistered(dirs: readonly string[]): string[] {
  const known = new Set<string>(contentDirs());
  return dirs.filter((d) => !known.has(d));
}

/**
 * Names a file of the course by what it is for, the way the loader says what it could not get and the
 * compiler asks whether it is there: the unit for a bank, scene or writing file, the node for a script,
 * the chapter for a chapter.
 */
export const lackKey = (dir: ContentDir, id: string): string => `${dir}:${id}`;

/** Whether what is lacking is the course itself: with a unit gone, every unit after it is a place off and no day can be trusted. */
export const lacksCourse = (key: string): boolean => key.startsWith('units:') || key.startsWith('graph:');
