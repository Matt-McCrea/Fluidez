/* ============================================================================
 * ACCEPTED VARIANTS of a model answer.
 *
 * The course teaches neutral Latin American Spanish. A learner is RIGHT if
 * they write any of:
 *  - the model, or any `accept` the author listed;
 *  - the same sentence in another register of "you", when the English
 *    leaves it open: tú, usted, ustedes. "Do you speak English?" is
 *    ¿Hablas inglés?, ¿Habla (usted) inglés? and ¿Hablan (ustedes) inglés?;
 *  - a Peninsular form: vosotros for plural "you", coche for carro,
 *    ordenador for computadora, conducir for manejar. Accepted, and FLAGGED
 *    (variant: 'peninsular') so the UI can name the Latin American word.
 *    Never required, never produced as a model answer.
 * ========================================================================== */
import { PERSONS, verbByInf } from '../../engine';
import type { Person } from '../../engine';
import { conjugateBareCells } from '../../engine/conjugate';
import { changePerson } from '../../exercises/reinflect';
import {
  DETERMINERS, EXPERIENCER, TIME_WORDS, compoundParticiple, enSubject, enWords, enYou, finiteCandidates, gerundOf, isFunctionWord, isInfinitive, low,
  otherGender, parseClause, render, replaceCore, splitEnclitic, toToks, verbReadings, type Clause, type Tok,
} from '../../exercises/spanish';
import { clauseOrderVariants, movedPhraseVariants } from './reorder';
import { changed, type Swap } from './swaps';
import { agreeWithNoun, synonymVariants } from './synonyms';
import { copulaVariants, futureVariants, perfectoVariants } from './tense-swaps';

export type Register = 'tú' | 'usted' | 'ustedes' | 'vosotros';

export interface Variant {
  es: string;
  /** Set when the variant is Peninsular (accepted, flagged). */
  variant?: 'peninsular';
  /** Which "you" this variant uses, when it uses one. */
  register?: Register;
  /** The author's own form (sentence.es), as opposed to a derived one. */
  model?: boolean;
  /** What this form changed in the card's own sentence. A pass through a swap that touches what the card teaches says so (R13). */
  swaps?: Swap[];
  /** The Note rule this form belongs to (check/traps): right Spanish that carries a point, and says it on the pass. */
  trap?: string;
}

/** Latin American word → Peninsular word. Nouns carry the Peninsular gender
 *  when it differs, so the article can follow. Verbs are re-inflected. */
export const PENINSULAR_NOUNS: Readonly<Record<string, { es: string; gender?: 'm' | 'f' }>> = {
  carro: { es: 'coche' }, computadora: { es: 'ordenador', gender: 'm' }, celular: { es: 'móvil' }, jugo: { es: 'zumo' },
  papa: { es: 'patata' }, durazno: { es: 'melocotón' }, departamento: { es: 'piso' }, lentes: { es: 'gafas', gender: 'f' },
  boleto: { es: 'billete' }, frijoles: { es: 'judías', gender: 'f' }, refrigerador: { es: 'nevera', gender: 'f' },
  computadoras: { es: 'ordenadores', gender: 'm' }, carros: { es: 'coches' }, celulares: { es: 'móviles' }, papas: { es: 'patatas' },
  boletos: { es: 'billetes' }, duraznos: { es: 'melocotones' }, departamentos: { es: 'pisos' }, jugos: { es: 'zumos' },
  saco: { es: 'chaqueta', gender: 'f' }, cuadra: { es: 'manzana' }, mesero: { es: 'camarero' }, mesera: { es: 'camarera' },
};
export const PENINSULAR_VERBS: Readonly<Record<string, string>> = { manejar: 'conducir', rentar: 'alquilar', extrañar: 'echar de menos' };

/** Peninsular variants of one sentence: each LatAm word swapped, with its
 *  article and an adjective right after it following a gender change. */
