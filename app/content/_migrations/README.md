# Content migrations

A learner's saved progress names the course by id (nodes, bank rows, chapters, scenes, writing tasks) and by place (a day's stable key). This table says what became of an id that has shipped and is not in the course under that name any more. It is append-only: a file that has shipped is never edited, a correction is a new file, and the numbers run 1, 2, 3 with no gaps. The highest number is the content version.

At boot, `reconcile` (`src/learner/reconcile.ts`) brings a learner's documents through every file past the version they were last settled at. The gate (`npm run gate`) fails an id that shipped, is gone, and has no entry here.

## What needs an entry

| You did | Write |
|---|---|
| Moved a day, inside its unit or into another | Nothing. A day keeps its key; reconcile finds it. A day that moved in front of a learner owes them what it teaches |
| Moved a node to another day | Nothing. A node taught in front of a learner who never got it is owed |
| Added a day | Run `npm run shipped -- keys`, which gives it the next free key. Never reuse or renumber a key |
| Renamed a node, a bank row, a chapter, a scene or a writing task | `{ "id": N, "note": "why", "nodes": { "rename": { "l:old": "l:new" } } }` (also `rows`, `chapters`, `scenes`, `tasks`) |
| Retired a node or a row | `"nodes": { "remove": ["l:gone"] }`. The learner's record is kept whole, apart, never deleted |
| Replaced a day's key, or ended a day | `"days": { "u07-d3": "u07-d9" }`, or `null` for a day that is gone |

A retired id is never used again. Rename targets must exist in the content.

## At a release

1. `npm run gate` passes (it checks the above).
2. `npm run reconcile -- <your backup.json>` shows what the build will do to a real learner. Read it.
3. `npm run shipped -- snapshot` adds the course's ids to `content/_shipped/ids.json`, which only grows.

`content/_shipped/path.json` is where every day stood when a learner's place was two integers. It was written once and is never regenerated.
