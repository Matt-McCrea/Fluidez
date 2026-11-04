// Per-item checks for the old-app gate. Pure functions where possible so the tests can use small fixtures.
import { VERBS, TENSES, PERSONS, IMP_PERSONS, conjugate, personsFor, verbByInf, analyzeToken, deaccent, isCompound, participles, gerund } from '../../lib/engine';
import type { TenseKey } from '../../lib/engine';
import { BY_FIRST, BY_VERB, tokenizeWords, type W } from './dialect';
import { clip, type Finding } from './findings';

/* ---- dashes ------------------------------------------------------------------ */
export const DASH = /[—–]|\s-\s|^-\s|\s-$/;
export const hasDash = (s: string) => DASH.test(s);

/* ---- accent ------------------------------------------------------------------ */
const INTERROG = new Map(Object.entries({ que: 'qué', como: 'cómo', donde: 'dónde', cuando: 'cuándo', quien: 'quién', quienes: 'quiénes', cual: 'cuál', cuales: 'cuáles', cuanto: 'cuánto', cuanta: 'cuánta', cuantos: 'cuántos', cuantas: 'cuántas', adonde: 'adónde' }));
const PREP_BEFORE_INT = new Set(['de', 'a', 'por', 'para', 'con', 'en', 'desde', 'hasta', 'sin']);
// function words whose bare spelling is right and merely collides with a verb form; names that collide with the engine
const KNOWN_CORRECT = new Set(['fábricas', 'tomás', 'de', 'se', 'esta', 'estas', 'hacia', 'solo', 'si', 'aun', 'mas', 'te', 'mi', 'tu', 'el', 'alimentaria', 'alimentarias', 'serias']);

let ENGINE_DEAC: Map<string, Set<string>> | null = null;
let LEX: Set<string> | null = null;
const splitWords = (s: string) => s.toLowerCase().split(/[^a-záéíóúñü]+/).filter(Boolean);

/** Builds the engine-adjudicated paradigm map and the known-good lexicon (as lint-spanish.js did). Call once. */
export function buildAccentLexicon(extraTexts: Iterable<string>): void {
  const m = new Map<string, Set<string>>();
  const lex = new Set<string>();
  const addEngine = (f: string) => {
    for (const w of splitWords(f)) {
      lex.add(w);
      const d = deaccent(w);
      const s = m.get(d); if (s) s.add(w); else m.set(d, new Set([w]));
    }
  };
  for (const v of VERBS) {
    addEngine(v.inf);
    for (const t of TENSES) {
      if (isCompound(t.key)) continue;
      try { conjugate(v, t.key).forEach((f) => f && addEngine(f)); } catch { /* tense n/a */ }
    }
    try { participles(v).forEach(addEngine); addEngine(gerund(v)); } catch { /* n/a */ }
  }
  for (const t of extraTexts) for (const w of splitWords(t)) lex.add(w);
  ENGINE_DEAC = m; LEX = lex;
}

export interface AccentHit { word: string; problem: string; fix: string; severity: 'error' | 'warning' }

