// GOLDEN PARITY: the TypeScript engine against the old js/engine.js, loaded
// unchanged into a fake window. Every verb × tense × person, every participle
// and gerund, and analyzeToken over every generated form must agree exactly,
// except for the reviewed fixes in parity-whitelist.ts.
import { describe, expect, test } from 'vitest';
import {
  analyzeSentence, analyzeToken, conjugate, enPhrase, gerund, isIrregularIn, participle, personsFor, verbByInf,
  type Analysis, type TenseKey, type Verb,
} from '../../src/engine';
import { legacyEngine, loadLegacy, type LegacyAnalysis, type LegacyVerb } from './legacy';
import { CONJ_FIXES } from './parity-whitelist';

const W = legacyEngine();
const E = W.ENGINE;
const OLD_TENSES = E.TENSES.map((t) => t.key as TenseKey);
const OLD_TENSE_SET = new Set<string>(OLD_TENSES);

// The old list carries reflexionar twice; the port keeps the first.
const OLD_VERBS: LegacyVerb[] = [];
{
  const seen = new Set<string>();
  for (const v of W.VERBS) if (!seen.has(v.inf)) { seen.add(v.inf); OLD_VERBS.push(v); }
}
const OLD_INFS = new Set(OLD_VERBS.map((v) => v.inf));

function newVerb(inf: string): Verb {
  const v = verbByInf(inf);
  if (!v) throw new Error('verb missing from port: ' + inf);
  return v;
}

describe('conjugation parity with the old engine', () => {
  const diffs = new Map<string, { old: string; new: string }>();
  for (const ov of OLD_VERBS) {
    const nv = newVerb(ov.inf);
    for (const t of OLD_TENSES) {
      const o = E.conjugate(ov, t);
      const n = conjugate(nv, t);
      o.forEach((f, i) => { if (f !== n[i]) diffs.set(`${ov.inf}|${t}|${i}`, { old: f, new: n[i] }); });
    }
    const op = E.participle(ov), np = participle(nv);
    if (op !== np) diffs.set(`${ov.inf}|PART`, { old: op, new: np });
    const og = E.gerund(ov), ng = gerund(nv);
    if (og !== ng) diffs.set(`${ov.inf}|GER`, { old: og, new: ng });
  }

  test('covers every old verb', () => {
    expect(OLD_VERBS.length).toBe(1165);
  });

  test('every difference is a whitelisted fix, with exactly the expected forms', () => {
    const unexpected = [...diffs].filter(([k, d]) => {
      const w = CONJ_FIXES[k];
      return !w || w.old !== d.old || w.new !== d.new;
    });
    expect(unexpected.map(([k, d]) => `${k}: ${d.old} -> ${d.new}`)).toEqual([]);
  });

  test('every whitelisted fix is still a difference (no stale entries)', () => {
    const stale = Object.keys(CONJ_FIXES).filter((k) => !diffs.has(k));
    expect(stale).toEqual([]);
  });

  test('isIrregularIn agrees for every verb and tense', () => {
    const bad: string[] = [];
    for (const ov of OLD_VERBS) for (const t of OLD_TENSES) {
      if (E.isIrregularIn(ov, t) !== isIrregularIn(newVerb(ov.inf), t)) bad.push(ov.inf + '|' + t);
    }
    expect(bad).toEqual([]);
  });

  test('enPhrase agrees for every verb, tense and person', () => {
    const bad: string[] = [];
    for (const ov of OLD_VERBS) for (const t of OLD_TENSES) for (let i = 0; i < personsFor(t).length; i++) {
      const o = E.enPhrase(ov, t, i), n = enPhrase(newVerb(ov.inf), t, i);
      if (o.text !== n.text || o.marker !== n.marker) bad.push(`${ov.inf}|${t}|${i}: ${o.text} / ${n.text}`);
    }
    expect(bad).toEqual([]);
  });
});

/* ---- analyzeToken ---------------------------------------------------------
 * Compared over every word of every form the old engine generates (with the
 * reflexive imperatives, which exercise the clitic path), plus each word with
 * its accents stripped (accentExact: false). The TS analyses are filtered to
 * what the old engine could produce — old verbs, old tenses, no voseo — and
 * projected to the old fields. A token whose readings involve a fixed cell is
 * exempt: it is expected to differ, and fixes.test.ts checks those directly. */
