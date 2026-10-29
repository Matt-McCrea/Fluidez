/* ============================================================================
 * FEATURES — from analysed words to grammar features.
 *
 * Every detector reads the Word[] that ./words.ts produced (one POS per
 * token, homographs already resolved) and emits Feature objects with a
 * dotted key and a token span. ./nodemap.ts turns keys into node ids.
 *
 * Detectors, in order:
 *   verbs        tense + mood of every finite verb; commands; subjunctive with
 *                its licensing trigger; compounds (haber + participle)
 *   pronouns     clitics (single, combined, se lo, position), reflexives,
 *                gustar-type, se impersonal / passive / accidental
 *   clauses      relatives, que-complementiser, si-conditionals
 *   periphrases  ir a, tener que, hay que, acabar de, estar + gerund ...
 *   ser/estar    identity, origin, characteristic, time, event, passive;
 *                location, state, resultative
 *   misc         por/para, comparatives/superlatives, hay, double negation,
 *                al + infinitive
 *
 * THE GENEROUS READING (tools/lib/tense-scan.js): a form two tenses share is
 * read as the earlier-taught one unless the context says otherwise —
 * "hablamos" is present unless the sentence has ayer/anoche/pasado; "habla"
 * is present, not a command, unless the sentence is plainly an instruction.
 * ========================================================================== */
import { PERSONS, endingsFor, vowelOf, verbByInf, deaccent, analyzeToken, conjugate } from '../index';
import { stemOf } from '../conjugate';
import type { Analysis, TenseKey } from '../types';
import { LEXEME_STOP, NEGATIVES, QUANTIFIERS, lexEntry, lemmatize } from './lexicon';
import { bareOf, reflexiveOf } from './words';
import type { Feature, Word } from './types';

export interface FeatureCtx {
  words: Word[];
  features: Feature[];
  low: string[];
}

const S = (s: string) => new Set(s.split(/\s+/).filter(Boolean));

/* ---- lexical classes ------------------------------------------------------ */
const VOLITION = S(`querer desear esperar preferir pedir necesitar exigir recomendar aconsejar sugerir prohibir permitir
  mandar ordenar rogar insistir proponer conseguir lograr evitar impedir dejar hacer suplicar pretender procurar
  intentar oponerse aceptar solicitar invitar animar obligar convencer contar confiar apetecer encargar ayudar
  necesitar urgir reclamar sugerir reprochar llevar contribuir tender pensar acostumbrar`);
const REPORTED = S('decir escribir avisar recordar repetir gritar contestar responder explicar');
const EMOTION = S(`gustar encantar molestar importar preocupar alegrar alegrarse sentir lamentar temer sorprender extrañar
  fastidiar doler odiar agradecer enojar enojarse enfadar emocionar interesar aterrar asustar divertir entristecer
  avergonzar indignar encantar fascinar quejarse sorprenderse preocuparse complacer aburrir frustrar alegrarse
  agradar entusiasmar irritar ofender extrañarse lamentarse soportar aguantar entender comprender perdonar
  poner disculpar celebrar`);
const DOUBT = S('dudar negar');
const BELIEF = S('creer pensar parecer suponer imaginar opinar considerar estar saber ver oír coincidir afirmar asegurar');
const IMPERSONAL_ADJ = S(`importante necesario posible imposible probable improbable mejor preferible conveniente urgente
  fundamental esencial imprescindible hora suficiente útil inútil bueno malo fácil difícil justo lógico`);
const EVAL = S(`pena lástima vergüenza triste raro extraño increíble sorprendente genial maravilloso horrible terrible
  normal natural curioso fantástico estupendo bien mal bonito injusto ridículo absurdo emocionante interesante peor`);
const FACT = S('verdad cierto obvio evidente claro seguro indudable');
const EMO_ADJ = S('contento feliz triste harto orgulloso preocupado encantado sorprendido nervioso agradecido');
const EMO_NOUN = S('miedo pena rabia igual vergüenza lástima gusto ganas alegría');
const GUSTAR = S(`gustar encantar interesar importar molestar doler fascinar preocupar apetecer faltar quedar parecer
  costar sobrar tocar caer aburrir disgustar convenir alegrar sorprender asustar emocionar enojar fastidiar extrañar
  provocar frustrar complacer agradar entusiasmar irritar ofender`);
const ACCIDENTAL = S('olvidar caer perder romper quedar acabar ocurrir escapar dañar morir descomponer');
const LOCATION_ADV = S(`aquí allí ahí acá allá cerca lejos enfrente detrás delante arriba abajo dentro fuera afuera adentro
  encima debajo junto`);
const DEGREE = S('muy bastante tan más menos algo demasiado super súper re poco un no siempre ya todavía también tampoco nunca aún bien_');
const PAST_CUE = /\b(ayer|anoche|anteayer|pasad[oa]s?|hace (?:un|una|unos|unas|dos|tres|\d+|mucho|poco|rato)|en \d{4})\b/;
const IRREG_TU_CMD = S('di haz ve pon sal sé ten ven');

const DO = S('lo la los las');
const IO = S('le les');
const PERSONAL = S('me te nos os');
const REFLEX_FOR: Record<string, string> = { yo: 'me', 'tú': 'te', 'él/ella': 'se', nosotros: 'nos', vosotros: 'os', ellos: 'se', usted: 'se', ustedes: 'se', vos: 'te' };

function add(ctx: FeatureCtx, key: string, a: number, b: number, extra: Partial<Feature> = {}): void {
  const text = ctx.words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(' ');
  ctx.features.push({ key, node: null, span: [a, b], text, ...extra });
}

const isStrongPunct = (w?: Word) => !!w && w.punct && /[.?!…;:]/.test(w.w);
function sentenceBounds(words: Word[], i: number): [number, number] {
  let a = i; while (a > 0 && !isStrongPunct(words[a - 1])) a--;
  let b = i; while (b < words.length - 1 && !isStrongPunct(words[b + 1])) b++;
  return [a, b];
}
function sentenceText(words: Word[], i: number): string {
  const [a, b] = sentenceBounds(words, i);
  return words.slice(a, Math.min(words.length, b + 2)).map((w) => w.w).join(' ');
}
const prevIdx = (words: Word[], i: number) => { let j = i - 1; while (j >= 0 && words[j].punct && words[j].w === '"') j--; return j; };
const nextWordIdx = (words: Word[], i: number) => { const j = i + 1; return j < words.length && !words[j].punct ? j : -1; };

/** Proclitic chain directly before a verb, plus whether "no" precedes it. */
function proclitics(words: Word[], i: number): { start: number; clitics: string[]; neg: boolean } {
  let j = i - 1;
  const cl: string[] = [];
  while (j >= 0 && words[j].pos === 'clitic') { cl.unshift(words[j].w); j--; }
  const neg = j >= 0 && words[j].w === 'no';
  return { start: j + 1, clitics: cl, neg };
}

const CLAUSE_OPENERS = S('y e o u pero ni entonces luego después ahora primero bueno pues sino');
/** Does the verb start its clause (ignoring its own clitics and "no")? */
function clauseInitial(words: Word[], i: number): boolean {
  const pc = proclitics(words, i);
  let j = pc.start - 1;
  if (pc.neg) j--;
  if (j < 0) return true;
  const w = words[j];
  if (w.punct) return true;
  if (CLAUSE_OPENERS.has(w.w)) return true;
  if (w.w === 'favor' && words[j - 1]?.w === 'por') return true;
  return false;
}

function commandContext(words: Word[], i: number): boolean {
  const s = sentenceText(words, i);
  if (/[!¡]/.test(s) || /\bpor favor\b/.test(s)) return true;
  // vocative: "Ana, abre la puerta" / "abre la puerta, Ana"
  const [a, b] = sentenceBounds(words, i);
  for (let j = a; j < b; j++) if (words[j].pos === 'propn' && words[j + 1]?.w === ',' && j + 2 === proclitics(words, i).start) return true;
  for (let j = a; j <= b; j++) if (j !== i && words[j].pos === 'verb' && words[j].tense === 'cmd') return true;
  return false;
}

/* ---- irregularity class of a form ---------------------------------------- */
function phon(s: string): string {
  return deaccent(s).replace(/qu(?=[ei])/g, 'k').replace(/c(?=[aou])/g, 'k').replace(/c$/, 'k').replace(/z/g, 's').replace(/c(?=[ei])/g, 's')
    .replace(/gu(?=[ei])/g, 'g').replace(/g(?=[ei])/g, 'h').replace(/j/g, 'h').replace(/y/g, 'i').replace(/ü/g, 'u');
}
function changeLast(stem: string, from: RegExp, to: string): string {
  const m = [...stem.matchAll(from)];
  if (!m.length) return stem;
  const k = m[m.length - 1].index!;
  return stem.slice(0, k) + to + stem.slice(k + 1);
}
const IMPERFECT_STATE = new Set(['ser', 'estar', 'tener', 'haber']);
/** Irregularity class of a form, as a dotted suffix for the tense key:
 *  presente: regular.ar | regular.er | regular.ir | spelling.<cls> | stem-ie | stem-ue | stem-i | irregular-yo | irregular[.ser|.estar|.ir]
 *  preterito: regular.<cls> | spelling | stem | irregular | irregular.ser-ir | irregular.hacer
 *  imperfecto: regular | state (ser/estar/tener/haber) | irregular (ir/ver)
 *  futuro / condicional: regular | irregular
 *  presubj: regular (derived from the yo form, incl. quiera / tenga) | irregular (sea, vaya, sepa, esté, haya, dé) */
