// Public API of the Spanish morphology engine.
export type {
  Analysis, AnyPerson, Compound, CompoundTense, HaberAnalysis, ImpPerson, ParticipleAnalysis, Person,
  SentenceAnalysis, StemChange, StoredTense, TenseGroup, TenseInfo, TenseKey, TokenAnalysis, Variety, Verb, VerbClass,
} from './types';
export type { Cell } from './conjugate';
export type { EnPhrase } from './english';

export { VERBS, verbByInf } from './verbs';
export {
  PERSONS, IMP_PERSONS, PRODUCTION_PERSONS, PRODUCTION_IMP_PERSONS,
  TENSES, TENSE_LABEL, END, ENDING_TENSES, MODEL_VERBS, COMPOUND_TENSES, COMPOUND_OF_HABER,
  conjugate, conjugateCells, acceptedForms, participle, participles, gerund, personsFor,
  isIrregular, isIrregularIn, isReflexive, reflexiveBase, isCompound, isRecognitionOnly,
  endingsFor, vowelOf, voseoForms,
} from './conjugate';
export {
  tokenize, analyzeToken, analyzeSentence, isParticiple, participlesOf, haberAnalyses, legacySpellings,
} from './analyze';
export { enPhrase } from './english';
export { deaccent, attachEnclitic } from './ortho';

/** Normalisation for STRICT answer checking: accents are kept; only trim,
 *  lowercase and collapse spaces. */
export function normalize(s: string | null | undefined): string {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
