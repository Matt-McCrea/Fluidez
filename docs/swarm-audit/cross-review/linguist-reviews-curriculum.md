# Cross-review: the linguist tests the curriculum

Role: Spanish linguistics specialist, reviewing `reports/04-curriculum.md` and the proposals in `reports/01-linguistics-*.md`. Reviewed 1 November 2026 on branch `rebuild`. Bank counts are my own regex scans over all 72,693 rows and are floors unless stated. The measurement scripts are in `/private/tmp/claude-501/-Users-Matthew-Fluidez/40ef6734-a9c2-4284-b528-c9cc038164e6/scratchpad/lrc/`.

**Verdict.** The Curriculum Architect is right about the order and wrong about several of the additions. Most of the additions were sized as units of content, and they fail when tested as units of Spanish. Three do not hold together: `g:por-para-3` contains something that is not a por/para fact, Move 7 and Move 13 claim the same material at the same unit, and `g:sequence-of-tenses` would sit on top of a live contrast script whose rule is backwards. The proposed one-line subjunctive test ("told as news?") breaks. It was only tested on sentences already known to alternate. Run on the indicative side of the same bank, it misfires on well over 1,000 rows, including *No sabía que venías* at u12 and *Es verdad que Altamira tiene dinero, pero…* at u44. Section 1 gives a replacement. "Subjunctive" should be the course's word from u21, as a named exception to the voice rule that the owner has to approve.

| Proposal | Ruling | One line |
|---|---|---|
| `p:perfecto-still-live` to A2 | **Keep, and place it exactly** | Straight after `g:hace-que-desde`, or the two lessons contradict each other |
| `g:past-aspect-meaning` at u31 | **Change** | One idea, not a verb list, and at u26 |
| `g:sequence-of-tenses` at u50 | **Change** | Date is fine. The rule has to be the reverse of the live script's |
| `g:por-para-3` at u47 | **Change** | *por si* leaves. Merge with the *estar por/para* move |
| `x:se-all-uses` at u45 | **Change** | Consolidation week after u41. Five sorts, not seven labels |
| `x:ser-estar-first` at u05 | **Change** | A sorted note, not a contrast node |
| `p:preterite-yo-spelling` at u04 | **Keep, and extend** | The same rule must return at u13 and u21 |
| `g:ser-estar-c1` to B2 | **Change** | Do not move it as a block. Its parts belong at three levels |
| Word-formation strand | **Change** | Recognition only. No production drills |
| Adjective position | **Keep, and add to the Curriculum list** | Apocope is a line. Position is a B2 lesson with one model |

---

## 1. Trying to break "Is the speaker telling you this as news?"

### 1.1 Result on the nine named items

Five pass, three half pass, one fails.

| Item | Result | Why |
|---|---|---|
| *No creo que venga* | Pass | |
| *Ojalá venga* | Pass | |
| *Cuando llegues* | Pass | But see the *cuando* row in 1.2 |
| *El hecho de que no llamara* | Pass | Its best result. It beats `g:mood-choice-fine`'s "pointed at, or still open?", which LC1-013 showed fails here |
| *Aunque llueve / llueva*, *aunque sea mi hermano* | Pass | Better than `x:aunque-ind-subj`'s "maybe you are, maybe not" |
| *Me alegra que vengas* | Half | It only works if "news" means "presented as news". Say *Me molesta que Altamira haya comprado la cuadra* to someone hearing it for the first time. It is news to them, the literal test says indicative, and that is exactly the English speaker's error |
| Relative clauses | Half | Passes the pair *tenga / tiene*, fails ordinary relatives (1.2) |
| *Quizás viene / venga* | Half | Passes the pair, but "told as news" is the wrong word for a hedge, and its neighbour *a lo mejor viene* fails |
| *Es verdad que* | **Fail** | *Es verdad que Altamira tiene dinero, pero no tiene razón* concedes what the other person just said. Nothing is news. The verb stays indicative |

### 1.2 Where it really fails: the indicative side

Section 6.1's table has twelve rows, and all of them are alternations. A test of a mood model also has to run on sentences that do not alternate. Here is the bank's indicative side.