export function formClass(inf: string, tense: TenseKey, person: string, form: string): string {
  const bare = bareOf(inf);
  const v = verbByInf(inf) ?? verbByInf(bare);
  const idx = PERSONS.indexOf(person as never);
  if (!v || idx < 0) return 'regular';
  const cls = vowelOf(bare);
  const stem = stemOf(bare);
  let reg = '';
  if (tense === 'presente' || tense === 'preterito' || tense === 'imperfecto' || tense === 'presubj') reg = stem + endingsFor(tense, cls)[idx];
  else if (tense === 'futuro' || tense === 'condicional') reg = deaccent(bare) + endingsFor(tense, cls)[idx];
  else return 'regular';
  const f = form.toLowerCase();
  const lemma = bare;
  if (tense === 'presente' && ['ser', 'estar', 'ir'].includes(lemma)) return 'irregular.' + lemma;
  if (tense === 'preterito' && (lemma === 'ser' || lemma === 'ir')) return 'irregular.ser-ir';
  if (tense === 'preterito' && lemma === 'hacer') return 'irregular.hacer';
  if (tense === 'imperfecto') {
    if (IMPERFECT_STATE.has(lemma)) return 'state';
    return deaccent(f) === deaccent(reg) || phon(f) === phon(reg) ? 'regular' : 'irregular';
  }
  if (deaccent(f) === deaccent(reg)) return tense === 'presente' || tense === 'preterito' ? 'regular.' + cls : 'regular';
  // spelling changes keep the sound: busc+é -> busqué, lleg+é -> llegué, empez+é -> empecé, le+ió -> leyó
  const ending = reg.slice(tense === 'futuro' || tense === 'condicional' ? deaccent(bare).length : stem.length);
  const regPhon = (tense === 'futuro' || tense === 'condicional' ? phon(deaccent(bare)) : phon(stem)) + phon(ending);
  const spelling = phon(f) === regPhon || phon(f) === phon(reg);
  if (tense === 'presente') {
    if (spelling) return 'spelling.' + cls;
    if (idx !== 3 && idx !== 4) {
      const tries: Array<[string, string]> = [['ie', changeLast(stem, /e/g, 'ie')], ['ue', changeLast(stem, /[ou]/g, 'ue')], ['i', changeLast(stem, /e/g, 'i')]];
      for (const [k, changed] of tries) if (changed !== stem && phon(f) === phon(changed + endingsFor('presente', cls)[idx])) return 'stem-' + k;
    }
    if (idx === 0) return 'irregular-yo';
    return 'irregular';
  }
  if (tense === 'preterito') {
    if (spelling) return 'spelling';
    // -ir stem change in the 3rd person: pidió, durmió, sintieron
    if (cls === 'ir' && (idx === 2 || idx === 5)) {
      for (const changed of [changeLast(stem, /e/g, 'i'), changeLast(stem, /o/g, 'u')]) {
        if (changed !== stem && (phon(f) === phon(changed) + phon(ending))) return 'stem';
      }
    }
    if (v.forms?.preterito || v.like) return 'irregular';
    if (cls === 'ir' && v.stem) return 'stem';
    return 'irregular';
  }
  if (tense === 'futuro' || tense === 'condicional') return spelling ? 'regular' : 'irregular';
  if (tense === 'presubj') {
    if (spelling) return 'regular';
    // derived from the yo present (tengo > tenga, quiero > quiera, conozco > conozca): the regular rule
    try {
      const yo = conjugate(v, 'presente')[0];
      const derived = yo.replace(/o$/, '') + (cls === 'ar' ? endingsFor('presubj', 'ar') : endingsFor('presubj', 'er'))[idx];
      if (/o$/.test(yo) && (phon(f) === phon(derived) || idx === 3 || idx === 4)) return 'regular';
    } catch { /* fall through */ }
    return 'irregular';
  }
  return 'regular';
}

/* ---- subjunctive triggers ------------------------------------------------- */
interface Trigger { key: string; a: number; b: number }

const POSSIBILITY_N = S('posibilidad posibilidades probabilidad probabilidades riesgo peligro necesidad importancia hora momento');
const DOUBT_N = S('idea duda dudas');
function matrixClass(words: Word[], q: number, sentStart: number): string | null {
  // noun + de que: "la posibilidad de que", "miedo de que", "ni idea de que"
  if (words[q - 1]?.w === 'de' && words[q - 2]) {
    const n = words[q - 2].w;
    if (POSSIBILITY_N.has(n)) return 'subj.impersonal';
    if (EMO_NOUN.has(n) || n === 'temor' || n === 'sensación') return 'subj.emotion';
    if (DOUBT_N.has(n)) return 'subj.doubt';
  }
  // "qué bien/pena que ..."
  for (let j = q - 1; j >= Math.max(sentStart, q - 8); j--) {
    let w = words[j];
    if (w.punct && w.w !== ',') break;
    if (w.pos === 'verb' && w.aux === 'haber') continue;
    if (w.pos === 'part' && w.compoundOf !== undefined) w = { ...w, pos: 'verb', tense: words[w.compoundOf].tense };
    if (w.w === 'qué' && words[j + 1] && (EVAL.has(words[j + 1].w) || IMPERSONAL_ADJ.has(words[j + 1].w) || EMO_NOUN.has(words[j + 1].w) || words[j + 1].w === 'suerte')) return 'subj.evaluation';
    if (w.pos === 'verb' || w.pos === 'inf' || w.pos === 'ger') {
      if (w.tense && /subj/.test(w.tense)) continue;          // another subordinate verb: keep looking
      const L = bareOf(w.lemma);
      const Lr = w.lemma;
      const neg = [1, 2, 3].some((d) => words[j - d]?.w === 'no' && !words.slice(j - d, j).some((x) => x.punct));
      const between = words.slice(j + 1, q).map((x) => x.w);
      const isQuestion = /\?/.test(sentenceText(words, q)) ;
      if (L === 'ser' || L === 'parecer' || L === 'resultar' || L === 'estar' || L === 'quedar') {
        if (between.some((x) => FACT.has(x))) return neg || isQuestion ? 'subj.doubt' : null;
        if (L === 'estar' && between.includes('seguro')) return neg ? 'subj.doubt' : null;
        if (between.some((x) => EMO_ADJ.has(x))) return 'subj.emotion';
        if (between.some((x) => IMPERSONAL_ADJ.has(x))) return 'subj.impersonal';
        if (between.some((x) => EVAL.has(x))) return 'subj.evaluation';
        if (L === 'parecer' && !between.length) return neg ? 'subj.doubt' : null;
        if (between.length) return 'subj.evaluation';
        // "Una posibilidad sería que...", "Lo mejor es que..."
        const before = words.slice(Math.max(sentStart, j - 4), j).map((x) => x.w);
        if (before.some((x) => POSSIBILITY_N.has(x) || IMPERSONAL_ADJ.has(x) || x === 'idea' || x === 'solución' || x === 'objetivo')) return 'subj.impersonal';
        return null;
      }
      if (L === 'hacer' && between.includes('falta')) return 'subj.impersonal';
      if (L === 'valer' && between.includes('más')) return 'subj.impersonal';
      if (L === 'bastar' || (L === 'poder' && (between.length === 0 || between.join(' ') === 'ser'))) return 'subj.impersonal';
      if ((L === 'dar' || L === 'tener') && between.some((x) => EMO_NOUN.has(x))) return 'subj.emotion';
      if (REPORTED.has(L)) return 'subj.volition.reported';
      if (VOLITION.has(L) || VOLITION.has(Lr)) return 'subj.volition';
      if (EMOTION.has(L) || EMOTION.has(Lr)) return 'subj.emotion';
      if (DOUBT.has(L)) return 'subj.doubt';
      if (BELIEF.has(L)) return neg || isQuestion ? 'subj.doubt' : null;
      return null;
    }
  }
  if (words[sentStart] && /^(mejor|ojalá)$/.test(words[sentStart].w)) return 'subj.impersonal';
  return null;
}

const DETERMINER_WORDS = S('el la los las un una unos unas mi mis tu tus su sus este esta estos estas ese esa esos esas del al cada varios varias muchos muchas pocos pocas otros otras algunos algunas');
/** What does this "que" do? */
export type QueRole = 'relative' | 'lo-que' | 'el-que' | 'prep-rel' | 'complement' | 'comparative' | 'periphrasis' | 'conj' | 'initial';
const QUE_CONJ_PREV = S('para sin hasta desde ya así porque aunque mientras antes después luego siempre vez medida pesar caso tal menos fin modo manera');
const COMPARATIVE_WORDS = S('más menos mejor peor mayor menor antes otro otra otros otras distinto distinta diferente mismo misma igual');

