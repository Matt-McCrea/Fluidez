/* Node test for the Sound natural track (data/natural.js, js/natural.js). Run: node tools/test-natural.js
 * Every item has the schema (id, band, group, en, es, accept, why, node; stiff optional) and a unique id;
 * every es and every expanded accept passes LIB.match.matchTranslation against its own item; a stiff line
 * is never the es nor an accepted form, never passes the matcher except as a Peninsular form, and no
 * accepted form reads as the stiff line (js/natural.js checks a typed line against the stiff one first, so
 * that would fail a right answer); node ids are in data/graph.js; no dashes, no vosotros. Then the round:
 * items at or below the band and nothing below B1, ten a round, the ones not seen in 14 days first, vetoed
 * cards left out, the wrong "you" hint and the closing line. Last, the screen itself, driven through a DOM
 * shim: the stiff line is a try, a double miss and "I'm stuck" show the natural line and the why, every
 * item shown is enrolled as nat:<id> due in a day and stamped in fluidez.seen, the next round brings new
 * items, and below B1 the mode is a note. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

/* ---- the smallest DOM js/ui.js and js/natural.js touch (after tools/test-essay.js) */
class Node {
  constructor(tag) {
    this.tagName = String(tag || '').toUpperCase();
    this.children = []; this.parentNode = null; this._text = ''; this._html = ''; this.className = '';
    this.value = ''; this.readOnly = false; this.disabled = false; this.type = ''; this.title = ''; this._on = {};
    const self = this;
    this.classList = {
      add(c) { if (!self.cls().includes(c)) self.className = (self.className + ' ' + c).trim(); },
      remove(c) { self.className = self.cls().filter((x) => x !== c).join(' '); },
      contains(c) { return self.cls().includes(c); }
    };
  }
  cls() { return String(this.className || '').split(/\s+/).filter(Boolean); }
  get firstChild() { return this.children[0] || null; }
  appendChild(n) { n.parentNode = this; this.children.push(n); return n; }
  removeChild(n) { this.children = this.children.filter((c) => c !== n); n.parentNode = null; return n; }
  set innerHTML(v) { this._html = String(v); this._text = ''; this.children = []; }
  get innerHTML() { return this._html; }
  set textContent(v) { this._text = String(v); this._html = ''; this.children = []; }
  get textContent() { return this.children.length ? this.children.map((c) => c.textContent).join('') : (this._text || this._html.replace(/<[^>]*>/g, '')); }
  addEventListener(ev, fn) { (this._on[ev] = this._on[ev] || []).push(fn); }
  dispatchEvent(e) { (this._on[e.type] || []).forEach((fn) => fn(e)); return true; }
  focus() {}
  click() { if (this.onclick) this.onclick({ type: 'click' }); this.dispatchEvent({ type: 'click', preventDefault() {} }); }
  all(pred, out) { out = out || []; this.children.forEach((c) => { if (pred(c)) out.push(c); c.all(pred, out); }); return out; }
}
global.Event = class { constructor(t) { this.type = t; } };
global.document = { createElement: (t) => new Node(t), getElementById: () => null, querySelector: () => null };
const store = {};
global.localStorage = { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } };
global.window = { localStorage: global.localStorage };
function load(rel) { (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
window.LIB = globalThis.LIB;
['data/graph.js', 'data/natural.js', 'js/ui.js', 'js/natural.js'].forEach(load);

const M = window.LIB.match, NAT = window.NATURAL, N = window.Natural;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

const BANDS = ['B1', 'B2', 'C1'];
const GROUPS = ['verbs', 'anglicisms', 'colombia', 'connectors', 'register'];
const FIRST_BATCH = { verbs: 50, anglicisms: 40, colombia: 30, connectors: 20, register: 10 };
const DASH = /[—–]|\s-\s|^-\s|\s-$/m;
const VOSOTROS_WORD = /(^|[^a-záéíóúñ])(vosotr[oa]s|vuestr[oa]s?|os)(?![a-záéíóúñ])/i;
const VOSOTROS_VERB = /[a-záéíóúñ]+(áis|éis)(?![a-záéíóúñ])/i;   // habláis, coméis
const GRAPH_IDS = new Set(window.GRAPH.nodes.map((n) => n.id));
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ ]/g, ' ').replace(/\s+/g, ' ').trim();
const words = (s) => String(s).split(/\s+/).filter(Boolean).length;
const plain = (s) => String(s).replace(/\*/g, '');

ok(Array.isArray(NAT) && NAT.length > 0, 'window.NATURAL is a non-empty array');
const ids = new Set(), byGroup = {}, byBand = {}, grid = {};
let forms = 0, stiffs = 0;

