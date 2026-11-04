/* Node test for the teaching scripts (data/scripts/a1.js). Run: node tools/test-scripts.js
 * Every lesson on the path in units a1-u01 to a1-u03 has a script; every script
 * has the anatomy the evidence asks for (2 to 3 examples before a rule of under
 * 130 words, 4 to 6 read-and-pick items whose option lengths give nothing away,
 * 3 to 5 typed items whose expected Spanish passes the matcher, a personal
 * sentence whose model passes its own checklist); no dashes, no vosotros, no
 * grammar jargon on screen. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js', 'data/course.js'].forEach(load);
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
window.LIB = globalThis.LIB;
load('data/scripts/a1.js');

const M = window.LIB.match, C = window.Checker, SC = window.SCRIPTS_A1;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

const UNITS = ['a1-u01', 'a1-u02', 'a1-u03'];
const DASH = /[—–]|\s-\s|^-\s|\s-$/m;
const JARGON = /\b(stress(ed)?|clitics?|register|conjugat\w*|infinitives?|pronouns?|adjectives?|nouns?|intonation|interrogatives?|subjunctive|indicative|imperative|masculine|feminine|morphemes?|syllables?|tenses?)\b/i;
const VOSOTROS_WORD = /(^|[^a-záéíóúñ])(vosotr[oa]s|vuestr[oa]s?|os)(?![a-záéíóúñ])/i;
const VOSOTROS_VERB = /[a-záéíóúñ]+(áis|éis|ís)(?![a-záéíóúñ])/i;   // habláis, coméis, vivís
const plain = (s) => String(s == null ? '' : s).replace(/\*/g, '');
const words = (s) => plain(s).split(/\s+/).filter(Boolean).length;
const lines = (s) => String(s).split('\n').length;

// ---- the lessons on the path, read from the course itself
const want = window.COURSE_DAYS.filter((d) => UNITS.indexOf(d.unit) >= 0 && d.lesson).map((d) => d.lesson);
ok(want.length === 20, 'expected 20 lessons on the path in units 1 to 3, found ' + want.length);
want.forEach((id) => ok(!!SC[id], id + ': no script'));
Object.keys(SC).forEach((id) => ok(want.indexOf(id) >= 0, id + ': script for a lesson that is not on the path in units 1 to 3'));

// every string a learner sees, with whether it is Spanish
function* strs(id, s) {
  const S = (p, v, es) => ({ p: id + '.' + p, v: String(v == null ? '' : v), es });
  yield S('hook.line', s.hook && s.hook.line, false); yield S('hook.es', s.hook && s.hook.es, true); yield S('hook.en', s.hook && s.hook.en, false);
  for (const [i, e] of (s.examples || []).entries()) { yield S(`examples[${i}].es`, e.es, true); yield S(`examples[${i}].en`, e.en, false); }
  yield S('rule', s.rule, false);
  for (const [i, r] of (s.readAndPick || []).entries()) {
    yield S(`readAndPick[${i}].q`, r.q, false); yield S(`readAndPick[${i}].es`, r.es, true); yield S(`readAndPick[${i}].why`, r.why, false);
    for (const [k, o] of (r.options || []).entries()) yield S(`readAndPick[${i}].options[${k}]`, o, false);
  }
  for (const [i, t] of (s.yourTurn || []).entries()) {
    yield S(`yourTurn[${i}].en`, t.en, false); yield S(`yourTurn[${i}].es`, t.es, true);
    for (const [k, a] of (t.accept || []).entries()) yield S(`yourTurn[${i}].accept[${k}]`, a, true);
  }
  if (s.personal) {
    yield S('personal.prompt', s.personal.prompt, false); yield S('personal.model', s.personal.model, true);
    for (const [k, c] of (s.personal.constraints || []).entries()) yield S(`personal.constraints[${k}].label`, c.label, false);
  }
  for (const [i, p] of (s.pitfalls || []).entries()) yield S(`pitfalls[${i}]`, p, false);
}

let rpTotal = 0, rpLongest = 0, rpShortest = 0, rpChance = 0, ruleMax = 0;
const share = (opts, ans, pick) => { const m = pick(...opts.map((o) => o.length)); const tied = opts.filter((o) => o.length === m).length; return opts[ans].length === m ? 1 / tied : 0; };

