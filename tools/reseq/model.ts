// The proposal's decisions, as data. build.ts applies them to SEQ's order; simulate.ts applies the node
// changes to LESSON_NODES when it rebuilds the known set. Every entry here is a judgement call that the
// report (docs/plan-2026-11-04/resequence.md) lists.

/* ---- units kept exactly as they are (redesigned 4 November) ---- */
export const FROZEN_UNITS = ['a1-u01', 'a1-u02'];

/* SEQ path lessons the frozen week one deliberately keeps off the path: sounds and stress became one
 * reference card (gr-sonidos-a1, with gr-acentuacion-a1 behind it). */
export const OFF_PATH = ['gr-sonidos-a1'];

/* SEQ merges NOT turned into aliases: dc-entonacion-a1 is a live day of frozen a1-u02, and the redesign
 * keeps gr-acentuacion-a1 as the longer lesson behind the sounds card. */
export const MERGE_EXCLUDED: Record<string, string> = {
  'dc-entonacion-a1': 'a day of frozen a1-u02 (week one, 4 November)',
  'gr-acentuacion-a1': 'kept as the longer accent lesson behind the gr-sonidos-a1 reference card (4 November)',
};

/* ---- the Latin American correction ----
 * SEQ's "Today and ever" (a1-n03, perfecto at 33) and "What happened" (a1-n06, indefinido at 60) trade
 * places as whole units, so the preterite takes the perfecto's slot and the perfecto takes the preterite's
 * (its prerequisite g:preterite-ser-ir-hacer is then 27 positions earlier). */
export const LATAM_SWAP: [string, string] = ['a1-n03', 'a1-n06'];

/* Phase 0 ruling: these two "make optional" rows stay on the path, in the unit named. */
export const KEEP_ON_PATH: Record<string, { unit: string; after: string }> = {
  'nt-textura-consistencia-b1': { unit: 'b1-n39', after: 'nt-medidas-tamano-superficie-b1' },
  'fn-recordar-olvidar-c1': { unit: 'c1-n56', after: 'fn-deseos-planes-c1' },
};

/* ---- stubs: path days whose lessons do not exist yet ----
 * The 17 from SEQ (their titles and positions come from SEQ's table) plus three this proposal adds:
 * the B2 recognition lesson the Latin American correction needs, and homes for the two grammar nodes
 * no lesson teaches at all (tagging-report "Review of the map"). `teaches` is the node model the
 * simulation uses until the lesson is written and tagged; `reviews` are nodes the day practises. */
