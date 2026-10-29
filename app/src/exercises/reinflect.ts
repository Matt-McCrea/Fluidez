/* ============================================================================
 * RE-INFLECTION — a known sentence turned into a new one by the engine:
 * another person, another tense, negated, its object replaced by a pronoun.
 *
 * Each function returns null when it is not sure. The rules for "sure":
 *  - the verb is the sentence's only finite verb and its reading is unique
 *    (parseClause);
 *  - the new verb form exists, is target-variety (never vosotros), and the
 *    analyser reads it back as exactly the requested tense and person;
 *  - everything that agrees with the change (reflexive pronoun, possessive,
 *    predicate adjective) is changed with it, or the sentence is refused.
 * ========================================================================== */
import { attachEnclitic, PERSONS, verbByInf } from '../engine';
import type { Person, TenseKey } from '../engine';
import { conjugateBareCells } from '../engine/conjugate';
import {
  ARTICLES, CLITICS, DEMONSTRATIVES, EXPERIENCER, POLARITY, POSSESSIVES, PREPOSITIONS, REFLEXIVE, SUBJECT_PRONOUNS, TIME_WORDS,
  cliticFor, enSubject, gerundOf, insertTok, isFunctionWord, isInfinitive, isPluralWord, low, nounGender,
  parseClause, pluralize, removeToks, render, replaceCore, singularize, splitEnclitic, timeSpans, verbReadings,
  type Clause, type Tok,
} from './spanish';

/** Verbs whose grammatical subject is not the doer (me gusta, me duele):
 *  a person swap of the verb would change who likes what, not who speaks. */
export { EXPERIENCER };
const WEATHER = new Set(['llover', 'nevar', 'tronar', 'amanecer', 'anochecer']);
const COPULAS = new Set(['ser', 'estar', 'sentirse', 'quedarse', 'ponerse']);
/** Verbs that never take a direct object noun phrase. */
const NO_DOBJ = new Set(['ser', 'estar', 'haber', 'parecer', 'llamarse', 'ir', 'irse', 'venir', 'salir', 'llegar', 'vivir', 'quedar', 'quedarse', 'sentirse', 'volver', 'regresar', 'entrar', 'caminar', 'correr', 'viajar', 'trabajar', ...EXPERIENCER]);
/** Verbs that let an infinitive's pronoun climb (lo quiero ver = quiero verlo). */
export const CLIMBING = new Set(['querer', 'poder', 'deber', 'ir', 'tener', 'saber', 'empezar', 'comenzar', 'acabar', 'volver', 'estar', 'seguir', 'necesitar', 'pensar', 'soler', 'intentar', 'tratar', 'preferir', 'esperar']);

/** Bare (no reflexive pronoun) target form of a verb, or null. */
export function form(inf: string, tense: TenseKey, person: Person): string | null {
  const v = verbByInf(inf);
  if (!v || person === 'vosotros') return null;
  const cell = conjugateBareCells(v, tense)[PERSONS.indexOf(person)];
  if (!cell?.form || cell.form.includes(' ')) return null;
  // round-trip: the analyser must read it back as exactly this cell
  const back = verbReadings(cell.form).some((a) => a.tense === tense && a.person === person && (a.inf === inf || a.inf === inf.replace(/se$/, '') || a.inf + 'se' === inf));
  return back ? cell.form : null;
}

/** Subject pronoun for a person, keeping the gender of the one replaced. */
export function pronounFor(p: Person, was?: string): string {
  const fem = was ? /^(ella|ellas|nosotras)$/.test(was) : false;
  switch (p) {
    case 'yo': return 'yo';
    case 'tú': return 'tú';
    case 'él/ella': return fem ? 'ella' : 'él';
    case 'nosotros': return fem ? 'nosotras' : 'nosotros';
    case 'ellos': return fem ? 'ellas' : 'ellos';
    default: return 'vosotros';
  }
}

const PLURAL_PERSON = (p: Person) => p === 'nosotros' || p === 'ellos' || p === 'vosotros';
const OWN_POSSESSIVE: Readonly<Partial<Record<Person, RegExp>>> = { yo: /^mis?$/, 'tú': /^tus?$/, nosotros: /^nuestr[oa]s?$/ };

