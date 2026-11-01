// C7: a hint says only what the checker can prove. A verb swap is not
// spelling, a missing mood is not "when does it happen?", and a word is not
// "extra" or "not the word here" unless that is the whole difference.
import { describe, expect, test } from 'vitest';
import { HINT_TEXT, matchTranslation } from '../../src/check/translate';
import { WORD_HINT, wordHint } from '../../src/check/wordhint';

type Row = [es: string, en: string, input: string];
const hintFor = (es: string, en: string, input: string) => {
  const r = matchTranslation(input, { es, en });
  expect(r.pass, `"${input}" should not pass: ${JSON.stringify(r)}`).toBe(false);
  return r;
};

/** Phrases a hint may only use when the diff proves them. */
const OVERCLAIM = /isn't the word here|check the meaning|Start with the verb|who is doing it\?.*gustar/;

describe('verb swaps are named for what they are', () => {
  test.each<Row>([
    ['Estoy aburrido.', "I'm bored.", 'Soy aburrido.'],
    ['El café está en La Candelaria.', 'The café is in La Candelaria.', 'El café es en La Candelaria.'],
    ['La fiesta es en mi casa.', 'The party is at my place.', 'La fiesta está en mi casa.'],
  ])('ser or estar: %s / "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('ser-estar');
    expect(r.hint).not.toMatch(/right now|what something is|permanent|temporary/i);
  });

  test.each<Row>([
    ['Está lloviendo.', "It's raining.", 'Es lloviendo.'],
    ['Estaba lloviendo.', 'It was raining.', 'Era lloviendo.'],
  ])('an -ando form goes with estar: "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r).toMatchObject({ hintKind: 'ser-estar' });
    expect(r.hint).toMatch(/estar/);
    expect(r.hint).toMatch(/ando|iendo/);
  });

  test('por for para', () => {
    expect(hintFor('Este regalo es para ti.', 'This present is for you.', 'Este regalo es por ti.')).toMatchObject({ hintKind: 'por-para' });
  });

  test.each<Row>([
    ['Voy a comer.', "I'm going to eat.", 'Voy a como.'],
    ['Voy a comer.', "I'm going to eat.", 'Voy a comiendo.'],
    ['Nadar es bueno.', 'Swimming is good.', 'Nadando es bueno.'],
    ['Después de comer, salí.', 'After eating, I left.', 'Después de comiendo, salí.'],
    ['Me gusta cocinar.', 'I like cooking.', 'Me gusta cocinando.'],
  ])('a form that is not the dictionary form: "%s" for "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('nonfinite');
    expect(r.hint).toMatch(/dictionary form/);
  });

  test.each<Row>([
    ['No hablo francés.', "I don't speak French.", 'Yo no hablar francés.'],
    ['¿Hablas español?', 'Do you speak Spanish?', '¿Hablar español?'],
  ])('a dictionary form where an ending is needed: "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('nonfinite');
    expect(r.hint).toMatch(/ending/);
  });

  test('a participle is asked for by its ending', () => {
    const r = hintFor('Es un libro aburrido.', 'It is a boring book.', 'Es un libro aburriendo.');
    expect(r.hintKind).toBe('nonfinite');
    expect(r.hint).toMatch(/ado|ido/);
  });

  test.each<Row>([
    ['Quiero que vengas.', 'I want you to come.', 'Quiero que vienes.'],
    ['Espero que no llueva.', "I hope it doesn't rain.", 'Espero que no llueve.'],
    ['Dudo que sepa.', 'I doubt he knows.', 'Dudo que sabe.'],
    ['No creo que venga.', "I don't think he's coming.", 'No creo que viene.'],
    ['Me dice que viene mañana.', 'He tells me he is coming tomorrow.', 'Me dice que venga mañana.'],
  ])('mood: %s / "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('mood');
    expect(r.hint).not.toMatch(/when does it happen|who is doing it|spelling/);
  });

  test.each<Row>([
    ['Llovía cuando llegué.', 'It was raining when I arrived.', 'Llovió cuando llegué.'],
    ['Ayer fui al banco.', 'Yesterday I went to the bank.', 'Ayer iba al banco.'],
    ['Cuando era niño, vivía en Toronto.', 'When I was a child, I lived in Toronto.', 'Cuando era niño, viví en Toronto.'],
  ])('aspect: %s / "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('aspect');
    expect(r.hint).toBe(HINT_TEXT.aspect);
    expect(r.hint).not.toMatch(/when does it happen/);
  });

  test('a real tense difference still says when', () => {
    const r = hintFor('Ayer comí pescado.', 'Yesterday I ate fish.', 'Ayer como pescado.');
    expect(r).toMatchObject({ hintKind: 'verb-ending' });
    expect(r.hint).toMatch(/when does it happen/);
  });

  test('a real person difference still says who', () => {
    const r = hintFor('Ellos comen pescado.', 'They eat fish.', 'Ellos comemos pescado.');
    expect(r.hint).toMatch(/who is doing it/);
  });

  test('si does not take the would form', () => {
    const r = hintFor('Si tuviera tiempo, iría.', 'If I had time, I would go.', 'Si tendría tiempo, iría.');
    expect(r.hintKind).toBe('mood');
    expect(r.hint).toMatch(/"si"/);
  });

  test.each<Row>([
    ['Me gustan los perros.', 'I like dogs.', 'Me gusta los perros.'],
    ['Me gusta el café.', 'I like coffee.', 'Me gustan el café.'],
  ])('gustar agrees with the thing liked: "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('experiencer-agree');
    expect(r.hint).not.toMatch(/who is doing it/);
  });
});

