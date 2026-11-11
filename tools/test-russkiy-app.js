#!/usr/bin/env node
/* ============================================================================
 * test-russkiy-app.js: can Svobodno (russkiy/) deal, grade and run a round?
 *
 *   node tools/test-russkiy-app.js
 *
 * Loads EXACTLY the scripts russkiy/sw.js precaches (parsed from that file) into
 * a vm with a minimal DOM shim and checks:
 *   - the shell: sw.js mirrors index.html, no ../ paths, build marker matches
 *   - first open offers the two doors; the board renders with EMPTY banks
 *   - every tile deals valid items with the answer in the options
 *   - stress levels, typed-once-known, the checker (stress never counts)
 *   - the learnt rule, ticking phrases as known
 *   - stage 0: items of every kind, the 8 of 10 pass rule, the 30 item exit test
 *   - the Speak strand: gating, items, rounds, the script fade
 *   - nothing is written outside `svobodno.`, no dashes in what the learner reads
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const AD = path.join(ROOT, 'russkiy');

let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  FAIL ' + msg); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ACUTE = '́';

// ---- the shell, read from the worker itself ----------------------------------------
const swSrc = fs.readFileSync(path.join(AD, 'sw.js'), 'utf8');
const block = swSrc.slice(swSrc.indexOf('var ASSETS = ['), swSrc.indexOf('];', swSrc.indexOf('var ASSETS = [')));
const assets = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
const scripts = assets.filter(f => f.endsWith('.js'));
const html = fs.readFileSync(path.join(AD, 'index.html'), 'utf8');
ok(scripts.length > 15, 'few scripts in russkiy/sw.js ASSETS');
assets.forEach(a => { if (a !== './') ok(fs.existsSync(path.join(AD, a)), `sw.js lists ${a}, which does not exist`); });
const htmlRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(r => !/^https?:/.test(r));
htmlRefs.forEach(r => {
  ok(r.indexOf('../') === -1, `index.html reaches out of russkiy/: ${r}`);
  ok(assets.indexOf('./' + r) !== -1, `index.html uses ${r}, which sw.js does not precache`);
});
const scriptsInHtml = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => './' + m[1]);
ok(JSON.stringify(scriptsInHtml) === JSON.stringify(scripts), 'ASSETS in sw.js: script order differs from index.html');
['./data/audio.js', './js/ru-text.js', './js/ru-audio.js', './manifest.json', './css/svobodno.css'].forEach(a => ok(assets.indexOf(a) !== -1, 'sw.js ASSETS lacks ' + a));
ok(/<html lang="en"/.test(html) && /<title>Svobodno<\/title>/.test(html), 'index.html must be lang en, titled Svobodno');
const manifest = JSON.parse(fs.readFileSync(path.join(AD, 'manifest.json'), 'utf8'));
ok(manifest.name === 'Svobodno' && manifest.short_name === 'Svobodno' && manifest.lang === 'ru' && manifest.theme_color === '#110c0b' && manifest.background_color === '#110c0b', 'manifest fields');
ok(/CACHE_NAME = 'svobodno-'/.test(swSrc) && /AUDIO_CACHE = 'svobodno-audio'/.test(swSrc) && !/\.\.\//.test(swSrc), 'sw.js: caches svobodno-<ver> and svobodno-audio, no ../');
ok(/cache: 'reload'/.test(swSrc), 'sw.js must fetch past the HTTP cache');
const cacheVer = /CACHE_VERSION = '([^']+)'/.exec(swSrc)[1];
ok(new RegExp("BUILD = '" + cacheVer + "'").test(fs.readFileSync(path.join(AD, 'js/perf.js'), 'utf8')), 'Perf.BUILD must equal CACHE_VERSION in sw.js');
{ // CACHE_VERSION fresh: the tools/ru check
  let msg = null;
  require(path.join(ROOT, 'tools/ru/checks/cache-fresh.js'))({ eq: (a, b, m) => { if (a !== b) msg = m; }, ROOT });
  ok(!msg, msg || 'cache fresh');
}
['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png'].forEach(f => ok(fs.existsSync(path.join(AD, 'icons', f)), 'missing icon ' + f));
const css = fs.readFileSync(path.join(AD, 'css/svobodno.css'), 'utf8').toLowerCase();
['#110c0b', '#1c1513', '#261c19', '#3a2a25', '#f5ece4', '#b49d8f', '#d2402f', '#e3a83a', '#57c47a', '#ff6b5e'].forEach(c => ok(css.indexOf(c) !== -1, 'svobodno.css lacks the palette colour ' + c));
ok(!/naskh|direction:\s*rtl/.test(css), 'svobodno.css still carries Arabic rules');
ok(!/@import|https?:|fonts\.g/.test(css), 'svobodno.css must be self-contained');

// no talaqa. or fluidez. storage keys anywhere in russkiy/ (code), no Arabic specifics left in code
(function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    if (!/\.(js|html|css|json)$/.test(d.name) || /^(words|nouns|verbs|phrases|cards)\.js$|^gaps-/.test(d.name)) return;
    const src = fs.readFileSync(p, 'utf8');
    ok(!/(talaqa|fluidez|liofa)\./i.test(src.replace(/Fluidez js\//g, '')), `${path.relative(ROOT, p)} mentions a talaqa. or fluidez. key`);
    if (/\.js$/.test(d.name) && d.name !== 'sw.js') ok(!/[؀-ۿ]|dir', 'rtl'|setAttribute\('dir'/.test(src), `${path.relative(ROOT, p)} still has Arabic or rtl code`);
  });
})(AD);
// no dashes in user-visible strings: en or em dash outside comments, in the code and in the hand-written data
['ru-arcade.js', 'gameround.js', 'ru-items.js', 'ru-check.js', 'ru-bukvy.js', 'ru-speak.js', 'ui.js', 'ru-core.js'].forEach(f => {
  const src = fs.readFileSync(path.join(AD, 'js', f), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  ok(!/[–—]/.test(src), f + ' shows an en or em dash outside comments');
  ok(!/(["'])(?:(?!\1)[^\\\n])* [-‐] (?:(?!\1)[^\\\n])*\1/.test(src), f + ' has a spaced hyphen in a string');
});
['letters.js', 'speak.js', 'phrases.js'].forEach(f => {
  const src = fs.readFileSync(path.join(AD, 'data', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  ok(!/[–—]/.test(src) && !/ [-‐] /.test(src), 'data/' + f + ' has a dash in text the learner reads');
});

// ---- a DOM big enough to run the app in -------------------------------------------------
class El {
  constructor(tag, ns) {
    this.tagName = String(tag || '').toUpperCase();
    this.namespaceURI = ns || 'http://www.w3.org/1999/xhtml';
    this.children = []; this.parentNode = null;
    this._text = ''; this.className = ''; this.attrs = {};
    this.disabled = false; this.type = ''; this.hidden = false; this.value = '';
    this._on = {}; this.offsetHeight = 0;
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
  querySelector(sel) { return this.all(n => n.cls().includes(String(sel).replace(/^\./, '')))[0] || null; }
  all(pred, out) { out = out || []; this.children.forEach(c => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}
const STAGE = new El('div');
const byCls = c => STAGE.all(n => n.cls().includes(c));
const allText = () => STAGE.textContent;

const store = {}, written = [], DOCL = {}, WINL = {}, HIST = [];
const played = [];
class AudioStub { constructor() { this.src = ''; } pause() {} setAttribute() {} play() { return Promise.resolve(); } }   // fetch records the clip
/* clips are fetched from bundles and played through Web Audio: the fetch records the bundle */
const fetchStub = url => { played.push(url); return Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) }); };
class AudioCtxStub { constructor() { this.state = 'running'; this.destination = {}; } resume() {} createBuffer() { return {}; }
  createBufferSource() { return { connect() {}, start() {}, stop() {} }; } decodeAudioData(b, ok) { ok({ duration: 1 }); } }
