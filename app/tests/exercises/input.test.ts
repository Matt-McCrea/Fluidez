// Generator 1: structured input with minimal pairs.
import { describe, expect, test } from 'vitest';
import { BankSentence } from '../../src/content/schema';
import { verbReadings } from '../../src/exercises/spanish';
import { ALL_FEATURES, structuredInput, structuredInputAll, type Feature, type ReadAndPickItem } from '../../src/exercises';
import { BANK, byId } from './fixtures';
import { hasVosotros } from './helpers';

const S = (es: string, en: string) => BankSentence.parse({ id: 'x-' + es.length, es, en });
const words = (s: string) => s.toLowerCase().replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(Boolean);
const right = (it: ReadAndPickItem) => it.options[it.answer];
const wrong = (it: ReadAndPickItem) => it.options.filter((_, i) => i !== it.answer);

const ALL = BANK.flatMap((s) => structuredInputAll(s, { seed: 7 }));

describe('invariants over every item the bank produces', () => {
  test('the bank yields items for every feature', () => {
    const got = new Set(ALL.map((i) => i.feature));
    for (const f of ALL_FEATURES) expect(got.has(f), f).toBe(true);
  });
  test.each(ALL.map((it) => [it.id, it] as const))('%s', (_id, it) => {
    // a distractor is never the answer, and never twice
    const keys = it.options.map((o) => words(o).join(' '));
    expect(new Set(keys).size).toBe(keys.length);
    expect(it.answer).toBeGreaterThanOrEqual(0);
    expect(it.answer).toBeLessThan(it.options.length);
    expect(it.options.length).toBeGreaterThanOrEqual(2);
    // vosotros is never produced
    for (const o of it.options) expect(hasVosotros(o), o).toBe(false);
    // options differ only in the target feature: same length (person/tense/etc. swap one or a few words)
    const lens = it.options.map((o) => words(o).length);
    expect(Math.max(...lens) - Math.min(...lens)).toBe(0);
    // the question is plain English: no grammar terms
    expect(it.question).not.toMatch(/subjunctive|preterite|indicative|imperfect|clitic|copula|conjugat|tense|person/i);
    expect(it.why.length).toBeGreaterThan(5);
  });
  test('ids are stable across seeds; option sets are the same items', () => {
    const a = BANK.flatMap((s) => structuredInputAll(s, { seed: 1 }));
    const b = BANK.flatMap((s) => structuredInputAll(s, { seed: 999 }));
    expect(a.map((i) => i.id)).toEqual(b.map((i) => i.id));
    expect(a.map(right)).toEqual(b.map(right));
  });
  test('the same seed gives the same items in the same order', () => {
    expect(BANK.flatMap((s) => structuredInputAll(s, { seed: 3 }))).toEqual(BANK.flatMap((s) => structuredInputAll(s, { seed: 3 })));
  });
  test('ids are unique', () => {
    expect(new Set(ALL.map((i) => i.id)).size).toBe(ALL.length);
  });
  test('featureNodes are attached', () => {
    const it = structuredInput(byId('u01-1'), 'tense', { featureNodes: { tense: 'g:tiempo' } })!;
    expect(it.nodes).toContain('g:tiempo');
    expect(it.nodes).toContain('g:presente');
  });
});

describe('tense', () => {
  test('time words are removed: only the verb says when', () => {
    const it = structuredInput(byId('u02-1'), 'tense')!;
    expect(right(it)).toBe('Comí pescado.');
    for (const o of it.options) expect(o).not.toMatch(/ayer/i);
    expect(it.question).toMatch(/already happened/);
  });
  test('distractors are engine forms of the same verb', () => {
    const it = structuredInput(byId('u01-1'), 'tense', { maxDistractors: 3 })!;
    expect(new Set(it.options)).toEqual(new Set(['Como pescado.', 'Comí pescado.', 'Comeré pescado.']));
  });
  test('a form shared by two tenses is never a distractor (vivimos: present = preterite)', () => {
    const it = structuredInput(byId('u01-3'), 'tense', { maxDistractors: 3 })!;
    expect(it.options).not.toContain('Vivimos en Lima.'.replace('Vivimos', 'Vivimos ') );
    expect(wrong(it).every((o) => !/^Vivimos/.test(o))).toBe(true);
  });
  test('ser and estar take the imperfect, not the preterite, as their past', () => {
    const it = structuredInput(byId('u03-3'), 'tense', { maxDistractors: 3 })!;
    expect(it.options).toContain('La casa era blanca.');
    expect(it.options).not.toContain('La casa fue blanca.');
  });
  test('a preterite target never sits beside an imperfect (both "already happened")', () => {
    for (const it of ALL.filter((i) => i.feature === 'tense')) {
      const tenses = it.options.flatMap((o) => words(o).flatMap((w) => verbReadings(w).map((a) => a.tense)));
      expect(tenses.includes('preterito') && tenses.includes('imperfecto')).toBe(false);
    }
  });
});

