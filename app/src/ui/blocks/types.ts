import type { Block } from '../../compiler';
import type { SessionRunner } from '../session/runner';
import type { SavedSession, UiStore } from '../store/ui';

export type Cursor = SavedSession['cursor'];

export interface BlockProps<B extends Block = Block> {
  block: B;
  run: SessionRunner;
  ui: UiStore;
  onDone: () => void;
  /** where a resumed session was in this block (only for the saved block, once) */
  resume?: Cursor;
}
