# Playtest tools

Two ways to see what a learner sees, used by the product audit (`docs/product-audit.md`) and by every re-drive after a change.

## serve.mjs: drive the app in a persistent browser

Keeps a headless Chromium open with a named profile (IndexedDB survives between calls), and takes batches of actions over HTTP. Needs the dev server (`npm run dev`) or a preview build.

```
node tools/playtest/serve.mjs beginner 7103          # phone viewport (390 x 844)
node tools/playtest/serve.mjs beginner 7103 --desktop
curl -s -X POST localhost:7103 -d '[{"goto":"http://127.0.0.1:5173/?fixtures=0"},{"dump":"home"}]'
```

Actions (one object each, run in order):

- `{"goto": url}`, `{"reload": true}`, `{"clock": "2026-10-05T18:00:00"}` (fixed time), `{"viewport": {"width": 1280, "height": 800}}`
- `{"click": selector}`, `{"button": "Get started"}`, `{"text": "Travel", "exact": true}`, `{"fill": "Hola"}`, `{"type": "Hola"}`, `{"press": "Enter"}`
- `{"dump": "label"}` prints the main text; `{"shot": "label"}` saves a full-page screenshot under `tools/playtest/.runs/shots/<profile>/`
- `{"tap": 200, "policy": "learn", "fillText": "Soy de Toronto.", "shots": true, "stopAtHome": true, "untilText": "Write it", "verbose": true}` plays whatever is on screen. Policies: `first` (always the first option), `last`, `random`, `learn` (remembers what the app revealed and answers from that memory, like a learner would; the memory is `.runs/shots/<profile>/memory.json`).
- `{"eval": "js"}` runs in the page.

Profiles live in `tools/playtest/.runs/profiles/<name>`; delete a profile to start over.

## render.ts: read sessions for a learner placed at any unit

Compiles and plays sessions headlessly through the same card builders and runner the UI uses (`tests/ui/driver.ts`), answering every card right (or wrong), and prints each card: ask, prompt, options with the answer starred, the hint a junk answer would get, and the why line.

```
npx vite-node tools/playtest/render.ts 20 3          # unit 20, three days, answering right
npx vite-node tools/playtest/render.ts 40 2 wrong
```

Run it from `app/` (the Vite config reads `content/` relative to the working directory).
