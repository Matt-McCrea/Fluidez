import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  findVerb, findVerbs, TOPICS, topicOf, scoreEntry, searchEntries, norm, taughtTenses, tensesOfNode, strengthOf,
  grammarEntries, groupByTopic, wordEntries, themeWords, standardNames, TENSE_PLAIN, tenseName, tenseShort, shownPersons,
  cellsFor, seCellsFor, type LessonLike, type GrammarEntry,
} from '../../lib/search';
import { VERBS, verbByInf } from '../../lib/engine';

const GRAMMAR = new URL('../../app/content/graph/grammar.json', import.meta.url);
const grammar: LessonLike[] = existsSync(GRAMMAR) ? JSON.parse(readFileSync(GRAMMAR, 'utf8')) : [];
const real = describe.skipIf(!grammar.length);

describe('findVerb', () => {
  it('finds poder from pudimos and marks the cell', () => {
    const m = findVerb('pudimos');
    expect(m?.verb.inf).toBe('poder');
    expect(m?.hits.some((h) => h.tense === 'preterito' && h.person === 'nosotros')).toBe(true);
  });
  it('finds an infinitive, an unaccented one, and a start', () => {
    expect(findVerb('hablar')?.verb.inf).toBe('hablar');
    expect(findVerb('Hablar ')?.verb.inf).toBe('hablar');
    expect(findVerbs('habl', 5).every((m) => m.via === 'start' || m.via === 'form')).toBe(true);
  });
  it('tolerates junk', () => {
    expect(() => findVerbs('zzzzqq xx')).not.toThrow();
    expect(findVerbs('')).toEqual([]);
    expect(findVerbs('a')).toEqual([]);
  });
  it('searches only the verbs it is given', () => {
    const only = [verbByInf('hablar')!, verbByInf('comer')!];
    expect(findVerb('pudimos', only)).toBeNull();
    expect(findVerb('hablamos', only)?.verb.inf).toBe('hablar');
    expect(findVerbs('c', 12, only)).toEqual([]);
    expect(findVerbs('co', 12, only).map((m) => m.verb.inf)).toEqual(['comer']);
    expect(findVerbs('hablar', 12, VERBS).length).toBeGreaterThan(0);
  });
  it('limits the results', () => {
    expect(findVerbs('ha', 3).length).toBeLessThanOrEqual(3);
  });
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
    expect(findVerbs('cupiera')[0].hits.some((h) => h.tense === 'impsubj' && !h.se)).toBe(true);
  });
});

describe('verb tables', () => {
  it('shows no vosotros and labels the third person', () => {
    const ps = shownPersons('presente');
    expect(ps.map((p) => p.key)).not.toContain('vosotros');
    expect(ps.find((p) => p.key === 'ellos')?.label).toBe('ellos / ellas / ustedes');
  });
  it('cells and their -se partners', () => {
    expect(cellsFor('hablar', 'presente')[0]).toBe('hablo');
    expect(cellsFor('nope', 'presente')).toEqual([]);
    expect(seCellsFor('hablar', 'impsubj')[0]).toBe('hablase');
    expect(seCellsFor('hablar', 'presente')).toEqual([]);
  });
  it('standard tense names', () => {
    expect(tenseName('preterito')).toBe('Preterite (the finished past)');
    expect(tenseShort('preterito')).toBe('Preterite');
    for (const [k, name] of Object.entries(TENSE_PLAIN)) expect(tenseName(k), k).toBe(name);
    expect(TENSE_PLAIN.impsubj).toMatch(/^Imperfect subjunctive/);
    expect(TENSE_PLAIN.perfsubj).toMatch(/^Perfect subjunctive/);
  });
});

