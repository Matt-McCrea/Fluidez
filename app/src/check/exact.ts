/* ============================================================================
 * EXACT-ANSWER CHECKING — cloze, transforms, drills, phrase and meaning cards.
 * Ported from the old js/checker.js (checkExact, answerForms,
 * meaningAlternatives).
 * ========================================================================== */
import { deaccent, legacySpellings, normalize } from '../engine';

/* A dictionary gloss is not one answer, it is a small set of them.
 * "sex, gender" and "sociable, outgoing" list alternatives, either of which
 * is right. "the friend (m)" and "the doctor (f)" mark the gender of the
 * SPANISH word — the bracket is metadata, so "friend" must pass. "the fish
 * (food)" disambiguates which fish is meant; the English word alone is right.
 *
 * So a gloss expands to: the whole string, each comma/slash-separated part,
 * and each of those with its bracket and its leading article or "to" removed.
 * Only for meaning items (vocab, idioms, phrases) — never for cloze or
 * sentence answers, where splitting on a comma would accept half a sentence. */
export function meaningAlternatives(gloss: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (x: string) => {
    const t = String(x).trim();
    if (!t) return;
    const k = normalize(t);
    if (k && !seen.has(k)) { seen.add(k); out.push(t); }
  };
  add(gloss);
  for (const part of String(gloss).split(/[,;/]| or /)) {
    add(part);
    const noParens = part.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ');
    add(noParens);
    add(noParens.replace(/^\s*(the|a|an|to)\s+/i, ''));
  }
  return out;
}

/* THE FORMS OF AN ANSWER THAT A PERSON WOULD ACTUALLY TYPE.
 *
 * A card is checked strictly, which is right for a verb drill and wrong the
 * moment the author wrote the answer out for a reader rather than for a text
 * box. "quizá(s)" demanded the literal string quizá(s), brackets included —
 * nobody types that, so the card could only ever be failed or revealed.
 *
 * A SLASH OR A BRACKET IS THE SIGNAL, and the response is to accept the
 * reasonable answer rather than to drop the card. Four rules, each narrow
 * because every form added here is a form the learner can be marked RIGHT for:
 *
 * 1. An optional suffix — "quizá(s)", no space before the bracket — is both
 *    quizá and quizás. The bracket's contents alone are NOT added ("s").
 * 2. A bracketed aside is metadata. "apellido (surname)" accepts apellido;
 *    the aside alone is accepted only when it is a SINGLE word, so
 *    "accent (tilde)" takes tilde while "(Le saluda) atentamente" does not
 *    take "Le saluda".
 * 3. A slash separates whole answers only when it is SPACED, or when the
 *    answer is a single token. "encantado / encantada" and "libre/ocupado"
 *    are two answers; "¿Has aprendido/estudiado...?" and "ser bueno para/en"
 *    are one answer with a slash inside it.
 * 4. A split part counts only if it is four words or fewer.
 *
 * Only ever derived from the card's OWN answer, so nothing here can make a
 * different answer pass. Pass the result to checkExact as `also`. */
export function answerForms(back: string | null | undefined): string[] {
  const raw = String(back == null ? '' : back).replace(/\s+/g, ' ').trim();
  if (!raw) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (x: string) => {
    const t = String(x).replace(/\s+/g, ' ').replace(/\s+([,;.:])/g, '$1').replace(/^[\s,;]+|[\s,;]+$/g, '').trim();
    if (!t) return;
    const k = normalize(t);
    if (k && !seen.has(k)) { seen.add(k); out.push(t); }
  };
  add(raw);

  // 1. an optional suffix written into the word itself
  const SUFFIX = /(\S)\(([^)\s]{1,4})\)/;
  const hasSuffix = SUFFIX.test(raw);
  if (hasSuffix) {
    add(raw.replace(/\(([^)\s]{1,4})\)/g, ''));
    add(raw.replace(/\(([^)\s]{1,4})\)/g, '$1'));
  }
  // 2. a bracketed aside
  if (/\([^)]*\)/.test(raw)) {
    add(raw.replace(/\([^)]*\)/g, ' '));
    for (const g of raw.match(/\(([^)]*)\)/g) ?? []) {
      const inner = g.slice(1, -1).trim();
      if (inner && inner.split(/\s+/).length === 1 && !hasSuffix) add(inner);
    }
  }
  // 3 + 4. either side of a slash that really is separating answers
  if (/\//.test(raw) && (/\s\/|\/\s/.test(raw) || !/\s/.test(raw))) {
    for (let part of raw.split('/')) {
      part = part.trim();
      if (!part || part.split(/\s+/).length > 4) continue;
      add(part);
      add(part.replace(/\([^)]*\)/g, ' '));
    }
  }
  return out;
}

