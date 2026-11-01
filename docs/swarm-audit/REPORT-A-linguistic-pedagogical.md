# Report A: Linguistic and Pedagogical Audit

## 1. The verdict in a page

The Spanish is strong, the explanations overclaim, and the architecture fails to deliver the contrasts. The order of those three matters. The language is the strongest layer of Fluidez, and the machinery around it is the weakest.

**The Spanish is strong.** Twenty-four mechanical grammar checks across all 103,451 Spanish strings found seven real errors, all one spelling rule (*y* to *e*, *o* to *u*). There were no mood violations in the 16,843 B1 bank rows, and almost no article, personal *a* or Peninsular vocabulary failures in the bands scanned. Readers of the sampled chapters called them natural, funny and Colombian. Dialect detail such as *me regala*, *qué pena con usted*, *ir a cine* and *quedo atento* is rare in any course.

**The explanations overclaim.** Rules say always, never and only where Spanish has a default or a choice. Then the bank contradicts the rule, and the bank is usually right. As the A2 specialist put it, a learner who trusts the examples does better than one who trusts the rules, which is the wrong way round. About 12 of the 158 B1 grammar pitfalls strike through correct Spanish under the heading "Almost everyone slips here at first". The checker then refuses that Spanish, sometimes with an invented reason. Put simply, the course knows more Spanish than its rules admit.

**The architecture fails to deliver the contrasts.** You have 94 written contrast lessons, about 450 KB of teaching, aimed at the exact choices English speakers get wrong. None of them reaches a session. In 591 simulated sessions, 252 teach blocks ran and none was a contrast. None of the 72,693 bank rows targets or requires a contrast node. A contrast "review" is the same single sentence again: the learner reviews `x:ser-estar-adj` by retyping *Es aburrido* and is never asked for *Está aburrido*. Drills on these topics usually test something else. On a por/para day the card asks "Which one is about us (we)?". Above A2 the output ladder collapses.

What this means for what you do next:

1. **Stop teaching false statements.** 548 claims survive with a confirmed or amended fix, and most are one sentence.
2. **Repair the contrast scripts before they go live.** Turning them on puts scripts nobody has tested in front of learners. `x:subj-present-past` states its rule backwards and must be rewritten in the same release (R5).
3. **Make contrasts run**, with the format chosen by what decides each contrast (R10, R11, R21).
4. **Fix acceptance before naming errors.** A confident diagnosis on top of a false rejection is worse than a vague hint (R13, R14).
5. **Add the teaching whose absence costs most:** the preterite of state verbs, *por si*, *quisiera*, *no sabía que* against *no creo que*, and subject after verb.

Two limits apply to everything below. No real learner has used any of this, so every minute figure is a model (R32). And the new explanations chosen here are the best-reasoned proposals available, not proven ones (R1).

**How to read the references.** `g:`, `x:`, `p:`, `c:` and `l:` are node ids, `u29-0429` is a bank row, and LA1, LA2, LB1, LB2, LC1, LC, CX, VR and LG are claim prefixes. R and O numbers are the lead's rulings and open owner decisions. All quotations come from the audited snapshot (`rebuild` at `5f916ec`, content identical to `e76f933`). While this report was being written, the working tree on `next` held 229 uncommitted changed content files, so some of what is quoted here may already be repaired there. I did not audit those edits.

## 2. What is taught well

These are not compliments. Each is something a careless fix could damage.

**The bank.** Do not regenerate it. Fix rows one at a time. The B1 mood scans found zero violations for *ojalá*, *no creo que*, *para que*, *si* plus present subjunctive and *cuando* plus future. A calque scan found almost nothing. The independent structure test also holds: 0 of 916 nodes are taught before something they require.

**Explanations worth keeping as they stand:**

| Node | The line | Why it works |
|---|---|---|
| `g:stem-boot` | change a vowel in the middle when you stress it | A real model, reinforced by the sound tips |
| `g:gustar-basic` | coffee pleases me | Carries over to *encantar*, *faltar*, *parecer* |
| `g:pret-vs-imperfect`, `x:pret-imp` | the "and then" test; *llovió toda la noche* wraps a whole night up | The right idea for aspect, if habit is caught first (section 7) |
| `g:hace-que-desde` | Spanish notices that you still live here | A true reason in one line |
| `g:subj-wanting` | It's the *usted* command | No new paradigm, one old one reused |
| `g:subj-relative` | do I know this thing exists? | The best mood model in the course |
| `g:subj-cuando-future` | not whether you know the date, only whether it has happened yet | Generates new cases |
| `g:narrative-pasts` | moving the story, painting the scene, or stepping back? | Best in the B1 band |
| `g:se-accidental` | The thing is the subject, so the verb matches the thing | Explains *se me olvidaron* |
| `x:ser-estar-place` | A party takes place | Best test in the strand |
| `x:yo-vs-a-mi-tambien` | Echo the shape, with its "Sounds right / Should be" items | The only error-recognition exercise in the app |
| `p:entiendo-que-subj` | the verb form carries the kindness | Mood as meaning, at its best |
| `g:le-doubling` pitfall | It isn't wrong grammar, but it sounds like a form | The voice most false pitfalls should move to |

**Structure.** The order of the course is good. The mood thread, entered through *usted* commands then wanting, wishes, opinion, value, doubt, adverbial, relative and past, is close to best practice. Reporting, relatives and comparison are real spirals. Contrast timing is excellent on paper: 87 of 94 land within 3 sessions of their second side.

**Production as the default.** 55 to 61% of cards are typed, and a quarter to a third are whole sentences from English. One retry with a hint is the best-supported part of the feedback design. Keep it, and improve what the hint says.

**The story.** ch145 teaches reported speech better than its script does. ch184 and ch202 carry grammar without seeming to. The vocabulary reader quotes "Prever es ver venir el bus. Prevenir es salirse de la mitad de la calle." as writing, not filler. Chapters are not to be rewritten to a prose specification (R26).

**Honest register.** `g:passive-ser` says "expect to read this more than to say it". The "Say it in *tú*" cards are the right design for recognition.

**One overruled item.** Four reports listed "portrait or snapshot" for ser and estar as something to preserve. R3 drops the image, because a snapshot is a moment and *está muerto* is not one. The refusal of permanent and temporary stays. LC-034's verified text still contains the image, so that replacement must not be pasted as it stands.

## 3. What is taught poorly

**Rules stated as laws.** In A1, "never", "always" and "only ever" occur 171 times across 136 scripts. In B1 there are 78 such uses, about a dozen false. In A2 about a dozen of some 150 are false. Each false one is a mental model that a later band must pull out.

| Rule | Node | What contradicts it | Claim |
|---|---|---|---|
| "And location is never *es*." | `p:quedar-cerca` | *La fiesta fue en casa de mi tío* (u05-0933) | LA1-015 |
| "They are only ever for people." | `g:indirect-objects` | *A la sopa le falta sal* (`p:le-falta-sal`) | LA1-009 |
| "it's always a complaint" | `p:no-es-nada-adj` | *Demasiado* as praise, widely in Latin America | LA2-018, LA2-019 |
| "Never add *pero* next to any of them." | `g:concession-despite` | That script's own prompt, *Estoy cansado, pero aun así…* | LB1-011 |
| A rate "is always *por*" | `g:por-para-2` | *tres veces al día*, about 37 rows to 10 | LB1-009 |
| "*Cada* always points at one at a time, so the noun stays singular." | `g:cada-cualquier` | *Cada dos horas* (u33-0705), same unit | LB1-018 |
| "What follows is never a new fact." | `g:reformulation` | *Es caro; o sea, no lo podemos pagar*, its own example | LC1-008 |
| *¡Qué va!* "is always a no" | `g:emphatic-structures` | *¡Qué va, me encantó!* | LC1-024 |

**Pitfalls that strike out correct Spanish.** `src/ui/blocks/teach.tsx` renders every `wrong` as struck through, and the schema has no way to say "that means something else". So a good teaching point is delivered as a falsehood. Verified cases include *Mariana dijo que va a llamar* (LA2-004), *No vi que Vale estaba enojada* (CX-004), *No dudo que tengas razón* (LB1-001), *Había un accidente* (LA2-031), *Me parece mal que te fueras ayer* (LB2-029), *Al firmar, se fue* (LB2-081), *Llámame antes que salgas* (LB1-005) and *¡Pues claro que fui!* (LC-017). Two lessons accuse each other: `g:subj-doubt` marks *No dudo que tengas razón* wrong, and `p:concede-pero` marks *No dudo que el proyecto es bueno* wrong (LB2-019). Both forms are fine, and the nine *no dudo que* rows in the bank are all subjunctive.

