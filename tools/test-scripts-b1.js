/* Node test for the B1 teaching scripts (data/scripts/b1.js). Run: node tools/test-scripts-b1.js
 * Every lesson on the path in the seventeen B1 units, b1-u27 to b1-u43 (read from
 * COURSE_BANDS.B1 and COURSE_BANDS.B2, not hard-coded), has a script; every script has the anatomy of the A1 scripts
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
 *     the course has taught since A2: podría-, debería-, gustaría-;
 *   - before the negative-command lesson (impneg, in b1-u32) no sentence
 *     opens with a tú command in its no + subjunctive shape. No te preocupes
 *     is the one exception: the course has taught it as a whole phrase since A2;
 *   - five more dates, each read from the first day whose lesson teaches the
 *     node (data/lesson-nodes.js): había + participle from g:pluperfect
 *     (b1-u36), haya + participle from g:subj-perfect, ponerse a + a verb
 *     from p:ponerse-a-inf, volver a + a verb from p:volver-a-inf, and an
 *     indirect question (sé, sabes, pregunta, dime... before si or a question
 *     word) from g:indirect-questions;
 *   - four more from b1-u42 on, read the same way: habré + participle from
 *     g:future-perfect, habría + participle from g:conditional-perfect,
 *     hubiera + participle from g:pluperfect-subj and para que from
 *     g:para-que. The last two are taught in B2 (gr-pluscuamsubj-b2,
 *     fn-dar-informacion-b2), so no B1 script may use them at all. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js', 'data/course.js', 'data/lesson-nodes.js'].forEach(load);
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
const CHUNK_BEFORE = { condicional: ['poder', 'deber', 'gustar', 'encantar'], futuro: ['ser'] };   // politeness chunks taught as wholes since A2 (me encantaría), and the softener ¿será que…?
const plain = (s) => String(s == null ? '' : s).replace(/\*/g, '');
const words = (s) => plain(s).split(/\s+/).filter(Boolean).length;
const lines = (s) => String(s).split('\n').length;

const BAND = 'B1';
// ---- the lessons on the path in this band, read from the course itself (the re-sequenced course of
// 5 November 2026 places some lessons of one band on days of another; their scripts live in the file
// of the lesson's own band, which js/views/learn.js falls back to)
load('data/lessons/index.js');
['a1', 'a2', 'b1', 'b2', 'c1'].forEach((b) => { if (!window['SCRIPTS_' + b.toUpperCase()]) load('data/scripts/' + b + '.js'); });
const ALL_SC = { A1: window.SCRIPTS_A1, A2: window.SCRIPTS_A2, B1: window.SCRIPTS_B1, B2: window.SCRIPTS_B2, C1: window.SCRIPTS_C1 };
const LESSON_BAND = (window.LESSONS_INDEX && window.LESSONS_INDEX.ids) || {};
const bandDays = window.COURSE_DAYS.map((d, i) => ({ d, i })).filter((x) => x.d.band === BAND);
const UNITS = [...new Set(bandDays.map((x) => x.d.unit))];
const pathDays = bandDays.map((x) => x.d);
const want = pathDays.filter((d) => d.lesson).map((d) => d.lesson);
ok(want.length > 0 && UNITS.length > 0, 'the ' + BAND + ' band has lessons on the path');
const servedIn = (T, id) => !!T && Object.keys(T).some((k) => T[k] && Array.isArray(T[k].serves) && T[k].serves.indexOf(id) >= 0);
const hasScript = (id) => !!SC[id] || servedIn(SC, id) || (LESSON_BAND[id]
  ? !!(ALL_SC[LESSON_BAND[id]] && (ALL_SC[LESSON_BAND[id]][id] || servedIn(ALL_SC[LESSON_BAND[id]], id)))
  : Object.keys(ALL_SC).some((b) => ALL_SC[b] && (ALL_SC[b][id] || servedIn(ALL_SC[b], id))));   // ladder lessons live in no band file
