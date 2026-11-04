/* ============================================================================
 * SYNONYM CLASSES: words that are the same thing, said another way.
 *
 * The Peninsular table (variants.ts) swaps one word for the Spain word and
 * makes the article and the adjective after it follow the new gender. This is
 * the same swap for words that are both right here: mamá and madre, dinero and
 * plata, empezar and comenzar, de todas formas and de todos modos. A class
 * lists the words that stand for each other; a word swapped for another of its
 * class is the model with that one word changed, and only that.
 *
 * What makes it safe is what each class refuses. A word that is also another
 * word (billete is a ticket and a banknote, cuarto is a room and a quarter)
 * needs the English to say which, or the words around it to be the right
 * ones. The class is closed, small, and every member was checked against the
 * rows that use it.
 * ========================================================================== */
import { PERSONS, verbByInf } from '../engine';
import type { Person } from '../engine';
import { conjugateBareCells } from '../engine/conjugate';
import { closedClass } from './support/lexicon';
import { detGender, gerundOf, isFunctionWord, isInfinitive, isPluralWord, low, otherGender, participleOf, pluralize, render, replaceCore, splitEnclitic, toToks, verbReadings, type Tok } from './support/spanish';
import { changed } from './swaps';
import type { Swapped } from './tense-swaps';

type Gender = 'm' | 'f';

interface Member {
  es: string;
  /** Of a noun: its gender, so the article and an adjective after it can follow. */
  g?: Gender;
  /** The two words before it, joined, must match: café is a place after "en el", not a drink. */
  after?: RegExp;
}
interface Group {
  pos: 'n' | 'adj' | 'v' | 'phr';
  /** The first may be replaced by the rest, and not the other way round. */
  oneWay?: boolean;
  members: Member[];
  /** The English must say it (billete only when it is a ticket) ... */
  onlyEn?: RegExp;
  /** ... or must not (trabajo as work and not as a job). */
  notEn?: RegExp;
  /** The words that follow must not match: terminar de + infinitive is not acabar de. */
  notFollowed?: RegExp;
  /** The words that follow must match: tomar is beber only when the object is a drink. */
  followed?: RegExp;
  /** The word before must not match. */
  notPrev?: RegExp;
}

/** A determiner or a possessive right before: the word is the noun and not a name, an adjective or a title (mi mamá, el chico, el médico). */
const DET_BEFORE = /(^| )(el|la|los|las|un|una|unos|unas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras|este|esta|ese|esa|aquel|aquella|al|del)$/;
const DRINK = /(?<!\p{L})(café|tinto|jugo|agua|cerveza|leche|té|vino|chocolate|gaseosa|aguardiente|refresco|limonada|bebida|aromática)(?!\p{L})/u;
/** "de" and an infinitive after the verb: acabar de + infinitive is just, and terminar de is finishing. */
const DE_INFINITIVE = /^de \p{L}*(ar|er|ir|ír)(se|me|te|lo|la|le|nos|los|las|les)?\b/u;