NAT.forEach((it, i) => {
  const at = (it && it.id) || ('#' + i);
  ok(typeof it.id === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id), at + ': id must be a lowercase slug');
  ok(!ids.has(it.id), at + ': duplicate id'); ids.add(it.id);
  ok(BANDS.indexOf(it.band) >= 0, at + ': band must be B1, B2 or C1');
  ok(GROUPS.indexOf(it.group) >= 0, at + ': group must be one of ' + GROUPS.join(', '));
  ['en', 'es', 'why'].forEach((k) => ok(typeof it[k] === 'string' && it[k].trim(), at + ': needs ' + k));
  ok(Array.isArray(it.accept), at + ': accept must be an array');
  ok(it.node === null || (typeof it.node === 'string' && GRAPH_IDS.has(it.node)), at + ': node ' + it.node + ' is not in data/graph.js');
  ok(!('stiff' in it) || (typeof it.stiff === 'string' && it.stiff.trim()), at + ': stiff, when present, is a line');
  ok(((it.why || '').match(/\*/g) || []).length % 2 === 0, at + ': unbalanced * in why');
  ok(words(plain(it.why)) <= 32, at + ': why is one plain line, has ' + words(plain(it.why)) + ' words');
  byGroup[it.group] = (byGroup[it.group] || 0) + 1;
  byBand[it.band] = (byBand[it.band] || 0) + 1;
  grid[it.group + ' ' + it.band] = (grid[it.group + ' ' + it.band] || 0) + 1;

  let expanded = [];
  try { expanded = (it.accept || []).flatMap((a) => M.expandAccept(a)); } catch (e) { ok(false, at + ': accept pattern does not parse: ' + e.message); }
  const all = [it.es].concat(expanded);
  const text = [it.en, it.es, it.why, it.stiff || ''].concat(it.accept || [], expanded);
  text.forEach((s) => ok(!DASH.test(s), at + ': dash in "' + s + '"'));
  [it.es, it.stiff || ''].concat(expanded).forEach((s) => ok(!VOSOTROS_WORD.test(s) && !VOSOTROS_VERB.test(s), at + ': vosotros in "' + s + '"'));

  // every natural line passes the matcher against its own item
  all.forEach((v) => {
    forms++;
    const r = M.matchTranslation(v, { es: it.es, en: it.en, accept: it.accept });
    ok(r.pass, at + ': "' + v + '" does not pass its own item (' + (r.hint || 'no hint') + ', closest "' + r.closest + '")');
  });

  if (it.stiff) {
    stiffs++;
    ok(norm(it.stiff) !== norm(it.es), at + ': stiff equals es');
    ok(expanded.every((v) => norm(v) !== norm(it.stiff)), at + ': stiff is one of the accepted forms');
    const r = M.matchTranslation(it.stiff, { es: it.es, en: it.en, accept: it.accept });
    ok(!r.pass || r.variant === 'peninsular', at + ': the stiff line passes the matcher as "' + r.closest + '"');
    all.forEach((v) => ok(!N.isStiff(it, v), at + ': the accepted "' + v + '" reads as the stiff line'));
    ok(N.isStiff(it, it.stiff), at + ': the stiff line does not read as itself');
  }
});

// the first batch, by group
Object.keys(FIRST_BATCH).forEach((g) => ok((byGroup[g] || 0) >= FIRST_BATCH[g], g + ': ' + (byGroup[g] || 0) + ' items, the first batch has ' + FIRST_BATCH[g]));
// a B1 learner gets a round from every group
GROUPS.forEach((g) => ok((grid[g + ' B1'] || 0) >= 5, g + ': fewer than 5 items at B1'));

// ---- the round --------------------------------------------------------------
ok(!N.open('A1') && !N.open('A2') && N.open('B1') && N.open('B2') && N.open('C1'), 'open from B1 only');
ok(N.pool('A2', 'mixed').length === 0, 'nothing below B1');
ok(N.pool('B1', 'verbs').every((it) => it.band === 'B1' && it.group === 'verbs') && N.pool('B1', 'verbs').length === grid['verbs B1'], 'B1 verbs: the B1 verbs and only them');
ok(N.pool('B2', 'mixed').every((it) => it.band !== 'C1'), 'B2: nothing at C1');
ok(N.pool('C1', 'mixed').length === NAT.length && N.pool('C1').length === NAT.length, 'C1 mixed: every item');
ok(N.cardId(NAT[0]) === 'nat:' + NAT[0].id, 'card id is nat:<id>');

