/* ============================================================================
 * THE TRAP RULES, in priority order.
 *
 * A rule names the cause of a miss: "you're not saying that's so", "this verb
 * needs its little word". Naming a cause that is wrong is worse than naming
 * none, so every rule carries one of four outcomes and ships only where it is
 * right about 19 times in 20:
 *
 *   Assert  the error is certain under the rule's guards: fail it and name it.
 *           Only an Assert counts in anything that says "you keep ...".
 *   Ask     the answer may be right: say less, ask a question that stays true
 *           if the learner was right, and let "mine says the same thing" stand.
 *   Note    correct Spanish with a point of register or dialect: pass, and say it.
 *   Silent  the detector cannot tell: the plain location hint, nothing named.
 *
 * Priority is how often the error comes up, times how sure the rule is, times
 * what naming it teaches (contrastive review, section 5). The table is the
 * review's 41 rows. A rule that is not shipped says what it waits for. The
 * detectors read two token lists (what the learner wrote and the form closest
 * to it, both canonical) and the English; there is no tagger here.
 * ========================================================================== */
import { EXPERIENCER, gerundOf, isInfinitive, verbReadings } from '../support/spanish';
import type { Diagnosis, Op } from '../hints';
import { asksWhether } from '../reorder';

export type Tier = 'assert' | 'ask' | 'note' | 'silent';

export interface Rule {
  /** the row of the table: 1 is the rule that matters most */
  n: number;
  /** the name on the row, and the names it reports under when it is more than one rule (article-job, article-general) */
  id: string;
  ids?: readonly string[];
  tier: Tier;
  /** the line the learner reads when it fires: an Assert's hint, an Ask's question. Empty for a rule that never speaks */
  text: string;
  /** false: the row is in the table and its detector is not run, because of what `waits` says */
  ships: boolean;
  waits?: string;
}

/** What a detector reads. `a` is the learner's canonical tokens, `b` the closest accepted form's; both have their movable adverbials put back. */
export interface Ctx {
  a: readonly string[];
  b: readonly string[];
  ops: readonly Op[];
  /** the ops that are a difference: not an eq, not an accent alone */
  edits: readonly Op[];
  /** the hint the plain diagnosis gave, which a rule can name better or ask instead */
  dg: Diagnosis;
  /** the English of the sentence, as words */
  en: string;
}

/** A detector's answer: the rule it reports under, the place in the right version it is about, and its own words when the row's would not fit. */
export interface Hit { rule: string; at: number; text?: string }
type Detector = (c: Ctx) => Hit | null;

const SUBJUNCTIVE = new Set(['presubj', 'impsubj', 'impsubjse', 'pluscsubj', 'pluscsubjse', 'perfsubj']);
const NOT_INDICATIVE = new Set([...SUBJUNCTIVE, 'imperativo', 'impneg']);
const forms = (w: string | undefined) => (w ? verbReadings(w) : []);
const lemmaOf = (w: string | undefined) => forms(w).map((r) => r.inf.replace(/se$/, ''));
/** Every verb a word can be a form of, counting a gerund and a dictionary form. */
const lemmaAny = (w: string | undefined): string[] => {
  if (!w) return [];
  const g = gerundOf(w);
  return [...lemmaOf(w), ...(g ? [g.replace(/se$/, '')] : []), ...(isInfinitive(w) ? [w.replace(/se$/, '')] : [])];
};
const firstEdit = (c: Ctx): Op | undefined => c.edits[0];
const subEdit = (c: Ctx): Op | undefined => (c.edits[0]?.op === 'sub' ? c.edits[0] : undefined);
const is = (w: string | undefined, re: RegExp) => !!w && re.test(w);
const SER = /^(soy|eres|es|somos|son|era|eras|éramos|eran|fue|fui|fueron|será|serán|sería|sea|sean)$/;
const ESTAR = /^(estoy|estás|está|estamos|están|estaba|estabas|estábamos|estaban|estuvo|estuve|estuvieron|estará|estarán|estaría|esté|estén)$/;

// ---- 1. mood-hard: an indicative where only the form that holds an idea up can stand -----------------------

/** Verbs that, with que after them, ask for the form that holds an idea up. Closed on purpose: decir, ver, saber and the openers of a fact are not here, and nor is temer: me temo que no puedo is a fact said gently. */
const WANTING = new Set([
  'querer', 'desear', 'preferir', 'necesitar', 'pedir', 'exigir', 'permitir', 'prohibir', 'sugerir', 'recomendar', 'aconsejar', 'esperar',
  'dudar', 'lamentar', 'ordenar', 'mandar', 'rogar', 'suplicar', 'impedir', 'evitar', 'proponer',
]);
/** The openers that react or judge (me alegra que, me molesta que): the idea form even when the rest is true (R1). */
const REACTING = new Set(['alegrar', 'molestar', 'gustar', 'encantar', 'importar', 'preocupar', 'sorprender', 'extrañar', 'fastidiar', 'enojar', 'asustar']);
const JUDGING = /^(importante|necesario|mejor|bueno|malo|raro|imposible|increíble|normal|lógico|preferible|conveniente|urgente|fundamental|vital|justo|natural)$/;
/** Openers made of several words that take it every time. */
const FRAMES = ['para que', 'antes de que', 'sin que', 'a menos que', 'con tal de que', 'en caso de que', 'a fin de que', 'ojalá'];
/** The openers a negative turns: no creo que, no pienso que, no parece que. */
const BELIEVING = new Set(['creer', 'pensar', 'parecer']);