export function queRole(words: Word[], q: number): QueRole {
  const p = prevIdx(words, q);
  const pw = p >= 0 ? words[p] : undefined;
  if (!pw || (pw.punct && pw.w !== ',')) return 'initial';
  if (pw.w === ',') {
    for (let k = p - 1; k >= Math.max(0, p - 3); k--) {
      const pp = words[k];
      if (pp.punct) break;
      if (pp.pos === 'noun' || pp.pos === 'propn') return 'relative';
      if (pp.pos === 'verb') break;
    }
    return 'complement';
  }
  if (pw.w === 'lo') return 'lo-que';
  if (['el', 'la', 'los', 'las'].includes(pw.w)) {
    const pp = words[p - 1];
    return pp && pp.pos === 'prep' ? 'prep-rel' : 'el-que';
  }
  if (pw.w === 'de') {
    const pp = words[p - 1];
    if (pp && QUE_CONJ_PREV.has(pp.w)) return 'conj';
    return 'complement';
  }
  if (pw.pos === 'prep' && !QUE_CONJ_PREV.has(pw.w)) {
    const pp = words[p - 1];
    if (pp && pp.pos === 'noun') return 'prep-rel';
  }
  if (QUE_CONJ_PREV.has(pw.w)) return 'conj';
  // hace dos años que..., llevo un mes que...
  if (TIME_N.has(pw.w) && words.slice(Math.max(0, p - 4), p).some((x) => x.w === 'hace' || x.w === 'desde')) return 'conj';
  if (pw.w === 'hay' || bareOf(pw.lemma) === 'tener' && (pw.pos === 'verb' || pw.pos === 'inf' || pw.pos === 'ger')) return 'periphrasis';
  // más ... que / mejor que
  for (let j = p; j >= Math.max(0, p - 4); j--) {
    if (words[j].punct) break;
    if (COMPARATIVE_WORDS.has(words[j].w)) return 'comparative';
  }
  if (pw.pos === 'noun' && (EVAL.has(pw.w) || FACT.has(pw.w) || EMO_NOUN.has(pw.w) || pw.w === 'hora' || pw.w === 'suerte' || pw.w === 'mentira')) {
    const near = words.slice(Math.max(0, p - 3), p).map((x) => bareOf(x.lemma));
    if (near.some((x) => x === 'ser' || x === 'parecer' || x === 'dar' || x === 'tener') || words[p - 1]?.w === 'qué') return 'complement';
  }
  if (pw.pos === 'noun' || pw.pos === 'propn' || ['alguien', 'algo', 'nada', 'nadie', 'todo', 'todos', 'aquello', 'eso', 'esto', 'uno', 'una'].includes(pw.w)) return 'relative';
  if ((pw.pos === 'x' || pw.pos === 'unknown') && p >= 1 && (DETERMINER_WORDS.has(words[p - 1].w) || words[p - 1].w === 'de' || words[p - 1].pos === 'adj')) return 'relative';
  if ((pw.pos === 'adj' || pw.pos === 'x' || pw.pos === 'num') && p >= 1 && (words[p - 1].pos === 'noun' || words[p - 1].pos === 'det')) {
    // "un libro nuevo que", but "es importante que" is a complement
    const pp = words[p - 1];
    if (pp.pos === 'noun' || (pp.pos === 'det' && !['es', 'era', 'sea'].includes(words[p - 2]?.w ?? ''))) return 'relative';
  }
  return 'complement';
}

function findTrigger(words: Word[], i: number): Trigger | null {
  const [sentStart] = sentenceBounds(words, i);
  for (let j = i - 1; j >= sentStart; j--) {
    const w = words[j];
    const x = w.w;
    if (x === 'ojalá') return { key: 'subj.ojala', a: j, b: j };
    if (x === 'quién' && j === sentStart + (words[sentStart]?.punct ? 1 : 0) && /impsubj|pluscsubj/.test(words[i].verb?.map((a) => a.tense).join() ?? '')) return { key: 'subj.wish-que', a: j, b: j };
    if (['quizá', 'quizás', 'acaso', 'posiblemente', 'probablemente'].includes(x)) return { key: 'subj.adverb-doubt', a: j, b: j };
    if (x === 'vez' && words[j - 1]?.w === 'tal') return { key: 'subj.adverb-doubt', a: j - 1, b: j };
    if (x === 'si' && words[j - 1]?.w === 'como') return { key: 'subj.como-si', a: j - 1, b: j };
    if (x === 'si') return { key: 'subj.si', a: j, b: j };
    if (x === 'cuando' || x === 'mientras' || x === 'apenas') return { key: 'subj.temporal', a: j, b: j };
    if (x === 'cuanto' && words[j - 1]?.w === 'en') return { key: 'subj.temporal', a: j - 1, b: j };
    if (x === 'como' && words[j - 1]?.w === 'pronto') return { key: 'subj.temporal', a: j - 2, b: j };
    if (x === 'aunque') return { key: 'subj.concessive', a: j, b: j };
    if (x === 'como' && (j === sentStart || words[j - 1]?.punct) && /presubj/.test(words[i].verb?.map((a) => a.tense).join() ?? '')) return { key: 'subj.conj.como', a: j, b: j };
    if (x === 'como' || x === 'donde' || x === 'quien' || x === 'quienes' || x === 'cual' || x === 'cuales' || x === 'adonde') return { key: 'subj.relative', a: j, b: j };
    if (x === 'que') {
      const pv = words[j - 1]?.w ?? '';
      const pv2 = words[j - 2]?.w ?? '';
      const pv3 = words[j - 3]?.w ?? '';
      if (pv === 'para' || (pv === 'de' && pv2 === 'fin')) return { key: 'subj.purpose', a: pv === 'para' ? j - 1 : j - 3, b: j };
      if (pv === 'sin' || (pv === 'de' && pv2 === 'antes') || (pv === 'menos' && pv2 === 'a') || (pv === 'tal') || (pv === 'de' && pv2 === 'tal')
        || (pv === 'de' && pv2 === 'caso') || (pv === 'ser' && pv2 === 'no') || pv === 'salvo') {
        const first = ['sin', 'antes', 'a', 'con', 'en', 'salvo'];
        let a = j - 1;
        while (a > Math.max(sentStart, j - 4) && !first.includes(words[a].w)) a--;
        return { key: 'subj.conj', a, b: j };
      }
      if (pv === 'hasta' || (pv === 'de' && (pv2 === 'después' || pv2 === 'luego')) || (pv === 'vez' && pv2 === 'una') || (pv === 'medida' && pv2 === 'a') || (pv === 'siempre')) return { key: 'subj.temporal', a: Math.max(sentStart, j - 2), b: j };
      if ((pv === 'más' || pv === 'mucho') && pv2 === 'por') return { key: 'subj.concessive', a: j - 2, b: j };
      if (pv === 'de' && pv2 === 'pesar') return { key: 'subj.concessive', a: j - 3, b: j };
      if (pv === 'de' && pv2 === 'hecho') return { key: 'subj.factive', a: j - 3, b: j };
      if (pv === 'es' && pv2 === 'no') return { key: 'subj.doubt', a: j - 2, b: j };
      const role = queRole(words, j);
      if (role === 'initial') return { key: 'subj.wish-que', a: j, b: j };
      if (role === 'relative' || role === 'lo-que' || role === 'el-que' || role === 'prep-rel') return { key: 'subj.relative', a: j, b: j };
      if (pv === 'de' && (pv2 === 'antes' || pv3 === 'antes')) return { key: 'subj.conj', a: Math.max(sentStart, j - 3), b: j };
      if (pv === 'de' && (pv2 === 'caso' || pv3 === 'caso')) return { key: 'subj.conj', a: Math.max(sentStart, j - 3), b: j };
      if (['y', 'pero', 'sí', 'no', 'pues'].includes(pv) && (j - 1 === sentStart || words[j - 2]?.punct)) return { key: 'subj.wish-que', a: j - 1, b: j };
      if (pv === 'ahí' && pv2 === 'de') return { key: 'subj.conj', a: j - 2, b: j };
      if ((pv === 'manera' || pv === 'modo' || pv === 'forma') && pv2 === 'de') return { key: 'subj.purpose', a: j - 2, b: j };
      if (role === 'comparative') return { key: 'subj.relative', a: j, b: j };
      if (role === 'conj') return null;
      if (role === 'complement') {
        const m = matrixClass(words, j, sentStart);
        if (m) {
          let a = j - 1;
          while (a > sentStart && !(words[a].pos === 'verb' || words[a].w === 'qué')) a--;
          return { key: m, a, b: j };
        }
        // "Espero que..." with an unknown matrix: keep looking further back
        void pv3;
      }
    }
    if (isStrongPunct(w)) break;
  }
  return null;
}

/** A subjunctive-only form with no trigger, sitting where a noun or adjective
 *  sits ("pocas cuestiones", "consenso aparente", "la meta", "a simple vista"),
 *  and known as a word form: it is the noun/adjective. */
function nominalFallback(words: Word[], i: number): boolean {
  const w = words[i];
  const p = words[i - 1];
  if (!p || p.punct) return false;
  const nominalSlot = ['noun', 'adj', 'det', 'quant', 'dem', 'x', 'prep', 'num', 'poss'].includes(p.pos) || ['la', 'las', 'los', 'lo'].includes(p.w);
  if (!nominalSlot) return false;
  const lm = lemmatize(w.w);
  if (!lm) return false;
  w.pos = lm.entry?.pos === 'noun' ? 'noun' : 'x';
  w.lemma = lm.lemma;
  w.tense = undefined;
  w.verb = undefined;
  w.known = true;
  if (['la', 'las', 'los', 'lo'].includes(p.w) && p.pos === 'clitic') p.pos = 'det';
  return true;
}

/* Fixed expressions with a subjunctive and no trigger: chunks, not grammar. */
const FIXED_SUBJ = ['o sea', 'ya sea', 'maldita sea', 'sea como sea', 'sea lo que sea', 'como sea', 'pase lo que pase', 'que yo sepa',
  'quieras o no', 'así sea', 'cueste lo que cueste', 'venga', 'vaya', 'diga', 'oiga', 'mire', 'digamos'].map((x) => x.split(' '));

