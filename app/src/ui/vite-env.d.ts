/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** '1' builds with the fixture content enabled when the real bank is empty. */
  readonly VITE_FIXTURES?: string;
}
