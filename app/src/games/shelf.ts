// What the games offer, now. A game is listed when it is open and not before: nothing
// is shown locked, no outline of a game that is not there, no count of what is left
// to earn. Opening is about what the learner owns and has read, never about where
// they are in the course.
import type { Learner } from '../learner';
import type { Bundle } from '../ui/data/bundle';
import { isResumable, type UiStore } from '../ui/store/ui';
import { openDecks, type FlashDeck } from './flash';
import { rereadCandidates } from './reading';
import { RESCUE_MAX, RESCUE_MIN, rescueCount } from './rescue';
import { flashKey, unoKey, type GamesDoc } from './store';
import { openUnoDecks, type UnoDeck } from './uno';

export interface FlashTile { deck: FlashDeck; /** the best in this deck, if there is one */ best?: number }

/** Cards are due: how many, and how many a round takes. */
export interface RescueTile { count: number; asks: number }

export interface UnoTile { deck: UnoDeck; best?: number }

export interface Shelf {
  flash: FlashTile[];
  /** the contrasts open for Uno u otro */
  uno: UnoTile[];
  /** present only when enough is due for a round */
  rescue?: RescueTile;
  /** chapters that could be read again; present only when there is one */
  reread?: number;
  /** what the games hold, for the games that need it once they start */
  doc: GamesDoc;
}

export interface ShelfDeps { learner: Learner; bundle: Bundle; ui: Pick<UiStore, 'games' | 'session' | 'state'>; now: () => number }

export async function loadShelf(d: ShelfDeps): Promise<Shelf> {
  const doc = await d.ui.games.read();
  const flash = openDecks(d.learner, d.bundle).map((deck) => ({ deck, ...(doc.bests[flashKey(deck.id)] ? { best: doc.bests[flashKey(deck.id)].score } : {}) }));
  const uno = openUnoDecks(d.learner, d.bundle).map((deck) => ({ deck, ...(doc.bests[unoKey(deck.id)] ? { best: doc.bests[unoKey(deck.id)].score } : {}) }));
  // a lesson left part-way still holds its warm-up: a rescue would review those cards, and picking the lesson up would review them again, minutes later
  const midLesson = isResumable(d.ui.session, d.learner, d.now(), d.ui.state.learnerId);
  const count = midLesson ? 0 : rescueCount(d.learner, d.now());
  const chapters = rereadCandidates(d.learner, doc, d.now()).length;
  return { flash, uno, ...(count >= RESCUE_MIN ? { rescue: { count, asks: Math.min(count, RESCUE_MAX) } } : {}), ...(chapters ? { reread: chapters } : {}), doc };
}

/** Nothing is open: the shelf is not drawn at all. */
export const shelfIsEmpty = (s: Shelf): boolean => !s.flash.length && !s.uno.length && !s.rescue && !s.reread;

/** Home mentions one game, quietly: Rescate when a round is due, else De corrido when a chapter is ready. */
export const homeOffer = (s: Shelf): 'rescue' | 'reread' | undefined => (s.rescue ? 'rescue' : s.reread ? 'reread' : undefined);

/** The close screen mentions at most one thing: a Relámpago deck, when one is open. */
export const closeOffer = (s: Shelf): FlashDeck | undefined => s.flash[0]?.deck;
