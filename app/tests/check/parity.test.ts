// GOLDEN PARITY for the checker: the TS port against the old js/checker.js and
// js/lexmatch.js, loaded unchanged with their data into a fake window.
import { describe, expect, test } from 'vitest';
import {
  answerForms, checkExact, checkWriting, countIn, lexIndex, meaningAlternatives, nounSet,
  type CheckExactOptions, type ConnectorClass, type Constraint,
} from '../../src/check';
import { VERBS, analyzeSentence } from '../../src/engine';
import { loadLegacy } from '../engine/legacy';

const W = loadLegacy(['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js',
  'js/engine.js', 'js/checker.js', 'js/lexmatch.js', 'data/writing.js']);
const C = W.Checker!;
const VOCAB = W.VOCAB ?? [];
const TASKS = W.WRITING_TASKS ?? [];
const ctx = { connectors: (W.CONNECTORS ?? []) as ConnectorClass[], nouns: nounSet(VOCAB) };
const deac = (s: string) => s.normalize('NFD').replace(/[́]/g, '').normalize('NFC');

describe('checkWriting parity on every authored task', () => {
  test('data loaded', () => {
    expect(TASKS.length).toBeGreaterThan(700);
    expect(VOCAB.length).toBeGreaterThan(5000);
  });

  /* Texts: every model, the model with its accents stripped (exercises the
   * near-miss paths), and its first sentence (exercises failing constraints).
   * Differences are allowed ONLY where they are explained by an intended
   * change, which the classifier names; anything else fails. */
  test('results agree except for the intended changes', () => {
    const why: Record<string, number> = {};
    const bad: string[] = [];
    let compared = 0;
    for (const t of TASKS) {
      for (const m of t.models ?? []) {
        for (const text of [m, deac(m), m.split(/(?<=[.!?])\s/)[0]]) {
          const o = C.checkWriting(t, text);
          const n = checkWriting(t as unknown as { constraints: Constraint[] }, text, ctx);
          o.results.forEach((r, i) => {
            compared++;
            const nr = n.results[i];
            if (r.label === nr.label && r.pass === nr.pass && r.detail === nr.detail) return;
            const c = t.constraints[i];
            const reason = classify(c, text, r, nr);
            if (reason) why[reason] = (why[reason] ?? 0) + 1;
            else bad.push(`${t.id} ${JSON.stringify(c)} on "${text.slice(0, 80)}": old ${r.pass}/${r.detail} new ${nr.pass}/${nr.detail}`);
          });
        }
      }
    }
    expect(bad).toEqual([]);
    expect(compared).toBeGreaterThan(4000);
    // the intended changes are rare: they must not swamp the comparison
    const changed = Object.values(why).reduce((a, b) => a + b, 0);
    expect(changed).toBeLessThan(compared / 50);
  });
});

/* Why may a constraint result legitimately differ? */
function classify(c: Record<string, unknown>, text: string, o: { pass: boolean; detail: string }, n: { pass: boolean; detail: string }): string | null {
  const a = analyzeSentence(text);
  const hasCompound = a.compounds.length > 0;
  // the old index filed "no dé" under participles: "hayan de" was a compound
  if (W.ENGINE.analyzeSentence(text).compounds.some((x) => x.parts.every((p) => p.tense === 'impneg'))) return 'old impneg pseudo-compound';
  // compound tenses now count as the tense their haber builds, not all five
  if ((c.type === 'anyVerbInTense' || c.type === 'distinctTenses') && hasCompound) return 'compound tense by haber';
  // verbs added in the port give readings the old engine could not
  const newVerb = a.verbs.some((w) => w.analyses.some((x) => isAdded(x.inf)));
  if (newVerb && ['person', 'verbType', 'anyVerbInTense', 'distinctTenses', 'avoidsPerson', 'sePassive', 'subjunctiveAfter', 'verbFormAny'].includes(String(c.type))) return 'added verbs';
  // new tenses (-se subjunctive, future subjunctive) give readings the old could not
  const newTense = a.verbs.some((w) => w.analyses.some((x) => ['impsubjse', 'futsubj'].includes(x.tense)));
  if (newTense && ['person', 'anyVerbInTense', 'distinctTenses', 'avoidsPerson', 'sePassive', 'subjunctiveAfter', 'verbFormAny', 'verbType'].includes(String(c.type))) return 'added tenses';
  void o; void n;
  return null;
}

const ADDED = new Set(VERBS.filter((v) => v.added).map((v) => v.inf));
const isAdded = (inf: string) => ADDED.has(inf);

describe('answerForms / meaningAlternatives parity', () => {
  const strings = [...new Set([...VOCAB.flatMap((v) => [v.es, v.en]),
    ...TASKS.flatMap((t) => t.models ?? [])])];
  test('answerForms identical on every vocab string and model', () => {
    const bad = strings.filter((s) => JSON.stringify(C.answerForms(s)) !== JSON.stringify(answerForms(s)));
    expect(bad).toEqual([]);
  });
  test('meaningAlternatives identical on every vocab string', () => {
    const bad = strings.filter((s) => JSON.stringify(C.meaningAlternatives(s)) !== JSON.stringify(meaningAlternatives(s)));
    expect(bad).toEqual([]);
  });
});

describe('checkExact parity', () => {
  /* Accepted = a vocab entry; inputs = the entry itself, its accents
   * stripped, its ñ folded, upper-cased, punctuated, its English, and the
   * NEXT entry (a wrong answer) — under each option set. */
  test('identical on every vocab entry × input variant × option set', () => {
    const optSets: CheckExactOptions[] = [{}, { meaning: true }, { accents: 'lenient' }, { also: ['entonces', 'luego'] }];
    const bad: string[] = [];
    VOCAB.forEach((v, i) => {
      const next = VOCAB[(i + 1) % VOCAB.length];
      const inputs = [v.es, deac(v.es), deac(v.es).replace(/ñ/g, 'n'), v.es.toUpperCase(), v.es + '.', '¿' + v.es + '?', v.en, next.es, ''];
      for (const opts of optSets) for (const inp of inputs) {
        const accepted = opts.meaning ? v.en : v.es;
        const o = C.checkExact(inp, accepted, opts);
        const n = checkExact(inp, accepted, opts);
        if (o.pass !== n.pass || o.near !== n.near) bad.push(`${JSON.stringify(opts)} "${inp}" vs "${accepted}": old ${JSON.stringify(o)} new ${JSON.stringify(n)}`);
      }
    });
    expect(bad.slice(0, 20)).toEqual([]);
  });
});

describe('lexmatch parity', () => {
  test('index().has and countIn agree on 120 model texts × the whole vocabulary', () => {
    const texts = TASKS.flatMap((t) => t.models ?? []).slice(0, 120);
    const L = W.LexMatch!;
    const bad: string[] = [];
    for (const text of texts) {
      const oi = L.index(text), ni = lexIndex(text);
      for (const v of VOCAB) if (oi.has(v.es) !== ni.has(v.es)) bad.push(`${v.es} in ${text.slice(0, 40)}`);
      if (L.countIn(text, VOCAB) !== countIn(text, VOCAB)) bad.push('countIn ' + text.slice(0, 40));
    }
    expect(bad).toEqual([]);
  });
});
