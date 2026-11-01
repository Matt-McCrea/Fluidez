# Linguistics audit, band A1 (u01 to u14)

Specialist: Spanish linguistics, A1. Claims: `docs/swarm-audit/claims/L-A1.jsonl` (61 claims, prefix LA1, every quote machine-checked against its source file).

## Verdict in one paragraph

The Spanish in A1 is very good. I found nothing critical. In 15,089 bank rows a battery of mechanical scans found one wrong article, one normative error and four unnatural verbs. The stories read as real Colombian Spanish. The dialect decisions are carried out with care: *me regala*, *a la orden*, *qué pena*, *en agua o en leche*, *ya comiste*, *¿le provoca?* are all right.

The weakness is in the explanations, and it has one shape. Rules are written as absolutes ("only ever", "never", "always safe", "only when") that later content, sometimes the same unit, contradicts. Second, three first-contact models are thinner than they look: adjective agreement is taught as "for a woman", *me gusta* has no warning about people, and the masculine *-ma* family is never explained anywhere in the course. Most fixes are one sentence.

## 1. What was investigated

| Material | Coverage | How |
|---|---|---|
| Grammar scripts, A1 (45) | All 45: hook, examples, rule, small print, sound tip, every Read and Pick, every Your Turn, pitfalls, personal | Read in full, including the fields the evidence pack truncates (I re-dumped them from source) |
| Pattern scripts, A1 (91) | All 91: rule, small print, sound tip, examples, pitfalls. Read and Pick and Your Turn read for the 31 in the sample, and only partly (long lines were cut off) | Read |
| Bank, A1 (15,114 per stats, 15,089 rows loaded) | 720 sampled rows read line by line. All rows scanned by script | See section 2 |
| Chapters, A1 (38) | 6 chapters read: ch001, ch008, ch015, ch022, ch029, ch036 | Read, including questions and first glosses |
| Contrasts | Rules only for x:present-progressive, x:pret-imp, x:tu-usted, x:lo-le, and g:parecer-quedar, g:ser-estar-adjectives for follow-through | Read |
| Live sessions | Unit 1, days 1 to 3, via `tools/playtest/render.ts` | Rendered |

## 2. Evidence from the actual application

Scans over all A1 bank rows (scripts in the scratchpad, `la1/scan.py`, `scan2.py`, `gender.py`):

| Check | Result |
|---|---|
| Determiner and noun gender against the lexicon | 1 real error (u10-0321, *el aguapanela*). 4 other hits are false positives |
| Noun and adjective gender | 0 real errors in 22 hits |
| *a el*, *de el*, *y* before *i-*, *o* before *o-* | 0 |
| Apocope (*un bueno*, *primero día*, *alguno* + noun) | 0 |
| Accents (*fué*, *dió*, *esta* for *está*, *mas*, question words) | 0 |
| *la gente son*, *habían*, *hubieron* | 0 |
| Personal *a* missing before a named person | 0 real |
| *me gusta los*, *me gustan* + singular | 0 real |
| Voseo, vosotros | 0 |
| Peninsular vocabulary (*coche*, *ordenador*, *móvil*, *zumo*, *patata*, *autobús*, *camarero*, *conducir*) | 0 |
| Dashes in Spanish or English | 0 |
| Perfect for today's events (*hoy he…*) | 0 |
| *se trata de* with a subject | 1 (u11-0205) |
| *cayó* where speech needs *se cayó* | 4 (u14) |

`\\n` appears literally in 152 English fields of `bank/u13.json`. This is not a learner defect: `fixBreaks` in `src/exercises/dialogue.ts` converts it in `src/ui/session/cards.ts`. It is untidy data and any new code path that bypasses `cards.ts` will show it.

Rendered unit 1 confirms Read and Pick and Your Turn appear as written. Pitfalls come through `src/ui/blocks/teach.tsx` and the reference screen, so script defects in that field do reach learners, though `render.ts` does not print them.

Label and English variety drift, A1 bank:

| Pair | Counts |
|---|---|
| (to a friend) / (informal) | 860 / 315 |
| (polite) / (formal) | 378 / 39 |
| mum / mom | 57 / 103 |
| neighbourhood / neighbor | 222 / 71 |
| football / soccer | 72 / 16 |
| film / movie | 32 / 23 |

## 3. Specific problems

Severity follows the brief. Each item names its claim ids.

### High

