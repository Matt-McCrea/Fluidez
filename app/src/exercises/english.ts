/* ============================================================================
 * ENGLISH FOR RE-INFLECTED SENTENCES — only the two changes English makes
 * reliably: a new subject person, and negation. Everything else (a new
 * tense, an object pronoun) is refused here, and the recombination generator
 * falls back to a Spanish-only recognition item.
 *
 * Works on the bank's own English, word by word, so the rest of the
 * sentence keeps its author's wording.
 * ========================================================================== */
import { enPhrase, verbByInf } from '../engine';
import type { Person, TenseKey } from '../engine';
import { enSubject } from './spanish';

interface EnTok { pre: string; w: string; post: string }
const toks = (s: string): EnTok[] => s.trim().split(/\s+/).map((c) => {
  const m = /^([^A-Za-z']*)([A-Za-z'’-]*)(.*)$/.exec(c)!;
  return { pre: m[1], w: m[2].replace(/’/g, "'"), post: m[3] };
});
const join = (ts: EnTok[]) => ts.map((t) => t.pre + t.w + t.post).join(' ');
const capFirst = (ts: EnTok[]) => { if (ts[0]?.w) ts[0].w = ts[0].w[0].toUpperCase() + ts[0].w.slice(1); return ts; };
const lw = (t: EnTok | undefined) => (t ? t.w.toLowerCase() : '');

export type EnPronoun = 'I' | 'you' | 'he' | 'she' | 'we' | 'they';
const SUBJ_OF: Record<string, EnPronoun> = { i: 'I', you: 'you', he: 'he', she: 'she', we: 'we', they: 'they' };
const POSS: Record<EnPronoun, string> = { I: 'my', you: 'your', he: 'his', she: 'her', we: 'our', they: 'their' };
const REFL: Record<EnPronoun, string> = { I: 'myself', you: 'yourself', he: 'himself', she: 'herself', we: 'ourselves', they: 'themselves' };
const THIRD = (p: EnPronoun) => p === 'he' || p === 'she';

/** English pronoun for a Spanish person. él/ella needs the gender: pass `fem`. */
export function enPronounFor(p: Person, fem = false): EnPronoun | null {
  switch (p) {
    case 'yo': return 'I';
    case 'tú': return 'you';
    case 'él/ella': return fem ? 'she' : 'he';
    case 'nosotros': return 'we';
    case 'ellos': return 'they';
    default: return null;
  }
}

const BE_PRESENT: Record<EnPronoun, string> = { I: 'am', you: 'are', he: 'is', she: 'is', we: 'are', they: 'are' };
const BE_PAST: Record<EnPronoun, string> = { I: 'was', you: 'were', he: 'was', she: 'was', we: 'were', they: 'were' };

function third(base: string): string {
  if (base === 'have') return 'has';
  if (base === 'be') return 'is';
  if (base === 'do') return 'does';
  if (base === 'go') return 'goes';
  if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + 'ies';
  if (/(sh|ch|[sxz])$/.test(base)) return base + 'es';
  return base + 's';
}
/** Base form from a 3rd-person-singular present (eats > eat, studies > study). */
export function baseOf3sg(w: string): string | null {
  const IRR: Record<string, string> = { has: 'have', does: 'do', goes: 'go', is: 'be' };
  if (IRR[w]) return IRR[w];
  if (/[^aeiou]ies$/.test(w)) return w.slice(0, -3) + 'y';
  if (/(sh|ch|x|ss|zz)es$/.test(w)) return w.slice(0, -2);
  if (/[^s]s$/.test(w)) return w.slice(0, -1);
  return null;
}

