#!/usr/bin/env node
/* make-pattern.js: Ṭalāqa's background, the khatam star-and-cross of Mamluk and
 * Damascene tilework and woodwork: eight-pointed stars ({8/2}, two squares) on a
 * square grid, their points meeting so the space between reads as crosses.
 * Drawn as strapwork (a gold band with a dark core), as an inline SVG data URI
 * for arabiya/css/talaqa.css (offline, no images).
 * Run: node tools/ar/make-pattern.js  (prints the CSS custom property) */
'use strict';
function khatam(o) {
  // star-and-cross: eight-pointed star outlines ({8/2}, 16 corners) on a centred
  // square lattice, points touching along the diagonals; the cross shapes are the
  // spaces left between them. Each star also holds a small octagon.
  const S = o.S, R = S / (2 * Math.SQRT2), Ri = R * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8), W = o.w, f = n => n.toFixed(2);
  let d = '';
  const star = (cx, cy) => {
    const p = [];
    for (let i = 0; i < 16; i++) { const a = Math.PI / 4 + i * Math.PI / 8, r = i % 2 ? Ri : R; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    d += 'M' + p.map(q => f(q[0]) + ' ' + f(q[1])).join(' L') + 'Z';
    const r2 = R * o.inner, q = [];
    for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; q.push([cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)]); }
    d += 'M' + q.map(t => f(t[0]) + ' ' + f(t[1])).join(' L') + 'Z';
  };
  [[0, 0], [S, 0], [0, S], [S, S], [S / 2, S / 2]].forEach(c => star(c[0], c[1]));
  const g = `<path d="${d}" fill="none" stroke="${o.gold}" stroke-width="${W}" stroke-linejoin="miter"/><path d="${d}" fill="none" stroke="${o.core}" stroke-width="${W - o.line * 2}" stroke-linejoin="miter"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><g opacity="${o.opacity}">${g}</g></svg>`;
}
const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}")`;
const OPT = { S: 96, inner: 0.45, w: 5, line: 1.2, gold: '#e2b04a', core: '#0a1433', opacity: 0.16 };
if (require.main === module) console.log(`  --khatam:${uri(khatam(OPT))};`);
module.exports = { khatam, uri, OPT };
