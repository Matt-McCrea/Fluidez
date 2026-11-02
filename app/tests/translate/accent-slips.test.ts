// R15: an accent slip stays right, with a note that says which word, unless the
// accent changes the word (hablo against habló, si against sí, tu against tú, el
// against él, esta against está, mas against más). Sentence cards used to be
// strict, so café typed as cafe was marked wrong; and the lenient option passed a
// slip whatever it did to the word, so hablo went through for habló.
import { describe, expect, test } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { accentSlips, changesWord } from '../../src/check/translate/accents';
import { BankSentence } from '../../src/content/schema';
import type { PracticeItem } from '../../src/compiler';
import { practiceCard, sentenceCheck } from '../../src/ui/session/cards';
import { fixtureBundle } from '../ui/driver';

const S = (es: string, en: string, accept: string[] = []) => BankSentence.parse({ id: 't', es, en, accept });
const lenient = { accents: 'lenient' } as const;

describe('a slip that does not change the word stays right, and the note says where', () => {
  test.each<[es: string, en: string, typed: string, word: string, wrote: string]>([
    ['Ayer comí pescado.', 'Yesterday I ate fish.', 'Ayer comi pescado', 'comí', 'comi'],
    ['Quiero un café.', 'I want a coffee.', 'Quiero un cafe.', 'café', 'cafe'],
    ['¿Cuántos años tienes?', 'How old are you?', 'Cuantos años tienes', 'cuántos', 'cuantos'],
    ['Nació en Medellín.', 'He was born in Medellín.', 'Nacio en Medellín.', 'nació', 'nacio'],
    ['¿Dónde vives?', 'Where do you live?', 'Donde vives', 'dónde', 'donde'],
  ])('%s typed as "%s"', (es, en, typed, word, wrote) => {
    const r = matchTranslation(typed, S(es, en), lenient);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.note).toContain(`*${word}*`);
    expect(r.note).toContain(`*${wrote}*`);
    expect(r.note).not.toMatch(/[–—]| - /);
  });

  test('two slips name both words', () => {
    const r = matchTranslation('Nacio en Medellin', S('Nació en Medellín.', 'He was born in Medellín.'), lenient);
    expect(r.pass).toBe(true);
    expect(r.note).toContain('*nació*');
    expect(r.note).toContain('*medellín*');
  });

  test('the right answer has no note', () => {
    expect(matchTranslation('Ayer comí pescado.', S('Ayer comí pescado.', 'Yesterday I ate fish.'), lenient).note).toBeUndefined();
  });

  test('the sentence card passes it as right, with the note and the model to show', () => {
    const r = sentenceCheck({ es: 'Quiero un café.', en: 'I want a coffee.', accept: [] })('Quiero un cafe');
    expect(r).toMatchObject({ pass: true, answer: 'Quiero un café.' });
    expect(r.note).toContain('*café*');
    expect(r.lenient).toBeUndefined();
  });
});

describe('a slip that changes the word is still not right', () => {
  test('the question words are spelling: the tilde marks the question and the sentence means what it meant', () => {
    expect(matchTranslation('Cuantos años tienes', S('¿Cuántos años tienes?', 'How old are you?'), lenient).pass).toBe(true);
    expect(matchTranslation('Que quieres', S('¿Qué quieres?', 'What do you want?'), lenient).pass).toBe(true);
  });

  test.each<[typed: string, es: string, en: string]>([
    ['Ayer hablo con Vale.', 'Ayer habló con Vale.', 'Yesterday he talked with Vale.'],
    ['Si, quiero un tinto.', 'Sí, quiero un tinto.', 'Yes, I want a coffee.'],
    ['Tu tienes el café.', 'Tú tienes el café.', 'You have the coffee.'],
    ['El come pan.', 'Él come pan.', 'He eats bread.'],
    ['El café esta listo.', 'El café está listo.', 'The coffee is ready.'],
    ['Quiero mas café.', 'Quiero más café.', 'I want more coffee.'],
    ['Mi papa trabaja aquí.', 'Mi papá trabaja aquí.', 'My dad works here.'],
  ])('"%s"', (typed, es, en) => {
    for (const opts of [{}, lenient]) {
      const r = matchTranslation(typed, S(es, en), opts);
      expect(r.pass, JSON.stringify(r)).toBe(false);
      expect(r.near).toBe(true);
      expect(r.hintKind).toBe('accents');
      expect(r.note).toBeUndefined();
    }
  });

  test('one harmless slip beside one that changes the word is not right', () => {
    const r = matchTranslation('Ayer hablo con Maria', S('Ayer habló con María.', 'Yesterday he talked with María.'), lenient);
    expect(r.pass).toBe(false);
  });

  test('the sentence card fails it, with the accents hint to retry on', () => {
    const r = sentenceCheck({ es: 'Quiero más café.', en: 'I want more coffee.', accept: [] })('Quiero mas café');
    expect(r).toMatchObject({ pass: false, near: true, hintKind: 'accents' });
    expect(r.note).toBeUndefined();
  });

  test('the same for an accent added where there is none', () => {
    const r = matchTranslation('Tú casa es grande.', S('Tu casa es grande.', 'Your house is big.'), lenient);
    expect(r.pass).toBe(false);
  });
});

describe('which words an accent makes', () => {
  test.each([['hablo', 'habló'], ['si', 'sí'], ['tu', 'tú'], ['el', 'él'], ['esta', 'está'], ['mas', 'más'], ['canto', 'cantó'], ['bebe', 'bebé'], ['esté', 'este']])(
    '%s for %s', (typed, expected) => { expect(changesWord({ typed, expected })).toBe(true); });

  test.each([['comi', 'comí'], ['cafe', 'café'], ['nacio', 'nació'], ['medellin', 'medellín'], ['veintidos', 'veintidós'], ['tambien', 'también'], ['aqui', 'aquí']])(
    '%s for %s is a spelling slip', (typed, expected) => { expect(changesWord({ typed, expected })).toBe(false); });

  test('slips are found by word, whatever else differs and whatever the case', () => {
    expect(accentSlips('Ayer COMI pescado', 'Ayer comí pescado.')).toEqual([{ typed: 'comi', expected: 'comí' }]);
    expect(accentSlips('Yo ayer comi pescado', 'Ayer comí pescado.')).toEqual([{ typed: 'comi', expected: 'comí' }]);
    expect(accentSlips('Ayer comí pescado', 'Ayer comí pescado.')).toEqual([]);
  });
});

describe('the cards that take a sentence', () => {
  const b = fixtureBundle();
  const item = (op: PracticeItem['op']) => ({ op, id: `${op}:u01-4`, node: 'g:ser-identity', sentence: 'u01-4', direction: 'productive', scoring: 'exposure', credit: [] }) as unknown as PracticeItem;

  test('a translate card forgives the slip with a note', () => {
    const c = practiceCard(item('translate'), b, 1);
    if (c.type !== 'type') throw new Error(`expected a typed card, got ${c.type}`);
    const r = c.check('De donde eres');
    expect(r).toMatchObject({ pass: true, answer: '¿De dónde eres?' });
    expect(r.note).toContain('*dónde*');
    expect(r.near).toBeUndefined();
  });
});
