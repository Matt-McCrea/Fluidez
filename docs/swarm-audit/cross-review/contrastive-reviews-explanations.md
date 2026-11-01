# Cross-review: the contrastive specialist challenges the explanations

Reviewer: English-to-Spanish contrastive linguistics. Date: 2026-11-01. Branch: rebuild.

Read for this review: `02-contrastive.md`, the five `01-linguistics-*` reports, the coverage matrix, every claim and verdict touching the eight topics, the real scripts, `hints.ts`, `match.ts`, `canon.ts`, `wordhint.ts`, and F2 in `06-innovation.md`.

New measurements, using the real bank and the real matcher. Scripts are in the scratchpad under `cr/`.

| Measurement | Result |
|---|---|
| Past-tense rows, state-type verb, other aspect is also correct with the same English | 23 of 56, hand judged |
| Past-tense rows, action verb, same question | 4 of 36, hand judged |
| Subjunctive rows, indicative is also correct with the same English | 10 of 57, hand judged, all in three frames |
| Correct alternatives sent through the real matcher | 33 of 33 rejected, each with a hint |

## 1. Bottom line

1. **Most of the proposed models are good descriptions and poor tools.** A model has to work while someone is typing a sentence. So each explanation below ends in a test that takes English as its input.
2. **"Snapshot" brings back the rule it was meant to kill.** A snapshot is a moment. *Está muerto* is not a moment. The stronger account is comparison: *es* compares with others, *está* compares a thing with itself.
3. **"Told as news" fails in both directions on real bank rows.** Several specialists converged on it, and that agreement should not count as proof. The direction is right. The test is wrong.
4. **The arrow is half a model.** It works for *para*. *Por* is not a second image. It is what is left over, and saying so gives a one-branch test.
5. **The *se* family has a missing member.** The job "it just happened" (*la puerta se cerró*) has no grammar node, and it is the bridge to *se me cayó*.
6. **The interference layer as proposed would do harm in its largest rule.** About 1 in 5 past-tense rows allows the other aspect, and about 4 in 10 with state verbs. A confident `aspect` hint is false in those cases. The layer needs tiers, and the accept work must ship first.

## 2. Keep, change or drop

### Ser and estar

| Proposal | Verdict | Why |
|---|---|---|
| Portrait or snapshot (x:ser-estar-adj small print, LC-034, LA2-020; 02 section 4 says preserve it) | **Change** | Keep the refusal of permanent and temporary. Drop the image. *Hernando estuvo casado treinta años* (u15-0717) is neither a snapshot nor "right now". A learner composing "he's dead" asks "is that a snapshot?" and gets nothing. |
| LC-034, first sentence: a state need not be temporary | Keep | True, and it is the sentence the learner needs. |
| LA2-020 verifier: "está casado still describes how they are right now" | **Disagree** | u15-0717 is thirty years in the past. The verifier is right that the claim's fix adds little. It is wrong that "right now" holds. |
| LA1-006: *está* "how they are right now" as the seed at u02 | Change | Say "how they are". The first wording is the one that sticks, and it matches *¿Cómo es?* and *¿Cómo estás?*, both known by then. |
| LA1-014, LA1-042, LA2-039 | Keep | Correct and cheap. |
| "Takes place" test for events (x:ser-estar-place) | Keep | Best test in the strand. It also answers the event half of CX-044. |
| Time words as cues in x:ser-estar-adj ("*hoy*, *ahora* and *ya* usually point to *está*") | Change | Keep as a clue only. |
| LC1-058: rebuild g:ser-estar-c1 | Keep | The comparison model gives it a spine: *estás muy joven*, *está flaco*. |

### Preterite and imperfect

| Proposal | Verdict | Why |
|---|---|---|
| "Background you stand inside" (LA2-001 claim, P1) | **Drop that phrase** | Nobody stands inside a background. The picture is mixed, and the verifier was right to replace it. |
| "Wraps up as one finished thing" | Keep | It is the only phrase that defeats the length error, and it explains *Hernando fue taxista cuarenta años*. |
| LA2-001 to LA2-003 as amended ("sets the scene", "isn't about length") | Keep, add a test | Correct, and still no procedure. A scene also needs defining to include habit, or *Rosa cerraba a las seis* has no home. |
| "Try *and then*" (g:pret-vs-imperfect) | Keep as step 2 | It fails alone. "And then I went to the beach every year" sounds fine and gives the wrong form. Habit must be caught first. |
| "Time words help" (x:pret-imp) | **Drop** | Time words such as *ayer* and *anoche* sit with the imperfect in 28 regex hits: *La torta que compré ayer estaba rica* (u14-0004). *Siempre* takes the preterite: u58-1018. 02 said "invites a word-cue strategy". I would go further and delete the paragraph. |
| LA2-010, LA2-011 on *mientras* as amended | Keep | The background and event pattern is what learners need. |
| CX-034, preterite meaning shift | Keep at u12 | It follows from "wrapped up": the event of knowing is finding out. |
| Labels | **Change** | Five names for two tenses: plain past (27 scripts), describing past (7), event past (4), past habit (2), scene past (1). "Plain past" collides with "plain verb". "Describing" collides with *Fue un desastre* (LA1-013). Use event past and scene past, with the standard names in small print. Owner call. |

### Indicative and subjunctive

| Proposal | Verdict | Why |
|---|---|---|
| One name, "the subjunctive" (CX-043, LB1 6.1, LB2 M10, LC1 P19) | Keep | Unanimous apart from A2. |
| Keep "wish form" (LA2 recommendation 3) | **Drop** | A2 stands alone, and LB1 P1 settles it. |
| "Told as news?" (LB1 6.1, LC1-013, "News or not news" at u52, CX 6.1 gloss) | **Change** | See below. |
| "The everyday verb tells. The other verb doesn't." (CX 6.1) | Keep the sentence | Drop the gloss "because everyone already knows it", which is false. |
| "The form for what you are not asserting as fact" (LB2) | Change | Right idea. "Asserting" is the wrong register, and reacting needs its own line. |
| LB1-036 as amended, CX-002 confirmed test | Keep | CX-002 ("does the opening say whether it's true, or what you make of it?") is what the catch below rests on. |
| "Statement form" for the indicative (LB1) | Change | "Normal verb" is already in 23 scripts. "Plain verb" (73 scripts) must go, because it also means infinitive. |

