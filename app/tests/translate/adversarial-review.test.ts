// What an adversarial review of the checker lane found, on real sentences. Each
// wrong answer below passed through a variant or a canon step that was too
// generous, and each right one lost its near or its reason to one that was too
// eager, so these pin the guards: a false accept teaches wrong Spanish, a false
// reject blames the learner.
import { describe, expect, test } from 'vitest';
import { canon, diagnose, expandAccepted, matchTranslation, registerVariants, HINT_TEXT } from '../../src/check/translate';
import { genderVariants } from '../../src/check/translate/variants';
import { wordHint } from '../../src/check/wordhint';

const S = (es: string, en: string) => ({ es, en });
const forms = (es: string, en: string) => expandAccepted({ es, en }).map((v) => v.es);

describe('the si clause keeps its hubiera, however long it runs', () => {
  test.each([
    ['Si el vecino de arriba no hubiera hecho ruido, habríamos dormido bien.', "If the upstairs neighbour hadn't made noise, we would have slept well.", 'Si el vecino de arriba no habría hecho ruido, habríamos dormido bien.'],
    ['Si el pan no se hubiera acabado, habría podido darte uno.', "If the bread hadn't run out, I could have given you one.", 'Si el pan no se habría acabado, habría podido darte uno.'],
    ['¿Y si hubiéramos cerrado el café ese domingo y nos hubiéramos ido con él?', 'What if we had closed the café that Sunday and gone with him?', '¿Y si hubiéramos cerrado el café ese domingo y nos habríamos ido con él?'],
    ['Si mi hermano, el mayor, hubiera venido, habríamos ido.', 'If my brother, the older one, had come, we would have gone.', 'Si mi hermano, el mayor, habría venido, habríamos ido.'],
    ['Ojalá mi hermano mayor lo hubiera hecho.', 'I wish my older brother had done it.', 'Ojalá mi hermano mayor lo habría hecho.'],
  ])('%s', (es, en, wrong) => {
    expect(matchTranslation(wrong, S(es, en)).pass).toBe(false);
  });
  test('the result clause still swaps, with its note', () => {
    const r = matchTranslation('Si hubiera sabido, hubiera venido.', S('Si hubiera sabido, habría venido.', 'If I had known, I would have come.'));
    expect(r.pass).toBe(true);
    expect(r.note).toBeTruthy();
    expect(matchTranslation('Si mi hermano mayor hubiera sabido, hubiera venido.', S('Si mi hermano mayor hubiera sabido, habría venido.', 'If my older brother had known, he would have come.')).pass).toBe(true);
  });
  test('a hubiera that is not a result clause does not swap', () => {
    expect(matchTranslation('¡Me habrías gritado desde la ventana!', S('¡Me hubieras gritado desde la ventana!', 'You should have shouted to me from the window!')).pass).toBe(false);
    expect(matchTranslation('No te habrías molestado.', S('No te hubieras molestado.', "You shouldn't have bothered.")).pass).toBe(false);
    expect(matchTranslation('¿Hubiera pagado Altamira, según tu fuente?', S('¿Habría pagado Altamira, según tu fuente?', 'Did Altamira pay, according to your source?')).pass).toBe(false);
  });
  test('a question puts the subject inside "would have"', () => {
    expect(matchTranslation('¿Hubiera sobrevivido el café sin la ayuda de Vale?', S('¿Habría sobrevivido el café sin la ayuda de Vale?', "Would the café have survived without Vale's help?")).pass).toBe(true);
  });
  test('a rumour is not a result clause', () => {
    expect(matchTranslation('El alcalde hubiera firmado el permiso.', S('El alcalde habría firmado el permiso.', 'The mayor allegedly signed the permit.')).pass).toBe(false);
    expect(matchTranslation('¡Quién habría sabido lo que iba a pasar!', S('¡Quién hubiera sabido lo que iba a pasar!', 'If only someone had known what was going to happen!')).pass).toBe(false);
  });
  test('a -ra far from its si still takes -se', () => {
    expect(matchTranslation('Si mi hermano mayor viniese, iríamos.', S('Si mi hermano mayor viniera, iríamos.', 'If my older brother came, we would go.')).pass).toBe(true);
  });
});

