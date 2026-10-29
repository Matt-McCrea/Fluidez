// Honest feedback: "Almost" only when it is true, the hint kept on reveal,
// reasons that explain the form, and hints for single-word cards.
import { describe, expect, test } from 'vitest';
import { checkExact } from '../../src/check';
import { wordHint } from '../../src/check/wordhint';
import { matchTranslation } from '../../src/check/translate';
import { revealLines, retryLead } from '../../src/ui/components/card';
import { chunkCheck, gapWhy, lexemeWhy, verbFormWhy } from '../../src/ui/session/cards';

describe('retryLead', () => {
  test('an accent slip is Almost', () => {
    expect(retryLead({ near: true, hint: 'Check the accents.' })).toBe('Almost.');
  });
  test('a diagnosis naming one located slip is Almost', () => {
    const r = matchTranslation('Yo como el pan', { es: 'Yo como la manzana', en: 'I eat the apple' });
    expect(r.pass).toBe(false);
    const art = matchTranslation('Yo como el manzana', { es: 'Yo como la manzana', en: 'I eat the apple' });
    expect(art.hintKind).toBe('article');
    expect(retryLead(art)).toBe('Almost.');
    expect(retryLead({ hint: 'Check the verb ending.', hintKind: 'verb-ending' })).toBe('Almost.');
    expect(retryLead({ hint: 'A small word is missing.', hintKind: 'missing-word' })).toBe('Almost.');
  });
  test('anything else is Not yet', () => {
    expect(retryLead({})).toBe('Not yet.');
    expect(retryLead({ hint: 'A word is missing.', hintKind: 'missing-word' })).toBe('Not yet.');
    expect(retryLead({ hint: 'Right words, different order: check where each one goes.', hintKind: 'word-order' })).toBe('Not yet.');
    expect(retryLead({ hint: "That's a different word.", hintKind: 'other-word' })).toBe('Not yet.');
  });
});

describe('reveal lines', () => {
  test('hint first, then the reason', () => {
    expect(revealLines('Check the verb ending.', 'comí is the yo form of comer in the past.')).toEqual([
      'Check the verb ending.', 'comí is the yo form of comer in the past.',
    ]);
  });
  test('no hint: the reason alone; identical collapses', () => {
    expect(revealLines(undefined, 'why')).toEqual(['why']);
    expect(revealLines('  same ', 'same')).toEqual(['same']);
    expect(revealLines('hint', '')).toEqual(['hint']);
  });
});

describe('reasons explain the form', () => {
  test('a verb gap names person, verb and tense', () => {
    expect(verbFormWhy({ cue: '(comer, tú)', answer: 'comes' })).toBe('comes is the tú form of comer in the present.');
    expect(verbFormWhy({ cue: '(comer)', answer: 'comí' })).toBe('comí is the yo form of comer in the past.');
    expect(verbFormWhy({ cue: '(hablar)', answer: 'hablábamos' })).toBe('hablábamos is the we form of hablar for what "used to" happen.');
  });
  test('without a verb cue it falls back to the English line', () => {
    expect(verbFormWhy({ cue: '(the table)', answer: 'mesa' })).toBeUndefined();
    expect(gapWhy({ cue: '(table)', answer: 'mesa', en: 'the table' }, 'fallback')).toBe('fallback');
  });
  test('a lexeme gap adds gender', () => {
    const item = { cue: '(table)', answer: 'mesa', en: 'The table is big.' };
    expect(lexemeWhy({ es: 'la mesa', en: 'the table' }, item)).toBe('"the table" is la mesa. Mesa is feminine.');
    expect(lexemeWhy({ es: 'el libro', en: 'the book' }, item)).toBe('"the book" is el libro. Libro is masculine.');
    expect(lexemeWhy({ es: 'inglés', en: 'English' }, item)).toBe('"English" is inglés.');
  });
  test('no why uses restating, banned words or dashes', () => {
    for (const w of [verbFormWhy({ cue: '(comer, tú)', answer: 'comes' })!, lexemeWhy({ es: 'la mesa', en: 'the table' }, { cue: '(table)', answer: 'mesa', en: '' })]) {
      expect(w).not.toMatch(/conjugat|preterite|imperfect|subjunctive|agreement|[—–]/i);
    }
  });
});

describe('single-word hints', () => {
  const ans = ['comemos'];
  test('right verb, wrong person', () => expect(wordHint('comen', ans)?.hint).toBe('Right verb, but who is doing it?'));
  test('right verb, wrong tense', () => expect(wordHint('comimos', ans)?.hint).toBe('Right verb, but when does it happen?'));
  test('spelling', () => expect(wordHint('comenos', ans)?.hint).toBe('Check the spelling.'));
  test('a different word', () => expect(wordHint('silla', ['mesa'], 'the table')?.hint).toBe(`That's a different word. The gap wants "the table".`));
  test('nothing specific: no hint', () => {
    expect(wordHint('', ['mesa'], 'the table')).toBeUndefined();
    expect(wordHint('silla', ['mesa'])).toBeUndefined();
  });
  test('chunkCheck uses them but leaves the accent hint alone', () => {
    const c = chunkCheck(['comemos']);
    expect(c('comen').hint).toBe('Right verb, but who is doing it?');
    expect(retryLead(c('comen'))).toBe('Almost.');
    expect(c('comémos')).toMatchObject({ pass: true, near: true });
    expect(c('zzzz').hint).toBeUndefined();
    expect(checkExact('comemos', ['comemos']).pass).toBe(true);
  });
});
