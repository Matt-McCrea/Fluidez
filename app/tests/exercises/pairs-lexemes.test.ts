// A lexeme reaches every card as one pair, and the Spanish of it is the word. "el/la turista" is one word with either
// article: split on its slash it was the pair ("el", "tourist"), so 59 of the course's words were asked as a bare
// article ("What does this mean? el") and offered as one among whole words, where tapping the odd one out passed.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { GraphNode } from '../../src/content/schema';
import { alignedPairs } from '../../src/exercises/pairs';

const lexemes = JSON.parse(readFileSync(join(__dirname, '../../content/graph/lexemes.json'), 'utf8')) as GraphNode[];
const ARTICLE = /^(el|la|los|las|un|una)$/i;

describe('a word that takes either article', () => {
  test('is the word with its first article, and the other is accepted', () => {
    expect(alignedPairs({ kind: 'lexeme', es: 'el/la turista', en: 'tourist' })).toEqual([{ es: 'el turista', en: 'tourist', accept: ['la turista'] }]);
    expect(alignedPairs({ kind: 'lexeme', es: 'la/el modelo', en: 'model' })).toEqual([{ es: 'la modelo', en: 'model', accept: ['el modelo'] }]);
  });

  test('every one in the course, and an article on its own is only ever the article', () => {
    const two = lexemes.filter((n) => /^(el|la)\/(el|la)\s/i.test(n.es ?? ''));
    expect(two.length).toBeGreaterThan(50);
    for (const n of lexemes) {
      const [p] = alignedPairs(n);
      if (!p) continue;
      if (ARTICLE.test(p.es)) expect(n.es, n.id).toBe(p.es);
      if (two.includes(n)) expect(p.es.split(' ').length, n.id).toBeGreaterThan(1);
    }
  });

  test('the gloss stays a gloss, and nothing else is split differently', () => {
    expect(alignedPairs({ kind: 'lexeme', es: 'el/la paisa', en: 'person from Antioquia; Antioquian' })[0].en).toBe('person from Antioquia; Antioquian');
    expect(alignedPairs({ kind: 'lexeme', es: 'hablar / charlar', en: 'to talk' })).toEqual([{ es: 'hablar', en: 'to talk', accept: ['charlar'] }]);
  });
});
