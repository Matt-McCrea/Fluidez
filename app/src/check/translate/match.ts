/* ============================================================================
 * matchTranslation — is this Spanish a right translation of the sentence?
 *
 *   1. Expand the sentence into every accepted form (variants.ts): the model,
 *      `accept`, `also`, the other registers of "you", Peninsular forms, and
 *      the other subject positions of a yes/no question (questionOrders).
 *   2. Canonicalise the input and each form (canon.ts).
 *   3. Pass if the canonical tokens match, the movable adverbials match and
 *      sit in legal slots, and every subject pronoun the learner wrote is
 *      one the English allows.
 *   4. Otherwise: accents-only → near ("Check the accents."); else the first
 *      difference against the closest form gives one plain-English hint.
 * ========================================================================== */
import { deaccent } from '../../engine';
import { CLITICS, enSubject, enWords, EXPERIENCER, verbReadings } from '../../exercises/spanish';
import { advKey, canon, key, keyDeaccent, questionOrders, type Canon } from './canon';
import { diagnose, distance, HINT_TEXT, type HintKind } from './hints';
import { expandAccepted, type ExpandOptions, type Register, type Variant } from './variants';

export interface MatchOptions extends ExpandOptions {
  /** 'lenient': an accents-only slip passes (still reported as near). */
  accents?: 'strict' | 'lenient';
}

export interface TranslationResult {
  pass: boolean;
  /** Right apart from accents. */
  near?: boolean;
  /** One plain-English hint when it did not pass (or passed only as near). */
  hint?: string;
  hintKind?: HintKind;
  /** Matched only through a Peninsular form. */
  variant?: 'peninsular';
  /** Matched through a swap the card did not teach but Spanish allows: a pass that says so. */
  note?: string;
  /** The register of "you" the learner used, when the sentence has one. */
  register?: Register;
  /** The accepted form closest to the input: the one to show on reveal. */
  closest: string;
  /** Word index in `closest` (canonical order) of the first difference. */
  at?: number;
}

export interface SentenceLike { es: string; en: string; accept?: readonly string[] }

const EN_PRON: Readonly<Record<string, string[]>> = {
  i: ['yo'], he: ['él'], she: ['ella'], we: ['nosotros', 'nosotras'], they: ['ellos', 'ellas'],
};
const REG_PRON: Readonly<Record<Register, string[]>> = {
  'tú': ['tú'], usted: ['usted'], ustedes: ['ustedes'], vosotros: ['vosotros', 'vosotras'],
};
const PERSON_PRON: Readonly<Record<string, string[]>> = {
  yo: ['yo'], 'tú': ['tú'], 'él/ella': ['él', 'ella', 'usted'], nosotros: ['nosotros', 'nosotras'], vosotros: ['vosotros', 'vosotras'], ellos: ['ellos', 'ellas', 'ustedes'],
};

/** The Spanish pronouns the English subject stands for ("she" is ella). */
function englishPronouns(en: string): Set<string> {
  const sub = enSubject(en);
  const ok = new Set<string>();
  if (!sub?.pronoun) return ok;
  if (sub.pronoun === 'you') ['tú', 'usted', 'ustedes'].forEach((p) => ok.add(p));
  else if (sub.pronoun === 'you all') ok.add('ustedes');
  else EN_PRON[sub.pronoun]?.forEach((p) => ok.add(p));
  return ok;
}

const EN_LIKES = /\b(like|likes|love|loves|enjoy|enjoys|adore|adores|interested|care|cares)\b/;

/** "Yo me gusta", "Ella le gusta el café": a subject pronoun in front of the
 *  clitic of gustar and its kin that cannot be right. Certain when the person
 *  cannot be the verb's subject; also when it can be, but is the English
 *  subject carried over ("She likes coffee" is not ella le gusta). */
function experiencerSlip(ci: Canon, en: string): boolean {
  if (!ci.experiencer.length) return false;
  const carried = englishPronouns(en);
  return ci.experiencer.some((x) => x.mismatch || (x.like && carried.has(x.pron) && EN_LIKES.test(enWords(en).join(' '))));
}

