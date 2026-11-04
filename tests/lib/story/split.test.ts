import { describe, expect, it } from 'vitest';
import { splitLines, toLines, placeQuestions, isLongest } from '../../../tools/story/split';

const text = ['Narrador: ' + 'uno dos tres cuatro cinco seis siete ocho nueve diez', 'Ana: casa grande roja bonita', 'Luis: perro pequeño negro feo viejo nuevo', 'Ana: una frase final con el loro Simón y el café'].join('\n');

describe('split', () => {
  it('keeps short chapters whole', () => {
    expect(splitLines(toLines(text), 180)).toEqual([[0, 1, 2, 3]]);
  });
  it('splits at whole lines, covers every line once, contiguous', () => {
    const lines = toLines(text);
    const parts = splitLines(lines, 15);
    expect(parts.length).toBe(Math.ceil(lines.reduce((a, l) => a + l.words, 0) / 15));
    expect(parts.flat()).toEqual([0, 1, 2, 3]);
    expect(parts.every((p) => p.length > 0)).toBe(true);
  });
  it('balances evenly', () => {
    const lines = Array.from({ length: 8 }, (_, i) => ({ text: `x${i}`, words: 10 }));
    expect(splitLines(lines, 45).map((p) => p.length)).toEqual([4, 4]);
  });
});

describe('placement', () => {
  const lines = toLines(text);
  const parts = splitLines(lines, 15);
  const gloss = [{ es: 'perro pequeño', en: 'small dog' }];
  it('finds Spanish option text, falls back to question, then gloss, else last part', () => {
    const lastPart = parts.length - 1;
    const r = placeQuestions([
      { q: 'What is said?', options: ['x', 'Simón', 'y'], answer: 1 },
      { q: 'What about the small dog?', options: ['Black', 'White', 'Red'], answer: 0 },
      { q: 'Zzzz qqqq?', options: ['aaaa', 'bbbb'], answer: 0 },
    ], lines, parts, gloss);
    expect(r[0].how).toBe('option');
    expect(r[0].part).toBe(lastPart);
    expect(r[1].located).toBe(true);
    expect(r[1].part).toBe(parts.findIndex((p) => p.includes(2)));
    expect(r[2].located).toBe(false);
    expect(r[2].part).toBe(lastPart);
  });
  it('longest is strict', () => {
    expect(isLongest({ q: '', options: ['aa', 'bbbb'], answer: 1 })).toBe(true);
    expect(isLongest({ q: '', options: ['aaaa', 'bbbb'], answer: 1 })).toBe(false);
  });
});
