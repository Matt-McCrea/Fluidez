/* knot-lib.js: real Celtic knotwork by Mercat's rule. A Celtic knot is the
 * medial graph of a planar graph G, drawn alternating: every edge of G becomes
 * a crossing at its midpoint, and around every vertex the strands turn from one
 * edge's midpoint to the next. Breaks (edges left out of a full square grid)
 * are what turn a plain plait into knots, as on George Bain's grids for the
 * Book of Kells. Periodic G gives a seamless tile. */
'use strict';
function knotSVG(opt) {
  const s = opt.s, P = opt.period, keep = opt.keep;         // keep(x, y, dir): dir 'h' edge (x,y)->(x+1,y), 'v' (x,y)->(x,y+1)
  const T = s * P, W = opt.w, k = s * (opt.k || 0.32);
  const gold = opt.gold, core = opt.core;
  const edges = [];
  for (let y = -2; y <= P + 2; y++) for (let x = -2; x <= P + 2; x++) {
    const m = (a) => ((a % P) + P) % P;
    if (keep(m(x), m(y), 'h')) edges.push([[x, y], [x + 1, y]]);
    if (keep(m(x), m(y), 'v')) edges.push([[x, y], [x, y + 1]]);
  }
  const key = p => p[0] + ',' + p[1];
  const at = {};
  edges.forEach(e => { [0, 1].forEach(i => { (at[key(e[i])] = at[key(e[i])] || []).push({ e, o: e[1 - i], v: e[i] }); }); });
  const P2 = p => [p[0] * s, p[1] * s];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, c) => [a[0] * c, a[1] * c];
  const unit = a => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
  const f = n => n.toFixed(2);
  const curves = [];
  Object.keys(at).forEach(kk => {
    const list = at[kk];
    const v = P2(list[0].v);
    list.forEach(it => { it.ang = Math.atan2(it.o[1] - it.v[1], it.o[0] - it.v[0]); });
    list.sort((a, b) => a.ang - b.ang);
    for (let i = 0; i < list.length; i++) {
      const a = list[i], b = list[(i + 1) % list.length];
      const ma = mul(add(v, P2(a.o)), 0.5), mb = mul(add(v, P2(b.o)), 0.5);
      const da = unit(sub(P2(a.o), v)), db = unit(sub(P2(b.o), v));
      // the face lies counterclockwise from a to b: a's left normal, b's right normal
      const na = [-da[1], da[0]], nb = [db[1], -db[0]];
      if (a === b) {     // a loose end: the strand loops round the vertex
        const c1 = add(ma, mul(unit(add(mul(da, -1), na)), s * 0.85)), c2 = add(ma, mul(unit(add(mul(da, -1), mul(na, -1))), s * 0.85));
        curves.push(`M${f(ma[0])} ${f(ma[1])} C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(ma[0])} ${f(ma[1])}`);
        continue;
      }
      const ta = unit(add(mul(da, -1), na)), tb = unit(add(mul(db, -1), nb));
      const c1 = add(ma, mul(ta, k)), c2 = add(mb, mul(tb, k));
      curves.push(`M${f(ma[0])} ${f(ma[1])} C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(mb[0])} ${f(mb[1])}`);
    }
  });
  const band = d => `<path d="${d}" fill="none" stroke="${gold}" stroke-width="${W}"/><path d="${d}" fill="none" stroke="${core}" stroke-width="${W - opt.line * 2}"/>`;
  let out = curves.map(band).join('');
  // over pieces: at each crossing, the strand from u's left side to w's right side is on top
  edges.forEach(([u, w]) => {
    const U = P2(u), Wp = P2(w), m = mul(add(U, Wp), 0.5), d = unit(sub(Wp, U)), n = [-d[1], d[0]];
    const t = unit(add(mul(d, -1), n)), L = s * (opt.over || 0.3);
    const a = add(m, mul(t, L)), b = add(m, mul(t, -L));
    out += band(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`);
  });
  const g = opt.opacity != null ? `<g opacity="${opt.opacity}">${out}</g>` : out;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}">${g}</svg>`;
}
module.exports = { knotSVG };
