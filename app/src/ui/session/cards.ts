// Turning plan items into things a learner can answer. Pure functions of
// (item, content, seed): the same item always renders the same card, so a
// reload mid-session shows the same question. Every card carries its own
// checker and ONE plain-English reason for when the learner gets it wrong.
import { reviewTargets, type PracticeItem, type RecallItem, type ReviewItem, type ScriptItem, type SessionPlan, type LearnItem } from '../../compiler';
import type { BankSentence, NodeId, TeachingScript } from '../../content/schema';
import { answerForms, checkExact } from '../../check';
import { wordHint } from '../../check/wordhint';
import { canon, matchEnglish, matchTranslation } from '../../check/translate';
import { analyzeToken, deaccent, type TenseKey } from '../../engine';
import { addToLexicon, checkPersonal } from '../../check/personal';
import { bundleLexicon } from './scene';
import { verbReadings } from '../../exercises/spanish';
import {
  ALL_FEATURES, checkItem, chooseItem, form, lexGapItem, parseClause, rng, shuffle, structuredInput,
  recombinations, transformItems, translationItems, typeFormItem, type Item as ExItem,
} from '../../exercises';
import { bankIndex } from '../../exercises/bank-index';
import { INTERCHANGEABLE } from '../../exercises/lexeme';
import { askedOfYou } from '../../exercises/addressee';
import { namesOf, placesOf } from '../../exercises/licence';
import { givesAwayByLength, givesAwayByTag, nearest } from '../../exercises/neighbours';
import { recombineTurn } from '../../exercises/recombine';
import { fixBreaks, isMultiTurn, productionView, turnView, type TurnView } from '../../exercises/dialogue';
import { englishVariants } from './engvariants';
import { hash32 } from '../../exercises/rng';
import type { Feature, RecombineItem, TransformItem } from '../../exercises/types';
import { looksSpanish, type Bundle, type Segment } from '../data/bundle';
import { licensedTenses } from './tenses';

export type Lang = 'es' | 'en';
export interface Txt { text: string; lang: Lang }

export interface Check {
  pass: boolean;
  /** right apart from accents */
  near?: boolean;
  /** one plain-English hint for the retry */
  hint?: string;
  /** what kind of mistake the hint names (see retryLead) */
  hintKind?: string;
  /** the right version to show */
  answer: string;
  /** matched only through a Peninsular form */
  variant?: 'peninsular';
  /** passed through a synonym the course did not teach: counts, but as Hard */
  lenient?: boolean;
  /** the trap rule that named the slip, when one did: an Assert, and nothing else (see src/check/traps) */
  rule?: string;
  /** the hint asks and does not claim an error: the answer may be right (an Ask, see src/check/traps) */
  ask?: boolean;
  /** passed through a swap the card did not teach but Spanish allows: said on the pass screen */
  note?: string;
}

interface CardBase {
  key: string;
  /** a short instruction in plain words ("How would you say this?") */
  ask: string;
  prompt?: Txt;
  /** a second line under the prompt (the English meaning, a cue) */
  sub?: Txt;
  /** the reason shown with the right version when the learner misses */
  why: string;
  /**
   * Asked from the node's script in place of the plan's sentence (pickFallback). That sentence never reached the screen, so it must not be
   * ledgered, credited to the words in it, or named as what was missed: `item` is what to score, `served` the script item to ledger.
   */
  fromScript?: { item: PracticeItem; served: string };
}
export interface McqCard extends CardBase { type: 'mcq'; options: Txt[]; answer: number; /** shown after answering */ after?: Txt; /** the one feature the options differ in (minimal pairs) */ feature?: Feature }
export interface TypeCard extends CardBase {
  type: 'type';
  answerLang: Lang;
  placeholder: string;
  check(input: string): Check;
  /** typed answers get one self-correction attempt (false: reveal at once) */
  retry: boolean;
  /** the card asks for a whole sentence, so the learner may say "mine says the same thing" once the answer shows (R9) */
  claim?: true;
}
export interface ReadCard extends CardBase { type: 'read'; es: string; en: string }
export type Card = McqCard | TypeCard | ReadCard;

const es = (text: string): Txt => ({ text: fixBreaks(text), lang: 'es' });
const en = (text: string): Txt => ({ text: fixBreaks(text), lang: 'en' });
const auto = (text: string): Txt => ({ text, lang: looksSpanish(text) ? 'es' : 'en' });
/** One language for a whole set of options, decided by majority (ties go to the
 *  answer's): per-option guessing coloured options differently and gave answers away. */
function sameLang(texts: string[], answer: number): Txt[] {
  const votes = texts.filter(looksSpanish).length;
  const lang: Lang = votes * 2 > texts.length ? 'es' : votes * 2 < texts.length ? 'en' : (looksSpanish(texts[answer] ?? '') ? 'es' : 'en');
  return texts.map((text) => ({ text, lang }));
}

