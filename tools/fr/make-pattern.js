#!/usr/bin/env node
/* make-pattern.js: Couramment's background, the treillage of a Versailles garden
 * (toile de Jouy was printed with it): a diagonal lattice of slim laths with a
 * small four-petal rosette at every crossing, in madder red at about 10%.
 * Drawn as an inline SVG data URI for francais/css/couramment.css (offline, no
 * images). The tile holds one full period, crossings at the corners and the middle.
 * Run: node tools/fr/make-pattern.js         prints the CSS custom property
 *      node tools/fr/make-pattern.js --write rewrites it inside francais/css/couramment.css */
'use strict';
function treillage(o) {
  const S = o.S, f = n => n.toFixed(2);
  const laths = `M0 0 L${S} ${S} M${S} 0 L0 ${S}`;
  const cross = [[0, 0], [S, 0], [0, S], [S, S], [S / 2, S / 2]];
  // a rosette: four petals (ellipses) at 0, 45, 90 and 135 degrees around the crossing, and a seed in the middle
  let petals = '';
  cross.forEach(([cx, cy]) => {
    [0, 90, 45, 135].forEach((deg, i) => {
      const rx = i < 2 ? o.petal : o.petal * 0.62, ry = i < 2 ? o.petal * 0.42 : o.petal * 0.3;
      petals += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" transform="rotate(${deg} ${f(cx)} ${f(cy)})"/>`;
    });
    petals += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(o.seed)}" fill="${o.bg}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">` +
    `<g opacity="${o.opacity}" fill="${o.ink}" stroke="${o.ink}"><path d="${laths}" fill="none" stroke-width="${o.w}"/>` +
    `<g stroke="none">${petals}</g></g></svg>`;
}
const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}")`;
const OPT = { S: 56, w: 1.6, petal: 6.5, seed: 1.5, ink: '#a3202e', bg: '#f6efe1', opacity: 0.1 };
const prop = () => `--treillage:${uri(treillage(OPT))};`;
if (require.main === module) {
  if (process.argv.includes('--write')) {
    const fs = require('fs'), p = require('path').join(__dirname, '..', '..', 'francais', 'css', 'couramment.css');
    const css = fs.readFileSync(p, 'utf8');
    const re = /--treillage:url\("[^"]*"\);/;
    if (!re.test(css)) { console.error('couramment.css has no --treillage property to replace'); process.exit(1); }
    fs.writeFileSync(p, css.replace(re, () => prop()));
    console.log('written to francais/css/couramment.css');
  } else console.log('  ' + prop());
}
module.exports = { treillage, uri, OPT };
