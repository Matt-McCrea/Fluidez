# Curriculum usefulness audit

**Status: diagnosed, then acted on.** The audit below is the original
diagnosis and is left as written. What was subsequently changed is recorded in
§15 at the end, which maps each finding to the fix. All four gates pass after
the work; see §14 for the baseline and §15 for the after-state.

The question this audit was asked: **is Fluidez spending an English speaker's
limited attention on the right things, especially at A1/A2, or is it teaching
the analysis of Spanish in place of the ability to use it?**

Short answer: **the imbalance is real, but it is almost entirely not where it
looks.** The lessons are well written and communicatively framed. The problem
is that the app's *retrieval* architecture carries grammar points, single words
and verb forms, and does not carry the ready-to-say Spanish those same lessons
already contain. Fluidez has authored 4,847 keyword phrases and 2,342
functional exponents on the walked path. In the daily five-stage session, a
learner meets each of them **exactly once, on the day it is taught, and never
again.**

---

## 1. Executive summary

### 1.1 Is the curriculum over-focused on grammar/syntax relative to useful Spanish?

**Not in the lesson prose — yes in what the app makes the learner do.**

I expected to find lessons written as grammar-textbook entries. Mostly I did
not. The `canDo` lines are ability-framed, and the summaries are consistently
written against an English speaker's specific difficulty:

> `gr-presente-indicativo-valores-a1` — "The Spanish present does two jobs
> English splits into two tenses… with no '-ing' form"

> `gr-sonidos-a1` — "English has around twenty vowel sounds and spells them
> chaotically, which is why an English speaker…"

That is exactly the right instinct, and it is present across the whole A-band.

The imbalance is one layer down. Measured over the walked course:

| What the daily session enrols into spaced review | Carried? |
|---|---|
| Vocabulary words (`js/views/learn.js:332`) | ✅ |
| Verb meanings (`learn.js:345`) | ✅ |
| Lesson recall / grammar probes (`learn.js:381,395`) | ✅ |
| **Keyword phrases** — 4,847 on path | ❌ |
| **Functional exponents** — 2,342 on path | ❌ |

`js/views/review.js:96` does carry the keyword phrases, but marks them
`enrolledOnly`, and `review.js:125` filters those to items already enrolled.
The only thing that enrols them is a game round (`js/gameround.js:248`,
`js/games.js:790`). The comment at `review.js:92` states the design openly: *"a
phrase arrives here because a game round put it in play."*

Games are not one of the five stages (`js/session.js:38-40`: review, learn,
comprehend, apply, produce). **A learner who does the prescribed daily session
and never opens the games surface will never have a single functional exponent
enter their review queue.**

The same gap shows in the authored content. Share of taught exponents that
ever appear anywhere in the practice corpus (passages + apply + writing):

| Band | Exponents practised | Share |
|---|---|---|
| A1 | 16 / 222 | **7.2%** |
| A2 | 11 / 174 | **6.3%** |
| B1 | 10 / 450 | 2.2% |
| B2 | 8 / 777 | 1.0% |
| C1 | 9 / 703 | 1.3% |

`¿Cómo te llamas?` is taught on day 1 and appears in **zero** passages, zero
apply items and zero writing models. `a la derecha` appears 34 times in lessons
and 0 times in the entire practice corpus. `todo recto` 12 / 0. `¿podrías…?`
4 / 0.

So the honest framing is not "too much grammar explanation". It is: **the app
explains useful Spanish well, shows it once, and then never asks for it back.**
Meanwhile grammar recall points go straight into the SRS and come back for
months. The learner's retrieval time is therefore disproportionately spent on
grammar — not because the grammar was over-taught, but because grammar is the
only thing wired into the loop.

### 1.2 Is this particularly true of A1/A2?

Yes, and A2 is materially worse than A1 for a second, independent reason.

Practice supply per band-day:

| Band | Days | Passages/day | Apply/day | Writing/day |
|---|---|---|---|---|
| A1 | 108 | 1.29 | **2.05** | **1.94** |
| **A2** | **81** | 1.14 | **0.36** | **0.23** |
| B1 | 168 | 0.68 | 0.72 | 0.40 |
| B2 | 139 | 1.12 | 1.32 | 0.78 |
| C1 | 175 | 0.69 | 0.69 | 0.46 |

A2 has roughly **one sixth** of A1's Aplicar supply per day and **one eighth**
of its writing supply. Level gating is cumulative (`session.js:379`,
`x.level <= level`), so the pool is not empty — but it is an A1 pool. Of the
level-2 apply items, the 19 that carry a tense are **all `imperfecto`**.

That means A2's own centrepieces get no dedicated application stage at all:
the preterite/imperfect *choice* (`a2-u16`), object pronouns (`a2-u18`), the
imperative (`a2-u19`), comparatives (`a2-u21`), por/para and conditionals
(`a2-u23`), the gerund (`a2-u25`). A2 is where the hardest English-speaker
contrasts land, and it is the band with the least practice behind them.

### 1.3 Where is the imbalance most obvious?

**Aplicar is architecturally verb-only.** All 674 apply items are verb cloze
(`{inf, tense, person}`) or verb transform — there is no other item shape in
`data/apply.js`. So the drill stage, the one place the app forces repeated
retrieval under mild pressure, cannot address:

- ser vs estar
- por vs para
- object pronoun choice and placement (lo/la/le/se lo)
- gender and adjective agreement
- comparatives
- preposition choice
- any lexical or functional choice

These are close to the complete list of what an English speaker actually gets
wrong. For every one of them the pipeline is: Aprender (explain) → Comprender
(read) → **Aplicar: nothing applicable** → Producir (free writing, which the
learner can route around by choosing different words).

This is the structural reason the curriculum *feels* like it over-explains. For
these topics, explanation is the only instrument the architecture offers.

### 1.4 What is already working very well

Worth protecting in any revision.

- **`data/course.js` as a hand-written order.** Units own their days, each
  carries a `goal` and `canDo`, and the reasoning is in the file. The comment
  block at lines 216-243 — on why the two past tenses were moved into A1, why
  they are 24 days apart rather than adjacent, and why the unit ids stayed
  `a2-` to avoid resetting learner progress — is exactly the house style, and
  the decision is pedagogically right.
- **Units open with Spanish being used.** `a1-u01` day 1 is `dlg-presentarse`,
  a dialogue, before any grammar. Units close with a `task`. 63 task days on
  the path.
- **The SRS metalinguistic filter** (`js/lessons.js:340-362`). The app already
  refuses to put "the learner knows that X is a direct object" cards into
  review — `metalinguistic`, `descriptive`, `terminology`, `morphemeOnly`,
  `reproducible`. The declarative/procedural distinction is already encoded.
- **Contrastive summaries written for English speakers**, quoted in §1.1.
- **Every A1 passage carries a translate question** (139 passages, 139
  translates). The reading stage already forces production.
- **The B2 merge programme.** 134 lessons were merged away, concentrated at B2
  (`fn-pedir-ayuda-b2` ← 6 lessons, `fn-deseos-b2` ← 5). It worked: B2 function
  lessons average **9.9 examples and 15.4 exponents**, the richest in the app,
  against B1 function's 3.2 / 4.5.
- **The notion strand at A2** is genuinely strong — `nt-frecuencia-a2` carries
  20 keywords, 8 exponents, 6 examples for one day.

### 1.5 Biggest opportunities

In order of ability gained per unit of work:

1. **Enrol keywords and exponents on the lesson day** (§10.1). One change in
   `js/views/learn.js` turns 7,189 authored phrases from display into the
   review loop. Nothing needs authoring.
2. **Give Aplicar a non-verb item type** (§10.2) — a `choice` type. Unlocks
   ser/estar, por/para, object pronouns, agreement for drilling.
3. **Fill A2's practice deficit** (§10.3), targeting the constructions A2
   actually teaches.
4. **Merge B1's over-split function runs** using the B2 pattern (§10.4).
5. **Raise the SRS answer-length cap** so multi-word chunks can be held (§10.5).

---

## 2. A1 audit

108 days. Day composition: grammar 25 (23%), verb days 16 (15%), task 15 (14%),
free practice 14 (13%), notion 13 (12%), function 11 (10%), genre 5, concept 4,
discourse 4, dialogue 1.

Explanation-to-Spanish word ratio across A1 lesson days: **18,618 English words
of explanation to 5,766 words of Spanish — 3.23 : 1.**

By strand:

| Strand | Lessons | Expl:Spanish | Jargon terms/lesson | Avg examples | Avg exponents |
|---|---|---|---|---|---|
| notion | 13 | 2.58 | 0.6 | 5.7 | 7.5 |
| discourse | 4 | 2.74 | 0.8 | 6.0 | 9.3 |
| function | 11 | 3.00 | 1.0 | 5.6 | 8.1 |
| genre | 5 | 3.32 | 0.0 | 3.0 | 0 |
| task | 15 | 3.34 | 0.7 | 3.0 | 0 |
| concept | 4 | 4.07 | 1.3 | 3.5 | 0 |
| **grammar** | **25** | **4.17** | **3.5** | **3.5** | **0** |

The grammar strand is the worst on every measure, in every band, and the cause
is structural rather than editorial: **`data/taxonomy.js:94-95` does not permit
a grammar lesson to carry `exponents`**, and the validator rejects one that
does. The block that holds ready-to-say, register-tagged Spanish is unavailable
to precisely the lessons about the machinery. A grammar lesson's only Spanish
is its keyword table and ~3 examples.

That single schema line explains most of the felt imbalance in A1. Grammar is
23% of A1 days and is structurally the thinnest in usable Spanish.

