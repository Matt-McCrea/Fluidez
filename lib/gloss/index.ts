/* ============================================================================
 * GLOSS RESOLUTION: the note for a tapped Spanish word, as a pure function of
 * the word and the data around it (ported from app/src/ui/data/bundle.ts, where
 * it was a method on the content bundle).
 *
 * Order, first hit wins:
 *   1. the chapter or passage's own note on exactly that word
 *   2. a name ("a name"), when the caller's name set has it capitalised
 *   3. la/las/los before a verb (object pronouns), then the small-word table
 *   4. the lexeme list, with plurals ("luces" is luz)
 *   5. a verb form via the engine ("pudimos": poder, preterite, we)
 *   6. a bank phrase whose Spanish is exactly the word (`exact`)
 *   7. a feminine/plural of an adjective, determiner, number or pronoun;
 *      then a verb reading that needs an accent ignored
 * A chapter note on a phrase that covers the tapped word is added as `phrase`
 * when `at` says where the word was tapped.
 * ========================================================================== */
import { analyzeToken as engineAnalyzeToken, deaccent } from '../engine';
import type { Analysis } from '../engine';
import { tenseShort } from '../search/tenses';

export interface Lexeme { es: string; en: string; pos?: string; gender?: string }
export interface Note { es: string; en: string }
export interface Gloss { es: string; en: string; form?: string; how?: string; phrase?: { es: string; en: string }; name?: true }
/** Where a word was tapped: the line it sits in, and which of that line's words it is (from 0). */
export interface TapAt { line: string; index: number }
export type SmallWords = Readonly<Record<string, { of?: string; en?: string; how?: string }>>;
export interface GlossEngine { analyzeToken(w: string): Analysis[] }

export interface GlossContext {
  /** The chapter's or passage's own notes. */
  gloss?: readonly Note[];
  /** Lower-case names of people and places in the text (the caller decides what counts as a name). */
  names?: ReadonlySet<string>;
  /** Defaults to SMALL_WORDS. */
  smallWords?: SmallWords;
  /** The word list: nouns, adjectives, verbs (es is the infinitive for a verb). */
  lexemes: readonly Lexeme[];
  /** Spanish word (normalised) to English, from bank chunks whose Spanish is exactly that word. */
  exact?: ReadonlyMap<string, string> | Readonly<Record<string, string>>;
  /** Defaults to the engine in lib/engine. */
  engine?: GlossEngine;
  at?: TapAt;
}

export function stripArticle(s: string): string {
  return s.trim().replace(/^(el|la|los|las|un|una)\s+/i, '').replace(/[.…¿?¡!]/g, '').trim();
}

export function normWord(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\s]/gu, '').trim();
}


/** Parts of speech that have plurals, and that have feminine forms to read back to a masculine. */
const HAS_PLURAL = new Set(['noun', 'adj', 'det', 'num', 'pron']);
const AGREES = new Set(['adj', 'det', 'num', 'pron']);
/** Masculine nouns that name a person by their ending (cliente, vendedor, abogado, vecino): their feminine is read back to them. */
const PERSON_ENDING = /(dor|tor|sor|ente|efe|ario|ado|ino|ico|ecto|acho)$|^socio$/;


export const SMALL_WORDS: Readonly<Record<string, { of?: string; en?: string; how?: string }>> = {
  'sé': { of: 'saber', how: 'I, present' },
  la: { of: 'el', en: 'the', how: 'feminine' },
  los: { of: 'el', en: 'the', how: 'plural' },
  las: { of: 'el', en: 'the', how: 'feminine plural' },
  una: { of: 'un', en: 'a, an', how: 'feminine' },
  unos: { of: 'un', en: 'some', how: 'plural' },
  unas: { of: 'un', en: 'some', how: 'feminine plural' },
  del: { en: 'of the, from the (de + el)' },
  al: { en: 'to the, at the (a + el)' },
  hay: { of: 'haber', en: 'there is, there are' },
  esta: { of: 'este', how: 'feminine' }, estas: { of: 'este', how: 'feminine plural' }, estos: { of: 'este', how: 'plural' },
  esa: { of: 'ese', how: 'feminine' }, esas: { of: 'ese', how: 'feminine plural' }, esos: { of: 'ese', how: 'plural' },
  aquella: { of: 'aquel', how: 'feminine' }, aquellas: { of: 'aquel', how: 'feminine plural' }, aquellos: { of: 'aquel', how: 'plural' },
  primer: { of: 'primero', how: 'before a masculine noun' },
  tercer: { of: 'tercero', how: 'before a masculine noun' },
  algún: { of: 'alguno', how: 'before a masculine noun' },
  ningún: { of: 'ninguno', how: 'before a masculine noun' },
  cualquier: { of: 'cualquiera', how: 'before a noun' },
  ciento: { of: 'cien', how: 'in numbers like ciento diez' },
  e: { of: 'y', how: 'before a word that starts with i' },
  quizás: { of: 'quizá' },
  uy: { en: 'oh, oops, wow' },
};


