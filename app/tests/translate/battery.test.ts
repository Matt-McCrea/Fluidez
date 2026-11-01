// The lead's battery for the translation matcher: the real matcher with an empty
// accept list, valid answers that must pass and wrong ones that must fail, each
// with the reason it fails. It started as 17 sentences of which 8 of the 10
// valid ones were refused with a false reason and the two classic gustar errors
// passed. Every case here has a model sentence and its English, so the outcome
// is a fact about the matcher and not about a bank row that may move.
//
// A swap that changes what a card teaches (Mañana te llamo for a card on voy a
// llamar) is not accepted by the matcher alone. A card gets those from the bank
// rows that share its English, passed in as `also`; the group at the bottom
// shows that route, and is where the variant engine's notes will attach.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { matchTranslation, HINT_TEXT } from '../../src/check/translate';
import { wordHint } from '../../src/check/wordhint';

/** Every `step`th row of the real bank, up to `n`: sentences the matcher meets for real. */
function bankSentence(n: number): Array<{ es: string; en: string; accept?: string[] }> {
  const dir = new URL('../../content/bank/', import.meta.url);
  const rows = readdirSync(dir).filter((f) => /^u\d+\.json$/.test(f))
    .flatMap((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as Array<{ es: string; en: string; accept?: string[] }>);
  const step = Math.floor(rows.length / n);
  return rows.filter((_, i) => i % step === 0).slice(0, n);
}

interface Case { es: string; en: string; input: string; note?: string }
const run = (c: Case, also: string[] = []) => matchTranslation(c.input, { es: c.es, en: c.en }, { also });

/** Phrases a hint may only use when the diff proves them. */
const OVERCLAIM = /isn't the word here|check the meaning|Start with the verb|spelling/;

const VALID: Case[] = [
  // the model, and the order and the clitic freedom Spanish gives it
  { es: 'Te voy a llamar mañana.', en: "I'm going to call you tomorrow.", input: 'Te voy a llamar mañana.' },
  { es: 'Te voy a llamar mañana.', en: "I'm going to call you tomorrow.", input: 'Voy a llamarte mañana.' },
  { es: 'Te voy a llamar mañana.', en: "I'm going to call you tomorrow.", input: 'Mañana te voy a llamar.' },
  { es: 'Mañana te llamo.', en: "I'll call you tomorrow.", input: 'Mañana te llamo.' },
  { es: 'Mañana te llamo.', en: "I'll call you tomorrow.", input: 'Te llamo mañana.' },
  { es: 'Mañana te llamaré.', en: "I'll call you tomorrow.", input: 'Te llamaré mañana.' },
  { es: 'Mañana te llamaré.', en: "I'll call you tomorrow.", input: 'Mañana lo llamaré.', note: 'usted for tú' },
  // "la mañana" is a noun phrase, not the adverb "mañana"
  { es: 'Trabajo en la mañana.', en: 'I work in the morning.', input: 'Trabajo en la mañana.' },
  { es: 'Trabajo en la mañana.', en: 'I work in the morning.', input: 'En la mañana trabajo.' },
  { es: 'Trabajo en la mañana.', en: 'I work in the morning.', input: 'Yo trabajo en la mañana.' },
  // irme and its kin: the clitic after the infinitive, or in front of the verb
  { es: 'Ella se tiene que ir.', en: 'She has to leave.', input: 'Ella se tiene que ir.' },
  { es: 'Ella se tiene que ir.', en: 'She has to leave.', input: 'Ella tiene que irse.' },
  { es: 'Ella se tiene que ir.', en: 'She has to leave.', input: 'Se tiene que ir.' },
  { es: 'Me tengo que ir.', en: 'I have to go.', input: 'Tengo que irme.' },
  { es: 'Tengo que irme.', en: 'I have to go.', input: 'Me tengo que ir.' },
  // -ra and -se are one tense
  { es: 'Viajaría si tuviera dinero.', en: 'I would travel if I had money.', input: 'Viajaría si tuviera dinero.' },
  { es: 'Viajaría si tuviera dinero.', en: 'I would travel if I had money.', input: 'Viajaría si tuviese dinero.' },
  { es: 'Si tuviera dinero, viajaría.', en: 'If I had money, I would travel.', input: 'Si tuviese dinero, viajaría.' },
  { es: 'Si tuviese dinero, viajaría.', en: 'If I had money, I would travel.', input: 'Si tuviera dinero, viajaría.' },
  // gustar: the person it is for is a clitic, with or without "a ella" in front
  { es: 'A ella le gusta el café.', en: 'She likes coffee.', input: 'A ella le gusta el café.' },
  { es: 'A ella le gusta el café.', en: 'She likes coffee.', input: 'Le gusta el café.' },
  { es: 'Me gusta el café.', en: 'I like coffee.', input: 'A mí me gusta el café.' },
  { es: 'Me gusta el café.', en: 'I like coffee.', input: 'Me gusta el café.' },
  // a Latin American word, and the Peninsular one, flagged
  { es: 'Ayer compramos el carro.', en: 'Yesterday we bought the car.', input: 'Ayer compramos el carro.' },
  { es: 'Ayer compramos el carro.', en: 'Yesterday we bought the car.', input: 'Compramos el carro ayer.' },
  { es: 'Ayer compramos el carro.', en: 'Yesterday we bought the car.', input: 'Nosotros compramos el carro ayer.' },
  { es: 'Ayer compramos el carro.', en: 'Yesterday we bought the car.', input: 'Ayer compramos el coche.', note: 'peninsular' },
  // two clitics in a row
  { es: 'Se lo di a ella.', en: 'I gave it to her.', input: 'Se lo di a ella.' },
  { es: 'Se lo di a ella.', en: 'I gave it to her.', input: 'Yo se lo di a ella.' },
];

describe('valid answers pass', () => {
  test.each(VALID)('"$es" for "$en": $input', (c) => {
    const r = run(c);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.hint).toBeUndefined();
    expect(r.variant).toBe(c.note === 'peninsular' ? 'peninsular' : undefined);
  });
});

