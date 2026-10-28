/* ============================================================================
 * CONJUGATION — ported from the old js/engine.js.
 *
 * Verbs conjugate from endings tables (regular) merged with stored irregular
 * forms; the tenses that follow exceptionless rules are derived.
 *
 * Person order for simple/compound tenses:
 *   [ yo, tú, él/ella, nosotros, vosotros, ellos/ellas ]
 * Imperative uses its own persons (no "yo").
 *
 * MORPHOLOGY — the systematic patterns of Spanish conjugation are RULES, not
 * irregularities. A new verb usually needs only { inf, en, type } plus, for a
 * stem-changer, one `stem` field. Genuinely irregular verbs (ser, ir, tener…)
 * keep their explicit `forms`, which always win: see conjugateBase().
 *
 *   orthographic  buscar>busqué  llegar>llegué  realizar>realicé
 *                 averiguar>averigüé  vencer>venzo  coger>cojo  seguir>sigo
 *   inchoative    conocer>conozco  conducir>conduzco   (vowel + cer/cir)
 *   -uir          incluir>incluyo, incluyó, incluyendo
 *   vowel stems   leer>leyó/leíste/leído/leyendo   caer, oír
 *   -ñir/-llir    reñir>riñó/riñeron/riñendo (the i of -ió/-ieron is absorbed)
 *   stem changes  e>ie (pensar) · o>ue (contar) · e>i (pedir) · u>ue (jugar)
 *                 with the -ir verbs' second change in the subjunctive
 *                 nosotros/vosotros, 3rd-person preterite and gerund
 *   participles   whole families derive: -olver>-uelto, -poner>-puesto,
 *                 -scribir>-scrito, -cubrir>-cubierto, (des/re)hacer>-hecho…
 *   RAE 2010      orthographic monosyllables lose their accent: rio, guio,
 *                 fie, hui, riais. The pre-2010 spelling is kept as `legacy`
 *                 so the checker can still accept it.
 *
 * Changes from the old engine are listed in tests/engine/parity.test.ts,
 * which diffs every form against it.
 * ========================================================================== */
import type { CompoundTense, ImpPerson, Person, StemChange, StoredTense, TenseInfo, TenseKey, Verb, VerbClass } from './types';
import { verbByInf } from './verbs';
import { accentLastVowel, accentMonosyllable, attachEnclitic, deaccent, isVowel, monosyllable2010, nuclei } from './ortho';

export const PERSONS: readonly Person[] = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos'];
export const IMP_PERSONS: readonly ImpPerson[] = ['tú', 'usted', 'nosotros', 'vosotros', 'ustedes'];

/** The persons the course asks learners to PRODUCE: neutral Latin American
 *  Spanish — tú and ustedes, no vosotros. conjugate() still returns all six
 *  (vosotros is taught for recognition), so index with PERSONS.indexOf(p). */
export const PRODUCTION_PERSONS: readonly Person[] = ['yo', 'tú', 'él/ella', 'nosotros', 'ellos'];
export const PRODUCTION_IMP_PERSONS: readonly ImpPerson[] = ['tú', 'usted', 'nosotros', 'ustedes'];

