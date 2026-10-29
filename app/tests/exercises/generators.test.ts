// Generators 3–5 (translation, recombination, lexemes) and the invariants
// every generator shares.
import { describe, expect, test } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { BankSentence } from '../../src/content/schema';
import {
  checkItem, corpusAlternatives, cueItem, enChangePerson, enNegate, ladder, lexGapItem, lexGapItems, recombinations,
  structuredInputAll, translationItems, type Item, type LexemeLike, type RecombineItem,
} from '../../src/exercises';
import { sentenceKey } from '../../src/exercises/spanish';
import { BANK, byId } from './fixtures';
import { hasVosotros, producedSpanish } from './helpers';

const S = (es: string, en: string, id = 'adv') => BankSentence.parse({ id, es, en });

describe('generator 3: translation items', () => {
  test('both directions, stable ids', () => {
    const [a, b] = translationItems(byId('u01-1'));
    expect(a).toMatchObject({ id: 'translate|u01-1|en-es', dir: 'en-es', prompt: 'I eat fish.', answer: 'Como pescado.' });
    expect(b).toMatchObject({ id: 'translate|u01-1|es-en', dir: 'es-en', prompt: 'Como pescado.', answer: 'I eat fish.' });
  });
  test('en→es is checked by the matcher (pronoun drop, registers, Peninsular)', () => {
    const [it] = translationItems(byId('u01-4'));
    expect(checkItem(it, '¿Habla usted inglés?').pass).toBe(true);
    expect(checkItem(it, '¿Habláis inglés?')).toMatchObject({ pass: true, variant: 'peninsular' });
    expect(checkItem(it, '¿Hablas francés?').pass).toBe(false);
  });
  test('es→en is checked by the English matcher', () => {
    const it = translationItems(byId('u01-6'))[1];
    expect(checkItem(it, 'I am tired').pass).toBe(true);
    expect(checkItem(it, 'I was tired').pass).toBe(false);
  });
  test('other bank Spanish with the same English is accepted', () => {
    const bank = [...BANK, S('Ceno pescado.', 'I eat fish.', 'z-1')];
    expect(corpusAlternatives(bank, byId('u01-1'))).toEqual(['Ceno pescado.']);
    const [it] = translationItems(byId('u01-1'), { bank });
    expect(checkItem(it, 'Ceno pescado').pass).toBe(true);
  });
  test('only the requested direction', () => {
    expect(translationItems(byId('u01-1'), { dirs: ['es-en'] }).map((i) => i.dir)).toEqual(['es-en']);
  });
});

describe('English re-inflection (the only English generator 4 trusts)', () => {
  test.each<[string, 'I' | 'you' | 'he' | 'she' | 'we' | 'they', string, string | null]>([
    ['I eat fish.', 'we', 'presente', 'We eat fish.'],
    ['I eat fish.', 'she', 'presente', 'She eats fish.'],
    ['She works in a bank.', 'I', 'presente', 'I work in a bank.'],
    ['She studies a lot.', 'they', 'presente', 'They study a lot.'],
    ["I'm tired.", 'we', 'presente', "We're tired."],
    ['I have two brothers.', 'he', 'presente', 'He has two brothers.'],
    ['Do you speak English?', 'she', 'presente', 'Does she speak English?'],
    ['Where do you live?', 'we', 'presente', 'Where do we live?'],
    ['Yesterday I ate fish.', 'they', 'preterito', 'Yesterday they ate fish.'],
    ['I wash my hands.', 'we', 'presente', 'We wash our hands.'],
    ['I was tired.', 'we', 'imperfecto', 'We were tired.'],
    ['My sister lives in Bogotá.', 'we', 'presente', null],               // noun subject
    ['She gives her book to him.', 'I', 'presente', null],                // whose "her"?
  ])('"%s" → %s', (en, to, tense, out) => {
    expect(enChangePerson(en, to, tense as never)).toBe(out);
  });
  test.each<[string, string, string | null]>([
    ['I eat fish.', 'presente', "I don't eat fish."],
    ['She works in a bank.', 'presente', "She doesn't work in a bank."],
    ["I'm tired.", 'presente', "I'm not tired."],
    ['I have two brothers.', 'presente', "I don't have two brothers."],
    ['I bought the book.', 'preterito', "I didn't buy the book."],
    ['Do you speak English?', 'presente', "Don't you speak English?"],
    ['I also study French.', 'presente', null],
    ['Where do you live?', 'presente', null],
    ['The house is white.', 'presente', null],
  ])('negate "%s"', (en, tense, out) => {
    const gloss = en.includes('bought') ? { base: 'buy', past: 'bought' } : undefined;
    expect(enNegate(en, tense as never, gloss)?.text ?? null).toBe(out);
  });
});