**Why "news" fails.** It predicts two wrong answers from real sentences.

| Sentence | News? | Test says | Spanish has |
|---|---|---|---|
| *Está claro que el café es mucho más que un negocio* (u29-0429) | No, it's obvious | subjunctive | indicative |
| *Ya sé que lo sientes* (u42-0045) | No, the listener said so | subjunctive | indicative |
| *Cuando llegó la abogada, empezamos* (x:cuando-ind-subj) | No, it's background | subjunctive | indicative |
| *Es una pena que cierren el parque*, said to someone who hasn't heard | Yes | indicative | subjunctive |

The last row is the English speaker's commonest case: the learner thinks "I'm telling them", so types *cierran*. No single test covers reactions and time clauses together. Assertion accounts leak on presupposed time clauses. Realis accounts leak on reactions. So I state one model and one named catch. Telling learners the catch is more honest than a test that quietly fails.

### Por and para

| Proposal | Verdict | Why |
|---|---|---|
| Arrow for *para* (g:por-para-1) | Keep | Works at every band, including *para mí* and *para ser lunes* if described as aimed. |
| "*Por* looks at what's along the way, or behind it" | Change | Fine as description. It gives no decision procedure. Say *para* is the target and *por* is the rest. |
| LB1 6.2 extended images ("spread along the day", "the route the talk takes") | Change | Pretty, but these are images to memorise per use, which is the list again. |
| Closing list in g:por-para-2 | Drop | LB1 is right. |
| CX-038 as amended ("Not *para*") | **Change** | False absolute. *Quiero hacer una reserva para dos noches* (u18-0367), *habitación para dos noches* (u42-0551), *queda para un día* (u36-0186). The same English gives *por dos noches* at u18-0461. Replacement: "*how long*: *trabajé ahí por dos años*, or no word at all: *estudié dos horas*. For a stretch you are booking or planning, *para* works too." |
| LB1-009, LA2-053, CX-039 | Keep | CX-039 is also a trap line in the block below. |
| "If because of, through or per fits, it's *por*" (x:por-para) | Keep, extend | Good English swap. Add *in exchange for* and *during*. |

### Gustar

| Proposal | Verdict | Why |
|---|---|---|
| "Coffee pleases me" | Keep | Sound at every band. "Pleases" is stiff English, so add *bothers*, which has the same structure and is everyday. |
| LA1-003 as amended, *me gusta* with someone you know | Keep | *Me gustas* and *te gusto* appear in 0 bank rows, so the forms that prove the model are never practised. |
| P27, "do not strip a bare subject pronoun" when the verb is in EXPERIENCER | **Change** | See section 5, rule 4. Correct Spanish would fail: *Él no me cae bien* (u16-0921), *Tú te quedas aquí* (u59-0231). |

### Object pronouns

| Proposal | Verdict | Why |
|---|---|---|
| CX-012 as amended ("if something passes to the person") | **Change** | Nothing passes to the person in *Le robaron el celular* (u34-0095) or *Le lavé el carro a mi papá* (u34-t-possessive-dative-0026). The better test is "is there a second thing?", given in section 4. |
| LA1-009, LA1-030, LA1-010, LA1-011 | Keep | |
| x:lo-le pitfall marks *Le vi ayer* wrong | **Change** | It conflicts with the standing decision that Peninsular forms are accepted as answers. It should pass with a note. Owner to confirm that leísmo counts. |

### The se family

| Proposal | Verdict | Why |
|---|---|---|
| Consolidated *se* lesson at B2 (LB2 section 5) | **Change** | Too late. Put it at u36, straight after g:passive-se, when every member is known. |
| x:se-three-ways | Change | Add the fourth job, "it just happened". Grep finds that idea only in pattern scripts such as p:agotarse, and no contrast or grammar rule states it. *Se fue la luz* is there from u12, and *se acabó*, *se rompió* and similar run to 192 regex hits. |
| LA2-059 (refuted), LA2-060 as amended | Agree with the verifier | |
| LB1-046, LB1-047, LB1-057, LA1-031, LA1-033 to LA1-036 | Keep | LA1-033 to LA1-036 are the same missing job showing up as bank errors. |

### The -ing trap

| Proposal | Verdict | Why |
|---|---|---|
| CX-013 as amended ("it or that" swap) | Keep at u09, **patch at u26** | Works on the u09 script. Breaks on *by reading* ("by it" passes, and the answer is *leyendo*) and *kept talking* ("kept it" passes, and the answer is *siguió hablando*). |
| CX-014 as amended | Keep | |
| LB2-063, never use the gerund to describe a noun | Change | *Vi a Hernando saliendo del banco* (u26-0530) sits in the bank, and it looks like the banned shape. Add: "After *see* and *hear*, it's fine." |
| LA1-007, LA1-008 | Keep | |

## 3. The six explanations

Markup follows the scripts: asterisks mark Spanish. The gate forbids em dashes, en dashes and spaced hyphens. Suffix hyphens such as *-ando* are allowed and the course uses them. Each word was checked against the first unit where it appears in the bank.

### 3.1 Ser and estar

**Goes in:** g:ser-estar-adjectives (u15 d1), reused in x:ser-estar-adj (u15 d2). **Learner has:** both verbs, place, events, *-ando*, *tengo hambre*, the two pasts.

