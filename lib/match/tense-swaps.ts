/* ============================================================================
 * TWO TENSES FOR ONE THING, through the engine's own forms.
 *
 *  - the future and ir a: "Mañana te llamaré" and "Mañana te voy a llamar";
 *  - the preterite and the perfecto: "Ya comí" and "Ya he comido".
 *
 * Both are right Spanish, and both are what a card on the other one is NOT
 * asking for, so every form made here is a Swap (swaps.ts) and the matcher
 * says so when the card's target is the tense that was swapped out.
 *
 * What the English says decides whether the swap is the same sentence. A
 * future that guesses ("Estará en casa", "he's probably home") is not ir a;
 * "let's eat" is not a future; a perfecto that goes on until now ("I have
 * lived here for two years") is not a preterite, and a preterite with a past
 * time on it ("ayer comí") is not a perfecto. When the English does not rule
 * the swap in, there is none.
 * ========================================================================== */
import { PERSONS, participle, verbByInf } from '../engine';
import type { Person } from '../engine';
import { form, goingTo } from './support/reinflect';
import {
  enWords, finiteCandidates, insertTok, low, parseClause, participleOf, render, replaceCore, splitEnclitic, toToks, verbReadings,
  type Clause, type Tok,
} from './support/spanish';
import { changed, type Swap } from './swaps';

export interface Swapped { es: string; swap: Swap }

const PAST_TELLING: ReadonlySet<string> = new Set(['preterito', 'imperfecto', 'condicional', 'impsubj', 'impsubjse']);
const clone = (ts: readonly Tok[]): Tok[] => ts.map((t) => ({ ...t }));

/** The clause of every finite verb in a sentence, the first read with the English and the rest from their own endings. */
function clausesOf(es: string, en: string): Clause[] {
  const ts = toToks(es);
  return finiteCandidates(ts).flatMap((cand, n) => {
    const c = parseClause(es, n === 0 ? en : undefined, { allowMany: true, index: cand.index });
    return c ? [c] : [];
  });
}

// ---- the future and ir a --------------------------------------------------------------------

const EN_FUTURE = /\b(will|going to|shall)\b/;
/** A future that is a guess, an offer or a plan with a time: the English says it is not a bare "will happen". */
const EN_NOT_PLAIN_FUTURE = /\b(probably|must|might|may|maybe|perhaps|wonder|guess|suppose|bet|let us|about to|should)\b/;
const futureEnglish = (en: string): boolean => {
  const w = enWords(en).join(' ');
  return EN_FUTURE.test(w) && !EN_NOT_PLAIN_FUTURE.test(w);
};

/** The infinitive to put after ir a: a reflexive verb keeps its little word in front of ir. */
const bareInf = (inf: string) => inf.replace(/se$/, '');

function futureToIrA(c: Clause): string | null {
  if (c.choice.tense !== 'futuro' || c.participle >= 0) return null;
  const ir = form('ir', 'presente', c.choice.person);
  return ir ? render(replaceCore(c.toks, c.verb, `${ir} a ${bareInf(c.choice.inf)}`)) : null;
}

/** "Voy a llamarte" and "Te voy a llamar" both become "Te llamaré": the little words go in front of the future. */
function irAToFuture(c: Clause): string | null {
  if (c.choice.inf !== 'ir' || c.choice.tense !== 'presente' || c.reflexive || !goingTo(c)) return null;
  const after = c.toks[c.verb + 2];
  const split = splitEnclitic(low(after));
  if (split && c.proclitics.length) return null;
  const base = split ? split.base : low(after);
  const fut = form(base, 'futuro', c.choice.person) ?? (verbByInf(base) ? null : form(`${base}se`, 'futuro', c.choice.person));
  if (!fut) return null;
  let ts = clone(c.toks);
  ts[c.verb] = { ...ts[c.verb], post: after.post };
  ts = replaceCore(ts, c.verb, fut);
  ts.splice(c.verb + 1, 2);
  // the little words go in front of the verb, and a ¿ or a capital that opened it opens them
  const clitics = split?.clitics ?? [];
  if (clitics.length) {
    const { pre, core } = ts[c.verb];
    const capital = /^\p{Lu}/u.test(core);
    ts[c.verb] = { ...ts[c.verb], pre: '', core: capital ? core[0].toLowerCase() + core.slice(1) : core };
    clitics.forEach((cl, k) => { ts = insertTok(ts, c.verb + k, cl); });
    const lead = ts[c.verb];
    ts[c.verb] = { ...lead, pre: pre + lead.pre, core: capital ? lead.core[0].toUpperCase() + lead.core.slice(1) : lead.core };
  }
  return render(ts);
}

