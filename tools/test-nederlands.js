#!/usr/bin/env node
/* Tests for Vlot (nederlands/): the answer checker, NL.form on hand-written
 * cases, and the data tables.   node tools/test-nederlands.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const NL = require(path.join(ROOT, 'nederlands/js/nl-text.js'));
const V = require(path.join(ROOT, 'nederlands/data/verbs.js'));
const W = require(path.join(ROOT, 'nederlands/data/words.js'));
NL.setVerbs(V);

let fails = 0, passes = 0;
function eq(got, want, what) {
  if (got === want) { passes++; return; }
  fails++; console.log(`FAIL ${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
}
function ok(cond, what) { if (cond) passes++; else { fails++; console.log('FAIL ' + what); } }

// ---- fold, check ------------------------------------------------------------
eq(NL.fold('  Één  Huis! '), 'één huis', 'fold');
eq(NL.fold('ĳs'), 'ijs', 'fold ij ligature');
eq(NL.fold("’t huis"), "'t huis", 'fold curly apostrophe');
eq(NL.bare('ideeën'), 'ideeen', 'bare');
[['een', ['één'], 'near'], ['ideeen', ['ideeën'], 'near'], ['cafe', ['café'], 'near'], ['één', ['één'], 'good'],
 ['Ideeën.', ['ideeën'], 'good'], ['word', ['wordt'], 'wrong'], ['gebeurt', ['gebeurd'], 'wrong'], ['wordt', ['wordt'], 'good'],
 ['  WERKT  ', ['werkt'], 'good'], ['ĳs', ['ijs'], 'good'], ["auto’s", ["auto's"], 'good'], ['', ['werkt'], 'wrong'],
 ['werk', ['werkt'], 'wrong'], ['huis!', ['huis', 'het huis'], 'good'], ['het huis', ['huis', 'het huis'], 'good'],
 ['heeft', ['heeft', 'hebt'], 'good'], ['hebt', ['heeft', 'hebt'], 'good']]
  .forEach(([i, a, w]) => eq(NL.check(i, a), w, `check ${i} ${a}`));

// ---- NL.form ------------------------------------------------------------------
const F = (v, t, p, o) => NL.form(v, t, p, o);
[
  ['werken', 'ott', 'ik', {}, 'werk'], ['werken', 'ott', 'jij', {}, 'werkt'], ['werken', 'ott', 'jij', { inv: 1 }, 'werk'],
  ['werken', 'ott', 'hij', {}, 'werkt'], ['werken', 'ott', 'wij', {}, 'werken'], ['werken', 'ott', 'zij', {}, 'werken'],
  ['werken', 'ovt', 'ik', {}, 'werkte'], ['werken', 'ovt', 'zij', {}, 'werkten'], ['maken', 'ovt', 'hij', {}, 'maakte'],
  ['werken', 'vtt', 'ik', {}, 'gewerkt'], ['verhuizen', 'vtt', 'ik', {}, 'verhuisd'], ['fietsen', 'vtt', 'wij', {}, 'gefietst'],
  ['antwoorden', 'vtt', 'hij', {}, 'geantwoord'], ['antwoorden', 'ott', 'hij', {}, 'antwoordt'], ['antwoorden', 'ovt', 'ik', {}, 'antwoordde'],
  ['gaan', 'vtt', 'ik', {}, 'gegaan'], ['gaan', 'hz', 'ik', { tt: 'ott' }, 'ben'], ['gaan', 'hz', 'hij', {}, 'is'], ['gaan', 'hz', 'wij', { tt: 'ovt' }, 'waren'],
  ['werken', 'hz', 'ik', {}, 'heb'], ['werken', 'hz', 'hij', { tt: 'ovt' }, 'had'], ['lopen', 'hz', 'ik', { aux: 'h' }, 'heb'], ['lopen', 'hz', 'ik', { aux: 'z' }, 'ben'],
  ['zijn', 'ott', 'wij', {}, 'zijn'], ['zijn', 'ott', 'u', {}, 'bent'], ['zijn', 'ott', 'jij', {}, 'bent'], ['zijn', 'ott', 'jij', { inv: 1 }, 'ben'], ['zijn', 'ott', 'hij', {}, 'is'],
  ['zijn', 'ovt', 'ik', {}, 'was'], ['zijn', 'imp', 'jij', {}, 'wees'], ['hebben', 'imp', 'jij', {}, 'heb'], ['hebben', 'ott', 'hij', {}, 'heeft'], ['hebben', 'ott', 'jij', {}, 'hebt'],
  ['kunnen', 'ott', 'jij', { inv: 1 }, 'kun'], ['kunnen', 'ott', 'ik', {}, 'kan'], ['kunnen', 'ott', 'jij', {}, 'kunt'], ['kunnen', 'ovt', 'ik', {}, 'kon'],
  ['zullen', 'cond', 'ik', {}, 'zou'], ['zullen', 'cond', 'wij', {}, 'zouden'], ['zullen', 'toek', 'ik', {}, 'zal'], ['zullen', 'toek', 'jij', {}, 'zult'], ['zullen', 'toek', 'wij', {}, 'zullen'],
  ['komen', 'imp', 'jij', {}, 'kom'], ['komen', 'ovt', 'ik', {}, 'kwam'], ['komen', 'vtt', 'ik', {}, 'gekomen'],
  ['opbellen', 'ott', 'hij', {}, 'belt'], ['opbellen', 'ott', 'hij', { sub: 1 }, 'opbelt'], ['opbellen', 'ott', 'ik', {}, 'bel'], ['opbellen', 'ovt', 'ik', {}, 'belde'],
  ['opbellen', 'ovt', 'ik', { sub: 1 }, 'opbelde'], ['opbellen', 'vtt', 'ik', {}, 'opgebeld'], ['opbellen', 'imp', 'jij', {}, 'bel'], ['opbellen', 'ott', 'jij', { inv: 1 }, 'bel'],
  ['opstaan', 'ott', 'hij', {}, 'staat'], ['opstaan', 'ott', 'hij', { sub: 1 }, 'opstaat'], ['opstaan', 'vtt', 'ik', {}, 'opgestaan'], ['opstaan', 'hz', 'ik', {}, 'heb'].slice(0, 4).concat('ben'),
  ['aankomen', 'ovt', 'hij', {}, 'kwam'], ['aankomen', 'hz', 'hij', {}, 'is'], ['meenemen', 'ott', 'ik', {}, 'neem'], ['meenemen', 'vtt', 'ik', {}, 'meegenomen'],
  ['opruimen', 'ovt', 'ik', {}, 'ruimde'], ['worden', 'ott', 'hij', {}, 'wordt'], ['worden', 'ott', 'ik', {}, 'word'], ['worden', 'hz', 'ik', {}, 'ben'],
  ['willen', 'ott', 'jij', {}, 'wilt'], ['willen', 'ott', 'jij', { inv: 1 }, 'wil'], ['mogen', 'ott', 'jij', {}, 'mag'], ['weten', 'ott', 'hij', {}, 'weet'], ['weten', 'ovt', 'wij', {}, 'wisten'],
  ['doen', 'ott', 'hij', {}, 'doet'], ['zien', 'ovt', 'ik', {}, 'zag'], ['leven', 'ovt', 'hij', {}, 'leefde'], ['lezen', 'ott', 'ik', {}, 'lees']
].forEach(c => eq(F(c[0], c[1], c[2], c[3]), c[4], `form ${c[0]} ${c[1]} ${c[2]} ${JSON.stringify(c[3])}`));
eq(NL.verb('gaan').aux, 'z', 'verb lookup');
eq(NL.verb('nonexistent'), null, 'verb lookup miss');
eq(NL.verb('werken', V).v, 'werken', 'verb lookup with table');

// ---- data: verbs -----------------------------------------------------------------
const seenV = {};
V.forEach(v => {
  const w = 'verb ' + v.v;
  ok(!seenV[v.v], w + ' duplicate'); seenV[v.v] = 1;
  ok(v.en && !/[–—]|\s-\s|-/.test(v.en), w + ' gloss with dash or empty: ' + v.en);
  ok(['h', 'z', 'hz'].includes(v.aux), w + ' aux');
  ok(['A1', 'A2', 'B1'].includes(v.b), w + ' band');
  ok(v.f && v.f.inf === v.v, w + ' inf');
  const want = [];
  ['ik', 'jij', 'jinv', 'u', 'hij', 'wij', 'jullie', 'zij'].forEach(p => want.push(['ott.' + p, v.f.ott && v.f.ott[p]]));
  want.push(['ovt.sg', v.f.ovt && v.f.ovt.sg], ['ovt.pl', v.f.ovt && v.f.ovt.pl], ['imp', v.f.imp]);
  if (v.v !== 'zullen') want.push(['vd', v.f.vd]);
  want.forEach(([k, x]) => ok(typeof x === 'string' && x.length > 0 && x !== '-' && !/\s/.test(x), `${w} form ${k}: ${JSON.stringify(x)}`));
  if (v.sep) ok(v.f.ott.ik.startsWith(v.sep) && v.v.startsWith(v.sep), w + ' separable forms start with ' + v.sep);
});
['zijn', 'hebben', 'worden', 'zullen', 'kunnen', 'moeten', 'mogen', 'willen', 'gaan', 'komen', 'doen', 'zien', 'weten', 'krijgen', 'geven', 'staan', 'zitten', 'liggen',
  'opbellen', 'opstaan', 'meenemen', 'aankomen', 'uitgaan', 'terugkomen', 'ophalen', 'afmaken', 'aanbieden', 'schoonmaken']
  .forEach(x => ok(seenV[x], 'verb required: ' + x));
ok(V.length >= 240 && V.length <= 260, 'about 250 verbs, got ' + V.length);

// ---- data: words ----------------------------------------------------------------------
const THEMES = ['basis', 'doen', 'beschrijven', 'getallen', 'kleur', 'familie', 'mensen', 'lichaam', 'eten', 'huis', 'stad', 'reizen', 'weer', 'tijd', 'werk', 'school', 'vrijetijd', 'kleding', 'gevoel', 'natuur', 'taal', 'samenleving'];
const seenW = {};
W.forEach((w, i) => {
  const t = 'word ' + w.nl;
  ok(!seenW[w.nl], t + ' duplicate nl'); seenW[w.nl] = 1;
  ok(w.en && !/[–—]|\s-\s|-/.test(w.en), t + ' gloss with dash or empty: ' + w.en);
  ok(THEMES.includes(w.th), t + ' theme ' + w.th);
  ok(['n', 'v', 'adj', 'adv', 'prep', 'pron', 'num', 'x'].includes(w.pos), t + ' pos ' + w.pos);
  ok(['A1', 'A2', 'B1', 'B2'].includes(w.b), t + ' band');
  ok(w.r === i + 1, t + ' rank');
  if (w.pos === 'n') ok(['de', 'het', 'dh'].includes(w.g), t + ' noun needs g');
  if (w.pos === 'adj') ok(typeof w.ae === 'string' && w.ae, t + ' adjective needs ae');
});
ok(W.length >= 2400, 'about 2500 words, got ' + W.length);
const bandAt = (r) => W[r - 1].b;
eq(bandAt(700), 'A1', 'band 700'); eq(bandAt(701), 'A2', 'band 701'); eq(bandAt(1501), 'B1', 'band 1501'); eq(bandAt(2501), 'B2', 'band 2501');

// ---- data: gap banks (re-run the build gate on every built item) --------------------
const GATE = require(path.join(ROOT, 'tools/nl/gaps-lib.js')).gate;
['ww', 'dehet', 'volg', 'geen', 'mv'].forEach(k => {
  const items = require(path.join(ROOT, 'nederlands/data/gaps-' + k + '.js'));
  const seenQ = {};
  items.forEach((it, i) => {
    const g = GATE(it);
    ok(!g && it.k === k, `gaps-${k} #${i} ${it.q}: ${g || 'wrong kind ' + it.k}`);
    ok(!seenQ[it.q], `gaps-${k} duplicate q ${it.q}`); seenQ[it.q] = 1;
  });
  ok(items.length > 0, `gaps-${k} is empty`);
});

console.log(`${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