describe('what cannot be proved is said modestly', () => {
  test.each<Row>([
    ['¿Dónde está el baño, Vale?', "Where's the bathroom, Vale?", '¿Dónde queda el baño, Vale?'],
    ['Tengo treinta años.', "I'm thirty years old.", 'Soy treinta años.'],
    ['Tengo hambre.', "I'm hungry.", 'Estoy hambre.'],
    ['Fui a la tienda a comprar leche.', 'I went to the store to buy milk.', 'Fui a la tienda por comprar leche.'],
    ['Había un accidente.', 'There was an accident.', 'Hay un accidente.'],
    ['Hola, me llamo Ana y soy de Cali.', "Hi, my name's Ana and I'm from Cali.", 'Hola, me llamo Ana y soy de Toronto.'],
  ])('one different word: %s / "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hint).not.toMatch(OVERCLAIM);
    expect(r.hint).not.toMatch(/spelling/);
    expect(['wrong-word', 'differs', 'verb-ending', 'aspect', 'ser-estar']).toContain(r.hintKind);
  });

  test('a different word says what the typed word was, not that it is wrong', () => {
    const r = hintFor('¿Dónde está el baño, Vale?', "Where's the bathroom, Vale?", '¿Dónde queda el baño, Vale?');
    expect(r.hintKind).toBe('wrong-word');
    expect(r.hint).toContain('"queda"');
  });

  test('a stray word beside a different word is not called "an extra word"', () => {
    const r = hintFor('Estoy buscando mi llave.', "I'm looking for my key.", 'Estoy buscando para mi llavero.');
    expect(r.hintKind).not.toBe('extra-word');
    expect(r.hint).not.toMatch(/missing|extra/);
  });

  test('a word is named as missing or extra when that is the whole difference', () => {
    expect(hintFor('Estoy buscando mi llave.', "I'm looking for my key.", 'Estoy buscando para mi llave.')).toMatchObject({ hintKind: 'extra-word' });
    expect(hintFor('Ella tiene veinte años.', 'She is twenty years old.', 'Ella tiene veinte.')).toMatchObject({ hintKind: 'missing-word' });
  });

  test('a mixed difference points at a place and nothing more', () => {
    const r = hintFor('Estoy buscando mi llave.', "I'm looking for my key.", 'Estoy buscando para mi llavero nuevo.');
    expect(r.hintKind).toBe('differs');
    expect(r.hint).toMatch(/^Look again at "[^"]+" and the words around it\.$/);
  });

  test('a fragment is never told to "start with" a word', () => {
    for (const input of ['Hola', 'no sé', 'Hola, me llamo Ana']) {
      const r = hintFor('Hola, me llamo Ana y soy de Cali, pero vivo en Bogotá.', "Hi, my name's Ana and I'm from Cali, but I live in Bogotá.", input);
      expect(r.hintKind).toBe('fragment');
      expect(r.hint).not.toMatch(/start with/i);
    }
  });

  test('a different number says so', () => {
    const r = hintFor('Tengo cinco hermanos.', 'I have five brothers.', 'Tengo seis hermanos.');
    expect(r.hintKind).toBe('number');
    expect(r.hint).not.toMatch(/xnum|isn't the word/);
  });

  test('an article hint names a noun only when the noun is the same', () => {
    const same = hintFor('Es la casa.', 'It is the house.', 'Es el casa.');
    expect(same).toMatchObject({ hintKind: 'article' });
    expect(same.hint).toMatch(/casa is feminine/);
    const other = hintFor('Necesito encontrar la salida.', 'I need to find the exit.', 'Necesito encontrar el éxito.');
    expect(other.hintKind).not.toBe('article');
    expect(other.hint).not.toMatch(/salida|feminine/);
  });
});

