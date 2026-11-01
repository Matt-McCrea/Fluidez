import { describe, expect, it } from 'vitest';
import { savedWordNodes } from '../../src/ui/screens/reference/model';

const nodes = new Map<string, unknown>([
  ['l:casa', { id: 'l:casa', kind: 'lexeme', es: 'la casa' }],
  ['l:perro', { id: 'l:perro', kind: 'lexeme', es: 'perro' }],
  ['g:x', { id: 'g:x', kind: 'grammar', es: 'casa' }],
]);
const bundle = { course: { nodes } } as never;

describe('savedWordNodes', () => {
  it('maps saved words to lexemes, ignoring articles, case and repeats', () => {
    const saved = [{ es: 'casa', en: 'house', at: 0 }, { es: 'El Perro', en: 'dog', at: 0 }, { es: 'la casa', en: 'house', at: 0 }, { es: 'xyz', en: '?', at: 0 }];
    expect(savedWordNodes(saved, bundle)).toEqual(['l:casa', 'l:perro']);
  });
  it('is empty when nothing maps', () => {
    expect(savedWordNodes([{ es: 'xyz', en: '?', at: 0 }], bundle)).toEqual([]);
  });
});
