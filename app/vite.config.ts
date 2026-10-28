import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

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
      workbox: { globPatterns: ['**/*.{js,css,html,json,svg,png}'], maximumFileSizeToCacheInBytes: 8_000_000 },
    }),
  ],
  test: { globals: true, environment: 'node', include: ['tests/**/*.test.ts', 'src/**/*.test.ts'] },
});