export function peninsularVariants(es: string, extra: Readonly<Record<string, string>> = {}): string[] {
  const ts = toToks(es);
  const swaps: Array<(t: Tok[]) => Tok[] | null> = [];
  ts.forEach((tok, i) => {
    const w = low(tok);
    const extraTo = extra[w];
    const n = PENINSULAR_NOUNS[w] ?? (extraTo ? { es: extraTo } : undefined);
    if (n) {
      swaps.push((t) => {
        const out = replaceCore(t, i, n.es);
        return n.gender ? agreeWithNoun(out, i) : out;
      });
      return;
    }
    // every reading of an ambiguous form (manejamos: present AND preterite)
    const forms = new Set<string>();
    for (const a of verbReadings(w)) {
      const to = PENINSULAR_VERBS[a.inf];
      if (!to || a.tense === 'imperativo') continue;
      const v = verbByInf(to.split(' ')[0]);
      if (!v) continue;
      const cell = conjugateBareCells(v, a.tense)[PERSONS.indexOf(a.person as Person)];
      if (cell) forms.add(cell.form + (to.includes(' ') ? ' ' + to.split(' ').slice(1).join(' ') : ''));
    }
    for (const f of forms) swaps.push((t) => replaceCore(t, i, f));
  });
  if (!swaps.length) return [];
  const out = new Set<string>();
  // every non-empty subset, up to three swaps (a learner may mix the two)
  const n = Math.min(swaps.length, 3);
  for (let mask = 1; mask < 1 << n; mask++) {
    let t: Tok[] | null = ts;
    // last word first: a swap that joins two words (de la > del) moves only what comes after it
    for (let k = n - 1; k >= 0 && t; k--) if (mask & (1 << k)) t = swaps[k](t);
    if (t) out.add(render(t));
  }
  return [...out];
}

// ---- "you" registers --------------------------------------------------------------

const OBJ_YOU: Readonly<Record<'usted' | 'ustedes', string[]>> = { usted: ['lo', 'la', 'le'], ustedes: ['los', 'las', 'les'] };

/** "You" forms that are not the subject: te (object), ti, contigo, tu, tuyo. */
function swapNonSubjectYou(ts: Tok[], to: 'usted' | 'ustedes', skip: Set<number>): Tok[][] {
  let outs: Tok[][] = [ts];
  ts.forEach((tok, i) => {
    if (skip.has(i)) return;
    const w = low(tok);
    let reps: string[] | null = null;
    // "te sientas", "no te mueves": te in front of a tú form is the verb's own little word, and stays
    if (w === 'te' && verbReadings(low(ts[i + 1])).some((a) => a.person === 'tú' && a.tense !== 'imperativo')) return;
    // "te lo prometo" is "se lo prometo" to usted, never "le lo"
    if (w === 'te') reps = /^(lo|la|los|las)$/.test(low(ts[i + 1])) ? ['se'] : OBJ_YOU[to];
    else if (w === 'ti') reps = [to];
    else if (w === 'contigo') reps = [`con ${to}`];
    else if (w === 'tu') reps = ['su'];
    else if (w === 'tus') reps = ['sus'];
    else if (/^tuy[oa]s?$/.test(w)) reps = [w.replace(/^tuy/, 'suy')];
    if (!reps) return;
    const next: Tok[][] = [];
    for (const o of outs) for (const r of reps) next.push(replaceCore(o, i, r));
    outs = next;
  });
  return outs;
}

function vosotrosFrom(es: string, en: string): string | null {
  const c = parseClause(es, en);
  if (!c || c.choice.person !== 'ellos') return null;
  const v = verbByInf(c.choice.inf);
  if (!v) return null;
  const cell = conjugateBareCells(v, c.choice.tense)[PERSONS.indexOf('vosotros')];
  if (!cell) return null;
  let ts = replaceCore(c.toks, c.verb, cell.form);
  if (c.subject >= 0) ts = replaceCore(ts, c.subject, 'vosotros');
  if (c.reflexive) ts = replaceCore(ts, c.proclitics[c.proclitics.length - 1], 'os');
  ts.forEach((t, i) => { if (/^sus?$/.test(low(t))) ts = replaceCore(ts, i, low(t) === 'su' ? 'vuestro' : 'vuestros'); });
  return render(ts);
}

/** Dative clitic for each "you" with gustar and kin: te gusta, le gusta, les gusta. */
const DATIVE_YOU: Readonly<Record<'tú' | 'usted' | 'ustedes', string>> = { tú: 'te', usted: 'le', ustedes: 'les' };

/** "¿Le gusta el café?" for "Do you like coffee?": with gustar and kin the
 *  clitic is the "you", and the model's usted is as good as tú or ustedes. */