> **Es or está?**
>
> English has one *is*. Spanish has two, and the choice comes down to one question: compared with what?
>
> *Es* compares someone or something with others. *Está* compares it with itself.
>
> *Don Hernando es tranquilo.* Don Hernando is calm. Calmer than most people.
> *Hoy don Hernando está nervioso.* Today don Hernando is nervous. More than usual.
>
> The same word can mean two things:
> *Tomás es aburrido.* Tomás is boring.
> *Tomás está aburrido.* Tomás is bored.
> *Vale es lista.* Vale is clever.
> *Vale está lista.* Vale is ready.
> *Mariana es delgada.* Mariana is slim.
> *Mariana está delgada.* Mariana has got slim.
>
> **The test.** Ask: than others, or than usual?
> Tall? Taller than others: *es alto*.
> Tired? More tired than usual: *está cansado*.
> If neither fits, ask: did something happen to get it this way? Married, dead, closed, broken, full, ready: yes, so *está*. (You'll also hear *es casado*, and that's fine too.)
>
> Three things skip the test.
> A noun after the verb is always *es*: *Es médica. Es un hombre tranquilo.*
> A thing or a person in a place is *está*: *El café está en la 11.* An event takes place, so it's *es*: *La fiesta es en el café.*
> An *-ando* verb goes with *está*: *Está lloviendo.*
>
> **The trap.** It's *I'm*. You learned *soy* first, so your fingers type it. *Soy aburrido* tells people you're dull. *Soy cansado* says you wear people out. And some *I'm* is neither verb: *Tengo hambre*, *Tengo treinta años*.
>
> If anyone taught you permanent and temporary, drop it now. *Está muerto* is for ever. *Es joven* won't last.

**Does it hold a band later?**

| Sentence | Result |
|---|---|
| *Hernando estuvo casado treinta años* (u15-0717) | Something happened: *está*. "Right now" and "snapshot" both fail here. |
| *Mis padres están separados desde hace años* (u21-0350) | Same. |
| *La sopa es muy buena, pero hoy está fría* (u33-1329) | Both halves pass. |
| *La música estaba muy alta* (u06-0030) | Than usual. |
| *Estás muy joven para pensar en eso* (u47-0632) | Compared with yourself. This is the C1 use, and the model predicts it. |
| *Está flaco como un palo* (u48-0762) | Than he was. |
| *Fue cerrado* against *estaba cerrado* (x:ser-estar-participle, u38) | The happening is *fue*. The state it left is *estaba*. The test extends cleanly. |
| *Está claro que* (u29-0429), *está de moda* | **Leak.** Fixed phrases. |
| *Es feliz* and *está feliz* | **Both right.** The test explains the difference, and the checker must accept both. |

### 3.2 Preterite and imperfect

**Goes in:** g:pret-vs-imperfect (u12 d1), x:pret-imp (u12 d2), restated in g:cuando-indicative (u17 d7). **Learner has:** both pasts, habits (u11), *era*, *estaba*, *tenía*, *había*.

> **Two pasts**
>
> English has one past: *was*, *lived*, *went*. Spanish has two, and your English won't tell you which one you need. It depends on how you're telling it.
>
> The event past says it happened: start to finish, done, one item in the story.
> The scene past puts you in the middle: it was going on, or that's how life was back then, with no end in view.
>
> *Llovía cuando llegué.* It was raining when I arrived.
> *Llovió toda la noche.* It rained all night.
> *Rosa cerraba el café a las seis.* Rosa used to close the café at six.
> *Anoche Tomás cerró el café a las diez.* Last night Tomás closed the café at ten.
> *Comía a las dos.* I used to eat at two.
> *Comí a las dos.* I ate at two.
>
> It isn't about how long it lasted. Forty years can be one item: *Hernando fue taxista cuarenta años.* One second can be the scene: *Yo salía cuando sonó el teléfono.*
>
> **The test.** First, try *was doing* or *used to do* in your English. If it still says what you mean, use the scene past. It was raining: yes, *llovía*. I went to the beach every year: I used to go, yes, *iba*.
>
> If not, try *and then* in front. And then the phone rang works: event past, *sonó*. And then it was late sounds wrong: scene past, *era tarde*.
>
> A length or a count wraps it up, so it's the event past: *toda la noche*, *diez años*, *tres veces*.
>
> **The traps.** Time words don't decide. *Ayer* goes with both: *Ayer fui al banco. Ayer llovía cuando salí.* Length doesn't decide. And *used to* is not *usar*: the ending does that job, *vivía*.
>
> Sometimes both are right, and you're only choosing how to tell it: *¿Cómo fue tu niñez?* and *¿Cómo era tu niñez?*
>
> One more thing. The event past of a state is the moment it started. *Sabía la verdad*: I knew the truth. *Supe la verdad*: I found out the truth. *Conocía a Vale*: I knew Vale. *Conocí a Vale*: I met Vale.

Add at u20, when *-ría* exists: "*Would* for a past habit isn't *-ría*: *Íbamos todos los domingos*."

**Does it hold?**

| Sentence | Result |
|---|---|
| *Hernando fue taxista durante cuarenta años* (u21-0386) | Length wraps it up. |
| *Mi hijo lloró toda la noche* (u25-0292) | Same. Step 1 alone would pass "was crying all night", which is why the length line exists. |
| *Mientras esperábamos, tomamos un tinto* (u17-t-cuando-indicative-0024) | Was doing, then *and then*. |
| *Anoche estaba muy cansado y dormí diez horas* (u15-0236) | "And then I was tired" is odd: scene. Correct despite *anoche*. |
| *La torta que compré ayer estaba rica* (u14-0004) | Scene. A time-word rule fails here. |
| *Iba a llamarte* | Was going to: scene. |
| *Mariana siempre fue celosa de sus fuentes* (u58-1018) | **Leak.** The test says scene and the bank has event: a closed run summed up. Harmless, because both are right. |
| *Quería pedirle* (x:imperfecto-tres-usos) | **Leak.** Polite use, taught as a phrase. |

### 3.3 Indicative and subjunctive

**Goes in two places.** The seed goes in g:subj-wanting (u21 d1). The full text goes in a new day after x:relative-ind-subj (u33 d2), placed by hand. By u33 the learner has all five families below. Add *Dice que vienes* and *Dice que vengas* at u37, and *aunque* at u44.

Seed, u21:

> This new form is called the subjunctive. *Quiero que vengas* doesn't say you're coming. It holds up the idea of you coming, and says I want it. That's the subjunctive's job: holding an idea up without saying it's so. You'll meet it after other openings soon, and it will always be doing this job.

Full, u33:

