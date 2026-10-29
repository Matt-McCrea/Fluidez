# Scenes: writer prompt

Fill in the inputs, then hand everything below the line to the writer.

**Inputs**
- `UNIT`: the unit id, e.g. `u04`
- `SCENES`: the scene ids, `sc-{UNIT}-a`, `sc-{UNIT}-b`, … — as many as `content/_reports/quotas.json` → `units.{UNIT}.scenes` (u01: 3). The one named in a day's `scene` field is played that day; the others are spares for review and replays.
- `APP`: `/Users/Matthew/Fluidez/app`
- `SCRATCH`: your own folder in the scratchpad

---

You are writing scenes `{SCENES}` for unit `{UNIT}`. Each is one file, `{APP}/content/scenes/<id>.json`, and must parse as `Scene` in `{APP}/src/content/schema.ts`. Write only those files. Do not edit the gate, graph, units or other content. Do not commit.

A scene is a **goal-oriented typed conversation**: an NPC speaks, the learner has an intent in plain English, types a reply, and the checker gives feedback on one feature. No AI in the app: the learner's reply is judged by the matcher against your `accept` models and by the checker against your `require` constraints. So every turn must have a narrow enough intent that 3+ models cover most good answers.

## 1. Read first

1. `tools/burn/brief.md` (binding).
2. `content/units/{UNIT}.json` (`canDo`, `storyArc`, days and their nodes), `docs/unit-map.md`, the unit's chapters in `content/story/` and earlier scenes in `content/scenes/` (no two scenes may share a plot device or opening).
3. `src/check/writing.ts`: the `Constraint` union (the only `require` types that exist): `verbForm {inf, tense, person}`, `verbFormAny {inf, tense}`, `anyVerbInTense {tense}`, `person {person}`, `infinitiveUsed {inf}`, `verbType {ending}`, `containsWord {word}`, `containsAny {words}`, `minWords {n}`, `maxWords {n}`, `question`, `negation`, `regex {pattern, flags?}`, `avoidsAny {words}`, `avoidsPerson {person}`, `subjunctiveAfter {trigger, within?}`, `cliticCluster`, `sePassive`, `distinctTenses {n}`, `minSentences {n}`, `connectorFrom {class, n?, minLevel?}`. Persons: `yo`, `tú`, `él/ella` (also usted), `nosotros`, `ellos` (also ustedes). Tenses: `presente`, `preterito`, `imperfecto`, `futuro`, `condicional`, … (`TENSES` in `src/engine/conjugate.ts`). Every constraint may carry a learner-facing `label`.

## 2. What a scene may use

Legality position: the scene's day (`sceneAt`) if a day names it, else the end of the unit. NPC lines **and** every `accept` must be legal (probe them with the legality probe in `tools/burn/prompts/bank.md` §2). NPC lines also count for the corpus dupe check: don't reuse a bank or chapter line verbatim.

## 3. Shape

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