**One form, many names.** B1 alone uses at least nine names for the subjunctive, and "wish form" sits in 72 scripts across the course (CX-043). "Plain verb" (73 scripts) means the indicative at u28 d1 and the infinitive three days later (LB1-030), so following it gives *Es normal tiene miedo*. "Wish form" fails on most of the mood system: nobody wishes anything in *Me molesta que grite* or *Dudo que cambie* (LB1-025). R2 settles this: "subjunctive" from `u21 d1`, in the rule body and not the hook; "the ordinary form" for the indicative; "the dictionary form" for the infinitive; "the *-ra* form" stays as a nickname. "Wish form", "plain verb" and "statement form" go. The sweep is by hand, because "wish" often carries the reason. It is a revertable exception to your voice rule (O1). This overrules the A2 report, which wanted to keep "wish form", and the B1 report, which proposed "statement form".

**Models that thin out or regress.**

- `g:reflexive-routine` promises *me levanto, te duchas, se acuesta*, and no script item uses them (LA1-031).
- `g:por-para-1` gives the arrow. `g:por-para-2` drops it and ends in a list.
- `g:subj-influence` at u32 calls the subjunctive "a new verb form" after eleven units of use.
- `g:ojala-past` at u41 reintroduces *ojalá* as new (LB1-060).
- `g:relatives-formal` gives the wrong reason for *el cual*. Plain *que* is standard in print, and the real job of *el cual* is after long prepositions and numbers (LB2-054 to LB2-056).
- Median rule length falls as the grammar gets harder: 120 words at A1, 125 at A2, 111 at B1, about 100 at B2 and C1.

**Promises not kept.**

- `g:subj-conditions` teaches four connectors and drills two, while a fifth, *a no ser que*, fills 54 of its 124 rows unexplained (LB2-006).
- `g:comparatives-advanced` has the title *el doble, más de la mitad, cada vez más, cuanto más*, yet *mientras más* has one row in the whole bank (LB1-056).
- `g:mood-choice-fine` promises *como* with the subjunctive and never shows it (LC1-015).
- `g:voseo-recognition` said "Vale does it all the time", and no chapter prose or scene contains voseo (LC1-060, LC1-061).

## 4. What is missing

The linguist tested the coverage matrix's 27 gaps and sorted them: six deserve teaching time, fifteen are a line or a pattern, six are completeness. Two gaps that neither list had outrank most of them. Ranked below by harm to a learner.

**Needs teaching and practice:**

| # | Gap | Evidence | Harm | Where |
|---|---|---|---|---|
| 1 | Preterite of state verbs: *supe*, *conocí*, *estuve dos horas* | 41 *saber* and 71 *conocer* preterite rows, right in translation, explained in one line at u06 | An English speaker cannot infer it from "knew". It is one idea, not a list (R6): the preterite draws a boundary around a state | Node at u26 d3, line at u06, return in `g:narrative-pasts` |
| 2 | *Por si*, the ordinary "in case" | 0 of 916 scripts, 4 rows | English "in case" hides two ideas, and the course teaches only one (LB2-005) | u44, with *en caso de que* (R4) |
| 3 | *Quisiera* | 93 of 120 `g:softening` rows, 0 scripts explain it (LB2-053) | The central Spanish softener is a past subjunctive with no trigger, drilled unexplained | `g:softening`, or earlier |
| 4 | *No sabía que* against *no creo que* | At least 18 rows, and `g:subj-perception-negated` contradicted them (LB2-010) | Learners overuse the subjunctive just as it should start to carry meaning | Rider at u28 d1 |
| 5 | Subject after verb when the subject is the news: *Llegó un paquete* (u11-0195) | In the bank from u11. The linguist raised it to high, at B1 | The largest gap between correct and native-sounding writing at the top | B1 pattern, plus LC1-068 |
| 6 | Everyday "I'll", "would", "could" | Over 140 rows of present for I'll, no rule (LA2-024); three traps in LA2-026 | Stilted *Yo pagaré* for life; *podría* where a past *podía* is meant | Lines now, contrasts at u20 and u21 |
| 7 | Verb plus preposition as part of the word | 0 of 973 verb entries show one; 57 of 104 common pairs have nothing; *casarse con* never taught | *Me casé a Juan*, *sueño de*, *depende en*, up to C1 | Chunks at A2, a `governs` field |
| 8 | Word formation | 0 nodes on derivation | Reading stalls on every unknown *-ción* | Recognition only (R7), by stage |
| 9 | Adjective position | 0 nodes; 15 PCIC items uncited | Cannot parse *la difícil situación*, *pobre hombre* | One B2 lesson, u47 to u48 |
| 10 | *A* after *ir* and *venir*; *estar a punto de*, *acababa de* | The rule said the opposite (CX-039); 3 and 17 rows | Natural forms rejected | Line, plus `x:a-en` |

**Needs only a line in an existing lesson:** the masculine *-ma* words and *la mano*, *la foto* (LA1-004); no backshift when still true (a false-rule fix, LA2-006, LB2-023); *si* plus past indicative; *si* meaning whether (LC-014); the *we* command (one pattern, 39 A2 rows translate "Let's" with a form other than *vamos*); present main verb plus past subordinate, *me alegro de que vinieras*, inside the sequence-of-tenses mapping; *en* for in, on and at; *entre tú y yo* (LC-035); *e* and *u*; *convertirse en* (CX-035, CX-036); pro-predicate *lo*; impersonal *se* with *a*; unipersonal agreement, *los colombianos somos*; copular agreement, *lo que más me gusta son* (the matrix said 0 rows, and there are at least 3); preposition before *que* (LC-036). Apocope is one sentence, not a node. *Es de madera* is one line at u16.

**Completeness, low priority:** *sí mismo*, *consigo*; leísmo as a recognition note at B2; *tal como*, *ambos*, *no hay quien*; augmentatives as a topic (absorbed by word formation); pretérito anterior; Colombian focus *ser* and *sumercé* (recognition in the story, no lesson); *quienquiera*, *dondequiera*.

## 5. What is inaccurate or inadequately explained

The worst cases, each with the verdict's replacement text. Verified text is quoted as the verifier left it. Where it still says "wish form" or "plain verb", R2's sweep changes the term.

**`x:mas-que-mas-de-lo-que` rule (CX-001, critical).**
Says: "A person, thing or number: *más que*."
Wrong because it reverses `p:mas-de-number` at u11 and gives an English speaker, who has one "than", a rule for *Tengo más que diez libros*.
Replace with: "A person or a thing: *más que*. (Before a number it's *más de*, as in *más de cien mil pesos*.)"

**`p:para-inf-purpose` rule (CX-039).**
Says: "In Spanish that to is always *para*."
Wrong because after *ir* and *venir*, *a* is the everyday choice. It is the only teaching of the point in the course, and it teaches the opposite.
Replace with: "In Spanish that to is usually *para*. After *ir* and *venir* you can use *para* or *a*, and *a* is the everyday choice: *Fui al mercado a comprar fruta.* *Vine a hablar contigo.*"

**`g:subj-perception-negated` rule (LB2-010, with CX-004 to CX-006).**
Says: "Put *no* in front and you are no longer vouching, so the verb after *que* switches".
Wrong because mood is a choice here and the choice means something (NGLE 25.7c, via the first reviewer). *No vi que estabas ahí* says you were there and I missed you. The lesson marked that pattern wrong, and the checker fails it flat.
Replace with a rule that opens: "Put *no* in front and you now have a choice, and it says who is vouching." and ends: "English keeps one verb for both. Spanish tells you who stands behind the claim." The full text is in the verdict. Replacement pitfalls use real slips: *No veo que Vale está enojada* and *No es que no quiero, es que no puedo*.

