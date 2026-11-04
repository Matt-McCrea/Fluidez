/* Node test for the B1 teaching scripts (data/scripts/b1.js). Run: node tools/test-scripts-b1.js
 * Every lesson on the path in the first four B1 units (read from COURSE_BANDS.B1,
 * not hard-coded) has a script; every script has the anatomy of the A1 scripts
 * (tools/test-scripts.js: 2 to 3 examples before a rule, 4 to 6 read-and-pick
 * items whose option lengths give nothing away, 3 to 5 typed items whose
 * expected Spanish passes the matcher, a personal sentence whose model passes
 * its own checklist, no dashes, no vosotros, no grammar jargon on screen) and
 * the two blocks the upper bands add: register (3 to 5 ways to say it, each
 * with when you would choose it) and translate (4 to 6 more typed
 * translations, each passing the matcher).
 *
 * Differences from the A1 test, on purpose:
 *   - the rule is under 120 words (the Stage 5b brief), not 130;
 *   - "subjunctive" may appear on screen, but never in a hook: the rebuild's
 *     ruling R2 names it from its first day, in the rule body. "Indicative"
 *     stays banned ("the ordinary form" is the lesson word);
 *   - yourTurn and translate English must be the exact English of the Spanish:
 *     no slashes, no instructions ("Say", "Tell"), and a question in one
 *     language is a question in the other;
 *   - no Spanish string uses a verb form the course has not built by that
 *     lesson's day. The day each tense arrives is read from the course (the
 *     day of its ladder lesson: futuro, condicional, impsubj), so the future
 *     is legal from b1-u29's first day and the conditional from b1-u30's.
 *     Before its own lesson the conditional is allowed only as the chunks
 *     the course has taught since A2: podría-, debería-, gustaría-. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js', 'data/course.js'].forEach(load);
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
window.LIB = globalThis.LIB;
load('data/scripts/b1.js');

const M = window.LIB.match, C = window.Checker, E = window.ENGINE, SC = window.SCRIPTS_B1;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

const DASH = /[—–]|\s-\s|^-\s|\s-$/m;
const JARGON = /\b(stress(ed)?|clitics?|register|conjugat\w*|infinitives?|pronouns?|adjectives?|nouns?|intonation|interrogatives?|subjunctive|indicative|imperative|masculine|feminine|morphemes?|syllables?|tenses?|clauses?)\b/i;
const JARGON_B1 = new RegExp(JARGON.source.replace('subjunctive|', ''), 'i');   // R2: "the subjunctive" is the lesson word
const VOSOTROS_WORD = /(^|[^a-záéíóúñ])(vosotr[oa]s|vuestr[oa]s?|os)(?![a-záéíóúñ])/i;
const VOSOTROS_VERB = /[a-záéíóúñ]+(áis|éis|ís)(?![a-záéíóúñ])/i;
const INSTRUCTION = /^(say|tell|ask|type|write|answer|make|pick|give|now|reply|use|translate)\b/i;
const LATER_TENSES = { futuro: 'future', condicional: 'conditional', impsubj: 'past subjunctive' };
const CHUNK_BEFORE = { condicional: ['poder', 'deber', 'gustar'] };   // politeness chunks taught as wholes since A2
const plain = (s) => String(s == null ? '' : s).replace(/\*/g, '');
const words = (s) => plain(s).split(/\s+/).filter(Boolean).length;
const lines = (s) => String(s).split('\n').length;

