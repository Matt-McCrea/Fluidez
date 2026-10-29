// A tiny, realistic content set for Unit 1 (A1, neutral Latin American
// Spanish, the Bogotá cast): one unit whose seven days cover every lesson
// type, the graph nodes it uses, ~65 bank sentences, one teaching script,
// two chapters, two scenes and three writing tasks. It is used only when the
// real content tree has no sentence bank yet and the dev flag is on, so every
// screen of the session player can be exercised before the burn delivers.
import {
  BankSentence, GraphNode, Scene, StoryChapter, TeachingScript, Unit, WritingTask,
} from '../../content/schema';
import type { ContentSource } from '../../compiler';

export interface FixtureContent {
  units: Unit[];
  nodes: GraphNode[];
  source: ContentSource;
}

const UNIT = 'u01';

const nodes: Array<Partial<GraphNode> & Pick<GraphNode, 'id' | 'kind' | 'title'>> = [
  { id: 'g:ser-identity', kind: 'grammar', priority: 1, title: "Saying who you are and where you're from", es: 'Soy Tomás. Soy de Toronto. ¿Y tú, de dónde eres?', en: "I'm Tomás. I'm from Toronto. And you, where are you from?", serves: ['d:u01-hello-who-i-am'] },
  { id: 'p:ser-profession-no-article', kind: 'pattern', priority: 7, title: "Saying someone's job: es profesora (no 'a')", es: 'Mario es cocinero. Soy ingeniera.', en: "Mario is a cook. I'm an engineer.", requires: ['g:ser-identity'], serves: ['d:u01-hello-who-i-am'] },
  { id: 'c:hola-buenos-dias', kind: 'chunk', priority: 1, title: 'Saying hello at any time of day', es: 'Hola. / Buenos días. / Buenas tardes. / Buenas noches.', en: 'Hi. / Good morning. / Good afternoon. / Good evening.' },
  { id: 'c:me-llamo', kind: 'chunk', priority: 1, title: 'Saying your name and asking theirs', es: 'Me llamo Tomás. / ¿Cómo te llamas?', en: "My name is Tomás. / What's your name?" },
  { id: 'c:soy-de', kind: 'chunk', priority: 1, title: "Saying where you're from", es: 'Soy de Canadá. / ¿De dónde eres?', en: "I'm from Canada. / Where are you from?", unpacks: 'g:ser-identity' },
  { id: 'c:mucho-gusto', kind: 'chunk', priority: 1, title: 'Nice to meet you', es: 'Mucho gusto. — Igualmente.', en: 'Nice to meet you. — Likewise.' },
  { id: 'c:como-estas', kind: 'chunk', priority: 1, title: 'How are you? — Fine, and you?', es: '¿Cómo estás? — Bien, gracias, ¿y tú?', en: 'How are you? — Fine, thanks, and you?' },
  { id: 'c:gracias-de-nada', kind: 'chunk', priority: 2, title: 'Thanks, and the answer to thanks', es: 'Muchas gracias. — De nada.', en: "Thank you very much. — You're welcome." },
  { id: 'c:por-favor', kind: 'chunk', priority: 2, title: 'Please (and the soft way to ask)', es: 'Un tinto, por favor.', en: 'A black coffee, please.' },
  { id: 'c:no-entiendo', kind: 'chunk', priority: 2, title: "I don't understand", es: 'No entiendo.', en: "I don't understand." },
  { id: 'c:trabajo-en', kind: 'chunk', priority: 5, title: 'I work in…', es: 'Trabajo en un café.', en: 'I work in a café.' },
  { id: 'c:vivo-en', kind: 'chunk', priority: 5, title: 'I live in…', es: 'Vivo en La Candelaria. / ¿Dónde vives?', en: 'I live in La Candelaria. / Where do you live?' },
  { id: 'c:me-gusta', kind: 'chunk', priority: 5, title: 'I like… / I don\'t like…', es: 'Me gusta el café.', en: 'I like coffee.' },
  { id: 'l:café', kind: 'lexeme', priority: 5, title: 'café', es: 'el café', en: 'the coffee; the café', pos: 'noun', gender: 'm' },
  { id: 'l:tinto', kind: 'lexeme', priority: 5, title: 'tinto', es: 'el tinto', en: 'the black coffee', pos: 'noun', gender: 'm' },
  { id: 'l:agua', kind: 'lexeme', priority: 5, title: 'agua', es: 'el agua', en: 'the water', pos: 'noun', gender: 'f' },
  { id: 'l:pan', kind: 'lexeme', priority: 5, title: 'pan', es: 'el pan', en: 'the bread', pos: 'noun', gender: 'm' },
  { id: 'l:ingeniero', kind: 'lexeme', priority: 7, title: 'ingeniero', es: 'ingeniero', en: 'engineer', pos: 'noun', gender: 'm' },
  { id: 'l:estudiante', kind: 'lexeme', priority: 7, title: 'estudiante', es: 'estudiante', en: 'student', pos: 'noun', gender: 'mf' },
  { id: 'l:profesor', kind: 'lexeme', priority: 7, title: 'profesor', es: 'profesor', en: 'teacher', pos: 'noun', gender: 'm' },
  { id: 'l:mesero', kind: 'lexeme', priority: 7, title: 'mesero', es: 'mesero', en: 'waiter', pos: 'noun', gender: 'm', peninsular: 'camarero' },
  { id: 'd:u01-hello-who-i-am', kind: 'cando', priority: 10, title: "I can greet someone, say who I am, where I'm from and what I do, and ask them the same." },
];

