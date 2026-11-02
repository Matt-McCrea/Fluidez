// What a sweep of every bank row found after the verdicts lane: forms the engine made that are not Spanish, causes the
// traps named that were not the cause, and the lessons' reasons speaking about words the learner never wrote. Each row is a
// real bank sentence or the shape of one.
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { expandAccepted, matchTranslation, swapNote } from '../../src/check/translate';
import { assertHits, noteVariants, pitfallFor, pitfallKey, registerPitfalls } from '../../src/check/traps';
import { retryLead } from '../../src/ui/components/card';
import { itemCheck } from '../../src/ui/session/cards';
import { lastWeekCameBack } from '../../src/learner/metrics';
import type { ReviewEvent } from '../../src/learner/events';

type Row = [es: string, en: string, input: string];
const run = ([es, en, input]: Row, targets?: string[]) => matchTranslation(input, { es, en }, { accents: 'lenient', ...(targets ? { targets } : {}) });
const forms = (es: string, en: string) => expandAccepted({ es, en }).map((v) => v.es);

describe('a noun that changes gender takes only its own words with it', () => {
  test.each<Row>([
    ['Tenemos dos computadoras en la oficina.', 'We have two computers in the office.', 'Tenemos das computadores en la oficina.'],
    ['Son las ocho y el café ya tiene gente.', "It's eight o'clock and the café already has people.", 'Son las ocha y la cafetería ya tiene gente.'],
    ['Mi abuela trabajó mucho en el café.', 'My grandmother worked a lot in the café.', 'Mi abuela trabajó mucha en la cafetería.'],
    ['Se ve que Rosa quería mucho este café.', 'You can see Rosa really loved this café.', 'Se ve que Rosa quería mucha esta cafetería.'],
    ['No es cierto que el café pierda plata todos los meses.', "It isn't true that the café loses money every month.", 'No es cierta que la cafetería pierda plata todos los meses.'],
    ['¿Cómo ganó tanto dinero Hernando?', 'How did Hernando earn so much money?', '¿Cómo ganó tanta plata Hernanda?'],
    ['Ganó mucha plata vendiendo flores.', 'She earned a lot of money selling flowers.', 'Ganó mucho dinero vendienda flores.'],
    ['Alrededor del café todo es nuevo.', 'Around the café everything is new.', 'Alrededor de la cafetería todo es nueva.'],
    ['La red que tenemos en el café no es buena.', 'The network we have in the café is not good.', 'La red que tenemos en la cafetería no es bueno.'],
    ['Ahora bien, la plata no lo es todo.', "That said, money isn't everything.", 'Ahora bien, el dinero no lo es toda.'],
    ['Los sábados en el café somos muchos.', 'On Saturdays there are a lot of us in the café.', 'Los sábados en la cafetería somos muchas.'],
    ['Todos los cuartos son luminosos.', 'All the rooms are bright.', 'Todos las habitaciones son luminosas.'],
  ])('%s is not "%s": %s', (...row) => { expect(run(row).pass).toBe(false); });

  test.each<Row>([
    ['Tomás guarda poca plata, pero la guarda todos los meses.', 'Tomás saves little money, but he saves it every month.', 'Tomás guarda poco dinero, pero la guarda todos los meses.'],
    ['Me quedé sin plata y tuve que pedirla prestada.', 'I ran out of money and had to borrow some.', 'Me quedé sin dinero y tuve que pedirla prestada.'],
    ['Hay un café mejor, pero no lo conozco.', "There is a better café, but I don't know it.", 'Hay una cafetería mejor, pero no lo conozco.'],
    ['No hay un café como este en todo el mundo.', "There's no café like this one in the whole world.", 'No hay una cafetería como este en todo el mundo.'],
    ['La nevera ya no sirve, hay que comprar otra.', "The fridge doesn't work anymore, we have to buy another.", 'El refrigerador ya no sirve, hay que comprar otra.'],
    ['Quiero un cuarto bien iluminado.', 'I want a well-lit room.', 'Quiero una habitación bien iluminado.'],
    ['Este cuarto es tan pequeño.', 'This room is so small.', 'Esta habitación es tan pequeño.'],
    ['El café permanece cerrado el domingo.', 'The café stays closed on Sunday.', 'La cafetería permanece cerrado el domingo.'],
    ['Si tú te hubieras ido, el café habría quedado vacío.', 'If you had left, the café would have been left empty.', 'Si tú te hubieras ido, la cafetería habría quedado vacío.'],
    ['En la mesa hay una computadora, la cual funciona muy despacio.', "On the table there's a computer, which runs very slowly.", 'En la mesa hay un computador, la cual funciona muy despacio.'],
  ])('what points back to %s keeps its gender, so the swap is not made: %s', (...row) => { expect(run(row).pass).toBe(false); });

  test.each<Row>([
    ['Tenemos dos computadoras en la oficina.', 'We have two computers in the office.', 'Tenemos dos computadores en la oficina.'],
    ['Toda la plata está aquí.', 'All the money is here.', 'Todo el dinero está aquí.'],
    ['Mi abuela trabajó mucho en el café.', 'My grandmother worked a lot in the café.', 'Mi abuela trabajó mucho en la cafetería.'],
    ['Vale tiene razón, el café está lleno.', 'Vale is right, the café is full.', 'Vale tiene razón, la cafetería está llena.'],
    ['La nevera cabe en la cocina.', 'The fridge fits in the kitchen.', 'El refrigerador cabe en la cocina.'],
  ])('and what is right is still there: %s', (...row) => { expect(run(row).pass).toBe(true); });
});

