// What the games offer, now. A game is listed when it is open and not before: nothing
// is shown locked, no outline of a game that is not there, no count of what is left
// to earn. Opening is about what the learner owns and has read, never about where
// they are in the course.
import type { Learner } from '../learner';
import type { Bundle } from '../ui/data/bundle';
import type { UiStore } from '../ui/store/ui';
import { openDecks, type FlashDeck } from './flash';
import { RESCUE_MAX, RESCUE_MIN, rescueCount } from './rescue';
import { flashKey, type GamesDoc } from './store';

export interface FlashTile { deck: FlashDeck; /** the best in this deck, if there is one */ best?: number }

/** Cards are due: how many, and how many a round takes. */
export interface RescueTile { count: number; asks: number }

export interface Shelf {
  flash: FlashTile[];
  /** present only when enough is due for a round */
  rescue?: RescueTile;
  /** what the games hold, for the games that need it once they start */
  doc: GamesDoc;
}

export interface ShelfDeps { learner: Learner; bundle: Bundle; ui: Pick<UiStore, 'games'>; now: () => number }

export async function loadShelf(d: ShelfDeps): Promise<Shelf> {
  const doc = await d.ui.games.read();
  const flash = openDecks(d.learner, d.bundle).map((deck) => ({ deck, ...(doc.bests[flashKey(deck.id)] ? { best: doc.bests[flashKey(deck.id)].score } : {}) }));
  const count = rescueCount(d.learner, d.now());
  return { flash, ...(count >= RESCUE_MIN ? { rescue: { count, asks: Math.min(count, RESCUE_MAX) } } : {}), doc };
}

/** Nothing is open: the shelf is not drawn at all. */
export const shelfIsEmpty = (s: Shelf): boolean => !s.flash.length && !s.rescue;