### 2.1 Unit-by-unit

| Unit | Days | Teaches | Verdict |
|---|---|---|---|
| `a1-u01` Meet someone | 1-11 | greetings, ser/estar, origin, thanks, opening/closing | **KEEP.** Model unit. Dialogue first, 8 exponents/lesson, task close. |
| `a1-u02` Ask a question | 12-19 | interrogatives, stress/accent, intonation, subject pronouns, repair | **KEEP, one COMPRESS.** See `gr-acentuacion-a1` below. |
| `a1-u03` Be polite | 20-26 | tú/usted, apology, agreement, sí/no/también/tampoco | **KEEP.** `fn-acuerdo-a1` at 2.1 ratio with 137 Spanish words is among A1's best. |
| `a1-u04` Numbers, time, money | 27-33 | numbers, time, days, price, arranging | **KEEP.** Four notion lessons averaging 2.7 ratio, 6 examples each. |
| `a1-u05` Say what you like | 34-40 | gustar/encantar/doler, asking preferences, valuing | **COMPRESS opener.** See §4.1 — this is the clearest single instance of the reported problem. |
| `a1-u06` Order and buy | 41-46 | transactional genre, indefinite article, hay | **KEEP.** |
| `a2-u14` Tell me what happened | 47-52 | preterite, temporal deixis, sequencing | **KEEP.** Moving this into A1 was correct; the placement reasoning in `course.js` is sound. |
| `a1-u07` Describe people/things | 53-63 | adjective gender, adjectives, possessives ×2, demonstratives, family, 2 genre | **COMPRESS.** 11 days, the longest A1 unit. Possessives are split across two days (§4.2). |
| `a1-u08` Where things are | 64-70 | location, spatial deixis, movement, describing a place | **KEEP, but EXPAND practice.** Every direction exponent is lesson-only (§5). |
| `a2-u17` Have you ever…? | 71-76 | present perfect, anteriority, existence | **KEEP.** 24-day gap from the preterite is well judged. |
| `a1-u09` Your day | 77-83 | reflexive se, present values, adverbs, duration | **KEEP.** |
| `a1-u10` Want, need, ask for | 84-89 | infinitive uses, para + infinitive, correcting | **COMPRESS.** `gr-infinitivo-usos-a1` carries 12 jargon terms, the A1 maximum. |
| `a1-u11` Join it up | 90-96 | connectors, relative que, "direct object", quantifiers | **RECONSIDER.** Contains the audit's clearest defect (§4.3) and its worst-merged lesson (§4.4). |
| `a1-u12` The words behind the words | 97-103 | gender, noun gender, plurals, definite article | **KEEP but MOVE EARLIER in part.** See below. |
| `a1-u13` Everyday writing | 104-108 | written genres, two verb days, task | **EXPAND.** Only one lesson day in five; thinnest unit on the path. |

### 2.2 A1 notes

