// A synthetic bank: realistic neutral Latin American Spanish, A1–B1.
// Written for these tests; ids follow the `<unit>-<n>` convention.
import { BankSentence } from '../../src/content/schema';

const raw: Array<Partial<BankSentence> & { id: string; es: string; en: string }> = [
  { id: 'u01-1', es: 'Como pescado.', en: 'I eat fish.', targets: ['g:presente'] },
  { id: 'u01-2', es: 'Hablo español en casa.', en: 'I speak Spanish at home.', targets: ['g:presente'] },
  { id: 'u01-3', es: 'Vivimos en Lima.', en: 'We live in Lima.', targets: ['g:presente'] },
  { id: 'u01-4', es: '¿Hablas inglés?', en: 'Do you speak English?', targets: ['g:presente'] },
  { id: 'u01-5', es: 'Ella trabaja en un banco.', en: 'She works in a bank.', targets: ['g:presente'] },
  { id: 'u01-6', es: 'Estoy cansado.', en: "I'm tired.", targets: ['g:estar'] },
  { id: 'u01-7', es: 'Tengo dos hermanos.', en: 'I have two brothers.', targets: ['g:tener'] },
  { id: 'u01-8', es: 'Me levanto temprano.', en: 'I get up early.', targets: ['g:reflexivos'] },
  { id: 'u02-1', es: 'Ayer comí pescado.', en: 'Yesterday I ate fish.', targets: ['g:preterito'] },
  { id: 'u02-2', es: 'Compré el libro.', en: 'I bought the book.', targets: ['g:preterito'] },
  { id: 'u02-3', es: 'Leo el periódico.', en: 'I read the newspaper.', targets: ['g:od'] },
  { id: 'u02-4', es: 'Necesito la llave.', en: 'I need the key.', targets: ['g:od'] },
  { id: 'u02-5', es: 'Quiero comprar la casa.', en: 'I want to buy the house.', targets: ['g:od'] },
  { id: 'u02-6', es: 'Lo veo.', en: 'I see him.', targets: ['g:od-pron'] },
  { id: 'u02-7', es: 'La llamo.', en: 'I call her.', targets: ['g:od-pron'] },
  { id: 'u02-8', es: 'Le doy el libro.', en: 'I give him the book.', targets: ['g:oi-pron'] },
  { id: 'u02-9', es: 'Voy a ver la película.', en: 'I am going to see the movie.', targets: ['g:ir-a'] },
  { id: 'u03-1', es: 'La sopa está fría.', en: 'The soup is cold.', targets: ['x:ser-estar'] },
  { id: 'u03-2', es: 'Estoy aburrido.', en: "I'm bored.", targets: ['x:ser-estar'] },
  { id: 'u03-3', es: 'La casa es blanca.', en: 'The house is white.', targets: ['g:concordancia'] },
  { id: 'u03-4', es: 'El niño es alto.', en: 'The boy is tall.', targets: ['g:concordancia'] },
  { id: 'u03-5', es: 'Trabajo por mi familia.', en: 'I work for my family.', targets: ['x:por-para'] },
  { id: 'u03-6', es: 'Este regalo es para ti.', en: 'This present is for you.', targets: ['x:por-para'] },
  { id: 'u03-7', es: 'Aunque llueve, salgo.', en: "Even though it's raining, I'm going out.", targets: ['g:subj-aunque'] },
  { id: 'u03-8', es: 'Cuando llego a casa, ceno.', en: 'When I get home, I have dinner.', targets: ['g:subj-cuando'] },
  { id: 'u03-9', es: 'Dice que viene mañana.', en: "She says she's coming tomorrow.", targets: ['g:subj-decir'] },
  { id: 'u04-1', es: 'Mi hermana vive en Bogotá.', en: 'My sister lives in Bogotá.', targets: ['g:presente'] },
  { id: 'u04-2', es: 'Vivo allí.', en: 'I live there.', targets: ['l:allí'] },
  { id: 'u04-3', es: 'Ya comimos.', en: 'We already ate.', targets: ['g:preterito'] },
  { id: 'u04-4', es: 'También estudio francés.', en: 'I also study French.', targets: ['l:también'] },
  { id: 'u04-5', es: 'Manejo el carro de mi papá.', en: "I drive my dad's car.", targets: ['l:carro'], accept: ['Conduzco el carro de mi papá.'] },
  { id: 'u04-6', es: 'Tomo jugo de naranja.', en: 'I drink orange juice.', targets: ['l:jugo'] },
  { id: 'u04-7', es: 'Mi computadora es nueva.', en: 'My computer is new.', targets: ['l:computadora'] },
  { id: 'u04-8', es: 'Pongo la mesa.', en: 'I set the table.', targets: ['l:mesa'] },
  { id: 'u04-9', es: 'La mesa es grande.', en: 'The table is big.', targets: ['l:mesa'] },
  { id: 'u05-1', es: 'Ustedes hablan muy bien.', en: 'You all speak very well.', targets: ['g:ustedes'] },
  { id: 'u05-2', es: '¿Dónde vives?', en: 'Where do you live?', targets: ['g:presente'] },
  { id: 'u05-3', es: 'Siempre desayuno a las siete.', en: 'I always have breakfast at seven.', targets: ['g:presente'] },
  { id: 'u05-4', es: 'Escribimos una carta.', en: 'We are writing a letter.', targets: ['g:presente'] },
  { id: 'u05-5', es: 'Hoy cocino yo.', en: "Today I'm cooking.", targets: ['g:presente'] },
  { id: 'u05-6', es: 'Ellos compraron las entradas.', en: 'They bought the tickets.', targets: ['g:preterito'] },
  { id: 'u05-7', es: 'Estamos leyendo el libro.', en: 'We are reading the book.', targets: ['g:estar-gerundio'] },
  { id: 'u05-8', es: 'He comido.', en: 'I have eaten.', targets: ['g:perfecto'] },
  { id: 'u05-9', es: 'Me gusta el café.', en: 'I like coffee.', targets: ['g:gustar'] },
  { id: 'u06-1', es: 'Estudio todos los días.', en: 'I study every day.', targets: ['g:presente'] },
  { id: 'u06-2', es: 'Cuando era niño, jugaba al fútbol.', en: 'When I was a boy, I used to play soccer.', targets: ['g:imperfecto'] },
  { id: 'u06-3', es: 'Mañana viajo a Quito.', en: "Tomorrow I'm travelling to Quito.", targets: ['g:presente'] },
  { id: 'u06-4', es: 'Salimos para Lima.', en: 'We are leaving for Lima.', targets: ['x:por-para'] },
  { id: 'u06-5', es: 'Busco las llaves.', en: "I'm looking for the keys.", targets: ['g:od'] },
  { id: 'u06-6', es: 'Ella está contenta.', en: 'She is happy.', targets: ['g:estar'] },
];

export const BANK: BankSentence[] = raw.map((r) => BankSentence.parse(r));
export const byId = (id: string): BankSentence => {
  const s = BANK.find((x) => x.id === id);
  if (!s) throw new Error('no fixture ' + id);
  return s;
};
