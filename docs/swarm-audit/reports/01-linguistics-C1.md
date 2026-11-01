# Linguistic audit of band C1

Specialist: Spanish linguistics, band C1 (units 52 to 60). Claims file: `docs/swarm-audit/claims/L-C1.jsonl`, prefix LC1, 98 claims. Every stored-text quote in that file was checked verbatim against its source by script. Claims quoting generator output are marked as rendered output.

## Verdict in one paragraph

The handwritten Spanish at C1 is better than I expected, and the story is the best thing here. But the exercises wrap around that Spanish in a way that does real damage. The most serious defects are not in the scripts at all. At the end of the course the generators make the learner type voseo and future subjunctive, which the scripts say never to use, and they mark as correct sentences such as *Ayer cuidá a tu hermano mientras yo salí* and *Poco no me sirvió, la verdad*. The second of those is the exact error listed as a pitfall in that lesson. Within the scripts the failure is a pattern: a neat rule stated too absolutely, then contradicted by the script's own examples or by the bank. *De ahí que* follows the main verb's tense (it does not). What follows *o sea* is "never a new fact" (half the examples are new facts). *Por mucho que* takes the subjunctive (not for real past events, and no row in the course shows that). *Cuanto más* needs nothing further (it agrees, and six rows are wrong because nobody said so). The C1 grammar is also thinner than its label. Several scripts are B1 topics with a C1 title.

---

## 1. What was investigated

**Read in full, every card, from the source JSON:** all 20 C1 grammar scripts. `scripts-grammar-C1.md` truncates long lines at about 1,440 characters, cutting off Read and Pick and Your Turn, so I rendered the files myself. For each script I read the hook, examples, rule, small print, all Read and Pick items, all Your Turn items including `accept` and `why`, and the pitfalls.

**Read in full, sample:** 32 C1 pattern scripts of 188, every card, from JSON. 706 bank rows (every 19th of 13,410). 5 chapters of 45 (ch175, ch184, ch193, ch202, ch211).

**Measured by script over everything:** all 13,410 C1 bank rows, all 72,693 rows where the claim is about the whole course, all 916 scripts, all 219 chapters, all 270 scenes.

**Rendered as a learner sees it:** `tools/playtest/render.ts` at u52 (7 days), u59 (8 days), u60 (8 days).

**Tested against the real checker:** about 30 learner answers run through `matchTranslation` and `checkExact`.

---

## 2. Evidence from the actual application

### 2.1 What the learner is made to type at u59 and u60

From `render.ts 59 8` and `render.ts 60 8`, all served as typed production with this as the single right answer:

| Card | Required answer | Status |
|---|---|---|
| How do you say this in Spanish? You're the only one who understands me. (vos) | *Vos sos el único que me entiende.* | Voseo production. The script says "never to say it". *Tú eres el único…* is rejected. |
| Sing that song again, I liked it. (vos) | *Cantá otra vez esa canción, que me gustó.* | *Canta otra vez…* is rejected with the hint "Check the accents." |
| Those who live in the area will receive a notice. | *Quienes vivieren en la zona recibirán un aviso.* | Required archaism. *Quienes vivan…* is rejected with "Check the verb ending". |
| Say it happened yesterday: *Cuidá a tu hermano mientras yo salgo.* | *Ayer cuidá a tu hermano mientras yo salí.* | Imperative with "yesterday". Ungrammatical. |
| Say it happened yesterday: *Tinto, que hace frío.* | *Ayer Tinto, que hizo frío.* | Nonsense. |
| Say it was like this before: *Vos sos el que tiene que decidir.* | *Antes Vos sos el que tenía que decidir.* | Half shifted, stray capital. |
| Say it happened yesterday: *Raras veces llama Tomás a su mamá.* | *Ayer Raras veces llamó Tomás a su mamá.* | "Yesterday" contradicts "rarely". |
| Make it negative: *Poco me sirvió, la verdad.* | *Poco no me sirvió, la verdad.* | The script's own listed pitfall, marked correct. |
| Make it negative: *Contá cómo te fue con el abogado.* | *Contá cómo no te fue con el abogado.* | Nonsense. |

