# Writing tasks: writer prompt

Fill in the inputs, then hand everything below the line to the writer.

**Inputs**
- `UNIT`: the unit id, e.g. `u04`
- `COUNT`: `content/_reports/quotas.json` → `units.{UNIT}.writingTasks` (u01: 15)
- `APP`: `/Users/Matthew/Fluidez/app`
- `SCRATCH`: your own folder in the scratchpad

---

You are writing `{COUNT}` writing tasks for unit `{UNIT}`: one file, `{APP}/content/writing/{UNIT}.json`, a JSON array that must parse as `WritingTask[]` in `{APP}/src/content/schema.ts`. Write only that file. Do not edit the gate, graph, units or other content. Do not commit.

A writing task is a short real-world message the learner composes; the checker verifies it against declarative constraints (live checklist), then reveals your `model` for self-comparison. No AI in the app, so the constraints carry the feedback.

## 1. Read first

1. `tools/burn/brief.md` (binding).
2. `content/units/{UNIT}.json`, its graph nodes, `docs/unit-map.md` (cast and stakes).
3. `src/check/writing.ts`: the `Constraint` union (the only types that exist) — see the list in `tools/burn/prompts/scenes.md` §1. Persons: `yo`, `tú`, `él/ella` (also usted), `nosotros`, `ellos` (also ustedes).

## 2. Shape

Each task: `id` (`w-{UNIT}-01`…), `unit`, `prompt`, `minWords`, `maxWords`, `constraints`, `model`, `focus`, `requires`.

- **Size by band**: A1 2–4 sentences (6–30 words); A2 3–6 sentences (25–60); B1 60–120 words; B2 120–200; C1 150–250.
- **`prompt`**: a real situation with a reader and a reason (a text to Mariana, a note to Vale, a form for the notary, a reply to a customer), in plain English, pinning register ("an older stranger you'd call usted", "someone your age").
- **`constraints`** (2–4): check the unit's point, not trivia. Good shapes:
  - a form: `{ "type": "verbForm", "inf": "ser", "tense": "presente", "person": "nosotros" }`
  - register: `{ "type": "avoidsAny", "words": ["eres", "trabajas"], "label": "usted, not tú" }`
  - a pattern's classic error: `{ "type": "avoidsAny", "words": ["soy un ", "es una ingeniera", …], "label": "no un or una before the job" }`
  - content: `containsWord`, `containsAny`, `question`, `negation`, `minSentences`
  - counting articles or structures: `regex` (case-insensitive by default; escape backslashes in JSON)
  Give each non-obvious constraint a learner-facing `label`.
- **`model`**: written by a native speaker for that learner: legal at the end of the unit, passes every constraint, within its own word limits, natural (the learner will copy its phrasing). Use only names that are safe in the tagger (cast names anywhere; other names mid-sentence).
- **`focus`**: the one node the task practises. Spread tasks across all the unit's grammar and patterns, plus a few on its key chunks.
- **`requires`**: the tagger's grammar/pattern/chunk ids over the model (snippet below).
- Variety: 15 tasks = 15 different situations and readers. No two prompts with the same opening.

## 3. Verify, then gate

Save as `{SCRATCH}/wr.ts`; it fills `requires` and lets you test a wrong answer per task (add yours to `neg`):

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { checkWriting } from '/Users/Matthew/Fluidez/app/src/check';
import { loadCurriculum } from '/Users/Matthew/Fluidez/app/tools/gate/load';
import { tagSentence, splitSentences } from '/Users/Matthew/Fluidez/app/src/engine/tagger';
const cur = loadCurriculum('/Users/Matthew/Fluidez/app');
const p = process.argv[2]; const ws = JSON.parse(readFileSync(p, 'utf8'));
for (const w of ws) { const req = new Set<string>(); for (const x of splitSentences(w.model)) for (const n of tagSentence(x, cur.tagOpts).requires) if (!n.startsWith('l:')) req.add(n); w.requires = [...req].sort(); }
writeFileSync(p, JSON.stringify(ws, null, 2) + '\n');
const neg: Record<string, string> = { /* 'w-u01-05': 'Soy un ingeniero.' */ };
for (const w of ws) if (neg[w.id]) { const r = checkWriting({ constraints: w.constraints }, neg[w.id]); console.log(w.id, r.allPass ? 'WRONG ANSWER PASSES' : 'rejected: ' + r.results.filter((x: any) => !x.pass).map((x: any) => x.label).join('; ')); }
```

Run `cd {APP} && npx tsx {SCRATCH}/wr.ts content/writing/{UNIT}.json`, then `npm run gate -- --fix content/writing/{UNIT}.json` until 0 errors. The gate checks each model against its own constraints and word limits, and the model's legality at the end of the unit.

## 4. Report

Count, the focus of each task, the gate's last line, and gate false positives as *exact sentence → finding*.

## Rules added after the first playtest (binding; the gate enforces the first two)
- **No dashes.** No em dash (—), en dash (–) or spaced hyphen ( - ) in any learner-facing string, Spanish or English. The gate check `dashes` fails them. Dialogue turns are separate lines: `"¿Ya comiste?\nTodavía no."`, or `Vale: ¿Ya comiste?`. English prose uses commas, colons, brackets or full stops.
- **One exact pair.** Every English string is the exact translation of the Spanish beside it: same person, number, tense and formality. Never pack variants with " / ". A two-turn Spanish string has a two-line English string.
- **Graph nodes carry `forms`.** When you want a node's example lines, read its `forms` (aligned `{es, en}` pairs), not `es` split by hand. The chunk tagger matches every form, so a chunk's wording in `forms` is what it recognises.
- **Chunks gate as wholes.** A sentence inside a taught chunk requires the chunk, not the grammar it seeds; the chunk's `unpacks` node stays in `requires` and a taught chunk stands in for it. Write early content with the chunks the day has taught.
- **Every grammar node gets two tasks legal by its drill day.** Each grammar node (`g:`) the unit teaches gets at least two tasks focused on it whose constraints and model use only what is taught up to that node's drill day (name the day in your notes: "g:x, drill day 4"). The session compiler serves a task on the drill day only when its `requires` are all taught by then, so a task that needs a later node never gets served. After filling `requires`, check each task's list against the days up to its focus node's drill day (`npx tsx tools/supply/day-supply.ts --from {UNIT} --to {UNIT}` prints the shortfall).
