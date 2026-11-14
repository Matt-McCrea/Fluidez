#!/usr/bin/env node
/* ============================================================================
 * build-verbs.js: nederlands/data/verbs.js (window.NL_VERBS) for Vlot.
 *   node tools/nl/build-verbs.js [--report]
 * Order: hermitdave FrequencyWords nl 2018, inflected words mapped to their
 * infinitive through kaikki's form_of. Forms: kaikki conjugation tables
 * (English Wiktionary), cross-checked with a rule conjugator below. Every
 * disagreement is printed; settle it in src/verb-fix.json:
 *   set  { verb: { "ott.ik": "...", "ovt.sg": ..., "vd": ..., "imp": ... } }  hand override
 *   ok   { verb: ["field", ...] }  the table is right, the rule is wrong
 *   en   { verb: "gloss" }   drop [verbs]   force [verbs]   sep { verb: "prefix" }
 * Auxiliary (hebben/zijn) is not in the Wiktionary tables: src/verb-aux.json.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const K = require('./kaikki-index.js');
const fix = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'verb-fix.json'), 'utf8'));
const AUX = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'verb-aux.json'), 'utf8'));
const N = 250;
const MUST = ['zijn', 'hebben', 'worden', 'zullen', 'kunnen', 'moeten', 'mogen', 'willen', 'gaan', 'komen', 'doen', 'zien', 'weten', 'krijgen', 'geven', 'staan', 'zitten', 'liggen',
  'opbellen', 'opstaan', 'meenemen', 'aankomen', 'uitgaan', 'terugkomen', 'ophalen', 'afmaken', 'aanbieden', 'schoonmaken', 'opruimen', 'aanzetten', 'uitzetten', 'inpakken', 'binnenkomen',
  'weggaan', 'opschrijven', 'afspreken', 'uitleggen', 'meebrengen', 'nadenken', 'opeten', 'invullen', 'toevoegen'].concat(fix.force || []);
// inflected forms that are really other words (nieten, innen...) and verbs too rare or too rude for a beginner
const DROP = new Set(['nieten', 'innen', 'maren', 'waren', 'jijen', 'goeden', 'wellen', 'uiten', 'doden', 'wijten', 'jongen', 'jouen', 'helen', 'wissen', 'velen', 'dagen', 'weren',
  'ogen', 'reden', 'huizen', 'manen', 'jouwen', 'weken', 'verdommen', 'paren', 'vasten', 'snellen', 'konden', 'halloën', 'wannen', 'zeven', 'gedenken', 'verhalen', 'gelijken', 'kanten', 'lossen',
  'eigenen', 'gassen', 'wonden', 'bruiken', 'witten', 'neuken', 'benen', 'lichten', 'beiden', 'slechten', 'wateren', 'gevallen', 'sterken', 'zagen', 'sporen', 'misten', 'zinnen', 'banen', 'ballen',
  'korten', 'koppen', 'harden', 'scholen', 'vuren', 'legen', 'beelden', 'gevoelen', 'bergen', 'wijken', 'dingen', 'beteren', 'vermoorden', 'moorden', 'schieten', 'redden', 'dumpen',
  'arresteren', 'verpesten', 'huren', 'dichten', 'bedrijven', 'kaarten', 'feesten', 'wapenen', 'schuilen', 'kwetsen', 'plegen', 'stellen', 'gelden', 'bedanken'].concat(fix.drop || []));

/* ---- the rule conjugator -------------------------------------------------- */
const SEP = ['aan', 'af', 'bij', 'binnen', 'door', 'in', 'mee', 'na', 'neer', 'om', 'op', 'over', 'rond', 'samen', 'terug', 'toe', 'uit', 'vast', 'voor', 'weg', 'los', 'open', 'thuis', 'tegen', 'schoon', 'klaar', 'vol', 'vrij'];
const NOGE = /^(be|ge|her|ont|ver)/;
const NOGE_EXC = new Set(['bellen', 'beven', 'bedelen', 'beuken', 'bemoeien_']);
const FOREIGN_UNSTRESSED = /(verander|herinner|verbeter|vermeerder|verwonder|bewonder|onderscheid)eren$|^(veranderen|herinneren|verbeteren)$/;
function syl(s) { return (s.match(/(ie|ij|ui|oe|eu|ei|au|ou|aa|ee|oo|uu|[aeiouy])+/g) || []).length; }
function stemOf(inf) {
  if (/aan$/.test(inf)) return inf.slice(0, -2);                     // gaan staan slaan: ga sta sla
  if (/(ie|oe|aa|ee|oo|uu)n$/.test(inf) && inf.length <= 5 && !/en$/.test(inf.slice(0, -1))) return inf.slice(0, -1);   // gaan, slaan
  if (/^(zien|doen|zijn)$/.test(inf)) return inf.slice(0, -1);
  if (/komen$/.test(inf)) return inf.slice(0, -2);                   // komen is kom, not koom
  return inf.replace(/en$/, '');
}
/* the stem (spelling rules applied) and, for verbs in -eren where stress cannot be read off the
 * spelling (weiger / waardeer), the alternative with the vowel doubled. */
