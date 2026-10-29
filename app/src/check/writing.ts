/* ============================================================================
 * WRITING CHECKER — automated verification of free-written Spanish.
 *
 * Because the engine can conjugate every verb and analyse any surface form
 * back to its verb/tense/person, a learner's sentence can be checked against
 * declarative CONSTRAINTS such as "contains the nosotros preterite of comer"
 * or "uses any -ir verb in the subjunctive" — a live, specific checklist
 * instead of a single right/wrong. Revealing a model covers the naturalness
 * constraints can't (self-comparison = Swain's "noticing the gap").
 *
 * Ported from the old js/checker.js. Labels are kept byte-identical (they
 * carry <b> markup for the UI). Behaviour changes, each tested:
 *   - a compound tense counts as the tense its haber builds ("he comido" is a
 *     perfecto — the old checker counted it as all five compound tenses, so
 *     it satisfied "use the pluscuamperfecto" and inflated distinctTenses),
 *     and its auxiliary is not a tense of its own (hubiera comido is not an
 *     imperfecto de subjuntivo);
 *   - the -se imperfect subjunctive and hubiese count as the -ra forms;
 *   - verbForm accepts the pre-2010 spelling (rió) and multi-word expected
 *     forms (he comido, me levanto), which the old token compare never matched.
 * ========================================================================== */
import {
  TENSES, TENSE_LABEL, acceptedForms, analyzeSentence, conjugate, deaccent, personsFor, tokenize, verbByInf,
  type AnyPerson, type SentenceAnalysis, type TenseKey, type VerbClass, type Analysis,
} from '../engine';

type Base = { label?: string };
export type Constraint = Base & (
  | { type: 'verbForm'; inf: string; tense: TenseKey; person: AnyPerson }
  | { type: 'verbFormAny'; inf: string; tense: TenseKey }
  | { type: 'anyVerbInTense'; tense: TenseKey }
  | { type: 'person'; person: AnyPerson }
  | { type: 'infinitiveUsed'; inf: string }
  | { type: 'verbType'; ending: VerbClass }
  | { type: 'containsWord'; word: string }
  | { type: 'containsAny'; words: string[] }
  | { type: 'minWords'; n: number }
  | { type: 'maxWords'; n: number }
  | { type: 'question' }
  | { type: 'negation' }
  | { type: 'regex'; pattern: string; flags?: string }
  | { type: 'connectorFrom'; class: string; n?: number; minLevel?: Band }
  | { type: 'avoidsAny'; words: string[] }
  | { type: 'avoidsPerson'; person: AnyPerson }
  | { type: 'subjunctiveAfter'; trigger: string; within?: number }
  | { type: 'cliticCluster' }
  | { type: 'sePassive' }
  | { type: 'distinctTenses'; n: number }
  | { type: 'minSentences'; n: number }
);

export type Band = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export interface ConnectorItem { es: string; level?: Band }
export interface ConnectorClass { id: string; label: string; en?: string; items: ConnectorItem[] }

export interface CheckContext {
  /** Discourse-marker classes, for connectorFrom. */
  connectors?: readonly ConnectorClass[];
  /** Known nouns (deaccented, lower case, with plurals): see nounSet(). */
  nouns?: ReadonlySet<string>;
}

export interface ConstraintResult { label: string; pass: boolean; detail: string }
export interface WritingResult {
  results: ConstraintResult[];
  passed: number;
  total: number;
  allPass: boolean;
  analysis: SentenceAnalysis;
}

const deacLower = (s: string | null | undefined) => deaccent((s || '').toLowerCase());
const deacLowerWord = (s: string | null | undefined) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Every single-word noun of a vocabulary list plus its regular plural, so a
 *  spelling the vocabulary claims as a noun is not counted as a verb form.
 *  Build once and pass in the context. Accents are dropped on both sides so
 *  razón/razones pair up. */
export function nounSet(vocab: ReadonlyArray<{ es: string }>): Set<string> {
  const out = new Set<string>();
  for (const v of vocab) {
    const b = String(v.es || '').replace(/^(el|la|los|las|un|una)\s+/i, '');
    if (!b || /\s/.test(b)) continue;
    const k = deacLowerWord(b);
    out.add(k); out.add(k + 's'); out.add(k + 'es');
    if (/s$/.test(k)) out.add(k.replace(/e?s$/, ''));
  }
  return out;
}