/** The two questions every card asks, in plain words. */
export const MEANS = 'What does this mean?';
export const SAY = 'How do you say this in Spanish?';
const lcFirst = (s: string) => (/^I\b/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

const norm = (s: string) => deaccent(s.toLowerCase()).replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- distractors

/** The bank once per bundle, for distractors: every row, and the rows of each unit (both in bank order). */
const bankRows = bankIndex(() => ({ all: [] as BankSentence[], unit: new Map<string, BankSentence[]>() }), (pool, s) => {
  pool.all.push(s);
  if (!s.unit) return;
  const rows = pool.unit.get(s.unit);
  if (rows) rows.push(s); else pool.unit.set(s.unit, [s]);
});

/**
 * Up to n other sentences of the bank to stand beside `s` as wrong options, shown in `side`: the nearest of its own unit
 * when the unit has n of them, else of the whole bank (exercises/neighbours.ts says what near is). Stable for the key.
 */
function neighbourRows(b: Bundle, s: BankSentence, side: 'en' | 'es', key: string, n: number): BankSentence[] {
  const rows = bankRows(b.bank);
  const o = { side, n, key: `${key}:${side}`, names: namesOf(b.bank), pair: (r: BankSentence) => r };
  const own = s.unit ? nearest(s, rows.unit.get(s.unit) ?? [], o) : [];
  return own.length >= n ? own : nearest(s, rows.all, o);
}

/** Up to n other English sentences to stand beside the English of `s`, stable for (key). */
export function otherEnglish(b: Bundle, s: BankSentence, key: string, n = 2): string[] {
  return neighbourRows(b, s, 'en', key, n).map((r) => r.en);
}

/** Up to n other Spanish sentences to stand beside the Spanish of `s`, stable for (key). */
export function otherSpanish(b: Bundle, s: BankSentence, key: string, n = 2): string[] {
  return neighbourRows(b, s, 'es', key, n).map((r) => r.es);
}

/** Nodes of each kind, once per bundle (distractor pools). */
const kindPools = new WeakMap<Bundle, Map<string, NodeId[]>>();
function poolOf(b: Bundle, kind: string | undefined): NodeId[] {
  let m = kindPools.get(b);
  if (!m) {
    m = new Map();
    for (const x of b.course.nodes.values()) {
      if (!x.es || !x.en) continue;
      const l = m.get(x.kind) ?? [];
      l.push(x.id);
      m.set(x.kind, l);
    }
    kindPools.set(b, m);
  }
  return m.get(kind ?? '') ?? [];
}

/** The parts of speech a word may be mistaken for another of: a noun beside a noun, a verb beside a verb, the little words together. */
const posGroup = (pos: string | undefined) => (pos === 'noun' || pos === 'verb' || pos === 'adj' || pos === 'adv' || pos === 'num' ? pos : 'little');
const PLURAL_ARTICLE = /^(los|las|unos|unas)\s/i;

/**
 * Up to n other nodes' first pair, shown in `side`, to stand beside `seg`, one of the node's own pairs: of its kind (a word beside a word, a phrase beside a phrase),
 * and for a word of its part of speech, number and variety; about its length; taught around the same time (a field, where the course can tell)
 * and not after it; and never saying what it says (exercises/neighbours.ts). Stable for the key.
 */
function neighbourNodes(b: Bundle, node: NodeId, seg: Segment, key: string, side: 'en' | 'es', n: number): string[] {
  const me = b.node(node);
  if (!me) return [];
  const here = b.course.teachPos.get(node) ?? Infinity;
  const word = me.kind === 'lexeme';
  const group = posGroup(me.pos);
  const plural = PLURAL_ARTICLE.test(seg.es);
  const synonyms = INTERCHANGEABLE.filter((set) => set.some((x) => seg.es.toLowerCase().includes(x)));
  const firstPair = (id: NodeId) => { const p = b.segments(id)[0]; return p && id !== node ? p : undefined; };
  const picked = nearest<NodeId>(seg, poolOf(b, me.kind), {
    side, n, key: `${key}:${side}`, names: namesOf(b.bank), pair: firstPair, word,
    allow: (id) => {
      const x = b.node(id);
      if (!x || x.variety !== me.variety) return false;
      if (!word) return true;
      const p = firstPair(id);
      return posGroup(x.pos) === group && !!p && PLURAL_ARTICLE.test(p.es) === plural && !synonyms.some((set) => set.some((w) => p.es.toLowerCase().includes(w)));
    },
    extra: (id) => {
      const at = b.course.teachPos.get(id) ?? Infinity;
      // taught long before or after: further away; taught after: not yet met, further still
      return Math.min(Math.abs(at - here), 200) / 400 + (at > here ? 0.25 : 0) + (b.node(id)?.band === me.band ? 0 : 0.2);
    },
  });
  return picked.map((id) => b.segments(id)[0][side]);
}

/** Other nodes' English, for bare recognition cards. */
function otherNodeEnglish(b: Bundle, node: NodeId, seg: Segment, key: string, n = 2): string[] {
  return neighbourNodes(b, node, seg, key, 'en', n);
}

/** Other nodes' Spanish (same kind), for "pick the Spanish" cards. */
function otherNodeSpanish(b: Bundle, node: NodeId, seg: Segment, key: string, n = 2): string[] {
  return neighbourNodes(b, node, seg, key, 'es', n);
}

function mcq(key: string, ask: string, prompt: Txt | undefined, right: Txt, wrong: Txt[], why: string, extra: Partial<McqCard> = {}): McqCard {
  const r = rng(key);
  const lang = [right, ...wrong].every((t) => t.lang === right.lang) ? null : right.lang;
  const opts = shuffle([right, ...wrong], r).map((t) => (lang ? { ...t, lang } : t));
  return { type: 'mcq', key, ask, prompt, options: opts, answer: opts.findIndex((t) => t.text === right.text), why, ...extra };
}

// ---------------------------------------------------------------- checkers

/** The learner's word when it is a different word of the SAME interchangeable set as the model's at the one place they differ. */
function lenientSwap(input: string, r: { hintKind?: string; at?: number; closest: string }): string | undefined {
  if ((r.hintKind !== 'wrong-word' && r.hintKind !== 'spelling') || r.at === undefined) return undefined;
  // cheap first: some set must have a word in each text before the (costly) canonical forms are compared
  const k0 = (w: string) => deaccent(w.toLowerCase());
  const iw = new Set(words(input)), cw = new Set(words(r.closest));
  if (!INTERCHANGEABLE.some((set) => set.some((x) => iw.has(k0(x))) && set.some((x) => cw.has(k0(x))))) return undefined;
  const mine = canon(input).toks;
  const model = canon(r.closest).toks;
  const a = mine[r.at]?.t, c = model[r.at]?.t;
  if (!a || !c || a === c || mine.length !== model.length) return undefined;
  const k = (w: string) => deaccent(w.toLowerCase());
  if (!INTERCHANGEABLE.some((set) => set.some((x) => k(x) === k(a)) && set.some((x) => k(x) === k(c)))) return undefined;
  return mine[r.at].src ?? a;
}

/** A sentence card forgives an accent slip, with a note, unless the accent makes the word (R15). */
const SENTENCE_ACCENTS = { accents: 'lenient' } as const;

/** A whole Spanish sentence, from English: the translation matcher. `node` is what the card is about: a pass through a swap that touches it says so. */
export function sentenceCheck(s: Pick<BankSentence, 'es' | 'en' | 'accept'>, node?: NodeId) {
  return (input: string): Check => {
    const r = matchTranslation(input, { es: s.es, en: s.en, accept: s.accept }, node ? { ...SENTENCE_ACCENTS, targets: [node] } : SENTENCE_ACCENTS);
    const len = r.pass ? undefined : lenientSwap(input, r);
    if (len) return { pass: true, lenient: true, hint: `We'd say ${r.closest}; ${len} works too.`, answer: s.es };
    return { pass: r.pass, near: r.pass && r.note ? undefined : r.near, hint: r.hint, hintKind: r.hintKind, answer: r.pass ? s.es : r.closest, variant: r.variant, note: r.note, ...(r.rule ? { rule: r.rule } : {}), ...(r.ask ? { ask: true } : {}) };
  };
}

/** A word or chunk: strict on letters, lenient on accents (an English keyboard). `answers[0]` is the one shown. */
export function chunkCheck(answers: string[]) {
  const list = [...new Set(answers.flatMap((a) => answerForms(a)))];
  return (input: string): Check => {
    const r = checkExact(input, list, { accents: 'lenient' });
    const answer = answers[0] ?? list[0] ?? '';
    if (r.pass) return { pass: true, near: r.near, answer };
    if (r.near) return { pass: false, near: true, hint: 'Check the accents.', answer };
    const w = wordHint(input, list);
    return { pass: false, near: false, hint: w?.hint, hintKind: w?.kind, answer };
  };
}

/** A typed gap (a verb form or a lexeme): the exercise's own check, plus a
 *  hint about the word itself when the miss is not an accent slip. `want` is
 *  the English the gap asks for (lexeme gaps only). */
export function itemCheck(item: ExItem, want?: string, node?: NodeId) {
  return (input: string): Check => {
    const r = checkItem(item, input, node ? { ...SENTENCE_ACCENTS, targets: [node] } : SENTENCE_ACCENTS);
    if (!r.pass && !r.near && !r.hint && (item.kind === 'typeForm' || item.kind === 'lexGap')) {
      // the gap's sentence and its English are what a lone word cannot see: they decide whether a mood or an aspect is asserted or asked
      const before = item.gapped.split('___')[0].toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
      const w = wordHint(input, [item.answer, ...item.accept], item.kind === 'lexGap' ? want : undefined, { before, en: item.en, answer: item.answer });
      if (w) return { pass: false, hint: w.hint, hintKind: w.kind, answer: r.answer, ...(w.rule ? { rule: w.rule } : {}), ...(w.ask ? { ask: true } : {}) };
    }
    return { pass: r.pass, near: r.pass && r.note ? undefined : r.near, hint: r.hint, hintKind: r.hintKind, answer: r.answer, variant: r.variant, note: r.note, ...(r.rule ? { rule: r.rule } : {}), ...(r.ask ? { ask: true } : {}) };
  };
}

// ---------------------------------------------------------------- why the form

const PERSON_PHRASE: Readonly<Record<string, string>> = {
  yo: 'the yo form', 'tú': 'the tú form', 'él/ella': 'the he or she form', nosotros: 'the we form', ellos: 'the they form',
};
const TENSE_PHRASE: Readonly<Record<string, string>> = {
  presente: 'in the present', preterito: 'in the past', imperfecto: 'for what "used to" happen', futuro: 'in the future', condicional: 'for what "would" happen',
};

/** "comí is the yo form of comer in the past." from the item's cue and the
 *  analysis of its answer, or undefined when the item does not carry a verb. */
export function verbFormWhy(item: { cue: string; answer: string }): string | undefined {
  const inf = item.cue.match(/^\(\s*([a-zñáéíóú]+(?:se)?)\s*[,)]/i)?.[1]?.toLowerCase();
  if (!inf) return undefined;
  const r = verbReadings(item.answer).find((a) => a.inf.replace(/se$/, '') === inf.replace(/se$/, ''));
  const person = r && PERSON_PHRASE[r.person];
  const tense = r && TENSE_PHRASE[r.tense];
  if (!r || !person || !tense) return undefined;
  return `${item.answer} is ${person} of ${inf} ${tense}.`;
}

/** The reason for a verb gap, or the English-based line when the item does not say. */
export function gapWhy(item: { cue: string; answer: string; en: string }, fallback: string): string {
  return verbFormWhy(item) ?? fallback;
}

const GENDER_OF: Readonly<Record<string, string>> = { el: 'masculine', los: 'masculine', la: 'feminine', las: 'feminine' };

/** The reason for a new-word gap: the word, and its gender when it has an article. */
export function lexemeWhy(lex: { es: string; en: string }, item: { cue: string; answer: string; en: string }): string {
  const verb = verbFormWhy(item);
  if (verb) return verb;
  const base = `"${lex.en}" is ${lex.es}.`;
  const m = lex.es.match(/^(el|la|los|las)\s+(\S+)/i);
  const gender = m && GENDER_OF[m[1].toLowerCase()];
  return gender ? `${base} ${m![2][0].toUpperCase()}${m![2].slice(1)} is ${gender}.` : base;
}

// ---------------------------------------------------------------- dialogue rows

/**
 * Which turn of a dialogue row practises this node: the one its chunk or
 * word is in. Undefined when the node has nothing short enough to look for
 * (the reply is asked then).
 */
function preferFor(b: Bundle, node: NodeId): ((text: string) => boolean) | undefined {
  const keys = b.segments(node).map((x) => norm(x.es)).filter((k) => k && k.split(' ').length <= 6);
  const lex = b.lexemeLike(node);
  if (lex) keys.push(norm(lex.es.replace(/^(el|la|los|las|un|una)\s+/i, '')));
  if (!keys.length) return undefined;
  return (text) => { const t = ` ${norm(text)} `; return keys.some((k) => t.includes(` ${k} `)); };
}

/**
 * A production card for ONE turn. A dialogue row never asks for the whole
 * exchange in one answer: the turns before this one are shown in Spanish
 * (the other speaker), the learner says this turn from its English, and only
 * this turn is checked.
 */
function sayCard(key: string, v: TurnView, check: (input: string) => Check, why: string): TypeCard {
  const base = { type: 'type' as const, key, answerLang: 'es' as const, placeholder: 'Type it in Spanish', check, retry: true, why, claim: true as const };
  if (!v.context) return { ...base, ask: SAY, prompt: en(v.sentence.en) };
  return { ...base, ask: 'They say this. Answer in Spanish', prompt: es(v.context), sub: en(`Say: ${v.sentence.en}`), placeholder: 'Your reply, in Spanish' };
}

// ---------------------------------------------------------------- reviews (warm-up, leech)

// ---------------------------------------------------------------- receptive formats

export type ReceptiveFormat = 'typeEn' | 'pickFeature' | 'pickEs';

/**
 * 20 slots (10 type, 6 pick-the-meaning, 4 which-one-says-this) in which no two
 * neighbours match, also round the end: a node walking the wheel one step per
 * session never gets the same look twice running.
 */
const WHEEL: ReceptiveFormat[] = (() => {
  const w: ReceptiveFormat[] = [];
  for (let i = 0; i < 20; i++) {
    if (i % 2 === 0) w.push('typeEn');
    else w.push(i === 5 || i === 11 || i === 15 || i === 19 ? 'pickEs' : 'pickFeature');
  }
  return w;
})();

/**
 * How a receptive review of a node is asked. A pure function of (node, seedKey):
 * a number (the session index) walks the node's wheel one step per session; a
 * string (a card key) lands on a stable spot of it.
 */
export function receptiveFormat(node: string, seedKey: string | number): ReceptiveFormat {
  const step = typeof seedKey === 'number' ? seedKey : hash32(seedKey);
  return WHEEL[(((hash32(node) + step) % 20) + 20) % 20];
}

// ---------------------------------------------------------------- productive formats

export type ProductiveFormat = 'translate' | 'cloze' | 'transform';

/** 20 slots (8 translate, 8 cloze, 4 transform), no two neighbours alike, also round the end. */
const PRODUCTIVE_WHEEL: ProductiveFormat[] = [
  'translate', 'cloze', 'translate', 'cloze', 'translate', 'transform', 'cloze', 'translate', 'cloze', 'translate',
  'transform', 'cloze', 'translate', 'cloze', 'translate', 'transform', 'cloze', 'translate', 'cloze', 'transform',
];

/** How a productive review of a node is asked: (node, session index or card key), like receptiveFormat. */
export function productiveFormat(node: string, seedKey: string | number): ProductiveFormat {
  const step = typeof seedKey === 'number' ? seedKey : hash32(seedKey);
  return PRODUCTIVE_WHEEL[(((hash32(node) + step) % 20) + 20) % 20];
}

const en_ = (t: string): Txt => ({ text: t, lang: 'en' });
const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length;
/** English meanings to accept for a typed answer: the meaning, and it without its leading the/a/to. */
const enForms = (en: string) => {
  const bare = en.replace(/^(the|a|an|to)\s+/i, '');
  return bare !== en && bare ? [bare] : [];
};

/** "Type the meaning in English": Spanish shown, the learner types it. */
function typeMeaning(key: string, esText: string, enFull: string, acceptEn: readonly string[], why: string): TypeCard {
  const note = /\s*\(([^)]*)\)\s*$/.exec(enFull);
  const en = note ? enFull.slice(0, note.index).trim() || enFull : enFull;
  const all = [...acceptEn, ...(en !== enFull ? [enFull] : []), ...enForms(en)];
  return {
    type: 'type', key, ask: 'Type the meaning in English', prompt: es(esText), ...(note && en !== enFull ? { sub: en_(`(${note[1]})`) } : {}), answerLang: 'en', placeholder: 'Type it in English', retry: true, why,
    check: (input) => {
      const r = matchEnglish(input, { en, acceptEn: all });
      return { pass: r.pass, near: r.near, hint: r.hint, hintKind: r.hintKind, answer: r.pass ? en : r.closest };
    },
  };
}