interface Wrong extends Case { kind: string; hint?: RegExp }

const WRONG: Wrong[] = [
  // gustar with a subject pronoun in front of its clitic
  { es: 'Me gusta el café.', en: 'I like coffee.', input: 'Yo me gusta el café.', kind: 'experiencer', hint: /gustar/ },
  { es: 'A ella le gusta el café.', en: 'She likes coffee.', input: 'Ella le gusta el café.', kind: 'experiencer', hint: /gustar/ },
  // ser for estar, and the closed pair the course teaches apart
  { es: 'Estoy aburrido.', en: "I'm bored.", input: 'Soy aburrido.', kind: 'ser-estar', hint: /Ser or estar/ },
  // the mood, not the ending
  { es: 'Quiero que vengas.', en: 'I want you to come.', input: 'Quiero que vienes.', kind: 'mood', hint: /only held up as an idea/ },
  // not the verb, not the spelling: a different word, said as that
  { es: 'Tengo treinta años.', en: "I'm thirty years old.", input: 'Soy treinta.', kind: 'differs' },
  { es: 'Tengo treinta años.', en: "I'm thirty years old.", input: 'Soy treinta años.', kind: 'wrong-word', hint: /"soy"/ },
  { es: 'Fui a la tienda a comprar leche.', en: 'I went to the store to buy milk.', input: 'Fui a la tienda por comprar leche.', kind: 'wrong-word', hint: /"por"/ },
  // an extra word, and nothing else wrong
  { es: 'Estoy buscando mi llave.', en: "I'm looking for my key.", input: 'Estoy buscando para mi llave.', kind: 'extra-word', hint: /"para"/ },
];