export const TENSES: readonly TenseInfo[] = [
  { key: 'presente', label: 'Presente', group: 'indicative' },
  { key: 'preterito', label: 'Pretérito', group: 'indicative' },
  { key: 'imperfecto', label: 'Imperfecto', group: 'indicative' },
  { key: 'futuro', label: 'Futuro', group: 'indicative' },
  { key: 'condicional', label: 'Condicional', group: 'indicative' },
  { key: 'perfecto', label: 'Presente perfecto', group: 'compound' },
  { key: 'plusc', label: 'Pluscuamperfecto', group: 'compound' },
  { key: 'futperf', label: 'Futuro perfecto', group: 'compound' },
  { key: 'condperf', label: 'Condicional perfecto', group: 'compound' },
  { key: 'presubj', label: 'Presente de subjuntivo', group: 'subjunctive' },
  { key: 'impsubj', label: 'Imperfecto de subjuntivo', group: 'subjunctive' },
  { key: 'impsubjse', label: 'Imperfecto de subjuntivo (-se)', group: 'subjunctive', variantOf: 'impsubj' },
  { key: 'perfsubj', label: 'Pretérito perfecto de subj.', group: 'subjunctive' },
  { key: 'pluscsubj', label: 'Pluscuamperfecto de subj.', group: 'subjunctive' },
  { key: 'pluscsubjse', label: 'Pluscuamperfecto de subj. (hubiese)', group: 'subjunctive', variantOf: 'pluscsubj' },
  { key: 'futsubj', label: 'Futuro de subjuntivo', group: 'subjunctive', recognitionOnly: true },
  { key: 'imperativo', label: 'Imperativo (afirmativo)', group: 'imperative' },
  { key: 'impneg', label: 'Imperativo (negativo)', group: 'imperative' },
];
export const TENSE_LABEL = Object.fromEntries(TENSES.map((t) => [t.key, t.label])) as Record<TenseKey, string>;

export function isRecognitionOnly(tense: TenseKey): boolean {
  return !!TENSES.find((t) => t.key === tense)?.recognitionOnly;
}

type EndTable = { ar: string[]; er: string[]; ir: string[] } | { all: string[] };

