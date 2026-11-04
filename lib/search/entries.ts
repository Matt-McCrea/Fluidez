// The Reference lists as pure functions of the data they are given: lessons, vocabulary, retrievability.
// (Ported from app/src/ui/screens/reference/model.ts, which read the content bundle and the learner.)
import { standardNames } from './names';
import type { Searchable } from './search';
import { TOPICS, TOPIC_LABEL, topicOf, type TopicId } from './topics';

export type Strength = 'solid' | 'fading' | 'shaky' | 'new';

export function strengthOf(r: number | undefined): Strength {
  if (r === undefined) return 'new';
  return r >= 0.9 ? 'solid' : r >= 0.7 ? 'fading' : 'shaky';
}

export const STRENGTH_TEXT: Readonly<Record<Strength, string>> = {
  solid: 'Solid', fading: 'Fading', shaky: 'Shaky', new: 'Just started',
};

/** A lesson as the list needs it. `title` is the learner-facing title. */
export interface LessonLike {
  id: string;
  title: string;
  kind?: string;
  priority?: number;
  es?: string;
  en?: string;
  forms?: ReadonlyArray<{ es: string; en: string }>;
  tags?: readonly string[];
  pcic?: readonly string[];
  /** the course week (unit number) it is taught in */
  week?: number;
}

export interface GrammarEntry extends Searchable {
  id: string;
  title: string;
  topic: TopicId;
  met: boolean;
  priority: number;
  week?: number;
  strength: Strength;
}

export interface GrammarOptions {
  /** ids the learner has met */
  met?: ReadonlySet<string>;
  /** retrievability of a lesson, 0..1, or undefined when unknown (see lib/fsrs) */
  retrievability?: (id: string) => number | undefined;
}

export function grammarEntries(lessons: readonly LessonLike[], opts: GrammarOptions = {}): GrammarEntry[] {
  const met = opts.met ?? new Set<string>();
  const out: GrammarEntry[] = [];
  for (const n of lessons) {
    const topic = topicOf(n);
    const label = TOPICS.find((t) => t.id === topic);
    const isMet = met.has(n.id);
    out.push({
      id: n.id,
      title: n.title,
      topic,
      met: isMet,
      priority: n.priority ?? 0,
      week: n.week,
      strength: isMet && opts.retrievability ? strengthOf(opts.retrievability(n.id)) : 'new',
      names: standardNames(n),
      es: [n.es ?? '', ...(n.forms ?? []).map((f) => f.es)].filter(Boolean),
      en: [n.en ?? '', ...(n.forms ?? []).map((f) => f.en)].filter(Boolean),
      extra: [...(label?.words ?? []), TOPIC_LABEL[topic]],
    });
  }
  return out.sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : 1));
}

export function groupByTopic(entries: readonly GrammarEntry[]): Array<{ topic: TopicId; label: string; entries: GrammarEntry[] }> {
  return TOPICS
    .map((t) => ({ topic: t.id, label: t.label, entries: entries.filter((e) => e.topic === t.id) }))
    .filter((g) => g.entries.length);
}

export interface VocabLike { id?: string; es: string; en: string; pos?: string; gender?: string; freqRank?: number }
export interface SavedLike { es: string; en: string }

export interface WordEntry extends Searchable {
  id?: string;
  word: string;
  gloss: string;
  strength: Strength;
  saved: boolean;
  met?: boolean;
  gender?: string;
  pos?: string;
}

export const stripArticle = (s: string): string =>
  s.trim().replace(/^(el|la|los|las|un|una)\s+/i, '').replace(/[.…¿?¡!]/g, '').trim();

export interface WordOptions {
  /** ids of vocabulary the learner has met; every item is listed as met when omitted */
  met?: ReadonlySet<string>;
  retrievability?: (id: string) => number | undefined;
  saved?: readonly SavedLike[];
}

/** Vocabulary entries, most frequent first; saved words not in the list are added at the end. */
export function wordEntries(vocab: readonly VocabLike[], opts: WordOptions = {}): WordEntry[] {
  const out: WordEntry[] = [];
  const byLemma = new Map<string, WordEntry>();
  const sorted = [...vocab].sort((a, b) => (a.freqRank ?? 1e9) - (b.freqRank ?? 1e9));
  for (const n of sorted) {
    const isMet = !opts.met || (n.id !== undefined && opts.met.has(n.id));
    const r = isMet && n.id !== undefined ? opts.retrievability?.(n.id) : undefined;
    const e: WordEntry = {
      ...(n.id !== undefined ? { id: n.id } : {}), word: n.es, gloss: n.en, strength: strengthOf(r), saved: false, met: isMet,
      gender: n.gender, pos: n.pos, es: [n.es], en: [n.en],
    };
    out.push(e);
    byLemma.set(stripArticle(n.es).toLowerCase(), e);
  }
  for (const s of opts.saved ?? []) {
    const hit = byLemma.get(stripArticle(s.es).toLowerCase());
    if (hit) { hit.saved = true; continue; }
    out.push({ word: s.es, gloss: s.en, strength: 'new', saved: true, es: [s.es], en: [s.en] });
  }
  return out;
}

/** The English words of a theme ("Personal identification: family, friends"): the part after the colon split, then the area before it. */
export function themeWords(theme: string): string[] {
  const i = theme.indexOf(':');
  const after = i >= 0 ? theme.slice(i + 1) : theme;
  const parts = after.split(/[,;/]|\band\b/).map((w) => w.trim()).filter(Boolean);
  return i >= 0 ? [...parts, theme.slice(0, i).trim()] : parts;
}