**`g:cuando-indicative` rule (LA2-001 to LA2-003).**
Says: "A stretch of time or an old habit takes the describing past".
Wrong because length does not choose the past. This belief produces *Hernando era taxista durante cuarenta años*, and it overwrites the right idea taught at u12. 28 A2 sentences have a duration in the preterite.
Replace with: "It isn't about how long something lasted. It's about how you tell it. What sets the scene, or an old habit, takes the describing past: *Cuando era niño, vivía en Toronto.* An event that moves the story on takes the event past: *Cuando llegué a Bogotá...* Even a long stretch can be an event, if you wrap it up as one finished thing: *Hernando fue taxista cuarenta años.*"

**`g:article-uses` rule (LA2-005).**
Says: "Quick test: if English could add in general, Spanish wants the article."
Wrong because it fails on its own hook: "I don't drink coffee in general at night" passes, and the answer is *No tomo café*.
Replace with: "Quick test: are you saying what a thing is like in general, or how you feel about it? Spanish wants the article: *Me gusta el café.* Is it just some, an amount you buy, drink or have? No article: *Tomo café.*"

**`g:reported-speech-full` rule (LB2-023, with LB1-007, LA2-004, LA2-006).**
Says: "everything takes one step back… Spanish does it as faithfully as English."
Wrong because a statement that still holds keeps its tense, and a plain past often stays.
Replace with: "When you retell a conversation after the fact, most things take one step back, in time and in place, just as in English. Two things can stop that. If what was said still holds right now, the verb can stay: *Dijo que Bogotá es fría*, or *Dijo que viene mañana* if tomorrow has not come yet. And a plain past often stays as it is: *Dijo que ya habló con ellos.*"
The pitfall keeps its point by adding the closing fact: *Mariana dijo que iba a llamar, pero nunca llamó.*

**`g:subj-conditions` small print and rule (LB2-003, LB2-005).**
Says: "They always take the subjunctive." and "*en caso de que*: in case".
Wrong because *Siempre que llueve* was taught with the indicative at u17, and because a precaution is not a contingency.
Replace with: "As conditions they take the subjunctive. *Siempre que* can also mean whenever, for a habit, and then it keeps the ordinary verb, as you already know: *Siempre que llueve, vendemos más tinto.*" Then: "English *in case* hides two ideas. If you act only when the thing happens, use *en caso de que*: *En caso de que llueva, la reunión es adentro.* If you act now, just to be safe, use *por si* with the ordinary verb: *Llévate una chaqueta por si hace frío.* Test: would you do it anyway? Then it is *por si*."
Ten precaution rows move to *por si* (LB2-082 to LB2-091). Fronted *in case* cards stay (see section 12).

**`g:referring-back` bank (LB1-076 to LB1-078).**
In the lesson on *este* and *aquel*, three sentences are reversed, for example *Simón y Vale están en la sala. Este habla y esta escucha.*
Replace with: *Simón y Vale están en la sala. Esta habla y aquel escucha.* In all, 8 of the file's 33 rows are flawed, and `g:referring-back` wrongly says Spanish does not say "the last one" (LB1-014, LC-007). *Este último* is the safer form (LB1-015).

**`g:consecutive-advanced` rule (LC1-037).**
Says: "If the main sentence is in the past, the verb after *de ahí que* is the past subjunctive".
Wrong because u56-0203 has a past cause with *sea*.
Replace with: "The tense follows the result, not the first sentence. A result in the past takes the past subjunctive (*se aplazara*, *oyera*). A result that holds now takes the present subjunctive (*pueda*), even after a past cause: *la ciudad creció sin plan; de ahí que el tráfico sea una pesadilla*."

**`g:comparative-advanced-c1` rule and rows (LC1-045 to LC1-051).**
Says: "The verbs stay normal". The rule omits agreement, and six rows are wrong, such as *Cuanto menos plata hay* (u58-0119).
Replace with: "For habits and facts the verbs stay normal: *Cuanto más practico, mejor hablo.* For something still to come, the first verb takes the subjunctive: *Cuanto más practiques, mejor hablarás.* Before a noun, *cuanto* agrees with it: *cuanta más plata tengo, más gasto*."
The rows become *Cuanta menos plata hay…* and so on, but they cannot be pasted alone: `features.ts` line 1148 must first test the lemma, or the gate fails.

**Smaller, plain errors.**

| Where | Says | Replace with | Claim |
|---|---|---|---|
| `g:subj-concessive` | "*-ar* verbs take *-e*: *llueva*, *pague*, *insista*." | "*-ar* verbs take *-e*: *pague*, *firme*, *cierre*. *-er* and *-ir* verbs take *-a*: *llueva*, *insista*, *tenga*, *haga*, *ofrezca*." | LB2-001 |
| `g:subj-doubt` | "*No dudo que* means you are sure, so the plain verb comes back" | "…the plain verb is the natural choice… You will also meet the wish form here, when someone grants a point before a *pero*… Both are correct." | LB1-002 |
| `g:concessive-advanced` | "*Por mucho que* and *por muy… que* take the subjunctive" | "…usually take the subjunctive… For a real past event the plain verb is normal too: *Por mucho que insistí, no me hizo caso.*" 0 of 23 rows show this | LC-011 |
| `g:sounds-letters` pitfall, day 3 | "a Spanish reader says BO-go-ta" | "says bo-GO-ta, stress on the second-to-last syllable" | LA1-001 |
| u44-0044 | *Aunque llegue tarde, Rosa siempre guardaba una mesa* | *Aunque alguien llegara tarde, Rosa siempre guardaba una mesa* | LB2-070 |
| u20-0624 | "What will the new partner be called?" for *¿Cómo se llamará…?* | "What's the new partner called, I wonder?" | LA2-030 |
| w-u42-02 | *Hasta hoy recibimos ninguna carta* | *Hasta hoy no hemos recibido ninguna carta* | LG-082 |
| `g:voseo-recognition` | "the *d* disappears from *vení*" | "*vení* loses its last vowel and *sentate* gets its *ie* back" | LC1-059 |
| `g:adjective-agreement` | "Words ending in *o* switch to *a* for a woman" | "With things, it goes by the noun's label: *el pan está listo*, *la leche está lista*." | LA1-002 |

**For a Colombian speaker, not errors.** These verdicts are native-check. No one should change them on this report's word (O7).

- Does *igual* mean maybe in Bogotá? `p:de-pronto-igual` and 21 rows say so; the DPD snippet marks it as colloquial Spain, and nothing found covers Colombia. If a Bogotano rejects it, rewrite with *de pronto*, because retranslating as "anyway" fails on rows like *Igual tienes razón, no sé* (LB1-061, LB1-062, LB1-106). *De pronto* for maybe is not in doubt.
- Would a Bogotano say conditional *como* plus subjunctive (LC1-016, VR-049)?
- Does *estar por* mean "about to" or "half-minded" (`p:estar-por`, `g:ser-estar-c1`, u57-1045)?
- Other single items: *llegar a un compromiso* (LB1-107), *circulación* for traffic (LB2-098), *Siento llegar tarde* (LA1-060), *¿Raras veces cocinas tú en casa?* (LC1-076), the rank of *¿Será que…?* against *¿Me podría…?* (LB2-050).
- From the cross-reviews: *Tengo afán*, *Estoy apurado*, *Hoy está frío*, *Soy casado*, *Quería que vengas* with an event still pending, and *a lo mejor* plus subjunctive.

## 6. Sequencing problems

The Curriculum Architect is right about the order and wrong about several additions. The order should stay. Most of the additions were sized as units of content, and they fail when tested as units of Spanish. The linguist's corrections, with the rulings that settle them:

| Proposed move | Correction | Settled by |
|---|---|---|
| `g:past-aspect-meaning` at u31 | One idea, not a verb list, at u26 d3. *Conocí* = met is in the bank from u04, and u31 has no empty slot. Line at u06, fix u17, return at u31. *Hacía X que* is a separate pattern (1 row, u31-0897, not 0) | R6, linguist |
| `g:sequence-of-tenses` at u50 | Date fine, rule reversed. It is a mapping governed by time. Rewrite `x:subj-present-past` first | R5 |
| `g:por-para-3` at u47 | *Por si* leaves. The rest is mixed choice under the arrow, as a B2 topic lesson | R4 |
| Moves 7 and 13 | Both claimed *estar por/para* at u47. Split them | Linguist |
| `x:se-all-uses` at u45 | Five sorts, at u36 after `g:passive-se`. The Curriculum said u45 and the linguist said after u41. Both are overruled | R8 |
| `x:ser-estar-first` at u05 | A sorted note, not a contrast. Teaching a choice at u05 invites *está alto* ten units early | Linguist |
| `p:preterite-yo-spelling` at u04 | Keep. It is one named rule ("keep the sound") that must return at u13 (*pague*) and u21 | Linguist, LA1-028 |
| `g:ser-estar-c1` to B2 as a block | Three levels: *es de madera* at u16; *estar de* plus job at u19; *estar por* with `p:estar-a-punto-de` at u26, once the native check is in; *no estoy para bromas* as a chunk. A true C1 node comes from LC1's list. The Curriculum's "C1" example, *está muy alto para su edad*, is A2 | Linguist |
| Word-formation strand of grammar nodes | Recognition only, light blocks, families shown with new words. A production drill would teach *llegación* | R7 |
| Adjective position | Missing from the Curriculum list. One B2 lesson, one model: after the noun it picks out which one; before it, it colours the one you have | Linguist |
| Merge `x:commands-tu-usted` and `x:tu-usted` | Drop the merge. One is a paradigm, the other a social choice. Bring `x:tu-usted` forward instead | Linguist |

**One move has a live disagreement.** The linguist wants `p:perfecto-still-live` moved to the first Patterns day after session 221, with its `requires` edge to `g:tense-modal-uses` replaced as an artefact. The verifier of LC-028 says do not move it, because it teaches a C1 split, and add a short new A2 node near u23 to u26. Both agree on the point that matters: place it right after `g:hace-que-desde` and teach the pair, or the two lessons appear to contradict. With a length of time or a start date, the present: *Hace tres meses que vivo aquí*. With no measure, *he*: *Siempre he vivido aquí*. I would follow the verifier, since the new node leaves the C1 script intact.

**New from the linguist.** Add `p:cuando-llegues` at u26 or u27. For a learner, "not yet" is the easiest door into mood, and feeling (260) is the hardest, yet the course teaches feeling first. 65 of 120 target rows are already legal at session 258, unusually cheap by the Curriculum's own measure. Also pull forward `c:cuando-quieras`. The subjunctive start at session 194 is right.

**Holes the order leaves:**

- *Soy cansado* can fossilise between session 13 and session 134, with no ser and estar contrast of any kind.
- *Llegué, pagué, jugué, empecé* have zero rows before u11, though u04's can-do is "say what I did yesterday". Learners will type *llegé* unprepared.
- Plural *se* is taught at u19 and has 0 rows before u36.
- *¿Con quién?* appears in 1,174 sentences from u02 and is explained at u37.
- The present perfect appears in 0 of 44 A2 chapters and 1 of 42 B1 chapters, then is needed at sessions 294 and 330.
- For 168 of 172 grammar nodes, the last day naming the node is within 15 sessions of its introduction.

**Ends and edges.** No band ends in consolidation. The first review day is session 47, after the densest teaching in the course. The course ends on new material: the last grammar point is `g:evaluative-adverbs`, with 0 target rows.

**Order of work.** The first curriculum move waits for stable day keys and `reconcile`, because resequencing before that corrupts real learners (R29). All tagger, lexeme and node-move changes batch into one re-tag (R30).

## 7. Insufficient support for English speakers

The curriculum anticipates English speakers, and the machine does not. There are 2,933 written pitfalls, mostly real transfer errors, and rules name English in 471 of 916 scripts. That knowledge stops at the prose.

- **No exercise uses a pitfall.** Nothing in the session asks the learner to spot or fix one.
- **The hints have no vocabulary for it.** `HintKind` has 16 values, and only three are contrasts: `ser-estar`, `por-para`, `pronoun`.
- **The hints point the wrong way.** *Quiero que vas* gets "when does it happen?". *Me gusta los perros* gets "who is doing it?". On gap cards, *soy* for *estoy* and *por* for *para* get "Check the spelling" (CX-045 to CX-047).
- **The errors pass or the right answers fail.** The lead reproduced this directly: of 10 valid answers with no accept list, 8 were refused, each with a false reason, while *Ella le gusta el café* and *Yo me gusta el café* both pass.

Three batteries measured hint quality (46 of 249, 18 of 50, 0 of 30). They scored differently, so quote no single rate. They agree on direction. The models below are now chosen, and none has been tested on a learner.

### Ser and estar (R3)

**Today.** `x:ser-estar-adj` is never taught. Drills for `g:ser-estar-adjectives` offer *es, fue, era, eres* and never *es* against *está*. The node has 21 target rows and no tagger key.

**Chosen.** Refuse permanent and temporary, and drop portrait or snapshot. Use the comparison test: than others, or than usual? Then, did something happen to get it this way? Tall, taller than others: *es alto*. Tired, more than usual: *está cansado*. Married, dead, closed, broken: something happened, so *está*. Three things skip the test: a noun takes *es*, a place takes *está* (an event takes place, so *es*), and *-ando* takes *está*. Full text is in section 3.1 of the contrastive review.

**Known leaks.** *Está claro que* and *está de moda* are fixed phrases. *Es feliz* and *está feliz* are both right, so the checker must accept both. *La fiesta está en mi casa* passes with a note (O9).

### Preterite and imperfect (R6, O10)

**Today.** "Time words help" (`x:pret-imp`) invites a word-cue habit, and it is false: *La torta que compré ayer estaba rica* (u14-0004). `g:cuando-indicative` then teaches the length error. `x:pret-imp` has no `forms`, so its card is a read-only line whose "English" is the node's title. A learner who always taps preterite scores 82% on natural sentences, and only 19% of imperfect rows have an English marker.

**Chosen.** Delete the time-words paragraph and add a test in order. First, try *was doing* or *used to do* in your English; if it still says what you mean, scene. If not, try *and then*: if it works, event. A length or a count wraps it up: *toda la noche*, *diez años*, *tres veces*. Verbs of state follow from "wrapped up": the event of knowing is finding out (R6). "Event past" and "scene past" as the single pair of labels is your call (O10).

**Honest limit.** 23 of 56 hand-judged state-verb rows allow the other aspect with the same English. A flat aspect hint would be false in those cases. Aspect may Assert only with an English lock or an action verb in plain narrative (R14). It gets connected verb gaps and translation, with no clock (R10).

### Indicative and subjunctive (R1, R2, R5)

**Today.** Each trigger is its own rule, with no shared idea. `g:subj-wanting` says "The test is one question: is it the same person?", which is the test for *que* against the infinitive stated as if it were the reason for the mood. *Dudo que Vale viene mañana* passes the personal card with "The form is right."

**Rejected.** "Is the speaker telling you this as news?" was proposed by the B1 and C1 specialists and glossed by the contrastive report. It was tested only on sentences known to alternate. It misfires on well over 1,000 rows on the indicative side: *Está claro que el café es mucho más que un negocio* (u29-0429), *Ya sé que lo sientes* (u42-0045), *No sabía que venías* (u12-0096), *Menos mal que llegaste temprano* (u12-0194). The sharpest pair is *No sabía que estabas aquí* and *Me alegra que estés aquí*: same information status, opposite moods. The linguist's "Is it information?" was not adopted as worded either.

**Chosen (R1).**

- The ordinary verb says something is so. The subjunctive holds an idea up without saying it is so.
- The test is physical: cover the opening and read what is left. Is someone in the sentence saying that's so? Ordinary verb. If not, subjunctive.
- One named catch: an opening that reacts or judges takes the subjunctive even when the rest is true. *Me alegra que estés aquí.*
- Two riders: *si* and questions are looking for information, so they keep the ordinary form; a label on a fact (*lo bueno es que*, *menos mal que*) passes the fact on.
- One admitted leak: *a lo mejor viene* and *es posible que venga* mean the same and differ only by frame. That one is memorised.

Trigger lists stay central, because nearby words carry about 83% of the mood decision. The model is for the residue and for new verbs. It grows door by door on the linguist's table (u21, u22, u26 to u27, u27 d7, u28 d1, u28 d7, u29, u40, after u41), never as one statement at u21. That table's last row keeps a "news lens" at u52 for true choices such as *el hecho de que*. R1 rejects news as the course's test but adopts the table, so that row needs your eye when u52 is written.

