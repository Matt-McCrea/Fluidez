# Five apps, five looks (14 Nov 2026)

Matthew asked for every language app to have its own colour scheme and vibe. Until now all five were the same dark navy board with one accent colour swapped. Each app now gets its own palette, light or dark, type, corner shape, borders and a background texture, chosen to suit its language. Layout, features and markup stay the same: this is a CSS job, plus `theme-color` in index.html and manifest.json, and icon backgrounds.

Rules for every app:
- Text and controls pass WCAG AA (4.5:1 body text, 3:1 large text and control borders). Check with a script, not by eye.
- Good/bad answer colours stay obviously green and red on that background.
- The tile hues (the coloured edge per game) are re-tuned to read on the new background and to sit inside the new palette.
- No web fonts or images over the network: system font stacks only, textures in CSS (gradients), so the apps still work offline.
- Respect `prefers-reduced-motion`. The notch rule on `#stage-host` stays as it is.
- The full screen countdown, the round, the sheets, cards, conversations, placement and the spotlight ("Do this now") all take the new look; grep for hard-coded colours (`#fff`, `rgba(255,255,255`, `rgba(0,0,0`, `#0`) that assume a dark background and fix them.

## Round two (14 Nov 2026, Matthew)
"Juegos a bit dark still, should be more fun and bold. Juegos and Russian a bit too dark, Líofa not dark enough and should be more Irish. Make them all more representative of their traditional cultures." Vlot stays (De Stijl is Dutch heritage, and Delft blue would clash with Gzhel); Ṭalāqa keeps zellige with stronger motifs.

## Juegos (Spanish, Colombia): la chiva
The painted chiva bus and the Wayuu mochila: bright, sunny, loud folk colour. A LIGHT theme, nothing dark.
- `--bg #fff3d1` (sunny cream), `--panel #ffffff`, `--panel-2 #ffe9b0`, `--border #1d1d1b`, `--text #1d1d1b`, `--muted #5a4a2e`.
- Chiva colours: red `#e4252b`, yellow `#ffc20e`, blue `#0f4fbf`, green `#0c9a52`, orange `#ff7a00`, magenta `#d6247a`. `--accent #d6247a`, `--gold #a35f00` (records on light), good `#0c8a49`, bad `#c81e24`.
- Tiles are solid chiva colours with white text (black text on yellow), rounded 18px, a 2px dark outline and a chunky offset shadow (`4px 4px 0 #1d1d1b`), slightly playful. Jugar gets a band of Wayuu zigzag stripes (repeating linear gradients in red, yellow, blue, green, orange) across its top.
- Type: `ui-rounded, "SF Pro Rounded", system-ui, sans-serif`, headings 900. A thin Wayuu zigzag stripe runs along the top of the board under the notch area.
- Only css/arcade.css (loaded only by juegos/) may change; css/styles.css and css/games.css are shared with the old app.

## Líofa (Irish): the Book of Kells
An illuminated page on Connemara marble: deep green, gold and red lead, Celtic knotwork. Mid dark, rich, unmistakably Irish.
- `--bg #0f3a2a` (Connemara green), `--panel #164a36`, `--panel-2 #1d5a42`, `--border #c9a54a` at reduced alpha for panel edges, `--text #f6efdc` (vellum), `--muted #c7d3c4`.
- `--accent #e0b44a` (illumination gold), `--accent-2 #f0cf7a`, `--gold #f0cf7a`, red lead `#d4553a` for one tile and highlights, lapis `#3f6fc1` and verdigris `#3fae8a` among the tile hues; good `#6be3a0`, bad `#ff8a76`.
- Headings: `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`, the app title in small caps with letter spacing; a drop-cap feel on Imir (large first letter in gold).
- Texture: subtle marble veining (layered radial and linear gradients), and a Celtic knotwork band (CSS repeating pattern of interlaced diagonals) as a thin border on Imir and under headings. Panels get a fine gold edge.

## Ṭalāqa (Arabic): zellige, stronger
Keep the lapis, gold and turquoise. Make it more of the courtyard: the Ilʿab tile topped by a pointed arch (shaped border radius or a clip path), the star lattice a little more visible (about 7%), and a thin geometric border band (zellige zigzag in gold and turquoise) under the header. Change nothing else.

## Svobodno (Russian): Gzhel
Gzhel porcelain: white glaze painted in cobalt, with a touch of matryoshka red. Light, clean, ornamental.
- Light theme. `--bg #f4f6fb` (porcelain), `--panel #ffffff`, `--panel-2 #e8edf8`, `--border #b9c6e6`, `--text #14245a` (deep cobalt ink), `--muted #4a5884`.
- `--accent #1f45b5` (cobalt), `--accent-2 #3a63d6`, matryoshka red `#c8202f` for the Script/Talk active state and one tile, `--gold #9a6a00`, good `#1d8a4b`, bad `#c8202f`.
- Tiles white with a cobalt brush edge and a soft cobalt wash in one corner (radial gradient), radius 14px; Играть in solid cobalt with white text and a scalloped Gzhel border (radial gradient scallops along the bottom).
- Headings: `"Avenir Next", "PT Sans", system-ui, sans-serif` 700, not uppercase. Background: faint cobalt floral flourishes in two corners (radial gradients), never behind text at more than 5%.

