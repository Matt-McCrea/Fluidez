// Everything the UI needs to render a plan: the full content objects (the
// compiler's index only keeps their shape), the course and the content index.
// Built once per load; read-only afterwards.
import {
  buildContentIndex, buildCourse, type ContentIndex, type ContentSource, type Course,
} from '../../compiler';
import type {
  BankSentence, GraphNode, NodeId, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../../content/schema';
import { alignedPairs, type AlignedPair, type LexemeLike } from '../../exercises';
import { analyzeToken, deaccent } from '../../engine';
import { tenseShort } from '../session/tenses';

export type Segment = AlignedPair;

export class Bundle {
  readonly course: Course;
  readonly index: ContentIndex;
  readonly sentences = new Map<string, BankSentence>();
  readonly chapters = new Map<string, StoryChapter>();
  readonly scenes = new Map<string, Scene>();
  readonly tasks = new Map<string, WritingTask>();
  readonly scripts = new Map<NodeId, TeachingScript>();
  readonly bank: BankSentence[];
  /** lemma (lower case, no article) -> lexeme node, for tap-to-gloss */
  private readonly lemmas = new Map<string, GraphNode>();

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
        if (k && !this.lemmas.has(k)) this.lemmas.set(k, n);
      }
    }
  }

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

  /** The English for a tapped Spanish word: chapter gloss first, then the lexeme graph. */
  gloss(word: string, chapter?: StoryChapter): Gloss | undefined {
    const w = normWord(word);
    if (!w) return undefined;
    if (chapter) {
      let phrase: { es: string; en: string } | undefined;
      for (const g of chapter.gloss) {
        const toks = g.es.split(/\s+/).map(normWord);
        if (toks.length === 1 && toks[0] === w) return g;
        if (!phrase && toks.includes(w)) phrase = g;
      }
      if (phrase) return phrase;
    }
    const lex = this.lemmas.get(w) ?? this.lemmas.get(w.replace(/s$/, '')) ?? this.lemmas.get(w.replace(/es$/, ''));
    if (lex?.en) return { es: lex.es ?? word, en: lex.en };
    const viaVerb = this.verbGloss(word, w);
    if (viaVerb) return viaVerb;
    // a sentence-bank chunk or node whose Spanish is exactly this word
    for (const n of this.course.nodes.values()) {
      if (n.kind === 'cando' || !n.es) continue;
      if (this.segments(n.id).some((s) => normWord(s.es) === w)) return { es: word, en: this.segments(n.id).find((s) => normWord(s.es) === w)!.en };
    }
    return this.looseLemma(w, word);
  }

  /** An inflected verb (clitics included) read back to its infinitive's lexeme. */
  private verbGloss(word: string, w: string): Gloss | undefined {
    const readings = analyzeToken(w).filter((a) => a.target);
    readings.sort((a, b) => Number(b.accentExact) - Number(a.accentExact) || Number(!!a.clitics?.length) - Number(!!b.clitics?.length));
    for (const r of readings) {
      const lex = this.course.nodes.get(`l:${r.inf}`) ?? this.course.nodes.get(`l:${r.inf.replace(/se$/, '')}`);
      if (!lex?.en) continue;
      const person = PERSON_WORDS[r.person];
      const how = [person, r.tense === 'imperativo' ? 'command' : tenseShort(r.tense).toLowerCase()].filter(Boolean).join(', ');
      return { es: lex.es ?? r.inf, en: lex.en, form: word, how: r.clitics?.length ? `${how}, with ${r.clitics.join(' + ')} attached` : how };
    }
    return undefined;
  }

  /** Last resorts: ignore accents, then feminine and plural endings back to the -o word. */
  private looseLemma(w: string, word: string): Gloss | undefined {
    if (!this.plain) {
      this.plain = new Map();
      for (const [k, n] of this.lemmas) { const d = deaccent(k); if (!this.plain.has(d)) this.plain.set(d, n); }
    }
    const d = deaccent(w);
    const cands = [d, d.replace(/(os|as|a|es|s)$/, 'o'), d.replace(/as$/, 'a'), d.replace(/(es|s)$/, ''), d.replace(/(a|as|es)$/, 'e')];
    for (const c of cands) {
      const lex = c ? this.plain.get(c) : undefined;
      if (lex?.en) return { es: lex.es ?? word, en: lex.en, form: word };
    }
    return undefined;
  }
  private plain?: Map<string, GraphNode>;

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

/** A tapped word's note. `form` and `how` are set when the word is a form of `es`. */
export interface Gloss { es: string; en: string; form?: string; how?: string }

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