| Sentence | Rows | What the test predicts | Reality |
|---|---|---|---|
| *No sabía que venías* (u12-0096) | 22 | The listener knows they are coming, so not news, so subjunctive | Indicative |
| *Te dije que no tengo plata* (u13-0159), *Sabes que no puedo* (u13-0280) | 29 | Told before, or known to you, so subjunctive | Indicative |
| *No encuentro el audio que me mandaste ayer* (u14-0034) | Not counted: every ordinary relative clause | You sent it, so not news, so subjunctive | Indicative |
| *Es cierto que el café es pequeño, pero…* (u44-t-argument-markers-0001) | 11, plus 3 as questions | Conceded, like *no dudo que tengas razón, pero*, so subjunctive | Indicative |
| *La publicidad dice que es un hotel grande, pero no es verdad* (u18-0771) | At least 4 | The speaker denies it, so subjunctive | Indicative |
| *Menos mal que llegaste temprano* (u12-0194) | 11 | "Reacted to", so subjunctive | Indicative, at A1 |
| *Lo bueno es que el arriendo es barato* (u24-0668) | 48 | "Reacted to", so subjunctive | Indicative |
| *Si llueve, nos quedamos* | 856 rows with *si* and no past subjunctive | Hasn't happened, so subjunctive | Indicative |
| *No sé dónde está mi padre* (u05-1051) | 166 | Not told, so subjunctive | Indicative |
| *¿Crees que sabe algo?* | Scripts | Asking, not telling, so subjunctive | `x:creo-no-creo` says indicative |
| *Cuando era niño…* | 141 on a narrow list | Background, not news, and on the list of reasons nothing covers it | Indicative |
| *A lo mejor viene* (u20-0050) | 60, plus 40 *de pronto* | Not claimed, so subjunctive | Indicative, with the same meaning as *Es posible que venga* |

The sharpest pair is *No sabía que estabas aquí* and *Me alegra que estés aquí*. The clause has the same information status in both: true, known to both people, taken for granted. The moods are opposite. So information status cannot be what chooses the mood. "News" merges two separate questions, whether anyone holds this to be so and whether the listener already knew it. Mood mostly follows the first. The second only matters at the margin.

Limiting the test to sentences after a trigger would rescue most of these rows. It would also remove what made the model attractive, namely that one test explains *aunque*, relatives and *cuando* together.

The history matters here, cited from memory (see section 7). This is the old assertion account: Terrell and Hooper 1974, then Lunn's "assertability" (1989), which is very close to the news test. Its known hole is verbs like *saber*: presupposed clause, indicative verb.

### 1.3 What survives

"News" is the right lens **at the top of the course**, where mood is a true choice: *el hecho de que*, fronted *que* clauses, *no dudo que tengas*, *de ahí que*, *lo que digas*. LC1's u52 script should keep it for those cases. It should not be the test that a learner runs at u21.

### 1.4 The replacement: "Is it information?"

The test moves from the listener's head to what the first half of the sentence is doing.

> **Is this information, or is the sentence doing something else with it?**
>
> Information is anything somebody in the sentence says, knows, thinks or has seen. It can be old. It can be false. It can be someone else's. It takes the ordinary form.
>
> Everything else takes the subjunctive: wanting it, feeling something about it, judging it, doubting it, waiting for it, looking for it, waving it away. Whether it is true does not decide it. *Sé que estás aquí* passes on a fact. *Me alegra que estés aquí* is about being glad.

Two riders handle the rest:

1. **A *no* can remove the information or leave it standing.** *No creo que venga*: gone. *No sabía que venías*: still standing, you are coming and I just didn't know. This is LB2's "who stands behind the claim", now in the general model.
2. ***Si* and questions are looking for information**, so they keep the ordinary form: *si llueve*, *¿crees que viene?*, *no sé dónde vive*. *Si tuviera* changes because the thing is not the case.

One family needs naming, because the bank is full of it: **labels on information**. *Lo bueno es que*, *menos mal que*, *el problema es que* and *la verdad es que* stick a label on a fact and pass it on. That explains why *Es bueno que vengas* (u28 d4) and *Lo bueno es que vienes* (u28 d7) differ. Those two arrive three days apart with no comment from `g:lo-adjective`, so a learner who has just absorbed "judging takes the subjunctive" will write *lo bueno es que tengamos clientes*.