// Does a subjunctive at `i` have something governing it? `que` or a negation
// within two tokens to its left.
function subjTriggered(tokens: string[], i: number): boolean {
  for (let k = Math.max(0, i - 2); k < i; k++) {
    const t = String(tokens[k] || '').toLowerCase();
    if (t === 'que' || t === 'no' || t === 'ni' || t === 'nunca' || t === 'jamás' || t === 'jamas') return true;
  }
  return false;
}

/* Is the token at `i` in a NOUN SLOT — directly after a determiner or a
 * preposition? Spanish puts no finite verb there: "sin reservas" and "los
 * importes" are noun phrases. Covers nouns the vocabulary does not teach. */
const NOUN_SLOT_BEFORE = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo',
  'mi', 'mis', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'vuestro', 'vuestra', 'vuestros', 'vuestras',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
  'aquel', 'aquella', 'aquellos', 'aquellas',
  'de', 'del', 'en', 'con', 'sin', 'por', 'para', 'sobre', 'entre',
  'hasta', 'desde', 'hacia', 'ante', 'tras', 'segun', 'al',
]);
function inNounSlot(tokens: string[], i: number): boolean {
  return i > 0 && NOUN_SLOT_BEFORE.has(deacLowerWord(tokens[i - 1]));
}

const BANDS: Band[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
// An item with no level counts as B1, the band the inventory starts at.
function connectorAtLeast(item: ConnectorItem, floor: Band | null): boolean {
  if (!floor) return true;
  const want = BANDS.indexOf(floor);
  const got = BANDS.indexOf(item.level || 'B1');
  return want === -1 || got >= want;
}

const VARIANT_OF = new Map(TENSES.filter((t) => t.variantOf).map((t) => [t.key, t.variantOf as TenseKey]));
/** Does an analysed tense count as `want`? hablase counts as impsubj. */
function tenseIs(have: TenseKey, want: TenseKey): boolean {
  return have === want || VARIANT_OF.get(have) === want;
}
const SUBJ = new Set<TenseKey>(['presubj', 'impsubj', 'impsubjse', 'futsubj']);
const isSubj = (t: TenseKey) => SUBJ.has(t);

/** Canonical conjugated form for a verb/tense/person, or null. */
export function expectedForm(inf: string, tense: TenseKey, person: AnyPerson): string | null {
  const v = verbByInf(inf);
  if (!v) return null;
  const i = (personsFor(tense) as readonly AnyPerson[]).indexOf(person);
  if (i < 0) return null;
  return conjugate(v, tense)[i] ?? null;
}

function someVerb(analysis: SentenceAnalysis, pred: (a: Analysis) => boolean): boolean {
  return analysis.verbs.some((w) => w.analyses.some(pred));
}

// Tenses present, counting simple forms and compounds (by their haber). The
// auxiliary of a compound is not a tense of its own: "he comido" is one tense.
function tensesPresent(analysis: SentenceAnalysis): Set<TenseKey> {
  const set = new Set<TenseKey>();
  const aux = new Set(analysis.compounds.map((c) => c.haberIndex));
  for (const w of analysis.verbs) for (const a of w.analyses) {
    if (aux.has(w.index) && a.inf === 'haber') continue;
    set.add(a.tense);
    const b = VARIANT_OF.get(a.tense);
    if (b) set.add(b);
  }
  for (const c of analysis.compounds) for (const t of c.tenses) { set.add(t); const b = VARIANT_OF.get(t); if (b) set.add(b); }
  return set;
}

// Does the token list contain this (possibly multi-word) form?
function containsPhrase(tokens: string[], phrase: string, eq: (a: string, b: string) => boolean): boolean {
  const words = phrase.toLowerCase().split(' ');
  for (let i = 0; i + words.length <= tokens.length; i++) {
    if (words.every((w, j) => eq(tokens[i + j], w))) return true;
  }
  return false;
}

/** Evaluate one constraint. */
export function evaluate(c: Constraint, analysis: SentenceAnalysis, rawText: string, ctx: CheckContext = {}): ConstraintResult {
  let label = c.label || null;
  let pass = false;
  let detail = '';
  const words = (t: string) => tokenize(t);

  switch (c.type) {
    case 'verbForm': {                                 // exact form of inf/tense/person
      const want = expectedForm(c.inf, c.tense, c.person);
      label = label || ('use <b>' + (want || '?') + '</b> (' + c.inf + ' · ' + TENSE_LABEL[c.tense] + ' · ' + c.person + ')');
      if (want) {
        const i = (personsFor(c.tense) as readonly AnyPerson[]).indexOf(c.person);
        const ok = acceptedForms(c.inf, c.tense, i);
        const hit = ok.some((f) => containsPhrase(analysis.tokens, f, (a, b) => a === b));
        const near = containsPhrase(analysis.tokens, want, (a, b) => deacLower(a) === deacLower(b));
        pass = hit;
        if (!hit && near) detail = 'almost, check the accents on “' + want + '”';
      }
      break;
    }
    case 'verbFormAny':
      label = label || ('use <b>' + c.inf + '</b> in the ' + TENSE_LABEL[c.tense]);
      pass = someVerb(analysis, (a) => a.inf === c.inf && tenseIs(a.tense, c.tense));
      break;
    case 'anyVerbInTense':
      label = label || ('use a verb in the <b>' + TENSE_LABEL[c.tense] + '</b>');
      pass = tensesPresent(analysis).has(c.tense);
      break;
    case 'person':
      label = label || ('conjugate a verb for <b>' + c.person + '</b>');
      pass = someVerb(analysis, (a) => a.person === c.person);
      break;
    case 'infinitiveUsed':
      label = label || ('use the verb <b>' + c.inf + '</b>');
      pass = someVerb(analysis, (a) => a.inf === c.inf) || analysis.tokens.includes(c.inf);
      break;
    case 'verbType':
      label = label || ('use an <b>-' + c.ending + '</b> verb');
      pass = someVerb(analysis, (a) => a.type === c.ending);
      break;
    case 'containsWord':
      label = label || ('include “<b>' + c.word + '</b>”');
      pass = deacLower(rawText).includes(deacLower(c.word));
      break;
    case 'containsAny':
      label = label || ('include one of: ' + c.words.map((w) => '“' + w + '”').join(', '));
      pass = c.words.some((w) => deacLower(rawText).includes(deacLower(w)));
      break;
    case 'minWords': {
      const n = words(rawText).length;
      label = label || ('at least <b>' + c.n + '</b> words');
      pass = n >= c.n;
      if (!pass) detail = n + ' so far';
      break;
    }
    case 'maxWords':
      label = label || ('at most <b>' + c.n + '</b> words');
      pass = words(rawText).length <= c.n;
      break;
    case 'question':
      label = label || 'write it as a question (¿… ?)';
      pass = /¿/.test(rawText) && /\?/.test(rawText);
      break;
    case 'negation':
      label = label || 'make it negative (use “no”)';
      pass = analysis.tokens.includes('no');
      break;
    case 'regex':
      label = label || 'matches pattern';
      pass = new RegExp(c.pattern, c.flags || 'i').test(rawText);
      break;

    /* ---- B2/C1 constraints ------------------------------------------- */

    case 'connectorFrom': {
      /* `minLevel` is what makes this mean something at B2/C1: without it,
       * "use a contraargumentativo" is satisfied by `pero`. The class is the
       * unit, not the marker: demanding one of `ahora bien / con todo / si
       * bien` teaches the MOVE and leaves the learner the choice. */
      const klass = (ctx.connectors ?? []).find((k) => k.id === c.class);
      const need = c.n || 1;
      const floor = c.minLevel || null;
      label = label || ('use ' + (need > 1 ? need + ' markers' : 'a marker') + ' of type <b>' +
        (klass ? klass.label.toLowerCase() : c.class) + '</b>' + (floor ? ' at ' + floor + ' or above' : ''));
      if (!klass) { pass = false; detail = 'unknown connector class'; break; }
      const eligible = klass.items.filter((it) => connectorAtLeast(it, floor));
      const hay = deacLower(rawText);
      const found = eligible.filter((it) => hay.includes(deacLower(it.es)));
      pass = found.length >= need;
      if (found.length) detail = found.map((f) => f.es).join(', ');
      // say WHICH markers would count: the point of the task is the repertoire
      else if (floor) detail = 'e.g. ' + eligible.slice(0, 4).map((f) => f.es).join(', ');
      break;
    }
    case 'avoidsAny': {
      label = label || ('avoid: ' + c.words.map((w) => '“' + w + '”').join(', '));
      const bad = c.words.filter((w) => deacLower(rawText).includes(deacLower(w)));
      pass = bad.length === 0;
      if (!pass) detail = 'found ' + bad.join(', ');
      break;
    }
    case 'avoidsPerson': {
      label = label || ('do not address anyone as <b>' + c.person + '</b>');
      /* Four ways a token reads as "tú" without anybody being addressed:
       * IMPERATIVES — habla is also "she speaks", so an imperative reading
       *   counts only when the token has no other interpretation (ven, haz).
       * BARE SUBJUNCTIVES — address in the subjunctive needs a trigger (que
       *   vengas, no lo hagas); untriggered it is usually a plural noun
       *   (ocasiones, razones).
       * NOUN HOMOGRAPHS — las bajas, el importe: taught nouns, excused only
       *   while the text uses no tú pronoun anywhere.
       * NOUN SLOTS — a token after a determiner or preposition (sin reservas). */
      const addressed = /(^|[^a-záéíóúñü])(tú|te|ti|contigo|tuy[oa]s?)([^a-záéíóúñü]|$)/i.test(String(rawText || '').toLowerCase());
      const tks = analysis.tokens || [];
      pass = !analysis.verbs.some((w) => w.analyses.some((a) => {
        if (a.person !== c.person) return false;
        if (a.tense === 'imperativo') return !w.analyses.some((b) => b.tense !== 'imperativo');
        if (isSubj(a.tense) && !subjTriggered(tks, w.index)) return false;
        if (inNounSlot(tks, w.index)) return false;
        if (!addressed && ctx.nouns?.has(deacLowerWord(tks[w.index]))) return false;
        return true;
      }));
      break;
    }
    case 'subjunctiveAfter': {
      label = label || ('use the subjunctive after “<b>' + c.trigger + '</b>”');
      const tks = analysis.tokens || [];
      const trig = words(c.trigger);
      let at = -1;
      for (let ti = 0; ti + trig.length <= tks.length && at < 0; ti++) {
        if (trig.every((t, tj) => deacLower(tks[ti + tj]) === deacLower(t))) at = ti + trig.length - 1;
      }
      if (at < 0) { pass = false; detail = '“' + c.trigger + '” not used yet'; break; }
      const span = c.within || 8;
      pass = analysis.verbs.some((w) => w.index > at && w.index <= at + span && w.analyses.some((a) => isSubj(a.tense)));
      if (!pass) detail = 'no subjunctive follows it';
      break;
    }
    case 'cliticCluster':
      label = label || 'use a double object pronoun (se lo, me la, dármelo)';
      pass = /\b(me|te|se|nos|os)\s+(lo|la|los|las|le|les)\b/i.test(rawText) ||
             /\w{2,}(me|te|se|nos|os)(lo|la|los|las)\b/i.test(rawText);
      break;
    case 'sePassive': {
      label = label || 'use a “se” construction (se dice, se construyó)';
      const tk = analysis.tokens || [];
      pass = analysis.verbs.some((w) => {
        if (tk[w.index - 1] !== 'se' && tk[w.index - 2] !== 'se') return false;
        return w.analyses.some((a) => (a.person === 'él/ella' || a.person === 'ellos') && a.tense !== 'imperativo');
      });
      break;
    }
    case 'distinctTenses': {
      const present = tensesPresent(analysis);
      for (const [variant] of VARIANT_OF) present.delete(variant);   // hablase + hablara is one tense
      label = label || ('use at least <b>' + c.n + '</b> different tenses');
      pass = present.size >= c.n;
      detail = present.size + ' so far';
      break;
    }
    case 'minSentences': {
      const n = (rawText.match(/[^.!?…]*[.!?…]+/g) ?? []).filter((x) => /\w/.test(x)).length;
      label = label || ('at least <b>' + c.n + '</b> sentences');
      pass = n >= c.n;
      if (!pass) detail = n + ' so far';
      break;
    }
    default: {
      const unknown = c as { type: string };
      label = label || ('unknown constraint: ' + unknown.type);
      pass = false;
    }
  }
  return { label: label ?? '', pass, detail };
}

/** Check a whole written answer against a task's constraint list. */
export function checkWriting(task: { constraints?: readonly Constraint[] }, text: string, ctx: CheckContext = {}): WritingResult {
  const analysis = analyzeSentence(text || '');
  const results = (task.constraints ?? []).map((c) => evaluate(c, analysis, text || '', ctx));
  const passed = results.filter((r) => r.pass).length;
  return { results, passed, total: results.length, allPass: results.length > 0 && passed === results.length, analysis };
}