const unit: Partial<Unit> & Pick<Unit, 'id' | 'days'> = {
  id: UNIT, band: 'A1', title: 'Hello — who I am',
  theme: 'Identidad personal: greetings, names, countries, jobs, café basics',
  canDo: "I can greet someone, say who I am, where I'm from and what I do, and ask them the same.",
  storyArc: 'Tomás lands in Bogotá and learns that his grandmother Rosa has left him a tiny café in La Candelaria. He meets Vale, don Hernando and Simón the parrot.',
  days: [
    { type: 'introduce', focus: ['g:ser-identity'], chunks: ['c:hola-buenos-dias', 'c:me-llamo', 'c:soy-de', 'c:mucho-gusto', 'c:como-estas'], lexemes: [], chapter: 'ch001' },
    { type: 'drill', focus: ['g:ser-identity'], chunks: ['c:gracias-de-nada', 'c:por-favor', 'c:no-entiendo'], lexemes: [] },
    { type: 'input', focus: [], chunks: ['c:trabajo-en', 'c:vivo-en', 'c:me-gusta'], lexemes: ['l:café', 'l:tinto', 'l:agua', 'l:pan'], chapter: 'ch002' },
    { type: 'patterns', focus: ['p:ser-profession-no-article'], chunks: [], lexemes: ['l:ingeniero', 'l:estudiante', 'l:profesor', 'l:mesero'] },
    { type: 'output', focus: ['g:ser-identity'], chunks: [], lexemes: [], scene: 'sc-u01-a' },
    { type: 'review', focus: [], chunks: [], lexemes: [] },
    { type: 'checkpoint', focus: [], chunks: [], lexemes: [] },
  ],
};