describe('a synonym is only a synonym where it can stand', () => {
  test.each<Row>([
    ['Desde luego, tienes razón.', "Absolutely, you're right.", 'Desde después, tienes razón.'],
    ['Dos horas después, todavía estábamos ahí.', 'Two hours later, we were still there.', 'Dos horas luego, todavía estábamos ahí.'],
    ['Poco después, sonó el teléfono.', 'Shortly after, the phone rang.', 'Poco luego, sonó el teléfono.'],
    ['Vale se manchó la falda de vino tinto.', 'Vale got red wine on her skirt.', 'Vale se manchó la falda de vino café.'],
    ['Ellos acaban de irse.', 'They have just left.', 'Ellos terminan de irse.'],
    ['Sin duda alguna, es la mejor opción.', "Without a doubt, it's the best option.", 'Sin lugar a dudas alguna, es la mejor opción.'],
  ])('%s is not %s: %s', (...row) => { expect(run(row).pass).toBe(false); });

  test('luego and después still stand for each other on their own', () => {
    expect(run(['Primero comimos y después salimos.', 'First we ate and then we went out.', 'Primero comimos y luego salimos.']).pass).toBe(true);
  });
});

describe('es feliz and está feliz are one thing only where nothing ties them to a moment', () => {
  test.each<Row>([
    ['Estoy tranquilo aquí.', "I'm calm here.", 'Soy tranquilo aquí.'],
    ['Tengo veinte correos y estoy tranquilo.', "I have twenty emails and I'm calm.", 'Tengo veinte correos y soy tranquilo.'],
    ['Simón es ruidoso; hoy está muy tranquilo.', 'Simón is noisy; today he is very calm.', 'Simón es ruidoso; hoy es muy tranquilo.'],
    ['Hoy me pesé y estoy feliz.', "I weighed myself today and I'm happy.", 'Hoy me pesé y soy feliz.'],
    ['Estamos felices de verte mejor.', "We're happy to see you better.", 'Somos felices de verte mejor.'],
    ['Estamos felices por Vale.', "We're happy for Vale.", 'Somos felices por Vale.'],
    ['Mis papás están casados hace treinta años.', 'My parents have been married for thirty years.', 'Mis papás son casados hace treinta años.'],
  ])('%s is not "%s": %s', (...row) => { expect(run(row).pass).toBe(false); });

  test.each<Row>([
    ['Es feliz.', "She's happy.", 'Está feliz.'],
    ['Está casada.', "She's married.", 'Es casada.'],
  ])('%s and %s', (...row) => { expect(run(row).pass).toBe(true); });
});