> **One idea behind the subjunctive**
>
> You've now met the subjunctive after a dozen openings. It's one idea.
>
> The normal verb says something is so. The subjunctive holds the idea up without saying it's so: you want it, you doubt it, you deny it, it hasn't happened yet, or you can't point to it.
>
> *Creo que Vale viene.* I think Vale is coming.
> *No creo que Vale venga.* I don't think Vale is coming.
>
> *Cuando Vale llegó, comimos.* When Vale arrived, we ate.
> *Cuando Vale llegue, comemos.* When Vale arrives, we'll eat.
>
> *Busco el local que tiene cocina.* I'm looking for the place that has a kitchen.
> *Busco un local que tenga cocina.* I'm looking for a place that has a kitchen.
>
> **The test.** Cover the opening with your hand and read what's left as a plain sentence. Are you saying that's so? Normal verb. If you wouldn't say it flat out, subjunctive.
>
> Cover *Creo que*: Vale is coming. Yes, that's my claim. *Viene.*
> Cover *No creo que*: Vale is coming. No. *Venga.*
> Cover *Quiero que*: you're coming. No, I only want it. *Vengas.*
> Cover *Cuando*: Vale arrives. Not yet. *Llegue.*
>
> **One catch.** An opening that reacts or judges takes the subjunctive even when the rest is true. *Me alegra que estés aquí. Es una pena que cierren el parque.* You are here, and they are closing it. But that's not what you're telling anyone. You're telling them how you feel about it.
>
> **The trap.** English almost never changes its verb here, so your English gives no warning. *When you arrive* looks like a plain present and pulls you to *cuando llegas*. *I want you to come* pulls you to *quiero tú venir*. Spanish needs *que* and the subjunctive.
>
> With practice you won't run the test. You'll know the openings.
> Wanting: *quiero que*, *espero que*, *ojalá*, *te pido que*.
> Doubting and denying: *dudo que*, *no creo que*, *es posible que*.
> Reacting and judging: *me alegra que*, *me molesta que*, *es importante que*, *es una pena que*.
> Not yet: *cuando*, *hasta que*, *antes de que*, *para que*.
> Can't point to it: *busco un...que*, *no hay nadie que*.

Small print: "Teachers call the normal verb the indicative. About something already over, Colombians often keep the normal verb after *qué bueno que*: *¡Qué bueno que viniste!*"

**Does it hold?**

| Sentence | Result |
|---|---|
| *Está claro que el café es mucho más que un negocio* (u29-0429) | Yes: normal verb. "News" fails here. |
| *Ya sé que lo sientes* (u42-0045) | Yes: normal verb. "News" fails here. |
| *Busco un apartamento que tenga balcón* (g:subj-relative) | "It has a balcony", but which one? Subjunctive. |
| *No dudo que tengas razón, pero...* (LB1-001) | You're granting, not saying: subjunctive. The model predicts both moods here. |
| *No vi que estabas ahí* and *No vi que estuvieras ahí* (LB2-010, NGLE 25.7 as cited by the verifier) | The test generates both meanings. |
| *Aunque llueve* and *aunque llueva* (u44) | Both pass. |
| *Siento que estás triste* and *Siento que estés triste* | Sense it, or react to it. |
| *Antes de que se fuese, Vale probó el pan* (u51-0311) | **Leak.** She did leave. Add at u41: "*Antes de que* always holds it up: at that point in the story, it hadn't happened yet." |
| *El hecho de que hayas hablado con la prensa* (u53-0422) | **Leak** at C1. A known fact held up for discussion. It is the same catch, extended. |
| *¡Qué bueno que viniste!* (u12-0204, u27-0203 and three more) | **Leak.** Real Colombian usage, covered by the small print. |

### 3.4 Por and para

**Goes in:** x:por-para (u18 d2), with the first paragraph replacing the end of g:por-para-1. **Learner has:** *para* for people and purpose, *gracias por*, *por la mañana*, *por eso*.

> **Por or para?**
>
> English says *for* for nearly everything. Spanish asks one question: is this the target?
>
> *Para* points at a target: where it's heading, who gets it, what it's meant for, when it's due. *Por* is everything else: the reason, the route, the swap, the rate, the stretch of time.
>
> *Lo hice para ti.* I made it for you. You get it.
> *Lo hice por ti.* I did it for you. You're the reason.
> *Salimos para Medellín.* We're leaving for Medellín. That's where we're heading.
> *Pasamos por Medellín.* We went through Medellín.
> *Trabajo para Vale.* I work for Vale. She's the boss.
> *Trabajé por Vale.* I worked for Vale. In her place.
> *Estudio para el examen.* I'm studying for the exam.
> *No dormí por el examen.* I didn't sleep because of the exam.
>
> **The test.** Can you draw an arrow from the action to this word, ending there? Heading to it, landing on it, due by it, done to reach it: *para*.
> If not, swap *for* in your English. *Because of*, *through*, *in exchange for*, *per*, *during*: if one fits, *por*.
>
> **The trap.** English *for* and *to* fool you in four places.
> Some verbs already have *for* inside. *Busco a Vale.* I'm looking for Vale. *Espero el bus.* I'm waiting for the bus. *Pedí la cuenta.* I asked for the bill. No *por*, no *para*.
> How long often needs no word. *Estudié dos horas.* I studied for two hours.
> After *ir* and *venir*, *to* is usually *a*: *Fui al mercado a comprar fruta.* I went to the market to buy fruit.
> *By bus* is *en bus*: *Fui en bus.*
>
> One surprise: *voy por* means I'm going to get. *Voy por mi maleta.* And some phrases you just learn whole: *por favor*, *por fin*, *para siempre*.

Add at u23: "Still going? *Por* can't say that. *Hace dos años que vivo aquí.*" Add at u35: "*Para* can aim an opinion or a yardstick: *Para mí, es grave. Para ser lunes, hay mucha gente.*" Add: "*Por* is also the way through: *por teléfono*."

**Does it hold?**

