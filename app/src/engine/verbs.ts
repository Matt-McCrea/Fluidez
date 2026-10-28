// The verb list. verbs.json is the old data/verbs.js converted to data (one
// duplicate entry, reflexionar, dropped) plus verbs added in the port, which
// carry `added: true`.
import raw from './verbs.json';
import type { Verb } from './types';

export const VERBS: readonly Verb[] = raw as Verb[];

const BY_INF = new Map<string, Verb>();
for (const v of VERBS) if (!BY_INF.has(v.inf)) BY_INF.set(v.inf, v);

export function verbByInf(inf: string): Verb | null {
  return BY_INF.get(inf) ?? null;
}