want.forEach((id) => ok(hasScript(id), id + ': no script'));
const KNOWN_LESSON = new Set(Object.keys(LESSON_BAND));
window.COURSE_DAYS.forEach((d) => { if (d.lesson) KNOWN_LESSON.add(d.lesson); });
Object.keys(SC).forEach((id) => ok(KNOWN_LESSON.has(id), id + ': script for an id that is no lesson'));
// the day each later tense is built: the day of its ladder lesson in the course
const DAY = {};
window.COURSE_DAYS.forEach((d, i) => { if (d.lesson && DAY[d.lesson] == null) DAY[d.lesson] = i; });
const BUILT = {};
Object.keys(LATER_TENSES).forEach((tk) => { BUILT[tk] = DAY[tk]; ok(BUILT[tk] != null, 'the course has no ' + tk + ' lesson to date the tense by'); });
ok(DAY['impneg'] != null, 'the course has a negative-commands lesson (impneg)');
// the day a node is first taught: the first lesson on the path whose LESSON_NODES entry teaches it
const NODE_DAY = {};
window.COURSE_DAYS.forEach((d, i) => { const n = d.lesson && window.LESSON_NODES[d.lesson]; if (n) n.teaches.forEach((t) => { if (NODE_DAY[t] == null) NODE_DAY[t] = i; }); });
const DATED = { pluperfect: 'g:pluperfect', perfsubj: 'g:subj-perfect', ponerseA: 'p:ponerse-a-inf', volverA: 'p:volver-a-inf', indirect: 'g:indirect-questions',
  futperf: 'g:future-perfect', condperf: 'g:conditional-perfect', pluperfsubj: 'g:pluperfect-subj', paraQue: 'g:para-que' };
Object.keys(DATED).forEach((k) => ok(NODE_DAY[DATED[k]] != null, 'no lesson on the path teaches ' + DATED[k]));
ok(NODE_DAY['g:pluperfect'] != null && NODE_DAY['p:volver-a-inf'] != null, 'the pluperfect and volver a are taught on the path');
['impsubj', 'futperf', 'condperf', 'perfsubj'].forEach((id) => ok(DAY[id] != null, id + ' is on the path'));
ok(DAY['impsubj'] === NODE_DAY['g:imperfect-subj'] && DAY['perfsubj'] === NODE_DAY['g:subj-perfect'], 'the past and perfect subjunctive should date from their own lessons');
ok(NODE_DAY['g:pluperfect-subj'] != null, 'hubiera + participle is taught on the path');

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