describe('a bare third-person verb is "you" only when it can be', () => {
  test.each([
    ['¿Cuántos años tendrá Mariana?', 'How old do you think Mariana is?', '¿Cuántos años tendrás Mariana?'],
    ['¿Cuántas personas habrá en el parque?', 'How many people do you think are in the park?', '¿Cuántas personas habrás en el parque?'],
    ['¿Cuánto costaría el carro de Hernando?', "How much do you think Hernando's car cost?", '¿Cuánto costarías el carro de Hernando?'],
    ['¿Qué haría Simón solo en la casa?', 'What do you think Simón did alone in the house?', '¿Qué harías Simón solo en la casa?'],
    ['¿Qué pensaría Tomás de todo esto?', 'What do you think Tomás thought of all this?', '¿Qué pensarías Tomás de todo esto?'],
    ['¿Cómo así que no hay nadie?\nQue todos salieron a almorzar.', "What do you mean there's nobody?\nThat everybody went out to lunch.", '¿Cómo así que no hay nadie? Que todos saliste a almorzar.'],
    ['¿Cómo que la matrícula ya no incluye los libros?', 'What do you mean the registration no longer includes the books?', '¿Cómo que la matrícula ya no incluyes los libros?'],
    ['¿Les cae bien la vendedora?', 'Do you like the saleswoman? (you all)', '¿Les caen bien la vendedora?'],
    ['¿Te robaron?', 'Were you robbed?', '¿Te robasteis?'],
    ['Basta con ver el estado del techo.', 'You only have to look at the state of the roof.', 'Bastas con ver el estado del techo.'],
    ['¡Por ti no pasan los años!', "You haven't aged a day!", '¡Por ti no pasáis los años!'],
    ['Hay que escribir claro para que los lectores entiendan.', 'You have to write clearly so that the readers understand.', 'Hay que escribir claro para que los lectores entiendas.'],
  ])('%s', (es, en, wrong) => {
    expect(forms(es, en)).not.toContain(wrong);
    expect(matchTranslation(wrong, S(es, en)).pass).toBe(false);
  });
  test.each([
    ['¿Habla inglés?', 'Do you speak English?', '¿Hablas inglés?'],
    ['¿Me colabora con una firma aquí?\nPor supuesto.', 'Could you sign here for me?\nOf course.', '¿Me colaboras con una firma aquí? Por supuesto.'],
    ['¿Qué opina de esto?', 'What do you think of this?', '¿Qué opinas de esto?'],
    ['¿Qué ve?', 'What do you see?', '¿Qué ves?'],
  ])('still true of %s', (es, en, right) => {
    expect(matchTranslation(right, S(es, en)).pass).toBe(true);
  });
  test('a group is not one person', () => {
    const en = 'Do you deliver?\nYes, but only until eight. (to several people)';
    expect(registerVariants('¿Entregan a domicilio?\nSí, pero solo hasta las ocho.', en).map((v) => v.register)).not.toContain('tú');
    expect(registerVariants('¿Serían tan amables de apagar los celulares?', 'Would you be so kind as to switch off your phones? (to a group)').map((v) => v.register)).not.toContain('tú');
  });
});

describe('a dative le is "you" only when "you" is who it is for', () => {
  test.each([
    ['¿Crees que le gusta el café?', 'Do you think she likes coffee?', '¿Crees que te gusta el café?'],
    ['¿Sabes si le gusta el café?', 'Do you know if he likes coffee?', '¿Sabes si les gusta el café?'],
    ['¿Qué le gusta a Simón?', 'What do you think Simón likes?', '¿Qué te gusta a Simón?'],
    ['¿Dónde compraste la marca de café que le gusta a Hernando?', 'Where did you buy the brand of coffee that Hernando likes?', '¿Dónde compraste la marca de café que te gusta a Hernando?'],
  ])('%s', (es, en, wrong) => {
    expect(matchTranslation(wrong, S(es, en)).pass).toBe(false);
  });
  test('and it still is for a plain question', () => {
    expect(matchTranslation('¿Te gusta el café?', S('¿Le gusta el café?', 'Do you like coffee?')).pass).toBe(true);
    expect(matchTranslation('¿Qué te parece la casa?', S('¿Qué le parece la casa?', 'What do you think of the house?')).pass).toBe(true);
  });
});

