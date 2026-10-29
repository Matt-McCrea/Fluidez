// What the Reference screen lists, built from the bundle and the learner.
import type { GraphNode, NodeId } from '../../../content/schema';
import type { Bundle } from '../../data/bundle';
import { stripArticle } from '../../data/bundle';
import type { SavedWord } from '../../store/ui';
import { searchEntries, type Searchable } from './search';
import { TOPICS, TOPIC_LABEL, topicOf, type TopicId } from './topics';

/** The learner calls only what these methods give; keeps the model testable. */
export interface LearnerView {
  nodes(): NodeId[];
  retrievability(id: NodeId, dir: 'receptive' | 'productive'): number | undefined;
}

export type Strength = 'solid' | 'fading' | 'shaky' | 'new';

export function strengthOf(r: number | undefined): Strength {
  if (r === undefined) return 'new';
  return r >= 0.9 ? 'solid' : r >= 0.7 ? 'fading' : 'shaky';
}

export const STRENGTH_TEXT: Readonly<Record<Strength, string>> = {
  solid: 'Solid', fading: 'Fading', shaky: 'Shaky', new: 'Just started',
};

export interface GrammarEntry extends Searchable {
  id: NodeId;
  title: string;
  topic: TopicId;
  met: boolean;
  priority: number;
  week?: number;
}

const GRAMMAR_KINDS = new Set(['grammar', 'pattern', 'contrast', 'chunk']);

/** The course week (unit number) a node is taught in, if the course says. */
export function weekOf(bundle: Pick<Bundle, 'course'>, id: NodeId): number | undefined {
  const c = bundle.course;
  const pos = c.teachPos.get(id);
  if (pos === undefined || !c.unitStart?.length) return undefined;
  let w = 0;
  for (let i = 0; i < c.unitStart.length; i++) if (c.unitStart[i] <= pos) w = i + 1;
  return w || undefined;
}

export function grammarEntries(bundle: Bundle, met: Set<string>): GrammarEntry[] {
  const out: GrammarEntry[] = [];
  for (const n of bundle.course.nodes.values()) {
    if (!GRAMMAR_KINDS.has(n.kind)) continue;
    const topic = topicOf(n);
    const label = TOPICS.find((t) => t.id === topic);
    out.push({
      id: n.id,
      title: bundle.title(n.id),
      topic,
      met: met.has(n.id),
      priority: n.priority,
      week: weekOf(bundle, n.id),
      es: [n.es ?? '', ...(n.forms ?? []).map((f) => f.es)].filter(Boolean),
      en: [n.title, n.en ?? '', ...(n.forms ?? []).map((f) => f.en)].filter(Boolean),
      extra: [...(label?.words ?? []), TOPIC_LABEL[topic]],
    });
  }
  return out.sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : 1));
}

export function groupByTopic(entries: GrammarEntry[]): Array<{ topic: TopicId; label: string; entries: GrammarEntry[] }> {
  return TOPICS
    .map((t) => ({ topic: t.id, label: t.label, entries: entries.filter((e) => e.topic === t.id) }))
    .filter((g) => g.entries.length);
}

export interface WordEntry extends Searchable {
  id?: NodeId;
  word: string;
  gloss: string;
  strength: Strength;
  saved: boolean;
  gender?: string;
  pos?: string;
}

export function wordEntries(bundle: Bundle, learner: LearnerView, saved: readonly SavedWord[]): WordEntry[] {
  const out: WordEntry[] = [];
  const byLemma = new Map<string, WordEntry>();
  const lex: GraphNode[] = [];
  for (const id of learner.nodes()) {
    const n = bundle.node(id);
    if (n && n.kind === 'lexeme' && n.es) lex.push(n);
  }
  lex.sort((a, b) => (a.freqRank ?? 1e9) - (b.freqRank ?? 1e9));
  for (const n of lex) {
    const r = learner.retrievability(n.id, 'productive') ?? learner.retrievability(n.id, 'receptive');
    const e: WordEntry = {
      id: n.id, word: n.es!, gloss: n.en ?? n.title, strength: strengthOf(r), saved: false,
      gender: n.gender, pos: n.pos, es: [n.es!], en: [n.en ?? n.title],
    };
    out.push(e);
    byLemma.set(stripArticle(n.es!).toLowerCase(), e);
  }
  for (const s of saved) {
    const hit = byLemma.get(stripArticle(s.es).toLowerCase());
    if (hit) { hit.saved = true; continue; }
    out.push({ word: s.es, gloss: s.en, strength: 'new', saved: true, es: [s.es], en: [s.en] });
  }
  return out;
}

export { searchEntries };
