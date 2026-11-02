// Look up finds things by the names grammar books use (audit F21, L5, H4): the
// course titles its lessons in plain English, so "preterite" matched nothing.
// And the -se forms (fuese, hubiese) are verbs too.
import { beforeAll, describe, expect, it } from 'vitest';
import { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { grammarEntries, searchEntries, type GrammarEntry } from '../../src/ui/screens/reference/model';
import { findVerbs } from '../../src/ui/screens/reference/verbs';
import { TENSE_PLAIN, tenseName } from '../../src/ui/screens/reference/tenses';

let entries: GrammarEntry[];
beforeAll(async () => {
  const { units, nodes } = await new ContentLoader().core();
  const bundle = new Bundle(units, nodes, { sentences: [], chapters: [], scenes: [], writing: [], scripts: [] });
  // a learner who has met everything: the names must work wherever the learner is
  entries = grammarEntries(bundle, new Set(bundle.course.nodes.keys()));
}, 120_000);

const hits = (q: string) => searchEntries(entries, q).filter((e) => e.id.startsWith('g:'));

describe('grammar by its standard name', () => {
  const battery: Array<[string, RegExp]> = [
    ['preterite', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ['preterit', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ['pretérito', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ['imperfect', /^g:(imperfect-|pret-vs-imperfect|narrative-pasts)/],
    ['conditional', /^g:conditional/],
    ['pluperfect', /^g:pluperfect/],
    ['past perfect', /^g:pluperfect/],
    ['future perfect', /^g:future-perfect/],
    ['present perfect', /^g:perfecto-/],
    ['subjunctive', /^g:(subj-|.*-subj$|se-form|ojala|que-wishes|reporting-verbs-mood|mood-choice|wish-exclam|future-subj)/],
    ['subjuntivo', /^g:(subj-|.*-subj$|se-form|ojala|que-wishes|reporting-verbs-mood|mood-choice|wish-exclam|future-subj)/],
    ['imperfect subjunctive', /^g:(imperfect-subj|se-form-recognition)/],
    ['gerund', /^g:(estar-gerund|gerund-ways|participle-gerund)/],
    ['participle', /^g:(estar-participle|participle-gerund|perfecto-|pluperfect|absolute)/],
    ['imperative', /^g:(commands|negative-commands)/],
    ['passive', /^g:passive-/],
    ['reflexive', /^g:reflexive/],
    ['relative clause', /^g:(relative|relatives|cuyo|subj-relative|subj-free-relatives)/],
    ['reported speech', /^g:(reported|reporting)/],
    ['ser vs estar', /^g:(ser-estar|estar-|ser-)/],
    ['difference between ser and estar', /^g:(ser-estar|estar-|ser-)/],
    ['preterito', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ['por vs para', /^g:por-para/],
  ];
  for (const [q, family] of battery) {
    it(`"${q}" finds its lessons, and the first one is the right sort`, () => {
      const found = hits(q);
      expect(found.length, q).toBeGreaterThan(0);
      expect(found[0].id, q).toMatch(family);
      // the lessons of the family come before any stray match (a word of the query somewhere in a title)
      const firstStray = found.findIndex((e) => !family.test(e.id));
      if (firstStray >= 0) for (const e of found.slice(firstStray)) expect(e.id, `${q}: ${e.id} after a stray`).not.toMatch(family);
    });
  }
  it('a name still matches when the learner types capitals or accents', () => {
    expect(hits('Pretérito')[0]?.id).toMatch(/^g:preterite-/);
    expect(hits('PRETERITE')[0]?.id).toMatch(/^g:preterite-/);
  });
  it('the plain-English way in still works', () => {
    expect(hits('used to').length).toBeGreaterThan(0);
    expect(hits('would').length).toBeGreaterThan(0);
  });
});

describe('verbs in the -se forms', () => {
  it('fuese is ser, ir and irse, imperfect subjunctive, as fuera is', () => {
    const m = findVerbs('fuese');
    expect(m.map((v) => v.verb.inf).sort()).toEqual(findVerbs('fuera').map((v) => v.verb.inf).sort());
    expect(m.map((v) => v.verb.inf)).toEqual(expect.arrayContaining(['ir', 'ser']));
    for (const v of m) expect(v.hits.every((h) => h.tense === 'impsubj' && h.se)).toBe(true);
  });
  it('hubiese is haber, and dijese, cantase and tuviese are found', () => {
    expect(findVerbs('hubiese')[0]?.verb.inf).toBe('haber');
    expect(findVerbs('dijese')[0]?.verb.inf).toBe('decir');
    expect(findVerbs('cantase')[0]?.verb.inf).toBe('cantar');
    expect(findVerbs('tuviese')[0]?.verb.inf).toBe('tener');
  });
  it('the -ra form is not marked as the -se form', () => {
    const m = findVerbs('cupiera')[0];
    expect(m.hits.some((h) => h.tense === 'impsubj' && !h.se)).toBe(true);
  });
});

describe('what the tense list says about the subjunctive', () => {
  it('uses the grammar names and no gloss that is only half the use', () => {
    for (const [k, name] of Object.entries(TENSE_PLAIN)) expect(tenseName(k), k).toBe(name);
    expect(TENSE_PLAIN.impsubj).not.toMatch(/if only/);
    expect(TENSE_PLAIN.perfsubj).not.toMatch(/hoping/);
    expect(TENSE_PLAIN.impsubj).toMatch(/^Imperfect subjunctive/);
    expect(TENSE_PLAIN.perfsubj).toMatch(/^Perfect subjunctive/);
  });
});