**`a1-u12` placement.** Noun gender, plural formation and the definite article
arrive on days 97-103, but adjective agreement is taught on day 53 and
possessive/demonstrative agreement on days 56-59. The learner is agreeing
adjectives for 44 days before being told how gender works. The unit's framing
("I understand why Spanish nouns have a gender, and I can find my own agreement
mistakes") is a legitimate consolidation goal, but `gender-articles` and
`gr-genero-sustantivos-a1` are prerequisites, not a retrospective.

**`gr-acentuacion-a1` (day 13).** 261 explanation words to 31 Spanish — 8.4:1,
with three of its four sections carrying no Spanish. Written stress rules are
genuinely useful for a Spanish learner (they are productive and they disambiguate
`hablo`/`habló`), but this is a reference page on day 13. *Supporting*, not
*essential*, at this point.

**`gr-sonidos-a1` (day 2).** 9.1:1, the worst ratio in A1. But this one earns
more of its space than the number suggests — the five-vowel point is the single
highest-leverage thing you can tell an English speaker in week one, and the
lesson pays off on every word thereafter. **KEEP**, trim the two lowest-Spanish
sections.

### 2.3 What an A1 finisher can actually do

Judged against the content, not the label.

| Capability | Supported? |
|---|---|
| Introduce yourself, ask the same back | **Yes** — `a1-u01` is thorough |
| Ask a stranger for information | **Yes** |
| Order in a bar, ask a price, pay | **Yes** |
| Say what you like / dislike / love | **Yes**, though via an analytic opener (§4.1) |
| Describe a person, object, place | **Yes** |
| Say where something is; give directions | **Taught, not practised** — every exponent lesson-only |
| Describe your routine | **Yes** |
| Say what happened yesterday | **Yes** — preterite at day 47 is a real strength |
| Talk about experience (has done) | **Yes** — day 71 |
| Say what you want / need / have to | **Partly** — `hay que`, `me hace falta`, `debo` absent |
| Ask someone to do something | **Weak** — `¿podrías?`, `¿me das?`, `¿te importa?` all absent or lesson-only at A1 |
| Handle not understanding | **Weak** — `¿cómo se dice…?`, `¿qué significa…?` absent from the entire A1+A2 corpus |
| React to what someone says | **Weak** — `¡qué pena!`, `¿en serio?`, `la verdad es que` absent |
| Talk about plans | **Yes** — `voy a` present |
| Give an opinion | **Partly** — `creo que` yes; `me parece`, `para mí` practice-only |

This is a strong A1. The gaps cluster in one place: **conversation management
and repair** — the language for keeping a conversation alive when you are out
of your depth, which is the beginner's most frequent real situation.

---

## 3. A2 audit

81 days. Grammar 15 (19%), function 13 (16%), verb days 12, practice 11, task
11, genre 8, notion 6, concept 3, discourse 2.

Explanation-to-Spanish: **12,412 : 4,438 — 2.80 : 1**, better than A1.
Function-strand ratio drops to 2.23 with 8.8 exponents per lesson: A2's
authored lessons are, page for page, the best communicative writing in the
A-band. `fn-acceder-peticion-a2` reaches 1.3:1 with 155 words of Spanish.

**The A2 problem is not the lessons. It is that nothing downstream practises
them** — §1.2's 0.36 apply/day and 0.23 writing/day, with level-2 apply items
covering only `imperfecto`.

### 3.1 Unit-by-unit

| Unit | Days | Verdict |
|---|---|---|
| `a2-u15` How things used to be | 109-114 | **KEEP.** Imperfect correctly held back from A1. |
| `a2-u16` Telling a story | 115-120 | **KEEP, EXPAND practice.** The preterite/imperfect *choice* is A2's hardest item for an English speaker and has zero apply items testing the choice. |
| `a2-u18` It, him, her, them | 121-127 | **KEEP, EXPAND heavily.** See §3.2. |
| `a2-u19` Asking nicely | 128-135 | **KEEP.** Excellent unit — the politeness ladder is the right organising idea. But all 6 request exponents are lesson-only. |
| `a2-u20` How are you feeling? | 136-142 | **KEEP.** Four function lessons, 6 exponents each. |
| `a2-u21` Comparing | 143-149 | **KEEP.** |
| `a2-u22` Getting things done | 150-158 | **KEEP.** Strongest A2 unit: phone, shop, complaint, 6 function/notion lessons at 1.5-2.6 ratio. |
| `a2-u23` Reasons and conditions | 159-166 | **KEEP.** por/para at day 161 is well placed. |
| `a2-u24` Getting around | 167-173 | **KEEP.** |
| `a2-u25` Writing it down | 174-180 | **KEEP.** |
| `a2-u26` The grammar under it | 181-189 | **RECONSIDER placement.** See §3.3. |

### 3.2 `a2-u18` — object pronouns

Days 121-127: `gr-objeto-indirecto-a2`, `gr-pronombres-atonos-a2`,
`gr-pronombres-tonicos-a2`, `gr-posesivos-tonicos-a2`, plus a task.

This is correctly included and correctly placed. Object pronouns are not
"sentence structure theory" — they are unavoidable in natural Spanish and
English gives no support for them. The brief's own caution applies here.

But: four lessons averaging **177-192 explanation words against 37-60 words of
Spanish** (ratios 3.2-5.0), **zero exponents** (grammar strand), **3 examples
each**, and **no apply items of any kind**. The single hardest procedural skill
in A2 — producing `se lo` without thinking — is taught entirely through
explanation and one task day.

This is the sharpest instance of the declarative/procedural gap in the app.
It is also the best test case for the `choice` apply type (§10.2).

### 3.3 `a2-u26` "The grammar under it"

Days 181-189, closing A2: irregular present, definite-article distribution,
quantifiers, interrogatives/exclamatives, demonstrative values.

Its stated goal is honest — *"I understand the machinery behind what I have
been writing, and can correct my own work"* — and a consolidation unit is a
reasonable idea. Two concerns:

1. `gr-presente-irregular-a2` (day 181) teaches the boot pattern in the
   **penultimate A2 unit**, having used irregular presents since day 4. This is
   reference material arriving 177 days after it was first needed.
2. Five grammar lessons, averaging 4.0:1, with 0 exponents, is how A2 *ends* —
   the last impression of the band is its most analytic stretch.

**RECONSIDER as a unit; MOVE EARLIER its contents.** `gr-presente-irregular-a2`
in particular belongs near `a1-u09`.

### 3.4 What an A2 finisher can actually do

Genuinely supported: tell an anecdote with background and events; handle a
phone call, a shop, a complaint; make and refuse requests across a politeness
range; compare things; give reasons and conditions; give directions; write a
review and a semi-formal email; react to news.

That is a real A2 and in several places better than one.

Weak or missing, unchanged from A1: **repair and clarification**
(`¿cómo se dice…?`, `¿qué significa…?`, `¿puedes hablar más despacio?` — still
absent from the whole corpus); **hedging** (`a lo mejor`, `supongo`,
`puede ser`, `tal vez` — absent or lesson-only); **conversational fillers**
(`o sea`, `venga`, `¿en serio?`, `¡qué va!` — absent from A1/A2 lessons while
`o sea` has 41 hits in upper-band practice material).

The picture is consistent: Fluidez teaches an A2 learner to *transact* well and
to *narrate* well, and leaves them least equipped for the unscripted middle of
a conversation.

---

## 4. Grammar / syntax over-targeting — specific findings

### 4.1 `gr-verbos-predicativos-tipos-a2` (day 34) — the reported problem, exactly

This is the opening lesson of `a1-u05` "Say what you like", and its summary is
almost verbatim the formulation the brief gave as the thing to avoid:

> "Me encanta el chocolate does not mean 'I' is doing anything — the chocolate
> is the grammatical subject and must agree with the verb, while 'I' sits in the
> indirect object, the mirror image of how English builds 'I love chocolate.'"

Its first section, *"Ordinary transitive and intransitive verbs"*, teaches
nothing the learner can say. It exists to set up a category contrast, and cites
`escribir algo`, `regalar algo a alguien`, `correr, nacer, crecer` — six verbs
mentioned as category exemplars and taught nowhere. Ratio 4.6:1, 6 jargon terms,
3 examples.

What is **right** here and must survive any rewrite:

- the probe `"Me ___ los pies." (doler — plural)` — procedural, forces the
  agreement choice
- the pitfall `*Yo encanto el chocolate is wrong` — precisely the English
  speaker's error
- the contrast table, which pairs each Spanish form with idiomatic English

**COMPRESS**: drop section 1, lead with the Spanish (`Me gusta el café` /
`Me gustan los libros` / `¿Qué te gusta?`), and move the subject/indirect-object
analysis to a `deeper` link. `deep-ser-estar` already establishes that pattern
for exactly this kind of persistent confusion.

Also note `doler` ("my feet hurt") is taught inside the "say what you like"
unit — thematically off.

### 4.2 Possessives split across two days (days 56, 57)

`gr-posesivos-forma-a1` ("Los posesivos: formas") and
`gr-posesivos-distribucion-a1` ("Los posesivos átonos: dónde van") are
consecutive days teaching `mi / tu / su`. 210 + 177 explanation words against
67 + 46 words of Spanish, for the least surprising feature in the A1 syllabus
for an English speaker.

The `course.js` header comment already identifies this exact pair as the symptom
of the old sort ("*'Los posesivos átonos: dónde van' came before 'Los posesivos:
formas': where they go, before what they are*"). The order was fixed; the split
was not. **COMPRESS to one day.**

The same shape recurs at `gr-demostrativos-distribucion-a1` (day 59, 405
explanation words, 6 jargon terms) — "and where they go" as an organising idea
for `este/ese/aquel`.

### 4.3 `gr-objeto-directo-a1` (day 93) — a `canDo` the lesson does not deliver

The lesson's `canDo` is **"replace a noun with lo, la, los or las"**. Its parent
unit `a1-u11` promises the same in its unit-level `canDo`.

The lesson body never teaches object pronouns. Its three sections are: personal
`a` with a specific person; no `a` with a thing; and a `que`-clause as direct
object. Its keywords, contrasts, examples and all four probes are about personal
`a` and `creo que`. There is no `lo`, `la`, `los` or `las` used as a pronoun
anywhere in it.

Object pronouns are first actually taught on **day 123**, in
`gr-pronombres-atonos-a2` — 30 days later.

This is the clearest case in the audit of a lesson organised around a **PCIC
category name** rather than a capability: the inventory line is "El objeto
directo", so the lesson covers what that category contains (personal `a`,
clausal objects), and the `canDo` was written from the category's *other*
famous member. The title is a label; the content is three unrelated facts that
share a label.

The facts themselves are worth teaching — personal `a` is essential and
`creo que` + no-drop is a genuine English-speaker trap. **RECONSIDER the
framing**: retitle around personal `a`, fix the `canDo`, and fix `a1-u11`'s unit
`canDo`, which currently promises a capability the unit does not contain.

### 4.4 `gr-relativo-que-a1` (day 91) — an unrewritten merge

`window.LESSON_MERGED_INTO` shows `gr-subordinadas-adjetivas-a1` was merged into
this lesson. The merge was a concatenation, and the result is visibly
duplicated:

- sections **"Subject or direct object"** and **"Subject or object of its own
  clause"** — the same section twice
- `que` appears **twice in the keyword table**, glossed "that, which, who" and
  "who, that, which"
- sections "Identifying the noun", "Que replaces a repeated noun" and
  "Restrictive — no commas" substantially overlap
- of **8 probes, 4 ask whether `que` changes for gender or number** — the
  single easiest fact in the lesson, asked four ways

489 explanation words, the largest in A1, for one invariable word.

Meanwhile the one genuinely valuable, English-specific point — **Spanish cannot
drop `que`** (`*el libro leo`) — gets one probe.

**COMPRESS**: dedupe to ~4 sections, 3 probes, and weight the probes toward the
no-drop rule.

### 4.5 Where the "analysis over ability" charge does *not* hold

Filed so a later revision does not over-correct.

- **The SRS already refuses metalinguistic cards.** Measured against the app's
  own filter, the grammar strand has the *highest* review-retention in A1 (55%)
  and A2 (65%) — higher than genre (45% / 34%). Grammar probes are not
  disproportionately theoretical.
- **Spanish-titled sections with no Spanish in them** (e.g.
  `nt-frecuencia-a2` → "Cantidad relativa: envases, tallas y medidas") look like
  hollow PCIC headings, but are **group headers**; the sub-sections beneath do
  the teaching, and the lesson carries 20 keywords and 8 exponents including
  `¿Qué talla usas? — La mediana.` Not a defect.
- **Verbs absent from `data/vocab.js`** is expected — they live in
  `data/verbs.js` (1,166 of them).
- **High-frequency time words** (`día`, `semana`, `hora`, `vez`) are absent from
  `VOCAB` but taught as keyword phrases across many lessons (`el fin de semana`,
  `¿Qué hora es?`, `la segunda vez`). Not a lexical gap — though it *is* an
  instance of §1.1, since keyword phrases never enter review.

---

## 5. English-speaker-specific analysis

Where Spanish differs from English, is the explanation proportionate to the
difficulty?

| Feature | Difficulty for EN | Treatment | Verdict |
|---|---|---|---|
| Gender / agreement | High, persistent | `a1-u07` + `a1-u12` + `deep-genero` (6 optional days) | **Right.** The optional deep unit is the correct home for the long tail. |
| ser / estar | Very high | `ser-estar` d6 + `deep-ser-estar` | **Right.** Early, plus an opt-in deep unit. |
| gustar-type | High | `gr-verbos-predicativos-tipos-a2` d34 | **Over-explained at the opening** — §4.1 |
| Object pronouns | Very high | `a2-u18`, 4 lessons, **0 apply items** | **Under-practised** — §3.2 |
| Preterite / imperfect | Very high | `a2-u16`, imperfect d109, choice d115 | **Well sequenced, under-practised.** No apply item tests the *choice*. |
| por / para | High | `por-para` d161 | **Right level.** Under-practised (no drill possible). |
| Reflexives | Medium | `gr-pronombre-se-a1` d77 | **Right.** |
| vosotros | Low (just a form) | taught throughout | **Right.** |
| Subject-pronoun dropping | Medium | `gr-pronombre-sujeto-a1` d16 | **Right.** 6.1:1 but the point is genuinely counterintuitive. |
| Written accents | Medium | `gr-acentuacion-a1` d13 | **Over-weighted for day 13** — §2.2 |
| Possessives | **Low** | **2 lessons, days 56-57** | **Over-targeted** — §4.2 |
| Demonstratives | Low-medium (3-way) | d59, 405 words | **Over-targeted.** The 3-way distinction is real; 405 words is not proportionate. |
| Relative `que` | Low, except no-drop | d91, 489 words, 8 probes | **Over-targeted** — §4.4 |
| Personal `a` | Medium, no EN analogue | d93, inside a mis-framed lesson | **Right content, wrong frame** — §4.3 |
| False friends | Medium | no dedicated treatment found | **Missing** |
| Five vowels | High payoff | `gr-sonidos-a1` d2 | **Right.** |

The pattern: **features where English gives no help are correctly identified and
well placed. The over-targeting is concentrated on features that are easy for an
English speaker but occupy their own PCIC inventory line** — possessives,
demonstratives, relative `que`, article distribution.

---

## 6. Useful-Spanish coverage matrix (A1 + A2)

Derived by searching the lesson corpus through day 189 and the level ≤2 practice
corpus. "Present but unpractised" = taught in a lesson, never appears in any
passage, apply item or writing model.

| Capability | Status |
|---|---|
| Greetings, farewells, courtesy | **Strongly covered** |
| Introducing yourself / asking back | **Strongly covered** |
| Core question words | **Strongly covered** |
| Numbers, time, dates, prices | **Strongly covered** |
| Describing people / objects / places | **Strongly covered** |
| Daily routine | **Strongly covered** |
| Past events (preterite) | **Strongly covered** |
| Experience (present perfect) | **Covered** |
| Plans / future (`voy a`) | **Covered** |
| Connectors (`porque`, `pero`, `también`, `luego`) | **Covered** |
| Likes / preferences | **Present but too theoretical** (§4.1) |
| Directions | **Present but unpractised** — `todo recto`, `a la derecha` 0 practice hits |
| Shopping / service transactions | **Present but unpractised** — `¿cuánto cuesta`, `me pone` lesson-only |
| Requests | **Present but unpractised** — all 6 forms lesson-only |
| Agreeing / disagreeing | **Present but unpractised** — all 6 forms lesson-only |
| Opinions | **Covered**, `en mi opinión` missing |
| Needs / obligation | **Weak** — `hay que`, `me hace falta`, `debo` absent |
| Reacting to people | **Weak** — `¡qué pena!`, `¿en serio?`, `¡qué va!` absent |
| Hedging / uncertainty | **Weak** — `a lo mejor`, `supongo`, `puede ser`, `tal vez` absent or lesson-only |
| Asking for clarification / repair | **Missing** — `¿cómo se dice…?`, `¿qué significa…?`, `¿cómo se escribe…?` appear 0–1 times in lessons and 0 times in practice |
| Discourse markers / fillers | **Missing at A1/A2** — `o sea`, `bueno`, `pues`, `venga` (well covered at B2+) |
| False friends | **Missing** |
| Pronunciation | **Covered** (`gr-sonidos-a1`) |
| Listening-oriented language | **Weak** — no dedicated treatment of fast-speech reductions |

The cluster is unambiguous: **everything needed to survive a real conversation
you are not controlling is the weakest part of A1/A2.**

---

## 7. B1–C1 pass

Lighter, per brief, but two findings are serious.

### 7.1 Review retention collapses in the upper bands

Share of a lesson's probes that the SRS filter admits:

| Band | function | notion | genre | discourse | grammar |
|---|---|---|---|---|---|
| A1 | 61% | 59% | 45% | 50% | 55% |
| A2 | 56% | 65% | 34% | 44% | 65% |
| B1 | 46% | 50% | 25% | 35% | 58% |
| **B2** | **29%** | **31%** | 27% | 24% | 41% |
| **C1** | **28%** | **27%** | 25% | 26% | 30% |

At B2/C1 roughly **70-75% of everything taught puts nothing into spaced
review.** Two distinct causes, from inspecting the 397 rejected B2 probes:

1. **Correctly rejected (148, answers ≤3 words):** probes that ask the learner
   to *classify a pragmatic function* rather than produce Spanish — answers like
   *"Conceder primero, luego pivotar con 'pero'"*, *"Elude la responsabilidad
   directa del hablante"*, *"anunciar cortésmente un acto que podría amenazar la
   imagen del oyente"*. **This is the brief's "analysis rather than ability"
   concern, and at B2 it is worse than at A1.** The filter catches them, so they
   waste lesson space rather than review space — but they waste it.

2. **Wrongly rejected (249, answers ≥4 words):** `js/lessons.js:330` caps SRS
   answers at **3 words**. So `Tienes toda la razón.`, `¿Qué tal estuvo la
   excursión?`, `Tengo la impresión de que…` are all excluded *purely by
   length*. These are exactly the formulaic chunks that constitute
   upper-intermediate fluency. **The cap structurally excludes the multi-word
   chunk — the most valuable unit at B2/C1.**

### 7.2 Over-split function runs at B1 — with the fix already proven at B2

`b1-u32` runs four consecutive days on one speech act:

| Day | Lesson | Exponents | Examples |
|---|---|---|---|
| 235 | `fn-pedir-ayuda-b1` | 8 | 6 |
| 236 | `fn-pedir-permiso-b1` | 4 | 3 |
| 237 | `fn-pedir-favor-b1` | 4 | 3 |
| 238 | `fn-pedir-objetos-b1` | 5 | 3 |

All four teach softened requests and their exponents share the same frames
(`¿Podrías…?`, `¿Te importaría…?`, `¿Me dejas…?`). They are four PCIC inventory
lines, not four skills.

**The B2 equivalents were already merged** — `fn-pedir-ayuda-b2` absorbed 6
lessons, `fn-pedir-permiso-b2` absorbed 5 — and the merged results carry 15.4
exponents on average. The pattern is proven in-repo; B1 simply has not had it
applied.

Same shape at C1: days 622-624 (`localizar` present / past / future) and days
656-658 (movement nouns / verbs / locutions) are consecutive thin splits of one
topic.

B1 is **45% function-strand days** (75 of 168) at 3.2 examples and 4.5 exponents
each — the widest, thinnest stretch on the path.

### 7.3 B1–C1 other notes

- **Advanced grammar on a thin foundation:** C1 is 3% grammar days (5 lessons)
  at a 6.08:1 ratio — the worst in the app — and 44% notion days (77 lessons).
  C1's grammar is a handful of very dense pages.
- **Lexical strength:** C1 passages reach 635 distinct verbs, B2 577. The
  reading corpus in the upper bands is genuinely rich.
- **`gn-descriptiva-personas-b2`** is titled *"anclaje, aspectualización, puesta
  en relación"* — metalinguistic Spanish in a lesson title, addressed to a
  learner who is not a linguist.

---

## 8. Keep / compress / expand / move / reconsider

### KEEP
- `data/course.js` as hand-written order, with its reasoning comments
- The two past tenses in A1, held 24 days apart
- Dialogue-opens / task-closes unit shape
- The SRS metalinguistic filter (`js/lessons.js:340-362`)
- The optional deep units (`deep-ser-estar`, `deep-genero`, `deep-el-articulo`)
- Contrastive English-speaker summaries throughout
- One translate question per A1 passage
- `a2-u22` "Getting things done", `a2-u19` "Asking nicely", `a1-u01` — model units
- The A2 notion lessons (20 keywords / 8 exponents / 6 examples)
- The B2 merge programme's results

### COMPRESS
- `gr-verbos-predicativos-tipos-a2` — cut section 1, lead with the Spanish (§4.1)
- `gr-posesivos-forma-a1` + `gr-posesivos-distribucion-a1` → one day (§4.2)
- `gr-relativo-que-a1` — dedupe merge artifacts, 8 probes → 3 (§4.4)
- `gr-demostrativos-distribucion-a1` — 405 words is disproportionate
- `gr-acentuacion-a1` — trim to the productive rules
- `gr-infinitivo-usos-a1` — 12 jargon terms, A1 maximum
- B1 `fn-pedir-*` ×4 → one lesson, B2 pattern (§7.2)
- C1 d622-624 and d656-658 → one lesson each

### EXPAND
- **A2 practice supply across the board** (§1.2) — the largest single gap
- Object pronoun production (`a2-u18`) — 0 apply items today (§3.2)
- Preterite/imperfect *choice* items
- `a1-u13` "Everyday writing" — one lesson day in five
- Conversation repair, hedging, reactions, fillers at A1/A2 (§6)
- Requests, agreement, directions, shopping — taught, never practised

### MOVE EARLIER
- `gr-presente-irregular-a2` (day 181) → near `a1-u09`
- `gender-articles` / `gr-genero-sustantivos-a1` (days 97-98) → before adjective
  agreement at day 53
- Basic repair language (`¿cómo se dice…?`) → `a1-u02`, which already teaches
  "I don't understand"

### MOVE LATER
- `gr-acentuacion-a1` (day 13) — the full rule set is reference material
- Clausal-object material in `gr-objeto-directo-a1` — after real object pronouns

### RECONSIDER
- `gr-objeto-directo-a1`'s framing and its false `canDo` (§4.3), and
  `a1-u11`'s unit `canDo`
- `a2-u26` "The grammar under it" as A2's closing unit (§3.3)
- B2/C1 probes that ask the learner to classify pragmatic functions (§7.1)
- `gn-descriptiva-personas-b2`'s metalinguistic title
- **`data/taxonomy.js:94-95`** — the rule forbidding `exponents` on grammar
  lessons. This is the single highest-leverage line in the audit. It is why the
  grammar strand is the thinnest in usable Spanish in every band.

---

## 9. Missing-content inventory

Ordered by frequency-of-need for an English speaker.

1. **Clarification and repair** — `¿cómo se dice…?`, `¿qué significa…?`,
   `¿cómo se escribe…?`, `¿puedes hablar más despacio?`, `no te he entendido`.
   Appear 0-2 times in the whole lesson corpus, 0 times in practice. Belongs at
   **A1**, in `a1-u02`.
2. **Hedging** — `a lo mejor`, `supongo`, `puede ser`, `tal vez`,
   `no estoy seguro`. Belongs at **A1/A2**.
3. **Reactions** — `¡qué pena!`, `¿en serio?`, `¡qué va!`, `menos mal`. **A1/A2**.
4. **Fillers** — `o sea`, `bueno`, `pues`, `venga`, `la verdad es que`. Present
   at B2+, absent at A1/A2. Belongs at **A2** — they are how a learner buys
   thinking time.
5. **Needs / obligation** — `hay que`, `me hace falta`, `debo`. **A1**
   (`a1-u10` already has the slot).
6. **False friends** — no dedicated treatment. `embarazada`, `constipado`,
   `éxito`, `actualmente`, `sensible`. Belongs in a **deep unit**.
7. **`en mi opinión`** — the most transparent opinion frame for an English
   speaker, absent at A1/A2.
8. **Listening-oriented language** — fast-speech reduction, no treatment
   anywhere.

Test for items 1-5 in a later pass: they should appear in a lesson **and** in at
least one passage, apply item or writing model.

---

## 10. Opportunity-cost analysis

What the freed time buys, in priority order.

### 10.1 Enrol keywords and exponents on the lesson day
**Cost:** a few lines in `js/views/learn.js`, beside the existing
`S.enrol('v:'+w.es+':meaning')` at line 332. `js/phrases.js` already builds
stable `k:<spanish>` ids and already drops paradigm rows and starred wrong
forms. **Authoring cost: zero.**
**Buys:** 4,847 keyword phrases and 2,342 exponents enter the review loop.
Every "present but unpractised" row in §6 changes status. This is by far the
highest ability-per-unit-of-work change available.
**Risk:** review volume. Mitigate by enrolling only the current lesson's
phrases, as vocab already does.

### 10.2 A `choice` apply item type
**Cost:** one item shape in `data/apply.js`, its validator branch, and a
renderer.
**Buys:** Aplicar becomes usable for ser/estar, por/para, object pronouns,
agreement, comparatives, preposition choice. The `transform` type (96 items)
is the precedent. Turns the app's most-explained contrasts into drilled ones —
directly converting declarative knowledge into procedural ability.

### 10.3 Fill A2's practice deficit
**Cost:** authoring. Target ≥1.0 apply/day and ≥0.6 writing/day for A2 — roughly
50 apply items and 30 writing tasks.
**Buys:** the preterite/imperfect choice, object pronouns, imperative,
comparatives, por/para and conditionals all get an application stage.
**Freed from:** compressing §4.2, §4.4 and `a2-u26` yields ~4 A-band days.

### 10.4 Merge B1's function runs
**Cost:** editorial, with `LESSON_MERGED_INTO` and the B2 precedent to follow.
Merge the four `fn-pedir-*` lessons and the C1 triples.
**Buys:** ~6 B1 days and ~4 C1 days, plus lessons that carry 15 exponents
instead of 4. **Spend the days on** the §9 missing functional language, and on
translation tasks per the standing worklist direction.
**Caution:** merge by rewriting, not concatenating — §4.4 is what concatenation
produced.

### 10.5 Raise the SRS answer-length cap
**Cost:** `js/lessons.js:330`, plus judgement about what replaces a blunt word
count.
**Buys:** ~249 B2 probes alone, and the multi-word chunk becomes reviewable at
every level. Without this, 10.1's exponents will themselves be partly filtered.

### 10.6 Compress the over-targeted A1 grammar
**Frees:** ~3-4 A1 days from §4.2, §4.4, `gr-demostrativos-distribucion-a1`.
**Spend on:** repair language in `a1-u02` and `a1-u13`, currently the thinnest
unit on the path.

---

## 11. Recommended priorities for a subsequent revision

1. **`js/views/learn.js`** — enrol the lesson's keywords and exponents (§10.1).
2. **`data/apply.js` + validator** — add the `choice` type (§10.2).
3. **`js/lessons.js:330`** — revisit the 3-word SRS cap (§10.5).
4. **`data/taxonomy.js:94-95`** — let grammar lessons carry `exponents` (§8).
5. **Fix `gr-objeto-directo-a1`** and `a1-u11`'s unit `canDo` (§4.3) — a
   correctness defect, not a preference.
6. **Dedupe `gr-relativo-que-a1`** (§4.4).
7. **Author A2 practice** against A2's own constructions (§10.3).
8. **Rewrite `gr-verbos-predicativos-tipos-a2`'s opening** (§4.1).
9. **Add the §9 missing functional language**, each item landing in both a
   lesson and a practice item.
10. **Merge the B1 `fn-pedir-*` run and the C1 triples** (§7.2).

Items 1-4 are architectural, cheap, and unlock the rest. Items 5-6 are defects.
Items 7-10 are authoring.

---

## 12. Particularly good material — preserve

- `data/course.js:216-243` — the comment explaining the two-past-tense move.
  Reasoning of this quality is the house style working as intended.
- `data/taxonomy.js:88-92` — *"A lesson that names nine colours in its prose and
  translates none of them is not teaching them."* The right principle, stated
  well. §1.1 is the case for extending it from display to retrieval.
- `js/lessons.js:334-362` — the probe-to-recall filter. The
  declarative/procedural distinction, already in code.
- `js/phrases.js:1-27` — *"They were the best-structured content in the app and
  they were decoration."* The file already diagnoses §1.1; it just stops at the
  games surface.
- `fn-acceder-peticion-a2` — 1.3:1, 155 words of Spanish, 6 examples. The best
  ratio in the A-band.
- `nt-frecuencia-a2` — 20 keywords, 8 exponents, 6 examples in one day.
- `a2-u19` "Asking nicely" — organising requests by politeness *ladder* rather
  than by speech-act category is exactly the right call, and is what B1's
  `fn-pedir-*` run should have done.
- `gr-sonidos-a1` — worst ratio in A1, and still worth it.
- `deep-ser-estar` / `deep-genero` — the correct home for the long tail of a
  persistent confusion.

## 13. Particularly problematic material — exact ids

| Lesson id | Day | Problem |
|---|---|---|
| `gr-objeto-directo-a1` | 93 | `canDo` promises `lo/la/los/las`; body never teaches them. Unit `a1-u11` repeats the false promise. Pronouns actually arrive day 123. |
| `gr-relativo-que-a1` | 91 | Unrewritten merge: duplicate sections, `que` twice in keywords, 4 of 8 probes test the same trivial fact. 489 words for one invariable word. |
| `gr-verbos-predicativos-tipos-a2` | 34 | Opens the "Say what you like" unit with subject/indirect-object analysis; section 1 teaches nothing sayable. |
| `gr-posesivos-forma-a1` + `gr-posesivos-distribucion-a1` | 56, 57 | Two consecutive days splitting `mi/tu/su` into "what they are" and "where they go". |
| `gr-demostrativos-distribucion-a1` | 59 | 405 explanation words, 6 jargon terms, for `este/ese/aquel`. |
| `gr-infinitivo-usos-a1` | 84 | 12 jargon terms — the A1 maximum. |
| `gr-acentuacion-a1` | 13 | 8.4:1; three of four sections carry no Spanish; reference material on day 13. |
| `gr-presente-irregular-a2` | 181 | The boot pattern taught 177 days after irregular presents were first used. |
| `fn-pedir-ayuda-b1` / `-permiso-b1` / `-favor-b1` / `-objetos-b1` | 235-238 | Four consecutive days, one speech act, 4-5 exponents each. B2 equivalents already merged. |
| `nt-localizacion-presente/pasado/futuro-c1` | 622-624 | Three consecutive thin splits of one topic. |
| `nt-movimiento-*-c1` | 656-658 | Same. |
| `gn-descriptiva-personas-b2` | 481 | Metalinguistic title: *"anclaje, aspectualización, puesta en relación"*. |

---

## 14. Baseline validation results

Run before any inspection, on a clean tree at `455f4e1` (branch `main`).

```
node tools/validate-content.js   ✅ exit 0
    Lessons: 581+798  Passages: 621  Apply: 674  Writing: 485
    Checks run: 181822
    Tag coverage: cefr 79%  pcic 74%  theme 78%  strand 15%  [migrating]

node tools/test-checker.js       ✅ exit 0   485 tasks, 475 checks
node tools/lint-spanish.js       ✅ exit 0   no accent errors
node tools/audit-verbs.js        ✅ exit 0   no verb contradicted by corpus
```

Variety checks — pre-existing warnings, none caused by this audit:

| Band | Result |
|---|---|
| A1 | ⚠ length: mean 65 words vs target 30-60; 84 of 139 outside · ⚠ 138/139 themed |
| A2 | ⚠ apply items drill only 25 distinct verbs across 60 items |
| B1 | ⚠ apply items drill only 58 distinct verbs across 153 items |
| B2 | ✅ nothing flagged |
| C1 | ✅ nothing flagged |

**The repository starts clean.** All four gates pass. This audit modified no
content, no generated fields and no gates; the only file added is this report.

---

## Method note

Findings were derived by loading the real data files through the same loader
`tools/validate-content.js` uses, walking `window.COURSE_DAYS` in course order,
and measuring the authored blocks directly — not by reading titles or taxonomy.
Exponent-practice coverage was computed by normalising each exponent and
searching the level-gated practice corpus; spot-claims were re-verified with
`grep` against the raw files.

Three hypotheses were tested and **withdrawn** — recorded in §4.5 so a later
pass does not rediscover them as findings: hollow PCIC section headings (they
are group headers), missing core verbs (verbs live in `data/verbs.js`), and
missing high-frequency time words (taught as keyword phrases).

---

## 15. What was implemented

The diagnosis above was acted on in a single follow-up pass. Every gate passes
after the work (`validate-content`, `test-checker`, `lint-spanish`,
`audit-verbs` — all exit 0), and the variety warnings are the same
pre-existing ones as the baseline.

### 15.1 Architecture

| Finding | Fix |
|---|---|
| §1.1 — 4,847 keyword phrases and 2,342 exponents never entered review | `js/views/learn.js` now enrols the lesson's own phrases on the day it runs, alongside its vocab and verbs. `js/phrases.js` reads `exponents` as well as `keywords`. **2,864 distinct phrases now enter the review loop over the walked course**, ~5.7 per lesson day. |
| §1.3 — Aplicar was verb-only, so ser/estar, por/para, object pronouns and agreement could not be drilled | New `choice` apply item type: `js/views/apply.js` renders it, `tools/validate-content.js` validates it (shape, plus the same per-token tense gate passages use), `js/session.js` aligns it to its teaching day by `focus`. Scheduled per contrast as `ac:<focus>`. |
| §1.2 — A2 had 0.36 apply items/day and 0.23 writing/day | **44 choice items** and **21 A2 translation tasks** authored. A2 apply is now **1.11/day** (from 0.36) and A2 writing **0.73/day** (from 0.23). |
| §2 — the grammar strand was barred from carrying `exponents` | `data/taxonomy.js` now permits them; `exponentsOptional: true` keeps them from becoming retroactively mandatory on ~100 existing lessons, so the gate is sharpened rather than loosened. |
| §7.1 — the 3-word SRS answer cap excluded every multi-word chunk | `js/lessons.js reproducible()` now allows up to 8 words when the answer is a Spanish utterance (`spanishUtterance()` — positive test for Spanish function words, negative for English ones, because `descriptive()` was built for one-word glosses and let "stating a standing fact about my life" through). 218 probes admitted; B2/C1 retention up from ~29%/28% to ~35%/34%. |
| §4.4 — merges concatenated blocks and printed the overlap twice | `js/lessons.js applyMerges()` now dedupes keywords, exponents, contrasts, examples, pitfalls, sections and probes. **47 duplicate probes removed across 89 merged lessons.** Cloze probes are exempt — their value is the sentence, not the answer, and the 6-probe floor caught that rule being too broad. |

### 15.2 Grading — how generously a phrase card is marked

A phrase card asks whether the chunk comes back whole, so it is graded more
generously than a verb drill, and the leniency is scoped to that card kind
rather than applied globally (`js/checker.js checkExact`):

- **Synonyms the course itself teaches pass.** `Phrases.alternatives(en)`
  returns every Spanish glossed the same way, so "then →" accepts `entonces`
  *and* `luego`. 171 English glosses in the corpus are shared by two or more
  Spanish phrases.
- **Accents and `ñ` pass**, with the correct form echoed back in the
  "¡Correcto!" line so the accent is still taught. An English keyboard has no
  `á` or `ñ`.
- **Except where the accent IS the word.** `Phrases.accentCritical()` is
  derived, not listed: a phrase is protected when some other phrase in the
  corpus differs from it by accents alone. That covers `sí`/`si`, `qué`/`que`,
  `cómo`/`como`, `hablo`/`habló` without a hand-kept list going stale.
- The global rule is untouched: a verb drill still requires `habló`.

### 15.3 What is deliberately kept OUT of the phrase deck

Every row was reviewed by hand before release. These are excluded and stay in
the lesson tables, where they earn their place:

| Excluded | Why |
|---|---|
| Two-speaker exchanges (`—Katrin es alemana. —No, es austriaca.`) | Fine to read, unreasonable to retype verbatim |
| Anything over 8 words | A learner who knows it still loses on a dropped comma |
| Bare clitics and articles (`el`, `la`, `un`) | "Type the Spanish for 'the'" has four right answers |
| One-word rows glossed with a bare pronoun or determiner (`tú` = "you (one person, informal)") | The prompt cannot pick the answer out. The gloss is split before testing — the parenthesis was hiding these |
| Rows whose Spanish echoes their English (`¡María!` = "María!") | The prompt contains the answer |
| Lone conjugated forms glossed with a subject (`hablo` = "I speak") | A paradigm cell. The app already reviews conjugation properly, per verb+tense, with a sentence round it (`vt:` cards) |

### 15.4 Content

- **`gr-objeto-directo-a1` (§4.3)** — retitled *La a personal: Veo a María*,
  `canDo` corrected to what it teaches, `a1-u11`'s unit `canDo` corrected with
  it, the "one big direct object" section rewritten as the no-drop `que` rule,
  and 7 exponents added.
- **`gr-verbos-predicativos-tipos-a2` (§4.1)** — now leads with
  *Me gusta el café / Me gustan los libros / ¿Qué te gusta?*; the
  subject-and-indirect-object analysis moved to the third section, after the
  pattern is in the ear. The category-taxonomy opening section is gone. 7
  exponents added. The agreement probe and the `*Yo encanto` pitfall are
  untouched — they were always the best things in it.
- **Merges (§4.2, §7.2)** — B1's four `fn-pedir-*` days into one
  (**17 exponents, from 8**); A1's two possessive days into one, with 7
  exponents added; two C1 triples into one each (15 and 14 exponents). The
  course is 663 days, from 671.
- **Missing functional language (§9)** — added as exponents to the lessons
  that already own those moments, so they enrol into review rather than only
  being displayed: **repair** (`¿Cómo se dice en español?`, `Más despacio, por
  favor`, `¿Qué significa esta palabra?`) to `fn-pedir-informacion-a1`;
  **hedging** (`No estoy seguro`, `A lo mejor…`, `Ni idea`) to
  `fn-preguntar-conocimiento-a2`; **reactions** (`¡Qué pena!`, `¿En serio?`,
  `¡Qué va!`) to `fn-preguntar-estado-animo-a2`; **needs** (`Tengo que…`,
  `Hay que…`, `Me hace falta…`) to `nt-necesidad-obligacion-a2`; **fillers**
  (`Bueno…`, `Pues…`, `O sea…`, `Es que…`) to `dc-conectores-a1`.

Re-measured against §6, every capability previously marked *weak*, *missing*
or *present but unpractised* is now in the review loop by the end of A2.

### 15.5 Two bugs found while implementing

- **`js/views/review.js` never applied meaning-alternatives.** `resolve()`
  returns `{front, back, mode, toSpanish, hint}` and no `kind`, so
  `MEANING[R.kind]` was always `undefined` — the review stage had never once
  accepted the second half of a two-meaning gloss, while `js/deck.js` (which
  reads `cur.kind`) always had. Now reads `cur`.
- **`tools/variety.js` counted choice items in its verb-variety denominator**,
  so a band appeared to lose verb variety the moment non-verb items were
  added. It now measures over verb items and reports choice items separately.

### 15.6 Not done

- **§3.3 `a2-u26` "The grammar under it"** — flagged as RECONSIDER, and moving
  `gr-presente-irregular-a2` earlier means re-cutting two units. Left for a
  deliberate pass on A2's shape rather than folded into this one.
- **§2.2 `a1-u12` placement** — same reason: moving gender before adjective
  agreement reorders three units.
- **§7.1 B2/C1 probes that ask the learner to classify pragmatic functions** —
  the SRS filter already keeps them out of review, so they cost lesson space
  rather than review space. Rewriting them is an authoring pass of its own.

---

## 16. Theme build-out: passages

Companion to §15's writing-task build-out. The same nine themes were taken from
6 passages per band to a depth that a themed focus can actually run on.

### 16.1 What was written

**195 new passages**, every one checked against the length band, the ≥10
own-theme-vocabulary gate, the per-token tense gate and the tú/vosotros rule
before insertion. The app goes from 621 passages to 816.

| Theme | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|
| viajes, servicios, salud, identidad, cuerpo, caracter | 6→**12** | 6→**12** | 6→**10** | 6→**9** | 6→**9** |
| medios, politica | 6→**12** | 6→**12** | 6→**10** | 6→**9** | 6→**8** |
| economia | 6→**12** | 6→**12** | 6→**10** | 7→**10** | 6→**8** |

A1 was the acute case and was doubled: it is a single level, so its pool is not
cumulative the way every later band's is, and 6 texts had to cover 107 days.

House conventions were followed rather than worked around: English glosses at
A1/A2/B1, Spanish definitions at B2, no glossary at C1; 30-60 words at A1
rising to 320-450 at C1; two MCQs, a short answer and a translate line per
passage, with the translate line verbatim from the text. `tenses` was left to
`tools/tense-index.js` on every insert.

### 16.2 The selection bias that would have buried them

**This is the answer to "should the new ones replace some of the old ones in
the daily rotation?" — and the answer turned out to be that without a fix they
could not even compete.**

`js/session.js` chooses between equally-eligible passages with `teaches(p)`:
the count of unmet vocabulary words in the text. The count was raw, with no
normalisation for length. Measured over the 139 A1 passages as they stood:

- correlation between length and selector score: **+0.51**
- the 20 top-scoring A1 passages averaged **77 words** against A1's 30-60 target
- **not one** of those 20 was inside the target band

So the scheduler was systematically preferring the baggiest text available, and
any correctly-sized passage written afterwards would lose *for being shorter*.
Adding 54 in-target A1 passages to that selector would have added 54 passages
the learner rarely saw.

The fix keeps what the raw count was actually for and drops what it had become
(`richest()` in `js/session.js`):

1. **A floor.** The day's new words are drawn from this passage, so a text
   carrying fewer unmet words than `newPerDay` cannot overlap with all of them
   however good it is. Below that floor the raw count is still the right
   measure.
2. **Density above the floor.** Among texts that clear it, prefer the one that
   teaches most *per word read*.

Re-measured: correlation falls to **-0.35**, and **16 of the top 20** land
inside the target band.

### 16.3 Replace, or add?

Nothing was deleted, and on the evidence nothing should be.

- The tense gate and the unmet-words preference already rotate away from
  passages whose vocabulary a learner knows, so an exhausted text stops being
  chosen without needing to be removed.
- Every existing passage has passed all four gates and several carry
  `density-baseline.json` grandfathering that records real authoring history.
- With the scoring fixed, the new in-target passages now compete on merit —
  which is the outcome wanted, and is not the same as forcing them.

What the audit *can* say is that **84 of 193 A1 passages sit outside the 30-60
word band, and all 84 are pre-existing** — every one of the 54 written here is
inside it. Those 84 are the honest candidates for a trimming pass, one at a
time, rather than for deletion. A1's mean length has already fallen from 65 to
61 words purely by dilution.

### 16.4 Defects the gates caught in this work

Recorded because they are the kind that recur:

- **`dificultad`, `cosas`, `diferencias`, `vistas`, `caliente`, `muelas`,
  `transportes`, `fuera`, `viva`, `vaya`** all read as verb forms above their
  passage's level. The shared scanner is right to flag them; the content was
  reworded each time rather than the gate loosened.
- **`b2-car-optimismo`** carried a genuine person slip in reported speech
  (`quieres que dejes` for `quieres dejar`), found only because the address-mix
  gate made me re-read the sentence.
- My own scratch checker reported a false tú/vosotros mix on `años`, because
  JavaScript's `\b` is defined on `[A-Za-z0-9_]` and treats `ñ` as a boundary —
  the same trap `js/lessons.js metalinguistic()` documents for accented
  question words.

### 16.5 Still open

- **B1/B2/C1 sit at 9-10 fresh passages per theme, not 12.** Level gating is
  cumulative, so a B2 learner draws on 43-52 texts per theme across all levels
  and a C1 learner on the full set; only A1 was ever capped at its own level.
  Raising the upper bands to 12 apiece is another ~35 passages of 200-450 words
  and has a lower marginal return than the A1/A2 work already done.
- The 84 over-length A1 passages (§16.3).

---

## 17. What the learner actually reads

The reading stage chooses a passage in three tiers — uses today's grammar,
else today's theme, else anything at this level. The tier comment in
`js/session.js` says why it exists: *"the fallback used to be 'any passage at
this level' and that put a reading about a final exam on day one of 'Meet
someone'."* It was still happening.

### 17.1 Why alignment could not fire

`passageUsesFocus()` could only align on a **tense** or a **concept lesson**.
Of the 19 lesson-days in the first 24, one carries a tense and one is a concept
lesson. The other 17 teach a function, a notion or a genre — the days that
teach the most useful Spanish — and had no way to align at all.

Measured over the first 24 days as they stood:

| tier | days |
|---|---|
| uses today's lesson | **2** |
| same theme | 8 |
| any of 193 passages | **9** |

### 17.2 Aligning on the lesson's own vocabulary

A lesson may now also align on the words it is built out of — its `keywords`
and `exponents`, matched through `js/lexmatch.js` rather than a second
matcher, at a threshold of three shared words. One shared word is a
coincidence in a 60-word text; three is the passage being about the same
thing.

| | before | after |
|---|---|---|
| first 24 days aligned | 2 | **16** |
| first 50 lesson-days aligned | — | **33 of 38** |
| whole A1 band (108 days) | — | **66 of 78 lesson-days** |

Candidate pools fall from 193 to 1-10, so the choice is genuinely targeted
rather than deterministic-but-arbitrary.

### 17.3 The opening fortnight is authored

Determinism was never the gap: `session.js` already seeds the rng from the
lesson id the first time a lesson is seen, so day one was always identical for
everyone. It was identical *and arbitrary*.

Alignment fixes most of it but cannot fix the days whose lesson has no content
partner at all — day 2 is the five vowels, day 13 is where the written accent
falls. Nothing in a corpus of passages rehearses a pronunciation rule, so the
scheduler was free to hand a beginner a tourist guide on day 2 and a text about
a king and a president on day 13.

So `data/course.js` gained a fourth day key, `passage: 'id'`, used by the
first two units and nowhere else. The rule applied when picking: **keep the
learner inside the world of the unit.**

| day | lesson | reading | why |
|---|---|---|---|
| 1 | Dos personas se conocen | En la cafetería de la facultad | the dialogue, read back as prose |
| 2 | Los sonidos: cinco vocales | En la comisaría | no content partner — picked for the lightest load |
| 4 | Presente | ¿Qué llevas en el bolso? | *llevo, tengo, es* — the present in the first person |
| 5 | Saludar | En la recepción | buenas tardes, at a desk |
| 6 | Ser vs. Estar | Cómo es Javier, cómo está hoy | the contrast shown, not stated (written for this slot) |
| 7 | De dónde eres y cuántos años | La edad de cada uno | ages and origin |
| 8 | Identificar: qué es y quién es | Los vecinos del piso | quién es quién, floor by floor |
| 9 | Dar las gracias | La vecina nueva | gracias, encantado, hasta luego |
| 10 | Empezar y terminar una conversación | Hola y adiós en la escalera | an opening and a closing, performed (written for this slot) |
| 11 | Preséntate | En la cafetería de la facultad | the same text as day 1, on purpose |
| 12 | Los interrogativos | En el banco | the most question-dense text in A1 |
| 13 | El acento | La tarjeta no funciona | ¿Cuál…? — the accent falls on the question word |

Day 11 repeating day 1 is deliberate. The unit opens with two strangers
meeting and closes by asking the learner to introduce themselves; reading that
first passage again with ten days behind them is the point.

Every pick is **presente-only**. The preterite is not taught until day 47 and
`session.js` withholds a text whose tenses the learner has not reached — a
named passage that gets withheld is worse than none.

### 17.4 The gate that keeps it honest

Two things can go wrong with a hand-written id and both are silent at runtime,
because the session falls back to choosing for itself: a typo serves an
unrelated passage, and a legal id whose tenses are not yet taught is withheld
and never seen. `tools/validate-content.js` now checks both. Verified by
breaking each on purpose:

```
✗ course[1]: names passage "u1-vecinaa", which does not exist
✗ course[6]: passage "a1-ident-clase" needs preterito, taught on day 47 — it would be withheld
```

### 17.5 On putting English inside the passage

Considered and rejected. The tense scanner, the content gate's level check,
the ≥10 theme-density rule and `LexMatch` all read `p.text`; English in there
would make four gates mis-read the corpus, which is the one thing the
architecture exists to prevent.

It is also not needed. An A1 passage already carries 4-6 English gloss rows, a
translate question with an English model, and — now that alignment works — the
day's own lesson vocabulary appearing in the text, which is the strongest
scaffold of the three. Stage 1 then pre-teaches the day's new words *out of
that same passage* before the learner reads it in stage 3.

A gloss-coverage **scoring preference** was also dropped, for a simpler reason:
with the opening days naming their passage the candidate pool is one, so a
preference has nothing to choose between. The equivalent was done by hand
instead — the authored opening averages 62 words against A1's 30-60 target,
and the three that exceed it (days 4, 6 and 10) were kept for content fit and
are pre-existing passages already on the over-length list in §16.3.

### 17.6 On using Focus for this

Rejected. `js/focus.js` states the invariant that makes it safe: *"It does not
touch the lesson ladder… What a focus changes is the material that was never
sequenced in the first place."* Curating an opening is the opposite — it is
about the first N days in sequence.

It also does not fit mechanically. A focus narrows to one theme, while the
first two units deliberately span meeting people, asking questions, politeness
and numbers; and `Focus.narrow()` falls back to the whole pool when a theme is
thin, so a beginner focus would silently do nothing on exactly the days it was
meant to help.

---

## 18. Is the opening actually easy enough?

The picks in §17.3 were made on situational fit alone, and that was half a
judgement. Measuring what a learner with an empty SRS actually faces —
distinct tokens, minus function words, cognates, the day's own lesson
vocabulary, the gloss, and anything seen on an earlier day — the first version
of the authored opening ran at **40% unknown**, with individual days far worse:

| day | reading (first version) | unknown |
|---|---|---|
| 8 | ¿Quién es? | **63%** |
| 4 | Una conversación entre amigas | 44% |
| 2 | Los vecinos del piso | 43% |

Day 8 was the clearest mistake. *¿Quién es?* is a guessing game about a
person's appearance, which fits the lesson *Identificar: qué es y quién es*
perfectly and is built almost entirely from body vocabulary — `pelo`, `nariz`,
`barba`, `hombros`, `cuello` — none of which is taught until `a1-u07` on day
53. Excellent fit, wrong forty-five days early.

### 18.1 What changed

Four days were re-picked against a vocabulary-load budget while the days whose
fit is strong were held fixed:

| day | was | now | why |
|---|---|---|---|
| 2 | Los vecinos del piso | En la comisaría | lightest available; the lesson is the five vowels and needs no partner |
| 4 | Una conversación entre amigas | ¿Qué llevas en el bolso? | concrete and picturable; first-person present |
| 8 | ¿Quién es? | Los vecinos del piso | *better* fit as well as lighter — identifying who each neighbour is |
| 15 | Pedir cita | *(scheduler)* | health vocabulary is not taught for months; alignment serves it |

**40% → 27% overall**, and the worst day falls from 63% to 47%.

### 18.2 Where the floor is

Roughly 25-30% unknown is the corpus floor for any A1 text a beginner meets in
the first fortnight, because a 50-word passage carries ~15 content words and
the learner starts from zero. Day 1 sits at 24% and the lightest candidate for
any early day is ~12 unknown words. That is not a failure of the picks; it is
what reading in a new language is.

The scaffolding around it is what makes it workable, and it now stacks
properly: stage 1 pre-teaches the day's new words **drawn from that same
passage**, stage 2 is the lesson whose vocabulary appears in it (8 shared words
on day 1), stage 3 is the passage with 4-6 gloss rows, and its hardest words
are the glossed ones.

### 18.3 Does it build?

Yes, from about day 7. Words carried over from earlier days in the opening:

```
day   1  2  4  5  6  7  8  9 10 11 12 13
reuse 0  3  1  1  2  2  9  6  6 12  7 15
```

The two deliberate pairings do most of that work: day 11 re-reads day 1's text
(0% unknown, the bookend), and day 13 re-uses day 12's bank vocabulary (5%
unknown). Days 12-13 are the model for what an opening sequence should look
like — a second text that trades on the first.

