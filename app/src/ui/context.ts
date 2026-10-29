import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { Learner, LearnerStore } from '../learner';
import type { Bundle } from './data/bundle';
import type { ContentLoader } from './data/loader';
import type { UiStore } from './store/ui';

export interface AppCtx {
  learner: Learner;
  learnerStore: LearnerStore;
  ui: UiStore;
  bundle: Bundle;
  loader: ContentLoader;
  /** epoch ms; injectable so tests can move the clock */
  now: () => number;
  /** re-render after a change the stores do not announce (learner mutations) */
  refresh: () => void;
  /** reload content for the band the path is in now */
  reloadBundle: () => Promise<void>;
  /** wipe the learner, the path and the UI state */
  resetAll: () => Promise<void>;
}

export const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('no app context');
  return c;
}
