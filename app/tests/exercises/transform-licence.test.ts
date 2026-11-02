// A transform ("Say it happened yesterday", "Make it negative", "Say it about
// yourself") is only asked of a clause that is safely parsed, in a tense the
// learner has been taught. Anything else is refused, and the card falls back
// to a plain one. Swept over every row of the real bank (units 1 to 60): each
// transform it makes is linted for the ways the generator was seen to teach
// broken Spanish (docs/swarm-audit, C2 and LC1-001 to LC1-003).
import { describe, expect, test } from 'vitest';
import { BankSentence } from '../../src/content/schema';
import type { TenseKey } from '../../src/engine';
import { recombinations, transformItems } from '../../src/exercises';
import { namesOf } from '../../src/exercises/licence';
import { singularize, pluralize } from '../../src/exercises/spanish';
import { rows, sweep, taughtBy } from './transform-sweep';

const NAMES_IN_BANK = namesOf(rows);

describe('transforms over the whole bank', () => {
  test('there are rows, and the taught list grows with the units', () => {
    expect(rows.length).toBeGreaterThan(50_000);
    expect(taughtBy.get('u01')).toEqual(['presente']);
    expect(taughtBy.get('u60')!.length).toBeGreaterThan(10);
  });

  test('no transform is one of the known failure classes', { timeout: 300_000 }, () => {
    const { made, byOp, violations, byClass } = sweep({
      transforms: (row, taught) => transformItems(row, { taught, names: NAMES_IN_BANK }),
      recombine: (row, taught) => recombinations(row, { taught }),
    });
    console.log(`transform sweep: ${made} transforms made, ${violations.length} violations`, byOp, byClass);
    // SWEEP_DUMP=voseo prints every 40th violation of a class, to see what the lint caught
    const dump = process.env.SWEEP_DUMP;
    if (dump) console.log(violations.filter((v) => v.cls === dump).filter((_, i) => i % 40 === 0).slice(0, 60).map((v) => `${v.id}\n    ${v.source}\n => ${v.answer}`).join('\n'));
    const sample = Object.keys(byClass).map((cls) => violations.filter((v) => v.cls === cls).slice(0, 3).map((v) => `${cls}: ${v.source} => ${v.answer}`));
    expect(sample.flat()).toEqual([]);
    expect(made).toBeGreaterThan(1000);
  });
});

// ---------------------------------------------------------------- the reproductions

const S = (id: string, es: string, en: string): BankSentence => BankSentence.parse({ id, es, en });
const keys = (s: BankSentence, taught?: readonly TenseKey[]) => transformItems(s, { taught, names: NAMES_IN_BANK }).map((t) => t.id.split(':').slice(-2).join(':'));
const ALL: readonly TenseKey[] = ['presente', 'preterito', 'imperfecto', 'futuro', 'condicional'];

