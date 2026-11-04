/* ============================================================================
 * THE TRAPS: what a miss is called, and whether to say so.
 *
 * One module, two ways in. `diagnose` is for a sentence: it takes the plain
 * diagnosis (the first difference, located) and the two token lists behind it
 * and says which of four things the miss is (rules.ts): an Assert that names its
 * cause, an Ask that does not claim an error, a Note on a right answer, or Silent,
 * the location and nothing more. `wordHint` (check/wordhint.ts) and `itemCheck`
 * (ui/session/cards.ts) are for a gap, which has one typed word and the
 * sentence around it, and ask `gapTrap` for the same guards, since a word alone
 * cannot tell a mood from a mistake.
 *
 * What cannot be proved is not claimed: a mood or an aspect swap with nothing in
 * the sentence or its English to lock it is asked about, not asserted, and a
 * learner who was right says so with "mine says the same thing".
 * ========================================================================== */
import { deaccent } from '../../engine';
import { form } from '../support/reinflect';
import { low, nounGender, otherGender, pluralize, render, toToks, verbReadings, type Tok } from '../support/spanish';
import { align, type Diagnosis, type HintKind } from '../hints';
import { participleFor } from '../tense-swaps';
import { englishAspect, DETECTORS, EVENT_NOUN, RULES, ideaForm, namedKind, ruleOf, triggered, type Ctx, type Tier } from './rules';
import { pitfallFor } from './pitfalls';

export { RULES, ruleOf, type Rule, type Tier } from './rules';
export { pitfallFor, pitfallKey, pitfallNodes, registerPitfalls, type PitfallFile } from './pitfalls';

/** What the traps made of a miss. */
export interface Trap {
  tier: Tier;
  /** The rule that named the cause: set on an Assert and on nothing else, so anything that counts "you keep ..." counts these alone. */
  rule?: string;
  kind: HintKind;
  hint: string;
  /** the place in the right version the hint is about */
  at: number;
}

export interface TrapInput {
  /** the canonical tokens the learner wrote, and the closest accepted form's (the movable adverbials put back) */
  a: readonly string[];
  b: readonly string[];
  /** what the learner typed, for the pitfalls */
  input: string;
  en: string;
  /** the plain diagnosis of the same two lists */
  dg: Diagnosis;
  /** the nodes the card is about */
  nodes?: readonly string[];
}

const textOf = (id: string) => RULES.find((r) => r.id === id)!.text;
/** The question an Ask puts in place of a claim, by the kind of hint it replaces. */
const ASK_TEXT: Readonly<Record<string, string>> = {
  aspect: textOf('aspect-open'), mood: textOf('mood-open'), 'por-para': textOf('por-para-open'), 'ser-estar': 'We used the other one here: ser or estar?',
};

/** The lesson's own reason says the sentence is right, only not the best thing to say. */
const SOFT_PITFALL = /^(not wrong|it is understood|\S+ is correct but)/i;

/** A sentence that missed: Assert if a rule proves the cause, Ask if the hint would claim what the sentence cannot prove, Silent otherwise. */
export function diagnose(t: TrapInput): Trap {
  const { dg } = t;
  const known = pitfallFor(t.nodes, t.input);
  // a lesson that says "not wrong, just stiff" has not proved an error: it is said, and the learner may still say theirs means the same
  if (known && SOFT_PITFALL.test(known.why)) return { tier: 'ask', kind: 'pitfall', hint: known.why, at: dg.at };
  if (known) return { tier: 'assert', rule: 'pitfall', kind: 'pitfall', hint: known.why, at: dg.at };
  const ops = align(t.a, t.b);
  const edits = ops.filter((o) => o.op !== 'eq' && !(o.op === 'sub' && deaccent(o.a!) === deaccent(o.b!)));
  const ctx: Ctx = { a: t.a, b: t.b, ops, edits, dg, en: t.en.toLowerCase().replace(/[’‘]/g, "'") };
  // an answer that differs in three places or more is probably another sentence: it is located, not named
  for (const detect of edits.length > 2 ? [] : DETECTORS) {
    const hit = detect(ctx);
    if (hit) return { tier: 'assert', rule: hit.rule, kind: dg.kind, hint: hit.text ?? ruleOf(hit.rule)?.text ?? dg.hint, at: hit.at };
  }
  const named = edits.length > 2 ? undefined : namedKind(dg.kind, t);
  if (named) return { tier: 'assert', rule: named, kind: dg.kind, hint: dg.hint, at: dg.at };
  const ask = ASK_TEXT[dg.kind];
  if (ask) return { tier: 'ask', kind: dg.kind, hint: ask, at: dg.at };
  return { tier: 'silent', kind: dg.kind, hint: dg.hint, at: dg.at };
}