const ctx = {
  console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number, Promise, Error, RegExp, parseInt, parseFloat,
  Audio: AudioStub, fetch: fetchStub, AudioContext: AudioCtxStub, Blob: class { constructor(p) { this.p = p; } },
  URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
  localStorage: {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { written.push(k); store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  },
  location: { search: '', hash: '', reload() { ctx.__reloaded = true; } },
  history: { pushState(st) { HIST.push(st); }, back() { HIST.pop(); (WINL.popstate || []).forEach(fn => fn({})); } },
  requestAnimationFrame: fn => setTimeout(fn, 8),
  cancelAnimationFrame: id => clearTimeout(id),
  Event: class { constructor(t) { this.type = t; } },
  navigator: { language: 'en' },
  document: {
    documentElement: new El('html'), body: new El('body'),
    createElement: t => new El(t), createElementNS: (ns, t) => new El(t, ns),
    createTextNode: s => { const n = new El('#text'); n._text = String(s); return n; },
    removeEventListener(ev, fn) { DOCL[ev] = (DOCL[ev] || []).filter(f => f !== fn); },
    querySelector: sel => STAGE.querySelector(sel),
    getElementById: id => (id === 'stage-host' ? STAGE : null),
    addEventListener(ev, fn) { (DOCL[ev] = DOCL[ev] || []).push(fn); },
    readyState: 'complete', visibilityState: 'visible', hidden: false, activeElement: null
  },
  addEventListener(ev, fn) { (WINL[ev] = WINL[ev] || []).push(fn); }
};
ctx.window = ctx;
vm.createContext(ctx);
const fire = (ev, e) => (DOCL[ev] || []).slice().forEach(fn => fn(e || { type: ev, key: ev }));
const W = ctx;

// load up to (not including) the board, so the empty-bank board can be checked first
const arcadeAt = scripts.findIndex(s => s.endsWith('ru-arcade.js'));
scripts.slice(0, arcadeAt).forEach(rel => vm.runInContext(fs.readFileSync(path.join(AD, rel), 'utf8'), ctx, { filename: rel }));
const REAL = { b: W.RU_BANK, w: W.RU_WORDS, p: W.RU_PHRASES, a: W.RU_AUDIO };
console.log(`  repository banks: ${(REAL.b || []).length} gap rows, ${(REAL.w || []).length} words, ${(REAL.p || []).length} phrases, ${Object.keys(REAL.a || {}).length} clips`);
W.RU_BANK = []; W.RU_WORDS = []; W.RU_PHRASES = []; W.RU_AUDIO = {}; W.RUItems.reset();
vm.runInContext(fs.readFileSync(path.join(AD, scripts[arcadeAt]), 'utf8'), ctx, { filename: scripts[arcadeAt] });
ok(!!W.RUItems && !!W.GameScore && !!W.GameRound && !!W.RUCheck && !!W.RUArcade && !!W.RU && !!W.RUBukvy && !!W.RUSpeak, 'the modules did not load');
ok(!W.ENGINE && !W.Checker && !W.GA && !W.ARItems && !W.AR, 'another app leaked into Svobodno');
ok(typeof W.RU.play === 'function' && typeof W.RU.has === 'function', 'ru-audio did not add RU.play');
const A = s => W.RU.fromApostrophe(s);
const strip = s => W.RU.strip(s);

// ---- first open: the two doors --------------------------------------------------------------------
{
  const H = W.RUBukvy;
  ok(!H.started() && !H.unlocked(), 'a new learner has not started and the board is locked');
  W.RUArcade.board();
  ok(byCls('arc-first').length === 1 && allText().indexOf('I\'m new to Cyrillic') !== -1 && allText().indexOf('I can read Russian') !== -1, 'first open offers both doors');
  ok(byCls('arc-tile').length === 0, 'the board stays closed before the exit test');
  const door = byCls('arc-mode').filter(b => b.textContent.indexOf('new to Cyrillic') !== -1)[0]; door.click();
  ok(allText().indexOf('Lesson 1') !== -1 && byCls('hr-letter').length === 6 && byCls('hr-start').length === 1, 'the first door opens lesson 1 with its six letters and a round button');
  ok(byCls('ru').every(n => n.attrs.lang === 'ru' && n.attrs.dir === undefined), 'every .ru node is lang ru with no dir');
  W.RUArcade.board(); ok(byCls('hr-letter').length === 0 && byCls('arc-pick').length === 7 + W.RU_SPEAK.length, 'started: the path lists the 7 lessons and the speak packs');
  ok(byCls('arc-pick').filter(b => !b.disabled).length === 2, 'only lesson 1 and pack 1 are open');
  ok(byCls('arc-wtbtn').some(b => /stress/.test(b.textContent)), 'the path offers the stress card');
  byCls('arc-wtbtn').filter(b => /stress/.test(b.textContent))[0].click();
  ok(/Stress/i.test(allText()) && byCls('arc-fail').length === 0, 'the stress card opens from Letters');
}

// ---- the board with empty banks, once the letters test is passed ----------------------------------------------
store['svobodno.bukvy'] = JSON.stringify({ started: true, passed: {}, exam: { passed: true } });
W.RUBukvy._reset();
{
  W.RUArcade.board();
  const tiles = byCls('arc-tile'), soon = byCls('arc-soon');
  ok(tiles.length === 9, `empty banks: expected 9 tiles, got ${tiles.length}`);
  ok(soon.length === 7 && soon.every(s => s.textContent === 'coming soon'), 'empty banks: seven tiles say coming soon');
  ok(tiles.filter(t => t.disabled).length === 7, 'empty banks: only Letters and Speak are tappable');
  ok(byCls('arc-jugar').length === 1 && byCls('arc-jugar')[0].disabled, 'empty banks: Играть must be disabled');
  ['Glagóly', 'Slová', 'Frázy', 'Padezhí', 'Vid', 'Dvizhéniye', 'Chislá', 'Búkvy', 'Govorít'].forEach(l => ok(tiles.some(t => t.textContent.indexOf(l) !== -1), 'no tile for ' + l));
  ['Verbs', 'Words', 'Phrases', 'Cases', 'Aspect', 'Going', 'Numbers', 'Letters', 'Speak'].forEach(e => ok(tiles.some(t => t.textContent.indexOf(e) !== -1), 'tile lacks English ' + e));
  ok(/Игра/.test(byCls('arc-jugar')[0].textContent) && /Igrát/.test(byCls('arc-jugar')[0].textContent), 'the big tile reads Играть, Igrát');
  ok(tiles.every(t => t.all(n => n.cls().includes('ru')).length === 1), 'every tile label is a .ru node');
  ok(byCls('arc-fail').length === 0 && allText().indexOf('Your progress') !== -1, 'the board fell into the failure screen or lacks progress');
  ok(/Words and forms: OpenRussian\.org \(CC BY-SA 4\.0\)\./.test(allText()), 'the footer credits OpenRussian');
  ok(W.RUItems.next('igrat', 1, Math.random, {}) === null, 'an empty mix must deal null, not throw');
  W.RUArcade.cardScreen('nope'); ok(allText().indexOf('No card') !== -1, 'a missing card must say so');
  W.RUArcade.levelPicker(); ok(byCls('arc-pick').length === 4, 'the level picker offers four bands');
  W.RUArcade.settings(); ok(allText().indexOf('Stress marks') !== -1, 'settings render');
  W.RUArcade.checkRun(); ok(allText().length > 0 && !byCls('arc-fail').length, 'a check over empty banks must not crash');
  W.RUArcade.board();
  let threw = null;
  const keep = { b: W.RU_BANK, w: W.RU_WORDS, p: W.RU_PHRASES, c: W.RU_CARDS };
  delete W.RU_BANK; delete W.RU_WORDS; delete W.RU_PHRASES; delete W.RU_CARDS; W.RUItems.reset();
  try { W.RUArcade.board(); W.RUArcade.cardScreen('pres'); W.RUArcade.board(); } catch (e) { threw = e; }
  ok(!threw, 'board must cope with undefined banks: ' + (threw && threw.message));
  W.RU_BANK = keep.b; W.RU_WORDS = keep.w; W.RU_PHRASES = keep.p; W.RU_CARDS = keep.c;
}

// ---- fixtures: test data, not content --------------------------------------------------------------------
const P = (k, t, b, q, c, a, o, e, w, extra) => Object.assign({ k, t, b, q: A(q), c, a: A(a), x: [], o: o.map(A), e, w }, extra || {});
W.RU_BANK = [
  P('glagoly', 'pres', 'A1', "Сейча'с я ___ кни'гу.", 'read · I', "чита'ю", ["чита'ю", "чита'ешь", "прочита'ю", "бу'ду чита'ть"], "I'm reading a book now.", 'Present: now.', { v: "чита'ть", p: 'ya' }),
  P('glagoly', 'past', 'A2', "Вчера' она' ___ письмо'.", 'write · she', "написа'ла", ["написа'ла", "написа'л", "пи'шет", "напи'шет"], 'Yesterday she wrote a letter.', 'Past.', { v: "писа'ть", p: 'ona' }),
  P('glagoly', 'fut', 'B1', "За'втра мы ___ в Москву'.", 'go · we', "пое'дем", ["пое'дем", "е'дем", "пое'хали", "е'здили"], 'Tomorrow we will go to Moscow.', 'Future.', { v: "пое'хать", p: 'my' }),
  P('padezhi', 'prep', 'A1', "Я живу' в ___.", 'Moscow', "Москве'", ["Москве'", "Москва'", "Москву'", "Москво'й"], 'I live in Moscow.', 'After в, where: the prepositional.'),
  P('vid', 'past', 'A2', "Вчера' я весь ве'чер ___ кни'гу.", 'read · I', "чита'л", ["чита'л", "прочита'л", "чита'ла", "прочита'ла"], 'Yesterday I read a book all evening.', 'Imperfective.'),
  P('dvizhenie', 'pres', 'A1', "Сейча'с я ___ на рабо'ту.", 'I', "иду'", ["иду'", "хожу'", "е'ду", "е'зжу"], "I'm walking to work now.", 'One trip on foot.'),
  P('chisla', '2', 'A2', "Всего' 50 ___.", 'рубль', "рубле'й", ["рубле'й", "рубль", "рубля'", "рубли'"], '50 roubles in all.', 'After 5 and up: genitive plural.')
];
const WD = (ru, en, g, th, r, pos) => ({ ru: A(ru), en, g, pos: pos || 'n', th, b: 'A1', r });
W.RU_WORDS = [WD('мать', 'mother', 'f', 'people', 1), WD("кни'га", 'book', 'f', 'school', 2), WD("вода'", 'water', 'f', 'home', 3), WD("окно'", 'window', 'n', 'home', 4),
  WD("го'род", 'city', 'm', 'town', 5), WD('друг', 'friend', 'm', 'people', 6), WD('дом', 'house', 'm', 'home', 7), WD('стол', 'table', 'm', 'home', 8)];
W.RU_PHRASES = REAL.p.slice(0, 40).map(p => Object.assign({}, p));
const BANDS = ['A1', 'A2', 'B1', 'B2'];
W.RU_PHRASES.push({ id: 'long8', en: 'Where is the nearest big market in this city today?', ru: A("Где нахо'дится большо'й ры'нок в э'том го'роде"), tr: 'Gdye nakhóditsa balshóy rýnak v étam górade', th: 'travel', b: 'A1', n: null, alt: [] });
W.RU_PHRASES.push({ id: 'alt1', en: 'Good morning', ru: A("До'брое у'тро!"), tr: "Dóbraye útra!", th: 'greet', b: 'A1', n: null, alt: ['Доброе утро, друг'] });
W.RUItems.reset();
let seed = 20261111;
const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const GI = W.RUItems, GS = W.GameScore, SRS = W.SRS, RU = W.RU;
const wipeSrs = () => { delete store['svobodno.srs']; SRS._reset(); };
W.Profile.markPlaced();
W.Profile.set('B2');                                   // widest pool

// ---- the board with data: each tile is live, hooks cards in --------------------------------------------------
{
  W.RUArcade.board();
  ok(byCls('arc-soon').length === 0 && byCls('arc-tile').filter(t => t.disabled).length === 0 && !byCls('arc-jugar')[0].disabled, 'with data every tile is live');
  const G = W.RUArcade.GAMES;
  ok(G.map(g => g.hue).join() === '#e3a83a,#d2402f,#c77d2e,#b8577a,#3f8f8a,#7a6fd0,#3d86c6,#9aa83a,#e3a83a', 'tile hues follow the palette');
  W.RUArcade.sheet(G[1]);                              // Глаголы: a card per tense
  ok(byCls('arc-chip').length >= 4 && byCls('arc-chipq').length === 3, 'Verbs: topic chips for pres, past, fut, each with a ? card link');
  byCls('arc-chipq')[0].click();
  ok(/Настоя/.test(allText()) && byCls('arc-fail').length === 0, 'the ? opens the present card');
  [['vid', /Вид|Aspect/], ['dvizhenie', /Движе|Going|Verbs of/i], ['padezhi', /Падеж|Case/], ['chisla', /Числ|Number/]].forEach(([k, re]) => {
    W.RUArcade.sheet(G.filter(g => g.key === k)[0]);
    const rc = byCls('arc-wtbtn').filter(b => /Read the card/.test(b.textContent))[0];
    ok(!!rc, k + ': the tile offers its topic card');
    if (rc) { rc.click(); ok(re.test(allText()) && byCls('arc-fail').length === 0, k + ': the card renders'); }
  });
  W.RUArcade.sheet(G[3]);
  ok(byCls('arc-wtbtn').some(b => b.textContent === 'Tick the phrases you know'), 'Phrases: tick the phrases you know');
  W.RUArcade.sheet(G[2]);
  ok(byCls('arc-chip').some(b => b.textContent === 'Commonest') && byCls('arc-chip').length > 3, 'Words: theme chips');
  W.RUArcade.board();
}

// ---- every kind deals an item that scores --------------------------------------------------------------------
['glagoly', 'padezhi', 'vid', 'dvizhenie', 'chisla', 'slova', 'frazy', 'igrat'].forEach(kind => {
  let dealt = 0, scored = 0;
  const live = GI.bankCount(kind) > 0;
  for (let i = 0; i < 20; i++) {
    const it = GI.next(kind, 1 + (i % 8), rng, { grind: { asked: 0, newN: 0, used: {} } });
    if (!it) continue;
    dealt++;
    ok(!!it.answer && it.play, `${kind}: item has no answer or play`);
    ok(it.play !== 'choose' || it.hear || (it.options.length === 4 && it.options.indexOf(it.answer) !== -1), `${kind}: choose item must carry 4 options incl. the answer`);
    ok(it.cefr && BANDS.indexOf(it.cefr) !== -1, `${kind}: item band ${it.cefr}`);
    ok(it.hear || it.prompt.length > 0, `${kind}: no prompt`);
    if (it.optRu) ok(it.options.every(o => /[а-яё]/i.test(o)), `${kind}: options are Russian`);
    if (it.play === 'type') ok(RU.check(it.answer, it.accept) === 'good', `${kind}: the typed answer must grade good`);
    if (GS.award(it, 'good', 1200, 3).points > 0) scored++;
  }
  ok(live ? dealt >= 15 : dealt === 0, `${kind}: dealt ${dealt} of 20`);
  ok(scored === dealt, `${kind}: ${dealt - scored} items scored zero`);
  console.log(`  ${kind.padEnd(10)} dealt ${dealt}/20, all scored`);
});
{ // gap items: Russian prompt, English cue and peek, note, display levels
  W.Profile.set('A1');
  const a1 = GI.next('glagoly', 1, rng, { topics: ['pres'] });
  ok(a1.pRu && a1.level === 'full' && a1.cue === 'read · I' && a1.peek === "I'm reading a book now.", 'A1 sentence: Russian prompt, stress marks, cue and peek');
  ok(a1.prompt.indexOf('＿＿＿') !== -1 && a1.prompt.indexOf(ACUTE) !== -1, 'gap shows the blank; the prompt keeps its stress marks');
  W.Profile.set('A2'); ok(GI.next('glagoly', 1, rng, { topics: ['past'] }).level === 'full', 'A2 sentences still carry stress');
  W.Profile.set('B1'); ok(GI.next('glagoly', 1, rng, { topics: ['fut'] }).level === 'bare', 'B1 sentences are bare');
  W.RUCore.setPref('stress', 'full'); ok(GI.next('glagoly', 1, rng, { topics: ['fut'] }).level === 'full', 'the stress setting overrides the band');
  W.RUCore.setPref('stress', 'auto');
  W.Profile.set('B2');
  const orders = {};
  for (let i = 0; i < 30; i++) orders[GI.next('glagoly', 3, rng, { topics: ['pres'] }).options.join()] = 1;
  ok(Object.keys(orders).length > 3, 'options are not being shuffled');
  ok(JSON.parse(store['svobodno.recent']).length > 0, 'nothing in svobodno.recent');
}
{ // the mix with some banks missing deals only from the live ones
  const keep = W.RU_BANK; W.RU_BANK = keep.filter(r => r.k === 'chisla'); GI.reset();
  const kinds = {};
  for (let i = 0; i < 40; i++) { const it = GI.next('igrat', 3, rng, {}); if (it) kinds[it.kind] = 1; }
  ok(Object.keys(kinds).sort().join() === 'chisla,frazy,slova', 'partial banks: mix dealt ' + Object.keys(kinds));
  W.RU_BANK = keep; GI.reset();
}

// ---- grading: stress and ё never count; slips are near ---------------------------------------------------------
{
  const it = { accept: [A("хорошо'")] };
  ok(GI.grade(it, 'хорошо') === 'good' && GI.grade(it, A("хорошо'")) === 'good', 'stress optional');
  ok(GI.grade(it, A("хоро'шо")) === 'good', 'wrong stress never counts');
  ok(GI.grade({ accept: ['ещё'] }, 'еще') === 'good', 'е for ё is fine');
  ok(GI.grade({ accept: ['мать'] }, 'мат') === 'near', 'a missing soft sign is near');
  ok(GI.grade({ accept: ['мой'] }, 'мои') === 'near', 'и for й is near');
  ok(RU.slip('мат', 'мать') === 'sign' && RU.slip('мои', 'мой') === 'kratkoe' && RU.slip('шесть', 'щесть') === 'shch' && RU.slip('это', 'этo') !== 'x', 'slip names the slip');
  ok(GI.grade(it, 'дом') === 'wrong' && GI.grade(it, '') === 'wrong', 'wrong is wrong');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'near', 1000, 0).points < GS.award({ cefr: 'A1', play: 'type' }, 'good', 1000, 0).points, 'near scores less');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'wrong', 1000, 5).points === 0, 'wrong scores zero');
  ok(GI.words(A("Как дела'?")).join('|') === 'как|дела', 'the diff keys ignore stress and punctuation');
}