**H1. Adjective agreement is taught as sex, not grammar.** `g:adjective-agreement` rule. LA1-002, LA1-005.
Quote: "A describing word matches the person or thing it describes: a man or a woman, one or more." and "Words ending in *o* switch to *a* for a woman".
Evidence: of 6 examples, 10 Read and Pick, 8 Your Turn and 4 pitfalls, none agrees with a thing. The title says "people and things".
Consequence: this comes in the unit after "It's a label, not a meaning". The learner's working model becomes "*a* means female", which gives no way to reach *la casa es pequeña*.
Fix: state it for feminine nouns, use *el pan está listo, la leche está lista*, and put one such example in the list.

**H2. The *-ma* family is never explained.** `g:gender-articles` rule. LA1-004.
Quote: "Two surprises this week: *el día* is masculine."
Evidence: across all 916 scripts no rule, small print or pitfall explains *el problema*, *el idioma*, *el tema*, *el sistema*, *el clima*. `g:indefinites` mentions *problema* in passing. The node `es` for this lesson contains *la mano*, which the script also ignores.
Consequence: *la problema* is the classic English speaker's error, and "-a is usually feminine" actively produces it.
Fix: one line in the rule, ready to paste in the claim.

**H3. *Me gusta* plus a person has no warning.** `g:gustar-basic`. LA1-003, LA1-020.
Quote: Read and Pick "Me gusta Tomás." = "I like Tomás."; "¿Te gusta Mariana?" = "Do you like Mariana?"
Evidence: the course's fix, *me cae bien*, arrives at u15 in `g:parecer-quedar`, and that script does not mention the trap either.
Consequence: a learner tells a friend *Me gusta tu hermana* and means something innocent.
Fix: one warning line now, swap the two person cards for places or things, and add the point to `g:parecer-quedar`.

**H4. False stress in the stress lesson.** `g:sounds-letters` pitfalls[0]. LA1-001.
Quote: "Without the mark, a Spanish reader says BO-go-ta."
Evidence: the rule three paragraphs earlier predicts bo-GO-ta.
Consequence: small in pronunciation terms, serious as a teaching moment. It is day 3, and it is the worked example of the rule.
Fix: bo-GO-ta.

### Medium: rules stated as absolutes that the course then breaks

| Item | Quote | Contradicted by | Claims |
|---|---|---|---|
| Location is never *es* | `p:quedar-cerca`: "And location is never *es*." | u03-0442 *La fiesta es en el café…*, u04-0356, u05-0933, u09-0691. Contrast not until u17 d8 | LA1-014, LA1-015 |
| *Le* only for people | `g:indirect-objects`: "They are only ever for people." | `p:le-falta-sal` *A la sopa le falta sal*; `p:quedar-faltar-sobrar` | LA1-009 |
| Pronoun in front "always safe" | `g:object-pronoun-position` YT1 why | *Hay que hacerlo*: 78 uses with the enclitic, 0 with *lo hay que*. Also *me gusta verla*, *para verte* | LA1-010, LA1-011 |
| Progressive only "as you speak" | `g:estar-gerund`: "I'm working at a café these days is *Trabajo en un café*" | u14-0056 *Estoy aprendiendo español*, u08-0235 *No estoy trabajando hoy* | LA1-007, LA1-008 |
| Questions don't swap words | `g:ser-identity` | `p:question-word-order`, g:present-ar RP8 | LA1-026 |
| *Hace* always with a past verb | `g:hace-ago` rule and pitfall | u07-0326, u07-0655, u07-0702, u07-1064, all tagged g:hace-ago, all present tense with a "for" meaning | LA1-016 to 019 |
| Not *es difícil de aprender* | `p:es-adj-inf` | u39-0263, u39-0271 | LA1-024 |
| *Un* returns "only when you add something" | `p:ser-profession-no-article`, and pitfall marks *Es médico colombiano* wrong | u01-0242 *Soy profesor de español en Toronto*. Learner will produce *Soy un ingeniero civil* | LA1-022, LA1-023 |
| Quick test by English word | `p:bien-mal-vs-bueno-malo`: "if English says good or bad…" | *Me siento mal*, *Estoy mal*, u02-0314 *está mal* | LA1-021 |

Why this matters more than the count suggests: each is a mental model the learner stores and a later band has to pull out. In A1 scripts the words "never", "always" and "only ever" occur 171 times across 136 scripts. Most are fine. Nobody has checked them against the rest of the course.

### Medium: thin or misleading models