function dativeYou(ts: Tok[], en: string, wants: ReadonlyArray<'tú' | 'usted' | 'ustedes'>): Variant[] {
  if (ts.some((t) => /^(usted|ustedes|ti)$/.test(low(t)))) return [];
  const verbOf = (i: number) => ts.slice(i + 1, i + 3).flatMap((x) => verbReadings(low(x))).find((a) => EXPERIENCER.has(a.inf));
  const at = ts.findIndex((t, i) => /^les?$/.test(low(t)) && verbOf(i));
  if (at < 0 || !youDoesIt(en, verbOf(at)?.inf)) return [];
  // "¿Dónde compraste el café que le gusta a Hernando?": a verb before it, and the le is in someone else's clause
  if (finiteCandidates(ts).some((c) => c.index < at)) return [];
  const own = low(ts[at]) === 'le' ? 'usted' : 'ustedes';
  return wants.filter((to) => to !== own).map((to) => ({ es: render(replaceCore(ts, at, DATIVE_YOU[to])), register: to }));
}

/** English verbs that can frame a clause about someone else ("how old do you think Mariana is"), and the Spanish
 *  verbs that do say that: "¿Qué opina?" is the "you" thinking, "¿Cuántos años tendrá Mariana?" is not. */
const EN_FRAME = /^(think|reckon|suppose|guess|believe|imagine|figure|mean|say|know|hear|see|feel|hope|expect)$/;
const ES_FRAME = /^(creer|pensar|opinar|suponer|imaginar|imaginarse|parecer|saber|conocer|decir|oír|escuchar|ver|sentir|sentirse|esperar|querer)$/;

/** Is "you" who does what this Spanish verb says? Not when the English has another subject after it ("what do you
 *  mean they closed"), and not when "you" only frames a clause about someone else. */
function youDoesIt(en: string, inf: string | undefined): boolean {
  const you = enSubject(en);
  if (!you || (you.pronoun !== 'you' && you.pronoun !== 'you all')) return false;
  // the sentence that says "you": what the next line of a dialogue says is another matter
  const after = enWords(en.split(/[.?!\n]/)[0]).slice(you.index + 1);
  if (after.some((w) => /^(they|he|she|we|i|it|there|there.s)$/.test(w))) return false;
  const verb = after.find((w) => !/^(not|really|just|only|actually|still|all)$/.test(w));
  return !verb || !EN_FRAME.test(verb) || (!!inf && ES_FRAME.test(inf));
}

/** Is the one verb of a Spanish clause with no subject the English "you"? Only in the sentence that says "you",
 *  and only with no one else to be its subject. */
function bareYouClause(c: Clause, en: string): boolean {
  if (c.subject >= 0 || !youDoesIt(en, c.choice.inf)) return false;
  const ts = c.toks;
  // "¿Te robaron?", "¿Les cae bien?": the clitic is the "you". "Se escribe" is no usted.
  if (c.proclitics.some((i) => /^(se|te|le|les|os)$/.test(low(ts[i])))) return false;
  // these verbs take a thing, or nothing, for a subject: "Basta con ver", and an "habrá" that is no compound
  if (/^(bastar|convenir|valer)$/.test(c.choice.inf) || (c.choice.inf === 'haber' && c.participle < 0)) return false;
  if (ts.some((t) => /^(ti|contigo)$/.test(low(t)))) return false;
  // "¿Cómo así que no hay nadie?\nQue todos salieron": the "you" is in another sentence
  if (ts.slice(0, c.verb).some((t) => /[.?!…]/.test(t.post))) return false;
  // "¿Qué pensaría Tomás?", "para que los lectores entiendan": a name after the verb or a noun before it is its subject
  const after = ts[c.verb + 1], before = ts[c.groupStart - 1];
  if (after && !ts[c.verb].post && capitalised(after)) return false;
  return !before || !!before.post || isFunctionWord(low(before));
}