// ---- tap first, type once known; stress level by right answers ----------------------------------------------------
{
  const g = W.RU_BANK.filter(r => r.k === 'glagoly')[0], id = GI.gapId(g);
  ok(GI.next('glagoly', 1, rng, { topics: [g.t] }).play === 'choose', 'a new item is tapped');
  SRS.enrol(id); SRS.grade(id, true);
  ok(!SRS.isLearnt(id) && GI.answeredRight(id), 'a right tap makes it known, not learnt');
  const it = GI.next('glagoly', 1, rng, { topics: [g.t] });
  ok(it.play === 'type' && GI.grade(it, g.a) === 'good', 'an item answered right once comes back typed');
  SRS.grade(id, false);
  ok(GI.next('glagoly', 1, rng, { topics: [g.t] }).play === 'choose', 'a missed item is tapped again');
}
{ // words: stress marks while new, bare after two right answers
  wipeSrs(); W.Profile.set('A1');
  const w = W.RU_WORDS[1], id = 'w:' + w.ru, C = W.RUCore;
  ok(C.wordLevel(id) === 'full' && C.showTranslit(id, 'A1'), 'a new word shows stress, with its transliteration');
  SRS.enrol(id); SRS.grade(id, true); ok(C.wordLevel(id) === 'full', 'one right answer: still marked');
  SRS.grade(id, true); ok(C.wordLevel(id) === 'bare' && !C.showTranslit(id, 'A1'), 'two right answers: bare, no transliteration');
  wipeSrs(); SRS.enrol(id); SRS.learn(id); ok(C.wordLevel(id) === 'bare', 'learnt: bare');
  wipeSrs();
  const it = GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(it.level === 'full' && it.play === 'choose' && it.optTr && it.options.every(o => it.optTr[o] === RU.translit(o)), 'a new A1 word: stress marks and a transliteration under every option');
  ok(it.trAnswer === RU.translit(it.answer), 'the correction carries the transliteration');
  W.Profile.set('B2');
  for (let i = 0; i < 20; i++) { const x = GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); ok(new Set(x.options.map(strip)).size === 4, 'options distinct once faded'); }
  ok(GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }).note === null || /feminine|masculine|neuter/.test(GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }).note || 'neuter'), 'a noun note names its gender');
  W.Profile.set('B2');
}

