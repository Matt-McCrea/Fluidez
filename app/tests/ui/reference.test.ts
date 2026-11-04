import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findVerb, findVerbs } from '../../src/ui/screens/reference/verbs';
import { TOPICS, topicOf } from '../../src/ui/screens/reference/topics';
import { scoreEntry, searchEntries } from '../../src/ui/screens/reference/search';
import { taughtTenses, tensesOfNode } from '../../src/ui/screens/reference/tenses';
import { strengthOf } from '../../src/ui/screens/reference/model';

const grammar: Array<{ id: string; title: string; pcic?: string[] }> =
  JSON.parse(readFileSync(join(__dirname, '../../content/graph/grammar.json'), 'utf8'));

describe('findVerb', () => {
  it('finds poder from pudimos and marks the cell', () => {
    const m = findVerb('pudimos');
    expect(m?.verb.inf).toBe('poder');
    expect(m?.hits.some((h) => h.tense === 'preterito' && h.person === 'nosotros')).toBe(true);
  });
  it('finds an infinitive and tolerates junk', () => {
    expect(findVerb('hablar')?.verb.inf).toBe('hablar');
    expect(() => findVerbs('zzzzqq xx')).not.toThrow();
    expect(findVerbs('')).toEqual([]);
  });
});

describe('topicOf', () => {
  const cases: Record<string, string> = {
    'g:present-ar': 'now',
    'g:preterite-ar': 'past',
    'g:imperfect-habitual': 'used',
    'g:ir-a-plans': 'future',
    'g:conditional': 'wishes',
    'g:subj-wishes': 'wishes',
    'g:adjective-agreement': 'describing',
    'g:direct-objects': 'pronouns',
    'g:questions': 'questions',
    'g:cause-result': 'connecting',
    'g:softening': 'polite',
    'g:sounds-letters': 'other',
  };
  for (const [id, topic] of Object.entries(cases)) {
    it(`${id} is ${topic}`, () => {
      const n = grammar.find((g) => g.id === id)!;
      expect(topicOf(n)).toBe(topic);
    });
  }
  it('never throws and always returns a known topic', () => {
    for (const g of grammar) expect(TOPICS.some((t) => t.id === topicOf(g))).toBe(true);
    expect(topicOf({ id: '' })).toBe('other');
    expect(topicOf({ id: 'weird' } as never)).toBe('other');
  });
  it('keeps most grammar out of Other', () => {
    const other = grammar.filter((g) => topicOf(g) === 'other').length;
    expect(other).toBeLessThan(grammar.length * 0.15);
  });
});

describe('search', () => {
  const items = [
    { n: 'a', es: ['la casa grande'], en: ['big house'] },
    { n: 'b', es: ['casa'], en: ['house'] },
    { n: 'c', es: ['casarse'], en: ['to get married'] },
    { n: 'd', es: ['la mesa'], en: ['table', 'casa de mesa'] },
  ];
  it('ranks the exact Spanish match first', () => {
    expect(searchEntries(items, 'casa')[0].n).toBe('b');
  });
  it('matches English and ignores accents', () => {
    expect(searchEntries(items, 'married').map((i) => i.n)).toEqual(['c']);
    expect(scoreEntry('cafe', { es: ['café'], en: ['coffee'] })).toBeGreaterThan(0);
  });
  it('a whole phrase beats a raw prefix: "me gusta" puts "I like" above "I\'d like"', () => {
    const polite = { n: 'polite', es: ['Me gustaría un café.'], en: ["I'd like… (polite)"] };
    const like = { n: 'like', es: ['Me gusta el café.'], en: ["I like, I don't like"] };
    expect(searchEntries([polite, like], 'me gusta').map((i) => i.n)).toEqual(['like', 'polite']);
    expect(scoreEntry('me gusta', like)).toBeGreaterThan(scoreEntry('me gusta', polite));
    expect(scoreEntry('me gusta', polite)).toBeGreaterThan(0);
  });
  it('keeps order for an empty query', () => {
    expect(searchEntries(items, '').length).toBe(4);
  });
});

describe('taught tenses', () => {
  it('a learner with only present grammar has met only the present', () => {
    expect(taughtTenses(['g:present-ar', 'g:present-er-ir', 'g:questions', 'l:casa'])).toEqual(['presente']);
  });
  it('maps real ids', () => {
    expect(tensesOfNode({ id: 'g:preterite-ser-ir-hacer' })).toEqual(['preterito']);
    expect(taughtTenses(['g:imperfect-habitual', 'g:conditional'])).toEqual(['imperfecto', 'condicional']);
  });
  it('every grammar id maps to at most known tenses', () => {
    for (const g of grammar) expect(() => tensesOfNode(g)).not.toThrow();
  });
});

describe('strength bands', () => {
  it('bands retrievability', () => {
    expect(strengthOf(0.95)).toBe('solid');
    expect(strengthOf(0.8)).toBe('fading');
    expect(strengthOf(0.4)).toBe('shaky');
    expect(strengthOf(undefined)).toBe('new');
  });
});

describe('reference script loading', () => {
  it('opens a script outside the window through bundle.scriptFor', async () => {
    const { ContentLoader } = await import('../../src/ui/data/loader');
    const b = await new ContentLoader().load({ unit: 0 });
    const id = 'g:comparatives';
    expect(b.scripts.get(id)).toBeUndefined();
    expect((await b.scriptFor(id))?.node).toBe(id);
    expect(b.scripts.get(id)).toBeTruthy();
  }, 120_000);
});