export type Stub = { title?: string; teaches: string[]; reviews?: string[]; unit?: string; after?: string; why?: string; latam?: string };
export const STUBS: Record<string, Stub> = {
  'fn-no-entiendo-a1': { teaches: ['c:no-entiendo', 'c:como-se-dice', 'c:mas-despacio'] },
  'gr-presente-yo-irregular-a1': { teaches: ['g:yo-irregular'] },
  'gr-ir-a-infinitivo-a1': { teaches: ['g:ir-a-plans', 'c:voy-a'] },
  'gr-pronombres-me-te-nos-a1': { teaches: ['p:me-te-nos-objects'], latam: 'Me, te, nos: the "os" of SEQ\'s title is Spain only; recognition at B2' },
  'fn-cortesia-condicional-a1': { teaches: ['c:me-gustaria'] },
  'nt-dias-fechas-a1': { teaches: ['p:days-el-lunes', 'p:dates-years'] },
  'nt-frecuencia-a1': { teaches: ['p:frequency-scale'] },
  'gr-tener-que-hay-que-a1': { teaches: ['g:tener-que-hay-que', 'c:tengo-que'] },
  'gr-imperfecto-estados-a1': { teaches: ['g:imperfect-states'] },
  'gr-indefinido-irregular-a2': { teaches: ['g:preterite-irregular-strong', 'g:preterite-spelling-stem'] },
  'gr-perfecto-vs-indefinido-a2': { teaches: ['x:pret-perfecto-latam'], reviews: ['g:perfecto-experience', 'g:preterite-ser-ir-hacer'],
    latam: 'Fui vs he ido: the preterite for anything finished (hoy fui), the perfecto for experience and "not yet"; not SEQ\'s Peninsular hoy he ido / ayer fui' },
  'task-a2-hoy-ayer': { teaches: [], latam: 'Cuenta tu semana: choose by meaning (finished vs experience / not yet), not by hoy vs ayer' },
  'gr-ser-estar-adjetivos-a2': { teaches: ['g:ser-estar-adjectives', 'x:ser-estar-adj'] },
  'gr-pronombres-posicion-a2': { teaches: ['g:object-pronoun-position'] },
  'gr-formulas-subjuntivo-a2': { teaches: ['c:que-te-mejores', 'c:ojala', 'c:no-te-preocupes'] },
  'gr-pasados-repaso-b1': { teaches: [], reviews: ['g:preterite-irregular-strong', 'g:imperfect-habitual', 'g:perfecto-experience', 'g:pluperfect', 'x:pret-imp', 'x:pret-perfecto-latam'],
    latam: 'the four pasts with the Latin American split (preterite default, perfecto for experience)' },
  'gr-por-para-b1': { teaches: ['g:por-para-2'], reviews: ['x:por-para', 'g:por-para-1'] },
  // added by this proposal
  'gr-vosotros-espana-b2': { title: 'El español de España: vosotros y hoy he ido (reconocer)', teaches: ['g:vosotros-recognition', 'g:spain-pasts'],
    unit: 'b2-n44', after: 'nt-aumento-disminucion-b2',
    why: 'Latin American correction: vosotros and Spain\'s "today" perfecto become recognition-only, at B2 (Reading the news)' },
  'gr-se-cambio-significado-b1': { title: 'Cuando "se" cambia el sentido: ir / irse, preocupar / preocuparse', teaches: ['g:se-meaning-change', 'x:ir-irse'],
    unit: 'b1-n31', after: null as any,
    why: 'g:se-meaning-change has no lesson at all; opens Feelings, whose verb day is aprobar, quejarse, enfadarse, alegrarse, preocuparse' },
  'gr-para-que-sin-que-b1': { title: 'Para que, sin que, antes de que', teaches: ['g:para-que', 'g:subj-purpose-full'],
    unit: 'b1-n29', after: 'gr-temporales-b1',
    why: 'g:subj-purpose-full has no lesson at all; it needs g:subj-cuando-future, which gr-temporales-b1 teaches just before it' },
};

/* ---- node changes to LESSON_NODES for the simulation ----
 * SEQ's six splits hand the split part the nodes SEQ names for it; the Latin American correction takes
 * vosotros and Spain's past out of A1. Merged lessons' teaches are added to their target automatically. */
