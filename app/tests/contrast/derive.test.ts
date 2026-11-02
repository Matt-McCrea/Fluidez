// The derive tool builds contrast items from what the scripts hold, with no model: the same scripts give the same
// items, in the same order, and nothing is written that a script did not say.
import { describe, expect, it } from 'vitest';
import type { GraphNode, TeachingScript } from '../../src/content/schema';
import { deriveContrast, type DeriveCtx } from '../../tools/contrast/derive';
import { pivotOf, wordsOf } from '../../tools/contrast/pivot';
import { BIG, DECIDES, TARGET_ITEMS } from '../../tools/contrast/classes';

const node = (id: string, contrasts: string[]): GraphNode => ({
  id, kind: id.startsWith('x:') ? 'contrast' : 'grammar', band: 'A2', priority: 1, title: id, requires: contrasts, contrasts: id.startsWith('x:') ? contrasts : [],
  serves: [], pcic: [], placement: 'pcic', sources: [], variety: 'neutral',
} as GraphNode);

const script = (n: string, over: Partial<TeachingScript> = {}): TeachingScript => ({
  node: n, hook: { line: 'l', es: 'Hola.', en: 'Hi.' }, examples: [{ es: 'Gracias por el regalo.', en: 'Thanks for the present.' }, { es: 'a', en: 'a' }, { es: 'b', en: 'b' }],
  rule: '*Lo hice para ti.* I made it for you. You get it.\n*Lo hice por ti.* I did it for you. You are the reason.',
  readAndPick: [], yourTurn: [], pitfalls: [], personal: 'p', ...over,
} as TeachingScript);

const tagStub: DeriveCtx['tag'] = (es) => ({ requires: ['l:x'], features: [], tokens: [...es.matchAll(/\S+/g)].map((m) => ({ text: m[0], punct: false })) });
const ctx = (scripts: TeachingScript[], bankEn: Array<[string, string]> = []): DeriveCtx => ({
  graph: new Map(), scripts: new Map(scripts.map((s) => [s.node, s])), bankEn: new Map(bankEn), tag: tagStub,
});
const por = node('x:por-para', ['g:por-para-1', 'p:para-inf']);

const twins = [
  { es: 'Lo hice para ti.', options: ['I made it for you to have.', 'I did it for your sake.'], answer: 0 },
  { es: 'Lo hice por ti.', options: ['I made it for you to have.', 'I did it for your sake.'], answer: 1 },
  { es: 'El tren va por Pereira.', options: ['The train is heading to Pereira.', 'The train goes via Pereira.'], answer: 1 },
  { es: 'El tren va para Pereira.', options: ['The train is heading to Pereira.', 'The train goes via Pereira.'], answer: 0 },
];

describe('the pivot of two sentences', () => {
  it('is what is left when the words they begin and end with alike are taken away', () => {
    const p = pivotOf('Lo hice para ti.', 'Lo hice por ti.')!;
    expect([p.ta, p.tb, p.size]).toEqual(['para', 'por', 1]);
    expect('Lo hice para ti.'.slice(...p.a)).toBe('para');
    expect('Lo hice por ti.'.slice(...p.b)).toBe('por');
  });
  it('can be a phrase, and keeps the case it was written in', () => {
    const p = pivotOf('Lo hago para mañana.', 'Lo hago por la mañana.')!;
    expect([p.ta, p.tb]).toEqual(['para', 'por la']);
    expect(pivotOf('Para mí, es grave.', 'Por mí, es grave.')!.ta).toBe('Para');
  });
  it('is nothing for two sentences that only resemble each other, or are the same', () => {
    expect(pivotOf('Voy al mercado hoy.', 'Ella comió pan con queso.')).toBeUndefined();
    expect(pivotOf('Lo hice por ti.', 'Lo hice por ti.')).toBeUndefined();
    expect(pivotOf('Voy.', 'Voy a casa.')).toBeUndefined();
  });
  it('sees words, not punctuation, and keeps accents: sé and se are two words', () => {
    expect(wordsOf('¿Dónde está?').map((w) => w.norm)).toEqual(['dónde', 'está']);
    expect(pivotOf('Sé que viene.', 'Se que viene.')!.ta).toBe('Sé');
  });
});

