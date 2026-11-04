# Decisions log — the restructure

Each entry records an ambiguity and how it was resolved. Anything marked
**pending** is waiting on Matthew (see `docs/phase0-report.md` §5).

## 2026-10-28 · Phase 0

- **Which BLUEPRINT copy.** Two versions were in ~/Downloads. I used the later
  one (19:04), the text-only revision that was attached to the brief. It is
  saved as `docs/research/Structuring Spanish Learning for English-Speaking Adults.md`.
- **Mode.** Restructure. The app's 674 lesson ids are exactly the CSV's.
- **The audit reads SEQ, not a copy.** `tools/reseq/` parses the CSV, the
  new-lesson table and the unit tables out of the markdown, so a revised SEQ
  is re-checked rather than going stale.
- **Split id naming.** The brief's `presente-irregular` is
  `gr-presente-irregular-a2` in both the app and the CSV.
- **CSV merges will not use `MERGES`.** `js/lessons.js` `applyMerges`
  concatenates, and SEQ forbids that for hubs. They will use an alias table
  plus `needsRewrite` instead. (Planned; not yet built.)
- **Pending:** the pacing model (A or B), tiers and minutes, the input track,
  the AI provider, optional tracks feeding the SRS, the B1–B2 notion triage,
  the TTS button, the learner dry-run data, and the catch-up queue versus the
  rewind to the first gap.

## 2026-10-28 · Direction reset

- **Best app over minimal change** (Matthew). The minimal-change options in
  `phase0-report.md` §3–5 are superseded by `docs/redesign.md`: a skill graph,
  a tagged sentence bank and a per-learner session compiler.
- **No AI in the app; no listening features** (Matthew). Removed: AI role-play
  and feedback, the outside-listening log, suggestions and credit, and "say it
  aloud" prompts. Replacements: scripted typed conversations, a translation
  matcher with self-correction, and a graded reading serial as the volume
  track. The existing optional TTS button is left untouched.
- **Notion lessons** are resolved by the graph: pattern nodes are budgeted as
  minor patterns and placed by the compiler; only pure word lists become
  optional vocabulary.
- **Pending:** whether build-time model drafting of content (through the
  content gate) is still acceptable; approval of the vertical-slice build
  order.
