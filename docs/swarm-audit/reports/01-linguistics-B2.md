# Linguistics audit, band B2 (u42 to u51)

Claims: `docs/swarm-audit/claims/L-B2.jsonl`, 113 claims with prefix LB2, every quote checked verbatim against the source file by script. 111 carry paste-ready replacements. Where a replacement changes both sides of a bank row, or a pitfall object, it is a JSON string.

**Verdict.** The B2 Spanish sentences are good. The explanations around them are much less reliable. In a 14,063-row bank my scans found one real tense-sequence error and two real `sino` errors, and the five chapters I read are close to native. The problems are in the rules. Ten lessons or fewer carry nearly all the damage, and they share one fault: **a preference or a default is stated as a law, and then correct Spanish is marked wrong.** I found 12 pitfalls of this kind. I ran six correct sentences through the real checker and all six fail flat, not even "near". A learner who produces natural Bogotá Spanish in these spots is told it is wrong.

The second fault is the opposite of what you would expect: **the bank is ahead of the teaching.** Learners are drilled on *quisiera* (106 of 120 rows targeting g:softening), *a no ser que* (54 rows), *el que* clefts, prepositional clefts and *-steis* forms, none of which any script explains. Meanwhile *por si*, the ordinary way to say "in case", is taught nowhere in the course.

---

## 1. What was investigated

Fully read:
- All 28 B2 grammar scripts, every field, including all Read and Pick and Your Turn items. The evidence pack truncates those, so I re-rendered them from the source JSON.
- 31 sampled B2 pattern scripts (every 6th of 184).
- 704 sampled bank rows (every 20th of 14,063).
- 5 of 50 B2 chapters.

Partly read, or measured by script:
- All 17 B2 contrast scripts: rule and pitfalls only. This was not in my brief. I added it after two of them produced real defects.
- 58 mood-related pitfalls extracted across all 184 B2 patterns.
- Regex scans over the whole B2 bank for mood, sequence, connector and relative errors, and whole-course scans for coverage. Every count in this report comes from those scans.
- 2 real sessions from the compiler: `render.ts 44 1` and `render.ts 46 8`.
- The real checker (`checkExact`) on correct sentences the lessons treat as wrong, with a positive control.

## 2. Evidence from the actual application

| Measurement | Result |
|---|---|
| Scripts teaching *por si* | 0 of 916. Not in the graph. 4 of 72,693 bank rows |
| Scripts explaining *quisiera* | 0. Mentioned in 3 scripts, all incidentally. No chunk |
| g:softening bank rows containing *quisiera* | 106 of 120 |
| g:subj-conditions: connectors taught | 4 |
| g:subj-conditions: connectors in its Examples, Read and Pick, Your Turn | 2. *a menos que* 0, *siempre que* 0 |
| g:subj-conditions targeted bank (124 rows) | *a no ser que* 54 (not in the rule), *con tal de que* 41, *en caso de que* 29, *a menos que* 0, *siempre que* 0 |
| *siempre que* as "as long as" in bank | First appears at u59, C1 |
| *siempre que* + indicative "whenever" | Taught at u17. The u44 small print says these connectors "always take the subjunctive" |
| Bank rows with indicative after *no sabía que* or *no me di cuenta de que* | At least 23 on a past-indicative regex, all checked by eye, e.g. u38-0541 *No me di cuenta de que estabas aquí* |
| *vuestro* | 0 scripts, 2 bank rows. 14 rows in *-steis*, 7 in *-bais* or *-íais*, none explained |
| Names for the subjunctive across 212 B2 grammar and pattern scripts | wish form (17 files), -ra form (14), changed ending (5), special form (3), past wish form (2), opposite ending, maybe form, imagined verb, whoever form (1 each). The word *subjunctive* appears in 58 |
| Dashes in B2 bank and grammar scripts | 0. Clean |

**Checker, tested live.** All six fail with `{"pass":false,"near":false}`, and the control passes.

| Correct Spanish typed | Card |
|---|---|
| No vi que Vale estaba enojada. | g:subj-perception-negated yourTurn[2] |
| No dijo que era urgente. | g:subj-perception-negated yourTurn[4] |
| No oí sonar el teléfono. | g:subj-perception-negated yourTurn[3] |
| Hernando dijo que ya habló con ellos. | g:reported-speech-full yourTurn[1] |
| No dudo que el plan es bueno, pero es caro. | p:concede-pero yourTurn[0] |
| Si hubiera sabido, venía antes. | Colloquial, included as a boundary case. No claim |