describe('generator 4: new recombinations', () => {
  const all = BANK.flatMap((s) => recombinations(s, { seed: 4, bank: BANK }));
  const bankKeys = new Set(BANK.map((s) => sentenceKey(s.es)));
  const find = (id: string, key: string) => recombinations(byId(id), { bank: BANK }).find((r) => r.id === `recombine|${id}|${key}`);

  test('there are many, and none is a sentence the learner has seen', () => {
    expect(all.length).toBeGreaterThan(150);
    for (const r of all) expect(bankKeys.has(sentenceKey(r.es)), r.es).toBe(false);
  });
  test('`known` adds to what counts as seen', () => {
    const before = recombinations(byId('u01-1'), { bank: BANK });
    const after = recombinations(byId('u01-1'), { bank: BANK, known: ['Comemos pescado.'] });
    expect(before.some((r) => r.es === 'Comemos pescado.')).toBe(true);
    expect(after.some((r) => r.es === 'Comemos pescado.')).toBe(false);
  });
  test('person and negation are production, with English', () => {
    expect(find('u01-1', 'person:nosotros')).toMatchObject({ mode: 'production', es: 'Comemos pescado.', en: 'We eat fish.' });
    expect(find('u01-1', 'negate')).toMatchObject({ mode: 'production', es: 'No como pescado.', en: "I don't eat fish." });
    expect(find('u01-1', 'person:ellos+negate')).toMatchObject({ mode: 'production', es: 'No comen pescado.', en: "They don't eat fish." });
    expect(find('u02-1', 'person:nosotros')).toMatchObject({ es: 'Ayer comimos pescado.', en: 'Yesterday we ate fish.' });
  });
  test('he/she follows an explicit Spanish pronoun', () => {
    expect(find('u06-6', 'person:nosotros')).toMatchObject({ es: 'Nosotras estamos contentas.', en: 'We are happy.' });
  });
  test('tense changes are recognition only, with the time word gone', () => {
    const r = find('u02-1', 'tense:futuro')!;
    expect(r).toMatchObject({ mode: 'recognition', es: 'Comeré pescado.', question: 'When is this?' });
    expect(r.options![r.answer!]).toBe('In the future');
    expect(r.en).toBeUndefined();
  });
  test('object pronoun is recognition: exactly one option has the right gender and number', () => {
    const r = find('u02-3', 'pronoun')!;
    expect(r.mode).toBe('recognition');
    expect(r.options![r.answer!]).toBe('el periódico');
    for (const [i, o] of r.options!.entries()) if (i !== r.answer) expect(o).not.toMatch(/^el /);
  });
  test('negation with a noun subject is recognition (English not re-inflected)', () => {
    const r = find('u03-3', 'negate')!;
    expect(r.mode).toBe('recognition');
    expect(r.options![r.answer!]).toMatch(/^No/);
  });
  test('who-is-it never offers "you" for a 3rd-person form (usted)', () => {
    for (const r of all.filter((x) => x.id.includes('|who:'))) {
      const p = r.id.split('who:')[1];
      if (p === 'él/ella' || p === 'ellos') expect(r.options).not.toContain('you');
    }
  });
  test('production items check with the matcher against their own English', () => {
    const r = find('u01-5', 'person:yo')!;
    expect(checkItem(r, 'Trabajo en un banco').pass).toBe(true);
    expect(checkItem(r, 'Yo trabajo en un banco').pass).toBe(true);
    expect(checkItem(r, 'Ella trabaja en un banco').pass).toBe(false);
  });
  test('recognition items check by option index', () => {
    const r = find('u02-1', 'tense:futuro')!;
    expect(checkItem(r, r.answer!).pass).toBe(true);
    expect(checkItem(r, (r.answer! + 1) % 3).pass).toBe(false);
  });
  test('every production item round-trips: its own Spanish passes for its own English', () => {
    for (const r of all.filter((x) => x.mode === 'production')) {
      expect(matchTranslation(r.es, { es: r.es, en: r.en! }).pass, r.id).toBe(true);
    }
  });
  test('ids stable across seeds', () => {
    expect(BANK.flatMap((s) => recombinations(s, { seed: 77, bank: BANK })).map((r) => r.id)).toEqual(all.map((r) => r.id));
  });
});

