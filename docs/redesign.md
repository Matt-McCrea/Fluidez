# Fluidez, rebuilt: a course that is computed for each learner

Proposal, 28 October 2026. This replaces the "minimal change" framing of
`phase0-report.md` §3–5. Constraints: text only, offline, **no AI in the
app, no listening features**.

## The idea in one paragraph

Today Fluidez is a **fixed list of days**, and each day shows authored
content to everyone. Neither research document can be met that way. The
sequencing doc wants grammar, notions and functions ordered by
prerequisite. The blueprint wants:
- reviews to set the pace
- readings with 95–98% known words *for this learner*
- one new grammar point per day, followed by a drill
- mastery measured by new combinations, not by finishing lessons

All of that needs the app to know what each learner knows, item by item,
and to **build each session from that knowledge**.

So the rebuild has three parts:
- **A skill graph.** Everything teachable becomes a node in a graph: grammar
  points, patterns, chunks, words, contrasts and can-dos.
- **A tagged sentence bank.** Every piece of content is a sentence, tagged
  with the nodes it requires.
- **A deterministic session compiler.** It assembles each day from those
  tags, under the blueprint's rules.

The sequencing doc's 537 positions become the **priority order** through the
graph. The blueprint's six lesson types become **policies** the compiler
applies. Lessons stop being the unit of progress: a lesson becomes the
teaching script for one node.

It's offline and needs no AI because the hard part, knowing what a Spanish
sentence contains, is already half-built. `ENGINE.analyzeSentence` and the
morphological index cover all 1,166 verbs.

## What already exists to build on

- **Engine and analyser.** The engine conjugates and analyses every form of
  1,166 verbs. `js/checker.js` checks free text against declarative
  constraints.
- **Content.**
  - 5,820 vocabulary entries
  - 818 passages (133k words)
  - 2,451 lesson examples
  - 3,140 probes
  - 718 cloze items and 731 writing tasks
- **Probes.** Probes already exist as the design for placement, skip checks
  and mastery (`tools/ARCHITECTURE_V2.md`).
- **Merge redirects.** `LESSON_MERGED_INTO` is already an id-redirect map.
- **Course changes.** Learner position is already rebuilt from the
  studied set when the course changes.

## 1. The skill graph is the curriculum