const OBJECT_PRONOUNS: Readonly<Record<string, string>> = {
  la: 'her, it (before a verb); the (before a noun)',
  las: 'them, you (before a verb); the (before a noun)',
  los: 'them, you (before a verb); the (before a noun)',
};


/** Common verbs that share forms the story uses both ways (fue, ve, di, ven, siento). A rarer look-alike (vendar, crear, parir) is left out of the note. */
const SHARES_FORMS: ReadonlySet<string> = new Set(['ser', 'ir', 'ver', 'venir', 'dar', 'decir', 'sentar', 'sentir']);
/** A verb without its reflexive ending: irse is ir, and they share every form on purpose. */
const verbBase = (inf: string): string => inf.replace(/se$/, '');

/** The words of a line or a note, lower case and in order. */
export const wordsOf = (s: string): string[] => (s.match(/\p{L}+/gu) ?? []).map(normWord);
const noteWords = new WeakMap<object, string[]>();
const wordsOfNote = (g: { es: string }): string[] => {
  let t = noteWords.get(g);
  if (!t) noteWords.set(g, t = wordsOf(g.es));
  return t;
};

/** What a plural could be the plural of: luces > luz, canciones > canción, casas > casa. */
function singulars(w: string): string[] {
  const out: string[] = [];
  if (w.endsWith('ces')) out.push(`${w.slice(0, -3)}z`);
  if (w.endsWith('es')) out.push(w.slice(0, -2));
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  return out;
}


const PERSON_WORDS: Readonly<Record<string, string>> = {
  yo: 'I', 'tú': 'you', 'él/ella': 'he or she', nosotros: 'we', ellos: 'they', vos: 'you', vosotros: 'you all',
};


// ---- the word list, indexed once per lexeme array --------------------------------------------------

interface Index {
  lemmas: Map<string, Lexeme>;
  pluralizing: Map<string, Lexeme>;
  pluralizingPlain: Map<string, Lexeme>;
  agreeing: Map<string, Lexeme>;
}
const indexes = new WeakMap<readonly Lexeme[], Index>();

function indexOf(lexemes: readonly Lexeme[]): Index {
  let ix = indexes.get(lexemes);
  if (ix) return ix;
  ix = { lemmas: new Map(), pluralizing: new Map(), pluralizingPlain: new Map(), agreeing: new Map() };
  for (const n of lexemes) {
    if (!n.es) continue;
    for (const form of n.es.split(/[/;,]/)) {
      const k = stripArticle(form).toLowerCase();
      if (!k) continue;
      if (!ix.lemmas.has(k)) ix.lemmas.set(k, n);
      if (HAS_PLURAL.has(n.pos ?? 'noun')) {
        if (!ix.pluralizing.has(k)) ix.pluralizing.set(k, n);
        if (!ix.pluralizingPlain.has(deaccent(k))) ix.pluralizingPlain.set(deaccent(k), n);
      }
      if ((AGREES.has(n.pos ?? '') || (n.pos === 'noun' && n.gender === 'm' && PERSON_ENDING.test(k))) && !ix.agreeing.has(k)) ix.agreeing.set(k, n);
    }
  }
  indexes.set(lexemes, ix);
  return ix;
}

