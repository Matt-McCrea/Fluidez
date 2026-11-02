// LG-096, LG-097, LG-098: who is speaking, and who is being spoken to.
//
// The English does not say the speaker's gender, the listener's, or (untagged)
// whether "you" is tú, usted or ustedes. Every Spanish answer that is right for
// one of them is right. A tag that names a register ("(polite)", "(formal)")
// holds the learner to it.
import { describe, expect, test } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { enYou } from '../../src/exercises/spanish';

type Row = [es: string, en: string, input: string];
const ok = ([es, en, input]: Row) => matchTranslation(input, { es, en });

describe('the speaker may be a woman, whatever verb comes first', () => {
  test.each<Row>([
    ['Tengo veinte años y estoy contento.', "I'm twenty and I'm happy.", 'Tengo veinte años y estoy contenta.'],
    ['Estoy enfermo, Vale.', "I'm ill, Vale.", 'Estoy enferma, Vale.'],
    ['Es que estoy ocupado.', "It's just that I'm busy.", 'Es que estoy ocupada.'],
    ['Estoy demasiado cansado para salir esta noche.', "I'm too tired to go out tonight.", 'Estoy demasiado cansada para salir esta noche.'],
    ['Vi una serpiente en el camino a la finca y me quedé quieta.', 'I saw a snake on the road to the farm and froze.', 'Vi una serpiente en el camino a la finca y me quedé quieto.'],
    ['Cuando llegué a casa me sentí muy solo.', 'When I got home I felt very lonely.', 'Cuando llegué a casa me sentí muy sola.'],
    ['Soy colombiano y estoy orgulloso.', "I'm Colombian and I'm proud.", 'Soy colombiana y estoy orgullosa.'],
    ['Nosotros estamos cansados y ellos están contentos.', "We're tired and they're happy.", 'Nosotras estamos cansadas y ellos están contentos.'],
    ['Tengo un perro cansado y estoy contento.', "I have a tired dog and I'm happy.", 'Tengo un perro cansado y estoy contenta.'],
  ])('%s / "%s": %s', (es, en, input) => {
    const r = ok([es, en, input]);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.variant).toBeUndefined();
  });

  test('both genders still pass when the first verb is the copula', () => {
    expect(ok(['Estoy cansado.', "I'm tired.", 'Estoy cansada.']).pass).toBe(true);
  });

  test.each<Row>([
    // the English names a man or a woman: the Spanish must agree with it
    ['Está cansado.', "He's tired.", 'Está cansada.'],
    ['Mi hermana está contenta y yo estoy cansado.', "My sister is happy and I'm tired.", 'Mi hermana está contenta y yo estoy cansada.'],
    // an adjective of something else is not the speaker's
    ['Tengo un perro cansado y estoy contento.', "I have a tired dog and I'm happy.", 'Tengo un perro cansada y estoy contenta.'],
    ['Tengo un perro cansado y estoy contento.', "I have a tired dog and I'm happy.", 'Tengo un perro cansado y estoy contentos.'],
    // only the right ending: a wrong one is still wrong
    ['Estoy cansado.', "I'm tired.", 'Estoy cansadas.'],
    ['Estoy cansado.', "I'm tired.", 'Estoy cansadao.'],
  ])('not for %s / "%s": %s', (es, en, input) => {
    expect(ok([es, en, input]).pass).toBe(false);
  });

  // the scan reads every clause, so it must not flip what is not the speaker's adjective
  test.each<Row>([
    ['No digo que la entidad sea corrupta, pero tampoco transparente.', "I'm not saying the agency is corrupt, but it's not transparent either.", 'No digo que la entidad sea corrupto, pero tampoco transparente.'],
    ['Por mí, nos quedamos otra noche en el hostal.', 'As far as I am concerned, we can stay another night at the hostel.', 'Por mí, nos quedamos otro noche en el hostal.'],
    ['Soy Hernando, ¿y usted?', "I'm Hernando, and you? (polite)", 'Soy Hernanda, ¿y usted?'],
    ['Estoy lavando la ropa.', "I'm washing the clothes.", 'Estoy lavanda la ropa.'],
    ['Somos solo dos: mi mamá y yo.', 'There are only two of us: my mum and me.', 'Somos sola das: mi mamá y yo.'],
    ['¿Están emocionados, chicos?', 'Are you all excited, guys?', '¿Están emocionadas, chicos?'],
  ])('only the speaker is flipped: %s', (es, en, input) => {
    expect(ok([es, en, input]).pass).toBe(false);
  });

  test('the other gender is not offered for a noun that follows "un"', () => {
    expect(ok(['Soy un buen amigo.', "I'm a good friend.", 'Soy un buen amiga.']).pass).toBe(false);
  });
});