const ADVERBS = new Set(['always', 'usually', 'often', 'never', 'sometimes', 'also', 'already', 'still', 'just', 'really', 'only', 'even', 'rarely', 'normally']);
const AUX_SWAP: Record<string, (p: EnPronoun) => string> = {
  am: (p) => BE_PRESENT[p], is: (p) => BE_PRESENT[p], are: (p) => BE_PRESENT[p],
  was: (p) => BE_PAST[p], were: (p) => BE_PAST[p],
  have: (p) => (THIRD(p) ? 'has' : 'have'), has: (p) => (THIRD(p) ? 'has' : 'have'),
  do: (p) => (THIRD(p) ? 'does' : 'do'), does: (p) => (THIRD(p) ? 'does' : 'do'),
  "don't": (p) => (THIRD(p) ? "doesn't" : "don't"), "doesn't": (p) => (THIRD(p) ? "doesn't" : "don't"),
  "isn't": (p) => (p === 'I' ? 'am not' : THIRD(p) ? "isn't" : "aren't"), "aren't": (p) => (p === 'I' ? 'am not' : THIRD(p) ? "isn't" : "aren't"),
  "wasn't": (p) => (BE_PAST[p] === 'was' ? "wasn't" : "weren't"), "weren't": (p) => (BE_PAST[p] === 'was' ? "wasn't" : "weren't"),
  "haven't": (p) => (THIRD(p) ? "hasn't" : "haven't"), "hasn't": (p) => (THIRD(p) ? "hasn't" : "haven't"),
};
const CONTRACTED: Record<string, [EnPronoun, string]> = {
  "i'm": ['I', 'am'], "you're": ['you', 'are'], "he's": ['he', 'is'], "she's": ['she', 'is'], "we're": ['we', 'are'], "they're": ['they', 'are'],
};
const CONTRACT: Record<EnPronoun, string> = { I: "I'm", you: "you're", he: "he's", she: "she's", we: "we're", they: "they're" };

/** The English sentence with another subject: "I eat fish" > "We eat fish".
 *  `tense` is the Spanish tense (it decides whether the main verb agrees).
 *  Null when the sentence is not of a shape this can change safely. */
export function enChangePerson(en: string, to: EnPronoun, tense: TenseKey): string | null {
  const sub = enSubject(en);
  if (!sub?.pronoun || sub.pronoun === 'you all') return null;
  const from = SUBJ_OF[sub.pronoun];
  const ts = toks(en);
  // locate the subject token in the raw tokens (contractions count as one)
  let si = -1;
  for (let i = 0; i < ts.length; i++) {
    const l = lw(ts[i]);
    if (l === sub.pronoun || CONTRACTED[l]?.[0].toLowerCase() === sub.pronoun) { si = i; break; }
  }
  if (si < 0) return null;
  const startCap = si === 0;
  const subjLow = lw(ts[si]);
  if (CONTRACTED[subjLow]) {
    ts[si].w = CONTRACT[to];
  } else {
    ts[si].w = to;
    const question = si > 0 && !!AUX_SWAP[lw(ts[si - 1])];
    if (si > 0 && !question && !/^(yesterday|today|tomorrow|now|then|sometimes|usually|normally|finally|tonight|later|also|still)$/.test(lw(ts[si - 1]).replace(/,$/, ''))) return null;
    if (question) {
      // question: "Do you…", "Where are you…" — the auxiliary agrees
      const ai = si - 1;
      const swap = AUX_SWAP[lw(ts[ai])];
      if (!swap) return null;
      const nw = swap(to);
      ts[ai].w = /^[A-Z]/.test(ts[ai].w) ? nw[0].toUpperCase() + nw.slice(1) : nw;
    } else {
      let vi = si + 1;
      if (ADVERBS.has(lw(ts[vi]))) vi++;
      const v = lw(ts[vi]);
      if (!v) return null;
      const swap = AUX_SWAP[v];
      if (swap) ts[vi].w = swap(to);
      else if (/^(can|could|will|would|should|must|might|had|used|'ll|'d)$/.test(v) || v.endsWith("n't")) { /* invariant */ }
      else if (tense === 'presente') {
        const base = THIRD(from) ? baseOf3sg(v) : v;
        if (!base) return null;
        ts[vi].w = THIRD(to) ? third(base) : base;
      } else if (tense === 'preterito' || tense === 'futuro' || tense === 'condicional' || tense === 'imperfecto') {
        /* simple past, "will", "would", "used to" do not agree */
      } else return null;
    }
  }
  // possessives and reflexives that belong to the subject
  for (let i = 0; i < ts.length; i++) {
    if (i === si) continue;
    const l = lw(ts[i]);
    if (l === POSS[from]) ts[i].w = POSS[to];
    else if (l === REFL[from]) ts[i].w = REFL[to];
    else if (from !== 'you' && l === 'you' && to === 'you') return null;            // "I love you" > "you love you"
  }
  if (from === 'he' || from === 'she') {
    // "his"/"her" may belong to someone else; refuse the ambiguity
    if (ts.some((t, i) => i !== si && /^(his|her|him)$/.test(lw(t)) && lw(t) !== POSS[to])) return null;
  }
  if (startCap) capFirst(ts);
  return join(ts).replace(/\bi\b/g, 'I');
}

