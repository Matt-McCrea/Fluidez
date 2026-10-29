/* ============================================================================
 * GENERATOR 4 — NEW RECOMBINATIONS: the mastery test.
 *
 * A sentence the learner knows, re-inflected into one they have never seen:
 * another person, negated, both, another tense, its object as a pronoun.
 * Novelty is checked against `known` (every bank sentence, and whatever the
 * caller adds), so a recombination never collides with a stored sentence.
 *
 * English is produced only where English changes reliably — person and
 * negation (english.ts) — and those become PRODUCTION items (translate the
 * new English). Tense and object-pronoun changes, and any sentence whose
 * English cannot be re-inflected safely, become RECOGNITION items: read the
 * new Spanish, answer a plain-English question about it.
 * ========================================================================== */
import type { BankSentence } from '../content/schema';
import type { Person, TenseKey } from '../engine';
import { enChangePerson, enNegate, enPronounFor, glossForms } from './english';
import { changePerson, changeTense, negate, pronominalise } from './reinflect';
import { hash32, itemId, rng, shuffle, shuffled } from './rng';
import {
  ARTICLES, cliticFor, isFunctionWord, isPluralWord, low, nounGender, parseClause, sentenceKey, timeSpans, toToks, verbReadings,
  type Clause,
} from './spanish';
import type { RecombineItem, TransformOp } from './types';

export interface RecombineOptions {
  seed?: number | string;
  /** Spanish the learner has seen (the bank, at least). Recombinations equal to any are dropped. */
  known?: Iterable<string>;
  /** Bank sentences to draw noun-phrase distractors from (object-pronoun items). */
  bank?: readonly BankSentence[];
}

const WHO: Readonly<Record<string, string>> = { yo: 'me (I)', 'tú': 'you', 'él/ella': 'him or her', nosotros: 'us (we)', ellos: 'them (they)' };
const NUMERALS = /^(una?|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|veinte|treinta|cien|mil)$/;
const WHEN = ['Now, or usually', 'In the past', 'In the future'] as const;
const whenOf = (t: TenseKey) => (t === 'presente' ? 0 : t === 'futuro' ? 2 : 1);

function base(s: BankSentence, key: string, mode: RecombineItem['mode'], transform: TransformOp, es: string): RecombineItem {
  return { id: itemId('recombine', s.id, key), generator: 'recombine', sentenceId: s.id, nodes: [...s.targets], kind: 'recombine', mode, transform, es, accept: [] };
}

function femFor(s: BankSentence, c: Clause, es: string): boolean {
  if (/\b(ella|ellas|nosotras)\b/i.test(es)) return true;
  if (/\b(él|ellos|nosotros)\b/i.test(es)) return false;
  if (c.subject >= 0) return false;
  return hash32(s.id) % 2 === 1;                       // a dropped subject: either is right; pick stably
}

/** Who-is-it recognition: options never include a second right answer. */
function whoItem(s: BankSentence, p: Person, es: string, r: () => number): RecombineItem | null {
  const clash: Person[] = p === 'él/ella' || p === 'ellos' ? ['tú'] : [];
  const labels = (['yo', 'tú', 'él/ella', 'nosotros', 'ellos'] as Person[]).filter((x) => x === p || !clash.includes(x));
  const right = WHO[p];
  const wrong = shuffle(labels.filter((x) => x !== p).map((x) => WHO[x]), r).slice(0, 3);
  const { options, answer } = shuffled(right, wrong, r);
  return { ...base(s, `who:${p}`, 'recognition', { op: 'person', to: p }, es), question: 'Who is this about?', options, answer };
}

/** Every noun phrase (definite determiner + noun) in the bank, with its clitic. */
function nounPhrases(bank: readonly BankSentence[]): Array<{ np: string; clitic: string }> {
  const out = new Map<string, string>();
  for (const b of bank) {
    const ts = toToks(b.es);
    const timed = new Set(timeSpans(ts).flatMap(([a, z]) => Array.from({ length: z - a }, (_, k) => a + k)));
    for (let i = 0; i + 1 < ts.length; i++) {
      const det = low(ts[i]), noun = low(ts[i + 1]);
      if (!/^(el|la|los|las)$/.test(det) || !noun || isFunctionWord(noun) || ts[i].post) continue;
      if (timed.has(i) || NUMERALS.test(noun) || verbReadings(noun).length || /^[A-ZÁÉÍÓÚ]/.test(ts[i + 1].core)) continue;
      const g = nounGender(noun, det);
      if (!g) continue;
      out.set(`${det} ${noun}`, cliticFor(g, /s$/.test(det) || (isPluralWord(noun) && !ARTICLES.has(noun))));
    }
  }
  return [...out].map(([np, clitic]) => ({ np, clitic }));
}

