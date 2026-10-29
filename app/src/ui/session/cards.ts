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

/** Other nodes' English, for bare recognition cards. */
function otherNodeEnglish(b: Bundle, node: NodeId, right: string, key: string, n = 2): string[] {
  const r = rng(key);
  const kind = b.node(node)?.kind;
  const pool = [...b.course.nodes.values()].filter((x) => x.id !== node && x.kind === kind && x.en);
  const out: string[] = [];
  for (const x of shuffle(pool, r)) {
    const seg = b.segments(x.id)[0]?.en ?? x.en!;
    if (norm(seg) !== norm(right) && !out.some((o) => norm(o) === norm(seg))) out.push(seg);
    if (out.length >= n) break;
  }
  return out;
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

/** A word or chunk: strict on letters, lenient on accents (an English keyboard). */
export function chunkCheck(answers: string[]) {
  const list = [...new Set(answers.flatMap((a) => answerForms(a)))];
  return (input: string): Check => {
    const r = checkExact(input, list, { accents: 'lenient' });
    return { pass: r.pass, near: r.near, hint: r.near && !r.pass ? 'Check the accents.' : undefined, answer: list[0] ?? answers[0] ?? '' };
  };
}

function itemCheck(item: ExItem) {
  return (input: string): Check => {
    const r = checkItem(item, input);
    return { pass: r.pass, near: r.near, hint: r.hint, answer: r.answer, variant: r.variant };
  };
}

// ---------------------------------------------------------------- reviews (warm-up, leech)

export function reviewCard(item: ReviewItem, b: Bundle): Card {
  const s = b.sentence(item.sentence);
  const seg = b.segments(item.node)[0];
  const title = b.title(item.node);
  if (s && item.direction === 'receptive') {
    return mcq(item.id, 'Remember what this means?', es(s.es), en(s.en), otherEnglish(b, s.en, item.id, 2, s.unit).map(en),
      seg ? `${seg.es} means "${seg.en}". The rest of the sentence gives the context.` : `This is about: ${title.toLowerCase()}.`);
  }
  if (s) {
    return {
      type: 'type', key: item.id, ask: 'How would you say this?', prompt: en(s.en), answerLang: 'es', placeholder: 'Type it in Spanish',
      check: sentenceCheck(s), retry: true, why: seg ? `It uses ${seg.es} (${seg.en.toLowerCase()}).` : 'Here is how Spanish says it.',
    };
  }
  // bare card: no fresh sentence left for this node
  if (!seg) return { type: 'read', key: item.id, ask: 'Remember this one?', es: b.node(item.node)?.es ?? title, en: title, why: '' };
  if (item.direction === 'receptive') {
    return mcq(item.id, 'Remember what this means?', es(seg.es), en(seg.en), otherNodeEnglish(b, item.node, seg.en, item.id).map(en), `${seg.es} means "${seg.en}".`);
  }
  return {
    type: 'type', key: item.id, ask: `Remember how to say this?`, prompt: en(seg.en), answerLang: 'es', placeholder: 'Type it in Spanish',
    check: chunkCheck(b.segments(item.node).map((x) => x.es)), retry: true, why: `"${seg.en}" is ${seg.es}`,
  };
}

// ---------------------------------------------------------------- new words and phrases

export function learnRetrieval(item: LearnItem, b: Bundle, round: number): Card {
  const segs = b.segments(item.node);
  const seg = segs[round % Math.max(1, segs.length)] ?? segs[0];
  const key = `${item.id}#${round}`;
  if (!seg) return { type: 'read', key, ask: 'Have another look', es: b.node(item.node)?.es ?? b.title(item.node), en: b.title(item.node), why: '' };
  if (round === 0) {
    return mcq(key, 'Which one means this?', es(seg.es), en(seg.en), otherNodeEnglish(b, item.node, seg.en, key).map(en), `${seg.es} means "${seg.en}".`);
  }
  return {
    type: 'type', key, ask: 'How do you say this?', prompt: en(seg.en), answerLang: 'es', placeholder: 'Type it in Spanish',
    check: chunkCheck(segs.map((x) => x.es)), retry: true, why: `"${seg.en}" is ${seg.es}`,
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
  return {
    type: 'type', key: item.id, ask: 'Your turn', prompt: en(yt.prompt), answerLang: 'es', placeholder: 'Type it in Spanish', retry: true, why: yt.why,
    check: (input) => {
      const exact = checkExact(input, answers);
      if (exact.pass) return { pass: true, answer: yt.answer };
      const m = matchTranslation(input, { es: yt.answer, en: yt.prompt.replace(/^[^:]*:\s*/, ''), accept: yt.accept });
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
    type: 'type', key: item.id, ask: 'How would you say this?', prompt: en(s.en), answerLang: 'es', placeholder: 'Type it in Spanish', retry: true,
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
    check: chunkCheck(b.segments(item.node).map((x) => x.es)), why: `"${seg.en}" is ${seg.es}`,
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
