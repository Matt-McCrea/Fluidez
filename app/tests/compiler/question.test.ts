// What counts as a question row: one the learner can answer for themselves.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { isQuestionRow } from '../../src/compiler/content';

const q = (es: string, kind?: 'statement' | 'question' | 'dialogue') => isQuestionRow({ es, kind });

describe('isQuestionRow', () => {
  test('a reply that merely contains a question is not a question', () => {
    expect(q('¿De Medellín? Vale también es de Medellín.')).toBe(false);
    expect(q('Vale: Nada.')).toBe(false);
    expect(q('Sí, con ella. Dígame.')).toBe(false);
  });
  test('real questions are', () => {
    expect(q('¿Dónde vives?')).toBe(true);
    expect(q('¿Ya comiste?\nTodavía no.')).toBe(true);
    expect(q('Tomás: ¿Qué quieres?')).toBe(true);
    expect(q('¿Tú vives aquí?')).toBe(true);
    expect(q('¿Hay un banco cerca?')).toBe(true);
  });
  test('an explicit kind decides, unless the first line is plainly a reply', () => {
    expect(q('¿Dónde vives?', 'statement')).toBe(false);
    expect(q('Dime dónde vives?', 'question')).toBe(true);
    expect(q('¿Nacionalidad? Canadiense.', 'question')).toBe(false);
  });
  test('in the real bank, every question row opens with a question', () => {
    const dir = path.resolve(__dirname, '../../content/bank');
    let n = 0;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
      for (const s of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Array<{ es: string; kind?: 'statement' | 'question' | 'dialogue' }>) {
        if (s.kind === 'statement' || !isQuestionRow(s)) continue;
        n++;
        const first = s.es.split(/\r?\n/)[0].trim();
        expect(first, s.es).toMatch(/\?["”»)]*$/);
      }
    }
    expect(n).toBeGreaterThan(100);
  });
});
