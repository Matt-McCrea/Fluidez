// Turning plan items into things a learner can answer. Pure functions of
// (item, content, seed): the same item always renders the same card, so a
// reload mid-session shows the same question. Every card carries its own
// checker and ONE plain-English reason for when the learner gets it wrong.
import type { PracticeItem, RecallItem, ReviewItem, ScriptItem, LearnItem } from '../../compiler';
import type { BankSentence, NodeId, TeachingScript } from '../../content/schema';
import { answerForms, checkExact } from '../../check';
import { wordHint } from '../../check/wordhint';
import { matchEnglish, matchTranslation } from '../../check/translate';
import { analyzeToken, deaccent } from '../../engine';
import { addToLexicon, checkPersonal } from '../../check/personal';
import { bundleLexicon } from './scene';
import { verbReadings } from '../../exercises/spanish';
import {
  ALL_FEATURES, checkItem, chooseItem, form, lexGapItem, parseClause, rng, shuffle, structuredInput,
  recombinations, transformItems, translationItems, typeFormItem, type Item as ExItem,
} from '../../exercises';
import { fixBreaks, isMultiTurn, productionView, turnView, turnViews, type TurnView } from '../../exercises/dialogue';
import { englishVariants } from './engvariants';
import { hash32 } from '../../exercises/rng';
import type { Feature, RecombineItem } from '../../exercises/types';
import { looksSpanish, type Bundle } from '../data/bundle';

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
}
export interface McqCard extends CardBase { type: 'mcq'; options: Txt[]; answer: number; /** shown after answering */ after?: Txt; /** the one feature the options differ in (minimal pairs) */ feature?: Feature }
export interface TypeCard extends CardBase {
  type: 'type';
  answerLang: Lang;
  placeholder: string;
  check(input: string): Check;
  /** typed answers get one self-correction attempt (false: reveal at once) */
  retry: boolean;
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

/** Up to n other English sentences from the bank, stable for (key), never equal to the right one. */
function otherEnglish(b: Bundle, right: string, key: string, n = 2, unit?: string): string[] {
  const r = rng(key);
  const k = norm(right);
  const pool = b.bank.filter((s) => norm(s.en) !== k);
  const near = unit ? pool.filter((s) => s.unit === unit) : [];
  const picked = shuffle(near.length >= n ? near : pool, r).map((s) => s.en);
  const out: string[] = [];
  for (const p of picked) { if (!out.some((o) => norm(o) === norm(p))) out.push(p); if (out.length >= n) break; }
  return out;
}

/** Up to n other Spanish sentences from the bank (same unit when it can), never equal to the right one. */
function otherSpanish(b: Bundle, right: string, key: string, n = 2, unit?: string): string[] {
  const r = rng(`${key}:es`);
  const k = norm(right);
  const pool = b.bank.filter((s) => norm(s.es) !== k);
  const near = unit ? pool.filter((s) => s.unit === unit) : [];
  const out: string[] = [];
  for (const p of shuffle(near.length >= n ? near : pool, r).map((s) => s.es)) {
    if (!out.some((o) => norm(o) === norm(p))) out.push(p);
    if (out.length >= n) break;
  }
  return out;
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

/** Up to n distinct values from random members of a node's kind pool (stable for the key). */
function otherNodes(b: Bundle, node: NodeId, key: string, pick: (id: NodeId) => string | undefined, right: string, n: number): string[] {
  const r = rng(key);
  const pool = poolOf(b, b.node(node)?.kind);
  const band = b.node(node)?.band;
  const cands: Array<{ v: string; score: number }> = [];
  for (let tries = 0; tries < 80 && cands.length < 24 && pool.length > 1; tries++) {
    const id = pool[Math.floor(r() * pool.length)];
    if (id === node) continue;
    const v = pick(id);
    if (!v || norm(v) === norm(right) || cands.some((o) => norm(o.v) === norm(v))) continue;
    // look-alikes make a real choice: similar length, same band, same kind of sentence
    const score = Math.abs(v.length - right.length) / Math.max(4, right.length)
      + (b.node(id)?.band === band ? 0 : 0.5) + (/[?¿]/.test(v) === /[?¿]/.test(right) ? 0 : 0.3);
    cands.push({ v, score });
  }
  return cands.sort((a, c) => a.score - c.score).slice(0, n).map((c) => c.v);
}

/** Other nodes' English, for bare recognition cards. */
function otherNodeEnglish(b: Bundle, node: NodeId, right: string, key: string, n = 2): string[] {
  return otherNodes(b, node, key, (id) => b.segments(id)[0]?.en, right, n);
}

/** Other nodes' Spanish (same kind), for "pick the Spanish" cards. */
function otherNodeSpanish(b: Bundle, node: NodeId, right: string, key: string, n = 2): string[] {
  return otherNodes(b, node, `${key}:es`, (id) => b.segments(id)[0]?.es, right, n);
}

function mcq(key: string, ask: string, prompt: Txt | undefined, right: Txt, wrong: Txt[], why: string, extra: Partial<McqCard> = {}): McqCard {
  const r = rng(key);
  const lang = [right, ...wrong].every((t) => t.lang === right.lang) ? null : right.lang;
  const opts = shuffle([right, ...wrong], r).map((t) => (lang ? { ...t, lang } : t));
  return { type: 'mcq', key, ask, prompt, options: opts, answer: opts.findIndex((t) => t.text === right.text), why, ...extra };
}

// ---------------------------------------------------------------- checkers

/** A whole Spanish sentence, from English: the translation matcher. */
export function sentenceCheck(s: Pick<BankSentence, 'es' | 'en' | 'accept'>) {
  return (input: string): Check => {
    const r = matchTranslation(input, { es: s.es, en: s.en, accept: s.accept });
    return { pass: r.pass, near: r.near, hint: r.hint, hintKind: r.hintKind, answer: r.pass ? s.es : r.closest, variant: r.variant };
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
function itemCheck(item: ExItem, want?: string) {
  return (input: string): Check => {
    const r = checkItem(item, input);
    if (!r.pass && !r.near && !r.hint && (item.kind === 'typeForm' || item.kind === 'lexGap')) {
      const w = wordHint(input, [item.answer, ...item.accept], item.kind === 'lexGap' ? want : undefined);
      if (w) return { pass: false, hint: w.hint, hintKind: w.kind, answer: r.answer };
    }
    return { pass: r.pass, near: r.near, hint: r.hint, answer: r.answer, variant: r.variant };
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
  const base = { type: 'type' as const, key, answerLang: 'es' as const, placeholder: 'Type it in Spanish', check, retry: true, why };
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
      return { pass: r.pass, near: r.near, hint: r.hint, answer: r.pass ? en : r.closest };
    },
  };
}

/**
 * A review. A receptive one is asked three ways, rotated per node and session
 * (`receptiveFormat`): type the English, pick the English (the wrong options
 * are the same sentence about someone else or another time when the engine can
 * say so), or "which one says this?". `variant` 'pickSpanish' forces the last,
 * so a warm-up of receptive reviews is not one long run of the same look.
 * `session` (a number) makes a node's look change from one session to the next.
 */
export function reviewCard(item: ReviewItem, b: Bundle, variant: 'meaning' | 'pickSpanish' = 'meaning', session?: number): Card {
  const s = b.sentence(item.sentence);
  const seg = b.segments(item.node)[0];
  const title = b.title(item.node);
  const fmt: ReceptiveFormat = item.direction === 'receptive'
    ? (variant === 'pickSpanish' ? 'pickEs' : receptiveFormat(item.node, session ?? item.id))
    : 'pickFeature';
  if (s && item.direction === 'receptive') {
    const why = seg ? `${seg.es} means "${seg.en}". The rest of the sentence gives the context.` : `This is about: ${title.toLowerCase()}.`;
    if (fmt === 'typeEn' && !isMultiTurn(s) && wordCount(s.en) <= 14) return typeMeaning(item.id, s.es, s.en, s.acceptEn ?? [], why);
    if (fmt === 'pickEs' && !isMultiTurn(s)) {
      const wrong = otherSpanish(b, s.es, item.id, 3, s.unit);
      const use = wrong.length >= 3 ? wrong : wrong.length >= 2 ? wrong.slice(0, 2) : [];
      if (use.length) return mcq(item.id, 'Which one says this?', en(s.en), es(s.es), use.map(es), seg ? `${seg.es} means "${seg.en}".` : `It's ${s.es}`);
    }
    const vars = isMultiTurn(s) ? null : englishVariants(s, item.id);
    if (vars) return mcq(item.id, MEANS, es(s.es), en(s.en), vars.map(en), why);
    if (fmt === 'pickFeature' && !isMultiTurn(s)) {
      // nothing re-inflects: ask it the other way round, with four options when there are
      const alt = otherSpanish(b, s.es, item.id, 3, s.unit);
      if (alt.length >= 3) return mcq(item.id, 'Which one says this?', en(s.en), es(s.es), alt.map(es), seg ? `${seg.es} means "${seg.en}".` : `It's ${s.es}`);
    }
    return mcq(item.id, MEANS, es(s.es), en(s.en), otherEnglish(b, s.en, item.id, 2, s.unit).map(en), why);
  }
  const v = s ? productionView(s, preferFor(b, item.node)) : null;
  if (s && v) {
    return sayCard(item.id, v, sentenceCheck(v.sentence), seg ? `It uses ${seg.es} (${lcFirst(seg.en)}).` : 'Here is how Spanish says it.');
  }
  if (s) {
    // turns that do not line up: recognise the exchange instead
    return mcq(item.id, MEANS, es(s.es), en(s.en), otherEnglish(b, s.en, item.id, 2, s.unit).map(en),
      seg ? `${seg.es} means "${seg.en}". The rest gives the context.` : `This is about: ${title.toLowerCase()}.`);
  }
  // bare card: no fresh sentence left for this node
  if (!seg) return { type: 'read', key: item.id, ask: 'Remember this one?', es: b.node(item.node)?.es ?? title, en: title, why: '' };
  if (item.direction === 'receptive') {
    if (fmt === 'typeEn' && wordCount(seg.en) <= 6) return typeMeaning(item.id, seg.es, seg.en, [], `${seg.es} means "${seg.en}".`);
    if (fmt === 'pickEs') {
      const wrong = otherNodeSpanish(b, item.node, seg.es, item.id, 3);
      const use = wrong.length >= 3 ? wrong : wrong.slice(0, 2);
      if (use.length >= 2) return mcq(item.id, 'Which one says this?', en(seg.en), es(seg.es), use.map(es), `"${seg.en}" is ${seg.es}`);
    }
    return mcq(item.id, MEANS, es(seg.es), en(seg.en), otherNodeEnglish(b, item.node, seg.en, item.id).map(en), `${seg.es} means "${seg.en}".`);
  }
  return {
    type: 'type', key: item.id, ask: SAY, prompt: en(seg.en), answerLang: 'es', placeholder: 'Type it in Spanish',
    check: chunkCheck([seg.es, ...seg.accept]), retry: true, why: `"${seg.en}" is ${seg.es}`,
  };
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
export function learnRetrieval(item: LearnItem, b: Bundle, round: number): Card {
  const segs = b.segments(item.node);
  const seg = segs[round % Math.max(1, segs.length)] ?? segs[0];
  const key = `${item.id}#${round}`;
  if (!seg) return { type: 'read', key, ask: 'Have another look', es: b.node(item.node)?.es ?? b.title(item.node), en: b.title(item.node), why: '' };
  const why = `"${seg.en}" is ${seg.es}`;
  // round 1 of a short word: "pick the Spanish" is nearly free, so type what it means
  if (round === 1 && b.node(item.node)?.kind === 'lexeme' && wordCount(seg.en) <= 2) {
    return typeMeaning(key, seg.es, seg.en, [], `${seg.es} means "${seg.en}".`);
  }
  switch (learnFormat(round, item.productive !== false)) {
    case 'recognise':
      return mcq(key, MEANS, es(seg.es), en(seg.en), otherNodeEnglish(b, item.node, seg.en, key).map(en), `${seg.es} means "${seg.en}".`);
    case 'pickSpanish': {
      const wrong = otherNodeSpanish(b, item.node, seg.es, key);
      if (wrong.length >= 2) return mcq(key, SAY, en(seg.en), es(seg.es), wrong.map(es), why);
      break;
    }
    case 'type':
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
      const m = matchTranslation(input, { es: yt.answer, en: cue.replace(/^[^:]*:\s*/, ''), accept: yt.accept });
      if (m.pass) return { pass: true, near: m.near, answer: yt.answer, variant: m.variant };
      return { pass: false, near: exact.near || m.near, hint: exact.near ? 'Check the accents.' : m.hint, hintKind: exact.near ? 'accents' : m.hintKind, answer: yt.answer };
    },
  };
}

// ---------------------------------------------------------------- practice on bank sentences

function meaningCard(item: PracticeItem, s: BankSentence, b: Bundle, ask = 'What does this mean?'): McqCard {
  const seg = b.segments(item.node)[0];
  return mcq(item.id, ask, es(s.es), en(s.en), otherEnglish(b, s.en, item.id, 2, s.unit).map(en),
    seg ? `${seg.es} means "${seg.en}".` : `It means "${s.en}".`);
}

function translateCard(item: PracticeItem, s: BankSentence, b: Bundle): Card {
  const prefer = preferFor(b, item.node);
  const v = productionView(s, prefer);
  const [t] = translationItems(s, { dirs: ['en-es'], bank: b.bank, prefer });
  if (!v || !t) return meaningCard(item, s, b);
  return sayCard(item.id, v, itemCheck(t), 'Here is how Spanish says it.');
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
  const sample = want ? `${want[0].toUpperCase()}${want.slice(1)} …` : 'Mi respuesta es …';
  return (input: string): Check => {
    const words = input.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) return { pass: false, hint: 'Try a full sentence. Two or three words is plenty.', answer: sample };
    // most of it must be Spanish, whatever the question
    const share = checkPersonal(input, { lexicon: lex, noForm: true });
    if (!share.pass) return { pass: false, hint: share.hint, answer: sample };
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
export function recombineCard(item: PracticeItem, s: BankSentence, b: Bundle, seed: number): Card | undefined {
  const r = rng(`${seed}:${item.id}:recombine`);
  const all = recombinations(s, { seed: item.id, bank: b.bank });
  const rank = (x: RecombineItem) => (x.mode === 'production' ? (x.id.endsWith('+negate') ? 0 : 2) : x.transform.op === 'pronoun' ? 1 : 4);
  const items = all.filter((x) => x.mode === 'production' || x.options?.length);
  if (!items.length) return undefined;
  const best = Math.min(...items.map(rank));
  const pool = items.filter((x) => rank(x) === best);
  const it = pool[Math.floor(r() * pool.length)];
  const view = turnViews(s).find((v) => parseClause(v.sentence.es, v.sentence.en));
  const known = view?.sentence ?? s;
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
    check: itemCheck(it), retry: true, why: `${it.es}. Same sentence, new ${what}.`,
  };
}

export function practiceCard(item: PracticeItem, b: Bundle, seed: number): Card {
  const s = b.sentence(item.sentence);
  if (!s) return { type: 'read', key: item.id, ask: 'Have a look', es: b.node(item.node)?.es ?? '', en: b.title(item.node), why: '' };
  const r = rng(`${seed}:${item.id}`);
  switch (item.op) {
    case 'pick': {
      for (const f of shuffle([...ALL_FEATURES], r)) {
        const it = structuredInput(s, f, { seed: item.id });
        if (it) {
          return {
            type: 'mcq', key: item.id, ask: 'Read and pick', prompt: en(it.question), options: it.options.map(es), answer: it.answer, why: it.why,
            ...(it.en ? { after: en(it.en) } : {}), feature: it.feature,
          };
        }
      }
      return meaningCard(item, s, b, 'Read and pick: what does it mean?');
    }
    case 'choose': {
      const it = chooseItem(s, { seed: item.id });
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
      const it = transformItems(s)[0];
      if (it) {
        return {
          type: 'type', key: item.id, ask: it.instruction, prompt: es(it.source), answerLang: 'es', placeholder: 'Rewrite it',
          check: itemCheck(it), retry: true, why: `${it.instruction.replace(/\.$/, '')}: ${it.answer}`,
        };
      }
      return translateCard(item, s, b);
    }
    case 'recombine':
      return recombineCard(item, s, b, seed) ?? practiceCard({ ...item, op: 'transform' }, b, seed);
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
  if (!seg) return { type: 'read', key: item.id, ask: 'Remember this?', es: b.node(item.node)?.es ?? '', en: b.title(item.node), why: '' };
  return {
    type: 'type', key: item.id, ask: 'Quick!', prompt: en(seg.en), answerLang: 'es', placeholder: 'In Spanish', retry: false,
    check: chunkCheck([seg.es, ...seg.accept]), why: `"${seg.en}" is ${seg.es}`,
  };
}

// ---------------------------------------------------------------- story questions

export function questionCard(key: string, q: { q: string; options?: string[]; answer: number | string }): Card {
  if (q.options?.length && typeof q.answer === 'number') {
    return { type: 'mcq', key, ask: 'Quick question', prompt: auto(q.q), options: sameLang(q.options, q.answer), answer: q.answer, why: `The story says: ${q.options[q.answer]}.` };
  }
  const right = String(q.answer);
  const lang: Lang = looksSpanish(right) ? 'es' : 'en';
  return {
    type: 'type', key, ask: 'Quick question', prompt: auto(q.q), answerLang: lang, placeholder: 'Your answer', retry: true, why: `The story says: ${right}.`,
    check: (input) => {
      if (lang === 'en') { const r = matchEnglish(input, { en: right }); return { pass: r.pass, near: r.near, hint: r.hint, answer: right }; }
      const r = checkExact(input, answerForms(right), { accents: 'lenient', meaning: true });
      return { pass: r.pass, near: r.near, answer: right };
    },
  };
}
