/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** '1' builds with the fixture content enabled when the real bank is empty. */
  readonly VITE_FIXTURES?: string;
  /** the git tree of content/ the build was made from (vite.config.ts); absent without git */
  readonly VITE_CONTENT_REV?: string;
}