export function accentLint(text: string): AccentHit[] {
  if (!ENGINE_DEAC || !LEX) buildAccentLexicon([]);
  const E = ENGINE_DEAC!, lex = LEX!;
  const out: AccentHit[] = [];
  const toks = [...text.matchAll(/[¿¡]|[A-Za-záéíóúñüÁÉÍÓÚÑÜ]+/g)].map((m) => m[0]);
  for (let i = 0; i < toks.length; i++) {
    const raw = toks[i];
    if (raw === '¿' || raw === '¡') continue;
    const x = raw.toLowerCase();
    const p = toks[i - 1], pp = toks[i - 2], nx = toks[i + 1]?.toLowerCase();
    const qHead = p === '¿' || p === '¡' || (p && PREP_BEFORE_INT.has(p.toLowerCase()) && (pp === '¿' || pp === '¡'));
    if (INTERROG.has(x) && qHead) {
      // "¡Que te mejores!" is a wish and "¿Que sí?" an echo question: que and cuando after ¿ are only a warning
      const wish = x === 'que' && (p === '¡' || nx === 'no' || nx === 'se' || nx === 'te' || nx === 'le' || nx === 'me' || nx === 'si');
      if (!wish) { out.push({ severity: x === 'que' || x === 'cuando' ? 'warning' : 'error', word: raw, problem: `interrogative "${x}" without its accent`, fix: INTERROG.get(x)! }); continue; }
    }
    if (x === 'porque' && p === '¿') { out.push({ severity: 'error', word: raw, problem: '"¿porque" in a question', fix: '¿por qué' }); continue; }
    if (lex.has(x) || KNOWN_CORRECT.has(x) || x.length < 3) continue;
    if (/[A-ZÁÉÍÓÚÑÜ]/.test(raw[0]) && i > 0 && toks[i - 1] !== '¿' && toks[i - 1] !== '¡') continue;   // a name mid-sentence
    if (!/[áéíóú]/.test(x)) {
      const cands = E.get(deaccent(x));
      if (cands && cands.size && !cands.has(x)) out.push({ severity: 'error', word: raw, problem: `"${x}" is not a form; the engine has`, fix: [...cands].join(' / ') });
    }
  }
  // inverted punctuation
  for (const s of text.split(/(?<=[.?!…])(?:\s+|(?=[—–-]))/)) {
    const fragment = s.split(/\s+/).length <= 2 || /\.\.\.|…|[+/]/.test(s) || /\b(the|you|your|are|what|where|how|and|is|do|did)\b/i.test(s);
    if (fragment) continue;
    if (/\?/.test(s) && !/¿/.test(s)) out.push({ severity: 'error', word: s.slice(0, 40), problem: 'question without an opening "¿"', fix: 'add ¿ at the start of the question' });
    if (/!/.test(s) && !/¡/.test(s)) out.push({ severity: 'warning', word: s.slice(0, 40), problem: 'exclamation without an opening "¡"', fix: 'add ¡ at the start of the exclamation' });
  }
  return out;
}

/* ---- dialect ----------------------------------------------------------------- */
const AN = new Map<string, ReturnType<typeof analyzeToken>>();
const analyses = (t: string) => { let a = AN.get(t); if (!a) { a = analyzeToken(t); if (AN.size > 60000) AN.clear(); AN.set(t, a); } return a; };

let NOUNS: ReadonlySet<string> = new Set();
/** Words known as nouns (vocab), so a vosotros-looking imperative like "sed" or "dificultad" is not read as a verb. */
export function setKnownNouns(words: Iterable<string>): void { NOUNS = new Set(words); }

export interface DialectHit { word: string; rule: string; problem: string; fix: string }