| Case | News test | Information test |
|---|---|---|
| *Me alegra que vengas*, even if it is news to you | Half | Pass: a feeling |
| *El hecho de que no llamara me preocupa* | Pass | Pass: what I'm worried about |
| *Aunque llueve / llueva / sea mi hermano* | Pass | Pass: passed on, or waved away |
| *Aunque ya lo sabes* / *aunque ya lo sepas* | Predicts subjunctive only | Pass: both exist, with the difference the model gives |
| *el audio que me mandaste* | Fail | Pass: old information is still information |
| *Busco un cuarto que tenga / tiene ventana* | Pass | Pass: no room yet to inform about, or a known room |
| *Cuando llegues* / *Cuando llegué* / *Cuando llego a casa* | Pass, fail, fail | Pass all three |
| *Ojalá venga* | Pass | Pass |
| *Quizás viene / venga* | Half | Pass: hedged information, or not offered |
| *No creo que venga* / *Creo que no viene* | Pass | Pass |
| *Es verdad que es caro, pero…* | Fail | Pass: conceding is still passing it on |
| *La publicidad dice que es grande, pero no es verdad* | Fail | Pass: false information, somebody else's |
| *No sabía que venías* | Fail | Pass, rider 1 |
| *Menos mal que llegaste* | Fail | Pass, labels |
| *Si llueve*, *¿Crees que viene?*, *No sé dónde vive* | Fail | Pass, rider 2 |
| *Dice que vienes / vengas*, *Siento que estás / estés triste*, *Entiendo que llegas / estés molesta* | Pass | Pass |
| *Temo que venga* / *Me temo que no voy a poder* (u59-0359) | Pass | Pass |

**I tried to break this one too. It leaks in four places.**

- *A lo mejor viene* against *Es posible que venga*: same meaning, opposite moods. No meaning-based test separates them, so the course should say "memorise this one". *Puede que*, *es probable que* and *de pronto* go the same way. The frame decides.
- *De ahí que* (u56-0203) needs the news lens. *Por eso es* and *de ahí que sea* say the same thing.
- *Después de que llegara* in news prose, for a real past event. Recognition only.
- The test needs the learner to know which pile a verb is in. *Suponer* against *dudar* still has to be learned (`x:supongo-vs-dudo`). That is true of every model. The gain is that a new verb such as *comprobar* or *lamentar* now has somewhere to go.

Rejected on the way, so nobody re-proposes them:
- "Is it true?" fails on all emotion.
- "Does anyone stand behind it?" fails on all emotion.
- The afterthought test ("He's coming, I think") passes *I'm glad* in English.
- "Pointed at" fails on *el hecho de que*.

Not tested on real learners. It is a proposal, and it should be read with that in mind.

### 1.5 Roll it out in pieces, not at u21

LB1 wants the whole test stated at u21. At that point the learner has one door and no examples. Grow it instead, with the same sentence at each step:

| Where | Add |
|---|---|
| u21 d1 | *Vienes* says what is so. *Quiero que vengas* doesn't: you might not come at all |
| u22 | Hoping is the same |
| u26 to u27 | Not yet: nothing to pass on yet (section 3) |
| u27 d7 | The surprise: *Sé que estás aquí* against *Me alegra que estés aquí* |
| u28 d1 | Rider 1, with *No sabía que venías* set against *No creo que venga* |
| u28 d7 | Labels, in `g:lo-adjective` |
| u29 | *A lo mejor*: memorise |
| u40 | Rider 2, *si llueve* against *si lloviera* |
| After u41 | `g:mood-decision`: the whole map, mixed |
| u52 | The news lens, for real choices |

**One fix at u21 that no report asked for.** `g:subj-wanting` says "The test is one question: is it the same person?… Only when the person changes do you need *que* and the new ending." The render confirms the reinforcement in the feedback: "Two people, so *que* plus the new ending: *ayudes*." That is the test for *que* against the infinitive, stated as if it were the reason for the mood, and *Creo que vienes* has disproved it since u12. LB1-036 caught this at u32. It starts at u21, on the first day of the subjunctive.

---

## 2. Naming: rule on "subjunctive"

**Ruling: yes, from u21 d1, as one word, in the body of the rule and at the end of it.** Not in the hook and not in day titles. This breaks the letter of the voice rule, so it needs the owner's approval as a stated exception.

The conflict is real. `app/tools/burn/brief.md` says: "Plain words, no jargon… A technical term may appear once, in `smallPrint`." The look-up rule says standard names apply to look-up, and that the voice rule applies to lessons. So the literal answer is no, and LB1 and LB2 passed over this too quickly.

Why the exception is earned:

1. **The plain route has been tried and failed.** The rule exists to prevent confusion, and here it has caused it: at least nine names in B1 (LB1) and nine in B2 (LB2). In one A2 lesson the render shows *opposite vowel*, *new ending* and *plain form*. In B1 it shows *wish form* and *plain verb*. "Wish form" is false for most trigger families, as LB1's P1 table shows, and the scripts have to apologise for it with "even when the event is real".
2. **Only the lessons hide it.** The drill engine says "the subjunctive" (`exercises/input.ts:159-169`). The practice pickers say "Present subjunctive" (`ui/session/tenses.ts:24`). Small print says it at u21. The learner meets it anyway, unexplained.
3. **It is the one grammar word adult learners already own.** A human tutor says it. "Copy speaks like a human" supports the word better than it supports "the wish form".
4. **It carries no false claim.** It is a bare name. "Wish form" is a wrong description, and a wrong description is worse than a name the learner has to learn.