### 18.4 A caveat on the measurement

The metric over-counts. Day 4 is flagged at 47%, but its "unknown" list
includes cognates (`pasaporte`, `crédito`, `visita`), counts `llevo` and
`lleva` as two words, and four of its hardest items (`llaves`, `cartera`,
`agenda`, `maletín`) are glossed. The genuinely opaque residue is about seven
words in a 53-word text. The figures above are therefore an upper bound, useful
for ranking days against each other and not to be read as an absolute.

Day 6 was kept at a flagged 42% for the same reason: its unknown words are
`amiga, alta, inteligente, hoy, cansada, porque, trabaja, semana, hermano,
médico, aprender, hablar` — core A1 vocabulary and cognates, in the one passage
in the corpus written expressly to contrast ser and estar.

---

## 19. Two passages written for the opening

Printing the opening out and reading it as a learner would surfaced three
defects and two judgements. The defects were fixed in place; the judgements
needed new content.

### 19.1 Defects found by reading, not by the gates

- **`a1-ident-vecinos` ended ungrammatically** — *"Todos somos del mismo
  pueblo, no."*, the negation written backwards and meaning nothing. Mine.
  Now *"No somos del mismo país, pero somos buenos vecinos."*
- **Two sentences bolted on to satisfy the density gate.** `a1-serv-policia`
  closed on *"El vigilante del banco también habla con ella"* and
  `a1-ident-edad` on *"El señor del piso de arriba también es mayor"* —
  neither connected to its scene, both there to reach ten theme words. Both
  rewritten so the theme vocabulary arrives inside the dialogue.