/** Where the same tokens hide two spellings of one figure ("doscientos" for "doscientas"), or -1. */
function figureSlip(ci: Canon, cv: Canon): number {
  return ci.toks.findIndex((t, i) => !!t.form && !!cv.toks[i]?.form && t.form !== cv.toks[i].form);
}

/** Subject pronouns the learner may write for this accepted form. */
function pronounsAllowed(v: Variant, cv: Canon, en: string): Set<string> {
  const ok = new Set(cv.pronouns);
  const ew = enWords(en);
  let fromEnglish = false;
  for (const w of ew) {
    if (EN_PRON[w]) { EN_PRON[w].forEach((p) => ok.add(p)); fromEnglish = true; }
    if (w === 'you') {
      fromEnglish = true;
      if (v.register) REG_PRON[v.register].forEach((p) => ok.add(p));
      else {
        // the model's own register, read off its verb
        const verb = cv.toks.map((t) => t.t).find((t) => verbReadings(t).length);
        for (const a of verb ? verbReadings(verb) : []) {
          if (a.person === 'tú') ok.add('tú');
          if (a.person === 'él/ella') ok.add('usted');
          if (a.person === 'ellos') ok.add('ustedes');
        }
        // gustar and kin: the clitic carries the register too (te gusta, le gusta, les gusta)
        if (cv.toks.some((t) => verbReadings(t.t).some((a) => EXPERIENCER.has(a.inf.replace(/se$/, ''))))) {
          for (const t of cv.toks) { if (t.t === 'te') ok.add('tú'); if (t.t === 'le') ok.add('usted'); if (t.t === 'les') ok.add('ustedes'); }
        }
      }
    }
  }
  // "Te gusto", "Me gustas": the person liked is the subject, and the English calls it "me" or "you"
  for (const t of cv.toks) {
    for (const a of verbReadings(t.t)) {
      if (EXPERIENCER.has(a.inf.replace(/se$/, '')) && a.tense !== 'imperativo' && a.person !== 'él/ella' && a.person !== 'ellos') (PERSON_PRON[a.person] ?? []).forEach((p) => ok.add(p));
    }
  }
  if (!fromEnglish && !ok.size) {
    // no English subject to go by (a transform): anything the verb agrees with
    const verb = cv.toks.map((t) => t.t).find((t) => verbReadings(t).length);
    for (const a of verb ? verbReadings(verb) : []) (PERSON_PRON[a.person] ?? []).forEach((p) => ok.add(p));
  }
  return ok;
}

function advsOk(ci: Canon, cv: Canon): boolean {
  if (advKey(ci) !== advKey(cv)) return false;
  return ci.advs.every((a) => a.legal || cv.advs.some((b) => b.t === a.t && b.slot === a.slot));
}

/** Enclitic forms aligned with each other must agree in accents too. */
function encliticAccentSlip(ci: Canon, cv: Canon): boolean {
  return ci.toks.some((t, i) => t.src && cv.toks[i]?.src && t.src !== cv.toks[i].src && deaccent(t.src) === deaccent(cv.toks[i].src!));
}