Object.keys(SC).forEach((id) => {
  const s = SC[id];
  ok(['old', 'merged', 'rebuild'].indexOf(s.source) >= 0, id + ': source must be old, merged or rebuild');
  ok(s.hook && s.hook.line && s.hook.es && s.hook.en, id + ': hook needs line, es and en');
  if (s.hook) ok(lines(s.hook.es) === lines(s.hook.en), id + ': hook es and en must have the same number of lines (aligned pairs)');
  ok(Array.isArray(s.examples) && s.examples.length >= 2 && s.examples.length <= 3, id + ': 2 to 3 examples, has ' + (s.examples || []).length);
  (s.examples || []).forEach((e, i) => ok(e.es && e.en && lines(e.es) === lines(e.en), id + ': examples[' + i + '] needs es and en with matching lines'));
  const rw = words(s.rule); ruleMax = Math.max(ruleMax, rw);
  ok(typeof s.rule === 'string' && rw > 0 && rw < 130, id + ': rule must be under 130 words, has ' + rw);

  const rp = s.readAndPick || [];
  ok(rp.length >= 4 && rp.length <= 6, id + ': 4 to 6 read-and-pick items, has ' + rp.length);
  rp.forEach((r, i) => {
    const at = id + '.readAndPick[' + i + ']';
    ok(r.q && r.es && r.why, at + ': needs q, es and why');
    ok(Array.isArray(r.options) && r.options.length >= 2 && Number.isInteger(r.answer) && r.answer >= 0 && r.answer < r.options.length, at + ': answer must index an option');
    if (!Array.isArray(r.options) || !r.options[r.answer]) return;
    ok(new Set(r.options).size === r.options.length, at + ': options repeat');
    const right = r.options[r.answer].length;
    ok(!r.options.every((o, k) => k === r.answer || right >= 1.5 * o.length), at + ': the right option is 1.5 times as long as every other');
    rpTotal++; rpChance += 1 / r.options.length;
    rpLongest += share(r.options, r.answer, Math.max); rpShortest += share(r.options, r.answer, Math.min);
    ok(words(r.why) <= 25, at + ': why should be one line (25 words at most)');
  });

  const yt = s.yourTurn || [];
  ok(yt.length >= 3 && yt.length <= 5, id + ': 3 to 5 your-turn items, has ' + yt.length);
  yt.forEach((t, i) => {
    const at = id + '.yourTurn[' + i + ']';
    ok(t.en && t.es && Array.isArray(t.accept), at + ': needs en, es and accept[]');
    const item = { es: t.es, en: t.en, accept: t.accept || [] };
    const r = M.matchTranslation(t.es, item, { accents: 'lenient' });
    ok(r.pass, at + ': the expected Spanish fails the matcher: "' + t.es + '" (' + (r.hint || '') + ')');
    (t.accept || []).forEach((a) => {
      let xs = [];
      try { xs = M.expandAccept(a); } catch (e) { ok(false, at + ': accept pattern does not parse: ' + a); }
      xs.forEach((x) => { const rx = M.matchTranslation(x, item, { accents: 'lenient' }); ok(rx.pass, at + ': accepted form fails the matcher: "' + x + '"'); });
    });
    ok(!M.matchTranslation('', item).pass, at + ': an empty answer passes');
    ok(!M.matchTranslation('zzz qqq', item).pass, at + ': nonsense passes');
    // the attempt machine gives one retry, then reveals
    let st = M.startAttempt(item, { accents: 'lenient' });
    const a1 = M.submitAttempt(st, 'zzz'); const a2 = M.submitAttempt(a1.state, 'zzz');
    ok(a1.status === 'retry' && a2.status === 'revealed', at + ': one retry, then the answer');
  });

  const p = s.personal || {};
  ok(p.prompt && Array.isArray(p.constraints) && p.constraints.length, id + ': personal needs a prompt and constraints');
  if (p.constraints && p.constraints.length) {
    const res = C.checkWriting({ constraints: p.constraints }, '');
    res.results.forEach((r, k) => ok(!/unknown constraint/.test(r.label || ''), id + ': personal.constraints[' + k + '] has an unknown type'));
    ok(p.constraints.every((c) => c.label), id + ': every personal constraint carries its own plain label');
    ok(!res.allPass, id + ': an empty personal sentence passes its checklist');
    if (p.model) {
      const m = C.checkWriting({ constraints: p.constraints }, p.model);
      ok(m.allPass, id + ': the personal model fails its own checklist: ' + m.results.filter((r) => !r.pass).map((r) => plain(r.label)).join('; '));
    }
  }
  ok(!s.pitfalls || (Array.isArray(s.pitfalls) && s.pitfalls.length <= 3), id + ': 0 to 3 pitfalls');

  for (const x of strs(id, s)) {
    ok(!DASH.test(x.v), x.p + ': dash: "' + x.v.slice(0, 60) + '"');
    if (x.es) {
      ok(!VOSOTROS_WORD.test(plain(x.v)), x.p + ': vosotros: "' + x.v.slice(0, 60) + '"');
      ok(!VOSOTROS_VERB.test(plain(x.v).replace(/\b(país|maíz|raíz|oís)\b/gi, '')), x.p + ': a vosotros verb form: "' + x.v.slice(0, 60) + '"');
    } else {
      ok(!JARGON.test(plain(x.v)), x.p + ': grammar jargon on screen: "' + (plain(x.v).match(JARGON) || [''])[0] + '"');
      ok(!/vosotr|vuestr/i.test(x.v), x.p + ': names vosotros');
    }
  }
});