Suggested reveal, in voice:

> That shape has a name: the subjunctive. Yes, that one. You've been using it since *siga* and *no te preocupes*.

Conditions:

- **Do not coin "statement form".** *Si llueve* and *¿viene?* are not statements. Say **"the ordinary form"** in lessons and "indicative" once in small print and in look-up.
- **Retire "plain".** It means both indicative and infinitive (LB1 2.2), and the u21 render already uses it for the infinitive. Use **"the dictionary form"** for the infinitive, which `g:si-present` already does.
- **Fix the look-up glosses, which repeat the original error.** `tenses.ts` has "Imperfect subjunctive (if only)" and "Perfect subjunctive (hoping it has happened)". *Quería que vinieras* is not "if only", and *no creo que haya llegado* is not hoping.
- **Keep "the *-ra* form" as a nickname for the shape.** Use "imperfect subjunctive" in look-up and small print.
- **This does not open the door to other terms.** "Event past" and "describing past" are true descriptions and stay.
- **The sweep cannot be blind.** LB1 calls it largely mechanical. It is not, wherever "wish" carries the reason: "real or only wished for" in `g:subj-relative`, "a hope is a wish too" in `g:subj-wishes`, and "The irregular 'wish' forms" and "The 'if only' forms" in the titles.

I reject LA2's recommendation 3 to keep "wish form" as the friendly label.

---

## 3. When does the subjunctive start? The linguistic answer

**Session 194 is right.** Curriculum decision 4 is correct, and I would add stronger reasons than the ones it gives:

- **The forms cannot be delayed.** The usted command (117), the negative command (200), *no te preocupes* and *que te mejores* are subjunctive morphology. Moving to 264 would remove the explanation, not the forms.
- ***Quiero que vengas* has no workaround.** The alternative is the calque the course itself lists as a pitfall: *Quería tú venir*.
- **Wanting asks for no decision.** *Quiero que* never alternates, so the learner gets the form with no choice to make. Moving to 264 would make the first contact *no creo que*, which is a mood choice. That is the wrong way round. I read the PCIC's B1 placement as describing command of the system, not first contact. `app/docs/unit-map.md` gives the placement, and I did not recheck the PCIC itself.

**What should change is the order inside the thread.** The course teaches feeling (260) before *cuando* (307), but for a learner the order of difficulty runs the other way. Feeling is the first door where a true fact takes the subjunctive, and it is the hardest case for any model. "Hasn't happened yet" is the easiest. It sits beside *para que* (256), its indicative partner has been there since 160, and "when I get there I'll call you" is among the most useful sentences an A2 learner lacks (my judgement, no corpus available).

**Proposal.** Add `p:cuando-llegues` at u26 or u27 as a pattern: *cuando llegues*, *cuando puedas*, *apenas llegues*. The full node stays at 307. This is the Curriculum's own pull-forward method, and by its own measure it is unusually cheap: **65 of 120 target rows are already legal at session 258**, and 31 of the blocked rows wait on one pattern, `p:no-hasta`. Compare Move 1 at 5 of 119 and Move 5 at 23 of 121.

Also pull `c:cuando-quieras` forward. It sits at session 404, and no *como quieras* chunk exists. These are first-month phrases, and Move 2 missed them.

---

## 4. The named moves

### 4.1 `p:perfecto-still-live` to A2: keep, place exactly

The move is right. *Siempre he…* has 0 rows before u43, and 20 of its 22 rows are at C1. It also repairs the perfect's decay, since the tense gets a second job while it is still fresh. And it corrects a pitfall the bank already breaks: `g:perfecto-experience` says "*He* is for ever, never and not yet", while u08-0023 says *Este año hemos viajado poco*.

**Neither report noticed the collision.** `g:hace-que-desde` at u23 teaches that "Spanish notices that you still live here, so it uses the plain present". `p:perfecto-still-live` teaches that *he* is for "a stretch of time you are still in". Both describe what is still true, and they use different tenses. Moved to just any A2 slot, the second will appear to contradict the first. The real default is short: **with a length of time or a start date, the present** (*Hace tres meses que vivo aquí*). **With no measure, *he*** (*Siempre he vivido aquí*, *Últimamente he estado cansado*).

