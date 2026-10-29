# Fluidez 2 — content writer's brief

You write content for Fluidez, a text-only Spanish course for English-speaking adults, A1→C1.
Every file you write is checked by `npm run gate`; nothing merges until it passes.

## The Spanish
- **Neutral Latin American Spanish**, the kind a Bogotano would find natural and a Mexican would find unremarkable:
  - use *tú*, *usted* and *ustedes*; no *vosotros*, no *os*, no voseo
  - carro, celular, computadora, apartamento, jugo, manejar, tomar (never coger for "take"), boleto/tiquete, ¿me regala…? / ¿me da…? / ¿me pasa…?, plata (informal)
  - Colombian colour is welcome in story dialogue (*chévere*, *parce* among friends, *tinto* = black coffee, *¡qué pena!* = sorry/embarrassing), but core teaching sentences stay neutral.
- **Past tenses follow LatAm usage.** The preterite is the everyday past (*hoy fui*, *¿ya comiste?*). The perfecto appears only for experience and "not yet" (*¿Has estado en Cartagena?*, *todavía no he terminado*).
- **Accents are exact.** Every conjugated verb must be one the engine knows. Run the gate; it will tell you.
- Natural, idiomatic, adult. No textbook stiltedness, no sentence that exists only to show off a tense.

## What the learner may already know
Every sentence must use only grammar, patterns and chunks taught **up to the day it appears**, plus lexemes whose priority ≤ that session.
- Read the unit file, the graph nodes it references, and `content/graph/lexemes.json`.
- Chunks are known as whole phrases from their day, not as grammar.
- The gate computes what each sentence requires. **Always run `npm run gate -- --fix <your files>`**: it writes `requires`/`lexemes`, then reports legality. Rewrite any sentence it flags; never delete a check to pass.

## Natural above all
Every Spanish line must be something a native speaker would actually write or say in that moment. The gate's limits are there to keep the learner inside what they know, but they never excuse unnatural text.
- Story chapters may use grammar up to **15 sessions ahead** of their day (articles, *mi*, *este*, *para* from chapter 1). It is glossed reading input, not a requirement. Lessons, banks, scenes and writing stay strictly at level.
- If a natural line needs a word the learner doesn't know yet, **gloss it** rather than bend the line. Early chapters may gloss up to 20% of their words (sessions under 40) and 10% (under 135). Tap-to-gloss is how the learner reads.
- Never write telegraphic Spanish ("Simón es de Rosa" for "Simón was Rosa's parrot"), and never use English gimmicks (a character speaking broken English, or "Sorry. Closed." lines) to dodge the limits.
- Every exchange must make sense: answers answer questions, characters know what they've been told, companies aren't people.
- If no natural line fits the constraints, say less. One true, simple sentence beats three stilted ones.

## Voice (learner-facing English)
- Plain words, no jargon. Say "talking about where things are", not "estar for location". A technical term may appear once, in `smallPrint`.
- Open with a human reason and a line the learner would actually say.
- Show the example before the rule. A rule takes at most about 150 words to read.
- A correction gives the right version plus one plain reason: "Almost. *Es* tells you what something is; for where it is, Spanish uses *está*."
- Warm, brief, a little playful. A friendly peer, not a professor. No exclamation-mark inflation.
- Contrast with English where it helps. Predict the common mistake.

## The story (one continuous story, in order)
**Cast.** Tomás (34) grew up in Toronto, and his Spanish is rusty. He inherits his grandmother Rosa's café in La Candelaria, Bogotá. The rest of the cast:
- Vale (28), a pastry chef from Medellín
- Don Hernando (71), a retired taxi driver and café regular
- Mariana (33), a journalist
- Simón, the parrot

The developer Altamira is buying up the block. Each unit's `storyArc` says what happens that week. Keep continuity with earlier chapters: read them before writing.

**Chapter shape.**
- Length by level: A1 80–150 words, A2 150–250, B1 300–500, B2 500–700, C1 700–1,000.
- ≥ 98% known words, or ≤ 5% with glosses.
- Every new word of the unit's Input day appears at least twice.
- 3–5 comprehension questions, 2–3 `rereadQuestions` that differ from the first set, and a `hook` line that sets up tomorrow.
- Real stakes, humour, small human moments. The story is why people come back.

## Variety (the old app's worst failing was sameness)
- Never reuse a sentence frame more than a few times per unit, and vary subjects, verbs, places, times and moods.
- Bank sentences must be distinct thoughts, not a template with the noun swapped.
- No two chapters or scenes may share a plot device or an opening.
- The gate's near-duplicate check fails pairs over 0.6 4-gram overlap. Aim far below it.

## No dashes
Never use em dashes, en dashes or spaced hyphens anywhere: not in Spanish, not in English, not in dialogue.
- For dialogue, write each speaker's line as its own sentence, or as `Vale: ¿Ya comiste?`. In a bank `dialogue` sentence, separate the turns with a newline: `¿Ya comiste?\nTodavía no.`
- In English prose, use a full stop, comma, colon or brackets instead.

## Chunks and variants
A Spanish string and its English must be one exact translation pair. Never pack variants into one string with `/`. If a phrase has variants, they are separate pairs.

## Answers people type
- Every `answer`/`accept` must be typeable as written. List real alternatives in `accept`, e.g. "Me llamo Ana" and "Soy Ana" for "My name is Ana" where both are natural.
- Never write a gap with more than one valid answer unless every one of them is listed.
- English prompts must pin down person, number and formality whenever the Spanish depends on them: "you (formal)", "you all".