// Regular endings. Simple tenses attach to the stem (infinitive minus 2);
// futuro/condicional attach to the whole infinitive.
export const END: Readonly<Record<'presente' | 'preterito' | 'imperfecto' | 'futuro' | 'condicional' | 'presubj', EndTable>> = {
  presente: { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] },
  preterito: { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] },
  imperfecto: { ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'], ir: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
  futuro: { all: ['é', 'ás', 'á', 'emos', 'éis', 'án'] },
  condicional: { all: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'] },
  presubj: { ar: ['e', 'es', 'e', 'emos', 'éis', 'en'], er: ['a', 'as', 'a', 'amos', 'áis', 'an'], ir: ['a', 'as', 'a', 'amos', 'áis', 'an'] },
};
/** Tenses whose regular endings are a clean single form. */
export const ENDING_TENSES: readonly TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional', 'presubj'];
export const MODEL_VERBS: Readonly<Record<VerbClass, string>> = { ar: 'hablar', er: 'comer', ir: 'vivir' };

export function endingsFor(tense: keyof typeof END, cls: VerbClass): readonly string[] {
  const t = END[tense];
  return 'all' in t ? t.all : t[cls];
}

// Auxiliary "haber" for compound tenses (person-aligned).
const HABER: Readonly<Record<CompoundTense, readonly string[]>> = {
  perfecto: ['he', 'has', 'ha', 'hemos', 'habéis', 'han'],
  plusc: ['había', 'habías', 'había', 'habíamos', 'habíais', 'habían'],
  futperf: ['habré', 'habrás', 'habrá', 'habremos', 'habréis', 'habrán'],
  condperf: ['habría', 'habrías', 'habría', 'habríamos', 'habríais', 'habrían'],
  perfsubj: ['haya', 'hayas', 'haya', 'hayamos', 'hayáis', 'hayan'],
  pluscsubj: ['hubiera', 'hubieras', 'hubiera', 'hubiéramos', 'hubierais', 'hubieran'],
  pluscsubjse: ['hubiese', 'hubieses', 'hubiese', 'hubiésemos', 'hubieseis', 'hubiesen'],
};
export const COMPOUND_TENSES = Object.keys(HABER) as CompoundTense[];
export function isCompound(tense: TenseKey): tense is CompoundTense {
  return tense in HABER;
}
/** Which compound tense a haber form of this simple tense builds. */
export const COMPOUND_OF_HABER: Readonly<Partial<Record<TenseKey, CompoundTense>>> = {
  presente: 'perfecto', imperfecto: 'plusc', futuro: 'futperf', condicional: 'condperf',
  presubj: 'perfsubj', impsubj: 'pluscsubj', impsubjse: 'pluscsubjse',
};

export function stemOf(inf: string): string { return inf.slice(0, -2); }
export function vowelOf(inf: string): VerbClass {
  const e = inf.slice(-2);
  if (e === 'ír') return 'ir';                       // oír, reír
  return e as VerbClass;
}

// ---- reflexives ------------------------------------------------------------
export function isReflexive(inf: string): boolean { return /(arse|erse|irse|írse)$/.test(inf); }
export function reflexiveBase(inf: string): string { return inf.slice(0, -2); }
/** The bare (non-reflexive) verb a reflexive conjugates as: every field kept. */
function bare(v: Verb): Verb { return isReflexive(v.inf) ? { ...v, inf: reflexiveBase(v.inf) } : v; }

// ---- `like`: prefixed compounds ------------------------------------------
/* A prefixed compound of an irregular verb (mantener < tener, proponer <
 * poner) inflects exactly like its base. `like` is prefixing, so it only holds
 * when the infinitive literally ends with its base: "reducir" is NOT
 * "conducir" with a prefix. A reflexive base (reencontrarse < encontrarse) is
 * matched on its bare form — the old engine compared "reencontrar" with
 * "encontrarse", never matched, and produced "me reencontro". */
function resolveLike(v: Verb): { base: Verb; likeBare: string } | null {
  if (!v.like) return null;
  const likeBare = isReflexive(v.like) ? reflexiveBase(v.like) : v.like;
  if (!v.inf.endsWith(likeBare)) return null;
  const b = verbByInf(v.like);
  if (!b) return null;
  const base = bare(b);
  if (base.inf === v.inf && base.like === v.like) return null;   // self-reference guard
  return { base, likeBare };
}

/* Prefixing a base verb's forms. A monosyllabic form ending in a vowel, n or s
 * (ten, pon, ven, vi, ves, veis) becomes the final stressed syllable of a
 * longer word and takes a written accent: mantén, propón, preví, prevéis. */
export function prefixForms(inf: string, likeInf: string, forms: readonly string[]): string[] {
  const pre = inf.slice(0, inf.length - likeInf.length);
  if (!pre) return forms.slice();
  return forms.map((f) => {
    if (!f) return f;
    return f.split(' ').map((word, i) => {
      if (i > 0) return word;                        // "he comido": prefix the first only
      const mono = !/[áéíóú]/.test(word) && nuclei(word).length === 1 &&
        (isVowel(word.charAt(word.length - 1)) || /[ns]$/.test(word));
      return pre + (mono ? accentMonosyllable(word) : word);
    }).join(' ');
  });
}

// ---- participle / gerund -------------------------------------------------
/* Irregular participles belong to families. The old engine stored them per
 * verb, so every derivative added without `part` came out regular: devolvido,
 * resolvido, absolvido, suscribido. A family rule covers each new derivative. */
const PART_FAMILIES: ReadonlyArray<[RegExp, string]> = [
  [/olver$/, 'uelto'],                               // volver, devolver, resolver, absolver, disolver
  [/poner$/, 'puesto'],                              // poner, componer, oponer, descomponer
  [/scribir$/, 'scrito'],                            // escribir, describir, suscribir, inscribir
  [/cubrir$/, 'cubierto'],                           // cubrir, descubrir, encubrir
  [/^((?:des|re)?)hacer$/, '$1hecho'],               // hacer, deshacer, rehacer
  [/facer$/, 'fecho'],                               // satisfacer
  [/^((?:pre|contra|des)?)decir$/, '$1dicho'],       // not bendecir/maldecir (bendecido)
  [/^((?:pre|entre|re)?)ver$/, '$1visto'],           // not mover/llover/atreverse
  [/^((?:entre|re)?)abrir$/, '$1abierto'],
  [/^romper$/, 'roto'],                              // corromper is regular
  [/^morir$/, 'muerto'],
  [/freír$/, 'frito'],
  [/imprimir$/, 'impreso'],
  [/proveer$/, 'provisto'],
];

function familyParticiple(inf: string): string | null {
  for (const [re, to] of PART_FAMILIES) if (re.test(inf)) return inf.replace(re, to);
  return null;
}

/** A reflexive with no field of its own defers to its base verb when the list
 *  has it: morirse has no `ger`, morir does. */
function reflexiveDefer(v: Verb, field: 'part' | 'ger'): Verb {
  const b = bare(v);
  if (v[field]) return b;
  const base = verbByInf(b.inf);
  return base && !isReflexive(base.inf) ? base : b;
}

export function participle(v: Verb): string {
  if (isReflexive(v.inf)) return participle(reflexiveDefer(v, 'part'));
  if (v.part) return v.part;
  const lk = resolveLike(v);
  if (lk) return prefixForms(v.inf, lk.likeBare, [participle(lk.base)])[0];
  const fam = familyParticiple(v.inf);
  if (fam) return fam;
  const stem = stemOf(v.inf);
  if (vowelOf(v.inf) === 'ar') return stem + 'ado';
  // a/e/o-final stems accent the i: leído, caído, oído (but incluido, construido)
  if (/[aeo]$/.test(stem)) return stem + 'ído';
  return stem + 'ido';
}

/** The participle plus any accepted alternatives (frito, freído). */
export function participles(v: Verb): string[] {
  const main = participle(v);
  return [main, ...(v.partAlt ?? []).filter((p) => p !== main)];
}

export function gerund(v: Verb): string {
  if (isReflexive(v.inf)) return gerund(reflexiveDefer(v, 'ger'));
  if (v.ger) return v.ger;
  const lk = resolveLike(v);
  if (lk) return prefixForms(v.inf, lk.likeBare, [gerund(lk.base)])[0];
  const cls = vowelOf(v.inf);
  let stem = stemOf(v.inf);
  if (cls === 'ar') return stem + 'ando';
  // -ir stem-changers take their weaker vowel: sentir>sintiendo, dormir>durmiendo
  if (cls === 'ir' && v.stem && SECONDARY[v.stem]) stem = changeLastVowel(stem, SECONDARY[v.stem]);
  // ñ/ll absorb the i: riñendo, bullendo
  if (/(ñ|ll)$/.test(stem)) return stem + 'endo';
  // a vowel-final stem turns the i to y: leyendo, incluyendo, cayendo
  if (isVowel(stem.charAt(stem.length - 1)) && !/[gq]u$/.test(stem)) return stem + 'yendo';
  return stem + 'iendo';
}

// ---- stem changes --------------------------------------------------------
/* -ir stem-changers make a second, weaker change where the first cannot apply.
 * 'í' and 'ú' are the -iar/-uar accent classes (enviar>envío,
 * continuar>continúo): their "secondary" is themselves; they are all -ar. */
const SECONDARY: Readonly<Record<StemChange, string>> = { ie: 'i', ue: 'u', i: 'i', 'í': 'í', 'ú': 'ú' };

/* Replace the LAST vowel of a stem — where every Spanish stem change lands.
 * The u of a "gu"/"qu" digraph is spelling, not a vowel: seguir > sigu-. */
function changeLastVowel(stem: string, target: string): string {
  for (let i = stem.length - 1; i >= 0; i--) {
    if (!isVowel(stem[i])) continue;
    if (stem[i] === 'u' && i > 0 && (stem[i - 1] === 'g' || stem[i - 1] === 'q')) continue;
    return stem.slice(0, i) + target + stem.slice(i + 1);
  }
  return stem;
}

// The "boot": yo, tú, él, ellos.
const inBoot = (idx: number) => idx === 0 || idx === 1 || idx === 2 || idx === 5;

function stemFor(v: Verb, base: string, tense: TenseKey, idx: number, cls: VerbClass): string {
  const sc = v.stem;
  if (!sc || !SECONDARY[sc]) return base;
  const second = SECONDARY[sc];
  if (tense === 'presente') return inBoot(idx) ? changeLastVowel(base, sc) : base;
  if (tense === 'presubj') {
    if (inBoot(idx)) return changeLastVowel(base, sc);
    return cls === 'ir' ? changeLastVowel(base, second) : base;
  }
  if (tense === 'preterito' && cls === 'ir' && (idx === 2 || idx === 5)) return changeLastVowel(base, second);
  return base;
}

const ZC_RE = /[aeiou]c(er|ir)$/;          // conocer, parecer, conducir -> -zc-
const UIR_RE = /[^gq]uir$/;                // incluir, construir (not seguir/delinquir)

/* Join stem and ending, applying the sound-preserving spelling changes. */
function joinForm(stem: string, ending: string, inf: string, cls: VerbClass): string {
  const e0 = ending.charAt(0);
  const front = e0 === 'e' || e0 === 'é' || e0 === 'i' || e0 === 'í';
  const back = e0 === 'a' || e0 === 'á' || e0 === 'o' || e0 === 'ó';

  if (cls === 'ar') {
    // -ar verbs adjust before a FRONT vowel (preterite yo, all of the subjunctive)
    if (front) {
      if (/gu$/.test(stem)) return stem.slice(0, -2) + 'gü' + ending;   // averiguar
      if (/c$/.test(stem)) return stem.slice(0, -1) + 'qu' + ending;    // buscar
      if (/g$/.test(stem)) return stem + 'u' + ending;                  // llegar
      if (/z$/.test(stem)) return stem.slice(0, -1) + 'c' + ending;     // realizar
    }
  } else {
    // -er/-ir verbs adjust before a BACK vowel (present yo, all of the subjunctive)
    if (back) {
      if (ZC_RE.test(inf) && /c$/.test(stem)) return stem.slice(0, -1) + 'zc' + ending;
      if (/qu$/.test(stem)) return stem.slice(0, -2) + 'c' + ending;     // delinquir
      if (/gu$/.test(stem)) return stem.slice(0, -1) + ending;           // seguir -> sigo
      if (/g$/.test(stem)) return stem.slice(0, -1) + 'j' + ending;      // coger -> cojo
      if (/c$/.test(stem)) return stem.slice(0, -1) + 'z' + ending;      // vencer -> venzo
    }
    // ñ/ll absorb the unstressed i of -ió/-ieron: riñó, riñeron (not *riñió)
    if (/(ñ|ll)$/.test(stem) && (ending === 'ió' || ending === 'ieron')) return stem + ending.slice(1);
    // stems ending in a vowel: the unstressed i of an ending becomes y
    // (leyó, incluyeron) and otherwise takes an accent (leíste, oímos)
    if (isVowel(stem.charAt(stem.length - 1)) && !/[gq]u$/.test(stem)) {
      if (ending === 'ió') return stem + 'yó';
      if (ending === 'ieron') return stem + 'yeron';
      if (UIR_RE.test(inf) && (back || e0 === 'e')) return stem + 'y' + ending;
      // a/e/o-final stems accent the i; u-final ones do not (incluiste)
      if (/[aeo]$/.test(stem) && e0 === 'i') return stem + 'í' + ending.slice(1);
    }
  }
  return stem + ending;
}

function regular(v: Verb, tense: keyof typeof END): string[] {
  const cls = vowelOf(v.inf);
  if (tense === 'futuro' || tense === 'condicional') {
    const fbase = deaccent(v.inf);                   // oír -> oir (oiré, not oíré)
    return endingsFor(tense, cls).map((e) => fbase + e);
  }
  const base = stemOf(v.inf);
  return endingsFor(tense, cls).map((e, idx) => joinForm(stemFor(v, base, tense, idx, cls), e, v.inf, cls));
}

function likeTuCmd(v: Verb): string | null {
  const lk = resolveLike(v);
  if (!lk) return null;
  const cmd = lk.base.tuCmd ?? likeTuCmd(lk.base);
  return cmd ? prefixForms(v.inf, lk.likeBare, [cmd])[0] : null;
}

/** Forms for a NON-reflexive infinitive, before the RAE 2010 pass. */
function conjugateBase(v: Verb, tense: TenseKey): string[] {
  if (isCompound(tense)) {
    const p = participle(v);
    return HABER[tense].map((h) => h + ' ' + p);
  }

  // Imperfect (-ra/-se) and future subjunctive: from the 3rd-plural preterite.
  if (tense === 'impsubj' || tense === 'impsubjse' || tense === 'futsubj') {
    const base = conjugateBase(v, 'preterito')[5].replace(/ron$/, '');
    const e = tense === 'impsubj' ? 'ra' : tense === 'impsubjse' ? 'se' : 're';
    return [base + e, base + e + 's', base + e, accentLastVowel(base) + e + 'mos', base + e + 'is', base + e + 'n'];
  }

  if (tense === 'imperativo') {
    const pres = conjugateBase(v, 'presente');
    const subj = conjugateBase(v, 'presubj');
    return [
      v.tuCmd ?? likeTuCmd(v) ?? pres[2],            // tú
      subj[2],                                       // usted
      v.nosCmd ?? subj[3],                           // nosotros
      v.inf.slice(0, -1) + 'd',                      // vosotros
      subj[5],                                       // ustedes
    ];
  }

  // Negative imperative: entirely subjunctive-based, including tú.
  if (tense === 'impneg') {
    const s = conjugateBase(v, 'presubj');
    return [s[1], s[2], s[3], s[4], s[5]].map((f) => 'no ' + f);
  }

  const stored = v.forms?.[tense as StoredTense];
  if (stored) return stored.slice();
  const lk = resolveLike(v);
  if (lk) return prefixForms(v.inf, lk.likeBare, conjugateBase(lk.base, tense));
  return regular(v, tense);
}

const REFLEX_PRON = ['me', 'te', 'se', 'nos', 'os', 'se'];

function reflexivize(forms: string[], tense: TenseKey, baseInf: string): string[] {
  if (tense === 'imperativo') {
    return forms.map((f, i) => {
      if (!f) return f;
      if (i === 2) return attachEnclitic(f.slice(0, -1), 'nos');      // levantemos > levantémonos
      if (i === 3) {                                                  // vosotros: drop -d, + os
        if (baseInf === 'ir') return 'idos';                          // irse keeps its d
        const stem = f.slice(0, -1);
        const s = vowelOf(baseInf) === 'ir' && !/[áéíóú]/.test(stem) ? accentLastVowel(stem) : stem;
        return s + 'os';
      }
      return attachEnclitic(f, i === 0 ? 'te' : 'se');
    });
  }
  if (tense === 'impneg') {
    const pron = ['te', 'se', 'nos', 'os', 'se'];
    return forms.map((f, i) => (f ? f.replace(/^no /, 'no ' + pron[i] + ' ') : f));
  }
  return forms.map((f, i) => (f ? REFLEX_PRON[i] + ' ' + f : f));
}

export interface Cell {
  form: string;
  /** The pre-2010 accented spelling, when the RAE 2010 rule removed it (rió). */
  legacy?: string;
}

function fix2010(form: string): Cell {
  const fixed = form.split(' ').map(monosyllable2010).join(' ');
  return fixed === form ? { form } : { form: fixed, legacy: form };
}

function asVerb(v: Verb | string): Verb {
  if (typeof v !== 'string') return v;
  const found = verbByInf(v);
  if (!found) throw new Error(`unknown verb: ${v}`);
  return found;
}

/** Bare conjugation (no reflexive pronoun), RAE-2010 corrected. Used by the
 *  analyser, which indexes "levanto" rather than "me levanto". */
export function conjugateBareCells(v: Verb | string, tense: TenseKey): Cell[] {
  return conjugateBase(bare(asVerb(v)), tense).map(fix2010);
}

export function conjugateCells(v: Verb | string, tense: TenseKey): Cell[] {
  const verb = asVerb(v);
  if (isReflexive(verb.inf)) {
    const b = bare(verb);
    return reflexivize(conjugateBase(b, tense), tense, b.inf).map(fix2010);
  }
  return conjugateBase(verb, tense).map(fix2010);
}

/** Every form of a verb in a tense, in PERSONS (or IMP_PERSONS) order. */
export function conjugate(v: Verb | string, tense: TenseKey): string[] {
  return conjugateCells(v, tense).map((c) => c.form);
}

export function personsFor(tense: TenseKey): readonly (Person | ImpPerson)[] {
  return tense === 'imperativo' || tense === 'impneg' ? IMP_PERSONS : PERSONS;
}

/** Every spelling a learner may type for one cell and be right: the form, its
 *  pre-2010 spelling (rió), the -se imperfect subjunctive (hablase beside
 *  hablara, hubiese beside hubiera), and alternative participles (he freído). */
export function acceptedForms(v: Verb | string, tense: TenseKey, idx: number): string[] {
  const verb = asVerb(v);
  const out = new Set<string>();
  const add = (c: Cell | undefined) => { if (c) { out.add(c.form); if (c.legacy) out.add(c.legacy); } };
  add(conjugateCells(verb, tense)[idx]);
  if (tense === 'impsubj') add(conjugateCells(verb, 'impsubjse')[idx]);
  if (tense === 'pluscsubj') add(conjugateCells(verb, 'pluscsubjse')[idx]);
  if (isCompound(tense) && verb.partAlt?.length) {
    const main = participle(verb);
    for (const f of [...out]) for (const alt of verb.partAlt) out.add(f.replace(new RegExp(main + '$'), alt));
  }
  return [...out];
}

export function isIrregular(v: Verb): boolean {
  return !!(v.forms || v.part || v.ger || v.tuCmd);
}

/** Is this verb irregular IN THIS TENSE? A stem-changer is irregular in the
 *  present and the subjunctive but regular in the imperfect. */
export function isIrregularIn(v: Verb | null | undefined, tense: TenseKey): boolean {
  if (!v) return false;
  if (v.forms && v.forms[tense as StoredTense]) return true;
  if (v.like) return true;
  if (v.stem) {
    if (tense === 'presente' || tense === 'presubj' || tense === 'imperativo') return true;
    if (tense === 'preterito' && vowelOf(v.inf) === 'ir') return true;
  }
  return false;
}

/* ---- voseo (recognition only) ---------------------------------------------
 * The course teaches tú, but a learner reading Argentine or Central American
 * Spanish meets vos. The present is the vosotros form without its i
 * (habláis > hablás, tenéis > tenés, sois > sos); the imperative is the
 * vosotros one without its d, stressed on the end (hablad > hablá, tened >
 * tené). Where that comes out the same as the tú form (vas, das, ves) or as a
 * monosyllable (da, ve, sé) there is nothing distinctly voseo to recognise. */
export function voseoForms(v: Verb | string): { presente: string | null; imperativo: string | null } {
  const b = bare(asVerb(v));
  const pres = conjugateBareCells(b, 'presente');
  const vosPres = pres[4].form.replace(/([aeoáéó])i(s)$/, '$1$2');
  const imp = conjugateBareCells(b, 'imperativo');
  let vosImp: string | null = null;
  if (b.inf !== 'ir' && /d$/.test(imp[3].form)) {
    const stem = imp[3].form.slice(0, -1);
    const n = nuclei(stem).length;
    if (n > 1) vosImp = /[áéíóú]/.test(stem) ? stem : accentLastNucleus(stem);
  }
  return {
    presente: vosPres !== pres[1].form ? vosPres : null,
    imperativo: vosImp && vosImp !== imp[0].form ? vosImp : null,
  };
}

function accentLastNucleus(word: string): string {
  const ns = nuclei(word);
  const [a, b] = ns[ns.length - 1];
  return word.slice(0, a) + accentMonosyllable(word.slice(a, b)) + word.slice(b);
}