/** Every register variant of a model answer the English allows. */
export function registerVariants(es: string, en: string): Variant[] {
  const mode = enYou(en);
  if (mode === 'none') return [];
  const out: Variant[] = [];
  const c = parseClause(es, en);
  // "you" is the English subject and the Spanish names no subject: a bare él/ella verb is usted, a bare ellos verb ustedes
  const bareYou = !!c && bareYouClause(c, en);
  const subjectYou = c && (c.choice.person === 'tú' || (c.subject >= 0 && /^(usted|ustedes)$/.test(low(c.toks[c.subject]))) ||
    (bareYou && (c.choice.person === 'él/ella' || c.choice.person === 'ellos')));
  const fromReg: Register | null = !c ? null
    : c.choice.person === 'tú' ? 'tú'
    : c.subject >= 0 && low(c.toks[c.subject]) === 'usted' ? 'usted'
    : c.subject >= 0 && low(c.toks[c.subject]) === 'ustedes' ? 'ustedes'
    : mode === 'plural' && c.choice.person === 'ellos' ? 'ustedes'
    : bareYou && c.choice.person === 'él/ella' ? 'usted'
    : bareYou && c.choice.person === 'ellos' ? 'ustedes'
    : null;
  // a register tag pins the register, but never turns "you all" into one person
  const wants: Array<'tú' | 'usted' | 'ustedes'> =
    mode === 'formal' ? [fromReg === 'ustedes' ? 'ustedes' : 'usted'] : mode === 'informal' ? ['tú'] : mode === 'plural' ? ['ustedes'] : mode === 'singular' ? ['tú', 'usted'] : ['tú', 'usted', 'ustedes'];
  if (c && subjectYou && fromReg) {
    for (const to of wants) {
      if (to === fromReg) continue;
      const person: Person = to === 'tú' ? 'tú' : to === 'usted' ? 'él/ella' : 'ellos';
      const r = changePerson(c, person, { en, pronoun: 'keep' });
      if (!r) continue;
      let ts = r.toks;
      if (c.subject >= 0) ts = replaceCore(ts, c.subject, to);
      const skip = new Set<number>(c.reflexive ? [c.proclitics[c.proclitics.length - 1]] : []);
      if (to === 'tú') { out.push({ es: render(ts), register: to }); continue; }
      for (const v of swapNonSubjectYou(ts, to, skip)) out.push({ es: render(v), register: to });
    }
    if (mode === 'open' || mode === 'plural') {
      const ustedesForm = fromReg === 'ustedes' ? es : out.find((o) => o.register === 'ustedes')?.es;
      const vos = ustedesForm ? vosotrosFrom(ustedesForm, en) : null;
      if (vos) out.push({ es: vos, register: 'vosotros', variant: 'peninsular' });
    }
  } else {
    // "you" is not the subject: te quiero, es para ti
    const ts = toToks(es);
    const dative = dativeYou(ts, en, wants);
    if (dative.length) return dative;
    if (!ts.some((t) => /^(te|ti|contigo|tu|tus|tuyos?|tuyas?)$/.test(low(t)))) return [];
    if (c?.reflexive && c.choice.person === 'tú') return [];
    // with gustar & co. "te" is an indirect object: only le / les
    const dativeOnly = ts.some((t) => verbReadings(low(t)).some((a) => EXPERIENCER.has(a.inf)));
    for (const to of wants) {
      if (to === 'tú') continue;
      for (const v of swapNonSubjectYou(ts, to, new Set())) {
        if (dativeOnly && v.some((t, i) => low(ts[i]) === 'te' && !/^les?$/.test(low(t)))) continue;
        out.push({ es: render(v), register: to });
      }
    }
  }
  return out;
}

// ---- the speaker's / listener's gender ------------------------------------------

const EN_GENDERED = /\b(he|she|him|her|his|hers|himself|herself|boys?|girls?|guys|ladies|gentlemen|man|woman|men|women|mothers?|fathers?|sons?|daughters?|brothers?|sisters?|husbands?|wife|wives|boyfriends?|girlfriends?|mr|mrs|ms|sir|madam)\b/i;
const COPULA_LIKE = /^(ser|estar|sentirse|quedarse|ponerse)$/;
/** Words between the verb and the adjective that do not agree with it. */
const INTENSIFIER = /^(muy|tan|bastante|poco|algo|más|menos|demasiado|súper|super|realmente|totalmente|completamente|casi)$/;
/** Verbs whose object "te" is also who the adjective after them describes: te veo cansada, te dejo sola. */
const LISTENER_VERBS = new Set(['dejar', 'ver', 'encontrar', 'notar']);