export const SYNONYM_GROUPS: readonly Group[] = [
  // people
  { pos: 'n', members: [{ es: 'mamá', g: 'f', after: DET_BEFORE }, { es: 'madre', g: 'f', after: DET_BEFORE }] },
  { pos: 'n', members: [{ es: 'papá', g: 'm', after: DET_BEFORE }, { es: 'padre', g: 'm', after: DET_BEFORE }], notFollowed: /^\p{Lu}/u },
  { pos: 'n', members: [{ es: 'médico', g: 'm', after: DET_BEFORE }, { es: 'doctor', g: 'm', after: DET_BEFORE }], notFollowed: /^\p{Lu}/u },
  { pos: 'n', members: [{ es: 'médica', g: 'f', after: DET_BEFORE }, { es: 'doctora', g: 'f', after: DET_BEFORE }], notFollowed: /^\p{Lu}/u },
  // things
  { pos: 'n', members: [{ es: 'dinero', g: 'm' }, { es: 'plata', g: 'f' }], onlyEn: /\b(money|cash)\b/, notEn: /\bsilver\b/ },
  { pos: 'n', members: [{ es: 'celular', g: 'm' }, { es: 'teléfono', g: 'm' }], notEn: /\b(landline|land line|payphone)\b/ },
  { pos: 'n', members: [{ es: 'computador', g: 'm' }, { es: 'computadora', g: 'f' }] },
  { pos: 'n', members: [{ es: 'carro', g: 'm' }, { es: 'auto', g: 'm' }, { es: 'automóvil', g: 'm' }] },
  { pos: 'n', members: [{ es: 'bus', g: 'm' }, { es: 'autobús', g: 'm' }] },
  { pos: 'n', members: [{ es: 'tiquete', g: 'm' }, { es: 'boleto', g: 'm' }, { es: 'billete', g: 'm' }], onlyEn: /\b(ticket|fare)s?\b/ },
  { pos: 'n', members: [{ es: 'nevera', g: 'f' }, { es: 'refrigerador', g: 'm' }] },
  { pos: 'n', members: [{ es: 'habitación', g: 'f' }, { es: 'cuarto', g: 'm', after: DET_BEFORE }], notFollowed: /^(de (hora|kilo|libra|galón|final|siglo|millón|baño)|piso|lugar|puesto|vez|año|día|grado|capítulo|curso|parte|semestre|intento|libro|hijo|hija)\b/ },
  { pos: 'n', members: [{ es: 'salario', g: 'm' }, { es: 'sueldo', g: 'm' }] },
  { pos: 'n', members: [{ es: 'pelo', g: 'm', after: DET_BEFORE }, { es: 'cabello', g: 'm' }], onlyEn: /\bhair\b/ },
  { pos: 'n', members: [{ es: 'puesto', g: 'm', after: DET_BEFORE }, { es: 'cargo', g: 'm', after: DET_BEFORE }], onlyEn: /\b(position|post|role|job)s?\b/ },
  { pos: 'n', members: [{ es: 'pena', g: 'f' }, { es: 'vergüenza', g: 'f' }], onlyEn: /\b(embarrass\w*|ashamed|shy)\b/ },
  { pos: 'n', members: [{ es: 'café', g: 'm' }, { es: 'cafetería', g: 'f' }], onlyEn: /(?<!\p{L})caf[eé]s?(?!\p{L})/u, notEn: /\bcoffee\b/ },
  { pos: 'n', oneWay: true, members: [{ es: 'tinto', g: 'm' }, { es: 'café', g: 'm' }], notEn: /\b(black|dark|small|red|wine)\b/, notPrev: /^vinos?$/ },
  // adjectives, in the masculine singular; the others follow
  { pos: 'adj', members: [{ es: 'bonito' }, { es: 'lindo' }] },
  // verbs, in the dictionary form; the form that stands in the sentence follows
  { pos: 'v', members: [{ es: 'empezar' }, { es: 'comenzar' }] },
  { pos: 'v', members: [{ es: 'contestar' }, { es: 'responder' }], notFollowed: /^(el|al|su|mi|tu|este) (teléfono|celular)\b/ },
  { pos: 'v', members: [{ es: 'regresar' }, { es: 'volver' }], notFollowed: /^(a \p{L}+(ar|er|ir|ír)(se|me|te|lo|la|le|nos|los|las|les)?\b|atrás)/u, notPrev: /^(se|me|te|nos|lo|la|los|las|le|les)$/ },
  { pos: 'v', members: [{ es: 'terminar' }, { es: 'acabar' }], notFollowed: DE_INFINITIVE },
  { pos: 'v', members: [{ es: 'escoger' }, { es: 'elegir' }] },
  { pos: 'v', members: [{ es: 'charlar' }, { es: 'conversar' }] },
  { pos: 'v', members: [{ es: 'tomar' }, { es: 'beber' }], followed: DRINK },
  // words that stay as they are, and phrases
  // "desde luego" is of course, and a stretch of time takes después alone: dos días después, poco después, never dos días luego
  { pos: 'phr', members: [{ es: 'luego' }, { es: 'después' }], notPrev: /^(hasta|desde|poco|mucho|tiempo|rato|ratos|momento|momentos|instante|instantes|segundos?|minutos?|horas?|días?|noches?|tardes?|semanas?|mes|meses|años?|siglos?|décadas?)$/, notFollowed: /^(de|que)\b/ },
  { pos: 'phr', members: [{ es: 'quizás' }, { es: 'quizá' }, { es: 'tal vez' }] },
  { pos: 'phr', members: [{ es: 'enseguida' }, { es: 'en seguida' }, { es: 'de inmediato' }] },
  { pos: 'phr', members: [{ es: 'de todas formas' }, { es: 'de todos modos' }, { es: 'de cualquier forma' }, { es: 'de cualquier manera' }] },
  { pos: 'phr', members: [{ es: 'sin duda' }, { es: 'sin lugar a dudas' }, { es: 'sin ninguna duda' }], notFollowed: /^(alguna|ninguna)\b/ },
  { pos: 'phr', members: [{ es: 'sin embargo' }, { es: 'no obstante' }] },
];