Of the 15 tense transforms in those 16 rendered days, 10 are ungrammatical or nonsense, 5 are awkward or force voseo, and none is natural. I saw none in 7 days of u52, so the problem concentrates in drills on rows that are stylised, fragmentary or dialectal. A survey of all C1 rows found the same class elsewhere: *Ayer Cada uní con su cuento: ese es el barrio.* (u53-0542, *uno* conjugated as *unir*), *Antes Gracias, tenía razón.* (u53-1645), *Ayer de ser así, fuimos a juicio.* (u53-0882), *Antes Cada quien sabía lo suyo y calla lo ajeno.* (u53-0543). 349 of 2,126 Antes or Ayer answers keep a stray capital.

### 2.2 Standard Spanish the checker rejects at C1

All tested through `matchTranslation`, using the card's real `accept`.

| Learner types | Card expects | Why the learner is right |
|---|---|---|
| *De haber llegado antes, hubiéramos visto a Hernando.* | *…habríamos visto…* | *Hubiera* in the result clause is standard and very common in Latin America. |
| *Mientras más practico, mejor hablo.* | *Cuanto más practico…* | The course taught *mientras más* as the main form at g:comparatives-advanced. |
| *Me preocupó… que no llamara…* | *…que no llamase…* (u52-0611) | grammar.json: "-ra for production". |
| *El hecho de que no llamase me preocupa.* | *…no llamara…* | -ra and -se are equivalent. |
| *El hecho de que no haya llamado me preocupa.* | *…no llamara…* | Probably the most natural form here. |
| *Es difícil decirlo.* | *Difícil es decirlo.* | The prompt is only "It's hard to say". |
| *He aprendido mucho aquí.* | *Mucho he aprendido aquí.* | The prompt is only "I've learned a lot here". |
| *Es una tienda cuyas empleadas son todas mujeres.* | *…todas de Cali.* | That is the sentence printed in the prompt. |

### 2.3 Measurements

| Measure | Result |
|---|---|
| Gerund of posteriority, comma + gerund after a preterite, 13,410 C1 rows | 0 real cases in 5 regex hits |
| Dequeísmo (*pienso de que* and similar) | 0 |
| Human indirect object without doubling (*dijo a Vale*) | 0 |
| *en base a*, *hace sentido*, *tomar lugar*, *aplicar para*, *eventualmente* | 0 |
| *por mucho que* or *por más que* + indicative, whole course | 0 of 23 rows |
| *de manera que* or *de modo que* + subjunctive of purpose, whole course | 0 |
| *cuanta*, *cuantos*, *cuantas* + más or menos, whole course | 0 rows, against 6 rows of *cuanto* + feminine noun |
| *cuanto más* with a subjunctive verb | 2 rows, while the rule says "the verbs stay normal" |
| *mientras más* | 1 row in the bank, *entre más* 0, *cuanto más* about 240 |
| *nada más* + infinitive | 58 rows, almost all in u58 |
| Voseo in story text | 0 of 219 chapters. The only hit is a wrong option in a ch213 question. Scenes: 0 of 270. |
| leísmo, laísmo, loísmo mentioned | 0 of 916 scripts |
| *coger* in the bank | 0 rows, while three scripts warn against it |
| *por parte de* | in no script, 2 bank rows, neither with a noun of action |
| u52 -se rows with a -ra accept | 0 of 135 (u51: 129 of 129) |
| Future subjunctive rows with any accept | 0 of 127 |

---

## 3. Specific problems discovered

Numbering is mine. Each entry gives the LC1 claim family. Severity follows the brief's guide.

### Critical

**P1. Generated transforms mark ungrammatical Spanish as the right answer.**
Locus: `app/src/exercises/ladder.ts`, `transformsOf`, lines 227 to 253. Evidence in 2.1.
Consequence: at the top of the course, on the lessons about style, the learner is drilled to type broken Spanish, and the correct refusal to do so is scored wrong. *Poco no me sirvió* teaches the exact error the lesson warns against.
Fix: stop offering tense and negate transforms on rows that contain a second finite clause, an imperative, a vocative, a fragment or a reply turn, on any row whose first word is not the subject, and on any row targeting g:voseo-recognition, g:future-subj-recognition, g:se-form-recognition or g:word-order-style. Refuse any row where the parser's verb is not the same token the tagger found, which catches *uno*. Lowercase the old first word. Until this ships, the safest patch is to remove these ops from the C1 drill list in `compile.ts` lines 990 and 1224.
Claims: LC1-001, 002, 003.

