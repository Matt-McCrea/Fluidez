// "Which word is doing the work here?" answered with the trigger. A lesson on the
// present subjunctive shows "Quiero que hables…" in every example, so quiero is
// the word that turns up most, and the pick asked the learner to spot it: the
// word the lesson is not teaching. The taught form is the one the node's tense
// reads (hables), so a node that teaches a tense picks its work word from that.
import { describe, expect, it } from 'vitest';
import { spotIt, workWords } from '../../src/ui/session/teachflow';

const examples = [
  { es: 'Quiero que hables más despacio.', en: 'I want you to speak more slowly.' },
  { es: 'Quiero que comas aquí.', en: 'I want you to eat here.' },
  { es: 'Quiero que vengas temprano.', en: 'I want you to come early.' },
  { es: 'Quiero que escribas hoy.', en: 'I want you to write today.' },
  { es: 'Quiero que vivas cerca.', en: 'I want you to live nearby.' },
];
const subjunctive = { id: 'g:subj-wanting', es: 'Quiero que hables.' };

describe('the work word of a node that teaches a tense', () => {
  it('is a form of that tense, not the trigger every example opens with', () => {
    const nw = workWords(subjunctive, examples);
    expect(nw).not.toContain('quiero');
    expect(nw).toEqual(expect.arrayContaining(['hables', 'comas']));
  });

  it('the spot-it pick asks for the taught form', () => {
    const nw = workWords(subjunctive, examples);
    for (const group of [examples.slice(0, 3), examples.slice(2)]) {
      const pick = spotIt(group, nw);
      expect(pick, 'a pick can be built').not.toBeNull();
      const word = pick!.options[pick!.answer];
      expect(word).not.toBe('quiero');
      expect(['hables', 'comas', 'vengas', 'escribas', 'vivas']).toContain(word);
    }
  });

  it('holds when the node lists its forms, which used to be taken whole', () => {
    const nw = workWords({ ...subjunctive, forms: [{ es: 'Quiero que hables', en: '' }, { es: 'Quiero que comas', en: '' }] }, examples);
    expect(nw).not.toContain('quiero');
    expect(nw).toEqual(expect.arrayContaining(['hables', 'comas']));
  });

  it('is read from a tense tag as well as from the id', () => {
    expect(workWords({ id: 'g:something-else', tags: ['tense:presubj'], es: 'Quiero que hables.' }, examples)).not.toContain('quiero');
  });

  it('a node with no tense keeps the words it had', () => {
    const ser = [
      { es: 'Soy de Cali.', en: '' }, { es: 'Soy Ana.', en: '' }, { es: 'Eres de Quito.', en: '' }, { es: 'Es mi casa.', en: '' },
    ];
    expect(workWords({ id: 'g:ser-identity', es: 'Soy Tomás.' }, ser)).toContain('soy');
  });

  it('a node that teaches a tense no example shows keeps the words it had', () => {
    const none = [{ es: 'Hola amigo mío.', en: '' }, { es: 'Buenas tardes, señora.', en: '' }];
    expect(() => workWords(subjunctive, none)).not.toThrow();
  });
});
