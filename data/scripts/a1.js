/* ============================================================================
 * TEACHING SCRIPTS, the A1 band (window.SCRIPTS_A1), keyed by lesson id:
 * units a1-u01 to a1-u13, and the two past units that sit inside the band,
 * a2-u14 (the first past, after unit 6) and a2-u17 (have you ever, after
 * unit 8). Latin American use: the plain past (*fui*, *comí*) is the everyday
 * past, even for this morning; *he* plus *-ado* is kept for experience and
 * not yet, and the perfecto script says once that Spain uses it more.
 *
 * A script is the short, evidence-shaped front of a lesson: a human reason to
 * care, two or three examples BEFORE the rule, a rule card that reads in under
 * ninety seconds with the forms on it, read-and-pick items that can only be
 * answered by reading the form, typed production graded by the matcher, and
 * one true sentence about the learner. The old lesson's full prose stays
 * behind a "Read more" fold (js/views/learn.js); nothing here replaces it.
 *
 * Shape (docs: tools/test-scripts.js checks every rule below):
 *   hook        { line (English), es, en }  es/en may hold several lines (\n)
 *   examples    [{ es, en }]                2 or 3
 *   rule        plain English, under 120 words, lines split by \n
 *   readAndPick [{ q, es, options, answer, why }]   4 to 6
 *   yourTurn    [{ en, es, accept }]        3 to 5; accept uses ( ) optional
 *                                           and [a|b] alternatives
 *   personal    { prompt, constraints (js/checker.js), model }
 *   pitfalls    [string]                    0 to 3
 *   source      'old' | 'merged' | 'rebuild'
 * Spanish inside English prose is marked *like this*; the view italicises it.
 * No dashes, no vosotros, Latin American Spanish throughout.
 *
 * Loaded on demand by js/views/learn.js (script injection, like the bank
 * band files), so it is not listed in index.html or sw.js yet.
 * ========================================================================== */