type S = { id: string; es: string; en: string; targets: string[]; requires?: string[]; lexemes?: string[]; accept?: string[]; acceptEn?: string[] };
const G = 'g:ser-identity';
const P = 'p:ser-profession-no-article';
const sentences: S[] = [
  // who you are and where you're from
  { id: 'u01-1', es: 'Soy Tomás.', en: "I'm Tomás.", targets: [G] },
  { id: 'u01-2', es: 'Soy de Toronto.', en: "I'm from Toronto.", targets: [G] },
  { id: 'u01-3', es: 'Vale es de Bogotá.', en: 'Vale is from Bogotá.', targets: [G] },
  { id: 'u01-4', es: '¿De dónde eres?', en: 'Where are you from?', targets: [G] },
  { id: 'u01-5', es: '¿Eres de Medellín?', en: 'Are you from Medellín?', targets: [G] },
  { id: 'u01-6', es: 'No soy turista.', en: "I'm not a tourist.", targets: [G], acceptEn: ["I am not a tourist."] },
  { id: 'u01-7', es: 'Soy el nieto de Rosa.', en: "I'm Rosa's grandson.", targets: [G] },
  { id: 'u01-8', es: 'Somos de Canadá.', en: "We're from Canada.", targets: [G] },
  { id: 'u01-9', es: '¿Ustedes son de aquí?', en: 'Are you all from here?', targets: [G], acceptEn: ['Are you from here?'] },
  { id: 'u01-10', es: 'Don Hernando es de Bogotá.', en: 'Don Hernando is from Bogotá.', targets: [G] },
  { id: 'u01-11', es: 'Ella es Vale.', en: "She's Vale.", targets: [G], acceptEn: ['This is Vale.'] },
  { id: 'u01-12', es: '¿Tú eres Tomás?', en: 'Are you Tomás?', targets: [G] },
  { id: 'u01-13', es: 'Simón es un loro.', en: 'Simón is a parrot.', targets: [G] },
  { id: 'u01-14', es: 'El café es de Rosa.', en: "The café is Rosa's.", targets: [G], lexemes: ['l:café'] },
  { id: 'u01-15', es: 'Ellos son de Cali.', en: "They're from Cali.", targets: [G] },
  { id: 'u01-16', es: '¿Quién eres?', en: 'Who are you?', targets: [G] },
  { id: 'u01-17', es: '¿Usted es el nieto de doña Rosa?', en: "Are you doña Rosa's grandson?", targets: [G] },
  { id: 'u01-18', es: 'Soy canadiense.', en: "I'm Canadian.", targets: [G] },
  { id: 'u01-19', es: 'Vale es colombiana.', en: 'Vale is Colombian.', targets: [G] },
  { id: 'u01-20', es: '¿Eres colombiana?', en: 'Are you Colombian?', targets: [G] },
  { id: 'u01-21', es: 'Mi abuela es de La Candelaria.', en: 'My grandmother is from La Candelaria.', targets: [G] },
  { id: 'u01-22', es: 'Nosotros somos amigos.', en: "We're friends.", targets: [G] },
  { id: 'u01-23', es: '¿Ustedes son hermanos?', en: 'Are you brothers?', targets: [G], acceptEn: ['Are you all brothers?', 'Are you siblings?'] },
  { id: 'u01-24', es: 'Es un café pequeño.', en: "It's a small café.", targets: [G], lexemes: ['l:café'] },
  { id: 'u01-25', es: 'No es de aquí.', en: "He's not from here.", targets: [G], acceptEn: ["She's not from here.", "He isn't from here."] },
  { id: 'u01-26', es: 'Eres muy amable.', en: "You're very kind.", targets: [G] },
  { id: 'u01-27', es: '¿De dónde es don Hernando?', en: 'Where is don Hernando from?', targets: [G] },
  { id: 'u01-28', es: 'Usted es de Toronto.', en: "You're from Toronto.", targets: [G] },
  { id: 'u01-29', es: 'Tomás es de Canadá.', en: 'Tomás is from Canada.', targets: [G] },
  { id: 'u01-30', es: '¿Son de Bogotá?', en: 'Are they from Bogotá?', targets: [G], acceptEn: ['Are you all from Bogotá?'] },
  // survival chunks
  { id: 'u01-31', es: 'Hola, Vale.', en: 'Hi, Vale.', targets: ['c:hola-buenos-dias'] },
  { id: 'u01-32', es: 'Buenos días, don Hernando.', en: 'Good morning, don Hernando.', targets: ['c:hola-buenos-dias'] },
  { id: 'u01-33', es: 'Buenas tardes, señora.', en: "Good afternoon, ma'am.", targets: ['c:hola-buenos-dias'] },
  { id: 'u01-34', es: 'Me llamo Tomás.', en: 'My name is Tomás.', targets: ['c:me-llamo'] },
  { id: 'u01-35', es: '¿Cómo te llamas?', en: "What's your name?", targets: ['c:me-llamo'] },
  { id: 'u01-36', es: 'Se llama Simón.', en: 'His name is Simón.', targets: ['c:me-llamo'] },
  { id: 'u01-37', es: '¿Y tú, de dónde eres?', en: 'And you, where are you from?', targets: ['c:soy-de'] },
  { id: 'u01-38', es: 'Soy de Canadá.', en: "I'm from Canada.", targets: ['c:soy-de'] },
  { id: 'u01-39', es: 'Mucho gusto, Tomás.', en: 'Nice to meet you, Tomás.', targets: ['c:mucho-gusto'] },
  { id: 'u01-40', es: 'Igualmente, Vale.', en: 'Likewise, Vale.', targets: ['c:mucho-gusto'] },
  { id: 'u01-41', es: '¿Cómo estás, Vale?', en: 'How are you, Vale?', targets: ['c:como-estas'] },
  { id: 'u01-42', es: 'Bien, gracias, ¿y tú?', en: 'Fine, thanks, and you?', targets: ['c:como-estas'] },
  { id: 'u01-43', es: 'Muchas gracias, Vale.', en: 'Thank you very much, Vale.', targets: ['c:gracias-de-nada'] },
  { id: 'u01-44', es: 'De nada, Tomás.', en: "You're welcome, Tomás.", targets: ['c:gracias-de-nada'] },
  { id: 'u01-45', es: 'Un tinto, por favor.', en: 'A black coffee, please.', targets: ['c:por-favor'], lexemes: ['l:tinto'] },
  { id: 'u01-46', es: 'Un agua, por favor.', en: 'A water, please.', targets: ['c:por-favor', 'l:agua'] },
  { id: 'u01-47', es: 'Perdón, no entiendo.', en: "Sorry, I don't understand.", targets: ['c:no-entiendo'] },
  { id: 'u01-48', es: 'No entiendo el menú.', en: "I don't understand the menu.", targets: ['c:no-entiendo'] },
  { id: 'u01-49', es: 'Trabajo en un café.', en: 'I work in a café.', targets: ['c:trabajo-en'], lexemes: ['l:café'] },
  { id: 'u01-50', es: 'Trabajo en La Candelaria.', en: 'I work in La Candelaria.', targets: ['c:trabajo-en'] },
  { id: 'u01-51', es: 'Vivo en Bogotá.', en: 'I live in Bogotá.', targets: ['c:vivo-en'] },
  { id: 'u01-52', es: '¿Dónde vives?', en: 'Where do you live?', targets: ['c:vivo-en'] },
  { id: 'u01-53', es: 'Me gusta el tinto.', en: 'I like black coffee.', targets: ['c:me-gusta', 'l:tinto'] },
  { id: 'u01-54', es: 'Me gusta el pan de Rosa.', en: "I like Rosa's bread.", targets: ['c:me-gusta', 'l:pan'] },
  { id: 'u01-55', es: 'El pan es de Rosa.', en: "The bread is Rosa's.", targets: ['l:pan'], requires: [G] },
  { id: 'u01-56', es: 'El café es pequeño.', en: 'The café is small.', targets: ['l:café'], requires: [G] },
  // jobs, no article
  { id: 'u01-57', es: 'Soy ingeniero.', en: "I'm an engineer.", targets: [P, 'l:ingeniero'], requires: [G] },
  { id: 'u01-58', es: 'Vale es estudiante.', en: 'Vale is a student.', targets: [P, 'l:estudiante'], requires: [G] },
  { id: 'u01-59', es: 'Don Hernando es profesor.', en: 'Don Hernando is a teacher.', targets: [P, 'l:profesor'], requires: [G] },
  { id: 'u01-60', es: '¿Eres mesero?', en: 'Are you a waiter?', targets: [P, 'l:mesero'], requires: [G], accept: ['¿Eres camarero?'] },
  { id: 'u01-61', es: 'Rosa es cocinera.', en: 'Rosa is a cook.', targets: [P], requires: [G] },
  { id: 'u01-62', es: 'Tomás es ingeniero.', en: 'Tomás is an engineer.', targets: [P, 'l:ingeniero'], requires: [G] },
  { id: 'u01-63', es: 'No soy mesero.', en: "I'm not a waiter.", targets: [P, 'l:mesero'], requires: [G] },
  { id: 'u01-64', es: 'Ella es médica.', en: "She's a doctor.", targets: [P], requires: [G] },
  { id: 'u01-65', es: '¿Usted es profesora?', en: 'Are you a teacher?', targets: [P], requires: [G] },
  { id: 'u01-66', es: 'Somos estudiantes.', en: "We're students.", targets: [P, 'l:estudiante'], requires: [G] },
  { id: 'u01-67', es: 'Ellos son meseros.', en: "They're waiters.", targets: [P, 'l:mesero'], requires: [G] },
  { id: 'u01-68', es: 'Vale es diseñadora.', en: 'Vale is a designer.', targets: [P], requires: [G] },
  { id: 'u01-69', es: 'Mi papá es ingeniero.', en: 'My dad is an engineer.', targets: [P, 'l:ingeniero'], requires: [G] },
  { id: 'u01-70', es: '¿Eres estudiante?', en: 'Are you a student?', targets: [P, 'l:estudiante'], requires: [G] },
  { id: 'u01-71', es: 'Doña Marta es profesora.', en: 'Doña Marta is a teacher.', targets: [P], requires: [G] },
  { id: 'u01-72', es: 'No soy profesor.', en: "I'm not a teacher.", targets: [P, 'l:profesor'], requires: [G] },
  { id: 'u01-73', es: 'Somos meseros.', en: "We're waiters.", targets: [P, 'l:mesero'], requires: [G] },
  { id: 'u01-74', es: 'Ella es ingeniera.', en: "She's an engineer.", targets: [P], requires: [G] },
  { id: 'u01-75', es: 'Ellos son estudiantes.', en: "They're students.", targets: [P, 'l:estudiante'], requires: [G] },
  { id: 'u01-76', es: '¿Usted es mesero?', en: 'Are you a waiter?', targets: [P, 'l:mesero'], requires: [G] },
  { id: 'u01-77', es: 'Mi abuela es cocinera.', en: 'My grandmother is a cook.', targets: [P], requires: [G] },
  { id: 'u01-78', es: 'Soy estudiante de diseño.', en: "I'm a design student.", targets: [P, 'l:estudiante'], requires: [G] },
  { id: 'u01-79', es: 'Simón no es un loro normal.', en: "Simón isn't a normal parrot.", targets: [G] },
  { id: 'u01-80', es: '¿Eres el nieto de Rosa?', en: "Are you Rosa's grandson?", targets: [G] },
  { id: 'u01-81', es: 'Somos de Medellín.', en: "We're from Medellín.", targets: [G] },
  { id: 'u01-82', es: 'La señora es de Cali.', en: 'The lady is from Cali.', targets: [G] },
  { id: 'u01-83', es: 'Soy de aquí.', en: "I'm from here.", targets: [G] },
  { id: 'u01-84', es: '¿Ustedes son de Bogotá?', en: 'Are you all from Bogotá?', targets: [G], acceptEn: ['Are you from Bogotá?'] },
  { id: 'u01-85', es: 'Tú eres de Canadá.', en: "You're from Canada.", targets: [G] },
  { id: 'u01-86', es: 'Vale y Tomás son amigos.', en: 'Vale and Tomás are friends.', targets: [G] },
  { id: 'u01-87', es: 'No somos turistas.', en: "We're not tourists.", targets: [G] },
  { id: 'u01-88', es: 'El loro es de Rosa.', en: "The parrot is Rosa's.", targets: [G] },
  { id: 'u01-89', es: 'Vivo en La Candelaria.', en: 'I live in La Candelaria.', targets: ['c:vivo-en'] },
  { id: 'u01-90', es: 'No me gusta el frío.', en: "I don't like the cold.", targets: ['c:me-gusta'] },
  { id: 'u01-91', es: 'Gracias, don Hernando.', en: 'Thank you, don Hernando.', targets: ['c:gracias-de-nada'] },
  { id: 'u01-92', es: 'Un pan, por favor.', en: 'A bread roll, please.', targets: ['c:por-favor', 'l:pan'] },
  { id: 'u01-93', es: 'El agua es para Simón.', en: 'The water is for Simón.', targets: ['l:agua'], requires: [G] },
];