/** Is the verb at b[j] the one a closed opener before it asks the idea form of? No other finite verb stands between. */
export function triggered(b: readonly string[], j: number): boolean {
  const here = b.slice(Math.max(0, j - 5), j).join(' ');
  if (FRAMES.some((f) => here === f || here.endsWith(` ${f}`) || here.endsWith(`${f} `) || here.endsWith(` ${f} que`))) return true;
  let q = -1;
  for (let k = j - 1; k >= Math.max(0, j - 4); k--) {
    if (b[k] === 'que') { q = k; break; }
    if (forms(b[k]).some((r) => !NOT_INDICATIVE.has(r.tense))) return false;          // another verb in between: the que is not this verb's
  }
  if (q < 1) return false;
  const opener = b[q - 1], before = b[q - 2];
  const lemmas = lemmaOf(opener);
  // no dudo que viene says it is so, and takes either
  if (lemmas.includes('dudar') && before === 'no') return false;
  if (lemmas.some((l) => WANTING.has(l))) return true;
  if (lemmas.some((l) => REACTING.has(l)) && is(before, /^(me|te|le|nos|les)$/)) return true;
  if (is(opener, JUDGING) && is(before, SER)) return true;
  // no creo que, no es cierto que: the negative turns a fact into an idea; no dijo que, no sabía que do not
  if (is(before, /^(no)$/) && lemmas.some((l) => BELIEVING.has(l))) return true;
  if (is(opener, /^(cierto|verdad|seguro)$/) && is(before, SER) && b[q - 3] === 'no') return true;
  return false;
}

/** The form that holds an idea up, and no form that says it is so: esté, and not hablamos. */
export const ideaForm = (w: string): boolean => {
  const rs = forms(w);
  return rs.some((x) => SUBJUNCTIVE.has(x.tense)) && !rs.some((x) => !NOT_INDICATIVE.has(x.tense));
};

const mood: Detector = (c) => {
  const e = subEdit(c);
  if (c.dg.kind !== 'mood' || !e) return null;
  const mb = forms(e.b), mi = forms(e.a);
  const sameVerb = mb.some((x) => mi.some((y) => y.inf === x.inf));
  const modelIdea = ideaForm(e.b!);
  // espero que vendrá expects it, and is right
  if (mi.some((y) => y.tense === 'futuro') && c.b.slice(0, e.j).some((w) => lemmaOf(w).includes('esperar'))) return null;
  const learnerFact = mi.some((y) => !NOT_INDICATIVE.has(y.tense)) && !mi.some((y) => SUBJUNCTIVE.has(y.tense));
  if (sameVerb && modelIdea && learnerFact && triggered(c.b, e.j)) return { rule: 'mood-hard', at: e.j };
  return null;
};

/** The mood question is for a verb after an opener of the idea form; a formula or a command (Disculpo for Disculpe) has no opener, so the slip is in the ending.
 *  Does the verb at b[j] stand in a clause an opener could govern: after que, cuando, ojalá, si, aunque or another frame within a few words? */
const MOOD_SLOT = /^(que|cuando|ojalá|aunque|si|apenas|mientras|hasta|donde|quien|como|tal|sino)$/;
export function moodSlot(b: readonly string[], j: number): boolean {
  return triggered(b, j) || b.slice(Math.max(0, j - 5), j).some((w) => MOOD_SLOT.test(w));
}

// ---- 2. aspect-locked: the other past, where the English or the Spanish fixes which one -----------------------

/** English that fixes the imperfect: it was going on, it was a habit, it was a state of that time. */
const EN_IMPERFECT = /\b(was|were) \w+ing\b|\bused to\b|\bwould (always|often|usually|sometimes|every)\b|\bwhile\b|\bevery (day|morning|evening|week|summer|sunday|saturday)\b|\bas a (child|kid|boy|girl)\b|\bwhen i was (a|little|young|small|\d)\b|\bwhen (he|she) was (a|little|young|small)\b|\bin those days\b/;
/** English that fixes the preterite: it happened, once, and was over. */
const EN_PRETERITE = /\bsuddenly\b|\bfor (two|three|four|five|six|seven|eight|nine|ten|\d+) (years|months|weeks|days|hours)\b|\bonce(?! the\b)\b|\b(twice|three times|four times|five times)\b|\bfound out\b|\bmet\b|\bat that moment\b|\bthe next (day|morning)\b|\bfinally\b|\bsuddenly\b|\blast (night|week|year|month)\b/;
/** Spanish that fixes it too: a dated event (ayer, anoche) for the preterite, a habit named as one (todos los días, a veces) for the imperfect. */
const ES_PRETERITE = /^(ayer|anoche|anteayer|repente|la_semana_pasada|el_año_pasado)$/;
const ES_IMPERFECT = /^(todos_los_días|todas_las_semanas|a_veces|mientras)$/;
/** Verbs of being, having and thinking, whose aspect the sentence does not fix: they need the English. Every other verb is an action. */
const STATIVE = new Set([
  'ser', 'estar', 'tener', 'haber', 'querer', 'saber', 'conocer', 'poder', 'deber', 'parecer', 'pensar', 'creer', 'sentir', 'sentirse', 'vivir', 'gustar',
  'necesitar', 'esperar', 'desear', 'preferir', 'entender', 'significar', 'costar', 'caber', 'existir', 'quedar', 'quedarse', 'quedarse', 'pertenecer', 'faltar',
]);

