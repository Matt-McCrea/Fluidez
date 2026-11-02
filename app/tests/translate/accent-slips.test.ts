// R15: an accent slip stays right, with a note that says which word, unless the
// accent changes the word (hablo against habló, si against sí, tu against tú, el
// against él, esta against está, mas against más). Sentence cards used to be
// strict, so café typed as cafe was marked wrong; and the lenient option passed a
// slip whatever it did to the word, so hablo went through for habló.
import { describe, expect, test } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { accentSlips, changesWord } from '../../src/check/translate/accents';
import { checkItem } from '../../src/exercises';
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
    ['¿Cuántos años tienes?', 'How old are you?', 'Cuantos años tienes', 'Cuántos', 'cuantos'],
    ['Nació en Medellín.', 'He was born in Medellín.', 'Nacio en Medellín.', 'Nació', 'nacio'],
    ['¿Dónde vives?', 'Where do you live?', 'Donde vives', 'Dónde', 'donde'],
    // the verb and the adverbials are how the matcher finds a sentence's shape, so a slip on one used to hide the rest
    ['También quiero un café.', 'I also want a coffee.', 'Tambien quiero un café.', 'También', 'tambien'],
    ['Todavía no he comido.', 'I have not eaten yet.', 'Todavia no he comido', 'Todavía', 'todavia'],
    ['Yo quería verlo.', 'I wanted to see him.', 'Yo queria verlo.', 'quería', 'queria'],
    ['¿Podría ayudarme?', 'Could you help me?', 'Podria ayudarme', 'Podría', 'podria'],
    ['Lo leo todos los días.', 'I read it every day.', 'Lo leo todos los dias', 'días', 'dias'],
    // the bare spelling reads as a verb, and nobody typing it means that verb
    ['¿Cómo te llamas?', 'What is your name?', 'Como te llamas', 'Cómo', 'como'],
    ['Tomás abre el café.', 'Tomás opens the café.', 'Tomas abre el café.', 'Tomás', 'tomas'],
    ['Hace frío.', 'It is cold.', 'Hace frio.', 'frío', 'frio'],
    ['El río está lejos.', 'The river is far.', 'El rio está lejos.', 'río', 'rio'],
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
    expect(r.note).toContain('*Nació*');
    expect(r.note).toContain('*Medellín*');
  });

  test('a pass through a swap and a slip at once says both', () => {
    const r = matchTranslation('Si hubiera sabido, hubiera venido al cafe.', S('Si hubiera sabido, habría venido al café.', 'If I had known, I would have come to the café.'), lenient);
    expect(r.pass).toBe(true);
    expect(r.note).toMatch(/habría and hubiera/i);
    expect(r.note).toContain('*café*');
  });

  test('a sentence with both spellings of a word is mended in the right place', () => {
    expect(matchTranslation('Me pregunto que que quieres.', S('Me pregunto que qué quieres.', 'I wonder what you want.'), lenient).pass).toBe(true);
  });

  test('a slip does not rescue a sentence that is wrong elsewhere', () => {
    const es = S('También quiero un café.', 'I also want a coffee.');
    expect(matchTranslation('Tambien quiero una cafe.', es, lenient).pass).toBe(false);
    expect(matchTranslation('Tambien quiero un té.', es, lenient).pass).toBe(false);
    expect(matchTranslation('Yo queria verla.', S('Yo quería verlo.', 'I wanted to see him.'), lenient).pass).toBe(false);
  });

  test('nor one the near match does not read, like the figure in una millón', () => {
    const es = S('La organización costó un millón de pesos.', 'The organisation cost a million pesos.');
    expect(matchTranslation('La organizacion costó un millón de pesos.', es, lenient).pass).toBe(true);
    expect(matchTranslation('La organizacion costó una millón de pesos.', es, lenient).pass).toBe(false);
  });

  test('the strict default still marks all of these wrong', () => {
    expect(matchTranslation('Tambien quiero un café.', S('También quiero un café.', 'I also want a coffee.')).pass).toBe(false);
    expect(matchTranslation('Como te llamas', S('¿Cómo te llamas?', 'What is your name?')).pass).toBe(false);
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
    // another word that the engine has no verb to read it by: a preposition, an adjective, a drink, a time of day
    ['Hacia calor.', 'Hacía calor.', 'It was hot.'],
    ['Seria mejor.', 'Sería mejor.', 'It would be better.'],
    ['Eso no lo sabia.', 'Eso no lo sabía.', "I didn't know that."],
    ['Jugo bien.', 'Jugó bien.', 'He played well.'],
    ['Me costo mucho.', 'Me costó mucho.', 'It cost me a lot.'],
    ['Vale cerro el café.', 'Vale cerró el café.', 'Vale closed the café.'],
    ['Tarde tres horas.', 'Tardé tres horas.', 'It took me three hours.'],
    ['Tus papas llegan hoy.', 'Tus papás llegan hoy.', 'Your parents arrive today.'],
    ['Tomate tu tiempo.', 'Tómate tu tiempo.', 'Take your time.'],
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

describe('the name and the verb are told apart by which one the sentence wants', () => {
  test('tomas stays the verb where the verb is the answer', () => {
    expect(changesWord({ typed: 'tomas', expected: 'Tomás' })).toBe(false);
    expect(changesWord({ typed: 'tomás', expected: 'tomas' })).toBe(true);
    expect(matchTranslation('Tomás el bus.', S('Tomas el bus.', 'You take the bus.'), lenient).pass).toBe(false);
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

describe('a typed gap', () => {
  const item = (kind: string, answer: string) => ({ id: 'i', generator: 'g', nodes: [], kind, prompt: '', answer, accept: [], en: '' }) as unknown as Parameters<typeof checkItem>[0];

  test.each([['lexGap', 'café', 'cafe'], ['cue', 'también', 'tambien'], ['typeForm', 'comí', 'comi']])('%s %s typed as %s stays right, with a note, where the cards ask for it', (kind, answer, typed) => {
    const r = checkItem(item(kind, answer), typed, lenient);
    expect(r).toMatchObject({ pass: true, answer });
    expect(r.note).toContain(`*${answer}*`);
    expect(r.hint).toBeUndefined();
  });

  test('stays strict without the option, and where the accent is the word', () => {
    expect(checkItem(item('lexGap', 'café'), 'cafe')).toMatchObject({ pass: false, near: true, hint: 'Check the accents.' });
    expect(checkItem(item('typeForm', 'habló'), 'hablo', lenient)).toMatchObject({ pass: false, near: true, hint: 'Check the accents.' });
    expect(checkItem(item('typeForm', 'hablé'), 'hable', lenient)).toMatchObject({ pass: false, near: true });
    expect(checkItem(item('typeForm', 'comí'), 'como', lenient).pass).toBe(false);
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
