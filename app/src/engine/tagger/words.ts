/* ============================================================================
 * WORDS — tokenise, then give every token one part of speech.
 *
 * The engine maps every conjugated form back to its verb, so a noun spelled
 * like one reads as a verb ("la vista" = vestirse's subjunctive, "el trabajo"
 * = I work, "un vino" = he came) and a preposition can too (como = I eat,
 * para = it stops, sobre = it is left over, bajo = I go down). The rules
 * below are the old tools/lib/tense-scan.js lessons made general:
 *
 *   ACCENTS DECIDE WHETHER IT IS A VERB. A token whose only readings are
 *   accent-inexact (este/esté, seria/sería, practica/práctica) is not that
 *   verb. Content accents are linted against the same paradigms, so if the
 *   text says "este" it has been verified to mean "este".
 *
 *   A NOUN HOMOGRAPH IS A NOUN ONLY WHERE A NOUN SITS: after a determiner or
 *   a preposition, or directly after a finite verb (Spanish does not put two
 *   finite verbs side by side without a conjunction). Membership alone is not
 *   enough — clitic la/los/las stand before verbs exactly where an article
 *   would.
 *
 *   A FUNCTION-WORD HOMOGRAPH (como, para, sobre, entre, bajo, nada) is the
 *   function word unless there is positive evidence for the verb: a subject
 *   pronoun, "no" or a clitic right before it, or a clause with no other verb
 *   that it starts ("Como arroz.").
 * ========================================================================== */
import { analyzeToken, participlesOf, haberAnalyses, VERBS, gerund, deaccent, isReflexive, reflexiveBase } from '../index';
import type { Analysis } from '../types';
import {
  CLITICS, DETERMINER_LIKE, FUNCTION_HOMOGRAPHS, NOUN_HOMOGRAPHS, SUBJECT_PRONOUNS, closedClass, lemmatize, lexEntry,
  isKnownForm, isName,
} from './lexicon';
import type { Pos, Token, Word } from './types';

const WORD_RE = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+(?:[.,:]\d+)*|[¿?¡!.,;:—–\-…"«»()“”]/g;
const SENT_END = new Set(['.', '?', '!', '…', ';', ':']);
const OPENERS = new Set(['¿', '¡', '—', '–', '-', '"', '«', '(', '“']);

export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  let sentStart = true;
  for (const m of text.matchAll(WORD_RE)) {
    const t = m[0];
    const punct = !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d]/.test(t);
    const cap = /^[A-ZÁÉÍÓÚÜÑ]/.test(t);
    out.push({ i: out.length, text: t, w: t.toLowerCase(), punct, cap, capMid: cap && !sentStart, sentStart: !punct && sentStart });
    if (punct) { if (SENT_END.has(t) || t === '—') sentStart = true; else if (!OPENERS.has(t)) sentStart = false; }
    else sentStart = false;
  }
  return out;
}

/* ---- verb lookups the engine does not index ------------------------------ */
const INF = new Map<string, string[]>();        // deaccented infinitive -> infs (bare + reflexive)
const GER = new Map<string, string[]>();        // deaccented gerund -> infs
const REFLEXIVE_OF = new Map<string, string>(); // bare inf -> reflexive inf
function pushM(m: Map<string, string[]>, k: string, v: string) { const l = m.get(k); if (l) { if (!l.includes(v)) l.push(v); } else m.set(k, [v]); }
for (const v of VERBS) {
  const bare = isReflexive(v.inf) ? reflexiveBase(v.inf) : v.inf;
  pushM(INF, deaccent(bare), v.inf);
  if (isReflexive(v.inf)) { REFLEXIVE_OF.set(bare, v.inf); pushM(INF, deaccent(v.inf), v.inf); }
  try { pushM(GER, deaccent(gerund(v)), v.inf); } catch { /* no gerund */ }
}
export function reflexiveOf(inf: string): string | null {
  if (isReflexive(inf)) return inf;
  return REFLEXIVE_OF.get(inf) ?? null;
}
export function bareOf(inf: string): string { return isReflexive(inf) ? reflexiveBase(inf) : inf; }

