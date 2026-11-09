#!/usr/bin/env node
/* ============================================================================
 * build-words.js: gaeilge/data/words.js (window.GA_WORDS) for Focail.
 *
 *   node tools/ga/build-words.js [--report]
 *
 * Source: tools/ga/src/words/*.json, arrays of { ga, en, th, t, pos?, g?, pl? }
 * written by hand: the English gloss, the theme, and t, the everyday tier
 * (1 = a beginner needs it this month, 2 = common, 3 = formal or news). The
 * build adds what it can look up:
 *   g, pl, gs  gender, plural, genitive singular, from BuNaMo noun files
 *              (an authored g wins only when BuNaMo has none, and a clash
 *              between the two is reported)
 *   r          order: tier first, then the New Corpus for Ireland rank
 *   b          band by position: A1 first 400, A2 to 1000, B1 to 1800, B2 after
 * Licences: BuNaMo (c) 2017 Foras na Gaeilge, frequency list M. B. Měchura;
 * both ODbL 1.0, so this table is too.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const VENDOR = path.join(__dirname, 'vendor');
const THEMES = ['daoine', 'corp', 'bia', 'teach', 'baile', 'taisteal', 'aimsir', 'am', 'obair', 'scoil', 'spraoi',
  'eadai', 'mothu', 'tuairisc', 'uimhreacha', 'gniomh', 'teanga', 'sochai', 'bunus'];

function ranks() {
  const m = {};
  fs.readFileSync(path.join(VENDOR, 'irish-word-frequency', 'frequency.txt'), 'utf8').split(/\r?\n/).forEach(l => {
    const c = l.split('\t'); if (c.length >= 2 && /^\d+$/.test(c[0]) && !(c[1] in m)) m[c[1]] = +c[0];
  });
  return m;
}
const GA = require(path.join(ROOT, 'gaeilge', 'js', 'ga-text.js'));
const NOUNS = {};
fs.readdirSync(path.join(VENDOR, 'BuNaMo', 'noun')).forEach(f => {
  const m = /^(.+?)_(masc|fem)\d*(?:_[^.]*)?\.xml$/.exec(f);
  if (!m) return;
  (NOUNS[m[1]] = NOUNS[m[1]] || []).push(f);
  const lo = m[1].toLowerCase();
  if (lo !== m[1]) (NOUNS[lo] = NOUNS[lo] || []).push(f);
});
function readNoun(f) {
  const xml = fs.readFileSync(path.join(VENDOR, 'BuNaMo', 'noun', f), 'utf8');
  const g = (/<sgNom default="[^"]*" gender="(masc|fem)"/.exec(xml) || [])[1];
  return { g: g === 'fem' ? 'f' : 'm', pl: (/<plNom default="([^"]*)"/.exec(xml) || [])[1] || null,
           gs: (/<sgGen default="([^"]*)"/.exec(xml) || [])[1] || null };
}
/* A homograph (several files) takes the file whose gender the author gave,
 * else the one with a plural (the everyday count noun), else the first. */
function nounInfo(ga, wantG) {
  const files = NOUNS[ga] || NOUNS[ga.toLowerCase()];
  if (!files) return null;
  const all = [...new Set(files)].sort().map(readNoun);
  let pick = (wantG && all.find(n => n.g === wantG)) || all.find(n => n.pl) || all[0];
  return Object.assign({ homograph: all.length > 1 && new Set(all.map(n => n.g)).size > 1 }, pick);
}
/* Order inside a tier: the rarest word of the item that the list knows,
 * under any mutation (ar dheis ranks as deis). */
function rankOf(R, ga) {
  let best = 0;
  ga.split(/\s+/).forEach(w => { const r = R[w] || R[GA.demutate(w)] || R[w.toLowerCase()]; if (r && r > best) best = r; });
  return best || 9999;
}

function build() {
  const dir = path.join(__dirname, 'src', 'words');
  const R = ranks(), seen = {}, out = [], problems = [];
  fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().forEach(f => {
    JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).forEach((w, i) => {
      const where = `${f}#${i} ${w.ga}`;
      if (!w.ga || !w.en) return problems.push(where + ': needs ga and en');
      if (THEMES.indexOf(w.th) === -1) return problems.push(where + ': theme ' + w.th);
      if ([1, 2, 3].indexOf(w.t) === -1) return problems.push(where + ': tier ' + w.t);
      if (/[–—]|\s-\s/.test(w.en)) return problems.push(where + ': dash');
      const key = w.ga + '|' + (w.pos || '');
      if (seen[key]) return problems.push(where + ': duplicate of ' + seen[key]);
      seen[key] = where;
      const e = { ga: w.ga, en: w.en, th: w.th, t: w.t, pos: w.pos || 'n' };
      if (e.pos === 'n') {
        const n = nounInfo(w.ga, w.g);
        if (n) {
          if (w.g && w.g !== n.g && !n.homograph) problems.push(`${where}: authored ${w.g}, BuNaMo ${n.g}`);
          e.g = n.homograph && w.g ? w.g : n.g;
          if ((w.pl || n.pl) && !w.nopl) e.pl = w.pl || n.pl;
          if (w.gs || n.gs) e.gs = w.gs || n.gs;
        } else if (w.g) { e.g = w.g; if (w.pl) e.pl = w.pl; }
        else if (!/\s/.test(w.ga)) problems.push(where + ': noun with no gender (not in BuNaMo; add g)');
      }
      e.fr = rankOf(R, w.ga);
      out.push(e);
    });
  });
  // function words (bunus) top any corpus list but make a dull first hundred:
  // within a tier they rank as if five times rarer, so content words lead
  const key = e => e.th === 'bunus' ? e.fr * 5 : e.fr;
  out.sort((a, b) => a.t - b.t || key(a) - key(b));
  out.forEach((e, i) => { e.r = i + 1; e.b = i < 400 ? 'A1' : i < 1000 ? 'A2' : i < 1800 ? 'B1' : 'B2'; delete e.fr; delete e.t; });
  return { out, problems };
}

if (require.main === module) {
  const { out, problems } = build();
  const report = process.argv.indexOf('--report') !== -1;
  (report ? problems : problems.slice(0, 40)).forEach(p => console.log('  ✗ ' + p));
  const byT = {}; out.forEach(e => { byT[e.th] = (byT[e.th] || 0) + 1; });
  const head = `/* ============================================================================
 * WORDS: GENERATED by tools/ga/build-words.js from tools/ga/src/words/. Do not edit.
 * ${out.length} words, everyday first. { ga, en, th, pos, g, pl, gs, r, b }.
 * Gender, plural and genitive: BuNaMo, Copyright (c) 2017 Foras na Gaeilge.
 * Order: Irish Word Frequency List, Michal Boleslav Měchura (New Corpus for
 * Ireland). Both Open Database License 1.0; this table is shared under it too.
 * ========================================================================== */
`;
  fs.writeFileSync(path.join(ROOT, 'gaeilge', 'data', 'words.js'), head +
    '(function (w) {\nw.GA_WORDS = [\n' + out.map(e => JSON.stringify(e)).join(',\n') +
    '\n];\nif (typeof module !== "undefined" && module.exports) module.exports = w.GA_WORDS;\n})(typeof window !== "undefined" ? window : globalThis);\n');
  console.log(`${out.length} words, ${problems.length} problems  ${JSON.stringify(byT)}`);
}
module.exports = { build, THEMES };
