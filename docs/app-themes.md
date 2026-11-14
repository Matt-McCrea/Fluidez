# Five apps, five looks (14 Nov 2026)

Matthew asked for every language app to have its own colour scheme and vibe. Until now all five were the same dark navy board with one accent colour swapped. Each app now gets its own palette, light or dark, type, corner shape, borders and a background texture, chosen to suit its language. Layout, features and markup stay the same: this is a CSS job, plus `theme-color` in index.html and manifest.json, and icon backgrounds.

Rules for every app:
- Text and controls pass WCAG AA (4.5:1 body text, 3:1 large text and control borders). Check with a script, not by eye.
- Good/bad answer colours stay obviously green and red on that background.
- The tile hues (the coloured edge per game) are re-tuned to read on the new background and to sit inside the new palette.
- No web fonts or images over the network: system font stacks only, textures in CSS (gradients), so the apps still work offline.
- Respect `prefers-reduced-motion`. The notch rule on `#stage-host` stays as it is.
- The full screen countdown, the round, the sheets, cards, conversations, placement and the spotlight ("Do this now") all take the new look; grep for hard-coded colours (`#fff`, `rgba(255,255,255`, `rgba(0,0,0`, `#0`) that assume a dark background and fix them.

## Juegos (Spanish, Colombia): carnaval
Barranquilla carnival at night. Dark, saturated, loud and playful.
- `--bg #170a1f` (deep plum), `--panel #241133`, `--panel-2 #321a45`, `--border #4a2a63`, `--text #fbf3ff`, `--muted #c3a8d6`.
- `--accent #ff3d8b` (hot pink), `--accent-2 #ff79ad`, `--gold #ffd23f` (records), good `#3ee08f`, bad `#ff5a4f`.
- Rounded type: `ui-rounded, "SF Pro Rounded", -apple-system, system-ui, sans-serif`, headings heavy (800). Radius 22px; tiles slightly chunky with a soft coloured glow in their hue.
- Background: a faint confetti or radial glow of pink and yellow in the top corner.
- Only juegos/ may change: put overrides in css/arcade.css (loaded only by juegos/index.html). css/styles.css and css/games.css are shared with the old root app and must not change.

## Líofa (Irish): lámhscríbhinn, the manuscript
Calm, light, bookish: vellum, ink and moss, like the Book of Kells page margins.
- Light theme. `--bg #f3eee2` (vellum), `--panel #fbf8f0`, `--panel-2 #ece5d4`, `--border #d5c9ae`, `--text #1f2a22` (ink), `--muted #5d6a5f`.
- `--accent #2e7a52` (moss), `--accent-2 #3f9466`, `--gold #a8741a` (dark gold, records), good `#23824f`, bad `#b3362b`.
- Serif headings: `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`; body stays the system sans. Radius 10px; thin borders, almost no shadow.
- Background: a very subtle paper grain (layered radial gradients), a thin double rule under headings.

## Ṭalāqa (Arabic): zellige
Lapis and gold, crisp geometry, like a tiled courtyard at dusk.
- Dark. `--bg #0a1433` (lapis night), `--panel #12204a`, `--panel-2 #1a2b5c`, `--border #2c3f78`, `--text #f4efe2`, `--muted #b2b7cf`.
- `--accent #e2b04a` (gold), `--accent-2 #f1cd7d`, `--gold #f1cd7d`, a second accent turquoise `#35c2b4` for links and selected chips, good `#46d98a`, bad `#ff6b5e`.
- Radius 6px; crisp 1px gold-tinted borders. Arabic text keeps its current font stack and size.
- Background: a faint eight-point star lattice in CSS (repeating conic or linear gradients) at about 4% opacity.

## Svobodno (Russian): khokhloma
Black lacquer, cinnabar red and gold leaf, folk-ornament bold.
- Dark. Keep `--bg #110c0b` family, `--panel #1d1311`, `--panel-2 #2a1b17`, `--border #5a3a1c` (gold-brown), `--text #f7ede2`, `--muted #c2a691`.
- `--accent #d8352a` (cinnabar), `--accent-2 #ff7a66`, `--gold #e8b34a`, good `#5fd38d`, bad `#ff6b5e`.
- Headings uppercase, condensed and tracked: `"Avenir Next Condensed", "Arial Narrow", "PT Sans Narrow", sans-serif`, weight 700. Radius 4px; panels get a 1px gold inner border (inset box-shadow).
- Background: a dark red to black vertical gradient and a faint gold berry-and-leaf hint in a corner (radial gradients only).

## Vlot (Dutch): De Stijl
Mondrian and Rietveld: white, black lines, primary colour blocks. Bright, flat, graphic.
- Light theme. `--bg #f7f5ef` (off white), `--panel #ffffff`, `--panel-2 #efece3`, `--border #111111`, `--text #111111`, `--muted #4a4a4a`.
- `--accent #1d4fa8` (De Stijl blue), `--accent-2 #2f66c7`, `--gold #b8860b` for records on white, red `#d1291f`, yellow `#f2c318`; good `#1f8a4c`, bad `#c8241b`.
- Type: `"Helvetica Neue", Helvetica, Arial, sans-serif`, headings 800, tight. Radius 0; 3px black borders on tiles and buttons, no shadows, no gradients.
- Tiles: a solid colour block in the tile's hue (red, blue, yellow, black, white) instead of a thin edge, with black text where the block is yellow or white and white text where it is red, blue or black. Speel gets the Mondrian grid treatment: a white panel split by thick black lines with a red, a blue and a yellow block.
