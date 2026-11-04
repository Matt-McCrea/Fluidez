// Finding a verb from an infinitive or from any conjugated form.
import { VERBS, analyzeToken, conjugateCells, deaccent, personsFor, type TenseKey, type Verb } from '../engine';
import { TENSE_ORDER } from './tenses';

/** `se`: the form is the -se one (fuese), which the table shows beside the -ra one (fuera). */
export interface VerbHit { tense: TenseKey; person: string; form: string; se?: true }
export interface VerbMatch { verb: Verb; /** how it was found */ via: 'infinitive' | 'form' | 'start'; hits: VerbHit[] }

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

/** The -se forms are another way to say the -ra tenses: they are looked up under them. */
const SE_FORM: Readonly<Partial<Record<string, TenseKey>>> = { impsubjse: 'impsubj', pluscsubjse: 'pluscsubj' };

const byInfCache = new WeakMap<readonly Verb[], Map<string, Verb>>();
function byInf(verbs: readonly Verb[]): Map<string, Verb> {
  let m = byInfCache.get(verbs);
  if (!m) { m = new Map(verbs.map((v) => [v.inf, v])); byInfCache.set(verbs, m); }
  return m;
}

/**
 * All verbs a query could mean, best first. Never throws. `verbs` is the list to search
 * (the engine's whole verb list by default; pass the verbs a learner has reached to limit it).
 */
export function findVerbs(query: string, limit = 12, verbs: readonly Verb[] = VERBS): VerbMatch[] {
  const q = norm(query);
  if (!q || q.length < 2) return [];
  const out: VerbMatch[] = [];
  const seen = new Set<string>();
  const add = (m: VerbMatch) => { if (!seen.has(m.verb.inf)) { seen.add(m.verb.inf); out.push(m); } };

  const index = byInf(verbs);
  const exact = index.get(q) ?? verbs.find((v) => deaccent(v.inf) === deaccent(q)) ?? null;
  if (exact) add({ verb: exact, via: 'infinitive', hits: [] });

  if (!q.includes(' ')) {
    let analyses: ReturnType<typeof analyzeToken> = [];
    try { analyses = analyzeToken(q); } catch { analyses = []; }
    const by = new Map<string, VerbHit[]>();
    for (const a of analyses) {
      const tense = SE_FORM[a.tense] ?? a.tense;
      if (!(TENSE_ORDER as readonly string[]).includes(tense)) continue;
      const hits = by.get(a.inf) ?? [];
      hits.push({ tense, person: String(a.person), form: a.form, ...(tense !== a.tense ? { se: true as const } : {}) });
      by.set(a.inf, hits);
    }
    for (const [inf, hits] of by) {
      const verb = index.get(inf);
      if (verb) add({ verb, via: 'form', hits });
    }
  }
  if (out.length < limit) {
    const dq = deaccent(q);
    for (const v of verbs) {
      if (out.length >= limit) break;
      if (deaccent(v.inf).startsWith(dq)) add({ verb: v, via: 'start', hits: [] });
    }
  }
  return out.slice(0, limit);
}

/** The best single match, or null. */
export function findVerb(query: string, verbs: readonly Verb[] = VERBS): VerbMatch | null {
  return findVerbs(query, 1, verbs)[0] ?? null;
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

/** The -se form that goes beside a tense's -ra form, where there is one (fuera / fuese). */
export function seCellsFor(inf: string, tense: TenseKey): string[] {
  return tense === 'impsubj' ? cellsFor(inf, 'impsubjse') : tense === 'pluscsubj' ? cellsFor(inf, 'pluscsubjse') : [];
}
