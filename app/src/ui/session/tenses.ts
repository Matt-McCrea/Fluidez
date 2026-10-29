// Which tenses a learner has met, and what to call them on screen.
// A tense counts as met when any grammar node that teaches it is in the
// learner's nodes. The mapping is by node id (the grammar graph carries no
// tense tags), so extend TENSE_RULES when a new lesson teaches a tense.
import { TENSES, type TenseKey } from '../../engine';

/** Tenses shown in the verb table, in teaching order. */
export const TENSE_ORDER: readonly TenseKey[] = [
  'presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'perfecto',
  'imperativo', 'impneg', 'presubj', 'plusc', 'futperf', 'condperf',
  'impsubj', 'perfsubj', 'pluscsubj',
];

/** Plain-English names. Never the grammar words. */
export const TENSE_PLAIN: Readonly<Record<string, string>> = {
  presente: 'Present (now)',
  preterito: 'Preterite (the finished past)',
  imperfecto: 'Imperfect (what used to happen)',
  futuro: 'Future',
  condicional: 'Conditional (would)',
  perfecto: 'Present perfect (have done)',
  imperativo: 'Commands',
  impneg: 'Negative commands',
  presubj: 'Present subjunctive (wishes, advice, doubt)',
  plusc: 'Pluperfect (had done)',
  futperf: 'Future perfect (will have done)',
  condperf: 'Conditional perfect (would have done)',
  impsubj: 'Imperfect subjunctive (if only)',
  perfsubj: 'Perfect subjunctive (hoping it has happened)',
  pluscsubj: 'Pluperfect subjunctive (if it had happened)',
};

/** tense -> patterns on grammar node ids (and tags written as `tense:<key>`). */
export const TENSE_RULES: ReadonlyArray<readonly [TenseKey, RegExp]> = [
  ['presente', /^g:(present-|stem-|yo-irregular)/],
  ['preterito', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
  ['imperfecto', /^g:(imperfect-(states|habitual|progressive)|pret-vs-imperfect|narrative-pasts)/],
  ['futuro', /^g:future-(promises|conjecture)/],
  ['condicional', /^g:conditional$/],
  ['perfecto', /^g:perfecto-/],
  ['imperativo', /^g:commands-(tu|usted)$/],
  ['impneg', /^g:negative-commands$/],
  ['presubj', /^g:subj-(wanting|irregulars|wishes|influence|doubt|value|emotion|opinion|cuando|purpose|relative)/],
  ['plusc', /^g:pluperfect$/],
  ['futperf', /^g:future-perfect$/],
  ['condperf', /^g:conditional-perfect$/],
  ['impsubj', /^g:imperfect-subj$/],
  ['perfsubj', /^g:subj-perfect$/],
  ['pluscsubj', /^g:pluperfect-subj$/],
];

interface TenseNodeLike { id: string; tags?: readonly string[] }

/** The tense a grammar node teaches, if any (a node may teach several). */
export function tensesOfNode(n: TenseNodeLike): TenseKey[] {
  const out = new Set<TenseKey>();
  for (const [t, re] of TENSE_RULES) if (re.test(n.id)) out.add(t);
  for (const tag of n.tags ?? []) {
    const m = /^tense:(.+)$/.exec(tag);
    if (m && (TENSE_ORDER as readonly string[]).includes(m[1])) out.add(m[1] as TenseKey);
  }
  return [...out];
}

/** Tenses the learner has met, given their node ids (tags looked up via `tagsOf`). */
export function taughtTenses(nodeIds: Iterable<string>, tagsOf: (id: string) => readonly string[] | undefined = () => undefined): TenseKey[] {
  const met = new Set<TenseKey>();
  for (const id of nodeIds) for (const t of tensesOfNode({ id, tags: tagsOf(id) })) met.add(t);
  return TENSE_ORDER.filter((t) => met.has(t));
}

/** The tenses the free-practice picker offers, in order. */
export const PICKER_TENSES: readonly TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'perfecto', 'presubj'];

export const tenseName = (k: string): string => TENSE_PLAIN[k] ?? TENSES.find((t) => t.key === k)?.label ?? k;

/** The short label without the bracketed gloss: "Preterite". */
export const tenseShort = (k: string): string => tenseName(k).replace(/\s*\(.*\)$/, '');
