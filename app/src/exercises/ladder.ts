/* ============================================================================
 * GENERATOR 2 — THE CONTROLLED OUTPUT LADDER: choose → type → transform.
 *
 * THE AMBIGUITY CHECK. A gap is only fair if exactly one form fits it. The
 * old app's worst cards were gaps with several right answers, marked wrong
 * on a schedule (lessons.js ambiguousOpener: Allí / Ahí / Allá). Here, for a
 * verb gap, every form of the same lemma in every production tense and
 * person is tested against what the item shows the learner:
 *   - the Spanish around the gap (a subject pronoun, a noun subject, a time
 *     word such as ayer or mañana, a habit word such as siempre);
 *   - the English meaning (I / we / they; "will", "used to", "-ing");
 *   - the cue in brackets.
 * A form survives if nothing shown rules it out. If more than one form
 * survives, the cue is narrowed once (adding the person, when "you" is the
 * only doubt); if that does not leave exactly one, the item is DROPPED.
 *
 * Examples it drops: "___ el libro (comprar)" for "I bought the book"
 * (compraba is not ruled out — nothing pins finished vs habitual); "Mañana
 * ___ a Quito (viajar)" for "Tomorrow I'll travel" (viajo is right too).
 *
 * A dialogue row is laddered one turn at a time (dialogue.ts): the gap sits
 * in one turn, the turns before it are shown above it, and a transform
 * rewrites that turn alone.
 * ========================================================================== */
import type { BankSentence } from '../content/schema';
import { PERSONS, PRODUCTION_PERSONS, verbByInf } from '../engine';
import type { Person, TenseKey } from '../engine';
import { conjugateBareCells } from '../engine/conjugate';
import { isMultiTurn, turnViews, withContext } from './dialogue';
import { fixedInTime, opening, opensClean, refusal, tenseOf } from './licence';
import { itemId, rng, shuffle, shuffled } from './rng';
import { changePerson, changeTense, form, goingTo, negate, pronominalise } from './reinflect';
import {
  SUBJECT_PRONOUNS, enSubject, enWords, low, parseClause, render, replaceCore, sentenceKey, toToks,
  timeSpans, verbReadings, type Clause, type Tok,
} from './spanish';
import type { ChooseItem, TransformItem, TypeFormItem } from './types';

export interface LadderOptions {
  seed?: number | string;
  maxDistractors?: number;
  /** The tenses the learner has been taught: a distractor or a transform is never in a tense outside this list (default: all). */
  taught?: readonly TenseKey[];
  /** The names in the bank (licence.ts namesOf): a sentence that opens on a capital word that is neither one of these nor a plain word is not given a time word. */
  names?: ReadonlySet<string>;
  /** The node practised: the gap falls on the row's focus span only when the row targets it. */
  node?: string;
}

const LADDER_TENSES: readonly TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional'];
const PUNCTUAL = /\b(ayer|anoche|anteayer|pasad[oa]|una vez|de repente|hace)\b/;
const HABITUAL = /\b(siempre|todos los días|cada|de niño|de niña|a menudo|normalmente|antes|a veces|generalmente)\b/;
const FUTURE_WORDS = /\b(mañana|que viene|próxim[oa]|pronto|luego|esta noche)\b/;

/** Every target spelling of one bare cell (the form + its pre-2010 spelling). */
export function bareAccepted(inf: string, tense: TenseKey, person: Person): string[] {
  const v = verbByInf(inf);
  if (!v) return [];
  const cell = conjugateBareCells(v, tense)[PERSONS.indexOf(person)];
  return cell ? [cell.form, ...(cell.legacy ? [cell.legacy] : [])] : [];
}

/** Tenses the item leaves open for the gap. */
function openTenses(c: Clause, en: string): TenseKey[] {
  const es = c.toks.map(low).join(' ');
  const ew = ' ' + enWords(en).join(' ') + ' ';
  const ePast = / (did|was|were) | used to | yesterday | ago | last /.test(ew) || /\b\w+ed\b/.test(ew);
  switch (c.choice.tense) {
    case 'presente':
      return FUTURE_WORDS.test(es) ? ['presente', 'futuro'] : ['presente'];
    case 'preterito':
      return PUNCTUAL.test(es) || / (yesterday|ago|last|once) /.test(ew) ? ['preterito'] : ['preterito', 'imperfecto'];
    case 'imperfecto':
      return / used to | (was|were) \w+ing /.test(ew) || HABITUAL.test(es) ? ['imperfecto'] : ['imperfecto', 'preterito'];
    case 'futuro':
      return / will /.test(ew) && !FUTURE_WORDS.test(es) ? ['futuro'] : ['futuro', 'presente'];
    case 'condicional':
      return / would (like|love|prefer|you) | i'd /.test(ew) ? ['condicional'] : ['condicional', 'imperfecto'];
    default:
      return ePast ? [c.choice.tense, 'preterito'] : [c.choice.tense, 'presente'];
  }
}