export function futureVariants(es: string, en: string): Swapped[] {
  if (!futureEnglish(en)) return [];
  const out: Swapped[] = [];
  for (const c of clausesOf(es, en)) {
    for (const to of [futureToIrA(c), irAToFuture(c)]) {
      if (to) out.push({ es: to, swap: { kind: 'future-ir-a', ...changed(es, to) } });
    }
  }
  // a sentence that says it twice ("No será fácil, pero lo haremos") is also said the same way twice
  for (const swap of [futureToIrA, irAToFuture]) {
    let now = es, n = 0;
    const steps: Array<{ from: string; to: string }> = [];
    for (let again = true; again && n < 3; n++) {
      again = false;
      for (const c of clausesOf(now, en)) {
        const to = swap(c);
        if (to) { steps.push(changed(now, to)); now = to; again = true; break; }
      }
    }
    if (steps.length > 1 && !out.some((o) => o.es === now)) {
      out.push({ es: now, swap: { kind: 'future-ir-a', from: steps.map((x) => x.from).join(', '), to: steps.map((x) => x.to).join(', ') } });
    }
  }
  return out;
}

// ---- the preterite and the perfecto ----------------------------------------------------------

/** Time words that put the event in the past and apart from now: with them the perfecto is not what is said. */
const PAST_APART = /^(ayer|anoche|anteayer|antier|pasado|pasada|pasados|pasadas|hace|cuando|entonces|luego|después|antes|primero|finalmente|mientras|siempre|niño|niña|pequeño|pequeña|lunes|martes|miércoles|jueves|viernes|sábado|domingo|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|aquel|aquella|aquellos|aquellas)$/;
/** "esa noche", "ese día": a time that is over. */
const THAT_TIME = /^(esa|ese|esos|esas)$/;
const A_TIME = /^(noche|día|tarde|mañana|vez|semana|mes|año|verano|invierno|época|tiempo|momento|días|noches|años|meses)$/;
/** Verbs whose perfecto goes on until now ("he vivido aquí"): the preterite says it is over. */
const CONTINUING = /^(ser|estar|tener|vivir|trabajar|llevar|quedar|quedarse|seguir|estudiar|esperar|durar|permanecer|haber|saber|conocer|querer|crecer|aprender)$/;
/** Words that bring the event up to now: with them the perfecto and the preterite are both said. */
const UP_TO_NOW = /^(hoy|ya|todavía|aún|últimamente|recientemente)$/;
/** Words that say it never happened up to now: they let a perfecto become a preterite ("nunca he estado", "nunca estuve"), and are no reason to make a preterite a perfecto ("nunca volvimos a hablar"). */
const NEVER = /^(nunca|jamás)$/;
const THIS_PERIOD = /^(esta|este)$/;
const PARTICIPLE = '(?:been|gone|done|seen|eaten|taken|given|known|written|spoken|made|had|heard|said|told|found|met|bought|brought|thought|left|lost|paid|read|sent|sold|felt|kept|run|come|begun|broken|chosen|driven|fallen|forgotten|shown|thrown|won|put|set|cut|[a-z]+ed)';
/** "have" or "has" with a participle after it, said of someone: not "would have", and not "have lunch". */
const EN_PERFECT = new RegExp(`(?<!(?:would|could|should|might|must|may|to|not|n't) )\\b(?:have|has)(?: not)?(?: [a-z]+)?(?: (?:already|just|never|ever|yet|finally))? ${PARTICIPLE}\\b`);
/** A perfect that goes on until now, or an event with an end that the English dates: the other tense would say something else. */
const EN_CONTINUES = /\b(for|since|lately|recently|so far|these days|always|still|all (day|week|month|year|my life)|used to|while|when)\b/;

/** Is the English or the Spanish of this sentence one where the perfecto and the preterite say the same? The Spanish brings the event up to now in words next to the verb, or the English has "have" and a participle. */
function sameEvent(toks: readonly Tok[], en: string, verb: number, toPerfecto: boolean): boolean {
  const e = enWords(en).join(' ');
  if (EN_CONTINUES.test(e) || /\b(yesterday|last|ago|then|before|after)\b/.test(e)) return false;
  const ws = toks.map((t) => low(t));
  if (ws.some((w, i) => PAST_APART.test(w) || /^(19|20)\d\d$/.test(w) || (w === 'a' && ws[i + 1] === 'las') || (THAT_TIME.test(w) && A_TIME.test(ws[i + 1] ?? '')))) return false;
  // next to the verb, with no comma between: "Ya comí", "Hoy me pesé", "Esta mañana encontró"
  const verbs = finiteCandidates(toks).map((c) => c.index);
  const near = ws.some((w, i) => {
    if (Math.abs(i - verb) > 3 || (i < verb ? toks.slice(i, verb).some((t) => /[,;:]/.test(t.post)) : toks.slice(verb, i).some((t) => /[,;:]/.test(t.post)))) return false;
    // "Los que conocieron a Joaquín ya son mayores": a word in front of another verb is that verb's
    if (i > verb && verbs.some((v) => v > verb && v <= i + 1)) return false;
    return UP_TO_NOW.test(w) || (w === 'alguna' && ws[i + 1] === 'vez') || (!toPerfecto && NEVER.test(w)) || (THIS_PERIOD.test(w) && /^(mañana|tarde|noche|semana|mes|año|momento)$/.test(ws[i + 1] ?? ''));
  });
  return near || EN_PERFECT.test(e);
}