// a sentence that opens with no + a tú subjunctive is a negative command: legal from the impneg day
const NEG_CMD = /(^|[.!?¡¿,:]\s*)no ((?:me|te|se|lo|la|le|los|las|les|nos) )*([a-záéíóúñ]+)/gi;
function negCommands(es, day) {
  if (day >= DAY['impneg']) return [];
  const out = [];
  for (const m of plain(es).matchAll(NEG_CMD)) {
    const phrase = m[0].replace(/^[^a-záéíóúñ]+/i, '').toLowerCase();
    if (phrase === 'no te preocupes') continue;           // a whole phrase since A2
    const an = E.analyzeToken(m[3].toLowerCase()) || [];
    if (an.length && an.every((a) => a.tense === 'presubj' && a.person === 'tú')) out.push(phrase);
  }
  return out;
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

// compound tenses, two periphrases and indirect questions, each legal only from the day its node is taught
const PARTICIPLE = /^([a-záéíóúñ]*(ado|ido|ído)|hecho|dicho|visto|escrito|puesto|vuelto|muerto|roto|abierto|cubierto|resuelto|devuelto|descubierto|satisfecho|propuesto|compuesto|supuesto|frito|impreso)$/;
const HABIA = /^hab(ía|ías|íamos|ían)$/, HAYA = /^haya(s|mos|n)?$/;
const HABRE = /^habr(é|ás|á|emos|án)$/, HABRIA = /^habr(ía|ías|íamos|ían)$/, HUBIERA = /^hubie(ra|ras|ra|ramos|ran|se|ses|semos|sen)$/;
const PONERSE_A = /\b(pongo|pones|pone|ponemos|ponen|puse|pusiste|puso|pusimos|pusieron|ponía|ponías|poníamos|ponían|pondré|pondrás|pondrá|pondremos|pondrán|ponga|pongas|pongamos|pongan|poner(me|te|se|nos))\s+a\s+[a-záéíóúñ]+(ar|er|ir)\b/i;
const VOLVER_A = /\b(vuelvo|vuelves|vuelve|volvemos|vuelven|volví|volviste|volvió|volvimos|volvieron|volvía|volvías|volvíamos|volvían|volveré|volverás|volverá|volveremos|volverán|vuelva|vuelvas|volvamos|vuelvan|volver(me|te|se|nos|lo|la|le)?)\s+a\s+[a-záéíóúñ]+(ar|er|ir)(me|te|se|lo|la|le|nos|los|las|les)?\b/i;
const ASK_KNOW = /^(sé|sabes|sabe|sabemos|saben|sabía|sabías|sabíamos|sabían|supe|supiste|supo|supimos|supieron|saber|sepa|pregunto|preguntas|pregunta|preguntamos|preguntan|pregunté|preguntaste|preguntó|preguntaron|preguntaba|preguntar|preguntarle|pregúntale|pregúntele|dime|dígame|díganme|decirme|decirle|decirnos|explícame|explicarme|entiendo|entiendes|recuerdo|recuerdas|acuerdo|acuerdas|averiguar|imagino|imaginas|idea)$/;
const WH = /^(si|qué|dónde|adónde|cuándo|cómo|quién|quiénes|cuál|cuáles|cuánto|cuánta|cuántos|cuántas)$/;
// The indirect-question date is checked from b1-u35 on. Units b1-u27 to b1-u34 were scripted before the
// check and hold five, in fourteen strings, each a fixed chunk in context (nt-acontecimiento-b1 Nadie sabe cómo pasó;
// gr-condicionales-b1 No sé si vendrá; task-b1-consejo No sé qué hacer and preguntar si puedes;
// task-b1-alegria No sabes cuánto me alegro): left for the owner to rule on, not rewritten here.
const IQ_FROM = NODE_DAY['g:indirect-questions'] != null ? NODE_DAY['g:indirect-questions'] : DAY[want[Math.min(want.length - 1, 60)]];
function laterShapes(es, day, from) {
  const out = [];
  for (const clause of plain(es).toLowerCase().split(/[.!?¿¡;:\n]+/)) {
  const t = clause.split(/[^a-záéíóúñü]+/).filter(Boolean);
  for (let i = 0; i + 1 < t.length; i++) {
    if (HABIA.test(t[i]) && PARTICIPLE.test(t[i + 1]) && day < NODE_DAY['g:pluperfect']) out.push(t[i] + ' ' + t[i + 1] + ' (pluperfect)');
    if (HAYA.test(t[i]) && PARTICIPLE.test(t[i + 1]) && day < NODE_DAY['g:subj-perfect']) out.push(t[i] + ' ' + t[i + 1] + ' (perfect subjunctive)');
    if (HABRE.test(t[i]) && PARTICIPLE.test(t[i + 1]) && day < NODE_DAY['g:future-perfect']) out.push(t[i] + ' ' + t[i + 1] + ' (future perfect)');
    if (HABRIA.test(t[i]) && PARTICIPLE.test(t[i + 1]) && day < NODE_DAY['g:conditional-perfect']) out.push(t[i] + ' ' + t[i + 1] + ' (conditional perfect)');
    if (HUBIERA.test(t[i]) && PARTICIPLE.test(t[i + 1]) && day < NODE_DAY['g:pluperfect-subj']) out.push(t[i] + ' ' + t[i + 1] + ' (pluperfect subjunctive)');
    if (t[i] === 'para' && t[i + 1] === 'que' && day < NODE_DAY['g:para-que']) out.push('para que (para que + subjunctive)');
    // an indirect question: a verb of knowing, asking or telling, then si or a question word (prepositions may sit between)
    let j = i + 1; while (j < t.length && /^(a|de|en|con|por|para)$/.test(t[j]) && j < i + 2) j++;
    if (ASK_KNOW.test(t[i]) && j < t.length && WH.test(t[j]) && day < NODE_DAY['g:indirect-questions'] && day >= from) out.push(t.slice(i, j + 1).join(' ') + ' (indirect question)');
  }
  }
  if (day < NODE_DAY['p:ponerse-a-inf'] && PONERSE_A.test(plain(es))) out.push(plain(es).match(PONERSE_A)[0] + ' (ponerse a)');
  if (day < NODE_DAY['p:volver-a-inf'] && VOLVER_A.test(plain(es))) out.push(plain(es).match(VOLVER_A)[0] + ' (volver a)');
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
      if (day != null) {   // a script kept for a lesson the re-sequence shelved has no day to date by
        const later = laterForms(x.v, day);
        ok(!later.length, x.p + ': a form the course builds later: ' + later.join(', '));
        const neg = negCommands(x.v, day);
        ok(!neg.length, x.p + ': a negative command before the impneg lesson: ' + neg.join(', '));
        const shapes = laterShapes(x.v, day, IQ_FROM);
        ok(!shapes.length, x.p + ': a shape the course teaches later: ' + shapes.join(', '));
      }
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