describe('topicOf', () => {
  const cases: Record<string, string> = {
    'g:present-ar': 'now', 'g:preterite-ar': 'past', 'g:imperfect-habitual': 'used', 'g:ir-a-plans': 'future',
    'g:conditional': 'wishes', 'g:subj-wishes': 'wishes', 'g:adjective-agreement': 'describing', 'g:direct-objects': 'pronouns',
    'g:questions': 'questions', 'g:cause-result': 'connecting', 'g:softening': 'polite', 'g:sounds-letters': 'other',
  };
  for (const [id, topic] of Object.entries(cases)) it(`${id} is ${topic}`, () => expect(topicOf({ id })).toBe(topic));
  it('has eleven buckets', () => expect(TOPICS.length).toBe(11));
  it('a topic tag wins over the id', () => expect(topicOf({ id: 'g:present-ar', tags: ['topic:polite'] })).toBe('polite'));
  it('keywords and pcic are the last resorts', () => {
    expect(topicOf({ id: 'g:zzz', en: 'Saying what you used to do' })).toBe('used');
    expect(topicOf({ id: 'g:zzz', pcic: ['gramatica:9.1.4.1'] })).toBe('future');
  });
  it('never throws and always returns a known topic', () => {
    expect(topicOf({ id: '' })).toBe('other');
    expect(topicOf({ id: 'weird' } as never)).toBe('other');
    expect(topicOf(null as never)).toBe('other');
  });
  real('on the real lessons', () => {
    it('always returns a known topic and keeps most grammar out of Other', () => {
      for (const g of grammar) expect(TOPICS.some((t) => t.id === topicOf(g))).toBe(true);
      expect(grammar.filter((g) => topicOf(g) === 'other').length).toBeLessThan(grammar.length * 0.15);
    });
  });
});

describe('search', () => {
  const items = [
    { n: 'a', es: ['la casa grande'], en: ['big house'] },
    { n: 'b', es: ['casa'], en: ['house'] },
    { n: 'c', es: ['casarse'], en: ['to get married'] },
    { n: 'd', es: ['la mesa'], en: ['table', 'casa de mesa'] },
  ];
  it('norm strips accents, case, punctuation', () => expect(norm('  ¿Qué   TAL?')).toBe('que tal'));
  it('ranks the exact Spanish match first', () => expect(searchEntries(items, 'casa')[0].n).toBe('b'));
  it('matches English and ignores accents', () => {
    expect(searchEntries(items, 'married').map((i) => i.n)).toEqual(['c']);
    expect(scoreEntry('cafe', { es: ['café'], en: ['coffee'] })).toBeGreaterThan(0);
  });
  it('a whole phrase beats a raw prefix: "me gusta" puts "I like" above "I\'d like"', () => {
    const polite = { n: 'polite', es: ['Me gustaría un café.'], en: ["I'd like… (polite)"] };
    const like = { n: 'like', es: ['Me gusta el café.'], en: ["I like, I don't like"] };
    expect(searchEntries([polite, like], 'me gusta').map((i) => i.n)).toEqual(['like', 'polite']);
    expect(scoreEntry('me gusta', polite)).toBeGreaterThan(0);
  });
  it('keeps order for an empty query', () => expect(searchEntries(items, '').map((i) => i.n)).toEqual(['a', 'b', 'c', 'd']));
  it('a title match outranks a match only in a form', () => {
    const byTitle = { n: 'title', title: 'The past', es: ['hablé'], en: [] as string[] };
    const byForm = { n: 'form', title: 'Other', es: ['la pasta del pasado'], en: ['the past is gone'] };
    expect(searchEntries([byForm, byTitle], 'the past').map((e) => e.n)[0]).toBe('title');
  });
  it('a short bare substring is a weak match', () => {
    expect(scoreEntry('casa', { es: ['pasado'], en: ['xcasax'] })).toBeLessThanOrEqual(20);
  });
  it('alternatives in one field are scored separately, and a names match sits below the title', () => {
    expect(scoreEntry('los dias', { es: ['el día / los días'], en: [] })).toBeGreaterThanOrEqual(100);
    expect(scoreEntry('preterite', { title: 'preterite', es: [], en: [] })).toBeGreaterThan(scoreEntry('preterite', { names: ['preterite'], es: [], en: [] }));
  });
  it('all words anywhere is a weak match', () => {
    expect(scoreEntry('big grande', { es: ['la casa grande'], en: ['big house'] })).toBe(15);
  });
  it('no match is 0', () => expect(scoreEntry('zzz', items[0])).toBe(0));
});

describe('taught tenses and strength', () => {
  it('a learner with only present grammar has met only the present', () => {
    expect(taughtTenses(['g:present-ar', 'g:present-er-ir', 'g:questions', 'l:casa'])).toEqual(['presente']);
  });
  it('maps real ids', () => {
    expect(tensesOfNode({ id: 'g:preterite-ser-ir-hacer' })).toEqual(['preterito']);
    expect(taughtTenses(['g:imperfect-habitual', 'g:conditional'])).toEqual(['imperfecto', 'condicional']);
  });
  it('bands retrievability', () => {
    expect(strengthOf(0.95)).toBe('solid');
    expect(strengthOf(0.8)).toBe('fading');
    expect(strengthOf(0.4)).toBe('shaky');
    expect(strengthOf(undefined)).toBe('new');
  });
});