describe('small things that were reported wrongly', () => {
  test.each<Row>([
    ['Tú sabías la respuesta.', 'You knew the answer.', 'tu sabias la respuesta'],
    ['Él sabía la respuesta.', 'He knew the answer.', 'el sabia la respuesta'],
    ['Tú vives aquí.', 'You live here.', 'tu vives aqui'],
  ])('tu for tú, el for él is an accent, not an extra word: "%s"', (es, en, input) => {
    const r = matchTranslation(input, { es, en });
    expect(r).toMatchObject({ pass: false, near: true, hintKind: 'accents' });
  });

  test.each<Row>([
    ['Ayer fui al centro.', 'Yesterday I went downtown.', 'Ayer fui a el centro.'],
    ['Es la señora del café.', 'She is the lady from the café.', 'Es la señora de el café.'],
  ])('a el and de el join into one word: "%s"', (es, en, input) => {
    const r = hintFor(es, en, input);
    expect(r.hintKind).toBe('contraction');
    expect(r.hint).not.toMatch(/extra word/);
  });
});

describe('a gap with one typed word', () => {
  test.each<[typed: string, answer: string, kind: string]>([
    ['soy', 'estoy', 'ser-estar'],
    ['es', 'está', 'ser-estar'],
    ['estoy', 'soy', 'ser-estar'],
    ['eres', 'estás', 'ser-estar'],
    ['por', 'para', 'por-para'],
    ['para', 'por', 'por-para'],
    ['fue', 'era', 'aspect'],
    ['fui', 'iba', 'aspect'],
    ['vas', 'vayas', 'mood'],
    ['venga', 'viene', 'mood'],
    ['como', 'comer', 'nonfinite'],
    ['comer', 'como', 'nonfinite'],
    ['un', 'una', 'article'],
    ['el', 'la', 'article'],
    ['lo', 'le', 'pronoun'],
  ])('%s for %s is %s', (typed, answer, kind) => {
    const w = wordHint(typed, [answer]);
    expect(w, `${typed} for ${answer}`).toBeDefined();
    expect(w!.kind).toBe(kind);
    expect(w!.kind).not.toBe('spelling');
  });

  test('mi for mis is agreement, not spelling', () => {
    expect(wordHint('mi', ['mis'])).toMatchObject({ kind: 'agreement' });
  });

  test('gustar gaps do not ask who is doing it', () => {
    const w = wordHint('gusta', ['gustan']);
    expect(w).toMatchObject({ kind: 'experiencer-agree' });
  });

  test('the old person and tense hints stand for plain verbs', () => {
    expect(wordHint('comen', ['comemos'])?.hint).toBe(WORD_HINT.person);
    expect(wordHint('comimos', ['comemos'])?.hint).toBe(WORD_HINT.tense);
  });

  test('a real typo is still a typo', () => {
    expect(wordHint('comenos', ['comemos'])?.kind).toBe('spelling');
    expect(wordHint('pescdo', ['pescado'])?.kind).toBe('spelling');
  });
});

describe('every hint obeys the copy rules', () => {
  const sample: Row[] = [
    ['Estoy aburrido.', "I'm bored.", 'Soy aburrido.'],
    ['Quiero que vengas.', 'I want you to come.', 'Quiero que vienes.'],
    ['Llovía cuando llegué.', 'It was raining.', 'Llovió cuando llegué.'],
    ['Voy a comer.', "I'm going to eat.", 'Voy a como.'],
    ['Me gustan los perros.', 'I like dogs.', 'Me gusta los perros.'],
    ['Ayer fui al centro.', 'Yesterday I went downtown.', 'Ayer fui a el centro.'],
    ['Estoy buscando mi llave.', "I'm looking for my key.", 'Estoy buscando para mi llavero nuevo.'],
    ['Hola, me llamo Ana y soy de Cali, pero vivo en Bogotá.', "Hi, I'm Ana.", 'Hola'],
    ['Tengo cinco hermanos.', 'I have five brothers.', 'Tengo seis hermanos.'],
  ];

  test('no dashes, no markup, no placeholder', () => {
    const texts = [...Object.values(HINT_TEXT), ...Object.values(WORD_HINT), ...sample.map(([es, en, input]) => matchTranslation(input, { es, en }).hint ?? '')];
    for (const t of texts) {
      expect(t, t).not.toMatch(/[—–]|\s-\s|\*|xnum/);
    }
  });
});
