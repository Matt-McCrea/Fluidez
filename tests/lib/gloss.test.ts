import { describe, expect, test } from 'vitest';
import { resolveGloss, SMALL_WORDS, isOrdinaryWord, type GlossContext, type Lexeme } from '../../lib/gloss';

const lexemes: Lexeme[] = [
  { es: 'poder', en: 'to be able to, can', pos: 'verb' },
  { es: 'ser', en: 'to be', pos: 'verb' },
  { es: 'ir', en: 'to go', pos: 'verb' },
  { es: 'tener', en: 'to have', pos: 'verb' },
  { es: 'comer', en: 'to eat', pos: 'verb' },
  { es: 'dar', en: 'to give', pos: 'verb' },
  { es: 'el', en: 'the', pos: 'det' },
  { es: 'un', en: 'a, an', pos: 'det' },
  { es: 'de', en: 'of, from', pos: 'prep' },
  { es: 'saber', en: 'to know', pos: 'verb' },
  { es: 'haber', en: 'to have (auxiliary)', pos: 'verb' },
  { es: 'la luz', en: 'light', pos: 'noun' },
  { es: 'la canción', en: 'song', pos: 'noun' },
  { es: 'la casa', en: 'house', pos: 'noun' },
  { es: 'el joven', en: 'young person', pos: 'noun' },
  { es: 'alto', en: 'tall', pos: 'adj' },
  { es: 'otro', en: 'other', pos: 'det' },
  { es: 'rosa', en: 'rose', pos: 'noun' },
  { es: 'este', en: 'this', pos: 'det' },
  { es: 'cliente', en: 'client', pos: 'noun', gender: 'm' },
];
const ctx = (over: Partial<GlossContext> = {}): GlossContext => ({ lexemes, ...over });

describe('resolveGloss: order', () => {
  test('the passage\'s own note wins over the word list', () => {
    expect(resolveGloss('casa', ctx({ gloss: [{ es: 'casa', en: 'home (here)' }] }))).toEqual({ es: 'casa', en: 'home (here)' });
    expect(resolveGloss('casa', ctx())).toEqual({ es: 'la casa', en: 'house' });
  });
  test('a name is a name before anything else, and a note on a common noun is not a note on the name', () => {
    const c = ctx({ names: new Set(['rosa']), gloss: [{ es: 'rosa', en: 'rose' }] });
    expect(resolveGloss('Rosa', c)).toEqual({ es: 'Rosa', en: 'a name', name: true });
    expect(resolveGloss('rosa', c)).toEqual({ es: 'rosa', en: 'rose' });
    expect(resolveGloss('ROSA', c)?.name).toBeUndefined();
  });
  test('small words and the other forms of the articles', () => {
    expect(resolveGloss('del', ctx())).toEqual({ es: 'del', en: 'of the, from the (de + el)' });
    expect(resolveGloss('unas', ctx())).toEqual({ es: 'un', en: 'some', form: 'unas', how: 'feminine plural' });
    expect(resolveGloss('sé', ctx())).toMatchObject({ es: 'saber', en: 'to know', how: 'I, present' });
    expect(resolveGloss('esta', ctx())).toMatchObject({ es: 'este', en: 'this', form: 'esta' });
  });
  test('a custom small-word table replaces the default', () => {
    expect(resolveGloss('yo', ctx({ smallWords: { yo: { en: 'I' } } }))).toEqual({ es: 'yo', en: 'I' });
    expect(resolveGloss('del', ctx({ smallWords: {} }))).toBeUndefined();
  });
  test('the word list, with plurals', () => {
    expect(resolveGloss('luz', ctx())?.en).toBe('light');
    expect(resolveGloss('luces', ctx())?.en).toBe('light');
    expect(resolveGloss('canciones', ctx())?.en).toBe('song');
    expect(resolveGloss('casas', ctx())?.en).toBe('house');
    expect(resolveGloss('jóvenes', ctx())?.en).toBe('young person');
    expect(resolveGloss('jovenes', ctx())?.en).toBe('young person');
  });
  test('a verb form comes back to its infinitive with person and tense', () => {
    expect(resolveGloss('pudimos', ctx())).toEqual({ es: 'poder', en: 'to be able to, can', form: 'pudimos', how: 'we, preterite' });
    expect(resolveGloss('comemos', ctx())).toMatchObject({ es: 'comer', how: 'we, present' });
  });
  test('an ambiguous person names every person it can be', () => {
    expect(resolveGloss('comía', ctx())?.how).toBe('I or he or she, imperfect');
  });
  test('a form shared by two verbs names the other', () => {
    expect(resolveGloss('fue', ctx())?.how).toMatch(/or from/);
  });
  test('a verb with a clitic', () => {
    expect(resolveGloss('dámelo', ctx())).toMatchObject({ es: 'dar', form: 'dámelo' });
    expect(resolveGloss('dámelo', ctx())?.how).toMatch(/attached/);
  });
  test('an exact bank phrase comes after the verbs', () => {
    expect(resolveGloss('ojalá', ctx({ exact: new Map([['ojalá', 'I hope so']]) }))).toEqual({ es: 'ojalá', en: 'I hope so' });
    expect(resolveGloss('ojalá', ctx({ exact: { ojalá: 'I hope so' } }))?.en).toBe('I hope so');
    expect(resolveGloss('toString', ctx({ exact: { ojalá: 'x' } }))).toBeUndefined();
  });
  test('a feminine or plural of an adjective is read back to its masculine', () => {
    expect(resolveGloss('alta', ctx())).toEqual({ es: 'alto', en: 'tall', form: 'alta' });
    expect(resolveGloss('otras', ctx())).toMatchObject({ es: 'otro', form: 'otras' });
    expect(resolveGloss('clienta', ctx())).toMatchObject({ es: 'cliente', form: 'clienta' });
  });
  test('an unknown word and empty input give nothing', () => {
    expect(resolveGloss('zzzxq', ctx())).toBeUndefined();
    expect(resolveGloss('', ctx())).toBeUndefined();
    expect(resolveGloss('¡!', ctx())).toBeUndefined();
  });
  test('punctuation and case around a token are ignored', () => {
    expect(resolveGloss('Pudimos,', ctx())).toMatchObject({ es: 'poder' });
  });
});