/* Finer trigger keys the graph distinguishes. */
const WANT = S('querer desear preferir necesitar');
const HOPE = S('esperar');
const EMO_BASIC = S('alegrar alegrarse molestar gustar encantar importar');
const POSSIBLE_ADJ = S('posible imposible probable improbable');
const COND_CONJ = S('menos tal caso ser salvo siempre');
function refineTrigger(key: string, tense: string, words: Word[], t: Trigger): string {
  const txt = words.slice(t.a, t.b + 1).map((x) => x.w);
  const lemmas = words.slice(t.a, t.b + 1).map((x) => bareOf(x.lemma));
  const past = /impsubj|pluscsubj/.test(tense);
  let k = key;
  if (key === 'subj.volition') k = lemmas.some((l) => WANT.has(l)) ? 'subj.volition.want' : lemmas.some((l) => HOPE.has(l)) ? 'subj.volition.hope' : 'subj.volition.influence';
  else if (key === 'subj.emotion') k = lemmas.some((l) => EMO_BASIC.has(l)) || txt.includes('qué') ? 'subj.emotion.basic' : 'subj.emotion';
  else if (key === 'subj.impersonal' || key === 'subj.evaluation') {
    if (txt.some((x) => POSSIBLE_ADJ.has(x)) || lemmas.includes('poder')) k = 'subj.doubt.possible';
  } else if (key === 'subj.doubt') {
    if (lemmas.some((l) => ['creer', 'pensar', 'parecer', 'suponer', 'imaginar', 'opinar', 'considerar', 'estar', 'coincidir'].includes(l))) k = 'subj.doubt.negated-belief';
    else if (lemmas.some((l) => ['ver', 'oír', 'decir', 'notar', 'saber', 'afirmar', 'asegurar'].includes(l)) || txt.join(' ').startsWith('no es que')) k = 'subj.doubt.negated-perception';
  } else if (key === 'subj.conj') {
    if (txt.includes('ahí')) k = 'subj.conj.consequence';
    else if (txt.some((x) => COND_CONJ.has(x))) k = 'subj.conj.condition';
  } else if (key === 'subj.relative') {
    const p = words[t.a - 1];
    const free = ['lo', 'el', 'la', 'los', 'las'].includes(p?.w ?? '') && !(words[t.a - 2]?.pos === 'prep') || ['donde', 'como', 'quien', 'quienes', 'cuando'].includes(txt[0]) && !(p && (p.pos === 'noun' || p.w === ','));
    if (free) k = 'subj.relative.free';
  } else if (key === 'subj.wish-que' && txt[0] === 'quién') k = 'subj.wish-que.quien';
  if (past && /^subj\.(volition|emotion|evaluation|impersonal|doubt|ojala|temporal)/.test(k)) k += '.past';
  return k;
}

/* ---- the verb pass -------------------------------------------------------- */
const INDIC: TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional'];
const SUBJ: TenseKey[] = ['presubj', 'impsubj', 'impsubjse', 'futsubj'];
const COMPOUND_OF: Partial<Record<string, string>> = {
  presente: 'perfecto', imperfecto: 'plusc', futuro: 'futperf', condicional: 'condperf', presubj: 'perfsubj',
  impsubj: 'pluscsubj', impsubjse: 'pluscsubj', preterito: 'plusc',
};
const REGULAR_PART = /(ado|ido|ído)$/;

function chooseLemma(words: Word[], i: number, readings: Analysis[]): string {
  const infs = [...new Set(readings.map((a) => a.inf))];
  const nx = words[i + 1]?.w;
  const pc = proclitics(words, i);
  if (infs.includes('ser') && infs.some((x) => x === 'ir' || x === 'irse')) {
    if (pc.clitics.includes('se')) return 'irse';
    return nx === 'a' || nx === 'al' || nx === 'de' && ['viaje', 'vacaciones', 'compras', 'paseo'].includes(words[i + 2]?.w ?? '') || nx === 'para' || nx === 'allá' || nx === 'allí' ? 'ir' : 'ser';
  }
  // reflexive if the agreeing pronoun is right before it
  const person = readings[0].person;
  const refl = REFLEX_FOR[person];
  const bareInfs = infs.map(bareOf);
  if (refl && pc.clitics.includes(refl)) {
    for (const b of bareInfs) { const r = reflexiveOf(b); if (r) return r; }
  }
  const nonRefl = infs.find((x) => !/se$/.test(x) || x === 'ser' );
  return nonRefl ?? bareInfs[0];
}

function verbPass(ctx: FeatureCtx): void {
  const { words } = ctx;
  // first: unambiguous commands, so commandContext can see them
  for (const w of words) {
    if (w.pos !== 'verb' || !w.verb) continue;
    const enc = w.verb.find((a) => a.clitics?.length);
    const onlyImp = w.verb.every((a) => a.tense === 'imperativo');
    if (enc || onlyImp) w.tense = 'cmd';
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.pos !== 'verb' || !w.verb || !w.verb.length) continue;
    if (w.w === 'hay') { w.lemma = 'haber'; w.tense = 'presente'; continue; }
    const R = w.verb;
    // haber auxiliary: the compound tense lives on the participle
    if (w.aux === 'haber') {
      const t = R.find((a) => a.inf === 'haber' && COMPOUND_OF[a.tense]);
      const comp = t ? COMPOUND_OF[t.tense]! : 'perfecto';
      w.tense = comp; w.lemma = 'haber';
      const p = words.findIndex((x) => x.compoundOf === i);
      const key = 'tense.' + comp;
      if (/subj/.test(comp)) {
        const trig = findTrigger(words, i);
        if (trig) add(ctx, refineTrigger(trig.key, comp === 'perfsubj' ? 'presubj' : 'impsubj', words, trig), trig.a, trig.b, { trigger: words.slice(trig.a, trig.b + 1).map((x) => x.w).join(' ') });
        else { add(ctx, 'subj.unlicensed', i, p); ctx.low.push(`subjunctive "${w.w} ${words[p]?.w}" without a recognised trigger`); }
      }
      add(ctx, key, i, p >= 0 ? p : i, { lemma: p >= 0 ? words[p].lemma : undefined });
      if (p >= 0 && !/(ado|ido)$/.test(deaccent(words[p].w))) add(ctx, 'participle.irregular', p, p, { lemma: words[p].lemma });
      continue;
    }
    const pc = proclitics(words, i);
    const initial = clauseInitial(words, i);
    const enc = R.filter((a) => a.clitics?.length);
    const imps = R.filter((a) => a.tense === 'imperativo');
    const indic = R.filter((a) => INDIC.includes(a.tense));
    const subj = R.filter((a) => SUBJ.includes(a.tense));
    const variety = R.every((a) => a.variety) ? R[0].variety : undefined;

    const emitCommand = (a: Analysis, neg: boolean) => {
      w.tense = 'cmd';
      w.lemma = chooseLemma(words, i, [a]);
      const p = a.person === 'usted' || a.person === 'él/ella' ? 'usted' : a.person === 'ustedes' || a.person === 'ellos' ? 'ustedes' : a.person === 'nosotros' ? 'nosotros' : a.person === 'vosotros' ? 'vosotros' : 'tu';
      if (p === 'vosotros') { add(ctx, 'cmd.vosotros', i, i, { lemma: w.lemma }); return; }
      if (p === 'nosotros') { add(ctx, 'cmd.nosotros', i, i, { lemma: w.lemma }); return; }
      const key = `cmd.${p}.${neg ? 'neg' : 'aff'}` + (!neg && p === 'tu' && IRREG_TU_CMD.has(a.form.toLowerCase()) ? '.irregular' : '');
      add(ctx, key, neg ? pc.start - 1 : i, i, { lemma: w.lemma });
    };

    if (variety === 'vosotros' && !enc.length) {
      add(ctx, 'dialect.vosotros', i, i, { lemma: R[0].inf });
    } else if (variety === 'voseo') {
      add(ctx, 'dialect.voseo', i, i, { lemma: R[0].inf });
    }

    if (enc.length) {
      const score = (x: Analysis) => {
        const cl = x.clitics ?? [];
        let s = x.variety ? -5 : 0;
        if (cl.length === 1 && cl[0] === 'se' && (x.person === 'usted' || x.person === 'ustedes')) s += 3;
        if (cl[0] === 'te' && x.person === 'tú') s += 2;
        if (cl[0] === 'nos' && x.person === 'nosotros') s += 2;
        if (/se$/.test(x.inf)) s += 1;
        return s;
      };
      const a = [...enc].sort((p, q) => score(q) - score(p))[0];
      w.verb = [a, ...R.filter((x) => x !== a)];
      emitCommand(a, false);
      w.enclitics = a.clitics;
      continue;
    }
    const MANDATORY = /^subj\.(volition|emotion|evaluation|impersonal|doubt|ojala|purpose|conj|wish)/;
    if (indic.length && subj.length) {
      const trig = findTrigger(words, i);
      if (trig && MANDATORY.test(trig.key)) indic.length = 0;
    }
    if (indic.length) {
      const tuImp = imps.find((a) => a.person === 'tú');
      const nx = words[i + 1]?.w;
      const goCmd = (w.w === 've' && (nx === 'a' || nx === 'al') && initial && !pc.clitics.length)
        || (['ven', 'haz', 'pon', 'sal'].includes(w.w) && w.sentStart && !/\?/.test(sentenceText(words, i)));
      if (tuImp && initial && !pc.clitics.length && !pc.neg && (commandContext(words, i) || goCmd)) {
        const isGo = w.w === 've';
        emitCommand(isGo ? { ...tuImp, inf: 'ir' } : tuImp, false);
        if (isGo) w.lemma = 'ir';
        continue;
      }
      // tense choice: generous order, with a past cue for -amos/-imos
      let tenses = [...new Set(indic.map((a) => a.tense))];
      if (tenses.includes('presente') && tenses.includes('preterito')) {
        const past = PAST_CUE.test(sentenceText(words, i)) || words.some((x, k) => k !== i && x.tense === 'preterito');
        tenses = [past ? 'preterito' : 'presente'];
      }
      const t = INDIC.find((x) => tenses.includes(x))!;
      const rs = indic.filter((a) => a.tense === t);
      w.tense = t;
      w.lemma = chooseLemma(words, i, rs);
      if (tuImp && initial && !pc.clitics.length && !pc.neg && w.sentStart && !/[?]/.test(sentenceText(words, i)) && t === 'presente') {
        w.weak = `"${w.w}" could be a tú command or a present`;
      }
      const a = rs.find((x) => bareOf(x.inf) === bareOf(w.lemma)) ?? rs[0];
      if (w.lemma === 'haber') { // existential había / hubo / habrá
        add(ctx, 'hay.tense', i, i, { lemma: 'haber' });
        continue;
      }
      const cls = formClass(w.lemma, t, a.person, a.form);
      add(ctx, `tense.${t}.${cls}`, i, i, { lemma: w.lemma });
      if (bareOf(w.lemma) === 'haber' || w.lemma === 'haber') continue;
      // cuando + indicative (habitual / past): informative
      const [ss] = sentenceBounds(words, i);
      for (let j = i - 1; j >= Math.max(ss, i - 6); j--) {
        if (words[j].w === 'cuando') { add(ctx, 'conj.cuando.ind', j, i); break; }
        if (words[j].w === 'aunque') { add(ctx, 'conj.aunque.ind', j, i); break; }
        if (words[j].pos === 'verb' || words[j].punct) break;
      }
      continue;
    }
    if (subj.length) {
      const trig = findTrigger(words, i);
      const tenses = [...new Set(subj.map((a) => a.tense))];
      const t = SUBJ.find((x) => tenses.includes(x))!;
      const rs = subj.filter((a) => a.tense === t);
      if (!trig && FIXED_SUBJ.some((f) => f.includes(w.w) && f.every((tk, k) => words[i + k - f.indexOf(w.w)]?.w === tk))) {
        w.tense = t; w.lemma = chooseLemma(words, i, rs);
        add(ctx, 'subj.fixed', i, i, { lemma: w.lemma });
        continue;
      }
      if (!trig && initial && (t === 'presubj')) {
        // a command: no hables / hable / hablen / hablemos
        const tu = rs.find((a) => a.person === 'tú');
        const third = rs.find((a) => a.person === 'él/ella');
        const pl = rs.find((a) => a.person === 'ellos');
        const nos = rs.find((a) => a.person === 'nosotros');
        const pick = pc.neg ? (tu ?? third ?? pl ?? nos) : (third ?? pl ?? nos);
        if (pick) {
          emitCommand({ ...pick, person: pick === third ? 'usted' : pick === pl ? 'ustedes' : pick.person }, pc.neg);
          continue;
        }
      }
      w.tense = t;
      w.lemma = chooseLemma(words, i, rs);
      const a = rs[0];
      const tk = t === 'impsubjse' ? 'impsubj' : t;
      const cls = t === 'presubj' ? formClass(w.lemma, t, a.person, a.form) : 'regular';
      add(ctx, `tense.${tk}${t === 'impsubjse' ? '.se' : ''}${cls !== 'regular' ? '.irregular' : ''}`, i, i, { lemma: w.lemma });
      if (trig) add(ctx, refineTrigger(trig.key, t, words, trig), trig.a, trig.b, { trigger: words.slice(trig.a, trig.b + 1).map((x) => x.w).join(' '), lemma: w.lemma });
      else if (nominalFallback(words, i)) continue;
      else if (FIXED_SUBJ.some((f) => f.every((t, k) => words[i + k - f.indexOf(w.w)]?.w === t))) add(ctx, 'subj.fixed', i, i, { lemma: w.lemma });
      else if (t === 'impsubj' && ['querer', 'deber', 'poder'].includes(bareOf(w.lemma))) add(ctx, 'subj.courtesy', i, i, { lemma: w.lemma });
      else { add(ctx, 'subj.unlicensed', i, i, { lemma: w.lemma }); ctx.low.push(`subjunctive "${w.w}" without a recognised trigger`); }
      continue;
    }
    if (imps.length) {
      // only an imperative reading (ten, haz, pon, sal, ven, di)
      emitCommand(imps[0], false);
      continue;
    }
    // anything else (futsubj handled above): record the tense plainly
    w.tense = R[0].tense;
    w.lemma = chooseLemma(words, i, R);
    add(ctx, `tense.${R[0].tense}`, i, i, { lemma: w.lemma });
  }
}