export function recombinations(s: BankSentence, opts: RecombineOptions = {}): RecombineItem[] {
  const c = parseClause(s.es, s.en);
  if (!c) return [];
  const known = new Set<string>([sentenceKey(s.es)]);
  for (const k of opts.known ?? []) known.add(sentenceKey(k));
  for (const b of opts.bank ?? []) known.add(sentenceKey(b.es));
  const novel = (es: string) => !known.has(sentenceKey(es));
  const r = rng(`${opts.seed ?? 0}|${s.id}|recombine`);
  const out: RecombineItem[] = [];
  const { inf, tense } = c.choice;
  const gloss = glossForms(inf) ?? undefined;
  const perfect = c.participle >= 0;

  // person (production when the English follows; else recognition)
  for (const p of ['yo', 'tú', 'él/ella', 'nosotros', 'ellos'] as Person[]) {
    if (p === c.choice.person) continue;
    const re = changePerson(c, p, { en: s.en });
    if (!re || !novel(re.es)) continue;
    const pr = enPronounFor(p, femFor(s, c, re.es));
    const en = pr ? enChangePerson(s.en, pr, tense) : null;
    if (en) {
      out.push({ ...base(s, `person:${p}`, 'production', { op: 'person', to: p }, re.es), en });
      // person + negation: further from anything stored
      const c2 = parseClause(re.es, en);
      const neg = c2 ? negate(c2) : null;
      const enN = neg ? enNegate(en, tense, gloss, { perfect }) : null;
      if (neg && enN && novel(neg.es)) out.push({ ...base(s, `person:${p}+negate`, 'production', { op: 'person', to: p }, neg.es), en: enN.text });
    } else {
      const who = whoItem(s, p, re.es, r);
      if (who) out.push(who);
    }
  }

  // negation
  const neg = negate(c);
  if (neg && novel(neg.es)) {
    const enN = enNegate(s.en, tense, gloss, { perfect });
    if (enN) out.push({ ...base(s, 'negate', 'production', { op: 'negate' }, neg.es), en: enN.text });
    else {
      const { options, answer } = shuffled('No — it is not so', ['Yes — it is so'], r);
      out.push({ ...base(s, 'negate', 'recognition', { op: 'negate' }, neg.es), question: 'Is this sentence saying yes or no?', options, answer });
    }
  }

  // tense: recognition only
  const tenses: TenseKey[] = (['presente', /^(ser|estar|tener|saber|conocer|querer|poder)$/.test(inf) ? 'imperfecto' : 'preterito', 'futuro'] as TenseKey[]).filter((t) => t !== tense);
  for (const t of tenses) {
    if (tense === 'imperfecto' && t === 'preterito') continue;
    const re = changeTense(c, t, { stripTime: true });
    if (!re || !novel(re.es)) continue;
    const { options, answer } = { options: [...WHEN], answer: whenOf(t) };
    out.push({ ...base(s, `tense:${t}`, 'recognition', { op: 'tense', to: t }, re.es), question: 'When is this?', options, answer });
  }

  // object pronoun: recognition, "what could it stand for?"
  const pr = pronominalise(c);
  if (pr && novel(pr.es) && opts.bank) {
    const others = nounPhrases(opts.bank).filter((x) => x.clitic !== pr.clitic && x.np !== pr.np.toLowerCase());
    const byClitic = new Map<string, string>();
    for (const o of shuffle(others, r)) if (!byClitic.has(o.clitic)) byClitic.set(o.clitic, o.np);
    const ds = [...byClitic.values()].slice(0, 3);
    if (ds.length) {
      const { options, answer } = shuffled(pr.np.toLowerCase(), ds, r);
      out.push({
        ...base(s, 'pronoun', 'recognition', { op: 'pronoun', np: pr.np }, pr.es), accept: pr.accept,
        question: `What could "${pr.clitic}" stand for here?`, options, answer,
      });
    }
  }
  return out;
}
