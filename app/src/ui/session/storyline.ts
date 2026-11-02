// Where the story stands, from the library's metadata (src/content/library.ts): which chapters a learner
// has read whatever is loaded, and what to tell one who joins part way through. Nothing here is written
// for the purpose: the line is the hook of the chapter before, which already says where it left off.
import type { LibraryChapter } from '../../content/library';

/** The chapters the learner has read, in story order. */
export function chaptersRead(story: readonly LibraryChapter[], seen: (id: string) => boolean): LibraryChapter[] {
  return story.filter((c) => seen(c.id));
}

/**
 * The chapter before this one, when the learner has not read it: where the story stands as they go in.
 * A learner who read it knows, and the first chapter has nothing before it.
 */
export function chapterBefore(story: readonly LibraryChapter[], id: string, seen: (id: string) => boolean): LibraryChapter | undefined {
  const i = story.findIndex((c) => c.id === id);
  const prev = i > 0 ? story[i - 1] : undefined;
  return prev && !seen(prev.id) ? prev : undefined;
}

/** The line shown above a chapter the learner comes to without having read the one before it. */
export function storySoFar(story: readonly LibraryChapter[], id: string, seen: (id: string) => boolean): string | undefined {
  const prev = chapterBefore(story, id, seen);
  return prev ? `The story so far: ${prev.hook}` : undefined;
}

/** What a screen says of a chapter this device could not get. */
export const CHAPTER_OFFLINE = 'That chapter needs a connection. It will be here when you are back online.';