**Sequence of tenses (R5).** `x:subj-present-past` says "Look at the first verb, not the clock." At least 18 rows refute that: *Me preocupa que no llamara* (u53-1812) and *Me dijo que lo llame esta tarde* (u37-0365). The true rule is the reverse. Take the sentence as you would say it without the trigger, then find its subjunctive:

| Without the trigger | With it |
|---|---|
| *viene, vendrá* | *venga* |
| *vino, venía, vendría* | *viniera* |
| *ha venido, habrá venido* | *haya venido* |
| *había venido, habría venido* | *hubiera venido* |

This script must be rewritten in the same release that makes contrasts visible. CX-019 and CX-020 supply the softened pitfalls: *vinieras* is always right, and in parts of Latin America you will also hear *vengas* while the coming is still ahead.

### Por and para (R4)

**Today.** The drill asks about person and tense. `g:por-para-2` drops the arrow. "How long", a very common English *for*, had no rule.

**Chosen.** *Para* points at a target: where it's heading, who gets it, what it's meant for, when it's due. *Por* is everything else: the reason, the route, the swap, the rate, the stretch. The test: can you draw an arrow from the action to this word, ending there? If not, swap *for* in your English for *because of*, *through*, *in exchange for*, *per* or *during*.

**Overruled.** The verifier's text for CX-038 ends "Not *para*". That is false as an absolute: *para* marks a booked or planned stretch (`u18-0367` *una reserva para dos noches*, `u42-0551`, `u36-0186`), so the checker must accept both. *Por si* is not a por/para fact and leaves this strand.

### Gustar

**Today.** The model is sound at every band, and the weakness is the checker. *Yo me gusta el café* passes, and "who is doing it?" is the worst possible question for this error. *Me gustas* and *te gusto* appear in 0 rows, so the forms that prove the model are never practised.

**Chosen.** Keep "pleases" and add *bothers*, which has the same structure and is everyday English. Add the verified warning: "about someone you know, *me gusta* usually means you're attracted to them. For things, places and activities it's always safe." (LA1-003). The two person cards stay, since the verifier found them honest with that warning in place. In the checker, do not stop stripping subject pronouns outright as the contrastive report first proposed: *Él no me cae bien* (u16-0921) and *Tú te quedas aquí* (u59-0231) must pass. Fire on a person mismatch instead.

### The se family (R8)

**Today.** There is no map of the system. `x:se-three-ways` is unserved, arrives before three of the uses, and misses a job. *La puerta se cerró*, *se acabó*, *se fue la luz* (192 regex hits, from u12) have no rule, and the bank errors at LA1-033 and LA1-034 (*Simón cayó de la silla*) are that gap showing.

**Chosen.** Five sorts, at u36 after `g:passive-se`, translated both ways, never labelled by the learner:

1. Back on yourself: *Vale se levantó.*
2. To each other: *Tomás y Vale se conocieron.*
3. It just happened: *La puerta se cerró.*
4. It just happened, to me: *Se me cayó el celular.*
5. Done, and we're not saying who: *Se vendieron todos los almuerzos.*

The test: is someone doing this to something else, and do you want to say who? If not, *se*. Then find the thing, because the verb matches it. *Se lo di* and the verbs that change meaning (*irse*, *dormirse*) are set aside as "two that don't belong".

**A wrinkle.** The linguist's five sorts and the contrastive review's five are not the same list: the linguist counts "se that changes the verb" and lacks "it just happened". R8 says five and adds that job, so I have used the contrastive list, the only one that satisfies both. Confirm when the script is written.

### What the checker must do first

Accepts ship before named rules, because 33 of 33 correct alternatives sent through the real matcher failed with a hint. Acceptance goes in `variants.ts` with swap reporting, so *voy a pagar* on a `g:future-simple` card is a pass with a note, never a silent pass (R13). Trap rules have four outcomes, Assert, Ask, Note and Silent, and only Assert hits count as weak spots. A gate battery of correct answers must produce no Assert. Trap rules wait until false pitfalls are fixed (R14). Accent slips stay right with a note unless the accent changes the word (R15). *Llegué* and *llegue* are the case to watch. Leísmo: *le vi* for a man passes with a note (O8).

## 8. Exercise design failures

### Drills that do not test their distinction

`practiceCard` shuffles all features and takes the first that fits, regardless of the node (`cards.ts` line 686). The ladder gaps only forms of one lemma and shows the infinitive as a cue.

| Drill | What the card asks |
|---|---|
| `g:ser-estar-adjectives`, u15 d2 | "Esto ___ para ustedes." options *es, fue, era, eres*. Never *es* against *está* |
| `g:por-para-1`, u18 d1 | "Which one is about us (we)?": *Pasé / Pasamos / Pasó por Honda* |
| `g:pret-vs-imperfect`, u12 d1 | "What does it mean?" with distractors such as "I pulled the chair up to Hernando's" |
| `g:quantifiers`, older item | *Esos vecinos ___ demasiado.* (hablar). The learner conjugates and never touches the quantifier, and the rung still climbs |

Across 31,096 simulated cards, cards opposing the two sides numbered 1 for ser/estar, 1 for hay/está, 8 for por/para and 11 for lo/le, by heuristic. *Saber/conocer* and *pedir/preguntar* had none. The `copula` feature fired zero times in 1,456 structured-input cards. In practice, translation is the real test. It tests only what English cues, and English does not cue ser/estar, por/para or aspect.

### The ladder collapses above A2

| Nodes | Gap possible on own rows | Transform | Gaps on target |
|---|---|---|---|
| Grammar A1 | 37% | 56% | 43% |
| Grammar A2 | 22% | 39% | 34% |
| Grammar B1 | 11% | 30% | 27% |
| Grammar B2 | 10% | 27% | 13% |
| Grammar C1 | 16% | 29% | 13% |
| Subjunctive family (27) | **6%** | 12% | 10% |
| Contrast (94) | none: no rows exist | none | none |

Thirty grammar nodes produce no gap at all, including `g:pret-vs-imperfect`, `g:subj-doubt`, `g:imperfect-subj` and `g:si-hypothetical`. `parseClause` gives up when a sentence has more than one finite verb, and every subjunctive sentence has two. The planned operation quietly falls back: at u45, 90% of "choose" items became full translations. The block heading still says "First choose, then type, then change it around." Recombination, called "the mastery test" in the code, fired 0 times in 120 perfect sessions.

The fix is a marked `focus` span on target rows. It is computed, not burned: the tagger has a span on 95.4% of grammar rows, only the 37 blind nodes need authoring, and 200 spans must be sampled first (R12). This overrules the Acquisition report's burn of about 20,000 rows. Reconstruye as specified is rejected, having accepted 0 of 24 valid rebuilds, so connected verb gaps from chapters come first (R19).

### Recognition with no decision

- **Random distractors.** When structured input cannot build a pair, it falls back to a meaning question with two random options. At u45 that was 84% of the block. For *Nadie ha llegado todavía.* the distractors were a question about the lease and a line about a coastal town, so one known word is enough. By feature, 863 of the simulated structured cards were plain meaning cards.
- **Free passes.** "Remember this one?" is a read card that records Good with no retrieval. That is a plain bug. R16 leaves graded recognition unchanged and withdraws evidence weighting, which modelled a 63% rise in load. It does not protect read-only cards.

Contrast format now depends on what decides the contrast (R10):

| What decides | About | Format | Clock |
|---|---|---|---|
| A nearby word | 30 of 94 | Forced choice is sound, since matching the cue is the skill | After calm accuracy |
| Intended meaning | 27 | Twin sentences, then type both sides | Only after mastery |
| Discourse | 8 | Connected verb gaps, translation from plain English pasts | Never |
| Near-synonym | 29 | Phrase retrieval, not decks | No |

A Cue Test sits beside the Guess Test: a cue table at most 65% and always-commoner at most 55%, on meaning and discourse decks. That classification is one rater's. Contrast data is one `ContrastItem` type, one file per contrast, starting at 40 items and 150 for the five big ones, then measured (R11). This replaces the flat 40 to 80 rows. No `x:` ids go into existing rows.