const script: TeachingScript = {
  node: G,
  hook: {
    line: "Today you'll be able to say who you are and where you're from, and ask someone the same.",
    es: 'Soy Tomás. Soy de Toronto. ¿Y tú?',
    en: "I'm Tomás. I'm from Toronto. And you?",
  },
  examples: [
    { es: 'Soy Tomás.', en: "I'm Tomás." },
    { es: 'Vale es de Bogotá.', en: 'Vale is from Bogotá.' },
    { es: '¿De dónde eres?', en: 'Where are you from?' },
    { es: 'Somos de Canadá.', en: "We're from Canada." },
  ],
  rule: "To say who someone is or where they're from, Spanish uses *ser*. You'll mostly need four forms: *soy* (I am), *eres* (you are), *es* (he, she, or a polite you) and *somos* (we are).\n\nWhere you're from is *ser de*: *Soy de Toronto.* You can leave out *yo*, because *soy* already says \"I\".",
  smallPrint: 'Teachers call this ser for identity and origin.',
  soundTip: 'In *soy*, the *oy* sounds like the end of English *boy*.',
  readAndPick: [
    { es: 'Soy de Toronto.', options: ["I'm from Toronto.", "You're from Toronto.", "She's from Toronto."], answer: 0 },
    { es: '¿De dónde eres?', options: ['Where am I from?', 'Where are you from?', 'Where is she from?'], answer: 1 },
    { es: 'Vale es colombiana.', options: ["I'm Colombian.", "We're Colombian.", 'Vale is Colombian.'], answer: 2 },
    { es: 'Somos de Canadá.', options: ["We're from Canada.", "They're from Canada.", "I'm from Canada."], answer: 0 },
    { es: '¿Eres Tomás?', options: ['Is he Tomás?', 'Are you Tomás?', 'I am Tomás.'], answer: 1 },
    { es: 'Don Hernando es de aquí.', options: ["Don Hernando isn't from here.", 'Don Hernando is from here.', "I'm from here."], answer: 1 },
  ],
  yourTurn: [
    { prompt: "How would you say: I'm Tomás.", answer: 'Soy Tomás.', accept: ['Yo soy Tomás.'], why: 'For "I am", Spanish says soy. No need for yo.' },
    { prompt: "How would you say: I'm from Toronto.", answer: 'Soy de Toronto.', accept: ['Yo soy de Toronto.'], why: 'Where you come from is soy de + the place.' },
    { prompt: 'Ask a friend: Where are you from?', answer: '¿De dónde eres?', accept: ['¿Tú de dónde eres?', '¿De dónde eres tú?'], why: 'To a friend, "you are" is eres. The question starts with de dónde.' },
    { prompt: 'How would you say: Vale is from Bogotá.', answer: 'Vale es de Bogotá.', accept: [], why: 'For one other person, it is es.' },
    { prompt: "How would you say: We're from Canada.", answer: 'Somos de Canadá.', accept: ['Nosotros somos de Canadá.'], why: 'For "we are", Spanish says somos.' },
  ],
  pitfalls: [
    { wrong: 'Estoy de Canadá.', right: 'Soy de Canadá.', why: "Where you're from doesn't change, so it's soy, not estoy." },
    { wrong: 'Yo soy Tomás. Yo soy de Toronto.', right: 'Soy Tomás. Soy de Toronto.', why: 'Soy already says "I". Saying yo every time sounds like you are insisting.' },
  ],
  personal: 'Introduce yourself: your name and where you are from.',
};

