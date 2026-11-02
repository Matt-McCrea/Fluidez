// The shelf of games on the practice screen. Only what is open is drawn: no locked
// outlines, no hint of what is coming, and nothing at all while nothing is open.
// Each tile shows the learner's best, because that is what decides whether to play.
import { useEffect, useState } from 'preact/hooks';
import { loadShelf, shelfIsEmpty, type Shelf } from '../../games/shelf';
import { useApp } from '../context';
import type { GameChoice } from './Play';

export function Board({ onPlay }: { onPlay: (c: GameChoice) => void }) {
  const { learner, bundle, ui, now } = useApp();
  const [shelf, setShelf] = useState<Shelf | null>(null);
  useEffect(() => {
    let live = true;
    void loadShelf({ learner, bundle, ui, now }).then((s) => { if (live) setShelf(s); }, () => undefined);
    return () => { live = false; };
  }, []);
  if (!shelf || shelfIsEmpty(shelf)) return null;
  return (
    <section class="card games" aria-labelledby="pg-title" data-games>
      <p class="ask" id="pg-title">Play</p>
      {shelf.rescue ? (
        <div class="tile" data-game="rescue">
          <p class="tile-name">Rescate</p>
          <p>{shelf.rescue.count === 1 ? '1 card is' : `${shelf.rescue.count} cards are`} ready for review. A short round on the ones most at risk, graded for real, with no clock.</p>
          <div class="actions"><button class="btn quiet" data-rescue onClick={() => onPlay({ game: 'rescue' })}>Start a rescue of {shelf.rescue.asks}</button></div>
        </div>
      ) : null}
      {shelf.flash.length ? (
        <div class="tile" data-game="flash">
          <p class="tile-name">Relámpago</p>
          <p>Sixty seconds, as many as you can. It only uses what you already know.</p>
          <div class="decks">
            {shelf.flash.map((t) => (
              <button key={t.deck.id} class="btn quiet deck" data-deck={t.deck.id} onClick={() => onPlay({ game: 'flash', deck: t.deck })}>
                {t.deck.title}
                <span class="best">{t.best !== undefined ? `Best ${t.best}` : 'No score yet'}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