| Node type | Examples | Typical count |
|---|---|---|
| Grammar point | present of -ar verbs; perfecto; lo/la/los/las; present subjunctive after volition | ~250 |
| Pattern (lexico-grammatical) | *llevar + gerundio*; *acercar* vs *acercarse*; *tener forma de*; *acordarse de + inf. compuesto* | ~600, harvested from the notion and function lessons |
| Chunk | *me gustaría*; *¿me puede…?*; *que te mejores* | ~400 |
| Lexeme (lemma + sense) | *la mesa*; *pedir* (to order) vs *pedir* (to ask for) | ~5,000 to C1 |
| Contrast | ser/estar, pret/imp, perfecto/indefinido, por/para, hay/está, *húmedo*/*mojado* | ~80 |
| Can-do | "I can book a room and handle a problem" | ~300 |

**Edges:**
- *requires* (prerequisite)
- *contrasts with*
- *unpacks* (a chunk seeds a later system, e.g. *soy* → present of *ser*)
- *serves* (pattern → can-do)

**Per learner, every node** has separate **receptive** and **productive**
memory states, plus an exposure count from reading.

**This settles the notion question properly.** A notion lesson is not a day
or a week. It is a handful of pattern nodes and lexemes:
- **Budget.** The compiler budgets them as minor patterns (a smaller cost than a grammar point).
- **Placement.** It drops them into any session with room, usually beside the
  can-do they serve.
- **Bundling.** Sometimes it bundles one notion's patterns into a short themed
  block.
- **Triage.** The B1–B2 triage becomes "which of these nodes are patterns?",
  answered per node rather than per lesson. Nothing that teaches a pattern
  is ever shelved. Only pure word lists become optional vocabulary, still
  fed to the review queue.

The sequencing doc's restructure is applied to the graph:
- its order becomes node priorities
- its merges become aliases
- its splits become separate nodes
- its 17 new lessons become nodes with stub teaching scripts

## 2. Every sentence knows what it requires

Extend the analyser into a **feature tagger**. Each sentence then gets the
set of nodes it requires:
- tense and mood, with the trigger that licenses the mood (*quiero que*,
  *es una pena que*, *cuando* + future reference)
- clitic sequence and position (*se lo*, *dímelo*, *voy a verlo*), and
  leísmo accepted
- relative-clause type
- commands, including vosotros and negative commands
- periphrases, ser/estar use, por/para
- lexemes and their frequency band

Low-confidence tags go to a review queue, never silently through.

Then one question gates everything: **is required(sentence) ⊆ known(learner)?**
A reading is allowed when its required nodes are known and its unknown
lexemes are ≤2% (≤5% with glosses).
- This replaces tense-only gating.
- It catches every hotspot the sequencing doc lists (reflexives in the
  perfecto unit, *dímelo* before day 146, commands before 91) automatically
  and for good.
- The same check, run per course position, is the CI gate.

All existing content, plus everything authored from now on, goes into a
**sentence bank**: Spanish, English, accepted alternatives, required nodes,
theme, and story link. Target: **30–50k validated sentences** by C1. This is
the main compute cost, and it is spent at build time.

## 3. Exercises are generated, not written

From the bank plus the engine, deterministically:
- **Structured input** with minimal-pair distractors. The engine changes only
  the target feature: swap the tense for "today or yesterday?", swap the clitic
  for "who did what to whom?", swap the mood for "fact or wish?". Processing
  instruction becomes automatic for every grammar point.
- **Controlled output.** Choose, then type, then transform, with the engine
  computing every answer.
- **Translation** from English to Spanish, a lot of it at every level. A
  canonical-form matcher accepts the full set of valid answers: subject
  pronoun dropped or kept, clitic before or attached, synonyms from the
  lexeme's sense set, and accepted word-order variants. When the answer is
  wrong, the matcher locates the error ("check the verb ending") and the
  learner gets **one self-correction attempt before the answer is shown**,
  as the sequencing doc recommends.
- **New recombinations.** The engine re-inflects a known sentence the learner
  has never seen: new person, new tense, a pronoun in place of the object.
  These are the **mastery tests**, so "a correct chunk is not mastery" is
  enforced by construction.

## 4. Writing and conversation without AI

- **Scripted typed conversations.** Authored scene graphs (book a room,
  return a faulty phone, persuade a flatmate). In each learner turn:
  - The learner gets an intent to fulfil ("refuse politely and give a
    reason").
  - Free typing is checked against constraints by `checker.js` and against
    accepted pattern families.
  - The scene branches on deterministic intent detection.
  - Every character line is drawn from the bank, so it is always at the
    learner's level.

  Feedback covers one feature with one rewrite, and both versions are shown
  side by side. The fluency rerun repeats the same scene against a timer.
- **Writing.** Constraint checklists (existing) plus:
  - "upgrade" rewrites (*rewrite it using aunque + subjunctive*)
  - comparison against model answers
  - a self-assessment rubric

  Length targets follow the sequencing doc: 80–150 words at B1, 250 at B2,
  400+ at C1.
- **The honest limit.** Without AI, the app cannot grade open-ended meaning.
  The design narrows that gap with tasks constrained enough to check and with
  models to compare against. It does not pretend the gap isn't there.

## 5. Reading volume replaces the listening track

The blueprint's hour gap (about 750 guided hours to C1) was going to be
closed by outside listening. Instead, close it with **a graded serial**:
- **The story.** Lucía, Ana and Marcos's lives in Valencia, written as a
  continuous story through every band. Every chapter is gated per learner at
  ≥98% coverage, tap-to-gloss, tap-to-save into review.
- **The course uses the same world.** Lesson dialogues, scenes and readings
  all come from it, so words and patterns recycle without any planning.
- **Scale.** Target several hundred thousand words of graded text across the
  bands. The extension tier is reading this; the 10-minute minimum tier is
  re-reading it.

## 6. The scheduler

- **FSRS** replaces the Leitner boxes. The target retention is configurable
  (85–90%). Recognition and production are scheduled separately, with at
  least half of reviews in the production direction.
- **Implicit credit.** One sentence review updates every node it contains,
  weighted, and reading gives small receptive credit. This is what makes the
  blueprint's review-time arithmetic work.
- **Measured timing.** The seconds per review are **measured per learner**,
  not assumed (the blueprint's acknowledged unknown). The review budget is
  set in minutes.
- **The session compiler.**
  - **The weekly rhythm** is a template over the session index, not the
    calendar.
  - **Grammar spacing.** At most one grammar Introduce per session, never in
    consecutive sessions, and each followed by a Drill 1–3 sessions later.
  - **Contrasts** are mixed only once both members are known.
  - **Backlog throttle.** When reviews pile up, the next input session becomes
    a review session; review is never trimmed to make room.
  - **Minimum session.** It adds no new items and does not advance the path.
- Every rule is a **property test**. A simulator walks synthetic learners
  (fast, average, forgetful, irregular) from A1 to C1 and reports calendar
  length per band at each tier. That replaces my +50-day guess.

## 7. Placement, assessment and measurement

- **Probes** (3,140 already exist) per node drive placement, skip checks
  ("prove you know it and skip the day") and mastery.
- **Checkpoints** every 4 weeks use items 2–4 weeks old plus new
  recombinations, and report results as can-do statements. A quarterly
  DELE-style reading and writing benchmark requires ≥60%, with a
  remediation block built from the weakest nodes if the learner falls
  short.
- **Local analytics:**
  - accuracy on delayed retrieval and on new recombinations (the main metric)
  - grammar choice retained three months later
  - review backlog
  - share of production
  - words written and words read
  - hours per band against the Cervantes bands

## 8. Lessons rewritten as teaching scripts

Every node's script follows the blueprint's anatomy:
- example before rule
- rule ≤90 seconds of reading
- read-and-pick, then your turn, then a story, then a personal sentence

It also follows the voice rules: no jargon on screen, a human reason and a real line
to open, and nothing on screen that says "SRS" or "drill". The 674 existing
lessons are source material: their content is mined into scripts, patterns
and sentences rather than shipped as they are. The emotion lessons that absorb
others are rewritten, not concatenated.

## Build order: prove it on three weeks, then scale

1. **Graph and tagger.** Node schema, the feature tagger, and loading all
   existing content into the tagged bank, with the review queue. Apply the
   sequencing doc as priorities, aliases and splits.
2. **Learner model and compiler.** FSRS, implicit credit, the session
   compiler, property tests and the simulator.
3. **Exercise generator and translation matcher.**
4. **Vertical slice.** Units a1-n01 to a1-n03 built end-to-end in the new
   form: scripts, a serial chapter, generated exercises, one scripted scene
   and a checkpoint. **Use it yourself before anything scales.**
5. **Scripted-conversation engine** and its first scenes.
6. **Content at scale, band by band**, through the gates: scripts, the bank
   and the serial.
7. **Placement, checkpoints, benchmarks and analytics.**
8. **Learner migration.** Seed each learner's model from their studied set
   and existing review records, using aliases for merged ids. It never resets
   anyone, and it is reversible.

## Dropped from the briefs

- Outside-listening log, listening suggestions, listening streak credit
- "Say it aloud" prompts
- AI role-play and AI writing feedback

The existing optional text-to-speech button is left as it is and not
extended.
