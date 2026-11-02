// Which game is on screen. A choice is made on the shelf (Board) and carried here by the practice screen.
import type { FlashDeck } from '../../games/flash';
import type { PracticeSpec } from '../session/practice-spec';
import { Flash } from './Flash';

export type GameChoice = { game: 'flash'; deck: FlashDeck };

export function Play({ choice, onExit, onPractise }: { choice: GameChoice; onExit: () => void; onPractise: (spec: PracticeSpec) => void }) {
  switch (choice.game) {
    case 'flash': return <Flash deck={choice.deck} onExit={onExit} onPractise={onPractise} />;
  }
}