const CL_LIST = ['me', 'te', 'se', 'nos', 'os', 'lo', 'la', 'los', 'las', 'le', 'les'];
/** Infinitive or gerund, possibly with enclitics: hacerlo, dármelo, diciéndome. */
function nonFinite(w: string): { pos: 'inf' | 'ger'; infs: string[]; enclitics: string[] } | null {
  const tryBase = (b: string, cl: string[]) => {
    const d = deaccent(b);
    const inf = INF.get(d);
    if (inf && /(ar|er|ir|ír)(se)?$/.test(b.replace(/[áé]/g, (c) => deaccent(c)))) {
      // an infinitive takes no accent unless two clitics shift the stress (dármelo)
      if (!cl.length || cl.length >= 2 || !/[áéíóú]/.test(b) || /ír$/.test(b)) return { pos: 'inf' as const, infs: inf, enclitics: cl };
    }
    const ger = GER.get(d);
    if (ger && /(ando|iendo|yendo|endo)$/.test(d)) {
      // with any enclitic the gerund carries a written accent (haciéndolo)
      if (!cl.length || /[áé]/.test(b)) return { pos: 'ger' as const, infs: ger, enclitics: cl };
    }
    return null;
  };
  const bare = tryBase(w, []);
  if (bare) return bare;
  for (const c1 of CL_LIST) {
    if (!w.endsWith(c1) || w.length <= c1.length + 2) continue;
    const b1 = w.slice(0, -c1.length);
    const r1 = tryBase(b1, [c1]);
    if (r1) return r1;
    for (const c2 of CL_LIST) {
      if (!b1.endsWith(c2) || b1.length <= c2.length + 2) continue;
      const r2 = tryBase(b1.slice(0, -c2.length), [c2, c1]);
      if (r2) return r2;
    }
  }
  return null;
}

/** Participle, including its agreeing forms (cansada, cerrados). */
function participle(w: string): string[] {
  const direct = participlesOf(w).filter((p) => p.tense === 'perfecto').map((p) => p.inf);
  if (direct.length) return [...new Set(direct)];
  const m = w.match(/^(.+)(ada|adas|ados|ida|idas|idos|ída|ídas|ídos|ta|tas|tos|cha|chas|chos|sa|sas|sos)$/);
  if (!m) return [];
  const masc = w.replace(/as$|os$/, 'o').replace(/a$/, 'o');
  return [...new Set(participlesOf(masc).filter((p) => p.tense === 'perfecto').map((p) => p.inf))];
}

export function exactVerbReadings(w: string): Analysis[] {
  return analyzeToken(w).filter((a) => a.accentExact);
}