| Sentence | Result |
|---|---|
| *Trabajé por Vale el sábado porque ella estaba enferma* (u18-0078) | Swap: in her place. |
| *Fue por mi retraso* (u18-0484) | Because of. |
| *Lo tomas tres veces por día* (g:por-para-2) | Per. |
| *Lo cambié por otro* (g:por-para-2) | In exchange for. |
| *Salimos temprano para no llegar tarde* (x:por-inf-para-inf) | Target. |
| *Reservé el cuarto por dos noches* (u18-0461), *una reserva para dos noches* (u18-0367) | **Both right.** Checker must accept both. |
| *Voy por mi maleta* (u18-0424) | **Leak**, covered by the surprise line. |
| *Voto por la biblioteca* (u28-0228) | **Leak.** Looks like a target. Teach as what moves you: the reason. |
| *Mandamos las maletas por bus* (u18-0455) | **Leak** against *en bus*. Luggage sent, not a person riding. Minor. |

### 3.5 Gustar-type verbs

**Goes in:** g:gustar-full (u10 d1). For g:gustar-basic (u03 d1), cut the *le*, *nos*, *les* lines and the *a Vale* paragraph.

> **Gustar doesn't mean like**
>
> *Gustar* means please. It works like *bother* in English: the noise bothers me, the noises bother me. The thing does it, and you're on the receiving end.
>
> *Me gusta el tinto.* I like black coffee. Black coffee pleases me.
> *Me gustan los parques.* I like parks. Parks please me.
> *¿Te gusta Bogotá?* Do you like Bogotá? Does Bogotá please you?
> *No nos gusta el horario.* We don't like the schedule.
> *Le gustan las arepas.* She likes arepas. Arepas please her.
> *Me gustas.* I like you. You please me.
>
> **The test.** Say your sentence with *pleases*. I like parks becomes parks please me.
> What does the pleasing? The verb follows that: one thing, *gusta*; several, *gustan*.
> Who gets pleased? That's your little word: *me*, *te*, *le*, *nos*, *les*.
>
> **The trap.** English starts with you, so you'll want to start with *yo*. Don't. *Yo gusto el café* says you're the pleasant one.
> The thing comes after the verb, so it looks like the thing you did something to. It isn't. It's in charge of the verb: *Me gustan los parques*, not *Me gusta los parques*.
> It also keeps its *el* or *la*: *Me gusta el café*.
>
> To name the person, add *a* and keep the little word: *A Vale le gusta el tinto. A mí me gusta.* Never *Vale gusta*, *A Vale gusta* or *Yo me gusta*.
>
> *Encantar* and *interesar* work the same way.
>
> One warning: about someone you know, *me gustas* and *me gusta Tomás* usually mean you're attracted to them. For things, places and activities it's always safe.

**Does it hold?**

| Sentence | Result |
|---|---|
| *Me duele la cabeza* | The head hurts me. |
| *Me faltan dos días* | Two days are missing. Plural follows. |
| *Me parecen caros* (g:parecer-quedar) | They seem expensive. |
| *Mariana me cae bien* (g:parecer-quedar) | Mariana does it. |
| *Me molesta que griten* | It bothers me that they shout. One *it*, so singular, though *griten* is plural. |
| *Se me olvidaron las llaves* | Same logic: the verb follows the keys. |
| *Me gusta nadar y leer* | Activities stay singular. Already taught. |
| *Me gustan la música y el cine* (u03-0043) | **Both right.** Natives also say *me gusta*. The checker now rejects it. |
| *Te extraño* (u31-0586), *Te quiero* | **Leak**, by design. English *miss* and *love* look gustar-like, and these are normal verbs. Note at u31. |

### 3.6 The se family

**Goes in:** a new x:se-family right after g:passive-se (u36 d1), placed by hand. **Learner has:** every member below. For u22, replace the opening of x:se-three-ways with the first two paragraphs, cut to the jobs known then, and add *Se fue la luz*.

> **One idea behind se**
>
> *Se* seems to have a dozen jobs. Most of them are one job.
>
> A normal sentence has someone doing something to something else: *Vale cerró la puerta.* *Se* says that isn't what's going on here. Nobody outside is doing it, or nobody is saying who.
>
> Back on yourself: *Vale se levantó.* Vale got up.
> To each other: *Tomás y Vale se conocieron.* Tomás and Vale met.
> It just happened: *La puerta se cerró.* The door closed. *Se acabó el azúcar.* The sugar ran out.
> It just happened, to me: *Se me cayó el celular.* I dropped my phone.
> Done, and we're not saying who: *Se vendieron todos los almuerzos.* All the lunches were sold. *Aquí se come bien.* You eat well here.
>
> **The test.** Is someone doing this to something else, and do you want to say who? Yes: a normal verb. *Vale vendió los almuerzos. Tiré el vaso.* No: *se*.
>
> Then find the thing, because the verb matches it. *Se vendió la casa. Se vendieron las casas. Se me cayeron las llaves.*
>
> **The trap.** English has no word like this, so nothing in your English will remind you. It says *myself*, *each other*, *was sold*, *people*, *you*, or nothing at all. Watch for these.
> *Get*: get up, get married, get lost, get bored. Nearly always *se*: *me levanté*, *se casó*, *me perdí*, *me aburrí*.
> *Was sold*: copying it gives *fue vendida*. In everyday Spanish, *se vendió*.
> *Dropped*, *broke*, *forgot*: if you didn't mean to, *se me*.
> A door that *opened* or a glass that *broke*, with nobody doing it: *se abrió*, *se rompió*. *La puerta abrió* is missing its *se*.
> A bank or a shop opens and closes on purpose, so it takes no *se*: *El banco cerró a las cinco.*
>
> Two that don't belong.
> Same verb, new meaning. Learn these as separate verbs: *ir*, go, and *irse*, leave. *Dormir*, sleep, and *dormirse*, fall asleep. *Parecer*, seem, and *parecerse a*, look like.
> *Se lo di.* That *se* is *le* in disguise, because Spanish won't say *le lo*.

**Does it hold?**