/** The meaning of a sentence, typed; of an exchange, its reply, since nobody is asked to type two people talking (the other cards never do). Undefined for an exchange whose turns do not line up. */
function typedMeaning(key: string, s: BankSentence, why: string): TypeCard | undefined {
  const turn = productionView(s)?.sentence;
  return turn && typeMeaning(key, turn.es, turn.en, turn.acceptEn ?? [], why);
}

/** What a sentence means, asked as a choice among near neighbours. Fewer than two of them and it is typed, since a choice of two with nothing alike to pick from is a free pass. */
function meaningChoice(key: string, s: BankSentence, b: Bundle, why: string): Card {
  const wrong = otherEnglish(b, s, key, 2);
  if (wrong.length >= 2) return mcq(key, MEANS, es(s.es), en(s.en), wrong.map(en), why);
  return typedMeaning(key, s, why) ?? (wrong.length ? mcq(key, MEANS, es(s.es), en(s.en), wrong.map(en), why) : { type: 'read', key, ask: 'Read it', es: s.es, en: s.en, why: '' });
}

/** What a word or phrase means, the same way. */
function nodeMeaningChoice(key: string, node: NodeId, b: Bundle, seg: Segment): Card {
  const wrong = otherNodeEnglish(b, node, seg, key);
  const why = `${seg.es} means "${seg.en}".`;
  return wrong.length >= 2 ? mcq(key, MEANS, es(seg.es), en(seg.en), wrong.map(en), why) : typeMeaning(key, seg.es, seg.en, [], why);
}

