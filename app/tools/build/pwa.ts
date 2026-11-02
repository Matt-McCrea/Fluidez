// What the service worker installs and caches, and where the build puts each kind of content chunk,
// both made from the kinds registry (src/content/kinds.ts) so that a folder cannot be added to the
// course without the build knowing it. vite.config.ts only calls these.
//
// Content chunks live under content/<kind>/, which is how the service worker tells them from the app
// shell. Installed with the app: the shell, the graph, the unit files, the contrast scripts and the
// first window of units (FIRST_WINDOW). Every other content chunk is cached on first use (cache-first)
// and then works offline.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT_KINDS, contentDirs, type ContentKindSpec } from '../../src/content/kinds';

export const FIRST_WINDOW = 4;

/** The chunks of the first FIRST_WINDOW units: their bank, writing, scenes, chapters and the scripts their days name. */
export function firstWindowGlobs(contentDir = 'content'): string[] {
  const dir = join(contentDir, 'units');
  const ids = readdirSync(dir).filter((f) => /^u\d+\.json$/.test(f)).sort().slice(0, FIRST_WINDOW).map((f) => f.replace('.json', ''));
  const chapters = new Set<string>();
  const scripts = new Set<string>();
  for (const id of ids) {
    const u = JSON.parse(readFileSync(join(dir, `${id}.json`), 'utf8')) as { days: Array<{ chapter?: string; focus?: string[]; chunks?: string[]; lexemes?: string[] }> };
    for (const d of u.days) {
      if (d.chapter) chapters.add(d.chapter);
      for (const n of [...(d.focus ?? []), ...(d.chunks ?? []), ...(d.lexemes ?? [])]) scripts.add(n.replace(':', '_'));
    }
  }
  const one = (kind: string, name: string) => `content/${kind}/${name}-*.js`;
  const scriptsDir = join(contentDir, 'scripts');
  const scriptsOnDisk = new Set(existsSync(scriptsDir) ? readdirSync(scriptsDir).map((f) => f.replace('.json', '')) : []);
  return [
    ...ids.flatMap((id) => [one('bank', id), one('writing', id), one('scenes', `sc-${id}-*`)]),
    ...[...chapters].map((c) => one('story', c)),
    ...[...scripts].filter((n) => scriptsOnDisk.has(n)).map((n) => one('scripts', n)),
  ];
}

/** Everything the service worker installs with the app (workbox globPatterns, relative to the build). */
export function precacheGlobs(contentDir = 'content'): string[] {
  const specs: readonly ContentKindSpec[] = CONTENT_KINDS;
  const whole = specs.flatMap((k) => (k.load === 'core' ? [`content/${k.dir}/*.js`] : k.corePrefix ? [`content/${k.dir}/${k.corePrefix}*.js`] : []));
  return ['*.{html,svg,png,webmanifest}', 'assets/**/*.{js,css}', ...whole, ...firstWindowGlobs(contentDir)];
}

/** Which files a content chunk's URL is: any chunk of any registered folder, under any base path. */
export function contentUrlPattern(): RegExp {
  return new RegExp(`/content/(${contentDirs().join('|')})/.+\\.js$`);
}

/** The runtime cache for content chunks that are not installed with the app: cache-first, kept. */
export function contentCache() {
  const pattern = contentUrlPattern();
  return {
    urlPattern: ({ url }: { url: URL }) => pattern.test(url.pathname),
    handler: 'CacheFirst' as const,
    options: { cacheName: 'fluidez-content', cacheableResponse: { statuses: [0, 200] } },
  };
}

/** The workbox options of vite-plugin-pwa. */
export function workboxOptions() {
  return {
    globPatterns: precacheGlobs(),
    maximumFileSizeToCacheInBytes: 8_000_000,
    runtimeCaching: [contentCache()],
  };
}

/**
 * rollup's chunkFileNames: a content file's chunk goes under content/<kind>/. Anything else (the app,
 * a folder the registry does not list) goes to assets/, which is installed whole.
 */
export function chunkFileName(info: { facadeModuleId?: string | null }): string {
  const m = info.facadeModuleId?.match(new RegExp(`/content/(${contentDirs().join('|')})/`));
  return m ? `content/${m[1]}/[name]-[hash].js` : 'assets/[name]-[hash].js';
}