### Feedback

- **The reason is rarely a reason.** An authored or rule-bearing line accompanies at most 6 to 11% of cards. The rest are glosses, "It uses <title>", or "Here is how Spanish says it."
- **False reasons teach.** "tenemos isn't the word here" for *We have to wait* (u01-0564) tells a learner something untrue. Of 91 valid alternatives to real rows, the checker accepted 5. Those alternatives were purposive, so that is a statement about capacity, not a rate.
- **Some refusals depend on who the learner is.** About 160 first-person rows refuse the feminine ending, so *Estoy enferma, Vale* fails on "I'm ill, Vale." (LG-096). Untagged rows modelled in *usted* refuse the *tú* answer (LG-097), and 1,920 rows tagged "(polite)" enforce nothing (LG-098).
- **A rejection is expensive.** One false Again at the third or fourth review takes a card from 5 reviews in its first year to 9 or 10 (modelled).
- **Misses change nothing.** A miss in controlled output is not re-asked, and failing most of a drill leaves tomorrow's plan unchanged.
- **Free answers are barely checked.** 13 of 14 ungrammatical free answers passed, including *Estoy comer pan*.

R9 sets the credit for "Mine says the same thing": Hard through the existing lenient path, a fresh-sentence retest when one exists, whole-sentence cards from A2 up, never when a named trap fired, never a rung climb or a novel pass. This overrules the lower journeys report (Good) and the Acquisition reviewer's preference for no credit. The simulation could not separate the lesser credits, so the cheapest honest path won.

### Generated Spanish at the top of the course

The most serious defects in the audit are not in any script. At u59 and u60 generators require, as the single right answer:

| Card | Required answer | Claim |
|---|---|---|
| Say it happened yesterday | *Ayer cuidá a tu hermano mientras yo salí.* | LC1-001 |
| Make it negative | *Poco no me sirvió, la verdad.* The lesson's own listed pitfall | LC1-002 |
| Say it happened yesterday | *Ayer Cada uní con su cuento: ese es el barrio.* (*uno* read as *unir*) | LC1-003 |
| You're the only one who understands me. (vos) | *Vos sos el único que me entiende.* Against "never to say it" | LC1-004 |
| Those who live in the area will receive a notice. | *Quienes vivieren en la zona recibirán un aviso.* | LC1-005 |

There are 20 "(vos)" production cards in 8 days, and the correct *tú* answer fails. This contradicts your no-voseo decision. There is no receptive flag: `productivePolicy` looks only at kind, band and frequency, and the gate's recognition list never reaches the compiler. `g:vosotros-recognition` has the same fault (LB2-077). Lower down, 21% of transforms were on questions: *¿Cómo están ustedes?* becomes *¿Cómo estoy yo?*.

## 9. The grammatical coverage audit

Rated against the eight questions, by topic family.

**Key.** Y yes, P partly, N no.

- **Natural** Y means no mechanical defects and no problem in the sample read.
- **Exercises test it:** Yes means form cards and translation both do; Transl. means translation only; No means the topic is a choice and no card makes that choice; Rec. means recognition by design.
- **Revisited:** Rows means it recurs in sentences while the concept is never reopened; Inert means review days name it in the data and nothing runs; Spiral means it is deliberately reopened; Thin means little later use.
- **Production:** writing tasks plus scene turns with this focus, summed from the coverage matrix, so some double counting is possible.

| Family | Exists | Accurate | Clearly explained | Sequenced | Natural | Exercises test it | Revisited | Production |
|---|---|---|---|---|---|---|---|---|
| Articles, gender, agreement | Y | P, *-ma* gap | Y | Y | Y | Yes | Rows | 14 + 20 |
| Subject pronouns, tú/usted | Y | Y | Y | P, `x:tu-usted` late | Y | Transl. | Rows | 5 + 11 |
| Demonstratives, possessives, quantifiers, numbers | P, numbers by pattern only | P, LB1-076 to 078 | Y | Y | Y | Yes | Rows | 30 + 48 |
| ser, estar, hay | Y | P | P, model replaced (R3) | P, hole to session 134 | Y | **No** | **Inert** | 21 + 40 |
| Present, regular and irregular | Y | Y | Y | Y | Y | Yes | Rows, dense | 23 + 25 |
| Reflexive and *se* | P, one job missing | P | P, no map | P | Y | **No** | Rows | 20 + 24 |
| Object pronouns, placement, doubling | Y | P, LA1-010 | Y | P, doubling late | Y | Yes for placement, **No** for lo/le | **Inert** for lo/le | 35 + 59 |
| Gustar family | Y | Y | Y | Y | Y | Yes | Rows | 14 + 19 |
| Prepositions, por/para | P, no system | P, R4 | P | P, verb + preposition at u49 | Y | **No** | **Inert** | 10 + 26 |
| Questions, negation | Y | Y | Y | P, *¿con quién?* at u37 | Y | Yes | Rows | 18 + 38 |
| Preterite forms and aspect | P, boundary idea absent | P, LA2-001 | Y | P, *llegué* at u11 | Y | Yes for forms, **No** for aspect | **Inert** | 35 + 62 |
| Perfect, pluperfect | P, continuing use | Y | Y | P, C1 for its main job | Y | Transl. | Thin | 9 + 25 |
| Future, conditional | Y | P, LA2-024 | Y | Y | Y | Transl. | Thin | 26 + 44 |
| Imperatives | P, no *we* form | Y | Y | Y | Y | Transl. | Rows | 17 + 28 |
| Subjunctive forms | Y | Y | Y | Y | Y | Transl., gaps on 6% of rows | Rows | 15 + 25 |
| Subjunctive choice: noun, adverbial, relative | Y | P, LB2-010, LB1-002 | P, no one model | Y, order inside thread aside | Y | Transl. | Thin | 30 + 76 |
| Sequence of tenses | P | **N**, R5 | **N** | Y | Y | Transl. | Thin | 2 + 4 |
| Hypotheticals | Y | P, LB2-035 | Y | Y | Y | Yes | Rows | 18 + 36 |
| Reported speech | Y | P, LB2-023 | Y | Y | Y | Transl. | Spiral | 19 + 27 |
| Passive, impersonal | Y | P | Y | P, plural *se* | Y | Transl. | Rows | 15 + 25 |
| Relative clauses | Y | P, LB2-054 | Y | Y | Y | Transl. | Spiral | 13 + 25 |
| Cause, result, concession, time | Y | P, LC1-037 | Y | Y | Y | Yes | Thin in reading | 26 + 38 |
| Comparison | Y | P, CX-001, LC1-045 | Y | Y | Y | Yes | Spiral | 14 + 30 |
| Periphrases, modality, verbs of change | P | P, LB1-019 | Y | Y | Y | Transl. | Thin | 27 + 42 |
| Word formation, diminutives | P, derivation absent | P, LA2-032 | P | Y | Y | Transl., should be Rec. (R7) | Thin | 7 + 10 |
| Clefts, focus, word order | P | P, LB2-060 | P | Y | P, LC1-073 | Transl. | None | 5 + 14 |
| Connectors, register, non-finite clauses | Y | P | Y | Y | Y | Transl. | Thin | 22 + 62 |
| Regional recognition | Y | P, LC1-060 | Y | Y | Y | **Forced into typing** | Thin | 4 + 17 |

Reading the table:

- **Every No sits on a choice English gives no help with.** Inflection, placement and clause linking are in good shape. The No rows are where a learner needs the app most.
- **The production column overstates independence.** Scene turns and writing tasks are real, and many enforce the structure. But the intent often hands over the keyword ("use: sencillamente"), scene answers grow only from 7.1 to 9.4 words, and no writing task exceeds 250 words.
- **Thin nodes make it worse.** 40 grammar nodes have under 60 target rows, and 39 of those have no rows listing them in `requires`.

## 10. Vocabulary and reading

All delivery figures are simulated (R32). The compiler and budgets are real, and the learner is modelled.

