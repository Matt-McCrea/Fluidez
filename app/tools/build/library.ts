// npm run library
//
// Writes content/_library/library.json: metadata for every chapter of the story, derived from
// content/story (src/content/library.ts says what is in it and why). The app imports it on its own
// as part of the core bundle; the gate fails a library that a chapter has gone stale under; the
// build writes it again before it builds, so what ships is always what the story files say.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { dirOf } from '../../src/content/kinds';
import { Library, libraryOf } from '../../src/content/library';
import { StoryChapter } from '../../src/content/schema';
import type { Finding } from '../gate/findings';

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const LIBRARY_DIR = '_library';
export const libraryFile = (contentDir: string): string => join(contentDir, LIBRARY_DIR, 'library.json');

/** The library the story files make. A chapter that does not read against its schema is left out, as the app would leave it out. */
export function buildLibrary(contentDir: string): Library {
  const dir = join(contentDir, dirOf('story'));
  const chapters = existsSync(dir)
    ? readdirSync(dir).filter((f) => /^ch\d{3}\.json$/.test(f)).sort().flatMap((f) => {
      const r = StoryChapter.safeParse(JSON.parse(readFileSync(join(dir, f), 'utf8')));
      return r.success ? [r.data] : [];
    })
    : [];
  return libraryOf(chapters);
}

/** One chapter to a line, so a chapter added or changed is one line of a diff. */
export function serializeLibrary(lib: Library): string {
  const rows = lib.chapters.map((c) => `  ${JSON.stringify(c)}`).join(',\n');
  return `{\n "version": ${lib.version},\n "about": ${JSON.stringify(lib.about)},\n "chapters": [\n${rows}\n ]\n}\n`;
}

/** The library on disk; undefined when the course has none. Throws when there is one that cannot be read. */
export function readLibrary(contentDir: string): Library | undefined {
  const file = libraryFile(contentDir);
  return existsSync(file) ? Library.parse(JSON.parse(readFileSync(file, 'utf8'))) : undefined;
}

/** The gate's check: a library that is there must be what the story files make. A course with none is not checked. */
export function checkLibrary(contentDir: string): Finding[] {
  const file = `content/${LIBRARY_DIR}/library.json`;
  if (!existsSync(libraryFile(contentDir))) return [];
  let kept: Library | undefined;
  try { kept = readLibrary(contentDir); } catch (e) {
    return [{ severity: 'error', check: 'library', file, problem: `the library cannot be read: ${(e as Error).message}`, fix: 'npm run library writes it again' }];
  }
  if (isDeepStrictEqual(kept, buildLibrary(contentDir))) return [];
  return [{ severity: 'error', check: 'library', file, problem: 'the library does not match content/story: a chapter was added, changed or removed since it was written', fix: 'npm run library writes it again' }];
}

function main(): void {
  const content = join(APP_DIR, 'content');
  const lib = buildLibrary(content);
  mkdirSync(join(content, LIBRARY_DIR), { recursive: true });
  const text = serializeLibrary(lib);
  const file = libraryFile(content);
  if (!existsSync(file) || readFileSync(file, 'utf8') !== text) writeFileSync(file, text);
  console.log(`library: ${lib.chapters.length} chapters`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