function ruleStem(inf, sep) {
  const base = sep ? inf.slice(sep.length) : inf;
  let s = stemOf(base);
  const kofStem = s.replace(/([^aeiouy])\1$/, '$1');
  const kof = /[tkfschp]$/.test(kofStem);
  const pre = (s.match(/^(be|ge|her|ont|ver)(?=.{2})/) || [''])[0];
  const rest = s.slice(pre.length);
  let alt = null;
  if (/(aan|komen)$/.test(base)) { /* stem fixed by stemOf */ }
  else if (/([^aeiouy])\1$/.test(s) && !/[aeiouy]$/.test(s)) s = s.slice(0, -1);
  else if (/(^|[^aeiouy])[aeou][^aeiouywj]$/.test(s)) {
    if (syl(rest) >= 2 && /[^aeiouy]e[lrnm]$/.test(s)) { if (/er$/.test(s) && /eren$/.test(base)) alt = s.slice(0, -2) + 'eer'; }
    else s = s.slice(0, -2) + s.slice(-2, -1) + s.slice(-2);
  }
  const conv = x => /v$/.test(x) ? x.slice(0, -1) + 'f' : /z$/.test(x) ? x.slice(0, -1) + 's' : x;
  return { stem: conv(s), alt: alt && conv(alt), kof };
}
function ruleForms(inf, sep, useAlt) {
  const r = ruleStem(inf, sep);
  const stem = useAlt ? r.alt : r.stem, kof = r.kof;
  const prefix = sep || '';
  const st = prefix + stem;
  const t3 = /t$/.test(stem) ? st : /[^aeiou]a$/.test(stem) ? st + 'at' : st + 't';
  const ovt = /[td]$/.test(stem) ? stem + (/t$/.test(stem) ? 'te' : 'de') : stem + (kof ? 'te' : 'de');
  const baseInf = sep ? inf.slice(sep.length) : inf;
  const noge = NOGE.test(baseInf) && !NOGE_EXC.has(baseInf);
  const pp = (noge ? '' : /^[ei]/.test(stem) ? (stem[0] === 'e' ? 'geë' : 'geï') : 'ge') + (noge || !/^[ei]/.test(stem) ? stem : stem.slice(1)) + (/[td]$/.test(stem) ? '' : (kof ? 't' : 'd'));
  return { 'ott.ik': st, 'ott.jij': t3, 'ott.jinv': st, 'ott.hij': t3, 'ott.wij': inf,
    'ovt.sg': prefix + ovt, 'ovt.pl': prefix + ovt + 'n', vd: prefix.length ? prefix + pp : pp, imp: st, hasAlt: !!r.alt };
}

/* ---- candidates ------------------------------------------------------------ */
function frequency() {
  return fs.readFileSync(path.join(__dirname, 'vendor', 'nl_50k.txt'), 'utf8').split('\n').map(l => l.split(' ')).filter(a => a[1]).map(a => [a[0], +a[1]]);
}
function cfOf(e, ...tags) { return (e.cf || []).filter(f => tags.every(t => f[1].split(',').includes(t))); }
function isInf(I, w) { return (I[w] || []).some(e => e.pos === 'verb' && e.cf && cfOf(e, 'infinitive').length); }
function scores(I) {
  const score = {};
  for (const [w, c] of frequency()) {
    const forms = (I[w] || []).filter(e => e.pos === 'verb' && e.of);
    const lem = [...new Set(forms.flatMap(e => e.of))].filter(l => isInf(I, l));
    if (isInf(I, w)) {
      score[w] = (score[w] || 0) + (lem.length ? c * 0.2 : c);
      lem.forEach(l => { score[l] = (score[l] || 0) + c * 0.8 / lem.length; });
      continue;
    }
    if (!lem.length) continue;
    const other = (I[w] || []).some(e => !e.of && !['name', 'abbrev', 'character', 'symbol'].includes(e.pos));
    if (other) continue;                       // kan, werk, land: nouns first; the infinitive carries the verb
    lem.forEach(l => { score[l] = (score[l] || 0) + c / lem.length; });
  }
  return score;
}
function gloss(e, inf) {
  const g = (e.gl || [])[0] || '';
  let s = g.replace(/\([^)]*\)/g, '').split(/[;,]/)[0].trim().replace(/^to\s+/, '').replace(/[–—]/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ');
  if (s.length > 34 || !s) s = s.split(' ').slice(0, 3).join(' ');
  return s;
}

