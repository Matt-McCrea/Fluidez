/* ============================================================================
 * MORPHOLOGICAL ANALYSIS — powers the writing checker.
 *
 * A reverse index maps every conjugated surface form back to the verb, tense
 * and person(s) it could be. Because the engine derives every form, the index
 * is always exhaustive and correct — no hand-maintained word lists.
 *
 * Variety: the course produces neutral Latin American Spanish, but the
 * analyser recognises everything a learner will read. Vosotros forms and voseo
 * (tenés, sos, hablás, vení) come back with `target: false` and a `variety`, so
 * a consumer can say "that's Spain / Río de la Plata Spanish" instead of
 * "not a verb". Voseo is matched only when the accents match exactly — hablas
 * is tú, hablás is vos — so it never adds noise to an ordinary tú form.
 * ========================================================================== */
import type { Analysis, AnyPerson, Compound, CompoundTense, HaberAnalysis, ParticipleAnalysis, SentenceAnalysis, TenseKey, TokenAnalysis, VerbClass, Variety } from './types';
import { VERBS, verbByInf } from './verbs';
import {
  COMPOUND_OF_HABER, PERSONS, TENSES, conjugate, conjugateBareCells, isCompound, isRecognitionOnly,
  isReflexive, participle, personsFor, reflexiveBase, voseoForms, vowelOf,
} from './conjugate';
import { deaccent } from './ortho';

interface IndexEntry {
  inf: string;
  tense: TenseKey;
  person: AnyPerson;
  form: string;
  legacy?: string;
  type: VerbClass;
  variety?: Variety;
}

let IDX: Map<string, IndexEntry[]> | null = null;
let PART_IDX: Map<string, ParticipleAnalysis[]> = new Map();
let HABER_IDX: Map<string, HaberAnalysis[]> = new Map();

function push<T>(m: Map<string, T[]>, k: string, v: T): void {
  const list = m.get(k);
  if (list) list.push(v); else m.set(k, [v]);
}

function ensureIndex(): Map<string, IndexEntry[]> {
  if (IDX) return IDX;
  const idx = new Map<string, IndexEntry[]>();
  PART_IDX = new Map();
  HABER_IDX = new Map();
  for (const v of VERBS) {
    // Index the BARE conjugation: a learner types "me levanto" as two tokens,
    // and "levanto" is the one to recognise. The reported inf stays reflexive.
    const type = vowelOf(isReflexive(v.inf) ? reflexiveBase(v.inf) : v.inf);
    for (const t of TENSES) {
      const persons = personsFor(t.key);
      if (isCompound(t.key)) {
        const parts = new Set([participle(v), ...(v.partAlt ?? [])]);
        for (const p of parts) push(PART_IDX, deaccent(p.toLowerCase()), { inf: v.inf, tense: t.key });
        continue;
      }
      conjugateBareCells(v, t.key).forEach((cell, i) => {
        const lw = cell.form.toLowerCase();
        if (lw.includes(' ')) return;                // impneg "no hables": not a single token
        const person = persons[i];
        push(idx, deaccent(lw), {
          inf: v.inf, tense: t.key, person, form: cell.form, type,
          ...(cell.legacy ? { legacy: cell.legacy.toLowerCase() } : {}),
          ...(person === 'vosotros' ? { variety: 'vosotros' as const } : {}),
        });
      });
    }
    const vos = voseoForms(v);
    if (vos.presente) push(idx, deaccent(vos.presente), { inf: v.inf, tense: 'presente', person: 'vos', form: vos.presente, type, variety: 'voseo' });
    if (vos.imperativo) push(idx, deaccent(vos.imperativo), { inf: v.inf, tense: 'imperativo', person: 'vos', form: vos.imperativo, type, variety: 'voseo' });
  }
  // haber's own simple forms, for detecting compound tenses in learner text
  const haber = verbByInf('haber');
  if (haber) {
    for (const tk of ['presente', 'imperfecto', 'futuro', 'condicional', 'presubj', 'impsubj', 'impsubjse'] as const) {
      conjugate(haber, tk).forEach((form, i) => {
        const k = deaccent(form.toLowerCase());
        if (!k.includes(' ')) push(HABER_IDX, k, { tense: tk, person: PERSONS[i] });
      });
    }
  }
  IDX = idx;
  return idx;
}