/* ---- pronouns: clitics, reflexives, gustar, se ---------------------------- */
function pronounPass(ctx: FeatureCtx): void {
  const { words } = ctx;
  const handled = new Set<number>();
  const isVerbLike = (w: Word) => w.pos === 'verb' && w.aux !== 'haber' && w.w !== 'hay';
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const isAux = w.pos === 'verb' && w.aux === 'haber';
    if (!(isVerbLike(w) || isAux)) continue;
    const pc = proclitics(words, i);
    if (!pc.clitics.length) continue;
    // the lexical verb: for a compound, the participle
    let lexIdx = i;
    if (isAux) { const p = words.findIndex((x) => x.compoundOf === i); if (p >= 0) lexIdx = p; }
    const lemma = bareOf(words[lexIdx].lemma);
    const persons = (w.verb ?? []).filter((a) => (w.tense === 'cmd' ? a.tense === 'imperativo' || /subj/.test(a.tense) : a.tense === w.tense) || w.aux).map((a) => a.person);
    const agreeing = persons.find((pp) => pc.clitics.includes(REFLEX_FOR[pp] ?? '-'));
    const person = agreeing ?? persons[0] ?? w.verb?.[0]?.person ?? '';
    const cl = [...pc.clitics];
    const a = pc.start, b = pc.start + cl.length - 1;
    for (let k = a; k <= b; k++) handled.add(k);
    procesClitics(ctx, cl, a, b, i, lemma, person, 'proclitic');
  }
  // enclitics: commands, infinitives, gerunds
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!w.enclitics?.length) continue;
    const pos = w.pos === 'inf' ? 'inf' : w.pos === 'ger' ? 'ger' : 'cmd';
    const lemma = bareOf(w.lemma);
    let person = pos === 'cmd' ? (w.verb?.find((a) => a.clitics)?.person ?? 'tú') : 'any';
    if (pos !== 'cmd') {
      for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
        const m = words[j];
        if (m.punct) break;
        if (m.pos === 'verb' && m.verb?.length) { person = m.verb.find((a) => a.tense === m.tense)?.person ?? m.verb[0].person; break; }
      }
    }
    add(ctx, `clitic.enclitic.${pos}`, i, i, { lemma: w.lemma });
    procesClitics(ctx, w.enclitics, i, i, i, lemma, person, pos);
  }
  // reflexive infinitive cited whole: levantarse, sentarse
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if ((w.pos === 'inf') && /se$/.test(w.w) && !w.enclitics?.length && reflexiveOf(bareOf(w.lemma))) {
      add(ctx, 'reflexive', i, i, { lemma: reflexiveOf(bareOf(w.lemma))! });
    }
  }
}

const MEANING_CHANGE = S('irse dormirse quedarse llevarse comerse morirse encontrarse parecerse acordarse despedirse');
const CHANGE_VERBS = S('ponerse volverse hacerse convertirse');
function procesClitics(ctx: FeatureCtx, cl: string[], a: number, b: number, v: number, lemma: string, person: string, pos: string): void {
  const { words } = ctx;
  const vw = words[v];
  // gustar-type: IO + gustar/encantar/doler...
  const io = cl.find((c) => PERSONAL.has(c) || IO.has(c));
  if (io && GUSTAR.has(lemma) && !cl.includes('se') && (pos === 'proclitic' || pos === 'inf' || pos === 'ger')) {
    const reflForPerson = REFLEX_FOR[person];
    if (!(reflForPerson === io && reflexiveOf(lemma))) {
      add(ctx, lemma === 'gustar' ? 'gustar' : ['parecer', 'quedar', 'caer', 'faltar'].includes(lemma) ? 'gustar.like.parecer' : 'gustar.like', a, v, { lemma });
      // doubling: "a mí me gusta", "a Ana le encanta"
      for (let j = a - 1; j >= Math.max(0, a - 4); j--) {
        if (words[j].punct) break;
        if (words[j].w === 'a' && words[j + 1] && ['pron', 'propn', 'det', 'poss', 'noun'].includes(words[j + 1].pos)) { add(ctx, 'gustar.doubling', j, a, { lemma }); break; }
      }
      return;
    }
  }
  // accidental se: se me olvidó, se le cayó
  if (cl[0] === 'se' && cl.length >= 2 && (PERSONAL.has(cl[1]) || IO.has(cl[1])) && (ACCIDENTAL.has(lemma) || !GUSTAR.has(lemma))) {
    add(ctx, 'se.accidental', a, v, { lemma });
    return;
  }
  // se lo / se la
  if (cl[0] === 'se' && cl.length >= 2 && DO.has(cl[1])) {
    const refl = REFLEX_FOR[person] === 'se' && reflexiveOf(lemma);
    if (!refl || pos !== 'proclitic') {
      add(ctx, 'clitic.se-lo', a, b, { lemma });
      add(ctx, 'clitic.combined', a, b, { lemma });
      return;
    }
  }
  // reflexive: the pronoun that agrees with the verb's person, on a verb that has a reflexive entry
  let rest = [...cl];
  const reflPron = (pos === 'inf' || pos === 'ger') && person === 'any' ? (cl[0] === 'se' ? 'se' : undefined) : REFLEX_FOR[person];
  if (reflPron && cl.includes(reflPron)) {
    const r = reflexiveOf(lemma);
    if (r) {
      add(ctx, MEANING_CHANGE.has(r) ? 'reflexive.meaning' : CHANGE_VERBS.has(r) ? 'reflexive.change' : 'reflexive', a, v, { lemma: r });
      if (vw.lemma === lemma && pos !== 'inf' && pos !== 'ger') vw.lemma = r;
      rest = cl.filter((c, k) => !(c === reflPron && k === cl.indexOf(reflPron)));
    } else if (reflPron === 'se' && pos === 'proclitic' && cl.length === 1) {
      // se + 3rd person on a verb with no reflexive entry: impersonal or passive
      const plural = person === 'ellos' || person === 'ustedes';
      let sj = a - 1;
      if (words[sj]?.w === 'no') sj--;
      const subj = words[sj];
      if (subj && !subj.punct && (subj.pos === 'propn' || ['él', 'ella', 'ellos', 'ellas', 'usted', 'ustedes'].includes(subj.w)) && words[sj - 1]?.pos !== 'prep') {
        add(ctx, 'reflexive', a, v, { lemma: lemma + 'se' });
        return;
      }
      const nx = words[v + 1];
      const npNext = nx && !nx.punct && (['det', 'poss', 'num', 'noun', 'quant'].includes(nx.pos) || QUANTIFIERS.has(nx.w));
      const present = words[v].tense === 'presente' || words[v].tense === 'cmd';
      add(ctx, plural || npNext ? (present && !plural ? 'se.passive.basic' : 'se.passive') : 'se.impersonal', a, v, { lemma });
      return;
    }
  }
  if (!rest.length) return;
  if (rest.length >= 2) add(ctx, 'clitic.combined', a, b, { lemma });
  for (const c of rest) {
    if (DO.has(c)) add(ctx, 'clitic.do', a, b, { lemma });
    else if (IO.has(c)) {
      add(ctx, 'clitic.io', a, b, { lemma });
      for (let j = v + 1; j < Math.min(words.length, v + 7); j++) {
        if (words[j].punct && words[j].w !== ',') break;
        if (words[j].w === 'a' && words[j + 1] && (words[j + 1].pos === 'propn' || words[j + 1].pos === 'det' || words[j + 1].pos === 'poss')) { add(ctx, 'clitic.io.doubling', a, j + 1, { lemma }); break; }
        if (words[j].w === 'al') { add(ctx, 'clitic.io.doubling', a, j, { lemma }); break; }
      }
    }
    else if (PERSONAL.has(c)) add(ctx, 'clitic.personal', a, b, { lemma });
    else if (c === 'se') add(ctx, rest.length >= 2 ? 'clitic.se-lo' : 'se.impersonal', a, b, { lemma });
  }
}