describe('a clause or a phrase moves only where it was free to', () => {
  test.each<Row>([
    ['Simón gritó justo cuando entró el inspector.', 'Simón shouted just when the inspector came in.', 'Cuando entró el inspector, Simón gritó justo.'],
    ['Fue ayer cuando me enteré de todo.', 'It was yesterday that I found out about everything.', 'Cuando me enteré de todo, fue ayer.'],
    ['Lamento no haber estado ahí cuando murió Rosa.', "I'm sorry I wasn't there when Rosa died.", 'Cuando murió Rosa, lamento no haber estado ahí.'],
    ['Siento no haberte escuchado cuando me hablaste.', "I'm sorry I didn't listen to you when you talked to me.", 'Cuando me hablaste, siento no haberte escuchado.'],
    ['Eso fue hace una década.', 'That was a decade ago.', 'Hace una década, eso fue.'],
    ['Nací en Bogotá.', 'I was born in Bogotá.', 'En Bogotá, nací.'],
    ['Mi abuelo vive en mi casa.', 'My grandfather lives in my house.', 'En mi casa, mi abuelo vive.'],
    ['Hernando se queja de haber esperado en la calle.', 'Hernando complains about having waited in the street.', 'En la calle, Hernando se queja de haber esperado.'],
    ['La película trata de una familia en Cali.', 'The film is about a family in Cali.', 'En Cali, la película trata de una familia.'],
    ['La lluvia me trae recuerdos de mi niñez en Boyacá.', 'The rain brings back memories of my childhood in Boyacá.', 'En Boyacá, la lluvia me trae recuerdos de mi niñez.'],
    ['Como incluso en casa.', 'I even eat at home.', 'En casa, como incluso.'],
  ])('%s is not "%s": %s', (...row) => { expect(run(row).pass).toBe(false); });

  test.each<Row>([
    ['Compré el libro en la tienda.', 'I bought the book at the shop.', 'En la tienda, compré el libro.'],
    ['Llegamos a Bogotá hace dos semanas.', 'We arrived in Bogotá two weeks ago.', 'Hace dos semanas llegamos a Bogotá.'],
    ['Me llamó cuando llegó.', 'She called me when she arrived.', 'Cuando llegó, me llamó.'],
  ])('and what was free still moves: %s', (...row) => { expect(run(row).pass).toBe(true); });
});

describe('one "you" all along', () => {
  test.each<Row>([
    ['Te extrañé muchísimo cuando te fuiste.', 'I missed you so much when you left.', 'Las extrañé muchísimo cuando te fuiste.'],
    ['Si te animas a llamar, yo te acompaño.', "If you pluck up the courage to call, I'll go with you.", 'Si te animas a llamar, yo le acompaño.'],
    ['¿Te animas o te da pereza?', 'Are you up for it or are you feeling lazy?', '¿Te animas o le da pereza?'],
    ['Hernando, te escribo para decirte gracias.', "Hernando, I'm writing to say thank you.", 'Hernando, le escribo para decirte gracias.'],
    ['Te dije que no.', 'I told you no.', 'Los dije que no.'],
    ['Te estaba diciendo la verdad.', 'I was telling you the truth.', 'La estaba diciendo la verdad.'],
  ])('%s is not "%s": %s', (...row) => { expect(run(row).pass).toBe(false); });

  test('with a clause that cannot follow, no register is made rather than half of one', () => {
    expect(forms('Tú te callas ya.', 'You shut up now.').filter((f) => /^Tú (lo|la|le|los|las|les) /.test(f))).toEqual([]);
  });
  test('and a whole register is untouched', () => {
    expect(run(['Te dije que no.', 'I told you no.', 'Le dije que no.']).pass).toBe(true);
    expect(run(['Te veo cansado.', 'You look tired to me.', 'Lo veo cansado.']).pass).toBe(true);
  });
});

describe('the two pasts are one thing only with the English to say so', () => {
  test.each<Row>([
    ['No tuvimos noticia alguna de Altamira.', 'We had no news whatsoever from Altamira.', 'No hemos tenido noticia alguna de Altamira.'],
    ['Los que conocieron a Joaquín ya son muy mayores.', 'The ones who knew Joaquín are very old now.', 'Los que han conocido a Joaquín ya son muy mayores.'],
    ['No pude ir.', "I couldn't have gone.", 'No he podido ir.'],
    ['Ya pagué en marzo.', 'I already paid in March.', 'Ya he pagado en marzo.'],
  ])('%s is not "%s": %s', (...row) => { expect(run(row).pass).toBe(false); });

  test('the little words of a future go first with the capital', () => {
    expect(forms('¿Los vecinos? Voy a llamarlos desde la oficina.', "The neighbours? I'm going to call them from the office.")).toContain('¿Los vecinos? Los llamaré desde la oficina.');
  });
});

describe('a note says what it can know', () => {
  test('a card with no nodes is not told it was practising an order', () => {
    expect(swapNote([{ kind: 'clause-order', from: 'a', to: 'b' }])).toBeUndefined();
    expect(swapNote([{ kind: 'future-ir-a', from: 'pagaré', to: 'voy a pagar' }])).toMatch(/practising/);
  });
});

