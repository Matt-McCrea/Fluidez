import type { NodeId } from '../../content/schema';

/**
 * What a free practice run should contain. Built by the reference screens
 * ("Practise this"), the home screen ("Quick review", "Train it") and the
 * practice screen's own pickers; consumed by the practice runner.
 */
export type PracticeSpec =
  | { kind: 'quickReview'; minutes?: number; title?: string }
  | { kind: 'conjugate'; verbs: string[]; tenses: string[]; minutes?: number; title?: string }
  | { kind: 'translate'; nodes?: NodeId[]; unit?: string; minutes?: number; title?: string }
  | { kind: 'nodes'; nodes: NodeId[]; minutes?: number; title?: string };
