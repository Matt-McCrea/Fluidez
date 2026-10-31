# Fluidez product-experience audit

Audited 31 October 2026 on branch `rebuild` (commit ee6aaec), the build that is live at matt-mccrea.github.io/fluidez-next. This complements `docs/rebuild-audit.md` (29 October), which judged the architecture against the research briefs. This report judges the app as a learner meets it.

## How it was done

Two views at once.

**Inside.** Three maps of `app/`: the UI and session flow (`src/ui`, `src/compiler`), exercises and checking (`src/exercises`, `src/check`), and content (`content/`, the gate, the burn). Unit samples at u01, u02, u20, u40 and u58. The gate's current output (0 errors, 5,294 warnings).

**As a learner.** A Playwright driver with a persistent browser profile against the dev server (`?fixtures=0`, real content), now in `app/tools/playtest/`. Three learners:

- A complete beginner who played ten consecutive days: day 1 with naive answers (always the first option, "no sé" in every field), then days 2 to 10 learning from the feedback the app gave (the driver remembers every reveal and answers from that memory).
- A "some Spanish" learner through the placement check and the first placed session.
- A tester for edge cases: wrong then corrected answers, leaving mid-session, the ✕ dialog, tapping words in a chapter, Look up, the practice modes, and a 1280 px desktop width.

Sessions at units 20, 40 and 58 were rendered headlessly through the app's own `tests/ui/driver.ts` (`tools/playtest/render.ts`), so the upper bands could be read card by card.

Transcripts and screenshots from the audit are in the session scratchpad; the tools reproduce them in a few minutes.

## A. The existing experience

### What works

- **The foundations hold up in use.** Content never arrives before its grammar (the skill-graph gate), reviews are real spaced repetition with separate recognition and production cards, "I don't know" is on every pick card, and the first week really does deliver the promise on the welcome screen: by day 10 the beginner profile could produce "Soy Matt y soy de Toronto" in a scene-less output day and had read two chapters.
- **The teaching ladder is well made.** "Your turn" items mix gap-fill, person change, negation, question-making and translation, and each reveal carries one plain reason: "You're talking about Vale, not yourself, so it's es." / "No goes straight before the verb. There's no do or am not to add." Pitfalls come one slip at a time ("¿Usted eres de Cali? → ¿Usted es de Cali?  Usted takes the same form as he and she: es.").
- **The story is a reason to come back.** Chapter 1 ("Hola, Bogotá") is natural, funny and short; the parrot gets the last word; the close screen's cliffhanger ("Don Hernando still hasn't had his morning tinto. For Hernando, that last one is the real emergency.") is the best line in the app. Tap-to-gloss with "Save word" works on every word.
- **The session shell is considerate.** A progress bar, "About N minutes left", a ✕ dialog with "Keep going / Stop after this part / Leave now", and "I need to stop" after ten minutes.
- **Look up is useful.** "pudimos" finds *poder* and says "preterite (the finished past), nosotros"; grammar entries are grouped by plain-language topic.
- **Upper-band lessons are serious.** At u40 the imperfect subjunctive is taught through hope/wish contrast pairs (Ojalá tengas / Ojalá tuvieras); at u58 temporal connectors are drilled with past/future minimal pairs. Drill days at those levels do interleave input, controlled output and personal questions.
- **Progress after ten days** showed "Things from last week you still have: 45%", "Spanish you produced this week: 36% of practice" and the first can-do ticked: honest, specific numbers.

### What is frustrating or confusing

- A day-1 beginner who does not know *¿Cómo estás?* is asked to type it five times, with only a reveal in between, before the lesson has even started (the learn block re-asks the typed form after every miss, then the recap re-types it).
- The rule screen says "To say who someone is or where they're from, Spanish uses one verb and changes its ending for each person:" and then stops. The forms are behind a small "Why?" link; "Let's try it" is the big green button. The next day's "Quick reminder" repeats the same truncated line.
- "Which word is doing the work here?" offers *vale / tomás / bogotá* and answers "It's tomás." Later: "Use soy or tomás somewhere in it."
- Story questions can be passed by tapping the first option every time (chapter 1: 5 of 5; unit 20: 9 of 9).
- "Talk about you / Answer for yourself" shows "¿De Medellín? Vale también es de Medellín." which is not a question, and accepts "no sé".
- Unit 1's "Real conversation" day has no conversation: its scene needs grammar from units 2 and 4 and is dropped without a word.
- Closing the tab mid-session loses the place, and the next session quietly drops the blocks already shown.
- A learner with real Spanish cannot be placed past the start of A2.

### What feels incomplete