None of the four gates can catch any of these: `lint-spanish` adjudicates
accents, not sense, and the density gate is satisfied as easily by a bolted-on
sentence as by a good one. Reading the output is still the check.

### 19.2 Day 6 — the contrast shown, not stated

`ser-estar-contraste` fitted the lesson perfectly and was a grammar explanation
written in Spanish: *"Ser describe quién es alguien de forma permanente,
mientras que estar describe cómo se encuentra en un momento concreto."* Handed
to a learner six days in, that is the pattern §4 of this audit criticises
everywhere else — the analysis of Spanish standing in for Spanish.

Replaced with **`a1-car-javier`** (48 words, density 11), which makes the same
point by using it: a run of `es` for what Javier is like, then `está` for how
he is today, turning on one line — *Normalmente no es serio: es alegre y
optimista. Pero hoy está serio.* The closing sentence carries the rule without
naming it: *El carácter no cambia; el día sí.*

### 19.3 Day 10 — greetings performed, not reported

`primer-dia-vecindario-vocab1` reports greetings in the third person — *"la
saluda con un alegre buenos días"*, *"la vecina responde de nada, muchas
gracias por todo"* — so the learner reads *about* the exponents instead of
seeing them used. It was also the heaviest text in the opening at 82 words.

Replaced with **`a1-rel-vecino-nuevo`** (47 words, density 11): two neighbours
meeting on the stairs, opening with *¡Hola, buenos días!* and closing with
*Bueno, hasta luego. —Adiós, Marta. Buenas tardes.* — the lesson's own
exponents, spoken.