So place it on the first Patterns day after session 221, and teach that pair. Its `requires` edge to `g:tense-modal-uses` (506) is an artefact: replace it with `g:hace-que-desde`. 9 of 40 rows are legal at 222, so about 30 new rows. If the optional move of `g:hace-que-desde` to u12 goes ahead, this travels with it. I would upgrade that move from optional, because "how long have you lived here?" is a first-month question.

### 4.2 `g:past-aspect-meaning` at u31: change

**The content is right, and the Curriculum's bundling is better than the Matrix's.** Bounded duration and "meaning change" are one fact. A preterite draws a boundary around a state, either at its start (*supe*, *conocí*, *tuve* meaning got) or around all of it (*estuve dos horas*, *viví cinco años*).

**A list would be false.** The Matrix proposes "Verbs that change meaning in the past". The bank refutes the list reading:

| List says | Bank says |
|---|---|
| *quise* = tried | *Rosa nunca quiso odiar a su hermano* (u31-0922) |
| *no quise* = refused | *Perdón, no quise molestar* = "I didn't mean to bother you" (u29-0479) |
| *tuve* = got | *Rosa nunca tuvo un celular* (u23-0103), *Hernando tuvo un taxi hace treinta años* (u07-0666) |

The node should extend u12's "wraps it up as one finished thing". Then it also explains *Conocí bien a Rosa*, which is how you speak of someone who has died, a line this story is going to want.

**The date is wrong.** *Conocí* = met is in the bank from u04 (u04-0078), *supe* = found out from u06, and a bounded duration from u05 (u05-0947 *Hernando fue taxista cuarenta años*). The learner goes 25 units with no reason given. Worse, u17 teaches the opposite ("A stretch of time… takes the describing past", LA2-001), and that needs fixing regardless.

**The slot does not exist.** `g:narrative-pasts` is not "empty": LB1 rates it the best script in the band. u31 already has three Introduces, so adding this contradicts the report's own decision 1.

**Proposal:**
- One line at u06, when *supe* arrives (LC-027).
- The u17 fix.
- The node at **u26 d3**, in the slot freed by making `g:time-sequence` light, as the report already proposes. It also adds something real to the plateau the report identifies.
- At u31, a return inside `g:narrative-pasts`.

*Hacía X que* is not aspect meaning. Make it a pattern next to `g:pluperfect` at u31. A correction to the report: it says 0 bank rows, and there is one, u31-0897 *Hacía años que nadie pisaba ese cuarto*.

### 4.3 `g:sequence-of-tenses` at u50: change the rule, and fix the script it stands on first

**This is the most urgent finding here.** `x:subj-present-past` says: "Look at the first verb, not the clock. The first verb decides how the second one ends." Its pitfalls add "Keep the two verbs in the same time: both now, or both past", and they mark *Quería que vengas* and *Les pedí que no griten* wrong. The contrast layer's first fix (Curriculum Problem 1) would put this script in front of learners for the first time. The bank refutes it in both directions:

| Direction | Rows | Example |
|---|---|---|
| Present first verb, past subjunctive | At least 11 | *Me preocupa que no llamara* (u53-1812), *¡Es increíble que nadie lo notara!* (u57-0512), *Siento que hubiera tanta gente esperando* (u43-0367), and the hook of `g:mood-choice-fine` itself |
| Past first verb, present subjunctive | 7 at u37 | *Me dijo que lo llame esta tarde* (u37-0365) |

If `g:sequence-of-tenses` is written as "harmony", it adds one more false absolute at B2.

**The true rule is the reverse: look at the clock.** The system is a mapping, and it fits in four lines. Take the sentence as you would say it without the trigger, then find its subjunctive:

| Without the trigger | With it |
|---|---|
| *viene, vendrá* | *venga* |
| *vino, venía, vendría* | *viniera* |
| *ha venido, habrá venido* | *haya venido* |
| *había venido, habría venido* | *hubiera venido* |

*Me pidió que la llamara* is the default. *Me pidió que la llame* is fine while the call is still ahead. This also covers *me alegro de que vinieras* and LC1's *que no llamara* against *que no haya llamado*, and the checker must accept all of them. `g:subj-perfect`'s pitfall on *Me alegra que viniste* needs the same review.

u50 is fine, since it needs 414. Rewrite `x:subj-present-past` **before** contrasts go live.

### 4.4 `g:por-para-3` at u47: change

Of the items the report lists, most do not belong:

- ***Por si* is not a por/para fact.** It is the precaution frame, and its partner is *en caso de que* at u44 (LB2 H2). Put a real node there, with the "would you do it anyway?" test. It is also a mood item: *por si hay algún problema* (u35-0206), *por si llamaban* (u58-0459).
- ***Por* + infinitive** was done at 368, and the agent came with `g:passive-ser` at 364.
- ***Para colmo*** is a chunk.
- **Moves 7 and 13 both claim *estar por / para* at u47.** The report does not notice this.

What a third pass really has: *por mí* against *para mí*, *quedan cosas por hacer*, *voy por pan*, *por poco*, *para ser lunes*, governed *por* (*optar por*, *luchar por*), and LB1's arrow carried through all of it. Its value is **mixed choice under the arrow model**, so it depends on the contrast card. It should be a B2 topic lesson, not an extra Introduce.

### 4.5 `x:se-all-uses` at u45: change

**The date.** Every use is known by 344 (u36). Nothing after that adds one. u45 has no linguistic reason. Use the consolidation week after u41, which the report itself proposes.

**The count.** The report never lists its "seven". Taxonomies of *se* usually include the *se* of *se lo di*, and that one does not belong: it is *le* in disguise, which is how `x:le-se-lo` already presents it. Impersonal and passive *se* read the same way and differ only in agreement and personal *a*. So there are five sorts: to oneself, to each other, nobody in particular, it happened to me, and *se* that changes the verb.

**The exercise.** No labelling. Keep the question `x:se-three-ways` already asks, "who is doing it, and to whom?", and translate both ways. Add *se ayudó a los vecinos* here as a line, not a node.

### 4.6 `x:ser-estar-first` at u05: change

The hole is real. The fix should not be a contrast. At u05 the learner has no alternating pair, and teaching *es X / está X* as a choice invites *está alto* ten units before the model arrives. Use a **sorted note**: *es alto, es simpático* and *está cansado, está enfermo*, in u15's words ("what it's like, how it is"), not "right now", which LA2-020 shows fails on *está casado*. It needs no engine, so it does not have to wait for Problem 1.

One objection to the evidence. VanPatten's order (from memory) is an order of accuracy. The course already inverts it, with location at 13 and the gerund at 69, so it cannot be used to defend keeping the full node at u15. The node should stay at u15 because of conceptual load.

### 4.7 `p:preterite-yo-spelling` at u04: keep, and extend

The claim holds: 0 rows before u11, 212 overall. The cut line is linguistically right, and better than the report says. Group 1 needs only session 3, where `g:sounds-letters` already gives *que, qui, gue, gui* and *z* against *c*. Group 3 needs `g:stem-e-i` at 88. So this is a real dependency, not a convenience.

Two extensions:
- **The same rule is needed at u13 and u21.** `g:commands-usted` is silent, and the rule yields *page* (LA1-028). One named rule ("keep the sound") solves all three.
- **In a text-only app the accent is the only difference between *llegué* and *llegue*, *pagué* and *pague*, *hablé* and *hable*.** `exact.ts` is strict about accents. u04 covers *hablo / habló*, but only 2 of 916 scripts hold both *llegué* and *llegue*. That has to be taught at u13 and u21, so Move 16's orthography strand is a dependency of the subjunctive, not a nice-to-have.

### 4.8 `g:ser-estar-c1` to B2: change

Do not move it as a block. It is three different levels:

| Part | Evidence | Where |
|---|---|---|
| *Es de madera* | 89 rows from u16, 39 of them in A2 | One line at u16. Moving it to u47 leaves it 30 units late |
| *Estar de* + job | 7 rows, all u58, but the *estar de* family has 106 rows from u08 (*de vacaciones*, *de acuerdo*) | A pattern at u19, "Work and studies" |
| *Está por llover* | *Estar por* + verb has 28 rows, all from u57 | With `p:estar-a-punto-de` at u26. Same meaning in Latin America, from memory |
| *No estoy para bromas* | 18 rows from u57 | A chunk, B1 |

**The report's "true C1" example is not C1.** *Está muy alto para su edad* is the core of `g:ser-estar-adjectives` ("how they seem today") and of *la sopa está rica*, and belongs at A2. A real C1 node is LC1's list: *estar que*, *ser de esperar*, *el problema está en que*, the fine edge of participles, plus recognition of Colombian focus *ser* (*yo vivo es en Bogotá*).

**Unresolved.** `p:estar-por` teaches *Estoy por aceptar la oferta* as "half-minded". `g:ser-estar-c1` calls *estar por* the Latin American "about to". In Bogotá, *Estoy por cerrar el café* (u57-1045) may simply mean "about to". A native speaker has to rule before these are merged.

### 4.9 Word-formation strand: change

