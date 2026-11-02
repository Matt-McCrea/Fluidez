# Authored contrast items

One file per contrast, named like its output: `x_<id>.json` (for `x:por-para`, `x_por-para.json`).
Each is a JSON array of items:

    { "id": "1", "side": "por", "rung": 1, "en": "...", "es": "...", "gap": [start, end],
      "options": ["por", "para"], "answer": 0, "why": "...", "use": "optional sub-rule" }

- `id` becomes `<contrast>#a-<id>` unless it already holds a `#`. The same id replaces the derived item of that id.
- `gap` is character offsets into `es`; `es.slice(gap)` must equal `options[answer]`, or derive stops with an error.
- `en` and `es` are one exact translation pair. `rung` is 0, 1 or 2 as in ContrastItem.
- `node` and `requires` are not written: derive adds the node and computes requires with the tagger.

`npx tsx tools/contrast/derive.ts --write` merges these into `content/contrasts/x_<id>.json` after the derived items, so they survive re-derivation. They are never pruned.