**P2. Recognition-only grammar is forced into typed production.**
Locus: no receptive flag exists. `compile.ts` drills every target node with `['choose','type','transform','translate']`. grep finds `se-form`, `voseo` and `future-subj` only in the tagger.
Evidence: 20 "(vos)" production cards in 8 days. *Quienes vivieren…* and *Quien quisiere celeste…* required at u60.
Consequence: this contradicts the owner's "no voseo" decision and the scripts' "never use it yourself", and the correct tú answer is failed. A learner reasonably concludes they should speak this way.
Fix: add `receptive: true` to these four nodes (g:vosotros-recognition is in the same class). The compiler then gives them only read, pick and tú-conversion cards, which the scripts already do well: "Say it in *tú*: Vos tenés razón." The tagger should also exclude such rows as production targets.
Claims: LC1-004, 005.

### High

**P3. The mood model in g:mood-choice-fine fails its own first example.**
Quote: "*El hecho de que*… The fact isn't in doubt… so it usually takes the subjunctive", then "Ask yourself: pointed at, or still open?"
A fact you are reacting to is the most pointed-at thing there is. Applying the test gives the indicative.
Fix: use the one axis that unifies C1 mood: am I putting this forward as news? g:consecutive-advanced already says this ("you are not announcing the result as news"). So does p:no-porque-sino-porque in substance. A single sentence, repeated across the band, would do more for this learner than any new rule. Claim LC1-013.

**P4. The rule for *o sea* contradicts its examples, and two scripts contradict each other.**
g:reformulation: "What follows is never a new fact." But *Es caro; o sea, no lo podemos pagar* and *Hernando viene todos los días; o sea, conoce el café mejor que nadie* are conclusions. p:o-sea-que, one day later: "no *que*, no conclusion", yet u53-1223 *Llegué tarde; o sea, me perdí el discurso* is a conclusion with no *que*. Conclusive *o sea* is then translated "I mean", where English needs "so".
The consequence is that the learner gets no model for the commonest spoken use of the commonest discourse marker in Bogotá. Hernando's own line (ch184) is *O sea que lo encontraron con las maletas hechas*.
Claims: LC1-008 to 012.

**P5. *De ahí que*: the tense rule is false.**
Quote: "If the main sentence is in the past, the verb after *de ahí que* is the past subjunctive."
Bank: u56-0203 *La ciudad creció sin plan; de ahí que el tráfico sea una pesadilla.* u57-0403 *…de ahí que nos hayan sorprendido las de hoy.*
Consequence: the learner writes *de ahí que el tráfico fuera*, changing the meaning. The tense follows the time of the result. Note what is worth keeping: the *reason* for the subjunctive in this script is the best mood explanation in the band.
Claims: LC1-037 to 039.

**P6. *De manera que* + subjunctive is hinted at and never taught.**
The hook says "the choice of connector decides the mood of the verb", the rule says "when you simply report what happened", and the other case never comes. Zero rows and zero scripts in the course show *habla despacio, de manera que te entiendan*. This is the classic mood alternation for this connector. Claim LC1-040.

**P7. *Por mucho que* "takes the subjunctive".**
False for real events: *Por más que lo intentó, no pudo.* 0 of 23 rows in the whole course show it. Two rows narrate real events in the subjunctive where the indicative is the normal choice (u52-0266, u44-0092). The learner will misread this in every novel and over-apply the subjunctive in writing. Claims LC1-034, 035.

**P8. *Cuanto más*: the agreement rule is missing and six rows are wrong.**
Quote: "The verbs stay normal". Two things are absent: agreement before a noun, and the subjunctive for what is still to come. Wrong rows: u58-0119 *Cuanto menos plata hay*, u58-0142 and u58-0310 *Cuanto menos nieve cae*, u58-0161 *Cuanto más lluvia cae*, u58-0182 *Cuanto menos luz entra*, u57-0062 *Cuanto más prisa tengo*. The course has no row with *cuanta*, so the unagreed form is the only one the learner ever sees. u58-0133 and u58-0186 use the subjunctive while the rule forbids it.
Separately, Your Turn rejects *mientras más*, the form the course taught earlier, and the form people actually use in Colombia alongside *entre más*.
Claims: LC1-045 to 054.