## Vlot (Dutch): De Stijl
Mondrian and Rietveld: white, black lines, primary colour blocks. Bright, flat, graphic.
- Light theme. `--bg #f7f5ef` (off white), `--panel #ffffff`, `--panel-2 #efece3`, `--border #111111`, `--text #111111`, `--muted #4a4a4a`.
- `--accent #1d4fa8` (De Stijl blue), `--accent-2 #2f66c7`, `--gold #b8860b` for records on white, red `#d1291f`, yellow `#f2c318`; good `#1f8a4c`, bad `#c8241b`.
- Type: `"Helvetica Neue", Helvetica, Arial, sans-serif`, headings 800, tight. Radius 0; 3px black borders on tiles and buttons, no shadows, no gradients.
- Tiles: a solid colour block in the tile's hue (red, blue, yellow, black, white) instead of a thin edge, with black text where the block is yellow or white and white text where it is red, blue or black. Speel gets the Mondrian grid treatment: a white panel split by thick black lines with a red, a blue and a yellow block.

## Round three for Líofa (14 Nov 2026, Matthew)
"Colours good, more ornamentation in the background, more knotty, but the script is too much and the gold a little too bright. Better script, more chill." So: gold softened to `#c9a24e` / `#d6bc80`, the serif headings, small caps and drop cap removed (plain sans, only the Líofa wordmark keeps a quiet serif), card emphasis upright, a chain-knot lattice of interlaced rings over the whole background, and a ring-chain knot band under headings and across Imir.

## Real patterns (15 Nov 2026, Matthew: "use a real Celtic knot", "better backgrounds for the Arabic one, look up real examples")
- **Líofa:** knotwork by Mercat's rule (tools/ga/knot-lib.js): the medial graph of a square grid with breaks, drawn alternating over and under, the way George Bain laid out the Book of Kells panels on dot grids. Rosettes linked by plait, at 16% behind everything; a two-strand cable (gold and red lead) under headings and across Imir. Regenerate with `node tools/ga/make-knot.js`.
- **Ṭalāqa:** the khatam star-and-cross of Mamluk Cairo and Damascus (the Umayyad Mosque doors and grilles): eight-pointed star outlines on a centred square lattice, the crosses left between them, a small octagon in each star, as gold strapwork at 22%. Regenerate with `node tools/ar/make-pattern.js`.
Both are inline SVG data URIs in the CSS, so they work offline.

## Couramment (French): Toile de Jouy (15 Nov 2026)
Linen and madder red, like an 18th century Jouy print. Light, calm and elegant (Matthew: no small caps, no drop caps, no italics on headings). Spec: docs/couramment-spec.md. CSS: francais/css/couramment.css (Vlot's De Stijl block was removed, not layered over).
- Light theme. `--bg #f6efe1` (linen), `--panel #fffaf0`, `--panel-2 #efe5d0`, `--border #d9c9a8`, `--text #2a1d1a`, `--muted #6b5a4e`.
- `--accent #a3202e` (rouge de Jouy), `--accent-2 #c43a48`, toile blue `#2c4a8a`, `--gold #8a6413` (records), good `#1f7a48`, bad `#b3261e`.
- Headings and the wordmark only: `"Didot", "Bodoni 72", "Bodoni MT", Georgia, serif`, weight 700, upright. Everything else the system sans.
- Tiles are cream panels with a thin hue edge and a 6px hue bar, text in ink (hues are too light or too saturated for text on them). Jouer is a cartouche: madder border, inner gold line, a faint gold wash. Pills and chosen chips use the hue mixed 30% towards the ink, so white text passes on all nine.
- Tile hues: Jouer `#b8860b`, Verbes `#a3202e`, Mots `#2c4a8a`, Phrases `#4f7a4a`, Conversations `#7a5aa6`, Le ou la `#b84a6e`, Pronoms `#a86b12`, Négation `#4a5a6a`, Prépositions `#21706b`.
- Background: the treillage of a Versailles garden, a diagonal lattice with a small four petal rosette at every crossing, madder red at 10%. Regenerate with `node tools/fr/make-pattern.js --write` (inline SVG data URI in the `--treillage` property, offline). It sits on `body` only: lesson text, chips and the little page stand on solid panels.
- Icon: 🥐 on `#a3202e` (`node tools/make-icons.js --target francais`).
- Checked with `node tools/check-card-contrast.js couramment` (0 problems, no text straight on the pattern).
