/* ============================================================================
 * TEACHING SCRIPTS, A1 units 1 to 3 (window.SCRIPTS_A1), keyed by lesson id.
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
}

};