describe('refusals, each from a real screen', () => {
  test.each<[string, string, string]>([
    ['u59 imperative with voseo and a second verb', 'Cuidá a tu hermano mientras yo salgo.', 'Take care of your brother while I go out.'],
    ['u60 poco already negates', 'Poco me sirvió, la verdad.', 'It was hardly any use, to be honest.'],
    ['u53 uno is not unir', 'Cada uno con su cuento: ese es el barrio.', 'Each to their own: that is the neighbourhood.'],
    ['u59 imperative inside', 'Contá cómo te fue con el abogado.', 'Tell me how it went with the lawyer.'],
    ['u60 raras veces', 'Raras veces llama Tomás a su mamá.', 'Tomás rarely calls his mum.'],
  ])('%s: no transform at all', (_n, es, en) => {
    expect(keys(S('x', es, en), ALL)).toEqual([]);
  });

  test('"Se" in a question about how a thing is said stays in the third person', () => {
    expect(keys(S('x', '¿Cómo se dice tinto en inglés?', 'How do you say tinto in English?'), ALL).filter((k) => k.startsWith('person'))).toEqual([]);
    expect(keys(S('x', 'Ustedes se conocen muy bien, ¿verdad?', 'You know each other very well, right?'), ALL)).toEqual([]);
  });

  test('a greeting or an interjection in front of the verb is not given a time word', () => {
    expect(keys(S('x', 'Perdón, soy de Cali.', "Sorry, I'm from Cali."), ALL).filter((k) => k.startsWith('tense'))).toEqual([]);
    expect(keys(S('x', 'Sí, somos de Ottawa.', "Yes, we're from Ottawa."), ALL).filter((k) => k.startsWith('tense'))).toEqual([]);
    expect(keys(S('x', 'Gracias, tengo razón.', "Thanks, I'm right."), ALL).filter((k) => k.startsWith('tense'))).toEqual([]);
  });

  test('plural names and a vocative are not re-personed', () => {
    expect(keys(S('x', 'Ellos son Ana y Pedro, de Cali.', 'They are Ana and Pedro, from Cali.'), ALL).filter((k) => k.startsWith('person'))).toEqual([]);
    expect(keys(S('x', '¿Eres tú, Tomás?', 'Is that you, Tomás?'), ALL).filter((k) => k.startsWith('person'))).toEqual([]);
  });

  test('Vale is a name, not a verb', () => {
    expect(keys(S('x', 'Hay un cliente, Vale.', "There's a customer, Vale."), ALL)).toEqual([]);
    expect(keys(S('x', 'Claro. Listo, Vale.', 'Sure. Done, Vale.'), ALL)).toEqual([]);
  });

  test('a sentence that opens with a common word keeps no stray capital, or is refused', () => {
    for (const [es, en] of [['Poco ganó Hernando.', 'Hernando earned little.'], ['Difícil es decirlo.', "It's hard to say."]] as const) {
      for (const t of transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK })) expect(t.answer, t.answer).not.toMatch(/^(Ayer|Antes|Mañana) \p{Lu}/u);
    }
  });

  test('the dot does not end up after a comma when the object pronoun replaces a phrase after it', () => {
    for (const t of transformItems(S('x', 'Poco me sirvió, la verdad.', 'It was hardly any use, to be honest.'), { taught: ALL })) expect(t.answer).not.toMatch(/,\./);
  });
});

describe('the opening mark of a question stays at the front of it', () => {
  const asked = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).flatMap((t) => [t.answer, ...t.accept]);
  test('a word put in front of the verb goes after the ¿, not before it', () => {
    for (const [es, en] of [
      ['Sin ánimo de preguntar de más, ¿van a vender la casa?', 'Not wanting to pry, are you going to sell the house?'],
      ['Perdón, ¿vives aquí?', 'Sorry, do you live here?'],
      ['Perdón, ¿Tomás trabaja aquí?', 'Sorry, does Tomás work here?'],
    ] as const) {
      for (const a of asked(es, en)) expect(a, a).not.toMatch(/\b(no|lo|la|los|las|le|les|me|te|se|nos|yo|tú|él|ella|nosotros|ellos)\s+[¿¡]/i);
    }
  });
  test('a question word inside the question is not negated around', () => {
    const neg = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).filter((t) => t.transform.op === 'negate');
    expect(neg('Perdón, señora López, ¿cómo se escribe su apellido?', 'Sorry, Mrs López, how do you spell your surname?')).toEqual([]);
    expect(neg('¿En qué calle vive Mariana?', 'What street does Mariana live on?')).toEqual([]);
  });
});

describe('a time phrase is taken out whole or not at all', () => {
  test('"toda la mañana" never leaves "toda la" behind', () => {
    const row = S('x', 'Un vendedor cantó los precios toda la mañana: ¡mango, fresa, naranja!', 'A vendor called out prices all morning: mango, strawberry, orange!');
    expect(recombinations(row, { taught: ALL }).filter((r) => /\b(toda|la|el) [¡¿]/.test(r.es))).toEqual([]);
  });
});

describe('a tense the learner has not been taught is never asked', () => {
  const eat = S('x', 'Como pescado.', 'I eat fish.');
  test('with only the present, there is no tense transform', () => {
    expect(keys(eat, ['presente']).some((k) => k.startsWith('tense'))).toBe(false);
  });
  test('each tense is licensed on its own', () => {
    expect(keys(eat, ['presente', 'preterito'])).toContain('tense:preterito');
    expect(keys(eat, ['presente', 'preterito'])).not.toContain('tense:futuro');
    expect(keys(eat, ['presente', 'futuro'])).toContain('tense:futuro');
    expect(keys(eat, ['presente', 'futuro'])).not.toContain('tense:preterito');
  });
  test('"how it used to be" needs the imperfect', () => {
    const be = S('x', 'Tengo dos hermanos.', 'I have two brothers.');
    expect(keys(be, ['presente', 'preterito'])).not.toContain('tense:imperfecto');
    expect(keys(be, ['presente', 'imperfecto'])).toContain('tense:imperfecto');
  });
  test('without a list nothing is limited (the old default)', () => {
    expect(keys(eat)).toContain('tense:preterito');
  });
  test('recombinations stay inside the list too', () => {
    const r = recombinations(eat, { taught: ['presente'] });
    expect(r.filter((x) => x.transform.op === 'tense' && 'to' in x.transform && x.transform.to !== 'presente')).toEqual([]);
  });
});

