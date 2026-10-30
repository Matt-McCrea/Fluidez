---
description: One tick of the unattended Fluidez content burn — lease ready jobs, run them as a Workflow, gate, commit on `rebuild`. `/burn status` prints the queue.
argument-hint: "[status | N]"
---

You are the Fluidez burn runner. This runs **unattended** (headless `claude -p "/burn"` from launchd every 15 min, or `/loop 15m /burn` in a session). Nobody is watching: never ask questions, never wait for input, never improvise beyond these steps. Every step is safe to repeat. When in doubt, release what you hold and exit.

Arguments: `$ARGUMENTS`

All commands run from `/Users/Matthew/Fluidez/app`. **The shell is zsh: an unquoted `$var` holding several paths is NOT split into words.** Pass every output path as its own literal argument, or run any loop inside `bash -c '…'`. `Q` below means `npx tsx tools/queue.ts`. Use absolute paths; `cd /Users/Matthew/Fluidez/app &&` at the start of every Bash call.

## Mode: `status`

If the arguments start with `status`: run `cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts status` and print its output verbatim (it already includes the last gate summary and who holds `burn.lock`). Then print the last 15 lines of `content/_queue/burn.log` if it exists, and `git log --oneline -10 rebuild`. Stop. Do nothing else.

## Mode: run (default)

N = the number in the arguments if there is one, else **4**. Never more than 12. Matthew set this scale on 2026-10-30 to push more content through: run every leased job in the one Workflow fan-out below, even when that is more than ten agents.

Set once and reuse: `RUN=burn-$(date +%Y%m%dT%H%M%S)-$RANDOM` (generate it in your first Bash call and remember the literal value).

### 1. Lock

```
cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts burn-lock acquire --by $RUN --stale-min 90
```

- Exit code 3 → another burn holds a fresh lock. Print `burn: another run holds burn.lock (<message>); exiting.` and **stop immediately**. Do not touch anything else.
- Any other non-zero exit → print the error and stop.

From here on, **every exit path must run step 8 (release)**, including errors.

### 2. Preconditions (fail → release lock, exit)

1. `git -C /Users/Matthew/Fluidez rev-parse --abbrev-ref HEAD` must print exactly `rebuild`. If not: print `burn: not on branch rebuild (on <x>); refusing to run.` and go to step 8. **Never** switch branches, never commit to `main`.
2. No merge/rebase in progress: `git -C /Users/Matthew/Fluidez status` must not mention "rebase", "merge" or "cherry-pick" in progress. Otherwise exit via step 8.
3. `test -f tools/gate.ts` — if the gate does not exist yet, print `burn: tools/gate.ts missing; nothing can be marked done.` and exit via step 8 (do **not** lease anything).

### 3. Requeue and lease

```
cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts requeue-stale
cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts next --n N --by $RUN --lease-min 90 > content/_queue/runs/$RUN.leased.json
```

(Create `content/_queue/runs/` first with `mkdir -p`.) Read that file. It is a JSON array of jobs; each has `id, kind, band, unit, model, outputs, resolvedPrompt` (the prompt plus, on a retry, the previous gate failure). If the array is empty: print `burn: nothing ready.` followed by `Q status` and exit via step 8.

Snapshot the working tree so stray writes can be detected later:
```
cd /Users/Matthew/Fluidez && git status --porcelain=v1 -uall > app/content/_queue/runs/$RUN.before.txt
```

### 4. Run the jobs as one Workflow fan-out

First write each job's prompt to its own file, so the Workflow args stay small:

```
cd /Users/Matthew/Fluidez/app && node -e 'const fs=require("fs");const run=process.argv[1];const j=JSON.parse(fs.readFileSync(`content/_queue/runs/${run}.leased.json`));console.log(JSON.stringify({jobs:j.map(x=>{const f=`content/_queue/runs/${run}.${x.id}.prompt.md`;fs.writeFileSync(f,x.resolvedPrompt);return {id:x.id,kind:x.kind,band:x.band,unit:x.unit,model:x.model,outputs:x.outputs,resolvedPrompt:`Read your full job prompt from /Users/Matthew/Fluidez/app/${f} (read it completely before starting) and follow it.`}})}))' $RUN
```

Call the **Workflow** tool once with this script and the printed object as `args` (pass a real JSON object, not a string). The Workflow runs in the background: after launching it, **wait for its completion notification** before step 5. Do not end your turn or exit while it runs (in a headless run, keep working only by waiting; if your harness cannot wait, refresh the lock and poll `Q show <id>` is not enough — results only arrive via the notification).

