// Pure helpers for tools/content-import.ts.
import type { Graph } from '../lib/graph';

export const hasDash = (s: string) => /[–—]|\s-\s/.test(s);

/** The right option must be exactly the text inside the gap, and the gap must lie inside es. */
export function gapOptionOk(it: { es: string; gap: [number, number]; options: string[]; answer: number }): boolean {
  const [a, b] = it.gap;
  if (!(a >= 0 && b > a && b <= it.es.length)) return false;
  return it.options[it.answer] !== undefined && it.es.slice(a, b) === it.options[it.answer];
}

/** Serving rule: a required g: or x: node the course never teaches blocks (null); p: and c: only count when
 *  taught; l: and unknown ids never block. Otherwise the latest taught day. */
export function servingLegalDay(g: Graph, taught: ReadonlyMap<string, number>, requires: readonly string[], nDays: number): number | null {
  if (nDays <= 0) return null;
  let d = 0;
  for (const r of requires) {
    const n = g.nodes.get(r);
    if (!n || n.kind === 'lexeme') continue;
    const t = taught.get(r);
    if (t === undefined) { if (r.startsWith('g:') || r.startsWith('x:')) return null; continue; }
    if (t > d) d = t;
  }
  return d;
}

/** A scene's requirement set: its focus nodes, plus tagger g:/x: nodes found in at least two npc lines.
 *  Accepted learner lines add nothing (the matcher takes any one of them). */
export function sceneRequires(focus: ReadonlyArray<string | undefined>, npcNodes: ReadonlyArray<ReadonlySet<string>>, known: (id: string) => boolean): string[] {
  const out = new Set<string>();
  for (const f of focus) if (f && known(f)) out.add(f);
  const count = new Map<string, number>();
  for (const set of npcNodes) for (const n of set) count.set(n, (count.get(n) ?? 0) + 1);
  for (const [n, c] of count) if (c >= 2) out.add(n);
  return [...out].sort();
}
