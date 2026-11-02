// Everything the UI needs to render a plan: the full content objects (the
// compiler's index only keeps their shape), the course and the content index.
// Built once per load; read-only afterwards.
import {
  buildContentIndex, buildCourse, type ContentIndex, type ContentSource, type Course,
} from '../../compiler';
import type { LibraryChapter } from '../../content/library';
import type {
  BankSentence, GraphNode, NodeId, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../../content/schema';
import { alignedPairs, type AlignedPair, type LexemeLike } from '../../exercises';
import { analyzeToken, deaccent } from '../../engine';
import { tenseShort } from '../session/tenses';

/** What a bundle asks its loader for after the first load. */
export interface ContentExtender {
  loadWindow(unit: string | number): Promise<ContentSource>;
  loadUnits(range: { from?: number; to: number }): Promise<ContentSource>;
  loadScript(node: string): Promise<ContentSource>;
  loadChapters(ids: readonly string[]): Promise<ContentSource>;
}

export type Segment = AlignedPair;

export class Bundle {
  readonly course: Course;
  index: ContentIndex;
  readonly sentences = new Map<string, BankSentence>();
  readonly chapters = new Map<string, StoryChapter>();
  readonly scenes = new Map<string, Scene>();
  readonly tasks = new Map<string, WritingTask>();
  readonly scripts = new Map<NodeId, TeachingScript>();
  readonly bank: BankSentence[];
  /** lemma (lower case, no article) -> lexeme node, for tap-to-gloss */
  private readonly lemmas = new Map<string, GraphNode>();
  /** the same, for the words that have plurals (nouns, adjectives, determiners, pronouns), and by spelling without accents */
  private readonly pluralizing = new Map<string, GraphNode>();
  private readonly pluralizingPlain = new Map<string, GraphNode>();
  /** the words that have a masculine singular to read feminines and plurals back to (adjectives, determiners, numbers, pronouns) */
  private readonly agreeing = new Map<string, GraphNode>();

  private more?: ContentExtender;
  private readonly noScript = new Set<NodeId>();

  constructor(readonly units: Unit[], nodes: GraphNode[], readonly source: ContentSource, readonly fixture = false) {
    this.course = buildCourse(units, nodes);
    this.index = buildContentIndex(source, this.course);
    this.bank = source.sentences;
    for (const s of source.sentences) if (!this.sentences.has(s.id)) this.sentences.set(s.id, s);
    for (const c of source.chapters) this.chapters.set(c.id, c);
    for (const s of source.scenes) this.scenes.set(s.id, s);
    for (const t of source.writing) this.tasks.set(t.id, t);
    for (const s of source.scripts) if ('hook' in s) this.scripts.set(s.node, s);
    for (const n of nodes) {
      if (n.kind !== 'lexeme' || !n.es) continue;
      for (const form of n.es.split(/[/;,]/)) {
        const k = stripArticle(form).toLowerCase();
        if (!k) continue;
        if (!this.lemmas.has(k)) this.lemmas.set(k, n);
        if (HAS_PLURAL.has(n.pos ?? 'noun')) {
          if (!this.pluralizing.has(k)) this.pluralizing.set(k, n);
          if (!this.pluralizingPlain.has(deaccent(k))) this.pluralizingPlain.set(deaccent(k), n);
        }
        if ((AGREES.has(n.pos ?? '') || (n.pos === 'noun' && n.gender === 'm' && PERSON_ENDING.test(k))) && !this.agreeing.has(k)) this.agreeing.set(k, n);
      }
    }
  }

  /** Connect the loader that can fetch more content later (real bundles only). */
  attach(more: ContentExtender): void { this.more = more; }

  /** Merge newly loaded records (skipping ids already present) and rebuild the content index. */
  extend(add: ContentSource): boolean {
    let changed = false;
    const src = this.source;
    for (const s of add.sentences) if (!this.sentences.has(s.id)) { this.sentences.set(s.id, s); src.sentences.push(s); changed = true; }
    for (const c of add.chapters) if (!this.chapters.has(c.id)) { this.chapters.set(c.id, c); src.chapters.push(c); changed = true; }
    for (const c of add.scenes) if (!this.scenes.has(c.id)) { this.scenes.set(c.id, c); src.scenes.push(c); changed = true; }
    for (const t of add.writing) if (!this.tasks.has(t.id)) { this.tasks.set(t.id, t); src.writing.push(t); changed = true; }
    for (const s of add.scripts) {
      if (!('hook' in s) || this.scripts.has(s.node)) continue;
      this.scripts.set(s.node, s); src.scripts.push(s); changed = true;
    }
    if (changed) {
      this.index = buildContentIndex(src, this.course);
      this.byEs = undefined;
      this.names = undefined;
    }
    return changed;
  }

  /** Load the window of units around `unit` (an index or id); true when anything new arrived. */
  async ensureWindow(unit: string | number): Promise<boolean> {
    return this.more ? this.extend(await this.more.loadWindow(unit)) : false;
  }

  /** Load all content of the units in `range` (inclusive indexes): for quick review and the weak-spot trainer. */
  async ensureUnits(range: { from?: number; to: number }): Promise<boolean> {
    return this.more ? this.extend(await this.more.loadUnits(range)) : false;
  }

  /** Fetch chapters by id (those not loaded already); true when anything new arrived. */
  async ensureChapters(ids: readonly string[]): Promise<boolean> {
    const need = ids.filter((id) => !this.chapters.has(id));
    return this.more && need.length ? this.extend(await this.more.loadChapters(need)) : false;
  }

  /** A node's teaching script: the loaded one at once, otherwise fetched (and then cached). */
  async scriptFor(node: NodeId): Promise<TeachingScript | undefined> {
    const have = this.scripts.get(node);
    if (have || !this.more || this.noScript.has(node)) return have;
    this.extend(await this.more.loadScript(node));
    const got = this.scripts.get(node);
    if (!got) this.noScript.add(node);
    return got;
  }

  /** Every chapter of the story as the library lists it (title, hook, length), whichever are loaded; empty without a library. */
  get library(): readonly LibraryChapter[] { return this.source.library ?? []; }

  get empty(): boolean { return this.sentences.size === 0; }

  node(id: NodeId): GraphNode | undefined { return this.course.nodes.get(id); }

  /** Learner-facing title of a node; never the raw id. */
  title(id: NodeId | undefined): string {
    if (!id) return '';
    const n = this.node(id);
    if (n?.title) return n.title;
    const s = this.segments(id)[0];
    return s?.en || id.replace(/^[a-z]:/, '').replace(/-/g, ' ');
  }

  sentence(id: string | undefined): BankSentence | undefined { return id ? this.sentences.get(id) : undefined; }

  unit(id: string | undefined): Unit | undefined { return this.units.find((u) => u.id === id); }

  private readonly pairCache = new Map<NodeId, Segment[]>();

  /**
   * A node's Spanish/English as ALIGNED pairs (exercises/pairs.ts): each
   * pair's English is the exact translation of its Spanish, so any card built
   * from one pair asks and answers the same thing. Lexemes: one pair, the
   * gloss and the word with its article.
   */
  segments(id: NodeId): Segment[] {
    let v = this.pairCache.get(id);
    if (!v) {
      const n = this.node(id);
      v = n ? alignedPairs(n) : [];
      this.pairCache.set(id, v);
    }
    return v;
  }

  lexemeLike(id: NodeId): LexemeLike | undefined {
    const n = this.node(id);
    if (!n?.es || !n.en) return undefined;
    return { id, es: n.es.split(/\s+\/\s+/)[0], en: n.en.split(/\s+\/\s+/)[0], ...(n.peninsular ? { peninsular: n.peninsular } : {}) };
  }

  /**
   * The note for a tapped Spanish word. `at` says where it was tapped; a chapter's note on a phrase
   * is shown only when that phrase covers the word tapped, there and then. A name is a name before
   * it is anything else.
   */
  gloss(word: string, chapter?: StoryChapter, at?: TapAt): Gloss | undefined {
    const w = normWord(word);
    if (!w) return undefined;
    const phrase = chapter && at ? phraseAt(chapter, at) : undefined;
    const own = this.wordGloss(word, w, chapter, at);
    if (!phrase) return own;
    return own && !own.name ? { ...own, phrase } : phrase;
  }

  /** What the word means on its own: the chapter's note on it, a name, a little word, the word list, a verb form. */
  private wordGloss(word: string, w: string, chapter?: StoryChapter, at?: TapAt): Gloss | undefined {
    const name = this.isName(word);
    // a note on a common noun is not a note on the name it looks like: "rosa, rose" is not Rosa
    const mine = chapter?.gloss.find((g) => { const t = wordsOfNote(g); return t.length === 1 && t[0] === w && !(name && g.es === g.es.toLowerCase()); });
    if (mine) return mine;
    if (name) return { es: word, en: 'a name', name: true };
    const small = this.objectPronoun(w, at) ?? this.smallWord(w, word);
    if (small) return small;
    const lex = this.lemmas.get(w) ?? this.plural(w);
    if (lex?.en) return { es: lex.es ?? word, en: lex.en };
    const viaVerb = this.verbGloss(word, w, true);
    if (viaVerb) return viaVerb;
    // a sentence-bank chunk or node whose Spanish is exactly this word
    const exact = this.exactEn(w);
    if (exact) return { es: word, en: exact };
    // a verb that only fits with an accent ignored comes last: seria is serio before it is sería
    return this.agreement(w, word) ?? this.verbGloss(word, w, false);
  }

  /**
   * la, las and los straight before a verb form are object pronouns (No la tengo), which the
   * article's note would get wrong. Some nouns look like verb forms and are missing from the word
   * list (la multa), so the note gives both readings. Nothing is said without a place in the text.
   */
  private objectPronoun(w: string, at?: TapAt): Gloss | undefined {
    if (!at || !Object.hasOwn(OBJECT_PRONOUNS, w)) return undefined;
    const tokens = [...at.line.matchAll(/\p{L}+/gu)];
    const me = tokens[at.index], next = tokens[at.index + 1];
    if (!me || !next || at.line.slice(me.index + me[0].length, next.index).trim()) return undefined;
    const n = normWord(next[0]);
    if (this.lemmas.has(n) || this.plural(n) || this.agreeingBase(n)) return undefined;
    return analyzeToken(n).some((r) => r.target && r.accentExact) ? { es: w, en: OBJECT_PRONOUNS[w] } : undefined;
  }

  /** The contractions and the other forms of the articles: the word list has no headword for them. */
  private smallWord(w: string, word: string): Gloss | undefined {
    const s = SMALL_WORDS[w];
    if (!s) return undefined;
    const head = s.of ? this.lemmas.get(s.of) : undefined;
    const en = s.en ?? head?.en;
    if (!en) return undefined;
    return s.of ? { es: head?.es ?? s.of, en, form: word, ...(s.how ? { how: s.how } : {}) } : { es: word, en };
  }

  /** The word list's noun, adjective, determiner or number that a plural is the plural of. An accent may move (jóvenes, habitaciones). */
  private plural(w: string): GraphNode | undefined {
    for (const s of singulars(w)) {
      // the accent moves only where the plural adds -es to a consonant (jóvenes, habitaciones); estés is not a plural of este
      const n = this.pluralizing.get(s) ?? (w.endsWith('es') && s === w.slice(0, -2) ? this.pluralizingPlain.get(deaccent(s)) : undefined);
      if (n) return n;
    }
    return undefined;
  }

  /**
   * A feminine or plural of an adjective, determiner, number or pronoun, read back to its masculine
   * singular (alta, otras, mía). Only the ending moves: a noun is never read as another noun, so
   * Cuba is not a bucket and la is not lo.
   */
  private agreement(w: string, word: string): Gloss | undefined {
    const lex = this.agreeingBase(w);
    return lex?.en ? { es: lex.es ?? word, en: lex.en, form: word } : undefined;
  }

  private agreeingBase(w: string): GraphNode | undefined {
    for (const s of [w, ...singulars(w)]) {
      const stem = s.slice(0, -1);
      const bases = s.endsWith('a')
        ? [`${stem}o`, `${stem}e`, ...(s.endsWith('ora') ? [`${s.slice(0, -3)}or`] : []), ...(s.endsWith('esa') ? [`${s.slice(0, -3)}és`] : []),
          ...(s.endsWith('ona') ? [`${s.slice(0, -3)}ón`] : []), ...(s.endsWith('ana') ? [`${s.slice(0, -3)}án`] : [])]
        : s.endsWith('o') ? [`${stem}e`] : [];
      for (const base of bases) {
        const n = this.agreeing.get(base);
        if (n) return n;
      }
    }
    return undefined;
  }

  /**
   * The story's names: words it capitalises in the middle of a sentence. A word the list also knows
   * (gloria, rosa) is a name only where the story shows a person: someone speaks as it, or it
   * follows don or doña, and it is hardly ever written small. A speaker's label alone is a role.
   */
  private cast(): ReadonlySet<string> {
    if (this.names) return this.names;
    const capital = new Map<string, number>();
    const small = new Map<string, number>();
    const person = new Set<string>();
    for (const ch of this.chapters.values()) {
      for (const line of ch.text.split('\n')) {
        const speaker = line.match(SPEAKER)?.[0].length ?? 0;
        for (const m of line.matchAll(/\p{L}+/gu)) {
          const k = m[0].toLowerCase();
          if (m[0] === k) { small.set(k, (small.get(k) ?? 0) + 1); continue; }
          if (m[0].length < 2 || !isCapitalised(m[0])) continue;
          const before = line.slice(0, m.index!);
          if (m.index! < speaker) person.add(k);
          else if (!startsSentence(before)) {
            capital.set(k, (capital.get(k) ?? 0) + 1);
            if (TITLES.has(before.match(/(\p{L}+)\s*$/u)?.[1].toLowerCase() ?? '')) person.add(k);
          }
        }
      }
    }
    const names = new Set<string>();
    for (const [k, n] of capital) {
      const ordinary = this.lemmas.has(k) || k in SMALL_WORDS || !!this.plural(k) || !!this.agreeingBase(k);
      if (!ordinary || (person.has(k) && (small.get(k) ?? 0) < n)) names.add(k);
    }
    return (this.names = names);
  }
  private names?: Set<string>;

  private isName(word: string): boolean {
    return isCapitalised(word) && this.cast().has(word.toLowerCase());
  }

  /** A node of the graph, a chunk say, whose Spanish is exactly this word. */
  private exactEn(w: string): string | undefined {
    if (!this.exact) {
      this.exact = new Map();
      for (const n of this.course.nodes.values()) {
        if (n.kind === 'cando' || !n.es) continue;
        for (const s of this.segments(n.id)) { const k = normWord(s.es); if (k && !this.exact.has(k)) this.exact.set(k, s.en); }
      }
    }
    return this.exact.get(w);
  }
  private exact?: Map<string, string>;

  /** An inflected verb (clitics included) read back to its infinitive's lexeme. */
  private verbGloss(word: string, w: string, accentExact: boolean): Gloss | undefined {
    const readings = analyzeToken(w).filter((a) => a.target && (!accentExact || a.accentExact));
    readings.sort((a, b) => Number(b.accentExact) - Number(a.accentExact) || Number(!!a.clitics?.length) - Number(!!b.clitics?.length));
    for (const r of readings) {
      const lex = this.verbLexeme(r.inf);
      if (!lex?.en) continue;
      // era is "I" and "he or she" alike, and the story is mostly about he or she: name every person the form can be
      const persons = new Set(readings
        .filter((o) => o.inf === r.inf && o.tense === r.tense && (o.clitics?.length ?? 0) === (r.clitics?.length ?? 0))
        .map((o) => PERSON_WORDS[o.person]).filter(Boolean));
      const how = [[...persons].join(' or '), r.tense === 'imperativo' ? 'command' : tenseShort(r.tense).toLowerCase()].filter(Boolean).join(', ');
      const clitics = r.clitics?.length ? `${how}, with ${r.clitics.join(' + ')} attached` : how;
      // fue is ser or ir, and the sentence decides: a note that picks one is wrong a third of the time
      const also = SHARES_FORMS.has(verbBase(r.inf)) ? readings.find((o) => verbBase(o.inf) !== verbBase(r.inf) && SHARES_FORMS.has(verbBase(o.inf))) : undefined;
      const other = also ? this.verbLexeme(also.inf) : undefined;
      return { es: lex.es ?? r.inf, en: lex.en, form: word, how: other?.en ? `${clitics}; or from ${other.es ?? also!.inf}: ${other.en}` : clitics };
    }
    return undefined;
  }

  private verbLexeme(inf: string): GraphNode | undefined {
    return this.course.nodes.get(`l:${inf}`) ?? this.course.nodes.get(`l:${verbBase(inf)}`);
  }

  /** The bank's English for a sentence of Spanish, matched exactly after trimming. */
  englishOf(es: string): string | undefined {
    if (!this.byEs) {
      this.byEs = new Map();
      for (const s of this.bank) { const k = s.es.trim(); if (k && s.en && !this.byEs.has(k)) this.byEs.set(k, s.en); }
    }
    return this.byEs.get(es.trim());
  }
  private byEs?: Map<string, string>;
}

/** Where a word was tapped: the line of the chapter it sits in, and which of that line's words it is (counting from 0). */
export interface TapAt { line: string; index: number }

/**
 * A tapped word's note. `form` and `how` are set when the word is a form of `es`. `phrase` is the
 * chapter's note on a phrase the word sits in, shown after the word's own; when the word has no
 * note of its own, the phrase is the note. `name` marks the name of a person or a place.
 */
export interface Gloss { es: string; en: string; form?: string; how?: string; phrase?: { es: string; en: string }; name?: true }

/** Parts of speech that have plurals, and that have feminine forms to read back to a masculine. */
const HAS_PLURAL = new Set(['noun', 'adj', 'det', 'num', 'pron']);
const AGREES = new Set(['adj', 'det', 'num', 'pron']);
/** Masculine nouns that name a person by their ending (cliente, vendedor, abogado, vecino): their feminine is read back to them. */
const PERSON_ENDING = /(dor|tor|sor|ente|efe|ario|ado|ino|ico|ecto|acho)$|^socio$/;

/**
 * Little words the word list has no headword for: the contractions, the other forms of the
 * articles and demonstratives, the short forms before a noun, and hay. `of` is the headword they
 * come from; the English is the headword's unless given. sé is here because the engine reads it
 * as the command of ser first, and the story only ever means "I know".
 */
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

/** The article's forms as object pronouns: what they mean straight before a verb. */
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
const wordsOf = (s: string): string[] => (s.match(/\p{L}+/gu) ?? []).map(normWord);
const noteWords = new WeakMap<object, string[]>();
const wordsOfNote = (g: { es: string }): string[] => {
  let t = noteWords.get(g);
  if (!t) noteWords.set(g, t = wordsOf(g.es));
  return t;
};

/** The chapter's note on the tightest phrase that covers the word tapped, in the place it was tapped. */
function phraseAt(chapter: StoryChapter, at: TapAt): { es: string; en: string } | undefined {
  const line = wordsOf(at.line);
  let best: { es: string; en: string } | undefined;
  let bestLen = Infinity;
  for (const g of chapter.gloss) {
    const p = wordsOfNote(g);
    if (p.length < 2 || p.length >= bestLen) continue;
    for (let s = Math.max(0, at.index - p.length + 1); s <= at.index && s + p.length <= line.length; s++) {
      if (p.every((x, j) => line[s + j] === x)) { best = g; bestLen = p.length; break; }
    }
  }
  return best;
}

/** What a plural could be the plural of: luces > luz, canciones > canción, casas > casa. */
function singulars(w: string): string[] {
  const out: string[] = [];
  if (w.endsWith('ces')) out.push(`${w.slice(0, -3)}z`);
  if (w.endsWith('es')) out.push(w.slice(0, -2));
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  return out;
}

/** Words before a first name: don Hernando, doña Gloria. */
const TITLES: ReadonlySet<string> = new Set(['don', 'doña', 'señor', 'señora', 'señorita', 'tío', 'tía', 'doctor', 'doctora', 'profesor', 'profesora', 'inspector', 'abuelo', 'abuela']);

/** A line that opens with the name of who speaks: "Vale:", "Jhon Fredy:". */
const SPEAKER = /^\p{Lu}\p{L}*(?:\s+\p{Lu}\p{L}*)*(?=:)/u;
/** A capital letter that is not shouting (HUELGA): the word starts with one. */
const isCapitalised = (t: string): boolean => t !== t.toLowerCase() && !(t.length > 1 && t === t.toUpperCase());
/** Is the next word the first of a sentence? `before` is the line up to it. */
const startsSentence = (before: string): boolean => { const b = before.trimEnd(); return !b || /[.!?…:¿¡«"“(]$/.test(b); };

const PERSON_WORDS: Readonly<Record<string, string>> = {
  yo: 'I', 'tú': 'you', 'él/ella': 'he or she', nosotros: 'we', ellos: 'they', vos: 'you', vosotros: 'you all',
};

export function stripArticle(s: string): string {
  return s.trim().replace(/^(el|la|los|las|un|una)\s+/i, '').replace(/[.…¿?¡!]/g, '').trim();
}

export function normWord(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\s]/gu, '').trim();
}

/** Spanish-looking text, for marking an option or a line with lang="es". */
export function looksSpanish(s: string): boolean {
  if (/[áéíóúñ¿¡]/i.test(s)) return true;
  const words = s.toLowerCase().match(/\p{L}+/gu) ?? [];
  const es = new Set(['el', 'la', 'los', 'las', 'es', 'soy', 'eres', 'de', 'que', 'y', 'un', 'una', 'en', 'no', 'por', 'con', 'mi', 'tu', 'su', 'somos', 'son', 'muy', 'yo', 'tú', 'usted', 'me', 'te', 'se', 'hola', 'gracias']);
  const en = new Set(['the', 'is', 'are', 'i', 'you', 'a', 'an', 'of', 'and', 'from', 'in', 'to', 'my', 'your', 'he', 'she', 'we', 'they', "i'm", 'it', 'what', 'where']);
  let a = 0, b = 0;
  for (const w of words) { if (es.has(w)) a++; if (en.has(w)) b++; }
  return a > b;
}
