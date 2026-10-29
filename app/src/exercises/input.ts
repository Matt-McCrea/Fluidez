/* ============================================================================
 * GENERATOR 1 — STRUCTURED INPUT WITH MINIMAL PAIRS.
 *
 * The learner reads two to four Spanish sentences that differ ONLY in one
 * feature and picks the one a plain-English question describes. The feature
 * is the only evidence: time words are removed from a tense pair (ayer would
 * give it away), the subject pronoun from a person pair.
 *
 * Every distractor is built by the engine or a closed rule and checked:
 *  - its verb form round-trips through the analyser as the intended cell;
 *  - it never reads as the right answer (comía is yo AND él, so a yo/él pair
 *    on comía is dropped; tú vs él is dropped because él also means usted,
 *    "you");
 *  - it is not the same sentence as any other option.
 * ========================================================================== */
import type { BankSentence, NodeId } from '../content/schema';
import type { Person, TenseKey } from '../engine';
import { itemId, rng, shuffle, shuffled } from './rng';
import { changePerson, changeTense, form, stripTimeWords } from './reinflect';
import {
  GENDER_PAIRS, detGender, detNumber, enSubject, enWords, finiteCandidates, isPluralWord, low,
  otherGender, parseClause, pluralize, removeToks, render, replaceCore, sentenceKey, singularize, toToks, verbReadings,
  type Clause, type Tok,
} from './spanish';
import type { Feature, ReadAndPickItem } from './types';

export interface InputOptions {
  seed?: number | string;
  /** Skill node for each feature, added to the item's nodes. */
  featureNodes?: Partial<Record<Feature, NodeId>>;
  /** Maximum distractors (default 2: three options). */
  maxDistractors?: number;
}

export const ALL_FEATURES: readonly Feature[] = ['tense', 'person', 'mood', 'clitic', 'copula', 'porpara', 'number', 'gender'];

function make(s: BankSentence, feature: Feature, target: string, correct: string, distractors: string[], question: string, why: string, opts: InputOptions, en?: string): ReadAndPickItem | null {
  const key = sentenceKey(correct);
  const seen = new Set([key]);
  const ds: string[] = [];
  for (const d of distractors) {
    const k = sentenceKey(d);
    if (!k || seen.has(k)) continue;                   // never equal to the answer, never twice
    seen.add(k);
    ds.push(d);
  }
  if (!ds.length) return null;
  const r = rng(`${opts.seed ?? 0}|${s.id}|${feature}`);
  const chosen = shuffle(ds, r).slice(0, opts.maxDistractors ?? 2);
  const { options, answer } = shuffled(correct, chosen, r);
  const nodes = [...s.targets];
  const fn = opts.featureNodes?.[feature];
  if (fn && !nodes.includes(fn)) nodes.push(fn);
  return {
    id: itemId('input', s.id, `${feature}:${target}`), generator: 'input', sentenceId: s.id, nodes,
    kind: 'readAndPick', feature, question, options, answer, why, ...(en ? { en } : {}),
  };
}

// ---- tense ---------------------------------------------------------------------

const TENSE_Q: Partial<Record<TenseKey, string>> = {
  presente: 'Which one is about now, or something that happens regularly?',
  preterito: 'Which one is about something that already happened?',
  imperfecto: 'Which one describes how things used to be?',
  futuro: 'Which one is about something that will happen?',
};
const TENSE_WHY: Partial<Record<TenseKey, string>> = {
  presente: 'is happening now or usually',
  preterito: 'already happened and is finished',
  imperfecto: 'is how things used to be',
  futuro: 'is still to come',
};

function tenseItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const c0 = parseClause(s.es, s.en);
  if (!c0 || c0.participle >= 0 || !TENSE_Q[c0.choice.tense]) return null;
  const stripped = render(stripTimeWords(c0.toks));
  const c = parseClause(stripped, s.en);
  if (!c || c.choice.tense !== c0.choice.tense) return null;
  const tense = c.choice.tense;
  // ser/estar in the preterite (fue blanca, estuvo fría) is grammatical but
  // odd as a description; their past in a description is the imperfect.
  const past: TenseKey = /^(ser|estar)$/.test(c.choice.inf) ? 'imperfecto' : 'preterito';
  const pool: TenseKey[] = tense === 'imperfecto' || tense === 'preterito'
    ? (['presente', 'futuro'] as TenseKey[])
    : (['presente', past, 'futuro'] as TenseKey[]).filter((t) => t !== tense);
  const correctForm = low(c.toks[c.verb]);
  const ds: string[] = [];
  for (const t of pool) {
    // the right form must not also be a reading of the distractor's tense
    if (verbReadings(correctForm).some((a) => a.tense === t && a.person === c.choice.person)) continue;
    const r = changeTense(c, t);
    if (r) ds.push(r.es);
  }
  return make(s, 'tense', tense, stripped, ds, TENSE_Q[tense]!, `"${c.toks[c.verb].core}" ${TENSE_WHY[tense]}.`, opts);
}

