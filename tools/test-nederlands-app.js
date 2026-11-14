#!/usr/bin/env node
/* ============================================================================
 * test-nederlands-app.js: can Vlot (nederlands/) deal, grade and run a round?
 *
 *   node tools/test-nederlands-app.js
 *
 * Loads EXACTLY the scripts nederlands/sw.js precaches (parsed from that file, not
 * listed again here) into a minimal DOM shim, with fixture banks, and checks:
 *   - the shell: sw.js mirrors index.html, no ../ paths, build marker matches
 *   - the board renders with EMPTY banks ("binnenkort" tiles, never a crash)
 *   - every kind deals an item that scores; the mix draws only live kinds
 *   - grading good / near / wrong; typed once answered right
 *   - the learnt rule (typed first sight, 180 days, a miss un-learns)
 *   - a round runs to its end in both modes; the clock pauses when hidden
 *   - the placement test, the weekly check, the cards, the word test
 *   - nothing is ever written under a `fluidez.` key
 * The fixtures below are test data only, not content.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const NLD = process.env.NL_APP_DIR || path.join(ROOT, 'nederlands');

let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  FAIL ' + msg); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- the asset list, read from the worker itself ---------------------------------
const swSrc = fs.readFileSync(path.join(NLD, 'sw.js'), 'utf8');
const block = swSrc.slice(swSrc.indexOf('var ASSETS = ['), swSrc.indexOf('];', swSrc.indexOf('var ASSETS = [')));
const assets = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
const scripts = assets.filter(f => f.endsWith('.js'));
const html = fs.readFileSync(path.join(NLD, 'index.html'), 'utf8');

ok(scripts.length > 10, 'few scripts in nederlands/sw.js ASSETS');
assets.forEach(a => { if (a !== './') ok(fs.existsSync(path.join(NLD, a)), `sw.js lists ${a}, which does not exist`); });
const htmlRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(r => !/^https?:/.test(r));
htmlRefs.forEach(r => {
  ok(r.indexOf('../') === -1, `index.html reaches out of nederlands/: ${r}`);
  ok(assets.indexOf('./' + r) !== -1, `index.html uses ${r}, which sw.js does not precache`);
});
const scriptsInHtml = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => './' + m[1]);
ok(JSON.stringify(scriptsInHtml.filter(s => scripts.indexOf(s) !== -1)) === JSON.stringify(scripts.filter(s => scriptsInHtml.indexOf(s) !== -1)),
   'script order in index.html differs from sw.js ASSETS');
ok(/<html lang="nl"/.test(html) && /<title>Vlot<\/title>/.test(html), 'index.html must be lang nl, titled Vlot');
const manifest = JSON.parse(fs.readFileSync(path.join(NLD, 'manifest.json'), 'utf8'));
ok(manifest.name === 'Vlot' && manifest.short_name === 'Vlot' && manifest.lang === 'nl' &&
   manifest.theme_color === '#f7f5ef' && manifest.background_color === '#f7f5ef', 'manifest fields');
ok(/CACHE_NAME = 'vlot-'/.test(swSrc) && !/\.\.\//.test(swSrc), 'sw.js: cache name vlot-, no ../');
ok(/cache: 'reload'/.test(swSrc), 'sw.js must fetch past the HTTP cache');
const cacheVer = /CACHE_VERSION = '([^']+)'/.exec(swSrc)[1];
const perfSrc = fs.readFileSync(path.join(NLD, 'js/perf.js'), 'utf8');
ok(new RegExp("BUILD = '" + cacheVer + "'").test(perfSrc), 'Perf.BUILD must equal CACHE_VERSION in sw.js');
['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png'].forEach(f =>
  ok(fs.existsSync(path.join(NLD, 'icons', f)), 'missing icon ' + f));
const css = fs.readFileSync(path.join(NLD, 'css/vlot.css'), 'utf8');
['#d1291f', '#1d4fa8', '#f2c318', '#111111', '#f7f5ef', '#efece3', '#4a4a4a', '#1a7a43', '#c8241b'].forEach(c =>
  ok(css.toLowerCase().indexOf(c) !== -1, 'vlot.css lacks the spec colour ' + c));
ok(!/@import|url\(|fonts\.g/.test(css), 'vlot.css must be self-contained, no web fonts');
ok(/#stage-host\s*\{[^}]*env\(safe-area-inset-top/.test(css), 'vlot.css lost the safe-area #stage-host rule');
// no Líofa or Fluidez storage key, and no Irish leftovers, anywhere under nederlands/
(function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f), st = fs.statSync(fp);
    if (st.isDirectory()) return walk(fp);
    if (!/\.(js|html|json|css)$/.test(f)) return;
    const t = fs.readFileSync(fp, 'utf8'), rel = path.relative(NLD, fp);
    ok(!/liofa\./i.test(t) && !/fluidez\./i.test(t), rel + ' contains a liofa. or fluidez. storage key');
    if (/\.js$/.test(f) && rel.indexOf('data') !== 0) ok(!/L[ií]ofa|\bGA_|gaeilge/.test(t), rel + ' still mentions Líofa or GA_');
  });
})(NLD);
// no dashes in what the app shows: UI strings in the app scripts (spelling hyphens in n-/t- are fine)
['nl-arcade.js', 'gameround.js', 'nl-items.js', 'nl-check.js', 'nl-convo.js'].forEach(f => {
  const src = fs.readFileSync(path.join(NLD, 'js', f), 'utf8');
  ok(!/[–—]/.test(src.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')), f + ' shows an en or em dash outside comments');
});

// ---- a DOM big enough to build the board in -------------------------------------------
class El {
  constructor(tag, ns) {
    this.tagName = String(tag || '').toUpperCase();
    this.namespaceURI = ns || 'http://www.w3.org/1999/xhtml';
    this.children = []; this.parentNode = null;
    this._text = ''; this.className = ''; this.attrs = {};
    this.disabled = false; this.type = ''; this.hidden = false; this.value = '';
    this._on = {};
    const self = this;
    this.style = { setProperty(k, v) { self.attrs['style:' + k] = v; } };
    this.dataset = {};
    this.classList = {
      add(...cs) { cs.forEach(c => { if (!self.cls().includes(c)) self.className = (self.className + ' ' + c).trim(); }); },
      remove(...cs) { self.className = self.cls().filter(x => !cs.includes(x)).join(' '); },
      contains(c) { return self.cls().includes(c); },
      toggle(c, on) { if (on === undefined ? !self.cls().includes(c) : on) this.add(c); else this.remove(c); }
    };
  }
  cls() { return String(this.className || '').split(/\s+/).filter(Boolean); }
  get firstChild() { return this.children[0] || null; }
  appendChild(n) { n.parentNode = this; this.children.push(n); return n; }
  removeChild(n) { this.children = this.children.filter(c => c !== n); return n; }
  setAttribute(k, v) { if (k === 'class') this.className = String(v); else this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k]; }
  set textContent(v) { this._text = String(v); this.children = []; }
  get textContent() { return this.children.length ? this.children.map(c => c.textContent).join('') : this._text; }
  set innerHTML(v) { this._text = String(v).replace(/<[^>]*>/g, ''); this.children = []; }
  addEventListener(ev, fn) { (this._on[ev] = this._on[ev] || []).push(fn); }
  dispatchEvent(e) { (this._on[e && e.type] || []).forEach(fn => fn(e)); return true; }
  click() { if (!this.disabled) this.dispatchEvent({ type: 'click', stopPropagation() {}, preventDefault() {} }); }
  focus() {}
  all(pred, out) { out = out || []; this.children.forEach(c => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}
const text = n => n.textContent;
const STAGE = new El('div');
const byCls = c => STAGE.all(n => n.cls().includes(c));
const btnWith = (c, t) => byCls(c).filter(n => text(n) === t)[0];
const allText = () => STAGE.textContent;

const store = {}, written = [];
global.window = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { written.push(k); store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.location = { search: '', hash: '', reload() { global.__reloaded = true; } };
const HIST = [], WINL = {}, DOCL = {};
global.history = {
  pushState(st) { HIST.push(st); },
  back() { HIST.pop(); (WINL.popstate || []).forEach(fn => fn({ state: HIST[HIST.length - 1] || null })); }
};
window.addEventListener = (ev, fn) => { (WINL[ev] = WINL[ev] || []).push(fn); };
// the round animates on frames: a short timer keeps the clock honest without a browser
global.requestAnimationFrame = fn => setTimeout(fn, 8);
global.cancelAnimationFrame = id => clearTimeout(id);
global.Event = class { constructor(t) { this.type = t; } };
global.document = {
  documentElement: new El('html'), body: new El('body'),
  createElement: t => new El(t),
  createElementNS: (ns, t) => new El(t, ns),
  createTextNode: s => { const n = new El('#text'); n._text = String(s); return n; },
  removeEventListener(ev, fn) { DOCL[ev] = (DOCL[ev] || []).filter(f => f !== fn); },
  querySelector: sel => STAGE.all(n => n.cls().includes(String(sel).replace(/^\./, '')))[0] || null,
  getElementById: id => (id === 'stage-host' ? STAGE : null),
  addEventListener(ev, fn) { (DOCL[ev] = DOCL[ev] || []).push(fn); },
  readyState: 'complete', visibilityState: 'visible', hidden: false
};
const fire = (ev, e) => (DOCL[ev] || []).slice().forEach(fn => fn(e || { type: ev, key: ev }));
window.navigator = { language: 'nl' };

// ---- load the page's scripts, in the page's order. Empty banks first. -----------------------
scripts.forEach(rel => (0, eval)(fs.readFileSync(path.join(NLD, rel), 'utf8')));

const W = global.window;
// data/conversations.js assigns to `this` (the page's window); in this shim that is the global object
if (!W.NL_CONVOS && global.NL_CONVOS) W.NL_CONVOS = global.NL_CONVOS;
if (!W.NL_CONVO_AUDIO && global.NL_CONVO_AUDIO) W.NL_CONVO_AUDIO = global.NL_CONVO_AUDIO;
ok(!!W.NLItems && !!W.GameScore && !!W.GameRound && !!W.NLCheck && !!W.NLArcade && !!W.NL, 'the modules did not load');
ok(!W.ENGINE && !W.Checker && !W.Speak, 'the Spanish engine leaked into Vlot');

// The repository's own banks may be full by now; the board must cope with none at all.
const REAL = { b: W.NL_BANK, w: W.NL_WORDS, p: W.NL_PHRASES };
console.log(`  repository banks: ${(REAL.b || []).length} gap rows, ${(REAL.w || []).length} words, ${(REAL.p || []).length} phrases`);
W.NL_BANK = []; W.NL_WORDS = []; W.NL_PHRASES = []; W.NLItems.reset();
W.NLArcade.board();
{
  const tiles = byCls('arc-tile'), soon = byCls('arc-soon');
  ok(tiles.length === 8 && tiles.filter(t => t.cls().includes('arc-convo-tile')).length === 1, `empty banks: expected 7 game tiles and Conversations, got ${tiles.length}`);
  ok(tiles.filter(t => !t.cls().includes('arc-convo-tile')).every(t => t.disabled), 'empty banks: every game tile must be disabled');
  ok(soon.length === 7 && soon.every(s => text(s) === 'binnenkort'), 'empty banks: tiles must say "binnenkort"');
  ok(allText().indexOf('Vlot') !== -1 && allText().indexOf('Speel') !== -1, 'empty banks: brand and Speel are missing');
  ok(byCls('arc-jugar').length === 1 && byCls('arc-jugar')[0].disabled, 'empty banks: Speel must be disabled');
  ok(allText().indexOf('Voortgang') !== -1, 'empty banks: the progress panel did not render');
  ok(byCls('arc-fail').length === 0, 'empty banks: the board fell into the failure screen');
  const labels = ['Werkwoorden', 'Woorden', 'Zinnen', 'De of het', 'Woordvolgorde', 'Niet of geen', 'Meervoud en -je'];
  labels.forEach(l => ok(tiles.some(t => text(t).indexOf(l) !== -1), 'no tile for ' + l));
  ok(['Verbs', 'Words', 'Phrases', 'De or het', 'Word order', 'Niet or geen', 'Plurals and -je']
    .every(e => tiles.some(t => text(t).indexOf(e) !== -1)), 'tiles lack their small English line');
  ok(W.NLItems.next('speel', 1, Math.random, {}) === null, 'an empty mix must deal null, not throw');
  ok(W.NLItems.coverage(null).of === 0 && W.NLItems.phraseCoverage().of === 0, 'empty coverage');
  ok(W.NLCheck.ladder().length === 0 && W.NLCheck.due() === false, 'empty banks: no ladder, no check due');
  W.NLArcade.cardScreen('nope'); ok(allText().indexOf('No card') !== -1, 'a missing card must say so');
  W.NLArcade.board();
  W.NLArcade.levelPicker(); ok(byCls('arc-pick').length === 4 && !byCls('arc-wtbtn').length, 'the level picker offers no placement test without banks');
  W.NLArcade.checkRun(); ok(allText().length > 0 && !byCls('arc-fail').length, 'a check over empty banks must not crash');
  W.NLArcade.wordTest(W.NLArcade.GAMES[2]); ok(allText().indexOf('end of the list') !== -1, 'the word test over no words says so');
  W.NLArcade.board();
}
// and with the globals not defined at all
{
  const keep = { b: W.NL_BANK, w: W.NL_WORDS, p: W.NL_PHRASES, c: W.NL_CARDS };
  delete W.NL_BANK; delete W.NL_WORDS; delete W.NL_PHRASES; delete W.NL_CARDS;
  W.NLItems.reset();
  let threw = null;
  try { W.NLArcade.board(); W.NLArcade.cardScreen('ott'); W.NLArcade.board(); } catch (e) { threw = e; }
  ok(!threw, 'board must cope with undefined banks: ' + (threw && threw.message));
  W.NL_BANK = keep.b; W.NL_WORDS = keep.w; W.NL_PHRASES = keep.p; W.NL_CARDS = keep.c;
}

// ---- fixtures (test data, not content) -------------------------------------------------------------
const BANDS = ['A1', 'A2', 'B1', 'B2'];
const TOPICS = { ww: ['ott', 'ovt', 'toek'], dehet: ['art', 'adj', 'bez'], volg: ['inv', 'bijzin'],
  geen: ['geen', 'niet'], mv: ['pl', 'dim'] };
const ROWS = [];
let n = 0;
Object.keys(TOPICS).forEach(k => TOPICS[k].forEach(t => BANDS.forEach(b => {
  n++;
  ROWS.push({ k, t, b, q: `Fixture ${k} ${t} ${b} number ${n} ___ (x).`, a: 'ans' + n, o: ['ans' + n, 'wrongone' + n, 'wrongtwo' + n, 'wrongthree' + n],
    e: 'English of ' + n, w: 'Why in English ' + n, wn: 'Why in Dutch ' + n, v: k === 'ww' ? 'verb' + (n % 5) : undefined });
})));
// one row alone in its topic, with a near-miss answer and an alternative
ROWS.push({ k: 'ww', t: 'uniq', b: 'A1', q: 'Gisteren ___ (zien) ik de hond.', a: 'zag', x: ['zag ik'], o: ['zag', 'zie', 'zal zien', 'gezien'],
  e: 'Yesterday I saw the dog.', w: 'Gisteren: the past.', wn: 'Gisteren: de verleden tijd.', v: 'zien' });
const UNIQ = ROWS[ROWS.length - 1];
const WORDS = [], THEMES = ['family', 'food', 'home'];
for (let i = 1; i <= 36; i++) {
  WORDS.push({ nl: 'woord' + i, en: 'word number ' + i, g: i % 3 === 0 ? 'de' : i % 3 === 1 ? 'het' : undefined, pl: i % 3 === 0 ? 'woorden' + i : undefined,
    th: THEMES[i % 3], b: BANDS[Math.floor((i - 1) / 9)], r: i, pos: 'n' });
}
const PHRASES = [];
const lens = [3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < 24; i++) {
  const len = lens[i % lens.length];
  const nl = Array.from({ length: len }, (_, j) => 'pw' + i + 'x' + j).join(' ') + '.';
  PHRASES.push({ nl, en: 'phrase english ' + i, alt: i % 2 ? ['alt ' + nl] : [], th: 'th' + (i % 3), b: BANDS[Math.floor(i / 6)], t: 1 + (i % 3), n: i % 4 === 0 ? 'a note ' + i : undefined });
}
function loadFixtures() {
  W.NL_BANK = ROWS.slice(); W.NL_WORDS = WORDS.slice(); W.NL_PHRASES = PHRASES.slice();
  W.NLItems.reset();
}
loadFixtures();
W.Profile.markPlaced();

let seed = 20261109;
const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const bareOf = a => a.replace(/^(de\/het|de|het) /, '');
const GI = W.NLItems, GS = W.GameScore, SRS = W.SRS;
W.Profile.set('B2');                                  // widest pool

// ---- every kind deals an item that scores ------------------------------------------------------------
['ww', 'dehet', 'volg', 'geen', 'mv', 'woorden', 'zinnen', 'speel'].forEach(kind => {
  let dealt = 0, scored = 0;
  for (let i = 0; i < 20; i++) {
    const it = GI.next(kind, 1 + (i % 8), rng, { grind: { asked: 0, newN: 0, used: {} } });
    if (!it) continue;
    dealt++;
    ok(!!it.answer && it.play, `${kind}: item has no answer or play`);
    ok(it.play !== 'choose' || (it.options.length === 4 && it.options.indexOf(it.answer) !== -1), `${kind}: choose item must carry 4 options incl. the answer`);
    ok(it.cefr && BANDS.indexOf(it.cefr) !== -1, `${kind}: item band ${it.cefr}`);
    ok(it.prompt && it.prompt.length > 0, `${kind}: no prompt`);
    if (GS.award(it, 'good', 1200, 3).points > 0) scored++;
  }
  ok(dealt >= 18, `${kind}: only dealt ${dealt} of 20`);
  ok(scored === dealt, `${kind}: ${dealt - scored} items scored zero`);
  console.log(`  ${kind.padEnd(9)} dealt ${dealt}/20, all scored`);
});
{ // the gap items: English one tap away (peek), the note in English first at A1
  W.Profile.set('A1');
  const it = GI.next('ww', 1, rng, { tenses: ['uniq'] });
  ok(it.peek === 'Yesterday I saw the dog.', 'the English sentence must ride as peek');
  ok(it.note === 'Gisteren: the past.' && it.noteAlt === 'Gisteren: de verleden tijd.' && it.noteAltLabel === 'in het Nederlands', 'A1 note: English first, Dutch one tap away');
  ok(it.prompt.indexOf('＿＿＿') !== -1 && it.options.length === 4, 'gap prompt shows the blank, 4 options');
  W.Profile.set('B1');
  const it2 = GI.next('ww', 1, rng, { tenses: ['uniq'] });
  ok(it2.note === 'Gisteren: de verleden tijd.' && it2.noteAlt === 'Gisteren: the past.', 'B1 note: Dutch first');
  W.Profile.set('B2');
}
{ // the tense picker filters by t, topics filter the rest
  for (let i = 0; i < 15; i++) {
    const it = GI.next('ww', 3, rng, { tenses: ['ovt'] });
    ok(it.topic === 'ww:ovt', 'tense picker leaked ' + it.topic);
    const g = GI.next('dehet', 3, rng, { topics: ['art'] });
    ok(g.topic === 'dehet:art', 'topic picker leaked ' + g.topic);
  }
  const seen = {};
  for (let i = 0; i < 120; i++) { const it = GI.next('speel', 3, rng, {}); seen[it.kind] = 1; }
  ok(['ww', 'woorden', 'zinnen', 'dehet', 'volg', 'geen', 'mv'].every(k => seen[k]), 'the mix never dealt: ' + Object.keys(seen));
}
{ // recent memory is kept under vlot.recent and options are shuffled per deal
  ok(JSON.parse(store['vlot.recent']).length > 0, 'nothing in vlot.recent');
  const orders = {};
  for (let i = 0; i < 30; i++) orders[GI.next('ww', 3, rng, { tenses: ['uniq'] }).options.join()] = 1;
  ok(Object.keys(orders).length > 3, 'options are not being shuffled');
}
{ // the mix with some banks missing deals only from the live ones
  const keep = W.NL_BANK; W.NL_BANK = keep.filter(r => r.k === 'geen'); GI.reset();
  const kinds = {};
  for (let i = 0; i < 40; i++) { const it = GI.next('speel', 3, rng, {}); if (it) kinds[it.kind] = 1; }
  ok(Object.keys(kinds).sort().join() === 'geen,woorden,zinnen', 'partial banks: mix dealt ' + Object.keys(kinds));
  W.NL_BANK = keep; GI.reset();
}

// ---- grading -------------------------------------------------------------------------------------------------
{
  const it = { accept: ['zag', 'zag ik'] };
  ok(GI.grade(it, 'zag') === 'good', 'exact is good');
  ok(GI.grade(it, 'Zag ') === 'good', 'case and spaces do not matter');
  ok(GI.grade(it, 'zag ik') === 'good', 'x: alternative accepted');
  ok(GI.grade({ accept: ['één'] }, 'een') === 'near', 'an accent slip is near');
  ok(GI.grade({ accept: ['wordt'] }, 'word') === 'wrong' && GI.grade({ accept: ['gebeurd'] }, 'gebeurt') === 'wrong', 'a d/t slip is WRONG: that is the trap');
  ok(GI.grade(it, 'xyz') === 'wrong' && GI.grade(it, '') === 'wrong', 'wrong is wrong');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'near', 1000, 0).points < GS.award({ cefr: 'A1', play: 'type' }, 'good', 1000, 0).points, 'near scores less');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'wrong', 1000, 5).points === 0, 'wrong scores zero');
}

// ---- tap first, type once known ---------------------------------------------------------------------------------
{
  const id = GI.gapId(UNIQ);
  ok(GI.next('ww', 1, rng, { tenses: ['uniq'] }).play === 'choose', 'a new item is tapped');
  SRS.enrol(id); SRS.grade(id, true);                    // a right tap: known, not learnt
  ok(!SRS.isLearnt(id) && GI.answeredRight(id), 'a right tap makes it known, not learnt');
  const it = GI.next('ww', 1, rng, { tenses: ['uniq'] });
  ok(it.play === 'type', 'an item answered right once comes back typed');
  ok(GI.grade(it, 'zag') === 'good', 'the typed item grades');
  SRS.grade(id, false);                                  // a miss
  ok(!GI.answeredRight(id), 'a missed item is no longer "answered right"');
  ok(GI.next('ww', 1, rng, { tenses: ['uniq'] }).play === 'choose', 'a missed item is tapped again');
}

// ---- the learnt rule ----------------------------------------------------------------------------------------------------
{
  SRS._reset();
  SRS.enrol('t:a'); SRS.grade('t:a', true, { typed: true, fresh: true });
  ok(SRS.isLearnt('t:a'), 'typed right on first sight is learnt');
  SRS.grade('t:b', true, { typed: true });                // no card before: fresh by itself
  ok(SRS.isLearnt('t:b'), 'typed right with no card before is learnt');
  SRS.enrol('t:c'); SRS.grade('t:c', true, { typed: false, fresh: true });
  ok(!SRS.isLearnt('t:c') && SRS.passed('t:c'), 'a right tap on first sight is never learnt');
  SRS.enrol('t:d'); SRS.grade('t:d', true, { typed: true, fresh: false });
  ok(!SRS.isLearnt('t:d'), 'typed right on an item seen before is not learnt by rule (a)');
  SRS.state('t:d').last = SRS.today() - 200;
  SRS.grade('t:d', true, {});
  ok(SRS.isLearnt('t:d'), 'right 180+ days after the previous review is learnt, even by a tap');
  SRS.state('t:e') || SRS.enrol('t:e'); SRS.grade('t:e', true, {}); SRS.state('t:e').last = SRS.today() - 100; SRS.grade('t:e', true, {});
  ok(!SRS.isLearnt('t:e'), '100 days is not enough');
  SRS.grade('t:a', false);
  ok(!SRS.isLearnt('t:a') && SRS.state('t:a').lapses === 1, 'a miss un-learns');
  ok(!SRS.isDue('t:b'), 'a learnt item is never due');
  SRS.learn('t:f'); ok(SRS.isLearnt('t:f') && !SRS.isDue('t:f'), 'learn() is permanent');
  // learnt items are never dealt
  const wid = 'w:woord1'; SRS.learn(wid);
  let hit = false;
  for (let i = 0; i < 60; i++) { const it = GI.next('woorden', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === wid) hit = true; }
  ok(!hit, 'a learnt word was dealt again');
  ok(!GI.knownCard({ reps: 3, passed: false, consecMiss: 2 }), 'reps > 0 is not "known"');
}

// ---- My phrases: choose your own, and the round asks only those ---------------------------------------------------------------
{
  store['vlot.srs'] = '{}'; SRS._reset(); delete store['vlot.arcade'];
  W.Profile.set('A1');
  W.NLArcade.knownScreen({ key: 'x', hue: '#fff' }, true);
  const boxes = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(boxes.length === GI.phraseList().list.length && boxes.every(b => !b.checked), 'the choose screen lists every phrase, none ticked');
  [0, 3].forEach(i => { boxes[i].checked = true; boxes[i]._on.change.forEach(fn => fn()); });
  const arc = JSON.parse(store['vlot.arcade']), mine = arc.pmine;
  ok(mine.length === 2 && mine.every(id => !SRS.isLearnt(id)), 'two ticks put two phrases on your own list, and nothing is marked known');
  ok((arc.focus || arc.pfocus).indexOf('mine') !== -1, 'the My phrases topic turns on by itself');
  const themes = mine.map(id => 'id:' + id), seen = new Set(), st = { asked: 0, newN: 0, used: {} };
  for (let i = 0; i < 30; i++) { const it = GI.next('zinnen', 2, rng, { grind: st, count: 30, gkind: 'zinnen', themes }); if (it) seen.add(it.id); }
  ok(seen.size > 0 && [...seen].every(id => mine.indexOf(id) !== -1), 'the grind deals only your phrases: ' + [...seen]);
  ok(/ of 2 phrases/.test(GI.phraseCoverage(themes).text), 'the coverage line counts your phrases: ' + GI.phraseCoverage(themes).text);
    { // your own phrases keep to the schedule: each new one once, then the round stops, nothing not yet due
      const stS = { asked: 0, newN: 0, used: {} }, dealt = [];
      for (let i = 0; i < 20; i++) { const it = GI.next('zinnen', 2, rng, { grind: stS, count: 10, gkind: 'zinnen', themes: themes }); if (it) dealt.push(it.id); }
      ok(dealt.length === 2 && new Set(dealt).size === 2, 'a round on your own phrases asks each once and then ends: ' + dealt.length);
      const r = GI.mineReady(themes);
      ok(r.total === 2 && r.ready === 2 && r.low, 'mineReady counts your phrases ready today and says the list is low');
      ok(!GI.mineReady(['x']).low, 'no own phrases, no low note');
      const hi = GI.phraseList().list.filter(e => e.b && !/^A1/.test(e.b))[0];
      if (hi) { const stH = { asked: 0, newN: 0, used: {} }; const it = GI.next('zinnen', 1, rng, { grind: stH, count: 10, gkind: 'zinnen', themes: ['id:' + hi.id] });
        ok(it && it.id === hi.id, 'a phrase you picked is dealt even above your level'); }
    }
  W.NLArcade.knownScreen({ key: 'x', hue: '#fff' }, true);
  const b2 = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(b2.filter(b => b.checked).length === 2, 'the choose screen shows your ticks again');
  [0, 3].forEach(i => { b2[i].checked = false; b2[i]._on.change.forEach(fn => fn()); });
  const arc2 = JSON.parse(store['vlot.arcade']);
  ok(arc2.pmine.length === 0 && (arc2.focus || arc2.pfocus).indexOf('mine') === -1, 'an empty list turns the topic off');
  store['vlot.srs'] = '{}'; SRS._reset(); delete store['vlot.arcade'];
}

// ---- ticking a phrase as known skips it; unticking brings it back ------------------------------------------------------------
{
  store['vlot.srs'] = '{}'; SRS._reset();
  W.Profile.set('A1');
  const PL0 = GI.phraseList().list, a = PL0[0];
  PL0.slice(1).forEach(e => SRS.learn(e.id));
  const deal = () => { let hit = false; for (let i = 0; i < 80; i++) { const it = GI.next('zinnen', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === a.id) hit = true; } return hit; };
  ok(deal(), 'before ticking, the phrase can be dealt');
  SRS.learn(a.id);
  ok(SRS.isLearnt(a.id) && !deal(), 'a ticked phrase was dealt again');
  SRS.unlearn(a.id);
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id) && deal(), 'an unticked phrase did not come back');
  ok(SRS.isLearnt(PL0[1].id), 'unlearn touched another phrase');
  // the tick screen: a row per phrase, ticked when learnt; ticking and unticking go through the SRS
  W.NLArcade.knownScreen({ key: 'x', hue: '#fff' });
  const boxes = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(boxes.length === PL0.length && boxes.slice(1).every(b => b.checked) && !boxes[0].checked, 'the tick screen lists every phrase, ticked when learnt');
  boxes[0].checked = true; boxes[0]._on.change.forEach(fn => fn());
  ok(SRS.isLearnt(a.id), 'ticking a row learns the phrase');
  boxes[0].checked = false; boxes[0]._on.change.forEach(fn => fn());
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id), 'unticking a row clears it');
  store['vlot.srs'] = '{}'; SRS._reset();
}

// ---- the word grind and phrases -------------------------------------------------------------------------------------------
{
  const st = { asked: 0, newN: 0, used: {} }, firsts = [];
  W.Profile.set('A1');
  for (let i = 30; i <= 36; i++) { SRS.enrol('w:woord' + i); SRS.grade('w:woord' + i, true); }   // seen in earlier rounds
  for (let i = 0; i < 8; i++) {
    const it = GI.next('woorden', 1, rng, { grind: st, count: 10, gkind: 'woorden' });
    firsts.push(it);
    if (it) { SRS.enrol(it.id); SRS.grade(it.id, true); }   // seen and right, so it is "recent" next
  }
  ok(firsts.every(Boolean), 'the word grind dealt nothing');
  ok(firsts.slice(4).filter(i => i.grind === 'recent').length >= 3, 'the cap holds new words back while recent ones remain: ' + firsts.map(i => i.grind));
  const newOnes = firsts.filter(i => i.grind === 'new');
  ok(newOnes.length >= 4 && newOnes.length <= 5, 'new words per round are capped near 4, got ' + newOnes.length);
  ok(firsts.slice(4).every(i => i.grind === 'recent' || i.grind === 'new'), 'after the cap the grind revisits recent words first: ' + firsts.map(i => i.grind));
  ok(newOnes.map(i => i.rank).join() === '2,3,4,5' || newOnes.every((i, k) => k === 0 || i.rank > newOnes[k - 1].rank), 'new words come in rank order');
  firsts.forEach(it => {
    const w = WORDS.filter(x => x.nl === bareOf(it.answer))[0];
    ok(it.options && it.options.indexOf(it.answer) !== -1, 'word item lacks options');
    const others = it.options.filter(o => o !== it.answer).map(o => WORDS.filter(x => x.nl === bareOf(o))[0]);
    ok(others.filter(o => o.th === w.th).length >= 2, 'distractors should share the theme and band where they can');
    if (w.g) ok(it.note && it.note.indexOf(w.g + ' ' + w.nl) !== -1 && it.answer === w.g + ' ' + w.nl, 'a noun note and answer show its article');
  });
  // a miss comes back first
  const missed = firsts[0];
  SRS.grade(missed.id, false);
  const back = GI.next('woorden', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(back.id === missed.id && (back.grind === 'due' || back.grind === 'missed'), 'a missed word must come back first, got ' + back.grind + ' ' + back.id);
  // typed accepts the word with or without its article once known (everything else learnt, so only it can be dealt)
  const keep = store['vlot.srs'], w2 = firsts[1];
  WORDS.forEach(w => { if ('w:' + w.nl !== w2.id) SRS.learn('w:' + w.nl); });
  const typed = GI.next('woorden', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(typed && typed.id === w2.id && typed.play === 'type' && GI.grade(typed, w2.nl) === 'good' && GI.grade(typed, bareOf(w2.nl)) === 'good', 'a known word comes back typed');
  store['vlot.srs'] = keep; SRS._reset();
  // phrases: tapped, typed at 6 or fewer, built at 7 or 8
  W.Profile.set('B2');
  const byLen = {};
  PHRASES.forEach(p => { const nn = p.nl.replace(/\./g, '').split(' ').length; (byLen[nn] = byLen[nn] || []).push(p); });
  [3, 7, 9].forEach(len => {
    const p = byLen[len][0], id = 'p:' + p.nl;
    SRS.enrol(id); SRS.grade(id, true);
  });
  const got = {};
  let gst = { asked: 0, newN: 0, used: {} };
  for (let i = 0; i < 200; i++) {
    const it = GI.next('zinnen', 1, rng, { grind: i % 12 ? gst : (gst = { asked: 0, newN: 0, used: {} }), count: 10, gkind: 'zinnen' });
    if (!it) continue;
    const p = PHRASES.filter(x => 'p:' + x.nl === it.id)[0], len = p.nl.replace(/\./g, '').split(' ').length;
    const known = SRS.isEnrolled(it.id) && GI.answeredRight(it.id);
    if (!known) ok(it.play === 'choose' && it.options.length === 4, 'an unknown phrase is tapped');
    else if (len <= 6) { ok(it.play === 'type', 'a known short phrase is typed'); ok(GI.grade(it, p.nl) === 'good', 'typed phrase grades'); got.type = 1; }
    else if (len <= 8) { ok(it.play === 'build' && it.words.length === len && it.answer === it.words.join(' '), 'a known 7 or 8 word phrase is built'); got.build = 1; }
    else ok(it.play === 'choose', 'a known long phrase stays tapped');
  }
  ok(got.type && got.build, 'never saw a typed and a built phrase');
}

// ---- coverage --------------------------------------------------------------------------------------------------------------------
{
  const cv = GI.coverage(null), pc = GI.phraseCoverage();
  ok(cv.of > 0 && cv.n <= cv.of && /commonest words/.test(cv.text), 'word coverage: ' + JSON.stringify(cv));
  ok(GI.coverage('family').theme && GI.coverage('family').theme.of === 12, 'theme coverage');
  ok(pc.of === 24 && pc.n >= 0, 'phrase coverage');
  ok(GI.verbsKnown() >= 0 && GI.gapCoverage('ww').of > 0, 'verb and gap coverage');
  ok(GI.grindThemes().length === 3, 'grind themes');
}

// ---- the word test -----------------------------------------------------------------------------------------------------------------
{
  const a = GI.wordTestNext(0);
  ok(a && a.e.nl && a.rank >= 1 && a.total === 36, 'wordTestNext');
  ok(GI.wordTestGrade(a.e, a.e.nl) === 'good' && GI.wordTestGrade(a.e, 'nope') === 'wrong', 'word test grading');
  GI.wordTestRight(a.e);
  ok(SRS.isLearnt(a.e.id), 'a word test right is permanently learnt');
  ok(GI.wordTestNext(0).e.id !== a.e.id, 'the next word skips a known one');
  const b = GI.wordTestNext(0); GI.wordTestMiss(b.e);
  ok(SRS.isEnrolled(b.e.id) && !SRS.isLearnt(b.e.id) && !SRS.isDue(b.e.id), 'a word test miss is enrolled for tomorrow');
}

// ---- a round runs, both modes ---------------------------------------------------------------------------------------------------------
let LAST = null;
{ const nx = GI.next, dk = GI.deckItem;
  GI.next = (...a) => (LAST = nx.apply(GI, a)); GI.deckItem = (...a) => (LAST = dk.apply(GI, a)); }
const overEl = () => byCls('g-over')[0];
async function waitFor(pred, ms, what) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (pred()) return true; await sleep(10); }
  ok(false, 'timed out waiting for ' + what);
  return false;
}
// answer whatever is on screen: right (or wrong), tapped or typed
async function answerOne(right) {
  await waitFor(() => LAST && !byCls('g-correct').length, 600, 'a question');
  const it = LAST, prompt = it.prompt;
  if (it.play === 'type') {
    const input = byCls('g-input')[0];
    input.value = right ? it.answer : 'zzz';
    input.dispatchEvent({ type: 'input' });
    if (!right) input.dispatchEvent({ type: 'keydown', key: 'Enter', preventDefault() {} });
  } else if (it.play === 'build') {
    const words = right ? it.words.slice() : it.words.slice().reverse();
    words.forEach(w => { const c = byCls('g-chip').filter(x => !x.cls().includes('chosen') && !x.disabled && text(x) === w)[0]; c.click(); });
  } else {
    const opts = byCls('g-opt');
    const pick = right ? opts.filter(o => text(o) === it.answer)[0] : opts.filter(o => text(o) !== it.answer)[0];
    pick.click();
  }
  return { it, prompt };
}
async function cont() {
  await sleep(30);
  const c = byCls('g-continue')[0];
  if (c) c.click();
}
async function playRound(cfg, plan) {
  let exited = false;
  STAGE.children = [];
  W.GameRound.run(STAGE, Object.assign({ onExit() { exited = true; } }, cfg));
  for (let i = 0; i < plan.length && !overEl(); i++) {
    await answerOne(plan[i]);
    await sleep(plan[i] ? 230 : 20);
    await cont();
    await sleep(60);
  }
  return { exited: () => exited };
}
(async () => {
  GS.sfx = () => {};
  W.Profile.set('A2');
  // Rustig: three questions and no clock
  {
    const r = await playRound({ key: 'speel:t', title: 'Speel', kind: 'speel', hue: '#f0b840', count: 3, duration: null }, [true, false, true, true]);
    await waitFor(() => !!overEl(), 1500, 'the Rustig end screen');
    ok(!!overEl(), 'Rustig: no end screen');
    ok(allText().indexOf('Opnieuw') !== -1 || allText().indexOf('Play again') !== -1, 'end screen: no play again');
    const st = GS.stats('speel:t');
    ok(st.plays === 1 && st.seen === 3 && st.right === 2, `Rustig was filed as ${JSON.stringify([st.plays, st.seen, st.right])}`);
    ok(allText().indexOf('1 / 3') === -1, 'the counter should be gone on the end screen');
    ok(byCls('g-miss').length === 1, 'the one miss is listed for review');
    ok(JSON.parse(store['vlot.games'])['speel:t'].plays === 1, 'vlot.games not written');
    ok(Object.keys(JSON.parse(store['vlot.errors'] || '{}')).length >= 1, 'a miss must reach vlot.errors');
    byCls('g-back')[0].click(); ok(r.exited(), 'the back button exits');
  }
  // the HUD counts in Rustig
  {
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'ww:t', title: 'Werkwoorden', kind: 'ww', hue: '#e0473f', count: 5, duration: null });
    await sleep(40);
    ok(byCls('g-secs')[0] && /1 \/ 5/.test(text(byCls('g-secs')[0])), 'Rustig shows "1 / 5" where the seconds were, got ' + text(byCls('g-secs')[0]));
    byCls('g-exit')[0].click();
  }
  // Tegen de klok: ends on the clock
  {
    await playRound({ key: 'woorden:c', title: 'Woorden', kind: 'woorden', hue: '#4a86e8', duration: 350 }, [true, true, true, true, true, true, true, true]);
    await waitFor(() => !!overEl(), 1500, 'the timed end screen');
    ok(!!overEl(), 'timed round did not end on the clock');
    const st = GS.stats('woorden:c');
    ok(st.plays === 1 && st.seen >= 1, 'timed round filed');
    byCls('g-exit').length; // nothing to click on the end screen
  }
  // the clock pauses while the page is hidden, and a 3-2-1 brings it back
  {
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'zinnen:c', title: 'Zinnen', kind: 'zinnen', hue: '#3fae6a', duration: 300, resumeStepMs: 20 });
    await sleep(60);
    global.document.visibilityState = 'hidden'; global.document.hidden = true; fire('visibilitychange');
    await sleep(500);
    ok(!overEl(), 'the clock kept running while the page was hidden');
    global.document.visibilityState = 'visible'; global.document.hidden = false; fire('visibilitychange');
    await sleep(30);
    ok(byCls('g-resume').length === 1, 'no 3-2-1 on return');
    await waitFor(() => !!overEl(), 2500, 'the round to end after resuming');
    ok(!!overEl(), 'the round never ended after resuming');
  }
  // a typed item resolves the moment it is right; a miss un-learns and is recorded
  {
    const id = GI.gapId(UNIQ);
    SRS._reset(); store['vlot.srs'] = '{}'; SRS._reset();
    SRS.enrol(id); SRS.grade(id, true);                  // known, so it is typed
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'ww:t', title: 'Werkwoorden', kind: 'ww', hue: '#e0473f', count: 1, duration: null, tenses: ['uniq'] });
    await sleep(40);
    ok(LAST.play === 'type' && byCls('g-input')[0] && !byCls('g-type')[0].hidden, 'a known item is typed');
    const input = byCls('g-input')[0];
    input.value = 'zag'; input.dispatchEvent({ type: 'input' });
    await waitFor(() => !!overEl(), 1500, 'the typed round to end');
    ok(!!overEl() && SRS.passed(id), 'the typed right answer graded the SRS');
  }
  // fresh typed right in a round: permanently learnt; a tapped one is not
  {
    SRS._reset(); store['vlot.srs'] = '{}'; SRS._reset();
    const id = GI.gapId(UNIQ);
    // simulate the round's own write-back on first sight by tapping right
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'ww:t', title: 'Werkwoorden', kind: 'ww', hue: '#e0473f', count: 1, duration: null, tenses: ['uniq'] });
    await sleep(40);
    ok(LAST.play === 'choose', 'first sight is tapped');
    byCls('g-opt').filter(o => text(o) === 'zag')[0].click();
    await waitFor(() => !!overEl(), 1500, 'the round to end');
    ok(SRS.passed(id) && !SRS.isLearnt(id), 'a right first tap is known but never learnt');
  }
  // a revisit: one question in four comes from the error log
  {
    const row = ROWS[0];
    W.ErrorLog.clearAll();
    W.ErrorLog.record({ id: GI.gapId(row), front: row.q, back: row.a, kind: row.k, options: row.o, topic: row.k + ':' + row.t });
    const miss = GI.missDeck('speel', 5);
    ok(GI.missDeck(row.k, 5).length === 1 && GI.missDeck('dehet', 5).length === 0, 'missDeck filters by kind');
    for (let i = 0; i < 3; i++) W.ErrorLog.credit({ id: GI.gapId(row) });
    ok(GI.missDeck('speel', 5).length === 0, 'three right answers clear a mistake');
    W.ErrorLog.record({ id: GI.gapId(row), front: row.q, back: row.a, kind: row.k, options: row.o });
    ok(miss.length >= 1 && GI.deckItem(miss, rng).play === 'choose', 'misses come back as a tapped deck');
  }

  // ---- the placement test ------------------------------------------------------------------------------------------------------------------
  {
    const items = GI.placementItems(rng);
    ok(items.length >= 11 && items.length <= 13, 'placement should ask about 12, got ' + items.length);
    BANDS.forEach(b => ok(items.filter(i => i.band === b).length >= 2, 'placement: too few questions at ' + b));
    ok(items.every(i => i.options.length === 4 && i.accept.every(a => i.options.indexOf(a) !== -1 || true) && i.options.indexOf(i.answer) !== -1), 'placement: 4 options with the answer');
    ok(JSON.stringify(items.map(i => i.band)) === JSON.stringify(items.map(i => i.band).slice().sort()), 'placement is ordered A1 to B2');
    ok(new Set(items.map(i => i.kind)).size >= 3, 'placement should mix kinds');
    // drive it through the screen, answering everything right
    W.Profile._reset(); store['vlot.profile'] = '{}'; W.Profile._reset();
    ok(!W.Profile.placed(), 'profile should start unplaced');
    W.NLArcade.board();
    ok(allText().indexOf('Question 1 of') !== -1, 'a first open must show the placement test');
    ok(byCls('arc-tile').length === 0, 'placement replaces the board');
    for (let i = 0; i < 14 && !byCls('arc-place-band').length; i++) {
      const prompt = text(byCls('arc-place-q')[0] || { textContent: '' });
      const row = ROWS.filter(r => r.q.replace(/___+/g, '＿＿＿') === prompt)[0], word = WORDS.filter(w => w.en === prompt)[0];
      const ans = row ? row.a : word ? (word.g ? word.g + ' ' + word.nl : word.nl) : null;
      ok(!!ans, 'placement prompt not found in the fixtures: ' + prompt);
      const b = byCls('g-opt').filter(o => text(o) === ans)[0];
      if (!b) break;
      b.click();
      await sleep(470);
    }
    await waitFor(() => byCls('arc-place-band').length === 1, 800, 'the placement result');
    ok(text(byCls('arc-place-band')[0]) === 'B2' && W.Profile.current() === 'B2' && W.Profile.placed(), 'all right must place at B2, got ' + W.Profile.current());
    ok(JSON.parse(store['vlot.profile']).band === 'B2', 'the band is kept in vlot.profile');
    W.NLArcade.board();
    ok(byCls('arc-tile').length === 8 && byCls('arc-tile').every(t => !t.disabled), 'with banks, all seven tiles and Conversations play');
    ok(allText().indexOf('binnenkort') === -1, 'no tile should say "binnenkort" once the banks are there');
  }

  // ---- the board with banks: the mode sheet, the tense picker --------------------------------------------------------------------------------
  {
    W.NLArcade.board();
    const bri = byCls('arc-tile').filter(t => text(t).indexOf('Werkwoorden') !== -1)[0];
    bri.click();
    ok(allText().indexOf('Rustig') !== -1 && allText().indexOf('Tegen de klok') !== -1, 'the sheet offers both modes');
    ok(allText().indexOf('Tenses') !== -1 || allText().indexOf('Tijden') !== -1, 'Werkwoorden sheet has a tense picker');
    const chips = byCls('arc-chip');
    ok(chips.length >= 4, 'tense chips: ' + chips.length);
    const past = chips.filter(c => /Simple past|Verleden/.test(text(c)))[0];
    past.click();
    ok(JSON.parse(store['vlot.arcade']).sel.ww[0] === 'ovt', 'the tense choice is kept in vlot.arcade');
    ok(past.cls().includes('on'), 'the chosen chip lights up');
    byCls('arc-mode')[0].click();                          // Rustig
    await sleep(40);
    ok(!!byCls('g-shell')[0] && LAST.topic === 'ww:ovt', 'the round honours the chosen tense');
    byCls('g-exit')[0].click();
    ok(byCls('arc-tile').length === 8, 'leaving a round returns to the board');
    // woorden sheet: word test button and coverage
    byCls('arc-tile').filter(t => text(t).indexOf('Woorden') !== -1)[0].click();
    ok(allText().indexOf('commonest words') !== -1 && allText().indexOf('Woordentest') !== -1, 'Focail sheet: coverage and the word test');
    btnWith('arc-wtbtn', byCls('arc-wtbtn')[0] && text(byCls('arc-wtbtn')[0])).click();
    ok(allText().indexOf('Weet ik niet') !== -1 && byCls('arc-wt-prompt').length === 1, 'the word test screen');
    const prompt = text(byCls('arc-wt-prompt')[0]), w = WORDS.filter(x => x.en === prompt)[0];
    const input = byCls('arc-wt-input')[0];
    input.value = w.nl; input.dispatchEvent({ type: 'input' });
    ok(SRS.isLearnt('w:' + w.nl), 'typing the word right in Woordentest makes it learnt');
    await sleep(400);
    W.NLArcade.board();
  }

  // ---- the weekly check ----------------------------------------------------------------------------------------------------------------------------
  {
    const C = W.NLCheck;
    W.Profile.set('B2');
    const lad = C.ladder();
    ok(lad.length >= 8 && lad.every(u => u.k && u.label.nl && u.label.en), 'ladder: ' + lad.length);
    ok(C.due() === false || C.playedRounds() >= 3, 'a first check waits for three rounds');
    let s = C.session(rng, { at: 1000 });
    ok(!s.done && s.count() === 3 && s.step() === 0, 'session starts on the first unit with three questions');
    let guard = 0;
    while (!s.done && guard++ < 200) { const it = s.item(); const r = s.answer(it.a); ok(r.right && r.why && r.peek, 'right answer carries its note'); s.next(); }
    ok(s.done && !s.stopped && Object.keys(s.res).every(k => s.res[k] === 'dominado'), 'an all-right check is dominado throughout');
    ok(s.suggested === 'B2', 'suggested band after all right: ' + s.suggested);
    ok(JSON.parse(store['vlot.check']).at === 1000, 'the check is stored in vlot.check');
    ok(C.due(1000 + 2 * 86400000) === false && C.due(1000 + 8 * 86400000) === true, 'due a week later');
    ok(s.nextUnit === null, 'nothing to learn when all is well');
    // two weak units in a row stop it, and the next card is offered
    s = C.session(rng, { at: 5000 });
    guard = 0;
    while (!s.done && guard++ < 200) { const it = s.item(); s.answer(it.o.filter(o => o !== it.a && (it.x || []).indexOf(o) === -1)[0]); s.next(); }
    ok(s.done && s.stopped && Object.keys(s.res).length === 1 && s.score[lad[0].id] === '0/2', 'two misses do not stop the check at once: ' + JSON.stringify(s.score));
    ok(s.nextUnit && s.nextUnit.id === lad[0].id && s.res[lad[0].id] === 'aprender', 'the next unit to learn is the first weak one');
    ok(s.suggested === 'A1', 'all wrong suggests A1, got ' + s.suggested);
    // the weekly check keeps to the learner's level; the optional run goes further
    W.Profile.set('A1');
    ok(C.ladder().length && C.ladder().every(u => C.unitBand(u) === 0), 'the A1 ladder has a unit above A1');
    W.Profile.set('B2');
    // the screens
    C.snooze(0); store['vlot.check'] = '{}';
    W.NLArcade.checkRun();
    ok(allText().indexOf('1 of 3') !== -1 && byCls('g-opt').length === 4, 'the check screen shows a question with four options');
    ok(allText().indexOf('＿＿＿') !== -1, 'the check question shows its blank');
    // answer every question right through the UI, then read the results screen
    let loops = 0;
    while (!byCls('arc-check-lvl').length && loops++ < 120) {
      const prompt = text(byCls('arc-check-q')[0]);
      const row = ROWS.filter(r => r.q.replace(/___+/g, '＿＿＿') === prompt)[0];
      byCls('g-opt').filter(o => text(o) === row.a)[0].click();
      ok(!byCls('arc-check-next')[0].hidden, 'Next appears after an answer');
      byCls('arc-check-next')[0].click();
    }
    ok(byCls('arc-check-lvl').length === 1 && allText().indexOf('fits you') !== -1, 'the results screen reports the level');
    // the weekly card on the board
    store['vlot.check'] = '{}';
    ['speel:t', 'ww:t', 'woorden:t'].forEach(k => GS.record(k, { score: 100, combo: 1, band: 'A1', run: 1, seen: 3, right: 3, ms: 1000, curve: [] }));
    ok(W.NLCheck.due() === true, 'three rounds played and never checked: due');
    W.NLArcade.board();
    ok(byCls('arc-check').length === 1 && allText().indexOf('Weekly check') !== -1 || allText().indexOf('Wekelijkse check') !== -1, 'the weekly check card shows on the board');
  }


  // ---- moving up on its own, and the board pointing at it -------------------------------------------------------------------------------------------
  {
    const keepB = W.NL_BANK; W.NL_CARDS = W.NL_CARDS || {};
    const FX = [];
    ['ott', 'ovt'].forEach((t, ti) => { for (let n = 1; n <= 40; n++) FX.push(Object.assign({ k: 'ww', t, b: ti ? 'A2' : 'A1', q: 'Up ' + t + ' ' + n + ' ___ end.', c: 'cue', a: 'ans' + t + n, x: [],
      o: ['ans' + t + n, 'wrongone', 'wrongtwo', 'wrongthree'], e: 'Meaning ' + n, w: 'Note ' + n }, {})); });
    W.NL_BANK = FX; W.NLItems.reset();
    const text = n => n.textContent;
    const C = W.NLCheck, GIx = W.NLItems, DAYMS = 86400000;
    W.Profile.set('A1');
    const us = C.newUnitsOf('A1');
    ok(us.length > 0 && C.NEED === 100, 'A1 has units to measure');
    const rowOf = u => GIx.bank(u.k).filter(g => u.t == null || g.t === u.t)[0];
    const srsPut = n => { const o = {}; us.forEach(u => { o[GIx.gapId(rowOf(u))] = { reps: n + 2, lapses: 2 }; }); store['vlot.srs'] = JSON.stringify(o); W.SRS._reset(); };
    const btnT = re => STAGE.all(n => n.tagName === 'BUTTON' && re.test(text(n)))[0];
    srsPut(90);
    ok(us.every(u => C.correctIn(u) === 90) && C.moveUp() === null, 'moved up before ' + C.NEED + ' right in every unit of the band');
    srsPut(100);
    ok(C.moveUp() === 'A2', 'did not offer A2 after 100 right in every unit');
    { const o = JSON.parse(store['vlot.srs']); delete o[GIx.gapId(rowOf(us[0]))]; store['vlot.srs'] = JSON.stringify(o); W.SRS._reset(); }
    ok(C.moveUp() === null, 'moved up with a unit of the band short');
    srsPut(100);
    store['vlot.check'] = JSON.stringify({ at: Date.now(), res: { [us[0].id]: 'aprender' } });
    ok(C.moveUp() === null, 'moved up while the last check found a unit weak');
    store['vlot.check'] = JSON.stringify({ at: Date.now() });
    delete store['vlot.arcade'];
    W.NLArcade.board();
    ok(W.Profile.current() === 'A2', 'the board did not move the level up on its own');
    ok(byCls('arc-guided').length === 1 && byCls('arc-spot').length === 1 && /You move up to A2/.test(text(byCls('arc-spot')[0])) && /Do this now/.test(text(byCls('arc-spot')[0])),
       'the move up is not spotlit');
    ok(/100 right answers in/.test(text(byCls('arc-spot-why')[0])), 'the spotlight does not say why: ' + text(byCls('arc-spot-why')[0]));
    btnT(/^Stay at A1$/).click();
    ok(W.Profile.current() === 'A1' && C.moveUp() === null && !byCls('arc-guided').length, 'Stay did not hold the level back');
    ok(C.moveUp(Date.now() + 8 * DAYMS) === 'A2', 'the hold did not end after a week');
    // take it this time: the card for the new unit, with its practice button spotlit
    store['vlot.check'] = JSON.stringify({ at: Date.now() });
    const nu = C.newUnitsOf('A2')[0];
    if (!W.NL_CARDS[nu.card]) W.NL_CARDS[nu.card] = { kind: 'grammar', topic: 'x', name: { nl: 'Kaart', en: 'A card' }, when: [{ nl: 'a', en: 'b' }], how: { nl: 'c', en: 'd' }, ex: [], tip: null };
    W.NLArcade.board();
    btnT(/^(See|Practise) /).click();
    ok(byCls('arc-tcard').length === 1 && byCls('arc-spot').length === 1 && /Now, practise it/.test(text(byCls('arc-spot')[0])), 'the new unit card does not point at its practice');

    // a clean full check that finds you above your level moves you up, with the way back
    W.Profile.set('A1');
    store['vlot.check'] = '{}'; delete store['vlot.srs']; W.SRS._reset();
    W.NLArcade.checkRun(true);
    let lp = 0;
    while (!byCls('arc-check-lvl').length && lp++ < 120) {
      const prompt = text(byCls('arc-check-q')[0]);
      const row = FX.filter(r => r.q.replace(/___+/g, '＿＿＿') === prompt)[0];
      byCls('g-opt').filter(o => text(o) === row.a)[0].click();
      byCls('arc-check-next')[0].click();
    }
    ok(byCls('arc-check-lvl').length === 1 && /You move up to/.test(text(byCls('arc-check-lvl')[0])) && W.Profile.current() !== 'A1', 'a clean full check did not move the level up on its own');
    btnT(/^Stay at A1$/).click();
    ok(W.Profile.current() === 'A1' && /You stay at A1/.test(text(byCls('arc-check-lvl')[0])), 'Stay did not put the level back');
    store['vlot.check'] = '{}';
    W.NL_BANK = keepB; W.NLItems.reset(); delete store['vlot.srs']; W.SRS._reset();
    W.Profile.set('B2');
  }

  // ---- the cards -------------------------------------------------------------------------------------------------------------------------------------
  {
    ok(!!W.NL_CARDS.ott && Object.keys(W.NL_CARDS).length >= 10, 'cards.js did not load');
    W.NL_CARDS.fixture = { kind: 'grammar', topic: 'x', name: { nl: 'Kaart', en: 'A card' },
      when: [{ nl: 'Als je *was* zegt', en: 'When *was* is used' }], how: { nl: 'Zo', en: 'Like *this*' },
      table: { head: ['', 'one', 'two'], rows: [['a', 'b', 'c'], ['d', 'e', 'f']] },
      ex: [{ nl: 'Ik was er.', en: 'I was there, *was*.' }], tip: { nl: 'Tip', en: 'A tip' } };
    W.Profile.set('A1');
    W.NLArcade.cardScreen('fixture');
    ok(allText().indexOf('A card') !== -1 && allText().indexOf('When it is used') !== -1, 'a beginner reads the card in English');
    const ital = byCls('arc-nl').map(text);
    ok(ital.indexOf('was') !== -1 && ital.indexOf('this') !== -1, '*x* must render as italic Dutch, got ' + ital);
    ok(byCls('arc-ct-h').length === 3 && byCls('arc-ctable')[0].attrs['style:--cols'] === '3', 'the table renders its head and columns');
    ok(byCls('arc-ex').length === 1 && allText().indexOf('Ik was er.') !== -1, 'examples render');
    ok(allText().indexOf('A tip') !== -1, 'the tip renders');
    byCls('arc-lang')[0].click();
    ok(allText().indexOf('Kaart') !== -1 && allText().indexOf('Wanneer je het gebruikt') !== -1, 'the language toggle switches to Dutch');
    W.Profile.set('B2');
    delete W.NL_CARDS.fixture;
    // every real card renders
    Object.keys(W.NL_CARDS).forEach(k => {
      let threw = null; try { W.NLArcade.cardScreen(k); } catch (e) { threw = e; }
      ok(!threw && byCls('arc-when').length + byCls('arc-how').length > 0, 'card ' + k + ' failed to render: ' + (threw && threw.message));
    });
    // the progress panel lists the units with chips, and a chip opens its card
    W.NLArcade.board();
    ok(byCls('arc-tchip').length >= 8, 'the progress panel shows a chip per unit');
    const chip = byCls('arc-tchip').filter(c => c._on.click)[0];
    ok(!!chip, 'a unit chip with a card is tappable'); chip.click();
    ok(byCls('arc-tcard').length === 1, 'a chip opens its card');
  }

  // ---- the back button, the level picker ----------------------------------------------------------------------------------------------------------------------
  {
    W.NLArcade.board();
    byCls('arc-level')[0].click();
    ok(byCls('arc-pick').length === 4, 'the level picker lists A1 to B2');
    byCls('arc-pick')[0].click();                          // goBack -> history.back -> popstate -> board
    ok(W.Profile.current() === 'A1' && byCls('arc-tile').length === 8, 'picking a level sets it and goes home');
  }

  // ---- Zinnen: the topic focus and the conversations (js/nl-convo.js). The real phrases and conversations. ----------------------------------------
  {
    const CV = W.NLConvo, noDash = s => !/[–—]/.test(s) && !/ [-‐] /.test(s);
    ok(!!CV && Array.isArray(W.NL_CONVOS) && W.NL_CONVOS.length >= 3, 'NLConvo and data/conversations.js are loaded');
    ['vlot.arcade', 'vlot.srs', 'vlot.convos', 'vlot.games', 'vlot.errors'].forEach(k => delete store[k]);
    SRS._reset(); CV._reset();
    W.NL_PHRASES = REAL.p; GI.reset(); W.Profile.set('A2');
    const phraseTile = () => { W.NLArcade.board(); byCls('arc-tile').filter(t => text(t).indexOf('Zinnen') !== -1)[0].click(); };
    const fchips = () => byCls('arc-focus-chips')[0].all(n => n.tagName === 'BUTTON');
    const chip = t => fchips().filter(c => text(c) === t)[0];
    const themes = Object.keys(GI.phraseList().byTheme);
    const th = id => GI.phraseList().list.filter(e => e.id === id)[0].th;
    const FA = ['begroeten', 'ik'];

    // ---- the topic focus ----
    phraseTile();
    ok(text(fchips()[0]) === 'All topics' && fchips().length === 1 + themes.length && fchips()[0].cls().includes('on'), 'the Zinnen sheet has All topics and one chip per theme');
    ok(/^You know 0 of \d+ phrases$/.test(text(byCls('arc-progress-all')[0])), 'no focus: the plain coverage line');
    ok(['Begroeten (Greetings)', 'Ik (About me)', 'Hulp (Asking for help)'].every(l => !!chip(l)), 'chips use the theme labels');
    chip('Begroeten (Greetings)').click(); chip('Ik (About me)').click();
    ok(JSON.stringify(JSON.parse(store['vlot.arcade']).pfocus) === JSON.stringify(FA), 'the focus is kept in vlot.arcade, and the chips multi-select');
    { const own = GI.phraseList().list.filter(e => FA.indexOf(e.th) !== -1).length;
      ok(text(byCls('arc-progress-all')[0]) === 'You know 0 of ' + own + ' phrases in these topics', 'the coverage line counts only the chosen topics and says so: ' + text(byCls('arc-progress-all')[0])); }
    ok(fchips().filter(c => c.cls().includes('on')).map(text).sort().join() === 'Begroeten (Greetings),Ik (About me)', 'the chosen chips are on');
    byCls('arc-back')[0].click(); phraseTile();
    ok(fchips().filter(c => c.cls().includes('on')).map(text).sort().join() === 'Begroeten (Greetings),Ik (About me)', 'the focus persists across screens');
    { // the grind deals only the chosen themes
      W.Profile.set('B2'); SRS._reset(); delete store['vlot.srs']; GI.reset();
      const seen = new Set(), st = { asked: 0, newN: 0, used: {} };
      for (let i = 0; i < 60; i++) { const it = GI.next('zinnen', 2, rng, { grind: st, count: 60, gkind: 'zinnen', themes: FA }); if (it) seen.add(th(it.id)); }
      ok(seen.size === 2 && [...seen].every(t => FA.indexOf(t) !== -1), 'the phrase grind deals only the focused themes: ' + [...seen]);
      const one = new Set(), st2 = { asked: 0, newN: 0, used: {} };
      for (let i = 0; i < 30; i++) { const it = GI.next('zinnen', 2, rng, { grind: st2, count: 60, gkind: 'zinnen', themes: ['hulp'] }); if (it) one.add(th(it.id)); }
      ok(one.size === 1 && one.has('hulp'), 'a single focused theme deals only that one');
      const all = new Set(), st3 = { asked: 0, newN: 0, used: {} };
      for (let i = 0; i < 80; i++) { const it = GI.next('zinnen', 2, rng, { grind: st3, count: 80, gkind: 'zinnen' }); if (it) all.add(th(it.id)); }
      ok(all.size > 2, 'no focus deals from every theme');
      W.Profile.set('A2');
    }
    { // the round config carries it; the Speel mix does not
      let got = null; const run = W.GameRound.run;
      W.GameRound.run = (h, cfg) => { got = cfg; };
      try {
        phraseTile(); byCls('arc-mode')[0].click();
        ok(got && got.kind === 'zinnen' && JSON.stringify(got.themes) === JSON.stringify(FA), 'the Zinnen round config carries the themes');
        got = null; W.NLArcade.board(); byCls('arc-jugar')[0].click(); byCls('arc-mode')[0].click();
        ok(got && got.themes === undefined, 'the Speel mix ignores the focus');
      } finally { W.GameRound.run = run; }
    }

    // ---- the conversations: the fourth tile on the top row, every conversation, with voices ----
    const nIn = ths => W.NL_CONVOS.filter(c => !ths.length || ths.indexOf(c.th) !== -1).length;
    const cvTile = () => { W.NLArcade.board(); byCls('arc-convo-tile')[0].click(); };
    W.NLArcade.board();
    { const row = byCls('arc-main4')[0], t = row && row.all(n => n.cls().includes('arc-tile'));
      ok(t && t.length === 4 && t[3].cls().includes('arc-convo-tile') && /Gesprekken/.test(text(t[3])) && /Conversations/.test(text(t[3])), 'Gesprekken is the fourth tile on the top row, after Werkwoorden, Woorden and Zinnen'); }
    ok(/0 of \d+/.test(text(byCls('arc-convo-tile')[0])), 'the tile counts the passed ones');
    phraseTile();
    ok(byCls('cv-row').length === 0 && !byCls('arc-convos').length && byCls('arc-modes')[0].all(n => n.tagName === 'BUTTON').length === 2, 'the Zinnen sheet keeps just its two modes');
    cvTile();
    ok(byCls('cv-row').length === W.NL_CONVOS.length && /Conversations/.test(allText()), 'the tile lists every conversation');
    ok(byCls('cv-row').every(r => /A1|A2|B1/.test(text(r)) && text(r).indexOf('done') === -1 && /you/.test(text(r))), 'each row shows its title, band and role, no tick yet');
    ok(noDash(allText()), 'no dashes on the conversations screen');
    phraseTile(); chip('All topics').click(); chip('Begroeten (Greetings)').click(); chip('Ik (About me)').click();

    // ---- the screen ----
    const first = W.NL_CONVOS[0];
    cvTile();
    byCls('cv-row')[0].click();
    if (!Object.keys(W.NL_CONVO_AUDIO || {}).length) {     // the voices are not built yet: the screen copes, with no speakers
      ok(byCls('cv-bubble').length === first.lines.length && !byCls('cv-spk').length && !byCls('cv-playall').length, 'without voices the conversation screen shows no speakers and does not crash');
      W.NL_CONVO_AUDIO = {}; W.NL_CONVOS.forEach(c => c.lines.forEach((l, i) => { W.NL_CONVO_AUDIO[c.id + '#' + i] = 'audio/c-0123456789.bin#0,1'; }));
      CV.open(first.id);
    }
    const mine = first.lines.filter(l => l.who === first.you).length;
    ok(byCls('cv-bubble').length === first.lines.length && byCls('cv-me').length === mine && byCls('cv-them').length === first.lines.length - mine, 'every line is a bubble, the learner on one side');
    ok(byCls('cv-en').length === first.lines.length && byCls('cv-bubble').every(b => b.all(n => n.cls().includes('cv-en')).length === 1), 'the English is under each line');
    ok(byCls('cv-me').every(b => b.all(n => n.cls().includes('cv-nl')).length === 1) && allText().indexOf(first.lines[0].nl) !== -1, 'the Dutch is in the bubble');
    ok(/Practise your part/.test(allText()) && /you, talking to /.test(allText()) && /Pick the right line/.test(allText()), 'title, roles and the practise button');
    ok(noDash(allText()), 'no dashes on the conversation screen');
    ok(byCls('cv-spk').length === first.lines.length && byCls('cv-playall').length === 1, 'a speaker on every line and one Play it all');
    if (Object.keys(W.NL_CONVO_AUDIO || {}).length) ok(W.NL_CONVOS.every(c => c.lines.every((l, i) => /^audio\/c-[0-9a-f]+\.bin#\d+,\d+$/.test(W.NL_CONVO_AUDIO[c.id + '#' + i] || ''))), 'every conversation line in Vlot has a voice');   // the voices may be absent: the app copes
    { const played = [], keep = W.ConvoAudio.play;
      W.ConvoAudio.play = (k, done) => { played.push(k); return true; };
      try { byCls('cv-spk')[2].click(); ok(played[0] === first.id + '#2', 'a speaker plays its own line'); }
      finally { W.ConvoAudio.play = keep; } }
    W.Profile.set('B2');
    CV.open(first.id);
    ok(/Oefen jouw deel/.test(allText()) && /jij, in gesprek met /.test(allText()) && /Kies de juiste regel/.test(allText()), 'from B1 the labels are in Dutch');
    ok(noDash(allText()), 'no dashes in the Dutch labels');
    W.Profile.set('A2');
    byCls('arc-back')[0].click();
    ok(byCls('cv-row').length === W.NL_CONVOS.length, 'back returns to the conversations list');
    { // role wording
      const keep = W.NL_CONVOS;
      W.NL_CONVOS = keep.concat([Object.assign({}, first, { id: 'fx-man', roles: { a: 'You (a man)', b: 'Marije' } }), Object.assign({}, first, { id: 'fx-cust', roles: { a: 'Customer', b: 'Waiter' } })]);
      CV.open('fx-man');
      ok(/you \(a man\), talking to Marije/.test(allText()) && /Practise your part/.test(allText()), 'a You role reads you, the bracket kept');
      CV.open('fx-cust');
      ok(/your role: Customer, talking to Waiter/.test(allText()) && /Practise: your role: Customer/.test(allText()), 'another role is named');
      const flip = Object.assign({}, first, { id: 'fx-flip', you: 'b', roles: { a: 'Waiter', b: 'You' } });
      W.NL_CONVOS = keep.concat([flip]);
      const fi = CV.items('fx-flip', 'pick', rng);
      ok(fi.length === first.lines.filter(l => l.who === 'b').length && fi.every(it => flip.lines[it.convoLine].who === 'b') && /^Waiter: /.test(fi.find(it => it.convoLine > 0).sub), 'the learner can be b: the line before is the context');
      W.NL_CONVOS = keep;
    }

    // ---- items: pick, then build, then type; the answer is among the options; line order ----
    const lines = c => c.lines.filter(l => l.who === c.you);
    W.NL_CONVOS.forEach(c => {
      const order = c.lines.map((l, i) => (l.who === c.you ? i : -1)).filter(i => i >= 0);
      ['pick', 'build', 'type'].forEach(k => {
        const its = CV.items(c.id, k, rng);
        ok(its.length === order.length && its.map(i => i.convoLine).join() === order.join(), `${c.id} ${k}: only the learner lines, in line order`);
        ok(its.every(it => it.id === 'cv:' + c.id + ':' + it.convoLine && it.answer && (it.play !== 'choose' || (it.options.length === 4 && new Set(it.options).size === 4 && it.options.indexOf(it.answer) !== -1))), `${c.id} ${k}: ids and answers`);
      });
      ok(CV.items(c.id, 'pick', rng).every(it => it.play === 'choose' && it.options.some(o => o !== it.answer)), `${c.id}: a pick offers other lines`);
      ok(CV.items(c.id, 'type', rng).every(it => it.play === 'type' && it.accept[0] === it.answer && GI.grade(it, it.answer) === 'good' && GI.grade(it, 'zzz qqq') === 'wrong'), `${c.id}: typed items are checked by the usual checker`);
      ok(CV.items(c.id, 'build', rng).every(it => it.play === 'choose' || (it.play === 'build' && it.words.join(' ') === it.answer && it.words.length >= 2 && it.words.length <= 8)), `${c.id}: build items tap the words`);
    });
    { // the accent rule is the app's own: a missing accent is a near miss, not an error
      const c = W.NL_CONVOS.find(c => lines(c).some(l => /[éëïöü]/.test(l.nl)));
      const it = CV.items(c.id, 'type', rng).find(i => /[éëïöü]/.test(i.answer));
      const bare = it.answer.normalize('NFD').replace(/[̀-ͯ]/g, '');
      ok(GI.grade(it, bare) !== 'wrong' && GI.grade(it, it.answer.toUpperCase()) !== 'wrong', 'accents follow the usual near-miss rule: ' + GI.grade(it, bare));
    }
    { const c = W.NL_CONVOS.find(c => c.lines[0].who !== c.you), it = CV.items(c.id, 'pick', rng)[0];
      ok(it.convoLine > 0 && it.sub.indexOf(': ') > 0 && it.sub.indexOf(c.lines[it.convoLine - 1].nl) !== -1, 'the other side is shown as context'); }
    { const c = W.NL_CONVOS.find(c => c.lines[0].who === c.you), it = CV.items(c.id, 'pick', rng)[0];
      ok(it.convoLine === 0 && /^Your line/.test(it.sub), 'with nothing before it the sub says Your line'); }

    // ---- driving practise rounds through the real engine ----
    const over = () => byCls('g-over')[0];
    const step = async right => {
      LAST = CV.last();
      await answerOne(right);
      await sleep(right ? 230 : 20);
      await cont();
      await sleep(60);
    };
    const run = async (id, plan) => {
      CV.practise(id); await sleep(60);
      const dealt = [], kinds = [], title = byCls('g-name')[0] ? text(byCls('g-name')[0]) : null;
      for (let i = 0; i < plan.length && !over(); i++) { dealt.push(CV.last()); kinds.push(CV.last().play); await step(plan[i]); }
      await waitFor(() => !!over(), 1500, 'the end of the conversation round');
      return { dealt, kinds, title };
    };
    const learntCv = () => Object.keys(JSON.parse(store['vlot.srs'] || '{}')).filter(k => k.indexOf('cv:') === 0 && SRS.isLearnt(k));
    const cvKeys = () => Object.keys(JSON.parse(store['vlot.srs'] || '{}')).filter(k => k.indexOf('cv:') === 0);
    const C = W.NL_CONVOS.find(c => c.lines[0].who !== c.you && lines(c).length === 4), N = lines(C).length;
    const order = C.lines.map((l, i) => (l.who === C.you ? i : -1)).filter(i => i >= 0);
    delete store['vlot.srs']; SRS._reset(); CV._reset();
    ok(CV.kindFor(C.id) === 'pick' && CV.passes(C.id) === 0, 'a new conversation starts with picks');
    // under 80% is not a pass
    { const r = await run(C.id, Array(N).fill(false));
      ok(r.title === C.en, 'the round is titled with the conversation');
      ok(r.dealt.map(d => d.convoLine).join() === order.join(), 'the round follows the line order and asks only the learner lines');
      ok(r.dealt.every(it => it.play === 'choose' && it.options.indexOf(it.answer) !== -1), 'the answer is among the options');
      ok(/are needed to pass/.test(text(over())) && CV.passes(C.id) === 0 && !store['vlot.convos'], 'under 80% is not a pass'); }
    // pass one: picks
    { const r = await run(C.id, Array(N).fill(true));
      ok(r.kinds.join() === Array(N).fill('choose').join() && new RegExp('Passed: ' + N + ' of ' + N).test(text(over())), 'pass one is a pick round');
      ok(JSON.parse(store['vlot.convos']).passed[C.id] === 1 && CV.kindFor(C.id) === 'build', 'the pass is kept in vlot.convos and the next is build');
      ok(learntCv().length === 0, 'a pick never makes anything learnt');
      ok(cvKeys().length === N && cvKeys().every(k => new RegExp('^cv:' + C.id + ':\\d+$').test(k)), 'the SRS ids look like cv:<id>:<line>'); }
    // pass two: builds
    { const r = await run(C.id, Array(N).fill(true));
      ok(r.kinds.every(p => p === 'build' || p === 'choose') && r.kinds.indexOf('build') !== -1 && CV.passes(C.id) === 2 && CV.kindFor(C.id) === 'type', 'pass two is a build round and the next is typed');
      ok(learntCv().length === 0, 'a build never makes anything learnt'); }
    // pass three: typed
    { const r = await run(C.id, Array(N).fill(true));
      ok(r.kinds.join() === Array(N).fill('type').join() && CV.passes(C.id) === 3, 'pass three is typed'); }
    // 80% is enough: four of five
    { const C5 = W.NL_CONVOS.find(c => lines(c).length === 5); delete store['vlot.convos']; CV._reset();
      await run(C5.id, [true, true, false, true, true]);
      ok(CV.passes(C5.id) === 1 && /Passed: 4 of 5/.test(text(over())), 'four of five (80%) passes'); }
    // leaving a round returns to the conversation
    CV.practise(C.id); await sleep(60); byCls('g-exit')[0].click();
    ok(byCls('cv-bubble').length === C.lines.length, 'leaving a round returns to the conversation');
    cvTile();
    ok(byCls('cv-row').filter(r => /done ✓/.test(text(r))).length === Object.keys(JSON.parse(store['vlot.convos']).passed).length, 'passed conversations are ticked in the list');
    ok(noDash(allText()), 'no dashes after a pass');
    ok('vlot.convos' in store && JSON.parse(store['vlot.arcade']).pfocus !== undefined, 'convo progress and the focus are in Vlot\'s own keys');
    ['vlot.convos'].forEach(k => delete store[k]);
    CV._reset(); W.NL_PHRASES = PHRASES.slice(); GI.reset(); W.Profile.set('A2'); W.NLArcade.board();
    console.log(`  zinnen focus and conversations: ${W.NL_CONVOS.length} placeholder conversations, items checked in every kind`);
  }

  // ---- nothing under fluidez. -----------------------------------------------------------------------------------------------------------------------------------
  {
    const keys = Object.keys(store);
    ok(written.length > 20, 'the test wrote almost nothing, so the key check proves little');
    ok(written.every(k => k.indexOf('vlot.') === 0), 'keys not under vlot.: ' + written.filter(k => k.indexOf('vlot.') !== 0).filter((k, i, a) => a.indexOf(k) === i));
    ok(!keys.some(k => /fluidez/i.test(k)), 'a fluidez. key was written');
    ['vlot.srs', 'vlot.games', 'vlot.errors', 'vlot.profile', 'vlot.recent', 'vlot.arcade', 'vlot.check'].forEach(k => ok(k in store, 'expected key ' + k));
    const srcs = ['nl-arcade', 'nl-convo', 'nl-items', 'nl-check', 'nl-core', 'gameround', 'gamescore', 'srs', 'errorlog', 'ui', 'perf'].map(f => fs.readFileSync(path.join(NLD, 'js', f + '.js'), 'utf8')).join('\n');
    ok(!/fluidez\./.test(srcs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'a fluidez. key survives in the code');
    ok(!/Speak|speechSynthesis|SpeechSynthesis/.test(srcs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'speech code survives');
  }

  console.log(`\n${checks - failures}/${checks} checks passed`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