const aspect: Detector = (c) => {
  const e = subEdit(c);
  if (c.dg.kind !== 'aspect' || !e) return null;
  const mb = forms(e.b);
  const modelTense = mb.find((r) => r.tense === 'preterito' || r.tense === 'imperfecto')?.tense;
  if (!modelTense) return null;
  // the English says one thing for the whole sentence: with both pasts in the model and another verb of this one, it may be about that one
  // (it so happened that it was raining and no taxi wanted to stop: ningún taxi quiso parar is right)
  const others = c.b.flatMap((w, i) => (i === e.j ? [] : forms(w).filter((r) => r.tense === 'preterito' || r.tense === 'imperfecto').map((r) => r.tense)));
  if (others.includes(modelTense) && others.some((t) => t !== modelTense)) return null;
  const lock = EN_IMPERFECT.test(c.en) ? 'imperfecto' : EN_PRETERITE.test(c.en) ? 'preterito' : null;
  // the English fixes it and the model agrees with the English
  if (lock && lock === modelTense) return { rule: 'aspect-locked', at: e.j };
  if (lock) return null;                                   // the model and the English disagree: not sure which of them is the card
  // no English lock: an action verb, with a marker in the Spanish that fixes the aspect, in plain narrative
  const action = mb.some((r) => !STATIVE.has(r.inf.replace(/se$/, '')));
  // antes marks neither: "antes trabajé aquí" is right too
  const marked = modelTense === 'preterito' ? c.b.some((w) => ES_PRETERITE.test(w)) : c.b.some((w) => ES_IMPERFECT.test(w));
  return action && marked ? { rule: 'aspect-locked', at: e.j } : null;
};

// ---- 5. ser-estar-locked ----------------------------------------------------------------------------------

/** Adjectives whose meaning changes with the verb, with the English that says which meaning the sentence has. */
const FLIP: ReadonlyArray<{ stem: RegExp; estar: RegExp; ser: RegExp; thing?: boolean }> = [
  { stem: /^aburrid[oa]s?$/, estar: /\bbored\b/, ser: /\bboring\b/, thing: true },
  { stem: /^list[oa]s?$/, estar: /\bready\b/, ser: /\b(clever|smart|sharp)\b/ },
  { stem: /^cansad[oa]s?$/, estar: /\btired\b/, ser: /\b(tiring|tiresome)\b/, thing: true },
  { stem: /^malo?s?$|^mala?s?$/, estar: /\b(sick|ill|off)\b/, ser: /\b(evil|nasty|wicked)\b/ },
  { stem: /^abiert[oa]s?$|^cerrad[oa]s?$/, estar: /\b(open|closed|shut)\b/, ser: /\b(open|closed)-?minded\b/ },
  { stem: /^orgullos[oa]s?$/, estar: /\bproud of\b/, ser: /\b(proud|arrogant|vain)\b(?! of)/ },
  { stem: /^verde$|^verdes$/, estar: /\b(unripe|green)\b.*\bripe\b/, ser: /\bgreen\b/ },
];
const PLACES = /^(en|dentro|fuera)$/;
const EVENT_NOUN = /^(fiesta|reunión|concierto|boda|evento|partido|clase|misa|cumpleaños|cena|almuerzo|cita|ceremonia|conferencia|entrevista|funeral|feria|desfile|obra)s?$/;

const serEstar: Detector = (c) => {
  const e = subEdit(c);
  if (c.dg.kind !== 'ser-estar' || !e) return null;
  const a = e.a!, b = e.b!;
  const learnerSer = SER.test(a), modelEstar = ESTAR.test(b);
  const next = c.b[e.j + 1];
  // a word that means one thing with each, and the English says which
  const adj = c.b.slice(e.j + 1, e.j + 4).find((w) => FLIP.some((f) => f.stem.test(w)));
  if (adj) {
    const f = FLIP.find((x) => x.stem.test(adj))!;
    if (modelEstar && f.estar.test(c.en) && !f.ser.test(c.en)) return { rule: 'ser-estar-locked', at: e.j };
    // a thing can be either: la fiesta fue aburrida, estuvo aburrida. It is a person who is one or the other
    const person = !f.thing || /^(estoy|estás|estamos|estaba|estuve)$/.test(a);
    if (SER.test(b) && person && f.ser.test(c.en) && !f.estar.test(c.en)) return { rule: 'ser-estar-locked', at: e.j };
  }
  // es lloviendo: -ando and -iendo go with estar
  if (learnerSer && modelEstar && c.a[e.i + 1] && gerundOf(c.a[e.i + 1])) return { rule: 'ser-estar-locked', at: e.j, text: c.dg.hint };
  // where a thing is takes estar; an event's place does not (La fiesta es en mi casa)
  if (learnerSer && modelEstar && PLACES.test(next ?? '') && !c.b.some((w) => EVENT_NOUN.test(w))) return { rule: 'ser-estar-locked', at: e.j, text: 'Where something is takes estar.' };
  return null;
};

// ---- the rest of the Asserts ------------------------------------------------------------------------------

/** 3 and 4: what the plain diagnosis already proves, by name. */
const NAMED_KIND: Readonly<Record<string, string>> = { 'experiencer-agree': 'exp-agree', experiencer: 'exp-subject' };
/** A coordinated pair of singulars takes either number (Me gusta la música y el cine): not a slip in agreement. */
export const coordinated = (b: readonly string[], a: readonly string[]): boolean => [b, a].some((ws) => ws.includes('y') || ws.includes('e'));

/** Verbs after which both a dictionary form and a gerund are right: vi a Yesid salir, vi a Yesid saliendo. */
const PERCEPTION = new Set(['ver', 'oír', 'escuchar', 'sentir', 'mirar', 'observar', 'notar', 'dejar']);