/** Persons the item leaves open, before any person cue. */
function openPersons(c: Clause, en: string): Person[] {
  if (c.subject >= 0) return [SUBJECT_PRONOUNS[low(c.toks[c.subject])]];
  const sub = enSubject(en);
  if (sub) return sub.persons;
  // a noun subject: third person, number from its determiner
  const before = c.toks.slice(0, c.groupStart).map(low);
  if (before.some((w) => /^(los|las|unos|unas|mis|tus|sus|estos|estas|esos|esas)$/.test(w))) return ['ellos'];
  if (before.some((w) => /^(el|la|un|una|mi|tu|su|este|esta|ese|esa)$/.test(w))) return ['él/ella'];
  // a single capitalised name: Juan come, Ana trabaja
  if (before.length === 1 && /^[A-ZÁÉÍÓÚÑ]/.test(c.toks[0].core) && !/^(Yo|Tú|Él|Ella|Usted)$/.test(c.toks[0].core)) return ['él/ella'];
  return ['él/ella', 'ellos'];
}

const CUE_PERSON: Readonly<Record<Person, string>> = { yo: 'yo', 'tú': 'tú', 'él/ella': 'usted', nosotros: 'nosotros', vosotros: 'vosotros', ellos: 'ustedes' };

export interface GapAnalysis {
  /** The parsed clause of a verb gap; absent when the gap is a particle taken from the focus span. */
  clause?: Clause;
  /** The sentence with the gap in it. */
  gapped: string;
  /** What the item id is keyed on: "inf:tense:person" of a verb, the word of a particle. */
  key: string;
  /** Distractors that are the nearest misses, when the gap knows which. */
  near?: string[];
  /** The cue shown in brackets: "(comer)" or "(comer, tú)". */
  cue: string;
  /** The single form that fits, and every spelling of it that passes. */
  answer: string;
  accept: string[];
  /** Forms of the same lemma the item rules OUT — safe distractors. */
  wrong: string[];
}

/* ---- the taught feature: a gap falls where the row's focus span is ------------------------------
 * The bank row carries the characters the taught feature sits on (focus). A verb gap is only on
 * target when the verb is inside it; otherwise the span is searched for a word of a small family
 * table. The verb's distractors come from the engine; these come from the tables. */
const POR_PARA = ['por', 'para', 'a', 'en', 'de', 'con'];
const RELATIVES = ['que', 'quien', 'quienes', 'donde', 'cuando', 'como', 'cual'];
const ARTICLE_SETS: readonly (readonly string[])[] = [['el', 'la', 'los', 'las'], ['un', 'una', 'unos', 'unas']];
const CLITIC_SETS: readonly (readonly string[])[] = [['me', 'te', 'se', 'nos'], ['lo', 'la', 'los', 'las'], ['le', 'les', 'se']];
const FAMILIES: ReadonlyArray<{ id: string; words: readonly string[]; options: (w: string) => string[] }> = [
  { id: 'porpara', words: ['por', 'para'], options: () => POR_PARA },
  { id: 'relative', words: RELATIVES, options: () => RELATIVES },
  { id: 'article', words: ARTICLE_SETS.flat(), options: (w) => [...ARTICLE_SETS.find((x) => x.includes(w))!, ...ARTICLE_SETS.flat()] },
  { id: 'clitic', words: CLITIC_SETS.flat(), options: (w) => [...CLITIC_SETS.filter((x) => x.includes(w)).flat(), ...CLITIC_SETS.flat()] },
];
const CLITIC_NODE = /pronoun|object|clitic/;

/** The focus span a gap must fall in, or null when the sentence names none for this node: no span on
 *  the row, or a node the row does not target (a new-word gap is about the word, not the grammar). */
