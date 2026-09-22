#!/usr/bin/env node
/* ============================================================================
 * make-icons.js — the arcade's home-screen icons: a real emoji on a flat
 * colour, which is exactly what the Fluidez icon is.
 *
 *   node tools/make-icons.js            write juegos/icons/*.png
 *   node tools/make-icons.js --list     show a few emoji the system font has
 *
 * WHY IT IS GENERATED. The arcade first shipped wearing the app's wave, so two
 * apps sat on the home screen under one icon and you could not tell which you
 * were opening. This repository has no image tooling and no dependencies — a
 * rule worth keeping, because the alternative is a binary nobody can edit and
 * a toolchain that rots.
 *
 * SO WHERE DOES THE EMOJI COME FROM? Out of the system font, in pure node.
 * /System/Library/Fonts/Apple Color Emoji.ttc carries an `sbix` table, which
 * is not outlines but PNG bitmaps — one per glyph per size, up to 160px. So
 * the job is: find the glyph for the codepoint through `cmap`, pull its PNG
 * out of `sbix`, decode it, scale it, and composite it onto a flat colour.
 * That is a PNG reader and a PNG writer and about two hundred lines, and it
 * needs nothing that is not already on the machine.
 *
 * A hand-drawn flame came before this and was the wrong answer to the right
 * question: three iterations of bezier-ish maths got something that still
 * read as a raindrop, while the actual emoji was sitting in a font file the
 * whole time and matches the icon it sits beside.
 *
 * TO CHANGE THE ICON, edit ICON below and run it again. `emoji` is any single
 * emoji the system font has (--list shows some); `bg` is the flat colour
 * behind it; `inset` is how much of the tile it fills.
 *
 * MACOS ONLY, and that is a deliberate limit rather than an oversight: the
 * output PNGs are committed, so nobody else ever has to run this. If the font
 * moves or the emoji is missing it fails loudly rather than writing a blank.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'juegos', 'icons');
const FONT = '/System/Library/Fonts/Apple Color Emoji.ttc';

/* ---- the bits you change ------------------------------------------------- */
const ICON = {
  emoji: '🔥',
  bg: [226, 106, 26],           // flat orange, the way Fluidez sits on flat teal
  inset: 0.66                   // share of the tile the emoji fills
};
const SIZES = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  // Maskable art gets cropped to a circle, so it needs more room around it.
  { file: 'icon-512-maskable.png', size: 512, inset: 0.52 },
  { file: 'apple-touch-icon.png', size: 180 }
];

/* ---- reading the font ---------------------------------------------------- */
function fail(msg) { console.error('make-icons: ' + msg); process.exit(1); }

function tables(buf) {
  const tag = buf.toString('ascii', 0, 4);
  const base = tag === 'ttcf' ? buf.readUInt32BE(12) : 0;
  const n = buf.readUInt16BE(base + 4), out = {};
  for (let i = 0; i < n; i++) {
    const p = base + 12 + i * 16;
    out[buf.toString('ascii', p, p + 4)] = { off: buf.readUInt32BE(p + 8), len: buf.readUInt32BE(p + 12) };
  }
  return out;
}
// Only format 12 is looked at: emoji live above U+FFFF and format 4 cannot
// address them at all.
function glyphFor(buf, T, cp) {
  const c = T.cmap.off, n = buf.readUInt16BE(c + 2);
  for (let i = 0; i < n; i++) {
    const o = c + buf.readUInt32BE(c + 4 + i * 8 + 4);
    if (buf.readUInt16BE(o) !== 12) continue;
    const groups = buf.readUInt32BE(o + 12);
    for (let g = 0; g < groups; g++) {
      const p = o + 16 + g * 12;
      const s = buf.readUInt32BE(p), e = buf.readUInt32BE(p + 4);
      if (cp >= s && cp <= e) return buf.readUInt32BE(p + 8) + (cp - s);
    }
  }
  return 0;
}
// The biggest strike that actually has this glyph — 160px on current macOS.
function emojiPng(buf, T, gid) {
  const s = T.sbix.off, strikes = buf.readUInt32BE(s + 4);
  let best = null;
  for (let i = 0; i < strikes; i++) {
    const so = s + buf.readUInt32BE(s + 8 + i * 4);
    const ppem = buf.readUInt16BE(so);
    const o1 = buf.readUInt32BE(so + 4 + gid * 4), o2 = buf.readUInt32BE(so + 4 + (gid + 1) * 4);
    if (o2 <= o1 + 8) continue;
    if (buf.toString('ascii', so + o1 + 4, so + o1 + 8) !== 'png ') continue;
    if (!best || ppem > best.ppem) best = { ppem: ppem, data: buf.slice(so + o1 + 8, so + o2) };
  }
  return best;
}

