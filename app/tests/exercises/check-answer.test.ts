import { describe, expect, it } from 'vitest';
import { checkItem } from '../../src/exercises';

describe('checkItem answer on a pass', () => {
  it('shows the model, never the Spain form that matched', () => {
    const item: any = { kind: 'translate', dir: 'en-es', id: 'x', answer: 'Ustedes hablan inglés.', en: 'You all speak English.', accept: [], sentenceId: 's', nodes: [] };
    const r = checkItem(item, 'Vosotros habláis inglés.');
    expect(r.pass).toBe(true);
    expect(r.variant).toBe('peninsular');
    expect(r.answer).toBe('Ustedes hablan inglés.');
  });
});