// ---- the lessons on the path: the first four units from the start of B1
const N_UNITS = 4;
const b1 = window.COURSE_BANDS.B1;
const units = [];
for (let i = b1; i < window.COURSE_DAYS.length && units.length <= N_UNITS; i++) {
  const u = window.COURSE_DAYS[i].unit;
  if (u && units.indexOf(u) < 0) units.push(u);
}
const UNITS = units.slice(0, N_UNITS);
ok(UNITS.length === N_UNITS, 'expected ' + N_UNITS + ' units after COURSE_BANDS.B1, found ' + UNITS.length);
const want = window.COURSE_DAYS.filter((d) => UNITS.indexOf(d.unit) >= 0 && d.lesson).map((d) => d.lesson);
ok(want.length === 33, 'expected 33 lessons on the path in ' + UNITS.join(', ') + ', found ' + want.length);
ok(want[0] === 'gr-presente-subjuntivo-b1', 'the first B1 day should be the present subjunctive, found ' + want[0]);
// the day each later tense is built: the day of its ladder lesson in the course
const DAY = {};
window.COURSE_DAYS.forEach((d, i) => { if (d.lesson && DAY[d.lesson] == null) DAY[d.lesson] = i; });
const BUILT = {};
Object.keys(LATER_TENSES).forEach((tk) => { BUILT[tk] = DAY[tk]; ok(BUILT[tk] != null, 'the course has no ' + tk + ' lesson to date the tense by'); });
ok(DAY['futuro'] >= DAY[want[0]] && UNITS.indexOf(window.COURSE_DAYS[DAY['futuro']].unit) === 2, 'the future should open the third B1 unit');
ok(UNITS.indexOf(window.COURSE_DAYS[DAY['condicional']].unit) === 3, 'the conditional should open the fourth B1 unit');
want.forEach((id) => ok(!!SC[id], id + ': no script'));
Object.keys(SC).forEach((id) => ok(want.indexOf(id) >= 0, id + ': script for a lesson that is not on the path in ' + UNITS.join(' and ')));

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
  for (const blk of ['yourTurn', 'translate']) for (const [i, t] of (s[blk] || []).entries()) {
    yield S(`${blk}[${i}].en`, t.en, false); yield S(`${blk}[${i}].es`, t.es, true);
    for (const [k, a] of (t.accept || []).entries()) yield S(`${blk}[${i}].accept[${k}]`, a, true);
  }
  for (const [i, r] of (s.register || []).entries()) {
    yield S(`register[${i}].es`, r.es, true); yield S(`register[${i}].en`, r.en, false); yield S(`register[${i}].when`, r.when, false);
  }
  if (s.personal) {
    yield S('personal.prompt', s.personal.prompt, false); yield S('personal.model', s.personal.model, true);
    for (const [k, c] of (s.personal.constraints || []).entries()) yield S(`personal.constraints[${k}].label`, c.label, false);
  }
  for (const [i, p] of (s.pitfalls || []).entries()) yield S(`pitfalls[${i}]`, p, false);
}

// one typed item (yourTurn or translate): the matcher must take the expected Spanish and every accepted form
function typed(at, t) {
  ok(t.en && t.es && Array.isArray(t.accept), at + ': needs en, es and accept[]');
  if (!t.en || !t.es) return;
  ok(!/\//.test(t.en), at + ': a slash in the English (one translation, not a menu)');
  ok(!INSTRUCTION.test(t.en.trim()), at + ': the English is an instruction, not the translation: "' + t.en.slice(0, 40) + '"');
  ok(/\?/.test(t.es) === /\?/.test(t.en.replace(/\([^)]*\)/g, '')), at + ': a question in one language and not the other');
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
  const st = M.startAttempt(item, { accents: 'lenient' });
  const a1 = M.submitAttempt(st, 'zzz'); const a2 = M.submitAttempt(a1.state, 'zzz');
  ok(a1.status === 'retry' && a2.status === 'revealed', at + ': one retry, then the answer');
}

// forms the course has not built by this lesson's day
function laterForms(es, day) {
  const later = (a) => LATER_TENSES[a.tense] && BUILT[a.tense] > day && !(CHUNK_BEFORE[a.tense] || []).includes(a.inf);
  const out = [];
  for (const tok of E.tokenize(plain(es))) {
    const an = E.analyzeToken(tok) || [];
    if (an.length && an.every(later)) out.push(tok + ' (' + LATER_TENSES[an[0].tense] + ')');
  }
  return out;
}

let rpTotal = 0, rpLongest = 0, rpShortest = 0, rpChance = 0, ruleMax = 0, typedTotal = 0;
const at0 = [0, 0, 0, 0, 0, 0];
const share = (opts, ans, pick) => { const m = pick(...opts.map((o) => o.length)); const tied = opts.filter((o) => o.length === m).length; return opts[ans].length === m ? 1 / tied : 0; };

