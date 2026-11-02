import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { execFileSync } from 'node:child_process';
import { chunkFileName, workboxOptions } from './tools/build/pwa';

// Content chunks live under content/<kind>/ so the service worker can tell them apart from the app
// shell. What is installed with the app and what is cached on first use is made from the content
// kinds registry (src/content/kinds.ts) in tools/build/pwa.ts, so a new content folder cannot be
// added to the course without this config knowing it.

// The git tree of content/ this build is made from, for the attempts log (src/ui/data/rev.ts): it moves when the
// course does and holds still when only the app does. A checkout without git has none, and the log leaves it off.
function contentRev(): string {
  try { return execFileSync('git', ['rev-parse', 'HEAD:./content'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().slice(0, 12); } catch { return ''; }
}
process.env.VITE_CONTENT_REV ??= contentRev();

// BASE_PATH is set by the GitHub Pages workflow ('/Fluidez/'); dev, tests and local builds stay at '/'.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
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
      workbox: workboxOptions(),
    }),
  ],
  build: {
    rollupOptions: {
      output: { chunkFileNames: chunkFileName },
    },
  },
  test: { globals: true, environment: 'node', include: ['tests/**/*.test.ts', 'src/**/*.test.ts'], testTimeout: 20_000 },
});