describe('a figure in words keeps its gender and its apocope', () => {
  test.each([
    ['Hay doscientas personas.', 'There are two hundred people.', 'Hay doscientos personas.'],
    ['Tengo veintiún años.', 'I am twenty-one.', 'Tengo veintiuno años.'],
    ['Hay cien libros.', 'There are a hundred books.', 'Hay ciento libros.'],
    ['Hay treinta y una personas.', 'There are thirty-one people.', 'Hay treinta y un personas.'],
    ['Hay ciento cinco libros.', 'There are 105 books.', 'Hay cien cinco libros.'],
  ])('%s', (es, en, wrong) => {
    const r = matchTranslation(wrong, S(es, en));
    expect(r.pass).toBe(false);
    expect(r.hintKind).toBe('agreement');
    expect(r.hint).not.toBe(HINT_TEXT.accents);
  });
  test.each([
    ['Hay doscientas personas.', 'There are two hundred people.', 'Hay 200 personas.'],
    ['Hay doscientas personas.', 'There are two hundred people.', 'Hay doscientas personas.'],
    ['Tengo 200 pesos.', 'I have 200 pesos.', 'Tengo doscientos pesos.'],
    ['Hay 21 personas.', 'There are 21 people.', 'Hay veintiuna personas.'],
    ['Son las dos mil quinientas.', 'There are 2,500.', 'Son las 2.500.'],
    ['El 70 % prefiere café.', '70% prefer coffee.', 'El setenta por ciento prefiere café.'],
    ['El 70 % prefiere café.', '70% prefer coffee.', 'El 70 por cien prefiere café.'],
  ])('digits and the right word still meet: %s / %s', (es, en, right) => {
    expect(matchTranslation(right, S(es, en)).pass).toBe(true);
  });
  test.each([
    ['Tengo veintiún años.', 'I am twenty-one.', 'Tengo veintiun años.'],
    ['Hay un millón de personas.', 'There are a million people.', 'Hay un millon de personas.'],
    ['Hay dos millones de personas.', 'There are two million people.', 'Hay dos millones de personas.'],
  ])('a missing accent on a number is an accent slip: %s', (es, en, input) => {
    const r = matchTranslation(input, S(es, en));
    if (input === es) expect(r.pass).toBe(true);
    else { expect(r.near).toBe(true); expect(r.hintKind).toBe('accents'); }
  });
});

describe('el before a noun that only looks like a verb without its accent', () => {
  test.each([
    ['El envío llegó.', 'The shipment arrived.', 'El envio llegó.'],
    ['El guía habla.', 'The guide speaks.', 'El guia habla.'],
    ['El vacío es grande.', 'The emptiness is big.', 'El vacio es grande.'],
    ['Pagué el envío.', 'I paid the shipping.', 'Pagué el envio.'],
    ['Es el guía del grupo.', 'He is the group guide.', 'Es el guia del grupo.'],
  ])('%s stays an accent slip', (es, en, input) => {
    const r = matchTranslation(input, S(es, en));
    expect(r.near).toBe(true);
    expect(r.hintKind).toBe('accents');
  });
  test.each([
    ['Él sabía la verdad.', 'He knew the truth.', 'El sabia la verdad.'],
    ['Él comió pizza.', 'He ate pizza.', 'El comio pizza.'],
    ['Tú sabías la verdad.', 'You knew the truth.', 'Tu sabias la verdad.'],
  ])('%s is still the pronoun', (es, en, input) => {
    expect(matchTranslation(input, S(es, en)).near).toBe(true);
  });
});

