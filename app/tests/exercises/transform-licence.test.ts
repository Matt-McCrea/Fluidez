// A transform ("Say it happened yesterday", "Make it negative", "Say it about
// yourself") is only asked of a clause that is safely parsed, in a tense the
// learner has been taught. Anything else is refused, and the card falls back
// to a plain one. Swept over every row of the real bank (units 1 to 60): each
// transform it makes is linted for the ways the generator was seen to teach
// broken Spanish (docs/swarm-audit, C2 and LC1-001 to LC1-003).
import { describe, expect, test } from 'vitest';
import { BankSentence } from '../../src/content/schema';
import type { TenseKey } from '../../src/engine';
import { recombinations, transformItems } from '../../src/exercises';
import { namesOf } from '../../src/exercises/licence';
import { rows, sweep, taughtBy } from './transform-sweep';

const NAMES_IN_BANK = namesOf(rows);

describe('transforms over the whole bank', () => {
  test('there are rows, and the taught list grows with the units', () => {
    expect(rows.length).toBeGreaterThan(50_000);
    expect(taughtBy.get('u01')).toEqual(['presente']);
    expect(taughtBy.get('u60')!.length).toBeGreaterThan(10);
  });

  test('no transform is one of the known failure classes', { timeout: 300_000 }, () => {
    const { made, byOp, violations, byClass } = sweep({
      transforms: (row, taught) => transformItems(row, { taught, names: NAMES_IN_BANK }),
      recombine: (row, taught) => recombinations(row, { taught }),
    });
    console.log(`transform sweep: ${made} transforms made, ${violations.length} violations`, byOp, byClass);
    // SWEEP_DUMP=voseo prints every 40th violation of a class, to see what the lint caught
    const dump = process.env.SWEEP_DUMP;
    if (dump) console.log(violations.filter((v) => v.cls === dump).filter((_, i) => i % 40 === 0).slice(0, 60).map((v) => `${v.id}\n    ${v.source}\n => ${v.answer}`).join('\n'));
    const sample = Object.keys(byClass).map((cls) => violations.filter((v) => v.cls === cls).slice(0, 3).map((v) => `${cls}: ${v.source} => ${v.answer}`));
    expect(sample.flat()).toEqual([]);
    expect(made).toBeGreaterThan(1000);
  });
});

// ---------------------------------------------------------------- the reproductions

const S = (id: string, es: string, en: string): BankSentence => BankSentence.parse({ id, es, en });
const keys = (s: BankSentence, taught?: readonly TenseKey[]) => transformItems(s, { taught, names: NAMES_IN_BANK }).map((t) => t.id.split(':').slice(-2).join(':'));
const ALL: readonly TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional'];

describe('refusals, each from a real screen', () => {
  test.each<[string, string, string]>([
    ['u59 imperative with voseo and a second verb', 'Cuidá a tu hermano mientras yo salgo.', 'Take care of your brother while I go out.'],
    ['u60 poco already negates', 'Poco me sirvió, la verdad.', 'It was hardly any use, to be honest.'],
    ['u53 uno is not unir', 'Cada uno con su cuento: ese es el barrio.', 'Each to their own: that is the neighbourhood.'],
    ['u59 imperative inside', 'Contá cómo te fue con el abogado.', 'Tell me how it went with the lawyer.'],
    ['u60 raras veces', 'Raras veces llama Tomás a su mamá.', 'Tomás rarely calls his mum.'],
  ])('%s: no transform at all', (_n, es, en) => {
    expect(keys(S('x', es, en), ALL)).toEqual([]);
  });

  test('"Se" in a question about how a thing is said stays in the third person', () => {
    expect(keys(S('x', '¿Cómo se dice tinto en inglés?', 'How do you say tinto in English?'), ALL).filter((k) => k.startsWith('person'))).toEqual([]);
    expect(keys(S('x', 'Ustedes se conocen muy bien, ¿verdad?', 'You know each other very well, right?'), ALL)).toEqual([]);
  });

  test('a greeting or an interjection in front of the verb is not given a time word', () => {
    expect(keys(S('x', 'Perdón, soy de Cali.', "Sorry, I'm from Cali."), ALL).filter((k) => k.startsWith('tense'))).toEqual([]);
    expect(keys(S('x', 'Sí, somos de Ottawa.', "Yes, we're from Ottawa."), ALL).filter((k) => k.startsWith('tense'))).toEqual([]);
    expect(keys(S('x', 'Gracias, tengo razón.', "Thanks, I'm right."), ALL).filter((k) => k.startsWith('tense'))).toEqual([]);
  });

  test('plural names and a vocative are not re-personed', () => {
    expect(keys(S('x', 'Ellos son Ana y Pedro, de Cali.', 'They are Ana and Pedro, from Cali.'), ALL).filter((k) => k.startsWith('person'))).toEqual([]);
    expect(keys(S('x', '¿Eres tú, Tomás?', 'Is that you, Tomás?'), ALL).filter((k) => k.startsWith('person'))).toEqual([]);
  });

  test('Vale is a name, not a verb', () => {
    expect(keys(S('x', 'Hay un cliente, Vale.', "There's a customer, Vale."), ALL)).toEqual([]);
    expect(keys(S('x', 'Claro. Listo, Vale.', 'Sure. Done, Vale.'), ALL)).toEqual([]);
  });

  test('a sentence that opens with a common word keeps no stray capital, or is refused', () => {
    for (const [es, en] of [['Poco ganó Hernando.', 'Hernando earned little.'], ['Difícil es decirlo.', "It's hard to say."]] as const) {
      for (const t of transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK })) expect(t.answer, t.answer).not.toMatch(/^(Ayer|Antes|Mañana) \p{Lu}/u);
    }
  });

  test('the dot does not end up after a comma when the object pronoun replaces a phrase after it', () => {
    for (const t of transformItems(S('x', 'Poco me sirvió, la verdad.', 'It was hardly any use, to be honest.'), { taught: ALL })) expect(t.answer).not.toMatch(/,\./);
  });
});