| Sentence | Result |
|---|---|
| *Se dice que*, *se cree que* (g:impersonal-register) | Not saying who. |
| *Vale se quemó las manos* (u48-1076) | Back on herself. |
| *Se me cumplió el sueño* (p:cumplirse-un-sueno) | It just happened, to me. |
| *El banco cerró hace diez minutos* (u07-0279) | Covered by the bank line. |
| *Se invitó a todos los asociados* (u55-0041) | **Needs a line at B2:** with *a* and people, the verb stays singular. |
| *Simón se comió las margaritas* (u53-0315) | **Leak.** This *se* means all of it. The normal verb is also right. Taught at C1. |
| *Olvidé las llaves*, *Me olvidé de las llaves* | **Both right.** The test prefers *se me*. The checker must pass all three. |

## 4. Repaired tests for the other two topics

**Object pronouns, x:lo-le (u13 d8).** Replaces CX-012.

> The test: is there a second thing? Something that moves or gets done: the keys, the truth, a question, money, a letter. Even if you don't say it. If there is, the person gets *le*: *Le di las llaves. Le pregunté la hora. Le escribí.* If the action lands straight on the person with nothing else involved, it's *lo* or *la*: *La vi. La llamé. La esperé.*

It handles *wait for* without a special note, and *le robaron el celular* at u34. It needs one known leak: *ayudar* takes both in this dialect (*Le ayudo* u18-0577, *lo ayudamos* u18-0215).

**The -ing trap, g:gerund-ways (u26 d1).** Add to CX-013.

> One catch with the "it" test. *By doing* is different: *Aprendí leyendo.* So is *keep doing*: *Siguió hablando.* So is *spend time doing*: *Pasé la tarde cocinando.* These describe how the time went, so they take *-ando*.

## 5. The interference rule layer

### What must change first

**1. Accepts ship before named rules.** A rule keyed on "the model says X, the input says Y" turns a false rejection into a confident false diagnosis. I sent 33 correct answers through the real matcher, and all 33 failed with a hint:

- 8 aspect swaps from real rows: *¿Cómo era tu niñez?* (u11-0643), *Ayer estaba muy ocupada* (u15-0237), *Claro, fue en diciembre* (u22-1399).
- 4 mood swaps: *Hernando no dijo que Rosa tenía deudas* (u46-0178), *¡Qué bueno que tienes tiempo!* (u27-0215).
- 21 natural alternatives, such as *El café queda en la 11*, *Hablamos sobre el contrato*, *Pagué por el almuerzo*, *Estoy apurado*, *Entró a la casa*, *Vi a Yesid saliendo por la puerta*. Two of the 21 are arguable as model answers: *Hoy está frío* and *La fiesta está en mi casa*.

P28's six rewrites cover almost none of these. A second both-right list is needed.

**2. Four outcomes, not one.**

| Tier | Behaviour | When |
|---|---|---|
| **Assert** | Fail, name the cause | The error is certain under the guards. |
| **Ask** | Show the model beside the answer, ask a question that stays true if the learner was right, no penalty | The answer may be correct. Same idea as 03's "Can't confirm: compare". |
| **Note** | Pass, with one line | Correct Spanish with a register or dialect point. |
| **Silent** | Generic location hint | The detector cannot tell. |

**3. English locks.** The English often decides what the Spanish alone cannot. *Was doing* and *used to* lock the imperfect. *Suddenly*, *for ten years*, *three times*, *found out* and *met* lock the preterite. Only a locked case may Assert.

**4. Weak spots count Assert only.** "You keep mixing the two pasts" built on Ask hits would accuse a learner of writing good Spanish. This applies to 02's "You keep..." and to the *Mis trampas* fingerprint in 06.

**5. The pitfall dictionary waits.** Exact-match firing inherits content errors, and verified claims show pitfalls that strike out correct Spanish: *Mariana dijo que va a llamar*, *Había un accidente*, *No dijo que era urgente*. Fix those, then scope by node, as 06 found necessary.

**6. Hint text must survive the rule being wrong.** On the one retry, a false hint makes the learner change a right word, then reveals the model. That is why a wrong diagnosis is worse than none. "Never that form after *si*" is safe. "That word changes the next verb" is not, and it also teaches word-spotting.

**7. No model, no rule.** Free writing has no expected sentence. Only input-side rules can run there: `strand`, `used-to`, `muy-noun`, *yo gusto*, *después de* + gerund. Gap cards need the same guards, because `wordHint` sees one word.

### The rules, in priority order

Priority is frequency times precision times teaching value. Opportunity rates are measured on the 72,693 bank rows. The chance of the error is **my judgement**, not learner data. Fires are per 1,000 typed sentences, for A1 and A2, then B1, then B2 and C1. Treat them as a ranking. Measured rates: past verb 36 to 51% of rows; clear subjunctive 0.4, 3.6, 9.1, 14.9, 9.4% by band; *por* or *para* 7 to 15%; *se* 2 to 13%; experiencer plus clitic 3.5 to 6.3%; *ser* or *estar* with a listed adjective 2 to 6%.