/* ---- PNG in ---------------------------------------------------------------
 * Enough of the format to read what Apple ships: 8-bit RGBA, no interlace.
 * Anything else stops the run rather than being guessed at. */
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) fail('sbix payload is not a PNG');
  let p = 8, w = 0, h = 0, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.slice(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 6) fail('emoji PNG is not 8-bit RGBA (depth ' + data[8] + ', colour ' + data[9] + ')');
      if (data[12] !== 0) fail('emoji PNG is interlaced');
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * 4, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)];
    const line = raw.slice(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? out[y * stride + x - 4] : 0;      // left
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;     // up
      const c = (x >= 4 && y > 0) ? out[(y - 1) * stride + x - 4] : 0;
      let v = line[x];
      if (ft === 1) v += a;
      else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) {                                  // Paeth
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      } else if (ft !== 0) fail('unknown PNG filter ' + ft);
      out[y * stride + x] = v & 0xff;
    }
  }
  return { w: w, h: h, px: out };
}

/* ---- compose --------------------------------------------------------------
 * Bilinear, because the emoji is 160px and the largest icon is 512: nearest
 * neighbour at 3.2x would put visible stair-steps on every edge of a picture
 * whose whole job is to look sharp on a home screen. */
function sample(img, fx, fy) {
  const x = Math.max(0, Math.min(img.w - 1, fx)), y = Math.max(0, Math.min(img.h - 1, fy));
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const x1 = Math.min(img.w - 1, x0 + 1), y1 = Math.min(img.h - 1, y0 + 1);
  const tx = x - x0, ty = y - y0, o = [];
  for (let k = 0; k < 4; k++) {
    const a = img.px[(y0 * img.w + x0) * 4 + k], b = img.px[(y0 * img.w + x1) * 4 + k];
    const c = img.px[(y1 * img.w + x0) * 4 + k], d = img.px[(y1 * img.w + x1) * 4 + k];
    o[k] = (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  }
  return o;
}
function render(img, size, inset) {
  const buf = Buffer.alloc(size * size * 4);
  const box = Math.round(size * inset), off = Math.round((size - box) / 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = ICON.bg[0], g = ICON.bg[1], b = ICON.bg[2];
      if (x >= off && x < off + box && y >= off && y < off + box) {
        const s = sample(img, (x - off) * (img.w / box), (y - off) * (img.h / box));
        // sbix bitmaps are straight alpha, so composite rather than just copy.
        const a = s[3] / 255;
        r = s[0] * a + r * (1 - a); g = s[1] * a + g * (1 - a); b = s[2] * a + b * (1 - a);
      }
      const o = (y * size + x) * 4;
      buf[o] = Math.round(r); buf[o + 1] = Math.round(g); buf[o + 2] = Math.round(b); buf[o + 3] = 255;
    }
  }
  return buf;
}

/* ---- PNG out ------------------------------------------------------------- */
const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))
  ]);
}

/* ---- run ----------------------------------------------------------------- */
if (!fs.existsSync(FONT)) fail('no emoji font at ' + FONT + ' (this script is macOS-only; the PNGs are committed)');
const font = fs.readFileSync(FONT);
const T = tables(font);
if (!T.sbix || !T.cmap) fail('the font has no sbix/cmap table');

if (process.argv.indexOf('--list') !== -1) {
  ['🔥', '🧊', '⚡', '🎮', '🕹️', '🎯', '💥', '🌊', '🏆', '🧠'].forEach(e => {
    const g = glyphFor(font, T, e.codePointAt(0));
    const p = g && emojiPng(font, T, g);
    console.log('  ' + e + '  glyph ' + g + (p ? '  ' + p.ppem + 'px' : '  NOT IN FONT'));
  });
  process.exit(0);
}

const cp = ICON.emoji.codePointAt(0);
const gid = glyphFor(font, T, cp);
if (!gid) fail('the font has no glyph for ' + ICON.emoji + ' (U+' + cp.toString(16).toUpperCase() + ')');
const strike = emojiPng(font, T, gid);
if (!strike) fail('no bitmap strike for ' + ICON.emoji);
const img = decodePng(strike.data);
console.log('  ' + ICON.emoji + '  U+' + cp.toString(16).toUpperCase() + '  glyph ' + gid +
            '  ' + img.w + '×' + img.h + ' from the ' + strike.ppem + 'px strike');

fs.mkdirSync(OUT, { recursive: true });
SIZES.forEach(s => {
  const file = path.join(OUT, s.file);
  fs.writeFileSync(file, encodePng(s.size, render(img, s.size, s.inset || ICON.inset)));
  console.log('  ' + path.relative(ROOT, file) + '  ' + s.size + '×' + s.size +
              '  ' + Math.round(fs.statSync(file).size / 1024) + ' KB');
});
console.log('\nRun `node tools/bump-cache.js` so installed copies fetch them.');