// ---- a gap: one word, and the sentence around it ----------------------------------------------------------------

export interface GapContext {
  /** the words of the gapped sentence before the gap, lowercase */
  before?: readonly string[];
  /** the English of the sentence */
  en?: string;
  /** the word the gap wants */
  answer: string;
}

export interface GapTrap { tier: Tier; rule?: string; kind: string; hint: string }

/**
 * The same four outcomes for a hint about one word. A mood is asserted only after an opener from the closed list, an aspect only when the
 * English locks it, and a copula or a por or para is asked about; a gap's other hints (the person, the tense, the shape of the verb) are
 * facts about the word and stay as they were.
 */
export function gapTrap(hint: { kind: string; hint: string } | undefined, ctx: GapContext): GapTrap | undefined {
  if (!hint) return undefined;
  const { kind } = hint;
  if (kind === 'mood') {
    const before = ctx.before ?? [];
    const answer = ctx.answer.toLowerCase();
    // the opener counts only when the gap wants the form it asks for: a gap whose answer says it is so has nothing to assert
    return ideaForm(answer) && triggered([...before, answer], before.length)
      ? { tier: 'assert', rule: 'mood-hard', kind, hint: textOf('mood-hard') }
      : { tier: 'ask', kind, hint: ASK_TEXT.mood };
  }
  if (kind === 'aspect') {
    const lock = englishAspect(ctx.en ?? '');
    const rs = verbReadings(ctx.answer.toLowerCase());
    // lamentamos is a present as well: last night's noise does not fix a verb that is not in the past
    const ans = rs.some((r) => r.tense === 'presente') ? undefined : rs.find((r) => r.tense === 'preterito' || r.tense === 'imperfecto')?.tense;
    return lock && ans === lock ? { tier: 'assert', rule: 'aspect-locked', kind, hint: textOf('aspect-locked') } : { tier: 'ask', kind, hint: ASK_TEXT.aspect };
  }
  if (kind === 'ser-estar' || kind === 'por-para') return { tier: 'ask', kind, hint: ASK_TEXT[kind] };
  return { tier: 'silent', kind, hint: hint.hint };
}

// ---- Note: right answers that carry a point -----------------------------------------------------------------------

export interface NoteVariant { es: string; rule: string }

/** Verbs that are made into a passive with ser in print and in speech both: se vendió la casa, la casa fue vendida. */
const PASSIVE_VERBS = new Set(['vender', 'construir', 'publicar', 'firmar', 'escribir', 'aprobar', 'fundar', 'descubrir', 'celebrar', 'resolver', 'arreglar', 'enviar', 'pagar', 'cobrar', 'prohibir', 'permitir']);
const SER_FORM = { presente: ['es', 'son'], preterito: ['fue', 'fueron'], imperfecto: ['era', 'eran'], futuro: ['será', 'serán'] } as const;
const DET = /^(el|la|los|las)$/;
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
/** What may stand right before the noun of a passive: nothing, a stop, or a word that opens a clause. After anything else the noun is not the subject of the verb ("en el café se vende pan", "el mantenimiento de la plaza se paga"). */
const OPENS_CLAUSE = /^(que|cuando|si|aunque|porque|pues|y|e|pero)$/;
/** What may follow the noun when it comes after the verb: if the phrase goes on (la vieja nevera, el apellido de Vale, las sillas viejas) the verb would land in the middle of it. */
const AFTER_PHRASE = /^(por|en|con|a|antes|después|hace|ayer|hoy|sin|durante)$/;

