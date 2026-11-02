// The content kinds are listed once (src/content/kinds.ts), and the service worker's idea of them
// is built from that list (tools/build/pwa.ts). The trap this guards (audit 2.19): a chunk from a
// folder the config does not name lands in assets/, which the precache takes whole, so a new
// content/<folder>/ would silently put its entire library in the install.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_KINDS, contentDirs, kindOfFile, unregistered } from '../../src/content/kinds';
import { CONTENT_FILES } from '../../src/ui/data/loader';
import { kindOf } from '../../tools/gate/extract';
import { chunkFileName, contentCache, precacheGlobs } from '../../tools/build/pwa';

const APP = join(__dirname, '../..');
const CONTENT = join(APP, 'content');
/** The folders of course material: every folder under content/ that is not an underscore one (the derived and private ones). */
const realDirs = () => readdirSync(CONTENT).filter((d) => !d.startsWith('_') && !d.startsWith('.') && statSync(join(CONTENT, d)).isDirectory());

describe('the content kinds registry', () => {
  it('names every folder of course material under content/', () => {
    expect(unregistered(realDirs())).toEqual([]);
  });

  it('names a folder nobody registered, so a new one cannot land quietly', () => {
    expect(unregistered([...realDirs(), 'reading', 'accept'])).toEqual(['reading', 'accept']);
  });

  it('is the list the loader has a glob for, kind for kind', () => {
    // history, the library and the pitfalls are derived and imported on their own, from folders that begin with an underscore
    const globbed = Object.keys(CONTENT_FILES).filter((k) => k !== 'history' && k !== 'library' && k !== 'pitfalls').sort();
    expect(globbed).toEqual([...contentDirs()].sort());
  });

  it('is the list the gate reads a folder by', () => {
    for (const k of CONTENT_KINDS) {
      const first = readdirSync(join(CONTENT, k.dir)).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort()[0];
      expect(kindOf(join(CONTENT, k.dir, first)), k.dir).toBe(k.kind);
      expect(kindOfFile(join(CONTENT, k.dir, first)), k.dir).toBe(k.kind);
    }
  });
});

describe('every content folder is cached when it is used, and none is installed whole by accident', () => {
  const chunk = (dir: string) => chunkFileName({ facadeModuleId: `/Users/x/app/content/${dir}/some-file.json` });
  const rule = contentCache();

  it('puts a chunk of each kind under content/<kind>/, never in assets/', () => {
    for (const d of contentDirs()) expect(chunk(d), d).toMatch(new RegExp(`^content/${d}/\\[name\\]-\\[hash\\]\\.js$`));
  });

  it('caches a chunk of each kind on first use, at the site root and under a base path', () => {
    for (const d of contentDirs()) {
      for (const base of ['/', '/fluidez-next/']) {
        const url = new URL(`https://example.org${base}content/${d}/some-file-AbC123xy.js`);
        expect(rule.urlPattern({ url }), `${d} at ${base}`).toBe(true);
      }
    }
    expect(rule.urlPattern({ url: new URL('https://example.org/assets/index-AbC123xy.js') })).toBe(false);
    expect(rule.handler).toBe('CacheFirst');
  });

  it('a folder the registry lacks would be built into assets/, which is why the registry is checked', () => {
    expect(chunk('reading')).toMatch(/^assets\//);
    expect(rule.urlPattern({ url: new URL('https://example.org/content/reading/r-AbC123xy.js') })).toBe(false);
  });

  it('precaches the graph, the units and the contrast scripts whole, and no other folder', () => {
    const globs = precacheGlobs();
    // a folder-wide pattern is a bare * or a name prefix then * (x_*.js); a named one carries a unit, a chapter or a node (u01-*.js)
    const whole = globs.filter((g) => /^content\/[^/]+\/[A-Za-z_]*\*\.js$/.test(g)).sort();
    expect(whole).toEqual(['content/graph/*.js', 'content/scripts/x_*.js', 'content/units/*.js']);
    // the window kinds appear only by name (one unit, one chapter, one script), never as a folder-wide pattern
    for (const d of ['bank', 'story', 'scenes', 'writing']) expect(globs, d).not.toContain(`content/${d}/*.js`);
  });

  it('is what vite.config.ts uses', () => {
    const config = readFileSync(join(APP, 'vite.config.ts'), 'utf8');
    expect(config).toMatch(/chunkFileNames:\s*chunkFileName\b/);
    expect(config).toMatch(/workbox:\s*workboxOptions\(\)/);
    expect(config).not.toMatch(/\(bank\|scripts\|story/);
  });
});