The need is real, and it is the Matrix's strongest gap. Grammar nodes with drills are the wrong shape. **Spanish derivation is lexically arbitrary:** *llegada, pago, compra, venta, cierre, comienzo, cancelación, pensamiento*. A production drill would teach *llegación*. So the strand should be **recognition only**: light blocks, and new words shown with their family. `lexemes.json` has no family field today, so add one.

| Stage | Block |
|---|---|
| A1 | *-ción* and *-dad* are feminine, alongside the *-ma* fix (LA1 H2) |
| A2 | Cognate mappings (-tion, -ty, -ous, -ly). *-dor*, *-ero*, *-ería*, which are on every Bogotá street |
| B1 | *des-, in-, re-*, with a warning that parts can mislead. *-da, -miento* |
| B2 | *-ecer*, *en-…-ar*, *a-…-ar*. *-azo* and *-ada*, for Colombian texture |

The Matrix's "low" augmentatives row is absorbed here. `g:nominalisation` then has a floor.

### 4.10 Adjective position: keep, and add to the Curriculum list

The report omits this completely. The Matrix is right about the gap and too generous on size. **Apocope is a line, not a node** (*gran* is in the bank at u05: u05-1001 *un gran trabajo*). Give it one sentence at A1 or A2, not 120 rows.

**Position deserves a B2 lesson with one model:** after the noun, the adjective picks out which one; before it, the adjective colours the one you already have. *Una ciudad grande* against *una gran ciudad*, and *pobre hombre*, *viejo amigo* as consequences. That is one contrast rather than two, and it should come before the op-ed reading stage, around u47 to u48. It is what lets a reader parse *la difícil situación*.

---

## 5. The rest of the Curriculum's moves

| # | Move | Ruling | Note |
|---|---|---|---|
| 2 | Early chunks | Keep | Add *cuando quieras*, *cuando puedas*, *como quieras* |
| 3 | Plural *se* licensing | Keep | |
| 4 | `p:le-doubling-basic` at u13 | Keep | Doubling is the normal spoken form with a recipient |
| 5 | `-mente` at u11 | Keep | |
| 6 | `g:evaluative-adverbs` to u47 | Change | Right to leave u60. u47 is arbitrary, since LC1 calls it A2 plus a comma. Fold into the `-mente` block |
| 9 | Merge the three *es en / está en* contrasts and the two perfect contrasts | Keep | The merged perfect must include still-live |
| 9 | Merge `x:commands-tu-usted` and `x:tu-usted` | **Drop** | They share a day and nothing else. One is a verb paradigm, the other the social choice, with "In Colombia *usted* isn't cold". The real fault is that `x:tu-usted` arrives at 118. Bring it forward as a light block |
| 10 | `te pido que` at u22 | Keep | Accept the infinitive too (*te recomiendo dormir*) |
| 16 | Orthography | Keep, reorder | Verb-ending accents first, comma use last. Add *e* and *u* |
| 17 | `x:a-en` | Keep | Make *llegué a Bogotá* the centre, where English says "in" |
| 18 | *venir, andar* + gerund, *tener* + participle | Keep | Recognition weighted |
| 19 | `g:mood-decision` | Keep | Highest value on this list. Home of section 1 |
| 20 | Summary and mediation | Keep | Fits "more translation" |
| Opt | `g:que-vs-cual` to u08 | Drop for now | Fix the *cuál* + noun rule first (LA2-016) |
| Opt | `g:cuyo-relatives` to u48 | Keep | Recognition |
| Opt | `g:hace-que-desde` to u12 | Upgrade | See 4.1 |

---

## 6. The gaps: what matters and what is completeness

Matrix section 2.8 has 27 rows. **Six deserve teaching time, fifteen are a line or a pattern in an existing lesson, and six are completeness.**

**Real learner cost, teach and practise (6):**

| Gap | Why |
|---|---|
| Preterite of state verbs | 4.2 |
| *No sabía que* against *no creo que* | A false rule plus a gap. Rider 1 |
| Word formation | 4.9 |
| Adjective position | 4.10 |
| Verb-subject order: *Llegó un paquete* (u11-0195) | **Raise from medium to high.** Present in the bank from u11, never explained. *Llegar, faltar, pasar, quedar* with a new subject are everywhere, and LC1 calls this the largest gap at the top. It belongs at B1, as "the news goes last" |
| *Estar a punto de*, *acababa de* | Everyday. The rest of the periphrasis row goes to recognition |