**A session bug found while rendering (LB2-104 to LB2-109).** `stripLabel` in `app/src/exercises/pairs.ts` line 44 treats any text before a colon as a label. At u44 d1 card 1 the learner sees *no voy a cambiar de opinión* taught as "I'm absolutely clear on that". At u46 d1 card 1 the listed new chunk *Antes de que se me olvide* is cut, and the learner drills *el viernes no hay clase*. The chunk being taught never appears. Five nodes are affected across the course, three of them B2.

## 3. Specific problems

### Critical

None. Nothing here teaches ungrammatical Spanish as a general habit.

### High

**H1. Negated perception verbs: the rule is wrong and correct Spanish is marked wrong.** g:subj-perception-negated. LB2-010 to 018.
- Rule: "Put *no* in front and you are no longer vouching, so the verb after *que* switches". Pitfalls mark *No vi que Vale estaba enojada* and *No dijo que era urgente* as errors.
- Why it is wrong: this is not the same switch as *no creo que*. These verbs leave a choice, and the choice means something. *Perdón, no vi que estabas ahí*: you were there and I missed you. *No vi que estuvieras ahí*: I saw no sign of you. The course already teaches this indicative at A2 (*No sabía que venías*), and a chapter uses it (ch209 *Yo no le dije que hablaba bonito*).
- Consequence: the learner loses a real distinction and is told the everyday form is wrong. The card's English "I didn't see that Vale was angry" normally presupposes she was angry, which is the case that wants the indicative.
- Also: *No oí que sonara el teléfono* for "I didn't hear the phone ring" is stilted. *No oí sonar el teléfono* uses p:la-vi-salir, taught four days earlier.
- Fix: full rule rewrite in LB2-010. The model is "who stands behind the claim", which is better than the current one and reusable.
- Confidence: high, but read section 7. I could not reach the NGLE, and some learner sites state the flat rule.

**H2. "In case" is taught wrongly, and *por si* does not exist in the course.** g:subj-conditions. LB2-004, 005, 007, 008, 082 to 096.
- Rule: "*en caso de que*: in case".
- Why it is wrong: English "in case" usually means a precaution you take regardless. *En caso de que* means "if it happens". The right test is: would you do it anyway? Then it is *por si*, with the indicative.
- Consequence: the card *En caso de que Simón escape, cierra la ventana* = "In case Simón escapes, close the window". The Spanish means close it if he has escaped. The English means close it now. They are different instructions. *Te aviso en caso de que haya novedades* = "in case there's any news" has the same fault.
- Fix: add the *por si* paragraph (LB2-005), fix five English sides, move ten precaution rows to *por si*. Those ten will need retagging.

**H3. "They always take the subjunctive" is false, and the course knows it.** g:subj-conditions smallPrint. LB2-003. *Siempre que* with the indicative was taught at u17: *Siempre que llueve, vendemos más tinto*. Related: the lesson teaches four connectors and drills two, while a fifth (*a no ser que*) dominates the bank unexplained (LB2-006).

**H4. "-ar verbs take -e: *llueva*, *pague*, *insista*".** g:subj-concessive rule. LB2-001. *Llover* is -er and *insistir* is -ir, and both forms end in -a. Only *pague* fits. The script's own Your Turn contradicts it twice. It is the plainest factual error in the band.

**H5. Total backshift in reported speech.** g:reported-speech-full. LB2-023 to 028.
- Rule: "everything takes one step back... Spanish does it as faithfully as English."
- Not so. *Dijo que viene mañana* is right if tomorrow has not come. *Dijo que ya habló con ellos* is normal, especially in Latin America. Two pitfalls, one in this script and one in g:subj-future-in-past, mark such sentences wrong without context.
- Consequence: a learner taught this will think Colombians are making mistakes, and will miss what the choice of tense implies.
- The lesson also never shifts persons: *"Tengo tu libro"* to *Dijo que tenía mi libro*. That is where reported speech really goes wrong (LB2-027).

**H6. Two lessons contradict each other on *no dudo que*.** LB2-019 to 022.
- g:subj-doubt pitfalls[1] marks *No dudo que tengas razón* wrong.
- p:concede-pero pitfalls[2] marks *No dudo que el proyecto es bueno* wrong.
- Each lesson calls the other's form an error. Nine bank rows use the subjunctive. Both forms are fine: the indicative says you are sure, and the subjunctive grants a point for the sake of argument.

