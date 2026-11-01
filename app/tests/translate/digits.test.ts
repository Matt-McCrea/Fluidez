// Digits and number words are one thing to the matcher, and the internal
// placeholder for a figure never reaches the learner.
import { describe, expect, test } from 'vitest';
import { canon, matchTranslation } from '../../src/check/translate';

const keyOf = (s: string) => canon(s).toks.map((t) => t.t).join(' ');

describe('number words and digits meet in one canonical form', () => {
  test.each([
    ['cinco', '5'],
    ['quince', '15'],
    ['dieciséis', '16'],
    ['veintiuno', '21'],
    ['veintiún', '21'],
    ['treinta y cinco', '35'],
    ['cien', '100'],
    ['ciento veinte', '120'],
    ['doscientos cincuenta', '250'],
    ['mil', '1000'],
    ['dos mil veinte', '2020'],
    ['mil novecientos noventa', '1990'],
    ['tres mil quinientos', '3500'],
    ['dos millones', '2000000'],
  ])('%s is %s', (words, digits) => {
    expect(keyOf(`Hay ${words} personas`)).toBe(keyOf(`Hay ${digits} personas`));
  });

  test.each([['3.500'], ['3,500'], ['3500']])('%s is three thousand five hundred', (digits) => {
    expect(keyOf(`Cuesta ${digits} pesos`)).toBe(keyOf('Cuesta tres mil quinientos pesos'));
  });

  test('2 millones is two million', () => {
    expect(keyOf('Son 2 millones')).toBe(keyOf('Son dos millones'));
  });

  test('un, uno and una stay what they are: an article is not a figure', () => {
    expect(keyOf('Tengo un hermano')).toBe('tengo un hermano');
    expect(keyOf('Tengo una hermana')).toBe('tengo una hermana');
  });

  test('two figures stay two figures', () => {
    expect(keyOf('Son cinco y diez')).not.toBe(keyOf('Son quince'));
    expect(keyOf('Son cinco diez')).toBe('son 5 10');
  });

  test('a figure keeps its place, and a percent is por ciento', () => {
    expect(keyOf('El 70 % prefiere el café')).toBe(keyOf('El setenta por ciento prefiere el café'));
    expect(keyOf('El 70 % prefiere el café')).not.toBe(keyOf('El prefiere el café'));
  });
});

describe('matchTranslation with figures', () => {
  const s = { es: 'La señora compra cinco panes.', en: 'The lady buys five loaves of bread.' };

  test('digits for a number word pass', () => {
    const r = matchTranslation('La señora compra 5 panes.', s);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test('a number word for digits passes', () => {
    const r = matchTranslation('La señora compra cinco panes.', { es: 'La señora compra 5 panes.', en: s.en });
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test('years in words and in digits', () => {
    const r = matchTranslation('Mi mamá llegó en mil novecientos noventa.', { es: 'Mi mamá llegó en 1990.', en: 'My mom arrived in 1990.' });
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test('a number word without its accent is an accent slip, as any other word is', () => {
    const r = matchTranslation('Tengo dieciseis años.', { es: 'Tengo dieciséis años.', en: 'I am sixteen years old.' });
    expect(r).toMatchObject({ pass: false, near: true, hintKind: 'accents' });
    expect(matchTranslation('Tengo 16 años.', { es: 'Tengo dieciséis años.', en: 'I am sixteen years old.' }).pass).toBe(true);
  });

  test('the wrong number is wrong, and the learner never reads xnum', () => {
    for (const input of ['La señora compra 6 panes.', 'La señora compra seis panes.', 'La señora compra panes.', 'La señora compra 5.']) {
      for (const sentence of [s, { es: 'La señora compra 5 panes.', en: s.en }]) {
        const r = matchTranslation(input, sentence);
        expect(r.pass, input).toBe(false);
        expect(JSON.stringify(r), input).not.toMatch(/xnum/i);
      }
    }
  });
});
