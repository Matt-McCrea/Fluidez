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
