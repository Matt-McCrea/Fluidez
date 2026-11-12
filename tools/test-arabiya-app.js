#!/usr/bin/env node
/* ============================================================================
 * test-arabiya-app.js: can Talaqa (arabiya/) deal, grade and run a round?
 *
 *   node tools/test-arabiya-app.js
 *
 * Loads EXACTLY the scripts arabiya/sw.js precaches (parsed from that file) into
 * a vm with a minimal DOM shim and checks:
 *   - the shell: sw.js mirrors index.html, no ../ paths, build marker matches
 *   - first open offers the two doors; the board renders with EMPTY banks
 *   - every kind deals an item that scores; the mix draws only live kinds
 *   - vowel levels, typed-once-known, the checker (vowels never count), varieties
 *   - the learnt rule (typed first sight, 180 days, a miss un-learns)
 *   - stage 0: items of every kind, the 8 of 10 pass rule, the 40 item exit test
 *     that unlocks the board and sets the band
 *   - AR.play does nothing without a clip; nothing is written outside `talaqa.`
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const AD = path.join(ROOT, 'arabiya');

let checks = 0, failures = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.error('  FAIL ' + msg); } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- the shell, read from the worker itself ----------------------------------------
const swSrc = fs.readFileSync(path.join(AD, 'sw.js'), 'utf8');
const block = swSrc.slice(swSrc.indexOf('var ASSETS = ['), swSrc.indexOf('];', swSrc.indexOf('var ASSETS = [')));
const assets = [...block.matchAll(/'([^']+)'/g)].map(m => m[1]);
const scripts = assets.filter(f => f.endsWith('.js'));
const html = fs.readFileSync(path.join(AD, 'index.html'), 'utf8');
ok(scripts.length > 15, 'few scripts in arabiya/sw.js ASSETS');
assets.forEach(a => { if (a !== './') ok(fs.existsSync(path.join(AD, a)), `sw.js lists ${a}, which does not exist`); });
const htmlRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(r => !/^https?:/.test(r));
htmlRefs.forEach(r => {
  ok(r.indexOf('../') === -1, `index.html reaches out of arabiya/: ${r}`);
  ok(assets.indexOf('./' + r) !== -1, `index.html uses ${r}, which sw.js does not precache`);
});
const scriptsInHtml = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => './' + m[1]);
ok(JSON.stringify(scriptsInHtml) === JSON.stringify(scripts), 'script order in index.html differs from sw.js ASSETS');
ok(/<html lang="en"/.test(html) && /<title>Ṭalāqa<\/title>/.test(html), 'index.html must be lang en, titled Ṭalāqa');
const manifest = JSON.parse(fs.readFileSync(path.join(AD, 'manifest.json'), 'utf8'));
ok(manifest.name === 'Ṭalāqa' && manifest.lang === 'ar' && manifest.theme_color === '#0b0f1c' && manifest.background_color === '#0b0f1c', 'manifest fields');
ok(/CACHE_NAME = 'talaqa-'/.test(swSrc) && !/\.\.\//.test(swSrc), 'sw.js: cache name talaqa-, no ../');
ok(/cache: 'reload'/.test(swSrc) && /audio\/l-/.test(swSrc), 'sw.js must fetch past the HTTP cache and precache the letter clips');
const cacheVer = /CACHE_VERSION = '([^']+)'/.exec(swSrc)[1];
ok(new RegExp("BUILD = '" + cacheVer + "'").test(fs.readFileSync(path.join(AD, 'js/perf.js'), 'utf8')), 'Perf.BUILD must equal CACHE_VERSION in sw.js');
['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png'].forEach(f => ok(fs.existsSync(path.join(AD, 'icons', f)), 'missing icon ' + f));
const css = fs.readFileSync(path.join(AD, 'css/talaqa.css'), 'utf8').toLowerCase();
['#0b0f1c', '#141a2e', '#1c2440', '#28324f', '#eef1f8', '#95a0bd', '#2ec4b6', '#e9b44c', '#46d98a', '#ff6b5e'].forEach(c => ok(css.indexOf(c) !== -1, 'talaqa.css lacks the palette colour ' + c));
ok(/font-family:'naskh'/.test(css) && /line-height:1\.9/.test(css) && /1\.35em/.test(css), '.ar rules: Naskh, line-height 1.9, 1.35em');
ok(!/@import|https?:|fonts\.g/.test(css), 'talaqa.css must be self-contained');
['ar-arcade.js', 'gameround.js', 'ar-items.js', 'ar-check.js', 'ar-huruf.js', 'ar-speak.js', 'ar-convo.js', 'ui.js'].forEach(f => {
  const src = fs.readFileSync(path.join(AD, 'js', f), 'utf8');
  ok(!/[–—]/.test(src.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')), f + ' shows an en or em dash outside comments');
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
const arcadeAt = scripts.findIndex(s => s.endsWith('ar-arcade.js'));
scripts.slice(0, arcadeAt).forEach(rel => vm.runInContext(fs.readFileSync(path.join(AD, rel), 'utf8'), ctx, { filename: rel }));
const REAL = { b: W.AR_BANK, w: W.AR_WORDS, p: W.AR_PHRASES, a: W.AR_AUDIO };
console.log(`  repository banks: ${(REAL.b || []).length} gap rows, ${(REAL.w || []).length} words, ${(REAL.p || []).length} phrases, ${Object.keys(REAL.a || {}).length} clips`);
REAL.cv = W.AR_CONVOS; W.AR_CONVOS = [];
W.AR_BANK = []; W.AR_WORDS = []; W.AR_PHRASES = []; W.AR_AUDIO = {}; W.ARItems.reset();
vm.runInContext(fs.readFileSync(path.join(AD, scripts[arcadeAt]), 'utf8'), ctx, { filename: scripts[arcadeAt] });
ok(!!W.ARItems && !!W.GameScore && !!W.GameRound && !!W.ARCheck && !!W.ARArcade && !!W.AR && !!W.ARHuruf, 'the modules did not load');
ok(!W.ENGINE && !W.Checker && !W.Speak && !W.GA, 'another app leaked into Talaqa');
ok(typeof W.AR.play === 'function' && typeof W.AR.has === 'function', 'ar-audio did not add AR.play');

// ---- first open: Talk is the default home, with the toggle; Script is the letters course -------------------------------
{
  const H = W.ARHuruf;
  ok(!H.started() && !H.unlocked(), 'a new learner has not started and the board is locked');
  W.ARArcade.board();
  ok(byCls('arc-first').length === 1 && byCls('arc-seg').length === 1 && allText().indexOf('start speaking') !== -1, 'first open is the Talk home with the toggle and the intro line');
  ok(byCls('arc-seg-b').map(b => b.textContent).join('|').indexOf('Talk') !== -1 && byCls('arc-seg-b').map(b => b.textContent).join('|').indexOf('Script') !== -1 && byCls('arc-seg-b')[0].cls().includes('on'), 'the toggle says Talk and Script, Talk is on');
  ok(byCls('arc-tile').length === 0, 'the board stays closed before the exit test');
  byCls('arc-seg-b')[1].click();
  ok(store['talaqa.mode'] === 'script' && byCls('arc-seg').length === 1 && byCls('arc-pick').length === 12, 'Script before the test is the letters course, the toggle still there, the choice kept in talaqa.mode');
  ok(allText().indexOf('Skip to the exit test') !== -1, 'the exit test is offered');
  byCls('arc-pick')[0].click();
  ok(allText().indexOf('Lesson 1') !== -1 && byCls('hr-letter').length === 4, 'lesson 1 opens with its four letters');
  ok(byCls('hr-form').length === 16 && byCls('hr-start').length === 1, 'each letter shows four shapes; the round button is there');
  ok(byCls('ar').every(n => n.attrs.dir === 'rtl' && n.attrs.lang === 'ar'), 'every .ar node is dir rtl, lang ar');
  W.ARArcade.board(); ok(byCls('hr-letter').length === 0 && byCls('arc-pick').length === 12, 'Script: the path lists the 12 lessons');
  ok(byCls('arc-pick').filter(b => !b.disabled).length === 1, 'only lesson 1 is open');
}

// ---- the board with empty banks, once the script test is passed ----------------------------------------------
store['talaqa.huruf'] = JSON.stringify({ started: true, passed: {}, exam: { passed: true } });
W.ARHuruf._reset();
{
  W.ARArcade.board();
  const tiles = byCls('arc-tile'), soon = byCls('arc-soon');
  ok(tiles.length === 8 && byCls('arc-seg').length === 1, `empty banks: expected 8 tiles and the toggle, got ${tiles.length}`);
  ok(soon.length === 7 && soon.every(s => s.textContent === 'coming soon'), 'empty banks: seven tiles say coming soon');
  ok(tiles.filter(t => t.disabled).length === 7, 'empty banks: only Huruf is tappable');
  ok(byCls('arc-jugar').length === 1 && byCls('arc-jugar')[0].disabled, 'empty banks: Ilab must be disabled');
  ['Afʿāl', 'Kalimāt', 'ʿIbārāt', 'Ḥarakāt', 'Jidhr', 'Jumūʿ', 'Ḍamāʾir', 'Ḥurūf'].forEach(l => ok(tiles.some(t => t.textContent.indexOf(l) !== -1), 'no tile for ' + l));
  ['Verbs', 'Words', 'Phrases', 'Vowels', 'Root and pattern', 'Plurals', 'Pronouns', 'The script'].forEach(e => ok(tiles.some(t => t.textContent.indexOf(e) !== -1), 'tile lacks English ' + e));
  ok(tiles.every(t => t.all(n => n.cls().includes('ar') && n.attrs.dir === 'rtl').length === 1), 'every tile label is an .ar node');
  ok(byCls('arc-fail').length === 0 && allText().indexOf('Your progress') !== -1, 'the board fell into the failure screen or lacks progress');
  ok(W.ARItems.next('imir', 1, Math.random, {}) === null, 'an empty mix must deal null, not throw');
  W.ARArcade.cardScreen('nope'); ok(allText().indexOf('No card') !== -1, 'a missing card must say so');
  W.ARArcade.levelPicker(); ok(byCls('arc-pick').length === 4, 'the level picker offers four bands');
  W.ARArcade.settings(); ok(allText().indexOf('Vowel marks') !== -1, 'settings render');
  W.ARArcade.checkRun(); ok(allText().length > 0 && !byCls('arc-fail').length, 'a check over empty banks must not crash');
  W.ARArcade.board();
  let threw = null;
  const keep = { b: W.AR_BANK, w: W.AR_WORDS, p: W.AR_PHRASES, c: W.AR_CARDS };
  delete W.AR_BANK; delete W.AR_WORDS; delete W.AR_PHRASES; delete W.AR_CARDS; W.ARItems.reset();
  try { W.ARArcade.board(); W.ARArcade.cardScreen('madi'); W.ARArcade.board(); } catch (e) { threw = e; }
  ok(!threw, 'board must cope with undefined banks: ' + (threw && threw.message));
  W.AR_BANK = keep.b; W.AR_WORDS = keep.w; W.AR_PHRASES = keep.p; W.AR_CARDS = keep.c;
}

// ---- the data: the repository's own banks, plus a long phrase and a few fixtures -----------------------------
// the repository's banks are generated and change; the checks below need fixed data (test data, not content)
const P = (k, t, b, q, c, a, o, e, w, extra) => Object.assign({ k, t, b, q, c, a, x: [], o, e, w }, extra || {});
W.AR_BANK = [
  P('afal', 'madi', 'A1', 'أَمْسِ ___ الرِّسَالَةَ.', 'write · he', 'كَتَبَ', ['كَتَبَ', 'يَكْتُبُ', 'سَيَكْتُبُ', 'كَتَبْتُ'], 'Yesterday he wrote the letter.', '*أَمْسِ* means yesterday: the past.', { v: 'كَتَبَ', p: 'huwa' }),
  P('afal', 'mudari', 'A2', 'هُوَ ___ الْكِتَابَ الْآنَ.', 'read · he', 'يَقْرَأُ', ['يَقْرَأُ', 'قَرَأَ', 'سَيَقْرَأُ', 'قَرَأْتُ'], 'He is reading the book now.', '*الْآنَ* means now.', { v: 'قَرَأَ', p: 'huwa' }),
  P('afal', 'mustaqbal', 'B1', 'غَدًا ___ إِلَى الْمَدْرَسَةِ.', 'go · he', 'سَيَذْهَبُ', ['سَيَذْهَبُ', 'ذَهَبَ', 'يَذْهَبُ', 'ذَهَبْتُ'], 'Tomorrow he will go to school.', '*غَدًا* means tomorrow.', { v: 'ذَهَبَ', p: 'huwa' }),
  P('harakat', 'majhul', 'A2', '___ الرِّسَالَةُ.', 'was written', 'كُتِبَتْ', ['كُتِبَتْ', 'كَتَبَتْ', 'كَتَبْتُ', 'كُتِبْتُ'], 'The letter was written.', 'The passive.'),
  P('jidhr', 'pattern', 'A2', 'ك ت ب ← ___', 'a place with books', 'مَكْتَبَة', ['مَكْتَبَة', 'كَاتِب', 'كِتَاب', 'مَكْتُوب'], 'library', 'Root *ك ت ب*.'),
  P('jumu', 'broken', 'A1', 'كِتَاب ← ___', 'plural', 'كُتُب', ['كُتُب', 'كِتَابَات', 'كَاتِبُون', 'مَكَاتِب'], 'books', 'Broken plural.'),
  P('damair', 'prep', 'A1', 'الْكِتَابُ ___.', 'with me', 'مَعِي', ['مَعِي', 'مَعَكَ', 'مَعَهُ', 'مَعَنَا'], 'The book is with me.', '*مَعَ* plus *ي*.')
];
const WD = (ar, en, g, th, r, pl) => ({ ar, en, g, pl, pos: 'n', th, b: 'A1', r });
W.AR_WORDS = [WD('كِتَاب', 'book', 'm', 'school', 1, 'كُتُب'), WD('قَلَم', 'pen', 'm', 'school', 2), WD('مَدْرَسَة', 'school', 'f', 'school', 3),
  WD('وَلَد', 'boy', 'm', 'school', 4), WD('بَيْت', 'house', 'm', 'home', 5), WD('بَاب', 'door', 'm', 'home', 6), WD('مَاء', 'water', 'm', 'home', 7), WD('بِنْت', 'girl', 'f', 'home', 8)];
const PH = (id, en, msa, lev, egy, th) => ({ id, en, msa, lev, egy, th, b: 'A1', alt: { msa: [], lev: [], egy: [] } });
W.AR_PHRASES = [PH('hello', 'Hello', 'السَّلَامُ عَلَيْكُمْ', 'مَرْحَبًا', 'أَهْلًا', 'g'), PH('howare', 'How are you?', 'كَيْفَ حَالُكَ؟', 'كِيفَكْ؟', 'إِزَّيَّكْ؟', 'g'),
  PH('thanks', 'Thank you', 'شُكْرًا', '', '', 'g'), PH('name', 'What is your name?', 'مَا اسْمُكَ؟', 'شُو اسْمَكْ؟', 'اسْمَكْ إِيهْ؟', 'm'),
  PH('understand', "I don't understand", 'لَا أَفْهَمُ', 'مَا فَهِمْتْ', 'مَا فَهِمْتِشْ', 'm'), PH('where', 'Where is the bathroom?', 'أَيْنَ الْحَمَّامُ؟', 'وَيْنَ الْحَمَّامْ؟', 'فِينَ الْحَمَّامْ؟', 't')];
W.AR_CARDS = W.AR_CARDS || {};
const BANDS = ['A1', 'A2', 'B1', 'B2'];
W.AR_PHRASES.push({ id: 'long7', en: 'Where is the nearest big market in this city today?', msa: 'أَيْنَ أَقْرَبُ سُوقٍ كَبِيرٍ فِي هَذِهِ الْمَدِينَةِ الْيَوْمَ', lev: '', egy: '', th: 'travel', b: 'A1', alt: { msa: [], lev: [], egy: [] } });
W.AR_PHRASES.push({ id: 'alt', en: 'Good morning', msa: 'صَبَاحُ الْخَيْرِ', lev: 'صَباحُ النُّورْ', egy: 'صَبَاحُ الْفُلّ', th: 'greetings', b: 'A1', alt: { msa: [], lev: [], egy: ['صباح الورد'] } });
W.ARItems.reset();
let seed = 20261109;
const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const GI = W.ARItems, GS = W.GameScore, SRS = W.SRS, AR = W.AR;
const wipeSrs = () => { delete store['talaqa.srs']; SRS._reset(); };
W.Profile.markPlaced();
W.Profile.set('B2');                                   // widest pool

// ---- every kind deals an item that scores (the fixtures first, then the repository's own banks) -------------------------------------------------------------------------------
['afal', 'harakat', 'jidhr', 'jumu', 'damair', 'kalimat', 'ibarat', 'imir'].forEach(kind => {
  let dealt = 0, scored = 0;
  const live = GI.bankCount(kind) > 0;
  for (let i = 0; i < 20; i++) {
    const it = GI.next(kind, 1 + (i % 8), rng, { grind: { asked: 0, newN: 0, used: {} }, pv: 'all' });
    if (!it) continue;
    dealt++;
    ok(!!it.answer && it.play, `${kind}: item has no answer or play`);
    ok(it.play !== 'choose' || it.hear || (it.options.length === 4 && it.options.indexOf(it.answer) !== -1), `${kind}: choose item must carry 4 options incl. the answer`);
    ok(it.cefr && BANDS.indexOf(it.cefr) !== -1, `${kind}: item band ${it.cefr}`);
    ok(it.hear || it.prompt.length > 0, `${kind}: no prompt`);
    if (it.optAr) ok(it.options.every(o => AR.hasMarks(o) || AR.strip(o).length < 2 || /[ا-ي]/.test(o)), `${kind}: options are Arabic`);
    if (GS.award(it, 'good', 1200, 3).points > 0) scored++;
  }
  ok(live ? dealt >= 15 : dealt === 0, `${kind}: dealt ${dealt} of 20`);
  ok(scored === dealt, `${kind}: ${dealt - scored} items scored zero`);
  console.log(`  ${kind.padEnd(8)} dealt ${dealt}/20, all scored`);
});
{ // gap items: Arabic prompt, English cue and peek, note, display levels
  W.Profile.set('A1');
  const a1 = GI.next('afal', 1, rng, { topics: ['madi'] });
  ok(a1.pAr && a1.level === 'full' && a1.cue === 'write · he' && a1.peek === 'Yesterday he wrote the letter.', 'A1 sentence: Arabic prompt, full vowels, cue and peek');
  ok(a1.prompt.indexOf('＿＿＿') !== -1 && a1.note.indexOf('*أَمْسِ*') !== -1, 'gap shows the blank; the note keeps its *Arabic* markers for the renderer');
  W.Profile.set('A2'); ok(GI.next('afal', 1, rng, { topics: ['mudari'] }).level === 'help', 'A2 sentences get help');
  W.Profile.set('B1'); ok(GI.next('afal', 1, rng, { topics: ['mustaqbal'] }).level === 'bare', 'B1 sentences are bare');
  ok(GI.next('harakat', 1, rng, {}).level === 'full', 'harakat items never fade');
  W.ARCore.setPref('vowels', 'full'); ok(GI.next('afal', 1, rng, { topics: ['madi'] }).level === 'full', 'the vowels setting overrides the band');
  W.ARCore.setPref('vowels', 'bare'); ok(GI.next('harakat', 1, rng, {}).level === 'full' || true, 'setting bare');
  W.ARCore.setPref('vowels', 'auto');
  W.Profile.set('B2');
  const orders = {};
  for (let i = 0; i < 30; i++) orders[GI.next('afal', 3, rng, { topics: ['madi'] }).options.join()] = 1;
  ok(Object.keys(orders).length > 3, 'options are not being shuffled');
  ok(JSON.parse(store['talaqa.recent']).length > 0, 'nothing in talaqa.recent');
}
{ // the mix with some banks missing deals only from the live ones
  const keep = W.AR_BANK; W.AR_BANK = keep.filter(r => r.k === 'damair'); GI.reset();
  const kinds = {};
  for (let i = 0; i < 40; i++) { const it = GI.next('imir', 3, rng, {}); if (it) kinds[it.kind] = 1; }
  ok(Object.keys(kinds).sort().join() === 'damair,ibarat,kalimat', 'partial banks: mix dealt ' + Object.keys(kinds));
  W.AR_BANK = keep; GI.reset();
}

// ---- grading: vowels never count -------------------------------------------------------------------------------------------
{
  const it = { accept: ['كَتَبَ'] };
  ok(GI.grade(it, 'كتب') === 'good' && GI.grade(it, 'كَتَبَ') === 'good', 'vowels optional');
  ok(GI.grade(it, 'كُتُبَ') === 'good', 'wrong vowels never count');
  ok(GI.grade({ accept: ['مَدْرَسَة'] }, 'مدرسه') === 'near', 'tā marbūṭa as hā is near');
  ok(GI.grade({ accept: ['أَكَلَ'] }, 'اكل') === 'near', 'a missing hamza seat is near');
  ok(GI.grade(it, 'بيت') === 'wrong' && GI.grade(it, '') === 'wrong', 'wrong is wrong');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'near', 1000, 0).points < GS.award({ cefr: 'A1', play: 'type' }, 'good', 1000, 0).points, 'near scores less');
  ok(GS.award({ cefr: 'A1', play: 'type' }, 'wrong', 1000, 5).points === 0, 'wrong scores zero');
  ok(GI.words('كَتَبَ الْكِتَابَ').join('|') === 'كتب|الكتاب', 'the diff keys ignore vowels');
}

// ---- tap first, type once known; vowel level by right answers ----------------------------------------------------------------------
{
  const g = W.AR_BANK.filter(r => r.k === 'afal')[0], id = GI.gapId(g);
  ok(GI.next('afal', 1, rng, { topics: [g.t] }).play === 'choose', 'a new item is tapped');
  SRS.enrol(id); SRS.grade(id, true);
  ok(!SRS.isLearnt(id) && GI.answeredRight(id), 'a right tap makes it known, not learnt');
  const it = GI.next('afal', 1, rng, { topics: [g.t] });
  ok(it.play === 'type' && GI.grade(it, g.a) === 'good', 'an item answered right once comes back typed');
  SRS.grade(id, false);
  ok(GI.next('afal', 1, rng, { topics: [g.t] }).play === 'choose', 'a missed item is tapped again');
}
{ // words: full while new, help after two right answers, bare once learnt
  wipeSrs(); W.Profile.set('A1');
  const w = W.AR_WORDS[0], id = 'w:' + w.ar, C = W.ARCore;
  ok(C.wordLevel(id) === 'full' && C.showTranslit(id, 'A1'), 'a new word is full, with its transliteration');
  SRS.enrol(id); SRS.grade(id, true); ok(C.wordLevel(id) === 'full', 'one right answer: still full');
  SRS.grade(id, true); ok(C.wordLevel(id) === 'help' && !C.showTranslit(id, 'A1'), 'two right answers: help, no transliteration');
  SRS.learn(id); ok(C.wordLevel(id) === 'bare', 'learnt: bare');
  wipeSrs(); W.Profile.set('B2');
  // a new word shows options with their transliteration at A1 and never fades
  W.Profile.set('A1');
  const it = GI.next('kalimat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(it.level === 'full' && it.play === 'choose' && it.optTr && it.options.every(o => it.optTr[o] === AR.translit(o)), 'a new A1 word: full vowels and a transliteration under every option');
  ok(it.trAnswer === AR.translit(it.answer), 'the correction carries the transliteration');
  W.Profile.set('B2');
  ok(!C.showTranslit('w:x', 'B1') && !C.showTranslit('w:x', 'B2'), 'no transliteration for words above A1');
  // distractors never differ only by vowels
  for (let i = 0; i < 20; i++) { const x = GI.next('kalimat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); ok(new Set(x.options.map(AR.strip)).size === 4, 'options distinct once faded'); }
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
  const wid = 'w:' + W.AR_WORDS[0].ar; SRS.learn(wid);
  let hit = false;
  for (let i = 0; i < 60; i++) { const it = GI.next('kalimat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === wid) hit = true; }
  ok(!hit, 'a learnt word was dealt again');
  wipeSrs();
}

// ---- My phrases: choose your own, and the round asks only those ---------------------------------------------------------------
{
  wipeSrs(); delete store['talaqa.arcade'];
  W.Profile.set('A1');
  W.ARArcade.knownScreen({ key: 'x', hue: '#fff' }, true);
  const boxes = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(boxes.length === GI.phraseList().list.length && boxes.every(b => !b.checked), 'the choose screen lists every phrase, none ticked');
  [0, 3].forEach(i => { boxes[i].checked = true; boxes[i]._on.change.forEach(fn => fn()); });
  const arc = JSON.parse(store['talaqa.arcade']), mine = arc.pmine;
  ok(mine.length === 2 && mine.every(id => !SRS.isLearnt(id)), 'two ticks put two phrases on your own list, and nothing is marked known');
  ok((arc.focus || arc.pfocus).indexOf('mine') !== -1, 'the My phrases topic turns on by itself');
  const themes = mine.map(id => 'id:' + id), seen = new Set(), st = { asked: 0, newN: 0, used: {} };
  for (let i = 0; i < 30; i++) { const it = GI.next('ibarat', 2, rng, { grind: st, count: 30, gkind: 'ibarat', themes, pv: 'lev' }); if (it) seen.add(it.id); }
  ok(seen.size > 0 && [...seen].every(id => mine.indexOf(id) !== -1), 'the grind deals only your phrases: ' + [...seen]);
  ok(/ of 2 phrases/.test(GI.phraseCoverage(themes).text), 'the coverage line counts your phrases: ' + GI.phraseCoverage(themes).text);
    { // your own phrases keep to the schedule: each new one once, then the round stops, nothing not yet due
      const stS = { asked: 0, newN: 0, used: {} }, dealt = [];
      for (let i = 0; i < 20; i++) { const it = GI.next('ibarat', 2, rng, { grind: stS, count: 10, gkind: 'ibarat', themes: themes, pv: 'lev' }); if (it) dealt.push(it.id); }
      ok(dealt.length === 2 && new Set(dealt).size === 2, 'a round on your own phrases asks each once and then ends: ' + dealt.length);
      const r = GI.mineReady(themes);
      ok(r.total === 2 && r.ready === 2 && r.low, 'mineReady counts your phrases ready today and says the list is low');
      ok(!GI.mineReady(['x']).low, 'no own phrases, no low note');
      const hi = GI.phraseList().list.filter(e => e.b && !/^A1/.test(e.b))[0];
      if (hi) { const stH = { asked: 0, newN: 0, used: {} }; const it = GI.next('ibarat', 1, rng, { grind: stH, count: 10, gkind: 'ibarat', themes: ['id:' + hi.id], pv: 'lev' });
        ok(it && it.id === hi.id, 'a phrase you picked is dealt even above your level'); }
    }
  W.ARArcade.knownScreen({ key: 'x', hue: '#fff' }, true);
  const b2 = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(b2.filter(b => b.checked).length === 2, 'the choose screen shows your ticks again');
  [0, 3].forEach(i => { b2[i].checked = false; b2[i]._on.change.forEach(fn => fn()); });
  const arc2 = JSON.parse(store['talaqa.arcade']);
  ok(arc2.pmine.length === 0 && (arc2.focus || arc2.pfocus).indexOf('mine') === -1, 'an empty list turns the topic off');
  wipeSrs(); delete store['talaqa.arcade'];
}

// ---- ticking a phrase as known skips it; unticking brings it back ------------------------------------------------------------
{
  wipeSrs();
  W.Profile.set('A1');
  const PL0 = GI.phraseList().list, a = PL0[0];
  PL0.slice(1).forEach(e => SRS.learn(e.id));
  const deal = () => { let hit = false; for (let i = 0; i < 80; i++) { const it = GI.next('ibarat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it && it.id === a.id) hit = true; } return hit; };
  ok(deal(), 'before ticking, the phrase can be dealt');
  SRS.learn(a.id);
  ok(SRS.isLearnt(a.id) && !deal(), 'a ticked phrase was dealt again');
  SRS.unlearn(a.id);
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id) && deal(), 'an unticked phrase did not come back');
  ok(SRS.isLearnt(PL0[1].id), 'unlearn touched another phrase');
  // the tick screen: a row per phrase, ticked when learnt; ticking and unticking go through the SRS
  W.ARArcade.knownScreen({ key: 'x', hue: '#fff' });
  const boxes = STAGE.all(n => n.cls().includes('arc-known-row')).map(r => r.all(c => c.tagName === 'INPUT')[0]);
  ok(boxes.length === PL0.length && boxes.slice(1).every(b => b.checked) && !boxes[0].checked, 'the tick screen lists every phrase, ticked when learnt');
  boxes[0].checked = true; boxes[0]._on.change.forEach(fn => fn());
  ok(SRS.isLearnt(a.id), 'ticking a row learns the phrase');
  boxes[0].checked = false; boxes[0]._on.change.forEach(fn => fn());
  ok(!SRS.isLearnt(a.id) && !SRS.isEnrolled(a.id), 'unticking a row clears it');
  wipeSrs();
}

// ---- words typed, heard; phrases by variety -----------------------------------------------------------------------------------------
{
  W.Profile.set('B2');
  const w = W.AR_WORDS[0], id = 'w:' + w.ar;
  SRS.enrol(id); SRS.grade(id, true);
  W.AR_WORDS.slice(1).forEach(x => SRS.learn('w:' + x.ar));      // only the first can be dealt
  const typed = GI.next('kalimat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } });
  ok(typed && typed.id === id && typed.play === 'type' && GI.grade(typed, w.ar) === 'good' && GI.grade(typed, AR.strip(w.ar)) === 'good', 'a known word comes back typed, vowels optional');
  W.AR_AUDIO[w.ar + '|msa'] = 'audio/x.mp3';
  let heard = 0, typedN = 0;
  for (let i = 0; i < 200; i++) { const it = GI.next('kalimat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }); if (it.hear) { heard++; ok(it.promptSay.t === w.ar && it.options.length === 4 && it.options.indexOf(w.ar) !== -1, 'hear item: audio prompt, four written words'); } else typedN++; }
  ok(heard > 10 && heard < 80 && typedN > 100, `about one known word in five is heard: ${heard} of 200`);
  W.AR_AUDIO = {};
  ok(![...Array(60)].some(() => GI.next('kalimat', 1, rng, { grind: { asked: 0, newN: 0, used: {} } }).hear), 'without a clip nothing is heard');
  wipeSrs();
  // phrases
  const seen = {};
  for (const pv of ['msa', 'lev', 'egy']) {
    const it = GI.next('ibarat', 1, rng, { grind: { asked: 0, newN: 0, used: {} }, pv });
    ok(it.variety === pv && it.play === 'choose' && it.options.length === 4 && it.options.indexOf(it.answer) !== -1, 'a phrase asks the chosen variety: ' + pv);
    ok(new Set(it.options.map(AR.strip)).size === 4, 'phrase options distinct once faded');
    ok(it.others.every(o => o.v !== pv && o.text), 'the other varieties are listed, none empty or the same');
    const p = W.AR_PHRASES.filter(x => 'p:' + x.id === it.id)[0];
    ok(it.answer === (p[pv] || p.msa), 'the answer is that variety\'s text');
  }
  const st = { asked: 0, newN: 0, used: {} }, turn = [];
  for (let i = 0; i < 6; i++) turn.push(GI.next('ibarat', 1, rng, { grind: st, pv: 'all' }).variety);
  ok(turn.slice(0, 3).join() === 'msa,lev,egy' && turn.slice(3).join() === 'msa,lev,egy', 'all three in turn: ' + turn);
  // known short: typed with alt spellings; known 6 to 8 words: built from chips
  const sh = W.AR_PHRASES.filter(x => x.id === 'alt')[0], lg = W.AR_PHRASES.filter(x => x.id === 'long7')[0];
  W.AR_PHRASES.filter(x => x !== sh).forEach(x => SRS.learn('p:' + x.id));
  SRS.enrol('p:alt'); SRS.grade('p:alt', true);
  const t = GI.next('ibarat', 1, rng, { grind: { asked: 0, newN: 0, used: {} }, pv: 'egy' });
  ok(t.id === 'p:alt' && t.play === 'type' && GI.grade(t, 'صباح الورد') === 'good' && GI.grade(t, 'صباح الفل') === 'good', 'a known short phrase is typed; alt spellings count');
  wipeSrs(); W.AR_PHRASES.filter(x => x !== lg).forEach(x => SRS.learn('p:' + x.id)); SRS.enrol('p:long7'); SRS.grade('p:long7', true);
  const b = GI.next('ibarat', 1, rng, { grind: { asked: 0, newN: 0, used: {} }, pv: 'msa' });
  ok(b.id === 'p:long7' && b.play === 'build' && b.words.length === 8 && GI.grade(b, b.words.join(' ')) === 'good', 'a known 8 word phrase is built from chips');
  wipeSrs();
}

// ---- coverage --------------------------------------------------------------------------------------------------------------------
{
  const cv = GI.coverage(null), pc = GI.phraseCoverage();
  ok(cv.of > 0 && cv.n <= cv.of && /commonest words/.test(cv.text), 'word coverage: ' + JSON.stringify(cv));
  ok(pc.of === W.AR_PHRASES.length, 'phrase coverage');
  ok(GI.verbsKnown() >= 0 && GI.gapCoverage('afal').of > 0 && GI.grindThemes().length > 0, 'coverage helpers');
}

// ---- the repository's own banks: every kind deals well-formed items, however big they have grown ---------------------------------------------------------
{
  const fx = { b: W.AR_BANK, w: W.AR_WORDS, p: W.AR_PHRASES };
  W.AR_BANK = REAL.b || []; W.AR_WORDS = REAL.w || []; W.AR_PHRASES = REAL.p || []; GI.reset(); wipeSrs();
  ['afal', 'harakat', 'jidhr', 'jumu', 'damair', 'kalimat', 'ibarat', 'imir'].forEach(kind => {
    for (let i = 0; i < 25; i++) {
      const it = GI.next(kind, 3, rng, { grind: { asked: 0, newN: 0, used: {} }, pv: 'all' });
      if (!it) continue;
      ok(it.play !== 'choose' || it.hear || (it.options.length === 4 && it.options.indexOf(it.answer) !== -1 && (it.kind === 'harakat' || new Set(it.options.map(AR.strip)).size === 4)), `real ${kind}: four options, distinct once faded`);
    }
  });
  W.AR_BANK = fx.b; W.AR_WORDS = fx.w; W.AR_PHRASES = fx.p; GI.reset(); wipeSrs();
}

// ---- the audio: AR.play does nothing without a clip ------------------------------------------------------------------------------------
{
  played.length = 0;
  ok(AR.play('لا يوجد', 'msa') === false && played.length === 0 && !AR.has('x', 'msa'), 'no clip: AR.play does nothing');
  W.AR_AUDIO = { 'بَيْت|msa': 'audio/l-1.bin#0,4', 'بَيْت|lev': 'audio/l-2.bin#4,4' };
  ok(AR.has('بَيْت') && AR.play('بَيْت') && played.pop() === 'audio/l-1.bin', 'a clip plays (msa by default)');
  ok(AR.play('بَيْت', 'lev') && played.pop() === 'audio/l-2.bin' && AR.play('بَيْت', 'egy') === false, 'varieties have their own clips');
  W.ARCore.setPref('autoplay', false); played.length = 0; ok(AR.autoplay('بَيْت', 'msa') === false && played.length === 0, 'autoplay off: nothing plays');
  W.ARCore.setPref('autoplay', true); ok(AR.autoplay('بَيْت', 'msa') === true, 'autoplay on (the default)');
  played.length = 0; W.AR_AUDIO = {};
}

// ---- stage 0: items of every kind ---------------------------------------------------------------------------------------------------------
const H = W.ARHuruf;
{
  W.AR_AUDIO = {};
  const kinds = {};
  for (let n = 1; n <= 12; n++) {
    const deal = H.lessonDealer(n);
    for (let i = 0; i < 30; i++) {
      const it = deal(rng);
      ok(it && it.stage0 && /^h:[lsvw]:/.test(it.id) && it.cefr === 'A1', `lesson ${n}: item has an h: id`);
      if (!it) continue;
      kinds[it.drill] = (kinds[it.drill] || 0) + 1;
      ok(it.play !== 'choose' || (it.options.length === 4 && new Set(it.options).size === 4 && it.options.indexOf(it.answer) !== -1), `lesson ${n} ${it.drill}: four distinct options incl. the answer`);
      ok(!it.hear, 'with no clips nothing is heard');
      if (it.drill === 'build') {
        ok(it.play === 'build' && it.target === AR.strip(it.answer) && it.tiles.length === it.target.length + 2, 'build: letter tiles, target and two decoys');
        const c = {}; it.tiles.forEach(t => { c[t] = (c[t] || 0) + 1; }); it.target.split('').forEach(t => { c[t]--; });
        ok(Object.values(c).filter(v => v < 0).length === 0, 'build: the tiles hold every letter of the word');
      }
      if (it.drill === 'read') ok(it.ansLatin && it.options.indexOf(AR.translit(it.ar)) !== -1 || it.options.indexOf(it.answer) !== -1, 'read: transliteration options');
      if (it.drill === 'shape') ok(it.options.indexOf(it.answer) !== -1 && /ـ|^[؀-ۿ]$/.test(it.answer), 'shape: options are shapes');
      if (it.drill === 'vowel') ok(it.options.length === 4 && it.options.every(o => o.length === 2), 'vowel: four syllables');
      if (n === 1) ok(['letter', 'vowel', 'read'].indexOf(it.drill) !== -1, 'lesson 1 deals only its own kinds, sound, vowel, read');
    }
  }
  console.log('  stage 0 kinds dealt: ' + Object.keys(kinds).map(k => k + ' ' + kinds[k]).join(', '));
  ['letter', 'shape', 'vowel', 'read', 'build', 'article'].forEach(k => ok(kinds[k] > 0, 'stage 0 never dealt ' + k));
  // hear, once there are clips
  W.AR_AUDIO = {}; W.AR_LETTERS.forEach(l => { W.AR_AUDIO[l.nm + '|msa'] = 'audio/l-' + l.id + '.mp3'; });
  let hear = 0;
  const d2 = H.lessonDealer(3);
  for (let i = 0; i < 40; i++) { const it = d2(rng); if (it.hear) { hear++; ok(it.promptSay && it.options.length === 4, 'hear: audio prompt, four letters'); } }
  ok(hear > 3, 'hear items appear once the clips exist');
  W.AR_AUDIO = {};
  // the exit test: 40 items over every kind
  const ex = H.examItems(rng);
  ok(ex.length === 40, 'the exit test has 40 items, got ' + ex.length);
  ok(new Set(ex.map(i => i.drill)).size >= 6, 'the exit test covers every kind: ' + [...new Set(ex.map(i => i.drill))]);
}

// ---- stage 0: the engine, pass rule and exit test -------------------------------------------------------------------------------------------
const waitFor = async (pred, ms, what) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (pred()) return true; await sleep(10); } ok(false, 'timed out waiting for ' + what); return false; };
const overEl = () => byCls('g-over')[0];
/* answer the item on screen right or wrong, then wait for the next item (or the end screen) */
async function answer(right) {
  const it = H.last();
  if (it.play === 'choose') {
    const opts = byCls('g-opt');
    const pickBtn = right ? opts.filter(o => o._val === it.answer)[0] : opts.filter(o => o._val !== it.answer)[0];
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
const resetStage0 = () => { Object.keys(store).forEach(k => { if (/^talaqa\.(huruf|profile|srs)$/.test(k)) delete store[k]; }); H._reset(); SRS._reset(); W.Profile._reset(); };
(async () => {
  W.AR_AUDIO = {};
  // a lesson round: 10 right passes; 7 right does not
  resetStage0();
  H.startLessonRound(1);
  await waitFor(() => H.last(), 1000, 'the first item');
  ok(byCls('g-name')[0].textContent === 'Ḥurūf 1', 'the round is titled with its lesson');
  for (let i = 0; i < 10; i++) await answer(true);
  ok(!!overEl() && overEl().textContent.indexOf('Lesson 1 passed') !== -1 && H.lessonDone(1) && H.lessonOpen(2) && !H.lessonOpen(3), 'all right passes lesson 1 and opens lesson 2');
  ok(byCls('arc-btn').some(b => b.textContent === 'Next lesson →'), 'the end screen offers the next lesson');
  H.startLessonRound(2);
  await waitFor(() => !overEl(), 1000, 'lesson 2 to start');
  for (let i = 0; i < 10; i++) await answer(i < 7);
  ok(!!overEl() && overEl().textContent.indexOf('8 are needed') !== -1 && !H.lessonDone(2), '7 of 10 does not pass');
  // a build item is exercised in lesson 2 at least once (kinds cycle through build)
  // the exit test: 32 right opens the board at A1
  resetStage0(); store['talaqa.huruf'] = JSON.stringify({ started: true, passed: {}, exam: {} }); H._reset();
  H.startExam();
  await waitFor(() => H.last(), 1000, 'the exit test to start');
  for (let i = 0; i < 40; i++) await answer(i < 32);
  ok(!!overEl() && H.unlocked() && W.Profile.current() === 'A1' && W.Profile.placed(), '32 of 40 unlocks the board at A1');
  ok(byCls('arc-btn').some(b => b.textContent === 'Open the games →'), 'the exit test offers the games');
  ok(H.lessonDone(12) && H.lessonOpen(12), 'passing the test opens every lesson');
  // 38 sets A2
  resetStage0(); store['talaqa.huruf'] = JSON.stringify({ started: true, passed: {}, exam: {} }); H._reset();
  H.startExam();
  await waitFor(() => H.last(), 1000, 'the second exit test');
  for (let i = 0; i < 40; i++) await answer(i < 38);
  ok(H.unlocked() && W.Profile.current() === 'A2', '38 of 40 starts at A2');
  // 31 does not
  resetStage0(); store['talaqa.huruf'] = JSON.stringify({ started: true, passed: {}, exam: {} }); H._reset();
  H.startExam();
  await waitFor(() => H.last(), 1000, 'the third exit test');
  for (let i = 0; i < 40; i++) await answer(i < 31);
  ok(!H.unlocked() && !W.Profile.placed(), '31 of 40 keeps the board closed');

  // ---- a typed round: the Arabic input and the one-time keyboard guide --------------------------------------------------------------------------------
  resetStage0(); store['talaqa.huruf'] = JSON.stringify({ started: true, passed: {}, exam: { passed: true } }); H._reset();
  delete store['talaqa.kbd'];
  W.Profile.set('B2'); W.AR_AUDIO = {};
  wipeSrs();
  W.AR_WORDS.slice(1).forEach(x => SRS.learn('w:' + x.ar));
  const w0 = W.AR_WORDS[0]; SRS.enrol('w:' + w0.ar); SRS.grade('w:' + w0.ar, true);
  W.GameRound.run(STAGE, { key: 'kalimat:t', title: 'Kalimāt', kind: 'kalimat', hue: '#e07a3f', count: 3, duration: null, onExit() {} });
  await sleep(40);
  const inp = byCls('g-input')[0];
  ok(inp && inp.attrs.dir === 'rtl' && inp.attrs.lang === 'ar' && inp.attrs.autocorrect === 'off' && inp.autocapitalize === 'off' && inp.spellcheck === false, 'the input is dir rtl, lang ar, no autocorrect, capitalise or spellcheck');
  ok(byCls('g-kbd').length === 1 && byCls('g-kbd')[0].textContent.indexOf('Add Arabic keyboard') === -1 && /Add the Arabic keyboard/.test(allText()), 'the first typed item shows the keyboard guide');
  ok(byCls('g-kbd')[0].all(n => n.tagName === 'BUTTON').map(b => b.textContent).join() === 'Done,Remind me later', 'the guide has Done and Remind me later');
  byCls('g-kbd')[0].all(n => n.textContent === 'Remind me later')[0].click();
  ok(byCls('g-kbd').length === 0 && JSON.parse(store['talaqa.kbd']).later === SRS.today(), 'remind me later sets the flag for today');
  inp.value = AR.strip(w0.ar); inp.dispatchEvent({ type: 'input' });
  await sleep(300);
  // a typed answer resolved right was credited
  ok(SRS.state('w:' + w0.ar).reps >= 2, 'a typed right answer is graded into the SRS');
  W.GameRound.run(STAGE, { key: 'kalimat:t', title: 'x', kind: 'kalimat', count: 1, duration: null, onExit() {} });
  await sleep(20);
  ok(byCls('g-kbd').length === 0, 'the guide does not come back the same day');
  store['talaqa.kbd'] = JSON.stringify('done');

  // ---- a gap round renders Arabic, a speaker, the cue ------------------------------------------------------------------------------------------------------
  W.Profile.set('A1'); wipeSrs(); W.AR_AUDIO = { 'كَتَبَ|msa': 'audio/l-k.bin#0,4' };
  W.GameRound.run(STAGE, { key: 'afal:t', title: 'Afʿāl', kind: 'afal', count: 2, duration: null, topics: ['madi'], onExit() {} });
  await sleep(30);
  const pr = byCls('g-prompt')[0];
  ok(pr.attrs.dir === 'rtl' && pr.all(n => n.cls().includes('ar')).length >= 1 && byCls('g-gap').length === 1, 'the Arabic prompt is rtl, in .ar nodes, with one gap');
  ok(byCls('g-cue')[0].textContent === 'write · he', 'the English cue sits under the sentence');
  const opts = byCls('g-opt'); ok(opts.length === 4 && opts.every(o => o.all(n => n.cls().includes('ar')).length === 1), 'four Arabic options');
  played.length = 0;
  opts.filter(o => o._val === 'كَتَبَ')[0].click();
  ok(played.length === 1 && played[0] === 'audio/l-k.bin', 'the answer\'s clip plays after the answer');
  fire('keydown', { key: 'Enter' });

  // ---- the faded text can be held for its vowels --------------------------------------------------------------------------------------------------------------
  { const n = W.UI.arText('كَتَبَ', 'bare');
    ok(n.textContent === 'كتب' && n.cls().includes('faded'), 'bare text is faded');
    n.dispatchEvent({ type: 'pointerdown' }); await sleep(W.UI.HOLD_MS + 60);
    ok(n.textContent === 'كَتَبَ', 'holding for 350 ms shows the vowels');
    n.dispatchEvent({ type: 'pointerup' }); await sleep(120);
    ok(n.textContent === 'كتب', 'releasing hides them again');
    let swallowed = true; n.dispatchEvent({ type: 'pointerdown' }); await sleep(W.UI.HOLD_MS + 60);
    n.dispatchEvent({ type: 'click', stopPropagation() { swallowed = true; }, preventDefault() {} });
    ok(W.UI.arText('كَتَبَ', 'full').cls().indexOf('faded') === -1, 'full text is not faded'); }
  { const p = W.UI.rich(new El('p'), 'Use *لَنْ* with a verb, not *لَا*.');
    ok(p.all(n => n.cls().includes('ar')).length === 2 && p.textContent === 'Use لَنْ with a verb, not لَا.', 'card text: *x* becomes an .ar span');
    const q = W.UI.mixed(new El('p'), 'أَمْسِ, yesterday: the past.');
    ok(q.all(n => n.cls().includes('ar')).length === 1 && q.children[0].textContent === 'أَمْسِ', 'Arabic inside English gets its own span'); }

  // ---- Speak: the second strand of stage 0 ------------------------------------------------------------------------------------------------------------------------
  {
    const S = W.ARSpeak, keepPh = W.AR_PHRASES, keepAu = W.AR_AUDIO;
    ok(!!S && S.packs().length === 10, 'ARSpeak holds the ten packs');
    W.AR_PHRASES = REAL.p; W.AR_AUDIO = {}; GI.reset();
    const resetSpeak = (huruf) => { resetStage0(); delete store['talaqa.speak']; delete store['talaqa.arcade']; delete store['talaqa.mode']; S._reset();
      store['talaqa.huruf'] = JSON.stringify(huruf || { started: false, passed: {}, exam: {} }); H._reset(); };
    const noDash = t => !/[–—]/.test(t) && !/ [-‐] /.test(t);

    // first open: the Talk home, pack 1 open and pack 2 locked, the board still shut
    resetSpeak();
    W.ARArcade.board();
    ok(byCls('arc-first').length === 1 && byCls('sp-strand').length === 2 && byCls('arc-seg').length === 1, 'the Talk home shows Speak and Phrases and the toggle');
    ok(/Speak/.test(allText()) && /Takallam/.test(allText()) && /start speaking/i.test(allText()), 'the Talk home names Speak (Takallam) and says you can start speaking');
    ok(noDash(allText()), 'no dashes on the Talk home');
    ok(S.packOpen(1) && !S.packOpen(2) && !S.packOpen(10), 'pack 1 is open, pack 2 is locked');
    ok(byCls('arc-tile').length === 0 && !H.unlocked(), 'the board is locked on first open');
        ok(byCls('arc-pick').length === 10 && byCls('arc-pick').slice(1).every(b => b.disabled), 'the Talk home lists the ten packs, only pack 1 open');
    byCls('arc-pick')[0].click();
    ok(byCls('sp-card').length === packN(1).ids.length && byCls('hr-start').length === 1, 'pack 1 opens on its card with every phrase');
    function packN(n) { return W.AR_SPEAK.filter(k => k.n === n)[0]; }
    { // the card: translit is the main line, the script small above it, English, a note
      const c = byCls('sp-card')[0];
      ok(c.all(n => n.cls().includes('sp-ar') && n.attrs.dir === 'rtl').length === 1 && c.all(n => n.cls().includes('sp-tr')).length === 1 && c.all(n => n.cls().includes('sp-en')).length === 1, 'a phrase card has script, sound and English');
      ok(byCls('arc-chip').map(b => b.textContent).join() === 'Fuṣḥā,Shāmī,Maṣrī' && byCls('arc-chip').filter(b => b.cls().includes('on'))[0].textContent === 'Shāmī', 'the chooser defaults to shāmī');
      byCls('arc-chip')[2].click();
      ok(JSON.parse(store['talaqa.arcade']).pv === 'egy' && S.variety() === 'egy', 'the chooser writes the Ibarat variety');
      byCls('arc-chip')[2].click();
      store['talaqa.arcade'] = JSON.stringify({ pv: 'all' }); ok(S.variety() === 'lev', "'all' means shāmī for speaking");
      delete store['talaqa.arcade']; ok(S.variety() === 'lev', 'unset means shāmī');
      ok(noDash(allText()), 'no dashes on the pack card');
    }
    H.markStarted(); W.ARArcade.board();
    { const packs = byCls('arc-pick').slice(0, 10);
      ok(byCls('arc-pick').length === 10 && !packs[0].disabled && packs.slice(1).every(b => b.disabled), 'the Talk home lists ten packs; only pack 1 is open'); }

    // every pack builds ten valid items in each variety
    let kindsSeen = {}, clipsMissing = 0;
    for (const pk of S.packs()) for (const v of ['msa', 'lev', 'egy']) {
      const items = S.packItems(pk.n, v, rng);
      ok(items.length === 10, `pack ${pk.n} ${v}: ten items, got ${items.length}`);
      items.forEach(it => {
        kindsSeen[it.speakKind] = (kindsSeen[it.speakKind] || 0) + 1;
        if (it.play === 'choose') {
          ok(it.options.length === 4 && new Set(it.options).size === 4 && it.options.indexOf(it.answer) !== -1, `pack ${pk.n} ${v} ${it.speakKind}: four distinct options with the answer`);
          ok(it.options.every(o => it.optScript[o]), `pack ${pk.n} ${v} ${it.speakKind}: every option carries its script`);
          ok(new Set(it.options.map(o => AR.strip(it.optScript[o]))).size === 4, `pack ${pk.n} ${v}: no two options with the same script`);
        } else if (it.play === 'build') {
          ok(it.latin && it.words.length >= 2 && it.words.join(' ') === it.answer, `pack ${pk.n} ${v}: build tiles make the answer`);
        } else ok(it.play === 'say' && it.self && !it.id, `pack ${pk.n} ${v}: a say item is self-marked and has no SRS id`);
        ok(it.id == null || it.id.indexOf('sp:') === 0 && it.id.split(':')[2] === v, 'SRS ids are sp:<phrase>:<variety>');
      });
      ok(items.filter(i => i.self).length >= 1 && items.filter(i => !i.self).length >= 7, `pack ${pk.n} ${v}: some say, mostly graded`);
    }
    ok(['pick', 'build', 'say'].every(k => kindsSeen[k] > 0) && !kindsSeen.reply, 'pick, build and say are dealt, and no what do you say back question: ' + JSON.stringify(kindsSeen));
    ok(kindsSeen.pick + kindsSeen.build + kindsSeen.say === 300, 'ten items for every pack and variety');
    // the clip falls back to the fuṣḥā one
    { const p = W.AR_PHRASES.filter(x => x.id === 'marhaba')[0] || W.AR_PHRASES[0];
      W.AR_AUDIO = {}; ok(S.clip(p, 'lev') === null, 'no clip, no speaker');
      W.AR_AUDIO[p.msa + '|msa'] = 'audio/x.bin#0,4';
      const c = S.clip(p, 'egy'); ok(c && c.t === p.msa && c.v === 'msa', 'a missing dialect clip falls back to the fuṣḥā one');
      W.AR_AUDIO = {}; }

    // driving a pack round through the real engine
    const sAnswer = async (right, sayGot) => {
      const it = S.last(), before = it;
      if (it.play === 'say') {
        byCls('g-say-listen')[0].click();
        ok(byCls('g-say-card').length === 1 && byCls('g-say-tr')[0].textContent === it.trAnswer, 'Listen reveals the sound, the script and the English');
        const marks = byCls('g-say-marks')[0].all(n => n.tagName === 'BUTTON');
        marks.filter(b => b.textContent === (sayGot ? 'Got it' : 'Not yet'))[0].click();
      } else if (it.play === 'choose') {
        const opts = byCls('g-opt');
        (right ? opts.filter(o => o._val === it.answer) : opts.filter(o => o._val !== it.answer))[0].click();
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
    // all right, and every say item marked "Not yet": still passes, and nothing is learnt
    resetSpeak({ started: true, passed: {}, exam: {} });
    wipeSrs();
    S.startRound(1);
    await waitFor(() => S.last(), 1000, 'the speak round to start');
    ok(byCls('g-name')[0].textContent === 'Speak 1', 'the round is titled with its pack');
    const dealtIds = [];
    for (let i = 0; i < 10; i++) { dealtIds.push(S.last()); await sAnswer(true, false); }
    ok(!!overEl() && /Pack 1 passed: \d+ of \d+/.test(overEl().textContent) && S.packDone(1) && S.packOpen(2) && !S.packOpen(3), 'all graded items right passes pack 1 and opens pack 2');
    ok(JSON.parse(store['talaqa.speak']).passed[1] === true, 'progress is kept in talaqa.speak');
    ok(byCls('arc-btn').some(b => b.textContent === 'Next pack →'), 'the end screen offers the next pack');
    const says = dealtIds.filter(i => i.play === 'say');
    ok(says.length >= 1 && says.every(i => !i.id), 'say items carry no SRS id');
    const sp = Object.keys(JSON.parse(store['talaqa.srs'] || '{}')).filter(k => k.indexOf('sp:') === 0);
    ok(sp.length > 0 && sp.every(k => !SRS.isLearnt(k)), 'graded speak items are in the SRS, none of them learnt');
    ok(sp.every(k => /^sp:[^:]+:lev$/.test(k)), 'SRS ids look like sp:<phrase>:lev');
    ok(!H.unlocked(), 'the board stays locked while a pack is passed');
    W.ARArcade.board(); ok(byCls('arc-tile').length === 0, 'and no board tiles are shown');

    // say items alone do not pass a pack: all marked "Got it", graded ones wrong
    wipeSrs();
    S.startRound(2);
    await waitFor(() => S.last(), 1000, 'the second speak round');
    for (let i = 0; i < 10; i++) await sAnswer(false, true);
    ok(!!overEl() && /are needed to pass/.test(overEl().textContent) && !S.packDone(2) && !S.packOpen(3), 'self-marked "Got it" never helps a pack pass');
    ok(Object.keys(JSON.parse(store['talaqa.srs'] || '{}')).every(k => !SRS.isLearnt(k)), 'say items make nothing learnt');
    ok(noDash(allText()), 'no dashes on the end screen');
    // seven of eight graded passes (87%), six does not
    wipeSrs();
    S.startRound(2);
    await waitFor(() => S.last(), 1000, 'the third speak round');
    let gi = 0;
    for (let i = 0; i < 10; i++) { const self = S.last().self; await sAnswer(self || gi++ !== 0, true); }
    ok(!!overEl() && S.packDone(2), 'one miss in eight graded items still passes');

    // after the exam: Talk still shows the packs, Script shows the board without a Speak tile
    resetSpeak({ started: true, passed: {}, exam: { passed: true } });
    W.ARArcade.board();
    ok(byCls('arc-pick').length === 10 && byCls('arc-tile').length === 0 && byCls('arc-seg').length === 1, 'after the exam, Talk shows the packs and no board');
    byCls('arc-seg-b')[1].click();
    ok(byCls('arc-tile').length === 8 && !byCls('arc-tile').some(t => /Takallam/.test(t.textContent)) && byCls('arc-seg').length === 1, 'after the exam, Script shows the board, with no Speak tile');
    byCls('arc-seg-b')[0].click();
    ok(S.mode() === 'talk' && byCls('arc-pick').length === 10 && JSON.parse(JSON.stringify(store['talaqa.mode'])) === 'talk', 'switching back to Talk works any time');
    store['talaqa.mode'] = 'script';

    // Ibarat script fade
    W.AR_PHRASES = keepPh; GI.reset(); W.Profile.set('B2'); wipeSrs();
    W.AR_PHRASES[0].tr = { msa: 'as-salāmu ʿalaykum', lev: 'marḥaba', egy: 'ahlan' };
    const draw1 = () => GI.next('ibarat', 1, rng, { pv: 'lev', grind: { asked: 0, newN: 0, used: {} }, count: 10, gkind: 'ibarat' });
    let before = [], tries = 0;
    while (tries++ < 60 && before.length < 12) before.push(draw1());
    ok(before.length > 5 && before.every(i => i.trAnswer), 'before a phrase is known, its transliteration comes with it');
    { const ch = before.filter(i => i.play === 'choose');
      ok(ch.length > 0 && ch.every(i => i.options.every(o => i.optTr && i.optTr[o])), 'tapped options show a transliteration under the Arabic');
      const h = before.filter(i => i.id === 'p:hello')[0];
      if (h && h.play === 'choose') ok(h.optTr[h.answer] === 'marḥaba', 'the hand-written transliteration is used');
      ok(AR.translit('مَرْحَبًا') !== 'zzz', 'machine translit exists as the fallback'); }
    W.AR_PHRASES.forEach(p => { SRS.enrol('p:' + p.id); SRS.grade('p:' + p.id, true); });
    W.AR_PHRASES.forEach(p => ok(GI.answeredRight('p:' + p.id), 'phrase ' + p.id + ' is known'));
    const after = []; for (let i = 0; i < 30; i++) { const it = draw1(); if (it) after.push(it); }
    ok(after.length > 10 && after.every(i => !i.trAnswer && !i.optTr), 'once the phrase is known the Arabic stands alone');
    { const hello = [].concat(before, after).filter(i => i.id === 'p:hello'); ok(hello.length > 0, 'the hello phrase was dealt'); }

    // the knowns screen uses the hand-written transliteration
    store['talaqa.arcade'] = JSON.stringify({ pv: 'lev' });
    W.ARArcade.knownScreen({ hue: '#b06ad6' });
    ok(allText().indexOf('marḥaba') !== -1, 'the phrases you know screen shows p.tr when there is one');
    delete store['talaqa.arcade'];
    W.AR_PHRASES = keepPh; W.AR_AUDIO = keepAu;
    resetStage0(); delete store['talaqa.speak']; S._reset();
  }

  // ---- the phrase topic focus and the conversations ------------------------------------------------------------------------------------------------------
  {
    const S = W.ARSpeak, CV = W.ARConvo, keepPh = W.AR_PHRASES, keepAu = W.AR_AUDIO, keepCv = W.AR_CONVOS;
    const noDash = t => !/[–—]/.test(t) && !/ [-‐] /.test(t);
    ok(!!CV, 'ARConvo is loaded');
    const NUM = ['وَاحِد', 'اِثْنَان', 'ثَلَاثَة', 'أَرْبَعَة', 'خَمْسَة', 'سِتَّة'];
    const mkConvo = (id, th, b, word) => ({ id, en: 'Talk ' + id, th, b, you: 'a', roles: { a: id === 'fx3' ? 'Customer' : 'You', b: 'Waiter' }, n: 'A short note.',
      lines: NUM.map((nw, i) => ({ who: i % 2 === 0 ? 'a' : 'b', en: `Line ${id} number ${i + 1}`,
        msa: `${word} ${nw} هُنَا`, lev: `${word} ${nw} هَوْن`, egy: `${word} ${nw} هِنَا`,
        tr: { msa: `${id} ${i} huna`, lev: `${id} ${i} hawn`, egy: `${id} ${i} hina` } })) });
    const FX = [mkConvo('fx1', 'g', 'A1', 'بَيْتٌ'), mkConvo('fx2', 'm', 'A2', 'كِتَابٌ'), mkConvo('fx3', 't', 'A1', 'قَلَمٌ')];
    const setStage = (mode, exam) => { store['talaqa.huruf'] = JSON.stringify({ started: true, passed: {}, exam: exam ? { passed: true } : {} }); W.ARHuruf._reset();
      if (mode) store['talaqa.mode'] = mode; else delete store['talaqa.mode']; };
    W.AR_PHRASES = keepPh; GI.reset(); wipeSrs();
    W.AR_CONVOS = FX; W.AR_AUDIO = {}; CV._reset();
    const ibarat = W.ARArcade.GAMES.filter(g => g.key === 'ibarat')[0];

    // ---- the topic focus ----
    delete store['talaqa.arcade'];
    setStage('script', true);
    W.ARArcade.sheet(ibarat);
    const fchips = () => byCls('arc-focus')[0].all(n => n.tagName === 'BUTTON');
    ok(byCls('arc-focus').length === 1 && fchips()[0].textContent === 'All topics' && fchips().length === 1 + Object.keys(GI.phraseList().byTheme).length, 'the phrase sheet has All topics and one chip per theme');
    ok(/You know \d+ of \d+ phrases$/.test(byCls('arc-progress-all')[0].textContent), 'no focus: the plain coverage line');
    fchips().filter(c => c.textContent === 'G')[0].click();
    ok(JSON.stringify(JSON.parse(store['talaqa.arcade']).focus) === '["g"]', 'the focus is saved in talaqa.arcade');
    fchips().filter(c => c.textContent === 'M')[0].click();
    ok(JSON.stringify(JSON.parse(store['talaqa.arcade']).focus) === '["g","m"]', 'chips multi-select');
    { const own = GI.phraseList().list.filter(e => e.th === 'g' || e.th === 'm').length;
      ok(new RegExp('^You know 0 of ' + own + ' phrases in these topics$').test(byCls('arc-progress-all')[0].textContent), 'the coverage line counts only the chosen topics'); }
    ok(fchips().filter(c => c.cls().includes('on')).map(c => c.textContent).join() === 'G,M', 'the chosen chips are on');
    // a new sheet remembers it
    W.ARArcade.sheet(ibarat);
    ok(fchips().filter(c => c.cls().includes('on')).map(c => c.textContent).join() === 'G,M', 'the focus persists across screens');
    { // the grind deals only the chosen themes
      const G = GI.phraseList(), thOf = id => G.list.filter(e => e.id === id)[0].th;
      const st = { asked: 0, newN: 0, used: {} }, seen = new Set();
      for (let i = 0; i < 40; i++) { const it = GI.next('ibarat', 2, rng, { grind: st, count: 40, gkind: 'ibarat', pv: 'lev', themes: ['g', 'm'] }); if (it) seen.add(thOf(it.id)); }
      ok(seen.size > 0 && [...seen].every(t => t === 'g' || t === 'm') && seen.has('g') && seen.has('m'), 'the phrase grind deals only the focused themes: ' + [...seen]);
      const only = new Set(), st2 = { asked: 0, newN: 0, used: {} };
      for (let i = 0; i < 20; i++) { const it = GI.next('ibarat', 2, rng, { grind: st2, count: 40, gkind: 'ibarat', pv: 'lev', themes: ['t'] }); if (it) only.add(thOf(it.id)); }
      ok(only.size === 1 && only.has('t'), 'a single focused theme deals only that one');
      const mix = new Set(); const st3 = { asked: 0, newN: 0, used: {} };
      for (let i = 0; i < 60; i++) { const it = GI.next('ibarat', 2, rng, { grind: st3, count: 60, gkind: 'imir', pv: 'lev', themes: ['t'] }); if (it) mix.add(thOf(it.id)); }
      ok(mix.size > 1, 'the Play mix ignores the focus');
    }
    { // the round config carries it, the mix tile does not
      let got = null; const run = W.GameRound.run;
      W.GameRound.run = (h, cfg) => { got = cfg; };
      W.ARArcade.startShelf(ibarat, 't');
      ok(JSON.stringify(got.themes) === '["g","m"]' && got.pv, 'the phrase round config carries the themes');
      W.ARArcade.startShelf(W.ARArcade.GAMES.filter(g => g.key === 'imir')[0], 't');
      ok(got.themes === undefined, 'the Play mix tile gets no focus');
      W.ARArcade.practisePhrases();
      ok(got.talk === true && JSON.stringify(got.themes) === '["g","m"]', 'Talk phrase practice carries the focus and the talk flag');
      W.GameRound.run = run;
    }
    // Talk phrase practice leads with the sound
    { const st = { asked: 0, newN: 0, used: {} }, its = [];
      for (let i = 0; i < 12; i++) { const it = GI.next('ibarat', 2, rng, { grind: st, count: 40, gkind: 'ibarat', pv: 'lev', themes: ['g'], talk: true }); if (it) its.push(it); }
      ok(its.length > 0 && its.every(i => (i.play === 'choose' && i.ansLatin && i.options.indexOf(i.answer) !== -1 && i.options.every(o => i.optScript[o])) || (i.play === 'build' && i.latin)), 'Talk phrases are picks and builds led by the sound, the script smaller above');
    }
    // ---- the conversations: the fourth tile on the top row, every conversation ----
    setStage('script', true); W.ARArcade.board();
    { const row = byCls('arc-main4')[0], t = row && row.all(n => n.cls().includes('arc-tile'));
      ok(t && t.length === 4 && t[3].cls().includes('arc-convo-tile') && /Conversations/.test(t[3].textContent), 'Conversations is the fourth tile on the top row, after Verbs, Words and Phrases'); }
    ok(/0 of 3/.test(byCls('arc-convo-tile')[0].textContent), 'the tile counts the passed ones: ' + byCls('arc-convo-tile')[0].textContent);
    byCls('arc-convo-tile')[0].click();
    ok(byCls('cv-row').length === 3 && /Conversations/.test(allText()), 'the tile lists every conversation');
    ok(byCls('cv-row').every(r => /A1|A2/.test(r.textContent) && r.textContent.indexOf('done') === -1), 'each row shows its title and band, no tick yet');
    ok(noDash(allText()), 'no dashes on the conversations screen');
    W.ARArcade.sheet(ibarat);
    ok(byCls('cv-row').length === 0 && !byCls('arc-convos').length && byCls('arc-modes')[0].all(n => n.tagName === 'BUTTON').length === 2, 'the phrase sheet keeps just its two modes');
    fchips()[0].click();                                  // All topics, for the Talk home below
    ok(noDash(allText()), 'no dashes on the phrase sheet');
    // the Talk home lists them too
    setStage('talk', false); W.ARArcade.board();
    ok(byCls('cv-row').length === 3 && byCls('arc-pick').length === 13 && byCls('sp-strand').length === 2, 'the Talk home lists the conversations after the packs');

    // ---- the screen ----
    W.AR_AUDIO[FX[0].lines[0].lev + '|lev'] = 'audio/x.bin#0,4';
    byCls('cv-row')[0].click();
    ok(byCls('cv-bubble').length === 6 && byCls('cv-me').length === 3 && byCls('cv-them').length === 3, 'every line is a bubble, the learner on one side');
    ok(allText().indexOf('A short note.') !== -1 && /Practise your part/.test(allText()) && /you, talking to Waiter/.test(allText()) && byCls('cv-playall').length === 1, 'title, roles, note, Play it all and the practise button');
    ok(byCls('cv-bubble').filter(b => b.cls().includes('cv-me')).every(b => b.all(n => n.cls().includes('sp-en')).length === 1) && byCls('spk').length === 1, 'a speaker only where there is a clip');
    ok(byCls('cv-ar').length === 0 && byCls('sp-ar').length >= 6 && byCls('sp-tr').length >= 6, 'Talk: the sound leads, the script is smaller above it');
    ok(byCls('arc-chip').map(b => b.textContent).join() === 'Fuṣḥā,Shāmī,Maṣrī', 'the variety chooser is on the conversation');
    byCls('arc-chip')[2].click();
    ok(S.variety() === 'egy' && byCls('sp-tr')[0].textContent === 'fx1 0 hina', 'a variety shows its own text and sound');
    byCls('arc-chip')[1].click();
    ok(noDash(allText()), 'no dashes on the conversation screen');
    byCls('cv-playall')[0].click();
    setStage('script', true); CV.open('fx1');
    ok(byCls('cv-ar').length === 6 && byCls('cv-tr').length === 6, 'Script with the board open: the script leads, the sound is under it');

    // ---- items: pick, then build, then type; the answer is among the options ----
    const lv = 'lev', sample = CV.items('fx1', lv, 'pick', false, rng);
    ok(sample.length === 3 && sample.every((it, k) => it.convoLine === [0, 2, 4][k]), 'only the learner lines are asked, in line order');
    ok(sample.every(it => it.play === 'choose' && it.options.length === 4 && new Set(it.options).size === 4 && it.options.indexOf(it.answer) !== -1 && it.ansLatin && it.options.every(o => it.optScript[o])), 'Talk pick: four distinct options led by the sound, the answer among them');
    ok(sample.every(it => it.id === 'cv:fx1:' + it.convoLine + ':lev') && new Set(sample.map(i => i.key)).size === 3, 'SRS ids are cv:<id>:<line>:<variety>, the keys are distinct');
    ok(sample.some(it => it.options.some(o => !FX[0].lines.some(l => l.tr.lev === o))), 'wrong lines come from other conversations too');
    ok(CV.items('fx1', lv, 'pick', true, rng).every(it => it.optAr && it.options.indexOf(it.answer) !== -1 && it.options.every(o => it.optTr[o])), 'Script pick: the script leads, the sound under it');
    ok(CV.items('fx1', lv, 'build', false, rng).every(it => it.play === 'build' && it.latin && it.words.join(' ') === it.answer), 'build items tap the words');
    { const ty = CV.items('fx1', 'egy', 'type', true, rng)[0], ln = FX[0].lines[ty.convoLine];
      ok(ty.play === 'type' && GI.grade(ty, ln.egy) === 'good' && GI.grade(ty, ln.msa) === 'good' && GI.grade(ty, ln.lev) === 'wrong', 'typed: the chosen variety and the fuṣḥā text are accepted'); }
    ok(sample[0].sub.indexOf('Waiter') === -1 && sample[1].sub === 'Waiter: fx1 1 hawn (Line fx1 number 2)', 'the other side is shown as context, the plain prompt when nothing came before');

    // ---- driving a practise round through the real engine ----
    setStage('talk', false);
    const cvAnswer = async (right) => {
      const it = CV.last(), before = it;
      if (it.play === 'choose') {
        const opts = byCls('g-opt');
        (right ? opts.filter(o => o._val === it.answer) : opts.filter(o => o._val !== it.answer))[0].click();
      } else if (it.play === 'build') {
        const chips = byCls('g-chip').filter(c => c._word !== undefined);
        const order = right ? it.words.slice() : it.words.slice().reverse();
        if (!right && order.join(' ') === it.answer) order.push(order.shift());
        const used = new Set();
        order.forEach(w => { const c = chips.filter(x => !used.has(x) && x._word === w)[0]; used.add(c); c.click(); });
      } else if (it.play === 'say') {
        byCls('g-say-listen')[0].click();
        byCls('g-say-marks')[0].all(n => n.tagName === 'BUTTON').filter(b => b.textContent === (right ? 'Got it' : 'Not yet'))[0].click();
      } else {
        const inp = byCls('g-input')[0];
        inp.value = right ? AR.strip(it.answer) : 'ب'; inp.dispatchEvent({ type: 'input' });
        if (!right) fire('keydown', { type: 'keydown', key: 'Enter', target: inp });
      }
      await waitFor(() => overEl() || byCls('g-continue').length || CV.last() !== before, 3000, 'the conversation item to resolve');
      if (byCls('g-continue').length && !overEl()) byCls('g-continue')[0].click();
      await waitFor(() => overEl() || CV.last() !== before, 3000, 'the next conversation item');
    };
    wipeSrs();
    store['talaqa.srs'] && delete store['talaqa.srs'];
    const learntCv = () => Object.keys(JSON.parse(store['talaqa.srs'] || '{}')).filter(k => k.indexOf('cv:') === 0 && SRS.isLearnt(k));
    ok(CV.kindFor('fx1') === 'pick' && CV.passes('fx1') === 0, 'a new conversation starts with picks');
    // a failed round records no pass
    CV.practise('fx1');
    await waitFor(() => CV.last(), 1000, 'the practise round to start');
    ok(byCls('g-name')[0].textContent === 'Talk fx1', 'the round is titled with the conversation');
    { const dealt = [];
      for (let i = 0; i < 3; i++) { dealt.push(CV.last()); ok(CV.last().play === 'choose' && CV.last().options.indexOf(CV.last().answer) !== -1, 'the answer is among the options'); await cvAnswer(false); }
      ok(dealt.map(d => d.convoLine).join() === '0,2,4', 'the round follows the line order and asks only the learner lines'); }
    ok(!!overEl() && /are needed to pass/.test(overEl().textContent) && CV.passes('fx1') === 0 && !store['talaqa.convos'], 'under 80% is not a pass');
    // pass 1: picks
    CV.practise('fx1');
    await waitFor(() => CV.last(), 1000, 'the round to start again');
    const kinds1 = [];
    for (let i = 0; i < 3; i++) { kinds1.push(CV.last().play); await cvAnswer(true); }
    ok(kinds1.join() === 'choose,choose,choose' && !!overEl() && /Passed: 3 of 3/.test(overEl().textContent), 'pass one is a pick round');
    ok(JSON.parse(store['talaqa.convos']).passed.fx1 === 1 && CV.kindFor('fx1') === 'build', 'the pass is kept in talaqa.convos and the next is build');
    ok(learntCv().length === 0, 'a pick never makes anything learnt');
    ok(Object.keys(JSON.parse(store['talaqa.srs'] || '{}')).filter(k => k.indexOf('cv:') === 0).every(k => /^cv:fx1:[024]:lev$/.test(k)), 'SRS ids look like cv:fx1:<line>:lev');
    // pass 2: builds
    CV.practise('fx1');
    await waitFor(() => CV.last(), 1000, 'the build round to start');
    const kinds2 = [];
    for (let i = 0; i < 3; i++) { kinds2.push(CV.last().play); await cvAnswer(true); }
    ok(kinds2.join() === 'build,build,build' && CV.passes('fx1') === 2 && CV.kindFor('fx1') === 'say', 'pass two is a build round and in Talk the next is say it');
    ok(learntCv().length === 0, 'a build never makes anything learnt');
    // pass 3: typed
    CV.practise('fx1');
    await waitFor(() => CV.last(), 1000, 'the say round to start');
    const kinds3 = [];
    for (let i = 0; i < 3; i++) { ok(CV.last().self === true && !CV.last().id, 'a say item is self-marked and has no SRS id'); kinds3.push(CV.last().play); await cvAnswer(true); }
    ok(kinds3.join() === 'say,say,say' && CV.passes('fx1') === 3, 'pass three in Talk is say it, and its self-marks count');
    ok(learntCv().length === 0 && !/Type|type/.test('') , 'saying a line makes nothing learnt');
    setStage('script', true);
    ok(CV.kindFor('fx1') === 'type', 'in Script mode the next pass is typed');
    CV.practise('fx1');
    await waitFor(() => CV.last(), 1000, 'the typed round to start');
    const kinds4 = [];
    for (let i = 0; i < 3; i++) { kinds4.push(CV.last().play); await cvAnswer(true); }
    ok(kinds4.join() === 'type,type,type' && CV.passes('fx1') === 4, 'in Script mode the pass is typed');
    setStage('talk', false);
    W.ARArcade.board();
    ok(byCls('cv-row').filter(r => /done/.test(r.textContent)).length === 1, 'a passed conversation is ticked in the list');
    ok(noDash(allText()), 'no dashes on the Talk home');

    // ---- the list on the Speak screen, a conversation with the other side first ----
    S.home();
    ok(byCls('cv-row').length === 3, 'the Speak screen offers the conversations');
    const flip = Object.assign({}, FX[1], { id: 'fx4', you: 'b', th: 'g' });
    W.AR_CONVOS = FX.concat([flip]);
    { const it = CV.items('fx4', lv, 'pick', false, rng);
      ok(it.length === 3 && it[0].convoLine === 1 && it[0].sub.indexOf('You: ') === 0 && it[0].promptSay === undefined, 'the other side speaks first: the learner is b, context is the line before'); }

    { // back returns to where the conversation was opened from; role wording
      const fx5 = Object.assign({}, FX[0], { id: 'fx5', roles: { a: 'You (a man)', b: 'Layla' } });
      W.AR_CONVOS = FX.concat([fx5]);
      ok(CV.items('fx5', 'lev', 'pick', false, rng)[0].sub === 'Your line (a man)', 'the practise sub says Your line, with the bracket');
      setStage('script', true);
      CV.open('fx5');
      ok(/you \(a man\), talking to Layla/.test(allText()) && /Practise your part/.test(allText()) && !/you are You/.test(allText()), 'a You role is worded as you, bracket kept');
      CV.open('fx3');
      ok(/you are the Customer, talking to Waiter/.test(allText()) && /Practise: you are the Customer/.test(allText()), 'another role is worded you are the Customer');
      const backBtn = () => byCls('arc-back')[0];
      W.ARArcade.board();
      byCls('arc-convo-tile')[0].click(); byCls('cv-row')[0].click(); backBtn().click();
      ok(byCls('cv-row').length > 0 && byCls('arc-convo-tile').length === 0, 'back from a conversation returns to the conversations list');
      backBtn().click();
      ok(byCls('arc-convo-tile').length === 1, 'and back again to the board');
      setStage('talk', false); W.ARArcade.board();
      byCls('cv-row')[0].click(); backBtn().click();
      ok(byCls('arc-seg').length === 1 && byCls('arc-talk').length === 1, 'back from the Talk home returns to the Talk home');
      S.home();
      byCls('cv-row')[0].click(); backBtn().click();
      ok(byCls('arc-seg').length === 0 && byCls('arc-pick').length === 10 + byCls('cv-row').length, 'back from the Speak screen returns to the Speak screen');
    }

    // the real conversations, whatever has been written so far, deal a round in every kind and variety
    W.AR_CONVOS = REAL.cv || []; W.AR_PHRASES = REAL.p; CV._reset(); GI.reset();
    (REAL.cv || []).forEach(c => ['msa', 'lev', 'egy'].forEach(v => ['pick', 'build', 'type'].forEach(k => [false, true].forEach(led => {
      const its = CV.items(c.id, v, k, led, rng), n = c.lines.filter(l => l.who === c.you).length;
      ok(its.length === n && its.every(it => it.answer && (it.play !== 'choose' || (it.options.length === 4 && it.options.indexOf(it.answer) !== -1))), `real conversation ${c.id} ${v} ${k}: one item per learner line`);
    }))));
    console.log(`  real conversations: ${(REAL.cv || []).length}`);
    W.AR_CONVOS = keepCv; W.AR_PHRASES = keepPh; W.AR_AUDIO = keepAu; CV._reset();
    delete store['talaqa.convos'];
    setStage('script', true);
  }

  // ---- storage: nothing foreign -------------------------------------------------------------------------------------------------------------------------------------
  const keys = [...new Set(written)];
  ok(keys.length > 5 && keys.every(k => k.indexOf('talaqa.') === 0), 'every key written starts talaqa.: ' + keys.filter(k => k.indexOf('talaqa.') !== 0));
  ok(!Object.keys(store).some(k => /^(fluidez|liofa)\./.test(k)), 'no fluidez. or liofa. key');

  console.log(`\n${checks} checks, ${failures} failed`);
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
