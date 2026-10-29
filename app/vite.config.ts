import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync, readdirSync } from 'node:fs';

// Content chunks live under content/<kind>/ so the service worker can tell
// them apart from the app shell. Only the shell, the graph, the unit files and
// the first window of units (FIRST_WINDOW) are precached; every other content
// chunk is cached on first use (cache-first) and then works offline.
const FIRST_WINDOW = 4;

function firstWindowGlobs(): string[] {
  const dir = 'content/units';
  const ids = readdirSync(dir).filter((f) => /^u\d+\.json$/.test(f)).sort().slice(0, FIRST_WINDOW).map((f) => f.replace('.json', ''));
  const chapters = new Set<string>();
  const scripts = new Set<string>();
  for (const id of ids) {
    const u = JSON.parse(readFileSync(`${dir}/${id}.json`, 'utf8')) as { days: Array<{ chapter?: string; focus?: string[]; chunks?: string[]; lexemes?: string[] }> };
    for (const d of u.days) {
      if (d.chapter) chapters.add(d.chapter);
      for (const n of [...(d.focus ?? []), ...(d.chunks ?? []), ...(d.lexemes ?? [])]) scripts.add(n.replace(':', '_'));
    }
  }
  const one = (kind: string, name: string) => `content/${kind}/${name}-*.js`;
  const scriptsOnDisk = new Set(readdirSync('content/scripts').map((f) => f.replace('.json', '')));
  return [
    ...ids.flatMap((id) => [one('bank', id), one('writing', id), one('scenes', `sc-${id}-*`)]),
    ...[...chapters].map((c) => one('story', c)),
    ...[...scripts].filter((n) => scriptsOnDisk.has(n)).map((n) => one('scripts', n)),
  ];
}

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'Fluidez',
        short_name: 'Fluidez',
        lang: 'es',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#1f6f5c',
        background_color: '#ffffff',
      },
      workbox: {
        globPatterns: [
          '*.{html,svg,png,webmanifest}', 'assets/**/*.{js,css}',
          'content/graph/*.js', 'content/units/*.js',
          ...firstWindowGlobs(),
        ],
        maximumFileSizeToCacheInBytes: 8_000_000,
        runtimeCaching: [{
          urlPattern: ({ url }: { url: URL }) => /\/content\/(bank|scripts|story|scenes|writing|graph|units)\/.+\.js$/.test(url.pathname),
          handler: 'CacheFirst',
          options: { cacheName: 'fluidez-content', cacheableResponse: { statuses: [0, 200] } },
        }],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (info) => {
          const m = info.facadeModuleId?.match(/\/content\/(graph|units|bank|scripts|story|scenes|writing)\//);
          return m ? `content/${m[1]}/[name]-[hash].js` : 'assets/[name]-[hash].js';
        },
      },
    },
  },
  test: { globals: true, environment: 'node', include: ['tests/**/*.test.ts', 'src/**/*.test.ts'], testTimeout: 20_000 },
});