// ---- person --------------------------------------------------------------------

function personQuestion(p: Person, en: string): string {
  const pr = enSubject(en)?.pronoun;
  switch (p) {
    case 'yo': return 'Which one is about me (I)?';
    case 'tú': return 'Which one is said to one friend: "you"?';
    case 'él/ella': return pr === 'she' ? 'Which one is about her (she)?' : pr === 'he' ? 'Which one is about him (he)?' : 'Which one is about one other person (he or she)?';
    case 'nosotros': return 'Which one is about us (we)?';
    default: return 'Which one is about them (they)?';
  }
}
const PERSON_WHY: Partial<Record<Person, string>> = {
  yo: 'the ending points to "I"', 'tú': 'the ending points to "you" (one friend)', 'él/ella': 'the ending points to "he" or "she"',
  nosotros: 'the ending points to "we"', ellos: 'the ending points to "they"',
};
/** Persons a distractor may NOT have: the ones English could also call by the
 *  question's word. él/ella and ellos both also mean "you" (usted, ustedes). */
const PERSON_CLASH: Partial<Record<Person, Person[]>> = { 'tú': ['él/ella', 'ellos'] };

function personItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const c0 = parseClause(s.es, s.en);
  if (!c0) return null;
  const base = c0.subject >= 0 ? render(removeToks(c0.toks, c0.subject, c0.subject + 1)) : s.es;
  const c = c0.subject >= 0 ? parseClause(base, s.en) : c0;
  if (!c || c.choice.person !== c0.choice.person) return null;
  const target = c.choice.person;
  // usted / ustedes are "you" in English: a question saying "him" or "them" would lie
  const sub = enSubject(s.en);
  if (c0.subject >= 0 && /^(usted|ustedes)$/.test(low(c0.toks[c0.subject]))) return null;
  if (sub && (sub.pronoun === 'you all' || (sub.pronoun === 'you' && target !== 'tú'))) return null;
  const formNow = low(c.verb >= 0 ? c.toks[c.verb] : undefined);
  const ds: string[] = [];
  for (const p of ['yo', 'tú', 'él/ella', 'nosotros', 'ellos'] as Person[]) {
    if (p === target || PERSON_CLASH[target]?.includes(p)) continue;
    if (verbReadings(formNow).some((a) => a.person === p && a.tense === c.choice.tense)) continue; // comía: yo = él
    // dropped subject: the English pins nothing about the distractor, so no `en`
    const r = changePerson(c, p, { en: s.en });
    if (!r) continue;
    const nf = low(r.toks[c.verb]);
    if (verbReadings(nf).some((a) => a.person === target && a.tense === c.choice.tense)) continue;
    ds.push(r.es);
  }
  return make(s, 'person', target, base, ds, personQuestion(target, s.en), `"${c.toks[c.verb].core}": ${PERSON_WHY[target]}.`, opts);
}

// ---- mood (fact or not) --------------------------------------------------------

const MOOD_FRAMES: ReadonlyArray<{ test: (ts: Tok[], i: number) => boolean; ind: string; subj: string; whyInd: string; whySubj: string }> = [
  {
    test: (ts, i) => low(ts[i]) === 'aunque',
    ind: 'Which one says it is definitely true?', subj: 'Which one says it may or may not be true, and it doesn\'t matter which?',
    whyInd: 'after "aunque", the normal form states a fact', whySubj: 'after "aunque", the subjunctive leaves it open',
  },
  {
    test: (ts, i) => low(ts[i]) === 'cuando' && !/[?]/.test(render(ts)),
    ind: 'Which one is about something that happens regularly?', subj: "Which one is about something that hasn't happened yet?",
    whyInd: 'after "cuando", the normal form is for what usually happens', whySubj: 'after "cuando", the subjunctive is for what hasn\'t happened yet',
  },
  {
    test: (ts, i) => low(ts[i]) === 'que' && verbReadings(low(ts[i - 1])).some((a) => a.inf === 'decir' && a.tense === 'presente'),
    ind: 'Which one is just passing on what someone says?', subj: 'Which one is someone telling another person to do something?',
    whyInd: 'decir que + the normal form reports information', whySubj: 'decir que + the subjunctive passes on an instruction',
  },
];

function moodItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const ts = toToks(s.es);
  for (let i = 0; i < ts.length; i++) {
    const frame = MOOD_FRAMES.find((f) => f.test(ts, i));
    if (!frame) continue;
    const cand = finiteCandidates(ts).find((x) => x.index > i);
    if (!cand) return null;
    let an = cand.analyses.filter((a) => a.tense === 'presente' || a.tense === 'presubj');
    // venga / llueva are yo AND él: yo only with an explicit "yo" in front
    if (an.some((a) => a.person === 'yo') && an.some((a) => a.person === 'él/ella') && low(ts[cand.index - 1]) !== 'yo') an = an.filter((a) => a.person !== 'yo');
    if (!an.length || new Set(an.map((a) => a.tense)).size > 1) return null;
    const from = an[0].tense;
    const to: TenseKey = from === 'presente' ? 'presubj' : 'presente';
    const others = new Set(an.map((a) => form(a.inf, to, a.person as Person)));
    if (others.size !== 1 || others.has(null)) return null;           // every reading must give one form
    const nf = [...others][0]!;
    if (verbReadings(nf).some((a) => a.tense === from)) return null;
    const swapped = render(replaceCore(ts, cand.index, nf));
    const subjunctive = from === 'presubj';
    return make(s, 'mood', from, s.es, [swapped], subjunctive ? frame.subj : frame.ind, `${subjunctive ? frame.whySubj : frame.whyInd}.`, opts, s.en);
  }
  return null;
}

// ---- clitic (who did what to whom) ----------------------------------------------

const CLITIC_EN: Readonly<Record<string, readonly string[]>> = {
  lo: ['him', 'it'], la: ['her', 'it'], los: ['them'], las: ['them'], le: ['him', 'her'], les: ['them'],
};

function cliticItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const c = parseClause(s.es, s.en);
  if (!c || c.proclitics.length !== 1 || c.reflexive) return null;
  const at = c.proclitics[0];
  const target = low(c.toks[at]);
  if (!CLITIC_EN[target]) return null;
  const ew = enWords(s.en);
  const objs = ew.filter((w, i) => /^(him|her|it|them)$/.test(w) && !(w === 'her' && ew[i + 1] && !/^(the|a|an|every|today|now|again)$/.test(ew[i + 1])));
  if (objs.length !== 1 || !CLITIC_EN[target].includes(objs[0])) return null;
  const set = /^le/.test(target) ? ['le', 'les'] : ['lo', 'la', 'los', 'las'];
  const ds = set.filter((x) => x !== target && !CLITIC_EN[x].includes(objs[0])).map((x) => render(replaceCore(c.toks, at, x)));
  return make(s, 'clitic', target, s.es, ds, `Which one means "${s.en}"?`, `"${target}" is "${objs[0]}" here.`, opts);
}

// ---- ser / estar ---------------------------------------------------------------

/** Adjectives that take both ser and estar with a real difference. */
const MEANING_CHANGE: Readonly<Record<string, { ser: string; estar: string }>> = {
  aburrido: { ser: 'boring', estar: 'bored' }, listo: { ser: 'clever', estar: 'ready' }, malo: { ser: 'bad', estar: 'ill' },
  rico: { ser: 'rich', estar: 'tasty' }, verde: { ser: 'green', estar: 'unripe' }, cansado: { ser: 'tiring', estar: 'tired' },
  despierto: { ser: 'sharp', estar: 'awake' }, vivo: { ser: 'lively', estar: 'alive' },
};
const STATE_OR_TRAIT = new Set(['tranquilo', 'nervioso', 'alegre', 'serio', 'guapo', 'feo', 'gordo', 'delgado', 'frío', 'caliente', 'callado', 'triste', 'limpio', 'sucio', 'bonito']);

function lemmaAdj(w: string): string {
  const sg = isPluralWord(w) ? singularize(w) : w;
  if (MEANING_CHANGE[sg] || STATE_OR_TRAIT.has(sg)) return sg;
  const m = /a$/.test(sg) ? sg.slice(0, -1) + 'o' : sg;
  return m;
}

function copulaItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const c = parseClause(s.es, s.en);
  if (!c || c.participle >= 0 || !/^(ser|estar)$/.test(c.choice.inf)) return null;
  let j = c.verb + 1;
  if (low(c.toks[j]) === 'muy') j++;
  const adj = low(c.toks[j]);
  if (!adj || j !== c.toks.length - 1) return null;                 // the adjective must end the sentence
  const lemma = lemmaAdj(adj);
  const mc = MEANING_CHANGE[lemma];
  if (!mc && !STATE_OR_TRAIT.has(lemma)) return null;
  const other = c.choice.inf === 'ser' ? 'estar' : 'ser';
  const nf = form(other, c.choice.tense, c.choice.person);
  if (!nf) return null;
  const swapped = render(replaceCore(c.toks, c.verb, nf));
  const isEstar = c.choice.inf === 'estar';
  let question: string;
  if (mc) {
    const gloss = isEstar ? mc.estar : mc.ser;
    if (!enWords(s.en).includes(gloss)) return null;
    question = `Which one means "${s.en}"?`;
  } else {
    question = isEstar ? 'Which one is about how it is right now?' : 'Which one is about what it is always like?';
  }
  const why = isEstar ? 'estar is for how something is at the moment.' : 'ser is for what something is like.';
  return make(s, 'copula', c.choice.inf, s.es, [swapped], question, why, opts);
}

// ---- por / para ----------------------------------------------------------------

const PERSON_AFTER = /^(mí|ti|él|ella|usted|nosotros|nosotras|ellos|ellas|ustedes)$/;
const FAMILY = /^(familia|hijos?|hijas?|padres|mamá|papá|madre|padre|hermanos?|hermanas?|abuelos?|abuelas?|amigos?|amigas?|esposo|esposa|novio|novia)$/;
const FIXED_POR = /^(favor|eso|fin|qué|ejemplo|supuesto|ciento|cierto|suerte|lo|la|las|los|el|un|una)$/;
const MOTION = new Set(['salir', 'viajar', 'pasar', 'caminar', 'ir', 'manejar', 'correr']);

function porParaItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const ts = toToks(s.es);
  const i = ts.findIndex((t) => /^(por|para)$/.test(low(t)));
  if (i < 0 || ts.filter((t) => /^(por|para)$/.test(low(t))).length > 1) return null;
  const word = low(ts[i]);
  if (low(ts[i - 1]) === 'gracias' || (word === 'por' && FIXED_POR.test(low(ts[i + 1])) && !/^mis?$/.test(low(ts[i + 1])))) return null;
  const next = low(ts[i + 1]), next2 = low(ts[i + 2]);
  const personal = PERSON_AFTER.test(next) || (/^(mi|mis|tu|tus|su|sus|nuestra|nuestros|nuestras|nuestro)$/.test(next) && FAMILY.test(next2) && i + 3 === ts.length);
  const verbAn = finiteCandidates(ts).find((x) => x.index < i)?.analyses ?? [];
  const place = !personal && i + 2 === ts.length && /^[A-ZÁÉÍÓÚ]/.test(ts[i + 1].core) && verbAn.some((a) => MOTION.has(a.inf));
  if (!personal && !place) return null;
  const swapped = render(replaceCore(ts, i, word === 'por' ? 'para' : 'por'));
  const Q = personal
    ? { por: 'Which one says you do it for their sake, because of them?', para: 'Which one says who it is meant for, or who you work for?' }
    : { por: 'Which one is about going through or around a place?', para: 'Which one says where they are heading?' };
  const WHY = personal
    ? { por: 'por + a person: for their sake, on their behalf.', para: 'para + a person: the one who receives it.' }
    : { por: 'por + a place: through or around it.', para: 'para + a place: the destination.' };
  return make(s, 'porpara', word, s.es, [swapped], Q[word as 'por' | 'para'], WHY[word as 'por' | 'para'], opts, s.en);
}

// ---- number and gender agreement --------------------------------------------------

/** "La casa es blanca" > "Las casas son blancas": subject NP, verb and predicate. */
function flipNumber(c: Clause): string | null {
  const { inf, tense, person } = c.choice;
  if (person !== 'él/ella' && person !== 'ellos') return null;
  if (c.groupStart < 2 || c.groupStart > 3 || c.subject >= 0) return null;
  const toPlural = person === 'él/ella';
  const det = low(c.toks[0]);
  const nd = detNumber(det, toPlural);
  if (!nd || nd === det) return null;
  let ts = replaceCore(c.toks, 0, nd);
  for (let k = 1; k < c.groupStart; k++) {
    const w = low(ts[k]);
    const nw = toPlural ? pluralize(w) : singularize(w);
    if (nw === w) return null;
    ts = replaceCore(ts, k, nw);
  }
  const nf = form(inf, tense, toPlural ? 'ellos' : 'él/ella');
  if (!nf) return null;
  ts = replaceCore(ts, c.verb, nf);
  if (/^(ser|estar)$/.test(inf)) {
    let j = c.verb + 1;
    if (low(ts[j]) === 'muy') j++;
    if (j !== ts.length - 1) return null;
    const w = low(ts[j]);
    const nw = toPlural ? pluralize(w) : singularize(w);
    ts = replaceCore(ts, j, nw);
  } else if (c.toks.slice(c.verb + 1).some((t) => /^(mi|mis|su|sus|tu|tus)$/.test(low(t)))) return null;
  return render(ts);
}

function numberItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const c = parseClause(s.es, s.en);
  if (!c) return null;
  const flipped = flipNumber(c);
  if (!flipped) return null;
  const plural = c.choice.person === 'ellos';
  return make(s, 'number', plural ? 'plural' : 'singular', s.es, [flipped],
    plural ? 'Which one is about more than one?' : 'Which one is about just one?',
    plural ? 'The article, the noun, the verb and the adjective are all plural.' : 'The article, the noun, the verb and the adjective are all singular.', opts, s.en);
}

function genderItem(s: BankSentence, opts: InputOptions): ReadAndPickItem | null {
  const c = parseClause(s.es, s.en);
  if (!c) return null;
  const copula = /^(ser|estar)$/.test(c.choice.inf) && c.participle < 0;
  // (a) a noun that comes in pairs: el niño es alto > la niña es alta
  const pair = GENDER_PAIRS.find((p) => [p.m, p.f].includes(low(c.toks[1])));
  if (pair && c.groupStart === 2 && c.subject < 0) {
    const fem = low(c.toks[1]) === pair.f;
    const det = detGender(low(c.toks[0]));
    if (!det) return null;
    let ts = replaceCore(c.toks, 0, det);
    ts = replaceCore(ts, 1, fem ? pair.m : pair.f);
    if (copula) {
      for (let j = c.verb + 1; j < ts.length; j++) {
        const w = low(ts[j]);
        if (w === 'muy') continue;
        const og = otherGender(w);
        if (og) ts = replaceCore(ts, j, og);
      }
    }
    const enT = fem ? pair.enF : pair.enM;
    const same = pair.enF === pair.enM;
    const q = same ? `Which one is about a ${fem ? 'female' : 'male'} ${enT}?` : `Which one is about a ${enT}?`;
    return make(s, 'gender', fem ? 'f' : 'm', s.es, [render(ts)], q, `"${c.toks[0].core} ${c.toks[1].core}": ${fem ? 'feminine' : 'masculine'}, and the adjective agrees.`, opts, s.en);
  }
  // (b) speaker or listener describing themselves: estoy cansado > estoy cansada
  if (copula && (c.choice.person === 'yo' || c.choice.person === 'tú')) {
    let ts = c.toks;
    let changed = 0, fem: boolean | null = null;
    for (let j = c.verb + 1; j < ts.length; j++) {
      const w = low(ts[j]);
      if (w === 'muy') continue;
      const og = otherGender(w);
      if (!og) return null;
      fem = /as?$/.test(w);
      ts = replaceCore(ts, j, og);
      changed++;
    }
    if (!changed || fem === null) return null;
    const who = fem ? 'a woman or girl' : 'a man or boy';
    const q = c.choice.person === 'yo' ? `Which one would ${who} say about ${fem ? 'herself' : 'himself'}?` : `Which one is said to ${who}?`;
    return make(s, 'gender', fem ? 'f' : 'm', s.es, [render(ts)], q, `The adjective ends in -${fem ? 'a' : 'o'}: it agrees with ${fem ? 'a woman' : 'a man'}.`, opts, s.en);
  }
  return null;
}

const BUILDERS: Readonly<Record<Feature, (s: BankSentence, o: InputOptions) => ReadAndPickItem | null>> = {
  tense: tenseItem, person: personItem, mood: moodItem, clitic: cliticItem, copula: copulaItem,
  porpara: porParaItem, number: numberItem, gender: genderItem,
};

/** One read-and-pick item for a sentence and a feature, or null if the
 *  sentence cannot carry a clean minimal pair for it. */
export function structuredInput(s: BankSentence, feature: Feature, opts: InputOptions = {}): ReadAndPickItem | null {
  return BUILDERS[feature](s, opts);
}

/** Every feature the sentence can carry. */
export function structuredInputAll(s: BankSentence, opts: InputOptions = {}, features: readonly Feature[] = ALL_FEATURES): ReadAndPickItem[] {
  return features.map((f) => structuredInput(s, f, opts)).filter((x): x is ReadAndPickItem => !!x);
}

