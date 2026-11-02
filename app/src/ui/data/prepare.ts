// prepare(): the async step before compile. The compiler is pure and sync, so it can only choose from
// what it is handed; this hands it what the session ahead needs instead of whatever the tab happened
// to load (audit P5, P7, C4): the window of units around the learner, and the next chapters they have
// not read, which the window does not hold for a learner placed part way through or one catching up.
import type { PathState } from '../../compiler';
import { unreadChapters } from '../../compiler';
import type { Learner } from '../../learner';
import type { Bundle } from './bundle';

/** How many unread chapters ahead are fetched: the next one, and a few behind it in case the first waits on words still slipping. */
export const PREPARE_CHAPTERS = 4;

export interface PrepareOptions {
  /** the unit index the learner started at, when placement started them part way through the course */
  placedAt?: number;
}

/** Fetch what compiling the learner's next session needs. True when anything new arrived. Never throws: a fetch that fails is the loader's to remember. */
export async function prepare(bundle: Bundle, learner: Pick<Learner, 'ledger'>, path: Pick<PathState, 'unit' | 'day'>, opts: PrepareOptions = {}): Promise<boolean> {
  if (bundle.fixture || !bundle.course.units.length) return false;
  let changed = false;
  try {
    changed = await bundle.ensureWindow(Math.min(path.unit, bundle.course.units.length - 1));
    const story = bundle.index.story ?? bundle.index.chapters;
    const next = unreadChapters(story, bundle.course, path, opts.placedAt ?? 0, (id) => learner.ledger.hasSeen('chapter', id)).slice(0, PREPARE_CHAPTERS);
    changed = (await bundle.ensureChapters(next.map((s) => s.id))) || changed;
  } catch (e) {
    console.warn('fluidez: could not prepare the next lesson', e);
  }
  return changed;
}

/** prepare() for the app as it stands: the learner's own path, and the unit they were placed at. */
export function prepareFor(app: { bundle: Bundle; learner: Pick<Learner, 'ledger'>; ui: { path: PathState; state: { placedAt?: number } } }): Promise<boolean> {
  return prepare(app.bundle, app.learner, app.ui.path, { placedAt: app.ui.state.placedAt });
}

/** A chapter in hand, fetched if it is not: 'ready', or 'lacking' when this device could not get it (the loader remembers, and asks again). */
export async function bringChapter(bundle: Bundle, id: string): Promise<'ready' | 'lacking'> {
  if (!bundle.chapters.has(id)) {
    try { await bundle.ensureChapters([id]); } catch { /* lacking, below */ }
  }
  return bundle.chapters.has(id) ? 'ready' : 'lacking';
}