- Nothing explains the week: Home says "Practice: saying who you are..." and "1 of 10 lessons" but not what the ten days are, why today is a drill, or what comes after.
- Weak spots are three rows on Home with a "Train it" each; there is no screen, no history, no mixed drill.
- Progress is counts plus one retention line; nothing records what was wrong or lets the learner go back to it.
- On a 1280 px screen the app is a 450 px phone column with the tab bar floating mid-page.

## B. Functional issues

Numbered for cross-reference with the plan.

1. **The rule card hides the rule.** `ruleLayers()` (`src/ui/session/teachflow.ts`) cuts the "trick" at the first `. ! ? :`. 394 of 916 teaching scripts open with a sentence that ends in a colon (the forms list follows), so the trick is a header and the content is behind "Why?". Also used by the next day's "Quick reminder". Every learner hits this on day 1.
2. **Spot-it and the personal check use people's names.** `nodeWords()` takes every token of the node's `es` when `forms` is null (112 of 172 grammar nodes; `g:ser-identity` reads "Soy Tomás. Soy de Toronto. ¿Y tú, de dónde eres?"). A second cause in `src/check/personal.ts`: *Tomás* is deaccented to *tomas*, which the engine reads as *tomar, tú*.
3. **Story questions are not shuffled.** 646 of 977 chapter answers are option A (reread questions: 447 of 655); `questionCard()` keeps file order.
4. **"Answer for yourself" on statements.** A sentence counts as a question if it contains `¿` anywhere (`src/compiler/content.ts:134`); when the pool is short the compiler pads with statements ("La madera se abría a medida que subía la humedad." at u58). `respondCheck` passes any two Spanish words for non-tú questions.
5. **Drill days with nothing to drill.** 40 grammar nodes have zero bank rows targeting them (1 A1, 8 A2, 10 B1, 13 B2, 8 C1: g:future-conjecture, g:ser-estar-adjectives, g:por-para-2, g:verbs-prepositions, g:agreement-tricky, g:ser-estar-c1, g:sounds-letters, g:narrative-pasts, g:reported-speech-full ...). At u20 the drill after "future of conjecture" was rule recall + writing + new words.
6. **Scenes gated out of their own day.** 29 of 108 scheduled scenes require a non-lexeme node whose priority is after their day (sc-u01-d needs g:commands-usted and g:hay-vs-esta; sc-u17-a needs g:conditional). The compiler logs `sceneProblem` and the learner sees nothing. Chapters are clean (0 of 219).
7. **No mid-session resume.** `Session()` compiles a fresh plan on mount; nothing stores the position. After "Leave now" or a closed tab, the next Start skips what was already shown: the beginner's day 2 lost "Talk about you" and "Write it".
8. **Placement ceiling.** The staircase starts mid-A1 and climbs one level per two correct answers over 14 items; 12 of 14 right placed the "some Spanish" learner at week 5.
9. **Ambiguous word prompts.** "How do you say this in Spanish? course" (el rumbo), "march; gear" (la marcha), "map (city)" (el plano).
10. **Misleading hint on junk input.** "no sé" typed into any sentence card returns "A word is missing."
11. **Review "why" quotes the wrong sentence.** Production reviews explain with the node's example, not the served sentence: "It uses ¿Está Valentina? (is Valentina there?)" under "Sí, con ella. Dígame."; "It uses Se necesita mesero." under "Cuando menos se espera, aparece Altamira."
12. **Two bank rows fail their own check**: "¿El nombre y el apellido, por favor?" (verbless question) and "Por un lado, el programa es largo; por otro lado, el certificado ayuda." (semicolon). The headless walk reports "right answer did not pass".
13. **Smaller.** "Not quite. It's Hi.." (double period). The writing checklist renders an empty "○" row (constraints have no label until text is typed). Look up "casa" matches 51 grammar entries and 0 words because unmet words are hidden. A placed learner's first warm-up says "Nothing to look back at yet". "Read and pick: what does it mean?" (lowercase ask). Placement item "¿Qué pasó con el café? no hay, Tomás." joins a dialogue row with a lowercase second turn. A Spain-Spanish match on translate, transform and recombine cards can show the Spain form in "In Latin America you'll hear ..." because `exercises/index.ts` returns `closest`. The free-practice end screen can say "0 of 1 right first time" after a right-on-retry card.

## C. Learning-experience issues