| # | Rule | Fires | Tier | Guard or change |
|---|---|---|---|---|
| 1 | `mood-hard`: indicative after a certain trigger | 5 / 20 / 15 | Assert | Closed trigger list only. Text: "You're not saying that's so." |
| 2 | `aspect-locked`: swap with an English lock, or action verb in plain narrative | 20 / 20 / 15 | Assert | State verbs need a lock. Text: "Was it going on, or did it happen?" |
| 3 | `exp-agree`: *me gusta los parques* | 5 / 2.5 / 0.7 | Assert | Not on coordinated singulars (u03-0043). Text: "What does the pleasing?" |
| 4 | `exp-subject`: *yo gusto*, *Vale gusta*, *yo me gusta* | 3 / 1.5 / 0.3 | Assert | **Not P27 as written.** Fire on a mismatch between pronoun person and verb person, or a third-person pronoun where the model has *a* + pronoun. *Ella le gusta* is correct when it means he likes her. *Tú te quedas* (u59-0231) and *Él no me cae bien* (u16-0921) must pass. |
| 5 | `ser-estar-locked`: flip adjectives, locked adjectives, *es* + gerund, *ser* for a thing's place | 6 / 2 / 0.7 | Assert | Table of flip words with English cue: *Soy aburrido* against "bored". Treat *queda* as *está*: 97 rows. |
| 6 | `inf-need`: *voy a como*, *después de comiendo*, *me gusta cocinando*, *nadando es bueno* | 4 / 2 / 1 | Assert | Not after *ver*, *oír*, *escuchar*: both forms occur (u26-0530, u46-0665). |
| 7 | `finite-need`: *Yo no hablar francés* | 6 / 1 / 0.5 | Assert | Safe. |
| 8 | `se-drop`: model has *se*, *me*, *te*, *nos*, input drops it | 3 / 9 / 6 | Assert | Text: "This verb needs its little word." Not on bank and shop *cerrar*. |
| 9 | `si-tense`: future or conditional after *si* | 1 / 5 / 3 | Assert | Only when the model has present or past subjunctive. *Si* as whether is legal (u42-0370). |
| 10 | `lexical-pair`: *saber* and *conocer*, *pedir* and *preguntar*, *hay* and *está*, *llevar* and *traer*, *tiempo*, *vez*, *hora* | 6 / 5 / 3 | Assert | One-lemma swap against a table of about 15 pairs. |
| 11 | `verb-prep`: *depender en*, *soñar de*, *casarse a* | 1.5 / 4 / 2.5 | Assert | Single-preposition verbs only. Remove *pensar de* and *sobre* (42 rows, legal for opinions), *entrar a* and *en*, *hablar de* and *sobre*. |
| 12 | `lo-le`: *Lo dije la verdad*, *La pregunté* | 6 / 7 / 5 | Assert on a verb table | Top 30 verbs. Not *ayudar*. *Le* for a man is a Note, not an error. Not with *usted*. |
| 13 | `pers-a`: *Veo Vale* | 3 / 2 / 1 | Assert | Names and kin nouns only. Never *Voy Bogotá*, where the message would be wrong. |
| 14 | `por-para-closed`: *gracias por*, rate, deadline day, *por* for *para* before a person who receives | 4 / 3 / 2 | Assert | Closed frames only. Everything else is rule 36. |
| 15 | `article-general`, `article-job`: *Me gusta café*, *Soy un profesor* | 4 / 0.5 / 0.2 | Assert | Missing from 02's table. |
| 16 | `no-prep`: *buscar para*, *esperar por* | 1.5 / 1 / 1 | Assert | **Remove *pagar*, *mirar*, *escuchar*.** *Pagué por el tiquete*, *miraba por la ventana* (u18-0457) and *espero por aquí* (u18-0444) are correct. Only with a direct object right after the preposition. |
| 17 | `be-tener`, `age`: *Estoy hambre*, *Soy treinta años* | 1.5 / 0.5 / 0.3 | Assert | Same noun required. *Estoy apurado* and *Estoy asustado* must pass. *Tengo afán* needs an accept. |
| 18 | `weather`: *Hoy es frío* | 0.5 / 0.2 / 0.1 | Assert on *es* only | 02's text says "isn't *ser*", which is wrong when the input is *está*. *Está haciendo frío* (u58-0356) must pass. *Bogotá es fría* (u13-0985) must not fire. |
| 19 | `poss-body`: *Me lavo mis manos* | 1.5 / 1 / 0.5 | Assert | Only with a co-referent clitic. *Mis manos están frías* is legal. |
| 20 | `for-time`: *Vivo aquí por dos años* | 1.5 / 0.5 / 0.2 | Assert | English gate: *have been* + *for*. The diff is too big to align. |
| 21 | `cuando-future`: *Cuando llegarás* | 0 / 1.5 / 1 | Assert | Safe. |
| 22 | `neg-concord`: *No tengo algo* | 1 / 1 / 0.5 | Assert | Model must have *nada*. 43 legal *no ... algo* rows. |
| 23 | `se-agree`: *Se me olvidó las llaves*, *Se vende carros* | 0.5 / 1.5 / 1 | Assert | Not with *a* + people. |
| 24 | `could`: *No podría abrir* | 1 / 1.5 / 1.5 | Assert with past model | Polite and hypothetical *could* is right. |
| 25 | `false-friend` | 0.8 / 1 / 1 | Assert | Needs input word, English cue and a model lacking the word. Rare, but high value. Soften *excitado*: "often sounds sexual". |
| 26 | `se-lo`: *Le lo di* | 0.5 / 0.5 / 0.2 | Assert | Safe. |
| 27 | `would-habit`, `would-refusal` | 0 / 0.5 / 0.5 | Assert | Only when the model has the imperfect or *no quiso*. |
| 28 | `used-to`: *Usaba vivir* | 0.5 / 0.2 / 0.2 | Assert | Change text. "Spanish has no word for used to" is false (LA1-047, *soler*). Say: "*Usar* doesn't work like that." |
| 29 | `strand`: *¿Quién vives con?* | 0.4 / 0.1 / 0.1 | Assert | Except *en contra*, 12 rows. |
| 30 | `muy-noun`: *Tengo muy hambre* | 0.3 / 0.1 / 0.1 | Assert | Closed nouns. |
| 31 | `mas-num`: *más que diez* | 0 / 0.5 / 0.1 | Assert | Model must have *más de*. 19 legal *más que un* rows. |
| 32 | `prog-plan`: *Me estoy yendo mañana* | 0.5 / 0.2 / 0.1 | Assert | Future time word required. |
| 33 | `gerund-adj`: *libro aburriendo* | 0.3 / 0.2 / 0.2 | Assert | Not after perception verbs. |
| 34 | `aspect-open` | 15 / 15 / 10 | **Ask** | See below. |
| 35 | `mood-open` | 1 / 3 / 5 | **Ask** | See below. |
| 36 | `por-para-open`, `ser-estar-open` | 6 / 6 / 3 | **Ask** | Keep a neutral question. |
| 37 | `event-estar`: *La fiesta está en mi casa* | 0.1 / 0.2 / 0 | **Note** | The course itself says you'll hear it. Marks the target as missed on a contrast card only. Owner call. |
| 38 | `passive-calque`: *La casa fue vendida* | 0 / 1 / 1 | **Note** | Correct Spanish, stiff in speech. Pass and say so. |
| 39 | `se-me-optional`: *Olvidé las llaves* | 0 / 1 / 0.5 | **Note** | Correct. Must not fail. |
| 40 | `pronoun-overuse`: *Yo no sé* | 0 / 2 / 2 | **Note** | From B1. Never a failure. |
| 41 | `motion`: *Corrió fuera de la casa* | 0.1 / 0.2 / 0.2 | **Silent** for now | See below. |