describe('the right forms that carry a point', () => {
  const made = (es: string) => noteVariants(es).map((n) => n.es);
  test.each<[string]>([
    ['¿Cómo se escribe el apellido de Vale?'], ['Hay un cartel en la ventana: se vende pan fresco.'], ['En la caja se paga y se espera el café.'],
    ['Cuando se vende el último pan, Vale cierra la cocina.'], ['Se vendió la vieja nevera por muy poco.'], ['¿Dónde se firman los papeles?'],
    ['El cheque llegó tarde, de manera que no se pagó la harina.'], ['Un cuarto de la harina se pagó con el cheque de Hernando.'], ['El mantenimiento de la plaza se paga a partes iguales.'],
    ['En 1810 se firma el acta de independencia.'], ['Se pagaron las cuentas viejas; por lo tanto, el café respira un poco.'],
  ])('no passive is made of %s', (es) => { expect(made(es).filter((f) => / (es|son|fue|fueron|será|serán) \p{L}+(do|da|dos|das|to|ta|tos|tas|cho|cha) /u.test(` ${f} `) || / (es|son|fue|fueron) /.test(f))).toEqual([]); });

  test.each<[string, string]>([
    ['Se vendió la casa por muy poco.', 'La casa fue vendida por muy poco.'],
    ['Los estatutos se aprobaron por consenso.', 'Los estatutos fueron aprobados por consenso.'],
    ['¿Se pagará la multa antes del lunes?', '¿La multa será pagada antes del lunes?'],
  ])('%s still has its passive', (es, f) => { expect(made(es)).toContain(f); });

  test.each<[string]>([
    ['La boda de mi prima es en diciembre.'], ['Lo del cumpleaños de Simón es en serio, hay torta y todo.'], ['Donde falla la obra es en el ritmo, no en las ideas.'], ['La reunión es en una hora.'], ['La clase es en inglés.'],
  ])('no está is made of %s', (es) => { expect(made(es)).toEqual([]); });

  test.each<[string]>([
    ['Iba a llamarte, pero se me olvidó.'], ['Lo que pasa es que se me olvidó por completo.'], ['Mañana se te olvida.'], ['A mí se me olvidó la cita.'],
  ])('no olvidé is made of %s: it wants what was forgotten after it', (es) => { expect(made(es)).toEqual([]); });
  test('Se me olvidó la cédula still has its olvidé', () => { expect(made('Se me olvidó la cédula en la casa.')).toContain('Olvidé la cédula en la casa.'); });
});

