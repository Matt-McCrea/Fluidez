// Look-up: ranked accent-insensitive search, plain-language grammar topics, verb tables with standard tense names.
// Everything takes its data (lessons, vocabulary, verbs) as arguments.
export { norm, scoreEntry, searchEntries } from './search';
export type { Searchable } from './search';
export { TOPICS, TOPIC_LABEL, RULES as TOPIC_RULES, KEYWORDS as TOPIC_KEYWORDS, PCIC as TOPIC_PCIC, topicOf } from './topics';
export type { Topic, TopicId, TopicNodeLike } from './topics';
export { findVerb, findVerbs, shownPersons, cellsFor, seCellsFor } from './verbs';
export type { VerbHit, VerbMatch } from './verbs';
export { TENSE_NAMES, standardNames } from './names';
export {
  TENSE_ORDER, TENSE_PLAIN, TENSE_RULES, PICKER_TENSES, tenseName, tenseShort, tensesOfNode, taughtTenses, licensedTenses,
} from './tenses';
export { grammarEntries, groupByTopic, wordEntries, strengthOf, STRENGTH_TEXT, stripArticle, themeWords } from './entries';
export type { GrammarEntry, GrammarOptions, LessonLike, SavedLike, Strength, VocabLike, WordEntry, WordOptions } from './entries';