function focusOf(s: BankSentence, node?: string): [number, number] | null {
  if (!s.focus || (node !== undefined && !s.targets.includes(node))) return null;
  return s.focus[1] <= s.es.length ? s.focus : null;
}

/** Character offset of each token of `s.es`, found in order. */
function tokenOffsets(es: string, ts: readonly Tok[]): number[] {
  const out: number[] = [];
  let at = 0;
  for (const t of ts) {
    const k = es.indexOf(t.core, at);
    out.push(k);
    if (k >= 0) at = k + t.core.length;
  }
  return out;
}

/** A gap on the one family word inside the focus span. Null unless exactly one word there belongs to a family. */
function particleGap(s: BankSentence, span: [number, number], nodes: readonly string[]): GapAnalysis | null {
  const ts = toToks(s.es);
  const offs = tokenOffsets(s.es, ts);
  const hits = ts.map((t, i) => (offs[i] >= span[0] && offs[i] + t.core.length <= span[1] && FAMILIES.some((f) => f.words.includes(low(t))) ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) return null;
  const i = hits[0];
  const w = low(ts[i]);
  const clitic = nodes.some((n) => CLITIC_NODE.test(n));
  const fams = FAMILIES.filter((f) => f.words.includes(w));
  const fam = (clitic && fams.find((f) => f.id === 'clitic')) || fams[0];
  const wrong = [...new Set(fam.options(w))].filter((x) => x !== w);
  return {
    gapped: render(replaceCore(ts, i, '___')), key: w, cue: '', answer: w, accept: [w], wrong, near: wrong.slice(0, 3),
  };
}

/** Can this sentence's taught feature be gapped with exactly one right answer? The verb, when the
 *  row's focus span holds it (or names none); otherwise a word of the focus from the family tables.
 *  `node`: the node practised; a row that does not target it has no focus for it. */
export function analyseGap(s: BankSentence, taught?: readonly TenseKey[], node?: string): GapAnalysis | null {
  if (isMultiTurn(s)) return null;                       // one turn at a time: see gapTurn
  const span = focusOf(s, node);
  const v = verbGap(s, taught, span);
  if (v || !span) return v;
  return particleGap(s, span, node ? [node, ...s.targets] : s.targets);
}

function verbGap(s: BankSentence, taught: readonly TenseKey[] | undefined, span: [number, number] | null): GapAnalysis | null {
  const c = parseClause(s.es, s.en);
  if (!c || c.participle >= 0) return null;
  if (span) {                                           // the verb must sit inside the taught feature
    const at = tokenOffsets(s.es, c.toks)[c.verb];
    if (at < span[0] || at + c.toks[c.verb].core.length > span[1]) return null;
  }
  const { inf, tense, person } = c.choice;
  if (!LADDER_TENSES.includes(tense)) return null;
  const dict = inf;
  const tenses = openTenses(c, s.en);
  let persons: Person[] = openPersons(c, s.en).filter((p) => p !== 'vosotros');
  const fits = (ps: Person[]) => {
    const set = new Set<string>();
    for (const t of tenses) for (const p of ps) { const f = form(inf, t, p); if (f) set.add(f); }
    return set;
  };
  let open = fits(persons);
  const right = form(inf, tense, person);
  if (!right || !open.has(right)) return null;
  let cue = `(${dict})`;
  // narrow once, and only for English "you" (tú / usted / ustedes): a cue
  // never invents a person the sentence does not have
  if (open.size > 1 && persons.length > 1 && persons.includes(person) && enSubject(s.en)?.pronoun === 'you') {
    persons = [person];
    cue = `(${dict}, ${CUE_PERSON[person]})`;
    open = fits(persons);
  }
  if (open.size !== 1) return null;                     // more than one valid answer: drop
  // distractors: other cells of the lemma that the item rules out
  const wrong = new Set<string>();
  for (const t of LADDER_TENSES) for (const p of PRODUCTION_PERSONS) {
    if (taught && !taught.includes(t)) continue;      // never show a form the learner has not been taught
    const f = form(inf, t, p);
    if (f && !open.has(f) && !verbReadings(f).some((a) => tenses.includes(a.tense) && persons.includes(a.person as Person))) wrong.add(f);
  }
  return { clause: c, gapped: gapped(c), key: `${inf}:${tense}:${person}`, cue, answer: right, accept: bareAccepted(inf, tense, person), wrong: [...wrong] };
}

function gapped(c: Clause): string {
  return render(replaceCore(c.toks, c.verb, '___'));
}

/** The first turn of a row (the reply first) whose verb gaps fairly, with
 *  the turns before it as context. A one-turn row is its own turn. */
export function gapTurn(row: BankSentence, taught?: readonly TenseKey[], node?: string): { g: GapAnalysis; s: BankSentence; context: string } | null {
  // the turn that holds the taught feature first, then the others
  const views = turnViews(row);
  // a dialogue row with a focus span is gapped only in the turn that holds it
  const held = views.filter((x) => x.sentence.focus !== undefined);
  for (const v of row.focus && isMultiTurn(row) ? held : views) {
    const g = analyseGap(v.sentence, taught, node);
    if (g) return { g, s: v.sentence, context: v.context };
  }
  return null;
}

/** Ladder step 1: choose the form. */
export function chooseItem(row: BankSentence, opts: LadderOptions = {}): ChooseItem | null {
  const t = gapTurn(row, opts.taught, opts.node);
  if (!t) return null;
  const { g, s, context } = t;
  const r = rng(`${opts.seed ?? 0}|${s.id}|choose`);
  // prefer near misses: same tense other person, same person other tense
  const ch = g.clause?.choice;
  const near = g.near ?? g.wrong.filter((f) => verbReadings(f).some((a) => a.tense === ch?.tense || a.person === ch?.person));
  const pool = near.length >= (opts.maxDistractors ?? 3) ? near : g.wrong;
  const ds = shuffle(pool, r).slice(0, opts.maxDistractors ?? 3);
  // with a taught list the near misses are person-only until more tenses are licensed: two at least, or no item
  if (ds.length < (opts.taught ? Math.min(2, opts.maxDistractors ?? 3) : 1)) return null;
  const { options, answer } = shuffled(g.answer, ds, r);
  return {
    id: itemId('ladder', s.id, `choose:${g.key}`), generator: 'ladder', sentenceId: s.id, nodes: [...s.targets],
    kind: 'choose', gapped: withContext(context, g.gapped), en: s.en, cue: g.cue, options, answer,
  };
}

/** Ladder step 2: type the form. */
export function typeFormItem(row: BankSentence, node?: string): TypeFormItem | null {
  const t = gapTurn(row, undefined, node);
  if (!t) return null;
  const { g, s, context } = t;
  return {
    id: itemId('ladder', s.id, `type:${g.key}`), generator: 'ladder', sentenceId: s.id, nodes: [...s.targets],
    kind: 'typeForm', gapped: withContext(context, g.gapped), en: s.en, cue: g.cue, answer: g.answer, accept: g.accept,
  };
}

/** States: their past is "how it used to be" (imperfect), never "yesterday". */
const STATIVE = new Set(['ser', 'estar', 'tener', 'saber', 'conocer', 'querer', 'poder', 'necesitar', 'vivir', 'creer', 'existir', 'haber', 'deber', 'parecer', 'llamarse']);

const PERSON_INSTRUCTION: Readonly<Record<Person, string>> = {
  yo: 'Say it about yourself (yo).', 'tú': 'Say it to a friend (tú).', 'él/ella': 'Say it about one other person (él / ella).',
  nosotros: 'Say it about us (nosotros).', vosotros: '', ellos: 'Say it about them (ellos / ellas).',
};

function transform(s: BankSentence, key: string, instruction: string, op: TransformItem['transform'], answer: string, accept: string[]): TransformItem | null {
  if (sentenceKey(answer) === sentenceKey(s.es)) return null;
  return {
    id: itemId('ladder', s.id, `transform:${key}`), generator: 'ladder', sentenceId: s.id, nodes: [...s.targets],
    kind: 'transform', source: s.es, instruction, transform: op, answer, accept: accept.filter((a) => sentenceKey(a) !== sentenceKey(answer)),
  };
}

/** Ladder step 3: every transform the sentence supports (for a dialogue
 *  row, of the first turn, reply first, that supports any). With `taught`
 *  no transform asks for a tense outside the list. */
export function transformItems(row: BankSentence, opts: Pick<LadderOptions, 'taught' | 'names'> = {}): TransformItem[] {
  for (const v of turnViews(row)) {
    const out = transformsOf(v.sentence, opts);
    if (out.length) return out;
  }
  return [];
}

/** A time word in front of a clause. The clause's own first word loses its capital when it only had one for opening the sentence. */
function opened(toks: readonly Tok[], word: string, lower: boolean): string {
  const out = toks.map((t) => ({ ...t }));
  const first = out[0];
  const lead: Tok = { pre: first.pre, core: word, post: '' };
  first.pre = '';
  if (lower) first.core = first.core[0].toLowerCase() + first.core.slice(1);
  return render([lead, ...out]);
}

function transformsOf(s: BankSentence, { taught, names }: Pick<LadderOptions, 'taught' | 'names'>): TransformItem[] {
  const c = parseClause(s.es, s.en);
  // only a clause the engine has understood completely, in a tense the learner has met (licence.ts)
  if (!c || refusal(c, s.en) || (taught && !taught.includes(tenseOf(c)))) return [];
  const taughtIn = (t: TenseKey) => !taught || taught.includes(t);
  const lead = opening(c, names);
  const out: Array<TransformItem | null> = [];
  for (const p of PRODUCTION_PERSONS) {
    if (p === c.choice.person) continue;
    const r = changePerson(c, p, { en: s.en });
    if (r) out.push(transform(s, `person:${p}`, PERSON_INSTRUCTION[p], { op: 'person', to: p }, r.es, []));
  }
  // Tense transforms: not on questions ("¿Ayer dónde viviste?"), not behind a
  // greeting or a remark ("Antes Perdón, era de Cali"), not beside a word for
  // how often ("Ayer raras veces…") and, for states (tener, ser, saber…), only
  // to "how it used to be" — "Ayer tuve dos hermanos" is grammatical and
  // nonsense.
  if (lead && !timeSpans(c.toks).length && c.participle < 0 && !/[?¡]/.test(s.es) && opensClean(c) && !fixedInTime(s.es)) {
    const copula = STATIVE.has(c.choice.inf);
    const lower = lead === 'lower';
    if (c.choice.tense === 'presente') {
      const pastTense: TenseKey = copula ? 'imperfecto' : 'preterito';
      const word = copula ? 'Antes' : 'Ayer';
      const past = taughtIn(pastTense) ? changeTense(c, pastTense) : null;
      if (past) {
        out.push(transform(s, `tense:${pastTense}`, copula ? 'Say it was like this before: start with "Antes".' : 'Say it happened yesterday: start with "Ayer".', { op: 'tense', to: pastTense }, opened(past.toks, word, lower), []));
      }
      // "voy a ir" has no future of its own
      const fut = copula || !taughtIn('futuro') || goingTo(c) ? null : changeTense(c, 'futuro');
      if (fut) {
        const accept = [opened(c.toks, 'Mañana', lower)];
        const ir = form('ir', 'presente', c.choice.person);
        if (ir && !c.reflexive && !/se$/.test(c.choice.inf) && c.complement < 0) {
          const t2 = replaceCore(c.toks, c.verb, `${ir} a ${c.choice.inf}`);
          accept.push(opened(t2, 'Mañana', lower));
        }
        out.push(transform(s, 'tense:futuro', 'Say it will happen: start with "Mañana".', { op: 'tense', to: 'futuro' }, opened(fut.toks, 'Mañana', lower), accept));
      }
    }
  }
  const neg = negate(c);
  if (neg) out.push(transform(s, 'negate', 'Make it negative.', { op: 'negate' }, neg.es, []));
  const pr = pronominalise(c);
  if (pr) out.push(transform(s, 'pronoun', `Replace "${pr.np}" with a pronoun.`, { op: 'pronoun', np: pr.np }, pr.es, pr.accept));
  return out.filter((x): x is TransformItem => !!x);
}

/** The whole ladder for one sentence, in order: choose, type, transform. */
export function ladder(s: BankSentence, opts: LadderOptions = {}): Array<ChooseItem | TypeFormItem | TransformItem> {
  const out: Array<ChooseItem | TypeFormItem | TransformItem> = [];
  const ch = chooseItem(s, opts);
  if (ch) out.push(ch);
  const ty = typeFormItem(s, opts.node);
  if (ty) out.push(ty);
  out.push(...transformItems(s, opts));
  return out;
}