describe('a person swap leaves nothing behind that still belongs to the old person', () => {
  const answers = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK });
  const swaps = (es: string, en: string) => answers(es, en).filter((t) => t.transform.op === 'person').map((t) => t.answer);
  const swapped = (es: string, en: string) => recombinations(S('x', es, en), { taught: ALL }).filter((r) => r.transform.op === 'person').map((r) => r.es);

  test.each<[string, string, string]>([
    ['a subject pronoun after the infinitive', 'Voy a llamar yo.', "I'm going to call."],
    ['a subject pronoun after the object', '¿Tienen hambre ustedes?', 'Are you all hungry?'],
    ['a subject pronoun after the participle', '¿Habían hablado ustedes con el banco?', 'Had you all spoken to the bank?'],
    ['se with an indirect object', '¿Se te olvidó algo?', 'Did you forget something?'],
    ['se with an indirect object, how a thing is said', '¿Cómo se le dice no a un jefe?', 'How do you say no to a boss?'],
    ['an own clitic the engine has no reflexive for', 'Nos reímos mucho con Simón.', 'We laughed a lot with Simón.'],
    ['a reciprocal', 'Nos vemos el viernes.', "We'll see each other on Friday."],
    ['a reflexive in a compound tense', 'No me he olvidado de ti.', "I haven't forgotten about you."],
    ['two clitics, the first the subject\'s own', 'Me la llevo.', "I'll take it."],
    ['gustar in a compound tense', 'Me habría gustado ver el helicóptero.', 'I would have liked to see the helicopter.'],
  ])('%s: no swap at all', (_n, es, en) => {
    expect(swaps(es, en)).toEqual([]);
    expect(swapped(es, en)).toEqual([]);
  });

  test('"me" cannot stay with nosotros, nor "nos" with yo', () => {
    expect(swaps('¿Me ayudas con las bolsas?', 'Will you help me with the bags?').join(' | ')).not.toMatch(/ayudamos|ayudo/);
    expect(swaps('Nos explicó la ruta.', 'He explained the route to us.').join(' | ')).not.toMatch(/Nos expliqué/);
    expect(swaps('¿Me podrías ayudar?', 'Could you help me?').join(' | ')).toMatch(/¿Me podría ayudar\?/);
  });

  test('conmigo, contigo, para ti and de mí do not stay with the person they name', () => {
    expect(swaps('¿Quieres ir conmigo?', 'Do you want to go with me?').join(' | ')).not.toMatch(/Quiero ir conmigo/);
    expect(swaps('Quiero hablar contigo.', 'I want to talk to you.').join(' | ')).not.toMatch(/Quieres hablar contigo/);
    expect(swaps('Tengo algo para ti.', 'I have something for you.').join(' | ')).not.toMatch(/Tienes algo para ti/);
    expect(swaps('¿Te acuerdas de mí?', 'Do you remember me?').join(' | ')).not.toMatch(/Me acuerdo de mí/);
  });

  test('a word that shows the number of the subject', () => {
    expect(swaps('Trabajamos juntos en el café.', 'We work together at the café.').join(' | ')).not.toMatch(/(Trabajo|Trabajas|Trabaja) juntos/);
    expect(swaps('¿Cabemos todos en el carro?', 'Do we all fit in the car?')).toEqual(expect.not.arrayContaining(['¿Cabes todos en el carro?']));
    expect(swaps('Nos caímos los dos en la calle.', 'We both fell in the street.').join(' | ')).not.toMatch(/(Me caí|Te caíste|Se cayó) los dos/);
    expect(swaps('Vivo sola en Bogotá.', 'I live alone in Bogotá.').join(' | ')).not.toMatch(/\b(Vivimos|Viven) sola\b/);
    expect(swaps('Llegó cansada del trabajo.', 'She got home tired from work.').join(' | ')).not.toMatch(/(Llegamos|Llegaron) cansada/);
    // it is the subject that matters: every Sunday stays as it is
    expect(swaps('Trabajamos todos los domingos.', 'We work every Sunday.').length).toBeGreaterThan(0);
  });

  test('a vocative with a title is a vocative', () => {
    expect(swaps('¿Cuándo nació usted, don Hernando?', 'When were you born, Don Hernando?')).toEqual([]);
    expect(swaps('¿Tiene hijos, señora?', 'Do you have children, madam?')).toEqual([]);
  });

  test('the word after the verb of a copula is the only one that agrees, and only if it can', () => {
    const says = (es: string, en: string) => swaps(es, en).join(' | ');
    expect(says('Soy estudiante de Cali.', "I'm a student from Cali.")).toContain('Somos estudiantes de Cali.');
    expect(says('Somos estudiantes de Cali.', "We're students from Cali.")).toContain('Soy estudiante de Cali.');
    expect(says('Fuimos muy amables con mi familia.', 'We were very kind to my family.')).toContain('Fui muy amable');
    expect(says('Son verdes.', 'They are green.')).not.toMatch(/\bverd\b/);
    expect(says('Estoy esperándote desde las seis.', "I've been waiting for you since six.")).toContain('Estamos esperándote desde las seis.');
    expect(says('Estoy contento contigo.', "I'm happy with you.")).toContain('Estamos contentos contigo.');
    expect(says('Estoy acá, en la sala.', "I'm here, in the living room.")).toContain('Estamos acá, en la sala.');
    expect(says('Está debajo del sofá.', "He's under the sofa.")).toContain('Estamos debajo del sofá.');
    expect(says('Estoy completamente seguro.', "I'm completely sure.")).toContain('Estamos completamente seguros.');
    expect(says('Me siento fatal.', 'I feel awful.')).toContain('Nos sentimos fatal.');
    expect(says('Se sentía como si todos la miraran.', 'She felt as if everybody were looking at her.')).toContain('Me sentía como si');
    expect(says('Es usted muy generoso.', "You're very generous.")).not.toMatch(/nosotros muy generoso\b/);
    expect(says('¿Eres matemático o filósofo?', 'Are you a mathematician or a philosopher?')).toContain('¿Somos matemáticos o filósofos?');
    expect(says('Es tan buen narrador como para hacerte llorar.', "He's a good enough narrator to make you cry.")).not.toMatch(/buenes|comos/);
    expect(says('Es buena gente.', "He's a good person.")).not.toMatch(/gentes/);
    expect(says('Son cada vez más altos.', "They're taller and taller.")).not.toMatch(/ má /);
    expect(says('Nos sentíamos tristes, pero también contentos.', 'We felt sad, but happy too.')).not.toMatch(/triste, pero también contentos/);
  });

  test('singularize undoes pluralize', () => {
    for (const w of ['estudiante', 'cliente', 'verde', 'grande', 'triste', 'amable', 'dulce', 'noche', 'calle', 'jefe', 'padre', 'enorme', 'ciudad', 'profesor', 'mujer', 'azul', 'fácil', 'feliz', 'lápiz', 'joven', 'inglés', 'alemán', 'canción', 'ley']) {
      expect(singularize(pluralize(w)), w).toBe(w);
    }
  });
});

