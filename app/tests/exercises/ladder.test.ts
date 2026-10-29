// Generator 2: choose → type → transform, and the ambiguity check that keeps
// unanswerable gaps out.
import { describe, expect, test } from 'vitest';
import { BankSentence } from '../../src/content/schema';
import { analyseGap, checkItem, chooseItem, ladder, transformItems, typeFormItem, type TransformItem } from '../../src/exercises';
import { verbReadings } from '../../src/exercises/spanish';
import { BANK, byId } from './fixtures';
import { hasVosotros, producedSpanish } from './helpers';

const S = (es: string, en: string, id = 'adv') => BankSentence.parse({ id, es, en });

describe('the ambiguity check drops gaps with more than one right answer', () => {
  test.each<[string, string, string]>([
    ['Compré el libro.', 'I bought the book.', 'compraba is not ruled out (finished vs habitual)'],
    ['Vivía en Lima.', 'I lived in Lima.', 'viví is not ruled out'],
    ['Mañana viajo a Quito.', "Tomorrow I'm travelling to Quito.", 'viajaré fits too'],
    ['Mañana viajaré a Quito.', 'Tomorrow I will travel to Quito.', 'viajo fits too'],
    ['Comería pescado.', 'I would eat fish.', 'comía (habitual would) fits too'],
    ['He comido.', 'I have eaten.', 'a compound: two words'],
    ['Me gusta el café.', 'I like coffee.', 'unparseable person'],
    ['Aunque llueve, salgo.', "Even though it's raining, I'm going out.", 'two finite verbs'],
    ['Viene mañana.', 'He is coming tomorrow.', 'vendrá fits too'],
  ])('"%s" — %s', (es, en) => {
    expect(analyseGap(S(es, en))).toBeNull();
    expect(chooseItem(S(es, en))).toBeNull();
    expect(typeFormItem(S(es, en))).toBeNull();
  });
  test.each(['u02-2', 'u06-3', 'u05-8', 'u05-9', 'u03-7', 'u03-8', 'u06-2'])('bank %s has no verb gap', (id) => {
    expect(analyseGap(byId(id))).toBeNull();
  });
});

describe('gaps pinned by the item are kept', () => {
  test.each<[string, string, string, string]>([
    ['Ayer comí pescado.', 'Yesterday I ate fish.', 'comí', '(comer)'],
    ['Comía pescado.', 'I used to eat fish.', 'comía', '(comer)'],                 // comía = yo = él: still one FORM
    ['Siempre comía pescado.', 'I always ate fish.', 'comía', '(comer)'],
    ['Viajaré a Quito.', 'I will travel to Quito.', 'viajaré', '(viajar)'],
    ['Juan come pescado.', 'Juan eats fish.', 'come', '(comer)'],
    ['Los niños comen pescado.', 'The children eat fish.', 'comen', '(comer)'],
    ['Hablamos español.', 'We speak Spanish.', 'hablamos', '(hablar)'],
    ['Me gustaría un café.', "I'd like a coffee.", '', ''],
  ])('"%s" → %s %s', (es, en, answer, cue) => {
    const g = analyseGap(S(es, en));
    if (!answer) { expect(g).toBeNull(); return; }
    expect(g?.answer).toBe(answer);
    expect(g?.cue).toBe(cue);
  });
  test('English "you" is narrowed by a person cue', () => {
    expect(analyseGap(byId('u01-4'))).toMatchObject({ answer: 'hablas', cue: '(hablar, tú)' });
    expect(analyseGap(byId('u05-2'))).toMatchObject({ answer: 'vives', cue: '(vivir, tú)' });
    expect(analyseGap(S('¿Habla inglés?', 'Do you speak English?'))).toMatchObject({ answer: 'habla', cue: '(hablar, usted)' });
  });
  test('a noun subject is never given a "usted" cue', () => {
    expect(analyseGap(S('Juan come pescado.', 'Juan eats fish.'))?.cue).toBe('(comer)');
  });
  test('legacy spellings are accepted in the typed form', () => {
    const it = typeFormItem(S('Ayer se rio mucho.', 'Yesterday he laughed a lot.'));
    if (it) expect(it.accept).toEqual(expect.arrayContaining(['rio']));
  });
});

describe('choose: distractors are never right', () => {
  const items = BANK.map((s) => chooseItem(s, { seed: 5 })).filter((x) => !!x);
  test('the bank gives many choose items', () => {
    expect(items.length).toBeGreaterThan(25);
  });
  test.each(items.map((it) => [it!.id, it!] as const))('%s', (_id, it) => {
    const g = analyseGap(BANK.find((s) => s.id === it.sentenceId)!)!;
    const wrong = it.options.filter((_, i) => i !== it.answer);
    expect(it.options[it.answer]).toBe(g.answer);
    expect(new Set(it.options).size).toBe(it.options.length);
    for (const w of wrong) {
      expect(w).not.toBe(g.answer);
      expect(g.accept).not.toContain(w);
      // same lemma, so it is the ending that is tested
      expect(verbReadings(w).some((a) => a.inf.replace(/se$/, '') === g.clause.choice.inf.replace(/se$/, ''))).toBe(true);
      expect(hasVosotros(w)).toBe(false);
    }
    expect(it.gapped).toContain('___');
  });
});

describe('type the form', () => {
  test('accepts the form, near on accents', () => {
    const it = typeFormItem(byId('u02-1'))!;
    expect(it.gapped).toBe('Ayer ___ pescado.');
    expect(checkItem(it, 'comí').pass).toBe(true);
    expect(checkItem(it, 'comi')).toMatchObject({ pass: false, near: true });
    expect(checkItem(it, 'comió').pass).toBe(false);
  });
  test('reflexive: the pronoun stays in the sentence, the gap is the verb', () => {
    const it = typeFormItem(byId('u01-8'))!;
    expect(it.gapped).toBe('Me ___ temprano.');
    expect(it.answer).toBe('levanto');
  });
});