const chapters: Array<StoryChapter & { requires: string[] }> = [
  {
    id: 'ch001', unit: UNIT, title: 'La Esquina de Rosa',
    text: [
      'Tomás está en la puerta de un café pequeño en La Candelaria. Una chica abre la puerta.',
      '—Hola. Buenos días —dice Tomás.',
      '—Hello! Are you lost? —dice la chica, en inglés, muy despacio.',
      '—No, no. Me llamo Tomás. Soy de Toronto.',
      '—Mucho gusto, Tomás. Yo soy Vale. ¿Eres turista?',
      '—No soy turista. Soy el nieto de Rosa.',
      'Vale mira a Tomás y sonríe. —¿El nieto de doña Rosa? ¡Bienvenido!',
      'En la ventana, un señor golpea el vidrio.',
      '—Es don Hernando —dice Vale—. Es de aquí, de La Candelaria. Todos los días toma un tinto.',
      'En una jaula, un loro grita: —¡Qué pena con usted!',
      '—Y él es Simón —dice Vale.',
    ].join('\n'),
    gloss: [
      { es: 'puerta', en: 'door' }, { es: 'chica', en: 'girl, young woman' }, { es: 'abre', en: 'opens' },
      { es: 'dice', en: 'says' }, { es: 'despacio', en: 'slowly' }, { es: 'nieto', en: 'grandson' },
      { es: 'mira', en: 'looks at' }, { es: 'sonríe', en: 'smiles' }, { es: 'bienvenido', en: 'welcome' },
      { es: 'ventana', en: 'window' }, { es: 'señor', en: 'man, gentleman' }, { es: 'golpea', en: 'knocks on' },
      { es: 'vidrio', en: 'glass' }, { es: 'todos los días', en: 'every day' }, { es: 'toma', en: 'drinks, has' },
      { es: 'tinto', en: 'small black coffee (Colombia)' }, { es: 'jaula', en: 'cage' }, { es: 'loro', en: 'parrot' },
      { es: 'grita', en: 'shouts' }, { es: '¡Qué pena con usted!', en: "So sorry! (Colombian, polite)" },
      { es: 'está', en: 'is (where)' }, { es: 'pequeño', en: 'small' }, { es: 'aquí', en: 'here' },
    ],
    questions: [
      { q: 'Where is Tomás from?', options: ['Toronto', 'Bogotá', 'Medellín'], answer: 0 },
      { q: 'Who is Vale?', options: ["Tomás's grandmother", 'The young woman at the café door', 'A tourist'], answer: 1 },
      { q: 'What does don Hernando have every day?', options: ['Bread', 'Water', 'A tinto (black coffee)'], answer: 2 },
    ],
    hook: "Tomorrow: Tomás opens the café for the first time. Don Hernando wants his tinto, and Tomás has no idea where anything is.",
    rereadQuestions: [
      { q: 'Who is Simón?', options: ['The parrot', "Vale's brother", 'A waiter'], answer: 0 },
      { q: 'Is Tomás a tourist?', options: ["Yes", "No, he's Rosa's grandson", "We don't know"], answer: 1 },
      { q: 'Where is the café?', options: ['Toronto', 'Medellín', 'La Candelaria'], answer: 2 },
    ],
    requires: ['c:hola-buenos-dias', 'c:me-llamo', 'c:soy-de', 'c:mucho-gusto', G],
    lexemes: [],
  },
  {
    id: 'ch002', unit: UNIT, title: 'Un tinto, por favor',
    text: [
      'Don Hernando entra al café.',
      '—Buenos días, don Hernando. ¿Cómo está?',
      '—Bien, gracias, mijo. Un tinto, por favor.',
      'Tomás no entiende. —Perdón, no entiendo. ¿Un tinto?',
      'Vale ríe. —Un tinto es un café negro, Tomás. Aquí en Bogotá, un tinto es un café.',
      '—Ah. ¿Y usted vive aquí, don Hernando?',
      '—Sí, vivo en La Candelaria. Trabajo en la librería de la esquina. Me gusta mucho el pan de Rosa.',
      '—Yo trabajo aquí ahora —dice Tomás—. Y me gusta el tinto.',
      'Desde la jaula, Simón grita: —¡Un tinto, por favor!',
    ].join('\n'),
    gloss: [
      { es: 'entra', en: 'comes in' }, { es: 'mijo', en: 'son, young man (friendly)' }, { es: 'ríe', en: 'laughs' },
      { es: 'negro', en: 'black' }, { es: 'librería', en: 'bookshop' }, { es: 'esquina', en: 'corner' },
      { es: 'ahora', en: 'now' }, { es: 'desde', en: 'from' }, { es: 'mucho', en: 'a lot' }, { es: 'pan', en: 'bread' },
    ],
    questions: [
      { q: 'What is a tinto in Bogotá?', options: ['Red wine', 'A small black coffee', 'A bread roll'], answer: 1 },
      { q: 'Where does don Hernando work?', options: ['In the bookshop on the corner', 'In the café', 'At the airport'], answer: 0 },
      { q: 'What does don Hernando like?', options: ['The cold', 'Toronto', "Rosa's bread"], answer: 2 },
    ],
    hook: 'Tomorrow: a stranger comes in asking for Rosa. Who is she?',
    rereadQuestions: [
      { q: 'Does Tomás understand "tinto" at first?', options: ['Yes', 'No'], answer: 1 },
      { q: 'Who explains what a tinto is?', options: ['Vale', 'Simón', 'Don Hernando'], answer: 0 },
      { q: 'What does Simón shout?', options: ['¡Hola!', '¡Un tinto, por favor!', '¡Mucho gusto!'], answer: 1 },
    ],
    requires: ['c:trabajo-en', 'c:vivo-en', 'c:me-gusta', G],
    lexemes: ['l:tinto', 'l:pan', 'l:café'],
  },
];

