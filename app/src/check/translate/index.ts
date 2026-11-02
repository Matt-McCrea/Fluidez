// Public API of the translation matcher (English → Spanish and back).
export { matchTranslation } from './match';
export type { MatchOptions, SentenceLike, TranslationResult } from './match';
export { matchEnglish, normEnglish } from './english';
export type { EnglishResult } from './english';
export { startAttempt, submitAttempt, MAX_TRIES } from './attempt';
export type { AttemptGrade, AttemptState, AttemptStatus, AttemptStep } from './attempt';
export { canon } from './canon';
export type { Canon } from './canon';
export { diagnose, HINT_TEXT } from './hints';
export type { Diagnosis, HintKind } from './hints';
export { expandAccepted, peninsularVariants, registerVariants, resultClauseVariants, softenerVariants, subjunctiveVariants, PENINSULAR_NOUNS, PENINSULAR_VERBS } from './variants';
export { swapNote, touches } from './swaps';
export type { Swap, SwapKind } from './swaps';
export type { ExpandOptions, Register, Variant } from './variants';