const nonfinite: Detector = (c) => {
  if (c.dg.kind !== 'nonfinite') return null;
  const e = subEdit(c);
  if (!e) return null;
  if (c.b.slice(0, e.j).some((w) => lemmaOf(w).some((l) => PERCEPTION.has(l)))) return null;
  // the learner's form is the finite one and the spot wants the dictionary form (voy a como), or the other way round (Yo no hablar francés)
  const wantsInf = /dictionary form/.test(c.dg.hint), wantsEnding = /ending that says who/.test(c.dg.hint);
  return wantsInf ? { rule: 'inf-need', at: e.j } : wantsEnding ? { rule: 'finite-need', at: e.j } : null;
};

/** Not after a si that means whether: no sé si vendrá is right, and so is le pregunté si vendría. */
const siTense: Detector = (c) => {
  if (c.dg.kind !== 'mood' || !/^After "si"/.test(c.dg.hint)) return null;
  const si = c.b.lastIndexOf('si', c.dg.at);
  return si >= 0 && asksWhether(c.b.slice(0, si)) ? null : { rule: 'si-tense', at: c.dg.at };
};

/** 8. A verb that only exists with its little word, and the word is missing. Not abrir or cerrar: a shop opens, and a door. */
const REFLEXIVE_ONLY = new Set(['llamarse', 'acostarse', 'ducharse', 'casarse', 'mudarse', 'divertirse', 'preocuparse', 'quejarse', 'arrepentirse', 'atreverse', 'equivocarse', 'enterarse', 'portarse', 'acordarse']);
const seDrop: Detector = (c) => {
  const e = firstEdit(c);
  if (e?.op !== 'del' || !is(e.b, /^(me|te|se|nos)$/)) return null;
  const verb = c.b[e.j + 1];
  return forms(verb).some((r) => REFLEXIVE_ONLY.has(r.inf)) && !forms(verb).some((r) => !/se$/.test(r.inf) && r.tense !== 'imperativo') ? { rule: 'se-drop', at: e.j } : null;
};

/** 10. Two words an English speaker has one of. */
const PAIRS: ReadonlyArray<{ id: string; a: RegExp; b: RegExp; text: string }> = [
  { id: 'saber-conocer', text: 'Know is two words in Spanish: saber for facts and for things you can do, conocer for people and places.', a: /^(saber|sé|sabes|sabe|sabemos|saben|sabía|supe|sabré)$/, b: /^(conocer|conozco|conoces|conoce|conocemos|conocen|conocía|conocí|conoceré)$/ },
  { id: 'pedir-preguntar', text: 'Pedir asks for something. Preguntar asks a question.', a: /^(pedir|pido|pides|pide|pedimos|piden|pedí|pidió|pedía)$/, b: /^(preguntar|pregunto|preguntas|pregunta|preguntamos|preguntan|pregunté|preguntó|preguntaba)$/ },
  { id: 'llevar-traer', text: 'Llevar takes it away from here. Traer brings it here.', a: /^(llevar|llevo|llevas|lleva|llevamos|llevan|llevé|llevó)$/, b: /^(traer|traigo|traes|trae|traemos|traen|traje|trajo|traía)$/ },
  { id: 'hay-estar', text: 'Hay says that something exists. Está says where something you already know about is.', a: /^hay$/, b: /^(está|están)$/ },
  { id: 'tiempo-vez-hora', text: 'English has one word for time. Spanish has tiempo, vez (one time, another time) and hora (what the clock says).', a: /^(tiempo|tiempos)$/, b: /^(vez|veces|hora|horas)$/ },
];
const CLAUSE_NEXT = /^(que|si|qué|quién|quiénes|cómo|dónde|cuándo|cuánto|cuánta|cuántos|cuántas|cuál|cuáles|por)$/;
/** Is this swap of the pair one the sentence proves? Both verbs of know take a noun (sé su nombre, conozco su nombre, sé un truco), and both of bring depend on where the speaker stands. */
function provable(id: string, e: Op, c: Ctx): boolean {
  const next = c.b[e.j + 1];
  if (id === 'saber-conocer') {
    if (PAIRS[0].a.test(e.b!)) return next === undefined || CLAUSE_NEXT.test(next) || isInfinitive(next);      // the model says saber, and what follows is no thing to be acquainted with
    return next === 'a' || next === 'al';                                                                      // the model says conocer: a person
  }
  if (id === 'llevar-traer') {
    if (PAIRS[2].a.test(e.b!)) return /\b(take|takes|took|taking|taken)\b/.test(c.en);                          // took it away, and traer does not go away
    return /^(me|nos)$/.test(c.b[e.j - 1] ?? '');                                                              // to me: it comes here
  }
  // es hora de irnos, es tiempo de irnos
  if (id === 'tiempo-vez-hora') return !(is(c.b[e.j - 1], SER) && (next === undefined || next === 'de' || next === 'que'));
  return true;
}
const lexicalPair: Detector = (c) => {
  const e = subEdit(c);
  if (!e || c.edits.length !== 1) return null;
  const hit = PAIRS.find((p) => (p.a.test(e.a!) && p.b.test(e.b!)) || (p.b.test(e.a!) && p.a.test(e.b!)));
  return hit && provable(hit.id, e, c) ? { rule: `lexical-pair:${hit.id}`, at: e.j, text: hit.text } : null;
};