function extract(inf, e) {
  const sepTable = /separable/.test(e.table || '');
  const strong = /strong/.test(e.table || '') ? 1 : 0, irreg = /irregular/.test(e.table || '');
  const ok = f => !f[1].split(',').includes('formal') && !f[1].split(',').includes('main-clause');
  const sub = sepTable ? ok : (f => !f[1].split(',').includes('formal'));
  const pick = (...t) => (e.cf || []).filter(f => t.every(x => f[1].split(',').includes(x)) && sub(f) && !(!sepTable && f[1].includes('subordinate')) ).map(f => f[0]);
  const uniq = a => [...new Set(a)];
  const ik = pick('first-person', 'present', 'singular')[0];
  const hij = pick('third-person', 'present', 'singular')[0];
  const sg2 = uniq(pick('second-person', 'present', 'singular'));
  const jij = sg2.includes(hij) ? hij : sg2.find(x => x !== ik) || sg2[0];
  const jinv = ik;
  const plural = (e.cf || []).filter(f => f[1] === 'plural,present' || (f[1].includes('plural') && f[1].includes('present') && !f[1].includes('imperative') && !f[1].includes('participle') && !f[1].includes('main-clause') && !f[1].includes('subjunctive')));
  const wij = (e.cf || []).filter(f => /^(plural,present|present,plural|plural,present,subordinate-clause|plural,present)$/.test(f[1]) || (f[1].includes('plural') && f[1].includes('present') && f[1].includes('subordinate-clause')))[0];
  const ovtsg = pick('first-person', 'past', 'singular')[0];
  const ovtpl = (e.cf || []).filter(f => f[1].includes('past') && f[1].includes('plural') && !f[1].includes('participle') && !f[1].includes('main-clause') && !f[1].includes('imperative'))[0];
  const vdE = (e.cf || []).filter(f => f[1].includes('participle') && f[1].includes('past'))[0];
  let imp;
  const impE = (e.cf || []).filter(f => f[1].includes('imperative') && f[1].includes('singular'))[0];
  if (impE) imp = impE[0];
  let sep = null;
  if (sepTable) {
    const m = (e.cf || []).find(f => f[1].includes('first-person') && f[1].includes('present') && f[1].includes('main-clause'));
    if (m) sep = m[0].split(' ').slice(-1)[0];
    if (impE && impE[0].includes(' ')) { const [a, b] = impE[0].split(' '); imp = b + a; }
  }
  return { ik, hij, jij, jinv, wij: wij && wij[0], ovtsg, ovtpl: ovtpl && ovtpl[0], vd: vdE && vdE[0], imp, sep, strong, irreg, table: e.table };
}