function possessiveFor(p: Person, plural: boolean, gender: 'm' | 'f' | null): string | null {
  switch (p) {
    case 'yo': return plural ? 'mis' : 'mi';
    case 'tú': return plural ? 'tus' : 'tu';
    case 'él/ella': case 'ellos': return plural ? 'sus' : 'su';
    case 'nosotros': return gender ? 'nuestr' + (gender === 'm' ? 'o' : 'a') + (plural ? 's' : '') : null;
    default: return null;
  }
}

/** Is the subject a pronoun or dropped (so a person swap is safe)? Anything
 *  before the verb group other than a pronoun, a time word, a question word
 *  or a conjunction may be a noun subject: mi hermana trabaja. */
function pronounSubject(c: Clause, en?: string): boolean {
  // a question phrase in front of the verb ("¿A qué hora te levantas?") is not a subject
  const qPhrase = c.subject < 0 && /^(qué|dónde|cuándo|cómo|quién|cuál|cuánto|cuántos|cuánta|cuántas|a|de|con|para|por|en|desde|hasta)$/.test(low(c.toks[0]))
    && c.toks.slice(0, c.groupStart).some((t) => /^(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuántos|cuánta|cuántas)$/.test(low(t)))
    && c.toks.some((t) => /\?/.test(t.post));
  if (qPhrase) return en ? !!enSubject(en) : false;
  for (let i = 0; i < c.groupStart; i++) {
    const l = low(c.toks[i]);
    if (i === c.subject || TIME_WORDS.has(l)) continue;
    if (timeSpans(c.toks).some(([a, b]) => i >= a && i < b)) continue;
    if (/^(qué|dónde|cuándo|cómo|por|y|pero|también|a|quién|cuál|cuánto|cuántos|cuánta|cuántas)$/.test(l)) continue;
    return false;
  }
  if (c.subject >= 0) return true;
  // dropped subject: the English must have a pronoun subject (or none given)
  return en ? !!enSubject(en) : false;
}

/** Predicate words after a copula that agree in number with the subject. */
function agreePredicate(ts: Tok[], from: number, plural: boolean): Tok[] | null {
  let out = ts;
  let j = from;
  while (j < out.length && /^(muy|bastante|tan|demasiado|más|menos|un|poco|algo|siempre|nunca|ya|también|hoy|todavía)$/.test(low(out[j]))) {
    if (low(out[j]) === 'un' && low(out[j + 1]) !== 'poco') return null;
    j++;
  }
  let changed = 0;
  while (j < out.length) {
    const l = low(out[j]);
    if (!l) break;
    if (ARTICLES.has(l) || DEMONSTRATIVES.has(l) || POSSESSIVES.has(l)) return null;    // es un libro: no plural subject fits
    if (PREPOSITIONS.has(l) || /^(bien|mal|mejor|peor|aquí|allí|allá|ahí|así|lejos|cerca|que|en|de)$/.test(l) || /ndo$/.test(l) || TIME_WORDS.has(l)) break;
    if (isFunctionWord(l) && l !== 'y') break;
    if (l === 'y') { j++; continue; }
    const nw = plural ? (isPluralWord(l) ? l : pluralize(l)) : (isPluralWord(l) ? singularize(l) : l);
    if (nw !== l) out = replaceCore(out, j, nw);
    changed++;
    if (out[j].post) break;                                                            // a comma or the full stop ends it
    j++;
    if (changed >= 3) break;
  }
  return out;
}

export interface Rewritten { es: string; toks: Tok[]; accept: string[] }