Object.keys(SC).forEach((id) => {
  const s = SC[id];
  ok(['old', 'merged', 'rebuild'].indexOf(s.source) >= 0, id + ': source must be old, merged or rebuild');
  ok(s.hook && s.hook.line && s.hook.es && s.hook.en, id + ': hook needs line, es and en');
  if (s.hook) ok(lines(s.hook.es) === lines(s.hook.en), id + ': hook es and en must have the same number of lines (aligned pairs)');
  if (s.hook) ok(!/subjunctive/i.test(s.hook.line + ' ' + s.hook.en), id + ': the hook names the subjunctive (R2: the rule body names it, never the hook)');
  ok(Array.isArray(s.examples) && s.examples.length >= 2 && s.examples.length <= 3, id + ': 2 to 3 examples, has ' + (s.examples || []).length);
  (s.examples || []).forEach((e, i) => ok(e.es && e.en && lines(e.es) === lines(e.en), id + ': examples[' + i + '] needs es and en with matching lines'));
  const rw = words(s.rule); ruleMax = Math.max(ruleMax, rw);
  ok(typeof s.rule === 'string' && rw > 0 && rw < 120, id + ': rule must be under 120 words, has ' + rw);
  ok(/\*[^*]+\*/.test(s.rule || ''), id + ': the rule shows no Spanish forms');

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
    rpTotal++; rpChance += 1 / r.options.length; at0[r.answer]++;
    rpLongest += share(r.options, r.answer, Math.max); rpShortest += share(r.options, r.answer, Math.min);
    ok(words(r.why) <= 25, at + ': why should be one line (25 words at most)');
  });

  const yt = s.yourTurn || [];
  ok(yt.length >= 3 && yt.length <= 5, id + ': 3 to 5 your-turn items, has ' + yt.length);
  yt.forEach((t, i) => { typed(id + '.yourTurn[' + i + ']', t); typedTotal++; });

  const tr = s.translate || [];
  ok(tr.length >= 4 && tr.length <= 6, id + ': 4 to 6 translate items, has ' + tr.length);
  tr.forEach((t, i) => { typed(id + '.translate[' + i + ']', t); typedTotal++; });
  const ytEs = new Set(yt.map((t) => t.es));
  tr.forEach((t, i) => ok(!ytEs.has(t.es), id + '.translate[' + i + ']: repeats a your-turn item'));

  const rg = s.register || [];
  ok(rg.length >= 3 && rg.length <= 5, id + ': 3 to 5 register lines, has ' + rg.length);
  ok(new Set(rg.map((r) => r.es)).size === rg.length, id + ': register lines repeat');
  rg.forEach((r, i) => {
    const at = id + '.register[' + i + ']';
    ok(r.es && r.en && r.when, at + ': needs es, en and when');
    ok(r.when && words(r.when) <= 12 && !/[.;]\s*\S/.test(r.when.trim()), at + ': when is one plain line (12 words at most)');
  });

  const p = s.personal || {};
  ok(p.prompt && Array.isArray(p.constraints) && p.constraints.length, id + ': personal needs a prompt and constraints');
  if (p.constraints && p.constraints.length) {
    const res = C.checkWriting({ constraints: p.constraints }, '');
    res.results.forEach((r, k) => ok(!/unknown constraint/.test(r.label || ''), id + ': personal.constraints[' + k + '] has an unknown type'));
    ok(p.constraints.every((c) => c.label), id + ': every personal constraint carries its own plain label');
    ok(!res.allPass, id + ': an empty personal sentence passes its checklist');
    ok(!!p.model, id + ': personal needs a model');
    if (p.model) {
      const m = C.checkWriting({ constraints: p.constraints }, p.model);
      ok(m.allPass, id + ': the personal model fails its own checklist: ' + m.results.filter((r) => !r.pass).map((r) => plain(r.label)).join('; '));
    }
  }
  ok(!s.pitfalls || (Array.isArray(s.pitfalls) && s.pitfalls.length <= 3), id + ': 0 to 3 pitfalls');

  const day = DAY[id];
  for (const x of strs(id, s)) {
    ok(!DASH.test(x.v), x.p + ': dash: "' + x.v.slice(0, 60) + '"');
    if (x.es) {
      ok(!VOSOTROS_WORD.test(plain(x.v)), x.p + ': vosotros: "' + x.v.slice(0, 60) + '"');
      ok(!VOSOTROS_VERB.test(plain(x.v).replace(/\b(país|maíz|raíz|oís)\b/gi, '')), x.p + ': a vosotros verb form: "' + x.v.slice(0, 60) + '"');
      const later = laterForms(x.v, day);
      ok(!later.length, x.p + ': a form the course builds later: ' + later.join(', '));
    } else {
      const J = /^hook\./.test(x.p.slice(id.length + 1)) ? JARGON : JARGON_B1;
      ok(!J.test(plain(x.v)), x.p + ': grammar jargon on screen: "' + (plain(x.v).match(J) || [''])[0] + '"');
      ok(!/vosotr|vuestr/i.test(x.v), x.p + ': names vosotros');
    }
  }
});

// option length and position across the file
ok(rpTotal >= 4 * want.length, 'expected at least ' + 4 * want.length + ' read-and-pick items, found ' + rpTotal);
ok(rpLongest / rpTotal <= 1 / 3, 'the right option is the longest ' + Math.round(100 * rpLongest / rpTotal) + '% of the time (a third at most)');
ok(rpShortest / rpTotal <= rpChance / rpTotal + 0.08, 'the right option is the shortest ' + Math.round(100 * rpShortest / rpTotal) + '% of the time (chance ' + Math.round(100 * rpChance / rpTotal) + '%)');
const topSlot = Math.max(...at0) / rpTotal;
ok(topSlot <= 0.5, 'the right option sits in one position ' + Math.round(100 * topSlot) + '% of the time (half at most)');

console.log('scripts: ' + Object.keys(SC).length + ' (' + UNITS.join(', ') + '), read-and-pick ' + rpTotal + ' (right is longest ' + Math.round(100 * rpLongest / rpTotal) + '%, shortest ' + Math.round(100 * rpShortest / rpTotal) + '%, positions ' + at0.slice(0, 3).join('/') + '), typed ' + typedTotal + ', longest rule ' + ruleMax + ' words');
console.log('Checks run: ' + checks);
if (errors) { console.error(errors + ' problem(s).'); process.exit(1); }
console.log('Scripts OK.');
