// A cognate skips the rungs a learner does not need; B1 and up meet a new word with a typed test.
import { describe, expect, it } from 'vitest';
import { isCognate } from '../../src/compiler/cognate';
import { firstContactFormat, learnFormat } from '../../src/ui/session/cards';
import { Learner, Rating } from '../../src/learner';

describe('isCognate', () => {
  it('reads a Spanish word that looks like its English gloss', () => {
    for (const [es, en] of [['la idea', 'idea'], ['el hotel', 'hotel'], ['la información', 'information'], ['importante', 'important'], ['la universidad', 'university']]) {
      expect(isCognate(es, en), es).toBe(true);
    }
  });
  it('does not take an opaque word, a short one or a missing gloss', () => {
    for (const [es, en] of [['la casa', 'house'], ['el perro', 'dog'], ['comer', 'to eat'], ['la mesa', 'table'], ['el sol', 'sun'], ['la idea', '']]) {
      expect(isCognate(es, en), es).toBe(false);
    }
  });
});

describe('first contact', () => {
  it('is typed from B1 on, for a word the learner will produce', () => {
    expect(firstContactFormat({ band: 'B1', kind: 'lexeme', productive: true, cognate: false }, 0)).toBe('type');
    expect(firstContactFormat({ band: 'C1', kind: 'chunk', productive: true, cognate: false }, 0)).toBe('type');
    expect(firstContactFormat({ band: 'B1', kind: 'lexeme', productive: true, cognate: false }, 1)).toBeUndefined();
    expect(firstContactFormat({ band: 'B2', kind: 'lexeme', productive: false, cognate: false }, 0)).toBeUndefined();
    expect(firstContactFormat({ band: 'A2', kind: 'lexeme', productive: true, cognate: false }, 0)).toBeUndefined();
    expect(firstContactFormat({ band: 'B1', kind: 'pattern', productive: true, cognate: false }, 0)).toBeUndefined();
  });
  it('is typed at any band for a cognate, which skips the pick-the-meaning rung', () => {
    expect(firstContactFormat({ band: 'A1', kind: 'lexeme', productive: true, cognate: true }, 0)).toBe('type');
    expect(learnFormat(0, true)).toBe('recognise');
  });
});

describe('cognate introduction', () => {
  it('is done after two right answers; any other word still needs three', () => {
    const L = Learner.fresh({ now: () => 1_800_000_000_000 });
    L.introduce('l:idea', { cognate: true });
    L.learningStep('l:idea', true);
    expect(L.learningStep('l:idea', true).done).toBe(true);
    expect(L.completeIntroduction('l:idea').grade).toBe(Rating.Good);
    L.introduce('l:casa');
    L.learningStep('l:casa', true);
    expect(L.learningStep('l:casa', true).done).toBe(false);
  });
});
