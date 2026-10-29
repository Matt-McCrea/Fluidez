// Finding a verb from an infinitive or from any conjugated form.
import { VERBS, analyzeToken, conjugateCells, deaccent, personsFor, verbByInf, type TenseKey, type Verb } from '../../../engine';
import { TENSE_ORDER } from './tenses';

export interface VerbHit { tense: TenseKey; person: string; form: string }
export interface VerbMatch { verb: Verb; /** how it was found */ via: 'infinitive' | 'form' | 'start'; hits: VerbHit[] }

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/** All verbs a query could mean, best first. Never throws. */
export function findVerbs(query: string, limit = 12): VerbMatch[] {
  const q = norm(query);
  if (!q || q.length < 2) return [];
  const out: VerbMatch[] = [];
  const seen = new Set<string>();
  const add = (m: VerbMatch) => { if (!seen.has(m.verb.inf)) { seen.add(m.verb.inf); out.push(m); } };

  const exact = verbByInf(q) ?? VERBS.find((v) => deaccent(v.inf) === deaccent(q)) ?? null;
  if (exact) add({ verb: exact, via: 'infinitive', hits: [] });

  if (!q.includes(' ')) {
    let analyses: ReturnType<typeof analyzeToken> = [];
    try { analyses = analyzeToken(q); } catch { analyses = []; }
    const by = new Map<string, VerbHit[]>();
    for (const a of analyses) {
      if (!(TENSE_ORDER as readonly string[]).includes(a.tense)) continue;
      const hits = by.get(a.inf) ?? [];
      hits.push({ tense: a.tense, person: String(a.person), form: a.form });
      by.set(a.inf, hits);
    }
    for (const [inf, hits] of by) {
      const verb = verbByInf(inf);
      if (verb) add({ verb, via: 'form', hits });
    }
  }
  if (out.length < limit) {
    const dq = deaccent(q);
    for (const v of VERBS) {
      if (out.length >= limit) break;
      if (deaccent(v.inf).startsWith(dq)) add({ verb: v, via: 'start', hits: [] });
    }
  }
  return out.slice(0, limit);
}

/** The best single match, or null. */
export function findVerb(query: string): VerbMatch | null {
  return findVerbs(query, 1)[0] ?? null;
}

/** Display persons for a tense: no vosotros. Returns [label, index into conjugateCells]. */
export function shownPersons(tense: TenseKey): Array<{ label: string; idx: number; key: string }> {
  const ps = personsFor(tense) as readonly string[];
  const label: Record<string, string> = {
    yo: 'yo', 'tú': 'tú', 'él/ella': 'él / ella / usted', nosotros: 'nosotros', ellos: 'ellos / ellas / ustedes',
    usted: 'usted', ustedes: 'ustedes',
  };
  return ps.map((p, idx) => ({ label: label[p] ?? p, idx, key: p })).filter((p) => p.key !== 'vosotros');
}

export function cellsFor(inf: string, tense: TenseKey): string[] {
  try { return conjugateCells(inf, tense).map((c) => c.form); } catch { return []; }
}