describe('what a contrast\'s items are made of', () => {
  it('a twin set gives each sentence an item whose other option is the other twin\'s word', () => {
    const { file, stats } = deriveContrast(por, ctx([script('x:por-para', { readAndPick: twins })]), 'meaning');
    expect(file.items).toHaveLength(4);
    expect(stats.origin.twin).toBe(4);
    for (const it of file.items) {
      expect(it.es.slice(...it.gap), it.id).toBe(it.options[it.answer]);
      expect([...it.options].sort(), it.id).toEqual(it.es.startsWith('El tren') ? ['para', 'por'] : ['para', 'por']);
    }
    const a = file.items.find((i) => i.id === 'x:por-para#rp0')!;
    expect([a.es, a.en, a.options[a.answer]]).toEqual(['Lo hice para ti.', 'I made it for you to have.', 'para']);
    // the author's own explanation of the sentence, from the rule
    expect(a.why).toBe('I made it for you. You get it.');
  });

  it('a pitfall gives its right sentence with its wrong word as the other option, and needs an English', () => {
    const s = script('x:por-para', { pitfalls: [{ wrong: 'Gracias para el regalo.', right: 'Gracias por el regalo.', why: 'Thanks is always gracias por.' }, { wrong: 'Voy para casa.', right: 'Voy por casa.', why: 'w' }] });
    const { file, stats } = deriveContrast(por, ctx([s]), 'meaning');
    expect(file.items.map((i) => i.id)).toEqual(['x:por-para#pf0']);
    expect(file.items[0].en).toBe('Thanks for the present.');
    expect(file.items[0].why).toBe('Thanks is always gracias por.');
    expect(stats.noEnglish).toBe(1);
    expect(stats.wantEn).toEqual(['Voy por casa.']);
    // the bank's English is used when the script has none
    const again = deriveContrast(por, ctx([s], [['voy por casa', 'I go around the house.']]), 'meaning');
    expect(again.file.items.map((i) => i.id)).toEqual(['x:por-para#pf0', 'x:por-para#pf1']);
  });

  it('a your-turn gap gives the sentence with the blank filled and the options the prompt names; English in the prompt means the sentence alone does not decide', () => {
    const s = script('x:por-para', {
      yourTurn: [
        { prompt: 'Choose *por* or *para* and type the whole sentence: Gracias ___ el regalo.', answer: 'Gracias por el regalo.', accept: [], why: 'Thanks looks back.' },
        { prompt: 'Choose *por* or *para* and type the whole sentence: Lo hago ___ la mañana. (I\'ll do it in the morning.)', answer: 'Lo hago por la mañana.', accept: [], why: 'Part of the day.' },
        { prompt: 'Say: It is a fine day.', answer: 'Es un buen día.', accept: [], why: 'w' },
      ],
    });
    const { file } = deriveContrast(por, ctx([s]), 'meaning');
    const [a, b] = file.items;
    expect([a.id, a.es.slice(...a.gap), [...a.options].sort(), a.rung]).toEqual(['x:por-para#yt0', 'por', ['para', 'por'], 2]);
    expect(a.en).toBe('Thanks for the present.');
    expect([b.id, b.en, b.rung]).toEqual(['x:por-para#yt1', 'I\'ll do it in the morning.', 1]);
    expect(file.items).toHaveLength(2);
  });

  it('a sentence with one pivot word of the contrast and no twin gets a gap with the English it came with', () => {
    const s = script('x:por-para', {
      readAndPick: [...twins, { es: 'Compré flores para mi abuela.', options: ['I bought flowers for my grandmother.', 'I bought flowers because of my grandmother.'], answer: 0 }],
    });
    const { file, stats } = deriveContrast(por, ctx([s]), 'local');
    const pick = file.items.find((i) => i.id === 'x:por-para#rp4')!;
    expect([pick.es.slice(...pick.gap), pick.options.filter((o) => o !== 'para'), pick.en]).toEqual(['para', ['por'], 'I bought flowers for my grandmother.']);
    expect(stats.origin.pick).toBe(1);
  });

  it('a side\'s script gives its items only where the pair is one the contrast\'s own script draws', () => {
    const own = script('x:por-para', { readAndPick: twins.slice(0, 2) });
    const side = script('g:por-para-1', {
      readAndPick: [
        { es: 'Salimos para Medellín.', options: ['We are leaving for Medellín.', 'We pass through Medellín.'], answer: 0 },
        { es: 'Salimos por Medellín.', options: ['We are leaving for Medellín.', 'We pass through Medellín.'], answer: 1 },
        { es: 'Es alto.', options: ['He is tall.', 'He is short.'], answer: 0 },
        { es: 'Es bajo.', options: ['He is tall.', 'He is short.'], answer: 1 },
      ],
    });
    const { file, stats } = deriveContrast(por, ctx([own, side]), 'local');
    expect(file.items.map((i) => i.id)).toEqual(['x:por-para#rp0', 'x:por-para#rp1', 'x:por-para#g.por-para-1.rp0', 'x:por-para#g.por-para-1.rp1']);
    expect(stats.fromSides).toBe(2);
  });

  it('the same sentence with the same gap is one item', () => {
    const s = script('x:por-para', {
      readAndPick: twins.slice(0, 2),
      yourTurn: [{ prompt: 'Choose *por* or *para*: Lo hice ___ ti.', answer: 'Lo hice para ti.', accept: [], why: 'You get it.' }],
    });
    const { file } = deriveContrast(por, ctx([s]), 'local');
    expect(file.items.filter((i) => i.es === 'Lo hice para ti.')).toHaveLength(1);
    // the your-turn gap, the sturdier origin, is the one kept
    expect(file.items.find((i) => i.es === 'Lo hice para ti.')!.id).toBe('x:por-para#yt0');
  });

  it('is the same items in the same order every time', () => {
    const s = script('x:por-para', { readAndPick: twins, pitfalls: [{ wrong: 'Gracias para el regalo.', right: 'Gracias por el regalo.', why: 'w' }] });
    const a = JSON.stringify(deriveContrast(por, ctx([s]), 'meaning').file);
    const b = JSON.stringify(deriveContrast(por, ctx([s]), 'meaning').file);
    expect(a).toBe(b);
  });

  it('puts the right option in different places, not always the one the script named first', () => {
    const many = Array.from({ length: 12 }, (_, i) => [
      { es: `Lo hice para ti ${'a'.repeat(i)}.`, options: [`A${i}`, `B${i}`], answer: 0 },
      { es: `Lo hice por ti ${'a'.repeat(i)}.`, options: [`A${i}`, `B${i}`], answer: 1 },
    ]).flat();
    const { file } = deriveContrast(por, ctx([script('x:por-para', { readAndPick: many })]), 'local');
    const at = file.items.map((i) => i.answer);
    expect(at.filter((a) => a === 0).length).toBeGreaterThan(4);
    expect(at.filter((a) => a === 1).length).toBeGreaterThan(4);
  });
});

describe('what decides each contrast', () => {
  it('is listed for all 94, in the four classes the acquisition review counted: 30, 27, 8 and 29', () => {
    expect(DECIDES.size).toBe(94);
    const n = (d: string) => [...DECIDES.values()].filter((x) => x === d).length;
    expect([n('local'), n('meaning'), n('discourse'), n('synonym')]).toEqual([30, 27, 8, 29]);
  });
  it('puts aspect among the contrasts that are typed and never timed, and por and para among those a meaning decides', () => {
    expect(DECIDES.get('x:pret-imp')).toBe('discourse');
    expect(DECIDES.get('x:por-para')).toBe('meaning');
    expect(DECIDES.get('x:lo-le')).toBe('local');
    expect(DECIDES.get('x:perdon-lo-siento')).toBe('synonym');
  });
  it('starts the big ones at 150 items and the rest at 40 (R11)', () => {
    expect([...BIG].map(TARGET_ITEMS)).toEqual([150, 150, 150, 150, 150]);
    expect(TARGET_ITEMS('x:hay-esta')).toBe(40);
  });
});
