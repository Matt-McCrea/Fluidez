// The wrong options of a choice card: near neighbours of the right one, never another way of saying it, never
// carrying a name or a tag the right one lacks (the audit's "63 of 74 solved by the only option with the name").
import { describe, expect, it } from 'vitest';
import { hasTag, nearest, properWords, sameMeaning, shapeOf, sharedNames, stripTag, type Pair } from '../../src/exercises/neighbours';

const NAMES = new Set(['tomás', 'rosa', 'bogotá']);
const row = (es: string, en: string, more: Partial<Pair> = {}): Pair => ({ es, en, ...more });

describe('tags', () => {
  it('drops a trailing tag, only the trailing one', () => {
    expect(stripTag('Are you Rosa? (polite)')).toBe('Are you Rosa?');
    expect(stripTag('I have (some) time')).toBe('I have (some) time');
    expect(stripTag('(polite)')).toBe('(polite)');
  });

  it('knows a text that ends in one', () => {
    expect(hasTag('Are you Rosa? (polite)')).toBe(true);
    expect(hasTag('Are you Rosa?')).toBe(false);
    expect(hasTag('(polite)')).toBe(false);
  });
});

describe('names', () => {
  it('reads the names of a text: capitals that are not just starting a sentence, and the names the bank knows', () => {
    expect(properWords('Rosa and Tomás are in Bogotá.', NAMES)).toEqual(['rosa', 'tomas', 'bogota']);
    expect(properWords('We met Ana in Japan.', NAMES)).toEqual(['ana', 'japan']);     // a name the bank does not know, mid-sentence
    expect(properWords('Tomás va a Cali.', NAMES)).toEqual(['tomas', 'cali']);       // a name the bank knows, opening the sentence
    expect(properWords('Where is it? I think I saw it.', NAMES)).toEqual([]);        // a capital that only starts a sentence, and I
    expect(properWords('The rosa is red', NAMES)).toEqual([]);
  });

  it('says which names the prompt gives away: the ones in both languages', () => {
    expect(sharedNames({ es: 'Me llamo Tomás.', en: 'My name is Tomás.' }, NAMES)).toEqual(['tomas']);
    expect(sharedNames({ es: '¿Supiste que Ana se va para Japón?', en: 'Did you hear that Ana is going to Japan?' }, NAMES)).toEqual(['ana']);
    expect(sharedNames({ es: 'Quiero un café.', en: 'I want a coffee.' }, NAMES)).toEqual([]);
  });
});

describe('what says the same thing', () => {
  const same = (a: Pair, b: Pair) => sameMeaning(a, b, NAMES);

  it('catches a text said twice, with or without its tag, article or contraction', () => {
    expect(same(row('Me llamo Tomás.', 'My name is Tomás.'), row('Soy Tomás.', "I'm Tomás."))).toBe(true);
    expect(same(row('¿Usted es Rosa?', 'Are you Rosa? (polite)'), row('¿Tú eres Rosa?', 'Are you Rosa? (to a friend)'))).toBe(true);
    expect(same(row('Tengo hambre.', "I'm hungry."), row('Tengo mucha hambre.', "I'm very hungry."))).toBe(true);
    expect(same(row('Quiero un café.', 'I want a coffee.'), row('Quiero el café.', 'I want the coffee.'))).toBe(true);
  });

  it('catches one authored as an alternative to the other', () => {
    expect(same(row('Nos vemos.', 'See you.', { accept: ['Hasta luego.'] }), row('Hasta luego.', 'Bye for now.'))).toBe(true);
    expect(same(row('Gracias.', 'Thanks.', { acceptEn: ['Thank you.'] }), row('Muchas gracias.', 'Thank you.'))).toBe(true);
  });

  it('counts one sense in common between two words as the same thing, and between two sentences as not', () => {
    const pasar = row('pasar', 'to pass; to happen'), darse = row('darse', 'to happen, to occur'), correr = row('correr', 'to run');
    expect(sameMeaning(darse, pasar, NAMES, true)).toBe(true);
    expect(sameMeaning(darse, correr, NAMES, true)).toBe(false);
    expect(sameMeaning(row('Hola.', 'Hi.'), row('Buenas.', 'Hey!'), NAMES)).toBe(true);
    expect(sameMeaning(row('Hola.', 'Hi.'), row('Chao.', 'Bye.'), NAMES)).toBe(false);
  });

  it('lets two different things stand together', () => {
    expect(same(row('Quiero un café.', 'I want a coffee.'), row('Quiero un té.', 'I want a tea.'))).toBe(false);
    expect(same(row('Soy Tomás.', "I'm Tomás."), row('Tomás está cansado.', 'Tomás is tired.'))).toBe(false);
    expect(same(row('¿Dónde está el baño?', 'Where is the bathroom?'), row('¿Dónde está la estación?', 'Where is the station?'))).toBe(false);
  });
});