**P9. A card that cannot be passed by doing what it says.**
g:cuyo-relatives yourTurn[1]: the prompt ends *todas mujeres*, the answer ends *todas de Cali*. Claim LC1-028.

**P10. Checker rejects standard variants.**
Evidence in 2.2. Fix at the root, in `variants.ts`: global -ra and -se equivalence, and *hubiera* and *habría* equivalence in the apodosis of past unreal conditions. For u52, also fix the data: 135 rows lack the -ra accept that u51 has. I did not see a u52 row served in production in the 7 days I rendered (the -se production cards were u51 rows), but nothing prevents it. Those rows have the same production route as any other.
Claims: LC1-006, 007, 014, 041, 042, 052, 053.

**P11. g:voseo-recognition makes promises the story does not keep.**
"Vale does it all the time when she is happy or angry." "You will hear it all through Vale's story." She never does, in any chapter or scene. The story reaches Medellín at the end of the course, so the stronger fix is to add real paisa voseo to Vale's family there. Recognition needs exposure, and this is the natural place.
Claims: LC1-060, 061. The separate *vení* error is LC1-059.

### Medium

**P12. Concession and conjecture are merged.** g:tense-modal-uses files *será caro, pero…* under "Future for a guess". The speaker in *Será rico, pero no tiene modales* is not guessing. This is a real distinction the learner needs, and the small print names it while the rule erases it. Claims LC1-017, 018.

**P13. "The imperfect is for the past"** appears in the pitfall of the lesson that opens "Spanish tenses do not always mean their clock time", one day before p:imperfecto-citativo teaches *Ernesto llegaba mañana, ¿no?* Claim LC1-019.

**P14. *¡Qué va!* "is always a no".** It rejects what was said, so after a negative question it opens a yes. Claims LC1-024, 025.

**P15. *Coger*.** "Never *coger*" and "*Coger* is the Spain word" are false for Colombia, the setting of the story, where it is ordinary. The bank has 0 rows. Keeping neutral production without it is defensible. Telling a Bogotá-bound learner it is forbidden or foreign is not, and the owner's own rule is that natural Spanish wins. Claims LC1-087 to 089.

**P16. *Ignorar* "is not to ignore someone".** False as stated. The DLE has the sense, and u43 teaches it: *Ignoré el aviso y salí sin abrigo.* The lexeme gloss "to not know" hides this. Claims LC1-090 to 092.

**P17. *Apenas* and *nada más*.** The rule gives *apenas* + past only, though the bank has used it with the subjunctive since u32 (*Quiero que me llames apenas llegues*). It then gives 58 rows to *nada más* + infinitive, a mostly Peninsular construction, with no regional note: *Nada más terminar la viga, llámame*, *¿Vas a llamar nada más llegar?* Claims LC1-055, 056.

**P18. Word order.** g:word-order-style is the last word-order lesson, and "Normal order puts the subject first" is the wrong picture for *llegó Vale*, *se fue la luz*, *queda poco*. Subject-after-verb when the subject is the news is not taught anywhere as a principle (one clause in g:topic-fronting). Four Your Turn cards reject the neutral translation. Nine rows are fronted yes-no questions that nobody would say (*¿Mucho trabajas tú los fines de semana?*). These are generated variants of a literary device. Claims LC1-068 to 081.

**P19. Terminology.** C1 uses "wish form" in 4 scripts and "subjunctive" in 4 others, plus "maybe form", "special form", "plain wish form" (for *llamara*, which the course elsewhere contrasts with the wish forms), and "two moods" (for two tenses of one mood, p:ni-aunque). "Wish form" is actively wrong at *no es que dude*, since nothing is wished, and the same sentence explains that. At C1 use the real names. A learner who has reached u52 is about to read grammars and ask teachers. Claims LC1-023, 026, 027, 093.

**P20. Thin scripts.** g:ser-estar-c1 teaches *La mesa es de madera* and three phrases at a level labelled "the edges". g:evaluative-adverbs is an A2 topic plus a comma. g:nominalisation lists five nouns and then says the ending does not tell you much, when suffixes (-ción, -miento, -da, -ura) are precisely the reusable model. These topics spend the band's scarce grammar days and do not reach what a C1 learner cannot yet do. See section 5. Claims LC1-058, 086.