**H7. *Quisiera* is drilled but never taught.** g:softening. LB2-053. It is the central Spanish softener, it appears in 106 of the 120 rows targeting this node, and it is a past subjunctive with no trigger, which undermines everything the learner has been told. It also matters for the *-ra*/*-se* claim (LB2-079).

**H8. *sino también* before a finite verb, in rows targeting the structure.** LB2-044, 045, 046. *¿No solo estudias español, sino también trabajas en español?* needs *sino que también*. g:pero-sino promised *sino que* "comes later". It does, in p:no-es-que-sino-que, but not for this frame.

**H9. Sequence error in a target row.** u44-0044. LB2-070. *Aunque llegue tarde, Rosa siempre guardaba una mesa*. Present subjunctive under a past habitual, no subject, and the English says "someone arrived". Fix: *Aunque alguien llegara tarde...*

**H10. Chunks that never reach the learner.** LB2-104 to 106, plus the pattern pair LB2-108 and 109. See section 2. Fix the code, the content, or both. The content fix is mechanical.

### Medium

**M1. Mixed conditionals, one direction only.** x:si-past-present-unreal pitfalls[0] marks *Si tuviera plata, habría viajado* wrong because "both halves need the same time frame". A lasting condition with a past result is standard: *Si fuera más paciente, no habría dicho eso*. LB2-035, 036, 037.

**M2. Conditional of rumour collides with the conditional of conjecture.** g:conditional-rumour. LB2-038. At u29 *Tendría veinte años* meant "he was probably twenty". Now *La policía tendría pruebas* means "reportedly has". The script never mentions the clash. p:aproximar-cifras then breaks the rule: *Habría unas cien personas* = "There were reportedly", when the course's own rule says the simple conditional is for now or later (LB2-040, 041).

**M3. g:relatives-formal gives the wrong reason for *el cual*.** LB2-054 to 059.
- The hook says "*que* alone sounds too chatty for print". False: *Rosa, que abrió el café* is standard in any newspaper.
- The rule says "With no commas, plain *que* picks out which one". False after prepositions: *la razón por la cual*, and the course's own *el hombre con quien hablé*.
- The examples (*La puerta, la cual es muy vieja*) show the use that sounds most stilted. The real job of *el cual* (after heavy prepositions and quantifiers, *dos de las cuales*) is unexplained, though the bank drills it well.
- ch155 knows all this and makes it a joke, *¡Lo cual, parce!*. The chapter understands register better than the lesson does.

**M4. Clefts omit the commonest form.** g:cleft-focus. LB2-060. No *Fue Vale la que...* and no preposition repeat (*Fue con Vale con quien hablé*). Both are in the bank, unexplained. English speakers will write *Fue con Vale que hablé*.

**M5. Register ladder treats *usted* as the polite thing and commands as rude.** g:register-ladder. LB2-049 to 052. "A command becomes a *podría* question as soon as you say *usted*", yet the same unit teaches *Llámeme lo antes posible*. The pitfall *Pásame la sal, por favor, señor* blames the command, but the fault is *tú* with *señor*. *Páseme la sal, por favor* is polite.

**M6. Other false absolutes.**
- x:mientras: "In the past it is always an ordinary verb" (bank u50-1602: *mientras hubiera dudas*). LB2-034.
- g:que-wishes-commands: "To the person in front of you, nothing changes" (bank: *¡Que bajes ya!*, *Que te vaya muy bien*). LB2-071.
- g:impersonal-register: "stays singular, whatever follows" (*se venden casas*). LB2-073.
- g:se-form-recognition: "exactly the same meaning and uses" (polite *quisiera* cannot be *quisiese*). LB2-079.
- p:me-parecio-mal-que: marks *Me parece mal que te fueras ayer* wrong. It is correct. LB2-029, 030.
- x:tras-al-inf: marks *Al firmar, se fue* wrong, against its own rule. LB2-081.
- p:no-tener-ni-idea-de: "usually -ra", while its own bank row u45-0790 uses *vivía*. LB2-031, 032.

**M7. *Aunque* that concedes a known fact.** LB2-067 to 069. *Aunque sea mi hermano, está equivocado* = "Even if he's my brother". He is. The English should be "He may be my brother, but". The lesson does not cover this use.

**M8. English omissions.** Chunks whose English drops a sentence of the Spanish, against the exact-translation rule: LB2-105, 110, 111, 112. Also g:future-perfect "They will probably arrive soon" for *Llegarán pronto* (LB2-042), and g:spain-pasts "I didn't eat anything today" for *Hoy no he comido nada* (LB2-078).

**M9. Recognition lessons.**
- g:vosotros-recognition says *-éis* "sounds like *eyes*". It sounds like *ace* (LB2-075).
- "Look for the ending *-áis*, *-éis* or *-ís*" misses *hablasteis*, *hablabais*, and *vuestro* is never taught (LB2-076).
- Six Your Turn items make the learner type *vosotros* forms, against your decision and the script's own text (LB2-077). g:spain-pasts does the same.

**M10. One tense, nine names.** See section 2. "Wish form" is also a bad name: nobody is wishing in *aunque llueva* or *lo que sea*. The learner cannot connect these as one thing, which works against the model the course is trying to build. No single claim, because it needs an owner decision (section 6).

**M11. Smaller items.** *¿Será que...?* wrongly tied to *usted* (LB2-049). Adjectival gerund never warned against, *el hombre llevando un sombrero* (LB2-063). *El libro se trata de* never warned against (LB2-065). *Adjunto* mislabelled as a verb (LB2-064).

### Low

Claims LB2-009, 026, 033, 039, 043, 048, 050, 059, 061, 066, 072, 074, 080, 082 to 091, 097 to 103, 113. These cover *primavera* and *otoño* in a city with no seasons, capital *Don* mid-sentence, *circulación* for traffic, and similar polish.

### Verdict per grammar script

| Script | Verdict | Note |
|---|---|---|
| g:register-ladder | Fix | Ladder is a strong model. Several whys are false |
| g:softening | Fix | Accurate, but *quisiera* is missing |
| g:pluperfect-subj | **Sound** | "Swap *había* for *hubiera*" is a reusable model |
| g:conditional-perfect | **Sound** | |
| g:si-past-unreal | Minor | Core excellent, and *hubiera* in both halves handled well |
| g:subj-concessive | Fix | False morphology line. Conceded-fact use missing |
| g:subj-conditions | **Rewrite** | |
| g:argument-markers | Fix | *sino que*, *actualmente* |
| g:future-perfect | Minor | Good model (*ha* to *habrá*) |
| g:conditional-rumour | Fix | Good core. Clash with conjecture missing |
| g:impersonal-register | Minor | |
| g:reported-speech-full | **Rewrite** the opening | Bank and chapters are good. ch145 is a model of reported speech |
| g:reporting-verbs-mood | **Sound** | News or action is a good model. Never shows *insistir en que* + indicative, and "opposite ending" is a poor label |
| g:subj-perception-negated | **Rewrite** | |
| g:cleft-focus | Fix | |
| g:topic-fronting | Minor | English glosses are excellent |
| g:lo-que-intensity | **Sound** | Among the best in the band |
| g:relatives-formal | **Rewrite** | |
| g:participle-gerund-clauses | Fix | Title promises *una vez terminado*, which never appears |
| g:infinitive-perfect | **Sound** | |
| g:formal-letter-grammar | **Sound** | Very Colombian. See section 7 on *adjunto* |
| g:verbs-prepositions | Minor | |
| g:subj-free-relatives | Minor | "Whoever it may be" is a good model |
| g:subj-future-in-past | Minor | Good model, one pitfall |
| g:que-wishes-commands | Fix | Title promises wishes, no example is one |
| g:vosotros-recognition | Fix | |
| g:spain-pasts | Minor | *esta noche* note is a fine catch |
| g:se-form-recognition | Minor | |

## 4. What the application does well and must be preserved

- **The Spanish of the bank.** 14,063 rows, and scans for mood after connectors, *ojalá*, *si* + conditional, plural *haber*, restrictive *quien* and tense after past triggers found almost nothing. Do not regenerate it. Fix rows one by one.
- **The chapters.** ch125, 135, 145, 155 and 165 are natural, funny and genuinely Colombian: *¿Sí lo huele?*, *halar*, *de último*, *me nombra*, *pides sin pedir*. ch145 teaches reported speech better than the script does. Keep the method of using a chapter to show a form.
- **Colombian decisions.** *Me permito*, *quedo atento*, *hoja de vida*, *dizque*, *genio*, *delicioso* as adverb, *bajarle a*, *déjame te ayudo*. All accurate.
- **Models that work:** the *había* to *hubiera* swap, news versus action for *decir que*, the *lo... que* frame, the "already over?" test.
- **Pitfalls that catch real English transfer:** *Si habría sabido*, *Depende en ti*, *Consiste de*, *Yo vi que... habría firmado*. The format is right. It only fails when the "wrong" form is correct.
- **Clean rules:** no dashes in B2, *hubiera* accepted in both halves of a conditional, *-se* treated as recognition.

## 5. Missing capabilities

1. A place for grammatical variation. A pitfall is binary, and the checker is exact. Spanish mood is often a choice with meaning. There is no way to say "both are right, and here is the difference", or to reward the second form on a card.
2. A check that drilled structures are taught. The gate checks tags, not whether a structure used in targeted rows is explained anywhere. *Quisiera*, *a no ser que* and *por si* all pass through.
3. A consolidated *se* lesson for B2. The uses are scattered across A2 to B1. Impersonal *se* with personal *a* (*Se invitó a todos*) is in no script rule. A search over a short list of likely verbs found one bank row, so that count is a floor. *Uno* as the way round *se* with reflexive verbs (*Uno se levanta temprano*) is in no rule.
4. A label-safe text pipeline. See `stripLabel`.

## 6. Recommended improvements

1. **Rewrite four scripts** with the replacement text in the claims: g:subj-perception-negated, g:subj-conditions (with *por si*), g:reported-speech-full (opening and person shift), g:relatives-formal. Cost: small. Value: highest in the band.
2. **Add a real *por si* node** with a contrast against *en caso de que* and about 30 new bank rows. Strongest design: a new `x:` drill, because English speakers need the "would you do it anyway?" test practised, not just stated.
3. **Add *quisiera* to the graph as a node**, with a short lesson placed before u40, where it first appears in the bank, or at the latest in g:softening.
4. **Fix the pitfall class, not just the instances.** Rule for scripts: a pitfall's "wrong" sentence must be wrong in every context, or it must carry its context in brackets. Add a gate warning for pitfalls in which `wrong` differs from `right` by verb mood alone, and require a human or second-model review of those. There are 58 mood pitfalls in the B2 patterns alone.
5. **Add `alsoCorrect` to Your Turn.** Where two forms are right, accept both and show a one-line note on the difference. A stronger version than widening `accept`, because it teaches the distinction at the moment the learner produces it.
6. **Pick one name for the subjunctive and use it everywhere.** "Subjunctive" is standard and you already want standard tense names in look-up. A reasonable path: at A2 call it the subjunctive and explain it once as "the form for what you are not asserting as fact". That description covers *aunque llueva*, *no dudo que sea*, *lo que sea* and *no vi que estuviera*, and "wish" does not. This is an owner decision, and it touches every band.
7. **Fix `stripLabel`** so it needs a known label or a short, verbless one, and add a test. Meanwhile apply the content fixes.

## 7. Uncertainties and limitations

**Authority.** rae.es refused automated access (403), including the DPD. Everything attributed to the DPD or NGLE comes from search summaries, UDEP's Castellano Actual, or my own knowledge, and each claim says which. A verifier with the books should check.

**Claims that rest mainly on my judgement.**
- H1: I am confident from linguistic knowledge and the app's own evidence, but I could not find a citable passage, and some learner sites give the flat rule. Check NGLE ch. 25, Bosque and Demonte ch. 49, and CORPES for *no vi que estabas*.
- M1: *si* + imperfect subjunctive + conditional perfect. UDEP advice lists only canonical schemas, while teaching material accepts the mix. I am confident it is standard, for example *Si no fuera por ti, me habría muerto*.
- LB2-049: *¿Será que me puedes...?* with *tú*. Colombian usage, not verified with a native. The bank has no example either way.
- LB2-098: *circulación* as Peninsular-leaning.

**Things I expected to flag and did not.** Listed so nobody re-flags them.
- ***Adjunto le envío* is not an error.** I recalled the DPD condemning invariable *adjunto*. Checking showed the opposite: the DPD records it as an adverbial use common in administrative writing, especially at the start of a sentence. Only the script's label "verb form" is wrong (LB2-064).
- ***Habrá ya llegado*** marked wrong in g:future-perfect. Sources conflict on interpolation between *haber* and the participle, the app never uses it, and it is a reasonable B2 simplification. Withdrawn.
- ***¿Será que me pueda ayudar?*** marked wrong in g:softening. The subjunctive is attested regionally, I believe, but I could not confirm it for Colombia. No claim.
- ***Si hubiera sabido, venía antes*** marked wrong. Colloquial and acceptable, but an imperfect in the result half is a fair thing not to teach at B2. No claim.
- **Condicional de rumor as a Gallicism.** I recalled style-guide objections. The search found only advice not to overuse it, and the RAE glossary lists it neutrally. LB2-039 rests on register consistency only.
- ***Re bueno*.** p:turning-it-up already covers the spelling correctly.

**Not inspected.** 153 of 184 B2 pattern scripts in full, 45 of 50 B2 chapters, 13,359 bank rows other than by regex, scenes, writing tasks, and the English of bank rows beyond the sample. Of the two target sets I listed, I read 60 of 120 (perception) and 70 of 124 (conditions). My regexes catch forms I thought to look for, so "found almost nothing" is good evidence, not proof. Lessons in other bands were read only where a B2 claim touched them. I changed no code or content, so tests and the gate were not run.

**Decisions that limit this band.** No listening means the sound error in LB2-075 matters more, since a written hint is all the learner gets. Not a request to reverse the decision.

## 8. Suggested implementation priorities

**1. Mechanical, today (high confidence, no design needed).** LB2-001, 003, 042, 044, 045, 070, 075, 078, 097, 101 to 103, and 104 to 113, plus the `stripLabel` fix.

**2. After verification, this week: remove the false accusations.** LB2-011, 012, 019, 021, 024, 028, 029, 032, 035, 037, 081, and the accept and why changes in 013, 014, 020, 025. Learners are being marked wrong for correct Spanish today, so this is the most urgent class after the plain errors.

**3. Rewrite the four scripts.** LB2-004 to 008 and 010, 023, 027, 054 to 058. Then add the *por si* node and move the bank rows (LB2-082 to 096).

**4. Fill the teaching gaps.** *Quisiera* (053), clefts (060), *sino que* (046), conceded *aunque* (067), conditional clash (038), *vosotros* (076, 077), then the rest of the medium claims.

**5. Structural.** The pitfall rule and gate warning, `alsoCorrect` on Your Turn, a check for drilled but untaught structures, and the owner decision on naming the subjunctive.

## Sources consulted

Web sources, reached through search. rae.es itself returned 403 on direct fetch.
- [DPD: adjunto](https://www.rae.es/dpd/adjunto)
- [Castellano Actual, UDEP: Uso de adjunto](https://www.udep.edu.pe/castellanoactual/uso-de-adjunto/)
- [Castellano Actual, UDEP: Duda resuelta, adjunto](https://www.udep.edu.pe/castellanoactual/duda-resuelta-5/)
- [DPD: sino](https://www.rae.es/dpd/sino)
- [FundéuRAE on no solo... sino también](https://www.diariolibre.com/actualidad/internacional/fundeurae-no-solo-sino-tambien-no-no-solo-pero-tambien-AN29066503)
- [DPD: tratar](https://www.rae.es/dpd/tratar)
- [Yepes, Spanish Grammar Manual: If Clauses](https://human.libretexts.org/Bookshelves/Languages/Spanish/Book%3A_Spanish_Grammar_Manual_(Yepes)/15/61_If_Clauses)
- [elon.io on por si and en caso de que](https://elon.io/learn-hardcore-spanish-(latin-america)/lexicon/532147/imprimo-las-diapositivas-por-si-el-proyector-falla.)
- [Castellano Actual, UDEP: Pretérito imperfecto de subjuntivo, citing NGLE 24.2c](https://www.udep.edu.pe/castellanoactual/duda-resuelta-preterito-imperfecto-de-subjuntivo/)
- [RAE, Glosario de términos gramaticales: condicional](https://www.rae.es/gtg/condicional)
- [Español urgente on the condicional de rumor](https://www.elcaribe.com.do/opiniones/espanol-urgente/condicional-de-rumor-habria-sido-detenido-podria-haber-fallecido/)
- [Teaching material on oraciones condicionales](https://www.todoele.net/sites/default/files/2025-11/Paula-Si-Antes-Las%20oraciones%20condicionales.pdf)
- [Estilo indirecto handout, moodle2.units.it](https://moodle2.units.it/pluginfile.php/559915/mod_resource/content/1/C4%20Estilo%20Indirecto.doc)
- [RAE, El buen uso del español: el infinitivo](https://www.rae.es/buen-uso-espa%C3%B1ol/el-infinitivo)
- [123teachme on no dudo que](https://www.123teachme.com/learn_spanish/node/11283)
- [Tomisimo forum on no dudo de que](https://forums.tomisimo.org/showthread.php?p=137944)

Print references cited from memory, not consulted during the audit: RAE and ASALE, *Nueva gramática de la lengua española* (2009); Bosque and Demonte, *Gramática descriptiva de la lengua española* (1999); Butt and Benjamin, *A New Reference Grammar of Modern Spanish*.