describe('the opening mark of a question stays at the front of it', () => {
  const asked = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).flatMap((t) => [t.answer, ...t.accept]);
  test('a word put in front of the verb goes after the ¿, not before it', () => {
    for (const [es, en] of [
      ['Sin ánimo de preguntar de más, ¿van a vender la casa?', 'Not wanting to pry, are you going to sell the house?'],
      ['Perdón, ¿vives aquí?', 'Sorry, do you live here?'],
      ['Perdón, ¿Tomás trabaja aquí?', 'Sorry, does Tomás work here?'],
    ] as const) {
      for (const a of asked(es, en)) expect(a, a).not.toMatch(/\b(no|lo|la|los|las|le|les|me|te|se|nos|yo|tú|él|ella|nosotros|ellos)\s+[¿¡]/i);
    }
  });
  test('a question word inside the question is not negated around', () => {
    const neg = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).filter((t) => t.transform.op === 'negate');
    expect(neg('Perdón, señora López, ¿cómo se escribe su apellido?', 'Sorry, Mrs López, how do you spell your surname?')).toEqual([]);
    expect(neg('¿En qué calle vive Mariana?', 'What street does Mariana live on?')).toEqual([]);
  });
});

describe('a time phrase is taken out whole or not at all', () => {
  test('"toda la mañana" never leaves "toda la" behind', () => {
    const row = S('x', 'Un vendedor cantó los precios toda la mañana: ¡mango, fresa, naranja!', 'A vendor called out prices all morning: mango, strawberry, orange!');
    expect(recombinations(row, { taught: ALL }).filter((r) => /\b(toda|la|el) [¡¿]/.test(r.es))).toEqual([]);
  });
});

describe('a tense the learner has not been taught is never asked', () => {
  const eat = S('x', 'Como pescado.', 'I eat fish.');
  test('with only the present, there is no tense transform', () => {
    expect(keys(eat, ['presente']).some((k) => k.startsWith('tense'))).toBe(false);
  });
  test('each tense is licensed on its own', () => {
    expect(keys(eat, ['presente', 'preterito'])).toContain('tense:preterito');
    expect(keys(eat, ['presente', 'preterito'])).not.toContain('tense:futuro');
    expect(keys(eat, ['presente', 'futuro'])).toContain('tense:futuro');
    expect(keys(eat, ['presente', 'futuro'])).not.toContain('tense:preterito');
  });
  test('"how it used to be" needs the imperfect', () => {
    const be = S('x', 'Tengo dos hermanos.', 'I have two brothers.');
    expect(keys(be, ['presente', 'preterito'])).not.toContain('tense:imperfecto');
    expect(keys(be, ['presente', 'imperfecto'])).toContain('tense:imperfecto');
  });
  test('without a list nothing is limited (the old default)', () => {
    expect(keys(eat)).toContain('tense:preterito');
  });
  test('recombinations stay inside the list too', () => {
    const r = recombinations(eat, { taught: ['presente'] });
    expect(r.filter((x) => x.transform.op === 'tense' && 'to' in x.transform && x.transform.to !== 'presente')).toEqual([]);
  });
});