/* ---- relatives, conditionals ---------------------------------------------- */
function clausePass(ctx: FeatureCtx): void {
  const { words } = ctx;
  for (let i = 0; i < words.length; i++) {
    const x = words[i].w;
    if (words[i].punct) continue;
    if (x === 'que') {
      const role = queRole(words, i);
      const p = prevIdx(words, i);
      if (role === 'relative') add(ctx, 'rel.que', i, i);
      else if (role === 'lo-que') add(ctx, 'rel.lo-que', p, i);
      else if (role === 'el-que') add(ctx, 'rel.el-que', p, i);
      else if (role === 'prep-rel') add(ctx, 'rel.prep', Math.max(0, p - 1), i);
      else if (role === 'complement') {
        add(ctx, 'que.complement', i, i);
        const m = words[i - 1];
        if (m && m.pos === 'verb' && ['decir', 'contar', 'explicar', 'comentar', 'avisar', 'prometer', 'escribir', 'responder', 'contestar'].includes(bareOf(m.lemma)) && m.tense === 'preterito') {
          const [, end] = sentenceBounds(words, i);
          for (let j = i + 1; j <= end; j++) {
            const v = words[j];
            if (v.pos !== 'verb') continue;
            if (v.tense === 'imperfecto') add(ctx, 'reported.past', i - 1, j);
            else if (v.tense === 'plusc' || v.tense === 'condicional') add(ctx, 'reported.backshift', i - 1, j);
            break;
          }
        }
      }
      continue;
    }
    if (x === 'quien' || x === 'quienes') {
      const p = prevIdx(words, i);
      add(ctx, p >= 0 && words[p].pos === 'prep' ? 'rel.prep' : 'rel.quien', p >= 0 && words[p].pos === 'prep' ? p : i, i);
      continue;
    }
    if (x === 'donde' || x === 'adonde') { add(ctx, 'rel.donde', i, i); continue; }
    if ((x === 'cual' || x === 'cuales') && i > 0 && ['el', 'la', 'lo', 'los', 'las'].includes(words[i - 1].w)) {
      add(ctx, 'rel.cual', i - 1, i);
      continue;
    }
    if (/^cuy[oa]s?$/.test(x)) { add(ctx, 'rel.cuyo', i, i); continue; }
    const pv = words[i - 1];
    const indirectQ = pv && (['saber', 'preguntar', 'preguntarse', 'ver', 'decidir', 'depender', 'averiguar', 'recordar', 'entender', 'importar', 'dudar', 'imaginar'].includes(bareOf(pv.lemma)) || pv.w === 'sé');
    if (x === 'si' && indirectQ) add(ctx, 'q.indirect', i, i);
    if (x === 'si' && words[i].pos === 'conj' && words[i - 1]?.w !== 'como' && !indirectQ) {
      const [, end] = sentenceBounds(words, i);
      for (let j = i + 1; j <= end; j++) {
        const v = words[j];
        if (v.pos !== 'verb') continue;
        const t = v.tense ?? '';
        if (t === 'impsubj' || t === 'impsubjse') add(ctx, 'cond.hypothetical', i, j);
        else if (t === 'pluscsubj') add(ctx, 'cond.past', i, j);
        else if (t === 'presente' || t === 'perfecto' || t === 'futuro') add(ctx, 'cond.real', i, j);
        break;
      }
    }
  }
}

/* ---- periphrases ----------------------------------------------------------- */
function nextSkip(words: Word[], i: number, skip = 1): number {
  let j = i + 1;
  let n = 0;
  while (j < words.length && !words[j].punct && n < skip && (['adv', 'neg'].includes(words[j].pos) && !['a', 'de', 'que'].includes(words[j].w))) { j++; n++; }
  return j < words.length && !words[j].punct ? j : -1;
}
const isInf = (w?: Word) => !!w && w.pos === 'inf';
const isGer = (w?: Word) => !!w && w.pos === 'ger';

function periphrasisPass(ctx: FeatureCtx): void {
  const { words } = ctx;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!['verb', 'inf', 'ger'].includes(w.pos) || w.aux) continue;
    if (w.w === 'hay') {
      const q = nextSkip(words, i, 0);
      if (q >= 0 && words[q].w === 'que' && isInf(words[q + 1])) add(ctx, 'peri.hay-que', i, q + 1);
      else add(ctx, 'hay', i, i);
      continue;
    }
    const L = bareOf(w.lemma);
    const n1 = nextSkip(words, i);
    if (n1 < 0) continue;
    const a1 = words[n1];
    const a2 = words[n1 + 1];
    const a3 = words[n1 + 2];
    const prepInf = (prep: string, key: string) => {
      if (a1.w === prep && isInf(a2)) { add(ctx, key, i, n1 + 1, { lemma: a2.lemma }); return true; }
      return false;
    };
    switch (L) {
      case 'ir': if (!prepInf('a', 'peri.ir-a') && isGer(a1)) add(ctx, 'peri.ir-ger', i, n1); break;
      case 'tener': if (a1.w === 'que' && isInf(a2)) add(ctx, 'peri.tener-que', i, n1 + 1); break;
      case 'acabar': prepInf('de', 'peri.acabar-de'); break;
      case 'volver': prepInf('a', 'peri.volver-a'); break;
      case 'dejar': prepInf('de', 'peri.dejar-de'); break;
      case 'empezar': case 'comenzar': prepInf('a', 'peri.empezar-a'); break;
      case 'terminar': prepInf('de', 'peri.terminar-de'); break;
      case 'poner': if (proclitics(words, i).clitics.includes('se') || w.lemma === 'ponerse' || w.enclitics?.includes('se')) prepInf('a', 'peri.ponerse-a'); break;
      case 'soler': if (isInf(a1)) add(ctx, 'peri.soler', i, n1); break;
      case 'deber': if (isInf(a1)) add(ctx, 'peri.deber', i, n1); else if (a1.w === 'de' && isInf(a2)) add(ctx, 'peri.deber', i, n1 + 1); break;
      case 'poder': if (isInf(a1)) add(ctx, 'peri.poder', i, n1); break;
      case 'querer': if (isInf(a1)) add(ctx, 'peri.querer', i, n1); break;
      case 'estar':
        if (isGer(a1)) add(ctx, w.tense === 'imperfecto' ? 'peri.estar-ger.past' : 'peri.estar-ger', i, n1, { lemma: a1.lemma });
        else if (a1.w === 'a' && a2?.w === 'punto' && a3?.w === 'de') add(ctx, 'peri.estar-a-punto', i, n1 + 2);
        break;
      case 'seguir': case 'continuar': if (isGer(a1)) add(ctx, 'peri.seguir-ger', i, n1); break;
      case 'andar': if (isGer(a1)) add(ctx, 'peri.ir-ger', i, n1); break;
      case 'llevar': {
        for (let j = n1; j < Math.min(words.length, n1 + 5); j++) {
          if (words[j].punct) break;
          if (isGer(words[j])) { add(ctx, 'peri.llevar-ger', i, j); break; }
          if (words[j].w === 'sin' && isInf(words[j + 1])) { add(ctx, 'peri.llevar-ger', i, j + 1); break; }
        }
        break;
      }
    }
  }
}

