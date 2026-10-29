import { describe, expect, it } from 'vitest';
import { attributeGrades } from '../../src/ui/session/attribute';
import { Rating } from '../../src/learner';
import type { GraphNode } from '../../src/content/schema';

const mk = (id: string, kind: GraphNode['kind'], es: string, forms?: string[]): GraphNode => ({
  id, kind, band: 'A1', priority: 1, title: id, es, en: '', requires: [], contrasts: [], serves: [], pcic: [],
  placement: 'pcic', sources: [], variety: 'neutral', ...(forms ? { forms: forms.map((f) => ({ es: f, en: '' })) } : {}),
} as GraphNode);

const NODES = new Map(
  [
    mk('g:preterite-er-ir', 'grammar', 'Comí pan.', ['Bebió agua.', 'Vivimos allí.']),
    mk('l:pan', 'lexeme', 'el pan'),
    mk('l:ayer', 'lexeme', 'ayer'),
    mk('l:cerca', 'lexeme', 'cerca'),
    mk('x:ser-estar-adj', 'contrast', 'Es alto. Está cansado.'),
  ].map((n) => [n.id, n]),
);
const nodes = (id: string) => NODES.get(id);
const T3 = ['g:preterite-er-ir', 'l:pan', 'l:cerca'];
const A = Rating.Again;

describe('attributeGrades', () => {
  it('typed: a verb-ending miss lapses only the grammar target; a word typed right is Good; the rest is exposed', () => {
    const r = attributeGrades(T3, false, A, { input: 'Ayer comemos pan', answer: 'Ayer comimos pan' }, nodes);
    expect(r.grades).toEqual({ 'g:preterite-er-ir': A, 'l:pan': Rating.Good });
    expect(r.expose).toEqual(['l:cerca']);
  });

  it('typed: a wrong word lapses the lexeme it stands for, not the grammar target', () => {
    const r = attributeGrades(['g:preterite-er-ir', 'l:pan', 'l:ayer'], false, A, { input: 'Ayer comimos arroz', answer: 'Ayer comimos pan' }, nodes);
    expect(r.grades['l:pan']).toBe(A);
    expect(r.grades['l:ayer']).toBe(Rating.Good);
    expect(r.expose).toEqual(['g:preterite-er-ir']);
  });

  it('typed: an unattributable miss stays a miss for every target without evidence', () => {
    const r = attributeGrades(T3, false, A, { input: 'pan comimos ayer', answer: 'Ayer comimos pan' }, nodes);
    expect(r.grades['g:preterite-er-ir']).toBe(A);
    expect(r.grades['l:cerca']).toBe(A);
    expect(r.expose).toEqual([]);
  });

  it('MCQ: a tense distractor lapses the grammar target; lexemes are exposed', () => {
    const r = attributeGrades(T3, false, A, { picked: 1, feature: 'tense' }, nodes);
    expect(r.grades).toEqual({ 'g:preterite-er-ir': A });
    expect(r.expose).toEqual(['l:pan', 'l:cerca']);
  });

  it('MCQ: a copula distractor goes to the ser-estar contrast', () => {
    const r = attributeGrades(['l:pan', 'x:ser-estar-adj'], false, A, { picked: 0, feature: 'copula' }, nodes);
    expect(r.grades).toEqual({ 'x:ser-estar-adj': A });
    expect(r.expose).toEqual(['l:pan']);
  });

  it('"I don\'t know" is Again for every target', () => {
    const r = attributeGrades(T3, false, A, { picked: 'unsure', feature: 'tense' }, nodes);
    expect(r.grades).toEqual({ 'g:preterite-er-ir': A, 'l:pan': A, 'l:cerca': A });
    expect(r.expose).toEqual([]);
  });

  it('single target and correct answers are unchanged', () => {
    expect(attributeGrades(['l:pan'], false, A, { picked: 0, feature: 'tense' }, nodes)).toEqual({ grades: { 'l:pan': A }, expose: [] });
    expect(attributeGrades(T3, true, Rating.Good, { input: 'x', answer: 'y' }, nodes).expose).toEqual([]);
    expect(Object.values(attributeGrades(T3, true, Rating.Hard, undefined, nodes).grades)).toEqual([Rating.Hard, Rating.Hard, Rating.Hard]);
  });
});
