import { describe, expect, it } from 'vitest';
import {
  OptionTally, dominantLength, genderDisagreement, isTypeable, listShare, mcqAnswerability, shortAnswerability, optionGender, questionSubject, accentLint, dialectLint, clozeAnswer, hasDash,
} from '../../../tools/gate/checks';
import { exactDuplicates, frameOveruse, nearDuplicates } from '../../../tools/gate/corpus';

describe('options bias', () => {
  const mk = (rightIsLongest: boolean) => ({ options: rightIsLongest ? ['a la playa', 'al mar', 'al río'] : ['al mar', 'a la playa', 'al río'], answer: rightIsLongest ? 0 : 2 });
  it('is an error when the longest option is right far above chance', () => {
    const t = new OptionTally();
    for (let i = 0; i < 25; i++) t.add('g', mk(true));
    const f = t.findings();
    expect(f.some((x) => x.severity === 'error' && /longest/.test(x.problem))).toBe(true);
  });
  it('is clean at chance and ignores small groups', () => {
    const t = new OptionTally();
    for (let i = 0; i < 30; i++) t.add('g', { options: ['aaaa', 'bbbbbb', 'cc'], answer: i % 3 });
    expect(t.findings().filter((x) => x.severity === 'error')).toEqual([]);
    const s = new OptionTally();
    for (let i = 0; i < 5; i++) s.add('small', mk(true));
    expect(s.findings()).toEqual([]);
  });
  it('flags a correct option 1.5 times the length of every other', () => {
    expect(dominantLength(['una casa muy grande', 'casa', 'perro'], 0)).toBe(true);
    expect(dominantLength(['una casa', 'casa', 'perros'], 0)).toBe(false);
  });
});

describe('list-passage', () => {
  it('measures the share of tokens inside enumerations', () => {
    const list = 'En la tienda compro manzanas, peras, uvas y naranjas. También lleva pan, queso, jamón y leche.';
    expect(listShare(list).share).toBeGreaterThan(0.35);
  });
  it('leaves narrative alone', () => {
    const prose = 'Ayer llegué tarde a la oficina porque perdí el autobús. Mi jefe no dijo nada, pero me miró con mala cara.';
    expect(listShare(prose).share).toBeLessThan(0.2);
  });
  it('does not count two-item pairs', () => {
    expect(listShare('Compro pan y leche.').enumTokens).toBe(0);
  });
});

describe('answerability', () => {
  const text = 'Ana vive en Valencia. Trabaja en un hospital y llega a las ocho.';
  it('flags the correct option as the only verbatim one', () => {
    const f = mcqAnswerability(text, { q: '¿Dónde trabaja Ana?', options: ['En un hospital', 'En una escuela', 'En un banco'], answer: 0 });
    expect(f.map((x) => x.code)).toContain('only-verbatim');
  });
  it('flags a question none of whose options appear in the text', () => {
    const f = mcqAnswerability(text, { q: '¿Qué come?', options: ['Pescado fresco', 'Verduras', 'Pasta'], answer: 1 });
    expect(f.map((x) => x.code)).toContain('none-in-text');
  });
  it('is quiet when several options come from the text', () => {
    const f = mcqAnswerability(text, { q: '¿Dónde vive Ana?', options: ['En Valencia', 'En un hospital', 'A las ocho'], answer: 0 });
    expect(f).toEqual([]);
  });
  it('checks short answers against the text', () => {
    expect(shortAnswerability(text, ['Valencia', 'valencia'])).toBe(true);
    expect(shortAnswerability(text, ['Madrid'])).toBe(false);
  });
});

describe('gender agreement', () => {
  it('knows endings', () => {
    expect(optionGender('pequeño')).toBe('m');
    expect(optionGender('pequeña')).toBe('f');
    expect(optionGender('grande')).toBeNull();
    expect(optionGender('Madrid')).toBeNull();
    expect(optionGender('Muy buena')).toBe('f');
  });
  it('finds the subject of a description question', () => {
    expect(questionSubject('¿Cómo es la casa?')).toEqual({ word: 'la casa', gender: 'f' });
    expect(questionSubject('¿Cómo es Ana?')?.gender).toBe('f');
    expect(questionSubject('¿Dónde vive Ana?')).toBeNull();
  });
  it('flags a key that disagrees with the noun', () => {
    expect(genderDisagreement({ q: '¿Cómo es la casa?', options: ['pequeño', 'viejo', 'grande'], answer: 0 })).toMatch(/masculine/);
  });
  it('flags options none of which agree', () => {
    expect(genderDisagreement({ q: '¿Cómo es la casa?', options: ['pequeño', 'viejo', 'moderno'], answer: 2 })).toBeTruthy();
  });
  it('passes agreeing options, and uses the lexicon over the article', () => {
    expect(genderDisagreement({ q: '¿Cómo es la casa?', options: ['pequeña', 'viejo', 'grande'], answer: 0 })).toBeNull();
    expect(genderDisagreement({ q: '¿Cómo es el problema?', options: ['difícil', 'fácil', 'raro'], answer: 0 })).toBeNull();
    expect(genderDisagreement({ q: '¿Cómo es el mapa?', options: ['pequeña', 'grande', 'viejo'], answer: 0 }, new Map([['mapa', 'm']]))).toMatch(/feminine/);
  });
});

describe('ported checks', () => {
  it('dashes', () => {
    expect(hasDash('—Hola')).toBe(true);
    expect(hasDash('a - b')).toBe(true);
    expect(hasDash('well-known')).toBe(false);
  });
  it('accent lint finds a dropped accent and a missing ¿', () => {
    expect(accentLint('Ayer comi paella.').some((x) => x.severity === 'error' && x.fix.includes('comí'))).toBe(true);
    expect(accentLint('Cómo te llamas tú?').some((x) => /¿/.test(x.problem))).toBe(true);
    expect(accentLint('¿Cómo estás? Ayer comí paella.')).toEqual([]);
  });
  it('dialect finds vosotros, voseo and Peninsular words', () => {
    const rules = dialectLint('Vosotros habláis de vuestro coche.').map((h) => h.rule);
    expect(rules).toContain('vosotros');
    expect(rules).toContain('lexicon');
  });
  it('typeable', () => {
    expect(isTypeable('tengo')).toBe(true);
    expect(isTypeable('1965')).toBe(true);
    expect(isTypeable('...')).toBe(false);
    expect(isTypeable('___')).toBe(false);
    expect(clozeAnswer({ inf: 'comer', tense: 'preterito', person: 'yo' })).toBe('comí');
  });
  it('dupes and frames', () => {
    const a = { file: 'f', path: 'a', text: 'Ayer fui al mercado con mi madre y compramos frutas y verduras frescas para la cena.' };
    const b = { file: 'f', path: 'b', text: 'Ayer fui al mercado con mi madre y compramos frutas y verduras frescas para la comida.' };
    const c = { file: 'f', path: 'c', text: 'El domingo llueve y nadie sale de casa porque hace mucho frío en toda la ciudad.' };
    expect(nearDuplicates([a, b, c]).length).toBe(1);
    expect(exactDuplicates([a, { ...a, path: 'a2' }]).length).toBe(1);
    const texts = Array.from({ length: 12 }, (_, i) => (i < 5 ? `Hoy voy a comprar pan número ${i}.` : `Mi hermano estudia lección ${i} en casa.`));
    expect(frameOveruse('g', 'f', texts).some((f) => /voy a/.test(f.problem))).toBe(true);
  });
});