describe('person', () => {
  test('the subject pronoun is removed from every option', () => {
    const it = structuredInput(byId('u01-5'), 'person')!;
    expect(right(it)).toBe('Trabaja en un banco.');
    for (const o of it.options) expect(o).not.toMatch(/\b(ella|yo|nosotros)\b/i);
    expect(it.question).toMatch(/her/);
  });
  test('tú is never paired with a 3rd-person form (it also means usted, "you")', () => {
    const it = structuredInput(byId('u01-4'), 'person', { maxDistractors: 4 })!;
    expect(wrong(it)).not.toContain('¿Habla inglés?');
    expect(wrong(it)).not.toContain('¿Hablan inglés?');
  });
  test('comía is yo AND él: the él form is never a distractor for yo', () => {
    const it = structuredInput(S('Comía pescado.', 'I used to eat fish.'), 'person', { maxDistractors: 4 })!;
    expect(right(it)).toBe('Comía pescado.');
    expect(wrong(it)).not.toContain('Comía pescado.');
    expect(wrong(it).length).toBeGreaterThan(0);
  });
  test('no person item when the subject is a noun (mi hermana vive)', () => {
    expect(structuredInput(byId('u04-1'), 'person')).toBeNull();
  });
  test('no person item for usted / ustedes (the question would say "them")', () => {
    expect(structuredInput(byId('u05-1'), 'person')).toBeNull();
    expect(structuredInput(S('Usted habla muy bien.', 'You speak very well.'), 'person')).toBeNull();
  });
  test('no person item for gustar (the subject is the thing liked)', () => {
    expect(structuredInput(byId('u05-9'), 'person')).toBeNull();
  });
  test('reflexive pronoun moves with the person', () => {
    const it = structuredInput(byId('u01-8'), 'person', { maxDistractors: 4 })!;
    expect(it.options).toContain('Nos levantamos temprano.');
    expect(it.options).not.toContain('Me levantamos temprano.');
  });
  test('possessive of the subject moves with the person', () => {
    const it = structuredInput(byId('u03-5'), 'person', { maxDistractors: 4 })!;
    expect(it.options).toContain('Trabajamos por nuestra familia.');
  });
  test('predicate adjective agrees with a plural person', () => {
    const it = structuredInput(byId('u01-6'), 'person', { maxDistractors: 4 })!;
    expect(it.options).toContain('Estamos cansados.');
  });
});

describe('mood (fact or not)', () => {
  test.each<[string, string, RegExp]>([
    ['u03-7', 'Aunque llueva, salgo.', /definitely true/],
    ['u03-8', 'Cuando llegue a casa, ceno.', /happens regularly/],
    ['u03-9', 'Dice que venga mañana.', /passing on/],
  ])('%s → distractor %s', (id, distractor, q) => {
    const it = structuredInput(byId(id), 'mood')!;
    expect(wrong(it)).toEqual([distractor]);
    expect(it.question).toMatch(q);
  });
  test('the subjunctive as the target asks the other question', () => {
    const it = structuredInput(S('Aunque llueva, salgo.', "Even if it rains, I'm going out."), 'mood')!;
    expect(wrong(it)).toEqual(['Aunque llueve, salgo.']);
    expect(it.question).toMatch(/may or may not/);
  });
  test('no frame, no item', () => {
    expect(structuredInput(byId('u01-1'), 'mood')).toBeNull();
    expect(structuredInput(S('¿Cuándo llegas?', 'When are you arriving?'), 'mood')).toBeNull();
  });
});

