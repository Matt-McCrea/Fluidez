// Pure helpers for tools/bank-import.ts: spine order, legal day, cleaning rules, banding.
import { taughtAt, type Graph } from '../../lib/graph';

export interface Day { lesson?: string | null }
export type LessonNodes = Record<string, { teaches?: string[] } | undefined>;

/** Taught day (index into days) of every node: a node is taught at the first day whose lesson teaches it
 *  (a chunk also teaches the grammar it unpacks, via lib/graph taughtAt). */
export function taughtDays(g: Graph, days: readonly Day[], ln: LessonNodes): Map<string, number> {
  const order: string[] = [];
  const dayOfPos: number[] = [];
  days.forEach((d, i) => {
    for (const n of (d.lesson && ln[d.lesson]?.teaches) || []) { order.push(n); dayOfPos.push(i); }
  });
  const out = new Map<string, number>();
  for (const [id, pos] of taughtAt(g, order)) out.set(id, dayOfPos[pos]);
  return out;
}

/** First day by which every non-lexeme require that the spine teaches is taught. Lexemes, ids the graph
 *  does not know and never-taught nodes do not block (lib/graph lateRequires rule). null only if the
 *  spine has no days. */
export function legalDay(g: Graph, taught: ReadonlyMap<string, number>, requires: readonly string[], nDays: number): number | null {
  if (nDays <= 0) return null;
  let d = 0;
  for (const r of requires) {
    const n = g.nodes.get(r);
    if (!n || n.kind === 'lexeme') continue;
    const t = taught.get(r);
    if (t !== undefined && t > d) d = t;
  }
  return d;
}

export function bandOf(day: number, bands: Record<string, number>): string {
  let best = '', at = -1;
  for (const [b, s] of Object.entries(bands)) if (s <= day && s > at) { best = b; at = s; }
  return best;
}

/** Normalised text for duplicate detection: lowercase, punctuation out, spaces collapsed; accents kept. */
export const normText = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export const hasDash = (es: string) => /[–—]|\s-\s/.test(es);
export const subjunctiveNoTrigger = (confidence: string, reasons: readonly string[]) =>
  confidence === 'low' && reasons.some((r) => /subjunctive .*without a recognised trigger/.test(r));

export type DropReason = 'duplicate' | 'dash' | 'vosotros' | 'voseo' | 'subjunctive-no-trigger';

/** Decide the first reason a row is dropped for (null = keep). `seen` holds normalised texts so far. */
export function dropReason(
  row: { es: string }, tag: { confidence: string; lowReasons: string[] }, dialectRules: readonly string[], seen: Set<string>,
): { reason: DropReason | null; all: DropReason[] } {
  const all: DropReason[] = [];
  const key = normText(row.es);
  if (seen.has(key)) all.push('duplicate');
  if (hasDash(row.es)) all.push('dash');
  if (dialectRules.includes('vosotros')) all.push('vosotros');
  if (dialectRules.includes('voseo')) all.push('voseo');
  if (subjunctiveNoTrigger(tag.confidence, tag.lowReasons)) all.push('subjunctive-no-trigger');
  if (!all.includes('duplicate')) seen.add(key);   // a dropped-for-other-reason row still claims its text
  return { reason: all[0] ?? null, all };
}