describe('an Assert stands only where the sentence proves it', () => {
  const check = (row: Row, targets?: string[]) => { const r = run(row, targets); expect(r.pass, JSON.stringify(r)).toBe(false); expect(r.rule, JSON.stringify(r)).toBeUndefined(); };
  test.each<Row>([
    ['No sé si viene.', "I don't know if she's coming.", 'No sé si vendrá.'],
    ['Le pregunté a Hernando si se acordaba del barco.', 'I asked Hernando if he remembered the boat.', 'Le pregunté a Hernando si se acordaría del barco.'],
    ['Tengo la duda de si Altamira miente.', "I'm unsure whether Altamira is lying.", 'Tengo la duda de si Altamira mentirá.'],
  ])('si is whether in %s: "%s"', (...row) => check(row));
  test.each<Row>([
    ['Pude haber ido.', 'I could have gone.', 'Podría haber ido.'],
    ['¿Cómo pudiste decirle eso a tu madre?', 'How could you say that to your mother?', '¿Cómo podrías decirle eso a tu madre?'],
    ['Juraría que el lunes dijo que no.', 'I could swear that on Monday he said no.', 'Juraría que el lunes diría que no.'],
    ['Mi mamá me explicó que no podía mandar plata.', "My mom explained to me that she couldn't send money.", 'Mi mamá me explicaría que no podía mandar plata.'],
  ])('no could to name in %s: "%s"', (...row) => check(row));
  test.each<Row>([
    ['Sé su nombre.', 'I know his name.', 'Conozco su nombre.'],
    ['Conozco un truco.', 'I know a trick.', 'Sé un truco.'],
    ['¡Es increíble cuánto sabe Hernando de la ciudad!', "It's amazing how much Hernando knows about the city!", '¡Es increíble cuánto conoce Hernando de la ciudad!'],
    ['Hoy llevo una camisa azul.', "Today I'm wearing a blue shirt.", 'Hoy traigo una camisa azul.'],
    ['Traje plata.', 'I brought money.', 'Llevé plata.'],
    ['Llevé plata, pero no llevé cambio.', "I brought money, but I didn't bring change.", 'Llevé plata, pero no traje cambio.'],
    ['Es hora de irnos.', "It's time to go.", 'Es tiempo de irnos.'],
  ])('both words can stand in %s: "%s"', (...row) => check(row));
  test.each<Row>([
    ['Vale sabe que Altamira tiene un plan.', 'Vale knows Altamira has a plan.', 'Vale conoce que Altamira tiene un plan.'],
    ['Conozco a Hernando.', 'I know Hernando.', 'Sé a Hernando.'],
    ['Mariana lleva la foto a la costa.', 'Mariana takes the photo to the coast.', 'Mariana trae la foto a la costa.'],
    ['¿Me trae otra limonada?', 'Could you bring me another lemonade?', '¿Me lleva otra limonada?'],
  ])('what the sentence does prove is still named: %s', (...row) => { expect(run(row).rule).toMatch(/^lexical-pair:/); });

  test.each<Row>([
    ['No dudo que venga.', "I don't doubt she'll come.", 'No dudo que viene.'],
    ['Me temo que no pueda ir.', "I'm afraid I can't go.", 'Me temo que no puedo ir.'],
    ['Espero que llegue.', 'I hope she arrives.', 'Espero que llegará.'],
  ])('the indicative is right after %s: "%s"', (...row) => check(row));

  test.each<Row>([
    ['Dio la casualidad de que llovía y ningún taxi quería parar.', 'It so happened that it was raining and no taxi wanted to stop.', 'Dio la casualidad de que llovía y ningún taxi quiso parar.'],
    ['Antes trabajaba aquí.', 'I worked here before.', 'Antes trabajé aquí.'],
    ['Una vez perdida la llave, Yesid tenía que llamar a Vale.', 'Once the key was lost, Yesid had to call Vale.', 'Una vez perdida la llave, Yesid tuvo que llamar a Vale.'],
  ])('the English does not fix this verb in %s: "%s"', (...row) => check(row));

  test.each<Row>([
    ['La fiesta fue aburrida.', 'The party was boring.', 'La fiesta estuvo aburrida.'],
    ['Este café está malo.', 'This coffee is bad.', 'Este café es malo.'],
  ])('a thing can be either in %s: "%s"', (...row) => check(row));
  test('a person cannot', () => { expect(run(['Soy aburrido.', "I'm boring.", 'Estoy aburrido.']).rule).toBe('ser-estar-locked'); });

  test.each<Row>([
    ['¿Para quién es el sobre?', 'Who is the envelope for?', '¿Por quién es el sobre?'],
    ['Busco a mi perro.', "I'm looking for my dog.", 'Busco mi perro.'],
    ['Prefiero el té.', 'I prefer tea.', 'Prefiero té.'],
    ['A mi mamá le encanta cocinar los domingos.', 'My mom loves to cook on Sundays.', 'A mi mamá le encanta cocinar domingos.'],
    ['Pienso en viajar a Europa.', "I'm thinking of travelling to Europe.", 'Pienso viajar a Europa.'],
    ['No te vayas sin decirme nada.', "Don't go without telling me anything.", 'No te vayas sin decirme algo.'],
    ['No digo que no me preocupe.', "I'm not saying I don't worry.", 'No digo que no me preocupo.'],
  ])('%s: nothing named for "%s"', (...row) => { const r = run(row); expect(r.rule ?? '', JSON.stringify(r)).not.toMatch(/^(strand|pers-a|article-general|verb-prep|neg-concord|exp-subject)$/); });

  test('the classic gustar slip with no like in the English is refused and named', () => {
    const r = run(['A ella le molesta el ruido.', 'The noise bothers her.', 'Ella le molesta el ruido.']);
    expect(r).toMatchObject({ pass: false, rule: 'exp-subject' });
  });
});

