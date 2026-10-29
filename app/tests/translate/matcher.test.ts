// The English→Spanish translation matcher: canonicalisation, variants, hints,
// and the one-self-correction flow. Plus the es→en English matcher.
import { describe, expect, test } from 'vitest';
import {
  canon, expandAccepted, matchEnglish, matchTranslation, peninsularVariants, registerVariants, startAttempt, submitAttempt,
} from '../../src/check/translate';
import { BankSentence } from '../../src/content/schema';
import { byId } from '../exercises/fixtures';

const S = (es: string, en: string, accept: string[] = []) => BankSentence.parse({ id: 't', es, en, accept });

type Row = [id: string, input: string];

describe('passes: free variation Spanish allows', () => {
  test.each<Row>([
    ['u01-1', 'Como pescado.'],
    ['u01-1', 'como pescado'],
    ['u01-1', 'COMO PESCADO'],
    ['u01-1', '  como   pescado  '],
    ['u01-1', 'Yo como pescado.'],
    ['u01-1', 'yo como pescado!'],
    ['u01-2', 'Yo hablo español en casa'],
    ['u01-3', 'Nosotros vivimos en Lima.'],
    ['u01-3', 'Nosotras vivimos en Lima.'],
    ['u01-4', 'Hablas inglés?'],
    ['u01-4', '¿Tú hablas inglés?'],
    ['u01-4', '¿Hablas tú inglés?'],
    ['u01-5', 'Trabaja en un banco.'],
    ['u01-5', 'Ella trabaja en un banco'],
    ['u01-6', 'Estoy cansado'],
    ['u01-6', 'Yo estoy cansado.'],
    ['u01-6', 'Estoy cansada.'],                       // the English does not say who is speaking
    ['u01-8', 'Yo me levanto temprano.'],
    ['u02-1', 'Comí pescado ayer.'],
    ['u02-1', 'Ayer yo comí pescado.'],
    ['u02-1', 'Yo comí pescado ayer'],
    ['u02-5', 'Yo quiero comprar la casa.'],
    ['u02-5', 'Quiero comprar la casa'],
    ['u02-9', 'Voy a ver la película.'],
    ['u04-3', 'Comimos ya.'],
    ['u04-3', 'Nosotros ya comimos.'],
    ['u04-4', 'Estudio también francés.'],
    ['u04-4', 'Estudio francés también.'],
    ['u04-4', 'Yo también estudio francés.'],
    ['u04-5', 'Conduzco el carro de mi papá.'],         // listed in accept
    ['u05-1', 'Hablan muy bien.'],
    ['u05-3', 'Desayuno siempre a las siete.'],
    ['u05-3', 'Desayuno a las siete siempre.'],
    ['u05-5', 'Hoy cocino.'],
    ['u05-5', 'Cocino hoy.'],
    ['u05-5', 'Yo cocino hoy.'],
    ['u06-1', 'Todos los días estudio.'],
    ['u06-1', 'Estudio todos los días'],
    ['u06-3', 'Viajo mañana a Quito.'],
    ['u06-3', 'Viajo a Quito mañana.'],
    ['u06-6', 'Está contenta.'],
  ])('%s: "%s"', (id, input) => {
    const r = matchTranslation(input, byId(id));
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.variant).toBeUndefined();
  });
});

