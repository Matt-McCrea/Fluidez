// Everything the UI needs to render a plan: the full content objects (the
// compiler's index only keeps their shape), the course and the content index.
// Built once per load; read-only afterwards.
import {
  buildContentIndex, buildCourse, type ContentIndex, type ContentSource, type Course,
} from '../../compiler';
import type {
  BankSentence, GraphNode, NodeId, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../../content/schema';
import type { LexemeLike } from '../../exercises';

export interface Segment { es: string; en: string }

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

  /**
   * A node's Spanish/English as pairs of short segments ("Hola. / Buenos días."
   * -> two pairs). The first pair is what a retrieval asks for; a "— reply" part
   * is dropped from a retrieval prompt.
   */
  segments(id: NodeId): Segment[] {
    const n = this.node(id);
    if (!n?.es) return [];
    const head = (s: string) => s.split(/\s+—\s+/)[0].trim();
    const es = n.es.split(/\s+\/\s+/).map(head).filter(Boolean);
    const en = (n.en ?? n.title).split(/\s+\/\s+/).map(head).filter(Boolean);
    return es.map((e, i) => ({ es: e, en: en[i] ?? en[0] ?? n.title }));
  }

  lexemeLike(id: NodeId): LexemeLike | undefined {
    const n = this.node(id);
    if (!n?.es || !n.en) return undefined;
    return { id, es: n.es.split(/\s+\/\s+/)[0], en: n.en.split(/\s+\/\s+/)[0], ...(n.peninsular ? { peninsular: n.peninsular } : {}) };
  }

  /** The English for a tapped Spanish word: chapter gloss first, then the lexeme graph. */
  gloss(word: string, chapter?: StoryChapter): { es: string; en: string } | undefined {
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
    // a sentence-bank chunk or node whose Spanish is exactly this word
    for (const n of this.course.nodes.values()) {
      if (n.kind === 'cando' || !n.es) continue;
      if (this.segments(n.id).some((s) => normWord(s.es) === w)) return { es: word, en: this.segments(n.id).find((s) => normWord(s.es) === w)!.en };
    }
    return undefined;
  }
}

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
