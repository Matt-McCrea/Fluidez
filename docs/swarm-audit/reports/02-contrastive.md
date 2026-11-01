# 02. English-to-Spanish contrastive audit

Specialist: English-to-Spanish contrastive linguistics. Date: 2026-11-01. Branch: rebuild. Claims: `docs/swarm-audit/claims/contrastive.jsonl` (47 claims, prefix CX).

## The short version

The authors knew exactly where English speakers go wrong. That knowledge is in the prose, in 2,933 written pitfalls and in rules that name English in 471 of 916 scripts. It stops there.

- **It is shown once and never practised.** No exercise type uses a pitfall.
- **The checker does not know it.** Of 249 real English-interference errors I fed the real matcher, 46 got the actual cause, 155 got only a location ("there's an extra word"), and 46 got a hint that points the wrong way. Two wrong answers passed.
- **Contrasts are not reinforced.** Zero of 72,693 bank sentences target or require any of the 94 contrast nodes. After the drill day, "reviewing" *es* against *está* means retyping the single sentence "He's boring." The block field that promises a known contrast delivers no items.
- **The app forgets what kind of mistake you made.** `ReviewEvent` stores neither the typed text nor the hint kind.

So the curriculum anticipates the mistakes and the machine does not. That is the biggest finding, and it is the most fixable, because the data needed to fix it already exists.

There are also real content errors. One rule states that *más que* goes before numbers. One says English *to* is "always" *para*. One lesson marks correct Spanish wrong (*No vi que estaba enojada*, *No dijo que era urgente*). And the checker rejects correct, natural Spanish in ways that contradict the course and the owner's standing decisions: 0 of 44 "I'll" sentences accept *voy a*, and about 1 in 100 accept *en la mañana* for *por la mañana*.

---

## 1. What was investigated

**Read in full:** all 94 contrast scripts in `scripts-contrasts-all.md` (hook, examples, rule, small print, pitfalls and personal prompt complete; READ AND PICK and YOUR TURN lines are cut at about 1,440 characters in the pack, so I read those in part). Every PITFALLS line of all 172 grammar scripts, about 660 pitfalls, re-extracted from the pack. `sequence.md` in full.

**Code read in full:** `app/src/check/translate/{hints,match,attempt,canon,variants,english,index}.ts`, `app/src/check/{index,exact,wordhint,writing}.ts`, `app/src/ui/session/attribute.ts`, `app/src/learner/weak.ts`. Read in part: `compiler/compile.ts` (review grouping, drill block, remix, pickContrast, pickSentences), `exercises/{types,pairs,input,lexeme,translation}.ts`, `ui/session/cards.ts`, `ui/components/card.tsx`, `learner/events.ts`.

**Measured with throwaway scripts** in the scratchpad (`.../scratchpad/cx/`), using the app's real code:

| Script | What it does |
|---|---|
| `battery.ts` | 279 typical wrong answers through the real `matchTranslation`, 20 through `wordHint` |
| `natural.ts`, `natural2.ts` | Mechanical correct paraphrases of real bank sentences, with `accept` plus corpus alternatives, through the real matcher |
| `sim.ts`, `sim2.ts`, `sim3.ts`, `sim4.ts` | Real compiled sessions via `tests/ui/driver`, learner placed at u16, u22, u30; every item and contrast card logged |
| `grep.py`, `cov.py`, `ff.py`, `bankq.py`, `calque.py`, `terms.py` | Searches across all 916 script JSON files, all 72,693 bank sentences, all 4,554 lexemes |

Every defect quoted below was confirmed against the source JSON. Each claim's `quote` was checked programmatically against the file and field (bank and code claims by hand).

---

## 2. Evidence from the actual application

### 2.1 Does the curriculum anticipate English speakers, or teach generic grammar?

**It anticipates them, explicitly and well.** This is not generic grammar.

| Measure | Result |
|---|---|
| Scripts with pitfalls | 916 of 916 |
| Total pitfalls | 2,933 (grammar 660, contrast 310, pattern 1,963) |
| Pitfall reasons that name English or a copy of it (conservative regex) | 296 |
| Rules that mention English | 471 of 916 (grammar 124 of 172, contrast 53 of 94, pattern 294 of 650) |

Pitfalls are real transfer errors, not generic ones: *Yo gusto el café*, *Soy trabajo en un café*, *Yo usaba vivir en Toronto*, *¿Qué piensas en?*, *Vivo en Bogotá por tres meses*, *Consiste de tres partes*, *En la otra mano*, *Realicé que perdí las llaves*, *Dije me que*, *¡Qué una sorpresa!*.

### 2.2 Coverage of the contrasts in the brief

Teaching quality is mostly strong. The last three columns are where it falls apart.

Concept = reusable model. Pairs = contrasting examples. Errors = pitfalls. Recog and Prod = read and pick, your turn, on the teaching day only. Later = what happens after that day. Diag = can the checker name it.

| Contrast | First taught | Concept | Pairs | Errors | Recog | Prod | Later | Diag |
|---|---|---|---|---|---|---|---|---|
| ser vs estar with adjectives | u15 | good (portrait, snapshot) | good | good | yes | yes | bare card | partial, wrong rubric |
| ser vs estar for place and event | u15, u17, u38 | good (takes place test) | good | good | yes | yes | bare card | wrong rubric |
| to be: age, hunger, cold | u02, u05, u12 | good | good | good | yes | yes | bare card | none |
| gustar | u03, u10 | good (coffee pleases me) | good | good | yes | yes | indirect | none, can mislead |
| por vs para | u18, u35, u38 | good (arrow forward, look back) | good | good | yes | yes | bare card | word only: name, no model |
| preterite vs imperfect | u12, u31 | good, leans on time words | good | good | yes | yes | bare card | misleading ("when") |
| subjunctive vs indicative | u21 to u53 | fragmented, seven names | good | good | yes | yes | bare card | misleading ("when" or "who") |
| object pronouns lo vs le | u08, u13, u16 | fair, test fails on *preguntar* | good | good | yes | yes | bare card | generic pronoun hint |
| gender and agreement | u01, u02 | good | good | good | yes | yes | indirect | good, the best case |
| word order, do-support | u02 | good (*does disappears*) | good | good | yes | yes | indirect | good |
| subject pronoun drop | u01 only | one pitfall | thin | thin | no | no | none | silently passes |
| verb + preposition (pensar en, soñar con) | u28, u40, u49 | word lists, late | fair | good | yes | yes | indirect | location only |
| casarse con, entrar a or en | never | none | none | none | no | no | none | location only |
| a + infinitive after go, come | never | **rule says the opposite** | none | none | no | no | none | rejects correct Spanish |
| hace, desde hace, llevar | u06, u23, u31, u43 | good | good | good | yes | yes | bare card | none |
| obligation | u09, u35, u42 | good, one self-contradiction | good | good | yes | yes | bare card | none |
| possession with body and clothes | u09, u34 | good | good | good | yes | yes | bare card | location only |
| manner of motion (*salió corriendo*) | never | none | bank only | none | no | no | none | blames the verb |
| -ing | u09, u26, u39 | good, test weak, third job missing | good | good | yes | yes | bare card | **says meaning or spelling** |
| articles with abstract nouns | u03, u19 | good | good | good | yes | yes | indirect | location only |
| will vs present | u20, then u52 | **missing for I'll** | accidental | thin | thin | thin | none | rejects correct Spanish |
| would (three meanings) | u20 | two of three | good | good | yes | yes | none | misleading |
| could (two or more meanings) | u06, u20 | one line | thin | none | no | no | none | misleading |
| preterite meaning shift (supe, conocí, no quise) | one line at u06 | missing | bank only | none | no | no | none | none |
| if clauses | u17, u20, u40, u43 | good | good | good | yes | yes | bare card | misleading ("when") |
| adjective placement | u02, u16 | one line; meaning change never | thin | thin | no | no | none | good |
| people, gente | u07 | good | good | good | yes | yes | indirect | agreement, ok |
| become | u30, u43 | good, misses *convertirse en* | good | good | yes | yes | bare card | location only |
| false friends | scattered | see 2.6 | thin | thin | no | no | none | none |