```js
export const meta = {
  name: 'fluidez-burn',
  description: 'Run leased Fluidez content jobs, one agent per job',
  phases: [{ title: 'Jobs', detail: 'one agent per leased job, with its own model' }],
}
const RESULT = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    files: { type: 'array', items: { type: 'string' } },
    gatePassed: { type: 'boolean' },
    summary: { type: 'string' },
    limitHit: { type: 'boolean' },
  },
  required: ['ok', 'files', 'gatePassed', 'summary', 'limitHit'],
}
const brief = (j) => [
  `You are running Fluidez content job ${j.id} (kind ${j.kind}, band ${j.band}${j.unit ? `, unit ${j.unit}` : ''}).`,
  `Working directory: /Users/Matthew/Fluidez/app. The content contract is src/content/schema.ts: every file you write must parse against it; never invent fields.`,
  `You may create or overwrite ONLY these files (paths relative to app/):`,
  ...j.outputs.map((o) => `  - ${o}`),
  `Rules: write nothing else (no scratch files in the repo, no edits to code, schema, queue or other content). Do not run git. Rewrite each output in full so a rerun gives a complete file, not an append.`,
  `When the files are written, run: cd /Users/Matthew/Fluidez/app && npm run gate -- ${j.outputs.join(' ')}`,
  `If it fails, fix the reported problems in your outputs and run it again, at most twice more. Report the final result honestly.`,
  `If any tool or model call fails with a usage limit, rate limit, quota or 429/529 error, stop at once and return limitHit: true.`,
  ``,
  `--- The job ---`,
  j.resolvedPrompt,
].join('\n')
phase('Jobs')
const results = await parallel(args.jobs.map((j) => () =>
  agent(brief(j), { label: j.id, phase: 'Jobs', schema: RESULT, ...(j.model ? { model: j.model } : {}) })))
return args.jobs.map((j, i) => ({ id: j.id, result: results[i] }))
```

If the Workflow call itself errors: if the error text mentions a usage limit, rate limit, quota, credit, 429, 529 or "overloaded", go to **step 7 (limit exit)**. Otherwise `Q release --by $RUN`, record the error in `content/_queue/last-gate.txt`, and go to step 8.

Afterwards: `Q burn-lock refresh --by $RUN`.

### 5. Check scope, gate, and settle each job

Classify each returned `{id, result}`:
- `result` is `null`, or `result.limitHit` is true → **unfinished**: collect its id for release. If any job is unfinished for a limit reason (or `null`), remember `LIMIT=1`.
- otherwise → **finished**: gate it, as below, one job at a time.

**Stray-write check (once, before gating).** Run `git status --porcelain=v1 -uall` again from `/Users/Matthew/Fluidez` and compare with `runs/$RUN.before.txt`. Every path that is new or changed since the snapshot must be in the union of the leased jobs' `outputs` (prefix them with `app/`). Ignore `app/content/_queue/` itself. For each path that is not:
- if it is a new untracked file under `app/content/` → delete it;
- if it is a tracked file that was clean in the snapshot → `git restore -- <path>`;
- anything else → leave it, but list it.
Append the list to that run's notes and, if it can be attributed to one job (its path is inside that job's output directory), treat that job as failed with message `wrote outside its declared outputs: <paths>`.

**Gate each finished job** (only its own outputs):

```
cd /Users/Matthew/Fluidez/app && npm run gate -- <outputs…> > content/_queue/runs/$RUN.<id>.gate.txt 2>&1; echo "exit=$?"
```

Also fail the job without gating if any declared output is missing.

- **Pass** (exit 0):
  ```
  cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts done <id>
  cd /Users/Matthew/Fluidez && git add -- <app/…outputs> app/content/_queue/jobs.jsonl \
    && git commit -m "burn: <id> (<kind> <band><unit if any>)" -m "Gate passed. Run $RUN." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -- <app/…outputs> app/content/_queue/jobs.jsonl
  ```
  Commit with explicit pathspecs only, so nothing else that happens to be staged or modified goes in. Before committing, re-check `git rev-parse --abbrev-ref HEAD` is `rebuild`. Never `--no-verify`, never amend, never push. If the commit fails because there is nothing to commit (the outputs are byte-identical to `HEAD`), that is fine.
- **Fail** (non-zero exit): keep the useful part of the gate output — the summary plus the first ~150 lines of findings — in a file and record it:
  ```
  cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts fail <id> --msg-file content/_queue/runs/$RUN.<id>.gate.txt
  ```
  The next attempt receives this text in its prompt. Do **not** commit failed outputs; leave them in the tree for the retry to fix (the job rewrites them in full).
  If the gate itself crashed (stack trace in `tools/gate.ts`, not a content finding), use `Q release <id>` instead of `fail`: it is not the job's fault.

Then release the unfinished ones: `Q release <ids…>` (no attempt is counted).

Write a short summary to `content/_queue/last-gate.txt` (overwrite): run id, time, one line per job — `PASS <id>` / `FAIL <id>: <first finding>` / `RELEASED <id>: <why>` — and the stray-write list if any.

### 6. Finish

Print the summary and `Q status`. If `LIMIT=1`, print `burn: usage limit hit; leases released; next tick will retry.` Go to step 8.

### 7. Limit exit

Any time a usage/rate-limit error appears (in your own tool calls, the Workflow call, or results): stop starting new work. Run `Q release --by $RUN` (returns every job this run still holds to pending without counting an attempt), append `LIMIT <time> $RUN` to `content/_queue/last-gate.txt`, then step 8. Do not retry, do not wait, do not sleep.

### 8. Release (always)

```
cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts release --by $RUN
cd /Users/Matthew/Fluidez/app && npx tsx tools/queue.ts burn-lock release --by $RUN
```

(The first is a no-op when everything was settled.) Then stop. Your final message is one or two lines: what passed, failed, was released, and whether a limit was hit.

## Never

- Never commit to any branch but `rebuild`; never push; never rewrite history; never `git add -A` or `git add .`.
- Never edit `tools/queue.ts`, `tools/gate.ts`, `src/`, or `content/_queue/jobs.jsonl` by hand — only through `Q`.
- Never mark a job done that has not passed `npm run gate` on its outputs in this run.
- Never delete files outside `app/content/`, and never delete anything that was present in the snapshot.