**Words delivered.** The default tier cannot deliver the plan. Of 2,528 planned words, the average standard-tier learner meets 1,822, including only 19 of 380 B2 words and 11 of 332 C1 words. `fitToBudget` trims the learn pool whenever a plan runs over, and owed items sit in a queue that reaches 706 lexemes at the end. Words that never arrive include *la posibilidad*, *la cultura*, *la crisis* and *producir*. Extended cannot be the answer, because your rule is one default lesson. Reversing the priority, with a reserved slot for new words, is the core fix, tuned only after the checker, contrast blocks and `focus` gaps land (R20).

**The headline number.** 4,554 lexemes includes 1,830 "receptive" words. 979 of those are in no sentence or chapter by tag (918 by raw surface forms), and an average learner never meets 1,265. The compiler still treats them all as known from their priority session. Any progress figure built on this tier is fiction.

**The target.** The project's own table shows the full 4,550 covers 89.7% of Colombian web text. An average finisher sits nearer 77% of written tokens, somewhat more in clean text. That is not reading a newspaper in comfort.

**Frequency ranks are corrupted by homographs.** *coser* ranks 94 on the strength of *cosas*. *casarse* ranks 67 on *casa* and *caso*. *parir* gets its count from *parís*. Meanwhile *la parte* and *la duda* have no rank.

**Glosses.** Verified fixes, ready to paste:

| Lexeme | Gloss now | Replace with | Claim |
|---|---|---|---|
| `l:parte` | bulletin, report | part; side; share | VR-001 |
| `l:gestión` | *el gestión* | *la gestión* | VR-039 |
| `l:desgracia` | disgrace | misfortune, tragedy; (with por) unfortunately | VR-002 |
| `l:solo` | alone; lonely | only; alone, lonely | VR-003 |
| `l:nuevamente` | newly | again | VR-009 |
| `l:hecho` | done, completed | done, made; fact, event | VR-011 |
| `l:plazo` | period, phase | deadline, term (a largo plazo = in the long term) | VR-024 |
| `l:mono` | overalls | blond (Colombia); monkey | LA1-041, VR-033 |

`l:repente` ("attack, upsurge") needs moving, not relabelling: the u12 card reads *De ___ salió el sol* (VR-008). *Inseguridad* trains "insecurity" on 8 rows, and the verified English is "the lack of safety", with "crime" in `acceptEn` (LB1-098 to LB1-105).

**Words lack word knowledge.** Governed prepositions are absent from all 973 verb entries. Collocations are thin: *llevar a cabo*, *medio ambiente*, *derechos humanos* and *sentido común* have zero occurrences in 72,693 rows and 219 chapters. False friends are not a set. *Introducir* and *atender* are tagged "(cognate)", which wrongly marks them safe (CX-040, CX-041). *Estoy caliente* has no warning (CX-037 adds one), and *excitado* has none.

