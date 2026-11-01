// splitEnclitic: a verb form with its clitics split off. The shortest base is
// "ir", so irme / irse / irlo have to split like comerlo does.
import { describe, expect, test } from 'vitest';
import { splitEnclitic } from '../../src/exercises/spanish';
import { canon, matchTranslation } from '../../src/check/translate';

describe('splitEnclitic', () => {
  test.each([
    ['irme', 'ir', ['me']],
    ['irse', 'ir', ['se']],
    ['irte', 'ir', ['te']],
    ['irlo', 'ir', ['lo']],
    ['irnos', 'ir', ['nos']],
    ['comerlo', 'comer', ['lo']],
    ['dándomelo', 'dando', ['me', 'lo']],
  ])('%s', (word, base, clitics) => {
    expect(splitEnclitic(word)).toMatchObject({ base, clitics });
  });

  test('a two-letter base takes a clitic pair too', () => {
    expect(splitEnclitic('irselo')).toMatchObject({ base: 'ir', clitics: ['se', 'lo'] });
  });

  test.each(['dame', 'ire', 'hace', 'tele', 'sale'])('%s is not an infinitive with a clitic', (word) => {
    expect(splitEnclitic(word)).toBeNull();
  });
});

describe('irme in a sentence', () => {
  test('the clitic climbs in front of tener que, as it does for every other infinitive', () => {
    expect(canon('Tengo que irme.').toks.map((t) => t.t)).toEqual(['me', 'tengo', 'que', 'ir']);
    expect(canon('Me tengo que ir.').toks.map((t) => t.t)).toEqual(['me', 'tengo', 'que', 'ir']);
  });

  test.each([
    ['Tengo que irme.', 'I have to leave.', 'Me tengo que ir.'],
    ['Me tengo que ir.', 'I have to leave.', 'Tengo que irme.'],
    ['Ella tiene que irse.', 'She has to leave.', 'Ella se tiene que ir.'],
    ['Quiero irme ya.', 'I want to leave now.', 'Me quiero ir ya.'],
  ])('%s accepts %s', (es, en, input) => {
    const r = matchTranslation(input, { es, en });
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });
});
