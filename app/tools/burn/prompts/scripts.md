# Teaching scripts: writer prompt

Fill in the inputs, then hand everything below the line to the writer.

**Inputs**
- `UNIT`: the unit id, e.g. `u04`
- `NODES`: the nodes needing a script — every grammar node **first introduced** in the unit (first appearance in any day's `focus`, course-wide) and every pattern node in the unit's day `focus` lists, e.g. `g:estar-location-states p:bien-mal-vs-bueno-malo`
- `APP`: `/Users/Matthew/Fluidez/app`
- `SCRATCH`: your own folder in the scratchpad

---

You are writing the teaching scripts for `{NODES}` in unit `{UNIT}`. Each is one file, `{APP}/content/scripts/<node id with ':' replaced by '_'>.json` (e.g. `g_ser-identity.json`), and must parse as `TeachingScript` in `{APP}/src/content/schema.ts`. Write only those files. Do not edit the gate, graph, units or other content. Do not commit.

A script is the Introduce-day lesson for one node: the 10 minutes in which the learner meets it. The app is **text-only** (no audio), **no AI**, and the learner is an English-speaking adult.

## 1. Read first, in full

1. `tools/burn/brief.md` (binding: voice, LatAm Spanish, accents).
2. `content/units/{UNIT}.json` and the graph node for each script (`content/graph/grammar.json` / `patterns.json`): `title`, `es`, `en`, `note`, `contrasts`, `requires`, `sources`.
3. The node's `sources` in `/Users/Matthew/Fluidez/data/strand-lessons.js` (and `data/grammar.js`): mine examples, pitfalls, contrasts, the plain-English explanation. Convert Peninsular to LatAm.
4. `/Users/Matthew/Fluidez/docs/research/Structuring Spanish Learning for English-Speaking Adults.md`, section "Worked example lessons" (the Introduce-day timeline this anatomy comes from).
5. Earlier scripts in `content/scripts/` for the house style (u01's five are the reference).

## 2. What a script may use

A script's legality position is **the session on which its node is first in a day's `focus`**, and the node itself is allowed. So the u01 *ser* script (session 1) has no articles, no *-ar* verbs and about 130 words, mostly function words; the *-ar* script (session 8) has everything up to day 8. Chunks count only inside their matched span. Words not in the graph pass with a warning but the learner has not met them.

Probe every Spanish line first with the legality probe from `tools/burn/prompts/bank.md` §2, passing the session and the node: `… | npx tsx {SCRATCH}/chk.ts <session> <node>`. The Spanish fields the gate checks: `hook.es`, `examples[].es`, `readAndPick[].es`, `yourTurn[].answer` and `accept`, `pitfalls[].right`. `pitfalls[].wrong` is deliberately wrong and never linted. English fields and `rule` are not linted, so the rule may quote Spanish freely — but keep it consistent with what the learner has seen.

## 3. Anatomy (all required unless marked)

- **`hook`**: `line` = the human reason, in one or two plain sentences ("The first thing anyone in Bogotá will want to know is who you are…"); `es`/`en` = a line the learner would actually say, ideally from the story's world.
- **`examples`** (≥ 3; aim for 6): before the rule. Vary person, polarity, statement/question. `en` pins person and formality.
- **`rule`** (≤ 150 words, ~90 s reading): plain English, no jargon, built on the examples. Contrast with English and say what disappears or changes. Lists of forms are fine as short lines.
- **`smallPrint`**: the technical term, once ("Teachers call this…").
- **`soundTip`** (optional): only where a new sound matters. Describe it against English ("rhymes with *boy*", "like the *tt* in an American *better*"). Never assume audio.
- **`readAndPick`** (≥ 8): structured input. Spanish `es`, 2–3 English `options`, `answer` index. It must be **solvable only by noticing the form** (ending, article, mark, word order): options differ in exactly the thing being taught (*Somos de Cali* → we / they / I). Vary the position of the right answer.
- **`yourTurn`** (≥ 6): a ladder: **choose** (gap + two forms, type the whole sentence) → **type** (English prompt, Spanish answer) → **transform** (make it negative / plural / about *we* / polite). Each has `why`: one plain sentence, the reason in the learner's terms. `accept` lists real alternatives (word-order variants, *Me llamo* / *Soy*); every answer and accept must be typeable and legal.
- **`pitfalls`** (3–5): predicted English-speaker mistakes, `wrong` → `right` + `why` in one sentence ("Almost. *Es* tells you what something is…").
- **`personal`**: a closing prompt to say something true about yourself with the new form.

**Patterns** (`p:` nodes) are shorter but complete: 4–6 examples, a rule of ≤ 100 words, 8 readAndPick, 6–7 yourTurn, 3 pitfalls. Their readAndPick usually contrasts the pattern with what an English speaker would write (*Soy mesero* = a waiter vs *Soy el mesero* = the waiter).

## 4. Quality bar

- Warm, brief, a little playful; a friendly peer. No exclamation-mark inflation.
- Every Spanish sentence is something a Bogotano would actually say. No sentence that exists only to show off a form.
- The learner can do every `yourTurn` from what the script showed. No trick questions.
- Prompts pin person, number and formality whenever the answer depends on it ("to a friend", "you all", "a woman speaking").
- When the vocabulary at that session is too thin for the node's own title (u01's *-ar* script before *hablar* was placed), use the verbs you have and say so in your report.

## 5. Gate loop

`cd {APP} && npm run gate -- --fix content/scripts/<file>.json …` until 0 errors. A warning that a script's node "is not scheduled in any unit" means you have the wrong node id. Fix legality by rewriting the Spanish, never by removing checks.

## 6. Report

Per script: counts (examples / readAndPick / yourTurn / pitfalls), anything you could not teach because of the session's vocabulary, and gate false positives as *exact sentence → finding*.

## Rules added after the first playtest (binding; the gate enforces the first two)
- **No dashes.** No em dash (—), en dash (–) or spaced hyphen ( - ) in any learner-facing string, Spanish or English. The gate check `dashes` fails them. Dialogue turns are separate lines: `"¿Ya comiste?\nTodavía no."`, or `Vale: ¿Ya comiste?`. English prose uses commas, colons, brackets or full stops.
- **One exact pair.** Every English string is the exact translation of the Spanish beside it: same person, number, tense and formality. Never pack variants with " / ". A two-turn Spanish string has a two-line English string.
- **Graph nodes carry `forms`.** When you want a node's example lines, read its `forms` (aligned `{es, en}` pairs), not `es` split by hand. The chunk tagger matches every form, so a chunk's wording in `forms` is what it recognises.
- **Chunks gate as wholes.** A sentence inside a taught chunk requires the chunk, not the grammar it seeds; the chunk's `unpacks` node stays in `requires` and a taught chunk stands in for it. Write early content with the chunks the day has taught.
- **Italicise Spanish in English prose.** In `hook.line`, `rule`, `smallPrint`, `soundTip`, `yourTurn[].prompt`/`why`, `pitfalls[].why` and `personal`, wrap every Spanish word or phrase in *asterisks* (the UI renders *x* as italic Spanish): "Use *está* for where something is." Never italicise fields that are wholly Spanish.