describe('generator 5: lexemes', () => {
  const mesa: LexemeLike = { id: 'l:mesa', es: 'la mesa', en: 'the table' };
  const jugo: LexemeLike = { id: 'l:jugo', es: 'el jugo', en: 'the juice', peninsular: 'el zumo' };
  test('cue item: English → the chunk, article included', () => {
    const it = cueItem(mesa);
    expect(it).toMatchObject({ id: 'lexeme|l:mesa|cue', cue: 'the table', answer: 'la mesa' });
    expect(checkItem(it, 'la mesa').pass).toBe(true);
    expect(checkItem(it, 'el mesa').pass).toBe(false);
  });
  test('Peninsular word passes, flagged', () => {
    expect(checkItem(cueItem(jugo), 'el zumo')).toMatchObject({ pass: true, variant: 'peninsular' });
  });
  test('gap from a sentence, with the English and the gloss as cue', () => {
    const items = lexGapItems(mesa, BANK);
    expect(items.map((i) => i.gapped)).toEqual(['Pongo la ___.', 'La ___ es grande.']);
    expect(items[0].cue).toBe('(table)');
  });
  test('plural in the sentence: the cue says so', () => {
    const it = lexGapItems({ id: 'l:llave', es: 'la llave', en: 'the key' }, BANK).find((i) => i.sentenceId === 'u06-5')!;
    expect(it).toMatchObject({ answer: 'llaves', cue: '(key, more than one)' });
  });
  test('Peninsular gap answer passes, flagged', () => {
    const it = lexGapItem(jugo, byId('u04-6'))!;
    expect(checkItem(it, 'zumo')).toMatchObject({ pass: true, variant: 'peninsular' });
  });
  test.each<[LexemeLike, string]>([
    [{ id: 'l:allí', es: 'allí', en: 'there' }, 'u04-2'],                       // Allí / Ahí / Allá
    [{ id: 'l:también', es: 'también', en: 'also' }, 'u04-4'],                  // también / además
    [{ id: 'l:carro', es: 'el carro', en: 'the car' }, 'u04-5'],                // carro / auto / coche
  ])('interchangeable words are never gapped: %s', (lex, id) => {
    expect(lexGapItem(lex, byId(id))).toBeNull();
  });
  test('a word that occurs twice is never gapped', () => {
    expect(lexGapItem(mesa, S('La mesa grande y la mesa pequeña.', 'The big table and the small table.'))).toBeNull();
  });
  test('a word not in the sentence gives nothing', () => {
    expect(lexGapItem(mesa, byId('u01-1'))).toBeNull();
  });
  test('a verb lexeme defers to the ladder ambiguity check', () => {
    const comer: LexemeLike = { id: 'l:comer', es: 'comer', en: 'to eat' };
    expect(lexGapItem(comer, byId('u02-1'))).toMatchObject({ answer: 'comí', cue: '(comer)' });
    expect(lexGapItem(comer, S('Comía pescado.', 'I ate fish.'))).toBeNull();     // comí fits too
  });
});

describe('every generator: never vosotros, ids unique, answer present', () => {
  const lexes: LexemeLike[] = [
    { id: 'l:mesa', es: 'la mesa', en: 'the table' }, { id: 'l:llave', es: 'la llave', en: 'the key' },
    { id: 'l:jugo', es: 'el jugo', en: 'the juice', peninsular: 'el zumo' }, { id: 'l:comer', es: 'comer', en: 'to eat' },
  ];
  const items: Item[] = [
    ...BANK.flatMap((s) => structuredInputAll(s, { seed: 1 })),
    ...BANK.flatMap((s) => ladder(s, { seed: 1 })),
    ...BANK.flatMap((s) => translationItems(s, { bank: BANK })),
    ...BANK.flatMap((s) => recombinations(s, { seed: 1, bank: BANK })),
    ...lexes.map(cueItem),
    ...lexes.flatMap((l) => lexGapItems(l, BANK)),
  ];
  test('over 500 items from 50 sentences', () => {
    expect(items.length).toBeGreaterThan(500);
  });
  test('ids are globally unique', () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });
  test('no generated Spanish is vosotros', () => {
    const bad = items.flatMap((it) => producedSpanish(it).filter(hasVosotros).map((es) => `${it.id}: ${es}`));
    expect(bad).toEqual([]);
  });
  test('the model answer of every typed item passes its own check', () => {
    for (const it of items) {
      if (it.kind === 'readAndPick' || it.kind === 'choose') expect(checkItem(it, it.answer).pass).toBe(true);
      else if (it.kind === 'recombine') expect(checkItem(it, it.mode === 'recognition' ? it.answer! : it.es).pass, it.id).toBe(true);
      else if (it.kind === 'translate') expect(checkItem(it, it.answer).pass, it.id).toBe(true);
      else expect(checkItem(it, it.answer).pass, it.id).toBe(true);
    }
  });
  test('recognition options have exactly one right answer and no duplicates', () => {
    for (const it of items.filter((i): i is RecombineItem => i.kind === 'recombine' && i.mode === 'recognition')) {
      expect(new Set(it.options).size).toBe(it.options!.length);
    }
  });
});

describe('gustar & co. ("te" is indirect: le, never lo)', () => {
  const s = S('¿Te gusta el café?', 'Do you like coffee?');
  test.each<[string, boolean]>([['¿Te gusta el café?', true], ['¿Le gusta el café?', true], ['¿Les gusta el café?', true], ['¿Lo gusta el café?', false]])('"%s" → %s', (x, ok) => {
    expect(matchTranslation(x, s).pass).toBe(ok);
  });
});
