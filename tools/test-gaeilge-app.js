#!/usr/bin/env node
/* ============================================================================
 * test-gaeilge-app.js: can Líofa (gaeilge/) deal, grade and run a round?
 *
 *   node tools/test-gaeilge-app.js
 *
 * Loads EXACTLY the scripts gaeilge/sw.js precaches (parsed from that file, not
 * listed again here) into a minimal DOM shim, with fixture banks, and checks:
 *   - the shell: sw.js mirrors index.html, no ../ paths, build marker matches
 *   - the board renders with EMPTY banks ("ag teacht" tiles, never a crash)
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
const GE = path.join(ROOT, 'gaeilge');

let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  FAIL ' + msg); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- the asset list, read from the worker itself ---------------------------------
const swSrc = fs.readFileSync(path.join(GE, 'sw.js'), 'utf8');
const block = swSrc.slice(swSrc.indexOf('var ASSETS = ['), swSrc.indexOf('];', swSrc.indexOf('var ASSETS = [')));
const assets = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
const scripts = assets.filter(f => f.endsWith('.js'));
const html = fs.readFileSync(path.join(GE, 'index.html'), 'utf8');

ok(scripts.length > 10, 'few scripts in gaeilge/sw.js ASSETS');
assets.forEach(a => { if (a !== './') ok(fs.existsSync(path.join(GE, a)), `sw.js lists ${a}, which does not exist`); });
const htmlRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(r => !/^https?:/.test(r));
htmlRefs.forEach(r => {
  ok(r.indexOf('../') === -1, `index.html reaches out of gaeilge/: ${r}`);
  ok(assets.indexOf('./' + r) !== -1, `index.html uses ${r}, which sw.js does not precache`);
});
const scriptsInHtml = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => './' + m[1]);
ok(JSON.stringify(scriptsInHtml.filter(s => scripts.indexOf(s) !== -1)) === JSON.stringify(scripts.filter(s => scriptsInHtml.indexOf(s) !== -1)),
   'script order in index.html differs from sw.js ASSETS');
ok(/<html lang="ga"/.test(html) && /<title>Líofa<\/title>/.test(html), 'index.html must be lang ga, titled Líofa');
const manifest = JSON.parse(fs.readFileSync(path.join(GE, 'manifest.json'), 'utf8'));
ok(manifest.name === 'Líofa' && manifest.short_name === 'Líofa' && manifest.lang === 'ga' &&
   manifest.theme_color === '#0b1311' && manifest.background_color === '#0b1311', 'manifest fields');
ok(/CACHE_NAME = 'liofa-'/.test(swSrc) && !/\.\.\//.test(swSrc), 'sw.js: cache name liofa-, no ../');
ok(/cache: 'reload'/.test(swSrc), 'sw.js must fetch past the HTTP cache');
const cacheVer = /CACHE_VERSION = '([^']+)'/.exec(swSrc)[1];
const perfSrc = fs.readFileSync(path.join(GE, 'js/perf.js'), 'utf8');
ok(new RegExp("BUILD = '" + cacheVer + "'").test(perfSrc), 'Perf.BUILD must equal CACHE_VERSION in sw.js');
['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png'].forEach(f =>
  ok(fs.existsSync(path.join(GE, 'icons', f)), 'missing icon ' + f));
const css = fs.readFileSync(path.join(GE, 'css/liofa.css'), 'utf8');
['#e8b64a', '#2fae6e', '#a26bd1', '#3a8fd6', '#e0a526', '#d9653b', '#2fb3a5', '#e05a7a', '#0b1311', '#13201b'].forEach(c =>
  ok(css.toLowerCase().indexOf(c) !== -1, 'liofa.css lacks the spec colour ' + c));
ok(!/@import|url\(|fonts\.g/.test(css), 'liofa.css must be self-contained, no web fonts');
// no dashes in what the app shows: UI strings in the app scripts (spelling hyphens in n-/t- are fine)
['ga-arcade.js', 'gameround.js', 'ga-items.js', 'ga-check.js'].forEach(f => {
  const src = fs.readFileSync(path.join(GE, 'js', f), 'utf8');
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
window.navigator = { language: 'ga' };

// ---- load the page's scripts, in the page's order. Empty banks first. -----------------------
scripts.forEach(rel => (0, eval)(fs.readFileSync(path.join(GE, rel), 'utf8')));

const W = global.window;
ok(!!W.GAItems && !!W.GameScore && !!W.GameRound && !!W.GACheck && !!W.GAArcade && !!W.GA, 'the modules did not load');
ok(!W.ENGINE && !W.Checker && !W.Speak, 'the Spanish engine leaked into Líofa');

// The repository's own banks may be full by now; the board must cope with none at all.
const REAL = { b: W.GA_BANK, w: W.GA_WORDS, p: W.GA_PHRASES };
console.log(`  repository banks: ${(REAL.b || []).length} gap rows, ${(REAL.w || []).length} words, ${(REAL.p || []).length} phrases`);
W.GA_BANK = []; W.GA_WORDS = []; W.GA_PHRASES = []; W.GAItems.reset();
W.GAArcade.board();
{
  const tiles = byCls('arc-tile'), soon = byCls('arc-soon');
  ok(tiles.length === 7, `empty banks: expected 7 tiles, got ${tiles.length}`);
  ok(tiles.every(t => t.disabled), 'empty banks: every tile must be disabled');
  ok(soon.length === 7 && soon.every(s => text(s) === 'ag teacht'), 'empty banks: tiles must say "ag teacht"');
  ok(allText().indexOf('Líofa') !== -1 && allText().indexOf('Imir') !== -1, 'empty banks: brand and Imir are missing');
  ok(byCls('arc-jugar').length === 1 && byCls('arc-jugar')[0].disabled, 'empty banks: Imir must be disabled');
  ok(allText().indexOf('Do dhul chun cinn') !== -1, 'empty banks: the progress panel did not render');
  ok(byCls('arc-fail').length === 0, 'empty banks: the board fell into the failure screen');
  const labels = ['Briathra', 'Focail', 'Frásaí', 'Séimhiú agus urú', 'Forainmneacha', 'Tá nó Is', 'Freagair'];
  labels.forEach(l => ok(tiles.some(t => text(t).indexOf(l) !== -1), 'no tile for ' + l));
  ok(['Verbs', 'Words', 'Phrases', 'Lenition and eclipsis', 'Prepositional pronouns', 'Tá or Is', 'Answer']
    .every(e => tiles.some(t => text(t).indexOf(e) !== -1)), 'tiles lack their small English line');
  ok(W.GAItems.next('imir', 1, Math.random, {}) === null, 'an empty mix must deal null, not throw');
  ok(W.GAItems.coverage(null).of === 0 && W.GAItems.phraseCoverage().of === 0, 'empty coverage');
  ok(W.GACheck.ladder().length === 0 && W.GACheck.due() === false, 'empty banks: no ladder, no check due');
  W.GAArcade.cardScreen('nope'); ok(allText().indexOf('No card') !== -1, 'a missing card must say so');
  W.GAArcade.board();
  W.GAArcade.levelPicker(); ok(byCls('arc-pick').length === 4 && !byCls('arc-wtbtn').length, 'the level picker offers no placement test without banks');
  W.GAArcade.checkRun(); ok(allText().length > 0 && !byCls('arc-fail').length, 'a check over empty banks must not crash');
  W.GAArcade.wordTest(W.GAArcade.GAMES[2]); ok(allText().indexOf('end of the list') !== -1, 'the word test over no words says so');
  W.GAArcade.board();
}
// and with the globals not defined at all
{
  const keep = { b: W.GA_BANK, w: W.GA_WORDS, p: W.GA_PHRASES, c: W.GA_CARDS };
  delete W.GA_BANK; delete W.GA_WORDS; delete W.GA_PHRASES; delete W.GA_CARDS;
  W.GAItems.reset();
  let threw = null;
  try { W.GAArcade.board(); W.GAArcade.cardScreen('lait'); W.GAArcade.board(); } catch (e) { threw = e; }
  ok(!threw, 'board must cope with undefined banks: ' + (threw && threw.message));
  W.GA_BANK = keep.b; W.GA_WORDS = keep.w; W.GA_PHRASES = keep.p; W.GA_CARDS = keep.c;
}

// ---- fixtures (test data, not content) -------------------------------------------------------------
const BANDS = ['A1', 'A2', 'B1', 'B2'];
const TOPICS = { briathra: ['lait', 'caite', 'fhaist'], seimhiu: ['poss', 'art', 'prep'], forainm: ['ag', 'ar'],
  tais: ['is', 'ta'], freagair: ['bi', 'verb'] };
const ROWS = [];
let n = 0;
Object.keys(TOPICS).forEach(k => TOPICS[k].forEach(t => BANDS.forEach(b => {
  n++;
  ROWS.push({ k, t, b, q: `Fixture ${k} ${t} ${b} number ${n} ___ (x).`, a: 'ans' + n, o: ['ans' + n, 'wrongone' + n, 'wrongtwo' + n, 'wrongthree' + n],
    e: 'English of ' + n, w: 'Why in English ' + n, wg: 'Why in Irish ' + n, v: k === 'briathra' ? 'verb' + (n % 5) : undefined });
})));
// one row alone in its topic, with a near-miss answer and an alternative
ROWS.push({ k: 'briathra', t: 'uniq', b: 'A1', q: 'Inné ___ (feic) mé an madra.', a: 'chonaic', x: ['chonaic mé'], o: ['chonaic', 'feicim', 'feicfidh', 'fhaca'],
  e: 'Yesterday I saw the dog.', w: 'Inné: the past.', wg: 'Inné: an aimsir chaite.', v: 'feic' });
const UNIQ = ROWS[ROWS.length - 1];
const WORDS = [], THEMES = ['family', 'food', 'home'];
for (let i = 1; i <= 36; i++) {
  WORDS.push({ ga: 'focal' + i, en: 'word number ' + i, g: i % 3 === 0 ? 'f' : i % 3 === 1 ? 'm' : undefined, pl: i % 3 === 0 ? 'focail' + i : undefined,
    th: THEMES[i % 3], b: BANDS[Math.floor((i - 1) / 9)], r: i, pos: 'n' });
}
const PHRASES = [];
const lens = [3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < 24; i++) {
  const len = lens[i % lens.length];
  const ga = Array.from({ length: len }, (_, j) => 'pw' + i + 'x' + j).join(' ') + '.';
  PHRASES.push({ ga, en: 'phrase english ' + i, alt: i % 2 ? ['alt ' + ga] : [], th: 'th' + (i % 3), b: BANDS[Math.floor(i / 6)], t: 1 + (i % 3), n: i % 4 === 0 ? 'a note ' + i : undefined });
}
function loadFixtures() {
  W.GA_BANK = ROWS.slice(); W.GA_WORDS = WORDS.slice(); W.GA_PHRASES = PHRASES.slice();
  W.GAItems.reset();
}
loadFixtures();
W.Profile.markPlaced();

let seed = 20261109;
const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const GI = W.GAItems, GS = W.GameScore, SRS = W.SRS;
W.Profile.set('B2');                                  // widest pool

// ---- every kind deals an item that scores ------------------------------------------------------------
['briathra', 'seimhiu', 'forainm', 'tais', 'freagair', 'focail', 'frasai', 'imir'].forEach(kind => {
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
  const it = GI.next('briathra', 1, rng, { tenses: ['uniq'] });
  ok(it.peek === 'Yesterday I saw the dog.', 'the English sentence must ride as peek');
  ok(it.note === 'Inné: the past.' && it.noteAlt === 'Inné: an aimsir chaite.' && it.noteAltLabel === 'as Gaeilge', 'A1 note: English first, Irish one tap away');
  ok(it.prompt.indexOf('＿＿＿') !== -1 && it.options.length === 4, 'gap prompt shows the blank, 4 options');
  W.Profile.set('B1');
  const it2 = GI.next('briathra', 1, rng, { tenses: ['uniq'] });
  ok(it2.note === 'Inné: an aimsir chaite.' && it2.noteAlt === 'Inné: the past.', 'B1 note: Irish first');
  W.Profile.set('B2');
}
{ // the tense picker filters by t, topics filter the rest
  for (let i = 0; i < 15; i++) {
    const it = GI.next('briathra', 3, rng, { tenses: ['caite'] });
    ok(it.topic === 'briathra:caite', 'tense picker leaked ' + it.topic);
    const g = GI.next('seimhiu', 3, rng, { topics: ['art'] });
    ok(g.topic === 'seimhiu:art', 'topic picker leaked ' + g.topic);
  }
  const seen = {};
  for (let i = 0; i < 120; i++) { const it = GI.next('imir', 3, rng, {}); seen[it.kind] = 1; }
  ok(['briathra', 'focail', 'frasai', 'seimhiu', 'forainm', 'tais', 'freagair'].every(k => seen[k]), 'the mix never dealt: ' + Object.keys(seen));
}
{ // recent memory is kept under liofa.recent and options are shuffled per deal
  ok(JSON.parse(store['liofa.recent']).length > 0, 'nothing in liofa.recent');
  const orders = {};
  for (let i = 0; i < 30; i++) orders[GI.next('briathra', 3, rng, { tenses: ['uniq'] }).options.join()] = 1;
  ok(Object.keys(orders).length > 3, 'options are not being shuffled');
}
{ // the mix with some banks missing deals only from the live ones
  const keep = W.GA_BANK; W.GA_BANK = keep.filter(r => r.k === 'tais'); GI.reset();
  const kinds = {};
  for (let i = 0; i < 40; i++) { const it = GI.next('imir', 3, rng, {}); if (it) kinds[it.kind] = 1; }
  ok(Object.keys(kinds).sort().join() === 'focail,frasai,tais', 'partial banks: mix dealt ' + Object.keys(kinds));
  W.GA_BANK = keep; GI.reset();
}

// ---- grading -------------------------------------------------------------------------------------------------
{
  const it = { accept: ['chonaic', 'chonaic mé'] };
  ok(GI.grade(it, 'chonaic') === 'good', 'exact is good');
  ok(GI.grade(it, 'Chonaic ') === 'good', 'case and spaces do not matter');
  ok(GI.grade(it, 'chonaic mé') === 'good', 'x: alternative accepted');
  ok(GI.grade(it, 'chónaic') === 'near', 'a wrong fada is near');
  ok(GI.grade({ accept: ['t-uisce'] }, 'tuisce') === 'near', 'a missing n-/t- hyphen is near');
  ok(GI.grade(it, 'xyz') === 'wrong' && GI.grade(it, '') === 'wrong', 'wrong is wrong');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'near', 1000, 0).points < GS.award({ cefr: 'A1', play: 'type' }, 'good', 1000, 0).points, 'near scores less');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'wrong', 1000, 5).points === 0, 'wrong scores zero');
}

// ---- tap first, type once known ---------------------------------------------------------------------------------
{
  const id = GI.gapId(UNIQ);
  ok(GI.next('briathra', 1, rng, { tenses: ['uniq'] }).play === 'choose', 'a new item is tapped');
  SRS.enrol(id); SRS.grade(id, true);                    // a right tap: known, not learnt
  ok(!SRS.isLearnt(id) && GI.answeredRight(id), 'a right tap makes it known, not learnt');
  const it = GI.next('briathra', 1, rng, { tenses: ['uniq'] });
  ok(it.play === 'type', 'an item answered right once comes back typed');
  ok(GI.grade(it, 'chonaic') === 'good', 'the typed item grades');
  SRS.grade(id, false);                                  // a miss
  ok(!GI.answeredRight(id), 'a missed item is no longer "answered right"');
  ok(GI.next('briathra', 1, rng, { tenses: ['uniq'] }).play === 'choose', 'a missed item is tapped again');
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
  const wid = 'w:focal1'; SRS.learn(wid);
  let hit = false;
  for (let i = 0; i < 60; i++) { const it = GI.next('focail', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === wid) hit = true; }
  ok(!hit, 'a learnt word was dealt again');
  ok(!GI.knownCard({ reps: 3, passed: false, consecMiss: 2 }), 'reps > 0 is not "known"');
}

// ---- ticking a phrase as known skips it; unticking brings it back ------------------------------------------------------------
{
  store['liofa.srs'] = '{}'; SRS._reset();
  W.Profile.set('A1');
  const PL0 = GI.phraseList().list, a = PL0[0];
  PL0.slice(1).forEach(e => SRS.learn(e.id));
  const deal = () => { let hit = false; for (let i = 0; i < 80; i++) { const it = GI.next('frasai', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === a.id) hit = true; } return hit; };
  ok(deal(), 'before ticking, the phrase can be dealt');
  SRS.learn(a.id);
  ok(SRS.isLearnt(a.id) && !deal(), 'a ticked phrase was dealt again');
  SRS.unlearn(a.id);
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id) && deal(), 'an unticked phrase did not come back');
  ok(SRS.isLearnt(PL0[1].id), 'unlearn touched another phrase');
  // the tick screen: a row per phrase, ticked when learnt; ticking and unticking go through the SRS
  W.GAArcade.knownScreen({ key: 'x', hue: '#fff' });
  const boxes = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(boxes.length === PL0.length && boxes.slice(1).every(b => b.checked) && !boxes[0].checked, 'the tick screen lists every phrase, ticked when learnt');
  boxes[0].checked = true; boxes[0]._on.change.forEach(fn => fn());
  ok(SRS.isLearnt(a.id), 'ticking a row learns the phrase');
  boxes[0].checked = false; boxes[0]._on.change.forEach(fn => fn());
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id), 'unticking a row clears it');
  store['liofa.srs'] = '{}'; SRS._reset();
}

// ---- the word grind and phrases -------------------------------------------------------------------------------------------
{
  const st = { asked: 0, newN: 0, used: {} }, firsts = [];
  W.Profile.set('A1');
  for (let i = 30; i <= 36; i++) { SRS.enrol('w:focal' + i); SRS.grade('w:focal' + i, true); }   // seen in earlier rounds
  for (let i = 0; i < 8; i++) {
    const it = GI.next('focail', 1, rng, { grind: st, count: 10, gkind: 'focail' });
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
    const w = WORDS.filter(x => x.ga === it.answer)[0];
    ok(it.options && it.options.indexOf(it.answer) !== -1, 'word item lacks options');
    const others = it.options.filter(o => o !== it.answer).map(o => WORDS.filter(x => x.ga === o)[0]);
    ok(others.filter(o => o.th === w.th).length >= 2, 'distractors should share the theme and band where they can');
    if (w.g) ok(it.note && it.note.indexOf(w.g === 'f' ? 'feminine' : 'masculine') !== -1, 'a noun note shows its gender');
  });
  // a miss comes back first
  const missed = firsts[0];
  SRS.grade(missed.id, false);
  const back = GI.next('focail', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(back.id === missed.id && (back.grind === 'due' || back.grind === 'missed'), 'a missed word must come back first, got ' + back.grind + ' ' + back.id);
  // typed accepts the bare word once known (everything else learnt, so only it can be dealt)
  const keep = store['liofa.srs'], w2 = firsts[1];
  WORDS.forEach(w => { if ('w:' + w.ga !== w2.id) SRS.learn('w:' + w.ga); });
  const typed = GI.next('focail', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(typed && typed.id === w2.id && typed.play === 'type' && GI.grade(typed, w2.ga) === 'good', 'a known word comes back typed');
  store['liofa.srs'] = keep; SRS._reset();
  // phrases: tapped, typed at 6 or fewer, built at 7 or 8
  W.Profile.set('B2');
  const byLen = {};
  PHRASES.forEach(p => { const nn = p.ga.replace(/\./g, '').split(' ').length; (byLen[nn] = byLen[nn] || []).push(p); });
  [3, 7, 9].forEach(len => {
    const p = byLen[len][0], id = 'p:' + p.ga;
    SRS.enrol(id); SRS.grade(id, true);
  });
  const got = {};
  let gst = { asked: 0, newN: 0, used: {} };
  for (let i = 0; i < 200; i++) {
    const it = GI.next('frasai', 1, rng, { grind: i % 12 ? gst : (gst = { asked: 0, newN: 0, used: {} }), count: 10, gkind: 'frasai' });
    if (!it) continue;
    const p = PHRASES.filter(x => 'p:' + x.ga === it.id)[0], len = p.ga.replace(/\./g, '').split(' ').length;
    const known = SRS.isEnrolled(it.id) && GI.answeredRight(it.id);
    if (!known) ok(it.play === 'choose' && it.options.length === 4, 'an unknown phrase is tapped');
    else if (len <= 6) { ok(it.play === 'type', 'a known short phrase is typed'); ok(GI.grade(it, p.ga) === 'good', 'typed phrase grades'); got.type = 1; }
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
  ok(GI.verbsKnown() >= 0 && GI.gapCoverage('briathra').of > 0, 'verb and gap coverage');
  ok(GI.grindThemes().length === 3, 'grind themes');
}

// ---- the word test -----------------------------------------------------------------------------------------------------------------
{
  const a = GI.wordTestNext(0);
  ok(a && a.e.ga && a.rank >= 1 && a.total === 36, 'wordTestNext');
  ok(GI.wordTestGrade(a.e, a.e.ga) === 'good' && GI.wordTestGrade(a.e, 'nope') === 'wrong', 'word test grading');
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
  // Go réidh: three questions and no clock
  {
    const r = await playRound({ key: 'imir:t', title: 'Imir', kind: 'imir', hue: '#e8b64a', count: 3, duration: null }, [true, false, true, true]);
    await waitFor(() => !!overEl(), 1500, 'the Go réidh end screen');
    ok(!!overEl(), 'Go réidh: no end screen');
    ok(allText().indexOf('Imir arís') !== -1 || allText().indexOf('Play again') !== -1, 'end screen: no play again');
    const st = GS.stats('imir:t');
    ok(st.plays === 1 && st.seen === 3 && st.right === 2, `Go réidh was filed as ${JSON.stringify([st.plays, st.seen, st.right])}`);
    ok(allText().indexOf('1 / 3') === -1, 'the counter should be gone on the end screen');
    ok(byCls('g-miss').length === 1, 'the one miss is listed for review');
    ok(JSON.parse(store['liofa.games'])['imir:t'].plays === 1, 'liofa.games not written');
    ok(Object.keys(JSON.parse(store['liofa.errors'] || '{}')).length >= 1, 'a miss must reach liofa.errors');
    byCls('g-back')[0].click(); ok(r.exited(), 'the back button exits');
  }
  // the HUD counts in Go réidh
  {
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'briathra:t', title: 'Briathra', kind: 'briathra', hue: '#2fae6e', count: 5, duration: null });
    await sleep(40);
    ok(byCls('g-secs')[0] && /1 \/ 5/.test(text(byCls('g-secs')[0])), 'Go réidh shows "1 / 5" where the seconds were, got ' + text(byCls('g-secs')[0]));
    byCls('g-exit')[0].click();
  }
  // In aghaidh an chloig: ends on the clock
  {
    await playRound({ key: 'focail:c', title: 'Focail', kind: 'focail', hue: '#a26bd1', duration: 350 }, [true, true, true, true, true, true, true, true]);
    await waitFor(() => !!overEl(), 1500, 'the timed end screen');
    ok(!!overEl(), 'timed round did not end on the clock');
    const st = GS.stats('focail:c');
    ok(st.plays === 1 && st.seen >= 1, 'timed round filed');
    byCls('g-exit').length; // nothing to click on the end screen
  }
  // the clock pauses while the page is hidden, and a 3-2-1 brings it back
  {
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'frasai:c', title: 'Frásaí', kind: 'frasai', hue: '#3a8fd6', duration: 300, resumeStepMs: 20 });
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
    SRS._reset(); store['liofa.srs'] = '{}'; SRS._reset();
    SRS.enrol(id); SRS.grade(id, true);                  // known, so it is typed
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'briathra:t', title: 'Briathra', kind: 'briathra', hue: '#2fae6e', count: 1, duration: null, tenses: ['uniq'] });
    await sleep(40);
    ok(LAST.play === 'type' && byCls('g-input')[0] && !byCls('g-type')[0].hidden, 'a known item is typed');
    const input = byCls('g-input')[0];
    input.value = 'chonaic'; input.dispatchEvent({ type: 'input' });
    await waitFor(() => !!overEl(), 1500, 'the typed round to end');
    ok(!!overEl() && SRS.passed(id), 'the typed right answer graded the SRS');
  }
  // fresh typed right in a round: permanently learnt; a tapped one is not
  {
    SRS._reset(); store['liofa.srs'] = '{}'; SRS._reset();
    const id = GI.gapId(UNIQ);
    // simulate the round's own write-back on first sight by tapping right
    STAGE.children = [];
    W.GameRound.run(STAGE, { key: 'briathra:t', title: 'Briathra', kind: 'briathra', hue: '#2fae6e', count: 1, duration: null, tenses: ['uniq'] });
    await sleep(40);
    ok(LAST.play === 'choose', 'first sight is tapped');
    byCls('g-opt').filter(o => text(o) === 'chonaic')[0].click();
    await waitFor(() => !!overEl(), 1500, 'the round to end');
    ok(SRS.passed(id) && !SRS.isLearnt(id), 'a right first tap is known but never learnt');
  }
  // a revisit: one question in four comes from the error log
  {
    const row = ROWS[0];
    W.ErrorLog.clearAll();
    W.ErrorLog.record({ id: GI.gapId(row), front: row.q, back: row.a, kind: row.k, options: row.o, topic: row.k + ':' + row.t });
    const miss = GI.missDeck('imir', 5);
    ok(GI.missDeck(row.k, 5).length === 1 && GI.missDeck('seimhiu', 5).length === 0, 'missDeck filters by kind');
    for (let i = 0; i < 3; i++) W.ErrorLog.credit({ id: GI.gapId(row) });
    ok(GI.missDeck('imir', 5).length === 0, 'three right answers clear a mistake');
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
    W.Profile._reset(); store['liofa.profile'] = '{}'; W.Profile._reset();
    ok(!W.Profile.placed(), 'profile should start unplaced');
    W.GAArcade.board();
    ok(allText().indexOf('Question 1 of') !== -1, 'a first open must show the placement test');
    ok(byCls('arc-tile').length === 0, 'placement replaces the board');
    for (let i = 0; i < 14 && !byCls('arc-place-band').length; i++) {
      const prompt = text(byCls('arc-place-q')[0] || { textContent: '' });
      const row = ROWS.filter(r => r.q.replace(/___+/g, '＿＿＿') === prompt)[0], word = WORDS.filter(w => w.en === prompt)[0];
      const ans = row ? row.a : word ? word.ga : null;
      ok(!!ans, 'placement prompt not found in the fixtures: ' + prompt);
      const b = byCls('g-opt').filter(o => text(o) === ans)[0];
      if (!b) break;
      b.click();
      await sleep(470);
    }
    await waitFor(() => byCls('arc-place-band').length === 1, 800, 'the placement result');
    ok(text(byCls('arc-place-band')[0]) === 'B2' && W.Profile.current() === 'B2' && W.Profile.placed(), 'all right must place at B2, got ' + W.Profile.current());
    ok(JSON.parse(store['liofa.profile']).band === 'B2', 'the band is kept in liofa.profile');
    W.GAArcade.board();
    ok(byCls('arc-tile').length === 7 && byCls('arc-tile').every(t => !t.disabled), 'with banks, all seven tiles play');
    ok(allText().indexOf('ag teacht') === -1, 'no tile should say "ag teacht" once the banks are there');
  }

  // ---- the board with banks: the mode sheet, the tense picker --------------------------------------------------------------------------------
  {
    W.GAArcade.board();
    const bri = byCls('arc-tile').filter(t => text(t).indexOf('Briathra') !== -1)[0];
    bri.click();
    ok(allText().indexOf('Go réidh') !== -1 && allText().indexOf('In aghaidh an chloig') !== -1, 'the sheet offers both modes');
    ok(allText().indexOf('Tenses') !== -1 || allText().indexOf('Aimsirí') !== -1, 'Briathra sheet has a tense picker');
    const chips = byCls('arc-chip');
    ok(chips.length >= 4, 'tense chips: ' + chips.length);
    const past = chips.filter(c => /Past|Caite/.test(text(c)))[0];
    past.click();
    ok(JSON.parse(store['liofa.arcade']).sel.briathra[0] === 'caite', 'the tense choice is kept in liofa.arcade');
    ok(past.cls().includes('on'), 'the chosen chip lights up');
    byCls('arc-mode')[0].click();                          // Go réidh
    await sleep(40);
    ok(!!byCls('g-shell')[0] && LAST.topic === 'briathra:caite', 'the round honours the chosen tense');
    byCls('g-exit')[0].click();
    ok(byCls('arc-tile').length === 7, 'leaving a round returns to the board');
    // focail sheet: word test button and coverage
    byCls('arc-tile').filter(t => text(t).indexOf('Focail') !== -1)[0].click();
    ok(allText().indexOf('commonest words') !== -1 && allText().indexOf('Triail focal') !== -1, 'Focail sheet: coverage and the word test');
    btnWith('arc-wtbtn', byCls('arc-wtbtn')[0] && text(byCls('arc-wtbtn')[0])).click();
    ok(allText().indexOf('Níl a fhios agam') !== -1 && byCls('arc-wt-prompt').length === 1, 'the word test screen');
    const prompt = text(byCls('arc-wt-prompt')[0]), w = WORDS.filter(x => x.en === prompt)[0];
    const input = byCls('arc-wt-input')[0];
    input.value = w.ga; input.dispatchEvent({ type: 'input' });
    ok(SRS.isLearnt('w:' + w.ga), 'typing the word right in Triail focal makes it learnt');
    await sleep(400);
    W.GAArcade.board();
  }

  // ---- the weekly check ----------------------------------------------------------------------------------------------------------------------------
  {
    const C = W.GACheck;
    W.Profile.set('B2');
    const lad = C.ladder();
    ok(lad.length >= 8 && lad.every(u => u.k && u.label.ga && u.label.en), 'ladder: ' + lad.length);
    ok(C.due() === false || C.playedRounds() >= 3, 'a first check waits for three rounds');
    let s = C.session(rng, { at: 1000 });
    ok(!s.done && s.count() === 3 && s.step() === 0, 'session starts on the first unit with three questions');
    let guard = 0;
    while (!s.done && guard++ < 200) { const it = s.item(); const r = s.answer(it.a); ok(r.right && r.why && r.peek, 'right answer carries its note'); s.next(); }
    ok(s.done && !s.stopped && Object.keys(s.res).every(k => s.res[k] === 'dominado'), 'an all-right check is dominado throughout');
    ok(s.suggested === 'B2', 'suggested band after all right: ' + s.suggested);
    ok(JSON.parse(store['liofa.check']).at === 1000, 'the check is stored in liofa.check');
    ok(C.due(1000 + 2 * 86400000) === false && C.due(1000 + 8 * 86400000) === true, 'due a week later');
    ok(s.nextUnit === null, 'nothing to learn when all is well');
    // two weak units in a row stop it, and the next card is offered
    s = C.session(rng, { at: 5000 });
    guard = 0;
    while (!s.done && guard++ < 200) { const it = s.item(); s.answer(it.o.filter(o => o !== it.a && (it.x || []).indexOf(o) === -1)[0]); s.next(); }
    ok(s.done && s.stopped, 'two weak units in a row stop the check');
    ok(s.nextUnit && s.nextUnit.id === lad[0].id && s.res[lad[0].id] === 'aprender', 'the next unit to learn is the first weak one');
    ok(s.suggested === 'A1', 'all wrong suggests A1, got ' + s.suggested);
    // the screens
    C.snooze(0); store['liofa.check'] = '{}';
    W.GAArcade.checkRun();
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
    store['liofa.check'] = '{}';
    ['imir:t', 'briathra:t', 'focail:t'].forEach(k => GS.record(k, { score: 100, combo: 1, band: 'A1', run: 1, seen: 3, right: 3, ms: 1000, curve: [] }));
    ok(W.GACheck.due() === true, 'three rounds played and never checked: due');
    W.GAArcade.board();
    ok(byCls('arc-check').length === 1 && allText().indexOf('Weekly check') !== -1 || allText().indexOf('Seiceáil seachtainiúil') !== -1, 'the weekly check card shows on the board');
  }

  // ---- the cards -------------------------------------------------------------------------------------------------------------------------------------
  {
    ok(!!W.GA_CARDS.lait && Object.keys(W.GA_CARDS).length >= 10, 'cards.js did not load');
    W.GA_CARDS.fixture = { kind: 'grammar', topic: 'x', name: { ga: 'Cárta', en: 'A card' },
      when: [{ ga: 'Nuair a *bhí*', en: 'When *bhí* is used' }], how: { ga: 'Mar seo', en: 'Like *this*' },
      table: { head: ['', 'one', 'two'], rows: [['a', 'b', 'c'], ['d', 'e', 'f']] },
      ex: [{ ga: 'Bhí mé ann.', en: 'I was there, *bhí*.' }], tip: { ga: 'Leid', en: 'A tip' } };
    W.Profile.set('A1');
    W.GAArcade.cardScreen('fixture');
    ok(allText().indexOf('A card') !== -1 && allText().indexOf('When it is used') !== -1, 'a beginner reads the card in English');
    const ital = byCls('arc-irish').map(text);
    ok(ital.indexOf('bhí') !== -1 && ital.indexOf('this') !== -1, '*x* must render as italic Irish, got ' + ital);
    ok(byCls('arc-ct-h').length === 3 && byCls('arc-ctable')[0].attrs['style:--cols'] === '3', 'the table renders its head and columns');
    ok(byCls('arc-ex').length === 1 && allText().indexOf('Bhí mé ann.') !== -1, 'examples render');
    ok(allText().indexOf('A tip') !== -1, 'the tip renders');
    byCls('arc-lang')[0].click();
    ok(allText().indexOf('Cárta') !== -1 && allText().indexOf('Cathain a úsáidtear é') !== -1, 'the language toggle switches to Irish');
    W.Profile.set('B2');
    delete W.GA_CARDS.fixture;
    // every real card renders
    Object.keys(W.GA_CARDS).forEach(k => {
      let threw = null; try { W.GAArcade.cardScreen(k); } catch (e) { threw = e; }
      ok(!threw && byCls('arc-when').length + byCls('arc-how').length > 0, 'card ' + k + ' failed to render: ' + (threw && threw.message));
    });
    // the progress panel lists the units with chips, and a chip opens its card
    W.GAArcade.board();
    ok(byCls('arc-tchip').length >= 8, 'the progress panel shows a chip per unit');
    const chip = byCls('arc-tchip').filter(c => c._on.click)[0];
    ok(!!chip, 'a unit chip with a card is tappable'); chip.click();
    ok(byCls('arc-tcard').length === 1, 'a chip opens its card');
  }

  // ---- the back button, the level picker ----------------------------------------------------------------------------------------------------------------------
  {
    W.GAArcade.board();
    byCls('arc-level')[0].click();
    ok(byCls('arc-pick').length === 4, 'the level picker lists A1 to B2');
    byCls('arc-pick')[0].click();                          // goBack -> history.back -> popstate -> board
    ok(W.Profile.current() === 'A1' && byCls('arc-tile').length === 7, 'picking a level sets it and goes home');
  }

  // ---- nothing under fluidez. -----------------------------------------------------------------------------------------------------------------------------------
  {
    const keys = Object.keys(store);
    ok(written.length > 20, 'the test wrote almost nothing, so the key check proves little');
    ok(written.every(k => k.indexOf('liofa.') === 0), 'keys not under liofa.: ' + written.filter(k => k.indexOf('liofa.') !== 0).filter((k, i, a) => a.indexOf(k) === i));
    ok(!keys.some(k => /fluidez/i.test(k)), 'a fluidez. key was written');
    ['liofa.srs', 'liofa.games', 'liofa.errors', 'liofa.profile', 'liofa.recent', 'liofa.arcade', 'liofa.check'].forEach(k => ok(k in store, 'expected key ' + k));
    const srcs = ['ga-arcade', 'ga-items', 'ga-check', 'ga-core', 'gameround', 'gamescore', 'srs', 'errorlog', 'ui', 'perf'].map(f => fs.readFileSync(path.join(GE, 'js', f + '.js'), 'utf8')).join('\n');
    ok(!/fluidez\./.test(srcs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'a fluidez. key survives in the code');
    ok(!/Speak|speechSynthesis|SpeechSynthesis/.test(srcs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'speech code survives');
  }

  console.log(`\n${checks - failures}/${checks} checks passed`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