describe('negation', () => {
  const negated = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).filter((t) => t.transform.op === 'negate');
  test.each<[string, string]>([
    ['Ningún cajero me da plata hoy.', 'No ATM gives me money today.'],
    ['Ninguna de las dos mesas está lista.', 'Neither of the two tables is ready.'],
    ['Ninguno de mis amigos vive en Bogotá.', 'None of my friends lives in Bogotá.'],
    ['¿Vive con quién?', 'She lives with who?'],
    ['¿Salimos a qué hora?', 'We leave at what time?'],
    ['¿Te peinas o qué?', 'Are you combing your hair or what?'],
    ['Sí, está enorme.', "Yes, it's huge."],
  ])('%s is not negated', (es, en) => expect(negated(es, en)).toEqual([]));
});

describe('a time word is cut out of a sentence only when nothing leans on it', () => {
  const re = (es: string, en: string) => recombinations(S('x', es, en), { taught: ALL }).filter((r) => r.transform.op === 'tense').map((r) => r.es);
  test.each<[string, string]>([
    ['¿Me lo puedo medir antes de pagar?', 'Can I try it on before paying?'],
    ['Quiero aguantar un mes más antes de vender.', 'I want to hold out one more month before selling.'],
    ['Esa serie es pesada para ver después de cenar.', 'That series is heavy to watch after dinner.'],
    ['Por suerte me enteré antes que mi jefe.', 'Luckily I found out before my boss.'],
    ['Tomás se levanta muy temprano.', 'Tomás gets up very early.'],
    ['¿Por qué te vas tan temprano?', 'Why are you leaving so early?'],
    ['Podría llegar más temprano mañana.', 'I could get here earlier tomorrow.'],
    ['Estamos abiertos todos los días menos el martes.', "We're open every day except Tuesday."],
  ])('%s', (es, en) => {
    for (const a of re(es, en)) expect(a).not.toMatch(/\b(muy|tan|más|menos)[.?!]| de (pagar|vender|cenar)|enteraré que|enteré que/);
  });

  test('what is left of the tense still works when the time word stands alone', () => {
    expect(re('Hoy comí pescado.', 'Today I ate fish.').length).toBeGreaterThan(0);
  });
});

