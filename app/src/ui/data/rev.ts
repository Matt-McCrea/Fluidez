/**
 * The build an answer came from, so that a content change is not read as a learning
 * effect. It is the git tree of `content/` at build time (see vite.config.ts), which
 * moves when the course does and holds still when only the app does. A checkout
 * without git has none, and the attempts log leaves the field off.
 */
export const contentRev = (): string | undefined => import.meta.env.VITE_CONTENT_REV || undefined;
