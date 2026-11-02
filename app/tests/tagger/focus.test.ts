// focus: where in a row's es the target node's decision sits (character offsets), and the two
// lexically detectable nodes that used to be blind.
import { describe, expect, test } from 'vitest';
import { focusSpan, tagSentence } from '../../src/engine/tagger';

const nodes = (es: string) => tagSentence(es).features.map((f) => f.node);

describe('focusSpan', () => {
  test('character offsets of the feature that carries the target', () => {
    const es = 'Ayer Tomás hablé con Vale.';
    const r = tagSentence(es);
    const t = r.features.find((f) => f.node && f.node.startsWith('g:preterite'))!.node!;
    const s = focusSpan(es, r, [t])!;
    expect(s[0]).toBeGreaterThanOrEqual(0);
    expect(es.slice(s[0], s[1])).toBe(r.features.find((f) => f.node === t)!.text);
  });
  test('survives a dialogue row: offsets count the dash and the line break', () => {
    const es = '— ¿Dónde está Vale?\n— Para ser lunes, hay gente.';
    const r = tagSentence(es);
    const s = focusSpan(es, r, ['g:por-para-2'])!;
    expect(es.slice(s[0], s[1])).toBe('Para ser');
  });
  test('null when no feature carries a target', () => {
    const es = 'Tomás habla español.';
    expect(focusSpan(es, tagSentence(es), ['g:subj-wanting'])).toBeNull();
  });
});

describe('por-para-2 is lexically detectable', () => {
  test.each([
    'Lo tomas tres veces por día.',
    'Para ser lunes, hay mucha gente.',
    'Voy al gimnasio una vez por mes.',
  ])('%s', (es) => expect(nodes(es)).toContain('g:por-para-2'));
  test('plain por and para stay in part 1', () => {
    expect(nodes('Es para ti.')).not.toContain('g:por-para-2');
    expect(nodes('Gracias por venir.')).not.toContain('g:por-para-2');
    for (const es of ['Trabajo por la mañana.', 'Hablamos por teléfono.', 'Voy a 60 kilómetros por hora.', 'Para mí, es grave.', 'Te escribo por mensaje.', 'Lo cambié por otro.', 'Voy dos veces por semana.']) expect(nodes(es)).not.toContain('g:por-para-2');
    expect(nodes('Trabajo por la mañana.')).not.toContain('g:por-para-2');
  });
});

describe('ser-estar-adjectives is lexically detectable', () => {
  test.each(['Don Hernando es muy orgulloso.', 'Don Hernando es muy listo.', 'Hoy estás muy atento.', 'Mi abuelo está vivo.'])('%s', (es) => expect(nodes(es)).toContain('g:ser-estar-adjectives'));
  test('an adjective that does not change meaning does not', () => {
    expect(nodes('La casa es grande.')).not.toContain('g:ser-estar-adjectives');
    expect(nodes('Estoy cansado.')).not.toContain('g:ser-estar-adjectives');
    expect(nodes('La clase es aburrida.')).not.toContain('g:ser-estar-adjectives');   // early vocabulary with either verb
    expect(nodes('El café es bueno.')).not.toContain('g:ser-estar-adjectives');
    expect(nodes('Ya estoy listo.')).not.toContain('g:ser-estar-adjectives');
    // the plain state is taught with estar, long before the contrast
    expect(nodes('Hoy estoy aburrido.')).not.toContain('g:ser-estar-adjectives');
  });
});