describe('clitic position: proclitic = enclitic only where Spanish allows it', () => {
  const pairs: Array<[string, string, string, boolean]> = [
    ['Voy a verlo.', 'I am going to see him.', 'Lo voy a ver.', true],
    ['Lo voy a ver.', 'I am going to see him.', 'Voy a verlo.', true],
    ['Quiero comprarla.', 'I want to buy it.', 'La quiero comprar.', true],
    ['Estoy leyéndolo.', "I'm reading it.", 'Lo estoy leyendo.', true],
    ['Lo estoy leyendo.', "I'm reading it.", 'Estoy leyéndolo.', true],
    ['No quiero verla.', "I don't want to see her.", 'No la quiero ver.', true],
    ['Puedo hacerlo.', 'I can do it.', 'Lo puedo hacer.', true],
    ['Te lo voy a dar.', "I'm going to give it to you.", 'Voy a dártelo.', true],
    ['Odio hacerlo.', 'I hate doing it.', 'Lo odio hacer.', false],      // odiar does not let it climb
    ['Dámelo.', 'Give it to me.', 'Me lo das.', false],                   // a command is not a question
    ['¿Me lo das?', 'Will you give it to me?', 'Dámelo.', false],
    ['Voy a verlo.', 'I am going to see him.', 'Voy a lo ver.', false],
    ['Voy a verlo.', 'I am going to see him.', 'Voy lo a ver.', false],
  ];
  test.each(pairs)('%s accepts "%s"→ %s: %s', (es, en, input, ok) => {
    expect(matchTranslation(input, S(es, en)).pass).toBe(ok);
  });
  test('enclitic accent slip is near, not pass', () => {
    const r = matchTranslation('Estoy leyendolo', S('Estoy leyéndolo.', "I'm reading it."));
    expect(r.pass).toBe(false);
    expect(r.near).toBe(true);
  });
  test('canonical form of both placements is identical', () => {
    expect(canon('Voy a verlo').toks.map((t) => t.t)).toEqual(canon('Lo voy a ver').toks.map((t) => t.t));
  });
});

describe('subject pronouns: optional, but never contradicting the English', () => {
  test.each<[string, string, boolean]>([
    ['u01-5', 'Él trabaja en un banco.', false],       // "She works"
    ['u01-5', 'Usted trabaja en un banco.', false],
    ['u01-1', 'Tú comes pescado', false],
    ['u01-3', 'Ellos viven en Lima', false],
    ['u01-3', 'Nosotros vivimos en Lima', true],
    ['u05-2', '¿Dónde vives tú?', true],
    ['u05-2', '¿Dónde vive usted?', true],             // "you" is open
    ['u05-2', '¿Dónde viven ustedes?', true],
    ['u05-2', '¿Dónde vive él?', false],
  ])('%s "%s" → %s', (id, input, ok) => {
    expect(matchTranslation(input, byId(id)).pass).toBe(ok);
  });
  test('a contradicting pronoun gives the subject hint', () => {
    const r = matchTranslation('Él trabaja en un banco.', byId('u01-5'));
    expect(r.hintKind).toBe('subject');
    expect(r.hint).toMatch(/subject/i);
  });
  test('an unaccented él before an agreeing verb is an accent slip', () => {
    const r = matchTranslation('el trabaja en un banco', S('Él trabaja en un banco.', 'He works in a bank.'));
    expect(r).toMatchObject({ pass: false, near: true, hintKind: 'accents' });
  });
});

describe('"you": tú, usted and ustedes all pass when the English leaves it open', () => {
  test.each<[string, string, string | undefined]>([
    ['u01-4', '¿Hablas inglés?', undefined],
    ['u01-4', '¿Habla inglés?', 'usted'],
    ['u01-4', '¿Habla usted inglés?', 'usted'],
    ['u01-4', '¿Usted habla inglés?', 'usted'],
    ['u01-4', '¿Hablan inglés?', 'ustedes'],
    ['u01-4', '¿Ustedes hablan inglés?', 'ustedes'],
    ['u05-2', '¿Dónde vive?', 'usted'],
    ['u03-6', 'Este regalo es para usted.', 'usted'],
    ['u03-6', 'Este regalo es para ustedes.', 'ustedes'],
  ])('%s "%s" (%s)', (id, input, register) => {
    const r = matchTranslation(input, byId(id));
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.register).toBe(register);
    expect(r.variant).toBeUndefined();
  });
  test('formal English pins usted', () => {
    const s = S('¿Habla usted inglés?', 'Do you speak English? (formal)');
    expect(matchTranslation('¿Hablas inglés?', s).pass).toBe(false);
    expect(matchTranslation('¿Habla inglés?', s).pass).toBe(true);
  });
  test('"you all" pins ustedes', () => {
    expect(matchTranslation('Hablas muy bien', byId('u05-1')).pass).toBe(false);
    expect(matchTranslation('Ustedes hablan muy bien', byId('u05-1')).pass).toBe(true);
  });
  test('reflexive tú becomes reflexive usted', () => {
    const s = S('¿A qué hora te levantas?', 'What time do you get up?');
    expect(matchTranslation('¿A qué hora se levanta?', s).pass).toBe(true);
    expect(matchTranslation('¿A qué hora se levantan ustedes?', s).pass).toBe(true);
  });
  test('object "te" has usted forms lo / la / le', () => {
    const s = S('Te llamo mañana.', "I'll call you tomorrow.");
    for (const x of ['Lo llamo mañana.', 'La llamo mañana.', 'Le llamo mañana.', 'Los llamo mañana.']) expect(matchTranslation(x, s).pass, x).toBe(true);
  });
  test('register variants are never produced for a sentence without "you"', () => {
    expect(registerVariants('Como pescado.', 'I eat fish.')).toEqual([]);
  });
  test('no register variant is Peninsular except vosotros', () => {
    for (const v of registerVariants('¿Hablas inglés?', 'Do you speak English?')) {
      expect(v.variant === 'peninsular').toBe(v.register === 'vosotros');
    }
  });
});