// ---- a noun that changes gender takes its article and its adjective with it -------------------

/** Words before a noun that agree with it in gender, apart from the articles: mucho, tanto, todo, otro, algún, nuestro. */
const GENDERED_BEFORE = new Set(['quant', 'poss', 'dem', 'det']);
/** Words in front of a noun that are the same for both genders, and let the ones before them agree: toda mi plata, los dos cafés, cada computadora. */
const NEVER_AGREE = /^(cada|bastante|cualquier|cualquiera|más|menos|tan|mi|tu|su|mis|tus|sus|medio|sendos|sendas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|mil)$/;
/** A word that closes the noun phrase on its left: only todo stands in front of it (toda la plata), and a mucho or a cierto there belongs to something else (quería mucho este café). */
const CLOSES_PHRASE = /^(el|la|los|las|mi|tu|su|mis|tus|sus|nuestro|nuestra|nuestros|nuestras|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas)$/;

/** The other-gender form of a word standing before a noun, the word itself when it does not agree, or null when it cannot be told. */
function beforeNoun(w: string): string | null {
  if (NEVER_AGREE.test(w)) return w;
  const swap: Record<string, string> = { algún: 'alguna', alguna: 'algún', ningún: 'ninguna', ninguna: 'ningún', primer: 'primera', primera: 'primer', un: 'una', una: 'un' };
  if (swap[w]) return swap[w];
  const dg = detGender(w);
  if (dg) return dg;
  // doscientas computadoras: the hundreds agree, and no other figure does
  if (/cient[oa]s$/.test(w)) return otherGender(w);
  return GENDERED_BEFORE.has(closedClass(w) ?? '') && /[oa]s?$/.test(w) ? otherGender(w) : w;
}

const PREDICATE_VERB = /^(ser|estar|quedar|quedarse|permanecer|seguir|parecer|verse|sentirse|ponerse|resultar|lucir|volverse)$/;
const DEGREE = /^(muy|tan|más|menos|bien|mal|bastante|demasiado|poco|algo|súper|realmente|totalmente|completamente)$/;
/** Is this word a form of a verb that links a subject to an adjective, said of a third person or with no person at all (quedado, estar)? */
function linksThird(w: string): boolean {
  const third = verbReadings(w).some((a) => PREDICATE_VERB.test(a.inf) && (a.person === 'él/ella' || a.person === 'ellos'));
  return third || PREDICATE_VERB.test(participleOf(w) ?? '') || (isInfinitive(w) && PREDICATE_VERB.test(w));
}
/** A word after a linking verb or a word of degree that takes a gender. Lleno is also a form of llenar, and here it is not one. */
const adjectiveLike = (w: string | undefined): w is string => !!w && !!otherGender(w) && !closedClass(w) && !isFunctionWord(w) && !gerundOf(w);
const ofGender = (w: string, g: Gender) => (g === 'm' ? /os?$/ : /as?$/).test(w);

/**
 * Is there something after position `from` that would still have to agree with a noun of gender `was`? A pronoun that points back
 * ("no lo gasto", "pedirla prestada", "hay que comprar otra", "como este"), or an adjective tied to it by a linking verb or a word of
 * degree ("quedó cerrado", "tan pequeño", "bien iluminado"). Nothing here can tell what such a word goes with, so the form is not made.
 */
function pointsBack(ts: readonly Tok[], from: number, was: Gender): boolean {
  const object = was === 'm' ? /^(lo|los)$/ : /^(la|las)$/;
  const pronoun = was === 'm' ? /^(él|este|ese|aquel|estos|esos|aquellos|otro|otros|mismo|mismos|uno|unos|ninguno|alguno|suyo|suyos)$/ : /^(ella|esta|esa|aquella|estas|esas|aquellas|otra|otras|misma|mismas|una|unas|ninguna|alguna|suya|suyas)$/;
  for (let j = from; j < ts.length; j++) {
    const w = low(ts[j]);
    const next = ts[j + 1] && !ts[j].post ? low(ts[j + 1]) : undefined;
    // a la cocina, compró la cuenta: an article, whatever the next word might also be
    const prev = low(ts[j - 1]);
    const article = /^(en|de|a|con|por|para|sin|sobre|entre|hasta|desde|hacia)$/.test(prev) || verbReadings(prev).length > 0;
    if (object.test(w) && !article && !!next && verbReadings(next).length > 0) return true;
    if (splitEnclitic(w)?.clitics.some((c) => object.test(c))) return true;
    // un computador, la cual: the relative keeps the old noun's gender
    if (next && /^(cual|cuales)$/.test(next) && (was === 'm' ? /^(el|los)$/ : /^(la|las)$/).test(w)) return true;
    // a demonstrative or an otro with no noun of its own
    if (pronoun.test(w) && (!next || isFunctionWord(next))) return true;
    if (!linksThird(w) && !DEGREE.test(w)) continue;
    let k = j + 1;
    while (DEGREE.test(low(ts[k]))) k++;
    const adj = ts[k] ? low(ts[k]) : undefined;
    if (adjectiveLike(adj) && ofGender(adj, was)) return true;
  }
  return false;
}