"Bare card" and "indirect" are explained in 2.5. "Indirect" means the feature recurs in sentences because Spanish needs it, not because the contrast is scheduled.

### 2.3 The checker against real English-speaker errors

I ran 279 inputs through the real `matchTranslation` with a model sentence and realistic accepts. My classification, by reading each row:

| Outcome | Count | Share of the 249 real errors |
|---|---|---|
| Names the real cause | 46 | 18% |
| Names the contrast but gives the wrong model | 2 | 1% |
| Locates only (a word, no reason) | 155 | 62% |
| **Misleads** (spelling, meaning, when or who, when none of these is the issue) | 46 | 18% |
| **False pass** (a real error accepted) | 2 | 1% |
| Correct Spanish that the checker rejected | 28 | not counted as errors |

Representative rows. "Should say" keeps the app's rule of never giving the answer away.

**To be**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| I'm bored. | Soy aburrido. | Ser or estar? Is it what something is, or how it is right now? | Good as is. Better: "*Soy aburrido* says you're a boring person." |
| I'm thirty years old. | Soy treinta años. | "soy" isn't the word here, check the meaning. | Age is something you have in Spanish. |
| I'm thirty. | Soy treinta. | same | same |
| I'm hungry. | Estoy hambre. | "estoy" isn't the word here, check the meaning. | *Hambre* is a thing, and you have it. |
| I'm cold. | Estoy frío. | "estoy" isn't the word here, check the meaning. | Your body's cold is something you have. *Estoy frío* means you're cold to the touch. |
| I'm hot. | Estoy caliente. | "estoy" isn't the word here | Careful, that says you're aroused. Heat is something you have. |
| It's cold today. | Hoy es frío. | "es" isn't the word here, check the meaning. | Weather isn't *ser*. Spanish says the day makes cold. |
| The café is in La Candelaria. | El café es en La Candelaria. | Ser or estar? Is it what something is, or how it is right now? | Where a place sits is always *estar*. |
| The party is at my place. | La fiesta está en mi casa. | same, which is the wrong model | A party takes place. Which verb does that? |
| It's raining. | Es lloviendo. | same | The *-ando* form goes with *estar*. |