describe('Peninsular answers pass, flagged; never required', () => {
  test.each<[string, string]>([
    ['u04-5', 'Manejo el coche de mi papá.'],
    ['u04-5', 'Conduzco el coche de mi papá.'],
    ['u04-6', 'Tomo zumo de naranja.'],
    ['u04-7', 'Mi ordenador es nuevo.'],                // gender follows: el ordenador, nuevo
    ['u05-1', 'Vosotros habláis muy bien.'],
    ['u05-1', 'Habláis muy bien.'],
    ['u01-4', '¿Habláis inglés?'],
  ])('%s "%s"', (id, input) => {
    const r = matchTranslation(input, byId(id));
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.variant).toBe('peninsular');
  });
  test('a half-converted gender is not accepted (mi ordenador es nueva)', () => {
    expect(matchTranslation('Mi ordenador es nueva.', byId('u04-7')).pass).toBe(false);
  });
  test('the Latin American model never carries the flag', () => {
    expect(matchTranslation('Tomo jugo de naranja.', byId('u04-6')).variant).toBeUndefined();
  });
  test('the model answer is first and not Peninsular', () => {
    const vs = expandAccepted(byId('u04-5'));
    expect(vs[0]).toMatchObject({ es: 'Manejo el carro de mi papá.', model: true });
    expect(vs[0].variant).toBeUndefined();
  });
  test('verbs re-inflect: manejar → conducir in the same cell', () => {
    expect(peninsularVariants('Ayer manejamos a Quito.')).toContain('Ayer condujimos a Quito.');
  });
  test('caller-supplied word swaps', () => {
    expect(peninsularVariants('Tengo una pluma.', { pluma: 'bolígrafo' })).toContain('Tengo una bolígrafo.'.replace('una bolígrafo', 'una bolígrafo'));
  });
  test('Peninsular accent slip is near, not pass', () => {
    const r = matchTranslation('Mi ordenador es nuevó', byId('u04-7'));
    expect(r.pass).toBe(false);
  });
});

describe('adverbial position: the explicit rule', () => {
  // legal: sentence start, just before the verb group, just after it, sentence end
  const s = S('Ya comimos el pescado.', 'We already ate the fish.');
  test.each<[string, boolean]>([
    ['Ya comimos el pescado.', true],
    ['Comimos ya el pescado.', true],                   // right after the verb
    ['Comimos el pescado ya.', true],                   // sentence-final
    ['Nosotros ya comimos el pescado.', true],
    ['Ya nosotros comimos el pescado.', true],
    ['Comimos el ya pescado.', false],                  // inside the noun phrase
  ])('"%s" → %s', (input, ok) => {
    expect(matchTranslation(input, s).pass).toBe(ok);
  });
  test('an illegal slot gets the word-order hint', () => {
    expect(matchTranslation('Comimos el ya pescado.', s).hintKind).toBe('word-order');
  });
  test('también moves; tampoco is a different word', () => {
    const t = S('También quiero café.', 'I also want coffee.');
    expect(matchTranslation('Quiero café también.', t).pass).toBe(true);
    expect(matchTranslation('Quiero también café.', t).pass).toBe(true);
    expect(matchTranslation('Tampoco quiero café.', t).pass).toBe(false);
  });
  test('ayer after a preposition is fixed ("el pan de ayer")', () => {
    const t = S('Comí el pan de ayer.', "I ate yesterday's bread.");
    expect(matchTranslation('Ayer comí el pan de.', t).pass).toBe(false);
    expect(matchTranslation('Comí el pan de ayer.', t).pass).toBe(true);
  });
  test('la mañana (the morning) is a noun, not the adverb', () => {
    const t = S('Estudio por la mañana.', 'I study in the morning.');
    expect(matchTranslation('Por la mañana estudio.', t).pass).toBe(true);
    expect(matchTranslation('Estudio la por mañana.', t).pass).toBe(false);
  });
  test('two adverbials move independently', () => {
    const t = S('Hoy también trabajo.', "Today I'm also working.");
    expect(matchTranslation('Hoy trabajo también.', t).pass).toBe(true);
    expect(matchTranslation('También trabajo hoy.', t).pass).toBe(true);
  });
  test('nunca is NOT movable (no como nunca ≠ como nunca)', () => {
    const t = S('Nunca como carne.', 'I never eat meat.');
    expect(matchTranslation('Como nunca carne.', t).pass).toBe(false);
  });
});