window.SCRIPTS_A1 = {

/* ---- unit 1 · Meet someone --------------------------------------------- */

"dlg-presentarse": {
  source: "old",
  hook: {
    line: "Two strangers at a café counter in Bogotá go from hello to swapping numbers in twelve short lines. Every line is a piece ready to use tomorrow, word for word.",
    es: "Sam: Hola, buenos días.\nLaura: Buenos días.\nSam: ¿Tienes el azúcar, por favor?\nLaura: Sí, aquí tienes.\nSam: Gracias. Soy Sam. ¿Cómo te llamas?\nLaura: Me llamo Laura. Mucho gusto.\nSam: Mucho gusto. ¿De dónde eres?\nLaura: Soy de aquí, de Bogotá. ¿Y tú?\nSam: Soy de Canadá. Quiero aprender español.\nLaura: ¡Qué bien! ¿Tienes WhatsApp?\nSam: Sí, claro.\nLaura: Perfecto. Yo quiero practicar inglés.",
    en: "Sam: Hello, good morning.\nLaura: Good morning.\nSam: Do you have the sugar, please?\nLaura: Yes, here you go.\nSam: Thanks. I'm Sam. What's your name?\nLaura: My name is Laura. Nice to meet you.\nSam: Nice to meet you. Where are you from?\nLaura: I'm from here, from Bogotá. And you?\nSam: I'm from Canada. I want to learn Spanish.\nLaura: Great! Do you have WhatsApp?\nSam: Yes, of course.\nLaura: Perfect. I want to practise English."
  },
  examples: [
    { es: "Hola, me llamo Diego. Soy de Lima.", en: "Hi, my name is Diego. I'm from Lima." },
    { es: "¿Tienes una servilleta, por favor?", en: "Do you have a napkin, please?" },
    { es: "Quiero un café con leche, por favor.", en: "I'd like a coffee with milk, please." }
  ],
  rule: "Learn these as whole pieces for now. How they work inside comes later this week.\nYour name: *Soy Sam.* or *Me llamo Sam.*\nTheir name: *¿Cómo te llamas?*\nWhere you are from: *Soy de Canadá.* To ask: *¿De dónde eres?*\nWhen you meet: *Mucho gusto.*\nThe same question back: *¿Y tú?*\nTo ask for something: *¿Tienes…?* To say what you want: *Quiero…*\nA question opens with *¿* and closes with *?*. Leave out *yo* unless you are setting yourself against someone, as Laura does: *Yo quiero practicar inglés.*",
  readAndPick: [
    { q: "Laura asks you this. What does she want to know?", es: "¿De dónde eres?",
      options: ["Where you are from", "What your name is", "Where you live now"], answer: 0,
      why: "*De dónde* is from where: she wants your city or country." },
    { q: "What does Sam tell Laura about himself?", es: "Soy de Canadá.",
      options: ["Canada is where he's from", "He lives in Canada now", "He wants to visit"], answer: 0,
      why: "*Soy de* plus a place says where you come from." },
    { q: "The man next to you says this. What does he want?", es: "¿Tienes el azúcar, por favor?",
      options: ["The sugar, if you have it", "To know if you like sugar", "To give you the sugar"], answer: 0,
      why: "*¿Tienes…?* asks whether you have something: here, the sugar." },
    { q: "What has Laura just told you?", es: "Me llamo Laura. Mucho gusto.",
      options: ["Her name, and she is glad to meet you", "Her name, and where she is from", "That she likes your name a lot"], answer: 0,
      why: "*Me llamo* gives her name; *mucho gusto* is nice to meet you." },
    { q: "Laura has answered your question. What does she want now?", es: "Soy de aquí, de Bogotá. ¿Y tú?",
      options: ["The same answer from you", "To know if you live here", "To hear your name again"], answer: 0,
      why: "*¿Y tú?* sends the same question back to you." }
  ],
  yourTurn: [
    { en: "Say hello and give your name. You are Ana.", es: "Hola, soy Ana.", accept: ["Hola, [soy|me llamo] Ana."] },
    { en: "Ask someone your own age what their name is.", es: "¿Cómo te llamas?", accept: [] },
    { en: "Say you are from Canada.", es: "Soy de Canadá.", accept: [] },
    { en: "You have just said where you are from. Send the question back.", es: "¿Y tú?", accept: [] },
    { en: "Say you want to learn Spanish.", es: "Quiero aprender español.", accept: [] }
  ],
  personal: {
    prompt: "Write your own introduction, the way you would say it at that counter: your name, where you are from, and the question sent back.",
    constraints: [
      { type: "containsAny", words: ["soy", "me llamo"], label: "your name, with *soy* or *me llamo*" },
      { type: "regex", pattern: "soy de\\s+\\S+", label: "where you are from, with *soy de*" },
      { type: "regex", pattern: "\\by t[uú](?![a-zñáéíóú])", label: "the question sent back, *¿y tú?*" }
    ],
    model: "Hola, soy Sam. Soy de Canadá y quiero aprender español. ¿Y tú?"
  },
  pitfalls: [
    "*Yo soy Sam, yo soy de Canadá* is not wrong, but saying *yo* every time sounds as if you are insisting. *Soy Sam. Soy de Canadá.* is how people talk.",
    "*Buenos días* is for the morning; *hola* works at any hour, and the two together are friendly.",
    "*Mucho gusto* is the same for men and women, so it is the safe one to start with."
  ]
},

"gr-cognados-a1": {
  source: "old",
  hook: {
    line: "Most long English words came from Latin, and Spanish kept the same words. Learn seven endings and thousands of Spanish words turn out to be ones you can already read.",
    es: "El restaurante es fantástico y el café es delicioso.",
    en: "The restaurant is fantastic and the coffee is delicious."
  },
  examples: [
    { es: "La información es importante.", en: "The information is important." },
    { es: "Es una situación normal.", en: "It's a normal situation." },
    { es: "Normalmente la universidad es muy tranquila.", en: "The university is normally very quiet." }
  ],
  rule: "Seven English endings turn into Spanish ones by rule:\n-tion becomes *-ción*: *nación, información*\n-ty becomes -dad: *universidad, ciudad*\n-ly becomes *-mente*: *normalmente, realmente*\n-ous becomes *-oso*: *famoso, delicioso*\n-ic becomes *-ico*: *público, fantástico*\n-al stays *-al*: *normal, natural*\n-ant and -ent become *-ante* and *-ente*: *importante, diferente*\nWords ending in *-ción* and -dad take *la*: *la nación, la ciudad*.\nA few words only look English: *embarazada* means pregnant, and *la librería* is a bookshop.",
  readAndPick: [
    { q: "What is this in English?", es: "la actividad",
      options: ["the activity", "the active one", "actively"], answer: 0,
      why: "The ending -dad is English -ty: *actividad*, activity." },
    { q: "Which English word is this?", es: "exactamente",
      options: ["exactly", "exact", "the exactness"], answer: 0,
      why: "*-mente* is English -ly." },
    { q: "What does the sentence say about the actor?", es: "Es un actor muy famoso.",
      options: ["He's very famous", "He's very funny", "He's quite new"], answer: 0,
      why: "*-oso* is English -ous: *famoso*, famous." },
    { q: "Your friend says this. What is her news?", es: "Estoy embarazada.",
      options: ["She is expecting a baby", "She is embarrassed", "She is in a mess"], answer: 0,
      why: "A false friend: *embarazada* means pregnant. Embarrassed is *me da pena*." },
    { q: "What does this shop sell?", es: "una librería",
      options: ["books to buy", "library cards", "bookshelves"], answer: 0,
      why: "*La librería* sells books. A library is *la biblioteca*." }
  ],
  yourTurn: [
    { en: "the information", es: "la información", accept: [] },
    { en: "The university is important.", es: "La universidad es importante.", accept: [] },
    { en: "It's a normal situation.", es: "Es una situación normal.", accept: [] },
    { en: "The restaurant is fantastic.", es: "El restaurante es fantástico.", accept: [] }
  ],
  personal: {
    prompt: "Write one true sentence about your city, your work or your studies with a word you turned from English, like *importante, normal, ciudad* or *universidad*.",
    constraints: [
      { type: "regex", pattern: "\\w(ci[oó]n|dad|mente|os[oa]s?|ic[oa]s?|al|ales|antes?|entes?)\\b", label: "a word with one of the seven endings" },
      { type: "containsAny", words: ["es ", "son "], label: "*es* or *son*, to say what it is like" }
    ],
    model: "Mi ciudad es muy diferente y normalmente es tranquila."
  },
  pitfalls: [
    "The ending turns into Spanish, the sound does not come with it: say every letter the Spanish way, and put the weight at the end of *universidad* and *hospital*.",
    "A few words only look English: *actual* means current, and *el éxito* means success."
  ]
},

"presente": {
  source: "merged",
  hook: {
    line: "Where you live, what you speak, where you work: everyday life runs on verbs. Learn one set of endings and it fits hundreds of them.",
    es: "Vivo en Bogotá, trabajo en un café y hablo un poco de español.",
    en: "I live in Bogotá, I work in a café and I speak a little Spanish."
  },
  examples: [
    { es: "¿Hablas inglés?", en: "Do you speak English? (to a friend)" },
    { es: "Laura vive en el centro.", en: "Laura lives downtown." },
    { es: "Comemos a la una.", en: "We eat at one." }
  ],
  rule: "Spanish verbs end in *-ar*, *-er* or *-ir*: *hablar* (to speak), *comer* (to eat), *vivir* (to live). Take off that ending and add one that says who:\n*yo hablo, tú hablas, él, ella, usted habla, nosotros hablamos, ellos, ellas, ustedes hablan*\n*yo como, tú comes, él come, nosotros comemos, ellos comen*\n*yo vivo, tú vives, él vive, nosotros vivimos, ellos viven*\nThe *-er* and *-ir* verbs differ only for *nosotros*: *comemos*, *vivimos*.\nThe ending already says who, so *yo* and *tú* usually drop. One form covers I speak, I'm speaking and I do speak. For not, put *no* before the verb: *No hablo francés.*",
  readAndPick: [
    { q: "Who speaks Spanish at home?", es: "Hablamos español en casa.",
      options: ["We do", "They do", "I do"], answer: 0,
      why: "*-amos* is we." },
    { q: "Who is being asked?", es: "¿Vives en Bogotá?",
      options: ["One close friend", "Several friends", "A man you don't know"], answer: 0,
      why: "*-es* (*vives*) is *tú*: one person you know well." },
    { q: "Who lives downtown?", es: "Viven en el centro.",
      options: ["They do", "She does", "We do"], answer: 0,
      why: "*-en* is they, or you all." },
    { q: "Who works in a café?", es: "Usted trabaja en un café.",
      options: ["You do", "I do", "They do"], answer: 0,
      why: "*Usted* takes the same ending as he and she: *trabaja*." },
    { q: "Who eats at one?", es: "Como a la una.",
      options: ["I do", "He does", "You do"], answer: 0,
      why: "*-o* is I. No *yo* needed." },
    { q: "What does this person say about meat?", es: "No como carne.",
      options: ["They don't eat any meat", "They eat it a lot", "They want to eat it"], answer: 0,
      why: "*No* goes before the verb: I don't eat." }
  ],
  yourTurn: [
    { en: "I speak English and a little Spanish.", es: "Hablo inglés y un poco de español.", accept: [] },
    { en: "Where do you live? (to a friend)", es: "¿Dónde vives?", accept: [] },
    { en: "We eat at home.", es: "Comemos en casa.", accept: [] },
    { en: "Laura doesn't speak French.", es: "Laura no habla francés.", accept: [] },
    { en: "They live in Cali.", es: "Viven en Cali.", accept: ["Ellos viven en Cali."] }
  ],
  personal: {
    prompt: "Write one true sentence about yourself with an I form: where you live, what you speak or where you work.",
    constraints: [
      { type: "person", person: "yo", label: "a verb for *yo* (ending in *-o*)" },
      { type: "minWords", n: 3, label: "at least three words" }
    ],
    model: "Vivo en Toronto y hablo inglés y un poco de francés."
  },
  pitfalls: [
    "*Hablar* on its own is the dictionary form. To say who, swap the ending: *Hablo español*, never *Yo hablar español*.",
    "*Ustedes* takes the they ending: *ustedes hablan*, never *ustedes hablas*.",
    "*Soy trabajo* mixes two verbs. *Trabajo* already means I work."
  ]
},

"fn-responder-saludo-a2": {
  source: "old",
  hook: {
    line: "In Spanish, how are you always comes straight back to the person who asked. Answer and return it, and you sound friendly; answer and stop, and you sound in a hurry.",
    es: "Buenas tardes, ¿cómo está?\nMuy bien, gracias. ¿Y usted?",
    en: "Good afternoon, how are you?\nVery well, thank you. And you?"
  },
  examples: [
    { es: "Hola, ¿qué tal?\nBien, ¿y tú?", en: "Hi, how are you?\nGood, and you?" },
    { es: "¿Cómo estás?\nRegular, la verdad. ¿Y tú?", en: "How are you?\nNot great, to be honest. And you?" },
    { es: "¡Hola, Laura! ¡Cuánto tiempo!", en: "Hi, Laura! It's been ages!" }
  ],
  rule: "Three questions mean how are you:\n*¿Qué tal?* to anyone\n*¿Cómo estás?* to a friend\n*¿Cómo está?* or *¿Cómo está usted?* to someone you call *usted*\nThe answer has three parts: how you are, *gracias*, and the question sent back.\n*Muy bien, gracias. ¿Y tú?*\n*Bien, gracias. ¿Y usted?*\n*Regular. ¿Y tú?*\nSend back the same you they used: *¿y tú?* to a friend, *¿y usted?* to the person at the desk. *Bien* on its own is a full answer; leaving out the question back is what sounds cold.",
  readAndPick: [
    { q: "The receptionist greets you. Which you does she use?", es: "Buenas tardes, ¿cómo está usted?",
      options: ["Polite: usted", "Friendly: tú", "For a group: ustedes"], answer: 0,
      why: "*Está* and *usted*: the polite form. Answer with *¿y usted?*" },
    { q: "How is Laura today?", es: "Regular, la verdad. ¿Y tú?",
      options: ["Just okay", "Very well", "Tired out"], answer: 0,
      why: "*Regular* means just okay here, not regular." },
    { q: "Your friend answers you. What is still missing?", es: "Muy bien, gracias.",
      options: ["Asking how you are today", "Saying good morning", "Nothing, it is done"], answer: 0,
      why: "The answer is not finished until it comes back: *¿y tú?*" },
    { q: "Who is Diego talking to?", es: "Bien, gracias. ¿Y usted?",
      options: ["An older stranger", "A good friend", "His little sister"], answer: 0,
      why: "*¿Y usted?* goes to someone you treat politely, like an older stranger." },
    { q: "Ana meets an old friend. What does she say about the time?", es: "¡Cuánto tiempo!",
      options: ["It has been a long time", "What time is it?", "She is in a hurry"], answer: 0,
      why: "*¡Cuánto tiempo!* is for someone you have not seen in a while." }
  ],
  yourTurn: [
    { en: "Answer a friend: Very well, thanks. And you?", es: "Muy bien, gracias. ¿Y tú?", accept: [] },
    { en: "Answer the woman at the desk: Fine, thank you. And you?", es: "Bien, gracias. ¿Y usted?", accept: [] },
    { en: "Ask a friend: How are you? (to a friend)", es: "¿Cómo estás?", accept: ["¿Qué tal?"] },
    { en: "Ask an older neighbour: How are you? (polite)", es: "¿Cómo está usted?", accept: ["¿Cómo está?"] }
  ],
  personal: {
    prompt: "Someone asks you *¿Qué tal?* today. Write your true answer, and send the question back.",
    constraints: [
      { type: "containsAny", words: ["bien", "mal", "regular"], label: "how you are: *bien*, *mal* or *regular*" },
      { type: "regex", pattern: "y (t[uú]|usted)(?![a-záéíóúñ])", label: "the question back: *¿y tú?* or *¿y usted?*" }
    ],
    model: "Muy bien, gracias. ¿Y tú?"
  },
  pitfalls: [
    "*¿Cómo estás usted?* mixes the two. With *usted* it is *¿Cómo está usted?*",
    "In a card or a message, Spanish opens with *Querido* or *Querida* and the name, and the ending matches the reader: *Querida Laura*."
  ]
},

"ser-estar": {
  source: "merged",
  hook: {
    line: "English has one verb for to be. Spanish has two, and picking the right one changes what you mean: *es aburrido* is boring, *está aburrido* is bored.",
    es: "Laura es de Bogotá, pero hoy está en Cali.",
    en: "Laura is from Bogotá, but today she is in Cali."
  },
  examples: [
    { es: "Soy profesor. Estoy en casa.", en: "I'm a teacher. I'm at home." },
    { es: "Mi hermana es muy simpática, pero hoy está cansada.", en: "My sister is very nice, but today she is tired." },
    { es: "La sopa está fría.", en: "The soup is cold." }
  ],
  rule: "*Ser* says who or what someone is: *soy, eres, es, somos, son*.\n*Estar* says where someone is, or how they are right now: *estoy, estás, está, estamos, están*.\nSer: *Soy profesor. Es de México. Es alta.*\nEstar: *Estoy en casa. Está cansada. La sopa está fría.*\nA quick test: if the answer is a place, or how someone is today, use *estar*.\nSome words change meaning with the verb:\n*es aburrido*: boring. *está aburrido*: bored.\n*es rico*: rich. *está rico*: tasty.\nFeelings are nearly always *estar*: *Estoy contento.*",
  readAndPick: [
    { q: "Where is Laura from?", es: "Laura es de Cali, pero está en Bogotá.",
      options: ["She's from Cali", "From Bogotá", "From both cities"], answer: 0,
      why: "*Es de* says where she is from; *está en* says where she is now." },
    { q: "What does this say about Diego?", es: "Diego está aburrido.",
      options: ["He is bored today", "He is a boring man", "He is very tired"], answer: 0,
      why: "*Está*: how he is right now. *Es aburrido* would make him boring." },
    { q: "What does this say about the soup?", es: "La sopa está rica.",
      options: ["It tastes good", "It is expensive", "It is for rich people"], answer: 0,
      why: "With *estar*, *rico* is about taste." },
    { q: "Is this where Ana is, or what she does?", es: "Ana es médica.",
      options: ["What she does", "Where she is", "How she feels"], answer: 0,
      why: "*Es* names what she is: her work." },
    { q: "What does this tell you about the bank?", es: "El banco está en el centro.",
      options: ["Where in town it is", "What it is like", "When it opens"], answer: 0,
      why: "*Estar en* plus a place: where something is." }
  ],
  yourTurn: [
    { en: "I'm from Toronto, but I'm in Bogotá.", es: "Soy de Toronto, pero estoy en Bogotá.", accept: [] },
    { en: "The soup is cold.", es: "La sopa está fría.", accept: [] },
    { en: "My sister is very nice.", es: "Mi hermana es muy simpática.", accept: [] },
    { en: "He's bored.", es: "Está aburrido.", accept: ["Él está aburrido."] },
    { en: "We're at home.", es: "Estamos en casa.", accept: [] }
  ],
  personal: {
    prompt: "Write one true sentence with both verbs: where you are from with *ser*, and where you are or how you are right now with *estar*.",
    constraints: [
      { type: "infinitiveUsed", inf: "ser", label: "a form of *ser*: *soy*, *es*…" },
      { type: "infinitiveUsed", inf: "estar", label: "a form of *estar*: *estoy*, *está*…" }
    ],
    model: "Soy de Toronto, pero ahora estoy en Bogotá y estoy un poco cansado."
  },
  pitfalls: [
    "Where a person or a thing is takes *estar*, but where an event happens takes *ser*: *La fiesta es en mi casa.*",
    "*Soy bien* is a slip: how you are today is *estar*, *Estoy bien.*",
    "*Está*, with an accent, is the verb; *esta* without it means this."
  ]
},

"nt-origen-a1": {
  source: "merged",
  hook: {
    line: "Where are you from and how old are you are the two questions every new acquaintance asks. Spanish answers the first with *ser* and the second with *tener*: you have your years.",
    es: "¿De dónde eres?\nSoy de Irlanda. ¿Y tú?",
    en: "Where are you from?\nI'm from Ireland. And you?"
  },
  examples: [
    { es: "Mi profesora es mexicana.", en: "My teacher is Mexican." },
    { es: "Somos de un pueblo pequeño cerca de Bogotá.", en: "We're from a small town near Bogotá." },
    { es: "Mi hija tiene cinco años.", en: "My daughter is five." }
  ],
  rule: "Two ways to say where someone is from, both with *ser*:\n*ser de* plus a place: *Soy de Cali. Es de Canadá.*\n*ser* plus a nationality: *Es mexicano. Es mexicana. Son mexicanos.*\n*Ser de* always works, even when you do not know the word for the nationality. Nationalities take a small letter and change for a woman: *cubano, cubana*.\nTo ask: *¿De dónde eres?* or, politely, *¿De dónde es usted?*\nAge is something you have: *tener*, the number, then *años*.\n*Tengo veinte años. Mi abuelo tiene ochenta años.*\nTo ask: *¿Cuántos años tienes?*",
  readAndPick: [
    { q: "What does this tell you about Luis?", es: "Luis es cubano.",
      options: ["His country", "His age", "Where he is now"], answer: 0,
      why: "*Es* plus a nationality says where he comes from." },
    { q: "Whose age is this?", es: "Tengo veinte años.",
      options: ["The speaker's own", "The speaker's son's", "The listener's"], answer: 0,
      why: "*Tengo*: I have. The speaker is giving their own age." },
    { q: "Who is the question for?", es: "¿De dónde es usted?",
      options: ["A stranger", "A close friend", "A group"], answer: 0,
      why: "*Es usted*: the polite you, for someone you don't know." },
    { q: "Is the teacher a man or a woman?", es: "Mi profesora es mexicana.",
      options: ["A woman", "A man", "We can't tell"], answer: 0,
      why: "*Profesora* and *mexicana* both end in *-a*: a woman." },
    { q: "What does Tom say?", es: "Soy de Irlanda. ¿Y tú?",
      options: ["He is from Ireland", "He lives in Ireland", "He likes Ireland"], answer: 0,
      why: "*Soy de*: I'm from." }
  ],
  yourTurn: [
    { en: "I'm from Canada.", es: "Soy de Canadá.", accept: [] },
    { en: "Where are you from? (to a friend)", es: "¿De dónde eres?", accept: [] },
    { en: "She's Mexican.", es: "Es mexicana.", accept: ["Ella es mexicana."] },
    { en: "How old are you? (to a friend)", es: "¿Cuántos años tienes?", accept: [] },
    { en: "I'm twenty (veinte).", es: "Tengo veinte años.", accept: ["Tengo veinte."] }
  ],
  personal: {
    prompt: "Write one true sentence: where you are from, and how old you are. Someone in your family is fine too, if you would rather.",
    constraints: [
      { type: "regex", pattern: "\\b(soy|es|somos|son) de\\b", label: "where from, with *soy de* or *es de*" },
      { type: "infinitiveUsed", inf: "tener", label: "an age with *tengo* or *tiene*" },
      { type: "containsWord", word: "años", label: "the word *años*" }
    ],
    model: "Soy de Toronto y tengo treinta años."
  },
  pitfalls: [
    "*Soy veinte años* is not Spanish: age is *tener*. *Tengo veinte años.*",
    "Nationalities take a small letter: *es mexicana*, not *es Mexicana*.",
    "*Viejo* said of a person can sound blunt; *mayor* is the kind word: *Mi abuelo ya es mayor.*"
  ]
},

"fn-identificar-a1": {
  source: "old",
  hook: {
    line: "At a desk, in a classroom or on your new street, someone says your name and you need to say that's me. And when you cannot name a thing yet, you point and ask what it is.",
    es: "¿Eres la vecina nueva?\nSí, soy yo. Soy Nadia.",
    en: "Are you the new neighbour?\nYes, that's me. I'm Nadia."
  },
  examples: [
    { es: "¿Qué es esto?\nEs un diccionario de español.", en: "What's this?\nIt's a Spanish dictionary." },
    { es: "Este señor es mi profesor.", en: "This man is my teacher." }
  ],
  rule: "When someone says your name, confirm with *soy yo*: *Sí, soy yo.* Yes, that's me.\nTo ask what a thing is, point and say *¿Qué es esto?* (this, near me) or *¿Qué es eso?* (that, near you). Use *esto* and *eso* while the thing has no name yet.\nThe answer names it with *un* or *una*: *Es un diccionario. Es una carpeta.*\nOnce it has a name, the pointing word matches it:\n*este diccionario, esta carpeta*: this\n*ese diccionario, esa carpeta*: that\n*Este señor es mi profesor*: this man is my teacher.",
  readAndPick: [
    { q: "Someone reads out a name and Nadia answers. What does she mean?", es: "Sí, soy yo.",
      options: ["Yes, that's me", "Yes, I'm going", "Yes, it's mine"], answer: 0,
      why: "*Soy yo*: it is me." },
    { q: "Is the thing near the speaker or near the listener?", es: "¿Qué es eso?",
      options: ["Near the listener", "Right by the speaker", "Far from both"], answer: 0,
      why: "*Eso*: that, near the person you are talking to. *Esto* would be near me." },
    { q: "What is it?", es: "Es mi celular nuevo.",
      options: ["My new phone", "A new number", "My phone number"], answer: 0,
      why: "*Mi celular*: my phone. *Nuevo*: new." },
    { q: "Who is the teacher?", es: "Este señor es mi profesor.",
      options: ["This man here", "That woman there", "My brother"], answer: 0,
      why: "*Este señor*: this man, near the speaker." },
    { q: "What does the speaker ask for?", es: "Esa carpeta, por favor.",
      options: ["That folder there", "This carpet here", "A folder, any one"], answer: 0,
      why: "*Esa*: that one, near you. *Carpeta* is a folder, not a carpet." }
  ],
  yourTurn: [
    { en: "Someone says your name. Say: Yes, that's me.", es: "Sí, soy yo.", accept: [] },
    { en: "Point at something near you and ask what it is.", es: "¿Qué es esto?", accept: [] },
    { en: "It's a dictionary.", es: "Es un diccionario.", accept: [] },
    { en: "This man is my teacher.", es: "Este señor es mi profesor.", accept: ["Este [señor|hombre] es mi profesor."] }
  ],
  personal: {
    prompt: "Look at one thing on your table and write what it is, the way you would answer *¿Qué es esto?*",
    constraints: [
      { type: "regex", pattern: "\\bes (un|una|mi)\\b", label: "start with *es un*, *es una* or *es mi*" },
      { type: "minWords", n: 3, label: "at least three words" }
    ],
    model: "Es mi computador. Es un computador muy viejo."
  },
  pitfalls: [
    "*Sí, yo* on its own sounds unfinished: confirm with the verb, *Sí, soy yo.*",
    "*Esto* never has a word for the thing after it: *esto*, then *este diccionario* once it has a name."
  ]
},

"fn-agradecer-a1": {
  source: "merged",
  hook: {
    line: "*Gracias* is the easy half. The half beginners skip is the reply, and in Colombia saying nothing after someone thanks you sounds colder than it does in English.",
    es: "Muchas gracias por la ayuda.\nCon mucho gusto.",
    en: "Thank you very much for the help.\nMy pleasure."
  },
  examples: [
    { es: "Aquí tienes tu café.\nGracias.\nDe nada.", en: "Here's your coffee.\nThanks.\nYou're welcome." },
    { es: "Mil gracias por venir.", en: "Thanks a million for coming." },
    { es: "Gracias por todo.\nA ti.", en: "Thanks for everything.\nNo, thank you." }
  ],
  rule: "*Gracias* on its own is always enough. To raise it: *muchas gracias*, or the very Colombian *mil gracias*. Never *muy gracias*.\nTo say what for, add *por*: *gracias por la ayuda*, *gracias por todo*. With an action, the verb stays in its dictionary form: *gracias por venir*, *gracias por esperar*.\nThe reply matters:\n*De nada*: you're welcome, with anyone.\n*Con mucho gusto*: my pleasure, very common in Colombia.\n*A la orden*: at your service, from people who serve you.\n*A ti* or *a usted*: no, thank you, when the thanks should go both ways.",
  readAndPick: [
    { q: "What is the thanks for?", es: "Gracias por venir.",
      options: ["For coming by", "For the coffee", "For waiting"], answer: 0,
      why: "*Venir* is to come: thanks for coming." },
    { q: "How strong is this thanks?", es: "Mil gracias por todo.",
      options: ["Very strong", "Quite cold", "Just polite"], answer: 0,
      why: "*Mil gracias*: a thousand thanks." },
    { q: "The waiter says this after you thank him. What does he mean?", es: "A la orden.",
      options: ["Glad to help", "Order now, please", "That's all in order"], answer: 0,
      why: "*A la orden*: at your service, a reply to thanks." },
    { q: "Is the speaker thanking someone, or answering thanks?", es: "Con mucho gusto.",
      options: ["Answering", "Thanking", "Greeting"], answer: 0,
      why: "*Con mucho gusto*: my pleasure, a reply." },
    { q: "What does Ana thank Diego for?", es: "Gracias por la ayuda, Diego.",
      options: ["The help he gave", "His phone call", "The coffee"], answer: 0,
      why: "*La ayuda*: the help." }
  ],
  yourTurn: [
    { en: "Thank you very much.", es: "Muchas gracias.", accept: ["Mil gracias."] },
    { en: "Thanks for the help.", es: "Gracias por la ayuda.", accept: [] },
    { en: "Thanks for coming.", es: "Gracias por venir.", accept: [] },
    { en: "Someone thanks you. Say: You're welcome.", es: "De nada.", accept: ["Con mucho gusto."] }
  ],
  personal: {
    prompt: "Think of someone who helped you this week. Write them one true line of thanks with *gracias por*.",
    constraints: [
      { type: "containsWord", word: "gracias por", label: "*gracias por*, then what for" },
      { type: "minWords", n: 3, label: "at least three words" }
    ],
    model: "Mil gracias por el café, Laura."
  },
  pitfalls: [
    "*Muy gracias* is a slip: *gracias* takes *muchas*.",
    "*Gracias para* is a slip: thanks always take *por*.",
    "*Gracias por vienes* mixes two forms: after *por* the verb stays as *venir*."
  ]
},

"fn-establecer-comunicacion-a1": {
  source: "old",
  hook: {
    line: "A conversation needs a way in and a way out. A word to get someone's attention, and a goodbye that names the next time, are what stop you from just walking off.",
    es: "¡Perdón! ¿Tiene hora?\nSí, son las tres.\nGracias. Hasta luego.",
    en: "Excuse me! Do you have the time?\nYes, it's three o'clock.\nThanks. See you later."
  },
  examples: [
    { es: "¡Quiubo, Carlos! ¿Qué más?", en: "Hey, Carlos! How's it going?" },
    { es: "Con permiso.", en: "Excuse me (as you pass someone, or as you leave)." },
    { es: "Bueno, chao. ¡Hasta el lunes!", en: "Okay, bye. See you Monday!" }
  ],
  rule: "To get someone's attention:\n*Perdón* or *Disculpe*, to a stranger\nthe person's name, to a friend: *¡Laura!*\n*¿Quiubo?*, hey, what's up, between friends in Colombia\nWhen someone calls you, answer *¿Sí?* It means I'm listening, go ahead.\n*Con permiso* is what you say as you pass someone, or as you leave a room.\nTo close, name the next time:\n*Hasta luego*: see you later\n*Hasta mañana*: see you tomorrow\n*Hasta el lunes*: see you Monday, with *el* before the day\n*Chao* is the everyday bye; *adiós* is a little more final.",
  readAndPick: [
    { q: "Ana answers when her friend calls her. What does she mean?", es: "¡Ana!\n¿Sí?",
      options: ["Go on, I hear you", "Yes, I agree with that", "Yes, that's my name"], answer: 0,
      why: "*¿Sí?* here means go ahead, I'm listening." },
    { q: "When will they see each other again?", es: "Chao, hasta mañana.",
      options: ["Tomorrow", "On Monday", "Later today"], answer: 0,
      why: "*Hasta mañana*: until tomorrow." },
    { q: "What is the speaker about to do?", es: "Con permiso.",
      options: ["Get past you, or go", "Ask for your name", "Sit down with you"], answer: 0,
      why: "*Con permiso*: with your permission, said as you pass or leave." },
    { q: "Who is this greeting for?", es: "¡Quiubo, Carlos! ¿Qué más?",
      options: ["A friend of his", "A total stranger", "A teacher"], answer: 0,
      why: "*¿Quiubo?* is between friends in Colombia." },
    { q: "How does this person get a stranger's attention?", es: "Disculpe, ¿tiene hora?",
      options: ["With a polite excuse me", "With a loud hey", "With his first name"], answer: 0,
      why: "*Disculpe* is the polite way in, and *tiene* is the *usted* form." }
  ],
  yourTurn: [
    { en: "Get a stranger's attention politely and ask if they have the time.", es: "Disculpe, ¿tiene hora?", accept: ["[Disculpe|Perdón|Perdone], ¿tiene hora(, por favor)?"] },
    { en: "Someone calls your name. Answer with the word that means I'm listening.", es: "¿Sí?", accept: [] },
    { en: "Say bye, see you tomorrow.", es: "Chao, hasta mañana.", accept: ["[Chao|Adiós], hasta mañana."] },
    { en: "See you Monday!", es: "¡Hasta el lunes!", accept: [] },
    { en: "You need to get past someone. What do you say?", es: "Con permiso.", accept: [] }
  ],
  personal: {
    prompt: "Write the goodbye you will really say to someone today: *chao*, *adiós* or *hasta luego*, and when you will see them next.",
    constraints: [
      { type: "containsAny", words: ["chao", "adiós", "hasta luego"], label: "a goodbye: *chao*, *adiós* or *hasta luego*" },
      { type: "regex", pattern: "hasta (mañana|manana|el|la|luego|pronto)", label: "when: *hasta mañana*, *hasta el lunes*…" }
    ],
    model: "Bueno, chao, Laura. ¡Hasta mañana!"
  },
  pitfalls: [
    "*Hasta lunes* is missing a word: *hasta el lunes*.",
    "A bare *¡Eh!* is fine with friends in the street, abrupt with anyone older: start with *disculpe*."
  ]
},

"task-presentarse": {
  source: "old",
  hook: {
    line: "This week ends the way it began, at a café counter. This time you write both halves of a first meeting yourself, and nothing in it is new.",
    es: "Clara: Hola, buenas tardes. Me llamo Clara. ¿Y tú?\nYusuf: Me llamo Yusuf. Mucho gusto.",
    en: "Clara: Hello, good afternoon. My name is Clara. And you?\nYusuf: My name is Yusuf. Nice to meet you."
  },
  examples: [
    { es: "Clara: Mucho gusto, Yusuf. ¿De dónde eres?\nYusuf: Soy de Turquía. ¿Y tú?", en: "Clara: Nice to meet you, Yusuf. Where are you from?\nYusuf: I'm from Turkey. And you?" },
    { es: "Clara: Aquí tienes tu café.\nYusuf: Ah, muchas gracias.\nClara: De nada. Hasta luego.", en: "Clara: Here's your coffee.\nYusuf: Oh, thank you very much.\nClara: You're welcome. See you later." }
  ],
  rule: "A first meeting has six moves, and you have the words for every one:\nGreet: *Hola, buenas tardes.*\nNames: *Me llamo Clara. ¿Y tú? Mucho gusto.*\nWhere from: *¿De dónde eres? Soy de Turquía.*\nHow you are: *¿Qué tal? Bien, ¿y tú?*\nThanks: *Muchas gracias. De nada.*\nGoodbye: *Hasta luego. Chao.*\nKeep each line short: one turn, eight words or fewer. Leave out *yo*: *me llamo*, not *yo me llamo*. Send each question back with *¿y tú?*",
  readAndPick: [
    { q: "What does Yusuf do in this line?", es: "Soy de Turquía, de Esmirna.",
      options: ["Says where he's from", "Gives his name", "Says how he feels"], answer: 0,
      why: "*Soy de* plus a place: where he comes from." },
    { q: "Clara has just said this. What should Yusuf say next?", es: "Me llamo Clara. ¿Y tú?",
      options: ["His own name", "Where he lives", "Thank you"], answer: 0,
      why: "*¿Y tú?* sends the name question back." },
    { q: "What is this line for?", es: "De nada. Hasta luego, Yusuf.",
      options: ["A reply and a goodbye", "A hello and a question", "A question about Yusuf"], answer: 0,
      why: "*De nada* answers *gracias*; *hasta luego* closes." },
    { q: "Who says this, a man or a woman?", es: "Encantada, Yusuf.",
      options: ["A woman", "A man", "Either one"], answer: 0,
      why: "*Encantada* ends in *-a*: a woman says it. A man says *encantado*." }
  ],
  yourTurn: [
    { en: "Greet someone in the afternoon.", es: "Hola, buenas tardes.", accept: ["Buenas tardes."] },
    { en: "Give your name (you are Clara) and send the question back.", es: "Me llamo Clara. ¿Y tú?", accept: ["[Me llamo|Soy] Clara. ¿Y tú?"] },
    { en: "Ask him where he is from.", es: "¿De dónde eres?", accept: [] },
    { en: "You're welcome. See you later.", es: "De nada. Hasta luego.", accept: [] }
  ],
  personal: {
    prompt: "Write your own first two lines for real: a greeting with your name, then where you are from.",
    constraints: [
      { type: "containsAny", words: ["hola", "buenos días", "buenas tardes", "buenas noches"], label: "a greeting" },
      { type: "containsAny", words: ["me llamo", "soy"], label: "your name, with *me llamo* or *soy*" },
      { type: "regex", pattern: "soy de\\s+\\S+", label: "where you are from, with *soy de*" }
    ],
    model: "Hola, buenas tardes. Me llamo Sam y soy de Canadá."
  },
  pitfalls: [
    "*Yo me llamo* is not wrong, but *me llamo* alone is how people say it.",
    "End with a goodbye: a meeting that just stops reads as cold."
  ]
},

/* ---- unit 2 · Ask a question ------------------------------------------- */

"gr-interrogativos-a1": {
  source: "merged",
  hook: {
    line: "With five question words you can interview anyone: where they live, what they study, who that is, how much it costs. Every one of them wears an accent.",
    es: "¿Dónde vives? ¿Qué estudias? ¿Cuántos hermanos tienes?",
    en: "Where do you live? What do you study? How many brothers and sisters do you have?"
  },
  examples: [
    { es: "¿Quién es esa chica?", en: "Who is that girl?" },
    { es: "¿Cuánto cuesta un tinto?", en: "How much is a black coffee?" },
    { es: "¿Cómo te llamas?", en: "What's your name?" }
  ],
  rule: "The question words:\n*qué*: what\n*quién*, *quiénes*: who\n*dónde*: where\n*cómo*: how\n*cuánto, cuánta, cuántos, cuántas*: how much, how many\nEvery one carries an accent. A question opens with *¿* and closes with *?*, and there is no do or does: *¿Dónde vives?* is where live you.\n*Cuánto* matches the word after it: *cuánto dinero, cuánta gente, cuántos años, cuántas hermanas*.\nNames are the odd one out: Spanish asks how, *¿Cómo te llamas?*, not what.",
  readAndPick: [
    { q: "What does the speaker want to know?", es: "¿Dónde trabajas?",
      options: ["Where you work", "When you work", "Who you work with"], answer: 0,
      why: "*Dónde*: where." },
    { q: "What does the speaker want to know?", es: "¿Quién es ese señor?",
      options: ["Who the man is", "What the man does", "Where the man is"], answer: 0,
      why: "*Quién*: who." },
    { q: "What is being counted?", es: "¿Cuántas hermanas tienes?",
      options: ["Sisters", "Brothers", "Years"], answer: 0,
      why: "*Cuántas* and *hermanas* both end in *-as*." },
    { q: "What does she want to know?", es: "¿Cuánto cuesta el café?",
      options: ["How much it is", "How big it is", "What time it is"], answer: 0,
      why: "*Cuánto*: how much." },
    { q: "What does he want to know?", es: "¿Qué estudias?",
      options: ["What you study", "Where you study", "Why you study"], answer: 0,
      why: "*Qué*: what." },
    { q: "What is the question about?", es: "¿Cómo te llamas?",
      options: ["Your first name", "How you are", "What you call it"], answer: 0,
      why: "*¿Cómo te llamas?* asks your name: literally, how do you call yourself." }
  ],
  yourTurn: [
    { en: "Where do you live? (to a friend)", es: "¿Dónde vives?", accept: [] },
    { en: "Who is that girl?", es: "¿Quién es esa chica?", accept: [] },
    { en: "How much money do you have? (to a friend)", es: "¿Cuánto dinero tienes?", accept: [] },
    { en: "What do you study? (to a friend)", es: "¿Qué estudias?", accept: [] },
    { en: "How many sisters do you have? (to a friend)", es: "¿Cuántas hermanas tienes?", accept: [] }
  ],
  personal: {
    prompt: "Write two questions you would really ask a new neighbour, with two different question words.",
    constraints: [
      { type: "question", label: "written as questions, with *¿* and *?*" },
      { type: "regex", pattern: "\\?[^?]*\\?", label: "two questions" },
      { type: "regex", pattern: "(qué|quién|quiénes|dónde|cómo|cuánt[oa]s?)", label: "a question word with its accent" }
    ],
    model: "¿Cómo te llamas? ¿Dónde trabajas?"
  },
  pitfalls: [
    "*¿Donde vives?* without the accent is a slip: question words always carry it.",
    "*Cuánto hermanas* does not match: *cuántas hermanas*.",
    "Spanish opens a question too: *¿* at the start."
  ]
},

"dc-entonacion-a1": {
  source: "old",
  hook: {
    line: "Spanish has no do or does to flag a question. The words *Tienes hambre* can tell or ask, and only your voice going up at the end, or the *¿ ?* on the page, shows which.",
    es: "Tienes hambre.\n¿Tienes hambre?",
    en: "You're hungry.\nAre you hungry?"
  },
  examples: [
    { es: "Vive en Bogotá.\n¿Vive en Bogotá?", en: "He lives in Bogotá.\nDoes he live in Bogotá?" },
    { es: "Creo que el examen es difícil.", en: "I think the exam is difficult." }
  ],
  rule: "A yes or no question can use exactly the same words as the statement. What changes is the voice and the marks:\n*Es colombiano.* Your voice falls: you are telling.\n*¿Es colombiano?* Your voice goes up at the end: you are asking.\nWith a question word, the voice can fall again, because the word already asks: *¿Dónde vives?*\nOn the page, *¿* at the start warns you a question is coming.\nTwo small things make you sound kinder: *creo que* before an opinion, *Creo que es difícil*, and *usted* with a stranger, *¿Usted es el nuevo director?*",
  readAndPick: [
    { q: "Is Laura telling you or asking you?", es: "¿Tienes hambre?",
      options: ["Asking a question", "Telling you a fact", "Giving an order"], answer: 0,
      why: "The *¿ ?* make it a question: the voice goes up." },
    { q: "Does the speaker know where Ana lives?", es: "¿Ana vive en Medellín?",
      options: ["No, he is asking", "Yes, he is telling", "Yes, she told him"], answer: 0,
      why: "The question marks: he is checking, not telling." },
    { q: "How does this person put it?", es: "Creo que es muy difícil.",
      options: ["Softly, as a view", "Certain, as a fact", "Angry about it"], answer: 0,
      why: "*Creo que*: I think. It turns a fact into a view." },
    { q: "Who is the speaker talking to?", es: "¿Usted es el nuevo director?",
      options: ["Someone new to them", "An old friend", "Their brother"], answer: 0,
      why: "*Usted*: the polite you, for someone you don't know." }
  ],
  yourTurn: [
    { en: "Are you hungry? (to a friend)", es: "¿Tienes hambre?", accept: [] },
    { en: "Ask: Does he live in Bogotá?", es: "¿Vive en Bogotá?", accept: [] },
    { en: "I think it's very difficult.", es: "Creo que es muy difícil.", accept: [] },
    { en: "Ask a stranger: Are you the new teacher? (polite)", es: "¿Usted es el nuevo profesor?", accept: ["¿Es usted el nuevo profesor?", "¿Es el nuevo profesor?"] }
  ],
  personal: {
    prompt: "Write one yes or no question you could really ask someone today, with no question word: just the marks.",
    constraints: [
      { type: "question", label: "with *¿* at the start and *?* at the end" },
      { type: "regex", pattern: "^\\s*¿\\s*(?!(qu[eé]|qui[eé]n|d[oó]nde|c[oó]mo|cu[aá]nt|cu[aá]l|cu[aá]ndo|por qu))", label: "no question word at the start" }
    ],
    model: "¿Tienes tiempo mañana?"
  },
  pitfalls: [
    "On the page, a question needs both marks: *¿Tienes hambre?*, never just the one at the end.",
    "*Creo que* is a courtesy, not doubt: people use it even when they are fairly sure."
  ]
},

"gr-pronombre-sujeto-a1": {
  source: "merged",
  hook: {
    line: "Saying *yo* in every sentence is the quickest way to sound foreign: the verb ending already says who. Today you learn when to keep it, and the two Spanish words for you.",
    es: "Yo trabajo en un hospital, ella trabaja en un banco.",
    en: "I work in a hospital; she works in a bank."
  },
  examples: [
    { es: "Trabajo en un hospital.", en: "I work in a hospital." },
    { es: "Usted tiene razón, señora.", en: "You're right, ma'am." },
    { es: "¿Ustedes son de aquí?", en: "Are you all from here?" }
  ],
  rule: "The words for who:\n*yo*: I\n*tú*: you, to a friend\n*él, ella*: he, she\n*usted*: you, politely\n*nosotros, nosotras*: we\n*ellos, ellas*: they\n*ustedes*: you, more than one\nThe ending already says who, so these usually drop: *Trabajo en un hospital.* Keep one to compare people: *Yo trabajo aquí, ella no.*\n*Usted* means you but takes the he and she ending: *usted trabaja, usted tiene*. *Ustedes* takes the they ending: *ustedes trabajan*. In Latin America *ustedes* is for every group, friends included.",
  readAndPick: [
    { q: "Who works in a hospital?", es: "Trabajo en un hospital.",
      options: ["The speaker", "Her sister", "The listener"], answer: 0,
      why: "*-o* is I: no *yo* needed." },
    { q: "Who is the speaker talking to?", es: "Usted tiene razón.",
      options: ["An older man she meets", "Her best friend", "A whole group"], answer: 0,
      why: "*Usted*: one person, politely." },
    { q: "How many people is the speaker asking?", es: "¿Ustedes son de aquí?",
      options: ["More than one", "Only one person", "Only herself"], answer: 0,
      why: "*Ustedes*: you, more than one." },
    { q: "What is different about the two people?", es: "Yo vivo en Cali, ella vive en Lima.",
      options: ["Where they live", "Where they're from", "Where they work"], answer: 0,
      why: "*Yo* and *ella* are there to compare two people." },
    { q: "Who is being asked?", es: "¿Tiene hora?",
      options: ["One stranger", "A close friend", "Two friends"], answer: 0,
      why: "*Tiene* with no *s*: *usted*, the polite you." }
  ],
  yourTurn: [
    { en: "I work in a bank.", es: "Trabajo en un banco.", accept: [] },
    { en: "Ask a stranger: Do you live here? (polite)", es: "¿Usted vive aquí?", accept: ["¿Vive (usted) aquí?", "¿Vive aquí usted?"] },
    { en: "Ask a friend: Do you live here? (to a friend)", es: "¿Vives aquí?", accept: ["¿Tú vives aquí?"] },
    { en: "I live in Cali, she lives in Lima.", es: "Yo vivo en Cali, ella vive en Lima.", accept: ["Yo vivo en Cali y ella vive en Lima."] },
    { en: "You're right, ma'am.", es: "Usted tiene razón, señora.", accept: ["Tiene razón, señora."] }
  ],
  personal: {
    prompt: "Write one true sentence comparing yourself with someone you know, with *yo* and one other word for who.",
    constraints: [
      { type: "regex", pattern: "(^|[^a-záéíóúñ])yo(?![a-záéíóúñ])", label: "*yo*, for the comparison" },
      { type: "regex", pattern: "(^|[^a-záéíóúñ])(él|ella|ellos|ellas|tú|usted|ustedes|nosotros|nosotras)(?![a-záéíóúñ])", label: "one more word for who: *él, ella, tú…*" },
      { type: "person", person: "yo", label: "a verb for *yo*" }
    ],
    model: "Yo trabajo en una oficina; mi hermana no, ella estudia."
  },
  pitfalls: [
    "*Usted trabajas* mixes the two: *usted* takes the he and she ending, *usted trabaja*.",
    "Spain has one more word for you all among friends. You may meet it in films from Spain; in Latin America *ustedes* does the job.",
    "*Llueve* needs nothing in front: it's raining is just *Llueve*."
  ]
},

"fn-pedir-informacion-a1": {
  source: "merged",
  hook: {
    line: "Talking to a stranger is half questions and half rescue: how to spell a name, what a word means, and why you are here at all. Two small words answer why: *para* and *porque*.",
    es: "¿Por qué estudias español?\nPara hablar con mi familia.",
    en: "Why are you learning Spanish?\nTo talk with my family."
  },
  examples: [
    { es: "¿Cómo se escribe tu apellido?", en: "How do you spell your surname?" },
    { es: "Estudio español porque quiero vivir aquí.", en: "I'm learning Spanish because I want to live here." },
    { es: "¿Qué significa esta palabra?", en: "What does this word mean?" }
  ],
  rule: "Four lines get you through a conversation with a stranger:\n*¿Cómo se escribe?* How do you spell it?\n*¿Qué significa…?* What does … mean?\n*¿Puede repetir, por favor?* Can you say it again?\n*Más despacio, por favor.* Slower, please.\nTwo ways to answer why, *¿por qué?*:\n*para* plus the dictionary form, for the goal: *Estudio para vivir aquí.*\n*porque* plus a whole sentence, for the reason: *Estudio porque quiero vivir aquí.*\n*¿Por qué?* is two words with an accent; the answer, *porque*, is one.",
  readAndPick: [
    { q: "What does Laura want to know?", es: "¿Cómo se escribe tu nombre?",
      options: ["The spelling", "The meaning", "How to say it"], answer: 0,
      why: "*¿Cómo se escribe?* How is it written." },
    { q: "Is this a goal or a reason?", es: "Estudio español para trabajar en Chile.",
      options: ["A goal: to work there", "A reason: he works there", "A wish to leave Chile"], answer: 0,
      why: "*Para* plus *trabajar*: what he is after." },
    { q: "Why does Ana study Spanish?", es: "Porque quiero vivir aquí.",
      options: ["She wants to stay", "She lives here now", "To go back home"], answer: 0,
      why: "*Porque* plus a sentence: *quiero vivir aquí*." },
    { q: "What does the speaker need?", es: "Más despacio, por favor.",
      options: ["For you to speak slower", "A pen to write with", "A bit more time"], answer: 0,
      why: "*Más despacio*: more slowly." },
    { q: "Is this the question or the answer?", es: "Porque me gusta.",
      options: ["The answer", "The question", "Neither one"], answer: 0,
      why: "*Porque* in one word, with no accent: because." }
  ],
  yourTurn: [
    { en: "How do you spell it?", es: "¿Cómo se escribe?", accept: [] },
    { en: "What does this word mean?", es: "¿Qué significa esta palabra?", accept: [] },
    { en: "I'm learning Spanish to work in Chile.", es: "Estudio español para trabajar en Chile.", accept: [] },
    { en: "I'm learning Spanish because I want to live here.", es: "Estudio español porque quiero vivir aquí.", accept: [] },
    { en: "Slower, please.", es: "Más despacio, por favor.", accept: [] }
  ],
  personal: {
    prompt: "Why are you learning Spanish? Write your true answer, with *para* or *porque*.",
    constraints: [
      { type: "containsAny", words: ["para", "porque"], label: "*para* or *porque*" },
      { type: "minWords", n: 4, label: "at least four words" }
    ],
    model: "Estudio español para hablar con mis amigos de Bogotá."
  },
  pitfalls: [
    "*Para quiero* mixes the two: *para* takes the dictionary form, *para vivir*; a form like *quiero* needs *porque*.",
    "*¿Porque?* in one word is the answer, not the question: *¿Por qué?*"
  ]
},

"task-preguntar": {
  source: "old",
  hook: {
    line: "This task puts the whole week to work on one person: five real questions, five answers, and one moment where you have to ask them to say it again.",
    es: "¿Dónde vives, Paula?\nEn Bogotá, en Chapinero.",
    en: "Where do you live, Paula?\nIn Bogotá, in Chapinero."
  },
  examples: [
    { es: "¿Trabajas aquí?\nNo, estudio.", en: "Do you work here?\nNo, I study." },
    { es: "Perdón, ¿puedes repetir? Más despacio, por favor.", en: "Sorry, can you say that again? Slower, please." }
  ],
  rule: "An interview needs a mix of questions:\n*qué*: *¿Qué estudias?*\n*dónde*: *¿Dónde vives?*\n*cuántos*: *¿Cuántos hermanos tienes?*\nand one with no question word, just the marks: *¿Trabajas aquí?*\nAnd one rescue, for when you miss the answer:\n*Perdón, ¿puedes repetir?*\n*Más despacio, por favor.*\n*No entiendo.*\nEvery question opens with *¿* and closes with *?*. Short answers are fine when you talk: *En Bogotá. Tres.*",
  readAndPick: [
    { q: "What kind of answer does this question want?", es: "¿Trabajas aquí?",
      options: ["A yes or a no", "The name of a place", "A number"], answer: 0,
      why: "No question word: the answer is *sí* or *no*." },
    { q: "What kind of answer does Paula expect?", es: "¿Cuántos hermanos tienes?",
      options: ["A number", "A name", "A yes or a no"], answer: 0,
      why: "*Cuántos*: how many." },
    { q: "What has gone wrong?", es: "Perdón, no entiendo. ¿Puedes repetir?",
      options: ["He didn't catch what was said", "He disagrees with it", "He wants to leave"], answer: 0,
      why: "*No entiendo*: I don't understand." },
    { q: "Where does Paula live?", es: "¿Dónde vives, Paula?\nEn Chapinero.",
      options: ["In Chapinero", "She won't say", "She studies there"], answer: 0,
      why: "*Dónde* asks for a place, and the answer is a place." }
  ],
  yourTurn: [
    { en: "Do you work here? (to a friend)", es: "¿Trabajas aquí?", accept: [] },
    { en: "How many brothers and sisters do you have? (to a friend)", es: "¿Cuántos hermanos tienes?", accept: [] },
    { en: "Sorry, can you say that again?", es: "Perdón, ¿puedes repetir?", accept: ["[Perdón|Disculpa|Disculpe], ¿[puedes|puede] repetir(, por favor)?"] },
    { en: "I don't understand.", es: "No entiendo.", accept: [] }
  ],
  personal: {
    prompt: "Write one real question you would ask someone you meet this week, and your own answer to it.",
    constraints: [
      { type: "question", label: "a question, with *¿* and *?*" },
      { type: "person", person: "yo", label: "your own answer, with an I form" }
    ],
    model: "¿Dónde vives? Vivo en Toronto, cerca del lago."
  },
  pitfalls: [
    "*¿Puedes contestar?* asks them to answer, not to repeat: say *¿puedes repetir?*",
    "A question needs *¿* at the start as well as *?* at the end."
  ]
},

/* ---- unit 3 · Be polite ------------------------------------------------- */

"fn-dirigirse-a1": {
  source: "old",
  hook: {
    line: "How you open a conversation says how close you are before anything else. A first name is friendly, *señor* or *señora* with a surname is polite, and *buenos días* is safe with anyone.",
    es: "Te presento a mi hermana, Laura.\nHola, encantado. ¿Qué tal?",
    en: "Let me introduce my sister, Laura.\nHi, pleased to meet you. How are you?"
  },
  examples: [
    { es: "Buenos días, señor López.", en: "Good morning, Mr López." },
    { es: "Hola, Maite, ¿qué tal?", en: "Hi, Maite, how are you?" },
    { es: "Perdón, señora, ¿tiene hora?", en: "Excuse me, ma'am, do you have the time?" }
  ],
  rule: "Three ways to address someone:\na first name, to friends: *Hola, Maite.*\n*señor* or *señora* with the surname, to strangers and older people: *señor López, señora García*. Never with the first name.\n*buenos días, buenas tardes, buenas noches*: safe with anyone.\nTo introduce someone: *Te presento a Laura* to a friend, *Le presento a Laura* to someone you call *usted*.\nTo answer: *Mucho gusto*, or *encantado* if you are a man, *encantada* if you are a woman. The ending matches you, not them.",
  readAndPick: [
    { q: "How well does the speaker know Mr López?", es: "Buenos días, señor López.",
      options: ["Not well at all", "He's a best friend", "He's her brother"], answer: 0,
      why: "*Señor* plus the surname: polite, for someone you don't know well." },
    { q: "Who says this, a man or a woman?", es: "Encantado.",
      options: ["A man", "A woman", "We can't tell"], answer: 0,
      why: "*Encantado* ends in *-o*: the speaker is a man." },
    { q: "Who is the speaker introducing her sister to?", es: "Le presento a mi hermana, Laura.",
      options: ["Her boss at work", "Her best friend", "A little child"], answer: 0,
      why: "*Le presento*: the *usted* way. *Te presento* would be for a friend." },
    { q: "What time of day is it?", es: "Buenas tardes, ¿está la señora López?",
      options: ["Afternoon", "Morning", "Late night"], answer: 0,
      why: "*Buenas tardes*: good afternoon." }
  ],
  yourTurn: [
    { en: "Greet Mr López in the morning.", es: "Buenos días, señor López.", accept: [] },
    { en: "Introduce your sister Laura. (to a friend)", es: "Te presento a mi hermana, Laura.", accept: [] },
    { en: "You are a woman. Say: Pleased to meet you.", es: "Encantada.", accept: ["Mucho gusto."] },
    { en: "Good afternoon, Mrs García.", es: "Buenas tardes, señora García.", accept: [] }
  ],
  personal: {
    prompt: "Write how you would really greet someone you will see this week: a neighbour, a colleague or a teacher, by name, or with *señor* or *señora* and a surname.",
    constraints: [
      { type: "containsAny", words: ["hola", "buenos días", "buenas tardes", "buenas noches"], label: "a greeting" },
      { type: "regex", pattern: "([Hh]ola|[Dd][ií]as|[Tt]ardes|[Nn]oches),?\\s+(se[ñn]ora?\\s+|don\\s+|doña\\s+)?[A-ZÁÉÍÓÚÑ]", flags: "u", label: "then their name, or *señor* or *señora* and a surname" }
    ],
    model: "Buenos días, señora Ruiz. ¿Cómo está?"
  },
  pitfalls: [
    "*Señor Antonio* is a slip: it is *Antonio*, or *señor López*.",
    "*Buenos días*, but *buenas tardes* and *buenas noches*: the ending matches the word after it.",
    "*Encantado* or *encantada* matches you, the speaker, not the person you meet."
  ]
},

"fn-disculparse-a2": {
  source: "old",
  hook: {
    line: "Everyone bumps into someone, arrives late or interrupts. Saying sorry at the right size, and knowing what to say when someone says it to you, keeps small mistakes small.",
    es: "Perdón, se me hizo tarde.\nTranquila, no te preocupes.",
    en: "Sorry, I lost track of time.\nIt's fine, don't worry."
  },
  examples: [
    { es: "Lo siento mucho.", en: "I'm very sorry." },
    { es: "Siento llegar tarde.", en: "Sorry I'm late." },
    { es: "Ay, perdón.\nNo pasa nada.", en: "Oh, sorry.\nNo problem." }
  ],
  rule: "Sorry comes in sizes:\n*Perdón*: a light sorry, for a bump or to get past.\n*Disculpa*, to a friend, or *disculpe*, to someone you call *usted*: excuse me, sorry.\n*Lo siento*, or *lo siento mucho*: I'm sorry, for something that really hurt or cost someone.\nTo say what you are sorry for, add the dictionary form: *Siento llegar tarde. Siento molestar.*\n*Se me hizo tarde*: I lost track of time, the everyday excuse in Colombia.\nWhen someone says sorry to you:\n*Tranquilo*, or *tranquila* to a woman: it's fine.\n*No te preocupes*: don't worry.\n*No pasa nada*: no problem.",
  readAndPick: [
    { q: "How serious is this apology?", es: "Lo siento mucho.",
      options: ["Very serious", "Very light", "Not sorry at all"], answer: 0,
      why: "*Lo siento mucho* is for something that really matters." },
    { q: "What is the speaker sorry for?", es: "Siento llegar tarde.",
      options: ["Arriving late", "Calling late", "Leaving early"], answer: 0,
      why: "*Llegar tarde*: to arrive late." },
    { q: "Is Ana saying sorry, or letting it go?", es: "Tranquila, no te preocupes.",
      options: ["Letting it go", "Saying she's sorry", "Asking what happened"], answer: 0,
      why: "*No te preocupes*: don't worry. She is letting it go." },
    { q: "Who is the speaker talking to?", es: "Disculpe, señora.",
      options: ["A woman, politely", "A friend, casually", "A group of people"], answer: 0,
      why: "*Disculpe* is the *usted* form, and *señora* is a woman." },
    { q: "Why is Diego late?", es: "Perdón, se me hizo tarde.",
      options: ["He lost track of the time", "The bus was very late", "He was feeling sick"], answer: 0,
      why: "*Se me hizo tarde*: time got away from me." }
  ],
  yourTurn: [
    { en: "Sorry I'm late.", es: "Siento llegar tarde.", accept: ["[Perdón|Disculpa|Disculpe] por llegar tarde."] },
    { en: "I'm very sorry.", es: "Lo siento mucho.", accept: [] },
    { en: "A friend says sorry to you. Say: Don't worry. (to a friend)", es: "No te preocupes.", accept: ["Tranquil[o|a], no te preocupes."] },
    { en: "Excuse me, ma'am.", es: "Disculpe, señora.", accept: ["Perdón, señora."] }
  ],
  personal: {
    prompt: "Think of the last time you were late or bumped into someone. Write what you would say in Spanish.",
    constraints: [
      { type: "containsAny", words: ["perdón", "disculp", "lo siento", "siento"], label: "a sorry: *perdón*, *disculpa* or *lo siento*" },
      { type: "minWords", n: 2, label: "at least two words" }
    ],
    model: "Perdón, se me hizo tarde. Lo siento mucho."
  },
  pitfalls: [
    "A quick *perdón* for something serious sounds careless: match the size.",
    "*Lo siento* is for real regret; to get past someone, *perdón* or *con permiso* is enough."
  ]
},

"fn-acuerdo-a1": {
  source: "old",
  hook: {
    line: "Nodding works face to face, but agreeing out loud is how a conversation keeps going. And when you disagree, Spanish expects you to say what you do think, not just no.",
    es: "Este parque es muy bonito.\nSí, muy bonito.",
    en: "This park is really pretty.\nYes, really pretty."
  },
  examples: [
    { es: "El libro es aburrido.\nNo, es muy interesante.", en: "The book is boring.\nNo, it's very interesting." },
    { es: "Esta ciudad no es interesante.\nSí, sí es interesante.", en: "This city isn't interesting.\nYes, it is." }
  ],
  rule: "To agree, repeat the key word: *Es muy bonito. Sí, muy bonito.*\nTo agree with a no, repeat the no: *No es difícil. No, no es difícil.*\nTo disagree, say no and then what you think: *Es caro. No, es barato.*\nTo disagree with a no, say *sí*, often twice: *No es interesante. Sí, sí es interesante.*\nA bare *no* or *sí* tells them you disagree but not what you think, so add the opposite.\n*Creo que* softens it: *Creo que es fácil*, I think it's easy.",
  readAndPick: [
    { q: "Does Diego agree with Ana?", es: "Ana: La comida es cara.\nDiego: No, es barata.",
      options: ["He doesn't", "He does", "He can't say"], answer: 0,
      why: "*No*, then the opposite: *barata*, cheap." },
    { q: "What does Laura think of the city?", es: "Diego: Esta ciudad no es interesante.\nLaura: Sí, sí es interesante.",
      options: ["It is interesting", "It isn't interesting", "It is too big"], answer: 0,
      why: "*Sí, sí es*: she disagrees with his no." },
    { q: "Does the second person agree?", es: "No es difícil.\nNo, no es difícil.",
      options: ["Yes, they agree", "No, they think it's hard", "They aren't sure"], answer: 0,
      why: "Repeating the *no* agrees with it." },
    { q: "How does the speaker put it?", es: "Creo que el examen es fácil.",
      options: ["As her own opinion", "As a hard fact", "As a question"], answer: 0,
      why: "*Creo que*: I think. It is a view, not a fact." },
    { q: "What does the second person think of the film?", es: "La película es aburrida.\nNo, es muy buena.",
      options: ["It's really good", "It's a bit boring", "It's far too long"], answer: 0,
      why: "*No*, then the opposite: *muy buena*." }
  ],
  yourTurn: [
    { en: "Agree: Yes, very pretty.", es: "Sí, muy bonito.", accept: [] },
    { en: "Disagree: No, it's cheap.", es: "No, es barato.", accept: [] },
    { en: "Disagree with a no: Yes, it is interesting.", es: "Sí, sí es interesante.", accept: ["Sí, es interesante."] },
    { en: "I think it's easy.", es: "Creo que es fácil.", accept: [] }
  ],
  personal: {
    prompt: "Think of a place or a film you have an opinion on. Write it with *creo que*, the way you would say it to a friend.",
    constraints: [
      { type: "containsWord", word: "creo que", label: "*creo que*" },
      { type: "infinitiveUsed", inf: "ser", label: "*es*, for what it is like" }
    ],
    model: "Creo que Bogotá es muy bonita."
  },
  pitfalls: [
    "A bare *no* sounds like a door closing: add what you do think.",
    "To disagree with a no, the answer is *sí*: *No es caro. Sí, sí es caro.*"
  ]
},

"gr-adverbios-afirmacion-negacion-a1": {
  source: "merged",
  hook: {
    line: "Half of friendly conversation is me too and me neither. Get them right and people feel you are on their side.",
    es: "No trabajo los lunes.\n¡Yo tampoco!",
    en: "I don't work on Mondays.\nMe neither!"
  },
  examples: [
    { es: "Estudio español.\nYo también.", en: "I'm learning Spanish.\nMe too." },
    { es: "No como carne.\nYo tampoco.", en: "I don't eat meat.\nMe neither." },
    { es: "No tengo carro.\nYo sí.", en: "I don't have a car.\nI do." }
  ],
  rule: "Look at the first sentence: is it a yes sentence or a no sentence?\nA yes sentence, *Tengo hambre*: agree with *también*. *Yo también*, me too.\nA no sentence, *No tengo hambre*: agree with *tampoco*. *Yo tampoco*, me neither.\nTo disagree, flip it: *No tengo carro. Yo sí.* *Tengo hambre. Yo no.*\n*Yo* can be anyone: *Laura también, mi hermano tampoco*.\nAfter *me gusta*, use *a mí*: *Me gusta el café. A mí también.* *No me gusta el frío. A mí tampoco.*",
  readAndPick: [
    { q: "Does the second person work on Mondays?", es: "No trabajo los lunes.\nYo tampoco.",
      options: ["No, they don't", "Yes, they do", "Only sometimes"], answer: 0,
      why: "*Tampoco* agrees with a no." },
    { q: "Does the second person have a car?", es: "No tengo carro.\nYo sí.",
      options: ["Yes, they have one", "No, they don't", "They want one"], answer: 0,
      why: "*Yo sí* flips the no: I do." },
    { q: "Is the second person hungry?", es: "Tengo hambre.\nYo no.",
      options: ["No, they aren't", "Yes, very hungry", "They are thirsty"], answer: 0,
      why: "*Yo no* disagrees with a yes." },
    { q: "Who else likes coffee?", es: "Me gusta el café.\nA mí también.",
      options: ["The second person", "Nobody else here", "Only the first one"], answer: 0,
      why: "*A mí también*: me too, after *me gusta*." },
    { q: "Does Laura speak English?", es: "No hablo inglés.\nLaura tampoco.",
      options: ["No, she doesn't", "Yes, she does", "She is learning"], answer: 0,
      why: "*Laura tampoco*: Laura doesn't either." }
  ],
  yourTurn: [
    { en: "Your friend says Tengo hambre. Say: Me too.", es: "Yo también.", accept: [] },
    { en: "Your friend says No como carne. Say: Me neither.", es: "Yo tampoco.", accept: [] },
    { en: "Your friend says No tengo carro. Say that you do.", es: "Yo sí.", accept: [] },
    { en: "Your friend says No me gusta el frío. Say: Me neither.", es: "A mí tampoco.", accept: [] },
    { en: "I'm learning Spanish too.", es: "Yo también estudio español.", accept: ["También estudio español.", "Yo estudio español también."] }
  ],
  personal: {
    prompt: "Write one true thing you don't do, then answer yourself the way a friend would: *yo también*, *yo tampoco*, *yo sí* or *yo no*.",
    constraints: [
      { type: "negation", label: "a no sentence, with *no*" },
      { type: "regex", pattern: "(también|tambien|tampoco|yo s[ií]\\b|yo no\\b)", label: "the answer: *también*, *tampoco*, *yo sí* or *yo no*" }
    ],
    model: "No tomo café en la noche. Yo tampoco."
  },
  pitfalls: [
    "*Yo no también* is not Spanish: with a no sentence the word is *tampoco*.",
    "*Yo también* after a no sentence says the opposite of what you meant.",
    "With *me gusta* it is *a mí*, not *yo*: *A mí también.*"
  ]
},

"task-cortesia": {
  source: "old",
  hook: {
    line: "One small request, three people: a friend, a stranger in the street, someone behind a desk. The request stays the same; who you are talking to changes the ending, the greeting and the please.",
    es: "Oye, ¿tienes hora?\nDisculpe, ¿tiene hora, por favor?",
    en: "Hey, have you got the time?\nExcuse me, do you have the time, please?"
  },
  examples: [
    { es: "Buenos días. Disculpe, ¿me puede decir la hora, por favor?", en: "Good morning. Excuse me, could you tell me the time, please?" },
    { es: "Muchas gracias. Muy amable.\nCon mucho gusto.", en: "Thank you very much. That's very kind.\nMy pleasure." }
  ],
  rule: "Change three things, keep the request:\nA friend: *oye*, then *tú*: *¿Tienes hora?*\nA stranger: *disculpe*, then *usted*: *¿Tiene hora, por favor?*\nSomeone at a desk: a greeting, *disculpe*, *usted* and *por favor*: *Buenos días. Disculpe, ¿me puede decir la hora, por favor?*\nThank all three, and answer their thanks: *Gracias. De nada. Con mucho gusto.*\nThe ending is the part people notice first: *tienes* is for a friend, *tiene* for anyone you call *usted*.",
  readAndPick: [
    { q: "Who is this for?", es: "Oye, ¿tienes hora?",
      options: ["A friend", "A stranger", "A clerk at a desk"], answer: 0,
      why: "*Oye* and *tienes*: a friend." },
    { q: "Who is this for?", es: "Disculpe, ¿tiene hora?",
      options: ["A stranger", "A friend", "Two friends"], answer: 0,
      why: "*Disculpe* and *tiene*: *usted*, for a stranger." },
    { q: "What is the person at the desk asked for?", es: "¿Me puede decir la hora, por favor?",
      options: ["The time now", "Directions", "A phone number"], answer: 0,
      why: "*La hora*: the time." },
    { q: "Who are they asking?", es: "¿Ustedes tienen hora?",
      options: ["A group of them", "Just one friend", "A stranger"], answer: 0,
      why: "*Ustedes* and *tienen*: more than one person." }
  ],
  yourTurn: [
    { en: "Ask a friend: Hey, have you got the time? (to a friend)", es: "Oye, ¿tienes hora?", accept: ["¿Tienes hora?"] },
    { en: "Ask a stranger: Excuse me, do you have the time, please? (polite)", es: "Disculpe, ¿tiene hora, por favor?", accept: ["[Disculpe|Perdón|Perdone], ¿tiene hora(, por favor)?"] },
    { en: "Thank you very much, that's very kind.", es: "Muchas gracias, muy amable.", accept: [] },
    { en: "Someone thanks you. Say: My pleasure.", es: "Con mucho gusto.", accept: [] }
  ],
  personal: {
    prompt: "Write one real request you might make this week to someone you call *usted*, with *disculpe* and *por favor*.",
    constraints: [
      { type: "containsAny", words: ["disculpe", "perdón", "perdone"], label: "open with *disculpe* or *perdón*" },
      { type: "containsWord", word: "por favor", label: "*por favor*" },
      { type: "question", label: "as a question, with *¿* and *?*" }
    ],
    model: "Disculpe, ¿tiene un lapicero, por favor?"
  },
  pitfalls: [
    "*¿Tienes hora?* to an official is not wrong, but it sounds too familiar: *¿tiene hora?*",
    "With a stranger, *por favor* does real work: leave it out and the request sounds like an order."
  ]
},

/* ---- unit 4 · Numbers, time and money ---------------------------------- */

"nt-cantidad-numerica-a1": {
  source: "merged",
  hook: {
    line: "How many people at the party, how many of you at home, how much rice is left: most counting needs no exact number at all. *Mucho*, *poco* and *más o menos* do half the work.",
    es: "¿Cuánta gente hay en la fiesta?\nMás o menos treinta. ¡Mucha gente!",
    en: "How many people are at the party?\nAbout thirty. Lots of people!"
  },
  examples: [
    { es: "Somos cinco en mi familia.", en: "There are five of us in my family." },
    { es: "Mi ciudad tiene 150.000 habitantes.", en: "My city has 150,000 inhabitants." },
    { es: "Vivo en el cuarto piso.", en: "I live on the fourth floor." }
  ],
  rule: "To count, the number goes before the thing: *dos hermanos, cinco pesos*.\nFor how many of you there are, *somos*: *Somos cinco*, there are five of us.\nBig numbers take a dot where English has a comma: *150.000*.\nFor which one in a row: *primero, segundo, tercero, cuarto, quinto*. *Cuatro pisos* is four floors; *el cuarto piso* is the fourth one.\nWith no number at all:\n*mucho*: a lot of. *poco*: not much. *bastante*: quite a lot.\n*más*: more. *menos*: less. *más o menos*: roughly.\nThese match the thing: *mucho dinero, mucha gente, muchos libros*.\n*Gente* is one word for the whole crowd: *la gente es amable*.",
  readAndPick: [
    { q: "How many people live in Laura's house, counting her?", es: "Somos cuatro en casa.",
      options: ["Four, with her", "Four, plus Laura", "Forty"], answer: 0,
      why: "*Somos cuatro*: we are four, so Laura is one of them." },
    { q: "What does Diego tell you about his building?", es: "Mi edificio tiene cuatro pisos.",
      options: ["It has four floors", "He's on the fourth floor", "It's on Fourth Street"], answer: 0,
      why: "*Cuatro pisos* counts the floors. The fourth floor would be *el cuarto piso*." },
    { q: "How much is lunch?", es: "El almuerzo cuesta 15.000 pesos.",
      options: ["Fifteen thousand pesos", "Fifteen pesos", "A hundred and fifty pesos"], answer: 0,
      why: "The dot marks thousands, where English uses a comma: *15.000* is 15,000." },
    { q: "How busy is the café today?", es: "Hoy hay poca gente en el café.",
      options: ["Quiet", "Packed with people", "Closed for the day"], answer: 0,
      why: "*Poca gente*: not many people." },
    { q: "Is Ana giving an exact number?", es: "Tengo más o menos veinte estudiantes.",
      options: ["No, it's about twenty", "Yes, exactly twenty", "No, over twenty"], answer: 0,
      why: "*Más o menos* turns a number into a guess: roughly twenty." },
    { q: "What does Sam want?", es: "Un poco más de arroz, por favor.",
      options: ["A bit more rice", "A bit less rice", "No more rice, thanks"], answer: 0,
      why: "*Más* is more; *un poco más*, a little more." }
  ],
  yourTurn: [
    { en: "There are five of us in my family.", es: "Somos cinco en mi familia.", accept: ["En mi familia somos cinco."] },
    { en: "I live on the fourth floor.", es: "Vivo en el cuarto piso.", accept: [] },
    { en: "There are a lot of people in the street.", es: "Hay mucha gente en la calle.", accept: ["En la calle hay mucha gente."] },
    { en: "The town has roughly a thousand inhabitants.", es: "El pueblo tiene más o menos mil habitantes.", accept: [] },
    { en: "A little more bread, please.", es: "Un poco más de pan, por favor.", accept: [] }
  ],
  personal: {
    prompt: "How many of you are there in your family, and roughly how many people live in your town or city? Use *somos* and *más o menos*.",
    constraints: [
      { type: "regex", pattern: "\\bsomos\\b", label: "how many of you, with *somos*" },
      { type: "containsWord", word: "más o menos", label: "a rough number, with *más o menos*" }
    ],
    model: "En mi familia somos cuatro. Mi ciudad tiene más o menos 300.000 habitantes."
  },
  pitfalls: [
    "*Mucho gente* is a slip: *gente* is a *la* word and counts as one, so *mucha gente*, *la gente es*.",
    "*El cuatro piso* counts four floors. The fourth one is *el cuarto piso*.",
    "*Somos cinco* is complete: never *somos cinco de nosotros*."
  ]
},

"gr-numerales-a1": {
  source: "merged",
  hook: {
    line: "Twenty-one years, thirty-one people, the first day, the third floor. The numbers that trip English speakers up are the ones with a *one* in them, and first and third.",
    es: "Tengo veintiún años y vivo en el tercer piso.",
    en: "I'm twenty-one and I live on the third floor."
  },
  examples: [
    { es: "Hay treinta y una personas en la clase.", en: "There are thirty-one people in the class." },
    { es: "Es mi primer día, y la primera vez que estoy en Bogotá.", en: "It's my first day, and the first time I've been in Bogotá." },
    { es: "Son ciento veinte mil pesos.", en: "That's a hundred and twenty thousand pesos." }
  ],
  rule: "Most numbers never change: *dos hermanos, dos hermanas*.\n*Uno* does, even at the end of a bigger number:\n*un libro, una casa*\n*veintiún años, treinta y una personas*\nCounting on its own, it stays *uno*: *¿Cuántos? Veintiuno.*\nA hundred on the dot is *cien*: *cien pesos, cien mil*. With more after it, *ciento*: *ciento veinte*. A thousand is just *mil*.\nOrder words match the thing: *la segunda vez, los primeros días*.\n*Primero* and *tercero* drop the *o* right before an *el* word: *el primer día, el tercer piso*. With a *la* word they keep it: *la primera vez*.",
  readAndPick: [
    { q: "How old is Diego?", es: "Tengo veintiún años.",
      options: ["Twenty-one", "Twenty", "Thirty-one"], answer: 0,
      why: "*Veintiún*: twenty-one, with *uno* shortened before *años*." },
    { q: "How much is the jacket?", es: "Son ciento diez mil pesos.",
      options: ["110,000 pesos", "100,000 pesos", "10,000 pesos"], answer: 0,
      why: "*Ciento diez*: a hundred and ten. A hundred on the dot would be *cien*." },
    { q: "Has Laura been to Medellín before?", es: "Es la segunda vez que vengo a Medellín.",
      options: ["Yes, once before", "No, never before", "Yes, many times"], answer: 0,
      why: "*La segunda vez*: the second time, so this is her second visit." },
    { q: "How far into the course are they?", es: "Hoy es el tercer día del curso.",
      options: ["Day three", "Day four", "Week three"], answer: 0,
      why: "*Tercer*: third. *Tercero* loses its *o* before *día*." },
    { q: "Laura lives on the primer piso in Bogotá. How many stairs does she climb?", es: "Vivo en el primer piso.",
      options: ["None, it's street level", "One flight of stairs", "Two flights up"], answer: 0,
      why: "In Colombia the *primer piso* is street level; the *segundo piso* is one flight up." }
  ],
  yourTurn: [
    { en: "I'm twenty-one.", es: "Tengo veintiún años.", accept: [] },
    { en: "There are thirty-one people in the class.", es: "Hay treinta y una personas en la clase.", accept: [] },
    { en: "It's my first day.", es: "Es mi primer día.", accept: [] },
    { en: "It's the third time.", es: "Es la tercera vez.", accept: [] },
    { en: "It costs a hundred thousand pesos.", es: "Cuesta cien mil pesos.", accept: [] }
  ],
  personal: {
    prompt: "Write one true line about a first: the first time you did something, your first day somewhere, or a first floor. Use *primer* or *primera*.",
    constraints: [
      { type: "regex", pattern: "\\b(primer|primera|primeros|primeras)\\b", label: "*primer* or *primera*, matched to the thing" },
      { type: "minWords", n: 4, label: "at least four words" }
    ],
    model: "Es la primera vez que estudio español."
  },
  pitfalls: [
    "*Veintiuno años* is a slip: before the thing, *uno* shortens, so *veintiún años*.",
    "*La primer vez* is a slip: only an *el* word shortens it, so *la primera vez*.",
    "*Un mil* and *ciento pesos* are slips: a thousand is *mil*, and a hundred on the dot is *cien*."
  ]
},

"gr-ir-a-infinitivo-a1": {
  source: "old",
  hook: {
    line: "Friday afternoon, and everyone asks about the weekend. The answer needs one verb you already know, *ir*, plus a small *a* and whatever you plan to do.",
    es: "Laura: ¿Qué vas a hacer el fin de semana?\nSam: Voy a descansar. Y esta noche voy a ver una película.",
    en: "Laura: What are you going to do at the weekend?\nSam: I'm going to rest. And tonight I'm going to watch a film."
  },
  examples: [
    { es: "Esta noche vamos a cocinar en casa.", en: "Tonight we're going to cook at home." },
    { es: "Mañana Laura no va a trabajar.", en: "Laura isn't going to work tomorrow." },
    { es: "¡Uy, va a llover!", en: "Oh no, it's going to rain!" }
  ],
  rule: "A plan is *ir*, then *a*, then the verb as the dictionary gives it:\n*voy a comer*: I'm going to eat\n*vas a comer*: you're going to eat\n*va a comer*: he, she or *usted* is going to eat\n*vamos a comer*: we're going to eat\n*van a comer*: they or *ustedes* are going to eat\nOnly *ir* changes. The verb after *a* keeps its *-ar*, *-er* or *-ir*.\nThe *a* always stays: never *voy comer*.\nFor not, *no* goes first: *No voy a salir.*\nTo ask: *¿Qué vas a hacer?*\nWhen: *mañana, esta noche, más tarde, el fin de semana*.\n*Vamos a comer* can also mean let's eat.",
  readAndPick: [
    { q: "Laura tells you about tonight. Who is going to cook?", es: "Esta noche mis papás van a cocinar.",
      options: ["Laura's parents", "Laura herself", "Laura and her parents"], answer: 0,
      why: "*Van*: they, here *mis papás*. Laura isn't cooking." },
    { q: "Diego texts you this. When is he going to call?", es: "Voy a llamar más tarde.",
      options: ["Later on today", "Right this minute", "Tomorrow"], answer: 0,
      why: "*Más tarde*: later. The call is still to come." },
    { q: "Sam says this. Who is watching a film tonight?", es: "Esta noche vamos a ver una película.",
      options: ["Sam and others", "Only Sam", "Everyone but Sam"], answer: 0,
      why: "*Vamos*: we, so Sam is in it too." },
    { q: "When is the trip?", es: "Mis amigos van a viajar el fin de semana.",
      options: ["This coming weekend", "Last weekend", "Every single weekend"], answer: 0,
      why: "*Van a viajar* is a plan, so the weekend is still to come." },
    { q: "Ana says this. Is she going to work tomorrow?", es: "Mañana no voy a trabajar.",
      options: ["No, she isn't", "Yes, all day", "Yes, but later on"], answer: 0,
      why: "*No* before *voy*: she is not going to work." },
    { q: "What is about to happen?", es: "¡Uy, va a llover!",
      options: ["It's about to rain", "It rained earlier", "It's raining hard now"], answer: 0,
      why: "*Va a* with no time word: any minute now." }
  ],
  yourTurn: [
    { en: "I'm going to rest.", es: "Voy a descansar.", accept: [] },
    { en: "What are you going to do at the weekend? (to a friend)", es: "¿Qué vas a hacer el fin de semana?", accept: ["¿Qué vas a hacer este fin de semana?"] },
    { en: "Tonight we're going to cook at home.", es: "Esta noche vamos a cocinar en casa.", accept: ["Vamos a cocinar en casa esta noche."] },
    { en: "They're going to travel tomorrow.", es: "Mañana van a viajar.", accept: ["Van a viajar mañana."] },
    { en: "I'm not going to work tomorrow.", es: "Mañana no voy a trabajar.", accept: ["No voy a trabajar mañana."] }
  ],
  personal: {
    prompt: "What are you really going to do tonight or this weekend? Write one or two true lines with *voy a* or *vamos a*, and say when.",
    constraints: [
      { type: "containsAny", words: ["voy a", "vamos a"], label: "your plan, with *voy a* or *vamos a*" },
      { type: "regex", pattern: "\\b(voy|vamos) a\\s+[a-záéíóúñ]*(ar|er|ir)(me|te|se|nos|lo|la|los|las|le|les)?\\b", label: "the verb after *a*, as the dictionary gives it: *voy a descansar*" },
      { type: "containsAny", words: ["mañana", "esta noche", "más tarde", "fin de semana", "hoy"], label: "when: *esta noche*, *mañana*, *el fin de semana*" }
    ],
    model: "Esta noche voy a cocinar en casa, y el fin de semana vamos a ir a la playa."
  },
  pitfalls: [
    "*Voy comer* drops the little word. Spanish keeps its *a* the way English keeps the to of going to: *voy a comer*.",
    "*Vamos a ir* is not one go too many: it is how you say a plan to go somewhere. *Mañana vamos a ir al centro.*",
    "Spanish also has a one-word future, but you will not need it for a long while. For plans, *voy a* plus a verb is what people say every day in Latin America."
  ]
},

"nt-referencias-generales-a1": {
  source: "merged",
  hook: {
    line: "Arranging anything, a class, a dinner, a call home, needs the hour, the day and how often. Spanish says each a little differently from English.",
    es: "¿Qué hora es?\nSon las ocho y media.\n¡Uy! Los lunes la clase es a las ocho.",
    en: "What time is it?\nIt's half past eight.\nOh no! On Mondays the class is at eight."
  },
  examples: [
    { es: "El sábado en la mañana voy al mercado.", en: "On Saturday morning I'm going to the market." },
    { es: "Normalmente almuerzo a la una.", en: "I usually have lunch at one." },
    { es: "Mi hermano nunca desayuna.", en: "My brother never has breakfast." }
  ],
  rule: "One o'clock takes *es*, every other hour *son*:\n*Es la una. Son las dos. Son las tres y media.*\nPast the hour, *y*: *y cuarto, y media, y diez*. To the hour, *menos*: *las diez menos veinte* is 9:40. In Colombia you also hear *veinte para las diez*.\nWhen something happens: *a las ocho, a la una*. To ask: *¿A qué hora…?*\nDays need no word for on: *el lunes* is this Monday, *los lunes* every Monday.\nIn the morning: *en la mañana*, or *por la mañana*.\nHow often: *siempre, normalmente, a veces, nunca*, before the verb: *Nunca como carne.* After the verb, *nunca* needs *no* in front: *No como carne nunca.*",
  readAndPick: [
    { q: "What time is it?", es: "Son las diez menos veinte.",
      options: ["Twenty to ten", "Twenty past ten", "Ten twenty"], answer: 0,
      why: "*Menos* counts down to the hour: 9:40." },
    { q: "When does Laura do yoga?", es: "Los martes tengo yoga.",
      options: ["Every Tuesday", "This Tuesday only", "On Tuesday morning"], answer: 0,
      why: "*Los martes*: every Tuesday. Just this one would be *el martes*." },
    { q: "And when does Diego see the doctor?", es: "El martes tengo cita con el médico.",
      options: ["This coming Tuesday", "Every Tuesday", "Tuesday afternoons"], answer: 0,
      why: "*El martes*: one Tuesday, the next one." },
    { q: "How often does Ana eat meat?", es: "No como carne nunca.",
      options: ["Never", "Sometimes", "Every day"], answer: 0,
      why: "*No… nunca* is still never: after the verb, Spanish doubles the no." },
    { q: "When does the bank open?", es: "El banco abre a la una y media.",
      options: ["At half past one", "At one o'clock", "At half past twelve"], answer: 0,
      why: "*A la una y media*: at 1:30." }
  ],
  yourTurn: [
    { en: "It's one o'clock.", es: "Es la una.", accept: [] },
    { en: "It's half past four.", es: "Son las cuatro y media.", accept: [] },
    { en: "What time is the class?", es: "¿A qué hora es la clase?", accept: [] },
    { en: "I don't work on Saturdays.", es: "No trabajo los sábados.", accept: ["Los sábados no trabajo."] },
    { en: "I never eat fish.", es: "Nunca como pescado.", accept: ["No como pescado nunca.", "No como nunca pescado."] }
  ],
  personal: {
    prompt: "Write one true line about your week: something you do on the same day every week, and at what time.",
    constraints: [
      { type: "regex", pattern: "\\blos (lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bados|domingos)\\b", label: "a day every week: *los lunes*, *los sábados*…" },
      { type: "regex", pattern: "\\ba (la una|las)\\b", label: "a time, with *a las* or *a la una*" }
    ],
    model: "Los sábados juego fútbol a las diez."
  },
  pitfalls: [
    "*Son la una* is a slip: one o'clock is *es la una*; from two on, *son las*.",
    "*En el lunes* is a slip: the day needs no word for on, *el lunes*.",
    "*Las diez menos veinte* is 9:40, not 10:20: *menos* counts down to the hour."
  ]
},

"nt-valor-precio-a1": {
  source: "merged",
  hook: {
    line: "At a market stall the first thing you ask is the price, and the second is whether it's worth it. Spanish splits the money question between two verbs: things cost, people pay.",
    es: "¿Cuánto cuestan los aguacates?\nCuestan tres mil pesos.\n¡Qué caros!",
    en: "How much are the avocados?\nThey're three thousand pesos.\nSo expensive!"
  },
  examples: [
    { es: "Este libro cuesta cuarenta mil pesos.", en: "This book costs forty thousand pesos." },
    { es: "Pago con tarjeta, por favor.", en: "I'll pay by card, please." },
    { es: "Mi hermano es muy alto: mide un metro noventa.", en: "My brother is very tall: he's one metre ninety." }
  ],
  rule: "To ask a price, ask what it costs:\n*¿Cuánto cuesta?* for one thing, *¿Cuánto cuestan?* for more than one. Or simply *¿Cuánto es?*\nThe thing does the costing: *El mango cuesta mil pesos. Los mangos cuestan cinco mil.*\nThe person does the paying: *Pago con tarjeta. ¿Cuánto pagas de arriendo?*\nTo judge the price: *caro*, expensive, and *barato*, cheap, matched to the thing: *Las fresas están baratas hoy.*\nSize comes in pairs: *grande, pequeño*; *largo, corto*; *alto, bajo*.\nFor an exact size, *medir*: *Mido un metro setenta. La mesa mide dos metros.*",
  readAndPick: [
    { q: "How many things is Laura asking about?", es: "¿Cuánto cuestan?",
      options: ["More than one", "Just one", "None, it's free"], answer: 0,
      why: "*Cuestan*, with *-n*: more than one thing." },
    { q: "What does the speaker tell the cashier?", es: "Pago con tarjeta.",
      options: ["How she will pay", "What it costs", "That it's cheap"], answer: 0,
      why: "*Pagar* is what the person does: *pago*, I pay." },
    { q: "What does the seller say about the strawberries?", es: "Las fresas están baratas hoy.",
      options: ["They're cheap today", "They're dear today", "They're fresh today"], answer: 0,
      why: "*Baratas*: cheap. Expensive is *caras*." },
    { q: "What does Ana tell you about her brother?", es: "Mi hermano mide un metro sesenta.",
      options: ["How tall he is", "How much he weighs", "How old he is"], answer: 0,
      why: "*Medir* is to measure, so *mide* gives his height." },
    { q: "What's the problem with the shelf?", es: "El estante está muy alto.",
      options: ["It's too high to reach", "It's very expensive", "It's far too big"], answer: 0,
      why: "*Alto* is tall for a person and high up for a thing." }
  ],
  yourTurn: [
    { en: "How much does it cost?", es: "¿Cuánto cuesta?", accept: ["¿Cuánto vale?"] },
    { en: "How much are the mangoes?", es: "¿Cuánto cuestan los mangos?", accept: ["¿Cuánto valen los mangos?"] },
    { en: "The mangoes are cheap today.", es: "Los mangos están baratos hoy.", accept: ["Hoy los mangos están baratos."] },
    { en: "I'm paying by card.", es: "Pago con tarjeta.", accept: [] },
    { en: "The table is two metres long.", es: "La mesa mide dos metros.", accept: [] }
  ],
  personal: {
    prompt: "Think of something you bought this week. Write what it costs, and whether it is cheap or expensive.",
    constraints: [
      { type: "containsAny", words: ["cuesta", "cuestan", "vale", "valen"], label: "the price, with *cuesta* or *cuestan*" },
      { type: "containsAny", words: ["caro", "cara", "barato", "barata"], label: "your verdict: *caro* or *barato*" }
    ],
    model: "Un tinto cuesta dos mil pesos. Es barato."
  },
  pitfalls: [
    "*¿Cuánto pagas los mangos?* does not ask a price: the thing costs, *¿Cuánto cuestan los mangos?*",
    "*Los mangos cuesta* is a slip: more than one thing, *cuestan*.",
    "*Soy un metro setenta* is a slip: a height is measured, *mido un metro setenta*."
  ]
},

"task-quedar": {
  source: "old",
  hook: {
    line: "Numbers, hours and days only matter when they're doing a job. Here they set up a coffee, and the first day doesn't work, which is how real plans go.",
    es: "Laura: ¿Nos vemos el jueves?\nSam: El jueves no puedo. ¿El viernes?\nLaura: Listo. ¿A qué hora?",
    en: "Laura: Shall we meet on Thursday?\nSam: I can't on Thursday. Friday?\nLaura: OK. What time?"
  },
  examples: [
    { es: "Sam: A las siete, en el café de la esquina.\nLaura: Perfecto. Nos vemos el viernes.", en: "Sam: At seven, at the café on the corner.\nLaura: Perfect. See you on Friday." },
    { es: "¿Te parece a las ocho?\nDale, a las ocho.", en: "Does eight work for you?\nSure, at eight." }
  ],
  rule: "A plan to meet settles three things: the day, the time and the place.\nSuggest: *¿Nos vemos el viernes? ¿Te parece a las siete?*\nAsk: *¿A qué hora? ¿Dónde?*\nSay no, and offer another: *El jueves no puedo. ¿El viernes?*\nAgree: *Listo. Dale. Perfecto.*\nClose with all three: *Nos vemos el viernes a las siete en el café.*\nThe day takes *el*, with no word for on: *el viernes*. The time takes *a las*: *a las siete, a la una*.\nYou may also hear *¿Quedamos?*, shall we meet up, mostly from Spain.",
  readAndPick: [
    { q: "Can Sam meet on Thursday?", es: "El jueves no puedo. ¿El viernes?",
      options: ["No, so he offers Friday", "Yes, and on Friday too", "Only on Thursday"], answer: 0,
      why: "*No puedo*: I can't. *¿El viernes?* offers another day." },
    { q: "What does Laura still need to know?", es: "Listo, el viernes. ¿A qué hora?",
      options: ["The time", "The day", "The place"], answer: 0,
      why: "*¿A qué hora?*: at what time. The day is settled." },
    { q: "Is the plan settled now?", es: "Dale. Nos vemos el viernes a las siete en el café.",
      options: ["Yes, all of it", "Only the day", "Not yet"], answer: 0,
      why: "Day, time and place: *el viernes*, *a las siete*, *en el café*." },
    { q: "When does Diego suggest?", es: "¿Te parece el sábado a la una?",
      options: ["Saturday at one", "Every Saturday", "Saturday at noon"], answer: 0,
      why: "*El sábado*: this Saturday. *A la una*: at one." },
    { q: "What does Ana want to know?", es: "¿Dónde nos vemos?",
      options: ["Where to meet", "When to meet", "Who is coming"], answer: 0,
      why: "*Dónde*: where." }
  ],
  yourTurn: [
    { en: "Shall we meet on Friday?", es: "¿Nos vemos el viernes?", accept: ["¿Quedamos el viernes?"] },
    { en: "I can't on Thursday.", es: "El jueves no puedo.", accept: ["No puedo el jueves."] },
    { en: "What time?", es: "¿A qué hora?", accept: [] },
    { en: "See you on Friday at seven.", es: "Nos vemos el viernes a las siete.", accept: [] },
    { en: "At half past seven.", es: "A las siete y media.", accept: [] }
  ],
  personal: {
    prompt: "Write the message you would really send a friend to meet this week: the day, the time and the place.",
    constraints: [
      { type: "regex", pattern: "\\bel (lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\\b", label: "the day, with *el*: *el viernes*" },
      { type: "regex", pattern: "\\ba (la una|las)\\b", label: "the time, with *a las*" },
      { type: "regex", pattern: "\\ben (el|la|mi|tu|casa)\\b", label: "the place, with *en*" }
    ],
    model: "¿Nos vemos el sábado a las once en el parque?"
  },
  pitfalls: [
    "*En el viernes* is a slip: the day takes only *el*, *el viernes*.",
    "*En las siete* is a slip: a time is *a las siete*.",
    "A plan that leaves one of the three out gets one more message: *¿Y dónde?*"
  ]
},

/* ---- unit 5 · Say what you like ---------------------------------------- */

"gr-verbos-predicativos-tipos-a2": {
  source: "merged",
  hook: {
    line: "English starts with I: I like, I love, my feet hurt. Spanish starts with the thing, and the thing decides the verb. Three verbs, one shape.",
    es: "¿Te gusta Bogotá?\nMe encanta. Pero me duelen los pies.",
    en: "Do you like Bogotá?\nI love it. But my feet hurt."
  },
  examples: [
    { es: "Me gusta el tinto, pero no me gustan los postres.", en: "I like black coffee, but I don't like desserts." },
    { es: "Me encanta caminar por el centro.", en: "I love walking around downtown." },
    { es: "Me duele la cabeza.", en: "My head hurts." }
  ],
  rule: "*Gustar* works like please in English: the thing does the pleasing, and *me* says who is pleased.\n*Me gusta el café.* I like coffee: coffee pleases me.\n*Me gustan los libros.* I like books: books please me.\nOne thing, *gusta*; more than one, *gustan*. An activity is always *gusta*: *Me gusta leer.*\n*Encantar*, to love, and *doler*, to hurt, work the same way:\n*Me encanta el chocolate. Me encantan los perros.*\n*Me duele la cabeza. Me duelen los pies.*\nThe body part takes *la* or *los*, not *mi*: *me* already says whose.\nTo ask a friend: *¿Te gusta? ¿Te duele?* For no, *no* goes first: *No me gusta el frío.*",
  readAndPick: [
    { q: "Who is the question about?", es: "¿Te gusta el ajiaco?",
      options: ["You, the listener", "The speaker", "Someone else"], answer: 0,
      why: "*Te*: you. *Me* would be the speaker." },
    { q: "Who loves dogs?", es: "Me encantan los perros.",
      options: ["The speaker", "The dogs", "The listener"], answer: 0,
      why: "*Me*: the speaker loves them. *Encantan* has *-n* because there is more than one dog." },
    { q: "Diego holds something up in a shop and asks you this. What is he holding?", es: "¿Te gustan?",
      options: ["Some shoes", "A shirt", "A hat"], answer: 0,
      why: "*Gustan*, with *-n*: more than one thing, so the shoes." },
    { q: "How does Carlos feel about football?", es: "No me gusta nada el fútbol.",
      options: ["He can't stand it", "He likes it a little", "He loves it"], answer: 0,
      why: "*No me gusta nada*: I don't like it at all." },
    { q: "How strongly does Laura feel?", es: "Me encanta este barrio.",
      options: ["She loves it", "She likes it a bit", "She doesn't mind it"], answer: 0,
      why: "*Encantar* is more than *gustar*: love." }
  ],
  yourTurn: [
    { en: "I like coffee.", es: "Me gusta el café.", accept: [] },
    { en: "I like dogs.", es: "Me gustan los perros.", accept: [] },
    { en: "I love reading.", es: "Me encanta leer.", accept: [] },
    { en: "My feet hurt.", es: "Me duelen los pies.", accept: [] },
    { en: "I don't like the cold.", es: "No me gusta el frío.", accept: [] }
  ],
  personal: {
    prompt: "Write two true things: one you love, and one you don't like.",
    constraints: [
      { type: "containsWord", word: "me encanta", label: "something you love: *me encanta* or *me encantan*" },
      { type: "containsWord", word: "no me gusta", label: "something you don't like: *no me gusta* or *no me gustan*" }
    ],
    model: "Me encanta el café colombiano, pero no me gustan las mañanas frías."
  },
  pitfalls: [
    "*Yo gusto el café* says you are the pleasant one. The coffee does the pleasing: *Me gusta el café.*",
    "*Me gusta los perros* is a slip: more than one thing, *me gustan*.",
    "*Me duele mi cabeza* says whose twice: *me* is already yours, so *me duele la cabeza*."
  ]
},

"fn-preguntar-gustos-a2": {
  source: "merged",
  hook: {
    line: "*¿Qué te gusta hacer?* is the question you will be asked as soon as someone wants to know you, and the one you will want to ask back. Today you ask it, and talk about other people's tastes too.",
    es: "¿Qué te gusta hacer en tu tiempo libre?\nMe gusta leer. Y me encanta el cine.",
    en: "What do you like doing in your free time?\nI like reading. And I love the cinema."
  },
  examples: [
    { es: "A mi hermana le gustan los perros.", en: "My sister likes dogs." },
    { es: "¿Le gusta el ajiaco, señora?", en: "Do you like the ajiaco, ma'am?" },
    { es: "Nos interesa mucho la música colombiana.", en: "We're very interested in Colombian music." }
  ],
  rule: "To ask: *¿Te gusta el cine? ¿Qué te gusta hacer?* To someone you call *usted*: *¿Le gusta?*\nThe small word in front says whose taste it is:\n*me*: me\n*te*: you, a friend\n*le*: him, her, or you politely\n*nos*: us\n*les*: them, or you all\nTo name the person, add *a* and keep the small word: *A Laura le gusta el cine.*\nHow much: *Me gusta mucho. No me gusta nada.*\n*Interesar* works the same way: *Me interesa la historia.* That one is about you. About the thing itself: *La historia es interesante.*",
  readAndPick: [
    { q: "Who likes dogs?", es: "A mi hermana le gustan los perros.",
      options: ["His sister", "The speaker", "The dogs"], answer: 0,
      why: "*A mi hermana le*: the one who likes them is his sister." },
    { q: "Who is the waiter asking?", es: "¿Le gusta el ajiaco, señora?",
      options: ["One customer, politely", "A friend of his", "Two customers"], answer: 0,
      why: "*Le* and *señora*: one person, politely. Two would be *les*." },
    { q: "Who loves the cinema?", es: "Nos encanta el cine.",
      options: ["We do", "They do", "I do"], answer: 0,
      why: "*Nos*: us. The verb follows *el cine*, so it stays *encanta*." },
    { q: "Is this about Carlos or about history?", es: "A Carlos le interesa la historia.",
      options: ["About Carlos", "About how good history is", "About his job"], answer: 0,
      why: "*Le interesa* says what Carlos is curious about. *La historia es interesante* would be about history." },
    { q: "What does Laura want to know?", es: "¿Qué te gusta hacer los fines de semana?",
      options: ["What you like doing at weekends", "If you're free this weekend", "What you did last weekend"], answer: 0,
      why: "*¿Qué te gusta hacer?*: what do you like doing." },
    { q: "Who is the question for?", es: "¿Les gusta Medellín?",
      options: ["A group", "One stranger", "A close friend"], answer: 0,
      why: "*Les*: them, or you all." }
  ],
  yourTurn: [
    { en: "Do you like the cinema? (to a friend)", es: "¿Te gusta el cine?", accept: [] },
    { en: "What do you like doing? (to a friend)", es: "¿Qué te gusta hacer?", accept: [] },
    { en: "My brother likes football.", es: "A mi hermano le gusta el fútbol.", accept: [] },
    { en: "We love dancing.", es: "Nos encanta bailar.", accept: ["A nosotros nos encanta bailar."] },
    { en: "I don't like opera at all.", es: "No me gusta nada la ópera.", accept: ["No me gusta la ópera para nada."] }
  ],
  personal: {
    prompt: "Write about someone close to you: one thing they like, with *a* and their name, and whether you like it too.",
    constraints: [
      { type: "regex", pattern: "\\ba [a-záéíóúñ]+.*\\ble (gusta|gustan|encanta|encantan|interesa|interesan)\\b", label: "their taste: *A Laura le gusta…*" },
      { type: "regex", pattern: "\\b(me|nos) (gusta|gustan|encanta|encantan|interesa|interesan)\\b|\\ba m[ií] (tambi[eé]n|tampoco|no|s[ií])", label: "and yours: *me gusta*, *a mí también*, *a mí no*…" }
    ],
    model: "A mi papá le encanta el fútbol, pero a mí no."
  },
  pitfalls: [
    "*Mi hermano gusta el fútbol* leaves out the small word: *A mi hermano le gusta el fútbol.*",
    "*Les gusta las arepas* is a slip: *les* is about the people, and the verb follows the arepas, *les gustan*.",
    "*Me interesa* is about you; *es interesante* is about the thing. As a reaction on its own: *¡Qué interesante!*"
  ]
},

"nt-evaluacion-general-a1": {
  source: "merged",
  hook: {
    line: "Good comes in two shapes in Spanish: one describes a person or a thing, the other says how something is done. Mix them up and you say something you didn't mean.",
    es: "Mi mamá cocina muy bien.\nEs una buena cocinera.",
    en: "My mum cooks really well.\nShe's a good cook."
  },
  examples: [
    { es: "Es un buen libro, pero el final es malo.", en: "It's a good book, but the ending is bad." },
    { es: "Tiene los ojos verdes y el pelo negro.", en: "She has green eyes and black hair." },
    { es: "Busco una camisa azul claro.", en: "I'm looking for a light blue shirt." }
  ],
  rule: "*Bueno* and *malo* describe a person or a thing, and match it: *un libro bueno, una idea buena*. Right before an *el* word they lose the *o*: *un buen libro, un mal día*.\n*Bien* and *mal* say how someone is, or how something is done, and never change: *Estoy bien. Laura canta muy bien.*\nColours go after the thing and match it: *una camisa roja, los zapatos negros*. *Azul, verde* and *gris* stay the same for a *la* word and only add *-s* or *-es*: *los ojos azules, las camisas verdes*.\nIn Colombia brown is *café*.\n*Claro* and *oscuro* after a colour make it light or dark, and the pair never changes: *dos camisas azul oscuro*.",
  readAndPick: [
    { q: "Is this about the food, or about how Diego cooks?", es: "Diego cocina muy bien.",
      options: ["How he cooks", "The food itself", "How he feels today"], answer: 0,
      why: "*Bien* says how something is done. Good food would be *comida buena*." },
    { q: "Laura points at the shop window. Which thing does she mean?", es: "Son rojos.",
      options: ["The shoes", "The shirt", "The bag"], answer: 0,
      why: "*Rojos* is for more than one *el* thing: *los zapatos*." },
    { q: "What colour is the shirt?", es: "Es una camisa verde oscuro.",
      options: ["Dark green", "Light green", "Green and black"], answer: 0,
      why: "*Oscuro* after a colour makes it dark: *verde oscuro*." },
    { q: "How is Ana's day going?", es: "Hoy es un mal día.",
      options: ["Badly", "Very well", "Not bad at all"], answer: 0,
      why: "*Un mal día*: a bad day. *Malo* loses its *o* before *día*." },
    { q: "Ana asks the shop assistant this. What colour does she want?", es: "¿La tiene en café?",
      options: ["Brown", "Black", "White"], answer: 0,
      why: "In Colombia *café* is brown, as well as coffee." }
  ],
  yourTurn: [
    { en: "It's a good book.", es: "Es un buen libro.", accept: ["Es un libro bueno."] },
    { en: "She sings very well.", es: "Canta muy bien.", accept: ["Ella canta muy bien."] },
    { en: "I'm well, thanks.", es: "Estoy bien, gracias.", accept: [] },
    { en: "The shoes are black.", es: "Los zapatos son negros.", accept: [] },
    { en: "I have a light blue shirt.", es: "Tengo una camisa azul claro.", accept: [] }
  ],
  personal: {
    prompt: "Think of someone who does one thing really well. Write who they are with *buen* or *buena*, and what they do with *bien*.",
    constraints: [
      { type: "regex", pattern: "\\b(buen|buena|buenos|buenas)\\b", label: "what kind of person, with *buen* or *buena*" },
      { type: "regex", pattern: "\\bbien\\b", label: "how they do it, with *bien*" }
    ],
    model: "Mi abuela es una buena cocinera: cocina muy bien."
  },
  pitfalls: [
    "*Estoy bueno*, said about yourself, means you think you look good. For I'm fine, it's *estoy bien*.",
    "*Un bueno libro* is a slip: right before an *el* word, *buen*: *un buen libro*.",
    "*Canta muy buena* is a slip: how she sings is *bien*, and *bien* never changes."
  ]
},

"fn-valorar-a1": {
  source: "old",
  hook: {
    line: "When someone asks how the trip went, or the exam, or the new job, a one-word verdict is enough. And sooner or later the next question is what you do.",
    es: "¿Qué tal el trabajo nuevo?\nBien, pero es un poco difícil.",
    en: "How's the new job?\nGood, but it's a bit difficult."
  },
  examples: [
    { es: "¿Qué tal el examen?\nRegular, la verdad.", en: "How was the exam?\nSo-so, to be honest." },
    { es: "¿A qué te dedicas?\nSoy enfermera. Trabajo en un hospital.", en: "What do you do?\nI'm a nurse. I work in a hospital." },
    { es: "Mi hermano trabaja de mesero en un restaurante.", en: "My brother works as a waiter in a restaurant." }
  ],
  rule: "Asked *¿Qué tal…?*, four quick answers cover most of it: *muy bien, bien, regular* (so-so) and *mal*.\nFor one quality, use *es* with *muy*, *bastante* or *un poco*: *Es bastante caro. Es un poco difícil.* *Un poco* goes with things you don't like: *un poco caro*, *un poco aburrido*.\nTo ask what someone does for a living: *¿A qué te dedicas?* or *¿En qué trabajas?* *¿Qué haces?* is looser, and a hobby is a fine answer.\nThree ways to answer:\n*Soy profesor.*\n*Trabajo en un hospital*: *en* plus the place.\n*Trabajo de mesero*: *de* plus the job.\nNo *un* before the job: *Soy médica.*",
  readAndPick: [
    { q: "How did Laura's exam go?", es: "¿Qué tal el examen?\nRegular.",
      options: ["So-so", "As usual", "Very well"], answer: 0,
      why: "*Regular* here is so-so, not as usual." },
    { q: "What does Diego want to know?", es: "¿A qué te dedicas?",
      options: ["What your job is", "What you're doing now", "What you like doing"], answer: 0,
      why: "*¿A qué te dedicas?* asks about work." },
    { q: "How expensive is the hotel?", es: "Es bastante caro.",
      options: ["Quite expensive", "A little expensive", "Really cheap"], answer: 0,
      why: "*Bastante*: quite. A little would be *un poco*." },
    { q: "What does Ana's sister do?", es: "Trabaja de profesora.",
      options: ["She's a teacher", "She works with a teacher", "She works at a school office"], answer: 0,
      why: "*Trabajar de* plus a job: she works as a teacher." },
    { q: "Is Carlos asking about work?", es: "¿Qué haces los domingos?",
      options: ["No, about Sundays", "Yes, about your job", "No, about the time"], answer: 0,
      why: "*¿Qué haces?* is loose: here it asks what you do on Sundays." }
  ],
  yourTurn: [
    { en: "So-so, to be honest.", es: "Regular, la verdad.", accept: ["Más o menos, la verdad."] },
    { en: "It's a bit difficult.", es: "Es un poco difícil.", accept: [] },
    { en: "What do you do for a living? (to a friend)", es: "¿A qué te dedicas?", accept: ["¿En qué trabajas?"] },
    { en: "I work in a hospital.", es: "Trabajo en un hospital.", accept: [] },
    { en: "My brother works as a waiter.", es: "Mi hermano trabaja de mesero.", accept: ["Mi hermano trabaja como mesero."] }
  ],
  personal: {
    prompt: "Someone asks *¿Qué tal el trabajo?* or *¿Qué tal las clases?* Give your honest verdict, then say what you do.",
    constraints: [
      { type: "containsAny", words: ["bien", "mal", "regular", "más o menos"], label: "a verdict: *bien*, *regular*, *mal*…" },
      { type: "containsAny", words: ["soy", "trabajo", "estudio"], label: "what you do: *soy*, *trabajo* or *estudio*" }
    ],
    model: "Bien, pero es un poco difícil. Soy enfermera y trabajo en un hospital."
  },
  pitfalls: [
    "*Regular*, as a verdict, is so-so: it never means as usual.",
    "*Soy en un hospital* mixes two answers: *soy* plus the job, *trabajo en* plus the place.",
    "*Soy un profesor* sounds odd on its own: the job comes bare, *soy profesor*."
  ]
},

"task-gustos": {
  source: "old",
  hook: {
    line: "Five things you love, five you can't stand, and someone answering each one. The list is the easy part; the answer is where people slip, because *también* after a no says the opposite of what you meant.",
    es: "Laura: No me gusta el frío.\nSam: A mí tampoco. Me encanta el sol.\nLaura: ¡A mí también!",
    en: "Laura: I don't like the cold.\nSam: Me neither. I love the sun.\nLaura: Me too!"
  },
  examples: [
    { es: "Me gustan mucho los perros. ¿Y a ti?\nA mí no. Me gustan los gatos.", en: "I really like dogs. And you?\nI don't. I like cats." },
    { es: "Odio el tráfico de Bogotá.", en: "I hate the traffic in Bogotá." }
  ],
  rule: "Say what you like, then let the other person answer.\nVary the verb: *me encanta, me gusta, no me gusta, no me gusta nada, odio*.\nOne thing, *gusta*; more than one, *gustan*: *Me gusta el café. Me gustan los perros.*\nTo answer, look at the first sentence:\na yes sentence: *A mí también*, me too, or *A mí no*, I don't\na no sentence: *A mí tampoco*, me neither, or *A mí sí*, I do\n*No me gusta el frío. A mí tampoco.*\nWith *gustar*, send it back with *¿Y a ti?*: *Me encanta bailar. ¿Y a ti?*",
  readAndPick: [
    { q: "Does Sam like the cold?", es: "Laura: No me gusta el frío.\nSam: A mí tampoco.",
      options: ["No, he doesn't either", "Yes, he likes it", "He doesn't say"], answer: 0,
      why: "*Tampoco* agrees with a no: me neither." },
    { q: "Does Diego like dogs?", es: "Ana: Me encantan los perros.\nDiego: A mí no.",
      options: ["No", "Yes, he loves them", "Only small dogs"], answer: 0,
      why: "*A mí no* disagrees with a yes sentence." },
    { q: "Does Carlos like mornings?", es: "Laura: No me gustan las mañanas.\nCarlos: A mí sí.",
      options: ["Yes, he does", "No, he doesn't", "He hates them"], answer: 0,
      why: "*A mí sí* flips a no sentence: I do." },
    { q: "What does Laura want to know?", es: "Me encanta bailar. ¿Y a ti?",
      options: ["If you like it too", "If you dance well", "Where you go dancing"], answer: 0,
      why: "*¿Y a ti?* sends a *gustar* question back: and you?" },
    { q: "How does Ana feel about the traffic?", es: "Odio el tráfico.",
      options: ["She hates it", "She doesn't mind it", "She's used to it"], answer: 0,
      why: "*Odio*: I hate." }
  ],
  yourTurn: [
    { en: "I love the sun.", es: "Me encanta el sol.", accept: [] },
    { en: "I like cats.", es: "Me gustan los gatos.", accept: [] },
    { en: "Your friend says Me encanta bailar. Say that you don't.", es: "A mí no.", accept: [] },
    { en: "I love dancing. And you? (to a friend)", es: "Me encanta bailar. ¿Y a ti?", accept: [] },
    { en: "I hate the traffic.", es: "Odio el tráfico.", accept: [] }
  ],
  personal: {
    prompt: "Write three true lines: something you love, something you can't stand, and the question sent back to a friend.",
    constraints: [
      { type: "containsWord", word: "me encanta", label: "something you love: *me encanta*…" },
      { type: "containsAny", words: ["odio", "no me gusta nada", "no me gustan nada"], label: "something you can't stand: *odio* or *no me gusta nada*" },
      { type: "regex", pattern: "y a ti\\s*\\?", label: "sent back: *¿y a ti?*" }
    ],
    model: "Me encanta el café. Odio el tráfico. ¿Y a ti?"
  },
  pitfalls: [
    "*A mí también* after a no sentence says the opposite: *No me gusta el frío. A mí tampoco.*",
    "*Yo también* answers *tengo* or *estudio*; after *me gusta*, it is *a mí también*.",
    "*Me gusta los perros* is a slip: *me gustan los perros*."
  ]
},

/* ---- unit 6 · Order and buy -------------------------------------------- */

"gn-conversacion-transaccional-a1": {
  source: "old",
  hook: {
    line: "A bus ticket, a coffee, a pound of mangoes: buying face to face follows the same moves every time. Skip one and even perfect Spanish sounds abrupt.",
    es: "Buenos días. Quería un tiquete para Medellín.\n¿Solo de ida?\nNo, de ida y vuelta, por favor.",
    en: "Good morning. I'd like a ticket to Medellín.\nJust one way?\nNo, a return, please."
  },
  examples: [
    { es: "¿A cómo está el aguacate?\nA dos mil la libra.", en: "What's avocado going for?\nTwo thousand a pound." },
    { es: "Son quince mil.\nAquí tiene.\nGracias, muy amable.", en: "That's fifteen thousand.\nHere you are.\nThank you, that's very kind." },
    { es: "¿Me regala un tinto, por favor?", en: "Can I have a black coffee, please?" }
  ],
  rule: "Buying has the same moves every time:\nGreet: *Buenos días.*\nThe seller offers: *¿En qué le puedo servir?* or *¿Le puedo ayudar?*\nSay what you want: *Quería un tiquete para Cali*, softer than *quiero*. In Colombia also *¿Me regala…?*: can I have, and you still pay.\nAsk the price: *¿Cuánto es?* At the market: *¿A cómo está el aguacate?*, what is it going for today.\nPay: *Aquí tiene*, here you are. *¿En efectivo o con tarjeta?*, cash or card?\nClose: *Gracias, muy amable. Que esté bien.*\nLeave out the thanks and the goodbye, and every word can be right and still sound cold.",
  readAndPick: [
    { q: "The man at the counter says this. What is he doing?", es: "¿En qué le puedo servir?",
      options: ["Offering to help", "Asking your name", "Telling you to wait"], answer: 0,
      why: "*¿En qué le puedo servir?*: how can I help you?" },
    { q: "What kind of ticket does Laura want?", es: "Un tiquete de ida y vuelta, por favor.",
      options: ["There and back", "Just one way", "Two one-way tickets"], answer: 0,
      why: "*De ida y vuelta*: going and coming back." },
    { q: "Does the customer want the tomatoes for free?", es: "¿Me regala dos libras de tomate?",
      options: ["No, she wants to buy them", "Yes, as a present", "No, she is selling them"], answer: 0,
      why: "In Colombia *¿me regala…?* is a polite can I have. She still pays." },
    { q: "What does the seller tell you?", es: "El aguacate está a tres mil la libra.",
      options: ["Today's price for a pound", "It weighs three pounds", "Three for a thousand"], answer: 0,
      why: "*Está a* tres mil: that is what it's going for today." },
    { q: "Diego hands over the money and says this. What does it mean?", es: "Aquí tiene.",
      options: ["Here you are", "Keep the change", "Is that right?"], answer: 0,
      why: "*Aquí tiene*: here you are, to someone you call *usted*." },
    { q: "Is the conversation over?", es: "Muchas gracias. Que esté bien.",
      options: ["Yes, that's goodbye", "No, he still has to pay", "No, she wants more"], answer: 0,
      why: "*Que esté bien*: take care, a polite way to close." }
  ],
  yourTurn: [
    { en: "I'd like a return ticket to Cali, please.", es: "Quería un tiquete de ida y vuelta para Cali, por favor.", accept: ["[Quería|Quisiera] un [tiquete|pasaje] de ida y vuelta [para|a] Cali(, por favor)."] },
    { en: "How much is it?", es: "¿Cuánto es?", accept: [] },
    { en: "Here you are. (polite)", es: "Aquí tiene.", accept: [] },
    { en: "Thank you, that's very kind.", es: "Gracias, muy amable.", accept: ["Muchas gracias, muy amable."] },
    { en: "What's avocado going for today?", es: "¿A cómo está el aguacate hoy?", accept: ["¿A cómo está hoy el aguacate?"] }
  ],
  personal: {
    prompt: "Think of something you will really buy this week. Write what you would say at the counter: what you want, and the question about the price.",
    constraints: [
      { type: "containsAny", words: ["quería", "quiero", "me regala", "me da"], label: "what you want: *quería…* or *¿me regala…?*" },
      { type: "containsAny", words: ["cuánto", "a cómo"], label: "the price: *¿cuánto es?* or *¿a cómo está?*" },
      { type: "containsWord", word: "por favor", label: "*por favor*" }
    ],
    model: "Buenos días. Quería dos libras de café, por favor. ¿Cuánto es?"
  },
  pitfalls: [
    "*Aquí tienes* is for a friend; to the person at the counter, *aquí tiene*.",
    "*Quiero* is understood, but *quería* or *¿me regala…?* sounds kinder to a stranger.",
    "Paying and walking off reads as cold: close with *gracias* and a goodbye."
  ]
},

"gr-articulo-indefinido-a1": {
  source: "merged",
  hook: {
    line: "English has a and the. Spanish has *un, una, unos, unas* and *el, la, los, las*, and the choice also tells your listener whether the thing is new to them or one they already know.",
    es: "Hay una droguería en esta calle.\n¿La droguería está abierta?",
    en: "There's a pharmacy on this street.\nIs the pharmacy open?"
  },
  examples: [
    { es: "Tengo un hermano y una hermana.", en: "I have a brother and a sister." },
    { es: "Necesito unos zapatos nuevos.", en: "I need some new shoes." },
    { es: "Hay un café en la esquina. El café es pequeño, pero bueno.", en: "There's a café on the corner. The café is small, but good." }
  ],
  rule: "Every word for a thing is an *el* word or a *la* word, and the small word in front shows which:\n*el, un*: *el banco, un banco*\n*la, una*: *la plaza, una plaza*\nMore than one: *los, unos*; *las, unas*. *Unos* means some: *unos amigos*.\nMost words in *-o* take *el*; most in *-a* take *la*, and so do *la canción* and *la ciudad*. Learn the rest with their *el* or *la*: *el pan, la leche, el día*.\n*Un* or *una* brings in something new; once it is known, *el* or *la*:\n*Hay un banco en la plaza. El banco abre a las nueve.*\nNo *un* next to *este* or a number: *este libro, dos libros*.",
  readAndPick: [
    { q: "Has Laura talked about this bank before?", es: "El banco cierra a las cuatro.",
      options: ["Yes, you both know it", "No, it's new to you", "There's no bank"], answer: 0,
      why: "*El*: a bank you both already know about." },
    { q: "And this time?", es: "Hay un banco en la plaza.",
      options: ["No, this is news", "Yes, you know it", "It's the only one"], answer: 0,
      why: "*Un*: something new to the listener." },
    { q: "Diego is talking about a friend. A man or a woman?", es: "Viene una amiga de Cali.",
      options: ["A woman", "A man", "We can't tell"], answer: 0,
      why: "*Una amiga*: a woman. A man would be *un amigo*." },
    { q: "What does Ana need?", es: "Necesito unos zapatos.",
      options: ["Some shoes", "One shoe", "The shoes you know"], answer: 0,
      why: "*Unos*: some. One shoe is *un zapato*; *los zapatos*, ones you both know." },
    { q: "The waiter asks *¿Un tinto o una cerveza?* Carlos answers this. What does he want?", es: "Una, por favor.",
      options: ["The beer", "The black coffee", "Both of them"], answer: 0,
      why: "*Una* can only go with *cerveza*. For the coffee he would say *uno*." }
  ],
  yourTurn: [
    { en: "There's a bank in the square.", es: "Hay un banco en la plaza.", accept: [] },
    { en: "The bank opens at nine.", es: "El banco abre a las nueve.", accept: [] },
    { en: "I have a brother and two sisters.", es: "Tengo un hermano y dos hermanas.", accept: [] },
    { en: "I need some new shoes.", es: "Necesito unos zapatos nuevos.", accept: [] },
    { en: "This book is very good.", es: "Este libro es muy bueno.", accept: [] }
  ],
  personal: {
    prompt: "Write two lines about a street near you: something on it with *un* or *una*, then the same thing again with *el* or *la*.",
    constraints: [
      { type: "regex", pattern: "\\bhay (un|una|unos|unas)\\b", label: "something new: *hay un…* or *hay una…*" },
      { type: "regex", pattern: "(^|[.!?]\\s*)(el|la|los|las)\\s", label: "the same thing again, starting with *el* or *la*" }
    ],
    model: "En mi calle hay una panadería. La panadería abre a las seis."
  },
  pitfalls: [
    "*Hay el banco* is a slip: *hay* brings in something new, so *hay un banco*. One you both know: *el banco está en la plaza*.",
    "*Un este libro* and *un dos libros* stack two pointers: *este libro*, *dos libros*.",
    "*El día* takes *el* though it ends in *-a*, and *la mano* takes *la* though it ends in *-o*."
  ]
},

"nt-existencia-a1": {
  source: "merged",
  hook: {
    line: "Is there a pharmacy near here? Is there any milk left? Spanish asks and answers both with one small word that never changes: *hay*.",
    es: "¿Hay una droguería por aquí?\nSí, hay una en la esquina, pero hoy está cerrada.",
    en: "Is there a pharmacy around here?\nYes, there's one on the corner, but it's closed today."
  },
  examples: [
    { es: "En mi barrio hay dos parques y muchas panaderías.", en: "In my neighbourhood there are two parks and lots of bakeries." },
    { es: "Mi apartamento tiene tres cuartos.", en: "My apartment has three bedrooms." },
    { es: "Un tinto sin azúcar, por favor.", en: "A black coffee with no sugar, please." }
  ],
  rule: "*Hay* says something exists: there is, there are. It never changes: *hay un parque, hay dos parques*.\n*¿Hay una droguería por aquí? No hay leche.*\nAfter *hay*: *un, una*, a number, *mucho*, or nothing. Never *el* or *la*: a thing you both know takes *está*: *La droguería está en la esquina.*\nThe place can do the having instead: *Mi barrio tiene dos parques.* Pick one: *En mi barrio hay…* or *Mi barrio tiene…*\n*Con* and *sin* add or leave out, with no *el*: *café con leche, sin azúcar*.\nOpen or closed right now takes *está*: *La tienda está abierta.* The action is *abre* and *cierra*: *Abre a las nueve.*",
  readAndPick: [
    { q: "Is there any milk?", es: "No hay leche.",
      options: ["No, none at all", "Yes, a little", "It's in the fridge"], answer: 0,
      why: "*No hay*: there isn't any." },
    { q: "Has Diego mentioned this pharmacy before?", es: "La droguería está en la esquina.",
      options: ["Yes, they know it", "No, it's new to them", "There isn't one"], answer: 0,
      why: "*La* and *está*: a pharmacy they both know about. New would be *hay una droguería*." },
    { q: "How does don Jorge take his coffee?", es: "Un tinto sin azúcar, por favor.",
      options: ["With no sugar", "With extra sugar", "With milk"], answer: 0,
      why: "*Sin*: without." },
    { q: "Can you go in right now?", es: "El museo está cerrado.",
      options: ["No, it's closed", "Yes, it's open", "Only at nine"], answer: 0,
      why: "*Está cerrado*: closed right now." },
    { q: "When can you shop there?", es: "La tienda abre a las nueve y cierra a las seis.",
      options: ["From nine to six", "From six to nine", "At nine, for an hour"], answer: 0,
      why: "*Abre*: opens. *Cierra*: closes." }
  ],
  yourTurn: [
    { en: "Is there a pharmacy around here?", es: "¿Hay una droguería por aquí?", accept: ["¿Hay una farmacia por [aquí|acá]?", "¿Hay una droguería por acá?"] },
    { en: "There are two parks in my neighbourhood.", es: "En mi barrio hay dos parques.", accept: ["Hay dos parques en mi barrio."] },
    { en: "My apartment has three bedrooms.", es: "Mi apartamento tiene tres cuartos.", accept: ["Mi apartamento tiene tres habitaciones."] },
    { en: "A coffee with milk, no sugar, please.", es: "Un café con leche, sin azúcar, por favor.", accept: [] },
    { en: "The shop is closed.", es: "La tienda está cerrada.", accept: [] }
  ],
  personal: {
    prompt: "Write two true lines about where you live: what there is nearby, with *hay*, and what your home has, with *tiene*.",
    constraints: [
      { type: "regex", pattern: "\\bhay\\b", label: "what there is, with *hay*" },
      { type: "regex", pattern: "\\btiene\\b", label: "what your home has, with *tiene*" }
    ],
    model: "En mi calle hay una panadería y un parque. Mi apartamento tiene dos cuartos."
  },
  pitfalls: [
    "*Mi barrio hay dos parques* mixes the two: *En mi barrio hay…* or *Mi barrio tiene…*",
    "*Hay* never changes: *hay un parque, hay dos parques*. Never *están dos parques* for there are.",
    "*La tienda es cerrada* is a slip: open or closed right now is *está*."
  ]
},

"task-cafe": {
  source: "old",
  hook: {
    line: "A café order is four moves long and nearly the same every time: greet, order, anything else, the bill. Learn the shape, and your first coffee in Bogotá is easy.",
    es: "Mesero: Buenas tardes. ¿Qué le provoca?\nAna: Un café con leche, por favor.\nMesero: ¿Algo más?\nAna: No, nada más, gracias.",
    en: "Waiter: Good afternoon. What would you like?\nAna: A coffee with milk, please.\nWaiter: Anything else?\nAna: No, that's all, thanks."
  },
  examples: [
    { es: "¿Me regala un tinto y una empanada, por favor?", en: "Can I have a black coffee and an empanada, please?" },
    { es: "¿Cuánto le debo?\nSon ocho mil.", en: "How much do I owe you?\nThat's eight thousand." },
    { es: "Para mí, un jugo de mango en agua.", en: "For me, a mango juice made with water." }
  ],
  rule: "Four moves, both sides:\nGreet: *Buenas tardes.* The waiter may ask *¿Qué le provoca?*, what would you like.\nOrder: *Un café con leche, por favor.* or *¿Me regala un tinto?* or *Para mí, un jugo.*\n*Quiero un café* is understood, but plain; *quería* is softer.\nAnything else: *¿Algo más?* Your answer: *No, nada más, gracias.*\nThe bill: *La cuenta, por favor*, or *¿Cuánto le debo?*, how much do I owe you.\nA *tinto* in Colombia is a small black coffee. A juice comes *en agua* or *en leche*: made with water, or with milk.",
  readAndPick: [
    { q: "What is the waiter asking?", es: "¿Algo más?",
      options: ["If you want anything else", "If you want a bigger one", "If you have paid"], answer: 0,
      why: "*¿Algo más?*: anything else?" },
    { q: "Who is Ana ordering for?", es: "Para mí, un jugo de mora.",
      options: ["Herself", "Her friend", "The whole table"], answer: 0,
      why: "*Para mí*: for me." },
    { q: "What does Sam want to do?", es: "¿Cuánto le debo?",
      options: ["Pay", "Order more food", "Leave a tip"], answer: 0,
      why: "*¿Cuánto le debo?*: how much do I owe you?" },
    { q: "What will Diego get?", es: "Un tinto, por favor.",
      options: ["A small black coffee", "A glass of red wine", "A coffee with milk"], answer: 0,
      why: "In Colombia a *tinto* is a small black coffee. Red wine is *vino tinto*." },
    { q: "How does Laura want her juice?", es: "Un jugo de mango en leche.",
      options: ["Made with milk", "With milk on the side", "Without milk"], answer: 0,
      why: "*En leche*: blended with milk. *En agua* is with water." }
  ],
  yourTurn: [
    { en: "A coffee with milk, please.", es: "Un café con leche, por favor.", accept: [] },
    { en: "Can I have a tinto, please?", es: "¿Me regala un tinto, por favor?", accept: ["¿Me da un tinto, por favor?"] },
    { en: "No, that's all, thanks.", es: "No, nada más, gracias.", accept: [] },
    { en: "The bill, please.", es: "La cuenta, por favor.", accept: [] },
    { en: "How much do I owe you? (polite)", es: "¿Cuánto le debo?", accept: [] }
  ],
  personal: {
    prompt: "Write your own order at your favourite café: what you want, and how you ask for the bill.",
    constraints: [
      { type: "regex", pattern: "\\b(un|una)\\s", label: "what you want, with *un* or *una*" },
      { type: "containsWord", word: "por favor", label: "*por favor*" },
      { type: "containsAny", words: ["la cuenta", "cuánto le debo", "cuánto es"], label: "the bill: *la cuenta* or *¿cuánto le debo?*" }
    ],
    model: "Un café con leche y una empanada, por favor. ¿Cuánto le debo?"
  },
  pitfalls: [
    "*Un tinto* is coffee here; for the wine, ask for *vino tinto*.",
    "*Quiero un café* is understood everywhere, but with a stranger *¿me regala…?* or *quería* sounds kinder.",
    "*La cuenta* is the bill; *el recibo* is the receipt you take away."
  ]
},

/* ---- unit 7 · Describe people and things ------------------------------- */

"gr-genero-adjetivo-a1": {
  source: "merged",
  hook: {
    line: "In English, tall is tall for everyone. In Spanish the word changes to match who you are describing, and a Spanish speaker hears a wrong ending at once.",
    es: "¿Tu profesora es colombiana?\nNo, es inglesa, pero es muy simpática.",
    en: "Is your teacher Colombian?\nNo, she's English, but she's very nice."
  },
  examples: [
    { es: "Diego es alto y Laura es baja.", en: "Diego is tall and Laura is short." },
    { es: "Es una mujer muy feliz y muy amable.", en: "She's a very happy, very kind woman." },
    { es: "Mis amigos son ingleses, pero mi novia es española.", en: "My friends are English, but my girlfriend is Spanish." }
  ],
  rule: "A describing word matches the person or thing it describes.\nEnding in *-o*: *-a* for a woman or a *la* word: *alto, alta*; *un carro nuevo, una casa nueva*.\nEnding in *-e* or a consonant: the same for both: *un hombre feliz, una mujer feliz*; *amable, joven, azul*.\nNationalities break that last rule and add *-a*: *español, española*; *inglés, inglesa*. The accent drops: *francesa, alemana*.\nMore than one: *-s* after a vowel, *-es* after a consonant: *altos, amables, azules*.\nA mixed group takes the *o* form: *Laura y Diego son altos.*\nEnglish never changes tall or happy, so this is the part to watch.",
  readAndPick: [
    { q: "Who is Ana talking about?", es: "Es muy alta.",
      options: ["It's a woman", "It's a man", "We can't tell"], answer: 0,
      why: "*Alta* ends in *-a*: a woman." },
    { q: "And this time?", es: "Es muy amable.",
      options: ["We can't tell", "It's a woman", "It's a man"], answer: 0,
      why: "*Amable* is the same for both, so the ending can't tell you." },
    { q: "Is the new student a man or a woman?", es: "Es inglesa.",
      options: ["It's a woman", "It's a man", "Either one"], answer: 0,
      why: "Nationalities add *-a* even after a consonant: *inglés*, *inglesa*." },
    { q: "How many people are tired?", es: "Están cansados.",
      options: ["More than one", "Just one man", "Just one woman"], answer: 0,
      why: "*Cansados*: more than one person, all men or a mixed group." },
    { q: "Who is coming to dinner?", es: "Mis amigas son muy simpáticas.",
      options: ["Only women", "Men and women", "Only men"], answer: 0,
      why: "*Amigas* and *simpáticas*: women only. A mixed group would be *amigos simpáticos*." }
  ],
  yourTurn: [
    { en: "Laura is tall.", es: "Laura es alta.", accept: [] },
    { en: "Ana is very happy.", es: "Ana es muy feliz.", accept: [] },
    { en: "She's English.", es: "Es inglesa.", accept: ["Ella es inglesa."] },
    { en: "My friends are very nice.", es: "Mis amigos son muy simpáticos.", accept: ["Mis amigas son muy simpáticas."] },
    { en: "The house is new.", es: "La casa es nueva.", accept: [] }
  ],
  personal: {
    prompt: "Describe two people you know, a man and a woman, with one word for each that changes its ending: *alto, alta*; *simpático, simpática*.",
    constraints: [
      { type: "regex", pattern: "\\bes (muy )?[a-záéíóúñ]+o\\b", label: "a man, with an *-o* word" },
      { type: "regex", pattern: "\\bes (muy )?[a-záéíóúñ]+a\\b", label: "a woman, with an *-a* word" }
    ],
    model: "Mi papá es alto y muy simpático. Mi mamá es baja y muy alegre."
  },
  pitfalls: [
    "*Feliza* and *azula* do not exist: words ending in a consonant stay the same, *una mujer feliz*.",
    "Nationalities are the exception: *inglés, inglesa*; *español, española*, and the accent drops.",
    "*Mis amigos son simpático* is a slip: more than one, *simpáticos*."
  ]
},

"gr-adjetivos-calificativos-a1": {
  source: "merged",
  hook: {
    line: "In a shop you rarely name the thing twice. Spanish lets you point with just *el* or *la* and the describing word: the red one, the cheap one.",
    es: "¿Cuál camisa le gusta?\nLa azul. La roja es carísima.",
    en: "Which shirt do you like?\nThe blue one. The red one is really expensive."
  },
  examples: [
    { es: "Es un restaurante pequeño, pero muy bueno.", en: "It's a small restaurant, but a very good one." },
    { es: "De los dos suéteres, prefiero el negro.", en: "Of the two sweaters, I prefer the black one." },
    { es: "La comida está riquísima.", en: "The food is really delicious." }
  ],
  rule: "A describing word usually goes after the thing: *una camisa roja, un restaurante caro*. With *es*, after the verb: *El restaurante es caro.*\nEither way it matches: *la camisa roja, los zapatos rojos*.\nWhen the thing is clear, leave it out, and *el* or *la* carries the describing word alone:\n*¿Qué camisa quieres? La roja.* The red one.\n*¿Cuál prefieres? El más barato.* The cheapest one.\nFor really, swap the last vowel for *-ísimo*: *caro, carísimo*; *rico, riquísimo*. It already means very, so no *muy* with it.\nAfter *mi* or *tu* the thing has to stay: *mi camisa roja*, not *mi roja*.",
  readAndPick: [
    { q: "Which one does Laura want?", es: "¿El carro? Prefiero el blanco.",
      options: ["The white car", "Anything white", "The colour white"], answer: 0,
      why: "*El blanco* here is the white one: *carro* is understood." },
    { q: "Laura is choosing between *la camisa* and *el suéter*. Which does she take?", es: "Me llevo la roja.",
      options: ["The shirt", "The sweater", "Both, in red"], answer: 0,
      why: "*La roja* can only be *la camisa*. The sweater would be *el rojo*." },
    { q: "How expensive is it?", es: "Es carísimo.",
      options: ["Really expensive", "A bit expensive", "Too cheap"], answer: 0,
      why: "*-ísimo*: really, very very." },
    { q: "Which hotel does Diego choose?", es: "Prefiero el más barato.",
      options: ["The cheapest one", "The nicest one", "A cheap one"], answer: 0,
      why: "*El más barato*: the cheapest. A cheap one would be *uno barato*." },
    { q: "What does Ana think of the soup?", es: "La sopa está riquísima.",
      options: ["It's delicious", "It's too rich", "It's too dear"], answer: 0,
      why: "*Riquísima*, from *rico*: really tasty." }
  ],
  yourTurn: [
    { en: "It's a very expensive restaurant.", es: "Es un restaurante muy caro.", accept: [] },
    { en: "Of the two sweaters, I prefer the black one.", es: "De los dos suéteres, prefiero el negro.", accept: [] },
    { en: "The red one, please. (*la camisa*)", es: "La roja, por favor.", accept: [] },
    { en: "The food is really delicious.", es: "La comida está riquísima.", accept: ["La comida está muy rica."] },
    { en: "My red shirt is new.", es: "Mi camisa roja es nueva.", accept: [] }
  ],
  personal: {
    prompt: "You own two of something: two bags, two mugs, two jackets. Write which one you use, with just *el* or *la* and a describing word, and why, with *-ísimo* or *-ísima*.",
    constraints: [
      { type: "regex", pattern: "\\b(el|la|los|las) (negr|blanc|roj|azul|verde|gris|grande|pequeñ|nuev|viej|barat|car|bonit|fe)", label: "the one you mean, with *el* or *la*: *la negra*" },
      { type: "regex", pattern: "[ií]sim[oa]s?\\b", label: "a word with *-ísimo* or *-ísima*" }
    ],
    model: "Tengo dos mochilas. Uso la negra porque es grandísima."
  },
  pitfalls: [
    "*Muy carísimo* says very twice: *carísimo*, or *muy caro*.",
    "After *mi* or *tu* the thing stays: *mi camisa roja*, never *mi roja*.",
    "The ending follows the thing you left out: *la roja* is a shirt, *el rojo* a sweater."
  ]
},

"gr-posesivos-forma-a1": {
  source: "merged",
  hook: {
    line: "Spanish has no *'s*. Laura's car is the car of Laura, and one small word, *su*, can mean his, her, their or your.",
    es: "¿De quién es este carro?\nEs de Laura. Su carro es nuevo.",
    en: "Whose car is this?\nIt's Laura's. Her car is new."
  },
  examples: [
    { es: "Mis papás viven en Cali con mi hermana.", en: "My parents live in Cali with my sister." },
    { es: "¿Tienes tus llaves?", en: "Have you got your keys?" },
    { es: "Nuestra casa es pequeña, pero nuestro barrio es bonito.", en: "Our house is small, but our neighbourhood is pretty." }
  ],
  rule: "Whose, right before the thing:\n*mi*: my\n*tu*: your, to a friend\n*su*: his, her, their, or your with *usted*\n*nuestro, nuestra*: our\nMore than one thing adds *-s*: *mis amigos, tus llaves, sus papás*. The *-s* follows the things, not the owner.\n*Nuestro* also matches *el* or *la*: *nuestro barrio, nuestra casa*.\nFor *'s*, say the thing, *de*, then the owner: *el carro de Laura*. To ask: *¿De quién es?* *Es de Diego.*\nWhen *su* could be anyone's, use *de*: *la casa de ella*.\nNo *el* with these: *mi libro*, never *el mi libro*.",
  readAndPick: [
    { q: "Laura finds a phone on the table. What does Ana tell her?", es: "Es de Diego.",
      options: ["It belongs to Diego", "Diego sent it", "It's for Diego"], answer: 0,
      why: "*Ser de* plus a person: whose it is." },
    { q: "Who is Ana talking to?", es: "¿Este es tu carro?",
      options: ["A friend", "A stranger, politely", "A group"], answer: 0,
      why: "*Tu*: your, to a friend. Politely, it would be *su*." },
    { q: "Whose house is it?", es: "Es nuestra casa.",
      options: ["Ours", "Theirs", "Mine"], answer: 0,
      why: "*Nuestra*: our." },
    { q: "Diego is talking about Laura and Sam. Whose apartment is it?", es: "Es su apartamento.",
      options: ["We can't be sure", "Only Laura's", "Only Sam's"], answer: 0,
      why: "*Su* can be his, her or their. If it matters, say *de ella* or *de él*." },
    { q: "What does the man at the airport want to know?", es: "¿De quién es esta maleta?",
      options: ["Who it belongs to", "Who you are", "Where it's from"], answer: 0,
      why: "*¿De quién?*: whose. *¿Quién es?* would be who is it." }
  ],
  yourTurn: [
    { en: "My parents live in Cali.", es: "Mis papás viven en Cali.", accept: ["Mis padres viven en Cali."] },
    { en: "It's Laura's car.", es: "Es el carro de Laura.", accept: [] },
    { en: "Whose is this?", es: "¿De quién es esto?", accept: [] },
    { en: "Our house is small.", es: "Nuestra casa es pequeña.", accept: [] },
    { en: "Have you got your keys? (to a friend)", es: "¿Tienes tus llaves?", accept: [] }
  ],
  personal: {
    prompt: "Write two true lines about your people: where someone in your family lives, with *mi* or *mis*, and something that belongs to one of them, with *de*.",
    constraints: [
      { type: "regex", pattern: "\\b(mi|mis)\\s", label: "*mi* or *mis*" },
      { type: "regex", pattern: "[Dd]e (mi|mis|tu|su|[A-ZÁÉÍÓÚÑ])", flags: "u", label: "whose, with *de*: *de mi hermana*, *de Laura*" }
    ],
    model: "Mis papás viven en Toronto. El carro rojo es de mi hermana."
  },
  pitfalls: [
    "*Mi amigos* is a slip: the *-s* follows the things, *mis amigos*.",
    "*Tú* with an accent is you; your is *tu*: *tu casa*.",
    "*¿Quién es esto?* asks who; whose is *¿De quién es?*"
  ]
},

"gr-demostrativos-distribucion-a1": {
  source: "merged",
  hook: {
    line: "You met *este* and *ese* in week one. English points two ways, this and that; Spanish points three, and the middle one is about the person you are talking to.",
    es: "¿Le gusta esta camisa?\nNo mucho. Me gusta más aquella, la del fondo.",
    en: "Do you like this shirt?\nNot much. I like that one over there better, the one at the back."
  },
  examples: [
    { es: "Este café es para mí y ese es para ti.", en: "This coffee is for me and that one is for you." },
    { es: "¿Ves aquel edificio alto? Trabajo allí.", en: "See that tall building over there? I work there." },
    { es: "Estos zapatos son nuevos.", en: "These shoes are new." }
  ],
  rule: "Spanish points three ways:\n*este, esta*: this, near me\n*ese, esa*: that, near you\n*aquel, aquella*: that one over there, far from both of us\nMore than one: *estos, estas*; *esos, esas*; *aquellos, aquellas*.\nThey match the thing and go before it, with no *el*: *esta camisa*, never *la esta camisa*.\n*Ese* goes by the listener: the cup in your friend's hand is *esa taza*, even close by.\n*Esto* and *eso* are for a thing with no name yet: *¿Qué es eso?* Once you name it, *ese libro*.\nIn everyday talk, *ese de allá* often does the job of *aquel*.",
  readAndPick: [
    { q: "Where is the book?", es: "Ese libro es muy bueno.",
      options: ["Near the listener", "In the speaker's hand", "Far from them both"], answer: 0,
      why: "*Ese*: near the person being spoken to." },
    { q: "And the building?", es: "Aquel edificio es un hotel.",
      options: ["Far from them both", "Right by the speaker", "Near the listener"], answer: 0,
      why: "*Aquel*: over there, away from both." },
    { q: "What is Ana holding up?", es: "Estas son de Diego.",
      options: ["Some keys", "A phone", "A book"], answer: 0,
      why: "*Estas*: more than one *la* thing, like *las llaves*. *El celular* and *el libro* would be *este*." },
    { q: "Does the speaker know what the thing is?", es: "¿Qué es eso?",
      options: ["No, not yet", "Yes, it's a book", "Yes, it's hers"], answer: 0,
      why: "*Eso*, with no word after it: a thing with no name yet." },
    { q: "The shop assistant is holding two shirts. Which one does Laura want?", es: "Esa, por favor.",
      options: ["One the assistant holds", "One Laura is holding", "One in the window"], answer: 0,
      why: "*Esa*: that one, near the person you're talking to." }
  ],
  yourTurn: [
    { en: "This shirt is very pretty.", es: "Esta camisa es muy bonita.", accept: [] },
    { en: "These shoes are new.", es: "Estos zapatos son nuevos.", accept: [] },
    { en: "What's that? (near you)", es: "¿Qué es eso?", accept: [] },
    { en: "That building over there is a hotel.", es: "Aquel edificio es un hotel.", accept: ["Ese edificio de [allá|allí] es un hotel."] },
    { en: "That one, please. (*la torta*, next to the waiter)", es: "Esa, por favor.", accept: [] }
  ],
  personal: {
    prompt: "Look around you. Write one line about something near you, with *este* or *esta*, and one about something further off, with *ese* or *aquel*.",
    constraints: [
      { type: "regex", pattern: "\\b(este|esta|estos|estas)\\b", label: "something near you: *este* or *esta*" },
      { type: "regex", pattern: "\\b(ese|esa|esos|esas|aquel|aquella|aquellos|aquellas)\\b", label: "something further off: *ese* or *aquel*" }
    ],
    model: "Esta taza es de mi hermana. Aquella planta es muy vieja."
  },
  pitfalls: [
    "*La esta camisa* stacks two pointers: just *esta camisa*.",
    "*Este camisa* is a slip: a *la* word takes *esta*.",
    "Something a step away but next to your friend is *ese*, not *este*: the choice follows the listener."
  ]
},

"nt-familia-a1": {
  source: "merged",
  hook: {
    line: "*¿Tienes hermanos?* comes up in the first five minutes with anyone. The answer is short, and one word in it, *hermanos*, can mean brothers, or brothers and sisters.",
    es: "¿Tienes hermanos?\nSí, dos. Una hermana mayor y un hermano pequeño.",
    en: "Do you have any brothers or sisters?\nYes, two. An older sister and a little brother."
  },
  examples: [
    { es: "Somos cinco: mis papás, mis dos hermanas y yo.", en: "There are five of us: my parents, my two sisters and me." },
    { es: "Mi abuela tiene ochenta y dos años y vive sola.", en: "My grandmother is eighty-two and lives on her own." },
    { es: "Soy hija única, pero tengo muchos primos.", en: "I'm an only child, but I have lots of cousins." }
  ],
  rule: "*¿Tienes hermanos?* is one of the first things people ask. Answer with *tener*: *Tengo dos hermanos.*\nA mixed group goes by the word for the men:\n*mis hermanos*: my brothers, or my brothers and sisters\n*mis papás*: my mum and dad\n*mis abuelos, mis hijos, mis primos*\n*Mis hermanas* is sisters only.\nOlder is *mayor*, younger is *menor*, after the word: *mi hermana mayor, mi hermano menor*. *Pequeño* is the warm word for a little brother or sister.\nHow many of you: *Somos cuatro*, with no word for of us.\nAge is *tener*: *Mi abuela tiene ochenta años.*\nNo brothers or sisters: *Soy hijo único*, or *hija única*.",
  readAndPick: [
    { q: "Diego says this. What do you know?", es: "Tengo tres hermanos.",
      options: ["Three, boys or girls", "Three boys only", "Three girls only"], answer: 0,
      why: "*Hermanos* covers a mixed group. Only *hermanas* would mean all girls." },
    { q: "And Laura?", es: "Tengo dos hermanas.",
      options: ["Two sisters", "A brother and a sister", "Two brothers"], answer: 0,
      why: "*Hermanas*: all women." },
    { q: "Who is older?", es: "Mi hermano menor tiene quince años.",
      options: ["The speaker", "The brother", "We can't tell"], answer: 0,
      why: "*Menor*: younger. The brother is younger than the speaker." },
    { q: "Who lives in Cali?", es: "Mis papás viven en Cali.",
      options: ["Her parents", "Two fathers", "Her relatives"], answer: 0,
      why: "*Mis papás*: my parents. Relatives are *parientes*." },
    { q: "Does Sam have brothers or sisters?", es: "Soy hijo único.",
      options: ["No, none", "Yes, one brother", "Yes, one son"], answer: 0,
      why: "*Hijo único*: an only child." }
  ],
  yourTurn: [
    { en: "Do you have any brothers or sisters? (to a friend)", es: "¿Tienes hermanos?", accept: [] },
    { en: "I have an older sister.", es: "Tengo una hermana mayor.", accept: [] },
    { en: "There are four of us.", es: "Somos cuatro.", accept: [] },
    { en: "My grandfather is eighty.", es: "Mi abuelo tiene ochenta años.", accept: [] },
    { en: "I'm an only child. (a woman)", es: "Soy hija única.", accept: [] }
  ],
  personal: {
    prompt: "Answer *¿Tienes hermanos?* for real: how many, who they are, and one age. If you have none, start with *soy hijo único* or *hija única* and tell us about a cousin or a parent.",
    constraints: [
      { type: "containsAny", words: ["tengo", "soy hij", "somos"], label: "your answer: *tengo…*, *somos…* or *soy hijo único*" },
      { type: "containsWord", word: "años", label: "one age, with *años*" }
    ],
    model: "Sí, tengo un hermano mayor. Tiene treinta y cinco años y vive en Montreal."
  },
  pitfalls: [
    "*Mis parientes* are my relatives; my parents are *mis papás* or *mis padres*.",
    "*Somos cuatro* needs no of us.",
    "*Mi hermana vieja* sounds unkind: older is *mayor*."
  ]
},

"gn-describir-persona-a1": {
  source: "merged",
  hook: {
    line: "You are meeting someone off the bus and a friend describes them on the phone. Spanish splits a description across three verbs: what they are, what they have, and what they have on.",
    es: "Es alta, tiene el pelo corto y lleva una chaqueta roja.",
    en: "She's tall, she has short hair and she's wearing a red jacket."
  },
  examples: [
    { es: "Mi profesor es bajo y tiene barba.", en: "My teacher is short and has a beard." },
    { es: "Hoy lleva una camiseta blanca.", en: "Today he's wearing a white T-shirt." },
    { es: "Mi tía es muy buena gente.", en: "My aunt is a really nice person." }
  ],
  rule: "Start with who they are, then zoom in. Three verbs share the work:\n*es* for what they are like: *Es alto. Es muy simpática.*\n*tiene* for what they have: *Tiene el pelo largo. Tiene los ojos verdes.*\n*lleva* for what they have on today: *Lleva una chaqueta roja.*\nHair and eyes take *el* and *los*, not his or her: *tiene los ojos azules*.\nColours and other describing words go after the thing: *una camiseta blanca*.\nHair is *largo* or *corto*, *liso* or *crespo*; in Colombia blond is *mono*.\nFor someone's character, Colombians say *Es muy buena gente*: a really nice person.",
  readAndPick: [
    { q: "Is this about today, or always?", es: "Lleva una chaqueta azul.",
      options: ["Today", "Always", "Every workday"], answer: 0,
      why: "*Lleva*: what she has on now. It could change tomorrow." },
    { q: "What does Diego tell you about his brother?", es: "Tiene los ojos verdes.",
      options: ["His eye colour", "He wears green glasses", "He likes green"], answer: 0,
      why: "*Tiene los ojos verdes*: he has green eyes." },
    { q: "What kind of person is Carlos?", es: "Carlos es muy buena gente.",
      options: ["A kind person", "A popular person", "A very good worker"], answer: 0,
      why: "*Buena gente*: a good, kind person. It's about one person, not a crowd." },
    { q: "Who is being described?", es: "Es alto y tiene el pelo largo.",
      options: ["A man", "A woman", "We can't tell"], answer: 0,
      why: "*Alto*: a man. For a woman, *alta*." },
    { q: "What does Ana have on?", es: "Lleva una camisa blanca y unos zapatos negros.",
      options: ["A white shirt, black shoes", "A black shirt, white shoes", "A white dress, black shoes"], answer: 0,
      why: "The colour comes after the thing: *camisa blanca*, *zapatos negros*." }
  ],
  yourTurn: [
    { en: "He's tall and has short hair.", es: "Es alto y tiene el pelo corto.", accept: [] },
    { en: "She has blue eyes.", es: "Tiene los ojos azules.", accept: ["Tiene ojos azules."] },
    { en: "Today she's wearing a red jacket.", es: "Hoy lleva una chaqueta roja.", accept: [] },
    { en: "My aunt is a really nice person.", es: "Mi tía es muy buena gente.", accept: ["Mi tía es muy buena persona."] }
  ],
  personal: {
    prompt: "Describe someone you will see this week so a stranger could find them: what they are like, what they have, and what they usually wear.",
    constraints: [
      { type: "regex", pattern: "\\bes\\b", label: "what they are like, with *es*" },
      { type: "regex", pattern: "\\btiene\\b", label: "what they have, with *tiene*" },
      { type: "regex", pattern: "\\blleva\\b", label: "what they wear, with *lleva*" }
    ],
    model: "Mi jefe es alto y muy simpático. Tiene el pelo gris y siempre lleva una chaqueta negra."
  },
  pitfalls: [
    "*Tiene sus ojos verdes* says whose twice: *tiene los ojos verdes*.",
    "*Es el pelo largo* is a slip: hair is something she has, *tiene el pelo largo*.",
    "*Una roja chaqueta* follows English: the colour comes after, *una chaqueta roja*."
  ]
},

"gn-describir-objeto-a1": {
  source: "old",
  hook: {
    line: "You need a bottle opener and have no idea of the word. Say what it is like, what it is made of and what it is for, and someone will hand it to you.",
    es: "Busco una cosa pequeña, de metal. Sirve para abrir botellas.\n¡Ah, un destapador! Aquí tiene.",
    en: "I'm looking for a small metal thing. It's for opening bottles.\nOh, a bottle opener! Here you are."
  },
  examples: [
    { es: "La mesa es de madera y es muy grande.", en: "The table is made of wood and it's very big." },
    { es: "Es un celular pequeño y cuesta ochocientos mil pesos.", en: "It's a small phone and it costs eight hundred thousand pesos." },
    { es: "Esta bolsa es para el mercado.", en: "This bag is for the market." }
  ],
  rule: "Start with what it is, then add detail:\nWhat it is: *Es una mesa. Es un celular.*\nWhat it is like: *Es grande. Es nuevo. Es muy bonito.*\nWhat it is made of, with *ser de*: *Es de madera. Es de plástico.*\nWhat colour: *Es rojo*, or *Es de color rojo*.\nWhat it is for: *Es para* or *Sirve para*, then the dictionary form: *Sirve para abrir botellas.*\nWhat it costs: *Cuesta cien mil pesos.*\nIf you don't know the word, describe around it: *Es una cosa pequeña, de metal. Sirve para…*",
  readAndPick: [
    { q: "What is the table made of?", es: "Es una mesa de vidrio.",
      options: ["Glass", "Wood", "Metal"], answer: 0,
      why: "*De vidrio*: made of glass." },
    { q: "What is it for?", es: "Sirve para cortar pan.",
      options: ["Cutting bread", "Buying bread", "Keeping bread fresh"], answer: 0,
      why: "*Sirve para* plus a verb: what it is for." },
    { q: "Is this about what it's made of, or its colour?", es: "Es de color café.",
      options: ["Its colour", "What it's made of", "Where it's from"], answer: 0,
      why: "*De color*: its colour, and in Colombia *café* is brown." },
    { q: "Laura doesn't know a word. What is she describing?", es: "Es una cosa para abrir la puerta.",
      options: ["A key", "A door", "A window"], answer: 0,
      why: "*Es una cosa para…*: a thing for opening the door, a key." },
    { q: "Is the lamp new?", es: "La lámpara es vieja, pero funciona.",
      options: ["No, but it works", "Yes, and it works", "No, and it's broken"], answer: 0,
      why: "*Vieja*: old. *Pero funciona*: but it works." }
  ],
  yourTurn: [
    { en: "The table is made of wood.", es: "La mesa es de madera.", accept: [] },
    { en: "It's for opening bottles.", es: "Sirve para abrir botellas.", accept: ["Es para abrir botellas."] },
    { en: "It's a small, cheap phone.", es: "Es un celular pequeño y barato.", accept: [] },
    { en: "It's a thing for cutting bread.", es: "Es una cosa para cortar pan.", accept: ["Es una cosa para cortar el pan."] }
  ],
  personal: {
    prompt: "Pick one thing on your table and describe it without its name, so someone could find it: what it is like, what it is made of, and what it is for.",
    constraints: [
      { type: "regex", pattern: "\\bes de\\b", label: "what it is made of, with *es de*" },
      { type: "containsAny", words: ["sirve para", "es para"], label: "what it is for, with *sirve para* or *es para*" }
    ],
    model: "Es pequeño y es de plástico. Sirve para escribir."
  },
  pitfalls: [
    "*Es madera* names the stuff; for made of, *es de madera*.",
    "After *para*, the dictionary form: *sirve para abrir*, never *sirve para abre*.",
    "Don't know the word? *Es una cosa para…* will get you there."
  ]
},

"task-describir": {
  source: "old",
  hook: {
    line: "Pick someone everybody knows and describe them without the name. The others guess, and every ending you get right is a clue.",
    es: "Es alta y tiene el pelo largo.\nSiempre lleva un sombrero.\nEstá al lado de la ventana.\n¿Es la profesora?\n¡Sí!",
    en: "She's tall and has long hair.\nShe always wears a hat.\nShe's next to the window.\nIs it the teacher?\nYes!"
  },
  examples: [
    { es: "Su mochila es negra y sus zapatos son rojos.", en: "Her backpack is black and her shoes are red." },
    { es: "Es muy buena gente, pero un poco tímido.", en: "He's a really nice person, but a bit shy." }
  ],
  rule: "Six sentences, no name. Cover four things:\nwhat they look like: *Es alta. Tiene el pelo largo.*\nwhat they are like: *Es muy buena gente. Es un poco tímida.*\nsomething they own or wear: *Su carro es rojo. Lleva una gorra.*\nwhere they are: *Está al lado de la ventana.*\nEvery ending matches the person: *alta, simpática, tímida* for a woman. *Su* and *sus* follow the things: *sus zapatos son rojos*.\nWhere someone is takes *está*; what they are like takes *es*.\nThen the guess: *¿Es Laura? No. ¿Es la profesora? ¡Sí!*",
  readAndPick: [
    { q: "Is this about where Diego is, or what he is like?", es: "Está en la cocina.",
      options: ["Where he is", "What he's like", "What he's wearing"], answer: 0,
      why: "*Está* plus a place: where he is." },
    { q: "Which things are red?", es: "Su mochila es negra y sus zapatos son rojos.",
      options: ["The shoes", "The backpack", "Both"], answer: 0,
      why: "*Sus zapatos son rojos*; the backpack, *su mochila*, is black." },
    { q: "Who is being described?", es: "Es alto, tiene barba y es muy simpático.",
      options: ["A man", "A woman", "Two people"], answer: 0,
      why: "*Alto* and *simpático*: a man." },
    { q: "What does this clue say?", es: "Siempre lleva una gorra.",
      options: ["He always wears a cap", "He has a cap at home", "He sometimes wears a cap"], answer: 0,
      why: "*Lleva*: wears. *Siempre*: always." }
  ],
  yourTurn: [
    { en: "She's tall and has long hair.", es: "Es alta y tiene el pelo largo.", accept: [] },
    { en: "Her shoes are red.", es: "Sus zapatos son rojos.", accept: [] },
    { en: "He's next to the window.", es: "Está al lado de la ventana.", accept: [] },
    { en: "Is it the teacher? (a woman)", es: "¿Es la profesora?", accept: [] }
  ],
  personal: {
    prompt: "Describe someone everyone in your life knows, without the name: how they look, what they are like, something they wear, and where they usually are.",
    constraints: [
      { type: "regex", pattern: "\\btiene\\b", label: "how they look, with *tiene*" },
      { type: "regex", pattern: "\\bes\\b", label: "what they are like, with *es*" },
      { type: "regex", pattern: "\\blleva\\b|\\bsus?\\s", label: "something they wear or own: *lleva*, *su*" },
      { type: "regex", pattern: "\\best[aá](?![a-záéíóúñ])", label: "where they usually are, with *está*" }
    ],
    model: "Es bajita y tiene el pelo blanco. Es muy buena gente. Siempre lleva un sombrero y está en la panadería en la mañana."
  },
  pitfalls: [
    "*Es al lado de la ventana* is a slip: where someone is takes *está*.",
    "*Su zapatos* is a slip: more than one thing, *sus zapatos*.",
    "*Lleva* is for what they have on; *tiene* is for what stays: *el pelo largo, los ojos verdes*."
  ]
},

/* ---- unit 8 · Where things are ----------------------------------------- */

"nt-localizacion-a1": {
  source: "merged",
  hook: {
    line: "Ask where something is and the answer is usually a landmark: next to the bakery, opposite the church. In Spanish each of those is a position word, then *de*.",
    es: "Perdón, ¿dónde queda la droguería?\nQueda cerquita, al lado de la panadería.",
    en: "Excuse me, where's the pharmacy?\nIt's really close, next to the bakery."
  },
  examples: [
    { es: "El banco está enfrente del parque.", en: "The bank is opposite the park." },
    { es: "Mi casa está cerca de la estación.", en: "My house is near the station." },
    { es: "Las llaves están encima de la mesa.", en: "The keys are on the table." }
  ],
  rule: "Where something is takes *estar*: *El banco está en el centro. ¿Dónde está la estación?*\nIn Colombia you also hear *quedar*: *¿Dónde queda el banco? Queda cerquita*, it's really close.\nPosition words take *de* before the landmark:\n*cerca de, lejos de*: near, far from\n*al lado de*: next to\n*enfrente de*: opposite\n*delante de, detrás de*: in front of, behind\n*encima de, debajo de*: on top of, under\n*De* and *el* join: *al lado del banco*, but *al lado de la tienda*.\n*Entre* takes no *de*: *entre el banco y la iglesia*.\nWith no landmark, the *de* goes: *Está cerca.*",
  readAndPick: [
    { q: "Where is the bank?", es: "El banco está detrás de la iglesia.",
      options: ["Behind the church", "In front of the church", "Next to the church"], answer: 0,
      why: "*Detrás de*: behind." },
    { q: "How far is it?", es: "Queda cerquita.",
      options: ["Very close", "Quite far", "Two blocks left"], answer: 0,
      why: "*Cerquita*: really close. *Queda* here means the same as *está*." },
    { q: "Where are the keys?", es: "Las llaves están debajo de la cama.",
      options: ["Under the bed", "On the bed", "Beside the bed"], answer: 0,
      why: "*Debajo de*: under." },
    { q: "Where is the café?", es: "El café está entre el banco y la droguería.",
      options: ["Between the two", "Next to the bank only", "Opposite the bank"], answer: 0,
      why: "*Entre… y…*: between two things." },
    { q: "Where does Laura live?", es: "Vivo lejos del centro.",
      options: ["Far from downtown", "Downtown", "Near downtown"], answer: 0,
      why: "*Lejos de*: far from. *De* and *el* make *del*." }
  ],
  yourTurn: [
    { en: "Where's the station?", es: "¿Dónde está la estación?", accept: ["¿Dónde queda la estación?"] },
    { en: "The bank is next to the park.", es: "El banco está al lado del parque.", accept: ["El banco queda al lado del parque."] },
    { en: "My house is near the station.", es: "Mi casa está cerca de la estación.", accept: ["Mi casa queda cerca de la estación."] },
    { en: "The keys are on the table.", es: "Las llaves están encima de la mesa.", accept: ["Las llaves están en la mesa.", "Las llaves están sobre la mesa."] },
    { en: "The café is between the bank and the church.", es: "El café está entre el banco y la iglesia.", accept: ["El café queda entre el banco y la iglesia."] }
  ],
  personal: {
    prompt: "Where is your home, or your favourite café? Say where it is with *está* or *queda*, and give a landmark with *de*.",
    constraints: [
      { type: "regex", pattern: "\\best[aá](?![a-záéíóúñ])|\\bqueda\\b", label: "where it is: *está* or *queda*" },
      { type: "regex", pattern: "\\b(cerca|cerquita|lejos|al lado|enfrente|delante|detr[aá]s|encima|debajo|al final) del?\\b|\\bentre\\b", label: "a landmark: *cerca de*, *al lado de*…" }
    ],
    model: "Mi café favorito queda cerquita de mi casa, al lado del parque."
  },
  pitfalls: [
    "*El banco es en el centro* is a slip: where a thing is takes *está*.",
    "*Cerca la estación* drops a word: *cerca de la estación*.",
    "*Al lado de el parque* is a slip: *de* and *el* join, *al lado del parque*."
  ]
},

"dc-deixis-espacial-a1": {
  source: "merged",
  hook: {
    line: "On the phone, here and there swap places: my *aquí* is your *allá*. Spanish has three words for where, and the middle one, like *ese*, is about the person you are talking to.",
    es: "¿Dónde estás?\nAquí, en la oficina. ¿Vienes?\nSí, ya voy.",
    en: "Where are you?\nHere, at the office. Are you coming?\nYes, I'm on my way."
  },
  examples: [
    { es: "Ahí tienes el periódico, al lado de tu taza.", en: "There's the paper, next to your cup." },
    { es: "¿Ves aquella casa? Allá vive mi abuela.", en: "See that house over there? My grandmother lives there." },
    { es: "¿Dónde trabaja tu hermano?", en: "Where does your brother work?" }
  ],
  rule: "Three words for where, like *este, ese, aquel*:\n*aquí*: here, where I am\n*ahí*: there, where you are\n*allí* or *allá*: over there, away from both of us\nIn Colombia *acá* is common for here: *Ven acá.*\nThey move with the speaker: on the phone, my *aquí* is your *allá*.\n*Venir* is coming to where the speaker is; *ir* is going anywhere else: *¿Vienes a mi casa? Voy a tu casa.*\nIn a question, the person goes after the verb, and there is no do: *¿Dónde vive Laura?*\nIn the answer, the new part comes last: *¿Quién llega a las siete? Llega Diego.*",
  readAndPick: [
    { q: "Who is at the door?", es: "Estoy aquí, en la puerta.",
      options: ["The speaker", "The listener", "Someone else"], answer: 0,
      why: "*Aquí*: where I am, the speaker." },
    { q: "Laura is on the sofa. Diego says this. Where are the keys?", es: "Las llaves están ahí, a tu lado.",
      options: ["Next to Laura", "Next to Diego", "In another room"], answer: 0,
      why: "*Ahí*: there, where you are. *A tu lado*: next to you." },
    { q: "Where does Ana's grandmother live?", es: "Mi abuela vive allá, en el campo.",
      options: ["Far from both of them", "Right here", "Near the listener"], answer: 0,
      why: "*Allá*: over there, away from both." },
    { q: "Laura is at home. What is she asking?", es: "¿Vienes a mi casa?",
      options: ["If you're coming over", "If you're going home", "If you live with her"], answer: 0,
      why: "*Venir*: toward the speaker. She is at home, so it's her house." },
    { q: "Diego is in Cali. Laura calls him from Bogotá. What does she ask?", es: "¿Qué tal el clima allá?",
      options: ["How the weather is in Cali", "How the weather is in Bogotá", "What tomorrow's weather is"], answer: 0,
      why: "*Allá*: there, where Diego is, far from her." }
  ],
  yourTurn: [
    { en: "I'm here, at the office.", es: "Estoy aquí, en la oficina.", accept: ["Estoy acá, en la oficina."] },
    { en: "The keys are there, next to you. (to a friend)", es: "Las llaves están ahí, a tu lado.", accept: [] },
    { en: "Are you coming to my house? (to a friend)", es: "¿Vienes a mi casa?", accept: [] },
    { en: "Where does your brother work? (to a friend)", es: "¿Dónde trabaja tu hermano?", accept: [] },
    { en: "My grandmother lives over there.", es: "Mi abuela vive allá.", accept: ["Mi abuela vive allí."] }
  ],
  personal: {
    prompt: "You are on the phone with a friend in another city. Tell them where you are now, and ask what it is like where they are.",
    constraints: [
      { type: "containsAny", words: ["aquí", "acá"], label: "where you are: *aquí* or *acá*" },
      { type: "containsAny", words: ["allá", "allí", "ahí"], label: "where they are: *allá* or *allí*" },
      { type: "question", label: "a question, with *¿* and *?*" }
    ],
    model: "Estoy aquí en casa, en Toronto. ¿Qué tal todo allá?"
  },
  pitfalls: [
    "*Ahí* is near the person you're talking to; for far from both of you, *allí* or *allá*.",
    "*¿Vas a mi casa?* sounds odd: toward the speaker is *venir*, *¿Vienes a mi casa?*",
    "*¿Dónde tu hermano trabaja?* follows English: the verb comes first, *¿Dónde trabaja tu hermano?*"
  ]
},

"nt-movimiento-estabilidad-a1": {
  source: "merged",
  hook: {
    line: "Someone stops you in the street and asks for the bank, two blocks away. Spanish gives directions with three fixed phrases, and one trap: *derecho* is straight on, not right.",
    es: "Perdón, ¿dónde queda el banco?\nSigues derecho dos cuadras y volteas a la derecha.",
    en: "Excuse me, where's the bank?\nYou go straight on two blocks and turn right."
  },
  examples: [
    { es: "¿Vienes conmigo al cine?\nSí, ya voy.", en: "Are you coming to the cinema with me?\nYes, I'm coming." },
    { es: "Voy al trabajo en bus, pero vuelvo a pie.", en: "I go to work by bus, but I come back on foot." },
    { es: "Es la segunda calle a la izquierda.", en: "It's the second street on the left." }
  ],
  rule: "*Ir* to a place, *venir* to where the speaker is: *Voy al centro. ¿Vienes a la fiesta?*\nWhen someone calls you: *¡Ya voy!*, I'm coming. *Ya vengo* means I'll be right back.\nHow you go: *a pie*, on foot; *en carro, en bus, en metro*.\nDirections:\n*derecho*, or *todo derecho*: straight on. *Todo recto* is understood too.\n*a la derecha, a la izquierda*: on the right, on the left\n*la segunda calle a la derecha*\n*Sigues derecho dos cuadras y volteas a la izquierda.* You go straight on two blocks and turn left.\nCareful: *derecho* is straight on, *a la derecha* is right.",
  readAndPick: [
    { q: "Which way does the woman send you?", es: "Sigues todo derecho.",
      options: ["Straight on", "To the right", "Back the way you came"], answer: 0,
      why: "*Derecho*: straight on. Right is *a la derecha*." },
    { q: "Laura calls from the kitchen. Diego answers this. What does he mean?", es: "¡Ya voy!",
      options: ["I'm coming", "I'll be right back", "I'm going out"], answer: 0,
      why: "*Ya voy*: on my way to you. *Ya vengo* is I'll be right back." },
    { q: "How does Ana get to work?", es: "Voy al trabajo a pie.",
      options: ["On foot", "By bus", "By car"], answer: 0,
      why: "*A pie*: on foot." },
    { q: "Where is the party?", es: "¿Vienes a mi fiesta el sábado?",
      options: ["At the speaker's", "At the listener's", "At a friend's place"], answer: 0,
      why: "*Venir*: to where the speaker is. It's her party." },
    { q: "Which street is it?", es: "Es la tercera calle a la izquierda.",
      options: ["The third on the left", "The third on the right", "Three streets ahead"], answer: 0,
      why: "*Tercera*: third. *Izquierda*: left." }
  ],
  yourTurn: [
    { en: "Are you coming to my party? (to a friend)", es: "¿Vienes a mi fiesta?", accept: [] },
    { en: "Someone calls you. Say: I'm coming!", es: "¡Ya voy!", accept: [] },
    { en: "I go to work on foot.", es: "Voy al trabajo a pie.", accept: ["Voy a pie al trabajo."] },
    { en: "You go straight on two blocks. (to a friend)", es: "Sigues derecho dos cuadras.", accept: ["Sigues todo [derecho|recto] dos cuadras.", "Sigue derecho dos cuadras."] },
    { en: "It's the second street on the right.", es: "Es la segunda calle a la derecha.", accept: [] }
  ],
  personal: {
    prompt: "Give a friend real directions from your door to the nearest shop or café, in two or three steps.",
    constraints: [
      { type: "containsAny", words: ["derecho", "recto"], label: "straight on: *derecho*" },
      { type: "regex", pattern: "a la (derecha|izquierda)", label: "a turn: *a la derecha* or *a la izquierda*" },
      { type: "containsAny", words: ["cuadra", "calle", "esquina"], label: "a block, a street or a corner" }
    ],
    model: "Sales de mi casa, sigues derecho una cuadra y volteas a la izquierda. La panadería está en la esquina."
  },
  pitfalls: [
    "*Derecho* is straight on; right is *a la derecha*.",
    "*¡Ya vengo!* when someone calls you means I'll be right back: say *¡Ya voy!*",
    "*En pie* is a slip: on foot is *a pie*, by car *en carro*."
  ]
},

"gn-describir-lugar-a1": {
  source: "merged",
  hook: {
    line: "Describing a place is a list with a frame around it: what it is like, what there is, and where things are. Three verbs do it, and the tricky pair is *hay* and *está*.",
    es: "Mi apartamento es pequeño, pero bonito.\nHay una cocina, un baño y dos cuartos.\nLa cocina está al lado de la sala.",
    en: "My apartment is small, but nice.\nThere's a kitchen, a bathroom and two bedrooms.\nThe kitchen is next to the living room."
  },
  examples: [
    { es: "El parque es muy tranquilo. Hay muchos árboles y un lago pequeño.", en: "The park is very peaceful. There are lots of trees and a small lake." },
    { es: "¿Hay un baño por aquí?\nSí, el baño está al fondo.", en: "Is there a bathroom around here?\nYes, the bathroom is at the back." }
  ],
  rule: "First the place and what it is like, with *es*: *Mi barrio es tranquilo.*\nThen what is in it, with *hay*: *Hay un parque, dos panaderías y muchos árboles.*\nThen where things are, with *está* or *están*: *El parque está al lado de mi casa.*\nThe test is the word after: *un, una*, a number, *mucho* or nothing takes *hay*; *el, la, mi* or a name takes *está*.\n*Hay* never changes: *hay un baño, hay dos baños*.\nTo ask: *¿Qué hay en tu barrio? ¿Dónde está el baño?*",
  readAndPick: [
    { q: "Does Diego know there is a bathroom?", es: "¿Hay un baño por aquí?",
      options: ["No, he's asking", "Yes, he knows", "He's looking for a kitchen"], answer: 0,
      why: "*¿Hay…?* asks whether one exists. *¿Dónde está el baño?* takes it for granted." },
    { q: "Does Ana know there is a bathroom?", es: "¿Dónde está el baño?",
      options: ["Yes, she asks where", "No, she asks if", "She's in it now"], answer: 0,
      why: "*Está* with *el*: a bathroom she knows is there." },
    { q: "What is the neighbourhood like?", es: "Mi barrio es tranquilo, pero no hay mucho que hacer.",
      options: ["Quiet, not much to do", "Noisy, lots to do", "Quiet, full of shops"], answer: 0,
      why: "*Es tranquilo*: what it is like. *No hay mucho*: there isn't much." },
    { q: "Where is the kitchen?", es: "La cocina está al lado de la sala.",
      options: ["Next to the living room", "In the living room", "Across from the living room"], answer: 0,
      why: "*Al lado de*: next to." },
    { q: "Is there a lift in Laura's building?", es: "En mi edificio no hay ascensor.",
      options: ["No, there isn't", "Yes, a small one", "It's out of order"], answer: 0,
      why: "*No hay*: there isn't one." }
  ],
  yourTurn: [
    { en: "My neighbourhood is very quiet.", es: "Mi barrio es muy tranquilo.", accept: [] },
    { en: "There are two bedrooms and a bathroom.", es: "Hay dos cuartos y un baño.", accept: ["Hay dos habitaciones y un baño."] },
    { en: "Where's the bathroom?", es: "¿Dónde está el baño?", accept: [] },
    { en: "Is there a park around here?", es: "¿Hay un parque por aquí?", accept: ["¿Hay un parque por acá?"] },
    { en: "The park is next to my house.", es: "El parque está al lado de mi casa.", accept: ["El parque queda al lado de mi casa."] }
  ],
  personal: {
    prompt: "Describe your home or your street in three lines: what it is like, what there is, and where one thing is.",
    constraints: [
      { type: "regex", pattern: "\\bes\\b", label: "what it is like, with *es*" },
      { type: "regex", pattern: "\\bhay\\b", label: "what there is, with *hay*" },
      { type: "regex", pattern: "\\best[aá]n?(?![a-záéíóúñ])", label: "where one thing is, with *está*" }
    ],
    model: "Mi calle es tranquila. Hay una panadería y un parque pequeño. El parque está enfrente de mi casa."
  },
  pitfalls: [
    "*Hay el baño* is a slip: a bathroom you know about takes *está*, *el baño está al fondo*.",
    "*Están dos cuartos* for there are is a slip: *hay dos cuartos*.",
    "*Mi casa hay dos cuartos* mixes two ways: *En mi casa hay…* or *Mi casa tiene…*"
  ]
},

"task-direcciones": {
  source: "old",
  hook: {
    line: "This is the first time location words have to be exactly right: say left instead of right, and your visitor ends up in the wrong street.",
    es: "Perdón, ¿hay un cajero por aquí?\nSí, hay uno en la esquina. Sigues derecho y está enfrente del parque.",
    en: "Excuse me, is there a cash machine around here?\nYes, there's one on the corner. You go straight on and it's opposite the park."
  },
  examples: [
    { es: "Sales de la estación y volteas a la izquierda.", en: "You come out of the station and turn left." },
    { es: "Después sigues derecho hasta el semáforo.", en: "Then you go straight on as far as the lights." },
    { es: "La droguería está al lado del banco.", en: "The pharmacy is next to the bank." }
  ],
  rule: "The first question decides the conversation:\nNot sure one exists: *¿Hay un cajero por aquí?*\nSure it exists: *¿Dónde está el banco?* or *¿Dónde queda?*\nThen the steps, in order:\n*Sales de aquí*: you leave here\n*Sigues derecho dos cuadras*: you go straight on two blocks\n*Volteas a la derecha*: you turn right\n*en la esquina, en el semáforo*: at the corner, at the lights\n*hasta el parque*: as far as the park\n*Está enfrente del parque*: it's opposite the park\nJoin the steps with *y* and *después*. Then check *derecha* and *izquierda* twice.",
  readAndPick: [
    { q: "Does the tourist know there is a cash machine?", es: "¿Hay un cajero por aquí?",
      options: ["No, he isn't sure", "Yes, he knows where", "Yes, it's his bank"], answer: 0,
      why: "*¿Hay…?* asks whether there is one at all." },
    { q: "What should you do at the lights?", es: "En el semáforo volteas a la izquierda.",
      options: ["Turn left", "Turn right", "Keep straight on"], answer: 0,
      why: "*Volteas a la izquierda*: you turn left." },
    { q: "How far do you go?", es: "Sigues derecho hasta la iglesia.",
      options: ["Up to the church", "Past the church", "Away from the church"], answer: 0,
      why: "*Hasta*: as far as." },
    { q: "Where is the pharmacy?", es: "Está enfrente del parque.",
      options: ["Across from the park", "Inside the park", "Behind the park"], answer: 0,
      why: "*Enfrente de*: opposite." }
  ],
  yourTurn: [
    { en: "Excuse me, is there a cash machine around here?", es: "Perdón, ¿hay un cajero por aquí?", accept: ["[Perdón|Disculpe], ¿hay un cajero (automático) por [aquí|acá]?"] },
    { en: "You go straight on as far as the lights.", es: "Sigues derecho hasta el semáforo.", accept: ["Sigues todo [derecho|recto] hasta el semáforo.", "Sigue derecho hasta el semáforo."] },
    { en: "Then you turn left.", es: "Después volteas a la izquierda.", accept: ["[Después|Luego] [volteas|giras|doblas] a la izquierda."] },
    { en: "It's opposite the park.", es: "Está enfrente del parque.", accept: ["Queda enfrente del parque."] }
  ],
  personal: {
    prompt: "Write real directions from where you are to somewhere nearby, in three or four steps, for a visitor.",
    constraints: [
      { type: "containsAny", words: ["derecho", "recto"], label: "straight on: *derecho*" },
      { type: "regex", pattern: "a la (derecha|izquierda)", label: "a turn: *a la derecha* or *a la izquierda*" },
      { type: "regex", pattern: "\\best[aá](?![a-záéíóúñ])|\\bqueda\\b", label: "where it is at the end: *está* or *queda*" },
      { type: "regex", pattern: "\\b(y|despu[eé]s|luego)\\b", label: "the steps joined with *y* or *después*" }
    ],
    model: "Sales de mi edificio y volteas a la derecha. Después sigues derecho dos cuadras. El café está en la esquina, enfrente de la iglesia."
  },
  pitfalls: [
    "*¿Dónde hay el banco?* mixes the two: *¿Hay un banco por aquí?* or *¿Dónde está el banco?*",
    "*Es enfrente del parque* is a slip: where it is takes *está*.",
    "*Derecho* is straight on, *a la derecha* is right: say them slowly and check."
  ]
},

/* ---- unit a2-u14 · Tell me what happened (in the A1 band, after unit 6) - */

"preterito": {
  source: "merged",
  hook: {
    line: "Every Monday someone asks about your weekend, and the honest answer is in the past. Spanish says what you did with the ending alone: no did, no helper word.",
    es: "¿Qué hiciste el fin de semana?\nEl sábado trabajé y el domingo fui a la casa de mi abuela.",
    en: "What did you do at the weekend?\nOn Saturday I worked and on Sunday I went to my grandmother's."
  },
  examples: [
    { es: "Ayer trabajé hasta las nueve.", en: "Yesterday I worked until nine." },
    { es: "Anoche Laura comió en casa y Diego salió con unos amigos.", en: "Last night Laura ate at home and Diego went out with some friends." },
    { es: "¿Fuiste a la fiesta?\nNo, estuve en casa.", en: "Did you go to the party?\nNo, I was at home." }
  ],
  rule: "For something finished, Spanish changes the ending. There is no did: *¿Trabajaste ayer?* Did you work yesterday?\n*-ar*: *trabajé, trabajaste, trabajó, trabajamos, trabajaron*\n*-er* and *-ir* share one set: *comí, comiste, comió, comimos, comieron*; *salí, salió, salieron*\nThe mark matters: *trabajo* is I work, *trabajó* is she worked.\n*Trabajamos* and *salimos* look the same as today's, so *ayer* or *anoche* tells you when.\nFour busy verbs are learned as whole words:\n*ir*: *fui, fuiste, fue, fuimos, fueron*. *Ser* uses the very same words: *Fue difícil.* It was hard.\n*hacer*: *hice, hiciste, hizo*\n*tener*: *tuve, tuvo*. *estar*: *estuve, estuvo*\nIn Latin America this is the past for anything finished, even earlier today: *Hoy trabajé mucho.*",
  readAndPick: [
    { q: "When did Laura work?", es: "Laura trabajó el sábado.",
      options: ["Last Saturday", "On Saturdays", "This coming Saturday"], answer: 0,
      why: "*Trabajó*, with the mark on the end: she worked, and it is done." },
    { q: "Who went out last night?", es: "Anoche salí con Diego.",
      options: ["The speaker, with Diego", "Diego, on his own", "Nobody, they both stayed home"], answer: 0,
      why: "*Salí*: I went out. For *-er* and *-ir* verbs, I ends in *-í*." },
    { q: "Is this about today or about the past?", es: "Comimos en casa.",
      options: ["The past", "Today", "Tomorrow night"], answer: 0,
      why: "*Comimos* is the past; today it would be *comemos*." },
    { q: "What does Ana want to know?", es: "¿Qué hiciste anoche?",
      options: ["What you did last night", "What you do at night", "What you're doing tonight"], answer: 0,
      why: "*Hiciste*: you did. *Hacer* changes completely in the past: *hice, hiciste, hizo*." },
    { q: "Where did Sam go?", es: "Fui al cine con Laura. Fue muy divertido.",
      options: ["To the cinema", "To Laura's place", "Nowhere, he stayed in"], answer: 0,
      why: "*Fui al cine*: I went. *Fue divertido*: it was fun. The same words do both jobs." },
    { q: "When is Diego talking about?", es: "Hoy trabajé mucho.",
      options: ["Earlier today", "Every day", "Later on tonight"], answer: 0,
      why: "*Trabajé* is finished. In Latin America this past covers earlier today too." }
  ],
  yourTurn: [
    { en: "Yesterday I worked until nine.", es: "Ayer trabajé hasta las nueve.", accept: ["Trabajé hasta las nueve ayer."] },
    { en: "Did you go out last night? (to a friend)", es: "¿Saliste anoche?", accept: ["¿Anoche saliste?"] },
    { en: "What did you do on Saturday? (to a friend)", es: "¿Qué hiciste el sábado?", accept: ["El sábado, ¿qué hiciste?"] },
    { en: "On Sunday we went to the market.", es: "El domingo fuimos al mercado.", accept: ["Fuimos al mercado el domingo."] },
    { en: "I was at home all day.", es: "Estuve en casa todo el día.", accept: ["Estuve todo el día en casa.", "Estuve en la casa todo el día."] }
  ],
  personal: {
    prompt: "What did you do last weekend? Write two or three true lines: where you went, and one thing you did.",
    constraints: [
      { type: "anyVerbInTense", tense: "preterito", label: "a verb in the past: *trabajé*, *comí*, *fui*…" },
      { type: "containsAny", words: ["el sábado", "el domingo", "el fin de semana", "ayer", "anoche"], label: "when: *el sábado*, *el domingo*, *ayer*…" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "El sábado trabajé en la mañana. En la tarde fui al parque con mi hermana y el domingo descansé en casa."
  },
  pitfalls: [
    "*Yo fue* is a slip: *fue* is he, she or it. For I, it's *fui*: *Fui al mercado.*",
    "*Hició* is a slip: *hacer* changes completely, *hice, hiciste, hizo*.",
    "*Llegué tarde*: *llegar* adds a *u* for I, to keep its sound. *Busqué* does the same."
  ]
},

"dc-deixis-temporal-a2": {
  source: "merged",
  hook: {
    line: "Ten things you did yesterday, one after another, sound like a shopping list. Four small words put them in order and turn them into a story your friend can follow.",
    es: "Primero desayuné en casa.\nLuego fui al trabajo en bus.\nDespués de trabajar, salí con Laura.\nAl final llegué a casa a las once.",
    en: "First I had breakfast at home.\nThen I went to work by bus.\nAfter work, I went out with Laura.\nIn the end I got home at eleven."
  },
  examples: [
    { es: "Antes de salir, llamo a mi mamá.", en: "Before going out, I call my mum." },
    { es: "Fuimos a Cartagena en diciembre. Allí vive mi hermano.", en: "We went to Cartagena in December. My brother lives there." },
    { es: "¿Y entonces qué hiciste?\nEntonces llamé a Diego.", en: "And then what did you do?\nSo I called Diego." }
  ],
  rule: "A story needs a clock. *Ayer*, *anoche* and *el sábado* place it, counting from today.\nThen the steps, in order:\n*primero*: first\n*luego* or *después*: then\n*entonces*: so then, at that point\n*al final*: in the end\nTo tie one event to another, *antes de* or *después de*, then a thing or the dictionary form of a verb: *antes de la clase*, *después de comer*.\nEnglish says after eating; Spanish never uses an *-ando* form here, and never drops the *de*.\nOnce a place is named, *allí* stands in for it: *Fui a Cali. Allí vive mi hermana.*\nSomething new takes *un*; the next time, *el*: *Vimos una película. La película duró tres horas.*",
  readAndPick: [
    { q: "What did Sam do first?", es: "Primero compré pan y luego fui al parque.",
      options: ["Bought bread", "Went to the park", "Ate in the park"], answer: 0,
      why: "*Primero*: first. *Luego* brings in what came next." },
    { q: "When did Laura call?", es: "Laura llamó después de cenar.",
      options: ["After dinner", "Before dinner", "During dinner"], answer: 0,
      why: "*Después de cenar*: after having dinner." },
    { q: "Where does Ana's brother live?", es: "Fui a Medellín en enero. Allí vive mi hermano.",
      options: ["In Medellín", "Next door to Ana", "Nobody knows"], answer: 0,
      why: "*Allí* stands in for the place just named: Medellín." },
    { q: "How did the evening end?", es: "Al final cenamos en casa de Diego.",
      options: ["Dinner at Diego's", "A film at the cinema", "A walk home"], answer: 0,
      why: "*Al final*: in the end. *En casa de Diego*: at Diego's." },
    { q: "Diego says this on a Tuesday. Which day is he talking about?", es: "Ayer no fui a clase.",
      options: ["Monday", "Tuesday", "Wednesday"], answer: 0,
      why: "*Ayer* counts back from the day you say it: on a Tuesday, it is Monday." }
  ],
  yourTurn: [
    { en: "First I had breakfast and then I went out.", es: "Primero desayuné y luego salí.", accept: ["Primero desayuné y después salí."] },
    { en: "After eating, we went to the park.", es: "Después de comer, fuimos al parque.", accept: ["Después de comer fuimos al parque.", "Fuimos al parque después de comer."] },
    { en: "Before going out, I call my mum.", es: "Antes de salir, llamo a mi mamá.", accept: ["Antes de salir llamo a mi mamá.", "Llamo a mi mamá antes de salir."] },
    { en: "In the end we got home at midnight.", es: "Al final llegamos a casa a medianoche.", accept: ["Al final llegamos a (la) casa a (la) medianoche.", "Al final llegamos a (la) casa a las doce."] },
    { en: "We went to Cali. My sister lives there.", es: "Fuimos a Cali. Allí vive mi hermana.", accept: ["Fuimos a Cali. [Allí|Allá] vive mi hermana.", "Fuimos a Cali. Mi hermana vive [allí|allá]."] }
  ],
  personal: {
    prompt: "Tell yesterday in three steps, in order, with *primero*, then *luego* or *después*, and *al final*.",
    constraints: [
      { type: "containsWord", word: "primero", label: "the first step: *primero*" },
      { type: "containsAny", words: ["luego", "después", "entonces"], label: "the next step: *luego* or *después*" },
      { type: "containsWord", word: "al final", label: "the last step: *al final*" },
      { type: "anyVerbInTense", tense: "preterito", label: "the steps in the past: *fui*, *comí*…" }
    ],
    model: "Primero fui al trabajo. Luego comí con Ana en un restaurante pequeño. Al final vi una película en casa."
  },
  pitfalls: [
    "*Después de comiendo* is a slip: after *de*, the dictionary form, *después de comer*.",
    "*Antes salir* drops a word: *antes de salir*.",
    "*Ayer* and *mañana* count from the day you say them: told a week later, the day has moved."
  ]
},

"nt-expresion-verbal-a2": {
  source: "merged",
  hook: {
    line: "Passing on news is half of conversation: she said, he asked, nobody answered. English uses ask for two jobs; Spanish has a separate verb for each.",
    es: "¿Qué te dijo Diego?\nMe dijo que viene mañana.\nY le pregunté si quiere cenar con nosotros.",
    en: "What did Diego tell you?\nHe told me he's coming tomorrow.\nAnd I asked him if he wants to have dinner with us."
  },
  examples: [
    { es: "Ana pidió la cuenta.", en: "Ana asked for the bill." },
    { es: "¿Te puedo hacer una pregunta?", en: "Can I ask you a question? (to a friend)" },
    { es: "Llamé a Laura, pero no contestó.", en: "I called Laura, but she didn't answer." }
  ],
  rule: "English ask does two jobs; Spanish splits them:\n*preguntar*: ask a question. *Le pregunté la hora.* I asked him the time.\n*pedir*: ask for something. *Le pedí un favor.* I asked him for a favour.\n*contestar*: answer. *No contestó.* She didn't answer.\n*decir*: say or tell. Learn its past as whole words: *dije*, I said; *dijo*, he or she said.\nTo pass on what someone said, add *que*, and never drop it: *Laura dijo que viene a las ocho.*\nFor a yes or no question, *si*: *Le pregunté si hay clase mañana.*\n*Me* is to me; *le* is to him, to her or to *usted*: *me dijo*, *le pregunté*.\n*Pedir* changes in the past: *pidió*, *pidieron*.",
  readAndPick: [
    { q: "What did Sam want from the waiter?", es: "Sam le pidió un vaso de agua.",
      options: ["A glass of water", "The time", "Directions to the bathroom"], answer: 0,
      why: "*Pedir*: ask for a thing. Here, a glass of water." },
    { q: "What did Ana want to know?", es: "Ana me preguntó si hay clase mañana.",
      options: ["If there's class tomorrow", "What your plans are for tomorrow", "To skip class"], answer: 0,
      why: "*Preguntó si*: she asked whether. *Si* brings in a yes or no question." },
    { q: "What did Diego tell Laura?", es: "Diego le dijo que no puede venir.",
      options: ["That he can't come", "To come a bit later", "That he's on his way"], answer: 0,
      why: "*Dijo que*: he said that. *Que* is never dropped." },
    { q: "Did Laura pick up?", es: "Llamé a Laura dos veces, pero no contestó.",
      options: ["No, she didn't", "Yes, the second time", "Yes, but she was busy"], answer: 0,
      why: "*No contestó*: she didn't answer." },
    { q: "Did the speaker ask Diego for an answer, or for a thing?", es: "Le pedí ayuda a Diego.",
      options: ["For a thing: help", "For an answer to a question", "For the time"], answer: 0,
      why: "*Pedí*: I asked for. Help is a thing you ask for, so *pedir*." }
  ],
  yourTurn: [
    { en: "I asked him the time.", es: "Le pregunté la hora.", accept: [] },
    { en: "She asked for the bill.", es: "Pidió la cuenta.", accept: ["Ella pidió la cuenta."] },
    { en: "Laura said she's coming at eight.", es: "Laura dijo que viene a las ocho.", accept: ["Laura dijo que llega a las ocho.", "Laura me dijo que viene a las ocho."] },
    { en: "Can I ask you a question? (to a friend)", es: "¿Te puedo hacer una pregunta?", accept: ["¿Puedo hacerte una pregunta?"] },
    { en: "I asked Diego if he wants to come.", es: "Le pregunté a Diego si quiere venir.", accept: [] }
  ],
  personal: {
    prompt: "Pass on something someone told you this week, with *me dijo que*, and one thing you asked someone, with *le pregunté*.",
    constraints: [
      { type: "regex", pattern: "\\bdij(o|e|eron|iste)\\s+que\\b", label: "what they said: *me dijo que…*" },
      { type: "regex", pattern: "\\bpregunt[eéoó](?![a-záéíóúñ])", label: "what you asked: *le pregunté…*" }
    ],
    model: "Mi hermana me dijo que viene a Bogotá en julio. Le pregunté si necesita algo."
  },
  pitfalls: [
    "*Dijo si viene* is a slip: a question passes on with *preguntar*, *preguntó si viene*.",
    "*Dijo viene* drops a word: Spanish always keeps *que*, *dijo que viene*.",
    "*Le pregunté la cuenta* mixes the two: the bill is a thing you want, so *le pedí la cuenta*."
  ]
},

"task-a2-ayer": {
  source: "old",
  hook: {
    line: "Here is the first past at work: one real day, told in order. No describing yet, just what happened, one event after another.",
    es: "El sábado desayuné tarde.\nLuego fui al mercado y compré fruta.\nPor la tarde vi una película con Diego.\nAl final cenamos en casa de Laura.",
    en: "On Saturday I had a late breakfast.\nThen I went to the market and bought fruit.\nIn the afternoon I watched a film with Diego.\nIn the end we had dinner at Laura's."
  },
  examples: [
    { es: "Primero desayuné y luego salí a correr.", en: "First I had breakfast and then I went out for a run." },
    { es: "Fui al mercado y compré fruta.", en: "I went to the market and bought fruit." },
    { es: "No hice nada especial. Estuve en casa.", en: "I didn't do anything special. I was at home." }
  ],
  rule: "Tell it in order, one finished event at a time, every verb in the past.\nOpen with when: *El sábado…*, *Ayer…*, *El fin de semana…*\nThen the steps: *primero*, *luego*, *después*, *por la tarde*, *al final*.\nJoin two events with *y*: *Fui al mercado y compré fruta.*\nThe words you will need most:\n*fui*: I went. *fue*: it was\n*hice*: I did. *No hice nada*: I didn't do anything\n*estuve*: I was, somewhere\n*vi*: I saw. *comí*, *salí*, *compré*\nSay how it went in one line: *Fue un día tranquilo.*\nKeep to what happened. How things looked and felt comes in a later unit.",
  readAndPick: [
    { q: "What did Ana do first?", es: "Primero fui al banco y después compré pan.",
      options: ["Went to the bank", "Bought some bread", "Met a friend"], answer: 0,
      why: "*Primero*: first, the bank. *Después*: then, the bread." },
    { q: "How was Diego's Sunday?", es: "El domingo no hice nada. Fue un día muy tranquilo.",
      options: ["Quiet, he did nothing", "Busy, out all day", "Tiring, he worked all day"], answer: 0,
      why: "*No hice nada*: I didn't do anything. *Fue tranquilo*: it was quiet." },
    { q: "Where was Laura on Saturday?", es: "El sábado estuve en casa de mi mamá.",
      options: ["At her mum's", "At her own place", "Out with friends"], answer: 0,
      why: "*Estuve*: I was. *En casa de mi mamá*: at my mum's." },
    { q: "What does fui mean here?", es: "Fui al parque con mi hermano.",
      options: ["I went", "I was", "He went"], answer: 0,
      why: "*Fui* plus *a* and a place: I went. With no place, it can be I was." },
    { q: "Who watched the film?", es: "Vimos una película en casa.",
      options: ["We did", "They did", "I did"], answer: 0,
      why: "*Vimos*: we saw. *Vi* is I saw." }
  ],
  yourTurn: [
    { en: "First I had breakfast and then I went to the market.", es: "Primero desayuné y luego fui al mercado.", accept: ["Primero desayuné y después fui al mercado."] },
    { en: "I didn't do anything on Sunday.", es: "El domingo no hice nada.", accept: ["No hice nada el domingo."] },
    { en: "I was at home all afternoon.", es: "Estuve en casa toda la tarde.", accept: ["Estuve toda la tarde en casa.", "Estuve en la casa toda la tarde."] },
    { en: "We saw a very good film.", es: "Vimos una película muy buena.", accept: ["Vimos una muy buena película."] },
    { en: "In the end we had dinner at Laura's.", es: "Al final cenamos en casa de Laura.", accept: ["Al final comimos en casa de Laura."] }
  ],
  personal: {
    prompt: "Tell a real day off in four or five lines, in order, every verb in the past.",
    constraints: [
      { type: "anyVerbInTense", tense: "preterito", label: "the events in the past" },
      { type: "containsAny", words: ["primero", "luego", "después", "al final"], label: "a step word: *primero*, *luego*, *al final*" },
      { type: "containsAny", words: ["fui", "hice", "estuve", "fue", "vi"], label: "one of the whole words: *fui*, *hice*, *estuve*, *vi*" },
      { type: "minSentences", n: 4, label: "at least four sentences" }
    ],
    model: "El domingo desayuné tarde. Primero fui al parque con mi perro. Luego compré pan y leche. Por la tarde estuve en casa de mi hermano. Al final vi una película y fue un buen día."
  },
  pitfalls: [
    "*Fui* is I went or I was; *fue* is he went, she went or it was. Check who.",
    "*Hice* and *hizo* carry no mark, and the *c* turns into *z* for he and she.",
    "A day told all with *y… y… y…* runs out of breath: break it with *luego* and *después*."
  ]
},

/* ---- unit a2-u17 · Have you ever…? (in the A1 band, after unit 8) ------ */

"gr-preterito-perfecto-a2": {
  source: "merged",
  hook: {
    line: "In Latin America, the past you already know does almost all the work. This one has a narrow job: your life so far, and what hasn't happened yet.",
    es: "¿Has estado en Cartagena?\nNo, nunca he ido. ¿Y tú?\nSí, fui el año pasado.",
    en: "Have you been to Cartagena?\nNo, I've never been. And you?\nYes, I went last year."
  },
  examples: [
    { es: "Nunca he comido ajiaco.", en: "I've never eaten ajiaco." },
    { es: "Todavía no he terminado.", en: "I haven't finished yet." },
    { es: "Hoy fui al banco y comí con Laura.", en: "Today I went to the bank and ate with Laura." }
  ],
  rule: "Spanish builds this like English: a helper, then a past form. I have been is *he estado*.\n*he, has, ha, hemos, han*, then a form in *-ado* or *-ido*: *he estado, has comido, han vivido*.\nThat second word never changes. Learn the odd ones whole: *hecho* (done), *visto* (seen), *dicho* (said), *escrito* (written).\nIn Latin America it has two jobs:\nexperience, with no date: *¿Has estado en Cali? Nunca he ido.*\nnot yet: *Todavía no he terminado.*\nFor anything else finished, even this morning, the plain past: *Hoy fui al banco.*\nOnce a time is named, switch: *¿Has estado en Cali? Sí, fui en enero.*\nSpain uses *he* far more, for today's news: *Hoy he ido al banco.*",
  readAndPick: [
    { q: "Is Laura talking about one trip, or her life so far?", es: "He estado en México dos veces.",
      options: ["Her life so far", "One trip last year", "A trip next month"], answer: 0,
      why: "*He estado* with *dos veces*: experience, with no date." },
    { q: "Has Diego eaten?", es: "Todavía no he comido.",
      options: ["Not yet", "Yes, already", "He never eats"], answer: 0,
      why: "*Todavía no he*: not yet." },
    { q: "When did Ana go to the bank?", es: "Esta mañana fui al banco.",
      options: ["Earlier today", "Several times this year", "Never so far"], answer: 0,
      why: "A time is named, *esta mañana*, so it takes the plain past, even today." },
    { q: "Where is this speaker most likely from?", es: "Hoy he desayunado en casa.",
      options: ["Spain", "Colombia", "Mexico"], answer: 0,
      why: "*Hoy he desayunado* for this morning is a Spain habit. In Colombia: *Hoy desayuné en casa.*" },
    { q: "What does Sam want to know?", es: "¿Alguna vez has visto una ballena?",
      options: ["If you've ever seen one", "When you saw one", "Where to see one"], answer: 0,
      why: "*¿Alguna vez has…?*: have you ever. *Visto* is seen." },
    { q: "Laura says yes, she has been. What does Diego ask next?", es: "¿Cuándo fuiste?",
      options: ["When she went", "If she has been", "Who went with her"], answer: 0,
      why: "After a yes, the question is about one trip, so the plain past: *fuiste*." }
  ],
  yourTurn: [
    { en: "Have you been to Cartagena? (to a friend)", es: "¿Has estado en Cartagena?", accept: ["¿Has ido a Cartagena?", "¿Alguna vez has [estado en|ido a] Cartagena?", "¿Has [estado en|ido a] Cartagena alguna vez?"] },
    { en: "I've never eaten ajiaco.", es: "Nunca he comido ajiaco.", accept: ["No he comido nunca ajiaco.", "No he comido ajiaco nunca."] },
    { en: "I haven't finished yet.", es: "Todavía no he terminado.", accept: ["Aún no he terminado.", "No he terminado todavía."] },
    { en: "Yes, I went last year.", es: "Sí, fui el año pasado.", accept: [] },
    { en: "Today I went to the bank. (the Latin American way)", es: "Hoy fui al banco.", accept: ["Fui al banco hoy."] }
  ],
  personal: {
    prompt: "Write three true lines: a place you've been, something you've never done, and something you haven't done yet.",
    constraints: [
      { type: "containsAny", words: ["he estado", "he ido", "hemos estado", "hemos ido"], label: "a place you've been: *he estado en…*" },
      { type: "containsWord", word: "nunca he", label: "something you've never done: *nunca he…*" },
      { type: "containsWord", word: "todavía no he", label: "something not yet: *todavía no he…*" }
    ],
    model: "He estado en Cali dos veces. Nunca he comido ajiaco. Todavía no he ido a Cartagena."
  },
  pitfalls: [
    "*Tengo estado* is a slip: this have is *he, has, ha*, never *tengo*.",
    "*He ido el año pasado* mixes the two: a named time takes the plain past, *fui el año pasado*.",
    "*Hacido* and *veído* don't exist: *hecho*, *visto*."
  ]
},

"nt-anterioridad-a2": {
  source: "merged",
  hook: {
    line: "The waiter comes back to your table and asks if you've finished. The answer needs one of three small words: just, already or not yet.",
    es: "¿Ya terminaron?\nTodavía no. Acabamos de empezar.",
    en: "Have you finished yet?\nNot yet. We've just started."
  },
  examples: [
    { es: "Acabo de llegar.", en: "I've just arrived." },
    { es: "¿Ya comiste?\nSí, ya comí.", en: "Have you eaten yet?\nYes, I've already eaten." },
    { es: "La película dura dos horas.", en: "The film lasts two hours." }
  ],
  rule: "A few small words place things against now:\n*acabar de* plus the dictionary form: just. *Acabo de llegar*, I've just arrived. Only *acabo* changes: *acabas, acaba, acabamos, acaban*.\n*ya* with the plain past: already, or yet in a question. *¿Ya comiste? Sí, ya comí.*\n*todavía no* with *he*: not yet. *Todavía no he comido.*\n*todavía* with today's form: still. *Todavía vive en Cali.*\n*ya no*: not any more. *Ya no trabajo allí.*\nEnglish needs have and just; Spanish puts the meaning in these words.\nHow long something lasts takes *durar*, with the length straight after it: *La clase dura una hora.* To ask: *¿Cuánto dura?*",
  readAndPick: [
    { q: "When did Laura get home?", es: "Laura acaba de llegar.",
      options: ["A moment ago", "Earlier this morning", "Not yet"], answer: 0,
      why: "*Acaba de llegar*: she has just arrived." },
    { q: "Has Diego paid?", es: "Diego ya pagó la cuenta.",
      options: ["Yes, already", "No, not yet", "He's paying now"], answer: 0,
      why: "*Ya pagó*: he has already paid." },
    { q: "Is Ana still at the office?", es: "Ana todavía está en la oficina.",
      options: ["Yes, she's there", "No, she just left", "No, she never went"], answer: 0,
      why: "*Todavía* with today's form: still." },
    { q: "Does Sam still live in Toronto?", es: "Ya no vivo en Toronto.",
      options: ["Not any more", "Yes, he still does", "Not yet"], answer: 0,
      why: "*Ya no*: not any more." },
    { q: "How long is the trip?", es: "El viaje dura tres horas.",
      options: ["Three hours", "Since three o'clock", "Until three"], answer: 0,
      why: "*Dura tres horas*: it lasts three hours, with nothing in between." },
    { q: "Has the film started?", es: "La película todavía no ha empezado.",
      options: ["Not yet", "Just now", "An hour ago"], answer: 0,
      why: "*Todavía no ha empezado*: it hasn't started yet." }
  ],
  yourTurn: [
    { en: "I've just arrived.", es: "Acabo de llegar.", accept: [] },
    { en: "Have you eaten yet? (to a friend)", es: "¿Ya comiste?", accept: ["¿Comiste ya?", "¿Ya has comido?"] },
    { en: "We haven't paid yet.", es: "Todavía no hemos pagado.", accept: ["Aún no hemos pagado.", "No hemos pagado todavía.", "Todavía no pagamos."] },
    { en: "I don't work there any more.", es: "Ya no trabajo allí.", accept: ["Ya no trabajo [allá|ahí]."] },
    { en: "How long does the class last?", es: "¿Cuánto dura la clase?", accept: ["¿Cuánto tiempo dura la clase?"] }
  ],
  personal: {
    prompt: "Write three true lines: something you've just done, something you haven't done yet, and something you don't do any more.",
    constraints: [
      { type: "regex", pattern: "\\bacab(o|as|a|amos|an) de\\b", label: "something just done: *acabo de…*" },
      { type: "containsWord", word: "todavía no", label: "something not yet: *todavía no…*" },
      { type: "containsWord", word: "ya no", label: "something not any more: *ya no…*" }
    ],
    model: "Acabo de tomar un tinto. Todavía no he leído el libro de Laura. Ya no vivo con mis papás."
  },
  pitfalls: [
    "*Acabo de llegué* is a slip: after *acabo de*, the dictionary form, *acabo de llegar*.",
    "*Ya* and *todavía no* sit at opposite ends: swap them and you say the opposite.",
    "*Dura por dos horas* adds a word: *dura dos horas*."
  ]
},

"nt-existencia-inexistencia-a2": {
  source: "merged",
  hook: {
    line: "Family stories run on two dates: where someone was born, and when they died. Spanish does each with one short past verb, and it has a kind word for old.",
    es: "Mi abuelo nació en Cali en 1935.\nMurió a los noventa años.\nMi abuela todavía vive. Ya es muy mayor.",
    en: "My grandfather was born in Cali in 1935.\nHe died at ninety.\nMy grandmother is still alive. She's very old now."
  },
  examples: [
    { es: "¿Dónde naciste?\nNací en Toronto.", en: "Where were you born?\nI was born in Toronto." },
    { es: "No hay nadie en la oficina.", en: "There's nobody in the office." },
    { es: "Cartagena tiene casas muy antiguas.", en: "Cartagena has very old houses." }
  ],
  rule: "Being born is one plain past verb from *nacer*: *nací*, I was born; *naciste*; *nació*. Never *fui nacido*.\nThen *en* and a year or a place: *Nací en 1990, en Cali.* A full date takes *el*: *Nací el 3 de marzo.*\nThe end of a life: *murió*, he or she died. *Murió a los noventa años.*\nFor none at all, *no hay* with *ningún* or *ninguna*, always just one: *No hay ninguna droguería aquí.* For people, *nadie*: *No hay nadie en casa.*\nThree words for old:\n*mayor*: people, said kindly. *Mi abuela ya es mayor.*\n*antiguo*: things with history. *una casa antigua*\n*viejo*: worn out. *un carro viejo*. Said of a person, it can sound blunt.",
  readAndPick: [
    { q: "What does Diego tell you about his dad?", es: "Mi papá nació en 1960.",
      options: ["The year he was born", "How old he is now", "Where he lives these days"], answer: 0,
      why: "*Nació en 1960*: he was born in 1960." },
    { q: "Is there a pharmacy on this street?", es: "No hay ninguna droguería en esta calle.",
      options: ["No, not one", "Yes, just one", "Yes, several"], answer: 0,
      why: "*No hay ninguna*: not a single one." },
    { q: "How does Laura talk about her grandmother?", es: "Mi abuela ya es mayor.",
      options: ["Kindly: she's old now", "Bluntly: she's old", "She's the oldest in the family"], answer: 0,
      why: "*Mayor* is the kind word for old, said of people." },
    { q: "Is anyone home?", es: "No hay nadie en casa.",
      options: ["No, nobody", "Yes, one person", "Only the dog"], answer: 0,
      why: "*No hay nadie*: there's nobody." },
    { q: "What kind of old is this house?", es: "Es una casa antigua, del siglo dieciocho.",
      options: ["Old and historic", "Old and falling apart", "Old fashioned inside"], answer: 0,
      why: "*Antiguo*: old with history, said with some admiration." }
  ],
  yourTurn: [
    { en: "Where were you born? (to a friend)", es: "¿Dónde naciste?", accept: [] },
    { en: "I was born in 1990.", es: "Nací en 1990.", accept: ["Nací en mil novecientos noventa."] },
    { en: "My grandfather died in 2015.", es: "Mi abuelo murió en 2015.", accept: ["Mi abuelo murió en dos mil quince."] },
    { en: "There's nobody in the office.", es: "No hay nadie en la oficina.", accept: [] },
    { en: "My grandmother is elderly now.", es: "Mi abuela ya es mayor.", accept: ["Mi abuela es mayor.", "Mi abuela ya está mayor."] }
  ],
  personal: {
    prompt: "Write two lines about someone in your family: where and when they were born, and one more true thing about them now.",
    constraints: [
      { type: "containsAny", words: ["nací", "nació", "naciste", "nacieron", "nacimos"], label: "born: *nació* or *nací*" },
      { type: "regex", pattern: "\\bnaci[a-záéíóúñ]*\\s+(en|el)\\s+\\S+", label: "*nació en* plus a year or a place" }
    ],
    model: "Mi mamá nació en Halifax en 1962. Ya es mayor, pero todavía trabaja."
  },
  pitfalls: [
    "*Fui nacido* copies English word for word: *nací*.",
    "*No hay ningunas droguerías* is a slip: *ninguna* stays single, *no hay ninguna droguería*.",
    "*Mayor* is for people; an old building is *antiguo*, never *mayor*."
  ]
},

"task-a2-experiencia": {
  source: "old",
  hook: {
    line: "Travel talk has a shape: first whether you've ever been, then, if you have, when and with whom. The verb switches at the yes.",
    es: "¿Alguna vez has estado en Colombia?\nSí, he estado dos veces.\n¿Y cuándo fuiste?\nFui en 2019 con mi esposa.",
    en: "Have you ever been to Colombia?\nYes, I've been twice.\nAnd when did you go?\nI went in 2019 with my wife."
  },
  examples: [
    { es: "¿Has probado el ajiaco?\nTodavía no.", en: "Have you tried ajiaco?\nNot yet." },
    { es: "Nunca he visto esa película. ¿Es buena?", en: "I've never seen that film. Is it good?" },
    { es: "He leído el libro, pero no he visto la película.", en: "I've read the book, but I haven't seen the film." }
  ],
  rule: "An interview about experience has two halves.\nWhether, at any point in your life: *¿Has…?* or *¿Alguna vez has…?*\n*¿Has estado en Cali? ¿Alguna vez has comido arepa de huevo?*\nThe answers: *Sí, he estado. Nunca he ido. Todavía no. Sí, dos veces.*\nThen the yes changes the question. When, where and with whom are about one time, so the plain past: *¿Cuándo fuiste? ¿Con quién fuiste? ¿Te gustó?*\nThe odd forms come up all the time here: *hecho*, *visto*, *dicho*, *escrito*, *vuelto*, *puesto*.\n*Nunca* goes in front of *he*: *Nunca he ido.* After the verb it needs *no*: *No he ido nunca.*",
  readAndPick: [
    { q: "Does Ana want a date?", es: "¿Alguna vez has estado en México?",
      options: ["No, just yes or no", "Yes, the exact month and year", "Yes, the month"], answer: 0,
      why: "*¿Alguna vez has…?* asks whether, at any time. No date needed." },
    { q: "Diego has said yes. What does Laura ask now?", es: "¿Y cuándo fuiste?",
      options: ["When he went", "If he went", "Why he went there"], answer: 0,
      why: "*¿Cuándo fuiste?* is about one trip, so the plain past." },
    { q: "Has Laura seen the film?", es: "He leído el libro, pero no he visto la película.",
      options: ["No, only read the book", "Yes, and the book too", "Yes, twice"], answer: 0,
      why: "*No he visto*: I haven't seen. *Visto* is the odd form of *ver*." },
    { q: "What has Sam never done?", es: "Nunca he montado a caballo.",
      options: ["Ridden a horse", "Seen a horse", "Bought a horse"], answer: 0,
      why: "*Nunca he montado*: I've never ridden." },
    { q: "Did Ana like it?", es: "Fui el año pasado y me encantó.",
      options: ["She loved it", "She didn't go", "She didn't like it"], answer: 0,
      why: "*Me encantó*: I loved it. One trip, so the plain past." }
  ],
  yourTurn: [
    { en: "Have you ever been to Mexico? (to a friend)", es: "¿Alguna vez has estado en México?", accept: ["¿Has estado alguna vez en México?", "¿Has estado en México?", "¿Alguna vez has ido a México?", "¿Has ido a México?"] },
    { en: "Yes, I've been twice.", es: "Sí, he estado dos veces.", accept: ["Sí, he ido dos veces."] },
    { en: "When did you go? (to a friend)", es: "¿Cuándo fuiste?", accept: ["¿Y cuándo fuiste?"] },
    { en: "I've never seen that film.", es: "Nunca he visto esa película.", accept: ["No he visto nunca esa película.", "No he visto esa película nunca."] },
    { en: "I haven't tried ajiaco yet.", es: "Todavía no he probado el ajiaco.", accept: ["Aún no he probado el ajiaco.", "No he probado el ajiaco todavía.", "Todavía no he probado ajiaco."] }
  ],
  personal: {
    prompt: "Write a short interview in four lines: ask a friend about one experience, they say yes, and you ask when.",
    constraints: [
      { type: "regex", pattern: "¿[^?]*\\bhas\\s+[a-záéíóúñ]+", label: "a question with *¿Has…?*" },
      { type: "regex", pattern: "\\bhe\\s+[a-záéíóúñ]+(ado|ido|cho|sto|to)(?![a-záéíóúñ])", label: "an answer with *he*: *he estado*, *nunca he…*" },
      { type: "regex", pattern: "\\bcu[aá]ndo\\b", label: "the follow up: *¿cuándo…?*" },
      { type: "anyVerbInTense", tense: "preterito", label: "the one time, in the plain past: *fuiste*, *fui*" }
    ],
    model: "¿Has estado en Cartagena? Sí, he estado una vez. ¿Cuándo fuiste? Fui en diciembre con mi familia."
  },
  pitfalls: [
    "*¿Cuándo has ido?* asks about one trip with the life form: *¿Cuándo fuiste?*",
    "*Veído* and *hacido* don't exist: *visto*, *hecho*.",
    "*Nunca no he ido* says no twice: *nunca he ido*, or *no he ido nunca*."
  ]
},

/* ---- unit 9 · Your day ------------------------------------------------- */

"gr-pronombre-se-a1": {
  source: "merged",
  hook: {
    line: "You've said *me llamo* since day one. The same little word comes back in every daily routine: I get up, I shower, I go to bed.",
    es: "Me levanto a las seis, me baño y me voy al trabajo.\nMi hermano se levanta a las diez.",
    en: "I get up at six, I shower and I head off to work.\nMy brother gets up at ten."
  },
  examples: [
    { es: "¿A qué hora te acuestas?", en: "What time do you go to bed? (to a friend)" },
    { es: "Los niños se bañan antes de cenar.", en: "The kids have a shower before dinner." },
    { es: "Los domingos nos quedamos en casa.", en: "On Sundays we stay at home." }
  ],
  rule: "Some verbs carry a small word that points back at whoever does them. It changes with the person:\n*me levanto*: I get up\n*te levantas*: you get up\n*se levanta*: he, she or *usted* gets up\n*nos levantamos*: we get up\n*se levantan*: they or *ustedes* get up\n*Se* is the same for one or many; the ending says which.\nEnglish has no myself here, so don't look for one.\nThe small word goes right before the verb, and *no* before both: *No me levanto temprano.*\nRoutine verbs that work this way: *levantarse*, *bañarse*, *vestirse*, *acostarse*, *quedarse*. In the dictionary they end in *-se*.\n*Me baño* is how most Colombians say I shower.",
  readAndPick: [
    { q: "Who gets up at seven?", es: "Se levanta a las siete.",
      options: ["He or she does", "I do, every day", "We all do"], answer: 0,
      why: "*Se levanta*: he, she or *usted*. I would be *me levanto*." },
    { q: "Who is being asked?", es: "¿A qué hora te acuestas?",
      options: ["A friend", "A stranger", "A whole group"], answer: 0,
      why: "*Te acuestas*: you, someone you call *tú*." },
    { q: "Who stays home on Sundays?", es: "Los domingos nos quedamos en casa.",
      options: ["We do", "They do", "You do"], answer: 0,
      why: "*Nos quedamos*: we stay." },
    { q: "What does Diego do first?", es: "Primero me baño y después desayuno.",
      options: ["Has a shower", "Has breakfast", "Gets dressed"], answer: 0,
      why: "*Me baño*: I shower, the everyday Colombian way." },
    { q: "Is Ana giving her name?", es: "Llamo a Laura.",
      options: ["No, she's calling Laura", "Yes, she's Laura", "No, Laura is calling her"], answer: 0,
      why: "*Llamo a Laura*: the call goes to Laura. With *me*, it comes back: *Me llamo Ana.*" }
  ],
  yourTurn: [
    { en: "I get up at seven.", es: "Me levanto a las siete.", accept: ["Yo me levanto a las siete."] },
    { en: "What time do you go to bed? (to a friend)", es: "¿A qué hora te acuestas?", accept: [] },
    { en: "My brother gets up at ten.", es: "Mi hermano se levanta a las diez.", accept: [] },
    { en: "On Sundays we stay at home.", es: "Los domingos nos quedamos en casa.", accept: ["Nos quedamos en casa los domingos.", "Los domingos nos quedamos en la casa."] },
    { en: "I don't get up early.", es: "No me levanto temprano.", accept: [] }
  ],
  personal: {
    prompt: "Write your morning in two or three lines, with at least two of these: *me levanto*, *me baño*, *me visto*.",
    constraints: [
      { type: "regex", pattern: "\\bme\\s+[a-záéíóúñ]+o\\b[\\s\\S]*\\bme\\s+[a-záéíóúñ]+o\\b", label: "two routine verbs with *me*: *me levanto*, *me baño*…" },
      { type: "regex", pattern: "\\ba las? [a-záéíóúñ]+", label: "a time: *a las seis*" }
    ],
    model: "Me levanto a las seis y media. Me baño, me visto y desayuno con mi pareja. Salgo a las ocho."
  },
  pitfalls: [
    "*Levanto a las siete* says you lift something at seven: *me levanto a las siete*.",
    "*Yo se levanto* is a slip: for I, *me levanto*. *Se* is for he, she and they.",
    "*Me no levanto* puts *no* in the wrong place: *no me levanto*."
  ]
},

"gr-presente-indicativo-valores-a1": {
  source: "merged",
  hook: {
    line: "English needs two forms for I work and I'm working. Spanish uses one for both, and it covers tomorrow's plans as well.",
    es: "¿Qué haces?\nEstudio. Mañana tengo un examen.",
    en: "What are you doing?\nI'm studying. I have an exam tomorrow."
  },
  examples: [
    { es: "Trabajo en un hospital.", en: "I work in a hospital." },
    { es: "Ahora no puedo, estoy en clase.", en: "I can't right now, I'm in class." },
    { es: "Los martes juego fútbol con mis amigos.", en: "On Tuesdays I play football with my friends." }
  ],
  rule: "One present does the jobs English splits in two:\nHabits: *Trabajo los lunes.* I work on Mondays.\nFacts: *Vivo en Bogotá.* I live in Bogotá.\nRight now: *¿Qué haces?* What are you doing? *Estudio.* I'm studying.\nFixed plans: *Mañana trabajo.* I'm working tomorrow.\nSo there is no separate -ing form to build: *estudio* is I study and I'm studying.\nSome verbs change a vowel inside, in every form except *nosotros*:\n*quiero, quieres, quiere, queremos, quieren*\n*puedo, puedes, podemos*\n*juego, juegas, jugamos*\n*prefiero*, *duermo*, *empiezo*\nThe endings stay the ones you know.",
  readAndPick: [
    { q: "Is Diego working right now, or in general?", es: "Diego trabaja en un banco.",
      options: ["In general, it's his job", "Right now, this minute", "He starts tomorrow"], answer: 0,
      why: "*Trabaja en un banco*: a fact about his life." },
    { q: "When is the exam?", es: "Mañana tengo un examen.",
      options: ["Tomorrow", "Today", "Every week"], answer: 0,
      why: "A fixed plan takes the plain present, with *mañana* to say when." },
    { q: "What is Laura doing?", es: "¿Qué haces?\nCocino. ¿Vienes?",
      options: ["Cooking right now", "Learning to cook", "Cooking later this evening"], answer: 0,
      why: "*Cocino*: I'm cooking. The present covers right now." },
    { q: "Who can't go on Friday?", es: "No podemos ir el viernes.",
      options: ["We can't", "I can't", "They can't"], answer: 0,
      why: "*Podemos*: we. For *nosotros* the vowel stays plain; I would be *puedo*." },
    { q: "When do they play football?", es: "Los martes jugamos fútbol.",
      options: ["Every Tuesday", "This Tuesday", "Last Tuesday"], answer: 0,
      why: "*Los martes*: every Tuesday, a habit." }
  ],
  yourTurn: [
    { en: "I work in a hospital.", es: "Trabajo en un hospital.", accept: [] },
    { en: "What are you doing? (to a friend)", es: "¿Qué haces?", accept: ["¿Qué estás haciendo?"] },
    { en: "I'm studying. I have an exam tomorrow.", es: "Estudio. Mañana tengo un examen.", accept: ["Estudio. Tengo un examen mañana.", "Estoy estudiando. Mañana tengo un examen.", "Estoy estudiando. Tengo un examen mañana."] },
    { en: "I want to go, but I can't.", es: "Quiero ir, pero no puedo.", accept: [] },
    { en: "We can't on Friday.", es: "El viernes no podemos.", accept: ["No podemos el viernes."] }
  ],
  personal: {
    prompt: "Write two true lines: something you do every week, and something you're doing tomorrow, both in the present.",
    constraints: [
      { type: "person", person: "yo", label: "a verb for *yo*" },
      { type: "containsAny", words: ["los lunes", "los martes", "los miércoles", "los jueves", "los viernes", "los sábados", "los domingos", "todos los días", "siempre", "normalmente", "cada"], label: "a habit: *los martes*, *todos los días*…" },
      { type: "containsAny", words: ["mañana", "el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado", "el domingo", "esta noche"], label: "a time for the plan: *mañana*, *el sábado*…" }
    ],
    model: "Los martes juego fútbol con mis amigos. Mañana trabajo hasta las seis."
  },
  pitfalls: [
    "*Estoy trabajo* mixes two verbs: *trabajo* already means I'm working.",
    "*Puedemos* is a slip: for *nosotros* the vowel stays plain, *podemos*, *queremos*.",
    "*Los sábados* is every Saturday; *el sábado* is this one."
  ]
},

"gr-adverbios-lugar-tiempo-cantidad-a1": {
  source: "merged",
  hook: {
    line: "English says very and a lot almost without thinking. Spanish keeps them apart, and one look at the next word tells you which to use.",
    es: "Trabajo mucho y duermo poco.\nEstoy muy cansada.",
    en: "I work a lot and I don't sleep much.\nI'm very tired."
  },
  examples: [
    { es: "Vivo muy cerca, a dos cuadras.", en: "I live very close, two blocks away." },
    { es: "¿Te gusta el barrio?\nSí, mucho.", en: "Do you like the neighbourhood?\nYes, a lot." },
    { es: "Hoy salgo tarde del trabajo.", en: "Today I'm leaving work late." }
  ],
  rule: "How much, how and when each have their place:\nAfter a verb, *mucho* and *poco*: *Trabajo mucho. Duermo poco.*\nBefore a describing word or a how word, *muy*: *muy cansado, muy cerca, muy bien, muy tarde*.\n*Muy* never stands alone: *¿Te gusta? Sí, mucho.*\nWhen, in one word, usually after the verb: *Llego temprano. Salgo tarde.* Or first, to set the day: *Hoy no trabajo.*\n*Bien* and *mal* say how it's done, and never change: *Laura canta muy bien.*\nHunger and thirst are things in Spanish, so very becomes *mucho*: *tengo mucha hambre*, *tengo mucha sed*.",
  readAndPick: [
    { q: "How much does Diego sleep?", es: "Diego duerme poco.",
      options: ["Not much", "A lot", "Very well"], answer: 0,
      why: "*Poco* after the verb: not much." },
    { q: "How far is the bakery?", es: "La panadería está muy cerca.",
      options: ["Very close", "Quite far away", "Next door"], answer: 0,
      why: "*Muy* before *cerca*: very close." },
    { q: "Does Laura like the café?", es: "¿Te gusta el café?\nSí, mucho.",
      options: ["Yes, a lot", "Not very much", "Only a little"], answer: 0,
      why: "*Sí, mucho*: yes, a lot. *Muy* can't stand alone." },
    { q: "How hungry is Sam?", es: "Tengo mucha hambre.",
      options: ["Very hungry", "A bit hungry", "Not hungry"], answer: 0,
      why: "*Hambre* is a thing in Spanish, so very is *mucha*." },
    { q: "When does Ana get to work?", es: "Llego temprano todos los días.",
      options: ["Early, every day", "Late, every day", "Early, some days"], answer: 0,
      why: "*Temprano*: early. *Todos los días*: every day." }
  ],
  yourTurn: [
    { en: "I work a lot.", es: "Trabajo mucho.", accept: [] },
    { en: "I'm very tired.", es: "Estoy muy cansado.", accept: ["Estoy muy cansada."] },
    { en: "A friend asks if you like the city. Answer: Yes, a lot.", es: "Sí, mucho.", accept: ["Sí, me gusta mucho."] },
    { en: "I'm very hungry.", es: "Tengo mucha hambre.", accept: [] },
    { en: "She sings very well.", es: "Canta muy bien.", accept: ["Ella canta muy bien."] }
  ],
  personal: {
    prompt: "Write two true lines about your week: something you do a lot or not much, and something that is very something.",
    constraints: [
      { type: "regex", pattern: "[a-záéíóúñ]+\\s+(mucho|poco)\\b", label: "a verb with *mucho* or *poco* after it" },
      { type: "regex", pattern: "\\bmuy\\s+[a-záéíóúñ]+", label: "*muy* before a describing word" }
    ],
    model: "Esta semana trabajo mucho y duermo poco. Mi oficina está muy lejos de mi casa."
  },
  pitfalls: [
    "*Mucho cansado* is a slip: before a describing word, *muy cansado*.",
    "*Sí, muy* leaves *muy* hanging: on its own it's *mucho*.",
    "*Tengo muy hambre* is a slip: *hambre* is a thing, so *mucha hambre*."
  ]
},

"nt-duracion-transcurso-a1": {
  source: "merged",
  hook: {
    line: "Plans and memories use the same calendar words. *El jueves* can be this coming Thursday or last Thursday, and only the verb tells you which.",
    es: "El jueves fui al médico.\nEl próximo jueves empiezo a trabajar en un banco.",
    en: "On Thursday I went to the doctor.\nNext Thursday I start working at a bank."
  },
  examples: [
    { es: "La clase empieza a las ocho y termina a las diez.", en: "The class starts at eight and finishes at ten." },
    { es: "¿Cuánto se demora el bus hasta el centro?\nMás o menos media hora.", en: "How long does the bus take to get downtown?\nAbout half an hour." },
    { es: "La semana pasada hizo mucho frío en Bogotá.", en: "Last week it was very cold in Bogotá." }
  ],
  rule: "Two verbs frame an activity, each with its own small word:\n*empezar a*: *Empiezo a trabajar a las nueve.*\n*terminar de*: *Termino de trabajar a las cinco.*\nThe day alone doesn't say when; the verb does:\n*El jueves voy al cine.* This Thursday, coming up.\n*El jueves fui al cine.* Last Thursday.\nTo be exact, *pasado* goes after the time word and *próximo* before it: *el sábado pasado*, *la semana pasada*, *el próximo año*.\nHow long it takes: *¿Cuánto se demora el bus? Se demora media hora.*\nThe weather takes *hace*: *hace frío*, *hace calor*. Very is *mucho*: *hace mucho frío*.",
  readAndPick: [
    { q: "Is Laura's trip coming up or over?", es: "El sábado fui a Medellín.",
      options: ["Over, last Saturday", "Coming, this Saturday", "Every Saturday"], answer: 0,
      why: "*Fui*: I went. The verb says it's over." },
    { q: "When does Diego finish?", es: "Termino de trabajar a las seis.",
      options: ["At six", "From six on", "Before six"], answer: 0,
      why: "*Termino de trabajar*: I finish working. *A las seis*: at six." },
    { q: "How long is the ride?", es: "El bus se demora dos horas.",
      options: ["Two hours", "Two short stops", "Two buses"], answer: 0,
      why: "*Se demora*: it takes. The everyday Colombian way to say how long." },
    { q: "What's the weather like?", es: "Hoy hace mucho calor.",
      options: ["Very hot", "Quite cold", "Rainy"], answer: 0,
      why: "*Hace calor*: it's hot. *Mucho* makes it very." },
    { q: "When does Ana start the course?", es: "Empiezo el curso la próxima semana.",
      options: ["Next week", "Last week", "Later this week"], answer: 0,
      why: "*La próxima semana*: next week." }
  ],
  yourTurn: [
    { en: "I start work at nine.", es: "Empiezo a trabajar a las nueve.", accept: ["Yo empiezo a trabajar a las nueve."] },
    { en: "I finish work at five.", es: "Termino de trabajar a las cinco.", accept: ["Yo termino de trabajar a las cinco."] },
    { en: "Last Saturday I went to the cinema.", es: "El sábado pasado fui al cine.", accept: ["Fui al cine el sábado pasado."] },
    { en: "How long does the bus take?", es: "¿Cuánto se demora el bus?", accept: ["¿Cuánto tarda el bus?", "¿Cuánto tiempo se demora el bus?"] },
    { en: "It's very cold today.", es: "Hoy hace mucho frío.", accept: ["Hace mucho frío hoy."] }
  ],
  personal: {
    prompt: "Write one line about something you did last week, and one about something you start next week.",
    constraints: [
      { type: "containsAny", words: ["pasado", "pasada"], label: "last: *el sábado pasado*, *la semana pasada*" },
      { type: "containsAny", words: ["próximo", "próxima", "que viene"], label: "next: *el próximo lunes*, *la próxima semana*" }
    ],
    model: "La semana pasada fui a Cali. El próximo lunes empiezo una clase de salsa."
  },
  pitfalls: [
    "*Empezar de* and *terminar a* swap the small words: *empezar a*, *terminar de*.",
    "*Hace muy frío* is a slip: *frío* is a thing here, so *mucho frío*.",
    "*La semana pasado* is a slip: *semana* is a *la* word, so *pasada*."
  ]
},

"task-rutina": {
  source: "old",
  hook: {
    line: "Your day, from the alarm to the pillow, is the first long thing most people say in Spanish. The routine verbs carry *me*, and the times keep it in order.",
    es: "Me levanto a las seis y media.\nDesayuno, me baño y salgo a las siete y media.\nTrabajo hasta las cinco.\nPor la noche cocino, veo una serie y me acuesto a las once.",
    en: "I get up at half past six.\nI have breakfast, shower and leave at half past seven.\nI work until five.\nIn the evening I cook, watch a show and go to bed at eleven."
  },
  examples: [
    { es: "A veces almuerzo con mis compañeros.", en: "Sometimes I have lunch with my colleagues." },
    { es: "Casi nunca me acuesto antes de las doce.", en: "I almost never go to bed before twelve." },
    { es: "Los sábados me levanto tarde.", en: "On Saturdays I get up late." }
  ],
  rule: "Tell it in order, from waking to sleeping, all in the present.\nThe routine verbs keep their *me*: *me levanto*, *me baño*, *me visto*, *me acuesto*. Without it, *levanto* means you lift something.\nGive times as you go: *a las siete*, *por la mañana*, *al mediodía*, *por la tarde*, *por la noche*.\nJoin the steps: *primero*, *luego*, *después*, *antes de*, *después de*.\nSay how often: *siempre*, *normalmente*, *a veces*, *casi nunca*.\nChange the day and you change the routine: *Los domingos me levanto tarde.*\nSix to ten short lines is plenty.",
  readAndPick: [
    { q: "When does Ana get up on weekdays?", es: "Entre semana me levanto a las seis.",
      options: ["At six", "At seven", "Whenever she likes"], answer: 0,
      why: "*Entre semana*: on weekdays. *A las seis*: at six." },
    { q: "How often does Diego cook?", es: "Casi nunca cocino.",
      options: ["Hardly ever", "Every single day", "Sometimes"], answer: 0,
      why: "*Casi nunca*: almost never." },
    { q: "What does Laura do after work?", es: "Después del trabajo voy al gimnasio.",
      options: ["Goes to the gym", "Goes home to rest", "Meets her friends"], answer: 0,
      why: "*Después del trabajo*: after work. *Voy al gimnasio*: I go to the gym." },
    { q: "What does Sam do first?", es: "Primero me baño y luego desayuno.",
      options: ["Showers", "Has breakfast", "Gets dressed"], answer: 0,
      why: "*Primero me baño*: first I shower." },
    { q: "When does Ana go to bed on Saturdays?", es: "Los sábados me acuesto muy tarde.",
      options: ["Very late", "Very early", "At ten"], answer: 0,
      why: "*Me acuesto muy tarde*: I go to bed very late." }
  ],
  yourTurn: [
    { en: "I get up at half past six.", es: "Me levanto a las seis y media.", accept: [] },
    { en: "Then I have a shower and get dressed.", es: "Luego me baño y me visto.", accept: ["[Luego|Después] me [baño|ducho] y me visto."] },
    { en: "I work until five.", es: "Trabajo hasta las cinco.", accept: [] },
    { en: "I almost never go to bed before twelve.", es: "Casi nunca me acuesto antes de las doce.", accept: [] },
    { en: "On Sundays I get up late.", es: "Los domingos me levanto tarde.", accept: ["Me levanto tarde los domingos."] }
  ],
  personal: {
    prompt: "Write your real weekday in five to eight lines, in order, from waking to sleeping.",
    constraints: [
      { type: "regex", pattern: "\\bme\\s+[a-záéíóúñ]+o\\b[\\s\\S]*\\bme\\s+[a-záéíóúñ]+o\\b", label: "at least two routine verbs with *me*" },
      { type: "regex", pattern: "\\ba las? [a-záéíóúñ]+[\\s\\S]*\\ba las? [a-záéíóúñ]+", label: "at least two times: *a las siete*…" },
      { type: "containsAny", words: ["siempre", "normalmente", "a veces", "nunca"], label: "how often: *siempre*, *a veces*, *nunca*" },
      { type: "minSentences", n: 5, label: "at least five sentences" }
    ],
    model: "Normalmente me levanto a las seis y media. Primero me baño y después desayuno. Salgo de casa a las siete y media. Trabajo hasta las cinco. Por la noche cocino y a veces veo una serie. Me acuesto a las once."
  },
  pitfalls: [
    "*Levanto a las seis* says you lift something: *me levanto a las seis*.",
    "*Me acosto* is a slip: *acostarse* changes inside, *me acuesto*, but *nos acostamos*."
  ]
},

/* ---- unit 10 · Want, need, ask for ------------------------------------- */

"gr-infinitivo-usos-a1": {
  source: "merged",
  hook: {
    line: "Most of what you want to say has two verbs in it: I want to travel, I can't come, I have to work. The good news: the second one never changes.",
    es: "¿Quieres salir el sábado?\nNo puedo. Tengo que trabajar.",
    en: "Do you want to go out on Saturday?\nI can't. I have to work."
  },
  examples: [
    { es: "Necesito comprar pan.", en: "I need to buy bread." },
    { es: "Aprender un idioma es difícil, pero es divertido.", en: "Learning a language is hard, but it's fun." },
    { es: "Me gusta caminar por el centro.", en: "I like walking around downtown." }
  ],
  rule: "When two verbs sit together, only the first one changes. The second stays in its dictionary form, ending in *-ar*, *-er* or *-ir*:\n*Quiero viajar. Laura quiere viajar. Queremos viajar.*\nEnglish puts to in front; Spanish needs nothing.\nThe first verbs you'll use most: *quiero*, *puedo*, *necesito*, *prefiero*.\n*Tengo que* plus a verb: I have to. Keep the *que*: *Tengo que trabajar.*\nFor not, *no* goes before the first verb: *No puedo salir.*\nAn activity as the subject is the dictionary form too, where English uses -ing:\n*Aprender un idioma es difícil.* Learning a language is hard.\n*Es importante dormir bien.* It's important to sleep well.",
  readAndPick: [
    { q: "Can Diego come?", es: "Hoy no puedo ir. Tengo que estudiar.",
      options: ["No, he has to study", "Yes, after studying", "No, he's not feeling well"], answer: 0,
      why: "*No puedo*: I can't. *Tengo que estudiar*: I have to study." },
    { q: "What does Laura want?", es: "Quiero aprender a bailar salsa.",
      options: ["To learn salsa", "To teach salsa", "To watch a salsa show"], answer: 0,
      why: "*Quiero aprender*: I want to learn. Only *quiero* changes." },
    { q: "What does Ana find hard?", es: "Encontrar apartamento en Bogotá es difícil.",
      options: ["Finding an apartment", "Living in Bogotá", "Paying the rent every month"], answer: 0,
      why: "*Encontrar*: finding. The activity is the dictionary form." },
    { q: "Who needs to buy bread?", es: "Necesitamos comprar pan.",
      options: ["We do", "I do", "They do"], answer: 0,
      why: "Only the first verb changes: *necesitamos*. *Comprar* stays as it is." },
    { q: "What does Sam have to do?", es: "Tengo que llamar a mi mamá.",
      options: ["Call his mum", "Visit his mum", "Wait for his mum"], answer: 0,
      why: "*Tengo que llamar*: I have to call." }
  ],
  yourTurn: [
    { en: "Do you want to go out on Saturday? (to a friend)", es: "¿Quieres salir el sábado?", accept: [] },
    { en: "I can't. I have to work.", es: "No puedo. Tengo que trabajar.", accept: [] },
    { en: "We need to buy bread.", es: "Necesitamos comprar pan.", accept: [] },
    { en: "Learning a language is hard.", es: "Aprender un idioma es difícil.", accept: ["Es difícil aprender un idioma."] },
    { en: "It's important to sleep well.", es: "Es importante dormir bien.", accept: ["Dormir bien es importante."] }
  ],
  personal: {
    prompt: "Write two true lines: something you want to do this year, and something you have to do this week.",
    constraints: [
      { type: "regex", pattern: "\\bquiero\\s+[a-záéíóúñ]+(ar|er|ir)\\b", label: "something you want: *quiero* plus a verb" },
      { type: "regex", pattern: "\\btengo que\\s+[a-záéíóúñ]+(ar|er|ir)\\b", label: "something you have to do: *tengo que* plus a verb" }
    ],
    model: "Este año quiero viajar a Colombia. Esta semana tengo que terminar un proyecto en el trabajo."
  },
  pitfalls: [
    "*Quiero voy* changes both verbs: only the first moves, *quiero ir*.",
    "*Tengo trabajar* drops a word: *tengo que trabajar*.",
    "*Aprendiendo es difícil* follows English -ing: *aprender es difícil*."
  ]
},

"gr-oraciones-finales-a1": {
  source: "merged",
  hook: {
    line: "Ask anyone why they're learning Spanish and the answer is a goal: to travel, to work, to talk to someone. Spanish starts every goal with *para*.",
    es: "¿Para qué estudias español?\nPara hablar con la familia de mi novia.",
    en: "What are you studying Spanish for?\nTo talk to my girlfriend's family."
  },
  examples: [
    { es: "Trabajo los fines de semana para ganar plata extra.", en: "I work weekends to earn extra money." },
    { es: "Uso esta aplicación para aprender palabras.", en: "I use this app to learn words." },
    { es: "Esta torta es para Diego.", en: "This cake is for Diego." }
  ],
  rule: "*Para* plus the dictionary form says what for:\n*Estudio español para viajar.* I'm studying Spanish to travel.\n*Ahorro para comprar un carro.* I'm saving to buy a car.\nEnglish often says just to; Spanish can't drop *para*.\nThe second verb never changes, even for *nosotros*: *Venimos para aprender.*\nTo ask: *¿Para qué?* What for? The answer starts with *para*: *Para hablar con mi familia.*\nFor a thing's use, *es para* or *sirve para*: *Esto sirve para abrir botellas.*\n*Para* plus a person is for: *Este café es para Laura.*\nAfter *ir* and *salir*, Spanish often uses *a* instead: *Salgo a comprar pan.*",
  readAndPick: [
    { q: "Why does Ana save money?", es: "Ahorro para viajar a México.",
      options: ["To travel to Mexico", "Because she's Mexican", "For a friend there"], answer: 0,
      why: "*Para viajar*: to travel. *Para* plus a verb is the goal." },
    { q: "Who is the coffee for?", es: "Este tinto es para usted, don Jorge.",
      options: ["Don Jorge", "The speaker", "Everyone"], answer: 0,
      why: "*Para* plus a person: for him." },
    { q: "What is this thing for?", es: "Sirve para abrir botellas.",
      options: ["Opening bottles", "Closing bottles", "Washing bottles"], answer: 0,
      why: "*Sirve para*: it's for, it's used to." },
    { q: "What is Diego going out to do?", es: "Salgo a comprar pan.",
      options: ["Buy bread", "Bake some bread", "Eat bread out"], answer: 0,
      why: "After *salir*, *a* plus a verb: what you go out to do." },
    { q: "What does Laura want to know?", es: "¿Para qué necesitas la computadora?",
      options: ["What you need it for", "When you need it", "If you need it"], answer: 0,
      why: "*¿Para qué?*: what for?" }
  ],
  yourTurn: [
    { en: "I'm studying Spanish to travel.", es: "Estudio español para viajar.", accept: ["Estoy estudiando español para viajar."] },
    { en: "What are you saving for? (to a friend)", es: "¿Para qué ahorras?", accept: ["¿Para qué estás ahorrando?"] },
    { en: "Answer it: To buy a car.", es: "Para comprar un carro.", accept: [] },
    { en: "This coffee is for Laura.", es: "Este café es para Laura.", accept: ["Este tinto es para Laura."] },
    { en: "I work weekends to earn extra money.", es: "Trabajo los fines de semana para ganar plata extra.", accept: ["Trabajo los fines de semana para ganar dinero extra."] }
  ],
  personal: {
    prompt: "Why are you learning Spanish? Give the real goal, or two, each starting with *para*.",
    constraints: [
      { type: "person", person: "yo", label: "what you do, with an I form: *estudio*, *aprendo*" },
      { type: "regex", pattern: "\\bpara\\s+[a-záéíóúñ]+(ar|er|ir)\\b", label: "a goal: *para* plus a verb" }
    ],
    model: "Estudio español para viajar por Colombia y para hablar con mis vecinos."
  },
  pitfalls: [
    "*Estudio por viajar* is a slip: a goal takes *para*, *estudio para viajar*.",
    "*Para compro* changes the second verb: after *para*, the dictionary form, *para comprar*.",
    "*¿Por qué?* asks the reason, *¿para qué?* the goal: *Porque quiero viajar*, or *Para viajar*."
  ]
},

"fn-corregir-informacion-a1": {
  source: "merged",
  hook: {
    line: "Someone has a fact about you wrong. A bare no starts an argument; a correction says what's wrong and then what's right.",
    es: "Eres de Estados Unidos, ¿no?\nNo, no soy de Estados Unidos, soy de Canadá.",
    en: "You're from the United States, aren't you?\nNo, I'm not from the United States, I'm from Canada."
  },
  examples: [
    { es: "El museo cierra a las seis.\nNo, cierra a las ocho.", en: "The museum closes at six.\nNo, it closes at eight." },
    { es: "¿Sabes dónde está la estación?\nNo sé, no soy de aquí.", en: "Do you know where the station is?\nI don't know, I'm not from here." },
    { es: "¿Conoces Medellín?\nSí, fui el año pasado.", en: "Have you been to Medellín?\nYes, I went last year." }
  ],
  rule: "A correction has two moves: say no, then give the right fact.\n*No, no es de Cali, es de Medellín.* The first *no* answers; the second goes with the verb.\nIf they said something negative that isn't true, flip it with *sí*: *¿No tienes hermanos? Sí, sí tengo. Tengo una hermana.*\nFor I don't know, Spanish has two verbs:\n*saber*: facts and skills. *No sé dónde está. No sé nadar.*\n*conocer*: places you've been and people you've met. *No conozco Cartagena. No conozco a tu hermano.*\nWith people, *conocer* takes *a*.\nThe test: could you look it up or learn it? *Saber*. Could you visit it or meet it? *Conocer*.",
  readAndPick: [
    { q: "Is Katrin German?", es: "No, no es alemana, es austriaca.",
      options: ["No, she's Austrian", "Yes, from Berlin", "We don't know"], answer: 0,
      why: "Two moves: *no es alemana*, then the fact, *es austriaca*." },
    { q: "Does Diego have brothers or sisters?", es: "¿No tienes hermanos?\nSí, sí tengo. Tengo dos.",
      options: ["Yes, two", "No, none at all", "Just one"], answer: 0,
      why: "*Sí, sí tengo* flips the no. Then the fact: two." },
    { q: "What can't Ana do?", es: "No sé nadar.",
      options: ["Swim", "Dance", "Cook"], answer: 0,
      why: "*Saber* plus a verb is a skill: I don't know how to swim." },
    { q: "What does Sam mean?", es: "No conozco Cartagena.",
      options: ["He's never been there", "He can't find it", "He doesn't like it"], answer: 0,
      why: "*Conocer* plus a place: you've been there." },
    { q: "What does Laura want to know?", es: "¿Conoces a mi hermano?",
      options: ["If you've met him", "Where he is now", "If he's at home right now"], answer: 0,
      why: "*Conocer a* plus a person: you've met them." }
  ],
  yourTurn: [
    { en: "Correct them: No, he's not from Cali, he's from Medellín.", es: "No, no es de Cali, es de Medellín.", accept: ["No, es de Medellín."] },
    { en: "Someone says you don't have siblings. You do: Yes, I do. I have a sister.", es: "Sí, sí tengo. Tengo una hermana.", accept: ["Sí, tengo una hermana.", "Sí, sí tengo una hermana."] },
    { en: "I don't know where the station is.", es: "No sé dónde está la estación.", accept: ["No sé dónde queda la estación."] },
    { en: "I don't know how to swim.", es: "No sé nadar.", accept: [] },
    { en: "I don't know your brother. (to a friend)", es: "No conozco a tu hermano.", accept: [] }
  ],
  personal: {
    prompt: "Correct a wrong fact about yourself in the two moves, then say one thing you don't know, with *no sé* or *no conozco*.",
    constraints: [
      { type: "regex", pattern: "\\bno,\\s*no\\b|\\bs[ií],\\s*s[ií](?![a-záéíóúñ])", label: "the two moves: *No, no…* or *Sí, sí…*" },
      { type: "containsAny", words: ["no sé", "no conozco"], label: "something you don't know: *no sé* or *no conozco*" }
    ],
    model: "No, no soy de Toronto, soy de Halifax. No conozco Cartagena, pero quiero ir."
  },
  pitfalls: [
    "*No, no es de Cali* stops halfway: add the fact, *es de Medellín*.",
    "*No conozco nadar* is a slip: a skill takes *saber*, *no sé nadar*.",
    "*Conozco tu hermano* drops a word: with people, *conozco a tu hermano*."
  ]
},

"task-pedir": {
  source: "old",
  hook: {
    line: "Three short requests, three different openings. *Quiero*, *necesito* and *¿me puede…?* each sound different, and each takes a plain verb after it.",
    es: "Buenos días. Necesito hablar con la doctora Ruiz.\nHoy no puede, lo siento. ¿Mañana a las diez?\nPerfecto, muchas gracias.",
    en: "Good morning. I need to speak to Dr Ruiz.\nShe can't today, I'm sorry. Tomorrow at ten?\nPerfect, thank you very much."
  },
  examples: [
    { es: "¿Me puedes ayudar un momento?", en: "Can you help me for a moment? (to a friend)" },
    { es: "Quiero cambiar esta camisa. Me queda pequeña.", en: "I want to exchange this shirt. It's too small for me." },
    { es: "Tengo que estar en el aeropuerto a las seis.", en: "I have to be at the airport at six." }
  ],
  rule: "Each request opens with a verb, then the plain dictionary form:\n*Quiero cambiar esta camisa.* What you want. To a stranger it can sound blunt; *quería* is softer.\n*Necesito hablar con la doctora.* What you need: it sounds reasonable.\n*Tengo que salir a las seis.* What you have no choice about.\n*¿Me puede ayudar?* Can you help me? to someone you call *usted*; *¿me puedes ayudar?* to a friend.\nAdd *por favor*, and thank them: *gracias*, *muy amable*.\nWhen the answer is no, offer another way: *¿Y mañana? ¿A qué hora puede?*",
  readAndPick: [
    { q: "What does Laura need?", es: "Necesito hablar con el gerente.",
      options: ["To speak to the manager", "To call the manager", "To be the manager"], answer: 0,
      why: "*Necesito hablar*: I need to speak." },
    { q: "Who is Diego asking for help?", es: "¿Me puede ayudar, por favor?",
      options: ["Someone he calls usted", "A close friend", "His little brother"], answer: 0,
      why: "*Puede*, not *puedes*: the polite *usted* form." },
    { q: "Does Ana have a choice?", es: "Tengo que trabajar el domingo.",
      options: ["No, she has to", "Yes, she wants to", "Yes, if she can"], answer: 0,
      why: "*Tengo que*: I have to. No choice." },
    { q: "Can the doctor see Sam today?", es: "Hoy no puede, lo siento. ¿Mañana a las diez?",
      options: ["No, but tomorrow at ten", "Yes, at ten today", "No, not this week"], answer: 0,
      why: "*Hoy no puede*: she can't today. She offers tomorrow." },
    { q: "What is the man asking for?", es: "¿Me puede decir dónde queda el baño?",
      options: ["Where the bathroom is", "To use the phone", "The time"], answer: 0,
      why: "*¿Me puede decir…?*: can you tell me…?" }
  ],
  yourTurn: [
    { en: "I need to speak to the doctor. (a woman)", es: "Necesito hablar con la doctora.", accept: [] },
    { en: "Can you help me, please? (polite)", es: "¿Me puede ayudar, por favor?", accept: ["¿Puede ayudarme, por favor?", "¿Usted me puede ayudar, por favor?"] },
    { en: "Can you help me for a moment? (to a friend)", es: "¿Me puedes ayudar un momento?", accept: ["¿Puedes ayudarme un momento?"] },
    { en: "I have to work on Sunday.", es: "Tengo que trabajar el domingo.", accept: ["El domingo tengo que trabajar."] },
    { en: "I want to exchange this shirt.", es: "Quiero cambiar esta camisa.", accept: ["[Quería|Quisiera] cambiar esta camisa."] }
  ],
  personal: {
    prompt: "Write three short requests for real things this week: one with *quiero*, one with *necesito*, one with *¿me puede…?* or *¿me puedes…?*",
    constraints: [
      { type: "containsWord", word: "quiero", label: "one with *quiero*" },
      { type: "containsWord", word: "necesito", label: "one with *necesito*" },
      { type: "regex", pattern: "\\bme\\s+pued(e|es)\\b", label: "one with *¿me puede…?* or *¿me puedes…?*" },
      { type: "containsAny", words: ["por favor", "gracias"], label: "*por favor* or *gracias*" }
    ],
    model: "Quiero cambiar mi cita. Necesito hablar con la doctora. ¿Me puede llamar mañana, por favor?"
  },
  pitfalls: [
    "*Quiero cambio* changes the second verb: *quiero cambiar*.",
    "To a stranger, *¿me puedes…?* is too close: *¿me puede…?*",
    "*Tengo trabajar* drops a word: *tengo que trabajar*."
  ]
},

/* ---- unit 11 · Join it up ---------------------------------------------- */

"dc-conectores-a1": {
  source: "old",
  hook: {
    line: "Ten true sentences in a row still sound like a list. A handful of small words turn the list into talk, and you already half know most of them.",
    es: "Vivo en Bogotá, pero soy de Cali.\nMe gusta Bogotá porque hay mucho que hacer.\nPero hace frío, ¿no?",
    en: "I live in Bogotá, but I'm from Cali.\nI like Bogotá because there's a lot to do.\nBut it's cold, isn't it?"
  },
  examples: [
    { es: "Me gusta la comida colombiana, por ejemplo el ajiaco.", en: "I like Colombian food, for example ajiaco." },
    { es: "Llego el doce, o sea, el sábado.", en: "I arrive on the twelfth, I mean, on Saturday." },
    { es: "Madrid está en la costa.\nNo, no está en la costa.", en: "Madrid is on the coast.\nNo, it isn't on the coast." }
  ],
  rule: "Small words join your sentences, each with one job:\n*y*: and. *Tengo dos hermanos y una hermana.*\n*pero*: but. *Me gusta, pero es caro.*\n*porque*: because, then a whole sentence. *Estudio porque quiero vivir aquí.*\n*por ejemplo*: for example.\n*o sea*: I mean, in other words. *Llego el doce, o sea, el sábado.*\n*también*: too. *tampoco*: not either.\nA tag at the end asks the listener to agree: *Hace frío, ¿no?* In Colombia you also hear *¿cierto?*\nTo correct someone, say *no* twice: *No, no está en la costa.* The same doubled *no* can also agree with a no sentence: *No es difícil. No, no es difícil.*",
  readAndPick: [
    { q: "Why is Laura studying Spanish?", es: "Estudio español porque quiero trabajar en México.",
      options: ["To work in Mexico", "Because she's Mexican", "For a class there"], answer: 0,
      why: "*Porque* gives the reason: she wants to work in Mexico." },
    { q: "What does Diego think of the restaurant?", es: "La comida es buena, pero es muy cara.",
      options: ["Good food, but pricey", "Cheap and good", "Bad food, and expensive too"], answer: 0,
      why: "*Pero* turns against the first half: good, but expensive." },
    { q: "Is Sam really asking a question?", es: "Hoy hace calor, ¿no?",
      options: ["No, he wants you to agree", "Yes, he doesn't know", "Yes, he wants the time"], answer: 0,
      why: "*¿No?* at the end asks you to nod, not to answer." },
    { q: "What is Ana doing with o sea?", es: "Llego el doce, o sea, el sábado.",
      options: ["Saying it another way", "Changing the date", "Asking a question"], answer: 0,
      why: "*O sea*: I mean, in other words." },
    { q: "Does Diego agree?", es: "No es difícil.\nNo, no es difícil.",
      options: ["Yes, he agrees", "No, he disagrees", "He isn't sure"], answer: 0,
      why: "A doubled *no* after a no sentence agrees with it." }
  ],
  yourTurn: [
    { en: "I like it, but it's expensive.", es: "Me gusta, pero es caro.", accept: ["Me gusta, pero es cara."] },
    { en: "I'm studying Spanish because I want to live here.", es: "Estudio español porque quiero vivir aquí.", accept: ["Estudio español porque quiero vivir acá.", "Estoy estudiando español porque quiero vivir [aquí|acá]."] },
    { en: "It's hot today, isn't it?", es: "Hoy hace calor, ¿no?", accept: ["Hace calor hoy, ¿no?", "Hoy hace calor, ¿[cierto|verdad]?", "Hace calor hoy, ¿[cierto|verdad]?"] },
    { en: "I like Colombian food, for example ajiaco.", es: "Me gusta la comida colombiana, por ejemplo el ajiaco.", accept: [] },
    { en: "Correct them: No, it isn't on Monday, it's on Tuesday.", es: "No, no es el lunes, es el martes.", accept: [] }
  ],
  personal: {
    prompt: "Write three or four lines about where you live, joined with *y*, *pero* and *porque*.",
    constraints: [
      { type: "regex", pattern: "\\by\\b", label: "*y*" },
      { type: "containsWord", word: "pero", label: "*pero*" },
      { type: "containsWord", word: "porque", label: "*porque*" }
    ],
    model: "Vivo en Toronto y trabajo en una escuela. Me gusta mi barrio porque es tranquilo, pero en invierno hace mucho frío."
  },
  pitfalls: [
    "*Por qué*, two words with a mark, asks; *porque*, one word, answers.",
    "*No también* is not Spanish: *tampoco*.",
    "*Para quiero* mixes two: a whole sentence after it needs *porque*, *porque quiero*."
  ]
},

"gr-relativo-que-a1": {
  source: "merged",
  hook: {
    line: "Two short sentences about one person sound like a list. One small word joins them, and Spanish never leaves it out the way English does.",
    es: "Tengo una amiga. Mi amiga vive en Medellín.\nTengo una amiga que vive en Medellín.",
    en: "I have a friend. My friend lives in Medellín.\nI have a friend who lives in Medellín."
  },
  examples: [
    { es: "El señor que vende arepas es mi vecino.", en: "The man who sells arepas is my neighbour." },
    { es: "El libro que leo es muy bueno.", en: "The book I'm reading is really good." },
    { es: "¿Conoces el café que abrieron en la esquina?", en: "Do you know the café they opened on the corner?" }
  ],
  rule: "To say which one, put *que* right after the person or thing, then a short sentence about it:\n*la profesora que tengo*: the teacher I have\n*el chico que vive al lado*: the boy who lives next door\nEnglish has who, which, that or nothing at all. Spanish has one word, and it never changes: *el libro que*, *la casa que*, *los amigos que*.\nThe trap: English drops it. The book I'm reading. Spanish never does: *el libro que leo*.\nThe verb after *que* says who does it: *el libro que leo* is the one I'm reading; *el libro que lee* is the one she's reading.\nNo comma before this *que*.",
  readAndPick: [
    { q: "Which teacher does Ana mean?", es: "La profesora que tengo es muy buena.",
      options: ["The one she has", "A new one", "The one she wants"], answer: 0,
      why: "*Que tengo*: the one I have." },
    { q: "Who is reading the book?", es: "El libro que lee Diego es de Laura.",
      options: ["Diego", "Laura", "The speaker"], answer: 0,
      why: "*Que lee Diego*: the one Diego is reading. It belongs to Laura." },
    { q: "Who lives next door?", es: "El chico que vive al lado es colombiano.",
      options: ["The boy", "The speaker", "A whole family"], answer: 0,
      why: "*El chico que vive al lado*: the boy who lives next door." },
    { q: "Which house does Sam like?", es: "Me gusta la casa que tienen en la playa.",
      options: ["Their beach house", "A house he saw", "His own house"], answer: 0,
      why: "*Que tienen en la playa*: the one they have at the beach." },
    { q: "Who found the letter?", es: "La carta que encontré es de mi abuela.",
      options: ["The speaker", "Her grandmother", "Someone else"], answer: 0,
      why: "*Encontré*: I found. The letter is from her grandmother." }
  ],
  yourTurn: [
    { en: "I have a friend who lives in Medellín.", es: "Tengo una amiga que vive en Medellín.", accept: ["Tengo un amigo que vive en Medellín."] },
    { en: "The book I'm reading is really good.", es: "El libro que leo es muy bueno.", accept: ["El libro que estoy leyendo es muy bueno."] },
    { en: "The man who sells arepas is my neighbour.", es: "El señor que vende arepas es mi vecino.", accept: ["El hombre que vende arepas es mi vecino."] },
    { en: "The teacher I have is from Cali.", es: "La profesora que tengo es de Cali.", accept: ["El profesor que tengo es de Cali."] }
  ],
  personal: {
    prompt: "Describe a person or a place you like with *que*: the friend who…, the café that…",
    constraints: [
      { type: "regex", pattern: "\\b(el|la|los|las|un|una|unos|unas|mi|mis)\\s+[a-záéíóúñ]+\\s+que\\s+[a-záéíóúñ]+", label: "a person or thing, then *que* and a short sentence" },
      { type: "minWords", n: 6, label: "at least six words" }
    ],
    model: "Tengo un vecino que cocina muy bien. El café que me gusta queda al lado del parque."
  },
  pitfalls: [
    "*El libro leo* drops the joining word: *el libro que leo*.",
    "*Una amiga quien vive aquí* is a slip: after a person, plain *que*, *una amiga que vive aquí*.",
    "No comma before this *que*: *la casa que tiene tres cuartos*."
  ]
},

"gr-objeto-directo-a1": {
  source: "merged",
  hook: {
    line: "Two tiny words English leaves out and Spanish never does: an *a* in front of a person, and a *que* after I think.",
    es: "¿Conoces a mi hermano?\nNo, pero creo que trabaja con Laura.",
    en: "Do you know my brother?\nNo, but I think he works with Laura."
  },
  examples: [
    { es: "Visito a mis abuelos los domingos.", en: "I visit my grandparents on Sundays." },
    { es: "Tengo tres primos en Chile.", en: "I have three cousins in Chile." },
    { es: "Creo que es una buena idea.", en: "I think it's a good idea." }
  ],
  rule: "When the verb lands on a particular person, Spanish puts *a* in front of them. English has nothing there:\n*Veo a Laura los lunes.* I see Laura on Mondays.\n*Busco a mi hija.* I'm looking for my daughter.\nThings and places take no *a*: *Veo la televisión. Conozco Cali.*\nTwo cases skip it even with people: after *tener*, *Tengo dos hermanos*, and when it's anyone at all, *Busco un mesero*.\n*A* and *el* join: *Llamo al doctor.*\nAnd English often hides that: I think you're right. Spanish never does:\n*Creo que tienes razón. Sé que es tarde. Laura dice que viene.*\nShort answers: *Creo que sí. Creo que no.*",
  readAndPick: [
    { q: "Who is Ana looking for?", es: "Busco a mi hija.",
      options: ["Her daughter", "A babysitter", "Her keys"], answer: 0,
      why: "*A mi hija*: a particular person, so the *a*." },
    { q: "Is Diego looking for a particular waiter?", es: "Busco un mesero.",
      options: ["No, any waiter", "Yes, his friend", "Yes, the new one"], answer: 0,
      why: "No *a*: any waiter will do." },
    { q: "What does Laura think?", es: "Creo que tienes razón.",
      options: ["That you're right", "That you're wrong", "That it's getting late"], answer: 0,
      why: "*Creo que*: I think. *Tienes razón*: you're right." },
    { q: "Has Sam been to Cali?", es: "Conozco Cali, pero no conozco a tu familia.",
      options: ["Yes, but not your family", "No, nor your family", "Only your family"], answer: 0,
      why: "*Conozco Cali*: a place, no *a*. *A tu familia*: people, with *a*." },
    { q: "Is Laura coming?", es: "Laura dice que no viene.",
      options: ["No, she says not", "Yes, she says so", "She hasn't said"], answer: 0,
      why: "*Dice que no viene*: she says she isn't coming." }
  ],
  yourTurn: [
    { en: "I visit my grandparents on Sundays.", es: "Visito a mis abuelos los domingos.", accept: ["Los domingos visito a mis abuelos."] },
    { en: "I have two brothers.", es: "Tengo dos hermanos.", accept: [] },
    { en: "Do you know my sister? (to a friend)", es: "¿Conoces a mi hermana?", accept: [] },
    { en: "I think you're right. (to a friend)", es: "Creo que tienes razón.", accept: [] },
    { en: "I think so.", es: "Creo que sí.", accept: [] }
  ],
  personal: {
    prompt: "Write two true lines: someone you see or call often, with *a*, and something you think, with *creo que*.",
    constraints: [
      { type: "regex", pattern: "\\b(veo|visito|llamo|conozco|busco|espero|ayudo|extraño|quiero)\\s+(a|al)\\s+\\S+", label: "a person after the verb, with *a*: *llamo a mi mamá*" },
      { type: "containsWord", word: "creo que", label: "what you think: *creo que…*" }
    ],
    model: "Llamo a mi mamá todos los domingos. Creo que mi barrio es muy tranquilo."
  },
  pitfalls: [
    "*Visito mis abuelos* drops the *a*: *visito a mis abuelos*.",
    "*Tengo a dos hermanos* is a slip: after *tener*, no *a*.",
    "*Creo es tarde* drops the *que*: *creo que es tarde*."
  ]
},

"gr-cuantificadores-no-universales-a1": {
  source: "merged",
  hook: {
    line: "Not much and a little sound alike in English, but one is a complaint and the other is good news. In Spanish the difference is one small word: *un*.",
    es: "¿Hablas español?\nUn poco. Pero entiendo bastante.",
    en: "Do you speak Spanish?\nA little. But I understand quite a lot."
  },
  examples: [
    { es: "Tengo poco tiempo, pero muchas ganas de aprender.", en: "I don't have much time, but I really want to learn." },
    { es: "Hoy hay demasiada gente en el bus.", en: "There are far too many people on the bus today." },
    { es: "Estoy un poco cansado.", en: "I'm a little tired." }
  ],
  rule: "Before a thing, these words match it:\n*mucho tiempo, mucha gente, muchos amigos, muchas ganas*\n*poco dinero, poca leche, pocos clientes*\n*bastante* only adds *-s*: *bastantes sillas*.\nAfter a verb they never change: *Trabaja mucho. Come poco. Duerme bastante.*\nBefore a describing word, *mucho* turns into *muy*; the others stay as they are: *muy caro*, *bastante caro*, *demasiado caro*.\n*Poco* is not much, a little sad. *Un poco* is a little, and fine: *Hablo un poco de español.*\n*Demasiado* is too much, a complaint: *Hay demasiada gente.*",
  readAndPick: [
    { q: "Does Laura have a lot of friends here?", es: "Tengo pocos amigos aquí.",
      options: ["No, not many", "Yes, quite a lot", "Yes, too many"], answer: 0,
      why: "*Pocos amigos*: not many friends. *Poco* matches *amigos*." },
    { q: "How does Diego feel about his Spanish?", es: "Hablo un poco de español.",
      options: ["He gets by", "He's fluent", "He speaks none"], answer: 0,
      why: "*Un poco*: a little, said with a smile." },
    { q: "Is Ana happy with the crowd?", es: "Hay demasiada gente.",
      options: ["No, it's too much", "Yes, it's lively", "There's nobody"], answer: 0,
      why: "*Demasiada*: too much, a complaint." },
    { q: "How expensive is the room?", es: "El cuarto es bastante caro.",
      options: ["Quite expensive", "Far too expensive", "Not expensive"], answer: 0,
      why: "*Bastante caro*: quite expensive. Too expensive is *demasiado caro*." },
    { q: "How much does Sam work?", es: "Sam trabaja muchísimo.",
      options: ["A huge amount", "Hardly at all", "A little"], answer: 0,
      why: "*Muchísimo*: a huge amount." }
  ],
  yourTurn: [
    { en: "I speak a little Spanish.", es: "Hablo un poco de español.", accept: ["Yo hablo un poco de español."] },
    { en: "There are a lot of people.", es: "Hay mucha gente.", accept: [] },
    { en: "I don't have much time.", es: "Tengo poco tiempo.", accept: ["No tengo mucho tiempo."] },
    { en: "I'm a little tired.", es: "Estoy un poco cansado.", accept: ["Estoy un poco cansada."] },
    { en: "The rent is too expensive.", es: "El arriendo es demasiado caro.", accept: [] }
  ],
  personal: {
    prompt: "Describe your home honestly in two or three lines: something there's a lot of, something there's not much of, and one thing that's *demasiado* something.",
    constraints: [
      { type: "regex", pattern: "\\bmuch[oa]s?\\s+[a-záéíóúñ]+|\\bbastantes?\\s+[a-záéíóúñ]+", label: "a lot of something: *mucho*, *mucha*, *bastante*" },
      { type: "regex", pattern: "\\bpoc[oa]s?\\s+[a-záéíóúñ]+", label: "not much of something: *poco*, *poca*" },
      { type: "regex", pattern: "\\bdemasiad[oa]s?\\b", label: "something *demasiado*" }
    ],
    model: "Mi apartamento tiene mucha luz, pero hay poco espacio. La cocina es demasiado pequeña."
  },
  pitfalls: [
    "*Mucho gente* is a slip: before a *la* word, *mucha gente*.",
    "*Un poco de cansado* is a slip: *de* only comes before a thing, *un poco de agua*.",
    "*Demasiada cara* is a slip: before a describing word *demasiado* never changes."
  ]
},

"task-contar": {
  source: "old",
  hook: {
    line: "The payoff of this unit: take short true sentences and join them. The result is shorter, and it finally sounds like you talking.",
    es: "Antes: Tengo una hermana. Vive en Cali. Es profesora. Trabaja mucho.\nDespués: Tengo una hermana que vive en Cali. Es profesora y trabaja mucho.",
    en: "Before: I have a sister. She lives in Cali. She's a teacher. She works a lot.\nAfter: I have a sister who lives in Cali. She's a teacher and she works a lot."
  },
  examples: [
    { es: "Tengo un trabajo que me gusta, pero gano poco.", en: "I have a job I like, but I don't earn much." },
    { es: "Hablamos casi todos los días porque vive lejos.", en: "We talk almost every day because she lives far away." },
    { es: "Mi hermana también es profesora, como mi mamá.", en: "My sister is a teacher too, like my mum." }
  ],
  rule: "Take a short description you have written and join it up. It should get shorter, not longer.\nThe same person or thing twice? Join with *que*: *Tengo una hermana que vive en Cali.*\nTwo facts side by side: *y*.\nOne that turns against the other: *pero*.\nA reason: *porque*.\nA matching fact: *también*. A matching no: *tampoco*.\nDrop what repeats: once we know who it is, Spanish doesn't need *ella* again.\nThen read it aloud. If you run out of breath, put one full stop back.",
  readAndPick: [
    { q: "Why does Laura talk to her sister so often?", es: "Hablo con mi hermana casi todos los días porque vive lejos.",
      options: ["She lives far away", "She's lonely in the city", "She's not well"], answer: 0,
      why: "*Porque vive lejos*: because she lives far away." },
    { q: "Does Diego like his job?", es: "Tengo un trabajo que me gusta, pero gano poco.",
      options: ["Yes, but it pays little", "No, but it pays really well", "No, and it pays little"], answer: 0,
      why: "*Que me gusta*: a job I like. *Pero gano poco*: but I don't earn much." },
    { q: "Who cooks well?", es: "Tengo un amigo que cocina muy bien.",
      options: ["A friend of the speaker", "The speaker, at home", "The speaker's whole family"], answer: 0,
      why: "*Un amigo que cocina*: a friend who cooks." },
    { q: "Is Ana's brother a doctor?", es: "Mi papá es médico y mi hermano también.",
      options: ["Yes, like their father", "No, only their father", "We aren't told"], answer: 0,
      why: "*Mi hermano también*: my brother too." },
    { q: "Does Sam eat meat?", es: "Mi novia no come carne y yo tampoco.",
      options: ["No, he doesn't either", "Yes, but she doesn't", "Only sometimes"], answer: 0,
      why: "*Yo tampoco*: me neither." }
  ],
  yourTurn: [
    { en: "Join them: *Tengo una hermana. Vive en Cali.* I have a sister who lives in Cali.", es: "Tengo una hermana que vive en Cali.", accept: [] },
    { en: "Join them with *pero*: I like my job, but I don't earn much.", es: "Me gusta mi trabajo, pero gano poco.", accept: ["Me gusta mi trabajo, pero no gano mucho."] },
    { en: "Join them with *porque*: We talk every day because she lives far away.", es: "Hablamos todos los días porque vive lejos.", accept: ["Hablamos todos los días porque ella vive lejos."] },
    { en: "My dad is a doctor and my brother is too.", es: "Mi papá es médico y mi hermano también.", accept: [] }
  ],
  personal: {
    prompt: "Take three or four short true sentences about someone in your life and join them into two, with *que* and one of *y*, *pero* or *porque*.",
    constraints: [
      { type: "regex", pattern: "[a-záéíóúñ]+\\s+que\\s+[a-záéíóúñ]+", label: "*que* joining a person to a fact" },
      { type: "regex", pattern: "\\b(pero|porque)\\b", label: "*pero* or *porque*" }
    ],
    model: "Tengo un amigo que vive en Montreal y trabaja en un hospital. Hablamos poco porque trabaja muchísimo, pero nos vemos en diciembre."
  },
  pitfalls: [
    "*Tengo una hermana vive en Cali* drops the joining word: *que vive en Cali*.",
    "*Y… y… y…* is a list again: change one *y* for *pero* or *porque*."
  ]
},

/* ---- unit 12 · The words behind the words ------------------------------ */

"gender-articles": {
  source: "merged",
  hook: {
    line: "In Spanish one choice ripples down the sentence. Pick *el* or *la*, and the small words and the describing words all fall into line.",
    es: "La niña pequeña tiene un gato negro.\nLas niñas pequeñas tienen dos gatos negros.",
    en: "The little girl has a black cat.\nThe little girls have two black cats."
  },
  examples: [
    { es: "Mi casa es pequeña, pero la cocina es muy bonita.", en: "My house is small, but the kitchen is really nice." },
    { es: "Los carros nuevos son caros.", en: "New cars are expensive." },
    { es: "Una mesa blanca y dos sillas negras.", en: "A white table and two black chairs." }
  ],
  rule: "Every word for a thing is an *el* word or a *la* word, and everything around it follows:\n*el carro rojo*, *la casa roja*\n*los carros rojos*, *las casas rojas*\n*Un* and *una*, *unos* and *unas*, *este* and *esta*, *mucho* and *mucha* all match the same way.\nChange one and you change them all: *la casa blanca*, *las casas blancas*.\nThe ending is a good first guess: *-o* is usually *el*, *-a* usually *la*. Anything else you learn with its word: *el pan*, *la leche*, *el café*, *la clase*.\nThat's why the word list shows *el* or *la*: learn the pair, never the word alone.\nFor people, it follows the person: *el doctor*, *la doctora*; *el estudiante*, *la estudiante*.",
  readAndPick: [
    { q: "How many cats?", es: "Tengo unos gatos negros.",
      options: ["More than one", "Just the one cat", "None at all"], answer: 0,
      why: "*Unos gatos negros*: every word carries the *-s*." },
    { q: "Is the house big?", es: "La casa es pequeña, pero bonita.",
      options: ["No, small but nice", "Yes, and nice", "No, and ugly"], answer: 0,
      why: "*Pequeña*: small, matching *la casa*." },
    { q: "Is the doctor a man or a woman?", es: "La doctora Ruiz es muy amable.",
      options: ["A woman", "A man", "We can't tell"], answer: 0,
      why: "*La doctora*: for people, it follows the person." },
    { q: "Which chair does Laura want?", es: "Quiero la silla roja, no la negra.",
      options: ["The red one", "The black one", "Both of them"], answer: 0,
      why: "*La silla roja*: the red chair. *La negra* is the black one." },
    { q: "How many tables are there?", es: "Hay dos mesas blancas.",
      options: ["Two", "One", "Three"], answer: 0,
      why: "*Dos mesas blancas*: two, and both words carry the *-s*." }
  ],
  yourTurn: [
    { en: "the white house", es: "la casa blanca", accept: [] },
    { en: "the white houses", es: "las casas blancas", accept: [] },
    { en: "a black cat", es: "un gato negro", accept: [] },
    { en: "The new cars are expensive.", es: "Los carros nuevos son caros.", accept: [] },
    { en: "The kitchen is very small.", es: "La cocina es muy pequeña.", accept: [] }
  ],
  personal: {
    prompt: "Describe three things in the room where you are, each with *el* or *la* and a describing word that matches.",
    constraints: [
      { type: "regex", pattern: "\\b(el|la|un|una)\\s+[a-záéíóúñ]+\\s+[a-záéíóúñ]+", label: "a thing with *el* or *la* and a describing word" },
      { type: "regex", pattern: "\\b(los|las|unos|unas)\\s+[a-záéíóúñ]+s\\b", label: "more than one: *los*, *las*" }
    ],
    model: "Hay una mesa blanca y una lámpara pequeña. Las sillas negras son nuevas."
  },
  pitfalls: [
    "*La casa blanco* is a slip: the describing word follows *casa*, *la casa blanca*.",
    "*Las casas blanca* stops halfway: every word takes the *-s*, *las casas blancas*.",
    "Learn *el* or *la* with each word: *el pan*, *la leche*. The ending can't always tell you."
  ]
},

"gr-genero-sustantivos-a1": {
  source: "merged",
  hook: {
    line: "The *-o* and *-a* guess works most of the time, but some of the most common words break it. The good news: there are only about a dozen you meet every day.",
    es: "Buenos días. ¿Cuál es el problema?\nMe duele la mano.",
    en: "Good morning. What's the problem?\nMy hand hurts."
  },
  examples: [
    { es: "El español es un idioma bonito.", en: "Spanish is a beautiful language." },
    { es: "¿Tienes una foto de tu moto nueva?", en: "Do you have a photo of your new motorbike?" },
    { es: "La canción del programa es muy buena.", en: "The song from the show is really good." }
  ],
  rule: "*-o* is usually *el* and *-a* usually *la*, but a few common words break the pattern. Learn them whole:\n*el día*, *el mapa*, *el problema*, *el idioma*, *el programa*: *el* words though they end in *-a*. Most words in *-ma* are like this.\n*la mano*, *la foto*, *la moto*, *la radio*: *la* words though they end in *-o*. *Foto* and *moto* are short for *fotografía* and *motocicleta*.\nEndings you can trust: *-ción*, *-sión* and -dad are always *la*: *la canción*, *la televisión*, *la ciudad*.\n*El agua* is a *la* word that takes *el* because of its first sound: *el agua fría*.\nSome pairs are two different words: *el hombre*, *la mujer*; *el papá*, *la mamá*.",
  readAndPick: [
    { q: "Is *día* an *el* word or a *la* word?", es: "Hoy es un día muy bonito.",
      options: ["An el word", "A la word", "Either one"], answer: 0,
      why: "*Un día bonito*: an *el* word, though it ends in *-a*." },
    { q: "What's wrong with Sam?", es: "Tengo un problema con la mano.",
      options: ["His hand", "His arm", "His phone"], answer: 0,
      why: "*El problema*, *la mano*: two words that break the pattern." },
    { q: "What does Laura want to see?", es: "¿Me muestras la foto?",
      options: ["The photo", "The map", "The motorbike"], answer: 0,
      why: "*La foto*: short for *la fotografía*." },
    { q: "How many languages does Diego speak?", es: "Hablo tres idiomas.",
      options: ["Three", "Two", "Four"], answer: 0,
      why: "*Tres idiomas*: three languages. *El idioma* is an *el* word." },
    { q: "What's the water like?", es: "El agua está muy fría.",
      options: ["Very cold", "Very hot", "Quite warm"], answer: 0,
      why: "*El agua* takes *el*, but it's a *la* word: *fría*." }
  ],
  yourTurn: [
    { en: "the problem", es: "el problema", accept: [] },
    { en: "the hand", es: "la mano", accept: [] },
    { en: "a photo", es: "una foto", accept: [] },
    { en: "The water is cold.", es: "El agua está fría.", accept: ["El agua es fría."] },
    { en: "Spanish is a beautiful language.", es: "El español es un idioma bonito.", accept: ["El español es un idioma muy bonito.", "El español es un idioma hermoso."] }
  ],
  personal: {
    prompt: "Write two true lines with at least one of these: *el día*, *el problema*, *el idioma*, *la mano*, *la foto*, *el agua*.",
    constraints: [
      { type: "regex", pattern: "\\b(el|un|mi|tu|su|buen|mal|este|ese|los|dos|tres|mis)\\s+(d[ií]as?|problemas?|idiomas?|mapas?|programas?|temas?)\\b|\\b(la|una|mi|tu|su|esta|esa|las|mis)\\s+(manos?|fotos?|motos?|radio)\\b|\\bel\\s+agua\\b", label: "one of the words, with its right *el* or *la*" },
      { type: "minWords", n: 8, label: "at least eight words" }
    ],
    model: "Hablo dos idiomas, inglés y francés. Mi problema es que no tengo mucho tiempo para estudiar."
  },
  pitfalls: [
    "*La problema* is a slip: most words in *-ma* are *el* words, *el problema*.",
    "*El foto* is a slip: *foto* is short for *fotografía*, so *la foto*.",
    "*El agua frío* is a slip: *el* comes from the first sound, but it's still a *la* word, *el agua fría*."
  ]
},

"gr-numero-sustantivos-a1": {
  source: "merged",
  hook: {
    line: "More than one is easy for most Spanish words: add an *s*. The catch is that the *s* travels: every word around the thing takes it too.",
    es: "Hay tres hoteles nuevos cerca de la estación.\nY dos buses van al centro.",
    en: "There are three new hotels near the station.\nAnd two buses go downtown."
  },
  examples: [
    { es: "Necesito dos lápices y una hoja.", en: "I need two pencils and a sheet of paper." },
    { es: "Las canciones de Shakira son muy famosas.", en: "Shakira's songs are very famous." },
    { es: "Viví tres meses en Bogotá.", en: "I lived in Bogotá for three months." }
  ],
  rule: "Ends in a vowel: add *-s*. *la mesa, las mesas*; *el café, los cafés*.\nEnds in any other letter: add *-es*. *el hotel, los hoteles*; *la ciudad, las ciudades*; *el bus, los buses*.\n*-z* turns into *-c*: *el lápiz, los lápices*; *una vez, dos veces*.\nA mark on the last part goes away: *la canción, las canciones*; *el inglés, los ingleses*.\nEverything around the word changes too: *los hoteles nuevos*, *unas ciudades bonitas*.\nDays ending in *-s* stay as they are: *el lunes, los lunes*.",
  readAndPick: [
    { q: "How many hotels are there?", es: "Hay un hotel y dos hostales.",
      options: ["One", "Two", "Three"], answer: 0,
      why: "*Un hotel*: one. More than one would be *hoteles*." },
    { q: "Does Laura mean one Monday, or every Monday?", es: "Los lunes tengo clase de inglés.",
      options: ["Every Monday", "This Monday", "Last Monday"], answer: 0,
      why: "*Los lunes*: every Monday. The word itself doesn't change." },
    { q: "What does Diego need?", es: "Necesito dos lápices.",
      options: ["Two pencils", "A pencil", "Two notebooks"], answer: 0,
      why: "*Lápiz* becomes *lápices*: the *z* turns into *c*." },
    { q: "How long did Ana live in Cali?", es: "Viví seis meses en Cali.",
      options: ["Six months", "Six years", "Six weeks"], answer: 0,
      why: "*Mes* ends in *s*, not a vowel, so it takes *-es*: *meses*." },
    { q: "How many times did Sam call?", es: "Llamé tres veces.",
      options: ["Three times", "At three", "For three hours"], answer: 0,
      why: "*Vez* becomes *veces*: three times." }
  ],
  yourTurn: [
    { en: "the hotels", es: "los hoteles", accept: [] },
    { en: "two pencils", es: "dos lápices", accept: [] },
    { en: "the songs", es: "las canciones", accept: [] },
    { en: "There are three new hotels.", es: "Hay tres hoteles nuevos.", accept: [] },
    { en: "I lived in Bogotá for three months.", es: "Viví tres meses en Bogotá.", accept: ["Viví en Bogotá tres meses.", "Viví en Bogotá por tres meses."] }
  ],
  personal: {
    prompt: "Write one or two true lines about things you have more than one of, at home or at work: *Tengo dos…*, *Hay tres…*",
    constraints: [
      { type: "regex", pattern: "\\b(dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|muchos|muchas|unos|unas|\\d+)\\s+[a-záéíóúñ]+s\\b", label: "a number and the thing, with its *-s* or *-es*" },
      { type: "minWords", n: 5, label: "at least five words" }
    ],
    model: "En mi casa hay dos computadores y tres celulares viejos."
  },
  pitfalls: [
    "*Hotels* is English: after a consonant Spanish adds *-es*, *hoteles*.",
    "*Lápizes* is a slip: the *z* turns into *c*, *lápices*.",
    "*Canciónes* keeps a mark it no longer needs: *canciones*."
  ]
},

"gr-articulo-definido-a1": {
  source: "merged",
  hook: {
    line: "English says I like coffee. Spanish says I like the coffee, then leaves the little word out where English would say some. Same words, opposite habits.",
    es: "Me gusta el café, pero no tomo café por la noche.",
    en: "I like coffee, but I don't drink coffee at night."
  },
  examples: [
    { es: "Voy al banco y después al supermercado.", en: "I'm going to the bank and then to the supermarket." },
    { es: "Vengo del trabajo y estoy muy cansada.", en: "I'm coming from work and I'm really tired." },
    { es: "Los niños comen mucho arroz.", en: "Kids eat a lot of rice." }
  ],
  rule: "Spanish uses *el* and *la* where English leaves a gap.\nThings in general, and what you like: *Me gusta el café. La salud es importante.*\nDays and hours: *el lunes*, *los sábados*, *a las ocho*.\nSome or any: no article at all. *¿Hay pan? Compro café.*\nJobs after *ser*: none either. *Soy profesora.*\n*A* and *el* join into *al*, *de* and *el* into *del*: *Voy al banco. Vengo del trabajo.* With *la*, nothing joins: *Voy a la tienda.*\nOnly one pointer at the front: *mi hermana* or *la hermana*, never both.",
  readAndPick: [
    { q: "Is Laura talking about coffee in general?", es: "Me gusta mucho el café.",
      options: ["Yes, coffee in general", "No, just this cup", "No, the café on the corner"], answer: 0,
      why: "What you like takes the article: *el café*, coffee in general." },
    { q: "Where is Diego going?", es: "Voy al banco.",
      options: ["To the bank", "From the bank", "Past the bank"], answer: 0,
      why: "*Al*: *a* plus *el*, to the." },
    { q: "Where is Ana coming from?", es: "Vengo del gimnasio.",
      options: ["From the gym", "To the gym", "Near the gym"], answer: 0,
      why: "*Del*: *de* plus *el*, from the." },
    { q: "Does Sam want a particular bread?", es: "¿Hay pan?",
      options: ["No, any bread", "Yes, the white one", "Yes, the one he bought"], answer: 0,
      why: "No article: some bread, any at all." },
    { q: "What is Laura's job?", es: "Soy ingeniera.",
      options: ["Engineer", "Teacher", "Doctor"], answer: 0,
      why: "Jobs after *ser* take no *una*: *Soy ingeniera*." }
  ],
  yourTurn: [
    { en: "I like coffee.", es: "Me gusta el café.", accept: [] },
    { en: "I'm going to the bank.", es: "Voy al banco.", accept: [] },
    { en: "I'm coming from work.", es: "Vengo del trabajo.", accept: [] },
    { en: "Is there any bread?", es: "¿Hay pan?", accept: [] },
    { en: "My sister is a doctor.", es: "Mi hermana es médica.", accept: ["Mi hermana es doctora."] }
  ],
  personal: {
    prompt: "Write two true lines: something you like in general, with *el* or *la*, and where you go after work or class, with *al* or *a la*.",
    constraints: [
      { type: "regex", pattern: "\\bme\\s+(gusta|encanta)n?\\s+(el|la|los|las)\\b", label: "what you like, with *el* or *la*: *me gusta el café*" },
      { type: "regex", pattern: "\\b(al|a la|a los|a las)\\s+[a-záéíóúñ]+", label: "where you go: *al gimnasio*, *a la casa*" }
    ],
    model: "Me encanta la comida mexicana. Después del trabajo voy al gimnasio o a la casa de mi novio."
  },
  pitfalls: [
    "*Me gusta café* drops the article Spanish needs: *me gusta el café*.",
    "*Voy a el banco* is a slip: *a* and *el* always join, *voy al banco*.",
    "*Soy una profesora* adds a word: jobs after *ser* go bare, *soy profesora*."
  ]
},

"task-revisar": {
  source: "old",
  hook: {
    line: "You've written a lot of Spanish by now. This time the exercise is your own earlier work, read with one question: does every little word match its thing?",
    es: "Antes: Vivo en un casa pequeño con dos gato.\nDespués: Vivo en una casa pequeña con dos gatos.",
    en: "Before: I live in a small house with two cats. (three slips)\nAfter: I live in a small house with two cats."
  },
  examples: [
    { es: "una casa pequeña, dos gatos negros", en: "a small house, two black cats" },
    { es: "el agua fría, las manos frías", en: "the cold water, cold hands" },
    { es: "Mis amigos son muy simpáticos.", en: "My friends are really nice." }
  ],
  rule: "Open two or three things you wrote earlier in the course. Read them for one thing only: does every word match its thing?\nCheck in this order:\n*el* or *la*, *un* or *una*: right for the word? *una casa*, *el día*, *la mano*.\nThe describing word: *-o* or *-a* to match? *una casa pequeña*.\nMore than one: is the *-s* on every word? *dos gatos negros*.\nThe traps: *el problema*, *el día*, *la foto*, *el agua fría*.\nThen write the corrected version and keep the old one next to it. Seeing the two side by side is what makes it stick.",
  readAndPick: [
    { q: "How many slips are in this line?", es: "Tengo un casa pequeño.",
      options: ["Two", "One", "None"], answer: 0,
      why: "*Casa* is a *la* word: *una casa pequeña*." },
    { q: "What needs fixing?", es: "Las sillas son negro.",
      options: ["The last word", "The first word", "Nothing"], answer: 0,
      why: "*Las sillas*: more than one, a *la* word. So *negras*." },
    { q: "Is this line right?", es: "El problema es muy grave.",
      options: ["Yes, it's fine", "No, the first word", "No, the last word"], answer: 0,
      why: "*Problema* is an *el* word, and *grave* is the same for both." },
    { q: "What needs fixing?", es: "Mis amigos son simpático.",
      options: ["The last word", "The first word", "Nothing"], answer: 0,
      why: "More than one friend: *simpáticos*." },
    { q: "Is this line right?", es: "El agua está fría.",
      options: ["Yes, it's fine", "No, el agua frío", "No, la agua fría"], answer: 0,
      why: "*El agua* takes *el* but stays a *la* word: *fría*." }
  ],
  yourTurn: [
    { en: "Fix it: *Tengo un casa pequeño.*", es: "Tengo una casa pequeña.", accept: [] },
    { en: "Fix it: *Las sillas son negro.*", es: "Las sillas son negras.", accept: [] },
    { en: "Fix it: *Mis amigos son muy simpático.*", es: "Mis amigos son muy simpáticos.", accept: [] },
    { en: "Fix it: *Hay dos gato negro en el jardín.*", es: "Hay dos gatos negros en el jardín.", accept: [] }
  ],
  personal: {
    prompt: "Write two lines about your home, then read them back and check every *el*, *la* and ending against its thing.",
    constraints: [
      { type: "regex", pattern: "\\b(un|una|el|la)\\s+[a-záéíóúñ]+\\s+[a-záéíóúñ]+", label: "a thing with *un* or *el* and a describing word" },
      { type: "regex", pattern: "\\b(los|las|dos|tres|unos|unas|mis)\\s+[a-záéíóúñ]+s\\s+[a-záéíóúñ]+s\\b", label: "more than one, with the *-s* on every word" }
    ],
    model: "Vivo en una casa pequeña con un jardín bonito. Tengo dos gatos negros y unas plantas grandes."
  },
  pitfalls: [
    "Check the end of every describing word, not just the start: *una casa pequeña*.",
    "The *-s* goes on every word: *dos gatos negros*, never *dos gatos negro*."
  ]
},

/* ---- unit 13 · Everyday writing ---------------------------------------- */

"gn-generos-escritos-a1": {
  source: "old",
  hook: {
    line: "A timetable, a note on the fridge, a sign on a door: you know what kind of text it is before you read a word. Use that, and find the one fact you need fast.",
    es: "Laura:\nFui al supermercado. Vuelvo a las seis.\nHay arroz en la nevera.\nUn beso, Ana",
    en: "Laura:\nI went to the supermarket. I'll be back at six.\nThere's rice in the fridge.\nLove, Ana"
  },
  examples: [
    { es: "Horario: lunes a viernes de 9 a 6. Sábados de 9 a 1.", en: "Opening hours: Monday to Friday 9 to 6. Saturdays 9 to 1." },
    { es: "PROHIBIDO FUMAR", en: "NO SMOKING" },
    { es: "Ya llegué. Te llamo más tarde.", en: "I'm here now. I'll call you later." }
  ],
  rule: "Short texts tell you what they are by their shape:\n*un horario*: days and hours. Look for your day.\n*un cartel*: one line in big letters. *PROHIBIDO FUMAR*, *SE VENDE*, *ABIERTO*.\n*una nota*: a name, two or three lines, a goodbye.\n*un menú*: dishes and prices. *El menú del día* is a set lunch.\nDon't read every word. Find the one fact you need: the time, the price, the day.\nWhen you write one:\nA note: their name at the top, yours at the bottom.\nA message to a friend: no greeting needed. *Ya llegué.* I'm here now.\nA goodbye: *Un abrazo* to a friend, *Un beso* to someone close.",
  readAndPick: [
    { q: "Can you go on Sunday?", es: "Horario: lunes a sábado, de 8 a 6.",
      options: ["No, it's closed", "Yes, from eight", "Only until six"], answer: 0,
      why: "Monday to Saturday: Sunday isn't on the timetable." },
    { q: "What does this sign tell you?", es: "PROHIBIDO FUMAR",
      options: ["No smoking here", "Smoking area outside", "Smoke alarm"], answer: 0,
      why: "*Prohibido*: not allowed. *Fumar*: to smoke." },
    { q: "Where is Ana?", es: "Fui a la droguería. Vuelvo en diez minutos.",
      options: ["At the pharmacy", "At home, cooking", "At work until ten"], answer: 0,
      why: "*La droguería*: the pharmacy, in Colombia." },
    { q: "What does Diego's message mean?", es: "Ya llegué.",
      options: ["He has arrived", "He's on his way", "He's running late"], answer: 0,
      why: "*Ya llegué*: I'm here now. The message everyone sends." },
    { q: "What is for sale?", es: "SE VENDE APARTAMENTO. Informes: 310 555 0123",
      options: ["An apartment", "A used car", "A corner shop"], answer: 0,
      why: "*Se vende*: for sale." },
    { q: "How much is the set lunch?", es: "Menú del día: sopa, arroz con pollo y jugo. $18.000",
      options: ["18,000 pesos", "18 dollars", "1,800 pesos"], answer: 0,
      why: "In Colombia *$* is pesos, and the dot marks thousands." }
  ],
  yourTurn: [
    { en: "Text a friend: I'm here now.", es: "Ya llegué.", accept: [] },
    { en: "Leave a note: I went to the supermarket.", es: "Fui al supermercado.", accept: [] },
    { en: "I'll be back at six.", es: "Vuelvo a las seis.", accept: ["Regreso a las seis."] },
    { en: "There's rice in the fridge.", es: "Hay arroz en la nevera.", accept: [] },
    { en: "Sign off to a friend: A hug, Ana.", es: "Un abrazo, Ana.", accept: [] }
  ],
  personal: {
    prompt: "Write a real note for someone at home: their name, where you went, when you're back, and a goodbye.",
    constraints: [
      { type: "regex", pattern: "^\\s*[a-záéíóúñ]+\\s*[:,]", label: "their name at the top" },
      { type: "anyVerbInTense", tense: "preterito", label: "where you went: *fui a…*" },
      { type: "regex", pattern: "\\b(vuelvo|regreso|llego)\\b", label: "when you're back: *vuelvo a las…*" },
      { type: "containsAny", words: ["un abrazo", "un beso", "chao", "besos"], label: "a goodbye: *un abrazo*, *un beso*" }
    ],
    model: "Diego: Fui al gimnasio. Vuelvo a las ocho. Hay sopa en la nevera. Un abrazo, Sam"
  },
  pitfalls: [
    "A note to a friend ends with *un abrazo* or *un beso*, not *cordialmente*.",
    "Read short texts for one fact: the day, the time, the price. You don't need every word."
  ]
},

"task-escribir": {
  source: "old",
  hook: {
    line: "Everything so far has been spoken. These are the written forms of the same moves, and the only new things are how they open and how they close.",
    es: "Oye, al final no puedo el sábado. ¡Qué pena!\n¿Qué tal el domingo?",
    en: "Hey, in the end I can't make Saturday. So sorry!\nHow about Sunday?"
  },
  examples: [
    { es: "¡Hola desde Cartagena! Hace mucho calor y la comida es buenísima. Un abrazo, Ana.", en: "Hello from Cartagena! It's really hot and the food is amazing. Love, Ana." },
    { es: "Buenos días. ¿A qué hora abre la oficina el sábado? Gracias. Un saludo, Sam Lee.", en: "Good morning. What time does the office open on Saturday? Thank you. Best wishes, Sam Lee." },
    { es: "Diego: tu paquete está en la cocina. Ana", en: "Diego: your parcel is in the kitchen. Ana" }
  ],
  rule: "Four short texts, four shapes:\nA message to a friend: no greeting needed. Say it, say sorry, offer another day: *Al final no puedo el sábado. ¡Qué pena! ¿El domingo?*\nA postcard: where you are, what it's like, when you're back. *Estoy en Cartagena. Hace calor. Vuelvo el doce.*\nA note: who it's for at the top, who it's from at the bottom.\nA short email: *Buenos días* at the top, the question, *Gracias*, then *Un saludo* and your name.\n*Un abrazo* closes to a friend, *Un saludo* to anyone else.\n*¡Qué pena!* is how Colombians say sorry for a small upset.\nThe opening and the closing are what make it look like a real text.",
  readAndPick: [
    { q: "Is Diego still coming on Saturday?", es: "Al final no puedo el sábado. ¡Qué pena!",
      options: ["No, he can't", "Yes, but late", "Yes, on Sunday"], answer: 0,
      why: "*Al final no puedo*: in the end I can't. *¡Qué pena!*: sorry." },
    { q: "Where is Ana writing from?", es: "¡Hola desde Cartagena! Hace mucho calor.",
      options: ["Cartagena", "Her home", "Bogotá"], answer: 0,
      why: "*Desde Cartagena*: from Cartagena. A postcard says where you are." },
    { q: "Who is this email to?", es: "Buenos días. ¿A qué hora abre la oficina? Un saludo, Sam Lee.",
      options: ["Someone he doesn't know", "A close friend from school", "His mum"], answer: 0,
      why: "*Buenos días* and *un saludo*: the shape for anyone you don't know well." },
    { q: "Who is the note for?", es: "Diego: tu paquete está en la cocina. Ana",
      options: ["Diego", "Ana", "Both of them"], answer: 0,
      why: "A note puts who it's for at the top and who it's from at the bottom." },
    { q: "When is Laura back?", es: "Vuelvo el doce. Un abrazo, Laura.",
      options: ["On the twelfth", "At twelve", "In twelve days"], answer: 0,
      why: "*El doce*: the twelfth, a date. At twelve would be *a las doce*." }
  ],
  yourTurn: [
    { en: "Text a friend: In the end I can't make Saturday.", es: "Al final no puedo el sábado.", accept: [] },
    { en: "On a postcard: It's very hot and the food is really good.", es: "Hace mucho calor y la comida es muy buena.", accept: ["Hace mucho calor y la comida [es|está] [muy buena|buenísima]."] },
    { en: "In an email: What time does the office open?", es: "¿A qué hora abre la oficina?", accept: [] },
    { en: "Close an email to someone you don't know. You are Sam Lee.", es: "Un saludo, Sam Lee.", accept: ["Saludos, Sam Lee.", "Cordialmente, Sam Lee."] }
  ],
  personal: {
    prompt: "Write one of the four for real: cancel a plan with a friend in two or three lines, say sorry, and offer another day.",
    constraints: [
      { type: "containsAny", words: ["no puedo", "no voy a poder"], label: "the cancel: *no puedo*" },
      { type: "containsAny", words: ["qué pena", "lo siento", "perdón", "disculpa"], label: "sorry: *qué pena* or *lo siento*" },
      { type: "question", label: "another day, as a question with *¿* and *?*" }
    ],
    model: "Oye, al final no puedo el viernes. ¡Qué pena! ¿Te parece el sábado a las cuatro?"
  },
  pitfalls: [
    "A text to a friend that opens *Estimada Laura* sounds like the bank: just start.",
    "An email to a stranger with no *Buenos días* or *Un saludo* looks rude in Spanish too."
  ]
}

};