- **`g:reflexive-routine` has no reusable model.** LA1-031. The title promises *me levanto, te duchas, se acuesta*; the script drills *irse, sentirse, encontrarse, parecerse* and says routine verbs come "later this week". No example shows the action coming back on the doer, and there is no *lavo el carro* / *me lavo* contrast. "Some verbs have a little word" is a rule to memorise, not a model. Needs a human rewrite.
- **`p:es-tiene-lleva` "the lasting stuff".** LA1-042, LA1-058. The one permanence framing in A1. The course otherwise avoids this well (`g:ser-estar-adjectives` and `x:ser-estar-adj`: portrait or snapshot). It will not survive *es joven* or *está casado*.
- **No ser/estar word between u02 and u15.** LA1-006. *Es alta* and *está cansada* sit side by side from u02 d5, and the Personal task requires both. One sentence bridges the gap.
- **`g:preterite-ser-ir-hacer` calls *fue un desastre* "a description"**, and two units later `g:imperfect-states` says "For describing, use *era*". LA1-013.
- **`g:direct-objects` omits *lo*, *la*, *los*, *las* as "you".** LA1-030. Only stated at B1, yet u13-0701 *ya los atiendo* and the chunk *Qué pena molestarlo* use it.
- **`g:tener-que-hay-que` glosses *deber* as "should"**, then *no debes* as "mustn't"; the bank uses should, have to and shouldn't. LA1-027, LA1-049.
- **`g:commands-usted` spelling gap.** LA1-028. The rule produces *page* from *pagar*; u13-0680 has *Pague en la caja*.
- **`g:sounds-letters` *y*.** LA1-029. "*ll* and *y* sound like the y in 'yes'" gives the wrong sound for *y*, *soy*, *muy*, *hay*, all already known.

### Medium: Spanish or dialect defects

- `Tome la TransMilenio` in node `es` of g:commands-usted; the corpus has *el TransMilenio* 16 times. LA1-012.
- u11-0205 *La carta se trata de la casa*: *tratarse de* is impersonal (RAE DPD). Also u49-t-verbs-prepositions-0003, outside this band. LA1-032.
- u14-0793, 0740, 0741, 0712: *cayó* where speech says *se cayó*, as in *Mi abuela cayó en la calle*. LA1-033 to 036.
- u10-0321 *el aguapanela*: the initial *a* is unstressed, so *la*. LA1-037.
- ch029 *Yo comí las almojábanas de Rosa todos los domingos de mi niñez*, five days after the unit marks this pattern as wrong. Defensible Spanish, wrong moment. LA1-038.
- *moreno* glossed "dark-haired" throughout u05 and in g:possessives. In Colombia it mainly means skin tone. Medium confidence (0.65). LA1-039, LA1-040. Note u05-0123 *Soy moreno, tengo el pelo negro* = "I'm dark-haired, I have black hair", which is circular in English.
- `l:mono` is glossed "overalls", the Peninsular sense, with pos adj. In Colombia *mono* is blond, as the note in p:es-tiene-lleva says. LA1-041.
- `p:subirse-bajarse` says "*Coger* is the Spain word". False for Bogotá. Recommending *tomar* is fine, the reason is not. LA1-025.

### Low

