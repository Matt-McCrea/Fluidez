#!/usr/bin/env node
/* ============================================================================
 * make-icons.js — the arcade's home-screen icons, drawn from scratch.
 *
 *   node tools/make-icons.js            write juegos/icons/*.png
 *   node tools/make-icons.js --preview  print the shape as text, draw nothing
 *
 * WHY IT IS GENERATED RATHER THAN DRAWN. The arcade shipped wearing the app's
 * wave, so two different apps sat on the home screen under one icon and you
 * could not tell which you were opening. Fixing that needed an icon, and this
 * repository has no image tooling and no dependencies — a rule worth keeping,
 * because the alternative is a binary nobody can edit and a toolchain that
 * rots. So the PNGs are written here with nothing but node's own zlib: an
 * RGBA buffer, a deflate, four chunks and a CRC.
 *
 * TO CHANGE THE ICON, edit PALETTE, FLAME or INNER below and run it again. --preview
 * shows the silhouette in the terminal, which is the fastest way to judge a
 * shape change; the colours need a real look.
 *
 * WHAT IT DRAWS. A flame, pale gold on a burnt-orange ground. The app is the
 * calm blue-green thing; this is the one you open to burn ninety seconds. It
 * has to read at 48 pixels on a home screen, which is why it is a single
 * silhouette and not a scene.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'juegos', 'icons');

/* ---- the bits you change ------------------------------------------------- */
/* Fire on orange. The first version split the flame ice/fire on near-black,
 * which was a nice idea and the wrong one: at 48 pixels the cold half read as
 * a separate object and the whole thing looked like a raindrop someone had
 * coloured in. One temperature is legible; two are a puzzle.
 *
 * The flame is the PALE thing here, not the orange one. An orange flame on an
 * orange ground has nothing to separate it — so the ground takes the burnt end
 * of the range and the flame takes cream and gold, which is also the right way
 * round physically: the hot part is the bright part. */
const PALETTE = {
  bgCentre:  [240, 138, 56],    // orange ground, lit from the middle
  bgEdge:    [146, 50, 14],     // burnt at the corners, so the tile has depth
  tipLeft:   [255, 250, 226],   // flame: near-white at the tip
  baseLeft:  [255, 186, 38],    // deepening to gold at the base
  tipRight:  [255, 240, 186],   // the right side is a shade warmer, which is
  baseRight: [255, 146, 24]     // what gives a flat silhouette its roundness
};
const FLAME = {
  tipY: -0.92,                  // -1 is the top edge, +1 the bottom
  baseY: 0.40,                  // centre of the round base
  baseR: 0.52,                  // radius of that base
  curl: 0.16,                   // how far the tip curls right
  sway: 0.07,                   // counter-bend in the body, which is what
                                // separates a flame from a falling droplet
  waist: 0.13,                  // how much the body pinches below the tip
  blend: 0.45                   // how soft the left-to-right shading is
};
/* The inner flame. This is the whole difference between a flame and a
 * teardrop: a drop is one closed shape and fire has a core. Without it the
 * silhouette was legible and kept being read as water, which is the one thing
 * this icon must not say — the app it sits beside is called Fluidez and has a
 * wave on it. Same outline, scaled and dropped so its tip sits inside the
 * body, in the deep orange the ground is made of. */
const INNER = {
  scale: 0.44,                  // fraction of the outer flame
  drop: 0.46,                   // how far down it sits, in the same units
  top:  [255, 176, 40],         // inner flame at its tip
  base: [226, 74, 16]           // and at its base
};
const SIZES = [
  { file: 'icon-192.png', size: 192, scale: 1 },
  { file: 'icon-512.png', size: 512, scale: 1 },
  // Maskable art is cropped to a circle by the launcher, so everything that
  // matters has to sit inside the middle 80%.
  { file: 'icon-512-maskable.png', size: 512, scale: 0.68 },
  { file: 'apple-touch-icon.png', size: 180, scale: 1 }
];

/* ---- the shape ----------------------------------------------------------- */
/* THE DIFFERENCE BETWEEN A FLAME AND A RAINDROP is entirely in these two
 * functions, and the first attempt got a raindrop: a straight-sided cone on a
 * ball, symmetrical, with a visible shoulder where the two met.
 *
 * What fixes it is an S. A flame's centre line curls one way at the tip and
 * leans back the other through the body, and its sides are curves rather than
 * straight lines — pinched into a waist below the tip and swelling into the
 * base. The sides are also deliberately NOT mirror images: the asymmetry is
 * most of what makes a silhouette read as something burning. */
