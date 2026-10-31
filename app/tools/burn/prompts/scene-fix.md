# Scene fix: writer prompt

Fill in the inputs, then hand everything below the line to the writer.

**Inputs**
- `UNIT`: the unit id, e.g. `u01`
- `SCENE`: the scene id to rewrite, e.g. `sc-u01-d`
- `DAY`: the unit day (1-based) that plays this scene; `SESSION`: that day's session index
- `BAD`: the nodes the scene requires that are taught after that day
- `APP`: `/Users/Matthew/Fluidez/app`
- `SCRATCH`: your own folder in the scratchpad

---

You are rewriting one existing scene, `{APP}/content/scenes/{SCENE}.json`, for unit `{UNIT}`. It parses as `Scene` in `{APP}/src/content/schema.ts`. Write only that file. Do not edit the gate, graph, units or other content. Do not commit.

**The problem.** Day {DAY} of {UNIT} (session {SESSION}) plays this scene, but it requires {BAD}, which the learner has not met by then. The compiler gates the scene out and the day runs with no conversation. Rewrite the scene so that **every turn's NPC line and every `accept`** uses only what is taught up to and including session {SESSION}. Keep the same id, `unit`, `spare` value and title if the title still fits; keep the situation, the cast and the can-do if you can, but change any line that needs a later node. Prefer simpler wording over dropping a turn, and keep 4 to 6 turns, linear, ending with `next: null`.

Probe every line with the legality probe in `tools/burn/prompts/bank.md` §2 at session {SESSION} (no node allowed beyond the day's known set). The rest follows the scenes rules; the whole of `tools/burn/prompts/scenes.md` applies, including the dash and one-exact-pair rules at its end.

## 1. Read first

1. `tools/burn/brief.md` (binding).
2. The current `content/scenes/{SCENE}.json`, `content/units/{UNIT}.json` (what each day teaches, up to day {DAY}), `docs/unit-map.md`, and the sibling scenes in `content/scenes/` (no two scenes may share a plot device or opening).
3. `src/check/writing.ts`: the `Constraint` union (the only `require` types that exist). Constraints must still be satisfied by every `accept`.

## 2. Shape


- `title`: a name, not a summary. `brief`: 2–3 sentences, second person, with the goal and the register ("He's older than you, so use usted").
- **The learner plays a character with fixed facts** (at A1–A2 usually Tomás) so models can be exact: names, cities and jobs in `accept` are knowable. At B1+ the learner may play themselves when intents are open (use constraints, not names).
- **4–6 turns**, linear (`next` → the following id; the last has `next: null`).
- Each turn:
  - `npc` / `npcEn`: what the character says, in character (Vale is quick and dry, Hernando courtly with *usted*, Simón repeats chunks).
  - `intent`: what to do, in plain English, specific enough to have a small answer space ("Say yes, you're Canadian, and ask where she's from").
  - `accept`: **3 models**, different in shape (with/without greeting, word order, *me llamo* / *soy*), each satisfying every `require`.
  - `require`: 0–2 constraints checking the turn's point, e.g. `{ "type": "verbForm", "inf": "trabajar", "tense": "presente", "person": "yo" }`, `{ "type": "negation" }`, `{ "type": "question" }`, `{ "type": "avoidsAny", "words": ["un ingeniero"], "label": "a job after soy takes no un" }`, `{ "type": "avoidsAny", "words": ["eres"], "label": "use usted (es), not tú (eres)" }`. Never require something the intent didn't ask for.
  - `focus`: the one node feedback is about (a grammar, pattern or chunk id taught by then).
- The arc: an opening that drops the learner into the situation, a middle where they must do the unit's can-do (ask *and* answer), a small turn (a surprise, a misunderstanding), and a warm close (thanks, goodbye, a coffee). At least one turn per scene exercises each grammar node of the unit across the set.
- `requires`: fill with the tagger's grammar/pattern/chunk ids over npc lines and accepts (see the snippet below).


After rewriting, fill `requires` with the verify script below (it recomputes it from the new lines); `requires` must then contain no node taught after session {SESSION}. Then run the gate on the file: `cd {APP} && npm run gate -- --fix content/scenes/{SCENE}.json` until 0 errors, and confirm there is no `schedule` finding.

## 4. Verify, then gate

Check every model against its constraints and fill `requires` (save as `{SCRATCH}/sc.ts`, run `cd {APP} && npx tsx {SCRATCH}/sc.ts content/scenes/sc-{UNIT}-*.json`; it rewrites the files):

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { checkWriting } from '/Users/Matthew/Fluidez/app/src/check';
import { loadCurriculum } from '/Users/Matthew/Fluidez/app/tools/gate/load';
import { tagSentence, splitSentences } from '/Users/Matthew/Fluidez/app/src/engine/tagger';
const cur = loadCurriculum('/Users/Matthew/Fluidez/app');
for (const p of process.argv.slice(2)) {
  const sc = JSON.parse(readFileSync(p, 'utf8')); const req = new Set<string>();
  for (const t of sc.turns) {
    for (const s of [t.npc, ...t.accept]) for (const x of splitSentences(s)) for (const n of tagSentence(x, cur.tagOpts).requires) if (!n.startsWith('l:')) req.add(n);
    for (const a of t.accept) for (const c of checkWriting({ constraints: t.require } as any, a).results.filter((x) => !x.pass)) console.log(`${sc.id} ${t.id} FAIL "${a}": ${c.label}`);
  }
  sc.requires = [...req].sort(); writeFileSync(p, JSON.stringify(sc, null, 2) + '\n');
}
```

Then `cd {APP} && npm run gate -- --fix content/scenes/sc-{UNIT}-*.json` until 0 errors. Also try one plausible wrong answer per constrained turn through `checkWriting` and make sure it fails for the right reason.

## 5. Report

Scene ids, titles, turn counts, which node each turn focuses, gate output, and gate false positives as *exact sentence → finding*.

## Rules added after the first playtest (binding; the gate enforces the first two)
- **No dashes.** No em dash (—), en dash (–) or spaced hyphen ( - ) in any learner-facing string, Spanish or English. The gate check `dashes` fails them. Dialogue turns are separate lines: `"¿Ya comiste?\nTodavía no."`, or `Vale: ¿Ya comiste?`. English prose uses commas, colons, brackets or full stops.
- **One exact pair.** Every English string is the exact translation of the Spanish beside it: same person, number, tense and formality. Never pack variants with " / ". A two-turn Spanish string has a two-line English string.
- **Graph nodes carry `forms`.** When you want a node's example lines, read its `forms` (aligned `{es, en}` pairs), not `es` split by hand. The chunk tagger matches every form, so a chunk's wording in `forms` is what it recognises.
- **Chunks gate as wholes.** A sentence inside a taught chunk requires the chunk, not the grammar it seeds; the chunk's `unpacks` node stays in `requires` and a taught chunk stands in for it. Write early content with the chunks the day has taught.
- **The output-day scene is legal on its day.** The scene played on the unit's output day (the one a day's `scene` field names) must require only what is taught up to that day, which is usually the unit's last grammar, so write it with the unit's whole toolkit but nothing from later units. Every spare scene should be legal by a stated day too (say which in your report), so the compiler can serve it for review before the unit ends. `npx tsx tools/supply/day-supply.ts --from {UNIT} --to {UNIT}` prints whether the output day has a usable scene.