const scenes: Array<Scene & { requires: string[] }> = [
  {
    id: 'sc-u01-a', unit: UNIT, title: 'Meeting Vale',
    spare: false, brief: 'Vale works next door. She stops by the café to say hello. Introduce yourself.',
    requires: ['c:hola-buenos-dias', 'c:me-llamo', G],
    turns: [
      { id: 't1', npc: '¡Hola! Buenos días.', npcEn: 'Hi! Good morning.', intent: 'Say hello back.', accept: ['Hola, buenos días.', 'Hola.', 'Buenos días.'], require: [{ type: 'containsAny', words: ['hola', 'buenos días', 'buenas'], label: 'Say hello: <b>hola</b> or <b>buenos días</b>' }], focus: 'c:hola-buenos-dias', next: 't2' },
      { id: 't2', npc: 'Me llamo Vale. ¿Y tú, cómo te llamas?', npcEn: "I'm Vale. And you, what's your name?", intent: 'Tell her your name.', accept: ['Me llamo Tomás.', 'Soy Tomás.'], require: [{ type: 'containsAny', words: ['me llamo', 'soy'], label: 'Give your name with <b>me llamo</b> or <b>soy</b>' }], focus: 'c:me-llamo', next: 't3' },
      { id: 't3', npc: 'Mucho gusto. ¿De dónde eres?', npcEn: 'Nice to meet you. Where are you from?', intent: "Say where you're from.", accept: ['Soy de Toronto.', 'Soy de Canadá.'], require: [{ type: 'containsWord', word: 'soy', label: 'Use <b>soy</b> (I am)' }, { type: 'regex', pattern: '\\bde\\b', label: 'Say where with <b>de</b>' }], focus: G, next: 't4' },
      { id: 't4', npc: '¡Qué bien! ¿Y eres turista?', npcEn: 'Great! And are you a tourist?', intent: "Say no: you're Rosa's grandson (or grand-daughter: nieta).", accept: ['No, soy el nieto de Rosa.', 'No soy turista. Soy el nieto de Rosa.', 'No, soy la nieta de Rosa.'], require: [{ type: 'negation', label: 'Say <b>no</b>' }, { type: 'containsAny', words: ['nieto', 'nieta'], label: 'Say who you are: <b>nieto</b> / <b>nieta</b>' }], focus: G, next: null },
    ],
  },
  {
    id: 'sc-u01-b', unit: UNIT, title: 'A café in Chapinero',
    spare: false, brief: "It's your day off. You go to another café across town, and the waiter is chatty.",
    requires: ['c:como-estas', 'c:por-favor', 'c:trabajo-en', G],
    turns: [
      { id: 't1', npc: 'Buenas tardes, ¿cómo está?', npcEn: 'Good afternoon, how are you?', intent: 'Answer: fine, thanks, and you?', accept: ['Bien, gracias, ¿y usted?', 'Bien, gracias, ¿y tú?'], require: [{ type: 'containsWord', word: 'bien', label: 'Say how you are: <b>bien</b>' }, { type: 'containsWord', word: 'gracias', label: 'Say <b>gracias</b>' }], focus: 'c:como-estas', next: 't2' },
      { id: 't2', npc: 'Muy bien. ¿Qué le sirvo?', npcEn: 'Very well. What can I get you?', intent: 'Order a black coffee, politely.', accept: ['Un tinto, por favor.'], require: [{ type: 'containsWord', word: 'tinto', label: 'Ask for a <b>tinto</b>' }, { type: 'containsWord', word: 'por favor', label: 'Ask politely with <b>por favor</b>' }], focus: 'c:por-favor', next: 't3' },
      { id: 't3', npc: '¿Usted es de aquí?', npcEn: 'Are you from here?', intent: "Say no, and where you're from.", accept: ['No, soy de Toronto.', 'No, soy de Canadá.'], require: [{ type: 'negation', label: 'Say <b>no</b>' }, { type: 'containsWord', word: 'soy', label: 'Use <b>soy de</b> for where you are from' }], focus: G, next: 't4' },
      { id: 't4', npc: '¿Y qué hace en Bogotá?', npcEn: 'And what do you do in Bogotá?', intent: 'Say you work in a café.', accept: ['Trabajo en un café.'], require: [{ type: 'containsWord', word: 'trabajo', label: 'Use <b>trabajo en</b>' }], focus: 'c:trabajo-en', next: null },
    ],
  },
];