/** "La casa se vendió" or "Se vendió la casa" as "La casa fue vendida", or none. */
function passiveOf(ts: readonly Tok[]): string | null {
  const w = ts.map(low);
  for (let k = 0; k < w.length; k++) {
    const front = DET.test(w[k]) && w[k + 2] === 'se';
    const back = w[k] === 'se' && DET.test(w[k + 2] ?? '');
    if (!front && !back) continue;
    // one clause, in a row: no mark between the words that move
    if (ts.slice(k, k + 3).some((t) => t.post)) continue;
    // a statement or a yes-or-no question, opening its clause: "¿Dónde se firman los papeles?" keeps its verb in second place, and "no se pagó" needs its no moved too
    if (k > 0 && !ts[k - 1].post && !OPENS_CLAUSE.test(w[k - 1])) continue;
    if (back && w[k + 4] !== undefined && !ts[k + 3].post && !AFTER_PHRASE.test(w[k + 4])) continue;
    const [det, noun, verb] = front ? [w[k], w[k + 1], w[k + 3]] : [w[k + 2], w[k + 3], w[k + 1]];
    const reading = verbReadings(verb ?? '').find((r) => PASSIVE_VERBS.has(r.inf) && r.tense in SER_FORM && (r.person === 'él/ella' || r.person === 'ellos'));
    const plural = /^(los|las)$/.test(det);
    // el acta and el agua are feminine, and the article does not show it
    const gender = noun && !(det === 'el' && /^(a|á|ha|há)/.test(noun)) ? nounGender(noun, det) : null;
    if (!reading || !gender || (reading.person === 'ellos') !== plural) continue;
    const part = participleFor(reading.inf);
    const agreed = part && (gender === 'f' ? otherGender(part) : part);
    if (!agreed) continue;
    const tense = reading.tense as keyof typeof SER_FORM;
    const last = ts[k + 3];                                  // the verb (front) or the noun (back) ends the piece and carries its marks
    const lead = ts[k].core;
    const head = ts.slice(0, k).map((t) => ({ ...t }));
    const piece: Tok[] = [
      { pre: ts[k].pre, core: /^\p{Lu}/u.test(lead) ? cap(det) : det, post: '' }, { pre: '', core: noun!, post: '' },
      { pre: '', core: SER_FORM[tense][plural ? 1 : 0], post: '' }, { pre: '', core: plural ? pluralize(agreed) : agreed, post: last.post },
    ];
    return render([...head, ...piece, ...ts.slice(k + 4)]);
  }
  return null;
}

/** The other right forms of a model sentence that carry a Note: está en for es en at an event, the passive with ser for the one with se, and olvidé for se me olvidó. */
export function noteVariants(es: string): NoteVariant[] {
  const out: NoteVariant[] = [];
  const ts = toToks(es);
  const w = ts.map(low);
  // 37. La fiesta es en mi casa: está en is what people say
  const e = w.findIndex((x, k) => x === 'es' && w[k + 1] === 'en');
  // a place, and the event is what the sentence is about: "la boda es en diciembre" and "donde falla la obra es en el final" take no está
  const about = e > 0 && w.slice(0, e).some((x) => EVENT_NOUN.test(x)) && !w.slice(0, e).some((x) => x === 'lo' || x === 'donde');
  if (about && !/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|verano|invierno|primavera|otoño|serio|\d+|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|un|una|unos|unas|inglés|español|francés|línea)$/.test(w[e + 2] ?? '')) out.push({ es: render(ts.map((t, k) => (k === e ? { ...t, core: 'está' } : t))), rule: 'event-estar' });
  // 39. Se me olvidaron las llaves: Olvidé las llaves
  const s = w.findIndex((x, k) => x === 'se' && /^(me|te|nos)$/.test(w[k + 1] ?? '') && verbReadings(w[k + 2] ?? '').some((r) => r.inf === 'olvidar'));
  // olvidar wants what was forgotten after it, and a mí belongs with the se me: "pero olvidé" and "a mí olvidé" are not said
  const object = s >= 0 && !ts[s + 2].post && w[s + 3] !== undefined && /^(el|la|los|las|un|una|unos|unas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras|este|esta|ese|esa|lo|que|algo|todo|nada)$|(ar|er|ir)$/.test(w[s + 3]);
  if (s >= 0 && object && w[s - 1] !== 'mí' && w[s - 1] !== 'ti' && w[s - 1] !== 'nosotros' && w[s - 1] !== 'nosotras') {
    const person = ({ me: 'yo', te: 'tú', nos: 'nosotros' } as const)[w[s + 1] as 'me' | 'te' | 'nos'];
    const r = verbReadings(w[s + 2]).find((x) => x.inf === 'olvidar' && (x.tense === 'preterito' || x.tense === 'presente' || x.tense === 'imperfecto'));
    const mine = r ? form('olvidar', r.tense, person) : null;
    if (mine) {
      const lead = ts[s].core;
      const verb: Tok = { pre: ts[s].pre, core: /^\p{Lu}/u.test(lead) ? cap(mine) : mine, post: ts[s + 2].post };
      out.push({ es: render([...ts.slice(0, s), verb, ...ts.slice(s + 3)]), rule: 'se-me-optional' });
    }
  }
  // 38. La casa se vendió: La casa fue vendida
  const passive = passiveOf(ts);
  if (passive) out.push({ es: passive, rule: 'passive-calque' });
  return out;
}

/** The Assert hits in a log of attempts, by rule. Weak spots and every "you keep ..." read this and not the named slips, which include the Asks. */
export function assertHits(rows: ReadonlyArray<{ rule?: string; claimed?: true }>): Map<string, number> {
  const out = new Map<string, number>();
  // a claim is an answer the app could not tell about: its first try may have named a rule, and the claim was made about what came after
  for (const r of rows) if (r.rule && !r.claimed) out.set(r.rule, (out.get(r.rule) ?? 0) + 1);
  return out;
}
