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
  DETERMINERS, EXPERIENCER, compoundParticiple, detGender, enSubject, enWords, enYou, finiteCandidates, gerundOf, isFunctionWord, isInfinitive, low,
  otherGender, parseClause, render, replaceCore, toToks, verbReadings, type Clause, type Tok,
} from '../../exercises/spanish';

export type Register = 'tú' | 'usted' | 'ustedes' | 'vosotros';

export interface Variant {
  es: string;
  /** Set when the variant is Peninsular (accepted, flagged). */
  variant?: 'peninsular';
  /** Which "you" this variant uses, when it uses one. */
  register?: Register;
  /** The author's own form (sentence.es), as opposed to a derived one. */
  model?: boolean;
  /** Set when the variant swaps one form of the card for another that is right too: a pass that says so. */
  note?: string;
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
        let out = replaceCore(t, i, n.es);
        if (n.gender) {
          const det = low(out[i - 1]);
          const dg = det ? detGender(det) : null;
          if (det && dg && dg !== det) out = replaceCore(out, i - 1, dg);
          const adj = low(out[i + 1]);
          if (adj && /[oa]s?$/.test(adj) && !verbReadings(adj).length) {
            const og = otherGender(adj);
            if (og) out = replaceCore(out, i + 1, og);
          }
          // a predicate adjective agreeing with this noun as subject: "mi computadora es nueva"
          const after = out.slice(i + 1).map(low);
          const cop = after.findIndex((x) => verbReadings(x).some((a) => /^(ser|estar)$/.test(a.inf)));
          if (cop >= 0) {
            const k = i + 1 + cop + 1 + (after[cop + 1] === 'muy' ? 1 : 0);
            const pa = low(out[k]);
            if (pa && k === out.length - 1) { const og = otherGender(pa); if (og) out = replaceCore(out, k, og); }
          }
        }
        return out;
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
    for (let k = 0; k < n && t; k++) if (mask & (1 << k)) t = swaps[k](t);
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
    if (w === 'te') reps = OBJ_YOU[to];
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
function dativeYou(ts: Tok[], enYouSubject: string | null | undefined, wants: ReadonlyArray<'tú' | 'usted' | 'ustedes'>): Variant[] {
  if (enYouSubject !== 'you' && enYouSubject !== 'you all') return [];
  if (ts.some((t) => /^(usted|ustedes|ti)$/.test(low(t)))) return [];
  const at = ts.findIndex((t, i) => /^les?$/.test(low(t)) && ts.slice(i + 1, i + 3).some((x) => verbReadings(low(x)).some((a) => EXPERIENCER.has(a.inf))));
  if (at < 0) return [];
  const own = low(ts[at]) === 'le' ? 'usted' : 'ustedes';
  return wants.filter((to) => to !== own).map((to) => ({ es: render(replaceCore(ts, at, DATIVE_YOU[to])), register: to }));
}

/** Is the one verb of a Spanish clause with no subject the English "you"? Not with a se ("se escribe" is not
 *  a usted) and not when the English has another subject after "you" ("what do you mean they closed"). */
function bareYouClause(c: Clause, en: string): boolean {
  const you = enSubject(en);
  if (c.subject >= 0 || !you || (you.pronoun !== 'you' && you.pronoun !== 'you all')) return false;
  if (c.proclitics.some((i) => low(c.toks[i]) === 'se')) return false;
  return !enWords(en).slice(you.index + 1).some((w) => /^(they|he|she|we|i|it|there)$/.test(w));
}

/** Every register variant of a model answer the English allows. */
export function registerVariants(es: string, en: string): Variant[] {
  const mode = enYou(en);
  if (mode === 'none') return [];
  const out: Variant[] = [];
  const c = parseClause(es, en);
  // "you" is the English subject and the Spanish names no subject: a bare él/ella verb is usted, a bare ellos verb ustedes
  const enYouSubject = enSubject(en)?.pronoun;
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
    const dative = dativeYou(ts, enYouSubject, wants);
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

const EN_GENDERED = /\b(he|she|him|her|his|hers|himself|herself|boy|girl|guys|girls|ladies|gentlemen|man|woman|men|women|mother|father|son|daughter|brother|sister|husband|wife|boyfriend|girlfriend|mr|mrs|ms|sir|madam)\b/i;
const COPULA_LIKE = /^(ser|estar|sentirse|quedarse|ponerse)$/;
/** Words between the verb and the adjective that do not agree with it. */
const INTENSIFIER = /^(muy|tan|bastante|poco|algo|más|menos|demasiado|súper|super|realmente|totalmente|completamente|casi)$/;
/** Verbs whose object "te" is also who the adjective after them describes: te veo cansada, te dejo sola. */
const LISTENER_VERBS = new Set(['dejar', 'ver', 'encontrar', 'notar']);

/** Words that end like an adjective after a copula and are not one: adverbs,
 *  conjunctions and the determiners and numbers that open a noun phrase. */
const NOT_PREDICATE = /^(cuando|como|donde|mientras|nada|todo|toda|todos|todas|mucho|mucha|muchos|muchas|tanto|tanta|tantos|tantas|otro|otra|otros|otras|mismo|misma|mismos|mismas|varios|varias|ambos|ambas|cierto|cierta|propio|propia|luego|entonces|ahora|tarde|temprano|pues|sino|aunque|porque)$/;
/** What may follow an adjective that ends the predicate: the end, a mark, or a small word. */
const AFTER_PREDICATE = /^(cuando|donde|porque|aunque|mientras|pues|sino|como|ni)$/;

/** The other-gender form of the adjective at `j`, or null if the word there is not clearly one. */
function adjectiveAt(ts: readonly Tok[], j: number): string | null {
  const w = low(ts[j]);
  const next = ts[j + 1];
  if (w.length < 4 || NOT_PREDICATE.test(w) || isFunctionWord(w) || verbReadings(w).length || gerundOf(w)) return null;
  if (j > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(ts[j].core)) return null;                        // a name
  if (/^sol[oa]s?$/.test(w) && next && !ts[j].post && DETERMINERS.has(low(next))) return null;   // "solo los dos" is only
  // the predicate ends here: "Estoy cansado para salir", not "nos quedamos otra noche"
  if (next && !ts[j].post && !isFunctionWord(low(next)) && !AFTER_PREDICATE.test(low(next))) return null;
  return otherGender(w);
}

/** The adjectives from `from` on in the other gender, or null when none changes. */
function flipPredicate(ts: Tok[], from: number): Tok[] | null {
  let out = ts;
  let j = from;
  while (j < out.length && (INTENSIFIER.test(low(out[j])) || (low(out[j]) === 'un' && low(out[j + 1]) === 'poco'))) j++;
  for (;;) {
    const og = adjectiveAt(out, j);
    if (!og) break;
    out = replaceCore(out, j, og);
    // "orgulloso y contento"
    if (out[j].post || !/^(y|e)$/.test(low(out[j + 1]))) break;
    j += 2;
    while (j < out.length && INTENSIFIER.test(low(out[j]))) j++;
  }
  return out === ts ? null : out;
}

/** Every first-person (or you, we) clause that says how the speaker is, in the other gender. */
function flipSpeaker(es: string, en: string, ts: Tok[]): Tok[] | null {
  const cands = finiteCandidates(ts);
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

/** Does a subordinator sit in the same clause, just before token `i`? A comma ends the clause. */
function subordinate(ts: readonly Tok[], i: number): boolean {
  for (let k = i - 1; k >= Math.max(0, i - 4); k--) {
    if (/[,;:.!?]/.test(ts[k].post)) return false;
    if (SUBORDINATOR.test(low(ts[k]))) return true;
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

/** In the result clause of a past unreal condition, habría llegado and hubiera llegado are the same thing. The
 *  si clause keeps its hubiera. A pass through this swap says which form the card taught. */
export function resultClauseVariants(es: string): string[] {
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

/** habría and hubiera are both right in the result clause; the card teaches one. */
const RESULT_CLAUSE_NOTE = 'Habría and hubiera both work in the result clause.';

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
  const base = [s.es, ...(s.accept ?? []), ...(opts.also ?? [])];
  base.forEach((es, i) => add({ es, ...(i === 0 ? { model: true } : {}) }));
  for (const es of base) for (const v of registerVariants(es, s.en)) add(v);
  for (const v of out.slice()) for (const g of genderVariants(v.es, s.en)) add({ ...v, es: g, model: false });
  for (const v of out.slice()) for (const r of resultClauseVariants(v.es)) add({ ...v, es: r, model: false, note: RESULT_CLAUSE_NOTE });
  for (const v of out.slice()) for (const r of subjunctiveVariants(v.es)) add({ ...v, es: r, model: false });
  for (const es of opts.peninsular ?? []) add({ es, variant: 'peninsular' });
  for (const v of out.slice()) {
    for (const p of peninsularVariants(v.es, opts.peninsularWords)) add({ es: p, variant: 'peninsular', ...(v.register ? { register: v.register } : {}) });
  }
  return out;
}