describe('resolveGloss: where it was tapped', () => {
  test('la before a verb is an object pronoun, la before a noun is the article', () => {
    const line = 'No la tengo.';
    expect(resolveGloss('la', ctx({ at: { line, index: 1 } }))?.en).toMatch(/her, it/);
    const noun = 'La casa es alta.';
    expect(resolveGloss('La', ctx({ at: { line: noun, index: 0 } }))).toMatchObject({ en: 'the', form: 'La' });
    expect(resolveGloss('la', ctx())).toMatchObject({ en: 'the' });
  });
  test('a note on a phrase is added when it covers the word tapped there', () => {
    const gloss = [{ es: 'por si acaso', en: 'just in case' }];
    const line = 'Lo traje por si acaso.';
    expect(resolveGloss('si', ctx({ gloss, at: { line, index: 3 } }))).toEqual({ es: 'por si acaso', en: 'just in case' });
    expect(resolveGloss('casa', ctx({ gloss, at: { line: 'La casa es alta.', index: 1 } }))?.phrase).toBeUndefined();
    expect(resolveGloss('traje', ctx({ gloss, at: { line, index: 1 } }))?.phrase).toBeUndefined();
  });
  test('a phrase is attached after a word\'s own note', () => {
    const gloss = [{ es: 'la casa', en: 'the home' }];
    const g = resolveGloss('casa', ctx({ gloss, at: { line: 'La casa es alta.', index: 1 } }));
    expect(g).toMatchObject({ es: 'la casa', en: 'house', phrase: { en: 'the home' } });
  });
});

describe('helpers', () => {
  test('isOrdinaryWord', () => {
    expect(isOrdinaryWord('casa', lexemes)).toBe(true);
    expect(isOrdinaryWord('casas', lexemes)).toBe(true);
    expect(isOrdinaryWord('del', lexemes)).toBe(true);
    expect(isOrdinaryWord('hernando', lexemes)).toBe(false);
    expect('del' in SMALL_WORDS).toBe(true);
  });
  test('an injected engine is used', () => {
    const engine = { analyzeToken: () => [{ inf: 'comer', tense: 'presente', person: 'yo', target: true, accentExact: true, clitics: [] }] } as never;
    expect(resolveGloss('xyz', ctx({ engine }))).toMatchObject({ es: 'comer', how: 'I, present' });
  });
});
