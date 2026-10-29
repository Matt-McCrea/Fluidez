// Exercise items: plain data, so the session compiler can store them, the
// exposure ledger can key them, and the UI can render them without knowing
// which generator made them.
import type { NodeId } from '../content/schema';

export type GeneratorName = 'input' | 'ladder' | 'translate' | 'recombine' | 'lexeme';

/** The one thing a minimal pair differs in. */
export type Feature = 'tense' | 'person' | 'mood' | 'clitic' | 'copula' | 'porpara' | 'number' | 'gender';

interface Base {
  /** Stable across runs and seeds: generator | sentence id | transformation.
   *  The exposure ledger keys on it; two items with one id are one item. */
  id: string;
  generator: GeneratorName;
  sentenceId?: string;
  /** Skill-graph nodes the item practises (the sentence's targets, plus the
   *  feature's node when the caller maps one). */
  nodes: NodeId[];
}

/** Structured input: read the options, pick the one the question describes.
 *  Options differ ONLY in `feature`. */
export interface ReadAndPickItem extends Base {
  kind: 'readAndPick';
  feature: Feature;
  question: string;           // plain English
  options: string[];          // Spanish
  answer: number;
  /** English of the right option, shown after answering. */
  en?: string;
  why: string;                // one plain-English reason, shown after answering
}

/** Ladder step 1: choose the form that fills the gap. */
export interface ChooseItem extends Base {
  kind: 'choose';
  gapped: string;             // Spanish with ___
  en: string;                 // the meaning, which pins the form
  cue: string;                // "(comer)" or "(comer, tú)"
  options: string[];
  answer: number;
}

/** Ladder step 2: type the form. */
export interface TypeFormItem extends Base {
  kind: 'typeForm';
  gapped: string;
  en: string;
  cue: string;
  answer: string;
  accept: string[];           // every spelling that is right (rió/rió legacy, -se subjunctive)
}

export type TransformOp =
  | { op: 'person'; to: string }
  | { op: 'tense'; to: string }
  | { op: 'negate' }
  | { op: 'pronoun'; np: string };

/** Ladder step 3: rewrite the sentence as instructed. Checked with the
 *  translation matcher against `answer` + `accept`. */
export interface TransformItem extends Base {
  kind: 'transform';
  source: string;
  instruction: string;        // plain English
  transform: TransformOp;
  answer: string;
  accept: string[];
}

/** Translate a bank sentence. en→es is checked with matchTranslation, es→en
 *  with matchEnglish. */
export interface TranslateItem extends Base {
  kind: 'translate';
  dir: 'en-es' | 'es-en';
  prompt: string;
  answer: string;
  accept: string[];
  /** For en→es: the English the matcher reads for "you" and the subject. */
  en: string;
  /** A dialogue row: the earlier turns, in Spanish, shown as context. The
   *  prompt and answer are one turn only. */
  context?: string;
}

/** A sentence the learner has never seen, made from one they have.
 *  `production`: translate the new English into Spanish.
 *  `recognition`: read the new Spanish, answer a plain-English question. */
export interface RecombineItem extends Base {
  kind: 'recombine';
  mode: 'production' | 'recognition';
  transform: TransformOp;
  es: string;
  en?: string;
  accept: string[];
  question?: string;
  options?: string[];
  answer?: number;
}

/** Cued production of a word or chunk: English cue → Spanish. */
export interface CueItem extends Base {
  kind: 'cue';
  cue: string;
  answer: string;
  accept: string[];
  peninsular: string[];
}

/** A word or chunk gapped out of a bank sentence it appears in. */
export interface LexGapItem extends Base {
  kind: 'lexGap';
  gapped: string;
  en: string;
  cue: string;
  answer: string;
  accept: string[];
  peninsular: string[];
}

export type Item = ReadAndPickItem | ChooseItem | TypeFormItem | TransformItem | TranslateItem | RecombineItem | CueItem | LexGapItem;
