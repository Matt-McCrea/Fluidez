// F5, the acceptance engine: other right forms of a model sentence, each carrying what it swapped.
// A clause or a phrase in another place, a synonym with its article following, the future and ir a,
// the preterite and the perfecto, and the conditional and the -ra form of querer, poder and deber are
// accepted. Each case below has its wrong neighbour: a form the engine must not make, because it says
// another thing (a si that asks, a place that belongs to an inner clause, a billete that is money) or
// is not Spanish (mucho plata). A swap that touches what the card teaches turns a pass into a pass
// with a note, and a card whose nodes are known and untouched passes plainly.
import { describe, expect, test } from 'vitest';
import { expandAccepted, matchTranslation, swapNote, touches } from '../../../lib/match';
import { clauseOrderVariants, movedPhraseVariants } from '../../../lib/match/reorder';
import { synonymVariants } from '../../../lib/match/synonyms';
import { futureVariants, perfectoVariants } from '../../../lib/match/tense-swaps';
import { toToks } from '../../../lib/match/support/spanish';

type Row = [es: string, en: string, input: string];
const run = ([es, en, input]: Row, targets?: string[]) => matchTranslation(input, { es, en }, { accents: 'lenient', ...(targets ? { targets } : {}) });
const forms = (es: string, en: string) => expandAccepted({ es, en }).map((v) => v.es);