const words = (t: string) => deaccent(t.toLowerCase()).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/** A sentence with the stop it needs before another sentence follows it: "…del todo." stays, "No es de Cartagena" gets one. */
const stopped = (s: string) => (/[.?!…]["”»)]?$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** "It uses <node>: <form>." where the form is one of the node's own forms that really occurs in the sentence. */
function usesWhy(b: Bundle, node: NodeId, sentence: string): string {
  const hay = ` ${words(sentence).join(' ')} `;
  const forms = b.segments(node).map((x) => x.es).filter((f) => hay.includes(` ${words(f).join(' ')} `) && words(f).length)
    .sort((a, c) => words(c).length - words(a).length);
  // a title that already carries a colon ('Every noun is "el" or "la": the, a, ...') keeps only its head
  const title = b.title(node).split(':')[0].trim();
  return forms.length ? `It uses ${title}: ${stopped(forms[0])}` : `It uses ${stopped(title)}`;
}

/** Does a typed-form gap's answer belong to the node being reviewed? */
function answerBelongs(b: Bundle, node: NodeId, answer: string): boolean {
  const a = norm(answer);
  if (b.segments(node).some((x) => norm(x.es) === a || words(x.es).includes(a))) return true;
  const own = new Set(words(b.node(node)?.es ?? '').map((w) => w.replace(/se$/, '')));
  return analyzeToken(answer.toLowerCase()).some((r) => own.has(r.inf.replace(/se$/, '')));
}

/** The tenses taught by the end of a unit: the card of a learner whose own list is not to hand is limited to these (the present, when the unit is not known). */
const unitTaught = new WeakMap<Bundle, Map<string, TenseKey[]>>();
function taughtAt(b: Bundle, unit: string | undefined): TenseKey[] {
  let m = unitTaught.get(b);
  if (!m) unitTaught.set(b, m = new Map());
  const key = unit ?? '';
  let t = m.get(key);
  if (!t) {
    const at = unit === undefined ? undefined : b.course.unitIndex.get(unit);
    const end = at === undefined ? 0 : b.course.unitStart[at + 1] ?? Infinity;
    const met = [...b.course.teachPos].filter(([, pos]) => pos < end).map(([id]) => id);
    m.set(key, t = licensedTenses(met, (id) => b.node(id)?.tags));
  }
  return t;
}

/** What a transform may ask of this sentence: the tenses taught (the learner's own list, else the unit's) and the names in the bank. */
const transformsFor = (s: BankSentence, b: Bundle, taught?: readonly TenseKey[]) => transformItems(s, { taught: taught ?? taughtAt(b, s.unit), names: namesOf(b.bank) });

/** Who a sentence is about, said after "about": the person a transform changed it to. */
const ABOUT: Readonly<Record<string, string>> = { yo: 'yourself', 'tú': 'the person you are talking to', 'él/ella': 'him or her', nosotros: 'us', ellos: 'them' };
/** The reason shown with a transform's right version: the sentence, then what was asked of it, worded to read after it. */
function transformWhy(t: TransformItem): string {
  const done = stopped(t.answer);
  switch (t.transform.op) {
    case 'person': return `${done} Same sentence, said about ${ABOUT[t.transform.to] ?? 'someone else'}.`;
    case 'tense': return `${done} Same sentence, ${t.transform.to === 'imperfecto' ? 'as how it used to be' : t.transform.to === 'futuro' ? 'as something still to come' : 'as something that happened'}.`;
    case 'negate': return `${done} Same sentence, saying it is not so.`;
    case 'pronoun': return `${done} The little word stands in for "${t.transform.np}".`;
  }
}

/** The cloze or transform way of asking a productive review, or undefined when the sentence does not support it. */
function productiveSideCard(item: ReviewItem, s: BankSentence, b: Bundle, f: 'cloze' | 'transform', taught?: readonly TenseKey[]): Card | undefined {
  if (f === 'transform') {
    const t = transformsFor(s, b, taught)[0];
    if (!t) return undefined;
    return {
      type: 'type', key: item.id, ask: 'Change the sentence', prompt: es(t.source), sub: en(t.instruction), answerLang: 'es',
      placeholder: 'Type it in Spanish', check: itemCheck(t, undefined, item.node), retry: true, claim: true, why: transformWhy(t),
    };
  }
  const tf = typeFormItem(s);
  if (tf && answerBelongs(b, item.node, tf.answer)) {
    return {
      type: 'type', key: item.id, ask: 'Fill the gap', prompt: es(tf.gapped), sub: en(`${tf.en}  ${tf.cue}`), answerLang: 'es',
      placeholder: 'The missing word', check: itemCheck(tf), retry: true, why: gapWhy(tf, `The English says "${tf.en}", so the gap is ${tf.answer}.`),
    };
  }
  const nk = b.node(item.node)?.kind;
  const lex = nk === 'lexeme' || nk === 'chunk' ? b.lexemeLike(item.node) : undefined;
  const g = lex && lexGapItem(lex, s);
  if (lex && g) return lexGapCard(item.id, lex, g);
  return undefined;
}

function lexGapCard(key: string, lex: { es: string; en: string }, g: ReturnType<typeof lexGapItem> & object): TypeCard {
  return {
    type: 'type', key, ask: 'Fill the gap with the new word', prompt: es(g.gapped), sub: en(`${g.en}  ${g.cue}`), answerLang: 'es',
    placeholder: 'The missing word', check: itemCheck(g, lex.en), retry: true, why: lexemeWhy(lex, g),
  };
}

/**
 * A new word asked in a sentence: the sentence with the word gapped, the
 * English of the sentence and the cue. `exampleId` (the sentence the learner
 * was just shown) goes first. No fair gap but a sentence that has the word:
 * the gloss, with that sentence as a clue. Neither: the plain gloss.
 */
export function lexemeTypeCard(key: string, node: NodeId, b: Bundle, exampleId?: string): Card {
  const lex = b.lexemeLike(node);
  const seg = b.segments(node)[0];
  const ids = [exampleId, ...(b.index.byTarget.get(node) ?? []), ...(b.index.byRequire.get(node) ?? [])]
    .filter((x, i, a): x is string => !!x && a.indexOf(x) === i).slice(0, 20);
  const sentences = ids.map((id) => b.sentence(id)).filter((x): x is BankSentence => !!x);
  if (lex) {
    for (const s of sentences) {
      const g = lexGapItem(lex, s);
      if (g) return lexGapCard(key, lex, g);
    }
  }
  const gloss = (sub?: Txt): Card => ({
    type: 'type', key, ask: SAY, prompt: en(seg?.en ?? lex?.en ?? ''), ...(sub ? { sub } : {}), answerLang: 'es', placeholder: 'Type it in Spanish',
    check: chunkCheck([seg?.es ?? lex?.es ?? '', ...(seg?.accept ?? [])]), retry: true, why: `"${seg?.en}" is ${seg?.es}`,
  });
  const word = lex ? lex.es.replace(/^(el|la|los|las|un|una)\s+/i, '').trim() : '';
  if (word) {
    const re = new RegExp(`(^|[^\\p{L}])(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}])`, 'iu');
    for (const s of sentences) {
      if (re.test(s.es) && !isMultiTurn(s)) return gloss(es('as in: ' + s.es.replace(re, '$1___')));
    }
  }
  return gloss();
}

/**
 * A review. A receptive one is asked three ways, rotated per node and session
 * (`receptiveFormat`): type the English, pick the English (the wrong options
 * are the same sentence about someone else or another time when the engine can
 * say so), or "which one says this?". `variant` 'pickSpanish' forces the last,
 * so a warm-up of receptive reviews is not one long run of the same look.
 * `session` (a number) makes a node's look change from one session to the next.
 */
export function reviewCard(item: ReviewItem, b: Bundle, variant: 'meaning' | 'pickSpanish' | 'cloze' = 'meaning', session?: number, taught?: readonly TenseKey[]): Card {
  const s = b.sentence(item.sentence);
  const seg = b.segments(item.node)[0];
  // a contrast has no sentence of its own, and a node with no pair to ask about has nothing else once its sentences are used: both are asked with one of their script's items
  if (!s && (item.script || !seg || b.node(item.node)?.kind === 'contrast')) { const c = scriptReviewCard(item, b); if (c) return c; }
  const title = b.title(item.node);
  const fmt: ReceptiveFormat = item.direction === 'receptive'
    ? (variant === 'pickSpanish' ? 'pickEs' : receptiveFormat(item.node, session ?? item.id))
    : 'pickFeature';
  if (s && item.direction === 'receptive') {
    const why = seg ? `${seg.es} means "${seg.en}". The rest of the sentence gives the context.` : `This is about: ${title.toLowerCase()}.`;
    if (fmt === 'typeEn' && !isMultiTurn(s) && wordCount(s.en) <= 14) return typeMeaning(item.id, s.es, s.en, s.acceptEn ?? [], why);
    if (fmt === 'pickEs' && !isMultiTurn(s)) {
      const wrong = otherSpanish(b, s, item.id, 3);
      const use = wrong.length >= 3 ? wrong : wrong.length >= 2 ? wrong.slice(0, 2) : [];
      if (use.length) return mcq(item.id, 'Which one says this?', en(s.en), es(s.es), use.map(es), seg ? `${seg.es} means "${seg.en}".` : `It's ${s.es}`);
    }
    const vars = isMultiTurn(s) ? null : englishVariants(s, item.id);
    if (vars) return mcq(item.id, MEANS, es(s.es), en(s.en), vars.map(en), why);
    if (fmt === 'pickFeature' && !isMultiTurn(s)) {
      // nothing re-inflects: ask it the other way round, with four options when there are
      const alt = otherSpanish(b, s, item.id, 3);
      if (alt.length >= 3) return mcq(item.id, 'Which one says this?', en(s.en), es(s.es), alt.map(es), seg ? `${seg.es} means "${seg.en}".` : `It's ${s.es}`);
    }
    return meaningChoice(item.id, s, b, why);
  }
  if (s && item.direction === 'productive' && reviewTargets(item).length === 1) {
    const f = variant === 'cloze' ? 'cloze' : productiveFormat(item.node, session ?? item.id);
    // a transform the sentence does not allow falls back to a gap before it falls back to a translation
    const c = f === 'translate' ? undefined : productiveSideCard(item, s, b, f, taught) ?? (f === 'transform' ? productiveSideCard(item, s, b, 'cloze', taught) : undefined);
    if (c) return c;
  }
  const v = s ? productionView(s, preferFor(b, item.node)) : null;
  if (s && v) {
    return sayCard(item.id, v, sentenceCheck(v.sentence, item.node), usesWhy(b, item.node, v.sentence.es));
  }
  if (s) {
    // turns that do not line up: recognise the exchange instead
    return meaningChoice(item.id, s, b, seg ? `${seg.es} means "${seg.en}". The rest gives the context.` : `This is about: ${title.toLowerCase()}.`);
  }
  // bare card: no fresh sentence left for this node
  if (!seg) return { type: 'read', key: item.id, ask: 'Have another look', es: b.node(item.node)?.es ?? title, en: title, why: '' };
  if (item.direction === 'productive' && b.node(item.node)?.kind === 'lexeme') return lexemeTypeCard(item.id, item.node, b);
  if (item.direction === 'receptive') {
    if (fmt === 'typeEn' && wordCount(seg.en) <= 6) return typeMeaning(item.id, seg.es, seg.en, [], `${seg.es} means "${seg.en}".`);
    if (fmt === 'pickEs') {
      const wrong = otherNodeSpanish(b, item.node, seg, item.id, 3);
      const use = wrong.length >= 3 ? wrong : wrong.slice(0, 2);
      if (use.length >= 2) return mcq(item.id, 'Which one says this?', en(seg.en), es(seg.es), use.map(es), `"${seg.en}" is ${seg.es}`);
    }
    return nodeMeaningChoice(item.id, item.node, b, seg);
  }
  return {
    type: 'type', key: item.id, ask: SAY, prompt: en(seg.en), answerLang: 'es', placeholder: 'Type it in Spanish',
    check: chunkCheck([seg.es, ...seg.accept]), retry: true, why: `"${seg.en}" is ${seg.es}`,
  };
}

/**
 * The review card of a node asked with its script: the script item the plan names (`item.script`), or, where nothing names one
 * (the recap, free practice), one picked by the card's key. Never a card that only shows, since that is never graded.
 */
function scriptReviewCard(item: ReviewItem, b: Bundle): Card | undefined {
  const script = b.scripts.get(item.node);
  if (!script) return undefined;
  const op = item.script?.op ?? (item.direction === 'receptive' ? 'readAndPick' : 'yourTurn');
  const count = op === 'readAndPick' ? script.readAndPick.length : script.yourTurn.length;
  const index = item.script?.index ?? (count ? hash32(item.id) % count : 0);
  const card = count ? scriptCard({ op, id: item.id, node: item.node, index, scoring: item.scoring, credit: item.credit }, script) : undefined;
  if (card) return card;
  // the script has none of that sort: the other sort
  const other = op === 'readAndPick' ? 'yourTurn' : 'readAndPick';
  const n = other === 'readAndPick' ? script.readAndPick.length : script.yourTurn.length;
  return n ? scriptCard({ op: other, id: item.id, node: item.node, index: hash32(item.id) % n, scoring: item.scoring, credit: item.credit }, script) : undefined;
}

// ---------------------------------------------------------------- new words and phrases

/** The format a learn retrieval takes in each round, so the rounds of one item never look alike. */
export type LearnFormat = 'recognise' | 'pickSpanish' | 'type';

export function learnFormat(round: number, productive = true): LearnFormat {
  if (!productive) return 'recognise';
  return round === 0 ? 'recognise' : round === 1 ? 'pickSpanish' : 'type';
}

/**
 * One in-lesson retrieval of a new word or phrase. Every card is built from
 * ONE aligned pair (exercises/pairs.ts): the English shown is the exact
 * translation of the Spanish expected. Round 0: what does it mean (pick the
 * English); round 1: pick the Spanish; then type it. Receptive-only items only
 * ever get recognition.
 */
export function learnRetrieval(item: LearnItem, b: Bundle, round: number, n?: number): Card {
  const segs = b.segments(item.node);
  const seg = segs[(n ?? round) % Math.max(1, segs.length)] ?? segs[0];
  const key = `${item.id}#${n ?? round}`;
  if (!seg) return { type: 'read', key, ask: 'Have another look', es: b.node(item.node)?.es ?? b.title(item.node), en: b.title(item.node), why: '' };
  const why = `"${seg.en}" is ${seg.es}`;
  // round 1 of a short word: "pick the Spanish" is nearly free, so type what it means
  if (round === 1 && b.node(item.node)?.kind === 'lexeme' && wordCount(seg.en) <= 2) {
    return typeMeaning(key, seg.es, seg.en, [], `${seg.es} means "${seg.en}".`);
  }
  switch (learnFormat(round, item.productive !== false)) {
    case 'recognise':
      return nodeMeaningChoice(key, item.node, b, seg);
    case 'pickSpanish': {
      const wrong = otherNodeSpanish(b, item.node, seg, key);
      if (wrong.length >= 2) return mcq(key, SAY, en(seg.en), es(seg.es), wrong.map(es), why);
      break;
    }
    case 'type':
      if (b.node(item.node)?.kind === 'lexeme') return lexemeTypeCard(key, item.node, b, item.example);
      break;
  }
  return {
    type: 'type', key, ask: SAY, prompt: en(seg.en), answerLang: 'es', placeholder: 'Type it in Spanish',
    check: chunkCheck([seg.es, ...seg.accept]), retry: true, why,
  };
}

// ---------------------------------------------------------------- teaching scripts

export function scriptCard(item: ScriptItem, script: TeachingScript): Card | undefined {
  if (item.op === 'readAndPick') {
    const rp = script.readAndPick[item.index];
    if (!rp) return undefined;
    const opts = sameLang(rp.options, rp.answer);
    return { type: 'mcq', key: item.id, ask: 'Read and pick', prompt: es(rp.es), options: opts, answer: rp.answer, why: `${rp.es} → ${rp.options[rp.answer]}` };
  }
  const yt = script.yourTurn[item.index];
  if (!yt) return undefined;
  const answers = [yt.answer, ...yt.accept];
  // "Type in Spanish: the day" / "Translate: …": the label is the question, the rest is the cue
  const label = yt.prompt.match(/^(?:type (?:it )?in spanish|translate|in spanish|say in spanish|say it in spanish)\s*:\s*/i);
  const cue = label ? yt.prompt.slice(label[0].length) : yt.prompt;
  return {
    type: 'type', key: item.id, ask: label ? SAY : 'Your turn', prompt: en(cue), answerLang: 'es', placeholder: 'Type it in Spanish', retry: true, why: yt.why,
    check: (input) => {
      const exact = checkExact(input, answers);
      if (exact.pass) return { pass: true, answer: yt.answer };
      const m = matchTranslation(input, { es: yt.answer, en: cue.replace(/^[^:]*:\s*/, ''), accept: yt.accept }, { ...SENTENCE_ACCENTS, targets: [item.node] });
      if (m.pass) return { pass: true, near: m.note ? undefined : m.near, hintKind: m.hintKind, answer: yt.answer, variant: m.variant, note: m.note };
      return { pass: false, near: exact.near || m.near, hint: exact.near ? 'Check the accents.' : m.hint, hintKind: exact.near ? 'accents' : m.hintKind, answer: yt.answer };
    },
  };
}

// ---------------------------------------------------------------- practice on bank sentences

function meaningCard(item: PracticeItem, s: BankSentence, b: Bundle): Card {
  const seg = b.segments(item.node)[0];
  return meaningChoice(item.id, s, b, seg ? `${seg.es} means "${seg.en}".` : `It means "${s.en}".`);
}

function translateCard(item: PracticeItem, s: BankSentence, b: Bundle): Card {
  const prefer = preferFor(b, item.node);
  const v = productionView(s, prefer);
  const [t] = translationItems(s, { dirs: ['en-es'], bank: b.bank, prefer });
  if (!v || !t) return meaningCard(item, s, b);
  return sayCard(item.id, v, itemCheck(t, undefined, item.node), 'Here is how Spanish says it.');
}

function typeFormCard(item: PracticeItem, s: BankSentence): TypeCard | undefined {
  const t = typeFormItem(s);
  if (!t) return undefined;
  return {
    type: 'type', key: item.id, ask: 'Fill the gap', prompt: es(t.gapped), sub: en(`${t.en}  ${t.cue}`), answerLang: 'es', placeholder: 'The missing word',
    check: itemCheck(t), retry: true, why: gapWhy(t, `The English says "${t.en}", so the gap is ${t.answer}.`),
  };
}

/** The question asked of you → the yo form that answers it (eres → soy). */
export function respondCheck(question: BankSentence, lexicon?: ReadonlySet<string>) {
  const c = parseClause(question.es, question.en);
  const asked = c && (c.choice.person === 'tú' || c.choice.person === 'él/ella') ? c : null;
  const tu = asked?.choice.person === 'tú';
  const want = asked ? form(asked.choice.inf, asked.choice.tense, 'yo') : null;
  const said = asked ? asked.toks[asked.verb].core : '';
  const lex = lexicon ?? addToLexicon(new Set<string>(), question.es);
  const sample = want ? `${want[0].toUpperCase()}${want.slice(1)} …` : 'Tengo …';
  return (input: string): Check => {
    const words = input.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return { pass: false, hint: 'Try a full sentence. Two or three words is plenty.', answer: sample };
    // most of it must be Spanish, whatever the question
    const share = checkPersonal(input, { lexicon: lex, noForm: true });
    if (!share.pass) return { pass: false, hint: share.hint, answer: sample };
    const norm = words.map((w) => w.toLowerCase().replace(/[^\p{L}]/gu, '')).join(' ');
    if (/^(s[ií]|no|no\s+(lo\s+)?s[eé])$/.test(norm)) return { pass: false, hint: `Fair enough, but give it a go: ${sample}`, answer: sample };
    if (!asked) {
      // a question about something else: the answer should still say something with a verb in it
      const hasVerb = words.some((w) => { const t = w.toLowerCase().replace(/[^\p{L}]/gu, ''); return t !== 'sé' && analyzeToken(t).length > 0; });
      if (!hasVerb) return { pass: false, hint: `Answer with a verb, like ${sample}.`, answer: sample };
    }
    if (!want || !asked) return { pass: true, answer: input };
    const toks = words.map((w) => deaccent(w.toLowerCase().replace(/[^\p{L}]/gu, '')));
    if (tu) {
      return toks.includes(deaccent(want)) ? { pass: true, answer: input } : {
        pass: false, hint: `They asked with ${said} (you), so answer with ${want} (I).`, answer: sample,
      };
    }
    // a "usted" question: the same verb, in any person
    const inf = asked.choice.inf.replace(/se$/, '');
    const hit = toks.some((t) => analyzeToken(t).some((a) => a.inf.replace(/se$/, '') === inf));
    return hit ? { pass: true, answer: input } : {
      pass: false, hint: `They asked with ${said}, so answer with the same verb, like ${want}.`, answer: sample,
    };
  };
}

// ---------------------------------------------------------------- recombine (the mastery test)

function recombineAsk(key: string): { ask: string; what: string } {
  const [head, neg] = key.split('+');
  const p = head.startsWith('person:') ? head.slice(7) : '';
  const who: Record<string, string> = { yo: 'about yourself', 'tú': 'about the person you are talking to', 'él/ella': 'about him or her', nosotros: 'about the two of you', ellos: 'about them' };
  const bits = [p ? who[p] : '', neg === 'negate' || head === 'negate' ? 'saying it is not so' : ''].filter(Boolean);
  const what = [p ? 'person' : '', neg === 'negate' || head === 'negate' ? 'yes or no' : ''].filter(Boolean).join(' and ');
  return { ask: `Now say it ${bits.join(', ') || 'a new way'}`, what: what || 'way' };
}

/**
 * A sentence the learner has seen, re-inflected into one they have not: the
 * engine's new person, a pronoun for the object, a negation, or both. Picked
 * by the card key: person-plus-negation first, then the object pronoun, then
 * the plain production variants. With no variant, an ordinary transform.
 */
export function recombineCard(item: PracticeItem, s: BankSentence, b: Bundle, seed: number, taught?: readonly TenseKey[]): Card | undefined {
  const r = rng(`${seed}:${item.id}:recombine`);
  const all = recombinations(s, { seed: item.id, bank: b.bank, taught: taught ?? taughtAt(b, s.unit) });
  const rank = (x: RecombineItem) => (x.mode === 'production' ? (x.id.endsWith('+negate') ? 0 : 2) : x.transform.op === 'pronoun' ? 1 : 4);
  const items = all.filter((x) => x.mode === 'production' || x.options?.length);
  if (!items.length) return undefined;
  const best = Math.min(...items.map(rank));
  const pool = items.filter((x) => rank(x) === best);
  const it = pool[Math.floor(r() * pool.length)];
  const known = recombineTurn(s)?.sentence ?? s;
  const key = it.id.split('|')[2] ?? '';
  if (it.mode === 'recognition') {
    const opts = it.options!;
    const right = it.answer ?? 0;
    return {
      type: 'mcq', key: item.id, ask: it.question ?? 'What does this mean?', prompt: es(it.es), sub: en(`You know: ${known.es}`),
      options: sameLang(opts, right), answer: right, why: it.transform.op === 'pronoun' ? `${it.es}: the little word stands for ${opts[right]}.` : `${it.es}: ${opts[right]}.`,
    };
  }
  const { ask, what } = recombineAsk(key);
  return {
    type: 'type', key: item.id, ask, prompt: es(known.es), sub: en(`Now: ${it.en ?? ''}`.replace(/\s+$/, '')), answerLang: 'es', placeholder: 'Say it in Spanish',
    check: itemCheck(it, undefined, item.node), retry: true, claim: true, why: `${stopped(it.es)} Same sentence, new ${what}.`,
  };
}

/** The script picks a session already asks, in its lessons and its reviews: a block starts its `taken` from these (see pickFallback). */
export function plannedPicks(plan: Pick<SessionPlan, 'blocks'>): Set<string> {
  const out = new Set<string>();
  for (const block of plan.blocks) {
    if (block.kind === 'teach') for (const it of block.items) if (it.op === 'readAndPick') out.add(it.id);
    if (block.kind === 'warmup' || block.kind === 'leech') for (const it of block.items) if (it.script?.op === 'readAndPick') out.add(`sc:${it.node}:rp:${it.script.index}`);
  }
  return out;
}

/**
 * Read and pick, for a sentence that cannot carry a minimal pair of its own (no tense or person of it re-inflects safely). A meaning
 * question among other sentences proves nothing about the form, and one known word answers it. So, in order: a read-and-pick the node's
 * script wrote for exactly its point, one that does not give itself away by its length or a lone tag, and not one this session has asked
 * (`taken`: a question met twice is answered from memory, and a block's items can outnumber a script's fair picks), a different one from one
 * session to the next; else the sentence asked for typing, which the form cannot be dodged in. A sentence that needs a recognition-only point is
 * one to read and never to say, so its meaning is typed.
 */
function pickFallback(item: PracticeItem, s: BankSentence, b: Bundle, seed: number, taken?: Set<string>): Card {
  const script = b.scripts.get(item.node);
  const id = (i: number) => `sc:${item.node}:rp:${i}`;
  const free = (script?.readAndPick ?? []).flatMap((rp, i) => (givesAwayByLength(rp.options, rp.answer) || givesAwayByTag(rp.options, rp.answer) || taken?.has(id(i)) ? [] : [i]));
  if (script && free.length) {
    const index = free[hash32(`${seed}:${item.id}`) % free.length];
    const credit = [item.node];
    const card = scriptCard({ op: 'readAndPick', id: item.id, node: item.node, index, scoring: item.scoring, credit }, script);
    if (card) {
      taken?.add(id(index));
      return { ...card, fromScript: { item: { ...item, sentence: '', credit }, served: id(index) } };
    }
  }
  if (b.index.sentences.get(s.id)?.readOnly) {
    const seg = b.segments(item.node)[0];
    return typedMeaning(item.id, s, seg ? `${seg.es} means "${seg.en}".` : `It means "${s.en}".`) ?? { type: 'read', key: item.id, ask: 'Read it', es: s.es, en: s.en, why: '' };
  }
  return typeFormCard(item, s) ?? translateCard(item, s, b);
}

/**
 * `taught`: the learner's licensed tenses (licensedTenses); distractors and contrast forms stay inside it. Omitted: no limit.
 * `taken`: the script picks already asked around this item, one set for a whole block, so that the block asks none twice (pickFallback).
 */
export function practiceCard(item: PracticeItem, b: Bundle, seed: number, taught?: readonly TenseKey[], taken?: Set<string>): Card {
  const s = b.sentence(item.sentence);
  if (!s) return { type: 'read', key: item.id, ask: 'Have a look', es: b.node(item.node)?.es ?? '', en: b.title(item.node), why: '' };
  const r = rng(`${seed}:${item.id}`);
  switch (item.op) {
    case 'pick': {
      for (const f of shuffle([...ALL_FEATURES], r)) {
        const it = structuredInput(s, f, { seed: item.id, taught });
        if (it) {
          return {
            type: 'mcq', key: item.id, ask: 'Read and pick', prompt: en(it.question), options: it.options.map(es), answer: it.answer, why: it.why,
            ...(it.en ? { after: en(it.en) } : {}), feature: it.feature,
          };
        }
      }
      return pickFallback(item, s, b, seed, taken);
    }
    case 'choose': {
      const it = chooseItem(s, { seed: item.id, taught });
      if (it) {
        return {
          type: 'mcq', key: item.id, ask: 'Choose the right form', prompt: es(it.gapped), sub: en(`${it.en}  ${it.cue}`),
          options: it.options.map(es), answer: it.answer, why: gapWhy({ cue: it.cue, answer: it.options[it.answer], en: it.en }, `The English says "${it.en}", so it's ${it.options[it.answer]}.`),
        };
      }
      return typeFormCard(item, s) ?? translateCard(item, s, b);
    }
    case 'type':
      return typeFormCard(item, s) ?? translateCard(item, s, b);
    case 'transform': {
      const it = transformsFor(s, b, taught)[0];
      if (it) {
        return {
          type: 'type', key: item.id, ask: it.instruction, prompt: es(it.source), answerLang: 'es', placeholder: 'Rewrite it',
          check: itemCheck(it, undefined, item.node), retry: true, claim: true, why: transformWhy(it),
        };
      }
      return translateCard(item, s, b);
    }
    case 'recombine':
      return recombineCard(item, s, b, seed, taught) ?? practiceCard({ ...item, op: 'transform' }, b, seed, taught);
    case 'translate':
      return translateCard(item, s, b);
    case 'gap': {
      const lex = b.lexemeLike(item.node);
      const it = lex ? lexGapItem(lex, s) : null;
      if (it) {
        return {
          type: 'type', key: item.id, ask: 'Fill the gap with the new word', prompt: es(it.gapped), sub: en(`${it.en}  ${it.cue}`), answerLang: 'es', placeholder: 'The missing word',
          check: itemCheck(it, lex!.en), retry: true, why: lexemeWhy(lex!, it),
        };
      }
      return typeFormCard(item, s) ?? translateCard(item, s, b);
    }
    case 'respond': {
      // a dialogue row: answer its first turn, the question, not the exchange
      const q = isMultiTurn(s) ? turnView(s, 0)?.sentence : s;
      if (!q) return meaningCard(item, s, b);
      // a question to a character, to a group, or about the story cannot be answered for yourself
      // practised another way instead, and not always the same way: a block of one look is a run
      if (!askedOfYou(q.es, namesOf(b.bank), placesOf(b.bank))) {
        const way = hash32(item.id) % 3;
        return way === 0 ? meaningCard(item, s, b) : way === 1 ? typeFormCard(item, s) ?? translateCard(item, s, b) : translateCard(item, s, b);
      }
      return {
        type: 'type', key: item.id, ask: 'Answer for yourself', prompt: es(q.es), sub: en(q.en), answerLang: 'es', placeholder: 'Your answer, in Spanish',
        check: respondCheck(q, bundleLexicon(b)), retry: true, why: 'Any true answer works. Just answer the way the question asks.',
      };
    }
    case 'comprehend':
      return meaningCard(item, s, b);
    case 'read':
      return { type: 'read', key: item.id, ask: 'Read it', es: s.es, en: s.en, why: '' };
  }
}

// ---------------------------------------------------------------- timed recall

export function recallCard(item: RecallItem, b: Bundle): Card {
  const seg = b.segments(item.node)[0];
  if (!seg) return { type: 'read', key: item.id, ask: 'Have another look', es: b.node(item.node)?.es ?? '', en: b.title(item.node), why: '' };
  return {
    type: 'type', key: item.id, ask: 'Quick!', prompt: en(seg.en), answerLang: 'es', placeholder: 'In Spanish', retry: false,
    check: chunkCheck([seg.es, ...seg.accept]), why: `"${seg.en}" is ${seg.es}`,
  };
}

// ---------------------------------------------------------------- story questions

export function questionCard(key: string, q: { q: string; options?: string[]; answer: number | string }): Card {
  if (q.options?.length && typeof q.answer === 'number') {
    // right answers sit on index 0 in most files: shuffle by key (stable per chapter and index), "I don't know" stays last
    const right = q.options[q.answer];
    const pin = /^(i don'?t know|no (lo )?s[eé]|not said|none of these)$/i;
    const rest = q.options.filter((o) => !pin.test(o.trim()));
    const pinned = q.options.filter((o) => pin.test(o.trim()));
    const options = [...shuffle(rest, rng(key)), ...pinned];
    return { type: 'mcq', key, ask: 'Quick question', prompt: auto(q.q), options: sameLang(options, options.indexOf(right)), answer: options.indexOf(right), why: `The story says: ${right}.` };
  }
  const right = String(q.answer);
  const lang: Lang = looksSpanish(right) ? 'es' : 'en';
  return {
    type: 'type', key, ask: 'Quick question', prompt: auto(q.q), answerLang: lang, placeholder: 'Your answer', retry: true, why: `The story says: ${right}.`,
    check: (input) => {
      if (lang === 'en') { const r = matchEnglish(input, { en: right }); return { pass: r.pass, near: r.near, hint: r.hint, hintKind: r.hintKind, answer: right }; }
      const r = checkExact(input, answerForms(right), { accents: 'lenient', meaning: true });
      return { pass: r.pass, near: r.near, answer: right };
    },
  };
}