/** Words that end like an adjective after a copula and are not one: adverbs,
 *  conjunctions and the determiners and numbers that open a noun phrase. */
const NOT_PREDICATE = /^(cuando|como|donde|mientras|nada|todo|toda|todos|todas|mucho|mucha|muchos|muchas|tanto|tanta|tantos|tantas|otro|otra|otros|otras|mismo|misma|mismos|mismas|varios|varias|ambos|ambas|cierto|cierta|propio|propia|luego|entonces|ahora|tarde|temprano|pues|sino|aunque|porque|cuatro|cinco|ocho|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cerca|lejos|arriba|abajo|encima|debajo|dentro|adentro|fuera|afuera|delante|adelante|pronto|conmigo|contigo|consigo|esto|eso|aquello|cualquiera|sábado|domingo|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|familia|gente|persona|personas|plata|manos|testigo|testigos)$/;
/** What may follow an adjective that ends the predicate: the end, a mark, a small word, or a word of time. */
const AFTER_PREDICATE = /^(cuando|donde|porque|aunque|mientras|pues|sino|como|ni|e|u|nada|todo|toda|todos|todas|cada|acá|allá|ahí|bien|mal)$/;

/** The other-gender form of the adjective at `j`, or null if the word there is not clearly one. */
function adjectiveAt(ts: readonly Tok[], j: number): string | null {
  const w = low(ts[j]);
  const next = ts[j + 1];
  if (w.length < 4 || NOT_PREDICATE.test(w) || isFunctionWord(w) || verbReadings(w).length || gerundOf(w) || splitEnclitic(w)) return null;
  if (j > 0 && capitalised(ts[j])) return null;                                      // a name
  if (/^sol[oa]s?$/.test(w) && next && !ts[j].post && DETERMINERS.has(low(next))) return null;   // "solo los dos" is only
  // the predicate ends here: "Estoy cansado para salir", not "nos quedamos otra noche"
  if (next && !ts[j].post && !isFunctionWord(low(next)) && !AFTER_PREDICATE.test(low(next)) && !TIME_WORDS.has(low(next))) return null;
  return otherGender(w);
}

/** The first token from `j` on that is not an intensifier ("muy", "un poco"). */
function pastIntensifiers(ts: readonly Tok[], j: number): number {
  while (j < ts.length && (INTENSIFIER.test(low(ts[j])) || (low(ts[j]) === 'un' && low(ts[j + 1]) === 'poco'))) j++;
  return j;
}

/** The adjectives from `from` on in the other gender, or null when none changes. */
function flipPredicate(ts: Tok[], from: number): Tok[] | null {
  let out = ts;
  let j = pastIntensifiers(out, from);
  for (;;) {
    const og = adjectiveAt(out, j);
    if (!og) break;
    out = replaceCore(out, j, og);
    // "orgulloso y contento", "travieso o tranquilo", "cansado y un poco nervioso": one gender all along
    if (out[j].post || !/^(y|e|o|u|ni)$/.test(low(out[j + 1]))) break;
    j = pastIntensifiers(out, j + 2);
  }
  return out === ts ? null : out;
}

const capitalised = (t: Tok) => /^[A-ZÁÉÍÓÚÑ]/.test(t.core);
/** "¿Estás cansado, Tomás?": a name set off by a comma is who is spoken to, and it may tell the gender. */
const namesListener = (ts: readonly Tok[]) => ts.some((t, i) => i > 0 && capitalised(t) && /,$/.test(ts[i - 1].post));
/** "Soy Ana", "Me llamo Ana": the speaker has said who she is. */
const namesSpeaker = (ts: readonly Tok[]) => ts.some((t, i) => i > 0 && capitalised(t) && /^(soy|llamo)$/.test(low(ts[i - 1])));

