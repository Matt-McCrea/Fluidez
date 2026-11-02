// prepare(): the async step before compile. The compiler is pure and sync, so it can only choose from
// what it is handed; this hands it what the session ahead needs instead of whatever the tab happened
// to load (audit P5, P7, C4): the window of units around the learner, the next chapters they have not
// read, which the window does not hold for a learner placed part way through or one catching up, and
// the scripts of grammar still owed from further back, which an introduce day teaches before its own, and the
// scripts of due nodes that have no pair to ask about, which is all their review has once their sentences are used.
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
export async function prepare(bundle: Bundle, learner: Pick<Learner, 'ledger'> & Partial<Pick<Learner, 'due'>>, path: Pick<PathState, 'unit' | 'day' | 'owedGrammar'>, opts: PrepareOptions = {}): Promise<boolean> {
  if (bundle.fixture || !bundle.course.units.length) return false;
  const before = bundle.index;
  try {
    await bundle.ensureWindow(Math.min(path.unit, bundle.course.units.length - 1));
    const story = bundle.index.story ?? bundle.index.chapters;
    const next = unreadChapters(story, bundle.course, path, opts.placedAt ?? 0, (id) => learner.ledger.hasSeen('chapter', id)).slice(0, PREPARE_CHAPTERS);
    // a due card of a node with no pair to ask about is reviewed with the node's script, so the script is fetched whatever the window
    const unaskable = [...new Set((learner.due?.() ?? []).map((c) => c.node))].filter((n) => !bundle.segments(n).length);
    await Promise.all([bundle.ensureChapters(next.map((s) => s.id)), ...[...path.owedGrammar, ...unaskable].map((n) => bundle.scriptFor(n))]);
  } catch (e) {
    console.warn('fluidez: could not prepare the next lesson', e);
  }
  return bundle.index !== before;
}

/** prepare() for the app as it stands: the learner's own path, and the unit they were placed at. */
export function prepareFor(app: { bundle: Bundle; learner: Pick<Learner, 'ledger'> & Partial<Pick<Learner, 'due'>>; ui: { path: PathState; state: { placedAt?: number } } }): Promise<boolean> {
  return prepare(app.bundle, app.learner, app.ui.path, { placedAt: app.ui.state.placedAt });
}

/** A chapter in hand, fetched if it is not: 'ready', or 'lacking' when this device could not get it (the loader remembers, and asks again). */
export async function bringChapter(bundle: Bundle, id: string): Promise<'ready' | 'lacking'> {
  if (!bundle.chapters.has(id)) {
    try { await bundle.ensureChapters([id]); } catch { /* lacking, below */ }
  }
  return bundle.chapters.has(id) ? 'ready' : 'lacking';
}
