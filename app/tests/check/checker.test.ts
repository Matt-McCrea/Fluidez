// Ported from tools/test-checker.js, plus the port's new behaviour.
import { describe, expect, test } from 'vitest';
import { answerForms, checkExact, checkWriting, nounSet, type ConnectorClass, type Constraint } from '../../src/check';
import { loadLegacy } from '../engine/legacy';

const W = loadLegacy(['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'data/writing.js']);
const ctx = { connectors: (W.CONNECTORS ?? []) as ConnectorClass[], nouns: nounSet(W.VOCAB ?? []) };

const is = (spec: Constraint, sentence: string, expected: boolean) =>
  test(`${expected ? 'PASS' : 'FAIL'} ${spec.type} on "${sentence}"`, () => {
    expect(checkWriting({ constraints: [spec] }, sentence, ctx).results[0].pass).toBe(expected);
  });

describe('verbForm', () => {
  is({ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'yo' }, 'Ayer comí paella', true);
  is({ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'yo' }, 'Ayer como paella', false);
  is({ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'yo' }, 'Ayer comio paella', false);
  is({ type: 'verbForm', inf: 'hablar', tense: 'presente', person: 'nosotros' }, 'Hablamos español', true);
  test('accent near-miss fails with an accent hint', () => {
    const r = checkWriting({ constraints: [{ type: 'verbForm', inf: 'comer', tense: 'preterito', person: 'él/ella' }] }, 'Ella comio rápido');
    expect(r.results[0].pass).toBe(false);
    expect(r.results[0].detail).toMatch(/accent/i);
  });
  // new: multi-word forms, -se subjunctive, pre-2010 spelling
  is({ type: 'verbForm', inf: 'comer', tense: 'perfecto', person: 'yo' }, 'Hoy he comido bien', true);
  is({ type: 'verbForm', inf: 'levantarse', tense: 'presente', person: 'yo' }, 'Me levanto a las siete', true);
  is({ type: 'verbForm', inf: 'tener', tense: 'impsubj', person: 'yo' }, 'Si tuviese tiempo, iría', true);
  is({ type: 'verbForm', inf: 'reír', tense: 'preterito', person: 'él/ella' }, 'Ella se rio mucho', true);
  is({ type: 'verbForm', inf: 'reír', tense: 'preterito', person: 'él/ella' }, 'Ella se rió mucho', true);
});

describe('anyVerbInTense / compounds', () => {
  is({ type: 'anyVerbInTense', tense: 'preterito' }, 'Ayer fui al mercado y compré fruta', true);
  is({ type: 'anyVerbInTense', tense: 'preterito' }, 'Hoy voy al mercado', false);
  is({ type: 'anyVerbInTense', tense: 'presubj' }, 'Quiero que vengas mañana', true);
  is({ type: 'anyVerbInTense', tense: 'imperfecto' }, 'Cuando era niño vivía en Madrid', true);
  is({ type: 'anyVerbInTense', tense: 'perfecto' }, 'He comido mucho hoy', true);
  is({ type: 'anyVerbInTense', tense: 'perfecto' }, 'Como mucho hoy', false);
  // new: a compound counts as the tense its haber builds
  is({ type: 'anyVerbInTense', tense: 'plusc' }, 'He comido mucho hoy', false);
  is({ type: 'anyVerbInTense', tense: 'plusc' }, 'Ya había comido', true);
  is({ type: 'anyVerbInTense', tense: 'pluscsubj' }, 'Si hubiera sabido, no venía', true);
  is({ type: 'anyVerbInTense', tense: 'pluscsubj' }, 'Si hubiese sabido, no venía', true);
  is({ type: 'anyVerbInTense', tense: 'impsubj' }, 'Ojalá tuviese más tiempo', true);
  is({ type: 'distinctTenses', n: 2 }, 'He comido mucho', false);
  is({ type: 'subjunctiveAfter', trigger: 'si' }, 'Si hubiese sabido', true);
});

describe('person / infinitive / verbType', () => {
  is({ type: 'person', person: 'nosotros' }, 'Vivimos en España', true);
  is({ type: 'person', person: 'nosotros' }, 'Vivo en España', false);
  is({ type: 'infinitiveUsed', inf: 'querer' }, 'Quiero un café', true);
  is({ type: 'infinitiveUsed', inf: 'querer' }, 'Necesito un café', false);
  is({ type: 'verbType', ending: 'ir' }, 'Vivo aquí', true);
  is({ type: 'verbType', ending: 'ir' }, 'Hablo aquí', false);
});

describe('words and structure', () => {
  is({ type: 'containsWord', word: 'ayer' }, 'Ayer comí paella', true);
  is({ type: 'containsWord', word: 'todos los días' }, 'Estudio todos los dias', true);
  is({ type: 'containsAny', words: ['pero', 'aunque', 'porque'] }, 'Fui porque tenía hambre', true);
  is({ type: 'containsAny', words: ['pero', 'aunque'] }, 'Fui a casa', false);
  is({ type: 'minWords', n: 5 }, 'Uno dos tres', false);
  is({ type: 'minWords', n: 3 }, 'Uno dos tres', true);
  is({ type: 'question' }, '¿Qué hora es?', true);
  is({ type: 'question' }, 'Es la una', false);
  is({ type: 'negation' }, 'No quiero nada', true);
  is({ type: 'negation' }, 'Quiero todo', false);
});

describe('B2/C1 constraints', () => {
  is({ type: 'avoidsPerson', person: 'tú' }, 'Ella habla español', true);
  is({ type: 'avoidsPerson', person: 'tú' }, '¿Tú hablas español?', false);
  is({ type: 'avoidsPerson', person: 'tú' }, 'La recomiendo sin reservas', true);
  is({ type: 'cliticCluster' }, 'Se lo di ayer', true);
  is({ type: 'sePassive' }, 'Aquí se habla español', true);
  is({ type: 'connectorFrom', class: 'contraargumentativo', minLevel: 'B2' }, 'Es caro, pero lo compro', false);
  is({ type: 'minSentences', n: 2 }, 'Hola. Adiós.', true);
  test('unknown connector class is reported', () => {
    const r = checkWriting({ constraints: [{ type: 'connectorFrom', class: 'nope' }] }, 'x', ctx);
    expect(r.results[0]).toMatchObject({ pass: false, detail: 'unknown connector class' });
  });
});

describe('multi-constraint tasks', () => {
  test('all must pass', () => {
    const task = { constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' }, { type: 'person', person: 'yo' }, { type: 'containsWord', word: 'ayer' },
    ] as Constraint[] };
    expect(checkWriting(task, 'Ayer comí en un restaurante').allPass).toBe(true);
    expect(checkWriting(task, 'Hoy como en un restaurante').allPass).toBe(false);
  });
  test('paragraph', () => {
    const para = { constraints: [
      { type: 'anyVerbInTense', tense: 'preterito' }, { type: 'anyVerbInTense', tense: 'imperfecto' },
      { type: 'containsAny', words: ['porque', 'pero', 'y'] }, { type: 'minWords', n: 20 },
    ] as Constraint[] };
    const good = 'Ayer fui al mercado y compré fruta. Hacía mucho calor, pero estaba contento porque encontré todo lo que necesitaba para la cena de esta noche.';
    expect(checkWriting(para, good).allPass).toBe(true);
    expect(checkWriting(para, 'Hoy voy al mercado.').allPass).toBe(false);
  });
  test('an empty constraint list never passes', () => {
    expect(checkWriting({ constraints: [] }, 'Hola').allPass).toBe(false);
  });
});

describe('checkExact', () => {
  test('exact, near, list', () => {
    expect(checkExact('comí', 'comí').pass).toBe(true);
    expect(checkExact('comi', 'comí')).toEqual({ pass: false, near: true });
    expect(checkExact('  Comí ', ['fui', 'comí']).pass).toBe(true);
  });
  test('punctuation is forgiven, accents are not', () => {
    expect(checkExact('Ella no tiene hambre.', 'ella no tiene hambre').pass).toBe(true);
    expect(checkExact('¿Como estas?', '¿Cómo estás?')).toEqual({ pass: false, near: true });
  });
  test('lenient accents (phrase deck) pass a near miss and fold ñ', () => {
    expect(checkExact('no hay de que', 'no hay de qué', { accents: 'lenient' })).toEqual({ pass: true, near: true });
    expect(checkExact('hasta manana', 'hasta mañana', { accents: 'lenient' })).toEqual({ pass: true, near: true });
    expect(checkExact('hasta manana', 'hasta mañana').pass).toBe(false);
  });
  test('meaning glosses', () => {
    expect(checkExact('friend', 'the friend (m)', { meaning: true }).pass).toBe(true);
    expect(checkExact('outgoing', 'sociable, outgoing', { meaning: true }).pass).toBe(true);
  });
  test('pre-2010 accents are accepted (rió for rio)', () => {
    expect(checkExact('rió', 'rio')).toEqual({ pass: true, near: false });
    expect(checkExact('Se rió mucho.', 'se rio mucho')).toEqual({ pass: true, near: false });
    expect(checkExact('guió', 'guio').pass).toBe(true);
    // but the rule is only for forms RAE 2010 changed: dio was never dió
    expect(checkExact('dió', 'dio')).toEqual({ pass: false, near: true });
  });
  test('Peninsular variants are accepted and flagged', () => {
    const r = checkExact('el ordenador', 'la computadora', { peninsular: ['el ordenador'] });
    expect(r).toEqual({ pass: true, near: false, variant: 'peninsular' });
    expect(checkExact('la computadora', 'la computadora', { peninsular: ['el ordenador'] })).toEqual({ pass: true, near: false });
    expect(checkExact('el coche', 'el carro', { peninsular: ['el coche'] }).variant).toBe('peninsular');
    expect(checkExact('el ordenador', 'la computadora').pass).toBe(false);
    // `also` stays an unflagged alternative
    expect(checkExact('luego', 'entonces', { also: ['luego'] })).toEqual({ pass: true, near: false });
  });
});

describe('answerForms: the answer as a person would type it', () => {
  const forms = (b: string) => answerForms(b).map((x) => x.toLowerCase());
  test.each([
    ['quizá(s)', 'quizá'], ['quizá(s)', 'quizás'], ['apellido (surname)', 'apellido'], ['accent (tilde)', 'tilde'],
    ['(Le saluda) atentamente,', 'atentamente'], ['encantado / encantada', 'encantado'], ['encantado / encantada', 'encantada'],
    ['libre/ocupado', 'libre'], ['de repente / de pronto', 'de pronto'],
  ])('%s accepts %s', (b, x) => { expect(forms(b)).toContain(x.toLowerCase()); });
  test.each([
    ['quizá(s)', 's'], ['(Le saluda) atentamente,', 'le saluda'], ['¿Has aprendido/estudiado...?', 'estudiado...?'],
    ['¿Has aprendido/estudiado...?', '¿has aprendido'], ['ser bueno para/en', 'en'],
    ['Logros o fracasos ambiciosos/competitivos', 'competitivos'],
  ])('%s refuses %s', (b, x) => { expect(forms(b)).not.toContain(x.toLowerCase()); });
  test('plain answers derive nothing', () => {
    expect(answerForms('comí')).toHaveLength(1);
    expect(answerForms('habría hablado')).toHaveLength(1);
    expect(answerForms('')).toHaveLength(0);
  });
  test('forms reach checkExact only through `also`', () => {
    expect(checkExact('quizás', 'quizá(s)', { also: answerForms('quizá(s)') }).pass).toBe(true);
    expect(checkExact('quizás', 'quizá(s)').pass).toBe(false);
  });
});

describe('authored writing tasks are self-consistent', () => {
  const tasks = W.WRITING_TASKS ?? [];
  /* Old content that only passed through the old checker's compound bug: the
   * model writes "como si nunca hubiera comido" (pluscuamperfecto de
   * subjuntivo) for "use the imperfecto de subjuntivo", which passed because
   * the auxiliary hubiera was itself read as an imperfect subjunctive. */
  const KNOWN_BAD = new Set(['p-ramadan-comosi-religion']);
  test('every model answer satisfies its own constraints', () => {
    const bad: string[] = [];
    for (const t of tasks) for (const m of t.models ?? []) {
      if (KNOWN_BAD.has(t.id)) continue;
      const r = checkWriting(t as unknown as { constraints: Constraint[] }, m, ctx);
      if (!r.allPass) bad.push(`${t.id}: ${r.results.filter((x) => !x.pass).map((x) => x.label.replace(/<[^>]+>/g, '')).join('; ')}`);
    }
    expect(bad).toEqual([]);
  });
  test('the known-bad model still fails (so the exemption is not stale)', () => {
    const t = tasks.find((x) => x.id === 'p-ramadan-comosi-religion')!;
    expect(checkWriting(t as unknown as { constraints: Constraint[] }, t.models![0], ctx).allPass).toBe(false);
  });
});
