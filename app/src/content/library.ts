// The library: what the app knows about every chapter of the story without having loaded it. The
// compiler's ordering and the Story and Home screens work from it, because they must not see only the
// chapters of whichever units the tab happened to fetch (audit C4, F8). It is derived from
// content/story by `npm run library` (tools/build/library.ts), checked by the gate, and imported on
// its own by the loader. Metadata only: the text and the `requires` of 219 chapters would be a heavy
// core, so those are fetched for the chapter about to be read.
import { z } from 'zod';

export const LibraryChapter = z.object({
  id: z.string().regex(/^ch\d{3}$/),
  unit: z.string(),
  title: z.string(),
  /** the line that sets up what comes next: the last beat of the story at this chapter */
  hook: z.string(),
  /** words in the text, counted as the compiler counts them for the minutes a chapter takes */
  words: z.number().int(),
  questions: z.number().int(),
});
export type LibraryChapter = z.infer<typeof LibraryChapter>;

export const Library = z.object({
  version: z.literal(1),
  about: z.string(),
  /** in story order */
  chapters: z.array(LibraryChapter),
});
export type Library = z.infer<typeof Library>;

export const LIBRARY_ABOUT = 'Metadata for every chapter of the story, in story order. Derived from content/story by npm run library and checked by the gate. Never edited by hand.';

/** Words in a chapter's text, as the compiler counts them for the minutes it takes to read. */
export const chapterWords = (text: string): number => text.split(/\s+/).length;

/** The library of a set of chapters: story order is id order. */
export function libraryOf(chapters: ReadonlyArray<{ id: string; unit: string; title: string; hook: string; text: string; questions: readonly unknown[] }>): Library {
  return {
    version: 1,
    about: LIBRARY_ABOUT,
    chapters: [...chapters].sort((a, b) => a.id.localeCompare(b.id)).map((c) => ({
      id: c.id, unit: c.unit, title: c.title, hook: c.hook, words: chapterWords(c.text), questions: c.questions.length,
    })),
  };
}
