// Plain-language topics for the grammar list. `topicOf(node)` is driven by
// ordered RULES. To extend: add a slug pattern (the node id without its
// `g:`/`p:`/`c:`/`x:` prefix) to the right rule, or add a keyword pattern to
// KEYWORDS. First match wins; the pcic chapter is the last resort; unknown
// is "Other". Order matters: more specific topics come first.

export type TopicId =
  | 'now' | 'past' | 'used' | 'future' | 'wishes' | 'describing'
  | 'pronouns' | 'questions' | 'connecting' | 'polite' | 'other';

export interface Topic { id: TopicId; label: string; /** plain words a learner might type */ words: string[] }

export const TOPICS: readonly Topic[] = [
  { id: 'now', label: 'Talking about now', words: ['present', 'now', 'today', 'every day', 'i am', 'i have', 'i need', 'there is'] },
  { id: 'past', label: 'The past', words: ['past', 'yesterday', 'did', 'ago', 'have you ever', 'had', 'was'] },
  { id: 'used', label: 'What used to happen', words: ['used to', 'when i was', 'back then', 'was doing', 'always'] },
  { id: 'future', label: 'The future and plans', words: ['going to', 'will', 'plans', 'tomorrow', 'next', 'future', 'maybe'] },
  { id: 'wishes', label: 'Wants, wishes and advice', words: ['would', 'want', 'wish', 'hope', 'should', 'must', 'have to', 'i like', 'i love', 'advice', 'if', 'command', 'order'] },
  { id: 'describing', label: 'Describing people and things', words: ['describe', 'adjective', 'bigger', 'best', 'this', 'that', 'my', 'your', 'a lot', 'a little', 'the'] },
  { id: 'pronouns', label: 'Pronouns and little words', words: ['him', 'her', 'it', 'them', 'me', 'to me', 'myself', 'one', 'no', 'nothing', 'nobody', 'never', 'any'] },
  { id: 'questions', label: 'Asking questions', words: ['ask', 'question', 'who', 'what', 'where', 'when', 'how', 'why', 'which'] },
  { id: 'connecting', label: 'Connecting ideas', words: ['because', 'so', 'but', 'although', 'when', 'if', 'who', 'which', 'that', 'for', 'by', 'in order to', 'said that'] },
  { id: 'polite', label: 'Being polite', words: ['please', 'thank', 'sorry', 'excuse me', 'hello', 'goodbye', 'formal', 'polite', 'soften'] },
  { id: 'other', label: 'Other', words: [] },
];

export const TOPIC_LABEL: Readonly<Record<TopicId, string>> = Object.fromEntries(TOPICS.map((t) => [t.id, t.label])) as Record<TopicId, string>;

interface Rule { topic: TopicId; slug: RegExp }

/** Slug rules, in priority order. */
export const RULES: readonly Rule[] = [
  { topic: 'questions', slug: /^(questions|que-vs-cual|questions-prepositions|indirect-questions)/ },
  { topic: 'polite', slug: /^(softening|register-ladder|written-register|formal-letter|hedging|reformulation|greet|polite|please|thanks)/ },
  { topic: 'used', slug: /^imperfect-(states|habitual|progressive)/ },
  { topic: 'past', slug: /^(preterite|pret-|narrative-pasts|pluperfect$|perfecto|spain-pasts|hace-ago|acabar-de)/ },
  { topic: 'future', slug: /^(ir-a-|future-(promises|conjecture|perfect))/ },
  { topic: 'connecting', slug: /^(subj-(cuando|purpose|concessive|conditions|free|relative)|cause|consequence|causal|concession|si-present|cuando|por-para|pero-sino|aunque|tanto-como|relative|relatives|that-clauses|para-que|como-si|reported|reporting|argument|discourse|temporal|concessive|consecutive|conditional-advanced|referring-back|comparative-advanced|topic-fronting|cleft|time-sequence|gerund-ways|participle-gerund|absolute|nominalisation|prep-infinitive|infinitive-)/ },
  { topic: 'wishes', slug: /^(subj-|conditional|commands|negative-commands|que-wishes|ojala|imperfect-subj|pluperfect-subj|si-hypothetical|si-past|gustar|deber-modal|tener-que|impersonal-obligation|verb-infinitive|parecer-quedar|se-form-recognition|wish-)/ },
  { topic: 'pronouns', slug: /^(direct-objects|indirect-objects|prep-pronouns|double-pronouns|object-pronoun|le-doubling|se-|reflexive|possessive-dative|passive-se|impersonal-register|indefinites|negation-words|cada-cualquier|lo-que-|passive-ser)/ },
  { topic: 'describing', slug: /^(adjective|comparatives|superlatives|possessives|demonstratives|quantifiers|gender-articles|article-uses|lo-adjective|diminutives|adverbs|estar-participle|ser-estar|evaluative|exclamations|cuyo|agreement|verbs-of-change)/ },
  { topic: 'now', slug: /^(present-|stem-|yo-irregular|ser-|estar-|hay-|hace-que|acabar|tense-modal)/ },
];

