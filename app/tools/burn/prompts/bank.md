# Bank sentences: writer prompt

Fill in the inputs, then hand everything below the line to the writer.

**Inputs**
- `UNIT`: the unit id, e.g. `u04`
- `APP`: `/Users/Matthew/Fluidez/app`
- `SCRATCH`: a private folder of your own, e.g. `<scratchpad>/<UNIT>-bank/` (other agents share the scratchpad; never write loose files at its root)

---

You are writing the sentence bank for unit `{UNIT}`: one file, `{APP}/content/bank/{UNIT}.json`, a JSON array that must parse as `BankSentence[]` in `{APP}/src/content/schema.ts`. Write only that file (plus your own scratch files). Do not edit the gate, the graph, the units or any other content. Do not commit.

The bank is what the session compiler draws on for translation drills, review and warm-ups, for months. Every sentence is a cue the learner will meet more than once, so every one must be worth meeting: natural, adult, distinct.

## 1. Read first, in full

1. `tools/burn/brief.md`. Binding.
2. `content/units/{UNIT}.json`: `theme`, `canDo`, `storyArc`, and every day's `focus`, `chunks`, `lexemes`.
3. Every graph node those days reference (`content/graph/{grammar,patterns,chunks}.json`): read `es`, `en`, `note`, `contrasts`.
4. `content/graph/lexemes.json`: the vocabulary (§2).
5. `docs/unit-map.md` for the cast and the stakes; the unit's chapters in `content/story/` if they exist (your sentences must not repeat their lines — the dupe check compares the whole corpus).
6. The node `sources` in `/Users/Matthew/Fluidez/data/strand-lessons.js` (and `data/grammar.js`) for good examples, pitfalls and contrasts. Convert Peninsular to LatAm (no vosotros, *carro*, *celular*, *jugo*, *tomar* never *coger*).
7. Skim the previous unit's bank, so you neither repeat it nor fall back on its frames.

## 2. What a bank sentence may use

A bank sentence's legality position is the **end of its unit** (the last session of `{UNIT}`). It may use:
- grammar and patterns in any `focus` up to then (a node in no unit is known from its graph `priority`);
- chunks up to then, **only inside the chunk's matched span** (see the traps);
- lexemes whose unit day, or else `priority`, is ≤ that session. Words not in the graph at all only raise one aggregate warning, but the learner has never seen them: use them rarely (a parrot is a *loro*), never as the point of a sentence.

Before writing, list the usable nouns, verbs, adjectives, connectors and names. At A1 the list is tiny (u01: ~200 words, a dozen verbs). Proper nouns are free: cities, barrios, people. Cast names (Tomás, Vale, Hernando, Rosa, Simón, Mariana) are safe anywhere; other names only mid-sentence (a capitalised unknown word at sentence start is read as a lexeme).

**Build a legality probe first** and run every batch through it before assembling. Save as `{SCRATCH}/chk.ts`, run as `cd {APP} && printf '%s\n' "sentence" ... | npx tsx {SCRATCH}/chk.ts <session> [allowNode,...]`:

```ts
import { readFileSync } from 'node:fs';
import { loadCurriculum } from '/Users/Matthew/Fluidez/app/tools/gate/load';
import { tagSentence, accentLint, dialectLint } from '/Users/Matthew/Fluidez/app/src/engine/tagger';
const cur = loadCurriculum('/Users/Matthew/Fluidez/app');
const at = Number(process.argv[2] ?? 10);
const allow = new Set((process.argv[3] ?? '').split(',').filter(Boolean));
let bad = 0;
const lines = readFileSync(0, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
for (const s of lines) {
  const r = tagSentence(s, cur.tagOpts);
  const spans = r.features.filter((x) => (x.key.startsWith('chunk.') || x.key.startsWith('pattern.')) && (cur.taughtAt.get(x.node!) ?? 1e9) <= at).map((x) => x.span);
  const out: string[] = [];
  for (const f of r.features) {
    const n = f.node; if (!n || f.key.startsWith('chunk.') || allow.has(n)) continue;
    if (!cur.graphIds.has(n)) { if (n.startsWith('l:')) out.push('?' + n); continue; }
    const t = cur.taughtAt.get(n) ?? 1e9;
    if (t <= at || spans.some(([a, b]) => f.span[0] >= a && f.span[1] <= b)) continue;
    out.push(`${n}@${t}"${f.text}"`);
  }
  for (const a of accentLint(s, r.tokens)) out.push('ACCENT ' + a.problem);
  for (const d of dialectLint(s, r.tokens)) out.push('DIALECT ' + d.problem);
  if (r.confidence === 'low') out.push('LOW ' + r.lowReasons.join(';'));
  if (out.some((x) => !x.startsWith('?'))) bad++;
  if (out.length) console.log(s + '  ->  ' + out.join(' | '));
}
console.log(`${bad}/${lines.length} bad`);
```