| day | before | after |
|---|---|---|
| 6 | 90w, 42% unknown, lex 2 | **48w, 28% unknown, lex 2** |
| 10 | 82w, 41% unknown, lex 6 | **47w, 24% unknown, lex 7** |

### 19.4 The measurement, corrected

The unknown-word figures in §18 were an upper bound and are now tighter: the
cognate test was extended to the endings that reliably survive into English
(`-ble`, `-ante/-ente`, `-ista`, `-ico`, `-ivo`), which is what `sociable`,
`inteligente`, `paciente`, `arrogante`, `optimista` and `egoísta` all are. On
the corrected measure the authored opening runs at **23% genuinely unknown**,
and day 6 — which looked like the worst day at 50% under the old test — is 28%.

One day remains heavier than the rest: **day 4, at 47%**. Its reading is a list
of the things in a bag, so the residue is ten concrete nouns; four of the
hardest are glossed. Every lighter alternative in the corpus was either
off-world (an ambulance call) or barely lighter, so it stands, flagged.

---

## 20. A full glossary for the opening fortnight

The §19 numbers said the opening ran at 23% unknown words, and the honest
response to that is not only to pick easier texts — the corpus floor is around
25% for any A1 passage met by someone who knows nothing — but to gloss more.

The eleven authored opening passages now carry **~20 gloss rows each, 242 in
total, up from 51**. Everything in them is glossed except proper nouns.