function build() {
  const I = K.load();
  const sc = scores(I);
  const ranked = Object.entries(sc).sort((a, b) => b[1] - a[1]).map(a => a[0]).filter(v => !DROP.has(v) && !/\s/.test(v));
  const chosen = new Set(MUST);
  for (const v of ranked) { if (chosen.size >= N) break; chosen.add(v); }
  const order = [...chosen].sort((a, b) => (sc[b] || 0) - (sc[a] || 0));
  // the six that matter most lead, whatever the corpus says (zijn is first anyway)
  const out = [], problems = [], settled = [], unsettled = [];
  for (const inf of order) {
    const es = (I[inf] || []).filter(x => x.pos === 'verb' && x.cf && cfOf(x, 'infinitive').length);
    if (!es.length) { problems.push(inf + ': not in kaikki'); continue; }
    const e = es.find(x => cfOf(x, 'first-person', 'present').length) || es[0];
    const x = extract(inf, e);
    const sep = (fix.sep || {})[inf] || x.sep || undefined;
    const g = {
      'ott.ik': x.ik, 'ott.jij': x.jij, 'ott.jinv': x.jinv, 'ott.hij': x.hij, 'ott.wij': x.wij || inf,
      'ovt.sg': x.ovtsg, 'ovt.pl': x.ovtpl, vd: x.vd, imp: x.imp
    };
    const rule = ruleForms(inf, sep), ruleAlt = rule.hasAlt ? ruleForms(inf, sep, true) : null;
    const F = (fix.set || {})[inf] || {}, OK = (fix.ok || {})[inf] || [];
    const missing = Object.keys(g).filter(k => !g[k] && !F[k]);
    if (missing.length) problems.push(inf + ': table lacks ' + missing.join(','));
    const cmp = /weak/.test(x.table || '') && !/irregular/.test(x.table || '') ? Object.keys(rule).filter(k => k !== 'hasAlt') : x.strong ? ['ott.ik', 'ott.jij', 'ott.hij', 'ott.wij', 'imp'] : [];
    for (const k of cmp) {
      if (!g[k] || g[k] === rule[k] || (ruleAlt && g[k] === ruleAlt[k])) continue;
      if (F[k] !== undefined) settled.push(`${inf} ${k}: table ${g[k]}, rule ${rule[k]}, set ${F[k]}`);
      else if (OK === 'all' || OK.includes(k)) settled.push(`${inf} ${k}: table ${g[k]}, rule ${rule[k]}, table kept`);
      else unsettled.push(`${inf} ${k}: table ${g[k]}, rule ${rule[k]}`);
    }
    Object.keys(F).forEach(k => { g[k] = F[k]; });
    const aux = AUX.hz.includes(inf) ? 'hz' : AUX.z.includes(inf) ? 'z' : 'h';
    const f = { ott: { ik: g['ott.ik'], jij: g['ott.jij'], jinv: g['ott.jinv'], u: g['ott.u'] || g['ott.hij'], hij: g['ott.hij'], wij: g['ott.wij'], jullie: g['ott.wij'], zij: g['ott.wij'] },
      ovt: { sg: g['ovt.sg'], pl: g['ovt.pl'] }, vd: g.vd, imp: g.imp, inf };
    const v = { v: inf, en: (fix.en || {})[inf] || gloss(e, inf), r: 0, b: 'B1', aux };
    if (sep) v.sep = sep;
    if (AUX.refl.includes(inf)) v.refl = 1;
    v.f = f;
    out.push(v);
  }
  out.forEach((v, i) => { v.r = i + 1; v.b = i < 80 ? 'A1' : i < 170 ? 'A2' : 'B1'; });
  return { out, problems, settled, unsettled, sc };
}

if (require.main === module) {
  const { out, problems, settled, unsettled } = build();
  const report = process.argv.includes('--report');
  problems.forEach(p => console.log('  PROBLEM ' + p));
  unsettled.forEach(p => console.log('  UNSETTLED ' + p));
  if (report) settled.forEach(p => console.log('  settled ' + p));
  const head = `/* ============================================================================
 * VERBS: GENERATED by tools/nl/build-verbs.js. Do not edit.
 * ${out.length} verbs, commonest first. { v, en, r, b, aux, sep?, refl?, f: { ott, ovt, vd, imp, inf } }.
 * Forms: English Wiktionary conjugation tables via kaikki.org (CC BY-SA 4.0),
 * cross-checked with a rule conjugator and hand overrides (tools/nl/src/verb-fix.json).
 * Order: hermitdave FrequencyWords nl 2018, OpenSubtitles (CC BY-SA 4.0).
 * Separable verbs are stored joined (opbelt); NL.form splits them in a main clause.
 * This table is shared under CC BY-SA 4.0.
 * ========================================================================== */
`;
  fs.writeFileSync(path.join(ROOT, 'nederlands', 'data', 'verbs.js'), head +
    '(function (w) {\nw.NL_VERBS = [\n' + out.map(e => JSON.stringify(e)).join(',\n') +
    '\n];\nif (typeof module !== "undefined" && module.exports) module.exports = w.NL_VERBS;\n})(typeof window !== "undefined" ? window : globalThis);\n');
  console.log(`${out.length} verbs, ${problems.length} problems, ${settled.length} disagreements settled, ${unsettled.length} unsettled`);
}
module.exports = { build, ruleForms };