export function matchTranslation(input: string, sentence: SentenceLike, opts: MatchOptions = {}): TranslationResult {
  const expanded = expandAccepted(sentence, opts);
  const seen = new Set(expanded.map((v) => v.es));
  for (const v of expanded.slice()) {
    for (const es of questionOrders(v.es)) {
      if (seen.has(es)) continue;
      seen.add(es);
      expanded.push({ ...v, es, model: false });
    }
  }
  const variants = expanded.sort((a, b) => (a.variant ? 1 : 0) - (b.variant ? 1 : 0));
  const model = variants[0]?.es ?? sentence.es;
  const ci = canon(input);
  if (!ci.toks.length && !ci.advs.length) {
    return { pass: false, hint: HINT_TEXT.empty, hintKind: 'empty', closest: model };
  }
  const lenient = opts.accents === 'lenient';
  const cvs = variants.map((v) => ({ v, cv: canon(v.es) }));
  const slip = experiencerSlip(ci, sentence.en);
  let nearHit: { v: Variant } | null = null;
  let subjectHit: { v: Variant } | null = null;
  let orderHit: { v: Variant } | null = null;
  let figureHit: { v: Variant; at: number } | null = null;

  for (const { v, cv } of cvs) {
    if (slip) break;
    const sameToks = key(ci) === key(cv);
    const sameAccentless = keyDeaccent(ci) === keyDeaccent(cv);
    if (!sameToks && !sameAccentless) continue;
    const allowed = pronounsAllowed(v, cv, sentence.en);
    const pronOk = ci.pronouns.every((p) => allowed.has(p));
    const pronOkLoose = ci.pronouns.every((p) => [...allowed].some((q) => deaccent(q) === deaccent(p)));
    const advOk = advsOk(ci, cv);
    const advLoose = deaccent(advKey(ci)) === deaccent(advKey(cv));
    const figure = sameToks ? figureSlip(ci, cv) : -1;
    if (figure >= 0) { figureHit ??= { v, at: figure }; continue; }
    if (sameToks && pronOk && advOk) {
      const slip = ci.accentSlips > 0 || encliticAccentSlip(ci, cv);
      if (slip) { nearHit ??= { v }; continue; }
      return {
        pass: true, closest: v.es,
        ...(v.variant ? { variant: v.variant } : {}), ...(v.register ? { register: v.register } : {}), ...(v.note ? { note: v.note } : {}),
      };
    }
    if (sameToks && !pronOk && pronOkLoose && advOk) { nearHit ??= { v }; continue; }
    if (sameToks && !pronOk && advOk) { subjectHit ??= { v }; continue; }
    if (sameToks && pronOk && advKey(ci) === advKey(cv) && !advOk) { orderHit ??= { v }; continue; }
    if (sameAccentless && pronOkLoose && (advOk || advLoose)) { nearHit ??= { v }; continue; }
  }
  if (nearHit) {
    const v = nearHit.v;
    return {
      pass: lenient, near: true, hint: HINT_TEXT.accents, hintKind: 'accents', closest: v.es,
      ...(v.variant ? { variant: v.variant } : {}), ...(v.register ? { register: v.register } : {}),
    };
  }
  if (subjectHit) return { pass: false, hint: HINT_TEXT.subject, hintKind: 'subject', closest: subjectHit.v.es };
  if (orderHit) return { pass: false, hint: HINT_TEXT['word-order'], hintKind: 'word-order', closest: orderHit.v.es };
  if (figureHit) return { pass: false, hint: HINT_TEXT.agreement, hintKind: 'agreement', closest: figureHit.v.es, at: figureHit.at };

  // closest accepted form, by token distance with adverbials and pronouns in place
  const flat = (c: Canon) => {
    const ts = c.toks.map((t) => t.t);
    for (const a of c.advs.slice().sort((x, y) => y.slot - x.slot)) ts.splice(a.slot, 0, a.t);
    return ts;
  };
  const fi = flat(ci);
  let best = cvs[0], bestD = Infinity;
  for (const x of cvs) {
    const d = distance(fi, flat(x.cv)) + (x.v.variant ? 0.01 : 0);
    if (d < bestD) { best = x; bestD = d; }
  }
  if (slip) {
    return { pass: false, hint: HINT_TEXT.experiencer, hintKind: 'experiencer', closest: best.v.es, at: Math.max(0, ci.toks.findIndex((t) => CLITICS.has(t.t))) };
  }
  const dg = diagnose(fi, flat(best.cv));
  return { pass: false, hint: dg.hint, hintKind: dg.kind, closest: best.v.es, at: dg.at, ...(dg.kind === 'accents' ? { near: true } : {}) };
}