/** Split learner text into lowercase word tokens (Spanish letters only). */
export function tokenize(text: string | null | undefined): string[] {
  return (text || '').toLowerCase().replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(Boolean);
}

// Common function words whose accent-less spelling collides with a verb form
// (de/dé, esta/está, hacia/hacía, se/sé, solo, si/sí…). An accent-INEXACT
// match on these is the function word, not a typo'd verb.
const FUNCTION_WORDS = new Set(['de', 'se', 'esta', 'estas', 'hacia', 'solo', 'si', 'aun', 'mas', 'te', 'mi', 'tu', 'el']);

/* Readings of verbs ADDED in the port that collide with very frequent
 * non-verbs. "una" is the present subjunctive of unir, "tarde" of tardar,
 * "sobre" of sobrar, "frío" the yo present of freír: without this, every
 * sentence with an article would contain a subjunctive. The old engine has
 * its own collisions (como, para, entre) and keeps them for parity. */
const SUPPRESS: ReadonlyMap<string, ReadonlySet<string>> = new Map(Object.entries({
  una: ['unir'], unas: ['unir'], sobre: ['sobrar'], tarde: ['tardar'], tardes: ['tardar'],
  enfrente: ['enfrentar'], 'frío': ['freír'], 'fría': ['freír'], 'frías': ['freír'],
}).map(([k, v]) => [k, new Set(v)]));

/* ---- enclitic pronouns ---------------------------------------------------
 * Spanish attaches object pronouns to the END of an affirmative imperative:
 * dímelo, ayúdame, levántate. Stripping is only safe with the accent rule
 * that comes with it: attaching a clitic shifts the stress, so the accent is
 * obligatory unless the base is a monosyllabic imperative (dame, dime). Without
 * that test "tomate" parses as tomar + te, and "chocolate", "gente", "parte"
 * with it. Infinitives and gerunds are not handled (they carry no person). */
const CLITICS = ['me', 'te', 'se', 'lo', 'la', 'le', 'nos', 'os', 'los', 'las', 'les'];
const MONO_IMPERATIVES = new Set(['da', 'di', 've', 'ven', 'pon', 'sal', 'ten', 'haz', 'se', 'oye']);
// Ordinary words a monosyllabic imperative plus one clitic happens to spell.
const CLITIC_STOPLIST = new Set(['dios', 'vela', 'velas', 'velo', 'velos', 'dale', 'dalia', 'tenor']);

function stripClitics(t: string): Array<{ base: string; clitics: string[] }> {
  const out: Array<{ base: string; clitics: string[] }> = [];
  for (const c1 of CLITICS) {
    if (t.length <= c1.length + 1 || !t.endsWith(c1)) continue;
    const b1 = t.slice(0, -c1.length);
    out.push({ base: b1, clitics: [c1] });
    for (const c2 of CLITICS) {                      // two pronouns: dá-me-lo
      if (b1.length <= c2.length + 1 || !b1.endsWith(c2)) continue;
      out.push({ base: b1.slice(0, -c2.length), clitics: [c2, c1] });
    }
  }
  return out;
}

function toAnalysis(e: IndexEntry, accentExact: boolean, clitics?: string[]): Analysis {
  const a: Analysis = {
    inf: e.inf, tense: e.tense, person: e.person, form: e.form, type: e.type, accentExact,
    target: !e.variety && !isRecognitionOnly(e.tense),
  };
  if (clitics) a.clitics = clitics;
  if (e.variety) a.variety = e.variety;
  return a;
}

function analyzeBare(t: string, withVoseo = true): Analysis[] {
  const out: Analysis[] = [];
  for (const e of ensureIndex().get(deaccent(t)) ?? []) {
    const exact = e.form.toLowerCase() === t || e.legacy === t;
    if (e.variety === 'voseo' && (!exact || !withVoseo)) continue;
    out.push(toAnalysis(e, exact));
  }
  return out;
}

/** All analyses for one token. `accentExact` flags whether the accents matched
 *  the canonical form (so the checker can nudge on "comio" vs "comió"). */