describe('clitic (who did what to whom)', () => {
  test('him: la and los are wrong, lo is right', () => {
    const it = structuredInput(byId('u02-6'), 'clitic', { maxDistractors: 3 })!;
    expect(right(it)).toBe('Lo veo.');
    expect(new Set(wrong(it))).toEqual(new Set(['La veo.', 'Los veo.', 'Las veo.']));
  });
  test('"it" is lo OR la: the other gender is never a distractor', () => {
    const it = structuredInput(S('Lo veo.', 'I see it.'), 'clitic', { maxDistractors: 3 })!;
    expect(wrong(it)).not.toContain('La veo.');
  });
  test('"them" is los OR las: never offered against each other', () => {
    const it = structuredInput(S('Los llamo.', 'I call them.'), 'clitic', { maxDistractors: 3 })!;
    expect(wrong(it)).not.toContain('Las llamo.');
  });
  test('le / les swap', () => {
    const it = structuredInput(byId('u02-8'), 'clitic')!;
    expect(wrong(it)).toEqual(['Les doy el libro.']);
  });
  test('reflexive me is not an object clitic', () => {
    expect(structuredInput(byId('u01-8'), 'clitic')).toBeNull();
  });
});

describe('ser / estar', () => {
  test('a meaning-changing adjective uses the English', () => {
    const it = structuredInput(byId('u03-2'), 'copula')!;
    expect(it.question).toBe('Which one means "I\'m bored."?');
    expect(wrong(it)).toEqual(['Soy aburrido.']);
  });
  test('state vs trait', () => {
    const it = structuredInput(byId('u03-1'), 'copula')!;
    expect(it.question).toMatch(/right now/);
    expect(wrong(it)).toEqual(['La sopa es fría.']);
  });
  test('location and odd pairs are never swapped', () => {
    expect(structuredInput(S('Estoy en casa.', "I'm at home."), 'copula')).toBeNull();
    expect(structuredInput(byId('u04-9'), 'copula')).toBeNull();          // *la mesa está grande
    expect(structuredInput(byId('u06-6'), 'copula')).toBeNull();          // *ella es contenta
  });
});

describe('por / para', () => {
  test('person after: por = for their sake, para = destined for', () => {
    expect(wrong(structuredInput(byId('u03-5'), 'porpara')!)).toEqual(['Trabajo para mi familia.']);
    expect(wrong(structuredInput(byId('u03-6'), 'porpara')!)).toEqual(['Este regalo es por ti.']);
  });
  test('place after a motion verb', () => {
    const it = structuredInput(byId('u06-4'), 'porpara')!;
    expect(it.question).toMatch(/heading/);
  });
  test.each([
    ['Gracias por la comida.', 'Thanks for the food.'],
    ['Por favor, cierra la puerta.', 'Please close the door.'],
    ['Estudio para aprender.', 'I study to learn.'],
    ['Lo hice por eso.', 'I did it because of that.'],
  ])('fixed or unsafe: "%s"', (es, en) => {
    expect(structuredInput(S(es, en), 'porpara')).toBeNull();
  });
});

describe('number and gender agreement', () => {
  test('number: article, noun, verb and adjective all change', () => {
    expect(wrong(structuredInput(byId('u03-3'), 'number')!)).toEqual(['Las casas son blancas.']);
    expect(wrong(structuredInput(byId('u04-9'), 'number')!)).toEqual(['Las mesas son grandes.']);
    expect(wrong(structuredInput(byId('u04-1'), 'number')!)).toEqual(['Mis hermanas viven en Bogotá.']);
  });
  test('plural back to singular', () => {
    const it = structuredInput(S('Los niños son altos.', 'The boys are tall.'), 'number')!;
    expect(wrong(it)).toEqual(['El niño es alto.']);
    expect(it.question).toMatch(/more than one/);
  });
  test('gender: a noun pair', () => {
    const it = structuredInput(byId('u03-4'), 'gender')!;
    expect(wrong(it)).toEqual(['La niña es alta.']);
    expect(it.question).toBe('Which one is about a boy?');
  });
  test('gender: the speaker describing themself', () => {
    const it = structuredInput(byId('u01-6'), 'gender')!;
    expect(wrong(it)).toEqual(['Estoy cansada.']);
    expect(it.question).toMatch(/man or boy/);
  });
  test('an adjective that does not inflect gives no gender item', () => {
    expect(structuredInput(S('Estoy feliz.', "I'm happy."), 'gender')).toBeNull();
  });
});

describe('features a sentence cannot carry return null, never a bad item', () => {
  const none: Array<[string, Feature]> = [
    ['u05-8', 'tense'], ['u02-2', 'clitic'], ['u01-1', 'copula'], ['u01-1', 'porpara'], ['u01-1', 'number'], ['u01-1', 'gender'],
  ];
  test.each(none)('%s / %s', (id, f) => {
    expect(structuredInput(byId(id), f)).toBeNull();
  });
});