function plural(ix: Index, w: string): Lexeme | undefined {
  for (const s of singulars(w)) {
    // the accent moves only where the plural adds -es to a consonant (jóvenes, habitaciones); estés is not a plural of este
    const n = ix.pluralizing.get(s) ?? (w.endsWith('es') && s === w.slice(0, -2) ? ix.pluralizingPlain.get(deaccent(s)) : undefined);
    if (n) return n;
  }
  return undefined;
}

function agreeingBase(ix: Index, w: string): Lexeme | undefined {
  for (const s of [w, ...singulars(w)]) {
    const stem = s.slice(0, -1);
    const bases = s.endsWith('a')
      ? [`${stem}o`, `${stem}e`, ...(s.endsWith('ora') ? [`${s.slice(0, -3)}or`] : []), ...(s.endsWith('esa') ? [`${s.slice(0, -3)}és`] : []),
        ...(s.endsWith('ona') ? [`${s.slice(0, -3)}ón`] : []), ...(s.endsWith('ana') ? [`${s.slice(0, -3)}án`] : [])]
      : s.endsWith('o') ? [`${stem}e`] : [];
    for (const base of bases) {
      const n = ix.agreeing.get(base);
      if (n) return n;
    }
  }
  return undefined;
}

/** True when `w` is a word of the word list, a plural of one, an agreeing form, or a small word: the test a name finder uses to doubt a capital. */
export function isOrdinaryWord(w: string, lexemes: readonly Lexeme[], smallWords: SmallWords = SMALL_WORDS): boolean {
  const ix = indexOf(lexemes);
  return ix.lemmas.has(w) || w in smallWords || !!plural(ix, w) || !!agreeingBase(ix, w);
}

const exactOf = (c: GlossContext, w: string): string | undefined => {
  const e = c.exact;
  if (!e) return undefined;
  return e instanceof Map ? e.get(w) : Object.hasOwn(e, w) ? (e as Record<string, string>)[w] : undefined;
};

// ---- resolution -------------------------------------------------------------------------------------

/**
 * The note for a tapped word, or undefined. A chapter's note on a phrase is shown only when that
 * phrase covers the word tapped, there and then (needs context.at). A name is a name before it is
 * anything else.
 */
export function resolveGloss(token: string, context: GlossContext): Gloss | undefined {
  const w = normWord(token);
  if (!w) return undefined;
  const phrase = context.at ? phraseAt(context.gloss ?? [], context.at) : undefined;
  const own = wordGloss(token, w, context);
  if (!phrase) return own;
  return own && !own.name ? { ...own, phrase } : phrase;
}

function wordGloss(word: string, w: string, c: GlossContext): Gloss | undefined {
  const ix = indexOf(c.lexemes);
  const small = c.smallWords ?? SMALL_WORDS;
  const name = isCapitalised(word) && !!c.names?.has(word.toLowerCase());
  // a note on a common noun is not a note on the name it looks like: "rosa, rose" is not Rosa
  const mine = (c.gloss ?? []).find((g) => { const t = wordsOfNote(g); return t.length === 1 && t[0] === w && !(name && g.es === g.es.toLowerCase()); });
  if (mine) return mine;
  if (name) return { es: word, en: 'a name', name: true };
  const sm = objectPronoun(ix, w, c) ?? smallWord(ix, small, w, word);
  if (sm) return sm;
  const lex = ix.lemmas.get(w) ?? plural(ix, w);
  if (lex?.en) return { es: lex.es ?? word, en: lex.en };
  const viaVerb = verbGloss(ix, c, word, w, true);
  if (viaVerb) return viaVerb;
  // a sentence-bank chunk or node whose Spanish is exactly this word
  const exact = exactOf(c, w);
  if (exact) return { es: word, en: exact };
  // a verb that only fits with an accent ignored comes last: seria is serio before it is sería
  const base = agreeingBase(ix, w);
  if (base?.en) return { es: base.es ?? word, en: base.en, form: word };
  return verbGloss(ix, c, word, w, false);
}

/**
 * la, las and los straight before a verb form are object pronouns (No la tengo), which the
 * article's note would get wrong. Nothing is said without a place in the text.
 */