export function dialectLint(text: string): DialectHit[] {
  const w: W[] = tokenizeWords(text);
  const out: DialectHit[] = [];
  for (let i = 0; i < w.length; i++) {
    const t = w[i];
    if (t.punct) continue;
    if (t.w === 'vosotros' || t.w === 'vosotras') out.push({ word: t.text, rule: 'vosotros', problem: 'vosotros pronoun', fix: 'ustedes' });
    else if (t.w === 'os') out.push({ word: t.text, rule: 'vosotros', problem: '"os" (vosotros pronoun)', fix: 'les / los / se' });
    else if (/^vuestr[oa]s?$/.test(t.w)) out.push({ word: t.text, rule: 'vosotros', problem: 'vosotros possessive', fix: 'su / sus' });
    else if (t.w === 'vos' && !t.sentStart) out.push({ word: t.text, rule: 'voseo', problem: '"vos" (voseo)', fix: 'tú' });
    const an = analyses(t.w);
    if (an.length && an.every((a) => a.variety) && !NOUNS.has(t.w)) {
      const a = an[0];
      out.push({ word: t.text, rule: a.variety!, problem: `${a.variety} form of ${a.inf} (${a.tense})`, fix: 'use the tú / ustedes form' });
    }
    for (const e of BY_FIRST.get(t.w) ?? []) {
      const parts = e.forms.find((f) => f.split(' ').every((p, k) => w[i + k]?.w === p) && f.split(' ')[0] === t.w);
      if (!parts) continue;
      if (e.when && !e.when(w, i)) continue;
      out.push({ word: parts, rule: 'lexicon', problem: `Peninsular "${parts}" (${e.severity})`, fix: e.fix });
      break;
    }
    if (an.length && !BY_FIRST.get(t.w)) {
      for (const a of an) {
        const e = BY_VERB.get(a.inf.replace(/se$/, '')) ?? BY_VERB.get(a.inf);
        if (e && an.every((x) => BY_VERB.has(x.inf.replace(/se$/, '')) || BY_VERB.has(x.inf))) { out.push({ word: t.text, rule: 'lexicon', problem: `Peninsular verb ${a.inf} (${e.severity})`, fix: e.fix }); break; }
      }
    }
  }
  return out;
}

/* ---- typeable ---------------------------------------------------------------- */
const UNTYPEABLE = /[()[\]{}<>/_|*#…]|\.\.\./;

/** Ported from js/checker.js: every form a learner may type for a card's answer. */
export function answerForms(back: unknown): string[] {
  const raw = String(back == null ? '' : back).replace(/\s+/g, ' ').trim();
  if (!raw) return [];
  const out: string[] = [], seen = new Set<string>();
  const add = (x: string) => {
    const t = x.replace(/\s+/g, ' ').replace(/\s+([,;.:])/g, '$1').replace(/^[\s,;]+|[\s,;]+$/g, '').trim();
    if (!t) return;
    const k = t.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(t); }
  };
  add(raw);
  const SUFFIX = /(\S)\(([^)\s]{1,4})\)/;
  if (SUFFIX.test(raw)) { add(raw.replace(/\(([^)\s]{1,4})\)/g, '')); add(raw.replace(/\(([^)\s]{1,4})\)/g, '$1')); }
  if (/\([^)]*\)/.test(raw)) {
    add(raw.replace(/\([^)]*\)/g, ' '));
    for (const g of raw.match(/\(([^)]*)\)/g) ?? []) {
      const inner = g.slice(1, -1).trim();
      if (inner && inner.split(/\s+/).length === 1 && !SUFFIX.test(raw)) add(inner);
    }
  }
  if (/\//.test(raw) && (/\s\/|\/\s/.test(raw) || !/\s/.test(raw))) {
    for (let part of raw.split('/')) {
      part = part.trim();
      if (!part || part.split(/\s+/).length > 4) continue;
      add(part); add(part.replace(/\([^)]*\)/g, ' '));
    }
  }
  return out;
}

export function isTypeable(answer: unknown): boolean {
  return answerForms(answer).some((x) => x.trim() && !UNTYPEABLE.test(x) && /[a-záéíóúñü0-9]/i.test(x) && x.length <= 240);
}

/** The cell a cloze item expects, from the engine; null when the verb, tense or person does not resolve. */
export function clozeAnswer(item: { inf?: string; tense?: string; person?: string }): string | null {
  if (!item.inf || !item.tense || !item.person) return null;
  const v = verbByInf(item.inf);
  if (!v) return null;
  try {
    const t = item.tense as TenseKey;
    const idx = (personsFor(t) as readonly string[]).indexOf(item.person);
    if (idx < 0) return null;
    return conjugate(v, t)[idx] || null;
  } catch { return null; }
}
export { PERSONS, IMP_PERSONS };

/* ---- options (longest-option bias) -------------------------------------------- */
export interface Choice { options: readonly string[]; answer: number }