const PRE_NOMINAL = new Set(['el', 'un', 'unos', 'unas', 'del', 'al', 'mi', 'mis', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'cada', 'varios', 'varias', 'algún', 'ningún']);
const PREP_BEFORE_VERB = new Set(['hasta', 'según', 'salvo', 'excepto', 'incluso']);
const STRONG_VERB_CUES = new Set([...SUBJECT_PRONOUNS, 'no', 'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'lo', 'ya', 'también', 'tampoco', 'siempre', 'nunca', 'casi', 'solo']);
const SUBORDINATORS = new Set(['si', 'que', 'ojalá', 'aunque', 'cuando', 'quien', 'donde', 'mientras', 'porque']);
const CLAUSE_LINKS = new Set(['y', 'e', 'o', 'u', 'pero', 'ni', 'sino', 'que', 'porque', 'cuando', 'si', 'aunque', 'mientras', 'donde', 'pues']);

function isBoundary(t: Token | undefined): boolean {
  return !t || (t.punct && t.w !== '-' && t.w !== '"' && t.w !== '«' && t.w !== '»');
}

/** Index of the previous word in the same sentence (skipping nothing), or -1. */
function prevWord(toks: Token[], i: number): number {
  const j = i - 1;
  if (j < 0 || toks[j].punct) return -1;
  return j;
}

/** Does the clause around i contain another finite-verb candidate? */
function clauseHasOtherVerb(toks: Token[], i: number, unamb: boolean[]): boolean {
  for (let j = i - 1; j >= 0 && !isBoundary(toks[j]) && !CLAUSE_LINKS.has(toks[j].w); j--) if (unamb[j]) return true;
  for (let j = i + 1; j < toks.length && !isBoundary(toks[j]) && !CLAUSE_LINKS.has(toks[j].w); j++) if (unamb[j]) return true;
  return false;
}
function sentenceHasOtherVerb(toks: Token[], i: number, cand: boolean[]): boolean {
  for (let j = i - 1; j >= 0 && !(toks[j].punct && /[.?!…]/.test(toks[j].w)); j--) if (cand[j]) return true;
  for (let j = i + 1; j < toks.length && !(toks[j].punct && /[.?!…]/.test(toks[j].w)); j++) if (cand[j]) return true;
  return false;
}

function sameClause(toks: Token[], i: number, k: number): boolean {
  const [a, b] = i < k ? [i, k] : [k, i];
  for (let j = a + 1; j < b; j++) if (isBoundary(toks[j]) || CLAUSE_LINKS.has(toks[j].w)) return false;
  return true;
}

function nominalPos(e: ReturnType<typeof lemmatize>): Pos | null {
  if (!e || !e.entry) return null;               // known only as a form: no POS evidence
  const p = e.entry.pos;
  if (p === 'noun' || p === 'adj' || p === 'adv' || p === 'x') return p;
  if (p === 'inf') return null;
  return 'x';
}

export function analyzeWords(text: string): Word[] {
  const toks = tokenize(text);
  // Pass 1: candidate readings for every token
  const fin: Analysis[][] = toks.map((t) => (t.punct || /^\d/.test(t.w) ? [] : exactVerbReadings(t.w)));
  const nf = toks.map((t) => (t.punct ? null : nonFinite(t.w)));
  const part = toks.map((t) => (t.punct ? [] : participle(t.w)));
  const cc = toks.map((t) => (t.punct ? null : closedClass(t.w)));
  const lem = toks.map((t) => (t.punct ? null : lemmatize(t.w)));
  const homog = toks.map((t, i) => fin[i].length > 0 && (cc[i] !== null || nominalPos(lem[i]) !== null || NOUN_HOMOGRAPHS.has(t.w)));
  const unamb = toks.map((t, i) => fin[i].length > 0 && !homog[i] && !CLITICS.has(t.w));
  const cand = toks.map((t, i) => fin[i].length > 0 && !CLITICS.has(t.w));

  const words: Word[] = [];
  for (const t of toks) {
    const i = t.i;
    const base: Word = { ...t, pos: 'unknown', lemma: t.w, known: true };
    if (t.punct) { words.push({ ...base, pos: 'punct' }); continue; }
    if (/^\d/.test(t.w)) { words.push({ ...base, pos: 'num' }); continue; }
    if (t.w === 'hay') {
      words.push({ ...base, pos: 'verb', lemma: 'haber', tense: 'presente', verb: [{ inf: 'haber', tense: 'presente', person: 'él/ella', form: 'hay', type: 'er', accentExact: true, target: true }] });
      continue;
    }
    const pIdx = prevWord(toks, i);
    const prev = pIdx >= 0 ? words[pIdx] : undefined;
    const nominal = nominalPos(lem[i]) ?? (NOUN_HOMOGRAPHS.has(t.w) ? 'noun' as Pos : null);
    const asVerb = (weak?: string): Word => ({ ...base, pos: 'verb', lemma: fin[i][0].inf, verb: fin[i], ...(weak ? { weak } : {}) });
    const asNominal = (weak?: string): Word => ({ ...base, pos: nominal ?? 'x', lemma: lem[i]?.lemma ?? t.w, known: !!lem[i], ...(weak ? { weak } : {}) });
    const asClosed = (): Word => ({ ...base, pos: cc[i]!, lemma: t.w });

    // Proper nouns: capitalised mid-sentence (and not a closed-class word), or a registered name
    if ((t.capMid && !cc[i]) || (t.cap && isName(t.w))) { words.push({ ...base, pos: 'propn' }); continue; }
    // a capitalised first word whose only verb reading is voseo is a name (Tomás, not vos tomás)
    if (t.cap && fin[i].length && fin[i].every((a) => a.variety === 'voseo') && (fin[i + 1]?.length || toks[i + 1]?.w === ',' || toks[i + 1]?.w === 'y')) { words.push({ ...base, pos: 'propn' }); continue; }

    // a finite verb never follows an article, a possessive or a preposition:
    // "varias ocasiones", "del embarque", "de embarque" are nouns whatever the engine says
    const prev2 = pIdx >= 1 ? words[pIdx - 1] : undefined;
    const afterDetAdj = prev && prev2 && (prev.pos === 'adj' || ['mayor', 'menor', 'mejor', 'peor', 'gran', 'buen', 'primer', 'último', 'nuevo', 'nueva'].includes(prev.w)) && PRE_NOMINAL.has(prev2.w);
    if (fin[i].length && !cc[i] && prev && (PRE_NOMINAL.has(prev.w) || afterDetAdj || (prev.pos === 'prep' && !PREP_BEFORE_VERB.has(prev.w)))) {
      words.push({ ...asNominal(), pos: nominal ?? 'x', known: !!lem[i] || isKnownForm(t.w) });
      continue;
    }
    // vosotros/voseo-only readings of a noun (dificultad = dificultar's vosotros command)
    if (fin[i].length && fin[i].every((a) => a.variety) && (nominal || /(dad|tad)$/.test(t.w))) {
      words.push(asNominal());
      continue;
    }
    if (t.w === 'pese' && toks[i + 1]?.w === 'a') { words.push({ ...base, pos: 'prep', lemma: 'pese a' }); continue; }
    if (fin[i].length) {
      if (cc[i] && cc[i] !== 'clitic' && prev && DETERMINER_LIKE.has(prev.w) && NOUN_HOMOGRAPHS.has(t.w)) { words.push({ ...asNominal(), pos: 'noun' }); continue; }
      if (cc[i] && cc[i] !== 'clitic') {
        // FUNCTION-WORD HOMOGRAPH: the function word unless there is evidence
        const cue = prev && (STRONG_VERB_CUES.has(prev.w) || SUBORDINATORS.has(prev.w) && !FUNCTION_HOMOGRAPHS.has(t.w));
        const next = toks[i + 1];
        const nextNominal = next && !next.punct && (DETERMINER_LIKE.has(next.w) || ['noun', 'x'].includes(nominalPos(lem[i + 1]) ?? ''));
        const startsClause = !prev || CLAUSE_LINKS.has(prev.w);
        const nextEnd = !next || (next.punct && /[.?!…,;:]/.test(next.w));
        const alone = startsClause && !clauseHasOtherVerb(toks, i, cand) && FUNCTION_HOMOGRAPHS.has(t.w);
        if (cue || (alone && (nextNominal || nextEnd) && !sentenceHasOtherVerb(toks, i, unamb.map((u, k) => u && !sameClause(toks, i, k))) ) || (alone && nextEnd)) words.push(asVerb());
        else words.push(asClosed());
        continue;
      }
      if (CLITICS.has(t.w)) { words.push(asClosed()); continue; }
      if (nominal) {
        // NOUN/ADJECTIVE HOMOGRAPH
        if (prev && (DETERMINER_LIKE.has(prev.w) || prev.pos === 'prep' || prev.pos === 'num')) {
          // after la/los/las a word with a noun reading is the noun (tense-scan rule);
          // after "lo" it is the verb (lo is only an article before adjectives)
          if (prev.w === 'lo' && nominal !== 'adj') { words.push(asVerb()); continue; }
          words.push(asNominal()); continue;
        }
        if (prev && (STRONG_VERB_CUES.has(prev.w) || SUBORDINATORS.has(prev.w))) { words.push(asVerb()); continue; }
        if (prev && prev.pos === 'verb' && prev.aux !== 'haber') { words.push(asNominal()); continue; }
        if (prev && (prev.pos === 'noun' || prev.pos === 'propn')) {
          words.push(nominal === 'adj' ? asNominal() : asVerb()); continue;
        }
        if (clauseHasOtherVerb(toks, i, unamb)) { words.push(asNominal(`"${t.w}" read as ${nominal}: the clause has another verb`)); continue; }
        words.push(asVerb(`"${t.w}" read as a verb: no other verb in the clause`));
        continue;
      }
      words.push(asVerb());
      continue;
    }
    if (cc[i]) {
      if (prev && DETERMINER_LIKE.has(prev.w) && NOUN_HOMOGRAPHS.has(t.w) && cc[i] !== 'clitic') { words.push({ ...asNominal(), pos: 'noun' }); continue; }
      words.push(asClosed()); continue;
    }
    const n = nf[i];
    if (n) {
      // el poder, los deberes, el amanecer: an infinitive after a determiner with a noun entry
      const lx = lexEntry(t.w);
      if (prev && DETERMINER_LIKE.has(prev.w) && lx && lx.pos === 'noun') { words.push(asNominal()); continue; }
      words.push({ ...base, pos: n.pos, lemma: n.infs[0], ...(n.enclitics.length ? { enclitics: n.enclitics } : {}),
        verb: n.infs.map((inf) => ({ inf, tense: 'presente', person: 'yo', form: t.w, type: 'ar', accentExact: true, target: true }) as Analysis) });
      continue;
    }
    if (part[i].length) {
      const lx = lem[i]?.entry;
      // a participle the lexicon lists as a noun after a determiner is the noun (el estado, el pasado)
      if (lx && lx.pos === 'noun' && prev && DETERMINER_LIKE.has(prev.w)) { words.push(asNominal()); continue; }
      words.push({ ...base, pos: 'part', lemma: part[i][0] });
      continue;
    }
    if (nominal) { words.push(asNominal()); continue; }
    if (lem[i]) { words.push({ ...base, pos: 'x', lemma: lem[i]!.lemma }); continue; }
    if (t.cap) { words.push({ ...base, pos: 'propn' }); continue; }
    words.push({ ...base, pos: 'unknown', known: isKnownForm(t.w) });
  }

  // Pass 2: clitic vs article for la/lo/los/las, and haber + participle compounds
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (['la', 'los', 'las', 'lo'].includes(w.w) && (w.pos === 'det' || w.pos === 'clitic')) {
      let j = i + 1;
      while (j < words.length && words[j].pos === 'clitic' && ['me', 'te', 'se', 'nos', 'os', 'le', 'les', 'lo', 'la', 'los', 'las'].includes(words[j].w) && j < i + 3) j++;
      const nx = words[j];
      if (nx && nx.pos === 'verb') w.pos = 'clitic';
      else if (w.w === 'lo') w.pos = nx && !nx.punct && (['adj', 'part', 'x', 'adv', 'poss', 'num'].includes(nx.pos) || nx.w === 'que' || nx.w === 'cual' || nx.w === 'de') ? 'det' : 'clitic';
      else w.pos = 'det';
    }
  }
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.pos !== 'verb' || !w.verb?.some((a) => a.inf === 'haber')) continue;
    const hb = haberAnalyses(w.w);
    if (!hb.length) continue;
    for (let j = i + 1; j <= i + 2 && j < words.length; j++) {
      const p = words[j];
      if (p.punct) break;
      const ps = participle(p.w);
      if (ps.length && (p.pos === 'part' || p.pos === 'verb' || p.pos === 'adj' || p.pos === 'x' || p.pos === 'noun')) {
        w.aux = 'haber';
        p.pos = 'part';
        p.lemma = ps[0];
        p.compoundOf = i;
        break;
      }
      if (!['adv', 'neg'].includes(p.pos)) break;
    }
  }
  return words;
}