describe('the listener may be a woman too', () => {
  test.each<Row>([
    ['De ninguna manera te voy a dejar sola con esto.', "There's no way I'm leaving you alone with this.", 'De ninguna manera te voy a dejar solo con esto.'],
    ['Te veo muy cansada hoy.', 'You look very tired today.', 'Te veo muy cansado hoy.'],
    ['Te dejo solo.', "I'll leave you alone.", 'Te dejo sola.'],
  ])('%s / "%s": %s', (es, en, input) => {
    const r = ok([es, en, input]);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test.each<Row>([
    ['Te veo preocupada, Mariana.', 'You look worried, Mariana.', 'Te veo preocupado, Mariana.'],
  ])('a name in the sentence may say who it is: %s', (es, en, input) => {
    expect(ok([es, en, input]).pass).toBe(false);
  });

  test('"solo" meaning only is not an adjective', () => {
    // "I only leave you a message": nothing to agree
    expect(ok(['Solo te dejo un mensaje.', 'I only leave you a message.', 'Sola te dejo un mensaje.']).pass).toBe(false);
  });
});

describe('a usted model also stands for tú and ustedes when the English only says "you"', () => {
  test.each<Row>([
    ['¿Quiere bolsa?', 'Do you want a bag?', '¿Quieres bolsa?'],
    ['¿Quiere bolsa?', 'Do you want a bag?', '¿Quieren bolsa?'],
    ['¿Tiene un documento de identidad?', 'Do you have an identity document?', '¿Tienes un documento de identidad?'],
    ['¿Me repite, por favor?', 'Could you repeat that, please?', '¿Me repites, por favor?'],
    ['¿Con quién quiere hablar?', 'Who do you want to talk to?', '¿Con quién quieres hablar?'],
    ['¿Cuánto pagó?', 'How much did you pay?', '¿Cuánto pagaste?'],
    ['¿Me da el mapa?', 'Will you give me the map?', '¿Me das el mapa?'],
    ['¿Vendieron el anillo?', 'Did you sell the ring?', '¿Vendiste el anillo?'],
    ['¿Vendieron el anillo?', 'Did you sell the ring?', '¿Vendió el anillo?'],
    ['¿Vendieron el anillo?', 'Did you sell the ring?', '¿Vendieron el anillo?'],
    // with gustar the "you" is the clitic
    ['¿Le gusta el café?', 'Do you like coffee?', '¿Te gusta el café?'],
    ['¿Le gusta el café?', 'Do you like coffee?', '¿Les gusta el café?'],
  ])('%s / "%s": %s', (es, en, input) => {
    const r = ok([es, en, input]);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.variant).toBeUndefined();
  });

  test('the register used is reported', () => {
    expect(ok(['¿Quiere bolsa?', 'Do you want a bag?', '¿Quieres bolsa?']).register).toBe('tú');
    // the model itself is the author's form, not a register variant
    expect(ok(['¿Quiere bolsa?', 'Do you want a bag?', '¿Quiere bolsa?']).register).toBeUndefined();
    expect(ok(['¿Quiere bolsa?', 'Do you want a bag?', '¿Quieren bolsa?']).register).toBe('ustedes');
  });

  test.each<Row>([
    // "you" is not the subject: nothing about the verb is tú
    ['Le dice la verdad.', 'He tells her the truth.', 'Te dice la verdad.'],
    ['¿Quiere bolsa?', 'Does she want a bag?', '¿Quieres bolsa?'],
    ['¿Quiere bolsa tu hermana?', 'Does your sister want a bag?', '¿Quieres bolsa tu hermana?'],
    ['Le gusta el café.', 'She likes coffee.', 'Te gusta el café.'],
    ['¿A usted le gusta el café?', 'Do you like coffee? (polite)', '¿A ti te gusta el café?'],
    // a se, or another subject in the English, is not "you"
    ['¿Cómo así que cerraron la cabina?', 'What do you mean they closed the booth?', '¿Cómo así que cerraste la cabina?'],
    ['No se debe encender una vela.', "You mustn't light a candle.", 'No se debes encender una vela.'],
    // a wrong form is still wrong
    ['¿Quiere bolsa?', 'Do you want a bag?', '¿Quieras bolsa?'],
    ['¿Quiere bolsa?', 'Do you want a bag?', '¿Queremos bolsa?'],
  ])('not for %s / "%s": %s', (es, en, input) => {
    expect(ok([es, en, input]).pass).toBe(false);
  });
});

describe('the register tags are honoured', () => {
  test.each([
    ['Do you work in La Candelaria? (polite)', 'formal'],
    ['Do you work in La Candelaria? (formal)', 'formal'],
    ['Do you work in La Candelaria? (to a friend)', 'informal'],
    ['Do you work in La Candelaria? (informal)', 'informal'],
    ['Do you work in La Candelaria?', 'open'],
    ['Oh, I am so sorry! (polite)', 'none'],
  ])('%s is %s', (en, mode) => {
    expect(enYou(en)).toBe(mode);
  });

  test('(polite) holds the learner to usted', () => {
    const en = 'Do you work in La Candelaria? (polite)';
    for (const model of ['¿Trabaja en La Candelaria?', '¿Trabaja usted en La Candelaria?']) {
      expect(ok([model, en, '¿Trabaja en La Candelaria?']).pass, model).toBe(true);
      expect(ok([model, en, '¿Trabaja usted en La Candelaria?']).pass, model).toBe(true);
      expect(ok([model, en, '¿Trabajas en La Candelaria?']).pass, model).toBe(false);
      expect(ok([model, en, '¿Trabajan ustedes en La Candelaria?']).pass, model).toBe(false);
    }
  });

  test('without a tag the same usted model also takes tú', () => {
    const en = 'Do you work in La Candelaria?';
    for (const model of ['¿Trabaja en La Candelaria?', '¿Trabaja usted en La Candelaria?']) {
      expect(ok([model, en, '¿Trabajas en La Candelaria?']).pass, model).toBe(true);
    }
  });

  test('(polite) with "you all" stays plural', () => {
    const r = ok(['¿Será que podrían poner la música más baja?', 'Could you all possibly put the music lower? (polite)', '¿Será que podrían poner la música más baja?']);
    expect(r.pass).toBe(true);
    // the plural is not collapsed into a singular usted
    expect(ok(['¿Será que podrían poner la música más baja?', 'Could you all possibly put the music lower? (polite)', '¿Será que podría poner la música más baja?']).pass).toBe(false);
  });

  test('a tú row stays tú-only', () => {
    const tu = '¿Trabajas en La Candelaria?';
    const en = 'Do you work in La Candelaria? (to a friend)';
    expect(ok([tu, en, '¿Trabajas en La Candelaria?']).pass).toBe(true);
    expect(ok([tu, en, '¿Trabaja en La Candelaria?']).pass).toBe(false);
  });
});