describe('a time already said in the sentence is not contradicted', () => {
  const told = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).filter((t) => t.transform.op === 'tense').map((t) => t.answer);
  test.each<[string, string]>([
    ['Mariana trabaja en prensa desde hace diez años.', 'Mariana has worked in the press for ten years.'],
    ['Este mes vendemos más.', "This month we're selling more."],
    ['Los niños saltan en el parque todas las tardes.', 'The kids jump in the park every afternoon.'],
    ['La feria se celebra cada año en octubre.', 'The fair is held every year in October.'],
    ['Mi hermano escala montañas los fines de semana.', 'My brother climbs mountains on weekends.'],
    ['Hago una revisión del menú cada seis meses.', 'I review the menu every six months.'],
    ['A fines de octubre llueve en Bogotá.', 'At the end of October it rains in Bogotá.'],
    ['Pensamos vender jugo el próximo sábado.', "We're planning to sell juice next Saturday."],
  ])('%s', (es, en) => expect(told(es, en)).toEqual([]));

  test('soler has no preterite, and voy a has no past of fui a', () => {
    expect(told('Suelo desayunar a las siete.', 'I usually have breakfast at seven.').join(' | ')).not.toMatch(/solí/);
    expect(told('Los clientes van a llegar a las ocho.', 'The customers are going to arrive at eight.').join(' | ')).not.toMatch(/fueron a llegar/);
    expect(told('Te vas a arrepentir.', "You're going to regret it.").join(' | ')).not.toMatch(/fuiste a arrepentir/);
  });
});

describe('the clause the transform rewrites is the main one', () => {
  const all = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK });
  test.each<[string, string]>([
    ['Se basa en lo que vi con mis propios ojos.', "It's based on what I saw with my own eyes."],
    ['A medida que se acaba el año, todo se encarece más.', 'As the year runs out, everything gets more expensive.'],
    ['Qué enredo tan grande armó Altamira con los papeles.', 'What a mess Altamira made with the papers.'],
    ['Por lo visto, sí.', 'Apparently so.'],
  ])('%s: no transform', (es, en) => expect(all(es, en)).toEqual([]));
});

describe('object pronouns', () => {
  const pron = (es: string, en: string) => transformItems(S('x', es, en), { taught: ALL, names: NAMES_IN_BANK }).filter((t) => t.transform.op === 'pronoun');
  test('the noun phrase behind a third-person verb in a question may be its subject', () => {
    expect(pron('¿Dónde comen los médicos?', 'Where do the doctors eat?')).toEqual([]);
    expect(pron('¿Cuándo llama el banco?', 'When does the bank call?')).toEqual([]);
    expect(pron('¿Dónde compraste las velas?', 'Where did you buy the candles?').map((t) => t.answer)).toEqual(['¿Dónde las compraste?']);
  });
  test('two clitics do not split around the verbs', () => {
    expect(pron('Te voy a mostrar mi cuarto.', "I'm going to show you my room.")).toEqual([]);
    expect(pron('Tarde o temprano me vas a dar la razón.', "Sooner or later you'll agree with me.")).toEqual([]);
  });
  test('"Mañana" is not put in front of the infinitive of a reflexive', () => {
    const t = transformItems(S('x', 'A mi hija le ilusiona su primera exposición.', 'My daughter is excited about her first exhibition.'), { taught: ALL, names: NAMES_IN_BANK });
    for (const it of t) for (const a of it.accept) expect(a).not.toMatch(/\bva a \p{L}+se\b/u);
  });
});
