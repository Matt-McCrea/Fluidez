// Which game is on screen. A choice is made on the shelf (Board) and carried here by the practice screen.
import type { FlashDeck } from '../../games/flash';
import type { UnoDeck } from '../../games/uno';
import type { PracticeSpec } from '../session/practice-spec';
import { Corrido } from './Corrido';
import { Flash } from './Flash';
import { RescueGame } from './Rescue';
import { Uno } from './Uno';

export type GameChoice = { game: 'flash'; deck: FlashDeck } | { game: 'uno'; deck: UnoDeck } | { game: 'rescue' } | { game: 'reread' };

export function Play({ choice, onExit, onPractise }: { choice: GameChoice; onExit: () => void; onPractise: (spec: PracticeSpec) => void }) {
  switch (choice.game) {
    case 'flash': return <Flash deck={choice.deck} onExit={onExit} onPractise={onPractise} />;
    case 'uno': return <Uno deck={choice.deck} onExit={onExit} onPractise={onPractise} />;
    case 'rescue': return <RescueGame onExit={onExit} />;
    case 'reread': return <Corrido onExit={onExit} />;
  }
}
