// Dialect lint (neutral LatAm Spanish) and accent lint.
import { describe, expect, test } from 'vitest';
import { accentLint, dialectLint, registerNames, DIALECT_LEXICON } from '../../src/engine/tagger';

const rules = (s: string) => dialectLint(s);
const flagged = (s: string) => rules(s).map((f) => `${f.severity}:${f.rule}:${f.word.toLowerCase()}`);

describe('dialect: vosotros and voseo', () => {
  test.each([
    ['¿Habláis español?', 'habláis', 'hablan'],
    ['Vosotros tenéis razón.', 'tenéis', 'tienen'],
    ['Sois muy amables.', 'sois', 'son'],
    ['Venid mañana.', 'venid', 'vengan'],
  ])('%s', (s, word, fix) => {
    const f = rules(s).find((x) => x.word.toLowerCase() === word);
    expect(f?.severity).toBe('error');
    expect(f?.fix).toContain(fix);
  });
  test('pronouns and possessives', () => {
    expect(flagged('Vosotros sois de aquí.')).toContain('error:vosotros:vosotros');
    expect(flagged('Os lo dije.')).toContain('error:vosotros:os');
    expect(flagged('Es vuestra casa.')).toContain('error:vosotros:vuestra');
  });
  test('voseo', () => {
    const f = rules('Vos tenés razón.');
    expect(f.some((x) => x.rule === 'voseo' && x.word === 'tenés' && /tienes/.test(x.fix))).toBe(true);
    expect(f.some((x) => x.word === 'Vos')).toBe(true);
    expect(rules('Sos muy bueno.').some((x) => x.rule === 'voseo')).toBe(true);
  });
  test('tú and ustedes are clean', () => {
    expect(rules('¿Ustedes hablan español? Tú tienes razón.')).toEqual([]);
  });
  test('sed (thirst) is not a vosotros command', () => {
    expect(rules('Tengo mucha sed.')).toEqual([]);
  });
});

describe('dialect: lexicon', () => {
  test('the list is substantial and every entry has a fix', () => {
    expect(DIALECT_LEXICON.length).toBeGreaterThanOrEqual(80);
    for (const e of DIALECT_LEXICON) expect(e.fix.length).toBeGreaterThan(2);
  });
  test.each([
    ['Mi coche es rojo.', 'coche', 'carro'],
    ['Compré un ordenador nuevo.', 'ordenador', 'computador'],
    ['Perdí el móvil.', 'móvil', 'celular'],
    ['Quiero un zumo de naranja.', 'zumo', 'jugo'],
    ['Cogí el autobús.', 'cogí', 'tomar'],
    ['¡Qué guay!', 'guay', 'chévere'],
    ['Vale, nos vemos mañana.', 'vale', 'listo'],
    ['Compramos patatas.', 'patatas', 'papa'],
    ['Compré un billete de avión.', 'billete', 'tiquete'],
  ])('%s', (s, word, fix) => {
    const f = rules(s).find((x) => x.word.toLowerCase().startsWith(word));
    expect(f, JSON.stringify(rules(s))).toBeDefined();
    expect(f!.fix).toContain(fix);
  });
  test('warnings, not errors, for words understood across LatAm', () => {
    expect(flagged('Conduzco al trabajo.')).toContain('warning:lexicon:conduzco');
    expect(flagged('Tomé el autobús.')).toContain('warning:lexicon:autobús');
  });
  test('sense-restricted words', () => {
    expect(rules('¿Cuánto vale la camisa?')).toEqual([]);                 // vale = it costs
    expect(rules('Vivo en el primer piso.')).toEqual([]);                 // piso = floor
    expect(rules('Busco un piso en Madrid.').length).toBe(1);             // piso = flat
    expect(rules('Mi tío vive en Cali.')).toEqual([]);                    // tío = uncle
    expect(rules('¡Tío, qué fuerte!').some((x) => x.word.toLowerCase() === 'tío')).toBe(true);
    expect(rules('Tengo un billete de veinte mil pesos.')).toEqual([]);   // billete = banknote
    expect(rules('¿Me pones un café?').some((x) => /regala|da/.test(x.fix))).toBe(true);
  });
  test('the cast member Vale is a name', () => {
    registerNames(['vale']);
    expect(rules('Querida Vale: te escribo desde Cali.')).toEqual([]);
    expect(rules('Vale cocina muy bien.')).toEqual([]);
  });
});

describe('dialect: perfecto for today', () => {
  test('warns with the preterite as the fix', () => {
    const f = rules('Hoy he ido al mercado.').find((x) => x.rule === 'perfecto-hoy');
    expect(f?.severity).toBe('warning');
    expect(f?.fix).toContain('fui');
  });
  test('experience perfect is fine', () => {
    expect(rules('He vivido aquí tres años.')).toEqual([]);
    expect(rules('¿Has estado en Cartagena?')).toEqual([]);
  });
});

describe('accent lint', () => {
  const fixes = (s: string) => accentLint(s).map((f) => f.fix);
  test.each([
    ['Ella comio rápido.', 'comió'],
    ['Yo tambien quiero.', 'también'],
    ['¿Como estás?', 'cómo'],
    ['¿Donde vives?', 'dónde'],
    ['¿De donde eres?', 'dónde'],
    ['Mi mamá esta cansada.', 'está'],
    ['La sopa esta en la mesa.', 'está'],
    ['Esto es para el.', 'él'],
    ['Es para mi.', 'mí'],
    ['Tu tienes razón.', 'tú'],
    ['Yo se la respuesta.', 'sé'],
    ['Levantate temprano.', 'levántate'],
    ['Estoy diciendote la verdad.', 'diciéndote'],
    ['La cancion es bonita.', 'canción'],
  ])('%s -> %s', (s, fix) => {
    expect(fixes(s).join(' | ')).toContain(fix);
  });
  test.each([
    'Esta casa es bonita.', 'Le deseo lo mejor en esta nueva etapa.', 'El libro es para el niño.', 'Tu casa es grande.',
    'No se puede fumar aquí.', 'Me llamo Tomás.', '¡Que te mejores!', 'Hablo español.', 'Él habló ayer.', 'Publico un libro cada año.',
  ])('clean: %s', (s) => {
    expect(accentLint(s).filter((f) => f.severity === 'error')).toEqual([]);
  });
  test('question without ¿', () => {
    expect(accentLint('Cómo estás?').some((f) => /¿/.test(f.problem))).toBe(true);
  });
});
