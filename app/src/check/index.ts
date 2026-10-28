// Public API of the answer checker.
export { checkExact, answerForms, meaningAlternatives, depunct } from './exact';
export type { CheckExactOptions, CheckExactResult } from './exact';
export { checkWriting, evaluate, expectedForm, nounSet } from './writing';
export type { Band, CheckContext, ConnectorClass, ConnectorItem, Constraint, ConstraintResult, WritingResult } from './writing';
export { lexIndex, countIn, lexBase, lexNorm, lexDeaccent } from './lexmatch';
export type { LexIndex } from './lexmatch';
