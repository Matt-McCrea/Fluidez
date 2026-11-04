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