describe('entries', () => {
  const lessons: LessonLike[] = [
    { id: 'g:preterite-ar', title: 'Saying what you did', priority: 2, en: 'I spoke', es: 'Hablé' },
    { id: 'g:present-ar', title: 'Saying what you do', priority: 1, forms: [{ es: 'hablo', en: 'I speak' }] },
    { id: 'g:sounds-letters', title: 'Sounds', priority: 1 },
  ];
  it('builds, sorts by priority then id, and finds by standard name', () => {
    const es = grammarEntries(lessons, { met: new Set(['g:preterite-ar']), retrievability: () => 0.8 });
    expect(es.map((e) => e.id)).toEqual(['g:present-ar', 'g:sounds-letters', 'g:preterite-ar']);
    expect(es.find((e) => e.id === 'g:preterite-ar')).toMatchObject({ topic: 'past', met: true, strength: 'fading' });
    expect(es.find((e) => e.id === 'g:present-ar')).toMatchObject({ met: false, strength: 'new' });
    expect(searchEntries(es, 'preterite')[0].id).toBe('g:preterite-ar');
    expect(searchEntries(es, 'I speak')[0].id).toBe('g:present-ar');
  });
  it('groups by topic in bucket order, dropping empty ones', () => {
    const g = groupByTopic(grammarEntries(lessons));
    expect(g.map((x) => x.topic)).toEqual(['now', 'past', 'other']);
  });
  it('standard names come from the tenses and kinds of a lesson', () => {
    expect(standardNames({ id: 'g:preterite-ar' })).toContain('indefinido');
    expect(standardNames({ id: 'g:ser-estar-basics' })).toContain('ser vs estar');
    expect(standardNames({ id: 'l:casa' })).toEqual([]);
  });
  it('word entries: frequency order, strength, saved words', () => {
    const vocab = [
      { id: 'l:casa', es: 'la casa', en: 'house', freqRank: 2, pos: 'noun', gender: 'f' },
      { id: 'l:ser', es: 'ser', en: 'to be', freqRank: 1 },
      { id: 'l:perro', es: 'el perro', en: 'dog', freqRank: 3 },
    ];
    const w = wordEntries(vocab, { met: new Set(['l:casa', 'l:ser']), retrievability: (id) => (id === 'l:casa' ? 0.95 : 0.5), saved: [{ es: 'casa', en: 'house' }, { es: 'ojalá', en: 'hopefully' }] });
    expect(w.map((x) => x.word)).toEqual(['ser', 'la casa', 'el perro', 'ojalá']);
    expect(w[1]).toMatchObject({ strength: 'solid', saved: true, met: true });
    expect(w[2]).toMatchObject({ met: false, strength: 'new' });
    expect(w[3]).toMatchObject({ saved: true });
    expect(searchEntries(w, 'casa')[0].word).toBe('la casa');
  });
  it('themeWords', () => {
    expect(themeWords('Personal identification: family, friends')).toEqual(['family', 'friends', 'Personal identification']);
  });
});

real('grammar by its standard name (real lessons)', () => {
  const entries: GrammarEntry[] = grammarEntries(grammar.filter((g) => g.id.startsWith('g:')));
  const hits = (q: string) => searchEntries(entries, q);
  const battery: Array<[string, RegExp]> = [
    ['preterite', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ['pretérito', /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ['imperfect', /^g:(imperfect-|pret-vs-imperfect|narrative-pasts)/],
    ['conditional', /^g:conditional/],
    ['pluperfect', /^g:pluperfect/],
    ['present perfect', /^g:perfecto-/],
    ['gerund', /^g:(estar-gerund|gerund-ways|participle-gerund)/],
    ['imperative', /^g:(commands|negative-commands)/],
    ['passive', /^g:passive-/],
    ['reflexive', /^g:reflexive/],
    ['reported speech', /^g:(reported|reporting)/],
    ['por vs para', /^g:por-para/],
  ];
  for (const [q, family] of battery) {
    it(`"${q}" finds its lessons, and the first one is the right sort`, () => {
      const found = hits(q);
      expect(found.length, q).toBeGreaterThan(0);
      expect(found[0].id, q).toMatch(family);
    });
  }
  it('capitals and accents', () => {
    expect(hits('Pretérito')[0]?.id).toMatch(/^g:preterite-/);
    expect(hits('PRETERITE')[0]?.id).toMatch(/^g:preterite-/);
  });
});