let seed = 7;
const rng = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
const verbs = N.pool('C1', 'verbs'), td = 20000;
let r1 = N.round(verbs, {}, td, rng);
ok(r1.length === N.ROUND && N.ROUND === 10, 'a round is ten');
ok(new Set(r1.map((x) => x.id)).size === r1.length, 'no item twice in a round');
// seen in the last 14 days goes behind the rest; seen 14 or more days ago counts as fresh again
const seen = {};
verbs.slice(0, verbs.length - 8).forEach((it, k) => { seen[N.cardId(it)] = td - (k % 14); });
verbs.slice(verbs.length - 8).forEach((it) => { seen[N.cardId(it)] = td - 30; });
const r2 = N.round(verbs, seen, td, rng);
ok(r2.slice(0, 8).every((it) => seen[N.cardId(it)] === td - 30), 'items not seen in 14 days come first');
ok(r2.slice(8).every((it) => td - seen[N.cardId(it)] === 13), 'then the ones seen longest ago');
seen[N.cardId(verbs[0])] = td - 14;
ok(N.round(verbs, seen, td, rng).slice(0, 9).some((it) => it.id === verbs[0].id), 'seen exactly 14 days ago is fresh');
ok(N.round(verbs.slice(0, 4), {}, td, rng).length === 4, 'a short group gives a short round');
window.Vetoed = { has: (id) => id === 'nat:v-me-da-igual' };
ok(!N.pool('C1', 'verbs').some((it) => it.id === 'v-me-da-igual') && N.pool('C1', 'verbs').length === verbs.length - 1, 'a vetoed card is left out');
delete window.Vetoed;

// ---- the wrong "you" gets its own hint ---------------------------------------
const byId = Object.fromEntries(NAT.map((it) => [it.id, it]));
[['r-bano', 'Disculpa, ¿me podrías decir dónde queda el baño?', 'tú'], ['r-vecino', 'Buenas tardes, ¿cómo estás?', 'tú'],
 ['r-correo', 'Te agradezco tu pronta respuesta.', 'tú'], ['r-musica', '¿Será que me haces el favor de bajarle un poquito a la música?', 'tú'],
 ['r-invitar', '¿Te gustaría venir a comer el sábado?', 'tú'], ['r-prestar', '¿Me presta el cargador?', 'usted'],
 ['r-favor-amigo', '¿Me hace el favor de recogerme el paquete?', 'usted']].forEach(([id, text, reg]) => {
  const it = byId[id];
  if (!it) { ok(false, id + ': missing'); return; }
  ok(!M.matchTranslation(text, it, { accents: 'lenient' }).pass, id + ': the other register passes: ' + text);
  const h = N.registerMiss(it, text);
  ok(!!h && h.indexOf('the ' + reg + ' form') >= 0, id + ': "' + text + '" gets the ' + reg + ' hint, got ' + JSON.stringify(h));
});
ok(N.registerMiss(byId['r-bano'], 'Disculpe, ¿dónde hay un baño?') === null, 'a usted miss with no tú word gets no register hint');
ok(N.registerMiss(byId['v-me-da-igual'], 'No me importa nada') === null, 'no register hint without a bracket');

// ---- the closing line -------------------------------------------------------
ok(N.summary(8, 10) === 'Eight of ten. The ones you missed come back in review.', 'summary 8/10: ' + N.summary(8, 10));
ok(N.summary(9, 10) === 'Nine of ten. The one you missed comes back in review.', 'summary 9/10: ' + N.summary(9, 10));
ok(N.summary(10, 10) === 'Ten of ten. They all come back in review.', 'summary 10/10: ' + N.summary(10, 10));
ok(N.summary(0, 4) === 'Zero of four. The ones you missed come back in review.', 'summary 0/4: ' + N.summary(0, 4));

// ---- the screen, driven -----------------------------------------------------
ok(new Set(NAT.map((it) => it.en)).size === NAT.length, 'every English prompt is different (the screen test finds items by it)');
let band = 'B1';
const enrolled = [];
window.Profile = { current: () => band, term: (es, en) => (['B1', 'B2', 'C1'].indexOf(band) >= 0 ? es : en) };
// The screen's labels follow the band (Spanish from B1); this test reads the English ones, so pin the language.
if (window.UI) { window.UI.t = (es, en) => en; }
window.SRS = { enrol: (id, d) => enrolled.push([id, d]) };
const text = (n) => n.textContent;
const btn = (root, s) => root.all((n) => n.tagName === 'BUTTON' && text(n).indexOf(s) >= 0)[0] || null;
const fbOf = (root) => root.all((n) => n.cls().includes('feedback'))[0];
const itemOn = (root) => {
  const h = root.all((n) => n.cls().includes('q-text'))[0];
  const en = h ? text(h).replace(/^“|”$/g, '') : '';
  return NAT.filter((it) => it.en === en)[0] || null;
};
function answer(root, s) { root.all((n) => n.tagName === 'TEXTAREA')[0].value = s; btn(root, 'Check').click(); }
const back = () => {};