/* ---- ser / estar ----------------------------------------------------------- */
function copulaPass(ctx: FeatureCtx): void {
  const { words } = ctx;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!['verb', 'inf', 'ger'].includes(w.pos) || w.aux) continue;
    const L = bareOf(w.lemma);
    if (L !== 'ser' && L !== 'estar') continue;
    if (w.w === 'sé') continue;
    let j = i + 1;
    while (j < words.length && !words[j].punct && (DEGREE.has(words[j].w) || words[j].w === 'un' && words[j + 1]?.w === 'poco' || words[j].w === 'poco' && words[j - 1]?.w === 'un')) {
      if (L === 'estar' && (words[j].w === 'bien' || words[j].w === 'mal')) break;
      j++;
    }
    const n = words[j];
    if (L === 'estar' && words.slice(Math.max(0, i - 3), i).some((x) => x.w === 'dónde')) { add(ctx, 'estar.location', i, i); continue; }
    if (!n || n.punct) {
      // "¿Dónde está?" / "Así es."
      const before = words.slice(Math.max(0, i - 3), i).map((x) => x.w);
      if (L === 'estar' && before.includes('dónde')) add(ctx, 'estar.location', i, i);
      else if (L === 'ser' && before.some((x) => ['qué', 'quién', 'quiénes', 'cuál'].includes(x))) add(ctx, 'ser.identity', i, i);
      else add(ctx, L, i, i);
      continue;
    }
    const lx = lexEntry(n.w) ?? (n.lemma ? lexEntry(n.lemma) : undefined);
    if (L === 'ser') {
      if (n.pos === 'part' && !(lx && (lx.pos === 'adj' || lx.pos === 'x'))) add(ctx, 'ser.passive', i, j, { lemma: n.lemma });
      else if (n.w === 'de') add(ctx, 'ser.origin', i, j);
      else if (n.w === 'en') add(ctx, 'ser.event', i, j);
      else if ((n.w === 'la' || n.w === 'las') && (words[j + 1]?.pos === 'num' || /^(una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)$/.test(words[j + 1]?.w ?? ''))) add(ctx, 'ser.time', i, j + 1);
      else if (n.w === 'mediodía' || n.w === 'medianoche' || n.w === 'tarde' || n.w === 'temprano') add(ctx, 'ser.time', i, j);
      else if (['det', 'poss', 'dem', 'num', 'noun', 'propn', 'pron', 'quant'].includes(n.pos)) add(ctx, 'ser.identity', i, j);
      else if (['adj', 'x', 'part'].includes(n.pos)) add(ctx, 'ser.characteristic', i, j);
      else if (n.w === 'que' || n.pos === 'inf') add(ctx, 'ser', i, i);
      else add(ctx, 'ser', i, i);
    } else {
      if (n.pos === 'ger') continue;                       // progressive: a periphrasis
      if (n.w === 'a' && words[j + 1]?.w === 'punto') continue;
      if (['en', 'a', 'al', 'por', 'entre', 'bajo', 'sobre', 'cerca', 'junto', 'frente', 'detrás', 'delante', 'dentro', 'fuera', 'encima', 'debajo', 'hasta', 'desde'].includes(n.w) || LOCATION_ADV.has(n.w) || n.w === 'donde' || n.w === 'lejos') add(ctx, 'estar.location', i, j);
      else if (n.pos === 'part' && !(lx && lx.pos === 'adj')) add(ctx, 'estar.result', i, j, { lemma: n.lemma });
      else if (['adj', 'x', 'part'].includes(n.pos) || ['bien', 'mal', 'listo', 'lista', 'de', 'así', 'igual', 'mejor', 'peor', 'solo', 'sola'].includes(n.w)) add(ctx, 'estar.state', i, j);
      else if (n.pos === 'propn' || n.pos === 'noun') add(ctx, 'estar.location', i, j);
      else add(ctx, 'estar', i, i);
    }
  }
}

/* ---- por/para, comparison, misc ------------------------------------------- */
const POR_FIXED = [
  'por favor', 'por fin', 'por eso', 'por ejemplo', 'por supuesto', 'por cierto', 'por lo menos', 'por lo tanto',
  'por lo general', 'por la mañana', 'por la tarde', 'por la noche', 'por suerte', 'por desgracia', 'por si acaso',
  'por primera vez', 'por todas partes', 'por ciento', 'por qué', 'por lo visto', 'por un lado', 'por otro lado',
  'por completo', 'por cierto', 'por ahora', 'por aquí', 'por allá', 'por allí', 'por teléfono', 'por correo',
].map((s) => s.split(' '));

function miscPass(ctx: FeatureCtx): void {
  const { words } = ctx;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const x = w.w;
    if (w.punct) continue;
    if (x === 'por' && w.pos === 'prep') {
      const fx = POR_FIXED.find((f) => f.every((t, k) => words[i + k]?.w === t));
      if (fx) add(ctx, 'por.fixed', i, i + fx.length - 1);
      else add(ctx, 'prep.por', i, i);
    } else if (x === 'para' && w.pos === 'prep' && words[i + 1]?.w !== 'que') add(ctx, 'prep.para', i, i);
    else if (x === 'más' || x === 'menos') {
      if (words[i + 1]?.w === 'de' && (words[i + 2]?.pos === 'num' || /^\d/.test(words[i + 2]?.w ?? ''))) { add(ctx, 'comp.mas-de', i, i + 1); continue; }
      // superlative: (el|la|los|las) (noun)? más ADJ
      const p1 = words[i - 1], p2 = words[i - 2];
      const nx = words[i + 1];
      if (nx && ['adj', 'x', 'part', 'adv'].includes(nx.pos) && (p1 && ['el', 'la', 'los', 'las', 'lo'].includes(p1.w) || p1?.pos === 'noun' && p2 && ['el', 'la', 'los', 'las'].includes(p2.w) && words.slice(i + 2, i + 4).some((y) => y.w === 'de') || p1?.pos === 'noun' && p2 && ['el', 'la', 'los', 'las'].includes(p2.w) && !words.slice(i + 1, i + 5).some((y) => y.w === 'que'))) {
        add(ctx, 'sup.relative', p1?.pos === 'noun' ? i - 2 : i - 1, i + 1);
        continue;
      }
      for (let j = i + 1; j < Math.min(words.length, i + 6); j++) {
        if (words[j].punct && words[j].w !== ',') break;
        if (words[j].w === 'que') { add(ctx, 'comp.mas-que', i, j); break; }
      }
    } else if (x === 'tan') {
      for (let j = i + 1; j < Math.min(words.length, i + 5); j++) if (words[j].w === 'como') { add(ctx, 'comp.tan-como', i, j); break; }
    } else if (/^tant[oa]s?$/.test(x)) {
      for (let j = i + 1; j < Math.min(words.length, i + 5); j++) if (words[j].w === 'como') { add(ctx, 'comp.tanto-como', i, j); break; }
    } else if (['mejor', 'peor', 'mayor', 'menor', 'mejores', 'peores', 'mayores', 'menores'].includes(x)) {
      const p1 = words[i - 1];
      if (p1 && ['el', 'la', 'los', 'las', 'lo'].includes(p1.w) && !(x.startsWith('mayor') || x.startsWith('menor'))) add(ctx, 'sup.relative', i - 1, i);
      else for (let j = i + 1; j < Math.min(words.length, i + 6); j++) {
        if (words[j].punct) break;
        if (words[j].w === 'que') { add(ctx, 'comp.irregular', i, j); break; }
      }
    } else if (x === 'igual' && (words[i + 1]?.w === 'que' || words[i + 1]?.w === 'de')) add(ctx, 'comp.igual', i, i + 1);
    else if (/ísim[oa]s?$/.test(x) && ['adj', 'x', 'adv'].includes(w.pos)) add(ctx, 'sup.isimo', i, i, { lemma: w.lemma });
    else if (x === 'al' && words[i + 1]?.pos === 'inf') add(ctx, 'nonfinite.al-inf', i, i + 1);
    else if (x === 'no' || ((x === 'nunca' || x === 'tampoco' || x === 'jamás') && words[i + 1]?.pos === 'verb')) {
      // no ... nada / nadie / nunca / ninguno / tampoco after the verb
      const [, end] = sentenceBounds(words, i);
      let sawVerb = false;
      for (let j = i + 1; j <= end; j++) {
        if (words[j].pos === 'verb') sawVerb = true;
        else if (sawVerb && NEGATIVES.has(words[j].w) && words[j].w !== 'no') { add(ctx, 'neg.double', i, j); break; }
        if (words[j].punct && words[j].w !== ',') break;
      }
    }
  }
}

/* ---- noun phrases, questions, connectors ------------------------------------ */
const ART = S('el la los las un una unos unas del al');
const POSS_SHORT = S('mi mis tu tus su sus nuestro nuestra nuestros nuestras');
const POSS_LONG = S('mío mía míos mías tuyo tuya tuyos tuyas suyo suya suyos suyas');
const DEM = S('este esta estos estas ese esa esos esas aquel aquella aquellos aquellas esto eso aquello');
const INDEF = S('algo alguien algún alguno alguna algunos algunas ningún ninguno ninguna');
const QUANT = S('mucho mucha muchos muchas poco poca pocos pocas bastante bastantes demasiado demasiada demasiados demasiadas');
const WH = S('qué quién quiénes dónde adónde cuándo cómo cuánto cuánta cuántos cuántas cuál cuáles');
const TIME_N = S('segundo segundos minuto minutos hora horas día días semana semanas mes meses año años rato tiempo siglo siglos década décadas momento');
/* Connectors: [phrase, feature key]. Longest first. */
const CONNECTORS: Array<[string[], string]> = ([
  ['por lo tanto', 'conn.consequence'], ['de modo que', 'conn.consequence'], ['de manera que', 'conn.consequence'], ['así que', 'conn.cause'],
  ['por eso', 'conn.cause'], ['porque', 'conn.cause'], ['ya que', 'conn.cause-adv'], ['puesto que', 'conn.cause-adv'], ['debido a', 'conn.cause-adv'],
  ['a causa de', 'conn.cause-adv'], ['dado que', 'conn.cause-adv'], ['a pesar de', 'conn.despite'], ['sin embargo', 'conn.despite'],
  ['aun así', 'conn.despite'], ['no obstante', 'conn.despite'], ['en primer lugar', 'conn.discourse'], ['por un lado', 'conn.discourse'],
  ['por otro lado', 'conn.discourse'], ['en conclusión', 'conn.discourse'], ['además', 'conn.discourse'], ['en resumen', 'conn.discourse'],
  ['o sea', 'conn.reformulation'], ['es decir', 'conn.reformulation'], ['mejor dicho', 'conn.reformulation'], ['en otras palabras', 'conn.reformulation'],
  ['al parecer', 'conn.hedge'], ['supuestamente', 'conn.hedge'], ['por lo visto', 'conn.hedge'], ['si bien', 'conn.concessive-adv'],
  ['aun cuando', 'conn.concessive-adv'], ['de ahí que', 'conn.consequence-adv'], ['por consiguiente', 'conn.consequence-adv'], ['así pues', 'conn.consequence-adv'],
  ['primero', 'conn.sequence'], ['luego', 'conn.sequence'], ['al final', 'conn.sequence'], ['al día siguiente', 'conn.sequence'], ['después', 'conn.sequence'],
  ['a lo mejor', 'conn.maybe'], ['cada vez más', 'comp.cada-vez'], ['ya no', 'conn.ya'], ['todavía no', 'conn.ya'], ['todavía', 'conn.ya'],
] as Array<[string, string]>).map(([p, k]) => [p.split(' '), k] as [string[], string]).sort((a, b) => b[0].length - a[0].length);

