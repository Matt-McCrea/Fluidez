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
  presubj:['valga','valgas','valga','valgamos','valgáis','valgan'] } }
];
