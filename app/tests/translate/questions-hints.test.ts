// Yes/no questions move their subject freely; wh-questions put the verb
// first. And the hints never blame a right word for being in the wrong place.
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { diagnose, HINT_TEXT, matchTranslation } from '../../src/check/translate';
import { questionOrders } from '../../src/check/translate/canon';
import { BankSentence } from '../../src/content/schema';

const S = (es: string, en: string, accept: string[] = []) => BankSentence.parse({ id: 't', es, en, accept });

describe('question inversion', () => {
  const simon = S('¿Simón habla inglés?', 'Does Simón speak English?');
  test.each(['¿Simón habla inglés?', '¿Habla Simón inglés?', '¿Habla inglés Simón?', 'habla simon ingles', 'Habla Simón inglés?'])(
    'yes/no, subject anywhere: %s', (input) => {
      const r = matchTranslation(input, simon, { accents: 'lenient' });
      expect(r.pass, JSON.stringify(r)).toBe(true);
    });

  const vale = S('¿Vale está aquí?', 'Is Vale here?');
  test.each(['¿Vale está aquí?', '¿Está Vale aquí?', '¿Está aquí Vale?'])('Vale before, after, at the end: %s', (input) => {
    expect(matchTranslation(input, vale).pass).toBe(true);
  });
  test('the model may itself put the verb first', () => {
    const m = S('¿Está Vale aquí?', 'Is Vale here?');
    for (const input of ['¿Vale está aquí?', '¿Está aquí Vale?', '¿Está Vale aquí?']) expect(matchTranslation(input, m).pass, input).toBe(true);
  });
  test('a short noun phrase before the verb moves too', () => {
    const m = S('¿Tu hermano vive aquí?', 'Does your brother live here?');
    expect(matchTranslation('¿Vive tu hermano aquí?', m).pass).toBe(true);
    expect(matchTranslation('¿Vive aquí tu hermano?', m).pass).toBe(true);
  });
  test('after a modal the subject may follow the whole verb group', () => {
    const m = S('¿Simón puede venir?', 'Can Simón come?');
    for (const input of ['¿Puede Simón venir?', '¿Puede venir Simón?']) expect(matchTranslation(input, m).pass, input).toBe(true);
  });

  const what = S('¿Qué quiere Vale?', 'What does Vale want?');
  test('wh-question: verb before the subject passes', () => {
    expect(matchTranslation('¿Qué quiere Vale?', what).pass).toBe(true);
  });
  test('wh-question: subject before the verb fails, as word order', () => {
    const r = matchTranslation('¿Qué Vale quiere?', what);
    expect(r.pass).toBe(false);
    expect(r.hintKind).toBe('word-order');
  });
  test('wh-questions get no reordered variants', () => {
    expect(questionOrders('¿Qué quiere Vale?')).toEqual([]);
    expect(questionOrders('¿De dónde es Simón?')).toEqual([]);
  });
  test('a name after a preposition is not a subject', () => {
    expect(questionOrders('¿Hablas con Simón?')).toEqual([]);
    expect(questionOrders('¿Conoces a Vale?')).toEqual([]);
    expect(matchTranslation('¿Vale conoces a?', S('¿Conoces a Vale?', 'Do you know Vale?')).pass).toBe(false);
  });
  test('statements are left alone', () => {
    expect(questionOrders('Simón habla inglés.')).toEqual([]);
    expect(matchTranslation('Habla Simón inglés.', S('Simón habla inglés.', 'Simón speaks English.')).pass).toBe(false);
  });
});

describe('hints', () => {
  test('pure word-order difference: never blames a right word', () => {
    const d = diagnose(['habla', 'simón', 'inglés'], ['simón', 'habla', 'inglés']);
    expect(d.kind).toBe('word-order');
    expect(d.hint).toBe(HINT_TEXT['word-order']);
    expect(d.hint).toMatch(/^Right words, different order/);
  });
  test('Matthew\'s case: the right words, part of a longer answer, out of order', () => {
    const d = diagnose(['habla', 'simón', 'inglés'], ['simón', 'habla', 'inglés', 'no', 'sé']);
    expect(d.kind).toBe('word-order');
    expect(d.hint).not.toMatch(/fit|isn't the word/);
  });
  test('a substituted word found elsewhere in the answer is word order', () => {
    const d = diagnose(['habla', 'mucho', 'simón'], ['simón', 'habla', 'mucho', 'inglés']);
    expect(d.kind).toBe('word-order');
  });
  test('wrong word only when the word is not in the answer at all', () => {
    const d = diagnose(['bebo', 'pescado'], ['como', 'pescado']);
    expect(d.kind).toBe('wrong-word');
    expect(d.hint).toBe('"bebo" isn\'t the word here, check the meaning.');
  });
  test('through the matcher too', () => {
    const r = matchTranslation('Bebo pescado.', S('Como pescado.', 'I eat fish.'));
    expect(r.hint).toBe('"bebo" isn\'t the word here, check the meaning.');
    const o = matchTranslation('¿Qué Vale quiere?', S('¿Qué quiere Vale?', 'What does Vale want?'));
    expect(o.hint).toBe(HINT_TEXT['word-order']);
  });
  test('no em or en dash in any hint string', () => {
    const src = readFileSync(new URL('../../src/check/translate/hints.ts', import.meta.url), 'utf8');
    const strings = src.match(/(['`"])(?:(?!\1)[^\\]|\\.)*\1/g) ?? [];
    for (const s of strings) expect(s, s).not.toMatch(/[—–]/);
    for (const h of Object.values(HINT_TEXT)) expect(h).not.toMatch(/[—–]/);
  });
  test('every hint the diagnoser builds is dash-free', () => {
    const cases: Array<[string[], string[]]> = [
      [['la', 'libro'], ['el', 'libro']], [['el', 'libros'], ['los', 'libros']], [['comes'], ['como']], [['comí'], ['como']],
      [['casa', 'blanco'], ['casa', 'blanca']], [['bebo'], ['como']],
    ];
    for (const [a, b] of cases) expect(diagnose(a, b).hint).not.toMatch(/[—–]/);
  });
});