describe('the gustar slip with a word in the way', () => {
  test.each([
    ['También me gusta el café.', 'I like coffee too.', 'Yo también me gusta el café.'],
    ['Siempre me gusta el café.', 'I always like coffee.', 'Yo siempre me gusta el café.'],
    ['Ya le gusta el café.', 'She already likes coffee.', 'Ella ya le gusta el café.'],
    ['Tampoco me gusta el café.', "I don't like coffee either.", 'Yo tampoco me gusta el café.'],
  ])('%s', (es, en, wrong) => {
    expect(matchTranslation(wrong, S(es, en)).pass).toBe(false);
  });
  test('a mí with a word in the way is still right', () => {
    expect(matchTranslation('A mí también me gusta el café.', S('También me gusta el café.', 'I like coffee too.')).pass).toBe(true);
    expect(matchTranslation('A mí tampoco me gusta el café.', S('Tampoco me gusta el café.', "I don't like coffee either.")).pass).toBe(true);
  });
  test('a pronoun that is not the clitic is not optional', () => {
    expect(matchTranslation('A mí te gusto.', S('Te gusto.', 'You like me.')).pass).toBe(false);
    expect(matchTranslation('A ti me gustas.', S('Me gustas.', 'I like you.')).pass).toBe(false);
    expect(matchTranslation('A ti te gusto.', S('Te gusto.', 'You like me.')).pass).toBe(true);
    expect(matchTranslation('A mí me gustas.', S('Me gustas.', 'I like you.')).pass).toBe(true);
  });
});

describe('gender variants stop at what is an adjective about the person', () => {
  test.each([
    ['En mi familia no somos cuatro, somos cinco.', "In my family there aren't four of us, there are five.", 'cuatra'],
    ['Somos ocho y queremos una mesa grande.', "There are eight of us and we'd like a big table.", 'ocha'],
    ['Simón siempre grita cuando estoy contigo.', "Simón always shouts when I'm with you. (to a friend)", 'contiga'],
    ['Mi celular tiene poca batería y estoy lejos de mi casa.', "My phone has low battery and I'm far from home.", 'lejas'],
    ['Quería saber si podía pasar por mi paquete ya que estoy cerca.', "I wanted to know if I could pick up my package, since I'm nearby.", 'cerco'],
    ['Dijeron que cerrarían la puerta mientras estuviéramos afuera.', 'They said they would close the door while we were outside.', 'afuero'],
    ['Ojalá me quedara más plata a fin de mes.', 'I wish I had more money left at the end of the month.', 'plato'],
    ['Aun cuando nos veamos poco, somos familia.', 'Even if we see each other little, we are family.', 'familio'],
    ['No soy cualquiera, soy la dueña.', "I'm not just anyone, I'm the owner.", 'cualquiero'],
    ['Soy investigadora en la Nacional.', 'I am a researcher at the Nacional.', 'investigadoro'],
    ['No seas egoísta, comparte el pastel.', "Don't be selfish, share the cake. (to a friend)", 'egoísto'],
    ['Ojalá fuera sábado.', 'I wish it were Saturday.', 'sábada'],
    ['¿Te importa si dejo esto aquí?', 'Do you mind if I leave this here? (to a friend)', 'esta aquí'],
    ['Nos pusimos manos a la obra.', 'We got down to work.', 'manas'],
    ['Te veo pronto.', 'See you soon.', 'pronta'],
    ['Estás perdiéndolo todo.', "You're losing everything.", 'perdiéndola'],
    ['Estamos arreglándolo todo.', "We're fixing everything.", 'arreglándola'],
  ])('%s', (es, en, bad) => {
    expect(forms(es, en).join(' | ')).not.toContain(bad);
  });
  test.each([
    ['¿Eras travieso o tranquilo?', 'Were you naughty or calm? (to a friend)', '¿Eras traviesa o tranquila?', '¿Eras traviesa o tranquilo?'],
    ['Estoy muy cansado y un poco nervioso.', "I'm very tired and a bit nervous.", 'Estoy muy cansada y un poco nerviosa.', 'Estoy muy cansada y un poco nervioso.'],
  ])('one gender all along: %s', (es, en, right, mixed) => {
    expect(matchTranslation(right, S(es, en)).pass).toBe(true);
    expect(matchTranslation(mixed, S(es, en)).pass).toBe(false);
  });
  test('a tag with more in it is still a tag', () => {
    expect(registerVariants('¿Le gusta el café, señor?', 'Do you like coffee, sir?').map((v) => v.register)).not.toContain('tú');
    expect(registerVariants('¿Habla usted inglés?', 'Do you speak English? (to a man, polite)').map((v) => v.register)).not.toContain('tú');
    expect(registerVariants('¿Hablas inglés?', 'Do you speak English? (to a friend, a man speaking)').map((v) => v.register)).not.toContain('usted');
    expect(registerVariants('¿Hablan inglés?', 'Do you speak English? (to a group, polite)').map((v) => v.register)).not.toContain('tú');
    expect(registerVariants('¿Le importaría firmar?', 'Would you mind signing? (informal)').map((v) => v.register)).toContain('tú');
  });
  test.each([
    ['No somos hermanos, somos amigos.', "We aren't brothers, we're friends.", 'No somos hermanas, somos amigas.'],
    ['¡Cómo te has puesto, Tomás! Estás muy cambiado.', "Look at you, Tomás! You've changed so much.", '¡Cómo te has puesto, Tomás! Estás muy cambiada.'],
    ['¿Estás cansado, Tomás?', 'Are you tired, Tomás?', '¿Estás cansada, Tomás?'],
    ['Soy Ana y estoy cansada.', "I'm Ana and I'm tired.", 'Soy Ana y estoy cansado.'],
    ['Me llamo Ana y estoy cansada.', "My name is Ana and I'm tired.", 'Me llamo Ana y estoy cansado.'],
  ])('the sentence says who: %s', (es, en, wrong) => {
    expect(matchTranslation(wrong, S(es, en)).pass).toBe(false);
  });
  test.each([
    ['Estoy enfermo, Vale.', "I'm ill, Vale.", 'Estoy enferma, Vale.'],
    ['Soy profesor.', 'I am a teacher.', 'Soy profesora.'],
    ['Soy profesora.', 'I am a teacher.', 'Soy profesor.'],
    ['Soy trabajadora.', 'I am hard-working.', 'Soy trabajador.'],
    ['Somos cuatro y estamos cansados.', 'There are four of us and we are tired.', 'Somos cuatro y estamos cansadas.'],
    ['Me sentí cansado después de comer.', 'I felt tired after eating.', 'Me sentí cansada después de comer.'],
    ['Estamos bastante cansados después del viaje.', "We're quite tired after the trip.", 'Estamos bastante cansadas después del viaje.'],
    ['¿Están cansados? Hay tinto.', "Are you all tired? There's coffee.", '¿Están cansadas? Hay tinto.'],
    ['Estoy cansado todo el día.', "I'm tired all day.", 'Estoy cansada todo el día.'],
  ])('and still lets either gender through: %s', (es, en, right) => {
    expect(genderVariants(es, en)).toContain(right);
  });
});