describe('accents', () => {
  test.each<[string, string]>([
    ['u02-1', 'Ayer comi pescado.'],
    ['u01-4', '¿Hablas ingles?'],
    ['u01-2', 'Hablo español en cása.'],
    ['u05-2', '¿Donde vives?'],
    ['u04-2', 'Vivo alli.'],
  ])('%s "%s" is near with the accent hint', (id, input) => {
    const r = matchTranslation(input, byId(id));
    expect(r.pass).toBe(false);
    expect(r.near).toBe(true);
    expect(r.hint).toBe('Check the accents.');
  });
  test('lenient mode passes an accent slip but still marks it near', () => {
    const r = matchTranslation('Ayer comi pescado', byId('u02-1'), { accents: 'lenient' });
    expect(r).toMatchObject({ pass: true, near: true });
  });
  test('hablo / habló is accent-only: near', () => {
    expect(matchTranslation('Hablo español en casa', S('Habló español en casa.', 'He spoke Spanish at home.'))).toMatchObject({ near: true });
  });
});

describe('hints: one plain-English reason, located at the first difference', () => {
  test.each<[string, string, string, RegExp?]>([
    ['u01-1', 'Come pescado.', 'verb-ending', /who is doing it/],
    ['u02-1', 'Ayer como pescado.', 'verb-ending', /when does it happen/],
    ['u04-9', 'El mesa es grande.', 'article', /mesa is feminine/],
    ['u01-5', 'Ella trabaja en una banco.', 'article', /banco is masculine/],
    ['u06-5', 'Busco la llaves.', 'article', /more than one/],
    ['u01-6', 'Soy cansado.', 'ser-estar', /Ser or estar/],
    ['u03-1', 'La sopa es fría.', 'ser-estar'],
    ['u03-6', 'Este regalo es por ti.', 'por-para'],
    ['u03-5', 'Trabajo para mi familia.', 'por-para'],
    ['u02-6', 'La veo.', 'pronoun'],
    ['u03-3', 'La casa es blanco.', 'agreement'],
    ['u04-1', 'Mi hermana vive Bogotá.', 'missing-word', /small word/],
    ['u02-3', 'Leo periódico.', 'missing-word'],
    ['u01-1', 'Como el pescado.', 'extra-word', /"el"/],
    ['u01-2', 'Hablo en casa español.', 'word-order'],
    ['u02-4', 'Necesito la lave.', 'spelling'],
    ['u01-1', 'Bebo pescado.', 'wrong-word', /"bebo"/],
  ])('%s "%s" → %s', (id, input, kind, re) => {
    const r = matchTranslation(input, byId(id));
    expect(r.pass).toBe(false);
    expect(r.hintKind, JSON.stringify(r)).toBe(kind);
    if (re) expect(r.hint).toMatch(re);
  });
  test('the hint never contains the right answer word', () => {
    const r = matchTranslation('Come pescado.', byId('u01-1'));
    expect(r.hint).not.toMatch(/como/);
  });
  test('a separated command pronoun is told to attach', () => {
    const r = matchTranslation('Dame lo.', S('Dámelo.', 'Give it to me.'));
    expect(r.hintKind).toBe('attach');
  });
  test('empty input', () => {
    expect(matchTranslation('  ', byId('u01-1')).hintKind).toBe('empty');
  });
  test('closest form is the one to reveal (the register the learner used)', () => {
    const r = matchTranslation('¿Hablan frances?', byId('u01-4'));
    expect(r.closest).toBe('¿Hablan inglés?');
  });
});

