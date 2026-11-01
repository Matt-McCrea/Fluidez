# Linguistics audit, band B1 (units 28 to 41)

Claims file: `docs/swarm-audit/claims/L-B1.jsonl`, 118 claims, prefix LB1. Every quote in it was checked by script, verbatim, against the file it cites.

## Verdict

The Spanish in B1 is good. Its rules are too sure of themselves.

Across the 42 grammar scripts I found no ungrammatical Spanish presented as correct model language. The bank's mood use is clean: pattern checks on all 16,843 B1 rows found no mood violations, and the story chapters I read sound like real Colombians.

The damage comes from three other places:

1. **Rules stated as absolutes that are false.** The 42 scripts contain 78 uses of always, never or only in rules, small print and feedback. About a dozen are false, and several are contradicted by the course's own bank, sometimes in the same unit. About 12 of the 158 pitfalls strike through correct Spanish. Your Turn checks only against listed answers and close variants, so a learner who types the correct alternative is told they are wrong, and the hint then sends them looking for an error that isn't there.
2. **No shared concept for the subjunctive, and a label that misdescribes it.** The same form has at least nine names inside B1. "Wish form" fails on most trigger families. The right idea (asserting versus not asserting) is already in the scripts, but scattered and never named as the single idea.
3. **Errors that cluster where generation met a hard concept or a dialect question.** Three of the 13 anaphora sentences in the lesson on *este* and *aquel* are reversed. *Igual* for maybe is taught as Bogotá speech, but the RAE marks it as colloquial Spain. Several false friends are trained with no warning.

## 1. What was investigated