**P21. Missing practice for promised items.** Como + subjunctive is in g:mood-choice-fine's title and rule but in no example or card. *Siempre y cuando* is in g:conditional-advanced's title and nowhere in the script. *El resto* is in g:agreement-tricky's title with no agreement treatment. Some of these exist in patterns, but the promise is unkept where it is made. Claims LC1-015, 044, 057.

**P22. Conditional *como* + subjunctive gets no regional note** though it is much more typical of Spain, and Bogotá characters use it (ch202: *Como no respire, mija, se me desmaya*). Confidence 0.62. Flagged for verification. Claim LC1-016.

**P23. Forms used without being taught.** Preposition + *cuyo* appears in 18 rows and is never taught. Absolutes get no restriction to verbs with an end point, so *Caminado el parque* looks legal. Voseo object forms (*para vos*, *vos te…*) are absent from the rule. Claims LC1-033, 062, 085.

**P24. Future subjunctive rows contradict the script and invent proverbs.** *Quien bien amare, tarde olvidará* and *Quien quisiere celeste, que le cueste* are fabricated archaisations of real sayings. *Si algún día tuviere una hija, le pondré Rosa* models what the pitfall says "No one talks this way". The real saying *Si a Roma fueres, haz como vieres* (u59-1188) shows the right kind of row. Claims LC1-063 to 067.

### Low

Truncated options in g:cuyo-relatives Read and Pick. *Aunque* called teenage in the concessive hook (rated medium in the claims file because it changes behaviour). RP[1] distractor in g:tense-modal-uses is a valid reading. "Sit at the start" for hedges, contradicted by the bank. *Arreglaron mi celular* where *me arreglaron el celular* is natural. *asumió* for "assumed". A cobbler saying *cuyo* in ch193. *Estoy por todo* (rated medium: two rows, not idiomatic). Claims LC1-021, 022, 029 to 032, 036, 054, 094 to 098.

---

## 3a. Script by script

Model means: does it give a reusable mental model or only a list?

| Script | Accurate | Model | Examples show the rule | Main gap |
|---|---|---|---|---|
| g:tense-modal-uses | Mostly | Good thesis, "tenses step outside their time" | Yes | Merges concession and conjecture; imperfect pitfall contradicts thesis |
| g:mood-choice-fine | Partly | Fails on its first example | Partly; como + subj never shown | Needs the news axis |
| g:hedging-distance | Yes | Good, two moves | Yes | "Wish form"; *dizque* absent though it is the Colombian hedge |
| g:reformulation | Partly | Wrong absolute | Examples break the rule | Conclusive *o sea*; *mejor dicho* never shown here |
| g:emphatic-structures | Mostly | List of three | Yes | *Qué va* overstated |
| g:wish-exclamatives | Yes | Fair, past versus now | Yes | "Plain wish form" |
| g:cuyo-relatives | Yes | Good, joining two sentences | Yes, one broken card | Preposition + cuyo |
| g:nominalisation | Yes | Weak, a list of nouns | Yes | Suffix families; *por parte de*; doer versus thing done |
| g:absolute-constructions | Yes | Good | Yes | Restriction to end-point verbs |
| g:concessive-advanced | Partly | List | Yes | *Por mucho que* + indicative; *mucho* + noun; *aunque* slur |
| g:consecutive-advanced | Partly | Best mood explanation in the band, then a false tense rule | Yes, but bank contradicts | *De manera que* + subj |
| g:conditional-advanced | Yes | List of four | Yes | *De* + plain infinitive; *hubiera* in result |
| g:comparative-advanced-c1 | Partly | List; "three ways to weigh things up" does not cover *ni que* | Yes | Agreement, future subjunctive, *mientras más* |
| g:temporal-advanced | Mostly | List | Yes | *Apenas* narrowed; *nada más* not marked |
| g:agreement-tricky | Yes | Fair | Yes | First person plural; *el resto*; *ser* with plural attribute |
| g:ser-estar-c1 | Yes | Weak | Yes, but A2 to B1 | Does not reach the edges it names |
| g:voseo-recognition | One error (*vení*) | Good, tú conversion | Yes | False claims about the story; object forms |
| g:future-subj-recognition | Yes | Good, ending plus swap to present | Yes | Bank rows contradict it |
| g:word-order-style | Mostly | Fair | Yes | Subject after verb as news |
| g:evaluative-adverbs | Yes | Fine but A2 | Yes | Not a C1 topic as taught |