export function longestShare(options: readonly string[], answer: number): number {
  const most = Math.max(...options.map((o) => o.length));
  const tied = options.flatMap((o, i) => (o.length === most ? [i] : []));
  return tied.includes(answer) ? 1 / tied.length : 0;
}
export function shortestShare(options: readonly string[], answer: number): number {
  const least = Math.min(...options.map((o) => o.length));
  const tied = options.flatMap((o, i) => (o.length === least ? [i] : []));
  return tied.includes(answer) ? 1 / tied.length : 0;
}
/** The correct option is at least 1.5 times as long as every other option. */
export function dominantLength(options: readonly string[], answer: number): boolean {
  const right = options[answer]?.length ?? 0;
  return options.length >= 2 && right > 0 && options.every((o, i) => i === answer || right >= 1.5 * o.length);
}
export const validChoice = (c: Choice) => Array.isArray(c.options) && c.options.length >= 2 && Number.isInteger(c.answer) && c.answer >= 0 && c.answer < c.options.length;

export const OPTION_MARGIN = 0.08;
export const OPTION_MIN_N = 20;

export class OptionTally {
  private t = new Map<string, { n: number; longest: number; shortest: number; chance: number }>();
  add(key: string, c: Choice): void {
    if (!validChoice(c)) return;
    const r = this.t.get(key) ?? { n: 0, longest: 0, shortest: 0, chance: 0 };
    r.n++; r.longest += longestShare(c.options, c.answer); r.shortest += shortestShare(c.options, c.answer); r.chance += 1 / c.options.length;
    this.t.set(key, r);
  }
  /** One finding per group whose longest-option rate beats chance by more than the margin; shortest is a warning. */
  findings(minN = OPTION_MIN_N, margin = OPTION_MARGIN): Finding[] {
    const out: Finding[] = [];
    for (const [key, r] of [...this.t].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (r.n < minN) continue;
      const chance = r.chance / r.n;
      for (const [which, got, sev] of [['longest', r.longest, 'error'], ['shortest', r.shortest, 'warning']] as const) {
        if (got / r.n <= chance + margin) continue;
        out.push({ severity: sev, check: 'options', file: '', path: key, problem: `${key}: tapping the ${which} option is right ${Math.round((100 * got) / r.n)}% of the time over ${r.n} choices (chance ${Math.round(100 * chance)}%)`, fix: 'lengthen the wrong options or shorten the right ones so no length gives the answer away' });
      }
    }
    return out;
  }
  get groups(): number { return this.t.size; }
}

/* ---- list-passage ------------------------------------------------------------- */
const DET = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'este', 'esta', 'ese', 'esa', 'nuestro', 'nuestra', 'otro', 'otra', 'del', 'al']);
const lw = (s: string) => s.toLowerCase().replace(/[^a-záéíóúñü]/g, '');
const isFiniteVerb = (words: string[], k: number): boolean => {
  const w = lw(words[k]);
  if (!w) return false;
  if (k > 0 && DET.has(lw(words[k - 1]))) return false;   // "mi trabajo": a noun
  if (DET.has(w)) return false;
  return analyses(w).some((a) => !a.variety);
};

