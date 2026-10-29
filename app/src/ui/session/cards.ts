// Turning plan items into things a learner can answer. Pure functions of
// (item, content, seed): the same item always renders the same card, so a
// reload mid-session shows the same question. Every card carries its own
// checker and ONE plain-English reason for when the learner gets it wrong.
import type { PracticeItem, RecallItem, ReviewItem, ScriptItem, LearnItem } from '../../compiler';
import type { BankSentence, NodeId, TeachingScript } from '../../content/schema';
import { answerForms, checkExact } from '../../check';
import { matchEnglish, matchTranslation } from '../../check/translate';
import { deaccent } from '../../engine';
import {
  ALL_FEATURES, checkItem, chooseItem, form, lexGapItem, parseClause, rng, shuffle, structuredInput,
  transformItems, translationItems, typeFormItem, type Item as ExItem,
} from '../../exercises';
import { looksSpanish, type Bundle } from '../data/bundle';

export type Lang = 'es' | 'en';
export interface Txt { text: string; lang: Lang }

export interface Check {
  pass: boolean;
  /** right apart from accents */
  near?: boolean;
  /** one plain-English hint for the retry */
  hint?: string;
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
export interface McqCard extends CardBase { type: 'mcq'; options: Txt[]; answer: number; /** shown after answering */ after?: Txt }
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

const es = (text: string): Txt => ({ text, lang: 'es' });
const en = (text: string): Txt => ({ text, lang: 'en' });
const auto = (text: string): Txt => ({ text, lang: looksSpanish(text) ? 'es' : 'en' });

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
  const opts = shuffle([right, ...wrong], r);
  return { type: 'mcq', key, ask, prompt, options: opts, answer: opts.indexOf(right), why, ...extra };
}

// ---------------------------------------------------------------- checkers

/** A whole Spanish sentence, from English: the translation matcher. */
export function sentenceCheck(s: Pick<BankSentence, 'es' | 'en' | 'accept'>) {
  return (input: string): Check => {
    const r = matchTranslation(input, { es: s.es, en: s.en, accept: s.accept });
    return { pass: r.pass, near: r.near, hint: r.hint, answer: r.pass ? s.es : r.closest, variant: r.variant };
  };
}

/** A word or chunk: strict on letters, lenient on accents (an English keyboard). `answers[0]` is the one shown. */
export function chunkCheck(answers: string[]) {
  const list = [...new Set(answers.flatMap((a) => answerForms(a)))];
  return (input: string): Check => {
    const r = checkExact(input, list, { accents: 'lenient' });
    return { pass: r.pass, near: r.near, hint: r.near && !r.pass ? 'Check the accents.' : undefined, answer: answers[0] ?? list[0] ?? '' };
  };
}

function itemCheck(item: ExItem) {
  return (input: string): Check => {
    const r = checkItem(item, input);
    return { pass: r.pass, near: r.near, hint: r.hint, answer: r.answer, variant: r.variant };
  };
}

// ---------------------------------------------------------------- reviews (warm-up, leech)

/**
 * A review. `variant` 'pickSpanish' turns a receptive review into "which
 * Spanish says this?" (still recognition, a different look), so a warm-up of
 * receptive reviews is not one long run of the same card.
 */
export function reviewCard(item: ReviewItem, b: Bundle, variant: 'meaning' | 'pickSpanish' = 'meaning'): Card {
  const s = b.sentence(item.sentence);
  const seg = b.segments(item.node)[0];
  const title = b.title(item.node);
  if (s && item.direction === 'receptive' && variant === 'pickSpanish') {
    const wrong = otherSpanish(b, s.es, item.id, 2, s.unit);
    if (wrong.length >= 2) {
      return mcq(item.id, 'Which one says this?', en(s.en), es(s.es), wrong.map(es),
        seg ? `${seg.es} means "${seg.en}".` : `It's ${s.es}`);
    }
  }
  if (s && item.direction === 'receptive') {
    return mcq(item.id, MEANS, es(s.es), en(s.en), otherEnglish(b, s.en, item.id, 2, s.unit).map(en),
      seg ? `${seg.es} means "${seg.en}". The rest of the sentence gives the context.` : `This is about: ${title.toLowerCase()}.`);
  }
  if (s) {
    return {
      type: 'type', key: item.id, ask: SAY, prompt: en(s.en), answerLang: 'es', placeholder: 'Type it in Spanish',
      check: sentenceCheck(s), retry: true, why: seg ? `It uses ${seg.es} (${lcFirst(seg.en)}).` : 'Here is how Spanish says it.',
    };
  }
  // bare card: no fresh sentence left for this node
  if (!seg) return { type: 'read', key: item.id, ask: 'Remember this one?', es: b.node(item.node)?.es ?? title, en: title, why: '' };
  if (item.direction === 'receptive') {
    if (variant === 'pickSpanish') {
      const wrong = otherNodeSpanish(b, item.node, seg.es, item.id);
      if (wrong.length >= 2) return mcq(item.id, 'Which one says this?', en(seg.en), es(seg.es), wrong.map(es), `"${seg.en}" is ${seg.es}`);
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
    const opts = rp.options.map(auto);
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
      return { pass: false, near: exact.near || m.near, hint: exact.near ? 'Check the accents.' : m.hint, answer: yt.answer };
    },
  };
}