const project = (a: LegacyAnalysis | Analysis) =>
  JSON.stringify([a.inf, a.tense, a.person, a.form, a.type, a.accentExact, a.clitics ?? null]);

function cellKey(a: { inf: string; tense: string; person: string }): string {
  return `${a.inf}|${a.tense}|${personsFor(a.tense as TenseKey).indexOf(a.person as never)}`;
}

describe('analyzeToken parity with the old engine', () => {
  const tokens = new Set<string>();
  const deac = (s: string) => s.replace(/[áéíóú]/g, (c) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' })[c] ?? c);
  for (const ov of OLD_VERBS) for (const t of OLD_TENSES) for (const f of E.conjugate(ov, t)) {
    for (const w of f.toLowerCase().split(' ')) { tokens.add(w); tokens.add(deac(w)); }
  }

  test('identical analyses on every generated token', () => {
    let compared = 0, exempt = 0;
    const bad: string[] = [];
    for (const tok of tokens) {
      const oldA = E.analyzeToken(tok);
      const newA = analyzeToken(tok).filter((a) => a.variety !== 'voseo' && OLD_TENSE_SET.has(a.tense) && OLD_INFS.has(a.inf));
      if ([...oldA, ...newA].some((a) => CONJ_FIXES[cellKey(a)])) { exempt++; continue; }
      compared++;
      const o = [...new Set(oldA.map(project))].sort();
      const n = [...new Set(newA.map(project))].sort();
      if (JSON.stringify(o) !== JSON.stringify(n)) bad.push(`${tok}\n  old ${o.join(' ')}\n  new ${n.join(' ')}`);
    }
    expect(bad.slice(0, 20)).toEqual([]);
    expect(compared).toBeGreaterThan(40000);
    expect(exempt).toBeLessThan(400);
  });
});

describe('analyzeSentence parity on every authored writing model', () => {
  const WT = loadLegacy(['data/verbs.js', 'js/engine.js', 'data/writing.js']).WRITING_TASKS ?? [];
  const sentences = WT.flatMap((t) => t.models ?? []);

  test('loads the old models', () => { expect(sentences.length).toBeGreaterThan(600); });

  test('tokens, verbs and compounds agree', () => {
    const bad: string[] = [];
    for (const s of sentences) {
      const o = E.analyzeSentence(s), n = analyzeSentence(s);
      if (JSON.stringify(o.tokens) !== JSON.stringify(n.tokens)) { bad.push('tokens: ' + s); continue; }
      const ov = o.verbs.map((v) => `${v.index}:` + [...new Set(v.analyses.filter((a) => !CONJ_FIXES[cellKey(a)]).map(project))].sort().join(' '));
      const nv = n.verbs
        .map((v) => ({ ...v, analyses: v.analyses.filter((a) => a.variety !== 'voseo' && OLD_TENSE_SET.has(a.tense) && OLD_INFS.has(a.inf)) }))
        .filter((v) => v.analyses.length)
        .map((v) => `${v.index}:` + [...new Set(v.analyses.filter((a) => !CONJ_FIXES[cellKey(a)]).map(project))].sort().join(' '));
      if (JSON.stringify(ov) !== JSON.stringify(nv)) bad.push(`verbs: ${s}\n  ${ov.join(' | ')}\n  ${nv.join(' | ')}`);
      // compounds: same haber+participle pairs. Two intended differences: the
      // old index filed "no dé" under participles, so "hayan de" was a compound;
      // and participles of verbs added in the port (ha desaparecido) are new.
      const oc = o.compounds.filter((c) => c.parts.some((p) => p.tense !== 'impneg')).map((c) => `${c.haber} ${c.participle}`);
      const nc = n.compounds.filter((c) => c.parts.some((p) => OLD_INFS.has(p.inf))).map((c) => `${c.haber} ${c.participle}`);
      if (JSON.stringify(oc) !== JSON.stringify(nc)) bad.push(`compounds: ${s}\n  ${oc}\n  ${nc}`);
    }
    expect(bad).toEqual([]);
  });
});