/**
 * The noun at `i` has just been swapped for one of the other gender: the words before it that agree with it, and an
 * adjective right after it, follow. The contractions are two words here: del and al before a feminine, de la and a la
 * before a masculine. A predicate adjective of a copula right after it ("mi computadora es nueva") follows too.
 *
 * `was` is the gender the noun had. The result is null when something that should agree cannot be found or cannot be made to
 * (an adjective before the noun, a predicate that is longer than one adjective, a second adjective after "y", a pronoun further
 * on that points back): the form is not made rather than made wrong.
 */
export function agreeWithNoun(ts: readonly Tok[], i: number, was: Gender): Tok[] | null {
  let out = ts.map((t) => ({ ...t }));
  const det = low(out[i - 1]);
  let phrase = i;                                       // where the noun phrase starts, once its determiners are found
  if (det === 'del' || det === 'al') { out = replaceCore(out, i - 1, det === 'del' ? 'de la' : 'a la'); phrase = -1; }
  else if (det === 'la' && /^(de|a)$/.test(low(out[i - 2]))) {
    out = replaceCore(out, i - 2, low(out[i - 2]) === 'de' ? 'del' : 'al');
    out[i - 2].post = out[i - 1].post;
    out.splice(i - 1, 1);
    i--;
    phrase = -1;
  } else {
    // up to three words in front agree: "toda la plata", "tanta plata", "los otros cafés"
    let closed = false;
    for (let k = i - 1; k >= Math.max(0, i - 3); k--) {
      const w = low(out[k]);
      if (!w || out[k].post) break;
      if (closed && !/^tod[oa]s?$/.test(w)) break;
      const flipped = beforeNoun(w);
      if (flipped === null) return null;
      const known = closedClass(w) || isFunctionWord(w);
      // a word before the noun that is not a determiner, a quantifier or a small word: an adjective, whose gender nobody here knows
      if (!known && flipped === w && /[oa]s?$/.test(w) && !verbReadings(w).length && k === i - 1) return null;
      // de, que, en, y: the noun phrase started after it
      if (flipped === w && !NEVER_AGREE.test(w)) break;
      if (flipped !== w) out = replaceCore(out, k, flipped);
      phrase = k;
      closed = CLOSES_PHRASE.test(w);
    }
  }
  const raw = out[i + 1];
  const adj = low(raw);
  // Hernando and vendiendo end like adjectives, and neither is one
  if (raw && !/^\p{Lu}/u.test(raw.core) && /[oa]s?$/.test(adj) && !out[i].post && !gerundOf(adj) && !verbReadings(adj).length && !closedClass(adj) && !isFunctionWord(adj)) {
    const og = otherGender(adj);
    if (og) {
      out = replaceCore(out, i + 1, og);
      // "un cuarto grande y bonito": the second adjective would have to follow, and nothing here knows it is one
      if (/^(y|e|o|u|ni|pero)$/.test(low(out[i + 2]))) return null;
    }
  }
  // a predicate adjective agreeing with this noun as subject: "mi computadora es nueva". In a phrase after a preposition the noun is nobody's subject
  const before = phrase >= 1 ? low(out[phrase - 1]) : '';
  const subject = phrase >= 0 && !isFunctionWord(before) && !closedClass(before);
  let done = i + 1;
  if (subject) {
    const after = out.slice(i + 1, i + 4).map(low);
    const cop = after.findIndex((x) => verbReadings(x).some((a) => /^(ser|estar)$/.test(a.inf) && (a.person === 'él/ella' || a.person === 'ellos')));
    if (cop >= 0 && after.slice(0, cop).every((x) => /^(no|ya|también|siempre|nunca)$/.test(x))) {
      const k = i + 1 + cop + 1 + (after[cop + 1] === 'muy' ? 1 : 0);
      const pa = low(out[k]);
      if (pa && k === out.length - 1) {
        if (adjectiveLike(pa)) out = replaceCore(out, k, otherGender(pa)!);
        done = out.length;
      }
      // the predicate is longer than one adjective ("es igual de pequeño que el tuyo"): what agrees is not found, so the form is not made
      else if (pa && !isFunctionWord(pa)) return null;
    }
  }
  return pointsBack(out, done, was) ? null : out;
}

