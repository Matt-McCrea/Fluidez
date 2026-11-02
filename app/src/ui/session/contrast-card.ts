// The card of one contrast item (content/contrasts), in the form what decides the contrast calls for (audit R10).
// A word or structure beside the slot (local) is a forced choice and then a typed gap, since matching the cue is
// the skill. What the speaker means (meaning) is a situation to pick the sentence for, and then a typed gap.
// Earlier text (discourse) is typed from the English, and so is a near-synonym (synonym), which is phrase
// retrieval and never a deck of two buttons. None of them runs against a clock. Both card kinds are the ones the
// rest of the session already has: a multiple choice card and a typed one.
import { admissible } from '../../compiler';
import type { ContrastItem, ContrastDecides, NodeId } from '../../content/schema';
import type { Bundle } from '../data/bundle';
import { checkExact } from '../../check';
import { wordHint } from '../../check/wordhint';
import { SAY, sentenceCheck, type Check, type McqCard, type TypeCard, type Txt } from './cards';

export type ContrastForm = 'choose' | 'type';

const es = (text: string): Txt => ({ text, lang: 'es' });
const en = (text: string): Txt => ({ text, lang: 'en' });

/** The sentence with its place left blank. */
export const blanked = (it: Pick<ContrastItem, 'es' | 'gap'>): string => `${it.es.slice(0, it.gap[0])}___${it.es.slice(it.gap[1])}`;

/** The sentence with option `k` in its place. */
export const filled = (it: Pick<ContrastItem, 'es' | 'gap' | 'options'>, k: number): string => `${it.es.slice(0, it.gap[0])}${it.options[k]}${it.es.slice(it.gap[1])}`;

/**
 * How a contrast is asked: a choice for a review of recognition and a typed answer for one of production, but only
 * where the contrast is one a choice can fairly test. Aspect and near-synonyms are typed either way round.
 */
export function contrastForm(decides: ContrastDecides, direction: 'receptive' | 'productive'): ContrastForm {
  if (decides === 'discourse' || decides === 'synonym') return 'type';
  return direction === 'receptive' ? 'choose' : 'type';
}

/** A run of `n` cards: a forced choice first and then typed, for the contrasts a choice can test; all typed for the rest. */
export function contrastFormAt(decides: ContrastDecides, k: number, n: number): ContrastForm {
  return decides === 'discourse' || decides === 'synonym' || k >= Math.ceil(n / 2) ? 'type' : 'choose';
}

/** The gap typed: accents count, since a contrast can turn on one (que and qué), and the right version shows when it is missed. */
function gapCheck(answer: string) {
  return (input: string): Check => {
    const r = checkExact(input, [answer]);
    if (r.pass) return { pass: true, answer };
    if (r.near) return { pass: false, near: true, hint: 'Check the accents.', hintKind: 'accents', answer };
    const w = wordHint(input, [answer]);
    return { pass: false, near: false, hint: w?.hint, hintKind: w?.kind, answer };
  };
}

/** Whether the English is on the card: it is, unless the item is one the sentence alone decides and the contrast is one a cue decides. */
const showsEnglish = (it: ContrastItem, decides: ContrastDecides) => !(it.rung === 2 && decides === 'local');

export function contrastCard(it: ContrastItem, decides: ContrastDecides, o: { key: string; form: ContrastForm }): McqCard | TypeCard {
  const answer = it.es.slice(it.gap[0], it.gap[1]);
  const base = { key: o.key, why: it.why };
  // aspect and near-synonyms are never a choice between buttons, whoever asks (R10)
  if (o.form === 'choose' && decides !== 'discourse' && decides !== 'synonym') {
    // a meaning decides it: the situation is the question and the sentences are the choices
    if (decides === 'meaning') {
      return { ...base, type: 'mcq', ask: 'Which one says this?', prompt: en(it.en), options: it.options.map((_, k) => es(filled(it, k))), answer: it.answer };
    }
    return {
      ...base, type: 'mcq', ask: 'Which one fits?', prompt: es(blanked(it)), ...(showsEnglish(it, decides) ? { sub: en(it.en) } : {}),
      options: it.options.map(es), answer: it.answer,
    };
  }
  // earlier text decides it: the whole sentence, from the English
  if (decides === 'discourse') {
    return {
      ...base, type: 'type', ask: SAY, prompt: en(it.en), answerLang: 'es', placeholder: 'Type it in Spanish',
      check: sentenceCheck({ es: it.es, en: it.en, accept: [] }, it.side), retry: true, claim: true,
    };
  }
  return {
    ...base, type: 'type', ask: decides === 'synonym' ? 'Say it, filling the gap' : 'Fill the gap', prompt: es(blanked(it)), ...(showsEnglish(it, decides) ? { sub: en(it.en) } : {}),
    answerLang: 'es', placeholder: /\s/.test(answer) ? 'The missing words' : 'The missing word', check: gapCheck(answer), retry: true,
  };
}

/** What a missed item is charged to: the contrast, and the side the answer belongs to. */
export const contrastCredit = (it: Pick<ContrastItem, 'node' | 'side'>): NodeId[] => (it.side === it.node ? [it.node] : [it.node, it.side]);

/** The items of a contrast the learner can be shown: everything the sentence needs is known (`known` is the compiler's own idea of it, see knownSet). */
export function eligibleContrast(b: Bundle, node: NodeId, known: ReadonlySet<NodeId>): ContrastItem[] {
  return b.contrastItems(node).filter((it) => admissible(it.requires, (r) => known.has(r), b.course.nodes));
}