No script relies on grammar the learner has not met, with one mild exception: g:mood-choice-fine previews *como* + subjunctive before p:como-me-entere (u54) and g:conditional-advanced (u57). All translations in the 20 scripts are sound apart from the claims listed.

---

## 4. What the application does well and must be preserved

- **The story.** ch184 and ch202 are genuinely good writing in natural Colombian Spanish. The legal comedy of *Dicho de otro modo, el hotel adquirió una foto*, or Hernando's *Es lo que yo dije, pero en mi idioma*, carries grammar without seeming to. Do not let a grammar-repair pass flatten it. *Aunque fuera en contra mía* in ch202 is a better lesson on subjunctive with a known fact than anything in the scripts.
- **The Colombian texture of the bank.** *mamar gallo*, *qué embarrada*, *caer en cuenta*, *ir a cine*, *mal genio*, *firmar de último*, *qué pena con usted*, *¡Me hubieras gritado desde la ventana!* These are not textbook Spanish, and they are right.
- **The bank's mechanical cleanliness.** No gerund of posteriority, no dequeísmo, no undoubled human indirect object, no anglicism calques from my list, across 13,410 rows. That is a strong result, whatever process produced it. Keep that process.
- **Specific explanations worth copying elsewhere.** *De ahí que* ("you are not announcing the result as news"). p:no-porque-sino-porque (*No se va porque esté cansado* versus *está*). p:dativo-aspectual ("all of it, finished, and I was involved"). g:future-subj-recognition's conversion drills. g:voseo-recognition's "Say it in *tú*" cards. These last two are the right design for recognition.
- **The u56 and u57 absolute and concessive rows.** *Perdido el miedo, Tomás habló en la asamblea*; *Suscribimos la resolución todos los presentes*. Real C1 Spanish.

---

## 5. Missing capabilities

1. **A receptive flag on nodes** (P2). There is no way to say "read this, never type it".
2. **Subject position as information structure.** The principle "the news goes last" (*¿Quién llamó? Llamó Vale*; *Me gusta el café* versus *El café me gusta*) is the biggest single difference between correct and native-sounding C1 writing, and it is not taught.
3. **One mood model for the band** (P3), plus *aunque* + subjunctive on a fact you know (*Aunque seas mi hermano…*). x:aunque-ind-subj says this means "maybe you are, maybe not", which is the wrong reading of the commonest polemical use, though g:subj-concessive's "you don't care whether it's true" gets near it.
4. **Mood alternations with real meaning shifts**: *de manera que*, *por mucho que*, *cuanto más*, *el hecho de que* + indicative, *no digo que* + indicative. Each is half-taught.
5. **Choice of subjunctive tense.** g:subj-perfect exists at B1, but nothing at C1 addresses *que no llamara* versus *que no haya llamado* after a present main verb. The checker treats them as different sentences.
6. **Leísmo and laísmo awareness.** 0 of 916 scripts. Courtesy *le* is common in Bogotá (*¿Le ayudo?*, *le colaboro*) and Peninsular *le vi* is unavoidable in reading. A small recognition pattern would do.
7. **Gerund norms for the learner's own writing.** The bank avoids the gerund of posteriority, but no script warns a learner off it, and English "…, causing a crisis" pushes straight towards it. C1 writers need this warning. The same goes for the specifying gerund (*una caja conteniendo*).
8. **Other agreement traps at C1**: *Los colombianos somos…*, *Lo importante son los niños*, *uno de los que vinieron*, existential *había* with plural nouns (*habían muchas personas*, widespread in Latin America and worth a recognition note).
9. **Register as a taught dimension.** Several rows and lines put writing forms in speech (*cuyo* from a cobbler, -se forms to a friend, *cuyo* in a spoken question). The scripts state the register, and the content then ignores it.

---

## 6. Recommended improvements

Strongest design first, cost noted but not deciding.

