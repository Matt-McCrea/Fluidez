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
}

];