/** Every first-person (or you, we) clause that says how the speaker is, in the other gender. */
function flipSpeaker(es: string, en: string, ts: Tok[]): Tok[] | null {
  const cands = finiteCandidates(ts);
  const listener = namesListener(ts), speaker = namesSpeaker(ts);
  let out = ts;
  cands.forEach((cand, n) => {
    // the English subject says who the FIRST verb is about; a later clause is read from its own ending alone
    const c = parseClause(es, n === 0 ? en : undefined, { allowMany: true, index: cand.index, reflexiveExperiencer: true });
    if (!c || !COPULA_LIKE.test(c.choice.inf)) return;
    const p = c.choice.person;
    const named = c.subject >= 0 && /^(usted|ustedes)$/.test(low(ts[c.subject]));
    // a bare él/ella or ellos verb is "you" only when "you" is the English subject and no other verb competes
    const bareYou = cands.length === 1 && bareYouClause(c, en) && (p === 'él/ella' || p === 'ellos');
    if (!(p === 'yo' || p === 'tú' || p === 'nosotros' || named || bareYou)) return;
    if (p === 'yo' || p === 'nosotros' ? speaker : listener) return;
    const next = flipPredicate(out, (c.participle >= 0 ? c.participle : c.verb) + 1);
    if (!next) return;
    out = next;
    if (c.subject >= 0) {
      const sw: Record<string, string> = { nosotros: 'nosotras', nosotras: 'nosotros' };
      const pr = low(out[c.subject]);
      if (sw[pr]) out = replaceCore(out, c.subject, sw[pr]);
    }
  });
  return out === ts ? null : out;
}

/** "Te voy a dejar sola": the adjective describes who is being spoken to. */
function flipListener(en: string, ts: Tok[]): Tok[] | null {
  // a name in the sentence ("Te veo preocupada, Mariana") may tell the gender
  if (!/\byou\b/i.test(en) || ts.some((t, i) => i > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(t.core))) return null;
  let out = ts;
  ts.forEach((t, k) => {
    if (low(t) !== 'te') return;
    const v = ts.findIndex((x, j) => j > k && j <= k + 4 && (LISTENER_VERBS.has(low(x)) || verbReadings(low(x)).some((a) => LISTENER_VERBS.has(a.inf))));
    const next = v < 0 ? null : flipPredicate(out, v + 1);
    if (next) out = next;
  });
  return out === ts ? null : out;
}

/** "Estoy cansada" for "I'm tired": the English does not say who is speaking
 *  (or who is spoken to), so either gender is right. Every clause of the
 *  sentence that says how I, we or you are counts, whatever verb comes first.
 *  Only when the English carries no gender of its own. */
export function genderVariants(es: string, en: string): string[] {
  if (EN_GENDERED.test(en)) return [];
  const ts = toToks(es);
  const speaker = flipSpeaker(es, en, ts);
  const listener = flipListener(en, ts);
  const both = speaker && flipListener(en, speaker);
  return [speaker, listener, both].filter((x): x is Tok[] => !!x).map(render);
}

// ---- -ra and -se, habría and hubiera -----------------------------------------------

/** What opens a subordinate clause: the imperfect subjunctive after it is not a polite or a conditional main verb. */
const SUBORDINATOR = /^(si|que|ojalá|aunque|como|cuando|donde|quien|quienes|mientras)$/;

/** Does a subordinator govern token `i`, however far back in the sentence? A comma closes that clause only once it
 *  has its own verb: "Si hubiera sabido, habría venido" ends at the comma, "Si mi hermano, el mayor, hubiera venido" does not. */
function subordinate(ts: readonly Tok[], i: number): boolean {
  const verbs = new Set(finiteCandidates(ts).map((c) => c.index));
  let comma = false, closed = false;
  for (let k = i - 1; k >= 0; k--) {
    if (/[;:.!?…]/.test(ts[k].post)) return false;
    if (ts[k].post.includes(',')) comma = true;
    if (comma && verbs.has(k)) closed = true;
    if (SUBORDINATOR.test(low(ts[k]))) return !closed;
  }
  return false;
}

/** "comer fuera", "fuera de casa": the adverb is spelled like the -ra form of ser and ir. */
function adverbFuera(ts: readonly Tok[], i: number): boolean {
  if (low(ts[i]) !== 'fuera') return false;
  const prev = low(ts[i - 1]);
  return low(ts[i + 1]) === 'de' || !!ts[i].post || isInfinitive(prev) || (!!prev && verbReadings(prev).length > 0);
}