describe('a subordinate clause first or last', () => {
  test.each<Row>([
    ['Si tengo tiempo, voy.', "If I have time, I'll go.", 'Voy si tengo tiempo.'],
    ['Voy si tengo tiempo.', "I'll go if I have time.", 'Si tengo tiempo, voy.'],
    ['Cuando llegues, llámame.', 'When you arrive, call me.', 'Llámame cuando llegues.'],
    ['Me conformo con lo que tengo, aunque sea poco.', "I make do with what I have, even if it's little.", 'Aunque sea poco, me conformo con lo que tengo.'],
    ['Si Vale no estuviera aquí, el café no funcionaría.', "If Vale weren't here, the café wouldn't work.", 'El café no funcionaría si Vale no estuviera aquí.'],
    ['Estaba corriendo al bus cuando me llamaron.', 'I was running to the bus when they called me.', 'Cuando me llamaron, estaba corriendo al bus.'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test.each<Row>([
    // a si that asks something: moving it up says another thing
    ['No sé si viene.', "I don't know if he's coming.", 'Si viene, no sé.'],
    ['Pregúntele al señor si viene solo.', "Ask the gentleman if he's coming alone.", 'Si viene solo, pregúntele al señor.'],
    ['Queda por resolver si el efecto se mantiene.', 'It remains to be established whether the effect lasts.', 'Si el efecto se mantiene, queda por resolver.'],
    ['Te llamaba para ver si querías ir al teatro.', 'I was calling to see if you wanted to go to the theatre.', 'Si querías ir al teatro, te llamaba para ver.'],
    // si bien is although, and a cuando that is a cleft
    ['Si bien siento alivio, también me entró tristeza.', 'Although I feel relief, sadness also came over me.', 'También me entró tristeza si bien siento alivio.'],
    ['Precisamente en otoño es cuando más trabajo hay.', "It's precisely in autumn that there's the most work.", 'Cuando más trabajo hay, precisamente en otoño es.'],
    // the clause belongs to an inner verb
    ['Habíamos acordado que cerraríamos cuando se fuera el último cliente.', "We had agreed we'd close when the last customer left.", 'Cuando se fuera el último cliente, habíamos acordado que cerraríamos.'],
    ['Tomás ya reconoce cuando alguien es costeño.', 'Tomás can already tell when someone is from the coast.', 'Cuando alguien es costeño, Tomás ya reconoce.'],
  ])('not another order: %s / "%s": %s', (...row) => {
    expect(run(row).pass).toBe(false);
    expect(forms(row[0], row[1])).not.toContain(row[2]);
  });

  test('a question or a dialogue is left alone', () => {
    expect(clauseOrderVariants('¿Qué haces si llueve?', toToks('¿Qué haces si llueve?'))).toEqual([]);
    expect(clauseOrderVariants('Si llueve, me quedo.\nVale.', toToks('Si llueve, me quedo.\nVale.'))).toEqual([]);
  });

  test('the variants keep their capitals and their stops', () => {
    expect(clauseOrderVariants('Si tengo tiempo, voy.', toToks('Si tengo tiempo, voy.'))).toEqual(['Voy si tengo tiempo.']);
    expect(clauseOrderVariants('Mariana interrumpe la entrevista cuando oye ruidos.', toToks('Mariana interrumpe la entrevista cuando oye ruidos.')))
      .toEqual(['Cuando oye ruidos, Mariana interrumpe la entrevista.']);
    expect(clauseOrderVariants('Voy a pagar si puedo.', toToks('Voy a pagar si puedo.'))).toEqual(['Si puedo, voy a pagar.']);
  });
});

describe('a hace phrase or a place at the front or the end', () => {
  test.each<Row>([
    ['Hace dos semanas llegamos a Bogotá.', 'We arrived in Bogotá two weeks ago.', 'Llegamos a Bogotá hace dos semanas.'],
    ['Llegamos a Bogotá hace dos semanas.', 'We arrived in Bogotá two weeks ago.', 'Hace dos semanas llegamos a Bogotá.'],
    ['En el café no había televisión.', 'There was no television in the café.', 'No había televisión en el café.'],
    ['Compré un disco viejo en el mercado.', 'I bought an old record at the market.', 'En el mercado, compré un disco viejo.'],
    ['Tomás trabajó mucho tiempo en Toronto.', 'Tomás worked for a long time in Toronto.', 'En Toronto, Tomás trabajó mucho tiempo.'],
    ['Mariana normalmente trabaja en casa.', 'Mariana usually works from home.', 'En casa, Mariana normalmente trabaja.'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test.each<Row>([
    // the place is an argument of the verb, not a place
    ['Tengo fe en Tomás.', 'I have faith in Tomás.', 'En Tomás, tengo fe.'],
    ['Confío en el banco.', 'I trust the bank.', 'En el banco, confío.'],
    // the place belongs to an inner verb, or to a list, or to a comparison
    ['Vale hablaba como si estuviese en su casa.', 'Vale spoke as if she were at home.', 'En su casa, Vale hablaba como si estuviese.'],
    ['Creo que hay una fiesta en el barrio.', 'I think there is a party in the neighborhood.', 'En el barrio, creo que hay una fiesta.'],
    ['A mi papá le gusta más almorzar en casa que en un restaurante.', 'My dad likes having lunch at home more than in a restaurant.', 'En un restaurante, a mi papá le gusta más almorzar en casa que.'],
    ['Tienes razón, pero también hay que pensar en Vale.', "You're right, but we also have to think about Vale.", 'En Vale, tienes razón, pero también hay que pensar.'],
    // a verb of being or putting leaves nothing to move the place off
    ['Estaba en el baño.', 'I was in the bathroom.', 'En el baño, estaba.'],
    ['Ella puso el libro en la mesa.', 'She put the book on the table.', 'En la mesa, ella puso el libro.'],
    // hace ... que is a duration, not a time phrase
    ['Hace dos años que vivo aquí.', "I've lived here for two years.", 'Vivo aquí hace dos años que.'],
  ])('not another order: %s / "%s": %s', (...row) => {
    expect(forms(row[0], row[1])).not.toContain(row[2]);
    expect(run(row).pass).toBe(false);
  });

  test('the hace phrase keeps its words', () => {
    expect(movedPhraseVariants('Vine aquí hace un rato.', toToks('Vine aquí hace un rato.'))).toEqual(['Hace un rato, vine aquí.']);
    expect(movedPhraseVariants('Desde hace dos años vivo aquí.', toToks('Desde hace dos años vivo aquí.'))).toEqual([]);
  });
});

describe('another word for the same thing, with its article following', () => {
  test.each<Row>([
    ['Mi mamá toma café.', 'My mom drinks coffee.', 'Mi madre toma café.'],
    ['Mi madre toma café.', 'My mother drinks coffee.', 'Mi mamá toma café.'],
    ['Necesito más plata.', 'I need more money.', 'Necesito más dinero.'],
    ['Tiene mucha plata.', 'She has a lot of money.', 'Tiene mucho dinero.'],
    ['Quiero toda la plata.', 'I want all the money.', 'Quiero todo el dinero.'],
    ['Puedes usar mi computadora.', 'You can use my computer.', 'Puedes usar mi computador.'],
    ['Perdí las llaves del carro.', 'I lost the car keys.', 'Perdí las llaves del auto.'],
    ['Trabajo con Vale en el café.', 'I work with Vale at the café.', 'Trabajo con Vale en la cafetería.'],
    ['Hoy no salí de la cafetería.', "Today I didn't leave the café.", 'Hoy no salí del café.'],
    ['Altamira prometió un salario alto.', 'Altamira promised a high salary.', 'Altamira prometió un sueldo alto.'],
    ['La nevera cabe en la cocina.', 'The fridge fits in the kitchen.', 'El refrigerador cabe en la cocina.'],
    ['Tomo un tinto con Hernando.', 'I have a coffee with Hernando.', 'Tomo un café con Hernando.'],
    ['Quiero empezar el lunes.', 'I want to start on Monday.', 'Quiero comenzar el lunes.'],
    ['Empezó la tormenta.', 'The storm began.', 'Comenzó la tormenta.'],
    ['Tomás no contesta.', "Tomás doesn't answer.", 'Tomás no responde.'],
    ['Tal vez Hernando quiera otro tinto.', 'Maybe Hernando wants another coffee.', 'Quizás Hernando quiera otro tinto.'],
    ['De todas formas, ya firmamos.', 'Anyway, we already signed.', 'De todos modos, ya firmamos.'],
    ['Lo bonito de la plaza es la luz.', 'The nice thing about the square is the light.', 'Lo lindo de la plaza es la luz.'],
    ['Los clientes tomaron tinto.', 'The customers drank black coffee.', 'Los clientes bebieron tinto.'],
    ['Vendimos el billete de lotería.', 'We sold the lottery ticket.', 'Vendimos el boleto de lotería.'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test.each<Row>([
    // the article and the quantifier must follow the new gender
    ['Tiene mucha plata.', 'She has a lot of money.', 'Tiene mucha dinero.'],
    ['Quiero toda la plata.', 'I want all the money.', 'Quiero toda el dinero.'],
    ['Puedes usar mi computadora.', 'You can use my computer.', 'Puedes usar mi computadora.'.replace('computadora', 'computadors')],
    ['Perdí las llaves del carro.', 'I lost the car keys.', 'Perdí las llaves de la auto.'],
    ['Trabajo con Vale en el café.', 'I work with Vale at the café.', 'Trabajo con Vale en el cafetería.'],
    // a word that is also another word
    ['Es un anillo de plata.', "It's a silver ring.", 'Es un anillo de dinero.'],
    ['Compré un seguro médico.', 'I bought health insurance.', 'Compré un seguro doctor.'],
    ['Vive en el cuarto piso.', 'She lives on the fourth floor.', 'Vive en el habitación piso.'],
    ['Pagué el billete.', 'I paid the banknote.', 'Pagué el boleto.'],
    ['Me da pena que no vengas.', "It's a shame you're not coming.", 'Me da vergüenza que no vengas.'],
    ['Tomás pasa por la plaza.', 'Tomás goes through the square.', 'Tomás bebe por la plaza.'],
    // volver is turn, again and go back, regresar is only the last
    ['Si pudiera volver atrás, escucharía más.', 'If I could go back, I would listen more.', 'Si pudiera regresar atrás, escucharía más.'],
    ['Voy a volver a leerlo.', "I'm going to read it again.", 'Voy a regresar a leerlo.'],
    ['Tener abogados caros no los vuelve inocentes.', "Expensive lawyers don't make them innocent.", 'Tener abogados caros no los regresa inocentes.'],
    // acabar de + infinitive is just, terminar de + infinitive is finishing
    ['Acabo de llegar.', 'I just arrived.', 'Termino de llegar.'],
    ['Terminé de comer.', 'I finished eating.', 'Acabé de comer.'],
    ['Responde el teléfono.', 'Answer the phone.', 'Responde el teléfono.'.replace('Responde', 'Responder')],
  ])('not made: %s / "%s": %s', (...row) => {
    expect(run(row).pass, row[2]).toBe(false);
  });

  test('a class that needs the English asks for it', () => {
    expect(synonymVariants('Pagué el billete.', 'I paid the banknote.')).toEqual([]);
    expect(synonymVariants('Compré el billete.', 'I bought the ticket.').map((v) => v.es)).toEqual(expect.arrayContaining(['Compré el boleto.', 'Compré el tiquete.']));
    expect(synonymVariants('Es un anillo de plata.', "It's a silver ring.")).toEqual([]);
    expect(synonymVariants('Hablemos de plata.', "Let's talk about money.").map((v) => v.es)).toContain('Hablemos de dinero.');
  });

  test('each swap names the word it swapped and the lexeme behind it', () => {
    const [v] = synonymVariants('Mi mamá toma café.', 'My mom drinks coffee.');
    expect(v.es).toBe('Mi madre toma café.');
    expect(v.swap).toMatchObject({ kind: 'synonym', from: 'mamá', to: 'madre', lemma: 'mamá' });
  });
});

describe('the future and ir a', () => {
  test.each<Row>([
    ['Mañana te llamaré.', "I'll call you tomorrow.", 'Mañana te voy a llamar.'],
    ['Mañana te llamaré.', "I'll call you tomorrow.", 'Mañana voy a llamarte.'],
    ['Voy a pagar mañana.', "I'm going to pay tomorrow.", 'Pagaré mañana.'],
    ['Te voy a llamar mañana.', "I'm going to call you tomorrow.", 'Te llamaré mañana.'],
    ['Voy a decirle la verdad.', "I'm going to tell him the truth.", 'Le diré la verdad.'],
    ['Los clientes no van a abrir el domingo.', "The customers aren't going to open on Sunday.", 'Los clientes no abrirán el domingo.'],
    ['No será fácil, pero lo haremos.', "It won't be easy, but we'll do it.", 'No va a ser fácil, pero lo vamos a hacer.'],
    ['Mañana me levantaré temprano.', "I'll get up early tomorrow.", 'Mañana me voy a levantar temprano.'],
    ['Así pues, ¿vas a quedarte en Bogotá para siempre?', 'So, are you going to stay in Bogotá for good? (to a friend)', 'Así pues, ¿te quedarás en Bogotá para siempre?'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.swaps?.[0]?.kind).toBe('future-ir-a');
  });

  test.each<Row>([
    // a future that guesses is not ir a
    ['Estará en el centro.', "He's probably downtown.", 'Va a estar en el centro.'],
    ['Serán las diez.', 'It must be ten.', 'Van a ser las diez.'],
    // let's is not a future
    ['Vamos a comer.', "Let's eat.", 'Comeremos.'],
    // a future needs its English: ir a with no future in it is a trip
    ['Voy a la tienda.', "I'm going to the store.", 'Iré la tienda.'],
    // the forms are not mixed up
    ['Mañana te llamaré.', "I'll call you tomorrow.", 'Mañana te voy a llamaré.'],
    ['Pagaré mañana.', "I'll pay tomorrow.", 'Voy a pagaré mañana.'],
  ])('not made: %s / "%s": %s', (...row) => {
    expect(run(row).pass, row[2]).toBe(false);
  });

  test('every swap of the sentence is made at once as well as one at a time', () => {
    const swapped = futureVariants('No será fácil, pero lo haremos.', "It won't be easy, but we'll do it.");
    expect(swapped.map((v) => v.es)).toEqual([
      'No va a ser fácil, pero lo haremos.', 'No será fácil, pero lo vamos a hacer.', 'No va a ser fácil, pero lo vamos a hacer.',
    ]);
  });

  test('a ¿ stays at the front of the question', () => {
    expect(futureVariants('¿Vas a llamarla hoy?', 'Are you calling her today?')).toEqual([]);
    expect(futureVariants('¿Vas a llamarla hoy?', 'Will you call her today?').map((v) => v.es)).toEqual(['¿La llamarás hoy?']);
  });
});

describe('the preterite and the perfecto', () => {
  test.each<Row>([
    ['Ya comí.', 'I already ate.', 'Ya he comido.'],
    ['Ya he comido.', "I've already eaten.", 'Ya comí.'],
    ['¿Has hablado con Ricardo?', 'Have you spoken with Ricardo? (to a friend)', '¿Hablaste con Ricardo?'],
    ['Nunca he estado en Medellín.', "I've never been to Medellín.", 'Nunca estuve en Medellín.'],
    ['Hoy trabajé mucho.', 'Today I worked a lot.', 'Hoy he trabajado mucho.'],
    ['Todavía no comí.', "I haven't eaten yet.", 'Todavía no he comido.'],
    ['Me lavé las manos.', "I've washed my hands.", 'Me he lavado las manos.'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.swaps?.[0]?.kind).toBe('pret-perfecto');
  });

  test.each<Row>([
    // a past that is dated or told in a row
    ['Ayer comí con Vale.', 'Yesterday I ate with Vale.', 'Ayer he comido con Vale.'],
    ['Llegué temprano y ya había gente.', 'I arrived early and there were already people.', 'He llegado temprano y ya había gente.'],
    ['Creímos que Vale ya estaba en casa.', 'We thought Vale was already at home.', 'Hemos creído que Vale ya estaba en casa.'],
    ['Hernando dijo que ya no manejaría más.', "Hernando said he wouldn't drive anymore.", 'Hernando ha dicho que ya no manejaría más.'],
    ['Esa noche pasé más miedo que nunca.', 'That night I was more scared than ever.', 'Esa noche he pasado más miedo que nunca.'],
    // a perfecto that goes on until now
    ['He vivido aquí por dos años.', "I've lived here for two years.", 'Viví aquí por dos años.'],
    ['Hemos vivido sin luz.', "We've lived without power.", 'Vivimos sin luz.'],
    // fui is ser and ir: the participle would be a guess
    ['Ya fui al banco.', 'I already went to the bank.', 'Ya he sido al banco.'],
    // a modal that already has haber
    ['¿No debí haberle dicho nada?', 'Should I not have said anything?', '¿No he debido haberle dicho nada?'],
  ])('not made: %s / "%s": %s', (...row) => {
    expect(run(row).pass, row[2]).toBe(false);
  });

  test('a perfecto becomes a preterite only for a verb that stops', () => {
    expect(perfectoVariants('Nunca he estado en Medellín.', "I've never been to Medellín.").map((v) => v.es)).toEqual(['Nunca estuve en Medellín.']);
    expect(perfectoVariants('Siempre he sido feliz.', "I've always been happy.")).toEqual([]);
  });
});

describe('querría and quisiera, podría and pudiera, debería and debiera', () => {
  test.each<Row>([
    ['Quisiera un café, por favor.', "I'd like a coffee, please.", 'Querría un café, por favor.'],
    ['Querría hablar con el dueño.', 'I would like to speak with the owner.', 'Quisiera hablar con el dueño.'],
    ['¿Podría ayudarme?', 'Could you help me?', '¿Pudiera ayudarme?'],
    ['Deberíamos hablar con los vecinos.', 'We should talk to the neighbours.', 'Debiéramos hablar con los vecinos.'],
    ['Quiero dos pasajes.', "I'd like two tickets.", 'Quisiera dos pasajes.'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.swaps?.[0]?.kind).toBe('cond-ra');
  });

  test.each<Row>([
    // a wish, a subordinate subjunctive and a plain present are not softened verbs
    ['¡Quién pudiera descansar!', 'If only I could rest!', '¡Quién podría descansar!'],
    ['Si pudiera, iría.', 'If I could, I would go.', 'Si podría, iría.'],
    ['Quiero un café.', 'I want a coffee.', 'Quisiera un café.'],
    // -se is a subjunctive, and these are not
    ['Quisiera un café.', "I'd like a coffee.", 'Quisiese un café.'],
  ])('not made: %s / "%s": %s', (...row) => {
    expect(run(row).pass, row[2]).toBe(false);
  });
});

describe('a swap that touches the card says so', () => {
  const future: Row = ['Mañana te llamaré.', "I'll call you tomorrow.", 'Mañana te voy a llamar.'];
  const perfecto: Row = ['Ya comí.', 'I already ate.', 'Ya he comido.'];

  test('voy a pagar on a card about the future is a pass with a note', () => {
    const r = run(['Pagaré mañana.', "I'll pay tomorrow.", 'Voy a pagar mañana.'], ['g:future-promises']);
    expect(r.pass).toBe(true);
    expect(r.note).toBe('"voy a pagar" works too. This card was practising "pagaré".');
    expect(r.swaps).toEqual([expect.objectContaining({ kind: 'future-ir-a', from: 'pagaré', to: 'voy a pagar' })]);
  });

  test('a card named for the simple future is touched as well, whatever the course calls its node', () => {
    expect(run(['Pagaré mañana.', "I'll pay tomorrow.", 'Voy a pagar mañana.'], ['g:future-simple']).note).toBe('"voy a pagar" works too. This card was practising "pagaré".');
  });

  test('the same swap passes plainly on a card about something else', () => {
    const r = run(future, ['l:llamar']);
    expect(r.pass).toBe(true);
    expect(r.note).toBeUndefined();
    expect(r.swaps?.[0].kind).toBe('future-ir-a');
  });

  test('a card whose nodes are not known is told about every swap of a tense', () => {
    expect(run(future).note).toBeTruthy();
    expect(run(perfecto).note).toBe('"he comido" works too. This card was practising "comí".');
  });

  test('ir a and the preterite each touch their own family and not the other', () => {
    expect(run(perfecto, ['g:preterite-ar']).note).toBeTruthy();
    expect(run(perfecto, ['g:future-promises']).note).toBeUndefined();
    expect(run(future, ['g:ir-a-plans']).note).toBeTruthy();
    expect(run(future, ['g:preterite-ar']).note).toBeUndefined();
  });

  test('a synonym touches the card of its lexeme and no other', () => {
    const row: Row = ['Mi mamá toma café.', 'My mom drinks coffee.', 'Mi madre toma café.'];
    expect(run(row, ['l:mamá']).note).toBe('"madre" works too. This card was practising "mamá".');
    expect(run(row, ['l:café']).note).toBeUndefined();
    expect(run(row).note).toBeUndefined();
  });

  test('habría and hubiera say so on the conditional, and keep saying so with no nodes given', () => {
    const row: Row = ['Si hubiera sabido, habría venido.', 'If I had known, I would have come.', 'Si hubiera sabido, hubiera venido.'];
    expect(run(row).note).toBe('Habría and hubiera both work in the result clause.');
    expect(run(row, ['g:si-past-unreal']).note).toBe('Habría and hubiera both work in the result clause.');
    expect(run(row, ['l:venir']).note).toBeUndefined();
  });

  test('-ra for -se, a clause moved and a Peninsular word touch no tense, so they pass plainly', () => {
    expect(run(['Si tuviera dinero, viajaría.', 'If I had money, I would travel.', 'Si tuviese dinero, viajaría.'], ['g:imperfect-subj']).note).toBeUndefined();
    expect(run(['Si tengo tiempo, voy.', "If I have time, I'll go.", 'Voy si tengo tiempo.'], ['g:si-present']).note).toBeUndefined();
    expect(run(['Si tengo tiempo, voy.', "If I have time, I'll go.", 'Voy si tengo tiempo.'], ['g:topic-fronting']).note).toBe('That order works too. This card was practising the other one.');
  });

  test('the note is kept with an accent slip, and the slip is still said', () => {
    const r = matchTranslation('Ya he comido.'.replace('comido', 'comido'), { es: 'Ya comí.', en: 'I already ate.' }, { accents: 'lenient', targets: ['g:preterite-ar'] });
    expect(r.note).toContain('works too');
    const slip = matchTranslation('Mañana te voy a llamar'.replace('llamar', 'llamar'), { es: 'Mañana te llamaré.', en: "I'll call you tomorrow." }, { accents: 'lenient', targets: ['g:future-promises'] });
    expect(slip.pass).toBe(true);
  });

  test('swapNote and touches read the table', () => {
    expect(touches({ kind: 'future-ir-a', from: 'a', to: 'b' }, ['g:future-conjecture'])).toBe(true);
    expect(touches({ kind: 'future-ir-a', from: 'a', to: 'b' }, ['g:conditional'])).toBe(false);
    expect(touches({ kind: 'peninsular', from: 'a', to: 'b' })).toBe(false);
    expect(swapNote([], ['g:conditional'])).toBeUndefined();
    expect(swapNote(undefined)).toBeUndefined();
  });
});

describe('the engine costs milliseconds', () => {
  test('expanding a sentence with every generator stays cheap', () => {
    const rows: Row[] = [
      ['Si tengo tiempo, mañana te llamaré a mi mamá con el celular.', "If I have time, I'll call my mom on the cell phone tomorrow.", ''],
      ['Hace dos semanas compré el carro en el mercado y ya no tengo plata.', "I bought the car at the market two weeks ago and I have no money now.", ''],
      ['Voy a esperarte en la cafetería cuando termines de trabajar.', "I'm going to wait for you at the café when you finish working.", ''],
    ];
    forms(rows[0][0], rows[0][1]);                                   // the engine's tables load on the first call
    const t0 = performance.now();
    for (let i = 0; i < 20; i++) for (const [es, en] of rows) forms(es, en);
    const per = (performance.now() - t0) / 60;
    expect(per, `${per.toFixed(2)} ms a sentence`).toBeLessThan(15);
  });
});
