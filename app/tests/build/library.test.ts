// The library: chapter metadata for the whole story, derived from content/story and shipped with the
// app, because the compiler and the screens see only what the tab happened to load (audit C4, F8).
// It holds what a screen or the compiler's ordering needs and nothing that makes it heavy: no text,
// no `requires` (219 chapters of requires is about 300 KB).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { Library } from '../../src/content/library';
import { CONTENT_FILES, ContentLoader } from '../../src/ui/data/loader';
import { buildLibrary, checkLibrary, libraryFile, readLibrary, serializeLibrary } from '../../tools/build/library';
import { runGate } from '../../tools/gate';
import { makeFixture } from '../gate/fixture';

const CONTENT = join(__dirname, '../../content');

describe('the shipped library', () => {
  it('is what the story files say, so a chapter written since is not missing from it', () => {
    const made = buildLibrary(CONTENT);
    const kept = readLibrary(CONTENT);
    expect(kept, 'content/_library/library.json is missing: npm run library').toBeDefined();
    expect(kept).toEqual(made);
    expect(checkLibrary(CONTENT)).toEqual([]);
  });

  it('lists every chapter in story order, with the facts a screen shows and no more', () => {
    const lib = readLibrary(CONTENT)!;
    expect(lib.chapters).toHaveLength(219);
    expect(lib.chapters.map((c) => c.id)).toEqual(lib.chapters.map((c) => c.id).slice().sort());
    for (const c of lib.chapters) {
      expect(Object.keys(c).sort()).toEqual(['hook', 'id', 'questions', 'title', 'unit', 'words']);
      expect(c.hook.length, c.id).toBeGreaterThan(20);
      expect(c.words, c.id).toBeGreaterThan(30);
    }
    // metadata, not content: the file stays small enough for the core bundle
    expect(Buffer.byteLength(serializeLibrary(lib))).toBeLessThan(80_000);
    expect(Library.safeParse(JSON.parse(serializeLibrary(lib))).success).toBe(true);
  });

  it('counts words the way the reading screens do, so a list and a chapter agree', () => {
    const lib = readLibrary(CONTENT)!;
    for (const c of lib.chapters) {
      const text = (JSON.parse(readFileSync(join(CONTENT, 'story', `${c.id}.json`), 'utf8')) as { text: string }).text;
      expect(c.words, c.id).toBe((text.match(/\p{L}+/gu) ?? []).length);
    }
  });

  it('is imported on its own, since no loader glob covers an underscore folder', () => {
    expect(Object.keys(CONTENT_FILES.library ?? {}).length).toBeGreaterThan(0);
  });

  it('reaches the bundle whole, whatever window was loaded', async () => {
    const b = await new ContentLoader().load({ unit: 30 });
    expect(b.library).toHaveLength(219);
    // the window holds a few units of chapter text; the library names all of them
    expect(b.chapters.size).toBeLessThan(40);
    expect(b.library.find((c) => c.id === 'ch001')).toMatchObject({ unit: 'u01', title: 'Hola, Bogotá' });
  }, 120_000);
});

describe('the gate and the library', () => {
  const made: string[] = [];
  afterEach(() => { for (const d of made.splice(0)) rmSync(d, { recursive: true, force: true }); });

  /** A content tree of one unit and two chapters, with the library the tool would write for it. */
  function tree() {
    const fx = makeFixture();
    made.push(fx.app);
    const chapter = (n: number, title: string) => ({
      id: `ch00${n}`, unit: 'u01', title, text: 'Tomás llega al café. Vale lo mira y sonríe.', gloss: [],
      questions: [{ q: 'q1', options: ['a', 'b'], answer: 0 }, { q: 'q2', options: ['a', 'b'], answer: 0 }, { q: 'q3', options: ['a', 'b'], answer: 1 }],
      hook: 'Mañana todo cambia en el café de Rosa, y nadie lo sabe todavía.',
    });
    fx.write('story/ch001.json', chapter(1, 'Uno'));
    fx.write('story/ch002.json', chapter(2, 'Dos'));
    return fx;
  }

  it('says nothing about a course that has no library', () => {
    const fx = tree();
    expect(checkLibrary(fx.content)).toEqual([]);
  });

  it('is current once the tool has written it', () => {
    const fx = tree();
    mkdirSync(join(fx.content, '_library'), { recursive: true });
    writeFileSync(libraryFile(fx.content), serializeLibrary(buildLibrary(fx.content)));
    expect(checkLibrary(fx.content)).toEqual([]);
  });

  it('fails a library a chapter has gone stale under, and says how to mend it', () => {
    const fx = tree();
    mkdirSync(join(fx.content, '_library'), { recursive: true });
    writeFileSync(libraryFile(fx.content), serializeLibrary(buildLibrary(fx.content)));
    fx.write('story/ch003.json', { ...JSON.parse(readFileSync(join(fx.content, 'story/ch001.json'), 'utf8')), id: 'ch003', title: 'Tres' });
    const found = checkLibrary(fx.content);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ severity: 'error', check: 'library', file: 'content/_library/library.json' });
    expect(found[0].fix).toMatch(/npm run library/);
  });

  it('fails a library that cannot be read', () => {
    const fx = tree();
    mkdirSync(join(fx.content, '_library'), { recursive: true });
    writeFileSync(libraryFile(fx.content), '{ not json');
    expect(checkLibrary(fx.content)[0]).toMatchObject({ severity: 'error', check: 'library' });
  });

  it('is part of the whole gate, and the gate does not read the derived file as course material', () => {
    const fx = tree();
    mkdirSync(join(fx.content, '_library'), { recursive: true });
    writeFileSync(libraryFile(fx.content), serializeLibrary({ ...buildLibrary(fx.content), chapters: [] }));
    const r = runGate({ appDir: fx.app });
    expect(r.findings.filter((f) => f.check === 'library')).toHaveLength(1);
    writeFileSync(libraryFile(fx.content), serializeLibrary(buildLibrary(fx.content)));
    const ok = runGate({ appDir: fx.app });
    expect(ok.findings.filter((f) => f.check === 'library')).toEqual([]);
    expect(ok.findings.filter((f) => f.file.includes('_library'))).toEqual([]);
  });
});
