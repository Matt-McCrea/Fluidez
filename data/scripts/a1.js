/* ============================================================================
 * TEACHING SCRIPTS, A1 units 1 to 8 (window.SCRIPTS_A1), keyed by lesson id.
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
}

};