1. **The learn block grinds.** New items go recognise → pick → type regardless of misses; a miss re-asks the typed form three cards later; the recap types them again. Day 1 naive run: 15 of 19 scored items wrong, and the learner typed "Hola." five times.
2. **Production is rare in week 1**: 20% of practice after five days (Progress screen), against the ≥ 50% target; the first week is almost all three-option recognition.
3. **Upper-band warm-ups are walls of exact translation.** At u40 the warm-up is twelve long en→es sentences in a row ("Mariana's friend got her doctorate in the history of La Candelaria."), graded only against author accept lists. A B1 learner with a valid paraphrase is told "Not yet."
4. **Distractors from forms never taught.** On day 2 of A1 the read-and-pick options include "¿Usted será Rosa?", "Nosotros seremos Tomás y Simón.", "serían", "fue" and the English "I will be from Toronto, in Canada."; a weak-spot workout on day 10 offers *era / sería / fui* against *es / soy*.
5. **Quick review serves what the learner cannot do.** On day 6 the first item was "That's twelve bread rolls." → "Son doce panes." as a production of the chunk *Soy Tomás*.
6. **Free-text blocks pass on form alone and do not say so.** The personal sentence, "Talk about you" and scenes check the day's form and a Spanish-word share. That is the right design without AI, but "no sé" counts as talking about yourself and the copy ("Any true answer works") oversells the check.
7. **The sounds lesson is a pronunciation lesson in a silent app.** Respellings ("meh-deh-YEEN", "HOR-heh") are a fair substitute, but "Your turn" then asks for 14 typed items mostly unrelated to sounds ("Type in Spanish, with both question marks: How are you?") and the personal prompt says "Then say it out loud once."
8. **The week is invisible.** No day map, no "why today is a drill", no way back to yesterday's lesson except Look up.
9. **Weak spots are three rows.** No screen, no miss history, no mixed drill.
10. **Progress is thin.** Counts, one retention line, one can-do; no per-unit scores, no record of errors.

## D. Missing capabilities

Each with the learner problem it solves.

- **Session resume** ("Pick up where you left off"): a 20-minute session on a phone is interrupted often; today an interruption costs the rest of the day's plan.
- **Placement for intermediate and advanced learners**: a self-rating start plus items across features (ser/estar, por/para, clitics, mood), so a B1 learner starts at B1.
- **A Weak spots screen with a mixed drill**, and a close-screen "What you got wrong today" with "Practise these now": turn misses into the next ten minutes of work.
- **An any-time cumulative checkpoint** from Progress, scored per unit: the brief's "cumulative assessments that reveal whether earlier material has been retained".
- **Grammar look-up with examples from sentences the learner has met**, and word look-up that lists unmet words under "Coming up".
- **Reading library and a saved-words deck**: chapters with length and re-read times; saved words become something to practise.
- **A five-minute option** on Home that runs the existing minimum tier without touching the path: the "ten minutes free" case.
- **A week map** on Home and a "Yesterday's lesson" link.
- **Words produced in context**: cloze in a known sentence instead of a bare gloss.
- **Productive review variety**: cloze, transform and translation rotated, with bounded leniency for interchangeable words.

## E. New opportunities (beyond this build)

- Paraphrase-accepting output with burn-authored accepted alternatives per sentence.
- A per-learner error taxonomy page ("Your patterns": ser/estar, por/para, agreement, clitics) built from the diagnosis kinds the checker already produces.
- Story-driven output: a two-turn scripted reply to a character after each chapter, using today's node.
- "Explain this sentence": the engine's analysis of any review sentence rendered in plain English.

## F. The learner journeys

- **Complete beginner.** Day 1 is too hard in the wrong way: the rule is hidden, spot-it is broken, and the learn block demands typing before recognition is secure. From day 2 the drill ladder and the story carry them well. Fixes B1, B2, C1, C4 change this learner's first week more than anything else.
- **Some Spanish, with gaps.** Placement lands them at week 5 whatever they know (B8); after that the seeded reviews come back "now and then", which is fine, but the first warm-up says there is nothing to look back at.
- **Intermediate, stuck on one concept.** Cannot be placed into B1 (B8). Once there, drill days for 10 B1 nodes have no practice (B5), and warm-ups are exact-translation walls (C3). Look up has the scripts but no examples from sentences they have met.
- **Advanced.** C1 content exists and reads well, but reaching it is only possible by playing through; and C1 glosses still call the subjunctive "the wish form".
- **Returning after a break.** Reviews are due and the warm-up handles it; but nothing shows what was weak before the break (C9, C10).
- **Ten minutes free.** Quick review exists but can serve unreasonable items (C5); there is no five-minute path.
- **An hour to spend.** "Do another" and "Keep going" exist; the extended tier adds reading. Fine.

## G. Prioritisation

- **Essential corrections** (break teaching, scoring or trust): B1, B2, B3, B4, B5, B6, B7, B8, B11, B12.
- **High-value improvements**: C1, C3, C4, C5, B9, B10, the smaller B13 items, session resume, placement, the week map.
- **Valuable additions**: weak-spots screen, close-screen misses, checkpoint, reading library and saved words, five minutes, grammar examples, desktop layout.
- **Experimental**: section E.

The implementation plan that follows from this report is in the session plan file and is being executed in three waves on `rebuild`; each wave is verified by typecheck, tests, the gate, the Playwright playtest and a re-drive with `tools/playtest/serve.mjs`.