/* Punctuation is not the thing being tested. A trailing full stop marked
 * "Ella no tiene hambre." cold-wrong against "ella no tiene hambre" — not even
 * a near miss. Strip terminal stops, commas and the paired ¿¡ ?!; accents are
 * NOT touched (they are part of the word). The `question` writing constraint
 * reads the raw text, because there the question mark IS the point. */
export function depunct(s: string): string {
  return normalize(s).replace(/[.,;:!?¡¿"“”'’]/g, '').replace(/\s+/g, ' ').trim();
}

export interface CheckExactOptions {
  /** Expand each accepted answer as a dictionary gloss (meaningAlternatives). */
  meaning?: boolean;
  /** Other correct answers: answerForms() output, or other Spanish the course
   *  glosses the same way (entonces / luego). A verb drill passes none. */
  also?: readonly string[];
  /** Peninsular lexical variants (coche for carro, ordenador for computadora).
   *  Accepted — the learner is right — but the result says so, so the UI can
   *  name the Latin American word the course teaches. */
  peninsular?: readonly string[];
  /** 'lenient' (phrase deck only): an accent near miss passes, and ñ/ü fold. */
  accents?: 'strict' | 'lenient';
}

export interface CheckExactResult {
  pass: boolean;
  /** Same letters, different accents: "check the accents" rather than wrong. */
  near: boolean;
  /** Set when the answer matched only through a Peninsular variant. */
  variant?: 'peninsular';
}

/* RAE 2010 dropped the accent from orthographic monosyllables (rió > rio,
 * guió > guio, fié > fie). A learner taught before 2010, or by a book that
 * was, is not wrong: the old spelling of an accepted answer passes too. */
function withLegacySpellings(list: readonly string[]): string[] {
  const legacy = legacySpellings();
  const out = list.slice();
  for (const a of list) {
    const words = normalize(a).split(' ');
    if (!words.some((w) => legacy.has(w.replace(/[.,;:!?¡¿]/g, '')))) continue;
    out.push(words.map((w) => {
      const core = w.replace(/[.,;:!?¡¿]/g, '');
      const old = legacy.get(core);
      return old ? w.replace(core, old) : w;
    }).join(' '));
  }
  return out;
}

function match(input: string, list: readonly string[], lenient: boolean): CheckExactResult | null {
  const norm = normalize(input);
  if (list.some((a) => normalize(a) === norm)) return { pass: true, near: false };
  // same answer, different punctuation: a pass, not a near miss
  const bare = depunct(input);
  if (bare && list.some((a) => depunct(a) === bare)) return { pass: true, near: false };
  /* Under `accents: 'lenient'` (the phrase deck) an accent near miss passes:
   * a phrase card asks whether the chunk comes back whole, and failing "no
   * hay de que" for its acute punishes the wrong thing. The caller still shows
   * the accented form. ñ and ü fold too there — an English keyboard has no ñ.
   * Deliberately NOT global: in a verb drill hablo/habló is the whole question. */
  const near = list.some((a) => deaccent(depunct(a)) === deaccent(bare));
  if (near && lenient) return { pass: true, near: true };
  if (lenient) {
    const fold = (s: string) => deaccent(depunct(s)).replace(/ñ/g, 'n').replace(/ü/g, 'u');
    if (bare && list.some((a) => fold(a) === fold(input))) return { pass: true, near: true };
  }
  return near ? { pass: false, near: true } : null;
}

/** Strict exact-answer check: accents required; case, spacing and
 *  punctuation forgiven. `accepted` is one answer or a list. */
export function checkExact(input: string, accepted: string | readonly string[], opts: CheckExactOptions = {}): CheckExactResult {
  let list: string[] = typeof accepted === 'string' ? [accepted] : accepted.slice();
  if (opts.meaning) list = list.flatMap(meaningAlternatives);
  if (opts.also?.length) list = list.concat(opts.also);
  list = withLegacySpellings(list);
  const lenient = opts.accents === 'lenient';

  const main = match(input, list, lenient);
  if (main?.pass) return main;
  if (opts.peninsular?.length) {
    const pen = match(input, opts.peninsular, lenient);
    if (pen?.pass) return { ...pen, variant: 'peninsular' };
    if (pen?.near) return { pass: false, near: true };
  }
  return main ?? { pass: false, near: false };
}
