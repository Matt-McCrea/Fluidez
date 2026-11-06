"use strict";
var LIB = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key3, value) => key3 in obj ? __defProp(obj, key3, { enumerable: true, configurable: true, writable: true, value }) : obj[key3] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key3 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key3) && key3 !== except)
          __defProp(to, key3, { get: () => from[key3], enumerable: !(desc = __getOwnPropDesc(from, key3)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key3, value) => __defNormalProp(obj, typeof key3 !== "symbol" ? key3 + "" : key3, value);

  // lib/index.ts
  var index_exports = {};
  __export(index_exports, {
    engine: () => engine,
    fsrs: () => fsrs2,
    gloss: () => gloss,
    graph: () => graph,
    match: () => match,
    search: () => search,
    tagger: () => tagger
  });

  // lib/engine/index.ts
  var engine_exports = {};
  __export(engine_exports, {
    COMPOUND_OF_HABER: () => COMPOUND_OF_HABER,
    COMPOUND_TENSES: () => COMPOUND_TENSES,
    END: () => END,
    ENDING_TENSES: () => ENDING_TENSES,
    IMP_PERSONS: () => IMP_PERSONS,
    MODEL_VERBS: () => MODEL_VERBS,
    PERSONS: () => PERSONS,
    PRODUCTION_IMP_PERSONS: () => PRODUCTION_IMP_PERSONS,
    PRODUCTION_PERSONS: () => PRODUCTION_PERSONS,
    TENSES: () => TENSES,
    TENSE_LABEL: () => TENSE_LABEL,
    VERBS: () => VERBS,
    acceptedForms: () => acceptedForms,
    analyzeSentence: () => analyzeSentence,
    analyzeToken: () => analyzeToken,
    attachEnclitic: () => attachEnclitic,
    conjugate: () => conjugate,
    conjugateCells: () => conjugateCells,
    deaccent: () => deaccent,
    enPhrase: () => enPhrase,
    endingsFor: () => endingsFor,
    gerund: () => gerund,
    haberAnalyses: () => haberAnalyses,
    isCompound: () => isCompound,
    isIrregular: () => isIrregular,
    isIrregularIn: () => isIrregularIn,
    isParticiple: () => isParticiple,
    isRecognitionOnly: () => isRecognitionOnly,
    isReflexive: () => isReflexive,
    legacySpellings: () => legacySpellings,
    normalize: () => normalize,
    participle: () => participle,
    participles: () => participles,
    participlesOf: () => participlesOf,
    personsFor: () => personsFor,
    reflexiveBase: () => reflexiveBase,
    tokenize: () => tokenize,
    verbByInf: () => verbByInf,
    voseoForms: () => voseoForms,
    vowelOf: () => vowelOf
  });

  // lib/engine/verbs.json
  var verbs_default = [
    { inf: "ser", en: "to be (essence)", type: "er", ger: "siendo", forms: { presente: ["soy", "eres", "es", "somos", "sois", "son"], preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"], imperfecto: ["era", "eras", "era", "\xE9ramos", "erais", "eran"], presubj: ["sea", "seas", "sea", "seamos", "se\xE1is", "sean"] }, tuCmd: "s\xE9" },
    { inf: "estar", en: "to be (state)", type: "ar", forms: { presente: ["estoy", "est\xE1s", "est\xE1", "estamos", "est\xE1is", "est\xE1n"], preterito: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"], presubj: ["est\xE9", "est\xE9s", "est\xE9", "estemos", "est\xE9is", "est\xE9n"] } },
    { inf: "haber", en: "to have (auxiliary)", type: "er", forms: { presente: ["he", "has", "ha", "hemos", "hab\xE9is", "han"], preterito: ["hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron"], futuro: ["habr\xE9", "habr\xE1s", "habr\xE1", "habremos", "habr\xE9is", "habr\xE1n"], condicional: ["habr\xEDa", "habr\xEDas", "habr\xEDa", "habr\xEDamos", "habr\xEDais", "habr\xEDan"], presubj: ["haya", "hayas", "haya", "hayamos", "hay\xE1is", "hayan"] } },
    { inf: "tener", en: "to have", type: "er", forms: { presente: ["tengo", "tienes", "tiene", "tenemos", "ten\xE9is", "tienen"], preterito: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"], futuro: ["tendr\xE9", "tendr\xE1s", "tendr\xE1", "tendremos", "tendr\xE9is", "tendr\xE1n"], condicional: ["tendr\xEDa", "tendr\xEDas", "tendr\xEDa", "tendr\xEDamos", "tendr\xEDais", "tendr\xEDan"], presubj: ["tenga", "tengas", "tenga", "tengamos", "teng\xE1is", "tengan"] }, tuCmd: "ten" },
    { inf: "hacer", en: "to do / to make", type: "er", part: "hecho", forms: { presente: ["hago", "haces", "hace", "hacemos", "hac\xE9is", "hacen"], preterito: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"], futuro: ["har\xE9", "har\xE1s", "har\xE1", "haremos", "har\xE9is", "har\xE1n"], condicional: ["har\xEDa", "har\xEDas", "har\xEDa", "har\xEDamos", "har\xEDais", "har\xEDan"], presubj: ["haga", "hagas", "haga", "hagamos", "hag\xE1is", "hagan"] }, tuCmd: "haz" },
    { inf: "ir", en: "to go", type: "ir", ger: "yendo", forms: { presente: ["voy", "vas", "va", "vamos", "vais", "van"], preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"], imperfecto: ["iba", "ibas", "iba", "\xEDbamos", "ibais", "iban"], presubj: ["vaya", "vayas", "vaya", "vayamos", "vay\xE1is", "vayan"] }, tuCmd: "ve", nosCmd: "vamos" },
    { inf: "poder", en: "to be able / can", type: "er", ger: "pudiendo", forms: { presente: ["puedo", "puedes", "puede", "podemos", "pod\xE9is", "pueden"], preterito: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"], futuro: ["podr\xE9", "podr\xE1s", "podr\xE1", "podremos", "podr\xE9is", "podr\xE1n"], condicional: ["podr\xEDa", "podr\xEDas", "podr\xEDa", "podr\xEDamos", "podr\xEDais", "podr\xEDan"], presubj: ["pueda", "puedas", "pueda", "podamos", "pod\xE1is", "puedan"] } },
    { inf: "decir", en: "to say / to tell", type: "ir", part: "dicho", ger: "diciendo", forms: { presente: ["digo", "dices", "dice", "decimos", "dec\xEDs", "dicen"], preterito: ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"], futuro: ["dir\xE9", "dir\xE1s", "dir\xE1", "diremos", "dir\xE9is", "dir\xE1n"], condicional: ["dir\xEDa", "dir\xEDas", "dir\xEDa", "dir\xEDamos", "dir\xEDais", "dir\xEDan"], presubj: ["diga", "digas", "diga", "digamos", "dig\xE1is", "digan"] }, tuCmd: "di" },
    { inf: "ver", en: "to see", type: "er", part: "visto", forms: { presente: ["veo", "ves", "ve", "vemos", "veis", "ven"], preterito: ["vi", "viste", "vio", "vimos", "visteis", "vieron"], imperfecto: ["ve\xEDa", "ve\xEDas", "ve\xEDa", "ve\xEDamos", "ve\xEDais", "ve\xEDan"], presubj: ["vea", "veas", "vea", "veamos", "ve\xE1is", "vean"] } },
    { inf: "dar", en: "to give", type: "ar", forms: { presente: ["doy", "das", "da", "damos", "dais", "dan"], preterito: ["di", "diste", "dio", "dimos", "disteis", "dieron"], presubj: ["d\xE9", "des", "d\xE9", "demos", "deis", "den"] } },
    { inf: "saber", en: "to know (facts)", type: "er", forms: { presente: ["s\xE9", "sabes", "sabe", "sabemos", "sab\xE9is", "saben"], preterito: ["supe", "supiste", "supo", "supimos", "supisteis", "supieron"], futuro: ["sabr\xE9", "sabr\xE1s", "sabr\xE1", "sabremos", "sabr\xE9is", "sabr\xE1n"], condicional: ["sabr\xEDa", "sabr\xEDas", "sabr\xEDa", "sabr\xEDamos", "sabr\xEDais", "sabr\xEDan"], presubj: ["sepa", "sepas", "sepa", "sepamos", "sep\xE1is", "sepan"] } },
    { inf: "querer", en: "to want / to love", type: "er", ger: "queriendo", forms: { presente: ["quiero", "quieres", "quiere", "queremos", "quer\xE9is", "quieren"], preterito: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"], futuro: ["querr\xE9", "querr\xE1s", "querr\xE1", "querremos", "querr\xE9is", "querr\xE1n"], condicional: ["querr\xEDa", "querr\xEDas", "querr\xEDa", "querr\xEDamos", "querr\xEDais", "querr\xEDan"], presubj: ["quiera", "quieras", "quiera", "queramos", "quer\xE1is", "quieran"] } },
    { inf: "poner", en: "to put / to place", type: "er", part: "puesto", forms: { presente: ["pongo", "pones", "pone", "ponemos", "pon\xE9is", "ponen"], preterito: ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"], futuro: ["pondr\xE9", "pondr\xE1s", "pondr\xE1", "pondremos", "pondr\xE9is", "pondr\xE1n"], condicional: ["pondr\xEDa", "pondr\xEDas", "pondr\xEDa", "pondr\xEDamos", "pondr\xEDais", "pondr\xEDan"], presubj: ["ponga", "pongas", "ponga", "pongamos", "pong\xE1is", "pongan"] }, tuCmd: "pon" },
    { inf: "venir", en: "to come", type: "ir", ger: "viniendo", forms: { presente: ["vengo", "vienes", "viene", "venimos", "ven\xEDs", "vienen"], preterito: ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"], futuro: ["vendr\xE9", "vendr\xE1s", "vendr\xE1", "vendremos", "vendr\xE9is", "vendr\xE1n"], condicional: ["vendr\xEDa", "vendr\xEDas", "vendr\xEDa", "vendr\xEDamos", "vendr\xEDais", "vendr\xEDan"], presubj: ["venga", "vengas", "venga", "vengamos", "veng\xE1is", "vengan"] }, tuCmd: "ven" },
    { inf: "salir", en: "to leave / to go out", type: "ir", forms: { presente: ["salgo", "sales", "sale", "salimos", "sal\xEDs", "salen"], futuro: ["saldr\xE9", "saldr\xE1s", "saldr\xE1", "saldremos", "saldr\xE9is", "saldr\xE1n"], condicional: ["saldr\xEDa", "saldr\xEDas", "saldr\xEDa", "saldr\xEDamos", "saldr\xEDais", "saldr\xEDan"], presubj: ["salga", "salgas", "salga", "salgamos", "salg\xE1is", "salgan"] }, tuCmd: "sal" },
    { inf: "traer", en: "to bring", type: "er", part: "tra\xEDdo", ger: "trayendo", forms: { presente: ["traigo", "traes", "trae", "traemos", "tra\xE9is", "traen"], preterito: ["traje", "trajiste", "trajo", "trajimos", "trajisteis", "trajeron"], presubj: ["traiga", "traigas", "traiga", "traigamos", "traig\xE1is", "traigan"] } },
    { inf: "caer", en: "to fall", type: "er", part: "ca\xEDdo", ger: "cayendo", forms: { presente: ["caigo", "caes", "cae", "caemos", "ca\xE9is", "caen"], preterito: ["ca\xED", "ca\xEDste", "cay\xF3", "ca\xEDmos", "ca\xEDsteis", "cayeron"], presubj: ["caiga", "caigas", "caiga", "caigamos", "caig\xE1is", "caigan"] } },
    { inf: "o\xEDr", en: "to hear", type: "ir", part: "o\xEDdo", ger: "oyendo", forms: { presente: ["oigo", "oyes", "oye", "o\xEDmos", "o\xEDs", "oyen"], preterito: ["o\xED", "o\xEDste", "oy\xF3", "o\xEDmos", "o\xEDsteis", "oyeron"], presubj: ["oiga", "oigas", "oiga", "oigamos", "oig\xE1is", "oigan"] } },
    { inf: "dormir", en: "to sleep", type: "ir", ger: "durmiendo", forms: { presente: ["duermo", "duermes", "duerme", "dormimos", "dorm\xEDs", "duermen"], preterito: ["dorm\xED", "dormiste", "durmi\xF3", "dormimos", "dormisteis", "durmieron"], presubj: ["duerma", "duermas", "duerma", "durmamos", "durm\xE1is", "duerman"] } },
    { inf: "morir", en: "to die", type: "ir", part: "muerto", ger: "muriendo", forms: { presente: ["muero", "mueres", "muere", "morimos", "mor\xEDs", "mueren"], preterito: ["mor\xED", "moriste", "muri\xF3", "morimos", "moristeis", "murieron"], presubj: ["muera", "mueras", "muera", "muramos", "mur\xE1is", "mueran"] } },
    { inf: "pedir", en: "to ask for / to request", type: "ir", ger: "pidiendo", forms: { presente: ["pido", "pides", "pide", "pedimos", "ped\xEDs", "piden"], preterito: ["ped\xED", "pediste", "pidi\xF3", "pedimos", "pedisteis", "pidieron"], presubj: ["pida", "pidas", "pida", "pidamos", "pid\xE1is", "pidan"] } },
    { inf: "servir", en: "to serve", type: "ir", ger: "sirviendo", forms: { presente: ["sirvo", "sirves", "sirve", "servimos", "serv\xEDs", "sirven"], preterito: ["serv\xED", "serviste", "sirvi\xF3", "servimos", "servisteis", "sirvieron"], presubj: ["sirva", "sirvas", "sirva", "sirvamos", "sirv\xE1is", "sirvan"] } },
    { inf: "sentir", en: "to feel / to regret", type: "ir", ger: "sintiendo", forms: { presente: ["siento", "sientes", "siente", "sentimos", "sent\xEDs", "sienten"], preterito: ["sent\xED", "sentiste", "sinti\xF3", "sentimos", "sentisteis", "sintieron"], presubj: ["sienta", "sientas", "sienta", "sintamos", "sint\xE1is", "sientan"] } },
    { inf: "preferir", en: "to prefer", type: "ir", ger: "prefiriendo", forms: { presente: ["prefiero", "prefieres", "prefiere", "preferimos", "prefer\xEDs", "prefieren"], preterito: ["prefer\xED", "preferiste", "prefiri\xF3", "preferimos", "preferisteis", "prefirieron"], presubj: ["prefiera", "prefieras", "prefiera", "prefiramos", "prefir\xE1is", "prefieran"] } },
    { inf: "repetir", en: "to repeat", type: "ir", ger: "repitiendo", forms: { presente: ["repito", "repites", "repite", "repetimos", "repet\xEDs", "repiten"], preterito: ["repet\xED", "repetiste", "repiti\xF3", "repetimos", "repetisteis", "repitieron"], presubj: ["repita", "repitas", "repita", "repitamos", "repit\xE1is", "repitan"] } },
    { inf: "seguir", en: "to follow / to continue", type: "ir", ger: "siguiendo", forms: { presente: ["sigo", "sigues", "sigue", "seguimos", "segu\xEDs", "siguen"], preterito: ["segu\xED", "seguiste", "sigui\xF3", "seguimos", "seguisteis", "siguieron"], presubj: ["siga", "sigas", "siga", "sigamos", "sig\xE1is", "sigan"] } },
    { inf: "conseguir", en: "to obtain / to manage to", type: "ir", ger: "consiguiendo", forms: { presente: ["consigo", "consigues", "consigue", "conseguimos", "consegu\xEDs", "consiguen"], preterito: ["consegu\xED", "conseguiste", "consigui\xF3", "conseguimos", "conseguisteis", "consiguieron"], presubj: ["consiga", "consigas", "consiga", "consigamos", "consig\xE1is", "consigan"] } },
    { inf: "re\xEDr", en: "to laugh", type: "ir", part: "re\xEDdo", ger: "riendo", forms: { presente: ["r\xEDo", "r\xEDes", "r\xEDe", "re\xEDmos", "re\xEDs", "r\xEDen"], preterito: ["re\xED", "re\xEDste", "ri\xF3", "re\xEDmos", "re\xEDsteis", "rieron"], presubj: ["r\xEDa", "r\xEDas", "r\xEDa", "riamos", "ri\xE1is", "r\xEDan"] } },
    { inf: "creer", en: "to believe / to think", type: "er", part: "cre\xEDdo", ger: "creyendo", forms: { preterito: ["cre\xED", "cre\xEDste", "crey\xF3", "cre\xEDmos", "cre\xEDsteis", "creyeron"] } },
    { inf: "leer", en: "to read", type: "er", part: "le\xEDdo", ger: "leyendo", forms: { preterito: ["le\xED", "le\xEDste", "ley\xF3", "le\xEDmos", "le\xEDsteis", "leyeron"] } },
    { inf: "construir", en: "to build", type: "ir", ger: "construyendo", forms: { presente: ["construyo", "construyes", "construye", "construimos", "constru\xEDs", "construyen"], preterito: ["constru\xED", "construiste", "construy\xF3", "construimos", "construisteis", "construyeron"], presubj: ["construya", "construyas", "construya", "construyamos", "construy\xE1is", "construyan"] } },
    { inf: "conocer", en: "to know (people/places)", type: "er", forms: { presente: ["conozco", "conoces", "conoce", "conocemos", "conoc\xE9is", "conocen"], presubj: ["conozca", "conozcas", "conozca", "conozcamos", "conozc\xE1is", "conozcan"] } },
    { inf: "parecer", en: "to seem / to appear", type: "er", forms: { presente: ["parezco", "pareces", "parece", "parecemos", "parec\xE9is", "parecen"], presubj: ["parezca", "parezcas", "parezca", "parezcamos", "parezc\xE1is", "parezcan"] } },
    { inf: "conducir", en: "to drive", type: "ir", forms: { presente: ["conduzco", "conduces", "conduce", "conducimos", "conduc\xEDs", "conducen"], preterito: ["conduje", "condujiste", "condujo", "condujimos", "condujisteis", "condujeron"], presubj: ["conduzca", "conduzcas", "conduzca", "conduzcamos", "conduzc\xE1is", "conduzcan"] } },
    { inf: "producir", en: "to produce", type: "ir", forms: { presente: ["produzco", "produces", "produce", "producimos", "produc\xEDs", "producen"], preterito: ["produje", "produjiste", "produjo", "produjimos", "produjisteis", "produjeron"], presubj: ["produzca", "produzcas", "produzca", "produzcamos", "produzc\xE1is", "produzcan"] } },
    { inf: "traducir", en: "to translate", type: "ir", forms: { presente: ["traduzco", "traduces", "traduce", "traducimos", "traduc\xEDs", "traducen"], preterito: ["traduje", "tradujiste", "tradujo", "tradujimos", "tradujisteis", "tradujeron"], presubj: ["traduzca", "traduzcas", "traduzca", "traduzcamos", "traduzc\xE1is", "traduzcan"] } },
    { inf: "pensar", en: "to think", type: "ar", forms: { presente: ["pienso", "piensas", "piensa", "pensamos", "pens\xE1is", "piensan"], presubj: ["piense", "pienses", "piense", "pensemos", "pens\xE9is", "piensen"] } },
    { inf: "empezar", en: "to begin", type: "ar", forms: { presente: ["empiezo", "empiezas", "empieza", "empezamos", "empez\xE1is", "empiezan"], preterito: ["empec\xE9", "empezaste", "empez\xF3", "empezamos", "empezasteis", "empezaron"], presubj: ["empiece", "empieces", "empiece", "empecemos", "empec\xE9is", "empiecen"] } },
    { inf: "comenzar", en: "to start", type: "ar", forms: { presente: ["comienzo", "comienzas", "comienza", "comenzamos", "comenz\xE1is", "comienzan"], preterito: ["comenc\xE9", "comenzaste", "comenz\xF3", "comenzamos", "comenzasteis", "comenzaron"], presubj: ["comience", "comiences", "comience", "comencemos", "comenc\xE9is", "comiencen"] } },
    { inf: "cerrar", en: "to close", type: "ar", forms: { presente: ["cierro", "cierras", "cierra", "cerramos", "cerr\xE1is", "cierran"], presubj: ["cierre", "cierres", "cierre", "cerremos", "cerr\xE9is", "cierren"] } },
    { inf: "entender", en: "to understand", type: "er", forms: { presente: ["entiendo", "entiendes", "entiende", "entendemos", "entend\xE9is", "entienden"], presubj: ["entienda", "entiendas", "entienda", "entendamos", "entend\xE1is", "entiendan"] } },
    { inf: "perder", en: "to lose", type: "er", forms: { presente: ["pierdo", "pierdes", "pierde", "perdemos", "perd\xE9is", "pierden"], presubj: ["pierda", "pierdas", "pierda", "perdamos", "perd\xE1is", "pierdan"] } },
    { inf: "volver", en: "to return / to come back", type: "er", part: "vuelto", forms: { presente: ["vuelvo", "vuelves", "vuelve", "volvemos", "volv\xE9is", "vuelven"], presubj: ["vuelva", "vuelvas", "vuelva", "volvamos", "volv\xE1is", "vuelvan"] } },
    { inf: "volverse", en: "to become, to turn (change of state)", type: "er", part: "vuelto", forms: { presente: ["vuelvo", "vuelves", "vuelve", "volvemos", "volv\xE9is", "vuelven"], presubj: ["vuelva", "vuelvas", "vuelva", "volvamos", "volv\xE1is", "vuelvan"] } },
    { inf: "encontrar", en: "to find", type: "ar", forms: { presente: ["encuentro", "encuentras", "encuentra", "encontramos", "encontr\xE1is", "encuentran"], presubj: ["encuentre", "encuentres", "encuentre", "encontremos", "encontr\xE9is", "encuentren"] } },
    { inf: "contar", en: "to count / to tell", type: "ar", forms: { presente: ["cuento", "cuentas", "cuenta", "contamos", "cont\xE1is", "cuentan"], presubj: ["cuente", "cuentes", "cuente", "contemos", "cont\xE9is", "cuenten"] } },
    { inf: "recordar", en: "to remember", type: "ar", forms: { presente: ["recuerdo", "recuerdas", "recuerda", "recordamos", "record\xE1is", "recuerdan"], presubj: ["recuerde", "recuerdes", "recuerde", "recordemos", "record\xE9is", "recuerden"] } },
    { inf: "mostrar", en: "to show", type: "ar", forms: { presente: ["muestro", "muestras", "muestra", "mostramos", "mostr\xE1is", "muestran"], presubj: ["muestre", "muestres", "muestre", "mostremos", "mostr\xE9is", "muestren"] } },
    { inf: "costar", en: "to cost", type: "ar", forms: { presente: ["cuesto", "cuestas", "cuesta", "costamos", "cost\xE1is", "cuestan"], presubj: ["cueste", "cuestes", "cueste", "costemos", "cost\xE9is", "cuesten"] } },
    { inf: "jugar", en: "to play", type: "ar", forms: { presente: ["juego", "juegas", "juega", "jugamos", "jug\xE1is", "juegan"], preterito: ["jugu\xE9", "jugaste", "jug\xF3", "jugamos", "jugasteis", "jugaron"], presubj: ["juegue", "juegues", "juegue", "juguemos", "jugu\xE9is", "jueguen"] } },
    { inf: "sentar", en: "to seat / to sit", type: "ar", forms: { presente: ["siento", "sientas", "sienta", "sentamos", "sent\xE1is", "sientan"], presubj: ["siente", "sientes", "siente", "sentemos", "sent\xE9is", "sienten"] } },
    { inf: "buscar", en: "to look for", type: "ar", forms: { preterito: ["busqu\xE9", "buscaste", "busc\xF3", "buscamos", "buscasteis", "buscaron"], presubj: ["busque", "busques", "busque", "busquemos", "busqu\xE9is", "busquen"] } },
    { inf: "llegar", en: "to arrive", type: "ar", forms: { preterito: ["llegu\xE9", "llegaste", "lleg\xF3", "llegamos", "llegasteis", "llegaron"], presubj: ["llegue", "llegues", "llegue", "lleguemos", "llegu\xE9is", "lleguen"] } },
    { inf: "pagar", en: "to pay", type: "ar", forms: { preterito: ["pagu\xE9", "pagaste", "pag\xF3", "pagamos", "pagasteis", "pagaron"], presubj: ["pague", "pagues", "pague", "paguemos", "pagu\xE9is", "paguen"] } },
    { inf: "sacar", en: "to take out", type: "ar", forms: { preterito: ["saqu\xE9", "sacaste", "sac\xF3", "sacamos", "sacasteis", "sacaron"], presubj: ["saque", "saques", "saque", "saquemos", "saqu\xE9is", "saquen"] } },
    { inf: "tocar", en: "to touch / to play (instrument)", type: "ar", forms: { preterito: ["toqu\xE9", "tocaste", "toc\xF3", "tocamos", "tocasteis", "tocaron"], presubj: ["toque", "toques", "toque", "toquemos", "toqu\xE9is", "toquen"] } },
    { inf: "escribir", en: "to write", type: "ir", part: "escrito" },
    { inf: "abrir", en: "to open", type: "ir", part: "abierto" },
    { inf: "romper", en: "to break", type: "er", part: "roto" },
    { inf: "cubrir", en: "to cover", type: "ir", part: "cubierto" },
    { inf: "descubrir", en: "to discover", type: "ir", part: "descubierto" },
    { inf: "hablar", en: "to speak / to talk", type: "ar" },
    { inf: "llamar", en: "to call", type: "ar" },
    { inf: "llevar", en: "to carry / to wear", type: "ar" },
    { inf: "dejar", en: "to leave / to let", type: "ar" },
    { inf: "pasar", en: "to pass / to happen", type: "ar" },
    { inf: "quedar", en: "to stay / to remain", type: "ar" },
    { inf: "esperar", en: "to wait / to hope", type: "ar" },
    { inf: "trabajar", en: "to work", type: "ar" },
    { inf: "necesitar", en: "to need", type: "ar" },
    { inf: "entrar", en: "to enter", type: "ar" },
    { inf: "mirar", en: "to look / to watch", type: "ar" },
    { inf: "usar", en: "to use", type: "ar" },
    { inf: "ayudar", en: "to help", type: "ar" },
    { inf: "gustar", en: "to be pleasing / to like", type: "ar" },
    { inf: "tomar", en: "to take / to drink", type: "ar" },
    { inf: "estudiar", en: "to study", type: "ar" },
    { inf: "comprar", en: "to buy", type: "ar" },
    { inf: "cambiar", en: "to change", type: "ar" },
    { inf: "terminar", en: "to finish / to end", type: "ar" },
    { inf: "preguntar", en: "to ask (a question)", type: "ar" },
    { inf: "ganar", en: "to win / to earn", type: "ar" },
    { inf: "viajar", en: "to travel", type: "ar" },
    { inf: "cocinar", en: "to cook", type: "ar" },
    { inf: "cantar", en: "to sing", type: "ar" },
    { inf: "bailar", en: "to dance", type: "ar" },
    { inf: "caminar", en: "to walk", type: "ar" },
    { inf: "comer", en: "to eat", type: "er" },
    { inf: "beber", en: "to drink", type: "er" },
    { inf: "aprender", en: "to learn", type: "er" },
    { inf: "comprender", en: "to understand", type: "er" },
    { inf: "deber", en: "to owe / ought to", type: "er" },
    { inf: "correr", en: "to run", type: "er" },
    { inf: "vender", en: "to sell", type: "er" },
    { inf: "responder", en: "to answer / to respond", type: "er" },
    { inf: "meter", en: "to put in", type: "er" },
    { inf: "vivir", en: "to live", type: "ir" },
    { inf: "recibir", en: "to receive", type: "ir" },
    { inf: "decidir", en: "to decide", type: "ir" },
    { inf: "permitir", en: "to permit / to allow", type: "ir" },
    { inf: "subir", en: "to go up / to raise", type: "ir" },
    { inf: "existir", en: "to exist", type: "ir" },
    { inf: "ocurrir", en: "to occur / to happen", type: "ir" },
    { inf: "partir", en: "to leave / to divide", type: "ir" },
    { inf: "desayunar", en: "to have breakfast", type: "ar" },
    { inf: "cenar", en: "to have dinner", type: "ar" },
    { inf: "preparar", en: "to prepare", type: "ar" },
    { inf: "invitar", en: "to invite", type: "ar" },
    { inf: "saludar", en: "to greet", type: "ar" },
    { inf: "olvidar", en: "to forget", type: "ar" },
    { inf: "disfrutar", en: "to enjoy", type: "ar" },
    { inf: "regresar", en: "to return / to go back", type: "ar" },
    { inf: "dibujar", en: "to draw", type: "ar" },
    { inf: "nadar", en: "to swim", type: "ar" },
    { inf: "lavar", en: "to wash", type: "ar" },
    { inf: "firmar", en: "to sign", type: "ar" },
    { inf: "lograr", en: "to achieve / to manage to", type: "ar" },
    { inf: "limpiar", en: "to clean", type: "ar" },
    { inf: "participar", en: "to participate", type: "ar" },
    { inf: "depender", en: "to depend", type: "er" },
    { inf: "prometer", en: "to promise", type: "er" },
    { inf: "sorprender", en: "to surprise", type: "er" },
    { inf: "suceder", en: "to happen", type: "er" },
    { inf: "esconder", en: "to hide", type: "er" },
    { inf: "asistir", en: "to attend", type: "ir" },
    { inf: "discutir", en: "to argue / to discuss", type: "ir" },
    { inf: "insistir", en: "to insist", type: "ir" },
    { inf: "resistir", en: "to resist", type: "ir" },
    { inf: "compartir", en: "to share", type: "ir" },
    { inf: "cumplir", en: "to fulfill / to turn (an age)", type: "ir" },
    { inf: "a\xF1adir", en: "to add", type: "ir" },
    { inf: "admitir", en: "to admit", type: "ir" },
    { inf: "definir", en: "to define", type: "ir" },
    { inf: "sufrir", en: "to suffer", type: "ir" },
    { inf: "escuchar", en: "to listen (to)", type: "ar" },
    { inf: "mandar", en: "to send / to order", type: "ar" },
    { inf: "organizar", en: "to organize", type: "ar" },
    { inf: "planear", en: "to plan", type: "ar" },
    { inf: "ahorrar", en: "to save (money)", type: "ar" },
    { inf: "gastar", en: "to spend (money)", type: "ar" },
    { inf: "alquilar", en: "to rent", type: "ar" },
    { inf: "reservar", en: "to reserve / to book", type: "ar" },
    { inf: "contratar", en: "to hire", type: "ar" },
    { inf: "negociar", en: "to negotiate", type: "ar" },
    { inf: "gestionar", en: "to manage / to handle", type: "ar" },
    { inf: "administrar", en: "to administer / to manage", type: "ar" },
    { inf: "actualizar", en: "to update", type: "ar" },
    { inf: "instalar", en: "to install", type: "ar" },
    { inf: "configurar", en: "to configure / to set up", type: "ar" },
    { inf: "conectar", en: "to connect", type: "ar" },
    { inf: "reciclar", en: "to recycle", type: "ar" },
    { inf: "descansar", en: "to rest", type: "ar" },
    { inf: "respirar", en: "to breathe", type: "ar" },
    { inf: "curar", en: "to cure / to heal", type: "ar" },
    { inf: "operar", en: "to operate", type: "ar" },
    { inf: "vacunar", en: "to vaccinate", type: "ar" },
    { inf: "programar", en: "to program / to schedule", type: "ar" },
    { inf: "dise\xF1ar", en: "to design", type: "ar" },
    { inf: "desarrollar", en: "to develop", type: "ar" },
    { inf: "reclamar", en: "to claim / to complain", type: "ar" },
    { inf: "votar", en: "to vote", type: "ar" },
    { inf: "opinar", en: "to think / to give an opinion", type: "ar" },
    { inf: "protestar", en: "to protest", type: "ar" },
    { inf: "contaminar", en: "to pollute", type: "ar" },
    { inf: "llorar", en: "to cry", type: "ar" },
    { inf: "debatir", en: "to debate", type: "ir" },
    { inf: "descargar", en: "to download", type: "ar", forms: { preterito: ["descargu\xE9", "descargaste", "descarg\xF3", "descargamos", "descargasteis", "descargaron"], presubj: ["descargue", "descargues", "descargue", "descarguemos", "descargu\xE9is", "descarguen"] } },
    { inf: "apagar", en: "to turn off", type: "ar", forms: { preterito: ["apagu\xE9", "apagaste", "apag\xF3", "apagamos", "apagasteis", "apagaron"], presubj: ["apague", "apagues", "apague", "apaguemos", "apagu\xE9is", "apaguen"] } },
    { inf: "cargar", en: "to charge / to load", type: "ar", forms: { preterito: ["cargu\xE9", "cargaste", "carg\xF3", "cargamos", "cargasteis", "cargaron"], presubj: ["cargue", "cargues", "cargue", "carguemos", "cargu\xE9is", "carguen"] } },
    { inf: "madrugar", en: "to get up early", type: "ar", forms: { preterito: ["madrugu\xE9", "madrugaste", "madrug\xF3", "madrugamos", "madrugasteis", "madrugaron"], presubj: ["madrugue", "madrugues", "madrugue", "madruguemos", "madrugu\xE9is", "madruguen"] } },
    { inf: "calentar", en: "to heat / to warm up", type: "ar", forms: { presente: ["caliento", "calientas", "calienta", "calentamos", "calent\xE1is", "calientan"], presubj: ["caliente", "calientes", "caliente", "calentemos", "calent\xE9is", "calienten"] } },
    { inf: "encender", en: "to turn on / to light", type: "er", forms: { presente: ["enciendo", "enciendes", "enciende", "encendemos", "encend\xE9is", "encienden"], presubj: ["encienda", "enciendas", "encienda", "encendamos", "encend\xE1is", "enciendan"] } },
    { inf: "invertir", en: "to invest", type: "ir", ger: "invirtiendo", forms: { presente: ["invierto", "inviertes", "invierte", "invertimos", "invert\xEDs", "invierten"], preterito: ["invert\xED", "invertiste", "invirti\xF3", "invertimos", "invertisteis", "invirtieron"], presubj: ["invierta", "inviertas", "invierta", "invirtamos", "invirt\xE1is", "inviertan"] } },
    { inf: "despedir", en: "to fire / to dismiss", type: "ir", ger: "despidiendo", forms: { presente: ["despido", "despides", "despide", "despedimos", "desped\xEDs", "despiden"], preterito: ["desped\xED", "despediste", "despidi\xF3", "despedimos", "despedisteis", "despidieron"], presubj: ["despida", "despidas", "despida", "despidamos", "despid\xE1is", "despidan"] } },
    { inf: "elegir", en: "to choose / to elect", type: "ir", ger: "eligiendo", forms: { presente: ["elijo", "eliges", "elige", "elegimos", "eleg\xEDs", "eligen"], preterito: ["eleg\xED", "elegiste", "eligi\xF3", "elegimos", "elegisteis", "eligieron"], presubj: ["elija", "elijas", "elija", "elijamos", "elij\xE1is", "elijan"] } },
    { inf: "corregir", en: "to correct", type: "ir", ger: "corrigiendo", forms: { presente: ["corrijo", "corriges", "corrige", "corregimos", "correg\xEDs", "corrigen"], preterito: ["correg\xED", "corregiste", "corrigi\xF3", "corregimos", "corregisteis", "corrigieron"], presubj: ["corrija", "corrijas", "corrija", "corrijamos", "corrij\xE1is", "corrijan"] } },
    { inf: "dirigir", en: "to direct / to manage", type: "ir", forms: { presente: ["dirijo", "diriges", "dirige", "dirigimos", "dirig\xEDs", "dirigen"], presubj: ["dirija", "dirijas", "dirija", "dirijamos", "dirij\xE1is", "dirijan"] } },
    { inf: "exigir", en: "to demand / to require", type: "ir", forms: { presente: ["exijo", "exiges", "exige", "exigimos", "exig\xEDs", "exigen"], presubj: ["exija", "exijas", "exija", "exijamos", "exij\xE1is", "exijan"] } },
    { inf: "enviar", en: "to send", type: "ar", forms: { presente: ["env\xEDo", "env\xEDas", "env\xEDa", "enviamos", "envi\xE1is", "env\xEDan"], presubj: ["env\xEDe", "env\xEDes", "env\xEDe", "enviemos", "envi\xE9is", "env\xEDen"] } },
    { inf: "sonre\xEDr", en: "to smile", type: "ir", part: "sonre\xEDdo", ger: "sonriendo", forms: { presente: ["sonr\xEDo", "sonr\xEDes", "sonr\xEDe", "sonre\xEDmos", "sonre\xEDs", "sonr\xEDen"], preterito: ["sonre\xED", "sonre\xEDste", "sonri\xF3", "sonre\xEDmos", "sonre\xEDsteis", "sonrieron"], presubj: ["sonr\xEDa", "sonr\xEDas", "sonr\xEDa", "sonriamos", "sonri\xE1is", "sonr\xEDan"] } },
    { inf: "andar", en: "to walk / to go around", type: "ar", forms: { preterito: ["anduve", "anduviste", "anduvo", "anduvimos", "anduvisteis", "anduvieron"] } },
    { inf: "valer", en: "to be worth", type: "er", forms: { presente: ["valgo", "vales", "vale", "valemos", "val\xE9is", "valen"], futuro: ["valdr\xE9", "valdr\xE1s", "valdr\xE1", "valdremos", "valdr\xE9is", "valdr\xE1n"], condicional: ["valdr\xEDa", "valdr\xEDas", "valdr\xEDa", "valdr\xEDamos", "valdr\xEDais", "valdr\xEDan"], presubj: ["valga", "valgas", "valga", "valgamos", "valg\xE1is", "valgan"] } },
    { inf: "despertarse", en: "to wake up", type: "ar", forms: { presente: ["despierto", "despiertas", "despierta", "despertamos", "despert\xE1is", "despiertan"], presubj: ["despierte", "despiertes", "despierte", "despertemos", "despert\xE9is", "despierten"] } },
    { inf: "levantarse", en: "to get up", type: "ar" },
    { inf: "ducharse", en: "to shower", type: "ar" },
    { inf: "ba\xF1arse", en: "to bathe", type: "ar" },
    { inf: "lavarse", en: "to wash (oneself)", type: "ar" },
    { inf: "cepillarse", en: "to brush (teeth/hair)", type: "ar" },
    { inf: "vestirse", en: "to get dressed", type: "ir", ger: "vistiendo", forms: { presente: ["visto", "vistes", "viste", "vestimos", "vest\xEDs", "visten"], preterito: ["vest\xED", "vestiste", "visti\xF3", "vestimos", "vestisteis", "vistieron"], presubj: ["vista", "vistas", "vista", "vistamos", "vist\xE1is", "vistan"] } },
    { inf: "peinarse", en: "to comb one's hair", type: "ar" },
    { inf: "afeitarse", en: "to shave", type: "ar" },
    { inf: "maquillarse", en: "to put on makeup", type: "ar" },
    { inf: "acostarse", en: "to go to bed", type: "ar", forms: { presente: ["acuesto", "acuestas", "acuesta", "acostamos", "acost\xE1is", "acuestan"], presubj: ["acueste", "acuestes", "acueste", "acostemos", "acost\xE9is", "acuesten"] } },
    { inf: "dormirse", en: "to fall asleep", type: "ir", ger: "durmiendo", forms: { presente: ["duermo", "duermes", "duerme", "dormimos", "dorm\xEDs", "duermen"], preterito: ["dorm\xED", "dormiste", "durmi\xF3", "dormimos", "dormisteis", "durmieron"], presubj: ["duerma", "duermas", "duerma", "durmamos", "durm\xE1is", "duerman"] } },
    { inf: "sentarse", en: "to sit down", type: "ar", forms: { presente: ["siento", "sientas", "sienta", "sentamos", "sent\xE1is", "sientan"], presubj: ["siente", "sientes", "siente", "sentemos", "sent\xE9is", "sienten"] } },
    { inf: "sentirse", en: "to feel", type: "ir", ger: "sintiendo", forms: { presente: ["siento", "sientes", "siente", "sentimos", "sent\xEDs", "sienten"], preterito: ["sent\xED", "sentiste", "sinti\xF3", "sentimos", "sentisteis", "sintieron"], presubj: ["sienta", "sientas", "sienta", "sintamos", "sint\xE1is", "sientan"] } },
    { inf: "quedarse", en: "to stay / to remain", type: "ar" },
    { inf: "prepararse", en: "to get ready", type: "ar" },
    { inf: "relajarse", en: "to relax", type: "ar" },
    { inf: "ponerse", en: "to put on (clothing) / to become", type: "er", part: "puesto", forms: { presente: ["pongo", "pones", "pone", "ponemos", "pon\xE9is", "ponen"], preterito: ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"], futuro: ["pondr\xE9", "pondr\xE1s", "pondr\xE1", "pondremos", "pondr\xE9is", "pondr\xE1n"], condicional: ["pondr\xEDa", "pondr\xEDas", "pondr\xEDa", "pondr\xEDamos", "pondr\xEDais", "pondr\xEDan"], presubj: ["ponga", "pongas", "ponga", "pongamos", "pong\xE1is", "pongan"] }, tuCmd: "pon" },
    { inf: "irse", en: "to leave / to go away", type: "ir", ger: "yendo", forms: { presente: ["voy", "vas", "va", "vamos", "vais", "van"], preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"], imperfecto: ["iba", "ibas", "iba", "\xEDbamos", "ibais", "iban"], presubj: ["vaya", "vayas", "vaya", "vayamos", "vay\xE1is", "vayan"] }, tuCmd: "ve", nosCmd: "vamos" },
    { inf: "expresar", en: "to express", type: "ar" },
    { inf: "se\xF1alar", en: "to point out", type: "ar" },
    { inf: "indicar", en: "to indicate", type: "ar" },
    { inf: "afirmar", en: "to assert, to state", type: "ar" },
    { inf: "advertir", en: "to warn", type: "ir", stem: "ie" },
    { inf: "anunciar", en: "to announce", type: "ar" },
    { inf: "aclarar", en: "to clarify", type: "ar" },
    { inf: "confirmar", en: "to confirm", type: "ar" },
    { inf: "desmentir", en: "to deny, to refute", type: "ir", stem: "ie" },
    { inf: "negar", en: "to deny", type: "ar", stem: "ie" },
    { inf: "reconocer", en: "to recognise, to admit", type: "er" },
    { inf: "exponer", en: "to set out, to present", type: "er", like: "poner" },
    { inf: "proponer", en: "to propose", type: "er", like: "poner" },
    { inf: "posponer", en: "to postpone", type: "er", like: "poner" },
    { inf: "plantear", en: "to raise, to pose (a question)", type: "ar" },
    { inf: "cuestionar", en: "to question, to call into doubt", type: "ar" },
    { inf: "consultar", en: "to consult", type: "ar" },
    { inf: "resumir", en: "to summarise", type: "ir" },
    { inf: "interpretar", en: "to interpret", type: "ar" },
    { inf: "transmitir", en: "to transmit, to convey", type: "ir" },
    { inf: "difundir", en: "to spread, to broadcast", type: "ir" },
    { inf: "divulgar", en: "to disclose, to popularise", type: "ar" },
    { inf: "publicar", en: "to publish", type: "ar" },
    { inf: "redactar", en: "to draft, to write up", type: "ar" },
    { inf: "narrar", en: "to narrate", type: "ar" },
    { inf: "formular", en: "to formulate", type: "ar" },
    { inf: "articular", en: "to articulate", type: "ar" },
    { inf: "pronunciar", en: "to pronounce", type: "ar" },
    { inf: "gritar", en: "to shout", type: "ar" },
    { inf: "recriminar", en: "to reproach", type: "ar" },
    { inf: "interpelar", en: "to challenge, to question formally", type: "ar" },
    { inf: "reiterar", en: "to reiterate", type: "ar" },
    { inf: "aconsejar", en: "to advise", type: "ar" },
    { inf: "recomendar", en: "to recommend", type: "ar", stem: "ie" },
    { inf: "convencer", en: "to convince", type: "er" },
    { inf: "asegurar", en: "to assure, to ensure", type: "ar" },
    { inf: "garantizar", en: "to guarantee", type: "ar" },
    { inf: "confesar", en: "to confess", type: "ar", stem: "ie" },
    { inf: "ocultar", en: "to hide, to conceal", type: "ar" },
    { inf: "nombrar", en: "to name, to appoint", type: "ar" },
    { inf: "designar", en: "to designate", type: "ar" },
    { inf: "destacar", en: "to stand out, to highlight", type: "ar" },
    { inf: "resaltar", en: "to highlight", type: "ar" },
    { inf: "ilustrar", en: "to illustrate", type: "ar" },
    { inf: "precisar", en: "to specify, to need", type: "ar" },
    { inf: "concretar", en: "to pin down, to finalise", type: "ar" },
    { inf: "explicar", en: "to explain", type: "ar" },
    { inf: "significar", en: "to mean", type: "ar" },
    { inf: "referir", en: "to refer, to recount", type: "ir", stem: "ie" },
    { inf: "prever", en: "to foresee", type: "er", like: "ver" },
    { inf: "considerar", en: "to consider", type: "ar" },
    { inf: "valorar", en: "to value, to assess", type: "ar" },
    { inf: "reflexionar", en: "to reflect, to think over", type: "ar" },
    { inf: "dudar", en: "to doubt", type: "ar" },
    { inf: "vacilar", en: "to hesitate, to waver", type: "ar" },
    { inf: "imaginar", en: "to imagine", type: "ar" },
    { inf: "adivinar", en: "to guess", type: "ar" },
    { inf: "inferir", en: "to infer", type: "ir", stem: "ie" },
    { inf: "determinar", en: "to determine", type: "ar" },
    { inf: "diferenciar", en: "to distinguish", type: "ar" },
    { inf: "clasificar", en: "to classify", type: "ar" },
    { inf: "calificar", en: "to describe as, to grade", type: "ar" },
    { inf: "analizar", en: "to analyse", type: "ar" },
    { inf: "investigar", en: "to investigate, to research", type: "ar" },
    { inf: "comprobar", en: "to check, to verify", type: "ar", stem: "ue" },
    { inf: "verificar", en: "to verify", type: "ar" },
    { inf: "revisar", en: "to review, to check over", type: "ar" },
    { inf: "observar", en: "to observe", type: "ar" },
    { inf: "contemplar", en: "to contemplate, to provide for", type: "ar" },
    { inf: "vigilar", en: "to watch over, to monitor", type: "ar" },
    { inf: "atender", en: "to attend to, to serve", type: "er", stem: "ie" },
    { inf: "aprobar", en: "to approve, to pass (an exam)", type: "ar", stem: "ue" },
    { inf: "rechazar", en: "to reject", type: "ar" },
    { inf: "denegar", en: "to refuse, to turn down", type: "ar", stem: "ie" },
    { inf: "autorizar", en: "to authorise", type: "ar" },
    { inf: "seleccionar", en: "to select", type: "ar" },
    { inf: "realizar", en: "to carry out, to make happen", type: "ar" },
    { inf: "efectuar", en: "to carry out", type: "ar", stem: "\xFA" },
    { inf: "elaborar", en: "to produce, to work out", type: "ar" },
    { inf: "crear", en: "to create", type: "ar" },
    { inf: "formar", en: "to form, to train", type: "ar" },
    { inf: "generar", en: "to generate", type: "ar" },
    { inf: "reproducir", en: "to reproduce", type: "ir", forms: { preterito: ["reproduje", "reprodujiste", "reprodujo", "reprodujimos", "reprodujisteis", "reprodujeron"] } },
    { inf: "introducir", en: "to introduce, to insert", type: "ir", forms: { preterito: ["introduje", "introdujiste", "introdujo", "introdujimos", "introdujisteis", "introdujeron"] } },
    { inf: "reducir", en: "to reduce", type: "ir", forms: { preterito: ["reduje", "redujiste", "redujo", "redujimos", "redujisteis", "redujeron"] } },
    { inf: "establecer", en: "to establish", type: "er" },
    { inf: "constituir", en: "to constitute, to make up", type: "ir" },
    { inf: "contribuir", en: "to contribute", type: "ir" },
    { inf: "incluir", en: "to include", type: "ir" },
    { inf: "concluir", en: "to conclude", type: "ir" },
    { inf: "diluir", en: "to dilute", type: "ir" },
    { inf: "influir", en: "to influence", type: "ir" },
    { inf: "integrar", en: "to integrate, to make up", type: "ar" },
    { inf: "incorporar", en: "to incorporate, to join", type: "ar" },
    { inf: "combinar", en: "to combine", type: "ar" },
    { inf: "intercambiar", en: "to exchange", type: "ar" },
    { inf: "alcanzar", en: "to reach, to attain", type: "ar" },
    { inf: "superar", en: "to overcome, to exceed", type: "ar" },
    { inf: "obtener", en: "to obtain", type: "er", like: "tener" },
    { inf: "mantener", en: "to maintain, to keep", type: "er", like: "tener" },
    { inf: "retener", en: "to retain, to hold back", type: "er", like: "tener" },
    { inf: "conservar", en: "to preserve, to keep", type: "ar" },
    { inf: "recuperar", en: "to recover, to get back", type: "ar" },
    { inf: "devolver", en: "to give back, to return", type: "er", stem: "ue" },
    { inf: "resolver", en: "to resolve, to solve", type: "er", stem: "ue" },
    { inf: "solucionar", en: "to solve", type: "ar" },
    { inf: "arreglar", en: "to fix, to sort out", type: "ar" },
    { inf: "reparar", en: "to repair", type: "ar" },
    { inf: "modificar", en: "to modify", type: "ar" },
    { inf: "convertir", en: "to turn into, to convert", type: "ir", stem: "ie" },
    { inf: "transformar", en: "to transform", type: "ar" },
    { inf: "aplicar", en: "to apply", type: "ar" },
    { inf: "emplear", en: "to use, to employ", type: "ar" },
    { inf: "utilizar", en: "to use", type: "ar" },
    { inf: "aprovechar", en: "to make the most of", type: "ar" },
    { inf: "explotar", en: "to exploit, to explode", type: "ar" },
    { inf: "procesar", en: "to process", type: "ar" },
    { inf: "registrar", en: "to record, to register", type: "ar" },
    { inf: "anotar", en: "to note down", type: "ar" },
    { inf: "almacenar", en: "to store", type: "ar" },
    { inf: "colocar", en: "to place, to put", type: "ar" },
    { inf: "trasladar", en: "to move, to transfer", type: "ar" },
    { inf: "separar", en: "to separate", type: "ar" },
    { inf: "dividir", en: "to divide", type: "ir" },
    { inf: "extraer", en: "to extract", type: "er", like: "traer" },
    { inf: "atraer", en: "to attract", type: "er", like: "traer" },
    { inf: "contraer", en: "to contract", type: "er", like: "traer" },
    { inf: "proyectar", en: "to project, to plan", type: "ar" },
    { inf: "orientar", en: "to orient, to guide", type: "ar" },
    { inf: "facilitar", en: "to make easier, to provide", type: "ar" },
    { inf: "dificultar", en: "to hinder", type: "ar" },
    { inf: "completar", en: "to complete", type: "ar" },
    { inf: "finalizar", en: "to finish, to end", type: "ar" },
    { inf: "acabar", en: "to finish, to end up", type: "ar" },
    { inf: "iniciar", en: "to begin, to initiate", type: "ar" },
    { inf: "intentar", en: "to try", type: "ar" },
    { inf: "tratar", en: "to treat, to deal with, to try to", type: "ar" },
    { inf: "consistir", en: "to consist (of)", type: "ir" },
    { inf: "resultar", en: "to turn out, to prove", type: "ar" },
    { inf: "derivar", en: "to derive, to lead to", type: "ar" },
    { inf: "causar", en: "to cause", type: "ar" },
    { inf: "provocar", en: "to provoke, to bring about", type: "ar" },
    { inf: "afectar", en: "to affect", type: "ar" },
    { inf: "evitar", en: "to avoid", type: "ar" },
    { inf: "eliminar", en: "to eliminate", type: "ar" },
    { inf: "minimizar", en: "to minimise", type: "ar" },
    { inf: "maximizar", en: "to maximise", type: "ar" },
    { inf: "aumentar", en: "to increase", type: "ar" },
    { inf: "incrementar", en: "to increase", type: "ar" },
    { inf: "reforzar", en: "to reinforce", type: "ar", stem: "ue" },
    { inf: "intensificar", en: "to intensify", type: "ar" },
    { inf: "atenuar", en: "to soften, to tone down", type: "ar", stem: "\xFA" },
    { inf: "aliviar", en: "to relieve, to ease", type: "ar" },
    { inf: "frenar", en: "to brake, to slow down", type: "ar" },
    { inf: "acortar", en: "to shorten", type: "ar" },
    { inf: "retrasar", en: "to delay", type: "ar" },
    { inf: "adelantar", en: "to bring forward, to overtake", type: "ar" },
    { inf: "continuar", en: "to continue", type: "ar", stem: "\xFA" },
    { inf: "puntuar", en: "to score, to punctuate", type: "ar", stem: "\xFA" },
    { inf: "generalizar", en: "to generalise", type: "ar" },
    { inf: "identificar", en: "to identify", type: "ar" },
    { inf: "marcar", en: "to mark, to dial", type: "ar" },
    { inf: "mover", en: "to move", type: "er", stem: "ue" },
    { inf: "promover", en: "to promote", type: "er", stem: "ue" },
    { inf: "fomentar", en: "to encourage, to foster", type: "ar" },
    { inf: "estimular", en: "to stimulate", type: "ar" },
    { inf: "compensar", en: "to compensate, to make up for", type: "ar" },
    { inf: "aportar", en: "to contribute, to provide", type: "ar" },
    { inf: "prestar", en: "to lend", type: "ar" },
    { inf: "solicitar", en: "to request, to apply for", type: "ar" },
    { inf: "asumir", en: "to assume, to take on", type: "ir" },
    { inf: "desempe\xF1ar", en: "to carry out (a role)", type: "ar" },
    { inf: "ejercer", en: "to exercise, to practise (a profession)", type: "er" },
    { inf: "intervenir", en: "to intervene", type: "ir", like: "venir" },
    { inf: "convenir", en: "to suit, to agree", type: "ir", like: "venir" },
    { inf: "cooperar", en: "to cooperate", type: "ar" },
    { inf: "involucrar", en: "to involve", type: "ar" },
    { inf: "acompa\xF1ar", en: "to accompany", type: "ar" },
    { inf: "luchar", en: "to fight, to struggle", type: "ar" },
    { inf: "combatir", en: "to combat", type: "ir" },
    { inf: "arriesgar", en: "to risk", type: "ar" },
    { inf: "salvar", en: "to save, to rescue", type: "ar" },
    { inf: "proteger", en: "to protect", type: "er" },
    { inf: "matar", en: "to kill", type: "ar" },
    { inf: "sobrepasar", en: "to exceed, to surpass", type: "ar" },
    { inf: "exceder", en: "to exceed", type: "er" },
    { inf: "acceder", en: "to access, to agree to", type: "er" },
    { inf: "preceder", en: "to precede", type: "er" },
    { inf: "acudir", en: "to go, to turn up, to turn to", type: "ir" },
    { inf: "recurrir", en: "to resort to, to appeal", type: "ir" },
    { inf: "eludir", en: "to evade, to dodge", type: "ir" },
    { inf: "mediar", en: "to mediate", type: "ar" },
    { inf: "cesar", en: "to cease", type: "ar" },
    { inf: "abandonar", en: "to abandon, to leave", type: "ar" },
    { inf: "faltar", en: "to be lacking, to be missing", type: "ar" },
    { inf: "quitar", en: "to take away, to remove", type: "ar" },
    { inf: "cortar", en: "to cut", type: "ar" },
    { inf: "tirar", en: "to throw, to pull", type: "ar" },
    { inf: "guardar", en: "to keep, to put away", type: "ar" },
    { inf: "tapar", en: "to cover", type: "ar" },
    { inf: "manchar", en: "to stain", type: "ar" },
    { inf: "apretar", en: "to press, to squeeze", type: "ar", stem: "ie" },
    { inf: "inclinar", en: "to tilt, to incline", type: "ar" },
    { inf: "girar", en: "to turn, to spin", type: "ar" },
    { inf: "parar", en: "to stop", type: "ar" },
    { inf: "captar", en: "to grasp, to capture", type: "ar" },
    { inf: "recoger", en: "to pick up, to collect", type: "er" },
    { inf: "coger", en: "to take, to catch", type: "er" },
    { inf: "amontonar", en: "to pile up", type: "ar" },
    { inf: "desatar", en: "to untie, to unleash", type: "ar" },
    { inf: "regalar", en: "to give (as a present)", type: "ar" },
    { inf: "visitar", en: "to visit", type: "ar" },
    { inf: "pasear", en: "to go for a walk", type: "ar" },
    { inf: "acampar", en: "to camp", type: "ar" },
    { inf: "veranear", en: "to spend the summer", type: "ar" },
    { inf: "merendar", en: "to have an afternoon snack", type: "ar", stem: "ie" },
    { inf: "fumar", en: "to smoke", type: "ar" },
    { inf: "adelgazar", en: "to lose weight", type: "ar" },
    { inf: "alimentar", en: "to feed, to nourish", type: "ar" },
    { inf: "descongelar", en: "to defrost", type: "ar" },
    { inf: "fregar", en: "to wash up, to scrub", type: "ar", stem: "ie" },
    { inf: "regar", en: "to water", type: "ar", stem: "ie" },
    { inf: "amueblar", en: "to furnish", type: "ar" },
    { inf: "mejorar", en: "to improve", type: "ar" },
    { inf: "entrenar", en: "to train", type: "ar" },
    { inf: "ense\xF1ar", en: "to teach, to show", type: "ar" },
    { inf: "nacer", en: "to be born", type: "er" },
    { inf: "crecer", en: "to grow, to grow up", type: "er" },
    { inf: "llover", en: "to rain", type: "er", stem: "ue" },
    { inf: "oscurecer", en: "to darken, to get dark", type: "er" },
    { inf: "aparecer", en: "to appear", type: "er" },
    { inf: "sonar", en: "to sound, to ring", type: "ar", stem: "ue" },
    { inf: "reaccionar", en: "to react", type: "ar" },
    { inf: "funcionar", en: "to work, to function", type: "ar" },
    { inf: "cobrar", en: "to charge, to get paid", type: "ar" },
    { inf: "bajar", en: "to go down, to lower", type: "ar" },
    { inf: "concertar", en: "to arrange, to set up", type: "ar", stem: "ie" },
    { inf: "presentar", en: "to present, to introduce", type: "ar" },
    { inf: "favorecer", en: "to favour, to suit", type: "er" },
    { inf: "enriquecer", en: "to enrich", type: "er" },
    { inf: "centrar", en: "to centre, to focus", type: "ar" },
    { inf: "destinar", en: "to allocate, to assign", type: "ar" },
    { inf: "emitir", en: "to broadcast, to issue", type: "ir" },
    { inf: "protagonizar", en: "to star in, to be at the centre of", type: "ar" },
    { inf: "neutralizar", en: "to neutralise", type: "ar" },
    { inf: "mitigar", en: "to mitigate", type: "ar" },
    { inf: "aparentar", en: "to appear, to feign", type: "ar" },
    { inf: "afianzar", en: "to consolidate, to strengthen", type: "ar" },
    { inf: "practicar", en: "to practise", type: "ar" },
    { inf: "doler", en: "to hurt", type: "er", stem: "ue" },
    { inf: "encantar", en: "to love, to delight", type: "ar" },
    { inf: "suspender", en: "to fail (an exam), to suspend", type: "er" },
    { inf: "contestar", en: "to answer", type: "ar" },
    { inf: "repasar", en: "to revise, to go over", type: "ar" },
    { inf: "navegar", en: "to sail, to browse", type: "ar" },
    { inf: "montar", en: "to ride, to assemble", type: "ar" },
    { inf: "pintar", en: "to paint", type: "ar" },
    { inf: "dedicar", en: "to dedicate, to devote", type: "ar" },
    { inf: "llamarse", en: "to be called", type: "ar" },
    { inf: "apellidarse", en: "to have as a surname", type: "ar" },
    { inf: "casarse", en: "to get married", type: "ar" },
    { inf: "separarse", en: "to separate, to split up", type: "ar" },
    { inf: "divorciarse", en: "to get divorced", type: "ar" },
    { inf: "memorizar", en: "to memorize", type: "ar" },
    { inf: "quitarse", en: "to take off (clothing)", type: "ar" },
    { inf: "probarse", en: "to try on", type: "ar", stem: "ue" },
    { inf: "pesar", en: "to weigh", type: "ar" },
    { inf: "nevar", en: "to snow", type: "ar", stem: "ie" },
    { inf: "parecerse", en: "to resemble, to look alike", type: "er" },
    { inf: "saltar", en: "to jump", type: "ar" },
    { inf: "oler", en: "to smell", type: "er", forms: { presente: ["huelo", "hueles", "huele", "olemos", "ol\xE9is", "huelen"], presubj: ["huela", "huelas", "huela", "olamos", "ol\xE1is", "huelan"] } },
    { inf: "besar", en: "to kiss", type: "ar" },
    { inf: "abrazar", en: "to hug", type: "ar" },
    { inf: "levantar", en: "to lift, to raise", type: "ar" },
    { inf: "soltar", en: "to let go of, to release", type: "ar", stem: "ue" },
    { inf: "tumbarse", en: "to lie down", type: "ar" },
    { inf: "tirarse", en: "to throw oneself, to dive", type: "ar" },
    { inf: "incorporarse", en: "to sit/stand up, to join", type: "ar" },
    { inf: "alzarse", en: "to rise up", type: "ar" },
    { inf: "agacharse", en: "to bend down, to crouch", type: "ar" },
    { inf: "cruzar", en: "to cross", type: "ar" },
    { inf: "rascarse", en: "to scratch oneself", type: "ar" },
    { inf: "ara\xF1ar", en: "to scratch (claw)", type: "ar" },
    { inf: "estornudar", en: "to sneeze", type: "ar" },
    { inf: "bostezar", en: "to yawn", type: "ar" },
    { inf: "sudar", en: "to sweat", type: "ar" },
    { inf: "masticar", en: "to chew", type: "ar" },
    { inf: "escupir", en: "to spit", type: "ir" },
    { inf: "aguantar", en: "to bear, to put up with", type: "ar" },
    { inf: "sujetar", en: "to hold, to grip", type: "ar" },
    { inf: "aplaudir", en: "to applaud", type: "ir" },
    { inf: "fallecer", en: "to pass away, to die", type: "er" },
    { inf: "enterrar", en: "to bury", type: "ar", stem: "ie" },
    { inf: "incinerar", en: "to cremate", type: "ar" },
    { inf: "alegrarse", en: "to be glad", type: "ar" },
    { inf: "divertirse", en: "to have fun, to enjoy oneself", type: "ir", stem: "ie" },
    { inf: "enamorarse", en: "to fall in love", type: "ar" },
    { inf: "aburrirse", en: "to get bored", type: "ir" },
    { inf: "deprimirse", en: "to get depressed", type: "ir" },
    { inf: "enfadarse", en: "to get angry", type: "ar" },
    { inf: "encontrarse", en: "to feel (health), to find oneself", type: "ar", stem: "ue" },
    { inf: "amar", en: "to love", type: "ar" },
    { inf: "adorar", en: "to adore", type: "ar" },
    { inf: "sorprenderse", en: "to be surprised", type: "er" },
    { inf: "asustarse", en: "to get scared", type: "ar" },
    { inf: "estresarse", en: "to get stressed", type: "ar" },
    { inf: "avergonzarse", en: "to feel ashamed, to be embarrassed", type: "ar", forms: { presente: ["averg\xFCenzo", "averg\xFCenzas", "averg\xFCenza", "avergonzamos", "avergonz\xE1is", "averg\xFCenzan"], presubj: ["averg\xFCence", "averg\xFCences", "averg\xFCence", "avergoncemos", "avergonc\xE9is", "averg\xFCencen"] } },
    { inf: "cansarse", en: "to get tired", type: "ar" },
    { inf: "detestar", en: "to detest, to hate", type: "ar" },
    { inf: "lamentar", en: "to regret, to lament", type: "ar" },
    { inf: "resignarse", en: "to resign oneself", type: "ar" },
    { inf: "agotarse", en: "to run out, to get exhausted", type: "ar" },
    { inf: "portarse", en: "to behave", type: "ar" },
    { inf: "progresar", en: "to progress", type: "ar" },
    { inf: "evolucionar", en: "to evolve", type: "ar" },
    { inf: "mudarse", en: "to move house", type: "ar" },
    { inf: "madurar", en: "to mature, to ripen", type: "ar" },
    { inf: "envejecer", en: "to grow old, to age", type: "er" },
    { inf: "renovar", en: "to renew", type: "ar", stem: "ue" },
    { inf: "obedecer", en: "to obey", type: "er" },
    { inf: "desobedecer", en: "to disobey", type: "er" },
    { inf: "re\xF1ir", en: "to scold, to argue", type: "ir", stem: "i" },
    { inf: "pelearse", en: "to fight, to argue", type: "ar" },
    { inf: "educar", en: "to raise, to educate", type: "ar" },
    { inf: "heredar", en: "to inherit", type: "ar" },
    { inf: "llevarse", en: "to get along (with)", type: "ar" },
    { inf: "abrazarse", en: "to hug (each other)", type: "ar" },
    { inf: "besarse", en: "to kiss (each other)", type: "ar" },
    { inf: "ligar", en: "to flirt, to hook up", type: "ar" },
    { inf: "relacionarse", en: "to socialize, to interact", type: "ar" },
    { inf: "despedirse", en: "to say goodbye", type: "ir", stem: "i" },
    { inf: "felicitar", en: "to congratulate", type: "ar" },
    { inf: "seducir", en: "to seduce", type: "ir", forms: { presente: ["seduzco", "seduces", "seduce", "seducimos", "seduc\xEDs", "seducen"], preterito: ["seduje", "sedujiste", "sedujo", "sedujimos", "sedujisteis", "sedujeron"], presubj: ["seduzca", "seduzcas", "seduzca", "seduzcamos", "seduzc\xE1is", "seduzcan"] } },
    { inf: "envolver", en: "to wrap", type: "er", like: "volver" },
    { inf: "celebrar", en: "to celebrate", type: "ar" },
    { inf: "cancelar", en: "to cancel", type: "ar" },
    { inf: "conmemorar", en: "to commemorate", type: "ar" },
    { inf: "brindar", en: "to toast (a drink), to offer", type: "ar" },
    { inf: "desenvolver", en: "to unwrap", type: "er", like: "volver" },
    { inf: "desempaquetar", en: "to unpack", type: "ar" },
    { inf: "empaquetar", en: "to pack, to package", type: "ar" },
    { inf: "comportarse", en: "to behave", type: "ar" },
    { inf: "pudrirse", en: "to rot", type: "ir", part: "podrido" },
    { inf: "ayunar", en: "to fast", type: "ar" },
    { inf: "devorar", en: "to devour", type: "ar" },
    { inf: "cortarse", en: "to cut oneself", type: "ar" },
    { inf: "digerir", en: "to digest", type: "ir", stem: "ie" },
    { inf: "probar", en: "to try, to taste", type: "ar", stem: "ue" },
    { inf: "chupar", en: "to suck", type: "ar" },
    { inf: "tragar", en: "to swallow", type: "ar" },
    { inf: "mamar", en: "to suckle, to breastfeed", type: "ar" },
    { inf: "emborracharse", en: "to get drunk", type: "ar" },
    { inf: "hervir", en: "to boil", type: "ir", stem: "ie" },
    { inf: "cocer", en: "to cook, to boil", type: "er", forms: { presente: ["cuezo", "cueces", "cuece", "cocemos", "coc\xE9is", "cuecen"], presubj: ["cueza", "cuezas", "cueza", "cozamos", "coz\xE1is", "cuezan"] } },
    { inf: "asar", en: "to roast", type: "ar" },
    { inf: "ali\xF1ar", en: "to dress (a salad), to season", type: "ar" },
    { inf: "condimentar", en: "to season", type: "ar" },
    { inf: "rebozar", en: "to coat in batter", type: "ar" },
    { inf: "empanar", en: "to bread, to coat in breadcrumbs", type: "ar" },
    { inf: "retirar", en: "to withdraw, to remove", type: "ar" },
    { inf: "matricularse", en: "to enroll, to register", type: "ar" },
    { inf: "ofrecer", en: "to offer", type: "er" },
    { inf: "conceder", en: "to grant", type: "er" },
    { inf: "deducir", en: "to deduce", type: "ir", forms: { presente: ["deduzco", "deduces", "deduce", "deducimos", "deduc\xEDs", "deducen"], preterito: ["deduje", "dedujiste", "dedujo", "dedujimos", "dedujisteis", "dedujeron"], presubj: ["deduzca", "deduzcas", "deduzca", "deduzcamos", "deduzc\xE1is", "deduzcan"] } },
    { inf: "formarse", en: "to be trained, to form oneself", type: "ar" },
    { inf: "educarse", en: "to educate oneself", type: "ar" },
    { inf: "examinarse", en: "to sit an exam, to take a test", type: "ar" },
    { inf: "licenciarse", en: "to graduate (with a degree)", type: "ar" },
    { inf: "titularse", en: "to graduate, to be titled", type: "ar" },
    { inf: "doctorarse", en: "to earn a doctorate", type: "ar" },
    { inf: "equivocarse", en: "to make a mistake", type: "ar" },
    { inf: "escoger", en: "to choose", type: "er" },
    { inf: "charlar", en: "to chat", type: "ar" },
    { inf: "relacionar", en: "to relate, to connect", type: "ar" },
    { inf: "comparar", en: "to compare", type: "ar" },
    { inf: "ocupar", en: "to occupy", type: "ar" },
    { inf: "archivar", en: "to file, to archive", type: "ar" },
    { inf: "coordinar", en: "to coordinate", type: "ar" },
    { inf: "citar", en: "to cite, to make an appointment with", type: "ar" },
    { inf: "jubilarse", en: "to retire", type: "ar" },
    { inf: "prevenir", en: "to prevent, to warn", type: "ir", like: "venir" },
    { inf: "reivindicar", en: "to demand, to claim", type: "ar" },
    { inf: "retirarse", en: "to retire, to withdraw", type: "ar" },
    { inf: "inscribirse", en: "to enroll, to register", type: "ir", part: "inscrito" },
    { inf: "coleccionar", en: "to collect", type: "ar" },
    { inf: "entretenerse", en: "to amuse oneself", type: "er", like: "tener" },
    { inf: "disfrazarse", en: "to dress up, to disguise oneself", type: "ar" },
    { inf: "estrenar", en: "to premiere, to use for the first time", type: "ar" },
    { inf: "inaugurar", en: "to inaugurate, to open", type: "ar" },
    { inf: "empatar", en: "to draw, to tie (sports)", type: "ar" },
    { inf: "hacerse", en: "to become", type: "er", part: "hecho", tuCmd: "haz", forms: { presente: ["hago", "haces", "hace", "hacemos", "hac\xE9is", "hacen"], preterito: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"], futuro: ["har\xE9", "har\xE1s", "har\xE1", "haremos", "har\xE9is", "har\xE1n"], condicional: ["har\xEDa", "har\xEDas", "har\xEDa", "har\xEDamos", "har\xEDais", "har\xEDan"], presubj: ["haga", "hagas", "haga", "hagamos", "hag\xE1is", "hagan"] } },
    { inf: "vencer", en: "to defeat, to overcome", type: "er" },
    { inf: "acertar", en: "to get right, to guess correctly", type: "ar", stem: "ie" },
    { inf: "fallar", en: "to fail, to miss", type: "ar" },
    { inf: "clasificarse", en: "to qualify (sports)", type: "ar" },
    { inf: "barajar", en: "to shuffle (cards)", type: "ar" },
    { inf: "repartir", en: "to deal (cards), to distribute", type: "ir" },
    { inf: "echar", en: "to throw, to pour", type: "ar" },
    { inf: "apostar", en: "to bet", type: "ar", stem: "ue" },
    { inf: "saltarse", en: "to skip", type: "ar" },
    { inf: "informar", en: "to inform", type: "ar" },
    { inf: "mantenerse", en: "to stay, to keep oneself", type: "er", like: "tener" },
    { inf: "comentar", en: "to comment", type: "ar" },
    { inf: "comunicar", en: "to communicate", type: "ar" },
    { inf: "declarar", en: "to declare", type: "ar" },
    { inf: "comunicarse", en: "to communicate (with each other)", type: "ar" },
    { inf: "certificar", en: "to certify", type: "ar" },
    { inf: "entregar", en: "to deliver, to hand in", type: "ar" },
    { inf: "descolgar", en: "to pick up (the phone), to take down", type: "ar", stem: "ue" },
    { inf: "colgar", en: "to hang (up)", type: "ar", stem: "ue" },
    { inf: "titular", en: "to headline, to entitle", type: "ar" },
    { inf: "grabar", en: "to record", type: "ar" },
    { inf: "perderse", en: "to get lost", type: "er", stem: "ie" },
    { inf: "descargarse", en: "to download", type: "ar" },
    { inf: "bajarse", en: "to get off, to download", type: "ar" },
    { inf: "adjuntar", en: "to attach", type: "ar" },
    { inf: "manejar", en: "to handle, to drive", type: "ar" },
    { inf: "apuntarse", en: "to sign up", type: "ar" },
    { inf: "atacar", en: "to attack", type: "ar" },
    { inf: "reformar", en: "to renovate, to reform", type: "ar" },
    { inf: "convivir", en: "to live together, to coexist", type: "ir" },
    { inf: "planchar", en: "to iron", type: "ar" },
    { inf: "decorar", en: "to decorate", type: "ar" },
    { inf: "iluminar", en: "to illuminate, to light up", type: "ar" },
    { inf: "desenchufar", en: "to unplug", type: "ar" },
    { inf: "enchufar", en: "to plug in", type: "ar" },
    { inf: "estropearse", en: "to break down, to spoil", type: "ar" },
    { inf: "da\xF1arse", en: "to break down, to get damaged", type: "ar" },
    { inf: "averiarse", en: "to break down (machine)", type: "ar", forms: { presente: ["aver\xEDo", "aver\xEDas", "aver\xEDa", "averiamos", "averi\xE1is", "aver\xEDan"], presubj: ["aver\xEDe", "aver\xEDes", "aver\xEDe", "averiemos", "averi\xE9is", "aver\xEDen"] } },
    { inf: "ingresar", en: "to be admitted (hospital), to deposit", type: "ar" },
    { inf: "robar", en: "to steal", type: "ar" },
    { inf: "detener", en: "to arrest, to stop", type: "er", like: "tener" },
    { inf: "interrogar", en: "to interrogate", type: "ar" },
    { inf: "cuidar", en: "to take care of", type: "ar" },
    { inf: "apoyar", en: "to support", type: "ar" },
    { inf: "colaborar", en: "to collaborate", type: "ar" },
    { inf: "coser", en: "to sew", type: "er" },
    { inf: "encoger", en: "to shrink", type: "er" },
    { inf: "diagnosticar", en: "to diagnose", type: "ar" },
    { inf: "cuidarse", en: "to take care of oneself", type: "ar" },
    { inf: "padecer", en: "to suffer from", type: "er" },
    { inf: "quemar", en: "to burn", type: "ar" },
    { inf: "romperse", en: "to break", type: "er", part: "roto" },
    { inf: "engordar", en: "to gain weight", type: "ar" },
    { inf: "escayolar", en: "to put in a cast", type: "ar" },
    { inf: "vendar", en: "to bandage", type: "ar" },
    { inf: "vomitar", en: "to vomit", type: "ar" },
    { inf: "marearse", en: "to feel dizzy, to feel seasick", type: "ar" },
    { inf: "hospitalizar", en: "to hospitalize", type: "ar" },
    { inf: "vacunarse", en: "to get vaccinated", type: "ar" },
    { inf: "recetar", en: "to prescribe", type: "ar" },
    { inf: "limarse", en: "to file (nails)", type: "ar" },
    { inf: "desenredarse", en: "to untangle (hair)", type: "ar" },
    { inf: "enredarse", en: "to get tangled", type: "ar" },
    { inf: "recogerse", en: "to put up (hair)", type: "er" },
    { inf: "pintarse", en: "to put on makeup", type: "ar" },
    { inf: "conservarse", en: "to keep well, to age well", type: "ar" },
    { inf: "recortarse", en: "to trim (hair)", type: "ar" },
    { inf: "anular", en: "to cancel, to annul", type: "ar" },
    { inf: "facturar", en: "to check in (luggage), to invoice", type: "ar" },
    { inf: "marcharse", en: "to leave, to go away", type: "ar" },
    { inf: "inspeccionar", en: "to inspect", type: "ar" },
    { inf: "recorrer", en: "to travel across, to cover (distance)", type: "er" },
    { inf: "atravesar", en: "to cross, to go through", type: "ar", stem: "ie" },
    { inf: "quemarse", en: "to get sunburnt, to burn oneself", type: "ar" },
    { inf: "escalar", en: "to climb", type: "ar" },
    { inf: "registrarse", en: "to check in, to register", type: "ar" },
    { inf: "alojarse", en: "to stay (accommodation)", type: "ar" },
    { inf: "desmontar", en: "to dismantle, to dismount", type: "ar" },
    { inf: "aparcar", en: "to park", type: "ar" },
    { inf: "despegar", en: "to take off (plane)", type: "ar" },
    { inf: "aterrizar", en: "to land (plane)", type: "ar" },
    { inf: "arrancar", en: "to start (an engine), to pull up", type: "ar" },
    { inf: "acelerar", en: "to accelerate", type: "ar" },
    { inf: "desembarcar", en: "to disembark", type: "ar" },
    { inf: "embarcar", en: "to board", type: "ar" },
    { inf: "pilotar", en: "to pilot", type: "ar" },
    { inf: "pinchar", en: "to puncture, to prick", type: "ar" },
    { inf: "importar", en: "to import; to matter", type: "ar" },
    { inf: "interesar", en: "to interest", type: "ar" },
    { inf: "proceder", en: "to come (from), to proceed", type: "er" },
    { inf: "ordenar", en: "to tidy, to organize; to order", type: "ar" },
    { inf: "bastar", en: "to be enough, to suffice", type: "ar" },
    { inf: "constar", en: "to be recorded, to be on record; to consist of", type: "ar" },
    { inf: "fundirse", en: "to melt, to fuse", type: "ir" },
    { inf: "ocasionar", en: "to cause, to bring about", type: "ar" },
    { inf: "pertenecer", en: "to belong", type: "er" },
    { inf: "componerse", en: "to be made up (of), to consist (of)", type: "er", like: "poner" },
    { inf: "caracterizarse", en: "to be characterized (by)", type: "ar" },
    { inf: "desconvocar", en: "to call off (a strike, a meeting)", type: "ar" },
    { inf: "ilusionarse", en: "to get one's hopes up, to get excited", type: "ar" },
    { inf: "fijarse", en: "to notice, to pay attention", type: "ar" },
    { inf: "desocupar", en: "to vacate, to empty", type: "ar" },
    { inf: "distribuir", en: "to distribute", type: "ir" },
    { inf: "duplicarse", en: "to double", type: "ar" },
    { inf: "triplicarse", en: "to triple", type: "ar" },
    { inf: "rebajar", en: "to reduce, to discount", type: "ar" },
    { inf: "situar", en: "to place, to situate", type: "ar", forms: { presente: ["sit\xFAo", "sit\xFAas", "sit\xFAa", "situamos", "situ\xE1is", "sit\xFAan"], presubj: ["sit\xFAe", "sit\xFAes", "sit\xFAe", "situemos", "situ\xE9is", "sit\xFAen"] } },
    { inf: "hallarse", en: "to be located, to find oneself (formal)", type: "ar" },
    { inf: "acercar", en: "to bring closer, to move something nearer", type: "ar" },
    { inf: "alejar", en: "to move something away, to distance", type: "ar" },
    { inf: "aproximarse", en: "to approach, to get closer", type: "ar" },
    { inf: "juntarse", en: "to get together, to join up", type: "ar" },
    { inf: "distanciarse", en: "to distance oneself", type: "ar" },
    { inf: "huir", en: "to flee", type: "ir", ger: "huyendo", forms: { presente: ["huyo", "huyes", "huye", "huimos", "hu\xEDs", "huyen"], preterito: ["hu\xED", "huiste", "huy\xF3", "huimos", "huisteis", "huyeron"], presubj: ["huya", "huyas", "huya", "huyamos", "huy\xE1is", "huyan"] } },
    { inf: "transportar", en: "to transport", type: "ar" },
    { inf: "avanzar", en: "to advance, to move forward", type: "ar" },
    { inf: "retroceder", en: "to retreat, to move backward", type: "er" },
    { inf: "tropezar", en: "to trip, to stumble", type: "ar", stem: "ie" },
    { inf: "montarse", en: "to get on/in (a vehicle)", type: "ar" },
    { inf: "detenerse", en: "to stop (oneself)", type: "er", like: "tener" },
    { inf: "guiar", en: "to guide", type: "ar", forms: { presente: ["gu\xEDo", "gu\xEDas", "gu\xEDa", "guiamos", "gui\xE1is", "gu\xEDan"], presubj: ["gu\xEDe", "gu\xEDes", "gu\xEDe", "guiemos", "gui\xE9is", "gu\xEDen"] } },
    { inf: "desviarse", en: "to turn off, to deviate", type: "ar", forms: { presente: ["desv\xEDo", "desv\xEDas", "desv\xEDa", "desviamos", "desvi\xE1is", "desv\xEDan"], presubj: ["desv\xEDe", "desv\xEDes", "desv\xEDe", "desviemos", "desvi\xE9is", "desv\xEDen"] } },
    { inf: "dirigirse", en: "to head (towards), to address", type: "ir", like: "dirigir" },
    { inf: "descolocar", en: "to displace, to put out of place", type: "ar" },
    { inf: "doblar", en: "to fold, to bend; to turn", type: "ar" },
    { inf: "copiar", en: "to copy", type: "ar" },
    { inf: "plastificar", en: "to laminate", type: "ar" },
    { inf: "impermeabilizar", en: "to waterproof", type: "ar" },
    { inf: "humedecer", en: "to dampen, to moisten", type: "er" },
    { inf: "empapar", en: "to soak", type: "ar" },
    { inf: "absorber", en: "to absorb", type: "er" },
    { inf: "transpirar", en: "to perspire", type: "ar" },
    { inf: "deshidratarse", en: "to become dehydrated", type: "ar" },
    { inf: "contener", en: "to contain", type: "er", like: "tener" },
    { inf: "distinguir", en: "to distinguish, to make out", type: "ir" },
    { inf: "silbar", en: "to whistle", type: "ar" },
    { inf: "te\xF1ir", en: "to dye", type: "ir", stem: "i", ger: "ti\xF1endo", forms: { presente: ["ti\xF1o", "ti\xF1es", "ti\xF1e", "te\xF1imos", "te\xF1\xEDs", "ti\xF1en"], preterito: ["te\xF1\xED", "te\xF1iste", "ti\xF1\xF3", "te\xF1imos", "te\xF1isteis", "ti\xF1eron"], presubj: ["ti\xF1a", "ti\xF1as", "ti\xF1a", "ti\xF1amos", "ti\xF1\xE1is", "ti\xF1an"] } },
    { inf: "mezclar", en: "to mix", type: "ar" },
    { inf: "gastarse", en: "to wear out, to run out (of money)", type: "ar" },
    { inf: "consumir", en: "to consume", type: "ir" },
    { inf: "entrenarse", en: "to train", type: "ar" },
    { inf: "triunfar", en: "to triumph, to succeed", type: "ar" },
    { inf: "fracasar", en: "to fail", type: "ar" },
    { inf: "preocuparse", en: "to worry", type: "ar" },
    { inf: "enterarse", en: "to find out, to become aware", type: "ar" },
    { inf: "informarse", en: "to find out, to get informed", type: "ar" },
    { inf: "subrayar", en: "to underline, to emphasize", type: "ar" },
    { inf: "sugerir", en: "to suggest", type: "ir", ger: "sugiriendo", forms: { presente: ["sugiero", "sugieres", "sugiere", "sugerimos", "suger\xEDs", "sugieren"], preterito: ["suger\xED", "sugeriste", "sugiri\xF3", "sugerimos", "sugeristeis", "sugirieron"], presubj: ["sugiera", "sugieras", "sugiera", "sugiramos", "sugir\xE1is", "sugieran"] } },
    { inf: "amenazar", en: "to threaten", type: "ar" },
    { inf: "suponer", en: "to suppose, to assume", type: "er", like: "poner" },
    { inf: "rogar", en: "to beg, to request", type: "ar", stem: "ue", forms: { preterito: ["rogu\xE9", "rogaste", "rog\xF3", "rogamos", "rogasteis", "rogaron"], presubj: ["ruegue", "ruegues", "ruegue", "roguemos", "rogu\xE9is", "rueguen"] } },
    { inf: "prohibir", en: "to forbid, to prohibit", type: "ir", forms: { presente: ["proh\xEDbo", "proh\xEDbes", "proh\xEDbe", "prohibimos", "prohib\xEDs", "proh\xEDben"], presubj: ["proh\xEDba", "proh\xEDbas", "proh\xEDba", "prohibamos", "prohib\xE1is", "proh\xEDban"] } },
    { inf: "atreverse", en: "to dare", type: "er" },
    { inf: "arreglarse", en: "to work out, to sort itself out; to get ready", type: "ar" },
    { inf: "fiarse", en: "to trust", type: "ar", forms: { presente: ["f\xEDo", "f\xEDas", "f\xEDa", "fiamos", "fi\xE1is", "f\xEDan"], presubj: ["f\xEDe", "f\xEDes", "f\xEDe", "fiemos", "fi\xE9is", "f\xEDen"] } },
    { inf: "jurar", en: "to swear, to vow", type: "ar" },
    { inf: "consolar", en: "to console, to comfort", type: "ar", stem: "ue" },
    { inf: "tranquilizar", en: "to reassure, to calm down", type: "ar" },
    { inf: "calmar", en: "to calm, to soothe", type: "ar" },
    { inf: "disculpar", en: "to excuse, to forgive", type: "ar" },
    { inf: "perdonar", en: "to forgive", type: "ar" },
    { inf: "molestar", en: "to bother, to annoy", type: "ar" },
    { inf: "imaginarse", en: "to imagine", type: "ar" },
    { inf: "referirse", en: "to refer (to)", type: "ir", stem: "ie" },
    { inf: "tratarse", en: "to be about (a matter)", type: "ar" },
    { inf: "entusiasmar", en: "to excite, to thrill", type: "ar" },
    { inf: "apasionar", en: "to fascinate, to be passionate about", type: "ar" },
    { inf: "disgustar", en: "to upset, to displease", type: "ar" },
    { inf: "horrorizar", en: "to horrify", type: "ar" },
    { inf: "entretener", en: "to entertain", type: "er", like: "tener" },
    { inf: "divertir", en: "to amuse, to entertain", type: "ir", stem: "ie" },
    { inf: "aburrir", en: "to bore", type: "ir" },
    { inf: "indignar", en: "to outrage, to indignify", type: "ar" },
    { inf: "fastidiar", en: "to annoy, to bother", type: "ar" },
    { inf: "preocupar", en: "to worry (someone)", type: "ar" },
    { inf: "asustar", en: "to scare", type: "ar" },
    { inf: "agobiar", en: "to overwhelm, to stress out", type: "ar" },
    { inf: "asombrar", en: "to amaze, to astonish", type: "ar" },
    { inf: "admirar", en: "to admire", type: "ar" },
    { inf: "impresionar", en: "to impress", type: "ar" },
    { inf: "echarse", en: "to throw oneself, to lie down", type: "ar" },
    { inf: "cansar", en: "to tire (someone)", type: "ar" },
    { inf: "agotar", en: "to exhaust, to use up", type: "ar" },
    { inf: "deprimir", en: "to depress", type: "ir" },
    { inf: "exportar", en: "to export", type: "ar" },
    { inf: "avisar", en: "to warn, to notify", type: "ar" },
    { inf: "fabricar", en: "to manufacture", type: "ar" },
    { inf: "inventar", en: "to invent", type: "ar" },
    { inf: "demostrar", en: "to demonstrate, to prove", type: "ar", stem: "ue" },
    { inf: "sumar", en: "to add (math)", type: "ar" },
    { inf: "restar", en: "to subtract", type: "ar" },
    { inf: "multiplicar", en: "to multiply", type: "ar" },
    { inf: "calcular", en: "to calculate", type: "ar" },
    { inf: "pulsar", en: "to press (a button)", type: "ar" },
    { inf: "pegar", en: "to stick, to glue, to hit", type: "ar" },
    { inf: "insertar", en: "to insert", type: "ar" },
    { inf: "arrastrar", en: "to drag", type: "ar" },
    { inf: "congelar", en: "to freeze", type: "ar" },
    { inf: "evaporarse", en: "to evaporate", type: "ar" },
    { inf: "respetar", en: "to respect", type: "ar" },
    { inf: "gobernar", en: "to govern", type: "ar", stem: "ie" },
    { inf: "abstenerse", en: "to abstain", type: "er", like: "tener" },
    { inf: "convocar", en: "to convene, to call (a meeting)", type: "ar" },
    { inf: "cometer", en: "to commit (a crime)", type: "er" },
    { inf: "disparar", en: "to shoot, to fire", type: "ar" },
    { inf: "defender", en: "to defend", type: "er", stem: "ie" },
    { inf: "componer", en: "to compose", type: "er", like: "poner" },
    { inf: "imitar", en: "to imitate", type: "ar" },
    { inf: "describir", en: "to describe", type: "ir", part: "descrito" },
    { inf: "relatar", en: "to relate, to recount", type: "ar" },
    { inf: "rimar", en: "to rhyme", type: "ar" },
    { inf: "recitar", en: "to recite", type: "ar" },
    { inf: "editar", en: "to edit, to publish", type: "ar" },
    { inf: "imprimir", en: "to print", type: "ir", part: "impreso" },
    { inf: "enfocar", en: "to focus", type: "ar" },
    { inf: "revelar", en: "to reveal, to develop (film)", type: "ar" },
    { inf: "enmarcar", en: "to frame", type: "ar" },
    { inf: "rodar", en: "to film, to roll", type: "ar", stem: "ue" },
    { inf: "representar", en: "to represent, to perform", type: "ar" },
    { inf: "escenificar", en: "to stage, to dramatize", type: "ar" },
    { inf: "rezar", en: "to pray", type: "ar" },
    { inf: "bendecir", en: "to bless", type: "ir", tuCmd: "bendice", part: "bendecido", forms: { presente: ["bendigo", "bendices", "bendice", "bendecimos", "bendec\xEDs", "bendicen"], preterito: ["bendije", "bendijiste", "bendijo", "bendijimos", "bendijisteis", "bendijeron"], presubj: ["bendiga", "bendigas", "bendiga", "bendigamos", "bendig\xE1is", "bendigan"] } },
    { inf: "pecar", en: "to sin", type: "ar" },
    { inf: "confesarse", en: "to confess (religious)", type: "ar", stem: "ie" },
    { inf: "comulgar", en: "to take communion", type: "ar" },
    { inf: "convertirse", en: "to become, to convert", type: "ir", stem: "ie" },
    { inf: "razonar", en: "to reason", type: "ar" },
    { inf: "brillar", en: "to shine", type: "ar" },
    { inf: "apagarse", en: "to go out, to turn off", type: "ar" },
    { inf: "limitar", en: "to limit, to border", type: "ar" },
    { inf: "plantar", en: "to plant", type: "ar" },
    { inf: "cultivar", en: "to grow, to cultivate", type: "ar" },
    { inf: "sembrar", en: "to sow", type: "ar", stem: "ie" },
    { inf: "nublarse", en: "to become cloudy", type: "ar" },
    { inf: "soplar", en: "to blow", type: "ar" },
    { inf: "helar", en: "to freeze (weather)", type: "ar", stem: "ie" },
    { inf: "granizar", en: "to hail", type: "ar" },
    { inf: "caerse", en: "to fall (over)", type: "er", forms: { presente: ["caigo", "caes", "cae", "caemos", "ca\xE9is", "caen"], preterito: ["ca\xED", "ca\xEDste", "cay\xF3", "ca\xEDmos", "ca\xEDsteis", "cayeron"], presubj: ["caiga", "caigas", "caiga", "caigamos", "caig\xE1is", "caigan"] } },
    { inf: "secarse", en: "to dry (oneself/out)", type: "ar" },
    { inf: "brotar", en: "to sprout, to bud", type: "ar" },
    { inf: "florecer", en: "to flower, to bloom", type: "er" },
    { inf: "trasplantar", en: "to transplant", type: "ar" },
    { inf: "inundar", en: "to flood", type: "ar" },
    { inf: "aspirar", en: "to inhale, to aspire", type: "ar" },
    { inf: "espirar", en: "to exhale", type: "ar" },
    { inf: "tiritar", en: "to shiver", type: "ar" },
    { inf: "estremecerse", en: "to shudder, to tremble", type: "er" },
    { inf: "arrugar", en: "to wrinkle, to crease", type: "ar" },
    { inf: "alzar", en: "to raise, to lift", type: "ar" },
    { inf: "distender", en: "to loosen, to relax (a muscle)", type: "er", stem: "ie" },
    { inf: "cruzarse", en: "to cross paths", type: "ar" },
    { inf: "parir", en: "to give birth", type: "ir" },
    { inf: "experimentar", en: "to experience, to experiment", type: "ar" },
    { inf: "llenar", en: "to fill", type: "ar" },
    { inf: "morirse", en: "to die", type: "ir", part: "muerto", forms: { presente: ["muero", "mueres", "muere", "morimos", "mor\xEDs", "mueren"], preterito: ["mor\xED", "moriste", "muri\xF3", "morimos", "moristeis", "murieron"], presubj: ["muera", "mueras", "muera", "muramos", "mur\xE1is", "mueran"] } },
    { inf: "agradar", en: "to please", type: "ar" },
    { inf: "fascinar", en: "to fascinate", type: "ar" },
    { inf: "enorgullecerse", en: "to be proud", type: "er" },
    { inf: "alucinar", en: "to be amazed, to hallucinate", type: "ar" },
    { inf: "asombrarse", en: "to be amazed", type: "ar" },
    { inf: "aborrecer", en: "to abhor, to detest", type: "er" },
    { inf: "desagradar", en: "to displease", type: "ar" },
    { inf: "repugnar", en: "to disgust", type: "ar" },
    { inf: "entristecerse", en: "to become sad", type: "er" },
    { inf: "inquietarse", en: "to worry, to become uneasy", type: "ar" },
    { inf: "agobiarse", en: "to become overwhelmed", type: "ar" },
    { inf: "desanimarse", en: "to become discouraged", type: "ar" },
    { inf: "derrumbarse", en: "to collapse", type: "ar" },
    { inf: "hundirse", en: "to sink", type: "ir" },
    { inf: "recuperarse", en: "to recover", type: "ar" },
    { inf: "compadecer", en: "to feel sorry for, to pity", type: "er" },
    { inf: "arrepentirse", en: "to regret, to repent", type: "ir", stem: "ie" },
    { inf: "aguantarse", en: "to put up with it, to resign oneself", type: "ar" },
    { inf: "fastidiarse", en: "to get annoyed", type: "ar" },
    { inf: "temer", en: "to fear", type: "er" },
    { inf: "horrorizarse", en: "to be horrified", type: "ar" },
    { inf: "partirse", en: "to split, to crack up (laughing)", type: "ir" },
    { inf: "encogerse", en: "to shrink, to shrug", type: "er" },
    { inf: "fatigarse", en: "to get tired", type: "ar" },
    { inf: "ruborizarse", en: "to blush", type: "ar" },
    { inf: "sonrojarse", en: "to blush", type: "ar" },
    { inf: "afrontar", en: "to face, to confront", type: "ar" },
    { inf: "residir", en: "to reside", type: "ir" },
    { inf: "habitar", en: "to inhabit", type: "ar" },
    { inf: "tramitar", en: "to process, to arrange (paperwork)", type: "ar" },
    { inf: "enviudar", en: "to become widowed", type: "ar" },
    { inf: "expedir", en: "to issue (a document)", type: "ir", stem: "i" },
    { inf: "sacarse", en: "to obtain, to get (a document/qualification)", type: "ar" },
    { inf: "sobreproteger", en: "to overprotect", type: "er" },
    { inf: "manipular", en: "to manipulate", type: "ar" },
    { inf: "consentir", en: "to allow, to spoil (a child)", type: "ir", stem: "ie" },
    { inf: "dominar", en: "to dominate, to master", type: "ar" },
    { inf: "contradecir", en: "to contradict", type: "ir", like: "decir", tuCmd: "contradice" },
    { inf: "oponerse", en: "to oppose", type: "er", like: "poner" },
    { inf: "enfrentarse", en: "to confront, to face up to", type: "ar" },
    { inf: "rega\xF1ar", en: "to scold", type: "ar" },
    { inf: "enfriarse", en: "to cool down, to get cold", type: "ar", stem: "\xED" },
    { inf: "estrechar", en: "to tighten, to strengthen (a bond)", type: "ar" },
    { inf: "vincularse", en: "to become linked, to bond", type: "ar" },
    { inf: "mezclarse", en: "to get mixed up, to mingle", type: "ar" },
    { inf: "presidir", en: "to preside over, to chair", type: "ir" },
    { inf: "clausurar", en: "to close, to bring to a close", type: "ar" },
    { inf: "adoptar", en: "to adopt", type: "ar" },
    { inf: "manifestar", en: "to state, to demonstrate", type: "ar", stem: "ie" },
    { inf: "inspirar", en: "to inspire, to inhale", type: "ar" },
    { inf: "merecer", en: "to deserve", type: "er" },
    { inf: "adulterar", en: "to adulterate", type: "ar" },
    { inf: "interrumpir", en: "to interrupt", type: "ir" },
    { inf: "descomponerse", en: "to decompose, to break down", type: "er", like: "poner" },
    { inf: "succionar", en: "to suck, to suction", type: "ar" },
    { inf: "sorber", en: "to sip, to slurp", type: "er" },
    { inf: "catar", en: "to taste (wine), to sample", type: "ar" },
    { inf: "subirse", en: "to get on/into", type: "ir" },
    { inf: "moler", en: "to grind", type: "er", stem: "ue" },
    { inf: "pasarse", en: "to go too far, to overdo it", type: "ar" },
    { inf: "pegarse", en: "to stick to, to hit each other", type: "ar" },
    { inf: "otorgar", en: "to grant, to award", type: "ar" },
    { inf: "convalidar", en: "to validate (academic credits)", type: "ar" },
    { inf: "cursar", en: "to study, to take (a course)", type: "ar" },
    { inf: "acreditar", en: "to accredit, to prove", type: "ar" },
    { inf: "sancionar", en: "to sanction, to penalize", type: "ar" },
    { inf: "expulsar", en: "to expel", type: "ar" },
    { inf: "reciclarse", en: "to retrain, to update one's skills", type: "ar" },
    { inf: "adquirir", en: "to acquire", type: "ir", stem: "ie" },
    { inf: "asimilar", en: "to assimilate", type: "ar" },
    { inf: "inducir", en: "to induce", type: "ir", forms: { presente: ["induzco", "induces", "induce", "inducimos", "induc\xEDs", "inducen"], preterito: ["induje", "indujiste", "indujo", "indujimos", "indujisteis", "indujeron"], presubj: ["induzca", "induzcas", "induzca", "induzcamos", "induzc\xE1is", "induzcan"] } },
    { inf: "empollar", en: "to cram, to swot (study hard)", type: "ar" },
    { inf: "examinar", en: "to examine, to test", type: "ar" },
    { inf: "retomar", en: "to resume, to take up again", type: "ar" },
    { inf: "ejecutar", en: "to execute, to carry out", type: "ar" },
    { inf: "volcarse", en: "to devote oneself fully", type: "ar", stem: "ue" },
    { inf: "acumularse", en: "to accumulate, to pile up", type: "ar" },
    { inf: "delegar", en: "to delegate", type: "ar" },
    { inf: "centralizar", en: "to centralize", type: "ar" },
    { inf: "desbordar", en: "to overwhelm, to overflow", type: "ar" },
    { inf: "ostentar", en: "to hold (a position), to flaunt", type: "ar" },
    { inf: "dimitir", en: "to resign", type: "ir" },
    { inf: "subcontratar", en: "to subcontract, to outsource", type: "ar" },
    { inf: "incumplir", en: "to fail to comply with, to breach", type: "ir" },
    { inf: "prorrogar", en: "to extend, to postpone", type: "ar" },
    { inf: "recortar", en: "to cut, to trim", type: "ar" },
    { inf: "sindicarse", en: "to unionize", type: "ar" },
    { inf: "afiliarse", en: "to join, to become a member", type: "ar" },
    { inf: "distraerse", en: "to be distracted, to amuse oneself", type: "er", like: "traer" },
    { inf: "trasnochar", en: "to stay up all night", type: "ar" },
    { inf: "disputar", en: "to dispute, to contest", type: "ar" },
    { inf: "lesionar", en: "to injure", type: "ar" },
    { inf: "anticipar", en: "to anticipate, to bring forward", type: "ar" },
    { inf: "ensayar", en: "to rehearse", type: "ar" },
    { inf: "conquistar", en: "to conquer", type: "ar" },
    { inf: "festejar", en: "to celebrate", type: "ar" },
    { inf: "aceptar", en: "to accept", type: "ar" },
    { inf: "notificar", en: "to notify", type: "ar" },
    { inf: "contrastar", en: "to contrast", type: "ar" },
    { inf: "desvelar", en: "to reveal, to unveil", type: "ar" },
    { inf: "remitir", en: "to remit, to send; to refer to", type: "ir" },
    { inf: "fechar", en: "to date (a document)", type: "ar" },
    { inf: "dictar", en: "to dictate", type: "ar" },
    { inf: "descifrar", en: "to decipher", type: "ar" },
    { inf: "escribirse", en: "to write to each other, to correspond", type: "ir", part: "escrito" },
    { inf: "cartearse", en: "to correspond by letter", type: "ar" },
    { inf: "abonarse", en: "to subscribe", type: "ar" },
    { inf: "pactar", en: "to agree upon, to make a pact", type: "ar" },
    { inf: "televisar", en: "to televise", type: "ar" },
    { inf: "retransmitir", en: "to broadcast", type: "ir" },
    { inf: "bloquearse", en: "to freeze up, to get blocked", type: "ar" },
    { inf: "saturarse", en: "to become saturated, to become overloaded", type: "ar" },
    { inf: "derribar", en: "to demolish, to knock down", type: "ar" },
    { inf: "edificar", en: "to build (formal)", type: "ar" },
    { inf: "adjudicar", en: "to award, to allocate", type: "ar" },
    { inf: "hipotecar", en: "to mortgage", type: "ar" },
    { inf: "desinfectar", en: "to disinfect", type: "ar" },
    { inf: "frotar", en: "to rub", type: "ar" },
    { inf: "centrifugar", en: "to spin (a washing machine)", type: "ar" },
    { inf: "empapelar", en: "to wallpaper", type: "ar" },
    { inf: "sellar", en: "to stamp, to seal", type: "ar" },
    { inf: "entregarse", en: "to surrender, to devote oneself", type: "ar" },
    { inf: "capturar", en: "to capture", type: "ar" },
    { inf: "desactivar", en: "to deactivate, to disarm", type: "ar" },
    { inf: "detectar", en: "to detect", type: "ar" },
    { inf: "estallar", en: "to explode, to break out", type: "ar" },
    { inf: "hallar", en: "to find (formal)", type: "ar" },
    { inf: "acoger", en: "to welcome, to take in", type: "er" },
    { inf: "integrarse", en: "to integrate, to fit in", type: "ar" },
    { inf: "socorrer", en: "to help, to come to the aid of", type: "er" },
    { inf: "aislar", en: "to isolate", type: "ar", stem: "\xED" },
    { inf: "producirse", en: "to occur, to happen", type: "ir", forms: { presente: ["produzco", "produces", "produce", "producimos", "produc\xEDs", "producen"], preterito: ["produje", "produjiste", "produjo", "produjimos", "produjisteis", "produjeron"], presubj: ["produzca", "produzcas", "produzca", "produzcamos", "produzc\xE1is", "produzcan"] } },
    { inf: "comercializar", en: "to market, to commercialize", type: "ar" },
    { inf: "subastar", en: "to auction", type: "ar" },
    { inf: "fidelizar", en: "to build customer loyalty", type: "ar" },
    { inf: "traspasar", en: "to transfer, to hand over", type: "ar" },
    { inf: "vestir", en: "to dress, to wear", type: "ir", stem: "i" },
    { inf: "rozar", en: "to brush against, to touch lightly", type: "ar" },
    { inf: "desembolsar", en: "to pay out, to disburse", type: "ar" },
    { inf: "aplazar", en: "to postpone", type: "ar" },
    { inf: "agilizar", en: "to speed up", type: "ar" },
    { inf: "malgastar", en: "to waste (money)", type: "ar" },
    { inf: "agravarse", en: "to worsen", type: "ar" },
    { inf: "agudizarse", en: "to intensify, to get worse", type: "ar" },
    { inf: "incubar", en: "to incubate", type: "ar" },
    { inf: "degenerar", en: "to degenerate", type: "ar" },
    { inf: "gozar", en: "to enjoy", type: "ar" },
    { inf: "extenderse", en: "to spread, to extend", type: "er", stem: "ie" },
    { inf: "inflamar", en: "to inflame", type: "ar" },
    { inf: "infectar", en: "to infect", type: "ar" },
    { inf: "cicatrizar", en: "to heal (a wound), to scar over", type: "ar" },
    { inf: "picar", en: "to itch, to sting, to bite", type: "ar" },
    { inf: "escocer", en: "to sting (skin)", type: "er", forms: { presente: ["escuezo", "escueces", "escuece", "escocemos", "escoc\xE9is", "escuecen"], presubj: ["escueza", "escuezas", "escueza", "escozamos", "escoz\xE1is", "escuezan"] } },
    { inf: "delirar", en: "to be delirious, to rave", type: "ar" },
    { inf: "desmayarse", en: "to faint", type: "ar" },
    { inf: "desvanecerse", en: "to vanish, to faint", type: "er" },
    { inf: "donar", en: "to donate", type: "ar" },
    { inf: "inyectar", en: "to inject", type: "ar" },
    { inf: "dosificar", en: "to dose, to administer in doses", type: "ar" },
    { inf: "ingerir", en: "to ingest", type: "ir", stem: "ie" },
    { inf: "tolerar", en: "to tolerate", type: "ar" },
    { inf: "enjabonar", en: "to soap up, to lather", type: "ar" },
    { inf: "depilarse", en: "to wax, to remove hair", type: "ar" },
    { inf: "te\xF1irse", en: "to dye one's hair", type: "ir", stem: "i" },
    { inf: "dejarse", en: "to let oneself, to leave behind", type: "ar" },
    { inf: "darse", en: "to happen, to occur; to give oneself to", type: "er", forms: { presente: ["doy", "das", "da", "damos", "dais", "dan"], preterito: ["di", "diste", "dio", "dimos", "disteis", "dieron"], presubj: ["d\xE9", "des", "d\xE9", "demos", "deis", "den"] } },
    { inf: "orientarse", en: "to get one's bearings, to orient oneself", type: "ar" },
    { inf: "acercarse", en: "to approach, to get closer", type: "ar" },
    { inf: "alejarse", en: "to move away, to distance oneself", type: "ar" },
    { inf: "desear", en: "to wish, to desire", type: "ar" },
    { inf: "trasladarse", en: "to move, to relocate", type: "ar" },
    { inf: "desplazarse", en: "to move, to travel", type: "ar" },
    { inf: "ascender", en: "to ascend, to be promoted", type: "er", stem: "ie" },
    { inf: "trepar", en: "to climb (using hands)", type: "ar" },
    { inf: "descender", en: "to descend", type: "er", stem: "ie" },
    { inf: "deslizarse", en: "to slide, to slip", type: "ar" },
    { inf: "tripular", en: "to crew, to man (a vessel)", type: "ar" },
    { inf: "balancearse", en: "to sway, to rock", type: "ar" },
    { inf: "naufragar", en: "to be shipwrecked", type: "ar" },
    { inf: "sobrevolar", en: "to fly over", type: "ar", stem: "ue" },
    { inf: "lanzarse", en: "to launch oneself, to dive", type: "ar" },
    { inf: "circular", en: "to circulate, to drive around", type: "ar" },
    { inf: "infringir", en: "to infringe, to break (a law)", type: "ir" },
    { inf: "pisar", en: "to step on", type: "ar" },
    { inf: "derrapar", en: "to skid", type: "ar" },
    { inf: "patinar", en: "to skate, to skid", type: "ar" },
    { inf: "empujar", en: "to push", type: "ar" },
    { inf: "remolcar", en: "to tow", type: "ar" },
    { inf: "remunerar", en: "to remunerate, to pay", type: "ar" },
    { inf: "amortizar", en: "to pay off, to amortize", type: "ar" },
    { inf: "rentabilizar", en: "to make profitable", type: "ar" },
    { inf: "devaluarse", en: "to devalue, to lose value", type: "ar", stem: "\xFA" },
    { inf: "depreciarse", en: "to depreciate", type: "ar" },
    { inf: "revalorizarse", en: "to increase in value", type: "ar" },
    { inf: "cotizar", en: "to be quoted (stock), to be valued", type: "ar" },
    { inf: "endeudarse", en: "to go into debt", type: "ar" },
    { inf: "patrocinar", en: "to sponsor", type: "ar" },
    { inf: "propagar", en: "to spread, to propagate", type: "ar" },
    { inf: "quebrar", en: "to go bankrupt, to break", type: "ar", stem: "ie" },
    { inf: "expandirse", en: "to expand", type: "ir" },
    { inf: "disolverse", en: "to dissolve", type: "er", part: "disuelto", forms: { presente: ["disuelvo", "disuelves", "disuelve", "disolvemos", "disolv\xE9is", "disuelven"], presubj: ["disuelva", "disuelvas", "disuelva", "disolvamos", "disolv\xE1is", "disuelvan"] } },
    { inf: "arruinarse", en: "to go bankrupt, to be ruined", type: "ar" },
    { inf: "industrializar", en: "to industrialize", type: "ar" },
    { inf: "cosechar", en: "to harvest", type: "ar" },
    { inf: "orde\xF1ar", en: "to milk (an animal)", type: "ar" },
    { inf: "extinguirse", en: "to become extinct", type: "ir" },
    { inf: "comprimir", en: "to compress", type: "ir" },
    { inf: "asociarse", en: "to form a partnership, to associate", type: "ar" },
    { inf: "agruparse", en: "to group together", type: "ar" },
    { inf: "confederarse", en: "to form a confederation", type: "ar" },
    { inf: "federarse", en: "to federate, to join a federation", type: "ar" },
    { inf: "marginar", en: "to marginalize", type: "ar" },
    { inf: "discriminar", en: "to discriminate", type: "ar" },
    { inf: "segregar", en: "to segregate", type: "ar" },
    { inf: "legislar", en: "to legislate", type: "ar" },
    { inf: "testificar", en: "to testify", type: "ar" },
    { inf: "burlar", en: "to evade, to deceive", type: "ar" },
    { inf: "invadir", en: "to invade", type: "ir" },
    { inf: "asaltar", en: "to assault, to mug", type: "ar" },
    { inf: "derrotar", en: "to defeat", type: "ar" },
    { inf: "desarmar", en: "to disarm", type: "ar" },
    { inf: "rendirse", en: "to surrender", type: "ir", stem: "i" },
    { inf: "desertar", en: "to desert", type: "ar" },
    { inf: "alabar", en: "to praise", type: "ar" },
    { inf: "tasar", en: "to appraise, to value", type: "ar" },
    { inf: "falsificar", en: "to falsify, to forge", type: "ar" },
    { inf: "rehabilitar", en: "to rehabilitate, to renovate", type: "ar" },
    { inf: "habilitar", en: "to enable, to equip", type: "ar" },
    { inf: "debutar", en: "to make one's debut", type: "ar" },
    { inf: "improvisar", en: "to improvise", type: "ar" },
    { inf: "meterse", en: "to get into, to meddle", type: "er" },
    { inf: "reencarnarse", en: "to reincarnate", type: "ar" },
    { inf: "resucitar", en: "to resurrect, to come back to life", type: "ar" },
    { inf: "salvarse", en: "to be saved", type: "ar" },
    { inf: "condenarse", en: "to be damned", type: "ar" },
    { inf: "desembocar", en: "to flow into, to lead to", type: "ar" },
    { inf: "desbordarse", en: "to overflow", type: "ar" },
    { inf: "abonar", en: "to pay, to fertilize", type: "ar" },
    { inf: "lloviznar", en: "to drizzle", type: "ar" },
    { inf: "tronar", en: "to thunder", type: "ar", stem: "ue" },
    { inf: "ladrar", en: "to bark", type: "ar" },
    { inf: "rugir", en: "to roar", type: "ir" },
    { inf: "galopar", en: "to gallop", type: "ar" },
    { inf: "trotar", en: "to trot", type: "ar" },
    { inf: "embestir", en: "to charge at, to ram", type: "ir", stem: "i" },
    { inf: "reptar", en: "to crawl, to slither", type: "ar" },
    { inf: "aparearse", en: "to mate", type: "ar" },
    { inf: "reproducirse", en: "to reproduce (biologically)", type: "ir", forms: { presente: ["reproduzco", "reproduces", "reproduce", "reproducimos", "reproduc\xEDs", "reproducen"], preterito: ["reproduje", "reprodujiste", "reprodujo", "reprodujimos", "reprodujisteis", "reprodujeron"], presubj: ["reproduzca", "reproduzcas", "reproduzca", "reproduzcamos", "reproduzc\xE1is", "reproduzcan"] } },
    { inf: "injertar", en: "to graft", type: "ar" },
    { inf: "podar", en: "to prune", type: "ar" },
    { inf: "fertilizar", en: "to fertilize", type: "ar" },
    { inf: "fumigar", en: "to fumigate", type: "ar" },
    { inf: "germinar", en: "to germinate", type: "ar" },
    { inf: "temblar", en: "to tremble, to shake", type: "ar", stem: "ie" },
    { inf: "filtrar", en: "to filter", type: "ar" },
    { inf: "repoblar", en: "to repopulate, to reforest", type: "ar", stem: "ue" },
    { inf: "reforestar", en: "to reforest", type: "ar" },
    { inf: "quejarse", en: "to complain", type: "ar" },
    { inf: "reencontrarse", en: "to meet again, to be reunited", type: "ar", like: "encontrarse" },
    { inf: "animar", en: "to encourage, to cheer up", type: "ar" },
    { inf: "criticar", en: "to criticize", type: "ar" },
    { inf: "sobrevivir", en: "to survive", type: "ir" },
    { inf: "notar", en: "to notice", type: "ar" },
    { inf: "extra\xF1ar", en: "to miss (a person/place), to find strange", type: "ar" },
    { inf: "desconectar", en: "to disconnect, to unplug", type: "ar" },
    { inf: "apetecer", en: "to feel like, to fancy (dative, like gustar)", type: "er" },
    { inf: "decepcionar", en: "to disappoint", type: "ar" },
    { inf: "durar", en: "to last", type: "ar" },
    { inf: "denunciar", en: "to report (a crime), to denounce", type: "ar" },
    { inf: "agradecer", en: "to thank, to be grateful for", type: "er" },
    { inf: "sospechar", en: "to suspect", type: "ar" },
    { inf: "verter", en: "to pour, to dump (waste)", type: "er", stem: "ie" },
    { inf: "reflejar", en: "to reflect", type: "ar" },
    { inf: "retrasarse", en: "to be delayed, to run late", type: "ar" },
    { inf: "optar", en: "to opt (for), to choose", type: "ar" },
    { inf: "comprometerse", en: "to commit (to something)", type: "er" },
    { inf: "motivar", en: "to motivate", type: "ar" },
    { inf: "bromear", en: "to joke around", type: "ar" },
    { inf: "negarse", en: "to refuse", type: "ar", stem: "ie" },
    { inf: "renunciar", en: "to resign, to give up (a right)", type: "ar" },
    { inf: "pronunciarse", en: "to state a position, to take a stance", type: "ar" },
    { inf: "ceder", en: "to give in, to yield", type: "er" },
    { inf: "discrepar", en: "to disagree", type: "ar" },
    { inf: "coincidir", en: "to coincide, to agree", type: "ir" },
    { inf: "justificar", en: "to justify", type: "ar" },
    { inf: "argumentar", en: "to argue, to make a case", type: "ar" },
    { inf: "persistir", en: "to persist", type: "ir" },
    { inf: "desafiar", en: "to defy, to challenge", type: "ar", forms: { presente: ["desaf\xEDo", "desaf\xEDas", "desaf\xEDa", "desafiamos", "desafi\xE1is", "desaf\xEDan"], presubj: ["desaf\xEDe", "desaf\xEDes", "desaf\xEDe", "desafiemos", "desafi\xE9is", "desaf\xEDen"] } },
    { inf: "acordar", en: "to agree on, to resolve (jointly)", type: "ar", stem: "ue" },
    { inf: "desistir", en: "to desist, to give up (an attempt)", type: "ir" },
    { inf: "acatar", en: "to comply with, to abide by", type: "ar" },
    { inf: "zanjar", en: "to settle, to put an end to (a dispute)", type: "ar" },
    { inf: "talar", en: "to fell, to cut down (trees)", type: "ar" },
    { inf: "preservar", en: "to preserve", type: "ar" },
    { inf: "anhelar", en: "to long for, to yearn for", type: "ar" },
    { inf: "a\xF1orar", en: "to miss, to feel nostalgic for", type: "ar" },
    { inf: "apreciar", en: "to appreciate, to value", type: "ar" },
    { inf: "frustrar", en: "to frustrate, to thwart", type: "ar" },
    { inf: "desconfiar", en: "to distrust", type: "ar", forms: { presente: ["desconf\xEDo", "desconf\xEDas", "desconf\xEDa", "desconfiamos", "desconfi\xE1is", "desconf\xEDan"], presubj: ["desconf\xEDe", "desconf\xEDes", "desconf\xEDe", "desconfiemos", "desconfi\xE9is", "desconf\xEDen"] } },
    { inf: "supervisar", en: "to supervise", type: "ar" },
    { inf: "reestructurar", en: "to restructure", type: "ar" },
    { inf: "empeorar", en: "to worsen, to get worse", type: "ar" },
    { inf: "contagiar", en: "to infect, to pass on (an illness)", type: "ar" },
    { inf: "especializarse", en: "to specialize", type: "ar" },
    { inf: "evaluar", en: "to evaluate, to assess", type: "ar", forms: { presente: ["eval\xFAo", "eval\xFAas", "eval\xFAa", "evaluamos", "evalu\xE1is", "eval\xFAan"], presubj: ["eval\xFAe", "eval\xFAes", "eval\xFAe", "evaluemos", "evalu\xE9is", "eval\xFAen"] } },
    { inf: "bloquear", en: "to block", type: "ar" },
    { inf: "silenciar", en: "to silence, to mute", type: "ar" },
    { inf: "suscribirse", en: "to subscribe", type: "ir" },
    { inf: "censurar", en: "to censor", type: "ar" },
    { inf: "reconciliarse", en: "to reconcile, to make up", type: "ar" },
    { inf: "traicionar", en: "to betray", type: "ar" },
    { inf: "acusar", en: "to accuse", type: "ar" },
    { inf: "imponer", en: "to impose", type: "er", like: "poner" },
    { inf: "demandar", en: "to sue", type: "ar" },
    { inf: "condenar", en: "to convict, to sentence", type: "ar" },
    { inf: "absolver", en: "to acquit", type: "er", stem: "ue" },
    { inf: "apelar", en: "to appeal", type: "ar" },
    { inf: "indemnizar", en: "to compensate (legally)", type: "ar" },
    { inf: "multar", en: "to fine", type: "ar" },
    { inf: "caber", en: "to fit", type: "er", forms: { presente: ["quepo", "cabes", "cabe", "cabemos", "cab\xE9is", "caben"], preterito: ["cupe", "cupiste", "cupo", "cupimos", "cupisteis", "cupieron"], futuro: ["cabr\xE9", "cabr\xE1s", "cabr\xE1", "cabremos", "cabr\xE9is", "cabr\xE1n"], condicional: ["cabr\xEDa", "cabr\xEDas", "cabr\xEDa", "cabr\xEDamos", "cabr\xEDais", "cabr\xEDan"], presubj: ["quepa", "quepas", "quepa", "quepamos", "quep\xE1is", "quepan"] }, added: true },
    { inf: "satisfacer", en: "to satisfy", type: "er", part: "satisfecho", tuCmd: "satisfaz", forms: { presente: ["satisfago", "satisfaces", "satisface", "satisfacemos", "satisfac\xE9is", "satisfacen"], preterito: ["satisfice", "satisficiste", "satisfizo", "satisficimos", "satisficisteis", "satisficieron"], futuro: ["satisfar\xE9", "satisfar\xE1s", "satisfar\xE1", "satisfaremos", "satisfar\xE9is", "satisfar\xE1n"], condicional: ["satisfar\xEDa", "satisfar\xEDas", "satisfar\xEDa", "satisfar\xEDamos", "satisfar\xEDais", "satisfar\xEDan"], presubj: ["satisfaga", "satisfagas", "satisfaga", "satisfagamos", "satisfag\xE1is", "satisfagan"] }, added: true },
    { inf: "actuar", en: "to act", type: "ar", stem: "\xFA", added: true },
    { inf: "averiguar", en: "to find out", type: "ar", added: true },
    { inf: "reunir", en: "to gather, to bring together", type: "ir", forms: { presente: ["re\xFAno", "re\xFAnes", "re\xFAne", "reunimos", "reun\xEDs", "re\xFAnen"], presubj: ["re\xFAna", "re\xFAnas", "re\xFAna", "reunamos", "reun\xE1is", "re\xFAnan"] }, added: true },
    { inf: "reunirse", en: "to meet, to get together", type: "ir", forms: { presente: ["re\xFAno", "re\xFAnes", "re\xFAne", "reunimos", "reun\xEDs", "re\xFAnen"], presubj: ["re\xFAna", "re\xFAnas", "re\xFAna", "reunamos", "reun\xE1is", "re\xFAnan"] }, added: true },
    { inf: "graduar", en: "to adjust, to grade", type: "ar", stem: "\xFA", added: true },
    { inf: "graduarse", en: "to graduate", type: "ar", stem: "\xFA", added: true },
    { inf: "fre\xEDr", en: "to fry", type: "ir", like: "re\xEDr", part: "frito", partAlt: ["fre\xEDdo"], added: true },
    { inf: "predecir", en: "to predict", type: "ir", like: "decir", tuCmd: "predice", added: true },
    { inf: "deshacer", en: "to undo, to unpack", type: "er", like: "hacer", added: true },
    { inf: "torcer", en: "to twist", type: "er", stem: "ue", added: true },
    { inf: "soler", en: "to usually (do)", type: "er", stem: "ue", added: true },
    { inf: "so\xF1ar", en: "to dream", type: "ar", stem: "ue", added: true },
    { inf: "volar", en: "to fly", type: "ar", stem: "ue", added: true },
    { inf: "morder", en: "to bite", type: "er", stem: "ue", added: true },
    { inf: "mentir", en: "to lie (tell lies)", type: "ir", stem: "ie", added: true },
    { inf: "medir", en: "to measure", type: "ir", stem: "i", added: true },
    { inf: "impedir", en: "to prevent", type: "ir", stem: "i", added: true },
    { inf: "competir", en: "to compete", type: "ir", stem: "i", added: true },
    { inf: "requerir", en: "to require", type: "ir", stem: "ie", added: true },
    { inf: "herir", en: "to wound, to hurt", type: "ir", stem: "ie", added: true },
    { inf: "rendir", en: "to yield, to perform", type: "ir", stem: "i", added: true },
    { inf: "gemir", en: "to moan", type: "ir", stem: "i", added: true },
    { inf: "despertar", en: "to wake (someone) up", type: "ar", stem: "ie", added: true },
    { inf: "acostar", en: "to put to bed", type: "ar", stem: "ue", added: true },
    { inf: "acordarse", en: "to remember", type: "ar", stem: "ue", added: true },
    { inf: "almorzar", en: "to have lunch", type: "ar", stem: "ue", added: true },
    { inf: "forzar", en: "to force", type: "ar", stem: "ue", added: true },
    { inf: "tostar", en: "to toast", type: "ar", stem: "ue", added: true },
    { inf: "volcar", en: "to overturn, to tip over", type: "ar", stem: "ue", added: true },
    { inf: "encerrar", en: "to lock up, to shut in", type: "ar", stem: "ie", added: true },
    { inf: "extender", en: "to extend, to spread", type: "er", stem: "ie", added: true },
    { inf: "tender", en: "to tend to, to hang out (washing)", type: "er", stem: "ie", added: true },
    { inf: "disolver", en: "to dissolve", type: "er", stem: "ue", added: true },
    { inf: "revolver", en: "to stir, to mess up", type: "er", stem: "ue", added: true },
    { inf: "perseguir", en: "to chase, to pursue", type: "ir", like: "seguir", added: true },
    { inf: "proseguir", en: "to proceed, to continue", type: "ir", like: "seguir", added: true },
    { inf: "sostener", en: "to hold, to sustain", type: "er", like: "tener", added: true },
    { inf: "disponer", en: "to arrange, to have available", type: "er", like: "poner", added: true },
    { inf: "oponer", en: "to oppose, to set against", type: "er", like: "poner", added: true },
    { inf: "reponer", en: "to replace, to restock", type: "er", like: "poner", added: true },
    { inf: "descomponer", en: "to break down, to decompose", type: "er", like: "poner", added: true },
    { inf: "provenir", en: "to come from", type: "ir", like: "venir", added: true },
    { inf: "sobresalir", en: "to stand out", type: "ir", like: "salir", added: true },
    { inf: "equivaler", en: "to be equivalent", type: "er", like: "valer", added: true },
    { inf: "decaer", en: "to decline", type: "er", like: "caer", added: true },
    { inf: "recaer", en: "to relapse", type: "er", like: "caer", added: true },
    { inf: "distraer", en: "to distract", type: "er", like: "traer", added: true },
    { inf: "sustraer", en: "to subtract, to remove", type: "er", like: "traer", added: true },
    { inf: "criar", en: "to raise, to bring up", type: "ar", stem: "\xED", added: true },
    { inf: "confiar", en: "to trust", type: "ar", stem: "\xED", added: true },
    { inf: "variar", en: "to vary", type: "ar", stem: "\xED", added: true },
    { inf: "ampliar", en: "to expand, to enlarge", type: "ar", stem: "\xED", added: true },
    { inf: "esquiar", en: "to ski", type: "ar", stem: "\xED", added: true },
    { inf: "vaciar", en: "to empty", type: "ar", stem: "\xED", added: true },
    { inf: "acentuar", en: "to accentuate, to stress", type: "ar", stem: "\xFA", added: true },
    { inf: "destruir", en: "to destroy", type: "ir", added: true },
    { inf: "sustituir", en: "to replace, to substitute", type: "ir", added: true },
    { inf: "excluir", en: "to exclude", type: "ir", added: true },
    { inf: "atribuir", en: "to attribute", type: "ir", added: true },
    { inf: "disminuir", en: "to decrease", type: "ir", added: true },
    { inf: "instruir", en: "to instruct", type: "ir", added: true },
    { inf: "poseer", en: "to own, to possess", type: "er", added: true },
    { inf: "proveer", en: "to provide, to supply", type: "er", part: "provisto", partAlt: ["prove\xEDdo"], added: true },
    { inf: "inscribir", en: "to enrol, to register", type: "ir", added: true },
    { inf: "suscribir", en: "to sign, to endorse", type: "ir", added: true },
    { inf: "prescribir", en: "to prescribe", type: "ir", added: true },
    { inf: "transcribir", en: "to transcribe", type: "ir", added: true },
    { inf: "encubrir", en: "to cover up", type: "ir", added: true },
    { inf: "permanecer", en: "to remain", type: "er", added: true },
    { inf: "desaparecer", en: "to disappear", type: "er", added: true },
    { inf: "pretender", en: "to aim to, to intend", type: "er", added: true },
    { inf: "prender", en: "to switch on, to light", type: "er", added: true },
    { inf: "surgir", en: "to arise, to emerge", type: "ir", added: true },
    { inf: "fingir", en: "to pretend", type: "ir", added: true },
    { inf: "emerger", en: "to emerge", type: "er", added: true },
    { inf: "encargar", en: "to order, to entrust", type: "ar", added: true },
    { inf: "soportar", en: "to bear, to put up with", type: "ar", added: true },
    { inf: "suprimir", en: "to abolish, to delete", type: "ir", added: true },
    { inf: "agregar", en: "to add", type: "ar", added: true },
    { inf: "implicar", en: "to imply, to involve", type: "ar", added: true },
    { inf: "obligar", en: "to force, to oblige", type: "ar", added: true },
    { inf: "rodear", en: "to surround", type: "ar", added: true },
    { inf: "elevar", en: "to raise", type: "ar", added: true },
    { inf: "figurar", en: "to appear, to figure", type: "ar", added: true },
    { inf: "enfrentar", en: "to face, to confront", type: "ar", added: true },
    { inf: "sacudir", en: "to shake", type: "ir", added: true },
    { inf: "unir", en: "to join, to unite", type: "ir", added: true },
    { inf: "atar", en: "to tie", type: "ar", added: true },
    { inf: "tardar", en: "to take (time), to be late", type: "ar", added: true },
    { inf: "sobrar", en: "to be left over", type: "ar", added: true },
    { inf: "mencionar", en: "to mention", type: "ar", added: true },
    { inf: "suspirar", en: "to sigh", type: "ar", added: true },
    { inf: "golpear", en: "to hit", type: "ar", added: true },
    { inf: "lanzar", en: "to throw, to launch", type: "ar", added: true },
    { inf: "toser", en: "to cough", type: "er", added: true },
    { inf: "corromper", en: "to corrupt", type: "er", added: true },
    { inf: "afligir", en: "to afflict, to distress", type: "ir", added: true },
    { inf: "ce\xF1ir", en: "to fit tightly, to stick to", type: "ir", stem: "i", added: true },
    { inf: "halar", en: "to pull", type: "ar", added: true },
    { inf: "profundizar", en: "to deepen, to go deeper", type: "ar", added: true }
  ];

  // lib/engine/verbs.ts
  var VERBS = verbs_default;
  var BY_INF = /* @__PURE__ */ new Map();
  for (const v of VERBS) if (!BY_INF.has(v.inf)) BY_INF.set(v.inf, v);
  function verbByInf(inf) {
    var _a2;
    return (_a2 = BY_INF.get(inf)) != null ? _a2 : null;
  }

  // lib/engine/ortho.ts
  var ACUTE = { a: "\xE1", e: "\xE9", i: "\xED", o: "\xF3", u: "\xFA" };
  var PLAIN = { \u00E1: "a", \u00E9: "e", \u00ED: "i", \u00F3: "o", \u00FA: "u" };
  function deaccent(s) {
    return s.replace(/[áéíóú]/g, (c) => PLAIN[c]);
  }
  var VOWELS = "aeiou\xE1\xE9\xED\xF3\xFA\xFC";
  function isVowel(c) {
    return !!c && VOWELS.includes(c);
  }
  var isStrong = (c) => "aeo\xE1\xE9\xF3".includes(c);
  var isAccented = (c) => "\xE1\xE9\xED\xF3\xFA".includes(c);
  function accentLastVowel(s) {
    for (let i = s.length - 1; i >= 0; i--) {
      const a = ACUTE[s[i]];
      if (a) return s.slice(0, i) + a + s.slice(i + 1);
    }
    return s;
  }
  function nuclei(word) {
    const w = word.toLowerCase();
    const out = [];
    let i = 0;
    const vowelAt = (k) => {
      var _a2;
      const c = w[k];
      if (!isVowel(c)) return false;
      if (c === "u" && k > 0 && (w[k - 1] === "g" || w[k - 1] === "q") && "ei\xE9\xED".includes((_a2 = w[k + 1]) != null ? _a2 : "")) return false;
      return true;
    };
    while (i < w.length) {
      if (!vowelAt(i)) {
        i++;
        continue;
      }
      let start = i;
      i++;
      while (i < w.length && vowelAt(i)) {
        const prev2 = w[i - 1], cur = w[i];
        const hiatus = isStrong(prev2) && isStrong(cur) || (cur === "\xED" || cur === "\xFA") && isStrong(prev2) || (prev2 === "\xED" || prev2 === "\xFA") && isStrong(cur);
        if (hiatus) {
          out.push([start, i]);
          start = i;
        }
        i++;
      }
      out.push([start, i]);
    }
    return out;
  }
  function stressedNucleus(word) {
    const ns = nuclei(word);
    if (ns.length <= 1) return 0;
    for (let k = 0; k < ns.length; k++) {
      const [a, b] = ns[k];
      for (let j = a; j < b; j++) if (isAccented(word[j])) return k;
    }
    return /[aeiouns]$/.test(deaccent(word.toLowerCase())) ? ns.length - 2 : ns.length - 1;
  }
  function accentNucleusAt(word, k) {
    const ns = nuclei(word);
    if (!ns[k]) return word;
    const [a, b] = ns[k];
    for (let j = a; j < b; j++) if (isAccented(word[j])) return word;
    let pos = -1;
    for (let j = a; j < b; j++) if (isStrong(word[j])) {
      pos = j;
      break;
    }
    if (pos < 0) pos = b - 1;
    const acc = ACUTE[word[pos]];
    return acc ? word.slice(0, pos) + acc + word.slice(pos + 1) : word;
  }
  function accentMonosyllable(word) {
    return accentNucleusAt(word, nuclei(word).length - 1);
  }
  function isHiatusAccent(word, i) {
    const c = word[i];
    if (c !== "\xED" && c !== "\xFA") return false;
    const prev2 = word[i - 1] === "h" ? word[i - 2] : word[i - 1];
    const next = word[i + 1] === "h" ? word[i + 2] : word[i + 1];
    return !!prev2 && isStrong(prev2) || !!next && isStrong(next);
  }
  function removeAccents(word, keepHiatus) {
    let out = "";
    for (let i = 0; i < word.length; i++) {
      const c = word[i];
      out += isAccented(c) && !(keepHiatus && isHiatusAccent(word, i)) ? PLAIN[c] : c;
    }
    return out;
  }
  function attachEnclitic(word, enclitic) {
    const n = nuclei(word).length;
    const s = stressedNucleus(word);
    const fromEnd = n - 1 - s + nuclei(enclitic).length;
    let w = word;
    if (fromEnd >= 2) {
      w = accentNucleusAt(w, s);
    } else {
      w = removeAccents(w, true);
    }
    return w + enclitic;
  }
  function monosyllable2010(word) {
    if (word === "d\xE9" || word === "s\xE9") return word;
    if (!/[áéíóú]/.test(word)) return word;
    if (nuclei(deaccent(word)).length !== 1) return word;
    for (let i = 0; i < word.length; i++) {
      if (isAccented(word[i]) && isHiatusAccent(word, i)) return word;
    }
    return deaccent(word);
  }

  // lib/engine/conjugate.ts
  var PERSONS = ["yo", "t\xFA", "\xE9l/ella", "nosotros", "vosotros", "ellos"];
  var IMP_PERSONS = ["t\xFA", "usted", "nosotros", "vosotros", "ustedes"];
  var PRODUCTION_PERSONS = ["yo", "t\xFA", "\xE9l/ella", "nosotros", "ellos"];
  var PRODUCTION_IMP_PERSONS = ["t\xFA", "usted", "nosotros", "ustedes"];
  var TENSES = [
    { key: "presente", label: "Presente", group: "indicative" },
    { key: "preterito", label: "Pret\xE9rito", group: "indicative" },
    { key: "imperfecto", label: "Imperfecto", group: "indicative" },
    { key: "futuro", label: "Futuro", group: "indicative" },
    { key: "condicional", label: "Condicional", group: "indicative" },
    { key: "perfecto", label: "Presente perfecto", group: "compound" },
    { key: "plusc", label: "Pluscuamperfecto", group: "compound" },
    { key: "futperf", label: "Futuro perfecto", group: "compound" },
    { key: "condperf", label: "Condicional perfecto", group: "compound" },
    { key: "presubj", label: "Presente de subjuntivo", group: "subjunctive" },
    { key: "impsubj", label: "Imperfecto de subjuntivo", group: "subjunctive" },
    { key: "impsubjse", label: "Imperfecto de subjuntivo (-se)", group: "subjunctive", variantOf: "impsubj" },
    { key: "perfsubj", label: "Pret\xE9rito perfecto de subj.", group: "subjunctive" },
    { key: "pluscsubj", label: "Pluscuamperfecto de subj.", group: "subjunctive" },
    { key: "pluscsubjse", label: "Pluscuamperfecto de subj. (hubiese)", group: "subjunctive", variantOf: "pluscsubj" },
    { key: "futsubj", label: "Futuro de subjuntivo", group: "subjunctive", recognitionOnly: true },
    { key: "imperativo", label: "Imperativo (afirmativo)", group: "imperative" },
    { key: "impneg", label: "Imperativo (negativo)", group: "imperative" }
  ];
  var TENSE_LABEL = Object.fromEntries(TENSES.map((t) => [t.key, t.label]));
  function isRecognitionOnly(tense) {
    var _a2;
    return !!((_a2 = TENSES.find((t) => t.key === tense)) == null ? void 0 : _a2.recognitionOnly);
  }
  var END = {
    presente: { ar: ["o", "as", "a", "amos", "\xE1is", "an"], er: ["o", "es", "e", "emos", "\xE9is", "en"], ir: ["o", "es", "e", "imos", "\xEDs", "en"] },
    preterito: { ar: ["\xE9", "aste", "\xF3", "amos", "asteis", "aron"], er: ["\xED", "iste", "i\xF3", "imos", "isteis", "ieron"], ir: ["\xED", "iste", "i\xF3", "imos", "isteis", "ieron"] },
    imperfecto: { ar: ["aba", "abas", "aba", "\xE1bamos", "abais", "aban"], er: ["\xEDa", "\xEDas", "\xEDa", "\xEDamos", "\xEDais", "\xEDan"], ir: ["\xEDa", "\xEDas", "\xEDa", "\xEDamos", "\xEDais", "\xEDan"] },
    futuro: { all: ["\xE9", "\xE1s", "\xE1", "emos", "\xE9is", "\xE1n"] },
    condicional: { all: ["\xEDa", "\xEDas", "\xEDa", "\xEDamos", "\xEDais", "\xEDan"] },
    presubj: { ar: ["e", "es", "e", "emos", "\xE9is", "en"], er: ["a", "as", "a", "amos", "\xE1is", "an"], ir: ["a", "as", "a", "amos", "\xE1is", "an"] }
  };
  var ENDING_TENSES = ["presente", "preterito", "imperfecto", "futuro", "condicional", "presubj"];
  var MODEL_VERBS = { ar: "hablar", er: "comer", ir: "vivir" };
  function endingsFor(tense, cls) {
    const t = END[tense];
    return "all" in t ? t.all : t[cls];
  }
  var HABER = {
    perfecto: ["he", "has", "ha", "hemos", "hab\xE9is", "han"],
    plusc: ["hab\xEDa", "hab\xEDas", "hab\xEDa", "hab\xEDamos", "hab\xEDais", "hab\xEDan"],
    futperf: ["habr\xE9", "habr\xE1s", "habr\xE1", "habremos", "habr\xE9is", "habr\xE1n"],
    condperf: ["habr\xEDa", "habr\xEDas", "habr\xEDa", "habr\xEDamos", "habr\xEDais", "habr\xEDan"],
    perfsubj: ["haya", "hayas", "haya", "hayamos", "hay\xE1is", "hayan"],
    pluscsubj: ["hubiera", "hubieras", "hubiera", "hubi\xE9ramos", "hubierais", "hubieran"],
    pluscsubjse: ["hubiese", "hubieses", "hubiese", "hubi\xE9semos", "hubieseis", "hubiesen"]
  };
  var COMPOUND_TENSES = Object.keys(HABER);
  function isCompound(tense) {
    return tense in HABER;
  }
  var COMPOUND_OF_HABER = {
    presente: "perfecto",
    imperfecto: "plusc",
    futuro: "futperf",
    condicional: "condperf",
    presubj: "perfsubj",
    impsubj: "pluscsubj",
    impsubjse: "pluscsubjse"
  };
  function stemOf(inf) {
    return inf.slice(0, -2);
  }
  function vowelOf(inf) {
    const e = inf.slice(-2);
    if (e === "\xEDr") return "ir";
    return e;
  }
  function isReflexive(inf) {
    return /(arse|erse|irse|írse)$/.test(inf);
  }
  function reflexiveBase(inf) {
    return inf.slice(0, -2);
  }
  function bare(v) {
    return isReflexive(v.inf) ? { ...v, inf: reflexiveBase(v.inf) } : v;
  }
  function resolveLike(v) {
    if (!v.like) return null;
    const likeBare = isReflexive(v.like) ? reflexiveBase(v.like) : v.like;
    if (!v.inf.endsWith(likeBare)) return null;
    const b = verbByInf(v.like);
    if (!b) return null;
    const base = bare(b);
    if (base.inf === v.inf && base.like === v.like) return null;
    return { base, likeBare };
  }
  function prefixForms(inf, likeInf, forms2) {
    const pre = inf.slice(0, inf.length - likeInf.length);
    if (!pre) return forms2.slice();
    return forms2.map((f) => {
      if (!f) return f;
      return f.split(" ").map((word, i) => {
        if (i > 0) return word;
        const mono = !/[áéíóú]/.test(word) && nuclei(word).length === 1 && (isVowel(word.charAt(word.length - 1)) || /[ns]$/.test(word));
        return pre + (mono ? accentMonosyllable(word) : word);
      }).join(" ");
    });
  }
  var PART_FAMILIES = [
    [/olver$/, "uelto"],
    // volver, devolver, resolver, absolver, disolver
    [/poner$/, "puesto"],
    // poner, componer, oponer, descomponer
    [/scribir$/, "scrito"],
    // escribir, describir, suscribir, inscribir
    [/cubrir$/, "cubierto"],
    // cubrir, descubrir, encubrir
    [/^((?:des|re)?)hacer$/, "$1hecho"],
    // hacer, deshacer, rehacer
    [/facer$/, "fecho"],
    // satisfacer
    [/^((?:pre|contra|des)?)decir$/, "$1dicho"],
    // not bendecir/maldecir (bendecido)
    [/^((?:pre|entre|re)?)ver$/, "$1visto"],
    // not mover/llover/atreverse
    [/^((?:entre|re)?)abrir$/, "$1abierto"],
    [/^romper$/, "roto"],
    // corromper is regular
    [/^morir$/, "muerto"],
    [/freír$/, "frito"],
    [/imprimir$/, "impreso"],
    [/proveer$/, "provisto"]
  ];
  function familyParticiple(inf) {
    for (const [re, to] of PART_FAMILIES) if (re.test(inf)) return inf.replace(re, to);
    return null;
  }
  function reflexiveDefer(v, field) {
    const b = bare(v);
    if (v[field]) return b;
    const base = verbByInf(b.inf);
    return base && !isReflexive(base.inf) ? base : b;
  }
  function participle(v) {
    if (isReflexive(v.inf)) return participle(reflexiveDefer(v, "part"));
    if (v.part) return v.part;
    const lk = resolveLike(v);
    if (lk) return prefixForms(v.inf, lk.likeBare, [participle(lk.base)])[0];
    const fam = familyParticiple(v.inf);
    if (fam) return fam;
    const stem2 = stemOf(v.inf);
    if (vowelOf(v.inf) === "ar") return stem2 + "ado";
    if (/[aeo]$/.test(stem2)) return stem2 + "\xEDdo";
    return stem2 + "ido";
  }
  function participles(v) {
    var _a2;
    const main = participle(v);
    return [main, ...((_a2 = v.partAlt) != null ? _a2 : []).filter((p) => p !== main)];
  }
  function gerund(v) {
    if (isReflexive(v.inf)) return gerund(reflexiveDefer(v, "ger"));
    if (v.ger) return v.ger;
    const lk = resolveLike(v);
    if (lk) return prefixForms(v.inf, lk.likeBare, [gerund(lk.base)])[0];
    const cls = vowelOf(v.inf);
    let stem2 = stemOf(v.inf);
    if (cls === "ar") return stem2 + "ando";
    if (cls === "ir" && v.stem && SECONDARY[v.stem]) stem2 = changeLastVowel(stem2, SECONDARY[v.stem]);
    if (/(ñ|ll)$/.test(stem2)) return stem2 + "endo";
    if (isVowel(stem2.charAt(stem2.length - 1)) && !/[gq]u$/.test(stem2)) return stem2 + "yendo";
    return stem2 + "iendo";
  }
  var SECONDARY = { ie: "i", ue: "u", i: "i", "\xED": "\xED", "\xFA": "\xFA" };
  function changeLastVowel(stem2, target) {
    for (let i = stem2.length - 1; i >= 0; i--) {
      if (!isVowel(stem2[i])) continue;
      if (stem2[i] === "u" && i > 0 && (stem2[i - 1] === "g" || stem2[i - 1] === "q")) continue;
      return stem2.slice(0, i) + target + stem2.slice(i + 1);
    }
    return stem2;
  }
  var inBoot = (idx) => idx === 0 || idx === 1 || idx === 2 || idx === 5;
  function stemFor(v, base, tense, idx, cls) {
    const sc = v.stem;
    if (!sc || !SECONDARY[sc]) return base;
    const second = SECONDARY[sc];
    if (tense === "presente") return inBoot(idx) ? changeLastVowel(base, sc) : base;
    if (tense === "presubj") {
      if (inBoot(idx)) return changeLastVowel(base, sc);
      return cls === "ir" ? changeLastVowel(base, second) : base;
    }
    if (tense === "preterito" && cls === "ir" && (idx === 2 || idx === 5)) return changeLastVowel(base, second);
    return base;
  }
  var ZC_RE = /[aeiou]c(er|ir)$/;
  var UIR_RE = /[^gq]uir$/;
  function joinForm(stem2, ending, inf, cls) {
    const e0 = ending.charAt(0);
    const front = e0 === "e" || e0 === "\xE9" || e0 === "i" || e0 === "\xED";
    const back = e0 === "a" || e0 === "\xE1" || e0 === "o" || e0 === "\xF3";
    if (cls === "ar") {
      if (front) {
        if (/gu$/.test(stem2)) return stem2.slice(0, -2) + "g\xFC" + ending;
        if (/c$/.test(stem2)) return stem2.slice(0, -1) + "qu" + ending;
        if (/g$/.test(stem2)) return stem2 + "u" + ending;
        if (/z$/.test(stem2)) return stem2.slice(0, -1) + "c" + ending;
      }
    } else {
      if (back) {
        if (ZC_RE.test(inf) && /c$/.test(stem2)) return stem2.slice(0, -1) + "zc" + ending;
        if (/qu$/.test(stem2)) return stem2.slice(0, -2) + "c" + ending;
        if (/gu$/.test(stem2)) return stem2.slice(0, -1) + ending;
        if (/g$/.test(stem2)) return stem2.slice(0, -1) + "j" + ending;
        if (/c$/.test(stem2)) return stem2.slice(0, -1) + "z" + ending;
      }
      if (/(ñ|ll)$/.test(stem2) && (ending === "i\xF3" || ending === "ieron")) return stem2 + ending.slice(1);
      if (isVowel(stem2.charAt(stem2.length - 1)) && !/[gq]u$/.test(stem2)) {
        if (ending === "i\xF3") return stem2 + "y\xF3";
        if (ending === "ieron") return stem2 + "yeron";
        if (UIR_RE.test(inf) && (back || e0 === "e")) return stem2 + "y" + ending;
        if (/[aeo]$/.test(stem2) && e0 === "i") return stem2 + "\xED" + ending.slice(1);
      }
    }
    return stem2 + ending;
  }
  function regular(v, tense) {
    const cls = vowelOf(v.inf);
    if (tense === "futuro" || tense === "condicional") {
      const fbase = deaccent(v.inf);
      return endingsFor(tense, cls).map((e) => fbase + e);
    }
    const base = stemOf(v.inf);
    return endingsFor(tense, cls).map((e, idx) => joinForm(stemFor(v, base, tense, idx, cls), e, v.inf, cls));
  }
  function likeTuCmd(v) {
    var _a2;
    const lk = resolveLike(v);
    if (!lk) return null;
    const cmd = (_a2 = lk.base.tuCmd) != null ? _a2 : likeTuCmd(lk.base);
    return cmd ? prefixForms(v.inf, lk.likeBare, [cmd])[0] : null;
  }
  function conjugateBase(v, tense) {
    var _a2, _b, _c, _d;
    if (isCompound(tense)) {
      const p = participle(v);
      return HABER[tense].map((h) => h + " " + p);
    }
    if (tense === "impsubj" || tense === "impsubjse" || tense === "futsubj") {
      const base = conjugateBase(v, "preterito")[5].replace(/ron$/, "");
      const e = tense === "impsubj" ? "ra" : tense === "impsubjse" ? "se" : "re";
      return [base + e, base + e + "s", base + e, accentLastVowel(base) + e + "mos", base + e + "is", base + e + "n"];
    }
    if (tense === "imperativo") {
      const pres = conjugateBase(v, "presente");
      const subj = conjugateBase(v, "presubj");
      return [
        (_b = (_a2 = v.tuCmd) != null ? _a2 : likeTuCmd(v)) != null ? _b : pres[2],
        // tú
        subj[2],
        // usted
        (_c = v.nosCmd) != null ? _c : subj[3],
        // nosotros
        v.inf.slice(0, -1) + "d",
        // vosotros
        subj[5]
        // ustedes
      ];
    }
    if (tense === "impneg") {
      const s = conjugateBase(v, "presubj");
      return [s[1], s[2], s[3], s[4], s[5]].map((f) => "no " + f);
    }
    const stored = (_d = v.forms) == null ? void 0 : _d[tense];
    if (stored) return stored.slice();
    const lk = resolveLike(v);
    if (lk) return prefixForms(v.inf, lk.likeBare, conjugateBase(lk.base, tense));
    return regular(v, tense);
  }
  var REFLEX_PRON = ["me", "te", "se", "nos", "os", "se"];
  function reflexivize(forms2, tense, baseInf) {
    if (tense === "imperativo") {
      return forms2.map((f, i) => {
        if (!f) return f;
        if (i === 2) return attachEnclitic(f.slice(0, -1), "nos");
        if (i === 3) {
          if (baseInf === "ir") return "idos";
          const stem2 = f.slice(0, -1);
          const s = vowelOf(baseInf) === "ir" && !/[áéíóú]/.test(stem2) ? accentLastVowel(stem2) : stem2;
          return s + "os";
        }
        return attachEnclitic(f, i === 0 ? "te" : "se");
      });
    }
    if (tense === "impneg") {
      const pron = ["te", "se", "nos", "os", "se"];
      return forms2.map((f, i) => f ? f.replace(/^no /, "no " + pron[i] + " ") : f);
    }
    return forms2.map((f, i) => f ? REFLEX_PRON[i] + " " + f : f);
  }
  function fix2010(form2) {
    const fixed = form2.split(" ").map(monosyllable2010).join(" ");
    return fixed === form2 ? { form: form2 } : { form: fixed, legacy: form2 };
  }
  function asVerb(v) {
    if (typeof v !== "string") return v;
    const found = verbByInf(v);
    if (!found) throw new Error(`unknown verb: ${v}`);
    return found;
  }
  function conjugateBareCells(v, tense) {
    return conjugateBase(bare(asVerb(v)), tense).map(fix2010);
  }
  function conjugateCells(v, tense) {
    const verb = asVerb(v);
    if (isReflexive(verb.inf)) {
      const b = bare(verb);
      return reflexivize(conjugateBase(b, tense), tense, b.inf).map(fix2010);
    }
    return conjugateBase(verb, tense).map(fix2010);
  }
  function conjugate(v, tense) {
    return conjugateCells(v, tense).map((c) => c.form);
  }
  function personsFor(tense) {
    return tense === "imperativo" || tense === "impneg" ? IMP_PERSONS : PERSONS;
  }
  function acceptedForms(v, tense, idx) {
    var _a2;
    const verb = asVerb(v);
    const out = /* @__PURE__ */ new Set();
    const add2 = (c) => {
      if (c) {
        out.add(c.form);
        if (c.legacy) out.add(c.legacy);
      }
    };
    add2(conjugateCells(verb, tense)[idx]);
    if (tense === "impsubj") add2(conjugateCells(verb, "impsubjse")[idx]);
    if (tense === "pluscsubj") add2(conjugateCells(verb, "pluscsubjse")[idx]);
    if (isCompound(tense) && ((_a2 = verb.partAlt) == null ? void 0 : _a2.length)) {
      const main = participle(verb);
      for (const f of [...out]) for (const alt of verb.partAlt) out.add(f.replace(new RegExp(main + "$"), alt));
    }
    return [...out];
  }
  function isIrregular(v) {
    return !!(v.forms || v.part || v.ger || v.tuCmd);
  }
  function isIrregularIn(v, tense) {
    if (!v) return false;
    if (v.forms && v.forms[tense]) return true;
    if (v.like) return true;
    if (v.stem) {
      if (tense === "presente" || tense === "presubj" || tense === "imperativo") return true;
      if (tense === "preterito" && vowelOf(v.inf) === "ir") return true;
    }
    return false;
  }
  function voseoForms(v) {
    const b = bare(asVerb(v));
    const pres = conjugateBareCells(b, "presente");
    const vosPres = pres[4].form.replace(/([aeoáéó])i(s)$/, "$1$2");
    const imp = conjugateBareCells(b, "imperativo");
    let vosImp = null;
    if (b.inf !== "ir" && /d$/.test(imp[3].form)) {
      const stem2 = imp[3].form.slice(0, -1);
      const n = nuclei(stem2).length;
      if (n > 1) vosImp = /[áéíóú]/.test(stem2) ? stem2 : accentLastNucleus(stem2);
    }
    return {
      presente: vosPres !== pres[1].form ? vosPres : null,
      imperativo: vosImp && vosImp !== imp[0].form ? vosImp : null
    };
  }
  function accentLastNucleus(word) {
    const ns = nuclei(word);
    const [a, b] = ns[ns.length - 1];
    return word.slice(0, a) + accentMonosyllable(word.slice(a, b)) + word.slice(b);
  }

  // lib/engine/analyze.ts
  var IDX = null;
  var PART_IDX = /* @__PURE__ */ new Map();
  var HABER_IDX = /* @__PURE__ */ new Map();
  function push(m, k, v) {
    const list = m.get(k);
    if (list) list.push(v);
    else m.set(k, [v]);
  }
  function ensureIndex() {
    var _a2;
    if (IDX) return IDX;
    const idx = /* @__PURE__ */ new Map();
    PART_IDX = /* @__PURE__ */ new Map();
    HABER_IDX = /* @__PURE__ */ new Map();
    for (const v of VERBS) {
      const type = vowelOf(isReflexive(v.inf) ? reflexiveBase(v.inf) : v.inf);
      for (const t of TENSES) {
        const persons = personsFor(t.key);
        if (isCompound(t.key)) {
          const parts = /* @__PURE__ */ new Set([participle(v), ...(_a2 = v.partAlt) != null ? _a2 : []]);
          for (const p of parts) push(PART_IDX, deaccent(p.toLowerCase()), { inf: v.inf, tense: t.key });
          continue;
        }
        conjugateBareCells(v, t.key).forEach((cell, i) => {
          const lw = cell.form.toLowerCase();
          if (lw.includes(" ")) return;
          const person = persons[i];
          push(idx, deaccent(lw), {
            inf: v.inf,
            tense: t.key,
            person,
            form: cell.form,
            type,
            ...cell.legacy ? { legacy: cell.legacy.toLowerCase() } : {},
            ...person === "vosotros" ? { variety: "vosotros" } : {}
          });
        });
      }
      const vos = voseoForms(v);
      if (vos.presente) push(idx, deaccent(vos.presente), { inf: v.inf, tense: "presente", person: "vos", form: vos.presente, type, variety: "voseo" });
      if (vos.imperativo) push(idx, deaccent(vos.imperativo), { inf: v.inf, tense: "imperativo", person: "vos", form: vos.imperativo, type, variety: "voseo" });
    }
    const haber = verbByInf("haber");
    if (haber) {
      for (const tk of ["presente", "imperfecto", "futuro", "condicional", "presubj", "impsubj", "impsubjse"]) {
        conjugate(haber, tk).forEach((form2, i) => {
          const k = deaccent(form2.toLowerCase());
          if (!k.includes(" ")) push(HABER_IDX, k, { tense: tk, person: PERSONS[i] });
        });
      }
    }
    IDX = idx;
    return idx;
  }
  function tokenize(text) {
    return (text || "").toLowerCase().replace(/[^a-záéíóúñü\s]/g, " ").split(/\s+/).filter(Boolean);
  }
  var FUNCTION_WORDS = /* @__PURE__ */ new Set(["de", "se", "esta", "estas", "hacia", "solo", "si", "aun", "mas", "te", "mi", "tu", "el"]);
  var SUPPRESS = new Map(Object.entries({
    una: ["unir"],
    unas: ["unir"],
    sobre: ["sobrar"],
    tarde: ["tardar"],
    tardes: ["tardar"],
    enfrente: ["enfrentar"],
    "fr\xEDo": ["fre\xEDr"],
    "fr\xEDa": ["fre\xEDr"],
    "fr\xEDas": ["fre\xEDr"]
  }).map(([k, v]) => [k, new Set(v)]));
  var CLITICS = ["me", "te", "se", "lo", "la", "le", "nos", "os", "los", "las", "les"];
  var MONO_IMPERATIVES = /* @__PURE__ */ new Set(["da", "di", "ve", "ven", "pon", "sal", "ten", "haz", "se", "oye"]);
  var CLITIC_STOPLIST = /* @__PURE__ */ new Set(["dios", "vela", "velas", "velo", "velos", "dale", "dalia", "tenor"]);
  function stripClitics(t) {
    const out = [];
    for (const c1 of CLITICS) {
      if (t.length <= c1.length + 1 || !t.endsWith(c1)) continue;
      const b1 = t.slice(0, -c1.length);
      out.push({ base: b1, clitics: [c1] });
      for (const c2 of CLITICS) {
        if (b1.length <= c2.length + 1 || !b1.endsWith(c2)) continue;
        out.push({ base: b1.slice(0, -c2.length), clitics: [c2, c1] });
      }
    }
    return out;
  }
  function toAnalysis(e, accentExact, clitics) {
    const a = {
      inf: e.inf,
      tense: e.tense,
      person: e.person,
      form: e.form,
      type: e.type,
      accentExact,
      target: !e.variety && !isRecognitionOnly(e.tense)
    };
    if (clitics) a.clitics = clitics;
    if (e.variety) a.variety = e.variety;
    return a;
  }
  function analyzeBare(t, withVoseo = true) {
    var _a2;
    const out = [];
    for (const e of (_a2 = ensureIndex().get(deaccent(t))) != null ? _a2 : []) {
      const exact = e.form.toLowerCase() === t || e.legacy === t;
      if (e.variety === "voseo" && (!exact || !withVoseo)) continue;
      out.push(toAnalysis(e, exact));
    }
    return out;
  }
  function analyzeToken(tok) {
    const t = tok.toLowerCase();
    let list = analyzeBare(t);
    if (FUNCTION_WORDS.has(t)) list = list.filter((a) => a.accentExact);
    const suppressed = SUPPRESS.get(t);
    if (suppressed) list = list.filter((a) => !suppressed.has(a.inf));
    if (list.length) return list;
    if (CLITIC_STOPLIST.has(t)) return [];
    const accented = /[áéíóú]/.test(t);
    const found = [];
    const seen = /* @__PURE__ */ new Set();
    for (const cand of stripClitics(t)) {
      const single = cand.clitics.length === 1;
      const vosOs = single && cand.clitics[0] === "os";
      const bases = vosOs ? [{ b: deaccent(cand.base) + "d", free: true }, ...deaccent(cand.base) === "id" ? [{ b: "id", free: true }] : []] : [{ b: cand.base, free: false }, { b: deaccent(cand.base), free: false }];
      for (const x of bases) {
        for (const a of analyzeBare(x.b, false)) {
          if (a.tense !== "imperativo") continue;
          if (vosOs && !isReflexive(a.inf)) continue;
          const vosD = a.person === "vosotros" && /d$/.test(x.b) && single;
          if (!accented && !x.free && !vosD && !MONO_IMPERATIVES.has(deaccent(x.b))) continue;
          const k = a.inf + a.person + cand.clitics.join("");
          if (seen.has(k)) continue;
          seen.add(k);
          found.push({ ...a, accentExact: true, clitics: cand.clitics });
        }
      }
    }
    return found;
  }
  function isParticiple(tok) {
    ensureIndex();
    return PART_IDX.has(deaccent(tok.toLowerCase()));
  }
  function participlesOf(tok) {
    var _a2;
    ensureIndex();
    return (_a2 = PART_IDX.get(deaccent(tok.toLowerCase()))) != null ? _a2 : [];
  }
  function haberAnalyses(tok) {
    var _a2;
    ensureIndex();
    return (_a2 = HABER_IDX.get(deaccent(tok.toLowerCase()))) != null ? _a2 : [];
  }
  function analyzeSentence(text) {
    const toks = tokenize(text);
    const verbs = [];
    const compounds = [];
    toks.forEach((tk, i) => {
      const a = analyzeToken(tk);
      if (a.length) verbs.push({ token: tk, index: i, analyses: a });
      const hb = haberAnalyses(tk);
      if (hb.length) {
        for (let j = i + 1; j <= i + 2 && j < toks.length; j++) {
          if (isParticiple(toks[j])) {
            const tenses = [...new Set(hb.map((h) => COMPOUND_OF_HABER[h.tense]).filter((x) => !!x))];
            compounds.push({ haber: tk, participle: toks[j], haberIndex: i, participleIndex: j, haberAnalyses: hb, parts: participlesOf(toks[j]), tenses });
            break;
          }
        }
      }
    });
    return { text, tokens: toks, verbs, compounds };
  }
  var LEGACY = null;
  function legacySpellings() {
    if (LEGACY) return LEGACY;
    const m = /* @__PURE__ */ new Map();
    for (const list of ensureIndex().values()) for (const e of list) if (e.legacy) m.set(e.form.toLowerCase(), e.legacy);
    LEGACY = m;
    return m;
  }

  // lib/engine/english.ts
  var EN_SUBJECTS = ["I", "you", "he/she", "we", "you all", "they"];
  var EN_IMP_PERSONS = ["t\xFA", "usted", "nosotros", "vosotros", "ustedes"];
  var EN_IRREGULAR = {
    be: ["was", "been"],
    have: ["had", "had"],
    do: ["did", "done"],
    go: ["went", "gone"],
    say: ["said", "said"],
    see: ["saw", "seen"],
    give: ["gave", "given"],
    know: ["knew", "known"],
    put: ["put", "put"],
    come: ["came", "come"],
    leave: ["left", "left"],
    bring: ["brought", "brought"],
    fall: ["fell", "fallen"],
    hear: ["heard", "heard"],
    sleep: ["slept", "slept"],
    feel: ["felt", "felt"],
    read: ["read", "read"],
    drive: ["drove", "driven"],
    think: ["thought", "thought"],
    begin: ["began", "begun"],
    understand: ["understood", "understood"],
    lose: ["lost", "lost"],
    find: ["found", "found"],
    show: ["showed", "shown"],
    cost: ["cost", "cost"],
    pay: ["paid", "paid"],
    take: ["took", "taken"],
    write: ["wrote", "written"],
    break: ["broke", "broken"],
    speak: ["spoke", "spoken"],
    buy: ["bought", "bought"],
    win: ["won", "won"],
    sing: ["sang", "sung"],
    eat: ["ate", "eaten"],
    drink: ["drank", "drunk"],
    run: ["ran", "run"],
    sell: ["sold", "sold"],
    forget: ["forgot", "forgotten"],
    draw: ["drew", "drawn"],
    swim: ["swam", "swum"],
    hide: ["hid", "hidden"],
    build: ["built", "built"],
    /* The sixty heads below are irregular in English and were producing
     * "I have geted", "I have becomed", "I have seted out" — get alone is the
     * gloss head of 29 Spanish verbs, so this was visible everywhere a
     * conjugation is prompted by meaning rather than by label. */
    get: ["got", "got"],
    become: ["became", "become"],
    make: ["made", "made"],
    throw: ["threw", "thrown"],
    cut: ["cut", "cut"],
    freeze: ["froze", "frozen"],
    grow: ["grew", "grown"],
    sit: ["sat", "sat"],
    spread: ["spread", "spread"],
    broadcast: ["broadcast", "broadcast"],
    choose: ["chose", "chosen"],
    fight: ["fought", "fought"],
    hold: ["held", "held"],
    keep: ["kept", "kept"],
    let: ["let", "let"],
    send: ["sent", "sent"],
    shrink: ["shrank", "shrunk"],
    spend: ["spent", "spent"],
    stick: ["stuck", "stuck"],
    bear: ["bore", "borne"],
    bend: ["bent", "bent"],
    bet: ["bet", "bet"],
    blow: ["blew", "blown"],
    deal: ["dealt", "dealt"],
    feed: ["fed", "fed"],
    flee: ["fled", "fled"],
    fly: ["flew", "flown"],
    forbid: ["forbade", "forbidden"],
    forgive: ["forgave", "forgiven"],
    grind: ["ground", "ground"],
    hang: ["hung", "hung"],
    hurt: ["hurt", "hurt"],
    lend: ["lent", "lent"],
    lie: ["lay", "lain"],
    mean: ["meant", "meant"],
    meet: ["met", "met"],
    overcome: ["overcame", "overcome"],
    ride: ["rode", "ridden"],
    rise: ["rose", "risen"],
    set: ["set", "set"],
    sew: ["sewed", "sewn"],
    shine: ["shone", "shone"],
    shoot: ["shot", "shot"],
    sink: ["sank", "sunk"],
    slide: ["slid", "slid"],
    sow: ["sowed", "sown"],
    spin: ["spun", "spun"],
    spit: ["spat", "spat"],
    split: ["split", "split"],
    stand: ["stood", "stood"],
    steal: ["stole", "stolen"],
    sting: ["stung", "stung"],
    swear: ["swore", "sworn"],
    teach: ["taught", "taught"],
    upset: ["upset", "upset"],
    wake: ["woke", "woken"],
    wear: ["wore", "worn"],
    withdraw: ["withdrew", "withdrawn"],
    // regular verbs whose -ed spelling doubles the final consonant
    prefer: ["preferred", "preferred"],
    occur: ["occurred", "occurred"],
    permit: ["permitted", "permitted"],
    admit: ["admitted", "admitted"]
  };
  function enBaseAndQualifier(en) {
    let qualifier = null;
    let rest = en;
    const m = rest.match(/\(([^)]+)\)/);
    if (m) {
      qualifier = m[1];
      rest = rest.replace(m[0], "").replace(/\s+/g, " ").trim();
    }
    const first = rest.split(/\s*[/,]\s*/)[0].trim().replace(/^to\s+/, "");
    return { base: first, qualifier };
  }
  function enPresent3rd(head) {
    if (head === "have") return "has";
    if (/[^aeiou]y$/.test(head)) return head.slice(0, -1) + "ies";
    if (/(sh|ch|[sxzo])$/.test(head)) return head + "es";
    return head + "s";
  }
  function enPast(head) {
    const irr = EN_IRREGULAR[head];
    if (irr) return irr[0];
    if (/[^aeiou]y$/.test(head)) return head.slice(0, -1) + "ied";
    if (/e$/.test(head)) return head + "d";
    return head + "ed";
  }
  function enParticiple(head) {
    const irr = EN_IRREGULAR[head];
    return irr ? irr[1] : enPast(head);
  }
  var reattach = (h, rest) => rest ? h + " " + rest : h;
  function enPhrase(v, tense, personIdx) {
    const bq = enBaseAndQualifier(v.en);
    const parts = bq.base.split(" ");
    const head = parts[0], rest = parts.slice(1).join(" ");
    const q = bq.qualifier ? " (" + bq.qualifier + ")" : "";
    let marker = null;
    let phrase;
    if (tense === "imperativo" || tense === "impneg") {
      const p = EN_IMP_PERSONS[personIdx];
      const neg = tense === "impneg";
      if (p === "nosotros") phrase = (neg ? "let's not " : "let's ") + bq.base + "!";
      else {
        phrase = (neg ? "don't " : "") + reattach(head, rest) + "!";
        marker = p;
      }
      return { text: phrase + q, marker };
    }
    const subj = EN_SUBJECTS[personIdx];
    const withSubj = (vp) => subj + " " + vp;
    const has = personIdx === 2 ? "has" : "have";
    const subjunctive = tense === "presubj" || tense === "impsubj" || tense === "impsubjse" || tense === "perfsubj" || tense === "pluscsubj" || tense === "pluscsubjse" || tense === "futsubj";
    if (head === "be" && tense === "presente") {
      phrase = withSubj(reattach(["am", "are", "is", "are", "are", "are"][personIdx], rest));
    } else if (head === "be" && (tense === "preterito" || tense === "impsubj" || tense === "impsubjse")) {
      phrase = withSubj(reattach(["was", "were", "was", "were", "were", "were"][personIdx], rest));
    } else {
      switch (tense) {
        case "presente":
          phrase = withSubj(personIdx === 2 ? reattach(enPresent3rd(head), rest) : reattach(head, rest));
          break;
        case "preterito":
          phrase = withSubj(reattach(enPast(head), rest));
          break;
        case "imperfecto":
          phrase = withSubj("used to " + reattach(head, rest));
          break;
        case "futuro":
          phrase = withSubj("will " + reattach(head, rest));
          break;
        case "condicional":
          phrase = withSubj("would " + reattach(head, rest));
          break;
        case "perfecto":
        case "perfsubj":
          phrase = withSubj(has + " " + reattach(enParticiple(head), rest));
          break;
        case "plusc":
        case "pluscsubj":
        case "pluscsubjse":
          phrase = withSubj("had " + reattach(enParticiple(head), rest));
          break;
        case "futperf":
          phrase = withSubj("will have " + reattach(enParticiple(head), rest));
          break;
        case "condperf":
          phrase = withSubj("would have " + reattach(enParticiple(head), rest));
          break;
        case "presubj":
        case "futsubj":
          phrase = withSubj(reattach(head, rest));
          break;
        case "impsubj":
        case "impsubjse":
          phrase = withSubj(reattach(enPast(head), rest));
          break;
      }
    }
    if (subjunctive) marker = "subjunctive";
    return { text: phrase + q, marker };
  }

  // lib/engine/index.ts
  function normalize(s) {
    return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  // lib/tagger/index.ts
  var tagger_exports = {};
  __export(tagger_exports, {
    DEFAULT_NODE_MAP: () => DEFAULT_NODE_MAP,
    DIALECT_LEXICON: () => DIALECT_LEXICON,
    SpecError: () => SpecError,
    accentLint: () => accentLint,
    addKnownForms: () => addKnownForms,
    analyzeWords: () => analyzeWords,
    closedClass: () => closedClass,
    detectablePatterns: () => detectablePatterns,
    dialectLint: () => dialectLint,
    focusSpan: () => focusSpan,
    formClass: () => formClass,
    isKnownForm: () => isKnownForm,
    isName: () => isName,
    isSpec: () => isSpec,
    lemmatize: () => lemmatize,
    lexEntry: () => lexEntry,
    mappedKeys: () => mappedKeys,
    parseSpec: () => parseSpec,
    patternFeatures: () => patternFeatures,
    queRole: () => queRole,
    registerLexemes: () => registerLexemes,
    registerNames: () => registerNames,
    resolveNode: () => resolveNode,
    splitSentences: () => splitSentences,
    tagSentence: () => tagSentence,
    tagText: () => tagText,
    tokenize: () => tokenize2
  });

  // lib/tagger/data/lexicon.json
  var lexicon_default = { abandonar: ["v"], abastecimiento: ["n", "m"], abierto: ["n", "m"], abogado: ["n", "m"], abonado: ["n", "m"], abonar: ["v"], abonarse: ["v"], aborrecer: ["v"], aborto: ["n", "m"], abrazar: ["v"], abrazarse: ["v"], abrebotellas: ["n", "m"], abrecartas: ["n", "m"], abrelatas: ["n", "m"], abrigo: ["n", "m"], abrir: ["v"], absolver: ["v"], absorber: ["v"], abstenerse: ["v"], abuela: ["n", "f"], abuelo: ["n", "m"], abuelos: ["n", "m"], abundancia: ["n", "f"], aburrido: ["x"], aburrir: ["v"], aburrirse: ["v"], acabar: ["v"], academia: ["n", "f"], acampar: ["v"], acariciar: ["v"], acatar: ["v"], acceder: ["v"], accidentado: ["n", "m"], accidente: ["n", "m"], accionista: ["n", "m"], acci\u00F3n: ["n", "f"], aceite: ["x"], acelerador: ["n", "m"], acelerar: ["v"], acelgas: ["x"], acentuar: ["v"], aceptar: ["v"], acera: ["n", "f"], acercar: ["v"], acercarse: ["v"], acertar: ["v"], acidez: ["n", "f"], aclarar: ["v"], acogedor: ["n", "m"], acoger: ["v"], acogida: ["n", "f"], acomodador: ["n", "m"], acompa\u00F1ar: ["v"], aconsejar: ["v"], acordar: ["v"], acordarse: ["v"], acortar: ["v"], acoso: ["x"], acostar: ["v"], acostarse: ["v"], acreditar: ["v"], actitud: ["n", "f"], actividad: ["n", "f"], acto: ["n", "m"], actor: ["n", "m"], actriz: ["n", "f"], actuaci\u00F3n: ["n", "f"], actualizaci\u00F3n: ["n", "f"], actualizar: ["v"], actuar: ["v"], acudir: ["v"], acumularse: ["v"], acusado: ["n", "m"], acusar: ["v"], adaptaci\u00F3n: ["n", "f"], adelantamiento: ["n", "m"], adelantar: ["v"], adelgazar: ["v"], adem\u00E1s: ["x"], adhesi\u00F3n: ["n", "f"], adivinar: ["v"], adi\u00F3s: ["x"], adjudicar: ["v"], adjuntar: ["v"], administraci\u00F3n: ["n", "f"], administrador: ["n", "m"], administrar: ["v"], admiraci\u00F3n: ["n", "f"], admirador: ["n", "m"], admirar: ["v"], admitir: ["v"], adn: ["n", "m"], adolescente: ["x"], adoptar: ["v"], adorar: ["v"], adorno: ["n", "m"], adquirir: ["v"], adulterar: ["v"], adversario: ["n", "m"], advertir: ["v"], aeropuerto: ["n", "m"], aerosoles: ["x"], afectar: ["v"], afecto: ["n", "m"], afeitarse: ["v"], afianzar: ["v"], aficionado: ["n", "m"], afici\u00F3n: ["n", "f"], afiliarse: ["v"], afirmar: ["v"], afligir: ["v"], afluente: ["n", "m"], afrontar: ["v"], afueras: ["n", "f"], agacharse: ["v"], agencia: ["n", "f"], agenda: ["n", "f"], agente: ["n", "m"], agilizar: ["v"], agn\u00F3stico: ["n", "m"], agobiado: ["x"], agobiar: ["v"], agobiarse: ["v"], agotar: ["v"], agotarse: ["v"], agradable: ["n", "f"], agradar: ["v"], agradecer: ["v"], agradecido: ["x"], agravarse: ["v"], agregar: ["v"], agresividad: ["n", "f"], agricultor: ["n", "m"], agricultura: ["n", "f"], agrupaci\u00F3n: ["n", "f"], agruparse: ["v"], agr\u00EDcola: ["n", "f"], agua: ["n", "m"], aguantar: ["v"], aguantarse: ["v"], aguas: ["x"], agudizarse: ["v"], aguja: ["n", "f"], ahora: ["x"], ahorrar: ["v"], ahorro: ["n", "m"], ahorros: ["x"], ahumado: ["x"], aire: ["x"], aislamiento: ["n", "m"], aislar: ["v"], ajo: ["n", "m"], alabar: ["v"], alarma: ["n", "f"], alas: ["x"], albahaca: ["n", "f"], alba\u00F1iler\u00EDa: ["n", "f"], albergue: ["n", "m"], albornoz: ["n", "m"], alcantarilla: ["n", "f"], alcanzar: ["v"], alcohol: ["n", "m"], aldea: ["n", "f"], alegrarse: ["v"], alegre: ["x"], alegr\u00EDa: ["n", "f"], alejar: ["v"], alejarse: ["v"], alem\u00E1n: ["n", "m"], alfiler: ["n", "m"], alfombra: ["n", "f"], alga: ["n", "f"], algo: ["x"], algod\u00F3n: ["n", "m"], algoritmo: ["n", "m"], alguien: ["x"], aliado: ["n", "m"], alianza: ["n", "f"], alimentaci\u00F3n: ["n", "f"], alimentar: ["v"], alimento: ["n", "m"], aliviar: ["v"], alivio: ["n", "m"], ali\u00F1ar: ["v"], all\u00ED: ["x"], alma: ["n", "f"], almacenar: ["v"], almac\u00E9n: ["n", "m"], almeja: ["n", "f"], almendras: ["x"], almohadilla: ["n", "f"], almorzar: ["v"], almuerzo: ["n", "m"], alojamiento: ["n", "m"], alojarse: ["v"], alquilar: ["v"], alquiler: ["n", "m"], alrededores: ["x"], altar: ["n", "m"], altas: ["x"], altavoz: ["n", "m"], altitud: ["n", "f"], altruismo: ["n", "m"], altruista: ["n", "f"], alubias: ["x"], alucinar: ["v"], alumbrado: ["n", "m"], aluminio: ["n", "m"], alumnado: ["n", "m"], alumno: ["n", "m"], alzar: ["v"], alzarse: ["v"], amabilidad: ["n", "f"], amable: ["x"], amar: ["v"], amargo: ["n", "m"], amargor: ["n", "m"], amarillo: ["x"], ambicioso: ["x"], ambici\u00F3n: ["n", "f"], ambiente: ["x"], ambulancia: ["n", "f"], ambulatorio: ["n", "m"], amenazar: ["v"], amiga: ["n", "f"], amigo: ["n", "m"], amistad: ["n", "f"], amontonar: ["v"], amor: ["n", "m"], amortizar: ["v"], ampliar: ["v"], amueblado: ["x"], amueblar: ["v"], am\u00E9rica: ["x"], anagrama: ["n", "f"], analg\u00E9sico: ["n", "m"], analizar: ["v"], anarqu\u00EDa: ["n", "f"], anciano: ["n", "m"], andamio: ["n", "m"], andar: ["v"], and\u00E9n: ["n", "m"], anemia: ["n", "f"], anestesiar: ["v"], anestesista: ["n", "f"], anfitri\u00F3n: ["n", "m"], angustia: ["n", "f"], anhelar: ["v"], anillo: ["n", "m"], animado: ["n", "m"], animal: ["n", "m"], animar: ["v"], aniversario: ["n", "m"], anorak: ["n", "m"], anorexia: ["n", "f"], anotar: ["v"], ansiedad: ["n", "f"], antefirma: ["n", "f"], antena: ["n", "f"], antepasados: ["x"], antibi\u00F3tico: ["n", "m"], anticicl\u00F3n: ["n", "m"], anticipar: ["v"], anticipo: ["n", "m"], antiguo: ["n", "m"], antiinflamatorio: ["n", "m"], antip\u00E1tico: ["n", "m"], antivirus: ["n", "m"], anular: ["v"], anunciante: ["x"], anunciar: ["v"], anuncio: ["n", "m"], anuncios: ["x"], an\u00E1lisis: ["n", "m"], an\u00E9cdota: ["n", "f"], apagar: ["v"], apagarse: ["v"], aparcamiento: ["n", "m"], aparcar: ["v"], aparearse: ["v"], aparecer: ["v"], aparejador: ["n", "m"], aparentar: ["v"], apartamento: ["n", "m"], apartotel: ["n", "m"], apasionado: ["n", "m"], apasionamiento: ["n", "m"], apasionar: ["v"], apelar: ["v"], apellidarse: ["v"], apellido: ["n", "m"], apenado: ["x"], aperitivo: ["x"], apetecer: ["v"], apetitoso: ["x"], aplaudir: ["v"], aplazar: ["v"], aplicaci\u00F3n: ["n", "f"], aplicar: ["v"], aportar: ["v"], apostar: ["v"], apoyar: ["v"], apreciaci\u00F3n: ["n", "f"], apreciar: ["v"], aprender: ["v"], aprendiz: ["n", "m"], aprendizaje: ["n", "m"], apretar: ["v"], aprobar: ["v"], aprovechar: ["v"], aproximarse: ["v"], aptitud: ["n", "f"], apuntarse: ["v"], apuntes: ["x"], aqu\u00ED: ["x"], ara\u00F1a: ["n", "f"], ara\u00F1ar: ["v"], arbusto: ["n", "m"], archivador: ["n", "m"], archivar: ["v"], archivo: ["n", "m"], arc\u00E9n: ["n", "m"], ardor: ["n", "m"], arena: ["n", "f"], argumentar: ["v"], argumento: ["n", "m"], aristocracia: ["n", "f"], arist\u00F3crata: ["n", "f"], arma: ["n", "f"], armario: ["n", "m"], armon\u00EDa: ["n", "f"], arquitecto: ["n", "m"], arquitectura: ["n", "f"], arrancar: ["v"], arrastrar: ["v"], arreglar: ["v"], arreglarse: ["v"], arreglo: ["n", "m"], arrepentirse: ["v"], arresto: ["n", "m"], arriesgar: ["v"], arroba: ["n", "f"], arrogancia: ["n", "f"], arrogante: ["x"], arroz: ["n", "m"], arrugado: ["x"], arrugar: ["v"], arruinarse: ["v"], arte: ["x"], arteria: ["n", "f"], artes: ["x"], articulaci\u00F3n: ["n", "f"], articular: ["v"], artista: ["n", "f"], art\u00EDculo: ["n", "m"], art\u00EDstico: ["n", "m"], arzobispo: ["n", "m"], asalariado: ["n", "m"], asaltar: ["v"], asalto: ["n", "m"], asar: ["v"], ascender: ["v"], ascenso: ["n", "m"], ascensor: ["n", "m"], asear: ["v"], asegurar: ["v"], aseo: ["n", "m"], aseos: ["x"], asesinato: ["n", "m"], asesino: ["n", "m"], asia: ["x"], asiento: ["n", "m"], asientos: ["x"], asignatura: ["n", "f"], asilo: ["n", "m"], asimilar: ["v"], asistencia: ["n", "f"], asistente: ["n", "m"], asistir: ["v"], asociaci\u00F3n: ["n", "f"], asociarse: ["v"], asombrar: ["v"], asombrarse: ["v"], aspirante: ["x"], aspirar: ["v"], aspirina: ["n", "f"], asterisco: ["n", "m"], astro: ["n", "m"], astrolog\u00EDa: ["n", "f"], astronauta: ["n", "f"], astronom\u00EDa: ["n", "f"], astr\u00F3nomo: ["n", "m"], asumir: ["v"], asustar: ["v"], asustarse: ["v"], atacar: ["v"], ataque: ["n", "m"], atar: ["v"], atender: ["v"], atentado: ["n", "m"], atenuar: ["v"], ateo: ["n", "m"], aterrizar: ["v"], ate\u00EDsmo: ["n", "m"], atm\u00F3sfera: ["n", "f"], atraco: ["n", "m"], atraer: ["v"], atravesar: ["v"], atreverse: ["v"], atribuir: ["v"], ats: ["n", "m"], at\u00FAn: ["x"], audici\u00F3n: ["n", "f"], audioconferencia: ["n", "f"], auditorio: ["n", "m"], aula: ["n", "f"], aumentar: ["v"], aumento: ["n", "m"], aunque: ["x"], auricular: ["n", "m"], austeridad: ["n", "f"], austero: ["n", "m"], autobiograf\u00EDa: ["n", "f"], autob\u00FAs: ["n", "m"], autoevaluaci\u00F3n: ["n", "f"], autom\u00F3vil: ["x"], autopista: ["n", "f"], autor: ["n", "m"], autorizar: ["v"], autoservicio: ["n", "m"], autov\u00EDa: ["n", "f"], auxiliar: ["n", "m"], auxilio: ["n", "m"], aval: ["n", "m"], avance: ["n", "m"], avanzar: ["v"], ave: ["n", "m"], avellanas: ["x"], avenida: ["n", "f"], aventura: ["n", "f"], avergonzado: ["x"], avergonzarse: ["v"], averiarse: ["v"], averiguar: ["v"], aver\u00EDa: ["n", "f"], aviador: ["n", "m"], avioneta: ["n", "f"], avisar: ["v"], aviso: ["n", "m"], avi\u00F3n: ["n", "m"], ayer: ["x"], ayuda: ["n", "f"], ayudante: ["x"], ayudar: ["v"], ayunar: ["v"], ayuntamiento: ["n", "m"], azafata: ["n", "f"], azul: ["x"], az\u00FAcar: ["n", "m"], a\u00F1adir: ["v"], a\u00F1o: ["n", "m"], a\u00F1orar: ["v"], bache: ["n", "m"], bachillerato: ["n", "m"], bah\u00EDa: ["n", "f"], bailaor: ["n", "m"], bailar: ["v"], bailar\u00EDn: ["n", "m"], baile: ["n", "m"], bajar: ["v"], bajarse: ["v"], bajas: ["x"], bajo: ["n", "m"], bala: ["n", "f"], balada: ["n", "f"], balancearse: ["v"], ballet: ["n", "m"], baloncesto: ["n", "m"], bal\u00F3n: ["n", "m"], banca: ["n", "f"], banco: ["n", "m"], banda: ["n", "f"], bandera: ["n", "f"], banquero: ["n", "m"], banquete: ["x"], bar: ["n", "m"], barajar: ["v"], barato: ["x"], barba: ["n", "f"], barbilla: ["n", "f"], barca: ["n", "f"], barco: ["n", "m"], barman: ["n", "m"], barra: ["n", "f"], barriga: ["n", "f"], barrio: ["n", "m"], bastar: ["v"], basurero: ["n", "m"], bata: ["n", "f"], batalla: ["n", "f"], bater\u00EDa: ["n", "f"], batidora: ["n", "f"], bautismo: ["n", "m"], bautizo: ["n", "m"], bayeta: ["n", "f"], ba\u00F1ador: ["n", "m"], ba\u00F1arse: ["v"], ba\u00F1era: ["n", "f"], ba\u00F1o: ["n", "m"], ba\u00F1os: ["x"], beato: ["n", "m"], beber: ["v"], bebida: ["n", "f"], beb\u00E9: ["n", "m"], beca: ["n", "f"], becario: ["n", "m"], belleza: ["n", "f"], bendecir: ["v"], bendito: ["n", "m"], beneficioso: ["x"], berenjena: ["n", "f"], besar: ["v"], besarse: ["v"], bestia: ["n", "f"], biblia: ["n", "f"], biblioteca: ["n", "f"], bicho: ["n", "m"], bien: ["x"], bienes: ["x"], billete: ["n", "m"], biodiversidad: ["n", "f"], biograf\u00EDa: ["n", "f"], biolog\u00EDa: ["n", "f"], biol\u00F3gico: ["n", "m"], biosfera: ["n", "f"], biotecnolog\u00EDa: ["n", "f"], biquini: ["x"], bisabuelo: ["n", "m"], bisexual: ["x"], bizcocho: ["n", "m"], bi\u00F3logo: ["n", "m"], blanco: ["x"], blando: ["n", "m"], bloquear: ["v"], bloquearse: ["v"], blusa: ["n", "f"], bocadillo: ["n", "m"], boda: ["n", "f"], bodas: ["x"], bol: ["n", "m"], boller\u00EDa: ["n", "f"], bolsa: ["n", "f"], bolsas: ["x"], bolso: ["n", "m"], bol\u00EDgrafo: ["n", "m"], bomba: ["n", "f"], bombardear: ["v"], bombero: ["n", "m"], bombilla: ["n", "f"], bonito: ["x"], bordado: ["n", "m"], borrador: ["n", "m"], borrasca: ["n", "f"], bosque: ["n", "m"], bostezar: ["v"], botas: ["x"], bote: ["n", "m"], botella: ["n", "f"], botiqu\u00EDn: ["n", "m"], bot\u00E1nica: ["n", "f"], bot\u00E1nico: ["n", "m"], bot\u00F3n: ["n", "m"], bozal: ["n", "m"], braga: ["n", "f"], bravo: ["n", "m"], brazo: ["n", "m"], bricolaje: ["n", "m"], brillante: ["n", "m"], brillar: ["v"], brillo: ["n", "m"], brindar: ["v"], brisa: ["n", "f"], bromear: ["v"], bronquitis: ["n", "f"], brotar: ["v"], br\u00FAjula: ["n", "f"], buceador: ["n", "m"], budismo: ["n", "m"], budista: ["n", "f"], buen: ["n", "m"], buena: ["n", "f"], bueno: ["x"], bufanda: ["n", "f"], bufete: ["x"], buf\u00E9: ["n", "m"], buhardilla: ["n", "f"], buitre: ["n", "m"], bungal\u00F3: ["n", "m"], burgues\u00EDa: ["n", "f"], burgu\u00E9s: ["n", "m"], burlar: ["v"], burocracia: ["n", "f"], buscador: ["n", "m"], buscar: ["v"], butaca: ["n", "f"], butacas: ["x"], buzoneo: ["n", "m"], buz\u00F3n: ["n", "m"], caballero: ["n", "m"], caballo: ["n", "m"], caba\u00F1a: ["n", "f"], cabello: ["n", "m"], caber: ["v"], cabeza: ["n", "f"], cabina: ["n", "f"], cable: ["n", "m"], cabo: ["n", "m"], cacharro: ["n", "m"], cachorro: ["n", "m"], cadena: ["n", "f"], cad\u00E1ver: ["n", "m"], caer: ["v"], caerse: ["v"], cafetera: ["n", "f"], cafeter\u00EDa: ["n", "f"], caf\u00E9: ["n", "m"], calabac\u00EDn: ["n", "m"], calcetines: ["x"], calcular: ["v"], calendario: ["n", "m"], calentar: ["v"], caliente: ["x"], calificaci\u00F3n: ["n", "f"], calificar: ["v"], callado: ["n", "m"], calle: ["n", "f"], callejero: ["n", "m"], calmante: ["x"], calmar: ["v"], calor\u00EDas: ["x"], calumnia: ["n", "f"], calzador: ["n", "m"], calzoncillo: ["n", "m"], cama: ["n", "f"], camada: ["n", "f"], camarero: ["n", "m"], camarote: ["n", "m"], cambiar: ["v"], cambio: ["n", "m"], camilla: ["n", "f"], camillero: ["n", "m"], caminar: ["v"], camino: ["n", "m"], camioneta: ["n", "f"], camisa: ["n", "f"], camis\u00F3n: ["n", "m"], cami\u00F3n: ["n", "m"], campa\u00F1a: ["n", "f"], campeonato: ["n", "m"], campesino: ["n", "m"], campestre: ["x"], campin: ["x"], campo: ["n", "m"], campus: ["n", "m"], cana: ["n", "f"], canal: ["n", "m"], cancelar: ["v"], canci\u00F3n: ["n", "f"], candidato: ["n", "m"], canoa: ["n", "f"], canoso: ["x"], cansancio: ["n", "m"], cansar: ["v"], cansarse: ["v"], cantante: ["n", "f"], cantar: ["v"], cantimplora: ["n", "f"], capacidad: ["n", "f"], capaz: ["x"], capilla: ["n", "f"], capital: ["n", "f"], capit\u00E1n: ["n", "m"], capricornio: ["n", "m"], captar: ["v"], captura: ["n", "f"], capturar: ["v"], cap\u00EDtulo: ["n", "m"], cara: ["n", "f"], caracol: ["n", "m"], caracterizarse: ["v"], caramelo: ["n", "m"], caravana: ["n", "f"], carb\u00F3n: ["n", "m"], cardenal: ["n", "m"], cargar: ["v"], cargo: ["n", "m"], carne: ["n", "f"], carnicero: ["n", "m"], carnicer\u00EDa: ["n", "f"], carn\u00E9: ["x"], caro: ["x"], carpeta: ["n", "f"], carpinter\u00EDa: ["n", "f"], carrera: ["n", "f"], carretera: ["n", "f"], carretilla: ["n", "f"], carril: ["x"], carrito: ["n", "m"], carro: ["n", "m"], carta: ["n", "f"], cartearse: ["v"], cartel: ["n", "m"], cartelera: ["n", "f"], cartera: ["n", "f"], cartero: ["n", "m"], cartulina: ["n", "f"], cart\u00EDlago: ["n", "m"], cart\u00F3n: ["n", "m"], car\u00E1cter: ["n", "m"], casa: ["n", "f"], casado: ["x"], casarse: ["v"], cascada: ["n", "f"], casco: ["n", "m"], casero: ["n", "m"], casilla: ["n", "f"], caspa: ["n", "f"], castillo: ["n", "m"], catar: ["v"], catarata: ["n", "f"], catedral: ["n", "f"], catedr\u00E1tico: ["n", "m"], catolicismo: ["n", "m"], cat\u00E1logo: ["n", "m"], cat\u00E1strofe: ["n", "f"], cat\u00F3lico: ["n", "m"], cauce: ["n", "m"], caudal: ["n", "m"], caudaloso: ["x"], causar: ["v"], cava: ["n", "f"], cazador: ["n", "m"], cazadora: ["n", "f"], cazo: ["n", "m"], cazuela: ["n", "f"], ca\u00EDda: ["n", "f"], ca\u00F1a: ["n", "f"], ca\u00F1\u00F3n: ["n", "m"], cdrom: ["x"], cebolla: ["n", "f"], ceder: ["v"], ceja: ["n", "f"], celebraci\u00F3n: ["n", "f"], celebrar: ["v"], celo: ["n", "m"], celoso: ["x"], celular: ["v"], cemento: ["n", "m"], cena: ["n", "f"], cenar: ["v"], censurar: ["v"], centollo: ["n", "m"], centralita: ["n", "f"], centralizar: ["v"], centrar: ["v"], centrifugado: ["n", "m"], centrifugar: ["v"], centro: ["n", "m"], cepillarse: ["v"], cepillo: ["n", "m"], cerca: ["x"], cerdo: ["n", "m"], cereales: ["x"], cerebro: ["n", "m"], ceremonia: ["n", "f"], cereza: ["n", "f"], cerrar: ["v"], certamen: ["n", "m"], certificado: ["n", "m"], certificar: ["v"], cerveza: ["n", "f"], cesar: ["v"], cese: ["n", "m"], cesta: ["n", "f"], ces\u00E1rea: ["n", "f"], ce\u00F1ido: ["x"], ce\u00F1ir: ["v"], chabola: ["n", "f"], chaleco: ["n", "m"], chal\u00E9: ["x"], champ\u00E1n: ["n", "m"], champ\u00FA: ["x"], chaparr\u00F3n: ["n", "m"], chapista: ["n", "f"], charla: ["n", "f"], charlar: ["v"], chat: ["x"], chatear: ["v"], chef: ["x"], cheque: ["n", "m"], chequeo: ["n", "m"], chica: ["n", "f"], chico: ["n", "m"], chiringuito: ["n", "m"], chirlas: ["x"], chocolate: ["x"], chorizo: ["n", "m"], choza: ["n", "f"], chucher\u00EDas: ["x"], chupar: ["v"], ch\u00E1ndal: ["n", "m"], cibercaf\u00E9: ["n", "m"], ciberespacio: ["n", "m"], cicatrizar: ["v"], ciclista: ["n", "m"], ciego: ["n", "m"], cielo: ["n", "m"], cien: ["x"], ciencia: ["n", "f"], cient\u00EDfico: ["n", "m"], cigala: ["n", "f"], cig\u00FCe\u00F1a: ["n", "f"], cima: ["n", "f"], cinco: ["x"], cine: ["n", "m"], cintura: ["n", "f"], cintur\u00F3n: ["n", "m"], circulaci\u00F3n: ["n", "f"], circular: ["v"], cirug\u00EDa: ["n", "f"], cirujano: ["n", "m"], cita: ["n", "f"], citar: ["v"], ciudad: ["n", "f"], ciudadano: ["n", "m"], ciudadan\u00EDa: ["n", "f"], civil: ["x"], clara: ["n", "f"], clarinete: ["n", "m"], clase: ["n", "f"], clasicismo: ["n", "m"], clasificar: ["v"], clasificarse: ["v"], claustro: ["n", "m"], clausura: ["n", "f"], clausurar: ["v"], cliente: ["n", "m"], clientela: ["n", "f"], clima: ["n", "m"], clip: ["x"], club: ["n", "m"], cl\u00E1usula: ["n", "f"], cl\u00EDnica: ["n", "f"], coartada: ["n", "f"], cobarde: ["x"], cobard\u00EDa: ["n", "f"], cobertura: ["n", "f"], cobrar: ["v"], cobro: ["n", "m"], cocer: ["v"], coche: ["n", "m"], cocina: ["n", "f"], cocinar: ["v"], cocinero: ["n", "m"], coco: ["n", "m"], cocodrilo: ["n", "m"], codo: ["n", "m"], codorniz: ["n", "f"], coger: ["v"], coherencia: ["n", "f"], cohete: ["n", "m"], cohetes: ["x"], coincidir: ["v"], col: ["n", "f"], colaboraci\u00F3n: ["n", "f"], colaborar: ["v"], colador: ["n", "m"], colchoneta: ["n", "f"], colch\u00F3n: ["n", "m"], coleccionar: ["v"], colega: ["n", "f"], colegio: ["n", "m"], colgante: ["x"], colgar: ["v"], colina: ["n", "f"], collar: ["n", "m"], colocar: ["v"], colon: ["n", "m"], colonia: ["n", "f"], colorete: ["x"], colorido: ["n", "m"], columna: ["n", "f"], comandante: ["x"], comarca: ["n", "f"], combate: ["x"], combatir: ["v"], combinar: ["v"], comedia: ["n", "f"], comedor: ["n", "m"], comentar: ["v"], comentario: ["n", "m"], comenzar: ["v"], comer: ["v"], comercial: ["x"], comercializaci\u00F3n: ["n", "f"], comercializar: ["v"], comerciante: ["x"], comerciar: ["v"], comercio: ["n", "m"], comestible: ["x"], cometa: ["n", "f"], cometer: ["v"], comible: ["x"], comida: ["n", "f"], comil\u00F3n: ["n", "m"], comisar\u00EDa: ["n", "f"], comisi\u00F3n: ["n", "f"], comit\u00E9: ["n", "m"], compadecer: ["v"], comparar: ["v"], compartimento: ["n", "m"], compartir: ["v"], compasi\u00F3n: ["n", "f"], compa\u00F1ero: ["n", "m"], compa\u00F1\u00EDa: ["n", "f"], compensar: ["v"], competencia: ["n", "f"], competente: ["x"], competir: ["v"], complementos: ["x"], completar: ["v"], componer: ["v"], componerse: ["v"], comportamiento: ["n", "m"], comportarse: ["v"], composici\u00F3n: ["n", "f"], compositor: ["n", "m"], compra: ["n", "f"], comprador: ["n", "m"], comprar: ["v"], comprender: ["v"], comprimido: ["n", "m"], comprimir: ["v"], comprobar: ["v"], comprometerse: ["v"], compromiso: ["n", "m"], comp\u00E1s: ["n", "m"], comulgar: ["v"], comunicaci\u00F3n: ["n", "f"], comunicado: ["n", "m"], comunicar: ["v"], comunicarse: ["v"], comunidad: ["n", "f"], comunismo: ["n", "m"], comunista: ["n", "f"], comunitario: ["n", "m"], comuni\u00F3n: ["n", "m"], com\u00FAn: ["x"], conceder: ["v"], concepto: ["n", "m"], concertar: ["v"], concierto: ["n", "m"], concluir: ["v"], concretar: ["v"], concurso: ["n", "m"], condado: ["n", "m"], condena: ["n", "f"], condenar: ["v"], condenarse: ["v"], condiciones: ["x"], condimentar: ["v"], conducir: ["v"], conducta: ["n", "f"], conductor: ["n", "m"], conectar: ["v"], conejo: ["n", "m"], conexi\u00F3n: ["n", "f"], confederaci\u00F3n: ["n", "f"], confederarse: ["v"], conferencia: ["n", "f"], conferenciante: ["n", "m"], confesar: ["v"], confesarse: ["v"], confesionario: ["n", "m"], confianza: ["n", "f"], confiar: ["v"], configurar: ["v"], confirmar: ["v"], conflicto: ["n", "m"], confortable: ["x"], confrontaci\u00F3n: ["n", "f"], congelador: ["n", "m"], congelar: ["v"], congreso: ["n", "m"], conjunto: ["n", "m"], conmemoraci\u00F3n: ["n", "f"], conmemorar: ["v"], conocer: ["v"], conocimiento: ["n", "m"], conquista: ["n", "f"], conquistar: ["v"], conseguir: ["v"], consejero: ["n", "m"], consejer\u00EDa: ["n", "f"], consejo: ["n", "m"], consentir: ["v"], conserje: ["n", "m"], conservador: ["n", "m"], conservar: ["v"], conservarse: ["v"], conservatorio: ["n", "m"], considerar: ["v"], consigna: ["n", "f"], consistir: ["v"], consola: ["n", "f"], consolar: ["v"], constancia: ["n", "f"], constante: ["x"], constar: ["v"], constelaci\u00F3n: ["n", "f"], constituci\u00F3n: ["n", "f"], constituir: ["v"], construcci\u00F3n: ["n", "f"], constructora: ["n", "f"], construir: ["v"], consulado: ["n", "m"], consulta: ["n", "f"], consultar: ["v"], consultorio: ["n", "m"], consumidor: ["n", "m"], consumir: ["v"], consumo: ["n", "m"], contagiar: ["v"], contagio: ["n", "m"], contaminaci\u00F3n: ["n", "f"], contaminado: ["x"], contaminante: ["x"], contaminar: ["v"], contar: ["v"], contemplar: ["v"], contenedor: ["n", "m"], contener: ["v"], contento: ["n", "m"], contestar: ["v"], continental: ["x"], continente: ["n", "m"], continuar: ["v"], contrabajo: ["n", "m"], contrabandista: ["n", "f"], contrabando: ["n", "m"], contradecir: ["v"], contraer: ["v"], contraindicaciones: ["x"], contrase\u00F1a: ["n", "f"], contrastar: ["v"], contraste: ["n", "m"], contratado: ["n", "m"], contratar: ["v"], contratista: ["n", "f"], contrato: ["n", "m"], contraventana: ["n", "f"], contribuir: ["v"], contribuyente: ["x"], control: ["n", "m"], convalecencia: ["n", "f"], convalidar: ["v"], convencer: ["v"], convenir: ["v"], convento: ["n", "m"], convertir: ["v"], convertirse: ["v"], convivencia: ["n", "f"], convivir: ["v"], convocar: ["v"], cooperaci\u00F3n: ["n", "f"], cooperar: ["v"], coordinar: ["v"], copa: ["n", "f"], copia: ["n", "f"], copiar: ["v"], copiloto: ["n", "m"], coraje: ["n", "m"], coraz\u00F3n: ["n", "m"], corbata: ["n", "f"], corcho: ["n", "m"], cordero: ["n", "m"], cordialidad: ["n", "f"], cordillera: ["n", "f"], coreograf\u00EDa: ["n", "f"], coro: ["n", "m"], corona: ["n", "f"], corpulencia: ["n", "f"], corpulento: ["n", "m"], corral: ["n", "m"], correa: ["n", "f"], corrector: ["n", "m"], corregir: ["v"], correo: ["n", "m"], correos: ["x"], correr: ["v"], corresponsal: ["n", "m"], corriente: ["x"], corromper: ["v"], corrupci\u00F3n: ["n", "f"], cortar: ["v"], cortarse: ["v"], corta\u00FA\u00F1as: ["x"], corte: ["n", "m"], cortes\u00EDa: ["n", "f"], corteza: ["n", "f"], cortina: ["n", "f"], corto: ["x"], cor\u00E1n: ["n", "m"], cosecha: ["n", "f"], cosechar: ["v"], coser: ["v"], cosido: ["x"], cosm\u00E9tica: ["n", "f"], costa: ["n", "f"], costar: ["v"], coste: ["n", "m"], costear: ["v"], costero: ["n", "m"], costilla: ["n", "f"], cotizar: ["v"], creaci\u00F3n: ["n", "f"], crear: ["v"], creatividad: ["n", "f"], crecer: ["v"], crecimiento: ["n", "m"], creer: ["v"], crema: ["n", "f"], cremallera: ["n", "f"], creyente: ["n", "m"], crianza: ["n", "f"], criar: ["v"], crimen: ["n", "m"], criminal: ["x"], crisis: ["n", "f"], cristaler\u00EDa: ["n", "f"], cristianismo: ["n", "m"], cristiano: ["n", "m"], criticar: ["v"], cruce: ["n", "m"], crucifijo: ["n", "m"], crudo: ["n", "m"], cruzar: ["v"], cruzarse: ["v"], cr\u00E1neo: ["n", "m"], cr\u00E9dito: ["n", "m"], cr\u00EDa: ["n", "f"], cr\u00EDtica: ["n", "f"], cr\u00EDtico: ["n", "m"], cr\u00F3nica: ["n", "f"], cuaderno: ["n", "m"], cuadra: ["n", "f"], cuadro: ["n", "m"], cualificado: ["x"], cuarent\u00F3n: ["n", "m"], cuarteto: ["n", "m"], cuatro: ["x"], cuberter\u00EDa: ["n", "f"], cubismo: ["n", "m"], cubo: ["n", "m"], cubrir: ["v"], cuchara: ["n", "f"], cucharilla: ["n", "f"], cuchar\u00F3n: ["n", "m"], cuchilla: ["n", "f"], cuchillo: ["n", "m"], cuello: ["n", "m"], cuenco: ["n", "m"], cuenta: ["n", "f"], cuento: ["n", "m"], cuerda: ["n", "f"], cuerpo: ["n", "m"], cuervo: ["n", "m"], cuestionar: ["v"], cuidado: ["n", "m"], cuidar: ["v"], cuidarse: ["v"], culebr\u00F3n: ["n", "m"], culpable: ["n", "m"], cultivar: ["v"], cultivo: ["n", "m"], cultivos: ["x"], cumplir: ["v"], cuota: ["n", "f"], cura: ["n", "f"], curaci\u00F3n: ["n", "f"], curar: ["v"], curativo: ["x"], curiosidad: ["n", "f"], curioso: ["x"], curr\u00EDculum: ["n", "m"], cursar: ["v"], cursillo: ["n", "m"], curso: ["n", "m"], cursor: ["n", "m"], curva: ["n", "f"], cu\u00E1l: ["x"], cu\u00E1ndo: ["x"], cu\u00E1nto: ["x"], cu\u00F1ada: ["n", "f"], cu\u00F1ado: ["n", "m"], c\u00E1lculo: ["n", "m"], c\u00E1mara: ["n", "f"], c\u00E1ncer: ["n", "m"], c\u00E1psula: ["n", "f"], c\u00E1scara: ["n", "f"], c\u00E9lula: ["n", "f"], c\u00E9ntimo: ["n", "m"], c\u00E9ntrico: ["n", "m"], c\u00E9sped: ["n", "m"], c\u00EDrculo: ["n", "m"], c\u00EDvico: ["n", "m"], c\u00F3ctel: ["n", "m"], c\u00F3digo: ["n", "m"], c\u00F3lico: ["n", "m"], c\u00F3mo: ["x"], c\u00F3moda: ["n", "f"], c\u00F3nsul: ["n", "m"], c\u00F3nyuge: ["n", "m"], c\u00F3rnea: ["n", "f"], dado: ["n", "m"], dama: ["n", "f"], danza: ["n", "f"], dar: ["v"], darse: ["v"], dato: ["n", "m"], da\u00F1os: ["x"], debate: ["n", "m"], debatir: ["v"], deber: ["v"], deberes: ["x"], debilidad: ["n", "f"], debutar: ["v"], decaer: ["v"], decanato: ["n", "m"], decano: ["n", "m"], decepcionar: ["v"], decidir: ["v"], decir: ["v"], declaraciones: ["x"], declaraci\u00F3n: ["n", "f"], declarante: ["x"], declarar: ["v"], decoraci\u00F3n: ["n", "f"], decorado: ["n", "m"], decorar: ["v"], dedicar: ["v"], dedicatoria: ["n", "f"], dedo: ["n", "m"], deducir: ["v"], defender: ["v"], defensor: ["n", "m"], definir: ["v"], degenerar: ["v"], dejar: ["v"], dejarse: ["v"], delantal: ["n", "m"], delegaci\u00F3n: ["n", "f"], delegar: ["v"], delicioso: ["x"], delincuente: ["n", "m"], delirar: ["v"], delito: ["n", "m"], demanda: ["n", "f"], demandar: ["v"], democracia: ["n", "f"], demostrar: ["v"], dem\u00F3crata: ["n", "f"], denegar: ["v"], densidad: ["n", "f"], dentista: ["n", "m"], denunciar: ["v"], departamento: ["n", "m"], depender: ["v"], dependiente: ["n", "m"], depilarse: ["v"], deporte: ["n", "m"], deportista: ["n", "m"], deportivo: ["x"], depreciarse: ["v"], depresi\u00F3n: ["n", "f"], deprimir: ["v"], deprimirse: ["v"], derecho: ["n", "m"], derechos: ["x"], derivar: ["v"], dermatolog\u00EDa: ["n", "f"], derrapar: ["v"], derrape: ["n", "m"], derribar: ["v"], derrotado: ["n", "m"], derrotar: ["v"], derruir: ["v"], derrumbarse: ["v"], desactivar: ["v"], desafiar: ["v"], desagradar: ["v"], desanimado: ["x"], desanimarse: ["v"], desaparecer: ["v"], desarmar: ["v"], desarrollar: ["v"], desarrollo: ["n", "m"], desastre: ["n", "m"], desatar: ["v"], desayunar: ["v"], desayuno: ["n", "m"], desbordar: ["v"], desbordarse: ["v"], descansar: ["v"], descanso: ["n", "m"], descapotable: ["x"], descargar: ["v"], descargarse: ["v"], descender: ["v"], descenso: ["n", "m"], descifrar: ["v"], descolgar: ["v"], descolocar: ["v"], descomponer: ["v"], descomponerse: ["v"], desconectar: ["v"], desconfianza: ["n", "f"], desconfiar: ["v"], descongelar: ["v"], desconvocar: ["v"], descortes\u00EDa: ["n", "f"], descosido: ["x"], describir: ["v"], descubrimiento: ["n", "m"], descubrir: ["v"], descuento: ["n", "m"], desear: ["v"], desembarcar: ["v"], desembocadura: ["n", "f"], desembocar: ["v"], desembolsar: ["v"], desempaquetar: ["v"], desempe\u00F1ar: ["v"], desempleo: ["n", "m"], desenchufar: ["v"], desenlace: ["n", "m"], desenredarse: ["v"], desenvolver: ["v"], desertar: ["v"], desertizaci\u00F3n: ["n", "f"], desfile: ["n", "m"], deshacer: ["v"], deshidratarse: ["v"], desierto: ["n", "m"], designar: ["v"], desigualdad: ["n", "f"], desilusionado: ["x"], desinfecci\u00F3n: ["n", "f"], desinfectar: ["v"], desistir: ["v"], deslizarse: ["v"], desmayarse: ["v"], desmentir: ["v"], desmontar: ["v"], desobedecer: ["v"], desocupar: ["v"], desodorante: ["n", "m"], despacho: ["n", "m"], despedida: ["n", "f"], despedir: ["v"], despedirse: ["v"], despegar: ["v"], despertar: ["v"], despertarse: ["v"], despido: ["n", "m"], desplazarse: ["v"], destacar: ["v"], destinar: ["v"], destinatario: ["n", "m"], destituci\u00F3n: ["n", "f"], destituir: ["v"], destornillador: ["n", "m"], destruir: ["v"], desvanecerse: ["v"], desvelar: ["v"], desviar: ["v"], desviarse: ["v"], desv\u00EDo: ["n", "m"], detectar: ["v"], detenci\u00F3n: ["n", "f"], detener: ["v"], detenerse: ["v"], detergente: ["n", "m"], determinar: ["v"], detestar: ["v"], deuda: ["n", "f"], devaluarse: ["v"], devoluci\u00F3n: ["n", "f"], devolver: ["v"], devorar: ["v"], devoto: ["n", "m"], diabetes: ["n", "f"], diagnosticar: ["v"], diagn\u00F3stico: ["n", "m"], diapositiva: ["n", "f"], diario: ["n", "m"], dibujar: ["v"], dibujo: ["n", "m"], diccionario: ["n", "m"], dictador: ["n", "m"], dictadura: ["n", "f"], dictar: ["v"], did\u00E1ctica: ["n", "f"], did\u00E1ctico: ["n", "m"], dientes: ["x"], dietas: ["x"], diet\u00E9tico: ["n", "m"], diez: ["x"], diferenciar: ["v"], dificultar: ["v"], difundir: ["v"], difunto: ["n", "m"], difusi\u00F3n: ["n", "f"], dif\u00EDcil: ["x"], digerir: ["v"], digestivo: ["x"], diligencia: ["n", "f"], diluir: ["v"], diluviar: ["v"], dimisi\u00F3n: ["n", "f"], dimitir: ["v"], dinast\u00EDa: ["n", "f"], dinero: ["n", "m"], diploma: ["n", "m"], diplom\u00E1tico: ["n", "m"], diputado: ["n", "m"], direcci\u00F3n: ["n", "f"], director: ["n", "m"], dirigir: ["v"], dirigirse: ["v"], disciplina: ["n", "f"], discreci\u00F3n: ["n", "f"], discrepar: ["v"], discreto: ["n", "m"], discriminaci\u00F3n: ["n", "f"], discriminar: ["v"], disculpar: ["v"], discurso: ["n", "m"], discutir: ["v"], disc\u00EDpulo: ["n", "m"], dise\u00F1ador: ["n", "m"], dise\u00F1ar: ["v"], disfrazarse: ["v"], disfrutar: ["v"], disgustado: ["n", "m"], disgustar: ["v"], disminuci\u00F3n: ["n", "f"], disminuir: ["v"], disolver: ["v"], disolverse: ["v"], disparar: ["v"], disponer: ["v"], disponibilidad: ["n", "f"], dispositivo: ["n", "m"], disputar: ["v"], distanciarse: ["v"], distender: ["v"], distinguir: ["v"], distracci\u00F3n: ["n", "f"], distraer: ["v"], distraerse: ["v"], distribuci\u00F3n: ["n", "f"], distribuir: ["v"], distrito: ["n", "m"], diur\u00E9tico: ["n", "m"], diversidad: ["n", "f"], diversi\u00F3n: ["n", "f"], divertir: ["v"], divertirse: ["v"], dividir: ["v"], divino: ["n", "m"], divorciado: ["x"], divorciarse: ["v"], divorcio: ["n", "m"], divulgaci\u00F3n: ["n", "f"], divulgar: ["v"], dni: ["x"], do: ["n", "m"], doblado: ["x"], doblaje: ["n", "m"], doblar: ["v"], docente: ["x"], doctor: ["n", "m"], doctorado: ["n", "m"], doctorarse: ["v"], doctrina: ["n", "f"], documental: ["n", "m"], documento: ["n", "m"], doler: ["v"], dolido: ["n", "m"], dolor: ["n", "m"], domiciliar: ["v"], domicilio: ["n", "m"], dominar: ["v"], domingo: ["x"], dominio: ["n", "m"], donar: ["v"], dorada: ["n", "f"], dormir: ["v"], dormirse: ["v"], dormitorio: ["n", "m"], dos: ["x"], dosificar: ["v"], dosis: ["n", "f"], drama: ["n", "m"], ducha: ["n", "f"], ducharse: ["v"], dudar: ["v"], due\u00F1o: ["n", "m"], dulce: ["x"], dulces: ["x"], dulzor: ["n", "m"], dulz\u00F3n: ["n", "f"], duplicarse: ["v"], durar: ["v"], dureza: ["n", "f"], duro: ["n", "m"], dvd: ["n", "m"], d\u00E9bil: ["x"], d\u00EDa: ["n", "m"], d\u00F3cil: ["x"], d\u00F3nde: ["x"], d\u00FAo: ["n", "m"], d\u00FAplex: ["n", "m"], echar: ["v"], echarse: ["v"], eclipse: ["n", "m"], ecograf\u00EDa: ["n", "f"], ecologista: ["n", "f"], ecolog\u00EDa: ["n", "f"], ecol\u00F3gico: ["n", "m"], economista: ["n", "f"], econom\u00EDa: ["n", "f"], ecosistema: ["n", "m"], ecuaci\u00F3n: ["n", "f"], ecuador: ["n", "m"], ecuatorial: ["x"], edad: ["n", "f"], edici\u00F3n: ["n", "f"], edificaci\u00F3n: ["n", "f"], edificar: ["v"], edificio: ["n", "m"], editar: ["v"], editor: ["n", "m"], editorial: ["n", "f"], educaci\u00F3n: ["n", "f"], educado: ["n", "m"], educador: ["n", "m"], educar: ["v"], educarse: ["v"], educativo: ["x"], efectuar: ["v"], eficiente: ["x"], ego\u00EDsmo: ["n", "m"], ego\u00EDsta: ["n", "m"], ejecutar: ["v"], ejercer: ["v"], ejercicio: ["n", "m"], ej\u00E9rcito: ["n", "m"], elaboraci\u00F3n: ["n", "f"], elaborar: ["v"], elasticidad: ["n", "f"], elecciones: ["x"], electorado: ["n", "m"], electricidad: ["n", "f"], electrodom\u00E9stico: ["n", "m"], electr\u00F3nico: ["n", "m"], elefante: ["x"], elegir: ["v"], elemento: ["n", "m"], elevar: ["v"], eliminar: ["v"], eliminatoria: ["n", "f"], elogiar: ["v"], eludir: ["v"], embajada: ["n", "f"], embajador: ["n", "m"], embarazo: ["n", "m"], embarcadero: ["n", "m"], embarcar: ["v"], embestir: ["v"], emborracharse: ["v"], embrague: ["n", "m"], embutido: ["n", "m"], emerger: ["v"], emigraci\u00F3n: ["n", "f"], emigrante: ["x"], emisi\u00F3n: ["n", "f"], emisora: ["n", "f"], emitir: ["v"], emocionado: ["x"], emoci\u00F3n: ["n", "f"], empalagoso: ["x"], empanar: ["v"], empapar: ["v"], empapelar: ["v"], empaquetar: ["v"], empatar: ["v"], empate: ["n", "m"], empeorar: ["v"], empezar: ["v"], empleado: ["n", "m"], emplear: ["v"], empleo: ["n", "m"], empollar: ["v"], empoll\u00F3n: ["n", "m"], emprendedor: ["n", "m"], empresa: ["n", "f"], empresarial: ["x"], empresario: ["n", "m"], empujar: ["v"], enamorarse: ["v"], encabezamiento: ["n", "m"], encantar: ["v"], encargado: ["n", "m"], encargar: ["v"], encender: ["v"], encerrar: ["v"], enchufar: ["v"], enchufe: ["n", "m"], enciclopedia: ["n", "f"], encoger: ["v"], encogerse: ["v"], encontrar: ["v"], encontrarse: ["v"], encubrir: ["v"], encuentro: ["n", "m"], endeudarse: ["v"], enemigo: ["n", "m"], enemistad: ["n", "f"], energ\u00EDa: ["n", "f"], enfadarse: ["v"], enfado: ["n", "m"], enfermedad: ["n", "f"], enfermera: ["n", "f"], enfermero: ["n", "m"], enfermo: ["x"], enfocar: ["v"], enfrentamiento: ["n", "m"], enfrentar: ["v"], enfrentarse: ["v"], enfriarse: ["v"], enga\u00F1o: ["n", "m"], engordar: ["v"], enjabonar: ["v"], enlace: ["n", "m"], enlatado: ["x"], enmarcar: ["v"], enorgullecerse: ["v"], enredarse: ["v"], enriquecer: ["v"], ensaimada: ["n", "f"], ensalada: ["n", "f"], ensaladera: ["n", "f"], ensayar: ["v"], ensayo: ["n", "m"], ense\u00F1anza: ["n", "f"], ense\u00F1ar: ["v"], entender: ["v"], enterarse: ["v"], enterrar: ["v"], entidad: ["n", "f"], entierro: ["n", "m"], entonces: ["x"], entorno: ["n", "m"], entrada: ["n", "f"], entrante: ["x"], entrar: ["v"], entrega: ["n", "f"], entregar: ["v"], entregarse: ["v"], entrem\u00E9s: ["n", "m"], entrenador: ["n", "m"], entrenar: ["v"], entrenarse: ["v"], entretener: ["v"], entretenerse: ["v"], entretenimiento: ["n", "m"], entrevista: ["n", "f"], entrevistado: ["n", "m"], entrevistador: ["n", "m"], entristecerse: ["v"], entusiasmar: ["v"], envejecer: ["v"], enviar: ["v"], envidiar: ["v"], enviudar: ["v"], envolver: ["v"], env\u00EDo: ["n", "m"], epidemia: ["n", "f"], episodio: ["n", "m"], equilibrio: ["n", "m"], equipaje: ["n", "m"], equipamiento: ["n", "m"], equipo: ["n", "m"], equivaler: ["v"], equivocarse: ["v"], escalador: ["n", "m"], escalar: ["v"], escalera: ["n", "f"], escayola: ["n", "f"], escayolar: ["v"], escena: ["n", "f"], escenario: ["n", "m"], escenificar: ["v"], escoba: ["n", "f"], escocer: ["v"], escoger: ["v"], esconder: ["v"], escotado: ["n", "m"], escribir: ["v"], escribirse: ["v"], escritor: ["n", "m"], escritorio: ["n", "m"], escuchar: ["v"], escuela: ["n", "f"], escultor: ["n", "m"], escultura: ["n", "f"], escupir: ["v"], esc\u00E1ner: ["n", "m"], esencia: ["n", "f"], esguince: ["n", "m"], eslogan: ["n", "m"], esmeralda: ["n", "f"], espacio: ["n", "m"], espacioso: ["x"], espada: ["n", "f"], espalda: ["n", "f"], esparadrapo: ["n", "m"], espa\u00F1ol: ["n", "m"], especialista: ["n", "m"], especializaci\u00F3n: ["n", "f"], especializarse: ["v"], especias: ["x"], especie: ["n", "f"], espectador: ["n", "m"], espect\u00E1culo: ["n", "m"], espejo: ["n", "m"], esperar: ["v"], espermatozoide: ["n", "m"], espinacas: ["x"], espirar: ["v"], esposa: ["n", "f"], esposo: ["n", "m"], espuma: ["n", "f"], esp\u00EDritu: ["n", "m"], esqueleto: ["n", "m"], esquel\u00E9tico: ["n", "m"], esquiar: ["v"], esquina: ["n", "f"], establecer: ["v"], establecimiento: ["n", "m"], establo: ["n", "m"], estacionamiento: ["n", "m"], estaci\u00F3n: ["n", "f"], estadio: ["n", "m"], estado: ["n", "m"], estad\u00EDstica: ["n", "f"], estallar: ["v"], estampado: ["n", "m"], estanco: ["n", "m"], estante: ["x"], estanter\u00EDa: ["n", "f"], estar: ["v"], estatal: ["x"], estatua: ["n", "f"], este: ["n", "m"], estilo: ["n", "m"], estimular: ["v"], estor: ["n", "m"], estornudar: ["v"], estrechar: ["v"], estrecho: ["n", "m"], estrella: ["n", "f"], estremecerse: ["v"], estrenar: ["v"], estreno: ["n", "m"], estresarse: ["v"], estropajo: ["n", "m"], estropeado: ["n", "m"], estropearse: ["v"], estructura: ["n", "f"], estr\u00E9s: ["n", "m"], estudiante: ["n", "m"], estudiar: ["v"], estudio: ["n", "m"], estudios: ["x"], est\u00E9tica: ["n", "f"], est\u00F3mago: ["n", "m"], etapa: ["n", "f"], eternidad: ["n", "f"], etiqueta: ["n", "f"], euro: ["n", "m"], europa: ["x"], evaluaci\u00F3n: ["n", "f"], evaluar: ["v"], evaporarse: ["v"], evitar: ["v"], evolucionar: ["v"], examen: ["n", "m"], examinar: ["v"], examinarse: ["v"], exceder: ["v"], excluir: ["v"], excursi\u00F3n: ["n", "f"], exhibici\u00F3n: ["n", "f"], exigir: ["v"], existir: ["v"], expandirse: ["v"], expansi\u00F3n: ["n", "f"], expedir: ["v"], experiencia: ["n", "f"], experimentado: ["x"], experimentar: ["v"], experimento: ["n", "m"], experto: ["n", "m"], explicar: ["v"], explotaci\u00F3n: ["n", "f"], explotar: ["v"], exponer: ["v"], exportaci\u00F3n: ["n", "f"], exportador: ["n", "m"], exportar: ["v"], exposici\u00F3n: ["n", "f"], expresar: ["v"], expresi\u00F3n: ["n", "f"], exprimidor: ["n", "m"], expulsar: ["v"], expulsi\u00F3n: ["n", "f"], exquisito: ["n", "m"], extender: ["v"], extenderse: ["v"], extensi\u00F3n: ["n", "f"], extinguir: ["v"], extinguirse: ["v"], extorsi\u00F3n: ["n", "f"], extra: ["n", "f"], extraer: ["v"], extranjero: ["n", "m"], extra\u00F1ar: ["v"], extremaunci\u00F3n: ["n", "f"], fa: ["n", "f"], fabada: ["n", "f"], fabricaci\u00F3n: ["n", "f"], fabricante: ["x"], fabricar: ["v"], fachada: ["n", "f"], facilitar: ["v"], factura: ["n", "f"], facturar: ["v"], falda: ["n", "f"], fallar: ["v"], fallecer: ["v"], fallecido: ["n", "m"], fallecimiento: ["n", "m"], falsificaci\u00F3n: ["n", "f"], falsificar: ["v"], faltar: ["v"], familia: ["n", "f"], familiar: ["n", "m"], fan: ["n", "m"], fanatismo: ["n", "m"], faringitis: ["n", "f"], farmacia: ["n", "f"], faro: ["n", "m"], farola: ["n", "f"], fascinado: ["x"], fascinar: ["v"], fascismo: ["n", "m"], fastidiar: ["v"], fastidiarse: ["v"], fatigarse: ["v"], fauna: ["n", "f"], favorecer: ["v"], fax: ["n", "m"], fechar: ["v"], fecundaci\u00F3n: ["n", "f"], federaci\u00F3n: ["n", "f"], federarse: ["v"], felicidad: ["n", "f"], felicitar: ["v"], feliz: ["x"], femenino: ["n", "m"], feo: ["x"], feria: ["n", "f"], feroz: ["x"], fertilizar: ["v"], festejar: ["v"], festival: ["n", "m"], fetichismo: ["n", "m"], fiarse: ["v"], fibra: ["n", "f"], ficha: ["n", "f"], fidelizar: ["v"], fiebre: ["n", "f"], fiesta: ["n", "f"], figurar: ["v"], fijarse: ["v"], fila: ["n", "f"], filete: ["x"], filosof\u00EDa: ["n", "f"], filos\u00F3fico: ["n", "m"], filtrar: ["v"], fil\u00F3sofo: ["n", "m"], final: ["n", "m"], finalizar: ["v"], finca: ["n", "f"], fingir: ["v"], firma: ["n", "f"], firmar: ["v"], fiscal: ["n", "m"], fisioterapia: ["n", "f"], flamenco: ["n", "m"], flash: ["n", "m"], flor: ["n", "f"], florecer: ["v"], florero: ["n", "m"], flotador: ["n", "m"], fluir: ["v"], folio: ["n", "m"], folleto: ["n", "m"], fomentar: ["v"], fondo: ["n", "m"], fontaner\u00EDa: ["n", "f"], forestal: ["x"], formaci\u00F3n: ["n", "f"], formar: ["v"], formarse: ["v"], formulaci\u00F3n: ["n", "f"], formular: ["v"], foro: ["n", "m"], forofo: ["n", "m"], forzar: ["v"], foto: ["n", "f"], fotocopia: ["n", "f"], fotocopiadora: ["n", "f"], fotografiar: ["v"], fotograf\u00EDa: ["n", "f"], fotog\u00E9nico: ["n", "m"], fot\u00F3grafo: ["n", "m"], fracasar: ["v"], fracci\u00F3n: ["n", "f"], fractura: ["n", "f"], fragilidad: ["n", "f"], frambuesa: ["n", "f"], franquear: ["v"], franqueo: ["n", "m"], fraude: ["n", "m"], fregar: ["v"], fregona: ["n", "f"], freidora: ["n", "f"], frenar: ["v"], freno: ["n", "m"], frente: ["n", "f"], fresco: ["n", "m"], fre\u00EDr: ["v"], frigor\u00EDfico: ["n", "m"], frijoles: ["x"], frondoso: ["x"], frotar: ["v"], frustrar: ["v"], fruta: ["n", "f"], frutero: ["n", "m"], fruter\u00EDa: ["n", "f"], fruto: ["n", "m"], fr\u00EDo: ["x"], fr\u00EDvolo: ["n", "m"], fuego: ["n", "m"], fuente: ["n", "f"], fuerte: ["x"], fuerza: ["n", "f"], fuerzas: ["x"], fumar: ["v"], fumigado: ["x"], fumigar: ["v"], funcionar: ["v"], funcionario: ["n", "m"], funci\u00F3n: ["n", "f"], fundamentalismo: ["n", "m"], fundirse: ["v"], furgoneta: ["n", "f"], fusil: ["x"], f\u00E1brica: ["n", "f"], f\u00E1bula: ["n", "f"], f\u00E1cil: ["x"], f\u00EDsica: ["n", "f"], f\u00EDsico: ["n", "m"], f\u00F3rmula: ["n", "f"], f\u00FAtbol: ["n", "m"], gafas: ["x"], gajo: ["n", "m"], gala: ["n", "f"], galaxia: ["n", "f"], galer\u00EDa: ["n", "f"], galletas: ["x"], gallina: ["n", "f"], gallinero: ["n", "m"], gallo: ["n", "m"], galopar: ["v"], gambas: ["x"], ganadero: ["n", "m"], ganader\u00EDa: ["n", "f"], ganado: ["n", "m"], ganador: ["n", "m"], ganancias: ["x"], ganar: ["v"], ganso: ["n", "m"], garaje: ["n", "m"], garantizar: ["v"], garant\u00EDa: ["n", "f"], garbanzos: ["x"], garganta: ["n", "f"], gargantilla: ["n", "f"], gasa: ["n", "f"], gasolina: ["n", "f"], gasolinera: ["n", "f"], gastar: ["v"], gastarse: ["v"], gasto: ["n", "m"], gastos: ["x"], gato: ["n", "m"], gaviota: ["n", "f"], gay: ["x"], gel: ["x"], gemelos: ["n", "m"], gemir: ["v"], gen: ["n", "m"], generaci\u00F3n: ["n", "f"], general: ["n", "m"], generalizar: ["v"], generar: ["v"], generosidad: ["n", "f"], generoso: ["x"], gente: ["n", "f"], gen\u00E9tica: ["n", "f"], gen\u00E9tico: ["n", "m"], geograf\u00EDa: ["n", "f"], geogr\u00E1fico: ["n", "m"], gerencia: ["n", "f"], gerente: ["n", "m"], geriatr\u00EDa: ["n", "f"], germinar: ["v"], gestionar: ["v"], gesti\u00F3n: ["n", "m"], gesto: ["n", "m"], gimnasio: ["n", "m"], ginebra: ["n", "f"], ginecol\u00F3gico: ["n", "m"], ginec\u00F3logo: ["n", "m"], girar: ["v"], giro: ["n", "m"], globalizaci\u00F3n: ["n", "f"], globo: ["n", "m"], glot\u00F3n: ["n", "m"], gl\u00E1ndula: ["n", "f"], gobernar: ["v"], gobierno: ["n", "m"], golfo: ["n", "m"], golosinas: ["x"], golpear: ["v"], goma: ["n", "f"], gomina: ["n", "f"], gorra: ["n", "f"], gorro: ["n", "m"], gotas: ["x"], gozar: ["v"], grabadora: ["n", "f"], grabar: ["v"], gracias: ["x"], grada: ["n", "f"], graduar: ["v"], graduarse: ["v"], gran: ["x"], granada: ["n", "f"], grande: ["x"], granero: ["n", "m"], granizar: ["v"], granizo: ["n", "m"], granja: ["n", "f"], granos: ["x"], grapa: ["n", "f"], grapadora: ["n", "f"], gripe: ["n", "f"], gris: ["x"], gritar: ["v"], grosella: ["n", "f"], groser\u00EDa: ["n", "f"], grupo: ["n", "m"], gr\u00FAa: ["n", "f"], guantes: ["x"], guardar: ["v"], guardarropa: ["n", "f"], guarder\u00EDa: ["n", "f"], gubernamental: ["x"], guerra: ["n", "f"], guiar: ["v"], guionista: ["n", "f"], guirnalda: ["n", "f"], guisantes: ["x"], guitarra: ["n", "f"], guitarrista: ["n", "f"], gui\u00F3n: ["n", "m"], gustar: ["v"], gusto: ["n", "m"], g\u00E9nero: ["n", "m"], haber: ["v"], habilidad: ["n", "f"], habilitar: ["v"], habitaci\u00F3n: ["n", "f"], habitante: ["n", "m"], habitar: ["v"], hablador: ["n", "m"], hablar: ["v"], hacer: ["v"], hacerse: ["v"], hallar: ["v"], hallarse: ["v"], hamburguesa: ["n", "f"], hamburgueser\u00EDa: ["n", "f"], harina: ["n", "f"], helado: ["n", "m"], helar: ["v"], helic\u00F3ptero: ["n", "m"], helipuerto: ["n", "m"], hembra: ["n", "f"], hemisferio: ["n", "m"], heredar: ["v"], herej\u00EDa: ["n", "f"], herida: ["n", "f"], herir: ["v"], hermana: ["n", "f"], hermano: ["n", "m"], hermanos: ["n", "m"], hernia: ["n", "f"], hervir: ["v"], heterosexual: ["x"], hidroavi\u00F3n: ["n", "m"], hidromasaje: ["n", "m"], hielo: ["n", "m"], hierba: ["n", "f"], hierro: ["n", "m"], higiene: ["n", "f"], hija: ["n", "f"], hijo: ["n", "m"], hijos: ["n", "m"], hilo: ["n", "m"], himno: ["n", "m"], hincha: ["n", "f"], hinduismo: ["n", "m"], hipocondriaco: ["n", "m"], hipocres\u00EDa: ["n", "f"], hipoteca: ["n", "f"], hipotecar: ["v"], historia: ["n", "f"], historiador: ["n", "m"], hobby: ["x"], hocico: ["n", "m"], hogar: ["n", "m"], hoja: ["n", "f"], hojear: ["v"], hola: ["x"], holgado: ["x"], hombre: ["n", "m"], hombros: ["n", "m"], homosexual: ["x"], honor: ["n", "m"], hora: ["n", "f"], horario: ["n", "m"], horizonte: ["n", "m"], hormig\u00F3n: ["n", "m"], hormona: ["n", "f"], horno: ["n", "m"], horrorizar: ["v"], horrorizarse: ["v"], hor\u00F3scopo: ["n", "m"], hospital: ["n", "m"], hospitalario: ["n", "m"], hospitalidad: ["n", "f"], hospitalizar: ["v"], hostal: ["n", "m"], hotel: ["n", "m"], hoy: ["x"], huelga: ["n", "f"], huella: ["n", "f"], huerta: ["n", "f"], huerto: ["n", "m"], hueso: ["n", "m"], huevo: ["n", "m"], huevos: ["x"], huir: ["v"], humedecer: ["v"], humildad: ["n", "f"], humilde: ["x"], hundirse: ["v"], hurac\u00E1n: ["n", "m"], hurto: ["n", "m"], hu\u00E9sped: ["n", "m"], h\u00E1bito: ["n", "m"], h\u00EDgado: ["n", "m"], iberia: ["n", "f"], icono: ["n", "m"], idea: ["n", "f"], identidad: ["n", "f"], identificar: ["v"], ideol\u00F3gico: ["n", "m"], ide\u00F3logo: ["n", "m"], idilio: ["n", "m"], idolatr\u00EDa: ["n", "f"], iglesia: ["n", "f"], igualdad: ["n", "f"], iluminaci\u00F3n: ["n", "f"], iluminar: ["v"], ilusionado: ["x"], ilusionarse: ["v"], ilustrador: ["n", "m"], ilustrar: ["v"], imagen: ["n", "f"], imaginaci\u00F3n: ["n", "f"], imaginar: ["v"], imaginarse: ["v"], imberbe: ["x"], imitar: ["v"], impaciencia: ["n", "f"], impaciente: ["x"], impedir: ["v"], imperdible: ["x"], impermeabilizar: ["v"], implicar: ["v"], imponer: ["v"], importaci\u00F3n: ["n", "f"], importador: ["n", "m"], importar: ["v"], importe: ["n", "m"], impresionar: ["v"], impresora: ["n", "f"], imprevisi\u00F3n: ["n", "f"], imprimir: ["v"], improvisar: ["v"], imprudencia: ["n", "f"], imprudente: ["x"], impuesto: ["n", "m"], impuntualidad: ["n", "f"], im\u00E1n: ["n", "m"], inadaptaci\u00F3n: ["n", "f"], inauguraci\u00F3n: ["n", "f"], inaugurar: ["v"], incapaz: ["x"], incendiar: ["v"], incineraci\u00F3n: ["n", "f"], incinerar: ["v"], inclinar: ["v"], incluir: ["v"], incomestible: ["x"], incomible: ["x"], incompetente: ["x"], inconstancia: ["n", "f"], incorporar: ["v"], incorporarse: ["v"], incrementar: ["v"], incremento: ["n", "m"], incubadora: ["n", "f"], incubar: ["v"], incumplir: ["v"], indemnizaci\u00F3n: ["n", "f"], indemnizar: ["v"], indicar: ["v"], indiferencia: ["n", "f"], indignado: ["x"], indignar: ["v"], indisposici\u00F3n: ["n", "f"], inducir: ["v"], industria: ["n", "f"], industrializaci\u00F3n: ["n", "f"], industrializar: ["v"], ineptitud: ["n", "f"], inexperto: ["n", "m"], infecci\u00F3n: ["n", "f"], infectar: ["v"], inferir: ["v"], infierno: ["n", "m"], inflamaci\u00F3n: ["n", "f"], inflamar: ["v"], influencia: ["n", "f"], influir: ["v"], informaci\u00F3n: ["n", "f"], informar: ["v"], informarse: ["v"], informativos: ["x"], informe: ["n", "m"], inform\u00E1tica: ["n", "f"], inform\u00E1tico: ["n", "m"], infringir: ["v"], infusi\u00F3n: ["n", "f"], ingeniero: ["n", "m"], ingerir: ["v"], ingrediente: ["n", "m"], ingredientes: ["x"], ingresar: ["v"], ingreso: ["n", "m"], ingresos: ["x"], iniciar: ["v"], injertar: ["v"], injerto: ["n", "m"], injuria: ["n", "f"], inmediaciones: ["x"], inmigraci\u00F3n: ["n", "f"], inmigrante: ["x"], inmigrantes: ["x"], inmobiliaria: ["n", "f"], inmortalidad: ["n", "f"], innovaci\u00F3n: ["n", "f"], inocente: ["x"], inorg\u00E1nico: ["n", "m"], inquietarse: ["v"], inquilino: ["n", "m"], inscribir: ["v"], inscribirse: ["v"], insecto: ["n", "m"], inseguro: ["n", "m"], insensibilidad: ["n", "f"], insertar: ["v"], insinceridad: ["n", "f"], insistir: ["v"], inspeccionar: ["v"], inspecci\u00F3n: ["n", "f"], inspector: ["n", "m"], inspiraci\u00F3n: ["n", "f"], inspirar: ["v"], instalaci\u00F3n: ["n", "f"], instalar: ["v"], institucional: ["x"], instituto: ["n", "m"], instructivo: ["x"], instructor: ["n", "m"], instruir: ["v"], instrumento: ["n", "m"], insular: ["v"], insulso: ["n", "m"], ins\u00EDpido: ["x"], integraci\u00F3n: ["n", "f"], integrar: ["v"], integrarse: ["v"], integridad: ["n", "f"], integrismo: ["n", "m"], inteligente: ["x"], intensificar: ["v"], intentar: ["v"], intercambiar: ["v"], interesar: ["v"], interino: ["n", "m"], interior: ["n", "m"], intermitente: ["n", "m"], internacional: ["x"], internauta: ["n", "m"], internet: ["x"], interpelar: ["v"], interpretaci\u00F3n: ["n", "f"], interpretar: ["v"], interrogar: ["v"], interrogatorio: ["n", "m"], interrumpir: ["v"], interruptor: ["n", "m"], intersecci\u00F3n: ["n", "f"], intervenir: ["v"], intestino: ["n", "m"], intranet: ["n", "f"], intranquilidad: ["n", "f"], intransigencia: ["n", "f"], intransigente: ["x"], intriga: ["n", "f"], introducir: ["v"], introvertido: ["x"], inundaci\u00F3n: ["n", "f"], inundar: ["v"], invadir: ["v"], invasi\u00F3n: ["n", "f"], inventar: ["v"], invento: ["n", "m"], invernadero: ["n", "m"], inversi\u00F3n: ["n", "f"], inversor: ["n", "m"], invertir: ["v"], investigaci\u00F3n: ["n", "f"], investigador: ["n", "m"], investigar: ["v"], invierno: ["n", "m"], invitaci\u00F3n: ["n", "f"], invitado: ["n", "m"], invitar: ["v"], involucrar: ["v"], inyecci\u00F3n: ["n", "f"], inyectar: ["v"], ir: ["v"], ira: ["n", "f"], iron\u00EDa: ["n", "f"], irresponsabilidad: ["n", "f"], irresponsable: ["x"], irse: ["v"], isla: ["n", "f"], islamismo: ["n", "m"], itinerario: ["n", "m"], jab\u00F3n: ["n", "m"], jacuzzi: ["n", "m"], jade: ["n", "m"], jam\u00F3n: ["n", "m"], japon\u00E9s: ["n", "m"], jardinera: ["n", "f"], jardiner\u00EDa: ["n", "f"], jard\u00EDn: ["n", "m"], jarr\u00F3n: ["n", "m"], jazz: ["n", "m"], jefe: ["n", "m"], jerarqu\u00EDa: ["n", "f"], jersey: ["n", "m"], jornada: ["n", "f"], joven: ["n", "m"], joya: ["n", "f"], jubilaci\u00F3n: ["n", "f"], jubilarse: ["v"], jud\u00EDas: ["x"], jud\u00EDo: ["n", "m"], juego: ["n", "m"], jueves: ["x"], juez: ["n", "f"], jugador: ["n", "m"], jugar: ["v"], juicio: ["n", "m"], juntarse: ["v"], jurado: ["n", "f"], jurar: ["v"], justicia: ["n", "f"], justificante: ["x"], justificar: ["v"], justo: ["n", "m"], juzgado: ["n", "m"], kiwi: ["n", "m"], labios: ["x"], labor: ["n", "m"], laboratorio: ["n", "m"], labrador: ["n", "m"], laca: ["n", "f"], ladera: ["n", "f"], ladrar: ["v"], ladrillo: ["n", "m"], ladr\u00F3n: ["n", "m"], lago: ["n", "m"], laguna: ["n", "f"], laico: ["n", "m"], lamentar: ["v"], lana: ["n", "f"], langosta: ["n", "f"], langostino: ["n", "m"], lanzamiento: ["n", "m"], lanzar: ["v"], lanzarse: ["v"], largo: ["x"], largometraje: ["n", "m"], lata: ["n", "f"], latitud: ["n", "f"], lavabo: ["n", "m"], lavado: ["n", "m"], lavadora: ["n", "f"], lavaplatos: ["x"], lavar: ["v"], lavarse: ["v"], lavavajillas: ["n", "m"], lealtad: ["n", "f"], lecci\u00F3n: ["n", "f"], leche: ["n", "f"], lechuga: ["n", "f"], lechuza: ["n", "f"], lector: ["n", "m"], leer: ["v"], legalidad: ["n", "f"], legislaci\u00F3n: ["n", "f"], legislar: ["v"], legumbres: ["x"], lejos: ["x"], lej\u00EDa: ["n", "f"], lema: ["n", "m"], lenguado: ["n", "m"], lentejas: ["x"], lentillas: ["n", "f"], lento: ["x"], leo: ["n", "m"], lesbiana: ["n", "f"], lesionar: ["v"], lesi\u00F3n: ["n", "f"], letra: ["n", "f"], levantamiento: ["n", "m"], levantar: ["v"], levantarse: ["v"], ley: ["n", "f"], leyenda: ["n", "f"], le\u00F3n: ["n", "m"], liberal: ["n", "m"], liberalizaci\u00F3n: ["n", "f"], libertad: ["n", "f"], librer\u00EDa: ["n", "f"], libro: ["n", "m"], licenciado: ["n", "m"], licenciarse: ["v"], liceo: ["n", "m"], lichi: ["n", "m"], licor: ["n", "m"], liga: ["n", "f"], ligar: ["v"], lima: ["n", "f"], limarse: ["v"], limitar: ["v"], limpiacristales: ["n", "m"], limpiar: ["v"], limpieza: ["n", "f"], limpio: ["n", "m"], limusina: ["n", "f"], lino: ["n", "m"], linterna: ["n", "f"], liquidaci\u00F3n: ["n", "f"], liso: ["n", "m"], literatura: ["n", "f"], litoral: ["n", "m"], llamada: ["n", "f"], llamar: ["v"], llamarse: ["v"], llanura: ["n", "f"], llave: ["n", "f"], llaves: ["x"], llegar: ["v"], llegarle: ["x"], llenar: ["v"], lleno: ["x"], llevar: ["v"], llevarse: ["v"], llorar: ["v"], llover: ["v"], llovizna: ["n", "f"], lloviznar: ["v"], lluvia: ["n", "f"], local: ["n", "m"], localidad: ["n", "f"], locutor: ["n", "m"], locutorio: ["n", "m"], logotipo: ["n", "m"], lograr: ["v"], log\u00EDstica: ["n", "f"], lombarda: ["n", "f"], lomo: ["n", "m"], loncha: ["n", "f"], longitud: ["n", "f"], lote: ["n", "m"], lubina: ["n", "f"], lucha: ["n", "f"], luchar: ["v"], ludopat\u00EDa: ["n", "f"], lugar: ["n", "m"], lujoso: ["x"], lumbago: ["n", "m"], luna: ["n", "f"], lunes: ["x"], luz: ["n", "f"], l\u00E1grima: ["n", "f"], l\u00E1piz: ["n", "m"], l\u00EDder: ["n", "m"], l\u00EDnea: ["n", "f"], l\u00EDneacontinua: ["n", "f"], l\u00F3gica: ["n", "f"], l\u00FAdico: ["n", "m"], maceta: ["n", "f"], madrastra: ["n", "f"], madre: ["n", "f"], madrina: ["n", "f"], madrugar: ["v"], madurar: ["v"], madurez: ["n", "f"], maestro: ["n", "m"], maestr\u00EDa: ["n", "f"], mafia: ["n", "f"], magdalena: ["n", "f"], magistrado: ["n", "m"], magro: ["n", "m"], mal: ["x"], mala: ["n", "f"], malcriar: ["v"], maleta: ["n", "f"], maletero: ["n", "m"], malet\u00EDn: ["x"], malgastar: ["v"], malo: ["x"], mamar: ["v"], mam\u00E1: ["x"], mam\u00EDfero: ["n", "m"], manada: ["n", "f"], manantial: ["n", "m"], manchar: ["v"], manchas: ["x"], mandar: ["v"], mandato: ["n", "m"], manejar: ["v"], manifestaci\u00F3n: ["n", "f"], manifestar: ["v"], manipular: ["v"], mano: ["n", "f"], mansi\u00F3n: ["n", "f"], manso: ["n", "m"], manta: ["n", "f"], mantel: ["n", "m"], manteler\u00EDa: ["n", "f"], mantener: ["v"], mantenerse: ["v"], mantenimiento: ["n", "m"], mantequilla: ["n", "f"], manufactura: ["n", "f"], manuscrito: ["n", "m"], manzana: ["n", "f"], mapa: ["n", "m"], maquillador: ["n", "m"], maquillaje: ["n", "m"], maquillarse: ["v"], maquinaria: ["n", "f"], maquinilla: ["n", "f"], mar: ["n", "m"], maracuy\u00E1: ["n", "m"], marca: ["n", "f"], marcar: ["v"], marcha: ["n", "f"], marcharse: ["v"], marearse: ["v"], maremoto: ["n", "m"], mareos: ["x"], margarita: ["n", "f"], marginaci\u00F3n: ["n", "f"], marginado: ["n", "m"], marginal: ["x"], marginalidad: ["n", "f"], marginar: ["v"], marido: ["n", "m"], marinero: ["n", "m"], marisco: ["n", "m"], marroqu\u00ED: ["x"], marr\u00F3n: ["x"], martes: ["x"], marxismo: ["n", "m"], mar\u00EDtimo: ["n", "m"], masa: ["n", "f"], masaje: ["n", "m"], mascota: ["n", "f"], masculino: ["n", "m"], masticar: ["v"], matar: ["v"], matasellos: ["n", "m"], mate: ["n", "m"], matem\u00E1ticas: ["x"], matem\u00E1tico: ["n", "m"], materia: ["n", "f"], maternidad: ["n", "f"], matricularse: ["v"], matrimonio: ["n", "m"], matr\u00EDcula: ["n", "f"], maximizar: ["v"], mayonesa: ["n", "f"], mayor: ["x"], mayor\u00EDa: ["n", "f"], ma\u00F1ana: ["x"], mecedora: ["n", "f"], mec\u00E1nico: ["n", "m"], mediar: ["v"], medias: ["x"], medicamento: ["n", "m"], medicina: ["n", "f"], medicinal: ["x"], medio: ["n", "m"], medios: ["x"], medir: ["v"], mejilla: ["n", "f"], mejill\u00F3n: ["n", "m"], mejorar: ["v"], melena: ["n", "f"], mellizos: ["x"], melod\u00EDa: ["n", "f"], membrete: ["n", "m"], memoria: ["n", "f"], memorias: ["x"], memorizar: ["v"], mencionar: ["v"], menor: ["x"], menores: ["x"], menos: ["x"], mensajero: ["n", "m"], menstruaci\u00F3n: ["n", "f"], mentir: ["v"], men\u00FA: ["x"], mercado: ["n", "m"], mercadotecnia: ["n", "f"], mercanc\u00EDa: ["n", "f"], mercurio: ["n", "m"], merecer: ["v"], merendar: ["v"], merengue: ["n", "m"], merienda: ["n", "f"], merluza: ["n", "f"], mes: ["n", "m"], mesa: ["n", "f"], meseta: ["n", "f"], mes\u00F3n: ["n", "m"], metaf\u00EDsica: ["n", "f"], metaf\u00EDsico: ["n", "m"], meteorito: ["n", "m"], meter: ["v"], meterse: ["v"], metralleta: ["n", "f"], metro: ["n", "m"], metropolitano: ["n", "m"], met\u00E1fora: ["n", "f"], mexicano: ["n", "m"], mezclar: ["v"], mezclarse: ["v"], microondas: ["n", "m"], microscopio: ["n", "m"], miembro: ["n", "m"], mientras: ["x"], mil: ["x"], militar: ["n", "m"], mina: ["n", "f"], minifalda: ["n", "f"], minimizar: ["v"], ministerial: ["x"], ministerio: ["n", "m"], ministro: ["n", "m"], minor\u00EDa: ["n", "f"], minuto: ["n", "m"], mirada: ["n", "f"], mirar: ["v"], miseria: ["n", "f"], misil: ["x"], misionero: ["n", "m"], mitigar: ["v"], mi\u00E9rcoles: ["x"], mobiliario: ["n", "m"], mochila: ["n", "f"], modelo: ["n", "m"], modificar: ["v"], moler: ["v"], molestar: ["v"], mol\u00E9cula: ["n", "f"], momia: ["n", "f"], monarqu\u00EDa: ["n", "f"], monasterio: ["n", "m"], moneda: ["n", "f"], monitor: ["n", "m"], monja: ["n", "f"], mono: ["n", "m"], monovolumen: ["n", "m"], montaje: ["n", "m"], montar: ["v"], montarse: ["v"], monta\u00F1a: ["n", "f"], monta\u00F1ero: ["n", "m"], monte: ["n", "m"], monumento: ["n", "m"], mon\u00F3logo: ["n", "m"], mora: ["n", "f"], morada: ["n", "f"], morder: ["v"], morir: ["v"], morirse: ["v"], mortadela: ["n", "f"], mosca: ["n", "f"], mosquito: ["n", "m"], mosto: ["n", "m"], mostrador: ["n", "m"], mostrar: ["v"], mote: ["n", "m"], motel: ["n", "m"], motivar: ["v"], moto: ["n", "f"], motor: ["n", "m"], mover: ["v"], mucho: ["x"], mudarse: ["v"], mudo: ["n", "m"], muela: ["n", "f"], muelle: ["n", "m"], muerte: ["n", "f"], muestra: ["n", "f"], mujer: ["n", "f"], multar: ["v"], multinacional: ["n", "f"], multiplicar: ["v"], mundial: ["x"], mundo: ["n", "m"], municipio: ["n", "m"], mural: ["n", "m"], museo: ["n", "m"], musical: ["n", "m"], muslos: ["x"], musulm\u00E1n: ["n", "m"], muy: ["x"], mu\u00F1eca: ["n", "f"], m\u00E1rquetin: ["n", "m"], m\u00E1rtir: ["n", "mf"], m\u00E1s: ["x"], m\u00E1ster: ["n", "m"], m\u00E9dica: ["n", "f"], m\u00E9dico: ["n", "m"], m\u00E9todo: ["n", "m"], m\u00F3dem: ["n", "m"], m\u00F3vil: ["n", "m"], m\u00FAsculo: ["n", "m"], m\u00FAsica: ["n", "f"], m\u00FAsico: ["n", "m"], nacer: ["v"], nacimiento: ["n", "m"], nacional: ["n", "m"], nacionalidad: ["n", "f"], naci\u00F3n: ["n", "f"], nada: ["x"], nadar: ["v"], nadie: ["x"], napia: ["n", "f"], naranja: ["x"], nariz: ["n", "f"], narraci\u00F3n: ["n", "f"], narrador: ["n", "m"], narrar: ["v"], nataci\u00F3n: ["n", "f"], naturaleza: ["n", "f"], naufragar: ["v"], nave: ["n", "f"], navegador: ["n", "m"], navegar: ["v"], navidad: ["n", "f"], necesitar: ["v"], negar: ["v"], negarse: ["v"], negligencia: ["n", "f"], negociante: ["x"], negociar: ["v"], negocio: ["n", "m"], negro: ["x"], nervio: ["n", "m"], nervioso: ["x"], neumon\u00EDa: ["n", "f"], neurolog\u00EDa: ["n", "f"], neurona: ["n", "f"], neuronal: ["x"], neutralizar: ["v"], nevar: ["v"], nevera: ["n", "f"], nido: ["n", "m"], niebla: ["n", "f"], nieta: ["n", "f"], nieto: ["n", "m"], nieve: ["n", "f"], nitr\u00F3geno: ["n", "m"], ni\u00F1a: ["n", "f"], ni\u00F1ez: ["n", "f"], ni\u00F1o: ["n", "m"], noble: ["x"], nobleza: ["n", "f"], nombrar: ["v"], nombre: ["n", "m"], nordeste: ["x"], norma: ["n", "f"], normas: ["x"], normativa: ["n", "f"], noroeste: ["x"], norte: ["n", "m"], nota: ["n", "f"], notar: ["v"], notas: ["x"], noticia: ["n", "f"], noticias: ["n", "f"], notificaci\u00F3n: ["n", "f"], notificar: ["v"], novato: ["n", "m"], novela: ["n", "f"], novelista: ["n", "f"], novia: ["n", "f"], novio: ["n", "m"], nube: ["n", "f"], nublarse: ["v"], nudo: ["n", "m"], nueces: ["x"], nuera: ["n", "f"], nueve: ["x"], nuevo: ["x"], nunca: ["x"], nutritivo: ["x"], n\u00E1useas: ["x"], n\u00FAcleo: ["n", "m"], n\u00FAmero: ["n", "m"], obedecer: ["v"], objeto: ["n", "m"], obligar: ["v"], obra: ["n", "f"], obrero: ["n", "m"], observar: ["v"], observatorio: ["n", "m"], obtener: ["v"], oca: ["n", "f"], ocasionar: ["v"], occidental: ["x"], occidente: ["n", "m"], ocean\u00EDa: ["x"], ocho: ["x"], ocio: ["n", "m"], oculista: ["n", "f"], ocultar: ["v"], ocupaci\u00F3n: ["n", "f"], ocupado: ["x"], ocupar: ["v"], ocurrir: ["v"], oc\u00E9ano: ["n", "m"], odiar: ["v"], odio: ["n", "m"], oeste: ["x"], oferta: ["n", "f"], oficial: ["n", "m"], oficina: ["n", "f"], oficio: ["n", "m"], ofrecer: ["v"], ojera: ["n", "f"], ojo: ["n", "m"], ola: ["n", "f"], olas: ["n", "f"], oler: ["v"], olfato: ["n", "m"], olimpiada: ["n", "f"], olivo: ["n", "m"], olla: ["n", "f"], olvidar: ["v"], ombligo: ["n", "m"], operar: ["v"], operario: ["n", "m"], opinar: ["v"], opini\u00F3n: ["n", "f"], oponente: ["n", "m"], oponer: ["v"], oponerse: ["v"], optar: ["v"], optimismo: ["n", "m"], optimista: ["n", "f"], oraci\u00F3n: ["n", "f"], ordenador: ["n", "m"], ordenar: ["v"], orde\u00F1ar: ["v"], organizaci\u00F3n: ["n", "f"], organizar: ["v"], orgullo: ["n", "m"], orgulloso: ["x"], org\u00E1nico: ["n", "m"], oriental: ["x"], orientar: ["v"], orientarse: ["v"], oriente: ["n", "m"], original: ["x"], orilla: ["n", "f"], oro: ["n", "m"], orquesta: ["n", "f"], ortodoxo: ["n", "m"], orujo: ["n", "m"], or\u00E9gano: ["n", "m"], oscurecer: ["v"], oso: ["n", "m"], ostentar: ["v"], otorgar: ["v"], otorrino: ["n", "m"], oto\u00F1o: ["n", "m"], oveja: ["n", "f"], ox\u00EDgeno: ["n", "m"], oyente: ["n", "m"], o\u00EDdo: ["n", "m"], o\u00EDr: ["v"], pabell\u00F3n: ["n", "m"], paciencia: ["n", "f"], paciente: ["x"], pactar: ["v"], padecer: ["v"], padrastro: ["n", "m"], padre: ["n", "m"], padres: ["n", "m"], padrino: ["n", "m"], paella: ["n", "f"], pagar: ["v"], pago: ["n", "m"], paisaje: ["n", "m"], pajar: ["n", "m"], pala: ["n", "f"], palacete: ["n", "m"], palacio: ["n", "m"], palco: ["n", "m"], palmera: ["n", "f"], pan: ["n", "m"], panadero: ["n", "m"], panader\u00EDa: ["n", "f"], pancarta: ["n", "f"], panel: ["n", "m"], pantalla: ["n", "f"], pantalones: ["n", "m"], pantano: ["n", "m"], papa: ["n", "m"], papaya: ["n", "f"], papel: ["n", "m"], papelera: ["n", "f"], papeler\u00EDa: ["n", "f"], papeleta: ["n", "f"], pap\u00E1: ["x"], paquete: ["n", "m"], parada: ["n", "f"], parador: ["n", "m"], paraguas: ["x"], parapente: ["n", "m"], parar: ["v"], para\u00EDso: ["n", "m"], parecer: ["v"], parecerse: ["v"], pared: ["n", "f"], pareja: ["n", "f"], pariente: ["n", "m"], parientes: ["x"], parir: ["v"], parlamentario: ["n", "m"], parlamento: ["n", "m"], parpadear: ["v"], parque: ["n", "m"], parte: ["x"], participaci\u00F3n: ["n", "f"], participar: ["v"], partido: ["n", "m"], partir: ["v"], partirse: ["v"], parto: ["n", "m"], pasajero: ["n", "m"], pasaporte: ["n", "m"], pasar: ["v"], pasarela: ["n", "f"], pasarse: ["v"], pasatiempo: ["n", "m"], pasear: ["v"], paseo: ["n", "m"], pasillo: ["n", "m"], paso: ["n", "m"], pasta: ["n", "f"], pastilla: ["n", "f"], pastor: ["n", "m"], pata: ["n", "f"], patata: ["n", "f"], paternidad: ["n", "f"], patinar: ["v"], pato: ["n", "m"], patrimonio: ["n", "m"], patrocinador: ["n", "m"], patrocinar: ["v"], pavo: ["n", "m"], paz: ["n", "f"], pa\u00EDs: ["n", "m"], pa\u00EDses: ["x"], pa\u00F1o: ["n", "m"], pa\u00F1uelo: ["n", "m"], peaje: ["n", "m"], peat\u00F3n: ["n", "m"], peca: ["n", "f"], pecado: ["n", "m"], pecador: ["n", "m"], pecar: ["v"], pecho: ["n", "m"], pechugas: ["x"], pedagogo: ["n", "m"], pedagog\u00EDa: ["n", "f"], pedag\u00F3gico: ["n", "m"], pediatra: ["n", "f"], pediatr\u00EDa: ["n", "f"], pedido: ["n", "m"], pedir: ["v"], pegar: ["v"], pegarse: ["v"], pegatina: ["n", "f"], peinado: ["n", "m"], peinarse: ["v"], peine: ["n", "m"], pelearse: ["v"], pelicul\u00F3n: ["n", "m"], pelo: ["n", "m"], pelota: ["n", "f"], peludo: ["n", "m"], peluquer\u00EDa: ["n", "f"], pel\u00EDcula: ["n", "f"], pena: ["n", "f"], pendientes: ["n", "m"], peninsular: ["v"], penitente: ["n", "m"], pensador: ["n", "m"], pensamiento: ["n", "m"], pensar: ["v"], pensi\u00F3n: ["n", "f"], pen\u00EDnsula: ["n", "f"], pepita: ["n", "f"], peque\u00F1o: ["x"], percebe: ["n", "m"], percha: ["n", "f"], perdedor: ["n", "m"], perder: ["v"], perderse: ["v"], perdiz: ["n", "f"], perdonar: ["v"], perd\u00F3n: ["x"], perejil: ["n", "m"], perezoso: ["x"], perfume: ["n", "m"], periferia: ["n", "f"], periodismo: ["n", "m"], periodista: ["n", "f"], periodo: ["n", "m"], peri\u00F3dico: ["n", "m"], perjudicial: ["x"], permanecer: ["v"], permiso: ["n", "m"], permitir: ["v"], pero: ["x"], perro: ["n", "m"], persecuci\u00F3n: ["n", "f"], perseguir: ["v"], persistir: ["v"], personaje: ["n", "m"], personal: ["n", "m"], personas: ["x"], pertenecer: ["v"], pesar: ["v"], pesca: ["n", "f"], pescado: ["n", "m"], pescador: ["n", "m"], pesimismo: ["n", "m"], pesta\u00F1a: ["n", "f"], pesta\u00F1ear: ["v"], pesticidas: ["x"], petrolero: ["n", "m"], petr\u00F3leo: ["n", "m"], pez: ["n", "m"], pezu\u00F1a: ["n", "f"], pianista: ["n", "f"], piano: ["n", "m"], picadora: ["n", "f"], picante: ["x"], picar: ["v"], picor: ["n", "m"], pie: ["n", "m"], piedad: ["n", "f"], piel: ["n", "f"], pierna: ["n", "f"], pieza: ["n", "f"], pijama: ["n", "m"], pilotar: ["v"], piloto: ["n", "m"], pimienta: ["n", "f"], pinchar: ["v"], pinchazo: ["n", "m"], pincho: ["n", "m"], pino: ["n", "m"], pintar: ["v"], pintarse: ["v"], pintor: ["n", "m"], pintura: ["n", "f"], piragua: ["n", "f"], pirata: ["n", "f"], pir\u00E1mide: ["n", "f"], pisar: ["v"], piscina: ["n", "f"], piso: ["n", "m"], pista: ["n", "f"], pistola: ["n", "f"], pizarra: ["n", "f"], pizzer\u00EDa: ["n", "f"], pi\u00F1a: ["n", "f"], planchado: ["n", "m"], planchar: ["v"], planear: ["v"], planeta: ["n", "m"], plano: ["n", "m"], planos: ["x"], planta: ["n", "f"], plantaci\u00F3n: ["n", "f"], plantar: ["v"], planteamiento: ["n", "m"], plantear: ["v"], plantilla: ["n", "f"], plastificar: ["v"], plata: ["n", "f"], plato: ["n", "m"], playa: ["n", "f"], plaza: ["n", "f"], pluralidad: ["n", "f"], pl\u00E1tano: ["n", "m"], poblaci\u00F3n: ["n", "f"], poblado: ["n", "m"], pobre: ["x"], pobreza: ["n", "f"], pocilga: ["n", "f"], poco: ["x"], poda: ["n", "f"], podar: ["v"], poder: ["v"], poema: ["n", "m"], poes\u00EDa: ["n", "f"], poeta: ["n", "m"], polen: ["n", "m"], polic\u00EDa: ["n", "m"], polite\u00EDsmo: ["n", "m"], pollo: ["n", "m"], polo: ["n", "m"], poluci\u00F3n: ["n", "f"], pol\u00EDgono: ["n", "m"], pol\u00EDtica: ["n", "f"], pol\u00EDtico: ["n", "m"], pomada: ["n", "f"], poner: ["v"], ponerse: ["v"], pop: ["n", "m"], porque: ["x"], portada: ["n", "f"], portarse: ["v"], portaviones: ["n", "m"], portero: ["n", "m"], port\u00E1til: ["x"], posdata: ["n", "f"], poseer: ["v"], posgrado: ["n", "m"], posponer: ["v"], postal: ["n", "f"], postura: ["n", "f"], practicante: ["x"], practicar: ["v"], pradera: ["n", "f"], prado: ["n", "m"], preadolescencia: ["n", "f"], preceder: ["v"], precio: ["n", "m"], precipitaciones: ["x"], precisar: ["v"], predecir: ["v"], predicador: ["n", "m"], preferir: ["v"], prefijo: ["n", "m"], pregunta: ["n", "f"], preguntar: ["v"], premio: ["n", "m"], prender: ["v"], prensa: ["n", "f"], preocupar: ["v"], preocuparse: ["v"], preparador: ["n", "m"], preparar: ["v"], prepararse: ["v"], prepotencia: ["n", "f"], prepotente: ["x"], prescribir: ["v"], presenciar: ["v"], presentaci\u00F3n: ["n", "f"], presentador: ["n", "m"], presentar: ["v"], preservar: ["v"], presidencia: ["n", "f"], presidencial: ["x"], presidente: ["n", "m"], presidir: ["v"], prestaci\u00F3n: ["n", "f"], prestar: ["v"], presunto: ["n", "m"], presupuesto: ["n", "m"], pretender: ["v"], prevenir: ["v"], prever: ["v"], previsi\u00F3n: ["n", "f"], prima: ["n", "f"], primavera: ["n", "f"], primer: ["n", "m"], primero: ["x"], primicia: ["n", "f"], primo: ["n", "m"], princesa: ["n", "f"], principal: ["x"], principio: ["n", "m"], privacidad: ["n", "f"], privado: ["n", "m"], privatizaci\u00F3n: ["n", "f"], probador: ["n", "m"], probar: ["v"], probarse: ["v"], proceder: ["v"], procesar: ["v"], procesi\u00F3n: ["n", "f"], proceso: ["n", "m"], producci\u00F3n: ["n", "f"], producir: ["v"], producirse: ["v"], producto: ["n", "m"], productor: ["n", "m"], profesional: ["n", "m"], profesionalidad: ["n", "f"], profesi\u00F3n: ["n", "f"], profesor: ["n", "m"], profesora: ["n", "f"], profesorado: ["n", "m"], profundidad: ["n", "f"], programa: ["n", "m"], programaci\u00F3n: ["n", "f"], programar: ["v"], progresar: ["v"], progreso: ["n", "m"], prohibir: ["v"], proletariado: ["n", "m"], proletario: ["n", "m"], prometer: ["v"], promoci\u00F3n: ["n", "f"], promotor: ["n", "m"], promover: ["v"], pronunciar: ["v"], pronunciarse: ["v"], propaganda: ["n", "f"], propagar: ["v"], propiedad: ["n", "f"], propietario: ["n", "m"], proponer: ["v"], prorrogar: ["v"], prosa: ["x"], proseguir: ["v"], prospecto: ["n", "m"], prosperidad: ["n", "f"], protagonista: ["n", "m"], protagonizar: ["v"], protecci\u00F3n: ["n", "f"], proteger: ["v"], protestante: ["x"], protestantismo: ["n", "m"], protestar: ["v"], prote\u00EDnas: ["x"], proveedor: ["n", "m"], proveer: ["v"], provenir: ["v"], provincia: ["n", "f"], provincial: ["x"], provocar: ["v"], proyecci\u00F3n: ["n", "f"], proyectar: ["v"], proyecto: ["n", "m"], prudente: ["x"], prueba: ["n", "f"], pr\u00E9stamo: ["n", "m"], pr\u00EDncipe: ["n", "m"], pr\u00F3logo: ["n", "m"], psicosis: ["n", "f"], psic\u00F3logo: ["n", "m"], psiquiatr\u00EDa: ["n", "f"], publicar: ["v"], publicidad: ["n", "f"], publicitario: ["n", "m"], pudrirse: ["v"], pueblo: ["n", "m"], puente: ["n", "m"], puerta: ["n", "f"], puerto: ["n", "m"], pulgar: ["n", "m"], pulm\u00F3n: ["n", "m"], pulpa: ["n", "f"], pulsar: ["v"], pulsera: ["n", "f"], puntas: ["x"], punto: ["n", "m"], puntualidad: ["n", "f"], puntuar: ["v"], pureza: ["n", "f"], purgatorio: ["n", "m"], puzle: ["n", "m"], pu\u00F1o: ["n", "m"], p\u00E1gina: ["n", "f"], p\u00E1jaro: ["n", "m"], p\u00E1ncreas: ["n", "m"], p\u00E1rroco: ["n", "m"], p\u00E9rdidas: ["x"], p\u00E9talo: ["n", "m"], p\u00EDldora: ["n", "f"], p\u00F3ster: ["n", "m"], p\u00FAblico: ["n", "m"], quebrar: ["v"], quedar: ["v"], quedarse: ["v"], quehacer: ["n", "m"], quejarse: ["v"], quemadura: ["n", "f"], quemar: ["v"], quemarse: ["v"], querer: ["v"], queso: ["n", "m"], quiosco: ["n", "m"], quir\u00F3fano: ["n", "m"], quitar: ["v"], quitarse: ["v"], qui\u00E9n: ["x"], qu\u00E9: ["x"], qu\u00EDmica: ["n", "f"], qu\u00EDmico: ["n", "m"], rabino: ["n", "m"], raci\u00F3n: ["n", "f"], radio: ["n", "f"], radiograf\u00EDa: ["n", "f"], radiolog\u00EDa: ["n", "f"], rama: ["n", "f"], ramad\u00E1n: ["n", "m"], ramillete: ["n", "m"], rascarse: ["v"], rastrillo: ["n", "m"], rat\u00F3n: ["n", "m"], razonamiento: ["n", "m"], razonar: ["v"], raz\u00F3n: ["n", "f"], ra\u00EDz: ["n", "f"], reaccionar: ["v"], realidad: ["n", "f"], realizador: ["n", "m"], realizar: ["v"], rebajar: ["v"], reba\u00F1o: ["n", "m"], rebeld\u00EDa: ["n", "f"], rebozar: ["v"], recaer: ["v"], reca\u00EDda: ["n", "f"], recepcionista: ["n", "f"], recepci\u00F3n: ["n", "f"], receta: ["n", "f"], recetar: ["v"], rechazar: ["v"], rechoncho: ["n", "m"], recibir: ["v"], recibo: ["n", "m"], reciclaje: ["n", "m"], reciclar: ["v"], reciclarse: ["v"], recipiente: ["x"], recital: ["n", "m"], recitar: ["v"], reclamar: ["v"], recogedor: ["n", "m"], recoger: ["v"], recogerse: ["v"], recolecci\u00F3n: ["n", "f"], recomendar: ["v"], reconciliarse: ["v"], reconocer: ["v"], recordar: ["v"], recorrer: ["v"], recortar: ["v"], recortarse: ["v"], recriminar: ["v"], rector: ["n", "m"], rectorado: ["n", "m"], recuerdo: ["n", "m"], recuperar: ["v"], recuperarse: ["v"], recurrir: ["v"], recursos: ["x"], red: ["n", "f"], redacci\u00F3n: ["n", "f"], redactar: ["v"], redactor: ["n", "m"], redenci\u00F3n: ["n", "f"], reducir: ["v"], reencarnaci\u00F3n: ["n", "f"], reencarnarse: ["v"], reencontrarse: ["v"], reenviar: ["v"], reestructurar: ["v"], referir: ["v"], referirse: ["v"], refer\u00E9ndum: ["n", "m"], reflejar: ["v"], reflexionar: ["v"], reforestar: ["v"], reforma: ["n", "f"], reformar: ["v"], reforzar: ["v"], refresco: ["n", "m"], regalar: ["v"], regalo: ["n", "m"], regar: ["v"], rega\u00F1ar: ["v"], regional: ["x"], registrar: ["v"], registrarse: ["v"], regi\u00F3n: ["n", "f"], regla: ["n", "f"], regordete: ["x"], regresar: ["v"], rehabilitar: ["v"], reina: ["n", "f"], reiniciar: ["v"], reintegro: ["n", "m"], reiterar: ["v"], reivindicar: ["v"], relacionar: ["v"], relacionarse: ["v"], relaci\u00F3n: ["n", "f"], relajarse: ["v"], relatar: ["v"], relato: ["n", "m"], religi\u00F3n: ["n", "f"], rellenito: ["n", "m"], reloj: ["n", "m"], rel\u00E1mpago: ["n", "m"], remitente: ["n", "m"], remitir: ["v"], remolcar: ["v"], remolino: ["n", "m"], remolque: ["n", "m"], remunerar: ["v"], renal: ["x"], rendir: ["v"], rendirse: ["v"], renfe: ["x"], renovar: ["v"], renta: ["n", "f"], rentabilizar: ["v"], renuncia: ["n", "f"], renunciar: ["v"], reparaci\u00F3n: ["n", "f"], reparar: ["v"], repartidor: ["n", "m"], repartir: ["v"], reparto: ["n", "m"], repasar: ["v"], repetidor: ["n", "m"], repetir: ["v"], repoblar: ["v"], reponer: ["v"], reportero: ["n", "m"], representaci\u00F3n: ["n", "f"], representante: ["x"], representar: ["v"], reproducir: ["v"], reproducirse: ["v"], reptar: ["v"], reptil: ["x"], republicano: ["n", "m"], repuesto: ["n", "m"], repugnar: ["v"], rep\u00FAblica: ["n", "f"], requerir: ["v"], resaltar: ["v"], resentimiento: ["n", "m"], reservado: ["x"], reservar: ["v"], resguardo: ["n", "m"], residencia: ["n", "f"], residencias: ["x"], residente: ["n", "m"], residir: ["v"], residuos: ["x"], resignaci\u00F3n: ["n", "f"], resignado: ["x"], resignarse: ["v"], resistir: ["v"], resolver: ["v"], respetar: ["v"], respirar: ["v"], responder: ["v"], responsabilidad: ["n", "f"], responsable: ["n", "m"], restar: ["v"], restaurante: ["n", "m"], resucitar: ["v"], resultar: ["v"], resumir: ["v"], resurrecci\u00F3n: ["n", "f"], retener: ["v"], retirar: ["v"], retirarse: ["v"], retomar: ["v"], retransmitir: ["v"], retrasar: ["v"], retrasarse: ["v"], retrato: ["n", "m"], retribuci\u00F3n: ["n", "f"], retribuir: ["v"], retroceder: ["v"], retroproyector: ["n", "m"], retrovisor: ["n", "m"], reunir: ["v"], reunirse: ["v"], reuni\u00F3n: ["n", "f"], revalorizarse: ["v"], revelar: ["v"], revisar: ["v"], revisi\u00F3n: ["n", "f"], revista: ["n", "f"], revolver: ["v"], rey: ["n", "m"], rezar: ["v"], re\u00EDr: ["v"], re\u00F1ir: ["v"], ribera: ["n", "f"], rico: ["n", "m"], riego: ["n", "m"], riesgos: ["x"], rimar: ["v"], riqueza: ["n", "f"], ritmo: ["n", "m"], rizo: ["n", "m"], ri\u00F1\u00F3n: ["n", "m"], robar: ["v"], robo: ["n", "m"], robusto: ["n", "m"], rock: ["x"], rodaje: ["n", "m"], rodar: ["v"], rodear: ["v"], rodilla: ["n", "f"], rogar: ["v"], rojo: ["x"], romance: ["n", "m"], romanticismo: ["n", "m"], romero: ["n", "m"], rompecabezas: ["n", "m"], rompeolas: ["n", "m"], romper: ["v"], romperse: ["v"], ron: ["x"], ropa: ["n", "f"], rosa: ["x"], rosario: ["n", "m"], rotonda: ["n", "f"], rotulador: ["n", "m"], rozar: ["v"], ruborizarse: ["v"], rueda: ["n", "f"], rugir: ["v"], rumor: ["n", "m"], rural: ["x"], ruta: ["n", "f"], r\u00E1pido: ["x"], r\u00E9cord: ["n", "m"], r\u00EDmel: ["x"], r\u00EDo: ["n", "m"], r\u00FAstico: ["n", "m"], sabana: ["n", "f"], sabbat: ["x"], saber: ["v"], sabor: ["n", "m"], saborear: ["v"], sabroso: ["x"], sacacorchos: ["n", "m"], sacar: ["v"], sacarse: ["v"], sacerdote: ["n", "m"], sacudir: ["v"], sagrado: ["x"], sal: ["n", "f"], sala: ["n", "f"], salado: ["n", "m"], salario: ["n", "m"], salchich\u00F3n: ["n", "m"], saldo: ["n", "m"], salida: ["n", "f"], salir: ["v"], saliva: ["x"], salmonete: ["n", "m"], salm\u00F3n: ["n", "m"], salsa: ["n", "f"], saltar: ["v"], saltarse: ["v"], salud: ["n", "f"], saludable: ["x"], saludar: ["v"], saludo: ["n", "m"], salvaci\u00F3n: ["n", "f"], salvapantallas: ["n", "m"], salvar: ["v"], salvarse: ["v"], sal\u00F3n: ["n", "m"], san: ["x"], sanatorio: ["n", "m"], sancionar: ["v"], sanci\u00F3n: ["n", "f"], sandalias: ["x"], santo: ["n", "m"], sardina: ["n", "f"], sart\u00E9n: ["n", "f"], satisfacer: ["v"], satisfecho: ["n", "m"], saturarse: ["v"], saturno: ["n", "m"], sat\u00E9lite: ["n", "m"], sauna: ["n", "f"], savia: ["n", "f"], saxof\u00F3n: ["n", "m"], secado: ["n", "m"], secarse: ["v"], secretar\u00EDa: ["n", "f"], secta: ["n", "f"], sector: ["n", "m"], secuencia: ["n", "f"], secuestrador: ["n", "m"], secuestro: ["n", "m"], secundario: ["n", "m"], seda: ["n", "f"], seducir: ["v"], segregar: ["v"], seguidor: ["n", "m"], seguimiento: ["n", "m"], seguir: ["v"], segundo: ["n", "m"], seguridad: ["n", "f"], seguro: ["n", "m"], seguros: ["x"], seis: ["x"], seleccionar: ["v"], sellar: ["v"], sello: ["n", "m"], selva: ["n", "f"], semana: ["n", "f"], sembrar: ["v"], semifinal: ["n", "f"], semilla: ["n", "f"], seminario: ["n", "m"], sem\u00E1foro: ["n", "m"], senado: ["n", "m"], senador: ["n", "m"], senderista: ["n", "f"], sensibilidad: ["n", "f"], sentar: ["v"], sentarse: ["v"], sentencia: ["n", "f"], sentimiento: ["n", "m"], sentir: ["v"], sentirse: ["v"], separaci\u00F3n: ["n", "f"], separado: ["x"], separar: ["v"], separarse: ["v"], sequ\u00EDa: ["n", "f"], ser: ["v"], serie: ["n", "f"], seriedad: ["n", "f"], serio: ["n", "m"], serpiente: ["x"], servicio: ["n", "m"], servidor: ["n", "m"], servilleta: ["n", "f"], servir: ["v"], sesi\u00F3n: ["n", "f"], seta: ["n", "f"], seud\u00F3nimo: ["n", "m"], sexo: ["n", "m"], se\u00F1al: ["n", "f"], se\u00F1alar: ["v"], se\u00F1or: ["n", "m"], se\u00F1ora: ["n", "f"], se\u00F1ores: ["x"], siempre: ["x"], sierra: ["n", "f"], siete: ["x"], significar: ["v"], silbar: ["v"], silenciar: ["v"], silla: ["n", "f"], sill\u00F3n: ["n", "m"], silvestre: ["x"], simp\u00E1tico: ["n", "m"], sin: ["x"], sinceridad: ["n", "f"], sincero: ["n", "m"], sindicarse: ["v"], sindicato: ["n", "m"], sinfon\u00EDa: ["n", "f"], sistema: ["n", "m"], sitio: ["n", "m"], situar: ["v"], soborno: ["n", "m"], sobrar: ["v"], sobrasada: ["n", "f"], sobre: ["n", "m"], sobrepasar: ["v"], sobreproteger: ["v"], sobresalir: ["v"], sobrevivir: ["v"], sobrevolar: ["v"], sobrina: ["n", "f"], sobrino: ["n", "m"], sobrio: ["n", "m"], sociabilidad: ["n", "f"], sociable: ["x"], socialismo: ["n", "m"], socialista: ["n", "f"], sociedad: ["n", "f"], socio: ["n", "m"], sociolog\u00EDa: ["n", "f"], soci\u00F3logo: ["n", "m"], socorrer: ["v"], socorro: ["n", "m"], sof\u00E1: ["n", "m"], sol: ["n", "m"], soldado: ["n", "m"], soler: ["v"], solicitar: ["v"], solidaridad: ["n", "f"], solidario: ["n", "m"], solista: ["n", "f"], soltar: ["v"], soltero: ["n", "m"], solucionar: ["v"], sombrero: ["n", "m"], sombrilla: ["n", "f"], sonar: ["v"], sonata: ["n", "f"], sonido: ["n", "m"], sonre\u00EDr: ["v"], sonrojarse: ["v"], sopa: ["n", "f"], sopera: ["n", "f"], soplar: ["v"], soportar: ["v"], soprano: ["n", "m"], sorber: ["v"], sordo: ["n", "m"], sorprender: ["v"], sorprenderse: ["v"], sorprendido: ["x"], soso: ["x"], sospechar: ["v"], sospechoso: ["n", "m"], sostener: ["v"], so\u00F1ar: ["v"], startup: ["n", "f"], suavizante: ["x"], subasta: ["n", "f"], subastar: ["v"], subcontratar: ["v"], subir: ["v"], subirse: ["v"], sublevaci\u00F3n: ["n", "f"], submarino: ["n", "m"], subrayar: ["v"], subt\u00EDtulo: ["n", "m"], succionar: ["v"], suceder: ["v"], suciedad: ["n", "f"], sucio: ["n", "m"], sucursal: ["n", "f"], sudar: ["v"], sudeste: ["x"], sudor: ["n", "m"], suegra: ["n", "f"], suegro: ["n", "m"], sueldo: ["n", "m"], suelo: ["n", "m"], sufrimiento: ["n", "m"], sufrir: ["v"], sugerir: ["v"], suite: ["n", "f"], sujetador: ["n", "m"], sujetar: ["v"], sumar: ["v"], suministro: ["n", "m"], superar: ["v"], supermercado: ["n", "m"], superpoblaci\u00F3n: ["n", "f"], supervisar: ["v"], suplemento: ["n", "m"], suplente: ["n", "m"], suponer: ["v"], supositorio: ["n", "m"], suprimir: ["v"], sur: ["n", "m"], surgir: ["v"], suroeste: ["x"], surtidor: ["n", "m"], susceptibilidad: ["n", "f"], susceptible: ["x"], suscribir: ["v"], suscribirse: ["v"], suspender: ["v"], suspirar: ["v"], sustancia: ["n", "f"], sustituir: ["v"], sustituto: ["n", "m"], sustraer: ["v"], s\u00E1bado: ["x"], s\u00E1ndwich: ["x"], s\u00EDmbolo: ["n", "m"], s\u00EDntoma: ["n", "m"], s\u00EDntomas: ["x"], taberna: ["n", "f"], tabla: ["n", "f"], tablero: ["n", "m"], tabl\u00F3n: ["n", "m"], tac: ["n", "m"], taca\u00F1o: ["n", "m"], tacto: ["n", "m"], talar: ["v"], talento: ["n", "m"], taller: ["n", "m"], tambi\u00E9n: ["x"], tango: ["n", "m"], tanque: ["n", "m"], tapa: ["n", "f"], tapar: ["v"], tapear: ["v"], tapiz: ["n", "m"], tap\u00F3n: ["n", "m"], taquilla: ["n", "f"], tardar: ["v"], tarde: ["x"], tarifa: ["n", "f"], tarjeta: ["n", "f"], tarta: ["n", "f"], tasa: ["n", "f"], tasaci\u00F3n: ["n", "f"], tasar: ["v"], tasca: ["n", "f"], tatarabuelo: ["n", "m"], taxi: ["n", "m"], taxista: ["n", "f"], taza: ["n", "f"], taz\u00F3n: ["n", "f"], teatro: ["n", "m"], techo: ["n", "m"], tecla: ["n", "f"], teclado: ["n", "m"], tecnolog\u00EDa: ["n", "f"], tejido: ["n", "m"], teleadicto: ["n", "m"], telebasura: ["n", "f"], telefonear: ["v"], telefon\u00EDa: ["n", "f"], telenovela: ["n", "f"], telescopio: ["n", "m"], telespectador: ["n", "m"], teletrabajo: ["n", "m"], televisar: ["v"], televisi\u00F3n: ["n", "f"], televisor: ["n", "m"], tel\u00E9fono: ["n", "m"], tema: ["n", "m"], temblar: ["v"], temer: ["v"], temerario: ["n", "m"], temor: ["n", "m"], temperatura: ["n", "f"], temperaturas: ["x"], templo: ["n", "m"], temporada: ["n", "f"], temporal: ["n", "m"], temprano: ["x"], tendencia: ["n", "f"], tender: ["v"], tend\u00F3n: ["n", "m"], tenedor: ["n", "m"], tener: ["v"], tenis: ["n", "m"], tenor: ["n", "m"], teolog\u00EDa: ["n", "f"], teor\u00EDa: ["n", "f"], terapia: ["n", "f"], terap\u00E9utico: ["n", "m"], terminal: ["n", "f"], terminar: ["v"], termo: ["n", "m"], term\u00F3metro: ["n", "m"], ternura: ["n", "f"], terraza: ["n", "f"], terremoto: ["n", "m"], terreno: ["n", "m"], territorial: ["x"], terrorismo: ["n", "m"], terrorista: ["n", "f"], tesina: ["n", "f"], test: ["n", "m"], testificar: ["v"], testigo: ["n", "m"], texto: ["n", "m"], te\u00F1ir: ["v"], te\u00F1irse: ["v"], tiempo: ["n", "m"], tienda: ["n", "f"], tierno: ["n", "m"], tierra: ["n", "f"], tigre: ["n", "m"], tijeras: ["x"], timbre: ["n", "m"], timidez: ["n", "f"], tinta: ["n", "f"], tirar: ["v"], tirarse: ["v"], tirita: ["n", "f"], tiritar: ["v"], titulaci\u00F3n: ["n", "f"], titular: ["v"], titularse: ["v"], toalla: ["n", "f"], tobillo: ["n", "m"], tocar: ["v"], todo: ["x"], todoterreno: ["n", "m"], tolerancia: ["n", "f"], tolerante: ["x"], tolerar: ["v"], tomar: ["v"], tomate: ["n", "m"], tomillo: ["n", "m"], tono: ["n", "m"], torcer: ["v"], tormenta: ["n", "f"], torneo: ["n", "m"], torpedo: ["n", "m"], tortilla: ["n", "f"], tor\u00E1: ["n", "f"], toser: ["v"], tostar: ["v"], trabajador: ["n", "m"], trabajar: ["v"], trabajo: ["n", "m"], tractor: ["n", "m"], traducir: ["v"], traductor: ["n", "m"], traer: ["v"], tragar: ["v"], tragedia: ["n", "f"], tragicomedia: ["n", "f"], trag\u00F3n: ["n", "m"], traicionar: ["v"], traici\u00F3n: ["n", "f"], traje: ["n", "m"], trama: ["n", "f"], tramitar: ["v"], tranquilidad: ["n", "f"], tranquilizar: ["v"], tranquilo: ["x"], transatl\u00E1ntico: ["n", "m"], transcribir: ["v"], transexual: ["x"], transferencia: ["n", "f"], transformar: ["v"], transmisi\u00F3n: ["n", "f"], transmitir: ["v"], transparencia: ["n", "f"], transpirar: ["v"], transportar: ["v"], transporte: ["n", "m"], transportes: ["x"], tranv\u00EDa: ["n", "f"], trapo: ["n", "m"], trasbordador: ["n", "m"], trasladar: ["v"], trasladarse: ["v"], trasnochar: ["v"], traspasar: ["v"], trasplantar: ["v"], trastorno: ["n", "m"], tratamiento: ["n", "m"], tratar: ["v"], tratarse: ["v"], traumat\u00F3logo: ["n", "m"], travieso: ["n", "m"], trayecto: ["n", "m"], treinta\u00F1ero: ["n", "m"], tren: ["n", "m"], trepar: ["v"], tres: ["x"], tribuna: ["n", "f"], tribunal: ["n", "m"], trillizos: ["x"], triplicarse: ["v"], tripulaci\u00F3n: ["n", "f"], tripular: ["v"], triste: ["x"], tristeza: ["n", "f"], triunfar: ["v"], triunfo: ["n", "m"], tri\u00E1ngulo: ["n", "m"], trompa: ["n", "f"], trompeta: ["n", "f"], tronar: ["v"], tronco: ["n", "m"], tropa: ["n", "f"], tropezar: ["v"], tropical: ["x"], trotar: ["v"], trueno: ["n", "m"], tr\u00E1fico: ["n", "m"], tr\u00E1mite: ["n", "m"], tr\u00EDo: ["n", "m"], tr\u00F3pico: ["n", "m"], tumba: ["n", "f"], tumbarse: ["v"], turismo: ["n", "m"], turista: ["n", "m"], turno: ["n", "m"], turquesa: ["n", "f"], tutor: ["n", "m"], t\u00E9cnica: ["n", "f"], t\u00E9cnico: ["n", "m"], t\u00EDa: ["n", "f"], t\u00EDmido: ["n", "m"], t\u00EDmpano: ["n", "m"], t\u00EDo: ["n", "m"], t\u00EDtulo: ["n", "m"], t\u00F3xico: ["n", "m"], t\u00FAnel: ["n", "m"], uci: ["n", "f"], unidad: ["n", "f"], uniforme: ["x"], unir: ["v"], universal: ["n", "m"], universidad: ["n", "f"], universitario: ["n", "m"], universo: ["n", "m"], uno: ["x"], urbanidad: ["n", "f"], urbanizaci\u00F3n: ["n", "f"], urbano: ["n", "m"], urgencias: ["x"], urna: ["n", "f"], usar: ["v"], usuario: ["n", "m"], utilizar: ["v"], uvi: ["n", "f"], u\u00F1a: ["n", "f"], vaca: ["n", "f"], vacaciones: ["x"], vacaci\u00F3n: ["n", "f"], vaciar: ["v"], vacilar: ["v"], vacuna: ["n", "f"], vacunar: ["v"], vacunarse: ["v"], vac\u00EDo: ["x"], vago: ["n", "m"], vaguear: ["v"], vag\u00F3n: ["n", "m"], vajilla: ["n", "f"], valent\u00EDa: ["n", "f"], valer: ["v"], validez: ["n", "f"], valle: ["n", "m"], valoraci\u00F3n: ["n", "f"], valorar: ["v"], vaqueros: ["x"], variar: ["v"], var\u00F3n: ["n", "m"], vaso: ["n", "m"], vecindario: ["n", "m"], vecino: ["n", "m"], vegetaci\u00F3n: ["n", "f"], veh\u00EDculo: ["n", "m"], vejez: ["n", "f"], vela: ["n", "f"], vello: ["n", "m"], vencer: ["v"], venda: ["n", "f"], vendar: ["v"], vendedor: ["n", "m"], vender: ["v"], venir: ["v"], venirle: ["x"], venta: ["n", "f"], ventana: ["n", "f"], ventanilla: ["n", "f"], venus: ["x"], ver: ["v"], veraneante: ["x"], veranear: ["v"], veraneo: ["n", "m"], verano: ["n", "m"], verde: ["x"], verdura: ["n", "f"], verificar: ["v"], verso: ["n", "m"], vers\u00E1til: ["x"], verter: ["v"], vestido: ["n", "m"], vestir: ["v"], vestirse: ["v"], vestuario: ["n", "m"], vest\u00EDbulo: ["n", "m"], veterinaria: ["n", "f"], veterinario: ["n", "m"], viajar: ["v"], viaje: ["n", "m"], viajero: ["n", "m"], victoria: ["n", "f"], vida: ["n", "f"], videoconferencia: ["n", "f"], videojuego: ["n", "m"], videollamada: ["n", "f"], vidrio: ["n", "m"], viejo: ["x"], viento: ["n", "m"], vientre: ["n", "m"], viernes: ["x"], vigilancia: ["n", "f"], vigilante: ["n", "m"], vigilar: ["v"], villa: ["n", "f"], villancico: ["n", "m"], vincularse: ["v"], vino: ["n", "m"], violaci\u00F3n: ["n", "f"], violencia: ["n", "f"], violinista: ["n", "f"], violonchelo: ["n", "m"], viol\u00EDn: ["x"], virus: ["n", "m"], visado: ["n", "m"], visillo: ["n", "m"], visitar: ["v"], vista: ["n", "f"], vitaminas: ["x"], vitrina: ["n", "f"], viudo: ["n", "m"], vivienda: ["n", "f"], vivir: ["v"], volante: ["x"], volar: ["v"], volcar: ["v"], volcarse: ["v"], voluntariado: ["n", "m"], volver: ["v"], volverse: ["v"], vomitar: ["v"], votante: ["x"], votar: ["v"], voto: ["n", "m"], vuelo: ["n", "m"], vuelta: ["n", "f"], vulnerabilidad: ["n", "f"], v\u00E9rtebra: ["n", "f"], v\u00EDa: ["n", "f"], v\u00EDctima: ["n", "f"], v\u00EDdeo: ["n", "m"], wifi: ["n", "m"], yema: ["n", "f"], yerno: ["n", "m"], yeso: ["n", "m"], yogur: ["x"], zanahoria: ["n", "f"], zanjar: ["v"], zapatillas: ["x"], zapatos: ["n", "m"], zapear: ["v"], zona: ["n", "f"], zoolog\u00EDa: ["n", "f"], zum: ["n", "m"], zumo: ["n", "m"], \u00E1cidos: ["x"], \u00E1frica: ["x"], \u00E1guila: ["n", "f"], \u00E1lgebra: ["n", "f"], \u00E1ngulo: ["n", "m"], \u00E1rbitro: ["n", "m"], \u00E1rbol: ["n", "m"], \u00E1rea: ["n", "f"], \u00E1rido: ["n", "m"], \u00E1tico: ["n", "m"], \u00E1tomo: ["n", "m"], \u00E9tica: ["n", "f"], \u00EDndice: ["n", "m"], \u00EDntegro: ["n", "m"], \u00EDntimo: ["n", "m"], \u00EDrsele: ["x"], \u00F3pera: ["n", "f"], \u00F3rbita: ["n", "f"], \u00F3vulo: ["n", "m"], \u00F3xidos: ["x"], \u00FAlcera: ["n", "f"], \u00FAltimo: ["x"] };

  // lib/tagger/data/forms.json
  var forms_default = ["a", "aaaanda", "ab", "aba", "abajo", "abandonado", "abandonados", "abandonar", "abandone", "abandono", "abanico", "abaratar", "abarcar", "abarrotada", "abarrotado", "abarrotar", "abarrot\xF3", "abastecedor", "abastecer", "abastecimiento", "abatible", "abatido", "abatir", "abc", "abdera", "abderrahm\xE1n", "abdomen", "abdominal", "abdominales", "abecedario", "aber", "aberri", "abertura", "abierta", "abiertamente", "abiertas", "abierto", "abiertos", "abismal", "ablandar", "abochornado", "abogado", "abogados", "abolengo", "abolir", "abolladura", "abominable", "abominar", "abonado", "abonar", "abonarse", "abono", "abonos", "abordado", "abordaron", "aborrecer", "aborrecible", "aborrezco", "aborto", "abra", "abrasador", "abraza", "abrazar", "abrazarse", "abrazo", "abrazos", "abre", "abrebotellas", "abrecartas", "abrelatas", "abren", "abres", "abrevadero", "abreviaci\xF3n", "abreviadas", "abreviado", "abreviatura", "abreviaturas", "abrigo", "abril", "abrillantar", "abrir", "abrirse", "abri\xF3", "abro", "abroch\xF3", "abrumador", "abrupta", "abrupto", "abr\xED", "abs", "absentismo", "absoluci\xF3n", "absoluta", "absolutamente", "absolutas", "absolutismo", "absoluto", "absolutoria", "absolutos", "absolver", "absorbente", "absorber", "absorci\xF3n", "abstemio", "abstenci\xF3n", "abstenerse", "abstengo", "abstracci\xF3n", "abstracta", "abstracto", "abstractos", "abstra\xEDdo", "abstuvieron", "absurdista", "absurdo", "abuchear", "abuela", "abuelete", "abuelo", "abuelos", "abuhardillada", "abulta", "abultado", "abultar", "abundancia", "abundante", "abundantemente", "abundar", "aburre", "aburrida", "aburridas", "aburrido", "aburridos", "aburrid\xEDsima", "aburrid\xEDsimo", "aburriendo", "aburrimiento", "aburrir", "aburrirse", "aburro", "aburr\xED", "aburr\xEDa", "abusar", "abusen", "abusivo", "abuso", "abusos", "ac", "acaba", "acabable", "acabada", "acabado", "acabados", "acabamos", "acaban", "acabar", "acabarse", "acabar\xE9", "acabar\xEDamos", "acabas", "acabo", "acab\xF3", "academia", "academias", "acad\xE9mica", "acad\xE9micas", "acad\xE9mico", "acad\xE9micos", "acaecer", "acallar", "acalorada", "acalorado", "acaloramiento", "acampada", "acampanado", "acampar", "acantilado", "acapulco", "acariciar", "acarici\xE9is", "acaso", "acatamiento", "acatar", "acceder", "accedo", "accesibilidad", "accesible", "acceso", "accesorios", "accidentada", "accidentado", "accidentados", "accidente", "accidentes", "accionar", "acciones", "accionista", "accionistas", "acci\xF3n", "aceite", "aceites", "aceitoso", "aceleraci\xF3n", "acelerado", "acelerador", "acelerar", "aceler\xF3n", "acelgas", "acento", "acentos", "acentuaci\xF3n", "acentuada", "acentuadas", "acentuado", "acentuados", "acentual", "acentuales", "acentualmente", "acentuar", "acent\xFAa", "acepta", "aceptable", "aceptaci\xF3n", "aceptado", "aceptados", "aceptamos", "aceptar", "aceptaron", "aceptas", "aceptases", "acepte", "acepto", "acept\xE9", "acept\xF3", "acequia", "acer", "acera", "acerca", "acercaba", "acercamiento", "acercamientos", "acercan", "acercar", "acercarse", "acerc\xE1ndose", "acerc\xE1ramos", "acerc\xF3", "acero", "acerques", "acertada", "acertar", "acervo", "achacoso", "achaque", "achicar", "achicharrarse", "acicalar", "acicalarse", "acidez", "acierto", "aclamado", "aclamar", "aclara", "aclaraciones", "aclaraci\xF3n", "aclarar", "aclaratorios", "acogedor", "acogedora", "acoger", "acogida", "acolchado", "acomodaba", "acomodaci\xF3n", "acomodada", "acomodador", "acomodar", "acomodarse", "acomodo", "acompasada", "acompasadas", "acompasado", "acompa\xF1a", "acompa\xF1aba", "acompa\xF1ada", "acompa\xF1adas", "acompa\xF1ado", "acompa\xF1ados", "acompa\xF1amientos", "acompa\xF1an", "acompa\xF1ar", "acompa\xF1en", "acompa\xF1o", "acomplejado", "acomp\xE1\xF1eme", "aconcagua", "acondicionado", "acondicionar", "aconfesional", "aconseja", "aconsejaba", "aconsejable", "aconsejar", "aconsejarte", "aconsejar\xEDa", "aconsejo", "acontecer", "acontecimiento", "acontecimientos", "aconteci\xF3", "acord", "acordaba", "acordado", "acordar", "acordaras", "acordarse", "acorde", "acorde\xF3n", "acordonar", "acord\xE9", "acortar", "acosar", "acoso", "acostado", "acostarme", "acostarse", "acostarte", "acostumbra", "acostumbrado", "acostumbrados", "acostumbr\xE1ndome", "acost\xF3", "acotaciones", "acotaci\xF3n", "acotador", "acotadores", "acre", "acreditaciones", "acreditado", "acreditar", "acreedor", "acritud", "acrob\xE1tico", "acr\xEDlica", "acr\xF3nimos", "actas", "actitud", "actitudes", "activa", "activaci\xF3n", "activamente", "activar", "activas", "active", "actividad", "actividades", "activos", "acto", "actor", "actores", "actos", "actrices", "actriz", "actuaciones", "actuaci\xF3n", "actuado", "actual", "actuales", "actualidad", "actualiza", "actualizaci\xF3n", "actualizar", "actualmente", "actuar", "actuaron", "actu\xF3", "act\xFAa", "act\xFAe", "act\xFAen", "acuarela", "acuarelista", "acude", "acuden", "acudieron", "acudir", "acudi\xF3", "acueducto", "acuerdas", "acuerdo", "acuerdos", "acuesto", "acumuladores", "acumularse", "acumulativa", "acuoso", "acuosos", "acupuntor", "acupuntura", "acusado", "acusados", "acusar", "acuse", "acu\xE1tica", "acu\xE1tico", "acu\xE9state", "ac\xE1", "ac\xFAstica", "ac\xFAsticamente", "ac\xFAsticas", "ad", "adaptaciones", "adaptaci\xF3n", "adaptadas", "adaptados", "adaptando", "adaptar", "adaptarte", "adecentar", "adecuaci\xF3n", "adecuada", "adecuadas", "adecuado", "adecuados", "adecuarla", "adecuarse", "adecuen", "adecuo", "adec\xFAo", "adefesio", "adelantada", "adelantado", "adelantamiento", "adelantar", "adelantara", "adelante", "adelanto", "adelant\xE1ndose", "adelant\xF3", "adelgazado", "adelgazar", "adem\xE1s", "adena", "adentrar", "adentrarse", "adentro", "adepto", "aderezar", "adherencia", "adherente", "adherido", "adherir", "adhesivo", "adhesi\xF3n", "adhiero", "adicci\xF3n", "adicional", "adici\xF3n", "adiestrado", "adinerada", "adiposo", "aditivos", "adivinaba", "adivinanzas", "adivinar", "adi\xF3s", "adj", "adjetival", "adjetivales", "adjetivas", "adjetivo", "adjetivos", "adjudicar", "adjuntamos", "adjuntan", "adjuntar", "adjunto", "adjuntos", "administraciones", "administraci\xF3n", "administrador", "administrar", "administrativa", "administrativas", "administrativo", "administrativos", "admira", "admiraba", "admirable", "admirablemente", "admiraci\xF3n", "admirada", "admirado", "admirador", "admirados", "admirar", "admiro", "admisible", "admisi\xF3n", "admite", "admiten", "admitir", "admitirlo", "admito", "admones", "adn", "ado", "adobar", "adobe", "adolescencia", "adolescente", "adolescentes", "adolfo", "adonde", "adonis", "adopci\xF3n", "adoptadas", "adoptado", "adoptan", "adoptando", "adoptar", "adoptarse", "adoptiva", "adoptivo", "adoquinado", "adoquines", "adoraba", "adorar", "adornaban", "adorno", "adornos", "adoro", "adosado", "adosados", "adquiere", "adquieren", "adquirido", "adquiridos", "adquirir", "adquir\xEDa", "adquisici\xF3n", "adquisitivo", "adscriptiva", "adscriptivas", "adscrito", "adsl", "aduana", "aduanero", "aducir", "adujere", "adulta", "adulterar", "adulto", "adultos", "adv", "adverbial", "adverbiales", "adverbializaci\xF3n", "adverbio", "adverbios", "adversa", "adversario", "adversativa", "adversativas", "adversativo", "adversativos", "adversidades", "adverso", "advertencia", "advertencias", "advertido", "advertimos", "advertir", "advert\xED", "advierte", "advierten", "advierto", "advocaciones", "adyacente", "adyacentes", "ad\xF3nde", "aecid", "aei", "aerol\xEDneas", "aeronave", "aeroplano", "aeropuerto", "aeropuertos", "aerosoles", "aerov\xEDas", "aes", "afable", "afamado", "afecci\xF3n", "afecta", "afectadas", "afectado", "afectados", "afectan", "afectar", "afectar\xEDa", "afectiva", "afectivamente", "afectivas", "afectivo", "afectivos", "afecto", "afectuosamente", "afectuosos", "afect\xF3", "afeitar", "afeitarse", "afeit\xE1ndose", "aferrar", "aferrarse", "afianzar", "aficionado", "aficionados", "aficiones", "afici\xF3n", "afiliarse", "afinado", "afinar", "afines", "afinidad", "afinidades", "afirma", "afirmaba", "afirmaciones", "afirmaci\xF3n", "afirmado", "afirman", "afirmando", "afirmar", "afirmarlo", "afirmativa", "afirmativas", "afirmativo", "afirmativos", "afirmo", "aflojar", "aflorar", "afluencia", "afluente", "aforo", "afortunada", "afortunadamente", "africaci\xF3n", "africada", "africado", "africanas", "africano", "afrontar", "afrutado", "afuera", "afueras", "af\xE1n", "af\xEDn", "ag", "agachado", "agacharse", "agarrado", "agarrar", "agarr\xE9", "agasajar", "agencia", "agencias", "agenda", "agendas", "agente", "agentivo", "agentivos", "agilizar", "agitaci\xF3n", "agitado", "agitar", "agli", "aglutinar", "agn\xF3stico", "agobia", "agobiada", "agobiado", "agobiante", "agobiarse", "agobio", "agobi\xF3", "agoniza", "agonizar", "agosto", "agota", "agotable", "agotada", "agotado", "agotan", "agotando", "agotar", "agotarse", "agrada", "agradable", "agradablemente", "agradables", "agradar", "agradecer", "agradecerles", "agradecerlo", "agradecer\xE9", "agradecer\xEDa", "agradecida", "agradecido", "agradeciendo", "agradecimiento", "agradecimientos", "agradeci\xE9ndoles", "agradec\xE9rtelo", "agradezco", "agrado", "agrad\xF3", "agrandar", "agravarse", "agregar", "agresivas", "agresividad", "agresivo", "agresi\xF3n", "agresor", "agreste", "agriar", "agricultor", "agricultura", "agridulce", "agrietan", "agrio", "agropecuaria", "agrupaciones", "agrupaci\xF3n", "agrupadas", "agrupamiento", "agrupan", "agrupar", "agruparse", "agr\xEDcola", "agr\xEDcolas", "agua", "aguacate", "aguacero", "aguafiestas", "aguanieve", "aguantando", "aguantar", "aguantarse", "aguante", "aguanto", "aguar", "aguarr\xE1s", "aguas", "aguda", "agudas", "agudeza", "agudizarse", "agudo", "agudos", "aguile\xF1a", "aguinaldo", "aguja", "agujas", "agujero", "agujeros", "aguzar", "ah", "ahogado", "ahogando", "ahogar", "ahog\xF3", "ahora", "ahorrado", "ahorrar", "ahorro", "ahorros", "ahoy", "ahuecar", "ahumado", "ahumar", "ah\xED", "aimara", "airbag", "aire", "aireados", "aires", "airoso", "aislada", "aisladas", "aislado", "aislados", "aislamiento", "aislar", "aislarse", "aisl\xF3", "ajada", "ajado", "ajardinada", "aje", "ajedrez", "ajena", "ajenas", "ajeno", "ajenos", "ajetreado", "ajo", "ajos", "ajusta", "ajustadamente", "ajustado", "ajustan", "ajustar", "ajustarse", "ajuste", "ajustes", "aj\xE1", "al", "ala", "alabanza", "alabanzas", "alabar", "alabarlo", "alameda", "alargado", "alargados", "alargamiento", "alargamientos", "alargar", "alarido", "alarma", "alarmamos", "alarmante", "alarmantes", "alas", "alba", "albacete", "albahaca", "albar\xE1n", "alba\xF1iler\xEDa", "albergan", "albergar", "albergo", "albergue", "albergues", "alberto", "albogues", "albornoz", "alboroto", "alb\xE9niz", "alcalde", "alcald\xEDa", "alcal\xE1", "alcance", "alcantarilla", "alcantarillado", "alcanza", "alcanzable", "alcanzado", "alcanzados", "alcanzan", "alcanzar", "alcanzaras", "alcanzarme", "alcanzas", "alcanzo", "alcohol", "alcoholemia", "alcoholismo", "alcoh\xF3lica", "alcoh\xF3lico", "alcolismo", "alcool", "alcoolismo", "alcurnia", "alc\xE1nzame", "aldea", "aleaci\xF3n", "aleatoria", "aleda\xF1o", "aleda\xF1os", "alegar", "alegra", "alegrarse", "alegras", "alegre", "alegremente", "alegres", "alegro", "alegr\xEDa", "alegr\xF3", "aleixandre", "aleja", "alejada", "alejadas", "alejado", "alejados", "alejamiento", "alejan", "alejar", "alejaras", "alejarse", "alejo", "alej\xF3", "alelado", "alemana", "alemanamente", "alemanas", "alemanes", "alem\xE1n", "alentadores", "alergia", "alergias", "alerta", "alfabetizables", "alfabeto", "alfab\xE9tico", "alfalfa", "alfarer\xEDa", "alfiler", "alfombra", "alfonso", "alf\xE9izar", "alga", "algeciras", "algia", "algo", "algod\xF3n", "algoritmo", "alguien", "alguna", "algunas", "alguno", "algunos", "alg\xFAn", "alhambra", "aliado", "alianza", "alias", "alicante", "alicatar", "alicates", "alice", "alicia", "alic\xF3tero", "alijo", "alima\xF1a", "alimentaci\xF3n", "alimentador", "alimentadores", "alimentar", "alimenticio", "alimenticios", "alimento", "alimentos", "alineaci\xF3n", "alinear", "alisar", "alisarse", "alisio", "alistarse", "aliviado", "aliviar", "alivio", "ali\xF1ar", "alkol", "allanar", "allegado", "allegados", "allo", "all\xE1", "all\xED", "alma", "almacenado", "almacenados", "almacenamiento", "almacenando", "almacenar", "almacenes", "almac\xE9n", "almagro", "almanzor", "almeja", "almendra", "almendras", "almer\xEDa", "almod\xF3var", "almohada", "almohadilla", "almudena", "almuerzo", "almuerzos", "alojamiento", "alojamientos", "alojar", "alojarse", "alonso", "alpinismo", "alquilado", "alquilar", "alquilaron", "alquiler", "alrededor", "alrededores", "alsa", "alta", "altamente", "altar", "altaria", "altas", "altavoz", "altera", "alterable", "alterables", "alteraciones", "alteraci\xF3n", "alterado", "alterar", "altercado", "alterna", "alternador", "alternan", "alternancia", "alternancias", "alternar", "alternativa", "alternativamente", "alternativas", "alternativo", "altibajos", "altiplanicie", "altiplano", "altiplanos", "altitud", "alto", "altos", "altruismo", "altruista", "altura", "alturas", "alt\xEDsimo", "alubias", "alucina", "alucinaciones", "alucinaci\xF3n", "alucinado", "alucinan", "alucinante", "alucinar", "alucino", "alud", "alude", "aluden", "aludir", "alumbrado", "alumbrar", "aluminio", "alumnado", "alumno", "alumnos", "alunizar", "alusiones", "alusi\xF3n", "aluvi\xF3n", "alveolar", "alveolares", "alveolos", "alveopalatal", "alza", "alzar", "alzarse", "al\xE1", "al\xE9rgica", "al\xE9rgicas", "al\xE9rgico", "al\xF3fonos", "am", "ama", "amabilidad", "amabil\xEDsimo", "amable", "amad\xEDs", "amainar", "amalgamadas", "amalgamados", "amanecer", "amanecerse", "amante", "amar", "amarga", "amargo", "amargor", "amari", "amaril", "amarilla", "amarillas", "amarillenta", "amarillento", "amarillentos", "amarillo", "amar\xE9", "amateur", "amazonas", "amazonia", "ambicioso", "ambici\xF3n", "ambientales", "ambiente", "ambientes", "ambigua", "ambiguo", "ambiguos", "ambig\xFCedad", "ambig\xFCedades", "ambos", "ambulancia", "ambulante", "ambulatorio", "ambulatorios", "ameba", "amenaza", "amenazador", "amenazar", "amenazas", "amenizar", "ameno", "amenza", "american", "americana", "americanas", "americano", "amiga", "amigo", "amigos", "amigote", "amiguismo", "amistad", "amistades", "amistosa", "amistoso", "amm\xE1n", "amnesia", "amnist\xEDa", "amo", "amoldar", "amoldarse", "amold\xF3", "amonestar", "amoniaco", "amontonar", "amor", "amorfo", "amorosa", "amortiguar", "amortizable", "amortizaci\xF3n", "amortizar", "amparar", "amparo", "amplia", "ampliaci\xF3n", "ampliado", "ampliar", "amplias", "amplificar", "amplio", "amplios", "ampolla", "amueblado", "amueblar", "amuermar", "am\xE9monos", "am\xE9mosnos", "am\xE9rica", "am\xE9ricas", "am\xF3n", "an", "ana", "anacardo", "anaconda", "anaf\xF3rica", "anaf\xF3ricamente", "anaf\xF3rico", "anagrama", "analg\xE9sico", "analicemos", "analiza", "analizadas", "analizados", "analizamos", "analizar", "analizaremos", "analizarla", "analizarlos", "analog\xEDa", "anal\xEDtico", "anal\xEDticos", "anal\xF3gica", "anal\xF3gico", "anarqu\xEDa", "ancestral", "ancestrales", "ancestros", "ancha", "anchas", "ancho", "anchos", "anchura", "anciano", "ancianos", "anclado", "anclaje", "anclar", "anclarse", "anclas", "and", "anda", "andaluc\xEDa", "andalus\xED", "andaluza", "andamio", "andamos", "andan", "andandito", "andando", "andante", "andar", "andarse", "andas", "ande", "andenes", "andes", "andina", "andinas", "andino", "ando", "andrada", "andrade", "andrea", "andr\xE9s", "and\xE9n", "anecd\xF3tica", "anecd\xF3tico", "anegada", "anegado", "anegar", "anejo", "anejos", "anemia", "anestesiar", "anestesista", "anfibio", "anfitri\xF3n", "angel", "anglicana", "anglohablantes", "angora", "angular", "anguloso", "angustia", "angustiaba", "angustiada", "angustiado", "angustiarse", "angustio", "angustiosa", "angustiosamente", "anh\xEDdrido", "anillas", "anillo", "animaci\xF3n", "animada", "animado", "animadores", "animados", "animal", "animales", "animar", "animaran", "animarles", "animarse", "animas", "anim\xF3", "aniquilar", "aniversario", "anoche", "anochecer", "anomal\xEDa", "anorak", "anorexia", "anormal", "anormalidad", "anotaciones", "anotaci\xF3n", "anotar", "ansia", "ansiedad", "ansiedades", "antagonista", "anta\xF1o", "ante", "anteanoche", "anteayer", "antecedente", "antecedentes", "antecesor", "antediluviano", "antefirma", "antelaci\xF3n", "antemano", "antena", "antepasado", "antepasados", "antepen\xFAltima", "antepen\xFAltimo", "anteponer", "anteposiciones", "anteposici\xF3n", "antepuesta", "antepuestas", "antepuesto", "antepuestos", "anterior", "anteriores", "anterioridad", "anteriormente", "antes", "antesala", "anti", "antibi\xF3tico", "anticadencia", "anticaspa", "anticelul\xEDtica", "anticicl\xF3n", "anticipaba", "anticipaci\xF3n", "anticipada", "anticipadamente", "anticipadas", "anticipado", "anticipar", "anticipativas", "anticipo", "anticip\xF3", "anticonceptivas", "anticuado", "antiest\xE9tico", "antigua", "antigualla", "antiguamente", "antiguas", "antiguo", "antiguos", "antig\xFCedad", "antig\xFCedades", "antihi\xE1tica", "antiinflamatorio", "antillas", "antiniebla", "antioquia", "antioxidante", "antipersona", "antipiojos", "antipir\xE9tico", "antipoes\xEDa", "antip\xE1tico", "antip\xE1ticos", "antiqu\xEDsimo", "antirrobo", "antiterrorista", "antitet\xE1nica", "antivirus", "antol\xF3gica", "antonimia", "antonio", "antonomasia", "antrop\xF3nimos", "ant\xE1rtico", "ant\xE1rtida", "ant\xEDdoto", "ant\xEDdotos", "ant\xF3nimos", "ant\xFAnez", "anual", "anualmente", "anulaci\xF3n", "anular", "anulen", "anuncia", "anunciada", "anunciador", "anunciadores", "anunciante", "anunciar", "anuncio", "anuncios", "anunci\xE1ramos", "anunci\xF3", "anverso", "an\xE1foras", "an\xE1lisis", "an\xE1logas", "an\xE9cdota", "an\xE9cdotas", "an\xEDmate", "an\xEDmica", "an\xF3malo", "an\xF3nima", "apacible", "apacibles", "apaga", "apagada", "apagado", "apagar", "apagarlo", "apagaron", "apagarse", "apaisado", "apalabrar", "aparato", "aparatos", "aparcado", "aparcamiento", "aparcar", "aparearse", "aparece", "aparecen", "aparecer", "apareces", "aparecidas", "aparecido", "aparecidos", "apareciera", "apareci\xF3", "aparejador", "aparejo", "aparenta", "aparentar", "aparente", "aparentemente", "aparezcan", "aparici\xF3n", "apariencia", "apariencias", "aparque", "aparta", "apartado", "apartamento", "apartamentos", "apartan", "apartar", "apartaron", "aparte", "apartes", "apartotel", "apasiona", "apasionado", "apasionamiento", "apasionante", "apasionaron", "apat\xEDa", "apa\xF1as", "apego", "apelaciones", "apelaci\xF3n", "apelar", "apelativa", "apelativas", "apelativo", "apelativos", "apellidarse", "apellido", "apellidos", "apenado", "apenas", "apendicitis", "aperitivo", "apero", "apertura", "apestar", "apestoso", "apetece", "apetecer", "apetecer\xE1", "apetecer\xEDa", "apetecido", "apetezca", "apetito", "apetitoso", "apical", "apicoalveolar", "apicodental", "apilar", "api\xF1ados", "aplacar", "aplastada", "aplastado", "aplastante", "aplastar", "aplauden", "aplaudir", "aplauso", "aplausos", "aplazado", "aplazamiento", "aplazamientos", "aplazar", "aplica", "aplicable", "aplicables", "aplicaci\xF3n", "aplicado", "aplicados", "aplicando", "aplicar", "aplicarse", "apocopadas", "apodo", "apodos", "apogeo", "apolo", "apolonia", "aportaciones", "aportaci\xF3n", "aportada", "aportado", "aportan", "aportar", "aportas", "aposento", "aposiciones", "aposici\xF3n", "aposta", "apostar", "apostilla", "apostillar", "apote\xF3sico", "apoya", "apoyado", "apoyar", "apoyaste", "apoyo", "apoyos", "apoy\xE9", "apoy\xF3", "apreciable", "apreciaci\xF3n", "apreciado", "apreciados", "aprecian", "apreciar", "apreciar\xE1n", "apreciativos", "aprecio", "aprehenden", "aprehendida", "aprehendidas", "aprehendido", "aprehendidos", "apremiante", "aprendamos", "aprende", "aprenden", "aprender", "aprenderlo", "aprendidas", "aprendido", "aprendiente", "aprendientes", "aprendiera", "aprendiz", "aprendizaje", "aprendizajes", "aprendo", "apretado", "apretados", "apretar", "apretarse", "apret\xF3n", "aprobaciones", "aprobaci\xF3n", "aprobada", "aprobado", "aprobar", "aprobar\xE1n", "aprobar\xE1s", "aprob\xF3", "apropiado", "apropio", "aprovecha", "aprovechable", "aprovechamiento", "aprovechar", "aprovecharas", "aprovecharse", "aprovechar\xEDa", "aproveche", "aprovechen", "aprovecho", "aproxima", "aproximaci\xF3n", "aproximada", "aproximadamente", "aproximado", "aproximados", "aproximante", "aproximantes", "aproximar", "aproximarse", "aproximativas", "aproximativo", "aproximativos", "aprueba", "aprueban", "apruebas", "apruebo", "apta", "aptitud", "apto", "apuesta", "apuesto", "apunta", "apuntaba", "apuntado", "apuntan", "apuntar", "apuntarse", "apuntas", "apunte", "apuntes", "apurada", "apurado", "apurar", "apurarse", "apuro", "ap\xE9ndice", "ap\xE9ndices", "ap\xF3cope", "ap\xF3dosis", "ap\xF3stol", "ap\xFArate", "aquel", "aquella", "aquellas", "aquello", "aquellos", "aqu\xED", "ar", "arabia", "arado", "aral", "arancel", "arancelaria", "arar", "araucano", "ara\xF1a", "ara\xF1ar", "ara\xF1as", "ara\xF1azo", "arbitrario", "arbusto", "arcadas", "arcaica", "arcaico", "arca\xEDsmo", "arceibo", "archi", "archiconocido", "archivador", "archivar", "archivo", "archivos", "arcilla", "arco", "arcor", "arco\xEDris", "arc\xE9n", "arde", "arder", "ardor", "arduamente", "arduo", "arena", "arenoso", "arequipa", "arganda", "argar", "argentina", "argentinas", "argentino", "argumentaci\xF3n", "argumental", "argumentales", "argumentativa", "argumentativo", "argumento", "argumentos", "arg\xFCir", "aria", "arias", "aridez", "aries", "arista", "aristocracia", "arist\xF3crata", "arma", "armada", "armadas", "armador", "armando", "armar", "armario", "armarios", "armas", "armisticio", "armoniosamente", "armonioso", "armon\xEDa", "arn\xE9s", "aro", "aroma", "aromaterapia", "arom\xE1tica", "arom\xE1tico", "arqueado", "arquear", "arqueol\xF3gicas", "arqueol\xF3gicos", "arquetipo", "arquitecto", "arquitectos", "arquitectura", "arquitect\xF3nica", "arquitect\xF3nicas", "arquitect\xF3nico", "arquitect\xF3nicos", "arrabal", "arraigados", "arrancado", "arrancar", "arranc\xF3", "arranque", "arrasar", "arrastrar", "arrastre", "arrastro", "arrebatadora", "arreciar", "arreglada", "arreglado", "arreglar", "arreglaron", "arreglar\xE1", "arreglar\xEDa", "arreglas", "arreglen", "arreglo", "arregl\xE1rselas", "arrendador", "arrendatario", "arrepentimiento", "arrepentir", "arrepentirse", "arrepentir\xE1s", "arrepiente", "arrepiento", "arresto", "arriba", "arriesga", "arriesgada", "arriesgar", "arriesgarse", "arriesgas", "arrimar", "arrimarse", "arrinconar", "arroba", "arrocer\xEDa", "arrogancia", "arrogante", "arrojar", "arrollador", "arrolladora", "arrolladoramente", "arroyo", "arroz", "arruga", "arrugada", "arrugado", "arrugar", "arrugas", "arruinado", "arruinarse", "ars", "art", "arte", "artefacto", "arteria", "artes", "artesanales", "artesan\xEDa", "articulaciones", "articulaci\xF3n", "articulada", "articular", "articulatoria", "articulatorias", "articulatorio", "articulatorios", "articulen", "articulista", "artificial", "artificiales", "artificiosa", "artiller\xEDa", "artista", "artistas", "arturo", "art\xEDculo", "art\xEDculos", "art\xEDstica", "art\xEDsticas", "art\xEDstico", "art\xEDsticos", "arzobispo", "ar\xE1bica", "as", "asada", "asadas", "asado", "asador", "asalariado", "asaltar", "asalto", "asamblea", "asar", "asarse", "asas", "ascendente", "ascendentes", "ascender", "ascendido", "ascendiente", "ascenso", "ascensor", "ascensorista", "ascensos", "asciende", "asco", "asear", "asediar", "asedio", "asegura", "asegurado", "asegurar", "asegurarse", "aseguras", "aseguro", "aseg\xFArense", "asemeja", "asentado", "asentados", "asentamiento", "asentamientos", "asentimiento", "aseo", "aseos", "asepsia", "asequible", "aserci\xF3n", "asertiva", "asertivas", "asertivo", "asertivos", "asesinar", "asesinato", "asesino", "asesor", "asesoramiento", "asesores", "asesor\xEDa", "asesor\xEDas", "aseveraciones", "aseveraci\xF3n", "aseverar", "aseverativas", "aseverativo", "asfaltado", "asfaltar", "asfixia", "asfixiante", "asia", "asibiladas", "asiduamente", "asiduidad", "asiduo", "asiento", "asientos", "asignaci\xF3n", "asignado", "asignar", "asignatura", "asignaturas", "asilo", "asimilaci\xF3n", "asimilada", "asimilados", "asimilar", "asimismo", "asim\xE9tricos", "asir", "asista", "asistan", "asistencia", "asistenciales", "asistente", "asistentes", "asistida", "asistido", "asistir", "asisti\xF3", "asma", "asm\xE1tica", "asociaciones", "asociaci\xF3n", "asociadas", "asociado", "asociados", "asocian", "asociar", "asociarse", "asociativa", "asociativo", "asocie", "asolar", "asolaron", "asombra", "asombrado", "asombrarse", "asombro", "asombroso", "asombrosos", "asomo", "asonancia", "asonante", "aspecto", "aspectos", "aspectual", "aspectuales", "aspectualizaci\xF3n", "aspereza", "aspiraba", "aspiraciones", "aspiraci\xF3n", "aspirada", "aspiradas", "aspirador", "aspiradoras", "aspirante", "aspirar", "aspirina", "aspirinas", "aspiro", "asquerosa", "asqueroso", "association", "asterisco", "astigmatismo", "astilleros", "astrac\xE1n", "astral", "astro", "astrof\xEDsica", "astrolog\xEDa", "astrona", "astronau", "astronauta", "astronom\xEDa", "astron\xF3mico", "astr\xF3nomo", "asturias", "astuto", "asueto", "asume", "asumido", "asumidos", "asumir", "asumi\xF3", "asunci\xF3n", "asunto", "asuntos", "asusta", "asustada", "asustadas", "asustado", "asustados", "asustarse", "asust\xF3", "as\xED", "as\xEDncrona", "as\xEDndeton", "at", "ata", "atacama", "atacar", "atado", "atajar", "atajo", "ataque", "atar", "atardecer", "atascado", "atasco", "ata\xFAd", "atenas", "atenciones", "atenci\xF3n", "atender", "atenderte", "atendida", "atendiendo", "atendieron", "ateneo", "atenerse", "atenerte", "atenta", "atentado", "atentados", "atentamente", "atentar", "atente", "atento", "atenuaci\xF3n", "atenuada", "atenuador", "atenuados", "atenuante", "atenuar", "aten\xFAa", "ateo", "aterrizado", "aterrizaje", "aterrizar", "aterrorizada", "aterrorizado", "atesorado", "atestado", "atestiguar", "ate\xEDsmo", "atiborrarse", "atiende", "atienden", "atiendo", "atinado", "atisbo", "atleta", "atletismo", "atl\xE1ntico", "atmosf\xE9rica", "atmosf\xE9ricos", "atm\xF3sfera", "atocha", "atontado", "atosigar", "atracar", "atracciones", "atracci\xF3n", "atraco", "atractivo", "atrac\xF3n", "atraer", "atraes", "atrapado", "atraso", "atravesado", "atravesar", "atraviesa", "atraviesan", "atrayente", "atra\xEDdo", "atreve", "atreverse", "atrever\xEDa", "atreves", "atrevido", "atrevo", "atribuciones", "atribuci\xF3n", "atributivas", "atributivo", "atributivos", "atributo", "atributos", "atribuye", "atribuyen", "atronador", "atropelladamente", "atropellado", "atroz", "atr\xE1s", "atr\xE9vete", "ats", "atte", "atuendo", "atuendos", "atufar", "atunero", "at\xEDpicas", "at\xF3mica", "at\xF3micos", "at\xF3nito", "at\xFAn", "au", "audici\xF3n", "audiencia", "audioconferencia", "audiovisual", "audiovisuales", "auditivo", "auditorio", "auge", "augurar", "aula", "aulas", "aullar", "aullido", "aumenta", "aumentado", "aumentar", "aumentarlo", "aumentativos", "aumento", "aun", "aunar", "aunque", "aureola", "auricular", "aurora", "aurresku", "ausencia", "ausencias", "ausentarse", "ausente", "austera", "austeridad", "austero", "austriaca", "austriaco", "austrias", "austr\xEDaco", "auto", "autoadhesivo", "autoasignaci\xF3n", "autoasignados", "autoasignarse", "autobiograf\xEDa", "autobuses", "autob\xFAs", "autoconvencimiento", "autocorrecci\xF3n", "autocorregirse", "autocr\xEDticas", "autoeficacia", "autoelogio", "autoevaluaci\xF3n", "autoimagen", "automatizarlo", "automovilismo", "autom\xE1tica", "autom\xE1tico", "autom\xE1ticos", "autom\xF3vil", "autonom\xEDa", "autonom\xEDas", "auton\xF3mica", "auton\xF3micas", "auton\xF3mico", "auton\xF3micos", "autoobservaci\xF3n", "autopista", "autopistas", "autoprovisi\xF3n", "autor", "autora", "autores", "autoridad", "autoridades", "autorizaci\xF3n", "autorizado", "autorizar", "autorrefuerzo", "autorretratos", "autoservicio", "autov\xEDa", "autov\xEDas", "aut\xE9ntico", "aut\xE9nticos", "aut\xF3ctona", "aut\xF3ctonas", "aut\xF3ctonos", "aut\xF3noma", "aut\xF3nomas", "aut\xF3nomo", "aut\xF3nomos", "auxiliar", "auxiliares", "auxilio", "auxilios", "ava", "aval", "avalan", "avalancha", "avalar", "avalista", "avance", "avances", "avanza", "avanzada", "avanzado", "avanzar", "avaro", "avda", "ave", "avecina", "avecinarse", "avejentado", "avellanas", "avena", "avenencia", "avenida", "avenidas", "avenido", "avenirse", "aventajado", "aventajar", "aventura", "aventuras", "aventurero", "avergonzado", "avergonzados", "avergonzarse", "averg\xFCenza", "averg\xFCenzo", "averiarse", "averigu\xE1is", "aversivo", "aversi\xF3n", "aver\xEDa", "aves", "avestruz", "aviaci\xF3n", "aviador", "avianca", "avidez", "avinagrado", "aviones", "avioneta", "avisado", "avisamos", "avisar", "avisara", "avisarnos", "avises", "aviso", "avisos", "avis\xE9", "avis\xF3", "avi\xF1\xF3n", "avi\xF3n", "avo", "av\xEDsame", "axioma", "ay", "aya", "ayer", "ayuda", "ayudado", "ayudan", "ayudando", "ayudante", "ayudar", "ayudara", "ayudaras", "ayudarla", "ayudarlas", "ayudarle", "ayudarlo", "ayudarme", "ayudarte", "ayudar\xEDa", "ayudas", "ayude", "ayuden", "ayudes", "ayudo", "ayud\xE1ramos", "ayud\xF3", "ayunar", "ayuntamiento", "ayuntamientos", "ay\xFAdame", "ay\xFAdeme", "azada", "azafata", "azafr\xE1n", "azar", "azaroso", "azo", "azor\xEDn", "azotar", "azotea", "azot\xF3", "azteca", "aztecas", "azuay", "azul", "azulejer\xEDa", "azulejo", "azulejos", "azules", "az\xFAcar", "a\xE9reas", "a\xE9reo", "a\xF1ade", "a\xF1aden", "a\xF1adido", "a\xF1adidura", "a\xF1adiendo", "a\xF1adir", "a\xF1adi\xF3", "a\xF1ejo", "a\xF1o", "a\xF1os", "a\xFAn", "b", "ba", "babia", "babor", "bacalao", "bache", "bachiller", "bachillerato", "bacteria", "bacterias", "bah\xEDa", "bah\xEDas", "baila", "bailaba", "bailado", "bailan", "bailando", "bailaor", "bailaores", "bailar", "bailarines", "bailar\xEDn", "bailas", "baile", "bailes", "bailo", "bailotear", "bail\xE9", "bail\xF3", "baja", "bajaba", "bajada", "bajado", "bajando", "bajar", "bajarse", "bajas", "baje", "bajo", "bajos", "bajura", "baj\xE9", "baj\xF3", "baj\xF3n", "bala", "balada", "balance", "balancearse", "balazote", "balbucir", "balc", "balcones", "balc\xF3n", "baldas", "baldosa", "baldosas", "bali", "ballena", "ballenero", "ballet", "balneario", "balnearios", "baloncesto", "balonmano", "bal\xF3n", "bamb\xFA", "bananero", "banca", "bancales", "bancaria", "bancario", "bancarrota", "banco", "bancos", "banda", "bandejas", "bandera", "banderas", "bander\xEDn", "banquero", "banquete", "bant\xFA", "bar", "baraja", "barajando", "barajar", "barajas", "barata", "barato", "barba", "barbaridad", "barbilampi\xF1o", "barbilla", "barca", "barcelona", "barco", "barcos", "baremos", "bares", "barman", "barniz", "barnizado", "barnizar", "barquero", "barra", "barranco", "barrancos", "barras", "barrenderos", "barrer", "barreras", "barrica", "barricada", "barrido", "barriga", "barril", "barrio", "barrios", "barro", "barroca", "barroco", "barrocos", "baruj", "barullo", "basa", "basadas", "basado", "basados", "basan", "basarse", "base", "basta", "bastante", "bastantes", "bastar", "bastardo", "baste", "bastiana", "basti\xE1n", "basto", "bastos", "basura", "basuras", "basurero", "basureros", "bata", "batalla", "batallar", "bater\xEDa", "bater\xEDas", "batidora", "batir", "batuta", "baul", "bautismal", "bautismo", "bautizo", "bautizos", "bayeta", "baza", "bazar", "ba\xF1ado", "ba\xF1ador", "ba\xF1arse", "ba\xF1as", "ba\xF1era", "ba\xF1o", "ba\xF1os", "ba\xFAl", "be", "beato", "beba", "beban", "bebas", "bebe", "bebed", "bebedero", "beber", "beberlo", "beberse", "bebible", "bebida", "bebidas", "bebieron", "bebi\xF3", "bebo", "beb\xE9", "beca", "becario", "becas", "bedel", "beethoven", "bella", "bellas", "belleza", "bell\xEDsima", "bel\xE9n", "benacerraf", "benavente", "bendecir", "bendita", "bendito", "bene", "benedicto", "benefician", "beneficiaremos", "beneficiario", "beneficiarios", "beneficio", "beneficios", "beneficioso", "benepl\xE1cito", "benicasim", "benito", "ber", "berenjena", "berl\xEDn", "berm\xFAdez", "bernardo", "berrinche", "bes", "besa", "besar", "besarse", "beso", "besos", "bestia", "besugo", "bi", "biblia", "biblio", "bibliograf\xEDa", "bibliogr\xE1ficas", "biblioteca", "bibliotecario", "bibliotecas", "bicarbonato", "bicha", "bicho", "bici", "bicicleta", "bicicletas", "bidireccional", "bien", "bienal", "bienales", "bienes", "bienestar", "bienio", "bienvenida", "bienvenido", "bierzo", "bifurcarse", "bigamia", "bigote", "bilabial", "bilabiales", "bilbao", "bilidad", "biling\xFCe", "biling\xFCes", "billar", "billete", "billetes", "bimensual", "bimotor", "bingo", "binomio", "bio", "biodiversidad", "biograf\xEDa", "biograf\xEDas", "biolog\xEDa", "biol\xF3gica", "biol\xF3gico", "biol\xF3gicos", "biomasa", "bionet", "bionetonline", "bioqu\xEDmica", "biosfera", "biotecnolog\xEDa", "bio\xE9tica", "biquini", "bir", "bis", "bisabuelo", "bisexual", "bisiesto", "bisil\xE1bica", "bisnieto", "bistec", "bis\xEDlabas", "bis\xEDlabos", "bit\xE1coras", "biz", "bizco", "bizcocho", "bi\xF3grafo", "bi\xF3logo", "bl", "blanca", "blancas", "blanco", "blancos", "blanda", "blandengue", "blando", "blanquear", "blanqueo", "blanquinegro", "blasfemar", "blasfemia", "ble", "bledo", "blindar", "blogs", "bloque", "bloquear", "bloquearse", "bloqueas", "bloqueo", "bloqueos", "bloques", "blu", "blusa", "blusas", "bm", "bo", "boabdil", "bobos", "boca", "bocacalle", "bocadillo", "bocanada", "bocazas", "boccherini", "boceto", "bochorno", "boda", "bodas", "bodegas", "bofetada", "boga", "bogot\xE1", "boj", "bol", "bola", "bolas", "bolera", "bolero", "boletines", "bolet\xEDn", "boli", "boligrafo", "bolivia", "boller\xEDa", "bollo", "bollos", "bolos", "bolsa", "bolsas", "bolsillo", "bolsillos", "bolso", "bolsos", "bol\xEDgrafo", "bol\xEDgrafos", "bol\xEDvar", "bomarzo", "bomba", "bombardear", "bombero", "bomberos", "bombilla", "bombillo", "bombo", "bomb\xF3n", "bonanza", "bondad", "bonificaci\xF3n", "bonita", "bonito", "bonitos", "bonos", "boom", "boquiabierto", "bor", "borbones", "borbotones", "bordado", "borde", "bordeada", "bordear", "bordo", "borges", "borracho", "borradas", "borrador", "borrar", "borrasca", "borrosa", "borroso", "bosque", "bosquejar", "bosques", "bostezar", "botar", "botas", "botavara", "bote", "botella", "botellas", "botellines", "botes", "botica", "botillo", "botiqu\xEDn", "botones", "bot\xE1nica", "bot\xE1nico", "bot\xE1nicos", "bot\xEDn", "bot\xF3n", "bou", "boutique", "boutiques", "bovino", "boxeo", "boyac\xE1", "bozal", "br", "braga", "bragueta", "brasa", "brasile\xF1a", "brasile\xF1o", "bravo", "brayar", "braza", "brazo", "brazos", "bre", "brebaje", "brecha", "brevas", "breve", "brevedad", "brevemente", "breves", "bricolaje", "brillaba", "brillante", "brillantes", "brillar", "brillo", "brindar", "brindarle", "brindis", "brind\xE1ramos", "brisa", "brit\xE1nica", "brizna", "bro", "broche", "broma", "bromisto", "bronca", "bronce", "bronquitis", "brotando", "brotar", "brote", "brown", "bruma", "brusco", "bruscos", "brusquedad", "bruto", "brutos", "br\xFAjula", "bs", "bucal", "bucales", "buceador", "buda", "budismo", "budista", "bue", "bueeeno", "buen", "buena", "buenas", "bueno", "buenos", "buen\xEDiisimo", "buen\xEDsima", "buen\xEDsimo", "buey", "bueyes", "bufanda", "bufete", "buf\xE9", "buhardilla", "buir", "buitre", "buj\xEDa", "buj\xEDas", "buler\xEDas", "bulla", "bulo", "bulto", "bungal\xF3", "buque", "bur", "burbujas", "burdeos", "burgues\xEDa", "burgu\xE9s", "burla", "burlar", "burlarse", "burlesco", "burl\xF3n", "burocracia", "burrada", "burro", "bus", "busca", "buscaba", "buscado", "buscador", "buscadores", "buscamos", "buscando", "buscar", "buscarlo", "buscarlos", "buscar\xEDa", "buscas", "buscavidas", "busco", "busc\xE1is", "busc\xE1ndolo", "busto", "butaca", "butacas", "buzoneo", "buz\xF3n", "bu\xF1uel", "bye", "b\xE1ltico", "b\xE1rbaro", "b\xE1sica", "b\xE1sicamente", "b\xE1sicas", "b\xE1sico", "b\xE1sicos", "b\xE1so", "b\xE1ul", "b\xE9isbol", "b\xE9lica", "b\xE9lico", "b\xE9licos", "b\xF3veda", "b\xFAho", "b\xFAsqueda", "c", "ca", "caaarmen", "cabal", "cabalgar", "caballero", "caballeros", "caballer\xEDas", "caballete", "caballo", "cabaret", "cabar\xE9", "caba\xF1a", "cabe", "cabecera", "cabeceras", "cabello", "cabelludo", "caben", "caber", "cabeza", "cabezazo", "cabezota", "cabezudos", "cabida", "cabildos", "cabina", "cable", "cabo", "cabos", "cabra", "cab\xEDamos", "cacahuetes", "cacao", "cacharro", "cachondeo", "cachorro", "caco", "cacofon\xEDa", "cada", "cadena", "cadenas", "cadencia", "cadera", "caderas", "caduca", "caducado", "caducar", "caducidad", "caduco", "caduc\xF3", "cad\xE1ver", "cae", "caen", "caer", "caerme", "caerse", "caerte", "caer\xE1", "caes", "cafetales", "cafetera", "cafeter\xEDa", "cafeter\xEDas", "cafeto", "cafe\xEDna", "caft\xE1n", "caf\xE9", "caf\xE9s", "caigo", "caimana", "caim\xE1n", "cairo", "caja", "cajal", "cajas", "cajero", "cajones", "caj\xF3n", "cal", "cala", "calabac\xEDn", "calado", "calambres", "calamidad", "calar", "calcar", "calcetines", "calcinar", "calcio", "calculan", "calcular", "caldeado", "caldear", "caldera", "caldo", "calefacci\xF3n", "calendario", "calentamiento", "calentar", "calentarse", "calibrar", "calibre", "calidad", "calientan", "calientas", "caliente", "calificaciones", "calificaci\xF3n", "calificar", "calificativa", "calificativo", "calificativos", "callado", "callamos", "callandito", "callao", "callar", "callara", "callaras", "callaron", "callarse", "callarte", "callas", "calle", "callejero", "callejeros", "callejo", "callej\xF3n", "calles", "callo", "call\xE1ndote", "call\xF3", "calma", "calmante", "calor", "calor\xEDas", "calumnia", "calurosamente", "caluroso", "calvicie", "calvo", "calzada", "calzado", "calzador", "calzar", "calzas", "calzoncillo", "cam", "cama", "camada", "camale\xF3nico", "camarada", "camarader\xEDa", "camarero", "camareros", "camarote", "camas", "cambia", "cambiaba", "cambiado", "cambiamos", "cambian", "cambiando", "cambiante", "cambiar", "cambiaremos", "cambiarlas", "cambiarme", "cambiarse", "cambiar\xEDa", "cambias", "cambiemos", "cambio", "cambios", "cambi\xE9", "cambi\xF3", "cambridge", "cameladores", "camer\xFAn", "camilla", "camillero", "camilo", "caminaba", "caminar", "caminata", "camino", "caminos", "camioneta", "camisa", "camisas", "camiseta", "camis\xF3n", "cami\xF3n", "campal", "campamento", "campamentos", "campana", "campanadas", "campa\xF1a", "campa\xF1as", "campeonato", "campeones", "campesino", "campestre", "campestres", "campe\xF3n", "campin", "camping", "campo", "campos", "campus", "camuflar", "can", "cana", "canal", "canales", "canalla", "canaria", "canarias", "canas", "canasta", "canberra", "cancelaci\xF3n", "canceladoras", "cancelar", "cancha", "canciones", "canci\xF3n", "candelero", "candente", "candidato", "candidatos", "candidatura", "canela", "canephora", "cangrejo", "canguro", "canicas", "canina", "canje", "canjear", "canoa", "canon", "canoso", "cansa", "cansaba", "cansada", "cansado", "cansados", "cansan", "cansancio", "cansarse", "canso", "cans\xE9", "canta", "cantabria", "cantado", "cantamos", "cantan", "cantando", "cantante", "cantantes", "cantar", "cantaron", "cantasteis", "cantautores", "cantidad", "cantidades", "cantigas", "cantimplora", "cantina", "cantinela", "canto", "canturrear", "cant\xE9", "cant\xF3", "can\xF3nico", "caos", "cap", "capa", "capaces", "capacidad", "capacidades", "capacitado", "capacitar", "capacit\xF3", "capataz", "capaz", "capela", "capilar", "capilla", "capital", "capitales", "capitalidad", "capitalizar", "capitel", "capit\xE1n", "capote", "caprichoso", "caprichosos", "capricornio", "captaci\xF3n", "captar", "captura", "capturar", "capuchones", "cap\xEDt", "cap\xEDtulo", "cap\xEDtulos", "car", "cara", "carabancheles", "carabela", "caracas", "caracol", "caracteres", "caracterizaci\xF3n", "caracterizarse", "caracter\xEDstica", "caracter\xEDsticas", "caracter\xEDstico", "caracter\xEDsticos", "caradura", "caramelo", "caramelos", "caras", "caravana", "caravanas", "carb\xF3n", "carb\xF3nico", "cardenal", "cardiaco", "cardinal", "cardinales", "cardiovasculares", "card\xEDaco", "carecen", "carecer", "carencia", "carencias", "carente", "careo", "carga", "cargado", "cargamento", "cargante", "cargar", "cargarse", "cargo", "cargos", "carguero", "caribe", "caribes", "caribe\xF1a", "caricaturista", "caricias", "caridad", "carisma", "cariz", "cari\xF1o", "cari\xF1osamente", "cari\xF1oso", "carla", "carlinhos", "carlistas", "carlos", "carlota", "carmen", "carmes\xED", "carmes\xEDes", "carnaval", "carne", "carnes", "carnet", "carnicero", "carnicer\xEDa", "carnosos", "carn\xE9", "carn\xE9s", "carn\xEDvora", "carn\xEDvoro", "caro", "carolina", "carpeta", "carpetas", "carpetazo", "carpinter\xEDa", "carrera", "carreras", "carrete", "carreter", "carretera", "carreteras", "carretilla", "carril", "carrito", "carro", "carrocer\xEDa", "carrozas", "carta", "cartagena", "cartagineses", "cartas", "cartearse", "cartel", "cartelera", "carteleras", "carteles", "cartera", "carteras", "carterista", "cartero", "cartilla", "cartograf\xEDa", "cartucho", "cartulina", "cart\xEDlago", "cart\xF3n", "car\xE1cter", "casa", "casaba", "casablanca", "casadepaco", "casado", "casados", "casamos", "casar", "casarme", "casarse", "casar\xEDa", "casas", "cascada", "cascadas", "casco", "case", "casera", "casero", "caseros", "caser\xEDo", "caser\xF3n", "casete", "casi", "casilla", "casillas", "caso", "casona", "casos", "caspa", "casta", "casta\xF1uelas", "castell", "castellana", "castellano", "castidad", "castigado", "castilla", "castillo", "castillos", "castiza", "casual", "casualidad", "casualmente", "cas\xF3", "cata", "cataf\xF3rica", "cataf\xF3rico", "catalana", "catalans", "catalunya", "catalu\xF1a", "catal\xE1n", "catar", "catarata", "cataratas", "catarro", "catarsis", "catastro", "catastr\xF3fica", "catastr\xF3fico", "catear", "catedral", "catedr\xE1tico", "categor\xEDa", "categor\xEDas", "categ\xF3rica", "catolicismo", "catorce", "cat\xE1logo", "cat\xE1logos", "cat\xE1rtico", "cat\xE1strofe", "cat\xE1strofes", "cat\xF3lica", "cat\xF3lico", "cat\xF3licos", "cauca", "cauce", "caucho", "caudal", "caudaloso", "causa", "causadas", "causal", "causales", "causalidad", "causante", "causar", "causarles", "causas", "causativo", "causativos", "caus\xF3", "cautela", "cautiva", "cautivando", "cautivar", "cava", "cavernas", "cavidad", "cavilaci\xF3n", "cavilar", "cay\xF3", "caza", "cazador", "cazadora", "cazo", "cazos", "cazuela", "ca\xED", "ca\xEDa", "ca\xEDda", "ca\xEDdo", "ca\xEDdos", "ca\xF1a", "ca\xF1ar", "ca\xF1as", "ca\xF1\xF3n", "ca\xF3tico", "cc", "ccd", "ccdc", "ccidente", "ccv", "ccvc", "ccvcc", "ccxx", "cd", "cdc", "ce", "cebada", "cebarse", "cebolla", "cebollas", "cebra", "ceceo", "cecilia", "ceda", "ceder", "cederme", "cedido", "cee", "cefalea", "cegar", "cegato", "ceguera", "ceibo", "ceja", "cejar", "cejas", "cejijunto", "cela", "celador", "celebraban", "celebraciones", "celebraci\xF3n", "celebramos", "celebran", "celebrar", "celebrarlo", "celebrar\xE1", "celebremos", "celebro", "celebr\xE1ramos", "celeb\xE9rrimo", "celeridad", "celeste", "celestina", "celia", "celo", "celos", "celoso", "celsius", "celular", "cemento", "cena", "cenado", "cenamos", "cenando", "cenar", "cenas", "cenicienta", "ceno", "censado", "censo", "censura", "centenario", "centilitro", "centollo", "centradas", "centrado", "centrados", "central", "centrales", "centralismo", "centralita", "centralizado", "centralizar", "centralizarse", "centrar", "centrarse", "centrifugado", "centrifugar", "centro", "centroamericano", "centroam\xE9rica", "centrocampista", "centros", "centr\xEDfuga", "centr\xEDfugo", "centr\xEDpeta", "centr\xEDpeto", "cent\xEDgrado", "cent\xEDmetro", "cent\xEDmetros", "cepillarse", "cepillo", "cera", "cerca", "cercana", "cercano", "cercanos", "cercan\xEDa", "cercan\xEDas", "cerciorarse", "cerdo", "cereales", "cerebro", "ceremonia", "ceremonias", "ceremoniosa", "cereza", "cerezo", "cero", "cerrada", "cerradas", "cerrado", "cerrados", "cerradura", "cerramos", "cerrar", "cerrarla", "cerraz\xF3n", "cerremos", "cerro", "cerros", "cerr\xE1rsele", "cerr\xF3", "certamen", "certero", "certeza", "certidumbre", "certifica", "certificaciones", "certificada", "certificado", "certificar", "cert\xE1menes", "cervantes", "cervecer\xEDa", "cervecer\xEDas", "cerveza", "cervical", "cer\xE1mica", "cer\xE1micas", "ces", "cesar", "cese", "cesi\xF3n", "cesta", "ces\xE1rea", "ces\xF3", "cetrina", "cet\xE1ceo", "ce\xF1ida", "ce\xF1ido", "ce\xF1irse", "ce\xF1o", "ch", "chabola", "chad", "chala", "chaleco", "chalet", "chalets", "chal\xE9", "chamanes", "champ\xE1n", "champ\xFA", "champ\xFAs", "chamuscar", "chanchullo", "change", "chang\xF3", "chant\xE9", "chao", "chapa", "chaparr\xF3n", "chapista", "chapotear", "chapucero", "chapurrea", "chapurrear", "chapuza", "chapuz\xF3n", "chaqueta", "charco", "charcuter\xEDa", "charla", "charlaba", "charlar", "charlas", "charlat\xE1n", "charlottenborg", "chasco", "chasis", "chasquido", "chasquidos", "chat", "chata", "chatear", "chats", "chava", "chaval", "chayo", "che", "checo", "chef", "chelo", "cheque", "chequeo", "cheques", "chiapas", "chibchas", "chica", "chicanas", "chicas", "chicha", "chichicastenango", "chich\xF3n", "chicles", "chico", "chicos", "chile", "chilena", "chileno", "chilenos", "chillar", "chillido", "chillona", "chill\xF3n", "chilo\xE9", "chimenea", "china", "chinch\xEDn", "chino", "chiringuito", "chirlas", "chirona", "chirriar", "chirrido", "chisme", "chismorreo", "chispear", "chiste", "chistes", "choca", "chocamos", "chocante", "chocar", "chocolate", "choc\xF3", "chollo", "choque", "chorizo", "chorrear", "chorro", "chorros", "choza", "christi", "chubasco", "chubut", "chucher\xEDas", "chuleta", "chulo", "chupa", "chupado", "chupar", "chuparse", "chups", "chup\xF3", "churros", "churubusco", "chus", "chutar", "chuzos", "ch\xE1ndal", "ch\xE1rter", "ci", "cia", "ciao", "cibec", "cibeles", "cibercaf\xE9", "cibercaf\xE9s", "cibereconom\xEDa", "ciberespacio", "cibern\xE9tica", "cicatriz", "cicatrizado", "cicatrizar", "ciceantes", "ciclismo", "ciclista", "ciclo", "ciclos", "cicl\xF3n", "cid", "cidente", "ciega", "ciegamente", "ciego", "cielo", "cien", "ciencia", "ciencias", "ciento", "cient\xEDfica", "cient\xEDficamente", "cient\xEDficas", "cient\xEDfico", "cient\xEDficos", "ciernes", "cierra", "cierran", "cierre", "cierro", "cierta", "ciertamente", "ciertas", "cierto", "ciertos", "cifesa", "cifra", "cifras", "cigala", "cigarrillo", "cigarrillos", "cig\xFCe\xF1a", "cilindro", "cil\xEDndrico", "cima", "cimientos", "cinc", "cincelador", "cincelar", "cinco", "cincuenta", "cincuent\xF3n", "cine", "cineclub", "cinematograf\xEDa", "cinematograf\xEDas", "cinematogr\xE1ficas", "cinematogr\xE1fico", "cinematogr\xE1ficos", "cines", "cinta", "cintura", "cintur\xF3n", "cin\xE9filo", "cin\xE9tica", "circense", "circo", "circuito", "circuitos", "circula", "circulaci\xF3n", "circular", "circulatorio", "circunferencia", "circunflejas", "circunflejos", "circunloquios", "circunstancia", "circunstancial", "circunstanciales", "circunstancias", "cirug\xEDa", "cirujano", "cisterna", "cita", "citan", "citar", "citas", "citativas", "citativos", "ciudad", "ciudadana", "ciudadano", "ciudadanos", "ciudadan\xEDa", "ciudades", "civil", "civiles", "civilizaciones", "civilizaci\xF3n", "civilizadamente", "civismo", "ci\xE1tica", "ci\xF3n", "cla", "clamor", "clan", "claqueta", "clara", "claramente", "clarear", "claridad", "clarificar", "clarinete", "claro", "claros", "claroscuro", "clar\xEDn", "clar\xEDsimo", "clase", "clases", "clasicismo", "clasificaciones", "clasificaci\xF3n", "clasificado", "clasificador", "clasificados", "clasificar", "clasificarlos", "clasificarse", "claustro", "clausura", "clausurar", "clavados", "clavan", "clavar", "clave", "claves", "clavo", "clav\xEDcula", "claxon", "clic", "cliente", "clientela", "clientes", "clima", "climatizador", "clim\xE1ticas", "clim\xE1tico", "clim\xE1ticos", "clip", "clodomiro", "clonaci\xF3n", "clorofila", "cloroformo", "clp", "club", "clubes", "cl\xE1sica", "cl\xE1sico", "cl\xE1sicos", "cl\xE1usula", "cl\xE1usulas", "cl\xEDnica", "cl\xEDnicas", "cl\xEDnicos", "cl\xEDtico", "cl\xEDticos", "cm", "cn", "cnac", "co", "coalici\xF3n", "coaparici\xF3n", "coartada", "cobarde", "cobard\xEDa", "cobertura", "cobrar", "cobrar\xE1n", "cobre", "cobro", "cocacolas", "cocear", "cocer", "cochambroso", "coche", "cochecito", "coches", "cochinillo", "cochinita", "cocido", "cocientes", "cocina", "cocinado", "cocinar", "cocinas", "cocinero", "cocineros", "coco", "cocodrilo", "codearse", "codera", "codificada", "codo", "codorniz", "codos", "coet\xE1neo", "coexistencia", "cofrad\xEDas", "coge", "coger", "cogerlo", "coges", "cogido", "cogi\xF3", "cognados", "cognici\xF3n", "cognitiva", "cognitivamente", "cognitivas", "cognitivismo", "cognitivo", "cogorza", "cog\xE9is", "cog\xED", "cohabitar", "coherencia", "coherente", "cohete", "cohetes", "coi", "coincide", "coinciden", "coincidencia", "coincidentes", "coincidir", "coincido", "coja", "cojo", "col", "cola", "colaboraci\xF3n", "colaborado", "colaborador", "colaboran", "colaborando", "colaborar", "colaci\xF3n", "colador", "colapsada", "colar", "colas", "colcha", "colchoneta", "colch\xF3n", "cole", "colecciona", "coleccionar", "colecciones", "coleccionismo", "coleccionista", "colectiva", "colectivas", "colectividades", "colectivo", "colectivos", "colega", "colegas", "colegial", "colegio", "colegios", "colesterol", "coleta", "coletilla", "colgaba", "colgante", "colgar", "colgarse", "colina", "colindante", "colisionar", "colisi\xF3n", "collar", "colma", "colmado", "colmar", "colmo", "colm\xF3", "coloca", "colocaba", "colocaci\xF3n", "colocado", "colocando", "colocar", "colocarse", "colocar\xEDa", "colombia", "colombiano", "colon", "colonia", "colonial", "colonias", "coloquial", "coloquiales", "color", "coloraci\xF3n", "colorada", "colorado", "colorante", "colorantes", "colorear", "colores", "colorete", "colorido", "colosal", "colostate", "columna", "columnas", "columnista", "columnistas", "columpiar", "columpios", "col\xE9rico", "col\xF3n", "com", "coma", "comala", "comandante", "comarca", "comarcal", "comarcas", "comas", "comba", "combate", "combatir", "combinaci\xF3n", "combinadas", "combinado", "combinan", "combinar", "combinatoria", "combustible", "combusti\xF3n", "come", "comedero", "comedia", "comedias", "comedido", "comedor", "comedores", "comel", "comemos", "comen", "comentabas", "comentada", "comentado", "comentadores", "comentan", "comentando", "comentar", "comentario", "comentarios", "comentarte", "comente", "coment\xF3", "comenzaba", "comenzado", "comenzar", "comenzaremos", "comenzar\xE1", "comenz\xF3", "comer", "comercial", "comerciales", "comercializaci\xF3n", "comercializar", "comerciante", "comerciar", "comercio", "comercios", "comerse", "comer\xE1s", "comer\xE9", "comer\xEDa", "comes", "comestible", "comestibles", "cometa", "comete", "cometen", "cometer", "cometi\xF3", "comible", "comida", "comidas", "comido", "comiendo", "comienza", "comienzan", "comienzas", "comienzo", "comienzos", "comieron", "comillas", "comilona", "comil\xF3n", "comino", "comisario", "comisar\xEDa", "comisiones", "comisi\xF3n", "comit\xE9", "comit\xE9s", "comi\xF3", "como", "comodidad", "comod\xEDn", "comoquiera", "comp", "compacto", "compadecer", "compadezco", "compadre", "compaginar", "comparaba", "comparables", "comparaciones", "comparaci\xF3n", "comparada", "comparan", "comparar", "compararse", "comparar\xE1n", "comparativas", "comparativo", "comparativos", "comparecencia", "comparecer", "comparen", "comparsa", "comparte", "comparten", "compartes", "compartida", "compartido", "compartidos", "compartimento", "compartir", "compartirlos", "comparto", "compasi\xF3n", "compatibildad", "compatibilidad", "compatible", "compa\xF1eras", "compa\xF1erismo", "compa\xF1ero", "compa\xF1eros", "compa\xF1\xEDa", "compa\xF1\xEDas", "compenetrarse", "compensaci\xF3n", "compensar", "compensatoria", "competencia", "competencias", "competente", "competentes", "competiciones", "competici\xF3n", "competidor", "competir", "competitiva", "competitivo", "compinche", "complace", "complaciente", "compleja", "complejas", "complejidad", "complejo", "complejos", "complementa", "complementaci\xF3n", "complementan", "complementaria", "complementarias", "complemento", "complementos", "completa", "completado", "completamente", "completar", "completas", "completiva", "completo", "complexi\xF3n", "complicaciones", "complicaci\xF3n", "complicada", "complicado", "complicados", "complicar", "complicarse", "complicidad", "complutense", "compone", "componen", "componente", "componentes", "componer", "componerse", "compon\xEDa", "compon\xEDan", "comporta", "comportamiento", "comportamientos", "comportan", "comportarse", "comportar\xE1n", "comporte", "composiciones", "composici\xF3n", "compositivo", "compositor", "compositores", "compostura", "compra", "comprado", "comprador", "comprando", "comprao", "comprar", "comprara", "compraras", "comprarle", "comprarlo", "comprarme", "compraron", "comprarte", "comprar\xEDa", "comprar\xEDais", "comprar\xEDas", "compras", "compraventa", "compremos", "comprender", "comprendo", "comprend\xED", "comprend\xEDan", "comprensible", "comprensibles", "comprensivo", "comprensi\xF3n", "compres", "comprimido", "comprimir", "compro", "comprobaci\xF3n", "comprobados", "comprobando", "comprobar", "comprometerse", "comprometo", "compromiso", "compromisos", "comprueben", "compr\xE1ndolas", "compr\xE1ndomelas", "compr\xE1rselas", "compr\xE1rtelo", "compr\xE9", "compr\xE9moselas", "compr\xE9smosselas", "compr\xF3", "compuesta", "compuestas", "compuesto", "compuestos", "compulsivamente", "compulsivo", "compuso", "computar", "comp\xE1s", "comulgar", "comuna", "comunes", "comunicaciones", "comunicaci\xF3n", "comunicado", "comunicando", "comunicar", "comunicarle", "comunicarles", "comunicarnos", "comunicarse", "comunicativa", "comunicativas", "comunicativo", "comunicativos", "comunico", "comunidad", "comunidades", "comunismo", "comunista", "comunitario", "comunitarios", "comuni\xF3n", "com\xE9rselo", "com\xE9rtelo", "com\xED", "com\xEDa", "com\xFAn", "com\xFAnmente", "con", "conato", "concebidos", "concebir", "concede", "conceden", "conceder", "concedido", "concedidos", "concedo", "concejal", "concentraci\xF3n", "concentran", "concentrarse", "concentrarte", "concentr\xE1ndose", "concepciones", "concepci\xF3n", "concepto", "conceptos", "conceptual", "conceptuales", "conceptualizaci\xF3n", "concertaci\xF3n", "concertado", "concertados", "concertar", "concesiones", "concesiva", "concesivas", "concesivo", "concesivos", "concesi\xF3n", "concha", "conciencia", "concienciaci\xF3n", "concienzudamente", "concienzudo", "concierne", "concierto", "conciertos", "conciliaci\xF3n", "concluidas", "concluido", "concluir", "conclusiones", "conclusivo", "conclusi\xF3n", "concluso", "concluye", "concluyen", "concluyente", "concluyentes", "concomitancia", "concomitancias", "concomitantes", "concordada", "concordancia", "concordia", "concreci\xF3n", "concreta", "concretamente", "concretar", "concretas", "concreto", "concretos", "concurrencia", "concurrida", "concurrido", "concurrir", "concursar", "concurso", "concursos", "cond", "condado", "conde", "condena", "condenamos", "condenar", "condenarse", "condenatoria", "condeno", "condensada", "condescendencia", "condic", "condicionada", "condicional", "condicionales", "condicionan", "condicionante", "condiciones", "condici\xF3n", "condimentar", "condimentos", "condolencias", "conducci\xF3n", "conduce", "conducen", "conducir", "conducir\xE1n", "conducta", "conductas", "conductismo", "conductista", "conductor", "conductores", "conduc\xEDa", "conduje", "conduzca", "conduzcamos", "cone", "conectado", "conectan", "conectar", "conectarse", "conector", "conectores", "conejo", "conex", "conexiones", "conexi\xF3n", "confecci\xF3n", "confederaci\xF3n", "conferencia", "conferenciante", "conferenciantes", "conferencias", "conferir", "confesar", "confesara", "confesarse", "confesarte", "confesionario", "confesiones", "confesi\xF3n", "confes\xF3", "confi", "confiamos", "confianza", "confiar", "confidencia", "confidencial", "confidenciales", "confidencialidad", "confieso", "configuraci\xF3n", "configurar", "confines", "confirmaciones", "confirmaci\xF3n", "confirmado", "confirman", "confirmar", "confirmarme", "confirmativas", "confirmativo", "confirmen", "confiscar", "conflictivo", "conflicto", "conflictos", "confluencia", "confluir", "conforman", "conformarse", "conforme", "conformidad", "confort", "confortable", "confrontaci\xF3n", "confundas", "confundes", "confundido", "confundirse", "confusamente", "confusas", "confusi\xF3n", "confuso", "conf\xEDan", "conf\xEDo", "congelado", "congelador", "congelados", "congelar", "congelarse", "congeniar", "congente", "congratula", "congratulamos", "congratularse", "congratulo", "congreso", "congresos", "congruente", "cong\xE9nita", "cong\xE9nito", "conjetura", "conjeturas", "conjugaciones", "conjugaci\xF3n", "conjugado", "conjunciones", "conjunci\xF3n", "conjunta", "conjuntamente", "conjuntivas", "conjuntivos", "conjunto", "conlleva", "conllevan", "conmemoraciones", "conmemoraci\xF3n", "conmemorar", "conmemorativas", "conmemorativo", "conmemorativos", "conmigo", "conmino", "conmoci\xF3n", "conmovedora", "conmovieron", "conmutaci\xF3n", "connotaciones", "connotaci\xF3n", "cono", "conoce", "conocemos", "conocen", "conocer", "conocerla", "conocernos", "conocerte", "conocer\xE9", "conocer\xE9is", "conoces", "conocida", "conocidas", "conocido", "conocidos", "conociendo", "conocimiento", "conocimientos", "conocimos", "conocisteis", "conoci\xE9ramos", "conoc\xE9is", "conoc\xED", "conoc\xEDa", "conozca", "conozcan", "conozcas", "conozco", "conque", "conquista", "conquistar", "cons", "consagrado", "consagrar", "consanguinidad", "consciente", "conscientes", "consecuci\xF3n", "consecuencia", "consecuencias", "consecuente", "consecuentemente", "consecutio", "consecutivas", "consecutivo", "consecutivos", "conseguido", "conseguir", "conseguirlo", "conseguir\xE1", "conseguir\xE1s", "conseguir\xE9", "consegu\xED", "consejero", "consejer\xEDa", "consejer\xEDas", "consejo", "consejos", "consenso", "consensuada", "consentido", "consentimiento", "consentir", "conserje", "conserjer\xEDa", "conserva", "conservaci\xF3n", "conservada", "conservador", "conservan", "conservantes", "conservar", "conservarlos", "conservarse", "conservatorio", "considera", "consideraba", "considerable", "considerables", "consideraci\xF3n", "considerado", "considerados", "consideramos", "consideran", "considerar", "considerarse", "consideras", "considere", "consideren", "considero", "consider\xE1ndolo", "consider\xF3", "consiento", "consiga", "consigna", "consignas", "consigo", "consigue", "consiguen", "consiguiente", "consiguientemente", "consiguientes", "consigui\xF3", "consiste", "consisten", "consistencia", "consistente", "consistir", "consola", "consolaci\xF3n", "consolidaci\xF3n", "consolidar", "consonante", "consonantes", "consonantizado", "conson\xE1nticas", "conson\xE1ntico", "conson\xE1nticos", "consta", "constancia", "constante", "constantemente", "constar", "constataci\xF3n", "constatar", "conste", "constelaciones", "constelaci\xF3n", "consternado", "constitucional", "constitucionales", "constituciones", "constituci\xF3n", "constituido", "constituir", "constituye", "constituyente", "constituyentes", "construcciones", "construcci\xF3n", "constructiva", "constructor", "constructora", "construimos", "construir", "construya", "construyeron", "construyo", "construy\xF3", "consuelo", "consulado", "consulta", "consultadas", "consultados", "consultar", "consultar\xEDa", "consultas", "consulte", "consultorio", "consumado", "consume", "consumen", "consumici\xF3n", "consumidor", "consumidores", "consumir", "consumo", "cont", "contaba", "contabilidad", "contable", "contables", "contactar", "contacto", "contactos", "contado", "contagiar", "contagio", "contagiosa", "contaminaci\xF3n", "contaminado", "contaminante", "contamos", "contando", "contante", "contar", "contara", "contaras", "contarle", "contarles", "contarlo", "contarnos", "contaron", "contarte", "contaste", "contemplaba", "contemplaciones", "contemplar", "contempor\xE1nea", "contempor\xE1neas", "contempor\xE1neo", "contempor\xE1neos", "contenedor", "contenedores", "contener", "contenido", "contenidos", "content", "contenta", "contentita", "contento", "contentos", "content\xEDsimos", "contesta", "contestado", "contestador", "contestadores", "contestar", "contestarla", "contestarme", "contestar\xE9", "contesto", "contest\xF3", "contexto", "contextos", "contextuales", "contextualizaci\xF3n", "contienda", "contiene", "contienen", "contigo", "contiguas", "contiguo", "contig\xFCidad", "continental", "continente", "contingencia", "contingente", "continua", "continuaci\xF3n", "continuada", "continuado", "continuamente", "continuamos", "continuar", "continuaremos", "continuativo", "continuativos", "continuemos", "continuidad", "continuo", "contin\xFAa", "contin\xFAan", "contin\xFAen", "contorno", "contra", "contraargumentaci\xF3n", "contraargumentativo", "contraargumentativos", "contraargumento", "contrabajo", "contrabandista", "contrabando", "contracciones", "contracci\xF3n", "contractas", "contractura", "contradecir", "contradecirle", "contradicci\xF3n", "contradictio", "contradictorio", "contraer", "contrafactual", "contraindicaciones", "contraindicado", "contralto", "contraluz", "contrapeso", "contraproducente", "contrapropuesta", "contraria", "contrariado", "contrariamente", "contrarias", "contrariedad", "contrario", "contrarreloj", "contras", "contrase\xF1a", "contrasta", "contrastado", "contrastan", "contrastar", "contrastarlas", "contraste", "contrastivo", "contrastivos", "contrataci\xF3n", "contratado", "contratar", "contratista", "contrato", "contratos", "contrat\xE9", "contraventana", "contribuciones", "contribuci\xF3n", "contribuido", "contribuir", "contribuye", "contribuyente", "contrincante", "control", "controlables", "controlando", "controlar", "controles", "controvertido", "contundente", "contusi\xF3n", "cont\xE1rselo", "cont\xE9", "cont\xE9is", "cont\xF3", "convalecencia", "convaleciente", "convalidaci\xF3n", "convalidar", "convence", "convencer", "convencerla", "convencerme", "convencerse", "convencida", "convencido", "convencidos", "convencimiento", "convencional", "convencionales", "convenciones", "convendr\xEDa", "conveniencia", "conveniente", "convenio", "convenios", "convenir", "convento", "converger", "conversacional", "conversaciones", "conversaci\xF3n", "conversar", "conversi\xF3n", "convertible", "convertidas", "convertido", "convertir", "convertirse", "convexo", "convicci\xF3n", "conviene", "conviertan", "convierte", "convincente", "convirti\xF3", "convive", "conviven", "convivencia", "conviviendo", "convivir", "convocar", "convocatoria", "convulsiones", "convulsi\xF3n", "conyugales", "cooficiales", "cooperaci\xF3n", "cooperar", "cooperativa", "cooperativas", "cooperativo", "coordenadas", "coordinaci\xF3n", "coordinada", "coordinadas", "coordinados", "coordinando", "coordinante", "coordinar", "copa", "copar", "copas", "copenhague", "copia", "copiar", "copias", "copiloto", "copiosa", "copioso", "copita", "copla", "copo", "copulativas", "copulativo", "copulativos", "copyright", "coraje", "corazonada", "corazones", "coraz\xF3n", "corbata", "corbatas", "corchea", "corchete", "corchetes", "corcho", "cordero", "cordial", "cordiales", "cordialidad", "cordialmente", "cordillera", "cordilleras", "cordura", "cord\xF3n", "coreano", "corear", "coreograf\xEDa", "core\xF3grafos", "corintia", "coro", "corola", "corona", "coronado", "coronar", "coronilla", "corporal", "corporales", "corpulencia", "corpulento", "corpus", "corp\xF3reo", "corral", "corrales", "corre", "correa", "correcci\xF3n", "correcta", "correctamente", "correctivo", "correcto", "corrector", "correctores", "corredor", "correferencia", "correferencialidad", "corregir", "correlaci\xF3n", "correlativa", "correlativas", "corremos", "corren", "correo", "correos", "correr", "correspondan", "corresponde", "corresponden", "correspondencia", "correspondencias", "corresponder", "corresponder\xEDa", "correspondiente", "correspondientes", "correspondiere", "correspond\xEDan", "corresponsal", "corridas", "corrido", "corriendito", "corriendo", "corriente", "corrientes", "corrigiendo", "corrijo", "corrimos", "corri\xF3", "corro", "corroborar", "corroer", "corrupci\xF3n", "corr\xED", "corr\xEDan", "corta", "cortado", "cortar", "cortarle", "cortaron", "cortarse", "cortas", "corta\xFA\xF1as", "corte", "cortejo", "cortes", "cortes\xEDa", "corteza", "cortijo", "cortina", "cortinas", "corto", "cortometraje", "cort\xE1zar", "cort\xE9s", "cort\xE9smente", "coru\xF1a", "cor\xE1n", "cosa", "cosaco", "cosas", "cosecha", "cosechar", "coser", "cosido", "cosita", "cosmopolita", "cosmos", "cosm\xE9tica", "cosm\xE9ticos", "costa", "costado", "costar", "costaran", "costas", "coste", "costear", "costeras", "costero", "costes", "coste\xF1o", "costilla", "costillas", "costoso", "costruir", "costumbre", "costumbres", "costumbrista", "costura", "cos\xEDo", "cotidiana", "cotidianas", "cotidiano", "cotidianos", "cotilla", "cotillear", "cotilleo", "cotizaci\xF3n", "cotizado", "cotizar", "cotxe", "covadonga", "coyuntura", "coyuntural", "co\xF1ac", "co\xF1\xE1", "craneoencef\xE1lico", "craso", "crea", "creaci\xF3n", "creado", "creador", "creadora", "crean", "creando", "crear", "creara", "crearme", "crearon", "crearse", "creas", "creativa", "creatividad", "creativo", "crece", "crecen", "crecer", "creces", "crecida", "crecido", "creciendo", "creciente", "crecientes", "crecimiento", "creci\xF3", "credibilidad", "credo", "cree", "creeencias", "creemos", "creen", "creencia", "creencias", "creer", "creerle", "creerlo", "creerme", "creerse", "creer\xE1s", "creer\xEDas", "crees", "crema", "cremallera", "creo", "creyente", "creyeron", "crey\xF3", "cre\xE9is", "cre\xED", "cre\xEDa", "cre\xEDble", "cre\xEDdo", "criado", "criador", "crianza", "criar", "criatura", "crimen", "criminal", "criminales", "criminalista", "criollo", "crisis", "crisma", "cristal", "cristaler\xEDa", "cristales", "cristalizaci\xF3n", "cristianismo", "cristiano", "cristianos", "cristina", "cristo", "crist\xF3bal", "criterio", "criterios", "criticado", "criticados", "criticar", "crol", "cromado", "cromosoma", "cronista", "cronistas", "cronogramas", "cronolog\xEDa", "cronol\xF3gica", "cronol\xF3gico", "cronol\xF3gicos", "cronometrar", "croquetas", "croquis", "cru", "cruce", "crucemos", "crucero", "crucial", "crucifijo", "crucigrama", "crucigramas", "cruc\xE9", "crudeza", "crudo", "crudos", "cruel", "crueldad", "crujido", "crujir", "crupier", "crust\xE1ceo", "cruz", "cruza", "cruzado", "cruzados", "cruzamos", "cruzar", "cruzarse", "cruzo", "cruz\xF3", "cr\xE1neo", "cr\xE9dito", "cr\xE9ditos", "cr\xE9eme", "cr\xEDa", "cr\xEDo", "cr\xEDtica", "cr\xEDticas", "cr\xEDtico", "cr\xF3nica", "cr\xF3nico", "cr\xF3nicos", "ct", "cuaderno", "cuadernos", "cuadra", "cuadrada", "cuadrado", "cuadrados", "cuadrag\xE9simo", "cuadrar", "cuadriculado", "cuadril\xE1tero", "cuadro", "cuadros", "cual", "cuales", "cualidad", "cualidades", "cualificado", "cualitativa", "cualitativo", "cualitativos", "cualquier", "cualquiera", "cuando", "cuandoquiera", "cuanta", "cuantas", "cuantif", "cuantificacional", "cuantificaci\xF3n", "cuantificada", "cuantificadas", "cuantificado", "cuantificador", "cuantificadoras", "cuantificadores", "cuantificativos", "cuantiosa", "cuantitativa", "cuantitativamente", "cuantitativo", "cuantitativos", "cuanto", "cuantos", "cuant\xEDa", "cuar", "cuarenta", "cuarentena", "cuarent\xF3n", "cuartel", "cuarteto", "cuarto", "cuartos", "cuatrimestral", "cuatro", "cuba", "cubana", "cubano", "cuberter\xEDa", "cubierta", "cubiertas", "cubierto", "cubiertos", "cubismo", "cubista", "cubo", "cubrir", "cubri\xF3", "cubr\xEDa", "cubr\xEDan", "cuchara", "cucharada", "cucharilla", "cuchar\xF3n", "cuchichear", "cuchilla", "cuchillada", "cuchillo", "cuchitril", "cucurucho", "cuelga", "cuello", "cuenco", "cuenta", "cuentan", "cuentas", "cuente", "cuentes", "cuentistas", "cuentisto", "cuento", "cuentos", "cuer", "cuerda", "cuerdas", "cuerdo", "cuerno", "cuero", "cuerpo", "cuerpos", "cuervo", "cuesta", "cueste", "cuestiona", "cuestionable", "cuestionamiento", "cuestionar", "cuestionario", "cuestionarios", "cuestionen", "cuestiones", "cuestiono", "cuesti\xF3n", "cuida", "cuidada", "cuidado", "cuidados", "cuidadosamente", "cuidamos", "cuidando", "cuidar", "cuidarse", "cuid\xF3", "culebr\xF3n", "culpa", "culpable", "culpables", "culta", "cultismos", "cultiva", "cultivado", "cultivar", "cultivarlo", "cultivo", "cultivos", "cultivostransgenicos", "cultiv\xF3", "culto", "cultos", "cultura", "cultural", "culturales", "culturas", "cumbia", "cumbre", "cumpla", "cumplas", "cumple", "cumplea\xF1os", "cumplido", "cumplidos", "cumplieron", "cumplimentar", "cumplimentativos", "cumplimiento", "cumplimos", "cumplir", "cumplirse", "cumpli\xE9ramos", "cumpl\xEDa", "cuna", "cunas", "cunda", "cundan", "cuneta", "cuota", "cuotas", "cura", "curaci\xF3n", "curanderos", "curar", "curarse", "curas", "curativo", "curdo", "curiosa", "curiosear", "curiosidad", "curioso", "currante", "currar", "curre", "currito", "curro", "curr\xEDculo", "curr\xEDculos", "curr\xEDculum", "cursar", "cursi", "cursillo", "cursiva", "curso", "cursor", "cursos", "curva", "curvado", "curvatura", "curvo", "cuscurro", "cutis", "cut\xE1neo", "cuya", "cuyas", "cuyo", "cuyos", "cuzco", "cu\xE1l", "cu\xE1les", "cu\xE1n", "cu\xE1ndo", "cu\xE1nta", "cu\xE1ntas", "cu\xE1ntica", "cu\xE1nto", "cu\xE1ntos", "cu\xE9ntame", "cu\xE9ntaselo", "cu\xEDdala", "cu\xEDdate", "cu\xF1a", "cu\xF1ada", "cu\xF1ado", "cu\xF1ados", "cv", "cvc", "cvcc", "c\xE1ceres", "c\xE1diz", "c\xE1lculo", "c\xE1lida", "c\xE1lidas", "c\xE1lido", "c\xE1liz", "c\xE1llate", "c\xE1lmate", "c\xE1mara", "c\xE1ncer", "c\xE1ntaros", "c\xE1p", "c\xE1pac", "c\xE1pita", "c\xE1psula", "c\xE1rcel", "c\xE1rdenas", "c\xE1rter", "c\xE1scara", "c\xE1\xF1amo", "c\xE9lebre", "c\xE9lula", "c\xE9lulas", "c\xE9ntimo", "c\xE9ntrico", "c\xE9sar", "c\xE9sped", "c\xEDclico", "c\xEDrculo", "c\xEDvico", "c\xF3ctel", "c\xF3digo", "c\xF3digos", "c\xF3gelos", "c\xF3lera", "c\xF3lico", "c\xF3mete", "c\xF3mic", "c\xF3micas", "c\xF3micos", "c\xF3mics", "c\xF3mo", "c\xF3moda", "c\xF3modas", "c\xF3modo", "c\xF3modos", "c\xF3mpralo", "c\xF3mpramelo", "c\xF3mpratelo", "c\xF3mputo", "c\xF3mputos", "c\xF3ncava", "c\xF3ncavo", "c\xF3ndor", "c\xF3nica", "c\xF3nico", "c\xF3nsul", "c\xF3nyuge", "c\xF3oomo", "c\xF3rdoba", "c\xF3rnea", "c\xF3rner", "c\xF3rtelas", "c\xF3smico", "c\xFAbica", "c\xFAbico", "c\xFAmulo", "c\xFApula", "c\xFApulas", "d", "da", "daba", "daban", "dactilares", "dad", "dada", "dadas", "dadle", "dado", "dados", "dais", "dale", "dama", "dame", "dan", "dando", "daniel", "danza", "danzas", "danz\xF3n", "dap", "dar", "dardos", "darle", "darles", "darme", "darr", "darse", "darte", "dar\xE1", "dar\xE1n", "dar\xE9", "dar\xEDa", "dar\xEDo", "das", "date", "dativo", "dato", "datos", "da\xF1ado", "da\xF1ino", "da\xF1o", "da\xF1os", "dc", "dde", "de", "deambular", "debajo", "debate", "debates", "debatir", "debe", "debemos", "deben", "deber", "deberes", "deber\xE1", "deber\xE1n", "deber\xEDa", "deber\xEDamos", "deber\xEDan", "deber\xEDas", "debes", "debida", "debidamente", "debidas", "debido", "debiera", "debieras", "debilidad", "debilita", "debilitado", "debilitamiento", "debimos", "debi\xF3", "debo", "debut", "debutar", "deb\xE9is", "deb\xED", "deb\xEDa", "deb\xEDas", "decadencia", "decaer", "decaimiento", "decanato", "decano", "decantas", "decantasteis", "decanto", "deca\xEDdo", "deceleraci\xF3n", "decenas", "decepciona", "decepcionado", "decepci\xF3n", "deceso", "decide", "deciden", "decides", "decidido", "decidieron", "decidimos", "decidir", "decidiremos", "decidirse", "decidisteis", "decidi\xE9ramos", "decidi\xF3", "decido", "decid\xED", "decilitro", "decimal", "decimales", "decimos", "decimos\xE9ptimo", "decir", "decirle", "decirlo", "decirme", "deciros", "decirse", "decirte", "decisiones", "decisiva", "decisivo", "decisi\xF3n", "declar", "declara", "declaraciones", "declaraci\xF3n", "declaradas", "declarado", "declarante", "declarar", "declararon", "declararse", "declarativas", "declarativo", "declarativos", "declinar", "declive", "decolorar", "decomisar", "decoraci\xF3n", "decorado", "decoradores", "decorar", "decorativa", "decorativo", "decrecer", "decreciente", "decrecientes", "decrecimiento", "decrepitud", "decretar", "decreto", "decretos", "dec\xEDa", "dec\xEDdselo", "dec\xEDmetro", "dec\xEDrmelo", "dec\xEDrselo", "dedica", "dedicado", "dedicar", "dedicarme", "dedicarse", "dedicas", "dedicatoria", "dedic\xE1ramos", "dedillo", "dediquen", "dedo", "dedos", "deducci\xF3n", "deducir", "deductiva", "deeejes", "defecto", "defectos", "defectuoso", "defendemos", "defender", "defendido", "defensa", "defensor", "defensor\xEDa", "deficiente", "defienden", "defiendo", "define", "definen", "definici\xF3n", "definida", "definido", "definidos", "definir", "definitiva", "definitivamente", "definitorias", "definitva", "deflaci\xF3n", "deforestaci\xF3n", "deforestadas", "deformar", "deforme", "defunciones", "defunci\xF3n", "degenerar", "degustaci\xF3n", "degustar", "deidad", "deidades", "deis", "deixis", "deja", "dejadez", "dejado", "dejamos", "dejan", "dejar", "dejara", "dejaran", "dejaras", "dejaremos", "dejarle", "dejarlo", "dejarme", "dejarse", "dejarte", "dejar\xE1s", "dejar\xEDa", "dejar\xEDas", "dejas", "dejaste", "deje", "dejemos", "dejen", "dejes", "dejo", "dej\xE1ndote", "dej\xE9", "dej\xE9is", "dej\xF3", "del", "delantal", "delante", "delantera", "delantero", "delatar", "dele", "delegaci\xF3n", "delegado", "delegar", "deletreo", "delf\xEDn", "delgada", "delgado", "deliberada", "deliberadamente", "deliberadas", "deliberar", "deliberativa", "delicada", "delicadas", "delicadeza", "delicado", "delicados", "delicioso", "delictivos", "delimitaci\xF3n", "delimitada", "delimitado", "delincuencia", "delincuente", "delincuentes", "delinear", "delirar", "delirio", "delito", "delitos", "delta", "deltas", "demagogia", "demanda", "demandados", "demandar", "demandas", "demarcaciones", "demasiada", "demasiado", "demas\xEDa", "democracia", "democr\xE1tico", "demogr\xE1fico", "demogr\xE1ficos", "demoler", "demonio", "demonios", "demora", "demostrable", "demostraci\xF3n", "demostrado", "demostrar", "demostraremos", "demostrativo", "demostrativos", "demuestra", "demuestran", "demuestren", "dem\xE1s", "dem\xF3crata", "den", "denegado", "denegar", "denomina", "denominaban", "denominaci\xF3n", "denominado", "denotan", "denotar", "densa", "densidad", "denso", "dental", "dentales", "dentellada", "dentera", "dentista", "dentro", "denuncia", "denunciar", "denuncies", "departamento", "departamentos", "depende", "dependencia", "depender", "depender\xE1", "dependiendo", "dependiente", "dependientes", "depilarse", "depilatoria", "deporte", "deportes", "deportista", "deportistas", "deportiva", "deportivas", "deportivo", "deportivos", "deposita", "depositar", "depre", "depreciaci\xF3n", "depreciarse", "depresi\xF3n", "deprime", "deprimente", "deprimida", "deprimido", "deprimirse", "deprisa", "deptos", "depuradora", "depurar", "dep\xF3sito", "deque\xEDsmo", "derbi", "derecha", "derechas", "derecho", "derechos", "deriva", "derivaci\xF3n", "derivadas", "derivados", "derivar", "dermatolog\xEDa", "derogar", "derrame", "derrapar", "derrape", "derretir", "derribar", "derrochar", "derroche", "derrota", "derrotado", "derrotar", "derruir", "derrumbarse", "derrumbe", "des", "desaborido", "desacatar", "desacato", "desacertado", "desacostumbrado", "desactivar", "desactualizadora", "desactualizar", "desacuerdo", "desafiante", "desafiar", "desaf\xEDo", "desagrada", "desagradable", "desagradablemente", "desagradables", "desagradar", "desaguar", "desaguisado", "desag\xFCe", "desahogada", "desahuciar", "desahucio", "desajuste", "desali\xF1ado", "desalojar", "desalojo", "desambiguador", "desanimado", "desanimarse", "desapacible", "desaparece", "desaparecer\xEDan", "desaparecido", "desaparecieran", "desapareci\xF3", "desaparici\xF3n", "desapercibido", "desapercibidos", "desaprobaci\xF3n", "desaprovechar", "desarmadores", "desarmar", "desarme", "desarrapado", "desarrollada", "desarrolladas", "desarrollado", "desarrollados", "desarrollando", "desarrollar", "desarrollo", "desarticular", "desaseado", "desaseo", "desasosiego", "desastre", "desastres", "desastroso", "desatar", "desatento", "desatinado", "desatino", "desautorizarlo", "desayunamos", "desayunar", "desayunarse", "desayuno", "desayunos", "desbandada", "desbocarse", "desbordante", "desbordar", "desbordarse", "descabellada", "descabellado", "descalza", "descalzan", "descalz\xF3", "descaminado", "descampado", "descansa", "descansado", "descansamos", "descansando", "descansar", "descansara", "descanses", "descanso", "descansos", "descapotable", "descarga", "descargar", "descargarse", "descarrilar", "descendente", "descendentes", "descender", "descendiente", "descenso", "descensos", "descentralizaci\xF3n", "desciende", "descienden", "descifrar", "descompone", "descomponer", "descomponerse", "descompuesto", "descomunal", "desconectes", "desconfianza", "descongelar", "desconoce", "desconocemos", "desconocen", "desconocidas", "desconocido", "desconocidos", "desconocimiento", "desconozco", "desconsolado", "desconsuelo", "descontado", "descontar", "descontento", "descontrol", "descontrolada", "descontrolado", "desconvocar", "descorchar", "descortes\xEDa", "descosido", "descremada", "describir", "describirse", "descripciones", "descripci\xF3n", "descriptiva", "descriptivo", "descriptores", "descrito", "descubierta", "descubridor", "descubriendo", "descubrimiento", "descubrimos", "descubr\xED", "descuento", "descuentos", "descuidada", "descuidado", "descuidar", "descuido", "desde", "desde\xF1able", "desea", "deseaba", "deseada", "deseado", "deseados", "deseamos", "desean", "desear", "desearles", "desear\xEDa", "desear\xEDas", "deseas", "desecado", "desecar", "desechable", "desechos", "desee", "deseen", "desemantizados", "desembocadura", "desembocar", "desembolsar", "desembolso", "desembucha", "desempe\xF1an", "desempe\xF1ar", "desempe\xF1o", "desempleado", "desempleados", "desempleo", "desempolvar", "desencadenar", "desencadenarse", "desencaden\xF3", "desencajadas", "desenfadado", "desenfrenada", "desenfrenado", "desenlace", "desentiendas", "desenvolverse", "desenvolvi\xF3", "deseo", "deseos", "deseoso", "deserci\xF3n", "desertar", "desertizaci\xF3n", "desespera", "desesperada", "desesperadamente", "desesperado", "desespero", "desesper\xF3", "desestimar", "dese\xE9", "desfase", "desfavorables", "desfigurar", "desfiladero", "desfilar", "desfile", "desfiles", "desgarbado", "desgarradora", "desgarro", "desgaste", "desgraciadamente", "desgravar", "deshabitados", "deshacer", "deshecho", "deshicimos", "deshojar", "desiderativas", "desiderativo", "desiderativos", "desierta", "desierto", "desiertos", "designado", "designan", "designar", "desigual", "desigualdad", "desilusiona", "desilusionado", "desilusionados", "desilusi\xF3n", "desinfecci\xF3n", "desinfectar", "desinfectarlas", "desintegrarse", "desintoxicaci\xF3n", "desistir", "deslic\xE9", "desliz", "deslizante", "deslizar", "deslizarse", "deslumbrado", "desmantelar", "desmayarse", "desmayo", "desmay\xF3", "desmedido", "desmentir", "desmenuzar", "desmesurado", "desmientes", "desnatada", "desnatado", "desnivelado", "desnuda", "desobedece", "desobedecer", "desocupada", "desocupado", "desodorante", "desolado", "desolador", "desorbitado", "desorden", "desorientado", "despachar", "despacho", "despacio", "despacito", "despectivamente", "despectivo", "despedida", "despedido", "despedir", "despedirlo", "despedirme", "despedirse", "despegar", "despeinado", "despejado", "despejar", "desperdicio", "desperdicios", "despersonificar", "despertador", "despertar", "despertasen", "despert\xE9", "despert\xF3", "despe\xF1arse", "despiden", "despidieran", "despidi\xF3", "despido", "despierta", "despierto", "despilfarrar", "despistado", "despistarse", "despiste", "desplaza", "desplazado", "desplazamiento", "desplazamientos", "desplazan", "desplazar", "desplazarse", "desplegar", "despliegue", "despoblada", "desposarse", "despotismo", "despreciados", "despreciar", "despreciativa", "despreciativo", "desprecio", "despreci\xF3", "desprender", "desprendimiento", "desproporcionado", "desprop\xF3sito", "despuntar", "despu\xE9s", "destacadas", "destacados", "destacar", "destajo", "destartalado", "destensar", "deste\xF1ido", "deste\xF1ir", "destierro", "destilaci\xF3n", "destilar", "destiler\xEDa", "destinada", "destinadas", "destinado", "destinados", "destinar", "destinatario", "destino", "destinos", "destituci\xF3n", "destituir", "destornillador", "destreza", "destrezas", "destroza", "destrozado", "destrucci\xF3n", "destructivo", "destruido", "destruir", "destr\xEDsimo", "desuso", "desvalidos", "desvalorizaci\xF3n", "desvanecerse", "desvariar", "desvar\xEDo", "desvelar", "desvencijado", "desventajas", "desviado", "desviar", "desv\xE1n", "desv\xEDo", "des\xE1nimo", "des\xE9rtico", "detalle", "detalles", "detallista", "detectar", "detenci\xF3n", "detener", "detenerme", "detenerse", "detergente", "deteriorado", "deterioro", "determinaci\xF3n", "determinada", "determinadas", "determinado", "determinados", "determinan", "determinante", "determinantes", "determinar", "detestable", "detestar", "detesto", "detonaci\xF3n", "detrimento", "detr\xE1s", "detuvo", "deuda", "deutsche", "devaluaci\xF3n", "devaluar", "devaluarse", "devanarse", "devastador", "devastadores", "devastar", "deverbales", "devoci\xF3n", "devoluciones", "devoluci\xF3n", "devolver", "devolver\xEDamos", "devolviste", "devolvi\xF3", "devorar", "devoto", "devuelto", "devuelva", "devuelvan", "devuelves", "de\xEDctica", "de\xEDcticamente", "de\xEDcticas", "de\xEDctico", "de\xEDcticos", "dgc", "dgt", "di", "dia", "diabetes", "diablo", "diablos", "diab\xE9ticos", "diada", "diafragma", "diagnosticar", "diagn\xF3stico", "diagonal", "diagramas", "dialectal", "dialectales", "dialectos", "dialogal", "dialogar", "dial\xF3gica", "diamante", "diamantes", "dianas", "diapositiva", "diapositivas", "diaria", "diariamente", "diario", "diarios", "diarrea", "diastr\xE1ticas", "diat\xF3picas", "dibuja", "dibujada", "dibujar", "dibujar\xEDa", "dibujo", "dibujos", "dibuj\xF3", "diccionario", "diccionarios", "dicci\xF3n", "dice", "dicen", "dices", "dicha", "dichas", "dicho", "dichos", "dichoso", "dichosos", "diciembre", "diciendo", "dictado", "dictador", "dictadura", "dictar", "dictum", "did\xE1ctica", "did\xE1ctico", "did\xE1cticos", "dieciocho", "diecis\xE9is", "diego", "diente", "dientes", "diera", "dieran", "dieras", "dieron", "diestro", "diestr\xEDsimo", "dieta", "dietas", "diet\xE9tico", "diet\xE9ticos", "diez", "diferencia", "diferenciaci\xF3n", "diferenciador", "diferenciadora", "diferenciar", "diferenciarlo", "diferencias", "diferente", "diferentes", "diferido", "dificulta", "dificultad", "dificultades", "dificultan", "dificultar", "dificulten", "dificultoso", "difieren", "difundida", "difundido", "difundir", "difunto", "difusi\xF3n", "dif\xEDcil", "dif\xEDciles", "dif\xEDcilmente", "dif\xEDcil\xEDsimo", "diga", "digamos", "digan", "digas", "digerir", "digestivo", "digesti\xF3n", "digital", "digitalizar", "dignidad", "dignidades", "digno", "digo", "digresivos", "digresi\xF3n", "digresores", "dije", "dijera", "dijeran", "dijeras", "dijeron", "dijiste", "dijo", "dij\xE9ranos", "dilaci\xF3n", "dilatada", "dilatado", "dile", "dilema", "diligencia", "diligente", "diluida", "diluir", "diluviar", "diluvio", "diluvi\xF3", "dime", "dimensiones", "dimensi\xF3n", "diminutivo", "diminutivos", "dimisi\xF3n", "dimitir", "dinado", "dinamarca", "dinamismo", "dinamizador", "dinamizar", "dinast\xEDa", "dinast\xEDas", "dinerillo", "dinero", "dintel", "din\xE1mica", "dio", "dios", "dioses", "diploma", "diplomatura", "diplom\xE1tica", "diplom\xE1ticamente", "diplom\xE1tico", "diptongada", "diptongadas", "diptongar", "diptongo", "diptongos", "diputaciones", "diputado", "diputados", "direcciones", "direcci\xF3n", "directa", "directamente", "directas", "directiva", "directivo", "directo", "director", "directora", "directores", "directorios", "directos", "diremos", "dirige", "dirigen", "dirigentes", "dirigido", "dirigidos", "dirigieron", "dirigimos", "dirigir", "dirigirme", "dirigirse", "dirigi\xE9ndose", "dirigi\xF3", "dirig\xED", "dirijo", "dir\xE1", "dir\xE1s", "dir\xE9", "dir\xEDa", "dir\xEDamos", "dir\xEDas", "dis", "discapacidades", "discapacitadas", "discapacitados", "disciplina", "disciplinado", "disciplinario", "disciplinas", "disco", "disconformidad", "discontinuas", "discordancia", "discordancias", "discos", "discoteca", "discotecas", "discreci\xF3n", "discrepar", "discrepas", "discrepo", "discreto", "discriminaciones", "discriminaci\xF3n", "discriminador", "discriminar", "discriminatorio", "disculpa", "disculpado", "disculpamos", "disculpar", "disculparan", "disculparas", "disculparme", "disculparse", "disculparte", "disculpas", "disculpe", "disculpen", "disculpes", "disculp\xF3", "discurrir", "discursivamente", "discursivas", "discursivo", "discursivos", "discurso", "discursos", "discusiones", "discusi\xF3n", "discutamos", "discutido", "discutiendo", "discutir", "discutiremos", "discuto", "discut\xEDa", "disc\xEDpulo", "disecado", "disecar", "disentir", "disertaci\xF3n", "dise\xF1ado", "dise\xF1ador", "dise\xF1ar", "dise\xF1o", "disfraces", "disfrazar", "disfrazarse", "disfruta", "disfrutaban", "disfrutan", "disfrutar", "disfrutarlos", "disfrute", "disfruto", "disfrut\xE9", "disgusta", "disgustado", "disgustan", "disgustar\xEDa", "disidencia", "disiento", "disimular", "disimul\xF3", "disipar", "disiparse", "disip\xF3", "disjunta", "dislexia", "dislocaciones", "dislocaci\xF3n", "disminuci\xF3n", "disminuido", "disminuir", "disminuirlo", "disoluci\xF3n", "disolverse", "disparado", "disparar", "dispararse", "disparate", "disparates", "disparo", "dispar\xE9", "dispensar", "dispersar", "dispersas", "dispondremos", "dispone", "disponemos", "disponen", "disponer", "disponga", "dispongas", "disponibilidad", "disponible", "disponibles", "dispon\xEDamos", "disposiciones", "disposici\xF3n", "dispositivo", "dispuesta", "dispuesto", "dispuestos", "disputa", "disputar", "disquisici\xF3n", "dista", "distancia", "distanciado", "distanciamiento", "distanciar", "distancias", "distante", "distar", "distender", "distendida", "distensi\xF3n", "distinci\xF3n", "distinguido", "distinguir", "distinguirse", "distinta", "distintas", "distinto", "distintos", "distorsionar", "distracci\xF3n", "distractores", "distraerse", "distra\xEDdamente", "distra\xEDdo", "distribucional", "distribuci\xF3n", "distribuida", "distribuir", "distributiva", "distributivas", "distributivo", "distrito", "distritos", "disyuntiva", "disyuntivas", "disyuntivo", "diurna", "diur\xE9tico", "divagaci\xF3n", "divagar", "diversas", "diversidad", "diversificaci\xF3n", "diversiones", "diversi\xF3n", "diversos", "divertida", "divertido", "divertid\xEDsima", "divertid\xEDsimo", "divertimento", "divertimos", "divertirse", "divert\xED", "divert\xEDa", "divide", "dividen", "dividida", "dividir", "divierta", "diviertas", "divierte", "divierto", "divinidades", "divino", "divinos", "divirtiera", "divirti\xF3", "divisar", "divisas", "divisiones", "divisi\xF3n", "divi\xE9rtete", "divorciado", "divorciarme", "divorciarse", "divorcio", "divulgaci\xF3n", "divulgar", "divulgativos", "div\xE1n", "di\xE1fano", "di\xE1is", "di\xE1lisis", "di\xE1logo", "di\xE1logos", "di\xE1metro", "di\xE9resis", "dni", "dnt", "do", "doa", "doblada", "dobladas", "dobladillo", "doblado", "doblaje", "doblar", "doble", "doblegado", "doblegarse", "doblemente", "doc", "doce", "doceavo", "docena", "docenas", "docencia", "docente", "doctor", "doctora", "doctorado", "doctoral", "doctorales", "doctorarse", "doctrina", "documenta", "documentaci\xF3n", "documentados", "documental", "documentales", "documentalista", "documento", "documentos", "doe", "dogma", "doler", "dolido", "doli\xF3", "dolor", "dolores", "dolorosa", "dolorosamente", "dolorr", "dol\xEDa", "doma", "domador", "domiciliaci\xF3n", "domiciliar", "domiciliaria", "domicilio", "domicilios", "dominante", "dominantes", "dominar", "domingo", "domingos", "dominguero", "dominical", "dominicana", "dominio", "domin\xF3", "dom\xE9stica", "dom\xE9sticas", "dom\xE9stico", "dom\xE9sticos", "don", "donante", "donar", "donde", "dondequiera", "donju\xE1n", "dopaje", "doquier", "doquiera", "dor", "dorada", "dorado", "dorar", "dormida", "dormido", "dormidos", "dormir", "dormitorio", "dormitorios", "dorm\xED", "dorm\xEDa", "dorso", "dorsoalveolar", "dor\xE9", "dos", "doscientas", "doscientos", "dosificar", "dosis", "dotaci\xF3n", "dotado", "doy", "do\xF1a", "dptos", "dr", "dra", "drago", "drama", "dramatizaciones", "dramaturgo", "dramaturgos", "dram\xE1ticas", "dram\xE1tico", "dram\xE1ticos", "drenado", "drenar", "drogas", "droguer\xEDas", "dr\xE1sticamente", "dr\xE1sticas", "dr\xE1stico", "du", "duales", "dubitativa", "dubitativas", "dubitativos", "dubl\xEDn", "ducha", "ducharse", "duchas", "ducho", "ducir", "ductilidad", "duda", "dudado", "dudamos", "dudar", "dudas", "dude", "duden", "dudes", "dudo", "dudosa", "dudoso", "duele", "duelen", "duelo", "duerme", "duermo", "duero", "due\xF1o", "due\xF1os", "dul", "dulce", "dulces", "dulcificar", "dulzor", "dulz\xF3n", "duplicaci\xF3n", "duplicado", "duplicar", "duque", "duques", "dura", "duraci\xF3n", "duradera", "duradero", "duramente", "durante", "durar", "durar\xE1", "duras", "durativo", "durativos", "dureza", "durmiendo", "durmiente", "durmi\xF3", "duro", "duros", "dur\xE1n", "dur\xF3", "dvd", "d\xE1bamos", "d\xE1melas", "d\xE1rsele", "d\xE1rsena", "d\xE9", "d\xE9bil", "d\xE9biles", "d\xE9cada", "d\xE9cadas", "d\xE9cimo", "d\xE9ficit", "d\xE9ficits", "d\xE9jalo", "d\xE9jame", "d\xE9jeme", "d\xED", "d\xEDa", "d\xEDas", "d\xEDgame", "d\xEDgito", "d\xEDgrafo", "d\xEDgrafos", "d\xEDselo", "d\xF3", "d\xF3blalo", "d\xF3cil", "d\xF3lares", "d\xF3nde", "d\xF3oonde", "d\xF3rica", "d\xFActil", "d\xFAo", "d\xFAplex", "e", "ebanister\xEDa", "ebonita", "ebrio", "ebro", "ebullici\xF3n", "ecci\xF3n", "ecer", "echa", "echado", "echamos", "echar", "echaras", "echarme", "echaron", "echarse", "echas", "eche", "echegaray", "echen", "echo", "ech\xF3", "eclesi\xE1stico", "eclesi\xE1sticos", "eclipse", "eco", "ecograf\xEDa", "ecologista", "ecologistas", "ecolog\xEDa", "ecol\xF3gica", "ecol\xF3gicas", "ecol\xF3gico", "economato", "economista", "economizar", "econom\xEDa", "econ\xF3mica", "econ\xF3micamente", "econ\xF3micas", "econ\xF3mico", "econ\xF3micos", "ecos", "ecosistema", "ecoturismo", "ecuacionales", "ecuaci\xF3n", "ecuador", "ecuanimidad", "ecuatorial", "ecuestre", "ecu\xE1nime", "ed", "edad", "edades", "ediciones", "edici\xF3n", "edificable", "edificaci\xF3n", "edificar", "edificio", "edificios", "edil", "editar", "editor", "editores", "editorial", "editoriales", "edred\xF3n", "edu", "eduardo", "educa", "educaci\xF3n", "educadas", "educado", "educador", "educadores", "educar", "educarnos", "educarse", "educativa", "educativas", "educativo", "educativos", "edulcorantes", "ee", "eeee", "eei", "efectivamente", "efectivo", "efecto", "efectos", "efectuar", "efectuarse", "efem\xE9ride", "eficaces", "eficacia", "eficaz", "eficazmente", "eficiente", "eflexionar", "efluvio", "efusivamente", "ef\xEDmero", "ego", "ego\xEDsmo", "ego\xEDsta", "egresado", "eguna", "eh", "einte", "ej", "eje", "ejecuci\xF3n", "ejecutar", "ejecutiva", "ejecutivo", "ejemplar", "ejemplares", "ejemplificaciones", "ejemplificaci\xF3n", "ejemplifiquen", "ejemplo", "ejemplos", "ejercer", "ejercicio", "ejercicios", "ejercido", "ej\xE9rcito", "el", "elaboraci\xF3n", "elaborado", "elaborados", "elaborar", "elamigo", "elamor", "elasticidad", "elativo", "elativos", "elche", "elecciones", "elecci\xF3n", "electo", "electorado", "electoral", "electorales", "electores", "electricidad", "electricista", "electrodom\xE9stico", "electrodom\xE9sticos", "electr\xF3n", "electr\xF3nica", "electr\xF3nico", "electr\xF3nicos", "elefante", "elegancia", "elegante", "elegant\xEDsimo", "elegido", "elegir", "elemental", "elementales", "elemento", "elementos", "elena", "eleva", "elevaci\xF3n", "elevada", "elevados", "elevalunas", "elevar", "elevarse", "elhombrebueno", "elidido", "elidirse", "eliges", "eligieron", "elija", "eliminaban", "eliminaci\xF3n", "eliminar", "eliminarla", "eliminatoria", "elimine", "elipse", "elipsis", "elisa", "elisi\xF3n", "elite", "elixir", "ella", "ellar", "ellas", "ello", "ellos", "eln", "elo", "elogiar", "elogio", "elogios", "eloy", "elude", "eludir", "elvira", "elvis", "el\xE1stico", "el\xE9ctrica", "el\xE9ctricas", "el\xE9ctrico", "el\xEDptico", "em", "emanaci\xF3n", "emanar", "emancipaci\xF3n", "embajada", "embajador", "embajadora", "embajadores", "embalaje", "embalajes", "embalar", "embalse", "embarazada", "embarazadas", "embarazo", "embarcadero", "embarcar", "embargar", "embargo", "embarque", "embelesa", "embelesar", "embestir", "emblem\xE1ticos", "emborracharse", "emboscada", "embotellamiento", "embrague", "embriagador", "embutido", "emergencia", "emerger", "emigraci\xF3n", "emigrante", "emigrantes", "emilia", "emiliano", "emilio", "eminente", "emisiones", "emisi\xF3n", "emisor", "emisora", "emiten", "emitidos", "emitir", "emocionado", "emocional", "emocionales", "emocionante", "emociones", "emocion\xE9", "emoci\xF3n", "emolumento", "emotic\xF3n", "emotivos", "empadronado", "empadronamiento", "empadronarse", "empalagar", "empalagoso", "empanar", "empapada", "empapado", "empapar", "empapelado", "empapelar", "empap\xF3", "empaquetar", "emparentar", "empaste", "empatar", "empate", "empat\xEDa", "empa\xF1ado", "empecemos", "empec\xE9", "empec\xE9is", "empedernido", "empeoramiento", "empeorar", "empeore", "empeque\xF1ecer", "emperifollarse", "empezaba", "empezamos", "empezar", "empezaran", "empezaremos", "empezaron", "empezar\xE9", "empez\xF3", "empe\xF1arse", "empe\xF1as", "empe\xF1o", "empieces", "empieza", "empiezan", "empiezas", "empiezo", "empinada", "empinado", "empirismo", "emplazado", "emplazamiento", "emplea", "empleadas", "empleado", "empleados", "emplean", "empleando", "emplear", "emplearse", "emplee", "empleo", "empleos", "emple\xE1ndose", "empollar", "empoll\xF3n", "empotrado", "emprendedor", "emprender", "emprendidas", "empresa", "empresarial", "empresariales", "empresario", "empresarios", "empresas", "empujar", "empuj\xF3n", "emp\xE1tica", "emp\xEDricamente", "emp\xEDricas", "en", "enajenaci\xF3n", "enajenarse", "enaltecer", "enamora", "enamorada", "enamorado", "enamorados", "enamorarse", "enamoro", "enamor\xE9", "enano", "encabeza", "encabezada", "encabezados", "encabezamiento", "encabezamientos", "encabezan", "encabezar", "encadenamiento", "encajado", "encalar", "encallar", "encaminadas", "encaminado", "encaminar", "encamin\xE1bamos", "encanecer", "encanta", "encantaba", "encantada", "encantado", "encantador", "encantados", "encantan", "encantar", "encantar\xEDa", "encanto", "encarcelado", "encarecer", "encarecidamente", "encargado", "encargarte", "encargu\xE9", "encarnaci\xF3n", "encarrilar", "encauzar", "enca\xF1onar", "encendedor", "encendemos", "encender", "encenderse", "encendida", "encendidas", "encendido", "encendidos", "encerar", "encerrada", "encerrarse", "encharcado", "encharcar", "enchufar", "enchufe", "enciclopedia", "enciclopedias", "enciclop\xE9dicas", "enciclop\xE9dico", "enciende", "encima", "encim\xEDsima", "encinar", "enclenque", "enclisis", "encl\xEDtico", "encl\xEDticos", "encoge", "encoger", "encogerse", "encogido", "encogimiento", "encolar", "encomiable", "encomiar", "encontraba", "encontraban", "encontrado", "encontramos", "encontrar", "encontrarais", "encontraran", "encontrarme", "encontrarse", "encontrar\xE9", "encontr\xE1bamos", "encontr\xE1ndome", "encontr\xE1ramos", "encontr\xE9", "encontr\xF3", "encorvado", "encrespado", "encuadre", "encubierta", "encubiertas", "encubierto", "encubrir", "encuentra", "encuentran", "encuentras", "encuentre", "encuentres", "encuentro", "encuentros", "encuesta", "encuestados", "encuestas", "enc\xEDas", "endeble", "endecas\xEDlabo", "enderezar", "enderezarse", "endeudamiento", "endeudarse", "endof\xF3ricos", "end\xE9mico", "enemigo", "enemistad", "energ\xE9tica", "energ\xE9tico", "energ\xE9ticos", "energ\xEDa", "energ\xEDas", "enero", "enerva", "enervarse", "enervo", "enfada", "enfadado", "enfadados", "enfadad\xEDsimo", "enfadarme", "enfadarse", "enfadas", "enfades", "enfado", "enfad\xF3", "enfatizador", "enfatizar", "enferma", "enfermedad", "enfermedades", "enfermera", "enfermero", "enfermeros", "enfermizo", "enfermo", "enfermos", "enfervorizado", "enfocada", "enfocar", "enfoque", "enfrentados", "enfrentamiento", "enfrentamientos", "enfrentamos", "enfrentarnos", "enfrentarse", "enfrente", "enfriamiento", "enfriar", "enfriarse", "enfurecer", "enfurru\xF1ado", "enf\xE1tica", "enf\xE1ticas", "enf\xE1tico", "enf\xE1ticos", "enganchado", "enga\xF1an", "enga\xF1as", "enga\xF1en", "enga\xF1o", "enga\xF1osa", "enga\xF1oso", "engordado", "engordamos", "engordar", "engordar\xE1s", "engorroso", "engre\xEDdo", "engrosar", "engullir", "enh", "enhorabuena", "enigma", "enigm\xE1tico", "enjabonar", "enjuagarse", "enjuiciar", "enjundia", "enjuto", "enlace", "enlatado", "enlazar", "enmara\xF1ar", "enmarcadas", "enmarcar", "enmascarado", "enmendar", "enmienda", "enorgullece", "enorgullecerse", "enorme", "enormemente", "enormes", "enredar", "enredarse", "enrejado", "enrevesado", "enrique", "enriquecer", "enriquecimiento", "enriquezcan", "enrojecer", "enrojecidos", "ensaimada", "ensalada", "ensaladas", "ensaladera", "ensalzable", "ensalzar", "ensamblar", "ensanchar", "ensanche", "ensayar", "ensayista", "ensayo", "ensayos", "enseguida", "ense\xF1a", "ense\xF1ado", "ense\xF1anza", "ense\xF1anzas", "ense\xF1ar", "ense\xF1e", "ense\xF1\xE1rmelo", "ensombrecer", "ensordecedor", "ensordecida", "ensordecimiento", "ensortijado", "enso\xF1aci\xF3n", "ensuciar", "ensue\xF1o", "entablar", "ente", "entendemos", "entender", "entenderlo", "entendido", "entendimiento", "entend\xE9s", "entend\xED", "entera", "enterada", "enterado", "enteramente", "enteramos", "enterar", "enteraron", "enterarse", "enteraste", "entere", "enteres", "entereza", "entero", "enterramiento", "enterramientos", "enterrar", "enter\xE9", "enter\xF3", "entidad", "entidades", "entienda", "entiendan", "entiendas", "entiende", "entienden", "entiendes", "entiendo", "entierro", "entonacional", "entonaciones", "entonaci\xF3n", "entonado", "entonar", "entonativas", "entonativo", "entonativos", "entonces", "entorno", "entornos", "entra", "entrada", "entradas", "entradilla", "entrado", "entrando", "entrante", "entrantes", "entrar", "entrara", "entrarle", "entraron", "entras", "entra\xF1a", "entra\xF1able", "entra\xF1e", "entra\xF1en", "entre", "entrecortada", "entrecortado", "entrega", "entregado", "entregar", "entregarlo", "entregaron", "entregarse", "entregar\xE1", "entregar\xE9", "entregas", "entreguen", "entregu\xE9", "entreg\xF3", "entrem\xE9s", "entrenadas", "entrenado", "entrenador", "entrenados", "entrenamiento", "entrenamientos", "entrenar", "entresuelo", "entretanto", "entretenerse", "entretenido", "entretenimiento", "entretiene", "entrevista", "entrevistado", "entrevistador", "entrevistando", "entrevistar", "entrevistas", "entristece", "entristecerse", "entristec\xED", "entristezco", "entroncar", "entr\xF3", "entusiasma", "entusiasmaba", "entusiasmo", "entusiasta", "enumeraciones", "enumeraci\xF3n", "enumerando", "enumerar", "enumeraremos", "enumerativas", "enunciaci\xF3n", "enunciada", "enunciado", "enunciador", "enunciados", "enunciar", "enunciativa", "enunciativas", "envasado", "envase", "envases", "envejecen", "envejecer", "envejecido", "envejecimiento", "envenenamiento", "envergadura", "enviadas", "enviado", "enviar", "enviara", "enviaron", "enviarse", "enviarte", "enviase", "envidia", "envidiar", "envidias", "enviudar", "envi\xE1rmelo", "envi\xE1rtelo", "envoltorio", "envoltorios", "envolvente", "envolver", "envuelve", "env\xEDa", "env\xEDas", "env\xEDen", "env\xEDo", "enzarzarse", "en\xE9rgica", "en\xE9rgico", "en\xE9sima", "eo", "epicenos", "epidemia", "epidermis", "epigr\xE1ficos", "epil\xE9ptico", "episodio", "episodios", "epistolar", "epist\xE9micos", "epis\xF3dica", "ep\xEDgrafes", "ep\xEDlogo", "ep\xEDteto", "equilibrada", "equilibradas", "equilibrado", "equilibrados", "equilibrar", "equilibrio", "equilibrista", "equipaje", "equipamiento", "equiparaci\xF3n", "equipo", "equipos", "equitativa", "equitativamente", "equitativo", "equivale", "equivalencia", "equivalente", "equivalentes", "equivoca", "equivocaci\xF3n", "equivocada", "equivocado", "equivocar", "equivocara", "equivocarme", "equivocarnos", "equivocarse", "equivocarte", "equivocas", "equivocaste", "equivoco", "equ\xEDvoco", "er", "era", "eran", "eras", "erasmus", "ere", "eres", "ergon\xF3mica", "erguido", "erguirse", "erigirse", "erizada", "erizado", "ernesto", "ero", "erosi\xF3n", "erradicaci\xF3n", "erradicando", "erradicar", "errar", "errata", "erre", "error", "errores", "err\xF3neamente", "erta", "eructa", "erupci\xF3n", "es", "esa", "esas", "esbozar", "esbozo", "escabeche", "escala", "escalada", "escalador", "escalar", "escalares", "escalas", "escaldar", "escalera", "escaleras", "escalofr\xEDo", "escalofr\xEDos", "escal\xF3n", "escampar", "escanciar", "escapada", "escapado", "escapar", "escaparate", "escaparates", "escarpada", "escarpado", "escasa", "escasamente", "escasear", "escasez", "escaso", "escasos", "escatol\xF3gicos", "escayola", "escayolada", "escayolar", "esca\xF1o", "escena", "escenario", "escenarios", "escenas", "escenificar", "escipiones", "esclarecer", "escoba", "escocer", "escoger", "escoges", "escolar", "escolares", "escolaridad", "escollo", "esconde", "esconder", "escondido", "escondite", "escorial", "escotado", "escote", "escozor", "escriba", "escribe", "escriben", "escribes", "escribierais", "escribimos", "escribir", "escribirla", "escribirlas", "escribirle", "escribirlo", "escribirse", "escribir\xE1", "escribi\xE9ndole", "escribi\xE9ndolo", "escribi\xE9ndoselo", "escribi\xF3", "escribo", "escrib\xED", "escrib\xEDrselo", "escrita", "escritas", "escrito", "escritor", "escritores", "escritorio", "escritos", "escritura", "escrituras", "escrupulosidad", "escrupuloso", "escr\xEDbelo", "escr\xEDbeme", "escr\xEDbesela", "escr\xFApulos", "escucha", "escuchamos", "escuchan", "escuchando", "escuchar", "escucharme", "escuchar\xE9", "escucho", "escuch\xE1ndola", "escuela", "escuelas", "escuetamente", "esculpir", "escultor", "escultores", "escultura", "esculturas", "escult\xF3rica", "escult\xF3ricas", "escult\xF3rico", "escupir", "escurridor", "escurrir", "escu\xE1lido", "esc\xE1ndalo", "esc\xE1ner", "esc\xE9nicas", "esdr\xFAjula", "esdr\xFAjulas", "esdr\xFAjulos", "ese", "esencia", "esencial", "esenciales", "esencialmente", "eses", "esfera", "esforzando", "esforzaras", "esforzarse", "esfuerza", "esfuerzo", "esfumarse", "esf\xE9rica", "esf\xE9rico", "esgrimir", "esguince", "eslogan", "esmerada", "esmerado", "esmeralda", "esmero", "eso", "esos", "espabilado", "espaciados", "espacial", "espaciarse", "espacio", "espacios", "espaciosa", "espacioso", "espada", "espadas", "espaguetis", "espalda", "espaldas", "espanta", "espantarse", "espanto", "espantoso", "esparadrapo", "esparcimiento", "espartana", "espasmos", "espa\xF1a", "espa\xF1as", "espa\xF1ol", "espa\xF1ola", "espa\xF1olas", "espa\xF1oles", "espa\xF1olidad", "especial", "especiales", "especialidad", "especialista", "especialistas", "especializaci\xF3n", "especializada", "especializadas", "especializado", "especializados", "especialmente", "especiar", "especias", "especie", "especies", "especificaciones", "especificaci\xF3n", "especificadores", "especificar", "especificativa", "especificativas", "especificativos", "especificidad", "espectacular", "espectador", "espectadores", "espect\xE1culo", "espect\xE1culos", "especulaci\xF3n", "especular", "espec\xEDfica", "espec\xEDficamente", "espec\xEDficas", "espec\xEDfico", "espec\xEDficos", "espec\xEDmenes", "espejismo", "espejo", "espejos", "espera", "esperaba", "esperado", "esperamos", "esperan", "esperando", "esperanza", "esperanzas", "esperar", "esperaremos", "esperas", "espere", "esperemos", "esperes", "espermatozoide", "espero", "esperpento", "esper\xE1bamos", "esper\xE9", "espesa", "espesar", "espeso", "espesor", "espesura", "espetable", "espiar", "espinacas", "espinillas", "espinoso", "espiral", "espirar", "espiritual", "espirituales", "espiritualidad", "esplendor", "espl\xE9ndido", "esponja", "esponjosidad", "esponjoso", "espont\xE1nea", "espont\xE1neas", "espont\xE1neo", "espor\xE1dica", "espor\xE1dicamente", "espor\xE1dico", "esposa", "esposo", "espuma", "espumadera", "espumoso", "esp\xE1rragos", "esp\xE9cimen", "esp\xEDritu", "esquela", "esqueleto", "esquel\xE9tico", "esquema", "esquemas", "esquiar", "esquilar", "esquina", "esquivel", "esquizofrenia", "esqu\xED", "esqu\xEDes", "esqu\xEDs", "esta", "estaba", "estaban", "estabas", "estabilidad", "estabilizar", "estable", "establece", "establecen", "establecer", "establecida", "establecido", "establecimiento", "establecimientos", "establezca", "establo", "estacionado", "estacionamiento", "estaciones", "estaci\xF3n", "estadio", "estadios", "estado", "estados", "estad\xEDstica", "estad\xEDsticas", "estad\xEDsticos", "estafeta", "estallaba", "estallar", "estallido", "estall\xF3", "estambre", "estamento", "estamos", "estampado", "estancia", "estancias", "estanco", "estancos", "estandarizar", "estando", "estanque", "estante", "estanter\xEDa", "estar", "estaremos", "estarindicado", "estarte", "estar\xE1", "estar\xE1n", "estar\xE1s", "estar\xE9", "estar\xEDa", "estar\xEDamos", "estar\xEDan", "estar\xEDas", "estas", "estatal", "estatales", "estativo", "estativos", "estatua", "estatuas", "estatura", "estatuto", "estatutos", "este", "esteban", "esteee", "estelar", "estemos", "estepa", "ester", "estereotipadas", "estereotipo", "estereotipos", "esterilizaci\xF3n", "esterilizar", "estero", "estigma", "estigmatizantes", "estilo", "estilogr\xE1fica", "estilos", "estil\xEDstico", "estima", "estimaba", "estimaci\xF3n", "estimada", "estimado", "estimar", "estimaron", "estimas", "estimo", "estimulante", "estimulantes", "estimular", "estipulada", "estiradas", "estirado", "estirar", "estirpes", "estival", "esto", "estofar", "estoico", "estor", "estorbar", "estorbo", "estornudar", "estos", "estoy", "estrafalario", "estrategia", "estrategias", "estrato", "estratos", "estratosfera", "estrat\xE9gica", "estrat\xE9gicas", "estrat\xE9gico", "estrecha", "estrechamente", "estrechamiento", "estrechar", "estrechez", "estrecho", "estrechos", "estrella", "estrellado", "estrellar", "estrellarse", "estrellas", "estrell\xF3", "estremecerse", "estremeciera", "estrenar", "estreno", "estren\xF3", "estresada", "estresado", "estresad\xEDsima", "estresarse", "estriada", "estriado", "estribillo", "estribor", "estribos", "estricta", "estricto", "estridente", "estropajo", "estropeado", "estropear", "estropearse", "estrope\xF3", "estructura", "estructuraci\xF3n", "estructuradas", "estructurador", "estructuradores", "estructurados", "estructural", "estructuras", "estruendo", "estrujarse", "estr\xE9pito", "estr\xE9s", "estu", "estuario", "estuarios", "estuche", "estudi", "estudia", "estudiadas", "estudiado", "estudiamos", "estudian", "estudiando", "estudianta", "estudiante", "estudiantes", "estudiar", "estudiar\xE9", "estudias", "estudies", "estudio", "estudios", "estudiosas", "estudioso", "estudiosos", "estudis", "estudi\xE1is", "estudi\xE9", "estudi\xE9is", "estupenda", "estupendamente", "estupendas", "estupendo", "estupendos", "estupidez", "estuve", "estuviera", "estuvieran", "estuvieras", "estuvieron", "estuvimos", "estuviste", "estuvo", "est\xE1", "est\xE1bamos", "est\xE1is", "est\xE1n", "est\xE1ndar", "est\xE1ndares", "est\xE1s", "est\xE1tica", "est\xE1tico", "est\xE9", "est\xE9is", "est\xE9n", "est\xE9ril", "est\xE9s", "est\xE9tica", "est\xE9ticas", "est\xE9tico", "est\xE9ticos", "est\xEDmulo", "est\xEDmulos", "est\xF3mago", "etapa", "etapas", "etc", "etc\xE9tera", "eternamente", "eternidad", "eterniza", "eternizar", "eterno", "etimolog\xEDa", "etiqueta", "etiquetados", "etiquetar", "etiquetas", "etnias", "etnicidad", "etnoc\xE9ntricas", "etrusco", "ett", "et\xE9reo", "eu", "eufemismos", "euforia", "euf\xF3rico", "eugenio", "euro", "euromed", "europa", "europea", "europeas", "europeo", "europeos", "euros", "euskaltzaindia", "eva", "evacuar", "evadir", "evaluaci\xF3n", "evaluar", "evaluar\xE1n", "evaluativo", "evaluativos", "eval\xFAe", "eval\xFAen", "evangelio", "evang\xE9lica", "evaporaci\xF3n", "evaporar", "evaporarse", "eve", "eventivo", "eventivos", "evento", "eventos", "eventual", "eventuales", "eventualidad", "eventualmente", "evi", "evidencia", "evidenciales", "evidenciar", "evidenciar\xE1", "evidente", "evidentemente", "evidentes", "evitable", "evitablemente", "evitaci\xF3n", "evitan", "evitar", "evitarlos", "evitarnos", "evo", "evocaci\xF3n", "evocar", "evolucionar", "evoluci\xF3n", "evolutivo", "ex", "exacta", "exactamente", "exactas", "exactitud", "exacto", "exageraci\xF3n", "exagerada", "exageradamente", "exagerado", "exagerar", "examen", "examinado", "examinar", "examinaremos", "examinarse", "exaspera", "exasperarse", "exaspero", "exasper\xF3", "excarcelar", "excedencia", "exceder", "excelencia", "excelente", "excelentes", "excepcional", "excepcionalmente", "excepciones", "excepci\xF3n", "excepto", "exceptuamos", "exceptuando", "except\xFAa", "excesiva", "excesivamente", "excesivo", "exceso", "exclamaciones", "exclamaci\xF3n", "exclamando", "exclamar", "exclamativa", "exclamativas", "exclamativo", "exclamativos", "excluida", "excluimos", "excluir", "exclusiva", "exclusividad", "exclusivo", "exclusivos", "exclusi\xF3n", "excluye", "excluyentes", "exculpar", "excursiones", "excursi\xF3n", "excusa", "excusar", "excusas", "exc\xE9ntrico", "execrable", "exenciones", "exequias", "exfoliar", "exhalar", "exhaustiva", "exhaustivo", "exhausto", "exhiben", "exhibici\xF3n", "exhibir", "exhortaci\xF3n", "exhortar", "exhortativa", "exhortativas", "exhortativo", "exige", "exigen", "exigencia", "exigencias", "exigidas", "exigidos", "exigirnos", "exilio", "exilios", "exista", "existe", "existen", "existencia", "existencial", "existencialismo", "existente", "existentes", "existido", "existir", "existo", "exist\xEDa", "exist\xEDan", "exitoso", "exotismo", "expandirse", "expansionismo", "expansi\xF3n", "expatriar", "expectativas", "expedici\xF3n", "expedientado", "expediente", "expedientes", "expedir", "expendedoras", "experiencia", "experiencias", "experimenta", "experimentaci\xF3n", "experimentado", "experimentador", "experimentados", "experimental", "experimentales", "experimentalismo", "experimentan", "experimentante", "experimentar", "experimentarse", "experimenten", "experimento", "experimentos", "experto", "expertos", "expira", "expiraci\xF3n", "expirar", "explanada", "expletivo", "explica", "explicaciones", "explicaci\xF3n", "explicado", "explicar", "explicarle", "explicat", "explicativa", "explicativas", "explicativo", "explicativos", "explicitar", "explico", "explic\xE1ndomelo", "explic\xF3", "expliqu\xE9", "exploraci\xF3n", "explorador", "explorar", "explosivo", "explosi\xF3n", "explota", "explotaci\xF3n", "explotar", "expl\xEDcalo", "expl\xEDcita", "expl\xEDcitamente", "expl\xEDcitas", "expl\xEDcito", "expl\xEDcitos", "expone", "exponemos", "exponente", "exponentes", "exponer", "exponerse", "expongan", "exportaciones", "exportaci\xF3n", "exportador", "exportar", "exposiciones", "exposici\xF3n", "expositiva", "expositivo", "expresa", "expresada", "expresado", "expresamos", "expresan", "expresar", "expresarle", "expresarse", "expresiones", "expresionista", "expresivo", "expresivos", "expresi\xF3n", "expreso", "expres\xE9", "exprimidor", "exprimir", "expropiaci\xF3n", "expropiar", "expuesta", "expuestas", "expuesto", "expuestos", "expulsar", "expulsen", "expulsi\xF3n", "exquisita", "exquisito", "exquisitos", "extender", "extendernos", "extenderse", "extendida", "extendido", "extendi\xF3", "extensa", "extensas", "extensible", "extensi\xF3n", "extenso", "extensos", "extenuante", "exterior", "exteriores", "exteriorismo", "exteriorizar", "exterminar", "externa", "externas", "externos", "extienda", "extiende", "extinci\xF3n", "extinguir", "extinguirse", "extingui\xF3", "extorsi\xF3n", "extra", "extracto", "extractos", "extraer", "extraescolares", "extrafino", "extraling\xFC\xEDstica", "extraling\xFC\xEDsticas", "extraling\xFC\xEDstico", "extranjera", "extranjeras", "extranjerismos", "extranjero", "extranjeros", "extranjer\xEDa", "extraoficial", "extraordinaria", "extraordinariamente", "extraordinario", "extrapolar", "extraterrestre", "extravertido", "extraviar", "extra\xEDda", "extra\xF1a", "extra\xF1ado", "extra\xF1as", "extra\xF1eza", "extra\xF1o", "extra\xF1os", "extrema", "extremas", "extremaunci\xF3n", "extremidad", "extremo", "extremos", "exuberante", "exultante", "ex\xE1menes", "ex\xF3tica", "ex\xF3tico", "ey", "ez", "e\xEDsmo", "e\xF3lica", "f", "fa", "fabada", "fabricaci\xF3n", "fabricado", "fabricante", "fabricar", "fabuloso", "facciones", "fachada", "fachadas", "facial", "facilidad", "facilitan", "facilitar", "facilitarle", "facilitar\xE1", "facilite", "faciliten", "facilit\xF3", "factible", "factivo", "factivos", "factor", "factores", "factor\xEDa", "factual", "factuales", "factura", "facturaci\xF3n", "facturar", "facultad", "facultativa", "facultativas", "facultativo", "facultativos", "faena", "fahrenheit", "fajitas", "falda", "falla", "fallamos", "fallar", "fallas", "fallecer", "fallecido", "fallecimiento", "fallido", "fallidos", "fallo", "fallos", "falsa", "falsas", "falsificaci\xF3n", "falsificar", "falso", "falsos", "falta", "faltaba", "faltan", "faltar", "faltaron", "faltar\xEDa", "faltas", "falte", "falt\xF3", "fama", "familia", "familiar", "familiares", "familiarizada", "familiarizado", "familiarizarse", "familias", "famosa", "famosas", "famoso", "famosos", "fam\xE9lico", "fan", "fanatismo", "fandangos", "fanfarr\xF3n", "fantasear", "fantasma", "fantasmag\xF3rico", "fantasmas", "fantas\xEDa", "fant\xE1stica", "fant\xE1stico", "fant\xE1sticos", "farc", "faringitis", "farmacia", "farmacias", "faro", "farola", "farra", "farragoso", "fascina", "fascinaci\xF3n", "fascinado", "fascinados", "fascinante", "fascinar", "fascismo", "fasc\xEDculos", "fase", "fases", "fastidia", "fastidiarla", "fastidiarse", "fastidio", "fastidi\xF3", "fatal", "fatalidad", "fatiga", "fatigado", "fatigarse", "fatigo", "fauces", "fauna", "favor", "favorable", "favorablemente", "favorables", "favorece", "favorecen", "favorecer", "favores", "favorezcan", "favorita", "favorito", "fax", "faxes", "faz", "fco", "fdi", "fdo", "fe", "fea", "febrero", "fec", "fecha", "fechar", "fechas", "fecundaci\xF3n", "federaciones", "federaci\xF3n", "federal", "federales", "federarse", "federico", "fehaciente", "felhem", "felices", "felicidad", "felicidades", "felicitaciones", "felicitaci\xF3n", "felicitar", "felino", "felipe", "feliz", "felpa", "felpudo", "femeninas", "femenino", "femeninos", "feministas", "fenecer", "fenicias", "fenicios", "fenomenal", "fen\xF3meno", "fen\xF3menos", "feo", "feria", "ferias", "fermentar", "ferm\xEDn", "fernando", "fern\xE1ndez", "feroz", "ferrocarril", "ferrocarriles", "ferrol", "ferroviarias", "ferroviario", "ferry", "fertilizante", "fertilizar", "fervientemente", "fervor", "festejar", "festejo", "festival", "festivales", "festividad", "festividades", "festivo", "fest\xEDn", "fetichismo", "fetidez", "ff", "ffcc", "fiabilidad", "fiable", "fianza", "fiap", "fiar", "fiasco", "fibra", "ficci\xF3n", "ficha", "fichado", "fichar", "ficticia", "ficticias", "ficticio", "fidedigna", "fidelidad", "fidelizar", "fideo", "fiebre", "fiel", "fieles", "fiera", "fieras", "fierro", "fiesta", "fiestas", "figura", "figurado", "figurar", "figurarse", "figuras", "figurativo", "figuren", "figuritas", "fija", "fijador", "fijados", "fijamente", "fijar", "fijara", "fijaras", "fijarse", "fijas", "fijen", "fijo", "fijos", "fila", "filas", "filatelia", "filat\xE9lico", "filete", "filetes", "filial", "film", "filmar", "filmoteca", "films", "filo", "filolog\xEDa", "filosof\xEDa", "filos\xF3fica", "filos\xF3fico", "filtraba", "filtradas", "filtrar", "filtro", "filtros", "fil\xF3n", "fil\xF3sofo", "fin", "fina", "final", "finales", "finalidad", "finaliza", "finalizaci\xF3n", "finalizada", "finalizado", "finalizar", "finalmente", "financiaci\xF3n", "financiar", "financiera", "financiero", "finanzas", "finca", "fines", "fing\xED", "finiquitar", "finiquito", "finisterre", "finito", "fino", "finos", "fiordo", "fipresci", "firma", "firmada", "firmado", "firmamento", "firmante", "firmantes", "firmar", "firmaron", "firmas", "firme", "firmemente", "firmes", "firmeza", "fiscal", "fiscales", "fisiolog\xEDa", "fisiol\xF3gicas", "fisioterapia", "fisonom\xEDa", "fl", "fla", "flacas", "flacidez", "flaco", "flagrante", "flamenco", "flan", "flash", "fleco", "flequillo", "flexibilice", "flexibilidad", "flexible", "flexionada", "flexionadas", "flexionado", "flexi\xF3n", "flojo", "flor", "flora", "floraci\xF3n", "florales", "floreado", "florecer", "florencia", "florero", "flores", "florido", "flota", "flotaban", "flotador", "flote", "fluctuaciones", "fluctuaci\xF3n", "fluctuante", "fluctuantes", "fluida", "fluidez", "fluido", "fluir", "flujo", "fluorescente", "fluvial", "fluviales", "fl\xE1cido", "fm", "fmi", "fo", "fobia", "focal", "focales", "focalizaci\xF3n", "focalizado", "focalizadores", "foco", "fofo", "folclore", "folcl\xF3rica", "folcl\xF3ricas", "folio", "follaje", "folleto", "folletos", "fomenta", "fomentan", "fomentar", "fomento", "fonaci\xF3n", "fondas", "fondo", "fondos", "fonema", "fonemas", "fonem\xE1tico", "fonol\xF3gica", "fonol\xF3gico", "fonoteca", "fontaner\xEDa", "fon\xE9tica", "fon\xE9ticas", "fon\xE9tico", "fon\xE9ticos", "foral", "forestal", "forestales", "forjar", "forma", "formaban", "formaci\xF3n", "formada", "formadas", "formado", "formador", "formados", "formal", "formales", "formalidad", "formalidades", "formalizar", "forman", "formante", "formar", "formarse", "formas", "formatear", "formativa", "formativo", "formativos", "formato", "formatos", "forme", "formulaci\xF3n", "formuladas", "formulados", "formular", "formularios", "formularse", "foro", "forofo", "foros", "forrado", "forrar", "forrarse", "forro", "fortalecer", "fortaleza", "fortuito", "fortuna", "forzadas", "forzosamente", "forzoso", "fosa", "fosas", "foto", "fotocopia", "fotocopiadora", "fotocopiar", "fotocopias", "fotografiar", "fotograf\xEDa", "fotograf\xEDas", "fotograma", "fotogramas", "fotogr\xE1ficamente", "fotogr\xE1ficas", "fotogr\xE1fico", "fotogr\xE1ficos", "fotog\xE9nico", "fotoperiodismo", "fotopress", "fotos", "fotos\xEDntesis", "fotovoltaico", "fot\xF3grafo", "fot\xF3grafos", "fpi", "fr", "frac", "fracasar", "fracaso", "fracasos", "fraccional", "fraccionar", "fracciones", "fracci\xF3n", "fractura", "frag", "fragancia", "fragata", "fragilidad", "fragmentar", "fragmentario", "fragmento", "fragmentos", "fraguar", "frak", "frambuesa", "fran", "franca", "francamente", "francesa", "franceses", "francia", "francisco", "francisquita", "franco", "franc\xE9s", "franja", "frankfurt", "franquear", "franqueo", "franquicia", "franquismo", "franquista", "frascos", "frase", "fraseol\xF3gicos", "frases", "fraternal", "fraternidad", "fraude", "frecuencia", "frecuentar", "frecuente", "frecuentemente", "frecuentes", "fregadero", "fregar", "fregona", "freidora", "freire", "frenar", "frenazo", "freno", "frenos", "frente", "fren\xE9tico", "fresa", "fresas", "fresca", "frescas", "fresco", "frescor", "frescura", "fresneda", "fre\xEDr", "frialdad", "fricaci\xF3n", "fricativa", "fricativas", "fricativizaci\xF3n", "fricativo", "fricci\xF3n", "frida", "friegues", "frigor\xEDfico", "frijoles", "fritas", "frito", "frivolidad", "frondosa", "frondoso", "frontalmente", "frontera", "front\xF3n", "frotar", "fruct\xEDfero", "frugal", "fruncido", "fruncir", "frustraci\xF3n", "frustrado", "frustrados", "fruta", "frutal", "frutales", "frutas", "frutero", "fruter\xEDa", "fruter\xEDas", "fruto", "frutos", "fr\xE1gil", "fr\xEDa", "fr\xEDalas", "fr\xEDamente", "fr\xEDas", "fr\xEDen", "fr\xEDo", "fr\xEDvolo", "fue", "fuego", "fuegos", "fuente", "fuentes", "fuera", "fueran", "fueras", "fuere", "fueres", "fueron", "fuerte", "fuertes", "fuerza", "fuerzas", "fuga", "fugaz", "fui", "fuimos", "fuiste", "fuisteis", "fulano", "fuma", "fumado", "fumador", "fumadores", "fumar", "fumen", "fumes", "fumigado", "fumigar", "fumo", "funciona", "funcional", "funcionales", "funcionalidad", "funcionamiento", "funcionan", "funcionar", "funcionario", "funcionar\xE1", "funcione", "funciones", "funci\xF3n", "fundaciones", "fundaci\xF3n", "fundado", "fundamentado", "fundamental", "fundamentales", "fundamentalismo", "fundamentalmente", "fundamento", "fundar", "fundici\xF3n", "fundir", "fundirse", "fundi\xF3", "fundus", "funeral", "funeraria", "funiculares", "furgoneta", "furia", "furioso", "furios\xEDsimo", "fusa", "fuselaje", "fusible", "fusil", "fusi\xF3n", "fut", "futbol", "futura", "futuras", "future", "futurista", "futuro", "futuros", "fu\xE9ramos", "f\xE1brica", "f\xE1bula", "f\xE1cil", "f\xE1ciles", "f\xE1cilmente", "f\xE1tica", "f\xE1tico", "f\xE1ticos", "f\xE1tima", "f\xE9rrea", "f\xE9rreo", "f\xE9rreos", "f\xE9rtil", "f\xE9tido", "f\xEDa", "f\xEDate", "f\xEDes", "f\xEDjate", "f\xEDjense", "f\xEDo", "f\xEDsica", "f\xEDsicas", "f\xEDsico", "f\xEDsicodeportivas", "f\xEDsicos", "f\xF3nica", "f\xF3nicas", "f\xF3nico", "f\xF3nicos", "f\xF3rmula", "f\xF3rmulas", "f\xFAnebre", "f\xFAnebres", "f\xFAtbol", "f\xFAtil", "g", "ga", "gabriel", "gabriela", "gaceta", "gades", "gafas", "gafe", "gajo", "gala", "galante", "galanter\xEDa", "galardonado", "galatea", "galaxia", "gald\xF3s", "galega", "galerista", "galer\xEDa", "galicia", "gallegos", "galletas", "gallina", "gallinas", "gallinero", "gallo", "galopar", "gal\xE1ctico", "gal\xE1n", "gal\xE1pagos", "gama", "gambas", "gana", "ganadero", "ganader\xEDa", "ganado", "ganador", "ganadora", "ganadores", "ganancias", "ganando", "ganar", "ganarse", "ganar\xE1", "ganas", "gandul", "gane", "ganen", "ganga", "gano", "ganso", "garaje", "garajes", "garantizar", "garantizo", "garant\xEDa", "garant\xEDas", "garbanzos", "garbo", "garci", "garc\xEDa", "gardel", "garganta", "gargantilla", "garra", "garrafal", "gas", "gasa", "gaseoso", "gases", "gasoil", "gasolina", "gasolinera", "gasolineras", "gastado", "gastar", "gastarse", "gastar\xE1", "gasteiz", "gasto", "gastos", "gastronom\xEDa", "gastron\xF3micos", "gato", "gatos", "gauchesco", "gauchos", "gaudeamus", "gaula", "gaviota", "gay", "gazapo", "gazpacho", "gb", "ge", "gel", "gemelos", "gen", "genario", "gencia", "geneal\xF3gico", "genera", "generacional", "generacionales", "generaciones", "generaci\xF3n", "generadas", "generados", "general", "generales", "generalidad", "generalitat", "generalizaciones", "generalizaci\xF3n", "generalizada", "generalizadas", "generalizado", "generalizador", "generalizar", "generalmente", "generan", "generar", "genere", "generen", "generosamente", "generosidad", "generoso", "gener\xF3", "genial", "geniales", "genio", "genios", "genitivo", "gente", "gentes", "gentilicios", "gentle", "gen\xE9rica", "gen\xE9rico", "gen\xE9ricos", "gen\xE9tica", "gen\xE9ticas", "gen\xE9tico", "geo", "geof\xEDsica", "geograf\xEDa", "geogr\xE1fica", "geogr\xE1ficamente", "geogr\xE1ficas", "geogr\xE1fico", "geogr\xE1ficos", "geometr\xEDa", "geom\xE9trica", "geom\xE9tricas", "geom\xE9trico", "ger", "gerar", "gerencia", "gerente", "geriatr\xEDa", "geri\xE1trico", "germen", "germinar", "germ\xE1nica", "gerundio", "gerundios", "gesimal", "gest", "gesticular", "gestionadas", "gestionar", "gesti\xF3n", "gesto", "gestor\xEDa", "gestos", "gestual", "getxo", "gi", "gia", "gibraltar", "gigante", "gigantes", "gigantesco", "gij\xF3n", "gimnasia", "gimnasio", "gimnasios", "ginal", "ginastera", "ginebra", "ginecol\xF3gica", "ginecol\xF3gicas", "ginecol\xF3gico", "ginec\xF3logo", "ginoso", "gio", "gional", "gionario", "gioso", "gir", "gira", "girar", "girasol", "giratoria", "giratorio", "giro", "gironella", "giros", "gitana", "gitanos", "gi\xE9nico", "gi\xF3n", "gl", "glacial", "glaciares", "gli", "global", "globales", "globalizaci\xF3n", "globalizadora", "globo", "glosarios", "glotal", "glotis", "glot\xF3n", "gl\xE1ndula", "gl\xF3bulo", "gn", "gnomo", "gn\xF3mico", "gn\xF3stico", "go", "goaem", "goazan", "gobernador", "gobernadora", "gobernar", "gobierno", "gobiernos", "goce", "gogia", "gog\xEDa", "gol", "goleador", "golear", "goles", "goleta", "golf", "golfo", "golfos", "golosinas", "golp", "golpe", "golpear", "golpes", "goma", "gomina", "gonzalo", "gonz\xE1lez", "good", "gorda", "gordas", "gordinfl\xF3n", "gordo", "gorra", "gorro", "gos", "gosam", "gota", "gotas", "gotear", "goteo", "gotera", "goya", "goza", "gozada", "gozar", "gozo", "gr", "gra", "grabaciones", "grabaci\xF3n", "grabado", "grabador", "grabadora", "grabados", "grabar", "grabaron", "grabarse", "gracia", "gracias", "graciosa", "gracioso", "graciosos", "grada", "gradaci\xF3n", "gradativos", "grado", "grados", "graduaci\xF3n", "graduadas", "graduado", "gradual", "gradualmente", "graf\xEDa", "graf\xEDas", "gramatical", "gramaticales", "gramo", "gramos", "gram\xE1tica", "gram\xE1ticas", "gran", "granada", "grande", "grandes", "grandeza", "grandona", "grandote", "grand\xF3n", "granel", "granero", "granito", "granizada", "granizar", "granizo", "granja", "granjas", "grano", "granos", "granulado", "granulosa", "grapa", "grapadora", "grasa", "grasas", "graso", "gratas", "gratificaci\xF3n", "gratificante", "gratis", "gratitud", "grato", "gratuidad", "gratuita", "gratuitamente", "gratuito", "grave", "gravedad", "gravemente", "graves", "grav\xEDsimos", "greco", "grelo", "gres", "griega", "griego", "griegos", "grieta", "grifo", "grima", "gripe", "gris", "grises", "gris\xE1ceo", "grita", "gritaba", "gritar", "gritaron", "grite", "griten", "griter\xEDo", "grites", "grito", "gritos", "grit\xE9", "grit\xF3", "grosella", "grosero", "groser\xEDa", "grosor", "grotesco", "grovas", "gruesa", "grueso", "gruesos", "grul", "grumosa", "grumoso", "grupo", "grupos", "gr\xE1fica", "gr\xE1ficas", "gr\xE1fico", "gr\xE1ficos", "gr\xFAa", "gr\xFAas", "gs", "gu", "gua", "guaca", "guadalajara", "guaira", "guair\xE1", "guanajuato", "guante", "guantes", "guapa", "guapetona", "guapo", "guap\xEDsimo", "guaran\xEDes", "guarapo", "guarda", "guardada", "guardado", "guardaespaldas", "guardameta", "guardamos", "guardar", "guardara", "guardarropa", "guardas", "guarden", "guarder\xEDa", "guardes", "guardia", "guardo", "guarida", "guarismo", "guarro", "guas\xF3n", "guatemala", "guaynabo", "gubernamental", "gubernamentales", "guernica", "guerra", "guerras", "guerrear", "guerrero", "guerreros", "guerrillas", "guerrillero", "guerrilleros", "guggenheim", "guiadas", "guiar", "guillermo", "guimar\xE1n", "guion", "guiones", "guionista", "guionistas", "guirnalda", "guisada", "guisado", "guisantes", "guitarra", "guitarrista", "gui\xF1ar", "gui\xF1o", "gui\xF1ol", "gui\xF3n", "gur\xFA", "gusanillo", "gusano", "gusta", "gustaba", "gustado", "gustan", "gustar", "gustara", "gustar\xEDa", "gustas", "guste", "gustillo", "gusto", "gustos", "gust\xF3", "gutenberg", "gutural", "gu\xEDa", "gu\xEDas", "gw", "g\xE1stricos", "g\xE9lico", "g\xE9lida", "g\xE9lido", "g\xE9neo", "g\xE9nero", "g\xE9neros", "g\xE9nico", "g\xE9nito", "g\xE9rmenes", "g\xE9simo", "g\xE9tico", "g\xEDneo", "g\xEDrico", "g\xF3mez", "g\xF3ngora", "g\xF3tico", "g\xFAn", "g\xFC", "g\xFCe", "g\xFCell", "g\xFCi", "g\xFCicho", "h", "ha", "habana", "haber", "haberle", "haberlo", "haberme", "habernos", "haberte", "habichuela", "habida", "habido", "habiendo", "habilidad", "habilidades", "habilitar", "habitable", "habitaciones", "habitaci\xF3n", "habitante", "habitantes", "habitar", "habitual", "habituales", "habitualmente", "habit\xE1culo", "habit\xE1culos", "habla", "hablaba", "hablada", "hablado", "hablador", "habladur\xEDa", "hablamos", "hablan", "hablando", "hablante", "hablantes", "hablar", "hablara", "hablaras", "hablaremos", "hablarles", "hablarme", "hablaron", "hablarte", "hablar\xE1", "hablar\xE9", "hablar\xEDa", "hablas", "hablaste", "hable", "hablemos", "hablen", "hables", "hablo", "habl\xE1bamos", "habl\xE9", "habl\xE9is", "habl\xF3", "habr\xE1", "habr\xE1n", "habr\xE1s", "habr\xE9", "habr\xEDa", "habr\xEDais", "habr\xEDamos", "habr\xEDan", "habr\xEDas", "hab\xE9is", "hab\xEDa", "hab\xEDamos", "hab\xEDan", "hab\xEDas", "hace", "hacemos", "hacen", "hacer", "hacerla", "hacerle", "hacerles", "hacerlo", "hacerlos", "hacerme", "hacerse", "hacerte", "haces", "hacha", "hacia", "hacienda", "haciendo", "haci\xE9ndole", "hac\xE9s", "hac\xEDa", "hac\xEDamos", "hac\xEDan", "hado", "haga", "hagamos", "hagan", "hagas", "hagio", "hago", "hag\xE1is", "hala", "halagar", "halago", "halagos", "halag\xFCe\xF1o", "halffter", "halla", "halladas", "hallar", "hallarse", "hallazgos", "halloween", "halo", "hamaca", "hambre", "hambriento", "hamburguesa", "hamburgueser\xEDa", "han", "harag\xE1n", "harapiento", "haremos", "harina", "harta", "hartar", "harto", "hartos", "hartzenbusch", "hart\xF3", "har\xE1", "har\xE1s", "har\xE9", "har\xEDa", "har\xEDas", "has", "hasalido", "hasta", "hastiar", "hast\xEDo", "haw\xE1i", "hay", "haya", "hayamos", "hayan", "hayas", "hay\xE1is", "haz", "haza\xF1a", "hazle", "hazlo", "hazme", "he", "hebilla", "hecha", "hechas", "hechizar", "hecho", "hechos", "hecto", "hect\xE1rea", "hect\xE1reas", "hect\xF3metro", "hediondo", "hedor", "hegemon\xEDa", "helada", "helado", "helados", "helar", "helarse", "helic\xF3ptero", "helio", "helipuerto", "hell\xEDn", "hel\xF3", "hema", "hemato", "hematoma", "hembra", "hemi", "hemisferio", "hemo", "hemorragia", "hemos", "henares", "henchir", "hepta", "herborister\xEDa", "herb\xEDvoro", "heredadas", "heredar", "heredero", "hereditaria", "hereje", "herej\xEDa", "herencia", "herida", "heridas", "herido", "heridos", "hermana", "hermanas", "hermandades", "hermano", "hermanos", "hermosas", "hermoso", "hernia", "hern\xE1ndez", "herradura", "herramienta", "herramientas", "herrar", "herrera", "herrero", "hervido", "hervir", "hetero", "heteronimia", "heterosexual", "hexagonal", "hex\xE1gono", "hh", "hi", "hiato", "hiatos", "hice", "hiciera", "hicieran", "hicieras", "hicieron", "hiciese", "hicimos", "hiciste", "hidalgo", "hidr", "hidrataci\xF3n", "hidratada", "hidratante", "hidratar", "hidro", "hidroavi\xF3n", "hidrograf\xEDa", "hidrogr\xE1fico", "hidromasaje", "hiela", "hielo", "hierba", "hierbabuena", "hierbas", "hiere", "hierro", "hierve", "higgins", "higiene", "higienizar", "higi\xE9nico", "higos", "higro", "hija", "hijo", "hijos", "hilar", "hilera", "hilo", "hilos", "himalaya", "himno", "himnos", "hincapi\xE9", "hincha", "hinchable", "hinchado", "hinchaz\xF3n", "hinduismo", "hind\xFA", "hiper", "hiperarticulaci\xF3n", "hiperarticulada", "hiperb\xF3licamente", "hiperb\xF3lico", "hipercal\xF3rico", "hipermercados", "hipermetrop\xEDa", "hiperonimia", "hiperrequetebi\xE9n", "hipertexto", "hiperv\xEDnculo", "hiper\xF3nimo", "hiper\xF3nimos", "hipo", "hipoarticulaci\xF3n", "hipoarticulada", "hipocondriaco", "hipocor\xEDsticos", "hipocres\xEDa", "hipoteca", "hipotecar", "hipotecarios", "hipot\xE9tica", "hipot\xE9ticas", "hipot\xE9tico", "hippie", "hip\xE9rbaton", "hip\xE9rbatos", "hip\xE9rbole", "hip\xE9rboles", "hip\xF3crita", "hip\xF3dromo", "hip\xF3nimo", "hip\xF3nimos", "hip\xF3tesis", "hispanas", "hispanidad", "hispanista", "hispanizaci\xF3n", "hispano", "hispanoamericana", "hispanoamericanas", "hispanoamericano", "hispanoamericanos", "hispanoam\xE9rica", "hispanohablantes", "hispanos", "hisp\xE1nica", "hisp\xE1nico", "histeria", "historia", "historiador", "historias", "hist\xE9rico", "hist\xF3rica", "hist\xF3ricas", "hist\xF3rico", "hist\xF3ricos", "hitos", "hizo", "ho", "hobby", "hocico", "hogar", "hogares", "hoguera", "hoja", "hojarasca", "hojas", "hojear", "hojitas", "hola", "holandeses", "holand\xE9s", "holgada", "holgado", "holgaz\xE1n", "holgura", "holo", "hol\xEDstico", "hombre", "hombrera", "hombres", "hombro", "hombros", "homenajeado", "homeo", "homeopat\xEDa", "homeop\xE1tico", "home\xF3pata", "homicida", "homo", "homogeneidad", "homog\xE9neo", "homog\xE9neos", "homologaci\xF3n", "homologado", "homologar", "homosexual", "homosexuales", "hom\xF3fonas", "hom\xF3fonos", "hom\xF3logos", "hom\xF3nima", "hom\xF3nimas", "hondo", "hondonada", "honduras", "hondure\xF1o", "honestamente", "hongo", "hongos", "honor", "honorabilidad", "honores", "honor\xEDfica", "honor\xEDfico", "honor\xEDficos", "honradamente", "honrado", "honrados", "honrar", "hora", "horabuena", "horaria", "horarias", "horario", "horarios", "horas", "horchata", "horizontal", "horizontalidad", "horizonte", "horma", "hormigueo", "hormig\xF3n", "hormona", "hornear", "horno", "hornos", "horrible", "horribles", "horror", "horroriza", "horrorizaba", "horrorizarse", "horrorosa", "horrorosamente", "horroroso", "hortaliza", "hortalizas", "hor\xF3scopo", "hor\xF3scopos", "hospedaje", "hospeder\xEDa", "hospicio", "hospital", "hospitalaria", "hospitalario", "hospitales", "hospitalidad", "hospitalizar", "hostal", "hostales", "hostelero", "hosteleros", "hosteler\xEDa", "hostigamiento", "hostigar", "hostilidades", "hotel", "hoteleros", "hoteles", "houssay", "hoy", "htm", "html", "http", "hua", "huaca", "huascar\xE1n", "hube", "hubiera", "hubieran", "hubieras", "hubiere", "hubieron", "hubiese", "hubieses", "hubi\xE9ramos", "hubo", "hue", "hueca", "hueco", "huecos", "huele", "huelga", "huella", "huellas", "huelva", "huerta", "huerto", "hueso", "huesos", "huevo", "huevos", "hui", "huida", "huir", "humana", "humanas", "humanidad", "humanidades", "humanismo", "humanista", "humanitarios", "humano", "humanos", "humedad", "humedecer", "humidificar", "humildad", "humilde", "humo", "humor", "humorista", "humor\xEDstico", "hundido", "hundimiento", "hundirse", "hundi\xF3", "hund\xEDa", "huracanado", "hurac\xE1n", "hurto", "husmear", "huso", "husos", "huy", "hu\xE9rfano", "hu\xE9sped", "hu\xE9spedes", "h\xE1bil", "h\xE1bito", "h\xE1bitos", "h\xE1blame", "h\xE1game", "h\xE1msters", "h\xEDgado", "h\xF3rreo", "h\xFAmedo", "h\xFAmedos", "i", "ia", "iai", "iba", "iban", "ibas", "iberia", "iberoamericana", "iberoamericano", "iberoamericanos", "iberoam\xE9rica", "ibi", "ibro", "ib\xE9rica", "ib\xE9rico", "ib\xE9ricos", "ic", "icaa", "icaic", "icbf", "icfes", "ich", "icono", "iconos", "ic\xF3nico", "id", "ida", "idea", "ideado", "ideal", "ideales", "idealismo", "idealizar", "idear", "ideas", "identidad", "identidades", "identificable", "identificaci\xF3n", "identificado", "identificados", "identificar", "identificarse", "identificativa", "identificativo", "identificativos", "identific\xE1ndose", "ideolog\xEDa", "ideolog\xEDas", "ideol\xF3gica", "ideol\xF3gico", "ideol\xF3gicos", "ide\xF3logo", "idilio", "idioma", "idiomas", "idiom\xE1tico", "idiosincrasia", "idiosincr\xE1sicos", "ido", "idolatr\xEDa", "idoneidad", "id\xE9nticas", "id\xE9nticos", "id\xEDlico", "id\xF3neo", "ie", "igitur", "iglesia", "iglesias", "ignorado", "ignorancia", "ignorante", "ignorar", "ignoro", "igual", "igualdad", "iguales", "igualitario", "igualmente", "iguaz\xFA", "ii", "iii", "ilegal", "illa", "illar", "illo", "ilmos", "ilocutiva", "iluminaci\xF3n", "iluminado", "iluminan", "iluminar", "ilusionada", "ilusionado", "ilusionarse", "ilusiones", "ilusionismo", "ilusi\xF3n", "iluso", "ilusorio", "ilustrado", "ilustrador", "ilustrar", "ilustrar\xE1", "ilustrativo", "ilustr\xEDsima", "il\xF3gico", "im", "imagen", "imaginaba", "imaginaci\xF3n", "imaginado", "imaginan", "imaginar", "imaginario", "imaginarlo", "imaginarme", "imaginarse", "imaginas", "imaginativa", "imaginemos", "imaginer\xEDa", "imagino", "imag\xEDnate", "imberbe", "imborrable", "imcine", "imita", "imitaci\xF3n", "imitar", "impaciencia", "impaciente", "impactante", "impactar", "impacto", "impar", "imparable", "imparcial", "imparcialmente", "imparten", "impartir", "impecable", "impecables", "impedir", "impera", "imperante", "imperar", "imperativo", "imperativos", "imperceptible", "imperceptiblemente", "imperdible", "imperf", "imperfecci\xF3n", "imperfectivo", "imperfectivos", "imperfecto", "imperial", "imperio", "imperiosa", "imperioso", "impermeabilidad", "impermeabilizado", "impermeabilizar", "impermeable", "impersonal", "impersonales", "impersonalizaci\xF3n", "impersonalizar", "impertinente", "imperturbable", "impert\xE9rrito", "impida", "impide", "impiden", "impidiendo", "implantaci\xF3n", "implantes", "implica", "implicaciones", "implicaci\xF3n", "implicadas", "implicado", "implican", "implicar", "implicativos", "impliquen", "implosiva", "impl\xEDcita", "impl\xEDcitamente", "impl\xEDcito", "impl\xEDcitos", "impoluto", "imponer", "importa", "importaci\xF3n", "importadas", "importado", "importador", "importancia", "importante", "importantes", "importar", "importarle", "importar\xEDa", "importas", "importe", "importes", "imposibilidad", "imposible", "imposibles", "imposiciones", "impotencia", "impracticable", "imprecisi\xF3n", "impreciso", "imprecisos", "impredecibles", "impregnar", "impregnarse", "imprescindible", "imprescindibles", "impresionado", "impresionante", "impresiones", "impresionista", "impresi\xF3n", "impresora", "impresos", "imprevisible", "imprevisi\xF3n", "imprevisto", "impriman", "imprime", "imprimir", "imprimirlas", "improbabilidad", "improbable", "improbables", "impropias", "impropio", "improvisar", "improviso", "imprudencia", "imprudente", "impuestas", "impuesto", "impuestos", "impugnar", "impulsar", "impulso", "impulsos", "impunes", "impuntualidad", "impurezas", "imputado", "imserso", "im\xE1genes", "im\xE1n", "in", "ina", "inacabada", "inacentuada", "inacentuadas", "inaceptable", "inaceptables", "inactividad", "inactivos", "inacusativos", "inadaptaci\xF3n", "inadecuados", "inadmisi\xF3n", "inadvertido", "inagotable", "inagotables", "inalcanzable", "inalienable", "inalterable", "inalterablemente", "inal\xE1mbrico", "inapreciable", "inapropiada", "inapropiadas", "inapropiado", "inaudible", "inaudito", "inauguraci\xF3n", "inaugural", "inaugurar", "inca", "incaa", "incalculable", "incandescente", "incapacidad", "incapaz", "incas", "incendiar", "incendio", "incendios", "incentivar", "inceptivas", "inceptivo", "incertidumbre", "incesante", "incidencia", "incidentales", "incidentalmente", "incidente", "incidentes", "incierto", "incineraci\xF3n", "incineradora", "incinerar", "incisivos", "inciso", "incisos", "incitaci\xF3n", "incitar", "inclinaci\xF3n", "inclinado", "inclinar", "inclino", "incluida", "incluido", "incluidos", "incluir", "incluiremos", "incluirse", "incluir\xE1", "inclusivo", "inclusi\xF3n", "incluso", "incluya", "incluye", "incluyen", "incluyendo", "incluyentes", "incluyeran", "incl\xE1n", "incoativas", "incoherencia", "incomestible", "incomible", "incompatibilidad", "incompetencia", "incompetente", "incompleta", "incompletas", "incompleto", "incompletos", "incomprensible", "incomprensibles", "inconcebible", "inconclusa", "incondicional", "inconfundible", "inconsciente", "inconstancia", "incontable", "inconveniencia", "inconveniente", "inconvenientes", "incorporaci\xF3n", "incorporadas", "incorporado", "incorporan", "incorporando", "incorporar", "incorporarse", "incorrecta", "incorrectos", "incredulidad", "incrementado", "incrementan", "incrementar", "incremento", "increpar", "incre\xEDble", "incre\xEDblemente", "incrustaciones", "incrustaci\xF3n", "incrustado", "incubadora", "incubar", "incuestionable", "incuestionablemente", "inculcar", "inculpar", "inculpatorias", "incumbir", "incumplida", "incumplir", "incurrir", "inc\xF3gnita", "inc\xF3gnito", "inc\xF3moda", "inc\xF3modas", "ind", "indecisi\xF3n", "indef", "indefendible", "indefinici\xF3n", "indefinida", "indefinidamente", "indefinido", "indefinidos", "indefinitud", "indeleble", "indeleblemente", "indemnizaciones", "indemnizaci\xF3n", "indemnizar", "independencia", "independencias", "independiente", "independientemente", "independientes", "indescriptible", "indestructible", "indeterminaci\xF3n", "indeterminada", "indeterminado", "indeterminados", "india", "indias", "indic", "indica", "indicaba", "indicaciones", "indicaci\xF3n", "indicada", "indicado", "indicador", "indicadores", "indicamos", "indican", "indicando", "indicar", "indicativo", "indicativos", "indicio", "indicios", "indic\xE1ndolo", "indic\xE1rmelo", "indiferencia", "indiferente", "indigencia", "indigenismo", "indigente", "indigesto", "indigna", "indignaci\xF3n", "indignado", "indignados", "indignante", "indignantes", "indignar\xEDa", "indique", "indir", "indirecta", "indirectamente", "indirectas", "indirecto", "indirectos", "indiscreta", "indiscreto", "indiscutible", "indiscutiblemente", "indispensable", "indisposici\xF3n", "indispuesto", "indistinta", "individual", "individuales", "individualidad", "individualizar", "individuo", "individuos", "indivisibilidad", "induce", "inducir", "inductiva", "inductivo", "inductivos", "indudable", "indudablemente", "indulgencia", "indultar", "indulto", "indumentaria", "indur\xE1in", "industria", "industrial", "industriales", "industrializaci\xF3n", "industrializar", "ind\xEDgena", "ind\xEDgenas", "ineficaz", "ineludible", "ineludiblemente", "inem", "ineptitud", "inepto", "inequ\xEDvocos", "inercia", "ines", "inespec\xEDfica", "inespec\xEDfico", "inespec\xEDficos", "inesperadamente", "inesperado", "inestabilidad", "inestable", "inevitable", "inevitablemente", "inevitables", "inexactitud", "inexistencia", "inexistente", "inexistentes", "inexperto", "inexplicables", "inextricable", "inf", "infame", "infancia", "infanter\xEDa", "infantil", "infantiles", "infarto", "infatigable", "infecci\xF3n", "infectar", "infeliz", "inferencia", "inferior", "inferiores", "inferioridad", "inferir", "infierno", "infiltrar", "infinita", "infinitivo", "infinitivos", "infinito", "inflaci\xF3n", "inflado", "inflamable", "inflamaci\xF3n", "inflamar", "inflexiones", "inflexi\xF3n", "influencia", "influenciable", "influencias", "influido", "influidos", "influjo", "influye", "influyen", "influyentes", "informaciones", "informaci\xF3n", "informadas", "informado", "informador", "informados", "informal", "informales", "informando", "informar", "informarles", "informar\xE1", "informar\xE9", "informativa", "informativo", "informativos", "informatizar", "informe", "informes", "inform\xE1tica", "inform\xE1tico", "inform\xE1ticos", "infracciones", "infracci\xF3n", "infractor", "infraestructura", "infraestructuras", "infrahumanas", "infrarrojos", "infrecuente", "infringir", "infundadas", "infundado", "infundir", "infusiones", "infusi\xF3n", "ingeniero", "ingenio", "ingenioso", "ingeniosos", "ingente", "ingerir", "inglesa", "inglesas", "ingleses", "ingl\xE9s", "ingrediente", "ingredientes", "ingresar", "ingresivas", "ingreso", "ingresos", "inherente", "inherentemente", "inhumaci\xF3n", "inhumar", "inh\xF3spito", "inicia", "iniciaci\xF3n", "inicial", "iniciales", "inicialmente", "iniciando", "iniciar", "iniciaran", "iniciarse", "iniciativa", "iniciativas", "inicio", "ininteligible", "ininterrumpidamente", "injerir", "injertar", "injerto", "injuria", "injusta", "injustamente", "injusticias", "injusto", "inma", "inmaculada", "inmaculado", "inmanente", "inmaterialidad", "inmediaciones", "inmediata", "inmediatamente", "inmediatez", "inmediato", "inmensa", "inmensas", "inmenso", "inmerecidamente", "inmerecidos", "inmersi\xF3n", "inmersos", "inmigraci\xF3n", "inmigrante", "inmigrantes", "inminentes", "inmobiliaria", "inmobiliario", "inmortal", "inmortalidad", "inmovilidad", "inmovilizar", "inmueble", "inmuebles", "inmundicia", "inmutabilidad", "inmutable", "inm\xF3vil", "innato", "innecesario", "innegable", "innegablemente", "innovaci\xF3n", "innovador", "innovar", "inocente", "inocentes", "inopia", "inorg\xE1nica", "inorg\xE1nico", "input", "inquebrantable", "inquieta", "inquietantes", "inquietarse", "inquieto", "inquietudes", "inquilino", "inquilinos", "ins", "insalvable", "insatisfacci\xF3n", "inscribirse", "inscripciones", "inscripci\xF3n", "insecticida", "insecticidas", "insecto", "insectos", "insegura", "inseguridad", "inseguro", "insensibilidad", "insensible", "inseparable", "inseparables", "inserci\xF3n", "insertar", "inserten", "inservible", "inservibles", "insigne", "insignificante", "insinceridad", "insinuaci\xF3n", "insinuando", "insinuar", "insinuativa", "insin\xFAas", "insistencia", "insistentemente", "insistes", "insistido", "insistieron", "insistir", "insisti\xF3", "insist\xED", "insolaci\xF3n", "insolencia", "insolvente", "insonorizar", "insoportable", "insospechados", "insostenible", "inspeccionar", "inspecci\xF3n", "inspector", "inspiraci\xF3n", "inspirar", "inss", "instalaciones", "instalaci\xF3n", "instalado", "instalar", "instales", "instal\xE9", "instal\xF3", "instancia", "instancias", "instante", "instant\xE1nea", "instant\xE1neamente", "instant\xE1neo", "instauraci\xF3n", "instintivamente", "instintivo", "instinto", "institucional", "institucionales", "instituciones", "instituci\xF3n", "institut", "instituto", "institutos", "instrucciones", "instrucci\xF3n", "instructivo", "instructor", "instruido", "instruir", "instrumento", "instrumentos", "insubordinaci\xF3n", "insuficiente", "insuficientes", "insular", "insulso", "insultado", "insultando", "insultar", "insultes", "insultos", "insult\xF3", "insuperable", "insustancial", "ins\xEDpido", "ins\xF3lita", "ins\xF3lito", "intachable", "intacto", "integraci\xF3n", "integradas", "integrado", "integrados", "integral", "integrantes", "integrar", "integrarse", "integridad", "integrismo", "intelecto", "intelectual", "intelectuales", "intelectualidad", "inteligencia", "inteligente", "inteligentemente", "inteligentes", "intempestiva", "intempestivas", "intempestivo", "intencionada", "intencionadamente", "intencionales", "intencionalidad", "intenciones", "intenci\xF3n", "intensa", "intensidad", "intensificaci\xF3n", "intensificada", "intensificado", "intensificador", "intensificadores", "intensificados", "intensificar", "intensificativa", "intensificativas", "intensiva", "intensivas", "intensivo", "intensivos", "intenso", "intenta", "intentado", "intentan", "intentando", "intentar", "intentaremos", "intentarlo", "intentaron", "intentar\xE1", "intentar\xE9", "intentemos", "intenten", "intento", "intentos", "intent\xE1ndolo", "intent\xE1ramos", "inter", "interacciones", "interacci\xF3n", "interactivo", "interactuando", "interactuar", "interact\xFAa", "intercalaci\xF3n", "intercalada", "intercalados", "intercambiadores", "intercambiar", "intercambio", "intercambios", "intercultural", "interculturales", "interculturalidad", "interdental", "interdentales", "interdepartamentales", "interdependencia", "interdicci\xF3n", "interesa", "interesaba", "interesaban", "interesada", "interesado", "interesados", "interesale", "interesan", "interesante", "interesantes", "interesant\xEDsimo", "interesar", "interesarse", "interese", "intereses", "interfaz", "interferir", "intergubernamental", "interinidad", "interino", "interior", "interiores", "interiorizaci\xF3n", "interiorizadas", "interiorizado", "interiorizar", "interjecciones", "interjectivas", "interlenguas", "interlocutor", "interlocutores", "interl\xEDneas", "intermedia", "intermediario", "intermedias", "intermedio", "intermedios", "interminable", "intermitente", "interna", "internacional", "internacionales", "internalizaci\xF3n", "internas", "internauta", "internautas", "internet", "interno", "internos", "interpelaci\xF3n", "interpelar", "interpersonales", "interponer", "interposici\xF3n", "interpreta", "interpretables", "interpretaciones", "interpretaci\xF3n", "interpretados", "interpretan", "interpretar", "interpretarlo", "interpretarlos", "interpretativo", "interpreten", "interpret\xF3", "interprofesional", "interprovincial", "interpuestos", "interrog", "interrogaciones", "interrogaci\xF3n", "interrogadas", "interrogante", "interrogantes", "interrogar", "interrogativa", "interrogativaexclamativa", "interrogativas", "interrogativo", "interrogativos", "interrogatorio", "interrumpa", "interrumpan", "interrumpe", "interrumpes", "interrumpida", "interrumpido", "interrumpidos", "interrumpir", "interrumpirle", "interrumpirme", "interrumpirte", "interrupciones", "interrupci\xF3n", "interrupci\xF3nvoluntaria", "interruptor", "intersecci\xF3n", "interurbana", "interurbano", "intervalo", "intervalos", "intervenciones", "intervenci\xF3n", "intervenir", "interventor", "interviene", "intervino", "intervoc\xE1lica", "inter\xE9s", "intestinal", "intestino", "intestinos", "intimida", "intimidaci\xF3n", "intimidad", "intimidades", "intolerancia", "intragable", "intramuscular", "intranet", "intranquilidad", "intransigencia", "intransigente", "intransitivas", "intransitivo", "intransitivos", "intravenosa", "intriga", "intrincado", "introducci\xF3n", "introduce", "introducen", "introducida", "introducidas", "introducido", "introducidos", "introducimos", "introducir", "introductores", "introdujo", "intromisi\xF3n", "introspecci\xF3n", "introvertido", "intr\xEDnsecamente", "intr\xEDnseco", "intr\xEDnsecos", "intuici\xF3n", "intuitivo", "intuyo", "int\xE9ntalo", "int\xE9rpretes", "inundaciones", "inundaci\xF3n", "inundado", "inundar", "inusual", "inutilizar", "invadir", "invalidar", "invariabilidad", "invariable", "invariablemente", "invariables", "invasi\xF3n", "invencible", "invenci\xF3n", "inventan", "inventar", "inventario", "inventarse", "invento", "invent\xE1ndose", "invernadero", "invernal", "inveros\xEDmil", "inversiones", "inversi\xF3n", "inverso", "inversor", "invertebrado", "invertir", "investidura", "investigaciones", "investigaci\xF3n", "investigador", "investigar", "investigation", "invicto", "invierno", "invisible", "invita", "invitaciones", "invitaci\xF3n", "invitado", "invitados", "invitamos", "invitan", "invitar", "invitarla", "invitarle", "invitarles", "invitarme", "invitaron", "invito", "invit\xE1ramos", "invit\xE9", "invit\xF3", "invocaci\xF3n", "invocar", "involucionar", "involucradas", "involucrados", "involucrar", "involucrarse", "involuntario", "inyecci\xF3n", "inyectable", "inyectar", "inyectarle", "in\xE9dito", "in\xE9s", "in\xFAtil", "in\xFAtilmente", "ipc", "ir", "ira", "iremos", "irene", "irlanda", "irlandesa", "irle", "irme", "irnos", "ironiza", "iron\xEDa", "iron\xEDas", "iros", "irpf", "irracional", "irradiar", "irreal", "irreales", "irrealizable", "irrealizaci\xF3n", "irrefrenable", "irrefutable", "irrefutablemente", "irregular", "irregulares", "irregularidad", "irregularidades", "irremediablemente", "irreprochable", "irresponsabilidad", "irresponsable", "irreversibles", "irrigado", "irrigar", "irrisorio", "irrita", "irritaci\xF3n", "irse", "irte", "ir\xE1", "ir\xE1s", "ir\xE9", "ir\xEDa", "ir\xEDas", "ir\xF3nica", "ir\xF3nicas", "ir\xF3nico", "ir\xF3nicos", "isa", "isabel", "isabelino", "isidoro", "isidro", "isla", "islam", "islamismo", "islas", "isl\xE1micos", "isot\xE9rmica", "ista", "istmo", "istmos", "istruir", "is\xF3sceles", "ita", "italia", "italiana", "italiano", "iterativo", "itinerante", "itinerario", "ito", "itv", "itza", "iu", "iv", "iva", "ivo", "izar", "izq", "izquierda", "izquierdas", "izquierdo", "i\xF3n", "j", "ja", "jabal\xED", "jabonoso", "jab\xF3n", "jacinto", "jacuzzi", "jade", "jaguar", "jaime", "jalar", "jaleo", "jalisco", "jam\xE1s", "jam\xF3n", "jan", "japonesa", "japon\xE9s", "jap\xF3n", "jaqueca", "jar", "jarabe", "jarana", "jarchas", "jardinera", "jardineros", "jardiner\xEDa", "jardines", "jard\xEDn", "jarra", "jarrear", "jarro", "jarr\xF3n", "jas", "javi", "javier", "jazz", "jear", "jefa", "jefe", "jehov\xE1", "jer", "jera", "jerarqu\xEDa", "jerarqu\xEDas", "jerga", "jero", "jersey", "jers\xE9is", "jer\xE1rquico", "jer\xE1rquicos", "jer\xEDa", "jer\xEDo", "jes", "jesu", "jesuita", "jet", "jim\xE9nez", "jir", "jj", "jo", "joaqu\xEDn", "john", "jolgorio", "jondo", "jordi", "jorge", "jornada", "jornadas", "jornalero", "jorobado", "jos\xE9", "jos\xE9mar\xEDa", "jota", "joven", "jovencito", "jovenzuelo", "jovial", "joya", "joyer\xEDas", "juan", "juanacatl\xE1n", "juancho", "juanma", "jubilaci\xF3n", "jubilado", "jubilados", "jubilarse", "judicial", "jud\xEDas", "jud\xEDo", "juegan", "juegas", "juego", "juegos", "juerga", "jueves", "juez", "jugada", "jugado", "jugador", "jugamos", "jugando", "jugar", "jugaras", "jugarse", "jugosa", "jugoso", "juguete", "jugueter\xEDas", "juguetes", "juicio", "juicios", "juicioso", "julia", "julio", "juli\xE1n", "junio", "junta", "juntar", "juntas", "juntitos", "junto", "juntos", "jurado", "juramento", "jurar", "jurar\xEDa", "juras", "juro", "jur\xEDdica", "jur\xEDdicas", "jur\xEDdicoadministrativa", "jur\xEDdicos", "justa", "justamente", "justicia", "justificaciones", "justificaci\xF3n", "justificada", "justificados", "justificante", "justificar", "justificativos", "justo", "juvenil", "juventud", "juzgado", "juzgar", "juzgaran", "j\xE1is", "j\xF3nica", "j\xF3venes", "j\xFAbilo", "j\xFApiter", "k", "kahlo", "kas", "katrin", "kg", "kilo", "kilogramos", "kilom\xE9trico", "kil\xF3metro", "kil\xF3metros", "kinest\xE9sicas", "kiosco", "kiwi", "kl", "km", "kn", "koehler", "kr", "kreigel", "kremlin", "ks", "kuchen", "kukulk\xE1n", "kurdo", "k\xE1sa", "l", "la", "laberintos", "labial", "labio", "labiodental", "labiodentales", "labios", "labiovelar", "labor", "laborable", "laboral", "laborales", "laboralista", "laboratorio", "labrador", "labranza", "labrar", "laca", "lacado", "lacandones", "lacasa", "lacio", "lacra", "lacrar", "ladeado", "ladear", "ladeco", "ladera", "lado", "lados", "ladrar", "ladrido", "ladrillo", "ladrillos", "ladr\xF3n", "lag", "lago", "lagos", "laguna", "lagunas", "laica", "laico", "lains", "lamas", "lambada", "lambda", "lambdacismo", "lamentable", "lamentablemente", "lamentables", "lamentaci\xF3n", "lamentar", "lamento", "lana", "lanar", "lancha", "langosta", "langostino", "lanjar\xF3n", "lanka", "lanzado", "lanzamiento", "lanzamisiles", "lanzar", "lanzarse", "lanz\xF3", "laos", "lapso", "lar", "lara", "larga", "largar", "largas", "largo", "largometraje", "largos", "larguero", "laring\xF3logo", "lar\xEDngeas", "las", "lasmesas", "lastre", "lata", "latas", "latente", "lateral", "laterales", "lateralizaci\xF3n", "latifundio", "latin", "latina", "latinas", "latinismos", "latinizaci\xF3n", "latino", "latinoamericano", "latinos", "latitud", "latitudes", "lat\xEDn", "lau", "laura", "laut", "lavabo", "lavado", "lavadora", "lavaplatos", "lavar", "lavarlas", "lavarlo", "lavarse", "lavavajillas", "lavi", "lavo", "laxa", "laxante", "laxitud", "laxo", "lazarillos", "lazo", "lazos", "la\xEDsmo", "lcda", "lcdo", "le", "leal", "lealtad", "leandro", "leas", "lec", "lecci\xF3n", "lechal", "leche", "lechosa", "lechuga", "lechuza", "lector", "lectoras", "lectores", "lectura", "lecturas", "lecuona", "lee", "leen", "leer", "leerlo", "lees", "legado", "legal", "legales", "legalidad", "legalizar", "leganitos", "legendarios", "legibilidad", "legislaci\xF3n", "legislar", "legislativa", "legislativas", "legislativo", "legislativos", "legislatura", "legumbres", "leg\xEDtima", "leg\xEDtimo", "lejano", "lejanos", "lejan\xEDa", "lejos", "lej\xEDa", "lej\xEDsimos", "leloir", "lema", "lempira", "lengua", "lenguado", "lenguaje", "lenguas", "leng\xFCeta", "lenta", "lentamente", "lente", "lentejas", "lentillas", "lentitud", "lento", "lentos", "leo", "leonado", "leopoldo", "les", "lesbiana", "lesionar", "lesiones", "lesion\xF3", "lesi\xF3n", "leticia", "letra", "letras", "letrero", "levadura", "levanta", "levantado", "levantamiento", "levantamos", "levantando", "levantar", "levantarme", "levantarse", "levantarte", "levantar\xE9", "levantas", "levante", "levantes", "levanto", "levant\xE9", "levant\xF3", "levar", "leve", "levedad", "leves", "levinson", "lexicalizadas", "lexicalizados", "ley", "leyenda", "leyendo", "leyes", "ley\xE9ndolo", "le\xED", "le\xEDdas", "le\xEDdo", "le\xEDsmo", "le\xF1a", "le\xF1o", "le\xF3n", "li", "liado", "liad\xEDsima", "liar", "liberaci\xF3n", "liberal", "liberales", "liberalizaci\xF3n", "liberta", "libertad", "libertades", "libertador", "libertat", "libert\xE1", "libra", "librar", "librarse", "libras", "libre", "libremente", "librer\xEDa", "librer\xEDas", "libres", "libretas", "librito", "libro", "librooo", "libros", "lib\xE9rrimo", "lic", "licencia", "licenciada", "licenciado", "licenciarse", "licenciatura", "liceo", "lichi", "licor", "licorer\xEDa", "licores", "licra", "licuaci\xF3n", "licuar", "licuo", "lic\xFAo", "lidera", "liderar", "liderazgo", "lidiar", "liebe", "liebre", "lienzo", "lifesciences", "liga", "ligar", "ligarse", "ligera", "ligeramente", "ligereza", "ligero", "ligeros", "ligue", "lijado", "lijar", "lijlijana", "lima", "limarse", "limitaciones", "limitaci\xF3n", "limitada", "limitado", "limitar", "limite", "limpia", "limpiacristales", "limpiado", "limpiadora", "limpiadores", "limpiando", "limpiar", "limpiaras", "limpiarlo", "limpias", "limpieza", "limpio", "limpios", "limpi\xE1is", "limusina", "lim\xEDtrofe", "lim\xF3n", "linaje", "lince", "linda", "lindante", "lindo", "lineal", "lingote", "linguovelar", "ling\xFC\xEDstica", "ling\xFC\xEDsticas", "ling\xFC\xEDstico", "ling\xFC\xEDsticos", "lino", "linterna", "liposucci\xF3n", "lipotimia", "liquen", "liquidaci\xF3n", "liquidar", "liquidez", "lir", "lisboa", "liso", "lista", "listado", "listados", "listas", "listo", "literal", "literalmente", "literaria", "literarias", "literario", "literarios", "literato", "literatura", "litoral", "litro", "litros", "liviano", "ll", "lla", "llama", "llamaba", "llamabas", "llamada", "llamadas", "llamado", "llamamos", "llaman", "llamar", "llamara", "llamaran", "llamaras", "llamarla", "llamarle", "llamarlo", "llamarme", "llamarnos", "llamaron", "llamarse", "llamar\xE1", "llamar\xE1s", "llamar\xE9", "llamas", "llamaste", "llamativa", "llamativo", "llamativos", "llames", "llamo", "llam\xE9", "llam\xF3", "llana", "llanas", "llano", "llanos", "llantas", "llanura", "llanuras", "llave", "llaves", "llega", "llegaba", "llegada", "llegadas", "llegado", "llegados", "llegamos", "llegan", "llegando", "llegar", "llegara", "llegaran", "llegaras", "llegaremos", "llegarle", "llegaron", "llegar\xE1", "llegar\xE1s", "llegar\xE9", "llegar\xEDa", "llegas", "llegaste", "llego", "llegue", "lleguemos", "lleguen", "llegues", "llegu\xE9", "llegu\xE9is", "lleg\xF3", "lleida", "llena", "llenar", "llenarse", "llenas", "lleno", "llen\xF3", "lleva", "llevaba", "llevaban", "llevada", "llevadas", "llevadero", "llevado", "llevamos", "llevan", "llevar", "llevaran", "llevaron", "llevarse", "llevarte", "llevar\xE1", "llevar\xE1s", "llevas", "lleve", "llevemos", "lleves", "llevo", "llev\xE9", "llev\xF3", "llo", "llora", "llorar", "lloras", "llore", "llores", "llor\xE9", "llosa", "llover", "llovido", "lloviendo", "lloviera", "llovizna", "lloviznar", "llovi\xF3", "llov\xEDa", "llueva", "llueve", "lluvia", "lluvias", "lluvioso", "ll\xE1malo", "ll\xE1mame", "ll\xE1menos", "lo", "loable", "loas", "loca", "local", "locales", "localidad", "localidades", "localizaci\xF3n", "localizadas", "localizador", "localizan", "localizar", "locativo", "locativos", "loco", "locos", "locuaz", "locuciones", "locuci\xF3n", "locura", "locutor", "locutorio", "locutorios", "lodeiro", "logo", "logotipo", "logotipos", "logrado", "lograr", "lograron", "lograr\xE1s", "logre", "logren", "logro", "logros", "logr\xF3", "log\xEDa", "log\xEDstica", "loja", "lola", "lombarda", "lomo", "lona", "loncha", "lonchas", "lonck", "londres", "longevidad", "longevo", "longitud", "longitudinal", "lonja", "lonjas", "lopasesbien", "lorca", "loro", "los", "losa", "losada", "loseta", "loslibros", "lote", "loter\xEDa", "lotes", "lo\xEDsmo", "lta", "ltimo", "lubina", "lucanor", "lucas", "luces", "lucha", "luchar", "lucho", "lucia", "lucidez", "lucro", "luc\xEDa", "ludopat\xEDa", "ludotecas", "luego", "lugar", "lugares", "luis", "luisa", "lujo", "lujoso", "lumbago", "lumbalgia", "lumbar", "lumbre", "luminosa", "luminosidad", "luminoso", "luminton", "luna", "lunar", "lunas", "lunes", "lupa", "lustro", "luto", "luxaci\xF3n", "luz", "l\xE1cteo", "l\xE1cteos", "l\xE1grima", "l\xE1grimas", "l\xE1mina", "l\xE1ntico", "l\xE1nzate", "l\xE1pida", "l\xE1piz", "l\xE1ser", "l\xE1stima", "l\xE1tigo", "l\xE1zaro", "l\xE9xica", "l\xE9xicas", "l\xE9xico", "l\xE9xicos", "l\xE9xicosint\xE1cticas", "l\xED", "l\xEDder", "l\xEDmite", "l\xEDmites", "l\xEDnea", "l\xEDneacontinua", "l\xEDneas", "l\xEDo", "l\xEDos", "l\xEDquida", "l\xEDquidas", "l\xEDquido", "l\xEDquidos", "l\xF3gica", "l\xF3gicamente", "l\xF3gicas", "l\xF3gico", "l\xF3pez", "l\xFAcido", "l\xFAdica", "l\xFAdicas", "l\xFAdico", "l\xFAdicos", "l\xFAn", "m", "ma", "macabro", "macedonia", "maceta", "machacar", "machaconamente", "machac\xF3n", "machado", "macho", "machu", "maciza", "macizo", "macondo", "macroconciertos", "macroestructura", "macroestructuras", "macrofunciones", "macuto", "madera", "madero", "madrastra", "madre", "madrid", "madrigal", "madriguera", "madriles", "madrile\xF1amente", "madrile\xF1o", "madrina", "madrugada", "madrugador", "madrugar", "madrug\xF3n", "madurar", "madurez", "maduro", "maestra", "maestro", "maestr\xEDa", "mafia", "magallanes", "magdalena", "magia", "magisterio", "magistrado", "magistral", "magistratura", "magnitud", "magnitudes", "magn\xEDfica", "magn\xEDficamente", "magn\xEDfico", "magro", "mag\xEDster", "maite", "maja", "majestad", "majestuosas", "majo", "maj\xEDsimos", "mal", "mala", "malabares", "malabarista", "malacca", "malague\xF1as", "malaria", "malas", "malcriado", "malcriar", "maldecido", "maldita", "maldito", "maleabilidad", "maleable", "malec\xF3n", "maleducada", "maleducado", "malentendido", "malentendidos", "males", "malestar", "maleta", "maletas", "maletero", "malet\xEDn", "maleza", "malgastar", "malicia", "malo", "malos", "maltratadas", "maltrato", "malvas", "malversaci\xF3n", "mal\xEDsimo", "mamar", "mambo", "mamen", "mam\xE1", "mam\xEDfero", "manada", "manantial", "manat\xED", "manazas", "mancha", "manchar", "manchas", "manch\xF3", "manco", "manda", "mandan", "mandar", "mandarme", "mandar\xEDa", "mandas", "mandato", "mandatos", "mando", "mand\xEDbulas", "manejable", "manejar", "manejo", "manera", "maneras", "manga", "mangas", "manglares", "mangueras", "manguito", "manguitos", "maniaco", "manicura", "manido", "manifestaciones", "manifestaci\xF3n", "manifestar", "manifest\xF3", "manifiesta", "manifiestamente", "manifiestan", "manifiesto", "manilla", "maniobra", "maniobras", "manipulaci\xF3n", "manipular", "maniqueas", "maniqu\xEDes", "manises", "manitas", "mano", "manojo", "manolete", "manolo", "manos", "manrique", "mansi\xF3n", "manso", "manta", "mantel", "manteler\xEDa", "mantener", "mantenerse", "mantengan", "mantenido", "manteniendo", "mantenimiento", "mantequilla", "mantiene", "mantienen", "mantuvieran", "manual", "manuales", "manualidades", "manuel", "manuela", "manufactura", "manuscrita", "manuscrito", "manuscritos", "manutenci\xF3n", "manzana", "manzanas", "manzanilla", "manzano", "man\xEDa", "mapa", "mapas", "mapuches", "maquetar", "maquillador", "maquillaje", "maquillarse", "maquinaria", "maquinilla", "maquinista", "maquinisto", "mar", "maracaibo", "maracuy\xE1", "maradona", "maratones", "marat\xF3n", "maravilla", "maravillado", "maravillar", "maravillas", "maravillo", "maravillosa", "maravilloso", "mara\xF1a", "marca", "marcada", "marcadas", "marcado", "marcador", "marcadores", "marcados", "marcan", "marcar", "marcarlas", "marcarlos", "marcas", "march", "marcha", "marchado", "marchante", "marchar", "marcharon", "marcharse", "marchar\xEDa", "marchas", "marche", "marchemos", "marchita", "marchitar", "marchitarse", "marchito", "march\xF3", "marco", "marcos", "marc\xF3", "marea", "mareado", "marearse", "marechal", "marejada", "maremoto", "mareos", "mares", "margarina", "margarita", "margen", "marginaci\xF3n", "marginado", "marginal", "marginales", "marginalidad", "marginar", "mariana", "mariano", "maricasta\xF1a", "marido", "mariela", "marieta", "marina", "marinero", "marino", "marinos", "mario", "marionetas", "mariposa", "marisa", "marisco", "mariscos", "marismas", "marisquer\xEDa", "marquesina", "marqueter\xEDa", "marqu\xE9s", "marrones", "marroqu\xED", "marruecos", "marr\xF3n", "marta", "marte", "martes", "martinica", "mart\xED", "mart\xEDn", "mart\xEDnez", "maruja", "marxismo", "marzo", "mar\xEDa", "mar\xEDn", "mar\xEDtima", "mar\xEDtimas", "mar\xEDtimo", "mas", "masa", "masaje", "masajear", "mascarilla", "mascota", "masculinas", "masculino", "masculinos", "mascullar", "masivo", "masivos", "masticar", "mas\xEDa", "mata", "matanza", "matar", "matasellos", "mate", "matem\xE1tica", "matem\xE1ticamente", "matem\xE1ticas", "matem\xE1tico", "maten", "materia", "material", "materiales", "materialidad", "materialista", "materializaci\xF3n", "materializarse", "materializ\xF3", "materias", "materna", "maternal", "maternidad", "materno", "maternos", "mates", "maticen", "matices", "matinales", "matiz", "matizaciones", "matizaci\xF3n", "matizada", "matizador", "matizadores", "matizar", "mato", "matriarcado", "matricular", "matricularse", "matrimonial", "matrimonio", "matrimonios", "matrona", "matronas", "matr\xEDcula", "matr\xEDculas", "matusal\xE9n", "mat\xF3", "maullar", "maullido", "max", "maximizar", "maya", "mayas", "mayest\xE1tico", "mayo", "mayonesa", "mayor", "mayores", "mayorista", "mayoritaria", "mayoritariamente", "mayoritarias", "mayoritario", "mayor\xEDa", "may\xFAscula", "may\xFAsculas", "may\xFAsculo", "mazap\xE1n", "mazato", "ma\xEDz", "ma\xF1a", "ma\xF1ana", "ma\xF1anas", "ma\xF1o", "ma\xF1oso", "mcca", "mcer", "mcmlxvi", "me", "meandro", "mecanismo", "mecanismos", "mecanografiada", "mecedora", "mecenas", "mecer", "mechas", "mec\xE1nica", "mec\xE1nicas", "mec\xE1nico", "mec\xE1nicos", "medalla", "medell\xEDn", "media", "mediaci\xF3n", "mediador", "mediados", "mediana", "mediano", "medianoche", "mediante", "mediar", "medias", "medicaci\xF3n", "medicamento", "medicamentos", "medicina", "medicinal", "medicinales", "medicinas", "medici\xF3n", "medida", "medidas", "medieval", "medio", "medioambiental", "medioambientales", "mediocre", "mediocridad", "mediod\xEDa", "medios", "medir", "meditaci\xF3n", "meditar", "mediterr\xE1nea", "mediterr\xE1neo", "mediterr\xE1neos", "med\xEDa", "meeting", "mega", "megafon\xEDa", "megalento", "mejilla", "mejill\xF3n", "mejor", "mejora", "mejorado", "mejorando", "mejorar", "mejorarse", "mejorar\xEDa", "mejore", "mejores", "mejor\xEDa", "melanc\xF3lico", "melena", "melisa", "mella", "mellizos", "melodiosa", "melod\xEDa", "melopea", "mel\xF3dica", "mel\xF3dicas", "mel\xF3dico", "mel\xF3dicos", "mel\xF3mano", "membrete", "memo", "memorables", "memorandos", "memoria", "memorias", "memorizaci\xF3n", "memorizadas", "memorizados", "memorizar", "memor\xE1ndum", "mench\xFA", "mencionadas", "mencionado", "mencionados", "mencionar", "menci\xF3n", "menda", "mendigo", "menear", "meneo", "menester", "menguando", "menguante", "menguar", "meninas", "menor", "menorca", "menores", "menos", "menosprecio", "mensaje", "mensajero", "mensajer\xEDa", "mensajes", "menstruaci\xF3n", "mensual", "mensuales", "mensualmente", "mental", "mentales", "mentalista", "mentalmente", "mente", "mentido", "mentira", "mentiras", "mentiroso", "mentir\xEDa", "mentor", "ment\xF3n", "menuda", "menudo", "men\xFA", "men\xFAs", "meramente", "mercader", "mercadillo", "mercadillos", "mercado", "mercados", "mercadotecnia", "mercanc\xEDa", "mercanc\xEDas", "mercantiles", "merced", "mercer\xEDas", "merche", "mercosur", "mercurio", "merece", "merecen", "merecer", "mereces", "merecido", "merec\xEDa", "merec\xEDas", "merendar", "merendero", "merengada", "merengue", "merezca", "meridiano", "meridional", "meridionales", "merienda", "meritorio", "merluza", "mermelada", "merodear", "mes", "mesa", "mesas", "meses", "meseta", "mesetas", "mesilla", "mesita", "mestizaje", "mesura", "mes\xEDas", "mes\xF3n", "meta", "metaf\xEDsica", "metaf\xEDsico", "metaf\xF3ricas", "metaf\xF3rico", "metal", "metalenguaje", "metaling\xFC\xEDsticas", "metaling\xFC\xEDsticos", "metalizado", "metal\xFArgica", "metamorfosis", "metan", "metas", "mete", "metedura", "meteorito", "meteorol\xF3gicas", "meteorol\xF3gico", "meteorol\xF3gicos", "meter", "meterlo", "meterme", "meternos", "meterse", "metes", "metido", "metimos", "metodolog\xEDa", "metonimia", "metraje", "metralleta", "metro", "metrob\xFAs", "metropolitano", "metros", "metr\xF3poli", "met\xE1basis", "met\xE1fora", "met\xE1foras", "met\xE1lico", "mexicana", "mexicano", "mezcla", "mezclar", "mezclarse", "mezquita", "mezquitas", "mg", "mgarcia", "mi", "michelines", "microbio", "microbiolog\xEDa", "microondas", "microorganismo", "microprocesador", "microscopio", "microsc\xF3pico", "mide", "miden", "mido", "miedica", "miedo", "miedos", "miedoso", "miedosos", "miel", "miembro", "miembros", "mientan", "mientes", "mientras", "miga", "migaja", "migas", "migraci\xF3n", "migratorias", "migratorio", "migratorios", "migra\xF1a", "miguel", "mihijo", "mikel", "mil", "milagro", "miles", "miligramo", "mililitro", "militancia", "militar", "militares", "militarmente", "milla", "millar", "millares", "millonada", "millones", "mill\xE1s", "mill\xF3n", "milstein", "mil\xEDmetro", "mimado", "mimbre", "mimo", "mimos", "min", "mina", "mineral", "minerales", "mineros", "minibar", "minifalda", "minifundio", "minimalista", "minimice", "minimizaci\xF3n", "minimizador", "minimizadores", "minimizar", "ministerial", "ministerio", "ministerios", "ministra", "ministro", "ministros", "minorista", "minoritaria", "minoritarias", "minor\xEDa", "minor\xEDas", "mintiendo", "minuciosidad", "minucioso", "minusv\xE1lidos", "minuta", "minutitos", "minuto", "minutos", "min\xFAscula", "min\xFAsculas", "min\xFAsculo", "miope", "miop\xEDa", "mira", "miraba", "miraban", "mirada", "miradas", "mirador", "miral\xE1", "miramos", "mirando", "mirar", "miras", "mirase", "mire", "miren", "mires", "mirilla", "miro", "mir\xE1ndome", "mir\xE9", "mir\xF3", "mis", "misa", "miseria", "misil", "misionero", "misiones", "misiva", "misma", "mismamente", "mismas", "mismo", "mismos", "misquitos", "misterioso", "misticismo", "mistral", "mitad", "mitigador", "mitigar", "mitin", "mitol\xF3gica", "mitos", "mixtas", "mixtos", "mi\xE9rcoles", "mmm", "mmmm", "mn", "mnemot\xE9cnico", "mobiliario", "mochila", "mochuelo", "moci\xF3n", "mocoso", "moctezuma", "moda", "modal", "modales", "modalidad", "modalidades", "modalizado", "modalizador", "modalizados", "modalizar", "modas", "modelado", "modelar", "modelitos", "modelo", "modelos", "moderaci\xF3n", "moderada", "moderadamente", "moderado", "moderna", "modernas", "modernidad", "modernismo", "modernista", "moderno", "modesta", "modestia", "modificaciones", "modificaci\xF3n", "modificada", "modificado", "modificador", "modificadores", "modificar", "modismos", "modo", "modos", "modosita", "modulada", "mod\xE9lico", "mogoll\xF3n", "mojada", "mojado", "mojar", "moj\xF3n", "molde", "moldeable", "moldeado", "moldear", "moldes", "moldura", "mole", "molecular", "moler", "molesta", "molestado", "molestan", "molestar", "molestarme", "molestas", "moleste", "molestia", "molestias", "molesto", "molina", "molineros", "molinos", "mollera", "molusco", "mol\xE9cula", "momentito", "momento", "momentos", "moment\xE1nea", "moment\xE1neo", "momia", "momificar", "monarcas", "monarqu\xEDa", "monasterio", "moneda", "monedas", "monedero", "monetario", "monitor", "monitores", "monja", "mono", "monofonem\xE1ticas", "monogamia", "monograf\xEDas", "monoling\xFCes", "monoparental", "monoparentales", "monopolio", "monopolizar", "monosil\xE1bica", "monos\xEDlabos", "monote\xEDsta", "monoton\xEDa", "monovolumen", "monstruo", "montacargas", "montado", "montaje", "montar", "montar\xE9", "monta\xF1a", "monta\xF1as", "monta\xF1ero", "monta\xF1ismo", "monte", "montes", "montevideo", "monto", "montones", "montserrate", "mont\xE9s", "mont\xEDculo", "mont\xF3", "mont\xF3n", "monumental", "monumento", "monumentos", "monz\xF3n", "mon\xF3logo", "mon\xF3tono", "moqueta", "mora", "morada", "morado", "moral", "moralista", "morar", "mordedura", "mordeduras", "mordisco", "morena", "moreno", "morfema", "morfolog\xEDa", "morfol\xF3gica", "morfol\xF3gicas", "morfol\xF3gico", "morfol\xF3gicos", "morfosint\xE1cticos", "morir", "morirme", "morirse", "moros", "moroso", "morro", "mortadela", "mortal", "mortales", "mortalidad", "mortecino", "mortuorio", "mor\xEDa", "mos", "mosca", "moscatel", "mosquita", "mosquito", "mostaza", "mosto", "mostrador", "mostrando", "mostrar", "mostrarse", "mostr\xF3", "mota", "mote", "motel", "motes", "motivaci\xF3n", "motivado", "motivados", "motivar", "motivo", "motivos", "moto", "motocicleta", "motociclismo", "motor", "motora", "motos", "mover", "moverlo", "moverse", "movida", "movido", "movilidad", "movilizaciones", "movilizaci\xF3n", "movilizados", "movilizar", "movimiento", "movimientos", "mov\xEDa", "mov\xEDan", "mozambique", "mozart", "mozo", "moz\xE1rabe", "mo\xF1o", "mucha", "muchachos", "muchas", "muchedumbre", "mucho", "muchos", "much\xEDsima", "much\xEDsimas", "much\xEDsimo", "mudable", "mudanza", "mudanzas", "mudarse", "mudo", "mueble", "muebles", "muecas", "muela", "muelle", "muerde", "muerdo", "muere", "muermo", "muero", "muerta", "muerte", "muertes", "muertitos", "muerto", "muestra", "muestran", "muestrario", "muestras", "muestre", "muestro", "mueve", "mugido", "mugir", "mugre", "mugriento", "mujer", "mujeres", "mula", "mulad\xED", "mulad\xEDes", "muletilla", "multa", "multar", "multicines", "multicolor", "multifactorial", "multimedia", "multinacional", "multinacionales", "multiplicaci\xF3n", "multiplicar", "multiplicativos", "multitud", "multitudinaria", "multiuso", "mundial", "mundo", "municipal", "municipales", "municipio", "municipios", "munici\xF3n", "mural", "muralista", "muralistas", "muralla", "murallas", "murcia", "muriendo", "muri\xF3", "murmullo", "murmurar", "murmur\xF3", "muro", "mus", "musaka", "musara\xF1as", "muscular", "museo", "museos", "musical", "musicales", "musicoterapia", "musitaban", "muslos", "mustia", "mustio", "musulmana", "musulm\xE1n", "mutaci\xF3n", "mutante", "mutua", "mutuas", "muy", "mu\xF1eca", "mu\xF1eira", "m\xE1", "m\xE1gico", "m\xE1laga", "m\xE1quina", "m\xE1quinas", "m\xE1rgenes", "m\xE1rmol", "m\xE1rquetin", "m\xE1rquez", "m\xE1rtir", "m\xE1s", "m\xE1slisto", "m\xE1ster", "m\xE1stil", "m\xE1ter", "m\xE1xima", "m\xE1xime", "m\xE1ximo", "m\xE9dica", "m\xE9dicas", "m\xE9dico", "m\xE9dicos", "m\xE9dium", "m\xE9n", "m\xE9rida", "m\xE9ritos", "m\xE9tete", "m\xE9todo", "m\xE9trico", "m\xE9tula", "m\xE9xico", "m\xED", "m\xEDa", "m\xEDas", "m\xEDmica", "m\xEDnima", "m\xEDnimas", "m\xEDnimo", "m\xEDnimos", "m\xEDo", "m\xEDos", "m\xEDrala", "m\xEDrame", "m\xEDsero", "m\xEDticos", "m\xEDtines", "m\xEDzcalo", "m\xF3bil", "m\xF3dem", "m\xF3dico", "m\xF3sfera", "m\xF3vil", "m\xF3viles", "m\xFA", "m\xFAltiple", "m\xFAltiplo", "m\xFAltiplos", "m\xFAnich", "m\xFAsculo", "m\xFAsculos", "m\xFAsica", "m\xFAsico", "n", "na", "nabal", "nace", "nacemos", "nacer", "nacido", "nacieron", "nacimiento", "nacimientos", "nacional", "nacionales", "nacionalidad", "nacionalidades", "nacionalismo", "nacionalista", "nacionalistas", "naciones", "naci\xF3", "naci\xF3n", "nac\xED", "nada", "nadando", "nadar", "nadaron", "nadie", "nad\xE9", "nailon", "nana", "napia", "nar", "naranja", "naranjas", "naranjo", "naranjos", "narices", "nariz", "narraci\xF3n", "narrador", "narran", "narrar", "narrativa", "narrativo", "nasal", "nasales", "nasalizaci\xF3n", "nata", "nataci\xF3n", "natalidad", "nativa", "nativo", "nativos", "nato", "natural", "naturales", "naturaleza", "naturalismo", "naturalmente", "naufragar", "nauseabundo", "navaja", "navajazo", "naval", "navarra", "nave", "navegaci\xF3n", "navegador", "navegar", "navidad", "navidades", "navide\xF1a", "naviero", "nazarenos", "nazco", "ne", "necesaria", "necesariamente", "necesarias", "necesario", "necesarios", "necesidad", "necesidades", "necesita", "necesitaba", "necesitado", "necesitamos", "necesitan", "necesitar", "necesitar\xE1", "necesitar\xEDa", "necesitar\xEDan", "necesitas", "necesiten", "necesites", "necesito", "nefasto", "negaciones", "negaci\xF3n", "negada", "negadas", "negado", "negados", "negar", "negarme", "negarse", "negar\xE9", "negativa", "negativamente", "negativas", "negativo", "negativos", "negligencia", "negociaciones", "negociaci\xF3n", "negociando", "negociante", "negociar", "negociarse", "negocio", "negocios", "negra", "negrita", "negro", "negros", "negu\xE9", "neg\xE1ndose", "neila", "nemot\xE9cnico", "neobarrocas", "neolatinas", "neozeland\xE9s", "neruda", "nervio", "nervios", "nerviosa", "nerviosismo", "nervioso", "nerviosos", "neto", "netos", "neumon\xEDa", "neuralgia", "neurolog\xEDa", "neurona", "neuronal", "neutra", "neutralicen", "neutralizaciones", "neutralizaci\xF3n", "neutralizar", "neutras", "neutro", "neutros", "neutr\xF3n", "nevada", "nevado", "nevando", "nevar", "nevera", "nexo", "nexos", "ne\xF3fito", "nfimo", "nh", "ni", "nicaragua", "nicarag\xFCense", "nicho", "nichos", "nico", "nicol\xE1s", "nicotina", "nido", "niebla", "niega", "niegan", "niegas", "niego", "niegue", "nieta", "nieto", "nieva", "nieve", "nif", "nigeria", "nimiedad", "nimio", "ninguna", "ningunas", "ninguno", "ning\xFAn", "niquelado", "nitidez", "nitr\xF3geno", "nivel", "nivelaci\xF3n", "nivelado", "nivelar", "niveles", "ni\xF1a", "ni\xF1ez", "ni\xF1o", "ni\xF1os", "nm", "nn", "no", "nobel", "nobiliario", "noble", "nobleza", "noche", "nochebuena", "nochecita", "noches", "nochevieja", "nocional", "nocionales", "nociones", "nocivo", "noci\xF3n", "nocturna", "nocturnas", "nocturno", "nocturnos", "nom", "nombra", "nombrado", "nombramiento", "nombrar", "nombraron", "nombraros", "nombre", "nombres", "nominal", "nominales", "nominalizaciones", "nominalizadas", "nominativo", "nomo", "nordeste", "norma", "normal", "normales", "normalidad", "normalizadas", "normalizar", "normalmente", "normas", "normativa", "normativo", "noroeste", "norte", "nos", "nosotras", "nosotros", "nostalgias", "nota", "notaba", "notable", "notablemente", "notables", "notar", "notarse", "notas", "noticia", "noticiarios", "noticias", "notificaci\xF3n", "notificar", "notoriamente", "notoriedad", "notorio", "not\xE9", "novatada", "novato", "novedad", "novedades", "novedosa", "novedoso", "novel", "novela", "novelas", "novelista", "noventa", "novia", "novicio", "noviembre", "novillos", "novio", "novios", "nov\xEDsimo", "nov\xEDsimos", "ns", "nte", "nubarr\xF3n", "nube", "nubes", "nublado", "nublar", "nublarse", "nuclear", "nucleares", "nudillos", "nudista", "nudo", "nueces", "nuera", "nueras", "nuestra", "nuestras", "nuestro", "nuestros", "nueva", "nuevamente", "nuevas", "nueve", "nuevo", "nuevos", "nuev\xEDsimo", "nuez", "nula", "nulidad", "nulo", "numeraciones", "numeraci\xF3n", "numerados", "numerales", "numero", "numerosa", "numerosas", "numeroso", "numer\xF3", "nunca", "nupcial", "nupcias", "nuria", "nutrir", "nutritiva", "nutritivo", "n\xE1huatl", "n\xE1useas", "n\xE1utico", "n\xE9ctar", "n\xEDscalo", "n\xEDtida", "n\xEDtido", "n\xF3mina", "n\xF3stico", "n\xFAcleo", "n\xFAcleos", "n\xFAmero", "n\xFAmeros", "o", "oaxaca", "ob", "obci\xF3n", "obedece", "obedecer", "obeso", "objeciones", "objeci\xF3n", "objetar", "objetiva", "objetivas", "objetividad", "objetivo", "objetivos", "objeto", "objetos", "oblicuo", "obliga", "obligaciones", "obligaci\xF3n", "obligada", "obligado", "obligados", "obligan", "obligaran", "obligativas", "obligatoria", "obligatoriamente", "obligatorias", "obligatoriedad", "obligatorio", "obligatorios", "obliguen", "obra", "obrar", "obras", "obrero", "obscuro", "obsequio", "observaba", "observaciones", "observaci\xF3n", "observadas", "observado", "observados", "observamos", "observar", "observarse", "observar\xE1n", "observatorio", "observemos", "obsesiva", "obsesivo", "obsesi\xF3n", "obsoleta", "obsoleto", "obstante", "obstrucci\xF3n", "obstruido", "obst\xE1culo", "obtenci\xF3n", "obtener", "obtengan", "obtenido", "obtenidos", "obteniendo", "obtuvo", "obviada", "obviando", "obviar", "obvio", "ob\xFAs", "oca", "ocasiona", "ocasional", "ocasionalmente", "ocasionar", "ocasiones", "ocasi\xF3n", "occidental", "occidente", "ocean\xEDa", "ocer", "ochenta", "ocho", "ochoa", "ocio", "ocioso", "oclusiva", "oclusivas", "oclusividad", "oclusivo", "oclusi\xF3n", "octavio", "octavo", "octogenario", "octos\xEDlabo", "octubre", "ocular", "oculista", "oculos", "oculta", "ocultar", "ocultaras", "ocultarlo", "oculto", "ocultos", "ocupa", "ocupacional", "ocupaci\xF3n", "ocupada", "ocupadas", "ocupado", "ocupados", "ocupamos", "ocupan", "ocupar", "ocupo", "ocurra", "ocurre", "ocurrencia", "ocurrido", "ocurriendo", "ocurrir", "ocurri\xF3", "ocurr\xEDa", "ocurr\xEDrsele", "oc\xE9ano", "od", "oda", "odia", "odiar", "odiel", "odio", "odioso", "odisea", "oe", "oea", "oei", "oes", "oeste", "ofende", "ofendido", "ofendidos", "ofendi\xF3", "ofensiva", "oferta", "ofertas", "oficial", "oficiales", "oficialmente", "oficiar", "oficina", "oficinas", "oficio", "ofrece", "ofrecemos", "ofrecen", "ofrecer", "ofrecerle", "ofrecerles", "ofrecerme", "ofrecerse", "ofrecidos", "ofrecimiento", "ofreci\xF3", "ofrezco", "oftalmolog\xEDa", "ograf\xEDa", "oi", "oiga", "oigo", "oir", "ojal", "ojal\xE1", "ojeada", "ojear", "ojera", "ojeras", "ojival", "ojo", "ojos", "okay", "okupa", "ola", "olas", "oleaje", "oler", "olerse", "olfatear", "olfato", "olimpiada", "olimpiadas", "oliva", "olivia", "olivo", "olla", "ollas", "olmecas", "olog\xEDa", "olor", "olores", "oloroso", "olver", "olvida", "olvidaba", "olvidado", "olvidados", "olvidar", "olvidarte", "olvidar\xE1", "olvidar\xE9", "olvide", "olvidemos", "olvides", "olvido", "olvid\xE9", "olvid\xF3", "olv\xEDdalo", "ol\xEDa", "ol\xEDmpico", "ol\xEDmpicos", "ombligo", "omisi\xF3n", "omitida", "omitido", "omitidos", "omitir", "omnipresencia", "omnipresente", "omn\xEDvora", "omn\xEDvoro", "om\xF3platos", "on", "once", "onda", "ondas", "ondear", "ondulada", "ondulado", "onetti", "ong", "online", "onom\xE1stica", "onu", "onza", "on\xEDrico", "oo", "op", "opa", "opaca", "opaco", "opcional", "opciones", "opci\xF3n", "operaban", "operaciones", "operaci\xF3n", "operadores", "operar", "operario", "operativo", "opina", "opinamos", "opinar", "opinas", "opinen", "opiniones", "opini\xF3n", "opino", "opin\xE1is", "oponente", "oponerse", "opones", "opongo", "oportunas", "oportunidad", "oportunidades", "oportunismo", "oportuno", "oposiciones", "oposici\xF3n", "opositor", "optado", "optar", "optas", "optativa", "optativo", "optener", "optimismo", "optimista", "opto", "opulencia", "op\xEDpara", "op\xEDparo", "ora", "orabuena", "oracional", "oracionales", "oraciones", "oraci\xF3n", "orador", "oral", "orales", "oralmente", "orden", "ordena", "ordenaci\xF3n", "ordenada", "ordenadamente", "ordenado", "ordenador", "ordenadores", "ordenanza", "ordenanzas", "ordenar", "ordenarlo", "ordenas", "ordenes", "ordeno", "orden\xE9", "orden\xF3", "orde\xF1ar", "ordinado", "ordinal", "ordinales", "ordinaria", "ordinario", "oreja", "orejas", "orfanato", "orfebrer\xEDa", "org", "organismo", "organismos", "organizaciones", "organizaci\xF3n", "organizada", "organizado", "organizan", "organizar", "organizaron", "organizativos", "orgullo", "orgullosa", "orgullosamente", "orgullosas", "orgulloso", "orgullosos", "org\xE1nica", "org\xE1nico", "org\xE1nicos", "orientaci\xF3n", "orientada", "orientadas", "orientado", "orientados", "oriental", "orientales", "orientar", "orientarse", "oriente", "origen", "originado", "originados", "original", "originales", "originalidad", "originan", "originar", "originaria", "originario", "origin\xF3", "orilla", "orina", "orinoco", "ormenio", "ornamentales", "oro", "orograf\xEDa", "orogr\xE1fico", "oros", "orquesta", "orqu\xEDdea", "ors", "ortodoxo", "ortoepia", "ortograf\xEDa", "ortogr\xE1fica", "ortogr\xE1ficas", "ortogr\xE1fico", "ortogr\xE1ficos", "ortotipograf\xEDa", "ortotipogr\xE1ficos", "orto\xE9picas", "orujo", "oruro", "or\xE9gano", "or\xEDgenes", "os", "osa", "osar", "oscilante", "oscilar", "oscura", "oscuras", "oscurecer", "oscuridad", "oscuro", "oscuros", "oso", "ostensible", "ostentar", "ostra", "ostracismo", "ost\xE1culo", "otan", "otavalo", "ote", "otear", "oto", "otorga", "otorgada", "otorgado", "otorgar", "otorrino", "oto\xF1al", "oto\xF1o", "otra", "otramente", "otras", "otro", "otros", "ou", "oui", "ourense", "oval", "ovalada", "oveja", "oviedo", "oviforme", "ovino", "ovni", "oxigenada", "ox\xEDgeno", "ox\xEDtonas", "oy", "oye", "oyen", "oyendo", "oyente", "oyentes", "oyeran", "oyes", "oy\xF3", "ozono", "o\xED", "o\xEDa", "o\xEDdo", "o\xEDdos", "o\xEDmos", "o\xEDr", "o\xEDrte", "o\xEDs", "p", "pa", "pabellones", "pabell\xF3n", "pablo", "pachucho", "paciencia", "paciente", "pacientes", "paco", "pactado", "pactar", "pacto", "pac\xEDfica", "pac\xEDfico", "padecer", "padrastro", "padre", "padres", "padrino", "padrinos", "padr\xF3n", "paella", "paga", "pagada", "pagado", "pagan", "pagar", "pagaremos", "pagarle", "pagarlo", "pagar\xE1s", "pagas", "page", "pago", "pagos", "pague", "pag\xE1rtelo", "paisaje", "paisajes", "paisajista", "paisano", "paja", "pajar", "pajarita", "pal", "pala", "palabra", "palabras", "palacete", "palacio", "paladar", "paladear", "palanca", "palas", "palatal", "palatales", "palco", "palenque", "paleta", "paliativos", "paliza", "palma", "palmada", "palmadas", "palmas", "palmera", "palo", "paloma", "palomitas", "palos", "palpable", "palpar", "pampa", "pamplona", "pan", "pana", "panadero", "panader\xEDa", "panamericana", "panam\xE1", "pancarta", "pancho", "panda", "pandilla", "panel", "panorama", "panor\xE1mica", "pantalla", "pantalones", "pantal\xF3n", "pantano", "papa", "papas", "papaya", "papear", "papel", "papelera", "papeleras", "papeler\xEDa", "papeles", "papeleta", "papel\xF3n", "paperas", "papista", "pap\xE1", "paquete", "paquetes", "paqui", "par", "para", "paraba", "parab\xF3lica", "paraca\xEDdas", "parada", "paradas", "paradero", "paradigma", "paradigmas", "paradisiaca", "parado", "paradoja", "parador", "paradores", "parados", "parad\xF3jico", "parafarmacias", "paraguas", "paraguay", "parag\xFCero", "paralelo", "paraling\xFC\xEDstico", "paraling\xFC\xEDsticos", "paramedicina", "paran", "paranoia", "paran\xE1", "parapente", "parar", "pararemos", "pararme", "paraverbal", "paraverbales", "para\xEDso", "parcela", "parche", "parches", "parch\xEDs", "parcial", "parciales", "parcialidad", "parcialmente", "parco", "parece", "parecen", "parecer", "parecerle", "parecerse", "parecer\xEDa", "parecida", "parecido", "parecidos", "pareci\xF3", "parec\xEDa", "parec\xEDan", "pared", "paredes", "pareja", "parejas", "paren", "parentesco", "parent\xE9tica", "parent\xE9ticas", "parent\xE9ticos", "pares", "parezca", "parezco", "pariente", "parientes", "parip\xE9", "parir", "parlamentaria", "parlamentarias", "parlamentario", "parlamentarios", "parlamento", "parlotear", "paro", "paros", "parox\xEDtonas", "parpadear", "parque", "parques", "parqu\xE9", "parranda", "parrillas", "parroquias", "part", "parte", "partes", "participaciones", "participaci\xF3n", "participantes", "participar", "participes", "participio", "participios", "particular", "particulares", "particularidad", "particularizadores", "particularizar", "particularmente", "partida", "partidario", "partidas", "partido", "partidos", "partimos", "partir", "partirse", "partitiva", "partitivas", "partitivo", "partitivos", "partitura", "parti\xF3", "parto", "parturienta", "part\xEDcula", "part\xEDculas", "par\xE1bola", "par\xE1frasis", "par\xE1lisis", "par\xE1metros", "par\xE9ntesis", "par\xEDs", "par\xF3", "par\xF3n", "par\xF3nimos", "pasa", "pasaba", "pasaban", "pasable", "pasacalles", "pasada", "pasadas", "pasado", "pasados", "pasaje", "pasajera", "pasajeras", "pasajero", "pasajeros", "pasamos", "pasan", "pasando", "pasaporte", "pasapur\xE9s", "pasar", "pasaras", "pasarela", "pasaremos", "pasarlo", "pasarme", "pasarse", "pasar\xE1", "pasar\xE9", "pasar\xEDa", "pasas", "pasase", "pasatiempo", "pasatiempos", "pascua", "pascuas", "pase", "paseando", "pasear", "paseemos", "pasemos", "paseo", "paseos", "pases", "pasillo", "pasiva", "pasivas", "pasivizaci\xF3n", "pasivo", "pasivos", "pasi\xF3n", "pasma", "pasmado", "pasmarote", "paso", "pasodoble", "pasos", "pasta", "pastel", "pastelera", "pastilla", "pastillas", "pasto", "pastor", "pastoso", "pas\xE1rmelo", "pas\xE1rselo", "pas\xE9", "pas\xE9is", "pas\xF3", "pata", "patada", "patadas", "patag\xF3nica", "patas", "patata", "patatas", "patena", "patentar", "patente", "paterna", "paternal", "paternidad", "paterno", "paternofilial", "paticorto", "patinar", "patinazo", "patio", "patitas", "pato", "patoso", "patria", "patriarcado", "patricia", "patrimonio", "patriota", "patriotismo", "patrocinador", "patrocinar", "patrocinio", "patronaje", "patronal", "patronales", "patrones", "patrono", "patrullar", "patr\xF3n", "paula", "paulatino", "paup\xE9rrimo", "pausa", "pausadamente", "pausado", "pausas", "pauta", "pautados", "pautas", "pavimentar", "pavimento", "pavo", "pavor", "payasos", "paz", "pa\xEDs", "pa\xEDses", "pa\xF1o", "pa\xF1uelo", "pc", "pe", "peaje", "peatonal", "peatones", "peat\xF3n", "peca", "pecado", "pecador", "pecar", "peces", "pecho", "pechuga", "pechugas", "peculiar", "pedagogo", "pedagogos", "pedagog\xEDa", "pedag\xF3gicas", "pedag\xF3gico", "pedazos", "pedestal", "pediatra", "pediatr\xEDa", "pedicura", "pedida", "pedido", "pedidos", "pedir", "pediremos", "pedirle", "pedirte", "pedraza", "pedregoso", "pedro", "peduzzi", "ped\xEDrmela", "pegada", "pegadiza", "pegadizo", "pegado", "pegajoso", "pegar", "pegarse", "pegatina", "pego", "peg\xF3", "peinado", "peinarse", "peine", "pek\xEDn", "pel", "pela", "pelado", "pelan", "pelar", "pelayo", "pele", "pelea", "pelearan", "pelearse", "pele\xE9", "pele\xF3n", "pelicul\xF3n", "peligro", "peligros", "peligrosa", "peligrosamente", "peligroso", "pellizcar", "pelma", "pelo", "pelos", "pelota", "pelotazo", "peluches", "peludo", "peluquero", "peluquer\xEDa", "peluquer\xEDas", "pel\xE1ez", "pel\xEDcula", "pel\xEDculas", "pen", "pena", "penal", "penales", "penalti", "pendiente", "pendientes", "pendular", "penetrante", "penetrar", "peninsular", "penitencia", "penitenciarios", "penitenciar\xEDa", "penitente", "penoso", "pensaba", "pensaban", "pensado", "pensador", "pensamiento", "pensamientos", "pensamos", "pensando", "pensar", "pensarlo", "pensarse", "pensar\xE1s", "pensar\xEDas", "pensativo", "pensemos", "pensiones", "pensionistas", "pensi\xF3n", "pens\xE1bamos", "pens\xE9", "pens\xF3", "pentagonal", "pentas\xEDlabos", "pent\xE1gono", "pen\xE9lope", "pen\xEDnsula", "pen\xFAltima", "pen\xFAltimo", "peor", "pepa", "pepe", "pepita", "pepitas", "pep\xF3n", "peque\xF1a", "peque\xF1aja", "peque\xF1ajo", "peque\xF1as", "peque\xF1ez", "peque\xF1ito", "peque\xF1o", "peque\xF1os", "per", "pera", "percebe", "percepciones", "percepci\xF3n", "perceptible", "perceptiva", "percha", "perchas", "perchero", "perciben", "percibido", "percibir", "percibirlos", "percusi\xF3n", "perdedor", "perder", "perderse", "perderte", "perder\xEDa", "perdidas", "perdido", "perdimos", "perdiz", "perdi\xF3", "perdona", "perdonable", "perdonado", "perdonar", "perdonarme", "perdonar\xEDa", "perdone", "perdones", "perdono", "perdon\xE9", "perdura", "perdurable", "perdurablemente", "perdurar", "perd\xE9rmelo", "perd\xF3n", "perd\xF3name", "perd\xF3neme", "perecedero", "perecer", "peregrinaci\xF3n", "peregrinar", "peregrino", "perejil", "perelada", "perenne", "perennemente", "perentorio", "perezoso", "perf", "perfeccionamiento", "perfeccionista", "perfecci\xF3n", "perfecta", "perfectamente", "perfectivas", "perfectivo", "perfectivos", "perfecto", "perfectos", "perfil", "perfiles", "performativo", "performativos", "perfumado", "perfume", "perfurme", "periferia", "perifr\xE1sticas", "perifr\xE1stico", "perif\xE9ricas", "perif\xE9rico", "perilla", "periodismo", "periodista", "periodistas", "periodo", "periodos", "period\xEDsticas", "period\xEDstico", "period\xEDsticos", "peripecia", "peritaci\xF3n", "perito", "peri\xF3dica", "peri\xF3dicamente", "peri\xF3dicas", "peri\xF3dico", "peri\xF3dicos", "perjudica", "perjudicar", "perjudicial", "perla", "perlas", "permanece", "permanecer", "permanencia", "permanente", "permanentemente", "permanentes", "permanezca", "permanezcan", "permisiva", "permisividad", "permiso", "permita", "permitan", "permite", "permiten", "permites", "permitida", "permitidme", "permitido", "permitidos", "permitieran", "permitir", "permitirlo", "permitir\xE1", "permito", "permuta", "permutaci\xF3n", "permutar", "perm\xEDtame", "pernicioso", "pero", "peronismo", "perpendicular", "perpetua", "perpetuamente", "perpetuar", "perpetuarse", "perpetuidad", "perpetuo", "perro", "perros", "pers", "persa", "persecuci\xF3n", "perseguido", "perseguir", "perseverante", "perseverantemente", "perseverar", "persiguen", "persiste", "persistente", "persistir", "persona", "personaje", "personajes", "personal", "personales", "personalidad", "personalidades", "personalizar", "personalmente", "personarse", "personas", "personificaci\xF3n", "perspectiva", "perspectivas", "perspicacia", "persuasiva", "pertenecen", "pertenecer", "pertenecientes", "pertenencia", "pertenencias", "pertinaz", "pertinente", "pertinentes", "perturbaci\xF3n", "perturbar", "peruano", "pervivencia", "per\xEDfrasis", "per\xEDodo", "per\xFA", "pesa", "pesada", "pesadez", "pesadilla", "pesado", "pesar", "pesarse", "pesar\xEDa", "pesas", "pesca", "pescader\xEDa", "pescado", "pescador", "pescadores", "pese", "pesimismo", "pesimista", "peso", "pesos", "pesquero", "pesta\xF1a", "pesta\xF1ear", "peste", "pesticidas", "pestilencia", "pestilente", "petardo", "peteneras", "peter", "peticiones", "petici\xF3n", "petrolero", "petr\xF3leo", "pettirosi", "pet\xE9n", "pez", "pezu\xF1a", "pe\xF1a", "pe\xF1as", "pe\xF3n", "phadre", "phantasma", "photovisi\xF3n", "pi", "pianista", "pianisto", "piano", "piar", "pib", "pibil", "pica", "picada", "picado", "picadora", "picadura", "picante", "picar", "picaresca", "picas", "picasso", "pichu", "picnic", "pico", "picor", "picos", "pict\xF3rica", "pict\xF3ricas", "pict\xF3rico", "picudo", "pida", "pidamos", "pidan", "pidas", "pide", "pides", "pidiendo", "pidiera", "pidieran", "pidieron", "pidi\xE9ndole", "pidi\xF3", "pido", "pie", "piedad", "piedra", "piedras", "piel", "piensa", "piensan", "piensas", "piense", "piensen", "pienses", "pienso", "pierdan", "pierdas", "pierde", "pierden", "pierdo", "pierna", "piernas", "pies", "pieza", "piezas", "pijama", "pila", "pilar", "pilas", "pilla", "pillar", "pillas", "pillo", "pill\xF3", "pilotar", "piloto", "pilpil", "piment\xF3n", "pimienta", "pimiento", "pimientos", "pinacoteca", "pinacotecas", "pinar", "pincel", "pinchar", "pinchazo", "pincho", "pino", "pinta", "pintada", "pintado", "pintar", "pintaran", "pintarse", "pinto", "pintor", "pintoresco", "pintura", "pinturas", "pinzas", "pipeta", "pique", "piquetero", "piragua", "piramidal", "pirata", "pirineos", "piropo", "piropos", "pirueta", "pir\xE1mide", "pir\xE1mides", "pisado", "pisar", "pisara", "pisazo", "piscifactor\xEDa", "piscina", "piscinas", "piscolabis", "piso", "pisos", "pisotear", "pisp\xE1s", "pista", "pistas", "pistilo", "pistola", "pistoletazo", "pis\xE9", "pitar", "pitido", "pitillo", "pito", "pizarra", "pizca", "pizza", "pizzer\xEDa", "pi\xE9nsalo", "pi\xF1a", "pl", "placas", "placer", "plaga", "plan", "plana", "plancha", "planchado", "planchar", "planeado", "planeando", "planear", "planes", "planeta", "planetas", "planicie", "planificaci\xF3n", "planificadas", "planificar", "plano", "planos", "planta", "plantaci\xF3n", "plantado", "plantar", "plantarse", "plantas", "plantea", "planteado", "planteamiento", "plantear", "plantearla", "plantearse", "planteen", "plantilla", "plant\xF3n", "plas", "plasma", "plasta", "plasticidad", "plastificado", "plastificar", "plata", "plateado", "plateresco", "platillo", "platino", "plato", "platos", "plat\xF3nico", "plausibilidad", "plausible", "playa", "playback", "plaza", "plazas", "plazo", "plazos", "plegable", "plegaria", "plegarse", "pleito", "plena", "plenamente", "plenas", "plenilunio", "pleno", "plet\xF3rico", "plisado", "plomizo", "plomo", "pluma", "plumas", "plumero", "plumier", "plural", "plurales", "pluralia", "pluralidad", "pluralismo", "pluriculturalismo", "plusc", "pluscuamperfecto", "pl\xE1stica", "pl\xE1sticas", "pl\xE1stico", "pl\xE1tano", "po", "poblaciones", "poblaci\xF3n", "poblada", "poblado", "poblana", "pobre", "pobrecillo", "pobrecito", "pobres", "pobreza", "pobr\xEDsimo", "poca", "pocas", "pocho", "pocilga", "poco", "pocos", "poda", "podamos", "podar", "podemos", "poder", "poderes", "poderosa", "poderosos", "podido", "podio", "podremos", "podrida", "podrido", "podr\xE1", "podr\xE1n", "podr\xE1s", "podr\xE9", "podr\xEDa", "podr\xEDamos", "podr\xEDan", "podr\xEDas", "pod\xE1is", "pod\xE9is", "pod\xEDa", "pod\xEDamos", "pod\xEDas", "poema", "poemas", "poes\xEDa", "poes\xEDas", "poeta", "poetisa", "polaco", "polar", "polares", "polaridad", "polca", "polemizar", "polen", "poleo", "poli", "policiaca", "policial", "policiales", "polic\xEDa", "polideportivos", "poliedro", "polifemo", "polifonem\xE1ticas", "polif\xF3nica", "poligamia", "poliglota", "polinizaci\xF3n", "polis\xEDlabas", "polis\xEDndeton", "polite\xEDsmo", "polite\xEDsta", "poli\xE9drico", "poli\xE9ster", "pollo", "polo", "poluci\xF3n", "polvo", "polvorones", "pol\xE9mica", "pol\xE9mico", "pol\xEDgono", "pol\xEDtica", "pol\xEDticamente", "pol\xEDticas", "pol\xEDtico", "pol\xEDticos", "pomada", "pompas", "pomposo", "pon", "ponderaciones", "ponderar", "ponderativas", "ponderativo", "ponderativos", "pondremos", "pondr\xE1", "pondr\xEDa", "pone", "ponemos", "ponen", "ponencia", "poner", "ponerle", "ponerme", "ponernos", "ponerse", "ponerte", "pones", "ponga", "pongamos", "pongan", "pongas", "pongo", "poniente", "poni\xE9ndolos", "poni\xE9ndose", "ponlo", "pontevedra", "pon\xE9rselo", "pon\xEDa", "poor", "pop", "popa", "popocat\xE9petl", "popular", "populares", "populi", "poquito", "por", "porcentaje", "porcino", "porci\xF3n", "pormenorizado", "pormenorizar", "porosa", "porosidad", "poroso", "porque", "porquer\xEDa", "porqu\xE9", "porras", "porrazo", "portada", "portadas", "portado", "portador", "portadores", "portal", "portales", "portaminas", "portaron", "portarse", "portarte", "portasteis", "portaviones", "porte", "portero", "porter\xEDa", "porte\xF1a", "portfolio", "portocarrero", "portuaria", "portugu\xE9s", "port\xE1til", "port\xF3", "porvenir", "pos", "posa", "posada", "posadas", "posdata", "posee", "poseedor", "poseedores", "poseen", "poseer", "poseo", "posesiva", "posesivas", "posesivo", "posesivos", "posesi\xF3n", "pose\xEDdo", "posgrado", "posguerra", "posibilidad", "posibilidades", "posibilitan", "posibilitar", "posible", "posiblemente", "posibles", "posicionaron", "posiciones", "posiciono", "posici\xF3n", "positiva", "positivamente", "positivas", "positivismo", "positivo", "positivos", "posponer", "posposgrado", "posposici\xF3n", "pospuesta", "pospuestas", "pospuesto", "pospuestos", "post", "postal", "postales", "postdata", "poste", "posteridad", "posterior", "posteriores", "posteriori", "posterioridad", "posteriormente", "postgrado", "postguerra", "postmoderna", "postmodernidad", "postnominal", "postnominales", "postre", "postrimer\xEDas", "postura", "posturas", "postverbal", "postverbales", "post\xEDn", "potable", "potencia", "potencial", "potencias", "potente", "potingue", "potingues", "potos\xED", "potsverbal", "poyo", "pozo", "po\xE9ticas", "po\xE9tico", "po\xE9ticos", "pp", "pr", "practicaban", "practicable", "practicadas", "practicado", "practicados", "practicante", "practicar", "practico", "practique", "pradera", "prado", "praga", "pragm\xE1tica", "pragm\xE1ticas", "prar", "praxeogramas", "pre", "preadolescencia", "precario", "precauci\xF3n", "precede", "precedente", "precedentes", "preceder", "precedida", "precedidas", "precedido", "precedidos", "precedieron", "preceptor", "precio", "precios", "preciosa", "preciosas", "precioso", "precipicio", "precipitaciones", "precisa", "precisamente", "precisan", "precisar", "precisar\xE1n", "precisen", "precisiones", "precisi\xF3n", "preciso", "precisos", "precocidad", "precolombina", "precolombinas", "precolombino", "precolombinos", "precoz", "precursor", "predecesor", "predecibles", "predecir", "predicaciones", "predicado", "predicador", "predicados", "predicativa", "predicativas", "predicativo", "predicativos", "predicciones", "predicci\xF3n", "predictiva", "predictivas", "predilecci\xF3n", "predisposici\xF3n", "predominan", "predominante", "predominantes", "predominio", "predorsal", "predorso", "preeminencia", "preexcombatiente", "preexistencia", "prefacio", "preferencia", "preferencias", "preferente", "preferentemente", "preferida", "preferido", "preferidos", "preferimos", "preferir", "preferir\xEDa", "preferir\xEDais", "preferir\xEDas", "prefer\xEDs", "prefiere", "prefieren", "prefieres", "prefiero", "prefijaci\xF3n", "prefijo", "prefijos", "pregunta", "preguntado", "preguntando", "preguntar", "preguntarle", "preguntarles", "preguntarnos", "preguntarse", "preguntarte", "preguntas", "pregunte", "pregunto", "pregunt\xE1rselo", "pregunt\xF3", "preg\xF3n", "preg\xFAntame", "prehisp\xE1nicas", "prehistoria", "prehist\xF3rico", "preimpresos", "prejubilaci\xF3n", "prejuicio", "prejuicios", "preliminar", "preliminares", "preludio", "preludios", "prematuro", "premiarse", "premio", "premios", "premisa", "premisas", "premonici\xF3n", "prenda", "prendas", "prenominal", "prenominales", "prensa", "preocupa", "preocupaba", "preocupaci\xF3n", "preocupado", "preocupad\xEDsimo", "preocupan", "preocupante", "preocuparse", "preocupar\xEDamos", "preocupes", "preocupo", "prep", "prepago", "prepalatal", "prepara", "preparaci\xF3n", "preparadas", "preparado", "preparador", "preparados", "preparar", "prepararme", "prepararon", "preparativo", "preparatorio", "preparo", "prepar\xE1ndoselo", "preposicional", "preposicionales", "preposiciones", "preposici\xF3n", "prepositivo", "prepositivos", "prepotencia", "prepotente", "prerrom\xE1nico", "pres", "presa", "prescindible", "prescindir", "prescipci\xF3n", "prescriben", "prescribir", "prescribir\xE1", "prescripciones", "prescripci\xF3n", "prescrito", "presencia", "presencial", "presencian", "presenciar", "presenta", "presentaba", "presentaciones", "presentaci\xF3n", "presentado", "presentador", "presentados", "presentamos", "presentan", "presentando", "presentar", "presentara", "presentarais", "presentaran", "presentaremos", "presentarle", "presentarles", "presentarme", "presentarse", "presentar\xE9", "presentas", "presente", "presentes", "presentimiento", "presento", "present\xF3", "preservaci\xF3n", "preservar", "preservativos", "presidencia", "presidencial", "presidente", "presidentes", "presidio", "presidir", "presiento", "presiona", "presionando", "presiones", "presi\xF3n", "presley", "preso", "presta", "prestaciones", "prestaci\xF3n", "prestado", "prestados", "prestamista", "prestar", "prestaras", "prestarme", "prestarse", "prestas", "prestes", "prestige", "prestigio", "prestigioso", "prest\xE9", "presumir", "presunci\xF3n", "presunto", "presuponer", "presuposici\xF3n", "presupuesta", "presupuesto", "presupuestos", "pres\xE9ntame", "pretencioso", "pretendas", "pretender\xE1s", "pretendes", "pret\xE9rito", "pret\xF3nica", "prevaricaci\xF3n", "prevenci\xF3n", "prevengo", "prevenir", "prevenirles", "preventiva", "preventivas", "preventivo", "preveo", "prever", "preverbal", "preve\xEDa", "previa", "previamente", "previas", "previniendo", "previo", "previos", "previsible", "previsiones", "previsi\xF3n", "previsor", "previsto", "previstos", "prev\xE9", "pre\xE1mbulo", "prieto", "prima", "primar", "primaria", "primario", "primarios", "primas", "primavera", "primaveral", "primer", "primera", "primeramente", "primeras", "primero", "primeros", "primicia", "primitivo", "primo", "primog\xE9nito", "primordial", "primordialmente", "primoroso", "primos", "princesa", "princesita", "principal", "principales", "principalmente", "principio", "principios", "pringar", "pringoso", "priori", "prioridad", "prioritario", "prisa", "prisioneros", "prisi\xF3n", "prisma", "privacidad", "privada", "privadas", "privado", "privados", "privativa", "privativo", "privatizaci\xF3n", "privatizar", "privilegiada", "pro", "proa", "probabilidad", "probabilidades", "probable", "probablemente", "probado", "probador", "probar", "probarse", "probeta", "problema", "problemas", "problem\xE1tica", "problem\xE1tico", "prob\xE1rmelos", "proceda", "procede", "proceden", "procedencia", "procedencias", "procedente", "procedentes", "proceder", "procediere", "procedimiento", "procedimientos", "procesador", "procesados", "procesamiento", "procesando", "procesar", "procesiones", "procesi\xF3n", "proceso", "procesos", "proclamada", "proclisis", "procl\xEDtico", "procrear", "procuradur\xEDa", "procuraremos", "prodigarse", "prodigioso", "producciones", "producci\xF3n", "produce", "producen", "producidas", "producido", "producir", "producirse", "productivas", "producto", "productor", "productoras", "productores", "productos", "produc\xEDan", "produjera", "produjeran", "produjeron", "produjo", "produzcan", "profanar", "profano", "proferir", "profesar", "profesional", "profesionales", "profesionalidad", "profesiones", "profesi\xF3n", "profeso", "profesor", "profesora", "profesorado", "profesores", "proformas", "profunda", "profundamente", "profundas", "profundidad", "profundizar", "profundiz\xE1ramos", "profundo", "profusa", "profusamente", "profusi\xF3n", "profuso", "programa", "programaci\xF3n", "programadas", "programado", "programar", "programas", "programs", "progresa", "progresar", "progresista", "progresiva", "progresivamente", "progresivo", "progresi\xF3n", "progreso", "progresos", "prohibiciones", "prohibici\xF3n", "prohibida", "prohibido", "prohibieron", "prohibir", "prohibitivo", "proh\xEDbe", "proh\xEDbo", "proletariado", "proletario", "proliferaci\xF3n", "proliferar", "prolija", "prolijamente", "prolijo", "prologuista", "prolonga", "prolongaci\xF3n", "prolongada", "prolongadamente", "prolongado", "prolongar", "prol\xEDfico", "promesa", "promesas", "prometas", "prometedor", "prometer", "prometes", "prometido", "prometieras", "prometiste", "prometo", "prominencia", "promoci\xF3n", "promotor", "promover", "promueven", "promulgar", "pron", "pronombre", "pronombres", "pronominal", "pronominales", "pronominalizaci\xF3n", "pronominalizado", "pronosticado", "pronosticar", "prontitud", "pronto", "pronuncia", "pronunciaci\xF3n", "pronunciada", "pronunciadas", "pronunciado", "pronuncian", "pronunciando", "pronunciar", "pronuncias", "pronuncicaci\xF3n", "pronuncie", "pronunci\xF3", "pron\xF3stico", "propagan", "propaganda", "propagar", "proparox\xEDtonas", "propensi\xF3n", "propenso", "propia", "propiamente", "propias", "propiciar", "propicien", "propicio", "propiedad", "propiedades", "propietario", "propina", "propio", "propios", "propone", "proponemos", "proponen", "proponer", "proponerles", "propongo", "proporciona", "proporcionaba", "proporcionada", "proporcionadamente", "proporcionadas", "proporcionado", "proporcionados", "proporcional", "proporcionales", "proporcionalmente", "proporcionan", "proporcionar", "proporcionarse", "proporcione", "proporcionen", "proporciones", "proporci\xF3n", "proposiciones", "proposici\xF3n", "propuesta", "propuestas", "propuesto", "propuestos", "propulsar", "prop\xF3sito", "prop\xF3sitos", "prorratear", "prorrateo", "prorrogar", "prorrogar\xE1", "pros", "prosa", "proseguir", "prospecto", "prospectos", "prosperar", "prosperidad", "prostituci\xF3n", "pros\xF3dico", "protagonista", "protagonistas", "protagonizar", "protecci\xF3n", "proteger", "protegerse", "protegida", "protegidas", "protegido", "protegidos", "protesta", "protestando", "protestante", "protestantismo", "protestar", "protestas", "prote\xEDnas", "protocolario", "protocolo", "prototipo", "protot\xEDpicamente", "protot\xEDpico", "prot\xE9tica", "prot\xF3n", "provecho", "provechosamente", "provechoso", "proveedor", "proveedores", "proveer", "proven\xEDa", "proverbios", "provincia", "provincial", "provinciales", "provincialismo", "provincianismo", "provincias", "provisional", "provisionalmente", "provoca", "provocan", "provocando", "provocar", "proxemia", "proxenetismo", "proximidad", "proximidades", "prox\xE9mica", "proyecciones", "proyecci\xF3n", "proyectaban", "proyectan", "proyectar", "proyecto", "proyector", "proyectos", "prudente", "prueba", "pruebas", "pru\xE9balo", "pr\xE1ctica", "pr\xE1cticamente", "pr\xE1cticas", "pr\xE1ctico", "pr\xE9stame", "pr\xE9stamo", "pr\xE9stamos", "pr\xEDncipe", "pr\xF3digamente", "pr\xF3digo", "pr\xF3logo", "pr\xF3logos", "pr\xF3rroga", "pr\xF3spero", "pr\xF3tasis", "pr\xF3tesis", "pr\xF3xima", "pr\xF3ximamente", "pr\xF3ximas", "pr\xF3ximo", "pr\xF3ximos", "ps", "psicoanalista", "psicoan\xE1lisis", "psicol\xF3gica", "psicol\xF3gico", "psicol\xF3gicos", "psicosis", "psic\xF3logo", "psic\xF3logos", "psiquiatra", "psiquiatras", "psiquiatr\xEDa", "psychological", "ps\xEDquica", "ps\xEDquicamente", "ps\xEDquicas", "ps\xEDquicos", "pt", "publicaciones", "publicaci\xF3n", "publicado", "publicados", "publicar", "publicaran", "publicidad", "publicitaria", "publicitario", "publicitarios", "publico", "pucelana", "pude", "pudiera", "pudierais", "pudieran", "pudieras", "pudimos", "pudiste", "pudi\xE9ramos", "pudo", "pudor", "pudrirse", "puebla", "pueblo", "pueblos", "pueda", "puedan", "puedas", "puede", "pueden", "puedes", "puedo", "pueees", "puente", "puentear", "puentes", "puentismo", "puerco", "puerrco", "puerta", "puertas", "puerto", "puertos", "pues", "puesta", "puesto", "puestos", "pugnar", "pulcritud", "pulcro", "pulgada", "pulgar", "pulido", "pulir", "pulmones", "pulm\xF3n", "pulpa", "pulsar", "pulsas", "pulsera", "pulseras", "pulular", "pulverizar", "puma", "punta", "puntas", "puntero", "puntiagudo", "puntillas", "punto", "puntos", "puntuaci\xF3n", "puntual", "puntuales", "puntualidad", "puntualizar", "puntualmente", "puntuar", "punzada", "punzante", "pupa", "pupitre", "pura", "puramente", "puras", "pureza", "purgatorio", "puro", "puse", "pusiera", "pusieran", "pusieron", "pusimos", "puso", "puya", "puzle", "pu\xF1ado", "pu\xF1alada", "pu\xF1etazo", "pu\xF1o", "pvp", "pza", "p\xE1g", "p\xE1gina", "p\xE1ginas", "p\xE1gs", "p\xE1jaro", "p\xE1jaros", "p\xE1lido", "p\xE1lpito", "p\xE1ncreas", "p\xE1nico", "p\xE1ramo", "p\xE1rrafo", "p\xE1rrafos", "p\xE1rroco", "p\xE1same", "p\xE1satelo", "p\xE9rdida", "p\xE9rdidas", "p\xE9rez", "p\xE9same", "p\xE9sima", "p\xE9simo", "p\xE9simos", "p\xE9talo", "p\xE9treo", "p\xEDcnics", "p\xEDldora", "p\xF3cima", "p\xF3liza", "p\xF3ngalas", "p\xF3ngame", "p\xF3quer", "p\xF3ster", "p\xFAblica", "p\xFAblicamente", "p\xFAblicas", "p\xFAblico", "p\xFAblicos", "q", "qu", "quark", "que", "quebradizas", "quebradizo", "quebrados", "quebrar", "queda", "quedaba", "quedaban", "quedabas", "quedado", "quedamos", "quedan", "quedando", "quedar", "quedarme", "quedarnos", "quedaros", "quedarse", "quedarte", "quedar\xE1", "quedar\xE9", "quedar\xEDa", "quedar\xEDas", "quedas", "quedasteis", "quede", "queden", "quedes", "quedo", "qued\xE9", "qued\xE9is", "qued\xF3", "quehacer", "queja", "quejar", "quejarse", "quejas", "quejes", "quej\xE1ndose", "quema", "quemadas", "quemado", "quemadura", "quemaduras", "quemar", "quemarse", "quepa", "quepo", "queramos", "querella", "querellarse", "queremos", "querer", "querida", "querido", "querr\xE1s", "querr\xEDa", "querr\xEDas", "quer\xE9is", "quer\xEDa", "quer\xEDamos", "quer\xEDas", "ques", "queso", "quesos", "quetzal", "que\xE9", "que\xEDsmo", "quich\xE9s", "quicio", "quid", "quiebra", "quien", "quienes", "quiera", "quieran", "quieras", "quiere", "quieren", "quieres", "quiero", "quieto", "quietud", "quijote", "quijotesco", "quimbaya", "quimioterapia", "quince", "quincea\xF1ero", "quincenal", "quinielas", "quinientos", "quinta", "quintal", "quintana", "quiosco", "quioscos", "quir\xF3fano", "quir\xF3fanos", "quir\xFArgica", "quisiera", "quisieran", "quisieras", "quisieron", "quisi\xE9ramos", "quiso", "quiste", "quita", "quitado", "quitamiedos", "quitando", "quitar", "quitarles", "quitarme", "quitaron", "quitarse", "quitas", "quito", "quiz\xE1", "quiz\xE1s", "qui\xE9n", "qui\xE9nes", "quo", "qusiera", "qu\xE9", "qu\xE9date", "qu\xE9ee", "qu\xEDmica", "qu\xEDmico", "qu\xEDmicos", "qu\xF3rum", "r", "ra", "rabia", "rabiar", "rabieta", "rabillo", "rabino", "rabiosa", "rabo", "racha", "racheado", "raciocinio", "racional", "racionalismo", "racionalista", "racionalizaci\xF3n", "racionalizar", "racionar", "racismo", "raci\xF3n", "radar", "radiaci\xF3n", "radiactivos", "radiante", "radical", "radio", "radiodifusi\xF3n", "radiof\xF3nica", "radiof\xF3nico", "radiof\xF3nicos", "radiograf\xEDa", "radiograf\xEDas", "radiolog\xEDa", "radioterapia", "radioyente", "rae", "rafia", "rajar", "rajas", "ral", "ralla", "rallado", "rallador", "rallar", "rama", "ramad\xE1n", "ramaje", "ramas", "ramillete", "ramo", "ramos", "ram\xEDrez", "ram\xF3n", "rana", "ranchera", "rancho", "rancio", "ranura", "raparse", "rapidez", "raquel", "raqueta", "rar", "rara", "raramente", "raras", "raro", "raros", "rarr", "rascarse", "rasero", "rasgado", "rasgo", "rasgos", "rasgu\xF1o", "raso", "rastras", "rastrillo", "ratas", "ratero", "ratificar", "rato", "rat\xF3n", "raudo", "raya", "rayar", "rayas", "rayos", "rayuela", "raza", "razonable", "razonablemente", "razonamiento", "razonamientos", "razonar", "razones", "raz\xF3n", "ra\xEDces", "ra\xEDda", "ra\xEDz", "ra\xFAl", "re", "reabierto", "reaccionaban", "reaccionado", "reaccionar", "reaccionar\xEDa", "reacciones", "reacci\xF3n", "reactor", "reafirma", "reafirmaci\xF3n", "reafirmante", "reafirmar", "reagrupaci\xF3n", "reajustes", "real", "realce", "reales", "realidad", "realidades", "realismo", "realista", "realistas", "realiza", "realizable", "realizaciones", "realizaci\xF3n", "realizada", "realizadas", "realizado", "realizador", "realizados", "realizan", "realizando", "realizar", "realizaron", "realizarse", "realizativos", "realmente", "realzar", "reanudar", "reaparecer", "reapertura", "reasuntivo", "rebaja", "rebajado", "rebajados", "rebajas", "rebanar", "rebasar", "rebasar\xE1", "rebatir", "reba\xF1o", "rebeld\xEDa", "rebosante", "rebosar", "rebozar", "rebuscado", "recado", "recados", "recaer", "recalentar", "recambio", "recapacitar", "recapitulaci\xF3n", "recapitulativas", "recapitulativos", "recategorizaci\xF3n", "reca\xEDda", "recelar", "recelo", "recensiones", "recepciones", "recepcionista", "recepcionistas", "recepci\xF3n", "receptor", "receptora", "receptoras", "recesi\xF3n", "receta", "recetar", "recetaron", "recetas", "rechazar", "rechazaron", "rechazo", "rechinar", "rechoncho", "rechupete", "reciba", "recibamos", "reciban", "recibe", "reciben", "recibido", "recibidos", "recibiendo", "recibimos", "recibir", "recibiremos", "recibirlo", "recibir\xE1", "recibir\xE1n", "recibo", "recibos", "recib\xEDan", "reciclado", "reciclaje", "reciclar", "reciclarse", "reciente", "recientemente", "recientes", "recipiente", "recital", "recitar", "reci\xE9n", "reclamaciones", "reclamaci\xF3n", "reclamar", "reclamo", "recluir", "recluy\xF3", "recodo", "recoge", "recogedor", "recogen", "recoger", "recogeremos", "recogerla", "recogerse", "recogida", "recogido", "recogimiento", "recog\xEDa", "recojas", "recojo", "recolecci\xF3n", "recolectar", "recomendable", "recomendables", "recomendaciones", "recomendaci\xF3n", "recomendada", "recomendados", "recomendar", "recomendarle", "recomendarme", "recomendaron", "recomendarte", "recomendar\xEDa", "recomend\xF3", "recomienda", "recomiendan", "recomiendo", "recompensas", "reconocer", "reconocerse", "reconocer\xE1", "reconocido", "reconociendo", "reconocieran", "reconocimiento", "reconoci\xF3", "reconoc\xEDa", "reconozco", "reconquista", "reconsiderar", "reconstruir", "reconversi\xF3n", "recopilaci\xF3n", "recopilando", "recopilen", "recordaba", "recordadas", "recordado", "recordando", "recordar", "recordemos", "record\xE1bamos", "record\xE1ndoles", "recorren", "recorrer", "recorrido", "recorridos", "recorrimos", "recortada", "recortar", "recortarse", "recostarse", "recreaci\xF3n", "recrear", "recreo", "recriminaci\xF3n", "recriminar", "recriminatorio", "recrudecerse", "recta", "rectangular", "rectificaci\xF3n", "rectificador", "rectificadora", "rectificar", "rectificativos", "rectitud", "recto", "rector", "rectorado", "rectos", "rect\xE1ngulo", "recubrimiento", "recuento", "recuerda", "recuerdas", "recuerde", "recuerden", "recuerdo", "recuerdos", "recuperaci\xF3n", "recuperado", "recuperar", "recuperarlas", "recuperarse", "recuperes", "recurrente", "recurrentemente", "recurrentes", "recurrir", "recurriremos", "recurso", "recursos", "rec\xEDprocas", "rec\xEDproco", "red", "redacci\xF3n", "redactado", "redactar", "redactarla", "redactor", "redecorar", "redenci\xF3n", "redes", "redimirse", "redoblar", "redonda", "redondeadas", "redondeado", "redondeados", "redondeamiento", "redondear", "redondeo", "redondo", "reducci\xF3n", "reducida", "reducidas", "reducido", "reducidos", "reducir", "reductora", "reductores", "redundancia", "redundante", "redundantes", "reduplicaci\xF3n", "reduplicada", "reduplicadas", "reduplicado", "reembolsar", "reembolso", "reemplazar", "reencarnaci\xF3n", "reencarnar", "reencarnarse", "reenviar", "reevaluaci\xF3n", "referencia", "referencial", "referencias", "referente", "referentes", "referida", "referidas", "referido", "referidos", "referimos", "referir", "referirse", "refer\xE9ndum", "refiere", "refieres", "refiero", "refinado", "refiri\xF3", "refleja", "reflejaban", "reflejadas", "reflejan", "reflejar", "reflejas", "reflejo", "reflexionar", "reflexionara", "reflexiva", "reflexivamente", "reflexivas", "reflexivo", "reflexi\xF3n", "reforestaci\xF3n", "reforestar", "reforma", "reformada", "reformar", "reformulaciones", "reformulaci\xF3n", "reformuladores", "reformulando", "reforzada", "reforzado", "reforzador", "reforzadores", "reforzados", "reforzamiento", "reforzar", "refracci\xF3n", "refranes", "refrendar", "refrescante", "refrescar", "refresco", "refrigeraci\xF3n", "refrigerada", "refrigerado", "refrigerar", "refrigerio", "refr\xE1n", "refuerzan", "refuerzo", "refuerzos", "refugiado", "refugio", "refugios", "refutable", "refutaci\xF3n", "refutar", "regad\xEDo", "regala", "regalado", "regalar", "regalaran", "regalarle", "regalaron", "regalen", "regalo", "regalos", "regal\xE9", "regal\xF3", "regar", "regaras", "regata", "regatear", "regateo", "rega\xF1ar", "rega\xF1\xF3", "regenta", "regentar", "regido", "regimiento", "regional", "regionales", "regiones", "registrada", "registrado", "registrar", "registrarse", "registro", "registros", "regi\xF3n", "regla", "reglada", "reglamento", "reglamentos", "reglar", "reglas", "regno", "regordete", "regresar", "regresaron", "regulaci\xF3n", "regulan", "regular", "regulares", "regularidad", "regularmente", "regule", "regusto", "reg\xEDmenes", "rehabilitaci\xF3n", "rehabilitar", "rehacer", "rehilada", "rehilamiento", "rehogar", "rehusar", "reina", "reinaba", "reinado", "reinados", "reinante", "reinar", "reincidente", "reincidir", "reiniciar", "reintegrar", "reintegro", "reiterada", "reiteradamente", "reiterar", "reiterativa", "reiterativas", "reiterativo", "reivindicaci\xF3n", "reivindicar", "rejas", "rejuvenecer", "relaciona", "relacionada", "relacionadas", "relacionado", "relacionados", "relacional", "relacionales", "relacionar", "relacionarlos", "relacionarse", "relaciones", "relaci\xF3n", "relaja", "relajaci\xF3n", "relajada", "relajadas", "relajados", "relajamiento", "relajante", "relamerse", "relat", "relatar", "relativa", "relativamente", "relativas", "relativizar", "relativo", "relativos", "relato", "relatos", "relax", "relecturas", "relevancia", "relevante", "relevantes", "relicario", "relieve", "relieves", "religiones", "religiosa", "religiosas", "religiosidad", "religioso", "religiosos", "religi\xF3n", "reliquia", "rellenes", "rellenito", "reloj", "relojes", "reloncav\xED", "reluce", "reluciente", "rel\xE1jate", "rel\xE1mpago", "rel\xF3", "rema", "rematadas", "rematar", "remate", "rembolsar", "remediable", "remediar", "remedio", "remedios", "rememoraci\xF3n", "rememorar", "remero", "remiendo", "remite", "remitente", "remitir", "remo", "remodelar", "remojo", "remoj\xF3n", "remolcar", "remolino", "remolque", "remolques", "remol\xF3n", "remorder", "remord\xEDa", "remota", "remotas", "remoto", "remotos", "remplazar", "remuerde", "remunerado", "remunerar", "renal", "rencor", "rendici\xF3n", "rendimiento", "rendir", "rendirse", "renegar", "renfe", "rengl\xF3n", "renombre", "renovables", "renovaci\xF3n", "renovar", "renta", "rentabilidad", "rentabilizaci\xF3n", "rentabilizar", "rentable", "rentables", "renuncia", "renunciar", "renuncio", "reojo", "reorientaci\xF3n", "reparaciones", "reparaci\xF3n", "reparado", "reparar", "reparte", "repartidas", "repartidor", "repartir", "reparto", "repasar", "repatea", "repatear", "repele", "repelente", "repeler", "repel\xFAs", "repensar", "repente", "repentinamente", "repentino", "repercusiones", "repercusi\xF3n", "repetibles", "repeticiones", "repetici\xF3n", "repetidamente", "repetidas", "repetido", "repetidor", "repetidos", "repetir", "repetirse", "repetitivas", "repetitivo", "repita", "repitas", "repite", "repiten", "repitiendo", "repiti\xF3", "repito", "repleto", "replic\xF3", "repoblaci\xF3n", "repoblar", "reponer", "repongas", "reportaje", "reportajes", "reportero", "reposo", "reposter\xEDa", "reprender", "representa", "representaciones", "representaci\xF3n", "representada", "representado", "representados", "representan", "representante", "representantes", "representar", "representativa", "representativas", "representatividad", "representativo", "representativos", "representen", "reprimir", "reprobaci\xF3n", "reprobar", "reprochar", "reproche", "reproches", "reprocho", "reproch\xF3", "reproducci\xF3n", "reproducida", "reproducido", "reproducidos", "reproducir", "reproducirse", "reptar", "reptil", "republicano", "repuesto", "repuestos", "repugna", "repugnante", "repugnar", "repujado", "repulsivamente", "reputaci\xF3n", "rep\xEDtamelo", "rep\xEDtemelo", "rep\xFAblica", "requerida", "requeridos", "requerir", "requerir\xEDan", "reques\xF3n", "requete", "requetecerca", "requieran", "requiere", "requieren", "requisar", "requisitos", "rereaparecer", "res", "resaca", "resaltados", "resaltar", "resbaladizo", "rescate", "rescindir", "resecar", "reseco", "resentimiento", "reserva", "reservado", "reservamos", "reservar", "reservas", "rese\xF1a", "rese\xF1as", "resfriado", "resfriados", "resguardo", "residencia", "residencial", "residencias", "residente", "residir", "residuos", "resid\xEDan", "resignaci\xF3n", "resignado", "resignarse", "resigno", "resign\xE9", "resilabeo", "resistencia", "resistente", "resistentes", "resistir", "resoluci\xF3n", "resolver", "resolverse", "resolver\xE1n", "resonancia", "resonar", "respaldan", "respaldo", "respecta", "respectivas", "respecto", "respeta", "respetable", "respetan", "respetar", "respeten", "respeto", "respetuoso", "respingona", "respiraba", "respiraciones", "respiraci\xF3n", "respiramos", "respirar", "respiratorio", "respiratorios", "respiro", "responda", "responde", "responder", "responderle", "responderme", "respondiera", "respondi\xF3", "responsabilidad", "responsabilidades", "responsable", "responsablemente", "responsables", "respuesta", "respuestas", "resta", "restablecer", "restablecimiento", "restar", "restauraci\xF3n", "restaurador", "restaurante", "restaurantes", "resto", "restos", "restricciones", "restricci\xF3n", "restrictiva", "restrictivas", "restrictivo", "restrictivos", "restringida", "restringido", "restringidos", "resucitar", "resuelto", "resueltos", "resulta", "resultado", "resultados", "resultan", "resultante", "resultar", "resultativo", "resultativos", "resulten", "result\xF3", "resumen", "resumidamente", "resumidas", "resumiendo", "resumir", "resurrecci\xF3n", "res\xFAmenes", "retablos", "retaguardia", "retenci\xF3n", "retener", "retint\xEDn", "retirada", "retirado", "retirar", "retirarse", "retire", "retiro", "reto", "retocar", "retomar", "retorcido", "retornados", "retorno", "retos", "retractativa", "retransmisiones", "retransmisi\xF3n", "retransmitidas", "retransmitir", "retrasa", "retrasado", "retrasados", "retrasando", "retrasar", "retrasarse", "retraso", "retrasos", "retratista", "retratistas", "retrato", "retratos", "retribuci\xF3n", "retribuir", "retroalimentaci\xF3n", "retroceder", "retroceso", "retrofleja", "retroproyector", "retrospectiva", "retrospectivo", "retrovisor", "retumbar", "ret\xF3rica", "ret\xF3ricas", "reuma", "reunido", "reuniera", "reunimos", "reuniones", "reunir", "reunirnos", "reunirse", "reuni\xF3n", "revalorizaci\xF3n", "revalorizarse", "revelaci\xF3n", "revelar", "reventado", "reventar", "reverberaci\xF3n", "reverdecer", "reverencia", "reversible", "reverso", "revertido", "revestido", "revestimiento", "revestimientos", "revienta", "revisar", "revisara", "revisarla", "revisarme", "revise", "revisiones", "revisi\xF3n", "revista", "revistas", "revis\xE1is", "revivir", "revoluciones", "revoluci\xF3n", "revolver", "revuelta", "revuelto", "rev\xE1lida", "rev\xE9s", "rey", "reyes", "rezagar", "rezagarse", "rezar", "rezo", "re\xED", "re\xEDdo", "re\xEDmos", "re\xEDr", "re\xEDrse", "re\xF1ir", "re\xFAma", "re\xFAnen", "ri", "riachuelo", "rial", "rias", "ribera", "rica", "ricino", "rico", "ricos", "ridmo", "rid\xEDculo", "riego", "rienda", "riesgo", "riesgos", "rigen", "rigidez", "rigoberta", "rigurosa", "riguroso", "rima", "rimar", "rimas", "rincones", "rindas", "rioja", "riqueza", "riquezas", "riqu\xEDsimo", "risa", "risas", "rita", "ritmo", "ritmos", "rito", "ritos", "rituales", "rival", "rivalizar", "rivera", "rizado", "rizarse", "rizo", "ri\xF1\xF3n", "rne", "ro", "roban", "robar", "robarlo", "robaron", "robarse", "robell\xF3n", "roberto", "roble", "robles", "robo", "robot", "robusta", "robustez", "robusto", "rob\xF3tica", "roca", "rociar", "rocinante", "rock", "rocosa", "rocoso", "roc\xEDo", "rodaja", "rodajas", "rodaje", "rodar", "rodeado", "rodean", "rodear", "rodeo", "rodeos", "rodilla", "rodillas", "rodolfo", "rodrigo", "rodr\xEDguez", "roedor", "roedores", "rogamos", "rogar", "rogu\xE9", "rog\xF3", "roja", "rojas", "rojiblanco", "rojizo", "rojo", "rojos", "rol", "rold\xE1n", "roles", "roll", "rollazo", "rollizo", "rollo", "rom", "roma", "romana", "romance", "romanizaci\xF3n", "romano", "romanos", "romanticismo", "rombo", "romea", "romero", "romer\xEDas", "rompe", "rompecabezas", "rompeolas", "romper", "romperse", "romperte", "rompible", "rompieron", "rompi\xF3", "rom\xE1nica", "rom\xE1nico", "rom\xE1ntica", "rom\xE1nticas", "rom\xE1ntico", "ron", "ronca", "roncal", "rondar", "rondas", "roo", "ropa", "ropas", "ropero", "roquefort", "rosa", "rosado", "rosario", "rosas", "rostro", "rota", "rotacismo", "rotaci\xF3n", "rotativo", "rotatorio", "rotatorios", "roto", "rotonda", "rotulador", "rotuladores", "rotundamente", "rotundo", "rotura", "roxy", "rozadura", "rozar", "ro\xF1a", "ro\xF1oso", "rr", "ru", "rubia", "rubiales", "rubio", "ruborice", "ruboriza", "ruborizarse", "ruborizo", "rub\xE9n", "rub\xEDes", "rudeza", "rueda", "ruedas", "ruega", "ruego", "rugido", "rugir", "rugoso", "ruido", "ruidos", "ruidosas", "ruidoso", "ruidosos", "ruina", "ruinas", "ruise\xF1or", "ruiz", "rulfo", "rumba", "rumbo", "rumor", "rumorear", "rumores", "ruptura", "rural", "rurales", "ruso", "ruta", "rutas", "rutina", "rutinarias", "rutinario", "ru\xEDdo", "r\xE1", "r\xE1bano", "r\xE1faga", "r\xE1l", "r\xE1pida", "r\xE1pidamente", "r\xE1pido", "r\xE1pidos", "r\xE1ul", "r\xE9", "r\xE9cord", "r\xE9gimen", "r\xE9plica", "r\xEDan", "r\xEDgido", "r\xEDmel", "r\xEDo", "r\xEDos", "r\xEDtmica", "r\xEDtmicamente", "r\xEDtmicas", "r\xEDtmico", "r\xF3mulo", "r\xF3so", "r\xF3tulos", "r\xFAbrica", "r\xFAstica", "r\xFAstico", "r\xFCido", "s", "sa", "saavedra", "sabana", "sabbat", "sabe", "sabemos", "saben", "saber", "saberes", "saberlo", "sabes", "sabido", "sabidooo", "sabidur\xEDa", "sabiendo", "sabio", "sabor", "saborcillo", "saborear", "sabroso", "sabr\xE1", "sabr\xE1s", "sabr\xE9", "sabr\xEDa", "sab\xE1tico", "sab\xE9is", "sab\xE9rselas", "sab\xE9s", "sab\xEDa", "sab\xEDais", "sab\xEDamos", "sab\xEDan", "saca", "sacaba", "sacacorchos", "sacado", "sacar", "sacarse", "sacarte", "sacar\xE9", "sacar\xEDa", "sacerdote", "saciar", "saciedad", "saco", "sacra", "sacrificio", "sacrilegio", "sacudida", "sacudir", "sacudi\xF3", "sacven", "sac\xF3", "saetas", "safari", "sagacidad", "sagrada", "sagradas", "sagrado", "sainete", "sal", "sala", "salado", "salados", "salamanca", "salarial", "salario", "salas", "salaz\xF3n", "salchich\xF3n", "saldar", "saldarse", "saldo", "saldremos", "saldr\xE1", "saldr\xE1n", "sald\xF3", "sale", "salen", "sales", "salga", "salgamos", "salgas", "salgo", "salida", "salidas", "salido", "saliendo", "saliera", "salieran", "salieron", "salimos", "salir", "salirle", "salirse", "saliva", "sali\xE9ramos", "sali\xF3", "salmonete", "salm\xF3n", "salones", "salpicadura", "salpicar", "salpimentar", "salsa", "salta", "saltado", "saltar", "saltarse", "saltear", "salto", "saltos", "salt\xF3n", "salud", "saluda", "saludaba", "saludable", "saludado", "saludamos", "saludan", "saludando", "saludar", "saludarle", "saludarles", "saludarlo", "saludarnos", "saludaste", "saludo", "saludos", "salud\xF3", "salvaci\xF3n", "salvador", "salvaguardar", "salvaje", "salvapantallas", "salvar", "salvarse", "salvavidas", "salvo", "salv\xF3", "salzburgo", "salzburgu\xE9s", "sal\xEDa", "sal\xF3n", "sal\xFAdale", "san", "sana", "sanatorio", "sancho", "sancionadoras", "sancionar", "sanciones", "sanci\xF3n", "sandalias", "sandinista", "sand\xEDa", "saneamiento", "sanear", "sanfermines", "sangraba", "sangrado", "sangre", "sangrienta", "sanidad", "sanitaria", "sanitario", "sanitarios", "sano", "sanos", "sanseacab\xF3", "sant", "santa", "santander", "santeras", "santer\xEDa", "santiago", "santiam\xE9n", "santidad", "santo", "santos", "sant\xF3n", "sapa", "sapiencia", "saque", "sara", "sarampi\xF3n", "sarcasmo", "sarc\xF3fago", "sardana", "sardina", "sartenes", "sart\xE9n", "satan\xE1s", "satinado", "satisfacci\xF3n", "satisface", "satisfacer", "satisfactoria", "satisfactorio", "satisfac\xEDan", "satisfecha", "satisfecho", "satisfechos", "saturada", "saturarse", "saturno", "sat\xE1nica", "sat\xE9lite", "sat\xE9n", "sauna", "savia", "saxof\xF3n", "sazonar", "sba", "schwa", "science", "se", "sea", "sean", "seas", "seat", "sebasti\xE1n", "seca", "secado", "secador", "secadora", "secano", "secar", "secarse", "secciones", "secci\xF3n", "seco", "secos", "secreta", "secretaria", "secretario", "secretar\xEDa", "secreto", "secta", "sector", "sectores", "secuelas", "secuencia", "secuenciaci\xF3n", "secuenciadores", "secuenciados", "secuencial", "secuenciar", "secuencias", "secuestrador", "secuestrar", "secuestro", "secular", "secundaria", "secundarias", "secundario", "secundarios", "sec\xF3", "sed", "seda", "sedante", "sede", "sedentario", "sediento", "sedoso", "seducir", "seductor", "see", "segar", "segmentaci\xF3n", "segmento", "segovia", "segregaci\xF3n", "segregar", "seguida", "seguidamente", "seguidas", "seguido", "seguidor", "seguidos", "seguimiento", "seguimos", "seguir", "segunda", "segundamente", "segundas", "segundo", "segundos", "segura", "seguramente", "seguras", "seguridad", "seguro", "seguros", "segur\xEDsimo", "seg\xFAn", "seis", "selecciona", "seleccionado", "seleccionan", "seleccionar", "selecci\xF3n", "selectiva", "selectividad", "sellar", "sello", "sellos", "selva", "selv\xE1tica", "semana", "semanal", "semanales", "semanalmente", "semanario", "semanas", "semblante", "sembrar", "semejante", "semejantes", "semejanza", "semejanzas", "semestral", "semestre", "semi", "semiabierta", "semianticadencia", "semiauxiliares", "semicadencia", "semiconsonante", "semiconsonantes", "semiconsonate", "semiconson\xE1ntico", "semicorchea", "semifinal", "semifusa", "semilibre", "semilibres", "semilla", "semillas", "seminario", "seminci", "semitonos", "semivocal", "semivocales", "sem\xE1foro", "sem\xE1ntica", "sem\xE1nticamente", "sem\xE1nticas", "sem\xE1ntico", "sem\xE1nticos", "senado", "senador", "sencilla", "sencillamente", "sencillas", "sencillez", "sencillo", "sencillos", "senda", "senderismo", "senderista", "sendero", "sendos", "senectud", "senegal\xE9s", "senhor", "senil", "seno", "sensacional", "sensaciones", "sensaci\xF3n", "sensato", "sensibilidad", "sensibilizaci\xF3n", "sensible", "sensorial", "sensoriales", "sensum", "sentada", "sentado", "sentados", "sentamos", "sentaos", "sentar", "sentarme", "sentarse", "sentencia", "sentenciar", "sentido", "sentidos", "sentimental", "sentimiento", "sentimientos", "sentimos", "sentir", "sentirse", "sentirte", "sent\xE9", "sent\xED", "sent\xEDa", "sent\xF3", "sepa", "sepamos", "separa", "separaci\xF3n", "separada", "separadas", "separado", "separados", "separamos", "separar", "separarse", "sepas", "sepelio", "septentrional", "septentrionales", "septiembre", "septuagenario", "sepulcro", "sepultar", "sepultura", "sequedad", "sequ\xEDa", "ser", "serenar", "seres", "sergio", "seria", "seriamente", "serie", "seriedad", "series", "serio", "serios", "serles", "serlo", "sermonear", "sermones", "serm\xF3n", "serpiente", "serpientes", "serrano", "serrat", "servicio", "servicios", "servidor", "servilleta", "servilletas", "servir", "servirle", "servirles", "servirse", "serv\xEDan", "ser\xE1", "ser\xE1n", "ser\xE1s", "ser\xEDa", "ser\xEDan", "ser\xEDas", "sesenta", "sesent\xF3n", "seseo", "sesgado", "sesiones", "sesi\xF3n", "sesos", "seta", "setenta", "setiembre", "setos", "seudoatributivos", "seudocopulativos", "seudorreligiosas", "seud\xF3nimo", "seud\xF3nimos", "severa", "severamente", "severidad", "severo", "sevilla", "sevillanas", "sexagenario", "sexista", "sexo", "sexta", "sexto", "sexual", "sexuales", "se\xF1a", "se\xF1al", "se\xF1ala", "se\xF1alaba", "se\xF1aladas", "se\xF1alado", "se\xF1alados", "se\xF1alamiento", "se\xF1alan", "se\xF1alando", "se\xF1alar", "se\xF1ales", "se\xF1alizadas", "se\xF1o", "se\xF1or", "se\xF1ora", "se\xF1oras", "se\xF1ores", "se\xF1orial", "se\xF1oritas", "se\xF1orito", "se\xF1or\xEDa", "sgae", "shakira", "shhh", "shhhh", "shsss", "si", "siam\xE9s", "sic", "sicoan\xE1lisis", "sic\xF3logo", "sida", "sideral", "sider\xFArgica", "sido", "sidra", "sieben", "siembra", "siempre", "sienta", "sientan", "sientas", "siente", "sienten", "sientes", "siento", "sierra", "sierras", "siesta", "siete", "sietemesino", "sigamos", "sigan", "sigas", "sigilo", "siglas", "siglo", "siglos", "significa", "significaci\xF3n", "significado", "significados", "significar", "significar\xEDa", "significativa", "significativamente", "significativas", "significativo", "signo", "signos", "sigo", "sigue", "siguen", "sigues", "siguiente", "siguientes", "silabeada", "silabeo", "silbar", "silbido", "silenciar", "silencio", "silencios", "silencioso", "silla", "sillas", "sill\xF3n", "silueta", "silvestre", "silvio", "sil\xE1bica", "sil\xE1bicamente", "sil\xE1bicas", "sil\xE1bico", "simbolismo", "simb\xF3lica", "simb\xF3lico", "simb\xF3licos", "similar", "similares", "similitud", "similitudes", "simpatizar", "simpat\xEDa", "simpat\xEDas", "simple", "simplemente", "simples", "simplicidad", "simplificaci\xF3n", "simplificada", "simposio", "simp\xE1tica", "simp\xE1tico", "simulaciones", "simulaci\xF3n", "simulacro", "simuladas", "simular", "simultanear", "simultaneidad", "simult\xE1nea", "simult\xE1neamente", "simult\xE1neo", "sim\xF3n", "sin", "sinagoga", "sinagogas", "sinalefa", "sinalefas", "sincera", "sinceramente", "sinceridad", "sincero", "sinceros", "sincretismo", "sincronizada", "sincronizado", "sincronizar", "sincron\xEDa", "sincr\xF3nicamente", "sincr\xF3nico", "sindicales", "sindicarse", "sindicato", "sindicatos", "sinead", "sinergias", "sinfon\xEDa", "sinf\xEDn", "sing", "singladura", "singular", "singulares", "singularia", "singularidades", "singularizada", "siniestro", "sino", "sinonimia", "sinopsis", "sintagma", "sintagmas", "sintagm\xE1ticos", "sintaxis", "sintetizando", "sintetizar", "sinti\xE9ndolo", "sinti\xF3", "sintonizar", "sint\xE1ctica", "sint\xE1cticas", "sint\xE1cticos", "sint\xE9tica", "sint\xE9tico", "sint\xE9ticos", "sinuosidad", "sinuoso", "sin\xE9resis", "sin\xF3nimas", "sin\xF3nimos", "siquiatra", "siquiera", "sirena", "siroco", "sirrema", "sirva", "sirvan", "sirve", "sirven", "sirviera", "sirvo", "sis", "sistema", "sistemas", "sistematizaciones", "sistematizaci\xF3n", "sistem\xE1tica", "sitiar", "sitio", "sitios", "situacionales", "situaciones", "situaci\xF3n", "situada", "situadas", "situado", "situar", "sit\xFAa", "sit\xFAan", "si\xE9ntanse", "si\xE9ntate", "si\xE9ntese", "si\xE9ntete", "si\xF3n", "slogan", "sm", "sms", "sn", "so", "sobado", "soberan\xEDa", "soborno", "sobra", "sobradamente", "sobrado", "sobran", "sobrar", "sobrasada", "sobre", "sobrecarga", "sobrecargada", "sobrecargar", "sobrecoge", "sobrecoger", "sobreentendidos", "sobreesdr\xFAjulas", "sobreexpuesta", "sobrellevar", "sobremanera", "sobremesa", "sobrenombres", "sobrentendidos", "sobrentiende", "sobrepasar", "sobreproteger", "sobresaliente", "sobresalir", "sobresdr\xFAjulas", "sobresdr\xFAjulos", "sobrestimar", "sobrevenir", "sobreviene", "sobrevino", "sobrevivido", "sobrevivir", "sobrevolar", "sobrina", "sobrino", "sobrio", "sociabilidad", "sociable", "social", "sociales", "socialismo", "socialista", "socializaci\xF3n", "sociativo", "sociedad", "sociedades", "socio", "sociocultural", "socioculturales", "socioc\xE9ntricas", "sociolaboral", "sociolog\xEDa", "sociol\xF3gico", "socios", "soci\xF3logo", "socorrer", "socorrista", "socorristas", "socorro", "socr\xE1ticos", "sofista", "sofoco", "sofre\xEDr", "sof\xE1", "sof\xEDa", "sois", "soja", "sol", "sola", "solamente", "solapa", "solapamiento", "solapamientos", "solar", "solariega", "solariego", "solas", "soldado", "soldados", "soldar", "soleada", "soleado", "soledad", "solemne", "soler", "solera", "sole\xE1", "solfeo", "solicita", "solicitados", "solicitamos", "solicitan", "solicitando", "solicitar", "solicito", "solicitud", "solicitudes", "solidaridad", "solidario", "solidarios", "solidez", "solidificar", "solista", "solitario", "solo", "solomillo", "solos", "solsticio", "soltar", "soltarse", "soltera", "soltero", "solter\xF3n", "soltura", "soluciona", "solucionado", "solucionar", "solucionarlo", "solucione", "solucionen", "soluciones", "soluci\xF3n", "solvencia", "sol\xEDa", "sombra", "sombras", "sombrear", "sombrero", "sombreros", "sombrilla", "sombr\xEDo", "someter", "someterse", "sometidas", "sometido", "somet\xED", "somnolencia", "somos", "son", "sonado", "sonante", "sonar", "sonata", "soneto", "sonia", "sonido", "sonidos", "soniquete", "sono", "sonora", "sonoras", "sonoridad", "sonoro", "sonoros", "sonre\xEDa", "sonre\xEDrle", "sonriente", "sonrientes", "sonrisa", "sonroja", "sonrojarse", "sonrojo", "sonsonete", "son\xF3", "sopa", "sopas", "sopera", "sopero", "soplar", "soplo", "soponcio", "sopor", "soporta", "soportaba", "soportar", "soportar\xEDa", "soporte", "soporto", "sopor\xEDfero", "soprano", "sor", "sorber", "sorbete", "sorbo", "sorbos", "sorda", "sordas", "sordo", "sordos", "soria", "soroche", "sorprendan", "sorprende", "sorprenden", "sorprendente", "sorprender", "sorprenderme", "sorprenderse", "sorprendida", "sorprendido", "sorprendidos", "sorprendi\xF3", "sorprendo", "sorprend\xED", "sorpresa", "sortear", "sorteo", "sos", "sosegado", "sosiego", "soso", "sospecha", "sospechar", "sospechas", "sospecho", "sospechoso", "sostener", "sostenibilidad", "sostenible", "sostenido", "sostiene", "sota", "sotana", "soy", "so\xF1aba", "so\xF1amos", "so\xF1ar", "so\xF1\xE1bamos", "so\xF1\xE9", "sp", "spanair", "sport", "sr", "sra", "sres", "sri", "ss", "ssnn", "standard", "startup", "stendhal", "stop", "su", "sua", "suave", "suaves", "suavidad", "suavizante", "suavizar", "suavizarla", "sub", "suban", "subas", "subasta", "subastar", "subcontratar", "subcut\xE1neo", "subdirector", "subdividirse", "sube", "suben", "subestimar", "subida", "subidas", "subid\xF3n", "subiendo", "subieran", "subieron", "subir", "subirme", "subirnos", "subirse", "subj", "subjetiva", "subjetividad", "subjetivo", "subjetivos", "subjuntivo", "sublevaci\xF3n", "sublime", "submarinismo", "submarino", "subo", "subordinaci\xF3n", "subordinada", "subordinadas", "subordinado", "subordinados", "subordinante", "subordinantes", "subrayado", "subrayar", "subrogaci\xF3n", "subrogar", "subsanar", "subsidio", "subsiguiente", "subsisten", "subsistencia", "subsistir", "substancia", "substantivo", "subtareas", "subtema", "subterr\xE1neos", "subtitulada", "subt\xEDtulo", "subt\xEDtulos", "suburbano", "subvenciones", "subvenci\xF3n", "subyacente", "sub\xED", "succionar", "suceda", "sucede", "suceder", "sucederse", "sucedido", "sucedi\xF3", "sucesivamente", "sucesivas", "sucesivo", "sucesi\xF3n", "suceso", "sucesor", "sucesos", "sucia", "sucias", "suciedad", "sucio", "sucios", "sucre", "suculento", "sucursal", "sucursales", "sud", "sudando", "sudar", "sudeste", "sudor", "sudores", "sudorosa", "suegra", "suegro", "suegros", "sueldo", "sueldos", "suele", "suelen", "suelo", "suelos", "suelta", "suelto", "suena", "suene", "suerte", "suertes", "sue\xF1es", "sue\xF1o", "sue\xF1os", "suficiente", "sufijo", "sufijos", "sufre", "sufrido", "sufridos", "sufrimiento", "sufrir", "sufrir\xE1n", "sufro", "sugerencia", "sugerencias", "sugeridos", "sugerir", "sugerirles", "sugerirte", "sugerir\xEDa", "suger\xEDa", "sugiere", "sugiero", "sugiriendo", "suite", "suiza", "sujetador", "sujetar", "sujeto", "sujetos", "sula", "sulf\xFArico", "suma", "sumamente", "sumar", "sumario", "sumergida", "sumergir", "sumiller", "suministrar", "suministro", "sumirse", "sumisi\xF3n", "summarino", "sumo", "suntuarias", "sup", "supe", "super", "superaci\xF3n", "superados", "superar", "superar\xE1s", "superdif\xEDcil", "superdotado", "superficial", "superficie", "superficies", "superguapo", "superior", "superiores", "superioridad", "superlativo", "superlativos", "supermercado", "supermercados", "superpoblaci\xF3n", "superpoblado", "superproparox\xEDtonas", "superpuestas", "supervises", "supervivencia", "supiera", "supina", "supino", "supiste", "suplemento", "suplementos", "suplente", "supletoria", "supletorias", "supletorio", "suplica", "suplicar", "suplicarle", "suplico", "suplir", "supo", "supondr\xE1", "supone", "suponen", "suponer", "supongan", "supongo", "suposici\xF3n", "supositorio", "suprasegmentales", "suprema", "supremo", "supresi\xF3n", "suprimiendo", "suprimir", "supuesta", "supuestamente", "supuestas", "supuesto", "supuestos", "supurar", "sur", "surcos", "surge", "surgidas", "surgido", "surgir", "surgi\xF3", "surja", "surjan", "suroeste", "surrealista", "surtidor", "surtir", "surt\xEDa", "sus", "susana", "susceptibilidad", "susceptibilidades", "susceptible", "susceptibles", "suscita", "suscitar", "susciten", "suscribe", "suscribirse", "suscribo", "suspender", "suspendida", "suspendidas", "suspendido", "suspense", "suspensivo", "suspensivos", "suspensi\xF3n", "suspenso", "sussituaciones", "sust", "sustancia", "sustancial", "sustancialmente", "sustantiva", "sustantivaci\xF3n", "sustantivador", "sustantivados", "sustantivas", "sustantivo", "sustantivos", "sustituci\xF3n", "sustituible", "sustituir", "sustituirlo", "sustituirse", "sustitutivo", "sustituto", "sustituya", "sustituye", "sustituyendo", "susto", "sustracci\xF3n", "susurrar", "susurro", "sutiles", "sutilmente", "suya", "suyo", "suyos", "su\xE1rez", "sv", "svo", "s\xE1bado", "s\xE1bados", "s\xE1nchez", "s\xE1ndwich", "s\xE9", "s\xE9ptimo", "s\xE9timo", "s\xED", "s\xEDlaba", "s\xEDlabas", "s\xEDlabo", "s\xEDmbolo", "s\xEDmbolos", "s\xEDncopa", "s\xEDncope", "s\xEDncrona", "s\xEDntesis", "s\xEDntoma", "s\xEDntomas", "s\xEDrvete", "s\xEDsmico", "s\xED\xED\xED\xED", "s\xF3crates", "s\xF3lida", "s\xF3lido", "s\xF3lidos", "s\xF3lo", "s\xF3tano", "s\xFAbita", "s\xFAbitamente", "s\xFAper", "s\xFAplica", "t", "ta", "tabaco", "tabaso", "taberna", "tabernas", "tabique", "tabla", "tablao", "tablas", "tablero", "tabl\xF3n", "tab\xFA", "tab\xFAes", "tac", "tacarigua", "taca\xF1o", "tachados", "tachar", "taco", "taconear", "tacones", "tacos", "tacto", "tac\xF3n", "tad", "tailand\xE9s", "tajada", "tajante", "tajo", "tal", "talando", "talante", "talar", "talasoterapia", "talavera", "talento", "tales", "talla", "tallado", "tallaje", "tallar", "taller", "talleres", "tallo", "talmente", "talonario", "talones", "tal\xF3n", "tama\xF1o", "tama\xF1os", "tambalearse", "tambi\xE9n", "tamborada", "tampoco", "tan", "tanatorio", "tanatorios", "tangente", "tangible", "tango", "tangos", "tanque", "tanta", "tantas", "tanto", "tantos", "tantum", "tapa", "tapar", "tapas", "tapear", "tapeo", "tapia", "tapiz", "tapizado", "tapizar", "tapujos", "tap\xF3n", "taquilla", "taquillas", "taquillero", "tar", "tara", "tarantos", "tararear", "tarda", "tardaban", "tardado", "tardanza", "tardar", "tardaron", "tardarse", "tardar\xEDa", "tarde", "tardes", "tard\xEDa", "tard\xEDas", "tard\xEDo", "tarea", "tareas", "tarifa", "tarija", "tarima", "tarimas", "tarjeta", "tarjetas", "tarjeteros", "tarragona", "tarro", "tarta", "tartamudeando", "tartamudear", "tartas", "tasa", "tasaci\xF3n", "tasada", "tasado", "tasar", "tasca", "tascas", "tatarabuelo", "tataranieto", "tautol\xF3gicos", "taxi", "taxis", "taxista", "taxistas", "taza", "tazas", "taz\xF3n", "te", "teatral", "teatrales", "teatro", "teatros", "techo", "tecla", "teclado", "tecnolog\xEDa", "tecnolog\xEDas", "tecnol\xF3gica", "tecnol\xF3gicas", "tecnol\xF3gico", "tecnol\xF3gicos", "tedio", "tegucigalpa", "tehuantepec", "teide", "tejado", "tejas", "tejer", "tejido", "tel", "tela", "tele", "teleadicto", "teleasistencia", "telebasura", "telediario", "telediarios", "telefonazo", "telefonear", "telefone\xE9", "telefonista", "telefon\xEDa", "telef\xF3nica", "telef\xF3nicamente", "telef\xF3nicas", "telef\xF3nico", "telef\xF3nicos", "telegrama", "telegr\xE1fico", "telem\xE1ticos", "telenovela", "telenovelas", "telepredicadores", "telescopio", "telespectador", "teletipo", "teletrabajo", "televidente", "televisa", "televisada", "televisados", "televisar", "televisiva", "televisivas", "televisivo", "televisivos", "televisi\xF3n", "televisor", "telnet", "tel\xE9fono", "tel\xE9fonos", "tem", "tema", "temas", "tematizaci\xF3n", "tematizado", "tematizador", "temblando", "temblar", "temblor", "tembloroso", "temen", "temer", "temeraria", "temerario", "temeroso", "temerse", "temo", "temor", "temp", "temperamento", "temperatura", "temperaturas", "tempestades", "templada", "templado", "temple", "templo", "tempo", "temporada", "temporal", "temporales", "temporalidad", "temporalmente", "temporum", "temprano", "tem\xE1tica", "tem\xE1ticas", "tem\xE1tico", "tem\xEDa", "ten", "tenaz", "tenazas", "tenazmente", "tendencia", "tendencias", "tendencioso", "tender", "tendero", "tenderse", "tendido", "tendremos", "tendr\xE1", "tendr\xE1n", "tendr\xE1s", "tendr\xE9", "tendr\xEDa", "tendr\xEDais", "tendr\xEDamos", "tendr\xEDas", "tend\xF3n", "tened", "tenedor", "tenedores", "tenemos", "tener", "tenerlo", "tenerme", "tenerte", "tenga", "tengamos", "tengan", "tengas", "tengo", "teng\xE1is", "tenido", "teniendo", "tenis", "tenlo", "tenochtitl\xE1n", "tenor", "tensa", "tensar", "tensiones", "tensi\xF3n", "tenso", "tentativa", "tentempi\xE9", "tenue", "ten\xE9is", "ten\xEDa", "ten\xEDais", "ten\xEDamos", "ten\xEDan", "ten\xEDas", "teolog\xEDa", "teor\xEDa", "tequendama", "ter", "terapia", "terapias", "terap\xE9utico", "tercer", "tercera", "terceras", "tercero", "terceros", "terciario", "tercio", "terciopelo", "tercios", "teresa", "tergiversar", "termales", "termina", "terminaciones", "terminaci\xF3n", "terminad", "terminada", "terminadas", "terminado", "terminados", "terminal", "terminales", "terminamos", "terminan", "terminantemente", "terminao", "terminar", "terminarais", "terminarlo", "terminar\xE1", "terminas", "terminau", "termine", "terminemos", "termines", "terminis", "termino", "termin\xE9", "termo", "termom\xE9tricas", "termoterapia", "term\xF3metro", "ternera", "ternura", "terra", "terraza", "terremoto", "terremotos", "terreno", "terrenos", "terrero", "terrestre", "terrible", "territorial", "territoriales", "territorio", "terror", "terrorismo", "terrorista", "terr\xE1queo", "tersa", "terso", "tesauros", "tesina", "tesis", "tesorer\xEDa", "tesoro", "test", "testamento", "testar", "testificar", "testigo", "testigos", "testimonio", "testimonios", "tetras\xEDlabos", "texas", "textil", "texto", "textos", "textual", "textuales", "textualmente", "textura", "tez", "te\xF1ido", "te\xF1ir", "te\xF1irse", "te\xF3rica", "te\xF3rico", "tfno", "tgss", "th", "theta", "think", "thorvaldsen", "ti", "tiara", "tibia", "tibio", "tiembla", "tiempo", "tiempos", "tienda", "tiendas", "tiende", "tienden", "tiene", "tienen", "tienes", "tierno", "tierra", "tierras", "tieso", "tif\xF3n", "tigra", "tigre", "tijeras", "tikal", "tila", "tildar", "tilde", "timbrado", "timbre", "timidez", "tim\xF3n", "tinerfe\xF1o", "tino", "tinta", "tinte", "tinto", "tintorer\xEDa", "tipo", "tipogr\xE1fica", "tipogr\xE1ficos", "tipolog\xEDa", "tipolog\xEDas", "tipos", "tique", "tira", "tirabeque", "tirada", "tirado", "tirador", "tirando", "tirante", "tirantes", "tiran\xEDa", "tirar", "tirarse", "tiras", "tirita", "tiritando", "tiritar", "tiro", "tiros", "tir\xF3n", "tis", "tisana", "titicaca", "titubear", "titubeo", "titubeos", "titulaciones", "titulaci\xF3n", "titular", "titulares", "titularse", "tizoc", "tlc", "tl\xE1loc", "tl\xE1ntico", "to", "toalla", "tobillo", "tobog\xE1n", "toca", "tocan", "tocar", "tocarle", "tocarlo", "tocarse", "tocateja", "toco", "toc\xF3", "toda", "todas", "todav\xEDa", "todo", "todos", "todoterreno", "toga", "toledo", "tolerancia", "tolerante", "tolerar", "toltecas", "toma", "tomada", "tomadas", "tomado", "tomamos", "tomar", "tomara", "tomaras", "tomarla", "tomarle", "tomarme", "tomaron", "tomarse", "tomar\xE1n", "tomas", "tomate", "tomates", "tomatl", "tome", "tomemos", "tomes", "tomillo", "tomo", "tom\xE1rselo", "tom\xE9", "tom\xF3", "tonal", "tonales", "tonalidad", "tonel", "tonelada", "toneladas", "tonema", "tonemas", "toni", "tono", "tonta", "tonter\xEDa", "tonter\xEDas", "tonto", "tontos", "tope", "topes", "topicalizaci\xF3n", "topicalizado", "topograf\xEDa", "topogr\xE1fico", "toponimia", "top\xF3nimo", "top\xF3nimos", "toque", "toques", "tor", "torcer", "torcerse", "torcido", "torero", "tormenta", "tormentosa", "tornado", "tornar", "torneo", "torneos", "torniquete", "torno", "torn\xF3", "toro", "toros", "torpe", "torpedo", "torpeza", "torre", "torrencial", "torres", "torta", "tortazo", "tortilla", "tortuga", "tortuoso", "tor\xE1", "tor\xE1cico", "tos", "tosco", "tose", "toser", "tost\xF3n", "total", "totales", "totalidad", "totalitario", "totalizadora", "totalmente", "tours", "tout", "tr", "tra", "trabadas", "trabaj", "trabaja", "trabajaba", "trabajabas", "trabajado", "trabajador", "trabajadora", "trabajadores", "trabajados", "trabajamos", "trabajan", "trabajando", "trabajar", "trabajar\xEDas", "trabajas", "trabaje", "trabajo", "trabajos", "trabar", "tracci\xF3n", "tractor", "tradicional", "tradicionales", "tradicionalmente", "tradiciones", "tradici\xF3n", "traducciones", "traducci\xF3n", "traducir", "traducirlo", "traductor", "traductores", "traduzcan", "trae", "traer", "traerme", "traerte", "traes", "traficar", "traga", "tragaderas", "tragar", "tragedia", "tragicomedia", "trago", "trag\xF3n", "traicionar", "traici\xF3n", "traidores", "traiga", "traigas", "traigo", "traig\xE1is", "traje", "trajeras", "trajes", "trajo", "trama", "tramar", "tramitaciones", "tramitaci\xF3n", "tramitar", "tramo", "tramontano", "trampa", "trampas", "trance", "tranquila", "tranquilamente", "tranquilidad", "tranquiliza", "tranquilizadores", "tranquilizarse", "tranquilo", "tranquil\xEDzate", "trans", "transaccional", "transaccionales", "transacci\xF3n", "transatl\xE1ntico", "transbordo", "transcendental", "transcripciones", "transcripci\xF3n", "transcurre", "transcurrir", "transcurri\xF3", "transcurso", "transexual", "transe\xFAnte", "transferencia", "transferir", "transfiguraci\xF3n", "transfigur\xF3", "transformable", "transformaci\xF3n", "transformado", "transformador", "transformar", "transformarse", "transform\xF3", "transfusi\xF3n", "transgredir", "transgresi\xF3n", "transg\xE9nicas", "transg\xE9nicos", "transicionales", "transici\xF3n", "transitable", "transitivas", "transitivo", "transitivos", "transl\xFAcido", "transmilenio", "transmisi\xF3n", "transmita", "transmitan", "transmite", "transmitido", "transmitir", "transmitirle", "transmitirles", "transmitir\xE1", "transmito", "transparencia", "transparencias", "transparente", "transpira", "transpiraci\xF3n", "transpirar", "transportar", "transporte", "transportes", "transversal", "tranv\xEDa", "tranv\xEDas", "trapecio", "trapichear", "trapicheo", "trapillo", "trapo", "tras", "trasbordador", "trascendencia", "trascendental", "trascripci\xF3n", "trasera", "trasero", "traseros", "trasferencia", "trasformar", "traslaci\xF3n", "traslada", "trasladar", "trasladaron", "trasladarse", "traslado", "traslad\xE9", "trasl\xFAcido", "trasmitir", "trasnochar", "traspapelarse", "traspasaba", "traspasar", "traspi\xE9", "trasplantar", "trasplante", "trastero", "trastienda", "trasto", "trastorno", "trastornos", "trastos", "trata", "trataba", "tratado", "tratados", "tratamiento", "tratamientos", "tratamietno", "tratan", "tratando", "tratante", "tratar", "tratara", "tratar\xE1", "trate", "traten", "trates", "trato", "tratos", "trat\xE9is", "traumatismo", "traumatolog\xEDa", "traumat\xF3logo", "traves\xEDa", "travieso", "traviesos", "trav\xE9s", "trayecto", "trayectoria", "trayectos", "trazar", "tra\xEDa", "tra\xEDdo", "trecho", "tree", "tregua", "treinta", "treinta\xF1ero", "tremenda", "tremendamente", "tremendo", "tremendos", "tren", "trenes", "trenza", "trepadora", "trepar", "trepidante", "tres", "trescientos", "tresillo", "triangulaci\xF3n", "triangular", "tribu", "tribuna", "tribunal", "tributaria", "tributo", "trienio", "trigo", "trilce", "trillado", "trillar", "trillizos", "trimestral", "trina", "trinchera", "trino", "triple", "triplemente", "triplicar", "triptongo", "triptongos", "tripulaci\xF3n", "tripular", "triste", "tristes", "tristeza", "tris\xEDlabos", "triturar", "triunfal", "triunfalmente", "triunfante", "triunfar", "triunfo", "trivial", "triz", "tri\xE1ngulo", "tri\xFAnfo", "trocaico", "trocar", "trocear", "trochita", "trocito", "trocitos", "trofeo", "trolebuses", "troleb\xFAs", "trompa", "trompeta", "tronar", "troncal", "tronco", "tropa", "tropas", "tropec\xE9", "tropezar", "tropical", "tropicales", "tropical\xEDsimo", "tropiezo", "trotar", "trozo", "trozos", "tru", "trucar", "trueno", "trueque", "tr\xE1eme", "tr\xE1fico", "tr\xE1game", "tr\xE1mite", "tr\xE1mites", "tr\xE1nsfuga", "tr\xE1nsito", "tr\xE9boles", "tr\xEDo", "tr\xEDpode", "tr\xF3pico", "tsch", "tu", "tubo", "tuc\xE1n", "tud", "tufo", "tum", "tumba", "tumbada", "tumbado", "tumbarse", "tumbas", "tumb\xE9", "tumor", "tuna", "tundra", "tunos", "tupida", "tupido", "turbias", "turbio", "turismo", "turista", "turistas", "turnamos", "turnar", "turno", "turnos", "turquesa", "turr\xF3n", "tur\xEDstica", "tur\xEDsticas", "tur\xEDstico", "tur\xEDsticos", "tus", "tute", "tutear", "tutelados", "tuteo", "tutor", "tutor\xEDa", "tuve", "tuviera", "tuvierais", "tuvieron", "tuvimos", "tuvo", "tuya", "tuyamente", "tuyas", "tuyo", "tv", "tve", "tx", "t\xE1", "t\xE1cito", "t\xE1cticas", "t\xE1ctil", "t\xE1ctiles", "t\xE9", "t\xE9cnica", "t\xE9cnicamente", "t\xE9cnicas", "t\xE9cnico", "t\xE9rmica", "t\xE9rmicas", "t\xE9rmico", "t\xE9rmino", "t\xE9rminos", "t\xEDa", "t\xEDmida", "t\xEDmido", "t\xEDmpano", "t\xEDo", "t\xEDos", "t\xEDpica", "t\xEDpicas", "t\xEDpico", "t\xEDpicos", "t\xEDrate", "t\xEDteres", "t\xEDtulo", "t\xEDtulos", "t\xEDvoli", "t\xF3matelo", "t\xF3nica", "t\xF3nicas", "t\xF3nico", "t\xF3nicos", "t\xF3pico", "t\xF3picos", "t\xF3rrido", "t\xF3xica", "t\xF3xico", "t\xF3xicos", "t\xFA", "t\xFAnel", "t\xFAnica", "u", "ua", "uad", "uarr", "ubica", "ubicaciones", "ubicaci\xF3n", "ubicada", "ubicado", "ubicados", "ubican", "ubicar", "ubicuidad", "uci", "ucir", "ud", "uds", "ue", "uefa", "uey", "uf", "ui", "uir", "ullar", "ullir", "ulterior", "ulteriormente", "ultimar", "ultra", "ultracorrecci\xF3n", "ultramarino", "ultramarinos", "ultraserrana", "ultratumba", "umbre", "un", "una", "unamuno", "unas", "unass", "une", "uned", "unedal", "unen", "unesco", "unida", "unidad", "unidades", "unidas", "unido", "unidos", "uniforme", "uniformidad", "uniones", "unipersonales", "unir", "unirse", "unitario", "universal", "universales", "universidad", "universidades", "universitaria", "universitarias", "universitario", "universitarios", "universo", "uni\xF3", "uni\xF3n", "uno", "unos", "un\xEDsono", "upsala", "urbana", "urbanas", "urbanidad", "urbanismo", "urbanizable", "urbanizaciones", "urbanizaci\xF3n", "urbanizada", "urbanizado", "urbanizados", "urbano", "urbanos", "urban\xEDstica", "urbe", "urdir", "urge", "urgencia", "urgencias", "urgente", "urgentes", "urgir", "urna", "uruguay", "uruguayo", "us", "usa", "usaba", "usaban", "usada", "usadas", "usado", "usados", "usamos", "usan", "usar", "usaremos", "usarla", "usarlo", "usarse", "usen", "uses", "uso", "usos", "usted", "ustedes", "usual", "usualmente", "usuario", "usuarios", "usufructo", "uta", "utensilio", "utilicen", "utilidad", "utilidades", "utilitario", "utiliza", "utilizable", "utilizaci\xF3n", "utilizada", "utilizadas", "utilizado", "utilizados", "utilizan", "utilizando", "utilizar", "utilizo", "utiliz\xF3", "utop\xEDa", "uu", "uvas", "uve", "uvi", "uvia", "uvular", "uyu", "u\xF1a", "u\xF1as", "v", "va", "vaca", "vacacional", "vacacionales", "vacaciones", "vacaci\xF3n", "vacante", "vacas", "vaciar", "vacilaci\xF3n", "vacilante", "vacilar", "vacuna", "vacunaci\xF3n", "vacunarse", "vacunas", "vacuno", "vacuo", "vac\xEDa", "vac\xEDas", "vac\xEDo", "vac\xEDos", "vado", "vaga", "vagar", "vago", "vagos", "vaguear", "vaguedad", "vag\xF3n", "vaho", "vah\xEDdo", "vainilla", "vais", "vaiv\xE9n", "vajilla", "vald\xE9s", "vale", "valencia", "valent\xEDa", "valer", "valeriana", "valga", "validado", "validar", "validez", "valiente", "valija", "valiosa", "valioso", "vallas", "valle", "vallejo", "valor", "valora", "valoraciones", "valoraci\xF3n", "valorado", "valorar", "valorativa", "valorativas", "valorativo", "valorativos", "valores", "valorizarse", "val\xEDa", "vamos", "van", "vanguardia", "vanguardias", "vanguardista", "vano", "vapor", "vaqueros", "vara", "vargas", "variabilidad", "variable", "variables", "variaciones", "variaci\xF3n", "variadas", "variados", "variante", "variantes", "variar", "varias", "varicela", "variedad", "variedades", "varios", "var\xF3n", "vas", "vasca", "vasco", "vaso", "vasos", "vasto", "vaticinar", "vaya", "vayamos", "vayan", "vayas", "vay\xE1is", "vc", "vcc", "vd", "vds", "ve", "vea", "veamos", "vean", "veas", "veces", "vecina", "vecinal", "vecinales", "vecindario", "vecino", "vecinos", "veeenga", "vega", "vegetaci\xF3n", "vegetal", "vegetales", "vegetariana", "vegetariano", "vegetarianos", "vehemente", "veh\xEDculo", "veh\xEDculos", "veinte", "veintiocho", "veintiuna", "veis", "vejez", "vela", "velada", "velado", "velar", "velares", "velarizaci\xF3n", "velatorio", "velero", "vello", "velo", "velocidad", "veloz", "velozmente", "vel\xE1zquez", "vemos", "ven", "venas", "vence", "vencer", "vencido", "vencimiento", "venda", "vendar", "vendaval", "vende", "vendedor", "venden", "vender", "vendidas", "vendimia", "vendi\xF3", "vendr\xE1", "vendr\xE1n", "vendr\xEDa", "veneno", "venenos", "venenosa", "venenosas", "venerar", "venezolano", "venezuela", "venga", "vengan", "venganza", "vengas", "vengo", "veng\xE1is", "venia", "venial", "venidero", "venideros", "venido", "venimos", "venir", "venirle", "venirse", "venta", "ventaja", "ventajas", "ventajosa", "ventajoso", "ventana", "ventanales", "ventanas", "ventanilla", "ventas", "ventisca", "venus", "ven\xEDa", "ven\xEDas", "ven\xEDs", "veo", "ver", "veracidad", "veracruz", "veraneante", "veranear", "veraneo", "verane\xE1bamos", "veraniego", "verano", "veranos", "veraz", "verbal", "verbales", "verbalizaci\xF3n", "verbalizar", "verbalmente", "verbena", "verbigracia", "verbo", "verbos", "verdad", "verdadera", "verdaderamente", "verdaderas", "verdadero", "verdaderos", "verde", "verdemente", "verdes", "verdor", "verdura", "verduras", "vereda", "veredicto", "veremos", "vergonzoso", "vergonzosos", "verg\xFCenza", "verificaci\xF3n", "verificar", "verla", "verle", "verles", "verlo", "verme", "vernos", "veros", "verosimilitud", "veros\xEDmil", "versalita", "verse", "versi\xF3n", "verso", "vers\xE1til", "verte", "vertebrado", "vertedero", "vertederos", "verter", "vertical", "verticalidad", "vertiente", "vertiginoso", "ver\xE1n", "ver\xE1s", "ver\xE9", "ver\xEDa", "ver\xEDais", "ver\xF3nica", "ves", "vestido", "vestidos", "vestigio", "vestir", "vestirse", "vestuario", "vestuarios", "vest\xEDbulo", "vest\xEDbulos", "ves\xEDcula", "veta", "vete", "veterano", "veterinaria", "veterinario", "vetusta", "vetusto", "vez", "ve\xEDa", "ve\xEDan", "vi", "viabilidad", "viable", "viaja", "viajaba", "viajar", "viajaremos", "viaje", "viajero", "viajeros", "viajes", "vial", "viandante", "viasa", "vibraciones", "vibraci\xF3n", "vibrante", "vibrantes", "vicar\xEDa", "vice", "vicente", "vicepresidente", "vicerrector", "viceversa", "vicio", "victoria", "victoriosamente", "victorioso", "vida", "vidas", "videoconferencia", "videojuego", "videollamada", "videoteca", "vidrio", "vie", "vieja", "viejas", "viejecito", "viejo", "viejos", "viendo", "viene", "vienen", "vienes", "viento", "vientos", "vientre", "viera", "vieres", "viernes", "vieron", "viese", "viga", "vigencia", "vigente", "vigilada", "vigilancia", "vigilante", "vigilantes", "vigilar", "vigilen", "vigilia", "vigne", "vigo", "vigor", "vigorosidad", "vigoroso", "vig\xE9simo", "vii", "viii", "vilipendiar", "villa", "villancico", "villancicos", "villegas", "vilo", "vimos", "vinagre", "vinagreta", "vinculaci\xF3n", "vinculadas", "vinculado", "vincular", "vincularse", "viniendo", "viniera", "vinieras", "vinieron", "viniese", "vinimos", "viniste", "vino", "vinos", "vio", "violaci\xF3n", "violar", "violencia", "violenta", "violentas", "violento", "violinista", "violonchelo", "viol\xEDn", "vira", "viraje", "virar", "virgen", "viro", "virreinatos", "virrey", "virtual", "virtuales", "virtualidad", "virtud", "virtudes", "virtuoso", "virus", "vir\xF3", "visado", "visceral", "viscosidad", "viscoso", "visibilidad", "visible", "visiblemente", "visibles", "visillo", "visiones", "visita", "visitante", "visitar", "visitarla", "visitarle", "visitas", "visi\xF3n", "vista", "vistas", "vistazo", "viste", "visten", "vistiera", "visto", "vistoso", "visual", "visuales", "visualizaci\xF3n", "visualizada", "visualizadas", "visualizarse", "vis\xF3", "vis\xF3n", "vital", "vitales", "vitalicia", "vitalicio", "vitaminas", "vitoria", "vitrina", "vitro", "viudo", "viv", "viva", "vivan", "vive", "viven", "vivencias", "vivero", "vives", "vividas", "vivido", "vivienda", "viviendas", "viviendo", "vivieran", "vivimos", "vivir", "vivir\xEDa", "vivo", "viv\xED", "viv\xEDa", "viv\xEDamos", "viz", "vizcaya", "vizconde", "vi\xE9ndola", "vi\xE9ramos", "vi\xF1a", "vi\xF1etas", "vladimir", "vo", "vocablos", "vocabulario", "vocaci\xF3n", "vocal", "vocales", "vocativo", "vocativos", "vocear", "voces", "voc\xE1lica", "voc\xE1licas", "voc\xE1lico", "voc\xE1licos", "voen", "volada", "voladas", "volado", "volador", "volantazo", "volante", "volantes", "volar", "volaron", "volcanes", "volcarse", "volc\xE1n", "volc\xE1nica", "volc\xE1nico", "volc\xF3", "voleibol", "volframio", "volitiva", "volitivos", "volumen", "voluminoso", "voluntaria", "voluntariado", "voluntario", "voluntarios", "voluntativo", "volvamos", "volvemos", "volver", "volveremos", "volverme", "volverse", "volver\xE1", "volver\xE1s", "volver\xE9", "volviera", "volvieron", "volviste", "volvi\xF3", "volv\xE9is", "volv\xED", "volv\xEDa", "vomitar", "vor", "voraz", "vos", "voseantes", "voseo", "vosotras", "vosotros", "votaci\xF3n", "votado", "votante", "votar", "votaron", "voto", "vox", "voy", "voyaestudiar", "voz", "vs", "vuela", "vuelco", "vuelo", "vuelos", "vuelta", "vueltas", "vuelto", "vuelva", "vuelvas", "vuelve", "vuelven", "vuelves", "vuestra", "vuestras", "vuestro", "vuestros", "vulgar", "vulgares", "vulgaridad", "vulnerabilidad", "vulnerar", "v\xE1lido", "v\xE1monos", "v\xE1so", "v\xE1ter", "v\xE9rtebra", "v\xEDa", "v\xEDas", "v\xEDbora", "v\xEDctima", "v\xEDctimas", "v\xEDdeo", "v\xEDdeos", "v\xEDnculo", "v\xEDnculos", "v\xEDrgenes", "v\xEDspera", "v\xEDsperas", "v\xEDtae", "v\xF3ley", "v\xF3mito", "v\xF3mitos", "w", "wagner", "was", "wau", "we", "web", "wenceslao", "what", "wifi", "wolframio", "www", "w\xE1ter", "x", "xe", "xeno", "xenofobia", "xero", "xerograf\xEDa", "xii", "xilo", "xil\xF3fono", "ximena", "xix", "xi\xF3n", "xv", "xvi", "xvii", "xviii", "xx", "xxi", "xxii", "y", "ya", "yaaa", "yacente", "yacer", "yaciret\xE1", "yago", "yarda", "yarey", "ye", "yec", "yelmo", "yema", "yemen", "yendo", "yerba", "yermo", "yerno", "yernos", "yeso", "ye\xEDsmo", "yo", "yod", "yoga", "yogur", "yogurt", "york", "yt\xFA", "yuca", "yucat\xE1n", "yugoslavia", "yunque", "yuppie", "yuxtaponer", "yuxtaposici\xF3n", "yuxtapuestas", "yuxtapuesto", "z", "za", "zacatecas", "zaga", "zambullir", "zampar", "zanahoria", "zanahorias", "zanjar", "zapata", "zapatear", "zapatero", "zapater\xEDa", "zapatillas", "zapato", "zapatos", "zapear", "zapeo", "zar", "zara", "zaragoza", "zarpar", "zarrapastroso", "zarzuela", "zarzuelas", "zas", "zeta", "zigzag", "zimbabuense", "zinc", "zoco", "zodiaco", "zona", "zonas", "zoo", "zoolog\xEDa", "zool\xF3gico", "zorro", "zuecos", "zulia", "zum", "zumbido", "zumo", "zumos", "\xE1", "\xE1bados", "\xE1brela", "\xE1caros", "\xE1cido", "\xE1cidos", "\xE1cimo", "\xE1frica", "\xE1gil", "\xE1guila", "\xE1is", "\xE1lbum", "\xE1lbumes", "\xE1lex", "\xE1lgebra", "\xE1lvarez", "\xE1lvaro", "\xE1mbito", "\xE1mbitos", "\xE1ndale", "\xE1ndate", "\xE1ngel", "\xE1ngeles", "\xE1ngulo", "\xE1nimo", "\xE1nimos", "\xE1pice", "\xE1r", "\xE1rabe", "\xE1rabes", "\xE1rbitro", "\xE1rbol", "\xE1rboles", "\xE1rea", "\xE1reas", "\xE1rido", "\xE1rtico", "\xE1s", "\xE1spero", "\xE1tico", "\xE1tomo", "\xE1tona", "\xE1tonas", "\xE1tono", "\xE1tonos", "\xE1vidamente", "\xE1zimo", "\xE9", "\xE9bano", "\xE9chame", "\xE9l", "\xE9nfasis", "\xE9poca", "\xE9pocas", "\xE9ramos", "\xE9rrimo", "\xE9s", "\xE9tica", "\xE9ticamente", "\xE9tico", "\xE9ticos", "\xE9tnica", "\xE9tnicas", "\xE9tnicos", "\xE9xito", "\xE9xitos", "\xE9xodo", "\xED", "\xEDa", "\xEDbamos", "\xEDes", "\xEDgena", "\xEDgeno", "\xEDgera", "\xEDgero", "\xEDmpetu", "\xEDmprobo", "\xEDndice", "\xEDndices", "\xEDndole", "\xEDnfimo", "\xEDntegro", "\xEDntegros", "\xEDntimamente", "\xEDntimo", "\xEDrsele", "\xEDs", "\xEDsimo", "\xEDtem", "\xEDtems", "\xEDvora", "\xEDvoro", "\xF1", "\xF1o", "\xF1ora", "\xF1o\xF1o", "\xF1u", "\xF3", "\xF3bito", "\xF3leo", "\xF3n", "\xF3pera", "\xF3peras", "\xF3ptica", "\xF3ptico", "\xF3ptimas", "\xF3ptimo", "\xF3rbita", "\xF3rdenes", "\xF3rganos", "\xF3scar", "\xF3seo", "\xF3vulo", "\xF3vulos", "\xF3xidos", "\xFA", "\xFAbeda", "\xFAes", "\xFAl", "\xFAlcera", "\xFAltima", "\xFAltimamente", "\xFAltimas", "\xFAltimo", "\xFAltimos", "\xFAn", "\xFAnete", "\xFAnica", "\xFAnicamente", "\xFAnicas", "\xFAnico", "\xFAnicos", "\xFAtil", "\xFAtiles", "\xFC"];

  // lib/tagger/lexicon.ts
  var set = (s) => new Set(s.split(/\s+/).filter(Boolean));
  var ARTICLES = set("el la los las un una unos unas");
  var CONTRACTIONS = set("al del");
  var POSSESSIVES = set(`mi mis tu tus su sus nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras
  m\xEDo m\xEDa m\xEDos m\xEDas tuyo tuya tuyos tuyas suyo suya suyos suyas`);
  var DEMONSTRATIVES = set("este esta estos estas ese esa esos esas aquel aquella aquellos aquellas");
  var DEM_PRONOUNS = set("esto eso aquello");
  var QUANTIFIERS = set(`mucho mucha muchos muchas poco poca pocos pocas todo toda todos todas otro otra otros otras
  cada varios varias alg\xFAn alguno alguna algunos algunas ning\xFAn ninguno ninguna demasiado demasiada demasiados demasiadas
  bastante bastantes tanto tanta tantos tantas mismo misma mismos mismas cualquier cualquiera ambos ambas cierto cierta
  ciertos ciertas medio media tal tales unos unas`);
  var NUMBERS = set(`uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince diecis\xE9is
  diecisiete dieciocho diecinueve veinte veintiuno veintid\xF3s veintitr\xE9s veinticuatro veinticinco veintis\xE9is veintisiete
  veintiocho veintinueve treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento doscientos doscientas
  trescientos quinientos mil mill\xF3n millones primer primero primera primeros primeras segundo segunda tercer tercero
  tercera cuarto cuarta quinto quinta \xFAltimo \xFAltima \xFAltimos \xFAltimas`);
  var SUBJECT_PRONOUNS = set("yo t\xFA \xE9l ella usted nosotros nosotras ellos ellas ustedes vosotros vosotras vos");
  var TONIC_PRONOUNS = set("m\xED ti s\xED conmigo contigo consigo");
  var CLITICS2 = set("me te se nos os lo la los las le les");
  var PREPOSITIONS = set(`a ante bajo con contra de desde durante en entre hacia hasta mediante para por seg\xFAn sin
  sobre tras excepto salvo incluso`);
  var CONJUNCTIONS = set("y e o u ni pero sino que porque aunque si cuando mientras como pues");
  var INTERROGATIVES = set("qu\xE9 qui\xE9n qui\xE9nes d\xF3nde ad\xF3nde cu\xE1ndo c\xF3mo cu\xE1nto cu\xE1nta cu\xE1ntos cu\xE1ntas cu\xE1l cu\xE1les");
  var RELATIVES = set("que quien quienes donde adonde cual cuales cuyo cuya cuyos cuyas cuanto");
  var NEGATIVES = set("no nunca jam\xE1s tampoco nada nadie ninguno ninguna ning\xFAn");
  var INDEF_PRONOUNS = set("algo alguien nada nadie todo todos todas cualquiera");
  var INTERJECTIONS = set("hola adi\xF3s chao chau gracias ay oh eh uy ah ojal\xE1 s\xED ok okey uf guau");
  var ADVERBS = set(`muy m\xE1s menos bien mal ya tambi\xE9n tampoco siempre aqu\xED all\xED ah\xED ac\xE1 all\xE1 hoy ayer ma\xF1ana ahora
  antes despu\xE9s luego todav\xEDa a\xFAn aun casi solo s\xF3lo tan tanto mucho poco bastante demasiado nunca jam\xE1s pronto tarde
  temprano entonces quiz\xE1 quiz\xE1s acaso adem\xE1s apenas despacio deprisa r\xE1pido arriba abajo cerca lejos dentro fuera afuera
  adentro encima debajo delante detr\xE1s enfrente atr\xE1s adelante anoche anteayer pasado as\xED igual mejor peor mientras
  todav\xEDa incluso sobre_todo justo reci\xE9n enseguida juntos juntas solamente seguramente realmente claro`);
  var FUNCTION_HOMOGRAPHS = set(`como para sobre entre bajo nada mientras contra cerca medio claro cierto solo
  vale casi junto ante tras pasado seguro listo libre \xFAnico`);
  var NOUN_HOMOGRAPHS = set(`trabajo cena cambio viaje r\xEDo ayuda parte partes cocina estudio desayuno vista recibo
  camino compra dise\xF1o pregunta preguntas gasto programa programas contrato negocio traje ducha recuerdo ba\xF1o firma paso
  cuenta gusto metas despido sue\xF1o vuelo muestra paseo llamada visita respuesta comida bebida salida entrada parada
  llegada subida bajada apoyo duda falta juego lucha marcha nota pena prueba regalo reserva saludo vuelta reparto aumento
  ahorro consumo reforma demanda oferta reparo peso gobierno mando cargo encuentro fomento rechazo soluciones funciones
  proyecto casa centro queja proceso marca medio medios g\xE9nero art\xEDculo art\xEDculos p\xFAblico pr\xE1ctico pr\xE1ctica \xF3pera
  ampliaci\xF3n estudios contratos negocios cambios viajes cosa cosas nieve alegre informe tema muela tr\xE1mite sal sed vino
  sobre bajo carta canto cuento cocinas compras llamadas plato vaso mesa mano clase obra fin color calor caf\xE9 lleno
  limpio libre cambio pago env\xEDo orden olvido abrazo beso grito cuido descanso desarrollo intento cierre uso trato
  aviso viaje ruido baile camino cura dibujo ensayo charla siesta pelea cola copia multa critica pinta tapa carga
  espera cuesta vela venta alquiler mira manda parece ama amo cura llave hielo don papa vino`);
  var DETERMINER_LIKE = /* @__PURE__ */ new Set([
    ...ARTICLES,
    ...CONTRACTIONS,
    ...POSSESSIVES,
    ...DEMONSTRATIVES,
    "cada",
    "otro",
    "otra",
    "otros",
    "otras",
    "mucho",
    "mucha",
    "muchos",
    "muchas",
    "poco",
    "poca",
    "pocos",
    "pocas",
    "alg\xFAn",
    "alguna",
    "algunos",
    "algunas",
    "ning\xFAn",
    "ninguna",
    "varios",
    "varias",
    "buen",
    "buena",
    "mal",
    "gran",
    "primer",
    "primera",
    "tercer",
    "\xFAltimo",
    "\xFAltima",
    "nuevo",
    "nueva",
    "mismo",
    "misma",
    "demasiado",
    "demasiada",
    "tanto",
    "tanta",
    "tantos",
    "tantas",
    "qu\xE9",
    "cu\xE1nto",
    "cu\xE1nta",
    "cu\xE1ntos",
    "cu\xE1ntas",
    "dos",
    "tres",
    "cuatro"
  ]);
  var CORE_ADJ = `alto bajo grande peque\xF1o bueno malo nuevo viejo joven mayor menor mejor peor bonito lindo feo largo corto
  ancho estrecho gordo delgado flaco fuerte d\xE9bil r\xE1pido lento f\xE1cil dif\xEDcil caro barato rico pobre feliz triste contento
  cansado enfermo sano ocupado libre listo tranquilo nervioso aburrido divertido interesante importante necesario posible
  imposible probable seguro inseguro claro oscuro limpio sucio lleno vac\xEDo abierto cerrado caliente fr\xEDo fresco tibio
  rojo azul verde amarillo blanco negro gris morado rosado caf\xE9 naranja marr\xF3n primero segundo \xFAltimo pr\xF3ximo pasado
  siguiente anterior simp\xE1tico antip\xE1tico amable ch\xE9vere bacano raro normal extra\xF1o incre\xEDble terrible horrible genial
  perfecto excelente fant\xE1stico maravilloso precioso hermoso guapo serio alegre loco tonto inteligente listo amable
  t\xEDmido valiente orgulloso preocupado enojado bravo sorprendido emocionado asustado enamorado casado soltero
  divorciado separado viudo colombiano mexicano espa\xF1ol ingl\xE9s franc\xE9s alem\xE1n americano latino cale\xF1o bogotano paisa
  coste\xF1o solo junto mismo propio cierto verdadero falso real p\xFAblico privado social pol\xEDtico econ\xF3mico personal
  famoso popular moderno antiguo tradicional t\xEDpico local nacional internacional principal general especial diferente
  igual parecido distinto mejor \xFAtil in\xFAtil agradable desagradable c\xF3modo inc\xF3modo peligroso dulce salado amargo
  picante delicioso sabroso rico duro blando suave pesado ligero liviano lejano cercano diario semanal mensual anual
  \xFAnico \xFAltimo entero medio doble h\xFAmedo seco soleado nublado lluvioso tropical c\xE1lido templado verde maduro crudo
  cocido frito asado mojado roto perdido preparado sentado parado acostado dormido despierto vivo muerto embarazada
  responsable puntual educado grosero callado hablador trabajador perezoso juicioso sencillo complicado f\xE1cil sano
  cari\xF1oso celoso generoso taca\xF1o honesto sincero mentiroso curioso feliz infeliz satisfecho harto agotado relajado
  estresado ansioso deprimido animado entusiasmado capaz incapaz digno exacto r\xE1pido actual reciente`;
  var CORE_NOUN_M = `costo arriendo tranc\xF3n parcero celular carro computador apartamento bus jugo durazno parqueadero tiquete boleto mesero almuerzo
  desayuno d\xEDa mes a\xF1o fin momento rato tiempo lugar sitio barrio pueblo pa\xEDs mundo centro parque mercado
  supermercado restaurante hotel aeropuerto hospital colegio trabajo dinero peso precio problema tema sistema mapa
  idioma espa\xF1ol ingl\xE9s pap\xE1 hermano hijo abuelo t\xEDo primo amigo novio esposo se\xF1or hombre ni\xF1o chico muchacho pelado
  compa\xF1ero jefe vecino profesor estudiante doctor m\xE9dico perro gato libro cuaderno l\xE1piz esfero tel\xE9fono correo
  mensaje nombre apellido n\xFAmero cumplea\xF1os regalo caf\xE9 t\xE9 arroz pollo pescado huevo pan queso helado vino
  ba\xF1o cuarto piso techo edificio balc\xF3n patio jard\xEDn cielo sol mar r\xEDo lago viento fr\xEDo calor invierno verano
  f\xFAtbol partido equipo juego deporte gimnasio cine teatro concierto museo viaje paseo pasaje tren avi\xF3n metro taxi
  camino sem\xE1foro carro tranc\xF3n tr\xE1fico tr\xE1fico cuerpo brazo pie ojo pelo coraz\xF3n dolor est\xF3mago miedo sue\xF1o
  plan proyecto examen trabajo salario sueldo negocio banco cajero billete arepa tinto aguacate pl\xE1tano banano
  video chofer coctel mijo parce fr\xEDjol ma\xEDz mango ajiaco sancocho bocadillo chocolate dulce postre vaso plato tenedor cuchillo almac\xE9n`;
  var CORE_NOUN_F = `mija agua hambre casa calle ciudad plaza tienda oficina universidad escuela clase mam\xE1 madre hermana hija abuela t\xEDa
  prima amiga novia esposa se\xF1ora mujer ni\xF1a chica muchacha familia gente persona vida noche tarde ma\xF1ana semana hora
  vez comida cena bebida agua leche carne fruta verdura papa sopa ensalada cerveza gaseosa torta mesa silla cama
  puerta ventana cocina sala nevera ducha llave ropa camisa camiseta falda chaqueta chompa ruana bolsa maleta plata
  cuenta palabra pregunta respuesta idea verdad mentira historia noticia pel\xEDcula m\xFAsica canci\xF3n fiesta playa monta\xF1a
  finca isla selva lluvia nube cabeza mano boca cara nariz espalda pierna salud fiebre gripa farmacia droguer\xEDa
  medicina cita reuni\xF3n tarea nota carrera empresa compa\xF1\xEDa tarjeta moneda factura cuenta foto c\xE1mara computadora
  red p\xE1gina aplicaci\xF3n contrase\xF1a clave buseta moto bicicleta estaci\xF3n parada esquina cuadra carrera calle avenida
  arepa empanada natilla bu\xF1uelo panader\xEDa tienda`;
  var CORE_ADV = `ahorita ac\xE1 all\xE1 enseguida siempre nunca juntos despacio r\xE1pido temprano tarde bastante demasiado ojal\xE1
  tambi\xE9n tampoco quiz\xE1s quiz\xE1 apenas casi solo solamente todav\xEDa a\xFAn adem\xE1s entonces luego despu\xE9s antes pronto
  ya`;
  var LEX = /* @__PURE__ */ new Map();
  var FORMS = new Set(forms_default);
  var DEAC_LEMMA = /* @__PURE__ */ new Map();
  function put(lemma2, e, override = false) {
    const w = lemma2.replace(/_$/, "").replace(/_/g, " ");
    if (!w || !override && LEX.has(w)) return;
    LEX.set(w, e);
    DEAC_LEMMA.set(deaccent(w), w);
  }
  for (const [k, v] of Object.entries(lexicon_default)) {
    const [p, g] = v;
    put(k, p === "n" ? { pos: "noun", gender: g != null ? g : "m" } : p === "v" ? { pos: "inf" } : { pos: "x" });
  }
  for (const w of set(CORE_ADJ)) put(w, { pos: "adj" }, true);
  for (const w of set(CORE_NOUN_M)) put(w, { pos: "noun", gender: "m" }, true);
  for (const w of set(CORE_NOUN_F)) put(w, { pos: "noun", gender: "f" }, !LEX.has(w) || LEX.get(w).pos !== "noun");
  for (const w of set(CORE_ADV)) if (!LEX.has(w)) put(w, { pos: "adv" });
  function registerLexemes(entries) {
    var _a2;
    for (const e of entries) {
      const lemma2 = e.lemma.toLowerCase().trim();
      if (!lemma2 || lemma2.includes(" ")) continue;
      const p = ((_a2 = e.pos) != null ? _a2 : "").toLowerCase();
      const pos = /^n/.test(p) ? "noun" : /^adj/.test(p) ? "adj" : /^adv/.test(p) ? "adv" : /^v/.test(p) ? "inf" : "x";
      put(lemma2, { pos, gender: e.gender || void 0 }, !LEX.has(lemma2));
      FORMS.add(lemma2);
    }
  }
  var LEXEME_STOP = set("m\xE1s menos muy tan ya no s\xED tambi\xE9n tampoco a\xFAn aun todav\xEDa solo s\xF3lo casi tanto mucho poco bastante demasiado as\xED luego entonces pues algo nada");
  var NAMES = /* @__PURE__ */ new Set();
  function registerNames(names) {
    for (const n of names) NAMES.add(n.toLowerCase());
  }
  function isName(w) {
    return NAMES.has(w);
  }
  function lexEntry(w) {
    return LEX.get(w);
  }
  function isKnownForm(w) {
    return FORMS.has(w) || LEX.has(w);
  }
  function addKnownForms(ws) {
    for (const w of ws) FORMS.add(w);
  }
  function closedClass(w) {
    if (ARTICLES.has(w) || CONTRACTIONS.has(w)) return "det";
    if (POSSESSIVES.has(w)) return "poss";
    if (DEMONSTRATIVES.has(w)) return "dem";
    if (DEM_PRONOUNS.has(w) || SUBJECT_PRONOUNS.has(w) || TONIC_PRONOUNS.has(w) || INDEF_PRONOUNS.has(w)) return "pron";
    if (CLITICS2.has(w)) return "clitic";
    if (PREPOSITIONS.has(w)) return "prep";
    if (INTERROGATIVES.has(w)) return "int";
    if (w === "no" || w === "nunca" || w === "jam\xE1s" || w === "tampoco") return "neg";
    if (RELATIVES.has(w) && w !== "que" && w !== "cuanto") return "rel";
    if (CONJUNCTIONS.has(w)) return "conj";
    if (QUANTIFIERS.has(w)) return "quant";
    if (NUMBERS.has(w)) return "num";
    if (INTERJECTIONS.has(w)) return "interj";
    if (ADVERBS.has(w)) return "adv";
    return null;
  }
  function restore(cand) {
    if (LEX.has(cand)) return cand;
    const r = DEAC_LEMMA.get(deaccent(cand));
    if (!r) return null;
    for (let k = 0; k < r.length; k++) {
      if (/[áéíóú]/.test(r[k]) && cand[k] !== r[k] && /[aeiouáéíóú]/.test(r.slice(k + 1))) return null;
    }
    return r;
  }
  function singulars(w) {
    const out = [];
    if (w.endsWith("ces")) out.push(w.slice(0, -3) + "z");
    if (w.endsWith("es")) out.push(w.slice(0, -2));
    if (w.endsWith("s")) out.push(w.slice(0, -1));
    return out;
  }
  var PERSON_FEM = /(ora|ica|iga|ada|ana|esa|ona|ina|era|ista|ela|ita|ía)$/;
  function mascs(w) {
    const out = [];
    if (w.endsWith("a")) {
      out.push(w.slice(0, -1) + "o");
      out.push(w.slice(0, -1));
    }
    if (w.endsWith("esa")) out.push(w.slice(0, -3) + "\xE9s");
    if (w.endsWith("ona")) out.push(w.slice(0, -3) + "\xF3n");
    if (w.endsWith("ana")) out.push(w.slice(0, -3) + "\xE1n");
    return out;
  }
  var isAdjLike = (e) => !!e && (e.pos === "adj" || e.pos === "x");
  function lemmatize(w) {
    const direct = LEX.get(w);
    if (direct && direct.pos !== "x") return { lemma: w, entry: direct, viaForms: false };
    if (direct) {
      for (const s of singulars(w)) {
        const r = restore(s);
        if (r && LEX.get(r).pos === "noun") return { lemma: r, entry: LEX.get(r), viaForms: false };
      }
      return { lemma: w, entry: direct, viaForms: false };
    }
    const isimo = w.match(/^(.+)ísim[oa]s?$/);
    if (isimo) {
      const b = isimo[1];
      for (const c of [b + "o", b + "e", b, b.replace(/qu$/, "c") + "o", b.replace(/gu$/, "g") + "o"]) {
        const r = restore(c);
        if (r && isAdjLike(LEX.get(r))) return { lemma: r, entry: LEX.get(r), viaForms: false };
      }
    }
    const sing = [w, ...singulars(w)];
    for (const s of sing) {
      if (s !== w) {
        const r = restore(s);
        if (r) return { lemma: r, entry: LEX.get(r), viaForms: false };
      }
      for (const m of mascs(s)) {
        const r = restore(m);
        if (r && isAdjLike(LEX.get(r))) return { lemma: r, entry: LEX.get(r), viaForms: false };
        if (r && LEX.get(r).pos === "noun" && (LEX.get(r).gender === "m" || LEX.get(r).gender === "mf") && PERSON_FEM.test(s)) return { lemma: r, entry: LEX.get(r), viaForms: false };
      }
      if (/(jefa|nta)$/.test(s) && !LEX.has(s)) {
        const r = restore(s.slice(0, -1) + "e");
        if (r && LEX.get(r).pos === "noun") return { lemma: r, entry: LEX.get(r), viaForms: false };
      }
    }
    const mente = w.match(/^(.+)mente$/);
    if (mente) {
      const b = mente[1];
      if (restore(b) || restore(b.replace(/a$/, "o")) || FORMS.has(b) || FORMS.has(b.replace(/a$/, "o"))) return { lemma: w, entry: { pos: "adv" }, viaForms: false };
    }
    if (FORMS.has(w)) {
      for (const s of singulars(w)) if (FORMS.has(s)) return { lemma: s, viaForms: true };
      return { lemma: w, viaForms: true };
    }
    for (const s of [...singulars(w), w]) {
      if (s !== w && FORMS.has(s)) return { lemma: s, viaForms: true };
      for (const m of mascs(s)) if (FORMS.has(m)) return { lemma: m, viaForms: true };
    }
    return null;
  }

  // lib/tagger/words.ts
  var WORD_RE = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+(?:[.,:]\d+)*|[¿?¡!.,;:—–\-…"«»()“”]/g;
  var SENT_END = /* @__PURE__ */ new Set([".", "?", "!", "\u2026", ";", ":"]);
  var OPENERS = /* @__PURE__ */ new Set(["\xBF", "\xA1", "\u2014", "\u2013", "-", '"', "\xAB", "(", "\u201C"]);
  function tokenize2(text) {
    const out = [];
    let sentStart = true;
    for (const m of text.matchAll(WORD_RE)) {
      const t = m[0];
      const punct = !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d]/.test(t);
      const cap5 = /^[A-ZÁÉÍÓÚÜÑ]/.test(t);
      out.push({ i: out.length, text: t, w: t.toLowerCase(), punct, cap: cap5, capMid: cap5 && !sentStart, sentStart: !punct && sentStart });
      if (punct) {
        if (SENT_END.has(t) || t === "\u2014") sentStart = true;
        else if (!OPENERS.has(t)) sentStart = false;
      } else sentStart = false;
    }
    return out;
  }
  var INF = /* @__PURE__ */ new Map();
  var GER = /* @__PURE__ */ new Map();
  var REFLEXIVE_OF = /* @__PURE__ */ new Map();
  function pushM(m, k, v) {
    const l = m.get(k);
    if (l) {
      if (!l.includes(v)) l.push(v);
    } else m.set(k, [v]);
  }
  for (const v of VERBS) {
    const bare4 = isReflexive(v.inf) ? reflexiveBase(v.inf) : v.inf;
    pushM(INF, deaccent(bare4), v.inf);
    if (isReflexive(v.inf)) {
      REFLEXIVE_OF.set(bare4, v.inf);
      pushM(INF, deaccent(v.inf), v.inf);
    }
    try {
      pushM(GER, deaccent(gerund(v)), v.inf);
    } catch {
    }
  }
  function reflexiveOf(inf) {
    var _a2;
    if (isReflexive(inf)) return inf;
    return (_a2 = REFLEXIVE_OF.get(inf)) != null ? _a2 : null;
  }
  function bareOf(inf) {
    return isReflexive(inf) ? reflexiveBase(inf) : inf;
  }
  var CL_LIST = ["me", "te", "se", "nos", "os", "lo", "la", "los", "las", "le", "les"];
  function nonFinite(w) {
    const tryBase = (b, cl) => {
      const d = deaccent(b);
      const inf = INF.get(d);
      if (inf && /(ar|er|ir|ír)(se)?$/.test(b.replace(/[áé]/g, (c) => deaccent(c)))) {
        if (!cl.length || cl.length >= 2 || !/[áéíóú]/.test(b) || /ír$/.test(b)) return { pos: "inf", infs: inf, enclitics: cl };
      }
      const ger = GER.get(d);
      if (ger && /(ando|iendo|yendo|endo)$/.test(d)) {
        if (!cl.length || /[áé]/.test(b)) return { pos: "ger", infs: ger, enclitics: cl };
      }
      return null;
    };
    const bare4 = tryBase(w, []);
    if (bare4) return bare4;
    for (const c1 of CL_LIST) {
      if (!w.endsWith(c1) || w.length < c1.length + 2) continue;
      const b1 = w.slice(0, -c1.length);
      const r1 = tryBase(b1, [c1]);
      if (r1) return r1;
      for (const c2 of CL_LIST) {
        if (!b1.endsWith(c2) || b1.length <= c2.length + 2) continue;
        const r2 = tryBase(b1.slice(0, -c2.length), [c2, c1]);
        if (r2) return r2;
      }
    }
    return null;
  }
  function participle2(w) {
    const direct = participlesOf(w).filter((p) => p.tense === "perfecto").map((p) => p.inf);
    if (direct.length) return [...new Set(direct)];
    const m = w.match(/^(.+)(ada|adas|ados|ida|idas|idos|ída|ídas|ídos|ta|tas|tos|cha|chas|chos|sa|sas|sos)$/);
    if (!m) return [];
    const masc = w.replace(/as$|os$/, "o").replace(/a$/, "o");
    return [...new Set(participlesOf(masc).filter((p) => p.tense === "perfecto").map((p) => p.inf))];
  }
  function exactVerbReadings(w) {
    return analyzeToken(w).filter((a) => a.accentExact);
  }
  var PRE_NOMINAL = /* @__PURE__ */ new Set(["el", "un", "unos", "unas", "del", "al", "mi", "mis", "tus", "su", "sus", "nuestro", "nuestra", "nuestros", "nuestras", "cada", "varios", "varias", "alg\xFAn", "ning\xFAn"]);
  var PREP_BEFORE_VERB = /* @__PURE__ */ new Set(["hasta", "seg\xFAn", "salvo", "excepto", "incluso"]);
  var STRONG_VERB_CUES = /* @__PURE__ */ new Set([...SUBJECT_PRONOUNS, "no", "me", "te", "se", "nos", "os", "le", "les", "lo", "ya", "tambi\xE9n", "tampoco", "siempre", "nunca", "casi", "solo"]);
  var SUBORDINATORS = /* @__PURE__ */ new Set(["si", "que", "ojal\xE1", "aunque", "cuando", "quien", "donde", "mientras", "porque"]);
  var CLAUSE_LINKS = /* @__PURE__ */ new Set(["y", "e", "o", "u", "pero", "ni", "sino", "que", "porque", "cuando", "si", "aunque", "mientras", "donde", "pues"]);
  function isBoundary(t) {
    return !t || t.punct && t.w !== "-" && t.w !== '"' && t.w !== "\xAB" && t.w !== "\xBB";
  }
  function prevWord(toks, i) {
    const j = i - 1;
    if (j < 0 || toks[j].punct) return -1;
    return j;
  }
  function clauseHasOtherVerb(toks, i, unamb) {
    for (let j = i - 1; j >= 0 && !isBoundary(toks[j]) && !CLAUSE_LINKS.has(toks[j].w); j--) if (unamb[j]) return true;
    for (let j = i + 1; j < toks.length && !isBoundary(toks[j]) && !CLAUSE_LINKS.has(toks[j].w); j++) if (unamb[j]) return true;
    return false;
  }
  function sentenceHasOtherVerb(toks, i, cand) {
    for (let j = i - 1; j >= 0 && !(toks[j].punct && /[.?!…]/.test(toks[j].w)); j--) if (cand[j]) return true;
    for (let j = i + 1; j < toks.length && !(toks[j].punct && /[.?!…]/.test(toks[j].w)); j++) if (cand[j]) return true;
    return false;
  }
  function sameClause(toks, i, k) {
    const [a, b] = i < k ? [i, k] : [k, i];
    for (let j = a + 1; j < b; j++) if (isBoundary(toks[j]) || CLAUSE_LINKS.has(toks[j].w)) return false;
    return true;
  }
  function nominalPos(e) {
    if (!e || !e.entry) return null;
    const p = e.entry.pos;
    if (p === "noun" || p === "adj" || p === "adv" || p === "x") return p;
    if (p === "inf") return null;
    return "x";
  }
  var NADA_VERB_NEXT = /* @__PURE__ */ new Set(["bien", "mal", "muy", "mucho", "r\xE1pido", "en", "todos", "todas", "cada", "poco", "mejor", "peor", "como"]);
  function isFragmentEnd(toks, i) {
    const n = toks[i + 1];
    return !n || n.punct && /[.?!…,:;]/.test(n.w) || ["y", "o", "e", "u"].includes(n.w);
  }
  var SER_ESTAR_HABER = /* @__PURE__ */ new Set(["ser", "estar", "haber"]);
  var ARTICLE_LIKE = /* @__PURE__ */ new Set(["el", "la", "los", "las", "un", "una", "unos", "unas", "mi", "mis", "tu", "tus", "su", "sus"]);
  var ADJECTIVAL_PARTICIPLES = new Set("cansado ocupado aburrido preocupado enojado emocionado sorprendido interesado casado divorciado separado equivocado enamorado animado desanimado agotado estresado relajado confundido asustado avergonzado deprimido encantado despistado atrasado demorado acostumbrado mareado resfriado callado nublado despejado educado organizado desordenado complicado aburrido molesto dedicado cansada".split(/\s+/));
  function nounSlot(words2, pIdx, toks, i) {
    const prev2 = pIdx >= 0 ? words2[pIdx] : void 0;
    if (!prev2) return isFragmentEnd(toks, i);
    if (prev2.w === "hay" || ["quant", "num", "det", "poss", "dem", "prep"].includes(prev2.pos)) return true;
    if ((prev2.pos === "verb" || prev2.pos === "inf") && !SER_ESTAR_HABER.has(prev2.lemma)) return true;
    if (["y", "o", "e", "u", "ni"].includes(prev2.w)) {
      const p2 = words2[pIdx - 1];
      return !!p2 && p2.pos === "noun";
    }
    return false;
  }
  function analyzeWords(text) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const toks = tokenize2(text);
    const fin = toks.map((t) => t.punct || /^\d/.test(t.w) ? [] : exactVerbReadings(t.w));
    const nf = toks.map((t) => t.punct ? null : nonFinite(t.w));
    const part = toks.map((t) => t.punct ? [] : participle2(t.w));
    const cc = toks.map((t) => t.punct ? null : closedClass(t.w));
    const lem = toks.map((t) => t.punct ? null : lemmatize(t.w));
    const homog = toks.map((t, i) => fin[i].length > 0 && (cc[i] !== null || nominalPos(lem[i]) !== null || NOUN_HOMOGRAPHS.has(t.w)));
    const nameLike = toks.map((t) => t.capMid && !closedClass(t.w) || t.cap && isName(t.w));
    const unamb = toks.map((t, i) => fin[i].length > 0 && !homog[i] && !CLITICS2.has(t.w) && !nameLike[i]);
    const cand = toks.map((t, i) => fin[i].length > 0 && !CLITICS2.has(t.w) && !nameLike[i]);
    const words2 = [];
    for (const t of toks) {
      const i = t.i;
      const base = { ...t, pos: "unknown", lemma: t.w, known: true };
      if (t.punct) {
        words2.push({ ...base, pos: "punct" });
        continue;
      }
      if (/^\d/.test(t.w)) {
        words2.push({ ...base, pos: "num" });
        continue;
      }
      if (t.w === "hay") {
        words2.push({ ...base, pos: "verb", lemma: "haber", tense: "presente", verb: [{ inf: "haber", tense: "presente", person: "\xE9l/ella", form: "hay", type: "er", accentExact: true, target: true }] });
        continue;
      }
      const pIdx = prevWord(toks, i);
      const prev2 = pIdx >= 0 ? words2[pIdx] : void 0;
      const nominal = (_a2 = nominalPos(lem[i])) != null ? _a2 : NOUN_HOMOGRAPHS.has(t.w) ? "noun" : null;
      const asVerb2 = (weak) => ({ ...base, pos: "verb", lemma: fin[i][0].inf, verb: fin[i], ...weak ? { weak } : {} });
      const asNominal = (weak) => {
        var _a3, _b2;
        return { ...base, pos: nominal != null ? nominal : "x", lemma: (_b2 = (_a3 = lem[i]) == null ? void 0 : _a3.lemma) != null ? _b2 : t.w, known: !!lem[i], ...weak ? { weak } : {} };
      };
      const asClosed = () => ({ ...base, pos: cc[i], lemma: t.w });
      if (t.capMid && !cc[i] || t.cap && isName(t.w)) {
        words2.push({ ...base, pos: "propn" });
        continue;
      }
      if (t.cap && fin[i].length && fin[i].every((a) => a.variety === "voseo") && (((_b = fin[i + 1]) == null ? void 0 : _b.length) || ((_c = toks[i + 1]) == null ? void 0 : _c.w) === "," || ((_d = toks[i + 1]) == null ? void 0 : _d.w) === "y")) {
        words2.push({ ...base, pos: "propn" });
        continue;
      }
      const prev22 = pIdx >= 1 ? words2[pIdx - 1] : void 0;
      const afterDetAdj = prev2 && prev22 && (prev2.pos === "adj" || ["mayor", "menor", "mejor", "peor", "gran", "buen", "primer", "\xFAltimo", "nuevo", "nueva"].includes(prev2.w)) && PRE_NOMINAL.has(prev22.w);
      if (fin[i].length && !cc[i] && prev2 && (PRE_NOMINAL.has(prev2.w) || afterDetAdj || prev2.pos === "prep" && !PREP_BEFORE_VERB.has(prev2.w))) {
        words2.push({ ...asNominal(), pos: nominal != null ? nominal : "x", known: !!lem[i] || isKnownForm(t.w) });
        continue;
      }
      if (fin[i].length && fin[i].every((a) => a.variety) && (nominal || /(dad|tad)$/.test(t.w))) {
        words2.push(asNominal());
        continue;
      }
      if (t.w === "pese" && ((_e = toks[i + 1]) == null ? void 0 : _e.w) === "a") {
        words2.push({ ...base, pos: "prep", lemma: "pese a" });
        continue;
      }
      if (fin[i].length) {
        if (cc[i] && cc[i] !== "clitic" && prev2 && DETERMINER_LIKE.has(prev2.w) && NOUN_HOMOGRAPHS.has(t.w)) {
          words2.push({ ...asNominal(), pos: "noun" });
          continue;
        }
        if (t.w === "nada") {
          const subj = (x) => !!x && (SUBJECT_PRONOUNS.has(x.w) || x.pos === "propn" || x.pos === "noun");
          const p2 = pIdx >= 1 ? words2[pIdx - 1] : void 0;
          const next = toks[i + 1];
          const verbish = subj(prev2) || !!prev2 && ["no", "tambi\xE9n", "tampoco", "siempre", "nunca", "ya"].includes(prev2.w) && subj(p2) || !prev2 && !!next && NADA_VERB_NEXT.has(next.w);
          words2.push(verbish ? asVerb2() : asClosed());
          continue;
        }
        if (cc[i] && cc[i] !== "clitic") {
          const cue = prev2 && (STRONG_VERB_CUES.has(prev2.w) || SUBORDINATORS.has(prev2.w) && !FUNCTION_HOMOGRAPHS.has(t.w));
          const next = toks[i + 1];
          const nextNominal = next && !next.punct && (DETERMINER_LIKE.has(next.w) || ["noun", "x"].includes((_f = nominalPos(lem[i + 1])) != null ? _f : ""));
          const startsClause = !prev2 || CLAUSE_LINKS.has(prev2.w);
          const nextEnd = !next || next.punct && /[.?!…,;:]/.test(next.w);
          const alone = startsClause && !clauseHasOtherVerb(toks, i, cand) && FUNCTION_HOMOGRAPHS.has(t.w) && !(cc[i] === "prep" && next && (ARTICLE_LIKE.has(next.w) || closedClass(next.w) === "num" || /^\d/.test(next.w)));
          if (cue || alone && (nextNominal || nextEnd) && !sentenceHasOtherVerb(toks, i, unamb.map((u, k) => u && !sameClause(toks, i, k))) || alone && nextEnd) words2.push(asVerb2());
          else words2.push(asClosed());
          continue;
        }
        if (CLITICS2.has(t.w)) {
          words2.push(asClosed());
          continue;
        }
        if (nominal) {
          if (prev2 && prev2.w === "qu\xE9" && toks[i + 1] && (nameLike[i + 1] || SUBJECT_PRONOUNS.has(toks[i + 1].w))) {
            words2.push(asVerb2());
            continue;
          }
          const nx1 = toks[i + 1];
          if (prev2 && /^cuánt[oa]s?$/.test(prev2.w) && (!nx1 || nx1.punct || ARTICLE_LIKE.has(nx1.w) || closedClass(nx1.w) === "num" || /^\d/.test(nx1.w) || nameLike[i + 1])) {
            words2.push(asVerb2());
            continue;
          }
          const complement = !!nx1 && !nx1.punct && (SUBJECT_PRONOUNS.has(nx1.w) || closedClass(nx1.w) === "prep" || ARTICLE_LIKE.has(nx1.w) || nameLike[i + 1] || closedClass(nx1.w) === "adv" || ((_g = lexEntry(nx1.w)) == null ? void 0 : _g.pos) === "adv");
          if (prev2 && ["y", "o", "e", "u"].includes(prev2.w) && ((_h = words2[pIdx - 1]) == null ? void 0 : _h.pos) === "noun" && nominal === "noun" && !complement) {
            words2.push(asNominal());
            continue;
          }
          if (prev2 && (DETERMINER_LIKE.has(prev2.w) || prev2.pos === "prep" || prev2.pos === "num")) {
            if (prev2.w === "lo" && nominal !== "adj") {
              words2.push(asVerb2());
              continue;
            }
            words2.push(asNominal());
            continue;
          }
          if (prev2 && (STRONG_VERB_CUES.has(prev2.w) || SUBORDINATORS.has(prev2.w))) {
            words2.push(asVerb2());
            continue;
          }
          if (prev2 && prev2.pos === "verb" && prev2.aux !== "haber") {
            words2.push(asNominal());
            continue;
          }
          if (prev2 && (prev2.pos === "noun" || prev2.pos === "propn")) {
            words2.push(nominal === "adj" && clauseHasOtherVerb(toks, i, cand) ? asNominal() : asVerb2());
            continue;
          }
          if (clauseHasOtherVerb(toks, i, unamb)) {
            words2.push(asNominal(`"${t.w}" read as ${nominal}: the clause has another verb`));
            continue;
          }
          const listed = !!prev2 && ["y", "o", "e", "u"].includes(prev2.w) && ((_i = words2[pIdx - 1]) == null ? void 0 : _i.pos) === "noun";
          const weakVerb = fin[i].every((a) => !/^(presente|preterito|imperfecto|futuro|condicional)$/.test(a.tense) || !lexEntry(a.inf) || isReflexive(a.inf));
          if (nominal === "noun" && weakVerb && (!prev2 || listed) && isFragmentEnd(toks, i) && !sentenceHasOtherVerb(toks, i, unamb)) {
            words2.push(asNominal());
            continue;
          }
          words2.push(asVerb2(`"${t.w}" read as a verb: no other verb in the clause`));
          continue;
        }
        words2.push(asVerb2());
        continue;
      }
      if (cc[i]) {
        if (prev2 && DETERMINER_LIKE.has(prev2.w) && NOUN_HOMOGRAPHS.has(t.w) && cc[i] !== "clitic") {
          words2.push({ ...asNominal(), pos: "noun" });
          continue;
        }
        words2.push(asClosed());
        continue;
      }
      const n = nf[i];
      if (n) {
        const lx = lexEntry(t.w);
        if (prev2 && DETERMINER_LIKE.has(prev2.w) && lx && lx.pos === "noun") {
          words2.push(asNominal());
          continue;
        }
        words2.push({
          ...base,
          pos: n.pos,
          lemma: n.infs[0],
          ...n.enclitics.length ? { enclitics: n.enclitics } : {},
          verb: n.infs.map((inf) => ({ inf, tense: "presente", person: "yo", form: t.w, type: "ar", accentExact: true, target: true }))
        });
        continue;
      }
      if (part[i].length) {
        const lx = (_j = lem[i]) == null ? void 0 : _j.entry;
        if (lx && lx.pos === "noun" && prev2 && DETERMINER_LIKE.has(prev2.w)) {
          words2.push(asNominal());
          continue;
        }
        if (lx && lx.pos === "noun" && nounSlot(words2, pIdx, toks, i)) {
          words2.push(asNominal());
          continue;
        }
        if (lx && lx.pos === "adj" && ((_k = toks[i + 1]) == null ? void 0 : _k.w) !== "por") {
          const masc = lem[i].lemma;
          let k = pIdx;
          while (k >= 0 && ["adv", "neg"].includes(words2[k].pos)) k--;
          const cop = k >= 0 ? words2[k] : void 0;
          const serAdj = !!cop && cop.pos === "verb" && cop.lemma === "ser" && !((_l = cop.verb) == null ? void 0 : _l.some((a) => /pret|indefinido/.test(a.tense)));
          if (ADJECTIVAL_PARTICIPLES.has(masc) || serAdj) {
            words2.push(asNominal());
            continue;
          }
        }
        words2.push({ ...base, pos: "part", lemma: part[i][0] });
        continue;
      }
      if (nominal) {
        words2.push(asNominal());
        continue;
      }
      if (lem[i]) {
        words2.push({ ...base, pos: "x", lemma: lem[i].lemma });
        continue;
      }
      if (t.cap) {
        words2.push({ ...base, pos: "propn" });
        continue;
      }
      words2.push({ ...base, pos: "unknown", known: isKnownForm(t.w) });
    }
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (["la", "los", "las", "lo"].includes(w.w) && (w.pos === "det" || w.pos === "clitic")) {
        let j = i + 1;
        while (j < words2.length && words2[j].pos === "clitic" && ["me", "te", "se", "nos", "os", "le", "les", "lo", "la", "los", "las"].includes(words2[j].w) && j < i + 3) j++;
        const nx = words2[j];
        if (nx && nx.pos === "verb") w.pos = "clitic";
        else if (w.w === "lo") w.pos = nx && !nx.punct && (["adj", "part", "x", "adv", "poss", "num"].includes(nx.pos) || nx.w === "que" || nx.w === "cual" || nx.w === "de") ? "det" : "clitic";
        else w.pos = "det";
      }
    }
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (w.pos !== "verb" || !((_m = w.verb) == null ? void 0 : _m.some((a) => a.inf === "haber"))) continue;
      const hb = haberAnalyses(w.w);
      if (!hb.length) continue;
      for (let j = i + 1; j <= i + 2 && j < words2.length; j++) {
        const p = words2[j];
        if (p.punct) break;
        const ps = participle2(p.w);
        if (ps.length && (p.pos === "part" || p.pos === "verb" || p.pos === "adj" || p.pos === "x" || p.pos === "noun")) {
          w.aux = "haber";
          p.pos = "part";
          p.lemma = ps[0];
          p.compoundOf = i;
          break;
        }
        if (!["adv", "neg"].includes(p.pos)) break;
      }
    }
    return words2;
  }

  // lib/tagger/features.ts
  var S = (s) => new Set(s.split(/\s+/).filter(Boolean));
  var VOLITION = S(`querer desear esperar preferir pedir necesitar exigir recomendar aconsejar sugerir prohibir permitir
  mandar ordenar rogar insistir proponer conseguir lograr evitar impedir dejar hacer suplicar pretender procurar
  intentar oponerse aceptar solicitar invitar animar obligar convencer contar confiar apetecer encargar ayudar
  necesitar urgir reclamar sugerir reprochar llevar contribuir tender pensar acostumbrar`);
  var REPORTED = S("decir escribir avisar recordar repetir gritar contestar responder explicar");
  var EMOTION = S(`gustar encantar molestar importar preocupar alegrar alegrarse sentir lamentar temer sorprender extra\xF1ar
  fastidiar doler odiar agradecer enojar enojarse enfadar emocionar interesar aterrar asustar divertir entristecer
  avergonzar indignar encantar fascinar quejarse sorprenderse preocuparse complacer aburrir frustrar alegrarse
  agradar entusiasmar irritar ofender extra\xF1arse lamentarse soportar aguantar entender comprender perdonar
  poner disculpar celebrar`);
  var DOUBT = S("dudar negar");
  var BELIEF = S("creer pensar parecer suponer imaginar opinar considerar estar saber ver o\xEDr coincidir afirmar asegurar");
  var IMPERSONAL_ADJ = S(`importante necesario posible imposible probable improbable mejor preferible conveniente urgente
  fundamental esencial imprescindible hora suficiente \xFAtil in\xFAtil bueno malo f\xE1cil dif\xEDcil justo l\xF3gico`);
  var EVAL = S(`pena l\xE1stima verg\xFCenza triste raro extra\xF1o incre\xEDble sorprendente genial maravilloso horrible terrible
  normal natural curioso fant\xE1stico estupendo bien mal bonito injusto rid\xEDculo absurdo emocionante interesante peor`);
  var FACT = S("verdad cierto obvio evidente claro seguro indudable");
  var EMO_ADJ = S("contento feliz triste harto orgulloso preocupado encantado sorprendido nervioso agradecido");
  var EMO_NOUN = S("miedo pena rabia igual verg\xFCenza l\xE1stima gusto ganas alegr\xEDa");
  var GUSTAR = S(`gustar encantar interesar importar molestar doler fascinar preocupar apetecer faltar quedar parecer
  costar sobrar tocar caer aburrir disgustar convenir alegrar sorprender asustar emocionar enojar fastidiar extra\xF1ar
  provocar frustrar complacer agradar entusiasmar irritar ofender`);
  var ACCIDENTAL = S("olvidar caer perder romper quedar acabar ocurrir escapar da\xF1ar morir descomponer");
  var LOCATION_ADV = S(`aqu\xED all\xED ah\xED ac\xE1 all\xE1 cerca lejos enfrente detr\xE1s delante arriba abajo dentro fuera afuera adentro
  encima debajo junto`);
  var DEGREE = S("muy bastante tan m\xE1s menos algo demasiado super s\xFAper re poco un no siempre ya todav\xEDa tambi\xE9n tampoco nunca a\xFAn bien_");
  var PAST_CUE = /\b(ayer|anoche|anteayer|pasad[oa]s?|hace (?:un|una|unos|unas|dos|tres|\d+|mucho|poco|rato)|en \d{4})\b/;
  var IRREG_TU_CMD = S("di haz ve pon sal s\xE9 ten ven");
  var DO = S("lo la los las");
  var IO = S("le les");
  var PERSONAL = S("me te nos os");
  var REFLEX_FOR = { yo: "me", "t\xFA": "te", "\xE9l/ella": "se", nosotros: "nos", vosotros: "os", ellos: "se", usted: "se", ustedes: "se", vos: "te" };
  function add(ctx, key3, a, b, extra = {}) {
    const text = ctx.words.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(" ");
    ctx.features.push({ key: key3, node: null, span: [a, b], text, ...extra });
  }
  var isStrongPunct = (w) => !!w && w.punct && /[.?!…;:]/.test(w.w);
  function sentenceBounds(words2, i) {
    let a = i;
    while (a > 0 && !isStrongPunct(words2[a - 1])) a--;
    let b = i;
    while (b < words2.length - 1 && !isStrongPunct(words2[b + 1])) b++;
    return [a, b];
  }
  function sentenceText(words2, i) {
    const [a, b] = sentenceBounds(words2, i);
    return words2.slice(a, Math.min(words2.length, b + 2)).map((w) => w.w).join(" ");
  }
  var prevIdx = (words2, i) => {
    let j = i - 1;
    while (j >= 0 && words2[j].punct && words2[j].w === '"') j--;
    return j;
  };
  function proclitics(words2, i) {
    let j = i - 1;
    const cl = [];
    while (j >= 0 && words2[j].pos === "clitic") {
      cl.unshift(words2[j].w);
      j--;
    }
    const neg = j >= 0 && words2[j].w === "no";
    return { start: j + 1, clitics: cl, neg };
  }
  var CLAUSE_OPENERS = S("y e o u pero ni entonces luego despu\xE9s ahora primero bueno pues sino");
  function clauseInitial(words2, i) {
    var _a2;
    const pc = proclitics(words2, i);
    let j = pc.start - 1;
    if (pc.neg) j--;
    if (j < 0) return true;
    const w = words2[j];
    if (w.punct) return true;
    if (CLAUSE_OPENERS.has(w.w)) return true;
    if (w.w === "favor" && ((_a2 = words2[j - 1]) == null ? void 0 : _a2.w) === "por") return true;
    return false;
  }
  function commandContext(words2, i) {
    var _a2;
    const s = sentenceText(words2, i);
    if (/[!¡]/.test(s) || /\bpor favor\b/.test(s)) return true;
    const [a, b] = sentenceBounds(words2, i);
    for (let j = a; j < b; j++) if (words2[j].pos === "propn" && ((_a2 = words2[j + 1]) == null ? void 0 : _a2.w) === "," && j + 2 === proclitics(words2, i).start) return true;
    for (let j = a; j <= b; j++) if (j !== i && words2[j].pos === "verb" && words2[j].tense === "cmd") return true;
    return false;
  }
  function phon(s) {
    return deaccent(s).replace(/qu(?=[ei])/g, "k").replace(/c(?=[aou])/g, "k").replace(/c$/, "k").replace(/z/g, "s").replace(/c(?=[ei])/g, "s").replace(/gu(?=[ei])/g, "g").replace(/g(?=[ei])/g, "h").replace(/j/g, "h").replace(/y/g, "i").replace(/ü/g, "u");
  }
  function changeLast(stem2, from, to) {
    const m = [...stem2.matchAll(from)];
    if (!m.length) return stem2;
    const k = m[m.length - 1].index;
    return stem2.slice(0, k) + to + stem2.slice(k + 1);
  }
  var IMPERFECT_STATE = /* @__PURE__ */ new Set(["ser", "estar", "tener", "haber"]);
  function formClass(inf, tense, person, form2) {
    var _a2, _b;
    const bare4 = bareOf(inf);
    const v = (_a2 = verbByInf(inf)) != null ? _a2 : verbByInf(bare4);
    const idx = PERSONS.indexOf(person);
    if (!v || idx < 0) return "regular";
    const cls = vowelOf(bare4);
    const stem2 = stemOf(bare4);
    let reg = "";
    if (tense === "presente" || tense === "preterito" || tense === "imperfecto" || tense === "presubj") reg = stem2 + endingsFor(tense, cls)[idx];
    else if (tense === "futuro" || tense === "condicional") reg = deaccent(bare4) + endingsFor(tense, cls)[idx];
    else return "regular";
    const f = form2.toLowerCase();
    const lemma2 = bare4;
    if (tense === "presente" && ["ser", "estar", "ir"].includes(lemma2)) return "irregular." + lemma2;
    if (tense === "preterito" && (lemma2 === "ser" || lemma2 === "ir")) return "irregular.ser-ir";
    if (tense === "preterito" && lemma2 === "hacer") return "irregular.hacer";
    if (tense === "imperfecto") {
      if (IMPERFECT_STATE.has(lemma2)) return "state";
      return deaccent(f) === deaccent(reg) || phon(f) === phon(reg) ? "regular" : "irregular";
    }
    if (deaccent(f) === deaccent(reg)) return tense === "presente" || tense === "preterito" ? "regular." + cls : "regular";
    const ending = reg.slice(tense === "futuro" || tense === "condicional" ? deaccent(bare4).length : stem2.length);
    const regPhon = (tense === "futuro" || tense === "condicional" ? phon(deaccent(bare4)) : phon(stem2)) + phon(ending);
    const spelling = phon(f) === regPhon || phon(f) === phon(reg);
    if (tense === "presente") {
      if (spelling) return "spelling." + cls;
      if (idx !== 3 && idx !== 4) {
        const tries = [["ie", changeLast(stem2, /e/g, "ie")], ["ue", changeLast(stem2, /[ou]/g, "ue")], ["i", changeLast(stem2, /e/g, "i")]];
        for (const [k, changed2] of tries) if (changed2 !== stem2 && phon(f) === phon(changed2 + endingsFor("presente", cls)[idx])) return "stem-" + k;
      }
      if (idx === 0) return "irregular-yo";
      return "irregular";
    }
    if (tense === "preterito") {
      if (spelling) return "spelling";
      if (cls === "ir" && (idx === 2 || idx === 5)) {
        for (const changed2 of [changeLast(stem2, /e/g, "i"), changeLast(stem2, /o/g, "u")]) {
          if (changed2 !== stem2 && phon(f) === phon(changed2) + phon(ending)) return "stem";
        }
      }
      if (((_b = v.forms) == null ? void 0 : _b.preterito) || v.like) return "irregular";
      if (cls === "ir" && v.stem) return "stem";
      return "irregular";
    }
    if (tense === "futuro" || tense === "condicional") return spelling ? "regular" : "irregular";
    if (tense === "presubj") {
      if (spelling) return "regular";
      try {
        const yo = conjugate(v, "presente")[0];
        const derived = yo.replace(/o$/, "") + (cls === "ar" ? endingsFor("presubj", "ar") : endingsFor("presubj", "er"))[idx];
        if (/o$/.test(yo) && (phon(f) === phon(derived) || idx === 3 || idx === 4)) return "regular";
      } catch {
      }
      return "irregular";
    }
    return "regular";
  }
  var POSSIBILITY_N = S("posibilidad posibilidades probabilidad probabilidades riesgo peligro necesidad importancia hora momento");
  var DOUBT_N = S("idea duda dudas");
  function matrixClass(words2, q, sentStart) {
    var _a2;
    if (((_a2 = words2[q - 1]) == null ? void 0 : _a2.w) === "de" && words2[q - 2]) {
      const n = words2[q - 2].w;
      if (POSSIBILITY_N.has(n)) return "subj.impersonal";
      if (EMO_NOUN.has(n) || n === "temor" || n === "sensaci\xF3n") return "subj.emotion";
      if (DOUBT_N.has(n)) return "subj.doubt";
    }
    for (let j = q - 1; j >= Math.max(sentStart, q - 8); j--) {
      let w = words2[j];
      if (w.punct && w.w !== ",") break;
      if (w.pos === "verb" && w.aux === "haber") continue;
      if (w.pos === "part" && w.compoundOf !== void 0) w = { ...w, pos: "verb", tense: words2[w.compoundOf].tense };
      if (w.w === "qu\xE9" && words2[j + 1] && (EVAL.has(words2[j + 1].w) || IMPERSONAL_ADJ.has(words2[j + 1].w) || EMO_NOUN.has(words2[j + 1].w) || words2[j + 1].w === "suerte")) return "subj.evaluation";
      if (w.pos === "verb" || w.pos === "inf" || w.pos === "ger") {
        if (w.tense && /subj/.test(w.tense)) continue;
        const L = bareOf(w.lemma);
        const Lr = w.lemma;
        const neg = [1, 2, 3].some((d) => {
          var _a3;
          return ((_a3 = words2[j - d]) == null ? void 0 : _a3.w) === "no" && !words2.slice(j - d, j).some((x) => x.punct);
        });
        const between = words2.slice(j + 1, q).map((x) => x.w);
        const isQuestion = /\?/.test(sentenceText(words2, q));
        if (L === "ser" || L === "parecer" || L === "resultar" || L === "estar" || L === "quedar") {
          if (between.some((x) => FACT.has(x))) return neg || isQuestion ? "subj.doubt" : null;
          if (L === "estar" && between.includes("seguro")) return neg ? "subj.doubt" : null;
          if (between.some((x) => EMO_ADJ.has(x))) return "subj.emotion";
          if (between.some((x) => IMPERSONAL_ADJ.has(x))) return "subj.impersonal";
          if (between.some((x) => EVAL.has(x))) return "subj.evaluation";
          if (L === "parecer" && !between.length) return neg ? "subj.doubt" : null;
          if (between.length) return "subj.evaluation";
          const before = words2.slice(Math.max(sentStart, j - 4), j).map((x) => x.w);
          if (before.some((x) => POSSIBILITY_N.has(x) || IMPERSONAL_ADJ.has(x) || x === "idea" || x === "soluci\xF3n" || x === "objetivo")) return "subj.impersonal";
          return null;
        }
        if (L === "hacer" && between.includes("falta")) return "subj.impersonal";
        if (L === "valer" && between.includes("m\xE1s")) return "subj.impersonal";
        if (L === "bastar" || L === "poder" && (between.length === 0 || between.join(" ") === "ser")) return "subj.impersonal";
        if ((L === "dar" || L === "tener") && between.some((x) => EMO_NOUN.has(x))) return "subj.emotion";
        if (REPORTED.has(L)) return "subj.volition.reported";
        if (VOLITION.has(L) || VOLITION.has(Lr)) return "subj.volition";
        if (EMOTION.has(L) || EMOTION.has(Lr)) return "subj.emotion";
        if (DOUBT.has(L)) return "subj.doubt";
        if (BELIEF.has(L)) return neg || isQuestion ? "subj.doubt" : null;
        return null;
      }
    }
    if (words2[sentStart] && /^(mejor|ojalá)$/.test(words2[sentStart].w)) return "subj.impersonal";
    return null;
  }
  var DETERMINER_WORDS = S("el la los las un una unos unas mi mis tu tus su sus este esta estos estas ese esa esos esas del al cada varios varias muchos muchas pocos pocas otros otras algunos algunas");
  var QUE_CONJ_PREV = S("para sin hasta desde ya as\xED porque aunque mientras antes despu\xE9s luego siempre vez medida pesar caso tal menos fin modo manera");
  var QUE_VIENE_N = S("semana semanas mes meses a\xF1o a\xF1os lunes martes mi\xE9rcoles jueves viernes s\xE1bado domingo verano invierno");
  var COMPARATIVE_WORDS = S("m\xE1s menos mejor peor mayor menor antes otro otra otros otras distinto distinta diferente mismo misma igual");
  function queRole(words2, q) {
    var _a2, _b, _c, _d, _e;
    const p = prevIdx(words2, q);
    const pw = p >= 0 ? words2[p] : void 0;
    if (!pw || pw.punct && pw.w !== ",") return "initial";
    if (pw.w === ",") {
      for (let k = p - 1; k >= Math.max(0, p - 3); k--) {
        const pp = words2[k];
        if (pp.punct) break;
        if (pp.pos === "noun" || pp.pos === "propn") return "relative";
        if (pp.pos === "verb") break;
      }
      return "complement";
    }
    if (pw.w === "lo") return "lo-que";
    if (["el", "la", "los", "las"].includes(pw.w)) {
      const pp = words2[p - 1];
      return pp && pp.pos === "prep" ? "prep-rel" : "el-que";
    }
    if (pw.w === "de") {
      const pp = words2[p - 1];
      if (pp && QUE_CONJ_PREV.has(pp.w)) return "conj";
      return "complement";
    }
    if (pw.pos === "prep" && !QUE_CONJ_PREV.has(pw.w)) {
      const pp = words2[p - 1];
      if (pp && pp.pos === "noun") return "prep-rel";
    }
    if (QUE_CONJ_PREV.has(pw.w)) return "conj";
    if (TIME_N.has(pw.w) && words2.slice(Math.max(0, p - 4), p).some((x) => x.w === "hace" || x.w === "desde")) return "conj";
    if (QUE_VIENE_N.has(pw.w) && /^vienen?$/.test((_b = (_a2 = words2[q + 1]) == null ? void 0 : _a2.w) != null ? _b : "")) return "conj";
    if (pw.w === "hay" || bareOf(pw.lemma) === "tener" && (pw.pos === "verb" || pw.pos === "inf" || pw.pos === "ger")) return "periphrasis";
    for (let j = p; j >= Math.max(0, p - 4); j--) {
      if (words2[j].punct) break;
      if (COMPARATIVE_WORDS.has(words2[j].w)) return "comparative";
    }
    if (pw.pos === "noun" && (EVAL.has(pw.w) || FACT.has(pw.w) || EMO_NOUN.has(pw.w) || pw.w === "hora" || pw.w === "suerte" || pw.w === "mentira")) {
      const near = words2.slice(Math.max(0, p - 3), p).map((x) => bareOf(x.lemma));
      if (near.some((x) => x === "ser" || x === "parecer" || x === "dar" || x === "tener") || ((_c = words2[p - 1]) == null ? void 0 : _c.w) === "qu\xE9") return "complement";
    }
    if (pw.pos === "noun" || pw.pos === "propn" || ["alguien", "algo", "nada", "nadie", "todo", "todos", "aquello", "eso", "esto", "uno", "una"].includes(pw.w)) return "relative";
    if ((pw.pos === "x" || pw.pos === "unknown") && p >= 1 && (DETERMINER_WORDS.has(words2[p - 1].w) || words2[p - 1].w === "de" || words2[p - 1].pos === "adj")) return "relative";
    if ((pw.pos === "adj" || pw.pos === "x" || pw.pos === "num") && p >= 1 && (words2[p - 1].pos === "noun" || words2[p - 1].pos === "det")) {
      const pp = words2[p - 1];
      if (pp.pos === "noun" || pp.pos === "det" && !["es", "era", "sea"].includes((_e = (_d = words2[p - 2]) == null ? void 0 : _d.w) != null ? _e : "")) return "relative";
    }
    return "complement";
  }
  function findTrigger(words2, i) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const [sentStart] = sentenceBounds(words2, i);
    for (let j = i - 1; j >= sentStart; j--) {
      const w = words2[j];
      const x = w.w;
      if (x === "ojal\xE1") return { key: "subj.ojala", a: j, b: j };
      if (x === "qui\xE9n" && j === sentStart + (((_a2 = words2[sentStart]) == null ? void 0 : _a2.punct) ? 1 : 0) && /impsubj|pluscsubj/.test((_c = (_b = words2[i].verb) == null ? void 0 : _b.map((a) => a.tense).join()) != null ? _c : "")) return { key: "subj.wish-que", a: j, b: j };
      if (["quiz\xE1", "quiz\xE1s", "acaso", "posiblemente", "probablemente"].includes(x)) return { key: "subj.adverb-doubt", a: j, b: j };
      if (x === "vez" && ((_d = words2[j - 1]) == null ? void 0 : _d.w) === "tal") return { key: "subj.adverb-doubt", a: j - 1, b: j };
      if (x === "si" && ((_e = words2[j - 1]) == null ? void 0 : _e.w) === "como") return { key: "subj.como-si", a: j - 1, b: j };
      if (x === "si") return { key: "subj.si", a: j, b: j };
      if (x === "cuando" || x === "mientras" || x === "apenas") return { key: "subj.temporal", a: j, b: j };
      if (x === "cuanto" && ((_f = words2[j - 1]) == null ? void 0 : _f.w) === "en") return { key: "subj.temporal", a: j - 1, b: j };
      if (x === "como" && ((_g = words2[j - 1]) == null ? void 0 : _g.w) === "pronto") return { key: "subj.temporal", a: j - 2, b: j };
      if (x === "aunque") return { key: "subj.concessive", a: j, b: j };
      if (x === "como" && (j === sentStart || ((_h = words2[j - 1]) == null ? void 0 : _h.punct)) && /presubj/.test((_j = (_i = words2[i].verb) == null ? void 0 : _i.map((a) => a.tense).join()) != null ? _j : "")) return { key: "subj.conj.como", a: j, b: j };
      if (x === "como" || x === "donde" || x === "quien" || x === "quienes" || x === "cual" || x === "cuales" || x === "adonde") return { key: "subj.relative", a: j, b: j };
      if (x === "que") {
        const pv = (_l = (_k = words2[j - 1]) == null ? void 0 : _k.w) != null ? _l : "";
        const pv2 = (_n = (_m = words2[j - 2]) == null ? void 0 : _m.w) != null ? _n : "";
        const pv3 = (_p = (_o = words2[j - 3]) == null ? void 0 : _o.w) != null ? _p : "";
        if (pv === "para" || pv === "de" && pv2 === "fin") return { key: "subj.purpose", a: pv === "para" ? j - 1 : j - 3, b: j };
        if (pv === "sin" || pv === "de" && pv2 === "antes" || pv === "menos" && pv2 === "a" || pv === "tal" || pv === "de" && pv2 === "tal" || pv === "de" && pv2 === "caso" || pv === "ser" && pv2 === "no" || pv === "salvo") {
          const first = ["sin", "antes", "a", "con", "en", "salvo"];
          let a = j - 1;
          while (a > Math.max(sentStart, j - 4) && !first.includes(words2[a].w)) a--;
          return { key: "subj.conj", a, b: j };
        }
        if (pv === "hasta" || pv === "de" && (pv2 === "despu\xE9s" || pv2 === "luego") || pv === "vez" && pv2 === "una" || pv === "medida" && pv2 === "a" || pv === "siempre") return { key: "subj.temporal", a: Math.max(sentStart, j - 2), b: j };
        if ((pv === "m\xE1s" || pv === "mucho") && pv2 === "por") return { key: "subj.concessive", a: j - 2, b: j };
        if (pv === "de" && pv2 === "pesar") return { key: "subj.concessive", a: j - 3, b: j };
        if (pv === "de" && pv2 === "hecho") return { key: "subj.factive", a: j - 3, b: j };
        if (pv === "es" && pv2 === "no") return { key: "subj.doubt", a: j - 2, b: j };
        const role = queRole(words2, j);
        if (role === "initial") return { key: "subj.wish-que", a: j, b: j };
        if (role === "relative" || role === "lo-que" || role === "el-que" || role === "prep-rel") return { key: "subj.relative", a: j, b: j };
        if (pv === "de" && (pv2 === "antes" || pv3 === "antes")) return { key: "subj.conj", a: Math.max(sentStart, j - 3), b: j };
        if (pv === "de" && (pv2 === "caso" || pv3 === "caso")) return { key: "subj.conj", a: Math.max(sentStart, j - 3), b: j };
        if (["y", "pero", "s\xED", "no", "pues"].includes(pv) && (j - 1 === sentStart || ((_q = words2[j - 2]) == null ? void 0 : _q.punct))) return { key: "subj.wish-que", a: j - 1, b: j };
        if (pv === "ah\xED" && pv2 === "de") return { key: "subj.conj", a: j - 2, b: j };
        if ((pv === "manera" || pv === "modo" || pv === "forma") && pv2 === "de") return { key: "subj.purpose", a: j - 2, b: j };
        if (role === "comparative") return { key: "subj.relative", a: j, b: j };
        if (role === "conj") return null;
        if (role === "complement") {
          const m = matrixClass(words2, j, sentStart);
          if (m) {
            let a = j - 1;
            while (a > sentStart && !(words2[a].pos === "verb" || words2[a].w === "qu\xE9")) a--;
            return { key: m, a, b: j };
          }
          void pv3;
        }
      }
      if (isStrongPunct(w)) break;
    }
    return null;
  }
  function nominalFallback(words2, i) {
    var _a2;
    const w = words2[i];
    const p = words2[i - 1];
    if (!p || p.punct) return false;
    const nominalSlot = ["noun", "adj", "det", "quant", "dem", "x", "prep", "num", "poss"].includes(p.pos) || ["la", "las", "los", "lo"].includes(p.w);
    if (!nominalSlot) return false;
    const lm = lemmatize(w.w);
    if (!lm) return false;
    w.pos = ((_a2 = lm.entry) == null ? void 0 : _a2.pos) === "noun" ? "noun" : "x";
    w.lemma = lm.lemma;
    w.tense = void 0;
    w.verb = void 0;
    w.known = true;
    if (["la", "las", "los", "lo"].includes(p.w) && p.pos === "clitic") p.pos = "det";
    return true;
  }
  var FIXED_SUBJ = [
    "o sea",
    "ya sea",
    "maldita sea",
    "sea como sea",
    "sea lo que sea",
    "como sea",
    "pase lo que pase",
    "que yo sepa",
    "quieras o no",
    "as\xED sea",
    "cueste lo que cueste",
    "venga",
    "vaya",
    "diga",
    "oiga",
    "mire",
    "digamos"
  ].map((x) => x.split(" "));
  var WANT = S("querer desear preferir necesitar");
  var HOPE = S("esperar");
  var EMO_BASIC = S("alegrar alegrarse molestar gustar encantar importar");
  var POSSIBLE_ADJ = S("posible imposible probable improbable");
  var COND_CONJ = S("menos tal caso ser salvo siempre");
  function refineTrigger(key3, tense, words2, t) {
    var _a2, _b;
    const txt = words2.slice(t.a, t.b + 1).map((x) => x.w);
    const lemmas = words2.slice(t.a, t.b + 1).map((x) => bareOf(x.lemma));
    const past = /impsubj|pluscsubj/.test(tense);
    let k = key3;
    if (key3 === "subj.volition") k = lemmas.some((l) => WANT.has(l)) ? "subj.volition.want" : lemmas.some((l) => HOPE.has(l)) ? "subj.volition.hope" : "subj.volition.influence";
    else if (key3 === "subj.emotion") k = lemmas.some((l) => EMO_BASIC.has(l)) || txt.includes("qu\xE9") ? "subj.emotion.basic" : "subj.emotion";
    else if (key3 === "subj.impersonal" || key3 === "subj.evaluation") {
      if (txt.some((x) => POSSIBLE_ADJ.has(x)) || lemmas.includes("poder")) k = "subj.doubt.possible";
    } else if (key3 === "subj.doubt") {
      if (lemmas.some((l) => ["creer", "pensar", "parecer", "suponer", "imaginar", "opinar", "considerar", "estar", "coincidir"].includes(l))) k = "subj.doubt.negated-belief";
      else if (lemmas.some((l) => ["ver", "o\xEDr", "decir", "notar", "saber", "afirmar", "asegurar"].includes(l)) || txt.join(" ").startsWith("no es que")) k = "subj.doubt.negated-perception";
    } else if (key3 === "subj.conj") {
      if (txt.includes("ah\xED")) k = "subj.conj.consequence";
      else if (txt.some((x) => COND_CONJ.has(x))) k = "subj.conj.condition";
    } else if (key3 === "subj.relative") {
      const p = words2[t.a - 1];
      const free = ["lo", "el", "la", "los", "las"].includes((_a2 = p == null ? void 0 : p.w) != null ? _a2 : "") && !(((_b = words2[t.a - 2]) == null ? void 0 : _b.pos) === "prep") || ["donde", "como", "quien", "quienes", "cuando"].includes(txt[0]) && !(p && (p.pos === "noun" || p.w === ","));
      if (free) k = "subj.relative.free";
    } else if (key3 === "subj.wish-que" && txt[0] === "qui\xE9n") k = "subj.wish-que.quien";
    if (past && /^subj\.(volition|emotion|evaluation|impersonal|doubt|ojala|temporal)/.test(k)) k += ".past";
    return k;
  }
  var CONJ_STATIVE = S("estar tener saber haber costar valer conocer llamarse");
  var WEATHER_NOUN = S("fr\xEDo calor sol viento fresco grados tiempo");
  var SER_GUESS_NEXT = S("el la los las por que \xE9l ella ellos ellas usted ustedes verdad eso esto ese esa este esta aquel aquella");
  var HOUR_WORD = S("una dos tres cuatro cinco seis siete ocho nueve diez once doce");
  var SER_Q = S("qui\xE9n qui\xE9nes qu\xE9 cu\xE1l cu\xE1les");
  var FUTURE_CUE = new RegExp(String.raw`\b(?:mañana|luego|después|pronto|próxim[oa]s?|que viene|entrante|dentro de|algún día|nunca|jamás|hasta|antes de|cuando|cuándo|si|tod[oa] (?:el|la)|est[ae] (?:noche|tarde|semana|verano|invierno|año|mes|fin de semana|vez)|el (?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)|en (?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|\d+|un|una|unos|unas|dos|tres|cinco|diez|veinte|media|pocos|poco))\b`);
  function isConjecture(words2, i, lemma2, person = "") {
    var _a2, _b, _c, _d, _e;
    const bare4 = bareOf(lemma2);
    if (person === "yo" || person === "nosotros") return false;
    if (FUTURE_CUE.test(sentenceText(words2, i).toLowerCase())) return false;
    const nx = (_a2 = words2[i + 1]) == null ? void 0 : _a2.w;
    if (bare4 === "tener" && nx === "que") return false;
    if (CONJ_STATIVE.has(bare4) || CONJ_STATIVE.has(lemma2)) return true;
    if (bare4 === "hacer") return [1, 2].some((k) => {
      var _a3, _b2;
      return WEATHER_NOUN.has((_b2 = (_a3 = words2[i + k]) == null ? void 0 : _a3.w) != null ? _b2 : "");
    });
    if (bare4 !== "ser") return false;
    if ((nx === "las" || nx === "la") && HOUR_WORD.has((_c = (_b = words2[i + 2]) == null ? void 0 : _b.w) != null ? _c : "")) return true;
    if (nx === "como" && (((_d = words2[i + 2]) == null ? void 0 : _d.w) === "las" || ((_e = words2[i + 2]) == null ? void 0 : _e.w) === "la")) return true;
    const [ss] = sentenceBounds(words2, i);
    let j = i - 1;
    while (j >= ss && words2[j].punct) j--;
    const opener = j < ss || SER_Q.has(words2[j].w) && (() => {
      let k = j - 1;
      while (k >= ss && words2[k].punct) k--;
      return k < ss;
    })();
    if (!opener) return false;
    const next = words2[i + 1];
    if (!next || next.punct) return true;
    return insideQuestion(words2, i) || SER_GUESS_NEXT.has(next.w) || /^[A-ZÁÉÍÓÚÑ]/.test(next.text);
  }
  var INDIC = ["presente", "preterito", "imperfecto", "futuro", "condicional"];
  var SUBJ = ["presubj", "impsubj", "impsubjse", "futsubj"];
  var COMPOUND_OF = {
    presente: "perfecto",
    imperfecto: "plusc",
    futuro: "futperf",
    condicional: "condperf",
    presubj: "perfsubj",
    impsubj: "pluscsubj",
    impsubjse: "pluscsubj",
    preterito: "plusc"
  };
  function chooseLemma(words2, i, readings2) {
    var _a2, _b, _c;
    const infs = [...new Set(readings2.map((a) => a.inf))];
    const nx = (_a2 = words2[i + 1]) == null ? void 0 : _a2.w;
    const pc = proclitics(words2, i);
    if (infs.includes("ser") && infs.some((x) => x === "ir" || x === "irse")) {
      if (pc.clitics.includes("se")) return "irse";
      return nx === "a" || nx === "al" || nx === "de" && ["viaje", "vacaciones", "compras", "paseo"].includes((_c = (_b = words2[i + 2]) == null ? void 0 : _b.w) != null ? _c : "") || nx === "para" || nx === "all\xE1" || nx === "all\xED" ? "ir" : "ser";
    }
    const person = readings2[0].person;
    const refl = REFLEX_FOR[person];
    const bareInfs = infs.map(bareOf);
    if (refl && pc.clitics.includes(refl)) {
      for (const b of bareInfs) {
        const r = reflexiveOf(b);
        if (r) return r;
      }
    }
    const nonRefl = infs.find((x) => !/se$/.test(x) || x === "ser");
    return nonRefl != null ? nonRefl : bareInfs[0];
  }
  function verbPass(ctx) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const { words: words2 } = ctx;
    for (const w of words2) {
      if (w.pos !== "verb" || !w.verb) continue;
      const enc = w.verb.find((a) => {
        var _a3;
        return (_a3 = a.clitics) == null ? void 0 : _a3.length;
      });
      const onlyImp = w.verb.every((a) => a.tense === "imperativo");
      if (enc || onlyImp) w.tense = "cmd";
    }
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (w.pos !== "verb" || !w.verb || !w.verb.length) continue;
      if (w.w === "hay") {
        w.lemma = "haber";
        w.tense = "presente";
        continue;
      }
      const R = w.verb;
      if (w.aux === "haber") {
        const t = R.find((a) => a.inf === "haber" && COMPOUND_OF[a.tense]);
        const comp = t ? COMPOUND_OF[t.tense] : "perfecto";
        w.tense = comp;
        w.lemma = "haber";
        const p = words2.findIndex((x) => x.compoundOf === i);
        const key3 = "tense." + comp;
        if (/subj/.test(comp)) {
          const trig = findTrigger(words2, i);
          if (trig) add(ctx, refineTrigger(trig.key, comp === "perfsubj" ? "presubj" : "impsubj", words2, trig), trig.a, trig.b, { trigger: words2.slice(trig.a, trig.b + 1).map((x) => x.w).join(" ") });
          else {
            add(ctx, "subj.unlicensed", i, p);
            ctx.low.push(`subjunctive "${w.w} ${(_a2 = words2[p]) == null ? void 0 : _a2.w}" without a recognised trigger`);
          }
        }
        add(ctx, key3, i, p >= 0 ? p : i, { lemma: p >= 0 ? words2[p].lemma : void 0 });
        if (p >= 0 && !/(ado|ido)$/.test(deaccent(words2[p].w))) add(ctx, "participle.irregular", p, p, { lemma: words2[p].lemma });
        continue;
      }
      const pc = proclitics(words2, i);
      const initial = clauseInitial(words2, i);
      const enc = R.filter((a) => {
        var _a3;
        return (_a3 = a.clitics) == null ? void 0 : _a3.length;
      });
      const imps = R.filter((a) => a.tense === "imperativo");
      const indic = R.filter((a) => INDIC.includes(a.tense));
      const subj = R.filter((a) => SUBJ.includes(a.tense));
      const variety = R.every((a) => a.variety) ? R[0].variety : void 0;
      const emitCommand = (a, neg) => {
        w.tense = "cmd";
        w.lemma = chooseLemma(words2, i, [a]);
        const p = a.person === "usted" || a.person === "\xE9l/ella" ? "usted" : a.person === "ustedes" || a.person === "ellos" ? "ustedes" : a.person === "nosotros" ? "nosotros" : a.person === "vosotros" ? "vosotros" : "tu";
        if (p === "vosotros") {
          add(ctx, "cmd.vosotros", i, i, { lemma: w.lemma });
          return;
        }
        if (p === "nosotros") {
          add(ctx, "cmd.nosotros", i, i, { lemma: w.lemma });
          return;
        }
        const key3 = `cmd.${p}.${neg ? "neg" : "aff"}` + (!neg && p === "tu" && IRREG_TU_CMD.has(a.form.toLowerCase()) ? ".irregular" : "");
        add(ctx, key3, neg ? pc.start - 1 : i, i, { lemma: w.lemma });
      };
      if (variety === "vosotros" && !enc.length) {
        add(ctx, "dialect.vosotros", i, i, { lemma: R[0].inf });
      } else if (variety === "voseo") {
        add(ctx, "dialect.voseo", i, i, { lemma: R[0].inf });
      }
      if (enc.length) {
        const score = (x) => {
          var _a3;
          const cl = (_a3 = x.clitics) != null ? _a3 : [];
          let s = x.variety ? -5 : 0;
          if (cl.length === 1 && cl[0] === "se" && (x.person === "usted" || x.person === "ustedes")) s += 3;
          if (cl[0] === "te" && x.person === "t\xFA") s += 2;
          if (cl[0] === "nos" && x.person === "nosotros") s += 2;
          if (/se$/.test(x.inf)) s += 1;
          return s;
        };
        const a = [...enc].sort((p, q) => score(q) - score(p))[0];
        w.verb = [a, ...R.filter((x) => x !== a)];
        emitCommand(a, false);
        w.enclitics = a.clitics;
        continue;
      }
      const MANDATORY = /^subj\.(volition|emotion|evaluation|impersonal|doubt|ojala|purpose|conj|wish)/;
      if (indic.length && subj.length) {
        const trig = findTrigger(words2, i);
        if (trig && MANDATORY.test(trig.key)) indic.length = 0;
      }
      if (indic.length) {
        const tuImp = imps.find((a2) => a2.person === "t\xFA");
        const nx = (_b = words2[i + 1]) == null ? void 0 : _b.w;
        const goCmd = w.w === "ve" && (nx === "a" || nx === "al") && initial && !pc.clitics.length || ["ven", "haz", "pon", "sal"].includes(w.w) && w.sentStart && !/\?/.test(sentenceText(words2, i));
        const cmdOk = bareOf((_c = tuImp == null ? void 0 : tuImp.inf) != null ? _c : "") !== "estar" && !/\?/.test(sentenceText(words2, i));
        if (tuImp && cmdOk && initial && !pc.clitics.length && !pc.neg && (commandContext(words2, i) || goCmd)) {
          const isGo = w.w === "ve";
          emitCommand(isGo ? { ...tuImp, inf: "ir" } : tuImp, false);
          if (isGo) w.lemma = "ir";
          continue;
        }
        let tenses = [...new Set(indic.map((a2) => a2.tense))];
        if (tenses.includes("presente") && tenses.includes("preterito")) {
          const past = PAST_CUE.test(sentenceText(words2, i)) || words2.some((x, k) => k !== i && x.tense === "preterito");
          tenses = [past ? "preterito" : "presente"];
        }
        const t = INDIC.find((x) => tenses.includes(x));
        const rs = indic.filter((a2) => a2.tense === t);
        w.tense = t;
        w.lemma = chooseLemma(words2, i, rs);
        if (tuImp && initial && !pc.clitics.length && !pc.neg && w.sentStart && !/[?]/.test(sentenceText(words2, i)) && t === "presente") {
          w.weak = `"${w.w}" could be a t\xFA command or a present`;
        }
        const a = (_d = rs.find((x) => bareOf(x.inf) === bareOf(w.lemma))) != null ? _d : rs[0];
        if (w.lemma === "haber") {
          add(ctx, t === "futuro" ? isConjecture(words2, i, "haber") ? "hay.futuro.conjecture" : "hay.futuro" : "hay.tense", i, i, { lemma: "haber" });
          continue;
        }
        const cls = formClass(w.lemma, t, a.person, a.form);
        const conj = t === "futuro" && isConjecture(words2, i, w.lemma, a.person);
        add(ctx, `tense.${t}${conj ? ".conjecture" : ""}.${cls}`, i, i, { lemma: w.lemma });
        if (bareOf(w.lemma) === "haber" || w.lemma === "haber") continue;
        const [ss] = sentenceBounds(words2, i);
        for (let j = i - 1; j >= Math.max(ss, i - 6); j--) {
          if (words2[j].w === "cuando") {
            add(ctx, "conj.cuando.ind", j, i);
            break;
          }
          if (words2[j].w === "aunque") {
            add(ctx, "conj.aunque.ind", j, i);
            break;
          }
          if (words2[j].pos === "verb" || words2[j].punct) break;
        }
        continue;
      }
      if (subj.length) {
        const trig = findTrigger(words2, i);
        const tenses = [...new Set(subj.map((a2) => a2.tense))];
        const t = SUBJ.find((x) => tenses.includes(x));
        const rs = subj.filter((a2) => a2.tense === t);
        if (!trig && FIXED_SUBJ.some((f) => f.includes(w.w) && f.every((tk2, k) => {
          var _a3;
          return ((_a3 = words2[i + k - f.indexOf(w.w)]) == null ? void 0 : _a3.w) === tk2;
        }))) {
          w.tense = t;
          w.lemma = chooseLemma(words2, i, rs);
          add(ctx, "subj.fixed", i, i, { lemma: w.lemma });
          continue;
        }
        if (!trig && initial && t === "presubj") {
          const tu = rs.find((a2) => a2.person === "t\xFA");
          const third = rs.find((a2) => a2.person === "\xE9l/ella");
          const pl = rs.find((a2) => a2.person === "ellos");
          const nos = rs.find((a2) => a2.person === "nosotros");
          const pick = pc.neg ? (_f = (_e = tu != null ? tu : third) != null ? _e : pl) != null ? _f : nos : (_g = third != null ? third : pl) != null ? _g : nos;
          if (pick) {
            emitCommand({ ...pick, person: pick === third ? "usted" : pick === pl ? "ustedes" : pick.person }, pc.neg);
            continue;
          }
        }
        w.tense = t;
        w.lemma = chooseLemma(words2, i, rs);
        const a = rs[0];
        const tk = t === "impsubjse" ? "impsubj" : t;
        const cls = t === "presubj" ? formClass(w.lemma, t, a.person, a.form) : "regular";
        add(ctx, `tense.${tk}${t === "impsubjse" ? ".se" : ""}${cls !== "regular" ? ".irregular" : ""}`, i, i, { lemma: w.lemma });
        if (trig) add(ctx, refineTrigger(trig.key, t, words2, trig), trig.a, trig.b, { trigger: words2.slice(trig.a, trig.b + 1).map((x) => x.w).join(" "), lemma: w.lemma });
        else if (nominalFallback(words2, i)) continue;
        else if (FIXED_SUBJ.some((f) => f.every((t2, k) => {
          var _a3;
          return ((_a3 = words2[i + k - f.indexOf(w.w)]) == null ? void 0 : _a3.w) === t2;
        }))) add(ctx, "subj.fixed", i, i, { lemma: w.lemma });
        else if (t === "impsubj" && ["querer", "deber", "poder"].includes(bareOf(w.lemma))) add(ctx, "subj.courtesy", i, i, { lemma: w.lemma });
        else {
          add(ctx, "subj.unlicensed", i, i, { lemma: w.lemma });
          ctx.low.push(`subjunctive "${w.w}" without a recognised trigger`);
        }
        continue;
      }
      if (imps.length) {
        emitCommand(imps[0], false);
        continue;
      }
      w.tense = R[0].tense;
      w.lemma = chooseLemma(words2, i, R);
      add(ctx, `tense.${R[0].tense}`, i, i, { lemma: w.lemma });
    }
  }
  function pronounPass(ctx) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const { words: words2 } = ctx;
    const handled = /* @__PURE__ */ new Set();
    const isVerbLike = (w) => w.pos === "verb" && w.aux !== "haber" && w.w !== "hay";
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      const isAux = w.pos === "verb" && w.aux === "haber";
      if (!(isVerbLike(w) || isAux)) continue;
      const pc = proclitics(words2, i);
      if (!pc.clitics.length) continue;
      let lexIdx = i;
      if (isAux) {
        const p = words2.findIndex((x) => x.compoundOf === i);
        if (p >= 0) lexIdx = p;
      }
      const lemma2 = bareOf(words2[lexIdx].lemma);
      const persons = ((_a2 = w.verb) != null ? _a2 : []).filter((a2) => (w.tense === "cmd" ? a2.tense === "imperativo" || /subj/.test(a2.tense) : a2.tense === w.tense) || w.aux).map((a2) => a2.person);
      const agreeing = persons.find((pp) => {
        var _a3;
        return pc.clitics.includes((_a3 = REFLEX_FOR[pp]) != null ? _a3 : "-");
      });
      const person = (_e = (_d = agreeing != null ? agreeing : persons[0]) != null ? _d : (_c = (_b = w.verb) == null ? void 0 : _b[0]) == null ? void 0 : _c.person) != null ? _e : "";
      const cl = [...pc.clitics];
      const a = pc.start, b = pc.start + cl.length - 1;
      for (let k = a; k <= b; k++) handled.add(k);
      procesClitics(ctx, cl, a, b, i, lemma2, person, "proclitic");
    }
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (!((_f = w.enclitics) == null ? void 0 : _f.length)) continue;
      const pos = w.pos === "inf" ? "inf" : w.pos === "ger" ? "ger" : "cmd";
      const lemma2 = bareOf(w.lemma);
      let person = pos === "cmd" ? (_i = (_h = (_g = w.verb) == null ? void 0 : _g.find((a) => a.clitics)) == null ? void 0 : _h.person) != null ? _i : "t\xFA" : "any";
      if (pos !== "cmd") {
        for (let j = i - 1; j >= Math.max(0, i - 4); j--) {
          const m = words2[j];
          if (m.punct) break;
          if (m.pos === "verb" && ((_j = m.verb) == null ? void 0 : _j.length)) {
            person = (_l = (_k = m.verb.find((a) => a.tense === m.tense)) == null ? void 0 : _k.person) != null ? _l : m.verb[0].person;
            break;
          }
        }
      }
      if (pos !== "cmd" && LEXICAL_PRONOMINAL.has(lemma2 + "se") && w.enclitics.length === 1 && ["me", "te", "se", "nos"].includes(w.enclitics[0])) {
        w.lemma = lemma2 + "se";
        continue;
      }
      add(ctx, `clitic.enclitic.${pos}`, i, i, { lemma: w.lemma });
      procesClitics(ctx, w.enclitics, i, i, i, lemma2, person, pos);
    }
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (w.pos === "inf" && /se$/.test(w.w) && !((_m = w.enclitics) == null ? void 0 : _m.length) && reflexiveOf(bareOf(w.lemma))) {
        add(ctx, "reflexive", i, i, { lemma: reflexiveOf(bareOf(w.lemma)) });
      }
    }
  }
  var LEXICAL_PRONOMINAL = S("irse");
  var MEANING_CHANGE = S("irse dormirse quedarse llevarse comerse morirse encontrarse parecerse acordarse despedirse");
  var CHANGE_VERBS = S("ponerse volverse hacerse convertirse");
  function procesClitics(ctx, cl, a, b, v, lemma2, person, pos) {
    var _a2, _b;
    const { words: words2 } = ctx;
    const vw = words2[v];
    const io = cl.find((c) => PERSONAL.has(c) || IO.has(c));
    if (io && GUSTAR.has(lemma2) && !cl.includes("se") && (pos === "proclitic" || pos === "inf" || pos === "ger")) {
      const reflForPerson = REFLEX_FOR[person];
      if (!(reflForPerson === io && reflexiveOf(lemma2))) {
        add(ctx, lemma2 === "gustar" ? "gustar" : ["parecer", "quedar", "caer", "faltar"].includes(lemma2) ? "gustar.like.parecer" : "gustar.like", a, v, { lemma: lemma2 });
        for (let j = a - 1; j >= Math.max(0, a - 4); j--) {
          if (words2[j].punct) break;
          if (words2[j].w === "a" && words2[j + 1] && ["pron", "propn", "det", "poss", "noun"].includes(words2[j + 1].pos)) {
            add(ctx, "gustar.doubling", j, a, { lemma: lemma2 });
            break;
          }
        }
        return;
      }
    }
    if (cl[0] === "se" && cl.length >= 2 && (PERSONAL.has(cl[1]) || IO.has(cl[1])) && (ACCIDENTAL.has(lemma2) || !GUSTAR.has(lemma2))) {
      add(ctx, "se.accidental", a, v, { lemma: lemma2 });
      return;
    }
    if (cl[0] === "se" && cl.length >= 2 && DO.has(cl[1])) {
      const refl = REFLEX_FOR[person] === "se" && reflexiveOf(lemma2);
      if (!refl || pos !== "proclitic") {
        add(ctx, "clitic.se-lo", a, b, { lemma: lemma2 });
        add(ctx, "clitic.combined", a, b, { lemma: lemma2 });
        return;
      }
    }
    let rest = [...cl];
    const reflPron = (pos === "inf" || pos === "ger") && person === "any" ? cl[0] === "se" ? "se" : void 0 : REFLEX_FOR[person];
    if (reflPron && cl.includes(reflPron)) {
      const r = reflexiveOf(lemma2);
      if (r) {
        if (!LEXICAL_PRONOMINAL.has(r)) add(ctx, MEANING_CHANGE.has(r) ? "reflexive.meaning" : CHANGE_VERBS.has(r) ? "reflexive.change" : "reflexive", a, v, { lemma: r });
        if (vw.lemma === lemma2 && pos !== "inf" && pos !== "ger") vw.lemma = r;
        rest = cl.filter((c, k) => !(c === reflPron && k === cl.indexOf(reflPron)));
      } else if (reflPron === "se" && pos === "proclitic" && cl.length === 1) {
        const plural2 = person === "ellos" || person === "ustedes";
        let sj = a - 1;
        if (((_a2 = words2[sj]) == null ? void 0 : _a2.w) === "no") sj--;
        const subj = words2[sj];
        if (subj && !subj.punct && (subj.pos === "propn" || ["\xE9l", "ella", "ellos", "ellas", "usted", "ustedes"].includes(subj.w)) && ((_b = words2[sj - 1]) == null ? void 0 : _b.pos) !== "prep") {
          add(ctx, "reflexive", a, v, { lemma: lemma2 + "se" });
          return;
        }
        const nx = words2[v + 1];
        const npNext = nx && !nx.punct && (["det", "poss", "num", "noun", "quant"].includes(nx.pos) || QUANTIFIERS.has(nx.w));
        const present = words2[v].tense === "presente" || words2[v].tense === "cmd";
        add(ctx, plural2 || npNext ? present && !plural2 ? "se.passive.basic" : "se.passive" : "se.impersonal", a, v, { lemma: lemma2 });
        return;
      }
    }
    if (!rest.length) return;
    if (rest.length >= 2) add(ctx, "clitic.combined", a, b, { lemma: lemma2 });
    for (const c of rest) {
      if (DO.has(c)) add(ctx, "clitic.do", a, b, { lemma: lemma2 });
      else if (IO.has(c)) {
        add(ctx, "clitic.io", a, b, { lemma: lemma2 });
        for (let j = v + 1; j < Math.min(words2.length, v + 7); j++) {
          if (words2[j].punct && words2[j].w !== ",") break;
          if (words2[j].w === "a" && words2[j + 1] && (words2[j + 1].pos === "propn" || words2[j + 1].pos === "det" || words2[j + 1].pos === "poss")) {
            add(ctx, "clitic.io.doubling", a, j + 1, { lemma: lemma2 });
            break;
          }
          if (words2[j].w === "al") {
            add(ctx, "clitic.io.doubling", a, j, { lemma: lemma2 });
            break;
          }
        }
      } else if (PERSONAL.has(c)) add(ctx, "clitic.personal", a, b, { lemma: lemma2 });
      else if (c === "se") add(ctx, rest.length >= 2 ? "clitic.se-lo" : "se.impersonal", a, b, { lemma: lemma2 });
    }
  }
  function clausePass(ctx) {
    var _a2, _b;
    const { words: words2 } = ctx;
    for (let i = 0; i < words2.length; i++) {
      const x = words2[i].w;
      if (words2[i].punct) continue;
      if (x === "que") {
        const role = queRole(words2, i);
        const p = prevIdx(words2, i);
        if (role === "relative") add(ctx, "rel.que", i, i);
        else if (role === "lo-que") add(ctx, "rel.lo-que", p, i);
        else if (role === "el-que") add(ctx, "rel.el-que", p, i);
        else if (role === "prep-rel") add(ctx, "rel.prep", Math.max(0, p - 1), i);
        else if (role === "complement") {
          add(ctx, "que.complement", i, i);
          const m = words2[i - 1];
          if (m && m.pos === "verb" && ["decir", "contar", "explicar", "comentar", "avisar", "prometer", "escribir", "responder", "contestar"].includes(bareOf(m.lemma)) && m.tense === "preterito") {
            const [, end] = sentenceBounds(words2, i);
            for (let j = i + 1; j <= end; j++) {
              const v = words2[j];
              if (v.pos !== "verb") continue;
              if (v.tense === "imperfecto") add(ctx, "reported.past", i - 1, j);
              else if (v.tense === "plusc" || v.tense === "condicional") add(ctx, "reported.backshift", i - 1, j);
              break;
            }
          }
        }
        continue;
      }
      if (x === "quien" || x === "quienes") {
        const p = prevIdx(words2, i);
        add(ctx, p >= 0 && words2[p].pos === "prep" ? "rel.prep" : "rel.quien", p >= 0 && words2[p].pos === "prep" ? p : i, i);
        continue;
      }
      if (x === "donde" || x === "adonde") {
        add(ctx, "rel.donde", i, i);
        continue;
      }
      if ((x === "cual" || x === "cuales") && i > 0 && ["el", "la", "lo", "los", "las"].includes(words2[i - 1].w)) {
        add(ctx, "rel.cual", i - 1, i);
        continue;
      }
      if (/^cuy[oa]s?$/.test(x)) {
        add(ctx, "rel.cuyo", i, i);
        continue;
      }
      const pv = words2[i - 1];
      const indirectQ = pv && (["saber", "preguntar", "preguntarse", "ver", "decidir", "depender", "averiguar", "recordar", "entender", "importar", "dudar", "imaginar"].includes(bareOf(pv.lemma)) || pv.w === "s\xE9");
      if (x === "si" && indirectQ) add(ctx, "q.indirect", i, i);
      if (x === "si" && words2[i].pos === "conj" && ((_a2 = words2[i - 1]) == null ? void 0 : _a2.w) !== "como" && !indirectQ) {
        const [, end] = sentenceBounds(words2, i);
        for (let j = i + 1; j <= end; j++) {
          const v = words2[j];
          if (v.pos !== "verb") continue;
          const t = (_b = v.tense) != null ? _b : "";
          if (t === "impsubj" || t === "impsubjse") add(ctx, "cond.hypothetical", i, j);
          else if (t === "pluscsubj") add(ctx, "cond.past", i, j);
          else if (t === "presente" || t === "perfecto" || t === "futuro") add(ctx, "cond.real", i, j);
          break;
        }
      }
    }
  }
  function nextSkip(words2, i, skip = 1) {
    let j = i + 1;
    let n = 0;
    while (j < words2.length && !words2[j].punct && n < skip && (["adv", "neg"].includes(words2[j].pos) && !["a", "de", "que"].includes(words2[j].w))) {
      j++;
      n++;
    }
    return j < words2.length && !words2[j].punct ? j : -1;
  }
  var isInf = (w) => !!w && w.pos === "inf";
  var isGer = (w) => !!w && w.pos === "ger";
  function periphrasisPass(ctx) {
    var _a2;
    const { words: words2 } = ctx;
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (!["verb", "inf", "ger"].includes(w.pos) || w.aux) continue;
      if (w.w === "hay") {
        const q = nextSkip(words2, i, 0);
        if (q >= 0 && words2[q].w === "que" && isInf(words2[q + 1])) add(ctx, "peri.hay-que", i, q + 1);
        else add(ctx, "hay", i, i);
        continue;
      }
      const L = bareOf(w.lemma);
      const n1 = nextSkip(words2, i);
      if (n1 < 0) continue;
      const a1 = words2[n1];
      const a2 = words2[n1 + 1];
      const a3 = words2[n1 + 2];
      const prepInf = (prep, key3) => {
        if (a1.w === prep && isInf(a2)) {
          add(ctx, key3, i, n1 + 1, { lemma: a2.lemma });
          return true;
        }
        return false;
      };
      switch (L) {
        case "ir":
          if (!prepInf("a", "peri.ir-a") && isGer(a1)) add(ctx, "peri.ir-ger", i, n1);
          break;
        case "tener":
          if (a1.w === "que" && isInf(a2)) add(ctx, "peri.tener-que", i, n1 + 1);
          break;
        case "acabar":
          prepInf("de", "peri.acabar-de");
          break;
        case "volver":
          prepInf("a", "peri.volver-a");
          break;
        case "dejar":
          prepInf("de", "peri.dejar-de");
          break;
        case "empezar":
        case "comenzar":
          prepInf("a", "peri.empezar-a");
          break;
        case "terminar":
          prepInf("de", "peri.terminar-de");
          break;
        case "poner":
          if (proclitics(words2, i).clitics.includes("se") || w.lemma === "ponerse" || ((_a2 = w.enclitics) == null ? void 0 : _a2.includes("se"))) prepInf("a", "peri.ponerse-a");
          break;
        case "soler":
          if (isInf(a1)) add(ctx, "peri.soler", i, n1);
          break;
        case "deber":
          if (isInf(a1)) add(ctx, "peri.deber", i, n1);
          else if (a1.w === "de" && isInf(a2)) add(ctx, "peri.deber", i, n1 + 1);
          break;
        case "poder":
          if (isInf(a1)) add(ctx, "peri.poder", i, n1);
          break;
        case "querer":
          if (isInf(a1)) add(ctx, "peri.querer", i, n1);
          break;
        case "estar":
          if (isGer(a1)) add(ctx, w.tense === "imperfecto" ? "peri.estar-ger.past" : "peri.estar-ger", i, n1, { lemma: a1.lemma });
          else if (a1.w === "a" && (a2 == null ? void 0 : a2.w) === "punto" && (a3 == null ? void 0 : a3.w) === "de") add(ctx, "peri.estar-a-punto", i, n1 + 2);
          break;
        case "seguir":
        case "continuar":
          if (isGer(a1)) add(ctx, "peri.seguir-ger", i, n1);
          break;
        case "andar":
          if (isGer(a1)) add(ctx, "peri.ir-ger", i, n1);
          break;
        case "llevar": {
          for (let j = n1; j < Math.min(words2.length, n1 + 5); j++) {
            if (words2[j].punct) break;
            if (isGer(words2[j])) {
              add(ctx, "peri.llevar-ger", i, j);
              break;
            }
            if (words2[j].w === "sin" && isInf(words2[j + 1])) {
              add(ctx, "peri.llevar-ger", i, j + 1);
              break;
            }
          }
          break;
        }
      }
    }
  }
  function copulaPass(ctx) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const { words: words2 } = ctx;
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (!["verb", "inf", "ger"].includes(w.pos) || w.aux) continue;
      const L = bareOf(w.lemma);
      if (L !== "ser" && L !== "estar") continue;
      if (w.w === "s\xE9") continue;
      let j = i + 1;
      while (j < words2.length && !words2[j].punct && (DEGREE.has(words2[j].w) || words2[j].w === "un" && ((_a2 = words2[j + 1]) == null ? void 0 : _a2.w) === "poco" || words2[j].w === "poco" && ((_b = words2[j - 1]) == null ? void 0 : _b.w) === "un")) {
        if (L === "estar" && (words2[j].w === "bien" || words2[j].w === "mal")) break;
        j++;
      }
      const n = words2[j];
      if (L === "estar" && words2.slice(Math.max(0, i - 3), i).some((x) => x.w === "d\xF3nde")) {
        add(ctx, "estar.location", i, i);
        continue;
      }
      if (!n || n.punct) {
        const before = words2.slice(Math.max(0, i - 3), i).map((x) => x.w);
        if (L === "estar" && before.includes("d\xF3nde")) add(ctx, "estar.location", i, i);
        else if (L === "ser" && before.some((x) => ["qu\xE9", "qui\xE9n", "qui\xE9nes", "cu\xE1l"].includes(x))) add(ctx, "ser.identity", i, i);
        else add(ctx, L, i, i);
        continue;
      }
      const lx = (_c = lexEntry(n.w)) != null ? _c : n.lemma ? lexEntry(n.lemma) : void 0;
      if (n.pos !== "ger" && (L === "ser" ? SER_ADJ : ESTAR_ADJ).test(n.w)) add(ctx, "adj.ser-estar", i, j);
      if (L === "ser") {
        if (n.pos === "part" && !(lx && (lx.pos === "adj" || lx.pos === "x"))) add(ctx, "ser.passive", i, j, { lemma: n.lemma });
        else if (n.w === "de") add(ctx, "ser.origin", i, j);
        else if (n.w === "en") add(ctx, "ser.event", i, j);
        else if ((n.w === "la" || n.w === "las") && (((_d = words2[j + 1]) == null ? void 0 : _d.pos) === "num" || /^(una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)$/.test((_f = (_e = words2[j + 1]) == null ? void 0 : _e.w) != null ? _f : ""))) add(ctx, "ser.time", i, j + 1);
        else if (n.w === "mediod\xEDa" || n.w === "medianoche" || n.w === "tarde" || n.w === "temprano") add(ctx, "ser.time", i, j);
        else if (["det", "poss", "dem", "num", "noun", "propn", "pron", "quant"].includes(n.pos)) add(ctx, "ser.identity", i, j);
        else if (["adj", "x", "part"].includes(n.pos)) add(ctx, "ser.characteristic", i, j);
        else if (n.w === "que" || n.pos === "inf") add(ctx, "ser", i, i);
        else add(ctx, "ser", i, i);
      } else {
        if (n.pos === "ger") continue;
        if (n.w === "a" && ((_g = words2[j + 1]) == null ? void 0 : _g.w) === "punto") continue;
        if (["en", "a", "al", "por", "entre", "bajo", "sobre", "cerca", "junto", "frente", "detr\xE1s", "delante", "dentro", "fuera", "encima", "debajo", "hasta", "desde"].includes(n.w) || LOCATION_ADV.has(n.w) || n.w === "donde" || n.w === "lejos") add(ctx, "estar.location", i, j);
        else if (n.pos === "part" && !(lx && lx.pos === "adj")) add(ctx, "estar.result", i, j, { lemma: n.lemma });
        else if (["adj", "x", "part"].includes(n.pos) || ["bien", "mal", "listo", "lista", "de", "as\xED", "igual", "mejor", "peor", "solo", "sola"].includes(n.w)) add(ctx, "estar.state", i, j);
        else if (n.pos === "propn" || n.pos === "noun") add(ctx, "estar.location", i, j);
        else add(ctx, "estar", i, i);
      }
    }
  }
  var POR_FIXED = [
    "por favor",
    "por fin",
    "por eso",
    "por ejemplo",
    "por supuesto",
    "por cierto",
    "por lo menos",
    "por lo tanto",
    "por lo general",
    "por la ma\xF1ana",
    "por la tarde",
    "por la noche",
    "por suerte",
    "por desgracia",
    "por si acaso",
    "por primera vez",
    "por todas partes",
    "por ciento",
    "por qu\xE9",
    "por lo visto",
    "por un lado",
    "por otro lado",
    "por completo",
    "por cierto",
    "por ahora",
    "por aqu\xED",
    "por all\xE1",
    "por all\xED",
    "por tel\xE9fono",
    "por correo"
  ].map((s) => s.split(" "));
  var SER_ADJ = /^(?:list|viv|madur|orgullos|atent|callad)[oa]s?$/;
  var ESTAR_ADJ = /^(?:viv|madur|atent|callad)[oa]s?$/;
  var POR_FREQ_NOUN = S("d\xEDa mes a\xF1o");
  var POR_PER = S("kilo kilos libra libras persona d\xEDa hora mes noche unidad");
  var POR_PRICE_VERBS = S("pagar vender cambiar cobrar comprar");
  function clauseBefore(words2, i) {
    const out = [];
    for (let k = i - 1; k >= 0; k--) {
      const y = words2[k];
      if (y.punct || ["y", "pero", "que", "porque", "cuando", "si"].includes(y.w)) break;
      out.push(y);
    }
    return out;
  }
  function miscPass(ctx) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
    const { words: words2 } = ctx;
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      const x = w.w;
      if (w.punct) continue;
      if (x === "por" && w.pos === "prep") {
        const fx = POR_FIXED.find((f) => f.every((t, k) => {
          var _a3;
          return ((_a3 = words2[i + k]) == null ? void 0 : _a3.w) === t;
        }));
        if (fx) add(ctx, "por.fixed", i, i + fx.length - 1);
        else if (((_a2 = words2[prevIdx(words2, i)]) == null ? void 0 : _a2.w) === "gracias") add(ctx, "por.gracias", prevIdx(words2, i), i);
        else if (POR_PER.has((_c = (_b = words2[i + 1]) == null ? void 0 : _b.w) != null ? _c : "") || clauseBefore(words2, i).some((y) => POR_PRICE_VERBS.has(bareOf(y.lemma)))) add(ctx, "por.price", i, i);
        else add(ctx, "prep.por", i, i);
        if (POR_FREQ_NOUN.has((_e = (_d = words2[i + 1]) == null ? void 0 : _d.w) != null ? _e : "") && ["vez", "veces"].includes((_g = (_f = words2[i - 1]) == null ? void 0 : _f.w) != null ? _g : "") || POR_FREQ_NOUN.has((_i = (_h = words2[i + 1]) == null ? void 0 : _h.w) != null ? _i : "") && ["vez", "veces"].includes((_k = (_j = words2[i - 2]) == null ? void 0 : _j.w) != null ? _k : "")) add(ctx, "por.time", i, i + 1);
      } else if (x === "para" && w.pos === "prep" && ((_l = words2[i + 1]) == null ? void 0 : _l.w) !== "que") {
        add(ctx, "prep.para", i, i);
        const pv = words2[i - 1];
        if ((!pv || pv.punct || pv.w === "y" || pv.w === "pero") && ((_m = words2[i + 1]) == null ? void 0 : _m.w) === "ser") add(ctx, "para.comparison", i, i + 1);
      } else if (x === "m\xE1s" || x === "menos") {
        if (((_n = words2[i + 1]) == null ? void 0 : _n.w) === "de" && (((_o = words2[i + 2]) == null ? void 0 : _o.pos) === "num" || /^\d/.test((_q = (_p = words2[i + 2]) == null ? void 0 : _p.w) != null ? _q : ""))) {
          add(ctx, "comp.mas-de", i, i + 1);
          continue;
        }
        const p1 = words2[i - 1], p2 = words2[i - 2];
        const nx = words2[i + 1];
        if (nx && ["adj", "x", "part", "adv"].includes(nx.pos) && (p1 && ["el", "la", "los", "las", "lo"].includes(p1.w) || (p1 == null ? void 0 : p1.pos) === "noun" && p2 && ["el", "la", "los", "las"].includes(p2.w) && words2.slice(i + 2, i + 4).some((y) => y.w === "de") || (p1 == null ? void 0 : p1.pos) === "noun" && p2 && ["el", "la", "los", "las"].includes(p2.w) && !words2.slice(i + 1, i + 5).some((y) => y.w === "que"))) {
          add(ctx, "sup.relative", (p1 == null ? void 0 : p1.pos) === "noun" ? i - 2 : i - 1, i + 1);
          continue;
        }
        for (let j = i + 1; j < Math.min(words2.length, i + 6); j++) {
          if (words2[j].punct && words2[j].w !== ",") break;
          if (words2[j].w === "que") {
            add(ctx, "comp.mas-que", i, j);
            break;
          }
        }
      } else if (x === "tan") {
        for (let j = i + 1; j < Math.min(words2.length, i + 5); j++) if (words2[j].w === "como") {
          add(ctx, "comp.tan-como", i, j);
          break;
        }
      } else if (/^tant[oa]s?$/.test(x)) {
        for (let j = i + 1; j < Math.min(words2.length, i + 5); j++) if (words2[j].w === "como") {
          add(ctx, "comp.tanto-como", i, j);
          break;
        }
      } else if (["mejor", "peor", "mayor", "menor", "mejores", "peores", "mayores", "menores"].includes(x)) {
        const p1 = words2[i - 1];
        if (p1 && ["el", "la", "los", "las", "lo"].includes(p1.w) && !(x.startsWith("mayor") || x.startsWith("menor"))) add(ctx, "sup.relative", i - 1, i);
        else for (let j = i + 1; j < Math.min(words2.length, i + 6); j++) {
          if (words2[j].punct) break;
          if (words2[j].w === "que") {
            add(ctx, "comp.irregular", i, j);
            break;
          }
        }
      } else if (x === "igual" && (((_r = words2[i + 1]) == null ? void 0 : _r.w) === "que" || ((_s = words2[i + 1]) == null ? void 0 : _s.w) === "de")) add(ctx, "comp.igual", i, i + 1);
      else if (/ísim[oa]s?$/.test(x) && ["adj", "x", "adv"].includes(w.pos)) add(ctx, "sup.isimo", i, i, { lemma: w.lemma });
      else if (x === "al" && ((_t = words2[i + 1]) == null ? void 0 : _t.pos) === "inf") add(ctx, "nonfinite.al-inf", i, i + 1);
      else if (x === "no" || (x === "nunca" || x === "tampoco" || x === "jam\xE1s") && ((_u = words2[i + 1]) == null ? void 0 : _u.pos) === "verb") {
        const [, end] = sentenceBounds(words2, i);
        let sawVerb = false;
        for (let j = i + 1; j <= end; j++) {
          if (words2[j].pos === "verb") sawVerb = true;
          else if (sawVerb && NEGATIVES.has(words2[j].w) && words2[j].w !== "no") {
            add(ctx, "neg.double", i, j);
            break;
          }
          if (words2[j].punct && words2[j].w !== ",") break;
          if (["y", "e", "o", "u", "pero"].includes(words2[j].w)) break;
          if (words2[j].w === "no") break;
        }
      }
    }
  }
  var ART = S("el la los las un una unos unas del al");
  var POSS_SHORT = S("mi mis tu tus su sus nuestro nuestra nuestros nuestras");
  var POSS_LONG = S("m\xEDo m\xEDa m\xEDos m\xEDas tuyo tuya tuyos tuyas suyo suya suyos suyas");
  var DEM = S("este esta estos estas ese esa esos esas aquel aquella aquellos aquellas esto eso aquello");
  var INDEF = S("algo alguien alg\xFAn alguno alguna algunos algunas ning\xFAn ninguno ninguna");
  var POSS_BASIC = S("mi mis tu tus su sus");
  var DEM_BASIC = S("este esta esto eso");
  var QUANT_BASIC = S("muy mucho mucha muchos muchas poco poca pocos pocas");
  var WH_LEMMA = { qui\u00E9nes: "qui\xE9n", cu\u00E1les: "cu\xE1l", cu\u00E1nta: "cu\xE1nto", cu\u00E1ntos: "cu\xE1nto", cu\u00E1ntas: "cu\xE1nto" };
  var QUANT = S("mucho mucha muchos muchas poco poca pocos pocas bastante bastantes demasiado demasiada demasiados demasiadas");
  var WH = S("qu\xE9 qui\xE9n qui\xE9nes d\xF3nde ad\xF3nde cu\xE1ndo c\xF3mo cu\xE1nto cu\xE1nta cu\xE1ntos cu\xE1ntas cu\xE1l cu\xE1les");
  var TIME_N = S("segundo segundos minuto minutos hora horas d\xEDa d\xEDas semana semanas mes meses a\xF1o a\xF1os rato tiempo siglo siglos d\xE9cada d\xE9cadas momento");
  var CONNECTORS = [
    ["por lo tanto", "conn.consequence"],
    ["de modo que", "conn.consequence"],
    ["de manera que", "conn.consequence"],
    ["as\xED que", "conn.cause"],
    ["por eso", "conn.cause"],
    ["porque", "conn.cause"],
    ["ya que", "conn.cause-adv"],
    ["puesto que", "conn.cause-adv"],
    ["debido a", "conn.cause-adv"],
    ["a causa de", "conn.cause-adv"],
    ["dado que", "conn.cause-adv"],
    ["a pesar de", "conn.despite"],
    ["sin embargo", "conn.despite"],
    ["aun as\xED", "conn.despite"],
    ["no obstante", "conn.despite"],
    ["en primer lugar", "conn.discourse"],
    ["por un lado", "conn.discourse"],
    ["por otro lado", "conn.discourse"],
    ["en conclusi\xF3n", "conn.discourse"],
    ["adem\xE1s", "conn.additive"],
    ["en resumen", "conn.discourse"],
    ["o sea", "conn.reformulation"],
    ["es decir", "conn.reformulation"],
    ["mejor dicho", "conn.reformulation"],
    ["en otras palabras", "conn.reformulation"],
    ["al parecer", "conn.hedge"],
    ["supuestamente", "conn.hedge"],
    ["por lo visto", "conn.hedge"],
    ["si bien", "conn.concessive-adv"],
    ["aun cuando", "conn.concessive-adv"],
    ["de ah\xED que", "conn.consequence-adv"],
    ["por consiguiente", "conn.consequence-adv"],
    ["as\xED pues", "conn.consequence-adv"],
    ["primero", "conn.sequence"],
    ["luego", "conn.sequence"],
    ["al final", "conn.sequence"],
    ["al d\xEDa siguiente", "conn.sequence"],
    ["despu\xE9s", "conn.sequence"],
    ["a lo mejor", "conn.maybe"],
    ["cada vez m\xE1s", "comp.cada-vez"],
    ["ya no", "conn.ya"],
    ["todav\xEDa no", "conn.ya"],
    ["todav\xEDa", "conn.ya"]
  ].map(([p, k]) => [p.split(" "), k]).sort((a, b) => b[0].length - a[0].length);
  function npPass(ctx) {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const { words: words2 } = ctx;
    const used = /* @__PURE__ */ new Set();
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (w.punct) continue;
      const x = w.w;
      const p = words2[i - 1];
      const nx = words2[i + 1];
      if (ART.has(x) && w.pos === "det") add(ctx, "np.article", i, i);
      else if (POSS_SHORT.has(x) && w.pos === "poss") add(ctx, POSS_BASIC.has(x) ? "np.possessive.basic" : "np.possessive", i, i);
      else if (POSS_LONG.has(x)) add(ctx, "np.possessive.stressed", i, i);
      else if (DEM.has(x) && (w.pos === "dem" || w.pos === "pron")) add(ctx, DEM_BASIC.has(x) ? "np.demonstrative.basic" : "np.demonstrative", i, i);
      else if (INDEF.has(x)) add(ctx, x === "algo" || x === "alguien" ? "np.indefinite.basic" : "np.indefinite", i, i);
      else if (QUANT.has(x) || x === "muy") add(ctx, QUANT_BASIC.has(x) ? "np.quantifier.basic" : "np.quantifier", i, i);
      else if (x === "cada" || /^cualquiera?$/.test(x)) add(ctx, "np.cada", i, i);
      else if (x === "sino") add(ctx, "conj.sino", i, i);
      else if (TONIC.has(x) || ["\xE9l", "ella", "ellos", "ellas", "usted", "ustedes", "nosotros"].includes(x) && (p == null ? void 0 : p.pos) === "prep" && p.w !== "a") add(ctx, "pron.prep", (p == null ? void 0 : p.pos) === "prep" ? i - 1 : i, i);
      if (WH.has(x)) {
        add(ctx, "lex." + ((_a2 = WH_LEMMA[x]) != null ? _a2 : x), i, i, { lemma: (_b = WH_LEMMA[x]) != null ? _b : x });
        const qStart = p && (p.w === "\xBF" || p.pos === "prep" && ((_c = words2[i - 2]) == null ? void 0 : _c.w) === "\xBF");
        if (p && p.w === "\xA1" || x === "qu\xE9" && (p == null ? void 0 : p.w) === "\xA1") add(ctx, "excl.que", i, i + 1);
        else if (qStart) add(ctx, p.pos === "prep" ? "q.wh.prep" : "q.wh", p.pos === "prep" ? i - 1 : i, i);
        else if (p && !p.punct && !insideQuestion(words2, i)) add(ctx, "q.indirect", i, i);
        else add(ctx, "q.wh", i, i);
      }
      if (x === "lo" && w.pos === "det" && nx && ["adj", "x", "part"].includes(nx.pos) || x === "lo" && nx && ["mejor", "peor", "bueno", "malo", "importante", "dif\xEDcil", "raro"].includes(nx.w)) add(ctx, "np.lo-adj", i, i + 1);
      if (x === "hace" && nx && (nx.pos === "num" || ["un", "una", "unos", "unas", "mucho", "poco", "muchos", "pocos", "varios", "varias", "dos", "tres"].includes(nx.w))) {
        for (let j = i + 1; j <= i + 4 && j < words2.length; j++) {
          if (TIME_N.has(words2[j].w)) {
            const desde = (p == null ? void 0 : p.w) === "desde";
            const que = ((_d = words2[j + 1]) == null ? void 0 : _d.w) === "que";
            add(ctx, desde || que ? "time.hace-que" : "time.hace", desde ? i - 1 : i, que ? j + 1 : j);
            break;
          }
        }
      }
      if (x === "llevo" || x === "lleva" || x === "llevamos" || x === "llevan" || x === "llevas") {
        if (nx && (nx.pos === "num" || ["un", "una", "mucho", "poco", "dos", "tres", "varios"].includes(nx.w)) && words2.slice(i + 1, i + 4).some((y) => TIME_N.has(y.w))) add(ctx, "time.hace-que", i, i + 2);
      }
      if (/mente$/.test(x) && x.length > 6 && w.pos !== "verb") add(ctx, "adv.mente", i, i);
      const dim = x.match(/^(.+?)(c?it[oa]s?|c?ic[oa]s?)$/);
      if (dim && x.length > 5 && !lexEntry(x) && w.pos !== "verb" && !NOT_DIMINUTIVE.has(x.replace(/s$/, "").replace(/a$/, "o")) && !(w.lemma !== x && lexEntry(w.lemma) && ["adj", "noun"].includes(w.pos))) {
        const b = dim[1];
        if ([b + "o", b + "a", b + "e", b, b.replace(/qu$/, "c") + "o", b.replace(/gu$/, "g") + "o"].some((c) => lexEntry(c) || isKnownWord(c))) add(ctx, "np.diminutive", i, i);
      }
      if (x === "ahorita") add(ctx, "np.diminutive", i, i);
      if (w.pos === "inf" && p && (p.w === "al" || p.w === "sin" || p.w === "de" && ["antes", "despu\xE9s", "luego"].includes((_f = (_e = words2[i - 2]) == null ? void 0 : _e.w) != null ? _f : ""))) add(ctx, "nonfinite.prep-inf", p.w === "de" ? i - 2 : i - 1, i);
      if (x === "haber" && (nx == null ? void 0 : nx.pos) === "part") add(ctx, "nonfinite.perfect-inf", i, i + 1);
      if (w.pos === "ger" && !ctx.features.some((f) => f.key.startsWith("peri.") && f.span[1] === i)) add(ctx, "nonfinite.gerund", i, i);
      if (!used.has(i)) {
        for (const [toks, key3] of CONNECTORS) {
          if (toks.every((t, k) => {
            var _a3;
            return ((_a3 = words2[i + k]) == null ? void 0 : _a3.w) === t;
          })) {
            for (let k = 0; k < toks.length; k++) used.add(i + k);
            add(ctx, key3, i, i + toks.length - 1);
            break;
          }
        }
      }
      if (x === "lo" && nx && ["adj", "x", "adv", "part"].includes(nx.pos) && ((_g = words2[i + 2]) == null ? void 0 : _g.w) === "que") add(ctx, "np.lo-que-intensity", i, i + 2);
      if (w.pos === "adj" && w.lemma !== x) add(ctx, "np.adj-agreement", i, i);
      if (x === "nada" && (nx == null ? void 0 : nx.w) === "m\xE1s" && ((_h = words2[i + 2]) == null ? void 0 : _h.pos) === "inf") add(ctx, "conn.temporal-adv", i, i + 2);
      if (x === "medida" && (p == null ? void 0 : p.w) === "a" && (nx == null ? void 0 : nx.w) === "que") add(ctx, "conn.temporal-adv", i - 1, i + 1);
      if (w.lemma === "cuanto" && ((nx == null ? void 0 : nx.w) === "m\xE1s" || (nx == null ? void 0 : nx.w) === "menos")) add(ctx, "comp.cuanto-mas", i, i + 1);
      if (x === "debe" && (p == null ? void 0 : p.w) === "se" && ((_i = words2[i + 1]) == null ? void 0 : _i.pos) === "inf" || x === "uno" && (nx == null ? void 0 : nx.w) === "tiene" && ((_j = words2[i + 2]) == null ? void 0 : _j.w) === "que" || x === "conviene") add(ctx, "peri.impersonal-obligation", i, i);
      if (x === "de" && /^haber/.test((_k = nx == null ? void 0 : nx.w) != null ? _k : "") && ((_l = words2[i + 2]) == null ? void 0 : _l.pos) === "part" && (!p || p.punct)) add(ctx, "cond.de-haber", i, i + 2);
      if (w.pos === "inf" && w.sentStart && words2.slice(i + 1).some((y) => y.pos === "verb" && !y.punct)) add(ctx, "nonfinite.subject", i, i);
      if (x === "como" && w.pos === "conj" && (!p || p.punct) && words2.slice(i + 1, i + 8).some((y) => y.w === ",")) add(ctx, "conn.cause", i, i);
    }
  }
  var NOT_DIMINUTIVE = S("favorito bonito maldito erudito exquisito gratuito infinito mosquito apetito circuito distrito requisito exito \xE9xito cito visito necesito marchito fortuito ito");
  var TONIC = S("m\xED ti conmigo contigo consigo");
  function insideQuestion(words2, i) {
    for (let j = i - 1; j >= 0; j--) {
      if (words2[j].w === "\xBF") return true;
      if (words2[j].w === "?" || /[.!]/.test(words2[j].w)) return false;
    }
    return false;
  }
  var isKnownWord = (w) => !!lemmatize(w);
  var CONTENT_POS = /* @__PURE__ */ new Set(["noun", "adj", "adv", "x", "verb", "inf", "ger", "part"]);
  function lexemePass(ctx) {
    var _a2;
    const { words: words2 } = ctx;
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (!CONTENT_POS.has(w.pos) || w.aux || w.w === "hay") continue;
      if (w.pos === "x" && !w.known) continue;
      if (w.pos === "adv" && !lexEntry(w.lemma) && !/mente$/.test(w.w)) continue;
      if (LEXEME_STOP.has(w.lemma)) continue;
      if ((w.w === "don" || w.w === "do\xF1a") && ((_a2 = words2[i + 1]) == null ? void 0 : _a2.pos) === "propn") continue;
      if (w.pos === "verb" && w.lemma === "haber") continue;
      let lemma2 = w.lemma;
      if (["verb", "inf", "ger", "part"].includes(w.pos)) lemma2 = w.lemma;
      if (!lemma2) continue;
      add(ctx, "lex." + lemma2, i, i, { lemma: lemma2 });
    }
  }
  function unknownPass(ctx) {
    let quoted = false;
    for (const w of ctx.words) {
      if (w.punct && /[«»"“”]/.test(w.w)) {
        quoted = w.w === "\xAB" || w.w === "\u201C" ? true : w.w === "\xBB" || w.w === "\u201D" ? false : !quoted;
        continue;
      }
      if (quoted) continue;
      if (w.pos !== "unknown" || w.known) continue;
      const inexact = analyzeToken(w.w).filter((a) => !a.accentExact);
      if (inexact.length) ctx.low.push(`accent? "${w.w}" (engine: ${[...new Set(inexact.map((a) => a.form))].slice(0, 3).join(" / ")})`);
      else ctx.low.push(`unknown word "${w.w}"`);
    }
  }
  function detect(ctx) {
    verbPass(ctx);
    pronounPass(ctx);
    clausePass(ctx);
    periphrasisPass(ctx);
    copulaPass(ctx);
    miscPass(ctx);
    npPass(ctx);
    lexemePass(ctx);
    unknownPass(ctx);
  }

  // lib/tagger/nodemap.ts
  var DEFAULT_NODE_MAP = {
    // ---- present ----
    "tense.presente": "g:present-ar",
    "tense.presente.regular.ar": "g:present-ar",
    "tense.presente.regular.er": "g:present-er-ir",
    "tense.presente.regular.ir": "g:present-er-ir",
    "tense.presente.spelling.ar": "g:present-ar",
    "tense.presente.spelling.er": "g:present-er-ir",
    "tense.presente.spelling.ir": "g:present-er-ir",
    "tense.presente.stem-ie": "g:stem-boot",
    "tense.presente.stem-ue": "g:stem-boot",
    "tense.presente.stem-i": "g:stem-e-i",
    "tense.presente.irregular-yo": "g:yo-irregular",
    "tense.presente.irregular": "g:yo-irregular",
    "tense.presente.irregular.ser": "g:ser-identity",
    "tense.presente.irregular.estar": "g:estar-location-states",
    "tense.presente.irregular.ir": "g:ir-a-plans",
    // ---- preterite ----
    "tense.preterito": "g:preterite-ar",
    "tense.preterito.regular.ar": "g:preterite-ar",
    "tense.preterito.regular.er": "g:preterite-er-ir",
    "tense.preterito.regular.ir": "g:preterite-er-ir",
    "tense.preterito.spelling": "g:preterite-spelling-stem",
    "tense.preterito.stem": "g:preterite-spelling-stem",
    "tense.preterito.irregular": "g:preterite-irregular-strong",
    "tense.preterito.irregular.ser-ir": "g:preterite-ser-ir-hacer",
    "tense.preterito.irregular.hacer": "g:preterite-ser-ir-hacer",
    // ---- imperfect, future, conditional ----
    "tense.imperfecto": "g:imperfect-habitual",
    "tense.imperfecto.state": "g:imperfect-states",
    "tense.futuro": "g:future-promises",
    "tense.futuro.conjecture": "g:future-conjecture",
    // guessing about now: ¿Dónde estará? Serán las tres.
    "tense.condicional": "g:conditional",
    // ---- compounds ----
    "tense.perfecto": "g:perfecto-experience",
    "tense.plusc": "g:pluperfect",
    "tense.futperf": "g:future-perfect",
    "tense.condperf": "g:conditional-perfect",
    "participle.irregular": null,
    // ---- subjunctive tenses ----
    "tense.presubj": "g:subj-wanting",
    "tense.presubj.irregular": "g:subj-irregulars",
    "tense.impsubj": "g:imperfect-subj",
    "tense.impsubj.se": "g:se-form-recognition",
    "tense.perfsubj": "g:subj-perfect",
    "tense.pluscsubj": "g:pluperfect-subj",
    "tense.futsubj": "g:future-subj-recognition",
    // ---- subjunctive triggers ----
    "subj.volition": "g:subj-wanting",
    "subj.volition.want": "g:subj-wanting",
    "subj.volition.hope": "g:subj-wishes",
    "subj.volition.influence": "g:subj-influence",
    "subj.volition.reported": "g:reported-requests",
    "subj.volition.want.past": "g:subj-past-triggers",
    "subj.volition.hope.past": "g:subj-past-triggers",
    "subj.volition.influence.past": "g:subj-past-triggers",
    "subj.volition.reported.past": "g:reported-commands-past",
    "subj.emotion": "g:subj-emotion",
    "subj.emotion.basic": "g:subj-emotion-intro",
    "subj.emotion.past": "g:subj-past-triggers",
    "subj.emotion.basic.past": "g:subj-past-triggers",
    "subj.evaluation": "g:subj-value",
    "subj.evaluation.past": "g:subj-past-triggers",
    "subj.impersonal": "g:subj-value",
    "subj.impersonal.past": "g:subj-past-triggers",
    "subj.doubt": "g:subj-doubt",
    "subj.doubt.possible": "g:subj-doubt",
    "subj.doubt.negated-belief": "g:subj-opinion-negated",
    "subj.doubt.negated-perception": "g:subj-perception-negated",
    "subj.doubt.past": "g:subj-past-triggers",
    "subj.doubt.possible.past": "g:subj-past-triggers",
    "subj.doubt.negated-belief.past": "g:subj-past-triggers",
    "subj.doubt.negated-perception.past": "g:subj-perception-negated",
    "subj.ojala": "g:subj-wishes",
    "subj.ojala.past": "g:ojala-past",
    "subj.wish-que": "g:subj-wishes",
    "subj.wish-que.quien": "g:wish-exclamatives",
    "subj.adverb-doubt": "g:quizas-a-lo-mejor",
    "subj.purpose": "g:para-que",
    "subj.conj": "g:subj-purpose-full",
    "subj.conj.condition": "g:subj-conditions",
    "subj.conj.consequence": "g:consecutive-advanced",
    "subj.temporal": "g:subj-cuando-future",
    "subj.temporal.past": "g:subj-future-in-past",
    "subj.concessive": "g:subj-concessive",
    "subj.relative": "g:subj-relative",
    "subj.relative.free": "g:subj-free-relatives",
    "subj.como-si": "g:como-si",
    "subj.si": "g:si-hypothetical",
    "subj.factive": "g:mood-choice-fine",
    "subj.courtesy": "g:softening",
    "subj.unlicensed": null,
    "subj.fixed": null,
    // ---- conditional sentences ----
    "cond.real": "g:si-present",
    "cond.hypothetical": "g:si-hypothetical",
    "cond.past": "g:si-past-unreal",
    // ---- commands ----
    "cmd.tu.aff": "g:commands-tu",
    "cmd.usted.aff": "g:commands-usted",
    "cmd.ustedes.aff": "g:commands-usted",
    "cmd.tu.neg": "g:negative-commands",
    "cmd.usted.neg": "g:negative-commands",
    "cmd.ustedes.neg": "g:negative-commands",
    "cmd.nosotros": null,
    "cmd.vosotros": "g:vosotros-recognition",
    // ---- pronouns ----
    "clitic.do": "g:direct-objects",
    "clitic.io": "g:indirect-objects",
    "clitic.personal": "p:me-te-nos-objects",
    // me / te / nos as objects: ¿me ayudas?, te llamo (session 30)
    "clitic.combined": "g:double-pronouns",
    "clitic.se-lo": "g:double-pronouns",
    "clitic.enclitic.inf": "g:object-pronoun-position",
    "clitic.enclitic.ger": "g:object-pronoun-position",
    "clitic.enclitic.cmd": "g:commands-with-pronouns",
    "reflexive": "g:reflexive-routine",
    // quedarse, acordarse, dormirse… are vocabulary once reflexives are taught; the B1 node teaches the contrasts
    "reflexive.meaning": "g:reflexive-routine",
    "reflexive.change": "g:verbs-of-change",
    "gustar": "g:gustar-basic",
    "gustar.like": "g:gustar-full",
    "gustar.like.parecer": "g:parecer-quedar",
    "gustar.doubling": "g:gustar-full",
    "pron.prep": "g:prep-pronouns",
    // ---- se ----
    "se.impersonal": "g:se-impersonal",
    "se.passive.basic": "g:se-impersonal",
    "se.passive": "g:passive-se",
    "se.accidental": "g:se-accidental",
    // ---- relatives and clauses ----
    "rel.que": "g:relative-que",
    "rel.quien": "g:relatives-donde-lo-que",
    "rel.donde": "g:relatives-donde-lo-que",
    "rel.lo-que": "g:relatives-donde-lo-que",
    "rel.el-que": "g:relatives-prepositions",
    "rel.prep": "g:relatives-prepositions",
    "rel.cual": "g:relatives-formal",
    "rel.cuyo": "g:cuyo-relatives",
    "que.complement": "g:that-clauses",
    "q.wh": "g:questions",
    "q.wh.prep": "p:prep-questions-basic",
    // ¿de dónde?, ¿con quién?, ¿por qué? (session 18)
    "q.indirect": "g:indirect-questions",
    "excl.que": "p:exclamations-basic",
    // ¡Qué bonito! (session 23)
    "conj.cuando.ind": "p:cuando-basic",
    // cuando + present for habits (session 80)
    "conj.aunque.ind": "g:aunque-indicative",
    "conj.sino": "g:pero-sino",
    // ---- periphrases ----
    "peri.ir-a": "g:ir-a-plans",
    // tener que / hay que are verb + infinitive (session 24); g:tener-que-hay-que (82) is obligation in full, with deber
    "peri.tener-que": "g:verb-infinitive",
    "peri.hay-que": "g:verb-infinitive",
    "peri.acabar-de": "g:acabar-de-ya-todavia",
    "peri.estar-ger": "g:estar-gerund",
    "peri.estar-ger.past": "g:imperfect-progressive",
    "peri.seguir-ger": "g:gerund-ways",
    "peri.llevar-ger": "g:hace-que-desde",
    "peri.ir-ger": "g:gerund-ways",
    // the aspect frames keep their own (later) pattern days now that g:verb-infinitive is session 24
    "peri.volver-a": "p:volver-a-inf",
    "peri.dejar-de": "p:dejar-de-inf",
    "peri.empezar-a": "g:verb-infinitive",
    // empiezo a trabajar a las seis: plain verb + infinitive
    "peri.terminar-de": "g:verb-infinitive",
    "peri.ponerse-a": "p:ponerse-a-inf",
    "peri.soler": "p:soler-inf",
    "peri.deber": "g:tener-que-hay-que",
    "peri.poder": "g:verb-infinitive",
    "peri.querer": "g:verb-infinitive",
    "peri.estar-a-punto": null,
    // ---- ser / estar ----
    "ser": "g:ser-identity",
    "ser.passive": "g:passive-ser",
    "estar": "g:estar-location-states",
    "estar.result": "g:estar-participle",
    // ---- prepositions, comparison ----
    "prep.por": "g:por-para-1",
    "prep.para": "p:para-inf",
    // para + person / verb (session 25); por stays with por-para-1
    "por.fixed": null,
    "por.time": "g:por-para-2",
    "para.comparison": "g:por-para-2",
    "adj.ser-estar": "g:ser-estar-adjectives",
    "por.gracias": "p:gracias-por",
    // gracias por la ayuda (session 33)
    "por.price": "p:costar-pagar",
    // pagué veinte mil por la camisa, a cinco mil por kilo (session 33)
    "comp.mas-que": "g:comparatives",
    "comp.tan-como": "g:comparatives",
    "comp.irregular": "g:comparatives",
    "comp.tanto-como": "g:tanto-como",
    "comp.igual": "g:tanto-como",
    "comp.mas-de": "g:comparatives-advanced",
    "comp.cada-vez": "g:comparatives-advanced",
    "sup.relative": "g:superlatives",
    "sup.isimo": "g:superlatives",
    // ---- noun phrase ----
    "np.article": "g:gender-articles",
    "np.possessive": "g:possessives",
    // the everyday forms are licensed early by their own nodes (pull-forward pass); the plain keys
    // (nuestro, ese/aquel, bastante/demasiado, algún/ningún) stay with the full system
    "np.possessive.basic": "p:possessives-basic",
    // mi, tu, su (session 12)
    "np.demonstrative.basic": "p:demonstratives-basic",
    // este, esta, esto, eso (session 14)
    "np.quantifier.basic": "p:quantifiers-basic",
    // muy, mucho, poco (session 12)
    "np.indefinite.basic": "p:indefinites-basic",
    // algo, alguien (session 23)
    "np.possessive.stressed": "g:possessives-stressed",
    "np.demonstrative": "g:demonstratives",
    "np.indefinite": "g:indefinites",
    "np.quantifier": "g:quantifiers",
    "np.cada": "g:cada-cualquier",
    "np.lo-adj": "g:lo-adjective",
    "np.diminutive": "g:diminutives",
    "neg.double": "g:negation-words",
    "adv.mente": "g:adverbs-mente",
    // ---- time, haber ----
    "hay": "g:hay-vs-esta",
    "hay.tense": "g:imperfect-states",
    "hay.futuro": "g:future-promises",
    // habrá sol mañana
    "hay.futuro.conjecture": "g:future-conjecture",
    // ¿habrá alguien a esta hora?
    "time.hace": "g:hace-ago",
    "time.hace-que": "g:hace-que-desde",
    // ---- non-finite ----
    "nonfinite.al-inf": "g:prep-infinitive",
    "nonfinite.prep-inf": "g:prep-infinitive",
    "nonfinite.perfect-inf": "g:infinitive-perfect",
    "nonfinite.gerund": "g:gerund-ways",
    // ---- connectors ----
    "conn.cause": "g:cause-result",
    "conn.cause-adv": "g:causal-advanced",
    "conn.consequence": "g:consequence-connectors",
    "conn.consequence-adv": "g:consecutive-advanced",
    "conn.despite": "g:concession-despite",
    "conn.concessive-adv": "g:concessive-advanced",
    "conn.discourse": "g:discourse-structure",
    "conn.additive": null,
    // además is a word (l:además) from A2 on, not the B2 discourse-structure node
    "conn.reformulation": "g:reformulation",
    "conn.hedge": "g:hedging-distance",
    "conn.sequence": "p:time-sequence-basic",
    // primero, luego, después (session 32)
    "conn.maybe": "g:quizas-a-lo-mejor",
    "conn.ya": "p:ya-todavia-basic",
    // ya no, todavía (no) (session 52)
    "np.lo-que-intensity": "g:lo-que-intensity",
    "np.adj-agreement": "g:adjective-agreement",
    "conn.temporal-adv": "g:temporal-advanced",
    "comp.cuanto-mas": "g:comparative-advanced-c1",
    "peri.impersonal-obligation": "g:impersonal-obligation",
    "cond.de-haber": "g:conditional-advanced",
    "subj.conj.como": "g:conditional-advanced",
    "nonfinite.subject": "g:verb-infinitive",
    // Bailar es divertido (session 24)
    "clitic.io.doubling": "g:le-doubling",
    "reported.past": "g:reported-past-basic",
    "reported.backshift": "g:reported-backshift",
    "tense.mix": "g:pret-vs-imperfect",
    // ---- informative only ----
    "dialect.vosotros": "g:vosotros-recognition",
    "dialect.voseo": "g:voseo-recognition"
  };
  function ancestors(key3) {
    const parts = key3.split(".");
    const out = [];
    for (let n = parts.length; n >= 1; n--) out.push(parts.slice(0, n).join("."));
    return out;
  }
  function resolveNode(key3, opts = {}) {
    if (key3.startsWith("lex.")) return "l:" + key3.slice(4);
    if (key3.startsWith("chunk.")) return key3.slice(6);
    if (key3.startsWith("pattern.")) return key3.slice(8);
    const map = (k) => {
      if (opts.featureMap && k in opts.featureMap) return opts.featureMap[k];
      return k in DEFAULT_NODE_MAP ? DEFAULT_NODE_MAP[k] : void 0;
    };
    const chain = ancestors(key3);
    const mapped = [];
    for (const k of chain) {
      const m = map(k);
      if (m === null) {
        if (!mapped.length) return null;
        break;
      }
      if (m !== void 0) mapped.push(m);
    }
    if (!mapped.length) return null;
    if (opts.graphIds && opts.graphIds.size) {
      const hit = mapped.find((m) => opts.graphIds.has(m));
      if (hit) return hit;
    }
    return mapped[0];
  }
  function mappedKeys() {
    return Object.keys(DEFAULT_NODE_MAP).filter((k) => DEFAULT_NODE_MAP[k] !== null);
  }

  // lib/tagger/patterns.ts
  var fold = (s) => deaccent(s.toLowerCase()).replace(/ñ/g, "n");
  var TILDE = /* @__PURE__ */ new Set(["\xE9l", "t\xFA", "m\xED", "s\xED", "s\xE9", "t\xE9", "d\xE9", "m\xE1s", "qu\xE9", "c\xF3mo", "d\xF3nde", "cu\xE1ndo", "qui\xE9n", "qui\xE9nes", "cu\xE1nto", "cu\xE1nta", "cu\xE1ntos", "cu\xE1ntas", "cu\xE1l", "cu\xE1les", "a\xFAn", "s\xF3lo"]);
  var TILDE_FOLD = new Set([...TILDE].map(fold));
  var bare2 = (l) => /[aei]rse$/.test(l) || l === "irse" ? l.slice(0, -2) : l;
  var CLASSES = /* @__PURE__ */ new Set(["inf", "ger", "part", "verb", "subj", "cmd", "num", "noun", "adj", "adv", "name", "pron", "det", "poss", "dem", "prep", "cl", "np", "*", "quant", "int", "conj", "day", "month"]);
  var DAYS = new Set("lunes martes miercoles jueves viernes sabado domingo".split(" "));
  var MONTHS = new Set("enero febrero marzo abril mayo junio julio agosto septiembre setiembre octubre noviembre diciembre".split(" "));
  var TENSES2 = {
    pres: (w) => w.pos === "verb" && w.tense === "presente",
    pret: (w) => w.pos === "verb" && w.tense === "preterito",
    imp: (w) => w.pos === "verb" && w.tense === "imperfecto",
    fut: (w) => w.pos === "verb" && w.tense === "futuro",
    cond: (w) => w.pos === "verb" && w.tense === "condicional",
    subj: (w) => {
      var _a2;
      return w.pos === "verb" && /subj/.test((_a2 = w.tense) != null ? _a2 : "");
    },
    presubj: (w) => w.pos === "verb" && w.tense === "presubj",
    impsubj: (w) => {
      var _a2;
      return w.pos === "verb" && /^impsubj/.test((_a2 = w.tense) != null ? _a2 : "");
    },
    cmd: (w) => w.pos === "verb" && w.tense === "cmd",
    fin: (w) => w.pos === "verb",
    inf: (w) => w.pos === "inf",
    ger: (w) => w.pos === "ger",
    part: (w) => w.pos === "part"
  };
  var isSpec = (m) => /[{}()|?^$,]|![{(A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(m);
  var SpecError = class extends Error {
  };
  function parseSpec(src) {
    var _a2;
    const toks = (_a2 = src.match(/!?\{[^}]*\}\??|!?\(|\)\??|\||\^|\$|,|!?[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+\??|!?\d+\??/g)) != null ? _a2 : [];
    const rest = src.replace(/!?\{[^}]*\}\??|!?\(|\)\??|\||\^|\$|,|!?[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+\??|!?\d+\??/g, "").replace(/\s/g, "");
    if (rest) throw new SpecError(`spec "${src}": unexpected "${rest}"`);
    let k = 0;
    const seq = (depth) => {
      const alts2 = [[]];
      while (k < toks.length) {
        let raw = toks[k++];
        const neg = raw[0] === "!";
        if (neg) raw = raw.slice(1);
        if (raw === "|") {
          alts2.push([]);
          continue;
        }
        if (raw === ")" || raw === ")?") {
          if (!depth) throw new SpecError(`spec "${src}": unbalanced ")"`);
          k--;
          return alts2;
        }
        const cur = alts2[alts2.length - 1];
        if (raw === "(") {
          const inner = seq(depth + 1);
          const close = toks[k++];
          if (close !== ")" && close !== ")?") throw new SpecError(`spec "${src}": unclosed "("`);
          cur.push({ t: "grp", alts: inner, ...close === ")?" ? { opt: true } : {}, ...neg ? { neg: true } : {} });
          continue;
        }
        if (raw === "^") {
          cur.push({ t: "start" });
          continue;
        }
        if (raw === "$") {
          cur.push({ t: "end" });
          continue;
        }
        if (raw === ",") {
          cur.push({ t: "comma" });
          continue;
        }
        const opt = raw.endsWith("?");
        const body = opt ? raw.slice(0, -1) : raw;
        if (body[0] === "{") {
          const inner = body.slice(1, -1).trim();
          let it2;
          const gap = inner.match(/^\.\.\.(\d*)$/) || inner.match(/^…(\d*)$/);
          if (gap) it2 = { t: "gap", max: gap[1] ? +gap[1] : 3 };
          else if (CLASSES.has(inner)) it2 = { t: "cls", v: inner };
          else {
            const [l, tense] = inner.split(":");
            if (!/^[a-záéíóúüñ]+$/.test(l)) throw new SpecError(`spec "${src}": bad token {${inner}}`);
            if (tense && !TENSES2[tense]) throw new SpecError(`spec "${src}": unknown tense "${tense}" in {${inner}}`);
            it2 = { t: "lemma", v: fold(bare2(l)), ...tense ? { tense } : {} };
          }
          if (opt) it2.opt = true;
          if (neg) it2.neg = true;
          cur.push(it2);
          continue;
        }
        const lw = body.toLowerCase();
        const it = { t: "lit", v: fold(lw), ...TILDE.has(lw) || TILDE_FOLD.has(lw) ? { exact: lw } : {} };
        if (opt) it.opt = true;
        if (neg) it.neg = true;
        cur.push(it);
      }
      return alts2;
    };
    const alts = seq(0);
    if (k < toks.length) throw new SpecError(`spec "${src}": unbalanced ")"`);
    const top = alts.length === 1 ? alts[0] : [{ t: "grp", alts }];
    if (!top.some((x) => !x.opt && !x.neg && x.t !== "start" && x.t !== "end" && x.t !== "comma" && x.t !== "gap")) throw new SpecError(`spec "${src}": matches nothing`);
    return top;
  }
  function anchors(seq) {
    const out = [];
    for (const it of seq) {
      if (it.opt || it.neg) continue;
      if (it.t === "lit") out.push(["w:" + it.v]);
      else if (it.t === "lemma") out.push(["l:" + it.v]);
      else if (it.t === "grp") {
        const firsts = it.alts.map((a) => anchors(a)[0]);
        if (firsts.every(Boolean)) out.push([...new Set(firsts.flat())]);
      }
    }
    return out;
  }
  function compileSpec(src) {
    const seq = parseSpec(src);
    return { seq, need: anchors(seq) };
  }
  var TRANSPARENT = /* @__PURE__ */ new Set(["\xBF", "\xA1", "\xAB", "\xBB", '"', "\u201C", "\u201D", "\u2014", "\u2013", "-", "(", ")"]);
  var NP_PRE = /* @__PURE__ */ new Set(["det", "poss", "dem", "num", "quant"]);
  var NP_HEAD = /* @__PURE__ */ new Set(["noun", "adj", "x", "propn", "num", "part", "unknown"]);
  var STRONG_PRON = /* @__PURE__ */ new Set(["\xE9l", "ella", "ellos", "ellas", "usted", "ustedes", "yo", "t\xFA", "nosotros", "nosotras", "vosotros", "vosotras", "m\xED", "ti", "esto", "eso", "aquello", "algo", "nada", "alguien", "nadie", "todo"]);
  function matchTokens(words2) {
    const out = [];
    for (const w of words2) {
      if (w.punct && TRANSPARENT.has(w.w)) continue;
      out.push({ ...w, f: fold(w.w), fl: fold(bare2(w.lemma || w.w)) });
    }
    return out;
  }
  function sentenceKeys(ms) {
    const s = /* @__PURE__ */ new Set();
    for (const w of ms) if (!w.punct) {
      s.add("w:" + w.f);
      s.add("l:" + w.fl);
      s.add("l:" + fold(w.w));
    }
    return s;
  }
  function hasAnchors(spec, keys) {
    return spec.need.every((any) => any.some((k) => keys.has(k)));
  }
  function isNum(w) {
    return w.pos === "num" || /^\d/.test(w.w);
  }
  function clsMatch(c, w) {
    var _a2;
    switch (c) {
      case "*":
        return true;
      case "inf":
        return w.pos === "inf";
      case "ger":
        return w.pos === "ger";
      case "part":
        return w.pos === "part";
      case "verb":
        return w.pos === "verb";
      case "subj":
        return w.pos === "verb" && /subj/.test((_a2 = w.tense) != null ? _a2 : "");
      case "cmd":
        return w.pos === "verb" && w.tense === "cmd";
      case "num":
        return isNum(w);
      case "noun":
        return w.pos === "noun" || w.pos === "x";
      case "adj":
        return w.pos === "adj" || w.pos === "part" || w.pos === "x";
      case "adv":
        return w.pos === "adv";
      case "name":
        return w.pos === "propn";
      case "pron":
        return w.pos === "pron";
      case "det":
        return w.pos === "det";
      case "poss":
        return w.pos === "poss";
      case "dem":
        return w.pos === "dem";
      case "prep":
        return w.pos === "prep";
      case "cl":
        return w.pos === "clitic";
      case "quant":
        return w.pos === "quant";
      case "int":
        return w.pos === "int";
      case "conj":
        return w.pos === "conj";
      case "day":
        return DAYS.has(fold(w.w));
      case "month":
        return MONTHS.has(fold(w.w));
      default:
        return false;
    }
  }
  function stepEnds(ms, it, k) {
    if (it.neg) return stepEnds(ms, { ...it, neg: false, opt: false }, k).some((e) => e > k) ? [] : [k];
    const ends = [];
    if (it.opt) ends.push(k);
    const w = ms[k];
    switch (it.t) {
      case "start":
        return k === 0 || ms[k - 1].punct ? [k] : [];
      case "end":
        return k >= ms.length || ms[k].punct ? [k] : [];
      case "comma":
        if (w && w.punct && w.w === ",") ends.push(k + 1);
        return ends;
      case "gap": {
        ends.push(k);
        for (let j = k; j < ms.length && j - k < it.max && !ms[j].punct; j++) ends.push(j + 1);
        return ends;
      }
      case "grp": {
        for (const alt of it.alts) for (const e of seqEnds(ms, alt, 0, k)) ends.push(e);
        return ends;
      }
      default:
        break;
    }
    if (!w || w.punct) return ends;
    if (it.t === "lit") {
      if (w.f === it.v && (!it.exact || w.w === it.exact || !TILDE.has(w.w) && !TILDE.has(it.exact))) ends.push(k + 1);
      return ends;
    }
    if (it.t === "lemma") {
      if ((w.fl === it.v || w.pos !== "verb" && w.pos !== "inf" && w.pos !== "ger" && w.pos !== "part" && w.f === it.v) && (!it.tense || TENSES2[it.tense](w))) ends.push(k + 1);
      return ends;
    }
    if (it.v === "np") {
      if (w.pos === "pron" && STRONG_PRON.has(w.w)) ends.push(k + 1);
      if (w.pos === "propn") {
        let j = k;
        while (j < ms.length && !ms[j].punct && ms[j].pos === "propn") j++;
        ends.push(j);
      }
      for (let pre = 0; pre <= 2; pre++) {
        if (pre > 0 && (k + pre - 1 >= ms.length || ms[k + pre - 1].punct || !NP_PRE.has(ms[k + pre - 1].pos))) break;
        let j = k + pre, n = 0;
        while (j < ms.length && !ms[j].punct && NP_HEAD.has(ms[j].pos) && n < 3) {
          j++;
          n++;
          ends.push(j);
        }
      }
      return [...new Set(ends)];
    }
    if (clsMatch(it.v, w)) ends.push(k + 1);
    return ends;
  }
  function seqEnds(ms, seq, m, k) {
    if (m === seq.length) return [k];
    const out = [];
    for (const e of stepEnds(ms, seq[m], k)) for (const r of seqEnds(ms, seq, m + 1, e)) out.push(r);
    return out;
  }
  function findSpec(ms, spec) {
    for (let k = 0; k < ms.length; k++) {
      const ends = seqEnds(ms, spec.seq, 0, k).filter((e) => e > k);
      if (ends.length) {
        let a = k;
        while (a < ms.length && ms[a].punct) a++;
        let b = Math.max(...ends) - 1;
        while (b > a && ms[b].punct) b--;
        if (a <= b) return [a, b];
      }
    }
    return null;
  }

  // lib/tagger/dialect.ts
  var prev = (w, i, n = 1) => {
    var _a2, _b;
    return (_b = (_a2 = w[i - n]) == null ? void 0 : _a2.w) != null ? _b : "";
  };
  var nextW = (w, i, n = 1) => {
    var _a2, _b;
    return (_b = (_a2 = w[i + n]) == null ? void 0 : _a2.w) != null ? _b : "";
  };
  var DETPOSS = /* @__PURE__ */ new Set(["un", "una", "mi", "tu", "su", "nuestro", "nuestra", "el", "la", "este", "esta", "ese", "esa", "del", "al", "mis", "tus", "sus", "los", "las", "unos", "unas"]);
  var afterDet = (w, i) => {
    var _a2;
    return DETPOSS.has(prev(w, i)) || ((_a2 = w[i - 1]) == null ? void 0 : _a2.pos) === "adj";
  };
  var standalone = (w, i) => (!w[i - 1] || w[i - 1].punct) && (!w[i + 1] || w[i + 1].punct);
  var nounUse = (w, i) => afterDet(w, i) || ["de", "en", "con", "sin", "para", "por"].includes(prev(w, i));
  var DIALECT_LEXICON = [
    // transport and the street
    { forms: ["coche", "coches"], severity: "error", fix: "carro" },
    { forms: ["aparcar"], verb: "aparcar", severity: "error", fix: "parquear / estacionar" },
    { forms: ["aparcamiento", "aparcamientos"], severity: "error", fix: "parqueadero / estacionamiento" },
    { forms: [], verb: "conducir", severity: "warning", fix: "manejar", note: "conducir is understood, but LatAm drives with manejar" },
    { forms: ["carn\xE9 de conducir", "carnet de conducir"], severity: "error", fix: "licencia de conducci\xF3n / licencia de manejo" },
    { forms: ["autob\xFAs", "autobuses"], severity: "warning", fix: "bus (Colombia) / cami\xF3n (M\xE9xico)" },
    { forms: ["atasco", "atascos"], severity: "warning", fix: "tranc\xF3n (Colombia) / tr\xE1fico / embotellamiento" },
    {
      forms: ["billete", "billetes"],
      severity: "warning",
      fix: "tiquete / boleto / pasaje (a billete is a banknote in LatAm)",
      when: (w, i) => !/^(de|mil|pesos|dólares)$/.test(nextW(w, i)) || /^(avión|tren|bus|autobús|metro|ida|vuelta)$/.test(nextW(w, i, 2))
    },
    { forms: ["maletero"], severity: "error", fix: "ba\xFAl (Colombia) / cajuela (M\xE9xico)" },
    { forms: ["gasolinera"], severity: "warning", fix: "bomba / estaci\xF3n de servicio (Colombia)" },
    { forms: ["acera"], severity: "warning", fix: "and\xE9n (Colombia) / banqueta (M\xE9xico) / vereda" },
    // technology
    { forms: ["ordenador", "ordenadores"], severity: "error", fix: "computador / computadora" },
    { forms: ["m\xF3vil", "m\xF3viles"], severity: "error", fix: "celular", when: (w, i) => nounUse(w, i) || prev(w, i) === "tel\xE9fono" },
    { forms: ["port\xE1til", "port\xE1tiles"], severity: "warning", fix: 'port\xE1til is fine as an adjective; the noun is "el port\xE1til / el computador port\xE1til / el laptop"', when: afterDet },
    // food and drink
    { forms: ["zumo", "zumos"], severity: "error", fix: "jugo" },
    { forms: ["patata", "patatas"], severity: "error", fix: "papa" },
    { forms: ["melocot\xF3n", "melocotones"], severity: "error", fix: "durazno" },
    { forms: ["albaricoque", "albaricoques"], severity: "warning", fix: "durazno / albaricoque (rare in Colombia)" },
    { forms: ["gamba", "gambas"], severity: "error", fix: "camar\xF3n / camarones" },
    { forms: ["jud\xEDas", "jud\xEDa"], severity: "error", fix: "fr\xEDjoles (Colombia) / frijoles; jud\xEDas verdes = habichuelas" },
    { forms: ["guisantes", "guisante"], severity: "error", fix: "arvejas" },
    { forms: ["cacahuete", "cacahuetes"], severity: "error", fix: "man\xED" },
    { forms: ["tarta", "tartas"], severity: "warning", fix: "torta / pastel" },
    { forms: ["bocadillo", "bocadillos"], severity: "error", fix: "s\xE1ndwich (in Colombia a bocadillo is guava paste)" },
    { forms: ["pimiento", "pimientos"], severity: "warning", fix: "piment\xF3n (Colombia) / chile / pimiento" },
    { forms: ["frigor\xEDfico", "frigor\xEDficos"], severity: "error", fix: "nevera / refrigerador" },
    { forms: ["ca\xF1a", "ca\xF1as"], severity: "warning", fix: "cerveza / una fr\xEDa (a ca\xF1a is a draught beer only in Spain)", when: (w, i) => /^(de|unas|una|tomar|una)$/.test(prev(w, i)) || /cerveza/.test(nextW(w, i, 2)) },
    { forms: ["ir de ca\xF1as", "ir de tapas"], severity: "error", fix: "tomar algo / salir a tomar unas cervezas" },
    { forms: ["me pones", "ponme", "p\xF3ngame", "me pone"], severity: "warning", fix: "\xBFme da\u2026? / \xBFme regala\u2026? (Colombia) / quisiera\u2026", when: (w, i) => w.slice(i, i + 4).some((x) => ["un", "una", "dos", "otro", "otra", "caf\xE9", "cerveza"].includes(x.w)) },
    { forms: ["hacer la compra"], severity: "warning", fix: "hacer mercado (Colombia) / hacer las compras" },
    // clothes and home
    { forms: ["gafas"], severity: "warning", fix: "gafas is fine in Colombia; lentes / anteojos elsewhere" },
    { forms: ["jersey", "jers\xE9is", "jerseys"], severity: "error", fix: "su\xE9ter / saco (Colombia)" },
    { forms: ["americana"], severity: "warning", fix: "saco / blazer", when: afterDet },
    { forms: ["ba\xF1ador", "ba\xF1adores"], severity: "error", fix: "vestido de ba\xF1o (Colombia) / traje de ba\xF1o" },
    { forms: ["ch\xE1ndal"], severity: "error", fix: "sudadera" },
    { forms: ["vaqueros"], severity: "warning", fix: "jeans / bluy\xEDn", when: (w, i) => afterDet(w, i) || prev(w, i) === "unos" },
    { forms: ["zapatillas de deporte"], severity: "error", fix: "tenis" },
    { forms: ["cazadora", "cazadoras"], severity: "error", fix: "chaqueta" },
    {
      forms: ["piso", "pisos"],
      severity: "warning",
      fix: "apartamento (piso = floor in LatAm)",
      when: (w, i) => /^(un|mi|tu|su|nuestro|este|ese)$/.test(prev(w, i)) && !/^(de|arriba|abajo)$/.test(nextW(w, i)) || nextW(w, i) === "compartido" || /^(compartir|alquilar|comprar|buscar)$/.test(prev(w, i))
    },
    { forms: ["grifo", "grifos"], severity: "error", fix: "llave (del agua)" },
    { forms: ["fregona"], severity: "error", fix: "trapeador" },
    { forms: [], verb: "fregar", severity: "warning", fix: "lavar (los platos) / trapear" },
    { forms: ["tirita", "tiritas"], severity: "error", fix: "curita" },
    { forms: ["cerilla", "cerillas"], severity: "error", fix: "f\xF3sforo" },
    { forms: ["mechero", "mecheros"], severity: "error", fix: "encendedor" },
    { forms: ["bol\xEDgrafo", "bol\xEDgrafos", "boli"], severity: "warning", fix: "esfero (Colombia) / lapicero / pluma" },
    { forms: ["folio", "folios"], severity: "error", fix: "hoja" },
    { forms: ["chubasquero"], severity: "error", fix: "impermeable" },
    // people and talk
    {
      forms: ["t\xEDo", "t\xEDa", "t\xEDos", "t\xEDas"],
      severity: "error",
      fix: "amigo / man / parcero (Colombia) \u2014 t\xEDo only for uncle",
      when: (w, i) => (prev(w, i) === "," || nextW(w, i) === "," || ["\xA1", "!"].includes(prev(w, i)) || ["!"].includes(nextW(w, i)) || /^(un|una|ese|esa|este|esta|qué)$/.test(prev(w, i))) && !/^(mi|tu|su|el|la|nuestro|nuestra)$/.test(prev(w, i)) && nextW(w, i) !== "de"
    },
    { forms: ["chaval", "chavala", "chavales"], severity: "error", fix: "muchacho / pelado (Colombia) / chico" },
    { forms: ["majo", "maja", "majos", "majas"], severity: "error", fix: "simp\xE1tico / amable / buena gente" },
    { forms: ["guay", "guays"], severity: "error", fix: "ch\xE9vere / bacano (Colombia) / genial" },
    { forms: ["mola", "molan", "molaba", "molar", "mole"], severity: "error", fix: "me encanta / es ch\xE9vere", when: (w, i) => w[i].w !== "mole" || prev(w, i) === "me" },
    { forms: ["vale"], severity: "error", fix: "est\xE1 bien / de acuerdo / listo / dale", when: (w, i) => standalone(w, i) || prev(w, i) === "\xBF" || w[i].sentStart && nextW(w, i) === "," || prev(w, i) === "," && (!w[i + 1] || w[i + 1].punct) },
    { forms: ["venga"], severity: "warning", fix: "dale / listo / vamos (as an interjection)", when: standalone },
    { forms: ["gilipollas"], severity: "error", fix: "idiota / tonto (avoid insults in course content)" },
    { forms: ["joder", "hostia", "hostias", "co\xF1o"], severity: "error", fix: "avoid (Peninsular vulgarity); uy / caramba / qu\xE9 pena" },
    { forms: ["ostras"], severity: "error", fix: "uy / caramba / \xA1no puede ser!", when: standalone },
    { forms: ["mogoll\xF3n"], severity: "error", fix: "un mont\xF3n / much\xEDsimo" },
    { forms: ["currar", "curro", "curra", "curras", "curramos", "curran", "curr\xE9", "curr\xF3"], severity: "error", fix: "trabajar / el trabajo / la chamba" },
    { forms: ["pasta"], severity: "warning", fix: "plata (money)", when: (w, i) => /^(mucha|poca|la|tanta|sin)$/.test(prev(w, i)) && !/^(con|de)$/.test(nextW(w, i)) },
    { forms: ["flipar", "flipo", "flipas", "flipa", "flip\xE9", "flipante"], severity: "error", fix: "quedar impresionado / \xA1qu\xE9 impresionante!" },
    { forms: ["cabrearse", "cabreado", "cabreada", "cabreo"], severity: "error", fix: "enojarse / ponerse bravo (Colombia)" },
    { forms: [], verb: "enfadarse", severity: "warning", fix: "enojarse / ponerse bravo (Colombia)" },
    { forms: ["enfadado", "enfadada", "enfadados", "enfadadas"], severity: "warning", fix: "enojado / bravo (Colombia)" },
    { forms: ["pijo", "pija", "pijos"], severity: "error", fix: "gomelo (Colombia) / fresa (M\xE9xico) / cre\xEDdo" },
    { forms: ["cotilla", "cotillas"], severity: "error", fix: "chismoso" },
    { forms: ["cotillear", "cotilleo"], severity: "error", fix: "chismear / el chisme" },
    { forms: ["pillar", "pillo", "pill\xE9", "pilla"], severity: "warning", fix: "agarrar / entender / alcanzar" },
    { forms: ["chulo", "chula", "chulos", "chulas"], severity: "warning", fix: "ch\xE9vere / bonito / lindo" },
    { forms: ["mono", "mona", "monos", "monas"], severity: "warning", fix: "lindo / bonito (mono = monkey; in Colombia mono = blond)", when: (w, i) => /^(qué|muy|tan|más)$/.test(prev(w, i)) },
    { forms: ["qu\xE9 fuerte"], severity: "warning", fix: "\xA1qu\xE9 impresionante! / \xA1no puede ser!", when: (w, i) => !w[i + 2] || w[i + 2].punct },
    { forms: ["enhorabuena"], severity: "warning", fix: "felicitaciones / felicidades" },
    { forms: ["echar de menos"], severity: "warning", fix: "extra\xF1ar" },
    { forms: [], verb: "apetecer", severity: "warning", fix: "provocar (Colombia) / tener ganas de / antojarse" },
    { forms: [], verb: "coger", severity: "error", fix: "tomar / agarrar (coger is vulgar in much of LatAm)" },
    { forms: [], verb: "molar", severity: "error", fix: "gustar / encantar" },
    // school and work
    { forms: ["instituto"], severity: "warning", fix: "colegio", when: (w, i) => afterDet(w, i) || prev(w, i) === "en" },
    { forms: ["deberes"], severity: "warning", fix: "tareas", when: (w, i) => /^(los|mis|tus|sus|hacer|de)$/.test(prev(w, i)) },
    { forms: ["suspender", "suspend\xED", "suspendi\xF3", "suspendo", "suspenso", "suspensos"], severity: "warning", fix: "perder / reprobar (un examen)", when: (w, i) => w.slice(i, i + 4).some((x) => /examen|asignatura|materia|curso/.test(x.w)) || w[i].w.startsWith("suspenso") },
    { forms: ["camarero", "camarera", "camareros", "camareras"], severity: "warning", fix: "mesero / mesera" },
    { forms: ["fontanero", "fontanera", "fontaneros"], severity: "error", fix: "plomero" },
    { forms: ["aseos", "aseo"], severity: "warning", fix: "ba\xF1o(s)", when: afterDet },
    { forms: ["el paro"], severity: "warning", fix: "el desempleo (paro = strike in Colombia)", when: (w, i) => /^(en|del|al)$/.test(prev(w, i)) || /^(está|estoy|estás|están)$/.test(prev(w, i, 2)) },
    { forms: ["parado", "parada", "parados"], severity: "warning", fix: "desempleado (parado = standing in LatAm)", when: (w, i) => /^(está|estoy|estás|están|estaba)$/.test(prev(w, i)) && /trabajo|empleo/.test(w.slice(i, i + 4).map((x) => x.w).join(" ")) },
    { forms: ["ordenador port\xE1til"], severity: "error", fix: "computador port\xE1til / laptop" },
    { forms: ["vacaciones de verano"], severity: "warning", fix: "vacaciones de mitad de a\xF1o (Colombia has no summer)" }
  ];
  var BY_FIRST = /* @__PURE__ */ new Map();
  var BY_VERB = /* @__PURE__ */ new Map();
  for (const e of DIALECT_LEXICON) {
    for (const f of e.forms) {
      const k = f.split(" ")[0];
      const l = BY_FIRST.get(k);
      if (l) l.push(e);
      else BY_FIRST.set(k, [e]);
    }
    if (e.verb) BY_VERB.set(e.verb, e);
  }
  var SAME_DAY = /\b(hoy|esta mañana|esta tarde|esta noche|este mediodía|hace un rato|hace poco|hace unos minutos|hace una hora|ahorita)\b/;
  function ustedesForm(inf, tense) {
    var _a2;
    try {
      const v = (_a2 = verbByInf(inf)) != null ? _a2 : verbByInf(bareOf(inf));
      if (!v) return null;
      if (tense === "imperativo") return conjugate(v, "imperativo")[IMP_PERSONS.indexOf("ustedes")];
      return conjugate(v, tense)[PERSONS.indexOf("ellos")];
    } catch {
      return null;
    }
  }
  function tuForm(inf, tense) {
    var _a2;
    try {
      const v = (_a2 = verbByInf(inf)) != null ? _a2 : verbByInf(bareOf(inf));
      if (!v) return null;
      if (tense === "imperativo") return conjugate(v, "imperativo")[0];
      return conjugate(v, tense)[PERSONS.indexOf("t\xFA")];
    } catch {
      return null;
    }
  }
  function dialectLint(text, words2 = analyzeWords(text)) {
    var _a2, _b, _c, _d, _e, _f;
    const out = [];
    const push2 = (f) => out.push(f);
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (w.punct || w.pos === "propn") continue;
      if (w.w === "vosotros" || w.w === "vosotras") push2({ severity: "error", word: w.text, index: i, rule: "vosotros", problem: "vosotros (Spain only)", fix: "ustedes" });
      else if (w.w === "os" && (w.pos === "clitic" || ((_a2 = words2[i + 1]) == null ? void 0 : _a2.pos) === "verb")) push2({ severity: "error", word: w.text, index: i, rule: "vosotros", problem: '"os" (vosotros pronoun, Spain only)', fix: "les / los / se (ustedes)" });
      else if (/^vuestr[oa]s?$/.test(w.w)) push2({ severity: "error", word: w.text, index: i, rule: "vosotros", problem: `"${w.w}" (vosotros possessive)`, fix: "su / sus (de ustedes)" });
      else if (w.w === "vos" && !w.capMid) push2({ severity: "error", word: w.text, index: i, rule: "voseo", problem: '"vos" (voseo)', fix: "t\xFA" });
      if (w.pos === "verb" && ((_b = w.verb) == null ? void 0 : _b.length) && w.verb.every((a) => a.variety)) {
        const a = w.verb[0];
        if (a.variety === "vosotros") {
          const fix = ustedesForm(a.inf, a.tense);
          push2({ severity: "error", word: w.text, index: i, rule: "vosotros", problem: `"${w.text}" is a vosotros form (${a.inf}, ${a.tense})`, fix: fix ? `ustedes: "${fix}"` : "use the ustedes form" });
        } else if (a.variety === "voseo") {
          const fix = tuForm(a.inf, a.tense);
          push2({ severity: "error", word: w.text, index: i, rule: "voseo", problem: `"${w.text}" is voseo (${a.inf})`, fix: fix ? `t\xFA: "${fix}"` : "use the t\xFA form" });
        }
      }
      if (["verb", "inf", "ger", "part"].includes(w.pos)) {
        const infs = /* @__PURE__ */ new Set([w.lemma, bareOf(w.lemma), ...((_c = w.verb) != null ? _c : []).map((a) => a.inf), ...((_d = w.verb) != null ? _d : []).map((a) => bareOf(a.inf))]);
        for (const inf of infs) {
          const e = BY_VERB.get(inf);
          if (e && (!e.when || e.when(words2, i))) {
            push2({ severity: e.severity, word: w.text, index: i, rule: "lexicon", problem: `"${w.text}" (${inf}) is Peninsular${e.note ? ` \u2014 ${e.note}` : ""}`, fix: e.fix });
            break;
          }
        }
      }
      for (const e of (_e = BY_FIRST.get(w.w)) != null ? _e : []) {
        for (const f of e.forms) {
          const toks = f.split(" ");
          if (toks[0] !== w.w) continue;
          if (!toks.every((t, k) => {
            var _a3;
            return ((_a3 = words2[i + k]) == null ? void 0 : _a3.w) === t;
          })) continue;
          if (e.when && !e.when(words2, i)) continue;
          if (e.verb && ["verb", "inf", "ger", "part"].includes(w.pos)) continue;
          push2({ severity: e.severity, word: toks.map((_, k) => words2[i + k].text).join(" "), index: i, rule: "lexicon", problem: `"${f}" is Peninsular${e.note ? ` \u2014 ${e.note}` : ""}`, fix: e.fix });
        }
      }
    }
    const lower = words2.map((w) => w.w).join(" ");
    if (SAME_DAY.test(lower)) {
      for (let i = 0; i < words2.length; i++) {
        const w = words2[i];
        if (w.aux !== "haber" || !((_f = w.verb) == null ? void 0 : _f.some((a) => a.tense === "presente" && a.inf === "haber"))) continue;
        const p = words2.findIndex((x) => x.compoundOf === i);
        if (p < 0) continue;
        const person = w.verb.find((a) => a.inf === "haber" && a.tense === "presente").person;
        let fix = "use the preterite";
        try {
          const v = verbByInf(words2[p].lemma);
          if (v) fix = `preterite: "${conjugate(v, "preterito")[PERSONS.indexOf(person)]}"`;
        } catch {
        }
        push2({ severity: "warning", word: `${w.text} ${words2[p].text}`, index: i, rule: "perfecto-hoy", problem: `"${w.text} ${words2[p].text}" with a same-day time: LatAm narrates finished events in the preterite`, fix });
      }
    }
    return out;
  }

  // lib/tagger/accent.ts
  var ENGINE_DEAC = null;
  var FORMS_DEAC = null;
  function engineDeac() {
    if (ENGINE_DEAC) return ENGINE_DEAC;
    const m = /* @__PURE__ */ new Map();
    const add2 = (f) => {
      for (const w of f.toLowerCase().split(" ")) {
        if (!w || w === "no") continue;
        const d = deaccent(w);
        const s = m.get(d);
        if (s) s.add(w);
        else m.set(d, /* @__PURE__ */ new Set([w]));
      }
    };
    for (const v of VERBS) {
      add2(v.inf.replace(/se$/, ""));
      for (const t of TENSES) {
        if (isCompound(t.key)) continue;
        try {
          conjugate(v, t.key).forEach((f) => f && add2(f));
        } catch {
        }
      }
      try {
        participles(v).forEach(add2);
        add2(gerund(v));
      } catch {
      }
    }
    ENGINE_DEAC = m;
    return m;
  }
  function formsDeac() {
    if (FORMS_DEAC) return FORMS_DEAC;
    const m = /* @__PURE__ */ new Map();
    for (const w of forms_default) {
      if (!/[áéíóú]/.test(w)) continue;
      const d = deaccent(w);
      const s = m.get(d);
      if (s) s.add(w);
      else m.set(d, /* @__PURE__ */ new Set([w]));
    }
    FORMS_DEAC = m;
    return m;
  }
  var INTERROG = new Map(Object.entries({ que: "qu\xE9", como: "c\xF3mo", donde: "d\xF3nde", cuando: "cu\xE1ndo", quien: "qui\xE9n", quienes: "qui\xE9nes", cual: "cu\xE1l", cuales: "cu\xE1les", cuanto: "cu\xE1nto", cuanta: "cu\xE1nta", cuantos: "cu\xE1ntos", cuantas: "cu\xE1ntas", adonde: "ad\xF3nde" }));
  var PREP_BEFORE_INT = /* @__PURE__ */ new Set(["de", "a", "por", "para", "con", "en", "desde", "hasta", "sin"]);
  var LOC_AFTER_ESTA = /* @__PURE__ */ new Set(["bien", "mal", "en", "aqu\xED", "all\xED", "ah\xED", "ac\xE1", "all\xE1", "muy", "cerca", "lejos", "listo", "lista", "bastante", "tan", "demasiado", "todav\xEDa", "enfermo", "enferma", "contento", "contenta", "cansado", "cansada", "abierto", "abierta", "cerrado", "cerrada", "lleno", "llena", "libre", "ocupado", "ocupada", "seguro", "segura", "loco", "loca"]);
  function cliticStressFix(x, E) {
    if (/[áéíóú]/.test(x)) return null;
    for (const c2 of ["", "me", "te", "se", "lo", "la", "le", "nos", "los", "las", "les"]) {
      for (const c1 of ["me", "te", "se", "lo", "la", "le", "nos", "los", "las", "les"]) {
        const cl = c1 + c2;
        if (!x.endsWith(cl) || x.length <= cl.length + 2) continue;
        if (/(al|el|il)es$/.test(x) && cl.endsWith("les")) continue;
        const base = x.slice(0, -cl.length);
        if (E.has(base) && /(ando|iendo|yendo)$/.test(base)) return { what: "gerund", fix: attachEnclitic(base, cl) };
        const imp = analyzeToken(base).filter((a) => a.tense === "imperativo" && a.accentExact && a.person !== "vosotros");
        if (imp.length && base.length > 2 && !["da", "di", "ve", "ten", "pon", "sal", "haz", "ven", "s\xE9"].includes(base)) {
          const fixed = attachEnclitic(imp[0].form, cl);
          if (fixed !== x) return { what: "command", fix: fixed };
        }
      }
    }
    return null;
  }
  function isKnown(w) {
    if (w.pos === "propn" && w.sentStart && !isName(w.w)) return isKnownForm(w.w) || !!lemmatize(w.w);
    if (w.pos !== "unknown") return true;
    return isKnownForm(w.w) || !!closedClass(w.w) || !!lexEntry(w.w) || !!lemmatize(w.w);
  }
  function accentLint(text, words2 = analyzeWords(text)) {
    var _a2, _b, _c, _d;
    const out = [];
    const E = engineDeac();
    for (let i = 0; i < words2.length; i++) {
      const w = words2[i];
      if (w.punct || w.capMid || /^\d/.test(w.w)) continue;
      const x = w.w;
      const p = words2[i - 1];
      const pp = words2[i - 2];
      const nx = words2[i + 1];
      const qHead = p && (p.w === "\xBF" || p.w === "\xA1") || p && PREP_BEFORE_INT.has(p.w) && pp && (pp.w === "\xBF" || pp.w === "\xA1");
      if (INTERROG.has(x) && qHead) {
        if (!(x === "que" && nx && (nx.pos === "clitic" || nx.pos === "verb" || nx.pos === "neg" || nx.pos === "pron" || nx.w === "si"))) {
          out.push({ severity: "error", word: w.text, index: i, problem: `interrogative "${x}" without its accent`, fix: INTERROG.get(x) });
          continue;
        }
      }
      if (x === "porque" && p && p.w === "\xBF") {
        out.push({ severity: "error", word: w.text, index: i, problem: '"\xBFporque" in a question', fix: "\xBFpor qu\xE9" });
        continue;
      }
      const nn = words2[i + 2];
      const attributive = nn && !nn.punct && ["noun", "x", "unknown"].includes(nn.pos) && nx && nx.pos !== "ger";
      const nounNext = nx && (((_a2 = lexEntry(nx.w)) == null ? void 0 : _a2.pos) === "noun" || nx.lemma && ((_b = lexEntry(nx.lemma)) == null ? void 0 : _b.pos) === "noun");
      const npSlot = p && ["prep", "verb", "inf", "ger"].includes(p.pos) || nn && ["verb", "clitic"].includes(nn.pos);
      if (x === "esta" && nx && !nx.punct && !attributive && !nounNext && !npSlot && (LOC_AFTER_ESTA.has(nx.w) || nx.pos === "part" || nx.pos === "ger" || nx.pos === "adj" && !["misma", "otra", "primera", "\xFAltima", "pr\xF3xima"].includes(nx.w))) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"esta ${nx.w}" reads as the verb`, fix: "est\xE1" });
        continue;
      }
      if (x === "el" && p && PREP_BEFORE_INT.has(p.w) && (!nx || nx.punct || ["y", "o", "pero", "tambi\xE9n"].includes(nx.w))) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"${p.w} el" with no noun: the pronoun`, fix: "\xE9l" });
        continue;
      }
      if (x === "mi" && p && ["a", "para", "de", "por", "sin", "en"].includes(p.w) && (!nx || nx.punct || ["y", "o", "tambi\xE9n", "mismo", "misma"].includes(nx.w))) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"${p.w} mi" with no noun: the pronoun`, fix: "m\xED" });
        continue;
      }
      if (x === "tu" && nx && nx.pos === "verb" && ((_c = nx.verb) == null ? void 0 : _c.some((a) => a.person === "t\xFA" && a.tense !== "imperativo")) && !lexEntry(nx.w) && !(nx.lemma && ((_d = lexEntry(nx.lemma)) == null ? void 0 : _d.pos) === "noun")) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"tu ${nx.w}": the subject pronoun`, fix: "t\xFA" });
        continue;
      }
      if (x === "se" && p && (p.w === "yo" || p.w === "no" && (!nx || nx.punct || ["si", "qu\xE9", "c\xF3mo", "d\xF3nde", "cu\xE1ndo", "qui\xE9n", "nada", "mucho", "bien"].includes(nx.w)))) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"${p.w} se" here is saber`, fix: "s\xE9" });
        continue;
      }
      if (x === "mas" && p && !p.punct) {
        out.push({ severity: "warning", word: w.text, index: i, problem: '"mas" (archaic "but")', fix: "m\xE1s" });
        continue;
      }
      if (isKnown(w) || w.pos === "propn" && !w.sentStart || isName(w.w)) continue;
      if (w.cap && w.sentStart && !analyzeToken(x).length && !formsDeac().has(deaccent(x)) && !cliticStressFix(x, E)) continue;
      const cands = E.get(deaccent(x));
      if (cands && cands.size && !cands.has(x)) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"${x}" is not a form; the engine has`, fix: [...cands].join(" / ") });
        continue;
      }
      const cs = cliticStressFix(x, E);
      if (cs) {
        out.push({ severity: "error", word: w.text, index: i, problem: `"${x}" (${cs.what} + pronoun) needs a written accent`, fix: cs.fix });
        continue;
      }
      const lc = formsDeac().get(deaccent(x));
      if (lc && lc.size && !lc.has(x)) {
        const finalOnly = [...lc].every((c) => /[áéíóú]$/.test(c));
        out.push({ severity: finalOnly ? "warning" : "error", word: w.text, index: i, problem: `"${x}" is missing an accent?`, fix: [...lc].slice(0, 3).join(" / ") });
      }
    }
    const sentences = text.split(/(?<=[.?!…])\s+/);
    for (const s of sentences) {
      if (/\?/.test(s) && !/¿/.test(s)) out.push({ severity: "error", word: s.slice(0, 40), index: -1, problem: 'question without an opening "\xBF"', fix: "add \xBF at the start of the question" });
      if (/!/.test(s) && !/¡/.test(s)) out.push({ severity: "warning", word: s.slice(0, 40), index: -1, problem: 'exclamation without an opening "\xA1"', fix: "add \xA1 at the start of the exclamation" });
    }
    return out;
  }

  // lib/tagger/index.ts
  var fold2 = (s) => deaccent(s.toLowerCase()).replace(/ñ/g, "n");
  var PATTERNS = /* @__PURE__ */ new WeakMap();
  var SLOT_RUN = /* @__PURE__ */ new Set(["y", "don", "dona", "senor", "senora"]);
  var SLOTS = /* @__PURE__ */ new Set(["*", "#", "@"]);
  var TILDE_PAIRS = /* @__PURE__ */ new Set(["\xE9l", "t\xFA", "m\xED", "s\xED", "s\xE9", "t\xE9", "d\xE9", "m\xE1s", "qu\xE9", "c\xF3mo", "d\xF3nde", "cu\xE1ndo", "qui\xE9n", "cu\xE1nto", "cu\xE1l"]);
  var TAG_WORDS = /* @__PURE__ */ new Set(["no", "verdad", "cierto", "si", "s\xED", "eh", "ya", "oyes", "ves"]);
  var tagQ = (frag, alt) => new RegExp("\xBF\\s*" + frag.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\?").test(alt);
  function compile(chunks) {
    const hit = PATTERNS.get(chunks);
    if (hit) return hit;
    const out = chunks.map((c) => {
      const pats = [];
      const seen = /* @__PURE__ */ new Set();
      const push2 = (p) => {
        const k = (p.alone ? "!" : "") + (p.q ? "?" : "") + p.join(" ");
        if (p.length && p.some((t) => t !== "*") && !seen.has(k)) {
          seen.add(k);
          pats.push(p);
        }
      };
      const slug = fold2(c.id.replace(/^c:/, "").replace(/#.*/, "")).split("-").filter(Boolean);
      const inSlug = new Set(slug);
      const verbLemma = (w) => {
        var _a2;
        const a = analyzeWords(w)[0];
        return a && a.pos === "verb" ? (_a2 = a.lemma) != null ? _a2 : "" : "";
      };
      const slugLemmas = new Set(slug.map(verbLemma).filter(Boolean));
      const shares = (t0) => {
        const t = t0.replace(/^=/, "");
        return inSlug.has(t) || t.length >= 4 && slug.some((sl) => sl.length >= 4 && sl.slice(0, 4) === t.slice(0, 4)) || slugLemmas.size > 0 && slugLemmas.has(verbLemma(t));
      };
      push2(slug);
      const es = c.es.replace(/«[^»]*»|"[^"]*"|“[^”]*”/g, " QQQ ");
      const flat = " " + fold2(c.es).replace(/[/—–]/g, " | ").replace(/[^a-z|\s]/g, " ").replace(/\s+/g, " ") + " ";
      const phrase = slug.length >= 2 && flat.includes(" " + slug.join(" ") + " ");
      for (const alt of es.split(/\s*\/\s*/)) {
        const frags = alt.split(/—|–|…|\.\.\.|[.,?!¿¡;:()]/).map((f) => f.trim()).filter((f) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\d]/.test(f));
        for (const frag of frags) {
          const raw = [...frag.matchAll(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+/g)].map((m) => m[0]);
          const toks = [];
          raw.forEach((t, k) => {
            const f = t === "QQQ" ? "*" : /^\d/.test(t) || closedClass(t.toLowerCase()) === "num" ? "#" : k > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(t) ? "@" : TILDE_PAIRS.has(t.toLowerCase()) ? "=" + t.toLowerCase() : fold2(t);
            if ((f === "#" || f === "@") && toks[toks.length - 1] === f) return;
            if (f === "y" && toks[toks.length - 1] === "#" && k + 1 < raw.length && closedClass(raw[k + 1].toLowerCase()) === "num") return;
            toks.push(f);
          });
          if (!toks.length || toks.every((t) => SLOTS.has(t))) continue;
          if (toks.length === 1) {
            const p = [toks[0]];
            const w = raw[0].toLowerCase();
            const cc = closedClass(w);
            if (cc && cc !== "adv" || w.length <= 2) {
              if (!inSlug.has(toks[0].replace(/^=/, "")) || phrase) continue;
              p.alone = true;
              if (TAG_WORDS.has(toks[0].replace(/^=/, "")) && tagQ(frag, alt)) p.q = true;
            } else if (slug.length >= 2 || !inSlug.has(toks[0].replace(/^=/, ""))) {
              const idWord = inSlug.has(toks[0].replace(/^=/, "")) && phrase;
              const q = TAG_WORDS.has(toks[0].replace(/^=/, "")) && tagQ(frag, alt);
              const ownTurn = alt.split(/—|–/).some((turn) => turn.replace(/[.,?!¿¡;:…\s]/g, "") === frag.replace(/[.,?!¿¡;:…\s]/g, ""));
              if (frags.length > 1 && !q && !ownTurn && (idWord || !shares(toks[0]))) continue;
              const frame = shares(toks[0]) && (!!verbLemma(toks[0].replace(/^=/, "")) || cc === "adv" || slug.length === 1) && !idWord;
              if (!frame) p.alone = true;
              if (q) p.q = true;
            }
            push2(p);
            continue;
          }
          const lits = toks.filter((t) => !SLOTS.has(t));
          if (lits.length < 2 && !(lits.length === 1 && shares(lits[0]) && !closedClass(lits[0]))) continue;
          if (frags.length === 1 || toks.some(shares)) {
            push2(toks);
            const tw = analyzeWords(frag);
            const cut = tw.findIndex((w, q) => q >= 2 && ["det", "poss", "dem", "inf"].includes(w.pos));
            if (cut >= 2 && tw.length === toks.length) {
              const pre = toks.slice(0, cut);
              if (pre.every((t) => !SLOTS.has(t)) && pre.some(shares) && ["me", "te", "le", "nos", "les"].includes(pre[0])) push2(pre);
            }
          }
        }
      }
      if (slug.length >= 2 && slug[1] === "que" && verbLemma(slug[0])) {
        const p = [slug[0]];
        p.alone = true;
        push2(p);
      }
      return { id: c.id, pats };
    });
    PATTERNS.set(chunks, out);
    return out;
  }
  function matchAt(ws, pat, k, m = 0) {
    if (m === pat.length) return k;
    if (k >= ws.length) return -1;
    if (pat[m][0] === "=") return ws[k].a === pat[m].slice(1) ? matchAt(ws, pat, k + 1, m + 1) : -1;
    if (!SLOTS.has(pat[m])) return ws[k].w === pat[m] ? matchAt(ws, pat, k + 1, m + 1) : -1;
    const fits = (x) => pat[m] === "#" ? x.num || x.w === "y" : pat[m] === "@" ? x.name : x.num || x.name;
    if (!fits(ws[k])) return pat[m] === "*" ? matchAt(ws, pat, k + 1, m + 1) : -1;
    let end = k;
    while (end < ws.length && fits(ws[end])) end++;
    for (let e = end; e > k; e--) {
      const r = matchAt(ws, pat, e, m + 1);
      if (r >= 0) return r;
    }
    return -1;
  }
  function slotEnd(words2, b) {
    let j = b + 1;
    const w = words2[j];
    if (!w || w.punct) return b;
    if (w.pos === "inf" || w.pos === "ger") return j;
    if (["adj", "part"].includes(w.pos)) return j;
    if (["det", "poss", "dem", "num", "quant"].includes(w.pos)) {
      while (words2[j + 1] && !words2[j + 1].punct && ["noun", "adj", "x", "num", "propn", "part"].includes(words2[j + 1].pos)) j++;
      return j;
    }
    return b;
  }
  function chunkPass(words2, chunks, out) {
    var _a2;
    const sentences = [[]];
    for (const w of words2) {
      if (w.punct) {
        if (/[.?!…;:]/.test(w.w)) sentences.push([]);
        continue;
      }
      const f = fold2(w.w);
      const nameTok = w.pos === "propn" && (w.capMid || isName(w.w));
      sentences[sentences.length - 1].push({ a: w.w.toLowerCase(), w: nameTok ? "\0" : f, i: w.i, num: w.pos === "num" || closedClass(w.w) === "num", name: w.pos === "propn" || SLOT_RUN.has(f) && f !== "y" });
    }
    const isPunct = (k) => k < 0 || k >= words2.length || words2[k].punct;
    for (const c of compile(chunks)) {
      for (const ws of sentences) {
        for (const pat of c.pats) {
          for (let k = 0; k < ws.length; k++) {
            if (pat.alone && !(isPunct(ws[k].i - 1) && isPunct(ws[k].i + 1))) continue;
            if (pat.q && ((_a2 = words2[ws[k].i + 1]) == null ? void 0 : _a2.w) !== "?") continue;
            const e = matchAt(ws, pat, k);
            if (e < 0 || e === k) continue;
            const a = ws[k].i;
            const b = slotEnd(words2, ws[e - 1].i);
            out.push({ key: "chunk." + c.id, node: c.id, span: [a, b], core: [a, ws[e - 1].i], text: words2.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(" ") });
          }
        }
      }
    }
  }
  var PAT_CACHE = /* @__PURE__ */ new WeakMap();
  var PAT_META = new Set("inf adj adv sust noun verb subj ind indic place price time article plural singular mixed number numbers basic full past future".split(" "));
  var spanishWord = (w) => w.length > 1 && !PAT_META.has(w) && (!!lexEntry(w) || !!closedClass(w) || isKnownForm(w) || !!lemmatize(w));
  function compilePatterns(specs) {
    var _a2;
    const hit = PAT_CACHE.get(specs);
    if (hit) return hit;
    const out = [];
    for (const p of specs) {
      if ((_a2 = p.match) == null ? void 0 : _a2.length) {
        const compiled = [];
        for (const m of p.match.filter(isSpec)) {
          try {
            compiled.push(compileSpec(m));
          } catch (e) {
            if (!(e instanceof SpecError)) throw e;
          }
        }
        const seqs = p.match.filter((m) => !isSpec(m)).map((m) => [...m.matchAll(/"[^"]*"|“[^”]*”|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+|\d+/g)].map((x, k) => /^["“\d]/.test(x[0]) || k > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(x[0]) ? "*" : TILDE_PAIRS.has(x[0].toLowerCase()) ? "=" + x[0].toLowerCase() : fold2(x[0]))).filter((q) => q.some((t) => t !== "*"));
        if (seqs.length || compiled.length) out.push({ id: p.id, seqs, gaps: 0, specs: compiled });
        continue;
      }
      const slug = fold2(p.id.replace(/^p:/, "").replace(/#.*/, "")).split("-").filter(Boolean);
      const slots = slug.includes("x");
      const seq = slug.map((t) => slots && ["x", "y", "z"].includes(t) ? "*" : t);
      if (seq.filter((t) => t !== "*").length < 2) continue;
      if (!seq.every((t) => t === "*" || spanishWord(t))) continue;
      if (slots) continue;
      out.push({ id: p.id, seqs: [seq], gaps: 1, specs: [] });
    }
    PAT_CACHE.set(specs, out);
    return out;
  }
  function patternPass(words2, specs, out) {
    const pats = compilePatterns(specs);
    const ms = matchTokens(words2);
    const keys = sentenceKeys(ms);
    const found = /* @__PURE__ */ new Set();
    for (const p of pats) {
      for (const sp of p.specs) {
        if (!hasAnchors(sp, keys)) continue;
        const m = findSpec(ms, sp);
        if (!m) continue;
        const a = ms[m[0]].i, b = ms[m[1]].i;
        out.push({ key: "pattern." + p.id, node: p.id, span: [a, b], text: words2.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(" ") });
        found.add(p.id);
        break;
      }
    }
    const clauses = [[]];
    for (const w of words2) {
      if (w.punct) clauses.push([]);
      else clauses[clauses.length - 1].push(w);
    }
    for (const ws of clauses) if (ws.length) patternClause(ws, words2, pats, out, found);
  }
  function patternClause(ws, words2, pats, out, found) {
    const is2 = (w, t) => t === "*" || (t[0] === "=" ? w.w.toLowerCase() === t.slice(1) : fold2(w.w) === t || fold2(w.lemma || "") === t);
    for (const p of pats) {
      if (found.has(p.id) || !p.seqs.length) continue;
      let done = false;
      for (const seq of p.seqs) {
        for (let k = 0; k < ws.length && !done; k++) {
          if (!is2(ws[k], seq[0])) continue;
          let m = 1, j = k + 1, gaps = 0;
          while (m < seq.length && j < ws.length && gaps <= p.gaps) {
            if (is2(ws[j], seq[m])) m++;
            else gaps++;
            j++;
          }
          if (m === seq.length && gaps <= p.gaps) {
            const a = ws[k].i, b = ws[j - 1].i;
            out.push({ key: "pattern." + p.id, node: p.id, span: [a, b], text: words2.slice(a, b + 1).filter((w) => !w.punct).map((w) => w.text).join(" ") });
            found.add(p.id);
            done = true;
          }
        }
        if (done) break;
      }
    }
  }
  function patternFeatures(words2, specs) {
    const out = [];
    patternPass(words2, specs, out);
    return out;
  }
  function detectablePatterns(specs) {
    return new Set(compilePatterns(specs).map((p) => p.id));
  }
  function focusSpan(text, r, targets) {
    const f = r.features.find((x) => x.node === targets[0]);
    if (!f) return null;
    let at = 0, start = -1, end = -1;
    for (const w of r.tokens) {
      const k = text.indexOf(w.text, at);
      if (k < 0) return null;
      if (w.i === f.span[0]) start = k;
      if (w.i === f.span[1]) {
        end = k + w.text.length;
        break;
      }
      at = k + w.text.length;
    }
    return start >= 0 && end > start ? [start, end] : null;
  }
  function tagSentence(es, opts = {}) {
    var _a2, _b, _c, _d;
    const words2 = analyzeWords(es);
    const ctx = { words: words2, features: [], low: [] };
    detect(ctx);
    if ((_a2 = opts.chunks) == null ? void 0 : _a2.length) chunkPass(words2, opts.chunks, ctx.features);
    if ((_b = opts.patterns) == null ? void 0 : _b.length) patternPass(words2, opts.patterns, ctx.features);
    const pret = ctx.features.find((f) => f.key.startsWith("tense.preterito"));
    const imp = ctx.features.find((f) => f.key.startsWith("tense.imperfecto") || f.key === "peri.estar-ger.past");
    if (pret && imp) ctx.features.push({ key: "tense.mix", node: null, span: [Math.min(pret.span[0], imp.span[0]), Math.max(pret.span[1], imp.span[1])], text: `${pret.text} \u2026 ${imp.text}` });
    const lexemes = opts.lexemes !== false;
    const req = /* @__PURE__ */ new Set();
    for (const f of ctx.features) f.node = resolveNode(f.key, opts);
    const unpacks = new Map(((_c = opts.chunks) != null ? _c : []).filter((c) => c.unpacks).map((c) => [c.id, c.unpacks]));
    const prio = new Map(((_d = opts.chunks) != null ? _d : []).map((c) => {
      var _a3;
      return [c.id, (_a3 = c.priority) != null ? _a3 : 0];
    }));
    const sameSpan = (a, b) => a.span[0] === b.span[0] && a.span[1] === b.span[1];
    const within = (a, b) => a.span[0] >= b.span[0] && a.span[1] <= b.span[1] && !sameSpan(a, b);
    const pr = (f) => {
      var _a3;
      return (_a3 = prio.get(f.node)) != null ? _a3 : 0;
    };
    const chunkFts = ctx.features.filter((f) => f.key.startsWith("chunk.") && f.node && !ctx.features.some((g) => g !== f && g.key.startsWith("chunk.") && g.node && g.node !== f.node && (sameSpan(f, g) && (pr(g) < pr(f) || pr(g) === pr(f) && g.node < f.node) || within(f, g) && pr(g) <= pr(f))));
    const dropped = new Set(ctx.features.filter((f) => f.key.startsWith("chunk.") && !chunkFts.includes(f)));
    for (const f of ctx.features) {
      if (!f.node) continue;
      if (!lexemes && f.node.startsWith("l:")) continue;
      if (dropped.has(f)) continue;
      if (!f.node.startsWith("l:") && !f.key.startsWith("chunk.") && chunkFts.some((c) => {
        var _a3, _b2;
        return f.span[0] >= ((_a3 = c.core) != null ? _a3 : c.span)[0] && f.span[1] <= ((_b2 = c.core) != null ? _b2 : c.span)[1];
      }) && !chunkFts.some((c) => unpacks.get(c.node) === f.node)) continue;
      req.add(f.node);
    }
    const lowReasons = [...new Set(ctx.low)];
    return {
      requires: [...req].sort(),
      features: ctx.features,
      confidence: lowReasons.length ? "low" : "high",
      lowReasons,
      tokens: words2
    };
  }
  function splitSentences(text) {
    const out = [];
    const parts = text.replace(/\s+/g, " ").split(/(?<=[.!?…])\s+(?=[—¿¡"«A-ZÁÉÍÓÚÑ])|\s+(?=—)/);
    for (const p of parts) {
      const t = p.trim();
      if (t && /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(t)) out.push(t);
    }
    return out;
  }
  function tagText(text, opts = {}) {
    const sents = splitSentences(text);
    const req = /* @__PURE__ */ new Set();
    const features = [];
    const low2 = /* @__PURE__ */ new Set();
    const tokens = [];
    for (const s of sents) {
      const r = tagSentence(s, opts);
      r.requires.forEach((x) => req.add(x));
      features.push(...r.features);
      r.lowReasons.forEach((x) => low2.add(x));
      tokens.push(...r.tokens);
    }
    return { requires: [...req].sort(), features, confidence: low2.size ? "low" : "high", lowReasons: [...low2], tokens, sentences: sents.length };
  }

  // lib/graph/index.ts
  var graph_exports = {};
  __export(graph_exports, {
    NODE_PREFIX: () => NODE_PREFIX,
    ancestors: () => ancestors2,
    castNames: () => castNames,
    chunkSpec: () => chunkSpec,
    lateRequires: () => lateRequires,
    loadGraph: () => loadGraph,
    nodesByKind: () => nodesByKind,
    requiresOf: () => requiresOf,
    tagOptions: () => tagOptions,
    taughtAt: () => taughtAt,
    taughtBy: () => taughtBy
  });
  var NODE_PREFIX = { grammar: "g:", pattern: "p:", chunk: "c:", lexeme: "l:", contrast: "x:", cando: "d:" };
  function loadGraph(files) {
    const nodes = /* @__PURE__ */ new Map();
    for (const f of files) {
      if (Array.isArray(f)) for (const n of f) nodes.set(n.id, n);
      else nodes.set(f.id, f);
    }
    return { nodes, ids: new Set(nodes.keys()) };
  }
  function nodesByKind(g, kind) {
    const out = [];
    for (const n of g.nodes.values()) if (n.kind === kind) out.push(n);
    return out;
  }
  function requiresOf(g, id) {
    var _a2, _b;
    return (_b = (_a2 = g.nodes.get(id)) == null ? void 0 : _a2.requires) != null ? _b : [];
  }
  function ancestors2(g, id) {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    const stack = [...requiresOf(g, id)].reverse();
    while (stack.length) {
      const n = stack.pop();
      if (seen.has(n) || n === id) continue;
      seen.add(n);
      out.push(n);
      const r = requiresOf(g, n);
      for (let i = r.length - 1; i >= 0; i--) stack.push(r[i]);
    }
    return out;
  }
  function taughtAt(g, order) {
    const at = /* @__PURE__ */ new Map();
    const teach = (id, i) => {
      if (!at.has(id)) at.set(id, i);
    };
    order.forEach((id, i) => {
      var _a2;
      teach(id, i);
      const u = (_a2 = g.nodes.get(id)) == null ? void 0 : _a2.unpacks;
      if (u) teach(u, i);
    });
    return at;
  }
  function taughtBy(g, order, upTo = order.length - 1) {
    const out = /* @__PURE__ */ new Set();
    for (const [id, i] of taughtAt(g, order)) if (i <= upTo) out.add(id);
    return out;
  }
  function lateRequires(g, order, requires, upTo) {
    const at = taughtAt(g, order);
    return requires.filter((r) => {
      const n = g.nodes.get(r);
      if (!n || n.kind === "lexeme") return false;
      const t = at.get(r);
      return t !== void 0 && t > upTo;
    });
  }
  function chunkSpec(n) {
    var _a2, _b, _c;
    const alts = [(_a2 = n.es) != null ? _a2 : "", ...((_b = n.forms) != null ? _b : []).map((f) => f.es), ...(_c = n.match) != null ? _c : []].map((x) => x.replace(/\s*\n\s*/g, " \u2014 ").trim()).filter(Boolean);
    return { id: n.id, es: [...new Set(alts)].join(" / "), ...n.unpacks ? { unpacks: n.unpacks } : {}, ...n.priority !== void 0 ? { priority: n.priority } : {} };
  }
  var EN_STOP = new Set("the a an and but or so if when while this that these those he she it they we you i his her its their our my your in on at to of for with by from as is was are were be has had have do did not no yes then there here what who why how after before during until since because although though once each every all some one two three week day month year first last next new old".split(" "));
  function castNames(text) {
    var _a2;
    const out = /* @__PURE__ */ new Map();
    for (const m of text.matchAll(/(?:^|(?<![.!?])\s)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/g)) {
      const w = m[1].toLowerCase();
      if (EN_STOP.has(w) || closedClass(w)) continue;
      out.set(w, ((_a2 = out.get(w)) != null ? _a2 : 0) + 1);
    }
    return [...out.keys()];
  }
  function tagOptions(g, o = {}) {
    const all = [...g.nodes.values()];
    registerLexemes(all.filter((n) => n.kind === "lexeme").map((n) => ({ lemma: n.id.replace(/^l:/, "").replace(/#.*/, ""), pos: n.pos, gender: n.gender })));
    if (o.names) registerNames(o.names);
    const chunks = all.filter((n) => n.kind === "chunk" && n.es).map(chunkSpec);
    const patterns = all.filter((n) => n.kind === "pattern").map((n) => ({ id: n.id, ...n.match ? { match: n.match } : {} }));
    return { graphIds: new Set(g.ids), featureMap: o.featureMap, chunks, patterns };
  }

  // lib/match/index.ts
  var match_exports = {};
  __export(match_exports, {
    HINT_TEXT: () => HINT_TEXT,
    MAX_EXPANSION: () => MAX_EXPANSION,
    MAX_TRIES: () => MAX_TRIES,
    PENINSULAR_NOUNS: () => PENINSULAR_NOUNS,
    PENINSULAR_VERBS: () => PENINSULAR_VERBS,
    RULES: () => RULES,
    canon: () => canon,
    diagnose: () => diagnose,
    expandAccept: () => expandAccept,
    expandAcceptList: () => expandAcceptList,
    expandAccepted: () => expandAccepted,
    gapTrap: () => gapTrap,
    matchEnglish: () => matchEnglish,
    matchTranslation: () => matchTranslation,
    normEnglish: () => normEnglish,
    noteVariants: () => noteVariants,
    peninsularVariants: () => peninsularVariants,
    pitfallFor: () => pitfallFor,
    registerVariants: () => registerVariants,
    resultClauseVariants: () => resultClauseVariants,
    ruleOf: () => ruleOf,
    softenerVariants: () => softenerVariants,
    startAttempt: () => startAttempt,
    subjunctiveVariants: () => subjunctiveVariants,
    submitAttempt: () => submitAttempt,
    swapNote: () => swapNote,
    touches: () => touches,
    trapDiagnose: () => diagnose2
  });

  // lib/match/support/spanish.ts
  var TOK_RE = /^([¿¡"'«“‘(\[—–-]*)(.*?)([.,;:!?»"'”’)\]…—–-]*)$/u;
  function toToks(s) {
    return s.trim().split(/\s+/).filter(Boolean).map((chunk) => {
      const m = TOK_RE.exec(chunk);
      return m ? { pre: m[1], core: m[2], post: m[3] } : { pre: "", core: chunk, post: "" };
    }).filter((t) => t.core || t.pre || t.post);
  }
  function render(ts) {
    return ts.map((t) => t.pre + t.core + t.post).join(" ");
  }
  var low = (t) => t ? t.core.toLowerCase() : "";
  var cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  function lowerable(core) {
    const first = core.split(" ")[0];
    const l = first.toLowerCase();
    return FUNCTION.has(l) || analyzeToken(l).length > 0 || /^[a-záéíóúñü]+$/.test(first);
  }
  function insertTok(ts, at, core) {
    const out = ts.map((t) => ({ ...t }));
    const tok = { pre: "", core, post: "" };
    if (at === 0 && out.length) {
      tok.pre = out[0].pre;
      out[0].pre = "";
      if (/^[A-ZÁÉÍÓÚÑ]/.test(out[0].core)) {
        tok.core = cap(core);
        if (lowerable(out[0].core)) out[0].core = out[0].core[0].toLowerCase() + out[0].core.slice(1);
      }
    }
    out.splice(at, 0, tok);
    return out;
  }
  function removeToks(ts, from, to) {
    const out = ts.map((t) => ({ ...t }));
    const gone = out.splice(from, to - from);
    if (!gone.length) return out;
    const pre = gone[0].pre, post = gone[gone.length - 1].post;
    if (from < out.length) {
      out[from].pre = pre + out[from].pre;
      if (from === 0 && /^[A-ZÁÉÍÓÚÑ]/.test(gone[0].core)) out[0].core = cap(out[0].core);
    } else if (out.length) {
      out[out.length - 1].post += post;
    }
    return out;
  }
  function replaceCore(ts, at, core) {
    const out = ts.map((t) => ({ ...t }));
    const was = out[at].core;
    out[at].core = /^[A-ZÁÉÍÓÚÑ]/.test(was) ? cap(core) : core;
    return out;
  }
  var SUBJECT_PRONOUNS2 = {
    yo: "yo",
    "t\xFA": "t\xFA",
    "\xE9l": "\xE9l/ella",
    ella: "\xE9l/ella",
    usted: "\xE9l/ella",
    nosotros: "nosotros",
    nosotras: "nosotros",
    ellos: "ellos",
    ellas: "ellos",
    ustedes: "ellos",
    vosotros: "vosotros",
    vosotras: "vosotros"
  };
  var CLITICS3 = /* @__PURE__ */ new Set(["me", "te", "se", "lo", "la", "le", "nos", "os", "los", "las", "les"]);
  var REFLEXIVE = {
    yo: "me",
    "t\xFA": "te",
    "\xE9l/ella": "se",
    nosotros: "nos",
    vosotros: "os",
    ellos: "se"
  };
  var ARTICLES2 = /* @__PURE__ */ new Set(["el", "la", "los", "las", "un", "una", "unos", "unas"]);
  var DEMONSTRATIVES2 = /* @__PURE__ */ new Set(["este", "esta", "estos", "estas", "ese", "esa", "esos", "esas", "aquel", "aquella", "aquellos", "aquellas"]);
  var POSSESSIVES2 = /* @__PURE__ */ new Set(["mi", "mis", "tu", "tus", "su", "sus", "nuestro", "nuestra", "nuestros", "nuestras", "vuestro", "vuestra", "vuestros", "vuestras"]);
  var PREPOSITIONS2 = /* @__PURE__ */ new Set(["a", "al", "ante", "bajo", "con", "contra", "de", "del", "desde", "en", "entre", "hacia", "hasta", "para", "por", "seg\xFAn", "sin", "sobre", "tras"]);
  var DETERMINERS = /* @__PURE__ */ new Set([...ARTICLES2, ...DEMONSTRATIVES2, ...POSSESSIVES2]);
  var NOT_VERBS = /* @__PURE__ */ new Set(["para", "entre", "sobre", "bajo", "nada", "solo", "casa", "como", "mientras", "cerca", "bien", "mal", "tarde", "pronto", "claro", "cada", "medio", "junto"]);
  var WEAK_NOT_VERBS = /* @__PURE__ */ new Set(["como", "trabajo", "cocina", "cena", "paseo", "viaje", "estudio", "baile", "camino", "vuelo", "regreso", "pregunta", "cuento", "ayuda", "llamada", "compra", "vino", "canto", "desayuno", "gusto", "espera", "juego", "sue\xF1o", "lleno", "limpio", "seco"]);
  var FUNCTION = /* @__PURE__ */ new Set([
    ...Object.keys(SUBJECT_PRONOUNS2),
    ...CLITICS3,
    ...DETERMINERS,
    ...PREPOSITIONS2,
    "no",
    "que",
    "qu\xE9",
    "y",
    "o",
    "pero",
    "si",
    "s\xED",
    "ya",
    "tambi\xE9n",
    "siempre",
    "nunca",
    "hoy",
    "ayer",
    "ma\xF1ana",
    "ahora",
    "aqu\xED",
    "all\xED",
    "d\xF3nde",
    "cu\xE1ndo",
    "c\xF3mo",
    "cu\xE1nto",
    "cu\xE1nta",
    "cu\xE1ntos",
    "cu\xE1ntas",
    "qui\xE9n",
    "qui\xE9nes",
    "cu\xE1l",
    "cu\xE1les",
    "por",
    "muy",
    "hay",
    "todav\xEDa",
    "anoche"
  ]);
  var TIME_WORDS = /* @__PURE__ */ new Set(["ayer", "hoy", "ma\xF1ana", "anoche", "ahora", "siempre", "nunca", "ya", "todav\xEDa", "luego", "despu\xE9s", "antes", "pronto", "anteayer", "normalmente", "generalmente", "entonces", "temprano", "a\xFAn", "reci\xE9n", "jam\xE1s"]);
  var TIME_PHRASES = [
    ["todos", "los", "d\xEDas"],
    ["todas", "las", "semanas"],
    ["todas", "las", "ma\xF1anas"],
    ["todas", "las", "noches"],
    ["la", "semana", "pasada"],
    ["el", "a\xF1o", "pasado"],
    ["el", "mes", "pasado"],
    ["la", "semana", "que", "viene"],
    ["el", "a\xF1o", "que", "viene"],
    ["esta", "ma\xF1ana"],
    ["esta", "tarde"],
    ["esta", "noche"],
    ["este", "fin", "de", "semana"],
    ["el", "fin", "de", "semana"],
    ["por", "la", "ma\xF1ana"],
    ["por", "la", "tarde"],
    ["por", "la", "noche"],
    ["a", "veces"],
    ["de", "ni\xF1o"],
    ["de", "ni\xF1a"],
    ["el", "lunes"],
    ["el", "martes"],
    ["el", "mi\xE9rcoles"],
    ["el", "jueves"],
    ["el", "viernes"],
    ["el", "s\xE1bado"],
    ["el", "domingo"],
    ["los", "lunes"],
    ["los", "martes"],
    ["los", "mi\xE9rcoles"],
    ["los", "jueves"],
    ["los", "viernes"],
    ["los", "s\xE1bados"],
    ["los", "domingos"],
    ["cada", "d\xEDa"],
    ["cada", "semana"],
    ["de", "repente"],
    ["una", "vez"],
    ["muchas", "veces"]
  ];
  function timeSpans(ts) {
    const lw = ts.map(low);
    const out = [];
    for (let i = 0; i < lw.length; i++) {
      const phrase = TIME_PHRASES.find((p) => p.every((w, k) => lw[i + k] === w));
      if (phrase) {
        out.push([i, i + phrase.length]);
        i += phrase.length - 1;
        continue;
      }
      if (TIME_WORDS.has(lw[i])) out.push([i, i + 1]);
    }
    return out;
  }
  var FINITE = /* @__PURE__ */ new Set(["presente", "preterito", "imperfecto", "futuro", "condicional", "presubj", "impsubj"]);
  function inNounSlot(ts, i) {
    const prev2 = low(ts[i - 1]);
    if (/^(la|las|los|lo)$/.test(prev2)) {
      const pp = low(ts[i - 2]);
      if (!pp || pp === "no" || SUBJECT_PRONOUNS2[pp] || /^(me|te|se|nos|le|les)$/.test(pp) || /[,;:]$/.test(ts[i - 2].post)) return false;
      if (prev2 === "lo") return false;
    }
    return DETERMINERS.has(prev2) || PREPOSITIONS2.has(prev2);
  }
  function verbReadings(core) {
    return analyzeToken(core.toLowerCase()).filter((a) => a.accentExact && a.target && !a.clitics);
  }
  function finiteCandidates(ts) {
    const out = [];
    const weak = [];
    ts.forEach((t, i) => {
      const l = low(t);
      if (!l || NOT_VERBS.has(l) && !WEAK_NOT_VERBS.has(l)) return;
      if (inNounSlot(ts, i)) return;
      const an = verbReadings(l).filter((a) => FINITE.has(a.tense) || a.tense === "imperativo");
      if (!an.length) return;
      (WEAK_NOT_VERBS.has(l) ? weak : out).push({ index: i, analyses: an });
    });
    return out.length ? out : weak;
  }
  function compoundParticiple(ts, i) {
    const an = verbReadings(low(ts[i]));
    if (!an.some((a) => a.inf === "haber")) return -1;
    for (let j = i + 1; j <= i + 2 && j < ts.length; j++) {
      if (/(ado|ido|ído|to|cho|so)$/.test(low(ts[j])) && participleOf(low(ts[j]))) return j;
    }
    return -1;
  }
  var PART_MAP = null;
  var GER_MAP = null;
  function buildVerbMaps() {
    if (PART_MAP && GER_MAP) return;
    PART_MAP = /* @__PURE__ */ new Map();
    GER_MAP = /* @__PURE__ */ new Map();
    for (const v of VERBS) {
      try {
        PART_MAP.set(participle(v), v.inf);
        GER_MAP.set(deaccent(gerund(v)), v.inf);
      } catch {
      }
    }
  }
  function participleOf(word) {
    var _a2;
    buildVerbMaps();
    return (_a2 = PART_MAP.get(word.toLowerCase())) != null ? _a2 : null;
  }
  function gerundOf(word) {
    var _a2;
    buildVerbMaps();
    return (_a2 = GER_MAP.get(deaccent(word.toLowerCase()))) != null ? _a2 : null;
  }
  function isInfinitive(word) {
    const w = word.toLowerCase();
    return !!verbByInf(w) || /(ar|er|ir|ír)$/.test(w) && !!verbByInf(w + "se");
  }
  function splitEnclitic(word) {
    const w = word.toLowerCase();
    const tryBase = (b, cl) => {
      const plain = deaccent(b);
      if (isInfinitive(plain) && /(ar|er|ir)$/.test(plain)) return { base: plain === "reir" || plain === "oir" ? b.replace(/ir$/, "\xEDr") : plain, clitics: cl, kind: "inf" };
      if (/(ando|iendo|yendo)$/.test(plain) && gerundOf(plain)) return { base: plain, clitics: cl, kind: "ger" };
      return null;
    };
    for (const c1 of CLITICS3) {
      if (!w.endsWith(c1) || w.length < c1.length + 2) continue;
      const b1 = w.slice(0, -c1.length);
      for (const c2 of CLITICS3) {
        if (!b1.endsWith(c2) || b1.length < c2.length + 2) continue;
        const r2 = tryBase(b1.slice(0, -c2.length), [c2, c1]);
        if (r2) return r2;
      }
      const r = tryBase(b1, [c1]);
      if (r) return r;
    }
    return null;
  }
  var EN_AUX = /* @__PURE__ */ new Set(["do", "does", "did", "am", "is", "are", "was", "were", "can", "could", "will", "would", "should", "have", "has", "had", "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't", "can't", "won't", "haven't", "hasn't"]);
  var EN_WH = /* @__PURE__ */ new Set(["what", "where", "when", "why", "how", "which", "who"]);
  var EN_SUBJ = {
    i: ["yo"],
    you: ["t\xFA", "\xE9l/ella", "ellos"],
    he: ["\xE9l/ella"],
    she: ["\xE9l/ella"],
    we: ["nosotros"],
    they: ["ellos"]
  };
  var EN_CONTRACTIONS = {
    "i'm": "i am",
    "you're": "you are",
    "he's": "he is",
    "she's": "she is",
    "it's": "it is",
    "we're": "we are",
    "they're": "they are",
    "i've": "i have",
    "you've": "you have",
    "we've": "we have",
    "they've": "they have",
    "i'll": "i will",
    "you'll": "you will",
    "he'll": "he will",
    "she'll": "she will",
    "we'll": "we will",
    "they'll": "they will",
    "i'd": "i would",
    "you'd": "you would",
    "he'd": "he would",
    "she'd": "she would",
    "we'd": "we would",
    "they'd": "they would",
    "let's": "let us",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "can't": "cannot",
    "won't": "will not",
    "haven't": "have not",
    "hasn't": "has not",
    "wouldn't": "would not",
    "couldn't": "could not",
    "shouldn't": "should not"
  };
  function expandContractions(s) {
    return s.replace(/[’‘]/g, "'").replace(/\b[a-z]+'[a-z]+\b/gi, (m) => {
      const x = EN_CONTRACTIONS[m.toLowerCase()];
      return x != null ? x : m;
    });
  }
  function enWords(en) {
    return expandContractions(en.toLowerCase()).replace(/[^a-z'\s-]/g, " ").split(/\s+/).filter(Boolean);
  }
  var EN_LEADING = /* @__PURE__ */ new Set(["yesterday", "today", "tomorrow", "now", "then", "sometimes", "usually", "normally", "finally", "so", "and", "but", "well", "tonight", "later", "also", "still"]);
  function enSubject(en) {
    const w = enWords(en);
    let i = 0;
    while (EN_LEADING.has(w[i])) i++;
    if (EN_WH.has(w[i])) {
      i++;
      if (!EN_AUX.has(w[i]) && EN_AUX.has(w[i + 1])) i++;
      else if (!EN_AUX.has(w[i]) && EN_AUX.has(w[i + 2]) && /^(many|much|long|often|old)$/.test(w[i])) i += 2;
    }
    if (EN_AUX.has(w[i])) i++;
    if (w[i] === "not") i++;
    const p = w[i];
    if (p === "you" && (w[i + 1] === "all" || w[i + 1] === "guys")) return { pronoun: "you all", persons: ["ellos"], index: i };
    if (p && EN_SUBJ[p]) return { pronoun: p, persons: EN_SUBJ[p].slice(), index: i };
    return null;
  }
  function enYou(en) {
    const l = en.toLowerCase();
    if (!/\byou(r|rs|rself|rselves)?\b/.test(l)) return "none";
    if (/\([^)]*\b(formal|polite)\b[^)]*\)|\bsir\b|\bmadam\b|\bma'am\b/.test(l)) return "formal";
    if (/\([^)]*\b(informal|to a friend)\b[^)]*\)/.test(l)) return "informal";
    if (/\byou all\b|\byou guys\b|\byourselves\b|\bboth of you\b|\byou both\b|\([^)]*\b(plural|to a group|to several people)\b[^)]*\)/.test(l)) return "plural";
    if (/\byourself\b/.test(l)) return "singular";
    return "open";
  }
  var EXPERIENCER = /* @__PURE__ */ new Set(["gustar", "encantar", "interesar", "importar", "doler", "molestar", "faltar", "parecer", "quedar", "fascinar", "preocupar", "aburrir"]);
  var PERSON_TENSE_HINTS = [
    [/\b(ayer|anoche|anteayer|pasad[oa])\b/, ["preterito", "imperfecto"]]
  ];
  function enTenseHint(en) {
    const w = " " + enWords(en).join(" ") + " ";
    if (/ (am|is|are) (not )?\w+ing /.test(w) && !/ going to /.test(w)) return ["presente"];
    if (/ (was|were) \w+ing | used to /.test(w)) return ["imperfecto"];
    if (/ will /.test(w)) return ["futuro"];
    if (/ (do|does) /.test(w)) return ["presente"];
    if (/ did /.test(w)) return ["preterito", "imperfecto"];
    return null;
  }
  function enVP(inf, tense, person) {
    const v = verbByInf(inf);
    if (!v) return null;
    const idx = PERSONS.indexOf(person);
    const ph = enPhrase(v, tense, idx).text.replace(/\s*\([^)]*\)/g, "");
    return ph.split(" ").slice(person === "ellos" && /^you all/.test(ph) ? 2 : 1).join(" ").toLowerCase();
  }
  function byEnglish(an, en) {
    const ew = " " + enWords(en).join(" ") + " ";
    const hit = an.filter((a) => {
      const vp = enVP(a.inf, a.tense, a.person);
      if (!vp) return false;
      const head = vp.split(" ").pop();
      return ew.includes(" " + vp + " ") || vp.split(" ").length === 1 && ew.includes(" " + head + " ");
    });
    return hit.length ? hit : an;
  }
  function parseClause(es, en, opts = {}) {
    const ts = toToks(es);
    let cands = finiteCandidates(ts);
    if (opts.index != null) cands = cands.filter((c) => c.index === opts.index);
    if (!cands.length) return null;
    if (cands.length > 1 && !opts.allowMany) return null;
    const cand = cands[0];
    const i = cand.index;
    let an = cand.analyses.filter((a2) => a2.tense !== "imperativo");
    const experiencer = an.some((a2) => EXPERIENCER.has(a2.inf));
    if (!an.length || experiencer && !opts.reflexiveExperiencer) return null;
    let k = i - 1;
    const proclitics2 = [];
    while (k >= 0 && CLITICS3.has(low(ts[k])) && proclitics2.length < 2) {
      proclitics2.unshift(k);
      k--;
    }
    const neg = k >= 0 && low(ts[k]) === "no" ? k : -1;
    if (neg >= 0) k--;
    const groupStart = k + 1;
    let subject = -1;
    if (k >= 0 && SUBJECT_PRONOUNS2[low(ts[k])] && !PREPOSITIONS2.has(low(ts[k - 1]))) subject = k;
    else if (SUBJECT_PRONOUNS2[low(ts[i + 1])] && !ts[i].post) subject = i + 1;
    const persons = /* @__PURE__ */ new Set();
    if (subject >= 0) persons.add(SUBJECT_PRONOUNS2[low(ts[subject])]);
    const sub = en ? enSubject(en) : null;
    let allowed = null;
    if (subject >= 0) allowed = [SUBJECT_PRONOUNS2[low(ts[subject])]];
    if (sub) allowed = allowed ? allowed.filter((p) => sub.persons.includes(p)) : sub.persons;
    if (allowed) an = an.filter((a2) => allowed.includes(a2.person));
    if (!an.length) return null;
    const lastClitic = proclitics2.length ? low(ts[proclitics2[proclitics2.length - 1]]) : "";
    const reflexAn = an.filter((a2) => /se$/.test(a2.inf) && REFLEXIVE[a2.person] === lastClitic);
    const reflexive = reflexAn.length > 0;
    if (experiencer && !reflexive) return null;
    an = reflexive ? reflexAn : an.some((a2) => !/se$/.test(a2.inf)) ? an.filter((a2) => !/se$/.test(a2.inf)) : an;
    if (en) an = byEnglish(an, en);
    const keyOf = (a2) => `${a2.tense}|${a2.person}`;
    if (new Set(an.map(keyOf)).size > 1 && en) {
      const hint = enTenseHint(en);
      if (hint) {
        const f = an.filter((a2) => hint.includes(a2.tense));
        if (f.length) an = f;
      }
    }
    if (new Set(an.map(keyOf)).size > 1) {
      const lw = ts.map(low).join(" ");
      for (const [re, tenses] of PERSON_TENSE_HINTS) if (re.test(lw)) an = an.filter((a2) => tenses.includes(a2.tense));
      if (new Set(an.map(keyOf)).size > 1) return null;
    }
    const a = an[0];
    if (!a) return null;
    const participle3 = compoundParticiple(ts, i);
    let complement = -1;
    for (let j = (participle3 >= 0 ? participle3 : i) + 1; j <= i + 3 && j < ts.length; j++) {
      const lj = low(ts[j]);
      if (isInfinitive(lj) || splitEnclitic(lj) || /(ando|iendo|yendo)$/.test(lj) && gerundOf(lj)) {
        complement = j;
        break;
      }
      if (!["a", "de", "que"].includes(lj)) break;
    }
    return {
      toks: ts,
      verb: i,
      choice: { inf: a.inf, tense: a.tense, person: a.person },
      participle: participle3,
      neg,
      proclitics: proclitics2,
      subject,
      groupStart,
      reflexive,
      complement
    };
  }
  var KEEP_HIATUS = (w, i) => {
    var _a2, _b;
    const c = w[i];
    if (c !== "\xED" && c !== "\xFA") return false;
    return /[aeoáéó]/.test((_a2 = w[i - 1]) != null ? _a2 : "") || /[aeoáéó]/.test((_b = w[i + 1]) != null ? _b : "");
  };
  function stripStressAccents(w) {
    let out = "";
    for (let i = 0; i < w.length; i++) out += /[áéíóú]/.test(w[i]) && !KEEP_HIATUS(w, i) ? deaccent(w[i]) : w[i];
    return out;
  }
  function respell(plain, sFromEnd) {
    const ns = nuclei(plain);
    if (!ns.length) return plain;
    const s = ns.length - 1 - sFromEnd;
    if (s < 0) return plain;
    const natural = /[aeiouns]$/.test(plain) ? ns.length - 2 : ns.length - 1;
    if (s === Math.max(0, natural) || ns.length === 1) return plain;
    const [a, b] = ns[s];
    let pos = -1;
    for (let j = a; j < b; j++) if (/[aeo]/.test(plain[j])) {
      pos = j;
      break;
    }
    if (pos < 0) pos = b - 1;
    const acute = { a: "\xE1", e: "\xE9", i: "\xED", o: "\xF3", u: "\xFA" };
    return acute[plain[pos]] ? plain.slice(0, pos) + acute[plain[pos]] + plain.slice(pos + 1) : plain;
  }
  function stressFromEnd(w) {
    return nuclei(w).length - 1 - stressedNucleus(w);
  }
  var INVARIANT_PLURAL = /* @__PURE__ */ new Set(["lunes", "martes", "mi\xE9rcoles", "jueves", "viernes", "crisis", "tesis", "virus", "paraguas", "cumplea\xF1os", "gafas"]);
  function pluralize(w) {
    if (INVARIANT_PLURAL.has(w)) return w;
    if (/[aeiouáéó]$/.test(w)) return w + "s";
    if (/[íú]$/.test(w)) return w + "es";
    const sFromEnd = stressFromEnd(w) + 1;
    let plain = stripStressAccents(w);
    if (/z$/.test(plain)) plain = plain.slice(0, -1) + "c";
    return respell(plain + "es", sFromEnd);
  }
  function singularize(w) {
    if (INVARIANT_PLURAL.has(w)) return w;
    if (/[^aeiouáéíóú]es$/.test(w) && !/[aeiou]s$/.test(w.slice(0, -1))) {
      if (/ces$/.test(w) ? !/[aeiouáéíóú]ces$/.test(w) : !/[aeiouáéíóú][lnrdsjy]$/.test(w.slice(0, -2))) return w.slice(0, -1);
      const sFromEnd = stressFromEnd(w) - 1;
      let plain = stripStressAccents(w.slice(0, -2));
      if (/c$/.test(plain) && /ces$/.test(w)) plain = plain.slice(0, -1) + "z";
      return respell(plain, Math.max(0, sFromEnd));
    }
    if (/[íú]es$/.test(w)) return w.slice(0, -2);
    if (/s$/.test(w)) return w.slice(0, -1);
    return w;
  }
  var isPluralWord = (w) => /s$/.test(w) && !INVARIANT_PLURAL.has(w);
  function otherGender(w) {
    const pl = isPluralWord(w);
    const sg = pl ? singularize(w) : w;
    let out = null;
    if (/o$/.test(sg)) out = sg.slice(0, -1) + "a";
    else if (GENDER_FEM_FROM.has(sg)) out = GENDER_FEM_FROM.get(sg);
    else if (/(d|t)ora$/.test(sg)) out = sg.slice(0, -1);
    else if (/a$/.test(sg) && !/[ií]sta$/.test(sg)) out = sg.slice(0, -1) + "o";
    else if (/(or|ón|ín|án|és)$/.test(sg) && !/(mejor|peor|mayor|menor|anterior|posterior|exterior|interior|superior|inferior)$/.test(sg)) out = respell(stripStressAccents(sg) + "a", 1);
    if (!out) return null;
    return pl ? pluralize(out) : out;
  }
  var GENDER_FEM_FROM = /* @__PURE__ */ new Map([
    ["trabajadora", "trabajador"],
    ["habladora", "hablador"],
    ["espa\xF1ola", "espa\xF1ol"],
    ["inglesa", "ingl\xE9s"],
    ["francesa", "franc\xE9s"],
    ["alemana", "alem\xE1n"],
    ["japonesa", "japon\xE9s"],
    ["portuguesa", "portugu\xE9s"],
    ["dormilona", "dormil\xF3n"],
    ["profesora", "profesor"]
  ]);
  var GENDER_EXCEPTIONS = {
    "d\xEDa": "m",
    mapa: "m",
    problema: "m",
    idioma: "m",
    programa: "m",
    sistema: "m",
    tema: "m",
    clima: "m",
    planeta: "m",
    sof\u00E1: "m",
    "pap\xE1": "m",
    mano: "f",
    foto: "f",
    moto: "f",
    radio: "f",
    "mam\xE1": "f"
  };
  function nounGender(noun, article2, lexicon) {
    const art = article2 == null ? void 0 : article2.toLowerCase();
    if (art && /^(el|un|este|ese|aquel|los|unos|estos|esos|aquellos|del|al|nuestro|nuestros)$/.test(art)) return "m";
    if (art && /^(la|una|esta|esa|aquella|las|unas|estas|esas|aquellas|nuestra|nuestras)$/.test(art)) return "f";
    const sg = isPluralWord(noun) ? singularize(noun) : noun;
    if (lexicon == null ? void 0 : lexicon[sg]) return lexicon[sg];
    if (GENDER_EXCEPTIONS[sg]) return GENDER_EXCEPTIONS[sg];
    if (/o$/.test(sg)) return "m";
    if (/(a|ción|sión|dad|tad|tud|umbre)$/.test(sg)) return "f";
    return null;
  }
  function detGender(det) {
    const M2F = {
      el: "la",
      los: "las",
      un: "una",
      unos: "unas",
      este: "esta",
      estos: "estas",
      ese: "esa",
      esos: "esas",
      nuestro: "nuestra",
      nuestros: "nuestras",
      aquel: "aquella",
      aquellos: "aquellas"
    };
    if (M2F[det]) return M2F[det];
    const F2M = Object.fromEntries(Object.entries(M2F).map(([a, b]) => [b, a]));
    if (F2M[det]) return F2M[det];
    if (/^(mi|mis|tu|tus|su|sus)$/.test(det)) return det;
    return null;
  }
  function isFunctionWord(w) {
    return FUNCTION.has(w.toLowerCase());
  }

  // lib/match/support/lexicon.ts
  var set2 = (s) => new Set(s.split(/\s+/).filter(Boolean));
  var ARTICLES3 = set2("el la los las un una unos unas");
  var CONTRACTIONS2 = set2("al del");
  var POSSESSIVES3 = set2(`mi mis tu tus su sus nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras
  m\xEDo m\xEDa m\xEDos m\xEDas tuyo tuya tuyos tuyas suyo suya suyos suyas`);
  var DEMONSTRATIVES3 = set2("este esta estos estas ese esa esos esas aquel aquella aquellos aquellas");
  var DEM_PRONOUNS2 = set2("esto eso aquello");
  var QUANTIFIERS2 = set2(`mucho mucha muchos muchas poco poca pocos pocas todo toda todos todas otro otra otros otras
  cada varios varias alg\xFAn alguno alguna algunos algunas ning\xFAn ninguno ninguna demasiado demasiada demasiados demasiadas
  bastante bastantes tanto tanta tantos tantas mismo misma mismos mismas cualquier cualquiera ambos ambas cierto cierta
  ciertos ciertas medio media tal tales unos unas`);
  var NUMBERS2 = set2(`uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince diecis\xE9is
  diecisiete dieciocho diecinueve veinte veintiuno veintid\xF3s veintitr\xE9s veinticuatro veinticinco veintis\xE9is veintisiete
  veintiocho veintinueve treinta cuarenta cincuenta sesenta setenta ochenta noventa cien ciento doscientos doscientas
  trescientos quinientos mil mill\xF3n millones primer primero primera primeros primeras segundo segunda tercer tercero
  tercera cuarto cuarta quinto quinta \xFAltimo \xFAltima \xFAltimos \xFAltimas`);
  var SUBJECT_PRONOUNS3 = set2("yo t\xFA \xE9l ella usted nosotros nosotras ellos ellas ustedes vosotros vosotras vos");
  var TONIC_PRONOUNS2 = set2("m\xED ti s\xED conmigo contigo consigo");
  var CLITICS4 = set2("me te se nos os lo la los las le les");
  var PREPOSITIONS3 = set2(`a ante bajo con contra de desde durante en entre hacia hasta mediante para por seg\xFAn sin
  sobre tras excepto salvo incluso`);
  var CONJUNCTIONS2 = set2("y e o u ni pero sino que porque aunque si cuando mientras como pues");
  var INTERROGATIVES2 = set2("qu\xE9 qui\xE9n qui\xE9nes d\xF3nde ad\xF3nde cu\xE1ndo c\xF3mo cu\xE1nto cu\xE1nta cu\xE1ntos cu\xE1ntas cu\xE1l cu\xE1les");
  var RELATIVES2 = set2("que quien quienes donde adonde cual cuales cuyo cuya cuyos cuyas cuanto");
  var NEGATIVES2 = set2("no nunca jam\xE1s tampoco nada nadie ninguno ninguna ning\xFAn");
  var INDEF_PRONOUNS2 = set2("algo alguien nada nadie todo todos todas cualquiera");
  var INTERJECTIONS2 = set2("hola adi\xF3s chao chau gracias ay oh eh uy ah ojal\xE1 s\xED ok okey uf guau");
  var ADVERBS2 = set2(`muy m\xE1s menos bien mal ya tambi\xE9n tampoco siempre aqu\xED all\xED ah\xED ac\xE1 all\xE1 hoy ayer ma\xF1ana ahora
  antes despu\xE9s luego todav\xEDa a\xFAn aun casi solo s\xF3lo tan tanto mucho poco bastante demasiado nunca jam\xE1s pronto tarde
  temprano entonces quiz\xE1 quiz\xE1s acaso adem\xE1s apenas despacio deprisa r\xE1pido arriba abajo cerca lejos dentro fuera afuera
  adentro encima debajo delante detr\xE1s enfrente atr\xE1s adelante anoche anteayer pasado as\xED igual mejor peor mientras
  todav\xEDa incluso sobre_todo justo reci\xE9n enseguida juntos juntas solamente seguramente realmente claro`);
  var FUNCTION_HOMOGRAPHS2 = set2(`como para sobre entre bajo nada mientras contra cerca medio claro cierto solo
  vale casi junto ante tras pasado seguro listo libre \xFAnico`);
  var NOUN_HOMOGRAPHS2 = set2(`trabajo cena cambio viaje r\xEDo ayuda parte partes cocina estudio desayuno vista recibo
  camino compra dise\xF1o pregunta preguntas gasto programa programas contrato negocio traje ducha recuerdo ba\xF1o firma paso
  cuenta gusto metas despido sue\xF1o vuelo muestra paseo llamada visita respuesta comida bebida salida entrada parada
  llegada subida bajada apoyo duda falta juego lucha marcha nota pena prueba regalo reserva saludo vuelta reparto aumento
  ahorro consumo reforma demanda oferta reparo peso gobierno mando cargo encuentro fomento rechazo soluciones funciones
  proyecto casa centro queja proceso marca medio medios g\xE9nero art\xEDculo art\xEDculos p\xFAblico pr\xE1ctico pr\xE1ctica \xF3pera
  ampliaci\xF3n estudios contratos negocios cambios viajes cosa cosas nieve alegre informe tema muela tr\xE1mite sal sed vino
  sobre bajo carta canto cuento cocinas compras llamadas plato vaso mesa mano clase obra fin color calor caf\xE9 lleno
  limpio libre cambio pago env\xEDo orden olvido abrazo beso grito cuido descanso desarrollo intento cierre uso trato
  aviso viaje ruido baile camino cura dibujo ensayo charla siesta pelea cola copia multa critica pinta tapa carga
  espera cuesta vela venta alquiler mira manda parece ama amo cura llave hielo don papa vino`);
  var DETERMINER_LIKE2 = /* @__PURE__ */ new Set([
    ...ARTICLES3,
    ...CONTRACTIONS2,
    ...POSSESSIVES3,
    ...DEMONSTRATIVES3,
    "cada",
    "otro",
    "otra",
    "otros",
    "otras",
    "mucho",
    "mucha",
    "muchos",
    "muchas",
    "poco",
    "poca",
    "pocos",
    "pocas",
    "alg\xFAn",
    "alguna",
    "algunos",
    "algunas",
    "ning\xFAn",
    "ninguna",
    "varios",
    "varias",
    "buen",
    "buena",
    "mal",
    "gran",
    "primer",
    "primera",
    "tercer",
    "\xFAltimo",
    "\xFAltima",
    "nuevo",
    "nueva",
    "mismo",
    "misma",
    "demasiado",
    "demasiada",
    "tanto",
    "tanta",
    "tantos",
    "tantas",
    "qu\xE9",
    "cu\xE1nto",
    "cu\xE1nta",
    "cu\xE1ntos",
    "cu\xE1ntas",
    "dos",
    "tres",
    "cuatro"
  ]);
  var CORE_ADJ2 = `alto bajo grande peque\xF1o bueno malo nuevo viejo joven mayor menor mejor peor bonito lindo feo largo corto
  ancho estrecho gordo delgado flaco fuerte d\xE9bil r\xE1pido lento f\xE1cil dif\xEDcil caro barato rico pobre feliz triste contento
  cansado enfermo sano ocupado libre listo tranquilo nervioso aburrido divertido interesante importante necesario posible
  imposible probable seguro inseguro claro oscuro limpio sucio lleno vac\xEDo abierto cerrado caliente fr\xEDo fresco tibio
  rojo azul verde amarillo blanco negro gris morado rosado caf\xE9 naranja marr\xF3n primero segundo \xFAltimo pr\xF3ximo pasado
  siguiente anterior simp\xE1tico antip\xE1tico amable ch\xE9vere bacano raro normal extra\xF1o incre\xEDble terrible horrible genial
  perfecto excelente fant\xE1stico maravilloso precioso hermoso guapo serio alegre loco tonto inteligente listo amable
  t\xEDmido valiente orgulloso preocupado enojado bravo sorprendido emocionado asustado enamorado casado soltero
  divorciado separado viudo colombiano mexicano espa\xF1ol ingl\xE9s franc\xE9s alem\xE1n americano latino cale\xF1o bogotano paisa
  coste\xF1o solo junto mismo propio cierto verdadero falso real p\xFAblico privado social pol\xEDtico econ\xF3mico personal
  famoso popular moderno antiguo tradicional t\xEDpico local nacional internacional principal general especial diferente
  igual parecido distinto mejor \xFAtil in\xFAtil agradable desagradable c\xF3modo inc\xF3modo peligroso dulce salado amargo
  picante delicioso sabroso rico duro blando suave pesado ligero liviano lejano cercano diario semanal mensual anual
  \xFAnico \xFAltimo entero medio doble h\xFAmedo seco soleado nublado lluvioso tropical c\xE1lido templado verde maduro crudo
  cocido frito asado mojado roto perdido preparado sentado parado acostado dormido despierto vivo muerto embarazada
  responsable puntual educado grosero callado hablador trabajador perezoso juicioso sencillo complicado f\xE1cil sano
  cari\xF1oso celoso generoso taca\xF1o honesto sincero mentiroso curioso feliz infeliz satisfecho harto agotado relajado
  estresado ansioso deprimido animado entusiasmado capaz incapaz digno exacto r\xE1pido actual reciente`;
  var CORE_NOUN_M2 = `costo arriendo tranc\xF3n parcero celular carro computador apartamento bus jugo durazno parqueadero tiquete boleto mesero almuerzo
  desayuno d\xEDa mes a\xF1o fin momento rato tiempo lugar sitio barrio pueblo pa\xEDs mundo centro parque mercado
  supermercado restaurante hotel aeropuerto hospital colegio trabajo dinero peso precio problema tema sistema mapa
  idioma espa\xF1ol ingl\xE9s pap\xE1 hermano hijo abuelo t\xEDo primo amigo novio esposo se\xF1or hombre ni\xF1o chico muchacho pelado
  compa\xF1ero jefe vecino profesor estudiante doctor m\xE9dico perro gato libro cuaderno l\xE1piz esfero tel\xE9fono correo
  mensaje nombre apellido n\xFAmero cumplea\xF1os regalo caf\xE9 t\xE9 arroz pollo pescado huevo pan queso helado vino
  ba\xF1o cuarto piso techo edificio balc\xF3n patio jard\xEDn cielo sol mar r\xEDo lago viento fr\xEDo calor invierno verano
  f\xFAtbol partido equipo juego deporte gimnasio cine teatro concierto museo viaje paseo pasaje tren avi\xF3n metro taxi
  camino sem\xE1foro carro tranc\xF3n tr\xE1fico tr\xE1fico cuerpo brazo pie ojo pelo coraz\xF3n dolor est\xF3mago miedo sue\xF1o
  plan proyecto examen trabajo salario sueldo negocio banco cajero billete arepa tinto aguacate pl\xE1tano banano
  video chofer coctel mijo parce fr\xEDjol ma\xEDz mango ajiaco sancocho bocadillo chocolate dulce postre vaso plato tenedor cuchillo almac\xE9n`;
  var CORE_NOUN_F2 = `mija agua hambre casa calle ciudad plaza tienda oficina universidad escuela clase mam\xE1 madre hermana hija abuela t\xEDa
  prima amiga novia esposa se\xF1ora mujer ni\xF1a chica muchacha familia gente persona vida noche tarde ma\xF1ana semana hora
  vez comida cena bebida agua leche carne fruta verdura papa sopa ensalada cerveza gaseosa torta mesa silla cama
  puerta ventana cocina sala nevera ducha llave ropa camisa camiseta falda chaqueta chompa ruana bolsa maleta plata
  cuenta palabra pregunta respuesta idea verdad mentira historia noticia pel\xEDcula m\xFAsica canci\xF3n fiesta playa monta\xF1a
  finca isla selva lluvia nube cabeza mano boca cara nariz espalda pierna salud fiebre gripa farmacia droguer\xEDa
  medicina cita reuni\xF3n tarea nota carrera empresa compa\xF1\xEDa tarjeta moneda factura cuenta foto c\xE1mara computadora
  red p\xE1gina aplicaci\xF3n contrase\xF1a clave buseta moto bicicleta estaci\xF3n parada esquina cuadra carrera calle avenida
  arepa empanada natilla bu\xF1uelo panader\xEDa tienda`;
  var CORE_ADV2 = `ahorita ac\xE1 all\xE1 enseguida siempre nunca juntos despacio r\xE1pido temprano tarde bastante demasiado ojal\xE1
  tambi\xE9n tampoco quiz\xE1s quiz\xE1 apenas casi solo solamente todav\xEDa a\xFAn adem\xE1s entonces luego despu\xE9s antes pronto
  ya`;
  var LEX2 = /* @__PURE__ */ new Map();
  var FORMS2 = new Set(forms_default);
  var DEAC_LEMMA2 = /* @__PURE__ */ new Map();
  function put2(lemma2, e, override = false) {
    const w = lemma2.replace(/_$/, "").replace(/_/g, " ");
    if (!w || !override && LEX2.has(w)) return;
    LEX2.set(w, e);
    DEAC_LEMMA2.set(deaccent(w), w);
  }
  for (const [k, v] of Object.entries(lexicon_default)) {
    const [p, g] = v;
    put2(k, p === "n" ? { pos: "noun", gender: g != null ? g : "m" } : p === "v" ? { pos: "inf" } : { pos: "x" });
  }
  for (const w of set2(CORE_ADJ2)) put2(w, { pos: "adj" }, true);
  for (const w of set2(CORE_NOUN_M2)) put2(w, { pos: "noun", gender: "m" }, true);
  for (const w of set2(CORE_NOUN_F2)) put2(w, { pos: "noun", gender: "f" }, !LEX2.has(w) || LEX2.get(w).pos !== "noun");
  for (const w of set2(CORE_ADV2)) if (!LEX2.has(w)) put2(w, { pos: "adv" });
  var LEXEME_STOP2 = set2("m\xE1s menos muy tan ya no s\xED tambi\xE9n tampoco a\xFAn aun todav\xEDa solo s\xF3lo casi tanto mucho poco bastante demasiado as\xED luego entonces pues algo nada");
  function isKnownForm2(w) {
    return FORMS2.has(w) || LEX2.has(w);
  }
  function closedClass2(w) {
    if (ARTICLES3.has(w) || CONTRACTIONS2.has(w)) return "det";
    if (POSSESSIVES3.has(w)) return "poss";
    if (DEMONSTRATIVES3.has(w)) return "dem";
    if (DEM_PRONOUNS2.has(w) || SUBJECT_PRONOUNS3.has(w) || TONIC_PRONOUNS2.has(w) || INDEF_PRONOUNS2.has(w)) return "pron";
    if (CLITICS4.has(w)) return "clitic";
    if (PREPOSITIONS3.has(w)) return "prep";
    if (INTERROGATIVES2.has(w)) return "int";
    if (w === "no" || w === "nunca" || w === "jam\xE1s" || w === "tampoco") return "neg";
    if (RELATIVES2.has(w) && w !== "que" && w !== "cuanto") return "rel";
    if (CONJUNCTIONS2.has(w)) return "conj";
    if (QUANTIFIERS2.has(w)) return "quant";
    if (NUMBERS2.has(w)) return "num";
    if (INTERJECTIONS2.has(w)) return "interj";
    if (ADVERBS2.has(w)) return "adv";
    return null;
  }

  // lib/match/support/reinflect.ts
  var WEATHER = /* @__PURE__ */ new Set(["llover", "nevar", "tronar", "amanecer", "anochecer"]);
  var COPULAS = /* @__PURE__ */ new Set(["ser", "estar", "sentirse", "quedarse", "ponerse", "seguir", "andar", "verse", "encontrarse", "hallarse", "mantenerse", "volverse", "hacerse"]);
  var CLIMBING = /* @__PURE__ */ new Set(["querer", "poder", "deber", "ir", "tener", "saber", "empezar", "comenzar", "acabar", "volver", "estar", "seguir", "necesitar", "pensar", "soler", "intentar", "tratar", "preferir", "esperar"]);
  function form(inf, tense, person) {
    const v = verbByInf(inf);
    if (!v || person === "vosotros") return null;
    const cell = conjugateBareCells(v, tense)[PERSONS.indexOf(person)];
    if (!(cell == null ? void 0 : cell.form) || cell.form.includes(" ")) return null;
    const back = verbReadings(cell.form).some((a) => a.tense === tense && a.person === person && (a.inf === inf || a.inf === inf.replace(/se$/, "") || a.inf + "se" === inf));
    return back ? cell.form : null;
  }
  function pronounFor(p, was) {
    const fem = was ? /^(ella|ellas|nosotras)$/.test(was) : false;
    switch (p) {
      case "yo":
        return "yo";
      case "t\xFA":
        return "t\xFA";
      case "\xE9l/ella":
        return fem ? "ella" : "\xE9l";
      case "nosotros":
        return fem ? "nosotras" : "nosotros";
      case "ellos":
        return fem ? "ellas" : "ellos";
      default:
        return "vosotros";
    }
  }
  var PLURAL_PERSON = (p) => p === "nosotros" || p === "ellos" || p === "vosotros";
  var OWN_POSSESSIVE = { yo: /^mis?$/, "t\xFA": /^tus?$/, nosotros: /^nuestr[oa]s?$/ };
  function possessiveFor(p, plural2, gender) {
    switch (p) {
      case "yo":
        return plural2 ? "mis" : "mi";
      case "t\xFA":
        return plural2 ? "tus" : "tu";
      case "\xE9l/ella":
      case "ellos":
        return plural2 ? "sus" : "su";
      case "nosotros":
        return gender ? "nuestr" + (gender === "m" ? "o" : "a") + (plural2 ? "s" : "") : null;
      default:
        return null;
    }
  }
  function pronounSubject(c, en) {
    const qPhrase = c.subject < 0 && /^(qué|dónde|cuándo|cómo|quién|cuál|cuánto|cuántos|cuánta|cuántas|a|de|con|para|por|en|desde|hasta)$/.test(low(c.toks[0])) && c.toks.slice(0, c.groupStart).some((t) => /^(qué|dónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuántos|cuánta|cuántas)$/.test(low(t))) && c.toks.some((t) => /\?/.test(t.post));
    if (qPhrase) return en ? !!enSubject(en) : false;
    for (let i = 0; i < c.groupStart; i++) {
      const l = low(c.toks[i]);
      if (i === c.subject || TIME_WORDS.has(l)) continue;
      if (timeSpans(c.toks).some(([a, b]) => i >= a && i < b)) continue;
      if (/^(qué|dónde|cuándo|cómo|por|y|pero|también|a|quién|cuál|cuánto|cuántos|cuánta|cuántas)$/.test(l)) continue;
      return false;
    }
    if (c.subject >= 0) return true;
    return en ? !!enSubject(en) : false;
  }
  var CAPITAL = /^\p{Lu}/u;
  function insertBefore(ts, at, core) {
    const out = insertTok(ts, at, core);
    if (at > 0 && out[at + 1]) {
      out[at].pre = out[at + 1].pre;
      out[at + 1].pre = "";
    }
    return out;
  }
  var TITLES = /^(don|doña|señor|señora|señorita|doctor|doctora|profe|profesor|profesora)$/;
  function addressesByName(c) {
    const n = c.toks.length;
    if (n < 2 || !/[?]/.test(c.toks[n - 1].post)) return false;
    const last = CAPITAL.test(c.toks[n - 1].core) && /,$/.test(c.toks[n - 2].post);
    const first = c.verb > 0 && CAPITAL.test(c.toks[0].core) && c.toks[0].post === "," && !isFunctionWord(low(c.toks[0]));
    const titled = TITLES.test(low(c.toks[n - 1])) ? /,$/.test(c.toks[n - 2].post) : TITLES.test(low(c.toks[n - 2])) && CAPITAL.test(c.toks[n - 1].core) && n > 2 && /,$/.test(c.toks[n - 3].post);
    return last || first || titled;
  }
  function joinsNames(c) {
    return c.toks.some((t, i) => {
      var _a2, _b;
      return i > 0 && CAPITAL.test(t.core) && low(c.toks[i + 1]) === "y" && CAPITAL.test((_b = (_a2 = c.toks[i + 2]) == null ? void 0 : _a2.core) != null ? _b : "");
    });
  }
  var OWN_WORDS = {
    yo: /^(me|nos|conmigo|mí|nosotros|nosotras)$/,
    nosotros: /^(me|nos|conmigo|mí|nosotros|nosotras)$/,
    "t\xFA": /^(te|contigo|ti)$/
  };
  var EXPERIENCER_PARTICIPLES = new Set([...EXPERIENCER].map((v) => v.replace(/ar$/, "ado").replace(/[ei]r$/, "ido")));
  function tiedToPerson(c, to) {
    const ts = c.toks;
    const from = c.choice.person;
    const own = from === "\xE9l/ella" || from === "ellos" ? null : REFLEXIVE[from];
    const clash = OWN_WORDS[to];
    const last = c.proclitics.length - 1;
    for (const [k, at] of c.proclitics.entries()) {
      const l = low(ts[at]);
      if (l === "se" && /^(me|te|le|les|nos)$/.test(low(ts[c.proclitics[k + 1]]))) return true;
      if (c.reflexive && k === last) continue;
      if (l === own || (clash == null ? void 0 : clash.test(l))) return true;
    }
    for (let i = 0; i < ts.length; i++) {
      if (i === c.subject || i === c.verb || c.proclitics.includes(i)) continue;
      const l = low(ts[i]);
      if (SUBJECT_PRONOUNS2[l] && !PREPOSITIONS2.has(low(ts[i - 1]))) return true;
      if (clash == null ? void 0 : clash.test(l)) return true;
      if (c.choice.inf === "ser" && /^(mí[oa]|tuy[oa]|suy[oa])s?$/.test(l)) return true;
      const sp = i > c.verb ? splitEnclitic(l) : null;
      if (sp == null ? void 0 : sp.clitics.some((x) => x === REFLEXIVE[from] ? i !== c.complement : clash == null ? void 0 : clash.test(x))) return true;
    }
    return false;
  }
  var DEPICTIVE_VERBS = /* @__PURE__ */ new Set(["llegar", "venir", "volver", "regresar", "salir", "entrar", "vivir", "ir", "dormir", "despertar", "nacer", "morir", "terminar", "acabar", "llevar"]);
  var DEPICTIVE = /(ad|id)[oa]s?$|^(content|tranquil|list|enferm|nervios)[oa]s?$|^(triste|feliz|tristes|felices)$/;
  function numberLeftBehind(c, to) {
    const from = c.choice.person;
    if (PLURAL_PERSON(from) === PLURAL_PERSON(to)) return false;
    const ts = c.toks;
    const next = (c.participle >= 0 ? c.participle : c.verb) + 1;
    if (DEPICTIVE_VERBS.has(c.choice.inf.replace(/se$/, "")) && DEPICTIVE.test(low(ts[next]))) return true;
    return ts.some((t, i) => {
      const l = low(t);
      const before = low(ts[i - 1]);
      if (!PLURAL_PERSON(from)) return /^(sola|mism[oa])$/.test(l) || l === "solo" && (i === next || i === ts.length - 1);
      if (/^(junt[oa]s|ambos|ambas|sol[oa]s|mism[oa]s)$/.test(l)) return true;
      if (/^(todos|todas)$/.test(l)) return !DETERMINERS.has(low(ts[i + 1])) && !PREPOSITIONS2.has(before);
      return /^(los|las)$/.test(l) && /^(dos|tres|cuatro|cinco|seis)$/.test(low(ts[i + 1])) && !PREPOSITIONS2.has(before);
    });
  }
  var NO_AGREEMENT = /^(que|como|fatal|regular|genial)$/;
  function agreePredicate(ts, from, plural2) {
    let out = ts;
    let j = from;
    while (j < out.length && (/^(muy|bastante|tan|demasiado|más|menos|un|poco|algo|siempre|nunca|ya|también|hoy|todavía)$/.test(low(out[j])) || /mente$/.test(low(out[j])))) {
      if (low(out[j]) === "un" && low(out[j + 1]) !== "poco") return null;
      j++;
    }
    const noWordToChange = (l) => {
      const kind = closedClass2(l);
      return kind === "prep" || kind === "adv" && !/^(mejor|peor|igual)$/.test(l) || kind === "conj" || NO_AGREEMENT.test(l) || TIME_WORDS.has(l) || !!gerundOf(l) || !!splitEnclitic(l) || kind === "pron" && /^(conmigo|contigo|consigo)$/.test(l);
    };
    for (; ; ) {
      const l = low(out[j]);
      if (!l) return out;
      if (/^\p{Lu}/u.test(out[j].core)) return null;
      if (noWordToChange(l)) return out;
      if (closedClass2(l) || isFunctionWord(l)) return null;
      const nw = plural2 ? isPluralWord(l) ? l : pluralize(l) : isPluralWord(l) ? singularize(l) : l;
      if (nw !== l) out = replaceCore(out, j, nw);
      if (j === out.length - 1) return out;
      if (out[j].post) return null;
      const next = low(out[j + 1]);
      if (next === "y" || next === "e" || next === "o" || next === "u") {
        j += 2;
        continue;
      }
      if (next === "pero" || next === "sino" || !noWordToChange(next)) return null;
      return out;
    }
  }
  function changePerson(c, to, opts = {}) {
    var _a2;
    const { inf, tense, person: from } = c.choice;
    if (to === from || to === "vosotros") return null;
    const lexInf = c.participle >= 0 ? verbReadings(low(c.toks[c.participle])).length ? null : inf : inf;
    if (EXPERIENCER.has(inf.replace(/se$/, "")) || WEATHER.has(inf) || lexInf === null) return null;
    if (c.participle >= 0 && !c.reflexive && EXPERIENCER_PARTICIPLES.has(low(c.toks[c.participle]))) return null;
    if (!pronounSubject(c, opts.en)) return null;
    if (!c.reflexive && c.proclitics.length === 1 && low(c.toks[c.proclitics[0]]) === "se") return null;
    if (!opts.distractor && (addressesByName(c) || joinsNames(c) || tiedToPerson(c, to) || numberLeftBehind(c, to))) return null;
    const nf = form(inf, tense, to);
    if (!nf) return null;
    let ts = replaceCore(c.toks, c.verb, nf);
    if (c.reflexive) {
      const at = c.proclitics[c.proclitics.length - 1];
      ts = replaceCore(ts, at, REFLEXIVE[to]);
    } else {
      for (const at of c.proclitics) if (low(ts[at]) === REFLEXIVE[to] && low(ts[at]) !== "se") return null;
    }
    if (c.complement >= 0) {
      const sp = splitEnclitic(low(ts[c.complement]));
      if (sp && sp.clitics.includes(REFLEXIVE[from])) {
        if (!c.reflexive && c.proclitics.length) return null;
        const base = sp.kind === "inf" ? sp.base : gerundOf(sp.base) ? sp.base : null;
        if (!base) return null;
        const cl = sp.clitics.map((x) => x === REFLEXIVE[from] ? REFLEXIVE[to] : x).join("");
        ts = replaceCore(ts, c.complement, attachEnclitic(base, cl));
      } else if (sp && sp.clitics.includes(REFLEXIVE[to]) && REFLEXIVE[to] !== "se") return null;
    }
    const ownRe = OWN_POSSESSIVE[from];
    for (let i = 0; i < ts.length; i++) {
      const l = low(ts[i]);
      if (ownRe == null ? void 0 : ownRe.test(l)) {
        const np = possessiveFor(to, /s$/.test(l), nounGender(low(ts[i + 1]) || ""));
        if (!np) return null;
        ts = replaceCore(ts, i, np);
      } else if (from !== "yo" && from !== "t\xFA" && from !== "nosotros" && /^sus?$/.test(l)) {
        return null;
      }
    }
    if (COPULAS.has(inf) && PLURAL_PERSON(from) !== PLURAL_PERSON(to)) {
      const after = (c.participle >= 0 ? c.participle : c.verb) + 1;
      const agreed = agreePredicate(ts, c.subject === after ? after + 1 : after, PLURAL_PERSON(to));
      if (!agreed) return null;
      ts = agreed;
    }
    const mode = (_a2 = opts.pronoun) != null ? _a2 : "keep";
    if (c.subject >= 0) {
      if (mode === "drop") ts = removeToks(ts, c.subject, c.subject + 1);
      else ts = replaceCore(ts, c.subject, pronounFor(to, low(c.toks[c.subject])));
    } else if (mode === "add") {
      ts = insertBefore(ts, c.groupStart, pronounFor(to));
    }
    return { es: render(ts), toks: ts, accept: [] };
  }
  function goingTo(c) {
    return /^ir(se)?$/.test(c.choice.inf) && low(c.toks[c.verb + 1]) === "a" && /[aeií]r(me|te|se|lo|la|le|nos|los|las|les)*$/.test(low(c.toks[c.verb + 2])) && !CAPITAL.test(c.toks[c.verb + 2].core);
  }

  // lib/match/canon.ts
  var MOVABLE_ONE = /* @__PURE__ */ new Set(["ya", "tambi\xE9n", "siempre", "hoy", "ayer", "ma\xF1ana", "anoche", "ahora", "todav\xEDa", "normalmente", "generalmente", "luego"]);
  var MOVABLE_MULTI = [
    ["a", "veces"],
    ["todos", "los", "d\xEDas"],
    ["todas", "las", "semanas"],
    ["esta", "noche"],
    ["esta", "ma\xF1ana"],
    ["esta", "tarde"],
    ["el", "fin", "de", "semana"],
    ["la", "semana", "pasada"],
    ["el", "a\xF1o", "pasado"],
    ["por", "la", "ma\xF1ana"],
    ["por", "la", "tarde"],
    ["por", "la", "noche"],
    ["en", "la", "ma\xF1ana"],
    ["en", "la", "tarde"],
    ["en", "la", "noche"]
  ];
  var isFinite = (w) => analyzeToken(w).some((a) => a.accentExact && !a.clitics);
  function finiteIndex(ts) {
    for (let i = 0; i < ts.length; i++) {
      const prev2 = ts[i - 1];
      if (prev2 && (DETERMINERS.has(prev2) || PREPOSITIONS2.has(prev2)) && !/^(la|las|los|lo)$/.test(prev2)) continue;
      if (/^(para|como|entre|sobre|nada|bajo)$/.test(ts[i])) continue;
      if (isFinite(ts[i])) return i;
    }
    return -1;
  }
  function verbGroup(ts) {
    const v = finiteIndex(ts);
    if (v < 0) return null;
    let a = v;
    while (a > 0 && (CLITICS3.has(ts[a - 1]) || ts[a - 1] === "no")) a--;
    let b = v + 1;
    const haber = verbReadings(ts[v]).some((a2) => a2.inf === "haber");
    const nonFinite2 = (w) => isInfinitive(w) || !!gerundOf(w) || !!splitEnclitic(w);
    for (let k = 0; k < 3 && b < ts.length; k++) {
      const w = ts[b];
      if (/^(a|de|que)$/.test(w) && b + 1 < ts.length && nonFinite2(ts[b + 1])) {
        b += 2;
        continue;
      }
      if (nonFinite2(w) || haber && k === 0 && participleOf(w)) {
        b++;
        continue;
      }
      break;
    }
    return [a, b];
  }
  var NUMBER_WORDS = {
    cero: ["u", 0],
    dos: ["u", 2],
    tres: ["u", 3],
    cuatro: ["u", 4],
    cinco: ["u", 5],
    seis: ["u", 6],
    siete: ["u", 7],
    ocho: ["u", 8],
    nueve: ["u", 9],
    diez: ["t", 10],
    once: ["t", 11],
    doce: ["t", 12],
    trece: ["t", 13],
    catorce: ["t", 14],
    quince: ["t", 15],
    diecis\u00E9is: ["t", 16],
    diecisiete: ["t", 17],
    dieciocho: ["t", 18],
    diecinueve: ["t", 19],
    veinte: ["t", 20],
    veintiuno: ["t", 21],
    veinti\u00FAn: ["t", 21],
    veintiuna: ["t", 21],
    veintid\u00F3s: ["t", 22],
    veintitr\u00E9s: ["t", 23],
    veinticuatro: ["t", 24],
    veinticinco: ["t", 25],
    veintis\u00E9is: ["t", 26],
    veintisiete: ["t", 27],
    veintiocho: ["t", 28],
    veintinueve: ["t", 29],
    treinta: ["d", 30],
    cuarenta: ["d", 40],
    cincuenta: ["d", 50],
    sesenta: ["d", 60],
    setenta: ["d", 70],
    ochenta: ["d", 80],
    noventa: ["d", 90],
    cien: ["h", 100],
    ciento: ["h", 100],
    doscientos: ["h", 200],
    doscientas: ["h", 200],
    trescientos: ["h", 300],
    trescientas: ["h", 300],
    cuatrocientos: ["h", 400],
    cuatrocientas: ["h", 400],
    quinientos: ["h", 500],
    quinientas: ["h", 500],
    seiscientos: ["h", 600],
    seiscientas: ["h", 600],
    setecientos: ["h", 700],
    setecientas: ["h", 700],
    ochocientos: ["h", 800],
    ochocientas: ["h", 800],
    novecientos: ["h", 900],
    novecientas: ["h", 900],
    mil: ["m", 1e3],
    mill\u00F3n: ["M", 1e6],
    millones: ["M", 1e6]
  };
  var NUMBER_WORDS_PLAIN = {
    dieciseis: "diecis\xE9is",
    veintiun: "veinti\xFAn",
    veintidos: "veintid\xF3s",
    veintitres: "veintitr\xE9s",
    veintiseis: "veintis\xE9is",
    millon: "mill\xF3n"
  };
  var NUMBER_NEXT = { h: "utdmM", d: "mM", u: "mM", t: "mM", m: "hutdM", M: "hutdm" };
  var ONE = /^(un|uno|una)$/;
  function figures(text) {
    var _a2, _b, _c, _d;
    const raw = [];
    const rawStops = /* @__PURE__ */ new Set();
    const fromSign = /* @__PURE__ */ new Set();
    const lower = text.toLowerCase();
    const found = [...lower.matchAll(/\d+(?:[.,]\d+)*(?:\s*%)?|[a-záéíóúñü]+/g)];
    found.forEach((m, k) => {
      var _a3, _b2;
      if (/^\d/.test(m[0])) {
        const d = m[0].replace(/\s*%$/, "");
        raw.push(/^\d{1,3}([.,]\d{3})+$/.test(d) ? d.replace(/[.,]/g, "") : d.replace(",", "."));
        if (m[0].endsWith("%")) {
          raw.push("por", "ciento");
          fromSign.add(raw.length - 1);
        }
      } else raw.push(m[0]);
      const gap = lower.slice(m.index + m[0].length, (_b2 = (_a3 = found[k + 1]) == null ? void 0 : _a3.index) != null ? _b2 : lower.length);
      if (/[.?!;:\n…¿¡]/.test(gap)) rawStops.add(raw.length - 1);
    });
    const toks = [];
    const stops = /* @__PURE__ */ new Set();
    const forms2 = /* @__PURE__ */ new Map();
    let slips = 0;
    for (let i = 0; i < raw.length; ) {
      let total = 0, cur = 0, prev2 = null, n = 0, viaY = false, inWords = true;
      const spelled = [];
      let j = i;
      for (; j < raw.length; j++) {
        if (j > i && rawStops.has(j - 1)) break;
        const w = raw[j];
        const plain = NUMBER_WORDS_PLAIN[w];
        const nw = NUMBER_WORDS[plain != null ? plain : w];
        if (/^\d/.test(w)) {
          if (prev2) break;
          cur = Number(w);
          prev2 = "u";
          n++;
          inWords = false;
          if (!/^(mil|mill[oó]n|millones)$/.test((_a2 = raw[j + 1]) != null ? _a2 : "")) {
            j++;
            break;
          }
          continue;
        }
        let place, value;
        if (nw) [place, value] = nw;
        else if (ONE.test(w) && (prev2 ? "hdmM".includes(prev2) : /^mill[oó]n$/.test((_b = raw[j + 1]) != null ? _b : ""))) {
          place = "u";
          value = 1;
        } else if (w === "y" && prev2 === "d" && !viaY && (((_c = NUMBER_WORDS[raw[j + 1]]) == null ? void 0 : _c[0]) === "u" || ONE.test((_d = raw[j + 1]) != null ? _d : ""))) {
          viaY = true;
          spelled.push(w);
          continue;
        } else break;
        if (prev2 && !(viaY ? place === "u" : NUMBER_NEXT[prev2].includes(place))) break;
        viaY = false;
        if (place === "m") {
          total += (cur || 1) * 1e3;
          cur = 0;
        } else if (place === "M") {
          total = (total + cur || 1) * 1e6;
          cur = 0;
        } else cur += value;
        if (plain) slips++;
        if (fromSign.has(j)) inWords = false;
        spelled.push(plain != null ? plain : w);
        prev2 = place;
        n++;
      }
      const end = n ? j : i + 1;
      toks.push(n ? String(total + cur) : raw[i]);
      if (n && inWords) forms2.set(toks.length - 1, spelled.join(" "));
      if (rawStops.has(end - 1)) stops.add(toks.length - 1);
      i = end;
    }
    return { toks, stops, slips, forms: forms2 };
  }
  var OWN_CLITIC = {
    me: ["yo"],
    te: ["t\xFA"],
    nos: ["nosotros"],
    os: ["vosotros"],
    se: ["\xE9l/ella", "ellos"]
  };
  var LIKE_VERBS = /* @__PURE__ */ new Set(["gustar", "encantar", "fascinar", "interesar", "importar"]);
  var A_PRONOUN = {
    "m\xED": ["yo", "me"],
    ti: ["t\xFA", "te"],
    "\xE9l": ["\xE9l", "le"],
    ella: ["ella", "le"],
    usted: ["usted", "le"],
    nosotros: ["nosotros", "nos"],
    nosotras: ["nosotras", "nos"],
    ellos: ["ellos", "les"],
    ellas: ["ellas", "les"],
    ustedes: ["ustedes", "les"]
  };
  var BEFORE_CLITIC = (w) => /^(no|nunca|tampoco|sí)$/.test(w) || MOVABLE_ONE.has(w) || w.includes("_");
  function experiencerFrame(ts, i, stops) {
    var _a2, _b;
    let k = i + 1;
    if (stops.has(ts[i])) return null;
    while (ts[k] && BEFORE_CLITIC(ts[k].t)) {
      if (stops.has(ts[k])) return null;
      k++;
    }
    const clitic = (_a2 = ts[k]) == null ? void 0 : _a2.t, verb = (_b = ts[k + 1]) == null ? void 0 : _b.t;
    if (!clitic || !verb || stops.has(ts[k]) || !(OWN_CLITIC[clitic] || /^(le|les)$/.test(clitic))) return null;
    const readings2 = verbReadings(verb).filter((a) => a.tense !== "imperativo" && EXPERIENCER.has(a.inf.replace(/se$/, "")));
    return readings2.length ? { clitic, readings: readings2 } : null;
  }
  function accentlessVerb(w, person) {
    if (person !== "t\xFA" && !/i[ao]$/.test(w)) return false;
    const rs = analyzeToken(w).filter((a) => a.target && !a.clitics);
    const fits = (a) => a.person === person && (person === "t\xFA" ? !/subj|imperativo|impneg/.test(a.tense) : /^(imperfecto|condicional|preterito)$/.test(a.tense));
    return !rs.some((a) => a.accentExact) && rs.some(fits);
  }
  function canon(text) {
    var _a2, _b, _c, _d, _e;
    const fig = figures(text);
    let ts = fig.toks;
    let accentSlips2 = fig.slips;
    const joined2 = [];
    const joinedStops = /* @__PURE__ */ new Set();
    const joinedForms = /* @__PURE__ */ new Map();
    for (let i = 0; i < ts.length; i++) {
      const m = MOVABLE_MULTI.find((p) => p.every((w, k) => ts[i + k] === w));
      if (m && !(i > 0 && /^(de|desde|hasta|para)$/.test(ts[i - 1]))) {
        joined2.push(m.join("_"));
        i += m.length - 1;
      } else joined2.push(ts[i]);
      if (fig.stops.has(i)) joinedStops.add(joined2.length - 1);
      const form2 = fig.forms.get(i);
      if (form2) joinedForms.set(joined2.length - 1, form2);
    }
    ts = joined2;
    const out = ts.map((t, i) => joinedForms.has(i) ? { t, form: joinedForms.get(i) } : { t });
    const stops = new Set(out.filter((_, i) => joinedStops.has(i)));
    for (let i = 0; i < out.length; i++) {
      const sp = splitEnclitic(out[i].t);
      if (!sp) continue;
      let j = i - 1;
      if (j >= 0 && /^(a|de|que)$/.test(out[j].t)) j--;
      if (j < 0) continue;
      const gov = verbReadings(out[j].t).filter((a) => CLIMBING.has(a.inf.replace(/se$/, "")));
      if (!gov.length) continue;
      const takes = gov.some((a) => /^(estar|seguir)$/.test(a.inf)) ? "ger" : "inf";
      if (sp.kind !== takes) continue;
      const src = out[i].t;
      const was = out[i];
      out[i] = { t: sp.base, src };
      if (stops.has(was)) stops.add(out[i]);
      out.splice(j, 0, ...sp.clitics.map((c) => ({ t: c })));
      i += sp.clitics.length;
    }
    const pronouns = [];
    for (let i = 1; i + 1 < out.length; i++) {
      const to = A_PRONOUN[out[i].t];
      if (!to || out[i - 1].t !== "a" || ((_a2 = experiencerFrame(out, i, stops)) == null ? void 0 : _a2.clitic) !== to[1]) continue;
      out.splice(i - 1, 2);
      pronouns.push(to[0]);
      i--;
    }
    const experiencer = [];
    const kept = [];
    for (let i = 0; i < out.length; i++) {
      const w = out[i].t;
      const prev2 = (_b = out[i - 1]) == null ? void 0 : _b.t, next = (_c = out[i + 1]) == null ? void 0 : _c.t;
      let pron = null;
      if (SUBJECT_PRONOUNS2[w] !== void 0) pron = w;
      let loose = false;
      if ((w === "el" || w === "tu") && next && !/^(trabajo|cocina|cena|camino|baile|estudio|casa|cuenta|cambio|programa|paso|pago|canta|llama|firma|ayuda|compra|cobra|prueba|muestra|debate|guía|cura|vino|cable|homenaje|cupo|dominó)$/.test(next)) {
        const person = w === "el" ? "\xE9l/ella" : "t\xFA";
        const exact = verbReadings(next).some((a) => a.person === person && !/subj|imperativo|impneg/.test(a.tense));
        const noun = w === "el" && (!!prev2 && isFinite(prev2) || !!out[i + 2] && isFinite(out[i + 2].t));
        loose = !exact && !noun && accentlessVerb(next, person);
        if (exact || loose) {
          pron = w === "el" ? "\xE9l" : "t\xFA";
          accentSlips2++;
        }
      }
      if (pron && !(prev2 && (PREPOSITIONS2.has(prev2) || /^(que|como|más|menos|y|o|ni)$/.test(prev2)))) {
        const nextIsVerbish = next && (loose || isFinite(next) || CLITICS3.has(next) || next === "no" || MOVABLE_ONE.has(next) || next.includes("_"));
        const prevIsVerb = prev2 && isFinite(prev2);
        if (nextIsVerbish || prevIsVerb) {
          pronouns.push(pron);
          const frame = prevIsVerb ? null : experiencerFrame(out, i, stops);
          if (frame) {
            const person = SUBJECT_PRONOUNS2[pron];
            const agrees = frame.readings.some((a) => a.person === person);
            if (!(agrees && ((_d = OWN_CLITIC[frame.clitic]) == null ? void 0 : _d.includes(person)))) {
              experiencer.push({ pron, mismatch: !agrees, like: frame.readings.some((a) => LIKE_VERBS.has(a.inf.replace(/se$/, ""))) });
            }
          }
          continue;
        }
      }
      kept.push(out[i]);
    }
    const advs = [];
    const rest = [];
    for (let i = 0; i < kept.length; i++) {
      const k = kept[i];
      const prev2 = (_e = kept[i - 1]) == null ? void 0 : _e.t;
      const movable = (MOVABLE_ONE.has(k.t) || k.t.includes("_")) && !(prev2 && (PREPOSITIONS2.has(prev2) || DETERMINERS.has(prev2)));
      if (movable) advs.push({ t: k.t, slot: rest.length, legal: false });
      else rest.push(k);
    }
    const vg = verbGroup(rest.map((r) => r.t));
    const legal = /* @__PURE__ */ new Set([0, rest.length]);
    if (vg) {
      legal.add(vg[0]);
      legal.add(vg[1]);
    }
    for (const a of advs) a.legal = legal.has(a.slot);
    return { toks: rest, pronouns, experiencer, advs, accentSlips: accentSlips2 };
  }
  var key = (c) => c.toks.map((t) => t.t).join(" ");
  var keyDeaccent = (c) => deaccent(key(c));
  var advKey = (c) => c.advs.map((a) => a.t).sort().join(" ");
  var WH2 = /* @__PURE__ */ new Set(["qu\xE9", "qui\xE9n", "qui\xE9nes", "d\xF3nde", "ad\xF3nde", "cu\xE1ndo", "c\xF3mo", "cu\xE1l", "cu\xE1les", "cu\xE1nto", "cu\xE1nta", "cu\xE1ntos", "cu\xE1ntas"]);
  var NOT_SUBJECT = /* @__PURE__ */ new Set([
    "aqu\xED",
    "all\xED",
    "ah\xED",
    "ac\xE1",
    "all\xE1",
    "as\xED",
    "bien",
    "mal",
    "muy",
    "m\xE1s",
    "menos",
    "tampoco",
    "nunca",
    "entonces",
    "pues",
    "oye",
    "mira",
    "s\xED",
    "no",
    "y",
    "o",
    "pero",
    "que",
    "si",
    "cuando",
    "como",
    "todo",
    "nada",
    "algo",
    "alguien",
    "nadie"
  ]);
  var cap1 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  function questionOrders(es) {
    var _a2, _b;
    const all = toToks(es);
    const q = all.findIndex((t) => t.pre.includes("\xBF"));
    if (q < 0) return [];
    const e = all.findIndex((t, i) => i >= q && t.post.includes("?"));
    if (e < 0 || e - q < 1) return [];
    const seg = all.slice(q, e + 1);
    const lw = seg.map((t) => t.core.toLowerCase());
    if (WH2.has(lw[0]) || PREPOSITIONS2.has(lw[0]) && WH2.has(lw[1])) return [];
    if (seg.some((t, i) => i > 0 && t.pre || i < seg.length - 1 && t.post)) return [];
    const capd = (i) => {
      var _a3, _b2;
      return /^\p{Lu}/u.test((_b2 = (_a3 = seg[i]) == null ? void 0 : _a3.core) != null ? _b2 : "");
    };
    const plain = (w) => !SUBJECT_PRONOUNS2[w] && !DETERMINERS.has(w) && !PREPOSITIONS2.has(w) && !CLITICS3.has(w) && !NOT_SUBJECT.has(w) && !MOVABLE_ONE.has(w) && !WH2.has(w);
    const nameMid = (i) => i > 0 && capd(i) && plain(lw[i]);
    const verbish = (i) => i < lw.length && (isFinite(lw[i]) || CLITICS3.has(lw[i]) || lw[i] === "no");
    let span = null;
    let group = null;
    let finite = -1;
    let s1 = -1;
    if (capd(0) && plain(lw[0]) && (!isFinite(lw[0]) || isFinite((_a2 = lw[1]) != null ? _a2 : ""))) {
      s1 = 1;
      while (s1 < 3 && nameMid(s1)) s1++;
    } else if (DETERMINERS.has(lw[0])) {
      for (let i = 2; i <= 3; i++) {
        if (verbish(i) && !verbish(i - 1)) {
          s1 = i;
          break;
        }
        if (PREPOSITIONS2.has(lw[i - 1]) || isFinite((_b = lw[i - 1]) != null ? _b : "")) break;
      }
    }
    if (s1 > 0 && verbish(s1)) {
      const vg = verbGroup(lw.slice(s1));
      if (vg && vg[0] === 0) {
        span = [0, s1];
        group = [s1, s1 + vg[1]];
        finite = s1 + finiteIndex(lw.slice(s1));
      }
    }
    if (!span && verbish(0)) {
      const vg = verbGroup(lw);
      const v = finiteIndex(lw);
      const third = v >= 0 && verbReadings(lw[v]).some((a) => a.person === "\xE9l/ella" || a.person === "ellos");
      if (vg && vg[0] === 0 && third) {
        for (let k = vg[1]; k < lw.length; k++) {
          if (!nameMid(k) || PREPOSITIONS2.has(lw[k - 1])) continue;
          let k2 = k + 1;
          while (k2 < lw.length && k2 - k < 3 && nameMid(k2)) k2++;
          span = [k, k2];
          group = vg;
          finite = v;
          break;
        }
      }
    }
    if (!span || !group || finite < 0) return [];
    const isName3 = (i) => i >= span[0] && i < span[1] && (i > 0 || capd(0)) && !DETERMINERS.has(lw[i]);
    const bare4 = seg.map((t, i) => ({ pre: "", core: i === 0 && !isName3(0) ? t.core.toLowerCase() : t.core, post: "" }));
    const subj = bare4.slice(span[0], span[1]);
    const rest = bare4.filter((_, i) => i < span[0] || i >= span[1]);
    const shift = (i) => i >= span[1] ? i - (span[1] - span[0]) : i;
    const rl = rest.map((t) => t.core.toLowerCase());
    const rg = verbGroup(rl);
    const slots = /* @__PURE__ */ new Set([0, shift(finite) + 1, rg ? rg[1] : shift(group[1] - 1) + 1, rest.length]);
    const here = span[0] === 0 ? 0 : shift(span[0]);
    const out = [];
    for (const at of slots) {
      if (at === here) continue;
      const ts = [...rest.slice(0, at), ...subj, ...rest.slice(at)].map((t) => ({ ...t }));
      if (q === 0 || /[.!?…]$/.test(all[q - 1].post)) ts[0].core = cap1(ts[0].core);
      ts[0].pre = seg[0].pre;
      ts[ts.length - 1].post = seg[seg.length - 1].post;
      const whole = [...all.slice(0, q), ...ts, ...all.slice(e + 1)];
      out.push(whole.map((t) => t.pre + t.core + t.post).join(" "));
    }
    return out;
  }

  // lib/match/accents.ts
  var DIACRITIC = [
    ["tu", "t\xFA"],
    ["el", "\xE9l"],
    ["mi", "m\xED"],
    ["si", "s\xED"],
    ["se", "s\xE9"],
    ["te", "t\xE9"],
    ["de", "d\xE9"],
    ["mas", "m\xE1s"],
    ["aun", "a\xFAn"],
    ["esta", "est\xE1"],
    ["estas", "est\xE1s"],
    ["este", "est\xE9"],
    ["papa", "pap\xE1"],
    ["mama", "mam\xE1"],
    ["hacia", "hac\xEDa"],
    ["seria", "ser\xEDa"],
    ["serias", "ser\xEDas"],
    ["sabia", "sab\xEDa"],
    ["sabias", "sab\xEDas"],
    ["ira", "ir\xE1"],
    ["amplia", "ampl\xEDa"],
    ["jugo", "jug\xF3"],
    ["costo", "cost\xF3"],
    ["cerro", "cerr\xF3"],
    ["tarde", "tard\xE9"],
    ["da\xF1o", "da\xF1\xF3"],
    ["clavo", "clav\xF3"],
    ["choque", "choqu\xE9"],
    ["enojo", "enoj\xF3"],
    ["insulto", "insult\xF3"],
    ["callo", "call\xF3"],
    ["empe\xF1o", "empe\xF1\xF3"],
    ["conformo", "conform\xF3"],
    ["aparte", "apart\xE9"],
    ["papas", "pap\xE1s"],
    ["tomate", "t\xF3mate"],
    ["carne", "carn\xE9"],
    ["parques", "parqu\xE9s"],
    ["perdida", "p\xE9rdida"],
    ["perdidas", "p\xE9rdidas"]
  ];
  var PAIRED = new Set(DIACRITIC.flat());
  var NOT_THE_VERB = /* @__PURE__ */ new Set(["c\xF3mo", "tom\xE1s", "fr\xEDo", "r\xEDo"]);
  var WORD = /\p{L}+/gu;
  function accentSlips(typed, expected) {
    var _a2, _b;
    const open = (_a2 = expected.match(WORD)) != null ? _a2 : [];
    const left = [];
    for (const w of (_b = typed.toLowerCase().match(WORD)) != null ? _b : []) {
      const i = open.findIndex((e) => e.toLowerCase() === w);
      if (i >= 0) open.splice(i, 1);
      else left.push(w);
    }
    const out = [];
    for (const t of left) {
      const i = open.findIndex((e) => deaccent(e.toLowerCase()) === deaccent(t));
      if (i >= 0) out.push({ typed: t, expected: open.splice(i, 1)[0] });
    }
    return out;
  }
  var bare3 = (s) => {
    var _a2;
    return deaccent(((_a2 = s.toLowerCase().match(WORD)) != null ? _a2 : []).join(" "));
  };
  function mendSlips(typed, expected, slips) {
    if (bare3(typed) === bare3(expected)) return expected;
    const left = [...slips];
    return typed.toLowerCase().replace(WORD, (w) => {
      const i = left.findIndex((s) => s.typed === w);
      return i < 0 ? w : left.splice(i, 1)[0].expected;
    });
  }
  function changesWord({ typed, expected }) {
    if (PAIRED.has(typed)) return true;
    return !NOT_THE_VERB.has(expected.toLowerCase()) && analyzeToken(typed).some((a) => a.accentExact && !a.clitics);
  }
  function forgiven(slips) {
    return slips.length && !slips.some(changesWord) ? accentNote(slips) : void 0;
  }
  function accentNote(slips) {
    const one = slips[0];
    if (slips.length === 1) return `Watch the accent on *${one.expected}*: you wrote *${one.typed}*.`;
    const names = slips.map((s) => `*${s.expected}*`);
    return `Watch the accents on ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}.`;
  }

  // lib/match/hints.ts
  var HINT_TEXT = {
    accents: "Check the accents.",
    "verb-ending": "Check the verb ending.",
    agreement: "Check the ending: it has to agree (masculine or feminine, one or more).",
    "word-order": "Right words, different order: check where each one goes.",
    "missing-word": "A word is missing.",
    pronoun: "Check the pronoun (lo, la, le\u2026): who or what does it stand for?",
    subject: "Check the subject: who is it about?",
    "ser-estar": "Ser or estar? Think again about which one fits.",
    "por-para": "Por or para? Check that little word.",
    spelling: "Check the spelling.",
    attach: "In a command, the pronoun joins the end of the verb.",
    empty: "Type your answer in Spanish.",
    fragment: "That's not the whole sentence yet. Say all of it.",
    experiencer: 'With verbs like gustar, the little word (me, te, le) already says who it is for. Leave the pronoun out, or start it with "a".',
    "experiencer-agree": "With gustar, the verb agrees with the thing you like: one or more than one?",
    mood: "Right verb. Is someone saying it's so, or is it only held up as an idea?",
    aspect: "Both are in the past. Was it going on, or did it happen?",
    contraction: '"A el" and "de el" join into one word in Spanish.',
    number: "Check the number against the English."
  };
  var NONFINITE_TEXT = {
    "to-inf": "Right verb, but this spot wants its dictionary form.",
    "to-finite": "Right verb, but here it needs an ending that says who is doing it.",
    "to-ger": "Right verb, but this spot wants the -ando or -iendo form.",
    "to-part": "Right verb, but this spot wants the -ado or -ido form."
  };
  var GERUND_ESTAR = "A verb ending in -ando or -iendo goes with estar, not ser.";
  var wrongWord = (a) => `We had a different word where you wrote "${a}".`;
  var lookAgain = (a) => `Look again at "${a}" and the words around it.`;
  var SMALL = /* @__PURE__ */ new Set([...ARTICLES2, ...PREPOSITIONS2, ...CLITICS3, "que", "no", "y", "o", "se"]);
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[m][n];
  }
  function align(a, b) {
    const m = a.length, n = b.length;
    const cost = (x, y) => x === y ? 0 : deaccent(x) === deaccent(y) ? 0.1 : 1;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i2 = 0; i2 <= m; i2++) d[i2][0] = i2;
    for (let j2 = 0; j2 <= n; j2++) d[0][j2] = j2;
    for (let i2 = 1; i2 <= m; i2++) for (let j2 = 1; j2 <= n; j2++) {
      d[i2][j2] = Math.min(d[i2 - 1][j2] + 1, d[i2][j2 - 1] + 1, d[i2 - 1][j2 - 1] + cost(a[i2 - 1], b[j2 - 1]));
    }
    const ops = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + cost(a[i - 1], b[j - 1])) {
        ops.push({ op: a[i - 1] === b[j - 1] ? "eq" : "sub", a: a[i - 1], b: b[j - 1], i: i - 1, j: j - 1 });
        i--;
        j--;
      } else if (j > 0 && d[i][j] === d[i][j - 1] + 1) {
        ops.push({ op: "del", b: b[j - 1], i, j: j - 1 });
        j--;
      } else {
        ops.push({ op: "ins", a: a[i - 1], i: i - 1, j });
        i--;
      }
    }
    return ops.reverse();
  }
  function distance(a, b) {
    return align(a, b).reduce((s, o) => s + (o.op === "eq" ? 0 : o.op === "sub" && deaccent(o.a) === deaccent(o.b) ? 0.1 : 1), 0);
  }
  var readings = (w) => analyzeToken(w).filter((a) => !a.clitics);
  var GENDER_WORD = { m: "masculine", f: "feminine" };
  var stem = (w) => deaccent(w).replace(/(os|as|es|o|a|e|s)$/, "");
  var lemma = (inf) => inf.replace(/se$/, "");
  var GROUP = new Map(TENSES.map((t) => [t.key, t.group]));
  var BASE = new Map(TENSES.map((t) => {
    var _a2;
    return [t.key, (_a2 = t.variantOf) != null ? _a2 : t.key];
  }));
  function formsOf(w) {
    const written = readings(w).filter((a) => a.accentExact);
    const all = (written.length ? written : readings(w)).filter((a) => a.target !== false);
    const plain = all.filter((a) => a.tense !== "imperativo" && a.tense !== "impneg");
    const out = (plain.length ? plain : all).map((a) => ({ lemma: lemma(a.inf), kind: "finite", tense: a.tense, person: a.person }));
    if (isInfinitive(w)) out.push({ lemma: lemma(w), kind: "inf" });
    const g = gerundOf(w);
    if (g) out.push({ lemma: lemma(g), kind: "ger" });
    const p = participleOf(w);
    if (p) out.push({ lemma: lemma(p), kind: "part" });
    return out;
  }
  var AGREE_VERBS = new Set([...EXPERIENCER].filter((v) => v !== "quedar"));
  var SHAPE_TO = { finite: "to-finite", inf: "to-inf", ger: "to-ger", part: "to-part" };
  var THIRD = /* @__PURE__ */ new Set(["\xE9l/ella", "ellos"]);
  function tenseDiff(a, b) {
    const ga = GROUP.get(a), gb = GROUP.get(b);
    if (BASE.get(a) === BASE.get(b) || ga === "imperative" || gb === "imperative") return "ending";
    if (ga === "subjunctive" !== (gb === "subjunctive")) return "mood";
    if (a === "preterito" && b === "imperfecto" || a === "imperfecto" && b === "preterito") return "aspect";
    return "tense";
  }
  function verbDiff(typed, want) {
    var _a2;
    const ta = formsOf(typed), tb = formsOf(want);
    const pairs = tb.flatMap((x) => ta.filter((y) => y.lemma === x.lemma).map((y) => [y, x]));
    const fin = pairs.filter(([y, x]) => y.kind === "finite" && x.kind === "finite");
    if (fin.length) {
      const who = fin.filter(([y, x]) => y.tense === x.tense && y.person !== x.person);
      if (who.length) return who.some(([y, x]) => AGREE_VERBS.has(x.lemma) && THIRD.has(y.person) && THIRD.has(x.person)) ? "agree" : "person";
      const kinds = fin.filter(([y, x]) => y.person === x.person).map(([y, x]) => tenseDiff(y.tense, x.tense));
      return (_a2 = ["mood", "aspect", "tense"].find((k) => kinds.includes(k))) != null ? _a2 : "ending";
    }
    const shape = pairs.find(([y, x]) => y.kind !== x.kind);
    return shape ? SHAPE_TO[shape[1].kind] : null;
  }
  var copula = (w) => {
    const r = readings(w);
    return r.some((x) => x.inf === "ser") ? "ser" : r.some((x) => x.inf === "estar") ? "estar" : null;
  };
  var DEFINITE = /* @__PURE__ */ new Set(["el", "la", "los", "las"]);
  function articleHint(a, b, noun) {
    if (DEFINITE.has(a) !== DEFINITE.has(b)) return 'Check the article: "the" (el, la) or "a" (un, una)?';
    const ga = nounGender("x", a), gb = nounGender("x", b);
    const gender = !!ga && !!gb && ga !== gb, number = /s$/.test(a) !== /s$/.test(b);
    if (gender && !number) return noun ? `Check the article: ${noun} is ${GENDER_WORD[gb]}.` : "Check the article: masculine or feminine?";
    if (number && !gender) return noun ? `Check the article: one ${noun.replace(/s$/, "")} or more than one?` : "Check the article: one or more than one?";
    return "Check the article: it has to match the noun.";
  }
  function relationHint(a, b, o = {}) {
    var _a2;
    if (ARTICLES2.has(a) && ARTICLES2.has(b) && o.nextTyped === o.next) return { kind: "article", hint: articleHint(a, b, o.next) };
    if (CLITICS3.has(a) && CLITICS3.has(b)) return { kind: "pronoun", hint: HINT_TEXT.pronoun };
    if (/^(por|para)$/.test(a) && /^(por|para)$/.test(b)) return { kind: "por-para", hint: HINT_TEXT["por-para"] };
    if (POSSESSIVES2.has(a) && POSSESSIVES2.has(b) || DEMONSTRATIVES2.has(a) && DEMONSTRATIVES2.has(b)) {
      return stem(a).slice(0, 5) === stem(b).slice(0, 5) ? { kind: "agreement", hint: HINT_TEXT.agreement } : { kind: "wrong-word", hint: wrongWord(a) };
    }
    const d = verbDiff(a, b);
    if (d) {
      const would = (d === "tense" || d === "mood") && ((_a2 = o.before) == null ? void 0 : _a2.slice(-3).includes("si")) ? formsOf(a).find((f) => f.kind === "finite" && (f.tense === "condicional" || f.tense === "futuro")) : void 0;
      if (would) return { kind: "mood", hint: `After "si", this verb does not take the ${would.tense === "condicional" ? "would" : "will"} form.` };
      if (d === "person") return o.gap ? { kind: "person", hint: "Right verb, but who is doing it?" } : { kind: "verb-ending", hint: "Check the verb ending: who is doing it?" };
      if (d === "tense") return o.gap ? { kind: "tense", hint: "Right verb, but when does it happen?" } : { kind: "verb-ending", hint: "Check the verb ending: when does it happen?" };
      if (d === "ending") return { kind: "verb-ending", hint: HINT_TEXT["verb-ending"] };
      if (d === "agree") return { kind: "experiencer-agree", hint: HINT_TEXT["experiencer-agree"] };
      if (d === "mood" || d === "aspect") return { kind: d, hint: HINT_TEXT[d] };
      return { kind: "nonfinite", hint: NONFINITE_TEXT[d] };
    }
    const ca = copula(a), cb = copula(b);
    if (ca && cb && ca !== cb) {
      const gerund2 = cb === "estar" && !!o.next && formsOf(o.next).some((f) => f.kind === "ger");
      return { kind: "ser-estar", hint: gerund2 ? GERUND_ESTAR : HINT_TEXT["ser-estar"] };
    }
    return null;
  }
  function isTypo(typed, want) {
    const x = deaccent(typed), y = deaccent(want);
    if (y.length < 4 || x === y) return false;
    const known = (w) => SMALL.has(w) || readings(w).some((a) => a.target !== false);
    if (known(typed) && known(want)) return false;
    if (isKnownForm2(typed.toLowerCase()) && levenshtein(x, y) >= 2) return false;
    return levenshtein(x, y) <= (y.length >= 7 ? 2 : 1);
  }
  function classifySub(input, i, expected, j, single) {
    const a = input[i], b = expected[j], at = j;
    if (/^\d/.test(a) && /^\d/.test(b)) return { kind: "number", hint: HINT_TEXT.number, at };
    const rel = relationHint(a, b, { next: expected[j + 1], nextTyped: input[i + 1], before: input.slice(Math.max(0, i - 3), i) });
    if (rel) return { kind: rel.kind, hint: rel.hint, at };
    if (!readings(a).length && !readings(b).length && stem(a) === stem(b) && stem(a).length >= 3) return { kind: "agreement", hint: HINT_TEXT.agreement, at };
    if (isTypo(a, b)) return { kind: "spelling", hint: HINT_TEXT.spelling, at };
    return single ? { kind: "wrong-word", hint: wrongWord(a), at } : { kind: "differs", hint: lookAgain(a), at };
  }
  function multisetWithin(sub, sup) {
    var _a2, _b;
    const left = /* @__PURE__ */ new Map();
    for (const w of sup) left.set(w, ((_a2 = left.get(w)) != null ? _a2 : 0) + 1);
    for (const w of sub) {
      const n = (_b = left.get(w)) != null ? _b : 0;
      if (!n) return false;
      left.set(w, n - 1);
    }
    return true;
  }
  function inOrder(sub, sup) {
    let j = 0;
    for (const w of sup) if (j < sub.length && sub[j] === w) j++;
    return j === sub.length;
  }
  var orderAt = (input, expected) => Math.max(0, input.findIndex((w, i) => w !== expected[i]));
  var count = (xs, w) => xs.filter((x) => x === w).length;
  function diagnose(input, expected) {
    var _a2, _b;
    if (!input.length) return { kind: "empty", hint: HINT_TEXT.empty, at: 0 };
    if (expected.length >= 3 && input.length < expected.length / 2) {
      const hits = input.filter((w) => expected.includes(w)).length;
      if (hits < expected.length / 2) return { kind: "fragment", hint: HINT_TEXT.fragment, at: 0 };
    }
    if (multisetWithin(input, expected) && (input.length === expected.length || !inOrder(input, expected))) {
      return { kind: "word-order", hint: HINT_TEXT["word-order"], at: orderAt(input, expected) };
    }
    for (let i = 0; i + 1 < input.length; i++) {
      const glued = deaccent(input[i] + input[i + 1]);
      const j = expected.findIndex((e) => deaccent(e) === glued);
      if (j >= 0 && CLITICS3.has(input[i + 1])) return { kind: "attach", hint: HINT_TEXT.attach, at: j };
    }
    for (let i = 0; i + 1 < input.length; i++) {
      const joined2 = input[i + 1] === "el" ? input[i] === "a" ? "al" : input[i] === "de" ? "del" : null : null;
      if (joined2 && count(expected, joined2) > count(input, joined2)) return { kind: "contraction", hint: HINT_TEXT.contraction, at: expected.indexOf(joined2) };
    }
    const ops = align(input, expected);
    const edits = ops.filter((o) => o.op !== "eq" && !(o.op === "sub" && deaccent(o.a) === deaccent(o.b)));
    if (!edits.length) {
      const acc = ops.find((o) => o.op === "sub");
      return { kind: "accents", hint: HINT_TEXT.accents, at: (_a2 = acc == null ? void 0 : acc.j) != null ? _a2 : 0 };
    }
    const first = edits[0];
    const dels = edits.filter((o) => o.op === "del"), inss = edits.filter((o) => o.op === "ins");
    if (!edits.some((o) => o.op === "sub") && dels.length === inss.length && multisetWithin(dels.map((o) => o.b), inss.map((o) => o.a))) {
      return { kind: "word-order", hint: HINT_TEXT["word-order"], at: first.j };
    }
    if (!inss.length && !edits.some((o) => o.op === "sub")) {
      return { kind: "missing-word", hint: SMALL.has(first.b) ? "A small word is missing." : HINT_TEXT["missing-word"], at: first.j };
    }
    if (!dels.length && !edits.some((o) => o.op === "sub")) return { kind: "extra-word", hint: `There's an extra word: "${first.a}".`, at: first.j };
    if (first.op === "sub") {
      const dg = classifySub(input, first.i, expected, first.j, edits.length === 1);
      if (dg.kind === "wrong-word" && count(expected, first.a) >= count(input, first.a)) return { kind: "word-order", hint: HINT_TEXT["word-order"], at: first.j };
      return dg;
    }
    return { kind: "differs", hint: lookAgain(first.op === "ins" ? first.a : (_b = input[first.i]) != null ? _b : input[first.i - 1]), at: first.j };
  }

  // lib/match/swaps.ts
  var FAMILY = {
    "clause-order": /(topic-fronting|word-order|discourse-structure|cleft|emphatic|argument-markers)/,
    "moved-phrase": /(topic-fronting|word-order|discourse-structure|cleft|emphatic|argument-markers)/,
    "future-ir-a": /(^|[:-])(future|ir-a)(-|$)/,
    "pret-perfecto": /(^|[:-])(preterite|perfecto|pret|narrative-pasts|spain-pasts)(-|$)/,
    "cond-ra": /(^|[:-])(conditional|softening|imperfect-subj|deber-modal|tense-modal-uses|si-hypothetical)(-|$)/,
    copula: /(^|[:-])(ser|estar)(-|$)/,
    "result-clause": /(conditional-perfect|si-past-unreal|conditional-advanced|pluperfect-subj)/,
    synonym: null,
    "ra-se": null,
    peninsular: null,
    register: null,
    gender: null
  };
  var RESULT_CLAUSE_NOTE = "Habr\xEDa and hubiera both work in the result clause.";
  function touches(swap, targets) {
    if (swap.kind === "synonym") return !!swap.lemma && !!(targets == null ? void 0 : targets.some((t) => t === `l:${swap.lemma}`));
    const family = FAMILY[swap.kind];
    if (!family) return false;
    return targets ? targets.some((t) => family.test(t)) : swap.kind !== "clause-order" && swap.kind !== "moved-phrase" && swap.kind !== "copula";
  }
  function lineOf(s) {
    if (s.kind === "result-clause") return RESULT_CLAUSE_NOTE;
    if (s.kind === "clause-order" || s.kind === "moved-phrase") return "That order works too. This card was practising the other one.";
    return `"${s.to}" works too. This card was practising "${s.from}".`;
  }
  function swapNote(swaps, targets) {
    const lines = (swaps != null ? swaps : []).filter((s) => touches(s, targets)).map(lineOf);
    const unique = lines.filter((l, i) => lines.indexOf(l) === i);
    return unique.length ? unique.join(" ") : void 0;
  }
  var key2 = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim();
  function changed(a, b) {
    const x = key2(a).split(" "), y = key2(b).split(" ");
    let s = 0;
    while (s < x.length && s < y.length && x[s] === y[s]) s++;
    let e = 0;
    while (e < x.length - s && e < y.length - s && x[x.length - 1 - e] === y[y.length - 1 - e]) e++;
    return { from: x.slice(s, x.length - e).join(" "), to: y.slice(s, y.length - e).join(" ") };
  }

  // lib/match/tense-swaps.ts
  var PAST_TELLING = /* @__PURE__ */ new Set(["preterito", "imperfecto", "condicional", "impsubj", "impsubjse"]);
  var clone = (ts) => ts.map((t) => ({ ...t }));
  function clausesOf(es, en) {
    const ts = toToks(es);
    return finiteCandidates(ts).flatMap((cand, n) => {
      const c = parseClause(es, n === 0 ? en : void 0, { allowMany: true, index: cand.index });
      return c ? [c] : [];
    });
  }
  var EN_FUTURE = /\b(will|going to|shall)\b/;
  var EN_NOT_PLAIN_FUTURE = /\b(probably|must|might|may|maybe|perhaps|wonder|guess|suppose|bet|let us|about to|should)\b/;
  var futureEnglish = (en) => {
    const w = enWords(en).join(" ");
    return EN_FUTURE.test(w) && !EN_NOT_PLAIN_FUTURE.test(w);
  };
  var bareInf = (inf) => inf.replace(/se$/, "");
  function futureToIrA(c) {
    if (c.choice.tense !== "futuro" || c.participle >= 0) return null;
    const ir = form("ir", "presente", c.choice.person);
    return ir ? render(replaceCore(c.toks, c.verb, `${ir} a ${bareInf(c.choice.inf)}`)) : null;
  }
  function irAToFuture(c) {
    var _a2, _b;
    if (c.choice.inf !== "ir" || c.choice.tense !== "presente" || c.reflexive || !goingTo(c)) return null;
    const after = c.toks[c.verb + 2];
    const split = splitEnclitic(low(after));
    if (split && c.proclitics.length) return null;
    const base = split ? split.base : low(after);
    const fut = (_a2 = form(base, "futuro", c.choice.person)) != null ? _a2 : verbByInf(base) ? null : form(`${base}se`, "futuro", c.choice.person);
    if (!fut) return null;
    let ts = clone(c.toks);
    ts[c.verb] = { ...ts[c.verb], post: after.post };
    ts = replaceCore(ts, c.verb, fut);
    ts.splice(c.verb + 1, 2);
    const clitics = (_b = split == null ? void 0 : split.clitics) != null ? _b : [];
    if (clitics.length) {
      const { pre, core } = ts[c.verb];
      const capital = /^\p{Lu}/u.test(core);
      ts[c.verb] = { ...ts[c.verb], pre: "", core: capital ? core[0].toLowerCase() + core.slice(1) : core };
      clitics.forEach((cl, k) => {
        ts = insertTok(ts, c.verb + k, cl);
      });
      const lead = ts[c.verb];
      ts[c.verb] = { ...lead, pre: pre + lead.pre, core: capital ? lead.core[0].toUpperCase() + lead.core.slice(1) : lead.core };
    }
    return render(ts);
  }
  function futureVariants(es, en) {
    if (!futureEnglish(en)) return [];
    const out = [];
    for (const c of clausesOf(es, en)) {
      for (const to of [futureToIrA(c), irAToFuture(c)]) {
        if (to) out.push({ es: to, swap: { kind: "future-ir-a", ...changed(es, to) } });
      }
    }
    for (const swap of [futureToIrA, irAToFuture]) {
      let now = es, n = 0;
      const steps = [];
      for (let again = true; again && n < 3; n++) {
        again = false;
        for (const c of clausesOf(now, en)) {
          const to = swap(c);
          if (to) {
            steps.push(changed(now, to));
            now = to;
            again = true;
            break;
          }
        }
      }
      if (steps.length > 1 && !out.some((o) => o.es === now)) {
        out.push({ es: now, swap: { kind: "future-ir-a", from: steps.map((x) => x.from).join(", "), to: steps.map((x) => x.to).join(", ") } });
      }
    }
    return out;
  }
  var PAST_APART = /^(ayer|anoche|anteayer|antier|pasado|pasada|pasados|pasadas|hace|cuando|entonces|luego|después|antes|primero|finalmente|mientras|siempre|niño|niña|pequeño|pequeña|lunes|martes|miércoles|jueves|viernes|sábado|domingo|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|aquel|aquella|aquellos|aquellas)$/;
  var THAT_TIME = /^(esa|ese|esos|esas)$/;
  var A_TIME = /^(noche|día|tarde|mañana|vez|semana|mes|año|verano|invierno|época|tiempo|momento|días|noches|años|meses)$/;
  var CONTINUING = /^(ser|estar|tener|vivir|trabajar|llevar|quedar|quedarse|seguir|estudiar|esperar|durar|permanecer|haber|saber|conocer|querer|crecer|aprender)$/;
  var UP_TO_NOW = /^(hoy|ya|todavía|aún|últimamente|recientemente)$/;
  var NEVER = /^(nunca|jamás)$/;
  var THIS_PERIOD = /^(esta|este)$/;
  var PARTICIPLE = "(?:been|gone|done|seen|eaten|taken|given|known|written|spoken|made|had|heard|said|told|found|met|bought|brought|thought|left|lost|paid|read|sent|sold|felt|kept|run|come|begun|broken|chosen|driven|fallen|forgotten|shown|thrown|won|put|set|cut|[a-z]+ed)";
  var EN_PERFECT = new RegExp(`(?<!(?:would|could|should|might|must|may|to|not|n't) )\\b(?:have|has)(?: not)?(?: [a-z]+)?(?: (?:already|just|never|ever|yet|finally))? ${PARTICIPLE}\\b`);
  var EN_CONTINUES = /\b(for|since|lately|recently|so far|these days|always|still|all (day|week|month|year|my life)|used to|while|when)\b/;
  function sameEvent(toks, en, verb, toPerfecto) {
    const e = enWords(en).join(" ");
    if (EN_CONTINUES.test(e) || /\b(yesterday|last|ago|then|before|after)\b/.test(e)) return false;
    const ws = toks.map((t) => low(t));
    if (ws.some((w, i) => {
      var _a2;
      return PAST_APART.test(w) || /^(19|20)\d\d$/.test(w) || w === "a" && ws[i + 1] === "las" || THAT_TIME.test(w) && A_TIME.test((_a2 = ws[i + 1]) != null ? _a2 : "");
    })) return false;
    const verbs = finiteCandidates(toks).map((c) => c.index);
    const near = ws.some((w, i) => {
      var _a2;
      if (Math.abs(i - verb) > 3 || (i < verb ? toks.slice(i, verb).some((t) => /[,;:]/.test(t.post)) : toks.slice(verb, i).some((t) => /[,;:]/.test(t.post)))) return false;
      if (i > verb && verbs.some((v) => v > verb && v <= i + 1)) return false;
      return UP_TO_NOW.test(w) || w === "alguna" && ws[i + 1] === "vez" || !toPerfecto && NEVER.test(w) || THIS_PERIOD.test(w) && /^(mañana|tarde|noche|semana|mes|año|momento)$/.test((_a2 = ws[i + 1]) != null ? _a2 : "");
    });
    return near || EN_PERFECT.test(e);
  }
  function participleFor(inf) {
    var _a2, _b;
    const v = (_b = (_a2 = verbByInf(inf)) != null ? _a2 : verbByInf(bareInf(inf))) != null ? _b : verbByInf(`${inf}se`);
    try {
      return v ? participle(v) : null;
    } catch {
      return null;
    }
  }
  function preteriteToPerfecto(c) {
    if (c.choice.tense !== "preterito" || c.participle >= 0 || c.choice.inf === "haber") return null;
    if (new Set(verbReadings(low(c.toks[c.verb])).filter((a) => a.tense === "preterito").map((a) => bareInf(a.inf))).size > 1) return null;
    const he = form("haber", "presente", c.choice.person);
    const part = participleFor(c.choice.inf);
    return he && part ? render(replaceCore(c.toks, c.verb, `${he} ${part}`)) : null;
  }
  var neverNear = (toks, verb) => toks.some((t, i) => NEVER.test(low(t)) && Math.abs(i - verb) <= 3);
  function perfectoToPreterite(c) {
    if (c.choice.inf !== "haber" || c.choice.tense !== "presente" || c.participle !== c.verb + 1) return null;
    const inf = participleOf(low(c.toks[c.participle]));
    const pret = inf && (!CONTINUING.test(bareInf(inf)) || neverNear(c.toks, c.verb)) ? form(inf, "preterito", c.choice.person) : null;
    if (!pret) return null;
    let ts = clone(c.toks);
    ts[c.verb] = { ...ts[c.verb], post: ts[c.participle].post };
    ts = replaceCore(ts, c.verb, pret);
    ts.splice(c.participle, 1);
    return render(ts);
  }
  function perfectoVariants(es, en) {
    const toks = toToks(es);
    if (finiteCandidates(toks).filter((c) => c.analyses.some((a) => PAST_TELLING.has(a.tense))).length > 1) return [];
    if (toks.some((t) => {
      var _a2;
      return /^haber(se|me|te|lo|la|le|nos|los|las|les)*$/.test(low(t)) || ((_a2 = splitEnclitic(low(t))) == null ? void 0 : _a2.base) === "haber";
    })) return [];
    const out = [];
    for (const c of clausesOf(es, en)) {
      const toPerfecto = preteriteToPerfecto(c);
      const toPreterite = perfectoToPreterite(c);
      if (toPerfecto && sameEvent(toks, en, c.verb, true)) out.push({ es: toPerfecto, swap: { kind: "pret-perfecto", ...changed(es, toPerfecto) } });
      if (toPreterite && sameEvent(toks, en, c.verb, false)) out.push({ es: toPreterite, swap: { kind: "pret-perfecto", ...changed(es, toPreterite) } });
    }
    return out;
  }
  var OPEN_ADJECTIVE = /^(feliz|felices|casad[oa]s?|solter[oa]s?)$/;
  var NOW_WORD = /^(hoy|ahora|ya|aquí|acá|ahí|allí|allá|mañana|anoche|ayer|cuando|mientras|porque|pero)$/;
  var INTENSIFIER = /^(muy|tan|bastante|demasiado|realmente|súper)$/;
  function copulaVariants(es) {
    const ts = toToks(es);
    const out = [];
    ts.forEach((tok, i) => {
      const readings2 = verbReadings(low(tok)).filter((r) => (r.inf === "ser" || r.inf === "estar") && ["presente", "imperfecto", "futuro"].includes(r.tense));
      if (!readings2.length) return;
      const k = INTENSIFIER.test(low(ts[i + 1])) ? i + 2 : i + 1;
      if (!OPEN_ADJECTIVE.test(low(ts[k]))) return;
      if (k < ts.length - 1 && !ts[k].post) return;
      if (ts.some((t) => NOW_WORD.test(low(t)))) return;
      const made = /* @__PURE__ */ new Set();
      for (const r of readings2) {
        const f = PERSONS.includes(r.person) ? form(r.inf === "ser" ? "estar" : "ser", r.tense, r.person) : null;
        if (f && f !== low(tok)) made.add(render(replaceCore(ts, i, f)));
      }
      for (const to of made) out.push({ es: to, swap: { kind: "copula", ...changed(es, to) } });
    });
    return out;
  }

  // lib/match/reorder.ts
  var STOP = /[.!?…]+$/;
  var ENDING = /[.!?…,;]+$/;
  var clone2 = (ts) => ts.map((t) => ({ ...t }));
  var cap2 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  function oneStatement(ts) {
    return ts.length >= 3 && ts.every((t, i) => !/[¿¡]/.test(t.pre) && (i === ts.length - 1 || !/[.!?…:;]/.test(t.post)));
  }
  function hasVerb(ts) {
    return finiteCandidates(ts).length > 0 || ts.some((t) => analyzeToken(low(t)).some((a) => a.target && a.accentExact && a.tense === "imperativo"));
  }
  var PLACE_NAME = /* @__PURE__ */ new Set([
    "bogot\xE1",
    "medell\xEDn",
    "toronto",
    "cali",
    "candelaria",
    "cartagena",
    "colombia",
    "chapinero",
    "taganga",
    "boyac\xE1",
    "canad\xE1",
    "monserrate",
    "madrid",
    "caracas",
    "barranquilla",
    "paloquemao",
    "miami",
    "panam\xE1",
    "huila",
    "espa\xF1a",
    "zipaquir\xE1",
    "tunja",
    "m\xE9xico",
    "usaqu\xE9n",
    "antioquia",
    "pasto",
    "lima",
    "salento",
    "honda",
    "quito",
    "jap\xF3n",
    "soacha",
    "ci\xE9naga",
    "sudam\xE9rica",
    "am\xE9rica",
    "caribe",
    "santander",
    "cundinamarca",
    "popay\xE1n",
    "c\xFAcuta",
    "bucaramanga",
    "manizales",
    "pereira"
  ]);
  var CAST = /^(vale|rosa|mariana|simón|tomás|hernando|altamira|yesid|joaquín|fredy|gloria|marta|beatriz|lucía|camila|jhon|ricardo|ana|clara|luz|pilar|jaime|pedro|laura|inés|andrés|teresa|luis|sofía|pablo|cecilia|eduardo|valentina|clemencia|pacho|pancho|victorino|mono|burra|esquina)$/;
  function lowerFirst(t) {
    const l = t.core.toLowerCase();
    const word = closedClass2(l) || isKnownForm2(l) || verbReadings(l).length > 0 || /^(si|cuando|aunque|nadie|lindo|solo)$/.test(l);
    return /^\p{Lu}/u.test(t.core) && word && !CAST.test(l) && !PLACE_NAME.has(l) ? { ...t, core: l } : t;
  }
  var capFirst = (t) => ({ ...t, core: cap2(t.core) });
  function joined(first, second, stop, comma) {
    const a = clone2(first), b = clone2(second);
    a[a.length - 1].post = a[a.length - 1].post.replace(ENDING, "") + (comma ? "," : "");
    b[b.length - 1].post = b[b.length - 1].post.replace(ENDING, "") + stop;
    return render([capFirst(a[0]), ...a.slice(1), lowerFirst(b[0]), ...b.slice(1)]);
  }
  var commaIn = (ts) => ts.slice(0, -1).some((t) => t.post.includes(","));
  var CLAUSE = /^(si|cuando|aunque)$/;
  var NOT_BEFORE = /^(y|o|e|u|ni|pero|sino|que|como|porque|aun|solo|sólo|apenas|casi|por|de|desde|hasta|para|hace|mucho|cada|todo|todas|todos|tal|incluso|justo|justamente|precisamente|exactamente|especialmente|menos|excepto|salvo|es|fue|era|son|eran|fueron|será|sería|sea|fuera)$/;
  var WHETHER = /^(saber|preguntar|decir|dudar|ver|averiguar|depender|importar|avisar|comprobar|confirmar|mirar|fijar|contar|imaginar|recordar|acordar|olvidar|ignorar|entender|parecer|adivinar|asegurar|revisar|chequear|checar|consultar|querer|quedar|resolver|establecer|aclarar|determinar|decidir|discutir|plantear|cuestionar|evaluar|analizar|investigar|examinar|verificar|reconocer|notar|descubrir|explicar|demostrar|enterar|mostrar|indicar|probar|medir|calcular|esperar)$/;
  var WHETHER_NOUN = /^(idea|duda|pregunta|cuestión|incógnita|problema|misterio|razón|señal|prueba|manera)$/;
  function asksWhether(before) {
    return before.some((w) => {
      return WHETHER_NOUN.test(w) || WHETHER.test(w.replace(/(se|me|te|lo|la|le|nos|los|las|les)+$/, "")) || analyzeToken(w).some((a) => a.accentExact && WHETHER.test(a.inf.replace(/se$/, "")));
    });
  }
  function clauseOrderVariants(es, toks) {
    var _a2, _b;
    if (/\n/.test(es) || !oneStatement(toks)) return [];
    const stop = (_b = (_a2 = toks[toks.length - 1].post.match(STOP)) == null ? void 0 : _a2[0]) != null ? _b : "";
    if (CLAUSE.test(low(toks[0]))) {
      if (low(toks[0]) === "si" && /^(bien|no|es|acaso)$/.test(low(toks[1]))) return [];
      const k = toks.findIndex((t, i) => i > 0 && i < toks.length - 1 && t.post.includes(",") && hasVerb(toks.slice(0, i + 1)));
      if (k < 0) return [];
      const sub2 = toks.slice(0, k + 1), main2 = toks.slice(k + 1);
      if (!hasVerb(main2) || commaIn(main2) || /^(y|e|o|u|pero|sino|que|porque|entonces|pues|así|ni)$/.test(low(main2[0]))) return [];
      return [joined(main2, sub2, stop, false)];
    }
    const p = toks.findIndex((t, i) => i > 0 && CLAUSE.test(low(t)));
    if (p < 1) return [];
    const main = toks.slice(0, p), sub = toks.slice(p);
    if (!hasVerb(sub) || commaIn(main) || commaIn(sub) || finiteCandidates(main).length !== 1) return [];
    if (/^(fue|es|era|será|sería)$/.test(low(main[0])) && main.length <= 3 && /^(entonces|ayer|hoy|ahora|ahí|allí|aquí|allá|así|anoche|en)$/.test(low(main[1]))) return [];
    if (main.some((t) => {
      var _a3;
      return /^haber/.test(low(t)) && (low(t) === "haber" || ((_a3 = splitEnclitic(low(t))) == null ? void 0 : _a3.base) === "haber");
    })) return [];
    if (NOT_BEFORE.test(low(main[main.length - 1])) || low(sub[0]) !== "aunque" && asksWhether(main.map(low)) || low(sub[0]) === "si" && /^(bien|no|es|acaso)$/.test(low(sub[1]))) return [];
    return [joined(sub, main, stop, true)];
  }
  var NUMBER = /^(\d+|un|una|unos|unas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|cuarenta|cincuenta|sesenta|cien|mil|varios|varias|muchos|muchas|pocos|pocas)$/;
  var TIME_UNIT = /^(segundos?|minutos?|horas?|días?|semanas?|mes|meses|años?|siglos?|décadas?|momento|rato|ratos)$/;
  var NOT_LOCATIVE = /^(poner|ponerse|meter|dejar|colocar|guardar|echar|tirar|sentarse|instalar|ubicar|esconder|subir|ser|estar|quedar|quedarse|pensar|confiar|creer|consistir|tardar|insistir|convertir|convertirse|entrar|participar|fijarse|interesarse|soñar|especializarse|basarse|apoyarse)$/;
  var SUBORDINATING = /^(que|porque|si|cuando|aunque|mientras|donde|quien|quienes|como|para|y|e|o|u|pero|sino)$/;
  var PLACE = /* @__PURE__ */ new Set([
    "casa",
    "caf\xE9",
    "cafeter\xEDa",
    "oficina",
    "ciudad",
    "parque",
    "tienda",
    "banco",
    "calle",
    "hotel",
    "restaurante",
    "plaza",
    "barrio",
    "centro",
    "mercado",
    "estaci\xF3n",
    "universidad",
    "colegio",
    "escuela",
    "hospital",
    "aeropuerto",
    "biblioteca",
    "iglesia",
    "cocina",
    "sala",
    "cuarto",
    "habitaci\xF3n",
    "ba\xF1o",
    "jard\xEDn",
    "piso",
    "edificio",
    "pa\xEDs",
    "pueblo",
    "finca",
    "playa",
    "monta\xF1a",
    "panader\xEDa",
    "farmacia",
    "supermercado",
    "teatro",
    "cine",
    "museo",
    "gimnasio"
  ]);
  var BARE_PLACE = /* @__PURE__ */ new Set(["casa"]);
  var DET = /^(el|la|los|las|mi|tu|su|nuestro|nuestra|este|esta|ese|esa|un|una)$/;
  var isName2 = (t) => !!t && /^\p{Lu}/u.test(t.core);
  var NOT_BEFORE_PHRASE = /^(que|como|y|o|e|u|ni|pero|sino|más|menos|de|desde|hasta|entre|también|solo|sólo|solamente|únicamente|incluso|aun|tanto|todo)$/;
  var INNER_OPENER = /^(de|en|por|sin|con|para|al)$/;
  var isNonfinite = (w) => isInfinitive(w) || !!gerundOf(w) || !!participleOf(w) || !!splitEnclitic(w);
  function placeLength(ts, at) {
    if (low(ts[at]) !== "en") return 0;
    let n = at + 1;
    if (isName2(ts[n])) {
      while (isName2(ts[n + 1]) && !ts[n].post) n++;
      return ts.slice(at + 1, n + 1).some((t) => PLACE_NAME.has(low(t))) ? n + 1 - at : 0;
    }
    if (DET.test(low(ts[n]))) n++;
    const noun = low(ts[n]);
    if (!PLACE.has(noun) || n === at + 1 && !BARE_PLACE.has(noun)) return 0;
    n++;
    if (low(ts[n]) === "de" && !ts[n - 1].post) {
      let m = n + 1;
      if (DET.test(low(ts[m]))) m++;
      if (ts[m] && (isName2(ts[m]) && PLACE_NAME.has(low(ts[m])) || PLACE.has(low(ts[m])))) n = m + 1;
    }
    return n - at;
  }
  function movedPhraseVariants(es, toks) {
    var _a2, _b;
    if (/\n/.test(es) || !oneStatement(toks)) return [];
    const stop = (_b = (_a2 = toks[toks.length - 1].post.match(STOP)) == null ? void 0 : _a2[0]) != null ? _b : "";
    const out = [];
    const hacePhrase = (at) => low(toks[at]) === "hace" && NUMBER.test(low(toks[at + 1])) && TIME_UNIT.test(low(toks[at + 2])) && low(toks[at + 3]) !== "que" && !(at > 0 && /^(desde|por|de|para|hasta|hace)$/.test(low(toks[at - 1])));
    const phraseAt2 = (at) => hacePhrase(at) ? 3 : placeLength(toks, at);
    const oneClause = (rest, place) => {
      const verb = finiteCandidates(rest);
      if (verb.length !== 1 || commaIn(rest) || rest.some((t) => SUBORDINATING.test(low(t)) || low(t) === "hay")) return false;
      const bare4 = verb[0].index === rest.length - 1 && !/mente$/.test(low(rest[verb[0].index - 1]));
      if (bare4 && (place || verb[0].analyses.some((a) => a.inf === "ser" || a.inf === "estar"))) return false;
      if (!place) return true;
      if (verb[0].analyses.some((a) => NOT_LOCATIVE.test(a.inf.replace(/se$/, "")))) return false;
      if (rest.some((t, i) => i > 0 && INNER_OPENER.test(low(rest[i - 1])) && isNonfinite(low(t)))) return false;
      return !rest.slice(-4).some((t) => low(t) === "de");
    };
    const front = phraseAt2(0);
    if (front && front < toks.length - 1) {
      const rest = toks.slice(front);
      if (oneClause(rest, low(toks[0]) === "en")) out.push(joined(rest, toks.slice(0, front), stop, false));
    }
    for (let at = toks.length - 2; at >= Math.max(1, toks.length - 6); at--) {
      const len = phraseAt2(at);
      if (!len || at + len !== toks.length) continue;
      const rest = toks.slice(0, at);
      if (!NOT_BEFORE_PHRASE.test(low(rest[rest.length - 1])) && oneClause(rest, low(toks[at]) === "en")) out.push(joined(toks.slice(at), rest, stop, true));
      break;
    }
    return out;
  }

  // lib/match/traps/rules.ts
  var SUBJUNCTIVE = /* @__PURE__ */ new Set(["presubj", "impsubj", "impsubjse", "pluscsubj", "pluscsubjse", "perfsubj"]);
  var NOT_INDICATIVE = /* @__PURE__ */ new Set([...SUBJUNCTIVE, "imperativo", "impneg"]);
  var forms = (w) => w ? verbReadings(w) : [];
  var lemmaOf = (w) => forms(w).map((r) => r.inf.replace(/se$/, ""));
  var lemmaAny = (w) => {
    if (!w) return [];
    const g = gerundOf(w);
    return [...lemmaOf(w), ...g ? [g.replace(/se$/, "")] : [], ...isInfinitive(w) ? [w.replace(/se$/, "")] : []];
  };
  var firstEdit = (c) => c.edits[0];
  var subEdit = (c) => {
    var _a2;
    return ((_a2 = c.edits[0]) == null ? void 0 : _a2.op) === "sub" ? c.edits[0] : void 0;
  };
  var is = (w, re) => !!w && re.test(w);
  var SER = /^(soy|eres|es|somos|son|era|eras|éramos|eran|fue|fui|fueron|será|serán|sería|sea|sean)$/;
  var ESTAR = /^(estoy|estás|está|estamos|están|estaba|estabas|estábamos|estaban|estuvo|estuve|estuvieron|estará|estarán|estaría|esté|estén)$/;
  var WANTING = /* @__PURE__ */ new Set([
    "querer",
    "desear",
    "preferir",
    "necesitar",
    "pedir",
    "exigir",
    "permitir",
    "prohibir",
    "sugerir",
    "recomendar",
    "aconsejar",
    "esperar",
    "dudar",
    "lamentar",
    "ordenar",
    "mandar",
    "rogar",
    "suplicar",
    "impedir",
    "evitar",
    "proponer"
  ]);
  var REACTING = /* @__PURE__ */ new Set(["alegrar", "molestar", "gustar", "encantar", "importar", "preocupar", "sorprender", "extra\xF1ar", "fastidiar", "enojar", "asustar"]);
  var JUDGING = /^(importante|necesario|mejor|bueno|malo|raro|imposible|increíble|normal|lógico|preferible|conveniente|urgente|fundamental|vital|justo|natural)$/;
  var FRAMES = ["para que", "antes de que", "sin que", "a menos que", "con tal de que", "en caso de que", "a fin de que", "ojal\xE1"];
  var BELIEVING = /* @__PURE__ */ new Set(["creer", "pensar", "parecer"]);
  function triggered(b, j) {
    const here = b.slice(Math.max(0, j - 5), j).join(" ");
    if (FRAMES.some((f) => here === f || here.endsWith(` ${f}`) || here.endsWith(`${f} `) || here.endsWith(` ${f} que`))) return true;
    let q = -1;
    for (let k = j - 1; k >= Math.max(0, j - 4); k--) {
      if (b[k] === "que") {
        q = k;
        break;
      }
      if (forms(b[k]).some((r) => !NOT_INDICATIVE.has(r.tense))) return false;
    }
    if (q < 1) return false;
    const opener = b[q - 1], before = b[q - 2];
    const lemmas = lemmaOf(opener);
    if (lemmas.includes("dudar") && before === "no") return false;
    if (lemmas.some((l) => WANTING.has(l))) return true;
    if (lemmas.some((l) => REACTING.has(l)) && is(before, /^(me|te|le|nos|les)$/)) return true;
    if (is(opener, JUDGING) && is(before, SER)) return true;
    if (is(before, /^(no)$/) && lemmas.some((l) => BELIEVING.has(l))) return true;
    if (is(opener, /^(cierto|verdad|seguro)$/) && is(before, SER) && b[q - 3] === "no") return true;
    return false;
  }
  var ideaForm = (w) => {
    const rs = forms(w);
    return rs.some((x) => SUBJUNCTIVE.has(x.tense)) && !rs.some((x) => !NOT_INDICATIVE.has(x.tense));
  };
  var mood = (c) => {
    const e = subEdit(c);
    if (c.dg.kind !== "mood" || !e) return null;
    const mb = forms(e.b), mi = forms(e.a);
    const sameVerb = mb.some((x) => mi.some((y) => y.inf === x.inf));
    const modelIdea = ideaForm(e.b);
    if (mi.some((y) => y.tense === "futuro") && c.b.slice(0, e.j).some((w) => lemmaOf(w).includes("esperar"))) return null;
    const learnerFact = mi.some((y) => !NOT_INDICATIVE.has(y.tense)) && !mi.some((y) => SUBJUNCTIVE.has(y.tense));
    if (sameVerb && modelIdea && learnerFact && triggered(c.b, e.j)) return { rule: "mood-hard", at: e.j };
    return null;
  };
  var MOOD_SLOT = /^(que|cuando|ojalá|aunque|si|apenas|mientras|hasta|donde|quien|como|tal|sino)$/;
  function moodSlot(b, j) {
    return triggered(b, j) || b.slice(Math.max(0, j - 5), j).some((w) => MOOD_SLOT.test(w));
  }
  var EN_IMPERFECT = /\b(was|were) \w+ing\b|\bused to\b|\bwould (always|often|usually|sometimes|every)\b|\bwhile\b|\bevery (day|morning|evening|week|summer|sunday|saturday)\b|\bas a (child|kid|boy|girl)\b|\bwhen i was (a|little|young|small|\d)\b|\bwhen (he|she) was (a|little|young|small)\b|\bin those days\b/;
  var EN_PRETERITE = /\bsuddenly\b|\bfor (two|three|four|five|six|seven|eight|nine|ten|\d+) (years|months|weeks|days|hours)\b|\bonce(?! the\b)\b|\b(twice|three times|four times|five times)\b|\bfound out\b|\bmet\b|\bat that moment\b|\bthe next (day|morning)\b|\bfinally\b|\bsuddenly\b|\blast (night|week|year|month)\b/;
  var ES_PRETERITE = /^(ayer|anoche|anteayer|repente|la_semana_pasada|el_año_pasado)$/;
  var ES_IMPERFECT = /^(todos_los_días|todas_las_semanas|a_veces|mientras)$/;
  var STATIVE = /* @__PURE__ */ new Set([
    "ser",
    "estar",
    "tener",
    "haber",
    "querer",
    "saber",
    "conocer",
    "poder",
    "deber",
    "parecer",
    "pensar",
    "creer",
    "sentir",
    "sentirse",
    "vivir",
    "gustar",
    "necesitar",
    "esperar",
    "desear",
    "preferir",
    "entender",
    "significar",
    "costar",
    "caber",
    "existir",
    "quedar",
    "quedarse",
    "quedarse",
    "pertenecer",
    "faltar"
  ]);
  var aspect = (c) => {
    var _a2;
    const e = subEdit(c);
    if (c.dg.kind !== "aspect" || !e) return null;
    const mb = forms(e.b);
    const modelTense = (_a2 = mb.find((r) => r.tense === "preterito" || r.tense === "imperfecto")) == null ? void 0 : _a2.tense;
    if (!modelTense) return null;
    const others = c.b.flatMap((w, i) => i === e.j ? [] : forms(w).filter((r) => r.tense === "preterito" || r.tense === "imperfecto").map((r) => r.tense));
    if (others.includes(modelTense) && others.some((t) => t !== modelTense)) return null;
    const lock = EN_IMPERFECT.test(c.en) ? "imperfecto" : EN_PRETERITE.test(c.en) ? "preterito" : null;
    if (lock && lock === modelTense) return { rule: "aspect-locked", at: e.j };
    if (lock) return null;
    const action = mb.some((r) => !STATIVE.has(r.inf.replace(/se$/, "")));
    const marked = modelTense === "preterito" ? c.b.some((w) => ES_PRETERITE.test(w)) : c.b.some((w) => ES_IMPERFECT.test(w));
    return action && marked ? { rule: "aspect-locked", at: e.j } : null;
  };
  var FLIP = [
    { stem: /^aburrid[oa]s?$/, estar: /\bbored\b/, ser: /\bboring\b/, thing: true },
    { stem: /^list[oa]s?$/, estar: /\bready\b/, ser: /\b(clever|smart|sharp)\b/ },
    { stem: /^cansad[oa]s?$/, estar: /\btired\b/, ser: /\b(tiring|tiresome)\b/, thing: true },
    { stem: /^malo?s?$|^mala?s?$/, estar: /\b(sick|ill|off)\b/, ser: /\b(evil|nasty|wicked)\b/ },
    { stem: /^abiert[oa]s?$|^cerrad[oa]s?$/, estar: /\b(open|closed|shut)\b/, ser: /\b(open|closed)-?minded\b/ },
    { stem: /^orgullos[oa]s?$/, estar: /\bproud of\b/, ser: /\b(proud|arrogant|vain)\b(?! of)/ },
    { stem: /^verde$|^verdes$/, estar: /\b(unripe|green)\b.*\bripe\b/, ser: /\bgreen\b/ }
  ];
  var PLACES = /^(en|dentro|fuera)$/;
  var EVENT_NOUN = /^(fiesta|reunión|concierto|boda|evento|partido|clase|misa|cumpleaños|cena|almuerzo|cita|ceremonia|conferencia|entrevista|funeral|feria|desfile|obra)s?$/;
  var serEstar = (c) => {
    const e = subEdit(c);
    if (c.dg.kind !== "ser-estar" || !e) return null;
    const a = e.a, b = e.b;
    const learnerSer = SER.test(a), modelEstar = ESTAR.test(b);
    const next = c.b[e.j + 1];
    const adj = c.b.slice(e.j + 1, e.j + 4).find((w) => FLIP.some((f) => f.stem.test(w)));
    if (adj) {
      const f = FLIP.find((x) => x.stem.test(adj));
      if (modelEstar && f.estar.test(c.en) && !f.ser.test(c.en)) return { rule: "ser-estar-locked", at: e.j };
      const person = !f.thing || /^(estoy|estás|estamos|estaba|estuve)$/.test(a);
      if (SER.test(b) && person && f.ser.test(c.en) && !f.estar.test(c.en)) return { rule: "ser-estar-locked", at: e.j };
    }
    if (learnerSer && modelEstar && c.a[e.i + 1] && gerundOf(c.a[e.i + 1])) return { rule: "ser-estar-locked", at: e.j, text: c.dg.hint };
    if (learnerSer && modelEstar && PLACES.test(next != null ? next : "") && !c.b.some((w) => EVENT_NOUN.test(w))) return { rule: "ser-estar-locked", at: e.j, text: "Where something is takes estar." };
    return null;
  };
  var NAMED_KIND = { "experiencer-agree": "exp-agree", experiencer: "exp-subject" };
  var coordinated = (b, a) => [b, a].some((ws) => ws.includes("y") || ws.includes("e"));
  var PERCEPTION = /* @__PURE__ */ new Set(["ver", "o\xEDr", "escuchar", "sentir", "mirar", "observar", "notar", "dejar"]);
  var nonfinite = (c) => {
    if (c.dg.kind !== "nonfinite") return null;
    const e = subEdit(c);
    if (!e) return null;
    if (c.b.slice(0, e.j).some((w) => lemmaOf(w).some((l) => PERCEPTION.has(l)))) return null;
    const wantsInf = /dictionary form/.test(c.dg.hint), wantsEnding = /ending that says who/.test(c.dg.hint);
    return wantsInf ? { rule: "inf-need", at: e.j } : wantsEnding ? { rule: "finite-need", at: e.j } : null;
  };
  var siTense = (c) => {
    if (c.dg.kind !== "mood" || !/^After "si"/.test(c.dg.hint)) return null;
    const si = c.b.lastIndexOf("si", c.dg.at);
    return si >= 0 && asksWhether(c.b.slice(0, si)) ? null : { rule: "si-tense", at: c.dg.at };
  };
  var REFLEXIVE_ONLY = /* @__PURE__ */ new Set(["llamarse", "acostarse", "ducharse", "casarse", "mudarse", "divertirse", "preocuparse", "quejarse", "arrepentirse", "atreverse", "equivocarse", "enterarse", "portarse", "acordarse"]);
  var seDrop = (c) => {
    const e = firstEdit(c);
    if ((e == null ? void 0 : e.op) !== "del" || !is(e.b, /^(me|te|se|nos)$/)) return null;
    const verb = c.b[e.j + 1];
    return forms(verb).some((r) => REFLEXIVE_ONLY.has(r.inf)) && !forms(verb).some((r) => !/se$/.test(r.inf) && r.tense !== "imperativo") ? { rule: "se-drop", at: e.j } : null;
  };
  var PAIRS = [
    { id: "saber-conocer", text: "Know is two words in Spanish: saber for facts and for things you can do, conocer for people and places.", a: /^(saber|sé|sabes|sabe|sabemos|saben|sabía|supe|sabré)$/, b: /^(conocer|conozco|conoces|conoce|conocemos|conocen|conocía|conocí|conoceré)$/ },
    { id: "pedir-preguntar", text: "Pedir asks for something. Preguntar asks a question.", a: /^(pedir|pido|pides|pide|pedimos|piden|pedí|pidió|pedía)$/, b: /^(preguntar|pregunto|preguntas|pregunta|preguntamos|preguntan|pregunté|preguntó|preguntaba)$/ },
    { id: "llevar-traer", text: "Llevar takes it away from here. Traer brings it here.", a: /^(llevar|llevo|llevas|lleva|llevamos|llevan|llevé|llevó)$/, b: /^(traer|traigo|traes|trae|traemos|traen|traje|trajo|traía)$/ },
    { id: "hay-estar", text: "Hay says that something exists. Est\xE1 says where something you already know about is.", a: /^hay$/, b: /^(está|están)$/ },
    { id: "tiempo-vez-hora", text: "English has one word for time. Spanish has tiempo, vez (one time, another time) and hora (what the clock says).", a: /^(tiempo|tiempos)$/, b: /^(vez|veces|hora|horas)$/ }
  ];
  var CLAUSE_NEXT = /^(que|si|qué|quién|quiénes|cómo|dónde|cuándo|cuánto|cuánta|cuántos|cuántas|cuál|cuáles|por)$/;
  function provable(id, e, c) {
    var _a2;
    const next = c.b[e.j + 1];
    if (id === "saber-conocer") {
      if (PAIRS[0].a.test(e.b)) return next === void 0 || CLAUSE_NEXT.test(next) || isInfinitive(next);
      return next === "a" || next === "al";
    }
    if (id === "llevar-traer") {
      if (PAIRS[2].a.test(e.b)) return /\b(take|takes|took|taking|taken)\b/.test(c.en);
      return /^(me|nos)$/.test((_a2 = c.b[e.j - 1]) != null ? _a2 : "");
    }
    if (id === "tiempo-vez-hora") return !(is(c.b[e.j - 1], SER) && (next === void 0 || next === "de" || next === "que"));
    return true;
  }
  var lexicalPair = (c) => {
    const e = subEdit(c);
    if (!e || c.edits.length !== 1) return null;
    const hit = PAIRS.find((p) => p.a.test(e.a) && p.b.test(e.b) || p.b.test(e.a) && p.a.test(e.b));
    return hit && provable(hit.id, e, c) ? { rule: `lexical-pair:${hit.id}`, at: e.j, text: hit.text } : null;
  };
  var CAST2 = /^(vale|rosa|mariana|simón|tomás|hernando|altamira|yesid|joaquín|fredy|gloria|marta|beatriz|lucía|camila|ricardo|ana|jaime|pedro|laura|inés|andrés)$/;
  var KIN = /^(mamá|papá|madre|padre|hermano|hermana|abuelo|abuela|amigo|amiga|tío|tía|primo|prima|hijo|hija|esposo|esposa|novio|novia|vecino|vecina|jefe|jefa|profesor|profesora|doctor|doctora|señor|señora|niño|niña)$/;
  var persA = (c) => {
    const e = firstEdit(c);
    if ((e == null ? void 0 : e.op) !== "del" || e.b !== "a") return null;
    const x = c.b[e.j + 1], y = c.b[e.j + 2];
    const person = CAST2.test(x != null ? x : "") || KIN.test(x != null ? x : "") || is(x, /^(mi|tu|su|nuestro|nuestra|el|la)$/) && KIN.test(y != null ? y : "");
    return person && forms(c.b[e.j - 1]).length > 0 ? { rule: "pers-a", at: e.j } : null;
  };
  var JOB = /^(profesor|profesora|médico|médica|doctor|doctora|ingeniero|ingeniera|abogado|abogada|estudiante|cocinero|cocinera|mesero|mesera|panadero|panadera|taxista|periodista|arquitecto|arquitecta|enfermero|enfermera|músico|música|escritor|escritora|colombiano|colombiana|canadiense|mexicano|mexicana|español|española)$/;
  var LIKING = /^(gusta|gustan|encanta|encantan|fascina|interesa|odio|amo|adoro|detesto|encanto)$/;
  var article = (c) => {
    var _a2, _b, _c;
    const e = firstEdit(c);
    if ((e == null ? void 0 : e.op) === "ins" && is(e.a, /^(un|una)$/) && is(c.a[e.i - 1], SER) && JOB.test((_a2 = c.a[e.i + 1]) != null ? _a2 : "") && !c.a.slice(e.i + 2).length) return { rule: "article-job", at: e.j, text: "A job takes no un or una here." };
    if ((e == null ? void 0 : e.op) === "del" && is(e.b, /^(el|la|los|las)$/) && (LIKING.test((_b = c.b[e.j - 1]) != null ? _b : "") || LIKING.test((_c = c.b[e.j - 2]) != null ? _c : "") && is(c.b[e.j - 1], /^(mucho|más|menos|tanto|bastante)$/))) return { rule: "article-general", at: e.j, text: "Things in general take el, la, los or las." };
    return null;
  };
  var noPrep = (c) => {
    const e = firstEdit(c);
    if ((e == null ? void 0 : e.op) !== "ins" || !is(e.a, /^(para|por|a)$/)) return null;
    const next = c.a[e.i + 1];
    const object = is(next, /^(el|la|los|las|mi|tu|su|un|una|nuestro|nuestra)$/);
    if (e.a !== "a" && lemmaAny(c.a[e.i - 1]).some((l) => l === "buscar" || l === "esperar") && object) return { rule: "no-prep", at: e.j };
    return null;
  };
  var TENER_NOUN = /^(hambre|sed|frío|calor|miedo|sueño|prisa|razón|vergüenza|suerte|ganas|años|\d+)$/;
  var beTener = (c) => {
    var _a2;
    const e = subEdit(c);
    if (!e || c.edits.length > 2) return null;
    const nounNext = TENER_NOUN.test((_a2 = c.b[e.j + 1]) != null ? _a2 : "") && c.a[e.i + 1] === c.b[e.j + 1];
    return forms(e.b).some((r) => r.inf === "tener") && forms(e.a).some((r) => r.inf === "estar" || r.inf === "ser") && nounNext ? { rule: "be-tener", at: e.j } : null;
  };
  var weather = (c) => {
    const e = subEdit(c);
    return e && e.a === "es" && e.b === "hace" && is(c.b[e.j + 1], /^(frío|calor|sol|viento|fresco)$/) ? { rule: "weather", at: e.j } : null;
  };
  var cuandoFuture = (c) => {
    const e = subEdit(c);
    if (!e || c.b[e.j - 1] !== "cuando" || c.a[e.i - 1] !== "cuando") return null;
    return forms(e.a).some((r) => r.tense === "futuro") && forms(e.b).some((r) => r.tense === "presubj") ? { rule: "cuando-future", at: e.j } : null;
  };
  var NEG_PAIR = { nada: "algo", nadie: "alguien", nunca: "siempre" };
  var negConcord = (c) => {
    const e = subEdit(c);
    if (!e || NEG_PAIR[e.b] !== e.a) return null;
    const no = c.b.indexOf("no");
    return no >= 0 && no < e.j && !c.b.slice(no, e.j).some((w) => w === "que" || w === "si" || w === "cuando" || w === "sin") ? { rule: "neg-concord", at: e.j } : null;
  };
  var seLo = (c) => {
    const e = subEdit(c);
    return e && is(e.a, /^(le|les)$/) && e.b === "se" && is(c.b[e.j + 1], /^(lo|la|los|las)$/) && c.a[e.i + 1] === c.b[e.j + 1] ? { rule: "se-lo", at: e.j } : null;
  };
  var PREP_END = /^(con|de|sobre|para|por|en|a|desde|hasta|sin|contra)$/;
  var strand = (c) => {
    var _a2, _b;
    const last = c.a[c.a.length - 1];
    const firstB = (_a2 = c.b[0]) != null ? _a2 : "", secondB = (_b = c.b[1]) != null ? _b : "";
    const question = /^(quién|quiénes|qué|cuál|cuáles|dónde|cuándo|cómo|cuánto)$/;
    if (last !== firstB || !PREP_END.test(last != null ? last : "") || !question.test(secondB)) return null;
    return c.b.every((w) => w !== "en" || c.b.indexOf(w) === 0) ? { rule: "strand", at: 0 } : null;
  };
  var MUY_NOUN = /^(hambre|sed|frío|calor|miedo|sueño|prisa|razón|suerte|dinero|gente|tiempo|trabajo|cuidado)$/;
  var muyNoun = (c) => {
    var _a2;
    const e = subEdit(c);
    return e && e.a === "muy" && is(e.b, /^(mucho|mucha|muchos|muchas)$/) && MUY_NOUN.test((_a2 = c.b[e.j + 1]) != null ? _a2 : "") ? { rule: "muy-noun", at: e.j } : null;
  };
  var masNum = (c) => {
    var _a2;
    const e = subEdit(c);
    return e && e.a === "que" && e.b === "de" && is(c.b[e.j - 1], /^(más|menos)$/) && /^\d/.test((_a2 = c.b[e.j + 1]) != null ? _a2 : "") ? { rule: "mas-num", at: e.j } : null;
  };
  var gustoYo = (c) => {
    const e = c.edits.slice(0, 2).find((x) => x.op === "sub");
    if (!e) return null;
    const mine = forms(e.a).filter((r) => EXPERIENCER.has(r.inf.replace(/se$/, "")) && r.tense !== "imperativo" && ["yo", "t\xFA", "nosotros"].includes(r.person));
    const theirs = forms(e.b).filter((r) => EXPERIENCER.has(r.inf.replace(/se$/, "")) && (r.person === "\xE9l/ella" || r.person === "ellos"));
    const clitic = is(c.b[e.j - 1], /^(me|te|le|les|nos)$/) || is(c.b[e.j - 2], /^(me|te|le|les|nos)$/);
    return clitic && mine.length && !forms(e.a).some((r) => r.person === "\xE9l/ella" || r.person === "ellos") && theirs.length && mine.some((m) => theirs.some((t) => t.inf === m.inf && t.tense === m.tense)) ? { rule: "exp-subject", at: e.j, text: "With gustar, the thing you like does the pleasing: it is me gusta, not yo gusto." } : null;
  };
  var VERB_PREP = {
    depender: "de",
    so\u00F1ar: "con",
    casar: "con",
    enamorar: "de",
    aprender: "a",
    acabar: "de",
    dejar: "de",
    pensar: "en",
    ayudar: "a",
    empezar: "a",
    comenzar: "a",
    volver: "a",
    ir: "a"
  };
  var SMALL_WORD = /^(a|de|con|en|por|para|sobre|desde|hacia)$/;
  var BARE_INFINITIVE = /* @__PURE__ */ new Set(["querer", "poder", "preferir", "desear", "necesitar", "saber", "soler"]);
  var verbPrep = (c) => {
    var _a2, _b, _c, _d, _e;
    const e = firstEdit(c);
    if (!e) return null;
    const prevB = c.b[(e.op === "ins" ? e.j : e.j) - 1];
    const need = (w) => lemmaAny(w).map((l) => VERB_PREP[l.replace(/se$/, "").replace(/^casar$/, "casar")]).find(Boolean);
    const text = "This verb goes with its own little word.";
    if (e.op === "del" && SMALL_WORD.test((_a2 = e.b) != null ? _a2 : "") && need(prevB) === e.b && !is(c.a[e.i], /^(al|del)$/) && !(e.b === "en" && isInfinitive((_b = c.b[e.j + 1]) != null ? _b : ""))) return { rule: "verb-prep", at: e.j, text };
    if (e.op === "sub" && SMALL_WORD.test((_c = e.a) != null ? _c : "") && SMALL_WORD.test((_d = e.b) != null ? _d : "") && need(prevB) === e.b && e.a !== e.b && !is(e.a, /^(para|hacia|hasta|por)$/)) return { rule: "verb-prep", at: e.j, text };
    if (e.op === "ins" && is(e.a, /^(a|de|para|por|en)$/) && lemmaAny(c.a[e.i - 1]).some((l) => BARE_INFINITIVE.has(l)) && isInfinitive((_e = c.a[e.i + 1]) != null ? _e : "")) {
      return { rule: "verb-prep", at: e.j, text: "That verb goes straight onto the dictionary form, with no little word between." };
    }
    return null;
  };
  var FALSE_FRIENDS = [
    { word: /^embarazad[oa]s?$/, cue: /\bembarrass/ },
    { word: /^excitad[oa]s?$/, cue: /\bexcited\b/ },
    { word: /^librería$/, cue: /\blibrary\b/ },
    { word: /^actualmente$/, cue: /\b(actually|in fact|really)\b/ },
    { word: /^suceso$/, cue: /\bsuccess\b/ },
    { word: /^sensible$/, cue: /\bsensible\b/ },
    { word: /^atend(í|er|ió|emos|ieron|iste)$/, cue: /\battend/ },
    { word: /^realic(é|e)$/, cue: /\brealis|realiz/ },
    { word: /^éxito$/, cue: /\b(exit|way out)\b/ }
  ];
  var falseFriend = (c) => {
    const e = subEdit(c);
    const f = e && FALSE_FRIENDS.find((x) => x.word.test(e.a));
    return e && f && f.cue.test(c.en) && !f.word.test(e.b) ? { rule: "false-friend", at: e.j } : null;
  };
  var usedTo = (c) => {
    const e = firstEdit(c);
    if (!e || !/\bused to\b/.test(c.en)) return null;
    const at = e.op === "ins" ? e.i : e.i;
    const word = c.a[at];
    return word && lemmaOf(word).includes("usar") && !c.b.some((w) => lemmaOf(w).includes("usar")) ? { rule: "used-to", at: e.j } : null;
  };
  var couldWould = (c) => {
    var _a2;
    const e = subEdit(c);
    if (!e) return null;
    const mb = forms(e.b), mi = forms(e.a);
    const same = mb.some((x) => mi.some((y) => y.inf === x.inf));
    if (!same || !mi.some((y) => y.tense === "condicional") || mi.some((y) => y.tense !== "condicional" && y.tense !== "imperativo")) return null;
    if (/\bif\b/.test(c.en)) return null;
    if (mb.some((x) => x.tense === "imperfecto") && /\b(when i was|as a (child|kid)|every|always|often|used)\b/.test(c.en) && /\bwould\b/.test(c.en)) {
      return { rule: "would-habit", at: e.j, text: "A habit in the past is the going-on past, not the would form." };
    }
    if (mb.some((x) => x.tense === "preterito" && x.inf === "poder") && /\b(couldn't|could not|could)\b/.test(c.en) && !/\bwould\b/.test(c.en) && !c.en.includes("?") && !/^haber/.test((_a2 = c.b[e.j + 1]) != null ? _a2 : "")) {
      return { rule: "could", at: e.j, text: "A could that happened, or did not, is the past form, not the would form." };
    }
    return null;
  };
  var waits = (why) => ({ ships: false, waits: why, text: "" });
  var RULES = [
    { n: 1, id: "mood-hard", tier: "assert", ships: true, text: "Right verb. Nothing is said as fact after this opening, so it needs the form that holds an idea up." },
    { n: 2, id: "aspect-locked", tier: "assert", ships: true, text: "Both are in the past. Was it going on, or did it happen?" },
    { n: 3, id: "exp-agree", tier: "assert", ships: true, text: "With gustar, the verb agrees with the thing you like: one or more than one?" },
    { n: 4, id: "exp-subject", tier: "assert", ships: true, text: 'With verbs like gustar, the little word (me, te, le) already says who it is for. Leave the pronoun out, or start it with "a".' },
    { n: 5, id: "ser-estar-locked", tier: "assert", ships: true, text: "This one changes meaning with ser and estar. Check which one the English means." },
    { n: 6, id: "inf-need", tier: "assert", ships: true, text: "Right verb, but this spot wants its dictionary form." },
    { n: 7, id: "finite-need", tier: "assert", ships: true, text: "Right verb, but here it needs an ending that says who is doing it." },
    { n: 8, id: "se-drop", tier: "assert", ships: true, text: "This verb needs its little word (me, te, se, nos)." },
    { n: 9, id: "si-tense", tier: "assert", ships: true, text: 'After "si", this verb does not take the would or will form.' },
    {
      n: 10,
      id: "lexical-pair",
      tier: "assert",
      ships: true,
      text: "English has one word here and Spanish has two. Check the meaning of each.",
      ids: PAIRS.map((p) => `lexical-pair:${p.id}`)
    },
    { n: 11, id: "verb-prep", tier: "assert", ships: true, text: "This verb goes with its own little word." },
    { n: 12, id: "lo-le", tier: "assert", ...waits("three dialect facts in one rule: ayudar, usted, and le for a man (O8)") },
    { n: 13, id: "pers-a", tier: "assert", ships: true, text: "A person right after the verb takes a little a first." },
    { n: 14, id: "por-para-closed", tier: "assert", ...waits("closed frames of por and para, none yet checked against the bank") },
    { n: 15, id: "article", tier: "assert", ships: true, text: "Check the article: a job takes none, and a thing in general takes el, la, los or las.", ids: ["article-job", "article-general"] },
    { n: 16, id: "no-prep", tier: "assert", ships: true, text: 'This verb already means "look for" or "wait for". It takes no little word after it.' },
    { n: 17, id: "be-tener", tier: "assert", ships: true, text: "For hunger, cold, fear and age Spanish has tener, not ser or estar.", ids: ["be-tener", "age"] },
    { n: 18, id: "weather", tier: "assert", ships: true, text: "The weather is made with hacer here, not ser." },
    { n: 19, id: "poss-body", tier: "assert", ...waits("needs the co-referent clitic as a condition; the first cut was not above 95%") },
    { n: 20, id: "for-time", tier: "assert", ...waits("the diff against desde hace is too big to align; an English gate on have been plus for") },
    { n: 21, id: "cuando-future", tier: "assert", ships: true, text: 'After "cuando", a time that has not come is not the future.' },
    { n: 22, id: "neg-concord", tier: "assert", ships: true, text: 'A "no" before the verb goes with nada, nadie and nunca.' },
    { n: 23, id: "se-agree", tier: "assert", ...waits("not with a plus a person; the first cut was not above 95%") },
    { n: 24, id: "could", tier: "assert", ships: true, text: "A could that happened, or did not, is the past form, not the would form." },
    { n: 25, id: "false-friend", tier: "assert", ships: true, text: "That word looks like the English one but means something else." },
    { n: 26, id: "se-lo", tier: "assert", ships: true, text: "Le or les in front of lo, la, los or las turns into se." },
    { n: 27, id: "would", tier: "assert", ids: ["would-habit", "would-refusal"], ships: true, text: "A habit in the past is the going-on past, not the would form." },
    { n: 28, id: "used-to", tier: "assert", ships: true, text: "Usar doesn't work like that. The verb for used to is soler, or the going-on past." },
    { n: 29, id: "strand", tier: "assert", ships: true, text: "In Spanish the little word goes in front of the question word." },
    { n: 30, id: "muy-noun", tier: "assert", ships: true, text: "Before a noun it is mucho, mucha, muchos or muchas, not muy." },
    { n: 31, id: "mas-num", tier: "assert", ships: true, text: "Before a number it is m\xE1s de or menos de." },
    { n: 32, id: "prog-plan", tier: "assert", ...waits("needs a future time word in the model") },
    { n: 33, id: "gerund-adj", tier: "assert", ...waits("not after perception verbs; the first cut was not above 95%") },
    { n: 34, id: "aspect-open", tier: "ask", ships: true, text: "We used the other past here: was it going on, or did it happen?" },
    { n: 35, id: "mood-open", tier: "ask", ships: true, text: "Here, is someone saying it's so, or is it only held up as an idea?" },
    { n: 36, id: "por-para-open", tier: "ask", ships: true, text: "We used the other one here: por or para?", ids: ["por-para-open", "ser-estar-open"] },
    { n: 37, id: "event-estar", tier: "note", ships: true, text: "You'll hear est\xE1 en for an event as well. The course uses es en." },
    { n: 38, id: "passive-calque", tier: "note", ships: true, text: "That is right, though people say it with se far more than with ser." },
    { n: 39, id: "se-me-optional", tier: "note", ships: true, text: "That is right. Se me olvid\xF3 is the way it happens to you; olvid\xE9 is the way you did it." },
    { n: 40, id: "pronoun-overuse", tier: "note", ...waits("needs the learner's level, which the checker does not have; from B1, and never a failure") },
    { n: 41, id: "motion", tier: "silent", ...waits("Corri\xF3 a la calle is a calque and corrieron hasta la esquina is right: teach it, do not detect it yet") }
  ];
  var DETECTORS = [
    mood,
    aspect,
    serEstar,
    nonfinite,
    siTense,
    gustoYo,
    seDrop,
    lexicalPair,
    verbPrep,
    persA,
    article,
    noPrep,
    beTener,
    weather,
    cuandoFuture,
    negConcord,
    falseFriend,
    couldWould,
    seLo,
    usedTo,
    strand,
    muyNoun,
    masNum
  ];
  function namedKind(kind, c) {
    if (kind === "experiencer-agree" && c && coordinated(c.b, c.a)) return void 0;
    return NAMED_KIND[kind];
  }
  var byId = /* @__PURE__ */ new Map();
  var _a;
  for (const r of RULES) {
    byId.set(r.id, r);
    for (const x of (_a = r.ids) != null ? _a : []) byId.set(x, r);
  }
  function ruleOf(id) {
    var _a2;
    return (_a2 = byId.get(id)) != null ? _a2 : byId.get(id.split(":")[0]);
  }
  function englishAspect(en) {
    const e = en.toLowerCase();
    return EN_IMPERFECT.test(e) ? "imperfecto" : EN_PRETERITE.test(e) ? "preterito" : null;
  }

  // lib/match/traps/pitfalls.ts
  var pitfallKey = (text) => {
    const c = canon(text);
    return key(c) && [key(c), [...c.pronouns].sort().join(" "), advKey(c)].join("|");
  };
  var table = /* @__PURE__ */ new Map();
  function pitfallFor(nodes, input) {
    var _a2;
    if (!(nodes == null ? void 0 : nodes.length) || !table.size) return void 0;
    const k = pitfallKey(input);
    if (!k) return void 0;
    for (const node of nodes) {
      const why = (_a2 = table.get(node)) == null ? void 0 : _a2.get(k);
      if (why) return { node, why };
    }
    return void 0;
  }

  // lib/match/traps/index.ts
  var textOf = (id) => RULES.find((r) => r.id === id).text;
  var ASK_TEXT = {
    aspect: textOf("aspect-open"),
    mood: textOf("mood-open"),
    "por-para": textOf("por-para-open"),
    "ser-estar": "We used the other one here: ser or estar?"
  };
  var SOFT_PITFALL = /^(not wrong|it is understood|\S+ is correct but)/i;
  function diagnose2(t) {
    var _a2, _b, _c;
    const { dg } = t;
    const known = pitfallFor(t.nodes, t.input);
    if (known && SOFT_PITFALL.test(known.why)) return { tier: "ask", kind: "pitfall", hint: known.why, at: dg.at };
    if (known) return { tier: "assert", rule: "pitfall", kind: "pitfall", hint: known.why, at: dg.at };
    const ops = align(t.a, t.b);
    const edits = ops.filter((o) => o.op !== "eq" && !(o.op === "sub" && deaccent(o.a) === deaccent(o.b)));
    const ctx = { a: t.a, b: t.b, ops, edits, dg, en: t.en.toLowerCase().replace(/[’‘]/g, "'") };
    for (const detect2 of edits.length > 2 ? [] : DETECTORS) {
      const hit = detect2(ctx);
      if (hit) return { tier: "assert", rule: hit.rule, kind: dg.kind, hint: (_c = (_b = hit.text) != null ? _b : (_a2 = ruleOf(hit.rule)) == null ? void 0 : _a2.text) != null ? _c : dg.hint, at: hit.at };
    }
    const named = edits.length > 2 ? void 0 : namedKind(dg.kind, t);
    if (named) return { tier: "assert", rule: named, kind: dg.kind, hint: dg.hint, at: dg.at };
    if (dg.kind === "mood") {
      const e = edits[0];
      if ((e == null ? void 0 : e.op) === "sub" && !moodSlot(t.b, e.j)) return { tier: "silent", kind: "verb-ending", hint: "Check the verb ending: who is doing it?", at: dg.at };
    }
    const ask = ASK_TEXT[dg.kind];
    if (ask) return { tier: "ask", kind: dg.kind, hint: ask, at: dg.at };
    return { tier: "silent", kind: dg.kind, hint: dg.hint, at: dg.at };
  }
  function gapTrap(hint, ctx) {
    var _a2, _b, _c;
    if (!hint) return void 0;
    const { kind } = hint;
    if (kind === "mood") {
      const before = (_a2 = ctx.before) != null ? _a2 : [];
      const answer = ctx.answer.toLowerCase();
      return ideaForm(answer) && triggered([...before, answer], before.length) ? { tier: "assert", rule: "mood-hard", kind, hint: textOf("mood-hard") } : { tier: "ask", kind, hint: ASK_TEXT.mood };
    }
    if (kind === "aspect") {
      const lock = englishAspect((_b = ctx.en) != null ? _b : "");
      const rs = verbReadings(ctx.answer.toLowerCase());
      const ans = rs.some((r) => r.tense === "presente") ? void 0 : (_c = rs.find((r) => r.tense === "preterito" || r.tense === "imperfecto")) == null ? void 0 : _c.tense;
      return lock && ans === lock ? { tier: "assert", rule: "aspect-locked", kind, hint: textOf("aspect-locked") } : { tier: "ask", kind, hint: ASK_TEXT.aspect };
    }
    if (kind === "ser-estar" || kind === "por-para") return { tier: "ask", kind, hint: ASK_TEXT[kind] };
    return { tier: "silent", kind, hint: hint.hint };
  }
  var PASSIVE_VERBS = /* @__PURE__ */ new Set(["vender", "construir", "publicar", "firmar", "escribir", "aprobar", "fundar", "descubrir", "celebrar", "resolver", "arreglar", "enviar", "pagar", "cobrar", "prohibir", "permitir"]);
  var SER_FORM = { presente: ["es", "son"], preterito: ["fue", "fueron"], imperfecto: ["era", "eran"], futuro: ["ser\xE1", "ser\xE1n"] };
  var DET2 = /^(el|la|los|las)$/;
  var cap3 = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
  var OPENS_CLAUSE = /^(que|cuando|si|aunque|porque|pues|y|e|pero)$/;
  var AFTER_PHRASE = /^(por|en|con|a|antes|después|hace|ayer|hoy|sin|durante)$/;
  function passiveOf(ts) {
    var _a2;
    const w = ts.map(low);
    for (let k = 0; k < w.length; k++) {
      const front = DET2.test(w[k]) && w[k + 2] === "se";
      const back = w[k] === "se" && DET2.test((_a2 = w[k + 2]) != null ? _a2 : "");
      if (!front && !back) continue;
      if (ts.slice(k, k + 3).some((t) => t.post)) continue;
      if (k > 0 && !ts[k - 1].post && !OPENS_CLAUSE.test(w[k - 1])) continue;
      if (back && w[k + 4] !== void 0 && !ts[k + 3].post && !AFTER_PHRASE.test(w[k + 4])) continue;
      const [det, noun, verb] = front ? [w[k], w[k + 1], w[k + 3]] : [w[k + 2], w[k + 3], w[k + 1]];
      const reading = verbReadings(verb != null ? verb : "").find((r) => PASSIVE_VERBS.has(r.inf) && r.tense in SER_FORM && (r.person === "\xE9l/ella" || r.person === "ellos"));
      const plural2 = /^(los|las)$/.test(det);
      const gender = noun && !(det === "el" && /^(a|á|ha|há)/.test(noun)) ? nounGender(noun, det) : null;
      if (!reading || !gender || reading.person === "ellos" !== plural2) continue;
      const part = participleFor(reading.inf);
      const agreed = part && (gender === "f" ? otherGender(part) : part);
      if (!agreed) continue;
      const tense = reading.tense;
      const last = ts[k + 3];
      const lead = ts[k].core;
      const head = ts.slice(0, k).map((t) => ({ ...t }));
      const piece = [
        { pre: ts[k].pre, core: /^\p{Lu}/u.test(lead) ? cap3(det) : det, post: "" },
        { pre: "", core: noun, post: "" },
        { pre: "", core: SER_FORM[tense][plural2 ? 1 : 0], post: "" },
        { pre: "", core: plural2 ? pluralize(agreed) : agreed, post: last.post }
      ];
      return render([...head, ...piece, ...ts.slice(k + 4)]);
    }
    return null;
  }
  function noteVariants(es) {
    var _a2;
    const out = [];
    const ts = toToks(es);
    const w = ts.map(low);
    const e = w.findIndex((x, k) => x === "es" && w[k + 1] === "en");
    const about = e > 0 && w.slice(0, e).some((x) => EVENT_NOUN.test(x)) && !w.slice(0, e).some((x) => x === "lo" || x === "donde");
    if (about && !/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|verano|invierno|primavera|otoño|serio|\d+|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|un|una|unos|unas|inglés|español|francés|línea)$/.test((_a2 = w[e + 2]) != null ? _a2 : "")) out.push({ es: render(ts.map((t, k) => k === e ? { ...t, core: "est\xE1" } : t)), rule: "event-estar" });
    const s = w.findIndex((x, k) => {
      var _a3, _b;
      return x === "se" && /^(me|te|nos)$/.test((_a3 = w[k + 1]) != null ? _a3 : "") && verbReadings((_b = w[k + 2]) != null ? _b : "").some((r) => r.inf === "olvidar");
    });
    const object = s >= 0 && !ts[s + 2].post && w[s + 3] !== void 0 && /^(el|la|los|las|un|una|unos|unas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras|este|esta|ese|esa|lo|que|algo|todo|nada)$|(ar|er|ir)$/.test(w[s + 3]);
    if (s >= 0 && object && w[s - 1] !== "m\xED" && w[s - 1] !== "ti" && w[s - 1] !== "nosotros" && w[s - 1] !== "nosotras") {
      const person = { me: "yo", te: "t\xFA", nos: "nosotros" }[w[s + 1]];
      const r = verbReadings(w[s + 2]).find((x) => x.inf === "olvidar" && (x.tense === "preterito" || x.tense === "presente" || x.tense === "imperfecto"));
      const mine = r ? form("olvidar", r.tense, person) : null;
      if (mine) {
        const lead = ts[s].core;
        const verb = { pre: ts[s].pre, core: /^\p{Lu}/u.test(lead) ? cap3(mine) : mine, post: ts[s + 2].post };
        out.push({ es: render([...ts.slice(0, s), verb, ...ts.slice(s + 3)]), rule: "se-me-optional" });
      }
    }
    const passive = passiveOf(ts);
    if (passive) out.push({ es: passive, rule: "passive-calque" });
    return out;
  }

  // lib/match/accept.ts
  var MAX_EXPANSION = 64;
  function parse(src) {
    let i = 0;
    const seq = (close) => {
      const branches = [[]];
      let text = "";
      const flush = () => {
        if (text) {
          branches[branches.length - 1].push(text);
          text = "";
        }
      };
      while (i < src.length) {
        const c = src[i];
        if (c === ")" || c === "]") {
          if (c !== close) throw new Error(`unbalanced "${c}" in accept pattern: ${src}`);
          flush();
          i++;
          return branches;
        }
        if (c === "(") {
          i++;
          flush();
          branches[branches.length - 1].push({ opt: seq(")") });
        } else if (c === "[") {
          i++;
          flush();
          branches[branches.length - 1].push({ alt: seq("]") });
        } else if (c === "|" && close === "]") {
          flush();
          i++;
          branches.push([]);
        } else {
          text += c;
          i++;
        }
      }
      if (close) throw new Error(`unclosed "${close === ")" ? "(" : "["}" in accept pattern: ${src}`);
      flush();
      return branches;
    };
    const out = seq(null);
    return out[0];
  }
  var cap4 = (xs) => xs.length > MAX_EXPANSION ? xs.slice(0, MAX_EXPANSION) : xs;
  function product(nodes) {
    let acc = [""];
    for (const n of nodes) {
      const opts = options(n);
      const next = [];
      outer: for (const a of acc) for (const o of opts) {
        next.push(a + o);
        if (next.length >= MAX_EXPANSION * 4) break outer;
      }
      acc = next;
    }
    return acc;
  }
  function options(n) {
    if (typeof n === "string") return [n];
    if ("opt" in n) {
      return cap4([...product(n.opt[0]), ""]);
    }
    const all = [];
    for (const branch of n.alt) all.push(...cap4(product(branch)));
    return cap4(all);
  }
  var tidy = (s) => s.replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  function expandAccept(pattern) {
    if (!/[()[\]]/.test(pattern)) return [tidy(pattern)];
    const seen = /* @__PURE__ */ new Set();
    for (const s of product(parse(pattern))) {
      const t = tidy(s);
      if (t) seen.add(t);
      if (seen.size >= MAX_EXPANSION) break;
    }
    return [...seen];
  }
  function expandAcceptList(accept) {
    if (!accept) return accept;
    const out = /* @__PURE__ */ new Set();
    for (const a of accept) {
      let xs;
      try {
        xs = expandAccept(a);
      } catch {
        xs = [a];
      }
      for (const x of xs) out.add(x);
    }
    return [...out];
  }

  // lib/match/synonyms.ts
  var DET_BEFORE = /(^| )(el|la|los|las|un|una|unos|unas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras|este|esta|ese|esa|aquel|aquella|al|del)$/;
  var DRINK = /(?<!\p{L})(café|tinto|jugo|agua|cerveza|leche|té|vino|chocolate|gaseosa|aguardiente|refresco|limonada|bebida|aromática)(?!\p{L})/u;
  var DE_INFINITIVE = /^de \p{L}*(ar|er|ir|ír)(se|me|te|lo|la|le|nos|los|las|les)?\b/u;
  var SYNONYM_GROUPS = [
    // people
    { pos: "n", members: [{ es: "mam\xE1", g: "f", after: DET_BEFORE }, { es: "madre", g: "f", after: DET_BEFORE }] },
    { pos: "n", members: [{ es: "pap\xE1", g: "m", after: DET_BEFORE }, { es: "padre", g: "m", after: DET_BEFORE }], notFollowed: /^\p{Lu}/u },
    { pos: "n", members: [{ es: "m\xE9dico", g: "m", after: DET_BEFORE }, { es: "doctor", g: "m", after: DET_BEFORE }], notFollowed: /^\p{Lu}/u },
    { pos: "n", members: [{ es: "m\xE9dica", g: "f", after: DET_BEFORE }, { es: "doctora", g: "f", after: DET_BEFORE }], notFollowed: /^\p{Lu}/u },
    // things
    { pos: "n", members: [{ es: "dinero", g: "m" }, { es: "plata", g: "f" }], onlyEn: /\b(money|cash)\b/, notEn: /\bsilver\b/ },
    { pos: "n", members: [{ es: "celular", g: "m" }, { es: "tel\xE9fono", g: "m" }], notEn: /\b(landline|land line|payphone)\b/ },
    { pos: "n", members: [{ es: "computador", g: "m" }, { es: "computadora", g: "f" }] },
    { pos: "n", members: [{ es: "carro", g: "m" }, { es: "auto", g: "m" }, { es: "autom\xF3vil", g: "m" }] },
    { pos: "n", members: [{ es: "bus", g: "m" }, { es: "autob\xFAs", g: "m" }] },
    { pos: "n", members: [{ es: "tiquete", g: "m" }, { es: "boleto", g: "m" }, { es: "billete", g: "m" }], onlyEn: /\b(ticket|fare)s?\b/ },
    { pos: "n", members: [{ es: "nevera", g: "f" }, { es: "refrigerador", g: "m" }] },
    { pos: "n", members: [{ es: "habitaci\xF3n", g: "f" }, { es: "cuarto", g: "m", after: DET_BEFORE }], notFollowed: /^(de (hora|kilo|libra|galón|final|siglo|millón|baño)|piso|lugar|puesto|vez|año|día|grado|capítulo|curso|parte|semestre|intento|libro|hijo|hija)\b/ },
    { pos: "n", members: [{ es: "salario", g: "m" }, { es: "sueldo", g: "m" }] },
    { pos: "n", members: [{ es: "pelo", g: "m", after: DET_BEFORE }, { es: "cabello", g: "m" }], onlyEn: /\bhair\b/ },
    { pos: "n", members: [{ es: "puesto", g: "m", after: DET_BEFORE }, { es: "cargo", g: "m", after: DET_BEFORE }], onlyEn: /\b(position|post|role|job)s?\b/ },
    { pos: "n", members: [{ es: "pena", g: "f" }, { es: "verg\xFCenza", g: "f" }], onlyEn: /\b(embarrass\w*|ashamed|shy)\b/ },
    { pos: "n", members: [{ es: "caf\xE9", g: "m" }, { es: "cafeter\xEDa", g: "f" }], onlyEn: /(?<!\p{L})caf[eé]s?(?!\p{L})/u, notEn: /\bcoffee\b/ },
    { pos: "n", oneWay: true, members: [{ es: "tinto", g: "m" }, { es: "caf\xE9", g: "m" }], notEn: /\b(black|dark|small|red|wine)\b/, notPrev: /^vinos?$/ },
    // adjectives, in the masculine singular; the others follow
    { pos: "adj", members: [{ es: "bonito" }, { es: "lindo" }] },
    // verbs, in the dictionary form; the form that stands in the sentence follows
    { pos: "v", members: [{ es: "empezar" }, { es: "comenzar" }] },
    { pos: "v", members: [{ es: "contestar" }, { es: "responder" }], notFollowed: /^(el|al|su|mi|tu|este) (teléfono|celular)\b/ },
    { pos: "v", members: [{ es: "regresar" }, { es: "volver" }], notFollowed: /^(a \p{L}+(ar|er|ir|ír)(se|me|te|lo|la|le|nos|los|las|les)?\b|atrás)/u, notPrev: /^(se|me|te|nos|lo|la|los|las|le|les)$/ },
    { pos: "v", members: [{ es: "terminar" }, { es: "acabar" }], notFollowed: DE_INFINITIVE },
    { pos: "v", members: [{ es: "escoger" }, { es: "elegir" }] },
    { pos: "v", members: [{ es: "charlar" }, { es: "conversar" }] },
    { pos: "v", members: [{ es: "tomar" }, { es: "beber" }], followed: DRINK },
    // words that stay as they are, and phrases
    // "desde luego" is of course, and a stretch of time takes después alone: dos días después, poco después, never dos días luego
    { pos: "phr", members: [{ es: "luego" }, { es: "despu\xE9s" }], notPrev: /^(hasta|desde|poco|mucho|tiempo|rato|ratos|momento|momentos|instante|instantes|segundos?|minutos?|horas?|días?|noches?|tardes?|semanas?|mes|meses|años?|siglos?|décadas?)$/, notFollowed: /^(de|que)\b/ },
    { pos: "phr", members: [{ es: "quiz\xE1s" }, { es: "quiz\xE1" }, { es: "tal vez" }] },
    { pos: "phr", members: [{ es: "enseguida" }, { es: "en seguida" }, { es: "de inmediato" }] },
    { pos: "phr", members: [{ es: "de todas formas" }, { es: "de todos modos" }, { es: "de cualquier forma" }, { es: "de cualquier manera" }] },
    { pos: "phr", members: [{ es: "sin duda" }, { es: "sin lugar a dudas" }, { es: "sin ninguna duda" }], notFollowed: /^(alguna|ninguna)\b/ },
    { pos: "phr", members: [{ es: "sin embargo" }, { es: "no obstante" }] }
  ];
  var GENDERED_BEFORE = /* @__PURE__ */ new Set(["quant", "poss", "dem", "det"]);
  var NEVER_AGREE = /^(cada|bastante|cualquier|cualquiera|más|menos|tan|mi|tu|su|mis|tus|sus|medio|sendos|sendas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|mil)$/;
  var CLOSES_PHRASE = /^(el|la|los|las|mi|tu|su|mis|tus|sus|nuestro|nuestra|nuestros|nuestras|este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas)$/;
  function beforeNoun(w) {
    var _a2;
    if (NEVER_AGREE.test(w)) return w;
    const swap = { alg\u00FAn: "alguna", alguna: "alg\xFAn", ning\u00FAn: "ninguna", ninguna: "ning\xFAn", primer: "primera", primera: "primer", un: "una", una: "un" };
    if (swap[w]) return swap[w];
    const dg = detGender(w);
    if (dg) return dg;
    if (/cient[oa]s$/.test(w)) return otherGender(w);
    return GENDERED_BEFORE.has((_a2 = closedClass2(w)) != null ? _a2 : "") && /[oa]s?$/.test(w) ? otherGender(w) : w;
  }
  var PREDICATE_VERB = /^(ser|estar|quedar|quedarse|permanecer|seguir|parecer|verse|sentirse|ponerse|resultar|lucir|volverse)$/;
  var DEGREE2 = /^(muy|tan|más|menos|bien|mal|bastante|demasiado|poco|algo|súper|realmente|totalmente|completamente)$/;
  function linksThird(w) {
    var _a2;
    const third = verbReadings(w).some((a) => PREDICATE_VERB.test(a.inf) && (a.person === "\xE9l/ella" || a.person === "ellos"));
    return third || PREDICATE_VERB.test((_a2 = participleOf(w)) != null ? _a2 : "") || isInfinitive(w) && PREDICATE_VERB.test(w);
  }
  var adjectiveLike = (w) => !!w && !!otherGender(w) && !closedClass2(w) && !isFunctionWord(w) && !gerundOf(w);
  var ofGender = (w, g) => (g === "m" ? /os?$/ : /as?$/).test(w);
  function pointsBack(ts, from, was) {
    var _a2;
    const object = was === "m" ? /^(lo|los)$/ : /^(la|las)$/;
    const pronoun = was === "m" ? /^(él|este|ese|aquel|estos|esos|aquellos|otro|otros|mismo|mismos|uno|unos|ninguno|alguno|suyo|suyos)$/ : /^(ella|esta|esa|aquella|estas|esas|aquellas|otra|otras|misma|mismas|una|unas|ninguna|alguna|suya|suyas)$/;
    for (let j = from; j < ts.length; j++) {
      const w = low(ts[j]);
      const next = ts[j + 1] && !ts[j].post ? low(ts[j + 1]) : void 0;
      const prev2 = low(ts[j - 1]);
      const article2 = /^(en|de|a|con|por|para|sin|sobre|entre|hasta|desde|hacia)$/.test(prev2) || verbReadings(prev2).length > 0;
      if (object.test(w) && !article2 && !!next && verbReadings(next).length > 0) return true;
      if ((_a2 = splitEnclitic(w)) == null ? void 0 : _a2.clitics.some((c) => object.test(c))) return true;
      if (next && /^(cual|cuales)$/.test(next) && (was === "m" ? /^(el|los)$/ : /^(la|las)$/).test(w)) return true;
      if (pronoun.test(w) && (!next || isFunctionWord(next))) return true;
      if (!linksThird(w) && !DEGREE2.test(w)) continue;
      let k = j + 1;
      while (DEGREE2.test(low(ts[k]))) k++;
      const adj = ts[k] ? low(ts[k]) : void 0;
      if (adjectiveLike(adj) && ofGender(adj, was)) return true;
    }
    return false;
  }
  function agreeWithNoun(ts, i, was) {
    let out = ts.map((t) => ({ ...t }));
    const det = low(out[i - 1]);
    let phrase = i;
    if (det === "del" || det === "al") {
      out = replaceCore(out, i - 1, det === "del" ? "de la" : "a la");
      phrase = -1;
    } else if (det === "la" && /^(de|a)$/.test(low(out[i - 2]))) {
      out = replaceCore(out, i - 2, low(out[i - 2]) === "de" ? "del" : "al");
      out[i - 2].post = out[i - 1].post;
      out.splice(i - 1, 1);
      i--;
      phrase = -1;
    } else {
      let closed = false;
      for (let k = i - 1; k >= Math.max(0, i - 3); k--) {
        const w = low(out[k]);
        if (!w || out[k].post) break;
        if (closed && !/^tod[oa]s?$/.test(w)) break;
        const flipped = beforeNoun(w);
        if (flipped === null) return null;
        const known = closedClass2(w) || isFunctionWord(w);
        if (!known && flipped === w && /[oa]s?$/.test(w) && !verbReadings(w).length && k === i - 1) return null;
        if (flipped === w && !NEVER_AGREE.test(w)) break;
        if (flipped !== w) out = replaceCore(out, k, flipped);
        phrase = k;
        closed = CLOSES_PHRASE.test(w);
      }
    }
    const raw = out[i + 1];
    const adj = low(raw);
    if (raw && !/^\p{Lu}/u.test(raw.core) && /[oa]s?$/.test(adj) && !out[i].post && !gerundOf(adj) && !verbReadings(adj).length && !closedClass2(adj) && !isFunctionWord(adj)) {
      const og = otherGender(adj);
      if (og) {
        out = replaceCore(out, i + 1, og);
        if (/^(y|e|o|u|ni|pero)$/.test(low(out[i + 2]))) return null;
      }
    }
    const before = phrase >= 1 ? low(out[phrase - 1]) : "";
    const subject = phrase >= 0 && !isFunctionWord(before) && !closedClass2(before);
    let done = i + 1;
    if (subject) {
      const after = out.slice(i + 1, i + 4).map(low);
      const cop = after.findIndex((x) => verbReadings(x).some((a) => /^(ser|estar)$/.test(a.inf) && (a.person === "\xE9l/ella" || a.person === "ellos")));
      if (cop >= 0 && after.slice(0, cop).every((x) => /^(no|ya|también|siempre|nunca)$/.test(x))) {
        const k = i + 1 + cop + 1 + (after[cop + 1] === "muy" ? 1 : 0);
        const pa = low(out[k]);
        if (pa && k === out.length - 1) {
          if (adjectiveLike(pa)) out = replaceCore(out, k, otherGender(pa));
          done = out.length;
        } else if (pa && !isFunctionWord(pa)) return null;
      }
    }
    return pointsBack(out, done, was) ? null : out;
  }
  var joinLow = (ts, from, n) => ts.slice(from, from + n).map(low).join(" ");
  function matchAt2(g, m, ts, i) {
    const w = low(ts[i]);
    if (g.pos === "n") {
      const plural2 = isPluralWord(w) && w === pluralize(m.es);
      if (w !== m.es && !plural2) return null;
      return (to) => [plural2 ? pluralize(to.es) : to.es];
    }
    if (g.pos === "adj") {
      for (const fem of [false, true]) for (const pl of [false, true]) {
        let f = fem ? otherGender(m.es) : m.es;
        if (!f) continue;
        if (pl) f = pluralize(f);
        if (w !== f) continue;
        return (to) => {
          const t = fem ? otherGender(to.es) : to.es;
          return t ? [pl ? pluralize(t) : t] : [];
        };
      }
      return null;
    }
    if (g.pos === "v") {
      if (w === m.es) return (to) => [to.es];
      const readings2 = verbReadings(w).filter((a) => a.inf === m.es && a.tense !== "imperativo");
      if (!readings2.length) return null;
      return (to) => {
        const v = verbByInf(to.es);
        if (!v) return [];
        const forms2 = /* @__PURE__ */ new Set();
        for (const a of readings2) {
          const cell = conjugateBareCells(v, a.tense)[PERSONS.indexOf(a.person)];
          if ((cell == null ? void 0 : cell.form) && cell.form !== w) forms2.add(cell.form);
        }
        return [...forms2];
      };
    }
    const n = m.es.split(" ").length;
    return joinLow(ts, i, n) === m.es ? (to) => [to.es] : null;
  }
  function synonymVariants(es, en) {
    if (/\n/.test(es)) return [];
    const ts = toToks(es);
    const e = en.toLowerCase();
    const out = [];
    for (const g of SYNONYM_GROUPS) {
      if (g.onlyEn && !g.onlyEn.test(e) || g.notEn && g.notEn.test(e)) continue;
      for (let mi = 0; mi < g.members.length; mi++) {
        if (g.oneWay && mi > 0) break;
        const m = g.members[mi];
        const span = m.es.split(" ").length;
        ts.forEach((tok, i) => {
          const swap = matchAt2(g, m, ts, i);
          if (!swap) return;
          if (m.after && !m.after.test(joinLow(ts, Math.max(0, i - 2), Math.min(2, i)))) return;
          if (g.notFollowed && g.notFollowed.test(ts.slice(i + span, i + span + 2).map((x) => x.core).join(" "))) return;
          if (g.followed && !g.followed.test(ts.slice(i + span, i + span + 3).map(low).join(" "))) return;
          if (g.notPrev && g.notPrev.test(low(ts[i - 1]))) return;
          for (const to of g.members) {
            if (to === m) continue;
            for (const form2 of swap(to)) {
              const words2 = form2.split(" ");
              let t = replaceCore(ts, i, words2[0]);
              if (span > 1 || words2.length > 1) {
                const post = t[i + span - 1].post;
                t[i].post = "";
                t.splice(i + 1, span - 1, ...words2.slice(1).map((core) => ({ pre: "", core, post: "" })));
                t[i + words2.length - 1].post = post;
              }
              if (m.g && to.g && m.g !== to.g) {
                const agreed = agreeWithNoun(t, i, m.g);
                if (!agreed) continue;
                t = agreed;
              }
              const made = render(t);
              out.push({ es: made, swap: { kind: "synonym", ...changed(es, made), lemma: m.es } });
            }
          }
        });
      }
    }
    return out;
  }

  // lib/match/variants.ts
  var PENINSULAR_NOUNS = {
    carro: { es: "coche" },
    computadora: { es: "ordenador", gender: "m" },
    celular: { es: "m\xF3vil" },
    jugo: { es: "zumo" },
    papa: { es: "patata" },
    durazno: { es: "melocot\xF3n" },
    departamento: { es: "piso" },
    lentes: { es: "gafas", gender: "f" },
    boleto: { es: "billete" },
    frijoles: { es: "jud\xEDas", gender: "f" },
    refrigerador: { es: "nevera", gender: "f" },
    computadoras: { es: "ordenadores", gender: "m" },
    carros: { es: "coches" },
    celulares: { es: "m\xF3viles" },
    papas: { es: "patatas" },
    boletos: { es: "billetes" },
    duraznos: { es: "melocotones" },
    departamentos: { es: "pisos" },
    jugos: { es: "zumos" },
    saco: { es: "chaqueta", gender: "f" },
    cuadra: { es: "manzana" },
    mesero: { es: "camarero" },
    mesera: { es: "camarera" }
  };
  var PENINSULAR_VERBS = { manejar: "conducir", rentar: "alquilar", extra\u00F1ar: "echar de menos" };
  function peninsularVariants(es, extra = {}) {
    const ts = toToks(es);
    const swaps = [];
    ts.forEach((tok, i) => {
      var _a2;
      const w = low(tok);
      const extraTo = extra[w];
      const n2 = (_a2 = PENINSULAR_NOUNS[w]) != null ? _a2 : extraTo ? { es: extraTo } : void 0;
      if (n2) {
        swaps.push((t) => {
          const out2 = replaceCore(t, i, n2.es);
          return n2.gender ? agreeWithNoun(out2, i, n2.gender === "m" ? "f" : "m") : out2;
        });
        return;
      }
      const forms2 = /* @__PURE__ */ new Set();
      for (const a of verbReadings(w)) {
        const to = PENINSULAR_VERBS[a.inf];
        if (!to || a.tense === "imperativo") continue;
        const v = verbByInf(to.split(" ")[0]);
        if (!v) continue;
        const cell = conjugateBareCells(v, a.tense)[PERSONS.indexOf(a.person)];
        if (cell) forms2.add(cell.form + (to.includes(" ") ? " " + to.split(" ").slice(1).join(" ") : ""));
      }
      for (const f of forms2) swaps.push((t) => replaceCore(t, i, f));
    });
    if (!swaps.length) return [];
    const out = /* @__PURE__ */ new Set();
    const n = Math.min(swaps.length, 3);
    for (let mask = 1; mask < 1 << n; mask++) {
      let t = ts;
      for (let k = n - 1; k >= 0 && t; k--) if (mask & 1 << k) t = swaps[k](t);
      if (t) out.add(render(t));
    }
    return [...out];
  }
  var OBJ_YOU = { usted: ["lo", "la", "le"], ustedes: ["los", "las", "les"] };
  var TO_SOMEONE = /^(decir|contar|escribir|dar|mandar|enviar|pedir|preguntar|explicar|prometer|regalar|enseñar|mostrar|recomendar|aconsejar|hablar|responder|contestar|agradecer|prestar|devolver|traer|comprar|vender|pagar|ofrecer|sugerir|deber|cobrar|rogar|advertir)$/;
  function toSomeone(ts, i) {
    return ts.slice(i + 1, i + 4).some((t) => {
      var _a2, _b;
      const w = low(t);
      return verbReadings(w).some((a) => TO_SOMEONE.test(a.inf)) || TO_SOMEONE.test((_a2 = gerundOf(w)) != null ? _a2 : "") || TO_SOMEONE.test((_b = participleOf(w)) != null ? _b : "") || TO_SOMEONE.test(w);
    });
  }
  function swapNonSubjectYou(ts, to, skip) {
    let outs = [ts];
    ts.forEach((tok, i) => {
      if (skip.has(i)) return;
      const w = low(tok);
      let reps = null;
      if (w === "te" && verbReadings(low(ts[i + 1])).some((a) => a.person === "t\xFA" && a.tense !== "imperativo")) return;
      if (w === "te") reps = /^(lo|la|los|las)$/.test(low(ts[i + 1])) ? ["se"] : toSomeone(ts, i) ? OBJ_YOU[to].filter((r) => /^les?$/.test(r)) : OBJ_YOU[to];
      else if (w === "ti") reps = [to];
      else if (w === "contigo") reps = [`con ${to}`];
      else if (w === "tu") reps = ["su"];
      else if (w === "tus") reps = ["sus"];
      else if (/^tuy[oa]s?$/.test(w)) reps = [w.replace(/^tuy/, "suy")];
      if (!reps) return;
      const next = [];
      for (const o of outs) for (const r of reps) next.push(replaceCore(o, i, r));
      outs = next;
    });
    return outs;
  }
  function stillTu(ts) {
    return ts.some((t, i) => {
      var _a2;
      const w = low(t);
      if (/^(te|ti|tú|vos|contigo|tu|tus|tuyos?|tuyas?)$/.test(w) || ((_a2 = splitEnclitic(w)) == null ? void 0 : _a2.clitics.includes("te"))) return true;
      if (i > 0 && (DETERMINERS.has(low(ts[i - 1])) || PREPOSITIONS2.has(low(ts[i - 1])))) return false;
      const rs = verbReadings(w).filter((a) => a.tense !== "imperativo");
      return rs.length > 0 && rs.every((a) => a.person === "t\xFA");
    });
  }
  function agreesWithListener(ts) {
    return ts.every((t, i) => {
      const w = low(t);
      if (!/^(lo|la|los|las|le|les)$/.test(w) || !verbReadings(low(ts[i + 1])).some((a) => LISTENER_VERBS.has(a.inf))) return true;
      const j = pastIntensifiers(ts, i + 2);
      const adj = ts[j] ? low(ts[j]) : "";
      if (!adj || !adjectiveAt(ts, j)) return true;
      return /^(los|las|les)$/.test(w) === /s$/.test(adj) && (/^le/.test(w) || /^la/.test(w) === /as?$/.test(adj));
    });
  }
  function vosotrosFrom(es, en) {
    const c = parseClause(es, en);
    if (!c || c.choice.person !== "ellos") return null;
    const v = verbByInf(c.choice.inf);
    if (!v) return null;
    const cell = conjugateBareCells(v, c.choice.tense)[PERSONS.indexOf("vosotros")];
    if (!cell) return null;
    let ts = replaceCore(c.toks, c.verb, cell.form);
    if (c.subject >= 0) ts = replaceCore(ts, c.subject, "vosotros");
    if (c.reflexive) ts = replaceCore(ts, c.proclitics[c.proclitics.length - 1], "os");
    ts.forEach((t, i) => {
      if (/^sus?$/.test(low(t))) ts = replaceCore(ts, i, low(t) === "su" ? "vuestro" : "vuestros");
    });
    return render(ts);
  }
  var DATIVE_YOU = { t\u00FA: "te", usted: "le", ustedes: "les" };
  function dativeYou(ts, en, wants) {
    var _a2;
    if (ts.some((t) => /^(usted|ustedes|ti)$/.test(low(t)))) return [];
    const verbOf = (i) => ts.slice(i + 1, i + 3).flatMap((x) => verbReadings(low(x))).find((a) => EXPERIENCER.has(a.inf));
    const at = ts.findIndex((t, i) => /^les?$/.test(low(t)) && verbOf(i));
    if (at < 0 || !youDoesIt(en, (_a2 = verbOf(at)) == null ? void 0 : _a2.inf)) return [];
    if (finiteCandidates(ts).some((c) => c.index < at)) return [];
    const own = low(ts[at]) === "le" ? "usted" : "ustedes";
    return wants.filter((to) => to !== own).map((to) => ({ es: render(replaceCore(ts, at, DATIVE_YOU[to])), register: to }));
  }
  var EN_FRAME = /^(think|reckon|suppose|guess|believe|imagine|figure|mean|say|know|hear|see|feel|hope|expect)$/;
  var ES_FRAME = /^(creer|pensar|opinar|suponer|imaginar|imaginarse|parecer|saber|conocer|decir|oír|escuchar|ver|sentir|sentirse|esperar|querer)$/;
  function youDoesIt(en, inf) {
    const you = enSubject(en);
    if (!you || you.pronoun !== "you" && you.pronoun !== "you all") return false;
    const after = enWords(en.split(/[.?!\n]/)[0]).slice(you.index + 1);
    if (after.some((w) => /^(they|he|she|we|i|it|there|there.s)$/.test(w))) return false;
    const verb = after.find((w) => !/^(not|really|just|only|actually|still|all)$/.test(w));
    return !verb || !EN_FRAME.test(verb) || !!inf && ES_FRAME.test(inf);
  }
  function bareYouClause(c, en) {
    if (c.subject >= 0 || !youDoesIt(en, c.choice.inf)) return false;
    const ts = c.toks;
    if (c.proclitics.some((i) => /^(se|te|le|les|os)$/.test(low(ts[i])))) return false;
    if (/^(bastar|convenir|valer)$/.test(c.choice.inf) || c.choice.inf === "haber" && c.participle < 0) return false;
    if (ts.some((t) => /^(ti|contigo)$/.test(low(t)))) return false;
    if (ts.slice(0, c.verb).some((t) => /[.?!…]/.test(t.post))) return false;
    const after = ts[c.verb + 1], before = ts[c.groupStart - 1];
    if (after && !ts[c.verb].post && capitalised(after)) return false;
    return !before || !!before.post || isFunctionWord(low(before));
  }
  function registerVariants(es, en) {
    var _a2;
    const mode = enYou(en);
    if (mode === "none") return [];
    const out = [];
    const c = parseClause(es, en);
    const bareYou = !!c && bareYouClause(c, en);
    const subjectYou = c && (c.choice.person === "t\xFA" || c.subject >= 0 && /^(usted|ustedes)$/.test(low(c.toks[c.subject])) || bareYou && (c.choice.person === "\xE9l/ella" || c.choice.person === "ellos"));
    const fromReg = !c ? null : c.choice.person === "t\xFA" ? "t\xFA" : c.subject >= 0 && low(c.toks[c.subject]) === "usted" ? "usted" : c.subject >= 0 && low(c.toks[c.subject]) === "ustedes" ? "ustedes" : mode === "plural" && c.choice.person === "ellos" ? "ustedes" : bareYou && c.choice.person === "\xE9l/ella" ? "usted" : bareYou && c.choice.person === "ellos" ? "ustedes" : null;
    const wants = mode === "formal" ? [fromReg === "ustedes" ? "ustedes" : "usted"] : mode === "informal" ? ["t\xFA"] : mode === "plural" ? ["ustedes"] : mode === "singular" ? ["t\xFA", "usted"] : ["t\xFA", "usted", "ustedes"];
    if (c && subjectYou && fromReg) {
      for (const to of wants) {
        if (to === fromReg) continue;
        const person = to === "t\xFA" ? "t\xFA" : to === "usted" ? "\xE9l/ella" : "ellos";
        const r = changePerson(c, person, { en, pronoun: "keep" });
        if (!r) continue;
        let ts = r.toks;
        if (c.subject >= 0) ts = replaceCore(ts, c.subject, to);
        const skip = new Set(c.reflexive ? [c.proclitics[c.proclitics.length - 1]] : []);
        if (to === "t\xFA") {
          out.push({ es: render(ts), register: to });
          continue;
        }
        for (const v of swapNonSubjectYou(ts, to, skip)) if (!stillTu(v) && agreesWithListener(v)) out.push({ es: render(v), register: to });
      }
      if (mode === "open" || mode === "plural") {
        const ustedesForm2 = fromReg === "ustedes" ? es : (_a2 = out.find((o) => o.register === "ustedes")) == null ? void 0 : _a2.es;
        const vos = ustedesForm2 ? vosotrosFrom(ustedesForm2, en) : null;
        if (vos) out.push({ es: vos, register: "vosotros", variant: "peninsular" });
      }
    } else {
      const ts = toToks(es);
      const dative = dativeYou(ts, en, wants);
      if (dative.length) return dative;
      if (!ts.some((t) => /^(te|ti|contigo|tu|tus|tuyos?|tuyas?)$/.test(low(t)))) return [];
      if ((c == null ? void 0 : c.reflexive) && c.choice.person === "t\xFA") return [];
      const dativeOnly = ts.some((t) => verbReadings(low(t)).some((a) => EXPERIENCER.has(a.inf)));
      for (const to of wants) {
        if (to === "t\xFA") continue;
        for (const v of swapNonSubjectYou(ts, to, /* @__PURE__ */ new Set())) {
          if (stillTu(v) || !agreesWithListener(v) || dativeOnly && v.some((t, i) => low(ts[i]) === "te" && !/^les?$/.test(low(t)))) continue;
          out.push({ es: render(v), register: to });
        }
      }
    }
    return out;
  }
  var EN_GENDERED = /\b(he|she|him|her|his|hers|himself|herself|boys?|girls?|guys|ladies|gentlemen|man|woman|men|women|mothers?|fathers?|sons?|daughters?|brothers?|sisters?|husbands?|wife|wives|boyfriends?|girlfriends?|mr|mrs|ms|sir|madam)\b/i;
  var COPULA_LIKE = /^(ser|estar|sentirse|quedarse|ponerse)$/;
  var INTENSIFIER2 = /^(muy|tan|bastante|poco|algo|más|menos|demasiado|súper|super|realmente|totalmente|completamente|casi)$/;
  var LISTENER_VERBS = /* @__PURE__ */ new Set(["dejar", "ver", "encontrar", "notar"]);
  var NOT_PREDICATE = /^(cuando|como|donde|mientras|nada|todo|toda|todos|todas|mucho|mucha|muchos|muchas|tanto|tanta|tantos|tantas|otro|otra|otros|otras|mismo|misma|mismos|mismas|varios|varias|ambos|ambas|cierto|cierta|propio|propia|luego|entonces|ahora|tarde|temprano|pues|sino|aunque|porque|cuatro|cinco|ocho|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cerca|lejos|arriba|abajo|encima|debajo|dentro|adentro|fuera|afuera|delante|adelante|pronto|conmigo|contigo|consigo|esto|eso|aquello|cualquiera|sábado|domingo|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|familia|gente|persona|personas|plata|manos|testigo|testigos)$/;
  var AFTER_PREDICATE = /^(cuando|donde|porque|aunque|mientras|pues|sino|como|ni|e|u|nada|todo|toda|todos|todas|cada|acá|allá|ahí|bien|mal)$/;
  function adjectiveAt(ts, j) {
    const w = low(ts[j]);
    const next = ts[j + 1];
    if (w.length < 4 || NOT_PREDICATE.test(w) || isFunctionWord(w) || verbReadings(w).length || gerundOf(w) || splitEnclitic(w)) return null;
    if (j > 0 && capitalised(ts[j])) return null;
    if (/^sol[oa]s?$/.test(w) && next && !ts[j].post && DETERMINERS.has(low(next))) return null;
    if (next && !ts[j].post && !isFunctionWord(low(next)) && !AFTER_PREDICATE.test(low(next)) && !TIME_WORDS.has(low(next))) return null;
    return otherGender(w);
  }
  function pastIntensifiers(ts, j) {
    while (j < ts.length && (INTENSIFIER2.test(low(ts[j])) || low(ts[j]) === "un" && low(ts[j + 1]) === "poco")) j++;
    return j;
  }
  function flipPredicate(ts, from) {
    let out = ts;
    let j = pastIntensifiers(out, from);
    for (; ; ) {
      const og = adjectiveAt(out, j);
      if (!og) break;
      out = replaceCore(out, j, og);
      if (out[j].post || !/^(y|e|o|u|ni)$/.test(low(out[j + 1]))) break;
      j = pastIntensifiers(out, j + 2);
    }
    return out === ts ? null : out;
  }
  var capitalised = (t) => /^[A-ZÁÉÍÓÚÑ]/.test(t.core);
  var namesListener = (ts) => ts.some((t, i) => i > 0 && capitalised(t) && /,$/.test(ts[i - 1].post));
  var namesSpeaker = (ts) => ts.some((t, i) => i > 0 && capitalised(t) && /^(soy|llamo)$/.test(low(ts[i - 1])));
  function flipSpeaker(es, en, ts) {
    const cands = finiteCandidates(ts);
    const listener = namesListener(ts), speaker = namesSpeaker(ts);
    let out = ts;
    cands.forEach((cand, n) => {
      const c = parseClause(es, n === 0 ? en : void 0, { allowMany: true, index: cand.index, reflexiveExperiencer: true });
      if (!c || !COPULA_LIKE.test(c.choice.inf)) return;
      const p = c.choice.person;
      const named = c.subject >= 0 && /^(usted|ustedes)$/.test(low(ts[c.subject]));
      const bareYou = cands.length === 1 && bareYouClause(c, en) && (p === "\xE9l/ella" || p === "ellos");
      if (!(p === "yo" || p === "t\xFA" || p === "nosotros" || named || bareYou)) return;
      if (p === "yo" || p === "nosotros" ? speaker : listener) return;
      const next = flipPredicate(out, (c.participle >= 0 ? c.participle : c.verb) + 1);
      if (!next) return;
      out = next;
      if (c.subject >= 0) {
        const sw = { nosotros: "nosotras", nosotras: "nosotros" };
        const pr = low(out[c.subject]);
        if (sw[pr]) out = replaceCore(out, c.subject, sw[pr]);
      }
    });
    return out === ts ? null : out;
  }
  function flipListener(en, ts) {
    if (!/\byou\b/i.test(en) || ts.some((t, i) => i > 0 && /^[A-ZÁÉÍÓÚÑ]/.test(t.core))) return null;
    let out = ts;
    ts.forEach((t, k) => {
      if (low(t) !== "te") return;
      const v = ts.findIndex((x, j) => j > k && j <= k + 4 && (LISTENER_VERBS.has(low(x)) || verbReadings(low(x)).some((a) => LISTENER_VERBS.has(a.inf))));
      const next = v < 0 ? null : flipPredicate(out, v + 1);
      if (next) out = next;
    });
    return out === ts ? null : out;
  }
  function genderVariants(es, en) {
    if (EN_GENDERED.test(en)) return [];
    const ts = toToks(es);
    const speaker = flipSpeaker(es, en, ts);
    const listener = flipListener(en, ts);
    const both = speaker && flipListener(en, speaker);
    return [speaker, listener, both].filter((x) => !!x).map(render);
  }
  var SUBORDINATOR = /^(si|que|ojalá|aunque|como|cuando|donde|quien|quienes|mientras)$/;
  function subordinate(ts, i) {
    const verbs = new Set(finiteCandidates(ts).map((c) => c.index));
    let comma = false, closed = false;
    for (let k = i - 1; k >= 0; k--) {
      if (/[;:.!?…]/.test(ts[k].post)) return false;
      if (ts[k].post.includes(",")) comma = true;
      if (comma && verbs.has(k)) closed = true;
      if (SUBORDINATOR.test(low(ts[k]))) return !closed;
    }
    return false;
  }
  function adverbFuera(ts, i) {
    if (low(ts[i]) !== "fuera") return false;
    const prev2 = low(ts[i - 1]);
    return low(ts[i + 1]) === "de" || !!ts[i].post || isInfinitive(prev2) || !!prev2 && verbReadings(prev2).length > 0;
  }
  function swapSubsets(ts, swaps) {
    const out = /* @__PURE__ */ new Set();
    const n = Math.min(swaps.length, 3);
    for (let mask = 1; mask < 1 << n; mask++) {
      let t = ts;
      for (let k = 0; k < n; k++) if (mask & 1 << k) t = replaceCore(t, swaps[k][0], swaps[k][1]);
      out.add(render(t));
    }
    return [...out];
  }
  var habForm = (tense, person) => {
    var _a2;
    const v = verbByInf("haber");
    return v ? (_a2 = conjugateBareCells(v, tense)[PERSONS.indexOf(person)]) == null ? void 0 : _a2.form : void 0;
  };
  function subjunctiveVariants(es) {
    const ts = toToks(es);
    const swaps = [];
    ts.forEach((tok, i) => {
      if (adverbFuera(ts, i)) return;
      const forms2 = /* @__PURE__ */ new Set();
      for (const a of verbReadings(low(tok))) {
        if (a.tense !== "impsubj" && a.tense !== "impsubjse") continue;
        if (a.tense === "impsubj" && a.inf !== "haber" && !subordinate(ts, i)) continue;
        const v = verbByInf(a.inf.replace(/se$/, ""));
        const cell = v && conjugateBareCells(v, a.tense === "impsubj" ? "impsubjse" : "impsubj")[PERSONS.indexOf(a.person)];
        if (cell && cell.form !== low(tok)) forms2.add(cell.form);
      }
      for (const f of forms2) swaps.push([i, f]);
    });
    return swaps.length ? swapSubsets(ts, swaps) : [];
  }
  var EN_RESULT = /\b(would|could|might)\b.* have\b|\b(would|could|might).ve\b/;
  function resultClauseVariants(es, en) {
    if (!EN_RESULT.test(enWords(en).join(" "))) return [];
    const ts = toToks(es);
    const swaps = [];
    ts.forEach((tok, i) => {
      if (compoundParticiple(ts, i) < 0 || subordinate(ts, i)) return;
      for (const a of verbReadings(low(tok))) {
        if (a.inf !== "haber") continue;
        const to = a.tense === "condicional" ? "impsubj" : a.tense === "impsubj" || a.tense === "impsubjse" ? "condicional" : null;
        const form2 = to && habForm(to, a.person);
        if (form2 && form2 !== low(tok)) {
          swaps.push([i, form2]);
          break;
        }
      }
    });
    return swaps.length ? swapSubsets(ts, swaps) : [];
  }
  var SOFTENER = /^(querer|poder|deber)$/;
  var EN_SOFTENED = /\b(would|could|should|might)\b/;
  function softenerVariants(es, en) {
    const e = enWords(en).join(" ");
    if (!EN_SOFTENED.test(e) || /\b(would|could|should|might) have\b|\b(if only|wish)\b/.test(e)) return [];
    const ts = toToks(es);
    const wouldLike = /\bi would like\b/.test(e);
    const swaps = [];
    ts.forEach((tok, i) => {
      if (subordinate(ts, i) || low(ts[i - 1]) === "qui\xE9n") return;
      const forms2 = /* @__PURE__ */ new Set();
      for (const a of verbReadings(low(tok))) {
        if (!SOFTENER.test(a.inf) || !["impsubj", "condicional", "presente"].includes(a.tense)) continue;
        if (a.tense === "presente" && !(wouldLike && a.inf === "querer" && a.person === "yo")) continue;
        const v = verbByInf(a.inf);
        if (!v) continue;
        for (const to of ["impsubj", "condicional", "presente"]) {
          if (to === a.tense || to === "presente" && !(wouldLike && a.inf === "querer" && a.person === "yo")) continue;
          const cell = conjugateBareCells(v, to)[PERSONS.indexOf(a.person)];
          if (cell && cell.form !== low(tok)) forms2.add(cell.form);
        }
      }
      for (const f of forms2) swaps.push([i, f]);
    });
    return [...new Set(swaps.map(([i, f]) => render(replaceCore(ts, i, f))))];
  }
  function expandAccepted(s, opts = {}) {
    var _a2, _b, _c, _d;
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    const add2 = (v) => {
      const k = v.es.toLowerCase().replace(/[^a-záéíóúñü ]/g, "").replace(/\s+/g, " ").trim();
      if (!k || seen.has(k)) return;
      seen.add(k);
      out.push(v);
    };
    const grown = (from, es, kind) => {
      var _a3;
      return { ...from, es, model: false, swaps: [...(_a3 = from.swaps) != null ? _a3 : [], { kind, ...changed(from.es, es) }] };
    };
    const base = [s.es, ...(_a2 = expandAcceptList(s.accept)) != null ? _a2 : [], ...(_b = opts.also) != null ? _b : []];
    base.forEach((es, i) => add2({ es, ...i === 0 ? { model: true } : {} }));
    for (const es of base) for (const v of registerVariants(es, s.en)) add2({ ...v, swaps: [{ kind: "register", ...changed(es, v.es) }] });
    for (const v of out.slice()) for (const g of genderVariants(v.es, s.en)) add2(grown(v, g, "gender"));
    for (const v of out.slice()) for (const r of resultClauseVariants(v.es, s.en)) add2(grown(v, r, "result-clause"));
    for (const v of out.slice()) for (const r of subjunctiveVariants(v.es)) add2(grown(v, r, "ra-se"));
    for (const v of out.slice()) for (const r of softenerVariants(v.es, s.en)) add2(grown(v, r, "cond-ra"));
    for (const v of out.slice()) {
      const ts = toToks(v.es);
      for (const r of clauseOrderVariants(v.es, ts)) add2(grown(v, r, "clause-order"));
      for (const r of movedPhraseVariants(v.es, ts)) add2(grown(v, r, "moved-phrase"));
      for (const x of [...futureVariants(v.es, s.en), ...perfectoVariants(v.es, s.en), ...synonymVariants(v.es, s.en), ...copulaVariants(v.es)]) add2({ ...v, es: x.es, model: false, swaps: [...(_c = v.swaps) != null ? _c : [], x.swap] });
    }
    for (const es of (_d = opts.peninsular) != null ? _d : []) add2({ es, variant: "peninsular" });
    for (const v of out.slice()) {
      for (const p of peninsularVariants(v.es, opts.peninsularWords)) add2({ ...grown(v, p, "peninsular"), variant: "peninsular" });
    }
    return out;
  }

  // lib/match/match.ts
  var EN_PRON = {
    i: ["yo"],
    he: ["\xE9l"],
    she: ["ella"],
    we: ["nosotros", "nosotras"],
    they: ["ellos", "ellas"]
  };
  var REG_PRON = {
    "t\xFA": ["t\xFA"],
    usted: ["usted"],
    ustedes: ["ustedes"],
    vosotros: ["vosotros", "vosotras"]
  };
  var PERSON_PRON = {
    yo: ["yo"],
    "t\xFA": ["t\xFA"],
    "\xE9l/ella": ["\xE9l", "ella", "usted"],
    nosotros: ["nosotros", "nosotras"],
    vosotros: ["vosotros", "vosotras"],
    ellos: ["ellos", "ellas", "ustedes"]
  };
  function englishPronouns(en) {
    var _a2;
    const sub = enSubject(en);
    const ok = /* @__PURE__ */ new Set();
    if (!(sub == null ? void 0 : sub.pronoun)) return ok;
    if (sub.pronoun === "you") ["t\xFA", "usted", "ustedes"].forEach((p) => ok.add(p));
    else if (sub.pronoun === "you all") ok.add("ustedes");
    else (_a2 = EN_PRON[sub.pronoun]) == null ? void 0 : _a2.forEach((p) => ok.add(p));
    return ok;
  }
  var EN_LIKES = /\b(like|likes|love|loves|enjoy|enjoys|adore|adores|interested|care|cares)\b/;
  function experiencerSlip(ci, en, es) {
    if (!ci.experiencer.length) return false;
    const carried = englishPronouns(en);
    const model = es.toLowerCase();
    return ci.experiencer.some((x) => x.mismatch || model.includes(`a ${x.pron} `) || x.like && carried.has(x.pron) && EN_LIKES.test(enWords(en).join(" ")));
  }
  function figureSlip(ci, cv) {
    return ci.toks.findIndex((t, i) => {
      var _a2;
      return !!t.form && !!((_a2 = cv.toks[i]) == null ? void 0 : _a2.form) && t.form !== cv.toks[i].form;
    });
  }
  function pronounsAllowed(v, cv, en) {
    var _a2, _b;
    const ok = new Set(cv.pronouns);
    const ew = enWords(en);
    let fromEnglish = false;
    for (const w of ew) {
      if (EN_PRON[w]) {
        EN_PRON[w].forEach((p) => ok.add(p));
        fromEnglish = true;
      }
      if (w === "you") {
        fromEnglish = true;
        if (v.register) REG_PRON[v.register].forEach((p) => ok.add(p));
        else {
          const verb = cv.toks.map((t) => t.t).find((t) => verbReadings(t).length);
          for (const a of verb ? verbReadings(verb) : []) {
            if (a.person === "t\xFA") ok.add("t\xFA");
            if (a.person === "\xE9l/ella") ok.add("usted");
            if (a.person === "ellos") ok.add("ustedes");
          }
          if (cv.toks.some((t) => verbReadings(t.t).some((a) => EXPERIENCER.has(a.inf.replace(/se$/, ""))))) {
            for (const t of cv.toks) {
              if (t.t === "te") ok.add("t\xFA");
              if (t.t === "le") ok.add("usted");
              if (t.t === "les") ok.add("ustedes");
            }
          }
        }
      }
    }
    for (const t of cv.toks) {
      for (const a of verbReadings(t.t)) {
        if (EXPERIENCER.has(a.inf.replace(/se$/, "")) && a.tense !== "imperativo" && a.person !== "\xE9l/ella" && a.person !== "ellos") ((_a2 = PERSON_PRON[a.person]) != null ? _a2 : []).forEach((p) => ok.add(p));
      }
    }
    if (!fromEnglish && !ok.size) {
      const verb = cv.toks.map((t) => t.t).find((t) => verbReadings(t).length);
      for (const a of verb ? verbReadings(verb) : []) ((_b = PERSON_PRON[a.person]) != null ? _b : []).forEach((p) => ok.add(p));
    }
    return ok;
  }
  function advsOk(ci, cv) {
    if (advKey(ci) !== advKey(cv)) return false;
    return ci.advs.every((a) => a.legal || cv.advs.some((b) => b.t === a.t && b.slot === a.slot));
  }
  function encliticAccentSlip(ci, cv) {
    return ci.toks.some((t, i) => {
      var _a2;
      return t.src && ((_a2 = cv.toks[i]) == null ? void 0 : _a2.src) && t.src !== cv.toks[i].src && deaccent(t.src) === deaccent(cv.toks[i].src);
    });
  }
  var joinNotes = (a, b) => a ? `${a} ${b}` : b;
  function matchTranslation(input, sentence, opts = {}) {
    var _a2, _b, _c, _d;
    const expanded = expandAccepted(sentence, opts);
    const seen = new Set(expanded.map((v) => v.es));
    for (const v of expanded.slice()) {
      for (const es of questionOrders(v.es)) {
        if (seen.has(es)) continue;
        seen.add(es);
        expanded.push({ ...v, es, model: false });
      }
    }
    for (const v of expanded.slice()) {
      if (v.swaps) continue;
      for (const n of noteVariants(v.es)) {
        if (seen.has(n.es)) continue;
        seen.add(n.es);
        expanded.push({ es: n.es, model: false, trap: n.rule });
      }
    }
    const variants = expanded.sort((a, b) => (a.variant ? 1 : 0) - (b.variant ? 1 : 0));
    const model = (_b = (_a2 = variants[0]) == null ? void 0 : _a2.es) != null ? _b : sentence.es;
    const ci = canon(input);
    if (!ci.toks.length && !ci.advs.length) {
      return { pass: false, hint: HINT_TEXT.empty, hintKind: "empty", closest: model };
    }
    const lenient = opts.accents === "lenient";
    const cvs = variants.map((v) => ({ v, cv: canon(v.es) }));
    const slip = experiencerSlip(ci, sentence.en, sentence.es);
    let nearHit = null;
    let subjectHit = null;
    let orderHit = null;
    let figureHit = null;
    for (const { v, cv } of cvs) {
      if (slip) break;
      const sameToks = key(ci) === key(cv);
      const sameAccentless = keyDeaccent(ci) === keyDeaccent(cv);
      if (!sameToks && !sameAccentless) continue;
      const allowed = pronounsAllowed(v, cv, sentence.en);
      const pronOk = ci.pronouns.every((p) => allowed.has(p));
      const pronOkLoose = ci.pronouns.every((p) => [...allowed].some((q) => deaccent(q) === deaccent(p)));
      const advOk = advsOk(ci, cv);
      const advLoose = deaccent(advKey(ci)) === deaccent(advKey(cv));
      const figure = sameToks ? figureSlip(ci, cv) : -1;
      if (figure >= 0) {
        figureHit != null ? figureHit : figureHit = { v, at: figure };
        continue;
      }
      if (sameToks && pronOk && advOk) {
        const slip2 = ci.accentSlips > 0 || encliticAccentSlip(ci, cv);
        if (slip2) {
          nearHit != null ? nearHit : nearHit = { v };
          continue;
        }
        const note = [swapNote(v.swaps, opts.targets), v.trap ? (_c = ruleOf(v.trap)) == null ? void 0 : _c.text : void 0].filter(Boolean).join(" ") || void 0;
        return {
          pass: true,
          closest: v.es,
          ...v.variant ? { variant: v.variant } : {},
          ...v.register ? { register: v.register } : {},
          ...note ? { note } : {},
          ...((_d = v.swaps) == null ? void 0 : _d.length) ? { swaps: v.swaps } : {}
        };
      }
      if (sameToks && !pronOk && pronOkLoose && advOk) {
        nearHit != null ? nearHit : nearHit = { v };
        continue;
      }
      if (sameToks && !pronOk && advOk) {
        subjectHit != null ? subjectHit : subjectHit = { v };
        continue;
      }
      if (sameToks && pronOk && advKey(ci) === advKey(cv) && !advOk) {
        orderHit != null ? orderHit : orderHit = { v };
        continue;
      }
      if (sameAccentless && pronOkLoose && (advOk || advLoose)) {
        nearHit != null ? nearHit : nearHit = { v };
        continue;
      }
    }
    const forgive = (v, tried = /* @__PURE__ */ new Set()) => {
      const slips = accentSlips(input, v.es);
      const note = forgiven(slips);
      const text = note ? mendSlips(input, v.es, slips) : void 0;
      if (!text || tried.has(text)) return void 0;
      tried.add(text);
      const mended = matchTranslation(text, sentence, { ...opts, accents: "strict" });
      return mended.pass ? { ...mended, near: true, hint: HINT_TEXT.accents, hintKind: "accents", note: joinNotes(mended.note, note) } : void 0;
    };
    if (nearHit) {
      const v = nearHit.v;
      const right = lenient ? forgive(v) : void 0;
      if (right) return right;
      return {
        pass: false,
        near: true,
        hint: HINT_TEXT.accents,
        hintKind: "accents",
        closest: v.es,
        ...v.variant ? { variant: v.variant } : {},
        ...v.register ? { register: v.register } : {}
      };
    }
    if (subjectHit) return { pass: false, hint: HINT_TEXT.subject, hintKind: "subject", closest: subjectHit.v.es };
    if (orderHit) return { pass: false, hint: HINT_TEXT["word-order"], hintKind: "word-order", closest: orderHit.v.es };
    if (figureHit) return { pass: false, hint: HINT_TEXT.agreement, hintKind: "agreement", closest: figureHit.v.es, at: figureHit.at };
    const flat = (c) => {
      const ts = c.toks.map((t2) => t2.t);
      for (const a of c.advs.slice().sort((x, y) => y.slot - x.slot)) ts.splice(a.slot, 0, a.t);
      return ts;
    };
    const fi = flat(ci);
    let best = cvs[0], bestD = Infinity;
    for (const x of cvs) {
      const d = distance(fi, flat(x.cv)) + (x.v.variant ? 0.01 : 0);
      if (d < bestD) {
        best = x;
        bestD = d;
      }
    }
    if (slip) {
      return { pass: false, hint: HINT_TEXT.experiencer, hintKind: "experiencer", rule: "exp-subject", closest: best.v.es, at: Math.max(0, ci.toks.findIndex((t2) => CLITICS3.has(t2.t))) };
    }
    if (lenient) {
      const tried = /* @__PURE__ */ new Set();
      for (const { v } of cvs) {
        const right = forgive(v, tried);
        if (right) return right;
      }
    }
    const fm = flat(best.cv);
    const dg = diagnose(fi, fm);
    const t = diagnose2({ a: fi, b: fm, input, en: sentence.en, dg, nodes: opts.targets });
    return {
      pass: false,
      hint: t.hint,
      hintKind: t.kind,
      closest: best.v.es,
      at: t.at,
      ...dg.kind === "accents" ? { near: true } : {},
      ...t.rule ? { rule: t.rule } : {},
      ...t.tier === "ask" ? { ask: true } : {}
    };
  }

  // lib/match/english.ts
  var SPELL = [
    [/our\b/g, "or"],
    [/ll(ing|ed|er)\b/g, "l$1"],
    [/tre\b/g, "ter"],
    [/ise(d|s)?\b/g, "ize$1"],
    [/yse(d|s)?\b/g, "yze$1"],
    [/\bgrey\b/g, "gray"],
    [/\bmum\b/g, "mom"],
    [/\bfavourite\b/g, "favorite"]
  ];
  function normEnglish(s) {
    let t = expandContractions(s.toLowerCase()).replace(/[^a-z'\s]/g, " ").replace(/'/g, "");
    for (const [re, to] of SPELL) t = t.replace(re, to);
    t = t.replace(/\byou (all|guys)\b/g, "you");
    return t.replace(/\s+/g, " ").trim();
  }
  function matchEnglish(input, item) {
    var _a2;
    const list = [item.en, ...(_a2 = item.acceptEn) != null ? _a2 : []];
    const ni = normEnglish(input);
    if (!ni) return { pass: false, hint: "Type your answer in English.", closest: item.en };
    for (const a of list) if (normEnglish(a) === ni) return { pass: true, closest: a };
    const bareWord = (t) => t.replace(/^(the|an|a|to) (?=\S+$)/, "");
    for (const a of list) if (!ni.includes(" ") || /^(the|an|a|to) \S+$/.test(ni)) {
      if (bareWord(normEnglish(a)) === bareWord(ni) && !bareWord(ni).includes(" ")) return { pass: true, closest: a };
    }
    const iw = ni.split(" ");
    for (const a of list) {
      const aw = normEnglish(a).split(" ");
      if (aw.length !== iw.length) continue;
      const diffs = aw.map((w, k) => [w, iw[k]]).filter(([x, y]) => x !== y);
      if (diffs.length === 1 && diffs[0][0].length >= 4 && levenshtein(diffs[0][0], diffs[0][1]) === 1) {
        return { pass: false, near: true, hint: "Check the spelling.", hintKind: "spelling", closest: a };
      }
    }
    return { pass: false, hint: "Read the Spanish again.", closest: item.en };
  }

  // lib/match/attempt.ts
  var MAX_TRIES = 2;
  function startAttempt(sentence, opts = {}) {
    return { sentence, opts, tries: 0, done: false, history: [] };
  }
  function submitAttempt(state, input) {
    if (state.done) throw new Error("attempt already finished");
    const result = matchTranslation(input, state.sentence, state.opts);
    const tries = state.tries + 1;
    const history = [...state.history, { input, result }];
    if (result.pass) {
      return { state: { ...state, tries, done: true, history }, status: "correct", result, grade: tries === 1 ? "good" : "hard" };
    }
    if (tries < MAX_TRIES) return { state: { ...state, tries, history }, status: "retry", result };
    return { state: { ...state, tries, done: true, history }, status: "revealed", result, grade: "again", answer: result.closest };
  }

  // lib/fsrs/index.ts
  var fsrs_exports = {};
  __export(fsrs_exports, {
    DEFAULT_RETENTION: () => DEFAULT_RETENTION,
    DEFAULT_TYPICAL_LATENCY_MS: () => DEFAULT_TYPICAL_LATENCY_MS,
    FSRS5_WEIGHTS: () => FSRS5_WEIGHTS,
    LEITNER_INTERVALS: () => LEITNER_INTERVALS,
    MAXIMUM_INTERVAL: () => MAXIMUM_INTERVAL,
    MAX_RETENTION: () => MAX_RETENTION,
    MIN_RETENTION: () => MIN_RETENTION,
    RELEARNING_STEPS: () => RELEARNING_STEPS,
    createCard: () => createCard,
    fromLeitner: () => fromLeitner,
    getRetention: () => getRetention,
    gradeFromAnswer: () => gradeFromAnswer,
    retrievability: () => retrievability,
    review: () => review,
    setRetention: () => setRetention
  });

  // node_modules/ts-fsrs/dist/index.mjs
  var FSRSError = class _FSRSError extends Error {
    constructor(message = "FSRS Error") {
      var _a2;
      super(message);
      this.name = "FSRSError";
      (_a2 = Error.captureStackTrace) == null ? void 0 : _a2.call(Error, this, _FSRSError);
    }
  };
  var FSRSValidationError = class _FSRSValidationError extends FSRSError {
    constructor(message) {
      var _a2;
      super(message);
      this.name = "FSRSValidationError";
      (_a2 = Error.captureStackTrace) == null ? void 0 : _a2.call(Error, this, _FSRSValidationError);
    }
  };
  var State = /* @__PURE__ */ ((State2) => {
    State2[State2["New"] = 0] = "New";
    State2[State2["Learning"] = 1] = "Learning";
    State2[State2["Review"] = 2] = "Review";
    State2[State2["Relearning"] = 3] = "Relearning";
    return State2;
  })(State || {});
  var Rating = /* @__PURE__ */ ((Rating2) => {
    Rating2[Rating2["Manual"] = 0] = "Manual";
    Rating2[Rating2["Again"] = 1] = "Again";
    Rating2[Rating2["Hard"] = 2] = "Hard";
    Rating2[Rating2["Good"] = 3] = "Good";
    Rating2[Rating2["Easy"] = 4] = "Easy";
    return Rating2;
  })(Rating || {});
  var TypeConvert = class _TypeConvert {
    static card(card) {
      return {
        ...card,
        state: _TypeConvert.state(card.state),
        due: _TypeConvert.time(card.due),
        last_review: card.last_review ? _TypeConvert.time(card.last_review) : void 0
      };
    }
    static rating(value) {
      if (typeof value === "string") {
        const firstLetter = value.charAt(0).toUpperCase();
        const restOfString = value.slice(1).toLowerCase();
        const ret = Rating[`${firstLetter}${restOfString}`];
        if (ret === void 0) {
          throw new FSRSValidationError(`Invalid rating:[${value}]`);
        }
        return ret;
      } else if (typeof value === "number") {
        return value;
      }
      throw new FSRSValidationError(`Invalid rating:[${value}]`);
    }
    static state(value) {
      if (typeof value === "string") {
        const firstLetter = value.charAt(0).toUpperCase();
        const restOfString = value.slice(1).toLowerCase();
        const ret = State[`${firstLetter}${restOfString}`];
        if (ret === void 0) {
          throw new FSRSValidationError(`Invalid state:[${value}]`);
        }
        return ret;
      } else if (typeof value === "number") {
        return value;
      }
      throw new FSRSValidationError(`Invalid state:[${value}]`);
    }
    static time(value) {
      if (value instanceof Date) {
        return value;
      }
      const date = new Date(value);
      if (typeof value === "object" && value !== null && !Number.isNaN(Date.parse(value) || +date)) {
        return date;
      } else if (typeof value === "string") {
        const timestamp = Date.parse(value);
        if (!Number.isNaN(timestamp)) {
          return new Date(timestamp);
        } else {
          throw new FSRSValidationError(`Invalid date:[${value}]`);
        }
      } else if (typeof value === "number") {
        return new Date(value);
      }
      throw new FSRSValidationError(`Invalid date:[${value}]`);
    }
    static review_log(log) {
      return {
        ...log,
        due: _TypeConvert.time(log.due),
        rating: _TypeConvert.rating(log.rating),
        state: _TypeConvert.state(log.state),
        review: _TypeConvert.time(log.review)
      };
    }
  };
  Date.prototype.scheduler = function(t, isDay) {
    return date_scheduler(this, t, isDay);
  };
  Date.prototype.diff = function(pre, unit) {
    return date_diff(this, pre, unit);
  };
  Date.prototype.format = function() {
    return formatDate(this);
  };
  Date.prototype.dueFormat = function(last_review, unit, timeUnit) {
    return show_diff_message(this, last_review, unit, timeUnit);
  };
  function date_scheduler(now, t, isDay) {
    return new Date(
      isDay ? TypeConvert.time(now).getTime() + t * 24 * 60 * 60 * 1e3 : TypeConvert.time(now).getTime() + t * 60 * 1e3
    );
  }
  function date_diff(now, pre, unit) {
    if (!now || !pre) {
      throw new FSRSValidationError("Invalid date");
    }
    const diff = TypeConvert.time(now).getTime() - TypeConvert.time(pre).getTime();
    let r = 0;
    switch (unit) {
      case "days":
        r = Math.floor(diff / (24 * 60 * 60 * 1e3));
        break;
      case "minutes":
        r = Math.floor(diff / (60 * 1e3));
        break;
    }
    return r;
  }
  function formatDate(dateInput) {
    const date = TypeConvert.time(dateInput);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(
      minutes
    )}:${padZero(seconds)}`;
  }
  function padZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }
  var TIMEUNIT = [60, 60, 24, 31, 12];
  var TIMEUNITFORMAT = ["second", "min", "hour", "day", "month", "year"];
  function show_diff_message(due, last_review, unit, timeUnit = TIMEUNITFORMAT) {
    due = TypeConvert.time(due);
    last_review = TypeConvert.time(last_review);
    if (timeUnit.length !== TIMEUNITFORMAT.length) {
      timeUnit = TIMEUNITFORMAT;
    }
    let diff = due.getTime() - last_review.getTime();
    let i = 0;
    diff /= 1e3;
    for (i = 0; i < TIMEUNIT.length; i++) {
      if (diff < TIMEUNIT[i]) {
        break;
      } else {
        diff /= TIMEUNIT[i];
      }
    }
    return `${Math.floor(diff)}${unit ? timeUnit[i] : ""}`;
  }
  var Grades = Object.freeze([
    Rating.Again,
    Rating.Hard,
    Rating.Good,
    Rating.Easy
  ]);
  var FUZZ_RANGES = [
    {
      start: 2.5,
      end: 7,
      factor: 0.15
    },
    {
      start: 7,
      end: 20,
      factor: 0.1
    },
    {
      start: 20,
      end: Infinity,
      factor: 0.05
    }
  ];
  function get_fuzz_range(interval, elapsed_days, maximum_interval) {
    let delta = 1;
    for (const range of FUZZ_RANGES) {
      delta += range.factor * Math.max(Math.min(interval, range.end) - range.start, 0);
    }
    interval = Math.min(interval, maximum_interval);
    let min_ivl = Math.max(2, Math.round(interval - delta));
    const max_ivl = Math.min(Math.round(interval + delta), maximum_interval);
    if (interval > elapsed_days) {
      min_ivl = Math.max(min_ivl, elapsed_days + 1);
    }
    min_ivl = Math.min(min_ivl, max_ivl);
    return { min_ivl, max_ivl };
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function roundTo(num, decimals) {
    const factor = 10 ** decimals;
    return Math.round(num * factor) / factor;
  }
  function dateDiffInDays(last, cur) {
    const utc1 = Date.UTC(
      last.getUTCFullYear(),
      last.getUTCMonth(),
      last.getUTCDate()
    );
    const utc2 = Date.UTC(
      cur.getUTCFullYear(),
      cur.getUTCMonth(),
      cur.getUTCDate()
    );
    return Math.floor(
      (utc2 - utc1) / 864e5
      /** 1000 * 60 * 60 * 24*/
    );
  }
  var ConvertStepUnitToMinutes = (step) => {
    const unit = step.slice(-1);
    const value = parseInt(step.slice(0, -1), 10);
    if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
      throw new FSRSValidationError(`Invalid step value: ${step}`);
    }
    switch (unit) {
      case "m":
        return value;
      case "h":
        return value * 60;
      case "d":
        return value * 1440;
      default:
        throw new FSRSValidationError(
          `Invalid step unit: ${step}, expected m/h/d`
        );
    }
  };
  var BasicLearningStepsStrategy = (params, state, cur_step) => {
    const learning_steps = state === State.Relearning || state === State.Review ? params.relearning_steps : params.learning_steps;
    const steps_length = learning_steps.length;
    if (steps_length === 0 || cur_step >= steps_length) return {};
    const firstStep = learning_steps[0];
    const toMinutes = ConvertStepUnitToMinutes;
    const getAgainInterval = () => {
      return toMinutes(firstStep);
    };
    const getHardInterval = () => {
      if (steps_length === 1) return Math.round(toMinutes(firstStep) * 1.5);
      const nextStep = learning_steps[1];
      return Math.round((toMinutes(firstStep) + toMinutes(nextStep)) / 2);
    };
    const getStepInfo = (index) => {
      if (index < 0 || index >= steps_length) {
        return null;
      } else {
        return learning_steps[index];
      }
    };
    const getGoodMinutes = (step) => {
      return toMinutes(step);
    };
    const result = {};
    const step_info = getStepInfo(Math.max(0, cur_step));
    if (state === State.Review) {
      result[Rating.Again] = {
        scheduled_minutes: toMinutes(step_info),
        next_step: 0
      };
      return result;
    } else {
      result[Rating.Again] = {
        scheduled_minutes: getAgainInterval(),
        next_step: 0
      };
      result[Rating.Hard] = {
        scheduled_minutes: getHardInterval(),
        next_step: cur_step
      };
      const next_info = getStepInfo(cur_step + 1);
      if (next_info) {
        const nextMin = getGoodMinutes(next_info);
        if (nextMin) {
          result[Rating.Good] = {
            scheduled_minutes: Math.round(nextMin),
            next_step: cur_step + 1
          };
        }
      }
    }
    return result;
  };
  function DefaultInitSeedStrategy() {
    const time = this.review_time.getTime();
    const reps = this.current.reps;
    const mul = this.current.difficulty * this.current.stability;
    return `${time}_${reps}_${mul}`;
  }
  var StrategyMode = /* @__PURE__ */ ((StrategyMode2) => {
    StrategyMode2["SCHEDULER"] = "Scheduler";
    StrategyMode2["LEARNING_STEPS"] = "LearningSteps";
    StrategyMode2["SEED"] = "Seed";
    return StrategyMode2;
  })(StrategyMode || {});
  var AbstractScheduler = class {
    // init
    constructor(card, now, algorithm, strategies) {
      __publicField(this, "last");
      __publicField(this, "current");
      __publicField(this, "review_time");
      __publicField(this, "next", /* @__PURE__ */ new Map());
      __publicField(this, "algorithm");
      __publicField(this, "strategies");
      __publicField(this, "elapsed_days", 0);
      this.algorithm = algorithm;
      this.last = TypeConvert.card(card);
      this.current = TypeConvert.card(card);
      this.review_time = TypeConvert.time(now);
      this.strategies = strategies;
      this.init();
    }
    checkGrade(grade) {
      if (!Number.isFinite(grade) || grade < 1 || grade > 4) {
        throw new FSRSValidationError(`Invalid grade "${grade}",expected 1-4`);
      }
    }
    init() {
      const { state, last_review } = this.current;
      let interval = 0;
      if (state !== State.New && last_review) {
        interval = dateDiffInDays(last_review, this.review_time);
      }
      this.current.last_review = this.review_time;
      this.elapsed_days = interval;
      this.current.elapsed_days = interval;
      this.current.reps += 1;
      let seed_strategy = DefaultInitSeedStrategy;
      if (this.strategies) {
        const custom_strategy = this.strategies.get(StrategyMode.SEED);
        if (custom_strategy) {
          seed_strategy = custom_strategy;
        }
      }
      this.algorithm.seed = seed_strategy.call(this);
    }
    preview() {
      return {
        [Rating.Again]: this.review(Rating.Again),
        [Rating.Hard]: this.review(Rating.Hard),
        [Rating.Good]: this.review(Rating.Good),
        [Rating.Easy]: this.review(Rating.Easy),
        [Symbol.iterator]: this.previewIterator.bind(this)
      };
    }
    *previewIterator() {
      for (const grade of Grades) {
        yield this.review(grade);
      }
    }
    review(grade) {
      const { state } = this.last;
      let item;
      this.checkGrade(grade);
      switch (state) {
        case State.New:
          item = this.newState(grade);
          break;
        case State.Learning:
        case State.Relearning:
          item = this.learningState(grade);
          break;
        case State.Review:
          item = this.reviewState(grade);
          break;
      }
      return item;
    }
    buildLog(rating) {
      const { last_review, due, elapsed_days } = this.last;
      return {
        rating,
        state: this.current.state,
        due: last_review || due,
        stability: this.current.stability,
        difficulty: this.current.difficulty,
        elapsed_days: this.elapsed_days,
        last_elapsed_days: elapsed_days,
        scheduled_days: this.current.scheduled_days,
        learning_steps: this.current.learning_steps,
        review: this.review_time
      };
    }
  };
  var Alea = class {
    constructor(seed) {
      __publicField(this, "c");
      __publicField(this, "s0");
      __publicField(this, "s1");
      __publicField(this, "s2");
      const mash = Mash();
      this.c = 1;
      this.s0 = mash(" ");
      this.s1 = mash(" ");
      this.s2 = mash(" ");
      if (seed == null) seed = Date.now();
      this.s0 -= mash(seed);
      if (this.s0 < 0) this.s0 += 1;
      this.s1 -= mash(seed);
      if (this.s1 < 0) this.s1 += 1;
      this.s2 -= mash(seed);
      if (this.s2 < 0) this.s2 += 1;
    }
    next() {
      const t = 2091639 * this.s0 + this.c * 23283064365386963e-26;
      this.s0 = this.s1;
      this.s1 = this.s2;
      this.c = t | 0;
      this.s2 = t - this.c;
      return this.s2;
    }
    set state(state) {
      this.c = state.c;
      this.s0 = state.s0;
      this.s1 = state.s1;
      this.s2 = state.s2;
    }
    get state() {
      return {
        c: this.c,
        s0: this.s0,
        s1: this.s1,
        s2: this.s2
      };
    }
  };
  function Mash() {
    let n = 4022871197;
    return function mash(data) {
      data = String(data);
      for (let i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        let h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 23283064365386963e-26;
    };
  }
  function alea(seed) {
    const xg = new Alea(seed);
    const prng = () => xg.next();
    prng.int32 = () => xg.next() * 4294967296 | 0;
    prng.double = () => prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
    prng.state = () => xg.state;
    prng.importState = (state) => {
      xg.state = state;
      return prng;
    };
    return prng;
  }
  var version = "5.4.2";
  var default_request_retention = 0.9;
  var default_maximum_interval = 36500;
  var default_enable_fuzz = false;
  var default_enable_short_term = true;
  var default_learning_steps = Object.freeze([
    "1m",
    "10m"
  ]);
  var default_relearning_steps = Object.freeze([
    "10m"
  ]);
  var FSRSVersion = `v${version} using FSRS-6.0`;
  var S_MIN = 1e-3;
  var INIT_S_MAX = 100;
  var FSRS5_DEFAULT_DECAY = 0.5;
  var FSRS6_DEFAULT_DECAY = 0.1542;
  var default_w = Object.freeze([
    0.212,
    1.2931,
    2.3065,
    8.2956,
    6.4133,
    0.8334,
    3.0194,
    1e-3,
    1.8722,
    0.1666,
    0.796,
    1.4835,
    0.0614,
    0.2629,
    1.6483,
    0.6014,
    1.8729,
    0.5425,
    0.0912,
    0.0658,
    FSRS6_DEFAULT_DECAY
  ]);
  var W17_W18_Ceiling = 2;
  var CLAMP_PARAMETERS = (w17_w18_ceiling, enable_short_term = default_enable_short_term) => [
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [1, 10],
    [1e-3, 4],
    [1e-3, 4],
    [1e-3, 0.75],
    [0, 4.5],
    [0, 0.8],
    [1e-3, 3.5],
    [1e-3, 5],
    [1e-3, 0.25],
    [1e-3, 0.9],
    [0, 4],
    [0, 1],
    [1, 6],
    [0, w17_w18_ceiling],
    [0, w17_w18_ceiling],
    [
      enable_short_term ? 0.01 : 0,
      0.8
    ],
    [0.1, 0.8]
  ];
  var clipParameters = (parameters, numRelearningSteps, enableShortTerm = default_enable_short_term) => {
    const clip = CLAMP_PARAMETERS(W17_W18_Ceiling, enableShortTerm).slice(
      0,
      parameters.length
    );
    if (Math.max(0, numRelearningSteps) > 1) {
      const w11 = clamp(parameters[11] || 0, clip[11][0], clip[11][1]);
      const w13 = clamp(parameters[13] || 0, clip[13][0], clip[13][1]);
      const w14 = clamp(parameters[14] || 0, clip[14][0], clip[14][1]);
      const value = -(Math.log(w11) + Math.log(Math.pow(2, w13) - 1) + w14 * 0.3) / numRelearningSteps;
      const w17_w18_ceiling = clamp(
        roundTo(Math.sqrt(Math.max(value, 0)), 8),
        0.01,
        W17_W18_Ceiling
      );
      if (clip[17]) clip[17] = [clip[17][0], w17_w18_ceiling];
      if (clip[18]) clip[18] = [clip[18][0], w17_w18_ceiling];
    }
    return clip.map(
      ([min, max], index) => clamp(parameters[index] || 0, min, max)
    );
  };
  var migrateParameters = (parameters, numRelearningSteps = 0, enableShortTerm = default_enable_short_term) => {
    if (parameters === void 0) {
      return [...default_w];
    }
    switch (parameters.length) {
      case 21:
        return clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        );
      case 19:
        console.debug("[FSRS-6]auto fill w from 19 to 21 length");
        return clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        ).concat([0, FSRS5_DEFAULT_DECAY]);
      case 17: {
        const w = clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        );
        w[4] = +(w[5] * 2 + w[4]).toFixed(8);
        w[5] = +(Math.log(w[5] * 3 + 1) / 3).toFixed(8);
        w[6] = +(w[6] + 0.5).toFixed(8);
        console.debug("[FSRS-6]auto fill w from 17 to 21 length");
        return w.concat([0, 0, 0, FSRS5_DEFAULT_DECAY]);
      }
      default:
        console.warn("[FSRS]Invalid parameters length, using default parameters");
        return [...default_w];
    }
  };
  var generatorParameters = (props) => {
    var _a2, _b;
    const learning_steps = Array.isArray(props == null ? void 0 : props.learning_steps) ? props.learning_steps : default_learning_steps;
    const relearning_steps = Array.isArray(props == null ? void 0 : props.relearning_steps) ? props.relearning_steps : default_relearning_steps;
    const enable_short_term = (_a2 = props == null ? void 0 : props.enable_short_term) != null ? _a2 : default_enable_short_term;
    const w = migrateParameters(
      props == null ? void 0 : props.w,
      relearning_steps.length,
      enable_short_term
    );
    return {
      request_retention: (props == null ? void 0 : props.request_retention) || default_request_retention,
      maximum_interval: (props == null ? void 0 : props.maximum_interval) || default_maximum_interval,
      w,
      enable_fuzz: (_b = props == null ? void 0 : props.enable_fuzz) != null ? _b : default_enable_fuzz,
      enable_short_term,
      learning_steps,
      relearning_steps
    };
  };
  function createEmptyCard(now, afterHandler) {
    const emptyCard = {
      due: now ? TypeConvert.time(now) : /* @__PURE__ */ new Date(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      learning_steps: 0,
      state: State.New,
      last_review: void 0
    };
    if (afterHandler && typeof afterHandler === "function") {
      return afterHandler(emptyCard);
    } else {
      return emptyCard;
    }
  }
  var computeDecayFactor = (decayOrParams) => {
    const decay = typeof decayOrParams === "number" ? -decayOrParams : -decayOrParams[20];
    const factor = Math.exp(Math.pow(decay, -1) * Math.log(0.9)) - 1;
    return { decay, factor: roundTo(factor, 8) };
  };
  function forgetting_curve(decayOrParams, elapsed_days, stability) {
    const { decay, factor } = computeDecayFactor(decayOrParams);
    return roundTo(Math.pow(1 + factor * elapsed_days / stability, decay), 8);
  }
  var FSRSAlgorithm = class {
    constructor(params) {
      __publicField(this, "param");
      __publicField(this, "intervalModifier");
      __publicField(this, "_seed");
      __publicField(this, "prepare_parameters", (params) => {
        const generated = generatorParameters(params);
        generated.w = clipParameters(
          Array.from(generated.w),
          generated.relearning_steps.length,
          generated.enable_short_term
        );
        return generated;
      });
      /**
       * The formula used is :
       * $$R(t,S) = (1 + \text{FACTOR} \times \frac{t}{9 \cdot S})^{\text{DECAY}}$$
       * @param {number} elapsed_days t days since the last review
       * @param {number} stability Stability (interval when R=90%)
       * @return {number} r Retrievability (probability of recall)
       */
      __publicField(this, "forgetting_curve");
      this.param = new Proxy(
        this.prepare_parameters(params),
        this.params_handler_proxy()
      );
      this.intervalModifier = this.calculate_interval_modifier(
        this.param.request_retention
      );
      this.forgetting_curve = forgetting_curve.bind(this, this.param.w);
    }
    get interval_modifier() {
      return this.intervalModifier;
    }
    set seed(seed) {
      this._seed = seed;
    }
    /**
     * @see https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm#fsrs-5
     *
     * The formula used is: $$I(r,s) = (r^{\frac{1}{DECAY}} - 1) / FACTOR \times s$$
     * @param request_retention 0<request_retention<=1,Requested retention rate
     * @throws {Error} Requested retention rate should be in the range (0,1]
     */
    calculate_interval_modifier(request_retention) {
      if (request_retention <= 0 || request_retention > 1) {
        throw new FSRSValidationError(
          "Requested retention rate should be in the range (0,1]"
        );
      }
      const { decay, factor } = computeDecayFactor(this.param.w);
      return roundTo((Math.pow(request_retention, 1 / decay) - 1) / factor, 8);
    }
    /**
     * Get the parameters of the algorithm.
     */
    get parameters() {
      return this.param;
    }
    /**
     * Set the parameters of the algorithm.
     * @param params Partial<FSRSParameters>
     */
    set parameters(params) {
      this.update_parameters(params);
    }
    params_handler_proxy() {
      const _this = this;
      return {
        set: function(target, prop, value) {
          if (prop === "request_retention" && Number.isFinite(value)) {
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(value)
            );
          } else if (prop === "w") {
            value = migrateParameters(
              value,
              target.relearning_steps.length,
              target.enable_short_term
            );
            value = clipParameters(
              Array.from(value),
              target.relearning_steps.length,
              target.enable_short_term
            );
            _this.forgetting_curve = forgetting_curve.bind(this, value);
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(target.request_retention)
            );
          }
          Reflect.set(target, prop, value);
          return true;
        }
      };
    }
    update_parameters(params) {
      const _params = this.prepare_parameters(params);
      for (const key3 in _params) {
        const paramKey = key3;
        this.param[paramKey] = _params[paramKey];
      }
    }
    /**
       * The formula used is :
       * $$ S_0(G) = w_{G-1}$$
       * $$S_0 = \max \lbrace S_0,0.1\rbrace $$
    
       * @param g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
       * @return Stability (interval when R=90%)
       */
    init_stability(g) {
      return Math.max(this.param.w[g - 1], 0.1);
    }
    /**
     * The formula used is :
     * $$D_0(G) = w_4 - e^{(G-1) \cdot w_5} + 1 $$
     * $$D_0 = \min \lbrace \max \lbrace D_0(G),1 \rbrace,10 \rbrace$$
     * where the $$D_0(1)=w_4$$ when the first rating is good.
     *
     * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return {number} Difficulty $$D \in [1,10]$$
     */
    init_difficulty(g) {
      const w = this.param.w;
      const d = w[4] - Math.exp((g - 1) * w[5]) + 1;
      return roundTo(d, 8);
    }
    /**
     * If fuzzing is disabled or ivl is less than 2.5, it returns the original interval.
     * @param {number} ivl - The interval to be fuzzed.
     * @param {number} elapsed_days t days since the last review
     * @return {number} - The fuzzed interval.
     **/
    apply_fuzz(ivl, elapsed_days) {
      if (!this.param.enable_fuzz || ivl < 2.5) return Math.round(ivl);
      const generator = alea(this._seed);
      const fuzz_factor = generator();
      const { min_ivl, max_ivl } = get_fuzz_range(
        ivl,
        elapsed_days,
        this.param.maximum_interval
      );
      return Math.floor(fuzz_factor * (max_ivl - min_ivl + 1) + min_ivl);
    }
    /**
     *   @see The formula used is : {@link FSRSAlgorithm.calculate_interval_modifier}
     *   @param {number} s - Stability (interval when R=90%)
     *   @param {number} elapsed_days t days since the last review
     */
    next_interval(s, elapsed_days) {
      const newInterval = Math.min(
        Math.max(1, Math.round(s * this.intervalModifier)),
        this.param.maximum_interval
      );
      return this.apply_fuzz(newInterval, elapsed_days);
    }
    /**
     * @see https://github.com/open-spaced-repetition/fsrs4anki/issues/697
     */
    linear_damping(delta_d, old_d) {
      return roundTo(delta_d * (10 - old_d) / 9, 8);
    }
    /**
     * The formula used is :
     * $$\text{delta}_d = -w_6 \cdot (g - 3)$$
     * $$\text{next}_d = D + \text{linear damping}(\text{delta}_d , D)$$
     * $$D^\prime(D,R) = w_7 \cdot D_0(4) +(1 - w_7) \cdot \text{next}_d$$
     * @param {number} d Difficulty $$D \in [1,10]$$
     * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return {number} $$\text{next}_D$$
     */
    next_difficulty(d, g) {
      const delta_d = -this.param.w[6] * (g - 3);
      const next_d = d + this.linear_damping(delta_d, d);
      return clamp(
        this.mean_reversion(this.init_difficulty(Rating.Easy), next_d),
        1,
        10
      );
    }
    /**
     * The formula used is :
     * $$w_7 \cdot \text{init} +(1 - w_7) \cdot \text{current}$$
     * @param {number} init $$w_2 : D_0(3) = w_2 + (R-2) \cdot w_3= w_2$$
     * @param {number} current $$D - w_6 \cdot (R - 2)$$
     * @return {number} difficulty
     */
    mean_reversion(init, current) {
      const w = this.param.w;
      return roundTo(w[7] * init + (1 - w[7]) * current, 8);
    }
    /**
     * The formula used is :
     * $$S^\prime_r(D,S,R,G) = S\cdot(e^{w_8}\cdot (11-D)\cdot S^{-w_9}\cdot(e^{w_{10}\cdot(1-R)}-1)\cdot w_{15}(\text{if} G=2) \cdot w_{16}(\text{if} G=4)+1)$$
     * @param {number} d Difficulty D \in [1,10]
     * @param {number} s Stability (interval when R=90%)
     * @param {number} r Retrievability (probability of recall)
     * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
     * @return {number} S^\prime_r new stability after recall
     */
    next_recall_stability(d, s, r, g) {
      const w = this.param.w;
      const hard_penalty = Rating.Hard === g ? w[15] : 1;
      const easy_bound = Rating.Easy === g ? w[16] : 1;
      return roundTo(
        clamp(
          s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hard_penalty * easy_bound),
          S_MIN,
          36500
        ),
        8
      );
    }
    /**
     * The formula used is :
     * $$S^\prime_f(D,S,R) = w_{11}\cdot D^{-w_{12}}\cdot ((S+1)^{w_{13}}-1) \cdot e^{w_{14}\cdot(1-R)}$$
     * enable_short_term = true : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, \frac{S}{e^{w_{17} \cdot w_{18}}} \rbrace$$
     * enable_short_term = false : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, S \rbrace$$
     * @param {number} d Difficulty D \in [1,10]
     * @param {number} s Stability (interval when R=90%)
     * @param {number} r Retrievability (probability of recall)
     * @return {number} S^\prime_f new stability after forgetting
     */
    next_forget_stability(d, s, r) {
      const w = this.param.w;
      return roundTo(
        clamp(
          w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]),
          S_MIN,
          36500
        ),
        8
      );
    }
    /**
     * The formula used is :
     * $$S^\prime_s(S,G) = S \cdot e^{w_{17} \cdot (G-3+w_{18})}$$
     * @param {number} s Stability (interval when R=90%)
     * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
     */
    next_short_term_stability(s, g) {
      const w = this.param.w;
      const sinc = Math.pow(s, -w[19]) * Math.exp(w[17] * (g - 3 + w[18]));
      const maskedSinc = g >= Rating.Hard ? Math.max(sinc, 1) : sinc;
      return roundTo(clamp(s * maskedSinc, S_MIN, 36500), 8);
    }
    /**
     * Calculates the next state of memory based on the current state, time elapsed, and grade.
     *
     * @param memory_state - The current state of memory, which can be null.
     * @param t - The time elapsed since the last review.
     * @param {Rating} g Grade (Rating[0.Manual,1.Again,2.Hard,3.Good,4.Easy])
     * @param r - Optional retrievability value. If not provided, it will be calculated.
     * @returns The next state of memory with updated difficulty and stability.
     */
    next_state(memory_state, t, g, r) {
      const { difficulty: d, stability: s } = memory_state != null ? memory_state : {
        difficulty: 0,
        stability: 0
      };
      if (t < 0) {
        throw new FSRSValidationError(`Invalid delta_t "${t}"`);
      }
      if (g < 0 || g > 4) {
        throw new FSRSValidationError(`Invalid grade "${g}"`);
      }
      if (d === 0 && s === 0) {
        return {
          difficulty: clamp(this.init_difficulty(g), 1, 10),
          stability: this.init_stability(g)
        };
      }
      if (g === 0) {
        return {
          difficulty: d,
          stability: s
        };
      }
      if (d < 1 || s < S_MIN) {
        throw new FSRSValidationError(
          `Invalid memory state { difficulty: ${d}, stability: ${s} }`
        );
      }
      const w = this.param.w;
      r = typeof r === "number" ? r : this.forgetting_curve(t, s);
      let new_s;
      if (t === 0 && this.param.enable_short_term) {
        new_s = this.next_short_term_stability(s, g);
      } else if (g === 1) {
        const s_after_fail = this.next_forget_stability(d, s, r);
        let [w_17, w_18] = [0, 0];
        if (this.param.enable_short_term) {
          w_17 = w[17];
          w_18 = w[18];
        }
        const next_s_min = s / Math.exp(w_17 * w_18);
        new_s = clamp(roundTo(next_s_min, 8), S_MIN, s_after_fail);
      } else {
        new_s = this.next_recall_stability(d, s, r, g);
      }
      const new_d = this.next_difficulty(d, g);
      return { difficulty: new_d, stability: new_s };
    }
  };
  var BasicScheduler = class extends AbstractScheduler {
    constructor(card, now, algorithm, strategies) {
      super(card, now, algorithm, strategies);
      __publicField(this, "learningStepsStrategy");
      let learningStepStrategy = BasicLearningStepsStrategy;
      if (this.strategies) {
        const custom_strategy = this.strategies.get(StrategyMode.LEARNING_STEPS);
        if (custom_strategy) {
          learningStepStrategy = custom_strategy;
        }
      }
      this.learningStepsStrategy = learningStepStrategy;
    }
    getLearningInfo(card, grade) {
      var _a2, _b, _c, _d;
      const parameters = this.algorithm.parameters;
      card.learning_steps = card.learning_steps || 0;
      const steps_strategy = this.learningStepsStrategy(
        parameters,
        card.state,
        card.learning_steps
      );
      const scheduled_minutes = Math.max(
        0,
        (_b = (_a2 = steps_strategy[grade]) == null ? void 0 : _a2.scheduled_minutes) != null ? _b : 0
      );
      const next_steps = Math.max(0, (_d = (_c = steps_strategy[grade]) == null ? void 0 : _c.next_step) != null ? _d : 0);
      return {
        scheduled_minutes,
        next_steps
      };
    }
    /**
     * @description This function applies the learning steps based on the current card's state and grade.
     */
    applyLearningSteps(nextCard, grade, to_state) {
      const { scheduled_minutes, next_steps } = this.getLearningInfo(
        this.current,
        grade
      );
      if (scheduled_minutes > 0 && scheduled_minutes < 1440) {
        nextCard.learning_steps = next_steps;
        nextCard.scheduled_days = 0;
        nextCard.state = to_state;
        nextCard.due = date_scheduler(
          this.review_time,
          Math.round(scheduled_minutes),
          false
          /** true:days false: minute */
        );
      } else {
        nextCard.state = State.Review;
        if (scheduled_minutes >= 1440) {
          nextCard.learning_steps = next_steps;
          nextCard.due = date_scheduler(
            this.review_time,
            Math.round(scheduled_minutes),
            false
            /** true:days false: minute */
          );
          nextCard.scheduled_days = Math.floor(scheduled_minutes / 1440);
        } else {
          nextCard.learning_steps = 0;
          const interval = this.algorithm.next_interval(
            nextCard.stability,
            this.elapsed_days
          );
          nextCard.scheduled_days = interval;
          nextCard.due = date_scheduler(this.review_time, interval, true);
        }
      }
    }
    newState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const next = this.next_ds(this.elapsed_days, grade);
      this.applyLearningSteps(next, grade, State.Learning);
      const item = {
        card: next,
        log: this.buildLog(grade)
      };
      this.next.set(grade, item);
      return item;
    }
    learningState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const next = this.next_ds(this.elapsed_days, grade);
      this.applyLearningSteps(
        next,
        grade,
        this.last.state
        /** Learning or Relearning */
      );
      const item = {
        card: next,
        log: this.buildLog(grade)
      };
      this.next.set(grade, item);
      return item;
    }
    reviewState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const interval = this.elapsed_days;
      const retrievability2 = this.algorithm.forgetting_curve(
        interval,
        this.current.stability
      );
      const next_again = this.next_ds(interval, Rating.Again, retrievability2);
      const next_hard = this.next_ds(interval, Rating.Hard, retrievability2);
      const next_good = this.next_ds(interval, Rating.Good, retrievability2);
      const next_easy = this.next_ds(interval, Rating.Easy, retrievability2);
      this.next_interval(next_hard, next_good, next_easy, interval);
      this.next_state(next_hard, next_good, next_easy);
      this.applyLearningSteps(next_again, Rating.Again, State.Relearning);
      next_again.lapses += 1;
      const item_again = {
        card: next_again,
        log: this.buildLog(Rating.Again)
      };
      const item_hard = {
        card: next_hard,
        log: super.buildLog(Rating.Hard)
      };
      const item_good = {
        card: next_good,
        log: super.buildLog(Rating.Good)
      };
      const item_easy = {
        card: next_easy,
        log: super.buildLog(Rating.Easy)
      };
      this.next.set(Rating.Again, item_again);
      this.next.set(Rating.Hard, item_hard);
      this.next.set(Rating.Good, item_good);
      this.next.set(Rating.Easy, item_easy);
      return this.next.get(grade);
    }
    /**
     * Review next_ds
     */
    next_ds(t, g, r) {
      const next_state = this.algorithm.next_state(
        {
          difficulty: this.current.difficulty,
          stability: this.current.stability
        },
        t,
        g,
        r
      );
      const card = TypeConvert.card(this.current);
      card.difficulty = next_state.difficulty;
      card.stability = next_state.stability;
      return card;
    }
    /**
     * Review next_interval
     */
    next_interval(next_hard, next_good, next_easy, interval) {
      let hard_interval, good_interval;
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
      good_interval = this.algorithm.next_interval(next_good.stability, interval);
      hard_interval = Math.min(hard_interval, good_interval);
      good_interval = Math.max(good_interval, hard_interval + 1);
      const easy_interval = Math.max(
        this.algorithm.next_interval(next_easy.stability, interval),
        good_interval + 1
      );
      next_hard.scheduled_days = hard_interval;
      next_hard.due = date_scheduler(this.review_time, hard_interval, true);
      next_good.scheduled_days = good_interval;
      next_good.due = date_scheduler(this.review_time, good_interval, true);
      next_easy.scheduled_days = easy_interval;
      next_easy.due = date_scheduler(this.review_time, easy_interval, true);
    }
    /**
     * Review next_state
     */
    next_state(next_hard, next_good, next_easy) {
      next_hard.state = State.Review;
      next_hard.learning_steps = 0;
      next_good.state = State.Review;
      next_good.learning_steps = 0;
      next_easy.state = State.Review;
      next_easy.learning_steps = 0;
    }
  };
  var LongTermScheduler = class extends AbstractScheduler {
    newState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      this.current.scheduled_days = 0;
      this.current.elapsed_days = 0;
      const first_interval = 0;
      const next_again = this.next_ds(first_interval, Rating.Again);
      const next_hard = this.next_ds(first_interval, Rating.Hard);
      const next_good = this.next_ds(first_interval, Rating.Good);
      const next_easy = this.next_ds(first_interval, Rating.Easy);
      this.next_interval(
        next_again,
        next_hard,
        next_good,
        next_easy,
        first_interval
      );
      this.next_state(next_again, next_hard, next_good, next_easy);
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    next_ds(t, g, r) {
      const next_state = this.algorithm.next_state(
        {
          difficulty: this.current.difficulty,
          stability: this.current.stability
        },
        t,
        g,
        r
      );
      const card = TypeConvert.card(this.current);
      card.difficulty = next_state.difficulty;
      card.stability = next_state.stability;
      return card;
    }
    /**
     * @see https://github.com/open-spaced-repetition/ts-fsrs/issues/98#issuecomment-2241923194
     */
    learningState(grade) {
      return this.reviewState(grade);
    }
    reviewState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const interval = this.elapsed_days;
      const retrievability2 = this.algorithm.forgetting_curve(
        interval,
        this.current.stability
      );
      const next_again = this.next_ds(interval, Rating.Again, retrievability2);
      const next_hard = this.next_ds(interval, Rating.Hard, retrievability2);
      const next_good = this.next_ds(interval, Rating.Good, retrievability2);
      const next_easy = this.next_ds(interval, Rating.Easy, retrievability2);
      this.next_interval(next_again, next_hard, next_good, next_easy, interval);
      this.next_state(next_again, next_hard, next_good, next_easy);
      next_again.lapses += 1;
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    /**
     * Review/New next_interval
     */
    next_interval(next_again, next_hard, next_good, next_easy, interval) {
      let again_interval, hard_interval, good_interval, easy_interval;
      again_interval = this.algorithm.next_interval(
        next_again.stability,
        interval
      );
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
      good_interval = this.algorithm.next_interval(next_good.stability, interval);
      easy_interval = this.algorithm.next_interval(next_easy.stability, interval);
      again_interval = Math.min(again_interval, hard_interval);
      hard_interval = Math.max(hard_interval, again_interval + 1);
      good_interval = Math.max(good_interval, hard_interval + 1);
      easy_interval = Math.max(easy_interval, good_interval + 1);
      next_again.scheduled_days = again_interval;
      next_again.due = date_scheduler(this.review_time, again_interval, true);
      next_hard.scheduled_days = hard_interval;
      next_hard.due = date_scheduler(this.review_time, hard_interval, true);
      next_good.scheduled_days = good_interval;
      next_good.due = date_scheduler(this.review_time, good_interval, true);
      next_easy.scheduled_days = easy_interval;
      next_easy.due = date_scheduler(this.review_time, easy_interval, true);
    }
    /**
     * Review/New next_state
     */
    next_state(next_again, next_hard, next_good, next_easy) {
      next_again.state = State.Review;
      next_again.learning_steps = 0;
      next_hard.state = State.Review;
      next_hard.learning_steps = 0;
      next_good.state = State.Review;
      next_good.learning_steps = 0;
      next_easy.state = State.Review;
      next_easy.learning_steps = 0;
    }
    update_next(next_again, next_hard, next_good, next_easy) {
      const item_again = {
        card: next_again,
        log: this.buildLog(Rating.Again)
      };
      const item_hard = {
        card: next_hard,
        log: super.buildLog(Rating.Hard)
      };
      const item_good = {
        card: next_good,
        log: super.buildLog(Rating.Good)
      };
      const item_easy = {
        card: next_easy,
        log: super.buildLog(Rating.Easy)
      };
      this.next.set(Rating.Again, item_again);
      this.next.set(Rating.Hard, item_hard);
      this.next.set(Rating.Good, item_good);
      this.next.set(Rating.Easy, item_easy);
    }
  };
  var Reschedule = class {
    /**
     * Creates an instance of the `Reschedule` class.
     * @param fsrs - An instance of the FSRS class used for scheduling.
     */
    constructor(fsrs3) {
      __publicField(this, "fsrs");
      this.fsrs = fsrs3;
    }
    /**
     * Replays a review for a card and determines the next review date based on the given rating.
     * @param card - The card being reviewed.
     * @param reviewed - The date the card was reviewed.
     * @param rating - The grade given to the card during the review.
     * @returns A `RecordLogItem` containing the updated card and review log.
     */
    replay(card, reviewed, rating) {
      return this.fsrs.next(card, reviewed, rating);
    }
    /**
     * Processes a manual review for a card, allowing for custom state, stability, difficulty, and due date.
     * @param card - The card being reviewed.
     * @param state - The state of the card after the review.
     * @param reviewed - The date the card was reviewed.
     * @param elapsed_days - The number of days since the last review.
     * @param stability - (Optional) The stability of the card.
     * @param difficulty - (Optional) The difficulty of the card.
     * @param due - (Optional) The due date for the next review.
     * @returns A `RecordLogItem` containing the updated card and review log.
     * @throws Will throw an error if the state or due date is not provided when required.
     */
    handleManualRating(card, state, reviewed, elapsed_days, stability, difficulty, due) {
      if (typeof state === "undefined") {
        throw new FSRSValidationError(
          "reschedule: state is required for manual rating"
        );
      }
      let log;
      let next_card;
      if (state === State.New) {
        log = {
          rating: Rating.Manual,
          state,
          due: due != null ? due : reviewed,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsed_days,
          last_elapsed_days: card.elapsed_days,
          scheduled_days: card.scheduled_days,
          learning_steps: card.learning_steps,
          review: reviewed
        };
        next_card = createEmptyCard(reviewed);
        next_card.last_review = reviewed;
      } else {
        if (typeof due === "undefined") {
          throw new FSRSValidationError(
            "reschedule: due is required for manual rating"
          );
        }
        const scheduled_days = date_diff(due, reviewed, "days");
        log = {
          rating: Rating.Manual,
          state: card.state,
          due: card.last_review || card.due,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsed_days,
          last_elapsed_days: card.elapsed_days,
          scheduled_days: card.scheduled_days,
          learning_steps: card.learning_steps,
          review: reviewed
        };
        next_card = {
          ...card,
          state,
          due,
          last_review: reviewed,
          stability: stability || card.stability,
          difficulty: difficulty || card.difficulty,
          elapsed_days,
          scheduled_days,
          reps: card.reps + 1
        };
      }
      return { card: next_card, log };
    }
    /**
     * Reschedules a card based on its review history.
     *
     * @param current_card - The card to be rescheduled.
     * @param reviews - An array of review history objects.
     * @returns An array of record log items representing the rescheduling process.
     */
    reschedule(current_card, reviews) {
      const collections = [];
      let cur_card = createEmptyCard(current_card.due);
      for (const review2 of reviews) {
        let item;
        review2.review = TypeConvert.time(review2.review);
        if (review2.rating === Rating.Manual) {
          let interval = 0;
          if (cur_card.state !== State.New && cur_card.last_review) {
            interval = date_diff(review2.review, cur_card.last_review, "days");
          }
          item = this.handleManualRating(
            cur_card,
            review2.state,
            review2.review,
            interval,
            review2.stability,
            review2.difficulty,
            review2.due ? TypeConvert.time(review2.due) : void 0
          );
        } else {
          item = this.replay(cur_card, review2.review, review2.rating);
        }
        collections.push(item);
        cur_card = item.card;
      }
      return collections;
    }
    calculateManualRecord(current_card, now, record_log_item, update_memory) {
      if (!record_log_item) {
        return null;
      }
      const { card: reschedule_card, log } = record_log_item;
      const cur_card = TypeConvert.card(current_card);
      if (cur_card.due.getTime() === reschedule_card.due.getTime()) {
        return null;
      }
      cur_card.scheduled_days = date_diff(
        reschedule_card.due,
        cur_card.due,
        "days"
      );
      return this.handleManualRating(
        cur_card,
        reschedule_card.state,
        TypeConvert.time(now),
        log.elapsed_days,
        update_memory ? reschedule_card.stability : void 0,
        update_memory ? reschedule_card.difficulty : void 0,
        reschedule_card.due
      );
    }
  };
  function applyAfterHandler(value, afterHandler) {
    return typeof afterHandler === "function" ? afterHandler(value) : value;
  }
  var FSRS = class extends FSRSAlgorithm {
    constructor(param) {
      super(param);
      __publicField(this, "strategyHandler", /* @__PURE__ */ new Map());
      __publicField(this, "Scheduler");
      const { enable_short_term } = this.parameters;
      this.Scheduler = enable_short_term ? BasicScheduler : LongTermScheduler;
    }
    params_handler_proxy() {
      const _this = this;
      return {
        set: function(target, prop, value) {
          if (prop === "request_retention" && Number.isFinite(value)) {
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(value)
            );
          } else if (prop === "enable_short_term") {
            _this.Scheduler = value === true ? BasicScheduler : LongTermScheduler;
          } else if (prop === "w") {
            value = migrateParameters(
              value,
              target.relearning_steps.length,
              target.enable_short_term
            );
            value = clipParameters(
              Array.from(value),
              target.relearning_steps.length,
              target.enable_short_term
            );
            _this.forgetting_curve = forgetting_curve.bind(this, value);
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(target.request_retention)
            );
          }
          Reflect.set(target, prop, value);
          return true;
        }
      };
    }
    useStrategy(mode, handler) {
      this.strategyHandler.set(mode, handler);
      return this;
    }
    clearStrategy(mode) {
      if (mode) {
        this.strategyHandler.delete(mode);
      } else {
        this.strategyHandler.clear();
      }
      return this;
    }
    getScheduler(card, now) {
      const schedulerStrategy = this.strategyHandler.get(
        StrategyMode.SCHEDULER
      );
      const Scheduler = schedulerStrategy || this.Scheduler;
      const instance = new Scheduler(card, now, this, this.strategyHandler);
      return instance;
    }
    /**
     * Display the collection of cards and logs for the four scenarios after scheduling the card at the current time.
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const card: Card = createEmptyCard(new Date());
     * const f = fsrs();
     * const recordLog = f.repeat(card, new Date());
     * ```
     * @example
     * ```typescript
     * interface RevLogUnchecked
     *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
     *   cid: string;
     *   due: Date | number;
     *   state: StateType;
     *   review: Date | number;
     *   rating: RatingType;
     * }
     *
     * interface RepeatRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked;
     * }
     *
     * function repeatAfterHandler(recordLog: RecordLog) {
     *     const record: { [key in Grade]: RepeatRecordLog } = {} as {
     *       [key in Grade]: RepeatRecordLog;
     *     };
     *     for (const grade of Grades) {
     *       record[grade] = {
     *         card: {
     *           ...(recordLog[grade].card as Card & { cid: string }),
     *           due: recordLog[grade].card.due.getTime(),
     *           state: State[recordLog[grade].card.state] as StateType,
     *           last_review: recordLog[grade].card.last_review
     *             ? recordLog[grade].card.last_review!.getTime()
     *             : null,
     *         },
     *         log: {
     *           ...recordLog[grade].log,
     *           cid: (recordLog[grade].card as Card & { cid: string }).cid,
     *           due: recordLog[grade].log.due.getTime(),
     *           review: recordLog[grade].log.review.getTime(),
     *           state: State[recordLog[grade].log.state] as StateType,
     *           rating: Rating[recordLog[grade].log.rating] as RatingType,
     *         },
     *       };
     *     }
     *     return record;
     * }
     * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
     * const f = fsrs();
     * const recordLog = f.repeat(card, new Date(), repeatAfterHandler);
     * ```
     */
    repeat(card, now, afterHandler) {
      const instance = this.getScheduler(card, now);
      const recordLog = instance.preview();
      return applyAfterHandler(recordLog, afterHandler);
    }
    /**
     * Display the collection of cards and logs for the card scheduled at the current time, after applying a specific grade rating.
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param grade Rating of the review (Again, Hard, Good, Easy)
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const card: Card = createEmptyCard(new Date());
     * const f = fsrs();
     * const recordLogItem = f.next(card, new Date(), Rating.Again);
     * ```
     * @example
     * ```typescript
     * interface RevLogUnchecked
     *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
     *   cid: string;
     *   due: Date | number;
     *   state: StateType;
     *   review: Date | number;
     *   rating: RatingType;
     * }
     *
     * interface NextRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked;
     * }
     *
    function nextAfterHandler(recordLogItem: RecordLogItem) {
      const recordItem = {
        card: {
          ...(recordLogItem.card as Card & { cid: string }),
          due: recordLogItem.card.due.getTime(),
          state: State[recordLogItem.card.state] as StateType,
          last_review: recordLogItem.card.last_review
            ? recordLogItem.card.last_review!.getTime()
            : null,
        },
        log: {
          ...recordLogItem.log,
          cid: (recordLogItem.card as Card & { cid: string }).cid,
          due: recordLogItem.log.due.getTime(),
          review: recordLogItem.log.review.getTime(),
          state: State[recordLogItem.log.state] as StateType,
          rating: Rating[recordLogItem.log.rating] as RatingType,
        },
      };
      return recordItem
    }
     * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
     * const f = fsrs();
     * const recordLogItem = f.repeat(card, new Date(), Rating.Again, nextAfterHandler);
     * ```
     */
    next(card, now, grade, afterHandler) {
      const instance = this.getScheduler(card, now);
      const g = TypeConvert.rating(grade);
      if (g === Rating.Manual) {
        throw new FSRSValidationError("Cannot review a manual rating");
      }
      const recordLogItem = instance.review(g);
      return applyAfterHandler(recordLogItem, afterHandler);
    }
    /**
     * Get the retrievability of the card
     * @param card  Card to be processed
     * @param now  Current time or scheduled time
     * @param format  default:true , Convert the result to another type. (Optional)
     * @returns  The retrievability of the card,if format is true, the result is a string, otherwise it is a number
     */
    get_retrievability(card, now, format = true) {
      const processedCard = TypeConvert.card(card);
      now = now ? TypeConvert.time(now) : /* @__PURE__ */ new Date();
      const t = processedCard.state !== State.New ? Math.max(date_diff(now, processedCard.last_review, "days"), 0) : 0;
      const r = processedCard.state !== State.New ? this.forgetting_curve(t, +processedCard.stability.toFixed(8)) : 0;
      return format ? `${(r * 100).toFixed(2)}%` : r;
    }
    /**
     *
     * @param card Card to be processed
     * @param log last review log
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now);
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now);
     * const { card, log } = repeatFormAfterHandler[Rating.Hard];
     * const rollbackFromAfterHandler = f.rollback(card, log);
     * ```
     *
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler);  //see method: createEmptyCard
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
     * const { card, log } = repeatFormAfterHandler[Rating.Hard];
     * const rollbackFromAfterHandler = f.rollback(card, log, cardAfterHandler);
     * ```
     */
    rollback(card, log, afterHandler) {
      const processedCard = TypeConvert.card(card);
      const processedLog = TypeConvert.review_log(log);
      if (processedLog.rating === Rating.Manual) {
        throw new FSRSValidationError("Cannot rollback a manual rating");
      }
      let last_due;
      let last_review;
      let last_lapses;
      switch (processedLog.state) {
        case State.New:
          last_due = processedLog.due;
          last_review = void 0;
          last_lapses = 0;
          break;
        case State.Learning:
        case State.Relearning:
        case State.Review:
          last_due = processedLog.review;
          last_review = processedLog.due;
          last_lapses = processedCard.lapses - (processedLog.rating === Rating.Again && processedLog.state === State.Review ? 1 : 0);
          break;
      }
      const prevCard = {
        ...processedCard,
        due: last_due,
        stability: processedLog.stability,
        difficulty: processedLog.difficulty,
        elapsed_days: processedLog.last_elapsed_days,
        scheduled_days: processedLog.scheduled_days,
        reps: Math.max(0, processedCard.reps - 1),
        lapses: Math.max(0, last_lapses),
        learning_steps: processedLog.learning_steps,
        state: processedLog.state,
        last_review
      };
      return applyAfterHandler(prevCard, afterHandler);
    }
    /**
     *
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param reset_count Should the review count information(reps,lapses) be reset. (Optional)
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCard = createEmptyCard(now);
     * const scheduling_cards = f.repeat(emptyCard, now);
     * const { card, log } = scheduling_cards[Rating.Hard];
     * const forgetCard = f.forget(card, new Date(), true);
     * ```
     *
     * @example
     * ```typescript
     * interface RepeatRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked; //see method: fsrs.repeat()
     * }
     *
     * function forgetAfterHandler(recordLogItem: RecordLogItem): RepeatRecordLog {
     *     return {
     *       card: {
     *         ...(recordLogItem.card as Card & { cid: string }),
     *         due: recordLogItem.card.due.getTime(),
     *         state: State[recordLogItem.card.state] as StateType,
     *         last_review: recordLogItem.card.last_review
     *           ? recordLogItem.card.last_review!.getTime()
     *           : null,
     *       },
     *       log: {
     *         ...recordLogItem.log,
     *         cid: (recordLogItem.card as Card & { cid: string }).cid,
     *         due: recordLogItem.log.due.getTime(),
     *         review: recordLogItem.log.review.getTime(),
     *         state: State[recordLogItem.log.state] as StateType,
     *         rating: Rating[recordLogItem.log.rating] as RatingType,
     *       },
     *     };
     * }
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler); //see method:  createEmptyCard
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
     * const { card } = repeatFormAfterHandler[Rating.Hard];
     * const forgetFromAfterHandler = f.forget(card, date_scheduler(now, 1, true), false, forgetAfterHandler);
     * ```
     */
    forget(card, now, reset_count = false, afterHandler) {
      const processedCard = TypeConvert.card(card);
      now = TypeConvert.time(now);
      const scheduled_days = processedCard.state === State.New ? 0 : date_diff(now, processedCard.due, "days");
      const forget_log = {
        rating: Rating.Manual,
        state: processedCard.state,
        due: processedCard.due,
        stability: processedCard.stability,
        difficulty: processedCard.difficulty,
        elapsed_days: 0,
        last_elapsed_days: processedCard.elapsed_days,
        scheduled_days,
        learning_steps: processedCard.learning_steps,
        review: now
      };
      const forget_card = {
        ...processedCard,
        due: now,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: reset_count ? 0 : processedCard.reps,
        lapses: reset_count ? 0 : processedCard.lapses,
        learning_steps: 0,
        state: State.New,
        last_review: processedCard.last_review
      };
      const recordLogItem = { card: forget_card, log: forget_log };
      return applyAfterHandler(recordLogItem, afterHandler);
    }
    /**
     * Reschedules the current card and returns the rescheduled collections and reschedule item.
     *
     * @template T - The type of the record log item.
     * @param {CardInput | Card} current_card - The current card to be rescheduled.
     * @param {Array<FSRSHistory>} reviews - The array of FSRSHistory objects representing the reviews.
     * @param {Partial<RescheduleOptions<T>>} options - The optional reschedule options.
     * @returns {IReschedule<T>} - The rescheduled collections and reschedule item.
     *
     * @example
     * ```typescript
     * const f = fsrs()
     * const grades: Grade[] = [Rating.Good, Rating.Good, Rating.Good, Rating.Good]
     * const reviews_at = [
     *   new Date(2024, 8, 13),
     *   new Date(2024, 8, 13),
     *   new Date(2024, 8, 17),
     *   new Date(2024, 8, 28),
     * ]
     *
     * const reviews: FSRSHistory[] = []
     * for (let i = 0; i < grades.length; i++) {
     *   reviews.push({
     *     rating: grades[i],
     *     review: reviews_at[i],
     *   })
     * }
     *
     * const results_short = scheduler.reschedule(
     *   createEmptyCard(),
     *   reviews,
     *   {
     *     skipManual: false,
     *   }
     * )
     * console.log(results_short)
     * ```
     */
    reschedule(current_card, reviews = [], options2 = {}) {
      const {
        recordLogHandler,
        reviewsOrderBy,
        skipManual = true,
        now = /* @__PURE__ */ new Date(),
        update_memory_state: updateMemoryState = false
      } = options2;
      if (reviewsOrderBy && typeof reviewsOrderBy === "function") {
        reviews.sort(reviewsOrderBy);
      }
      if (skipManual) {
        reviews = reviews.filter((review2) => review2.rating !== Rating.Manual);
      }
      const rescheduleSvc = new Reschedule(this);
      const collections = rescheduleSvc.reschedule(
        options2.first_card || createEmptyCard(),
        reviews
      );
      const len = collections.length;
      const cur_card = TypeConvert.card(current_card);
      const manual_item = rescheduleSvc.calculateManualRecord(
        cur_card,
        now,
        len ? collections[len - 1] : void 0,
        updateMemoryState
      );
      return {
        collections: typeof recordLogHandler === "function" ? collections.map(recordLogHandler) : collections,
        reschedule_item: manual_item ? applyAfterHandler(manual_item, recordLogHandler) : null
      };
    }
  };
  var fsrs = (params) => {
    return new FSRS(params || {});
  };

  // lib/fsrs/index.ts
  var FSRS5_WEIGHTS = [
    0.40255,
    1.18385,
    3.173,
    15.69105,
    7.1949,
    0.5345,
    1.4604,
    46e-4,
    1.54575,
    0.1192,
    1.01925,
    1.9395,
    0.11,
    0.29605,
    2.2698,
    0.2315,
    2.9898,
    0.51655,
    0.6621,
    0,
    0.5
  ];
  var RELEARNING_STEPS = ["10m"];
  var MAXIMUM_INTERVAL = 365;
  var DEFAULT_RETENTION = 0.9;
  var MIN_RETENTION = 0.85;
  var MAX_RETENTION = 0.9;
  var LEITNER_INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64, 120, 180];
  var DEFAULT_TYPICAL_LATENCY_MS = 6e3;
  var DAY = 864e5;
  function build(retention2) {
    return fsrs(generatorParameters({
      w: [...FSRS5_WEIGHTS],
      request_retention: retention2,
      maximum_interval: MAXIMUM_INTERVAL,
      enable_fuzz: false,
      enable_short_term: true,
      learning_steps: [],
      relearning_steps: [...RELEARNING_STEPS]
    }));
  }
  var retention = DEFAULT_RETENTION;
  var scheduler = build(retention);
  function setRetention(r) {
    if (!Number.isFinite(r)) throw new RangeError(`retention must be a number, got ${r}`);
    retention = Math.min(MAX_RETENTION, Math.max(MIN_RETENTION, r));
    scheduler = build(retention);
    return retention;
  }
  function getRetention() {
    return retention;
  }
  function toCard(j) {
    return {
      due: new Date(j.due),
      stability: j.stability,
      difficulty: j.difficulty,
      elapsed_days: 0,
      scheduled_days: j.scheduled_days,
      learning_steps: j.learning_steps,
      reps: j.reps,
      lapses: j.lapses,
      state: j.state,
      last_review: j.last_review === void 0 ? void 0 : new Date(j.last_review)
    };
  }
  function fromCard(c) {
    const out = {
      due: c.due.getTime(),
      stability: c.stability,
      difficulty: c.difficulty,
      scheduled_days: c.scheduled_days,
      learning_steps: c.learning_steps,
      reps: c.reps,
      lapses: c.lapses,
      state: c.state
    };
    if (c.last_review) out.last_review = c.last_review.getTime();
    return out;
  }
  var RATING = { again: Rating.Again, hard: Rating.Hard, good: Rating.Good, easy: Rating.Easy };
  function toRating(g) {
    if (typeof g === "number") {
      if (g >= 1 && g <= 4 && Number.isInteger(g)) return g;
      throw new RangeError(`bad grade ${g}`);
    }
    const r = RATING[g];
    if (!r) throw new RangeError(`bad grade ${String(g)}`);
    return r;
  }
  function createCard(now = Date.now()) {
    return fromCard(createEmptyCard(new Date(now)));
  }
  function review(card, grade, now = Date.now()) {
    const at = new Date(now);
    const next = scheduler.next(toCard(card), at, toRating(grade)).card;
    if (next.state === State.Review && next.scheduled_days > MAXIMUM_INTERVAL) {
      next.scheduled_days = MAXIMUM_INTERVAL;
      next.due = new Date(at.getTime() + MAXIMUM_INTERVAL * DAY);
    }
    const out = fromCard(next);
    return { card: out, intervalDays: out.scheduled_days, due: out.due };
  }
  function retrievability(card, now = Date.now()) {
    if (card.state === State.New || card.last_review === void 0) return 0;
    return scheduler.get_retrievability(toCard(card), new Date(now), false);
  }
  function gradeFromAnswer(a) {
    if (!a.correct || a.unsure) return "again";
    if (a.usedHint) return "hard";
    if (a.latencyMs === void 0 || !Number.isFinite(a.latencyMs)) return "good";
    const typical = a.typicalLatencyMs && a.typicalLatencyMs > 0 ? a.typicalLatencyMs : DEFAULT_TYPICAL_LATENCY_MS;
    if (a.latencyMs < typical * 0.5) return "easy";
    if (a.latencyMs <= typical) return "good";
    return "hard";
  }
  function fromLeitner(box, lastReviewDay) {
    const b = Math.min(LEITNER_INTERVALS.length - 1, Math.max(0, Math.trunc(box) || 0));
    const last = lastReviewDay * DAY + new Date(lastReviewDay * DAY).getTimezoneOffset() * 6e4;
    if (b === 0) return createCard(last);
    const days = LEITNER_INTERVALS[b];
    const difficulty = scheduler.next(createEmptyCard(new Date(last)), new Date(last), Rating.Good).card.difficulty;
    return {
      due: last + days * DAY,
      stability: days,
      difficulty,
      scheduled_days: days,
      learning_steps: 0,
      reps: b,
      lapses: 0,
      state: State.Review,
      last_review: last
    };
  }

  // lib/gloss/index.ts
  var gloss_exports = {};
  __export(gloss_exports, {
    SMALL_WORDS: () => SMALL_WORDS,
    isCapitalised: () => isCapitalised,
    isOrdinaryWord: () => isOrdinaryWord,
    normWord: () => normWord,
    resolveGloss: () => resolveGloss,
    stripArticle: () => stripArticle,
    wordsOf: () => wordsOf
  });

  // lib/search/tenses.ts
  var TENSE_ORDER = [
    "presente",
    "preterito",
    "imperfecto",
    "futuro",
    "condicional",
    "perfecto",
    "imperativo",
    "impneg",
    "presubj",
    "plusc",
    "futperf",
    "condperf",
    "impsubj",
    "perfsubj",
    "pluscsubj"
  ];
  var TENSE_PLAIN = {
    presente: "Present (now)",
    preterito: "Preterite (the finished past)",
    imperfecto: "Imperfect (what used to happen)",
    futuro: "Future",
    condicional: "Conditional (would)",
    perfecto: "Present perfect (have done)",
    imperativo: "Commands",
    impneg: "Negative commands",
    presubj: "Present subjunctive (wishes, advice, doubt)",
    plusc: "Pluperfect (had done)",
    futperf: "Future perfect (will have done)",
    condperf: "Conditional perfect (would have done)",
    impsubj: 'Imperfect subjunctive (an idea held up in the past, or in an "if")',
    perfsubj: "Perfect subjunctive (an idea held up about what has happened)",
    pluscsubj: "Pluperfect subjunctive (if it had happened)"
  };
  var TENSE_RULES = [
    ["presente", /^g:(present-|stem-|yo-irregular)/],
    ["preterito", /^g:(preterite-|pret-vs-imperfect|narrative-pasts)/],
    ["imperfecto", /^g:(imperfect-(states|habitual|progressive)|pret-vs-imperfect|narrative-pasts)/],
    ["futuro", /^g:future-(promises|conjecture)/],
    ["condicional", /^g:conditional$/],
    ["perfecto", /^g:perfecto-/],
    ["imperativo", /^g:commands-(tu|usted)$/],
    ["impneg", /^g:negative-commands$/],
    ["presubj", /^g:subj-(wanting|irregulars|wishes|influence|doubt|value|emotion|opinion|cuando|purpose|relative)/],
    ["plusc", /^g:pluperfect$/],
    ["futperf", /^g:future-perfect$/],
    ["condperf", /^g:conditional-perfect$/],
    ["impsubj", /^g:imperfect-subj$/],
    ["perfsubj", /^g:subj-perfect$/],
    ["pluscsubj", /^g:pluperfect-subj$/]
  ];
  function tensesOfNode(n) {
    var _a2;
    const out = /* @__PURE__ */ new Set();
    for (const [t, re] of TENSE_RULES) if (re.test(n.id)) out.add(t);
    for (const tag of (_a2 = n.tags) != null ? _a2 : []) {
      const m = /^tense:(.+)$/.exec(tag);
      if (m && TENSE_ORDER.includes(m[1])) out.add(m[1]);
    }
    return [...out];
  }
  function taughtTenses(nodeIds, tagsOf = () => void 0) {
    const met = /* @__PURE__ */ new Set();
    for (const id of nodeIds) for (const t of tensesOfNode({ id, tags: tagsOf(id) })) met.add(t);
    return TENSE_ORDER.filter((t) => met.has(t));
  }
  function licensedTenses(nodeIds, tagsOf) {
    const met = new Set(taughtTenses(nodeIds, tagsOf));
    met.add("presente");
    return TENSE_ORDER.filter((t) => met.has(t));
  }
  var PICKER_TENSES = ["presente", "preterito", "imperfecto", "futuro", "condicional", "perfecto", "presubj"];
  var tenseName = (k) => {
    var _a2, _b, _c;
    return (_c = (_b = TENSE_PLAIN[k]) != null ? _b : (_a2 = TENSES.find((t) => t.key === k)) == null ? void 0 : _a2.label) != null ? _c : k;
  };
  var tenseShort = (k) => tenseName(k).replace(/\s*\(.*\)$/, "");

  // lib/gloss/index.ts
  function stripArticle(s) {
    return s.trim().replace(/^(el|la|los|las|un|una)\s+/i, "").replace(/[.…¿?¡!]/g, "").trim();
  }
  function normWord(s) {
    return s.toLowerCase().replace(/[^\p{L}\s]/gu, "").trim();
  }
  var HAS_PLURAL = /* @__PURE__ */ new Set(["noun", "adj", "det", "num", "pron"]);
  var AGREES = /* @__PURE__ */ new Set(["adj", "det", "num", "pron"]);
  var PERSON_ENDING = /(dor|tor|sor|ente|efe|ario|ado|ino|ico|ecto|acho)$|^socio$/;
  var SMALL_WORDS = {
    "s\xE9": { of: "saber", how: "I, present" },
    la: { of: "el", en: "the", how: "feminine" },
    los: { of: "el", en: "the", how: "plural" },
    las: { of: "el", en: "the", how: "feminine plural" },
    una: { of: "un", en: "a, an", how: "feminine" },
    unos: { of: "un", en: "some", how: "plural" },
    unas: { of: "un", en: "some", how: "feminine plural" },
    del: { en: "of the, from the (de + el)" },
    al: { en: "to the, at the (a + el)" },
    hay: { of: "haber", en: "there is, there are" },
    esta: { of: "este", how: "feminine" },
    estas: { of: "este", how: "feminine plural" },
    estos: { of: "este", how: "plural" },
    esa: { of: "ese", how: "feminine" },
    esas: { of: "ese", how: "feminine plural" },
    esos: { of: "ese", how: "plural" },
    aquella: { of: "aquel", how: "feminine" },
    aquellas: { of: "aquel", how: "feminine plural" },
    aquellos: { of: "aquel", how: "plural" },
    primer: { of: "primero", how: "before a masculine noun" },
    tercer: { of: "tercero", how: "before a masculine noun" },
    alg\u00FAn: { of: "alguno", how: "before a masculine noun" },
    ning\u00FAn: { of: "ninguno", how: "before a masculine noun" },
    cualquier: { of: "cualquiera", how: "before a noun" },
    ciento: { of: "cien", how: "in numbers like ciento diez" },
    e: { of: "y", how: "before a word that starts with i" },
    quiz\u00E1s: { of: "quiz\xE1" },
    uy: { en: "oh, oops, wow" }
  };
  var OBJECT_PRONOUNS = {
    la: "her, it (before a verb); the (before a noun)",
    las: "them, you (before a verb); the (before a noun)",
    los: "them, you (before a verb); the (before a noun)"
  };
  var SHARES_FORMS = /* @__PURE__ */ new Set(["ser", "ir", "ver", "venir", "dar", "decir", "sentar", "sentir"]);
  var verbBase = (inf) => inf.replace(/se$/, "");
  var wordsOf = (s) => {
    var _a2;
    return ((_a2 = s.match(/\p{L}+/gu)) != null ? _a2 : []).map(normWord);
  };
  var noteWords = /* @__PURE__ */ new WeakMap();
  var wordsOfNote = (g) => {
    let t = noteWords.get(g);
    if (!t) noteWords.set(g, t = wordsOf(g.es));
    return t;
  };
  function singulars2(w) {
    const out = [];
    if (w.endsWith("ces")) out.push(`${w.slice(0, -3)}z`);
    if (w.endsWith("es")) out.push(w.slice(0, -2));
    if (w.endsWith("s")) out.push(w.slice(0, -1));
    return out;
  }
  var PERSON_WORDS = {
    yo: "I",
    "t\xFA": "you",
    "\xE9l/ella": "he or she",
    nosotros: "we",
    ellos: "they",
    vos: "you",
    vosotros: "you all"
  };
  var indexes = /* @__PURE__ */ new WeakMap();
  function indexOf(lexemes) {
    var _a2, _b;
    let ix = indexes.get(lexemes);
    if (ix) return ix;
    ix = { lemmas: /* @__PURE__ */ new Map(), pluralizing: /* @__PURE__ */ new Map(), pluralizingPlain: /* @__PURE__ */ new Map(), agreeing: /* @__PURE__ */ new Map() };
    for (const n of lexemes) {
      if (!n.es) continue;
      for (const form2 of n.es.split(/[/;,]/)) {
        const k = stripArticle(form2).toLowerCase();
        if (!k) continue;
        if (!ix.lemmas.has(k)) ix.lemmas.set(k, n);
        if (HAS_PLURAL.has((_a2 = n.pos) != null ? _a2 : "noun")) {
          if (!ix.pluralizing.has(k)) ix.pluralizing.set(k, n);
          if (!ix.pluralizingPlain.has(deaccent(k))) ix.pluralizingPlain.set(deaccent(k), n);
        }
        if ((AGREES.has((_b = n.pos) != null ? _b : "") || n.pos === "noun" && n.gender === "m" && PERSON_ENDING.test(k)) && !ix.agreeing.has(k)) ix.agreeing.set(k, n);
      }
    }
    indexes.set(lexemes, ix);
    return ix;
  }
  function plural(ix, w) {
    var _a2;
    for (const s of singulars2(w)) {
      const n = (_a2 = ix.pluralizing.get(s)) != null ? _a2 : w.endsWith("es") && s === w.slice(0, -2) ? ix.pluralizingPlain.get(deaccent(s)) : void 0;
      if (n) return n;
    }
    return void 0;
  }
  function agreeingBase(ix, w) {
    for (const s of [w, ...singulars2(w)]) {
      const stem2 = s.slice(0, -1);
      const bases = s.endsWith("a") ? [
        `${stem2}o`,
        `${stem2}e`,
        ...s.endsWith("ora") ? [`${s.slice(0, -3)}or`] : [],
        ...s.endsWith("esa") ? [`${s.slice(0, -3)}\xE9s`] : [],
        ...s.endsWith("ona") ? [`${s.slice(0, -3)}\xF3n`] : [],
        ...s.endsWith("ana") ? [`${s.slice(0, -3)}\xE1n`] : []
      ] : s.endsWith("o") ? [`${stem2}e`] : [];
      for (const base of bases) {
        const n = ix.agreeing.get(base);
        if (n) return n;
      }
    }
    return void 0;
  }
  function isOrdinaryWord(w, lexemes, smallWords = SMALL_WORDS) {
    const ix = indexOf(lexemes);
    return ix.lemmas.has(w) || w in smallWords || !!plural(ix, w) || !!agreeingBase(ix, w);
  }
  var exactOf = (c, w) => {
    const e = c.exact;
    if (!e) return void 0;
    return e instanceof Map ? e.get(w) : Object.hasOwn(e, w) ? e[w] : void 0;
  };
  function resolveGloss(token, context) {
    var _a2;
    const w = normWord(token);
    if (!w) return void 0;
    const phrase = context.at ? phraseAt((_a2 = context.gloss) != null ? _a2 : [], context.at) : void 0;
    const own = wordGloss(token, w, context);
    if (!phrase) return own;
    return own && !own.name ? { ...own, phrase } : phrase;
  }
  function wordGloss(word, w, c) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const ix = indexOf(c.lexemes);
    const small = (_a2 = c.smallWords) != null ? _a2 : SMALL_WORDS;
    const name = isCapitalised(word) && !!((_b = c.names) == null ? void 0 : _b.has(word.toLowerCase()));
    const mine = ((_c = c.gloss) != null ? _c : []).find((g) => {
      const t = wordsOfNote(g);
      return t.length === 1 && t[0] === w && !(name && g.es === g.es.toLowerCase());
    });
    if (mine) return mine;
    if (name) return { es: word, en: "a name", name: true };
    const sm = (_d = objectPronoun(ix, w, c)) != null ? _d : smallWord(ix, small, w, word);
    if (sm) return sm;
    const lex = (_e = ix.lemmas.get(w)) != null ? _e : plural(ix, w);
    if (lex == null ? void 0 : lex.en) return { es: (_f = lex.es) != null ? _f : word, en: lex.en };
    const viaVerb = verbGloss(ix, c, word, w, true);
    if (viaVerb) return viaVerb;
    const exact = exactOf(c, w);
    if (exact) return { es: word, en: exact };
    const base = agreeingBase(ix, w);
    if (base == null ? void 0 : base.en) return { es: (_g = base.es) != null ? _g : word, en: base.en, form: word };
    return verbGloss(ix, c, word, w, false);
  }
  function objectPronoun(ix, w, c) {
    var _a2;
    const at = c.at;
    if (!at || !Object.hasOwn(OBJECT_PRONOUNS, w)) return void 0;
    const tokens = [...at.line.matchAll(/\p{L}+/gu)];
    const me = tokens[at.index], next = tokens[at.index + 1];
    if (!me || !next || at.line.slice(me.index + me[0].length, next.index).trim()) return void 0;
    const n = normWord(next[0]);
    if (ix.lemmas.has(n) || plural(ix, n) || agreeingBase(ix, n)) return void 0;
    const engine2 = (_a2 = c.engine) != null ? _a2 : { analyzeToken };
    return engine2.analyzeToken(n).some((r) => r.target && r.accentExact) ? { es: w, en: OBJECT_PRONOUNS[w] } : void 0;
  }
  function smallWord(ix, table2, w, word) {
    var _a2, _b;
    const s = Object.hasOwn(table2, w) ? table2[w] : void 0;
    if (!s) return void 0;
    const head = s.of ? ix.lemmas.get(s.of) : void 0;
    const en = (_a2 = s.en) != null ? _a2 : head == null ? void 0 : head.en;
    if (!en) return void 0;
    return s.of ? { es: (_b = head == null ? void 0 : head.es) != null ? _b : s.of, en, form: word, ...s.how ? { how: s.how } : {} } : { es: word, en };
  }
  function verbLexeme(ix, inf) {
    var _a2;
    return (_a2 = ix.lemmas.get(inf)) != null ? _a2 : ix.lemmas.get(verbBase(inf));
  }
  function verbGloss(ix, c, word, w, accentExact) {
    var _a2, _b, _c, _d;
    const engine2 = (_a2 = c.engine) != null ? _a2 : { analyzeToken };
    const readings2 = engine2.analyzeToken(w).filter((a) => a.target && (!accentExact || a.accentExact));
    readings2.sort((a, b) => {
      var _a3, _b2;
      return Number(b.accentExact) - Number(a.accentExact) || Number(!!((_a3 = a.clitics) == null ? void 0 : _a3.length)) - Number(!!((_b2 = b.clitics) == null ? void 0 : _b2.length));
    });
    for (const r of readings2) {
      const lex = verbLexeme(ix, r.inf);
      if (!(lex == null ? void 0 : lex.en)) continue;
      const persons = new Set(readings2.filter((o) => {
        var _a3, _b2, _c2, _d2;
        return o.inf === r.inf && o.tense === r.tense && ((_b2 = (_a3 = o.clitics) == null ? void 0 : _a3.length) != null ? _b2 : 0) === ((_d2 = (_c2 = r.clitics) == null ? void 0 : _c2.length) != null ? _d2 : 0);
      }).map((o) => PERSON_WORDS[o.person]).filter(Boolean));
      const how = [[...persons].join(" or "), r.tense === "imperativo" ? "command" : tenseShort(r.tense).toLowerCase()].filter(Boolean).join(", ");
      const clitics = ((_b = r.clitics) == null ? void 0 : _b.length) ? `${how}, with ${r.clitics.join(" + ")} attached` : how;
      const also = SHARES_FORMS.has(verbBase(r.inf)) ? readings2.find((o) => verbBase(o.inf) !== verbBase(r.inf) && SHARES_FORMS.has(verbBase(o.inf))) : void 0;
      const other = also ? verbLexeme(ix, also.inf) : void 0;
      return { es: (_c = lex.es) != null ? _c : r.inf, en: lex.en, form: word, how: (other == null ? void 0 : other.en) ? `${clitics}; or from ${(_d = other.es) != null ? _d : also.inf}: ${other.en}` : clitics };
    }
    return void 0;
  }
  function phraseAt(gloss2, at) {
    const line = wordsOf(at.line);
    let best;
    let bestLen = Infinity;
    for (const g of gloss2) {
      const p = wordsOfNote(g);
      if (p.length < 2 || p.length >= bestLen) continue;
      for (let s = Math.max(0, at.index - p.length + 1); s <= at.index && s + p.length <= line.length; s++) {
        if (p.every((x, j) => line[s + j] === x)) {
          best = g;
          bestLen = p.length;
          break;
        }
      }
    }
    return best;
  }
  var isCapitalised = (t) => t !== t.toLowerCase() && !(t.length > 1 && t === t.toUpperCase());

  // lib/search/index.ts
  var search_exports = {};
  __export(search_exports, {
    PICKER_TENSES: () => PICKER_TENSES,
    STRENGTH_TEXT: () => STRENGTH_TEXT,
    TENSE_NAMES: () => TENSE_NAMES,
    TENSE_ORDER: () => TENSE_ORDER,
    TENSE_PLAIN: () => TENSE_PLAIN,
    TENSE_RULES: () => TENSE_RULES,
    TOPICS: () => TOPICS,
    TOPIC_KEYWORDS: () => KEYWORDS,
    TOPIC_LABEL: () => TOPIC_LABEL,
    TOPIC_PCIC: () => PCIC,
    TOPIC_RULES: () => RULES2,
    cellsFor: () => cellsFor,
    findVerb: () => findVerb,
    findVerbs: () => findVerbs,
    grammarEntries: () => grammarEntries,
    groupByTopic: () => groupByTopic,
    licensedTenses: () => licensedTenses,
    norm: () => norm,
    scoreEntry: () => scoreEntry,
    seCellsFor: () => seCellsFor,
    searchEntries: () => searchEntries,
    shownPersons: () => shownPersons,
    standardNames: () => standardNames,
    strengthOf: () => strengthOf,
    stripArticle: () => stripArticle2,
    taughtTenses: () => taughtTenses,
    tenseName: () => tenseName,
    tenseShort: () => tenseShort,
    tensesOfNode: () => tensesOfNode,
    themeWords: () => themeWords,
    topicOf: () => topicOf,
    wordEntries: () => wordEntries
  });

  // lib/search/search.ts
  var norm = (s) => deaccent((s != null ? s : "").toLowerCase()).replace(/[¿?¡!.,;:()"]/g, " ").replace(/\s+/g, " ").trim();
  function scoreText(q, texts, exact, start, word, any) {
    let best = 0;
    for (const raw of texts) {
      for (const part of String(raw != null ? raw : "").split(/\s*[/;]\s*/)) {
        const t = norm(part);
        if (!t) continue;
        const bare4 = t.replace(/^(el|la|los|las|un|una|to|the|a) /, "");
        let s = 0;
        if (t === q || bare4 === q) s = exact;
        else if (t.startsWith(q + " ") || bare4.startsWith(q + " ") || t.startsWith(q + "'")) s = start + 5;
        else if (t.startsWith(q) || bare4.startsWith(q)) s = start;
        else if ((" " + t).includes(" " + q)) s = word;
        else if (t.includes(q)) s = any;
        if (s > best) best = s;
      }
    }
    return best;
  }
  function scoreEntry(query, e) {
    var _a2, _b, _c, _d;
    const q = norm(query);
    if (!q) return 1;
    const sub = q.length >= 5;
    let s = Math.max(
      scoreText(q, e.title === void 0 ? [] : [e.title].flat(), 130, 105, 90, 70),
      scoreText(q, (_a2 = e.names) != null ? _a2 : [], 120, 100, 85, 60),
      scoreText(q, e.es, 100, 80, 60, sub ? 40 : 20),
      scoreText(q, e.en, 95, 75, 55, sub ? 35 : 20),
      scoreText(q, (_b = e.extra) != null ? _b : [], 30, 25, 20, 10)
    );
    if (!s && q.includes(" ")) {
      const all = norm([...e.title === void 0 ? [] : [e.title].flat(), ...(_c = e.names) != null ? _c : [], ...e.es, ...e.en, ...(_d = e.extra) != null ? _d : []].join(" "));
      if (q.split(" ").every((w) => all.includes(w))) s = 15;
    }
    return s;
  }
  function searchEntries(entries, query) {
    if (!norm(query)) return [...entries];
    return entries.map((e, i) => ({ e, i, s: scoreEntry(query, e) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.i - b.i).map((x) => x.e);
  }

  // lib/search/topics.ts
  var TOPICS = [
    { id: "now", label: "Talking about now", words: ["present", "now", "today", "every day", "i am", "i have", "i need", "there is"] },
    { id: "past", label: "The past", words: ["past", "yesterday", "did", "ago", "have you ever", "had", "was"] },
    { id: "used", label: "What used to happen", words: ["used to", "when i was", "back then", "was doing", "always"] },
    { id: "future", label: "The future and plans", words: ["going to", "will", "plans", "tomorrow", "next", "future", "maybe"] },
    { id: "wishes", label: "Wants, wishes and advice", words: ["would", "want", "wish", "hope", "should", "must", "have to", "i like", "i love", "advice", "if", "command", "order"] },
    { id: "describing", label: "Describing people and things", words: ["describe", "adjective", "bigger", "best", "this", "that", "my", "your", "a lot", "a little", "the"] },
    { id: "pronouns", label: "Pronouns and little words", words: ["him", "her", "it", "them", "me", "to me", "myself", "one", "no", "nothing", "nobody", "never", "any"] },
    { id: "questions", label: "Asking questions", words: ["ask", "question", "who", "what", "where", "when", "how", "why", "which"] },
    { id: "connecting", label: "Connecting ideas", words: ["because", "so", "but", "although", "when", "if", "who", "which", "that", "for", "by", "in order to", "said that"] },
    { id: "polite", label: "Being polite", words: ["please", "thank", "sorry", "excuse me", "hello", "goodbye", "formal", "polite", "soften"] },
    { id: "other", label: "Other", words: [] }
  ];
  var TOPIC_LABEL = Object.fromEntries(TOPICS.map((t) => [t.id, t.label]));
  var RULES2 = [
    { topic: "questions", slug: /^(questions|que-vs-cual|questions-prepositions|indirect-questions)/ },
    { topic: "polite", slug: /^(softening|register-ladder|written-register|formal-letter|hedging|reformulation|greet|polite|please|thanks)/ },
    { topic: "used", slug: /^imperfect-(states|habitual|progressive)/ },
    { topic: "past", slug: /^(preterite|pret-|narrative-pasts|pluperfect$|perfecto|spain-pasts|hace-ago|acabar-de)/ },
    { topic: "future", slug: /^(ir-a-|future-(promises|conjecture|perfect))/ },
    { topic: "connecting", slug: /^(subj-(cuando|purpose|concessive|conditions|free|relative)|cause|consequence|causal|concession|si-present|cuando|por-para|pero-sino|aunque|tanto-como|relative|relatives|that-clauses|para-que|como-si|reported|reporting|argument|discourse|temporal|concessive|consecutive|conditional-advanced|referring-back|comparative-advanced|topic-fronting|cleft|time-sequence|gerund-ways|participle-gerund|absolute|nominalisation|prep-infinitive|infinitive-)/ },
    { topic: "wishes", slug: /^(subj-|conditional|commands|negative-commands|que-wishes|ojala|imperfect-subj|pluperfect-subj|si-hypothetical|si-past|gustar|deber-modal|tener-que|impersonal-obligation|verb-infinitive|parecer-quedar|se-form-recognition|wish-)/ },
    { topic: "pronouns", slug: /^(direct-objects|indirect-objects|prep-pronouns|double-pronouns|object-pronoun|le-doubling|se-|reflexive|possessive-dative|passive-se|impersonal-register|indefinites|negation-words|cada-cualquier|lo-que-|passive-ser)/ },
    { topic: "describing", slug: /^(adjective|comparatives|superlatives|possessives|demonstratives|quantifiers|gender-articles|article-uses|lo-adjective|diminutives|adverbs|estar-participle|ser-estar|evaluative|exclamations|cuyo|agreement|verbs-of-change)/ },
    { topic: "now", slug: /^(present-|stem-|yo-irregular|ser-|estar-|hay-|hace-que|acabar|tense-modal)/ }
  ];
  var KEYWORDS = [
    ["used", /\b(used to|when i was|back then)\b/],
    ["polite", /\b(please|thank|sorry|excuse|hello|goodbye|nice to meet|polite|formal)\b|\busted\b/],
    ["questions", /\b(ask|asking|question|how much|how many|what is|where is|who is)\b/],
    ["wishes", /\b(would|wish|hope|should|advice|i'd like|i like|i love|want|need to|have to)\b/],
    ["future", /\b(going to|plans?|tomorrow|next week|will)\b/],
    ["past", /\b(yesterday|last (night|week|year)|ago|did|was|were|had)\b/],
    ["connecting", /\b(because|although|even though|but|so that|if)\b/],
    ["describing", /\b(describe|describing|looks?|tall|colou?r)\b/],
    ["now", /\b(now|today|every day|right now|i am|i'm)\b/]
  ];
  var PCIC = [
    ["used", /^gramatica:9\.1\.2/],
    ["past", /^gramatica:9\.1\.(3|6|8)/],
    ["future", /^gramatica:9\.1\.4/],
    ["wishes", /^gramatica:(9\.2|9\.3|9\.1\.5)/],
    ["questions", /^gramatica:(7\.3|8\.8)/],
    ["pronouns", /^gramatica:(7\.1|6)/],
    ["describing", /^gramatica:(2|4|5|10\.3)/],
    ["connecting", /^gramatica:(15|14)/],
    ["now", /^gramatica:9\.1\.1/],
    ["polite", /^(funciones|tacticas_pragmaticas)/]
  ];
  function topicOf(node) {
    var _a2, _b, _c, _d, _e;
    try {
      const id = String((_a2 = node.id) != null ? _a2 : "");
      const slug = id.replace(/^[a-z]:/, "").replace(/#.*$/, "");
      for (const t of (_b = node.tags) != null ? _b : []) {
        const m = /^topic:(.+)$/.exec(t);
        if (m && TOPICS.some((x) => x.id === m[1])) return m[1];
      }
      for (const r of RULES2) if (r.slug.test(slug)) return r.topic;
      const text = `${(_c = node.title) != null ? _c : ""} ${(_d = node.en) != null ? _d : ""}`.toLowerCase();
      for (const [topic, re] of KEYWORDS) if (re.test(text)) return topic;
      for (const code of (_e = node.pcic) != null ? _e : []) for (const [topic, re] of PCIC) if (re.test(code)) return topic;
    } catch {
    }
    return "other";
  }

  // lib/search/verbs.ts
  var norm2 = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
  var SE_FORM = { impsubjse: "impsubj", pluscsubjse: "pluscsubj" };
  var byInfCache = /* @__PURE__ */ new WeakMap();
  function byInf(verbs) {
    let m = byInfCache.get(verbs);
    if (!m) {
      m = new Map(verbs.map((v) => [v.inf, v]));
      byInfCache.set(verbs, m);
    }
    return m;
  }
  function findVerbs(query, limit = 12, verbs = VERBS) {
    var _a2, _b, _c, _d;
    const q = norm2(query);
    if (!q || q.length < 2) return [];
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const add2 = (m) => {
      if (!seen.has(m.verb.inf)) {
        seen.add(m.verb.inf);
        out.push(m);
      }
    };
    const index = byInf(verbs);
    const exact = (_b = (_a2 = index.get(q)) != null ? _a2 : verbs.find((v) => deaccent(v.inf) === deaccent(q))) != null ? _b : null;
    if (exact) add2({ verb: exact, via: "infinitive", hits: [] });
    if (!q.includes(" ")) {
      let analyses = [];
      try {
        analyses = analyzeToken(q);
      } catch {
        analyses = [];
      }
      const by = /* @__PURE__ */ new Map();
      for (const a of analyses) {
        const tense = (_c = SE_FORM[a.tense]) != null ? _c : a.tense;
        if (!TENSE_ORDER.includes(tense)) continue;
        const hits = (_d = by.get(a.inf)) != null ? _d : [];
        hits.push({ tense, person: String(a.person), form: a.form, ...tense !== a.tense ? { se: true } : {} });
        by.set(a.inf, hits);
      }
      for (const [inf, hits] of by) {
        const verb = index.get(inf);
        if (verb) add2({ verb, via: "form", hits });
      }
    }
    if (out.length < limit) {
      const dq = deaccent(q);
      for (const v of verbs) {
        if (out.length >= limit) break;
        if (deaccent(v.inf).startsWith(dq)) add2({ verb: v, via: "start", hits: [] });
      }
    }
    return out.slice(0, limit);
  }
  function findVerb(query, verbs = VERBS) {
    var _a2;
    return (_a2 = findVerbs(query, 1, verbs)[0]) != null ? _a2 : null;
  }
  function shownPersons(tense) {
    const ps = personsFor(tense);
    const label = {
      yo: "yo",
      "t\xFA": "t\xFA",
      "\xE9l/ella": "\xE9l / ella / usted",
      nosotros: "nosotros",
      ellos: "ellos / ellas / ustedes",
      usted: "usted",
      ustedes: "ustedes"
    };
    return ps.map((p, idx) => {
      var _a2;
      return { label: (_a2 = label[p]) != null ? _a2 : p, idx, key: p };
    }).filter((p) => p.key !== "vosotros");
  }
  function cellsFor(inf, tense) {
    try {
      return conjugateCells(inf, tense).map((c) => c.form);
    } catch {
      return [];
    }
  }
  function seCellsFor(inf, tense) {
    return tense === "impsubj" ? cellsFor(inf, "impsubjse") : tense === "pluscsubj" ? cellsFor(inf, "pluscsubjse") : [];
  }

  // lib/search/names.ts
  var TENSE_NAMES = {
    presente: ["present", "present tense", "presente", "simple present"],
    preterito: ["preterite", "preterit", "pret\xE9rito", "indefinido", "simple past", "past simple"],
    imperfecto: ["imperfect", "imperfecto", "pret\xE9rito imperfecto", "imperfect tense"],
    futuro: ["future", "future tense", "futuro", "simple future"],
    condicional: ["conditional", "condicional", "conditional tense"],
    perfecto: ["present perfect", "perfect", "pret\xE9rito perfecto", "perfecto"],
    imperativo: ["imperative", "imperativo", "command", "commands"],
    impneg: ["negative imperative", "negative commands", "imperativo negativo"],
    presubj: ["present subjunctive", "subjunctive", "subjuntivo", "presente de subjuntivo"],
    plusc: ["pluperfect", "past perfect", "pluscuamperfecto"],
    futperf: ["future perfect", "futuro perfecto"],
    condperf: ["conditional perfect", "condicional perfecto", "perfect conditional"],
    impsubj: ["imperfect subjunctive", "subjunctive", "subjuntivo", "imperfecto de subjuntivo", "fuera form", "fuese form"],
    perfsubj: ["perfect subjunctive", "present perfect subjunctive", "subjunctive", "subjuntivo"],
    pluscsubj: ["pluperfect subjunctive", "past perfect subjunctive", "subjunctive", "subjuntivo"]
  };
  var KIND_NAMES = [
    [/^g:(subj-|imperfect-subj$|pluperfect-subj$|se-form-recognition$|ojala-past$|que-wishes-commands$|wish-exclamatives$|future-subj-recognition$|reporting-verbs-mood$|mood-choice-fine$)/, ["subjunctive", "subjuntivo"]],
    [/^g:conditional/, ["conditional", "condicional"]],
    [/^g:(si-|como-si$|conditional-advanced$)/, ["if clauses", "conditional sentences", "si clauses"]],
    [/^g:(estar-gerund|gerund-ways|participle-gerund-clauses)/, ["gerund", "gerundio", "present participle"]],
    [/^g:(estar-participle|participle-gerund-clauses|absolute-constructions)/, ["participle", "past participle", "participio"]],
    [/^g:(commands|negative-commands)/, ["imperative", "imperativo", "commands"]],
    [/^g:reflexive/, ["reflexive", "reflexive verbs"]],
    [/^g:passive-/, ["passive", "passive voice", "voz pasiva"]],
    [/^g:(relative|relatives|cuyo-relatives|subj-relative)/, ["relative clause", "relative clauses", "relative pronouns"]],
    [/^g:(reported-|reporting-|subj-future-in-past)/, ["reported speech", "indirect speech", "backshift"]],
    [/^g:ser-estar/, ["ser vs estar", "ser and estar", "difference between ser and estar"]],
    [/^g:por-para/, ["por vs para", "por and para"]],
    [/^g:(direct-objects|object-pronoun-position|double-pronouns)/, ["direct object", "object pronouns", "clitics"]],
    [/^g:(indirect-objects|le-doubling)/, ["indirect object", "object pronouns"]],
    [/^g:(comparatives|superlatives|tanto-como)/, ["comparative", "superlative", "comparison"]]
  ];
  function standardNames(n) {
    var _a2;
    if (!n.id.startsWith("g:")) return [];
    const out = /* @__PURE__ */ new Set();
    for (const t of tensesOfNode(n)) for (const name of (_a2 = TENSE_NAMES[t]) != null ? _a2 : []) out.add(name);
    for (const [re, names] of KIND_NAMES) if (re.test(n.id)) for (const name of names) out.add(name);
    return [...out];
  }

  // lib/search/entries.ts
  function strengthOf(r) {
    if (r === void 0) return "new";
    return r >= 0.9 ? "solid" : r >= 0.7 ? "fading" : "shaky";
  }
  var STRENGTH_TEXT = {
    solid: "Solid",
    fading: "Fading",
    shaky: "Shaky",
    new: "Just started"
  };
  function grammarEntries(lessons, opts = {}) {
    var _a2, _b, _c, _d, _e, _f, _g;
    const met = (_a2 = opts.met) != null ? _a2 : /* @__PURE__ */ new Set();
    const out = [];
    for (const n of lessons) {
      const topic = topicOf(n);
      const label = TOPICS.find((t) => t.id === topic);
      const isMet = met.has(n.id);
      out.push({
        id: n.id,
        title: n.title,
        topic,
        met: isMet,
        priority: (_b = n.priority) != null ? _b : 0,
        week: n.week,
        strength: isMet && opts.retrievability ? strengthOf(opts.retrievability(n.id)) : "new",
        names: standardNames(n),
        es: [(_c = n.es) != null ? _c : "", ...((_d = n.forms) != null ? _d : []).map((f) => f.es)].filter(Boolean),
        en: [(_e = n.en) != null ? _e : "", ...((_f = n.forms) != null ? _f : []).map((f) => f.en)].filter(Boolean),
        extra: [...(_g = label == null ? void 0 : label.words) != null ? _g : [], TOPIC_LABEL[topic]]
      });
    }
    return out.sort((a, b) => a.priority - b.priority || (a.id < b.id ? -1 : 1));
  }
  function groupByTopic(entries) {
    return TOPICS.map((t) => ({ topic: t.id, label: t.label, entries: entries.filter((e) => e.topic === t.id) })).filter((g) => g.entries.length);
  }
  var stripArticle2 = (s) => s.trim().replace(/^(el|la|los|las|un|una)\s+/i, "").replace(/[.…¿?¡!]/g, "").trim();
  function wordEntries(vocab, opts = {}) {
    var _a2, _b;
    const out = [];
    const byLemma = /* @__PURE__ */ new Map();
    const sorted = [...vocab].sort((a, b) => {
      var _a3, _b2;
      return ((_a3 = a.freqRank) != null ? _a3 : 1e9) - ((_b2 = b.freqRank) != null ? _b2 : 1e9);
    });
    for (const n of sorted) {
      const isMet = !opts.met || n.id !== void 0 && opts.met.has(n.id);
      const r = isMet && n.id !== void 0 ? (_a2 = opts.retrievability) == null ? void 0 : _a2.call(opts, n.id) : void 0;
      const e = {
        ...n.id !== void 0 ? { id: n.id } : {},
        word: n.es,
        gloss: n.en,
        strength: strengthOf(r),
        saved: false,
        met: isMet,
        gender: n.gender,
        pos: n.pos,
        es: [n.es],
        en: [n.en]
      };
      out.push(e);
      byLemma.set(stripArticle2(n.es).toLowerCase(), e);
    }
    for (const s of (_b = opts.saved) != null ? _b : []) {
      const hit = byLemma.get(stripArticle2(s.es).toLowerCase());
      if (hit) {
        hit.saved = true;
        continue;
      }
      out.push({ word: s.es, gloss: s.en, strength: "new", saved: true, es: [s.es], en: [s.en] });
    }
    return out;
  }
  function themeWords(theme) {
    const i = theme.indexOf(":");
    const after = i >= 0 ? theme.slice(i + 1) : theme;
    const parts = after.split(/[,;/]|\band\b/).map((w) => w.trim()).filter(Boolean);
    return i >= 0 ? [...parts, theme.slice(0, i).trim()] : parts;
  }

  // lib/index.ts
  var engine = engine_exports;
  var tagger = tagger_exports;
  var graph = graph_exports;
  var match = match_exports;
  var fsrs2 = fsrs_exports;
  var gloss = gloss_exports;
  var search = search_exports;
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