describe('look up: titles, words coming up, grammar examples', () => {
  it('a title match outranks a match only in a form', () => {
    const byTitle = { n: 'title', title: 'The past', es: ['hablé'], en: [] as string[] };
    const byForm = { n: 'form', title: 'Other', es: ['la pasta del pasado'], en: ['the past is gone'] };
    expect(searchEntries([byForm, byTitle], 'the past').map((e) => e.n)[0]).toBe('title');
    expect(scoreEntry('past', byTitle)).toBeGreaterThan(scoreEntry('past', byForm));
  });
  it('a short bare substring is a weak match', () => {
    expect(scoreEntry('casa', { es: ['pasado'], en: ['xcasax'] })).toBeLessThanOrEqual(20);
  });

  it('finds casa under words (met or coming up) and gives grammar examples', async () => {
    const { ContentLoader } = await import('../../src/ui/data/loader');
    const { Learner, MemoryStore } = await import('../../src/learner');
    const { exampleSentences, unmetWordEntries, wordEntries } = await import('../../src/ui/screens/reference/model');
    const bundle = await new ContentLoader().load({ band: 'A1' });
    const learner = await Learner.open(new MemoryStore(), { now: () => Date.now() });
    const met = new Set<string>(learner.nodes());
    const all = [...wordEntries(bundle, learner, []), ...unmetWordEntries(bundle, met)];
    expect(searchEntries(all, 'casa').some((w) => w.id === 'l:casa')).toBe(true);
    const id = 'g:ser-identity';
    const ex = exampleSentences(bundle, learner, id);
    expect(ex.length).toBeLessThanOrEqual(3);
    for (const s of ex) {
      const ref = bundle.index.sentences.get(s)!;
      expect([...ref.targets, ...ref.requires]).toContain(id);
    }
  }, 120_000);
});

describe('units in the reference', () => {
  const day = (o: Partial<{ focus: string[]; chunks: string[]; lexemes: string[]; chapter: string }>) => ({ type: 'introduce', focus: [], chunks: [], lexemes: [], ...o });
  const nodes: Record<string, { es?: string; en?: string }> = {
    'l:madre': { es: 'la madre', en: 'mother' }, 'l:comida': { es: 'la comida', en: 'food' }, 'l:tren': { es: 'el tren', en: 'train' },
    'g:ser': {}, 'c:hola': { es: 'Hola', en: 'Hello' },
  };
  const bundle = {
    units: [
      { id: 'u01', band: 'A1', title: 'People in my life', theme: 'Personal identification: family, friends', canDo: 'I can introduce my family.', days: [day({ focus: ['g:ser'], lexemes: ['l:madre'], chunks: ['c:hola'], chapter: 'ch001' })] },
      { id: 'u02', band: 'A1', title: 'What we eat', theme: 'Food and drink: meals and restaurants', canDo: 'I can order a meal.', days: [day({ lexemes: ['l:comida'] })] },
      { id: 'u03', band: 'A1', title: 'Going places', theme: 'Travel: transport', canDo: 'I can ask for a ticket.', days: [day({ lexemes: ['l:tren'] })] },
    ],
    story: [{ id: 'ch001', title: 'Mi familia' }],
    title: (id: string) => (id === 'g:ser' ? 'Ser for identity' : id),
    node: (id: string) => nodes[id],
  } as never;

  it('reaches the units the path has got to, whatever placement met elsewhere', async () => {
    const { unitEntries } = await import('../../src/ui/screens/reference/model');
    const u = unitEntries(bundle, new Set(['l:comida', 'l:tren']), undefined, 1);
    expect(u.map((x) => x.reached)).toEqual([true, true, false]);
    expect(u[1].words).toEqual(['l:comida']);
    expect(u[0].words).toEqual([]);
    expect(unitEntries(bundle, new Set(), undefined, -1).some((x) => x.reached)).toBe(false);
  });

  it('finds units by theme word, canDo, title and the words they teach', async () => {
    const { unitEntries, searchUnits } = await import('../../src/ui/screens/reference/model');
    const all = unitEntries(bundle, new Set(['g:ser', 'l:madre', 'c:hola', 'l:comida', 'l:tren']), undefined, 2);
    const ids = (q: string) => searchUnits(all, q).reached.map((x) => x.id);
    expect(ids('family')).toEqual(['u01']);
    expect(ids('food')).toEqual(['u02']);
    expect(ids('travel')).toEqual(['u03']);
    expect(ids('order a meal')).toEqual(['u02']);
    expect(ids('madre')).toEqual(['u01']);
    expect(ids('identity')).toEqual(['u01']);
    expect(ids('')).toHaveLength(3);
    const chapters = unitEntries(bundle, new Set(['g:ser']), () => true, 0)[0].chapters;
    expect(chapters).toEqual([{ id: 'ch001', title: 'Mi familia' }]);
  });

  it('keeps unreached units to their title and theme', async () => {
    const { unitEntries, searchUnits } = await import('../../src/ui/screens/reference/model');
    const all = unitEntries(bundle, new Set(['l:madre']), undefined, 0);
    expect(searchUnits(all, 'travel').coming.map((x) => x.id)).toEqual(['u03']);
    expect(searchUnits(all, 'tren').coming).toEqual([]);
  });

  it('gives grammar a strength from the learner', async () => {
    const { grammarEntries } = await import('../../src/ui/screens/reference/model');
    const b = { course: { nodes: new Map([['g:ser', { id: 'g:ser', kind: 'grammar', priority: 1 }]]), teachPos: new Map(), unitStart: [] }, title: () => 'Ser' } as never;
    const learner = { retrievability: (_: string, d: string) => (d === 'productive' ? 0.8 : 0.99) };
    expect(grammarEntries(b, new Set(['g:ser']), learner)[0].strength).toBe('fading');
    expect(grammarEntries(b, new Set(), learner)[0].strength).toBe('new');
  });
});