export interface ListShare { share: number; enumTokens: number; total: number }
/** The share of a text's word tokens that sit inside enumerations: runs of three or more short noun-phrase items joined by commas or y/o/e/u/ni. */
export function listShare(text: string): ListShare {
  let total = 0, enumTokens = 0;
  for (const sentRaw of text.split(/(?<=[.!?…])\s+|\n+/)) {
    const sent = sentRaw.replace(/^[\s—–-]+/, '').replace(/[¿¡]/g, '');
    const nWords = sent.split(/\s+/).filter((w) => /[a-záéíóúñü]/i.test(w)).length;
    total += nWords;
    if (nWords < 3) continue;
    const segs = sent.replace(/[.!?…;:]+$/g, '').split(/\s*,\s*|\s+(?:y|o|e|u|ni)\s+/i).map((s) => s.split(/\s+/).filter((w) => /[a-záéíóúñü]/i.test(w)));
    const items: string[][] = segs.map((words, si) => {
      if (si === 0) { let last = -1; words.forEach((_, k) => { if (isFiniteVerb(words, k)) last = k; }); return last >= 0 ? words.slice(last + 1) : words; }
      if (si === segs.length - 1) { const first = words.findIndex((_, k) => isFiniteVerb(words, k)); return first >= 0 ? words.slice(0, first) : words; }
      return words;
    });
    const ok = items.map((w, si) => w.length >= 1 && w.length <= 4 && (si === 0 || si === segs.length - 1 || !w.some((_, k) => isFiniteVerb(w, k))));
    for (let i = 0; i < items.length;) {
      if (!ok[i]) { i++; continue; }
      let j = i; while (j < items.length && ok[j]) j++;
      if (j - i >= 3) for (let k = i; k < j; k++) enumTokens += items[k].length;
      i = j;
    }
  }
  return { share: total ? enumTokens / total : 0, enumTokens, total };
}
export const LIST_SHARE_MAX = 0.35;