Read in full, from source JSON rather than only from the evidence pack (the pack's long lines truncate in my reader):
- All 42 B1 grammar scripts: hook, examples, rule, small print, all 374 Read and Pick items, all 308 Your Turn items with their accept lists and why lines, all 158 pitfalls.
- The rules and pitfalls of 10 related contrast scripts and 2 pattern scripts, plus the rules of seven earlier scripts (the A2 subjunctive introductions, g:por-para-1, g:reported-past-basic), to judge what B1 inherits.
- 31 sampled pattern scripts (every 5th of 152).
- All 702 rows of the bank sample (every 24th of 16,843).
- All 357 top-up rows in B1, the rows with the highest risk.
- 6 of 42 B1 chapters.

Measured by script over all 72,693 bank rows and all 916 scripts: mood labels, senses of "plain verb", about 25 grammar patterns, anaphora, register tags, personal *a*, construction coverage per node.

Seen as a learner: `render.ts 32 9`, nine real session days at unit 32. Fifteen disputed answers were run through the real `scriptCard` check to see what a learner gets back.

Live check of the highest-stakes claims against RAE material and published work, after drafting. This changed my findings: see section 7.

## 2. Evidence from the actual application

### 2.1 One form, many names

Across the 224 B1 scripts (grammar, contrast, pattern), counting learner-visible text and excluding small print:

| Learner sees | Scripts |
|---|---|
| wish form | 32 |
| plain verb, plain form | 23 |
| *ra* form | 10 |
| normal verb | 8 |
| ordinary ending, ordinary verb | 7 |
| changed ending, form, verb | 6 |
| subjunctive | 4 |
| other vowel, vowel switch | 4 |
| "asking" form or ending | 3 |
| request ending, request verb | 3 |
| opposite ending | 2 |
| new verb form, new ending | 2 |
| wish ending | 2 |
| *-e* style verb, second set | 1 each |

What a learner meets, in course order:

| When | Script | The form is called |
|---|---|---|
| u21 d1 | g:subj-wanting | new shape, opposite vowel, new ending |
| u21 d3 onward | g:subj-irregulars | wish form |
| u28 to u30 | subj-opinion-negated, value, doubt, emotion | wish form |
| u32 d1 | g:subj-influence | "a new verb form", "asking" form, changed ending |
| u32 d4 | g:subj-cuando-future | other vowel |
| u32 d7 | g:subj-purpose-full | wish form |
| u33 d1 | g:subj-relative | wish ending |
| u34 d7 | g:subj-perfect | subjunctive helper |
| u37 d4 | g:reported-requests | "opposite" ending, request ending, new ending |

In the rendered u32 sessions, one unit shows *the changed ending*, *the changed form*, *the changed verb*, *the other vowel*, and from the generated drill cards *after "cuando", the subjunctive is for what hasn't happened yet*. So the engine says subjunctive while the scripts avoid it. By u32 the learner has used this form for eleven units, and the script still says "a new verb form".

### 2.2 "Plain verb" means two opposite things

At u28 d1 small print: "The plain form is the indicative." At u28 d4 rule: "skip *que* and use the plain verb: *Es normal tener miedo.*" There it means the infinitive. It flips again at u29 (*No dudo que tienes*: indicative), u30 (*está*: indicative), u32 d7 (*para encontrar*: infinitive), u38 d4 (*por llegar*: infinitive), u38 d7 (*a pesar de que llueve*: indicative).

### 2.3 What the mood checks found

Zero violations on all 16,843 B1 rows for: *a lo mejor* + subjunctive, *no creo que* + indicative, *creo que* + subjunctive, *ojalá* + indicative, *para que*, *sin que* or *antes de que* + indicative, value frames + indicative, *si* + present subjunctive, *cuando* + future, *dudo que* + indicative, irregular participles and preterites, voseo, vosotros, dashes. Two *como si* hits are lookalikes, and the five *si* + conditional hits are lookalikes or valid indirect questions. Personal *a* with the subjunctive is mostly right. This is a real strength.

### 2.4 Correct answers are rejected, with misleading hints

Your Turn runs `checkExact` against the answer and accept list, then `matchTranslation` for close variants (`src/ui/session/cards.ts`, `scriptCard`). I ran these through that real code. All of them fail:

| Learner types | Where | Hint the learner gets | Actually |
|---|---|---|---|
| *No dudo que tengas razón.* | g:subj-doubt yourTurn[2] | Check the verb ending: when does it happen? | correct, and the only form the bank uses |
| *Vale quiere volverse famosa.* | g:verbs-of-change yourTurn[4] | "volver" isn't the word here, check the meaning. | correct, and in the node title |
| *Llámame antes que salgas.* | g:subj-purpose-full yourTurn[2] | A small word is missing. | correct per DPD |
| *Mientras más temprano llegues, mejor.* | g:comparatives-advanced yourTurn[4] | Check the verb ending: when does it happen? | the better answer, for that very reason |
| *A pesar de estar cansado, Tomás trabaja.* | g:concession-despite yourTurn[4] | A small word is missing. | correct |
| *Creo que no es justo.* | g:subj-opinion-negated yourTurn[2] | Right words, different order: check where each one goes. | correct, x:creo-no-creo says both are normal |
| *Te recomiendo dormir más.* | g:subj-influence yourTurn[4] | A small word is missing. | correct |

The hint is the worse half. A learner with a right answer is sent to hunt for a fault that doesn't exist, which teaches distrust of their own correct instinct.

### 2.5 The bank contradicts the rules

| Rule says | Bank says |
|---|---|
| "No dudo que tengas razón" is wrong (u29) | All 9 *no dudo que* rows in the bank, all at u44, are subjunctive. None is indicative |
| A rate is "always *por*" (u35) | 45 rows with *al día*, *a la semana*, against 10 with *por* |
| "Never add *pero*" next to *aun así* (u38) | 9 rows of *pero aun así*, all in u38 and u39 |
| *A pesar de* + verb needs *que* (u38) | u39-0002 *A pesar de estar cansada* |
| *Cada* keeps the noun singular, "always" (u33) | u33-0705 *Cada dos horas*, same unit |
| *Spanish does not say the last one* (u39) | u39-0724 *esta última es más barata*, same unit |
| *No hay que* = no need, not mustn't (u35) | 12 rows at u56 translated "we mustn't" |
| Never the would form after *si* (u40) | u38-0416 *Me pregunto si Rosa estaría contenta* |
| *Ponerse*: "it hits you, then passes" (u30) | u30-0550 *Mi tío se puso muy gordo*, tagged to the same node |
| Spanish "always keeps *que*" after advice verbs (u32) | u21-0749 *Te aconsejo hablar con un abogado* |

### 2.6 Verdict on each of the 42 scripts

Accuracy: A sound, B sound with a fault to fix, C contains a false rule. Model: R reusable idea, P partial, L list or rule only. Natural Spanish and translations were good throughout unless noted. Terminology faults are listed in 2.1 and 2.2 and not repeated here.

| Unit | Script | Acc. | Model | Main note |
|---|---|---|---|---|
| u28 d1 | subj-opinion-negated | A | R | "On the table" is right, then undercut by "the *no* is the trigger" |
| u28 d4 | subj-value | A | P | "Judging, not reporting"; plain verb collision |
| u28 d7 | lo-adjective | B | R | "Always" masculine fails at u47 |
| u29 d1 | subj-doubt | C | R | Marks *No dudo que tengas* wrong; denied facts untaught |
| u29 d4 | quizas-a-lo-mejor | B | R | Lean to claim versus not is good; "classic mistake" too strong for LatAm; postverbal *quizás* unmentioned |
| u29 d7 | conditional-past-guess | A | R | Strong: one step back from the future of guessing |
| u30 d1 | subj-emotion | B | P | "Even when the event is real" with no reason; *siento que* promised, absent |
| u30 d4 | verbs-of-change | B | L | Rule of thumb fails on *se puso gordo*; *volverse famoso* rejected |
| u30 d7 | se-meaning-change | B | P | "Place no longer matters" is false; *quedar* missing |
| u31 d1 | pluperfect | B | R | Good; one wrong diagnosis in a pitfall |
| u31 d4 | narrative-pasts | A | R | Best in the band |
| u31 d7 | reported-backshift | C | R | "Dijo que vendrá" marked wrong; conflicts with u25 |
| u32 d1 | subj-influence | C | L | "A new verb form"; "always keeps *que*" is false |
| u32 d4 | subj-cuando-future | B | R | Good test; frame list incomplete |
| u32 d7 | subj-purpose-full | C | L | *Antes que* marked wrong; reason given for the mood is wrong |
| u33 d1 | subj-relative | B | R | Best mood model; pitfalls contradict Read and Pick |
| u33 d4 | relatives-prepositions | B | P | Bare *que* claim false; wording of "in front of" is wrong |
| u33 d7 | cada-cualquier | B | L | *Cada dos horas* contradicts it; *cada* versus *todos* not distinguished |
| u34 d1 | se-accidental | A | R | Excellent |
| u34 d4 | possessive-dative | A | R | Good, with a memorable reason against *mi dedo* |
| u34 d7 | subj-perfect | A | P | Sound; small print wrongly regional |
| u35 d1 | por-para-2 | C | L | "Always *por*" is false; drops the A2 arrow |
| u35 d4 | impersonal-obligation | B | L | *No hay que* too clean; valid reading offered as a wrong option |
| u35 d7 | deber-modal | B | P | English comparison false; *tener que* not ranked against *deber* |
| u36 d1 | passive-se | A | R | One valid sentence struck through |
| u36 d4 | comparatives-advanced | B | L | Half the title untaught; no practice; mood slip |
| u36 d7 | consequence-connectors | A | L | Sound; a list by nature |
| u37 d1 | questions-prepositions | A | R | Clean and generative |
| u37 d4 | reported-requests | B | P | Subjunctive defined by one use; several labels |
| u37 d7 | indirect-questions | A | L | Sound and useful |
| u38 d1 | passive-ser | A | P | Honest about register |
| u38 d4 | causal-advanced | B | L | Rule and pitfall disagree on English |
| u38 d7 | concession-despite | C | P | Two false absolutes, one against its own prompt |
| u39 d1 | infinitive-subject | A | R | Clean |
| u39 d4 | discourse-structure | A | L | Fine; a list by nature |
| u39 d7 | referring-back | C | P | False claim on *este último*; 8 of 33 bank rows flawed |
| u40 d1 | imperfect-subj | A | R | Recipe from *ellos* preterite is excellent |
| u40 d4 | si-hypothetical | B | R | "Never would after *si*" overreaches |
| u40 d7 | como-si | B | R | Same overreach |
| u41 d1 | subj-past-triggers | A | P | Sound; hook translation adds words |
| u41 d4 | ojala-past | B | P | Repeats u40 d1, presents *ojalá* as new |
| u41 d7 | reported-commands-past | A | R | Fair; *Me dijo que la llame* unmentioned |

Tally: 17 A, 18 B, 7 C. Model: 19 reusable, 12 partial, 11 list. Reliance on untaught grammar was not a real problem in this band: the prerequisites hold, apart from the frames in P5.

## 3. Specific problems

Severity follows the brief. IDs refer to the claims file.

### 3.1 The mood system

**P1. "Wish form" does not survive contact with most of the system. High. LB1-025.**

Locus: 32 B1 scripts. Quote: *No creo que tengas razón* "declines to put the claim on the table. Spanish marks that by switching the verb to the wish form."

| Family | Example | Is anything wished? |
|---|---|---|
| Wanting, hoping | *Quiero que vengas* | Yes |
| Influence | *Te recomiendo que hables* | More or less |
| Purpose | *para que lo veas* | More or less |
| Emotion | *Me molesta que grite* | No. The event is real and unwelcome |
| Fear | *Me da miedo que venga* | The opposite |
| Judgement | *Es una pena que cierren* | The opposite |
| Negated opinion | *No creo que venga* | No |
| Doubt, possibility | *Dudo que cambie*, *Es posible que llueva* | No |
| Time | *Cuando llegues* | No |
| Relative, negated | *No conozco a nadie que sepa* | No |
| Concession (u44) | *Aunque llueva* | No |

Consequence: a name is a retrieval cue. A learner who reasons "am I wishing this?" picks the indicative after doubt, fear, shame and dislike, which is exactly the classic English speaker error. The scripts then have to say "even when the event is real", which tells the learner the label failed. g:subj-relative stretches it into "real or only wished for", which fails on *nadie*. The time script silently abandons it for "the other vowel".

Fix: one name and one concept, section 6.1.

**P2. Each trigger is taught as its own rule. High for the system, no single claim.**

The opening script says "the *no* in front of *creo* is the trigger", which is a word-spotting rule, right after giving the better idea. g:subj-doubt says "spot the doubt word and switch". g:subj-purpose-full gives a wrong cause: "The second action belongs to someone else, so its verb takes the wish form" (LB1-036). A change of subject explains *que* versus infinitive, not the mood: *Llamo porque vienes* changes subject and stays indicative.

The right model exists in pieces: "puts a claim on the table" (g:subj-opinion-negated), "you assert with the indicative and decline to assert with the subjunctive" (x:creo-no-creo small print), "you're reacting to the fact, not reporting it" (g:subj-emotion-intro), "the fact is just reported, the judgement is a reaction" (x:fact-value). A learner would need to assemble this alone. It is also not cross-referenced by g:subj-influence, g:subj-relative or g:subj-cuando-future.

**P3. g:subj-doubt teaches a correct form as a mistake. High, confidence 0.85. LB1-001 to 004.**

Quote: pitfall, *No dudo que tengas razón.* struck through; "*No dudo que* means you are sure, so there is nothing to step back from: the plain verb stays."

Textbooks commonly teach the indicative here, so it is a fair default. But the subjunctive is real usage, it follows from the course's own model (granting versus asserting), and the course uses it at u44, including *No dudo que sea legal, pero me parece injusto*. All 9 *no dudo que* rows in the bank are subjunctive, so the form marked wrong at u29 is the only one the course ever drills, and the "right" form appears only on the script's own cards. Fix: plain verb as the default, both accepted.

**P4. *Siento que* never gets its meaning switch. High. LB1-042, 043.**

g:subj-emotion's title and node promise *siento que* (*Siento que te sientas así*), but the script never uses it, and no script in the course teaches that *Siento que estés triste* is I'm sorry, while *Siento que estás triste* is I sense you're sad. The bank uses both (u30-0037, u30-1135, u25-0392). p:sentir-lo-de strikes the indicative through as wrong, and x:siento-que-vs-siento-no-haber does the same at B2. This is the most useful mood contrast in the emotion family, and it is a free demonstration of the assertion model.

**P5. Frames drilled but never taught. Medium. LB1-044, 045.**

*No es cierto que* and *no es verdad que*: 18 rows. *Es imposible que*: 14 rows. *Después de que*: 7 B1 rows. *Tan pronto como*: 3 rows. None is named in any script. x:fact-value teaches *es verdad que* + indicative and never says denying it flips the mood, so the learner meets u29-0600 *No es cierto que el café pierda plata* unprepared. *Apenas*, the everyday Colombian "as soon as", is absent from the rule.

**P6. Labels recur as "new" long after they are known. Medium. LB1-026 to 029.**

g:subj-influence at u32: "a new verb form", endings retaught from scratch. g:reported-requests at u37 small print: "the subjunctive: the mood Spanish uses when one person wants another to do something", a definition of the whole mood from one use, when the learner has used it for doubt, emotion and time.

**P7. "Plain verb" collision. High. LB1-030 to 035, 067 to 069.** See 2.2. Following u28 d1, *skip que and use the plain verb* gives *Es normal tiene miedo*. Fix: say infinitive. The word is already used in g:subj-emotion.

### 3.2 False or overconfident rules outside the mood system

**P8. g:reported-backshift: "Dijo que vendrá" is wrong. High. LB1-007, 008.**

Quote: "When the saying is in the past, the future shifts to the would form." False as an absolute. *Dijo que vendrá mañana* is right while the event is still ahead of the speaker. The fix keeps the lesson by giving a context where it does matter: *Ayer Vale dijo que vendría, pero no vino.*

Same script: u25 says "Something already in the past stays put: *Dijo que Joaquín se fue*". u31 says *Llamé* must become *había llamado*. Neither reconciles the other, and in Colombian speech the simple past is common.

**P9. g:por-para-2: a rate is "always *por*". High. LB1-009.**

The commonest form, *tres veces al día*, is excluded, and is what the course itself taught at u03 and u09.

Larger point, no claim: this script regresses from a model to a list. g:por-para-1 gives a real idea ("Think of *para* as an arrow pointing ahead"; *por* "looks at what's along the way, or behind it"). g:por-para-2 ends "is it a rate, a means or an exchange? *por*. Is it an opinion, or a comparison with a standard? *para*." The arrow is not mentioned. See 6.2.

**P10. g:concession-despite. High and medium. LB1-011 to 013.**

"Never add *pero* next to any of them", while the same script's PERSONAL prompt says *Estoy cansado, pero aun así…*. And "keep the *que* before a verb", which forbids *a pesar de estar cansada*.

**P11. g:subj-purpose-full: *antes que* marked wrong. High, 0.93. LB1-005, 006.** The DPD treats *Llegará antes que anochezca* and *Llegará antes de que anochezca* as equivalent. The replacement pitfall uses the slip learners really make: *antes de salgas*.

**P12. g:subj-relative contradicts itself. Medium. LB1-037, 039 to 041.**

The model here is the best in the mood set ("do I know this thing exists?"). But pitfall[0] strikes through *Busco un apartamento que tiene dos cuartos* while readAndPick[2] teaches *Busco a una abogada que sabe de arriendos* as right. pitfall[3] ties mood to the article, which x:relative-ind-subj denies and *el que quiera* will contradict at u50. readAndPick[3] *Busco a una abogada que sepa* pairs specific *a* with a non-specific reading; the bank mostly drops the *a* correctly.

**P13. g:referring-back: "Spanish does not say the last one". Medium. LB1-014, 015.** *Este último* is the commonest form and is in the same unit's bank. The lesson teaches the stiffer form as the only one.

**P14. Other false absolutes, each small. LB1-010, 016, 018 to 024.** *Spanish always keeps que* after advice verbs. "After a preposition you need an article or *quien*, not a bare *que*", though *el día en que* is standard. *Cada* "always" singular, though *cada ocho horas* is what Hernando's prescription needs. *No hay que*, where readAndPick[8] offers a valid reading as the wrong answer. "Never" would after *si*, which is valid with *si* meaning whether, taught three units before. "Always" masculine after *lo*, false at u47.

**P15. g:verbs-of-change. Medium. LB1-048 to 050.** *Ponerse* "hits you, then passes" fails on *se puso muy gordo*. The title says *volverse famoso*, the rule assigns fame to *hacerse*, and the answer key rejects *volverse famosa*. Also, the hook says English uses get, go and become, and the rule says "Where English has one word".

**P16. g:se-meaning-change. Medium. LB1-046, 047.** "*irse* is leaving, and the place no longer matters" fails on *Me voy a la playa*. The title promises *quedar* and *quedarse*, and the script has only *quedarse*. The closing question cannot apply to *parecerse*. The contrast x:ir-irse has a better model.

**P17. Smaller script faults.** g:causal-advanced says "English says *for arriving*, and so does Spanish", while its pitfall says "Unlike English" (LB1-051). g:relatives-prepositions says the preposition goes "in front of the thing you're describing", which yields *con los amigos que vivo* (LB1-017). g:pluperfect blames the wrong thing in its *nunca* pitfall (LB1-024). g:deber-modal says English "uses different words for each job", when its own translations use *must* twice (LB1-052), and treats dropping *de* as fast speech when the DPD says it is widespread in cultivated usage (LB1-053). g:quizas-a-lo-mejor's hook says two take the subjunctive, its rule says either (LB1-038), and *a lo mejor tengas razón* is called a classic mistake though the DPD allows it, especially in American Spanish (LB1-070).

### 3.3 Dialect

**P18. *Igual* for maybe taught as Bogotá speech. High. LB1-061, 062, 106.**

Quote: p:de-pronto-igual hook, "Listen to people in Bogotá for an afternoon and you will hear *de pronto* and *igual* all the time... both mean *maybe*."

The DPD marks this use of *igual* as colloquial Spain. In American Spanish, sentence-initial *igual* is documented as concessive, close to *de todas maneras*, which I would expect in Bogotá too (see section 7 for the limit of that). If so, 21 bank rows mean something else in their setting: u29-0720 *Igual hace frío en la noche, lleva chaqueta* would read as "It's cold at night anyway". This is the reverse of the regional variation the brief protects: a Peninsular form credited to Colombia, against the owner's dialect decision. *De pronto* = maybe is confirmed Colombian and must stay.

**P19. False friends trained as equivalents. Medium. LB1-098 to 105, 107, 109, 110.**

- *Inseguridad*: 8 rows say "insecurity". It means street crime, lack of safety. "Insecurity is the biggest problem in the neighbourhood" misleads an English reader.
- *Compromiso*: glossed "commitment", but all 6 rows use it as "compromise". *Llegar a un compromiso* exists in formal Spanish, so this is not an error of Spanish. But the false friend is trained and the everyday Colombian sense, *Tengo un compromiso* (I have a prior engagement), is missing.
- *Paso*: glossed "crossing, passage". The generated feedback on u32-0679 *el próximo paso* tells the learner "el paso means crossing, passage". It means step.

**P20. *Profundar*. Medium, 0.72. LB1-108.** A dictionary word, so not an error, but a poor target. Its forms *profundo* and *profunda* collide with the adjective, which probably inflates its rank of 1926. Six rows drill it where Spanish says *hacer más hondo*. I first called this a non-word and was wrong: see section 7.

### 3.4 Bank errors

**P21. Reversed anaphora in the lesson on anaphora. High, 0.95. LB1-076 to 078.**

In `app/content/bank/u39-topup-referring-back.json`:

| Row | Current | Problem |
|---|---|---|
| 0003 | *Mi hermano y mi prima llegaron tarde; este trajo pan y aquella trajo jugo.* | *este* can only be the brother, who is the former. English says the latter brought bread |
| 0019 | *Simón y Vale están en la sala. Este habla y esta escucha.* | same, and two proximals in a row |
| 0029 | *Vale tiene una hermana y un hermano. Esta vive en Cali y aquel vive en Bogotá.* | *esta* is the sister, who is the former. English says the latter |

Of the 33 rows in this file, 13 use *este* or *aquel* to point back, and 3 of those are reversed. In all, 8 of the 33 are flawed: the 3 above, *Dicha noche* with no antecedent (LB1-079), *este* with one referent (LB1-080), "the latter" with nothing to be latter than (LB1-081), and *lo anterior* in chat (LB1-082, 083).

Why the gate missed it: this is a semantic error, and every token is legal. A learner who trusts these rows learns that *este* needs no agreement, or that gender outranks proximity, and the script's rule stops making sense.

**P22. Translation mismatches and small errors. Low to medium. LB1-084 to 097.** Includes u37-t-questions-prepositions-0027 (a mistranslation), a dropped *muy*, nonsense u34-t-possessive-dative-0024, Altamira as a place twice, and *guió* and *crió* against the 2010 Ortografía. Spelled accents are the only systematic orthography issue, and the story already writes *se rio*.

**P23. "Tomás tragó." Low. LB1-112.** The one unidiomatic line in the chapters sampled, twice in ch115.

### 3.5 Script promises that are not kept

**P24. g:comparatives-advanced teaches half its title, and the taught half has no practice. Medium. LB1-055, 056, 074.**

Title: "el doble, más de la mitad, cada vez más, cuanto más…". Node sentence: *Ganamos el doble que el año pasado*. The rule teaches only *cada vez* and *mientras más*. *El doble* has no B1 rows. *Mientras más* has 0 rows in u36 to u41 and 1 in the whole bank (u45-0469). Of 121 rows tagged to this node, 67 are plain *más de*, 39 are *cada vez*, and none practises "the more, the more". Then u57 teaches *cuanto más* with 206 rows. So a B1 structure is seen on script cards, disappears for 20 units, and returns as if unrelated. The tagger's match on *más de* hides this from the gate.

**P25. g:ojala-past repeats g:imperfect-subj. Medium. LB1-060.** u41 d4 opens "You need *ojalá*, the Spanish way to say I wish", after u22 and u40 d1 on the same content with the same sentences.

### 3.6 Structure of the pitfall card

**P26. Correct Spanish under a strikethrough. Medium, class-level.**

`src/ui/blocks/teach.tsx` renders every `wrong` as `<s>` under "Almost everyone slips here at first". About 12 of 158 B1 grammar pitfalls and more in patterns are correct Spanish with a different meaning or register: g:passive-se[1], g:reported-commands-past[0], g:ojala-past[2], p:entiendo-que-subj[0,1], p:te-importaria-inf[1], p:te-parece-bien-que[1]. The schema has no way to say "that means something else". So the teaching point, which is often excellent, is delivered as a falsehood.

## 4. What the application does well and must be preserved

- **Mood discipline in the bank.** Zero violations in 16,843 rows. Whatever gate does this, keep it.
- **Models that truly are reusable.**
  - g:conditional-past-guess: "take one step back" from the future of guessing. Compact and generative.
  - g:narrative-pasts: "moving the story, painting the scene, or stepping back?" The best explanation in the band.
  - g:se-accidental: "The thing is the subject, so the verb matches the thing."
  - g:subj-relative: "do I know this thing exists?"
  - g:subj-cuando-future: "What matters is not whether you know the date, only whether it has happened yet."
  - g:imperfect-subj: the *ellos* preterite recipe, which makes irregulars free.
  - g:questions-prepositions: "If the verb always comes with its own little word, that word moves to the front."
  - x:creo-no-creo: *Creo que no viene* and *No creo que venga*, "Both are normal."
  - p:entiendo-que-subj: "the verb form carries the kindness". This is the assertion model at its best.
- **The honesty about register.** g:passive-ser: "expect to read this more than to say it." g:referring-back: "In chat you can repeat the name too."
- **Colombian texture.** *Se me dañó*, *qué pena con usted*, *bravo*, *trancón*, *buena para*, *a la casa*, *¿me acercas la sal?*, *el otro mes*, the decimal comma in *1,70*, *mono* for blond, *sumercé*, *este man*. Chapters ch091 and ch099 read like people. p:me-da-pena-que handles the Colombian sense of *pena* well.
- **The translation discipline.** Bracketed tags are consistent. Checks for tag and gender mismatches found almost nothing real.
- **No technical overload.** Terms stay in small print. Keep that spirit while fixing the label.
- **The pitfalls as a format.** Short and specific, with English transfer named. Fix the 12, not the idea.

## 5. Missing capabilities

- A single statement of what the subjunctive is, reachable in look-up, that every trigger script points to.
- A pitfall type for "correct, but means something else".
- A way to mark a rule as a default, so that scripts can say "use this" without saying "always".
- A check that a script's claimed construction is actually in the rows tagged to its node. The coverage check I ran took minutes and found g:comparatives-advanced at 32%, with the other 13 nodes I tested between 82% and 100%.
- A check of absolutes against the bank. An always or never in a rule could be tested against rows, as I did by hand in 2.5.
- An accept list that grows from the course's own model answers. Where a form is taught as correct anywhere, Your Turn should not reject it.
- Hints that know when an answer may be right. Today the hint engine diagnoses a fault in any answer it can't match, so it invents one for valid alternatives (2.4). When the answer differs from the key only by mood or a grammatical alternative, a softer line such as "That may be fine, but here we want..." is safer than a confident wrong diagnosis.
- A human Colombian reading of dialect claims. The gate cannot do this, and the model that drafted *igual* could not either.

## 6. Recommended improvements

### 6.1 One idea for the subjunctive

Use one name from u21: the subjunctive. It is short, standard, and what the look-up, the drill engine and every outside resource use, which fits the owner's decision on standard names in look-up. Pair it with a plain term for the other mood: "the statement form".

Teach one test, stated once at u21 and restated briefly in each trigger script:

> Is the speaker telling you this as news? If yes, use the statement form. If no, because it's wanted, doubted, reacted to, or hasn't happened, use the subjunctive.

What that one test explains, none of which the current scripts can explain together:

| Sentence | Told as news? | Mood |
|---|---|---|
| *Creo que viene* | Yes, I'm claiming it | statement |
| *No creo que venga* | No, I'm declining to claim it | subjunctive |
| *Me alegra que estés aquí* | No, you know you're here. I'm reacting | subjunctive |
| *Cuando llegues* | No, it hasn't happened | subjunctive |
| *Busco un cuarto que tenga ventana* | No, I can't vouch for it | subjunctive |
| *Busco un cuarto que tiene ventana* | Yes, I know of one | statement |
| *Dice que vienes* / *Dice que vengas* | Yes / No, it's a request | each |
| *Siento que estás triste* / *Siento que estés triste* | Yes, I sense it / No, I'm reacting | each |
| *Entiendo que llegas* / *Entiendo que estés molesta* | Yes / No | each |
| *Tal vez tienes razón* / *Tal vez tengas razón* | I lean to claiming it / I don't | each |
| *No dudo que tienes razón* / *No dudo que tengas razón, pero...* | Claimed / granted | each |
| *Aunque llueve* / *Aunque llueva* (u44) | Yes / Not at issue | each |

It predicts the alternations, including the one g:subj-doubt forbids. That is the test of a reusable model: it generates cases the learner has not been told.

Cost: the labels are in many scripts, but it is largely mechanical. *wish form* appears in 32 B1 scripts plus A2, B2 and C1. A script-level replace covers most, and the concept line needs writing once. Do it before any other mood fix, so that replacements are not rewritten twice. The claims here avoid the label for that reason.

Rewrite the two scripts that give a wrong or mechanical reason: g:subj-opinion-negated ("the *no* is the trigger" becomes a consequence of the test) and g:subj-purpose-full (LB1-036).

### 6.2 Keep the arrow in por and para

Replace the closing list in g:por-para-2 with the A2 model, extended:

> *Para* still points ahead, at a target. *Para mí*: this opinion lands on me. *Para ser lunes*: measured against what a Monday should be.
> *Por* still looks at what's along the way. *Por teléfono*: the route the talk takes. *Tres veces por día*: spread along the day. *Lo cambié por otro*: one thing passed in place of the other.

Same uses, one idea, and it scales to B2.

### 6.3 Treat always and never as claims

Rewrite rules as defaults plus the known exception. Review the 78 absolutes against the bank. About a dozen are in this claims file.

### 6.4 Add a `means` field to pitfalls

`{"wrong": ..., "right": ..., "means": "..."}` renders without a strikethrough: "This is Spanish, but it says...". Roughly a dozen pitfalls would improve at once, and it directly teaches mood as meaning.

### 6.5 Fix the *igual* lesson

Teach *de pronto* for maybe and *igual* for anyway, after a Colombian speaker confirms the second, and mention the Spanish sense in one line. Retranslate or rewrite the 21 rows.

### 6.6 Teach the missing frames

Add to existing scripts: *no es cierto que*, *es imposible que* (g:subj-doubt), *después de que*, *apenas*, *tan pronto como* (g:subj-cuando-future), *siento que* in both moods (g:subj-emotion), *el doble* (g:comparatives-advanced), *este último* (g:referring-back), present retained for still-true statements (g:reported-backshift).

Generate real practice for *mientras más* and *el doble* at u36. Use the u41 d4 slot for something new.

### 6.7 Regenerate g:referring-back's bank

Have a human or a focused review check all 33 rows. Consider whether *este* and *aquel* for the latter and the former deserve B1 production at all. They are literary, and recognition plus *este último* may be the better target.

## 7. Uncertainties and limitations

**Not inspected.** 16,843 B1 rows were pattern-scanned, but only about 1,050 were read by eye (6%), weighted to the riskiest. About 115 of 152 pattern scripts unread. 36 of 42 chapters unread. Most B1 contrast scripts unread (rules and pitfalls of 10 only). Scenes and writing tasks not inspected. The gate was not run, and no app file was changed. A self-check before finishing caught two statements of mine that were wrong: I had said Your Turn was exact-match (it also runs a variant matcher, so I retested every case through the real code, and all still fail), and a coverage figure for g:por-para-2 came from a faulty regex (it is 97%, not 52%). The defect rate in the unread pattern scripts is unknown, and the sampled ones turned up several.

**Live check, and what it changed.** After drafting I tested the riskiest claims against sources:

| Claim | Result |
|---|---|
| *Antes que* before a clause is valid | Confirmed. DPD gives both as equivalent |
| *Igual* for maybe is Peninsular | Confirmed. DPD: "lengua coloquial de España" |
| *Deber* without *de* for probability | Confirmed and stronger than I wrote. Extended in cultivated usage |
| *Profundar* is not a word | **I was wrong.** DLE has it, = *profundizar*. Downgraded to a poor-target finding, 0.72 |
| *De pronto* + subjunctive is valid | **No source found. Claim withdrawn.** The pitfall *De pronto Vale venga mañana* is not disputed in the claims file. A Colombian speaker should still check it, since *quizás* allows both moods |
| *A lo mejor* + subjunctive | **New finding.** DPD: possible, especially in American Spanish (LB1-070) |
| *Deber de* for obligation | **New finding.** DPD: occurs in cultivated usage, much less often (LB1-072) |

**How those sources were read.** rae.es returns 403 to direct fetching, so the DPD and DLE wording above comes from search result snippets of those pages, not from reading the pages. A verifier with browser access should open rae.es/dpd/igual, /mejor, /deber and /antes.

**Authorities from memory.** References to the Nueva gramática and Butt and Benjamin are from memory: I had no access to either, and chapter numbers are approximate. In particular, I could not confirm the NGLE position on negated *dudar* (LB1-001 to 004). That claim rests on the course's own u44 use, which is decisive for the course contradiction, plus native speaker reports and my knowledge of the literature. Textbooks do teach the indicative, so a verifier may prefer to keep it as the default, which is what the replacement does. No corpus was available, so frequency statements are judgement.

**Least sure.**
- *Igual* meaning *anyway* in Colombia specifically. The literature I found documents it for the Río de la Plata and Chile, and as "American" generally. I found nothing specific to Colombia, and one study shows modal *igual* in Mexico. The claim that the maybe sense is Peninsular is strong. The claim about what Bogotá speakers mean is inference from that literature and from my knowledge. Have a Bogotano read LB1-061, 062 and 106 before applying.
- LB1-107 (*compromiso*), where the Spanish is defensible.
- LB1-040, 065, 073, 085, 092, the lowest confidence items.
- *Fatal* for awful (17 rows, including u35-0655): I suspect it is more Spanish than Colombian, but it is used in Latin America and I did not claim it.

**Limitations of the standing decisions.** Text-only means the course cannot use the intonation that often signals *Tal vez tienes razón* versus *tengas*. This is not a recommendation to change it.

**Sources for the live check:** [DPD antes](https://www.rae.es/dpd/antes), [DPD igual](https://rae.es/dpd/igual), [DPD mejor](https://www.rae.es/dpd/mejor), [DPD deber](https://www.rae.es/dpd/deber), [DLE profundar](https://dle.rae.es/profundar), [Llopis Cardona on American *igual*](https://producciocientifica.uv.es/documentos/645a8a04a476ae3461b7ad26), [García Negroni and Marcovecchio 2013](https://repositorio.uca.edu.ar/handle/123456789/16752?locale=en), [Santiago corpus study on *igual*](https://revistasaludpublica.uchile.cl/index.php/BDF/article/view/17986), [Mexican Spanish study on *igual*](https://revistas-filologicas.unam.mx/anuario-letras/index.php/al/article/download/1657/2293/3619), [Jiménez Cubero on doubt verbs](https://repositorio.una.ac.cr/items/4ca8dd98-405c-4b55-92d1-fc4841c5df45), [Lawless Spanish on *no dudo que*](https://spanish.kwiziq.com/questions/view/no-dudo-subjunctive), [tomisimo thread on *no dudar*](https://forums.tomisimo.org/archive/index.php/t-7469.html), [tomisimo thread on *de pronto*](https://forums.tomisimo.org/archive/index.php/t-1329.html), [Inklingo on *confiar*](https://www.inklingo.app/spanish/dictionary/confiar).

## 8. Suggested implementation priorities

1. **Stop punishing correct Spanish.** Apply the accept additions and the false-pitfall fixes: LB1-001 to 013, 016, 018 to 021, 039, 050, 113 to 118. Small, safe, immediately better. One sitting.
2. **Fix the reversed sentences and clear translation faults.** LB1-076 to 090, 098 to 105, 109. Mechanical.
3. **Get a Colombian reader on the dialect set,** then rewrite p:de-pronto-igual and its 21 rows. LB1-061, 062, 106, 107, plus the withdrawn *de pronto* question and *fatal*.
4. **Make the mood decision.** One name, one test (6.1). This is the most valuable item in the report and the owner's call. Do it before further edits to mood scripts. Fix "plain verb" at the same time: LB1-030 to 035, 067 to 069.
5. **Add the missing teaching.** LB1-042 to 045 first (*siento que*, denied facts, time frames), then 6.6.
6. **Close the practice gaps.** LB1-056 and generate *mientras más*, *el doble*. Resolve g:ojala-past (LB1-060).
7. **Add the `means` pitfall field and the two gate checks** (construction coverage, absolutes against bank). This prevents recurrence. Without it, the next generation pass reintroduces these faults.
8. **Then the remaining low-severity items.** Rewrite g:por-para-2's closing (6.2) whenever that script is next touched.
