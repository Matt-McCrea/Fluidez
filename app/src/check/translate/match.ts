/* ============================================================================
 * matchTranslation — is this Spanish a right translation of the sentence?
 *
 *   1. Expand the sentence into every accepted form (variants.ts): the model,
 *      `accept`, `also`, the other registers of "you", Peninsular forms.
 *   2. Canonicalise the input and each form (canon.ts).
 *   3. Pass if the canonical tokens match, the movable adverbials match and
 *      sit in legal slots, and every subject pronoun the learner wrote is
 *      one the English allows.
 *   4. Otherwise: accents-only → near ("Check the accents."); else the first
 *      difference against the closest form gives one plain-English hint.
 * ========================================================================== */
import { deaccent } from '../../engine';
import { enWords, verbReadings } from '../../exercises/spanish';
import { advKey, canon, key, keyDeaccent, type Canon } from './canon';
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
      }
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
  const variants = expandAccepted(sentence, opts)
    .sort((a, b) => (a.variant ? 1 : 0) - (b.variant ? 1 : 0));
  const model = variants[0]?.es ?? sentence.es;
  const ci = canon(input);
  if (!ci.toks.length && !ci.advs.length) {
    return { pass: false, hint: HINT_TEXT.empty, hintKind: 'empty', closest: model };
  }
  const lenient = opts.accents === 'lenient';
  const cvs = variants.map((v) => ({ v, cv: canon(v.es) }));
  let nearHit: { v: Variant } | null = null;
  let subjectHit: { v: Variant } | null = null;
  let orderHit: { v: Variant } | null = null;

  for (const { v, cv } of cvs) {
    const sameToks = key(ci) === key(cv);
    const sameAccentless = keyDeaccent(ci) === keyDeaccent(cv);
    if (!sameToks && !sameAccentless) continue;
    const allowed = pronounsAllowed(v, cv, sentence.en);
    const pronOk = ci.pronouns.every((p) => allowed.has(p));
    const pronOkLoose = ci.pronouns.every((p) => [...allowed].some((q) => deaccent(q) === deaccent(p)));
    const advOk = advsOk(ci, cv);
    const advLoose = deaccent(advKey(ci)) === deaccent(advKey(cv));
    if (sameToks && pronOk && advOk) {
      const slip = ci.accentSlips > 0 || encliticAccentSlip(ci, cv);
      if (slip) { nearHit ??= { v }; continue; }
      return {
        pass: true, closest: v.es,
        ...(v.variant ? { variant: v.variant } : {}), ...(v.register ? { register: v.register } : {}),
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
  const dg = diagnose(fi, flat(best.cv));
  return { pass: false, hint: dg.hint, hintKind: dg.kind, closest: best.v.es, at: dg.at, ...(dg.kind === 'accents' ? { near: true } : {}) };
}
