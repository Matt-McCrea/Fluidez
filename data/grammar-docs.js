/* ============================================================================
 * GRAMMAR DOCS — one entry per tense.  `key` matches ENGINE.TENSES so the
 * grammar view can auto-render a model conjugation (hablar / comer / vivir)
 * beneath the authored notes.
 *   summary    : one-line gloss
 *   formation  : how the tense is built
 *   when       : bullet list of when to use it
 *   irregulars : notes on the main irregular patterns
 *   examples   : [{es,en}] sample sentences
 * ========================================================================== */
window.GRAMMAR = [
{
  key:'presente', title:'Presente (Present)',
  summary:'Actions happening now, habitual actions, and general truths.',
  formation:'Drop the -ar/-er/-ir ending and add the present endings to the stem.',
  when:[
    'Something happening right now: <i>Como una manzana.</i> — I am eating an apple.',
    'Habitual / repeated actions: <i>Trabajo todos los días.</i> — I work every day.',
    'General facts and truths: <i>El agua hierve a 100 grados.</i>',
    'Near-future plans (with a time marker): <i>Mañana viajo a México.</i>'
  ],
  irregulars:[
    'Stem changers (e→ie, o→ue, e→i) change in all forms except nosotros/vosotros: <i>pensar → pienso</i>, <i>dormir → duermo</i>, <i>pedir → pido</i>.',
    'Irregular "yo": <i>tener → tengo</i>, <i>hacer → hago</i>, <i>conocer → conozco</i>, <i>salir → salgo</i>.',
    'Fully irregular: <i>ser, estar, ir, haber</i>.'
  ],
  examples:[
    {es:'Hablo español todos los días.', en:'I speak Spanish every day.'},
    {es:'¿Dónde vives?', en:'Where do you live?'},
    {es:'No entiendo la pregunta.', en:"I don't understand the question."}
  ]
},
{
  key:'preterito', title:'Pretérito (Preterite)',
  summary:'Completed actions in the past with a defined beginning/end.',
  formation:'Add the preterite endings to the stem. -er and -ir verbs share one set of endings.',
  when:[
    'A single completed action: <i>Ayer comí paella.</i> — Yesterday I ate paella.',
    'A sequence of completed events: <i>Llegué, comí y me fui.</i>',
    'An action with a clear time boundary: <i>Viví dos años en Madrid.</i>'
  ],
  irregulars:[
    'Strong preterites (irregular stem + special endings, no accents): <i>tener → tuve</i>, <i>hacer → hice/hizo</i>, <i>poder → pude</i>, <i>decir → dije</i>, <i>estar → estuve</i>.',
    '-ir stem changers change e→i / o→u in él and ellos: <i>pedir → pidió</i>, <i>dormir → durmió</i>.',
    'Spelling: -car→qué, -gar→gué, -zar→cé in the yo form: <i>buscar → busqué</i>, <i>llegar → llegué</i>, <i>empezar → empecé</i>.',
    '<i>ser</i> and <i>ir</i> share the same forms: <i>fui, fuiste, fue…</i>'
  ],
  examples:[
    {es:'Compré un billete de tren.', en:'I bought a train ticket.'},
    {es:'Ellos fueron a la playa.', en:'They went to the beach.'},
    {es:'¿Qué hiciste ayer?', en:'What did you do yesterday?'}
  ]
},
{
  key:'imperfecto', title:'Imperfecto (Imperfect)',
  summary:'Ongoing, habitual, or descriptive past — the "was/used to" past.',
  formation:'Add the imperfect endings to the stem. -er and -ir share endings. Only three verbs are irregular.',
  when:[
    'Habitual past actions: <i>De niño jugaba al fútbol.</i> — As a child I used to play soccer.',
    'Ongoing background action: <i>Llovía cuando salí.</i> — It was raining when I left.',
    'Descriptions, age, time, feelings in the past: <i>Eran las tres.</i> / <i>Ella tenía frío.</i>'
  ],
  irregulars:[
    'Only three irregular verbs: <i>ser → era</i>, <i>ir → iba</i>, <i>ver → veía</i>.'
  ],
  examples:[
    {es:'Siempre íbamos a la casa de mi abuela.', en:"We always used to go to my grandmother's house."},
    {es:'Era una noche fría.', en:'It was a cold night.'},
    {es:'Mientras estudiaba, escuchaba música.', en:'While I was studying, I listened to music.'}
  ]
},
{
  key:'futuro', title:'Futuro (Future)',
  summary:'What will happen; also probability in the present.',
  formation:'Add the future endings to the WHOLE infinitive. Endings are the same for all three verb types.',
  when:[
    'Future actions: <i>Mañana viajaré a Perú.</i> — Tomorrow I will travel to Peru.',
    'Promises and predictions: <i>Te ayudaré.</i> — I will help you.',
    'Probability / conjecture about the present: <i>¿Qué hora será?</i> — I wonder what time it is.'
  ],
  irregulars:[
    'A dozen verbs use an irregular stem but the same endings: <i>tener → tendré</i>, <i>poder → podré</i>, <i>hacer → haré</i>, <i>decir → diré</i>, <i>poner → pondré</i>, <i>salir → saldré</i>, <i>saber → sabré</i>, <i>querer → querré</i>.'
  ],
  examples:[
    {es:'Comeremos a las dos.', en:'We will eat at two.'},
    {es:'¿Vendrás a la fiesta?', en:'Will you come to the party?'},
    {es:'Estará en casa ahora.', en:'He is probably at home now.'}
  ]
},
{
  key:'condicional', title:'Condicional (Conditional)',
  summary:'What would happen; polite requests and hypotheticals.',
  formation:'Add the conditional endings to the WHOLE infinitive (same endings for all verb types). Same irregular stems as the future.',
  when:[
    'Hypothetical outcomes: <i>Yo viajaría más si tuviera dinero.</i> — I would travel more if I had money.',
    'Polite requests: <i>¿Podrías ayudarme?</i> — Could you help me?',
    'Probability in the past: <i>Serían las cinco cuando llegó.</i>'
  ],
  irregulars:[
    'Same irregular stems as the future: <i>tener → tendría</i>, <i>hacer → haría</i>, <i>decir → diría</i>, <i>poder → podría</i>.'
  ],
  examples:[
    {es:'Me gustaría un café, por favor.', en:'I would like a coffee, please.'},
    {es:'Deberías descansar.', en:'You should rest.'},
    {es:'Dijo que vendría.', en:'He said he would come.'}
  ]
},
{
  key:'perfecto', title:'Presente perfecto (Present Perfect)',
  summary:'Past actions connected to the present ("have done").',
  formation:'Present of <i>haber</i> (he, has, ha, hemos, habéis, han) + past participle (-ado / -ido).',
  when:[
    'Recent past with present relevance: <i>He terminado el trabajo.</i> — I have finished the work.',
    'Life experience (up to now): <i>¿Has estado en España?</i> — Have you been to Spain?',
    'With "today / this week / ever / never": <i>Hoy he comido mucho.</i>'
  ],
  irregulars:[
    'Irregular participles: <i>hacer → hecho</i>, <i>decir → dicho</i>, <i>ver → visto</i>, <i>escribir → escrito</i>, <i>poner → puesto</i>, <i>volver → vuelto</i>, <i>abrir → abierto</i>, <i>romper → roto</i>, <i>morir → muerto</i>.'
  ],
  examples:[
    {es:'Nunca he probado el ceviche.', en:'I have never tried ceviche.'},
    {es:'Hemos visto esa película.', en:'We have seen that movie.'},
    {es:'¿Ya has comido?', en:'Have you eaten yet?'}
  ]
},
{
  key:'plusc', title:'Pluscuamperfecto (Past Perfect)',
  summary:'An action completed before another past action ("had done").',
  formation:'Imperfect of <i>haber</i> (había, habías, había…) + past participle.',
  when:[
    'A past action prior to another past moment: <i>Cuando llegué, ya habían salido.</i> — When I arrived, they had already left.',
    'Reported/background context in narration.'
  ],
  irregulars:['Same irregular participles as the present perfect.'],
  examples:[
    {es:'Ya había comido cuando llamaste.', en:'I had already eaten when you called.'},
    {es:'Nunca habíamos visto algo así.', en:'We had never seen anything like that.'},
    {es:'Ella había estudiado francés antes.', en:'She had studied French before.'}
  ]
},
{
  key:'futperf', title:'Futuro perfecto (Future Perfect)',
  summary:'An action that will be completed by a future point ("will have done").',
  formation:'Future of <i>haber</i> (habré, habrás, habrá…) + past participle.',
  when:[
    'Completed before a future deadline: <i>Para mañana habré terminado.</i> — By tomorrow I will have finished.',
    'Probability about the recent past: <i>Habrá salido ya.</i> — He has probably already left.'
  ],
  irregulars:['Same irregular participles as the other perfect tenses.'],
  examples:[
    {es:'Para junio habremos ahorrado bastante.', en:'By June we will have saved enough.'},
    {es:'¿Habrás llegado antes de las nueve?', en:'Will you have arrived before nine?'}
  ]
},
{
  key:'condperf', title:'Condicional perfecto (Conditional Perfect)',
  summary:'What would have happened ("would have done").',
  formation:'Conditional of <i>haber</i> (habría, habrías…) + past participle.',
  when:[
    'Unrealized past hypotheticals: <i>Yo habría ido, pero estaba enfermo.</i> — I would have gone, but I was sick.',
    'Often paired with the past perfect subjunctive: <i>Si hubiera sabido, te habría llamado.</i>'
  ],
  irregulars:['Same irregular participles as the other perfect tenses.'],
  examples:[
    {es:'Habríamos llegado a tiempo sin el tráfico.', en:'We would have arrived on time without the traffic.'},
    {es:'¿Qué habrías hecho tú?', en:'What would you have done?'}
  ]
},
{
  key:'presubj', title:'Presente de subjuntivo (Present Subjunctive)',
  summary:'Doubt, desire, emotion, and unrealized situations.',
  formation:'Take the yo present form, drop the -o, and add the "opposite" endings (-ar verbs take -e endings; -er/-ir verbs take -a endings).',
  when:[
    'Wishes & requests: <i>Quiero que vengas.</i> — I want you to come.',
    'Emotion & value judgments: <i>Me alegra que estés aquí.</i>',
    'Doubt & denial: <i>No creo que sea verdad.</i>',
    'After certain conjunctions: <i>para que, antes de que, aunque, cuando</i> (future sense).'
  ],
  irregulars:[
    'Verbs with irregular yo keep it: <i>tener → tenga</i>, <i>hacer → haga</i>, <i>conocer → conozca</i>.',
    'Fully irregular: <i>ser → sea</i>, <i>estar → esté</i>, <i>ir → vaya</i>, <i>haber → haya</i>, <i>saber → sepa</i>, <i>dar → dé</i>.'
  ],
  examples:[
    {es:'Espero que tengas un buen día.', en:'I hope you have a good day.'},
    {es:'Es importante que estudies.', en:"It's important that you study."},
    {es:'Dudo que llueva hoy.', en:"I doubt it will rain today."}
  ]
},
{
  key:'impsubj', title:'Imperfecto de subjuntivo (Imperfect Subjunctive)',
  summary:'The subjunctive in past contexts and "if" clauses.',
  formation:'Take the ellos preterite form, drop -ron, and add -ra, -ras, -ra, -´ramos, -rais, -ran. (Works for every verb, no exceptions.)',
  when:[
    'Past-tense triggers: <i>Quería que vinieras.</i> — I wanted you to come.',
    'Hypothetical / contrary-to-fact "if" clauses: <i>Si tuviera tiempo, viajaría.</i> — If I had time, I would travel.',
    'Polite softening: <i>Quisiera un café.</i> — I would like a coffee.'
  ],
  irregulars:[
    'No separate irregulars — because it is built from the preterite, any preterite irregularity carries over: <i>tener → tuviera</i>, <i>decir → dijera</i>, <i>ir/ser → fuera</i>.'
  ],
  examples:[
    {es:'Si fuera rico, no trabajaría.', en:"If I were rich, I wouldn't work."},
    {es:'Me pidió que la ayudara.', en:'She asked me to help her.'},
    {es:'Ojalá pudiera ir.', en:'I wish I could go.'}
  ]
},
{
  key:'perfsubj', title:'Pretérito perfecto de subjuntivo (Present Perfect Subjunctive)',
  summary:'Subjunctive for a recently completed action ("have done").',
  formation:'Present subjunctive of <i>haber</i> (haya, hayas, haya…) + past participle.',
  when:[
    'Subjunctive triggers about a completed action: <i>Espero que hayas llegado bien.</i> — I hope you have arrived safely.',
    'Emotion/doubt about the recent past: <i>No creo que lo haya hecho.</i>'
  ],
  irregulars:['Same irregular participles as the other perfect tenses.'],
  examples:[
    {es:'Me alegro de que hayas venido.', en:'I am glad that you have come.'},
    {es:'Es posible que ya hayan salido.', en:'It is possible that they have already left.'}
  ]
},
{
  key:'imperativo', title:'Imperativo (Commands)',
  summary:'Direct commands — telling someone to do (or not do) something.',
  formation:'Affirmative tú = 3rd-person present (habla). Usted/nosotros/ustedes = present subjunctive. Vosotros = infinitive with -r → -d (hablad). Negative commands use the present subjunctive for every person.',
  when:[
    'Giving instructions or orders: <i>¡Habla más despacio!</i> — Speak more slowly!',
    'Negative commands use the subjunctive: <i>No hables.</i> — Don\'t speak.'
  ],
  irregulars:[
    'Irregular affirmative tú commands: <i>decir → di</i>, <i>hacer → haz</i>, <i>ir → ve</i>, <i>poner → pon</i>, <i>salir → sal</i>, <i>ser → sé</i>, <i>tener → ten</i>, <i>venir → ven</i>.'
  ],
  examples:[
    {es:'¡Ven aquí!', en:'Come here!'},
    {es:'No te preocupes.', en:"Don't worry."},
    {es:'Hagan la tarea, por favor.', en:'Do the homework, please.'}
  ]
}
];