describe('a hint says what the difference proves', () => {
  test('two possessives or demonstratives of a different series are not agreement', () => {
    for (const [a, b] of [['tu', 'mi'], ['su', 'tu'], ['ese', 'este'], ['aquella', 'esta']] as const) {
      expect(diagnose([a, 'casa', 'es', 'grande'], [b, 'casa', 'es', 'grande']).kind).not.toBe('agreement');
    }
  });
  test('two forms of one still are', () => {
    for (const [a, b] of [['mi', 'mis'], ['esta', 'este'], ['estos', 'esta'], ['aquel', 'aquella'], ['nuestro', 'nuestras']] as const) {
      expect(diagnose([a, 'casa', 'es', 'grande'], [b, 'casa', 'es', 'grande']).kind).toBe('agreement');
    }
  });
  test('the gustar hint is for one or more than one, not for who', () => {
    expect(wordHint('gusta', ['gustan'])?.kind).toBe('experiencer-agree');
    expect(wordHint('faltan', ['falta'])?.kind).toBe('experiencer-agree');
    expect(wordHint('parezco', ['parece'])?.kind).toBe('person');
    expect(wordHint('gusto', ['gusta'])?.kind).toBe('person');
    expect(matchTranslation('Me parece a mi madre.', S('Me parezco a mi madre.', 'I look like my mother.')).hintKind).toBe('verb-ending');
  });
});

test('canon keeps the spelling of a figure for the matcher', () => {
  expect(canon('doscientas personas').toks[0]).toMatchObject({ t: '200', form: 'doscientas' });
  expect(canon('200 personas').toks[0].form).toBeUndefined();
  expect(canon('veintiun años').toks[0]).toMatchObject({ t: '21', form: 'veintiún' });
});
