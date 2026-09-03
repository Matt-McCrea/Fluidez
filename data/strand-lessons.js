/* ============================================================================
 * STRAND LESSONS — the lesson types the app did not previously have:
 * `function`, `discourse` and `genre` (see data/taxonomy.js).
 *
 * A grammar lesson teaches a FORM. A function lesson teaches the CHOICE
 * between forms for a social effect: at B2 the Plan Curricular lists 31 ways
 * to agree, and a learner knows every word in all of them. What they do not
 * know is that "Pues sí" and "Comparto tu punto de vista" are not
 * interchangeable. That is why `exponents` carry a `register` and why the
 * validator refuses a function lesson whose exponents span only one — the
 * register contrast IS the teaching point.
 *
 * NOTE ON REGISTER: the PCIC does not tag register on every exponent, so the
 * register assignments here are editorial. They are the part of a generated
 * lesson most worth reviewing by hand.
 *
 * Shape (blocks permitted per strand are declared in data/taxonomy.js):
 *   { id, strand, cefr, level, theme, pcic:[…], title, summary,
 *     sections:[{h,html}], exponents:[{es,en,register,note}],
 *     contrasts:[{es,en,note}], pitfalls:[html], examples:[{es,en}],
 *     probes:[{id, kind:'recall'|'mcq'|'cloze', …}] }
 * ========================================================================== */
window.STRAND_LESSONS = [

{
  id: 'fn-acuerdo-b2', strand: 'function', cefr: 'B2', level: 6, theme: null,
  pcic: ['funciones:B2:252', 'funciones:B2:253', 'funciones:B2:254', 'funciones:B2:257',
         'funciones:B2:258', 'funciones:B2:259', 'funciones:B2:260', 'funciones:B2:262'],
  title: 'Expresar acuerdo',
  summary: 'Agreeing is not one phrase but a scale. The words are all familiar; what changes with register is how much of yourself you commit and how formal the setting is. Picking the wrong rung is the commonest way an advanced learner still sounds off.',
  sections: [
    { h: 'The idea', html: 'Spanish agreement runs from a grunt of assent (<i>Pues sí</i>) to an explicit alignment of viewpoints (<i>Comparto su punto de vista</i>). All of it is grammatically simple; the skill is choosing the rung that fits the room.' },
    { h: 'Agreeing with a negative', html: 'This is the trap. If the statement you are agreeing with is <b>negative</b>, you must switch <i>también</i> to <b>tampoco</b>: <i>—No me convence. —A mí tampoco.</i> Saying <i>a mí también</i> there reverses your meaning.' },
    { h: 'Committing more', html: 'Adding <i>completamente</i>, <i>totalmente</i> or <i>del todo</i> to <i>estoy de acuerdo</i> raises the commitment. <i>Estoy de acuerdo en parte</i> lowers it and opens a counter-argument — the usual move before a <i>pero</i>.' }
  ],
  exponents: [
    { es: 'Pues sí.', en: 'Yeah, true.', register: 'coloquial', note: 'minimal assent; among friends' },
    { es: 'Desde luego.', en: 'Of course / absolutely.', register: 'neutral', note: 'warm, unreserved' },
    { es: 'Yo lo veo igual (que tú).', en: 'I see it the same way.', register: 'coloquial' },
    { es: 'Yo opino lo mismo.', en: 'I think the same.', register: 'neutral' },
    { es: 'A mí también me lo parece.', en: 'It seems that way to me too.', register: 'neutral',
      note: 'becomes "a mí tampoco" after a negative' },
    { es: 'Estoy completamente de acuerdo.', en: 'I completely agree.', register: 'neutral' },
    { es: 'Yo pienso de la misma forma.', en: 'I think along the same lines.', register: 'formal' },
    { es: 'Comparto su punto de vista.', en: 'I share your point of view.', register: 'formal',
      note: 'meetings, letters, anything with usted' },
    { es: 'Coincido plenamente con lo expuesto.', en: 'I fully concur with what has been set out.', register: 'escrito',
      note: 'written argument, minutes, academic prose' }
  ],
  contrasts: [
    { es: '—Esta película es aburridísima. —Pues sí.', en: '—This film is so boring. —Yeah, it is.', note: 'coloquial, among friends' },
    { es: '—No me convence la propuesta. —A mí tampoco.', en: '—The proposal doesn\'t convince me. —Nor me.', note: 'negative statement forces tampoco' },
    { es: '—No me convence la propuesta. —A mí también.', en: '(wrong) —Nor me.', note: 'reverses your meaning — you have just agreed it DOES convince you' },
    { es: 'Comparto su punto de vista, aunque matizaría un aspecto.', en: 'I share your view, though I would qualify one aspect.', note: 'formal agreement that opens a caveat' }
  ],
  pitfalls: [
    'After a <b>negative</b> statement, agreement is <i>tampoco</i>, never <i>también</i>. <i>—No me gusta. —A mí tampoco.</i>',
    '<i>Estoy de acuerdo</i> takes <b>con</b> a person and <b>en</b> a matter: <i>de acuerdo contigo</i>, <i>de acuerdo en eso</i>. Not <i>*de acuerdo a</i>, which is a calque from English.',
    'Do not reach for <i>Comparto su punto de vista</i> with friends — it sounds like you are addressing a committee.'
  ],
  examples: [
    { es: 'Desde luego, en eso estoy completamente de acuerdo contigo.', en: 'Absolutely, on that I completely agree with you.' },
    { es: '—A mí no me parece justo. —A mí tampoco, la verdad.', en: '—It doesn\'t seem fair to me. —Nor to me, honestly.' },
    { es: 'Comparto su punto de vista en lo que respecta al plazo.', en: 'I share your point of view as regards the deadline.' }
  ],
  probes: [
    { id: 'p:acuerdo:polarity', kind: 'mcq',
      q: '—No me convence nada esta idea. — ¿Cómo se expresa acuerdo?',
      options: ['A mí también.', 'A mí tampoco.', 'Yo sí.'], answer: 1 },
    { id: 'p:acuerdo:register', kind: 'mcq',
      q: '¿Cuál usarías en una reunión de trabajo con tu jefe?',
      options: ['Pues sí.', 'Yo lo veo igual que tú.', 'Comparto su punto de vista.'], answer: 2 },
    { id: 'p:acuerdo:prep', kind: 'cloze',
      text: 'Estoy de acuerdo ___ ti en ese punto.', accept: ['contigo', 'con'] },
    { id: 'p:acuerdo:recall', kind: 'recall',
      front: 'Agreeing with a NEGATIVE statement — “A mí ___.”', back: 'tampoco' }
  ]
},

/* ---------------------------------------------------------------------------
 * DISCOURSE — C1. Softening by shifting person, which the PCIC calls
 * "desplazamiento pronominal" (Tácticas y estrategias pragmáticas 3.1.1).
 * Nothing here is new grammar: it is the C1 skill of saying a hard thing
 * without the sentence pointing at anybody.
 * ------------------------------------------------------------------------ */
{
  id: 'dc-atenuacion-c1', strand: 'discourse', cefr: 'C1', level: 8, theme: null,
  pcic: ['tacticas_pragmaticas:C1:288', 'tacticas_pragmaticas:C1:289',
         'tacticas_pragmaticas:C1:291', 'tacticas_pragmaticas:C1:295'],
  title: 'Atenuación: decirlo sin señalar a nadie',
  summary: 'At C1 the difficulty is rarely the grammar of a criticism, a refusal or an order — it is saying it without the sentence pointing a finger. Spanish softens by MOVING THE PERSON: what is really about you becomes “we”, and what is really about me becomes “one” or nobody at all.',
  sections: [
    { h: 'The mechanism', html: 'Every direct statement names an agent: <i>Tienes que revisarlo</i> names <b>you</b>, <i>Creo que te equivocas</i> names <b>me</b> and <b>you</b>. Atenuación displaces that agent onto a less exposed person — first plural, an impersonal <i>se</i>, or nobody — so the criticism survives but the accusation does not.' },
    { h: 'Moving “you” to “we”', html: 'The <b>plural sociativo</b> makes your instruction a shared task: <i>¿Y si lo dejamos para mañana?</i> means <i>leave it</i>, but nobody has been told to do anything. Teachers, doctors and managers live in this construction: <i>Vamos a ver qué hemos hecho aquí.</i>' },
    { h: 'Moving “I” to nobody', html: 'An opinion becomes a fact of the world: <i>Habría que revisarlo</i>, <i>Se recomienda esperar</i>, <i>Cabría preguntarse si…</i>. In writing this is the default register of reports and journalism, where a named opinion sounds like an outburst.' },
    { h: 'The cost', html: 'Atenuación is not politeness for its own sake — it buys the other person a way out. Overused it reads as evasive, and in Spanish, as in English, a manager who never says <i>you</i> is not trusted.' }
  ],
  exponents: [
    { es: '¿Y si lo dejamos para mañana?', en: 'What if we leave it till tomorrow?', register: 'neutral',
      note: 'plural sociativo — really means “you leave it”, but names no one' },
    { es: 'Vamos a ver qué hemos hecho aquí.', en: "Let's see what we've done here.", register: 'coloquial',
      note: 'the teacher/parent “we”; the error is entirely the listener\'s' },
    { es: 'Habría que revisarlo.', en: 'Someone ought to check it.', register: 'neutral',
      note: 'obligation with no subject at all — softer than “tienes que”' },
    { es: 'Uno acaba pensando que no merece la pena.', en: 'One ends up thinking it is not worth it.', register: 'neutral',
      note: '“uno” generalises a private opinion into a shared experience' },
    { es: 'No sé si me explico.', en: "I'm not sure I'm making myself clear.", register: 'coloquial',
      note: 'moves the blame for any confusion onto the speaker' },
    { es: 'Quizá convendría replantear el enfoque.', en: 'It might be advisable to rethink the approach.', register: 'formal',
      note: 'impersonal + conditional; standard in meetings' },
    { es: 'Se ruega no fumar en las instalaciones.', en: 'Please refrain from smoking on the premises.', register: 'formal',
      note: 'impersonal se — the prohibition has no author' },
    { es: 'Cabría preguntarse si la medida resulta proporcionada.', en: 'One might ask whether the measure is proportionate.', register: 'escrito',
      note: 'the standard way to raise an objection in written argument' }
  ],
  pitfalls: [
    'Atenuación is <b>not</b> the conditional alone. <i>Podrías revisarlo</i> is still aimed at you; <i>habría que revisarlo</i> is aimed at nobody. The softening comes from losing the subject, not from the tense.',
    'The sociative <i>we</i> is warm from a colleague and patronising from a stranger — <i>¿Cómo estamos hoy?</i> to an adult patient is famously grating.',
    'In written argument, <i>yo creo que</i> is not wrong but is weak; <i>cabría preguntarse</i> and <i>todo apunta a que</i> carry far more weight for the same claim.'
  ],
  examples: [
    { es: 'Quizá convendría esperar a que se confirmen los datos antes de publicarlos.', en: 'It might be advisable to wait until the data are confirmed before publishing them.' },
    { es: '—Esto está mal. —Bueno, vamos a ver cómo lo arreglamos.', en: '—This is wrong. —Right, let\'s see how we fix it.' },
    { es: 'Cabría preguntarse si el plazo era realista desde el principio.', en: 'One might ask whether the deadline was realistic from the outset.' }
  ],
  probes: [
    { id: 'p:aten:mechanism', kind: 'mcq',
      q: '¿Cuál atenúa más una crítica dirigida a tu compañero?',
      options: ['Tienes que revisarlo.', 'Podrías revisarlo.', 'Habría que revisarlo.'], answer: 2 },
    { id: 'p:aten:sociativo', kind: 'cloze',
      text: 'El médico, para no dar una orden directa: «¿Y si ___ (dejar) el tabaco?»', accept: ['dejamos'] },
    { id: 'p:aten:escrito', kind: 'mcq',
      q: 'En un informe escrito, ¿cómo se introduce una objeción?',
      options: ['Yo creo que está mal.', 'Cabría preguntarse si es proporcionado.', 'No sé si me explico.'], answer: 1 },
    { id: 'p:aten:recall', kind: 'recall',
      front: 'Impersonal obligation, softer than “tienes que” — “___ que revisarlo.”', back: 'habría' }
  ]
},

/* ---------------------------------------------------------------------------
 * GENRE — B2. A text type has a SHAPE, and at B2 the learner is judged on
 * whether they produced the shape, not merely correct sentences.
 * ------------------------------------------------------------------------ */
{
  id: 'gn-reclamacion-b2', strand: 'genre', cefr: 'B2', level: 7, theme: 'servicios',
  pcic: ['generos_discursivos:B2:76', 'generos_discursivos:B2:77'],
  title: 'La carta de reclamación',
  summary: 'A complaint that is merely angry gets filed. A complaint that follows the expected shape — facts, harm, a specific demand, a deadline — gets actioned. B2 is where you are judged on the shape of the text, not just the correctness of its sentences.',
  sections: [
    { h: 'What it is for', html: 'A <i>reclamación</i> is a formal record as much as a request. It is written on the assumption that a third party — a manager, a consumer body, a court — may read it later, which is why it is dated, factual and specific.' },
    { h: 'The register', html: 'Impersonal and cold, never sarcastic. Use <b>usted</b> throughout, the impersonal <i>se</i> for the facts (<i>se contrató</i>, <i>se acordó</i>), and the conditional to soften the demand (<i>agradecería que</i>, <i>les rogaría que</i>). Anger is conveyed by precision, not by adjectives.' },
    { h: 'The one thing most learners miss', html: 'A complaint must state <b>what you want</b>. Many otherwise excellent letters describe the problem in detail and never make a demand, so there is nothing to action.' }
  ],
  moves: [
    { h: 'Encabezamiento', html: 'Your details, the company\'s, the date and a one-line <i>Asunto:</i>. <i>Estimados señores:</i> opens it.' },
    { h: 'Exposición de los hechos', html: 'What happened, in order, with <b>dates, reference numbers and amounts</b>. Impersonal and unemotional: <i>El pasado 3 de marzo se contrató…</i>' },
    { h: 'Perjuicio causado', html: 'The concrete harm — time lost, money spent, service not delivered. This is what justifies the demand.' },
    { h: 'Petición', html: 'The specific remedy: a refund of an exact amount, a repair, a cancellation. <i>Por todo ello, solicito…</i>' },
    { h: 'Plazo y cierre', html: 'A deadline and what follows if it passes, then <i>A la espera de su respuesta, les saluda atentamente,</i> and your name.' }
  ],
  model: {
    title: 'Reclamación por avería no reparada',
    text: 'Estimados señores:\n\nAsunto: reclamación por la avería n.º 48-2291, línea 600 123 456.\n\nEl pasado 3 de marzo se comunicó a su servicio técnico la interrupción total del servicio de internet en el domicilio arriba indicado. Desde esa fecha se han realizado cuatro llamadas y se han concertado dos visitas, ninguna de las cuales llegó a efectuarse.\n\nLa interrupción se prolonga ya durante veintitrés días, período en el que se ha continuado facturando el servicio íntegro. Dado que trabajo desde casa, la avería me ha obligado además a costear un acceso alternativo.\n\nPor todo ello, solicito la reparación inmediata de la línea, la devolución del importe facturado desde el 3 de marzo (68,40 €) y una compensación por los gastos acreditados.\n\nEn caso de no recibir respuesta en el plazo de diez días hábiles, me veré en la obligación de trasladar la presente reclamación a la Oficina Municipal de Información al Consumidor.\n\nA la espera de su respuesta, les saluda atentamente,\n\nM. Serrano'
  },
  checklist: [
    'Does every claim carry a date, a reference or an amount?',
    'Have you stated a specific remedy, not just the problem?',
    'Is there a deadline, and a consequence if it passes?',
    'Is it usted throughout, with no sarcasm and no adjectives doing the work of facts?'
  ],
  examples: [
    { es: 'El pasado 3 de marzo se comunicó la avería a su servicio técnico.', en: 'On 3 March the fault was reported to your technical service.' },
    { es: 'Por todo ello, solicito la devolución del importe facturado.', en: 'For all these reasons, I request a refund of the amount billed.' },
    { es: 'A la espera de su respuesta, les saluda atentamente.', en: 'Awaiting your reply, yours faithfully.' }
  ],
  probes: [
    { id: 'p:recl:demand', kind: 'mcq',
      q: '¿Qué le falta a una reclamación que describe muy bien el problema?',
      options: ['Más detalles del problema', 'Una petición concreta', 'Un tono más enfadado'], answer: 1 },
    { id: 'p:recl:register', kind: 'mcq',
      q: '¿Cómo se exponen los hechos en una reclamación formal?',
      options: ['Con se impersonal y fechas exactas', 'En primera persona y con adjetivos fuertes', 'Con preguntas retóricas'], answer: 0 },
    { id: 'p:recl:close', kind: 'cloze',
      text: 'A la espera de su respuesta, les ___ atentamente.', accept: ['saluda'] },
    { id: 'p:recl:recall', kind: 'recall',
      front: 'The five moves of a carta de reclamación, in order', back: 'encabezamiento · hechos · perjuicio · petición · plazo y cierre' }
  ]
},

/* ============================================================================
 * BATCH 1 — A1 function lessons, seq 55-69 of spec/syllabus-draft.json
 * (skipped in this range: func-a1-valorar — spec conflates several PCIC
 * subsections and needs splitting before authoring; func-a1-expresar-
 * aprobacion-y-desaprobacion — 3 of its 4 items are paralinguistic gestures,
 * not Spanish text; func-a1-reaccionar — merged into fn-establecer-
 * comunicacion-a1, same PCIC subsection 6.1 as its sibling leaf)
 * ========================================================================== */
{
  id: 'fn-identificar-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:1', 'funciones:A1:2', 'funciones:A1:3', 'funciones:A1:4', 'funciones:A1:7', 'funciones:A1:8'],
  title: 'Identificar',
  summary: 'At A1 you name yourself and point out people or things around you. The two moves feel similar but work differently: a full sentence like "Yo soy Laura" stands on its own, while "Aquel diccionario" only makes sense next to a pointing hand — it needs the room, not just the words.',
  sections: [
    { h: 'Saying who you are', html: 'A full sentence identifies without help: <i>Yo soy Laura</i>, <i>Daniel trabaja en un hospital</i>. These work on the phone or in writing — nobody needs to be looking at you.' },
    { h: 'Pointing things out', html: 'Spanish has words that only work with a gesture: <i>este/esta</i> (this), <i>ese/esa</i> (that), <i>aquel/aquella</i> (that, further away), and the neuter <i>esto</i> for something with no name yet. Say <i>Aquel diccionario, por favor</i> and you must be pointing at one.' },
    { h: 'Confirming it is you', html: 'When someone names you, you confirm with the pronoun after the verb: <i>—¿María Sánchez? —Sí, soy yo.</i> Not <i>Yo soy</i> alone — that sounds like you are about to add something.' }
  ],
  exponents: [
    { es: 'Yo soy Laura, ¿y tú?', en: "I'm Laura, and you?", register: 'neutral', note: 'a full sentence — works on the phone or in writing, no gesture needed' },
    { es: '—¿María Sánchez? —Sí, soy yo.', en: "—María Sánchez? —Yes, that's me.", register: 'neutral', note: 'confirming your own identity when named' },
    { es: 'Mi hermana es muy simpática.', en: 'My sister is very nice.', register: 'neutral', note: 'identifying by possession — mi + noun' },
    { es: '—¿Cuál quiere? —Esta.', en: '—Which one do you want? —This one.', register: 'coloquial', note: 'deictic — only means something while pointing' },
    { es: 'Aquel diccionario, por favor.', en: 'That dictionary over there, please.', register: 'coloquial', note: 'aquel marks something far from both speakers' },
    { es: 'Esto es Venezuela.', en: 'This is Venezuela.', register: 'coloquial', note: 'esto, not esta — no noun named yet, e.g. pointing at a map' }
  ],
  pitfalls: [
    'Deictic words (<i>este/ese/aquel</i>, <i>esto</i>) need a gesture or a shared view to mean anything — they do not work in writing without context.',
    '<i>Esto/eso/aquello</i> point at something with no name yet; once you name the noun, agree the gender: <i>este diccionario</i>, not <i>esto diccionario</i>.',
    'Confirming identity is <i>soy yo</i>, not just <i>yo</i> — the verb carries the confirmation.'
  ],
  examples: [
    { es: '—¿Eres tú Daniel? —Sí, soy yo.', en: "—Are you Daniel? —Yes, that's me." },
    { es: 'Esto es mi teléfono: 699 705 388.', en: 'This is my phone: 699 705 388.' },
    { es: 'Aquel señor es mi profesor.', en: 'That man over there is my teacher.' }
  ],
  probes: [
    { id: 'p:identificar:confirm', kind: 'mcq',
      q: 'Alguien pregunta: "¿María Sánchez?" ¿Cómo confirmas que eres tú?',
      options: ['Yo.', 'Sí, soy yo.', 'Sí, es ella.'], answer: 1 },
    { id: 'p:identificar:deixis', kind: 'mcq',
      q: '¿Qué necesitas para decir "Aquel diccionario, por favor"?',
      options: ['Estar señalando algo', 'Estar escribiendo una carta', 'Estar hablando por teléfono'], answer: 0 },
    { id: 'p:identificar:neutro', kind: 'cloze',
      text: 'Esto ___ Venezuela.', accept: ['es'] },
    { id: 'p:identificar:recall', kind: 'recall',
      front: 'Confirming your OWN identity when named — "Sí, ___ yo."', back: 'soy' }
  ]
},

{
  id: 'fn-actividad-a1', strand: 'function', cefr: 'A1', level: 1, theme: 'trabajo',
  pcic: ['funciones:A1:22', 'funciones:A1:23', 'funciones:A1:24'],
  title: 'Actividad',
  summary: 'Three ways to ask what someone does, all addressed to tú, but not interchangeable: one is loose enough for small talk, the other two expect an actual job back.',
  sections: [
    { h: 'The idea', html: 'All three questions use <i>tú</i> — this is early A1, before <i>usted</i> enters the picture — but they are not the same register. <i>¿Qué haces?</i> is loose enough to answer with a hobby; the other two expect a job.' },
    { h: 'Answering', html: 'The natural answer names the job or uses <i>trabajar en/de</i>: <i>Trabajo en un hospital</i>, <i>Trabajo de profesor</i>, <i>Soy profesor</i>.' }
  ],
  exponents: [
    { es: '¿Qué haces?', en: 'What do you do?', register: 'coloquial', note: 'loose enough that "veo la tele" is a fair answer, not only a job' },
    { es: '¿A qué te dedicas?', en: 'What do you do (for a living)?', register: 'neutral', note: "the standard way to ask about someone's work" },
    { es: '¿Cuál es tu profesión?', en: 'What is your profession?', register: 'neutral', note: 'more direct — expects a job title, common on forms read aloud' }
  ],
  pitfalls: [
    'A hobby answers <i>¿qué haces?</i> but not <i>¿a qué te dedicas?</i>, which specifically asks about work.',
    'Answer with <i>trabajar en</i> + place, <i>trabajar de</i> + job, or <i>ser</i> + job — not <i>*soy en</i>.'
  ],
  examples: [
    { es: '—¿A qué te dedicas? —Trabajo en un hospital.', en: '—What do you do? —I work at a hospital.' },
    { es: '—¿Cuál es tu profesión? —Soy profesor de español.', en: "—What is your profession? —I'm a Spanish teacher." },
    { es: '—¿Qué haces los fines de semana? —Nada especial.', en: '—What do you do on weekends? —Nothing special.' }
  ],
  probes: [
    { id: 'p:actividad:register', kind: 'mcq',
      q: '¿Cuál pregunta específicamente por el trabajo, no por el tiempo libre?',
      options: ['¿Qué haces?', '¿A qué te dedicas?', 'Las dos igual'], answer: 1 },
    { id: 'p:actividad:answer', kind: 'mcq',
      q: '—¿A qué te dedicas? —___',
      options: ['Trabajo en un hospital.', 'Soy en un hospital.', 'Hago un hospital.'], answer: 0 },
    { id: 'p:actividad:cloze', kind: 'cloze',
      text: '¿___ es tu profesión?', accept: ['cuál', 'Cuál'] },
    { id: 'p:actividad:recall', kind: 'recall',
      front: 'Ask what someone does for a living (neutral, standard)', back: '¿A qué te dedicas?' }
  ]
},

{
  id: 'fn-pedir-informacion-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:13', 'funciones:A1:14', 'funciones:A1:18', 'funciones:A1:20',
         'funciones:A1:26', 'funciones:A1:28', 'funciones:A1:30', 'funciones:A1:31'],
  title: 'Pedir información',
  summary: 'The question-word survey: who, what, where, where from, how many, what time, why — plus the two-choice question with o. All neutral or casual, all essential; the only trap is the written accent that turns an ordinary word into a question word.',
  sections: [
    { h: 'The set', html: 'Question words cover almost everything you ask in the first weeks: <i>quién</i> (person), <i>dónde</i> (place), <i>de dónde</i> (origin), <i>cuántos/as</i> (quantity), <i>qué hora</i> (time), <i>por qué</i> (reason).' },
    { h: 'Accent marks the question', html: 'Every one of these carries a written accent when it asks a question: <i>qué, dónde, cuántos, por qué</i> — drop the accent and it stops being a question word.' },
    { h: 'Offering a choice', html: '<i>¿... o ...?</i> asks someone to pick: <i>¿Té o café?</i> needs no verb at all.' }
  ],
  exponents: [
    { es: '¿Quién es?', en: 'Who is it/that?', register: 'neutral' },
    { es: '¿Cómo te llamas?', en: "What's your name?", register: 'coloquial', note: 'tú — among people your own age or already on first-name terms' },
    { es: '¿Dónde vives?', en: 'Where do you live?', register: 'neutral' },
    { es: '¿De dónde eres?', en: 'Where are you from?', register: 'neutral' },
    { es: '¿Cuántos años tienes?', en: 'How old are you?', register: 'coloquial', note: 'direct age question — fine with peers, less so with strangers' },
    { es: '¿Qué hora es?', en: 'What time is it?', register: 'neutral' },
    { es: '¿Por qué estudias español?', en: 'Why do you study Spanish?', register: 'neutral' },
    { es: '¿Té o café?', en: 'Tea or coffee?', register: 'coloquial', note: 'no verb needed — offering a choice' }
  ],
  pitfalls: [
    'Question words carry a written accent (<i>qué, dónde, cuántos, por qué</i>); without it they mean something else or nothing (<i>porque</i> = because, not a question).',
    '<i>¿Cuántos años tienes?</i> uses <i>tener</i>, not <i>ser</i>: age is something you HAVE in Spanish, not something you ARE.',
    'The ¿...o...? question needs no verb — do not add one unless you actually mean it: <i>¿Té o café?</i>, not <i>¿Quieres té o quieres café?</i>.'
  ],
  examples: [
    { es: '—¿De dónde eres? —Soy de Perú.', en: "—Where are you from? —I'm from Peru." },
    { es: '—¿Cuántos años tienes? —Tengo veinte años.', en: "—How old are you? —I'm twenty." },
    { es: '—¿Té o café? —Café, por favor.', en: '—Tea or coffee? —Coffee, please.' }
  ],
  probes: [
    { id: 'p:pedirinfo:accent', kind: 'mcq',
      q: '¿Cuál de estas es la pregunta correcta?',
      options: ['¿Donde vives?', '¿Dónde vives?', '¿Dondé vives?'], answer: 1 },
    { id: 'p:pedirinfo:tener', kind: 'mcq',
      q: '—¿Cuántos años tienes? —___',
      options: ['Soy veinte años.', 'Tengo veinte años.', 'Es veinte años.'], answer: 1 },
    { id: 'p:pedirinfo:cloze', kind: 'cloze',
      text: '¿___ hora es?', accept: ['qué', 'Qué'] },
    { id: 'p:pedirinfo:recall', kind: 'recall',
      front: 'Ask where someone is FROM (origin, not current home)', back: '¿De dónde eres?' }
  ]
},

{
  id: 'fn-corregir-informacion-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:65', 'funciones:A1:66', 'funciones:A1:67', 'funciones:A1:69', 'funciones:A1:70'],
  title: 'Corregir una información',
  summary: 'Correcting what someone just said follows a fixed two-step shape: first say no or sí against their statement, then replace it. Skipping the second step leaves your listener with only half a correction.',
  sections: [
    { h: 'Against an affirmative statement', html: 'If they said something that is false, start with <i>No</i>, negate their sentence, then give the right one: <i>—Katrin es alemana. —No, no es alemana, es austriaca.</i>' },
    { h: 'Against a negative statement', html: 'If they denied something true, start with <i>Sí</i> and reassert it: <i>—Katrin no es austriaca. —Sí, es austriaca.</i>' },
    { h: 'Two moves, not one', html: 'A bare <i>No</i> or <i>Sí</i> only registers disagreement; the correction is not complete until you add the accurate fact.' }
  ],
  exponents: [
    { es: '—Katrin es alemana. —No, no es alemana, es austriaca.', en: "—Katrin is German. —No, she isn't, she's Austrian.", register: 'neutral' },
    { es: '—El museo cierra a las seis. —No, cierra a las ocho.', en: '—The museum closes at six. —No, it closes at eight.', register: 'neutral' },
    { es: '—Katrin no es austriaca. —Sí, es austriaca.', en: "—Katrin isn't Austrian. —Yes, she is.", register: 'neutral' },
    { es: '—¿No hablas inglés? —Sí, sí hablo.', en: "—You don't speak English? —Yes, I do.", register: 'coloquial', note: 'the doubled sí (sí, sí hablo) is how speech reinforces the correction' }
  ],
  pitfalls: [
    'A correction needs the new fact, not just <i>no</i>: <i>No, no es alemana</i> alone leaves the listener guessing what she actually is.',
    'Correcting a negative statement takes <i>Sí</i>, not <i>No</i> — you are contradicting a "no", so your answer affirms.'
  ],
  examples: [
    { es: '—Vives en Madrid, ¿no? —No, vivo en Barcelona.', en: '—You live in Madrid, right? —No, I live in Barcelona.' },
    { es: '—¿No tienes hermanos? —Sí, tengo una hermana.', en: "—You don't have siblings? —Yes, I have a sister." },
    { es: '—El examen es el lunes. —No, es el martes.', en: "—The exam is on Monday. —No, it's on Tuesday." }
  ],
  probes: [
    { id: 'p:corregir:afirmativa', kind: 'mcq',
      q: '—Vives en Madrid. (falso, vives en Sevilla) ¿Cómo corriges?',
      options: ['Sí, vivo en Madrid.', 'No, vivo en Sevilla.', 'No.'], answer: 1 },
    { id: 'p:corregir:negativa', kind: 'mcq',
      q: '—¿No tienes coche? (falso, sí tienes) ¿Cómo corriges?',
      options: ['No, no tengo.', 'Sí, tengo.', 'No sé.'], answer: 1 },
    { id: 'p:corregir:cloze', kind: 'cloze',
      text: '—Katrin no es austriaca. —___, es austriaca.', accept: ['Sí', 'sí'] },
    { id: 'p:corregir:recall', kind: 'recall',
      front: 'A correction always needs two parts: sí/no PLUS ___', back: 'the correct fact' }
  ]
},

{
  id: 'fn-dar-informacion-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:53', 'funciones:A1:57', 'funciones:A1:59', 'funciones:A1:61', 'funciones:A1:63'],
  title: 'Dar información',
  summary: 'Answering with a full statement rather than a fragment, and the two connectors that explain yourself: para + infinitive for purpose, porque + clause for reason. Mixing them up is the commonest slip.',
  sections: [
    { h: 'Answering in full', html: 'A declarative sentence answers most questions directly: <i>—¿A qué te dedicas? —Soy profesor de francés.</i> Location and time answers often drop the verb in speech: <i>—¿Dónde está el diccionario? —Aquí. —En la mesa.</i>' },
    { h: 'Para vs porque', html: '<i>Para</i> + infinitive gives a PURPOSE (what for): <i>Estudio español para trabajar en Chile</i>. <i>Porque</i> + a full clause gives a REASON (why): <i>Estudio español porque quiero trabajar en Chile</i>. Both can describe the same fact — they just answer a different half of it.' }
  ],
  exponents: [
    { es: 'Soy profesor de francés.', en: "I'm a French teacher.", register: 'neutral' },
    { es: '—¿Dónde está el diccionario? —Aquí, en la mesa.', en: '—Where is the dictionary? —Here, on the table.', register: 'coloquial', note: 'dropping the verb in a quick spoken answer' },
    { es: '—¿A qué hora te levantas? —Temprano.', en: '—What time do you get up? —Early.', register: 'coloquial', note: 'a one-word answer, fine in conversation' },
    { es: 'Estudio español para trabajar en Chile.', en: 'I study Spanish (in order) to work in Chile.', register: 'neutral', note: 'para + infinitive = purpose' },
    { es: 'Estudio español porque quiero trabajar en Chile.', en: 'I study Spanish because I want to work in Chile.', register: 'neutral', note: 'porque + clause = reason' }
  ],
  pitfalls: [
    '<i>Para</i> takes an infinitive (<i>para trabajar</i>); <i>porque</i> takes a full clause with its own verb (<i>porque quiero</i>). Do not mix them.',
    'One-word answers (<i>Aquí</i>, <i>Temprano</i>) are fine in speech but sound clipped in writing — expand to a full sentence there.'
  ],
  examples: [
    { es: '—¿Por qué estudias español? —Porque me gusta.', en: '—Why do you study Spanish? —Because I like it.' },
    { es: 'Voy a clase para aprender español.', en: 'I go to class (in order) to learn Spanish.' },
    { es: '—¿Qué hora es? —Son las seis.', en: "—What time is it? —It's six o'clock." }
  ],
  probes: [
    { id: 'p:darinfo:parapor', kind: 'mcq',
      q: '"Estudio inglés ___ trabajar en Londres" (purpose)',
      options: ['porque', 'para', 'por qué'], answer: 1 },
    { id: 'p:darinfo:porque', kind: 'mcq',
      q: '"No voy ___ estoy enfermo" (reason)',
      options: ['para', 'por qué', 'porque'], answer: 2 },
    { id: 'p:darinfo:cloze', kind: 'cloze',
      text: 'Voy a clase ___ aprender español.', accept: ['para'] },
    { id: 'p:darinfo:recall', kind: 'recall',
      front: 'para + infinitive = purpose. porque + clause = ___', back: 'reason' }
  ]
},

{
  id: 'fn-acuerdo-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:118', 'funciones:A1:119', 'funciones:A1:120'],
  title: 'Expresar acuerdo (A1)',
  summary: 'At A1, agreeing is almost mechanical: repeat the opinion back, or add también/tampoco to your own reaction. The one thing to get right is which of the two you need.',
  sections: [
    { h: 'Repeating the opinion', html: 'The simplest agreement just repeats the adjective: <i>—Este parque es muy bonito. —Sí, muy bonito.</i> Disagreement repeats it negated: <i>—El español no es difícil. —No, no es difícil.</i>' },
    { h: 'También and tampoco', html: '<i>También</i> adds a matching positive reaction; <i>tampoco</i> adds a matching negative one. They are not interchangeable — using the wrong one reverses your meaning.' }
  ],
  exponents: [
    { es: '—Este parque es muy bonito. —Sí, muy bonito.', en: '—This park is very pretty. —Yes, very pretty.', register: 'coloquial', note: 'repeating the adjective back — casual, spoken' },
    { es: '—El español no es difícil. —No, no es difícil.', en: "—Spanish isn't hard. —No, it isn't.", register: 'coloquial' },
    { es: '—Yo creo que hablar idiomas es importante. —Yo, también.', en: '—I think speaking languages is important. —Me too.', register: 'neutral' }
  ],
  pitfalls: [
    '<i>También</i> agrees with something positive; <i>tampoco</i> agrees with something negative. Saying <i>también</i> after a negative statement reverses your meaning.',
    'Repeating the adjective (<i>Sí, muy bonito</i>) is quick and spoken — in writing, a full sentence reads better.'
  ],
  examples: [
    { es: '—Esta película me gusta mucho. —A mí también.', en: '—I really like this film. —Me too.' },
    { es: '—No me gusta el frío. —A mí tampoco.', en: "—I don't like the cold. —Neither do I." },
    { es: '—El examen es fácil. —Sí, fácil.', en: '—The exam is easy. —Yes, easy.' }
  ],
  probes: [
    { id: 'p:acuerdoa1:tambien', kind: 'mcq',
      q: '—Me gusta el café. — ¿Cómo estás de acuerdo?',
      options: ['A mí también.', 'A mí tampoco.', 'Yo no.'], answer: 0 },
    { id: 'p:acuerdoa1:tampoco', kind: 'mcq',
      q: '—No me gusta el frío. — ¿Cómo estás de acuerdo?',
      options: ['A mí también.', 'A mí tampoco.', 'Yo sí.'], answer: 1 },
    { id: 'p:acuerdoa1:cloze', kind: 'cloze',
      text: '—Este parque es muy bonito. —Sí, muy ___.', accept: ['bonito'] },
    { id: 'p:acuerdoa1:recall', kind: 'recall',
      front: 'Agreeing with a NEGATIVE opinion: "A mí ___."', back: 'tampoco' }
  ]
},

{
  id: 'fn-desacuerdo-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:125', 'funciones:A1:126', 'funciones:A1:127'],
  title: 'Expresar desacuerdo',
  summary: 'Disagreeing at A1 mirrors agreeing: negate their opinion, affirm what they denied, or simply give the opposite. All three need the corrected view stated, not just a bare no.',
  sections: [
    { h: 'Denying a positive', html: '<i>—Yo creo que el francés es muy fácil. —No, no es fácil.</i> The bare "no" is thin — Spanish speakers usually still add the opposite view.' },
    { h: 'Affirming a denied negative', html: '<i>—Esta ciudad no es interesante. —Sí, sí es interesante.</i> Doubling <i>sí</i> is normal in speech to make the correction unmistakable.' },
    { h: 'Giving the opposite outright', html: '<i>—Ese vestido es barato. —No, es caro.</i> You need not repeat their words at all; naming the opposite quality disagrees just as clearly.' }
  ],
  exponents: [
    { es: '—Yo creo que el francés es muy fácil. —No, no es fácil.', en: "—I think French is very easy. —No, it isn't.", register: 'neutral' },
    { es: '—Esta ciudad no es interesante. —Sí, sí es interesante.', en: "—This city isn't interesting. —Yes, it is.", register: 'coloquial', note: 'the doubled sí is how speech underlines the correction' },
    { es: '—Ese vestido es barato. —No, es caro.', en: "—That dress is cheap. —No, it's expensive.", register: 'neutral' }
  ],
  pitfalls: [
    'A bare <i>no</i> registers disagreement but not your actual opinion — add what you DO think.',
    'Disagreeing with a negative takes <i>sí</i>, often doubled in speech (<i>sí, sí es interesante</i>), never a plain <i>no</i>.'
  ],
  examples: [
    { es: '—El libro es aburrido. —No, es muy interesante.', en: "—The book is boring. —No, it's very interesting." },
    { es: '—No me gusta esta canción. —A mí sí me gusta.', en: "—I don't like this song. —I do." },
    { es: '—La comida aquí es cara. —No, es barata.', en: "—The food here is expensive. —No, it's cheap." }
  ],
  probes: [
    { id: 'p:desacuerdo:negar', kind: 'mcq',
      q: '—El francés es fácil. (tú crees que no) ¿Qué dices?',
      options: ['Sí, es fácil.', 'No, no es fácil.', 'No sé.'], answer: 1 },
    { id: 'p:desacuerdo:afirmar', kind: 'mcq',
      q: '—Esta ciudad no es interesante. (tú crees que sí) ¿Qué dices?',
      options: ['No, no es interesante.', 'Sí, sí es interesante.', 'A mí tampoco.'], answer: 1 },
    { id: 'p:desacuerdo:cloze', kind: 'cloze',
      text: '—Ese vestido es barato. —No, es ___.', accept: ['caro'] },
    { id: 'p:desacuerdo:recall', kind: 'recall',
      front: 'Disagreeing with a NEGATIVE statement often doubles this word: "___, ___ es interesante."', back: 'sí, sí' }
  ]
},

{
  id: 'fn-desconocimiento-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:165', 'funciones:A1:166', 'funciones:A1:167', 'funciones:A1:168'],
  title: 'Expresar desconocimiento',
  summary: "Two different verbs cover \"I don't know\": saber for facts and skills, conocer for people and places. Using the wrong one is the single most common mix-up at this level.",
  sections: [
    { h: 'No sé — facts and skills', html: '<i>No sé</i> + a fact (<i>No sé los verbos irregulares</i>) or + infinitive for a skill (<i>No sé pronunciar «perro»</i>).' },
    { h: 'No conozco — people and places', html: '<i>No conozco</i> + a place or person, with the personal <i>a</i> for people: <i>No conozco Granada</i>, <i>No conozco a Sonia</i>.' },
    { h: 'The test', html: 'If you could look it up or learn it as a fact, it is <i>saber</i>. If it is a place you could visit or a person you could meet, it is <i>conocer</i>.' }
  ],
  exponents: [
    { es: 'No sé pronunciar «perro».', en: "I don't know how to pronounce 'perro'.", register: 'neutral', note: 'saber + infinitive = a skill' },
    { es: 'No sé los verbos irregulares.', en: "I don't know the irregular verbs.", register: 'neutral', note: 'saber + noun = a fact' },
    { es: 'No conozco Granada.', en: "I don't know Granada (I've never been).", register: 'neutral', note: 'conocer + place' },
    { es: 'No conozco a Sonia.', en: "I don't know Sonia.", register: 'coloquial', note: 'conocer + person, personal a — casual, about a specific person just mentioned' }
  ],
  pitfalls: [
    '<i>Saber</i> is for facts and skills; <i>conocer</i> is for people and places. <i>*No conozco los verbos</i> and <i>*No sé a Sonia</i> are both wrong.',
    'People take the personal <i>a</i> after <i>conocer</i>: <i>conozco a Sonia</i>, not <i>*conozco Sonia</i>.'
  ],
  examples: [
    { es: '—¿Sabes dónde está la estación? —No, no sé.', en: "—Do you know where the station is? —No, I don't." },
    { es: '—¿Conoces a mi hermano? —No, no lo conozco.', en: "—Do you know my brother? —No, I don't." },
    { es: 'No sé cocinar muy bien.', en: "I don't know how to cook very well." }
  ],
  probes: [
    { id: 'p:desconoc:saberconocer', kind: 'mcq',
      q: '"No ___ a tu hermano." (nunca lo he visto)',
      options: ['sé', 'conozco', 'conoce'], answer: 1 },
    { id: 'p:desconoc:saberinf', kind: 'mcq',
      q: '"No ___ hablar japonés."',
      options: ['conozco', 'sé', 'sabo'], answer: 1 },
    { id: 'p:desconoc:cloze', kind: 'cloze',
      text: 'No conozco ___ Sonia.', accept: ['a'] },
    { id: 'p:desconoc:recall', kind: 'recall',
      front: 'Not knowing a PERSON or PLACE (never having been/met) — no ___', back: 'conozco' }
  ]
},

{
  id: 'fn-dirigirse-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:357', 'funciones:A1:358', 'funciones:A1:359', 'funciones:A1:360'],
  title: 'Dirigirse a alguien',
  summary: "How you open a conversation announces the register before you've said anything else: a first name is casual, title + surname is formal, and the time-of-day greetings sit safely in between.",
  sections: [
    { h: 'By name, casually', html: '<i>Hola, Maite</i> — first name, no title, friends and everyday encounters.' },
    { h: 'By title and surname, formally', html: '<i>Señor López</i>, <i>Señora García</i> — title plus surname, never the first name, for strangers, officials, anyone older you don\'t know.' },
    { h: 'By time of day', html: '<i>Buenos días / buenas tardes / buenas noches</i> works at any register and is the safest default when you are unsure.' }
  ],
  exponents: [
    { es: 'Hola, Maite.', en: 'Hi, Maite.', register: 'coloquial', note: 'first name — friends, people your own age' },
    { es: 'Buenos días.', en: 'Good morning.', register: 'neutral', note: 'safe at any register, any stranger' },
    { es: 'Señor López, por favor.', en: 'Mr López, please.', register: 'formal', note: "title + surname, never the first name — shops, offices, anyone you don't know well" }
  ],
  pitfalls: [
    '<i>Señor/Señora</i> + surname never takes the first name — <i>*Señor Antonio</i> is wrong; it is <i>Antonio</i> alone or <i>Señor López</i>.',
    'Time-of-day greetings agree in gender/number with the noun they hide: <i>buenos días</i> but <i>buenas tardes/noches</i>.'
  ],
  examples: [
    { es: '¿Buenas tardes, está la señora López?', en: 'Good afternoon, is Mrs López in?' },
    { es: 'Hola, ¿qué tal, Antonio?', en: 'Hi, how are you, Antonio?' },
    { es: 'Perdón, señor, ¿tiene hora?', en: 'Excuse me, sir, do you have the time?' }
  ],
  probes: [
    { id: 'p:dirigirse:formal', kind: 'mcq',
      q: 'Entras en una oficina y no conoces a nadie. ¿Cómo te diriges al recepcionista?',
      options: ['Hola, tío.', 'Buenos días.', '¿Qué tal?'], answer: 1 },
    { id: 'p:dirigirse:titulo', kind: 'mcq',
      q: '¿Cuál es correcto?',
      options: ['Señor Antonio', 'Señor López', 'Señor Maite'], answer: 1 },
    { id: 'p:dirigirse:cloze', kind: 'cloze',
      text: '___ tardes, ¿está la señora López?', accept: ['Buenas', 'buenas'] },
    { id: 'p:dirigirse:recall', kind: 'recall',
      front: 'Formal address to a stranger uses title + ___, never the first name', back: 'apellido (surname)' }
  ]
},

{
  id: 'fn-responder-presentacion-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:373', 'funciones:A1:374', 'funciones:A1:375'],
  title: 'Responder a una presentación',
  summary: 'When someone is introduced to you, three short responses cover almost every case — from a single word to a set pleasantry — and they scale with how much warmth you want to signal.',
  sections: [
    { h: 'The minimum', html: '<i>Hola</i> alone is a complete, adequate response to an introduction.' },
    { h: 'Adding warmth', html: '<i>Hola, ¿qué tal?</i> turns the reply into an opening for conversation. <i>Encantado/Encantada</i> — agree the ending with your OWN gender — is the set phrase for "pleased to meet you."' }
  ],
  exponents: [
    { es: 'Hola.', en: 'Hi.', register: 'coloquial', note: 'the bare minimum — perfectly adequate' },
    { es: 'Hola, ¿qué tal?', en: 'Hi, how are you?', register: 'coloquial', note: 'opens the conversation further' },
    { es: 'Encantado.', en: 'Pleased to meet you.', register: 'neutral', note: 'set phrase — agree the ending: encantada if you are a woman' }
  ],
  pitfalls: [
    '<i>Encantado/Encantada</i> agrees with YOUR OWN gender, not the other person\'s.',
    'None of these three needs a verb conjugated to the other person — they are fixed responses, not questions.'
  ],
  examples: [
    { es: '—Te presento a mi hermana, Laura. —Hola, encantada.', en: '—This is my sister, Laura. —Hi, pleased to meet you.' },
    { es: '—Este es Marcos. —Hola, ¿qué tal?', en: "—This is Marcos. —Hi, how's it going?" },
    { es: '—Mucho gusto. —Encantado.', en: '—Nice to meet you. —Likewise.' }
  ],
  probes: [
    { id: 'p:responderpres:genero', kind: 'mcq',
      q: 'Eres una mujer. Te presentan a alguien. ¿Qué dices?',
      options: ['Encantado.', 'Encantada.', 'Encanto.'], answer: 1 },
    { id: 'p:responderpres:minimo', kind: 'mcq',
      q: '¿Cuál es una respuesta correcta y suficiente a una presentación?',
      options: ['Hola.', 'Adiós.', 'Perdón.'], answer: 0 },
    { id: 'p:responderpres:cloze', kind: 'cloze',
      text: '—Te presento a Laura. —Hola, ___.', accept: ['encantada', 'encantado'] },
    { id: 'p:responderpres:recall', kind: 'recall',
      front: 'Set phrase for "pleased to meet you" — agrees with YOUR gender', back: 'encantado / encantada' }
  ]
},

{
  id: 'fn-despedirse-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:409', 'funciones:A1:410', 'funciones:A1:411', 'funciones:A1:412', 'funciones:A1:413'],
  title: 'Despedirse',
  summary: "Goodbyes at A1 range from a bare adiós to a specific arrangement to meet again — the specific version does more social work than adiós alone.",
  sections: [
    { h: 'The plain goodbye', html: '<i>¡Adiós!</i> or, more casually, <i>¡Chao!</i>, closes things with nothing else implied.' },
    { h: 'Naming the next time', html: '<i>Hasta mañana</i>, <i>Hasta el jueves</i> — naming when you\'ll meet again is warmer than a bare adiós; it commits you to something.' }
  ],
  exponents: [
    { es: '¡Adiós!', en: 'Goodbye!', register: 'neutral' },
    { es: '¡Chao!', en: 'Bye!', register: 'coloquial', note: 'casual, borrowed, common with friends' },
    { es: 'Hasta mañana.', en: 'See you tomorrow.', register: 'neutral', note: 'names the next meeting' },
    { es: 'Hasta el jueves.', en: 'See you Thursday.', register: 'neutral', note: 'hasta + el + day of the week' }
  ],
  pitfalls: [
    '<i>Hasta</i> + day needs the article: <i>hasta el jueves</i>, not <i>*hasta jueves</i>.',
    '<i>¡Chao!</i> is casual — save <i>¡Adiós!</i> or a time-of-day goodbye for anyone you don\'t know well.'
  ],
  examples: [
    { es: 'Bueno, ¡adiós! Hasta el lunes.', en: 'Okay, bye! See you Monday.' },
    { es: '¡Chao! Nos vemos mañana.', en: 'Bye! See you tomorrow.' },
    { es: 'Adiós, buenas noches.', en: 'Goodbye, good night.' }
  ],
  probes: [
    { id: 'p:despedirse:articulo', kind: 'mcq',
      q: '¿Cuál es correcto?',
      options: ['Hasta jueves.', 'Hasta el jueves.', 'Hasta un jueves.'], answer: 1 },
    { id: 'p:despedirse:registro', kind: 'mcq',
      q: '¿Cuál usarías con el director de la empresa, no con un amigo?',
      options: ['¡Chao!', 'Adiós, buenas tardes.', '¡Nos vemos!'], answer: 1 },
    { id: 'p:despedirse:cloze', kind: 'cloze',
      text: 'Hasta ___ jueves.', accept: ['el'] },
    { id: 'p:despedirse:recall', kind: 'recall',
      front: 'Casual, borrowed way to say bye to a friend', back: '¡Chao!' }
  ]
},

{
  id: 'fn-establecer-comunicacion-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:418', 'funciones:A1:419', 'funciones:A1:420', 'funciones:A1:421', 'funciones:A1:422', 'funciones:A1:423', 'funciones:A1:424'],
  title: 'Establecer la comunicación',
  summary: "Before you can say anything, you need the other person's attention — and once called, you need a way to show you heard. Both halves are short, almost reflexive phrases (this lesson also covers the PCIC's sibling leaf, reaccionar, since they share one subsection).",
  sections: [
    { h: 'Getting attention', html: 'Say the name (<i>¡María!</i>) or a bare attention-getter (<i>¡Eh!</i>, <i>Perdón</i>, <i>Por favor</i>) to open a channel before your actual message. Eye contact and a small wave do the same job with no words at all.' },
    { h: 'Showing you heard', html: 'Once called, you answer with <i>¿Sí?</i> — a question that means "I\'m listening," not literally "yes." <i>Hola</i> can also open a phone call once contact is made.' }
  ],
  exponents: [
    { es: '¡María!', en: 'María!', register: 'coloquial', note: 'the name alone, called out — informal attention-getter' },
    { es: '¡Eh! Por favor.', en: 'Hey! Excuse me.', register: 'coloquial', note: 'a stranger on the street, casual but not rude' },
    { es: '—¡Ana! —¿Sí?', en: '—Ana! —Yes?', register: 'neutral', note: '¿Sí? here means "I\'m listening", not literal agreement' }
  ],
  pitfalls: [
    '<i>¿Sí?</i> as a response to being called does not answer a question — it means "go ahead, I\'m listening."',
    'Calling a stranger with a bare <i>¡Eh!</i> is fine in the street but too abrupt indoors or with anyone older — add <i>Perdón</i> or <i>Por favor</i>.'
  ],
  examples: [
    { es: '—¡Eh, perdón! Se le cae esto. —¿Sí? Ah, gracias.', en: "—Hey, excuse me! You're dropping this. —Yes? Oh, thanks." },
    { es: '—¡Carlos! —¿Sí, dime?', en: '—Carlos! —Yes, what is it?' },
    { es: 'Por favor, ¿tiene hora?', en: 'Excuse me, do you have the time?' }
  ],
  probes: [
    { id: 'p:establecercom:responder', kind: 'mcq',
      q: 'Alguien te llama por tu nombre. ¿Cómo respondes para mostrar que escuchas?',
      options: ['Adiós.', '¿Sí?', 'Gracias.'], answer: 1 },
    { id: 'p:establecercom:atencion', kind: 'mcq',
      q: 'Necesitas la atención de un desconocido en la calle, con educación.',
      options: ['¡Eh, tú!', 'Perdón, por favor.', 'Hola, ¿qué tal?'], answer: 1 },
    { id: 'p:establecercom:cloze', kind: 'cloze',
      text: '—¡Ana! —¿___?', accept: ['Sí', 'sí'] },
    { id: 'p:establecercom:recall', kind: 'recall',
      front: 'Response to being called that means "I\'m listening," not literal agreement', back: '¿Sí?' }
  ]
},

/* ============================================================================
 * BATCH 2 — seq 70-86 of spec/syllabus-draft.json.
 * Skipped: disc-a1-entonacion (75) — intonation contours don't fit the
 * register-contrast exponent model (pitch, not formality), and this is a
 * text app with no audio.
 * genr-a1-generos-de-transmision-oral (78) — spec is mostly cross-references
 * and classification labels; its real content is already covered by the
 * function lessons (saludar, pedir/dar información) and by the richer
 * transactional-conversation genre lesson below.
 * The genre range (77-86) has a harvester bug: four ids repeat 2-3 times
 * each because "Elementos lingüísticos" / "Proceso prototípico" / "Géneros
 * de transmisión escrita" are leaf names reused across different PCIC
 * subsections (describing people vs objects vs places; two adjacent
 * written-genre inventories). Consolidated into 5 lessons by actual
 * subsection rather than authoring 10 thin or duplicate ones:
 *   77+79 -> gn-generos-escritos-a1 (both are catalogs of the same short
 *            written text types, from two adjacent PCIC sections)
 *   80    -> gn-conversacion-transaccional-a1 (rich on its own — 24 spec
 *            items describing a full move structure)
 *   81+82, 83+84, 85+86 -> one description genre per topic (person / object
 *            / place), each pairing its "elementos lingüísticos" (the
 *            toolkit) with its "proceso prototípico" (the structure) —
 *            they are two halves of one lesson, and the PCIC's own worked
 *            examples (Carlinhos, the tomato, Andrea's house) become the
 *            models.
 * ========================================================================== */
{
  id: 'fn-silencio-a1', strand: 'function', cefr: 'A1', level: 1, theme: null,
  pcic: ['funciones:A1:469', 'funciones:A1:470', 'funciones:A1:471'],
  title: 'Pedir silencio',
  summary: 'Asking for quiet ranges from a wordless "shh" to a polite fixed phrase — the choice signals how much authority or courtesy the moment calls for.',
  sections: [
    { h: 'The bare minimum', html: '<i>¡Shhh!</i> is not really a word — it is a sound, understood everywhere, and blunt. Fine among friends, risky with strangers or superiors.' },
    { h: 'Adding courtesy', html: '<i>Silencio, por favor</i> turns the same request into something you could say to a room of strangers — a teacher, a librarian, a guide.' }
  ],
  exponents: [
    { es: '¡Shhh!', en: 'Shh!', register: 'coloquial', note: 'a sound, not a word — blunt, among friends' },
    { es: 'Silencio, por favor.', en: 'Quiet, please.', register: 'neutral', note: 'polite enough for a classroom or library' },
    { es: '¡Shhh! Silencio, por favor.', en: 'Shh! Quiet, please.', register: 'coloquial', note: 'combines both — still leads with the blunt shush' }
  ],
  pitfalls: [
    'A bare <i>¡Shhh!</i> at a stranger can read as rude — add <i>por favor</i> if you do not know them.'
  ],
  examples: [
    { es: '—¡Shhh! Está durmiendo el bebé.', en: '—Shh! The baby is sleeping.' },
    { es: 'Silencio, por favor, va a empezar la película.', en: 'Quiet, please, the film is about to start.' },
    { es: 'La profesora dice: "Silencio, por favor."', en: 'The teacher says: "Quiet, please."' }
  ],
  probes: [
    { id: 'p:silencio:registro', kind: 'mcq',
      q: 'Estás en una biblioteca con desconocidos. ¿Qué dices?',
      options: ['¡Shhh!', 'Silencio, por favor.', '¡Cállate!'], answer: 1 },
    { id: 'p:silencio:minimo', kind: 'mcq',
      q: '¿Cuál de estas NO es realmente una palabra, sino un sonido?',
      options: ['Silencio', '¡Shhh!', 'Por favor'], answer: 1 },
    { id: 'p:silencio:cloze', kind: 'cloze',
      text: 'Silencio, ___ favor.', accept: ['por'] },
    { id: 'p:silencio:recall', kind: 'recall',
      front: 'Polite way to ask a room of strangers for quiet', back: 'Silencio, por favor.' }
  ]
},

{
  id: 'dc-conectores-a1', strand: 'discourse', cefr: 'A1', level: 1, theme: null,
  pcic: ['tacticas_pragmaticas:A1:8', 'tacticas_pragmaticas:A1:9', 'tacticas_pragmaticas:A1:10',
         'tacticas_pragmaticas:A1:11', 'tacticas_pragmaticas:A1:12', 'tacticas_pragmaticas:A1:13'],
  title: 'Conectores',
  summary: 'A handful of small words do the heavy lifting of connected speech: adding a fact, turning against the last one, explaining it, giving an example, or just checking the listener is still there.',
  sections: [
    { h: 'Adding and contrasting', html: '<i>Y</i> adds; <i>pero</i> turns against what came before. <i>También</i> adds a matching fact; <i>tampoco</i> its negative twin.' },
    { h: 'Explaining and illustrating', html: '<i>Porque</i> gives the reason. <i>Por ejemplo</i> narrows a general claim to one concrete case.' },
    { h: 'Checking contact', html: 'Tags like <i>¿no?</i> and <i>¿eh?</i> turn a statement into an invitation to agree — they check the listener is still following, not really asking a question.' }
  ],
  exponents: [
    { es: 'Tengo dos hermanos y una hermana.', en: 'I have two brothers and a sister.', register: 'neutral', note: 'y — adding' },
    { es: 'Tengo un hijo, pero no estoy casado.', en: "I have a son, but I'm not married.", register: 'neutral', note: 'pero — contrast' },
    { es: 'Estudio español porque quiero viajar a Bolivia.', en: 'I study Spanish because I want to travel to Bolivia.', register: 'neutral', note: 'porque — reason' },
    { es: 'Me gusta el cine, por ejemplo las películas españolas.', en: 'I like cinema, for example Spanish films.', register: 'neutral', note: 'por ejemplo — illustrating' },
    { es: 'Hace frío hoy, ¿no?', en: "It's cold today, isn't it?", register: 'coloquial', note: '¿no? — checking the listener agrees' }
  ],
  pitfalls: [
    '<i>También</i> pairs with something positive; its negative twin is <i>tampoco</i>, not <i>*no también</i>.',
    '¿no?/¿eh? do not expect a real answer — they are a nod, asking the listener to stay with you.'
  ],
  examples: [
    { es: 'Yo también soy médico.', en: 'I am a doctor too.' },
    { es: 'Yo tampoco voy.', en: "I'm not going either." },
    { es: 'Estudio español porque me gusta, y también porque necesito el trabajo.', en: 'I study Spanish because I like it, and also because I need it for work.' }
  ],
  probes: [
    { id: 'p:conectores:tampoco', kind: 'mcq',
      q: '—No me gusta el café. — ¿Cómo continúas?',
      options: ['Yo también.', 'Yo tampoco.', 'Yo no.'], answer: 1 },
    { id: 'p:conectores:porque', kind: 'mcq',
      q: '"Estudio español ___ quiero viajar." (razón)',
      options: ['pero', 'y', 'porque'], answer: 2 },
    { id: 'p:conectores:cloze', kind: 'cloze',
      text: 'Hace frío hoy, ¿___?', accept: ['no'] },
    { id: 'p:conectores:recall', kind: 'recall',
      front: 'Word that narrows a general claim to one concrete case', back: 'por ejemplo' }
  ]
},

{
  id: 'dc-deixis-espacial-a1', strand: 'discourse', cefr: 'A1', level: 1, theme: null,
  pcic: ['tacticas_pragmaticas:A1:20', 'tacticas_pragmaticas:A1:21', 'tacticas_pragmaticas:A1:23',
         'tacticas_pragmaticas:A1:24', 'tacticas_pragmaticas:A1:26'],
  title: 'Deixis espacial',
  summary: 'Deixis is language that only means something relative to where the speaker is standing: "here" moves when you do, and "aquel" points at something neither of you is near. Get the anchor point wrong and the words point at nothing.',
  sections: [
    { h: 'Three distances', html: '<i>Aquí</i> (here, by me), <i>ahí</i> (there, by you), <i>allí</i> (over there, far from both). The three-way split has no single-word English equivalent — English collapses ahí/allí into "there".' },
    { h: 'Coming and going', html: '<i>Ir</i> moves away from the speaker\'s here; <i>venir</i> moves toward it. Same trip, opposite verb, because the anchor changed — on the phone, <i>¿vienes?</i> invites the other person toward where YOU are.' },
    { h: 'Contrastive yo', html: 'Spanish usually drops subject pronouns, but <i>yo</i> reappears to contrast you with someone else: <i>Yo me llamo Elena, ¿y tú?</i> — without <i>yo</i> the contrast disappears.' }
  ],
  exponents: [
    { es: 'Aquí, ahí, allí.', en: 'Here, there, over there.', register: 'neutral', note: 'three-way distance split, no single-word English match' },
    { es: 'Voy a trabajar en coche.', en: 'I go to work by car.', register: 'neutral', note: "ir — away from the speaker's here" },
    { es: 'Este libro, ese libro, aquel libro.', en: 'This book, that book, that book over there.', register: 'neutral', note: 'closeness to speaker/listener, not just distance' },
    { es: '—¿Qué es eso? —Un rotulador.', en: '—What is that? —A marker pen.', register: 'coloquial', note: 'eso — neuter, for something not yet named' },
    { es: 'Yo me llamo Elena, ¿y tú?', en: "I'm called Elena, and you?", register: 'neutral', note: 'yo reappears only to contrast with the other person' }
  ],
  pitfalls: [
    "<i>Ir</i> and <i>venir</i> are not simply \"go\" and \"come\" — they depend on the SPEAKER's position, which can flip mid-conversation.",
    'The neuter <i>eso/esto</i> is for something you have not yet named — once you name it, switch to the gendered form: <i>eso</i> → <i>ese rotulador</i>.'
  ],
  examples: [
    { es: '—¿Dónde estás? —Aquí, en la oficina.', en: '—Where are you? —Here, in the office.' },
    { es: 'Ahí tienes el periódico, encima de la mesa.', en: "There's the newspaper, on the table." },
    { es: 'Mira, este es mi hermano.', en: 'Look, this is my brother.' }
  ],
  probes: [
    { id: 'p:espacial:distancia', kind: 'mcq',
      q: 'Tu amigo está lejos de los dos, señalando algo que ninguno tiene cerca. ¿Qué dice?',
      options: ['Aquí', 'Ahí', 'Allí'], answer: 2 },
    { id: 'p:espacial:irvenir', kind: 'mcq',
      q: 'Hablas por teléfono con tu amigo: "¿___ a mi casa esta noche?"',
      options: ['Vas', 'Vienes', 'Vas a ir'], answer: 1 },
    { id: 'p:espacial:cloze', kind: 'cloze',
      text: '—¿Qué es ___? —Un rotulador.', accept: ['eso'] },
    { id: 'p:espacial:recall', kind: 'recall',
      front: 'Subject pronoun that reappears only to contrast yourself with someone else', back: 'yo' }
  ]
},

{
  id: 'dc-rematizacion-a1', strand: 'discourse', cefr: 'A1', level: 1, theme: null,
  pcic: ['tacticas_pragmaticas:A1:41', 'tacticas_pragmaticas:A1:42', 'tacticas_pragmaticas:A1:43',
         'tacticas_pragmaticas:A1:45', 'tacticas_pragmaticas:A1:46'],
  title: 'Rematización: la información nueva al final',
  summary: 'Spanish tends to put the NEW piece of information last, not first — "Soy María" rather than "María soy", and "Hay un libro en la mesa" rather than naming the book before announcing it exists. Getting the order backwards does not break grammar, but it garbles what you are actually telling the listener.',
  sections: [
    { h: 'Naming yourself or the day', html: 'To identify or locate, the subject often comes AFTER the verb: <i>Soy María</i>, not <i>María soy</i>; <i>Es lunes</i>, not <i>Lunes es</i>. The verb sets up the slot; the noun fills it as new information.' },
    { h: 'Introducing something for the first time', html: '<i>Hay + un/una + noun</i> announces something exists before you can talk about it: <i>Hay un libro en la mesa</i>. Once introduced, it gets the definite article: <i>El libro está en la mesa.</i>' }
  ],
  exponents: [
    { es: 'Soy María.', en: "I'm María.", register: 'neutral', note: 'subject after verb — identifying' },
    { es: 'Es lunes.', en: "It's Monday.", register: 'neutral', note: 'subject after verb — locating in time' },
    { es: '—¿Quién es esa? —Es María.', en: "—Who's that? —It's María.", register: 'coloquial', note: 'casual, pointing at someone by name' },
    { es: 'Hay un libro en la mesa.', en: 'There is a book on the table.', register: 'neutral', note: 'hay + indefinite article — introducing something new' },
    { es: 'Es una película muy interesante.', en: "It's a very interesting film.", register: 'coloquial', note: 'a spoken reaction — indefinite article on first mention' }
  ],
  pitfalls: [
    'Putting the new information first is not "wrong" grammatically, but it changes what stands out: <i>María soy</i> sounds like you are correcting someone else\'s guess, not simply introducing yourself.',
    'Use <i>hay + indefinite article</i> to introduce something; once introduced, switch to the definite article and the verb <i>estar</i>: <i>Hay un gato en el jardín... El gato está durmiendo.</i>'
  ],
  examples: [
    { es: 'Hay una farmacia cerca de aquí.', en: "There's a pharmacy near here." },
    { es: '¿Por qué llora tu hermano?', en: 'Why is your brother crying?' },
    { es: '¿Dónde está Rosa?', en: 'Where is Rosa?' }
  ],
  probes: [
    { id: 'p:rematizacion:orden', kind: 'mcq',
      q: 'Te preguntan quién eres. ¿Cuál suena más natural?',
      options: ['María soy.', 'Soy María.', 'Yo María soy.'], answer: 1 },
    { id: 'p:rematizacion:hay', kind: 'mcq',
      q: 'Presentas algo por primera vez: "___ un libro en la mesa."',
      options: ['El', 'Un', 'Hay un'], answer: 2 },
    { id: 'p:rematizacion:cloze', kind: 'cloze',
      text: 'Hay ___ farmacia cerca de aquí.', accept: ['una'] },
    { id: 'p:rematizacion:recall', kind: 'recall',
      front: 'Word order rule: new information usually goes ___ in the sentence', back: 'last, after the verb' }
  ]
},

{
  id: 'dc-negacion-a1', strand: 'discourse', cefr: 'A1', level: 1, theme: null,
  pcic: ['tacticas_pragmaticas:A1:68', 'tacticas_pragmaticas:A1:69', 'tacticas_pragmaticas:A1:71', 'tacticas_pragmaticas:A1:72'],
  title: 'Tipos de negación',
  summary: 'A bare "no" does several different jobs — answering a question, catching your own mistake, contradicting someone else\'s claim, or simply agreeing with a negative one. The word is the same each time; only repetition and context tell them apart.',
  sections: [
    { h: 'Answering directly', html: '<i>—¿Eres griego? —No.</i> A plain no answers the question; adding the correct fact makes it a full answer: <i>No, soy italiano.</i>' },
    { h: 'Catching yourself', html: '<i>No es así.</i> is the fixed way to correct your own slip mid-sentence, before anyone else has to.' },
    { h: 'Repeating the no', html: 'To contradict someone\'s claim OR to agree with their negative one, Spanish doubles the <i>no</i>: <i>—Madrid está en la costa. —No, no está en la costa.</i> and <i>—No es difícil. —No, no es difícil.</i> look identical in form but do opposite jobs — one corrects, one agrees.' }
  ],
  exponents: [
    { es: '—¿Eres griego? —No.', en: '—Are you Greek? —No.', register: 'neutral', note: 'direct answer' },
    { es: 'No, soy italiano.', en: "No, I'm Italian.", register: 'neutral', note: 'direct answer with the correct fact added' },
    { es: 'No es así.', en: "That's not right.", register: 'coloquial', note: 'self-correction, mid-sentence' },
    { es: '—Madrid está en la costa. —No, no está en la costa.', en: "—Madrid is on the coast. —No, it isn't.", register: 'neutral', note: 'doubled no — correcting a false claim' },
    { es: '—No es difícil. —No, no es difícil.', en: "—It isn't hard. —No, it isn't.", register: 'coloquial', note: 'doubled no — but here it AGREES, same form as the correction above' }
  ],
  pitfalls: [
    'The doubled <i>no, no...</i> looks identical whether you are CORRECTING a false claim or AGREEING with a true negative one — only what came before tells you which.',
    '<i>No es así</i> is a fixed phrase for self-correction — do not build it word by word from other negatives.'
  ],
  examples: [
    { es: '—¿Eres griego? —No, soy italiano.', en: "—Are you Greek? —No, I'm Italian." },
    { es: 'Perdón, no es así, es al revés.', en: "Sorry, that's not right, it's the other way round." },
    { es: '—El examen es el jueves. —No, no es el jueves, es el viernes.', en: "—The exam is on Thursday. —No, it isn't, it's on Friday." }
  ],
  probes: [
    { id: 'p:negacion:directa', kind: 'mcq',
      q: '—¿Eres griego? ¿Cómo respondes si no lo eres?',
      options: ['Sí.', 'No.', 'Es así.'], answer: 1 },
    { id: 'p:negacion:autocorregir', kind: 'mcq',
      q: 'Te equivocas al hablar y te corriges. ¿Qué dices?',
      options: ['No es así.', 'No, no.', 'Es que no.'], answer: 0 },
    { id: 'p:negacion:doblenegacion', kind: 'cloze',
      text: '—Madrid está en la costa. —No, no ___ en la costa.', accept: ['está'] },
    { id: 'p:negacion:recall', kind: 'recall',
      front: 'The doubled "no, no..." can mean two opposite things: correcting OR ___ a negative claim', back: 'agreeing with' }
  ]
},

{
  id: 'dc-atenuacion-2persona-a1', strand: 'discourse', cefr: 'A1', level: 1, theme: null,
  pcic: ['tacticas_pragmaticas:A1:86', 'tacticas_pragmaticas:A1:87', 'tacticas_pragmaticas:A1:90', 'tacticas_pragmaticas:A1:91'],
  title: 'Atenuación: usted y "creo que"',
  summary: 'Two simple, early tools soften how directly you come across: switching tú for usted keeps a respectful distance, and starting an opinion with "creo que" makes it sound like a guess rather than a fact.',
  sections: [
    { h: 'Usted keeps distance', html: 'Using <i>usted</i> instead of <i>tú</i> signals respect or social distance — with someone older, a stranger, or in a formal setting: <i>¿A qué se dedica usted?</i>' },
    { h: 'Creo que softens an opinion', html: 'Stating something as fact can sound blunt; <i>creo que</i> + statement frames it as your view, easier for the listener to disagree with: <i>Creo que es muy difícil</i> rather than <i>Es muy difícil.</i>' }
  ],
  exponents: [
    { es: '¿A qué se dedica usted?', en: 'What do you do (for a living)?', register: 'formal', note: 'usted — respect or distance with a stranger/elder' },
    { es: 'Creo que es muy difícil.', en: "I think it's very difficult.", register: 'neutral', note: 'creo que softens a flat statement into an opinion' },
    { es: 'Creo que Sinead es irlandesa.', en: 'I think Sinead is Irish.', register: 'neutral', note: 'still softened, even about a simple fact' },
    { es: 'Por favor.', en: 'Please.', register: 'neutral', note: 'a ritual softener with almost any request' }
  ],
  pitfalls: [
    '<i>Usted</i> takes THIRD-person verb forms even though it means "you": <i>¿A qué se dedica usted?</i>, not mixing it with a tú-conjugated verb.',
    '<i>Creo que</i> softens even things you are fairly sure of — it is a courtesy, not a sign of real doubt.'
  ],
  examples: [
    { es: 'Buenos días, ¿a qué se dedica usted?', en: 'Good morning, what do you do?' },
    { es: 'Creo que el examen es el jueves, pero no estoy seguro.', en: "I think the exam is on Thursday, but I'm not sure." },
    { es: 'Por favor, ¿tiene usted hora?', en: 'Excuse me, do you have the time?' }
  ],
  probes: [
    { id: 'p:atenuacion2p:usted', kind: 'mcq',
      q: 'Hablas con el director de la empresa, a quien no conoces. ¿Qué dices?',
      options: ['¿A qué te dedicas?', '¿A qué se dedica usted?', '¿Qué haces?'], answer: 1 },
    { id: 'p:atenuacion2p:creoque', kind: 'mcq',
      q: '¿Cuál suena más suave al dar una opinión?',
      options: ['Es muy difícil.', 'Creo que es muy difícil.', 'Seguro que es difícil.'], answer: 1 },
    { id: 'p:atenuacion2p:cloze', kind: 'cloze',
      text: '___ que es muy difícil.', accept: ['Creo', 'creo'] },
    { id: 'p:atenuacion2p:recall', kind: 'recall',
      front: 'Pronoun that signals respect or distance instead of tú', back: 'usted' }
  ]
},

{
  id: 'gn-generos-escritos-a1', strand: 'genre', cefr: 'A1', level: 1, theme: null,
  pcic: ['generos_discursivos:A1:11', 'generos_discursivos:A1:15', 'generos_discursivos:A1:16',
         'generos_discursivos:A1:60', 'generos_discursivos:A1:62', 'generos_discursivos:A1:63', 'generos_discursivos:A1:64'],
  title: 'Textos breves de cada día',
  summary: 'A1 is mostly about READING these texts, not writing them: a bus ticket, a note on the fridge, a hotel sign, a menu. Each has its own shape, and the skill is recognizing the shape fast enough to find the one fact you need without reading every word.',
  sections: [
    { h: 'Recognize the shape first', html: 'A <i>horario</i> (schedule) is a grid of times; a <i>nota</i> (note) is two or three handwritten lines; a <i>cartel</i> (sign) is a single instruction in large letters. You know what kind of text it is before you read a single word — use that.' },
    { h: 'Scan, do not read', html: 'None of these texts need reading start to finish. A menu: find the dish. A schedule: find the time. A form: find the box. Reading every word wastes the one advantage a short text gives you — speed.' }
  ],
  moves: [
    { h: 'Identificar el tipo de texto', html: 'Antes de leer, mira el formato: ¿es una lista de horas (horario), una instrucción corta (cartel), un mensaje a mano (nota) o un menú? La forma ya te dice qué tipo de información vas a encontrar.' },
    { h: 'Buscar solo el dato necesario', html: 'No leas todo. Busca el número, la hora o la palabra que necesitas y para ahí — un billete de tren no se lee como una carta.' }
  ],
  model: {
    title: 'Nota en la nevera',
    text: 'Marta:\n\nHe ido al supermercado. Vuelvo a las 6.\nHay pasta en la nevera para la comida.\nLlama si necesitas algo.\n\nUn beso,\nAna'
  },
  checklist: [
    '¿Reconoces el tipo de texto por su formato antes de leer las palabras?',
    '¿Encontraste el dato que buscabas sin leer todo el texto?'
  ],
  examples: [
    { es: 'Horario: L-V 9:00-14:00 y 16:00-20:00. Sáb 9:00-14:00.', en: 'Schedule: Mon-Fri 9:00-14:00 and 16:00-20:00. Sat 9:00-14:00.' },
    { es: 'PROHIBIDO FUMAR', en: 'NO SMOKING' },
    { es: 'Menú del día: 12 €. Primero, segundo, postre y bebida.', en: 'Set menu: €12. Starter, main, dessert and a drink.' }
  ],
  probes: [
    { id: 'p:generosescritos:tipo', kind: 'mcq',
      q: 'Ves un texto con solo horas y días en una tabla. ¿Qué tipo de texto es?',
      options: ['Una nota', 'Un horario', 'Una carta'], answer: 1 },
    { id: 'p:generosescritos:buscar', kind: 'mcq',
      q: 'Necesitas saber el precio del menú del día. ¿Qué haces?',
      options: ['Leo todo el menú de arriba a abajo', 'Busco directamente el número con el símbolo €', 'Pregunto sin mirar el menú'], answer: 1 },
    { id: 'p:generosescritos:cloze', kind: 'cloze',
      text: '___ FUMAR (en un cartel)', accept: ['PROHIBIDO', 'Prohibido'] },
    { id: 'p:generosescritos:recall', kind: 'recall',
      front: 'The A1 reading skill for short texts: recognize the ___ before reading the words', back: 'shape / format' }
  ]
},

{
  id: 'gn-conversacion-transaccional-a1', strand: 'genre', cefr: 'A1', level: 1, theme: 'compras',
  pcic: ['generos_discursivos:A1:91', 'generos_discursivos:A1:96', 'generos_discursivos:A1:99', 'generos_discursivos:A1:102',
         'generos_discursivos:A1:115', 'generos_discursivos:A1:117', 'generos_discursivos:A1:122', 'generos_discursivos:A1:125',
         'generos_discursivos:A1:129', 'generos_discursivos:A1:134', 'generos_discursivos:A1:138', 'generos_discursivos:A1:140',
         'generos_discursivos:A1:162'],
  title: 'La conversación transaccional: comprar algo',
  summary: 'Buying something face to face — a ticket, a coffee, a souvenir — follows a shape almost as fixed as a letter: greet, state what you want, examine it, agree the price, pay, say thanks, close. Skipping a move (paying without a thank-you, leaving without a clear goodbye) reads as abrupt even when every word was correct.',
  sections: [
    { h: 'Why it has a shape', html: 'A transaction is a genre of its own, spoken not written, but with the same predictable moves every time — which is exactly what lets both people move fast without confusion.' },
    { h: 'The middle: options and preferences', html: 'Between asking and paying, most transactions have a middle where you compare: <i>¿Cuál me recomienda?</i>, <i>Prefiero el más pequeño</i>. Skipping this and just pointing at the first thing works, but sounds rushed.' },
    { h: 'Closing, not just paying', html: 'The transaction is not over at the payment. A short close — thanks both ways, a goodbye — is expected. Silence after paying reads as cold.' }
  ],
  moves: [
    { h: 'Saludo y apertura', html: '<i>Hola, buenos días.</i> Abre el contacto antes de pedir nada.' },
    { h: 'Buscar y dar información', html: 'El cliente pregunta lo que necesita; el vendedor responde: <i>—¿Tiene camisetas de la selección? —Sí, están allí.</i>' },
    { h: 'Identificar opciones y preferencias', html: '—¿Cuál prefiere, la azul o la roja? —La azul, por favor.' },
    { h: 'Examinar y acordar la compra', html: 'El cliente mira el producto y decide; los dos acuerdan el precio: <i>—¿Cuánto es? —Doce euros.</i>' },
    { h: 'Pago e intercambio', html: 'Se entrega el dinero y el producto (y el recibo), en cualquier orden.' },
    { h: 'Agradecimiento y cierre', html: '<i>—Gracias. —A usted. Adiós.</i> Las gracias van en las dos direcciones antes de despedirse.' }
  ],
  model: {
    title: 'Comprando un recuerdo',
    text: '—Hola, buenos días.\n—Buenos días. ¿Le puedo ayudar?\n—Sí, busco un recuerdo para mi hermana.\n—Tenemos estos imanes y estas tazas. ¿Qué prefiere?\n—Prefiero los imanes, son más pequeños para el viaje.\n—Muy bien. ¿Cuántos quiere?\n—Tres, por favor. ¿Cuánto es?\n—Son nueve euros.\n—Aquí tiene.\n—Gracias. Aquí tiene su cambio y el recibo.\n—Muchas gracias. Adiós.\n—Adiós, que tenga un buen día.'
  },
  checklist: [
    '¿Empezaste con un saludo antes de pedir lo que necesitas?',
    '¿Preguntaste o diste tu preferencia entre opciones?',
    '¿Confirmaste el precio antes de pagar?',
    '¿Dijiste gracias y te despediste al final?'
  ],
  examples: [
    { es: '¿Le puedo ayudar?', en: 'Can I help you?' },
    { es: 'Prefiero el más pequeño.', en: 'I prefer the smaller one.' },
    { es: 'Aquí tiene su cambio y el recibo.', en: 'Here is your change and the receipt.' }
  ],
  probes: [
    { id: 'p:transaccional:orden', kind: 'mcq',
      q: '¿Qué mueve normalmente va DESPUÉS de pagar?',
      options: ['Saludar', 'Preguntar el precio', 'Dar las gracias y despedirse'], answer: 2 },
    { id: 'p:transaccional:preferencia', kind: 'mcq',
      q: 'El vendedor te ofrece dos opciones. ¿Cómo respondes?',
      options: ['Prefiero la azul.', '¿Cuánto es?', 'Adiós.'], answer: 0 },
    { id: 'p:transaccional:cloze', kind: 'cloze',
      text: '—Gracias. —A usted. ___.', accept: ['Adiós', 'adiós'] },
    { id: 'p:transaccional:recall', kind: 'recall',
      front: 'A transaction is not finished right after paying — what move still needs to happen?', back: 'thanks and a closing goodbye' }
  ]
},

{
  id: 'gn-describir-persona-a1', strand: 'genre', cefr: 'A1', level: 1, theme: null,
  pcic: ['generos_discursivos:A1:167', 'generos_discursivos:A1:168', 'generos_discursivos:A1:169', 'generos_discursivos:A1:170',
         'generos_discursivos:A1:176', 'generos_discursivos:A1:178', 'generos_discursivos:A1:179', 'generos_discursivos:A1:182'],
  title: 'Describir a una persona',
  summary: 'A description of a person at A1 follows a fixed camera move: name and place them first, then zoom from general build to specific detail — and it leans on just three simple present-tense verbs: ser for what they permanently are, tener for a feature named as a possession, and llevar for what they are wearing today.',
  sections: [
    { h: 'Anchor first, then zoom in', html: 'Start general: who they are and where they fit (<i>Carlinhos es un estudiante brasileño</i>). Only then move to specific, visible detail (<i>Es moreno, alto y tiene ojos negros</i>) — general to particular, never the reverse.' },
    { h: 'Three verbs, three jobs', html: '<b>Ser</b> for lasting qualities (<i>es alto, es simpático</i>). <b>Tener</b> for a feature named as a possession (<i>tiene ojos negros</i>). <b>Llevar</b> for what they have on today, which could change tomorrow (<i>lleva una camiseta roja</i>).' },
    { h: 'Adjective position', html: 'Descriptive adjectives normally follow the noun in this kind of text: <i>una camiseta roja</i>, not <i>una roja camiseta</i>.' }
  ],
  moves: [
    { h: 'Anclaje', html: 'Nombra a la persona y su lugar: quién es y de dónde, en una frase simple con <i>ser</i>.' },
    { h: 'Aspectualización', html: 'Añade los rasgos, del más general (aspecto físico) al más concreto (ropa de hoy, carácter).' }
  ],
  model: {
    title: 'Mi compañero de clase',
    text: 'Carlinhos es un estudiante brasileño. Él y yo estamos en la clase de español. Es moreno, alto y tiene ojos negros. Hoy lleva unos pantalones blancos y una camiseta roja. Es muy guapo y simpático.'
  },
  checklist: [
    '¿Empezaste con quién es la persona, no con su ropa?',
    '¿Usaste ser para lo permanente y llevar para la ropa de hoy?'
  ],
  examples: [
    { es: 'Ella es alta y tiene el pelo rizado.', en: 'She is tall and has curly hair.' },
    { es: 'Hoy lleva una chaqueta azul.', en: 'Today he/she is wearing a blue jacket.' },
    { es: 'Es un chico muy simpático.', en: 'He is a very nice guy.' }
  ],
  probes: [
    { id: 'p:describirpersona:orden', kind: 'mcq',
      q: '¿Cómo empieza normalmente una descripción de una persona?',
      options: ['Con la ropa que lleva hoy', 'Con quién es y de dónde', 'Con su carácter'], answer: 1 },
    { id: 'p:describirpersona:verbo', kind: 'mcq',
      q: '"Hoy ___ una camiseta roja." (ropa de hoy)',
      options: ['es', 'tiene', 'lleva'], answer: 2 },
    { id: 'p:describirpersona:cloze', kind: 'cloze',
      text: 'Carlinhos ___ un estudiante brasileño.', accept: ['es'] },
    { id: 'p:describirpersona:recall', kind: 'recall',
      front: 'The order of description: from general to ___', back: 'particular / specific' }
  ]
},

{
  id: 'gn-describir-objeto-a1', strand: 'genre', cefr: 'A1', level: 1, theme: null,
  pcic: ['generos_discursivos:A1:209', 'generos_discursivos:A1:210', 'generos_discursivos:A1:211',
         'generos_discursivos:A1:212', 'generos_discursivos:A1:215', 'generos_discursivos:A1:216', 'generos_discursivos:A1:217'],
  title: 'Describir un objeto',
  summary: 'Describing an object follows the same general-to-particular shape as describing a person, but the toolkit shrinks to what things, not people, can do: they exist, they have qualities, and they cost money — no wardrobe, no character.',
  sections: [
    { h: 'Anchor, then add detail', html: 'Name what it is and its most defining quality first (<i>El tomate es rojo</i>), then add a concrete, checkable detail (<i>1 kg cuesta 2 euros</i>).' },
    { h: 'Existence and quality', html: 'Two small verb jobs cover almost everything: <i>hay</i> for something existing (<i>Hay tomates en el mercado</i>) and <i>ser/estar</i> for what it is like (<i>Es rojo</i>, <i>Está maduro</i>).' }
  ],
  moves: [
    { h: 'Anclaje', html: 'Nombra el objeto y su rasgo más definitorio, normalmente con ser.' },
    { h: 'Aspectualización', html: 'Añade un detalle concreto y verificable: precio, tamaño, material.' }
  ],
  model: {
    title: 'El tomate',
    text: 'El tomate es rojo. Es redondo y bastante grande. En mi supermercado 1 kg cuesta 2 euros. Es un ingrediente muy común en la cocina española.'
  },
  checklist: [
    '¿Nombraste el objeto y su cualidad principal primero?',
    '¿Añadiste un dato concreto (precio, tamaño...) después?'
  ],
  examples: [
    { es: 'La mesa es de madera y es muy grande.', en: 'The table is made of wood and is very big.' },
    { es: 'Hay un libro nuevo en la estantería.', en: "There's a new book on the shelf." },
    { es: 'Este teléfono es pequeño y cuesta cien euros.', en: 'This phone is small and costs a hundred euros.' }
  ],
  probes: [
    { id: 'p:describirobjeto:existencia', kind: 'mcq',
      q: '¿Qué verbo usas para decir que algo existe en un lugar?',
      options: ['Ser', 'Hay', 'Tener'], answer: 1 },
    { id: 'p:describirobjeto:orden', kind: 'mcq',
      q: '¿Qué va primero al describir un objeto?',
      options: ['Un dato concreto como el precio', 'Qué es y su cualidad principal', 'El nombre de la tienda'], answer: 1 },
    { id: 'p:describirobjeto:cloze', kind: 'cloze',
      text: 'El tomate ___ rojo.', accept: ['es'] },
    { id: 'p:describirobjeto:recall', kind: 'recall',
      front: 'Verb used to state that something exists in a place', back: 'hay' }
  ]
},

{
  id: 'gn-describir-lugar-a1', strand: 'genre', cefr: 'A1', level: 1, theme: 'vivienda',
  pcic: ['generos_discursivos:A1:242', 'generos_discursivos:A1:243', 'generos_discursivos:A1:244',
         'generos_discursivos:A1:245', 'generos_discursivos:A1:251', 'generos_discursivos:A1:252'],
  title: 'Describir un lugar',
  summary: 'Describing a place adds a third verb job to the same general-to-particular shape: after naming the place and its overall quality, hay introduces what is inside it, room by room or object by object.',
  sections: [
    { h: 'Anchor, then inventory', html: 'Start with what the place is and its main quality (<i>La casa de Andrea es grande</i>), then use <i>hay</i> to list what is in it (<i>Hay un baño, una cocina...</i>).' },
    { h: 'Locating within the place', html: 'Once a room or object has been introduced with <i>hay</i>, you can say more about it using <i>ser/estar</i>: <i>La habitación es un poco pequeña, pero hay una cama...</i>' }
  ],
  moves: [
    { h: 'Anclaje', html: 'Nombra el lugar y su cualidad principal, con ser.' },
    { h: 'Aspectualización: inventario', html: 'Usa hay para listar lo que contiene, y añade detalles sobre cada parte.' }
  ],
  model: {
    title: 'La casa de Andrea',
    text: 'La casa de Andrea es grande. Hay un baño, una cocina, un salón, un cuarto de estar y una habitación. La habitación es un poco pequeña, pero hay una cama, una mesa, una silla y un armario. El armario es blanco y muy grande.'
  },
  checklist: [
    '¿Nombraste el lugar y su cualidad principal antes del inventario?',
    '¿Usaste hay para introducir cada parte del lugar?'
  ],
  examples: [
    { es: 'El parque es tranquilo. Hay muchos árboles y un lago pequeño.', en: 'The park is peaceful. There are lots of trees and a small lake.' },
    { es: 'Mi oficina es pequeña, pero hay una ventana grande.', en: 'My office is small, but there is a big window.' },
    { es: 'En la cocina hay una nevera, un horno y una mesa.', en: 'In the kitchen there is a fridge, an oven and a table.' }
  ],
  probes: [
    { id: 'p:describirlugar:hay', kind: 'mcq',
      q: '¿Qué palabra usas para listar lo que hay dentro de un lugar?',
      options: ['Es', 'Hay', 'Está'], answer: 1 },
    { id: 'p:describirlugar:orden', kind: 'mcq',
      q: '¿Qué va primero al describir un lugar?',
      options: ['La lista de lo que contiene', 'El lugar y su cualidad principal', 'El precio'], answer: 1 },
    { id: 'p:describirlugar:cloze', kind: 'cloze',
      text: '___ un baño, una cocina y un salón.', accept: ['Hay', 'hay'] },
    { id: 'p:describirlugar:recall', kind: 'recall',
      front: 'Verb that introduces an inventory of what a place contains', back: 'hay' }
  ]
},

/* ============================================================================
 * BATCH 3 — seq 161-176 of spec/syllabus-draft.json (A2 function).
 * Skipped: func-a2-valorar (164) — spec conflates ~8 distinct PCIC
 * subsections (valorar, acuerdo, desacuerdo, certeza, conocimiento,
 * obligación, capacidad...), same problem as its A1 counterpart. Needs
 * splitting before authoring.
 * ========================================================================== */
{
  id: 'fn-identificar-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:9', 'funciones:A2:10', 'funciones:A2:11'],
  title: 'Identificar (A2)',
  summary: 'Two new ways to identify at A2: naming just the adjective when the noun is already clear ("El azul", not "El jersey azul"), and fronting "a mí/a ti/a Mario" to identify WHO likes or feels something before the verb even appears.',
  sections: [
    { h: 'Dropping the repeated noun', html: 'Once the noun is established, keep only the article and the adjective: <i>—¿Cuál prefiere? —El azul.</i> Repeating <i>el jersey azul</i> sounds unnaturally formal.' },
    { h: 'Naming who, before the verb', html: 'Verbs like <i>gustar</i> put the person who feels something in front, marked with <i>a</i>: <i>A mí me encanta viajar en avión.</i> This <i>a mí/a ti/a Mario</i> is not optional filler — it is how you identify or contrast who you mean.' }
  ],
  exponents: [
    { es: '—¿Cuál prefiere? —El azul.', en: '—Which do you prefer? —The blue one.', register: 'neutral', note: 'noun dropped once established' },
    { es: 'A mí me encanta viajar en avión.', en: 'I love travelling by plane.', register: 'coloquial', note: 'a mí identifies who, before the verb — enthusiastic, personal' },
    { es: 'A ellas les gusta levantarse pronto.', en: 'They (f) like getting up early.', register: 'neutral', note: 'identifying a specific pair of people, third person' },
    { es: '—¿A quién le gusta la música clásica? —A Mario y a Cristina.', en: '—Who likes classical music? —Mario and Cristina.', register: 'neutral', note: 'a + nombre propio — identifying by name' }
  ],
  pitfalls: [
    "The article still agrees with the dropped noun's gender/number: <i>el azul</i> (jersey, masc.) but <i>la azul</i> (camisa, fem.).",
    '<i>A mí/a ti/a él...</i> before <i>gustar</i>-type verbs does not replace <i>me/te/le</i> — both appear together: <i>A mí me gusta</i>, never just <i>A mí gusta</i>.'
  ],
  examples: [
    { es: '—¿Qué camisa te gusta? —La roja.', en: '—Which shirt do you like? —The red one.' },
    { es: 'A mí no me gusta el pescado, pero a él sí.', en: "I don't like fish, but he does." },
    { es: '¿A quién le toca pagar?', en: "Whose turn is it to pay?" }
  ],
  probes: [
    { id: 'p:identificara2:elipsis', kind: 'mcq',
      q: '—¿Cuál quieres? (ya sabéis que habláis de jerséis) ¿Cómo respondes de forma natural?',
      options: ['Quiero el jersey azul.', 'Quiero el azul.', 'Quiero azul.'], answer: 1 },
    { id: 'p:identificara2:ami', kind: 'mcq',
      q: '¿Cuál identifica a la persona ANTES del verbo?',
      options: ['Me gusta el cine.', 'A mí me gusta el cine.', 'Gusta el cine.'], answer: 1 },
    { id: 'p:identificara2:cloze', kind: 'cloze',
      text: 'A ellas ___ gusta levantarse pronto.', accept: ['les'] },
    { id: 'p:identificara2:recall', kind: 'recall',
      front: 'When the noun is already clear, keep only the article and the ___', back: 'adjective' }
  ]
},

{
  id: 'fn-pedir-informacion-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:33', 'funciones:A2:36', 'funciones:A2:38', 'funciones:A2:40',
         'funciones:A2:42', 'funciones:A2:44', 'funciones:A2:47', 'funciones:A2:49'],
  title: 'Pedir información (A2)',
  summary: 'A2 sharpens the A1 question-word set with more precise tools: distinguishing qué from cuál, asking for a category rather than a name, and offering a straight choice with "o".',
  sections: [
    { h: 'Qué vs cuál', html: '<i>Qué</i> asks for a definition or category (<i>¿Qué vino prefieres?</i> — which kind); <i>cuál</i> asks to pick from a known set (<i>¿Cuál es tu comida preferida?</i> — which one, out of your options).' },
    { h: 'Asking for a type', html: '<i>¿Qué tipo/clase de...?</i> asks for a category, not a specific item: <i>¿Qué tipo de música te gusta?</i> expects "rock" or "clásica", not a song title.' },
    { h: 'Offering a straight choice', html: '<i>¿Prefieres... o...?</i> puts two named options in the question itself, which narrows the possible answers to those two.' }
  ],
  exponents: [
    { es: '¿Con quién vives?', en: 'Who do you live with?', register: 'neutral', note: 'persona + preposición' },
    { es: '¿De quién son esos libros?', en: 'Whose books are those?', register: 'neutral', note: 'asking who owns something' },
    { es: '¿Qué vino prefieres?', en: 'What/which wine do you prefer?', register: 'neutral', note: 'qué — category or definition' },
    { es: '¿Cuál es tu comida preferida?', en: 'What is your favourite food?', register: 'neutral', note: 'cuál — pick from a known set' },
    { es: '¿Qué tipo de música te gusta?', en: 'What type of music do you like?', register: 'coloquial', note: 'asking for a category, casual chat' },
    { es: '¿Prefieres este o aquel?', en: 'Do you prefer this one or that one?', register: 'coloquial', note: 'straight two-option choice' }
  ],
  pitfalls: [
    '<i>Qué</i> and <i>cuál</i> are not interchangeable: <i>¿Cuál es tu color favorito?</i> is right; <i>*¿Qué es tu color favorito?</i> sounds foreign.',
    '<i>¿Qué tipo de...?</i> expects a category as an answer ("rock", "de aventura") — answering with one specific item misses the question.'
  ],
  examples: [
    { es: '¿Cuándo es tu cumpleaños?', en: 'When is your birthday?' },
    { es: '¿Para qué necesitas el español?', en: 'What do you need Spanish for?' },
    { es: '¿Cómo vienes a clase?', en: 'How do you get to class?' }
  ],
  probes: [
    { id: 'p:pedirinfoa2:quecual', kind: 'mcq',
      q: '"¿___ es tu color favorito?" (elegir entre opciones conocidas)',
      options: ['Qué', 'Cuál', 'Cómo'], answer: 1 },
    { id: 'p:pedirinfoa2:tipo', kind: 'mcq',
      q: '—¿Qué tipo de música te gusta? ¿Cuál es una respuesta correcta?',
      options: ['El rock.', 'Una canción de Shakira.', 'El cantante.'], answer: 0 },
    { id: 'p:pedirinfoa2:cloze', kind: 'cloze',
      text: '¿___ quién vives?', accept: ['Con', 'con'] },
    { id: 'p:pedirinfoa2:recall', kind: 'recall',
      front: 'Question word for picking one out of a KNOWN set of options', back: 'cuál' }
  ]
},

{
  id: 'fn-dar-informacion-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:72', 'funciones:A2:74', 'funciones:A2:76', 'funciones:A2:78', 'funciones:A2:80'],
  title: 'Dar información (A2)',
  summary: 'Answering fully at A2 means matching the shape of the question: a place answer needs a locative phrase, a time answer a temporal one, a manner answer an adverb — and getting the category right matters as much as the words.',
  sections: [
    { h: 'Match the question type', html: 'A place question wants a place phrase (<i>—¿Dónde vives? —Cerca de la estación</i>), not a full sentence restating the verb. Time, manner and reason answers work the same way — answer in kind.' },
    { h: 'Time expressions', html: 'Frequency and time answers use a wide toolkit: <i>la semana pasada</i>, <i>nunca</i>, <i>todos los días</i>, <i>desde hace dos años</i>, <i>cuando...</i>. Picking the right one signals whether something is a habit, a one-off, or ongoing.' }
  ],
  exponents: [
    { es: '—¿Con quién vives? —Con mis padres.', en: '—Who do you live with? —With my parents.', register: 'neutral', note: 'person answer, matches the preposition asked' },
    { es: '—¿Qué vino te gusta más? —Prefiero la cerveza.', en: '—What wine do you like best? —I prefer beer.', register: 'coloquial', note: 'a full declarative answer' },
    { es: '—¿Dónde está tu casa? —Cerca de la estación.', en: '—Where is your house? —Near the station.', register: 'neutral', note: 'place answer, no full sentence needed' },
    { es: '—¿Cómo vienes a clase? —En metro.', en: '—How do you get to class? —By metro.', register: 'coloquial', note: 'manner answer, short' },
    { es: 'Vivo aquí desde hace dos años.', en: "I've lived here for two years.", register: 'neutral', note: 'ongoing time span' }
  ],
  pitfalls: [
    'A place question does not need a full sentence back — <i>Cerca de la estación</i> answers <i>¿Dónde vives?</i> completely; adding <i>Vivo cerca de la estación</i> is not wrong, just more formal.',
    '<i>Nunca</i> needs no <i>no</i> when it starts the answer, but keeps it if it follows the verb: <i>Nunca hago deporte</i> / <i>No hago deporte nunca.</i>'
  ],
  examples: [
    { es: '—¿Para quién es? —Para Elena. Mañana es su cumpleaños.', en: "—Who's it for? —For Elena. It's her birthday tomorrow." },
    { es: '—¿Haces deporte? —No, nunca.', en: '—Do you play sports? —No, never.' },
    { es: 'Leo todos los días antes de dormir.', en: 'I read every day before going to sleep.' }
  ],
  probes: [
    { id: 'p:darinfoa2:lugar', kind: 'mcq',
      q: '—¿Dónde está tu casa? ¿Cuál es una respuesta natural?',
      options: ['Cerca de la estación.', 'Sí, está.', 'Es mi casa.'], answer: 0 },
    { id: 'p:darinfoa2:frecuencia', kind: 'mcq',
      q: '"Vivo aquí ___ hace dos años." (tiempo continuo)',
      options: ['desde', 'hace', 'desde hace'], answer: 2 },
    { id: 'p:darinfoa2:cloze', kind: 'cloze',
      text: '—¿Haces deporte? —No, ___.', accept: ['nunca'] },
    { id: 'p:darinfoa2:recall', kind: 'recall',
      front: 'A place question expects an answer in what shape?', back: 'a locative phrase, not a full sentence' }
  ]
},

{
  id: 'fn-acuerdo-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:121', 'funciones:A2:122', 'funciones:A2:123', 'funciones:A2:124'],
  title: 'Expresar acuerdo (A2)',
  summary: 'A2 agreement adds "sí" as an opener and lets you frame it as your own belief ("yo también creo que") rather than a bare echo — more visible commitment than the A1 repetition trick.',
  sections: [
    { h: 'Opening with sí', html: 'A2 agreement almost always opens with <i>Sí,</i> before the actual agreement — a small but consistent marker that A1\'s bare repetition lacks.' },
    { h: 'Framing it as belief', html: '<i>Yo también creo que...</i> does more work than repeating the opinion: it says you arrived at the same view independently, not just that you are nodding along.' }
  ],
  exponents: [
    { es: 'Sí, es verdad.', en: "Yes, that's true.", register: 'coloquial' },
    { es: 'Sí, para mí también es la mejor película que han hecho.', en: "Yes, for me too, it's the best film they've made.", register: 'neutral', note: 'para mí también — repeats the opinion, adds your stance' },
    { es: 'Sí, yo también creo que Isabel es muy inteligente.', en: 'Yes, I also think Isabel is very intelligent.', register: 'neutral', note: 'yo también creo que — frames it as your own belief' },
    { es: '—Esto es muy difícil. —Sí, estoy de acuerdo.', en: '—This is very hard. —Yes, I agree.', register: 'neutral', note: 'fixed formula, works in most settings' }
  ],
  pitfalls: [
    '<i>Para mí también</i> and <i>yo también creo que</i> both agree, but the second is stronger — it restates the claim as your own thought, not just a matching reaction.'
  ],
  examples: [
    { es: '—El español es más fácil que el alemán. —Sí, es verdad.', en: "—Spanish is easier than German. —Yes, that's true." },
    { es: '—Me parece un poco caro. —Sí, para mí también.', en: '—It seems a bit expensive to me. —Yes, for me too.' },
    { es: 'Sí, estoy de acuerdo contigo.', en: 'Yes, I agree with you.' }
  ],
  probes: [
    { id: 'p:acuerdoa2:abrir', kind: 'mcq',
      q: '¿Con qué palabra suele empezar el acuerdo en A2?',
      options: ['No', 'Sí', 'Bueno'], answer: 1 },
    { id: 'p:acuerdoa2:creoque', kind: 'mcq',
      q: '¿Cuál expresa que TÚ también llegaste a la misma opinión, no solo que la repites?',
      options: ['Sí, es verdad.', 'Sí, yo también creo que...', 'Vale.'], answer: 1 },
    { id: 'p:acuerdoa2:cloze', kind: 'cloze',
      text: 'Sí, estoy de ___.', accept: ['acuerdo'] },
    { id: 'p:acuerdoa2:recall', kind: 'recall',
      front: 'Fixed agreement formula that works in almost any setting', back: 'Estoy de acuerdo.' }
  ]
},

{
  id: 'fn-posibilidad-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:143', 'funciones:A2:144', 'funciones:A2:145'],
  title: 'Expresar posibilidad',
  summary: 'Three ways to say something might be true, each committing a little differently: quizá stands alone as a guess, es probable frames it almost like a judgement, and puede ser answers someone else\'s claim without confirming it.',
  sections: [
    { h: 'A guess vs an answer', html: '<i>Quizá</i> can open a sentence on its own, offering a guess nobody asked for. <i>Es probable</i> and <i>puede ser</i> normally respond to something someone else just said.' },
    { h: 'How much you commit', html: '<i>Es probable</i> sounds close to agreement; <i>puede ser</i> is the most hedged of the three — it leaves real room for doubt.' }
  ],
  exponents: [
    { es: 'Está un poco triste, quizá ha recibido una mala noticia.', en: "She's a bit sad, maybe she got some bad news.", register: 'neutral', note: 'quizá — a guess, offered unprompted' },
    { es: '—La vida en el campo es mejor que en la ciudad. —Sí, es probable.', en: "—Life in the countryside is better than in the city. —Yes, it's probably true.", register: 'neutral', note: 'es probable — almost a judgement' },
    { es: '—Me ha dicho Isabel que tus vecinos van a vender el piso. —Sí, puede ser.', en: "—Isabel told me your neighbours are going to sell the flat. —Yes, could be.", register: 'coloquial', note: 'puede ser — noncommittal response to someone else\'s claim' }
  ],
  pitfalls: [
    '<i>Quizá(s)</i> can trigger the subjunctive in more formal registers later on, but at this level it is fine with the indicative, as shown here.'
  ],
  examples: [
    { es: 'Quizá llueva mañana.', en: 'Maybe it will rain tomorrow.' },
    { es: '—¿Vendrá Marta a la fiesta? —Es probable.', en: '—Will Marta come to the party? —Probably.' },
    { es: '—Creo que se han mudado. —Puede ser, no lo sé seguro.', en: "—I think they've moved. —Could be, I don't know for sure." }
  ],
  probes: [
    { id: 'p:posibilidada2:sinpreguntar', kind: 'mcq',
      q: '¿Cuál puedes usar para ofrecer una idea sin que nadie te pregunte?',
      options: ['Es probable.', 'Puede ser.', 'Quizá...'], answer: 2 },
    { id: 'p:posibilidada2:hedge', kind: 'mcq',
      q: '¿Cuál dice MENOS, dejando más espacio para la duda?',
      options: ['Es probable.', 'Puede ser.', 'Es verdad.'], answer: 1 },
    { id: 'p:posibilidada2:cloze', kind: 'cloze',
      text: '—¿Vendrá Marta? —Es ___.', accept: ['probable'] },
    { id: 'p:posibilidada2:recall', kind: 'recall',
      front: 'Word that can open a sentence on its own with an unprompted guess', back: 'quizá(s)' }
  ]
},

{
  id: 'fn-preguntar-conocimiento-a2', strand: 'function', cefr: 'A2', level: 2, theme: 'educacion',
  pcic: ['funciones:A2:152', 'funciones:A2:153', 'funciones:A2:154'],
  title: 'Preguntar por el conocimiento de algo',
  summary: 'Asking whether someone knows something splits the same way saber/conocer does: sabes for facts and skills, conoces for people and places, and has aprendido/estudiado for something learned formally.',
  sections: [
    { h: 'Same split as saber/conocer', html: 'The question mirrors the statement: <i>¿sabes...?</i> for facts/skills, <i>¿conoces...?</i> for people/places.' },
    { h: 'A third option: formal study', html: '<i>¿Has aprendido/estudiado...?</i> asks specifically about something learned through study, distinct from general familiarity.' }
  ],
  exponents: [
    { es: '¿No sabéis bien los verbos?', en: "Don't you (all) know the verbs well?", register: 'coloquial', note: 'sabéis — vosotros, casual classroom register' },
    { es: '¿Conoces bien a Marcos?', en: 'Do you know Marcos well?', register: 'neutral', note: 'conocer + person' },
    { es: '¿No has estudiado latín?', en: "Haven't you studied Latin?", register: 'neutral', note: 'formal learning, present perfect' }
  ],
  pitfalls: [
    'A negative question here (<i>¿No sabéis...?</i>) is not really hostile — it often signals mild surprise, not accusation.'
  ],
  examples: [
    { es: '¿Sabes cocinar paella?', en: 'Do you know how to cook paella?' },
    { es: '¿Conoces un poco el juego?', en: 'Do you know the game a bit?' },
    { es: '¿Has aprendido mucho este año?', en: 'Have you learned a lot this year?' }
  ],
  probes: [
    { id: 'p:preguntarconocimiento:cual', kind: 'mcq',
      q: '"¿___ bien a Marcos?" (una persona)',
      options: ['Sabes', 'Conoces', 'Has estudiado'], answer: 1 },
    { id: 'p:preguntarconocimiento:cual2', kind: 'mcq',
      q: '"¿___ cocinar paella?" (una habilidad)',
      options: ['Sabes', 'Conoces', 'Tienes'], answer: 0 },
    { id: 'p:preguntarconocimiento:cloze', kind: 'cloze',
      text: '¿No ___ estudiado latín?', accept: ['has'] },
    { id: 'p:preguntarconocimiento:recall', kind: 'recall',
      front: 'Question form for something learned specifically through formal study', back: '¿Has aprendido/estudiado...?' }
  ]
},

{
  id: 'fn-expresar-conocimiento-a2', strand: 'function', cefr: 'A2', level: 2, theme: 'educacion',
  pcic: ['funciones:A2:159', 'funciones:A2:160', 'funciones:A2:161', 'funciones:A2:162', 'funciones:A2:163', 'funciones:A2:164'],
  title: 'Expresar conocimiento',
  summary: 'Claiming to know something at A2 adds a hedge almost every native speaker uses: not "sé" or "conozco" alone, but qualified with "un poco", "bastante" or "muy bien" — an unqualified claim can sound like overconfidence.',
  sections: [
    { h: 'Hedging how much you know', html: 'Un poco, bastante and muy bien slot into the same spot with saber and conocer, moving the claim along one scale — from barely to thoroughly.' },
    { h: 'Sé vs saben, and who', html: 'Match the verb ending to who has the knowledge; the hedge word does not change, only the claim\'s honesty about scope.' }
  ],
  exponents: [
    { es: 'Sé un poco de Historia Medieval.', en: 'I know a bit about medieval history.', register: 'neutral', note: 'saber + un poco de — hedged fact' },
    { es: 'Saben que es inglesa.', en: "They know she's English.", register: 'neutral', note: 'saber + que — knowing a fact' },
    { es: 'Conozco un poco el país.', en: 'I know the country a little.', register: 'coloquial', note: 'conocer + un poco — hedged familiarity' },
    { es: 'Conocemos muy bien a Álvaro.', en: 'We know Álvaro very well.', register: 'neutral', note: 'conocer + muy bien — the other end of the same scale' },
    { es: 'He aprendido la historia del país.', en: "I've learned the country's history.", register: 'neutral', note: 'through study' }
  ],
  pitfalls: [
    'An unhedged <i>Sé español</i> or <i>Conozco España</i> can sound like a stronger claim than intended — native speakers hedge by default.'
  ],
  examples: [
    { es: 'Sabe bastante de vinos.', en: 'She knows quite a lot about wine.' },
    { es: 'No conozco muy bien esta ciudad.', en: "I don't know this city very well." },
    { es: 'Han aprendido mucho vocabulario este curso.', en: "They've learned a lot of vocabulary this course." }
  ],
  probes: [
    { id: 'p:expresarconocimiento:hedge', kind: 'mcq',
      q: '¿Cuál suena más natural para decir que sabes un poco sobre historia?',
      options: ['Sé Historia.', 'Sé un poco de Historia.', 'Historia sé.'], answer: 1 },
    { id: 'p:expresarconocimiento:saberconocer', kind: 'mcq',
      q: '"___ muy bien a Álvaro." (una persona)',
      options: ['Sabemos', 'Conocemos', 'Aprendemos'], answer: 1 },
    { id: 'p:expresarconocimiento:cloze', kind: 'cloze',
      text: 'Sé un poco ___ Historia Medieval.', accept: ['de'] },
    { id: 'p:expresarconocimiento:recall', kind: 'recall',
      front: 'Native speakers usually add this kind of word before claiming to know something', back: 'a hedge (un poco, bastante, muy bien)' }
  ]
},

{
  id: 'fn-preguntar-gustos-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:189', 'funciones:A2:190', 'funciones:A2:191'],
  title: 'Preguntar por gustos e intereses',
  summary: 'Asking about likes uses gustar-family verbs backwards from English: the thing liked is the grammatical subject, and the person is marked with te/le/os — get the agreement wrong and the sentence breaks, not just sounds odd.',
  sections: [
    { h: 'The thing liked is the subject', html: 'In <i>¿Te gusta el cine?</i>, <i>el cine</i> is grammatically the subject — that is why the verb changes to plural when several things are liked: <i>¿Te gustan los animales?</i>' },
    { h: 'Le is ambiguous on purpose', html: '<i>Le interesa</i> could mean "it interests him", "her" or "you (usted)" — context or an added <i>a él/a ella/a usted</i> resolves it.' }
  ],
  exponents: [
    { es: '¿Te gusta jugar al tenis?', en: 'Do you like playing tennis?', register: 'coloquial', note: 'tú, casual' },
    { es: '¿Le interesa la política?', en: 'Is he/she interested in politics? / Are you (usted) interested in politics?', register: 'formal', note: 'le — usted or a third person' },
    { es: '¿Qué tipo de música te gusta?', en: 'What type of music do you like?', register: 'coloquial' }
  ],
  pitfalls: [
    'Match the verb to the THING liked, not the person: <i>Me gusta el libro</i> (singular) but <i>Me gustan los libros</i> (plural) — the person (<i>me</i>) never changes the verb form.'
  ],
  examples: [
    { es: '¿Qué te gusta hacer en tu tiempo libre?', en: 'What do you like doing in your free time?' },
    { es: '¿Le interesan los documentales?', en: 'Is he/she interested in documentaries?' },
    { es: '¿Qué tipo de cine os interesa?', en: 'What type of film are you (all) interested in?' }
  ],
  probes: [
    { id: 'p:preguntargustos:concordancia', kind: 'mcq',
      q: '"¿Te ___ los animales?" (varios animales)',
      options: ['gusta', 'gustan', 'gustas'], answer: 1 },
    { id: 'p:preguntargustos:sujeto', kind: 'mcq',
      q: 'En "¿Te gusta el cine?", ¿cuál es el sujeto gramatical?',
      options: ['Te', 'el cine', 'gusta'], answer: 1 },
    { id: 'p:preguntargustos:cloze', kind: 'cloze',
      text: '¿___ interesa la política? (a usted)', accept: ['Le', 'le'] },
    { id: 'p:preguntargustos:recall', kind: 'recall',
      front: 'What determines whether gustar is singular or plural?', back: 'the thing liked (the grammatical subject), not the person' }
  ]
},

{
  id: 'fn-expresar-gustos-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:195', 'funciones:A2:196', 'funciones:A2:197', 'funciones:A2:198',
         'funciones:A2:199', 'funciones:A2:200', 'funciones:A2:201', 'funciones:A2:202'],
  title: 'Expresar gustos e intereses',
  summary: 'Gustar, encantar and interesar sit on a scale of intensity, not just synonyms for "like" — encantar commits much more than gustar, and choosing the wrong one either undersells or overclaims how you feel.',
  sections: [
    { h: 'A scale, not synonyms', html: '<i>Gustar</i> is the everyday default; <i>encantar</i> commits much more (closer to "love" than "like"); <i>interesar</i> is about curiosity, which is not the same as enjoyment.' },
    { h: 'Feeling vs description', html: '<i>Me interesa el cine</i> describes YOUR reaction; <i>El cine es interesante</i> describes the THING — both are true statements but make a different claim.' }
  ],
  exponents: [
    { es: 'A nosotros no nos gusta nada la exposición.', en: "We don't like the exhibition at all.", register: 'neutral', note: 'gustar — the baseline, here negated strongly' },
    { es: 'Me encantan los coches.', en: 'I love cars.', register: 'coloquial', note: 'encantar — much stronger than gustar, enthusiastic' },
    { es: 'Me interesa mucho conocer otras culturas.', en: "I'm very interested in learning about other cultures.", register: 'neutral', note: 'interesar — curiosity, not necessarily pleasure' },
    { es: 'Aprender español es interesante.', en: 'Learning Spanish is interesting.', register: 'neutral', note: 'ser interesante — describing the thing itself, not your feeling' }
  ],
  pitfalls: [
    'Do not reach for <i>encantar</i> as a plain synonym of <i>gustar</i> — using it for something merely fine oversells your enthusiasm.'
  ],
  examples: [
    { es: 'Nos encanta comer fuera los fines de semana.', en: 'We love eating out at weekends.' },
    { es: 'No me interesa el cine comercial.', en: "I'm not interested in commercial cinema." },
    { es: '¡Qué interesante!', en: 'How interesting!' }
  ],
  probes: [
    { id: 'p:expresargustos:escala', kind: 'mcq',
      q: '¿Cuál expresa MÁS entusiasmo?',
      options: ['Me gusta el chocolate.', 'Me encanta el chocolate.', 'Me interesa el chocolate.'], answer: 1 },
    { id: 'p:expresargustos:sentirdescribir', kind: 'mcq',
      q: '¿Cuál describe la COSA, no tu reacción?',
      options: ['Me interesa el cine.', 'El cine es interesante.', 'Me gusta el cine.'], answer: 1 },
    { id: 'p:expresargustos:cloze', kind: 'cloze',
      text: 'Nos ___ los coches.', accept: ['encantan'] },
    { id: 'p:expresargustos:recall', kind: 'recall',
      front: 'Verb that expresses curiosity rather than enjoyment', back: 'interesar' }
  ]
},

{
  id: 'fn-preguntar-preferencias-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:205', 'funciones:A2:206', 'funciones:A2:207', 'funciones:A2:208', 'funciones:A2:209'],
  title: 'Preguntar por preferencias',
  summary: 'Asking someone to choose can offer them the field wide open, a specific pair, or a category — and matching the question shape to what you actually want to know keeps the answer useful.',
  sections: [
    { h: 'Wide open vs narrowed', html: '<i>¿Qué libro prefieren?</i> leaves the field open; naming two options (<i>...el zumo de naranja o el zumo de limón?</i>) narrows the possible answers to those two.' },
    { h: 'Favourite is not the same as preferred', html: '<i>¿Cuál es tu... favorito/preferido?</i> asks for the single best, without necessarily comparing two named things in the question.' }
  ],
  exponents: [
    { es: '¿Qué libro prefieren?', en: 'Which book do they/you (plural) prefer?', register: 'neutral', note: 'open — any book' },
    { es: '¿Cuál prefieres: el zumo de naranja o el zumo de limón?', en: 'Which do you prefer: orange juice or lemon juice?', register: 'neutral', note: 'a specific pair named in the question' },
    { es: '¿Prefieres té o café?', en: 'Do you prefer tea or coffee?', register: 'coloquial', note: 'quick, everyday choice' },
    { es: '¿Qué tipo de ropa prefieres: elegante o informal?', en: 'What type of clothes do you prefer: smart or casual?', register: 'neutral', note: 'category, still narrowed to two' },
    { es: '¿Cuál es tu color favorito?', en: 'What is your favourite colour?', register: 'coloquial', note: 'asks for the single best, not a comparison' }
  ],
  pitfalls: [
    'If you name two options with <i>o</i>, a natural answer picks one of THEM — answering with a third thing technically answers a different, wider question.'
  ],
  examples: [
    { es: '¿Qué preferís: ver la tele o ir al cine?', en: 'What do you prefer: watching TV or going to the cinema?' },
    { es: '¿Qué corbata le gusta más?', en: 'Which tie does he/she like best?' },
    { es: '¿Quiénes son tus escritores preferidos?', en: 'Who are your favourite writers?' }
  ],
  probes: [
    { id: 'p:preguntarpreferencias:abierta', kind: 'mcq',
      q: '¿Cuál deja el campo abierto, sin limitar las opciones?',
      options: ['¿Té o café?', '¿Qué libro prefieres?', '¿Prefieres este o aquel?'], answer: 1 },
    { id: 'p:preguntarpreferencias:favorito', kind: 'mcq',
      q: '¿Cuál pide UN solo elemento, no una comparación entre dos?',
      options: ['¿Cuál es tu color favorito?', '¿Prefieres el rojo o el azul?', '¿Qué tipo de música prefieres?'], answer: 0 },
    { id: 'p:preguntarpreferencias:cloze', kind: 'cloze',
      text: '¿___ es tu color favorito?', accept: ['Cuál', 'cuál'] },
    { id: 'p:preguntarpreferencias:recall', kind: 'recall',
      front: 'Naming two options with "o" narrows the answer to just those ___', back: 'two' }
  ]
},

{
  id: 'fn-preferencia-comparativa-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:212', 'funciones:A2:213', 'funciones:A2:214'],
  title: 'Me gusta / interesa más...',
  summary: 'A bare "me gusta más" states a preference in isolation; adding "que" turns it into an explicit comparison — the same words, but one leaves the alternative implicit and the other names it.',
  sections: [
    { h: 'Stated alone vs compared', html: '<i>Me gusta más el té</i> is a preference with the alternative left unsaid; <i>Me gusta más el té que el café</i> makes the comparison explicit.' },
    { h: 'Nouns and infinitives, same pattern', html: 'The <i>X que Y</i> pattern works whether X/Y are nouns (<i>el té que el café</i>) or infinitives (<i>leer que escribir</i>) — do not mix a noun with an infinitive on either side.' }
  ],
  exponents: [
    { es: 'Me gusta más el té.', en: 'I prefer tea.', register: 'coloquial', note: 'preference stated alone, alternative implicit' },
    { es: 'Me gusta más el té que el café.', en: 'I prefer tea to coffee.', register: 'neutral', note: 'que names the explicit alternative' },
    { es: 'Me gusta más leer que escribir.', en: 'I prefer reading to writing.', register: 'neutral', note: 'comparing two infinitives' },
    { es: 'Nos interesa más ir de excursión a Granada.', en: "We're more interested in going on a trip to Granada.", register: 'neutral', note: 'interesar works the same way' }
  ],
  pitfalls: [
    'Do not add <i>más</i> a second time: <i>*Me gusta más el té más que el café</i> is wrong — <i>más</i> appears once.'
  ],
  examples: [
    { es: 'Me interesa más la literatura que el cine.', en: "I'm more interested in literature than in cinema." },
    { es: '¿Te gusta más el verano o el invierno?', en: 'Do you prefer summer or winter?' },
    { es: 'Nos gusta más caminar que coger el coche.', en: 'We prefer walking to taking the car.' }
  ],
  probes: [
    { id: 'p:preferenciacomparativa:que', kind: 'mcq',
      q: '"Me gusta más el té ___ el café." (comparación explícita)',
      options: ['y', 'que', 'o'], answer: 1 },
    { id: 'p:preferenciacomparativa:infinitivo', kind: 'mcq',
      q: '¿Cuál compara dos infinitivos correctamente?',
      options: ['Me gusta más leer que escribiendo.', 'Me gusta más leer que escribir.', 'Me gusta más leo que escribo.'], answer: 1 },
    { id: 'p:preferenciacomparativa:cloze', kind: 'cloze',
      text: 'Me gusta más el té ___ el café.', accept: ['que'] },
    { id: 'p:preferenciacomparativa:recall', kind: 'recall',
      front: 'Word that turns a stated preference into an explicit comparison', back: 'que' }
  ]
},

{
  id: 'fn-preguntar-deseos-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:215', 'funciones:A2:216', 'funciones:A2:217', 'funciones:A2:218'],
  title: 'Preguntar por deseos',
  summary: 'Two ways to ask what someone wants sit at different levels of directness: "¿quieres...?" asks plainly, while "¿te gustaría...?" wraps the same question in the conditional, which softens it into more of an invitation.',
  sections: [
    { h: 'Plain vs softened', html: '<i>¿Quieres...?</i> asks plainly. <i>¿Te gustaría...?</i>, built on the conditional, reads as more of an invitation than a demand for an answer right now.' },
    { h: 'gustaría agrees with the THING, not the person', html: '<i>Gustar</i> keeps its backwards grammar in the conditional: <i>¿Te gustaría un café?</i> but <i>¿Te gustarían unas vacaciones?</i> — the verb follows what is wanted, while <i>te</i> never changes.' },
    { h: 'Answering', html: 'A bare <i>sí</i> can sound curt. <i>Sí, me encantaría</i> accepts warmly; <i>La verdad es que no me apetece mucho</i> declines without a flat no.' }
  ],
  exponents: [
    { es: '¿Quieres ir a París?', en: 'Do you want to go to Paris?', register: 'coloquial', note: 'direct, plain question' },
    { es: '¿Os gustaría tener una casa más grande?', en: 'Would you (all) like to have a bigger house?', register: 'neutral', note: 'conditional — softer, more hypothetical' },
    { es: '¿Qué quieres hacer mañana?', en: 'What do you want to do tomorrow?', register: 'coloquial' }
  ],
  pitfalls: [
    '<i>¿Te gustaría?</i> is not just more polite <i>querer</i> — it also frames the thing asked about as hypothetical, not necessarily about to happen.'
  ],
  examples: [
    { es: '¿Quieres un café?', en: 'Do you want a coffee?' },
    { es: '¿Te gustaría venir a la fiesta?', en: 'Would you like to come to the party?' },
    { es: '¿Qué te gustaría hacer este verano?', en: 'What would you like to do this summer?' }
  ],
  probes: [
    { id: 'p:preguntardeseos:suave', kind: 'mcq',
      q: '¿Cuál suena más como una invitación que una pregunta directa?',
      options: ['¿Quieres ir a París?', '¿Te gustaría ir a París?', '¿Vas a ir a París?'], answer: 1 },
    { id: 'p:preguntardeseos:que', kind: 'mcq',
      q: '"¿___ quieres hacer mañana?"',
      options: ['Cómo', 'Qué', 'Cuál'], answer: 1 },
    { id: 'p:preguntardeseos:cloze', kind: 'cloze',
      text: '¿Te ___ tener una casa más grande?', accept: ['gustaría'] },
    { id: 'p:preguntardeseos:recall', kind: 'recall',
      front: 'Verb form that softens a question into more of an invitation', back: 'gustaría (condicional)' }
  ]
},

{
  id: 'fn-preguntar-estado-animo-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:226', 'funciones:A2:227', 'funciones:A2:228'],
  title: 'Preguntar por el estado de ánimo',
  summary: 'Three near-identical ways to ask how someone is doing — the differences are so small that any one works almost everywhere, which itself is worth knowing: you rarely need to overthink this greeting.',
  sections: [
    { h: 'Nearly interchangeable', html: '<i>¿Qué tal estás?</i> and <i>¿Cómo estás?</i> ask the same thing; either works in almost any casual-to-neutral setting.' },
    { h: 'One with a different job', html: '<i>¿Estás bien?</i> is not a general greeting — it checks for a specific problem, usually after noticing something (a face, a tone, an absence).' }
  ],
  exponents: [
    { es: '¿Qué tal estás?', en: 'How are you?', register: 'coloquial' },
    { es: '¿Cómo estás?', en: 'How are you?', register: 'neutral' },
    { es: '¿Estás bien?', en: 'Are you OK?', register: 'coloquial', note: 'checks specifically for a problem, not a general update' }
  ],
  pitfalls: [
    'Asking <i>¿Estás bien?</i> as a plain greeting can sound like you noticed something is wrong — save it for when you actually did.'
  ],
  examples: [
    { es: '—Hola, ¿qué tal estás? —Bien, ¿y tú?', en: '—Hi, how are you? —Good, and you?' },
    { es: '—¿Cómo estás hoy? —Un poco cansado.', en: '—How are you today? —A bit tired.' },
    { es: 'Te veo pálido. ¿Estás bien?', en: 'You look pale. Are you OK?' }
  ],
  probes: [
    { id: 'p:preguntarestadoanimo:diferente', kind: 'mcq',
      q: '¿Cuál NO es un simple saludo, sino que comprueba si algo va mal?',
      options: ['¿Cómo estás?', '¿Qué tal estás?', '¿Estás bien?'], answer: 2 },
    { id: 'p:preguntarestadoanimo:cloze', kind: 'cloze',
      text: '¿___ tal estás?', accept: ['Qué', 'qué'] },
    { id: 'p:preguntarestadoanimo:mcq2', kind: 'mcq',
      q: 'Ves a un amigo con mala cara. ¿Qué le preguntas?',
      options: ['¿Qué tal estás?', '¿Estás bien?', '¿Cómo te llamas?'], answer: 1 },
    { id: 'p:preguntarestadoanimo:recall', kind: 'recall',
      front: 'This question checks for a specific problem, not a general update', back: '¿Estás bien?' }
  ]
},

{
  id: 'fn-alegria-satisfaccion-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:229', 'funciones:A2:230', 'funciones:A2:231'],
  title: 'Expresar alegría y satisfacción',
  summary: 'A short exclamation reacts to news in the moment; "estoy contento" states your ongoing state — the choice is about whether you are reacting to something just said or describing how you generally feel.',
  sections: [
    { h: 'Reaction vs state', html: '<i>¡Muy bien!</i> and <i>¡Qué bien!</i> react to something just said; <i>Estoy contento</i> describes how you generally feel right now, independent of any specific news.' },
    { h: 'The ¡Qué…! pattern', html: 'One frame covers most reactions: <b>¡Qué + noun or adjective!</b> — <i>¡Qué bien!</i>, <i>¡Qué alegría!</i>, <i>¡Qué suerte!</i>. No verb is needed, and no article before the noun: <i>*¡Qué una suerte!</i> is wrong.' },
    { h: 'Saying what you are pleased about', html: 'Add <b>con</b> for a thing (<i>Estoy contento con el resultado</i>) or <b>de que</b> + subjunctive for an event (<i>Me alegro de que hayas venido</i>).' }
  ],
  exponents: [
    { es: '¡Muy bien!', en: 'Great!', register: 'coloquial', note: 'reacting to news just heard' },
    { es: '¡Qué bien!', en: 'How nice!', register: 'coloquial', note: 'reacting to news just heard' },
    { es: 'Estoy contento.', en: "I'm happy.", register: 'neutral', note: 'states an ongoing state, not a reaction' }
  ],
  pitfalls: [
    'Using <i>Estoy contento</i> to react to someone else\'s news sounds slightly flat — the exclamations do that job better.'
  ],
  examples: [
    { es: '—He aprobado el examen. —¡Qué bien!', en: '—I passed the exam. —How nice!' },
    { es: 'Estoy muy contento con mi nuevo trabajo.', en: "I'm very happy with my new job." },
    { es: '—Nos vamos de vacaciones. —¡Muy bien!', en: "—We're going on holiday. —Great!" }
  ],
  probes: [
    { id: 'p:alegriasatisfaccion:reaccion', kind: 'mcq',
      q: 'Un amigo te da una buena noticia. ¿Qué dices?',
      options: ['Estoy contento.', '¡Qué bien!', 'Soy feliz.'], answer: 1 },
    { id: 'p:alegriasatisfaccion:estado', kind: 'mcq',
      q: 'Describes cómo te sientes en general, no una reacción. ¿Cuál usas?',
      options: ['¡Muy bien!', 'Estoy contento.', '¡Qué bien!'], answer: 1 },
    { id: 'p:alegriasatisfaccion:cloze', kind: 'cloze',
      text: '—He aprobado. —¡Qué ___!', accept: ['bien'] },
    { id: 'p:alegriasatisfaccion:recall', kind: 'recall',
      front: 'Phrase that states your general state, not a reaction to news', back: 'Estoy contento.' }
  ]
},

{
  id: 'fn-sensaciones-fisicas-a2', strand: 'function', cefr: 'A2', level: 2, theme: 'salud',
  pcic: ['funciones:A2:245', 'funciones:A2:246', 'funciones:A2:248', 'funciones:A2:249', 'funciones:A2:250', 'funciones:A2:251'],
  title: 'Expresar sensaciones físicas',
  summary: 'Physical sensations split across two different verb patterns: tener + noun for named cravings (sed, hambre, frío, sueño) and doler working backwards like gustar, where the body part is the grammatical subject, not the person.',
  sections: [
    { h: 'Tener + noun', html: '<i>Tengo sed/hambre/frío/calor/sueño</i> — a fixed set of nouns after <i>tener</i>, not adjectives. Never <i>*estoy sed</i>.' },
    { h: 'Doler works like gustar', html: '<i>Me duele el estómago</i> — the body part is the grammatical subject, so it agrees with the verb: singular body part, singular <i>duele</i>; plural, <i>duelen</i>. The person stays marked with <i>me/te/le</i>, never changing the verb.' }
  ],
  exponents: [
    { es: 'Tengo sed.', en: "I'm thirsty.", register: 'coloquial', note: 'tener + noun — a named physical need' },
    { es: 'Estoy cansado.', en: "I'm tired.", register: 'neutral', note: 'estar + adjective' },
    { es: 'Me duele el estómago.', en: 'My stomach hurts.', register: 'coloquial', note: 'doler works like gustar — el estómago is the subject' },
    { es: 'Me duelen los pies.', en: 'My feet hurt.', register: 'coloquial', note: 'plural subject, plural verb — same pattern as gustar' },
    { es: 'Tiene dolor de cabeza.', en: 'He/she has a headache.', register: 'neutral', note: 'tener dolor de + body part' }
  ],
  pitfalls: [
    'Do not say <i>*Estoy dolor</i> or <i>*Tengo duele</i> — <i>doler</i> is a full verb (like gustar) and <i>dolor</i> a noun (used with <i>tener</i>); they do not mix.',
    'Match <i>duele/duelen</i> to the body part, not to how many people are in pain: <i>Nos duele la cabeza</i> (one head each, still singular <i>duele</i> per person mentioned).'
  ],
  examples: [
    { es: 'Tengo mucho sueño hoy.', en: "I'm very sleepy today." },
    { es: 'Estoy enfermo, no puedo ir a trabajar.', en: "I'm sick, I can't go to work." },
    { es: '¡Ay! Me duele la espalda.', en: 'Ouch! My back hurts.' }
  ],
  probes: [
    { id: 'p:sensacionesfisicas:tenerestar', kind: 'mcq',
      q: '"___ mucha sed."',
      options: ['Estoy', 'Tengo', 'Soy'], answer: 1 },
    { id: 'p:sensacionesfisicas:doler', kind: 'mcq',
      q: '"Me ___ los pies." (varios pies)',
      options: ['duele', 'duelen', 'dueles'], answer: 1 },
    { id: 'p:sensacionesfisicas:cloze', kind: 'cloze',
      text: 'Me ___ el estómago.', accept: ['duele'] },
    { id: 'p:sensacionesfisicas:recall', kind: 'recall',
      front: 'In "me duele X", what is the grammatical subject?', back: 'X (the body part), not the person' }
  ]
},

/* ============================================================================
 * BATCH 4 — seq 177-195 of spec/syllabus-draft.json (A2 function, "Influir
 * en el interlocutor" and "Relacionarse socialmente").
 * Skipped: func-a2-de-forma-atenuada (177, the 33-item version — a
 * different syllabus entry happens to share this exact id with 178) — spec
 * conflates softened orders, asking a favor, asking for help, asking
 * permission, inviting and declining, and warning. Needs splitting.
 * func-a2-establecer-la-comunicacion (192) and its "reaccionar" sibling
 * (193) — mostly duplicate the A1 establecer-comunicacion lesson; their one
 * new item (¿Dígame?) is folded into fn-responder-telefono-a2 below, which
 * already covers answering a call.
 * ========================================================================== */
{
  id: 'fn-pedir-objetos-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:270', 'funciones:A2:271', 'funciones:A2:272', 'funciones:A2:273'],
  title: 'Pedir un objeto',
  summary: 'A direct command for a physical thing ("Dame la sal") is rare in practice — Spanish almost always softens the request into a question, and "por favor" is doing less work than the question form itself.',
  sections: [
    { h: 'A question, not a command', html: 'Turning the request into a question — <i>¿Puedes darme...?</i>, <i>¿Me traes...?</i>, <i>¿Me das...?</i> — is the default softening, more than adding <i>por favor</i> alone.' },
    { h: 'Hiding the request inside a statement', html: 'The most indirect version does not ask at all: <i>No tengo bolígrafo</i> states a problem and lets the listener offer, without you ever framing it as a request.' }
  ],
  exponents: [
    { es: '¿Puedes darme otra servilleta?', en: 'Can you give me another napkin?', register: 'coloquial', note: 'tú, question softens the command' },
    { es: '¿Me trae otra cerveza, por favor?', en: 'Could you bring me another beer, please?', register: 'formal', note: 'usted, typical to waitstaff' },
    { es: '¿Nos trae la cuenta?', en: 'Could you bring us the bill?', register: 'formal', note: 'usted' },
    { es: '¿Me das un vaso de agua?', en: 'Can you give me a glass of water?', register: 'coloquial' },
    { es: 'No tengo bolígrafo.', en: "I don't have a pen.", register: 'coloquial', note: 'covert request — states the problem, asks nothing directly' }
  ],
  pitfalls: [
    'The covert version (<i>No tengo bolígrafo</i>) only works if the context makes the request obvious — used with no context, it just sounds like a complaint.'
  ],
  examples: [
    { es: '—¿Puedes darme el móvil un momento? —Claro, toma.', en: '—Can you give me the phone for a second? —Sure, here.' },
    { es: '¿Me trae la carta, por favor?', en: 'Could you bring me the menu, please?' },
    { es: 'No tengo cambio...', en: "I don't have any change..." }
  ],
  probes: [
    { id: 'p:pedirobjetos:pregunta', kind: 'mcq',
      q: '¿Cuál es la forma habitual de pedir algo, más que un imperativo directo?',
      options: ['Dame la sal.', '¿Me das la sal?', 'Sal.'], answer: 1 },
    { id: 'p:pedirobjetos:encubierta', kind: 'mcq',
      q: 'Quieres que alguien te preste un bolígrafo, sin pedirlo directamente. ¿Qué dices?',
      options: ['¿Me das un bolígrafo?', 'No tengo bolígrafo.', 'Dame un bolígrafo.'], answer: 1 },
    { id: 'p:pedirobjetos:cloze', kind: 'cloze',
      text: '¿Nos ___ la cuenta?', accept: ['trae'] },
    { id: 'p:pedirobjetos:recall', kind: 'recall',
      front: 'The default way to soften a request for an object', back: 'turn it into a question' }
  ]
},

{
  id: 'fn-acceder-peticion-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:286', 'funciones:A2:287', 'funciones:A2:289', 'funciones:A2:290'],
  title: 'Acceder a una petición',
  summary: 'Agreeing to do what someone asks has a scale from unreserved to hedged to evasive — the same short words (vale, bueno) shift meaning depending on whether they stand alone or come loaded with a "pero" or a "no sé".',
  sections: [
    { h: 'Unreserved', html: '<i>Sí, claro</i> and a bare <i>Vale</i> agree cleanly, no hesitation implied.' },
    { h: 'With reservations, or evading', html: '<i>Bueno, vale</i> (with a heavier, slower "bueno") signals reluctance even while agreeing. <i>Bueno, no sé...</i> avoids a real answer — technically not a refusal, but not agreement either.' }
  ],
  exponents: [
    { es: '—¿Puedo pedirte un favor? —Sí, sí, claro.', en: '—Can I ask you a favour? —Yes, of course.', register: 'neutral', note: 'unreserved, warm' },
    { es: '—Ordena el despacho antes de irte, por favor. —Vale.', en: '—Tidy the office before you leave, please. —OK.', register: 'coloquial', note: 'bare vale — clean agreement' },
    { es: '—Tienes que limpiar la cocina. —Bueno, vale.', en: '—You have to clean the kitchen. —Fine, OK.', register: 'coloquial', note: 'the slower "bueno" signals reluctance' },
    { es: '—¿Me ayudas mañana a pintar la casa? —Bueno, no sé...', en: "—Will you help me paint the house tomorrow? —Well, I don't know...", register: 'coloquial', note: 'evasive — avoids a real answer' }
  ],
  pitfalls: [
    '<i>Bueno, vale</i> and a bare <i>Vale</i> are not the same commitment — the extra <i>bueno</i> is doing the work of a sigh.'
  ],
  examples: [
    { es: '—¿Puedes ayudarme con las maletas? —Sí, claro, sin problema.', en: '—Can you help me with the suitcases? —Yes, of course, no problem.' },
    { es: '—¿Vienes a la reunión? —Bueno, vale, pero llegaré tarde.', en: "—Are you coming to the meeting? —Fine, OK, but I'll be late." },
    { es: '—¿Me prestas dinero? —Bueno, no sé, tengo que pensarlo.', en: "—Will you lend me money? —Well, I don't know, I have to think about it." }
  ],
  probes: [
    { id: 'p:acceder:sinreservas', kind: 'mcq',
      q: '¿Cuál acepta SIN ninguna reserva?',
      options: ['Bueno, vale.', 'Sí, sí, claro.', 'Bueno, no sé...'], answer: 1 },
    { id: 'p:acceder:evasiva', kind: 'mcq',
      q: '¿Cuál NO es realmente un sí ni un no?',
      options: ['Vale.', 'Bueno, no sé...', 'Sí, claro.'], answer: 1 },
    { id: 'p:acceder:cloze', kind: 'cloze',
      text: '—Tienes que limpiar la cocina. —___, vale.', accept: ['Bueno', 'bueno'] },
    { id: 'p:acceder:recall', kind: 'recall',
      front: 'Adding this word before "vale" turns clean agreement into reluctant agreement', back: 'bueno' }
  ]
},

{
  id: 'fn-negarse-peticion-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:292', 'funciones:A2:293', 'funciones:A2:295'],
  title: 'Negarse a una petición',
  summary: 'Refusing has a courteous version, cushioned with an apology and a reason, and a blunt one that states the refusal outright — the difference is not the content of your no but whether you soften the blow first.',
  sections: [
    { h: 'Courteous: cushion first', html: '<i>Lo siento, pero...</i> + a reason cushions the refusal — the apology comes before the actual no.' },
    { h: 'Blunt: no cushioning', html: '<i>No quiero</i>/<i>No puedo</i> alone states the refusal outright, with no apology and often no reason.' }
  ],
  exponents: [
    { es: '—Tienes que terminar esto hoy. —Lo siento, pero no puedo. No tengo tiempo.', en: "—You have to finish this today. —I'm sorry, but I can't. I don't have time.", register: 'neutral', note: 'apology + reason — courteous' },
    { es: '—Perdona, ¿puedes venir un momento? —Lo siento, no puedo. Tengo que trabajar.', en: "—Excuse me, can you come for a moment? —I'm sorry, I can't. I have to work.", register: 'neutral' },
    { es: '—Siéntate. —No quiero sentarme.', en: "—Sit down. —I don't want to sit down.", register: 'coloquial', note: 'blunt, no cushioning' },
    { es: '—Tienes que ir a ver a tu abuela. —No puedo ir.', en: "—You have to go see your grandmother. —I can't go.", register: 'coloquial', note: 'flat refusal, no apology' }
  ],
  pitfalls: [
    'A justification makes even a blunt refusal land softer — <i>No puedo</i> alone can sound curt; adding a reason, even briefly, helps.'
  ],
  examples: [
    { es: '—¿Puedes quedarte hasta tarde? —Lo siento, pero tengo una cita.', en: "—Can you stay late? —I'm sorry, but I have an appointment." },
    { es: '—Cómetelo todo. —No quiero.', en: "—Eat it all up. —I don't want to." },
    { es: '—¿Me prestas el coche? —No puedo, lo necesito yo.', en: "—Will you lend me the car? —I can't, I need it myself." }
  ],
  probes: [
    { id: 'p:negarse:cortes', kind: 'mcq',
      q: '¿Cuál es la forma cortés de negarte?',
      options: ['No quiero.', 'Lo siento, pero no puedo.', 'No.'], answer: 1 },
    { id: 'p:negarse:tajante', kind: 'mcq',
      q: '¿Cuál es tajante, sin disculpa?',
      options: ['Lo siento, no puedo.', 'No quiero.', 'Lo siento, pero...'], answer: 1 },
    { id: 'p:negarse:cloze', kind: 'cloze',
      text: 'Lo siento, ___ no puedo.', accept: ['pero'] },
    { id: 'p:negarse:recall', kind: 'recall',
      front: 'What softens a refusal before the actual "no"?', back: 'an apology (lo siento)' }
  ]
},

{
  id: 'fn-proponer-sugerir-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:307', 'funciones:A2:308', 'funciones:A2:309', 'funciones:A2:310', 'funciones:A2:311', 'funciones:A2:312'],
  title: 'Proponer y sugerir',
  summary: 'Proposing an activity uses ordinary questions, not a special grammar — "¿Vamos a bailar?" is literally asking about a shared future action, and it works precisely because it includes you both.',
  sections: [
    { h: 'A shared "we"', html: 'Most proposals use <i>nosotros</i> (<i>vamos, quedamos, tomamos</i>) — grammatically including yourself commits you too, which makes it a genuine proposal, not an order.' },
    { h: 'Softer openers', html: '<i>¿Por qué no...?</i> and <i>¿Qué tal si...?</i> wrap the same idea in a frame that sounds like problem-solving or a casual thought, rather than a flat suggestion.' }
  ],
  exponents: [
    { es: '¿Vamos a bailar?', en: 'Shall we go dancing?', register: 'coloquial', note: 'nosotros — includes both of you' },
    { es: '¿Vienes al gimnasio?', en: 'Are you coming to the gym?', register: 'coloquial', note: 'invites by asking if they will join YOUR plan' },
    { es: '¿Quedamos el viernes?', en: 'Shall we meet up on Friday?', register: 'neutral', note: 'quedar — the standard verb for arranging to meet' },
    { es: '¿Por qué no vamos a comer?', en: "Why don't we go eat?", register: 'coloquial', note: 'frames the proposal as removing an obstacle' },
    { es: '¿Qué tal si vamos al cine esta tarde?', en: 'How about we go to the cinema this afternoon?', register: 'neutral', note: 'qué tal si — softer opener' }
  ],
  pitfalls: [
    '<i>¿Vienes a...?</i> proposes something that is already YOUR plan, inviting them to join — it is not neutral between the two of you the way <i>¿vamos?</i> is.'
  ],
  examples: [
    { es: '¿Quedamos en tu casa a las ocho?', en: 'Shall we meet at your place at eight?' },
    { es: '¿Por qué no cambias de trabajo?', en: "Why don't you change jobs?" },
    { es: '¿Tomamos algo después?', en: 'Shall we grab a drink afterwards?' }
  ],
  probes: [
    { id: 'p:proponer:incluir', kind: 'mcq',
      q: '¿Cuál incluye a las dos personas en la propuesta?',
      options: ['¿Vienes al cine?', '¿Vamos al cine?', 'Ve al cine.'], answer: 1 },
    { id: 'p:proponer:verbo', kind: 'mcq',
      q: '¿Qué verbo es el estándar para proponer quedar con alguien?',
      options: ['Encontrar', 'Quedar', 'Ver'], answer: 1 },
    { id: 'p:proponer:cloze', kind: 'cloze',
      text: '¿___ tal si vamos al cine?', accept: ['Qué', 'qué'] },
    { id: 'p:proponer:recall', kind: 'recall',
      front: 'Grammatical person most proposals use, to include yourself too', back: 'nosotros' }
  ]
},

{
  id: 'fn-aceptar-invitacion-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:320', 'funciones:A2:322', 'funciones:A2:323', 'funciones:A2:325', 'funciones:A2:326'],
  title: 'Aceptar una invitación: con y sin reservas',
  summary: 'Accepting an invitation cleanly and accepting it with a condition attached use nearly the same words — the difference is a single "pero" that turns full acceptance into a qualified one.',
  sections: [
    { h: 'Clean acceptance', html: '<i>Vale</i>, <i>De acuerdo</i>, <i>Encantado</i> all accept outright, with nothing held back.' },
    { h: 'One word changes everything', html: 'Add <i>pero</i> and a condition — <i>Sí, pero más tarde</i> — and the same acceptance becomes conditional. You have still said yes, just not unconditionally.' }
  ],
  exponents: [
    { es: '—¿Vienes a cenar a casa? —Sí, vale, de acuerdo.', en: '—Are you coming for dinner? —Yes, OK, sounds good.', register: 'coloquial', note: 'clean, unreserved acceptance' },
    { es: 'Vale, ¿por qué no?', en: 'OK, why not?', register: 'coloquial', note: 'clean acceptance, slightly more enthusiastic' },
    { es: 'Encantado.', en: "I'd be delighted.", register: 'neutral', note: 'set formula, warmer than a bare vale' },
    { es: '—¿Vienes a tomar algo con nosotros? —Sí, pero más tarde.', en: '—Are you coming for a drink with us? —Yes, but later.', register: 'neutral', note: 'accepted, with a condition attached' },
    { es: 'Bueno, vale, pero a las seis volvemos.', en: "Fine, OK, but we're back by six.", register: 'coloquial', note: 'accepted, with a condition attached' }
  ],
  pitfalls: [
    'A condition after <i>pero</i> is still a yes — do not read <i>Sí, pero más tarde</i> as a soft no; the invitation is accepted, just on your terms.'
  ],
  examples: [
    { es: '—¿Te apuntas al plan? —¡Encantado!', en: "—Are you in on the plan? —I'd love to!" },
    { es: '—¿Vienes a la boda? —Vale, ¿por qué no?', en: '—Are you coming to the wedding? —OK, why not?' },
    { es: 'Sí, pero solo si terminamos pronto.', en: 'Yes, but only if we finish early.' }
  ],
  probes: [
    { id: 'p:aceptar:limpia', kind: 'mcq',
      q: '¿Cuál acepta SIN ninguna condición?',
      options: ['Sí, pero más tarde.', 'Vale, ¿por qué no?', 'Bueno, vale, pero...'], answer: 1 },
    { id: 'p:aceptar:condicion', kind: 'mcq',
      q: '—¿Vienes a tomar algo? —Sí, pero más tarde. ¿Aceptó o rechazó?',
      options: ['Aceptó, con una condición', 'Rechazó', 'No respondió'], answer: 0 },
    { id: 'p:aceptar:cloze', kind: 'cloze',
      text: 'Bueno, vale, ___ a las seis volvemos.', accept: ['pero'] },
    { id: 'p:aceptar:recall', kind: 'recall',
      front: 'The single word that turns full acceptance into conditional acceptance', back: 'pero' }
  ]
},

{
  id: 'fn-aconsejar-a2', strand: 'function', cefr: 'A2', level: 2, theme: 'salud',
  pcic: ['funciones:A2:335', 'funciones:A2:336', 'funciones:A2:337', 'funciones:A2:338', 'funciones:A2:340'],
  title: 'Aconsejar',
  summary: 'Advice ranges from a gentle option (puedes) through a personal push (tienes que) to an impersonal rule (hay que) — the impersonal version advises without pointing at anyone, which is often what makes it land better.',
  sections: [
    { h: 'A scale of directness', html: '<i>Puedes</i> offers an option; <i>tienes que</i> pushes personally; <i>hay que</i> and <i>es necesario</i> state a general rule that names no one — useful when direct advice would feel like criticism.' },
    { h: 'Imperative plus reason', html: 'A bare command (<i>Come más</i>) can sound blunt alone; adding the reason (<i>Estás muy delgado</i>) turns it into advice rather than an order.' }
  ],
  exponents: [
    { es: 'Puedes escuchar la radio.', en: 'You could listen to the radio.', register: 'coloquial', note: 'puedes — a gentle option, not a push' },
    { es: 'Tienes que trabajar menos.', en: 'You need to work less.', register: 'coloquial', note: 'tienes que — a direct, personal push' },
    { es: 'Hay que descansar.', en: 'One needs to rest.', register: 'neutral', note: 'hay que — impersonal, aimed at no one in particular' },
    { es: 'Come más. Estás muy delgado.', en: "Eat more. You're very thin.", register: 'coloquial', note: 'imperative — direct advice, softened by the reason after' },
    { es: 'Es necesario hacer un poco de ejercicio todos los días.', en: "It's necessary to do a bit of exercise every day.", register: 'neutral', note: 'impersonal, works in writing too' }
  ],
  pitfalls: [
    '<i>Tienes que</i> aims squarely at the listener — reach for <i>hay que</i> instead if you want the advice to feel less personal.'
  ],
  examples: [
    { es: '¿Por qué no vas al médico?', en: "Why don't you go to the doctor?" },
    { es: 'Es importante dormir bien.', en: "It's important to sleep well." },
    { es: 'Hay que estudiar más para aprobar.', en: 'One needs to study more to pass.' }
  ],
  probes: [
    { id: 'p:aconsejar:impersonal', kind: 'mcq',
      q: '¿Cuál da un consejo SIN señalar directamente al oyente?',
      options: ['Tienes que dormir más.', 'Hay que dormir más.', 'Duerme más.'], answer: 1 },
    { id: 'p:aconsejar:suave', kind: 'mcq',
      q: '¿Cuál es la opción MÁS suave, casi solo una sugerencia?',
      options: ['Tienes que ir.', 'Puedes ir.', 'Ve.'], answer: 1 },
    { id: 'p:aconsejar:cloze', kind: 'cloze',
      text: '___ que descansar.', accept: ['Hay', 'hay'] },
    { id: 'p:aconsejar:recall', kind: 'recall',
      front: 'Which form of advice names no one in particular?', back: 'hay que / es necesario (impersonal)' }
  ]
},

{
  id: 'fn-ofrecerse-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:343', 'funciones:A2:344', 'funciones:A2:345'],
  title: 'Ofrecerse para hacer algo',
  summary: 'Offering help can be as short as a two-word question — the offer itself does the work; you rarely need more than "¿Te ayudo?" to make a genuine offer.',
  sections: [
    { h: 'Short is normal', html: 'None of these need padding — a bare <i>¿Te ayudo?</i> is a complete, genuine offer, not an abrupt one.' },
    { h: 'Offering vs asking about need', html: '<i>¿Te ayudo?</i> puts you forward as the helper; <i>¿Necesitas ayuda?</i> asks about their situation first, which can feel less presumptuous.' }
  ],
  exponents: [
    { es: '¿Te ayudo?', en: 'Shall I help you?', register: 'coloquial', note: 'the shortest, most direct offer' },
    { es: '¿Puedo ayudarte?', en: 'Can I help you?', register: 'neutral', note: 'slightly more formal phrasing, same offer' },
    { es: '¿Necesitas ayuda?', en: 'Do you need help?', register: 'neutral', note: 'asks about their need rather than offering directly' }
  ],
  pitfalls: [
    'Waiting to be asked before offering help can read as indifferent — Spanish culture leans toward offering unprompted in obvious situations (heavy bags, a struggling parent).'
  ],
  examples: [
    { es: '—¿Te ayudo con las maletas? —Sí, gracias.', en: '—Shall I help you with the suitcases? —Yes, thanks.' },
    { es: '¿Puedo ayudarte con algo?', en: 'Can I help you with anything?' },
    { es: 'Veo que tienes mucho trabajo. ¿Necesitas ayuda?', en: 'I see you have a lot of work. Do you need help?' }
  ],
  probes: [
    { id: 'p:ofrecerse:corto', kind: 'mcq',
      q: '¿Cuál es la forma más corta y directa de ofrecer ayuda?',
      options: ['¿Necesitas ayuda?', '¿Te ayudo?', '¿Puedo ayudarte con algo?'], answer: 1 },
    { id: 'p:ofrecerse:necesidad', kind: 'mcq',
      q: '¿Cuál pregunta primero por SU situación, en vez de ofrecerte directamente?',
      options: ['¿Te ayudo?', '¿Necesitas ayuda?', '¿Puedo?'], answer: 1 },
    { id: 'p:ofrecerse:cloze', kind: 'cloze',
      text: '¿___ ayudarte?', accept: ['Puedo', 'puedo'] },
    { id: 'p:ofrecerse:recall', kind: 'recall',
      front: 'The shortest, most direct way to offer help', back: '¿Te ayudo?' }
  ]
},

{
  id: 'fn-presentar-alguien-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:369', 'funciones:A2:370', 'funciones:A2:372', 'funciones:A2:351'],
  title: 'Presentar a alguien',
  summary: 'Introducing someone shifts noticeably between friends and a professional setting: te presento vs le presento, first name vs surname-plus-title, and how much you explain about who they are.',
  sections: [
    { h: 'Te vs le', html: '<i>Te presento a...</i> in an informal setting; <i>Le presento a...</i> when at least one person is addressed as usted.' },
    { h: 'How much context', html: 'Informally, a first name plus relationship is enough (<i>mi hermana Luisa</i>). Formally, surname, title and role earn their place (<i>la Sra. Lodeiro, nuestra nueva directora comercial</i>).' }
  ],
  exponents: [
    { es: 'Te presento a Luis.', en: 'This is Luis.', register: 'coloquial', note: 'te — informal, first name' },
    { es: 'Te presento a mi hermana Luisa.', en: 'This is my sister Luisa.', register: 'coloquial', note: 'adds the relationship, informal' },
    { es: 'Te presento a Eloy. Es un amigo mío.', en: "This is Eloy. He's a friend of mine.", register: 'coloquial' },
    { es: 'Le presento a la Sra. Lodeiro, nuestra nueva directora comercial.', en: 'May I introduce Mrs Lodeiro, our new sales director.', register: 'formal', note: 'le — usted register, surname + title + role' }
  ],
  pitfalls: [
    'Formal introductions use the surname with a title (<i>Sra. Lodeiro</i>), never the bare first name — mixing register (<i>Le presento a Ana</i>) undercuts the formality.'
  ],
  examples: [
    { es: '—Te presento a mi amigo Carlos. —Hola, encantado.', en: '—This is my friend Carlos. —Hi, pleased to meet you.' },
    { es: 'Le presento a mi colega, el Sr. Ruiz.', en: 'May I introduce my colleague, Mr Ruiz.' },
    { es: 'Querido Antonio:', en: 'Dear Antonio,' }
  ],
  probes: [
    { id: 'p:presentaralguien:registro', kind: 'mcq',
      q: 'Presentas a tu jefe a un cliente importante. ¿Qué usas?',
      options: ['Te presento a...', 'Le presento a...', 'Este es...'], answer: 1 },
    { id: 'p:presentaralguien:contexto', kind: 'mcq',
      q: '¿Cuál añade la relación con la persona?',
      options: ['Te presento a Luis.', 'Te presento a mi hermana Luisa.', 'Hola, Luis.'], answer: 1 },
    { id: 'p:presentaralguien:cloze', kind: 'cloze',
      text: '___ presento a la Sra. Lodeiro.', accept: ['Le', 'le'] },
    { id: 'p:presentaralguien:recall', kind: 'recall',
      front: 'Formal introductions use surname + title, never just the ___', back: 'first name' }
  ]
},

{
  id: 'fn-responder-saludo-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:354', 'funciones:A2:355', 'funciones:A2:356'],
  title: 'Responder a un saludo',
  summary: 'A2 responses to "how are you" all bounce the question back — the shape (adjective, gracias, ¿y tú?) is fixed enough that you can answer on autopilot and still sound natural.',
  sections: [
    { h: 'Always bounce it back', html: 'A response to "how are you" is not complete without returning the question — <i>¿y tú?/¿y usted?</i> is expected, not optional politeness.' },
    { h: 'Match their register', html: 'Answer usted with usted, tú with tú — the greeting sets the register for the whole exchange, not just the question.' }
  ],
  exponents: [
    { es: '—¿Qué tal? —Muy bien, gracias, ¿y tú?', en: '—How are you? —Very well, thanks, and you?', register: 'coloquial', note: 'tú, bounces the question back' },
    { es: '—¿Cómo está usted? —Muy bien. Y usted, ¿cómo está?', en: '—How are you? —Very well. And you?', register: 'formal', note: 'usted mirrors the register used to greet you' },
    { es: 'Bien. Y tú, ¿qué tal?', en: "Good. And you, how's it going?", register: 'coloquial' }
  ],
  pitfalls: [
    'Skipping <i>¿y tú?</i> can read as uninterested — the question is a two-way ritual, not really information-seeking.'
  ],
  examples: [
    { es: '—Hola, ¿qué tal? —Bien, ¿y tú?', en: '—Hi, how are you? —Good, and you?' },
    { es: '—Buenos días, ¿cómo está usted? —Muy bien, gracias.', en: '—Good morning, how are you? —Very well, thank you.' },
    { es: '—¿Cómo estás? —Regular, la verdad.', en: '—How are you? —So-so, to be honest.' }
  ],
  probes: [
    { id: 'p:respondersaludo:reciprocidad', kind: 'mcq',
      q: '—¿Qué tal? ¿Qué falta en esta respuesta: "Muy bien, gracias."?',
      options: ['Nada, está completa', 'Devolver la pregunta: ¿y tú?', 'Un saludo'], answer: 1 },
    { id: 'p:respondersaludo:registro', kind: 'mcq',
      q: 'Te saluda alguien con "¿cómo está usted?" ¿Cómo respondes?',
      options: ['Bien, ¿y tú?', 'Bien. Y usted, ¿cómo está?', 'Bien, ¿y vosotros?'], answer: 1 },
    { id: 'p:respondersaludo:cloze', kind: 'cloze',
      text: 'Muy bien, gracias, ¿y ___?', accept: ['tú', 'usted'] },
    { id: 'p:respondersaludo:recall', kind: 'recall',
      front: 'A response to "how are you" is incomplete without doing what?', back: 'bouncing the question back' }
  ]
},

{
  id: 'fn-dirigirse-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:361', 'funciones:A2:362', 'funciones:A2:363'],
  title: 'Dirigirse a alguien (A2)',
  summary: 'Getting a stranger\'s attention politely almost always needs a word first — perdón, oiga, oye — except in the one setting where the exchange itself makes the attention-getter unnecessary, like a cashier stating a price.',
  sections: [
    { h: 'Oiga vs oye', html: '<i>Oiga</i> (usted) and <i>oye</i> (tú) both mean roughly "hey, excuse me" — the choice is purely about who you are addressing.' },
    { h: 'When you need nothing at all', html: 'In an already-open exchange, like a cashier naming a price, no attention-getter is needed — the transaction itself is the opening.' }
  ],
  exponents: [
    { es: 'Perdone, ¿sabe dónde está la estación?', en: 'Excuse me, do you know where the station is?', register: 'formal', note: 'perdone — usted' },
    { es: 'Oye, ¿tienes hora?', en: 'Hey, do you have the time?', register: 'coloquial', note: 'oye — tú, casual' },
    { es: 'Oiga, perdone, ¿sabe dónde hay un restaurante mexicano por aquí?', en: "Excuse me, do you know if there's a Mexican restaurant around here?", register: 'formal', note: 'oiga + perdone stacked — extra polite' },
    { es: 'Siete euros, por favor.', en: 'Seven euros, please.', register: 'neutral', note: 'no attention-getter needed — the transaction itself opens the exchange' }
  ],
  pitfalls: [
    '<i>Oye/oiga</i> alone can sound abrupt — stacking it with <i>perdona/perdone</i> softens it, especially with a stranger.'
  ],
  examples: [
    { es: 'Perdona, ¿te importa si me siento aquí?', en: 'Excuse me, do you mind if I sit here?' },
    { es: 'Oiga, se le ha caído esto.', en: 'Excuse me, you dropped this.' },
    { es: '—Dos cafés, por favor. —Marchando.', en: '—Two coffees, please. —Coming right up.' }
  ],
  probes: [
    { id: 'p:dirigirse2:oigaoye', kind: 'mcq',
      q: 'Te diriges a un desconocido mayor, con respeto. ¿Qué usas?',
      options: ['Oye', 'Oiga', '¿Qué tal?'], answer: 1 },
    { id: 'p:dirigirse2:sintratamiento', kind: 'mcq',
      q: 'Un cajero dice el precio directamente, sin llamar la atención antes. ¿Por qué no lo necesita?',
      options: ['Porque es de mala educación', 'Porque la transacción ya está abierta', 'Porque no conoce al cliente'], answer: 1 },
    { id: 'p:dirigirse2:cloze', kind: 'cloze',
      text: '___, ¿sabe dónde está la estación?', accept: ['Perdone', 'perdone'] },
    { id: 'p:dirigirse2:recall', kind: 'recall',
      front: 'Attention-getter for tú, equivalent to formal "oiga"', back: 'oye' }
  ]
},

{
  id: 'fn-disculparse-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:381', 'funciones:A2:382', 'funciones:A2:383'],
  title: 'Disculparse',
  summary: 'Apologizing scales from a quick "perdona" to a heavier "lo siento muchísimo" — and naming exactly what you are sorry for with "siento + infinitive" makes the apology land as sincere rather than reflexive.',
  sections: [
    { h: 'A scale of weight', html: '<i>Perdona/e</i> is light, for everyday bumps; <i>Lo siento (muchísimo)</i> carries more weight, for something that actually caused harm or inconvenience.' },
    { h: 'Naming what you regret', html: '<i>Siento + infinitive</i> attaches the apology to a specific thing, which reads as more sincere than a bare <i>lo siento</i>.' }
  ],
  exponents: [
    { es: 'Lo siento mucho.', en: "I'm very sorry.", register: 'neutral' },
    { es: 'Perdona.', en: 'Sorry.', register: 'coloquial', note: 'tú, light, everyday' },
    { es: 'Perdone.', en: 'Sorry.', register: 'formal', note: 'usted equivalent of perdona' },
    { es: 'Siento llegar tarde.', en: 'Sorry for being late.', register: 'neutral', note: 'siento + infinitive names exactly what you regret' }
  ],
  pitfalls: [
    'A bare <i>Perdona</i> for something serious can sound dismissive — match the weight of the apology to the offense.'
  ],
  examples: [
    { es: 'Perdona, no te había visto.', en: "Sorry, I hadn't seen you." },
    { es: 'Lo siento muchísimo, ha sido culpa mía.', en: "I'm so sorry, it was my fault." },
    { es: 'Siento no haber llamado antes.', en: "Sorry I didn't call earlier." }
  ],
  probes: [
    { id: 'p:disculparse:peso', kind: 'mcq',
      q: '¿Cuál es la disculpa MÁS ligera, para un tropiezo sin importancia?',
      options: ['Lo siento muchísimo.', 'Perdona.', 'Siento haberte hecho esperar tanto.'], answer: 1 },
    { id: 'p:disculparse:especifico', kind: 'mcq',
      q: '¿Cuál nombra EXACTAMENTE lo que sientes?',
      options: ['Lo siento.', 'Perdona.', 'Siento llegar tarde.'], answer: 2 },
    { id: 'p:disculparse:cloze', kind: 'cloze',
      text: '___ llegar tarde.', accept: ['Siento', 'siento'] },
    { id: 'p:disculparse:recall', kind: 'recall',
      front: 'Structure that names exactly what you are apologizing for', back: 'siento + infinitivo' }
  ]
},

{
  id: 'fn-felicitar-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:392', 'funciones:A2:394', 'funciones:A2:395', 'funciones:A2:397', 'funciones:A2:398'],
  title: 'Felicitar',
  summary: 'Felicidades and enhorabuena are not fully interchangeable: felicidades marks a date (a birthday, a holiday), while enhorabuena marks an achievement someone earned.',
  sections: [
    { h: 'A date vs an achievement', html: '<i>Felicidades</i> marks an occasion on the calendar (a birthday, a holiday); <i>Enhorabuena</i> marks something someone achieved (passing an exam, a promotion, a new baby).' },
    { h: 'Naming what you are congratulating', html: 'Both take <b>por</b> + the thing: <i>Enhorabuena por el ascenso</i>, <i>Felicidades por tu santo</i>. With a verb it is <i>por</i> + infinitive: <i>Enhorabuena por haber aprobado</i>.' },
    { h: 'Always plural', html: '<i>Felicidades</i> and <i>felicitaciones</i> exist only in the plural — there is no <i>*felicidad</i> as a greeting, though <i>la felicidad</i> is the ordinary noun for happiness.' }
  ],
  exponents: [
    { es: '¡Feliz cumpleaños!', en: 'Happy birthday!', register: 'coloquial', note: 'felicidades-family — marks a date' },
    { es: '¡Felicidades!', en: 'Congratulations! / Happy birthday!', register: 'neutral', note: 'a date — a birthday, a holiday' },
    { es: '¡Felices fiestas!', en: 'Happy holidays!', register: 'coloquial' },
    { es: '¡Enhorabuena!', en: 'Congratulations!', register: 'neutral', note: 'marks an achievement — earned, not just a date' }
  ],
  pitfalls: [
    "Saying <i>Felicidades</i> for someone's new job undersells it — that is an achievement, so <i>Enhorabuena</i> fits better."
  ],
  examples: [
    { es: '—He aprobado el examen. —¡Enhorabuena!', en: '—I passed the exam. —Congratulations!' },
    { es: '¡Feliz cumpleaños! Muchas felicidades.', en: 'Happy birthday! Many congratulations.' },
    { es: '¡Enhorabuena por el bebé!', en: 'Congratulations on the baby!' }
  ],
  probes: [
    { id: 'p:felicitar:tipo', kind: 'mcq',
      q: 'Un amigo ha conseguido un ascenso en el trabajo. ¿Qué le dices?',
      options: ['¡Felicidades!', '¡Enhorabuena!', '¡Felices fiestas!'], answer: 1 },
    { id: 'p:felicitar:fecha', kind: 'mcq',
      q: 'Es el cumpleaños de tu amiga. ¿Qué le dices?',
      options: ['¡Enhorabuena!', '¡Felicidades!', '¡Buen provecho!'], answer: 1 },
    { id: 'p:felicitar:cloze', kind: 'cloze',
      text: '¡___ cumpleaños!', accept: ['Feliz', 'feliz'] },
    { id: 'p:felicitar:recall', kind: 'recall',
      front: 'Word for congratulating an ACHIEVEMENT, not a date', back: 'Enhorabuena' }
  ]
},

{
  id: 'fn-buenos-deseos-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:401', 'funciones:A2:403', 'funciones:A2:404', 'funciones:A2:406', 'funciones:A2:407'],
  title: 'Formular buenos deseos',
  summary: 'Spanish has a fixed good wish for surprisingly specific moments — before a trip, before someone eats — and using the wrong one, or none at all, leaves a small social gap a native speaker would have filled.',
  sections: [
    { h: 'A fixed phrase for the moment', html: 'Spanish marks specific moments with a set formula — leaving on a trip, sitting down to eat — where English often says nothing at all.' },
    { h: 'Que aproveche, even to strangers', html: 'Wishing <i>que aproveche</i> to someone eating nearby, even a stranger, is normal and expected, not intrusive.' }
  ],
  exponents: [
    { es: '¡Mucha suerte!', en: 'Good luck!', register: 'coloquial' },
    { es: '¡Buen viaje!', en: 'Have a good trip!', register: 'neutral', note: 'said as someone leaves on a trip' },
    { es: '¡Felices vacaciones!', en: 'Happy holidays! (enjoy your time off)', register: 'coloquial' },
    { es: '¡Que aproveche!', en: 'Enjoy your meal!', register: 'neutral', note: 'said to someone about to eat, even by a stranger nearby' },
    { es: 'Buen provecho.', en: 'Enjoy your meal.', register: 'formal', note: 'the more formal equivalent of que aproveche' }
  ],
  pitfalls: [
    'Saying nothing as someone leaves on a trip or starts a meal leaves a small, noticeable gap where a Spanish speaker would expect a set phrase.'
  ],
  examples: [
    { es: '—Me voy de viaje mañana. —¡Buen viaje!', en: "—I'm going on a trip tomorrow. —Have a good trip!" },
    { es: 'Que aproveche, ¡buen provecho!', en: 'Enjoy your meal!' },
    { es: '¡Mucha suerte en el examen!', en: 'Good luck on the exam!' }
  ],
  probes: [
    { id: 'p:buenosdeseos:viaje', kind: 'mcq',
      q: 'Un amigo sale de viaje. ¿Qué le dices?',
      options: ['¡Buen provecho!', '¡Buen viaje!', '¡Enhorabuena!'], answer: 1 },
    { id: 'p:buenosdeseos:comida', kind: 'mcq',
      q: 'Alguien empieza a comer cerca de ti. ¿Qué es normal decir, aunque no lo conozcas?',
      options: ['¡Buen viaje!', '¡Que aproveche!', '¡Mucha suerte!'], answer: 1 },
    { id: 'p:buenosdeseos:cloze', kind: 'cloze',
      text: '¡___ viaje!', accept: ['Buen', 'buen'] },
    { id: 'p:buenosdeseos:recall', kind: 'recall',
      front: 'Formal equivalent of "¡que aproveche!"', back: 'Buen provecho.' }
  ]
},

{
  id: 'fn-responder-telefono-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:430', 'funciones:A2:439', 'funciones:A2:440', 'funciones:A2:442',
         'funciones:A2:446', 'funciones:A2:448', 'funciones:A2:451', 'funciones:A2:453'],
  title: 'Contestar el teléfono',
  summary: 'Answering the phone in Spanish runs through a small, fixed set of moves — confirm identity, ask who\'s calling if unclear, ask them to wait, or redirect if it\'s a wrong number or the person is unavailable — and each has its own set phrase.',
  sections: [
    { h: 'Picking up and confirming', html: '<i>¿Dígame?</i> opens a call. If they ask for you by name, confirm with <i>Sí, soy yo</i>.' },
    { h: 'When you do not recognize the caller', html: '<i>¿De parte de quién?</i> asks who is calling, politely, once — not "who are you" bluntly, but "on behalf of whom".' },
    { h: 'Redirecting the call', html: 'Four fixed outcomes: ask them to wait (<i>Un momento, por favor</i>), say it\'s the wrong number (<i>No, se equivoca</i>), say the person is unavailable (<i>Ahora no puede ponerse</i>), or offer to take a message (<i>¿Quiere dejar un recado?</i>).' }
  ],
  exponents: [
    { es: '¿Dígame?', en: 'Hello? (answering the phone)', register: 'formal', note: 'the standard, slightly formal way to pick up' },
    { es: '—¿Está Antonio? —Sí, soy yo.', en: '—Is Antonio there? —Yes, speaking.', register: 'neutral', note: 'confirming your own identity' },
    { es: '—¿Está Carlota? —¿De parte de quién?', en: "—Is Carlota there? —Who's calling, please?", register: 'formal', note: 'polite, not blunt' },
    { es: 'Un momento, por favor.', en: 'One moment, please.', register: 'neutral' },
    { es: 'No, se equivoca.', en: 'No, you have the wrong number.', register: 'formal' },
    { es: 'Ahora no puede ponerse.', en: "He/she can't come to the phone right now.", register: 'neutral' },
    { es: '¿Quiere dejar un recado?', en: 'Would you like to leave a message?', register: 'formal', note: 'usted — standard phone courtesy' }
  ],
  pitfalls: [
    '<i>¿De parte de quién?</i> is the polite phrasing — a bare <i>¿Quién eres?</i> on the phone sounds unexpectedly blunt.',
    'Confirming identity is <i>Sí, soy yo</i>, not <i>Sí, yo</i> alone — same rule as face to face.'
  ],
  examples: [
    { es: '—¿Puedo hablar con la señora Martínez, por favor? —Un momento, por favor.', en: '—Could I speak with Mrs Martínez, please? —One moment, please.' },
    { es: '—¿Está Rodrigo? —Ahora no puede ponerse, ¿quiere dejar un recado?', en: "—Is Rodrigo there? —He can't come to the phone right now, would you like to leave a message?" },
    { es: 'Lo siento, no, no es aquí.', en: "Sorry, no, this isn't the right number." }
  ],
  probes: [
    { id: 'p:respondertelefono:identidad', kind: 'mcq',
      q: '—¿Está Antonio? ¿Cómo confirmas que eres tú?',
      options: ['Sí, yo.', 'Sí, soy yo.', 'Es él.'], answer: 1 },
    { id: 'p:respondertelefono:quien', kind: 'mcq',
      q: 'No reconoces la voz de quien llama. ¿Qué preguntas, con educación?',
      options: ['¿Quién eres?', '¿De parte de quién?', '¿Qué quieres?'], answer: 1 },
    { id: 'p:respondertelefono:cloze', kind: 'cloze',
      text: 'Ahora no puede ___.', accept: ['ponerse'] },
    { id: 'p:respondertelefono:recall', kind: 'recall',
      front: 'Polite offer when the person called for is not available', back: '¿Quiere dejar un recado?' }
  ]
},

{
  id: 'fn-reaccionar-relato-a2', strand: 'function', cefr: 'A2', level: 2, theme: null,
  pcic: ['funciones:A2:460', 'funciones:A2:461', 'funciones:A2:463'],
  title: 'Reaccionar al inicio de un relato',
  summary: 'Before someone tells you something, they often ask permission first — "¿te cuento una cosa?" — and your answer either opens the floor or closes it, politely, with a reason.',
  sections: [
    { h: 'Opening the floor', html: '<i>Sí, claro</i> grants permission to start; <i>¿Sí?</i> mid-story keeps inviting more, without you saying anything substantive.' },
    { h: 'Closing it politely', html: 'Declining still needs a reason — <i>Lo siento mucho, es que...</i> softens turning someone away from telling their story.' }
  ],
  exponents: [
    { es: '—¿Te cuento una cosa? —Sí, claro.', en: '—Can I tell you something? —Yes, of course.', register: 'coloquial', note: 'opens the floor' },
    { es: '—Ayer, en la calle, vi un accidente. —¿Sí?', en: '—Yesterday, in the street, I saw an accident. —Really?', register: 'coloquial', note: '¿Sí? invites them to continue, mid-story' },
    { es: '—¿Quieres saber una cosa? —Lo siento mucho, es que tengo prisa.', en: "—Do you want to know something? —I'm sorry, it's just that I'm in a hurry.", register: 'neutral', note: 'politely closes the floor, with a reason' }
  ],
  pitfalls: [
    'A bare <i>No</i> to "¿te cuento una cosa?" reads as rude — the refusal needs the apology-plus-reason shape, same as declining any other request.'
  ],
  examples: [
    { es: '—¿Sabes qué ha pasado? —¿Sí? Cuéntame.', en: '—Do you know what happened? —Really? Tell me.' },
    { es: '—Oye, ¿te cuento una cosa? —Sí, claro, dime.', en: '—Hey, can I tell you something? —Yes, of course, go ahead.' },
    { es: 'Lo siento, es que ahora no puedo, luego te escucho.', en: "Sorry, I can't right now, I'll listen later." }
  ],
  probes: [
    { id: 'p:reaccionarrelato:abrir', kind: 'mcq',
      q: '—¿Te cuento una cosa? ¿Cómo le das permiso para seguir?',
      options: ['Sí, claro.', 'No sé.', '¿De verdad?'], answer: 0 },
    { id: 'p:reaccionarrelato:mitad', kind: 'mcq',
      q: 'Te están contando algo y quieres que sigan, sin decir nada nuevo. ¿Qué dices?',
      options: ['¿Sí?', 'Vale.', 'Ya está.'], answer: 0 },
    { id: 'p:reaccionarrelato:cloze', kind: 'cloze',
      text: 'Lo siento mucho, ___ que tengo prisa.', accept: ['es'] },
    { id: 'p:reaccionarrelato:recall', kind: 'recall',
      front: 'A polite refusal to hear a story still needs what, after the apology?', back: 'a reason (es que...)' }
  ]
},

/* ============================================================================
 * BATCH 5 — seq 196-207 of spec/syllabus-draft.json (A2 discourse).
 * ========================================================================== */
{
  id: 'dc-mantenimiento-referente-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:3', 'tacticas_pragmaticas:A2:4', 'tacticas_pragmaticas:A2:5',
         'tacticas_pragmaticas:A2:6', 'tacticas_pragmaticas:A2:7'],
  title: 'Mantener el referente sin repetir',
  summary: 'Once you have named something, Spanish gives you several ways to keep talking about it without saying the word again — a pronoun, a demonstrative, the definite article, or simply dropping the verb — and switching between them keeps a paragraph from sounding like a list.',
  sections: [
    { h: 'A toolkit, not one rule', html: 'Pronoun, demonstrative, definite article, dropped verb, exact repetition — five different tools do the same underlying job: pointing back at something without re-explaining it.' },
    { h: 'Un becomes el', html: 'The first mention of a new thing is usually indefinite (<i>un sofá</i>); as soon as you refer back to that SAME thing, it becomes definite (<i>el sofá</i>) — the shift itself signals "the one I just mentioned".' }
  ],
  exponents: [
    { es: 'Emilia viaja a menudo a Málaga. Allí viven sus padres.', en: 'Emilia often travels to Málaga. Her parents live there.', register: 'neutral', note: 'allí — an adverb standing in for the place just named' },
    { es: 'Ayer vi a María y luego, a Juan.', en: 'Yesterday I saw María and then, Juan.', register: 'coloquial', note: 'the verb "vi" is dropped the second time — understood from context' },
    { es: 'Quiero comprar un sofá. El sofá tiene que ser muy cómodo.', en: 'I want to buy a sofa. The sofa has to be very comfortable.', register: 'neutral', note: 'indefinite un sofá becomes definite el sofá on second mention' },
    { es: 'Fui con un amigo a Alicante y mi amigo se quedó allí todo el verano.', en: 'I went to Alicante with a friend and my friend stayed there all summer.', register: 'coloquial', note: 'the possessive (mi amigo) picks up the noun already mentioned' },
    { es: 'Aquí Marta tuvo un accidente. El accidente fue muy grave.', en: 'Marta had an accident here. The accident was very serious.', register: 'neutral', note: 'exact lexical repetition — plain, but always available' }
  ],
  pitfalls: [
    'Exact repetition is not wrong, but overusing it while pronouns and articles are available makes a passage sound like a report, not a story.'
  ],
  examples: [
    { es: 'Compré un libro. El libro es muy interesante.', en: 'I bought a book. The book is very interesting.' },
    { es: 'Vi a mi hermano en la calle y luego, a mi prima.', en: 'I saw my brother in the street and then, my cousin.' },
    { es: 'Nací en Sevilla. Allí pasé toda mi infancia.', en: 'I was born in Seville. I spent all my childhood there.' }
  ],
  probes: [
    { id: 'p:mantenimientoreferente:articulo', kind: 'mcq',
      q: '"Quiero comprar un sofá. ___ sofá tiene que ser cómodo." (segunda mención)',
      options: ['Un', 'El', 'Este'], answer: 1 },
    { id: 'p:mantenimientoreferente:elipsis', kind: 'mcq',
      q: '"Ayer vi a María y luego, a Juan." ¿Qué se ha omitido la segunda vez?',
      options: ['El sujeto', 'El verbo (vi)', 'El objeto'], answer: 1 },
    { id: 'p:mantenimientoreferente:cloze', kind: 'cloze',
      text: 'Nací en Sevilla. ___ pasé toda mi infancia.', accept: ['Allí', 'allí'] },
    { id: 'p:mantenimientoreferente:recall', kind: 'recall',
      front: 'What happens to the article when you refer back to something already introduced?', back: 'it becomes definite (un -> el)' }
  ]
},

{
  id: 'dc-estructuradores-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:14', 'tacticas_pragmaticas:A2:16', 'tacticas_pragmaticas:A2:17',
         'tacticas_pragmaticas:A2:18', 'tacticas_pragmaticas:A2:19'],
  title: 'Marcadores estructuradores',
  summary: 'A short set of words does the work of a numbered list in speech — primero, luego, por último — plus a marker borrowed from commands (oye) that grabs attention rather than ordering steps.',
  sections: [
    { h: 'Ordering steps', html: '<i>Primero</i> (start), <i>luego/después</i> (continuing), <i>por último</i> (closing) — a spoken substitute for numbering.' },
    { h: 'From command to contact marker', html: '<i>Oye/oiga</i> and <i>mira/mire</i> are literally imperatives ("listen", "look"), but their job here is not an instruction — it is opening or redirecting the listener\'s attention.' }
  ],
  exponents: [
    { es: 'Primero tengo que comprar fruta, luego necesito ir a la carnicería.', en: 'First I have to buy fruit, then I need to go to the butcher\'s.', register: 'neutral', note: 'primero...luego — sequencing' },
    { es: 'Por último, cerramos la tienda a las ocho.', en: 'Finally, we close the shop at eight.', register: 'neutral', note: 'por último — closing a sequence' },
    { es: 'Está enfermo. Por eso no ha venido.', en: "He's sick. That's why he hasn't come.", register: 'neutral', note: 'por eso — consequence' },
    { es: 'Entonces, quedamos a las 10.', en: "So, we're meeting at 10.", register: 'coloquial', note: 'entonces — drawing a practical conclusion' },
    { es: 'Oye, ¿tienes un momento?', en: 'Hey, have you got a moment?', register: 'coloquial', note: 'oye — a command form recycled as an attention-getter' }
  ],
  pitfalls: [
    '<i>Entonces</i> as a filler ("so...") is casual — in writing or formal speech, <i>por lo tanto</i> or <i>por eso</i> reads better.'
  ],
  examples: [
    { es: 'Primero, entra por aquí; luego, sube las escaleras; por último, gira a la derecha.', en: 'First, come in this way; then, go up the stairs; finally, turn right.' },
    { es: 'No tenía dinero. Por eso no fui.', en: "I didn't have money. That's why I didn't go." },
    { es: 'Mira, yo creo que deberías hablar con ella.', en: 'Look, I think you should talk to her.' }
  ],
  probes: [
    { id: 'p:estructuradores:orden', kind: 'mcq',
      q: '¿Cuál marca el CIERRE de una secuencia de pasos?',
      options: ['Primero', 'Luego', 'Por último'], answer: 2 },
    { id: 'p:estructuradores:origen', kind: 'mcq',
      q: '"Oye" y "mira" son originalmente formas de qué modo verbal?',
      options: ['Indicativo', 'Imperativo', 'Subjuntivo'], answer: 1 },
    { id: 'p:estructuradores:cloze', kind: 'cloze',
      text: 'Está enfermo. Por ___ no ha venido.', accept: ['eso'] },
    { id: 'p:estructuradores:recall', kind: 'recall',
      front: 'Word that opens a sequence of steps', back: 'primero' }
  ]
},

{
  id: 'dc-deixis-espacial-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:28', 'tacticas_pragmaticas:A2:29', 'tacticas_pragmaticas:A2:30'],
  title: 'Deixis espacial (A2)',
  summary: "Beyond aquí/ahí/allí, A2 adds a direction-pair that's easy to get backwards — llevar vs traer — and demonstratives used mid-conversation to sort out exactly which object someone means.",
  sections: [
    { h: 'Llevar vs traer', html: '<i>Traer</i> moves something TOWARD the speaker\'s here (<i>tráeme eso</i>); <i>llevar</i> moves it AWAY, same logic as the ir/venir split. Mixing them up points the object the wrong direction.' },
    { h: 'Sorting out "which one"', html: 'A quick este/ese exchange resolves ambiguity live — the listener\'s <i>¿Este?</i> checks their guess against the speaker\'s original <i>ese</i>.' }
  ],
  exponents: [
    { es: 'María vive cerca (de aquí).', en: 'María lives near (here).', register: 'neutral', note: "cerca/lejos anchored to the speaker's here" },
    { es: '¿Nos puede traer más pan, por favor?', en: 'Could you bring us more bread, please?', register: 'formal', note: "traer — movement TOWARD the speaker's here" },
    { es: '—¿Puedo ver ese bolígrafo? —¿Este? —Sí, ese.', en: '—Can I see that pen? —This one? —Yes, that one.', register: 'coloquial', note: 'sorting out which object, live in conversation' }
  ],
  pitfalls: [
    "<i>Traer</i> and <i>llevar</i> follow the same anchor logic as venir/ir — get the speaker's position wrong and the verb points backwards."
  ],
  examples: [
    { es: '¿Puedes llevar esto a la cocina?', en: 'Can you take this to the kitchen?' },
    { es: 'Tráeme el periódico, por favor.', en: 'Bring me the newspaper, please.' },
    { es: '—¿Cuál te gusta? —Ese de ahí.', en: '—Which one do you like? —That one there.' }
  ],
  probes: [
    { id: 'p:deixisespaciala2:llevartraer', kind: 'mcq',
      q: 'Estás en la cocina y quieres que alguien te dé algo desde el salón. ¿Qué dices?',
      options: ['¿Me lo llevas?', '¿Me lo traes?', '¿Me lo vas?'], answer: 1 },
    { id: 'p:deixisespaciala2:sorting', kind: 'mcq',
      q: '—¿Puedo ver ese bolígrafo? —¿Este? El otro responde para confirmar: "Sí, ___."',
      options: ['este', 'ese', 'aquel'], answer: 1 },
    { id: 'p:deixisespaciala2:cloze', kind: 'cloze',
      text: 'María vive ___ de aquí.', accept: ['cerca'] },
    { id: 'p:deixisespaciala2:recall', kind: 'recall',
      front: 'Verb for moving something TOWARD the speaker', back: 'traer' }
  ]
},

{
  id: 'dc-deixis-personal-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:36', 'tacticas_pragmaticas:A2:37', 'tacticas_pragmaticas:A2:38', 'tacticas_pragmaticas:A2:39'],
  title: 'Deixis personal',
  summary: 'Spanish has three small ways to bring "the person" into sharper focus without changing the basic sentence: making a dropped subject pronoun reappear to point blame, doubling a pronoun to spotlight who receives something, and using a possessive that assumes shared knowledge rather than introducing something new.',
  sections: [
    { h: 'Bringing yourself into focus', html: 'Spanish normally drops subject pronouns; letting <i>yo</i> reappear does real work — usually resolving who exactly did something, sometimes pointedly ("it was ME, not you").' },
    { h: 'Doubling to spotlight', html: '<i>A ti te doy...</i> repeats the same person twice (<i>a ti</i> and <i>te</i>) — redundant information-wise, but it puts weight on WHO receives the action.' },
    { h: 'Possession instead of "the"', html: '<i>Me duele la cabeza</i> uses <i>me</i>, not <i>mi cabeza duele</i> — the dative pronoun carries the possession that English puts on the noun itself.' }
  ],
  exponents: [
    { es: 'Yo he hecho la cena.', en: 'I made dinner (and not someone else).', register: 'coloquial', note: 'the subject pronoun reappears to resolve ambiguity or point at yourself specifically' },
    { es: 'A ti te doy los ejercicios.', en: "To YOU I'm giving the exercises.", register: 'coloquial', note: 'a ti + te — doubled, spotlighting the recipient' },
    { es: 'Me duele la cabeza.', en: 'My head hurts.', register: 'neutral', note: 'dative of possession — me stands in for "mi cabeza"' },
    { es: '¿Dónde está mi bolso?', en: 'Where is my bag?', register: 'coloquial', note: 'mi assumes the listener already knows which bag' }
  ],
  pitfalls: [
    'The dative-of-possession pattern (<i>me duele la cabeza</i>) never adds a possessive too — <i>*me duele mi cabeza</i> doubles up on the same information.'
  ],
  examples: [
    { es: 'A mí me gusta el jazz, a él no.', en: "I like jazz, he doesn't." },
    { es: 'Me rompí la pierna esquiando.', en: 'I broke my leg skiing.' },
    { es: '¿Has visto mi bolso?', en: 'Have you seen my bag?' }
  ],
  probes: [
    { id: 'p:deixispersonal:doblado', kind: 'mcq',
      q: '¿Cuál es la forma "doblada" (redundante pero enfática) de dar algo a alguien?',
      options: ['Te doy los ejercicios.', 'A ti te doy los ejercicios.', 'Doy los ejercicios.'], answer: 1 },
    { id: 'p:deixispersonal:posesion', kind: 'mcq',
      q: '"Me duele ___ cabeza." (NO usa posesivo)',
      options: ['mi', 'la', 'una'], answer: 1 },
    { id: 'p:deixispersonal:cloze', kind: 'cloze',
      text: '___ he hecho la cena, no tú.', accept: ['Yo', 'yo'] },
    { id: 'p:deixispersonal:recall', kind: 'recall',
      front: 'In "me duele la cabeza", what carries the meaning of possession?', back: 'me (the dative pronoun)' }
  ]
},

{
  id: 'dc-deixis-temporal-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:32', 'tacticas_pragmaticas:A2:33'],
  title: 'Deixis temporal',
  summary: 'Time words like antes, después and entonces only make sense relative to a reference point that shifts with context — "después" means something different depending on when you say it, unlike a fixed date.',
  sections: [
    { h: 'Relative to the moment of speaking', html: '<i>Antes, después, entonces, ayer, anoche</i> only mean something once you know WHEN they were said — "ayer" said on a Tuesday means Monday, said on a Friday means Thursday.' },
    { h: 'Locuciones: antes de / después de', html: '<i>Antes de</i> and <i>después de</i> + infinitive or noun sequence two events relative to each other, not to any fixed calendar date.' }
  ],
  exponents: [
    { es: 'Después te llamo.', en: "I'll call you afterward.", register: 'coloquial', note: 'después — relative to now, the moment of speaking' },
    { es: 'Ayer fuimos al cine.', en: 'Yesterday we went to the cinema.', register: 'neutral', note: 'anchored to today, whenever today is' },
    { es: 'Antes de salir, cierra la ventana.', en: 'Before leaving, close the window.', register: 'neutral', note: 'antes de + infinitive — a relative sequence, not a fixed time' },
    { es: 'Desde este momento, quedas avisado.', en: 'From this moment on, consider yourself warned.', register: 'formal', note: 'desde + a point anchored to now' }
  ],
  pitfalls: [
    'Reported speech later shifts these words: something said as <i>ayer</i> becomes <i>el día anterior</i> once you report it later — the anchor point moved.'
  ],
  examples: [
    { es: 'Antes vivía en Madrid; ahora vivo en Sevilla.', en: 'I used to live in Madrid; now I live in Seville.' },
    { es: 'Anoche no pude dormir.', en: "I couldn't sleep last night." },
    { es: 'Nos vemos después de comer.', en: 'See you after eating.' }
  ],
  probes: [
    { id: 'p:deixistemporal:relativo', kind: 'mcq',
      q: '¿Por qué "ayer" no siempre significa el mismo día?',
      options: ['Es un error común', 'Depende de cuándo se dice', 'Solo se usa en pasado'], answer: 1 },
    { id: 'p:deixistemporal:locucion', kind: 'mcq',
      q: '"___ de salir, cierra la ventana." (secuencia relativa)',
      options: ['Antes', 'Ayer', 'Entonces'], answer: 0 },
    { id: 'p:deixistemporal:cloze', kind: 'cloze',
      text: '___ te llamo.', accept: ['Después', 'después'] },
    { id: 'p:deixistemporal:recall', kind: 'recall',
      front: 'Time words like antes/después/ayer are anchored to what?', back: 'the moment of speaking' }
  ]
},

{
  id: 'dc-rematizacion-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:49', 'tacticas_pragmaticas:A2:50', 'tacticas_pragmaticas:A2:51'],
  title: 'Rematización (A2): posesión, cantidad y preguntas',
  summary: 'The A1 rule (new information last) extends to two more cases: stating whose something is, and giving a quantity — both put the actual answer, not the topic, at the end of the sentence.',
  sections: [
    { h: 'Whose and how many', html: 'Asked "¿de quién es esto?", the natural answer is <i>Es mi libro</i>, not <i>Mi libro es esto</i> — the possessor is the new information, so it comes after the verb.' },
    { h: 'Questions keep the pattern', html: 'Even in a question, the subject often follows the verb once a question word is fronted: <i>¿Cuándo llega María?</i>, not <i>¿Cuándo María llega?</i>' }
  ],
  exponents: [
    { es: 'Es mi libro.', en: "It's my book.", register: 'neutral', note: 'possession — the new fact (whose) goes last' },
    { es: 'Son quince.', en: 'There are fifteen.', register: 'coloquial', note: 'quantity — the number is the new information' },
    { es: '¿Cuándo llega María?', en: 'When does María arrive?', register: 'neutral', note: 'question word stays fronted, but the subject (María) still follows the verb' }
  ],
  pitfalls: [
    'This is not optional style — <i>¿Cuándo María llega?</i> sounds foreign to a native speaker, even though every word is correct Spanish.'
  ],
  examples: [
    { es: '—¿De quién es este abrigo? —Es de Marta.', en: "—Whose coat is this? —It's Marta's." },
    { es: '—¿Cuántos años tienes? —Son veinte.', en: '—How old are you? —Twenty.' },
    { es: '¿Para qué viaja Jaime a Barcelona?', en: 'What is Jaime travelling to Barcelona for?' }
  ],
  probes: [
    { id: 'p:rematizaciona2:posesion', kind: 'mcq',
      q: '—¿De quién es esto? ¿Cuál es la respuesta más natural?',
      options: ['Mi libro es esto.', 'Es mi libro.', 'Esto mi libro es.'], answer: 1 },
    { id: 'p:rematizaciona2:pregunta', kind: 'mcq',
      q: '¿Cuál suena natural?',
      options: ['¿Cuándo María llega?', '¿Cuándo llega María?', '¿María cuándo llega?'], answer: 1 },
    { id: 'p:rematizaciona2:cloze', kind: 'cloze',
      text: '—¿Cuántos años tienes? —___ veinte.', accept: ['Son', 'son'] },
    { id: 'p:rematizaciona2:recall', kind: 'recall',
      front: 'In a question with a fronted question word, where does the subject usually go?', back: 'after the verb' }
  ]
},

{
  id: 'dc-tematizacion-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:52', 'tacticas_pragmaticas:A2:53', 'tacticas_pragmaticas:A2:54'],
  title: 'Tematización',
  summary: 'Where rematización pushes new information to the end, tematización does the opposite: it moves something already known to the FRONT, and Spanish signals this fronting with a doubled pronoun or a shift from indefinite to definite article.',
  sections: [
    { h: 'Fronting with a double', html: 'Moving <i>a mí</i> to the front is not enough alone — Spanish also keeps the pronoun (<i>me</i>) in its usual spot: <i>A mí me encanta</i>, never just <i>A mí encanta</i>.' },
    { h: 'Definite because it is assumed known', html: '<i>El comienzo del curso</i> uses the definite article not because it was mentioned before in THIS conversation, but because a course starting is common shared knowledge — tematización can rest on what people generally know, not just what was just said.' }
  ],
  exponents: [
    { es: 'A mí me encanta bailar.', en: 'I love dancing.', register: 'coloquial', note: 'a mí fronted, doubled by me — the topic moves up front' },
    { es: 'El comienzo del curso ha sido difícil.', en: 'The start of the course has been hard.', register: 'neutral', note: 'el, not un — treated as known, already part of the shared context' },
    { es: '¿Has visto mi bolso?', en: 'Have you seen my bag?', register: 'coloquial', note: 'mi assumes you both already know which bag exists' }
  ],
  pitfalls: [
    'Dropping the doubled pronoun after fronting (<i>*A mí encanta bailar</i>) is a common error — the fronted phrase and the pronoun work together, not as alternatives.'
  ],
  examples: [
    { es: 'A nosotros nos parece bien.', en: 'It seems fine to us.' },
    { es: 'La llegada del avión se retrasó una hora.', en: "The plane's arrival was delayed an hour." },
    { es: '¿Dónde has dejado las llaves?', en: 'Where did you leave the keys?' }
  ],
  probes: [
    { id: 'p:tematizacion:doblado', kind: 'mcq',
      q: '¿Cuál está bien formado?',
      options: ['A mí encanta bailar.', 'A mí me encanta bailar.', 'Mí me encanta bailar.'], answer: 1 },
    { id: 'p:tematizacion:articulo', kind: 'mcq',
      q: '¿Por qué "el comienzo del curso" usa artículo definido sin mención previa?',
      options: ['Es un error', 'Es conocimiento compartido, general', 'Siempre se usa "el" con "comienzo"'], answer: 1 },
    { id: 'p:tematizacion:cloze', kind: 'cloze',
      text: 'A nosotros ___ parece bien.', accept: ['nos'] },
    { id: 'p:tematizacion:recall', kind: 'recall',
      front: 'Fronting a topic like "a mí" requires keeping this in its usual place too', back: 'the pronoun (me/te/le/nos...)' }
  ]
},

{
  id: 'dc-interrogativos-neutros-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:57', 'tacticas_pragmaticas:A2:58', 'tacticas_pragmaticas:A2:59',
         'tacticas_pragmaticas:A2:60', 'tacticas_pragmaticas:A2:61', 'tacticas_pragmaticas:A2:62'],
  title: 'Preguntas con función neutra',
  summary: 'Not every question seeks real information — a question can be a request, an offer, a command, a note to yourself, or a teacher checking what you know, and only context tells these apart, since the grammar looks identical.',
  sections: [
    { h: 'Same shape, different jobs', html: 'All five of these are grammatically ordinary questions — the difference is entirely in what they DO: seek information, think aloud, test, request permission, offer, or command.' },
    { h: 'Only context tells them apart', html: 'Nothing in <i>¿Un café?</i> marks it as an offer rather than a genuine question about coffee\'s existence — only the situation (you\'re holding a pot, standing near a guest) makes the meaning obvious.' }
  ],
  exponents: [
    { es: '¿Dónde he puesto las llaves?', en: 'Where did I put the keys?', register: 'coloquial', note: 'a deliberative question — talking to yourself, not really asking anyone' },
    { es: 'A ver, Alejo, ¿cuál es la capital de España?', en: 'Right then, Alejo, what is the capital of Spain?', register: 'neutral', note: 'exam question — the asker already knows the answer' },
    { es: '¿Puedo abrir la ventana?', en: 'Can I open the window?', register: 'neutral', note: 'permission, phrased as a question' },
    { es: '¿Un café?', en: 'Coffee?', register: 'coloquial', note: 'an offer, not a request for information' },
    { es: '¿Me das el pan?', en: 'Can you pass the bread?', register: 'coloquial', note: 'a command, softened into a question' }
  ],
  pitfalls: [
    'A deliberative question (<i>¿Dónde he puesto las llaves?</i>) does not expect an answer from anyone present — answering it can come across as presumptuous unless you clearly are being asked.'
  ],
  examples: [
    { es: '¿Se puede fumar aquí?', en: 'Can you smoke here?' },
    { es: '¿Te ayudo con eso?', en: 'Shall I help with that?' },
    { es: 'A ver, ¿quién sabe la respuesta?', en: 'Right then, who knows the answer?' }
  ],
  probes: [
    { id: 'p:interrogativosneutros:deliberativa', kind: 'mcq',
      q: '"¿Dónde he puesto las llaves?" ¿A quién se dirige realmente esta pregunta?',
      options: ['A otra persona', 'A nadie en particular — pensando en voz alta', 'Al profesor'], answer: 1 },
    { id: 'p:interrogativosneutros:examen', kind: 'mcq',
      q: '"A ver, Alejo, ¿cuál es la capital de España?" ¿Qué tipo de pregunta es?',
      options: ['Real', 'De examen', 'Retórica'], answer: 1 },
    { id: 'p:interrogativosneutros:cloze', kind: 'cloze',
      text: '¿___ abrir la ventana?', accept: ['Puedo', 'puedo'] },
    { id: 'p:interrogativosneutros:recall', kind: 'recall',
      front: 'What tells apart a genuine question from an offer, a command, or an exam question?', back: 'context, not the grammar' }
  ]
},

{
  id: 'dc-interrogativos-orientados-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:64', 'tacticas_pragmaticas:A2:66'],
  title: 'Preguntas orientadas',
  summary: 'Some questions are not neutral at all — an echo question repeats what surprised you, and a rhetorical question already assumes an answer, expecting agreement rather than information.',
  sections: [
    { h: 'Echoing what surprised you', html: 'Repeating the last word or phrase as a question (<i>¿Un caftán?</i>) signals surprise or asks for confirmation — you heard it, you just cannot quite believe it or want it repeated.' },
    { h: 'A question that assumes its answer', html: 'A negative question like <i>¿No conoces a Cristina?</i> is not neutral — it leans toward expecting "yes, I do" and often carries mild surprise that you would not.' }
  ],
  exponents: [
    { es: '—Este verano he comprado un caftán. —¿Un caftán?', en: '—This summer I bought a caftan. —A caftan?', register: 'coloquial', note: 'echo question — repeats the surprising word, asks for confirmation/clarification' },
    { es: '¿No conoces a Cristina?', en: "You don't know Cristina?", register: 'coloquial', note: 'rhetorical/confirmative — expects "yes you do" or genuine surprise, not new information' },
    { es: 'Hace frío, ¿verdad?', en: "It's cold, isn't it?", register: 'neutral', note: 'a confirmative tag — expects agreement, safe in any setting' }
  ],
  pitfalls: [
    'An echo question is not a request for NEW information — it repeats what was already said, so answering with unrelated new facts misses the point.'
  ],
  examples: [
    { es: '—Me caso el mes que viene. —¿Te casas?', en: "—I'm getting married next month. —You're getting married?" },
    { es: '¿No has visto la última película de Almodóvar?', en: "Haven't you seen Almodóvar's latest film?" },
    { es: '—He dejado el trabajo. —¿Que has dejado el trabajo?', en: "—I've quit my job. —You've quit your job?" }
  ],
  probes: [
    { id: 'p:interrogativosorientados:eco', kind: 'mcq',
      q: '—He comprado un caftán. —¿Un caftán? ¿Qué función tiene esta pregunta?',
      options: ['Pide información nueva', 'Repite lo que sorprendió, pide confirmación', 'Es un examen'], answer: 1 },
    { id: 'p:interrogativosorientados:retorica', kind: 'mcq',
      q: '"¿No conoces a Cristina?" ¿Qué espera el que pregunta?',
      options: ['Información nueva', 'Que digas que sí la conoces', 'Ninguna respuesta'], answer: 1 },
    { id: 'p:interrogativosorientados:cloze', kind: 'cloze',
      text: '—Me caso el mes que viene. —¿___ casas?', accept: ['Te', 'te'] },
    { id: 'p:interrogativosorientados:recall', kind: 'recall',
      front: 'A question that repeats what surprised you, asking for confirmation', back: 'an echo question' }
  ]
},

{
  id: 'dc-negacion-refuerzo-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:75', 'tacticas_pragmaticas:A2:76'],
  title: 'La negación con refuerzo',
  summary: 'Todavía and time expressions like "en toda la semana" only make grammatical sense in a negative sentence — used in an affirmative one, they simply do not work, unlike English "still" or "all week" which are neutral either way.',
  sections: [
    { h: 'Negative-only expressions', html: '<i>*Juan ha llegado todavía</i> and <i>*Ha venido por aquí en toda la semana</i> are simply ungrammatical — these expressions require a negative verb, unlike English "still" or "all week", which work in either polarity.' },
    { h: 'The same class', html: '<i>nunca</i>, <i>jamás</i>, <i>en mi vida</i>, <i>en absoluto</i> and <i>ni siquiera</i> behave the same way: they reinforce a negative and cannot stand in an affirmative sentence.' },
    { h: 'Two negatives are required, not forbidden', html: 'When the reinforcing word comes AFTER the verb, Spanish needs <i>no</i> as well: <i>No he visto nunca ese programa</i>. Move it in front and the <i>no</i> disappears: <i>Nunca he visto ese programa</i>. Both are correct; <i>*He visto nunca</i> is not.' }
  ],
  exponents: [
    { es: 'Juan no ha llegado todavía.', en: "Juan hasn't arrived yet.", register: 'neutral', note: 'todavía + negative — the only grammatical order here' },
    { es: 'No ha venido por aquí en toda la semana.', en: "He hasn't been by here all week.", register: 'coloquial', note: 'en toda la semana forces a negative reading' },
    { es: 'Cecilia no ha estado aquí en diez años.', en: "Cecilia hasn't been here in ten years.", register: 'neutral' }
  ],
  pitfalls: [
    'Do not translate English "still" directly into <i>todavía</i> in an affirmative sentence — <i>*ha llegado todavía</i> is not natural Spanish.'
  ],
  examples: [
    { es: 'No he terminado todavía.', en: "I haven't finished yet." },
    { es: 'No ha llovido en todo el mes.', en: "It hasn't rained all month." },
    { es: 'No la he visto en dos años.', en: "I haven't seen her in two years." }
  ],
  probes: [
    { id: 'p:negacionrefuerzo:gramatical', kind: 'mcq',
      q: '¿Cuál es gramatical?',
      options: ['Juan ha llegado todavía.', 'Juan no ha llegado todavía.', 'Juan todavía ha llegado.'], answer: 1 },
    { id: 'p:negacionrefuerzo:tiempo', kind: 'mcq',
      q: '"No ha venido por aquí ___ la semana." (refuerzo de la negación)',
      options: ['toda', 'todavía', 'nunca'], answer: 0 },
    { id: 'p:negacionrefuerzo:cloze', kind: 'cloze',
      text: 'No he terminado ___.', accept: ['todavía'] },
    { id: 'p:negacionrefuerzo:recall', kind: 'recall',
      front: 'Unlike English "still", todavía in this pattern requires what?', back: 'a negative verb' }
  ]
},

{
  id: 'dc-atenuacion-acto-indirecto-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:96', 'tacticas_pragmaticas:A2:97', 'tacticas_pragmaticas:A2:98'],
  title: 'Actos de habla indirectos',
  summary: 'A command dressed as a question ("¿me das el pan?"), or as a plain statement of fact ("aquí hace frío"), is often more polite than the direct version — the listener has to infer what you want, which itself is the courtesy.',
  sections: [
    { h: 'A statement that means a request', html: '<i>Aquí hace frío</i> says nothing about what you want directly — it reports a fact and trusts the listener to draw the obvious conclusion.' },
    { h: 'Imperatives that stopped being commands', html: '<i>Perdona/e</i> is grammatically an imperative ("forgive me") but functions purely as a courtesy word now — nobody hears it as an actual instruction.' }
  ],
  exponents: [
    { es: '¿Me das el pan?', en: 'Can you pass the bread?', register: 'coloquial', note: 'grammatically a question, functionally a command' },
    { es: 'Aquí hace frío.', en: "It's cold in here.", register: 'neutral', note: 'a statement of fact, functioning as a request to close a window or turn up the heat' },
    { es: 'Perdona.', en: 'Excuse me.', register: 'coloquial', note: 'a lexicalized imperative — no longer really a command, just a courtesy formula' }
  ],
  pitfalls: [
    'These indirect forms only work because the listener infers the real intent — in a context where the inference is not obvious, they can simply be misunderstood as literal statements or questions.'
  ],
  examples: [
    { es: '¿Puedes cerrar la puerta?', en: 'Can you close the door?' },
    { es: 'Esta sopa está un poco sosa.', en: 'This soup is a bit bland.' },
    { es: 'Perdone, ¿le importa moverse un poco?', en: 'Excuse me, would you mind moving over a little?' }
  ],
  probes: [
    { id: 'p:atenuacionactoindirecto:funcion', kind: 'mcq',
      q: '"¿Me das el pan?" ¿Qué es, gramaticalmente y funcionalmente?',
      options: ['Pregunta real', 'Pregunta con función de orden', 'Oferta'], answer: 1 },
    { id: 'p:atenuacionactoindirecto:aseveracion', kind: 'mcq',
      q: '"Aquí hace frío" dicho al lado de una ventana abierta. ¿Qué pide realmente?',
      options: ['Información sobre el clima', 'Que cierren la ventana', 'Que se vayan'], answer: 1 },
    { id: 'p:atenuacionactoindirecto:cloze', kind: 'cloze',
      text: '¿___ das el pan?', accept: ['Me', 'me'] },
    { id: 'p:atenuacionactoindirecto:recall', kind: 'recall',
      front: 'A statement of fact used to make an indirect request', back: 'aseveración (e.g. "aquí hace frío")' }
  ]
},

{
  id: 'dc-atenuacion-1apersona-a2', strand: 'discourse', cefr: 'A2', level: 2, theme: null,
  pcic: ['tacticas_pragmaticas:A2:93', 'tacticas_pragmaticas:A2:94'],
  title: 'Atenuación: impersonal se y hay',
  summary: 'Two impersonal structures let you make a request or give an order without naming yourself as the one asking, or the listener as the one being told — "se" hides the asker, "hay que" hides the target of the obligation.',
  sections: [
    { h: 'Se hides the speaker', html: 'Asking <i>¿Yo puedo pasar?</i> centers yourself; <i>¿Se puede pasar?</i> asks the same thing through an impersonal structure, less exposed.' },
    { h: 'Hay que hides the target', html: '<i>Tú tienes que estudiar más</i> points at the listener; <i>Hay que estudiar más</i> states the same obligation as a general rule aimed at no one in particular.' }
  ],
  exponents: [
    { es: '¿Se puede?', en: 'May I? (literally: can one?)', register: 'formal', note: 'se — softens "can I" by removing "yo" entirely' },
    { es: '¿Se puede pasar?', en: 'May I come in?', register: 'formal' },
    { es: 'Hay que estudiar más.', en: 'One needs to study more.', register: 'neutral', note: 'hay que — softens an order by naming no target' },
    { es: 'Hay que llevar corbata.', en: 'A tie is required.', register: 'neutral', note: 'states a rule with no one singled out' }
  ],
  pitfalls: [
    'These impersonal forms do not change the actual meaning or urgency — they only remove the explicit "yo" or "tú", making the same request or order less pointed.'
  ],
  examples: [
    { es: '¿Se puede fumar aquí?', en: 'Is smoking allowed here?' },
    { es: 'Hay que llegar puntual.', en: 'One must arrive on time.' },
    { es: 'Aquí no se puede aparcar.', en: "You can't park here." }
  ],
  probes: [
    { id: 'p:atenuacion1a2:se', kind: 'mcq',
      q: '¿Cuál pide permiso sin nombrarte a ti mismo?',
      options: ['¿Yo puedo pasar?', '¿Se puede pasar?', '¿Puedo yo pasar?'], answer: 1 },
    { id: 'p:atenuacion1a2:hayque', kind: 'mcq',
      q: '¿Cuál da una orden SIN señalar directamente al oyente?',
      options: ['Tienes que estudiar más.', 'Hay que estudiar más.', 'Estudia más.'], answer: 1 },
    { id: 'p:atenuacion1a2:cloze', kind: 'cloze',
      text: '___ que llevar corbata.', accept: ['Hay', 'hay'] },
    { id: 'p:atenuacion1a2:recall', kind: 'recall',
      front: 'Impersonal word that softens a request by removing "yo" entirely', back: 'se' }
  ]
},

/* ============================================================================
 * BATCH 6 — seq 208-211 of spec/syllabus-draft.json (A2 genre). Finishes A2.
 * Same harvester duplicate-id bug as the A1 genre range: 208/211 are both
 * "generos-de-transmision-escrita" (two adjacent PCIC sections cataloging
 * the same short written text types) and 209/210 both "generos-de-
 * transmision-oral". Consolidated: the written catalogs merge into one
 * lesson (gn-generos-escritos-a2, like its A1 counterpart); the oral catalog
 * is mostly conversation types already covered by function lessons
 * (transactional shopping, phone calls), so only its two genuinely new,
 * genre-shaped items become their own lessons: giving instructions, and a
 * short public presentation.
 * ========================================================================== */
{
  id: 'gn-generos-escritos-a2', strand: 'genre', cefr: 'A2', level: 2, theme: null,
  pcic: ['generos_discursivos:A2:67', 'generos_discursivos:A2:76', 'generos_discursivos:A2:77',
         'generos_discursivos:A2:78', 'generos_discursivos:A2:82', 'generos_discursivos:A2:83', 'generos_discursivos:A2:86'],
  title: 'Textos breves de cada día (A2)',
  summary: 'A2 extends the A1 catalog of short texts with genres that carry more running prose — a horoscope, a weather report, a short news item, a recipe — each still built to be skimmed for its one relevant piece, not read start to finish like a story.',
  sections: [
    { h: 'More prose, same shape', html: "A2 texts (horóscopos, recetas, noticias) have more connected sentences than A1's bare lists and forms, but they still follow a predictable shape you can exploit — a recipe lists ingredients then steps, a horoscope is one paragraph per sign, a weather report follows the days of the week." },
    { h: 'Predictable, not surprising', html: 'These genres are chosen specifically because they are predictable — you already know roughly what a job advert or a weather forecast will say before you read it, which is what lets you read fast.' }
  ],
  moves: [
    { h: 'Anticipar el contenido', html: 'Antes de leer, predice qué va a decir el texto según su tipo: una receta tendrá ingredientes y pasos; un horóscopo, predicciones por signo.' },
    { h: 'Leer solo tu parte', html: 'En un horóscopo, lees solo tu signo. En una receta, si ya sabes cocinar, saltas a los pasos. No hace falta leer género por género.' }
  ],
  model: {
    title: 'Horóscopo: Piscis',
    text: 'Esta semana viene cargada de energía positiva. En el trabajo, es un buen momento para proponer nuevas ideas: alguien importante te va a escuchar. En el amor, si tienes pareja, dedícale más tiempo; si estás soltero, es posible que conozcas a alguien interesante en una reunión con amigos. Cuida tu salud: duerme al menos ocho horas y bebe mucha agua.'
  },
  checklist: [
    '¿Identificaste el tipo de texto antes de leer?',
    '¿Leíste solo la parte que te interesaba (tu signo, la sección relevante)?'
  ],
  examples: [
    { es: 'Mañana, temperaturas suaves y algo de sol por la tarde.', en: 'Tomorrow, mild temperatures and some sun in the afternoon.' },
    { es: 'Se busca camarero con experiencia. Jornada completa.', en: 'Waiter wanted with experience. Full time.' },
    { es: 'Añade la cebolla y sofríe cinco minutos.', en: 'Add the onion and fry for five minutes.' }
  ],
  probes: [
    { id: 'p:generosescritosa2:predecir', kind: 'mcq',
      q: 'Vas a leer una receta. ¿Qué esperas encontrar?',
      options: ['Ingredientes y pasos', 'Un horóscopo', 'Una oferta de trabajo'], answer: 0 },
    { id: 'p:generosescritosa2:tuparte', kind: 'mcq',
      q: 'Lees un horóscopo. ¿Qué parte necesitas leer?',
      options: ['Todos los signos', 'Solo tu signo', 'Solo el título'], answer: 1 },
    { id: 'p:generosescritosa2:cloze', kind: 'cloze',
      text: 'Añade la cebolla y ___ cinco minutos.', accept: ['sofríe'] },
    { id: 'p:generosescritosa2:recall', kind: 'recall',
      front: 'Why are genres like horoscopes and job ads good for fast reading?', back: 'they are predictable — you already know roughly what they will say' }
  ]
},

{
  id: 'gn-instrucciones-a2', strand: 'genre', cefr: 'A2', level: 2, theme: null,
  pcic: ['generos_discursivos:A2:55'],
  title: 'Dar instrucciones breves',
  summary: 'Instructions have their own shape: a short setup naming the goal, then steps in strict order, almost always in the imperative — skipping the order or mixing tenses turns clear instructions into a puzzle.',
  sections: [
    { h: 'Order is the content', html: 'Unlike a story, where you can often reorder events for effect, instructions have exactly one correct order — the sequencing markers (primero, luego, después, por último) are not decoration, they carry the instruction itself.' },
    { h: 'The imperative default', html: 'Instructions default to the imperative (<i>Aprieta, gira, añade</i>) — tú or usted depending on who you are instructing, consistent throughout, not mixed mid-text.' }
  ],
  moves: [
    { h: 'Objetivo', html: 'Una frase breve que dice qué se va a conseguir: "Para encender la lavadora..."' },
    { h: 'Pasos en orden', html: 'Cada paso, uno detrás de otro, con marcadores de secuencia y verbos en imperativo.' }
  ],
  model: {
    title: 'Cómo usar la cafetera',
    text: 'Para hacer un café, sigue estos pasos. Primero, llena el depósito de agua. Luego, pon el café molido en el filtro. Después, coloca la jarra en su sitio y enciende la máquina. Por último, espera dos minutos y ya puedes servir el café.'
  },
  checklist: [
    '¿Dijiste el objetivo antes de los pasos?',
    '¿Usaste marcadores de secuencia y el imperativo de forma consistente?'
  ],
  examples: [
    { es: 'Primero, abre la aplicación.', en: 'First, open the app.' },
    { es: 'Aprieta el botón rojo durante tres segundos.', en: 'Press the red button for three seconds.' },
    { es: 'Por último, guarda los cambios.', en: 'Finally, save the changes.' }
  ],
  probes: [
    { id: 'p:instruccionesa2:orden', kind: 'mcq',
      q: '¿Qué pasa si cambias el orden de los pasos en unas instrucciones?',
      options: ['Nada, el orden no importa', 'Pueden dejar de funcionar', 'Suena más formal'], answer: 1 },
    { id: 'p:instruccionesa2:modo', kind: 'mcq',
      q: '¿Qué modo verbal es el estándar para dar instrucciones?',
      options: ['Indicativo', 'Imperativo', 'Subjuntivo'], answer: 1 },
    { id: 'p:instruccionesa2:cloze', kind: 'cloze',
      text: '___, llena el depósito de agua.', accept: ['Primero', 'primero'] },
    { id: 'p:instruccionesa2:recall', kind: 'recall',
      front: 'What do sequencing markers (primero, luego...) carry in an instruction text?', back: 'part of the instruction itself, not just decoration' }
  ]
},

{
  id: 'gn-presentacion-publica-a2', strand: 'genre', cefr: 'A2', level: 2, theme: null,
  pcic: ['generos_discursivos:A2:56'],
  title: 'Una presentación pública breve',
  summary: 'A short presentation on a familiar topic has three moves that almost never change — introduce the topic, develop two or three points, close — and visual support (a photo, a slide) carries some of the weight so your spoken Spanish does not have to.',
  sections: [
    { h: 'Three moves, reliably', html: 'Introduction, development, closing — almost every short presentation follows this shape, which makes it easy to plan even with limited vocabulary.' },
    { h: 'Let the visual do some work', html: 'A photo or simple slide can carry a name, a place, a number — freeing your spoken Spanish to focus on connecting ideas rather than listing facts.' }
  ],
  moves: [
    { h: 'Introducción', html: 'Presenta el tema en una frase: "Hoy os voy a hablar de..."' },
    { h: 'Desarrollo', html: 'Dos o tres puntos principales, cada uno con una idea clara — no una lista larga de datos.' },
    { h: 'Cierre', html: 'Una frase que resume o cierra: "Y esto es todo lo que quería contaros."' }
  ],
  model: {
    title: 'Mi ciudad',
    text: 'Hoy os voy a hablar de mi ciudad, Valencia. Primero, Valencia está en la costa este de España y tiene un clima muy agradable. Además, es famosa por su comida, especialmente la paella. Por último, tiene una arquitectura muy moderna, como la Ciudad de las Artes y las Ciencias. Y esto es todo lo que quería contaros sobre mi ciudad.'
  },
  checklist: [
    '¿Presentaste el tema con una frase clara al principio?',
    '¿Cerraste la presentación en vez de terminar de repente?'
  ],
  examples: [
    { es: 'Hoy os voy a hablar de mi familia.', en: "Today I'm going to tell you about my family." },
    { es: 'Además, es un lugar muy tranquilo.', en: "Also, it's a very peaceful place." },
    { es: 'Y esto es todo lo que quería contaros.', en: "And that's all I wanted to tell you." }
  ],
  probes: [
    { id: 'p:presentacionpublicaa2:estructura', kind: 'mcq',
      q: '¿Cuáles son las tres partes de una presentación breve?',
      options: ['Introducción, desarrollo, cierre', 'Saludo, pregunta, respuesta', 'Título, imagen, fecha'], answer: 0 },
    { id: 'p:presentacionpublicaa2:visual', kind: 'mcq',
      q: '¿Para qué sirve el apoyo visual en una presentación breve?',
      options: ['Para decorar', 'Para llevar parte de la información y aliviar el español hablado', 'No sirve para nada'], answer: 1 },
    { id: 'p:presentacionpublicaa2:cloze', kind: 'cloze',
      text: 'Hoy os voy a ___ de mi ciudad.', accept: ['hablar'] },
    { id: 'p:presentacionpublicaa2:recall', kind: 'recall',
      front: 'The three reliable moves of a short public presentation', back: 'introducción, desarrollo, cierre' }
  ]
},

/* ---------------------------------------------------------------------------
 * NOTION — A1. Existence and presence. The `notion` strand teaches the
 * LINGUISTIC MEANS for a semantic category (nociones generales), so its
 * exponents are grammatical choices rather than social ones — which is why it
 * carries no register-contrast requirement in data/taxonomy.js.
 * ------------------------------------------------------------------------ */
{
  id: 'nt-existencia-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:1', 'nociones_generales:A1:6', 'nociones_generales:A1:7',
         'nociones_generales:A1:8'],
  title: 'Existencia y presencia: hay, estar, tener',
  summary: 'Spanish splits one English idea — "there is / it is there" — across three verbs, and picks between them by whether the thing is NEW to the conversation or already known. Choosing wrongly is the single most persistent A1 error, and it survives well into B1.',
  sections: [
    { h: 'The rule', html: '<b>hay</b> introduces something for the first time — it is always followed by an indefinite (<i>un</i>, <i>dos</i>, <i>mucha</i>) or nothing at all. <b>está</b> locates something already identified — so it follows <i>el</i>, <i>la</i>, a name or a possessive. New thing → <i>hay</i>. Known thing → <i>está</i>.' },
    { h: 'Why "hay un" but never "hay el"', html: '<i>Hay</i> announces existence, and you cannot announce something the listener already knows about. <i>Hay una farmacia</i> ✓. <i>*Hay la farmacia</i> ✗ — if the pharmacy is already known, you want <i>La farmacia está en esta calle</i>.' },
    { h: 'tener for possession', html: 'Where the existence belongs to somebody, Spanish uses <b>tener</b>: <i>Mi barrio tiene dos farmacias</i> puts the neighbourhood in the subject, <i>En mi barrio hay dos farmacias</i> just reports the fact.' },
    { h: 'con and sin', html: 'Presence and absence of an accompanying thing use <b>con</b> / <b>sin</b>, with no verb at all: <i>Sin azúcar, por favor.</i>' }
  ],
  exponents: [
    { es: 'En mi barrio hay dos farmacias.', en: 'There are two pharmacies in my neighbourhood.', register: 'neutral', note: 'hay + a number: new information' },
    { es: 'Hay mucha gente en la calle.', en: 'There are a lot of people in the street.', register: 'neutral', note: 'hay + quantifier' },
    { es: 'La farmacia está en esta calle.', en: 'The pharmacy is on this street.', register: 'neutral', note: 'estar + definite: already known' },
    { es: 'Luisa no está aquí.', en: "Luisa isn't here.", register: 'neutral', note: 'a named person is always known — never "no hay Luisa"' },
    { es: 'Mi casa tiene tres habitaciones.', en: 'My house has three rooms.', register: 'neutral', note: 'tener: the existence belongs to a possessor' },
    { es: 'Sin azúcar, por favor.', en: 'Without sugar, please.', register: 'neutral', note: 'absence with no verb at all' }
  ],
  contrasts: [
    { es: 'Hay un banco en la plaza.', en: 'There is a bank in the square.', note: 'new — the listener did not know of it' },
    { es: 'El banco está en la plaza.', en: 'The bank is in the square.', note: 'known — we were already talking about the bank' },
    { es: '*Hay el banco en la plaza.', en: '(impossible)', note: 'hay cannot take a definite article' },
    { es: '*No hay Luisa aquí.', en: '(impossible)', note: 'a name is definite — use "Luisa no está aquí"' }
  ],
  pitfalls: [
    '<i>Hay</i> never changes for number: <i>hay una farmacia</i>, <i>hay dos farmacias</i>. Saying <i>*han dos farmacias</i> is a common and very audible error.',
    'Never put a definite article, a name or a possessive after <i>hay</i>. If you can say "the" in English, you want <i>estar</i>.',
    '<i>Hay</i> is impersonal — it has no subject. <i>*Mi barrio hay dos farmacias</i> is wrong; either <i>En mi barrio hay…</i> or <i>Mi barrio tiene…</i>.'
  ],
  examples: [
    { es: '—¿Hay una farmacia por aquí? —Sí, la farmacia está al lado del banco.', en: '—Is there a pharmacy near here? —Yes, the pharmacy is next to the bank.' },
    { es: 'En esta calle no hay ningún restaurante.', en: 'There is no restaurant on this street.' },
    { es: 'Mi habitación tiene una ventana muy grande.', en: 'My room has a very big window.' }
  ],
  probes: [
    { id: 'p:exist:new', kind: 'mcq', q: 'Es la primera vez que lo mencionas: "___ un banco en la plaza."',
      options: ['Hay', 'Está', 'Tiene'], answer: 0 },
    { id: 'p:exist:known', kind: 'mcq', q: 'Ya hablabais del banco: "El banco ___ en la plaza."',
      options: ['hay', 'está', 'tiene'], answer: 1 },
    { id: 'p:exist:name', kind: 'cloze', text: 'Luisa no ___ aquí.', accept: ['está'] },
    { id: 'p:exist:recall', kind: 'recall', front: 'After hay, which article is impossible — el/la or un/una?', back: 'el/la (hay takes only indefinites)' }
  ]
},

/* ---------------------------------------------------------------------------
 * GRAMMAR — A2. Grammar-strand lessons live here alongside the other strands,
 * not in data/grammar.js: js/lessons.js merges STRAND_LESSONS into the
 * syllabus, and this file is where the PCIC tags and probes belong.
 * data/grammar.js keeps only the original hand-written concept lessons.
 * ------------------------------------------------------------------------ */
{
  id: 'gr-demostrativos-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A1:128', 'gramatica:A1:131', 'gramatica:A1:132', 'gramatica:A1:133'],
  title: 'Los demostrativos: este, ese, aquel',
  summary: 'English points twice — this and that. Spanish points three times, and the third one matters: este is near me, ese is near you, aquel is near neither of us. The system tracks the LISTENER, not just distance, which is why choosing by metres alone goes wrong.',
  sections: [
    { h: 'Three distances, not two', html: '<b>este</b> = close to the speaker. <b>ese</b> = close to the person you are talking to. <b>aquel</b> = away from both. In a shop, the shirt in your hand is <i>esta</i>, the one in the assistant\'s hand is <i>esa</i>, the one across the room is <i>aquella</i>.' },
    { h: 'Forms', html: 'Each agrees with its noun: <i>este/esta/estos/estas</i>, <i>ese/esa/esos/esas</i>, <i>aquel/aquella/aquellos/aquellas</i>. They go before the noun: <i>este libro</i>, <i>aquellas casas</i>.' },
    { h: 'The neuter: esto, eso, aquello', html: 'When you do not know what the thing IS, or you are pointing at a whole situation rather than an object, use the invariable neuter: <i>¿Qué es esto?</i>, <i>Eso no es verdad</i>. It has no plural and never takes a noun after it.' }
  ],
  contrasts: [
    { es: 'Este libro es mío.', en: 'This book is mine.', note: 'in my hands' },
    { es: 'Ese libro es interesante.', en: 'That book is interesting.', note: 'in yours, or next to you' },
    { es: 'Aquel libro de allí es muy caro.', en: 'That book over there is very expensive.', note: 'far from us both' },
    { es: '¿Qué es esto?', en: 'What is this?', note: 'neuter — you do not yet know what the thing is, so it has no gender' }
  ],
  pitfalls: [
    'Do not choose by distance alone: <i>ese</i> is about the LISTENER. Something a metre away but next to them is <i>ese</i>, not <i>este</i>.',
    'The neuter forms <i>esto/eso/aquello</i> never take a noun. <i>*esto libro</i> is wrong — once you name the thing you know its gender, so it is <i>este libro</i>.',
    'Spanish no longer writes an accent on éste/ése; modern spelling uses <i>este</i>, <i>ese</i> for both the adjective and the pronoun.'
  ],
  examples: [
    { es: '—¿Cuál prefiere, esta camisa o esa? —Aquella del escaparate.', en: '—Which do you prefer, this shirt or that one? —The one in the window.' },
    { es: 'Esto no me gusta nada.', en: "I don't like this at all." },
    { es: 'En aquella época no había teléfonos móviles.', en: 'In those days there were no mobile phones.' }
  ],
  probes: [
    { id: 'p:dem:listener', kind: 'mcq', q: 'El libro está en las manos de tu interlocutor. ¿Cómo lo llamas?',
      options: ['este libro', 'ese libro', 'aquel libro'], answer: 1 },
    { id: 'p:dem:neuter', kind: 'mcq', q: 'No sabes qué es el objeto. ¿Qué preguntas?',
      options: ['¿Qué es este?', '¿Qué es esto?', '¿Qué es esta?'], answer: 1 },
    { id: 'p:dem:agree', kind: 'cloze', text: '___ casas de allí son muy antiguas. (lejos de los dos)', accept: ['Aquellas', 'aquellas'] },
    { id: 'p:dem:recall', kind: 'recall', front: 'Which demonstrative marks nearness to the LISTENER?', back: 'ese / esa / esos / esas' }
  ]
},

/* ============================================================================
 * BATCH — A1 grammar, seq 1-15 of spec/syllabus-draft.json (skipped: seq 8-9
 * los-demostrativos / los-demostrativos-valores-significado, already taught
 * in full by gr-demostrativos-a2)
 * ========================================================================== */
{
  id: 'gr-nombres-propios-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:1', 'gramatica:A1:2', 'gramatica:A1:4', 'gramatica:A1:5', 'gramatica:A1:9', 'gramatica:A1:10'],
  title: 'Nombres propios: con o sin artículo',
  summary: 'First names, surnames and most country names drop the article a common noun would need — but El Salvador always keeps its own, and there is no rule to guess which countries do: you learn them one by one.',
  sections: [
    { h: 'The default: no article', html: 'First names and surnames stand alone: <i>María vive en España</i>, never <i>*la María vive en *la España</i>. This is the opposite of French or Italian, where the article often survives with a name.' },
    { h: 'The exception that never drops it', html: '<b>El Salvador</b> carries its article everywhere, even mid-sentence with a preposition: <i>Vengo de El Salvador</i>, not <i>*Vengo de Salvador</i>. A handful of other countries traditionally take one too (<i>la India</i>, <i>el Perú</i>), though usage is loosening.' },
    { h: 'Titles bring the article back', html: '<i>Señor/señora</i> + surname takes the article when you talk ABOUT someone in the third person — <i>El señor Fernández no está</i> — but not when you address them directly: <i>Buenos días, señor Fernández.</i>' }
  ],
  contrasts: [
    { es: 'María es profesora.', en: 'María is a teacher.', note: 'no article with a first name' },
    { es: '*La María es profesora.', en: '(wrong)', note: 'this reading is dialectal/colloquial at best, not the neutral standard' },
    { es: 'Vengo de El Salvador.', en: 'I come from El Salvador.', note: 'the one country whose article is never optional' },
    { es: 'El señor Fernández llegó tarde. / Buenos días, señor Fernández.', en: 'Mr Fernández arrived late. / Good morning, Mr Fernández.', note: 'article in third-person reference, none in direct address' }
  ],
  pitfalls: [
    'Never put <i>el/la</i> in front of a bare first name or surname — <i>*la María</i>, <i>*el Fernández</i> are wrong in neutral Spanish.',
    '<i>El Salvador</i> is a name, not "Salvador with an article stuck on" — drop the article and you have named something else entirely.',
    'Title + surname takes the article only when talking about the person, never when speaking to them directly.'
  ],
  examples: [
    { es: 'Antonio trabaja con María en Madrid.', en: 'Antonio works with María in Madrid.' },
    { es: 'Nací en El Salvador y crecí en México.', en: 'I was born in El Salvador and grew up in Mexico.' },
    { es: 'La señora García todavía no ha llegado.', en: 'Mrs García hasn\'t arrived yet.' }
  ],
  probes: [
    { id: 'p:nprop:salvador', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Vengo de Salvador.', 'Vengo de El Salvador.', 'Vengo del Salvador.'], answer: 1 },
    { id: 'p:nprop:nombre', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['La María vive aquí.', 'María vive aquí.', 'Una María vive aquí.'], answer: 1 },
    { id: 'p:nprop:titulo', kind: 'cloze', text: '___ señor Fernández no está en la oficina.', accept: ['El', 'el'] },
    { id: 'p:nprop:recall', kind: 'recall', front: 'The one country whose article is NEVER dropped', back: 'El Salvador' }
  ]
},

{
  id: 'gr-genero-sustantivos-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:19', 'gramatica:A1:21', 'gramatica:A1:22', 'gramatica:A1:24', 'gramatica:A1:25'],
  title: 'El género de los sustantivos',
  summary: '-o is masculine and -a is feminine most of the time, but the pattern breaks often enough — la moto, el día, el mapa — that guessing purely by ending will eventually embarrass you.',
  sections: [
    { h: 'The default pattern', html: 'Most nouns follow <b>-o → masculine</b>, <b>-a → feminine</b>: <i>el libro</i>, <i>la mesa</i>. Consonant endings give no reliable clue by themselves — <i>el árbol</i>, <i>la catedral</i>, <i>el corazón</i>, <i>la solución</i> — so those are learned with their article, though <i>-ción/-sión/-dad/-tud</i> are reliably feminine.' },
    { h: 'The famous exceptions', html: '<i>La moto</i>, <i>la foto</i>, <i>la radio</i> LOOK masculine but are feminine — they are shortened forms of longer feminine words (<i>motocicleta</i>, <i>fotografía</i>, <i>radiodifusión</i>) and keep the original gender. <i>El día</i>, <i>el mapa</i>, <i>el planeta</i> go the other way: Greek-origin words in <i>-ma</i> that look feminine but are masculine.' },
    { h: 'Heteronimia: a completely different word', html: 'Some pairs mark gender with an entirely different word rather than a changed ending: <i>el hombre / la mujer</i>, <i>el padre / la madre</i>, <i>el toro / la vaca</i>.' }
  ],
  contrasts: [
    { es: 'el libro / la mesa', en: 'the book / the table', note: 'the reliable -o/-a default' },
    { es: 'la moto, la foto, la radio', en: 'the motorbike, the photo, the radio', note: 'look masculine, are feminine — shortened from feminine words' },
    { es: 'el día, el mapa, el planeta', en: 'the day, the map, the planet', note: 'look feminine, are masculine — Greek -ma origin' },
    { es: 'el hombre / la mujer', en: 'the man / the woman', note: 'heteronimia: a different word entirely, not a changed ending' }
  ],
  pitfalls: [
    '<i>La moto/foto/radio</i> is one of the first things learners get wrong the OTHER way, saying <i>*el moto</i> — memorize this trio as exceptions.',
    'Words in <i>-ma</i> of Greek origin (<i>el problema, el tema, el programa, el sistema</i>) are masculine despite ending in -a.',
    'A consonant ending tells you nothing reliable except for the endings <i>-ción/-sión/-dad/-tud</i>, which are always feminine.'
  ],
  examples: [
    { es: 'Vino en moto y sacó una foto del mapa.', en: 'He came by motorbike and took a photo of the map.' },
    { es: 'El problema tiene una solución sencilla.', en: 'The problem has a simple solution.' },
    { es: 'Mi padre y mi madre viven en Sevilla.', en: 'My father and mother live in Seville.' }
  ],
  probes: [
    { id: 'p:gensus:moto', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['el moto', 'la moto', 'los motos'], answer: 1 },
    { id: 'p:gensus:dia', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['la día', 'el día', 'los día'], answer: 1 },
    { id: 'p:gensus:cloze', kind: 'cloze', text: 'Tengo un problema con ___ programa.', accept: ['el'] },
    { id: 'p:gensus:recall', kind: 'recall', front: 'Three feminine nouns that look masculine (end in -o)', back: 'la moto, la foto, la radio' }
  ]
},

{
  id: 'gr-numero-sustantivos-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:37', 'gramatica:A1:38', 'gramatica:A1:39', 'gramatica:A1:40', 'gramatica:A1:41'],
  title: 'El plural de los sustantivos',
  summary: 'Spanish pluralizes by ending: a vowel just takes -s, a consonant needs the fuller -es, and a word already stressed on its last syllable needs both -es and a spelling adjustment.',
  sections: [
    { h: 'Vowel-final: add -s', html: '<i>mesa → mesas</i>, <i>libro → libros</i>, <i>café → cafés</i>. This is the large majority of Spanish nouns.' },
    { h: 'Consonant-final: add -es', html: '<i>hotel → hoteles</i>, <i>ciudad → ciudades</i>, <i>reloj → relojes</i>. Adding a bare -s here (<i>*hotels</i>) is the single most common plural error at this level.' },
    { h: 'Stressed on the last syllable: also -es', html: 'A word ending in a stressed vowel + consonant, or a one-syllable word ending in a consonant, still takes <i>-es</i> and drops its written accent because the stress no longer falls on the last syllable: <i>autobús → autobuses</i>, <i>inglés → ingleses</i>, <i>francés → franceses</i>.' }
  ],
  contrasts: [
    { es: 'la mesa / las mesas', en: 'the table(s)', note: 'vowel + s' },
    { es: 'el hotel / los hoteles', en: 'the hotel(s)', note: 'consonant + es, never bare -s' },
    { es: 'el autobús / los autobuses', en: 'the bus(es)', note: 'stressed final syllable: +es, accent drops' },
    { es: 'el inglés / los ingleses', en: 'the English person / people', note: 'same pattern with a nationality' }
  ],
  pitfalls: [
    'A consonant-final noun always takes the full <i>-es</i>, never a bare <i>-s</i>: <i>hoteles</i>, not <i>*hotels</i>.',
    'Words like <i>autobús</i> and <i>inglés</i> lose their written accent in the plural, because <i>-es</i> adds a syllable and the stress is no longer on the last one.',
    '<i>Lápiz → lápices</i>: a final <i>-z</i> becomes <i>-c</i> before adding <i>-es</i>, a spelling rule, not an exception to the pattern.'
  ],
  examples: [
    { es: 'Compré dos billetes de autobús para los ingleses.', en: 'I bought two bus tickets for the English people.' },
    { es: 'Hay tres hoteles cerca de la estación.', en: 'There are three hotels near the station.' },
    { es: 'Necesito dos lápices y una goma.', en: 'I need two pencils and an eraser.' }
  ],
  probes: [
    { id: 'p:numsus:hotel', kind: 'mcq', q: 'Plural de "hotel":',
      options: ['hotels', 'hoteles', 'hotele'], answer: 1 },
    { id: 'p:numsus:autobus', kind: 'mcq', q: 'Plural de "autobús":',
      options: ['autobuses', 'autobúses', 'autobuss'], answer: 0 },
    { id: 'p:numsus:cloze', kind: 'cloze', text: 'Plural de "lápiz": lápi___', accept: ['ces'] },
    { id: 'p:numsus:recall', kind: 'recall', front: 'A word ending in a consonant takes which plural ending?', back: '-es (never bare -s)' }
  ]
},

{
  id: 'gr-adjetivos-calificativos-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:45', 'gramatica:A1:46', 'gramatica:A1:47'],
  title: 'Adjetivos calificativos',
  summary: 'A descriptive adjective can sit right after its noun or, with ser, stand on its own as the predicate — and unlike a possessive, the article lets it stand completely alone, meaning "the [adjective] one."',
  sections: [
    { h: 'Two positions, one meaning', html: 'As a complement it follows the noun directly: <i>el chico guapo</i>. As the attribute of <i>ser</i>, it stands after the verb: <i>El chico es guapo</i>. Both describe the same quality.' },
    { h: 'The article can carry it alone', html: 'Because <i>el/la</i> already marks gender and number, you can drop the noun and keep just the adjective: <i>el guapo</i> means "the handsome one." A possessive cannot do this — <i>*mi guapo</i> is not a way to say "my handsome one"; you must keep the noun: <i>mi hijo guapo</i>.' },
    { h: 'Superlatives', html: 'The absolute superlative adds <i>-ísimo/-ísima</i>: <i>guapo → guapísimo</i>. <i>Muy</i> + adjective does the same job less formally: <i>muy guapo</i>.' }
  ],
  contrasts: [
    { es: 'el chico guapo', en: 'the handsome boy', note: 'adjective as noun complement' },
    { es: 'El chico es guapo.', en: 'The boy is handsome.', note: 'adjective as the attribute of ser' },
    { es: 'el guapo', en: 'the handsome one', note: 'article alone can carry the adjective — the noun is understood' },
    { es: '*mi guapo', en: '(impossible for "my handsome one")', note: 'a possessive cannot drop the noun the way an article can' }
  ],
  pitfalls: [
    'An article can stand in for a dropped noun (<i>el guapo</i>); a possessive cannot — keep the noun after a possessive.',
    '<i>Guapísimo</i> and <i>muy guapo</i> say the same thing at different registers; do not combine them (<i>*muy guapísimo</i>).',
    'Adjective and noun must agree in gender and number even across the verb <i>ser</i>: <i>La chica es guapa</i>, not <i>*guapo</i>.'
  ],
  examples: [
    { es: 'Mi hermana es muy inteligente.', en: 'My sister is very intelligent.' },
    { es: 'De los dos jerséis, prefiero el rojo.', en: 'Of the two sweaters, I prefer the red one.' },
    { es: 'Es un restaurante carísimo.', en: 'It\'s a really expensive restaurant.' }
  ],
  probes: [
    { id: 'p:adjcal:articulo', kind: 'mcq', q: '"De los dos coches, me gusta ___." (el rojo, not mentioning "coche" again)',
      options: ['mi rojo', 'el rojo', 'un rojo'], answer: 1 },
    { id: 'p:adjcal:agree', kind: 'mcq', q: '"Mi hermana es muy ___." (intelligent, feminine)',
      options: ['inteligento', 'inteligente', 'inteligenta'], answer: 1 },
    { id: 'p:adjcal:cloze', kind: 'cloze', text: 'Es un restaurante car___. (very expensive, absolute superlative)', accept: ['ísimo'] },
    { id: 'p:adjcal:recall', kind: 'recall', front: 'What can stand in for a dropped noun that a possessive cannot?', back: 'the article (el/la + adjective)' }
  ]
},

{
  id: 'gr-genero-adjetivo-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:50', 'gramatica:A1:51', 'gramatica:A1:52', 'gramatica:A1:53'],
  title: 'El género del adjetivo',
  summary: 'Most adjectives change for gender only if they end in -o; a consonant-ending adjective is normally invariable — except a nationality adjective, which always marks feminine even starting from a consonant.',
  sections: [
    { h: 'The -o/-a pattern', html: 'Adjectives ending in <i>-o</i> change to <i>-a</i> for feminine: <i>alto → alta</i>, <i>bonito → bonita</i>.' },
    { h: 'Consonant endings: usually invariable', html: 'An adjective ending in a consonant is normally the SAME for both genders: <i>feliz</i>, <i>azul</i>, <i>joven</i> — <i>un hombre feliz</i>, <i>una mujer feliz</i>.' },
    { h: 'The exception: nationality', html: 'Gentilicios (nationality/origin adjectives) break the invariable-consonant rule and add <i>-a</i> for feminine even from a consonant: <i>español → española</i>, <i>alemán → alemana</i>, <i>francés → francesa</i>.' }
  ],
  contrasts: [
    { es: 'un chico alto / una chica alta', en: 'a tall boy / a tall girl', note: '-o/-a pattern' },
    { es: 'un hombre feliz / una mujer feliz', en: 'a happy man / a happy woman', note: 'consonant ending: invariable' },
    { es: 'un chico español / una chica española', en: 'a Spanish boy / a Spanish girl', note: 'gentilicio breaks the invariable-consonant rule' },
    { es: 'un profesor alemán / una profesora alemana', en: 'a German (male/female) teacher', note: 'same exception, and loses its accent once -a is added' }
  ],
  pitfalls: [
    'Do not add <i>-a</i> to a regular consonant-ending adjective: <i>*feliza</i>, <i>*azula</i> are wrong.',
    'DO add <i>-a</i> to a nationality adjective from a consonant: <i>español/española</i>, <i>alemán/alemana</i> — this is the one systematic exception.',
    'Nationality adjectives ending in an accented vowel + consonant (<i>alemán, francés</i>) lose the written accent once <i>-a</i> is added: <i>alemana</i>, not <i>*alemána</i>.'
  ],
  examples: [
    { es: 'Mi vecina es una mujer muy feliz.', en: 'My neighbour is a very happy woman.' },
    { es: 'La profesora es alemana y el profesor es francés.', en: 'The teacher (f) is German and the teacher (m) is French.' },
    { es: 'Tiene los ojos azules y el pelo corto.', en: 'She has blue eyes and short hair.' }
  ],
  probes: [
    { id: 'p:genadj:invar', kind: 'mcq', q: '"Mi vecina es muy ___." (happy)',
      options: ['feliza', 'feliz', 'felizo'], answer: 1 },
    { id: 'p:genadj:gentilicio', kind: 'mcq', q: '"La profesora es ___." (German, feminine)',
      options: ['alemán', 'alemana', 'alemano'], answer: 1 },
    { id: 'p:genadj:cloze', kind: 'cloze', text: 'Ella es franc___. (French, feminine)', accept: ['esa'] },
    { id: 'p:genadj:recall', kind: 'recall', front: 'Which type of consonant-ending adjective DOES change for feminine?', back: 'gentilicios (nationality: español/española, alemán/alemana)' }
  ]
},

{
  id: 'gr-articulo-definido-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:72', 'gramatica:A1:74', 'gramatica:A1:75', 'gramatica:A1:78', 'gramatica:A1:80', 'gramatica:A1:81'],
  title: 'El artículo definido: distribución',
  summary: 'El/la/los/las sits at the very front of its noun phrase, which is exactly why it can never appear next to a possessive or demonstrative — Spanish allows only one "pointer" at the front at a time.',
  sections: [
    { h: 'Front of the phrase, and alone there', html: 'The definite article opens its noun phrase and cannot share that position with a possessive or demonstrative: <i>*el mi hermana</i>, <i>*la este libro</i> are both impossible. Spanish uses either the article or the possessive/demonstrative, never both.' },
    { h: 'Contractions are obligatory', html: '<i>a + el → al</i>, <i>de + el → del</i>, with no exception: <i>Voy al banco</i>, <i>Vengo del trabajo</i>. This does not apply when "El" is part of a proper name: <i>Voy a El Salvador</i>, not <i>*Voy al Salvador</i>.' },
    { h: 'Required before gustar-type nouns', html: 'Where English uses a bare noun, Spanish keeps the article: <i>Me gusta LA paella</i>, not <i>*Me gusta paella</i>. Dropping the article here is a very visible learner error.' }
  ],
  contrasts: [
    { es: 'mi hermana', en: 'my sister', note: 'possessive alone, no article' },
    { es: '*el mi hermana', en: '(impossible)', note: 'article and possessive never combine' },
    { es: 'Voy al banco. / Voy a El Salvador.', en: 'I\'m going to the bank. / I\'m going to El Salvador.', note: 'contraction is obligatory, except when El is part of a name' },
    { es: 'Me gusta la paella.', en: 'I like paella.', note: 'Spanish keeps the article where English drops it' }
  ],
  pitfalls: [
    'Never combine the definite article with a possessive or demonstrative — pick one pointer, not two.',
    '<i>a + el</i> and <i>de + el</i> ALWAYS contract to <i>al/del</i>, except when "El" opens a proper name like El Salvador or El Cairo.',
    'Do not drop the article before a noun after <i>gustar</i>-type verbs just because English would: <i>me gusta el chocolate</i>, not <i>*me gusta chocolate</i>.'
  ],
  examples: [
    { es: 'Vamos al cine y luego al restaurante.', en: 'We\'re going to the cinema and then to the restaurant.' },
    { es: 'Vengo del trabajo cansadísimo.', en: 'I\'m coming from work absolutely exhausted.' },
    { es: 'A los niños les gusta el chocolate.', en: 'The children like chocolate.' }
  ],
  probes: [
    { id: 'p:artdef:combina', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['el mi libro', 'mi libro', 'el mi el libro'], answer: 1 },
    { id: 'p:artdef:contrae', kind: 'mcq', q: '"Vengo ___ trabajo."',
      options: ['de el', 'del', 'de al'], answer: 1 },
    { id: 'p:artdef:gustar', kind: 'cloze', text: 'Me gusta ___ chocolate.', accept: ['el'] },
    { id: 'p:artdef:recall', kind: 'recall', front: 'Which two prepositions ALWAYS contract with "el"?', back: 'a (→al) and de (→del)' }
  ]
},

{
  id: 'gr-articulo-indefinido-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:99', 'gramatica:A1:101', 'gramatica:A1:104', 'gramatica:A1:105'],
  title: 'El artículo indefinido: un, una, unos, unas',
  summary: 'Un/una introduces something for the first time — which is exactly why it refuses to appear next to a demonstrative or a numeral: those already do the "pointing out" job themselves.',
  sections: [
    { h: 'First mention', html: '<i>Un/una/unos/unas</i> presents something the listener does not yet know about: <i>Hay un banco en la plaza</i>. Once it is known, later mentions switch to the definite article: <i>El banco cierra a las ocho</i>.' },
    { h: 'Incompatible with other pointers', html: 'A demonstrative or numeral already identifies which thing you mean, so the indefinite article cannot stack with them: <i>*un este libro</i>, <i>*un dos libros</i> are both wrong.' },
    { h: 'Not with proper nouns', html: 'Because a name is already unique, it does not take <i>un/una</i> in its ordinary use: <i>*Vive en una España</i> is wrong (though <i>un Madrid distinto</i> — "a different Madrid" — is possible as a figurative, reinterpreted use).' }
  ],
  contrasts: [
    { es: 'Hay un banco en la plaza.', en: 'There is a bank in the square.', note: 'first mention, new information' },
    { es: 'El banco cierra a las ocho.', en: 'The bank closes at eight.', note: 'now known — definite article' },
    { es: '*un este libro / *un dos libros', en: '(both impossible)', note: 'indefinite article cannot combine with a demonstrative or numeral' },
    { es: 'Tengo dos hermanos.', en: 'I have two brothers.', note: 'the numeral alone already does the job an indefinite article would' }
  ],
  pitfalls: [
    'Never stack <i>un/una</i> with a demonstrative or a numeral — choose one.',
    'A first mention needs the indefinite article; a second mention of the same thing switches to the definite article.',
    'Proper nouns do not normally take <i>un/una</i> — a name is already unique enough.'
  ],
  examples: [
    { es: '—¿Hay una farmacia cerca? —Sí, hay una farmacia en esta calle.', en: '—Is there a pharmacy nearby? —Yes, there\'s a pharmacy on this street.' },
    { es: 'Tengo tres hermanas y un hermano.', en: 'I have three sisters and one brother.' },
    { es: 'Vi una película anoche; la película era muy larga.', en: 'I saw a film last night; the film was very long.' }
  ],
  probes: [
    { id: 'p:artindef:mencion', kind: 'mcq', q: 'Primera mención: "Hay ___ banco en la plaza."',
      options: ['el', 'un', 'este'], answer: 1 },
    { id: 'p:artindef:segunda', kind: 'mcq', q: 'Segunda mención, ya conocido: "___ banco cierra a las ocho."',
      options: ['Un', 'El', 'Unos'], answer: 1 },
    { id: 'p:artindef:numeral', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['un dos libros', 'dos libros', 'unos dos libros de'], answer: 1 },
    { id: 'p:artindef:recall', kind: 'recall', front: 'A NEW thing gets which article? A KNOWN thing gets which?', back: 'indefinite (un/una) for new; definite (el/la) once known' }
  ]
},

{
  id: 'gr-posesivos-distribucion-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:148', 'gramatica:A1:149', 'gramatica:A1:150', 'gramatica:A1:151'],
  title: 'Los posesivos átonos: dónde van',
  summary: 'Mi, tu, su and the rest of the short possessives must sit glued to the front of their noun — unlike English "mine," they can never stand alone, so asking whose something is takes a completely different question.',
  sections: [
    { h: 'Always in front, never after', html: 'The short possessive comes immediately before its noun: <i>mi libro</i>, never <i>*libro mi</i>.' },
    { h: 'Cannot stand alone', html: 'English "mine" needs no noun. Spanish\'s short possessive always does — you cannot say <i>*es mi</i> to mean "it\'s mine." Asking whose something is uses a different construction entirely: <i>¿De quién es esto?</i>' },
    { h: 'One pointer, not two', html: 'Because the possessive already sits at the front, it cannot combine with the article there too: <i>mi camisa</i>, never <i>*la mi camisa</i>. An adjective can still follow the noun without trouble: <i>mi camisa roja</i>.' }
  ],
  contrasts: [
    { es: 'mi libro', en: 'my book', note: 'possessive immediately before the noun' },
    { es: '*libro mi', en: '(impossible)', note: 'never after the noun' },
    { es: '—¿De quién es este libro? —Es mío.', en: '—Whose book is this? —It\'s mine.', note: 'a DIFFERENT (tonic) form is used to stand alone — see the next lesson' },
    { es: 'mi camisa roja', en: 'my red shirt', note: 'possessive + noun + adjective is fine; possessive + article is not' }
  ],
  pitfalls: [
    'The short possessive can never follow its noun and can never stand completely alone the way English "mine" does.',
    'To ask whose something is, use <i>¿De quién es…?</i>, not a literal translation of "whose."',
    'Never combine the article with a possessive: <i>mi libro</i>, not <i>*el mi libro</i>.'
  ],
  examples: [
    { es: '¿Dónde está mi teléfono?', en: 'Where is my phone?' },
    { es: '—¿De quién son estas llaves? —Son mías.', en: '—Whose keys are these? —They\'re mine.' },
    { es: 'Nuestra casa tiene un jardín pequeño.', en: 'Our house has a small garden.' }
  ],
  probes: [
    { id: 'p:posdis:orden', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['libro mi', 'mi libro', 'el mi libro'], answer: 1 },
    { id: 'p:posdis:cuyo', kind: 'mcq', q: '"¿___ es este libro?" (asking whose)',
      options: ['Cuyo', 'De quién', 'Quién'], answer: 1 },
    { id: 'p:posdis:cloze', kind: 'cloze', text: '¿Dónde está ___ teléfono?', accept: ['mi'] },
    { id: 'p:posdis:recall', kind: 'recall', front: 'How do you ask whose something is in Spanish?', back: '¿De quién es...?' }
  ]
},

{
  id: 'gr-posesivos-forma-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:143', 'gramatica:A1:144', 'gramatica:A1:145', 'gramatica:A1:146'],
  title: 'Los posesivos: formas',
  summary: 'Mi/tu/su only ever mark whether there is one owned thing or several — for the NUMBER OF OWNERS you need nuestro/vuestro\'s fuller forms, and su alone cannot tell you if the owner is one person or a crowd.',
  sections: [
    { h: 'mi, tu, su: agree only with what is owned', html: 'These change for the number of the thing owned, never for gender: <i>mi libro / mis libros</i>, <i>tu casa / tus casas</i>. They stay the same whether one person owns it or several — <i>su casa</i> could be his, hers, yours (usted), or theirs.' },
    { h: 'nuestro, vuestro: agree for gender AND number', html: 'These mark that the OWNER is "we" or "you-all," and they agree fully with the thing owned: <i>nuestro libro, nuestra casa, nuestros libros, nuestras casas</i>.' },
    { h: 'Resolving su\'s ambiguity', html: 'When context does not make the owner clear, replace <i>su</i> with <i>de él / de ella / de usted / de ellos / de ellas / de ustedes</i>: <i>la casa de ella</i> instead of the ambiguous <i>su casa</i>.' }
  ],
  contrasts: [
    { es: 'mi libro / mis libros', en: 'my book / my books', note: 'changes only for the thing owned' },
    { es: 'su casa', en: 'his / her / your / their house', note: 'genuinely ambiguous without context' },
    { es: 'nuestra casa / nuestras casas', en: 'our house / our houses', note: 'agrees in both gender and number' },
    { es: 'la casa de ella (not su casa)', en: 'her house', note: 'used to resolve the ambiguity of su' }
  ],
  pitfalls: [
    '<i>Mi/tu/su</i> never change for gender — <i>*mia libro</i> does not exist.',
    '<i>Su</i> is ambiguous between "his," "her," "your" (usted) and "their" — use <i>de él/de ella/de ellos</i> etc. when it matters.',
    'Only <i>nuestro/vuestro</i> mark gender; do not extend that pattern to <i>mi/tu/su</i>.'
  ],
  examples: [
    { es: 'Nuestra profesora es muy paciente.', en: 'Our teacher is very patient.' },
    { es: 'Sus padres viven en Chile — los de ella, no los de él.', en: 'Her parents live in Chile — hers, not his.' },
    { es: '¿Tienes tus llaves y tu cartera?', en: 'Do you have your keys and your wallet?' }
  ],
  probes: [
    { id: 'p:posfor:genero', kind: 'mcq', q: '¿Cuál es correcto? (mi + casa, femenino)',
      options: ['mia casa', 'mi casa', 'mis casa'], answer: 1 },
    { id: 'p:posfor:nuestro', kind: 'mcq', q: '"___ profesora es muy paciente." (our, feminine)',
      options: ['Nuestro', 'Nuestra', 'Nuestros'], answer: 1 },
    { id: 'p:posfor:ambiguo', kind: 'mcq', q: 'Para evitar la ambigüedad de "su casa", dices:',
      options: ['la su casa', 'la casa de ella', 'casa suya de ella'], answer: 1 },
    { id: 'p:posfor:recall', kind: 'recall', front: 'Which two possessives agree in BOTH gender and number?', back: 'nuestro/nuestra and vuestro/vuestra' }
  ]
},

{
  id: 'gr-cuantificadores-no-universales-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:170', 'gramatica:A1:171', 'gramatica:A1:172'],
  title: 'Poco y mucho',
  summary: 'Poco and mucho both agree with what they quantify when they sit in front of a noun, but freeze into the plain masculine form the moment they modify a verb or adjective instead.',
  sections: [
    { h: 'Before a noun: full agreement', html: '<i>poco/poca/pocos/pocas</i> and <i>mucho/mucha/muchos/muchas</i> agree in gender and number with the noun that follows: <i>poco tiempo</i>, <i>pocas ganas</i>, <i>muchos amigos</i>, <i>mucha suerte</i>.' },
    { h: 'Before a verb or adjective: frozen', html: 'Used adverbially — modifying a verb or an adjective rather than a noun — <i>mucho/poco</i> never changes: <i>Trabaja mucho</i>, <i>Está muy cansado</i> (here <i>mucho</i> shortens to <i>muy</i> before an adjective).' },
    { h: 'Muy vs mucho', html: '<i>Muy</i> goes before an adjective or adverb (<i>muy cansado, muy rápido</i>); <i>mucho</i> goes before a noun or after a verb (<i>mucho trabajo, trabaja mucho</i>). Mixing them up — <i>*muy trabajo</i>, <i>*mucho cansado</i> — is one of the most common A1 errors.' }
  ],
  contrasts: [
    { es: 'Tengo pocos amigos aquí.', en: 'I have few friends here.', note: 'agrees with the plural masculine noun' },
    { es: 'Tengo poca hambre.', en: 'I\'m not very hungry.', note: 'agrees with the feminine noun' },
    { es: 'Trabaja mucho.', en: 'She works a lot.', note: 'adverbial, invariable' },
    { es: 'Está muy cansada.', en: 'She is very tired.', note: 'muy before an adjective, not mucho' }
  ],
  pitfalls: [
    '<i>Mucho/poco</i> agree with a following NOUN but never change when modifying a verb or adjective.',
    'Use <i>muy</i>, not <i>mucho</i>, directly before an adjective or adverb: <i>muy cansado</i>, not <i>*mucho cansado</i>.',
    '<i>Mucho calor, mucha hambre, mucho tiempo</i> — these mass-noun idioms with <i>tener/hacer</i> still take the full agreeing form.'
  ],
  examples: [
    { es: 'Hace mucho calor y tengo mucha sed.', en: 'It\'s very hot and I\'m very thirsty.' },
    { es: 'Tiene poco tiempo pero muchas ganas de aprender.', en: 'He has little time but a lot of enthusiasm to learn.' },
    { es: 'Habla muy despacio pero entiende mucho.', en: 'She speaks very slowly but understands a lot.' }
  ],
  probes: [
    { id: 'p:cuantno:agree', kind: 'mcq', q: '"Tengo ___ hambre." (a lot, hambre is feminine)',
      options: ['mucho', 'mucha', 'muy'], answer: 1 },
    { id: 'p:cuantno:muyvsmucho', kind: 'mcq', q: '"Está ___ cansado."',
      options: ['mucho', 'muy', 'muya'], answer: 1 },
    { id: 'p:cuantno:adverbial', kind: 'cloze', text: 'Ella trabaja ___. (a lot, modifying the verb)', accept: ['mucho'] },
    { id: 'p:cuantno:recall', kind: 'recall', front: 'Before an ADJECTIVE, do you use muy or mucho?', back: 'muy' }
  ]
},

{
  id: 'gr-numerales-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:165', 'gramatica:A1:166', 'gramatica:A1:167', 'gramatica:A1:168'],
  title: 'Los numerales: cardinales y ordinales',
  summary: 'Cardinal numbers barely change — only uno and its compounds adjust for gender — but ordinals from primero to décimo agree like any adjective, and primero/tercero drop their -o before a masculine singular noun.',
  sections: [
    { h: 'Cardinals: mostly invariable', html: 'Numbers do not agree with what they count, with one exception: <i>uno</i> becomes <i>un</i> before a masculine noun and <i>una</i> before a feminine one, and this carries into compounds — <i>veintiún libros</i>, <i>treinta y una casas</i>.' },
    { h: 'Ordinals: agree like adjectives', html: '<i>primero, segundo, tercero…</i> agree in gender and number with their noun: <i>la segunda vez</i>, <i>los primeros días</i>.' },
    { h: 'Apocope of primero and tercero', html: 'Before a masculine singular noun, <i>primero</i> and <i>tercero</i> drop their final <i>-o</i>: <i>el primer día</i>, <i>el tercer piso</i> — never <i>*el primero día</i>. This is the exact same shortening pattern as <i>uno → un</i>.' }
  ],
  contrasts: [
    { es: 'un libro / una casa', en: 'one book / one house', note: 'uno agrees for gender before the noun' },
    { es: 'veintiún euros', en: 'twenty-one euros', note: 'the same shortening survives inside a compound number' },
    { es: 'la segunda vez / los primeros días', en: 'the second time / the first days', note: 'ordinals agree fully, like adjectives' },
    { es: 'el primer día / el tercer piso', en: 'the first day / the third floor', note: 'apocope before a masculine singular noun' }
  ],
  pitfalls: [
    '<i>Primero</i> and <i>tercero</i> shorten to <i>primer/tercer</i> only before a MASCULINE SINGULAR noun — <i>la primera vez</i> keeps its full form.',
    'Cardinal numbers other than <i>uno</i> and its compounds never agree: <i>dos casas</i>, <i>tres libros</i>, no gender change.',
    'Do not confuse the apocope of <i>primero/tercero</i> with the same pattern in <i>uno → un</i> — they are the same rule, applied to different words.'
  ],
  examples: [
    { es: 'Vivo en el tercer piso, la primera puerta a la derecha.', en: 'I live on the third floor, the first door on the right.' },
    { es: 'Tengo veintiún años y un hermano.', en: 'I am twenty-one and have one brother.' },
    { es: 'Es la segunda vez que visito esta ciudad.', en: 'It\'s the second time I\'ve visited this city.' }
  ],
  probes: [
    { id: 'p:numeral:apocope', kind: 'mcq', q: '"Vivo en el ___ piso." (third, before masculine singular)',
      options: ['tercero', 'tercer', 'tercera'], answer: 1 },
    { id: 'p:numeral:femenino', kind: 'mcq', q: '"Es la ___ vez." (first, feminine — no apocope)',
      options: ['primer', 'primero', 'primera'], answer: 2 },
    { id: 'p:numeral:uno', kind: 'cloze', text: 'Tengo veinti___ años. (21, before "años", masculine)', accept: ['ún'] },
    { id: 'p:numeral:recall', kind: 'recall', front: 'primero and tercero shorten before which kind of noun?', back: 'masculine singular (el primer día, el tercer piso)' }
  ]
},

{
  id: 'gr-pronombre-se-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:217', 'gramatica:A1:218', 'gramatica:A1:219', 'gramatica:A1:220'],
  title: 'El pronombre se: usos reflexivos',
  summary: 'Se has one invariable form for every third-person subject, singular or plural — and Spanish leans on reflexive verbs like peinarse and levantarse in everyday routines where English would never add "myself."',
  sections: [
    { h: 'One pronoun per person', html: 'A reflexive verb takes a pronoun matching its subject: <i>me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan</i>. Only the third person uses the special form <i>se</i>; the others reuse the ordinary object pronouns <i>me/te/nos/os</i>.' },
    { h: 'Se covers both singular and plural', html: 'Unlike <i>me/te/nos/os</i>, <i>se</i> does not change between <i>él se levanta</i> and <i>ellos se levantan</i> — the verb ending alone carries the number.' },
    { h: 'Not always "-self" in English', html: 'Many Spanish reflexive verbs describe a daily routine where English uses no reflexive at all: <i>peinarse</i> (to comb one\'s hair), <i>dormirse</i> (to fall asleep), <i>quedarse</i> (to stay). The Spanish "self" is grammatical, not always a translated meaning.' }
  ],
  contrasts: [
    { es: 'Me levanto a las siete.', en: 'I get up at seven.', note: 'first person: me, not se' },
    { es: 'Ella se levanta a las siete.', en: 'She gets up at seven.', note: 'third person singular: se' },
    { es: 'Ellos se levantan a las siete.', en: 'They get up at seven.', note: 'third person plural: still se, unchanged' },
    { es: 'Me peino todas las mañanas.', en: 'I comb my hair every morning.', note: 'reflexive in Spanish, no "myself" needed in English' }
  ],
  pitfalls: [
    '<i>Se</i> never changes for number — there is no <i>*ses</i> for plural subjects.',
    'Do not expect every Spanish reflexive verb to translate with "-self" in English; many describe ordinary routines.',
    'This reflexive <i>se</i> is a different thing from the impersonal/passive <i>se</i> (as in <i>se habla español</i>) — a separate later topic.'
  ],
  examples: [
    { es: '¿A qué hora te acuestas normalmente?', en: 'What time do you normally go to bed?' },
    { es: 'Los niños se duchan antes de cenar.', en: 'The children shower before dinner.' },
    { es: 'Nos quedamos en casa este fin de semana.', en: 'We\'re staying home this weekend.' }
  ],
  probes: [
    { id: 'p:prse:persona', kind: 'mcq', q: '"Ella ___ levanta temprano."',
      options: ['me', 'se', 'te'], answer: 1 },
    { id: 'p:prse:numero', kind: 'mcq', q: '"Ellos ___ duchan por la mañana."',
      options: ['se', 'ses', 'sen'], answer: 0 },
    { id: 'p:prse:cloze', kind: 'cloze', text: 'Yo ___ peino todas las mañanas.', accept: ['me'] },
    { id: 'p:prse:recall', kind: 'recall', front: 'Which reflexive pronoun form covers BOTH singular and plural third person?', back: 'se' }
  ]
},

{
  id: 'gr-pronombre-sujeto-a1', strand: 'grammar', cefr: 'A1', level: 1, theme: null,
  pcic: ['gramatica:A1:193', 'gramatica:A1:196', 'gramatica:A1:200', 'gramatica:A1:201', 'gramatica:A1:202'],
  title: 'Los pronombres sujeto',
  summary: 'Spanish routinely drops its subject pronoun because the verb ending already says who is speaking — you keep yo/tú/él mainly to contrast one person against another, which is why constant yo-yo-yo sounds foreign.',
  sections: [
    { h: 'The forms', html: '<i>yo, tú, él/ella/usted, nosotros/nosotras, vosotros/vosotras, ellos/ellas/ustedes</i>. Only the first person has no gender split; every other has one, or a formal/informal split (<i>tú</i> vs <i>usted</i>).' },
    { h: 'Omission is the default', html: 'Because the verb ending already identifies the person (<i>trabajo</i> can only be "I work"), the subject pronoun is usually left out: <i>Trabajo en un hospital</i>, not <i>*Yo trabajo en un hospital</i> as the neutral, unmarked version.' },
    { h: 'When you DO keep it: contrast', html: 'The pronoun reappears to contrast one person with another: <i>Yo prefiero café, ella prefiere té.</i> Without that contrast, adding it sounds like unnecessary emphasis, the classic "foreign accent" of over-translating English.' }
  ],
  contrasts: [
    { es: 'Trabajo en un hospital.', en: 'I work at a hospital.', note: 'neutral — no pronoun needed' },
    { es: '*Yo trabajo en un hospital.', en: '(unnecessary emphasis, not neutral)', note: 'grammatically fine but reads as marked/emphatic, or foreign, without a reason' },
    { es: 'Yo prefiero café, ella prefiere té.', en: 'I prefer coffee, she prefers tea.', note: 'contrast justifies keeping both pronouns' },
    { es: 'Llueve.', en: 'It\'s raining.', note: 'impersonal verbs have no subject pronoun at all — not even "it"' }
  ],
  pitfalls: [
    'Do not translate English\'s obligatory "I/you/he" word for word — constant subject pronouns are the most common tell of a non-native speaker.',
    'Impersonal expressions (<i>llueve, hay, es tarde</i>) have no subject pronoun to add, unlike English\'s empty "it."',
    '<i>Usted/ustedes</i> take a THIRD-person verb form even though they mean "you" — <i>usted trabaja</i>, not <i>*usted trabajas</i>.'
  ],
  examples: [
    { es: '¿De dónde eres? Soy de Chile.', en: 'Where are you from? I\'m from Chile.' },
    { es: 'Nosotros vamos al cine, ¿y vosotros?', en: 'We\'re going to the cinema, and you (all)?' },
    { es: 'Usted tiene razón, señora.', en: 'You are right, madam.' }
  ],
  probes: [
    { id: 'p:prsuj:omision', kind: 'mcq', q: 'Forma más natural y neutra:',
      options: ['Yo trabajo en un banco.', 'Trabajo en un banco.', 'Yo, trabajo en un banco.'], answer: 1 },
    { id: 'p:prsuj:contraste', kind: 'mcq', q: '¿Cuándo SÍ conviene usar el pronombre sujeto?',
      options: ['Siempre, para ser claro', 'Para contrastar dos personas', 'Nunca en español'], answer: 1 },
    { id: 'p:prsuj:usted', kind: 'cloze', text: 'Usted ___ razón. (tener, tercera persona)', accept: ['tiene'] },
    { id: 'p:prsuj:recall', kind: 'recall', front: 'Why can Spanish drop its subject pronouns so freely?', back: 'the verb ending already identifies the person' }
  ]
},

/* ============================================================================
 * BATCH — A1 notion, seq 36-44 of spec/syllabus-draft.json (skipped: seq 35
 * presencia-ausencia, already taught in full by nt-existencia-a1)
 * ========================================================================== */
{
  id: 'nt-cantidad-numerica-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:25', 'nociones_generales:A1:26', 'nociones_generales:A1:27'],
  title: 'Cantidad numérica: cardinales y ordinales',
  summary: 'A cardinal number states an exact count; an ordinal states a position in a sequence — and the two are easy to mix up because "cuatro" (four) and "cuarto" (fourth) differ by a single letter.',
  sections: [
    { h: 'Cardinals count', html: 'Cardinal numbers answer "how many": <i>Tengo 18 años</i>, <i>Somos cinco</i>. Spanish marks thousands with a period, not a comma: <i>150.000 habitantes</i>.' },
    { h: 'Ordinals place', html: 'Ordinals answer "which one in order": <i>Vivimos en el cuarto piso</i> (the fourth floor) — not <i>*el cuatro piso</i>, which would just be nonsense arithmetic sitting where a position belongs.' },
    { h: 'Comparing without a number', html: '<i>Muy</i>, <i>más</i> and <i>menos</i> intensify or compare with no number at all: <i>muy alto</i>, <i>más grande</i>.' }
  ],
  exponents: [
    { es: 'Tengo 18 años.', en: 'I am 18.', register: 'neutral', note: 'cardinal — exact count' },
    { es: 'Vivimos en el cuarto piso.', en: 'We live on the fourth floor.', register: 'neutral', note: 'ordinal — position, not count' },
    { es: 'Mi ciudad tiene 150.000 habitantes.', en: 'My city has 150,000 inhabitants.', register: 'neutral', note: 'period marks thousands in Spanish, not a comma' },
    { es: 'Es mucho más grande que la mía.', en: "It's much bigger than mine.", register: 'neutral', note: 'más for comparison, with no number involved' }
  ],
  contrasts: [
    { es: 'cuatro personas', en: 'four people', note: 'cardinal — counting' },
    { es: 'el cuarto piso', en: 'the fourth floor', note: 'ordinal — position; a single letter separates it from "cuatro"' }
  ],
  pitfalls: [
    'Do not say <i>*el cuatro piso</i> for "the fourth floor" — that names four floors, not the fourth one. Use the ordinal <i>cuarto</i>.',
    'Spanish uses a period for thousands and a comma for decimals — the reverse of English: <i>1.500,50</i> means one thousand five hundred point five zero.'
  ],
  examples: [
    { es: '—¿Cuántos años tienes? —Tengo veinte años.', en: '—How old are you? —I\'m twenty.' },
    { es: 'Es la tercera vez que visito Lima.', en: "It's the third time I've visited Lima." },
    { es: 'Somos cinco en mi familia.', en: 'There are five of us in my family.' }
  ],
  probes: [
    { id: 'p:cantnum:ordinal', kind: 'mcq', q: '"Vivimos en el ___ piso." (4th)',
      options: ['cuatro', 'cuarto', 'cuartro'], answer: 1 },
    { id: 'p:cantnum:cardinal', kind: 'mcq', q: '"Somos ___ en mi familia." (5, exact count)',
      options: ['quinto', 'cinco', 'cinco personas de'], answer: 1 },
    { id: 'p:cantnum:cloze', kind: 'cloze', text: 'Mi ciudad tiene 150___000 habitantes.', accept: ['.'] },
    { id: 'p:cantnum:recall', kind: 'recall', front: 'cuatro vs cuarto — which one names a POSITION?', back: 'cuarto (ordinal)' }
  ]
},

{
  id: 'nt-cantidad-relativa-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:28', 'nociones_generales:A1:29', 'nociones_generales:A1:30', 'nociones_generales:A1:31', 'nociones_generales:A1:32', 'nociones_generales:A1:33'],
  title: 'Cantidad relativa: más, menos, bastante',
  summary: 'Where a cardinal number states a precise figure, más, menos and más o menos move a quantity up, down, or into a rough estimate — without ever naming an exact number.',
  sections: [
    { h: 'Up or down, with no number', html: '<i>Más</i> and <i>menos</i> shift a quantity without stating it exactly: <i>Más pan, por favor</i>, <i>Tengo menos tiempo hoy</i>.' },
    { h: 'Turning a number into a guess', html: '<i>Más o menos</i> placed before a figure turns it into an approximation: <i>Tiene más o menos 25.000 habitantes</i> — "give or take."' },
    { h: 'Bastante and poco', html: '<i>Bastante</i> (quite a lot / enough) and <i>poco</i> (little) sit between "much" and "not much": <i>Tengo bastante dinero</i>, <i>Hay poca gente hoy</i>.' }
  ],
  exponents: [
    { es: 'Más pan, por favor.', en: 'More bread, please.', register: 'neutral', note: 'más with no number stated' },
    { es: 'Tiene más o menos 25.000 habitantes.', en: 'It has roughly 25,000 inhabitants.', register: 'neutral', note: 'turns an exact figure into an estimate' },
    { es: 'Tengo bastante dinero en el bolso.', en: 'I have quite a lot of money in my bag.', register: 'neutral' },
    { es: 'Hay mucha gente en la plaza.', en: 'There are a lot of people in the square.', register: 'neutral', note: '"gente" is always singular in Spanish' }
  ],
  contrasts: [
    { es: 'Tiene 25.000 habitantes.', en: 'It has 25,000 inhabitants.', note: 'exact — a cardinal number' },
    { es: 'Tiene más o menos 25.000 habitantes.', en: 'It has roughly 25,000 inhabitants.', note: 'approximate — más o menos softens the number' }
  ],
  pitfalls: [
    '<i>Gente</i> ("people") is grammatically singular in Spanish: <i>mucha gente</i>, never <i>*muchos gente</i>.',
    'Asking a price uses <i>ser/costar</i>, not <i>hay</i>: <i>¿Cuánto es?</i>, not <i>*¿Cuánto hay?</i>'
  ],
  examples: [
    { es: '—¿Cuánta gente hay en la fiesta? —Bastante.', en: '—How many people are at the party? —Quite a few.' },
    { es: 'Necesito un poco más de tiempo.', en: 'I need a little more time.' },
    { es: 'Este pueblo tiene más o menos mil habitantes.', en: 'This town has roughly a thousand inhabitants.' }
  ],
  probes: [
    { id: 'p:cantrel:gente', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['muchos gente', 'mucha gente', 'mucho gente'], answer: 1 },
    { id: 'p:cantrel:aproximado', kind: 'mcq', q: 'Para decir "aproximadamente 25.000" usas:',
      options: ['casi 25.000', 'más o menos 25.000', 'poco 25.000'], answer: 1 },
    { id: 'p:cantrel:cloze', kind: 'cloze', text: '___ pan, por favor. (more)', accept: ['Más', 'más'] },
    { id: 'p:cantrel:recall', kind: 'recall', front: 'Is "gente" (people) singular or plural in Spanish grammar?', back: 'singular (mucha gente)' }
  ]
},

{
  id: 'nt-tamano-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:42', 'nociones_generales:A1:43', 'nociones_generales:A1:44'],
  title: 'Tamaño: grande, pequeño y las medidas',
  summary: 'Size in Spanish runs on paired opposites — grande/pequeño, largo/corto, alto/bajo — and the same word alto or bajo can describe a person\'s height or a shelf\'s position, so context decides which.',
  sections: [
    { h: 'The basic pairs', html: '<i>grande/pequeño</i> (big/small), <i>largo/corto</i> (long/short), <i>alto/bajo</i> (tall or high / short or low), <i>rápido/lento</i> (fast/slow), <i>delgado/gordo</i> (thin/fat).' },
    { h: 'Alto and bajo do double duty', html: '<i>Alto</i> and <i>bajo</i> describe a PERSON\'s height (<i>Juan es muy alto</i>) and equally an OBJECT\'s height or position (<i>el estante de arriba está muy alto</i>) — the same word, no separate vocabulary needed.' },
    { h: 'Actual measurement', html: 'When a description is not precise enough, Spanish switches to <i>metro(s)</i>/<i>kilómetro(s)</i>: <i>Mide dos metros</i>.' }
  ],
  exponents: [
    { es: 'Mi hermano es muy alto.', en: 'My brother is very tall.', register: 'neutral', note: 'alto describing a person' },
    { es: 'El estante está muy alto.', en: 'The shelf is very high up.', register: 'neutral', note: 'the same word describing an object\'s position' },
    { es: 'Es un pueblo muy pequeño.', en: "It's a very small town.", register: 'neutral' },
    { es: 'Mide casi dos metros.', en: "He's nearly two metres tall.", register: 'neutral', note: 'a precise measurement, not just "alto"' }
  ],
  contrasts: [
    { es: 'Juan es alto.', en: 'Juan is tall.', note: 'height of a person' },
    { es: 'El precio es alto.', en: 'The price is high.', note: 'same word, a completely different kind of "high"' }
  ],
  pitfalls: [
    '<i>Alto/bajo</i> apply to people, objects, prices and sound volume alike — do not hunt for a separate word each time.',
    'A rough description (<i>alto, grande</i>) and an exact one (<i>dos metros</i>) are not interchangeable when precision actually matters — use the measurement.'
  ],
  examples: [
    { es: 'La mesa es demasiado larga para esta habitación.', en: 'The table is too long for this room.' },
    { es: 'Prefiero un coche pequeño y rápido.', en: 'I prefer a small, fast car.' },
    { es: '¿Cuánto mide tu hermano? Mide 1,90.', en: 'How tall is your brother? He\'s 1.90m.' }
  ],
  probes: [
    { id: 'p:tamano:doble', kind: 'mcq', q: '¿Qué palabra describe TANTO la altura de una persona COMO la de un estante?',
      options: ['grande', 'alto', 'largo'], answer: 1 },
    { id: 'p:tamano:opuesto', kind: 'mcq', q: 'Opuesto de "rápido":',
      options: ['bajo', 'lento', 'corto'], answer: 1 },
    { id: 'p:tamano:cloze', kind: 'cloze', text: 'Mi hermano ___ casi dos metros. (measures)', accept: ['mide'] },
    { id: 'p:tamano:recall', kind: 'recall', front: 'Which word covers both a person\'s height AND an object\'s position?', back: 'alto / bajo' }
  ]
},

{
  id: 'nt-localizacion-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:66', 'nociones_generales:A1:67', 'nociones_generales:A1:68'],
  title: 'Localización: dónde está algo',
  summary: 'Placing something at a physical spot always takes estar, never ser — and aquí/allí frame that place relative to where the speaker is actually standing, not some fixed point on a map.',
  sections: [
    { h: 'Estar, not ser', html: 'Locating a known place or thing uses <i>estar</i>: <i>Tikal está en Guatemala</i>, never <i>*Tikal es en Guatemala</i>. Confusing this with <i>ser</i> is one of the most persistent A1 errors.' },
    { h: 'Aquí and allí are relative to the speaker', html: '<i>Aquí</i> (here) marks the speaker\'s own position; <i>allí</i> (there) marks anywhere else. In Spanish America, <i>acá/allá</i> often replace them, with a looser, less exact sense of place.' },
    { h: 'Cerca and lejos', html: 'Distance is relative too: <i>cerca</i> (near) and <i>lejos</i> (far) say nothing exact — they only make sense compared to some reference point.' }
  ],
  exponents: [
    { es: 'Tikal está en Guatemala.', en: 'Tikal is in Guatemala.', register: 'neutral', note: 'estar, not ser, for physical location' },
    { es: 'Ven aquí un momento.', en: 'Come here a moment.', register: 'coloquial', note: 'aquí is relative to the speaker' },
    { es: 'El museo está muy lejos.', en: 'The museum is very far.', register: 'neutral' },
    { es: 'Acá todo es más tranquilo.', en: "Here everything's calmer.", register: 'coloquial', note: 'acá — the Spanish-American equivalent of aquí' }
  ],
  contrasts: [
    { es: 'Tikal está en Guatemala.', en: 'Tikal is in Guatemala.', note: 'correct — estar locates' },
    { es: '*Tikal es en Guatemala.', en: '(wrong)', note: 'ser cannot be used to physically locate something' }
  ],
  pitfalls: [
    'Never use <i>ser</i> to say where a specific, known thing IS physically located — that job belongs to <i>estar</i>.',
    '<i>Aquí/allí</i> always mean "near me" / "not near me" — they shift depending on who is speaking and where.'
  ],
  examples: [
    { es: '—¿Dónde está la biblioteca? —Está allí, al lado del banco.', en: '—Where is the library? —It\'s over there, next to the bank.' },
    { es: 'Mi casa está muy cerca de la estación.', en: 'My house is very close to the station.' },
    { es: 'El aeropuerto está lejos del centro.', en: 'The airport is far from the centre.' }
  ],
  probes: [
    { id: 'p:local:serestar', kind: 'mcq', q: '"Tikal ___ en Guatemala."',
      options: ['es', 'está', 'hay'], answer: 1 },
    { id: 'p:local:relativo', kind: 'mcq', q: '"Aquí" significa:',
      options: ['un lugar fijo en el mapa', 'cerca de quien habla', 'siempre lejos'], answer: 1 },
    { id: 'p:local:cloze', kind: 'cloze', text: 'El museo ___ muy lejos.', accept: ['está'] },
    { id: 'p:local:recall', kind: 'recall', front: 'Which verb physically locates something — ser or estar?', back: 'estar' }
  ]
},

{
  id: 'nt-posicion-relativa-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:71', 'nociones_generales:A1:72', 'nociones_generales:A1:73', 'nociones_generales:A1:74', 'nociones_generales:A1:75', 'nociones_generales:A1:76', 'nociones_generales:A1:77'],
  title: 'Posición relativa: cerca de, al lado de',
  summary: 'Almost every phrase for relative position ends in de — that "de" is what lets it attach to a specific landmark, so dropping it leaves the phrase floating with nothing to be near.',
  sections: [
    { h: 'The X + de + landmark pattern', html: '<i>cerca de</i>, <i>lejos de</i>, <i>al lado de</i>, <i>al final de</i>, <i>en el centro de</i> — all of them need <i>de</i> before the thing they are relative to: <i>cerca DE la estación</i>, never <i>*cerca la estación</i>.' },
    { h: 'Cardinal directions follow the same pattern', html: '<i>al norte de</i>, <i>al sur de</i>, <i>al este de</i>, <i>al oeste de</i> all take <i>de</i> too: <i>al norte de España</i>.' },
    { h: 'En and entre', html: '<i>En</i> places something inside or on a spot (<i>en la cartera</i>); <i>entre</i> places it between two things (<i>entre el supermercado y la cafetería</i>) and needs both reference points named.' }
  ],
  exponents: [
    { es: 'Mi casa está cerca de la estación.', en: 'My house is near the station.', register: 'neutral' },
    { es: 'El banco está al lado del hotel.', en: 'The bank is next to the hotel.', register: 'neutral', note: 'al lado de + el = del' },
    { es: 'Hay una calle pequeña entre el supermercado y la cafetería.', en: "There's a small street between the supermarket and the café.", register: 'neutral' },
    { es: 'Las llaves están en la cartera.', en: 'The keys are in the bag.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'cerca de la estación', en: 'near the station', note: 'correct — de links the position to its landmark' },
    { es: '*cerca la estación', en: '(wrong)', note: 'de can never be dropped from these compound prepositions' }
  ],
  pitfalls: [
    'Never drop the <i>de</i>: it is <i>cerca DE</i>, <i>lejos DE</i>, <i>al lado DE</i> — not just <i>cerca</i>, <i>lejos</i>, <i>al lado</i> in front of a noun.',
    '<i>Entre</i> always needs two things named (<i>entre X y Y</i>); it cannot be used with only one landmark the way <i>cerca de</i> can.'
  ],
  examples: [
    { es: 'El parque está al final de esta calle.', en: 'The park is at the end of this street.' },
    { es: 'Vivimos en el centro de la ciudad.', en: 'We live in the city centre.' },
    { es: 'Sevilla está al sur de Madrid.', en: 'Seville is south of Madrid.' }
  ],
  probes: [
    { id: 'p:posrel:de', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['cerca la estación', 'cerca de la estación', 'cerca en la estación'], answer: 1 },
    { id: 'p:posrel:entre', kind: 'mcq', q: '"Hay una farmacia ___ el banco ___ la librería."',
      options: ['entre / con', 'entre / y', 'cerca / y'], answer: 1 },
    { id: 'p:posrel:cloze', kind: 'cloze', text: 'El banco está al lado ___ hotel. (del/de el)', accept: ['del'] },
    { id: 'p:posrel:recall', kind: 'recall', front: 'What word do almost all relative-position phrases need before their landmark?', back: 'de' }
  ]
},

{
  id: 'nt-movimiento-estabilidad-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:89', 'nociones_generales:A1:90', 'nociones_generales:A1:91', 'nociones_generales:A1:92', 'nociones_generales:A1:93'],
  title: 'Movimiento: ir, venir, viajar',
  summary: 'Ir and venir both translate as "to go/come," but they point in opposite directions relative to the speaker — get them backwards and you have just told someone to come to a place you are not in.',
  sections: [
    { h: 'Ir: away from here', html: '<i>Ir</i> describes movement away from where the speaker currently is: <i>Voy a tu casa</i> (said from my own house).' },
    { h: 'Venir: toward here (or there)', html: '<i>Venir</i> describes movement TOWARD the speaker\'s position, or toward the position of whoever you are imagining yourself with: <i>Ven a mi casa</i> — never <i>*Ve a mi casa</i>, which would mean "go" away from where you both are.' },
    { h: 'Manner of movement', html: 'The way you travel is marked with <i>a/en</i>: <i>a pie</i>, <i>en coche</i>, <i>en metro</i>, <i>en tren</i>, <i>en avión</i>.' }
  ],
  exponents: [
    { es: 'Normalmente voy a pie al trabajo.', en: 'I normally walk to work.', register: 'neutral' },
    { es: '¿Vienes a la fiesta esta noche?', en: 'Are you coming to the party tonight?', register: 'coloquial', note: 'venir — movement toward the speaker' },
    { es: 'Prefiero viajar en tren.', en: 'I prefer to travel by train.', register: 'neutral' },
    { es: 'Salimos de casa a las ocho y llegamos a las nueve.', en: 'We leave home at eight and arrive at nine.', register: 'neutral' }
  ],
  contrasts: [
    { es: '¿Vienes a mi fiesta?', en: 'Are you coming to my party?', note: 'venir — toward the speaker\'s own event' },
    { es: '¿Vas a la fiesta de Ana?', en: 'Are you going to Ana\'s party?', note: 'ir — a party the speaker is not hosting or attending from' }
  ],
  pitfalls: [
    'Use <i>venir</i>, not <i>ir</i>, when inviting someone TO where you already are: <i>Ven aquí</i>, not <i>*Ve aquí</i>.',
    'Manner of transport takes <i>en</i> for vehicles (<i>en coche, en tren</i>) but <i>a</i> for on foot (<i>a pie</i>), not <i>*en pie</i>.'
  ],
  examples: [
    { es: '—¿Vienes conmigo al cine? —Sí, ahora voy.', en: "—Are you coming with me to the cinema? —Yes, I'm coming now." },
    { es: 'Mis padres vienen a visitarme el sábado.', en: 'My parents are coming to visit me on Saturday.' },
    { es: 'Salgo de casa temprano y entro a trabajar a las nueve.', en: 'I leave home early and start work at nine.' }
  ],
  probes: [
    { id: 'p:movest:direccion', kind: 'mcq', q: 'Estás en tu casa. Invitas a un amigo: "___ a mi casa esta tarde."',
      options: ['Ve', 'Ven', 'Vas'], answer: 1 },
    { id: 'p:movest:manera', kind: 'mcq', q: '"Voy al trabajo ___ pie."',
      options: ['en', 'a', 'con'], answer: 1 },
    { id: 'p:movest:cloze', kind: 'cloze', text: '¿___ conmigo al cine? (are you coming)', accept: ['vienes', 'Vienes'] },
    { id: 'p:movest:recall', kind: 'recall', front: 'Which verb, ir or venir, moves TOWARD the speaker?', back: 'venir' }
  ]
},

{
  id: 'nt-orientacion-direccion-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:102', 'nociones_generales:A1:103', 'nociones_generales:A1:104', 'nociones_generales:A1:105'],
  title: 'Orientación: pedir y dar direcciones',
  summary: 'Giving street directions in Spanish rests on three fixed phrases — todo recto, a la derecha, a la izquierda — combined with an ordinal to count which street you mean.',
  sections: [
    { h: 'The three building blocks', html: '<i>Todo recto</i> (straight ahead), <i>a la derecha</i> (to the right), <i>a la izquierda</i> (to the left) cover almost every direction you will ever give or receive.' },
    { h: 'Counting streets with ordinals', html: 'Combine a direction with an ordinal to be precise: <i>la segunda calle a la derecha</i> ("the second street on the right"), reusing the ordinals from <i>cantidad numérica</i>.' },
    { h: 'Asking', html: '<i>¿Dónde está…?</i> is the standard way to ask for a location before someone gives you the directions.' }
  ],
  exponents: [
    { es: '¿Dónde está la calle Velázquez?', en: 'Where is Velázquez street?', register: 'neutral' },
    { es: 'Todo recto y luego la segunda calle a la derecha.', en: 'Straight ahead and then the second street on the right.', register: 'neutral' },
    { es: 'Gira a la izquierda en el semáforo.', en: 'Turn left at the traffic light.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'a la derecha', en: 'to the right', note: 'derecha — noun-like, the direction' },
    { es: 'Tienes derecho a preguntar.', en: 'You have the right to ask.', note: 'derecho — a completely different word, "a right"; do not confuse the spelling' }
  ],
  pitfalls: [
    '<i>Derecha</i> (direction) and <i>derecho</i> (a legal right, or "straight" as in <i>todo derecho</i> — a regional variant of <i>todo recto</i>) are easy to confuse in spelling; keep them apart.',
    'Directions almost always chain an ordinal onto <i>a la derecha/izquierda</i> — bare directions without a street count are vague.'
  ],
  examples: [
    { es: '—¿Dónde está el banco? —Todo recto, y está a la izquierda.', en: '—Where is the bank? —Straight ahead, and it\'s on the left.' },
    { es: 'Es la tercera calle a la derecha, justo después de la plaza.', en: 'It\'s the third street on the right, just after the square.' },
    { es: 'Sigue todo recto hasta el semáforo.', en: 'Keep going straight until the traffic light.' }
  ],
  probes: [
    { id: 'p:orient:recto', kind: 'mcq', q: '"Straight ahead" en español:',
      options: ['a la derecha', 'todo recto', 'al final'], answer: 1 },
    { id: 'p:orient:ordinal', kind: 'mcq', q: '"The second street on the right":',
      options: ['la segunda calle a la derecha', 'la dos calle a la derecha', 'la calle segunda derecha'], answer: 0 },
    { id: 'p:orient:cloze', kind: 'cloze', text: 'Gira a la ___ en el semáforo. (left)', accept: ['izquierda'] },
    { id: 'p:orient:recall', kind: 'recall', front: 'Three fixed phrases for giving directions', back: 'todo recto, a la derecha, a la izquierda' }
  ]
},

{
  id: 'nt-origen-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:115', 'nociones_generales:A1:116', 'nociones_generales:A1:117'],
  title: 'Origen: ser + nacionalidad, ser de',
  summary: 'Two constructions cover where someone is from — ser + a nationality adjective states it as a quality, ser de + place states it as a source — and only the second one works for a city with no adjective of its own.',
  sections: [
    { h: 'Ser + nationality adjective', html: '<i>Es cubano</i> treats the origin as a quality, agreeing like any adjective: <i>es cubana</i> for a woman, <i>son cubanos</i> for a group.' },
    { h: 'Ser de + place', html: '<i>Soy de Sevilla</i> states the SOURCE directly. This is the only option for places with no adjective form — nobody says <i>*es sevillano</i> as reliably as they say <i>es de Sevilla</i>, and it always works, city or country alike.' },
    { h: 'Asking', html: '<i>¿De dónde eres?</i> is the standard question — note the accented <i>dónde</i>, since it is a real question word here, not the plain <i>donde</i> of a relative clause.' }
  ],
  exponents: [
    { es: 'Luis Alberto es cubano.', en: 'Luis Alberto is Cuban.', register: 'neutral', note: 'nationality as an adjective' },
    { es: 'Soy de Sevilla.', en: "I'm from Seville.", register: 'neutral', note: 'ser de + place — works for any place, adjective or not' },
    { es: '—¿De dónde eres? —Soy de Perú.', en: "—Where are you from? —I'm from Peru.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'Es cubano.', en: 'He is Cuban.', note: 'nationality adjective — agrees like any other adjective' },
    { es: 'Es de La Habana.', en: "He's from Havana.", note: 'ser de — the only option for a city, which has no adjective form in ordinary speech' }
  ],
  pitfalls: [
    'Nationality adjectives are NOT capitalized in Spanish, unlike English: <i>es cubano</i>, not <i>*es Cubano</i>.',
    'A nationality adjective must agree in gender with the person: <i>es cubana</i> for a woman.',
    '<i>Ser de</i> + place always works, even where no adjective exists — reach for it whenever you are unsure.'
  ],
  examples: [
    { es: 'Mi profesora es mexicana.', en: 'My teacher (f) is Mexican.' },
    { es: '¿De dónde son ustedes?', en: 'Where are you (all) from?' },
    { es: 'Somos de un pueblo pequeño cerca de Bogotá.', en: "We're from a small town near Bogotá." }
  ],
  probes: [
    { id: 'p:origen:mayuscula', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Es Cubano.', 'es cubano.', 'Es cubano.'], answer: 2 },
    { id: 'p:origen:agree', kind: 'mcq', q: '"Mi profesora es ___." (Mexican, feminine)',
      options: ['mexicano', 'mexicana', 'mexicanos'], answer: 1 },
    { id: 'p:origen:cloze', kind: 'cloze', text: '¿De ___ eres?', accept: ['dónde'] },
    { id: 'p:origen:recall', kind: 'recall', front: 'Which construction works for a CITY with no adjective form?', back: 'ser de + place (es de La Habana)' }
  ]
},

{
  id: 'nt-referencias-generales-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:119', 'nociones_generales:A1:120', 'nociones_generales:A1:121', 'nociones_generales:A1:122', 'nociones_generales:A1:123', 'nociones_generales:A1:124', 'nociones_generales:A1:125', 'nociones_generales:A1:126', 'nociones_generales:A1:127', 'nociones_generales:A1:128'],
  title: 'Referencias temporales: la hora, los días',
  summary: 'Telling the time and naming days both run on a small, fixed set of building blocks — but Spanish counts the last twenty minutes of the hour DOWN toward the next one, a habit English speakers never expect.',
  sections: [
    { h: 'Telling the time', html: '<i>Es la una</i> is the one exception (singular); every other hour is plural: <i>Son las dos</i>. Quarters and halves use <i>y</i> going up (<i>y cuarto, y media</i>) and <i>menos</i> going down toward the next hour (<i>las diez menos veinte</i> = 9:40, not 10:20).' },
    { h: 'Days of the week', html: '<i>El</i> + day names a specific occurrence with no extra preposition: <i>El jueves voy al teatro</i> — Spanish needs no word for "on" the way English does.' },
    { h: 'Parts of the day', html: '<i>Por la mañana/tarde/noche</i> is the peninsular pattern; Spanish America commonly says <i>en la mañana/tarde/noche</i> instead — both are correct, just regionally split.' }
  ],
  exponents: [
    { es: '—¿Qué hora es? —Son las nueve y cuarto.', en: "—What time is it? —It's a quarter past nine.", register: 'neutral' },
    { es: 'Son las diez menos veinte.', en: "It's twenty to ten.", register: 'neutral', note: 'counts down toward the NEXT hour, not the current one' },
    { es: 'El fin de semana no trabajo.', en: "I don't work on weekends.", register: 'neutral' },
    { es: 'Nos vemos por la tarde.', en: 'See you in the afternoon.', register: 'neutral', note: '"en la tarde" in much of Spanish America' }
  ],
  contrasts: [
    { es: 'Es la una.', en: "It's one o'clock.", note: 'singular — the one exception' },
    { es: 'Son las dos.', en: "It's two o'clock.", note: 'plural — every other hour' }
  ],
  pitfalls: [
    '<i>Menos</i> + minutes counts toward the NEXT hour: <i>las diez menos veinte</i> is 9:40, not 10:20.',
    'Do not add a preposition before <i>el</i> + day of the week: <i>el lunes</i> alone means "on Monday" — <i>*en el lunes</i> is wrong.',
    'Only <i>una</i> takes the singular <i>es</i>; every other hour takes the plural <i>son</i>.'
  ],
  examples: [
    { es: 'El sábado por la mañana voy al mercado.', en: 'On Saturday morning I go to the market.' },
    { es: 'La reunión es a mediodía.', en: 'The meeting is at midday.' },
    { es: '—¿A qué hora cierra? —A las nueve y media.', en: '—What time does it close? —At half past nine.' }
  ],
  probes: [
    { id: 'p:refgen:menos', kind: 'mcq', q: '"Son las diez menos veinte" son las:',
      options: ['10:20', '9:40', '10:40'], answer: 1 },
    { id: 'p:refgen:singular', kind: 'mcq', q: '"___ la una." (it\'s one o\'clock)',
      options: ['Son', 'Es', 'Está'], answer: 1 },
    { id: 'p:refgen:dia', kind: 'cloze', text: '___ jueves voy al teatro. (on Thursday, no extra preposition)', accept: ['El', 'el'] },
    { id: 'p:refgen:recall', kind: 'recall', front: 'Which hour takes the singular "es" instead of "son"?', back: 'la una (one o\'clock)' }
  ]
},

/* ---------------------------------------------------------------------------
 * seq 45-47 (futuro, pasado, presente) merged into one lesson: all three are
 * the SAME time-marker pattern (el + day, en + month, mañana/hoy/ayer) with
 * 3-4 items each — the real teaching point is that the marker never carries
 * the tense, so splitting them into three near-identical thin lessons would
 * hide that point rather than teach it.
 * ------------------------------------------------------------------------ */
{
  id: 'nt-tiempo-futuro-presente-pasado-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:137', 'nociones_generales:A1:138', 'nociones_generales:A1:141',
         'nociones_generales:A1:142', 'nociones_generales:A1:144', 'nociones_generales:A1:145'],
  title: 'Futuro, presente y pasado: los mismos marcadores',
  summary: 'El + day, en + month and hoy/mañana/ayer locate an event in time — but the marker word itself never says WHEN: only the verb tense does, and the exact same "el jueves" can point forward or backward depending on it.',
  sections: [
    { h: 'One set of markers, three time frames', html: '<i>El + [día]</i> and <i>en + [mes/estación]</i> work identically for the future, the present routine, or the past — <i>el jueves</i> and <i>en enero</i> carry no built-in tense of their own.' },
    { h: 'The verb carries the tense, not the marker', html: '<i>El jueves voy al teatro</i> (future, said before Thursday) and <i>El jueves fui al teatro</i> (past, said after Thursday) use the identical marker <i>el jueves</i> — only the verb, <i>voy</i> vs <i>fui</i>, tells you which.' },
    { h: 'The three words that DO commit on their own', html: '<i>Hoy</i>, <i>mañana</i> and <i>ayer</i> are the exception: they fix the time frame by themselves, which is why they combine naturally with present, near-future and past respectively — <i>Hoy trabajo</i>, <i>Mañana trabajo</i>, <i>Ayer trabajé</i>.' }
  ],
  exponents: [
    { es: 'El jueves voy al teatro.', en: "I'm going to the theatre on Thursday.", register: 'neutral', note: 'a future event, using the present tense to talk about it — very common at A1' },
    { es: 'Ahora vivo en Lisboa.', en: 'I live in Lisbon now.', register: 'neutral', note: 'presente — ahora fixes it as current' },
    { es: 'El miércoles pasado fui al médico.', en: 'Last Wednesday I went to the doctor.', register: 'neutral', note: 'the same "el + día" marker, now clearly past thanks to fui and "pasado"' },
    { es: 'En invierno hace mucho frío aquí.', en: "It's very cold here in winter.", register: 'neutral', note: 'en + estación works for a general truth, any time frame' }
  ],
  contrasts: [
    { es: 'El jueves voy al teatro.', en: "I'm going to the theatre on Thursday.", note: 'future — voy' },
    { es: 'El jueves fui al teatro.', en: 'On Thursday I went to the theatre.', note: 'past — fui; the marker "el jueves" is identical in both' }
  ],
  pitfalls: [
    'Do not expect <i>el + día</i> or <i>en + mes</i> to tell you the tense — they do not. Watch the verb.',
    'Only <i>hoy, mañana, ayer</i> fix a time frame on their own; everything else depends on the surrounding verb.',
    'At A1, the near future is very often expressed with the plain present tense (<i>El jueves voy…</i>), not a special future form.'
  ],
  examples: [
    { es: 'Hoy no tenemos clase, pero mañana sí.', en: "We don't have class today, but we do tomorrow." },
    { es: 'Ayer llovió todo el día.', en: 'Yesterday it rained all day.' },
    { es: 'En verano vamos siempre a la playa.', en: 'In summer we always go to the beach.' }
  ],
  probes: [
    { id: 'p:tfpp:marcador', kind: 'mcq', q: '"El jueves voy al teatro" y "El jueves fui al teatro" — ¿qué cambia el tiempo?',
      options: ['la palabra "jueves"', 'el verbo', 'nada, son iguales'], answer: 1 },
    { id: 'p:tfpp:fijo', kind: 'mcq', q: '¿Cuál de estas palabras SIEMPRE indica un momento fijo por sí sola?',
      options: ['el lunes', 'en enero', 'ayer'], answer: 2 },
    { id: 'p:tfpp:cloze', kind: 'cloze', text: '___ no tenemos clase, pero mañana sí. (today)', accept: ['Hoy', 'hoy'] },
    { id: 'p:tfpp:recall', kind: 'recall', front: 'What actually carries the tense in "el jueves voy/fui al teatro"?', back: 'the verb, not the day marker' }
  ]
},

{
  id: 'nt-duracion-transcurso-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:174', 'nociones_generales:A1:175', 'nociones_generales:A1:176', 'nociones_generales:A1:177', 'nociones_generales:A1:178'],
  title: 'Duración: antes, después, empezar, terminar',
  summary: 'Antes and después order two events against each other, while empezar and terminar frame the edges of a single one — and each of those two verbs insists on its own preposition, a or de, which do not swap.',
  sections: [
    { h: 'Ordering two events', html: '<i>Antes</i> (before) and <i>después</i> (after) place one event relative to another: <i>Antes de cenar, me ducho</i>.' },
    { h: 'Marking the edges of one event', html: '<i>Empezar a</i> + infinitive marks the start; <i>terminar de</i> + infinitive marks the end. The prepositions are fixed and different: <i>Empiezo A trabajar a las nueve</i>, <i>Termino DE trabajar a las cinco</i>.' },
    { h: 'How much time it takes', html: 'The quantifiers from cantidad relativa reapply to time: <i>mucho/poco/bastante tiempo</i> — <i>Tardo poco tiempo en llegar</i>.' }
  ],
  exponents: [
    { es: 'Antes de dormir, leo un rato.', en: 'Before sleeping, I read for a while.', register: 'neutral' },
    { es: 'Después del trabajo, voy al gimnasio.', en: 'After work, I go to the gym.', register: 'neutral' },
    { es: 'Empiezo a trabajar a las nueve.', en: 'I start working at nine.', register: 'neutral', note: 'empezar A + infinitive' },
    { es: 'Termino de trabajar a las cinco.', en: 'I finish working at five.', register: 'neutral', note: 'terminar DE + infinitive' }
  ],
  contrasts: [
    { es: 'Empiezo a trabajar a las nueve.', en: 'I start working at nine.', note: 'empezar takes A' },
    { es: 'Termino de trabajar a las cinco.', en: 'I finish working at five.', note: 'terminar takes DE — the opposite preposition' }
  ],
  pitfalls: [
    '<i>Empezar</i> takes <i>a</i>; <i>terminar</i> takes <i>de</i> — they do not share a preposition, and swapping them (<i>*empezar de</i>, <i>*terminar a</i>) is a common slip.',
    '<i>Antes</i> and <i>después</i> need <i>de</i> before a following infinitive or noun: <i>antes DE cenar</i>, not <i>*antes cenar</i>.'
  ],
  examples: [
    { es: 'Antes de salir, cierro las ventanas.', en: 'Before going out, I close the windows.' },
    { es: 'La película empieza a las ocho y termina a las diez.', en: 'The film starts at eight and finishes at ten.' },
    { es: 'Tardo bastante tiempo en preparar la cena.', en: 'It takes me quite a while to make dinner.' }
  ],
  probes: [
    { id: 'p:durtrans:empezar', kind: 'mcq', q: '"Empiezo ___ trabajar a las nueve."',
      options: ['de', 'a', 'en'], answer: 1 },
    { id: 'p:durtrans:terminar', kind: 'mcq', q: '"Termino ___ trabajar a las cinco."',
      options: ['a', 'de', 'en'], answer: 1 },
    { id: 'p:durtrans:cloze', kind: 'cloze', text: '___ de dormir, leo un rato. (before)', accept: ['Antes', 'antes'] },
    { id: 'p:durtrans:recall', kind: 'recall', front: 'empezar A vs terminar ___', back: 'DE' }
  ]
},

{
  id: 'nt-frecuencia-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:179', 'nociones_generales:A1:180', 'nociones_generales:A1:181', 'nociones_generales:A1:182'],
  title: 'Frecuencia: siempre, a veces, nunca',
  summary: 'Siempre and nunca sit at opposite ends of a scale that normalmente and a veces fill in between — and nunca needs a "no" of its own only when it lands AFTER the verb, not before.',
  sections: [
    { h: 'The scale', html: '<i>Siempre</i> (always) → <i>normalmente</i> (usually) → <i>a veces</i> (sometimes) → <i>nunca</i> (never) — a descending order of how often something happens.' },
    { h: 'Nunca and double negation', html: 'Placed BEFORE the verb, <i>nunca</i> needs nothing else: <i>Nunca como pescado</i>. Placed AFTER the verb, Spanish adds <i>no</i> before it — this is not a contradiction, it is the normal Spanish double negative: <i>No como nunca pescado</i>.' },
    { h: 'Position', html: 'These adverbs usually sit right before the verb they describe: <i>Siempre desayuno cereales</i>, <i>A veces se levanta tarde</i>.' }
  ],
  exponents: [
    { es: 'Siempre desayuno cereales.', en: 'I always have cereal for breakfast.', register: 'neutral' },
    { es: 'Nunca como pescado.', en: 'I never eat fish.', register: 'neutral', note: 'nunca before the verb — no extra "no" needed' },
    { es: 'No como nunca pescado.', en: 'I never eat fish.', register: 'neutral', note: 'same meaning, nunca after the verb — now "no" is required' },
    { es: 'A veces voy de vacaciones en septiembre.', en: 'Sometimes I go on holiday in September.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Nunca como pescado.', en: 'I never eat fish.', note: 'nunca before verb: no "no" needed' },
    { es: 'No como nunca pescado.', en: 'I never eat fish.', note: 'nunca after verb: "no" required before the verb — the Spanish double negative' }
  ],
  pitfalls: [
    'Spanish doubles the negative when <i>nunca</i> follows the verb — this is correct grammar, not an error, unlike in English.',
    'Do not translate the English scale word for word; <i>normalmente</i> sits closer to "usually" than to "normally" in tone.'
  ],
  examples: [
    { es: 'Normalmente me levanto a las siete.', en: 'I usually get up at seven.' },
    { es: 'A veces cenamos fuera los viernes.', en: 'Sometimes we eat out on Fridays.' },
    { es: 'Mi hermano nunca desayuna.', en: 'My brother never has breakfast.' }
  ],
  probes: [
    { id: 'p:frecuen:doble', kind: 'mcq', q: '¿Cuál es correcto? (nunca DESPUÉS del verbo)',
      options: ['Como nunca pescado.', 'No como nunca pescado.', 'Nunca no como pescado.'], answer: 1 },
    { id: 'p:frecuen:simple', kind: 'mcq', q: '¿Cuál es correcto? (nunca ANTES del verbo)',
      options: ['Nunca como pescado.', 'No nunca como pescado.', 'Nunca no como pescado.'], answer: 0 },
    { id: 'p:frecuen:cloze', kind: 'cloze', text: '___ me levanto a las siete. (usually)', accept: ['Normalmente', 'normalmente'] },
    { id: 'p:frecuen:recall', kind: 'recall', front: 'When does nunca need an extra "no"?', back: 'when it comes AFTER the verb' }
  ]
},

{
  id: 'nt-visibilidad-vision-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:221', 'nociones_generales:A1:222', 'nociones_generales:A1:223'],
  title: 'Visibilidad: claro, oscuro y los colores',
  summary: 'Claro and oscuro describe both LIGHT — a bright or dim room — and COLOUR SHADE — light blue versus dark blue — with the exact same pair of words doing two different jobs.',
  sections: [
    { h: 'Claro and oscuro: two jobs, one pair of words', html: '<i>Una habitación clara</i> is a bright room; <i>el pelo oscuro</i> is dark hair — same words, lighting in one case, shade in the other. Combined with a colour they mean "light/dark [colour]": <i>azul claro</i>, <i>azul oscuro</i>.' },
    { h: 'The basic colours', html: '<i>rojo, amarillo, azul, verde, naranja, marrón, blanco, negro, gris</i> — most agree like regular adjectives (<i>roja, rojos, rojas</i>).' },
    { h: 'Ver vs escuchar', html: '<i>Ver</i> covers sight generally, including "watching" television or a film: <i>ver la televisión</i>, not a separate word for "watch." <i>Escuchar</i> is the active counterpart for sound.' }
  ],
  exponents: [
    { es: 'Tiene los ojos claros.', en: 'She has light-coloured eyes.', register: 'neutral', note: 'claro describing shade' },
    { es: 'Esta habitación es muy oscura.', en: 'This room is very dark.', register: 'neutral', note: 'oscuro describing light level' },
    { es: 'Prefiero el azul claro al azul oscuro.', en: 'I prefer light blue to dark blue.', register: 'neutral' },
    { es: 'No me gusta ver la televisión por la noche.', en: "I don't like watching television at night.", register: 'neutral', note: 'ver, not a separate word for "watch"' }
  ],
  contrasts: [
    { es: 'una habitación clara', en: 'a bright room', note: 'claro describing light level' },
    { es: 'el pelo claro', en: 'light-coloured hair', note: 'the same word describing colour shade instead' }
  ],
  pitfalls: [
    'Do not hunt for a separate word for "watch" — Spanish uses <i>ver</i> for watching TV or a film, the same verb as plain "to see."',
    '<i>Claro/oscuro</i> placed after a colour always mean "light/dark," never a separate colour of their own.'
  ],
  examples: [
    { es: 'Su nuevo coche es de color verde oscuro.', en: 'Her new car is dark green.' },
    { es: '¿Prefieres una habitación clara o más oscura?', en: 'Do you prefer a bright room or a darker one?' },
    { es: 'Me gusta escuchar música mientras cocino.', en: 'I like listening to music while I cook.' }
  ],
  probes: [
    { id: 'p:vision:dosusos', kind: 'mcq', q: '"Tiene el pelo claro" — ¿de qué habla?',
      options: ['de la luz de la habitación', 'del color del pelo', 'de la vista'], answer: 1 },
    { id: 'p:vision:vertv', kind: 'mcq', q: '"To watch television" en español:',
      options: ['mirar la televisión', 'ver la televisión', 'observar la televisión'], answer: 1 },
    { id: 'p:vision:cloze', kind: 'cloze', text: 'Prefiero el azul ___ al azul oscuro. (light)', accept: ['claro'] },
    { id: 'p:vision:recall', kind: 'recall', front: 'What TWO different things can "claro/oscuro" describe?', back: 'light level (of a room) and colour shade' }
  ]
},

{
  id: 'nt-edad-vejez-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:236', 'nociones_generales:A1:237', 'nociones_generales:A1:238', 'nociones_generales:A1:239'],
  title: 'Edad: tener + años',
  summary: 'Age in Spanish is something you HAVE, never something you ARE — tener + number + años is the only pattern, and reaching for ser the way English "I am 20" suggests produces nonsense.',
  sections: [
    { h: 'Tener, not ser', html: '<i>Tengo veinte años</i> — age is possessed. <i>*Soy veinte años</i> does not exist; <i>ser</i> has no role here at all.' },
    { h: 'Nuevo and viejo', html: '<i>Nuevo/viejo</i> (new/old) apply to things straightforwardly; used of people they can sound blunt, so <i>mayor</i> ("older," softer) is often preferred in polite reference to age.' },
    { h: 'Age-linked words for a person', html: '<i>Niño</i> (child), <i>chico</i> (young person/boy), <i>señor</i> (an older man, or simply a polite "sir/gentleman") sketch roughly where someone sits on the age scale without a number.' }
  ],
  exponents: [
    { es: '—¿Cuántos años tienes? —Tengo veinte años.', en: "—How old are you? —I'm twenty.", register: 'neutral', note: 'tener, not ser' },
    { es: 'Es un edificio muy viejo.', en: "It's a very old building.", register: 'neutral', note: 'viejo applied to a thing, no issue' },
    { es: 'Mi abuelo ya es mayor.', en: "My grandfather is elderly now.", register: 'neutral', note: 'mayor — softer than viejo when talking about a person' },
    { es: 'Es un señor muy amable.', en: "He's a very kind gentleman.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'Tengo veinte años.', en: "I'm twenty.", note: 'correct — tener' },
    { es: '*Soy veinte años.', en: '(impossible)', note: 'ser is never used for age' }
  ],
  pitfalls: [
    'Age is always <i>tener</i> + number + <i>años</i> — never <i>ser</i>. This is one of the very first, very sticky A1 errors.',
    'Calling a person directly <i>viejo/vieja</i> can sound rude; <i>mayor</i> is the polite, neutral alternative.'
  ],
  examples: [
    { es: 'Mi hija tiene cinco años.', en: 'My daughter is five.' },
    { es: 'Este coche es muy viejo, tiene veinte años.', en: "This car is very old, it's twenty years old." },
    { es: 'Los niños de esa clase tienen siete u ocho años.', en: 'The children in that class are seven or eight.' }
  ],
  probes: [
    { id: 'p:edad:verbo', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Soy veinte años.', 'Tengo veinte años.', 'Estoy veinte años.'], answer: 1 },
    { id: 'p:edad:mayor', kind: 'mcq', q: 'Forma más educada de referirse a la edad avanzada de alguien:',
      options: ['viejo', 'mayor', 'antiguo'], answer: 1 },
    { id: 'p:edad:cloze', kind: 'cloze', text: 'Mi hija ___ cinco años.', accept: ['tiene'] },
    { id: 'p:edad:recall', kind: 'recall', front: 'Which verb does Spanish use for age — ser or tener?', back: 'tener' }
  ]
},

{
  id: 'nt-accesibilidad-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:244', 'nociones_generales:A1:245', 'nociones_generales:A1:246'],
  title: 'Accesibilidad: entrada, salida, abrir, cerrar',
  summary: 'Entrada and salida name the fixed points where you get in or out; abrir/cerrar name the action of changing access; and estar abierto/cerrado — with estar, not ser — names the resulting, changeable state.',
  sections: [
    { h: 'The nouns: fixed points', html: '<i>Entrada</i> (entrance) and <i>salida</i> (exit) name the physical points themselves: <i>La salida está al fondo</i>.' },
    { h: 'The verbs: the action', html: '<i>Abrir/cerrar</i> describe the act of changing access: <i>La tienda abre a las nueve.</i>' },
    { h: 'The state: estar, not ser', html: 'Whether something IS open or closed right now is a temporary condition, so it takes <i>estar</i>: <i>La tienda está abierta</i>, never <i>*es abierta</i> in this everyday sense.' }
  ],
  exponents: [
    { es: 'La entrada está a la izquierda.', en: 'The entrance is on the left.', register: 'neutral' },
    { es: 'La tienda abre a las nueve y cierra a las ocho.', en: 'The shop opens at nine and closes at eight.', register: 'neutral' },
    { es: 'Está cerrado los domingos.', en: "It's closed on Sundays.", register: 'neutral', note: 'estar for the current, changeable state' }
  ],
  contrasts: [
    { es: 'La tienda abre a las nueve.', en: 'The shop opens at nine.', note: 'the ACTION of opening' },
    { es: 'La tienda está abierta.', en: 'The shop is open.', note: 'the resulting STATE, with estar' }
  ],
  pitfalls: [
    '<i>Abierto/cerrado</i> describing whether something is currently accessible takes <i>estar</i>, because it can change — not <i>ser</i>.',
    '<i>Entrada</i> can also mean a ticket (<i>una entrada de cine</i>) — context decides which sense is meant.'
  ],
  examples: [
    { es: '—¿A qué hora cierra el museo? —Cierra a las seis.', en: '—What time does the museum close? —It closes at six.' },
    { es: 'Hoy está cerrado por vacaciones.', en: "It's closed today for the holidays." },
    { es: 'La salida de emergencia está al final del pasillo.', en: 'The emergency exit is at the end of the corridor.' }
  ],
  probes: [
    { id: 'p:acces:estado', kind: 'mcq', q: '"La tienda ___ cerrada los domingos."',
      options: ['es', 'está', 'hay'], answer: 1 },
    { id: 'p:acces:accion', kind: 'mcq', q: '"La tienda ___ a las nueve." (the action of opening)',
      options: ['está abierta', 'abre', 'es abierta'], answer: 1 },
    { id: 'p:acces:cloze', kind: 'cloze', text: 'La ___ está al final del pasillo. (exit)', accept: ['salida'] },
    { id: 'p:acces:recall', kind: 'recall', front: 'Which verb, ser or estar, describes whether a shop is currently open?', back: 'estar' }
  ]
},

{
  id: 'nt-evaluacion-general-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:249', 'nociones_generales:A1:250', 'nociones_generales:A1:251', 'nociones_generales:A1:252'],
  title: 'Evaluación general: bueno, malo, bien',
  summary: 'Bueno/malo evaluate a NOUN and agree with it like any adjective; bien/mal evaluate how you ARE or how something is DONE and never change — confusing the two produces "estoy bueno," which does not mean what a beginner thinks it means.',
  sections: [
    { h: 'Bueno / malo: adjectives', html: 'They describe a noun and agree in gender and number: <i>un buen libro</i> (note the shortened <i>buen</i> before a masculine singular noun), <i>una película mala</i>.' },
    { h: 'Bien / mal: adverbs', html: 'Invariable, they describe how you feel or how something is done: <i>Estoy bien</i>, <i>Canta muy bien</i>. They never agree with anything, because they are not describing a noun.' },
    { h: 'The trap: estar bueno vs estar bien', html: '<i>Estoy bien</i> means "I\'m well." <i>Estoy bueno</i>, said of oneself, colloquially means something closer to "I\'m good-looking/hot" — not remotely the same message, and a classic beginner slip.' }
  ],
  exponents: [
    { es: 'Es un buen libro.', en: "It's a good book.", register: 'neutral', note: 'bueno shortens to buen before a masculine singular noun' },
    { es: '—¿Cómo estás? —Estoy bien, gracias.', en: '—How are you? —I\'m well, thanks.', register: 'neutral', note: 'bien — the correct way to say you are well' },
    { es: 'Canta muy bien.', en: 'She sings very well.', register: 'neutral', note: 'bien describing HOW the action is done' },
    { es: 'Regular, no muy bien.', en: "So-so, not great.", register: 'coloquial' }
  ],
  contrasts: [
    { es: 'Estoy bien.', en: "I'm well.", note: 'correct — how you feel' },
    { es: 'Estoy bueno.', en: '(colloquially: "I look good/hot")', note: 'a different, unintended message — not the way to say you feel well' }
  ],
  pitfalls: [
    'Never use <i>bueno</i> where you mean "well" — <i>estoy bien</i>, not <i>*estoy bueno</i>, unless you really do mean the colloquial sense.',
    '<i>Bueno</i> shortens to <i>buen</i> only before a masculine singular noun: <i>un buen libro</i>, but <i>una buena idea</i> keeps its full form.'
  ],
  examples: [
    { es: 'Es una buena idea.', en: "It's a good idea." },
    { es: 'La comida está muy buena hoy.', en: 'The food is very good today.' },
    { es: '—¿Qué tal el examen? —Regular.', en: '—How was the exam? —So-so.' }
  ],
  probes: [
    { id: 'p:evalgen:sentirse', kind: 'mcq', q: '"How are you?" — "I\'m well":',
      options: ['Estoy bueno.', 'Estoy bien.', 'Soy bien.'], answer: 1 },
    { id: 'p:evalgen:apocope', kind: 'mcq', q: '"Es un ___ libro."',
      options: ['bueno', 'buen', 'buena'], answer: 1 },
    { id: 'p:evalgen:cloze', kind: 'cloze', text: 'Canta muy ___. (well, describing how she sings)', accept: ['bien'] },
    { id: 'p:evalgen:recall', kind: 'recall', front: 'To say you FEEL well, do you use bueno or bien?', back: 'bien' }
  ]
},

{
  id: 'nt-valor-precio-a1', strand: 'notion', cefr: 'A1', level: 1, theme: null,
  pcic: ['nociones_generales:A1:256', 'nociones_generales:A1:257', 'nociones_generales:A1:258'],
  title: 'Valor, precio: costar, barato, caro',
  summary: 'Costar and pagar split the money question in two — costar is what the ITEM does (it costs a figure), pagar is what the PERSON does (they hand over money) — and only costar answers "how much is it?"',
  sections: [
    { h: 'Costar: the item states its price', html: '<i>¿Cuánto cuesta?</i> is the standard way to ask a price; the item is the grammatical subject of <i>costar</i>: <i>Este libro cuesta quince euros.</i>' },
    { h: 'Barato and caro: judging the figure', html: 'These adjectives judge whether the price is high or low: <i>Es muy caro</i>, <i>Es bastante barato</i>.' },
    { h: 'Pagar: what the person does', html: '<i>Pagar</i> is the buyer\'s action, not the price itself: <i>Pago veinte euros</i> means "I hand over twenty euros," and cannot be used to ask a price.' }
  ],
  exponents: [
    { es: '—¿Cuánto cuesta esto? —Cuesta diez euros.', en: '—How much is this? —It costs ten euros.', register: 'neutral' },
    { es: 'Es muy caro para lo que es.', en: "It's very expensive for what it is.", register: 'neutral' },
    { es: 'Este mercado tiene precios baratos.', en: 'This market has cheap prices.', register: 'neutral' },
    { es: 'Pagué treinta euros por la entrada.', en: 'I paid thirty euros for the ticket.', register: 'neutral', note: 'pagar — the buyer\'s action' }
  ],
  contrasts: [
    { es: '¿Cuánto cuesta?', en: 'How much is it?', note: 'costar — asking the price, correct' },
    { es: '*¿Cuánto pagas?', en: '(does not ask a price)', note: 'pagar names the buyer\'s action, not the item\'s price' }
  ],
  pitfalls: [
    'To ask a price, use <i>¿Cuánto cuesta/es?</i> — not a question built on <i>pagar</i>, which describes the buyer\'s action, not the item\'s price.',
    '<i>Caro/barato</i> judge a price as high or low; they do not state a figure themselves.'
  ],
  examples: [
    { es: '—¿Cuánto cuestan estos zapatos? —Cuestan cuarenta euros.', en: '—How much are these shoes? —They cost forty euros.' },
    { es: 'En este barrio todo es más caro.', en: 'Everything is more expensive in this neighbourhood.' },
    { es: 'Al final pagué menos de lo que pensaba.', en: 'In the end I paid less than I expected.' }
  ],
  probes: [
    { id: 'p:valprec:preguntar', kind: 'mcq', q: 'Para preguntar el precio de algo, dices:',
      options: ['¿Cuánto pagas?', '¿Cuánto cuesta?', '¿Cuánto es caro?'], answer: 1 },
    { id: 'p:valprec:sujeto', kind: 'mcq', q: '"Este libro ___ quince euros." (the book is the subject)',
      options: ['paga', 'cuesta', 'compra'], answer: 1 },
    { id: 'p:valprec:cloze', kind: 'cloze', text: 'Es muy ___ para lo que es. (expensive)', accept: ['caro'] },
    { id: 'p:valprec:recall', kind: 'recall', front: 'Which verb names the ITEM\'s price, and which names the BUYER\'s action?', back: 'costar (item) vs pagar (buyer)' }
  ]
},

/* ============================================================================
 * BATCH — A2 grammar, seq 90-132 of spec/syllabus-draft.json (a targeted
 * subset: comparatives, article/quantifier usage beyond A1 distribution,
 * interrogatives/exclamatives, the clitic pronoun system, and the two basic
 * clause connectors si/porque. The eight tense-FORM units at this level
 * (presente irregular, imperfecto, indefinido, perfecto, imperativo,
 * gerundio, infinitivo, participio) are deferred: their usage contrast is
 * already taught by data/grammar.js's preterite-imperfect concept lesson,
 * and raw conjugation is drilled directly from data/verbs.js by the engine.
 * ========================================================================== */
{
  id: 'gr-comparativo-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:64', 'gramatica:A2:65', 'gramatica:A2:66', 'gramatica:A2:67'],
  title: 'Comparativos: superioridad, igualdad, inferioridad',
  summary: 'Every ordinary comparison in Spanish is built from three frames — más...que, tan...como, menos...que — but a handful of everyday adjectives refuse the pattern and use their own irregular comparative word instead.',
  sections: [
    { h: 'The three frames', html: '<b>Superiority:</b> <i>más + adjetivo/sustantivo + que</i> — <i>más alto que</i>. <b>Equality:</b> <i>tan + adjetivo + como</i> (or <i>tanto/a/os/as + sustantivo + como</i>) — <i>tan alto como</i>, <i>tanta paciencia como</i>. <b>Inferiority:</b> <i>menos...que</i> — <i>menos caro que</i>.' },
    { h: 'The irregulars', html: '<i>Bueno/malo</i> do not take <i>más</i>: <i>mejor</i> (better) and <i>peor</i> (worse) replace <i>*más bueno</i> and <i>*más malo</i> outright.' },
    { h: 'Grande and pequeño: two comparatives each', html: 'These have BOTH a regular form for physical size (<i>más grande</i>, <i>más pequeño</i>) and an irregular one reserved for AGE (<i>mayor</i>, <i>menor</i>): <i>mi hermano mayor</i> (my older brother), but <i>esta casa es más grande</i> (this house is bigger).' }
  ],
  contrasts: [
    { es: 'Este libro es mejor que el otro.', en: 'This book is better than the other.', note: 'mejor, never *más bueno' },
    { es: 'Soy tan alto como tú.', en: 'I am as tall as you.', note: 'equality: tan...como' },
    { es: 'Mi hermano mayor vive en Lima.', en: 'My older brother lives in Lima.', note: 'mayor for AGE' },
    { es: 'Esta casa es más grande que la mía.', en: 'This house is bigger than mine.', note: 'más grande for physical SIZE — a different word from mayor' }
  ],
  pitfalls: [
    'Never say <i>*más bueno</i> or <i>*más malo</i> — <i>mejor/peor</i> are the only comparatives for <i>bueno/malo</i>.',
    '<i>Mayor/menor</i> compare AGE; <i>más grande/más pequeño</i> compare physical SIZE — do not use one for the other\'s job.',
    'Equality with an adjective uses <i>tan</i>; equality with a noun uses <i>tanto/a/os/as</i>, which must agree — <i>tanta gente como</i>, not <i>*tan gente como</i>.'
  ],
  examples: [
    { es: 'Este piso es tan caro como el del centro.', en: 'This flat is as expensive as the one downtown.' },
    { es: 'Tengo menos tiempo que antes.', en: 'I have less time than before.' },
    { es: 'Ella es mayor que yo, pero yo soy más alto.', en: 'She is older than me, but I am taller.' }
  ],
  probes: [
    { id: 'p:comparat:irregular', kind: 'mcq', q: '"Este restaurante es ___ que el otro." (better)',
      options: ['más bueno', 'mejor', 'más bien'], answer: 1 },
    { id: 'p:comparat:edad', kind: 'mcq', q: '"Mi hermano ___ vive en Lima." (older, age)',
      options: ['más grande', 'mayor', 'más viejo'], answer: 1 },
    { id: 'p:comparat:cloze', kind: 'cloze', text: 'Soy ___ alto como tú.', accept: ['tan'] },
    { id: 'p:comparat:recall', kind: 'recall', front: 'Comparatives of bueno and malo', back: 'mejor, peor (never más bueno/más malo)' }
  ]
},

{
  id: 'gr-articulo-definido-valores-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:85', 'gramatica:A2:86', 'gramatica:A2:87', 'gramatica:A2:88', 'gramatica:A2:89'],
  title: 'El artículo definido: usos más allá de "the"',
  summary: 'Beyond simply meaning "the," the definite article marks something the situation already makes obvious, states a fact about a whole category, and can replace a possessive with body parts — jobs English hands to entirely different words.',
  sections: [
    { h: 'Deictic: obvious from the situation', html: 'A first mention can still take <i>el/la</i> if the thing is visibly present or contextually obvious: <i>¿Puedes cerrar la puerta?</i> — nobody had to mention the door first; it is simply there.' },
    { h: 'Generic value', html: 'The article states something about an ENTIRE category, not one specific member of it: <i>El curso es interesante</i> can mean "courses (in general) are interesting" as much as "the course is." English usually drops the article for this generic sense; Spanish keeps it.' },
    { h: 'Standing in for a possessive', html: 'With body parts, Spanish typically uses the article where English uses a possessive: <i>Me duele la cabeza</i>, not <i>*Me duele mi cabeza</i> — the reflexive/object pronoun already shows whose head it is.' }
  ],
    contrasts: [
    { es: 'Me duele la cabeza.', en: 'My head hurts.', note: 'correct — article, not possessive' },
    { es: '*Me duele mi cabeza.', en: '(unnatural)', note: 'doubling the possession is redundant once "me" already marks whose head it is' }
  ],
  pitfalls: [
    'Do not add a possessive to a body part already marked by a reflexive/object pronoun: <i>me lavo las manos</i>, not <i>*me lavo mis manos</i>.',
    'A generic statement about a whole category still takes the article in Spanish, where English often drops it: <i>Los perros son leales</i> ("Dogs are loyal"), not a bare noun.'
  ],
  examples: [
    { es: 'Se rompió la pierna esquiando.', en: 'He broke his leg skiing.' },
    { es: 'El chocolate engorda.', en: 'Chocolate is fattening.' },
    { es: '¿Me pasas la sal?', en: 'Can you pass me the salt?' }
  ],
  probes: [
    { id: 'p:artdefval:cuerpo', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Me duele mi cabeza.', 'Me duele la cabeza.', 'Me duele una cabeza.'], answer: 1 },
    { id: 'p:artdefval:generico', kind: 'mcq', q: '"El chocolate engorda" habla de:',
      options: ['un chocolate concreto', 'el chocolate en general', 'ningún chocolate'], answer: 1 },
    { id: 'p:artdefval:cloze', kind: 'cloze', text: '¿Me pasas ___ sal? (the salt, visible on the table)', accept: ['la'] },
    { id: 'p:artdefval:recall', kind: 'recall', front: 'What does the article usually replace with body parts?', back: 'a possessive (me duele la cabeza, not mi cabeza)' }
  ]
},

{
  id: 'gr-articulo-indefinido-valores-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:109', 'gramatica:A2:110', 'gramatica:A2:111', 'gramatica:A2:112', 'gramatica:A2:113'],
  title: 'El artículo indefinido: valor aproximativo',
  summary: 'Unos/unas placed before a number does not mean "some of them" — it softens the number into an estimate, "around twenty," and the same mechanism lets the article replace a possessive the way la/el does with body parts.',
  sections: [
    { h: 'Approximation before a number', html: '<i>Unas veinte personas</i> means "around twenty people," not a random subset of some twenty people. This is the same indefinite article, doing an entirely different job than "a/an."' },
    { h: 'Un/una with body parts', html: 'Parallel to the definite article, the indefinite one also replaces a possessive when the exact identity does not matter: <i>Me duele un dedo</i> ("one of my fingers hurts"), not <i>*me duele mi dedo</i>.' },
    { h: 'Nominalizing ellipsis', html: 'Once the noun has been named, <i>un/una</i> can carry the sentence alone: <i>Hay dos ventanas; una está rota</i> — "one [of them]" needs no repeated noun.' }
  ],
    contrasts: [
    { es: 'unas veinte personas', en: 'around twenty people', note: 'approximation — the real number is close to twenty' },
    { es: 'veinte personas', en: 'twenty people', note: 'exact' }
  ],
  pitfalls: [
    '<i>Unos/unas</i> before a number always signals "approximately," never "some (but not all) of."',
    'Like the definite article, the indefinite one also replaces a possessive with body parts when identity is not the point: <i>un dedo</i>, not <i>*mi dedo</i>, when it does not matter which finger.'
  ],
  examples: [
    { es: 'Cuesta unos treinta euros.', en: 'It costs around thirty euros.' },
    { es: 'Me ha salido una mancha en la camisa.', en: 'I\'ve got a stain on my shirt.' },
    { es: 'Compré tres libros; uno era en español.', en: 'I bought three books; one was in Spanish.' }
  ],
  probes: [
    { id: 'p:artindval:aproximado', kind: 'mcq', q: '"Había unas veinte personas" significa:',
      options: ['exactamente veinte', 'aproximadamente veinte', 'menos de veinte'], answer: 1 },
    { id: 'p:artindval:cuerpo', kind: 'mcq', q: '¿Cuál es correcto? (no importa cuál dedo)',
      options: ['Me duele mi dedo.', 'Me duele un dedo.', 'Me duele el mi dedo.'], answer: 1 },
    { id: 'p:artindval:cloze', kind: 'cloze', text: 'Cuesta ___ treinta euros. (around)', accept: ['unos'] },
    { id: 'p:artindval:recall', kind: 'recall', front: '"unos/unas" + a number means what?', back: 'approximately (not "some of")' }
  ]
},

{
  id: 'gr-nombres-escuetos-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:124', 'gramatica:A2:125', 'gramatica:A2:126'],
  title: 'Nombres escuetos: sin artículo ni cuantificador',
  summary: 'Dropping every determiner — no article, no number, nothing — turns a noun into an unspecified amount: a bare singular for something uncountable, a bare plural for countable things taken in no particular quantity.',
  sections: [
    { h: 'Bare singular: mass nouns', html: 'An uncountable noun with no determiner at all names an unspecified amount: <i>Bebe agua</i> ("she drinks water" — no particular quantity in mind).' },
    { h: 'Bare plural: countable nouns', html: 'A countable noun in the bare plural means "more than one, number unspecified": <i>Escribe cartas</i> ("she writes letters" — an unstated number of them).' },
    { h: 'Where it breaks down', html: 'Some verbs need a properly "delimited" subject and reject a fully bare noun there: <i>*Gente llegó tarde</i> sounds off; Spanish prefers <i>Llegó gente tarde</i> (verb first) or adds a determiner.' }
  ],
    contrasts: [
    { es: 'Bebe agua.', en: 'She drinks water.', note: 'bare singular — mass, unspecified amount' },
    { es: 'Bebe el agua.', en: 'She drinks the water.', note: 'specific, known water — a completely different claim' }
  ],
  pitfalls: [
    'A bare noun opening a sentence as its subject can sound odd with certain verbs — Spanish often prefers to put the verb first instead: <i>Llegó gente</i>, not <i>*Gente llegó</i>.',
    'Dropping the determiner changes the meaning from something specific to something unspecified — it is a real grammatical choice, not free variation.'
  ],
  examples: [
    { es: 'No tengo dinero esta semana.', en: "I don't have money this week." },
    { es: 'Compramos fruta en el mercado.', en: 'We buy fruit at the market.' },
    { es: 'Hay estudiantes en el pasillo.', en: 'There are students in the corridor.' }
  ],
  probes: [
    { id: 'p:escuetos:masa', kind: 'mcq', q: '"She drinks water" (unspecified amount):',
      options: ['Bebe el agua.', 'Bebe agua.', 'Bebe una agua.'], answer: 1 },
    { id: 'p:escuetos:orden', kind: 'mcq', q: 'Más natural:',
      options: ['Gente llegó tarde.', 'Llegó gente tarde.', 'La gente llegó tarde nunca.'], answer: 1 },
    { id: 'p:escuetos:cloze', kind: 'cloze', text: 'No tengo ___ esta semana. (money, unspecified amount)', accept: ['dinero'] },
    { id: 'p:escuetos:recall', kind: 'recall', front: 'A bare PLURAL noun (no article, no number) means what?', back: 'more than one, unspecified how many' }
  ]
},

{
  id: 'gr-interrogativos-exclamativos-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:277', 'gramatica:A2:279', 'gramatica:A2:281', 'gramatica:A2:285', 'gramatica:A2:286', 'gramatica:A2:287'],
  title: 'Interrogativos y exclamativos: qué, cuál, cómo',
  summary: '¿Qué? asks for a definition or description; ¿cuál? asks you to pick from a set that is already understood — English collapses both into "what," which is exactly why Spanish learners blur them, especially when asking someone\'s name.',
  sections: [
    { h: 'Qué: open-ended', html: '<i>¿Qué es esto?</i> asks what something IS, with no assumed set of options — it wants a definition or description.' },
    { h: 'Cuál: pick from a set', html: '<i>¿Cuál prefieres, el rojo o el azul?</i> asks you to choose among known options. Famously, <i>¿Cuál es tu nombre?</i> — not <i>*¿Qué es tu nombre?</i> — is how Spanish asks your name, treating it as one answer selected from all possible names.' },
    { h: 'The same words, exclamative', html: 'Drop the question and add feeling, and <i>qué</i> becomes an exclamation with no change of form: <i>¡Qué bonito!</i>, <i>¡Qué bien!</i>, <i>¡Qué bonito es!</i> — with an adjective, an adverb, or a full copular clause.' }
  ],
    contrasts: [
    { es: '¿Qué es Luis?', en: 'What does Luis do (profession)?', note: 'open definition — asking what category he falls into' },
    { es: '¿Cuál es tu nombre?', en: "What's your name?", note: 'cuál — selecting among possible names, not defining "name" itself' }
  ],
  pitfalls: [
    '"What is your name?" is <i>¿Cuál es tu nombre?</i> in Spanish, never <i>*¿Qué es tu nombre?</i>',
    'The exclamative <i>qué</i> never changes form for gender or number — <i>¡Qué bonitas!</i> uses the plural adjective, not a plural qué.'
  ],
  examples: [
    { es: '¿Cuál de estos dos coches te gusta más?', en: 'Which of these two cars do you like more?' },
    { es: '¡Qué difícil es este examen!', en: 'This exam is so hard!' },
    { es: '¿Qué haces los fines de semana?', en: 'What do you do on weekends?' }
  ],
  probes: [
    { id: 'p:interexcl:nombre', kind: 'mcq', q: '"What\'s your name?" en español:',
      options: ['¿Qué es tu nombre?', '¿Cuál es tu nombre?', '¿Cómo es tu nombre?'], answer: 1 },
    { id: 'p:interexcl:eleccion', kind: 'mcq', q: '"___ prefieres, este o aquel?" (choosing between two)',
      options: ['Qué', 'Cuál', 'Cómo'], answer: 1 },
    { id: 'p:interexcl:cloze', kind: 'cloze', text: '¡___ bien cocinas! (exclamative "how well")', accept: ['Qué', 'qué'] },
    { id: 'p:interexcl:recall', kind: 'recall', front: 'qué vs cuál — which one asks you to CHOOSE from known options?', back: 'cuál' }
  ]
},

{
  id: 'gr-cuantificadores-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:176', 'gramatica:A2:177', 'gramatica:A2:178', 'gramatica:A2:183', 'gramatica:A2:184', 'gramatica:A2:185'],
  title: 'Cuantificadores: todo, otro, demasiado, nada',
  summary: 'Todo needs a determiner riding along with it — todos LOS días, never a bare "todo días" — while otro flatly refuses one, because otro already does the determiner\'s job by itself.',
  sections: [
    { h: 'Todo: needs a companion determiner', html: '<i>Todo/toda/todos/todas</i> must combine with an article, possessive or demonstrative before a noun: <i>todos los días</i>, <i>todos mis amigos</i> — never a bare <i>*todo días</i>. Alone, without a noun, it can answer a question directly: <i>—¿Comiste algo? —Todo.</i>' },
    { h: 'Otro: never takes an article', html: '<i>Otro café</i>, never <i>*un otro café</i> — a direct calque from English "another" that does not work in Spanish. <i>Otro</i> already carries the indefinite sense that <i>un</i> would add.' },
    { h: 'Demasiado and nada', html: '<i>Demasiado</i> agrees when it quantifies a noun (<i>demasiada gente</i>) but freezes when it modifies a verb or adjective (<i>habla demasiado</i>, <i>es demasiado caro</i>) — the same agree/freeze split as <i>mucho/poco</i>. <i>Nada</i> sits at the negative pole and, like <i>nunca</i>, needs <i>no</i> before the verb if it follows it: <i>No sé nada</i>.' }
  ],
    contrasts: [
    { es: '¿Me das otro café?', en: 'Can I have another coffee?', note: 'correct — otro alone' },
    { es: '*¿Me das un otro café?', en: '(wrong — calque from English "another")', note: 'otro never takes an article' }
  ],
  pitfalls: [
    'Never put an article before <i>otro</i> — this is one of the most persistent transfer errors from English "another."',
    '<i>Todo</i> before a countable noun needs a determiner riding with it; it cannot stand alone in front of the noun.'
  ],
  examples: [
    { es: 'Todas mis amigas viven cerca.', en: 'All my friends live nearby.' },
    { es: 'Prueba otra vez.', en: 'Try again (another time).' },
    { es: 'Este examen es demasiado difícil.', en: 'This exam is too difficult.' }
  ],
  probes: [
    { id: 'p:cuant:otro', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['un otro café', 'otro café', 'el otro un café'], answer: 1 },
    { id: 'p:cuant:todo', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['todo días', 'todos los días', 'todo los días'], answer: 1 },
    { id: 'p:cuant:cloze', kind: 'cloze', text: 'Este examen es ___ difícil. (too, modifying the adjective — invariable)', accept: ['demasiado'] },
    { id: 'p:cuant:recall', kind: 'recall', front: 'Does "otro" ever take an article in Spanish?', back: 'no — never (otro café, not un otro café)' }
  ]
},

{
  id: 'gr-pronombres-atonos-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:231', 'gramatica:A2:232', 'gramatica:A2:233', 'gramatica:A2:240', 'gramatica:A2:241', 'gramatica:A2:244'],
  title: 'Pronombres átonos: OD y OI',
  summary: 'Me, te, nos and os do double duty as both direct and indirect object, but the third person splits — lo/la/los/las for the direct object, le/les for the indirect — which is exactly where confusion, and le doubling as lo, starts.',
  sections: [
    { h: 'Shared forms: 1st and 2nd person', html: '<i>Me, te, nos, os</i> work identically whether the pronoun is a direct or an indirect object: <i>me ve</i> (sees me, OD), <i>me da el libro</i> (gives me the book, OI).' },
    { h: 'Third person splits', html: 'Direct object: <i>lo/la/los/las</i>, agreeing in gender and number with what they replace. Indirect object: <i>le/les</i>, with no gender distinction at all.' },
    { h: 'Le becomes se before lo/la/los/las', html: 'When both an indirect and a direct object pronoun combine in the third person, <i>le/les</i> is replaced by <i>se</i>: <i>Le doy el libro → Se lo doy</i>, never <i>*Le lo doy</i>.' }
  ],
    contrasts: [
    { es: 'Le doy el libro.', en: 'I give him/her the book.', note: 'le alone — no direct object pronoun yet' },
    { es: 'Se lo doy.', en: 'I give it to him/her.', note: 'le → se, forced by the following lo' }
  ],
  pitfalls: [
    '<i>*Le lo doy</i> is always wrong — <i>le/les</i> becomes <i>se</i> immediately before <i>lo/la/los/las</i>, with no exception.',
    'The direct-object pronoun must agree in gender with what it replaces (<i>lo</i> for masculine, <i>la</i> for feminine); the indirect-object <i>le/les</i> never changes for gender.'
  ],
  examples: [
    { es: '¿Me prestas el coche? — Sí, te lo presto.', en: '—Will you lend me the car? —Yes, I\'ll lend it to you.' },
    { es: 'No los he visto desde ayer.', en: "I haven't seen them since yesterday." },
    { es: 'Se lo expliqué dos veces.', en: 'I explained it to them/him/her twice.' }
  ],
  probes: [
    { id: 'p:pratonos:sele', kind: 'mcq', q: '"Le doy el libro" + "lo" combinados:',
      options: ['Le lo doy.', 'Se lo doy.', 'Lo le doy.'], answer: 1 },
    { id: 'p:pratonos:genero', kind: 'mcq', q: '"¿Conoces a María?" — "Sí, ___ conozco."',
      options: ['lo', 'la', 'le'], answer: 1 },
    { id: 'p:pratonos:cloze', kind: 'cloze', text: '¿Me prestas el coche? — Sí, te ___ presto.', accept: ['lo'] },
    { id: 'p:pratonos:recall', kind: 'recall', front: 'What does "le/les" become right before lo/la/los/las?', back: 'se' }
  ]
},

{
  id: 'gr-pronombres-tonicos-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:252', 'gramatica:A2:253', 'gramatica:A2:255', 'gramatica:A2:256'],
  title: 'Pronombres tónicos: mí, ti, conmigo',
  summary: 'After a preposition, yo and tú switch to the special forms mí and ti — and con fuses with them into two irregular words, conmigo and contigo, that no ordinary rule for combining a preposition with a pronoun would predict.',
  sections: [
    { h: 'Mí and ti after a preposition', html: 'Most prepositions take the tonic forms <i>mí</i> and <i>ti</i> instead of <i>yo/tú</i>: <i>para mí</i>, <i>sin ti</i>, <i>de mí</i>. Every other person keeps its subject-pronoun shape (<i>para él</i>, <i>para nosotros</i>).' },
    { h: 'Con + mí/ti: irregular fusion', html: '<i>Con</i> does not combine normally — it fuses into <i>conmigo</i> and <i>contigo</i>, single irregular words. <i>*con mí</i> and <i>*con ti</i> simply do not exist.' },
    { h: 'Doubling for emphasis', html: 'A tonic pronoun after <i>a</i> often accompanies the unstressed one for contrast or clarity, rather than replacing it: <i>A mí me gusta el café, a ti te gusta el té</i> — both pronouns appear together.' }
  ],
    contrasts: [
    { es: '¿Vienes conmigo?', en: 'Are you coming with me?', note: 'correct — the fused irregular form' },
    { es: '*¿Vienes con mí?', en: '(does not exist)', note: 'con never combines with mí the ordinary way' }
  ],
  pitfalls: [
    '<i>Conmigo/contigo</i> are irregular, fused words — never write or say <i>*con mí</i>, <i>*con ti</i>.',
    'When you use the tonic pronoun for emphasis (<i>a mí, a ti</i>), the unstressed pronoun (<i>me, te</i>) still has to appear too — the tonic form does not replace it.'
  ],
  examples: [
    { es: '¿Hay algún mensaje para mí?', en: 'Is there any message for me?' },
    { es: 'No puedo vivir sin ti.', en: "I can't live without you." },
    { es: 'A ella le encanta el jazz; a mí, el rock.', en: 'She loves jazz; I love rock.' }
  ],
  probes: [
    { id: 'p:prtonicos:conmigo', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['con mí', 'conmigo', 'con yo'], answer: 1 },
    { id: 'p:prtonicos:preposicion', kind: 'mcq', q: '"Este regalo es para ___." (you, singular informal)',
      options: ['tú', 'ti', 'te'], answer: 1 },
    { id: 'p:prtonicos:cloze', kind: 'cloze', text: 'No puedo vivir sin ___. (you)', accept: ['ti'] },
    { id: 'p:prtonicos:recall', kind: 'recall', front: 'What are the irregular fused forms of con + mí/ti?', back: 'conmigo, contigo' }
  ]
},

{
  id: 'gr-condicionales-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:574', 'gramatica:A2:575', 'gramatica:A2:576', 'gramatica:A2:577'],
  title: 'Condicionales: si + presente',
  summary: 'At this level a si-clause stays entirely in the indicative — a real, open condition takes the present tense in both halves, with no subjunctive involved yet, and the word "si" itself is easy to confuse in spelling with "sí."',
  sections: [
    { h: 'The pattern', html: 'A real, open possibility: <i>si + presente de indicativo</i>, and the main clause also in the present (or an imperative): <i>Si quieres ir al cine, puedes comprar la entrada por Internet.</i>' },
    { h: 'Si vs sí', html: '<i>Si</i> (if — the conjunction) never carries a written accent. <i>Sí</i> (yes; or the emphatic/reflexive pronoun) always does. They sound identical but are spelled differently and mean unrelated things.' }
  ],
    contrasts: [
    { es: 'Si quieres, vamos.', en: 'If you want, we\'ll go.', note: 'si — the conjunction, no accent' },
    { es: '—¿Vamos? —Sí, vamos.', en: '—Shall we go? —Yes, let\'s go.', note: 'sí — "yes," always accented' }
  ],
  pitfalls: [
    '<i>Si</i> (if) is never accented; <i>sí</i> (yes) always is — this is a common written error, not a matter of pronunciation.',
    'At this level, keep both halves of a real condition in the present indicative — do not reach for the subjunctive yet.'
  ],
  examples: [
    { es: 'Si no entiendes, pregúntame.', en: "If you don't understand, ask me." },
    { es: 'Si tienes tiempo esta tarde, llámame.', en: 'If you have time this afternoon, call me.' },
    { es: 'Si hace buen tiempo, vamos a la playa.', en: "If the weather's good, we're going to the beach." }
  ],
  probes: [
    { id: 'p:condic:acento', kind: 'mcq', q: '"Si quieres" (if) — ¿lleva acento?',
      options: ['sí, siempre', 'no, nunca', 'solo en preguntas'], answer: 1 },
    { id: 'p:condic:tiempo', kind: 'mcq', q: '"Si ___ (llover), no salimos." (real condition, present)',
      options: ['llueve', 'llover', 'llovería'], answer: 0 },
    { id: 'p:condic:cloze', kind: 'cloze', text: '___ tienes hambre, hay fruta. (if)', accept: ['Si', 'si'] },
    { id: 'p:condic:recall', kind: 'recall', front: 'Does "si" (if) carry a written accent?', back: 'no — never (sí with an accent means "yes")' }
  ]
},

{
  id: 'gr-causales-a2', strand: 'grammar', cefr: 'A2', level: 2, theme: null,
  pcic: ['gramatica:A2:558', 'gramatica:A2:559', 'gramatica:A2:560', 'gramatica:A2:561', 'gramatica:A2:562'],
  title: 'Causales: porque, como, por',
  summary: 'Porque and como state the exact same cause-effect logic, but only their position is interchangeable — como must open the sentence, porque almost always follows the result it explains.',
  sections: [
    { h: 'Porque: after the result', html: '<i>No he venido porque estaba enfermo</i> — the cause follows the effect it explains, and this is by far the most common order.' },
    { h: 'Como: before the result', html: '<i>Como estaba enfermo, no he venido</i> says exactly the same thing, but <i>como</i> must open the sentence — you cannot move it to the end the way <i>porque</i> stays at the end.' },
    { h: 'Por + noun/infinitive: no full clause needed', html: 'When the cause is short, <i>por</i> attaches directly to a noun or infinitive rather than a full clause: <i>Trabajo por dinero</i>, <i>No vino por el mal tiempo</i>.' }
  ],
    contrasts: [
    { es: 'Como tengo hambre, voy a comer.', en: 'Since I\'m hungry, I\'m going to eat.', note: 'como opens the sentence' },
    { es: 'Voy a comer porque tengo hambre.', en: "I'm going to eat because I'm hungry.", note: 'porque — same logic, opposite order' }
  ],
  pitfalls: [
    '<i>Como</i> (cause) MUST open the sentence — <i>*Voy a comer, como tengo hambre</i> does not work; switch to <i>porque</i> if the cause comes second.',
    'Do not confuse causal <i>como</i> with <i>como</i> meaning "like/as" (<i>Habla como un experto</i>) — same word, unrelated function, decided entirely by context.'
  ],
  examples: [
    { es: 'Como no tenía dinero, no fui al concierto.', en: "Since I didn't have money, I didn't go to the concert." },
    { es: 'Llegamos tarde porque hubo un accidente.', en: 'We arrived late because there was an accident.' },
    { es: 'Lo hizo por amor, no por obligación.', en: 'She did it out of love, not obligation.' }
  ],
  probes: [
    { id: 'p:causal:posicion', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Voy a comer, como tengo hambre.', 'Como tengo hambre, voy a comer.', 'Tengo hambre como voy a comer.'], answer: 1 },
    { id: 'p:causal:conector', kind: 'mcq', q: '"Llegamos tarde ___ hubo un accidente."',
      options: ['como', 'porque', 'si'], answer: 1 },
    { id: 'p:causal:cloze', kind: 'cloze', text: '___ no tenía dinero, no fui. (since, opening the sentence)', accept: ['Como', 'como'] },
    { id: 'p:causal:recall', kind: 'recall', front: 'Which causal connector MUST open the sentence — porque or como?', back: 'como' }
  ]
},

/* ============================================================================
 * BATCH — A2 notion, seq 136-160 of spec/syllabus-draft.json, wave 1 of 2
 * (several thin sibling units merged: cualidad-general + formas-y-figuras
 * share "ser de + material" and physical description; posicion-relativa +
 * distancia share the de-marked position pattern)
 * ========================================================================== */
{
  id: 'nt-existencia-inexistencia-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:3', 'nociones_generales:A2:4', 'nociones_generales:A2:5'],
  title: 'Existencia, inexistencia: no hay ningún, nacer y morir',
  summary: 'Denying existence needs haber together with ningún, nadie or nada — all built the same negative way — and nacer/morir mark the two edges of existence itself, its start and its end.',
  sections: [
    { h: 'Denying existence', html: '<i>No hay ningún/ninguna</i> + noun states flatly that nothing of that kind exists: <i>No hay ninguna farmacia en esta calle.</i> <i>Ningún/ninguna</i> stays SINGULAR even where English expects a plural ("there aren\'t any pharmacies").' },
    { h: 'No hay nadie / nada', html: 'The fully impersonal negatives follow the same <i>hay</i> pattern: <i>No hay nadie en casa</i>, <i>No hay nada en la nevera</i>.' },
    { h: 'The edges of existence', html: '<i>Nacer</i> (to be born) and <i>morir</i> (to die) frame existence itself, the beginning and the end that <i>hay</i> only ever describes in the middle.' }
  ],
  exponents: [
    { es: 'No hay ninguna farmacia en esta calle.', en: "There isn't a single pharmacy on this street.", register: 'neutral', note: 'ningún/ninguna — singular, even for "not any"' },
    { es: 'No hay nadie en la oficina.', en: "There's nobody in the office.", register: 'neutral' },
    { es: 'Mi abuelo nació en 1940 y murió en 2015.', en: 'My grandfather was born in 1940 and died in 2015.', register: 'neutral' },
    { es: 'Estoy seguro de que es verdad.', en: "I'm sure it's true.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'No hay ninguna farmacia.', en: "There isn't a single pharmacy.", note: 'ningún/ninguna — always singular' },
    { es: '*No hay ningunas farmacias.', en: '(wrong)', note: 'ningún/ninguna do not pluralize this way' }
  ],
  pitfalls: [
    '<i>Ningún/ninguna</i> stays singular even when denying something you would count in the plural in English.',
    'Like <i>nunca</i>, these negatives need <i>no</i> before the verb when they themselves come after it: <i>No hay nada</i>, but <i>Nada hay</i> (rare, literary) needs no extra <i>no</i>.'
  ],
  examples: [
    { es: 'No hay ningún problema.', en: "There's no problem at all." },
    { es: '¿Nació en España o en México?', en: 'Was he born in Spain or in Mexico?' },
    { es: 'Es probable que llueva esta tarde.', en: "It's likely to rain this afternoon." }
  ],
  probes: [
    { id: 'p:existinex:singular', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['No hay ningunas farmacias.', 'No hay ninguna farmacia.', 'No hay ningún farmacias.'], answer: 1 },
    { id: 'p:existinex:extremos', kind: 'mcq', q: 'Los dos verbos que marcan el principio y el fin de la existencia:',
      options: ['nacer, morir', 'empezar, terminar', 'ser, estar'], answer: 0 },
    { id: 'p:existinex:cloze', kind: 'cloze', text: 'No hay ___ en la oficina. (nobody)', accept: ['nadie'] },
    { id: 'p:existinex:recall', kind: 'recall', front: 'Is "ningún/ninguna" ever plural?', back: 'no — always singular, even for "not any"' }
  ]
},

{
  id: 'nt-cualidad-material-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:12', 'nociones_generales:A2:13', 'nociones_generales:A2:213', 'nociones_generales:A2:214', 'nociones_generales:A2:215'],
  title: 'Cualidad y material: ser de + material',
  summary: 'Ser de + material names what something is made from — the exact same "ser de" pattern that states a person\'s origin now states an object\'s composition, with no article and no exception.',
  sections: [
    { h: 'Ser de + material', html: '<i>La camisa es de algodón</i> — no article between <i>de</i> and the material, just like <i>ser de</i> + place for a person\'s origin.' },
    { h: 'Shape', html: 'Basic shape description uses <i>ser</i> + adjective: <i>Es redondo</i>, <i>Es cuadrado</i>.' },
    { h: 'Texture and other senses', html: '<i>Fuerte, seco, limpio, sucio</i> describe how something feels; <i>ruido</i> and <i>oír</i> cover what it sounds like — the description of an object is rarely just visual.' }
  ],
  exponents: [
    { es: '¿De qué color es? — Es azul.', en: '—What colour is it? —It\'s blue.', register: 'neutral' },
    { es: 'La mesa es de madera.', en: 'The table is made of wood.', register: 'neutral', note: 'ser de + material, no article' },
    { es: 'Este pan está muy seco.', en: 'This bread is very dry.', register: 'neutral' },
    { es: 'He oído un ruido extraño.', en: "I've heard a strange noise.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'La mesa es de madera.', en: 'The table is made of wood.', note: 'material — ser de, no article' },
    { es: 'Soy de México.', en: "I'm from Mexico.", note: 'the identical construction, stating origin instead of material' }
  ],
  pitfalls: [
    'Never insert an article between <i>de</i> and the material: <i>es de algodón</i>, not <i>*es de un algodón</i>.',
    'Object description in Spanish routinely reaches beyond sight — texture (<i>seco, limpio</i>) and sound (<i>ruido</i>) are just as natural as colour or shape.'
  ],
  examples: [
    { es: 'Esta silla es de plástico y aquella es de metal.', en: 'This chair is plastic and that one is metal.' },
    { es: 'El anillo es de plata, no de oro.', en: "The ring is silver, not gold." },
    { es: 'La sopa está muy rica.', en: 'The soup is delicious.' }
  ],
  probes: [
    { id: 'p:cualmat:construccion', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['es de un algodón', 'es de algodón', 'es un algodón'], answer: 1 },
    { id: 'p:cualmat:paralelo', kind: 'mcq', q: '"La mesa es de madera" usa la misma estructura que:',
      options: ['Soy de México.', 'Estoy en México.', 'Tengo madera.'], answer: 0 },
    { id: 'p:cualmat:cloze', kind: 'cloze', text: 'El anillo es de ___. (silver)', accept: ['plata'] },
    { id: 'p:cualmat:recall', kind: 'recall', front: 'Does "ser de + material" take an article?', back: 'no — es de algodón, never es de un algodón' }
  ]
},

{
  id: 'nt-cambio-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:209', 'nociones_generales:A2:210', 'nociones_generales:A2:211'],
  title: 'Cambio: cambiar por, cambiar de',
  summary: 'Cambiar splits into two prepositions with two different jobs — cambiar POR swaps one thing for another, cambiar DE simply switches which one you have, with no exchange implied at all.',
  sections: [
    { h: 'Cambiar por: an exchange', html: 'One thing replaces another, typically of the same kind: <i>Quería cambiar euros por pesos</i> — money for money.' },
    { h: 'Cambiar de: switching, no exchange', html: 'No swap is implied, just a change: <i>cambiar de país</i>, <i>cambiar de casa</i>. No article follows <i>de</i> here either.' }
  ],
  exponents: [
    { es: 'Quería cambiar euros por pesos.', en: 'I wanted to exchange euros for pesos.', register: 'neutral', note: 'cambiar por — a real exchange' },
    { es: 'Cambiamos de piso el mes pasado.', en: 'We moved flats last month.', register: 'neutral', note: 'cambiar de — no exchange, just a switch' },
    { es: 'Tuvo que cambiar de opinión.', en: 'She had to change her mind.', register: 'neutral' },
    { es: '¿Dónde puedo cambiar dólares por euros?', en: 'Where can I exchange dollars for euros?', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Cambié euros por dólares.', en: 'I exchanged euros for dollars.', note: 'cambiar POR — a genuine exchange' },
    { es: 'Voy a cambiar de trabajo.', en: "I'm going to change jobs.", note: 'cambiar DE — simply switching, no "exchange" implied' }
  ],
  pitfalls: [
    '<i>Cambiar de</i> + noun never takes an article: <i>cambiar de casa</i>, not <i>*cambiar de una casa</i> or <i>*cambiar de la casa</i>.',
    'Do not use <i>por</i> when there is no actual exchange happening — a job change is <i>cambiar de trabajo</i>, not <i>*cambiar trabajo por trabajo</i>.'
  ],
  examples: [
    { es: '¿Dónde puedo cambiar dinero por aquí?', en: 'Where can I exchange money around here?' },
    { es: 'Cambiamos de piso el mes pasado.', en: 'We moved (changed flats) last month.' },
    { es: 'Tuvo que cambiar de opinión.', en: 'She had to change her mind.' }
  ],
  probes: [
    { id: 'p:cambio:por', kind: 'mcq', q: '"Cambié mi coche viejo ___ uno nuevo." (exchange)',
      options: ['de', 'por', 'a'], answer: 1 },
    { id: 'p:cambio:de', kind: 'mcq', q: '"Voy a cambiar ___ trabajo." (just switching)',
      options: ['por', 'de', 'con'], answer: 1 },
    { id: 'p:cambio:cloze', kind: 'cloze', text: 'Cambiamos ___ piso el mes pasado. (de)', accept: ['de'] },
    { id: 'p:cambio:recall', kind: 'recall', front: 'cambiar POR vs cambiar DE — which one implies a real exchange?', back: 'cambiar por' }
  ]
},

{
  id: 'nt-necesidad-obligacion-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:22', 'nociones_generales:A2:23', 'nociones_generales:A2:24'],
  title: 'Necesidad: necesitar, es necesario',
  summary: 'Necesitar makes YOU the subject who needs something; es necesario makes the THING or ACTION itself the subject that is needed — the identical fact, stated from two different grammatical directions.',
  sections: [
    { h: 'Necesitar: the person needs', html: '<i>Necesito dinero</i>, <i>Necesito descansar</i> — the person doing the needing is the grammatical subject.' },
    { h: 'Es necesario: the need itself is stated', html: '<i>Es necesario descansar</i> says the same thing impersonally — nobody in particular is named as needing it, just that it is necessary.' },
    { h: 'Tener suerte: a different idea entirely', html: '<i>Tener suerte</i> means "to be lucky," not "to need luck" — do not confuse it with the necessity pattern above.' }
  ],
  exponents: [
    { es: 'Necesito descansar un poco.', en: 'I need to rest a little.', register: 'neutral', note: 'necesitar — personal subject' },
    { es: 'Es necesario reservar con antelación.', en: 'It is necessary to book in advance.', register: 'neutral', note: 'impersonal — same idea, no subject named' },
    { es: 'Necesitamos más información.', en: 'We need more information.', register: 'neutral' },
    { es: 'Tuvimos mucha suerte con el tiempo.', en: 'We were very lucky with the weather.', register: 'neutral', note: 'tener suerte — unrelated to necessity' }
  ],
  contrasts: [
    { es: 'Necesito descansar.', en: 'I need to rest.', note: 'the person is the subject' },
    { es: 'Es necesario descansar.', en: 'It is necessary to rest.', note: 'impersonal — the same idea, no one named' }
  ],
  pitfalls: [
    '<i>Tener suerte</i> means "to be lucky" — it has nothing to do with necessity, despite using <i>tener</i> like <i>necesitar</i>-adjacent expressions.',
    'Do not add a personal subject to <i>es necesario</i> at this level; keep it impersonal + infinitive.'
  ],
  examples: [
    { es: 'Necesitamos más tiempo para terminar.', en: 'We need more time to finish.' },
    { es: 'Es necesario reservar con antelación.', en: 'It is necessary to book in advance.' },
    { es: 'Tuvimos mucha suerte con el tiempo.', en: 'We were very lucky with the weather.' }
  ],
  probes: [
    { id: 'p:necesid:impersonal', kind: 'mcq', q: 'Versión impersonal de "Necesito descansar":',
      options: ['Tengo que descansar necesario.', 'Es necesario descansar.', 'Necesario es descansar yo.'], answer: 1 },
    { id: 'p:necesid:suerte', kind: 'mcq', q: '"Tener suerte" significa:',
      options: ['necesitar algo', 'ser afortunado', 'tener prisa'], answer: 1 },
    { id: 'p:necesid:cloze', kind: 'cloze', text: '___ reservar con antelación. (it is necessary)', accept: ['Es necesario', 'es necesario'] },
    { id: 'p:necesid:recall', kind: 'recall', front: 'necesitar vs es necesario — which one names a personal subject?', back: 'necesitar' }
  ]
},

{
  id: 'nt-cantidad-relativa-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:34', 'nociones_generales:A2:35', 'nociones_generales:A2:36'],
  title: 'Cantidad relativa: envases, tallas y medidas',
  summary: 'A container word — botella de, paquete de, caja de — turns an uncountable noun into something you can count, and Spanish clothing sizes run on their own small, fixed vocabulary separate from ordinary numbers.',
  sections: [
    { h: 'Container + de: making the uncountable countable', html: '<i>Una botella de agua</i>, <i>un paquete de arroz</i>, <i>una caja de galletas</i> — the container supplies the "one," the <i>de</i>-phrase supplies what it holds.' },
    { h: 'Talla vs número', html: 'Clothes take <i>talla</i> (<i>la talla grande/mediana</i>, or a number: <i>la 42</i>); shoes take <i>número</i> (<i>el número 38</i>) — the two words are not interchangeable.' },
    { h: 'Measurement verbs', html: '<i>Pesar</i> (to weigh) and <i>medir</i> (to measure) name the property directly: <i>Pesa dos kilos</i>, <i>Mide metro noventa</i>.' }
  ],
  exponents: [
    { es: 'Compré una botella de aceite y una barra de pan.', en: 'I bought a bottle of oil and a loaf of bread.', register: 'neutral' },
    { es: '¿Qué talla usas? — La mediana.', en: '—What size do you wear? —Medium.', register: 'neutral', note: 'talla — clothing' },
    { es: 'Uso el número 38 de zapato.', en: 'I take a size 38 shoe.', register: 'neutral', note: 'número — footwear' },
    { es: 'El paquete pesa casi un kilo.', en: 'The package weighs almost a kilo.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Uso la talla 42.', en: 'I wear a size 42 (clothes).', note: 'talla — clothing' },
    { es: 'Uso el número 38.', en: 'I wear a size 38 (shoes).', note: 'número — footwear, a different word entirely' }
  ],
  pitfalls: [
    'Do not use <i>talla</i> for shoes or <i>número</i> for clothes — Spanish keeps the two size systems lexically separate.',
    'A container word needs <i>de</i> before what it holds: <i>una botella de agua</i>, not <i>*una botella agua</i>.'
  ],
  examples: [
    { es: 'Compré un paquete de café y una barra de pan.', en: 'I bought a packet of coffee and a loaf of bread.' },
    { es: '¿Qué talla usas? — La mediana.', en: '—What size do you wear? —Medium.' },
    { es: 'El paquete pesa casi un kilo.', en: 'The package weighs almost a kilo.' }
  ],
  probes: [
    { id: 'p:cantrelA2:talla', kind: 'mcq', q: '¿Cuál se usa para zapatos?',
      options: ['talla', 'número', 'tamaño'], answer: 1 },
    { id: 'p:cantrelA2:envase', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['una botella agua', 'una botella de agua', 'una botella del agua'], answer: 1 },
    { id: 'p:cantrelA2:cloze', kind: 'cloze', text: 'El paquete ___ casi un kilo. (weighs)', accept: ['pesa'] },
    { id: 'p:cantrelA2:recall', kind: 'recall', front: 'talla vs número — which is for shoes?', back: 'número' }
  ]
},

{
  id: 'nt-posicion-relativa-distancia-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:78', 'nociones_generales:A2:79', 'nociones_generales:A2:80', 'nociones_generales:A2:86', 'nociones_generales:A2:87'],
  title: 'Posición: dentro, fuera, alrededor — y la distancia',
  summary: 'Dentro/fuera, debajo/encima and delante/detrás all extend A1\'s cerca de/lejos de pattern with the same obligatory "de," while desde…hasta frames a distance as a span between two explicitly named points.',
  sections: [
    { h: 'More position pairs, same pattern', html: '<i>Dentro (de)</i>, <i>fuera (de)</i>, <i>debajo (de)</i>, <i>encima (de)</i> (or <i>arriba de</i> in much of Spanish America), <i>delante (de)</i>, <i>detrás (de)</i>, <i>alrededor (de)</i> — every one of these follows the A1 rule: <i>de</i> links it to its landmark.' },
    { h: 'Desde…hasta: a distance with two ends', html: '<i>¿Cuántos kilómetros hay desde aquí hasta Valencia?</i> names both endpoints of the distance explicitly.' },
    { h: 'Posture as position', html: '<i>Estar sentado</i> (sitting) and <i>estar/ir de pie</i> (standing) describe a person\'s position by their posture.' }
  ],
  exponents: [
    { es: 'Había cuatro sillas alrededor de la mesa.', en: 'There were four chairs around the table.', register: 'neutral' },
    { es: 'Vive en las afueras de la ciudad.', en: 'She lives on the outskirts of the city.', register: 'neutral' },
    { es: '¿Cuántos kilómetros hay desde aquí hasta Valencia?', en: 'How many kilometres is it from here to Valencia?', register: 'neutral' },
    { es: 'El gato está debajo de la cama.', en: 'The cat is under the bed.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Hay 50 metros desde la estación hasta mi casa.', en: 'It\'s 50 metres from the station to my house.', note: 'desde...hasta — both endpoints named' },
    { es: '¿Qué distancia hay entre el hotel y el aeropuerto?', en: 'How far is it between the hotel and the airport?', note: 'entre X y Y — an equivalent way to frame the same span' }
  ],
  pitfalls: [
    'Every position word in this set still needs <i>de</i> before its landmark — the A1 rule never relaxes.',
    '<i>Desde</i> needs a starting point and <i>hasta</i> an ending point; using only one without the other leaves the distance half-stated.'
  ],
  examples: [
    { es: 'Había cuatro sillas alrededor de la mesa.', en: 'There were four chairs around the table.' },
    { es: 'Vive en las afueras de la ciudad, no en el centro.', en: 'She lives on the outskirts of the city, not downtown.' },
    { es: 'El gato está debajo de la cama.', en: 'The cat is under the bed.' }
  ],
  probes: [
    { id: 'p:posdist:de', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['dentro la caja', 'dentro de la caja', 'dentro en la caja'], answer: 1 },
    { id: 'p:posdist:extremos', kind: 'mcq', q: '"___ la estación ___ mi casa hay 50 metros."',
      options: ['Desde / hasta', 'Entre / de', 'De / en'], answer: 0 },
    { id: 'p:posdist:cloze', kind: 'cloze', text: 'El gato está ___ de la cama. (under)', accept: ['debajo'] },
    { id: 'p:posdist:recall', kind: 'recall', front: 'What two words does "desde…hasta" require?', back: 'a starting point and an ending point, both named' }
  ]
},

{
  id: 'nt-movimiento-estabilidad-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:94', 'nociones_generales:A2:95', 'nociones_generales:A2:96', 'nociones_generales:A2:97', 'nociones_generales:A2:98'],
  title: 'Movimiento: subir, bajar, andar, quedarse',
  summary: 'Subir and bajar move vertically or board and alight a vehicle, while quedarse breaks the whole pattern by describing NOT moving — staying put is still filed under "movement" in Spanish\'s own way of dividing up the world.',
  sections: [
    { h: 'Subir / bajar: two jobs each', html: 'Vertical movement (<i>subir las escaleras</i>) and boarding/alighting a vehicle (<i>subir al autobús</i>, <i>bajar del tren</i>) share the same two verbs — context decides which sense is meant.' },
    { h: 'Different paces on foot', html: '<i>Andar/caminar</i> (to walk), <i>pasear</i> (to stroll, for leisure), <i>correr</i> (to run) — the purpose changes the verb, not just the speed.' },
    { h: 'Quedarse: the stillness pole', html: '<i>Quedarse</i> (to stay) is the deliberate opposite of every verb above: <i>El domingo me quedé en casa</i>.' }
  ],
  exponents: [
    { es: 'El transporte público es muy bueno en esta ciudad.', en: 'Public transport is very good in this city.', register: 'neutral' },
    { es: 'Sube al autobús por la puerta delantera.', en: 'Get on the bus through the front door.', register: 'neutral', note: 'subir — boarding' },
    { es: 'Nos gusta pasear por el parque.', en: 'We like to stroll through the park.', register: 'neutral' },
    { es: 'El domingo me quedé en casa.', en: 'On Sunday I stayed home.', register: 'neutral', note: 'quedarse — the stillness pole' }
  ],
  contrasts: [
    { es: 'Sube al autobús.', en: 'She gets on the bus.', note: 'subir — boarding, not literally "climbing"' },
    { es: 'Sube las escaleras.', en: 'She goes up the stairs.', note: 'the same verb, literal vertical movement' }
  ],
  pitfalls: [
    '<i>Subir/bajar</i> a vehicle uses <i>a/de</i>: <i>subir AL tren</i>, <i>bajar DEL tren</i> — not the bare verb alone.',
    '<i>Pasear</i> implies leisure, not urgency — do not use it for a purposeful, timed walk somewhere.'
  ],
  examples: [
    { es: 'Bajamos del autobús en la próxima parada.', en: 'We get off the bus at the next stop.' },
    { es: 'Nos gusta pasear por el parque los domingos.', en: 'We like to stroll through the park on Sundays.' },
    { es: 'El autobús no pasa por el centro los festivos.', en: "The bus doesn't go through the centre on public holidays." }
  ],
  probes: [
    { id: 'p:movestA2:vehiculo', kind: 'mcq', q: '"Bajamos ___ autobús en la próxima parada."',
      options: ['al', 'del', 'en el'], answer: 1 },
    { id: 'p:movestA2:opuesto', kind: 'mcq', q: 'Opuesto de "salir/moverse":',
      options: ['pasear', 'quedarse', 'correr'], answer: 1 },
    { id: 'p:movestA2:cloze', kind: 'cloze', text: 'El domingo me ___ en casa. (stayed)', accept: ['quedé'] },
    { id: 'p:movestA2:recall', kind: 'recall', front: 'What TWO different jobs do subir/bajar cover?', back: 'vertical movement AND boarding/alighting a vehicle' }
  ]
},

{
  id: 'nt-orientacion-direccion-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:106', 'nociones_generales:A2:107', 'nociones_generales:A2:108', 'nociones_generales:A2:109', 'nociones_generales:A2:110'],
  title: 'Orientación: llevar, traer, seguir, cruzar',
  summary: 'Llevar and traer split exactly the way ir and venir do — llevar moves something away from here, traer moves it toward here — so if you already have ir/venir sorted, the same logic carries straight over.',
  sections: [
    { h: 'Llevar: away, like ir', html: '<i>Llévale esto a tu hermano</i> — the object moves away from the speaker\'s position, just as <i>ir</i> does.' },
    { h: 'Traer: toward here, like venir', html: '<i>Tráeme el libro</i> — the object moves TOWARD the speaker, mirroring <i>venir</i> exactly.' },
    { h: 'The rest of the direction toolkit', html: '<i>Seguir</i> (keep going), <i>cruzar</i> (cross), <i>girar</i> (turn), and <i>coger la primera/segunda calle</i> (take the first/second street) build out the A1 direction-giving set.' }
  ],
  exponents: [
    { es: 'Llévale esto a tu hermano.', en: 'Take this to your brother.', register: 'coloquial', note: 'llevar — away, like ir' },
    { es: 'Tráeme el libro, por favor.', en: 'Bring me the book, please.', register: 'neutral', note: 'traer — toward the speaker, like venir' },
    { es: 'Sigue todo recto hasta la plaza.', en: 'Keep going straight until the square.', register: 'neutral' },
    { es: 'Cruza el puente y después gira a la izquierda.', en: 'Cross the bridge and then turn left.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Llévale esto a tu hermano.', en: 'Take this to your brother.', note: 'llevar — away from the speaker, like ir' },
    { es: 'Tráeme el libro, por favor.', en: 'Bring me the book, please.', note: 'traer — toward the speaker, like venir' }
  ],
  pitfalls: [
    'If you have <i>ir</i> vs <i>venir</i> straight, apply the identical logic to <i>llevar</i> vs <i>traer</i> — the direction rule is the same, just with an object instead of a person moving.',
    '<i>Seguir todo recto</i> reuses <i>todo recto</i> from A1 — do not invent a new phrase for "keep going straight."'
  ],
  examples: [
    { es: 'Sigue todo recto hasta la plaza.', en: 'Keep going straight until the square.' },
    { es: 'Cruza el puente y después gira a la izquierda.', en: 'Cross the bridge and then turn left.' },
    { es: '¿Puedes traerme un vaso de agua?', en: 'Can you bring me a glass of water?' }
  ],
  probes: [
    { id: 'p:orientA2:direccion', kind: 'mcq', q: 'Estás en la fiesta. Le pides a un amigo que traiga algo aquí: "___me el pastel."',
      options: ['Lleva', 'Trae', 'Lleve'], answer: 1 },
    { id: 'p:orientA2:paralelo', kind: 'mcq', q: '"Llevar" se comporta como:',
      options: ['venir', 'ir', 'estar'], answer: 1 },
    { id: 'p:orientA2:cloze', kind: 'cloze', text: 'Cruza el puente y después ___ a la izquierda. (turn)', accept: ['gira'] },
    { id: 'p:orientA2:recall', kind: 'recall', front: 'llevar behaves like which verb — ir or venir?', back: 'ir (away from the speaker)' }
  ]
},

{
  id: 'nt-referencias-generales-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:129', 'nociones_generales:A2:130', 'nociones_generales:A2:133', 'nociones_generales:A2:135', 'nociones_generales:A2:136'],
  title: 'Referencias temporales: desde, hasta, durante',
  summary: 'Desde frames a stretch of time by its starting point, hasta by its end, and durante by its whole length with no endpoints at all — three different ways to talk about the same span of time.',
  sections: [
    { h: 'Time chunks', html: '<i>Cuarto de hora</i> (quarter of an hour), <i>media hora</i> (half an hour) chunk time the same way container words chunk quantity.' },
    { h: 'Desde, hasta, durante', html: '<i>Trabajo desde las nueve hasta las cinco</i> names both ends of a span. <i>Trabajé durante ocho horas</i> states the LENGTH of the span with no endpoints mentioned at all.' },
    { h: 'Named occasions', html: '<i>En vacaciones</i>, <i>en Semana Santa</i>, <i>en Navidad</i> reuse the A1 <i>en + [período]</i> pattern for specific festivities.' }
  ],
  exponents: [
    { es: 'Esperé un cuarto de hora pero no vino.', en: "I waited a quarter of an hour but she didn't come.", register: 'neutral' },
    { es: 'Trabajo desde las nueve hasta las cinco.', en: 'I work from nine to five.', register: 'neutral' },
    { es: 'Estaremos de viaje durante toda la Semana Santa.', en: "We'll be travelling throughout Easter week.", register: 'neutral' },
    { es: 'No tengo mucho tiempo antes de la reunión.', en: "I don't have much time before the meeting.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'Trabajo desde las nueve hasta las cinco.', en: 'I work from nine to five.', note: 'two endpoints named' },
    { es: 'Trabajé durante ocho horas.', en: 'I worked for eight hours.', note: 'the length alone, no endpoints' }
  ],
  pitfalls: [
    '<i>Desde</i> needs a starting point; <i>hasta</i> needs an ending point — using either alone leaves the span incomplete.',
    '<i>Durante</i> states duration without committing to when it started or ended — do not add <i>desde/hasta</i> to it redundantly.'
  ],
  examples: [
    { es: 'Esperé un cuarto de hora pero no vino.', en: 'I waited a quarter of an hour but she didn\'t come.' },
    { es: 'Estaremos de viaje durante toda la Semana Santa.', en: "We'll be travelling throughout Easter week." },
    { es: 'No tengo mucho tiempo antes de la reunión.', en: "I don't have much time before the meeting." }
  ],
  probes: [
    { id: 'p:refgenA2:desdehasta', kind: 'mcq', q: '"Trabajo ___ las nueve ___ las cinco."',
      options: ['de / a', 'desde / hasta', 'desde / a'], answer: 1 },
    { id: 'p:refgenA2:durante', kind: 'mcq', q: '"Trabajé ___ ocho horas." (no endpoints, just the length)',
      options: ['desde', 'durante', 'hasta'], answer: 1 },
    { id: 'p:refgenA2:cloze', kind: 'cloze', text: 'Esperé un ___ de hora. (quarter)', accept: ['cuarto'] },
    { id: 'p:refgenA2:recall', kind: 'recall', front: 'Which time word states a LENGTH with no start/end points?', back: 'durante' }
  ]
},

/* ---------------------------------------------------------------------------
 * A2 notion, wave 2 of 2: seq 148-160 (finalizacion + inicio + duracion-
 * transcurso merged — a single event's three edges, thin apart, one whole
 * together; evaluacion-general + conformidad merged — agreement particles
 * are a kind of evaluative response)
 * ------------------------------------------------------------------------ */
{
  id: 'nt-anterioridad-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:186', 'nociones_generales:A2:187', 'nociones_generales:A2:188'],
  title: 'Anterioridad: acabar de, ya, todavía no',
  summary: 'Acabar de + infinitive marks something that JUST happened, and ya/todavía no sit at opposite ends of the same scale — whether an expected event has arrived yet or is still pending.',
  sections: [
    { h: 'Acabar de + infinitivo', html: 'Marks an action completed a moment ago, relative to now: <i>Tu jefa acaba de llamar</i> — "your boss has just called."' },
    { h: 'Ya vs todavía no', html: '<i>Ya</i> confirms something has already happened: <i>Ya hemos visto esa exposición</i>. <i>Todavía no</i> says it is still pending: <i>Todavía no he probado la paella</i>.' },
    { h: 'Seguir + gerundio', html: 'Marks something still ongoing, unbroken since it started: <i>Sigue lloviendo</i> — "it\'s still raining."' }
  ],
  exponents: [
    { es: 'Tu jefa acaba de llamar.', en: 'Your boss has just called.', register: 'neutral', note: 'acabar de — just happened' },
    { es: 'Ya hemos visto esa exposición.', en: "We've already seen that exhibition.", register: 'neutral', note: 'ya — confirms it happened' },
    { es: 'Todavía no he probado la paella.', en: "I haven't tried paella yet.", register: 'neutral', note: 'todavía no — still pending' },
    { es: 'Sigue trabajando en el mismo sitio.', en: 'He\'s still working in the same place.', register: 'neutral', note: 'seguir + gerundio — unbroken continuity' }
  ],
  contrasts: [
    { es: 'Ya hemos comido.', en: "We've already eaten.", note: 'confirmed — it happened' },
    { es: 'Todavía no hemos comido.', en: "We haven't eaten yet.", note: 'the near-opposite — still pending' }
  ],
  pitfalls: [
    '<i>Acabar de</i> only frames something as JUST finished relative to the reference point — do not use it for a distant past event.',
    '<i>Ya</i> and <i>todavía no</i> sit at opposite ends of one scale; mixing them up reverses whether something has happened.'
  ],
  examples: [
    { es: 'Acabamos de llegar; danos un momento.', en: "We've just arrived; give us a moment." },
    { es: '¿Ya has terminado los deberes?', en: 'Have you finished your homework yet?' },
    { es: 'Todavía no sé qué voy a hacer este verano.', en: "I still don't know what I'm going to do this summer." }
  ],
  probes: [
    { id: 'p:anterior:acabar', kind: 'mcq', q: '"Your boss has just called":',
      options: ['Tu jefa llamó.', 'Tu jefa acaba de llamar.', 'Tu jefa ya llamaba.'], answer: 1 },
    { id: 'p:anterior:escala', kind: 'mcq', q: '"Todavía no he probado la paella" significa que:',
      options: ['ya la probé', 'aún no la he probado', 'nunca la probaré'], answer: 1 },
    { id: 'p:anterior:cloze', kind: 'cloze', text: '¿___ has terminado los deberes? (already)', accept: ['Ya', 'ya'] },
    { id: 'p:anterior:recall', kind: 'recall', front: 'ya vs todavía no — which one confirms something already happened?', back: 'ya' }
  ]
},

{
  id: 'nt-inicio-duracion-fin-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:190', 'nociones_generales:A2:191', 'nociones_generales:A2:193', 'nociones_generales:A2:194', 'nociones_generales:A2:199', 'nociones_generales:A2:200'],
  title: 'Inicio, duración y fin de una acción',
  summary: 'Empezar a marks the start, durar states how long something lasts with no preposition at all before the length, and terminar de marks the end — three verbs tracing one single action from its first moment to its last.',
  sections: [
    { h: 'Inicio: empezar a', html: '<i>Empiezo a trabajar a las nueve</i> — the same <i>empezar a</i> + infinitive from the A1 duración lesson, now paired with its opposite number.' },
    { h: 'Duración: durar', html: '<i>Durar</i> takes the length DIRECTLY, no preposition: <i>La película dura casi tres horas</i>, not <i>*dura de tres horas</i> or <i>*dura por tres horas</i>.' },
    { h: 'Fin: terminar de, hasta, morir', html: '<i>Termino de trabajar a las cinco</i> closes an activity; <i>hasta</i> marks an endpoint (<i>Estará en Londres hasta el verano</i>); <i>morir</i> is the specific, final end of a life.' }
  ],
  exponents: [
    { es: 'Empiezo a trabajar a las nueve.', en: 'I start work at nine.', register: 'neutral' },
    { es: 'La excursión dura todo el día.', en: 'The excursion lasts the whole day.', register: 'neutral', note: 'durar — no preposition before the length' },
    { es: 'Termino de trabajar a las cinco.', en: 'I finish work at five.', register: 'neutral' },
    { es: 'Estará en Londres hasta el verano.', en: "He'll be in London until summer.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'La película dura casi tres horas.', en: 'The film lasts almost three hours.', note: 'durar — no preposition before the length' },
    { es: '*La película dura de tres horas.', en: '(wrong)', note: 'durar never takes a preposition here' }
  ],
  pitfalls: [
    '<i>Durar</i> attaches the length directly, with no preposition: <i>dura tres horas</i>, never <i>*dura de/por tres horas</i>.',
    '<i>Terminar</i> still takes <i>de</i> before an infinitive, exactly as at A1: <i>terminar DE trabajar</i>.'
  ],
  examples: [
    { es: '¿Cuánto dura el viaje en tren?', en: 'How long does the train journey take?' },
    { es: 'La reunión duró toda la mañana.', en: 'The meeting lasted all morning.' },
    { es: 'Empezó a llover justo cuando salimos.', en: 'It started raining just as we left.' }
  ],
  probes: [
    { id: 'p:inidurfin:durar', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['dura de tres horas', 'dura tres horas', 'dura por tres horas'], answer: 1 },
    { id: 'p:inidurfin:tres', kind: 'mcq', q: 'Los tres verbos/marcadores para inicio, duración y fin de UNA acción:',
      options: ['empezar a / durar / terminar de', 'nacer / vivir / morir', 'ir / estar / venir'], answer: 0 },
    { id: 'p:inidurfin:cloze', kind: 'cloze', text: 'Termino ___ trabajar a las cinco.', accept: ['de'] },
    { id: 'p:inidurfin:recall', kind: 'recall', front: 'Does "durar" take a preposition before the length of time?', back: 'no — dura tres horas, directly' }
  ]
},

{
  id: 'nt-frecuencia-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:204', 'nociones_generales:A2:205', 'nociones_generales:A2:206', 'nociones_generales:A2:207'],
  title: 'Frecuencia: veces al día, todos los meses',
  summary: 'A number + vez/veces + al or a la + [period] states an exact frequency, while todos los/todas las + [period] states a blanket, exceptionless one — and which preposition contracts depends on the period noun\'s gender.',
  sections: [
    { h: 'Counting occurrences', html: '<i>[número] + vez/veces + al/a la + [período]</i> gives an exact count: <i>dos veces a la semana</i>, <i>una vez al mes</i>.' },
    { h: 'Al vs a la', html: '<i>Al</i> (a + el) goes with masculine periods (<i>al día, al mes, al año</i>); <i>a la</i> goes with the one common feminine period, <i>semana</i>.' },
    { h: 'Todos los / todas las: no exceptions', html: 'A blanket frequency with no gaps: <i>todos los meses, todas las semanas</i> — every single one, not just often.' }
  ],
  exponents: [
    { es: 'Voy a la piscina dos veces a la semana.', en: 'I go to the pool twice a week.', register: 'neutral' },
    { es: 'Como fuera una vez al mes.', en: 'I eat out once a month.', register: 'neutral', note: 'al — masculine period' },
    { es: 'Voy al gimnasio todos los días.', en: 'I go to the gym every day.', register: 'neutral', note: 'blanket, no exceptions' },
    { es: 'Escucho música todo el tiempo.', en: 'I listen to music all the time.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Voy dos veces a la semana.', en: 'I go twice a week.', note: 'exact count' },
    { es: 'Voy todas las semanas.', en: 'I go every single week.', note: 'blanket, unbroken — a different claim than "often"' }
  ],
  pitfalls: [
    '<i>Al</i> (masculine: día, mes, año) vs <i>a la</i> (feminine: semana) — the contraction depends on the period noun\'s gender.',
    '<i>Todos los/todas las</i> claims NO exceptions; do not use it loosely to mean merely "often."'
  ],
  examples: [
    { es: 'Llamo a mis padres una vez a la semana.', en: 'I call my parents once a week.' },
    { es: 'Tenemos clase todos los lunes y miércoles.', en: 'We have class every Monday and Wednesday.' },
    { es: 'Algunas veces desayuno fuera de casa.', en: 'Sometimes I have breakfast out.' }
  ],
  probes: [
    { id: 'p:frecuenA2:contraccion', kind: 'mcq', q: '"Voy al gimnasio tres veces ___ semana."',
      options: ['al', 'a la', 'a el'], answer: 1 },
    { id: 'p:frecuenA2:sinexcep', kind: 'mcq', q: '"Todos los lunes" implica:',
      options: ['la mayoría de los lunes', 'cada lunes sin excepción', 'algunos lunes'], answer: 1 },
    { id: 'p:frecuenA2:cloze', kind: 'cloze', text: 'Como fuera una vez ___ mes. (al)', accept: ['al'] },
    { id: 'p:frecuenA2:recall', kind: 'recall', front: 'Why does "semana" take "a la" but "mes" takes "al"?', back: 'semana is feminine, mes is masculine' }
  ]
},

{
  id: 'nt-visibilidad-color-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:224', 'nociones_generales:A2:225', 'nociones_generales:A2:232', 'nociones_generales:A2:233', 'nociones_generales:A2:234'],
  title: 'Visibilidad y color: vistas, luz, vino tinto',
  summary: 'Vistas names what you can see FROM somewhere and luz names how much light is available — two related but distinct notions — and Spanish keeps one fixed exception in its colour vocabulary: red wine is never rojo.',
  sections: [
    { h: 'Vistas: the view', html: '<i>Una habitación con vistas al mar</i> — <i>vistas</i> (plural) names the panorama itself, not the act of seeing it.' },
    { h: 'Luz: how much light', html: '<i>El apartamento tiene mucha luz</i> — quantity of natural light, distinct from a view.' },
    { h: 'The fixed exception: vino tinto', html: 'Red wine is <i>vino tinto</i>, never <i>*vino rojo</i> — one of Spanish\'s few lexicalized colour exceptions, learned as a fixed phrase.' }
  ],
  exponents: [
    { es: 'Hemos reservado una habitación con vistas al mar.', en: "We've booked a room with sea views.", register: 'neutral' },
    { es: 'El apartamento tiene mucha luz.', en: 'The apartment gets a lot of light.', register: 'neutral' },
    { es: 'Mira, te presento a mi hermano.', en: 'Look, this is my brother.', register: 'coloquial', note: 'mirar — an intentional glance, not general sight' },
    { es: 'Prefiero el vino tinto al blanco.', en: 'I prefer red wine to white.', register: 'neutral', note: 'tinto, never rojo, for red wine' }
  ],
  contrasts: [
    { es: 'una habitación con vistas', en: 'a room with a view', note: 'vistas — the panorama' },
    { es: 'una habitación con mucha luz', en: 'a room with a lot of light', note: 'luz — a completely different property' }
  ],
  pitfalls: [
    'Red wine is always <i>vino tinto</i> — <i>*vino rojo</i> does not exist in ordinary Spanish.',
    '<i>Vistas</i> is a plural noun even for a single view: <i>habitación con vistas</i>, not <i>*con vista</i> in this fixed phrase.'
  ],
  examples: [
    { es: 'Desde la terraza hay unas vistas preciosas.', en: 'There are beautiful views from the terrace.' },
    { es: 'Esta cocina no tiene mucha luz natural.', en: "This kitchen doesn't have much natural light." },
    { es: 'Voy a pintar la pared de azul claro.', en: "I'm going to paint the wall light blue." }
  ],
  probes: [
    { id: 'p:visioncol:vino', kind: 'mcq', q: 'Red wine:',
      options: ['vino rojo', 'vino tinto', 'vino colorado'], answer: 1 },
    { id: 'p:visioncol:dos', kind: 'mcq', q: '¿Cuál palabra describe la CANTIDAD de luz natural?',
      options: ['vistas', 'luz', 'mirar'], answer: 1 },
    { id: 'p:visioncol:cloze', kind: 'cloze', text: 'Voy a ___ la pared de azul. (paint)', accept: ['pintar'] },
    { id: 'p:visioncol:recall', kind: 'recall', front: 'What is the Spanish word for "red wine"?', back: 'vino tinto (never vino rojo)' }
  ]
},

{
  id: 'nt-edad-vejez-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:240', 'nociones_generales:A2:241', 'nociones_generales:A2:242', 'nociones_generales:A2:243'],
  title: 'Edad: adulto, joven, mayor, antiguo',
  summary: 'Antiguo and moderno shift the young/old opposition onto THINGS, where an "antiguo" object is often admired rather than dismissed — the opposite connotation calling a PERSON viejo can carry.',
  sections: [
    { h: 'People: joven, mayor', html: '<i>Joven</i> (young) and <i>mayor</i> (older — the A1-established polite alternative to <i>viejo</i>) describe people\'s age directly.' },
    { h: 'Things: antiguo, moderno', html: '<i>Antiguo</i> can mean simply "old" but often carries a positive, "vintage" or "antique" connotation an object can wear with pride — <i>un coche antiguo</i> is admired, not dismissed the way <i>un hombre viejo</i> might sound.' },
    { h: 'Adulto: a life stage', html: '<i>Adulto</i> names a stage of life (adulthood), not a comparison — it does not pair with <i>más/menos</i> the way <i>joven/mayor</i> can.' }
  ],
  exponents: [
    { es: 'Es un chico muy joven todavía.', en: "He's still a very young guy.", register: 'neutral' },
    { es: 'Mi vecino es una persona mayor.', en: 'My neighbour is an elderly person.', register: 'neutral' },
    { es: 'Tiene un coche antiguo precioso.', en: 'He has a beautiful vintage car.', register: 'neutral', note: 'antiguo — admiring, not dismissive' },
    { es: 'Ya es un adulto responsable.', en: "He's a responsible adult now.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'un coche antiguo', en: 'a vintage car', note: 'admired — antiguo carries a positive connotation for things' },
    { es: 'un hombre viejo', en: 'an old man', note: 'blunter than "mayor" when said of a person directly' }
  ],
  pitfalls: [
    '<i>Mayor</i> applies to people (and animals); do not use it for THINGS — an old building is <i>antiguo</i>, not <i>*mayor</i>.',
    '<i>Antiguo</i> often has a positive "vintage" flavour for objects that <i>viejo</i>, applied to a person, does not share.'
  ],
  examples: [
    { es: 'El centro histórico tiene edificios muy antiguos.', en: 'The old town has very old buildings.' },
    { es: 'Mis abuelos ya son personas mayores.', en: 'My grandparents are elderly now.' },
    { es: 'De adulto quiere ser médico.', en: 'As an adult he wants to be a doctor.' }
  ],
  probes: [
    { id: 'p:edadvejA2:cosas', kind: 'mcq', q: '"Old" hablando de un EDIFICIO:',
      options: ['mayor', 'antiguo', 'adulto'], answer: 1 },
    { id: 'p:edadvejA2:personas', kind: 'mcq', q: '"Old" hablando de una PERSONA, de forma educada:',
      options: ['antiguo', 'mayor', 'viejo'], answer: 1 },
    { id: 'p:edadvejA2:cloze', kind: 'cloze', text: 'Tiene un coche ___ precioso. (vintage)', accept: ['antiguo'] },
    { id: 'p:edadvejA2:recall', kind: 'recall', front: 'Which word for "old" applies to THINGS, not people — mayor or antiguo?', back: 'antiguo' }
  ]
},

{
  id: 'nt-evaluacion-conformidad-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:253', 'nociones_generales:A2:254', 'nociones_generales:A2:269', 'nociones_generales:A2:270'],
  title: 'Evaluación y conformidad: mejor, vale, está bien',
  summary: 'Mejor/peor judges by comparing one thing against another, while vale/está bien/claro simply signal AGREEMENT with no evaluation at all — two different jobs that beginners often blur into one vague "good."',
  sections: [
    { h: 'Mejor/peor: comparative judgement', html: 'Reprising the comparative from A2 grammar, <i>mejor/peor</i> rank one thing against another: <i>Esta opción es mejor.</i>' },
    { h: 'Vale, está bien, claro: agreement, not evaluation', html: 'These respond to a PROPOSAL, not a quality question: <i>—¿Quedamos a las ocho? —Vale.</i> None of them judge how good something is.' },
    { h: 'Interesar/importar: the gustar pattern', html: 'Like <i>gustar</i>, these are impersonal — the thing interesting or mattering is the grammatical subject: <i>Me interesa la historia</i>, <i>No me importa el precio</i>.' }
  ],
  exponents: [
    { es: 'Esta opción es mejor que la otra.', en: 'This option is better than the other.', register: 'neutral' },
    { es: '—¿Quedamos a las ocho? —Vale.', en: '—Shall we meet at eight? —OK.', register: 'coloquial', note: 'agreement, not a quality judgement' },
    { es: 'Me interesa mucho la historia.', en: "I'm very interested in history.", register: 'neutral', note: 'interesar — gustar pattern' },
    { es: 'No me importa el precio.', en: "I don't mind the price.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'Está bien.', en: "It's fine.", note: 'can be evaluative — judging quality' },
    { es: 'Vale.', en: 'OK.', note: 'purely agreement — does not judge quality at all' }
  ],
  pitfalls: [
    '<i>Vale</i> agrees to a proposal — it does not answer "how was it?" the way <i>estuvo bien</i> would.',
    '<i>Interesar/importar</i> follow the <i>gustar</i> pattern: the interesting THING is the subject, not the interested person.'
  ],
  examples: [
    { es: '—¿Vamos al cine esta noche? —Claro, vale.', en: '—Shall we go to the cinema tonight? —Sure, OK.' },
    { es: 'A mi hermano no le interesa el fútbol.', en: 'My brother isn\'t interested in football.' },
    { es: 'Este restaurante es mejor que el de ayer.', en: "This restaurant is better than yesterday's." }
  ],
  probes: [
    { id: 'p:evalconf:vale', kind: 'mcq', q: '"Vale" responde a:',
      options: ['una pregunta de calidad', 'una propuesta', 'una descripción'], answer: 1 },
    { id: 'p:evalconf:interesar', kind: 'mcq', q: '"Me interesa la historia" — ¿qué es el sujeto gramatical?',
      options: ['yo', 'la historia', 'interesar'], answer: 1 },
    { id: 'p:evalconf:cloze', kind: 'cloze', text: 'No me ___ el precio. (mind/matter)', accept: ['importa'] },
    { id: 'p:evalconf:recall', kind: 'recall', front: 'Does "vale" evaluate quality, or just signal agreement?', back: 'just agreement' }
  ]
},

{
  id: 'nt-expresion-verbal-a2', strand: 'notion', cefr: 'A2', level: 2, theme: null,
  pcic: ['nociones_generales:A2:286', 'nociones_generales:A2:287', 'nociones_generales:A2:288', 'nociones_generales:A2:289'],
  title: 'Expresión verbal: preguntar, contestar, decir',
  summary: 'Preguntar and contestar are a matched pair, one initiating and one responding, while decir is the general-purpose verb for everything in between — and it only ever reports statements, never questions.',
  sections: [
    { h: 'Preguntar: initiating', html: '<i>Preguntar</i> reports a question, and needs <i>si</i> to report a yes/no question: <i>Le pregunté si venía</i> ("I asked him if he was coming").' },
    { h: 'Contestar/responder: responding', html: 'The matched counterpart: <i>Contestó que sí</i> ("He answered yes").' },
    { h: 'Decir: the general case', html: '<i>Decir</i> reports STATEMENTS: <i>Dijo que venía</i>. It cannot report a question — that job belongs to <i>preguntar</i> alone.' }
  ],
  exponents: [
    { es: 'Le pregunté si venía a la fiesta.', en: 'I asked her if she was coming to the party.', register: 'neutral' },
    { es: 'Contestó que no tenía tiempo.', en: "She answered that she didn't have time.", register: 'neutral' },
    { es: 'Dijo que llegaría tarde.', en: "He said he'd arrive late.", register: 'neutral' },
    { es: 'Hazme una pregunta si no entiendes.', en: "Ask me a question if you don't understand.", register: 'neutral', note: 'hacer una pregunta — a noun-based alternative to preguntar' }
  ],
  contrasts: [
    { es: 'Le pregunté si venía.', en: 'I asked him if he was coming.', note: 'preguntar — reports a question, needs si' },
    { es: '*Le dije si venía.', en: '(does not report a question this way)', note: 'decir cannot introduce a reported question with si the way preguntar does' }
  ],
  pitfalls: [
    'Do not use <i>decir</i> to report a question — <i>preguntar</i> is required, with <i>si</i> for a yes/no question.',
    '<i>Hacer una pregunta</i> and <i>preguntar</i> both work; do not mix them into <i>*hacer preguntar</i>.'
  ],
  examples: [
    { es: '¿Puedo hacerte una pregunta?', en: 'Can I ask you a question?' },
    { es: 'Nos preguntó de dónde éramos.', en: 'She asked us where we were from.' },
    { es: 'Todavía no me ha contestado.', en: "She still hasn't answered me." }
  ],
  probes: [
    { id: 'p:exprverb:reportar', kind: 'mcq', q: '"I asked if she was coming":',
      options: ['Le dije si venía.', 'Le pregunté si venía.', 'Le contesté si venía.'], answer: 1 },
    { id: 'p:exprverb:pareja', kind: 'mcq', q: 'El verbo pareja de "preguntar":',
      options: ['decir', 'contestar', 'hablar'], answer: 1 },
    { id: 'p:exprverb:cloze', kind: 'cloze', text: '¿Puedo hacerte una ___? (question)', accept: ['pregunta'] },
    { id: 'p:exprverb:recall', kind: 'recall', front: 'Which verb, decir or preguntar, can report a QUESTION?', back: 'preguntar' }
  ]
},

/* ============================================================================
 * BATCH — B1 grammar, wave 1 of 2: the subjunctive system and its main
 * triggers (desiderative/doubt/value-judgment presente de subjuntivo, cuando
 * + subjuntivo for the future, condicionales and concesivas), plus imperative
 * pragmatics and clitic-pronoun combination. The raw indicative tense-form
 * units (futuro imperfecto, condicional simple, imperfecto, indefinido,
 * perfecto, pluscuamperfecto forms) are deferred for the same reason as at
 * A2: usage is what a lesson can teach that engine-driven drilling cannot.
 * ========================================================================== */
{
  id: 'gr-presente-subjuntivo-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:466', 'gramatica:B1:467', 'gramatica:B1:469', 'gramatica:B1:471', 'gramatica:B1:474', 'gramatica:B1:475'],
  title: 'El subjuntivo: cuándo aparece',
  summary: 'The present subjunctive is not a mood you reach for when a sentence "feels uncertain" — it is the form a specific, learnable family of triggers demands automatically: wishes, doubt, and impersonal value judgments, whether or not you personally feel unsure.',
  sections: [
    { h: 'Building the form fast', html: '-Ar verbs take -e endings, -er/-ir verbs take -a endings — the opposite vowel from the indicative. Any irregular <i>yo</i>-form of the present indicative carries straight over: <i>tener→tengo→tenga</i>, <i>hacer→hago→haga</i>. A short list is fully irregular: <i>sea, esté, dé, vaya, sepa, haya</i>.' },
    { h: 'Desiderativo: wishing for someone else', html: '<i>Quiero que vengas</i> needs the subjunctive because the subject of "come" is DIFFERENT from the subject of "want." When both subjects are the same person, Spanish drops <i>que</i> entirely and uses the infinitive instead: <i>Quiero venir</i>, never <i>*Quiero que venga yo</i>.' },
    { h: 'Duda: the affirm/negate flip', html: '<i>Creo que viene</i> (indicative — asserting) flips to <i>No creo que venga</i> (subjunctive) the instant you negate the opinion verb. The same flip happens with <i>es verdad que</i> vs <i>no es verdad que</i>.' },
    { h: 'Juicio de valor: impersonal judgments', html: '<i>Es una pena que no vengan</i>, <i>Es importante que lo sepas</i> — an impersonal value judgment about a fact always triggers the subjunctive in the clause that follows.' }
  ],
  contrasts: [
    { es: 'Creo que viene.', en: 'I think she\'s coming.', note: 'indicative — a plain assertion' },
    { es: 'No creo que venga.', en: "I don't think she's coming.", note: 'subjunctive — negating the opinion verb triggers it' },
    { es: 'Quiero venir.', en: 'I want to come.', note: 'same subject — infinitive, no que' },
    { es: 'Quiero que vengas.', en: 'I want you to come.', note: 'different subjects — que + subjunctive is now obligatory' }
  ],
  pitfalls: [
    'When both clauses share the same subject, use the infinitive, not <i>que</i> + subjunctive: <i>Quiero venir</i>, never <i>*Quiero que venga yo</i>.',
    'Negating an opinion verb (<i>creer, pensar, ser verdad</i>) flips its complement clause from indicative to subjunctive — this affirm/negate flip is the single most common thing B1 learners get wrong.',
    'An impersonal value judgment (<i>es importante, es una pena, es normal</i>) + <i>que</i> always takes the subjunctive, regardless of how certain the underlying fact is.'
  ],
  examples: [
    { es: 'Espero que te mejores pronto.', en: 'I hope you get better soon.' },
    { es: 'Dudo que llegue a tiempo con este tráfico.', en: "I doubt he'll arrive on time with this traffic." },
    { es: 'Es normal que estés nervioso el primer día.', en: "It's normal to be nervous on the first day." }
  ],
  probes: [
    { id: 'p:presubj:flip', kind: 'mcq', q: '"No creo que ___ a tiempo." (llegar)',
      options: ['llega', 'llegue', 'llegará'], answer: 1 },
    { id: 'p:presubj:sujeto', kind: 'mcq', q: '"Quiero ___ pronto." (same subject — to leave)',
      options: ['que salga', 'salir', 'que salgo'], answer: 1 },
    { id: 'p:presubj:cloze', kind: 'cloze', text: 'Es importante que lo ___. (saber, tú)', accept: ['sepas'] },
    { id: 'p:presubj:recall', kind: 'recall', front: 'What happens to the subjunctive trigger when you negate "creo que"?', back: 'it starts triggering it — creo que takes the indicative, no creo que takes the subjunctive' }
  ]
},

{
  id: 'gr-imperativo-valores-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:516', 'gramatica:B1:517', 'gramatica:B1:518', 'gramatica:B1:519'],
  title: 'El imperativo: más allá de la orden',
  summary: 'A command form covers a plea, a piece of advice, and a warm invitation just as often as an actual order — tone and context, not the grammar itself, decide which of the four you are hearing.',
  sections: [
    { h: 'Ruego: a plea', html: 'Softened almost always by <i>por favor</i>: <i>Perdóname, por favor.</i> The grammar is identical to an order; only the softening makes it a plea.' },
    { h: 'Sugerencia: advice, not authority', html: '<i>Acuéstate pronto</i> from a friend reads as advice, not a command — the relationship between speaker and listener decides the force, not the verb form.' },
    { h: 'Aceptación e invitación', html: '<i>—¿Se puede? —Sí, claro, pasa, pasa.</i> Doubling the imperative here signals warmth, not literal repetition of the instruction.' },
    { h: 'Orden: the "default" reading, but only one of four', html: 'A genuine order is just one use among several — assuming every imperative is bossy misreads a large share of everyday Spanish.' }
  ],
  contrasts: [
    { es: 'Perdóname, por favor.', en: 'Forgive me, please.', note: 'ruego — softened plea' },
    { es: '¡Cállate ahora mismo!', en: 'Be quiet right now!', note: 'orden — a genuine command, tone carries the difference' }
  ],
  pitfalls: [
    'Do not assume every imperative is an order — context and tone decide whether it is a plea, advice, an invitation, or a command.',
    'Doubling an imperative (<i>pasa, pasa</i>) signals warmth or emphasis, not that the instruction needs repeating.'
  ],
  examples: [
    { es: 'Prueba esto, seguro que te gusta.', en: "Try this, I'm sure you'll like it." },
    { es: '—¿Puedo sentarme? —Claro, siéntate, siéntate.', en: '—Can I sit down? —Of course, sit, sit.' },
    { es: 'Ten cuidado con el escalón.', en: 'Watch out for the step.' }
  ],
  probes: [
    { id: 'p:impval:funcion', kind: 'mcq', q: '"Acuéstate pronto" dicho por un amigo es:',
      options: ['una orden estricta', 'un consejo', 'una amenaza'], answer: 1 },
    { id: 'p:impval:doblado', kind: 'mcq', q: '"Pasa, pasa" (repetido) transmite:',
      options: ['calidez / insistencia amable', 'enfado', 'una orden militar'], answer: 0 },
    { id: 'p:impval:cloze', kind: 'cloze', text: '___ cuidado con el escalón. (ten, tú)', accept: ['Ten', 'ten'] },
    { id: 'p:impval:recall', kind: 'recall', front: 'Name two functions of the imperative besides giving an order', back: 'ruego (plea), sugerencia (advice), invitación (invitation)' }
  ]
},

{
  id: 'gr-pronombres-combinados-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:207', 'gramatica:B1:208', 'gramatica:B1:209', 'gramatica:B1:210'],
  title: 'Combinación de pronombres átonos: te lo, se lo',
  summary: 'When an indirect and a direct object pronoun stack, the indirect always comes first — te lo doy, never lo te doy — and once combined, the pair moves as a single inseparable unit, whether attached to an infinitive or standing before a conjugated verb.',
  sections: [
    { h: 'Fixed order: OI before OD', html: '<i>Te las di</i>, <i>Me lo dio</i> — the indirect-object clitic always precedes the direct-object one; the reverse order is simply ungrammatical.' },
    { h: 'Se lo, generalized', html: 'The A2 rule (<i>le/les → se</i> before <i>lo/la/los/las</i>) applies throughout: <i>Se lo di a Juan</i>, never <i>*Le lo di</i> — and often the clitic <i>se lo</i> is required even when "a Juan" is already stated.' },
    { h: 'The pair never splits', html: 'With a periphrasis (infinitive or gerund attached to a conjugated verb), both clitics move together, either both before the conjugated verb or both attached to the end: <i>Se lo voy a decir</i> / <i>Voy a decírselo</i> — never <i>*Le voy a decirlo</i>, splitting the pair across the two verbs.' }
  ],
  contrasts: [
    { es: 'Se lo voy a decir.', en: "I'm going to tell it to him.", note: 'both clitics before the conjugated verb' },
    { es: 'Voy a decírselo.', en: "I'm going to tell it to him.", note: 'both clitics attached to the infinitive instead — but still together' },
    { es: '*Le voy a decirlo.', en: '(wrong)', note: 'the pair has been split across the two verbs — never allowed' }
  ],
  pitfalls: [
    'OI and OD clitics form an inseparable pair once combined — they must move together, never split across a periphrasis.',
    '<i>Le/les</i> becomes <i>se</i> immediately before <i>lo/la/los/las</i>, with no exceptions, even when the indirect object is already named elsewhere in the sentence.'
  ],
  examples: [
    { es: '¿Me prestas tu coche? — Sí, te lo presto.', en: '—Will you lend me your car? —Yes, I\'ll lend it to you.' },
    { es: 'Se lo expliqué a mis padres ayer.', en: 'I explained it to my parents yesterday.' },
    { es: 'Está explicándomelo todo con mucha paciencia.', en: "She's explaining it all to me very patiently." }
  ],
  probes: [
    { id: 'p:pcombin:orden', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Lo te di.', 'Te lo di.', 'Di te lo.'], answer: 1 },
    { id: 'p:pcombin:separar', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Le voy a decirlo.', 'Se lo voy a decir.', 'Lo le voy a decir.'], answer: 1 },
    { id: 'p:pcombin:cloze', kind: 'cloze', text: '¿Me prestas tu coche? — Sí, te ___ presto.', accept: ['lo'] },
    { id: 'p:pcombin:recall', kind: 'recall', front: 'Once OI and OD clitics combine, can they ever be split across a periphrasis?', back: 'no — they always move together' }
  ]
},

{
  id: 'gr-condicionales-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:772', 'gramatica:B1:773', 'gramatica:B1:774', 'gramatica:B1:775', 'gramatica:B1:776'],
  title: 'Condicionales reales: si + futuro, si + imperativo',
  summary: 'A real, open condition can now pair si + presente with a main clause in the future or the imperative, not only the present — but the si-clause itself never takes a future-tense verb, an absolute rule that survives every other change to the sentence.',
  sections: [
    { h: 'Extending the A2 pattern', html: 'Beyond <i>si + presente, presente</i> (A2), the main clause can now be in the future — <i>Si tengo tiempo, iré</i> — or an imperative — <i>Si puedes, ayúdame</i>.' },
    { h: 'The one rule that never changes', html: 'Whatever tense the main clause takes, the <i>si</i>-clause itself STAYS in the present indicative: <i>*Si vendrá Carlota</i> is always wrong; it must be <i>Si viene Carlota</i>.' }
  ],
  contrasts: [
    { es: 'Si tengo tiempo, voy.', en: 'If I have time, I go.', note: 'A2 pattern — present in both halves' },
    { es: 'Si tengo tiempo, iré.', en: 'If I have time, I\'ll go.', note: 'B1 extension — future in the main clause' },
    { es: 'Si puedes, ayúdame.', en: 'If you can, help me.', note: 'imperative main clause' },
    { es: '*Si vendrá Carlota, iremos al cine.', en: '(wrong)', note: 'si never takes a future-tense verb, regardless of the main clause' }
  ],
  pitfalls: [
    '<i>Si</i> is never followed by a future-tense verb, in any variant of a real condition — this rule has no exceptions.',
    'The main clause has three possible shapes at this level (present, future, imperative); the <i>si</i>-clause has exactly one (present indicative).'
  ],
  examples: [
    { es: 'Si llueve mañana, cancelaremos la excursión.', en: "If it rains tomorrow, we'll cancel the trip." },
    { es: 'Si no entiendes algo, pregúntame sin problema.', en: "If you don't understand something, just ask me." },
    { es: 'Si apruebo el examen, celebraré con mis amigos.', en: "If I pass the exam, I'll celebrate with my friends." }
  ],
  probes: [
    { id: 'p:condicB1:nuncafuturo', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Si vendrá Carlota, iremos.', 'Si viene Carlota, iremos.', 'Si venga Carlota, iremos.'], answer: 1 },
    { id: 'p:condicB1:apodosis', kind: 'mcq', q: '"Si tengo tiempo, ___." (I\'ll go — future)',
      options: ['voy', 'iré', 'iba'], answer: 1 },
    { id: 'p:condicB1:cloze', kind: 'cloze', text: 'Si ___ (poder), ayúdame.', accept: ['puedes'] },
    { id: 'p:condicB1:recall', kind: 'recall', front: 'Does the si-clause itself EVER take the future tense?', back: 'no — never, regardless of the main clause' }
  ]
},

{
  id: 'gr-concesivas-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:797', 'gramatica:B1:798', 'gramatica:B1:799', 'gramatica:B1:800'],
  title: 'Concesivas: aunque + indicativo',
  summary: 'Aunque introduces a fact that should have blocked the main clause but did not — and at this level it stays firmly in the indicative, because the conceded fact is presented as real and known, not merely possible.',
  sections: [
    { h: 'The logic: obstacle, but anyway', html: '<i>Aunque me encuentro mal, voy al trabajo</i> concedes a genuine obstacle (feeling unwell) and states that it did not stop the result (going to work anyway).' },
    { h: 'Indicative marks it as a known fact', html: 'Using the indicative after <i>aunque</i> signals the speaker treats the conceded fact as TRUE, not hypothetical — <i>Aunque está lloviendo, pienso ir a correr</i> asserts that it really is raining.' },
    { h: 'Position', html: 'Unlike <i>como</i> (causal), <i>aunque</i> can open the sentence or interrupt it mid-way, with no restriction.' }
  ],
  contrasts: [
    { es: 'Aunque me encuentro mal, voy al trabajo.', en: "Although I feel unwell, I'm going to work.", note: 'a real, known fact conceded' },
    { es: 'Voy al trabajo aunque me encuentro mal.', en: "I'm going to work although I feel unwell.", note: 'the same logic, aunque now mid-sentence' }
  ],
  pitfalls: [
    'Indicative after <i>aunque</i> at this level always means the conceded fact is treated as TRUE — a separate subjunctive use for merely possible facts belongs to a later level, not this one.',
    'Do not confuse <i>aunque</i> (concession) with <i>como</i> (cause) — they answer different questions entirely, even though both can open a sentence.'
  ],
  examples: [
    { es: 'Aunque no tengo mucho dinero, voy a hacer el viaje.', en: "Although I don't have much money, I'm going to take the trip." },
    { es: 'El plan sigue en pie aunque hace mal tiempo.', en: "The plan still stands even though the weather's bad." },
    { es: 'Aunque estudié mucho, no aprobé el examen.', en: "Although I studied a lot, I didn't pass the exam." }
  ],
  probes: [
    { id: 'p:concesB1:modo', kind: 'mcq', q: '"Aunque ___ (llover), pienso salir." (a real, known fact — it IS raining)',
      options: ['llueve', 'llueva', 'lloverá'], answer: 0 },
    { id: 'p:concesB1:logica', kind: 'mcq', q: '"Aunque" introduce:',
      options: ['una causa', 'un obstáculo que no impide el resultado', 'una condición'], answer: 1 },
    { id: 'p:concesB1:cloze', kind: 'cloze', text: '___ estudié mucho, no aprobé. (although)', accept: ['Aunque', 'aunque'] },
    { id: 'p:concesB1:recall', kind: 'recall', front: 'What does indicative (not subjunctive) after "aunque" signal at this level?', back: 'the conceded fact is treated as real/known' }
  ]
},

{
  id: 'gr-temporales-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:725', 'gramatica:B1:727', 'gramatica:B1:728', 'gramatica:B1:730', 'gramatica:B1:731', 'gramatica:B1:732'],
  title: 'Temporales: cuando + subjuntivo para el futuro',
  summary: 'Cuando takes the indicative for a fact that already happened or happens habitually, but switches to the subjunctive the instant the event is still in the future — one of the single most important rules in the entire Spanish subjunctive system.',
  sections: [
    { h: 'Cuando + indicativo: past or habitual', html: 'A completed or habitual event stays indicative: <i>Cuando llegué, lo vi</i> (past fact), <i>Me fui cuando llegaron</i> (a real, completed sequence).' },
    { h: 'Cuando + subjuntivo: not yet real', html: 'A future event — one that has not happened yet at the moment of speaking — switches <i>cuando</i> to the subjunctive: <i>Te llamaré cuando llegue</i>, never <i>*cuando llegaré</i>. The future-tense main clause does NOT pull the subjunctive clause into the future tense too.' },
    { h: 'The same rule spreads to other time connectors', html: '<i>En cuanto</i> (as soon as), <i>hasta que</i> (until) and <i>mientras</i> (while), when they point to the future, follow the identical indicative/subjunctive split as <i>cuando</i>.' }
  ],
  contrasts: [
    { es: 'Cuando llegué, lo vi.', en: 'When I arrived, I saw him.', note: 'past fact — indicative' },
    { es: 'Te llamaré cuando llegue.', en: "I'll call you when I arrive.", note: 'future, not yet real — subjunctive, even though the main clause is future' },
    { es: '*Te llamaré cuando llegaré.', en: '(wrong)', note: 'cuando never takes the future tense for a future event' }
  ],
  pitfalls: [
    'A future-tense main clause never pulls <i>cuando</i> into the future tense too — the subordinate clause takes the SUBJUNCTIVE instead, never the future indicative.',
    'This same indicative/subjunctive split extends to <i>en cuanto, hasta que, mientras</i> whenever they refer to a future, not-yet-real event.'
  ],
  examples: [
    { es: 'Avísame en cuanto tengas noticias.', en: "Let me know as soon as you have news." },
    { es: 'Esperaré aquí hasta que vuelvas.', en: "I'll wait here until you come back." },
    { es: 'Cuando era niño, vivía en Bogotá.', en: 'When I was a child, I lived in Bogotá.' }
  ],
  probes: [
    { id: 'p:temporB1:futuro', kind: 'mcq', q: '"Te llamaré cuando ___ a casa." (llegar, evento futuro)',
      options: ['llego', 'llegaré', 'llegue'], answer: 2 },
    { id: 'p:temporB1:pasado', kind: 'mcq', q: '"Cuando ___ (llegar) ayer, lo vi." (hecho pasado)',
      options: ['llegué', 'llegue', 'llegaré'], answer: 0 },
    { id: 'p:temporB1:cloze', kind: 'cloze', text: 'Avísame en cuanto ___ (tener) noticias.', accept: ['tengas'] },
    { id: 'p:temporB1:recall', kind: 'recall', front: 'What mood does "cuando" take for a FUTURE, not-yet-real event?', back: 'subjunctive (never the future indicative)' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 grammar, wave 2 of 2: the remaining connector/clause-structure topics —
 * consequence, comparison, cause refined, relative clauses, interrogatives
 * with a preposition, and subordinate clauses standing in for a subject/object
 * (which generalizes the same-subject/different-subject rule from wave 1's
 * subjunctive lesson beyond just "querer").
 * ------------------------------------------------------------------------ */
{
  id: 'gr-consecutivas-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:778', 'gramatica:B1:779', 'gramatica:B1:780', 'gramatica:B1:781', 'gramatica:B1:782'],
  title: 'Consecutivas: entonces, así que, o sea que',
  summary: 'Entonces, así que and o sea que all state a result that follows from what was just said — the same cause-effect link as porque/como, but read in the opposite direction, from cause toward its consequence.',
  sections: [
    { h: 'Stating a plain result', html: '<i>No había entradas, así que no la vimos</i> — the second clause follows necessarily from the first.' },
    { h: 'O sea que: reformulating', html: '<i>Tengo mucho trabajo, o sea que no podré salir</i> — <i>o sea que</i> draws out the implication of what was just said, almost restating it as a conclusion.' },
    { h: 'Entonces: connector and discourse marker', html: 'Beyond pure consequence, <i>entonces</i> also confirms a shared plan in conversation: <i>Entonces quedamos mañana, ¿no?</i> — closer to "so, [we\'re agreed]" than a strict logical result.' }
  ],
    contrasts: [
    { es: 'Estaba enfermo, por eso no vino. (causal → consecutive)', en: 'He was ill, that\'s why he didn\'t come.', note: 'stating the cause first, then the effect' },
    { es: 'No vino porque estaba enfermo. (consecutive → causal)', en: "He didn't come because he was ill.", note: 'same relationship, reversed direction and connector' }
  ],
  pitfalls: [
    'Consecutivas state cause THEN effect; causales (porque/como) can state either order — do not assume the connector always fixes the sentence order.',
    'These connectors always take the indicative — nothing here triggers the subjunctive.'
  ],
  examples: [
    { es: 'Perdimos el tren, así que tuvimos que esperar dos horas.', en: 'We missed the train, so we had to wait two hours.' },
    { es: 'No conozco la ciudad, o sea que no puedo ayudarte con eso.', en: "I don't know the city, so I can't help you with that." },
    { es: 'Entonces, ¿al final vienes o no?', en: 'So, are you coming in the end or not?' }
  ],
  probes: [
    { id: 'p:consecB1:orden', kind: 'mcq', q: '¿Cuál conector marca la CONSECUENCIA, no la causa?',
      options: ['porque', 'así que', 'como'], answer: 1 },
    { id: 'p:consecB1:modo', kind: 'mcq', q: '"No había entradas, así que no la ___." (ver)',
      options: ['vimos', 'veamos', 'veríamos'], answer: 0 },
    { id: 'p:consecB1:cloze', kind: 'cloze', text: 'Tengo mucho trabajo, o sea ___ no podré salir.', accept: ['que'] },
    { id: 'p:consecB1:recall', kind: 'recall', front: 'Do consecutive connectors (así que, entonces) trigger the subjunctive?', back: 'no — always indicative' }
  ]
},

{
  id: 'gr-comparativas-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:787', 'gramatica:B1:789', 'gramatica:B1:791', 'gramatica:B1:793', 'gramatica:B1:795'],
  title: 'Comparativas: igual de... que, más de',
  summary: 'Spanish distinguishes más QUE (comparing two things) from más DE (a numeric ceiling) — a difference English\'s single "more than" completely erases, and mixing the two up is a real, gate-checkable error.',
  sections: [
    { h: 'Igual de + adjetivo + que', html: 'Emphasizes the equality of an intensity: <i>Es igual de listo que cualquiera</i> — a slightly stronger claim than plain <i>tan listo como</i>.' },
    { h: 'Más que: comparing two things', html: '<i>Trabaja más que yo</i> — the second term of the comparison is another entity (a person, a thing).' },
    { h: 'Más de: a numeric ceiling', html: '<i>Cuesta más de 20 euros</i> — here <i>de</i> introduces a NUMBER, not another entity being compared. <i>No cuesta más de 20 euros</i> caps it as an exclusive limit.' }
  ],
    contrasts: [
    { es: 'Sabe más que yo.', en: 'He knows more than I do.', note: 'más QUE — comparing to another entity' },
    { es: 'Cuesta más de 20 euros.', en: 'It costs more than 20 euros.', note: 'más DE — a ceiling on a number, not a comparison' }
  ],
  pitfalls: [
    'Never use <i>más que</i> directly before a bare number — <i>*más que 20 euros</i> is wrong; that is exclusively <i>más de</i>\'s job.',
    '<i>Más de</i> introduces a NUMBER; <i>más que</i> introduces the second entity in a comparison — they are not interchangeable.'
  ],
  examples: [
    { es: 'Hay más de cien personas en la sala.', en: 'There are more than a hundred people in the room.' },
    { es: 'Este piso es igual de caro que el otro.', en: 'This flat is just as expensive as the other one.' },
    { es: 'Corre más que cualquiera del equipo.', en: 'He runs more than anyone on the team.' }
  ],
  probes: [
    { id: 'p:comparatB1:dede', kind: 'mcq', q: '"Cuesta más ___ 20 euros." (a number, ceiling)',
      options: ['que', 'de', 'como'], answer: 1 },
    { id: 'p:comparatB1:que', kind: 'mcq', q: '"Sabe más ___ yo." (comparing to another person)',
      options: ['de', 'que', 'como'], answer: 1 },
    { id: 'p:comparatB1:cloze', kind: 'cloze', text: 'Hay más ___ cien personas. (de, before a number)', accept: ['de'] },
    { id: 'p:comparatB1:recall', kind: 'recall', front: 'Before a NUMBER, is it "más que" or "más de"?', back: 'más de' }
  ]
},

{
  id: 'gr-causales-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:750', 'gramatica:B1:751', 'gramatica:B1:752', 'gramatica:B1:753'],
  title: 'Causales: como, por + infinitivo',
  summary: 'Por + infinitive packs an entire cause clause into three words — lo hizo así por no saber otra manera says exactly what porque no sabía otra manera would, only more compactly, and without a conjugated verb of its own.',
  sections: [
    { h: 'Como: reprised from A2', html: '<i>Como no venías, empecé a cenar</i> — still opens the sentence, still indicative.' },
    { h: 'Por + infinitivo: a compact cause', html: '<i>Lo hizo así por no saber otra manera</i> — no full clause, no conjugated verb, just <i>por</i> + infinitive standing in for an entire <i>porque</i>-clause.' },
    { h: 'Always indicative', html: 'Every causal connector at this level — <i>como, porque, por</i> — takes the indicative; nothing here triggers the subjunctive.' }
  ],
    contrasts: [
    { es: 'Lo hizo por no saber otra manera.', en: "He did it because he didn't know any other way.", note: 'compact — por + infinitive' },
    { es: 'Lo hizo porque no sabía otra manera.', en: "He did it because he didn't know any other way.", note: 'the same meaning, spelled out as a full clause' }
  ],
  pitfalls: [
    'Do not confuse causal <i>por + infinitivo</i> (a REASON) with <i>para + infinitivo</i> (a PURPOSE, from A1/A2) — <i>por</i> looks backward to a cause, <i>para</i> looks forward to a goal.',
    '<i>Por</i> + infinitive requires that the subject of the cause is the SAME as the main clause\'s subject; otherwise use a full <i>porque</i>-clause.'
  ],
  examples: [
    { es: 'Perdió el tren por llegar tarde.', en: 'He missed the train because he arrived late.' },
    { es: 'Como no tenía llave, tuve que esperar fuera.', en: "Since I didn't have a key, I had to wait outside." },
    { es: 'Le castigaron por mentir a sus padres.', en: 'He was punished for lying to his parents.' }
  ],
  probes: [
    { id: 'p:causalB1:porpara', kind: 'mcq', q: '"Lo hizo así ___ no saber otra manera." (cause, compact)',
      options: ['para', 'por', 'a'], answer: 1 },
    { id: 'p:causalB1:sujeto', kind: 'mcq', q: '"Perdió el tren ___ llegar tarde." (same subject cause)',
      options: ['porque', 'por', 'como'], answer: 1 },
    { id: 'p:causalB1:cloze', kind: 'cloze', text: '___ no venías, empecé a cenar. (since, opening the sentence)', accept: ['Como', 'como'] },
    { id: 'p:causalB1:recall', kind: 'recall', front: 'por + infinitivo (cause) vs para + infinitivo — what does para mark instead?', back: 'purpose/goal, not cause' }
  ]
},

{
  id: 'gr-relativas-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:689', 'gramatica:B1:690', 'gramatica:B1:691', 'gramatica:B1:692', 'gramatica:B1:695'],
  title: 'Oraciones de relativo: que, quien, donde',
  summary: 'A relative clause with que either PINS DOWN which thing you mean, with no comma, or simply ADDS extra information about something already identified, set off by commas — the same word que, two structurally different jobs.',
  sections: [
    { h: 'Especificativa: no comma, restricts', html: '<i>El coche que compré es rojo</i> — the clause tells you WHICH car; removing it changes which car is meant.' },
    { h: 'Explicativa: comma, adds extra', html: '<i>Mi coche, que es rojo, está en el garaje</i> — the referent is already fully identified (<i>mi coche</i>); the clause just adds a fact about it and could be dropped without losing the reference.' },
    { h: 'Que, quien, donde', html: '<i>Que</i> is the all-purpose relative, for things and people alike. <i>Quien/quienes</i> is reserved for people, mainly after a preposition or inside an explicative clause — it does not open a plain specificative clause the way <i>que</i> does. <i>Donde</i> replaces <i>que</i> for places.' }
  ],
    contrasts: [
    { es: 'El coche que compré es rojo.', en: 'The car I bought is red.', note: 'no commas — restricts which car is meant' },
    { es: 'Mi coche, que es rojo, está en el garaje.', en: 'My car, which is red, is in the garage.', note: 'commas — the car is already identified, this is just extra' }
  ],
  pitfalls: [
    '<i>Quien/quienes</i> does not normally open a plain, comma-free specificative clause: prefer <i>que</i> even for people — <i>el chico que vive aquí</i>, not <i>*el chico quien vive aquí</i>.',
    'Dropping the commas around an explicative clause turns it into a specificative one and can change what the sentence actually claims.'
  ],
  examples: [
    { es: 'Los libros que me prestaste son excelentes.', en: 'The books you lent me are excellent.' },
    { es: 'Ana, que vive en Chile, viene a visitarnos en verano.', en: 'Ana, who lives in Chile, is coming to visit us in summer.' },
    { es: 'No conozco a nadie que hable seis idiomas.', en: 'I don\'t know anyone who speaks six languages.' }
  ],
  probes: [
    { id: 'p:relativB1:tipo', kind: 'mcq', q: '"El coche que compré es rojo" (sin comas) es:',
      options: ['explicativa', 'especificativa', 'ninguna de las dos'], answer: 1 },
    { id: 'p:relativB1:quien', kind: 'mcq', q: '¿Cuál es más natural?',
      options: ['el chico quien vive aquí', 'el chico que vive aquí', 'el chico a quien vive aquí'], answer: 1 },
    { id: 'p:relativB1:cloze', kind: 'cloze', text: 'Este es el pueblo ___ nací. (where)', accept: ['donde'] },
    { id: 'p:relativB1:recall', kind: 'recall', front: 'especificativa vs explicativa — which one uses commas?', back: 'explicativa (adds extra info about an already-identified thing)' }
  ]
},

{
  id: 'gr-interrogativos-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:264', 'gramatica:B1:265', 'gramatica:B1:269', 'gramatica:B1:273', 'gramatica:B1:275'],
  title: 'Interrogativos: qué, quién, cuál + preposición',
  summary: 'A question word preceded by a preposition moves that preposition to the very front of the question, exactly where English would strand it at the end — ¿Con quién trabajas?, never a Spanish sentence ending in "with."',
  sections: [
    { h: 'The preposition always fronts', html: '<i>¿Con qué escribes?</i>, <i>¿A qué juegas?</i>, <i>¿Con quién trabajas?</i> — Spanish never strands a preposition at the end of a question the way English does with "who…with?"' },
    { h: 'A quién for a personal object', html: 'Asking about a person as a direct or indirect object needs the personal <i>a</i> fronted along with <i>quién</i>: <i>¿A quién ves?</i>, <i>¿A quién le das el libro?</i>' },
    { h: 'Cuál still never precedes a noun directly', html: 'Reinforcing the A2 rule: <i>*¿Cuál libro quieres?</i> is wrong — use <i>¿Qué libro quieres?</i> when a noun follows directly; <i>cuál</i> stands alone, selecting from an implied set.' }
  ],
    contrasts: [
    { es: '¿Con quién trabajas?', en: 'Who do you work with?', note: 'correct — the preposition moves to the front' },
    { es: '*¿Quién trabajas con?', en: '(wrong — a direct calque of English word order)', note: 'Spanish never leaves the preposition stranded at the end' }
  ],
  pitfalls: [
    '<i>Cuál/cuáles</i> is never directly followed by a noun — <i>*cuál libro</i> is wrong; use <i>qué libro</i> instead.',
    'Never strand a preposition at the end of a Spanish question the way English does — it must move to the front with the question word.'
  ],
  examples: [
    { es: '¿De qué habla la película?', en: 'What is the film about?' },
    { es: '¿Para quién es este regalo?', en: 'Who is this present for?' },
    { es: '¿Cuál de estas dos opciones prefieres?', en: 'Which of these two options do you prefer?' }
  ],
  probes: [
    { id: 'p:interrogB1:frontear', kind: 'mcq', q: '"Who do you work with?" en español:',
      options: ['¿Quién trabajas con?', '¿Con quién trabajas?', '¿Trabajas con quién?'], answer: 1 },
    { id: 'p:interrogB1:cualnoun', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['¿Cuál libro quieres?', '¿Qué libro quieres?', '¿Cuáles libro quieres?'], answer: 1 },
    { id: 'p:interrogB1:cloze', kind: 'cloze', text: '¿___ quién es este regalo? (for)', accept: ['Para', 'para'] },
    { id: 'p:interrogB1:recall', kind: 'recall', front: 'Where does the preposition go in a Spanish question — start or end?', back: 'the start, always fronted with the question word' }
  ]
},

{
  id: 'gr-subordinadas-sustantivas-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:662', 'gramatica:B1:664', 'gramatica:B1:668', 'gramatica:B1:672', 'gramatica:B1:674'],
  title: 'Subordinadas sustantivas: infinitivo o que + verbo',
  summary: 'A subordinate clause standing in for a subject or object can be a bare infinitive for a general claim, or a full que + subjunctive clause about someone specific — the exact same same-subject/different-subject rule from the subjunctive lesson, now shown to reach far beyond just "querer."',
  sections: [
    { h: 'Infinitivo: generic or same-subject', html: '<i>Leer ayuda a mejorar el vocabulario</i> makes a claim about reading IN GENERAL, no one in particular. <i>Me da miedo hablar</i> uses the infinitive because the person afraid and the person who would speak are the same "me."' },
    { h: 'Que + subjuntivo: a specific, different subject', html: '<i>Me encanta que me llames</i> is about YOUR calling, not mine — two different people, so the infinitive is no longer possible and <i>que</i> + subjunctive takes over, exactly the same pattern as <i>querer que</i>.' },
    { h: 'The rule generalizes', html: 'This is not a special case of <i>querer</i> — it is a GENERAL rule for any clause functioning as a subject or object: same subject → infinitive; different subject, with the right kind of trigger verb → que + subjunctive.' }
  ],
    contrasts: [
    { es: 'Me encanta ir al cine.', en: 'I love going to the cinema.', note: 'same subject — infinitive' },
    { es: 'Me encanta que me llames.', en: 'I love it when you call me.', note: 'different subjects — que + subjunctive' }
  ],
  pitfalls: [
    'This is the identical same-subject/different-subject rule from the presente de subjuntivo lesson — apply it to ANY clause acting as a subject or object, not only after <i>querer</i>.',
    '<i>Es seguro/es verdad que</i> (certainty) takes the indicative; <i>es posible/es probable que</i> (uncertainty) takes the subjunctive — the impersonal expression itself decides the mood.'
  ],
  examples: [
    { es: 'Nos preocupa que no haya llamado todavía.', en: "It worries us that he hasn't called yet." },
    { es: 'Es probable que llueva esta tarde.', en: "It's likely to rain this afternoon." },
    { es: 'Prefiero quedarme en casa hoy.', en: 'I prefer to stay home today.' }
  ],
  probes: [
    { id: 'p:subsustB1:mismosujeto', kind: 'mcq', q: '"Me da miedo ___." (hablar en público, mismo sujeto)',
      options: ['que hable', 'hablar', 'que hablo'], answer: 1 },
    { id: 'p:subsustB1:distinto', kind: 'mcq', q: '"Me encanta ___." (that you call me, distinto sujeto)',
      options: ['llamarme', 'que me llames', 'que me llamas'], answer: 1 },
    { id: 'p:subsustB1:cloze', kind: 'cloze', text: 'Es probable que ___ (llover) esta tarde.', accept: ['llueva'] },
    { id: 'p:subsustB1:recall', kind: 'recall', front: 'When the subject of both clauses is the SAME, do you use the infinitive or que + subjunctive?', back: 'the infinitive' }
  ]
},

/* ============================================================================
 * BATCH — B1 notion, batch A of several (existence/quality/epistemic cluster).
 * B1 notion has 61 syllabus units; thin, closely-related siblings are merged
 * throughout, following the precedent set at A1/A2.
 * ========================================================================== */
{
  id: 'nt-existencia-disponibilidad-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:1', 'nociones_generales:B1:2', 'nociones_generales:B1:14', 'nociones_generales:B1:15', 'nociones_generales:B1:31', 'nociones_generales:B1:32'],
  title: 'Existencia y disponibilidad: vacío, libre, ocupado',
  summary: 'Vacío/lleno describe whether a space has anything in it at all; libre/ocupado describe whether that space is AVAILABLE to you — two genuinely different questions, since a full train can still have a free seat.',
  sections: [
    { h: 'Existence itself', html: '<i>Existir</i> states bare existence: <i>Esa palabra no existe en español</i>. <i>Crear/destruir/construir</i> mark the two directions of bringing something into or out of existence.' },
    { h: 'Vacío/lleno: contents', html: 'Whether a space HAS anything in it: <i>La sala está llena</i>, <i>El vaso está vacío</i>.' },
    { h: 'Libre/ocupado: availability', html: 'A completely different question — whether something is available for USE: <i>Hay una silla libre</i> can be true even in a full room, because "full of people" and "no free seats" are not the same fact.' }
  ],
  exponents: [
    { es: 'Esa palabra no existe en español.', en: "That word doesn't exist in Spanish.", register: 'neutral' },
    { es: 'La sala estaba llena, pero encontramos una silla libre.', en: 'The room was full, but we found a free chair.', register: 'neutral', note: 'full of people AND a free seat — not a contradiction' },
    { es: 'El baño está ocupado.', en: 'The bathroom is occupied.', register: 'neutral' },
    { es: 'He perdido las llaves, no las encuentro.', en: "I've lost my keys, I can't find them.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'La sala está llena.', en: 'The room is full.', note: 'about CONTENTS — how many people are in it' },
    { es: 'Hay una silla libre.', en: 'There\'s a free chair.', note: 'about AVAILABILITY — a different fact, can be true even in a full room' }
  ],
  pitfalls: [
    '<i>Lleno/vacío</i> and <i>libre/ocupado</i> answer different questions — do not treat them as synonyms.',
    '<i>(Des)aparecer</i> and <i>perder/encontrar</i> both describe presence flickering in and out, but from different grammatical angles: the thing disappears vs. you lose it.'
  ],
  examples: [
    { es: 'El día de la presentación hubo bastante público.', en: 'On the day of the presentation there was quite an audience.' },
    { es: 'Estoy preparado para la entrevista.', en: "I'm ready for the interview." },
    { es: 'No tiene tiempo libre esta semana.', en: "He doesn't have free time this week." }
  ],
  probes: [
    { id: 'p:existdisp:distincion', kind: 'mcq', q: '"La sala está llena" y "hay una silla libre" — ¿son contradictorios?',
      options: ['sí, siempre', 'no, pueden ser ambos ciertos', 'solo a veces'], answer: 1 },
    { id: 'p:existdisp:existir', kind: 'mcq', q: '"Esa palabra no ___ en español."',
      options: ['está', 'existe', 'hay'], answer: 1 },
    { id: 'p:existdisp:cloze', kind: 'cloze', text: 'El baño está ___. (occupied)', accept: ['ocupado'] },
    { id: 'p:existdisp:recall', kind: 'recall', front: 'lleno/vacío vs libre/ocupado — which pair is about AVAILABILITY?', back: 'libre/ocupado' }
  ]
},

{
  id: 'nt-cualidad-generalidad-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:44', 'nociones_generales:B1:45', 'nociones_generales:B1:47', 'nociones_generales:B1:48', 'nociones_generales:B1:115', 'nociones_generales:B1:116'],
  title: 'Cualidad y generalidad: tipo, forma, en general',
  summary: 'Parecer (to seem) and parecerse a (to resemble) share a root but describe two unrelated things — one is your IMPRESSION of something, the other is a physical LIKENESS to something else — and mixing them up is a common, gate-checkable slip.',
  sections: [
    { h: 'Sorting: cualidad, clase, tipo', html: '<i>Es una persona con muchas cualidades</i>; <i>no me gusta ese tipo de botas</i> — naming the category something falls into.' },
    { h: 'Forma and resemblance', html: '<i>¿Qué forma tiene?</i> asks about shape. <i>Parecer</i> states an impression (<i>parece cansado</i> — "he seems tired"); <i>parecerse a</i> states a resemblance to someone/something else (<i>se parece a su padre</i> — "he looks like his father"). Same root, different jobs.' },
    { h: 'Stepping back: en general, mayoría', html: '<i>En general</i> and <i>la mayoría</i> shift from one example to the typical or dominant case: <i>En general, prefiero el té</i>.' }
  ],
  exponents: [
    { es: 'Es una persona con muchas cualidades.', en: 'She\'s a person with a lot of good qualities.', register: 'neutral' },
    { es: 'Parece cansado hoy.', en: 'He seems tired today.', register: 'neutral', note: 'parecer — an impression' },
    { es: 'Se parece mucho a su padre.', en: 'He looks a lot like his father.', register: 'neutral', note: 'parecerse a — a resemblance' },
    { es: 'En general, la gente aquí es muy amable.', en: 'In general, people here are very kind.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Parece cansado.', en: 'He seems tired.', note: 'parecer — an impression about him, right now' },
    { es: 'Se parece a su padre.', en: 'He looks like his father.', note: 'parecerse a — a lasting physical resemblance' }
  ],
  pitfalls: [
    '<i>Parecer</i> (to seem) and <i>parecerse a</i> (to resemble) are NOT interchangeable, despite sharing a root — check whether you mean an impression or a likeness.',
    '<i>En general</i> makes a claim about the typical case — do not use it to describe one specific instance.'
  ],
  examples: [
    { es: '¿Qué forma tiene ese edificio? — Es redondo.', en: '—What shape is that building? —It\'s round.' },
    { es: 'La mayoría de mis amigos viven fuera del país.', en: 'Most of my friends live abroad.' },
    { es: 'Es una novela muy original, no se parece a nada que haya leído.', en: "It's a very original novel, it's not like anything I've read." }
  ],
  probes: [
    { id: 'p:cualgen:parecer', kind: 'mcq', q: '"He looks like his mother":',
      options: ['Parece a su madre.', 'Se parece a su madre.', 'Parece su madre.'], answer: 1 },
    { id: 'p:cualgen:impresion', kind: 'mcq', q: '"He seems tired" (an impression, not a resemblance):',
      options: ['Se parece cansado.', 'Parece cansado.', 'Es parecido cansado.'], answer: 1 },
    { id: 'p:cualgen:cloze', kind: 'cloze', text: '___, prefiero el té al café. (in general)', accept: ['En general', 'en general'] },
    { id: 'p:cualgen:recall', kind: 'recall', front: 'parecer vs parecerse a — which one states a physical resemblance?', back: 'parecerse a' }
  ]
},

{
  id: 'nt-certeza-realidad-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:70', 'nociones_generales:B1:71', 'nociones_generales:B1:75', 'nociones_generales:B1:76', 'nociones_generales:B1:92', 'nociones_generales:B1:94'],
  title: 'Certeza e incertidumbre: seguro, tal vez, imaginario',
  summary: 'Es evidente commits fully to a fact, tal vez floats a possibility with none at all — but a lo mejor, despite belonging to that same doubt family, unusually keeps the indicative, one of the classic B1 subjunctive exceptions.',
  sections: [
    { h: 'Full commitment: certeza', html: '<i>Es evidente</i>, <i>está claro</i>, <i>es imposible</i> all state a fact (or its impossibility) with full confidence — indicative, matching the certainty rule from the subjunctive lesson.' },
    { h: 'Hedging: incertidumbre', html: '<i>Dudar</i>, <i>posiblemente</i>, <i>tal vez</i> spread across a scale of doubt — most of this family pulls the following verb into the subjunctive.' },
    { h: 'The exception: a lo mejor', html: 'Despite meaning almost the same as <i>tal vez</i>, <i>a lo mejor</i> conventionally keeps the INDICATIVE: <i>A lo mejor viene</i>, not <i>*a lo mejor venga</i> — a well-known irregularity in the doubt family.' },
    { h: 'Realidad, ficción, imaginación', html: 'The same certainty/uncertainty scale reappears applied to what is real: <i>real</i>, <i>imaginario</i>, <i>realista</i>, <i>soñar/imaginar</i>.' }
  ],
  exponents: [
    { es: 'Está claro que no va a venir.', en: "It's clear he's not coming.", register: 'neutral', note: 'certainty — indicative' },
    { es: 'Tal vez llueva esta tarde.', en: 'It might rain this afternoon.', register: 'neutral', note: 'tal vez — commonly subjunctive' },
    { es: 'A lo mejor viene más tarde.', en: 'He might come later.', register: 'coloquial', note: 'a lo mejor — the exception, keeps the indicative' },
    { es: 'Ese personaje es completamente imaginario.', en: 'That character is entirely fictional.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Tal vez venga mañana.', en: 'He might come tomorrow.', note: 'tal vez — commonly pulls the subjunctive' },
    { es: 'A lo mejor viene mañana.', en: 'He might come tomorrow.', note: 'a lo mejor — nearly the same meaning, but keeps the indicative' }
  ],
  pitfalls: [
    '<i>A lo mejor</i> is a doubt expression that unusually takes the indicative, not the subjunctive its meaning would suggest — memorize it as the exception.',
    'Do not confuse <i>real</i> (real, actual) with <i>realista</i> (realistic, in the sense of "sensible/practical") — the two are not synonyms.'
  ],
  examples: [
    { es: 'Es evidente que ha estudiado mucho.', en: "It's evident he's studied a lot." },
    { es: 'Dudo que tengamos tiempo para todo.', en: "I doubt we'll have time for everything." },
    { es: 'De niño soñaba con ser piloto.', en: 'As a child he dreamed of being a pilot.' }
  ],
  probes: [
    { id: 'p:certreal:excepcion', kind: 'mcq', q: '"A lo mejor ___ mañana." (venir)',
      options: ['viene', 'venga', 'vendría'], answer: 0 },
    { id: 'p:certreal:tal vez', kind: 'mcq', q: '"Tal vez ___ esta tarde." (llover — comúnmente subjuntivo)',
      options: ['llueve', 'llueva', 'lloverá'], answer: 1 },
    { id: 'p:certreal:cloze', kind: 'cloze', text: 'Está claro que no va a ___. (venir)', accept: ['venir'] },
    { id: 'p:certreal:recall', kind: 'recall', front: 'Which doubt expression unusually keeps the indicative?', back: 'a lo mejor' }
  ]
},

{
  id: 'nt-necesidad-obligacion-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:105', 'nociones_generales:B1:106', 'nociones_generales:B1:107', 'nociones_generales:B1:108', 'nociones_generales:B1:110'],
  title: 'Necesidad y obligación: depender de, ser obligatorio',
  summary: 'Depender de makes an outcome hinge on something entirely outside your control, while ser obligatorio states a flat, impersonal, often official requirement — both stronger and colder than the everyday necesitar from A2.',
  sections: [
    { h: 'Depender de: contingency', html: 'The outcome is not fixed — it hinges on something else: <i>Depende del tiempo que haga</i> ("it depends on the weather").' },
    { h: 'Ser obligatorio: an official requirement', html: 'Carries a legal or regulatory flavour that plain <i>necesario</i> lacks: <i>Es obligatorio llevar casco</i>. <i>Necesariamente/obligatoriamente</i> are the matching adverbs.' },
    { h: '(In)evitable and por suerte', html: '<i>Inevitable</i> asks whether something can be avoided at all; <i>por suerte</i> is the flip side of pure necessity — luck rather than requirement.' }
  ],
  exponents: [
    { es: 'Depende del tiempo que haga el sábado.', en: 'It depends on the weather on Saturday.', register: 'neutral' },
    { es: 'Es obligatorio llevar casco en la obra.', en: "It's mandatory to wear a helmet on the site.", register: 'neutral', note: 'obligatorio — an official, regulatory flavour' },
    { es: 'Era inevitable que pasara esto tarde o temprano.', en: 'It was inevitable that this would happen sooner or later.', register: 'neutral' },
    { es: 'Por suerte, no llovió el día de la boda.', en: 'Luckily, it didn\'t rain on the wedding day.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Es necesario reservar con antelación.', en: 'It is necessary to book in advance.', note: 'A2 — a general recommendation' },
    { es: 'Es obligatorio llevar casco.', en: "It's mandatory to wear a helmet.", note: 'B1 — a stronger, official/legal requirement' }
  ],
  pitfalls: [
    'Reach for <i>obligatorio</i>, not <i>necesario</i>, when talking about rules, laws or regulations — it carries an official flavour <i>necesario</i> does not.',
    '<i>Depender de</i> always needs <i>de</i> before what the outcome hinges on: <i>depende del tiempo</i>, not <i>*depende el tiempo</i>.'
  ],
  examples: [
    { es: 'Todo depende de si consigo el visado a tiempo.', en: "It all depends on whether I get the visa in time." },
    { es: 'En este país, votar no es obligatorio.', en: 'In this country, voting is not mandatory.' },
    { es: 'Por suerte, encontramos aparcamiento enseguida.', en: 'Luckily, we found parking right away.' }
  ],
  probes: [
    { id: 'p:necobligB1:preposicion', kind: 'mcq', q: '"Todo ___ del tiempo." (depende)',
      options: ['depende', 'depende de', 'depende en'], answer: 1 },
    { id: 'p:necobligB1:oficial', kind: 'mcq', q: 'Palabra con connotación oficial/legal:',
      options: ['necesario', 'obligatorio', 'útil'], answer: 1 },
    { id: 'p:necobligB1:cloze', kind: 'cloze', text: '___ suerte, no llovió. (luckily)', accept: ['Por', 'por'] },
    { id: 'p:necobligB1:recall', kind: 'recall', front: 'Which word for necessity carries a legal/regulatory flavour?', back: 'obligatorio' }
  ]
},

{
  id: 'nt-acontecimiento-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:62', 'nociones_generales:B1:63', 'nociones_generales:B1:64', 'nociones_generales:B1:65'],
  title: 'Acontecimiento: tener lugar, celebrarse',
  summary: 'Tener lugar is the formal way to say an event happens — a cousin to hay, but for EVENTS rather than things — and it never actually uses hay itself, a substitution beginners often reach for by mistake.',
  sections: [
    { h: 'Ser + lugar / tener lugar: formal register', html: '<i>Los primeros Juegos Olímpicos fueron en Atenas</i>; <i>La reunión tuvo lugar el día 15</i> — both name where/when an event happened, in a formal, written register.' },
    { h: 'Pasar: the everyday equivalent', html: '<i>¿Qué ha pasado?</i>, <i>Aquí nunca pasa nada</i> — the neutral, spoken-register verb for "to happen."' },
    { h: 'Celebrar(se): a planned occurrence', html: '<i>La boda se celebró el sábado</i> — reflexive when the event itself is the grammatical subject, marking that the occurrence was by design, not accident.' }
  ],
  exponents: [
    { es: 'La reunión tuvo lugar el día 15.', en: 'The meeting took place on the 15th.', register: 'formal', note: 'tener lugar — formal register' },
    { es: '¿Qué ha pasado aquí?', en: 'What has happened here?', register: 'neutral', note: 'pasar — the everyday equivalent' },
    { es: 'La boda se celebró en el jardín.', en: 'The wedding was held in the garden.', register: 'neutral', note: 'celebrarse — a planned occurrence' },
    { es: 'El concierto se ha cancelado.', en: 'The concert has been cancelled.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'La reunión tuvo lugar el día 15.', en: 'The meeting took place on the 15th.', note: 'correct — formal' },
    { es: '*Hay la reunión el día 15.', en: '(wrong)', note: 'hay does not work this way for a scheduled event' }
  ],
  pitfalls: [
    'Do not use <i>hay</i> to say an event takes place — <i>tener lugar</i>, <i>ser</i>, or <i>pasar</i> are the correct choices; <i>hay</i> simply does not fit here.',
    '<i>Celebrarse</i> implies the event was planned — do not use it for something accidental or unplanned; <i>pasar</i> covers that instead.'
  ],
  examples: [
    { es: 'El festival se celebra todos los años en julio.', en: 'The festival is held every year in July.' },
    { es: 'La ceremonia tendrá lugar en el auditorio principal.', en: 'The ceremony will take place in the main auditorium.' },
    { es: 'Nunca pasa nada interesante en este pueblo.', en: 'Nothing interesting ever happens in this town.' }
  ],
  probes: [
    { id: 'p:aconteci:tenerlugar', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Hay la reunión el día 15.', 'La reunión tuvo lugar el día 15.', 'La reunión hay el día 15.'], answer: 1 },
    { id: 'p:aconteci:registro', kind: 'mcq', q: 'Más informal/hablado para "to happen":',
      options: ['tener lugar', 'pasar', 'celebrarse'], answer: 1 },
    { id: 'p:aconteci:cloze', kind: 'cloze', text: 'La boda se ___ en el jardín. (was celebrated)', accept: ['celebró'] },
    { id: 'p:aconteci:recall', kind: 'recall', front: 'What verb NEVER works to say an event "takes place"?', back: 'hay' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 notion, batch B: the quantity/measurement cluster (11 syllabus units,
 * several of them short and closely related, merged into 4 fuller lessons).
 * ------------------------------------------------------------------------ */
{
  id: 'nt-cantidad-numerica-relativa-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:129', 'nociones_generales:B1:130', 'nociones_generales:B1:133', 'nociones_generales:B1:139', 'nociones_generales:B1:141', 'nociones_generales:B1:145'],
  title: 'Cantidad: en total, por ciento, la mayoría de',
  summary: 'La mayoría behaves grammatically like a container word from A2 — it needs de before the group it refers to, exactly like un grupo de or una botella de — so la mayoría chilenos is as wrong as una botella agua.',
  sections: [
    { h: 'En total: summing up', html: 'After counting, <i>en total</i> gives the final figure: <i>¿Cuánto es en total?</i>, <i>Había 150 personas en total</i>.' },
    { h: 'Por ciento: proportion out of a hundred', html: '<i>[número] + por ciento</i>: <i>Los precios subieron un 1,6%.</i>' },
    { h: 'La mayoría de: needs its "de"', html: '<i>La mayoría de los chilenos</i> — like <i>todos los</i> and container words, <i>la mayoría</i> cannot attach directly to a bare noun.' },
    { h: 'Casi todo, casi nada, solo', html: '<i>Casi todo/casi nada/casi nadie</i> sit near the extremes of a scale; <i>solo/solamente</i> restricts to exactly one case.' }
  ],
  exponents: [
    { es: '¿Cuánto es en total?', en: 'How much is it altogether?', register: 'neutral' },
    { es: 'Los precios subieron un 1,6% el año pasado.', en: 'Prices rose 1.6% last year.', register: 'neutral' },
    { es: 'La mayoría de mis compañeros ya se han ido.', en: 'Most of my colleagues have already left.', register: 'neutral', note: 'mayoría + de, like a container word' },
    { es: 'No ha comido casi nada hoy.', en: "He's barely eaten anything today.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'la mayoría de los chilenos', en: 'most Chileans', note: 'correct — de is obligatory before the group' },
    { es: '*la mayoría chilenos', en: '(wrong)', note: 'exactly the same error as *una botella agua' }
  ],
  pitfalls: [
    '<i>La mayoría</i> always needs <i>de</i> before the group, just like the A2 container words — never attach it directly to a bare plural noun.',
    '<i>Solo</i> (only, adverb) has traditionally carried an accent to distinguish it from <i>solo</i> (alone, adjective) — modern spelling drops it in almost all contexts, but be aware both spellings exist in older texts.'
  ],
  examples: [
    { es: 'Solamente vinieron diez personas a la reunión.', en: 'Only ten people came to the meeting.' },
    { es: 'La mayoría de los estudiantes aprobó el examen.', en: 'Most of the students passed the exam.' },
    { es: 'Casi nadie sabía la respuesta correcta.', en: 'Almost nobody knew the correct answer.' }
  ],
  probes: [
    { id: 'p:cantnumrel:mayoria', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['la mayoría chilenos', 'la mayoría de los chilenos', 'la mayoría de chilenos'], answer: 1 },
    { id: 'p:cantnumrel:porciento', kind: 'mcq', q: '"Prices rose 1.6%":',
      options: ['Los precios subieron un 1,6%.', 'Los precios subieron 1,6% total.', 'Los precios subieron con 1,6%.'], answer: 0 },
    { id: 'p:cantnumrel:cloze', kind: 'cloze', text: '¿Cuánto es en ___? (altogether)', accept: ['total'] },
    { id: 'p:cantnumrel:recall', kind: 'recall', front: 'What does "la mayoría" need before the group it refers to?', back: 'de (la mayoría de los...)' }
  ]
},

{
  id: 'nt-aumento-proporcion-grado-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:157', 'nociones_generales:B1:158', 'nociones_generales:B1:166', 'nociones_generales:B1:167', 'nociones_generales:B1:177', 'nociones_generales:B1:178'],
  title: 'Aumento y proporción: subida, la mitad, sobre todo',
  summary: 'Subida and bajada name a CHANGE as a noun where aumentar/disminuir name it as a verb — the same fact, different part of speech — and fractions like la mitad and un tercio need "de" before the group, exactly like la mayoría.',
  sections: [
    { h: 'Verb and matching noun', html: '<i>Aumentar/disminuir</i> (verbs) pair with <i>subida/bajada</i> (nouns): <i>Los precios aumentaron</i> / <i>una subida de los precios</i> say the same thing in different grammatical shapes.' },
    { h: 'Fractions: needs de', html: '<i>La mitad, el doble, un cuarto, un tercio</i> + <i>de</i> + the group: <i>la mitad de los adultos</i>, <i>un tercio de los jóvenes</i> — the same pattern as <i>la mayoría de</i>.' },
    { h: 'Grado: intensity', html: '<i>Sobre todo</i> singles out the standout case within a general statement: <i>Me gustan los deportes de equipo, sobre todo el baloncesto</i>. <i>¡Qué interesante!</i> and the suffixes <i>-ísimo/-ito</i> intensify from the other direction.' }
  ],
  exponents: [
    { es: 'Hubo una subida de los precios este mes.', en: 'There was a rise in prices this month.', register: 'neutral', note: 'subida — the noun form of aumentar' },
    { es: 'La mitad de los adultos no hace suficiente ejercicio.', en: 'Half of adults don\'t get enough exercise.', register: 'neutral' },
    { es: 'Un tercio de los jóvenes vive todavía con sus padres.', en: 'A third of young people still live with their parents.', register: 'neutral' },
    { es: 'Me gustan los deportes de equipo, sobre todo el baloncesto.', en: 'I like team sports, especially basketball.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Los precios aumentaron un 10%.', en: 'Prices rose 10%.', note: 'aumentar — verb' },
    { es: 'Hubo una subida del 10% en los precios.', en: 'There was a 10% rise in prices.', note: 'subida — the same fact, as a noun' }
  ],
  pitfalls: [
    'Fractions (<i>la mitad, un tercio, un cuarto</i>) need <i>de</i> before the group, just like <i>la mayoría</i> — never attach them directly to a bare noun.',
    '<i>Sobre todo</i> means "especially, in particular," picking out one standout case — do not read it as a literal "above everything."'
  ],
  examples: [
    { es: 'El doble de gente vino este año que el año pasado.', en: 'Twice as many people came this year as last year.' },
    { es: 'Los sombreros tienen un 10% de descuento.', en: 'The hats have a 10% discount.' },
    { es: '¡Qué difícil fue ese examen!', en: 'That exam was so hard!' }
  ],
  probes: [
    { id: 'p:aumprop:fraccion', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['la mitad adultos', 'la mitad de los adultos', 'la mitad de adultos'], answer: 1 },
    { id: 'p:aumprop:nounverb', kind: 'mcq', q: 'La forma NOMINAL de "aumentar":',
      options: ['subida', 'aumentado', 'aumentoso'], answer: 0 },
    { id: 'p:aumprop:cloze', kind: 'cloze', text: 'Me gustan los deportes, ___ todo el fútbol. (especially)', accept: ['sobre'] },
    { id: 'p:aumprop:recall', kind: 'recall', front: 'What preposition do fractions (la mitad, un tercio) need before the group?', back: 'de' }
  ]
},

{
  id: 'nt-medidas-tamano-superficie-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:188', 'nociones_generales:B1:192', 'nociones_generales:B1:195', 'nociones_generales:B1:206', 'nociones_generales:B1:207'],
  title: 'Medidas: medir, tamaño, metros cuadrados',
  summary: 'Medir does triple duty — a person\'s height, an object\'s length, and an area\'s size — the same verb serving three different kinds of measurement, while caber is a completely separate, irregular verb about whether something FITS.',
  sections: [
    { h: 'Medir: one verb, three uses', html: '<i>Mido 1,70</i> (a person\'s height), <i>la mesa mide dos metros</i> (an object\'s length), <i>el jardín mide 200 metros cuadrados</i> (an area\'s size) — all the same verb.' },
    { h: 'Tamaño and superficie as nouns', html: '<i>De tamaño grande/pequeño/mediano</i> describes size generally; <i>superficie/zona/espacio</i> describe area and room specifically, with <i>metros cuadrados</i> for exact figures.' },
    { h: 'Caber: fitting, not measuring', html: '<i>No cabe, es demasiado grande</i> — <i>caber</i> (irregular: <i>quepo, cabes, cabe…</i>) judges whether something FITS a space, a different question from what its measurements are.' }
  ],
  exponents: [
    { es: 'Mido 1,70 m.', en: "I'm 1.70m tall.", register: 'neutral' },
    { es: 'La mesa mide dos metros de largo.', en: 'The table is two metres long.', register: 'neutral' },
    { es: 'El jardín mide 200 metros cuadrados.', en: 'The garden is 200 square metres.', register: 'neutral' },
    { es: 'El sofá no cabe por la puerta.', en: "The sofa doesn't fit through the door.", register: 'neutral', note: 'caber — fitting, not measuring' }
  ],
  contrasts: [
    { es: 'El armario mide dos metros de alto.', en: 'The wardrobe is two metres tall.', note: 'medir — a fact about its measurements' },
    { es: 'El armario no cabe en esta habitación.', en: "The wardrobe doesn't fit in this room.", note: 'caber — a judgement about a specific space, unrelated to the exact measurement' }
  ],
  pitfalls: [
    '<i>Caber</i> is irregular (<i>quepo, cabes, cabe, cabemos, cabéis, caben</i>) and means "to fit" — do not confuse it with <i>medir</i>, which states a measurement without judging whether it fits anywhere.',
    'Area is always stated in <i>metros cuadrados</i>, never bare <i>metros</i> — dropping "cuadrados" turns an area into a length.'
  ],
  examples: [
    { es: '¿Cuánto mides? — Mido 1,80.', en: '—How tall are you? —I\'m 1.80m.' },
    { es: 'Este piso tiene poco espacio para tantos muebles.', en: "This flat doesn't have much space for so much furniture." },
    { es: 'No cabemos todos en un solo coche.', en: "We don't all fit in one car." }
  ],
  probes: [
    { id: 'p:medidastam:cuadrados', kind: 'mcq', q: '"The garden is 200 square metres":',
      options: ['El jardín mide 200 metros.', 'El jardín mide 200 metros cuadrados.', 'El jardín tiene 200 metros.'], answer: 1 },
    { id: 'p:medidastam:caber', kind: 'mcq', q: '"El sofá no ___ por la puerta." (fits)',
      options: ['mide', 'cabe', 'tiene'], answer: 1 },
    { id: 'p:medidastam:cloze', kind: 'cloze', text: '¿Cuánto ___? — Mido 1,80. (are you)', accept: ['mides'] },
    { id: 'p:medidastam:recall', kind: 'recall', front: 'medir vs caber — which one judges whether something FITS a space?', back: 'caber' }
  ]
},

{
  id: 'nt-temperatura-velocidad-volumen-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:213', 'nociones_generales:B1:216', 'nociones_generales:B1:220', 'nociones_generales:B1:200', 'nociones_generales:B1:201', 'nociones_generales:B1:209'],
  title: 'Temperatura, velocidad y volumen: grados, km por hora',
  summary: 'Estar a + number + grados states a temperature the exact same way estar a + number + kilómetros states a distance — one "estar a" pattern reused across several completely different kinds of measurement.',
  sections: [
    { h: 'Temperatura: estar a + grados', html: '<i>Estamos a 30 grados</i>, <i>tres grados bajo cero</i> ("bajo cero" always attached when below freezing). <i>Calentar(se)/enfriar(se)</i> and <i>(des)congelar/hervir</i> name the processes.' },
    { h: 'Velocidad: a + km por hora', html: '<i>Iba a 100 kilómetros por hora</i>; <i>deprisa/rápidamente/lentamente</i> describe pace without a number; <i>poco a poco</i> marks a gradual pace.' },
    { h: 'Volumen y capacidad', html: '<i>Lleno/vacío</i> reprised for containers specifically; <i>llenar/vaciar</i> are the matching verbs; <i>caber</i> reappears to judge whether a volume fits inside a container.' }
  ],
  exponents: [
    { es: 'Hoy estamos a 30 grados.', en: "Today it's 30 degrees.", register: 'neutral', note: 'estar a — the same pattern as distance' },
    { es: 'Anoche cayeron tres grados bajo cero.', en: 'Last night it dropped to three below zero.', register: 'neutral' },
    { es: 'Iba a 100 kilómetros por hora cuando lo pararon.', en: 'He was going 100 km/h when they stopped him.', register: 'neutral' },
    { es: 'Llena la botella hasta arriba.', en: 'Fill the bottle to the top.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Estamos a 30 grados.', en: "It's 30 degrees.", note: 'estar a — temperature' },
    { es: 'Granada está a 30 kilómetros.', en: 'Granada is 30 kilometres away.', note: 'the identical estar a pattern, reused for distance' }
  ],
  pitfalls: [
    'Below-zero temperatures always need <i>bajo cero</i> attached — <i>tres grados bajo cero</i>, never bare <i>tres grados</i> for a negative temperature.',
    '<i>Rápido</i> is an adjective; <i>rápidamente/deprisa</i> are the adverbs that actually modify a verb — do not use the bare adjective adverbially.'
  ],
  examples: [
    { es: 'La leche está a punto de hervir.', en: 'The milk is about to boil.' },
    { es: 'Conducía demasiado deprisa por la ciudad.', en: 'He was driving too fast through the city.' },
    { es: 'El vaso está medio vacío, no medio lleno.', en: "The glass is half empty, not half full." }
  ],
  probes: [
    { id: 'p:tempvelvol:bajocero', kind: 'mcq', q: '"Three degrees below zero":',
      options: ['tres grados', 'tres grados bajo cero', 'bajo tres grados cero'], answer: 1 },
    { id: 'p:tempvelvol:patron', kind: 'mcq', q: '"Estamos a 30 grados" usa el mismo patrón que:',
      options: ['Granada está a 30 kilómetros.', 'Granada es 30 kilómetros.', 'Granada tiene 30 kilómetros.'], answer: 0 },
    { id: 'p:tempvelvol:cloze', kind: 'cloze', text: 'Iba a 100 kilómetros por ___. (per hour)', accept: ['hora'] },
    { id: 'p:tempvelvol:recall', kind: 'recall', front: 'What grammatical pattern do temperature and distance share?', back: 'estar a + [número] + [unidad]' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 notion, batch C: position/location/movement cluster (6 syllabus units,
 * merged into 3 lessons).
 * ------------------------------------------------------------------------ */
{
  id: 'nt-localizacion-posicion-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:271', 'nociones_generales:B1:273', 'nociones_generales:B1:289', 'nociones_generales:B1:291', 'nociones_generales:B1:296', 'nociones_generales:B1:298'],
  title: 'Localización y posición: junto a, al fondo, en ninguna parte',
  summary: 'En ninguna parte and en todas partes push the A1 aquí/allí system to its two extremes — nowhere and everywhere — while junto a, al fondo and en el medio give the fine-grained position vocabulary a described room actually needs.',
  sections: [
    { h: 'The extremes: ninguna parte, todas partes', html: '<i>No lo he visto en ninguna parte</i> ("I haven\'t seen it anywhere"); <i>Había gente por todas partes</i> ("people were everywhere") — pushing <i>aquí/allí</i> to their logical limits.' },
    { h: 'Fine-grained position', html: '<i>Junto a</i> (right next to, closer than <i>al lado de</i>), <i>en el medio (de)</i> (in the middle), <i>al fondo (de)</i> (at the back/far end), <i>en los alrededores (de)</i> (in the surrounding area) — all still take <i>de</i> before their landmark, following the A1/A2 rule.' },
    { h: 'Céntrico, interior, exterior', html: 'Descriptive adjectives for WHERE something sits within a larger whole: <i>un piso céntrico</i> (centrally located), <i>en el interior/exterior (de)</i>.' }
  ],
  exponents: [
    { es: 'No lo he visto en ninguna parte.', en: "I haven't seen it anywhere.", register: 'neutral' },
    { es: 'Había gente por todas partes.', en: 'There were people everywhere.', register: 'neutral' },
    { es: 'Está junto a la ventana.', en: "It's right next to the window.", register: 'neutral' },
    { es: 'Estamos al fondo del pasillo.', en: "We're at the end of the corridor.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'No lo he visto en ninguna parte.', en: "I haven't seen it anywhere.", note: 'the negative extreme' },
    { es: 'Había gente por todas partes.', en: 'There were people everywhere.', note: 'the positive extreme — same underlying structure' }
  ],
  pitfalls: [
    'Every fine-grained position word here still takes <i>de</i> before its landmark, exactly as at A1/A2 — the rule never relaxes as the vocabulary grows.',
    '<i>Junto a</i> implies closer proximity than <i>al lado de</i> — they are near-synonyms, not identical.'
  ],
  examples: [
    { es: '¿En qué zona vives?', en: 'What area do you live in?' },
    { es: 'El lado izquierdo del edificio está en obras.', en: 'The left side of the building is under construction.' },
    { es: 'La estación está en los alrededores del centro.', en: 'The station is on the outskirts of downtown.' }
  ],
  probes: [
    { id: 'p:localposB1:extremos', kind: 'mcq', q: '"I haven\'t seen it anywhere":',
      options: ['No lo he visto en todas partes.', 'No lo he visto en ninguna parte.', 'No lo he visto en alguna parte.'], answer: 1 },
    { id: 'p:localposB1:de', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['al fondo pasillo', 'al fondo del pasillo', 'al fondo en el pasillo'], answer: 1 },
    { id: 'p:localposB1:cloze', kind: 'cloze', text: 'Está ___ a la ventana. (right next to)', accept: ['junto'] },
    { id: 'p:localposB1:recall', kind: 'recall', front: 'What are the two extremes on the aquí/allí scale?', back: 'en ninguna parte (nowhere) / en todas partes (everywhere)' }
  ]
},

{
  id: 'nt-distancia-movimiento-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:317', 'nociones_generales:B1:319', 'nociones_generales:B1:331', 'nociones_generales:B1:333', 'nociones_generales:B1:336', 'nociones_generales:B1:340'],
  title: 'Distancia y movimiento: acercarse, alejarse, caerse',
  summary: 'Acercarse a and alejarse de are a matched, opposite pair — moving toward or away from a fixed point — and both take a specific, non-interchangeable preposition, a distinction the A1 ir/venir logic doesn\'t fully cover.',
  sections: [
    { h: 'Distancia: estar a + number', html: 'Reprising the A2 pattern: <i>Está a 300 metros</i>, <i>¿A cuánto está Sevilla de Madrid?</i>' },
    { h: 'Acercarse a / alejarse de', html: 'A matched opposite pair, each with its own fixed preposition: <i>acercarse A</i> algo, <i>alejarse DE</i> algo — swapping the prepositions is ungrammatical, not just unusual.' },
    { h: 'The movement-verb toolkit', html: '<i>Moverse/pararse</i> (move/stop), <i>caerse/levantarse</i> (fall/get up), <i>saltar</i> (jump), <i>montar en bicicleta/en moto/a caballo</i> (ride — note the change from <i>en</i> to <i>a</i> for horses), <i>dar una vuelta</i> (go for a stroll/spin).' }
  ],
  exponents: [
    { es: 'El coche se acercaba lentamente a la casa.', en: 'The car was slowly approaching the house.', register: 'neutral', note: 'acercarse A' },
    { es: 'Se alejó de la puerta sin decir nada.', en: 'He moved away from the door without saying anything.', register: 'neutral', note: 'alejarse DE' },
    { es: 'Se cayó de la bicicleta pero no se hizo daño.', en: "He fell off his bike but wasn't hurt.", register: 'neutral' },
    { es: 'Vamos a dar una vuelta por el parque.', en: "Let's go for a stroll through the park.", register: 'coloquial' }
  ],
  contrasts: [
    { es: 'Se acercó a la ventana.', en: 'He approached the window.', note: 'acercarse takes A' },
    { es: 'Se alejó de la ventana.', en: 'He moved away from the window.', note: 'alejarse takes DE — the opposite preposition, not interchangeable' }
  ],
  pitfalls: [
    '<i>Acercarse</i> and <i>alejarse</i> each demand their OWN preposition — <i>*acercarse de</i> and <i>*alejarse a</i> are both wrong.',
    '<i>Montar</i> takes <i>en</i> for wheeled/mechanical transport (<i>en bicicleta, en moto</i>) but <i>a</i> for an animal (<i>a caballo</i>) — a small but real exception.'
  ],
  examples: [
    { es: '¿A cuánto está el aeropuerto del centro?', en: 'How far is the airport from downtown?' },
    { es: 'El barco se acercaba al puerto poco a poco.', en: 'The boat was gradually approaching the port.' },
    { es: 'Hicimos una pausa antes de seguir conduciendo.', en: 'We took a break before continuing to drive.' }
  ],
  probes: [
    { id: 'p:distmov:preposicion', kind: 'mcq', q: '"Se alejó ___ la puerta."',
      options: ['a', 'de', 'en'], answer: 1 },
    { id: 'p:distmov:montar', kind: 'mcq', q: '"Montar ___ caballo" (a diferencia de en bicicleta)',
      options: ['en', 'a', 'con'], answer: 1 },
    { id: 'p:distmov:cloze', kind: 'cloze', text: 'El coche se ___ lentamente a la casa. (was approaching)', accept: ['acercaba'] },
    { id: 'p:distmov:recall', kind: 'recall', front: 'Which preposition does "acercarse" take, and which does "alejarse" take?', back: 'acercarse A, alejarse DE' }
  ]
},

{
  id: 'nt-orientacion-orden-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:371', 'nociones_generales:B1:373', 'nociones_generales:B1:375', 'nociones_generales:B1:391', 'nociones_generales:B1:393', 'nociones_generales:B1:395'],
  title: 'Orientación y orden: seguir por, primero, luego',
  summary: 'Seguir/continuar/subir/bajar all take por before naming the route itself — seguir POR la autopista — while primero, luego, a continuación and finalmente sequence a series of steps in exactly the order they name.',
  sections: [
    { h: 'Naming the route: X por Y', html: '<i>Seguir/continuar/cruzar/subir/bajar</i> + <i>por</i> + the route: <i>Tienen que continuar por la autopista</i>, <i>Hay que bajar por un camino</i>.' },
    { h: 'Ir/conducir por la derecha/izquierda', html: 'Which SIDE you drive or walk on: <i>En este país se conduce por la derecha</i>.' },
    { h: 'Sequencing steps', html: '<i>Primero, luego, a continuación, finalmente/por último</i> order a series of actions; <i>en primer/segundo/último lugar</i> does the identical job in a more formal register.' },
    { h: 'Orden and cola as nouns', html: '<i>Una cola de gente</i> (a queue); <i>(des)ordenado/(des)organizado</i> judge whether things ARE in order; <i>(des)ordenar/(des)organizar</i> are the matching verbs for putting them that way.' }
  ],
  exponents: [
    { es: 'Tienen que continuar por la autopista hasta la salida 12.', en: 'You need to continue on the motorway to exit 12.', register: 'neutral', note: 'continuar POR + route' },
    { es: 'En este país se conduce por la derecha.', en: 'In this country people drive on the right.', register: 'neutral' },
    { es: 'Primero cortamos la cebolla, luego la sofreímos.', en: 'First we chop the onion, then we sauté it.', register: 'neutral' },
    { es: 'Había una cola enorme para entrar.', en: 'There was a huge queue to get in.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Primero, luego, finalmente...', en: 'First, then, finally...', note: 'the everyday sequencing set' },
    { es: 'En primer lugar, en segundo lugar...', en: 'In the first place, in the second place...', note: 'the same job, a more formal register' }
  ],
  pitfalls: [
    'Naming a specific route always needs <i>por</i>: <i>seguir POR la autopista</i>, not <i>*seguir la autopista</i>.',
    'Do not mix the everyday sequencing set (<i>primero, luego</i>) with the formal one (<i>en primer lugar</i>) within the same piece of writing — pick a register and stay consistent.'
  ],
  examples: [
    { es: 'Sube por esa calle y gira a la derecha.', en: 'Go up that street and turn right.' },
    { es: 'A continuación, os explico cómo funciona.', en: "Next, I'll explain how it works." },
    { es: 'Mi escritorio está siempre muy desordenado.', en: 'My desk is always very messy.' }
  ],
  probes: [
    { id: 'p:orientorden:por', kind: 'mcq', q: '"Sube ___ esa calle."',
      options: ['a', 'por', 'en'], answer: 1 },
    { id: 'p:orientorden:secuencia', kind: 'mcq', q: 'Registro más formal para secuenciar:',
      options: ['primero, luego', 'en primer lugar, en segundo lugar', 'y, y'], answer: 1 },
    { id: 'p:orientorden:cloze', kind: 'cloze', text: 'Mi escritorio está muy ___. (messy)', accept: ['desordenado'] },
    { id: 'p:orientorden:recall', kind: 'recall', front: 'What preposition follows seguir/continuar/subir/bajar before naming a route?', back: 'por' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 notion, batch D: the large time cluster (11 syllabus units, merged into
 * 3 lessons — reprising the A1/A2 futuro/presente/pasado merge pattern, and
 * extending the "lifecycle of an action" merge to five stages).
 * ------------------------------------------------------------------------ */
{
  id: 'nt-tiempo-referencias-futuro-pasado-presente-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:414', 'nociones_generales:B1:415', 'nociones_generales:B1:465', 'nociones_generales:B1:466', 'nociones_generales:B1:454', 'nociones_generales:B1:447', 'nociones_generales:B1:448', 'nociones_generales:B1:451'],
  title: 'El tiempo: siglos, décadas y el presente que dura',
  summary: 'Llevar + gerundio states how long a situation has continued right up to now — llevo un año trabajando aquí — a construction with no direct English equivalent, built from a verb that everywhere else just means "to carry."',
  sections: [
    { h: 'Bigger units of time', html: '<i>Segundo, década, siglo</i> extend the A1/A2 calendar vocabulary: <i>Fue en el siglo XX</i>, <i>la década de los cincuenta</i>.' },
    { h: 'Pushing mañana/ayer one step further', html: '<i>Pasado mañana</i> (the day after tomorrow), <i>anteayer</i> (the day before yesterday) — extending <i>mañana/ayer</i> one more day out in either direction.' },
    { h: 'Llevar + gerundio: ongoing duration', html: '<i>Llevo un año trabajando aquí</i> states that a situation started in the past and is STILL true now — genuinely different from <i>Trabajé un año aquí</i>, which is closed and finished.' },
    { h: 'Actualmente, últimamente', html: '<i>Actualmente</i> means "currently/nowadays" — a false friend, NOT "actually." <i>Últimamente</i> means "lately."' }
  ],
  exponents: [
    { es: 'La Edad Media duró varios siglos.', en: 'The Middle Ages lasted several centuries.', register: 'neutral' },
    { es: 'Llevo un año trabajando en esta empresa.', en: "I've been working at this company for a year.", register: 'neutral', note: 'llevar + gerundio — ongoing up to now' },
    { es: 'Actualmente vivo en Barcelona.', en: 'Currently I live in Barcelona.', register: 'neutral', note: 'actualmente = currently, NOT "actually"' },
    { es: 'Últimamente tengo mucho trabajo.', en: "Lately I've had a lot of work.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'Llevo un año trabajando aquí.', en: "I've been working here for a year.", note: 'ongoing — started a year ago and continues now' },
    { es: 'Trabajé un año aquí.', en: 'I worked here for a year.', note: 'closed, finished — no longer true' }
  ],
  pitfalls: [
    '<i>Actualmente</i> is a false friend: it means "currently/nowadays," never "actually" (which is <i>en realidad</i> or <i>de hecho</i>).',
    '<i>Llevar</i> + gerundio needs the DURATION stated directly (<i>llevo un año</i>), not a starting-point construction grafted on top.'
  ],
  examples: [
    { es: 'Pasado mañana empiezan las vacaciones.', en: 'The holidays start the day after tomorrow.' },
    { es: 'Anteayer me encontré con un viejo amigo.', en: "The day before yesterday I ran into an old friend." },
    { es: 'Todavía no he leído ese libro.', en: "I still haven't read that book." }
  ],
  probes: [
    { id: 'p:tiemporef:llevar', kind: 'mcq', q: '"I\'ve been living here for two years":',
      options: ['Vivo aquí desde dos años.', 'Llevo dos años viviendo aquí.', 'Vivo dos años aquí.'], answer: 1 },
    { id: 'p:tiemporef:falsofriend', kind: 'mcq', q: '"Actualmente" significa:',
      options: ['actually', 'currently / nowadays', 'eventually'], answer: 1 },
    { id: 'p:tiemporef:cloze', kind: 'cloze', text: '___ mañana empiezan las vacaciones. (the day after)', accept: ['Pasado', 'pasado'] },
    { id: 'p:tiemporef:recall', kind: 'recall', front: 'llevar + gerundio vs the simple past — which one describes something STILL true now?', back: 'llevar + gerundio' }
  ]
},

{
  id: 'nt-ciclo-accion-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:532', 'nociones_generales:B1:534', 'nociones_generales:B1:548', 'nociones_generales:B1:549', 'nociones_generales:B1:538', 'nociones_generales:B1:541', 'nociones_generales:B1:513', 'nociones_generales:B1:519'],
  title: 'El ciclo de una acción: empezar, seguir, dejar de',
  summary: 'Seguir + gerundio says an action is STILL going; dejar de + infinitive says it has STOPPED — the same event\'s continuation and interruption, described from opposite ends of one single scale running from start to finish.',
  sections: [
    { h: 'Inicio: comenzar, al principio', html: '<i>El curso comenzará el día diez</i>; <i>al principio no me di cuenta</i> — marking the very start.' },
    { h: 'Continuación: seguir/continuar + gerundio', html: '<i>Sigo yendo al gimnasio</i> — the gerund, not the infinitive, after <i>seguir</i> for "still doing something." <i>Todavía</i> and <i>sin parar</i> reinforce continuity.' },
    { h: 'Finalización: dejar de + infinitivo', html: '<i>Dejar de</i> + infinitive means "to stop doing X" — a completely different verb from bare <i>dejar</i> ("to leave/let"): <i>Ha dejado de fumar</i> ("He\'s quit smoking").' },
    { h: 'Posterioridad: X después, al día siguiente', html: '<i>Unos días después</i>, <i>al día siguiente</i>, <i>dos años más tarde</i> — all name a point AFTER a reference event, without pinning it to the calendar.' }
  ],
  exponents: [
    { es: 'El curso comenzará el día diez.', en: 'The course will start on the 10th.', register: 'neutral' },
    { es: 'Sigo yendo al gimnasio tres veces por semana.', en: "I'm still going to the gym three times a week.", register: 'neutral', note: 'seguir + gerundio, not infinitive' },
    { es: 'Ha dejado de fumar por fin.', en: "He's finally quit smoking.", register: 'neutral', note: 'dejar de + infinitivo — to stop doing something' },
    { es: 'Nos vimos de nuevo dos años más tarde.', en: 'We saw each other again two years later.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Sigo yendo al gimnasio.', en: "I'm still going to the gym.", note: 'continuing' },
    { es: 'He dejado de ir al gimnasio.', en: "I've stopped going to the gym.", note: 'the opposite pole — stopped' }
  ],
  pitfalls: [
    '<i>Dejar de</i> + infinitive means "to stop doing X" — do not confuse it with bare <i>dejar</i> ("to leave" or "to let/allow").',
    '<i>Seguir</i> is followed by the GERUND for "still doing," never the infinitive: <i>sigo yendo</i>, not <i>*sigo ir</i>.'
  ],
  examples: [
    { es: 'Al principio me costó mucho adaptarme.', en: 'At first it was very hard for me to adjust.' },
    { es: 'El concierto acabó pasada la medianoche.', en: 'The concert ended past midnight.' },
    { es: 'Nos vimos poco tiempo después de la boda.', en: 'We saw each other shortly after the wedding.' }
  ],
  probes: [
    { id: 'p:ciclo:dejarde', kind: 'mcq', q: '"He\'s quit smoking":',
      options: ['Ha dejado fumar.', 'Ha dejado de fumar.', 'Ha dejado a fumar.'], answer: 1 },
    { id: 'p:ciclo:seguir', kind: 'mcq', q: '"I\'m still studying Spanish":',
      options: ['Sigo estudiar español.', 'Sigo estudiando español.', 'Sigo a estudiar español.'], answer: 1 },
    { id: 'p:ciclo:cloze', kind: 'cloze', text: 'Nos vimos dos años más ___. (later)', accept: ['tarde'] },
    { id: 'p:ciclo:recall', kind: 'recall', front: 'dejar vs dejar de — which one means "to stop doing something"?', back: 'dejar de + infinitivo' }
  ]
},

{
  id: 'nt-puntualidad-retraso-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:524', 'nociones_generales:B1:526', 'nociones_generales:B1:528', 'nociones_generales:B1:530'],
  title: 'Puntualidad y retraso: llegar a tiempo, con retraso',
  summary: 'Retraso describes the SCHEDULE slipping — a train, a flight, a meeting — while tener prisa describes the PERSON\'s own hurry; the two often show up together but state genuinely different facts.',
  sections: [
    { h: 'Puntual, llegar a tiempo', html: '<i>El tren llegó puntual</i>; <i>por suerte pudimos llegar a tiempo</i> — both describe arrival matching the expected time.' },
    { h: 'Retraso: the schedule slips', html: '<i>El avión salió con retraso</i> — <i>retraso</i> is a noun naming the delay itself, always paired with <i>salir/llegar/venir con retraso</i>.' },
    { h: 'Tardar: how long something takes', html: '<i>Has tardado mucho</i> ("you took a long time") states duration, not lateness against a schedule.' },
    { h: 'Tener prisa: the person\'s hurry', html: 'A separate fact from <i>retraso</i> — this is about the PERSON needing to hurry, not the timetable slipping.' }
  ],
  exponents: [
    { es: 'El tren llegó puntual, ni un minuto tarde.', en: 'The train arrived punctually, not a minute late.', register: 'neutral' },
    { es: 'El avión salió con retraso por la niebla.', en: 'The plane left late because of the fog.', register: 'neutral', note: 'retraso — the schedule slipping' },
    { es: 'Has tardado mucho en contestar.', en: 'You took a long time to reply.', register: 'neutral', note: 'tardar — duration, not necessarily lateness' },
    { es: 'Date prisa, que llegamos tarde.', en: "Hurry up, we're going to be late.", register: 'coloquial', note: 'tener/darse prisa — the person\'s own urgency' }
  ],
  contrasts: [
    { es: 'El vuelo salió con retraso.', en: 'The flight left late.', note: 'about the SCHEDULE' },
    { es: 'Tengo mucha prisa.', en: "I'm in a big hurry.", note: 'about the PERSON — a related but different fact' }
  ],
  pitfalls: [
    '<i>Retraso</i> is about a schedule or timetable slipping; <i>tener prisa</i> is about a person\'s own urgency — they often co-occur but are not the same claim.',
    '<i>Tardar</i> states how long something takes, without necessarily implying it was late against any particular schedule.'
  ],
  examples: [
    { es: 'Lamentamos el retraso de este vuelo.', en: 'We apologize for the delay of this flight.' },
    { es: '¿Cuánto se tarda en llegar al centro?', en: 'How long does it take to get downtown?' },
    { es: 'No tengas prisa, todavía hay tiempo.', en: "Don't rush, there's still time." }
  ],
  probes: [
    { id: 'p:puntretraso:sustantivo', kind: 'mcq', q: '"The plane left late":',
      options: ['El avión salió con prisa.', 'El avión salió con retraso.', 'El avión salió puntual.'], answer: 1 },
    { id: 'p:puntretraso:distincion', kind: 'mcq', q: '"Retraso" y "tener prisa" — ¿son lo mismo?',
      options: ['sí, sinónimos exactos', 'no, describen cosas distintas', 'solo en el pasado'], answer: 1 },
    { id: 'p:puntretraso:cloze', kind: 'cloze', text: '¿Cuánto se ___ en llegar? (does it take)', accept: ['tarda'] },
    { id: 'p:puntretraso:recall', kind: 'recall', front: 'Does "retraso" describe the schedule or the person?', back: 'the schedule (tener prisa describes the person)' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 notion, batch E: physical properties and the five senses (11 syllabus
 * units, merged into 3 lessons).
 * ------------------------------------------------------------------------ */
{
  id: 'nt-formas-materia-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:689', 'nociones_generales:B1:691', 'nociones_generales:B1:695', 'nociones_generales:B1:761', 'nociones_generales:B1:763', 'nociones_generales:B1:766'],
  title: 'Formas y materia: círculo, estar hecho de',
  summary: 'Estar hecho de + material states composition directly, one grammatical step further than the A2 ser de pattern, and pairs naturally with the shape vocabulary — círculo, cuadrado, triángulo — needed to describe any object fully.',
  sections: [
    { h: 'Naming shapes', html: '<i>Círculo, cuadrado, rectángulo, triángulo</i> as nouns, with matching adjectives <i>rectangular, triangular</i>. <i>Horizontal, vertical, diagonal</i> describe orientation; <i>plano/recto</i> describe flatness/straightness.' },
    { h: 'Tener forma de, parecer', html: '<i>Tiene forma de estrella</i> ("it\'s star-shaped"); <i>parece una montaña</i> — reprising B1\'s <i>parecer</i> for a visual impression.' },
    { h: 'Estar hecho de: naming the material', html: 'A step beyond A2\'s <i>ser de</i>: <i>Está hecho de acero</i>, <i>está hecho de algodón</i>. <i>Sintético/natural</i> classify the material\'s origin.' }
  ],
  exponents: [
    { es: 'La mesa tiene forma rectangular.', en: 'The table is rectangular.', register: 'neutral' },
    { es: 'Esa nube parece un elefante.', en: 'That cloud looks like an elephant.', register: 'coloquial' },
    { es: 'El anillo está hecho de plata.', en: 'The ring is made of silver.', register: 'neutral', note: 'estar hecho de — parallel to ser de' },
    { es: 'Esta tela es sintética, no natural.', en: 'This fabric is synthetic, not natural.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'La mesa es de madera.', en: 'The table is (made) of wood.', note: 'A2 pattern — ser de' },
    { es: 'La mesa está hecha de madera.', en: 'The table is made of wood.', note: 'B1 — estar hecho de, near-synonymous, slightly more explicit about the making' }
  ],
  pitfalls: [
    '<i>Estar hecho de</i> and <i>ser de</i> are near-synonyms for material — both are correct, and neither takes an article before the material.',
    'Do not confuse <i>plano</i> (flat) with <i>plan</i> (a plan) — related in spelling, unrelated in meaning.'
  ],
  examples: [
    { es: 'Dibujó un triángulo perfecto sin regla.', en: 'She drew a perfect triangle without a ruler.' },
    { es: 'El puente tiene una estructura de acero y hormigón.', en: 'The bridge has a steel and concrete structure.' },
    { es: 'Este jersey está hecho de lana pura.', en: 'This jumper is made of pure wool.' }
  ],
  probes: [
    { id: 'p:formmat:hecho', kind: 'mcq', q: '"The ring is made of silver":',
      options: ['El anillo es hecho de plata.', 'El anillo está hecho de plata.', 'El anillo hace de plata.'], answer: 1 },
    { id: 'p:formmat:forma', kind: 'mcq', q: '"It\'s star-shaped":',
      options: ['Tiene forma de estrella.', 'Es forma estrella.', 'Parece de estrella.'], answer: 0 },
    { id: 'p:formmat:cloze', kind: 'cloze', text: 'Esta tela es ___, no natural. (synthetic)', accept: ['sintética'] },
    { id: 'p:formmat:recall', kind: 'recall', front: '"Estar hecho de" is a B1 parallel to which A2 construction?', back: 'ser de + material' }
  ]
},

{
  id: 'nt-textura-consistencia-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:710', 'nociones_generales:B1:711', 'nociones_generales:B1:713', 'nociones_generales:B1:729', 'nociones_generales:B1:730', 'nociones_generales:B1:746', 'nociones_generales:B1:747'],
  title: 'Textura y consistencia: duro, blando, húmedo',
  summary: 'Húmedo and mojado both mean roughly "wet," but húmedo names a lasting condition (a humid climate) while mojado names a temporary, often accidental state (wet from rain) — the same distinction estar/ser draws elsewhere in the language.',
  sections: [
    { h: 'Consistency opposites', html: '<i>Sólido/líquido</i>, <i>duro/blando</i> (hard/soft), <i>frágil</i> (fragile), <i>flexible</i> — the basic vocabulary for how something responds to pressure or force. <i>Romper(se)</i> is what happens when a fragile thing fails.' },
    { h: 'Texture: how it feels to the touch', html: '<i>Suave</i> (smooth/soft to touch), <i>liso</i> (smooth, unwrinkled), <i>rizado</i> (curly, textured) — <i>tocar</i> is the verb for checking by touch.' },
    { h: 'Húmedo vs mojado', html: '<i>Húmedo</i> describes a lasting condition — <i>un clima húmedo</i>. <i>Mojado</i> describes a temporary, often accidental state — <i>estoy mojado</i> after being caught in the rain. <i>Secar(se)</i> is the process of losing that wetness.' }
  ],
  exponents: [
    { es: 'Esta almohada es muy blanda.', en: 'This pillow is very soft.', register: 'neutral' },
    { es: 'El jarrón es frágil, ten cuidado.', en: 'The vase is fragile, be careful.', register: 'neutral' },
    { es: 'El clima aquí es muy húmedo.', en: "The climate here is very humid.", register: 'neutral', note: 'húmedo — a lasting condition' },
    { es: 'Estoy empapado, salí sin paraguas.', en: "I'm soaked, I went out without an umbrella.", register: 'coloquial', note: 'mojado/empapado — temporary, accidental' }
  ],
  contrasts: [
    { es: 'Vivo en una zona muy húmeda.', en: 'I live in a very humid area.', note: 'húmedo — a lasting climate condition' },
    { es: 'Tengo la ropa mojada.', en: 'My clothes are wet.', note: 'mojado — a temporary, accidental state' }
  ],
  pitfalls: [
    '<i>Húmedo</i> (lasting condition, like a climate) and <i>mojado</i> (temporary, accidental wetness) are not interchangeable, even though both translate as "wet."',
    '<i>Suave</i> can describe texture (soft to touch), taste, sound, or personality — context decides which sense is meant, similar to <i>fuerte</i>.'
  ],
  examples: [
    { es: 'La toalla todavía está húmeda.', en: 'The towel is still damp.' },
    { es: 'Este material es muy resistente y flexible.', en: 'This material is very tough and flexible.' },
    { es: 'Tiene el pelo liso y muy suave.', en: 'She has smooth, very soft hair.' }
  ],
  probes: [
    { id: 'p:textcons:humedomojado', kind: 'mcq', q: '"un clima ___" (lasting condition)',
      options: ['mojado', 'húmedo', 'empapado'], answer: 1 },
    { id: 'p:textcons:fragil', kind: 'mcq', q: '"El jarrón es ___, ten cuidado." (fragile)',
      options: ['duro', 'frágil', 'flexible'], answer: 1 },
    { id: 'p:textcons:cloze', kind: 'cloze', text: 'Esta almohada es muy ___. (soft)', accept: ['blanda'] },
    { id: 'p:textcons:recall', kind: 'recall', front: 'húmedo vs mojado — which one names a temporary, accidental state?', back: 'mojado' }
  ]
},

{
  id: 'nt-sentidos-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:777', 'nociones_generales:B1:780', 'nociones_generales:B1:804', 'nociones_generales:B1:808', 'nociones_generales:B1:825', 'nociones_generales:B1:828', 'nociones_generales:B1:835', 'nociones_generales:B1:845'],
  title: 'Los sentidos: ver, oír, saber a, oler a',
  summary: 'Saber and oler both switch meaning entirely when followed by a: saber a almendra ("to taste of almond") and oler a gas ("to smell of gas") have nothing to do with "to know" or "to smell (an action)" — the preposition changes the verb\'s whole job.',
  sections: [
    { h: 'Visión: ver bien/mal, luminoso', html: '<i>El salón es muy luminoso</i> (bright, full of light); <i>ver bien/mal/nada</i> judges the QUALITY of visibility, not just whether you see something.' },
    { h: 'Audición: oír bien/mal, en voz alta/baja', html: 'The same <i>bien/mal</i> pattern applies to hearing: <i>se oía muy mal</i>. <i>En voz alta</i> (loudly) / <i>en voz baja</i> (quietly) describe HOW something is said.' },
    { h: 'Sabor: saber a + [cosa]', html: '<i>Saber a</i> — a completely different verb use from "to know": <i>Sabe a pescado</i> ("It tastes of fish"). <i>Tener sabor a</i> is the equivalent built from a noun instead.' },
    { h: 'Olor: oler a + [cosa]', html: 'The identical pattern for smell: <i>Huele a gas</i> ("It smells of gas") — irregular present <i>huelo, hueles, huele…</i>.' }
  ],
  exponents: [
    { es: 'El salón es muy luminoso.', en: 'The living room gets a lot of light.', register: 'neutral' },
    { es: 'Se oía muy mal, tuvieron que cancelar el concierto.', en: 'The sound was very bad, they had to cancel the concert.', register: 'neutral' },
    { es: 'Esta salsa sabe a ajo.', en: 'This sauce tastes of garlic.', register: 'neutral', note: 'saber A — nothing to do with "to know"' },
    { es: 'Huele a gas en la cocina.', en: "It smells of gas in the kitchen.", register: 'neutral', note: 'oler A' }
  ],
  contrasts: [
    { es: 'No sé la respuesta.', en: "I don't know the answer.", note: 'saber — "to know," ordinary meaning' },
    { es: 'Sabe a almendra.', en: 'It tastes of almond.', note: 'saber A — an entirely different meaning, taste' }
  ],
  pitfalls: [
    '<i>Saber a</i> and <i>oler a</i> switch these verbs to an entirely different meaning (taste/smell of something) — do not read them as the ordinary "to know" or bare "to smell."',
    '<i>En voz alta</i> means "aloud/loudly"; do not confuse it with <i>alto</i> describing height or price.'
  ],
  examples: [
    { es: 'No se veía nada, estaba todo oscuro.', en: "You couldn't see anything, it was all dark." },
    { es: 'Habla en voz baja, el bebé está durmiendo.', en: 'Speak quietly, the baby is sleeping.' },
    { es: 'Este helado no sabe a nada.', en: "This ice cream doesn't taste of anything." }
  ],
  probes: [
    { id: 'p:sentidosB1:sabera', kind: 'mcq', q: '"It tastes of fish":',
      options: ['Sabe pescado.', 'Sabe a pescado.', 'Sabe de pescado.'], answer: 1 },
    { id: 'p:sentidosB1:olera', kind: 'mcq', q: '"It smells of gas":',
      options: ['Huele gas.', 'Huele a gas.', 'Huele de gas.'], answer: 1 },
    { id: 'p:sentidosB1:cloze', kind: 'cloze', text: 'Habla en voz ___, el bebé duerme. (quietly)', accept: ['baja'] },
    { id: 'p:sentidosB1:recall', kind: 'recall', front: 'What does "a" do to the meaning of saber and oler?', back: 'switches them to "taste/smell OF something" — an unrelated meaning' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 notion, batch F (final): evaluation and cognition cluster (13 syllabus
 * units, merged into 5 lessons). Completes all 61 B1 notion units.
 * ------------------------------------------------------------------------ */
{
  id: 'nt-edad-vejez-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:860', 'nociones_generales:B1:861', 'nociones_generales:B1:862', 'nociones_generales:B1:863'],
  title: 'Edad: cumplir años, aniversario',
  summary: 'Cumplir + [number] + años is how Spanish marks a birthday landmark — cumple treinta años, "she\'s turning thirty" — a specific verb for the event of aging a year, distinct from simply tener + años.',
  sections: [
    { h: 'Cumplir años: the event of turning a year older', html: '<i>Cumple treinta años el sábado</i> — <i>cumplir</i> marks the moment of reaching that age, not just having it.' },
    { h: 'Aniversario', html: 'Marks a yearly recurrence of any event, not only birthdays: <i>su aniversario de boda</i>.' },
    { h: 'Parecer + age category', html: '<i>Parece un adolescente</i> ("he looks like a teenager") reprises B1\'s <i>parecer</i> for an impression, now applied to apparent age.' }
  ],
  exponents: [
    { es: 'Mi hermana cumple veinte años mañana.', en: 'My sister turns twenty tomorrow.', register: 'neutral', note: 'cumplir — the event of turning a year older' },
    { es: 'Celebramos su aniversario de boda.', en: "We celebrated their wedding anniversary.", register: 'neutral' },
    { es: 'Con esa ropa parece un adolescente.', en: 'In those clothes he looks like a teenager.', register: 'coloquial' }
  ],
  contrasts: [
    { es: 'Tiene treinta años.', en: 'She is thirty.', note: 'a static fact — her current age' },
    { es: 'Cumple treinta años el sábado.', en: "She's turning thirty on Saturday.", note: 'the EVENT of reaching that age' }
  ],
  pitfalls: [
    '<i>Cumplir años</i> marks the EVENT of a birthday, not the static fact of an age — do not use it interchangeably with <i>tener</i>.',
    '<i>Aniversario</i> can mark any yearly recurrence, not only birthdays — do not assume it always means "birthday."'
  ],
  examples: [
    { es: '¿Cuántos años cumples este año?', en: 'How old are you turning this year?' },
    { es: 'El próximo mes cumplimos diez años de casados.', en: "Next month we'll have been married ten years." },
    { es: 'Aunque tiene sesenta, parece mucho más joven.', en: "Although she's sixty, she looks much younger." }
  ],
  probes: [
    { id: 'p:edadvejB1:cumplir', kind: 'mcq', q: '"She\'s turning thirty tomorrow":',
      options: ['Tiene treinta años mañana.', 'Cumple treinta años mañana.', 'Es treinta años mañana.'], answer: 1 },
    { id: 'p:edadvejB1:aniversario', kind: 'mcq', q: '"Aniversario" se refiere solo a cumpleaños:',
      options: ['verdadero', 'falso — puede ser cualquier evento anual', 'solo en plural'], answer: 1 },
    { id: 'p:edadvejB1:cloze', kind: 'cloze', text: '¿Cuántos años ___ este año? (are you turning)', accept: ['cumples'] },
    { id: 'p:edadvejB1:recall', kind: 'recall', front: 'cumplir años vs tener años — which marks the EVENT of a birthday?', back: 'cumplir años' }
  ]
},

{
  id: 'nt-evaluacion-valor-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:890', 'nociones_generales:B1:891', 'nociones_generales:B1:893', 'nociones_generales:B1:904', 'nociones_generales:B1:905', 'nociones_generales:B1:907'],
  title: 'Evaluación y precio: parecerle, estar a, rebajas',
  summary: 'Parecerle (a alguien) algo follows the exact gustar pattern — me parece caro, "it seems expensive to me" — making the person who holds the opinion the indirect object, never the grammatical subject.',
  sections: [
    { h: 'Parecerle: the gustar pattern for opinions', html: '<i>Me parece muy divertido</i> — the THING is the subject, the PERSON is the indirect object, exactly like <i>gustar</i>. <i>Encontrar</i> and <i>ver</i> work the same way with a direct object instead: <i>Lo encuentro un poco caro</i>.' },
    { h: 'Rich vocabulary for strong reactions', html: '<i>Un desastre</i>, <i>una maravilla</i>, <i>buenísimo/malísimo</i>, <i>fatal/fenomenal</i> — Spanish reaches for concrete, vivid words rather than piling up "very."' },
    { h: 'Valor, precio: estar a', html: '<i>¿A cuánto están las manzanas?</i> asks a fluctuating price (like fruit or currency); <i>estar de rebajas/en oferta</i> marks something discounted.' }
  ],
  exponents: [
    { es: 'Me parece muy interesante ese museo.', en: 'That museum seems very interesting to me.', register: 'neutral', note: 'parecerle — gustar pattern' },
    { es: 'Lo encuentro un poco caro para lo que es.', en: "I find it a bit expensive for what it is.", register: 'neutral' },
    { es: 'Este trabajo ha sido un desastre.', en: 'This job has been a disaster.', register: 'coloquial' },
    { es: '¿A cuánto están las manzanas hoy?', en: 'How much are apples today?', register: 'neutral', note: 'estar a — fluctuating price' }
  ],
  contrasts: [
    { es: 'Me gusta este museo.', en: 'I like this museum.', note: 'gustar — a straightforward preference' },
    { es: 'Me parece muy interesante este museo.', en: 'This museum seems very interesting to me.', note: 'parecer — an evaluative judgement, same grammatical pattern' }
  ],
  pitfalls: [
    '<i>Parecerle</i> follows the <i>gustar</i> pattern exactly — the person is the indirect object (<i>me, te, le…</i>), never the subject.',
    '<i>Estar a</i> is for FLUCTUATING prices (fruit, currency, stocks); a fixed price uses <i>costar/ser</i> instead.'
  ],
  examples: [
    { es: '¿Qué te parece la propuesta?', en: 'What do you think of the proposal?' },
    { es: 'Estas zapatillas están de oferta esta semana.', en: 'These trainers are on sale this week.' },
    { es: 'Nos parece perfecto el plan.', en: 'The plan seems perfect to us.' }
  ],
  probes: [
    { id: 'p:evalvalB1:parecer', kind: 'mcq', q: '"It seems very expensive to me":',
      options: ['Yo parezco muy caro.', 'Me parece muy caro.', 'Parezco que es caro.'], answer: 1 },
    { id: 'p:evalvalB1:estara', kind: 'mcq', q: '¿Cuándo se usa "estar a" para el precio?',
      options: ['precio fijo', 'precio que fluctúa (fruta, moneda)', 'nunca con precios'], answer: 1 },
    { id: 'p:evalvalB1:cloze', kind: 'cloze', text: '¿Qué te ___ la propuesta? (parecer)', accept: ['parece'] },
    { id: 'p:evalvalB1:recall', kind: 'recall', front: 'In "me parece caro," is "me" the subject or the object?', back: 'the object — the price/thing is the subject, exactly like gustar' }
  ]
},

{
  id: 'nt-conformidad-correccion-precision-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:934', 'nociones_generales:B1:936', 'nociones_generales:B1:940', 'nociones_generales:B1:941', 'nociones_generales:B1:949', 'nociones_generales:B1:951'],
  title: 'Conformidad y corrección: aceptar, error, claro',
  summary: 'Está bien así, gracias closes a transaction politely — it declines further help without rejecting what\'s been offered — while corregir un error and repasar name the two-step process of catching and reviewing a mistake.',
  sections: [
    { h: 'Conformidad: closing politely', html: '<i>Está bien así, gracias</i> and <i>nada más, gracias</i> are fixed ways to say "that\'s enough / that\'s all," declining further help without rejecting what was offered.' },
    { h: 'Corrección: error, corregir, repasar', html: '<i>Corregir un error</i> names the act of fixing a mistake; <i>repasar</i> is the broader check-over that catches errors in the first place.' },
    { h: 'Precisión y claridad', html: '<i>Claro/sencillo/complicado</i> judge how easy something is to follow; <i>(des)orden/(des)organización</i> reprise B1\'s <i>ordenado/organizado</i> pair for how well-structured something is.' }
  ],
  exponents: [
    { es: '—¿Algo más? —No, está bien así, gracias.', en: '—Anything else? —No, that\'s fine, thanks.', register: 'neutral', note: 'closing politely, declining further help' },
    { es: 'Corrigió el error antes de entregar el informe.', en: 'She fixed the mistake before handing in the report.', register: 'neutral' },
    { es: 'La explicación es muy clara.', en: 'The explanation is very clear.', register: 'neutral' },
    { es: 'Su discurso fue bastante complicado de seguir.', en: 'Her speech was fairly complicated to follow.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Está bien así, gracias.', en: "That's fine, thanks.", note: 'declining more, politely' },
    { es: 'Nada más, gracias.', en: "Nothing else, thanks.", note: 'a near-synonym, equally polite' }
  ],
  pitfalls: [
    '<i>Está bien así</i> is a fixed closing phrase — do not analyze it word by word; it functions as a set unit meaning "that\'s enough."',
    '<i>Repasar</i> is broader than <i>corregir</i> — you repasar (review) BEFORE you find something to corregir (fix).'
  ],
  examples: [
    { es: 'Deberías repasar el texto antes de enviarlo.', en: 'You should review the text before sending it.' },
    { es: 'Es un error muy común entre estudiantes.', en: "It's a very common mistake among students." },
    { es: 'Su habitación está siempre muy desorganizada.', en: 'Her room is always very disorganized.' }
  ],
  probes: [
    { id: 'p:confcorrprec:cerrar', kind: 'mcq', q: '"That\'s fine, thanks" (declining further help):',
      options: ['Está bien así, gracias.', 'Está mal, gracias.', 'Está bien, no.'], answer: 0 },
    { id: 'p:confcorrprec:orden', kind: 'mcq', q: '¿Cuál va primero, lógicamente?',
      options: ['corregir, luego repasar', 'repasar, luego corregir', 'da igual el orden'], answer: 1 },
    { id: 'p:confcorrprec:cloze', kind: 'cloze', text: 'La explicación es muy ___. (clear)', accept: ['clara'] },
    { id: 'p:confcorrprec:recall', kind: 'recall', front: 'Which comes first, logically: repasar or corregir?', back: 'repasar (review) — that\'s how you find what to corregir' }
  ]
},

{
  id: 'nt-exito-utilidad-importancia-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:966', 'nociones_generales:B1:969', 'nociones_generales:B1:977', 'nociones_generales:B1:988', 'nociones_generales:B1:1000', 'nociones_generales:B1:1009'],
  title: 'Éxito, utilidad e importancia: servir para, dar igual',
  summary: 'Servir para names what something is FOR; ser bueno en/para names what a PERSON is good at — two structurally similar "for" constructions that describe an object\'s purpose and a person\'s ability respectively.',
  sections: [
    { h: 'Éxito: ganar, perder, conseguir', html: '<i>Ganar/perder</i> a competition; <i>intentar/conseguir</i> mark the attempt and the achievement as two separate steps.' },
    { h: 'Utilidad: servir para, funcionar', html: '<i>¿Para qué sirve esto?</i> asks an object\'s purpose; <i>funcionar</i> asks whether it actually works.' },
    { h: 'Capacidad: ser bueno en/para/con', html: '<i>Es bueno en matemáticas</i>, <i>es un genio para los idiomas</i> — three prepositions (<i>en, para, con</i>) all appear, each fixed to particular contexts.' },
    { h: 'Importancia y normalidad', html: '<i>Me da igual</i> ("I don\'t mind / it\'s all the same to me") follows the <i>gustar</i> pattern; <i>normal/raro/extraño</i> judge how unusual something is.' }
  ],
  exponents: [
    { es: '¿Para qué sirve este botón?', en: 'What is this button for?', register: 'neutral' },
    { es: 'Es muy buena en matemáticas.', en: "She's very good at maths.", register: 'neutral' },
    { es: '¡Me da igual ir al cine o quedarnos en casa!', en: "I don't mind whether we go to the cinema or stay home!", register: 'coloquial', note: 'dar igual — gustar pattern' },
    { es: 'Es bastante raro que llegue tarde, normalmente es puntual.', en: "It's quite unusual for him to be late, he's usually punctual.", register: 'neutral' }
  ],
  contrasts: [
    { es: 'Sirve para abrir botellas.', en: "It's for opening bottles.", note: 'servir para — an object\'s purpose' },
    { es: 'Es bueno para los idiomas.', en: "He's good at languages.", note: 'ser bueno para — a person\'s ability, a different subject entirely' }
  ],
  pitfalls: [
    '<i>Servir para</i> (an object\'s purpose) and <i>ser bueno para</i> (a person\'s ability) share the preposition <i>para</i> but describe completely different kinds of subject.',
    '<i>Dar igual</i> follows the <i>gustar</i> pattern — the person who doesn\'t mind is the indirect object: <i>me da igual</i>, not <i>*yo doy igual</i>.'
  ],
  examples: [
    { es: 'Intentaron ganar el concurso pero no lo consiguieron.', en: 'They tried to win the contest but didn\'t manage it.' },
    { es: 'Esta aplicación no funciona bien en mi teléfono.', en: "This app doesn't work well on my phone." },
    { es: 'No me importa mucho el resultado.', en: "The result doesn't matter much to me." }
  ],
  probes: [
    { id: 'p:exitutilB1:servirpara', kind: 'mcq', q: '"What is this for?":',
      options: ['¿Para qué es esto?', '¿Para qué sirve esto?', 'ambas son correctas'], answer: 2 },
    { id: 'p:exitutilB1:bueno', kind: 'mcq', q: '"She\'s good at maths":',
      options: ['Es buena en matemáticas.', 'Es buena de matemáticas.', 'Es buena por matemáticas.'], answer: 0 },
    { id: 'p:exitutilB1:cloze', kind: 'cloze', text: '¡Me da ___ ir al cine o no! (I don\'t mind)', accept: ['igual'] },
    { id: 'p:exitutilB1:recall', kind: 'recall', front: 'servir para vs ser bueno para — which one describes a PERSON\'s ability?', back: 'ser bueno para/en' }
  ]
},

{
  id: 'nt-reflexion-expresion-b1', strand: 'notion', cefr: 'B1', level: 3, theme: null,
  pcic: ['nociones_generales:B1:1025', 'nociones_generales:B1:1027', 'nociones_generales:B1:1030', 'nociones_generales:B1:1049', 'nociones_generales:B1:1055', 'nociones_generales:B1:1059'],
  title: 'Reflexión y expresión: darse cuenta de, contar un chiste',
  summary: 'Darse cuenta de means "to realize/become aware," and it is reflexive — you cannot simply "cuenta" something the way you might expect from the bare verb contar, which instead means "to tell/count."',
  sections: [
    { h: 'Cognitive verbs', html: '<i>Entender/comprender</i> (to understand) are close synonyms; <i>conocer</i> (A1) contrasts with both — knowing a fact is different from knowing a person or place. <i>Adivinar</i> (to guess correctly), <i>suponer</i> (to assume) fill out the family.' },
    { h: 'Darse cuenta de: realizing', html: 'Reflexive and fixed: <i>Me di cuenta de mi error demasiado tarde</i> — "de" is obligatory before what was realized.' },
    { h: 'Verbal expression: contar, gritar, callado', html: '<i>Contar un chiste/un cuento/una historia</i> — "to tell" a joke, story; <i>gritar</i> (to shout) and <i>callado</i> (quiet, silent) sit at opposite ends of volume.' },
    { h: 'Written/sent communication', html: '<i>Escribir/mandar/enviar un correo</i>; <i>dejar un mensaje/un recado</i> reprise and extend the A2/B1 communication vocabulary.' }
  ],
  exponents: [
    { es: 'No entiendo bien esta explicación.', en: "I don't understand this explanation well.", register: 'neutral' },
    { es: 'Me di cuenta de mi error demasiado tarde.', en: 'I realized my mistake too late.', register: 'neutral', note: 'darse cuenta DE — obligatory preposition' },
    { es: 'Siempre cuenta unos chistes buenísimos.', en: 'He always tells really good jokes.', register: 'coloquial' },
    { es: 'Se quedó callado durante toda la reunión.', en: 'He stayed quiet through the whole meeting.', register: 'neutral' }
  ],
  contrasts: [
    { es: 'Cuento el dinero.', en: 'I count the money.', note: 'contar — "to count"' },
    { es: 'Cuento una historia.', en: 'I tell a story.', note: 'contar — "to tell," an unrelated meaning of the same verb' }
  ],
  pitfalls: [
    '<i>Darse cuenta de</i> is reflexive and always takes <i>de</i> before what was realized — never <i>*dar cuenta</i> alone with this meaning.',
    '<i>Contar</i> means both "to count" and "to tell (a story)" — context decides; do not assume one fixed translation.'
  ],
  examples: [
    { es: '¿Te has dado cuenta de que ya es tarde?', en: 'Have you realized it\'s already late?' },
    { es: 'Supongo que llegará en una hora.', en: "I suppose he'll arrive in an hour." },
    { es: 'Le dejé un recado en el contestador.', en: 'I left him a message on the answering machine.' }
  ],
  probes: [
    { id: 'p:reflexpr:darsecuenta', kind: 'mcq', q: '"I realized my mistake":',
      options: ['Di cuenta mi error.', 'Me di cuenta de mi error.', 'Me di cuenta mi error.'], answer: 1 },
    { id: 'p:reflexpr:contar', kind: 'mcq', q: '"Cuento una historia" significa:',
      options: ['I count a story', 'I tell a story', 'I count on a story'], answer: 1 },
    { id: 'p:reflexpr:cloze', kind: 'cloze', text: 'Le dejé un ___ en el contestador. (message)', accept: ['recado', 'mensaje'] },
    { id: 'p:reflexpr:recall', kind: 'recall', front: 'What preposition does "darse cuenta" always need?', back: 'de' }
  ]
},

/* ============================================================================
 * BATCH — B1 grammar, wave 3 (final): verbal periphrases, impersonal/reflexive
 * se, modal adverbs, relative/interrogative adverb contrast, the
 * algo/alguien/alguno vs nada/nadie/ninguno system, and the article's
 * anaphoric uses. This closes out the highest-value remaining B1 grammar
 * units; only raw tense-conjugation-form units stay deferred, per the
 * rationale given at the top of wave 1.
 * ========================================================================== */
{
  id: 'gr-perifrasis-verbales-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:593', 'gramatica:B1:594', 'gramatica:B1:595', 'gramatica:B1:596'],
  title: 'Perífrasis verbales: soler, volver a, dejar de',
  summary: 'A verbal periphrasis is two verbs acting as ONE — you can never ask "what?" of the first verb the way you can of an ordinary transitive one, which is the test that separates soler + infinitive from an everyday verb + object.',
  sections: [
    { h: 'The test: can you ask "what"?', html: '<i>Tengo que viajar</i> cannot answer <i>¿Qué tengo?</i> — the infinitive is not an object, it is part of a single verbal unit with <i>tener que</i>. Compare <i>Deseo viajar</i>, which genuinely CAN be replaced by <i>Lo deseo</i> — a real object, not a periphrasis.' },
    { h: 'Soler: habitual action', html: '<i>Suelo desayunar temprano</i> — states what you usually do, with no equivalent single verb in English.' },
    { h: 'Volver a: repetition', html: '<i>Volvió a llamar</i> — "he called again," repeating an action from scratch.' },
    { h: 'Dejar de: interruption', html: '<i>Dejó de fumar</i> — "he stopped smoking," reprising the B1 notion lesson\'s same construction from the grammar side.' }
  ],
  contrasts: [
    { es: 'Tengo que viajar por trabajo.', en: 'I have to travel for work.', note: 'periphrasis — cannot ask *¿Qué tengo?' },
    { es: 'Deseo viajar por trabajo.', en: 'I wish to travel for work.', note: 'NOT a periphrasis — "Lo deseo" genuinely works, viajar is a real object here' }
  ],
  pitfalls: [
    'Not every verb + infinitive pair is a periphrasis — the test is whether the first verb keeps its full, independent meaning (not a periphrasis) or has bleached into a pure grammatical marker (a periphrasis).',
    '<i>Soler</i> only really works in the present and imperfect — it sounds odd in most other tenses.'
  ],
  examples: [
    { es: 'Solemos cenar sobre las nueve.', en: 'We usually have dinner around nine.' },
    { es: 'Volví a leer el correo tres veces.', en: 'I read the email again three times.' },
    { es: 'Dejamos de hablar cuando entró el jefe.', en: 'We stopped talking when the boss came in.' }
  ],
  probes: [
    { id: 'p:perifr:test', kind: 'mcq', q: '¿Cuál de estas frases NO es una perífrasis? ("Lo deseo" funciona como sustituto)',
      options: ['Tengo que viajar.', 'Deseo viajar.', 'Suelo viajar.'], answer: 1 },
    { id: 'p:perifr:soler', kind: 'mcq', q: '"We usually have dinner at nine":',
      options: ['Cenamos que a las nueve.', 'Solemos cenar a las nueve.', 'Dejamos cenar a las nueve.'], answer: 1 },
    { id: 'p:perifr:cloze', kind: 'cloze', text: 'Volví a ___ el correo. (leer, repetir la acción)', accept: ['leer'] },
    { id: 'p:perifr:recall', kind: 'recall', front: 'What test tells a periphrasis apart from an ordinary verb + object?', back: 'whether you can ask "¿qué?" of the first verb — if yes, not a periphrasis' }
  ]
},

{
  id: 'gr-ser-impersonal-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:598', 'gramatica:B1:599', 'gramatica:B1:601', 'gramatica:B1:607'],
  title: 'Ser impersonal: es de noche, es una pena que',
  summary: 'Ser builds a whole family of subjectless time and value expressions — es de noche, es tarde — and when the value judgment takes a full clause, that clause switches to the subjunctive, exactly as the presente de subjuntivo lesson predicts.',
  sections: [
    { h: 'Time with no subject at all', html: '<i>Es de noche</i>, <i>Es tarde</i> — <i>ser</i> here has no grammatical subject naming anything; the expression simply states a fact about the time of day.' },
    { h: 'Value judgment + que + subjuntivo', html: '<i>Es una pena que no vengan a la fiesta</i> — the impersonal value judgment forces the subjunctive in its complement clause, the same rule from the core subjunctive lesson, now shown with <i>ser</i> specifically.' },
    { h: 'Profession and fluctuating price, with de/a', html: '<i>Trabaja de camarero</i> (an eventual, not permanent, profession) and <i>está a dos euros</i> (a fluctuating price) both modify the plain <i>ser/estar</i> pattern with a preposition.' }
  ],
  contrasts: [
    { es: 'Es una pena que no vengan.', en: "It's a shame they're not coming.", note: 'value judgment — subjunctive, same rule as always' },
    { es: 'Es verdad que no vienen.', en: "It's true they're not coming.", note: 'certainty — indicative instead' }
  ],
  pitfalls: [
    'Impersonal <i>ser</i> expressions of time (<i>es tarde, es de noche</i>) have no subject to look for — do not hunt for one.',
    'A value-judgment <i>ser</i> expression (<i>es una pena, es normal, es lógico</i>) + <i>que</i> ALWAYS triggers the subjunctive, regardless of how certain the underlying fact is.'
  ],
  examples: [
    { es: 'Ya es de noche, deberíamos volver.', en: "It's already dark out, we should head back." },
    { es: 'Es normal que estés cansado después de un viaje así.', en: "It's normal to be tired after a trip like that." },
    { es: 'De joven trabajó de camarero varios veranos.', en: 'As a young man he worked as a waiter for several summers.' }
  ],
  probes: [
    { id: 'p:serimperB1:modo', kind: 'mcq', q: '"Es una pena que no ___." (venir, ellos)',
      options: ['vienen', 'vengan', 'vendrán'], answer: 1 },
    { id: 'p:serimperB1:sujeto', kind: 'mcq', q: '"Es tarde" — ¿cuál es el sujeto gramatical?',
      options: ['tarde', 'ninguno — es impersonal', 'yo'], answer: 1 },
    { id: 'p:serimperB1:cloze', kind: 'cloze', text: 'Trabaja ___ camarero los veranos. (as, eventual profession)', accept: ['de'] },
    { id: 'p:serimperB1:recall', kind: 'recall', front: 'Does an impersonal value-judgment "es + adjetivo + que" trigger subjunctive or indicative?', back: 'subjunctive' }
  ]
},

{
  id: 'gr-se-multiuso-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:650', 'gramatica:B1:651', 'gramatica:B1:203', 'gramatica:B1:205', 'gramatica:B1:206'],
  title: 'Se: recíproco, impersonal, meteorológico',
  summary: 'The same little word se marks two people doing something TO EACH OTHER (se quieren), and also erases the subject entirely so nobody in particular is doing anything (en este restaurante se come bien) — two structurally different jobs behind one spelling.',
  sections: [
    { h: 'Se recíproco: each other', html: '<i>Se quieren mucho</i> — "they love each other." It admits the reinforcement <i>el uno al otro</i> for extra clarity: <i>Se ayudan el uno al otro</i>.' },
    { h: 'Se impersonal / pasiva refleja: nobody in particular', html: '<i>En este restaurante se come muy bien</i> — no one specific is named as the eater; the sentence reports a general fact about the restaurant. The verb agrees with a following noun if there is one: <i>Se venden pisos</i> (plural verb, plural subject).' },
    { h: 'Meteorológicos: no subject to look for at all', html: '<i>Llueve</i>, <i>Nieva</i> — these verbs are grammatically subjectless; there is no "it" hiding anywhere, unlike English.' }
  ],
  contrasts: [
    { es: 'Se quieren mucho.', en: 'They love each other.', note: 'recíproco — TWO people, acting on each other' },
    { es: 'En este restaurante se come muy bien.', en: 'You eat very well at this restaurant.', note: 'impersonal — NO ONE in particular named' }
  ],
  pitfalls: [
    'Se impersonal/pasiva refleja and se recíproco look identical but do completely different jobs — check whether there are two people acting on each other, or no one named at all.',
    'Weather verbs (<i>llover, nevar</i>) never take a subject pronoun, not even <i>ello</i> — Spanish has no equivalent of English\'s empty "it."'
  ],
  examples: [
    { es: 'Se escriben todas las semanas.', en: 'They write to each other every week.' },
    { es: 'Aquí se habla español e inglés.', en: 'Spanish and English are spoken here.' },
    { es: 'Está nevando desde esta mañana.', en: "It's been snowing since this morning." }
  ],
  probes: [
    { id: 'p:semultiB1:tipo', kind: 'mcq', q: '"Se quieren mucho" — ¿qué tipo de "se" es?',
      options: ['impersonal', 'recíproco', 'reflexivo'], answer: 1 },
    { id: 'p:semultiB1:impersonal', kind: 'mcq', q: '"En este restaurante se come bien" — ¿quién come?',
      options: ['el restaurante', 'nadie en concreto', 'el camarero'], answer: 1 },
    { id: 'p:semultiB1:cloze', kind: 'cloze', text: 'Aquí se ___ español. (is spoken)', accept: ['habla'] },
    { id: 'p:semultiB1:recall', kind: 'recall', front: 'Does a weather verb like "llover" ever take a subject pronoun in Spanish?', back: 'no — it is grammatically subjectless' }
  ]
},

{
  id: 'gr-modalidad-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:348', 'gramatica:B1:349', 'gramatica:B1:350', 'gramatica:B1:351'],
  title: 'Modalidad: posiblemente, seguramente, probablemente',
  summary: 'These adverbs of doubt sit on a scale from near-certainty to genuine uncertainty, and — like a lo mejor — several of them can take EITHER mood depending on how confident the speaker actually feels, not a fixed grammatical rule.',
  sections: [
    { h: 'A scale of doubt', html: '<i>Seguramente</i> (fairly confident) → <i>probablemente</i> → <i>posiblemente</i> (least confident) — all roughly equivalent to <i>es probable que…</i>' },
    { h: 'Mood follows confidence, not a fixed rule', html: 'Unlike <i>dudo que</i> (always subjunctive) or <i>a lo mejor</i> (always indicative), these adverbs can take either mood: <i>Seguramente no está</i> (indicative — fairly sure) or <i>Seguramente no esté</i> (subjunctive — less sure). The choice itself communicates the speaker\'s confidence.' },
    { h: 'Standalone, answering a question', html: 'These adverbs can also stand alone as a complete, hedged answer: <i>—¿Vendrá? —Posiblemente.</i>' }
  ],
  contrasts: [
    { es: 'Seguramente no está en casa.', en: "He's probably not home.", note: 'indicative — fairly confident' },
    { es: 'Seguramente no esté en casa.', en: "He's probably not home.", note: 'subjunctive — the same adverb, slightly less confident' }
  ],
  pitfalls: [
    'Unlike most doubt expressions, these adverbs let the SPEAKER choose the mood to signal how confident they feel — there is no single fixed rule to memorize here.',
    'Do not confuse this flexible group with <i>a lo mejor</i> (always indicative) or <i>dudo que</i> (always subjunctive), which have no such freedom.'
  ],
  examples: [
    { es: 'Posiblemente lleguemos un poco tarde.', en: 'We might arrive a bit late.' },
    { es: '—¿Crees que aprobará? —Probablemente.', en: '—Do you think she\'ll pass? —Probably.' },
    { es: 'Seguramente ya lo sepa.', en: 'He probably already knows.' }
  ],
  probes: [
    { id: 'p:modalB1:escala', kind: 'mcq', q: 'Adverbio con MÁS confianza:',
      options: ['posiblemente', 'seguramente', 'quizá'], answer: 1 },
    { id: 'p:modalB1:libertad', kind: 'mcq', q: '¿Puede "probablemente" ir con indicativo Y subjuntivo?',
      options: ['sí, según la confianza del hablante', 'no, siempre subjuntivo', 'no, siempre indicativo'], answer: 0 },
    { id: 'p:modalB1:cloze', kind: 'cloze', text: '—¿Vendrá? —___. (possibly, standalone)', accept: ['Posiblemente', 'posiblemente'] },
    { id: 'p:modalB1:recall', kind: 'recall', front: 'What does the choice of mood (indicative vs subjunctive) signal after these adverbs?', back: "the speaker's degree of confidence" }
  ]
},

{
  id: 'gr-adverbios-relativos-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:370', 'gramatica:B1:371', 'gramatica:B1:373', 'gramatica:B1:374'],
  title: 'Como, cuando, donde: relativos vs interrogativos',
  summary: 'The exact same three words — como, cuando, donde — serve as unaccented relative connectors inside a statement and as accented question/exclamation words: the accent alone signals which job they are doing.',
  sections: [
    { h: 'Unaccented: relative connectors', html: 'As relatives, these words connect a clause to an antecedent, with NO written accent: <i>Lo he hecho como dijiste</i>, <i>Me fui cuando llegaron</i>.' },
    { h: 'Accented: questions and exclamations', html: 'The identical words, now stressed and accented, open a question or exclamation: <i>¿Cómo lo hiciste?</i>, <i>¿Cuándo llegaron?</i>, <i>¡Cómo llueve!</i>' },
    { h: 'Adónde: only for movement', html: '<i>Adónde</i> (as one word) is reserved for verbs of movement asking a destination: <i>¿Adónde vas?</i> — <i>dónde</i> alone covers static location.' }
  ],
  contrasts: [
    { es: 'Lo he hecho como dijiste.', en: 'I did it the way you said.', note: 'relative — no accent' },
    { es: '¿Cómo lo hiciste?', en: 'How did you do it?', note: 'interrogative — accented, a different word in writing' }
  ],
  pitfalls: [
    'The accent is not decorative — it is the ONLY thing distinguishing a relative <i>como/cuando/donde</i> from an interrogative or exclamative one in writing.',
    '<i>Adónde</i> only works with movement verbs; a static location question uses plain <i>dónde</i>, never <i>adónde</i>.'
  ],
  examples: [
    { es: 'Vive donde vivía su abuela.', en: 'He lives where his grandmother used to live.' },
    { es: '¿Dónde has dejado las llaves?', en: 'Where have you left the keys?' },
    { es: '¿Adónde va este autobús?', en: 'Where does this bus go?' }
  ],
  probes: [
    { id: 'p:advrelB1:acento', kind: 'mcq', q: '"Lo hice ___ dijiste." (relativo, sin acento)',
      options: ['cómo', 'como', 'komo'], answer: 1 },
    { id: 'p:advrelB1:interrog', kind: 'mcq', q: '"How did you do it?" (interrogativo)',
      options: ['¿Como lo hiciste?', '¿Cómo lo hiciste?', '¿Coma lo hiciste?'], answer: 1 },
    { id: 'p:advrelB1:cloze', kind: 'cloze', text: '¿___ va este autobús? (where to, movement)', accept: ['Adónde', 'adónde'] },
    { id: 'p:advrelB1:recall', kind: 'recall', front: 'What is the ONLY written difference between relative and interrogative como/cuando/donde?', back: 'the accent mark' }
  ]
},

{
  id: 'gr-indefinidos-negativos-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:140', 'gramatica:B1:143', 'gramatica:B1:145', 'gramatica:B1:136'],
  title: 'Algo, alguien, alguno — nada, nadie, ninguno',
  summary: 'Alguien/nadie only ever refer to a PERSON with no gender variation, while alguno/ninguno agree in gender and specifically pick one member OUT of an already-known group — three grammatically different tools for three different jobs.',
  sections: [
    { h: 'Algo / nada: things, invariable', html: 'Never change form: <i>¿Quieres algo?</i>, <i>No quiero nada</i>.' },
    { h: 'Alguien / nadie: people, invariable', html: 'Also never change form, but refer only to a person: <i>¿Hay alguien ahí?</i>, <i>No hay nadie</i>.' },
    { h: 'Alguno / ninguno: picking from a known group', html: 'These DO agree in gender/number, and specifically select from a group already established in the conversation: <i>—¿Tienes hermanos? —Sí, tengo alguno</i> (picking from the category "brothers," second mention) vs a first mention of a person, which uses <i>alguien</i> instead.' },
    { h: 'Cada: distributive, invariable', html: '<i>Cada uno por su camino</i>, <i>reparte una hoja a cada alumno</i> — considers the members of a group one by one, and never changes form.' }
  ],
  contrasts: [
    { es: '¿Conoces a alguien aquí?', en: 'Do you know anyone here?', note: 'alguien — a person, first mention, no group established yet' },
    { es: '¿Conoces a alguno de mis amigos?', en: 'Do you know any of my friends?', note: 'alguno — selecting from an already-named group ("mis amigos")' }
  ],
  pitfalls: [
    '<i>Alguien/nadie</i> never change form; <i>alguno/ninguno</i> always agree in gender and number — do not mix the two systems.',
    '<i>Alguno</i> shortens to <i>algún</i> before a masculine singular noun (<i>algún día</i>), the same apocope pattern as <i>uno→un</i> and <i>primero→primer</i>.'
  ],
  examples: [
    { es: 'No he visto a nadie en todo el día.', en: "I haven't seen anyone all day." },
    { es: '¿Tienes algún libro sobre este tema?', en: 'Do you have any book on this topic?' },
    { es: 'Cada estudiante recibió su propio horario.', en: 'Each student received their own schedule.' }
  ],
  probes: [
    { id: 'p:indefnegB1:invariable', kind: 'mcq', q: '¿Cuál NUNCA cambia de forma?',
      options: ['alguno', 'ninguno', 'nadie'], answer: 2 },
    { id: 'p:indefnegB1:apocope', kind: 'mcq', q: '"¿Tienes ___ libro sobre esto?" (algún, apocopado)',
      options: ['alguno', 'algún', 'alguna'], answer: 1 },
    { id: 'p:indefnegB1:cloze', kind: 'cloze', text: '___ estudiante recibió su horario. (each)', accept: ['Cada', 'cada'] },
    { id: 'p:indefnegB1:recall', kind: 'recall', front: 'Which pair agrees in gender/number, and which stays invariable — alguno/ninguno or alguien/nadie?', back: 'alguno/ninguno agree; alguien/nadie are invariable' }
  ]
},

{
  id: 'gr-articulo-anaforico-escuetos-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:57', 'gramatica:B1:58', 'gramatica:B1:96', 'gramatica:B1:97'],
  title: 'El artículo anafórico y los nombres escuetos',
  summary: 'The definite article can point back to something only ASSOCIATED with what was already mentioned, not literally named before — mention a trip and el barco ("the boat") can appear with the article, even though no boat was named yet.',
  sections: [
    { h: 'Anaphoric: pointing back to what was named', html: '<i>Cogió un libro y miró el índice</i> — <i>el índice</i> is definite because every book has one; the article points back to a PART of what was just introduced.' },
    { h: 'Associative: pointing back to what is implied', html: '<i>Viajaremos a Marruecos. El viaje será en barco</i> — <i>el viaje</i> was never named as a noun before, but it is clearly implied by "viajaremos."' },
    { h: 'Nombres escuetos: syntactic limits', html: 'A bare noun (no article, no quantifier) cannot normally stand as the PREVERBAL subject: <i>*Niños juegan en el patio</i> is odd; Spanish prefers <i>En el patio juegan niños</i>, with the bare noun AFTER the verb instead.' }
  ],
  contrasts: [
    { es: 'Cogió un libro y miró el índice.', en: 'She picked up a book and looked at the index.', note: 'anaphoric — el índice, a part of what was just named' },
    { es: 'Viajaremos a Marruecos. El viaje será largo.', en: "We'll travel to Morocco. The trip will be long.", note: 'associative — el viaje was implied, not literally named yet' }
  ],
  pitfalls: [
    'A bare noun (no article/quantifier) resists standing as the subject BEFORE its verb — move the verb first instead: <i>Llegó gente</i>, not <i>*Gente llegó</i>.',
    'The associative article requires only that the referent be inferable from what was said, not literally pre-named — this is subtler than the ordinary "second mention" rule.'
  ],
  examples: [
    { es: 'Compramos una casa; el jardín es enorme.', en: 'We bought a house; the garden is huge.' },
    { es: 'Fuimos a un restaurante muy caro. El camarero fue encantador.', en: 'We went to a very expensive restaurant. The waiter was lovely.' },
    { es: 'En la reunión surgieron problemas inesperados.', en: 'Unexpected problems came up at the meeting.' }
  ],
  probes: [
    { id: 'p:artanaf:asociativo', kind: 'mcq', q: '"Viajaremos a Marruecos. ___ viaje será en barco." — ¿por qué "el"?',
      options: ['segunda mención literal', 'asociado a "viajaremos", aunque no se nombró antes', 'es genérico'], answer: 1 },
    { id: 'p:artanaf:escueto', kind: 'mcq', q: 'Más natural:',
      options: ['Niños juegan en el patio.', 'En el patio juegan niños.', 'Los niños juegan niños.'], answer: 1 },
    { id: 'p:artanaf:cloze', kind: 'cloze', text: 'Compramos una casa; ___ jardín es enorme.', accept: ['el'] },
    { id: 'p:artanaf:recall', kind: 'recall', front: 'Can a bare noun with no determiner stand as a PREVERBAL subject?', back: 'not comfortably — Spanish prefers verb-first order instead' }
  ]
},

/* ---------------------------------------------------------------------------
 * B1 grammar, wave 4 (final for this level): pluscuamperfecto — a genuinely
 * new tense concept, not a form-drill refinement — plus the dative possessive
 * and elative/adverb modifiers. This closes out B1 grammar's highest-value
 * remaining units.
 * ------------------------------------------------------------------------ */
{
  id: 'gr-pluscuamperfecto-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:432', 'gramatica:B1:433', 'gramatica:B1:434', 'gramatica:B1:435'],
  title: 'Pretérito pluscuamperfecto: había hablado',
  summary: 'The pluscuamperfecto marks a past event that had already finished BEFORE another past event — cuando llegamos, ya se había ido — Spanish\'s equivalent of English\'s "had done," and it never stands alone without that second past reference point.',
  sections: [
    { h: 'Form: haber (imperfecto) + participio', html: '<i>Había/habías/había/habíamos/habíais/habían</i> + participle: <i>había hablado, había comido, había vivido</i>. It reuses whatever irregular participles you already know: <i>había hecho, había dicho, había escrito, había vuelto</i>.' },
    { h: 'Meaning: anteriority to another past point', html: 'It always relates TWO past events, placing one before the other: <i>Cuando llegamos, ya se había ido</i> — the leaving happened before the arriving, both in the past.' },
    { h: 'It never stands alone', html: 'Unlike the simple past tenses, pluscuamperfecto needs a second past-tense anchor, explicit or clearly implied — it does not simply mean "a long time ago" by itself.' }
  ],
  contrasts: [
    { es: 'Cuando llegamos, ya se había ido.', en: 'When we arrived, he had already left.', note: 'pluscuamperfecto — he left BEFORE we arrived' },
    { es: 'Cuando llegamos, se fue.', en: 'When we arrived, he left.', note: 'indefinido — he left AT that moment, not before it' }
  ],
  pitfalls: [
    'Pluscuamperfecto always needs a second past-tense reference point — it cannot be used to simply mean "a long time ago" on its own.',
    'Do not confuse it with <i>hace mucho tiempo</i>, which expresses distance from NOW, not anteriority to another past event.'
  ],
  examples: [
    { es: 'Ya habíamos cenado cuando llamó.', en: 'We had already had dinner when he called.' },
    { es: 'Nunca había visto un lugar tan bonito.', en: "I'd never seen such a beautiful place." },
    { es: 'Se dio cuenta de que había cometido un error.', en: 'He realized he had made a mistake.' }
  ],
  probes: [
    { id: 'p:pluscuamB1:orden', kind: 'mcq', q: '"Cuando llegamos, ya se había ido" — ¿qué pasó primero?',
      options: ['llegamos', 'se había ido', 'pasaron a la vez'], answer: 1 },
    { id: 'p:pluscuamB1:forma', kind: 'mcq', q: 'Pluscuamperfecto de "hacer", 1.ª persona singular:',
      options: ['he hecho', 'había hecho', 'habría hecho'], answer: 1 },
    { id: 'p:pluscuamB1:cloze', kind: 'cloze', text: 'Nunca ___ visto un lugar tan bonito. (había)', accept: ['había'] },
    { id: 'p:pluscuamB1:recall', kind: 'recall', front: 'Can pluscuamperfecto stand alone without a second past reference point?', back: 'no — it always relates to another past event' }
  ]
},

{
  id: 'gr-posesivo-dativo-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:116', 'gramatica:B1:117', 'gramatica:B1:119'],
  title: 'El dativo posesivo: le cortaron el pelo',
  summary: 'With inalienable possession — body parts, close belongings someone else is handling — Spanish routinely swaps a possessive adjective for an indirect-object pronoun: le cortaron el pelo, never cortaron su pelo, because the "owner" is grammatically the person AFFECTED by the action.',
  sections: [
    { h: 'The substitution', html: '<i>Le cortaron el pelo al cero</i> — never <i>*Cortaron su pelo al cero</i>. The bare article (<i>el pelo</i>) plus a dative pronoun (<i>le</i>) replaces what a possessive would do in English.' },
    { h: 'Generalizing the A2 rule', html: 'This extends A2\'s <i>me duele la cabeza</i> pattern to any verb where someone acts on another person\'s body or belongings: <i>¿Te hago la cama?</i>, <i>Me han reparado el coche</i>.' },
    { h: 'When the tonic possessive survives: contrast', html: 'A possessive still appears in its full, tonic form specifically for CONTRAST: <i>Este cuadro no es el tuyo, es el mío</i> — distinguishing one owner from another, a different job than inalienable possession.' }
  ],
  contrasts: [
    { es: 'Le cortaron el pelo al cero.', en: 'They shaved his head.', note: 'correct — dative pronoun + bare article' },
    { es: '*Cortaron su pelo al cero.', en: '(sounds foreign)', note: 'a possessive here reads as a direct, unnatural translation from English' }
  ],
  pitfalls: [
    'Whenever someone else acts ON a body part or closely-held possession, reach for the dative pronoun (<i>me/te/le/nos/os/les</i>) + bare article — not a possessive adjective.',
    'The tonic possessive (<i>el mío, el tuyo</i>) survives specifically for CONTRAST between owners — a different function from the inalienable-possession rule.'
  ],
  examples: [
    { es: '¿Te reviso el motor mientras esperas?', en: 'Shall I check your engine while you wait?' },
    { es: 'Le rompieron el brazo jugando al rugby.', en: 'They broke his arm playing rugby.' },
    { es: 'Ese abrigo no es el mío, es el suyo.', en: "That coat isn't mine, it's hers." }
  ],
  probes: [
    { id: 'p:posdatB1:sustitucion', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['Cortaron su pelo al cero.', 'Le cortaron el pelo al cero.', 'Cortaron el su pelo al cero.'], answer: 1 },
    { id: 'p:posdatB1:contraste', kind: 'mcq', q: '"Ese abrigo no es el mío, es ___." (contraste — hers)',
      options: ['su', 'el suyo', 'suyo'], answer: 1 },
    { id: 'p:posdatB1:cloze', kind: 'cloze', text: '¿___ reviso el motor? (shall I [check] your...)', accept: ['te', 'Te'] },
    { id: 'p:posdatB1:recall', kind: 'recall', front: 'With inalienable possession, what replaces the possessive adjective?', back: 'a dative pronoun (me/te/le...) + the bare article' }
  ]
},

{
  id: 'gr-modificadores-adverbios-b1', strand: 'grammar', cefr: 'B1', level: 3, theme: null,
  pcic: ['gramatica:B1:583', 'gramatica:B1:584', 'gramatica:B1:585', 'gramatica:B1:586'],
  title: 'Modificadores: el doble de, -mente, elativos',
  summary: 'An elative adjective like enorme or gigantesco already sits at the top of its own scale — piling muy in front of it (*muy enorme) is exactly as redundant as English "very gigantic," since the word has nowhere higher left to climb.',
  sections: [
    { h: 'Multiplicativos', html: '<i>El doble de, el triple de</i> reprise B1\'s proportion vocabulary: <i>Cuesta el doble de lo que pensaba</i>.' },
    { h: 'Elativos: incompatible with muy', html: '<i>Enorme, gigantesco, precioso, magnífico</i> already carry a built-in superlative force — <i>*muy enorme</i> is redundant, exactly like the <i>-ísimo</i> forms cannot combine with <i>muy</i> either.' },
    { h: '-mente adverbs', html: 'Built from the FEMININE form of the adjective + <i>-mente</i>: <i>rápida → rápidamente</i>, <i>cuidadosa → cuidadosamente</i>. When two <i>-mente</i> adverbs are coordinated, only the LAST one keeps the suffix: <i>Habló clara y directamente</i>, not <i>*claramente y directamente</i>.' }
  ],
  contrasts: [
    { es: 'Es un lugar enorme.', en: "It's an enormous place.", note: 'correct — enorme already at the top of its scale' },
    { es: '*Es un lugar muy enorme.', en: '(redundant)', note: 'muy adds nothing an elative adjective doesn\'t already have' }
  ],
  pitfalls: [
    'Never combine <i>muy</i> with an elative adjective (<i>enorme, gigantesco, precioso, magnífico</i>) — the redundancy is the same as English "very gigantic."',
    'When coordinating two <i>-mente</i> adverbs, drop the suffix from all but the last one: <i>clara y directamente</i>, never <i>*claramente y directamente</i>.'
  ],
  examples: [
    { es: 'El nuevo modelo cuesta el doble de caro.', en: 'The new model costs twice as much.' },
    { es: 'Nos explicó todo lenta y claramente.', en: 'He explained everything slowly and clearly.' },
    { es: 'Fue una experiencia realmente increíble.', en: 'It was a truly incredible experience.' }
  ],
  probes: [
    { id: 'p:modifadv:elativo', kind: 'mcq', q: '¿Cuál es correcto?',
      options: ['muy enorme', 'enorme', 'muy muy enorme'], answer: 1 },
    { id: 'p:modifadv:coordinar', kind: 'mcq', q: '"Slowly and clearly" (coordinando dos -mente):',
      options: ['lentamente y claramente', 'lenta y claramente', 'lento y claramente'], answer: 1 },
    { id: 'p:modifadv:cloze', kind: 'cloze', text: 'rápida → rápida___. (-mente adverb)', accept: ['mente'] },
    { id: 'p:modifadv:recall', kind: 'recall', front: 'When coordinating two -mente adverbs, which one keeps the suffix?', back: 'only the last one' }
  ]
}

];