1. **Introduce the receptive flag and cut unsafe transforms** (P1, P2). Small code change, high value. Add a gate rule: a generated answer that fails the tagger or changes only one of two finite verbs is an error.
2. **Add a gate for "rendered answers"**. Run every generator over every row at build time and fail on rules such as: Ayer or Antes followed by an imperative, a second present verb, or a frequency adverb; a capital after the first token; *no* inserted after *poco*, *raras veces*, *apenas*, *nunca*. The current gate only sees stored content, which is why this got through.
3. **Fix the checker's equivalences** (P10). One change clears a whole class.
4. **Rewrite the rules listed in the claims.** They are mostly one-sentence edits, and most have ready replacements.
5. **Rebuild C1 mood around one question.** A short u52 script, "News or not news", with four contrasts: *lo que dice* versus *lo que diga*, *el hecho de que*, *de manera que*, *por más que*. Then refer back to it in every later script instead of restating rules.
6. **Replace the thin scripts.** Rewrite g:ser-estar-c1 around real edge cases: resultative *estar* versus passive *ser*, *estar* for perceived change, *estar que*, *ser de esperar*, *el problema está en que*. Fold g:evaluative-adverbs into a richer script on sentence adverbs and evidentials. Rebuild g:nominalisation around suffix families and *por parte de*. Add g:subject-position as a new node. The owner wants few, long lessons at this level, and these fit that.
7. **Add paisa voseo to the Medellín chapters.** This makes the promise true and gives recognition its input, and it is the right ending for that thread.
8. **Regional honesty as a field.** A short `regionNote` on *nada más*, *como* + subj, *coger*, *qué va*, so the course can say "Spain" and "here" in one line and stop implying that everything is Bogotá.
9. **Rebalance proportional and temporal rows.** Add *mientras más* and *entre más*, and *apenas* + subj, to u57 and u58.

---

## 7. Uncertainties and limitations

- **Not inspected:** 156 of 188 C1 patterns, 12,704 of 13,410 C1 bank rows by eye (they were covered only by regex), 40 of 45 C1 chapters, C1 chunks, the 12 C1 contrast scripts, scenes and writing tasks except for voseo search, and exercises other than those in 3 rendered runs. Regex coverage is only as good as the patterns. Zero hits on dequeísmo, gerund misuse and undoubled objects means none of the shapes I searched for, not none at all.
- **No authorities were consulted directly.** RAE, ASALE, Butt and Benjamin, and Bosque and Demonte are cited from memory, so I have omitted section numbers. Anyone verifying should check the *cuanto* agreement claim, the *por mucho que* + indicative claim, and the *ignorar* DLE sense in the source. I am confident of all three.
- **Dialect claims are my weakest.** *Coger* in Colombia, I hold at 0.85. *Nada más* + infinitive as chiefly Peninsular at 0.72. Conditional *como* at 0.62. I have no corpus access. I deliberately did not flag *cañón* = "tough" (12 rows), because I could not establish whether it is current in Bogotá, and a false accusation would be worse than a miss. *¡Qué va!* is pan-Hispanic enough that I flagged only its semantics, not its presence.
- **My first *apenas* count was wrong.** I had 2 rows from a narrow regex, and a broader search found many more. I corrected the claim. I mention it so verifiers treat other "only N rows" statements with appropriate care. The ones in section 2.3 were each checked by listing the matches.
- **u52 -se rows in production:** I confirmed the data gap and the rejection, not that a learner meets one of those rows on a particular day.
- **Standing decision limitation:** no listening means *voseo-recognition* teaches "hearing" in text only. Its title says "Hearing paisas".

---

## 8. Suggested implementation priorities

1. **This week, before anything else:** remove tense and negate transforms from recognition nodes, g:word-order-style and any fragment or imperative row. Add the receptive flag (P1, P2).
2. **Same pass:** the broken card LC1-028, the six *cuanta* rows, *vení*, the two false voseo lines, the *de ahí que* tense rule, *no que, no conclusion*. These are mechanical.
3. **Checker:** -ra and -se, *hubiera* and *habría*, *mientras más* in accept, and the -ra accept across the 135 u52 rows.
4. **Rule rewrites from the claims file:** P3, P4, P6, P7, P8, P12, P13, P15, P16, P17.
5. **Build-time gate on rendered answers**, so P1 cannot recur.
6. **Terminology:** "subjunctive" throughout C1, with a one-line bridge from "wish form" at u52.
7. **New content:** the news-or-not script, g:subject-position, rebuilt g:ser-estar-c1 and g:nominalisation, voseo in the Medellín chapters, leísmo and gerund notes.