// the typed items test their point: the slip each lesson warns about is not accepted
[['presente', 3, 'Laura no hablas francés.'], ['fn-responder-saludo-a2', 3, '¿Cómo estás?'], ['fn-responder-saludo-a2', 1, 'Bien, gracias. ¿Y tú?'],
 ['ser-estar', 1, 'La sopa es fría.'], ['ser-estar', 4, 'Somos en casa.'], ['nt-origen-a1', 4, 'Soy veinte años.'],
 ['fn-agradecer-a1', 1, 'Gracias para la ayuda.'], ['fn-agradecer-a1', 2, 'Gracias por vienes.'], ['fn-agradecer-a1', 0, 'Muy gracias.'],
 ['gr-interrogativos-a1', 4, '¿Cuántos hermanas tienes?'], ['gr-pronombre-sujeto-a1', 1, '¿Vives aquí?'], ['gr-pronombre-sujeto-a1', 2, '¿Vive aquí?'],
 ['fn-pedir-informacion-a1', 3, 'Estudio español para quiero vivir aquí.'], ['gr-adverbios-afirmacion-negacion-a1', 1, 'Yo también.'],
 ['gr-adverbios-afirmacion-negacion-a1', 0, 'Yo tampoco.'], ['fn-dirigirse-a1', 2, 'Encantado.'], ['task-cortesia', 0, 'Oye, ¿tiene hora?'],
 ['task-cortesia', 1, 'Disculpe, ¿tienes hora, por favor?'], ['fn-establecer-comunicacion-a1', 3, '¡Hasta lunes!'], ['fn-identificar-a1', 0, 'Sí, yo.']
].forEach(([id, i, wrong]) => {
  const t = SC[id] && SC[id].yourTurn[i];
  if (!t) { ok(false, id + '.yourTurn[' + i + '] missing'); return; }
  ok(!M.matchTranslation(wrong, { es: t.es, en: t.en, accept: t.accept }, { accents: 'lenient' }).pass, id + '.yourTurn[' + i + ']: the slip "' + wrong + '" is accepted');
});

// option length across the file: the gate's rule, a third at most
ok(rpTotal >= 20, 'expected at least 20 read-and-pick items, found ' + rpTotal);
ok(rpLongest / rpTotal <= 1 / 3, 'the right option is the longest ' + Math.round(100 * rpLongest / rpTotal) + '% of the time (a third at most)');
ok(rpShortest / rpTotal <= rpChance / rpTotal + 0.08, 'the right option is the shortest ' + Math.round(100 * rpShortest / rpTotal) + '% of the time (chance ' + Math.round(100 * rpChance / rpTotal) + '%)');

console.log('scripts: ' + Object.keys(SC).length + ', read-and-pick ' + rpTotal + ' (right is longest ' + Math.round(100 * rpLongest / rpTotal) + '%, shortest ' + Math.round(100 * rpShortest / rpTotal) + '%), longest rule ' + ruleMax + ' words');
console.log('Checks run: ' + checks);
if (errors) { console.error(errors + ' problem(s).'); process.exit(1); }
console.log('Scripts OK.');
