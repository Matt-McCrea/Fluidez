// Instant client-side search over small lists. Ranks exact matches first.
import { deaccent } from '../../../engine';

export interface Searchable { es: string[]; en: string[]; /** weaker text: labels, topic words */ extra?: string[] }

export const norm = (s: string): string => deaccent((s ?? '').toLowerCase()).replace(/[¿?¡!.,;:()"]/g, ' ').replace(/\s+/g, ' ').trim();

function scoreText(q: string, texts: string[], exact: number, start: number, word: number, any: number): number {
  let best = 0;
  for (const raw of texts) {
    // Several alternatives in one field ("el día / los días"): score each.
    for (const part of String(raw ?? '').split(/\s*[/;]\s*/)) {
      const t = norm(part);
      if (!t) continue;
      const bare = t.replace(/^(el|la|los|las|un|una|to|the|a) /, '');
      let s = 0;
      if (t === q || bare === q) s = exact;
      else if (t.startsWith(q) || bare.startsWith(q)) s = start;
      else if ((' ' + t).includes(' ' + q)) s = word;
      else if (t.includes(q)) s = any;
      if (s > best) best = s;
    }
  }
  return best;
}

/** 0 when it does not match. Spanish beats English at the same rank. */
export function scoreEntry(query: string, e: Searchable): number {
  const q = norm(query);
  if (!q) return 1;
  let s = Math.max(
    scoreText(q, e.es, 100, 80, 60, 40),
    scoreText(q, e.en, 95, 75, 55, 35),
    scoreText(q, e.extra ?? [], 30, 25, 20, 10),
  );
  if (!s && q.includes(' ')) {
    const all = norm([...e.es, ...e.en, ...(e.extra ?? [])].join(' '));
    if (q.split(' ').every((w) => all.includes(w))) s = 15;
  }
  return s;
}

/** Matching entries, best first (stable for equal scores). Empty query keeps the order. */
export function searchEntries<T extends Searchable>(entries: readonly T[], query: string): T[] {
  if (!norm(query)) return [...entries];
  return entries
    .map((e, i) => ({ e, i, s: scoreEntry(query, e) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.e);
}