/** Keyword rules on the English title / Spanish text, tried after the id. */
export const KEYWORDS: ReadonlyArray<readonly [TopicId, RegExp]> = [
  ['used', /\b(used to|when i was|back then)\b/],
  ['polite', /\b(please|thank|sorry|excuse|hello|goodbye|nice to meet|polite|formal)\b|\busted\b/],
  ['questions', /\b(ask|asking|question|how much|how many|what is|where is|who is)\b/],
  ['wishes', /\b(would|wish|hope|should|advice|i'd like|i like|i love|want|need to|have to)\b/],
  ['future', /\b(going to|plans?|tomorrow|next week|will)\b/],
  ['past', /\b(yesterday|last (night|week|year)|ago|did|was|were|had)\b/],
  ['connecting', /\b(because|although|even though|but|so that|if)\b/],
  ['describing', /\b(describe|describing|looks?|tall|colou?r)\b/],
  ['now', /\b(now|today|every day|right now|i am|i'm)\b/],
];

/** pcic chapter prefixes: the last resort. */
export const PCIC: ReadonlyArray<readonly [TopicId, RegExp]> = [
  ['used', /^gramatica:9\.1\.2/],
  ['past', /^gramatica:9\.1\.(3|6|8)/],
  ['future', /^gramatica:9\.1\.4/],
  ['wishes', /^gramatica:(9\.2|9\.3|9\.1\.5)/],
  ['questions', /^gramatica:(7\.3|8\.8)/],
  ['pronouns', /^gramatica:(7\.1|6)/],
  ['describing', /^gramatica:(2|4|5|10\.3)/],
  ['connecting', /^gramatica:(15|14)/],
  ['now', /^gramatica:9\.1\.1/],
  ['polite', /^(funciones|tacticas_pragmaticas)/],
];

export interface TopicNodeLike {
  id: string;
  title?: string;
  es?: string;
  en?: string;
  tags?: readonly string[];
  pcic?: readonly string[];
}

/** The topic a node belongs to. Total: unknown or odd input gives "other". */
export function topicOf(node: TopicNodeLike): TopicId {
  try {
    const id = String(node.id ?? '');
    const slug = id.replace(/^[a-z]:/, '').replace(/#.*$/, '');
    for (const t of node.tags ?? []) {
      const m = /^topic:(.+)$/.exec(t);
      if (m && TOPICS.some((x) => x.id === m[1])) return m[1] as TopicId;
    }
    for (const r of RULES) if (r.slug.test(slug)) return r.topic;
    const text = `${node.title ?? ''} ${node.en ?? ''}`.toLowerCase();
    for (const [topic, re] of KEYWORDS) if (re.test(text)) return topic;
    for (const code of node.pcic ?? []) for (const [topic, re] of PCIC) if (re.test(code)) return topic;
  } catch { /* fall through */ }
  return 'other';
}
