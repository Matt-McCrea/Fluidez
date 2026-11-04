// The names grammar books use, for the lessons the course titles in plain English
// ("Saying what you did: -ar verbs in the past"). Look up searches them beside the
// title, so "preterite" finds the preterite. The tense table lives in session/tenses.
import type { TenseKey } from '../engine';
import { tensesOfNode } from './tenses';

/** Other names for each tense, English first and then the Spanish ones. */
export const TENSE_NAMES: Readonly<Partial<Record<TenseKey, readonly string[]>>> = {
  presente: ['present', 'present tense', 'presente', 'simple present'],
  preterito: ['preterite', 'preterit', 'pretérito', 'indefinido', 'simple past', 'past simple'],
  imperfecto: ['imperfect', 'imperfecto', 'pretérito imperfecto', 'imperfect tense'],
  futuro: ['future', 'future tense', 'futuro', 'simple future'],
  condicional: ['conditional', 'condicional', 'conditional tense'],
  perfecto: ['present perfect', 'perfect', 'pretérito perfecto', 'perfecto'],
  imperativo: ['imperative', 'imperativo', 'command', 'commands'],
  impneg: ['negative imperative', 'negative commands', 'imperativo negativo'],
  presubj: ['present subjunctive', 'subjunctive', 'subjuntivo', 'presente de subjuntivo'],
  plusc: ['pluperfect', 'past perfect', 'pluscuamperfecto'],
  futperf: ['future perfect', 'futuro perfecto'],
  condperf: ['conditional perfect', 'condicional perfecto', 'perfect conditional'],
  impsubj: ['imperfect subjunctive', 'subjunctive', 'subjuntivo', 'imperfecto de subjuntivo', 'fuera form', 'fuese form'],
  perfsubj: ['perfect subjunctive', 'present perfect subjunctive', 'subjunctive', 'subjuntivo'],
  pluscsubj: ['pluperfect subjunctive', 'past perfect subjunctive', 'subjunctive', 'subjuntivo'],
};

/** Names for lessons that are about a kind of word or sentence rather than a tense, by node id. */
const KIND_NAMES: ReadonlyArray<readonly [RegExp, readonly string[]]> = [
  [/^g:(subj-|imperfect-subj$|pluperfect-subj$|se-form-recognition$|ojala-past$|que-wishes-commands$|wish-exclamatives$|future-subj-recognition$|reporting-verbs-mood$|mood-choice-fine$)/, ['subjunctive', 'subjuntivo']],
  [/^g:conditional/, ['conditional', 'condicional']],
  [/^g:(si-|como-si$|conditional-advanced$)/, ['if clauses', 'conditional sentences', 'si clauses']],
  [/^g:(estar-gerund|gerund-ways|participle-gerund-clauses)/, ['gerund', 'gerundio', 'present participle']],
  [/^g:(estar-participle|participle-gerund-clauses|absolute-constructions)/, ['participle', 'past participle', 'participio']],
  [/^g:(commands|negative-commands)/, ['imperative', 'imperativo', 'commands']],
  [/^g:reflexive/, ['reflexive', 'reflexive verbs']],
  [/^g:passive-/, ['passive', 'passive voice', 'voz pasiva']],
  [/^g:(relative|relatives|cuyo-relatives|subj-relative)/, ['relative clause', 'relative clauses', 'relative pronouns']],
  [/^g:(reported-|reporting-|subj-future-in-past)/, ['reported speech', 'indirect speech', 'backshift']],
  [/^g:ser-estar/, ['ser vs estar', 'ser and estar', 'difference between ser and estar']],
  [/^g:por-para/, ['por vs para', 'por and para']],
  [/^g:(direct-objects|object-pronoun-position|double-pronouns)/, ['direct object', 'object pronouns', 'clitics']],
  [/^g:(indirect-objects|le-doubling)/, ['indirect object', 'object pronouns']],
  [/^g:(comparatives|superlatives|tanto-como)/, ['comparative', 'superlative', 'comparison']],
];

interface NamedNode { id: string; tags?: readonly string[] }

/** The standard names of a lesson: its tenses' names, and its kind's. */
export function standardNames(n: NamedNode): string[] {
  if (!n.id.startsWith('g:')) return [];
  const out = new Set<string>();
  for (const t of tensesOfNode(n)) for (const name of TENSE_NAMES[t] ?? []) out.add(name);
  for (const [re, names] of KIND_NAMES) if (re.test(n.id)) for (const name of names) out.add(name);
  return [...out];
}