**Gustar class**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| I like coffee. | Yo gusto el café. | A small word is missing. | The coffee does the pleasing. You're the little word in front. |
| I like coffee. | Yo me gusta el café. | **PASS** | Drop *yo*: *me* already says who. |
| She likes coffee. | Ella le gusta el café. | **PASS** (the course's own pitfall calls this wrong) | She isn't the subject here. It starts with *a*. |
| I like dogs. | Me gusta los perros. | Check the verb ending: who is doing it? | The verb follows the things you like, and there are several. |
| I like coffee. | Me gustan el café. | who is doing it? | same, one thing |
| We like the café. | Nosotros gustamos el café. | A small word is missing. | The café does the pleasing, so the verb follows the café. |
| My head hurts. | Me duele mi cabeza. | "mi" isn't the word here, check the meaning. | *Me* already says whose head. |
| I wash my hands. | Me lavo mis manos. | "mis" isn't the word here, check the meaning. | *Me* already says whose hands. |

"Who is doing it?" is the worst possible question for a *gustar* error. The learner answers "I am", and that is the English frame the course spent a lesson removing.

**Verbs and prepositions**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| I'm looking for my key. | Estoy buscando para mi llave. | There's an extra word: "para". | Fair. Better: *Buscar* already means look for. |
| I'm waiting for the bus. | Estoy esperando por el bus. | There's an extra word: "por". | *Esperar* already means wait for. |
| I'm thinking about you. | Estoy pensando de ti. | "de" isn't the word here, check the meaning. | What's on your mind goes with *pensar en*. |
| I dream about you. | Sueño de ti. | There's an extra word: "de". | *Soñar* goes with *con*. |
| It depends on you. | Depende en ti. | "en" isn't the word here, check the meaning. | *Depender* takes *de*, not English on. |
| She married Tomás. | Se casó a Tomás. | "a" isn't the word here, check the meaning. | You marry with someone in Spanish. |
| I fell in love with her. | Me enamoré con ella. | "con" isn't the word here, check the meaning. | You fall in love of someone in Spanish. |
| I went to the store to buy milk. | Fui a la tienda por comprar leche. | "por" isn't the word here, check the meaning. | A goal isn't *por*: that would mean because. |
| same (model has *para*) | Fui a la tienda a comprar leche. | "a" isn't the word here, check the meaning. | **Correct. Must pass.** |
| I see Vale. | Veo Vale. | A small word is missing. | A particular person after the verb needs the little *a*. |
| I asked for the bill. | Pregunté por la cuenta. | There's an extra word: "pregunté". | You want a thing, not an answer. Which verb? |
| Who do you live with? | ¿Quién vives con? | Right words, different order | Spanish can't end on *con*. It goes first. |

**Mood and if clauses**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| I want you to go. | Quiero que vas. | Check the verb ending: when does it happen? | Someone else does it after *quiero que*, so the verb changes form. |
| I want you to go. | Quiero que voy. | when does it happen? | same, and who goes? |
| I want you to go. | Quiero ir. | A small word is missing. | That says you want to go. Someone else is going. |
| I want you to go. | Quiero tú ir. | A small word is missing. | Spanish can't copy I want you to. It needs *que* and a new verb. |
| I hope it doesn't rain. | Espero que no llueve. | who is doing it? | After *espero que* the verb changes form. |
| When you arrive, call me. | Cuando llegas, llámame. | when does it happen? | Right question, wrong direction. It hasn't happened yet, so *cuando* changes the verb. |
| I don't think he's coming. | No creo que viene. | when does it happen? | *No creo que* changes the next verb. |
| It's important that you study. | Es importante que estudias. | when does it happen? | You're judging it, not reporting it. |
| I doubt he knows. | Dudo que sabe. | who is doing it? | *Dudo que* changes the next verb. |
| If I had time, I would go. | Si tendría tiempo, iría. | when does it happen? | Never the *would* form after *si*. |
| If it rains, I'll stay home. | Si lloverá, me quedo en casa. | when does it happen? | Never the future after *si*, as in English. |

**The two pasts and modals**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| It was raining when I arrived. | Llovió cuando llegué. | when does it happen? | Both are past. Was it already going on, or did it happen? |
| When I was a child, I lived in Toronto. | Cuando fui niño, viví en Toronto. | when does it happen? | A stretch of childhood is scene, not event. |
| Yesterday I went to the bank. | Ayer iba al banco. | when does it happen? | One trip is an event. |
| I used to live in Toronto. | Usaba vivir en Toronto. | "usaba" isn't the word here | Spanish has no word for used to. The ending does it. |
| When I was a child, I would go to the beach. | Cuando era niño, iría a la playa. | when does it happen? | This would means used to. |
| He wouldn't sign. | No firmaría. | A word is missing. | This wouldn't means refused. |
| I couldn't open the door. | No podría abrir la puerta. | when does it happen? | That says wouldn't be able to. You tried and failed. |

**-ing, form errors, negation, quantifiers**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| Swimming is good. | Nadando es bueno. | "nadando" isn't the word here, check the meaning. | The meaning is right. An activity as a subject uses the *-r* form. |
| After eating, I left. | Después de comiendo, salí. | "comiendo" isn't the word here, check the meaning. | After a little word like *de*, always the *-r* form. |
| I like cooking. | Me gusta cocinando. | "cocinando" isn't the word here, check the meaning. | After *gusta*, the *-r* form. |
| Thanks for coming. | Gracias por viniendo. | same | same |
| It is a boring book. | Es un libro aburriendo. | **Check the spelling.** | A describing word never uses *-ando*. |
| I'm going to eat. | Voy a como. | **Check the spelling.** | After *voy a*, the verb stays in its dictionary form. |
| I don't speak French. | Yo no hablar francés. | **Check the spelling.** | The verb needs its ending: who speaks? |
| Do you speak Spanish? | ¿Hablar español? | **Check the spelling.** | same |
| I don't have anything. | No tengo algo. | "algo" isn't the word here, check the meaning. | After *no*, anything is *nada*. |
| I'm very hungry. | Tengo muy hambre. | "muy" isn't the word here, check the meaning. | *Hambre* is a thing, so very is *mucha*. |
| I have more than ten books. | Tengo más que diez libros. | "que" isn't the word here, check the meaning. | Before a number, than is *de*. |
| Another coffee, please. | Un otro café, por favor. | There's an extra word: "un". | Good. *Otro* already has the a inside it. |
| I've been living here for two years. | Vivo aquí por dos años. | A small word is missing. | Still going: *por* can't do that. |
| I've been living here for two years. | He estado viviendo aquí por dos años. | There's an extra word: "he". | Still true now, so Spanish uses the plain present. |

**False friends and lexical calques**

| Prompt | Typed | App says | Should say |
|---|---|---|---|
| I'm embarrassed. | Estoy embarazada. | "estoy" isn't the word here, check the meaning. | Careful, that says you're pregnant. |
| I'm excited. | Estoy excitado. | "excitado" isn't the word here, check the meaning. | Careful, that's sexual. *Emocionado*. |
| The library is closed. | La librería está cerrada. | "librería" isn't the word here | A *librería* sells books. |
| I realised my mistake. | Realicé mi error. | A small word is missing. | *Realizar* means to carry out. |
| I attended the meeting. | Atendí la reunión. | A word is missing. | *Atender* is to serve or look after. |
| Actually, I don't like it. | Actualmente, no me gusta. | A small word is missing. | *Actualmente* means nowadays. |
| I need to find the exit. | Necesito encontrar el éxito. | **Check the article: salida is feminine.** | *Éxito* means success. (This hint also gives the answer away.) |
| I had a good time. | Tuve un buen tiempo. | There's an extra word: "tuve". | English idiom. Spanish doesn't have a good time. |
| What time is it? | ¿Qué tiempo es? | "tiempo" isn't the word here | Clock time is *hora*. |
| He ran out of the house. | Corrió fuera de la casa. | "corrió" isn't the word here, check the meaning. | Spanish puts the way out in the verb and the running after it. |

**What works** (preserve): agreement, articles, genders, word order, double pronouns, extra-word catches.

| Typed | App says |
|---|---|
| La casa es blanco. | Check the ending: it has to agree (masculine or feminine, one or more). |
| La problema es grande. | Check the article: problema is masculine. |
| Tengo un rojo carro. | Right words, different order: check where each one goes. |
| ¿Qué Vale quiere? | Right words, different order |
| Nadie no vino. | There's an extra word: "no". |
| Yo no hago hablar francés. | There's an extra word: "hago". |
| Este regalo es por ti. | Por or para? Check that little word. |

#### Gap cards are worse than sentence cards

`wordHint` has no ser/estar or por/para branch. Measured directly:

| Typed | Answer | Hint |
|---|---|---|
| soy | estoy | **Check the spelling.** |
| es | está | **Check the spelling.** |
| estoy | soy | **Check the spelling.** |
| por | para | **Check the spelling.** |
| para | por | **Check the spelling.** |
| fue | era | Right verb, but when does it happen? |
| fui | iba | Right verb, but when does it happen? |
| vas | vayas | Right verb, but when does it happen? |
| venga | viene | Right verb, but when does it happen? |
| lo, le, hay, sabe, conozco, pido | le, lo, está, conoce, sé, pregunto | nothing |

The two most-taught contrasts in the course are reported as typos.

#### Frequent interference errors with no diagnosis at all

Age and *ser*. *Estar* or *ser* with hunger, cold, fear, right. Weather with *ser*. *Gustar* word order and agreement. Infinitive for finite. Gerund for infinitive. Subjunctive of any kind. *Si* + conditional or future. Preterite against imperfect. Used to. Would as habit. Would as refusal. Could. Personal *a*. Possessive with body parts. Verb + wrong preposition. Preposition stranding. *Por* or *para* for still-going time. *Más que* + number. *Muy* + noun. *No … algo*. *En* + day of the week. All false friends. All manner-of-motion calques. *Hay* against *está*. *Saber* against *conocer*. *Pedir* against *preguntar*. Become.

`HintKind` has 16 values. Three are contrasts: `ser-estar`, `por-para`, `pronoun`. The other 13 are mechanical. There is no `mood`, no `aspect`, no `experiencer`, no `nonfinite`, no `preposition`, no `false-friend`.

### 2.4 Correct Spanish that the checker rejects

Real bank sentences, with `accept` and corpus alternatives, through the real matcher. Each row is a mechanical paraphrase that is correct Spanish.

| Paraphrase | Accepted | Example of rejection | Conflicts with |
|---|---|---|---|
| I'll + *-ré* to *voy a* | **0 of 44** | u20-0107 Tomorrow I'll call you early. *Mañana te voy a llamar temprano.* "There's an extra word: voy" | x:ir-a-future: "your default, and you'll rarely sound wrong with it" |
| I'm going to to *-ré* | 0 of 81 | u01-0620 *Mañana trabajaré.* | less natural; low priority |
| *por la mañana* to *en la mañana* | **1 of 163** | u05-0462 I call my grandmother at night. *Llamo a mi abuela en la noche.* "There's an extra word: en" | Bank itself uses *en la noche* 88 times; Colombian usage |
| *en la mañana* to *por la mañana* | **1 of 88** | u03-0905 *Don Hernando prefiere tomar tinto por la mañana.* | x:por-para rule teaches it |
| motion + *para* + inf to *a* + inf | **0 of 14** | u05-0844 *Fui a Toronto a ver a mi papá.* | Natural form |
| motion + *a* + inf to *para* + inf | rejected in all four genuine cases checked | u09-0364 *Voy al parque para caminar un rato.* "para isn't the word here, check the meaning" | p:para-inf-purpose: "always para" |
| English have + done, preterite model, to perfect | **1 of 109** | u01-0645 Have you eaten yet? *¿Ya has comido?* "There's an extra word: has" | Standing decision: Peninsular forms accepted. x:pret-perfecto-latam: "People will understand you" |
| *hoy* + preterite to *hoy he* | 3 of 25 | u04-0325 *Hoy he ido al centro.* | same; pitfall says "Fine in Madrid" |
| *plata* to *dinero* | 1 of 386 in the matcher; `lenientSwap` rescues most | u04-0267 *Salimos del banco con el dinero.* "Check the article: plata is feminine." | A bogus hint when the article has to change |
| *tinto* to *café* when the English says coffee | 18 of 716 | u01-0119 The coffee is Colombian. *El café es colombiano.* "café isn't the word here" | The English says coffee |

Also rejected, one test each: *Si tuviese tiempo, iría* (hint: "when does it happen?"), *Si hubiera tenido plata, hubiera viajado* unless listed, *¿Cuál libro quieres?*, *¿Cuáles documentos necesito?*, *Entre más trabajo, menos duermo*, *Me tomó una hora llegar al café*, *Trabajo aquí hace dos años*, *Después de firmar, se fue*. The script lists accept many of these in `yourTurn`, but bank `accept` is empty for most: only 1,014 of 72,693 sentences have any.

### 2.5 Reinforcement: what actually happens after a contrast is taught

- **Bank:** sentences targeting a contrast node: **0**. Sentences requiring one: **0**. Across all 94.
- **`pickSentences(x:…)`** therefore returns nothing, always.
- **`pickContrast`** returns the first matching node in map order, with no rotation. In a simulated learner at u16, the block field read `controlledOutput[x:tener-estar-states]` or `remix[x:tener-estar-states]` on 7 of 24 days and `[x:le-se-lo]` on 2. **Zero items came from it.** The field is decorative.
- **Warm-up review** of a contrast node has no sentence, so it falls to a bare card.

Real cards, days 2 and 3 after placement at u16, from `sim2.ts`:

```
rv:x:ser-estar-adj:productive:bare  How do you say this in Spanish? He's boring. => Es aburrido.
    why: "He's boring." is Es aburrido.
rv:x:ser-estar-adj:receptive:bare   What does this mean? Es aburrido.
    options: I came to help. | *He's boring. | He's my friend.
rv:x:ser-estar-place:productive:bare  The café is on 11th Street. => El café está en la 11.
```

There is no contrast in any of these. The learner is never asked "He's bored". The distractors are unrelated. FSRS records "x:ser-estar-adj reviewed, stability rising" for recalling one memorised sentence. The node's memory state does not measure the ability it is named after. The same two-card pattern holds for every contrast.

In 24 simulated days at u16: 861 items, 24 touched a contrast node, all of them these bare warm-up cards.

Minimal-pair cards: `Feature` has `copula`, `porpara`, `mood` and `clitic` builders. In a 14-day run at u22 (707 cards), cards with a `feature` were 16 `tense`, 2 `person`, and none of `copula`, `porpara`, `mood` or `clitic`. That is one run, not a course-wide count, but the two contrasts these builders exist for did not appear in it.

**Pitfalls:** rendered in `ui/blocks/teach.tsx` and `screens/reference`. No exercise type consumes them. There is no "spot the mistake" card anywhere in the `Item` union. One script (x:yo-vs-a-mi-tambien) hand-builds the equivalent inside `readAndPick` ("Sounds right / Should be: A mí también"), and it is one of the best things in the course.

**After a miss:** `ReviewEvent` keeps node, grade, tries, op, sentence. Not the input, not the `hintKind`. `attribute.ts` splits a multi-target miss by `byId('ser-estar')` and `byId('por-para')`, then discards the kind. `weak.ts` reports node and tense tallies only, and by design treats free-form misses as location signal. So "You keep saying *estoy* with hunger" cannot exist as a sentence the app could say.

On reveal, the "why" line on most production cards restates the answer: `"He's boring." is Es aburrido.` The rule the learner just broke is one tap away in look-up but is not linked.

### 2.6 False friends

The term "false friend" appears in 2 of 916 scripts. Checked against about 80 classic items:

| Status | Items |
|---|---|
| Warned, in context | *embarazada* (p:me-da-verguenza), *actualmente* (p:actualmente), *últimamente*, *asistir*, *realizar*, *colegio*, *soportar* (p:no-soportar-que), *mayor*, *recordar* |
| Taught with the right gloss, no warning | *éxito* (u22), *sensible* (u30), *pretender* (u28), *discutir* (u26), *fábrica* (u42), *lectura* (u39), *pariente* (u22), *advertir* (u29), *aplicar* (u37), *argumento* (u29), *compromiso* (u29), *largo* (u14, partly), *ropa*, *quitar*, *retirar*, *simpático*, *molestar* (u21), *sano* |
| Receptive only, no warning | *librería*, *carpeta*, *suceso*, *eventualmente* |
| **Marked "(cognate)" and not carded, though false** | *introducir*, *atender*, *familiar* |
| Absent everywhere | *excitado*, *estoy caliente*, *constipado*, *decepción*, *rudo*, *bizarro*, *tópico* |

1,053 lexemes carry the "(cognate)" note. I checked only the ones on my list.

### 2.7 The bank itself is clean

A calque scan found almost nothing. No *hacer sentido*, *tomar lugar*, *en orden de*, *tener un buen tiempo*, *muy mejor*, *un otro*, *en lunes*, *cierra sus ojos*, *más que* + number (the three hits are legitimate comparisons). Manner of motion is natural throughout: 153 English sentences with a particle verb reviewed, and nearly all use *salió corriendo*, *cruzó el puente corriendo*, *salió volando*, *se alejó corriendo*. One calque found (u12-0608).

---

## 3. Specific problems

### Critical and high: Spanish and teaching

**P1. critical. `x:mas-que-mas-de-lo-que` rule teaches *más que* before numbers.**
Quote: "A person, thing or number: *más que*." (u36). False, and it reverses `p:mas-de-number` (u11) and the promise in `g:comparatives`.
Consequence: an English speaker, who has one *than*, writes *Tengo más que diez libros* and now has a rule for it. Note *No tengo más que diez mil* would then mean something else.
Fix: CX-001.

**P2. high. `p:para-inf-purpose` says "In Spanish that to is always *para*."**
False. After *ir* and *venir*, the goal is very often *a*: *Fui a la comisaría a poner la denuncia* (u34-0161). The owner named this one specifically. It is the only teaching of the point anywhere, and it teaches the opposite.
Consequence: learners never acquire the natural form, and when they read it they cannot parse it. The checker enforces both directions, so a learner following the rule at u09-0364 fails, and a learner writing the natural form at u05-0844 fails.
Fix: CX-039, plus a new contrast for *a* against *para* after verbs of going, and a two-way accept.

**P3. high. `g:subj-perception-negated` marks correct Spanish wrong and inverts the meaning.**
Rule: "Put *no* in front and you are no longer vouching, so the verb after *que* switches". Pitfalls list *No vi que Vale estaba enojada* and *No dijo que era urgente* as errors.
Both are correct: she was angry and I missed it; it was urgent and he didn't mention it. Those are also the likeliest meanings of the English. The subjunctive versions mean something else. The hint then adds "when does it happen?".
Fix: CX-003 to CX-006.

**P4. high. `x:fact-value` quick test fails on its own examples.**
"if you can swap in *I know that*, use the normal verb". *Es una pena que cierren el parque*: the speaker knows. Test says normal verb. Answer needs *cierren*. `g:subj-emotion-intro` had already said "Vale really is here; it's a fact".
Fix: CX-002.

**P5. high. `x:ir-a-future` equates English will with *-ré*.**
"*voy a* is going to, and *-ré* is will". Everyday I'll is neither: *Te llamo luego*, *Yo pago*, *¿Te ayudo?*. The bank does this from u04 and u08 with no rule anywhere until "mañana viajo" at u52. *Will you help me?* is *¿Me ayudas?* in p:me-te-nos-objects and *¿Me ayudarás?* in g:future-promises, with no comment on the difference.
Consequence: stilted over-use of *-ré* in speech, the English-speaker signature at B1.
Fix: CX-032, plus a new contrast (section 6.4).

**P6. high. Preterite meaning shift is untaught.**
One line: "*No pude* is more than I couldn't". *Supe*, *conocí*, *no quise*, *pude*, *tuve* shift meaning; *knew*, *met*, *refused*, *managed* do not map to *sabía*, *conocía*, *no quería*, *podía*. The bank has it right from u06 (u06-0102 *Ayer supe la verdad* = found out) and the learner is left to infer it.
Fix: CX-034, plus a contrast at u12 with x:pret-imp.

**P7. high. "Would" is taught two thirds, "could" barely.**
`g:conditional` covers conditional and habit, not refusal: *No quiso firmar*. Could has no contrast at all: *podía* or *sabía* (ability), *pude* (managed), *podría* (polite, hypothetical).
Fix: CX-033 and a new `x:could`.

### Medium: Spanish and teaching

**P8. medium. `g:subj-doubt` says *No dudo que* takes the indicative, and marks *No dudo que tengas razón* wrong.** Both moods are correct. Fix: CX-007 to CX-009.

**P9. medium. `x:mientras-ind-subj` test fails on the future.** "can you say while? Ordinary verb." *Mientras estés en Bogotá, ven a verme.* Fix: CX-010.

**P10. medium. `x:lo-le` quick test fails on its own example.** "if English could add to" against *Les pregunté la hora*. Fix: CX-012.

**P11. medium. `x:ing-infinitive-gerund`: both quick tests leak, and the third -ing is missing.** "Can you put to in front?" fails on *Gracias por venir*, in the same rule. -ing as adjective is in 0 scripts. Fix: CX-013, CX-014.

**P12. medium. *No hay que* has two opposite rules.** `g:impersonal-obligation`: "says there's no need to". `p:hay-que-tener-en-cuenta`: "it means we shouldn't". Both happen. This is the exact trap the course warns about elsewhere. Fix: CX-017, CX-018.

**P13. medium. `x:no-hace-falta-vs-prohibido` equates "You mustn't" with *está prohibido*.** Contradicts `x:tener-que-deber`, and *Está prohibido que entres* to a guest's face is stilted. Fix: CX-016.

**P14. medium. `x:supongo-vs-dudo`: "which way you lean" breaks at once.** *Es probable que llegue* leans yes. Fix: CX-024.

**P15. medium. `x:subj-present-past` overstates sequence of tenses for the course's own dialect.** "even if the coming is still in the future" is where Latin American Spanish most often uses the present. Keep *-ra* as the default, but do not call the rest wrong. Fix: CX-019, CX-020.

**P16. medium. `g:que-vs-cual` prohibits *cuál* + noun.** Normal in Latin America, Colombia included. Fix: CX-021, CX-022.

**P17. medium. `x:tras-al-inf` marks *Al firmar, se fue* wrong.** Correct Spanish. Fix: CX-023.

**P18. medium. "Wish form" and six other names.** Seven labels for one thing, switching between neighbouring lessons. "Wish" is false for its largest uses: *me alegra que estés*, *no creo que venga*, *cuando llegues*, *aunque llueva*. There is no single model across 40 nodes.
Fix: see section 6.1. Claim CX-043.

**P19. medium. `x:ser-estar-participle` asks for the kitchen passive.** The personal prompt and *Los platos fueron lavados por Vale* undo `g:passive-ser`'s "news voice". Fix: CX-031 for the prompt; the example needs a human rewrite.

**P20. medium. Missing warnings for dangerous transfers.** *Estoy caliente*, *estoy excitado*, *me gustas* for friendly liking. Precedent exists: `p:bien-mal-vs-bueno-malo` warns about *estoy bueno*. Fix: CX-026, CX-037. *Excitado* needs a new line wherever *emocionado* is taught.

**P21. medium. "Become" omits *convertirse en*.** In 0 of 916 scripts. Fix: CX-035, CX-036.

**P22. medium. Late or missing verb constructions.** Teaching is real but late against use.

| Construction | Taught | In bank from | Gap |
|---|---|---|---|
| ¿Con quién?, ¿De qué? (preposition first) | g:questions-prepositions **u37** | **u02** (1,174 sentences) | 35 units |
| pensar en | p:pensar-en u28 | earlier | |
| enamorarse de | p:enamorarse-de u31 | | |
| depender de | p:depender-de u33 | | |
| soñar con | p:sonar-con u40 | | |
| casarse con | **never** | u49; *casarse* u11 | |
| entrar a, en | **never** | u06 | |
| verbs + preposition overview | g:verbs-prepositions **u49** | | |

A1 learners ask "Who do you live with?" at u02 and get "Right words, different order" when they strand. The rule that explains it comes 35 units later.

**P23. medium. `g:por-para-2` promises "por for time" and gives none.** Rate, means and swap only. The commonest English *for*, a stretch of time, has no por or para rule. Fix: CX-038.

**P24. medium. Three false friends are tagged "(cognate)" and never carded.** *introducir*, *atender*, *familiar*. Fix: CX-040, CX-041, and a false-friend screen over the 1,053 cognates.

### High: the checker

**P25. high. Hints name the wrong cause on 46 of 249 real errors.** `classifySub`: same-lemma different-tense means "when does it happen?", which is false for mood and aspect. `sameTense` means "who is doing it?", which is false for *gustar* and for imperative-homograph subjunctives. `b.length >= 4 && levenshtein <= 2` means "Check the spelling", which is false for infinitive-for-finite. `readings()` has no non-finite reading, so *nadando* against *nadar* falls through to `wrong-word` and "check the meaning". Claims CX-045 and CX-047, plus the two below.

**P26. high. `wordHint` calls *soy* and *por* spelling errors.** See 2.3. Fix: check the same closed sets before the Levenshtein branch. Claim CX-046.

**P27. high. Subject pronoun stripping lets the top *gustar* error pass.** `canon` step 3 removes *yo*, *ella*, *nosotros* before a clitic. *Yo me gusta el café*, *Ella le gusta el café*, *Tú te gusta*, *Nosotros nos gusta*, *Ellos les gusta*, *Yo se me olvidaron las llaves*, *Yo me hace falta plata* all pass. `g:le-doubling` lists *Vale le gusta el tinto* as an error.
Fix: in `canon`, when the finite verb is in `EXPERIENCER` (or a *se me* frame), do not strip a bare subject pronoun. Fail with a dedicated hint.

**P28. high. The checker rejects Spanish the course teaches as right.** See 2.4. *Voy a*, *en la mañana*, *a* + infinitive, the perfect. The perfect row also breaks a standing owner decision.
Fix: derive these variants in `expandAccepted`, not by hand. Each is a closed mechanical rewrite:
- *por la* ↔ *en la* + mañana, tarde, noche.
- *-ré* ↔ *voy a*, for model sentences in a chat context.
- motion verb … *para* + inf ↔ *a* + inf.
- preterite ↔ perfect, flagged `peninsular`, with the existing "That's how they say it in Spain" line, adjusted because Colombians say it too.
- *-ra* ↔ *-se*; *habría* ↔ *hubiera* in the main clause of a past unreal.

**P29. medium. One ser/estar hint for four contrasts.** Claim CX-044. Add a branch: next word *en* + place and subject an event noun; subject a place; next token a gerund; adjective.

**P30. medium. Bogus article hints.** *Las personas están contentas* gets "Check the article: one gente or more than one?". *el dinero* against *la plata* gets "plata is feminine". *el éxito* against *la salida* gets "salida is feminine", which leaks the answer. Fire the article hint only when the following noun matches.

### Low

P31 to P34: x:aunque pitfall misstates English (CX-011). `g:comparatives` should add *mucho mejor* (CX-015). `x:pena-vs-rabia` omits Colombian embarrassment (CX-025). `g:parecer-quedar`, `g:narrative-pasts`, `g:hace-que-desde` over-mark style as error (CX-027 to CX-029). One medium that fits here: `g:tener-que-hay-que` calls *debes* "should" where x:tener-que-deber calls it must (CX-030). One bank line copies the English frame (u12-0608, CX-042).

---

## 4. What the application does well and must be preserved

1. **The pitfall corpus.** 2,933 items of real interference errors with plain reasons. It is the most valuable contrastive asset in the app and should become data the machine uses. Do not rewrite it; route it.
2. **The Hook, Rule, Read and Pick, Your Turn, Pitfalls shape of contrast scripts.** Every contrast has pairs that differ by one word. Examples: *Comía a las dos / Comí a las dos*, *Es aburrido / Está aburrido*, *Lo hice para ti / Lo hice por ti*, *Le recomiendo / Quiero que*.
3. **Models a learner can reuse.** "A party takes place", the *hay* test (does the listener already know?), "Could you shake its hand or walk around it?", "*Ir* looks ahead, *irse* looks back", "the arrow pointing ahead" for *para*, the *ya voy* explanation in x:ir-irse and p:ir-venir, "Who does the second thing?", "Echo the shape" in x:yo-vs-a-mi-tambien. These beat most published textbooks.
4. **Refusing the permanent-temporary rule.** x:ser-estar-adj explicitly rejects it for portrait and snapshot. Preserve that.
5. **Honest dialect notes.** x:pret-perfecto-latam, p:llevar-traer ("English bring also goes to where the other person is"), x:tu-usted on Colombian *usted*.
6. **The warning precedent.** *Estoy bueno*, *pedo*, *En el principio* "sounds like the opening of the Bible". Funny and memorable. Extend it.
7. **Bank sentences free of calques**, including natural verb-framed motion. The content pipeline's gate is working.
8. **The one self-correction attempt** and "never give the answer away". The fix is what the hint says, not the mechanism.
9. **Agreement and word-order diagnosis.** Accurate. Keep that code path.
10. **x:yo-vs-a-mi-tambien's "Sounds right / Should be" read-and-pick**, the only error-recognition exercise in the app and the model for what is missing.

---

## 5. Missing capabilities

1. **An interference rule layer in the checker.** Named, deterministic rules that run before the generic diff.
2. **Error-kind memory.** `hintKind` and a rule id on `ReviewEvent`, then weak spots by error kind.
3. **Error-recognition exercises.** A "spot the mistake" item built from pitfalls.
4. **Contrast review that contrasts.** Items where both sides are in play and the decision is the test.
5. **A variant generator for natural alternatives** so `accept` stops being hand-authored for 71,679 sentences.
6. **A lexical contrast feature.** `Feature` knows `copula` and `porpara` but not *saber/conocer*, *pedir/preguntar*, *hay/está*, *muy/mucho*, *tener/estar*, *lo/le*.
7. **A false-friend field on lexemes**, with a warning that fires on reveal and in the checker.
8. **A rule link on reveal.** "Why?" from a missed card to the script that teaches it.
9. **A gentle "passes, but" channel for pronoun overuse.** *Yo no sé*, correct and worth a note at B1. Currently silent.

---

## 6. Recommended improvements

### 6.1 One model for the subjunctive, and one name

Teach a single contrast from u21 and return to it every time. Strongest design:

> **The everyday verb tells. The other verb doesn't.** When you tell someone something as news, you use the everyday verb. The other form is for everything you are not telling as news: what you want, what you doubt, what hasn't happened yet, and what you are only reacting to because everyone already knows it.

This survives every case in the course: *quiero que vengas*, *no creo que venga*, *cuando llegues*, *aunque llueva*, *me alegra que estés aquí* (known, so not news), *no dijo que fuera urgente*. "Wish" does not. It is the assertion account (Terrell and Hooper; Bosque) said in plain words.

Name: call it the subjunctive from u21, in the body text, once, with a gloss. Adults can cope with one Latin word, and it matches look-up, the owner's standard-names decision, and every grammar they will ever open. Use it everywhere; retire the other six. Cost: about 90 scripts, a mechanical pass plus review.

### 6.2 Build the interference layer

New file `app/src/check/translate/interference.ts`. A table of closed rules, each with an id, a matcher over aligned tokens, a message, and the node it credits. It runs before `classifySub`. Deterministic, testable, no AI.

| Rule id | Fires when | Message (never gives the answer) |
|---|---|---|
| `age-ser` | model *tener* + N + *años*, input *ser* or *estar* | Age is something you have in Spanish. |
| `state-tener` | model *tener* + {hambre, sed, frío, calor, sueño, miedo, prisa, razón, suerte}, input *ser* or *estar* | That one is a thing you have. |
| `weather-hacer` | model *hace* + weather, input *es* or *está* | Weather isn't *ser*. Spanish says it makes cold. |
| `loc-ser` | input *es*, model *está*, next *en*, subject not an event | Where something sits takes *estar*. |
| `event-estar` | input *está*, model *es*, next *en*, subject an event noun | An event takes place. Which verb does that? |
| `exp-yo` | model has clitic + EXPERIENCER, input has a subject pronoun or a first-person form | The thing does the pleasing. You're the little word in front. |
| `exp-agree` | same verb, wrong number, EXPERIENCER | The verb follows the thing, not you. |
| `mood-need` | same lemma, model subjunctive, input indicative, preceding trigger | That word changes the next verb. |
| `si-cond` | after *si*, input conditional or future | Never that form after *si*. |
| `aspect` | same lemma, preterite against imperfect | Both are past. Was it going on, or did it happen? |
| `nonfinite-inf` | same lemma, model infinitive, input gerund | Right verb. After this word, the *-r* form. |
| `finite-need` | same lemma, model finite, input infinitive | The verb needs its ending: who is doing it? |
| `poss-body` | model *el/la/los/las* + body or clothing, input *mi/tu/su* | The little word already says whose. |
| `pers-a` | model *a* + person, input lacks it | A particular person needs the little *a*. |
| `verb-prep` | table of 40 verb + preposition pairs; input other preposition or none | This verb brings its own little word. |
| `no-extra-for` | *buscar, esperar, pagar, pedir, escuchar, mirar* + *para/por* | This verb already means that. |
| `strand` | input ends in a preposition | Spanish can't end on that word. |
| `mas-num` | *más que* + numeral | Before a number, than is different. |
| `muy-noun` | *muy* + noun | That word is a thing, so very changes. |
| `no-algo` | *no* … *algo* or *alguien* | After *no*, the opposite word. |
| `for-time` | *por* + time with present still-going model | Still going: *por* can't do that. |
| `used-to` | *usar* + infinitive | Spanish has no word for used to. |
| `false-friend` | lexeme table of input word against English cue | Careful: *X* means Y. |
| `motion` | manner verb + *a* or *fuera* where model has path verb + gerund | Spanish puts the way out in the verb. |

And mine the corpus. Every pitfall `wrong` that canonicalises equal to a learner's input is an exact hit with a written reason: show `why`. A dictionary of 2,933 canonical forms is cheap, and on the card where the pitfall sentence is the target it is perfect feedback. Also derive pattern rules from them.

Wire `hintKind`, rule id and input into `ReviewEvent`. Then `weak.ts` can say "You've used *estar* with hunger four times" and offer the contrast. That single sentence is worth more than most features in the backlog. It is the first thing a good human teacher would notice.

### 6.3 Make contrast review contrast

Immediate fix: when a contrast node is due, serve a rotating item from its own `readAndPick` and `yourTurn` (already 7 or 8 each per script), never the bare node sentence. A day's work.

Proper fix, in order:

1. **Pair review.** Show both sides, one decision: "He's bored" and "He's boring", type both. Or a gap with the two candidates and the English pinning the choice. Repeat with a fresh sentence each time.
2. **Tag bank sentences by contrast.** A build-time pass labels each sentence with the contrast it exercises (a sentence containing *es* + adjective is already an x:ser-estar-adj candidate). Then `pickSentences` and `pickContrast` work as designed.
3. **Rotate `pickContrast`** by least recently seen, weighted to the learner's error kinds.
4. **Add a spot-the-mistake item**, from pitfalls. Show *Soy aburrido en la reunión*; the learner picks the wrong word, then fixes it. 2,933 items exist.
5. **Add free recall of the decision test.** "How do you choose between *es* and *está*?" as a rule-recall card, which already exists as `ruleRecall`.

### 6.4 Assessment and strongest design for each core contrast

**ser and estar.** Concept is right. Three separate rubrics are needed in the hint. Add a contrast-tagged review, and teach *está muerto*, *está casado*, *es casado* as the known counter-examples: the bank has *Soy casada* at u05 and *Estoy casado* at u15 with no comment.

**gustar.** Concept is right. The weakness is purely checker. Add `exp-*` rules, close the false pass, add "I like you".

**por and para.** Strong arrow model. Add duration. Add *a* after motion. Check: "for + time" and "for + person" in one drill.

**Preterite and imperfect.** Strong "what happened or what it was like", but "Time words help" invites a word-cue strategy. English simple past hides the choice, so the best drill is one English line with two contexts: "I knew him" as *lo conocía* or *lo conocí*. Add the shift verbs here. Fix the hint.

**Subjunctive.** See 6.1. Sequence is sensible. Add a mixed cumulative drill: one card from each trigger family with the choice open, from u33, because by then the learner has only ever chosen inside a labelled lesson.

**Object pronouns.** Fix the test. Add a *lo/le/se* minimal-pair feature; the generator can do this mechanically with verb tables.

**Verb + preposition.** Move *pensar en*, *soñar con*, *casarse con*, *enamorarse de*, *depender de*, *entrar a* forward to A2 as chunks, with a contrast at u24 or so: English on, of, about versus Spanish *en*, *de*, *con*. Learn them with the verb, never as a list.

**Motion.** New contrast at A2, after g:gerund-ways (u26): English says how in the verb and where in the little word. Spanish says where in the verb and how after it. *Salió corriendo*. *Entró caminando*, or just *entró*. Drill by translation, since English prompts force the choice. Bank support is already there: 37 sentences with *corriendo*.

**Will.** New contrast at u20: *Te llamo luego* (decided now), *Te voy a llamar* (a plan), *Te llamaré* (a promise). English gives no help. One sentence, three frames.

**Would and could.** New contrasts at u20 and u21. Would: *iría*, *iba*, *no quiso*. Could: *podía*, *pude*, *podría*, *sabía*.

**-ing.** Fix the test. Add the adjective job.

**False friends.** A `falseFriend` field on lexemes, plus 2 or 3 dedicated "don't be fooled" sets per band, carded as *Estoy emocionado*, not *Estoy excitado*. Include the dangerous ones (*excitado*, *caliente*, *embarazada*, *me gustas*).

**Subject pronouns.** A contrast around u09: *yo* only to contrast or insist, with paired lines (*Yo trabajo y tú descansas*). Then a passing note from the checker at B1 and up when an answer repeats *yo*.

### 6.5 Fix the accept problem at the root

Stop hand-authoring. `expandAccepted` already derives registers, gender, Peninsular. Add the six rewrites in P28. Then add a build-time report: for each rewrite, the count of bank sentences it unlocks. Rejection of correct Spanish is the most trust-destroying thing a language app can do, and `weak.ts` already works around it by treating free-form misses as noise, which means the app's richest signal is being discarded. Fixing accepts is what makes the free-form signal usable.

---

## 7. Uncertainties and limitations

- **Battery classification is my judgement**, not measured learner behaviour. The 28 "legitimate alternatives" and the split between "locates" and "misleads" are defensible but debatable. I reviewed every row by rule and hand-listed exceptions; I did not re-read all 279 a second time for the final counts. Treat the percentages as about right, not exact.
- **The battery uses my model sentences** plus realistic accepts, not always real bank rows. Real cards also get corpus alternatives; 2.4 uses real rows.
- **Paraphrase tests are mechanical.** A few "motion + *para*" and "I'm V-ing" rows are not good paraphrases and I excluded the plain-present result (0 of 37) from the findings. The motion reverse count is small because my regex was narrow; I report only the four genuine cases I verified.
- **Simulations:** u16 for 24 days, u22 for 14, u30 for 24, answering right. A learner who answers wrong would see more reviews, but code reading says the same bare cards. I did not simulate the whole course. The feature-card count is from one run.
- **I did not read** the 650 pattern scripts in full. I searched all of them by topic and read about 20 rules. So "absent" claims rest on grep across the full JSON (*convirt*, *excitad*, *corriendo*, *casó con* verified across all fields; *me gustas* across all fields). Something phrased differently could exist.
- **I did not inspect** stories, scenes, writing tasks, or the writing checker's real runs for interference; `writing.ts` was read but not tested. Not driven in a browser. Reference screen pitfalls not viewed as rendered.
- **Authority citations** are from memory of the standard references, without page checks. Section numbers are given only at chapter level for this reason. The claims most worth a second opinion: CX-019 and CX-020 (present subjunctive after a past main verb, how far to allow it for Colombia), CX-021 and CX-022 (*cuál* + noun), CX-023 (*al* + infinitive in immediate sequence), CX-025 (*pena*).
- **Standing-decision limits:** no listening means *ya voy* and stress contrasts (*hablo* against *habló*) are drilled by eye only, which is a real limit for preterite endings. No AI means the interference layer can only catch patterns it has been told about. A free-form answer with two simultaneous errors will get one hint.

---

## 8. Suggested implementation priorities

**First, this week. Content corrections, cheap and certain.**
1. Apply CX-001 (*más que* + number), CX-039 (*always para*), CX-003 to CX-006 (negated perception), CX-002 (fact-value test), CX-032 (will), CX-033 and CX-034 (would, preterite shift).
2. Apply the remaining high and medium claims after verification.

**Second. Stop the checker lying.**
3. `wordHint`: ser/estar and por/para before Levenshtein. Half a day.
4. `classifySub`: no spelling hint when lemmas match; no "check the meaning" when lemmas match; add `mood` and `aspect` kinds, even with generic text. One day. This removes most of the 46 misleading hints.
5. `canon`: stop the *gustar* false pass.
6. Variant generator for the six rewrites. Two or three days. This removes the largest class of false rejection, and honours the Peninsular decision.

**Third. Make contrast review real.**
7. Serve script items in contrast reviews. One day.
8. Fix `pickContrast` rotation and tag the bank by contrast at build time.
9. Spot-the-mistake item from pitfalls.

**Fourth. The interference layer.**
10. `interference.ts` with the 24 rules above, plus pitfall dictionary lookup. One to two weeks, largest return in the audit.
11. `hintKind` and rule id on `ReviewEvent`; weak spots by error kind. Then surface "You keep…" on Home.

**Fifth. New content.**
12. New contrasts: will, would, could, preterite shift verbs, motion, *a* against *para* after go, verb + preposition (earlier), subject pronouns.
13. Unify the subjunctive model and name.
14. False-friend field and sets; screen the 1,053 "(cognate)" lexemes.

Items 3 to 6 are the highest return on effort. Items 10 and 11 are the highest return outright, and they are what would make Fluidez feel like it has a teacher who has met English speakers before.