const host = new Node('div');
window.Natural.render(host, back);
const chips = host.all((n) => n.cls().includes('topic-chip')).map(text);
ok(chips.indexOf('Mixed · ' + N.pool('B1', 'mixed').length) >= 0 && chips.indexOf('Verbs in use · ' + grid['verbs B1']) >= 0,
  'the picker shows Mixed and each group with the count open at B1: ' + chips.join(', '));
btn(host, 'Verbs in use').click();
const today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const shown = [];
for (let k = 0; k < 10; k++) {
  const it = itemOn(host);
  ok(it && it.group === 'verbs' && it.band === 'B1', 'item ' + (k + 1) + ' is a B1 verb: ' + (it && it.id));
  if (!it) break;
  shown.push(it.id);
  if (k === 0) {
    const first = NAT.filter((x) => x.id === it.id)[0];
    if (first.stiff) {
      ok(text(host).indexOf('You might say:') >= 0 && text(host).indexOf(first.stiff) >= 0, it.id + ': the stiff line is shown under You might say');
      answer(host, first.stiff);
      ok(/stiff line from above\. Try once more\./.test(text(fbOf(host))), it.id + ': typing the stiff line is a try with its own hint, got ' + text(fbOf(host)));
    }
    answer(host, it.es);
    ok(/^Right/.test(text(fbOf(host))) && fbOf(host).innerHTML.indexOf('nat-why') >= 0, it.id + ': the natural line passes and the why shows');
  } else if (k === 1) {
    answer(host, 'Hola hola hola'); answer(host, 'Tampoco sé');
    ok(fbOf(host).innerHTML.indexOf(it.es) >= 0 && fbOf(host).innerHTML.indexOf('nat-why') >= 0, it.id + ': two misses show the natural line and the why');
  } else if (k === 2) {
    btn(host, "I'm stuck").click();
    ok(fbOf(host).innerHTML.indexOf(it.es) >= 0, it.id + ': I\'m stuck shows the natural line');
  } else {
    answer(host, it.es);
    ok(/^Right/.test(text(fbOf(host))), it.id + ': the natural line passes, got ' + text(fbOf(host)));
  }
  btn(host, 'Next').click();
}
ok(text(host).indexOf('Eight of ten. The ones you missed come back in review.') >= 0, 'the round ends on one line: ' + text(host).slice(-80));
ok(enrolled.length === 10 && enrolled.every(([id, d], i) => id === 'nat:' + shown[i] && d === 1), 'every item shown is enrolled as nat:<id>, due in a day');
const ledger = JSON.parse(store['fluidez.seen'] || '{}');
ok(shown.every((id) => ledger['nat:' + id] === today), 'every item shown is stamped in fluidez.seen');
btn(host, 'Another round').click();
const next = itemOn(host);
ok(next && shown.indexOf(next.id) === -1, 'the next round starts with an item not seen today');

band = 'A2';
const box = new Node('div');
window.Natural.renderEntry(box, back);
ok(text(box).indexOf('opens at B1') >= 0 && !box.all((n) => n.tagName === 'BUTTON').length, 'below B1: a note, no mode');
band = 'C1';
const box2 = new Node('div');
window.Natural.renderEntry(box2, back);
ok(!!(btn(box2, 'Suena natural') || btn(box2, 'Sound natural')), 'from B1: the mode row');

console.log('Sound natural: ' + NAT.length + ' items, ' + forms + ' accepted forms through the matcher, ' + stiffs + ' stiff lines');
console.log('  by group: ' + GROUPS.map((g) => g + ' ' + (byGroup[g] || 0)).join(', '));
console.log('  by band:  ' + BANDS.map((b) => b + ' ' + (byBand[b] || 0)).join(', '));
console.log('  grid:     ' + GROUPS.map((g) => g + ' ' + BANDS.map((b) => grid[g + ' ' + b] || 0).join('/')).join(', '));
console.log((errors ? 'FAILED: ' + errors + ' of ' : 'ok: ') + checks + ' checks');
process.exit(errors ? 1 : 0);