function objectPronoun(ix: Index, w: string, c: GlossContext): Gloss | undefined {
  const at = c.at;
  if (!at || !Object.hasOwn(OBJECT_PRONOUNS, w)) return undefined;
  const tokens = [...at.line.matchAll(/\p{L}+/gu)];
  const me = tokens[at.index], next = tokens[at.index + 1];
  if (!me || !next || at.line.slice(me.index + me[0].length, next.index).trim()) return undefined;
  const n = normWord(next[0]);
  if (ix.lemmas.has(n) || plural(ix, n) || agreeingBase(ix, n)) return undefined;
  const engine = c.engine ?? { analyzeToken: engineAnalyzeToken };
  return engine.analyzeToken(n).some((r) => r.target && r.accentExact) ? { es: w, en: OBJECT_PRONOUNS[w] } : undefined;
}

function smallWord(ix: Index, table: SmallWords, w: string, word: string): Gloss | undefined {
  const s = Object.hasOwn(table, w) ? table[w] : undefined;
  if (!s) return undefined;
  const head = s.of ? ix.lemmas.get(s.of) : undefined;
  const en = s.en ?? head?.en;
  if (!en) return undefined;
  return s.of ? { es: head?.es ?? s.of, en, form: word, ...(s.how ? { how: s.how } : {}) } : { es: word, en };
}

function verbLexeme(ix: Index, inf: string): Lexeme | undefined {
  return ix.lemmas.get(inf) ?? ix.lemmas.get(verbBase(inf));
}

/** An inflected verb (clitics included) read back to its infinitive's lexeme: "pudimos: poder, we, preterite". */
function verbGloss(ix: Index, c: GlossContext, word: string, w: string, accentExact: boolean): Gloss | undefined {
  const engine = c.engine ?? { analyzeToken: engineAnalyzeToken };
  const readings = engine.analyzeToken(w).filter((a) => a.target && (!accentExact || a.accentExact));
  readings.sort((a, b) => Number(b.accentExact) - Number(a.accentExact) || Number(!!a.clitics?.length) - Number(!!b.clitics?.length));
  for (const r of readings) {
    const lex = verbLexeme(ix, r.inf);
    if (!lex?.en) continue;
    // era is "I" and "he or she" alike: name every person the form can be
    const persons = new Set(readings
      .filter((o) => o.inf === r.inf && o.tense === r.tense && (o.clitics?.length ?? 0) === (r.clitics?.length ?? 0))
      .map((o) => PERSON_WORDS[o.person]).filter(Boolean));
    const how = [[...persons].join(' or '), r.tense === 'imperativo' ? 'command' : tenseShort(r.tense).toLowerCase()].filter(Boolean).join(', ');
    const clitics = r.clitics?.length ? `${how}, with ${r.clitics.join(' + ')} attached` : how;
    // fue is ser or ir, and the sentence decides: a note that picks one is wrong a third of the time
    const also = SHARES_FORMS.has(verbBase(r.inf)) ? readings.find((o) => verbBase(o.inf) !== verbBase(r.inf) && SHARES_FORMS.has(verbBase(o.inf))) : undefined;
    const other = also ? verbLexeme(ix, also.inf) : undefined;
    return { es: lex.es ?? r.inf, en: lex.en, form: word, how: other?.en ? `${clitics}; or from ${other.es ?? also!.inf}: ${other.en}` : clitics };
  }
  return undefined;
}

/** The chapter's note on the tightest phrase that covers the word tapped, in the place it was tapped. */
function phraseAt(gloss: readonly Note[], at: TapAt): Note | undefined {
  const line = wordsOf(at.line);
  let best: Note | undefined;
  let bestLen = Infinity;
  for (const g of gloss) {
    const p = wordsOfNote(g);
    if (p.length < 2 || p.length >= bestLen) continue;
    for (let s = Math.max(0, at.index - p.length + 1); s <= at.index && s + p.length <= line.length; s++) {
      if (p.every((x, j) => line[s + j] === x)) { best = g; bestLen = p.length; break; }
    }
  }
  return best;
}

/** A capital letter that is not shouting (HUELGA): the word starts with one. */
export const isCapitalised = (t: string): boolean => t !== t.toLowerCase() && !(t.length > 1 && t === t.toUpperCase());