describe('a gap asserts the idea form only when the idea form is what it wants', () => {
  const gap = (gapped: string, en: string, answer: string) => ({ id: 'x', generator: 'ladder', sentenceId: 's', nodes: [], kind: 'typeForm', gapped, en, cue: '', answer, accept: [] }) as never;
  test('an answer that says it is so is not told the opposite', () => {
    const r = itemCheck(gap('Hay vigilancia en la entrada, de modo que no ___ cualquiera.', "There's security at the entrance, so not just anybody gets in.", 'pasa'))('pase');
    expect(r.rule).toBeUndefined();
  });
  test('a gap whose answer is also a present is not locked by a time in the English', () => {
    expect(itemCheck(gap('___ lo del ruido de anoche.', "We're sorry about the noise last night.", 'lamentamos'))('lamentábamos').rule).toBeUndefined();
  });
  test('an opener that asks for it still asserts', () => {
    expect(itemCheck(gap('Quiero que ___ mañana.', 'I want you to come tomorrow.', 'vengas'))('vienes')).toMatchObject({ rule: 'mood-hard' });
  });
});

describe('a pitfall speaks only about what was written', () => {
  beforeAll(() => {
    registerPitfalls({
      version: 1, about: '', nodes: {
        'p:intensificadores': [[pitfallKey('Es también tarde para llamar.'), 'También means also.']],
        'p:me-te-nos-objects': [[pitfallKey('Mariana llamó yo.'), 'Yo is the person doing it.']],
        'g:present-ar': [[pitfallKey('Ustedes trabajas en Bogotá.'), 'Ustedes takes the they ending.']],
        'g:softening': [[pitfallKey('Le quiero preguntar algo.'), 'Not wrong, but blunt. It needs the gentler quería.']],
      },
    });
  });
  afterAll(() => registerPitfalls(undefined));

  test.each<[string, string]>([
    ['p:intensificadores', 'Es tarde para llamar.'], ['p:me-te-nos-objects', 'Mariana llamó.'], ['g:present-ar', 'Trabajas en Bogotá.'],
  ])('%s is silent on "%s", which does not have the word its reason is about', (node, input) => {
    expect(pitfallFor([node], input)).toBeUndefined();
  });
  test('a lesson that says the sentence is not wrong is said, and does not count as an error', () => {
    const r = run(['Le quería preguntar algo.', 'I wanted to ask you something.', 'Le quiero preguntar algo.'], ['g:softening']);
    expect(r).toMatchObject({ pass: false, hintKind: 'pitfall', ask: true });
    expect(r.rule).toBeUndefined();
  });
  test.each<[string, string]>([
    ['p:intensificadores', 'Es también tarde para llamar.'], ['p:me-te-nos-objects', 'Mariana llamó yo.'], ['g:present-ar', 'Ustedes trabajas en Bogotá.'],
    ['p:intensificadores', 'También es tarde para llamar.'],
  ])('%s still fires on "%s"', (node, input) => {
    expect(pitfallFor([node], input)).toBeTruthy();
  });
});

describe('how a miss opens', () => {
  test('a lesson\'s reason that says Almost is not told Not yet first', () => {
    expect(retryLead({ near: false, hint: 'Almost. Before a place, *cerca* needs *de*.', hintKind: 'pitfall' })).toBe('');
    expect(retryLead({ near: false, hint: '*Yo* is the person doing it.', hintKind: 'pitfall' })).toBe('Not yet.');
  });
  test('three differences are another sentence: no rule, a plain one or not', () => {
    const r = run(['Me gustan los perros de mi vecina.', 'I like my neighbour\'s dogs.', 'Me gusta las casas de tu amigo.']);
    expect(r.pass).toBe(false);
    expect(r.rule).toBeUndefined();
  });
});

describe('a claim counts as nothing, everywhere', () => {
  test('a rule from the first try of a claimed answer is not a "you keep"', () => {
    expect(assertHits([{ rule: 'mood-hard' }, { rule: 'mood-hard', claimed: true }]).get('mood-hard')).toBe(1);
  });
  test('"came back" does not read a claim as a pass: Show me, then Mine says the same thing, is one try and Hard', () => {
    const now = 20 * 86_400_000;
    const e: ReviewEvent = { at: now, node: 'g:x', dir: 'productive', grade: 2, op: 'type', scored: 'review', tries: 1, novel: false, session: 1, claimed: true } as ReviewEvent;
    const l = { day: (t: number) => Math.floor(t / 86_400_000), node: () => ({ introducedAt: now - 6 * 86_400_000 }), retrievability: () => undefined } as never;
    expect(lastWeekCameBack([e], l, now)).toEqual({ came: 0, of: 0 });
  });
});