export const NODE_MOVES: Array<{ from: string; nodes: string[]; to: string | null; why: string }> = [
  { from: 'preterito', nodes: ['g:preterite-irregular-strong', 'g:preterite-spelling-stem'], to: 'gr-indefinido-irregular-a2', why: 'SEQ split: irregular preterites to day 107' },
  { from: 'ser-estar', nodes: ['g:ser-estar-adjectives', 'x:ser-estar-adj'], to: 'gr-ser-estar-adjetivos-a2', why: 'SEQ split: estar + adjective is the A2 pass' },
  { from: 'gr-presente-irregular-a2', nodes: ['g:yo-irregular'], to: 'gr-presente-yo-irregular-a1', why: 'SEQ split: the yo-irregulars are unpacked first' },
  { from: 'gr-pronombres-atonos-a2', nodes: ['g:indirect-objects', 'x:lo-le'], to: 'gr-objeto-indirecto-a2', why: 'SEQ: lo/la at 75, indirect objects systematised at 140' },
  { from: 'gr-pronombres-atonos-a2', nodes: ['g:double-pronouns', 'x:le-se-lo'], to: 'gr-pronombres-combinados-b1', why: 'SEQ: se lo at 142' },
  { from: 'gr-gerundio-a2', nodes: ['g:object-pronoun-position'], to: 'gr-pronombres-posicion-a2', why: 'SEQ split of gr-pronombres-atonos-a2: pronoun position with infinitive, gerund and command' },
  { from: 'gr-pronombres-combinados-b1', nodes: ['g:object-pronoun-position'], to: 'gr-pronombres-posicion-a2', why: 'SEQ: strip dímelo until clitic placement' },
  { from: 'por-para', nodes: ['g:por-para-2'], to: 'gr-por-para-b1', why: 'SEQ split: por/para second pass at B1' },
  { from: 'nt-referencias-generales-a1', nodes: ['p:frequency-scale'], to: 'nt-frecuencia-a1', why: 'SEQ split of the overloaded time lesson' },
  { from: 'nt-referencias-generales-a1', nodes: ['p:days-el-lunes'], to: 'nt-dias-fechas-a1', why: 'SEQ split of the overloaded time lesson' },
  { from: 'presente', nodes: ['g:vosotros-recognition'], to: 'gr-vosotros-espana-b2', why: 'Latin American: vosotros is recognition only, at B2' },
  { from: 'gr-pronombre-sujeto-a1', nodes: ['g:vosotros-recognition'], to: 'gr-vosotros-espana-b2', why: 'Latin American: ustedes only; vosotros recognition at B2' },
  { from: 'gr-preterito-perfecto-a2', nodes: ['g:spain-pasts'], to: 'gr-vosotros-espana-b2', why: 'Latin American: hoy he ido is Spain\'s use, recognition at B2' },
];

/* Nodes added to a lesson that already teaches them by its content, where SEQ's spine table names the
 * lesson as the point's home and the map put the point on a later lesson. */
export const NODE_ADDS: Array<{ to: string; nodes: string[]; why: string }> = [
  { to: 'nt-existencia-a1', nodes: ['g:hay-vs-esta'], why: 'SEQ spine table: hay vs está on day 24, which is this lesson ("Existencia y presencia: hay, estar, tener"); the map had it on gn-describir-lugar-a1 (SEQ 93)' },
];

/* Lessons the proposal puts on the path that LESSON_NODES does not cover (they were unplaced or in a deep
 * unit when the map was made). Provisional, from title and summary; confirm in tools/lesson-nodes.overrides.json. */
export const PROPOSED_TEACHES: Record<string, string[]> = {
  'gr-el-que-relativos-b2': ['g:relatives-prepositions'],
  'nt-sentidos-b1': ['p:oler-a-saber-a'],
  'gr-ser-impersonal-b1': [],
  'gr-se-multiuso-b1': ['g:se-impersonal', 'p:se-reciproco'],
  'gr-indefinidos-negativos-b1': ['g:indefinites', 'p:indefinites-basic'],
  'gr-posesivo-dativo-b1': ['g:possessive-dative'],
  'gr-modificadores-adverbios-b1': ['g:adverbs-mente'],
  'dc-intensificacion-discurso-b1': ['d:intensify-focus'],
  'gr-subordinadas-sustantivas-a1': ['g:that-clauses'],
  'gr-formas-no-personales-b1': ['g:gerund-ways', 'p:infinitive-instructions'],
  'gn-generos-orales-b1': [],
  'nt-textura-consistencia-b1': ['p:humedo-mojado'],
};

/* ---- B1 verb days: SEQ gives B1 seven verb days by unit but names no set (phase 0, issue 2) ---- */
export const B1_VERB_SETS: Record<string, string[]> = {
  'b1-n26': ['imaginar', 'ocupar'], 'b1-n27': ['formar'], 'b1-n31': ['aprobar'], 'b1-n36': ['mejorar'],
  'b1-n38': ['participar'], 'b1-n39': ['adelantar'],
};

