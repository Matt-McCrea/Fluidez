#!/usr/bin/env node
/* make-knot.js: the Celtic knotwork for Líofa's background and heading bands,
 * as SVG data URIs pasted into gaeilge/css/liofa.css (no images, works offline).
 *   knot:  knotwork by Mercat's rule (tools/ga/knot-lib.js): the medial graph of a
 *          square grid with breaks, drawn alternating, as on Bain's grids for the
 *          Book of Kells. The break pattern below gives rosettes linked by plait.
 *   twist: a two-strand cable for the bands under headings, over and under in turn.
 * Each band is drawn as a gold outline with a dark core, so the band on top
 * cuts a clean gap through the one beneath, as in the manuscripts.
 * Run: node tools/ga/make-knot.js  (prints the two CSS custom properties) */
'use strict';
const GOLD = '#d6bc80', CORE = '#0f3a2a', RED = '#c8573e';
const band = (d, w) => `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="${w}" stroke-linecap="butt"/>` +
  `<path d="${d}" fill="none" stroke="${CORE}" stroke-width="${w - 4}" stroke-linecap="butt"/>`;

function plaitUnused() {
  const T = 80, W = 11, d = 9;
  let s = '';
  // full bands first, extended past the tile so they meet the next tile
  for (let b = -T; b <= T; b += 40) s += band(`M${-20} ${-20 + b} L${T + 20} ${T + 20 + b}`, W);      // "\"  y = x + b
  for (let c = 0; c <= 2 * T; c += 40) s += band(`M${-20} ${c + 20} L${T + 20} ${c - T - 20}`, W);     // "/"  y = -x + c
  // then the band on top at every crossing
  for (let b = -T; b <= T; b += 40) for (let c = 0; c <= 2 * T; c += 40) {
    const x = (c - b) / 2, y = (c + b) / 2;
    if (x < -10 || x > T + 10 || y < -10 || y > T + 10) continue;
    const back = ((Math.round(x / 20) % 2) + 2) % 2 === 0;
    s += back ? band(`M${x - d} ${y - d} L${x + d} ${y + d}`, W) : band(`M${x - d} ${y + d} L${x + d} ${y - d}`, W);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}">${s}</svg>`;
}
function twist() {
  const L = 40, H = 20, A = 5.5, W = 6;
  const pts = (sg, x0, x1) => { const p = []; for (let x = x0; x <= x1 + 0.01; x += 1) p.push(`${x.toFixed(1)} ${(H / 2 + sg * A * Math.sin(Math.PI * x / 20)).toFixed(2)}`); return 'M' + p.join(' L'); };
  const st = (d, col) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${W}"/><path d="${d}" fill="none" stroke="${CORE}" stroke-width="${W - 3}"/>`;
  let s = st(pts(1, -2, L + 2), RED) + st(pts(-1, -2, L + 2), GOLD);
  // over pieces: gold over at x = 0 and 40, red over at x = 20
  s += st(pts(-1, -5, 5), GOLD) + st(pts(-1, L - 5, L + 5), GOLD) + st(pts(1, 15, 25), RED);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">${s}</svg>`;
}
function knot() {
  const T = 84, C = T / 2, RX = 30, RY = 11.5, W = 8, N = 720;
  const loop = rot => { const p = []; for (let i = 0; i < N; i++) { const t = 2 * Math.PI * i / N, x = RX * Math.cos(t), y = RY * Math.sin(t);
    p.push([C + x * Math.cos(rot) - y * Math.sin(rot), C + x * Math.sin(rot) + y * Math.cos(rot)]); } return p; };
  const A = loop(Math.PI / 4), B = loop(-Math.PI / 4);
  const path = (pts, closed) => 'M' + pts.map(q => q[0].toFixed(2) + ' ' + q[1].toFixed(2)).join(' L') + (closed ? 'Z' : '');
  // crossings: points of A nearest to B, one per local minimum of distance
  const dist = q => Math.min(...B.map(r => Math.hypot(q[0] - r[0], q[1] - r[1])));
  const dA = A.map(dist), cross = [];
  for (let i = 0; i < N; i++) { const a = dA[(i - 1 + N) % N], b = dA[i], c = dA[(i + 1) % N]; if (b <= a && b < c && b < 1) cross.push(i); }
  const piece = (pts, q) => { const near = []; const n = pts.length; let i0 = 0, best = 1e9;
    pts.forEach((r, i) => { const d = Math.hypot(r[0] - q[0], r[1] - q[1]); if (d < best) { best = d; i0 = i; } });
    for (let k = -36; k <= 36; k++) near.push(pts[(i0 + k + n) % n]); return near; };
  let s = band(path(A, true), W) + band(path(B, true), W);
  cross.forEach((i, k) => { const q = A[i]; s += k % 2 === 0 ? band(path(piece(A, q)), W) : band(path(piece(B, q)), W); });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}"><g opacity="0.13">${s}</g></svg>`;
}
const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}")`;
const { knotSVG } = require('./knot-lib.js');
const KNOT = knotSVG({ s: 22, w: 8, line: 1.4, gold: GOLD, core: CORE, k: 0.42, over: 0.3, period: 4, opacity: 0.16,
  keep: (x, y, d) => d === 'h' ? !(y === 0 && (x === 1 || x === 2)) && !(y === 2 && (x === 3 || x === 0))
                               : !(x === 0 && (y === 1 || y === 2)) && !(x === 2 && (y === 3 || y === 0)) });
console.log(`  --knot:${uri(KNOT)};`);
console.log(`  --twist:${uri(twist())};`);