/** Every non-empty subset (up to three swaps) of replacements, rendered. */
function swapSubsets(ts: Tok[], swaps: ReadonlyArray<readonly [number, string]>): string[] {
  const out = new Set<string>();
  const n = Math.min(swaps.length, 3);
  for (let mask = 1; mask < 1 << n; mask++) {
    let t = ts;
    for (let k = 0; k < n; k++) if (mask & (1 << k)) t = replaceCore(t, swaps[k][0], swaps[k][1]);
    out.add(render(t));
  }
  return [...out];
}

const habForm = (tense: 'condicional' | 'impsubj' | 'impsubjse', person: string): string | undefined => {
  const v = verbByInf('haber');
  return v ? conjugateBareCells(v, tense)[PERSONS.indexOf(person as Person)]?.form : undefined;
};

/** hablara and hablase are one tense. The -se form replaces a -ra form only in a subordinate clause (quisiera and
 *  pudiera standing for a conditional do not take -se) or on haber (hubiera and hubiese are both result-clause
 *  forms); the -ra form replaces any -se form. */
export function subjunctiveVariants(es: string): string[] {
  const ts = toToks(es);
  const swaps: Array<readonly [number, string]> = [];
  ts.forEach((tok, i) => {
    if (adverbFuera(ts, i)) return;
    const forms = new Set<string>();
    for (const a of verbReadings(low(tok))) {
      if (a.tense !== 'impsubj' && a.tense !== 'impsubjse') continue;
      if (a.tense === 'impsubj' && a.inf !== 'haber' && !subordinate(ts, i)) continue;
      const v = verbByInf(a.inf.replace(/se$/, ''));
      const cell = v && conjugateBareCells(v, a.tense === 'impsubj' ? 'impsubjse' : 'impsubj')[PERSONS.indexOf(a.person as Person)];
      if (cell && cell.form !== low(tok)) forms.add(cell.form);
    }
    for (const f of forms) swaps.push([i, f]);
  });
  return swaps.length ? swapSubsets(ts, swaps) : [];
}

/** "would have", "could have": what the English of a result clause says, the question "would the café have" too.
 *  "¡Me hubieras gritado!" (you should have), "Según el diario, habría pagado" (reportedly) and "¡Quién hubiera
 *  sabido!" (if only) are not one, and do not swap. */
const EN_RESULT = /\b(would|could|might)\b.* have\b|\b(would|could|might).ve\b/;

/** In the result clause of a past unreal condition, habría llegado and hubiera llegado are the same thing. The
 *  si clause keeps its hubiera. A pass through this swap says which form the card taught. */
export function resultClauseVariants(es: string, en: string): string[] {
  if (!EN_RESULT.test(enWords(en).join(' '))) return [];
  const ts = toToks(es);
  const swaps: Array<readonly [number, string]> = [];
  ts.forEach((tok, i) => {
    if (compoundParticiple(ts, i) < 0 || subordinate(ts, i)) return;
    for (const a of verbReadings(low(tok))) {
      if (a.inf !== 'haber') continue;
      const to = a.tense === 'condicional' ? 'impsubj' : a.tense === 'impsubj' || a.tense === 'impsubjse' ? 'condicional' : null;
      const form = to && habForm(to, a.person);
      if (form && form !== low(tok)) { swaps.push([i, form]); break; }
    }
  });
  return swaps.length ? swapSubsets(ts, swaps) : [];
}

/** The verbs whose conditional and whose -ra form both soften a request: querría and quisiera, podría and pudiera, debería and debiera. */
const SOFTENER = /^(querer|poder|deber)$/;
/** "would", "could", "should": the English of a softened main verb; "would have" is a result clause. */
const EN_SOFTENED = /\b(would|could|should|might)\b/;

/** In a main clause, the conditional and the -ra form of querer, poder and deber are one softened verb: "Querría un café" and
 *  "Quisiera un café". "I would like" also makes quiero one of them. A subordinate -ra is a subjunctive and does not swap. */
