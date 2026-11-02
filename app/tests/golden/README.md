# Golden learners

Real saved documents, checked in. Each `.json` is a dump of what a browser holds in IndexedDB for one learner (`state`, `state.prev`, `events`, `path`, `ui`, and `session` when a lesson is open), made by running the app's own boot and session code over the real content with `tools/golden.ts`. Nothing in them is written by hand.

`golden.test.ts` boots every file the way the app boots (`boot()` in `src/ui/app.tsx`: migrate, reconcile, load the content window) and asserts: nothing throws, no node is lost, every rep is kept, no card or event points at a node the course no longer has, the path position is valid, and a session compiles. The mid-session file must also resume.

| file | what it is | made by |
|---|---|---|
| `live-ee6aaec.json` | 10 sessions, in the shape the live site writes (`state` v2, `path` v2, `ui` v2) | `tools/golden.ts` run inside a checkout of `ee6aaec` |
| `head-early.json` | 8 sessions on `next` | `npm run golden -- --scenario early --out tests/golden/head-early.json` |
| `head-mid-session.json` | 3 sessions, then a fourth left open after 3 blocks | `npm run golden -- --scenario session --out tests/golden/head-mid-session.json` |
| `head-placed.json` | placed at unit index 11 (u12) by `applyPlacement`, then 2 sessions, without `state.prev` | `npm run golden -- --scenario placed --unit 11 --no-prev --out tests/golden/head-placed.json` |

## Never rewrite `live-ee6aaec.json`

It is the only file whose shape no current code writes any more, and it cannot be regenerated once the schemas move: only the `ee6aaec` tree writes `ui` v2, and a later tree writes something else. Made once with:

```
git archive ee6aaec app | tar -x -C /tmp/ee6aaec
ln -s "$PWD/app/node_modules" /tmp/ee6aaec/app/node_modules
cp app/tools/golden.ts /tmp/ee6aaec/app/tools/
cd /tmp/ee6aaec/app && npx vite-node tools/golden.ts -- --scenario early --sessions 10 --build ee6aaec --out live-ee6aaec.json
```

If it fails, the migration is wrong, not the fixture.

## When a schema moves

Do not regenerate the `head-*` files to make the test pass: they are what the new migration is tested against. Add a new set (`golden-<commit>-early.json` and so on), list it in `SHAPES` in the test with the versions it was written at, and keep the old ones. `SHAPES` pins each file's on-disk versions, so a file regenerated with newer code fails the test instead of quietly standing for something else.

The attempts, writing and history documents (and the fingerprint on the state) are additive and in none of the fixtures: a learner saved before them boots as it was and gains them as they are made. `tests/learner/attempts.test.ts` boots every fixture, gives it an attempt, reopens it and checks it lost nothing.

Each fixture's clock is fixed (1 October 2026, 18:00 UTC onwards), so none depends on the time zone or the day the test runs.