const writing: Array<WritingTask & { requires: string[] }> = [
  {
    id: 'wt-u01-1', unit: UNIT, focus: G, requires: [G],
    prompt: "Write three short sentences to introduce yourself to Vale: your name, where you're from, and one more thing about you.",
    minWords: 6, maxWords: 40,
    constraints: [
      { type: 'containsWord', word: 'soy', label: 'Use <b>soy</b>' },
      { type: 'regex', pattern: '\\bsoy de\\b', label: "Say where you're from with <b>soy de</b>" },
      { type: 'minSentences', n: 3, label: 'Write <b>three</b> sentences' },
    ],
    model: 'Hola, Vale. Soy Matt. Soy de Toronto. No soy turista.',
  },
  {
    id: 'wt-u01-2', unit: UNIT, requires: [G, 'c:vivo-en', 'c:trabajo-en', 'c:hola-buenos-dias'],
    prompt: 'Write a short note to don Hernando: say hello, who you are, where you live and where you work.',
    minWords: 10, maxWords: 50,
    constraints: [
      { type: 'containsAny', words: ['hola', 'buenos días', 'buenas tardes'], label: 'Say hello' },
      { type: 'containsWord', word: 'vivo', label: 'Say where you live with <b>vivo en</b>' },
      { type: 'containsWord', word: 'trabajo', label: 'Say where you work with <b>trabajo en</b>' },
      { type: 'minSentences', n: 3, label: 'Write <b>three</b> sentences' },
    ],
    model: 'Buenos días, don Hernando. Soy Tomás, el nieto de Rosa. Vivo en La Candelaria. Trabajo en el café.',
  },
  {
    id: 'wt-u01-3', unit: UNIT, requires: [G, P, 'c:me-llamo'],
    prompt: "Introduce a friend to Vale: their name, where they're from and their job.",
    minWords: 8, maxWords: 50,
    constraints: [
      { type: 'containsWord', word: 'es', label: 'Use <b>es</b> (he/she is)' },
      { type: 'regex', pattern: '\\bes de\\b', label: "Say where they're from with <b>es de</b>" },
      { type: 'minSentences', n: 3, label: 'Write <b>three</b> sentences' },
    ],
    model: 'Se llama Ana. Es de Cali. Es profesora.',
  },
];

/** Parsed through the schema so defaults are filled exactly as real content is. */
export function fixtureContent(): FixtureContent {
  return {
    units: [Unit.parse(unit)],
    nodes: nodes.map((n) => GraphNode.parse({ band: 'A1', priority: 1, ...n })),
    source: {
      sentences: sentences.map((s) => BankSentence.parse({ ...s, unit: UNIT, source: 'fixture' })),
      chapters: chapters.map((c) => ({ ...StoryChapter.parse(c), requires: c.requires })),
      scenes: scenes.map((s) => ({ ...Scene.parse(s), requires: s.requires })),
      writing: writing.map((w) => ({ ...WritingTask.parse(w), requires: w.requires })),
      scripts: [TeachingScript.parse(script)],
    },
  };
}