// ---- the learnt rule ---------------------------------------------------------------------------------------------------------
{
  wipeSrs();
  SRS.enrol('t:a'); SRS.grade('t:a', true, { typed: true, fresh: true });
  ok(SRS.isLearnt('t:a'), 'typed right on first sight is learnt');
  SRS.enrol('t:c'); SRS.grade('t:c', true, { typed: false, fresh: true });
  ok(!SRS.isLearnt('t:c') && SRS.passed('t:c'), 'a right tap on first sight is never learnt');
  SRS.enrol('t:d'); SRS.grade('t:d', true, { typed: true, fresh: false });
  ok(!SRS.isLearnt('t:d'), 'typed right on an item seen before is not learnt by rule (a)');
  SRS.state('t:d').last = SRS.today() - 200; SRS.grade('t:d', true, {});
  ok(SRS.isLearnt('t:d'), 'right 180+ days after the previous review is learnt, even by a tap');
  SRS.enrol('t:e'); SRS.grade('t:e', true, {}); SRS.state('t:e').last = SRS.today() - 100; SRS.grade('t:e', true, {});
  ok(!SRS.isLearnt('t:e'), '100 days is not enough');
  SRS.grade('t:a', false); ok(!SRS.isLearnt('t:a') && SRS.state('t:a').lapses === 1, 'a miss un-learns');
  ok(!SRS.isDue('t:d'), 'a learnt item is never due');
  const wid = 'w:' + W.RU_WORDS[0].ru; SRS.learn(wid);
  let hit = false;
  for (let i = 0; i < 60; i++) { const it = GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === wid) hit = true; }
  ok(!hit, 'a learnt word was dealt again');
  wipeSrs();
}

// ---- ticking a phrase as known skips it; unticking brings it back ------------------------------------------------------------
{
  wipeSrs();
  W.Profile.set('A1');
  const PL0 = GI.phraseList().list, a = PL0[0];
  PL0.slice(1).forEach(e => SRS.learn(e.id));
  const deal = () => { let hit = false; for (let i = 0; i < 80; i++) { const it = GI.next('frazy', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === a.id) hit = true; } return hit; };
  ok(deal(), 'before ticking, the phrase can be dealt');
  SRS.learn(a.id);
  ok(SRS.isLearnt(a.id) && !deal(), 'a ticked phrase was dealt again');
  SRS.unlearn(a.id);
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id) && deal(), 'an unticked phrase did not come back');
  ok(SRS.isLearnt(PL0[1].id), 'unlearn touched another phrase');
  W.RUArcade.knownScreen({ key: 'x', hue: '#fff' });
  const boxes = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(boxes.length === PL0.length && boxes.slice(1).every(b => b.checked) && !boxes[0].checked, 'the tick screen lists every phrase, ticked when learnt');
  boxes[0].checked = true; boxes[0]._on.change.forEach(fn => fn());
  ok(SRS.isLearnt(a.id), 'ticking a row learns the phrase');
  boxes[0].checked = false; boxes[0]._on.change.forEach(fn => fn());
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id), 'unticking a row clears it');
  ok(allText().indexOf(PL0[0].raw.tr) !== -1, 'the tick screen shows the transliteration');
  wipeSrs();
}