/** 13. A person after the verb takes a. Names and kin only: Voy Bogotá is another mistake, and this text would be wrong for it. */
const CAST = /^(vale|rosa|mariana|simón|tomás|hernando|altamira|yesid|joaquín|fredy|gloria|marta|beatriz|lucía|camila|ricardo|ana|jaime|pedro|laura|inés|andrés)$/;
const KIN = /^(mamá|papá|madre|padre|hermano|hermana|abuelo|abuela|amigo|amiga|tío|tía|primo|prima|hijo|hija|esposo|esposa|novio|novia|vecino|vecina|jefe|jefa|profesor|profesora|doctor|doctora|señor|señora|niño|niña)$/;
const persA: Detector = (c) => {
  const e = firstEdit(c);
  if (e?.op !== 'del' || e.b !== 'a') return null;
  const x = c.b[e.j + 1], y = c.b[e.j + 2];
  const person = CAST.test(x ?? '') || KIN.test(x ?? '') || (is(x, /^(mi|tu|su|nuestro|nuestra|el|la)$/) && KIN.test(y ?? ''));
  return person && forms(c.b[e.j - 1]).length > 0 ? { rule: 'pers-a', at: e.j } : null;
};

/** 15. The article that a job has none of, and the one a thing in general has. */
const JOB = /^(profesor|profesora|médico|médica|doctor|doctora|ingeniero|ingeniera|abogado|abogada|estudiante|cocinero|cocinera|mesero|mesera|panadero|panadera|taxista|periodista|arquitecto|arquitecta|enfermero|enfermera|músico|música|escritor|escritora|colombiano|colombiana|canadiense|mexicano|mexicana|español|española)$/;
const LIKING = /^(gusta|gustan|encanta|encantan|fascina|interesa|odio|amo|adoro|detesto|encanto)$/;
const article: Detector = (c) => {
  const e = firstEdit(c);
  if (e?.op === 'ins' && is(e.a, /^(un|una)$/) && is(c.a[e.i - 1], SER) && JOB.test(c.a[e.i + 1] ?? '') && !c.a.slice(e.i + 2).length) return { rule: 'article-job', at: e.j, text: 'A job takes no un or una here.' };
  if (e?.op === 'del' && is(e.b, /^(el|la|los|las)$/) && (LIKING.test(c.b[e.j - 1] ?? '') || (LIKING.test(c.b[e.j - 2] ?? '') && is(c.b[e.j - 1], /^(mucho|más|menos|tanto|bastante)$/)))) return { rule: 'article-general', at: e.j, text: 'Things in general take el, la, los or las.' };
  return null;
};

/** 16. The verbs that already mean "look for" and "wait for". Not pagar, mirar or escuchar: pagué por el almuerzo, miraba por la ventana. */
const noPrep: Detector = (c) => {
  const e = firstEdit(c);
  if (e?.op !== 'ins' || !is(e.a, /^(para|por|a)$/)) return null;
  const next = c.a[e.i + 1];
  const object = is(next, /^(el|la|los|las|mi|tu|su|un|una|nuestro|nuestra)$/);
  if (e.a !== 'a' && lemmaAny(c.a[e.i - 1]).some((l) => l === 'buscar' || l === 'esperar') && object) return { rule: 'no-prep', at: e.j };
  return null;
};

/** 17. Hunger, cold and age are had. */
const TENER_NOUN = /^(hambre|sed|frío|calor|miedo|sueño|prisa|razón|vergüenza|suerte|ganas|años|\d+)$/;
const beTener: Detector = (c) => {
  const e = subEdit(c);
  if (!e || c.edits.length > 2) return null;
  const nounNext = TENER_NOUN.test(c.b[e.j + 1] ?? '') && c.a[e.i + 1] === c.b[e.j + 1];
  return forms(e.b).some((r) => r.inf === 'tener') && forms(e.a).some((r) => r.inf === 'estar' || r.inf === 'ser') && nounNext ? { rule: 'be-tener', at: e.j } : null;
};

/** 18. The weather is made, not been. Está frío is another mistake, or a cold thing; Hoy es frío is this one. */
const weather: Detector = (c) => {
  const e = subEdit(c);
  return e && e.a === 'es' && e.b === 'hace' && is(c.b[e.j + 1], /^(frío|calor|sol|viento|fresco)$/) ? { rule: 'weather', at: e.j } : null;
};

/** 21. After cuando, a later time is not the future. */
const cuandoFuture: Detector = (c) => {
  const e = subEdit(c);
  if (!e || c.b[e.j - 1] !== 'cuando' || c.a[e.i - 1] !== 'cuando') return null;
  return forms(e.a).some((r) => r.tense === 'futuro') && forms(e.b).some((r) => r.tense === 'presubj') ? { rule: 'cuando-future', at: e.j } : null;
};

/** 22. No before the verb pairs with nada, nadie, nunca. */
const NEG_PAIR: Readonly<Record<string, string>> = { nada: 'algo', nadie: 'alguien', nunca: 'siempre' };
const negConcord: Detector = (c) => {
  const e = subEdit(c);
  if (!e || NEG_PAIR[e.b!] !== e.a) return null;
  const no = c.b.indexOf('no');
  // the no and the word are in one clause: no que between them (No quiere que firme algo is right)
  return no >= 0 && no < e.j && !c.b.slice(no, e.j).some((w) => w === 'que' || w === 'si' || w === 'cuando' || w === 'sin') ? { rule: 'neg-concord', at: e.j } : null;
};

/** 26. Le and lo side by side are se lo. */
const seLo: Detector = (c) => {
  const e = subEdit(c);
  return e && is(e.a, /^(le|les)$/) && e.b === 'se' && is(c.b[e.j + 1], /^(lo|la|los|las)$/) && c.a[e.i + 1] === c.b[e.j + 1] ? { rule: 'se-lo', at: e.j } : null;
};