/** The same sentence said about another person: como > comemos. */
export function changePerson(c: Clause, to: Person, opts: { en?: string; pronoun?: 'keep' | 'drop' | 'add' } = {}): Rewritten | null {
  const { inf, tense, person: from } = c.choice;
  if (to === from || to === 'vosotros') return null;
  const lexInf = c.participle >= 0 ? (verbReadings(low(c.toks[c.participle])).length ? null : inf) : inf;
  if (EXPERIENCER.has(inf.replace(/se$/, '')) || WEATHER.has(inf) || lexInf === null) return null;
  if (!pronounSubject(c, opts.en)) return null;
  const nf = form(inf, tense, to);
  if (!nf) return null;
  let ts = replaceCore(c.toks, c.verb, nf);

  // reflexive and object clitics
  if (c.reflexive) {
    const at = c.proclitics[c.proclitics.length - 1];
    ts = replaceCore(ts, at, REFLEXIVE[to]);
  } else {
    for (const at of c.proclitics) if (low(ts[at]) === REFLEXIVE[to] && low(ts[at]) !== 'se') return null; // me ayudas > *me ayudo
  }
  if (c.complement >= 0) {
    const sp = splitEnclitic(low(ts[c.complement]));
    if (sp && sp.clitics.includes(REFLEXIVE[from])) {
      const base = sp.kind === 'inf' ? sp.base : gerundOf(sp.base) ? sp.base : null;
      if (!base) return null;
      const cl = sp.clitics.map((x) => (x === REFLEXIVE[from] ? REFLEXIVE[to] : x)).join('');
      ts = replaceCore(ts, c.complement, attachEnclitic(base, cl));
    } else if (sp && sp.clitics.includes(REFLEXIVE[to]) && REFLEXIVE[to] !== 'se') return null;
  }

  // possessives that belong to the subject
  const ownRe = OWN_POSSESSIVE[from];
  for (let i = 0; i < ts.length; i++) {
    const l = low(ts[i]);
    if (ownRe?.test(l)) {
      const np = possessiveFor(to, /s$/.test(l), nounGender(low(ts[i + 1]) || ''));
      if (!np) return null;
      ts = replaceCore(ts, i, np);
    } else if (from !== 'yo' && from !== 'tú' && from !== 'nosotros' && /^sus?$/.test(l)) {
      return null;                                                                       // su: whose? not safe
    }
  }

  // predicate agreement after a copula
  if (COPULAS.has(inf) && PLURAL_PERSON(from) !== PLURAL_PERSON(to)) {
    const after = (c.participle >= 0 ? c.participle : c.verb) + 1;
    const agreed = agreePredicate(ts, after, PLURAL_PERSON(to));
    if (!agreed) return null;
    ts = agreed;
  }

  // the subject pronoun
  const mode = opts.pronoun ?? 'keep';
  if (c.subject >= 0) {
    if (mode === 'drop') ts = removeToks(ts, c.subject, c.subject + 1);
    else ts = replaceCore(ts, c.subject, pronounFor(to, low(c.toks[c.subject])));
  } else if (mode === 'add') {
    ts = insertTok(ts, c.groupStart, pronounFor(to));
  }
  return { es: render(ts), toks: ts, accept: [] };
}

/** The same sentence in another tense. Refuses a sentence with a time word
 *  (ayer, mañana, siempre…) unless `stripTime`, which removes them. */
export function changeTense(c: Clause, to: TenseKey, opts: { stripTime?: boolean } = {}): Rewritten | null {
  const { inf, tense, person } = c.choice;
  if (to === tense || c.participle >= 0 || WEATHER.has(inf) && person !== 'él/ella') return null;
  if (tense === 'presubj' || tense === 'impsubj' || to === 'presubj' || to === 'impsubj') return null;
  const nf = form(inf, to, person);
  if (!nf) return null;
  // a form shared with the source tense (hablamos) is no change at all
  if (verbReadings(nf).some((a) => a.tense === tense && a.person === person)) return null;
  let ts = replaceCore(c.toks, c.verb, nf);
  const spans = timeSpans(ts);
  if (spans.length) {
    if (!opts.stripTime) return null;
    for (const [a, b] of spans.slice().reverse()) ts = removeToks(ts, a, b);
    if (!ts.some((t) => t.core)) return null;
  }
  return { es: render(ts), toks: ts, accept: [] };
}

/** Remove time words: the structured-input form where only the verb tells you when. */
export function stripTimeWords(ts: readonly Tok[]): Tok[] {
  let out = ts.slice();
  for (const [a, b] of timeSpans(out).slice().reverse()) out = removeToks(out, a, b);
  return out;
}

/** Negate: como > no como, lo veo > no lo veo. Refuses polarity words
 *  (también, ya, algo, siempre…) and sentences already negative. */