/** "I eat fish" > "I don't eat fish"; "Do you speak English?" > "Don't you
 *  speak English?". Returns the contracted form and the full form. */
export function enNegate(en: string, tense: TenseKey, gloss?: { base: string; past: string }, opts: { perfect?: boolean } = {}): { text: string; full: string } | null {
  const sub = enSubject(en);
  if (!sub?.pronoun || sub.pronoun === 'you all') return null;
  if (/^\s*(what|where|when|why|how|which|who)\b/i.test(en)) return null;     // "Where don't you live?" is not a negation drill
  if (/\b(some|something|someone|somebody|already|also|too|still|always|any|anything|never|no|not|nobody|nothing)\b/i.test(en)) return null;
  const ts = toks(en);
  const full = toks(en);
  const subj = sub.pronoun === 'you all' ? 'you' : sub.pronoun;
  const si = ts.findIndex((t) => lw(t) === subj || CONTRACTED[lw(t)]?.[0].toLowerCase() === subj);
  if (si < 0) return null;
  const NEG: Record<string, [string, string]> = {
    do: ["don't", 'do not'], does: ["doesn't", 'does not'], did: ["didn't", 'did not'], is: ["isn't", 'is not'], are: ["aren't", 'are not'],
    was: ["wasn't", 'was not'], were: ["weren't", 'were not'], can: ["can't", 'cannot'], will: ["won't", 'will not'],
    have: ["haven't", 'have not'], has: ["hasn't", 'has not'], would: ["wouldn't", 'would not'], could: ["couldn't", 'could not'],
    should: ["shouldn't", 'should not'],
  };
  const setW = (list: EnTok[], i: number, w: string) => { list[i].w = /^[A-Z]/.test(list[i].w) ? w[0].toUpperCase() + w.slice(1) : w; };
  if (si > 0 && NEG[lw(ts[si - 1])]) {
    const ai = si - 1;
    const n = NEG[lw(ts[ai])];
    if (!n) return null;
    setW(ts, ai, n[0]);
    // the full form moves "not" after the subject: "Do you not…" is stilted; keep contraction only
    return { text: join(ts), full: join(ts) };
  }
  if (si > 0 && !ts.slice(0, si).every((t) => /^(yesterday|today|tomorrow|now|then|sometimes|usually|normally|finally|tonight|later)$/.test(lw(t)))) return null;
  if (CONTRACTED[lw(ts[si])]) {
    ts[si].post = ' not' + ts[si].post;
    const [p, be] = CONTRACTED[lw(full[si])];
    full[si].w = p === 'I' ? 'I' : full[si].w.replace(/'.*/, '');
    full[si].post = ' ' + be + ' not' + full[si].post;
    return { text: join(ts), full: join(full) };
  }
  const vi = si + 1;
  const v = lw(ts[vi]);
  if (!v || ADVERBS.has(v)) return null;
  if (v === 'am') { ts[vi].post = ' not' + ts[vi].post; full[vi].post = ' not' + full[vi].post; return { text: join(ts), full: join(full) }; }
  if (NEG[v] && (!/^(have|has)$/.test(v) || opts.perfect)) { setW(ts, vi, NEG[v][0]); setW(full, vi, NEG[v][1]); return { text: join(ts), full: join(full) }; }
  if (/^(must|might|had|used)$/.test(v)) return null;
  let aux: string, base: string | null;
  if (tense === 'presente') {
    const third3 = subj === 'he' || subj === 'she';
    base = third3 ? baseOf3sg(v) : v;
    aux = third3 ? 'does' : 'do';
  } else if (tense === 'preterito') {
    base = gloss && v === gloss.past ? gloss.base : null;
    aux = 'did';
  } else return null;
  if (!base) return null;
  const n = NEG[aux];
  ts[vi].w = n[0] + ' ' + base;
  full[vi].w = n[1] + ' ' + base;
  return { text: join(ts), full: join(full) };
}

/** Base and simple-past heads of a verb's English gloss (comer > eat / ate),
 *  for negating a past sentence. Null for multi-word glosses (get up). */
export function glossForms(inf: string): { base: string; past: string } | null {
  const v = verbByInf(inf);
  if (!v) return null;
  const strip = (s: string) => s.replace(/\s*\([^)]*\)/g, '').split(' ').slice(1);
  const base = strip(enPhrase(v, 'presente', 0).text);
  const past = strip(enPhrase(v, 'preterito', 0).text);
  if (base.length !== 1 || past.length !== 1) return null;
  return { base: base[0], past: past[0] };
}
