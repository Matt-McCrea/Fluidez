import { describe, expect, test } from 'vitest';
import { expandAccept, expandAcceptList, MAX_EXPANSION, matchTranslation } from '../../../lib/match';

describe('expandAccept', () => {
  test('a plain string expands to itself', () => {
    expect(expandAccept('Quiero un café.')).toEqual(['Quiero un café.']);
  });
  test('round brackets are optional', () => {
    expect(expandAccept('(Yo) quiero café')).toEqual(['Yo quiero café', 'quiero café']);
    expect(expandAccept('(Yo) quiero (un) café').sort()).toEqual(['Yo quiero café', 'Yo quiero un café', 'quiero café', 'quiero un café'].sort());
  });
  test('square brackets with pipes are alternatives', () => {
    expect(expandAccept('Voy [al|a el] mercado')).toEqual(['Voy al mercado', 'Voy a el mercado']);
  });
  test('an alternative may be empty', () => {
    expect(expandAccept('Voy [|ya] a casa')).toEqual(['Voy a casa', 'Voy ya a casa']);
  });
  test('they nest', () => {
    expect(expandAccept('Voy [a (la)|al] mercado').sort()).toEqual(['Voy a la mercado', 'Voy a mercado', 'Voy al mercado'].sort());
    expect(expandAccept('[quiero (mucho)|deseo]').sort()).toEqual(['deseo', 'quiero', 'quiero mucho']);
    expect(expandAccept('(Yo [creo|pienso] que) sí').sort()).toEqual(['Yo creo que sí', 'Yo pienso que sí', 'sí']);
  });
  test('spaces and punctuation are tidied when text drops out', () => {
    expect(expandAccept('Sí, (claro,) vamos .')).toEqual(['Sí, claro, vamos.', 'Sí, vamos.']);
  });
  test('results are deduplicated', () => {
    expect(expandAccept('[a|a] b')).toEqual(['a b']);
  });
  test('expansion is capped at 64 strings', () => {
    const p = '(a) (b) (c) (d) (e) (f) (g) (h) x';
    expect(expandAccept(p).length).toBe(MAX_EXPANSION);
    expect(expandAccept('[1|2|3|4] [1|2|3|4] [1|2|3|4] [1|2|3|4]').length).toBe(64);
    expect(expandAccept('[1|2|3|4] [1|2|3|4] [1|2|3|4] [1|2|3|4] [1|2|3|4]').length).toBe(64);
  });
  test('the first string is the fullest reading', () => {
    expect(expandAccept('(Yo) [quiero|deseo] (un) café')[0]).toBe('Yo quiero un café');
  });
  test('unbalanced brackets throw', () => {
    expect(() => expandAccept('Voy (al mercado')).toThrow();
    expect(() => expandAccept('Voy [al|a el mercado')).toThrow();
    expect(() => expandAccept('Voy al) mercado')).toThrow();
  });
  test('the list form keeps a malformed pattern as written', () => {
    expect(expandAcceptList(['Voy (al'])).toEqual(['Voy (al']);
    expect(expandAcceptList(undefined)).toBeUndefined();
    expect(expandAcceptList(['a [b|c]', 'a b'])).toEqual(['a b', 'a c']);
  });
});

describe('accept patterns in the matcher', () => {
  const s = { es: 'Quiero un café.', en: 'I want a coffee.', accept: ['(Yo) [deseo|quisiera] (un) café.'] };
  test.each(['Quiero un café.', 'Deseo un café.', 'Yo deseo un café', 'quisiera café', 'Yo quisiera un café.'])('passes %s', (i) => {
    expect(matchTranslation(i, s).pass).toBe(true);
  });
  test('and something else still fails', () => {
    expect(matchTranslation('Deseo un té.', s).pass).toBe(false);
  });
  test('a pattern with an alternative the engine would not produce', () => {
    const t = { es: 'Voy a la tienda.', en: 'I go to the store.', accept: ['Voy [a la|para la] tienda'] };
    expect(matchTranslation('Voy para la tienda', t).pass).toBe(true);
  });
});
