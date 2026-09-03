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
    { h: 'Plain vs softened', html: '<i>¿Quieres...?</i> asks plainly. <i>¿Te gustaría...?</i>, built on the conditional, reads as more of an invitation than a demand for an answer right now.' }
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
    { h: 'Reaction vs state', html: '<i>¡Muy bien!</i> and <i>¡Qué bien!</i> react to something just said; <i>Estoy contento</i> describes how you generally feel right now, independent of any specific news.' }
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
    { h: 'A date vs an achievement', html: '<i>Felicidades</i> marks an occasion on the calendar (a birthday, a holiday); <i>Enhorabuena</i> marks something someone achieved (passing an exam, a promotion, a new baby).' }
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
    { h: 'Negative-only expressions', html: '<i>*Juan ha llegado todavía</i> and <i>*Ha venido por aquí en toda la semana</i> are simply ungrammatical — these expressions require a negative verb, unlike English "still" or "all week", which work in either polarity.' }
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
}

];