/* ---- where the make-optional lessons go: deep units, as the current course does for its 12 ---- */
export type Deep = { band: string; title: string; goal: string; triggers: string[]; lessons: string[] };
export const NEW_DEEP: Record<string, Deep> = {
  'deep-describir': { band: 'A2', title: 'Describing objects, more practice', goal: 'I can describe an object until someone else could pick it out of a shop window.',
    triggers: ['lesson:gn-describir-objeto-a1'], lessons: ['gn-describir-objeto-a2', 'gn-describir-objeto-b1'] },
  'deep-formulas-b1': { band: 'B1', title: 'Toasts, formulas and emphasis', goal: 'I can raise a glass, say the right thing at a celebration, and make one element of a text stand out.',
    triggers: ['lesson:fn-felicitar-b1'], lessons: ['fn-brindis-b1', 'fn-destacar-elemento-b1'] },
  // the six SEQ cuts are not deleted: they keep a home on the shelf (fn-destacar-elemento-b1 is above)
  'deep-a1-oraciones': { band: 'A1', title: 'Sentence types and asking for quiet', goal: 'I can tell a statement from a question, a command and a wish, and ask for quiet politely.',
    triggers: [], lessons: ['gr-oraciones-actitud-hablante-a1', 'fn-silencio-a1'] },
  'deep-a2-oraciones': { band: 'A2', title: 'The shape of a sentence: verb types, sentence kinds and topic', goal: 'I can name the kind of verb and the kind of sentence I am reading, and say what a sentence is about.',
    triggers: [], lessons: ['gr-nucleo-verbal-tipos-a2', 'gr-oraciones-simples-a2', 'dc-tematizacion-a2'] },
  'deep-el-articulo-b2': { band: 'B2', title: 'The article, where English has none: the B2 part', goal: 'I can use the article for the values a B2 text relies on.',
    triggers: ['lesson:gr-articulo-definido-distribucion-a2'], lessons: ['gr-articulo-definido-valores-b2', 'gr-articulo-indefinido-valores-b2', 'gr-nombres-escuetos-b2'] },
  'deep-b2-materia': { band: 'B2', title: 'How things feel, look and sound', goal: 'I can say what something is made of, how it feels and how it looks, beyond big and small.',
    triggers: ['lesson:nt-medidas-tamano-superficie-b1', 'lesson:nt-textura-consistencia-b1'],
    lessons: ['nt-consistencia-resistencia-b2', 'nt-textura-acabado-b2', 'nt-materia-b2', 'nt-formas-figuras-b2', 'nt-peso-b2', 'nt-humedad-sequedad-b2', 'nt-color-b2', 'nt-limpieza-b2', 'nt-visibilidad-vision-b2', 'nt-audibilidad-audicion-b2'] },
  'deep-b2-espacio': { band: 'B2', title: 'Where things are, precisely', goal: 'I can place, order and move things in space without pointing.',
    triggers: ['lesson:nt-localizacion-posicion-b1', 'lesson:nt-distancia-movimiento-b1'],
    lessons: ['nt-orientacion-direccion-b2', 'nt-orden-b2', 'nt-localizacion-b2', 'nt-posicion-relativa-b2', 'nt-posicion-absoluta-b2', 'nt-distancia-b2', 'nt-movimiento-estabilidad-b2', 'nt-origen-b2'] },
  'deep-b2-valoracion': { band: 'B2', title: 'Judging and qualifying', goal: 'I can say how good, right, important or easy something is with the word a careful writer would choose.',
    triggers: ['lesson:nt-evaluacion-general-b2'],
    lessons: ['nt-adecuacion-b2', 'nt-correccion-precision-b2', 'nt-importancia-normalidad-b2', 'nt-generalidad-especificidad-b2', 'nt-cualidad-general-b2', 'nt-interes-b2', 'nt-realidad-ficcion-b2', 'nt-exito-logro-b2', 'nt-valor-precio-b2', 'nt-utilidad-uso-b2', 'nt-facilidad-b2'] },
  'deep-b2-existencia-tiempo': { band: 'B2', title: 'What exists, what happens, and when', goal: 'I can say what is needed, present, available or lasting, and when things happen in relation to each other.',
    triggers: ['lesson:nt-localizacion-tiempo-b2'],
    lessons: ['nt-necesidad-contingencia-b2', 'nt-permanencia-b2', 'nt-existencia-b2', 'nt-acontecimiento-b2', 'nt-anticipacion-b2', 'nt-simultaneidad-b2', 'nt-repeticion-b2', 'nt-presencia-ausencia-b2', 'nt-disponibilidad-b2'] },
  'deep-c1-sentidos': { band: 'C1', title: 'The physical world at native pitch', goal: 'I can describe how things feel, taste, smell, look and measure in the words a native writer reaches for.',
    triggers: ['lesson:nt-precision-claridad-c1'],
    lessons: ['nt-temperatura-c1', 'nt-sabor-c1', 'nt-olor-c1', 'nt-textura-c1', 'nt-visibilidad-vision-c1', 'nt-audibilidad-audicion-c1', 'nt-color-c1', 'nt-consistencia-resistencia-c1', 'nt-humedad-sequedad-c1', 'nt-acabado-c1', 'nt-accesibilidad-limpieza-c1', 'nt-edad-vejez-c1', 'nt-medidas-generales-tamano-c1', 'nt-peso-superficie-c1', 'nt-volumen-capacidad-presion-c1', 'nt-formas-figuras-c1', 'nt-materia-c1', 'task-c1-idiom'] },
  'deep-c1-espacio': { band: 'C1', title: 'Space and movement at C1', goal: 'I can place and move things in a text precisely enough to be followed without a map.',
    triggers: ['lesson:nt-localizacion-presente-c1'],
    lessons: ['nt-localizacion-c1', 'nt-posicion-absoluta-c1', 'nt-posicion-relativa-c1', 'nt-distancia-c1', 'nt-distancia-velocidad-c1', 'nt-movimiento-estabilidad-sustantivos-c1', 'nt-orientacion-direccion-c1', 'nt-orden-c1', 'nt-origen-c1'] },
  'deep-c1-tiempo': { band: 'C1', title: 'Time and sequence at C1', goal: 'I can say exactly when, how long, how often and in what order, without leaning on the same three words.',
    triggers: ['lesson:nt-localizacion-presente-c1', 'lesson:gr-tiempos-indicativo-c1'],
    lessons: ['nt-simultaneidad-c1', 'nt-anterioridad-c1', 'nt-posterioridad-c1', 'nt-puntualidad-singularidad-c1', 'nt-anticipacion-c1', 'nt-retraso-c1', 'nt-duracion-transcurso-c1', 'nt-frecuencia-c1', 'nt-repeticion-c1', 'nt-inicio-c1', 'nt-finalizacion-c1', 'nt-continuacion-c1', 'nt-permanencia-c1'] },
  'deep-c1-cantidad': { band: 'C1', title: 'Quantity and degree at C1', goal: 'I can say how much, what share and how far something rose or fell, as a report would.',
    triggers: ['lesson:nt-aumento-disminucion-b2'],
    lessons: ['nt-proporcion-c1', 'nt-cantidad-numerica-c1', 'nt-cantidad-relativa-c1', 'nt-aumento-disminucion-c1', 'nt-grado-c1', 'nt-referencias-generales-c1'] },
  'deep-c1-existencia': { band: 'C1', title: 'Existence, certainty and events at C1', goal: 'I can say what exists, what is certain, what is real and what is required, at C1 register.',
    triggers: ['lesson:fn-hipotesis-posibilidad-c1'],
    lessons: ['nt-existencia-inexistencia-c1', 'nt-presencia-ausencia-c1', 'nt-disponibilidad-c1', 'nt-acontecimiento-c1', 'nt-certeza-incertidumbre-c1', 'nt-realidad-ficcion-c1', 'nt-necesidad-obligacion-c1'] },
  'deep-c1-valoracion': { band: 'C1', title: 'Judging and qualifying at C1', goal: 'I can grade quality, normality, interest and competence with the precise adjective.',
    triggers: ['lesson:nt-precision-claridad-c1'],
    lessons: ['nt-atractivo-calidad-c1', 'nt-normalidad-c1', 'nt-interes-c1', 'nt-importancia-c1', 'nt-adecuacion-c1', 'nt-aceptabilidad-c1', 'nt-conformidad-c1', 'nt-correccion-c1', 'nt-generalidad-especificidad-c1', 'nt-cualidad-general-c1', 'nt-evaluacion-general-c1', 'nt-valor-precio-c1', 'nt-exito-logro-c1', 'nt-utilidad-uso-c1', 'nt-capacidad-competencia-c1', 'nt-facilidad-c1', 'fn-habilidad-c1'] },
  'deep-c1-mente': { band: 'C1', title: 'Thinking and saying at C1', goal: 'I can report thought and speech with the verb that says how it was thought or said.',
    triggers: ['lesson:dc-estilo-indirecto-c1'], lessons: ['nt-reflexion-conocimiento-c1', 'nt-expresion-verbal-c1'] },
  'deep-formas-no-personales-c1': { band: 'C1', title: 'The imperative beyond orders, at C1', goal: 'I can read the imperative used to concede, threaten, wish and frame.',
    triggers: ['lesson:gr-formas-no-personales-c1'], lessons: ['gr-imperativo-c1'] },
};
/* Lessons that move into an EXISTING deep unit (SEQ's "deep: ..." labels), and the ones that leave one. */
export const INTO_DEEP: Record<string, string> = {
  'gr-imperativo-valores-b1': 'deep-formas-no-personales',
  'dc-deixis-personal-a2': 'deep-discurso', 'dc-deixis-b1': 'deep-discurso',
  'gr-articulo-anaforico-escuetos-b1': 'deep-el-articulo',
  'gr-complementos-modificadores-b1': 'deep-complementos',
  'gr-numero-sustantivos-b2': 'deep-complementos', 'gr-posesivos-b2': 'deep-complementos', 'gr-concordancia-sn-verbo-b2': 'deep-complementos',
  'gr-nombres-propios-b1': 'deep-genero', 'gr-genero-especial-b1': 'deep-genero', 'gr-numero-sustantivos-b1': 'deep-genero',
  'gr-adverbios-modo-cantidad-b1': 'deep-adverbios',
};

