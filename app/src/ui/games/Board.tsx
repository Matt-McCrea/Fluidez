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
      {shelf.reread ? (
        <div class="tile" data-game="reread">
          <p class="tile-name">De corrido</p>
          <p>Read a chapter you have read before against the clock, then answer a few questions. It counts when they are right.</p>
          <div class="actions"><button class="btn quiet" data-reread onClick={() => onPlay({ game: 'reread' })}>Read one again</button></div>
        </div>
      ) : null}
      {shelf.uno.length ? (
        <div class="tile" data-game="uno">
          <p class="tile-name">Uno u otro</p>
          <p>A choice of two on a contrast you have met. Some run against the clock and some do not. It never changes your review schedule.</p>
          <div class="decks">
            {shelf.uno.map((t) => (
              <button key={t.deck.id} class="btn quiet deck" data-deck={t.deck.id} onClick={() => onPlay({ game: 'uno', deck: t.deck })}>
                {t.deck.title}
                <span class="best">{t.best !== undefined ? `Best ${t.best}` : 'No score yet'}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {shelf.flash.length ? (
        <div class="tile" data-game="flash">
          <p class="tile-name">Relámpago</p>
          <p>Sixty seconds, as many as you can. It only uses what you have remembered after a gap.</p>
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

/** One quiet line and a link, or nothing: what a screen outside Practice says about the games. */
export function GameOffer({ pick, onPlay }: { pick: (s: Shelf) => GameChoice | undefined; onPlay: (c: GameChoice) => void }) {
  const { learner, bundle, ui, now } = useApp();
  const [offer, setOffer] = useState<{ choice: GameChoice; line: string; button: string }>();
  useEffect(() => {
    let live = true;
    void loadShelf({ learner, bundle, ui, now }).then((s) => {
      if (!live) return;
      const choice = pick(s);
      if (!choice) return;
      if (choice.game === 'rescue') setOffer({ choice, line: `${s.rescue!.count} cards are ready to review.`, button: 'Rescate' });
      else if (choice.game === 'reread') setOffer({ choice, line: 'A chapter you have read is ready to read again.', button: 'De corrido' });
      else setOffer({ choice, line: 'Sixty seconds, if you feel like it.', button: 'Relámpago' });
    }, () => undefined);
    return () => { live = false; };
  }, []);
  if (!offer) return null;
  return <p class="small" data-game-offer>{offer.line} <button class="btn link small" onClick={() => onPlay(offer.choice)}>{offer.button}</button></p>;
}