export function analyzeToken(tok: string): Analysis[] {
  const t = tok.toLowerCase();
  let list = analyzeBare(t);
  if (FUNCTION_WORDS.has(t)) list = list.filter((a) => a.accentExact);
  const suppressed = SUPPRESS.get(t);
  if (suppressed) list = list.filter((a) => !suppressed.has(a.inf));
  if (list.length) return list;

  if (CLITIC_STOPLIST.has(t)) return [];
  const accented = /[áéíóú]/.test(t);
  const found: Analysis[] = [];
  const seen = new Set<string>();
  for (const cand of stripClitics(t)) {
    const single = cand.clitics.length === 1;
    // the vosotros imperative drops its -d before os: levantad + os > levantaos.
    // Only the restored-d form is valid (else "sentados" parses as sentad + os);
    // irse keeps its d: idos.
    const vosOs = single && cand.clitics[0] === 'os';
    const bases: Array<{ b: string; free: boolean }> = vosOs
      ? [{ b: deaccent(cand.base) + 'd', free: true }, ...(deaccent(cand.base) === 'id' ? [{ b: 'id', free: true }] : [])]
      : [{ b: cand.base, free: false }, { b: deaccent(cand.base), free: false }];
    for (const x of bases) {
      for (const a of analyzeBare(x.b, false)) {
        if (a.tense !== 'imperativo') continue;
        // vosotros + os is inherently reflexive; else "correos" is corred + os
        if (vosOs && !isReflexive(a.inf)) continue;
        // An unaccented token can only be a monosyllabic imperative (dame,
        // hazlo), the -os vosotros form (levantaos), or a vosotros -d form plus
        // one clitic, which keeps final stress (dadme, vendedlo).
        const vosD = a.person === 'vosotros' && /d$/.test(x.b) && single;
        if (!accented && !x.free && !vosD && !MONO_IMPERATIVES.has(deaccent(x.b))) continue;
        const k = a.inf + a.person + cand.clitics.join('');
        if (seen.has(k)) continue;
        seen.add(k);
        found.push({ ...a, accentExact: true, clitics: cand.clitics });
      }
    }
  }
  return found;
}

export function isParticiple(tok: string): boolean { ensureIndex(); return PART_IDX.has(deaccent(tok.toLowerCase())); }
export function participlesOf(tok: string): ParticipleAnalysis[] { ensureIndex(); return PART_IDX.get(deaccent(tok.toLowerCase())) ?? []; }
export function haberAnalyses(tok: string): HaberAnalysis[] { ensureIndex(); return HABER_IDX.get(deaccent(tok.toLowerCase())) ?? []; }

/** Analyse a whole sentence: tokens, every recognised verb form, and compound
 *  (haber + participle) phrases, allowing one adverb between them. */
export function analyzeSentence(text: string): SentenceAnalysis {
  const toks = tokenize(text);
  const verbs: TokenAnalysis[] = [];
  const compounds: Compound[] = [];
  toks.forEach((tk, i) => {
    const a = analyzeToken(tk);
    if (a.length) verbs.push({ token: tk, index: i, analyses: a });
    const hb = haberAnalyses(tk);
    if (hb.length) {
      for (let j = i + 1; j <= i + 2 && j < toks.length; j++) {
        if (isParticiple(toks[j])) {
          const tenses = [...new Set(hb.map((h) => COMPOUND_OF_HABER[h.tense]).filter((x): x is CompoundTense => !!x))];
          compounds.push({ haber: tk, participle: toks[j], haberIndex: i, participleIndex: j, haberAnalyses: hb, parts: participlesOf(toks[j]), tenses });
          break;
        }
      }
    }
  });
  return { text, tokens: toks, verbs, compounds };
}

/** The pre-2010 spelling of every form the RAE 2010 rule changed: rio > rió,
 *  guie > guié, hui > huí. The checker accepts these as correct. */
let LEGACY: Map<string, string> | null = null;
export function legacySpellings(): ReadonlyMap<string, string> {
  if (LEGACY) return LEGACY;
  const m = new Map<string, string>();
  for (const list of ensureIndex().values()) for (const e of list) if (e.legacy) m.set(e.form.toLowerCase(), e.legacy);
  LEGACY = m;
  return m;
}