Table in the claims file: LA1-043 to LA1-061. The ones most worth doing because they are cheap and certain: LA1-048 ("Where she was" on a card addressed to a friend), LA1-043 (pitfall says stress moves, rule says it stays), LA1-047 ("Spanish has no word for used to", against p:soler-inf's *solía*), LA1-054 (first floor against ground floor).

## 4. What the application does well and must be preserved

- **Stress model for stem changes** (`g:stem-boot`: "change a vowel in the middle when you stress it"). A real model, and the sound tips reinforce it.
- **`gustar` as "coffee pleases me"**, with *gusta* following the thing. Reusable, and it carries over to *encantar*, *faltar*, *parecer*.
- **Scene and event** in `g:pret-vs-imperfect`, with the "and then" test and "the scene is the stage". Best explanation in the band. `x:pret-imp` properly covers *llovió toda la noche* the next day, so the "weather is scene" line is safe.
- **`g:estar-location-states` avoids permanent and temporary** entirely. Do not let anyone "simplify" it back. `g:ser-estar-adjectives` continues this.
- **`g:hay-vs-esta` test by the following word.** Simple and nearly exceptionless.
- **`g:perfecto-experience`** on the narrow Colombian job of the perfect, and the preterite for *hoy*.
- **`p:el-agua-fria`** explains *el agua* by stress, so it predicts *la arepa*. **`p:mas-de-number`** includes the *no… más que* twist.
- **`p:question-word-order`** puts inversion in u02. **`p:personal-a`** gets "specific person" and the *tener* and *any waiter* exceptions right.
- **`x:tu-usted`** on *usted* among friends and families in Colombia.
- **Colombian detail:** *primer piso*, *en la mañana*, *un cuarto para las ocho*, *¿me regala?*, *no sirve*, *demorarse*, *en agua o en leche*, `p:street-names`.
- **Respellings in `g:sounds-letters`** are all right for Latin American Spanish, apart from H4.
- **Story prose.** The six chapters I read are natural, funny and level-appropriate.

## 5. Missing capabilities

1. A check that compares rule statements across scripts. Every medium contradiction above sits between two files that each pass the gate alone.
2. A bank-to-rule check for the current lesson. The four *hace* rows are tagged to a node whose rule they break.
3. A first-contact explanation of the *-ma* family and of *la mano*, *la foto*, *la moto*. Nothing covers these.
4. A teaching point for *caerse*, or a lexeme rule that prefers the pronominal form. It arrives at B1, yet *caer* is drilled bare at u14.
5. A dialect pass on glosses. `l:mono` and *moreno* show Peninsular senses got through the lexeme stage.

## 6. Recommended improvements

- Apply the one-sentence fixes in the claims file. Most need no redesign.
- Rewrite `g:reflexive-routine` so its first examples are true reflexives with non-reflexive partners. Cost: a new teaching order inside u09, because the routine verbs are currently held back by vocabulary gating.
- Add a build-time report that lists every "never", "always", "only" in A1 and A2 rule text for a human or model to test against the bank. Advisory, not a gate error.
- Add a tag rule: any bank row with a target node must not match that node's listed pitfall shape. This would have caught the *hace* rows and ch029.
- Move *tengo afán* and *estoy de afán* down from u32 into A1 alongside *tengo prisa*. LA1-061.
- Put *Qué pena* on the apology ladder in `p:siento-llegar-tarde`. LA1-060.
- Normalise the labels and the English variety. Pick one of "(to a friend)" and "(informal)", one of "(polite)" and "(formal)", and one spelling. Mechanical, and worth doing in one sweep across all bands.

## 7. Uncertainties and limitations

Not inspected: 14,369 A1 bank rows were scanned by regex only, not read, so a wrong translation that is structurally fine would escape me. That is 95 percent of the bank. English translations were not machine-checked at all. Also not inspected: 32 of 38 A1 chapters, the 60 unsampled patterns' Read and Pick and Your Turn, the A1 chunks, lexeme glosses other than those I looked up, scenes, writing tasks, and the contrast scripts beyond four rules. Other bands were only touched to follow a contradiction.

Confidence notes:

- *moreno* (LA1-039, 040, 0.65) rests on my knowledge of Colombian usage. A Colombian reader should confirm before changing eight bank rows. The English "dark" keeps both senses and is the safe fix.
- *Siento llegar tarde* (LA1-060, 0.6) and *tengo afán* (LA1-061, 0.7) are judgements of frequency, not errors.
- ch029 (LA1-038, 0.72): the preterite is grammatical as a rhetorical total. The claim is about consistency with the lesson.
- *Es médico colombiano* (LA1-023, 0.75): some teachers would prefer the article. The claim is only that marking it wrong is too strong.
- Not claimed, but a Colombian reader should weigh in: *una radio* for the device (12 rows against 1 *el radio*). In Bogotá *el radio* is common for the set, *la radio* for the medium. Both are standard, so I left it.
- Not claimed: `p:quedar-cerca` and `p:street-names` mark *¿Dónde es…?* style location as wrong. I believe Colombians do say *es en la Séptima* for directions. It may be a false correction, but I am not sure enough to file it.
- Limitation from the standing decisions: with no audio, the respellings carry all the pronunciation teaching, so errors there cost more than usual. I checked each one.

## 8. Suggested implementation priorities

1. **Now, one sitting.** LA1-001, 002, 003, 004, 005, 020. The four high items.
2. **Next, the contradictions.** LA1-007 to 011, 014 to 019, 021 to 024, 026. These stop later bands having to undo A1.
3. **Spanish fixes in data.** LA1-012, 025, 032 to 038, 041. Low risk, mechanical once verified.
4. **Thin models.** LA1-006, 013, 027 to 030, 042.
5. **Rewrite `g:reflexive-routine`.** LA1-031. Needs a person and a re-sequencing look at u09.
6. **Colombian check, then sweep.** LA1-039, 040, 060, 061, and the label and spelling normalisation.
7. **Tooling.** The absolutes report and the pitfall-shape tag rule.
