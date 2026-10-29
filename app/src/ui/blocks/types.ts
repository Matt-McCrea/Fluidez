import type { Block } from '../../compiler';
import type { SessionRunner } from '../session/runner';
import type { UiStore } from '../store/ui';

export interface BlockProps<B extends Block = Block> {
  block: B;
  run: SessionRunner;
  ui: UiStore;
  onDone: () => void;
}