// ---- finding a member in a sentence -------------------------------------------------------------

const joinLow = (ts: readonly Tok[], from: number, n: number) => ts.slice(from, from + n).map(low).join(' ');

/** How the member stands in the sentence at `i`, and the form to put there for another member. null when it does not stand there. */
function matchAt(g: Group, m: Member, ts: readonly Tok[], i: number): ((to: Member) => string[]) | null {
  const w = low(ts[i]);
  if (g.pos === 'n') {
    const plural = isPluralWord(w) && w === pluralize(m.es);
    if (w !== m.es && !plural) return null;
    return (to) => [plural ? pluralize(to.es) : to.es];
  }
  if (g.pos === 'adj') {
    for (const fem of [false, true]) for (const pl of [false, true]) {
      let f = fem ? otherGender(m.es) : m.es;
      if (!f) continue;
      if (pl) f = pluralize(f);
      if (w !== f) continue;
      return (to) => {
        const t = fem ? otherGender(to.es) : to.es;
        return t ? [pl ? pluralize(t) : t] : [];
      };
    }
    return null;
  }
  if (g.pos === 'v') {
    if (w === m.es) return (to) => [to.es];
    const readings = verbReadings(w).filter((a) => a.inf === m.es && a.tense !== 'imperativo');
    if (!readings.length) return null;
    return (to) => {
      const v = verbByInf(to.es);
      if (!v) return [];
      const forms = new Set<string>();
      for (const a of readings) {
        const cell = conjugateBareCells(v, a.tense)[PERSONS.indexOf(a.person as Person)];
        if (cell?.form && cell.form !== w) forms.add(cell.form);
      }
      return [...forms];
    };
  }
  // a phrase: the words in a row
  const n = m.es.split(' ').length;
  return joinLow(ts, i, n) === m.es ? (to) => [to.es] : null;
}

/** Every sentence that has one word or phrase of the class swapped for another of it. */
export function synonymVariants(es: string, en: string): Swapped[] {
  if (/\n/.test(es)) return [];
  const ts = toToks(es);
  const e = en.toLowerCase();
  const out: Swapped[] = [];
  for (const g of SYNONYM_GROUPS) {
    if ((g.onlyEn && !g.onlyEn.test(e)) || (g.notEn && g.notEn.test(e))) continue;
    for (let mi = 0; mi < g.members.length; mi++) {
      if (g.oneWay && mi > 0) break;
      const m = g.members[mi];
      const span = m.es.split(' ').length;
      ts.forEach((tok, i) => {
        const swap = matchAt(g, m, ts, i);
        if (!swap) return;
        if (m.after && !m.after.test(joinLow(ts, Math.max(0, i - 2), Math.min(2, i)))) return;
        if (g.notFollowed && g.notFollowed.test(ts.slice(i + span, i + span + 2).map((x) => x.core).join(' '))) return;
        if (g.followed && !g.followed.test(ts.slice(i + span, i + span + 3).map(low).join(' '))) return;
        if (g.notPrev && g.notPrev.test(low(ts[i - 1]))) return;
        for (const to of g.members) {
          if (to === m) continue;
          for (const form of swap(to)) {
            // the words of the member give way to the new ones, which take the first one's capital and the last one's marks
            const words = form.split(' ');
            let t = replaceCore(ts, i, words[0]);
            if (span > 1 || words.length > 1) {
              const post = t[i + span - 1].post;
              t[i].post = '';
              t.splice(i + 1, span - 1, ...words.slice(1).map((core) => ({ pre: '', core, post: '' })));
              t[i + words.length - 1].post = post;
            }
            if (m.g && to.g && m.g !== to.g) {
              const agreed = agreeWithNoun(t, i, m.g);
              if (!agreed) continue;
              t = agreed;
            }
            const made = render(t);
            out.push({ es: made, swap: { kind: 'synonym', ...changed(es, made), lemma: m.es } });
          }
        }
      });
    }
  }
  return out;
}