| | before | after |
|---|---|---|
| gloss rows, days 1-13 | 51 | **242** |
| unknown words across the authored opening | 23% | **2%** |

What is left cold is `Tom`, `Ana`, `Clara`, `Javier`, `Marcos`, `Nadia`,
`Daniel`, `Marta`, `Chile` and `español` — names, and one word nobody needs
told.

### 20.1 Why this is cheap and why it is contained

The glossary renders BELOW the passage (`js/views/comprehend.js`), as a
wrapping flex list, so twenty short rows are a few lines under the text rather
than a wall in front of it. The learner still meets the Spanish first.

Every row carries an add-to-Palabras chip, so a fuller glossary is also a
fuller vocabulary capture surface: twenty rows are twenty words the learner can
keep with one tap.

Nothing else reads a passage's gloss. `js/gameitems.js` builds its
`glossesOf` index from `data/verbs.js` and `data/vocab.js`, not from passages,
and `js/phrases.js` reads lesson keywords and exponents. The change touches one
renderer.

### 20.2 The taper is deliberate

Days 1-13 get ~20 rows. Every other A1 passage keeps its 3-6. That ramp is the
point: a learner on day one is reading a parallel text with a crutch under it,
and by day 20 they are reading Spanish with the four hardest words explained.
Glossing the whole band at this density would remove the reason to learn any of
it.