describe('wrong answers fail, for the reason that is true', () => {
  test.each(WRONG)('"$es" for "$en": $input', (c) => {
    const r = run(c);
    expect(r.pass, JSON.stringify(r)).toBe(false);
    expect(r.hintKind, JSON.stringify(r)).toBe(c.kind);
    if (c.hint) expect(r.hint).toMatch(c.hint);
    expect(r.hint ?? '').not.toMatch(OVERCLAIM);
    expect(r.hint ?? '').not.toMatch(/xnum|[—–]/);
  });

  test('a wrong answer is never passed by a spelling or a pronoun excuse', () => {
    for (const c of WRONG) {
      const r = run(c);
      expect(r.near, c.input).toBeFalsy();
      expect(r.hintKind, c.input).not.toBe('accents');
    }
  });

  test('the closest accepted form to reveal is the model', () => {
    expect(run(WRONG[2]).closest).toBe('Estoy aburrido.');
    expect(run(WRONG[3]).closest).toBe('Quiero que vengas.');
  });
});

describe('the right sentences next to the wrong ones are not collateral damage', () => {
  test.each<Case>([
    { es: 'Él no me cae bien.', en: "I don't like him.", input: 'Él no me cae bien.' },
    { es: 'Él no me cae bien.', en: "I don't like him.", input: 'No me cae bien.' },
    { es: 'Tú te quedas aquí.', en: 'You stay here.', input: 'Tú te quedas aquí.' },
    { es: 'Tú te quedas aquí.', en: 'You stay here.', input: 'Te quedas aquí.' },
    { es: 'A ella le gusta el café.', en: 'She likes coffee.', input: 'A ella le gusta el café.' },
    { es: 'A mí me gusta.', en: 'I like it.', input: 'A mí me gusta.' },
    { es: 'A mí me gusta.', en: 'I like it.', input: 'Me gusta.' },
  ])('"$input" for "$es"', (c) => {
    const r = run(c);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });
});

describe('swaps that change the target come from the bank, with the English they share', () => {
  const group = ['Te voy a llamar mañana.', 'Mañana te llamo.', 'Mañana te llamaré.'];
  const en = "I'll call you tomorrow.";
  test.each(group)('%s is an answer for the others\' English too', (es) => {
    const others = group.filter((g) => g !== es);
    for (const model of others) {
      expect(matchTranslation(es, { es: model, en }, { also: group.filter((g) => g !== model) }).pass, `${es} for ${model}`).toBe(true);
    }
  });

  test('without the bank rows they are not accepted: the matcher alone does not know the card allows them', () => {
    expect(matchTranslation('Mañana te llamo.', { es: 'Te voy a llamar mañana.', en }).pass).toBe(false);
  });
});

describe('a gap with one typed word gets the same honesty', () => {
  test.each<[string, string, string]>([
    ['soy', 'estoy', 'ser-estar'],
    ['vienes', 'vengas', 'mood'],
  ])('%s for %s is %s', (typed, answer, kind) => {
    expect(wordHint(typed, [answer])?.kind).toBe(kind);
  });
  test('the hint texts have no markup', () => {
    for (const t of Object.values(HINT_TEXT)) expect(t).not.toMatch(/[—–]|\*/);
  });
});

describe('latency', () => {
  // generous on purpose: this guards against a matcher that scans the corpus per call, not against a slow laptop
  const sentences = bankSentence(300);

  test('one call costs milliseconds, not the corpus', () => {
    matchTranslation('Hola.', { es: 'Hola.', en: 'Hi.' });                       // load the engine's tables first
    const times: number[] = [];
    for (const s of sentences) {
      for (const input of [s.es, s.es.split(' ').reverse().join(' ')]) {
        const t0 = performance.now();
        matchTranslation(input, { es: s.es, en: s.en, accept: s.accept });
        times.push(performance.now() - t0);
      }
    }
    times.sort((a, b) => a - b);
    const p95 = times[Math.floor(times.length * 0.95)];
    expect(times.length).toBeGreaterThanOrEqual(400);
    expect(p95, `p95 ${p95.toFixed(2)} ms`).toBeLessThan(20);
    expect(times[times.length - 1], `max ${times[times.length - 1].toFixed(1)} ms`).toBeLessThan(500);
  });

  test('the whole battery runs in well under a second', () => {
    const t0 = performance.now();
    for (const c of [...VALID, ...WRONG]) run(c);
    expect(performance.now() - t0).toBeLessThan(1000);
  });
});
