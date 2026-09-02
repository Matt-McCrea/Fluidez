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
}

];