/** 29. The little word goes before the question word. */
const PREP_END = /^(con|de|sobre|para|por|en|a|desde|hasta|sin|contra)$/;
const strand: Detector = (c) => {
  const last = c.a[c.a.length - 1];
  const firstB = c.b[0] ?? '', secondB = c.b[1] ?? '';
  const question = /^(quién|quiénes|qué|cuál|cuáles|dónde|cuándo|cómo|cuánto)$/;
  // the little word that was sent to the end: sobre is also the last word of "es el sobre"
  if (last !== firstB || !PREP_END.test(last ?? '') || !question.test(secondB)) return null;
  return c.b.every((w) => w !== 'en' || c.b.indexOf(w) === 0) ? { rule: 'strand', at: 0 } : null;
};

/** 30. Before a noun it is mucho. */
const MUY_NOUN = /^(hambre|sed|frío|calor|miedo|sueño|prisa|razón|suerte|dinero|gente|tiempo|trabajo|cuidado)$/;
const muyNoun: Detector = (c) => {
  const e = subEdit(c);
  return e && e.a === 'muy' && is(e.b, /^(mucho|mucha|muchos|muchas)$/) && MUY_NOUN.test(c.b[e.j + 1] ?? '') ? { rule: 'muy-noun', at: e.j } : null;
};

/** 31. Before a number it is más de. */
const masNum: Detector = (c) => {
  const e = subEdit(c);
  return e && e.a === 'que' && e.b === 'de' && is(c.b[e.j - 1], /^(más|menos)$/) && /^\d/.test(c.b[e.j + 1] ?? '') ? { rule: 'mas-num', at: e.j } : null;
};

/** 4 again. Yo gusto el café: the thing you like does the pleasing, and gusto says the learner does it. */
const gustoYo: Detector = (c) => {
  // the missing little word (me) may come first: Yo gusto el café is a me not there, then gusto for gusta
  const e = c.edits.slice(0, 2).find((x) => x.op === 'sub');
  if (!e) return null;
  const mine = forms(e.a).filter((r) => EXPERIENCER.has(r.inf.replace(/se$/, '')) && r.tense !== 'imperativo' && ['yo', 'tú', 'nosotros'].includes(r.person));
  const theirs = forms(e.b).filter((r) => EXPERIENCER.has(r.inf.replace(/se$/, '')) && (r.person === 'él/ella' || r.person === 'ellos'));
  // a form that is also a third person (faltaba is yo and él) could be the right verb: only a form that is no third person at all is the learner doing the pleasing
  const clitic = is(c.b[e.j - 1], /^(me|te|le|les|nos)$/) || is(c.b[e.j - 2], /^(me|te|le|les|nos)$/);
  return clitic && mine.length && !forms(e.a).some((r) => r.person === 'él/ella' || r.person === 'ellos') && theirs.length && mine.some((m) => theirs.some((t) => t.inf === m.inf && t.tense === m.tense)) ? { rule: 'exp-subject', at: e.j, text: 'With gustar, the thing you like does the pleasing: it is me gusta, not yo gusto.' } : null;
};

/** 11. A verb that goes with its own little word, and the little word is another, or missing, or there where none goes. A short table of verbs the bank uses one way. */
const VERB_PREP: Readonly<Record<string, string>> = {
  depender: 'de', soñar: 'con', casar: 'con', enamorar: 'de', aprender: 'a', acabar: 'de', dejar: 'de', pensar: 'en', ayudar: 'a', empezar: 'a', comenzar: 'a', volver: 'a', ir: 'a',
};
const SMALL_WORD = /^(a|de|con|en|por|para|sobre|desde|hacia)$/;
/** Verbs that go straight onto the dictionary form: quiero ir, puedo ir. */
/** (deber is not here: debe de ser tarde is right.) */
const BARE_INFINITIVE = new Set(['querer', 'poder', 'preferir', 'desear', 'necesitar', 'saber', 'soler']);
const verbPrep: Detector = (c) => {
  const e = firstEdit(c);
  if (!e) return null;
  const prevB = c.b[(e.op === 'ins' ? e.j : e.j) - 1];
  const need = (w: string | undefined) => lemmaAny(w).map((l) => VERB_PREP[l.replace(/se$/, '').replace(/^casar$/, 'casar')]).find(Boolean);
  const text = 'This verb goes with its own little word.';
  // al and del hold the little word inside them: the slip there is the article
  // pienso viajar and pienso en viajar are both said
  if (e.op === 'del' && SMALL_WORD.test(e.b ?? '') && need(prevB) === e.b && !is(c.a[e.i], /^(al|del)$/) && !(e.b === 'en' && isInfinitive(c.b[e.j + 1] ?? ''))) return { rule: 'verb-prep', at: e.j, text };
  // voy para el centro is said: para, hacia and hasta are ways to go somewhere, not slips
  if (e.op === 'sub' && SMALL_WORD.test(e.a ?? '') && SMALL_WORD.test(e.b ?? '') && need(prevB) === e.b && e.a !== e.b && !is(e.a, /^(para|hacia|hasta|por)$/)) return { rule: 'verb-prep', at: e.j, text };
  // quiero a ir: no little word between a verb of wanting or being able and the dictionary form
  if (e.op === 'ins' && is(e.a, /^(a|de|para|por|en)$/) && lemmaAny(c.a[e.i - 1]).some((l) => BARE_INFINITIVE.has(l)) && isInfinitive(c.a[e.i + 1] ?? '')) {
    return { rule: 'verb-prep', at: e.j, text: 'That verb goes straight onto the dictionary form, with no little word between.' };
  }
  return null;
};

