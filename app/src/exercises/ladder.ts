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
 * ========================================================================== */
import type { BankSentence } from '../content/schema';
import { PERSONS, PRODUCTION_PERSONS, verbByInf } from '../engine';
import type { Person, TenseKey } from '../engine';
import { conjugateBareCells } from '../engine/conjugate';
import { itemId, rng, shuffle, shuffled } from './rng';
import { changePerson, changeTense, form, negate, pronominalise } from './reinflect';
import {
  SUBJECT_PRONOUNS, enSubject, enWords, insertTok, low, parseClause, render, replaceCore, sentenceKey,
  timeSpans, verbReadings, type Clause,
} from './spanish';
import type { ChooseItem, TransformItem, TypeFormItem } from './types';

export interface LadderOptions { seed?: number | string; maxDistractors?: number }

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
  clause: Clause;
  /** The cue shown in brackets: "(comer)" or "(comer, tú)". */
  cue: string;
  /** The single form that fits, and every spelling of it that passes. */
  answer: string;
  accept: string[];
  /** Forms of the same lemma the item rules OUT — safe distractors. */
  wrong: string[];
}

/** Can this sentence's verb be gapped with exactly one right answer? */
export function analyseGap(s: BankSentence): GapAnalysis | null {
  const c = parseClause(s.es, s.en);
  if (!c || c.participle >= 0) return null;
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
    const f = form(inf, t, p);
    if (f && !open.has(f) && !verbReadings(f).some((a) => tenses.includes(a.tense) && persons.includes(a.person as Person))) wrong.add(f);
  }
  return { clause: c, cue, answer: right, accept: bareAccepted(inf, tense, person), wrong: [...wrong] };
}

function gapped(c: Clause): string {
  return render(replaceCore(c.toks, c.verb, '___'));
}

/** Ladder step 1: choose the form. */
export function chooseItem(s: BankSentence, opts: LadderOptions = {}): ChooseItem | null {
  const g = analyseGap(s);
  if (!g) return null;
  const { inf, tense, person } = g.clause.choice;
  const r = rng(`${opts.seed ?? 0}|${s.id}|choose`);
  // prefer near misses: same tense other person, same person other tense
  const near = g.wrong.filter((f) => verbReadings(f).some((a) => a.tense === tense || a.person === person));
  const pool = near.length >= (opts.maxDistractors ?? 3) ? near : g.wrong;
  const ds = shuffle(pool, r).slice(0, opts.maxDistractors ?? 3);
  if (!ds.length) return null;
  const { options, answer } = shuffled(g.answer, ds, r);
  return {
    id: itemId('ladder', s.id, `choose:${inf}:${tense}:${person}`), generator: 'ladder', sentenceId: s.id, nodes: [...s.targets],
    kind: 'choose', gapped: gapped(g.clause), en: s.en, cue: g.cue, options, answer,
  };
}

/** Ladder step 2: type the form. */
export function typeFormItem(s: BankSentence): TypeFormItem | null {
  const g = analyseGap(s);
  if (!g) return null;
  const { inf, tense, person } = g.clause.choice;
  return {
    id: itemId('ladder', s.id, `type:${inf}:${tense}:${person}`), generator: 'ladder', sentenceId: s.id, nodes: [...s.targets],
    kind: 'typeForm', gapped: gapped(g.clause), en: s.en, cue: g.cue, answer: g.answer, accept: g.accept,
  };
}

/** States: their past is "how it used to be" (imperfect), never "yesterday". */
const STATIVE = new Set(['ser', 'estar', 'tener', 'saber', 'conocer', 'querer', 'poder', 'necesitar', 'vivir', 'creer', 'existir', 'haber', 'deber', 'parecer']);

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

/** Ladder step 3: every transform the sentence supports. */
export function transformItems(s: BankSentence): TransformItem[] {
  const c = parseClause(s.es, s.en);
  if (!c) return [];
  const out: Array<TransformItem | null> = [];
  for (const p of PRODUCTION_PERSONS) {
    if (p === c.choice.person) continue;
    const r = changePerson(c, p, { en: s.en });
    if (r) out.push(transform(s, `person:${p}`, PERSON_INSTRUCTION[p], { op: 'person', to: p }, r.es, []));
  }
  // Tense transforms: not on questions ("¿Ayer dónde viviste?") and, for
  // states (tener, ser, saber…), only to "how it used to be" — "Ayer tuve dos
  // hermanos" is grammatical and nonsense.
  if (!timeSpans(c.toks).length && c.participle < 0 && !/[?]/.test(s.es)) {
    const copula = STATIVE.has(c.choice.inf);
    if (c.choice.tense === 'presente') {
      const pastTense: TenseKey = copula ? 'imperfecto' : 'preterito';
      const word = copula ? 'Antes' : 'Ayer';
      const past = changeTense(c, pastTense);
      if (past) {
        const ans = render(insertTok(past.toks, 0, word));
        out.push(transform(s, `tense:${pastTense}`, copula ? 'Say it was like this before: start with "Antes".' : 'Say it happened yesterday: start with "Ayer".', { op: 'tense', to: pastTense }, ans, []));
      }
      const fut = copula ? null : changeTense(c, 'futuro');
      if (fut) {
        const ans = render(insertTok(fut.toks, 0, 'Mañana'));
        const accept = [render(insertTok(c.toks, 0, 'Mañana'))];
        const ir = form('ir', 'presente', c.choice.person);
        if (ir && !c.reflexive && c.complement < 0) {
          const t2 = replaceCore(c.toks, c.verb, `${ir} a ${c.choice.inf}`);
          accept.push(render(insertTok(t2, 0, 'Mañana')));
        }
        out.push(transform(s, 'tense:futuro', 'Say it will happen: start with "Mañana".', { op: 'tense', to: 'futuro' }, ans, accept));
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
  const ty = typeFormItem(s);
  if (ty) out.push(ty);
  out.push(...transformItems(s));
  return out;
}