// ---- words typed, heard; phrases typed or built once known ----------------------------------------------------------------------
{
  wipeSrs(); W.Profile.set('B2');
  const w = W.RU_WORDS[1], id = 'w:' + w.ru;
  SRS.enrol(id); SRS.grade(id, true);
  W.RU_WORDS.forEach(x => { if (x !== w) SRS.learn('w:' + x.ru); });
  let typed = null;
  for (let i = 0; i < 40 && !typed; i++) { const it = GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === id) typed = it; }
  ok(typed && typed.play === 'type' && GI.grade(typed, w.ru) === 'good' && GI.grade(typed, strip(w.ru)) === 'good', 'a known word comes back typed, stress optional');
  // one in five known words is heard, once there are clips
  W.RU_AUDIO = {}; W.RU_WORDS.forEach(x => { W.RU_AUDIO[x.ru + '|ru'] = 'audio/l-1.bin#0,4'; });
  let heard = 0, typedN = 0;
  for (let i = 0; i < 200; i++) {
    wipeSrs(); W.RU_WORDS.forEach(x => { SRS.enrol('w:' + x.ru); SRS.grade('w:' + x.ru, true); });
    const it = GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
    if (it && it.hear) heard++; else if (it && it.play === 'type') typedN++;
  }
  ok(heard > 10 && heard < 80 && typedN > 100, `about one known word in five is heard: ${heard} of 200`);
  W.RU_AUDIO = {};
  ok(![...Array(60)].some(() => { const it = GI.next('slova', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); return it && it.hear; }), 'without a clip nothing is heard');
  // phrases
  wipeSrs();
  W.RU_PHRASES.forEach(p => { if (p.id === 'alt1' || p.id === 'long8') { SRS.enrol('p:' + p.id); SRS.grade('p:' + p.id, true); } else SRS.learn('p:' + p.id); });
  const draw = id2 => { for (let i = 0; i < 400; i++) { const it = GI.next('frazy', 1, rng, { grind: { asked: 0, newN: 0, used: {} }, count: 10, gkind: 'frazy' }); if (it && it.id === id2) return it; } return null; };
  const t = draw('p:alt1');
  ok(t && t.play === 'type' && GI.grade(t, 'доброе утро') === 'good' && GI.grade(t, 'Доброе утро, друг') === 'good', 'a known short phrase is typed; alt spellings count');
  const b = draw('p:long8');
  ok(b && b.play === 'build' && b.words.length === 7 && GI.grade(b, b.words.join(' ')) === 'good', 'a known 7 word phrase is built from chips');
  wipeSrs();
}

// ---- coverage --------------------------------------------------------------------------------------------------------------------
{
  const cv = GI.coverage(null), pc = GI.phraseCoverage();
  ok(cv.of > 0 && cv.n <= cv.of && /commonest words/.test(cv.text), 'word coverage: ' + JSON.stringify(cv));
  ok(pc.of === W.RU_PHRASES.length, 'phrase coverage');
  ok(GI.verbsKnown() >= 0 && GI.gapCoverage('glagoly').of > 0 && GI.grindThemes().length > 0, 'coverage helpers');
}

// ---- the repository's own banks: every kind deals well-formed items, however big they have grown ---------------------------------------------------------
{
  const fx = { b: W.RU_BANK, w: W.RU_WORDS, p: W.RU_PHRASES };
  W.RU_BANK = REAL.b || []; W.RU_WORDS = REAL.w || []; W.RU_PHRASES = REAL.p || []; GI.reset(); wipeSrs();
  let n = 0;
  ['glagoly', 'padezhi', 'vid', 'dvizhenie', 'chisla', 'slova', 'frazy', 'igrat'].forEach(kind => {
    for (let i = 0; i < 25; i++) {
      const it = GI.next(kind, 3, rng, { grind: { asked: 0, newN: 0, used: {} } });
      if (!it) continue;
      n++;
      ok(it.play !== 'choose' || it.hear || (it.options.length >= 3 && it.options.indexOf(it.answer) !== -1 && new Set(it.options.map(strip)).size === it.options.length), `real ${kind}: distinct options (stress dropped) with the answer`);
    }
  });
  ok(n > 100, 'the real banks dealt ' + n + ' items');
  W.RU_BANK = fx.b; W.RU_WORDS = fx.w; W.RU_PHRASES = fx.p; GI.reset(); wipeSrs();
}

// ---- the audio: RU.play does nothing without a clip ------------------------------------------------------------------------------------
{
  played.length = 0;
  ok(RU.play('нет клипа') === false && played.length === 0 && !RU.has('x'), 'no clip: RU.play does nothing');
  W.RU_AUDIO = { ["дом|ru"]: 'audio/l-1.bin#0,4' };
  ok(RU.has('дом') && RU.play('дом') && played.pop() === 'audio/l-1.bin', 'a clip plays, keyed "text|ru"');
  W.RUCore.setPref('autoplay', false); played.length = 0; ok(RU.autoplay('дом') === false && played.length === 0, 'autoplay off: nothing plays');
  W.RUCore.setPref('autoplay', true); ok(RU.autoplay('дом') === true, 'autoplay on (the default)');
  played.length = 0; W.RU_AUDIO = {};
}

// ---- stage 0: items of every kind ---------------------------------------------------------------------------------------------------------
const H = W.RUBukvy;
{
  W.RU_AUDIO = {};
  const kinds = {};
  for (let n = 1; n <= 7; n++) {
    const deal = H.lessonDealer(n);
    for (let i = 0; i < 40; i++) {
      const it = deal(rng);
      ok(it && it.stage0 && /^b:[lsprbti]:/.test(it.id) && it.cefr === 'A1', `lesson ${n}: item has a b: id`);
      if (!it) continue;
      kinds[it.drill] = (kinds[it.drill] || 0) + 1;
      ok(it.play !== 'choose' || (it.options.length === (it.drill === 'stress' ? it.options.length : 4) && it.options.length >= 2 && new Set(it.options).size === it.options.length && it.options.indexOf(it.answer) !== -1), `lesson ${n} ${it.drill}: distinct options incl. the answer`);
      ok(!it.hear, 'with no clips nothing is heard');
      if (it.drill === 'build') {
        ok(it.play === 'build' && it.target === it.answer.replace(/́/g, '') && it.tiles.length === it.target.length + 2, 'build: letter tiles, target and two decoys');
        const c = {}; it.tiles.forEach(t => { c[t] = (c[t] || 0) + 1; }); it.target.split('').forEach(t => { c[t]--; });
        ok(Object.values(c).filter(v => v < 0).length === 0, 'build: the tiles hold every letter of the word');
      }
      if (it.drill === 'read') ok(it.ansLatin && it.options.indexOf(RU.translit(it.ru)) !== -1 && !it.optRu, 'read: transliteration options, other lesson words as distractors');
      if (it.drill === 'shape') ok(it.options.indexOf(it.answer) !== -1 && it.answer.length === 1 && it.prompt.length === 1 && it.prompt !== it.answer, 'shape: a capital and a small letter');
      if (it.drill === 'pair') ok('аяэеоёуюыи'.indexOf(it.prompt) !== -1 && it.options.every(o => 'аяэеоёуюыи'.indexOf(o) !== -1), 'pair: vowels only');
      if (it.drill === 'letter') ok(it.ansLatin && it.options.indexOf(it.answer) !== -1, 'sound: a letter, pick its sound');
      if (it.drill === 'stress') ok(it.options.length >= 2 && it.options.every(o => o.split(ACUTE).length === 2 && o.replace(ACUTE, '') === it.prompt) && it.options.indexOf(it.answer) !== -1, 'stress: the word with the accent in each place');
      if (it.drill === 'italic') ok(it.pItalic && it.options.indexOf(it.prompt) !== -1, 'italic: the word in print among the options');
      if (n === 1) ok(['letter', 'shape', 'read', 'build'].indexOf(it.drill) !== -1, 'lesson 1 deals only its own kinds');
    }
  }
  console.log('  stage 0 kinds dealt: ' + Object.keys(kinds).map(k => k + ' ' + kinds[k]).join(', '));
  ['letter', 'shape', 'pair', 'read', 'build', 'stress', 'italic'].forEach(k => ok(kinds[k] > 0, 'stage 0 never dealt ' + k));
  // hear, once there are clips
  W.RU_AUDIO = {}; W.RU_LETTERS.forEach(l => { W.RU_AUDIO[l.nm + '|ru'] = 'audio/l-' + l.id + '.mp3'; });
  let hear = 0;
  const d2 = H.lessonDealer(3);
  for (let i = 0; i < 40; i++) { const it = d2(rng); if (it.hear) { hear++; ok(it.promptSay && it.options.length === 4 && it.options.every(o => o.length === 1), 'hear: audio prompt, four letters'); } }
  ok(hear > 3, 'hear items appear once the clips exist');
  W.RU_AUDIO = {};
  // the exit test: 30 items over every kind
  const ex = H.examItems(rng);
  ok(ex.length === 30, 'the exit test has 30 items, got ' + ex.length);
  ok(new Set(ex.map(i => i.drill)).size >= 6, 'the exit test covers every kind: ' + [...new Set(ex.map(i => i.drill))]);
  ok(H.EXAM === 30 && H.EXAM_PASS === 24 && H.EXAM_A2 === 28, 'exit test: 30 items, 24 to pass, 28 for A2');
}