`node@N"text"` means "taught at session N" — rewrite. `?l:x` means "not in the graph" — allowed, but think twice. Probe your planned frames (questions, *muy*, possessives, feminine adjectives, infinitives after *quiero*/*puedo*) before writing a hundred sentences on them.

**Known tagger/gate traps (u01–u03; recheck, the coordinator fixes them over time)**
- A chunk covers only its matched span. A periphrasis whose feature spans more than the chunk is illegal: *Tengo que trabajar* ✗ but *Tengo que trabajar mañana* ✓ (the exact example); *Quiero / Puedo + infinitive* ✗ until the infinitive node, except the chunk's own examples.
- One-word fragments of a chunk's `es` never match (*Igualmente*, *Disculpe*, *¿Entiendes?*, *Listo*, *Claro* alone, *Hola* alone), nor do fragments that share no word with the chunk id (*Hasta mañana* under c:chao-nos-vemos, *¿Qué significa…?* under c:como-se-dice, *Hablé con Vale* under c:compre-trabaje, *¿Dónde vives?* under c:vivo-en, *Todavía no* under c:ya-comiste). Treat these as untaught.
- *¿De dónde es usted?* trips g:questions-prepositions; only *¿De dónde eres?* is covered.
- Sentence-initial *Don*, *La*, *Nombre*, *Ayudas*, *Nada* are misread (lexeme *don*, article, command *nombrar*, noun *ayuda*, verb *nadar*). Put them mid-sentence.
- Feminine forms of some job nouns are separate late lexemes (*profesora*, *médica*, *amiga*: priority 199); *ingeniera*, *mesera* are fine.
- Quoted foreign words (*¿Cómo se dice "receipt"?*) give a low-confidence warning each. Use Spanish words in that frame (*¿Cómo se dice tinto en inglés?*).
- Early-session blockers worth remembering: articles (6), *muy/mucho* (63), *mi/tu/su* (44), *este/esa* (59), feminine/plural adjective agreement (40), question words outside chunks (16), *por/para* (164), *cuando* (160), *si* (154), *aunque* (226), *nada/nunca* after *no* (69), -mente adverbs (236), object pronouns (92).

## 3. How many, and of what

From `content/_reports/quotas.json` → `units.{UNIT}`:
- **Total** = `ceil(1.15 × p95Demand.sentences)` (quotas.json is the only quota source; units carry none). (`bankSentences` in quotas.json is the factor-3 long-run supply; the first pass aims at p95 plus headroom. u01: p95 881 → wrote 1,100.)
- **Per node minimum**, counted by `targets`:
  - every grammar node first introduced in the unit: **≥ 120**
  - every pattern in a day's `focus`: **≥ 40**
  - every chunk introduced in the unit: **≥ 10**
  - every lexeme on the unit's days: **≥ 6**, in varied contexts (not six sentences with the same frame)
- Some nodes have no tagger feature and can never be a `target` (u01: `g:sounds-letters`, `p:ser-profession-no-article`). Write the sentences anyway (jobs with no article, words with accents) and list the gap in your report.
- **Early-legal rows (the compiler's constraint).** The gate places a row at the end of its unit, but the session compiler serves a row only when everything it requires is taught by the day it is used. So for **each grammar or pattern node** you target, at least **12 rows must use ONLY what is taught up to and including the node's first day** (its first appearance in a day's `focus`), and at least **6 of those 12 must be questions** (`¿…?`, for the communicative drill). Before writing, name that day, list what is allowed (the grammar, patterns and chunks of days 1 to that day of this unit and of every earlier unit, plus the lexemes carried by those days), and probe those rows with `chk.ts <that day's session>` and the node allowed. Words that no unit day carries (known only from their graph `priority`) are not introduced by the compiler, so avoid them in these rows. Rows that are legal only at the unit end are fine for the rest of the node's quota.
- Mix `kind`: roughly 55% `statement`, 20% `question`, 25% `dialogue` (a line someone would say in a conversation: replies, greetings, requests).

## 4. Quality bar

- **Variety** (the old app's worst failing). Each batch is a theme, not a frame: greetings, origin, jobs, café, what people do, survival phrases, plans and yesterday, small talk, names and papers, story-flavoured lines. Within a theme, vary subject (yo/tú/usted/él/ella/nosotros/ellos/ustedes and names), verb, place, polarity, sentence type and length (2 to 12 words). No 2-word opener in more than a quarter of the unit; no frame repeated more than a few times; never swap one noun and call it a new sentence.
- **Story colour**: a fifth of the bank should be in the cast's world (the café, Altamira, Simón the parrot, the week's `storyArc`) without retelling the chapters.
- **English `en`**: natural, idiomatic, and it pins down what the Spanish depends on: "(to a friend)", "(polite)", "(you all)", "(a woman speaking)", "(to a man)". A learner translating `en` back must be able to land on your `es`.
- **`accept`**: real alternatives the matcher would otherwise reject: *Me llamo Ana* / *Soy Ana*; *¿Usted es de Cali?* / *¿Es usted de Cali?* / *¿Es de Cali?*; *¿Cuánto cuesta?* / *¿Cuánto vale?*. Each `accept` must be legal too. Do not list subject-pronoun variants (the matcher handles them).
- **Spanish**: neutral LatAm, adult, exact accents, every question with `¿…?`, every exclamation with `¡…!`. No ellipsis, slashes or brackets in `es` or `accept` (they must be typeable).
- **Facts**: keep the cast consistent with `docs/unit-map.md` (Vale is from Medellín, Tomás from Toronto, Rosa is dead, Hernando was a taxi driver, Simón is a parrot).

## 5. Procedure

1. Write batches of 80–130 lines in `{SCRATCH}/bN.txt`, one theme per batch, in this format (`D:` marks `kind: dialogue`; a `¿` makes it a question; `# theme:` sets `theme`):
   ```
   # theme: café basics
   ¿Me regala un agua? | Could I have a water? |
   D:Listo, dos tintos. | OK, two black coffees. |
   ¿Usted compra el pan? | Are you buying the bread? (polite) | ¿Compra usted el pan?;¿Compra el pan?
   ```
2. Probe each batch (`python3 -c` or a 10-line script that prints `es` and each `accept`, piped to `chk.ts <last session of the unit>`). Rewrite every flagged line — change the idea, not just the word.
3. Assemble with `{SCRATCH}/build.ts` (below): ids `{UNIT}-0001…`, `requires` from the tagger, `targets` = requires ∩ what this unit teaches, `source: "gen"` (or the old lesson id if mined), and a SHORT list against the §3 minima. Write more until nothing teachable is short.
   ```ts
   import { readFileSync, writeFileSync } from 'node:fs';
   import { loadCurriculum } from '/Users/Matthew/Fluidez/app/tools/gate/load';
   import { tagSentence } from '/Users/Matthew/Fluidez/app/src/engine/tagger';
   const APP = '/Users/Matthew/Fluidez/app', cur = loadCurriculum(APP), unit = process.argv[2];
   const u = JSON.parse(readFileSync(`${APP}/content/units/${unit}.json`, 'utf8'));
   const teach = new Set<string>(u.days.flatMap((d: any) => [...d.focus, ...d.chunks, ...d.lexemes]));
   const out: any[] = []; let theme = '';
   for (const f of process.argv.slice(3)) for (let line of readFileSync(f, 'utf8').split('\n')) {
     line = line.trim(); if (!line) continue;
     if (line.startsWith('#')) { theme = line.match(/theme:\s*(.*)/)?.[1] ?? theme; continue; }
     const p = line.split('|').map((x) => x.trim()); let es = p[0], kind = 'statement';
     if (es.startsWith('D:')) { es = es.slice(2); kind = 'dialogue'; } else if (es.includes('¿')) kind = 'question';
     const r = tagSentence(es, cur.tagOpts);
     out.push({ id: `${unit}-${String(out.length + 1).padStart(4, '0')}`, es, en: p[1], accept: p[2] ? p[2].split(';').map((x) => x.trim()).filter(Boolean) : [], acceptEn: [], requires: r.requires, targets: r.requires.filter((x) => teach.has(x)), kind, unit, theme, source: 'gen' });
   }
   writeFileSync(`${APP}/content/bank/${unit}.json`, JSON.stringify(out, null, 2) + '\n');
   const cnt = new Map<string, number>(); for (const b of out) for (const t of b.targets) cnt.set(t, (cnt.get(t) ?? 0) + 1);
   const need = (id: string) => id.startsWith('g:') ? 120 : id.startsWith('p:') ? 40 : id.startsWith('c:') ? 10 : 6;
   console.log('total', out.length); for (const id of teach) if ((cnt.get(id) ?? 0) < need(id)) console.log('SHORT', id, cnt.get(id) ?? 0, '/', need(id));
   ```
   Run: `cd {APP} && npx tsx {SCRATCH}/build.ts {UNIT} {SCRATCH}/b1.txt {SCRATCH}/b2.txt …` (always rebuild from the batch files; fix sentences in the batch files, never in the JSON).
4. Gate loop until 0 errors: `cd {APP} && npm run gate -- --fix content/bank/{UNIT}.json`. The printed list is capped at 40 lines; to see every finding, run the gate through its API (`runGate({ paths, fix: true })` from `tools/gate.ts`) and print `findings`. Typical fixes:
   - **dupe (exact)** with a chapter or another unit's bank: rewrite yours (add a name, change the situation). Formulaic chunk lines (*Más despacio, por favor.*) are the usual victims.
   - **dupe (near, ≥0.6)**: change the frame, not one word. Warnings at 0.45–0.6: fix the worst.
   - **typeable**: no `…`, `/`, `()`, `_`.
   - **legality**: rewrite (never remove a check). If you think the gate is wrong, note the exact sentence and finding for your report, and still rewrite.
5. Read the finished bank once, top to bottom, as the learner. Cut anything stilted, contradictory with the story, or that only shows off a form.

## 6. Report

Counts (total, by kind, per target node; anything still short and why), the gate's last line, 5 sample sentences, and every gate false positive you met as *exact sentence → finding*, so the coordinator can fix the gate.

## Rules added after the first playtest (binding; the gate enforces the first two)
- **No dashes.** No em dash (—), en dash (–) or spaced hyphen ( - ) in any learner-facing string, Spanish or English. The gate check `dashes` fails them. Dialogue turns are separate lines: `"¿Ya comiste?\nTodavía no."`, or `Vale: ¿Ya comiste?`. English prose uses commas, colons, brackets or full stops.
- **One exact pair.** Every English string is the exact translation of the Spanish beside it: same person, number, tense and formality. Never pack variants with " / ". A two-turn Spanish string has a two-line English string.
- **Graph nodes carry `forms`.** When you want a node's example lines, read its `forms` (aligned `{es, en}` pairs), not `es` split by hand. The chunk tagger matches every form, so a chunk's wording in `forms` is what it recognises.
- **Chunks gate as wholes.** A sentence inside a taught chunk requires the chunk, not the grammar it seeds; the chunk's `unpacks` node stays in `requires` and a taught chunk stands in for it. Write early content with the chunks the day has taught.