export function softenerVariants(es: string, en: string): string[] {
  const e = enWords(en).join(' ');
  if (!EN_SOFTENED.test(e) || /\b(would|could|should|might) have\b|\b(if only|wish)\b/.test(e)) return [];
  const ts = toToks(es);
  const wouldLike = /\bi would like\b/.test(e);
  const swaps: Array<readonly [number, string]> = [];
  ts.forEach((tok, i) => {
    // "¡Quién pudiera!" is a wish, and a clause that hangs on another is not a main verb
    if (subordinate(ts, i) || low(ts[i - 1]) === 'quién') return;
    const forms = new Set<string>();
    for (const a of verbReadings(low(tok))) {
      if (!SOFTENER.test(a.inf) || !['impsubj', 'condicional', 'presente'].includes(a.tense)) continue;
      // quiero is only a softened verb as "I would like"
      if (a.tense === 'presente' && !(wouldLike && a.inf === 'querer' && a.person === 'yo')) continue;
      const v = verbByInf(a.inf);
      if (!v) continue;
      for (const to of ['impsubj', 'condicional', 'presente'] as const) {
        if (to === a.tense || (to === 'presente' && !(wouldLike && a.inf === 'querer' && a.person === 'yo'))) continue;
        const cell = conjugateBareCells(v, to)[PERSONS.indexOf(a.person as Person)];
        if (cell && cell.form !== low(tok)) forms.add(cell.form);
      }
    }
    for (const f of forms) swaps.push([i, f]);
  });
  // one verb changes at a time: a sentence has one softened verb
  return [...new Set(swaps.map(([i, f]) => render(replaceCore(ts, i, f))))];
}

export interface ExpandOptions {
  /** Other Spanish the course accepts for this English (other bank sentences
   *  with the same English: the acceptFor idea from js/gameitems.js). */
  also?: readonly string[];
  /** Extra Peninsular full-sentence variants. */
  peninsular?: readonly string[];
  /** Extra LatAm → Peninsular word swaps (from a lexeme node's `peninsular`). */
  peninsularWords?: Readonly<Record<string, string>>;
}

/** Every accepted form of a sentence's Spanish, flagged. */
export function expandAccepted(s: { es: string; en: string; accept?: readonly string[] }, opts: ExpandOptions = {}): Variant[] {
  const seen = new Set<string>();
  const out: Variant[] = [];
  const add = (v: Variant) => {
    const k = v.es.toLowerCase().replace(/[^a-záéíóúñü ]/g, '').replace(/\s+/g, ' ').trim();
    if (!k || seen.has(k)) return;
    seen.add(k);
    out.push(v);
  };
  /** `from` with its sentence changed to `es`, by a swap of this kind. */
  const grown = (from: Variant, es: string, kind: Swap['kind']): Variant => ({ ...from, es, model: false, swaps: [...(from.swaps ?? []), { kind, ...changed(from.es, es) }] });
  const base = [s.es, ...(s.accept ?? []), ...(opts.also ?? [])];
  base.forEach((es, i) => add({ es, ...(i === 0 ? { model: true } : {}) }));
  for (const es of base) for (const v of registerVariants(es, s.en)) add({ ...v, swaps: [{ kind: 'register', ...changed(es, v.es) }] });
  for (const v of out.slice()) for (const g of genderVariants(v.es, s.en)) add(grown(v, g, 'gender'));
  for (const v of out.slice()) for (const r of resultClauseVariants(v.es, s.en)) add(grown(v, r, 'result-clause'));
  for (const v of out.slice()) for (const r of subjunctiveVariants(v.es)) add(grown(v, r, 'ra-se'));
  for (const v of out.slice()) for (const r of softenerVariants(v.es, s.en)) add(grown(v, r, 'cond-ra'));
  // where a clause or a phrase sits, and the other tense that says the same
  for (const v of out.slice()) {
    const ts = toToks(v.es);
    for (const r of clauseOrderVariants(v.es, ts)) add(grown(v, r, 'clause-order'));
    for (const r of movedPhraseVariants(v.es, ts)) add(grown(v, r, 'moved-phrase'));
    for (const x of [...futureVariants(v.es, s.en), ...perfectoVariants(v.es, s.en), ...synonymVariants(v.es, s.en), ...copulaVariants(v.es)]) add({ ...v, es: x.es, model: false, swaps: [...(v.swaps ?? []), x.swap] });
  }
  for (const es of opts.peninsular ?? []) add({ es, variant: 'peninsular' });
  for (const v of out.slice()) {
    for (const p of peninsularVariants(v.es, opts.peninsularWords)) add({ ...grown(v, p, 'peninsular'), variant: 'peninsular' });
  }
  return out;
}