describe('accept lists and corpus alternatives', () => {
  test('sentence.accept passes', () => {
    expect(matchTranslation('Conduzco el carro de mi papá', byId('u04-5')).pass).toBe(true);
  });
  test('opts.also passes', () => {
    expect(matchTranslation('Ceno pescado', byId('u01-1'), { also: ['Ceno pescado.'] }).pass).toBe(true);
    expect(matchTranslation('Ceno pescado', byId('u01-1')).pass).toBe(false);
  });
});

describe('one self-correction attempt, then the answer', () => {
  test('right first time: good', () => {
    const st = startAttempt(byId('u01-1'));
    const r = submitAttempt(st, 'Como pescado');
    expect(r).toMatchObject({ status: 'correct', grade: 'good' });
  });
  test('wrong, hint, then right: hard', () => {
    const r1 = submitAttempt(startAttempt(byId('u01-1')), 'Come pescado');
    expect(r1.status).toBe('retry');
    expect(r1.result.hint).toBeTruthy();
    expect(r1.answer).toBeUndefined();                // the answer is not shown yet
    const r2 = submitAttempt(r1.state, 'Como pescado');
    expect(r2).toMatchObject({ status: 'correct', grade: 'hard' });
  });
  test('wrong twice: revealed, again', () => {
    const r1 = submitAttempt(startAttempt(byId('u01-1')), 'Come pescado');
    const r2 = submitAttempt(r1.state, 'Comen pescado');
    expect(r2).toMatchObject({ status: 'revealed', grade: 'again', answer: 'Como pescado.' });
    expect(() => submitAttempt(r2.state, 'x')).toThrow();
  });
  test('an accent slip uses the retry too', () => {
    const r1 = submitAttempt(startAttempt(byId('u02-1')), 'Ayer comi pescado');
    expect(r1).toMatchObject({ status: 'retry' });
    expect(r1.result.hint).toBe('Check the accents.');
  });
  test('history is kept', () => {
    const r1 = submitAttempt(startAttempt(byId('u01-1')), 'Come pescado');
    const r2 = submitAttempt(r1.state, 'Como pescado');
    expect(r2.state.history.map((h) => h.input)).toEqual(['Come pescado', 'Como pescado']);
  });
});

describe('matchEnglish (es→en)', () => {
  const item = { en: "I'm tired.", acceptEn: ['I am exhausted.'] };
  test.each<[string, boolean]>([
    ["I'm tired", true], ['I am tired.', true], ['i am TIRED', true], ['I am exhausted', true],
    ['I was tired', false], ['', false],
  ])('"%s" → %s', (input, ok) => {
    expect(matchEnglish(input, item).pass).toBe(ok);
  });
  test('British and American spelling both pass', () => {
    expect(matchEnglish('My favourite colour', { en: 'My favorite color' }).pass).toBe(true);
    expect(matchEnglish("Tomorrow I'm traveling to Quito", { en: "Tomorrow I'm travelling to Quito." }).pass).toBe(true);
  });
  test('"you" passes for "you all"', () => {
    expect(matchEnglish('You speak very well', { en: 'You all speak very well.' }).pass).toBe(true);
  });
  test('one typo is near', () => {
    expect(matchEnglish('I eat fsh', { en: 'I eat fish.' }).pass).toBe(false);
    expect(matchEnglish('I eat fihs', { en: 'I eat fish.' })).toMatchObject({ pass: false });
    expect(matchEnglish('I speak Spanich at home', { en: 'I speak Spanish at home.' })).toMatchObject({ near: true });
  });
  test("contractions both ways", () => {
    expect(matchEnglish("I don't eat fish", { en: 'I do not eat fish.' }).pass).toBe(true);
    expect(matchEnglish('She does not work', { en: "She doesn't work." }).pass).toBe(true);
  });
});