function axisAt(y, s) {
  const tipY = FLAME.tipY / s, baseY = FLAME.baseY / s;
  const v = Math.max(0, Math.min(1, (y - tipY) / (baseY - tipY)));
  // curl at the tip (v→0), counter-sway through the middle, nothing at the base
  return (FLAME.curl * Math.pow(1 - v, 2.2) - FLAME.sway * Math.sin(Math.PI * v)) / s;
}
// Half-width of the body at v (0 = tip, 1 = base), as a fraction of baseR.
// sin() gives a round shoulder instead of a corner; the waist term pinches it
// just below the tip, which is the shape of a flame narrowing as it rises.
function profile(v, side) {
  /* The exponent must be ABOVE 1 or there is no point on the flame: sin()
   * supplies the round shoulder at the base (its derivative is zero at v=1),
   * and the power is what keeps the tip sharp. At 0.6 the width reached a
   * sixth of the body within a twentieth of the height and the whole thing
   * read as a blob. The two sides differ, which is where the asymmetry is. */
  const base = Math.sin(Math.PI / 2 * Math.pow(v, side > 0 ? 1.18 : 1.42));
  const waist = 1 - FLAME.waist * Math.sin(Math.PI * Math.pow(v, 1.4));
  return Math.max(0, base * waist);
}
/* The inner flame, in the outer flame's own coordinates, so one shape function
 * serves both and they cannot drift apart. */
function inInner(x, y, s) {
  return inFlame(x / INNER.scale, (y - INNER.drop / s) / INNER.scale, s);
}
function innerColour(y, s) {
  const span = ((FLAME.baseY - FLAME.tipY) * INNER.scale) / s;
  const top = (FLAME.tipY * INNER.scale + INNER.drop) / s;
  return mix(INNER.top, INNER.base, Math.max(0, Math.min(1, (y - top) / span)));
}

/* A plain union of the tapering wedge and the round base. A p-norm blend was
 * tried here to soften the shoulders and did the opposite: where the two
 * outlines are both near the base radius it sums them to about 1.15R and grows
 * a flat wing on each side. max() leaves a faint crease where they cross,
 * which at icon size is a highlight rather than a fault. */
function inFlame(x, y, s) {
  const tipY = FLAME.tipY / s, baseY = FLAME.baseY / s, baseR = FLAME.baseR / s;
  const dx = x - axisAt(y, s);
  if (dx * dx + (y - baseY) * (y - baseY) <= baseR * baseR) return true;
  if (y < tipY || y > baseY) return false;
  const v = (y - tipY) / (baseY - tipY);
  return Math.abs(dx) <= baseR * profile(v, dx >= 0 ? 1 : -1);
}

function lerp(a, b, t) { return a + (b - a) * t; }
function mix(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }

function flameColour(x, y, s) {
  const v = Math.max(0, Math.min(1, (y - FLAME.tipY / s) / ((FLAME.baseY - FLAME.tipY) / s)));
  const left = mix(PALETTE.tipLeft, PALETTE.baseLeft, v);
  const right = mix(PALETTE.tipRight, PALETTE.baseRight, v);
  // Wide crossfade: the two sides differ only slightly now, and the point is
  // a soft roundness across the body rather than a seam down the middle.
  const dx = x - axisAt(y, s);
  const t = Math.max(0, Math.min(1, (dx + FLAME.blend) / (2 * FLAME.blend)));
  return mix(left, right, t);
}

/* 3x3 supersampling, because a flame is all diagonals and a hard-edged one
 * looks like a bitmap from 1994 at any size a phone actually shows. */
const SS = 3;
function render(size, scale) {
  const buf = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, hits = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = ((px + (sx + 0.5) / SS) / size) * 2 - 1;
          const y = ((py + (sy + 0.5) / SS) / size) * 2 - 1;
          const d = Math.sqrt(x * x + y * y);
          const bg = mix(PALETTE.bgCentre, PALETTE.bgEdge, Math.min(1, d / 1.25));
          let c = bg;
          if (inFlame(x, y, scale)) {
            c = inInner(x, y, scale) ? innerColour(y, scale) : flameColour(x, y, scale);
            hits++;
          }
          r += c[0]; g += c[1]; b += c[2];
        }
      }
      const n = SS * SS, o = (py * size + px) * 4;
      buf[o] = Math.round(r / n); buf[o + 1] = Math.round(g / n);
      buf[o + 2] = Math.round(b / n); buf[o + 3] = 255;
      void hits;
    }
  }
  return buf;
}

/* ---- PNG ----------------------------------------------------------------- */
const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;   // 8-bit RGBA
  // Filter type 0 on every scanline: the image is smooth gradients and deflate
  // handles it well enough that picking filters per line is not worth the code.
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---- run ----------------------------------------------------------------- */
if (process.argv.indexOf('--preview') !== -1) {
  const N = 46;
  for (let py = 0; py < N; py++) {
    let line = '';
    for (let px = 0; px < N * 2; px++) {
      const x = ((px + 0.5) / (N * 2)) * 2 - 1;
      const y = ((py + 0.5) / N) * 2 - 1;
      line += inFlame(x, y, 1) ? (inInner(x, y, 1) ? '@' : '#') : '.';
    }
    console.log(line);
  }
  console.log('\n# = outer flame   @ = inner flame   . = background');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
SIZES.forEach(s => {
  const file = path.join(OUT, s.file);
  fs.writeFileSync(file, png(s.size, render(s.size, s.scale)));
  console.log('  ' + path.relative(ROOT, file) + '  ' + s.size + '×' + s.size +
              '  ' + Math.round(fs.statSync(file).size / 1024) + ' KB');
});
console.log('\nRun `node tools/bump-cache.js` so installed copies fetch them.');