/** The participle of a verb the engine knows, as it is spelled. */
export function participleFor(inf: string): string | null {
  const v = verbByInf(inf) ?? verbByInf(bareInf(inf)) ?? verbByInf(`${inf}se`);
  try { return v ? participle(v) : null; } catch { return null; }
}

function preteriteToPerfecto(c: Clause): string | null {
  if (c.choice.tense !== 'preterito' || c.participle >= 0 || c.choice.inf === 'haber') return null;
  // fui is ser and ir: the participle would be a guess
  if (new Set(verbReadings(low(c.toks[c.verb])).filter((a) => a.tense === 'preterito').map((a) => bareInf(a.inf))).size > 1) return null;
  const he = form('haber', 'presente', c.choice.person);
  const part = participleFor(c.choice.inf);
  return he && part ? render(replaceCore(c.toks, c.verb, `${he} ${part}`)) : null;
}

/** "Nunca he estado" is something that never happened, and "nunca estuve" says it as well: the verb may be one that goes on. */
const neverNear = (toks: readonly Tok[], verb: number) => toks.some((t, i) => NEVER.test(low(t)) && Math.abs(i - verb) <= 3);

function perfectoToPreterite(c: Clause): string | null {
  if (c.choice.inf !== 'haber' || c.choice.tense !== 'presente' || c.participle !== c.verb + 1) return null;
  const inf = participleOf(low(c.toks[c.participle]));
  const pret = inf && (!CONTINUING.test(bareInf(inf)) || neverNear(c.toks, c.verb)) ? form(inf, 'preterito', c.choice.person) : null;
  if (!pret) return null;
  let ts = clone(c.toks);
  ts[c.verb] = { ...ts[c.verb], post: ts[c.participle].post };
  ts = replaceCore(ts, c.verb, pret);
  ts.splice(c.participle, 1);
  return render(ts);
}

export function perfectoVariants(es: string, en: string): Swapped[] {
  const toks = toToks(es);
  // a story, however short: two verbs that tell what happened, how things were, or what would be. "Dijo que manejaría" is not a perfecto either
  if (finiteCandidates(toks).filter((c) => c.analyses.some((a) => PAST_TELLING.has(a.tense))).length > 1) return [];
  // "debí haberle dicho": a perfect already there, and a modal that would make two
  if (toks.some((t) => /^haber(se|me|te|lo|la|le|nos|los|las|les)*$/.test(low(t)) || splitEnclitic(low(t))?.base === 'haber')) return [];
  const out: Swapped[] = [];
  for (const c of clausesOf(es, en)) {
    const toPerfecto = preteriteToPerfecto(c);
    const toPreterite = perfectoToPreterite(c);
    if (toPerfecto && sameEvent(toks, en, c.verb, true)) out.push({ es: toPerfecto, swap: { kind: 'pret-perfecto', ...changed(es, toPerfecto) } });
    if (toPreterite && sameEvent(toks, en, c.verb, false)) out.push({ es: toPreterite, swap: { kind: 'pret-perfecto', ...changed(es, toPreterite) } });
  }
  return out;
}

// ---- ser and estar with an adjective that takes either ------------------------------------------------------------

/** Adjectives that take both: es feliz is how she is, está feliz how she seems today. Seguro is not here (safe, sure), nor joven, nor tranquilo: "estoy tranquilo" is how I feel, and "soy tranquilo" another sentence. */
const OPEN_ADJECTIVE = /^(feliz|felices|casad[oa]s?|solter[oa]s?)$/;
/** A word that ties the sentence to a moment or a place: "hoy está feliz", "estamos felices aquí". There the copula is chosen, and the other one wrong. */
const NOW_WORD = /^(hoy|ahora|ya|aquí|acá|ahí|allí|allá|mañana|anoche|ayer|cuando|mientras|porque|pero)$/;
const INTENSIFIER = /^(muy|tan|bastante|demasiado|realmente|súper)$/;

/** "Es feliz" and "Está feliz": the other copula, for an adjective that takes either. Rejecting the one the card did not use is the error. */
export function copulaVariants(es: string): Swapped[] {
  const ts = toToks(es);
  const out: Swapped[] = [];
  ts.forEach((tok, i) => {
    const readings = verbReadings(low(tok)).filter((r) => (r.inf === 'ser' || r.inf === 'estar') && ['presente', 'imperfecto', 'futuro'].includes(r.tense));
    if (!readings.length) return;
    const k = INTENSIFIER.test(low(ts[i + 1])) ? i + 2 : i + 1;
    if (!OPEN_ADJECTIVE.test(low(ts[k]))) return;
    // the adjective ends its clause: "estamos felices de verte" and "está casada con Tomás" go with their copula
    if (k < ts.length - 1 && !ts[k].post) return;
    if (ts.some((t) => NOW_WORD.test(low(t)))) return;
    const made = new Set<string>();
    for (const r of readings) {
      const f = PERSONS.includes(r.person as Person) ? form(r.inf === 'ser' ? 'estar' : 'ser', r.tense, r.person as Person) : null;
      if (f && f !== low(tok)) made.add(render(replaceCore(ts, i, f)));
    }
    for (const to of made) out.push({ es: to, swap: { kind: 'copula', ...changed(es, to) } });
  });
  return out;
}