export function negate(c: Clause): Rewritten | null {
  if (c.neg >= 0) return null;
  if (/^(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuánta|cuántos|cuántas|por)$/.test(low(c.toks[0]))) return null; // ¿Dónde no vives?
  if (c.toks.some((t) => POLARITY.has(low(t)))) return null;
  const ts = insertTok(c.toks, c.groupStart, 'no');
  return { es: render(ts), toks: ts, accept: [] };
}

/** Make a negative sentence affirmative: no como > como. */
export function affirm(c: Clause): Rewritten | null {
  if (c.neg < 0) return null;
  if (c.toks.some((t, i) => i !== c.neg && POLARITY.has(low(t)))) return null;
  const ts = removeToks(c.toks, c.neg, c.neg + 1);
  return { es: render(ts), toks: ts, accept: [] };
}

export interface Pronominalised extends Rewritten {
  /** The noun phrase replaced, as written ("el libro"). */
  np: string;
  clitic: string;
  gender: 'm' | 'f';
  plural: boolean;
}

const DEFINITE = /^(el|la|los|las|este|esta|estos|estas|ese|esa|esos|esas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras)$/;

/** Replace the direct object with a pronoun: leo el libro > lo leo;
 *  quiero comprar la casa > quiero comprarla (or la quiero comprar). */
export function pronominalise(c: Clause, lexicon?: Readonly<Record<string, 'm' | 'f'>>): Pronominalised | null {
  const comp = c.complement >= 0 ? low(c.toks[c.complement]) : '';
  if (comp && !isInfinitive(comp) && !gerundOf(comp)) return null;                   // already has enclitics
  const head = comp ? (isInfinitive(comp) ? comp : gerundOf(comp)!) : c.choice.inf;
  if (NO_DOBJ.has(head) || (comp && !CLIMBING.has(c.choice.inf.replace(/se$/, '')))) return null;
  if (c.reflexive && !comp) return null;
  const j = (c.complement >= 0 ? c.complement : c.participle >= 0 ? c.participle : c.verb) + 1;
  const det = low(c.toks[j]);
  if (!DEFINITE.test(det) || low(c.toks[j - 1]) === 'a') return null;
  const noun = low(c.toks[j + 1]);
  if (!noun || isFunctionWord(noun) || verbReadings(noun).length && !/[aeo]s?$/.test(noun)) return null;
  let end = j + 2;
  // one adjective may follow, if the noun has no comma after it
  const adj = low(c.toks[end]);
  if (adj && !c.toks[j + 1].post && !isFunctionWord(adj) && !TIME_WORDS.has(adj) && !PREPOSITIONS.has(adj)) end++;
  // the NP must end the sentence, or be followed only by time words
  const spans = timeSpans(c.toks);
  let k = end;
  while (k < c.toks.length) {
    const span = spans.find(([a]) => a === k);
    if (!span) return null;
    k = span[1];
  }
  if (c.toks[end - 1].post && /[,;]/.test(c.toks[end - 1].post)) return null;
  const plural = /s$/.test(det) || isPluralWord(noun) && !/^(el|la|este|esta|ese|esa|mi|tu|su|nuestro|nuestra)$/.test(det);
  const gender = nounGender(noun, /^(mi|mis|tu|tus|su|sus)$/.test(det) ? undefined : det, lexicon);
  if (!gender) return null;
  const clitic = cliticFor(gender, plural);
  const np = c.toks.slice(j, end).map((t) => t.core).join(' ');

  let ts = removeToks(c.toks, j, end);
  const accept: string[] = [];
  if (comp) {
    // enclitic on the infinitive / gerund, proclitic before the finite verb as an alternative
    const encl = attachEnclitic(comp, clitic);
    const tsEncl = replaceCore(ts, c.complement, encl);
    if (!c.proclitics.length) accept.push(render(insertTok(ts, c.verb, clitic)));
    ts = tsEncl;
  } else {
    if (c.proclitics.length > 1) return null;
    if (c.proclitics.length === 1) {
      const p = low(ts[c.proclitics[0]]);
      if (p === 'le' || p === 'les') ts = replaceCore(ts, c.proclitics[0], 'se');
      else if (!/^(me|te|nos|se)$/.test(p)) return null;
    }
    ts = insertTok(ts, c.verb, clitic);
  }
  return { es: render(ts), toks: ts, accept, np, clitic, gender, plural };
}