describe('transform', () => {
  const tr = (id: string, key: string): TransformItem | undefined => transformItems(byId(id)).find((t) => t.id.endsWith(key));
  test.each<[string, string, string]>([
    ['u01-1', 'person:nosotros', 'Comemos pescado.'],
    ['u01-8', 'person:ellos', 'Se levantan temprano.'],
    ['u03-5', 'person:nosotros', 'Trabajamos por nuestra familia.'],
    ['u01-6', 'person:ellos', 'Están cansados.'],
    ['u01-5', 'person:yo', 'Yo trabajo en un banco.'],
    ['u05-8', 'person:nosotros', 'Hemos comido.'],
    ['u01-1', 'tense:preterito', 'Ayer comí pescado.'],
    ['u01-7', 'tense:imperfecto', 'Antes tenía dos hermanos.'],
    ['u01-1', 'tense:futuro', 'Mañana comeré pescado.'],
    ['u01-1', 'negate', 'No como pescado.'],
    ['u02-6', 'negate', 'No lo veo.'],
    ['u01-5', 'negate', 'Ella no trabaja en un banco.'],
    ['u02-3', 'pronoun', 'Lo leo.'],
    ['u02-8', 'pronoun', 'Se lo doy.'],
    ['u05-6', 'pronoun', 'Ellos las compraron.'],
    ['u02-5', 'pronoun', 'Quiero comprarla.'],
    ['u05-7', 'pronoun', 'Estamos leyéndolo.'],
  ])('%s %s → %s', (id, key, answer) => {
    expect(tr(id, key)?.answer).toBe(answer);
  });
  test.each<[string, string]>([
    ['u04-4', 'negate'],               // también → tampoco: not a plain "no"
    ['u04-3', 'negate'],               // ya → todavía no
    ['u05-3', 'negate'],               // siempre
    ['u05-2', 'negate'],               // ¿Dónde no vives? is not a negation drill
    ['u05-2', 'tense:preterito'],      // no "Ayer" glued onto a question
    ['u01-7', 'tense:preterito'],      // *Ayer tuve dos hermanos
    ['u03-3', 'tense:futuro'],         // *Mañana la casa será blanca
    ['u02-1', 'tense:futuro'],         // already has a time word
    ['u05-9', 'person:nosotros'],      // gustar
    ['u04-1', 'person:yo'],            // noun subject
    ['u03-1', 'pronoun'],              // ser/estar take no object
    ['u04-1', 'pronoun'],
    ['u02-4', 'person:vosotros'],
  ])('%s has no %s transform', (id, key) => {
    expect(tr(id, key)).toBeUndefined();
  });
  test('object pronoun with an infinitive accepts both placements', () => {
    const t = tr('u02-5', 'pronoun')!;
    expect(checkItem(t, 'Quiero comprarla').pass).toBe(true);
    expect(checkItem(t, 'La quiero comprar').pass).toBe(true);
    expect(checkItem(t, 'Quiero comprarlo').pass).toBe(false);
    expect(checkItem(t, 'Quiero comprarla la casa').pass).toBe(false);
  });
  test('future accepts the present and ir a + infinitive', () => {
    const t = tr('u01-1', 'tense:futuro')!;
    for (const x of ['Mañana comeré pescado', 'Mañana como pescado', 'Mañana voy a comer pescado', 'Comeré pescado mañana']) expect(checkItem(t, x).pass, x).toBe(true);
    expect(checkItem(t, 'Mañana comí pescado').pass).toBe(false);
  });
  test('person transform: the pronoun is optional, but the verb is not', () => {
    const t = tr('u01-1', 'person:nosotros')!;
    expect(checkItem(t, 'Nosotros comemos pescado').pass).toBe(true);
    expect(checkItem(t, 'Comemos pescado').pass).toBe(true);
    expect(checkItem(t, 'Ellos comemos pescado').pass).toBe(false);
    expect(checkItem(t, 'Comen pescado')).toMatchObject({ pass: false, hint: expect.stringMatching(/verb ending/) });
  });
  test('instructions are plain English', () => {
    for (const s of BANK) for (const t of transformItems(s)) expect(t.instruction).not.toMatch(/preterite|subjunctive|clitic|direct object|conjugate/i);
  });
});

describe('the whole ladder', () => {
  const all = BANK.flatMap((s) => ladder(s, { seed: 2 }));
  test('order is choose, type, then transforms', () => {
    const l = ladder(byId('u01-1'));
    expect(l[0].kind).toBe('choose');
    expect(l[1].kind).toBe('typeForm');
    expect(l.slice(2).every((x) => x.kind === 'transform')).toBe(true);
  });
  test('ids unique and stable across seeds', () => {
    expect(new Set(all.map((i) => i.id)).size).toBe(all.length);
    expect(BANK.flatMap((s) => ladder(s, { seed: 99 })).map((i) => i.id)).toEqual(all.map((i) => i.id));
  });
  test('no item shows or models vosotros', () => {
    for (const it of all) for (const es of producedSpanish(it)) expect(hasVosotros(es), `${it.id}: ${es}`).toBe(false);
  });
  test('no transform answer equals its source', () => {
    for (const it of all) if (it.kind === 'transform') expect(it.answer.toLowerCase()).not.toBe(it.source.toLowerCase());
  });
});
