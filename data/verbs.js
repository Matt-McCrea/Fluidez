/* ============================================================================
 * VERBS  —  ~100 most common Spanish verbs
 * ----------------------------------------------------------------------------
 * Person order everywhere: [ yo, tú, él/ella, nosotros, vosotros, ellos ]
 *
 * Regular verbs need only { inf, en, type }.  The conjugation engine
 * (js/data-engine.js) builds every tense from the endings tables.
 *
 * Irregular verbs additionally carry `forms` with ONLY the tenses that are
 * irregular. Any tense you omit is generated as a regular verb of its `type`.
 * The engine always DERIVES these, so you never hand-type them:
 *    - imperfecto de subjuntivo  (from 3rd-plural preterite)
 *    - all compound tenses       (haber + participle)
 *    - imperativo                (from present subjunctive + tú command)
 *
 * `part` = irregular past participle (else computed -ado/-ido)
 * `ger`  = irregular gerund        (else computed -ando/-iendo)
 * `tuCmd`= irregular affirmative tú command (di, haz, ve, pon, sal, sé, ten, ven)
 * ========================================================================== */
window.VERBS = [

/* ---- The essential irregulars ---------------------------------------- */
{ inf:'ser', en:'to be (essence)', type:'er', ger:'siendo', forms:{
  presente:['soy','eres','es','somos','sois','son'],
  preterito:['fui','fuiste','fue','fuimos','fuisteis','fueron'],
  imperfecto:['era','eras','era','éramos','erais','eran'],
  presubj:['sea','seas','sea','seamos','seáis','sean'] }, tuCmd:'sé' },

{ inf:'estar', en:'to be (state)', type:'ar', forms:{
  presente:['estoy','estás','está','estamos','estáis','están'],
  preterito:['estuve','estuviste','estuvo','estuvimos','estuvisteis','estuvieron'],
  presubj:['esté','estés','esté','estemos','estéis','estén'] } },

{ inf:'haber', en:'to have (auxiliary)', type:'er', forms:{
  presente:['he','has','ha','hemos','habéis','han'],
  preterito:['hube','hubiste','hubo','hubimos','hubisteis','hubieron'],
  futuro:['habré','habrás','habrá','habremos','habréis','habrán'],
  condicional:['habría','habrías','habría','habríamos','habríais','habrían'],
  presubj:['haya','hayas','haya','hayamos','hayáis','hayan'] } },

{ inf:'tener', en:'to have', type:'er', forms:{
  presente:['tengo','tienes','tiene','tenemos','tenéis','tienen'],
  preterito:['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'],
  futuro:['tendré','tendrás','tendrá','tendremos','tendréis','tendrán'],
  condicional:['tendría','tendrías','tendría','tendríamos','tendríais','tendrían'],
  presubj:['tenga','tengas','tenga','tengamos','tengáis','tengan'] }, tuCmd:'ten' },

{ inf:'hacer', en:'to do / to make', type:'er', part:'hecho', forms:{
  presente:['hago','haces','hace','hacemos','hacéis','hacen'],
  preterito:['hice','hiciste','hizo','hicimos','hicisteis','hicieron'],
  futuro:['haré','harás','hará','haremos','haréis','harán'],
  condicional:['haría','harías','haría','haríamos','haríais','harían'],
  presubj:['haga','hagas','haga','hagamos','hagáis','hagan'] }, tuCmd:'haz' },

{ inf:'ir', en:'to go', type:'ir', ger:'yendo', forms:{
  presente:['voy','vas','va','vamos','vais','van'],
  preterito:['fui','fuiste','fue','fuimos','fuisteis','fueron'],
  imperfecto:['iba','ibas','iba','íbamos','ibais','iban'],
  presubj:['vaya','vayas','vaya','vayamos','vayáis','vayan'] }, tuCmd:'ve' },

{ inf:'poder', en:'to be able / can', type:'er', ger:'pudiendo', forms:{
  presente:['puedo','puedes','puede','podemos','podéis','pueden'],
  preterito:['pude','pudiste','pudo','pudimos','pudisteis','pudieron'],
  futuro:['podré','podrás','podrá','podremos','podréis','podrán'],
  condicional:['podría','podrías','podría','podríamos','podríais','podrían'],
  presubj:['pueda','puedas','pueda','podamos','podáis','puedan'] } },

{ inf:'decir', en:'to say / to tell', type:'ir', part:'dicho', ger:'diciendo', forms:{
  presente:['digo','dices','dice','decimos','decís','dicen'],
  preterito:['dije','dijiste','dijo','dijimos','dijisteis','dijeron'],
  futuro:['diré','dirás','dirá','diremos','diréis','dirán'],
  condicional:['diría','dirías','diría','diríamos','diríais','dirían'],
  presubj:['diga','digas','diga','digamos','digáis','digan'] }, tuCmd:'di' },

{ inf:'ver', en:'to see', type:'er', part:'visto', forms:{
  presente:['veo','ves','ve','vemos','veis','ven'],
  preterito:['vi','viste','vio','vimos','visteis','vieron'],
  imperfecto:['veía','veías','veía','veíamos','veíais','veían'],
  presubj:['vea','veas','vea','veamos','veáis','vean'] } },

{ inf:'dar', en:'to give', type:'ar', forms:{
  presente:['doy','das','da','damos','dais','dan'],
  preterito:['di','diste','dio','dimos','disteis','dieron'],
  presubj:['dé','des','dé','demos','deis','den'] } },

{ inf:'saber', en:'to know (facts)', type:'er', forms:{
  presente:['sé','sabes','sabe','sabemos','sabéis','saben'],
  preterito:['supe','supiste','supo','supimos','supisteis','supieron'],
  futuro:['sabré','sabrás','sabrá','sabremos','sabréis','sabrán'],
  condicional:['sabría','sabrías','sabría','sabríamos','sabríais','sabrían'],
  presubj:['sepa','sepas','sepa','sepamos','sepáis','sepan'] } },

{ inf:'querer', en:'to want / to love', type:'er', ger:'queriendo', forms:{
  presente:['quiero','quieres','quiere','queremos','queréis','quieren'],
  preterito:['quise','quisiste','quiso','quisimos','quisisteis','quisieron'],
  futuro:['querré','querrás','querrá','querremos','querréis','querrán'],
  condicional:['querría','querrías','querría','querríamos','querríais','querrían'],
  presubj:['quiera','quieras','quiera','queramos','queráis','quieran'] } },

{ inf:'poner', en:'to put / to place', type:'er', part:'puesto', forms:{
  presente:['pongo','pones','pone','ponemos','ponéis','ponen'],
  preterito:['puse','pusiste','puso','pusimos','pusisteis','pusieron'],
  futuro:['pondré','pondrás','pondrá','pondremos','pondréis','pondrán'],
  condicional:['pondría','pondrías','pondría','pondríamos','pondríais','pondrían'],
  presubj:['ponga','pongas','ponga','pongamos','pongáis','pongan'] }, tuCmd:'pon' },

{ inf:'venir', en:'to come', type:'ir', ger:'viniendo', forms:{
  presente:['vengo','vienes','viene','venimos','venís','vienen'],
  preterito:['vine','viniste','vino','vinimos','vinisteis','vinieron'],
  futuro:['vendré','vendrás','vendrá','vendremos','vendréis','vendrán'],
  condicional:['vendría','vendrías','vendría','vendríamos','vendríais','vendrían'],
  presubj:['venga','vengas','venga','vengamos','vengáis','vengan'] }, tuCmd:'ven' },

{ inf:'salir', en:'to leave / to go out', type:'ir', forms:{
  presente:['salgo','sales','sale','salimos','salís','salen'],
  futuro:['saldré','saldrás','saldrá','saldremos','saldréis','saldrán'],
  condicional:['saldría','saldrías','saldría','saldríamos','saldríais','saldrían'],
  presubj:['salga','salgas','salga','salgamos','salgáis','salgan'] }, tuCmd:'sal' },

{ inf:'traer', en:'to bring', type:'er', part:'traído', ger:'trayendo', forms:{
  presente:['traigo','traes','trae','traemos','traéis','traen'],
  preterito:['traje','trajiste','trajo','trajimos','trajisteis','trajeron'],
  presubj:['traiga','traigas','traiga','traigamos','traigáis','traigan'] } },

{ inf:'caer', en:'to fall', type:'er', part:'caído', ger:'cayendo', forms:{
  presente:['caigo','caes','cae','caemos','caéis','caen'],
  preterito:['caí','caíste','cayó','caímos','caísteis','cayeron'],
  presubj:['caiga','caigas','caiga','caigamos','caigáis','caigan'] } },

{ inf:'oír', en:'to hear', type:'ir', part:'oído', ger:'oyendo', forms:{
  presente:['oigo','oyes','oye','oímos','oís','oyen'],
  preterito:['oí','oíste','oyó','oímos','oísteis','oyeron'],
  presubj:['oiga','oigas','oiga','oigamos','oigáis','oigan'] } },

{ inf:'dormir', en:'to sleep', type:'ir', ger:'durmiendo', forms:{
  presente:['duermo','duermes','duerme','dormimos','dormís','duermen'],
  preterito:['dormí','dormiste','durmió','dormimos','dormisteis','durmieron'],
  presubj:['duerma','duermas','duerma','durmamos','durmáis','duerman'] } },

{ inf:'morir', en:'to die', type:'ir', part:'muerto', ger:'muriendo', forms:{
  presente:['muero','mueres','muere','morimos','morís','mueren'],
  preterito:['morí','moriste','murió','morimos','moristeis','murieron'],
  presubj:['muera','mueras','muera','muramos','muráis','mueran'] } },

{ inf:'pedir', en:'to ask for / to request', type:'ir', ger:'pidiendo', forms:{
  presente:['pido','pides','pide','pedimos','pedís','piden'],
  preterito:['pedí','pediste','pidió','pedimos','pedisteis','pidieron'],
  presubj:['pida','pidas','pida','pidamos','pidáis','pidan'] } },

{ inf:'servir', en:'to serve', type:'ir', ger:'sirviendo', forms:{
  presente:['sirvo','sirves','sirve','servimos','servís','sirven'],
  preterito:['serví','serviste','sirvió','servimos','servisteis','sirvieron'],
  presubj:['sirva','sirvas','sirva','sirvamos','sirváis','sirvan'] } },

{ inf:'sentir', en:'to feel / to regret', type:'ir', ger:'sintiendo', forms:{
  presente:['siento','sientes','siente','sentimos','sentís','sienten'],
  preterito:['sentí','sentiste','sintió','sentimos','sentisteis','sintieron'],
  presubj:['sienta','sientas','sienta','sintamos','sintáis','sientan'] } },

{ inf:'preferir', en:'to prefer', type:'ir', ger:'prefiriendo', forms:{
  presente:['prefiero','prefieres','prefiere','preferimos','preferís','prefieren'],
  preterito:['preferí','preferiste','prefirió','preferimos','preferisteis','prefirieron'],
  presubj:['prefiera','prefieras','prefiera','prefiramos','prefiráis','prefieran'] } },

{ inf:'repetir', en:'to repeat', type:'ir', ger:'repitiendo', forms:{
  presente:['repito','repites','repite','repetimos','repetís','repiten'],
  preterito:['repetí','repetiste','repitió','repetimos','repetisteis','repitieron'],
  presubj:['repita','repitas','repita','repitamos','repitáis','repitan'] } },

{ inf:'seguir', en:'to follow / to continue', type:'ir', ger:'siguiendo', forms:{
  presente:['sigo','sigues','sigue','seguimos','seguís','siguen'],
  preterito:['seguí','seguiste','siguió','seguimos','seguisteis','siguieron'],
  presubj:['siga','sigas','siga','sigamos','sigáis','sigan'] } },

{ inf:'conseguir', en:'to obtain / to manage to', type:'ir', ger:'consiguiendo', forms:{
  presente:['consigo','consigues','consigue','conseguimos','conseguís','consiguen'],
  preterito:['conseguí','conseguiste','consiguió','conseguimos','conseguisteis','consiguieron'],
  presubj:['consiga','consigas','consiga','consigamos','consigáis','consigan'] } },

{ inf:'reír', en:'to laugh', type:'ir', part:'reído', ger:'riendo', forms:{
  presente:['río','ríes','ríe','reímos','reís','ríen'],
  preterito:['reí','reíste','rió','reímos','reísteis','rieron'],
  presubj:['ría','rías','ría','riamos','riáis','rían'] } },

{ inf:'creer', en:'to believe / to think', type:'er', part:'creído', ger:'creyendo', forms:{
  preterito:['creí','creíste','creyó','creímos','creísteis','creyeron'] } },

{ inf:'leer', en:'to read', type:'er', part:'leído', ger:'leyendo', forms:{
  preterito:['leí','leíste','leyó','leímos','leísteis','leyeron'] } },

{ inf:'construir', en:'to build', type:'ir', ger:'construyendo', forms:{
  presente:['construyo','construyes','construye','construimos','construís','construyen'],
  preterito:['construí','construiste','construyó','construimos','construisteis','construyeron'],
  presubj:['construya','construyas','construya','construyamos','construyáis','construyan'] } },

{ inf:'conocer', en:'to know (people/places)', type:'er', forms:{
  presente:['conozco','conoces','conoce','conocemos','conocéis','conocen'],
  presubj:['conozca','conozcas','conozca','conozcamos','conozcáis','conozcan'] } },

{ inf:'parecer', en:'to seem / to appear', type:'er', forms:{
  presente:['parezco','pareces','parece','parecemos','parecéis','parecen'],
  presubj:['parezca','parezcas','parezca','parezcamos','parezcáis','parezcan'] } },

{ inf:'conducir', en:'to drive', type:'ir', forms:{
  presente:['conduzco','conduces','conduce','conducimos','conducís','conducen'],
  preterito:['conduje','condujiste','condujo','condujimos','condujisteis','condujeron'],
  presubj:['conduzca','conduzcas','conduzca','conduzcamos','conduzcáis','conduzcan'] } },

{ inf:'producir', en:'to produce', type:'ir', forms:{
  presente:['produzco','produces','produce','producimos','producís','producen'],
  preterito:['produje','produjiste','produjo','produjimos','produjisteis','produjeron'],
  presubj:['produzca','produzcas','produzca','produzcamos','produzcáis','produzcan'] } },

{ inf:'traducir', en:'to translate', type:'ir', forms:{
  presente:['traduzco','traduces','traduce','traducimos','traducís','traducen'],
  preterito:['traduje','tradujiste','tradujo','tradujimos','tradujisteis','tradujeron'],
  presubj:['traduzca','traduzcas','traduzca','traduzcamos','traduzcáis','traduzcan'] } },

/* ---- Common stem-changing verbs (e>ie, o>ue, u>ue, e>i) --------------- */
{ inf:'pensar', en:'to think', type:'ar', forms:{
  presente:['pienso','piensas','piensa','pensamos','pensáis','piensan'],
  presubj:['piense','pienses','piense','pensemos','penséis','piensen'] } },

{ inf:'empezar', en:'to begin', type:'ar', forms:{
  presente:['empiezo','empiezas','empieza','empezamos','empezáis','empiezan'],
  preterito:['empecé','empezaste','empezó','empezamos','empezasteis','empezaron'],
  presubj:['empiece','empieces','empiece','empecemos','empecéis','empiecen'] } },

{ inf:'comenzar', en:'to start', type:'ar', forms:{
  presente:['comienzo','comienzas','comienza','comenzamos','comenzáis','comienzan'],
  preterito:['comencé','comenzaste','comenzó','comenzamos','comenzasteis','comenzaron'],
  presubj:['comience','comiences','comience','comencemos','comencéis','comiencen'] } },

{ inf:'cerrar', en:'to close', type:'ar', forms:{
  presente:['cierro','cierras','cierra','cerramos','cerráis','cierran'],
  presubj:['cierre','cierres','cierre','cerremos','cerréis','cierren'] } },

{ inf:'entender', en:'to understand', type:'er', forms:{
  presente:['entiendo','entiendes','entiende','entendemos','entendéis','entienden'],
  presubj:['entienda','entiendas','entienda','entendamos','entendáis','entiendan'] } },

{ inf:'perder', en:'to lose', type:'er', forms:{
  presente:['pierdo','pierdes','pierde','perdemos','perdéis','pierden'],
  presubj:['pierda','pierdas','pierda','perdamos','perdáis','pierdan'] } },

{ inf:'volver', en:'to return / to come back', type:'er', part:'vuelto', forms:{
  presente:['vuelvo','vuelves','vuelve','volvemos','volvéis','vuelven'],
  presubj:['vuelva','vuelvas','vuelva','volvamos','volváis','vuelvan'] } },

{ inf:'encontrar', en:'to find', type:'ar', forms:{
  presente:['encuentro','encuentras','encuentra','encontramos','encontráis','encuentran'],
  presubj:['encuentre','encuentres','encuentre','encontremos','encontréis','encuentren'] } },

{ inf:'contar', en:'to count / to tell', type:'ar', forms:{
  presente:['cuento','cuentas','cuenta','contamos','contáis','cuentan'],
  presubj:['cuente','cuentes','cuente','contemos','contéis','cuenten'] } },

{ inf:'recordar', en:'to remember', type:'ar', forms:{
  presente:['recuerdo','recuerdas','recuerda','recordamos','recordáis','recuerdan'],
  presubj:['recuerde','recuerdes','recuerde','recordemos','recordéis','recuerden'] } },

{ inf:'mostrar', en:'to show', type:'ar', forms:{
  presente:['muestro','muestras','muestra','mostramos','mostráis','muestran'],
  presubj:['muestre','muestres','muestre','mostremos','mostréis','muestren'] } },

{ inf:'costar', en:'to cost', type:'ar', forms:{
  presente:['cuesto','cuestas','cuesta','costamos','costáis','cuestan'],
  presubj:['cueste','cuestes','cueste','costemos','costéis','cuesten'] } },

{ inf:'jugar', en:'to play', type:'ar', forms:{
  presente:['juego','juegas','juega','jugamos','jugáis','juegan'],
  preterito:['jugué','jugaste','jugó','jugamos','jugasteis','jugaron'],
  presubj:['juegue','juegues','juegue','juguemos','juguéis','jueguen'] } },

{ inf:'sentar', en:'to seat / to sit', type:'ar', forms:{
  presente:['siento','sientas','sienta','sentamos','sentáis','sientan'],
  presubj:['siente','sientes','siente','sentemos','sentéis','sienten'] } },

/* ---- Orthographic-change verbs (car/gar/zar, ger/gir) ---------------- */
{ inf:'buscar', en:'to look for', type:'ar', forms:{
  preterito:['busqué','buscaste','buscó','buscamos','buscasteis','buscaron'],
  presubj:['busque','busques','busque','busquemos','busquéis','busquen'] } },

{ inf:'llegar', en:'to arrive', type:'ar', forms:{
  preterito:['llegué','llegaste','llegó','llegamos','llegasteis','llegaron'],
  presubj:['llegue','llegues','llegue','lleguemos','lleguéis','lleguen'] } },

{ inf:'pagar', en:'to pay', type:'ar', forms:{
  preterito:['pagué','pagaste','pagó','pagamos','pagasteis','pagaron'],
  presubj:['pague','pagues','pague','paguemos','paguéis','paguen'] } },

{ inf:'sacar', en:'to take out', type:'ar', forms:{
  preterito:['saqué','sacaste','sacó','sacamos','sacasteis','sacaron'],
  presubj:['saque','saques','saque','saquemos','saquéis','saquen'] } },

{ inf:'tocar', en:'to touch / to play (instrument)', type:'ar', forms:{
  preterito:['toqué','tocaste','tocó','tocamos','tocasteis','tocaron'],
  presubj:['toque','toques','toque','toquemos','toquéis','toquen'] } },

{ inf:'escribir', en:'to write', type:'ir', part:'escrito' },
{ inf:'abrir', en:'to open', type:'ir', part:'abierto' },
{ inf:'romper', en:'to break', type:'er', part:'roto' },
{ inf:'cubrir', en:'to cover', type:'ir', part:'cubierto' },
{ inf:'descubrir', en:'to discover', type:'ir', part:'descubierto' },

/* ---- Regular verbs (engine conjugates fully) ------------------------- */
{ inf:'hablar', en:'to speak / to talk', type:'ar' },
{ inf:'llamar', en:'to call', type:'ar' },
{ inf:'llevar', en:'to carry / to wear', type:'ar' },
{ inf:'dejar', en:'to leave / to let', type:'ar' },
{ inf:'pasar', en:'to pass / to happen', type:'ar' },
{ inf:'quedar', en:'to stay / to remain', type:'ar' },
{ inf:'esperar', en:'to wait / to hope', type:'ar' },
{ inf:'trabajar', en:'to work', type:'ar' },
{ inf:'necesitar', en:'to need', type:'ar' },
{ inf:'entrar', en:'to enter', type:'ar' },
{ inf:'mirar', en:'to look / to watch', type:'ar' },
{ inf:'usar', en:'to use', type:'ar' },
{ inf:'ayudar', en:'to help', type:'ar' },
{ inf:'gustar', en:'to be pleasing / to like', type:'ar' },
{ inf:'tomar', en:'to take / to drink', type:'ar' },
{ inf:'estudiar', en:'to study', type:'ar' },
{ inf:'comprar', en:'to buy', type:'ar' },
{ inf:'cambiar', en:'to change', type:'ar' },
{ inf:'terminar', en:'to finish / to end', type:'ar' },
{ inf:'preguntar', en:'to ask (a question)', type:'ar' },
{ inf:'ganar', en:'to win / to earn', type:'ar' },
{ inf:'viajar', en:'to travel', type:'ar' },
{ inf:'cocinar', en:'to cook', type:'ar' },
{ inf:'cantar', en:'to sing', type:'ar' },
{ inf:'bailar', en:'to dance', type:'ar' },
{ inf:'caminar', en:'to walk', type:'ar' },
{ inf:'comer', en:'to eat', type:'er' },
{ inf:'beber', en:'to drink', type:'er' },
{ inf:'aprender', en:'to learn', type:'er' },
{ inf:'comprender', en:'to understand', type:'er' },
{ inf:'deber', en:'to owe / ought to', type:'er' },
{ inf:'correr', en:'to run', type:'er' },
{ inf:'vender', en:'to sell', type:'er' },
{ inf:'responder', en:'to answer / to respond', type:'er' },
{ inf:'meter', en:'to put in', type:'er' },
{ inf:'vivir', en:'to live', type:'ir' },
{ inf:'recibir', en:'to receive', type:'ir' },
{ inf:'decidir', en:'to decide', type:'ir' },
{ inf:'permitir', en:'to permit / to allow', type:'ir' },
{ inf:'subir', en:'to go up / to raise', type:'ir' },
{ inf:'existir', en:'to exist', type:'ir' },
{ inf:'ocurrir', en:'to occur / to happen', type:'ir' },
{ inf:'partir', en:'to leave / to divide', type:'ir' },

/* ---- More regular verbs (widens the regular-conjugation drill pool) -- */
{ inf:'desayunar', en:'to have breakfast', type:'ar' },
{ inf:'cenar', en:'to have dinner', type:'ar' },
{ inf:'preparar', en:'to prepare', type:'ar' },
{ inf:'invitar', en:'to invite', type:'ar' },
{ inf:'saludar', en:'to greet', type:'ar' },
{ inf:'olvidar', en:'to forget', type:'ar' },
{ inf:'disfrutar', en:'to enjoy', type:'ar' },
{ inf:'regresar', en:'to return / to go back', type:'ar' },
{ inf:'dibujar', en:'to draw', type:'ar' },
{ inf:'nadar', en:'to swim', type:'ar' },
{ inf:'lavar', en:'to wash', type:'ar' },
{ inf:'firmar', en:'to sign', type:'ar' },
{ inf:'lograr', en:'to achieve / to manage to', type:'ar' },
{ inf:'limpiar', en:'to clean', type:'ar' },
{ inf:'participar', en:'to participate', type:'ar' },
{ inf:'depender', en:'to depend', type:'er' },
{ inf:'prometer', en:'to promise', type:'er' },
{ inf:'sorprender', en:'to surprise', type:'er' },
{ inf:'suceder', en:'to happen', type:'er' },
{ inf:'esconder', en:'to hide', type:'er' },
{ inf:'asistir', en:'to attend', type:'ir' },
{ inf:'discutir', en:'to argue / to discuss', type:'ir' },
{ inf:'insistir', en:'to insist', type:'ir' },
{ inf:'resistir', en:'to resist', type:'ir' },
{ inf:'compartir', en:'to share', type:'ir' },
{ inf:'cumplir', en:'to fulfill / to turn (an age)', type:'ir' },
{ inf:'añadir', en:'to add', type:'ir' },
{ inf:'admitir', en:'to admit', type:'ir' },
{ inf:'definir', en:'to define', type:'ir' },
{ inf:'sufrir', en:'to suffer', type:'ir' },

/* ---- More common verbs for everyday & modern adult life --------------- */

/* -- fully regular -------------------------------------------------------- */
{ inf:'escuchar', en:'to listen (to)', type:'ar' },
{ inf:'mandar', en:'to send / to order', type:'ar' },
{ inf:'organizar', en:'to organize', type:'ar' },
{ inf:'planear', en:'to plan', type:'ar' },
{ inf:'ahorrar', en:'to save (money)', type:'ar' },
{ inf:'gastar', en:'to spend (money)', type:'ar' },
{ inf:'alquilar', en:'to rent', type:'ar' },
{ inf:'reservar', en:'to reserve / to book', type:'ar' },
{ inf:'contratar', en:'to hire', type:'ar' },
{ inf:'negociar', en:'to negotiate', type:'ar' },
{ inf:'gestionar', en:'to manage / to handle', type:'ar' },
{ inf:'administrar', en:'to administer / to manage', type:'ar' },
{ inf:'actualizar', en:'to update', type:'ar' },
{ inf:'instalar', en:'to install', type:'ar' },
{ inf:'configurar', en:'to configure / to set up', type:'ar' },
{ inf:'conectar', en:'to connect', type:'ar' },
{ inf:'reciclar', en:'to recycle', type:'ar' },
{ inf:'descansar', en:'to rest', type:'ar' },
{ inf:'respirar', en:'to breathe', type:'ar' },
{ inf:'curar', en:'to cure / to heal', type:'ar' },
{ inf:'operar', en:'to operate', type:'ar' },
{ inf:'vacunar', en:'to vaccinate', type:'ar' },
{ inf:'programar', en:'to program / to schedule', type:'ar' },
{ inf:'diseñar', en:'to design', type:'ar' },
{ inf:'desarrollar', en:'to develop', type:'ar' },
{ inf:'reclamar', en:'to claim / to complain', type:'ar' },
{ inf:'votar', en:'to vote', type:'ar' },
{ inf:'opinar', en:'to think / to give an opinion', type:'ar' },
{ inf:'protestar', en:'to protest', type:'ar' },
{ inf:'contaminar', en:'to pollute', type:'ar' },
{ inf:'llorar', en:'to cry', type:'ar' },
{ inf:'debatir', en:'to debate', type:'ir' },

/* -- orthographic-change (car/gar/zar): 1st-person preterite + presubj --- */
{ inf:'descargar', en:'to download', type:'ar', forms:{
  preterito:['descargué','descargaste','descargó','descargamos','descargasteis','descargaron'],
  presubj:['descargue','descargues','descargue','descarguemos','descarguéis','descarguen'] } },

{ inf:'apagar', en:'to turn off', type:'ar', forms:{
  preterito:['apagué','apagaste','apagó','apagamos','apagasteis','apagaron'],
  presubj:['apague','apagues','apague','apaguemos','apaguéis','apaguen'] } },

{ inf:'cargar', en:'to charge / to load', type:'ar', forms:{
  preterito:['cargué','cargaste','cargó','cargamos','cargasteis','cargaron'],
  presubj:['cargue','cargues','cargue','carguemos','carguéis','carguen'] } },

{ inf:'madrugar', en:'to get up early', type:'ar', forms:{
  preterito:['madrugué','madrugaste','madrugó','madrugamos','madrugasteis','madrugaron'],
  presubj:['madrugue','madrugues','madrugue','madruguemos','madruguéis','madruguen'] } },

/* -- stem-changing e>ie (-ar / -er) --------------------------------------- */
{ inf:'calentar', en:'to heat / to warm up', type:'ar', forms:{
  presente:['caliento','calientas','calienta','calentamos','calentáis','calientan'],
  presubj:['caliente','calientes','caliente','calentemos','calentéis','calienten'] } },

{ inf:'encender', en:'to turn on / to light', type:'er', forms:{
  presente:['enciendo','enciendes','enciende','encendemos','encendéis','encienden'],
  presubj:['encienda','enciendas','encienda','encendamos','encendáis','enciendan'] } },

/* -- stem-changing e>ie/i (-ir, like sentir/preferir) --------------------- */
{ inf:'invertir', en:'to invest', type:'ir', ger:'invirtiendo', forms:{
  presente:['invierto','inviertes','invierte','invertimos','invertís','invierten'],
  preterito:['invertí','invertiste','invirtió','invertimos','invertisteis','invirtieron'],
  presubj:['invierta','inviertas','invierta','invirtamos','invirtáis','inviertan'] } },

/* -- stem-changing e>i (-ir, like pedir/servir) --------------------------- */
{ inf:'despedir', en:'to fire / to dismiss', type:'ir', ger:'despidiendo', forms:{
  presente:['despido','despides','despide','despedimos','despedís','despiden'],
  preterito:['despedí','despediste','despidió','despedimos','despedisteis','despidieron'],
  presubj:['despida','despidas','despida','despidamos','despidáis','despidan'] } },

/* -- stem-changing e>i + g/j orthographic (-ir) --------------------------- */
{ inf:'elegir', en:'to choose / to elect', type:'ir', ger:'eligiendo', forms:{
  presente:['elijo','eliges','elige','elegimos','elegís','eligen'],
  preterito:['elegí','elegiste','eligió','elegimos','elegisteis','eligieron'],
  presubj:['elija','elijas','elija','elijamos','elijáis','elijan'] } },

{ inf:'corregir', en:'to correct', type:'ir', ger:'corrigiendo', forms:{
  presente:['corrijo','corriges','corrige','corregimos','corregís','corrigen'],
  preterito:['corregí','corregiste','corrigió','corregimos','corregisteis','corrigieron'],
  presubj:['corrija','corrijas','corrija','corrijamos','corrijáis','corrijan'] } },

/* -- g/j orthographic only (-ir, no stem-vowel change) -------------------- */
{ inf:'dirigir', en:'to direct / to manage', type:'ir', forms:{
  presente:['dirijo','diriges','dirige','dirigimos','dirigís','dirigen'],
  presubj:['dirija','dirijas','dirija','dirijamos','dirijáis','dirijan'] } },

{ inf:'exigir', en:'to demand / to require', type:'ir', forms:{
  presente:['exijo','exiges','exige','exigimos','exigís','exigen'],
  presubj:['exija','exijas','exija','exijamos','exijáis','exijan'] } },

/* -- accent-shift -iar (like actuar/enviar) ------------------------------- */
{ inf:'enviar', en:'to send', type:'ar', forms:{
  presente:['envío','envías','envía','enviamos','enviáis','envían'],
  presubj:['envíe','envíes','envíe','enviemos','enviéis','envíen'] } },

/* -- accent-shift like reír ------------------------------------------------ */
{ inf:'sonreír', en:'to smile', type:'ir', part:'sonreído', ger:'sonriendo', forms:{
  presente:['sonrío','sonríes','sonríe','sonreímos','sonreís','sonríen'],
  preterito:['sonreí','sonreíste','sonrió','sonreímos','sonreísteis','sonrieron'],
  presubj:['sonría','sonrías','sonría','sonriamos','sonriáis','sonrían'] } },

/* -- irregular preterite only ---------------------------------------------- */
{ inf:'andar', en:'to walk / to go around', type:'ar', forms:{
  preterito:['anduve','anduviste','anduvo','anduvimos','anduvisteis','anduvieron'] } },

/* -- irregular yo + futuro/condicional + presubj (like tener/poner) ------- */
{ inf:'valer', en:'to be worth', type:'er', forms:{
  presente:['valgo','vales','vale','valemos','valéis','valen'],
  futuro:['valdré','valdrás','valdrá','valdremos','valdréis','valdrán'],
  condicional:['valdría','valdrías','valdría','valdríamos','valdríais','valdrían'],
  presubj:['valga','valgas','valga','valgamos','valgáis','valgan'] } },

/* -- reflexive: daily routine (the engine conjugates these like their base
      verb and adds the reflexive pronoun itself — see js/engine.js) -------- */
{ inf:'despertarse', en:'to wake up', type:'ar', forms:{
  presente:['despierto','despiertas','despierta','despertamos','despertáis','despiertan'],
  presubj:['despierte','despiertes','despierte','despertemos','despertéis','despierten'] } },
{ inf:'levantarse', en:'to get up', type:'ar' },
{ inf:'ducharse', en:'to shower', type:'ar' },
{ inf:'bañarse', en:'to bathe', type:'ar' },
{ inf:'lavarse', en:'to wash (oneself)', type:'ar' },
{ inf:'cepillarse', en:'to brush (teeth/hair)', type:'ar' },
{ inf:'vestirse', en:'to get dressed', type:'ir', ger:'vistiendo', forms:{
  presente:['visto','vistes','viste','vestimos','vestís','visten'],
  preterito:['vestí','vestiste','vistió','vestimos','vestisteis','vistieron'],
  presubj:['vista','vistas','vista','vistamos','vistáis','vistan'] } },
{ inf:'peinarse', en:'to comb one\'s hair', type:'ar' },
{ inf:'afeitarse', en:'to shave', type:'ar' },
{ inf:'maquillarse', en:'to put on makeup', type:'ar' },
{ inf:'acostarse', en:'to go to bed', type:'ar', forms:{
  presente:['acuesto','acuestas','acuesta','acostamos','acostáis','acuestan'],
  presubj:['acueste','acuestes','acueste','acostemos','acostéis','acuesten'] } },
{ inf:'dormirse', en:'to fall asleep', type:'ir', ger:'durmiendo', forms:{
  presente:['duermo','duermes','duerme','dormimos','dormís','duermen'],
  preterito:['dormí','dormiste','durmió','dormimos','dormisteis','durmieron'],
  presubj:['duerma','duermas','duerma','durmamos','durmáis','duerman'] } },
{ inf:'sentarse', en:'to sit down', type:'ar', forms:{
  presente:['siento','sientas','sienta','sentamos','sentáis','sientan'],
  presubj:['siente','sientes','siente','sentemos','sentéis','sienten'] } },
{ inf:'sentirse', en:'to feel', type:'ir', ger:'sintiendo', forms:{
  presente:['siento','sientes','siente','sentimos','sentís','sienten'],
  preterito:['sentí','sentiste','sintió','sentimos','sentisteis','sintieron'],
  presubj:['sienta','sientas','sienta','sintamos','sintáis','sientan'] } },
{ inf:'quedarse', en:'to stay / to remain', type:'ar' },
{ inf:'prepararse', en:'to get ready', type:'ar' },
{ inf:'relajarse', en:'to relax', type:'ar' },
{ inf:'ponerse', en:'to put on (clothing) / to become', type:'er', part:'puesto', forms:{
  presente:['pongo','pones','pone','ponemos','ponéis','ponen'],
  preterito:['puse','pusiste','puso','pusimos','pusisteis','pusieron'],
  futuro:['pondré','pondrás','pondrá','pondremos','pondréis','pondrán'],
  condicional:['pondría','pondrías','pondría','pondríamos','pondríais','pondrían'],
  presubj:['ponga','pongas','ponga','pongamos','pongáis','pongan'] }, tuCmd:'pon' },
{ inf:'irse', en:'to leave / to go away', type:'ir', ger:'yendo', forms:{
  presente:['voy','vas','va','vamos','vais','van'],
  preterito:['fui','fuiste','fue','fuimos','fuisteis','fueron'],
  imperfecto:['iba','ibas','iba','íbamos','ibais','iban'],
  presubj:['vaya','vayas','vaya','vayamos','vayáis','vayan'] }, tuCmd:'ve' },

/* ---- Plan Curricular verbs (B1-C1) ------------------------------------------
 * The syllabus uses hundreds of verbs the dataset did not have, which capped
 * every generated lesson at the vocabulary of a beginner course. Added here so
 * the conjugation engine, the writing checker and tools/lint-spanish.js can all
 * reason about them.
 *
 * Most need only { inf, en, type }: the morphology layer in js/engine.js derives
 * the orthographic changes (realizar>realicé, coger>cojo, conocer>conozco,
 * incluir>incluyo). Stem-changers carry `stem`; prefixed compounds of irregular
 * verbs carry `like`. Run tools/audit-verbs.js after adding any verb — it checks
 * each classification against real Spanish from the corpus.
 * -------------------------------------------------------------------------- */

/* saying, showing, arguing */
{ inf:'expresar', en:'to express', type:'ar' },
{ inf:'señalar', en:'to point out', type:'ar' },
{ inf:'indicar', en:'to indicate', type:'ar' },
{ inf:'afirmar', en:'to assert, to state', type:'ar' },
{ inf:'advertir', en:'to warn', type:'ir', stem:'ie' },
{ inf:'anunciar', en:'to announce', type:'ar' },
{ inf:'aclarar', en:'to clarify', type:'ar' },
{ inf:'confirmar', en:'to confirm', type:'ar' },
{ inf:'desmentir', en:'to deny, to refute', type:'ir', stem:'ie' },
{ inf:'negar', en:'to deny', type:'ar', stem:'ie' },
{ inf:'reconocer', en:'to recognise, to admit', type:'er' },
{ inf:'exponer', en:'to set out, to present', type:'er', like:'poner' },
{ inf:'proponer', en:'to propose', type:'er', like:'poner' },
{ inf:'posponer', en:'to postpone', type:'er', like:'poner' },
{ inf:'plantear', en:'to raise, to pose (a question)', type:'ar' },
{ inf:'cuestionar', en:'to question, to call into doubt', type:'ar' },
{ inf:'consultar', en:'to consult', type:'ar' },
{ inf:'resumir', en:'to summarise', type:'ir' },
{ inf:'interpretar', en:'to interpret', type:'ar' },
{ inf:'transmitir', en:'to transmit, to convey', type:'ir' },
{ inf:'difundir', en:'to spread, to broadcast', type:'ir' },
{ inf:'divulgar', en:'to disclose, to popularise', type:'ar' },
{ inf:'publicar', en:'to publish', type:'ar' },
{ inf:'redactar', en:'to draft, to write up', type:'ar' },
{ inf:'narrar', en:'to narrate', type:'ar' },
{ inf:'formular', en:'to formulate', type:'ar' },
{ inf:'articular', en:'to articulate', type:'ar' },
{ inf:'pronunciar', en:'to pronounce', type:'ar' },
{ inf:'gritar', en:'to shout', type:'ar' },
{ inf:'recriminar', en:'to reproach', type:'ar' },
{ inf:'interpelar', en:'to challenge, to question formally', type:'ar' },
{ inf:'reiterar', en:'to reiterate', type:'ar' },
{ inf:'aconsejar', en:'to advise', type:'ar' },
{ inf:'recomendar', en:'to recommend', type:'ar', stem:'ie' },
{ inf:'convencer', en:'to convince', type:'er' },
{ inf:'asegurar', en:'to assure, to ensure', type:'ar' },
{ inf:'garantizar', en:'to guarantee', type:'ar' },
{ inf:'confesar', en:'to confess', type:'ar', stem:'ie' },
{ inf:'ocultar', en:'to hide, to conceal', type:'ar' },
{ inf:'nombrar', en:'to name, to appoint', type:'ar' },
{ inf:'designar', en:'to designate', type:'ar' },
{ inf:'destacar', en:'to stand out, to highlight', type:'ar' },
{ inf:'resaltar', en:'to highlight', type:'ar' },
{ inf:'ilustrar', en:'to illustrate', type:'ar' },
{ inf:'precisar', en:'to specify, to need', type:'ar' },
{ inf:'concretar', en:'to pin down, to finalise', type:'ar' },
{ inf:'explicar', en:'to explain', type:'ar' },
{ inf:'significar', en:'to mean', type:'ar' },
{ inf:'referir', en:'to refer, to recount', type:'ir', stem:'ie' },
{ inf:'prever', en:'to foresee', type:'er', like:'ver' },

/* thinking, judging, deciding */
{ inf:'considerar', en:'to consider', type:'ar' },
{ inf:'valorar', en:'to value, to assess', type:'ar' },
{ inf:'reflexionar', en:'to reflect, to think over', type:'ar' },
{ inf:'dudar', en:'to doubt', type:'ar' },
{ inf:'vacilar', en:'to hesitate, to waver', type:'ar' },
{ inf:'imaginar', en:'to imagine', type:'ar' },
{ inf:'adivinar', en:'to guess', type:'ar' },
{ inf:'inferir', en:'to infer', type:'ir', stem:'ie' },
{ inf:'determinar', en:'to determine', type:'ar' },
{ inf:'diferenciar', en:'to distinguish', type:'ar' },
{ inf:'clasificar', en:'to classify', type:'ar' },
{ inf:'calificar', en:'to describe as, to grade', type:'ar' },
{ inf:'analizar', en:'to analyse', type:'ar' },
{ inf:'investigar', en:'to investigate, to research', type:'ar' },
{ inf:'comprobar', en:'to check, to verify', type:'ar', stem:'ue' },
{ inf:'verificar', en:'to verify', type:'ar' },
{ inf:'revisar', en:'to review, to check over', type:'ar' },
{ inf:'observar', en:'to observe', type:'ar' },
{ inf:'contemplar', en:'to contemplate, to provide for', type:'ar' },
{ inf:'vigilar', en:'to watch over, to monitor', type:'ar' },
{ inf:'atender', en:'to attend to, to serve', type:'er', stem:'ie' },
{ inf:'aprobar', en:'to approve, to pass (an exam)', type:'ar', stem:'ue' },
{ inf:'rechazar', en:'to reject', type:'ar' },
{ inf:'denegar', en:'to refuse, to turn down', type:'ar', stem:'ie' },
{ inf:'autorizar', en:'to authorise', type:'ar' },
{ inf:'seleccionar', en:'to select', type:'ar' },

/* doing, making, achieving */
{ inf:'realizar', en:'to carry out, to make happen', type:'ar' },
{ inf:'efectuar', en:'to carry out', type:'ar', stem:'ú' },
{ inf:'elaborar', en:'to produce, to work out', type:'ar' },
{ inf:'crear', en:'to create', type:'ar' },
{ inf:'formar', en:'to form, to train', type:'ar' },
{ inf:'generar', en:'to generate', type:'ar' },
{ inf:'reproducir', en:'to reproduce', type:'ir', forms:{ preterito:['reproduje','reprodujiste','reprodujo','reprodujimos','reprodujisteis','reprodujeron'] } },
{ inf:'introducir', en:'to introduce, to insert', type:'ir', forms:{ preterito:['introduje','introdujiste','introdujo','introdujimos','introdujisteis','introdujeron'] } },
{ inf:'reducir', en:'to reduce', type:'ir', forms:{ preterito:['reduje','redujiste','redujo','redujimos','redujisteis','redujeron'] } },
{ inf:'establecer', en:'to establish', type:'er' },
{ inf:'constituir', en:'to constitute, to make up', type:'ir' },
{ inf:'contribuir', en:'to contribute', type:'ir' },
{ inf:'incluir', en:'to include', type:'ir' },
{ inf:'concluir', en:'to conclude', type:'ir' },
{ inf:'diluir', en:'to dilute', type:'ir' },
{ inf:'influir', en:'to influence', type:'ir' },
{ inf:'integrar', en:'to integrate, to make up', type:'ar' },
{ inf:'incorporar', en:'to incorporate, to join', type:'ar' },
{ inf:'combinar', en:'to combine', type:'ar' },
{ inf:'intercambiar', en:'to exchange', type:'ar' },
{ inf:'alcanzar', en:'to reach, to attain', type:'ar' },
{ inf:'superar', en:'to overcome, to exceed', type:'ar' },
{ inf:'obtener', en:'to obtain', type:'er', like:'tener' },
{ inf:'mantener', en:'to maintain, to keep', type:'er', like:'tener' },
{ inf:'retener', en:'to retain, to hold back', type:'er', like:'tener' },
{ inf:'conservar', en:'to preserve, to keep', type:'ar' },
{ inf:'recuperar', en:'to recover, to get back', type:'ar' },
{ inf:'devolver', en:'to give back, to return', type:'er', stem:'ue' },
{ inf:'resolver', en:'to resolve, to solve', type:'er', stem:'ue' },
{ inf:'solucionar', en:'to solve', type:'ar' },
{ inf:'arreglar', en:'to fix, to sort out', type:'ar' },
{ inf:'reparar', en:'to repair', type:'ar' },
{ inf:'modificar', en:'to modify', type:'ar' },
{ inf:'convertir', en:'to turn into, to convert', type:'ir', stem:'ie' },
{ inf:'transformar', en:'to transform', type:'ar' },
{ inf:'aplicar', en:'to apply', type:'ar' },
{ inf:'emplear', en:'to use, to employ', type:'ar' },
{ inf:'utilizar', en:'to use', type:'ar' },
{ inf:'aprovechar', en:'to make the most of', type:'ar' },
{ inf:'explotar', en:'to exploit, to explode', type:'ar' },
{ inf:'procesar', en:'to process', type:'ar' },
{ inf:'registrar', en:'to record, to register', type:'ar' },
{ inf:'anotar', en:'to note down', type:'ar' },
{ inf:'almacenar', en:'to store', type:'ar' },
{ inf:'colocar', en:'to place, to put', type:'ar' },
{ inf:'trasladar', en:'to move, to transfer', type:'ar' },
{ inf:'separar', en:'to separate', type:'ar' },
{ inf:'dividir', en:'to divide', type:'ir' },
{ inf:'extraer', en:'to extract', type:'er', like:'traer' },
{ inf:'atraer', en:'to attract', type:'er', like:'traer' },
{ inf:'contraer', en:'to contract', type:'er', like:'traer' },
{ inf:'proyectar', en:'to project, to plan', type:'ar' },
{ inf:'orientar', en:'to orient, to guide', type:'ar' },
{ inf:'facilitar', en:'to make easier, to provide', type:'ar' },
{ inf:'dificultar', en:'to hinder', type:'ar' },
{ inf:'completar', en:'to complete', type:'ar' },
{ inf:'finalizar', en:'to finish, to end', type:'ar' },
{ inf:'acabar', en:'to finish, to end up', type:'ar' },
{ inf:'iniciar', en:'to begin, to initiate', type:'ar' },
{ inf:'intentar', en:'to try', type:'ar' },
{ inf:'tratar', en:'to treat, to deal with, to try to', type:'ar' },
{ inf:'consistir', en:'to consist (of)', type:'ir' },
{ inf:'resultar', en:'to turn out, to prove', type:'ar' },
{ inf:'derivar', en:'to derive, to lead to', type:'ar' },
{ inf:'causar', en:'to cause', type:'ar' },
{ inf:'provocar', en:'to provoke, to bring about', type:'ar' },
{ inf:'afectar', en:'to affect', type:'ar' },
{ inf:'evitar', en:'to avoid', type:'ar' },
{ inf:'eliminar', en:'to eliminate', type:'ar' },
{ inf:'minimizar', en:'to minimise', type:'ar' },
{ inf:'maximizar', en:'to maximise', type:'ar' },
{ inf:'aumentar', en:'to increase', type:'ar' },
{ inf:'incrementar', en:'to increase', type:'ar' },
{ inf:'reforzar', en:'to reinforce', type:'ar', stem:'ue' },
{ inf:'intensificar', en:'to intensify', type:'ar' },
{ inf:'atenuar', en:'to soften, to tone down', type:'ar', stem:'ú' },
{ inf:'aliviar', en:'to relieve, to ease', type:'ar' },
{ inf:'frenar', en:'to brake, to slow down', type:'ar' },
{ inf:'acortar', en:'to shorten', type:'ar' },
{ inf:'retrasar', en:'to delay', type:'ar' },
{ inf:'adelantar', en:'to bring forward, to overtake', type:'ar' },
{ inf:'continuar', en:'to continue', type:'ar', stem:'ú' },
{ inf:'puntuar', en:'to score, to punctuate', type:'ar', stem:'ú' },
{ inf:'generalizar', en:'to generalise', type:'ar' },
{ inf:'identificar', en:'to identify', type:'ar' },
{ inf:'marcar', en:'to mark, to dial', type:'ar' },
{ inf:'mover', en:'to move', type:'er', stem:'ue' },
{ inf:'promover', en:'to promote', type:'er', stem:'ue' },
{ inf:'fomentar', en:'to encourage, to foster', type:'ar' },
{ inf:'estimular', en:'to stimulate', type:'ar' },
{ inf:'compensar', en:'to compensate, to make up for', type:'ar' },
{ inf:'aportar', en:'to contribute, to provide', type:'ar' },
{ inf:'prestar', en:'to lend', type:'ar' },
{ inf:'solicitar', en:'to request, to apply for', type:'ar' },
{ inf:'asumir', en:'to assume, to take on', type:'ir' },
{ inf:'desempeñar', en:'to carry out (a role)', type:'ar' },
{ inf:'ejercer', en:'to exercise, to practise (a profession)', type:'er' },
{ inf:'intervenir', en:'to intervene', type:'ir', like:'venir' },
{ inf:'convenir', en:'to suit, to agree', type:'ir', like:'venir' },
{ inf:'cooperar', en:'to cooperate', type:'ar' },
{ inf:'involucrar', en:'to involve', type:'ar' },
{ inf:'acompañar', en:'to accompany', type:'ar' },
{ inf:'luchar', en:'to fight, to struggle', type:'ar' },
{ inf:'combatir', en:'to combat', type:'ir' },
{ inf:'arriesgar', en:'to risk', type:'ar' },
{ inf:'salvar', en:'to save, to rescue', type:'ar' },
{ inf:'proteger', en:'to protect', type:'er' },
{ inf:'matar', en:'to kill', type:'ar' },
{ inf:'sobrepasar', en:'to exceed, to surpass', type:'ar' },
{ inf:'exceder', en:'to exceed', type:'er' },
{ inf:'acceder', en:'to access, to agree to', type:'er' },
{ inf:'preceder', en:'to precede', type:'er' },
{ inf:'acudir', en:'to go, to turn up, to turn to', type:'ir' },
{ inf:'recurrir', en:'to resort to, to appeal', type:'ir' },
{ inf:'eludir', en:'to evade, to dodge', type:'ir' },
{ inf:'mediar', en:'to mediate', type:'ar' },
{ inf:'cesar', en:'to cease', type:'ar' },
{ inf:'abandonar', en:'to abandon, to leave', type:'ar' },
{ inf:'faltar', en:'to be lacking, to be missing', type:'ar' },
{ inf:'quitar', en:'to take away, to remove', type:'ar' },
{ inf:'cortar', en:'to cut', type:'ar' },
{ inf:'tirar', en:'to throw, to pull', type:'ar' },
{ inf:'guardar', en:'to keep, to put away', type:'ar' },
{ inf:'tapar', en:'to cover', type:'ar' },
{ inf:'manchar', en:'to stain', type:'ar' },
{ inf:'apretar', en:'to press, to squeeze', type:'ar', stem:'ie' },
{ inf:'inclinar', en:'to tilt, to incline', type:'ar' },
{ inf:'girar', en:'to turn, to spin', type:'ar' },
{ inf:'parar', en:'to stop', type:'ar' },
{ inf:'captar', en:'to grasp, to capture', type:'ar' },
{ inf:'recoger', en:'to pick up, to collect', type:'er' },
{ inf:'coger', en:'to take, to catch', type:'er' },
{ inf:'amontonar', en:'to pile up', type:'ar' },
{ inf:'desatar', en:'to untie, to unleash', type:'ar' },
{ inf:'regalar', en:'to give (as a present)', type:'ar' },

/* everyday life, body, home */
{ inf:'visitar', en:'to visit', type:'ar' },
{ inf:'pasear', en:'to go for a walk', type:'ar' },
{ inf:'acampar', en:'to camp', type:'ar' },
{ inf:'veranear', en:'to spend the summer', type:'ar' },
{ inf:'merendar', en:'to have an afternoon snack', type:'ar', stem:'ie' },
{ inf:'fumar', en:'to smoke', type:'ar' },
{ inf:'adelgazar', en:'to lose weight', type:'ar' },
{ inf:'alimentar', en:'to feed, to nourish', type:'ar' },
{ inf:'descongelar', en:'to defrost', type:'ar' },
{ inf:'fregar', en:'to wash up, to scrub', type:'ar', stem:'ie' },
{ inf:'regar', en:'to water', type:'ar', stem:'ie' },
{ inf:'amueblar', en:'to furnish', type:'ar' },
{ inf:'mejorar', en:'to improve', type:'ar' },
{ inf:'entrenar', en:'to train', type:'ar' },
{ inf:'enseñar', en:'to teach, to show', type:'ar' },
{ inf:'nacer', en:'to be born', type:'er' },
{ inf:'crecer', en:'to grow, to grow up', type:'er' },
{ inf:'llover', en:'to rain', type:'er', stem:'ue' },
{ inf:'oscurecer', en:'to darken, to get dark', type:'er' },
{ inf:'aparecer', en:'to appear', type:'er' },
{ inf:'sonar', en:'to sound, to ring', type:'ar', stem:'ue' },
{ inf:'reaccionar', en:'to react', type:'ar' },
{ inf:'funcionar', en:'to work, to function', type:'ar' },
{ inf:'cobrar', en:'to charge, to get paid', type:'ar' },
{ inf:'bajar', en:'to go down, to lower', type:'ar' },
{ inf:'concertar', en:'to arrange, to set up', type:'ar', stem:'ie' },
{ inf:'presentar', en:'to present, to introduce', type:'ar' },
{ inf:'favorecer', en:'to favour, to suit', type:'er' },
{ inf:'enriquecer', en:'to enrich', type:'er' },
{ inf:'centrar', en:'to centre, to focus', type:'ar' },
{ inf:'destinar', en:'to allocate, to assign', type:'ar' },
{ inf:'emitir', en:'to broadcast, to issue', type:'ir' },
{ inf:'protagonizar', en:'to star in, to be at the centre of', type:'ar' },
{ inf:'neutralizar', en:'to neutralise', type:'ar' },
{ inf:'mitigar', en:'to mitigate', type:'ar' },
{ inf:'aparentar', en:'to appear, to feign', type:'ar' },
{ inf:'afianzar', en:'to consolidate, to strengthen', type:'ar' },
{ inf:'practicar', en:'to practise', type:'ar' },
{ inf:'doler', en:'to hurt', type:'er', stem:'ue' },
{ inf:'encantar', en:'to love, to delight', type:'ar' },
{ inf:'suspender', en:'to fail (an exam), to suspend', type:'er' },
{ inf:'contestar', en:'to answer', type:'ar' },
{ inf:'repasar', en:'to revise, to go over', type:'ar' },
{ inf:'navegar', en:'to sail, to browse', type:'ar' },
{ inf:'montar', en:'to ride, to assemble', type:'ar' },
{ inf:'pintar', en:'to paint', type:'ar' }

];
