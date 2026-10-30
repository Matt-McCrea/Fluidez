# Fluidez cloud burn: one tick

You run unattended in a fresh Linux sandbox. Never ask questions, never improvise beyond these steps. State travels only through git on branch `rebuild`. All fragile steps are in `tools/burn/cloud.sh`; call it, do not reimplement it.

## 1. Preconditions

The repo root is the clone. Run, in one Bash call:

```
git fetch origin rebuild && git checkout -B rebuild origin/rebuild && cd app && bash tools/burn/cloud.sh setup
```

If this fails, stop and report the error. All later commands run from the `app/` directory (use its absolute path).

## 2. Run id

Generate once and remember the literal value:

```
RUN=cloud-$(date -u +%Y%m%dT%H%M%S)-$RANDOM
```

## 3. Lease

N is given by the routine prompt (default 20, never above 30).

```
bash tools/burn/cloud.sh lease N "$RUN"
```

- Output `nothing ready`: print it and stop.
- Exit code 2 (`lease push failed; released`): stop and report.
- Otherwise the LAST stdout line is a JSON array of `{id, kind, band, unit, model, outputs, promptFile}`. Parse it.

## 4. Fan-out

For every leased job launch one subagent with the Agent tool. Put all the Agent calls in ONE message so they run in parallel. Set `model` to the job's `model` field (`opus` or `sonnet`) when present. Brief for each (fill the placeholders exactly):

```
You are running one Fluidez content job.
Job: <id> (kind <kind>, band <band>, unit <unit>).
Working directory: <absolute app dir>. Run every command from there.
Schema contract: src/content/schema.ts.
You may create or overwrite ONLY these files:
<one output path per line>
Rules: write nothing else anywhere in the repo. No git commands. Rewrite each output in full.
Read your full job prompt from <promptFile> completely before starting, and follow it.
When done run: npm run gate -- <outputs, space separated>
If it reports findings, fix them and re-run, at most twice more.
If you hit any usage, rate or quota limit (429, 529, quota) stop immediately.
END your final reply with exactly one line:
RESULT: ok
RESULT: fail: <one-line reason>
RESULT: limit
```

## 5. Collect results

Write `content/_queue/runs/$RUN.results.json`, a JSON array of `{"id": string, "ok": boolean, "limitHit": boolean}`:

- `RESULT: ok` gives ok true, limitHit false.
- `RESULT: fail: ...` gives ok false, limitHit false (optionally add a `"reason"` field).
- `RESULT: limit` gives ok false, limitHit true.
- A subagent that errored or returned no RESULT line: omit it; settle gates its outputs anyway if they all exist (the gate is the authority), and releases the job only if any output is missing.

## 6. Settle

```
bash tools/burn/cloud.sh settle "$RUN" content/_queue/runs/$RUN.results.json
```

Print its output. Settle gates each job itself, commits passes, marks failures, releases unfinished work and pushes. Do not redo any of that by hand.

## 7. Usage limits

If a usage limit was hit at any point (your own tool calls or any subagent): start no more work. After settle (or instead of it, if the fan-out could not launch) run:

```
bash tools/burn/cloud.sh release "$RUN"
```

## 8. Final message

One or two lines: how many passed, failed, released; whether a limit was hit; whether the push succeeded (settle prints `PUSH FAILED` if not).

## Never

- Never commit to any branch but `rebuild`. Never push to `main`.
- Never rewrite history (no force push, amend, or reset beyond what cloud.sh does).
- Never edit `tools/queue.ts`, `tools/gate.ts`, `src/`, or `content/_queue/jobs.jsonl` by hand.
- Never mark a job done without the gate passing in this run.
- Never use `git add -A`, `git add .`, or `--no-verify`.