describe('the nearest', () => {
  const pool = [
    row('Soy Tomás.', "I'm Tomás."),
    row('Tomás está cansado.', 'Tomás is tired.'),
    row('Tomás está en casa.', 'Tomás is at home.'),
    row('Tomás bebe agua.', 'Tomás drinks water.'),
    row('Tomás tiene un gato.', 'Tomás has a cat.'),
    row('Rosa está cansada.', 'Rosa is tired.'),
    row('Estoy cansado.', "I'm tired."),
    row('¿Tomás está en casa?', 'Is Tomás at home?'),
    row('Tomás y Rosa trabajan juntos en el café del barrio todos los días de la semana.', 'Tomás and Rosa work together at the neighbourhood café every day of the week.'),
    row('Tomás vive en un apartamento pequeño.', 'Tomás lives in a small apartment.'),
  ];
  const right = row('Me llamo Tomás.', 'My name is Tomás.');
  const near = (n: number, side: 'es' | 'en', key = 'k') => nearest(right, pool, { side, n, key, names: NAMES, pair: (p) => p });

  it('takes the same names, the same kind of sentence and about the same length, and no other way of saying it', () => {
    const got = near(3, 'en');
    expect(got.length).toBe(3);
    for (const g of got) {
      expect(properWords(g.en, NAMES)).toEqual(['tomas']);
      expect(shapeOf(g.en)).toBe('s');
      expect(Math.abs(g.en.length - right.en.length)).toBeLessThanOrEqual(8);
      expect(sameMeaning(right, g, NAMES)).toBe(false);
    }
    expect(got.map((g) => g.en)).not.toContain("I'm Tomás.");           // the same thing said another way
    expect(got.map((g) => g.en)).not.toContain('Rosa is tired.');       // another name
    expect(got.map((g) => g.en)).not.toContain("I'm tired.");           // no name at all
    expect(got.map((g) => g.en)).not.toContain('Is Tomás at home?');    // a question beside a statement
  });

  it('has a tag on a wrong option when the right one has one, and none when it has none', () => {
    const tagged = [
      row('¿Usted es Rosa?', 'Are you Rosa? (polite)'),
      row('¿Usted es de Cali?', 'Are you from Cali? (polite)'),
      row('¿Tú eres de Cali?', 'Are you from Cali? (to a friend)'),
      row('¿Es usted el nieto?', 'Are you the grandson? (polite)'),
      row('¿Está cansado, Tomás?', 'Are you tired, Tomás? (to a man)'),
      row('Rosa es de Cali.', 'Rosa is from Cali.'),
      row('Rosa es la dueña.', 'Rosa is the owner.'),
      row('Rosa es su abuela.', 'Rosa is his grandmother.'),
    ];
    const ask = (r: Pair, side: 'es' | 'en') => nearest(r, tagged, { side, n: 2, key: 'k', names: NAMES, pair: (p) => p });
    for (const g of ask(tagged[0], 'en')) expect(hasTag(g.en)).toBe(true);
    for (const g of ask(tagged[5], 'en')) expect(hasTag(g.en)).toBe(false);
  });

  it('is the same card for the same key', () => {
    expect(near(2, 'es', 'a')).toEqual(near(2, 'es', 'a'));
  });

  it('gives fewer when there are not enough, and never pads with what does not fit', () => {
    const got = near(8, 'en');
    expect(got.length).toBeLessThan(8);
    expect(got.map((g) => g.en)).not.toContain(pool[8].en);             // far too long
  });
});