// ---- stage 0: the engine, pass rule and exit test -------------------------------------------------------------------------------------------
const waitFor = async (pred, ms, what) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (pred()) return true; await sleep(10); } ok(false, 'timed out waiting for ' + what); return false; };
const overEl = () => byCls('g-over')[0];
async function answer(right) {
  const it = H.last();
  await waitFor(() => byCls('g-opt').length || byCls('g-tile').length, 2000, 'the item to render');
  if (it.play === 'choose') {
    const opts = byCls('g-opt');
    const pickBtn = right ? opts.filter(o => o._val === it.answer)[0] : opts.filter(o => o._val !== it.answer)[0];
    if (!pickBtn) throw new Error('STAGE:' + allText().slice(0, 300) + ' no option for ' + it.drill + ' ' + JSON.stringify(it.options) + ' ans ' + it.answer + ' btns ' + byCls('g-opt').map(o => o._val) + ' right ' + right);
    pickBtn.click();
  } else if (it.play === 'build') {
    const tiles = byCls('g-tile').filter(t => !t.cls().includes('back'));
    const used = new Set();
    let order = it.target.split('');
    if (!right) { order = order.slice().reverse(); if (order.join('') === it.target) order[0] = '#'; }
    order.forEach(ch => {
      let t = tiles.filter(x => !used.has(x) && x._ch === ch)[0];
      if (!t) t = tiles.filter(x => !used.has(x))[0];
      used.add(t); t.click();
    });
  } else throw new Error('stage 0 item with play ' + it.play);
  const before = it;
  await waitFor(() => overEl() || byCls('g-continue').length || H.last() !== before, 3000, 'the item to resolve');
  if (byCls('g-continue').length && !overEl()) { byCls('g-continue')[0].click(); }
  await waitFor(() => overEl() || H.last() !== before, 3000, 'the next item');
}
const resetStage0 = () => { Object.keys(store).forEach(k => { if (/^svobodno\.(bukvy|profile|srs)$/.test(k)) delete store[k]; }); H._reset(); SRS._reset(); W.Profile._reset(); };
(async () => {
  W.RU_AUDIO = {};
  // a lesson round: 10 right passes; 7 right does not
  resetStage0();
  H.startLessonRound(1);
  await waitFor(() => H.last(), 1000, 'the first item');
  ok(byCls('g-name')[0].textContent === 'Letters 1', 'the round is titled with its lesson');
  for (let i = 0; i < 10; i++) await answer(true);
  ok(!!overEl() && overEl().textContent.indexOf('Lesson 1 passed') !== -1 && H.lessonDone(1) && H.lessonOpen(2) && !H.lessonOpen(3), 'all right passes lesson 1 and opens lesson 2');
  ok(byCls('arc-btn').some(b => b.textContent === 'Next lesson →'), 'the end screen offers the next lesson');
  H.startLessonRound(2);
  await waitFor(() => !overEl(), 1000, 'lesson 2 to start');
  for (let i = 0; i < 10; i++) await answer(i < 7);
  ok(!!overEl() && overEl().textContent.indexOf('8 are needed') !== -1 && !H.lessonDone(2), '7 of 10 does not pass');
  // the exit test: 24 right opens the board at A1
  const runExam = async (rights, label) => {
    resetStage0(); store['svobodno.bukvy'] = JSON.stringify({ started: true, passed: {}, exam: {} }); H._reset();
    H.startExam();
    await waitFor(() => H.last(), 1000, 'the exit test to start (' + label + ')');
    for (let i = 0; i < 30; i++) await answer(i < rights);
  };
  await runExam(24, '24');
  ok(!!overEl() && H.unlocked() && W.Profile.current() === 'A1' && W.Profile.placed(), '24 of 30 unlocks the board at A1');
  ok(byCls('arc-btn').some(b => b.textContent === 'Open the games →'), 'the exit test offers the games');
  ok(H.lessonDone(7) && H.lessonOpen(7), 'passing the test opens every lesson');
  await runExam(28, '28');
  ok(H.unlocked() && W.Profile.current() === 'A2', '28 of 30 starts at A2');
  await runExam(23, '23');
  ok(!H.unlocked() && !W.Profile.placed(), '23 of 30 keeps the board closed');

  // ---- a typed round: the Russian input, near misses and the one-time keyboard guide --------------------------------------------------------------------------------
  resetStage0(); store['svobodno.bukvy'] = JSON.stringify({ started: true, passed: {}, exam: { passed: true } }); H._reset();
  delete store['svobodno.kbd'];
  W.Profile.set('B2'); W.RU_AUDIO = {};
  wipeSrs();
  W.RU_WORDS.slice(1).forEach(x => SRS.learn('w:' + x.ru));
  const w0 = W.RU_WORDS[0]; SRS.enrol('w:' + w0.ru); SRS.grade('w:' + w0.ru, true);
  W.GameRound.run(STAGE, { key: 'slova:t', title: 'Words', kind: 'slova', hue: '#c77d2e', count: 3, duration: null, onExit() {} });
  await sleep(40);
  const inp = byCls('g-input')[0];
  ok(inp && inp.attrs.lang === 'ru' && inp.attrs.dir === undefined && inp.attrs.autocorrect === 'off' && inp.autocapitalize === 'off' && inp.spellcheck === false, 'the input is lang ru, no autocorrect, capitalise or spellcheck');
  ok(byCls('g-kbd').length === 1 && /Add the Russian keyboard/.test(allText()) && /Keyboards → Add New Keyboard → Russian/.test(allText()), 'the first typed item shows the keyboard guide for Russian');
  ok(byCls('g-kbd')[0].all(n => n.tagName === 'BUTTON').map(b => b.textContent).join() === 'Done,Remind me later', 'the guide has Done and Remind me later');
  byCls('g-kbd')[0].all(n => n.textContent === 'Remind me later')[0].click();
  ok(byCls('g-kbd').length === 0 && JSON.parse(store['svobodno.kbd']).later === SRS.today(), 'remind me later sets the flag for today');
  // a near miss (the soft sign left out) says what slipped
  inp.value = 'мат'; inp.dispatchEvent({ type: 'keydown', key: 'Enter', preventDefault() {} });
  await sleep(60);
  ok(/almost/.test(allText()) && /soft sign/.test(allText()), 'a near miss names the slip: ' + allText().slice(0, 120));
  await sleep(2400);
  const inp2 = byCls('g-input')[0];
  const cur = byCls('g-prompt')[0] && byCls('g-prompt')[0].textContent;
  if (inp2 && cur === 'mother') { inp2.value = strip(w0.ru); inp2.dispatchEvent({ type: 'input' }); await sleep(300); ok(SRS.state('w:' + w0.ru).reps >= 2, 'a typed right answer is graded into the SRS'); }
  else ok(true, 'skipped: the mother word did not come up again');
  W.GameRound.run(STAGE, { key: 'slova:t', title: 'x', kind: 'slova', count: 1, duration: null, onExit() {} });
  await sleep(20);
  ok(byCls('g-kbd').length === 0, 'the guide does not come back the same day');
  store['svobodno.kbd'] = JSON.stringify('done');

  // ---- a gap round renders Russian, a speaker, the cue ------------------------------------------------------------------------------------------------------
  W.Profile.set('A1'); wipeSrs(); W.RU_AUDIO = { [A("чита'ю") + '|ru']: 'audio/l-k.bin#0,4' };
  W.GameRound.run(STAGE, { key: 'glagoly:t', title: 'Verbs', kind: 'glagoly', count: 2, duration: null, topics: ['pres'], onExit() {} });
  await sleep(30);
  const pr = byCls('g-prompt')[0];
  ok(pr.cls().includes('is-ru') && pr.attrs.dir === undefined && pr.all(n => n.cls().includes('ru')).length >= 1 && byCls('g-gap').length === 1, 'the Russian prompt is in .ru nodes, with one gap');
  ok(pr.textContent.indexOf(ACUTE) !== -1, 'A1 sentences show their stress marks');
  ok(byCls('g-cue')[0].textContent === 'read · I', 'the English cue sits under the sentence');
  const opts = byCls('g-opt'); ok(opts.length === 4 && opts.every(o => o.all(n => n.cls().includes('ru')).length === 1), 'four Russian options');
  played.length = 0;
  opts.filter(o => o._val === A("чита'ю"))[0].click();
  ok(played.length === 1 && played[0] === 'audio/l-k.bin', 'the answer\'s clip plays after the answer');
  fire('keydown', { key: 'Enter' });

  // ---- the faded text can be held for its stress -----------------------------------------------------------------------------------------------------------------
  { const n = W.UI.ruText(A("молоко'"), 'bare');
    ok(n.textContent === 'молоко' && n.cls().includes('faded'), 'bare text is faded: the stress mark is gone');
    n.dispatchEvent({ type: 'pointerdown' }); await sleep(W.UI.HOLD_MS + 60);
    ok(n.textContent === A("молоко'"), 'holding for 350 ms shows the stress');
    n.dispatchEvent({ type: 'pointerup' }); await sleep(120);
    ok(n.textContent === 'молоко', 'releasing hides it again');
    ok(W.UI.ruText(A("молоко'"), 'full').cls().indexOf('faded') === -1, 'marked text is not faded');
    ok(W.UI.ruText('дом', 'bare').cls().indexOf('faded') === -1, 'a word with nothing to fade is not faded'); }
  { const p = W.UI.rich(new El('p'), A('Say *ма\'ма* with the stress on the first а.'));
    ok(p.all(n => n.cls().includes('ru')).length >= 1 && p.textContent === A("Say ма'ма with the stress on the first а."), 'card text: *x* becomes a .ru span');
    const q = W.UI.mixed(new El('p'), A("Хорошо', good."));
    ok(q.all(n => n.cls().includes('ru')).length === 1 && q.children[0].textContent === A("Хорошо'"), 'Russian inside English gets its own span'); }

  // ---- Speak: the second strand of stage 0 ------------------------------------------------------------------------------------------------------------------------
  {
    const S = W.RUSpeak, keepPh = W.RU_PHRASES, keepAu = W.RU_AUDIO;
    ok(!!S && S.packs().length === 10, 'RUSpeak holds the ten packs');
    W.RU_PHRASES = REAL.p; W.RU_AUDIO = {}; GI.reset();
    const resetSpeak = (bukvy) => { resetStage0(); delete store['svobodno.speak']; delete store['svobodno.arcade']; S._reset();
      store['svobodno.bukvy'] = JSON.stringify(bukvy || { started: false, passed: {}, exam: {} }); H._reset(); };
    const noDash = t => !/[–—]/.test(t) && !/ [-‐] /.test(t);
    const packN = n => W.RU_SPEAK.filter(k => k.n === n)[0];

    // first open: both strands, pack 1 open and pack 2 locked, the board still shut
    resetSpeak();
    W.RUArcade.board();
    ok(byCls('arc-first').length === 1 && byCls('sp-strand').length === 2, 'first open shows two strands, Speak and Letters');
    ok(/Speak/.test(allText()) && /Govorít/.test(allText()) && /Letters/.test(allText()) && /Búkvy/.test(allText()) && /start speaking/i.test(allText()), 'first open names Speak (Govorít) and Letters (Búkvy) and says you can start speaking');
    ok(noDash(allText()), 'no dashes on the first open');
    ok(S.packOpen(1) && !S.packOpen(2) && !S.packOpen(10), 'pack 1 is open, pack 2 is locked');
    ok(byCls('arc-tile').length === 0 && !H.unlocked(), 'the board is locked on first open');
    byCls('arc-mode').filter(b => b.textContent.indexOf('Start speaking') !== -1)[0].click();
    ok(byCls('sp-card').length === packN(1).ids.length && byCls('hr-start').length === 1, 'pack 1 opens on its card with every phrase');
    { // the card: transliteration is the main line, the Cyrillic small above it, English, a note
      const c = byCls('sp-card')[0];
      ok(c.all(n => n.cls().includes('sp-ru')).length === 1 && c.all(n => n.cls().includes('sp-tr')).length === 1 && c.all(n => n.cls().includes('sp-en')).length === 1, 'a phrase card has Cyrillic, sound and English');
      const kids = c.children[0].children.map(n => n.cls().join('.'));
      ok(/sp-ru/.test(kids[0]) && /sp-tr/.test(kids[1]), 'the Cyrillic sits above the transliteration');
      ok(byCls('arc-chip').length === 0, 'there is no dialect chooser');
      ok(noDash(allText()), 'no dashes on the pack card');
    }
    H.markStarted(); W.RUArcade.board();                  // started now: the path with both strands
    { const packs = byCls('arc-pick').slice(0, 10);
      ok(byCls('arc-pick').length === 17 && !packs[0].disabled && packs.slice(1).every(b => b.disabled), 'the path lists ten packs and seven lessons; only pack 1 is open'); }

    // every pack builds ten valid items
    let kindsSeen = {};
    for (const pk of S.packs()) {
      const items = S.packItems(pk.n, rng);
      ok(items.length === 10, `pack ${pk.n}: ten items, got ${items.length}`);
      items.forEach(it => {
        kindsSeen[it.speakKind] = (kindsSeen[it.speakKind] || 0) + 1;
        if (it.play === 'choose') {
          ok(it.options.length === 4 && new Set(it.options).size === 4 && it.options.indexOf(it.answer) !== -1, `pack ${pk.n} ${it.speakKind}: four distinct options with the answer`);
          ok(it.options.every(o => it.optScript[o]), `pack ${pk.n} ${it.speakKind}: every option carries its Cyrillic`);
          ok(new Set(it.options.map(o => strip(it.optScript[o]))).size === 4, `pack ${pk.n}: no two options with the same Cyrillic`);
        } else if (it.play === 'build') {
          ok(it.latin && it.words.length >= 2 && it.words.join(' ') === it.answer, `pack ${pk.n}: build tiles make the answer`);
        } else ok(it.play === 'say' && it.self && !it.id, `pack ${pk.n}: a say item is self-marked and has no SRS id`);
        ok(it.id == null || /^sp:[^:]+$/.test(it.id), 'SRS ids are sp:<phrase>');
        ok(typeof it.key === 'string' && it.key.length > 0, 'every speak item carries a dedupe key');
      });
      ok(items.filter(i => i.self).length >= 1 && items.filter(i => !i.self).length >= 7, `pack ${pk.n}: some say, mostly graded`);
      ok(new Set(items.map(i => i.key)).size === items.length, `pack ${pk.n}: keys are all different`);
    }
    ok(['pick', 'build', 'say', 'reply'].every(k => kindsSeen[k] > 0), 'all four kinds are dealt: ' + JSON.stringify(kindsSeen));
    { // a reply: the next line of the dialogue is the answer
      const it = S.packItems(1, rng).filter(i => i.speakKind === 'reply')[0];
      const d = packN(1).dialogue, ids = d.map(x => x.id);
      const ph = id => W.RU_PHRASES.filter(p => p.id === id)[0];
      const ix = d.findIndex((x, i) => ph(x.id).en === it.prompt && ph(ids[i + 1]) && S.trOf(ph(ids[i + 1])) === it.answer);
      ok(ix !== -1 && /^They said: /.test(it.note), 'a reply item answers with the next dialogue line');
    }
    { const p = W.RU_PHRASES[0];
      ok(S.clip(p) === null, 'no clip, no speaker');
      W.RU_AUDIO[p.ru + '|ru'] = 'audio/x.bin#0,4';
      const c = S.clip(p); ok(c && c.t === p.ru && c.v === 'ru', 'a clip is found by the stressed text');
      W.RU_AUDIO = {}; }

    // driving a pack round through the real engine
    const sAnswer = async (right, sayGot) => {
      const it = S.last(), before = it;
      if (it.play === 'say') {
        byCls('g-say-listen')[0].click();
        ok(byCls('g-say-card').length === 1 && byCls('g-say-tr')[0].textContent === it.trAnswer, 'Listen reveals the sound, the Cyrillic and the English');
        const marks = byCls('g-say-marks')[0].all(n => n.tagName === 'BUTTON');
        marks.filter(b => b.textContent === (sayGot ? 'Got it' : 'Not yet'))[0].click();
      } else if (it.play === 'choose') {
        const o2 = byCls('g-opt');
        (right ? o2.filter(o => o._val === it.answer) : o2.filter(o => o._val !== it.answer))[0].click();
      } else {
        const chips = byCls('g-chip').filter(c => c._word !== undefined);
        const order = right ? it.words.slice() : it.words.slice().reverse();
        if (!right && order.join(' ') === it.answer) order.push(order.shift());
        const used = new Set();
        order.forEach(w => { const c = chips.filter(x => !used.has(x) && x._word === w)[0]; used.add(c); c.click(); });
      }
      await waitFor(() => overEl() || byCls('g-continue').length || S.last() !== before, 3000, 'the speak item to resolve');
      if (byCls('g-continue').length && !overEl()) byCls('g-continue')[0].click();
      await waitFor(() => overEl() || S.last() !== before, 3000, 'the next speak item');
    };
    resetSpeak({ started: true, passed: {}, exam: {} });
    wipeSrs();
    S.startRound(1);
    await waitFor(() => S.last(), 1000, 'the speak round to start');
    ok(byCls('g-name')[0].textContent === 'Speak 1', 'the round is titled with its pack');
    const dealtIds = [];
    for (let i = 0; i < 10; i++) { dealtIds.push(S.last()); await sAnswer(true, false); }
    ok(!!overEl() && /Pack 1 passed: \d+ of \d+/.test(overEl().textContent) && S.packDone(1) && S.packOpen(2) && !S.packOpen(3), 'all graded items right passes pack 1 and opens pack 2');
    ok(JSON.parse(store['svobodno.speak']).passed[1] === true, 'progress is kept in svobodno.speak');
    ok(byCls('arc-btn').some(b => b.textContent === 'Next pack →'), 'the end screen offers the next pack');
    const says = dealtIds.filter(i => i.play === 'say');
    ok(says.length >= 1 && says.every(i => !i.id), 'say items carry no SRS id');
    const sp = Object.keys(JSON.parse(store['svobodno.srs'] || '{}')).filter(k => k.indexOf('sp:') === 0);
    ok(sp.length > 0 && sp.every(k => !SRS.isLearnt(k)), 'graded speak items are in the SRS, none of them learnt');
    ok(!H.unlocked(), 'the board stays locked while a pack is passed');
    W.RUArcade.board(); ok(byCls('arc-tile').length === 0, 'and no board tiles are shown');

    // say items alone do not pass a pack
    wipeSrs();
    S.startRound(2);
    await waitFor(() => S.last(), 1000, 'the second speak round');
    for (let i = 0; i < 10; i++) await sAnswer(false, true);
    ok(!!overEl() && /are needed to pass/.test(overEl().textContent) && !S.packDone(2) && !S.packOpen(3), 'self-marked "Got it" never helps a pack pass');
    ok(Object.keys(JSON.parse(store['svobodno.srs'] || '{}')).every(k => !SRS.isLearnt(k)), 'say items make nothing learnt');
    ok(noDash(allText()), 'no dashes on the end screen');
    wipeSrs();
    S.startRound(2);
    await waitFor(() => S.last(), 1000, 'the third speak round');
    let gi = 0;
    for (let i = 0; i < 10; i++) { const self = S.last().self; await sAnswer(self || gi++ !== 0, true); }
    ok(!!overEl() && S.packDone(2), 'one miss in eight graded items still passes');

    // after the exam the board is open and the Speak tile sits beside the Letters tile
    resetSpeak({ started: true, passed: {}, exam: { passed: true } });
    W.RUArcade.board();
    { const pair = byCls('arc-row2')[0];
      ok(pair && pair.all(n => n.cls().includes('arc-tile')).length === 2 && /Govorít/.test(pair.textContent) && /Búkvy/.test(pair.textContent), 'the Speak tile sits beside the Letters tile');
      pair.all(n => n.cls().includes('arc-tile')).filter(t => /Govorít/.test(t.textContent))[0].click();
      ok(byCls('arc-pick').length === 10 && !byCls('arc-pick')[0].disabled && byCls('arc-pick')[1].disabled, 'the Speak tile opens the packs, pack 1 open'); }

    // Phrases script fade: the sound sits under the Cyrillic until the phrase is known
    W.RU_PHRASES = keepPh; GI.reset(); W.Profile.set('B2'); wipeSrs();
    const draw1 = () => GI.next('frazy', 1, rng, { grind: { asked: 0, newN: 0, used: {} }, count: 10, gkind: 'frazy' });
    let before = [], tries = 0;
    while (tries++ < 60 && before.length < 12) before.push(draw1());
    ok(before.length > 5 && before.every(i => i.trAnswer), 'before a phrase is known, its transliteration comes with it');
    { const ch = before.filter(i => i.play === 'choose');
      ok(ch.length > 0 && ch.every(i => i.options.every(o => i.optTr && i.optTr[o])), 'tapped options show a transliteration under the Cyrillic');
      const h = ch[0]; ok(h.optTr[h.answer] === (W.RU_PHRASES.filter(p => p.ru === h.answer)[0].tr), 'the hand-written transliteration is used'); }
    W.RU_PHRASES.forEach(p => { SRS.enrol('p:' + p.id); SRS.grade('p:' + p.id, true); });
    const after = []; for (let i = 0; i < 30; i++) { const it = draw1(); if (it) after.push(it); }
    ok(after.length > 10 && after.every(i => !i.trAnswer && !i.optTr), 'once the phrase is known the Cyrillic stands alone');
    ok(before.every(i => i.level === 'full'), 'A1 phrases carry stress marks');
    W.RU_PHRASES = keepPh; W.RU_AUDIO = keepAu;
    resetStage0(); delete store['svobodno.speak']; S._reset();
  }

  // ---- storage: nothing foreign -------------------------------------------------------------------------------------------------------------------------------------
  const keys = [...new Set(written)];
  ok(keys.length > 5 && keys.every(k => k.indexOf('svobodno.') === 0), 'every key written starts svobodno.: ' + keys.filter(k => k.indexOf('svobodno.') !== 0));
  ok(!Object.keys(store).some(k => /^(fluidez|liofa|talaqa)\./.test(k)), 'no fluidez., liofa. or talaqa. key');

  console.log(`\n${checks} checks, ${failures} failed`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