/* ---- answerability ------------------------------------------------------------ */
const STOP = new Set('el la los las un una unos unas de del al a en y o e u que se su sus mi mis tu tus es son está están era eran fue por para con sin sobre entre muy más menos no sí ni lo le les me te nos como cual cuál qué quién dónde cuándo cuánto cuántos cuántas cuánta porque pero si ya hay ser estar tiene tienen'.split(' ').map((w) => deaccent(w)));
const norm = (s: string) => deaccent(s.toLowerCase()).replace(/[^a-zñü0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const content = (s: string) => norm(s).split(' ').filter((w) => w.length > 2 && !STOP.has(w));

export interface Mcq { q: string; options: string[]; answer: number }
export interface Answerability { flags: Array<{ code: 'only-verbatim' | 'none-in-text'; problem: string }> }

/** The correct option is the only one whose words all appear in the text, or no option's content words do. */
export function mcqAnswerability(text: string, q: Mcq): Answerability['flags'] {
  const set = new Set(content(text));
  const flags: Answerability['flags'] = [];
  if (!validChoice(q)) return flags;
  const cw = q.options.map(content);
  const verbatim = cw.map((ws) => ws.length > 0 && ws.every((w) => set.has(w)));
  if (verbatim[q.answer] && verbatim.filter(Boolean).length === 1) flags.push({ code: 'only-verbatim', problem: `the correct option "${clip(q.options[q.answer], 40)}" is the only one whose words all appear in the text` });
  if (cw.every((ws) => ws.length > 0) && cw.every((ws) => !ws.some((w) => set.has(w)))) flags.push({ code: 'none-in-text', problem: 'none of the options\' content words appear in the text: the question cannot be answered from it' });
  return flags;
}

/** A short-answer question whose accept strings appear nowhere in the text. */
export function shortAnswerability(text: string, accept: readonly string[]): boolean {
  const words = accept.map(norm).filter((a) => a && !/^\d+$/.test(a));
  if (!words.length) return true;
  const hay = ` ${norm(text)} `;
  return words.some((a) => hay.includes(` ${a} `) || (content(a).length > 0 && content(a).every((w) => hay.includes(` ${w} `))));
}

/* ---- gender agreement --------------------------------------------------------- */
export type Gender = 'm' | 'f';
const F_EXC = new Set(['mano', 'foto', 'moto', 'radio', 'tarde']); // -o feminine / odd
const M_EXC = new Set(['día', 'mapa', 'problema', 'tema', 'sistema', 'programa', 'idioma', 'planeta', 'clima', 'poema', 'sofá', 'café']);
export function nounGender(word: string, lexicon?: ReadonlyMap<string, Gender>): Gender | null {
  const w = word.toLowerCase();
  const l = lexicon?.get(w); if (l) return l;
  if (M_EXC.has(w)) return 'm';
  if (F_EXC.has(w)) return 'f';
  if (/(ción|sión|dad|tud|umbre|ie)$/.test(w) || /a$/.test(w) || /as$/.test(w)) return 'f';
  if (/o$/.test(w) || /os$/.test(w) || /(aje|or|án)$/.test(w)) return 'm';
  return null;
}
const DESCRIBES = /¿\s*(?:cómo|cuál(?:es)?)\s+(?:es|son|está|están|era|eran|estaba|estaban|fue|se siente|se sentía|parece|parecen|se ve|se veía)\b/i;
/** The gendered noun or name a description question asks about, or null. */
export function questionSubject(q: string, lexicon?: ReadonlyMap<string, Gender>): { word: string; gender: Gender } | null {
  if (!DESCRIBES.test(q)) return null;
  const art = /\b(el|la|los|las)\s+([a-záéíóúñü]+)/i.exec(q);
  if (art) {
    return { word: `${art[1]} ${art[2]}`, gender: /^(la|las)$/i.test(art[1]) ? 'f' : 'm' };
  }
  const name = /(?:es|está|son|están|era|estaba|fue|se siente|parece)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)/.exec(q);
  if (name) { const g = /a$/.test(name[1]) ? 'f' : /o$/.test(name[1]) ? 'm' : null; if (g) return { word: name[1], gender: g }; }
  void lexicon;
  return null;
}
/** Marked gender of a bare lowercase single-word option (-o/-os m, -a/-as f); null for "grande", "feliz", names, phrases. */
const INTENS = /^(?:muy|bastante|tan|poco|demasiado|más|menos|un poco|nada|súper)\s+/i;
export const bareOf = (opt: string) => opt.trim().replace(INTENS, '');
export function optionGender(opt: string): Gender | null {
  const o = bareOf(opt);
  if (!/^[a-záéíóúñü]+$/.test(o) || o.length < 3) return null;
  if (/(o|os)$/.test(o)) return 'm';
  if (/(a|as)$/.test(o)) return 'f';
  return null;
}
export const isBareAdjectiveSet = (opts: readonly string[]) => opts.length >= 2 && opts.every((o) => /^[a-záéíóúñü]+$/.test(bareOf(o)) && !DET.has(bareOf(o)));

export function genderDisagreement(q: Mcq, lexicon?: ReadonlyMap<string, Gender>): string | null {
  if (!validChoice(q) || !isBareAdjectiveSet(q.options)) return null;
  const subj = questionSubject(q.q, lexicon);
  if (!subj) return null;
  // an article-noun subject takes the lexicon's gender over the article only when the lexicon knows the noun
  let g = subj.gender;
  const art = /\b(?:el|la|los|las)\s+([a-záéíóúñü]+)/i.exec(q.q);
  if (art) { const lg = lexicon?.get(art[1].toLowerCase()); if (lg) g = lg; }
  const marked = q.options.map(optionGender);
  const right = marked[q.answer];
  if (right && right !== g) return `"${q.options[q.answer]}" is ${right === 'm' ? 'masculine' : 'feminine'} but the question asks about ${subj.word} (${g === 'm' ? 'masculine' : 'feminine'})`;
  if (marked.some((m) => m) && marked.every((m) => m && m !== g)) return `no option agrees with ${subj.word} (${g === 'm' ? 'masculine' : 'feminine'})`;
  return null;
}

/* ---- length ------------------------------------------------------------------- */
export const LEVEL_MEDIAN: Record<number, number> = { 1: 57, 2: 76, 3: 75, 4: 123, 5: 112, 6: 263, 7: 241, 8: 349, 9: 355, 10: 369 };
export const LENGTH_FACTOR = 2.5;
export const wordCount = (s: string) => s.split(/\s+/).filter((w) => /[a-záéíóúñü]/i.test(w)).length;
