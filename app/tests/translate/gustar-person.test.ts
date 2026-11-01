// C8: the commonest English-speaker error with gustar must fail, with the
// reason that is true, and the correct sentences next to it must not.
//
// Subject pronouns are free in Spanish, so canon drops them. With gustar and
// its kin that is not enough: "Yo me gusta" is not "Me gusta". The rule fires
// on a person mismatch (the pronoun cannot be the subject of that verb), or on
// the English subject carried over ("She likes coffee" -> "Ella le gusta").
import { describe, expect, test } from 'vitest';
import { HINT_TEXT, matchTranslation } from '../../src/check/translate';

type Row = [es: string, en: string, input: string];

describe('the classic errors fail, and say why', () => {
  test.each<Row>([
    ['Me gusta el café.', 'I like coffee.', 'Yo me gusta el café.'],
    ['Me gusta el café.', 'I like coffee.', 'yo me gusta el café'],
    ['Te gusta el café.', 'You like coffee.', 'Tú te gusta el café.'],
    ['Nos gusta el café.', 'We like coffee.', 'Nosotros nos gusta el café.'],
    ['Les gusta el café.', 'They like coffee.', 'Ellos les gusta el café.'],
    ['Me gustan los perros.', 'I like dogs.', 'Yo me gustan los perros.'],
    ['Me duele la cabeza.', 'My head hurts.', 'Yo me duele la cabeza.'],
    ['No me gusta el café.', "I don't like coffee.", 'Yo no me gusta el café.'],
    // the English subject carried over: the pronoun agrees with the verb and still does not belong
    ['Le gusta el café.', 'She likes coffee.', 'Ella le gusta el café.'],
    ['A ella le gusta el café.', 'She likes coffee.', 'Ella le gusta el café.'],
    ['Le gusta el café.', 'He likes coffee.', 'Él le gusta el café.'],
  ])('%s / %s: "%s"', (es, en, input) => {
    const r = matchTranslation(input, { es, en });
    expect(r.pass, JSON.stringify(r)).toBe(false);
    expect(r.hintKind, JSON.stringify(r)).toBe('experiencer');
    expect(r.hint).toBe(HINT_TEXT.experiencer);
  });

  test('the same slip in a longer sentence still gets the gustar hint', () => {
    const r = matchTranslation('Yo me gusta mucho el café colombiano.', { es: 'Me gusta mucho el café colombiano.', en: 'I really like Colombian coffee.' });
    expect(r).toMatchObject({ pass: false, hintKind: 'experiencer' });
  });

  test('one hint, and it does not blame the verb ending', () => {
    expect(HINT_TEXT.experiencer).not.toMatch(/who is doing it|ending|spelling/i);
  });
});

describe('correct sentences stay correct', () => {
  test.each<Row>([
    ['Me gusta el café.', 'I like coffee.', 'Me gusta el café.'],
    ['Me gusta el café.', 'I like coffee.', 'A mí me gusta el café.'],
    ['Me gusta el café.', 'I like coffee.', 'a mí me gusta el café'],
    ['A ella le gusta el café.', 'She likes coffee.', 'A ella le gusta el café.'],
    ['A ella le gusta el café.', 'She likes coffee.', 'Le gusta el café.'],
    ['Te gusta el café.', 'You like coffee.', 'A ti te gusta el café.'],
    ['No lo conozco, no me cae bien.', "I don't know him, I don't like him.", 'No lo conozco, no me cae bien.'],
    ['Él no me cae bien.', "I don't like him.", 'Él no me cae bien.'],
    ['Te quedas aquí.', 'You stay here.', 'Tú te quedas aquí.'],
    ['Me quedo aquí.', 'I stay here.', 'Yo me quedo aquí.'],
    ['Ella se queda aquí.', 'She stays here.', 'Ella se queda aquí.'],
    ['Me gustas.', 'I like you.', 'Tú me gustas.'],
    ['Te gusto.', 'You like me.', 'Yo te gusto.'],
    ['Él me parece simpático.', 'He seems nice to me.', 'Él me parece simpático.'],
    ['Ella me parece simpática.', 'She seems nice to me.', 'Ella me parece simpática.'],
    ['Ella me gusta.', 'I like her.', 'Ella me gusta.'],
    ['Me gusto.', 'I like myself.', 'Yo me gusto.'],
  ])('%s / %s: "%s"', (es, en, input) => {
    const r = matchTranslation(input, { es, en });
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });
});

describe('a sentence break is a boundary', () => {
  test('a pronoun that ends one sentence is not the subject of the next', () => {
    const row = { es: '¿Debo hablar yo?\nNo me parece que debas.', en: "Should I speak?\nI don't think you should. (to a friend)" };
    expect(matchTranslation(row.es, row).pass).toBe(true);
  });

  test('a mí at the end of a sentence is not dropped', () => {
    const row = { es: '¿Quién? A mí. Me gusta el café.', en: 'Who? Me. I like coffee.' };
    expect(matchTranslation(row.es, row).pass).toBe(true);
    expect(matchTranslation('¿Quién? Me gusta el café.', row).pass).toBe(false);
  });
});