### 20.3 The trade-off, stated

With nearly every content word glossed, a learner can in principle read the
glossary instead of the passage. That is a real cost and it is accepted for
thirteen days, because the alternative on day one is guessing. The check that
it has not become a crutch is the same as it always was: the questions are in
Spanish, the translate line has to be produced, and the day's new words are
drawn from the passage into spaced review whether the learner leaned on the
gloss or not.

---

## 21. Repetition, and the glossary past day 13

### 21.1 The repetition was the bigger problem

Measuring the curve past day 13 turned up something worse than the difficulty
step: **the scheduler had no memory of what had been read.** Over the whole A1
band it served 78 lesson-days out of **35 distinct passages**, one of them
**sixteen times**. Re-reading a text four times in a month is a worse failure
than a hard text.

This was pre-existing, not caused by the density scoring in §16.2 — under the
old raw-count rule it was 35 distinct with a 16× maximum, and under density it
was the same 35 with 16×. Neither rule had any memory to consult.

`js/session.js` now records a passage when the READING STAGE FINISHES — not
when the day is built, because `buildContext` is deterministic and re-runs on
every reload, so marking there would retire passages the learner never read.
The selector then prefers an unread passage **within whatever pool the tiers
already produced**, so it never widens the choice; it only breaks the tie the
scheduler was previously breaking by re-serving a favourite. If everything in
the pool has been read it falls back to the whole pool, the same bargain
`taughtTenses` and `Focus.narrow` already make.

| A1 band, 78 lesson-days | before | after |
|---|---|---|
| distinct passages | 35 | **69** |
| most-repeated text | 16× | **3×** |
| texts served more than once | 15 | 8 |

Every remaining repeat is legitimate: `u1-cafeteria` on days 1 and 11 is the
authored bookend, and the rest are 30-50 days apart, which is spaced
re-reading rather than the hammering it replaced.

An authored `passage:` still outranks the unread preference, which is what
keeps day 11 working.

### 21.2 The step at day 14, and what it really was

| | days 1-13 | days 14-46 (before) |
|---|---|---|
| gloss rows | 18-23 | **3-4** |
| unknown words | 2% | **28%** |

The support collapsed at exactly the moment the texts got harder. Crediting
the vocabulary drip barely moved it — 29% to 28% — because the words these
passages turn on are mostly not in the A1/A2 vocabulary table at all.

22 passages were re-glossed. The unknown rate across days 14-46 falls from
**28% to 7%**, with the Spanish untouched.

### 21.3 The taper that turned out to be wrong

The plan in §20 was a taper by day: ~20 rows to day 13, ~12 to day 40, ~8 to
day 60, then the existing 4. What was actually written is closer to flat —
about 20 rows for all 22 — and on reflection that is the better answer.

The right amount of gloss is a property of the TEXT, not of the calendar. At
day 40 `corredores`, `débiles` and `recorrido` are exactly as opaque as
`cartera` was on day 2; thinning support on a schedule would have glossed them
less precisely because of a date. What should climb is the difficulty of the
Spanish, and it does:

| band | mean words | unknown BEFORE gloss | gloss rows | unknown AFTER |
|---|---|---|---|---|
| days 1-13 | 56 | 33% | 20 | 2% |
| days 14-30 | 63 | 34% | 21 | 6% |
| days 31-46 | 68 | 38% | 20 | 6% |

The texts get longer and denser; the support holds the *supported* difficulty
roughly level. That is a gradient in the reading, not in the crutch.

### 21.4 Where support thins now

Days 47 onwards keep their original 3-4 rows and run at about **19% unknown**,
with two topic-vocabulary spikes (day 53 body parts at 35%, day 68 farm
animals at 42%). That is a real step up from 6%, and it is in the right place:
by day 47 a learner has read forty-odd texts, and 19% with four glossed words
is a reading exercise rather than a decoding one.

The day-14 cliff is gone. Whether day 47 wants the same treatment is a
judgement about how hard reading should feel once the scaffolding comes off,
and is left open rather than assumed.