**A line or a pattern (15), most valuable first:** gender breakers (cheap, and LA1 is right to rate it high against the Matrix's medium), no backshift when still true (this is a false-rule fix, not a gap), *si* + past indicative, whether-*si*, nosotros imperative (one pattern, after 196), present + past subordinate (inside 4.3), *en* for in, on and at (alongside `x:a-en`), *entre tú y yo*, *e* and *u*, *convertirse en*, pro-predicate *lo*, impersonal *se* + *a* (inside 4.5), unipersonal agreement, copular agreement, dequeísmo and queísmo.

Copular agreement needs a correction: the Matrix says 0 bank rows, and there are at least 3 (*Lo que más me gusta son las arepas de Rosa*, u28-1015).

**Completeness (6):** *sí mismo, consigo*; leísmo (a recognition note at B2, plus Colombian courtesy *le*); *tal como, ambos, no hay quien* (vocabulary); augmentatives as a topic (absorbed by 4.9); pretérito anterior; Colombian focus *ser* and *sumercé* (recognition in the story, no lesson). Add the report's *quienquiera* and *dondequiera* here.

**Two gaps outrank most of that list, and neither is in the Matrix's table:** *por si* (4 rows, wrongly taught as *en caso de que*) and *quisiera* (106 of 120 `g:softening` rows, explained nowhere). The Curriculum has the first, in the wrong lesson. Neither Curriculum nor Matrix has a node for the second.

---

## 7. Limits of this review

- **No outside source was consulted.** The session's web search budget was already used up when I tried, so nothing was retrieved. Everything attributed to Terrell and Hooper, Lunn, VanPatten or the DPD is from memory or from the earlier reports, and should be verified. Section 1.4 also draws, from memory, on Ruiz Campillo's "declaring" model in Spanish language teaching and on Villalta's work on ranked alternatives. No citation in this file has been checked. A later pass with search available should verify them.
- **Frequency statements are judgement.** The bank is generated, so it shows what the course contains, not what Spanish speakers say.
- **Native check needed:** *estar por* in Bogotá, *Quería que vengas* with a pending event, and *a lo mejor* + subjunctive.
- **The information test is untested on learners.**
- **Coverage.** About 35 scripts read, in rule, small print and pitfalls. Two render runs: u21 (2 days) and u28 (1 day). I did not use the dev server or run the gate. Legal counts check target rows only. Regexes are floors, and the 856 *si* rows include whether-*si*.
- I read the five band reports and the Matrix, not the other specialists' reports.

## 8. Recorded disagreements

| With | Issue | My position | State |
|---|---|---|---|
| 01-B1 §6.1, 01-C1 | One news test for all mood | Fails on the indicative side. Use "Is it information?", and keep news for u52 | Resolved by bank evidence, learner trial still needed |
| 01-B1 | State the whole test at u21 | Grow it door by door | Resolved |
| 01-B1 | "Statement form" | "The ordinary form" | Owner decision |
| 01-A2 rec. 3 | Keep "wish form" | Retire it | Owner decision |
| 01-B1, 01-B2 | "Subjunctive" needs only a naming decision | It needs an explicit exception to the voice rule | Owner decision |
| 04 Move 11 | Node at u31, in an "empty" slot | u26. The slot is not empty | Resolved |
| Matrix P7 | "Verbs that change meaning" list | False against the bank. One boundary idea | Resolved |
| 04 Move 12 | A top for the mood thread | Agreed, but the existing contrast script is backwards | Resolved |
| 04 Move 13 | *Por si* in por/para | Belongs with *en caso de que* at u44 | Resolved |
| 04 Moves 7, 13 | Both claim *estar por/para* | The report overlooks this. Split | Resolved |
| 04 Move 7 | C1 perception example | It is A2 | Resolved |
| 04 Move 9 | Merge *tú/usted* contrasts | Keep apart | Resolved |
| 04 Move 14 | Seven *se*'s at u45 | Five, after u41 | Resolved |
| 04 Move 8 | Contrast node at u05 | Sorted note | Resolved |
| 04 Problem 10 | VanPatten order as a defence | The course already inverts it | Evidence from memory, unverified |
| 04 decision 4 | Keep 194 with no thread change | Keep 194, add `p:cuando-llegues` | Resolved |
| Matrix | Verb-subject order medium | High, and at B1 not C1 | Owner can overrule on priority |
| Matrix P8 | Two nodes at 120 rows each | Apocope is a line | Resolved |
| Curriculum and Matrix | Word formation as grammar nodes | Recognition only | Resolved |
| p:estar-por, g:ser-estar-c1 | What *estar por* means in Bogotá | Needs a native speaker | Unresolved |