// ---------------------------------------------------------------- practice on bank sentences

function meaningCard(item: PracticeItem, s: BankSentence, b: Bundle, ask = 'What does this mean?'): McqCard {
  const seg = b.segments(item.node)[0];
  return mcq(item.id, ask, es(s.es), en(s.en), otherEnglish(b, s.en, item.id, 2, s.unit).map(en),
    seg ? `${seg.es} means "${seg.en}".` : `It means "${s.en}".`);
}

function translateCard(item: PracticeItem, s: BankSentence, b: Bundle): TypeCard {
  const [t] = translationItems(s, { dirs: ['en-es'], bank: b.bank });
  return {
    type: 'type', key: item.id, ask: SAY, prompt: en(s.en), answerLang: 'es', placeholder: 'Type it in Spanish', retry: true,
    check: t ? itemCheck(t) : sentenceCheck(s), why: 'Here is how Spanish says it.',
  };
}

function typeFormCard(item: PracticeItem, s: BankSentence): TypeCard | undefined {
  const t = typeFormItem(s);
  if (!t) return undefined;
  return {
    type: 'type', key: item.id, ask: 'Fill the gap', prompt: es(t.gapped), sub: en(`${t.en}  ${t.cue}`), answerLang: 'es', placeholder: 'The missing word',
    check: itemCheck(t), retry: true, why: `The English says "${t.en}", so the gap is ${t.answer}.`,
  };
}

/** The question asked of you → the yo form that answers it (eres → soy). */
export function respondCheck(question: BankSentence) {
  const c = parseClause(question.es, question.en);
  const asked = c && (c.choice.person === 'tú' || c.choice.person === 'él/ella') ? c : null;
  const want = asked ? form(asked.choice.inf, asked.choice.tense, 'yo') : null;
  const said = asked ? asked.toks[asked.verb].core : '';
  return (input: string): Check => {
    const words = input.trim().split(/\s+/).filter(Boolean);
    const model = want ? `${want[0].toUpperCase()}${want.slice(1)} …` : 'A short, true sentence.';
    if (words.length < 2) return { pass: false, hint: 'Try a full sentence. Two or three words is plenty.', answer: model };
    if (!want || asked!.choice.person !== 'tú') return { pass: true, answer: input };
    const hit = words.some((w) => deaccent(w.toLowerCase().replace(/[^\p{L}]/gu, '')) === deaccent(want));
    return hit ? { pass: true, answer: input } : {
      pass: false, hint: `They asked with ${said} (you), so answer with ${want} (I).`, answer: `${want[0].toUpperCase()}${want.slice(1)} …`,
    };
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
            ...(it.en ? { after: en(it.en) } : {}),
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
          options: it.options.map(es), answer: it.answer, why: `The English says "${it.en}", so it's ${it.options[it.answer]}.`,
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
    case 'translate':
      return translateCard(item, s, b);
    case 'gap': {
      const lex = b.lexemeLike(item.node);
      const it = lex ? lexGapItem(lex, s) : null;
      if (it) {
        return {
          type: 'type', key: item.id, ask: 'Fill the gap with the new word', prompt: es(it.gapped), sub: en(`${it.en}  ${it.cue}`), answerLang: 'es', placeholder: 'The missing word',
          check: itemCheck(it), retry: true, why: `"${lex!.en}" is ${lex!.es}.`,
        };
      }
      return typeFormCard(item, s) ?? translateCard(item, s, b);
    }
    case 'respond':
      return {
        type: 'type', key: item.id, ask: 'Answer for yourself', prompt: es(s.es), sub: en(s.en), answerLang: 'es', placeholder: 'Your answer, in Spanish',
        check: respondCheck(s), retry: true, why: 'Any true answer works. Just answer the way the question asks.',
      };
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
    return { type: 'mcq', key, ask: 'Quick question', prompt: auto(q.q), options: q.options.map(auto), answer: q.answer, why: `The story says: ${q.options[q.answer]}.` };
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