**Reading volume.** About 87,000 tokens (82,000 by the vocabulary specialist's stricter word count), one short novel, across 593 sessions. First-pass reading is about 5% of course time. The Acquisition specialist withdrew their own 500,000-word target as unworkable in a fixed lesson. Derived from the words that need meeting, about 250,000 to 300,000 new words in lessons would do. Whether to fund that, and in what form, is your call (O4). The default is no reading burn.

**Text shape.** C1 text is not C1 text. Mean sentence length moves from 5.1 words at A1 to 8.5 at C1, and narration from 6.9 to 11.4. 213 of 219 chapters are at least half dialogue by line. The connectors *sin embargo, no obstante, por lo tanto, por consiguiente, en cambio, a pesar de* appear 4 times across all 45 C1 chapters. Can-dos promise genres the course lacks: `d:u45-the-news` asks a learner to follow a news report, and the news text in ch142 is about 40 words. Chapters are not delayed for unknown words and are not rewritten to the vocabulary report's prose specification; they are glossed instead (R26). So genre has to come from elsewhere, which is O4 again.

**Questions.** The right option is the longest in 88 to 92% of first-read questions from B1 up, so a learner who reads nothing can pass. All 1,632 questions are multiple choice. That is a property of the files, not observed behaviour, but the score is not evidence of comprehension.

**The reader.** Tap-to-gloss is the most visible defect a learner will meet.

- A word in any phrase gloss returns that phrase. The vocabulary report measured 32.2% of tokens receiving a note about a different sentence, and a verifier's scan of the first 40 chapters found 22.6%. Tapping *la* in ch001 shows a note about the café door (LG-005).
- Ana shows the gloss for *ano*, Tomás shows *tomar*, and Vale shows *valer* (LG-001, LG-004).
- *La*, *las* and *los* return *lo* (LG-006).

These are code fixes with a test over all chapters. Reader taps stay free: a tap creates nothing, and a save creates a card, at most three a day (R25). That overrules the vocabulary report's tap-creates-a-card proposal. A learner placed at week 45 is still sent to ch001, *Hola, Bogotá*.

## 11. The ideal curriculum structure

Keep the 60 units, their order, the chunk-first design, the mood thread, the three spirals and the story. Change what runs on them. Each topic gets a target level by stage and an exercise that delivers it. The shell moves to stage labels, and per-skill CEFR stays as a reference only, once there is evidence for it (R24).

**The six levels, and what serves each after the fixes:**

| Level | Can the learner | Delivered by | State today |
|---|---|---|---|
| Recognising | Notice the form in input | Structured input with real pairs, on `focus` spans | Good on teach day, then random fallback |
| Understanding | Say why one option is right | Contrast teach blocks, pushed reason at a miss | Strong for grammar, absent for contrasts |
| Applying with guidance | Produce with the choice narrowed | Gaps on the taught feature, by contrast class (R10) | Gone above A2 |
| Producing independently | Build the sentence alone | Translation scored on the target, with a fair path for alternatives (R9, R13) | Plentiful, judged against one string |
| Using in unfamiliar contexts | Transfer to new content, delayed | Connected verb gaps, scenes without the keyword, delayed probes on quarantined rows | Exists, unmeasured |
| Using naturally | Do it quickly, in connected text | Rereads, reading volume, same prompt each quarter | Rereads only |

**Target level by stage.** Stage 1 is u01 to u14, stage 2 u15 to u27, stage 3 u28 to u41, stage 4 u42 to u51, stage 5 u52 to u60. Entries are the level a typical learner should reach by the end of that stage.

| Thread | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|---|---|---|---|---|---|
| Ser and estar | Recognising, sorted note | Understanding, comparison test at u15 | Producing independently, including participles | Unfamiliar contexts, mixed | Naturally: *estás muy joven* |
| Two pasts | Understanding, scene and event at u12 | Applying; boundary idea at u26 | Producing, with `g:narrative-pasts` | Unfamiliar contexts, connected gaps | Naturally, in long narration |
| Mood | Chunks only, recognising | Applying: wanting, hoping, not yet, surprise | Producing by trigger; riders; `g:mood-decision` after u41 | Unfamiliar contexts, mixed | Naturally, real choices |
| Por and para | Chunks | Understanding, target test | Producing, closed frames | Unfamiliar contexts, mixed choice | Naturally |
| *Se* | Recognising, routine verbs | Applying, impersonal and reciprocal | Understanding the map at u36, then producing | Unfamiliar contexts | Naturally |
| Connectors and text | Recognising | Applying | Producing | Unfamiliar contexts, in reading | Naturally, in long writing |
| Word formation | Recognising | Recognising | Recognising | Recognising | Recognising (R7) |

**Rules that go with it.**

- **Recognition is a level, not a failure.** Voseo, vosotros, *-se* forms, the future subjunctive, *nada más* plus infinitive and word formation stop at recognising and understanding. That needs a receptive flag on nodes (LC1-004, LC1-005). Typed production of these ends.
- **A contrast gets a day.** A contrast-teach day keeps the full script and moves `communicative` and the freer `writing` off the day, recovering about 6 of the 6.6 minutes overrun, to be checked in the simulator (R21).
- **The daily budget has five parts:** warm up, new, practise, read, use. Every addition names what it replaces (R20). B2 and C1 minutes rise earlier, since that is your standing decision and `SESSION_MINUTES` contradicts it.
- **Consolidation at stage ends.** The Curriculum proposes a week after u14, u27, u41 and u51, and a capstone at u60. The linguist's `g:mood-decision` needs the slot after u41. No ruling fixes this yet, and it adds about 30 sessions unless light-weighting pays for part of it.
- **B2 and C1 as document-led, few and long** is your standing wish, but today's day template does not deliver it. It goes to one pilot at u45 with a kill rule (O5). Units stay unchanged until then.
- **Honest claims.** The Curriculum and Acquisition reports agree that a finisher has covered a C1 syllabus, not reached C1. The curriculum estimate, which is judgement, puts free production at B1+ to B2 and reading at B1+ to B2 on simple prose. With no listening or speech, "using naturally" can only ever be claimed for reading and writing. No shown level is anchored to course position (R22).

## 12. Verification record

Claims were quoted from source and checked by script or by hand. A verifier then tried to break each one, and a second lens re-tested 98 of them. The final verdict is the second lens where there is one, otherwise the first (R31). The merged result is identical to `verdicts/final.json.tmp`.

| Source | Claims | Confirmed | Amended | Rewrite-needed | Native-check | Refuted |
|---|---|---|---|---|---|---|
| A1 | 61 | 34 | 18 | 3 | 1 | 5 |
| A2 | 72 | 38 | 27 | 1 | 0 | 6 |
| B1 | 118 | 55 | 48 | 7 | 4 | 4 |
| B2 | 113 | 56 | 33 | 5 | 2 | 17 |
| C1 | 98 | 37 | 23 | 27 | 2 | 9 |
| Coverage | 39 | 13 | 12 | 3 | 0 | 11 |
| Gap | 102 | 58 | 22 | 19 | 0 | 3 |
| Contrastive | 47 | 10 | 20 | 7 | 0 | 10 |
| Vocabulary | 51 | 25 | 19 | 3 | 1 | 3 |
| **All** | **701** | **326** | **222** | **75** | **10** | **68** |

By severity: all 9 critical claims stood (3 confirmed, 6 rewrite-needed). Of 109 high, 11 were refuted. Of 389 medium, 34. Of 194 low, 23.

Rewrite-needed means the defect is real and no single string fixes it. It goes to a person who reads the whole script, or to code.

**What the 68 refutations showed.** This sorting is mine, from the verifiers' reasons.

| Kind | Count | Examples |
|---|---|---|
| Right diagnosis, duplicate of another claim on the same string | 24 | CX-003 and LC-001 duplicate LB2-010; CX-034 duplicates LC-027. All 10 contrastive refutations are of this kind |
| Right diagnosis, wrong fix | 2 | LB2-011 and LB2-012 struck out correct Spanish again |
| Correct Spanish or English accused of being wrong | 21 | LB2-015, LB2-017, LB2-018: *No oí que sonara el teléfono* is fine (NGLE 25.7c). LB2-093 to LB2-096: fronted *in case* reads as a contingency, and Simón is a parrot in a cage, so *En caso de que Simón escape, cierra la ventana* is sensible. LA1-035 and LA1-036, *El pan cayó al piso*. LB2-040 and LB2-041, *Habría unas cien personas*. LC1-096, *asumir*. LC1-098, the cobbler's *cuyo*, said in formal speech to an assembly. VR-044, VR-047 |
| A fair simplification read too strictly | 14 | LA1-050, LA1-052, LA2-027, LB1-065, LC-016. LA2-020 is here too; see below |
| The proposed change was worse, or not the real defect | 5 | LA1-020, LA2-059, LG-002, VR-038 |
| The app's refusal was right | 2 | LG-063, LG-066 |

**The lesson about the specialists.** No critical claim fell. Of the 11 high claims refuted, 10 were duplicates or wrong fixes, so the diagnosis stood. The core findings of this report survived adversarial testing. The specialists were strong on what is structurally broken and on what the bank contradicts. They were weak in one specific way: they accused correct Spanish of being unnatural, from memory. That is the same fault they found in the course, an absolute stated with no source. The B2 specialist's two headline cases of "bad" Spanish both fell, and 15 of that band's 17 refutations were substantive. Agreement proved nothing either: three reports converged on the news test, and it failed on bank rows.

The second lens never reversed a refutation, but it changed 17 of the 41 first-lens "confirmed" claims it re-tested, usually the replacement text. Those 98 may not be a random sample, so that is not a rate. Still, the 302 confirmed claims that had only one lens could carry similar faults in their wording. Treat those texts as drafts to read, not to paste blind.

**Numbers corrected from the specialist reports.**

| Topic | Report said | Corrected | By |
|---|---|---|---|
| *Quisiera* in `g:softening` | 106 of 120 (LB2, repeated in the linguist's cross-review) | **93 of 120** | Verifier of LB2-053; I re-counted on the snapshot |
| y to e, o to u errors | 6 | 7 | Verifier of LC-023 |
| *Hacía X que* | 0 rows | 1 (u31-0897); the other regex hits are false friends | Linguist; re-checked |
| Copular agreement rows | 0 | At least 3 | Linguist |
| Rate rows, *al día* against *por* | 45 to 10 | 37 to 10 | Verifier of LB1-009 |
| Reading target | 500,000 tokens in lessons | 250,000 to 300,000 | Acquisition, withdrawing their own figure |
| Uses of *se* | Seven | Five | Linguist, R8 |

Contrasts with no `forms` are 5 on the snapshot. The matrix's 7 counts contrasts yielding no card pair, which is a different measure, so both figures hold. The rulings cite `compile.ts:1114`. On the snapshot the line is 1115.

**One refuted claim you should know about.** LA2-020 said "right now" fails on *está casado*. Its verifier refuted that, and the contrastive reviewer disagreed with the verifier, citing *Hernando estuvo casado treinta años* (u15-0717). I have not reinstated it as a finding. R3 replaces the model, which makes the dispute moot, but LA1-006's verified text still says "how they are right now". The contrastive review prefers "how they are", and that wording should be settled when R3 lands.

## 13. What this audit could not establish

**Whether anyone learns from this.** No real learner has used the app. Every effect is inferred, every simulation draws true memory from FSRS itself, and no phone or Safari run has happened (R32). The 20% false-rejection figure in the self-grade and review-load models is an assumption. The chosen models for ser and estar, mood, por and para, and *se* are untested on people. "Than others, or than usual?" and "cover the opening" are the two to try first.

**What was read and what was sampled.**

| Material | Coverage |
|---|---|
| Grammar scripts (172) | All read, rule, small print and pitfalls; band specialists read every card |
| Contrast scripts (94) | All read for hook, examples, rule, small print and pitfalls; read-and-pick and your-turn in part |
| Pattern scripts (650) | Sampled: all of A2's 35, rules of all 91 at A1, about 31 of 152, 31 of 184 and 32 of 188 above that, plus scans across all |
| Bank (72,693 rows) | About 4,500 rows read by eye, some 6%. 24 lints ran over all 103,451 strings, and regex scans over the bank |
| Chapters (219) | About 30 read by eye, the rest measured by script |
| Scenes and writing | 60 of 270 scenes and 180 of 875 tasks read by eye; all run through scripts |
| Chunks and lexemes | All 404 chunks read; all 2,528 taught-tier glosses read; receptive tier scanned |

So a wrong translation that is structurally clean would escape in the unread 94% of the bank. Mistranslation counts are floors. Regexes catch only the shapes someone thought to look for.

**Authority.** rae.es refused fetches, so DPD, DLE and Ortografía citations come from search snippets, secondary sources or memory. The NGLE, Butt and Benjamin, and Bosque and Demonte are often from memory, with chapter numbers approximate. The cross-reviews ran out of search budget, so their citations, such as Terrell and Hooper, Lunn, Salaberry and VanPatten, are unverified. Verifiers record which is which in each reason. Someone with the books should check the claims that rest most on them, starting with LB2-010 and LB1-001 to LB1-004.

**Frequency and dialect.** No corpus was available: no CORPES, no Davies list. Statements of frequency are judgement, and the bank is generated, so it shows what the course contains, not what speakers say. Colombian usage is the weakest area of evidence, and the native-check list in section 5 is real uncertainty.

**One-rater judgements.** The classification of 94 contrasts, the hand samples behind 23 of 56 and 10 of 57, the interference firing rates and the level estimates are each one judge's work, with no second reader.

**Learner level.** Whether a finisher reads at B2 or writes at B1+ is informed opinion. The app measures neither, and no transfer probe exists.

**Current state.** Everything here describes the audited snapshot. I did not audit the uncommitted work on `next`.