function npPass(ctx: FeatureCtx): void {
  const { words } = ctx;
  const used = new Set<number>();
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.punct) continue;
    const x = w.w;
    const p = words[i - 1];
    const nx = words[i + 1];
    if (ART.has(x) && w.pos === 'det') add(ctx, 'np.article', i, i);
    else if (POSS_SHORT.has(x) && w.pos === 'poss') add(ctx, 'np.possessive', i, i);
    else if (POSS_LONG.has(x)) add(ctx, 'np.possessive.stressed', i, i);
    else if (DEM.has(x) && (w.pos === 'dem' || w.pos === 'pron')) add(ctx, 'np.demonstrative', i, i);
    else if (INDEF.has(x)) add(ctx, 'np.indefinite', i, i);
    else if (QUANT.has(x) || x === 'muy') add(ctx, 'np.quantifier', i, i);
    else if (x === 'cada' || /^cualquiera?$/.test(x)) add(ctx, 'np.cada', i, i);
    else if (x === 'sino') add(ctx, 'conj.sino', i, i);
    else if (TONIC.has(x) || (['él', 'ella', 'ellos', 'ellas', 'usted', 'ustedes', 'nosotros'].includes(x) && p?.pos === 'prep' && p.w !== 'a')) add(ctx, 'pron.prep', p?.pos === 'prep' ? i - 1 : i, i);
    if (WH.has(x)) {
      const qStart = p && (p.w === '¿' || (p.pos === 'prep' && words[i - 2]?.w === '¿'));
      if (p && p.w === '¡' || (x === 'qué' && p?.w === '¡')) add(ctx, 'excl.que', i, i + 1);
      else if (qStart) add(ctx, p.pos === 'prep' ? 'q.wh.prep' : 'q.wh', p.pos === 'prep' ? i - 1 : i, i);
      else if (p && !p.punct && !insideQuestion(words, i)) add(ctx, 'q.indirect', i, i);
      else add(ctx, 'q.wh', i, i);
    }
    // lo + adjective: lo bueno, lo mejor
    if (x === 'lo' && w.pos === 'det' && nx && ['adj', 'x', 'part'].includes(nx.pos) || x === 'lo' && nx && ['mejor', 'peor', 'bueno', 'malo', 'importante', 'difícil', 'raro'].includes(nx.w)) add(ctx, 'np.lo-adj', i, i + 1);
    // hace + time (ago / for)
    if (x === 'hace' && nx && (nx.pos === 'num' || ['un', 'una', 'unos', 'unas', 'mucho', 'poco', 'muchos', 'pocos', 'varios', 'varias', 'dos', 'tres'].includes(nx.w))) {
      for (let j = i + 1; j <= i + 4 && j < words.length; j++) {
        if (TIME_N.has(words[j].w)) {
          const desde = p?.w === 'desde';
          const que = words[j + 1]?.w === 'que';
          add(ctx, desde || que ? 'time.hace-que' : 'time.hace', desde ? i - 1 : i, que ? j + 1 : j);
          break;
        }
      }
    }
    if (x === 'llevo' || x === 'lleva' || x === 'llevamos' || x === 'llevan' || x === 'llevas') {
      if (nx && (nx.pos === 'num' || ['un', 'una', 'mucho', 'poco', 'dos', 'tres', 'varios'].includes(nx.w)) && words.slice(i + 1, i + 4).some((y) => TIME_N.has(y.w))) add(ctx, 'time.hace-que', i, i + 2);
    }
    // -mente adverbs
    if (/mente$/.test(x) && x.length > 6 && w.pos !== 'verb') add(ctx, 'adv.mente', i, i);
    // diminutives: tintico, momentico, cafecito, ahorita
    const dim = x.match(/^(.+?)(c?it[oa]s?|c?ic[oa]s?)$/);
    if (dim && x.length > 5 && !lexEntry(x) && w.pos !== 'verb') {
      const b = dim[1];
      if ([b + 'o', b + 'a', b + 'e', b, b.replace(/qu$/, 'c') + 'o', b.replace(/gu$/, 'g') + 'o'].some((c) => lexEntry(c) || isKnownWord(c))) add(ctx, 'np.diminutive', i, i);
    }
    if (x === 'ahorita') add(ctx, 'np.diminutive', i, i);
    // prep + infinitive: antes de / después de / al / sin + inf
    if (w.pos === 'inf' && p && (p.w === 'al' || p.w === 'sin' || (p.w === 'de' && ['antes', 'después', 'luego'].includes(words[i - 2]?.w ?? '')))) add(ctx, 'nonfinite.prep-inf', p.w === 'de' ? i - 2 : i - 1, i);
    // haber + participle as an infinitive: después de haber firmado
    if (x === 'haber' && nx?.pos === 'part') add(ctx, 'nonfinite.perfect-inf', i, i + 1);
    // standalone gerund (not in a periphrasis): aprendí leyendo
    if (w.pos === 'ger' && !ctx.features.some((f) => f.key.startsWith('peri.') && f.span[1] === i)) add(ctx, 'nonfinite.gerund', i, i);
    // connectors
    if (!used.has(i)) {
      for (const [toks, key] of CONNECTORS) {
        if (toks.every((t, k) => words[i + k]?.w === t)) {
          for (let k = 0; k < toks.length; k++) used.add(i + k);
          add(ctx, key, i, i + toks.length - 1);
          break;
        }
      }
    }
    // lo + adj/adv + que: lo difícil que es
    if (x === 'lo' && nx && ['adj', 'x', 'adv', 'part'].includes(nx.pos) && words[i + 2]?.w === 'que') add(ctx, 'np.lo-que-intensity', i, i + 2);
    // agreement: an adjective in its feminine or plural form
    if (w.pos === 'adj' && w.lemma !== x) add(ctx, 'np.adj-agreement', i, i);
    // nada más + infinitive, a medida que
    if (x === 'nada' && nx?.w === 'más' && words[i + 2]?.pos === 'inf') add(ctx, 'conn.temporal-adv', i, i + 2);
    if (x === 'medida' && p?.w === 'a' && nx?.w === 'que') add(ctx, 'conn.temporal-adv', i - 1, i + 1);
    // cuanto más ... (más/menos)
    if (x === 'cuanto' && (nx?.w === 'más' || nx?.w === 'menos')) add(ctx, 'comp.cuanto-mas', i, i + 1);
    // general obligation: se debe + inf, uno tiene que, conviene
    if ((x === 'debe' && p?.w === 'se' && words[i + 1]?.pos === 'inf') || (x === 'uno' && nx?.w === 'tiene' && words[i + 2]?.w === 'que') || x === 'conviene') add(ctx, 'peri.impersonal-obligation', i, i);
    // de + haber + participle as a condition: de haberlo sabido
    if (x === 'de' && /^haber/.test(nx?.w ?? '') && words[i + 2]?.pos === 'part' && (!p || p.punct)) add(ctx, 'cond.de-haber', i, i + 2);
    // an infinitive as the subject: Cocinar para tanta gente no es fácil.
    if (w.pos === 'inf' && w.sentStart && words.slice(i + 1).some((y) => y.pos === 'verb' && !y.punct)) add(ctx, 'nonfinite.subject', i, i);
    // causal "como" at the head of a sentence: Como llovía, no salimos.
    if (x === 'como' && w.pos === 'conj' && (!p || p.punct) && words.slice(i + 1, i + 8).some((y) => y.w === ',')) add(ctx, 'conn.cause', i, i);
  }
}
const TONIC = S('mí ti conmigo contigo consigo');
/** Is token i inside an open ¿…? (a direct question: "¿Y tú qué opinas?") */
function insideQuestion(words: Word[], i: number): boolean {
  for (let j = i - 1; j >= 0; j--) { if (words[j].w === '¿') return true; if (words[j].w === '?' || /[.!]/.test(words[j].w)) return false; }
  return false;
}
const isKnownWord = (w: string) => !!lemmatize(w);

/* ---- lexemes ----------------------------------------------------------------- */
const CONTENT_POS = new Set(['noun', 'adj', 'adv', 'x', 'verb', 'inf', 'ger', 'part']);
function lexemePass(ctx: FeatureCtx): void {
  const { words } = ctx;
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!CONTENT_POS.has(w.pos) || w.aux || w.w === 'hay') continue;
    if (w.pos === 'x' && !w.known) continue;
    if (w.pos === 'adv' && !lexEntry(w.lemma) && !/mente$/.test(w.w)) continue;  // closed-class adverbs
    if (LEXEME_STOP.has(w.lemma)) continue;
    if (w.pos === 'verb' && w.lemma === 'haber') continue;
    let lemma = w.lemma;
    if (['verb', 'inf', 'ger', 'part'].includes(w.pos)) lemma = w.lemma;
    if (!lemma) continue;
    add(ctx, 'lex.' + lemma, i, i, { lemma });
  }
}

/* ---- unknown words ----------------------------------------------------------- */
function unknownPass(ctx: FeatureCtx): void {
  for (const w of ctx.words) {
    if (w.pos !== 'unknown' || w.known) continue;
    const inexact = analyzeToken(w.w).filter((a) => !a.accentExact);
    if (inexact.length) ctx.low.push(`accent? "${w.w}" (engine: ${[...new Set(inexact.map((a) => a.form))].slice(0, 3).join(' / ')})`);
    else ctx.low.push(`unknown word "${w.w}"`);
  }
}

export function detect(ctx: FeatureCtx): void {
  verbPass(ctx);
  pronounPass(ctx);
  clausePass(ctx);
  periphrasisPass(ctx);
  copulaPass(ctx);
  miscPass(ctx);
  npPass(ctx);
  lexemePass(ctx);
  unknownPass(ctx);
}