/** 25. A word that looks like the English one and is not, with the English there to show it. */
const FALSE_FRIENDS: ReadonlyArray<{ word: RegExp; cue: RegExp }> = [
  { word: /^embarazad[oa]s?$/, cue: /\bembarrass/ }, { word: /^excitad[oa]s?$/, cue: /\bexcited\b/ }, { word: /^librería$/, cue: /\blibrary\b/ },
  { word: /^actualmente$/, cue: /\b(actually|in fact|really)\b/ }, { word: /^suceso$/, cue: /\bsuccess\b/ }, { word: /^sensible$/, cue: /\bsensible\b/ },
  { word: /^atend(í|er|ió|emos|ieron|iste)$/, cue: /\battend/ }, { word: /^realic(é|e)$/, cue: /\brealis|realiz/ }, { word: /^éxito$/, cue: /\b(exit|way out)\b/ },
];
const falseFriend: Detector = (c) => {
  const e = subEdit(c);
  const f = e && FALSE_FRIENDS.find((x) => x.word.test(e.a!));
  return e && f && f.cue.test(c.en) && !f.word.test(e.b!) ? { rule: 'false-friend', at: e.j } : null;
};

/** 28. Usaba vivir: soler is the verb for used to, and usar does not work like that. */
const usedTo: Detector = (c) => {
  const e = firstEdit(c);
  if (!e || !/\bused to\b/.test(c.en)) return null;
  const at = e.op === 'ins' ? e.i : e.i;
  const word = c.a[at];
  return word && lemmaOf(word).includes('usar') && !c.b.some((w) => lemmaOf(w).includes('usar')) ? { rule: 'used-to', at: e.j } : null;
};