/* ---- the week ---- */
export const WEEK = {
  maxInputs: 2,          // a week is 5 sessions; a sixth (second Input) where the lesson count forces it
  drillReuseWithin: 2,   // a SEQ practice day at most this many positions after the Introduce becomes its Drill
  contrastGap: 3,        // a contrast's second side at least this many days after the first
};

/* The tagging report's "Grammar nodes no old lesson teaches (28 of 172), for Stage 6". */
export const UNTAUGHT_28 = ['g:ir-a-plans', 'g:imperfect-progressive', 'g:diminutives', 'g:lo-adjective', 'g:se-meaning-change', 'g:subj-purpose-full',
  'g:subj-relative', 'g:relatives-prepositions', 'g:cada-cualquier', 'g:passive-se', 'g:questions-prepositions', 'g:reported-requests',
  'g:register-ladder', 'g:subj-concessive', 'g:subj-conditions', 'g:conditional-rumour', 'g:lo-que-intensity', 'g:relatives-formal',
  'g:infinitive-perfect', 'g:subj-future-in-past', 'g:cuyo-relatives', 'g:nominalisation', 'g:consecutive-advanced', 'g:conditional-advanced',
  'g:agreement-tricky', 'g:voseo-recognition', 'g:future-subj-recognition', 'g:word-order-style'];

/* A deep unit with one lesson is folded into a neighbour of its band (a deep unit needs two lessons). */
export const DEEP_FOLD: Record<string, string> = {
  'deep-formas-no-personales-c1': 'deep-sintaxis-c1',
};
