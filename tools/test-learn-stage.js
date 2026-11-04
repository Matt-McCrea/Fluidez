// The Learn stage's New today card: one card, removed on Got it, one tap only, on every kind of day.
// Run: node tools/test-learn-stage.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const root = path.join(__dirname, '..');
class El {
  constructor(tag) { this.tagName = tag; this.children = []; this.parentNode = null; this._l = {}; this.dataset = {}; this.style = {}; this.className = ''; this.disabled = false; this._html = ''; this.value = ''; this.classList = { add() {}, remove() {}, toggle() {}, contains: () => false }; }
  set innerHTML(v) { this._html = v; this.children = []; }
  get innerHTML() { return this._html; }
  set textContent(v) { this._html = v; }
  get firstChild() { return this.children[0] || null; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); c.parentNode = null; return c; }
  addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); }
  setAttribute() {} focus() {} scrollIntoView() {}
  click() { if (this.disabled) return; (this._l.click || []).forEach((f) => f({})); }
}
global.window = global;
global.document = { createElement: (t) => new El(t), head: null };
global.localStorage = { getItem: () => null, setItem() {} };
const enrolled = [];
window.SRS = { enrol: (id, d) => enrolled.push([id, d]), isEnrolled: () => false };
window.Checker = {}; window.ENGINE = {}; window.COURSE_DAYS = [];
window.Phrases = { forLesson: () => [] };
window.StageReview = { newToday: () => [{ id: 'v:casa:meaning', es: 'la casa', en: 'the house' }] };
new Function(fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8')).call(global);
new Function(fs.readFileSync(path.join(root, 'js/views/learn.js'), 'utf8')).call(global);
const L = window.StageLearn;
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const lesson = { id: 'a1-test', title: 'Test', cefr: 'A1', sections: [], examples: [], recall: [] };
window.SCRIPTS_A1 = { 'a1-test': { hook: { line: 'Hi', es: 'Hola', en: 'Hello' }, examples: [{ es: 'a', en: 'b' }], rule: 'r', readAndPick: [], yourTurn: [], translate: [], personal: null } };

const days = {
  script: { focus: { type: 'grammar' }, lesson },
  verbs: { focus: { type: 'verbs', verbs: [] }, lesson: null },
  practice: { focus: { type: 'practice' }, lesson: null },
  old: { focus: { type: 'grammar' }, lesson: Object.assign({}, lesson, { id: 'a1-old', cefr: 'B2' }) },
};
for (const k of Object.keys(days)) {
  const host = new El('div'); let finished = 0;
  L.run(host, Object.assign({ di: 0 }, days[k]), () => { finished++; });
  ok(host.children.length === 1 && /new-today/.test(host.children[0].className), k + ': New today shows one card');
  const card = host.children[0], btn = card.children[card.children.length - 1];
  btn.click();
  ok(host.children.length === 1 && host.children[0] !== card, k + ': after Got it the host holds exactly one panel, not the card (' + host.children.length + ')');
  const after = host.children[0];
  btn.click(); btn.click();
  ok(host.children.length === 1 && host.children[0] === after, k + ': a second tap on the old button does nothing');
  ok(btn.disabled, k + ': Got it disables itself');
}
console.log('test-learn-stage: ' + n + ' checks passed; enrolled for tomorrow: ' + enrolled.every((e) => e[1] === 1));