/** 24, 27. Could and would in the past: a habit is the going-on past, and a could that happened once is the preterite. Not the would form of either. */
const couldWould: Detector = (c) => {
  const e = subEdit(c);
  if (!e) return null;
  const mb = forms(e.b), mi = forms(e.a);
  const same = mb.some((x) => mi.some((y) => y.inf === x.inf));
  if (!same || !mi.some((y) => y.tense === 'condicional') || mi.some((y) => y.tense !== 'condicional' && y.tense !== 'imperativo')) return null;
  if (/\bif\b/.test(c.en)) return null;
  if (mb.some((x) => x.tense === 'imperfecto') && /\b(when i was|as a (child|kid)|every|always|often|used)\b/.test(c.en) && /\bwould\b/.test(c.en)) {
    return { rule: 'would-habit', at: e.j, text: 'A habit in the past is the going-on past, not the would form.' };
  }
  // the could is poder's, in a statement: "podría haber ido" is right for could have, and "¿cómo podrías decirle eso?" is a could too
  if (mb.some((x) => x.tense === 'preterito' && x.inf === 'poder') && /\b(couldn't|could not|could)\b/.test(c.en) && !/\bwould\b/.test(c.en) && !c.en.includes('?') && !/^haber/.test(c.b[e.j + 1] ?? '')) {
    return { rule: 'could', at: e.j, text: 'A could that happened, or did not, is the past form, not the would form.' };
  }
  return null;
};

// ---- the table ----------------------------------------------------------------------------------------------

const waits = (why: string) => ({ ships: false as const, waits: why, text: '' });

export const RULES: readonly Rule[] = [
  { n: 1, id: 'mood-hard', tier: 'assert', ships: true, text: "Right verb. Nothing is said as fact after this opening, so it needs the form that holds an idea up." },
  { n: 2, id: 'aspect-locked', tier: 'assert', ships: true, text: 'Both are in the past. Was it going on, or did it happen?' },
  { n: 3, id: 'exp-agree', tier: 'assert', ships: true, text: 'With gustar, the verb agrees with the thing you like: one or more than one?' },
  { n: 4, id: 'exp-subject', tier: 'assert', ships: true, text: 'With verbs like gustar, the little word (me, te, le) already says who it is for. Leave the pronoun out, or start it with "a".' },
  { n: 5, id: 'ser-estar-locked', tier: 'assert', ships: true, text: 'This one changes meaning with ser and estar. Check which one the English means.' },
  { n: 6, id: 'inf-need', tier: 'assert', ships: true, text: 'Right verb, but this spot wants its dictionary form.' },
  { n: 7, id: 'finite-need', tier: 'assert', ships: true, text: 'Right verb, but here it needs an ending that says who is doing it.' },
  { n: 8, id: 'se-drop', tier: 'assert', ships: true, text: 'This verb needs its little word (me, te, se, nos).' },
  { n: 9, id: 'si-tense', tier: 'assert', ships: true, text: 'After "si", this verb does not take the would or will form.' },
  {
    n: 10, id: 'lexical-pair', tier: 'assert', ships: true, text: 'English has one word here and Spanish has two. Check the meaning of each.',
    ids: PAIRS.map((p) => `lexical-pair:${p.id}`),
  },
  { n: 11, id: 'verb-prep', tier: 'assert', ships: true, text: 'This verb goes with its own little word.' },
  { n: 12, id: 'lo-le', tier: 'assert', ...waits('three dialect facts in one rule: ayudar, usted, and le for a man (O8)') },
  { n: 13, id: 'pers-a', tier: 'assert', ships: true, text: 'A person right after the verb takes a little a first.' },
  { n: 14, id: 'por-para-closed', tier: 'assert', ...waits('closed frames of por and para, none yet checked against the bank') },
  { n: 15, id: 'article', tier: 'assert', ships: true, text: 'Check the article: a job takes none, and a thing in general takes el, la, los or las.', ids: ['article-job', 'article-general'] },
  { n: 16, id: 'no-prep', tier: 'assert', ships: true, text: 'This verb already means "look for" or "wait for". It takes no little word after it.' },
  { n: 17, id: 'be-tener', tier: 'assert', ships: true, text: 'For hunger, cold, fear and age Spanish has tener, not ser or estar.', ids: ['be-tener', 'age'] },
  { n: 18, id: 'weather', tier: 'assert', ships: true, text: 'The weather is made with hacer here, not ser.' },
  { n: 19, id: 'poss-body', tier: 'assert', ...waits('needs the co-referent clitic as a condition; the first cut was not above 95%') },
  { n: 20, id: 'for-time', tier: 'assert', ...waits('the diff against desde hace is too big to align; an English gate on have been plus for') },
  { n: 21, id: 'cuando-future', tier: 'assert', ships: true, text: 'After "cuando", a time that has not come is not the future.' },
  { n: 22, id: 'neg-concord', tier: 'assert', ships: true, text: 'A "no" before the verb goes with nada, nadie and nunca.' },
  { n: 23, id: 'se-agree', tier: 'assert', ...waits('not with a plus a person; the first cut was not above 95%') },
  { n: 24, id: 'could', tier: 'assert', ships: true, text: 'A could that happened, or did not, is the past form, not the would form.' },
  { n: 25, id: 'false-friend', tier: 'assert', ships: true, text: 'That word looks like the English one but means something else.' },
  { n: 26, id: 'se-lo', tier: 'assert', ships: true, text: 'Le or les in front of lo, la, los or las turns into se.' },
  { n: 27, id: 'would', tier: 'assert', ids: ['would-habit', 'would-refusal'], ships: true, text: 'A habit in the past is the going-on past, not the would form.' },
  { n: 28, id: 'used-to', tier: 'assert', ships: true, text: "Usar doesn't work like that. The verb for used to is soler, or the going-on past." },
  { n: 29, id: 'strand', tier: 'assert', ships: true, text: 'In Spanish the little word goes in front of the question word.' },
  { n: 30, id: 'muy-noun', tier: 'assert', ships: true, text: 'Before a noun it is mucho, mucha, muchos or muchas, not muy.' },
  { n: 31, id: 'mas-num', tier: 'assert', ships: true, text: 'Before a number it is más de or menos de.' },
  { n: 32, id: 'prog-plan', tier: 'assert', ...waits('needs a future time word in the model') },
  { n: 33, id: 'gerund-adj', tier: 'assert', ...waits('not after perception verbs; the first cut was not above 95%') },
  { n: 34, id: 'aspect-open', tier: 'ask', ships: true, text: 'We used the other past here: was it going on, or did it happen?' },
  { n: 35, id: 'mood-open', tier: 'ask', ships: true, text: "Here, is someone saying it's so, or is it only held up as an idea?" },
  { n: 36, id: 'por-para-open', tier: 'ask', ships: true, text: 'We used the other one here: por or para?', ids: ['por-para-open', 'ser-estar-open'] },
  { n: 37, id: 'event-estar', tier: 'note', ships: true, text: "You'll hear está en for an event as well. The course uses es en." },
  { n: 38, id: 'passive-calque', tier: 'note', ships: true, text: 'That is right, though people say it with se far more than with ser.' },
  { n: 39, id: 'se-me-optional', tier: 'note', ships: true, text: 'That is right. Se me olvidó is the way it happens to you; olvidé is the way you did it.' },
  { n: 40, id: 'pronoun-overuse', tier: 'note', ...waits('needs the learner\'s level, which the checker does not have; from B1, and never a failure') },
  { n: 41, id: 'motion', tier: 'silent', ...waits('Corrió a la calle is a calque and corrieron hasta la esquina is right: teach it, do not detect it yet') },
];

/** The detectors of the rules that ship as an Assert, in table order: the first to fire is the one reported. */
export const DETECTORS: readonly Detector[] = [
  mood, aspect, serEstar, nonfinite, siTense, gustoYo, seDrop, lexicalPair, verbPrep, persA, article, noPrep, beTener, weather, cuandoFuture, negConcord, falseFriend, couldWould, seLo, usedTo, strand, muyNoun, masNum,
];

/** The rule a hint kind the plain diagnosis already proves belongs to, when it names one. */
export function namedKind(kind: string, c?: { a: readonly string[]; b: readonly string[] }): string | undefined {
  if (kind === 'experiencer-agree' && c && coordinated(c.b, c.a)) return undefined;
  return NAMED_KIND[kind];
}

const byId = new Map<string, Rule>();
for (const r of RULES) { byId.set(r.id, r); for (const x of r.ids ?? []) byId.set(x, r); }

/** The row of the table a reported rule name belongs to (article-job is the article row). */
export function ruleOf(id: string): Rule | undefined { return byId.get(id) ?? byId.get(id.split(':')[0]); }

/** What the aspect rule reads off the English: the imperfect, the preterite, or neither. */
export function englishAspect(en: string): 'imperfecto' | 'preterito' | null {
  const e = en.toLowerCase();
  return EN_IMPERFECT.test(e) ? 'imperfecto' : EN_PRETERITE.test(e) ? 'preterito' : null;
}

/** Event nouns, for the rule about es en and está en. */
export { EVENT_NOUN };