At B1 the Assert rules add up to roughly 100 fires per 1,000 typed sentences. If a fifth of first tries are wrong, that names about half of them, which is a judgement. Rules 1 and 2 alone carry about 40% of the Assert volume, so they decide whether the layer helps. Rule 11 is the one where a table with mistakes does most damage.

### What a deterministic checker cannot do reliably

1. **`aspect` on state verbs without an English lock.** Hand sample: 23 of 56 rows allow the other aspect, roughly 29 to 54% with a sample this size. Action verbs: 4 of 36. Weighted by the bank's split, about 1 past row in 5. Learners' swaps will concentrate on the open rows, so the real false rate is likely higher. No token-level rule can split them. The English is identical.
2. **`mood` in open frames.** 10 of 57 sampled rows allow the indicative, all in *el hecho de que* (4), negated seeing, saying or remembering (5), and *qué bueno que* (1). Also treat as open: *tal vez*, *quizás*, *a lo mejor*, *aunque*, *lo que*, *donde*, *cualquier...que*, relatives after *un* or *algo*, *siento que*, *no dudo que*. A three-frame exclusion would have cleared all ten, so a closed hard list is achievable. Saying "the trigger forces it" outside that list is not.
3. **Which job *por* or *para* is doing.** The model shows which word, not why. "For you" gives no signal. Only closed frames can name a use.
4. **`ser-estar` with open adjectives.** *Feliz*, *casado*, *soltero*, *tranquilo*, *seguro*, and *joven* with the right reading. Rejecting *Es feliz* is the error.
5. **`motion`.** *Corrió a la calle* is a calque (CX-042), but *corrieron a toda máquina hasta la esquina* (u58-0910) and *caminé al parque* (u04-0619) are correct. Only about 40 rows need it. The cost is real and the yield is small. Teach it. Don't detect it yet.
6. **`lo-le` on *ayudar*, with *usted*, and for a man.** Three dialect facts in one rule. The model cannot settle them.
7. **`no-extra-for` as written in 02.** Three of its six verbs have correct *por* uses in the bank.
8. **Will.** *Voy a*, *-ré* and the present are all right. There is nothing to diagnose. This is purely an accept problem.
9. **Two errors in one answer.** One hint per try is right, but the hint must never imply it's the only problem.

Against F2's targets in `06-innovation.md`: "0 misleading" on a battery of known errors tests the wrong thing. That battery holds only wrong answers. The test that matters is a second battery of **correct** answers, which must produce no Assert fires. The 33 here are a start. Add it to the gate.

## 6. Recorded disagreements

| With | Issue | My position | Status |
|---|---|---|---|
| 01-B1, 01-C1, 02 gloss | "News" as the mood test | Replace with says it or holds it up, plus the named catch | Resolved by bank rows |
| 02 section 4, LC-034 | Preserve portrait or snapshot | Keep the refusal, drop the image, use comparison | Resolved |
| Verifier of LA2-020 | "Right now" holds for *casado* | It fails on u15-0717 | Resolved |
| CX-038 verifier | "Not *para*" for how long | False for bookings | Resolved |
| CX-012 verifier | "Passes to the person" | Second thing test | Resolved |
| 02 section 6.2 | `no-extra-for` verb list | Remove three verbs | Resolved |
| 02 P27 | Canon fix for gustar | Check person agreement | Resolved |
| 02 section 6.2, 06 F2 | `aspect` and `mood` as flat rules | Tiers, locks, closed lists | Resolved in design, rates need learner data |
| 02, 06 F2 | Pitfall dictionary now | After false pitfalls are fixed | Resolved |
| 06 F2, 02 | Fingerprint counts all hits | Assert tier only | Resolved |
| 01-A2 | Keep "wish form" | Drop | Resolved |
| 01-B2 | *Se* lesson at B2 | u36, with the fourth job | Resolved |
| 02 `event-estar` | Reject *La fiesta está en mi casa* | Note, target missed on contrast cards | Owner decision |
| x:lo-le | *Le vi* marked wrong | Note | Owner decision |
| All | Scene past and event past as the labels | Rename across scripts | Owner decision |
| All | Firing rates | My estimates only | Needs learner data |

## 7. Limits of this review

- **No web sources.** The search budget for this run was used up, so nothing here was checked online and no links are given. The comparison account of *ser* and *estar* (Falk, Franco and Steinmetz, Clements), the assertion accounts of mood (Terrell and Hooper, Lunn, Bosque), the agentless account of *se* (Maldonado) and viewpoint aspect are all cited from memory, without pages.
- **The hand samples are one judge's.** 60 subjunctive rows, 60 state-verb rows and 40 action-verb rows, with false hits removed. Small samples, no second reader. A Bogotano should read the aspect and mood rows, and should check *Tengo afán*, *Estoy apurado*, *Hoy está frío*, *Soy casado* and *La fiesta está en mi casa*.
- **The subjunctive sample is skewed** by its regex towards u41, u46 and later, and it excludes negative commands. So 10 of 57 is not a rate for all learners' cards.
- **Firing estimates are not measurements.** Opportunity counts come from regexes over the bank, and the object-pronoun count is inflated by homographs. Bank rows are not the same as cards served.
- **No rule was prototyped.** Guards were reasoned from bank queries and matcher probes.
- **The explanations were not tried on learners.** "Than others, or than usual?" and "cover the opening" are the two I would test first, with people, not with this review.
- **Vocabulary was checked by first bank appearance**, not by what each learner was actually taught. *Gustas* has no bank row, and *tiré* comes from the g:se-accidental rule.
