#!/usr/bin/env node
/* ============================================================================
 * audit-standards.js — how much of the course meets tools/TEACHING_STANDARDS.md?
 *
 *   node tools/audit-standards.js            summary: pass rate per check, per band
 *   node tools/audit-standards.js --fails A1 every A1 item that fails, and why
 *
 * The gates check that content is CORRECT. This checks that it is the right
 * SIZE for the learner: how many phrases a lesson throws at a beginner, how
 * much English they read to get them, how long a passage's sentences run, how
 * long a C1 writing task's answer is. The numbers live in Part 1 of
 * TEACHING_STANDARDS.md; LIMITS below is that table, and the two are changed
 * together.
 *
 * Not a gate. Nothing exits non-zero. It exists because the first audit found
 * an A1 lesson carrying 42 Spanish phrases and a C1 writing task answered in
 * eight words, and every gate had passed both.
 *
 * Rare words are counted against tools/freq-es-3000.txt, a subtitle-corpus
 * frequency list of word FORMS, not lemmas: "hablábamos" is rarer than
 * "hablar" there, which overstates rarity in verb-heavy text a little. Words
 * the passage glosses are not counted as rare, since the learner is handed them.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
['data/taxonomy.js', 'data/connectors.js', 'data/rubrics.js', 'data/strand-lessons.js', 'data/course.js',
 'data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
 'data/passages.js', 'data/apply.js', 'data/writing.js', 'js/engine.js', 'js/lessons.js']
  .forEach(f => (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const W = window;

const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const LIMITS = {
  lesson: {
    // diagnostics, not targets: "look if above"
    phrases:   { A1: 14, A2: 14, B1: 16, B2: 18, C1: 20 },
    enWords:   { A1: 250, A2: 250, B1: 280, B2: 300, C1: 300 },
    sections:  { A1: 4, A2: 4, B1: 5, B2: 5, C1: 5 },
    // Spanish-language terminology (complemento directo…) stays out of A1–B1
    jargon:    { A1: 0, A2: 0, B1: 0, B2: Infinity, C1: Infinity },
    probes: 3,
    produced:  { A1: 1, A2: 1, B1: 2, B2: 2, C1: 2 }
  },
  passage: {
    words:     { A1: [40, 80], A2: [80, 140], B1: [140, 220], B2: [220, 320], C1: [300, 450] },
    sentLen:   { A1: 10, A2: 12, B1: 16, B2: 22, C1: 28 },
    rare:      { A1: 5, A2: 6, B1: 8, B2: 10, C1: 12 }
  },
  writing: {
    // [min model words for a task to count as band-length, required share %]
    long:      { A1: [8, 40], A2: [30, 50], B1: [80, 50], B2: [140, 60], C1: [200, 60] }
  }
};
// level gate -> band, as in tools/variety.js
const BAND = n => n <= 1 ? 'A1' : n <= 3 ? 'A2' : n <= 5 ? 'B1' : n <= 7 ? 'B2' : 'C1';

const FREQ = new Set(fs.readFileSync(path.join(__dirname, 'freq-es-3000.txt'), 'utf8')
  .split('\n').filter(l => l && l[0] !== '#'));
/* The course's own vocabulary up to each band counts as known: a word the
 * learner was taught is not rare to them, however rare it is in subtitles. */
const KNOWN = {};
const BANDS_UP = b => BANDS.slice(0, BANDS.indexOf(b) + 1);
const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
const tokES = s => strip(s).toLowerCase().match(/[a-záéíóúüñ]+/g) || [];
const tokEN = s => strip(s).match(/[A-Za-z']+/g) || [];
// Spanish set in <i> is example text, not explanation
const english = h => tokEN(String(h || '').replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<i>[\s\S]*?<\/i>/g, ' ')).length;
const sentences = s => strip(s).split(/[.!?¿¡…]+/).map(x => x.trim()).filter(x => /[a-záéíóúñ]/i.test(x));

/* Spanish grammar terms a learner would read. Deliberately the terminology
 * itself, not every word that could be one: "adjetivo" yes, "valor" no. */
BANDS.forEach(b => { const ok = new Set(BANDS_UP(b)); KNOWN[b] = new Set((W.VOCAB || []).filter(v => ok.has(v.cefr)).flatMap(v => tokES(v.es))); });

const ES_JARGON = /\b(oraci[oó]n\w*|enunciativ\w*|interrogativ\w*|exclamativ\w*|complemento\w*|sintagma\w*|determinante\w*|cuantificador\w*|[aá]tono\w*|t[oó]nico\w*|cl[ií]tico\w*|per[ií]frasis|de[ií]ctic\w*|anaf[oó]ric\w*|subordinad\w*|coordinad\w*|concesiv\w*|adversativ\w*|copulativ\w*|atributo|predicado\w*|sustantiv\w*|adjetiv\w*|adverbi\w*|pronombre\w*|preposici\w*|conjunci\w*|morfolog\w*|sintaxis|exponente\w*)\b/gi;
const ABBREV = /\b(OD|OI|CD|CI|CC|SN|SV|V\.|S\.|ODs|OIs)\b/;

const results = {};   // check -> band -> {pass, n, fails: []}
function record(check, band, ok, id, why) {
  const c = results[check] = results[check] || {};
  const b = c[band] = c[band] || { pass: 0, n: 0, fails: [] };
  b.n++; if (ok) b.pass++; else b.fails.push(id + (why ? ' — ' + why : ''));
}

/* ---- lessons, in course order ------------------------------------------ */
const byId = {}; W.GRAMMAR_LESSONS.forEach(l => { byId[l.id] = l; });
W.COURSE_DAYS.forEach((d, day) => {
  const l = d.lesson && byId[d.lesson]; if (!l) return;
  const band = d.band, L = LIMITS.lesson, id = `day ${day} ${l.id}`;
  /* Phrases to LEARN: keywords and exponents, de-duplicated. Examples and
   * contrast lines illustrate them and are not counted — otherwise a lesson
   * built around one short dialogue pays for every line of it twice. */
  const norm = s => tokES(s).join(' ');
  const phrases = new Set((l.keywords || []).concat(l.exponents || []).map(k => norm(k.es))).size;
  const prose = [l.summary].concat((l.sections || []).map(s => s.h + ' ' + s.html), l.pitfalls || [],
    (l.contrasts || []).map(c => c.note), (l.exponents || []).map(e => e.note)).join(' ');
  const visible = strip(prose) + ' ' + l.title;
  const jargon = (visible.match(ES_JARGON) || []).length;
  const heads = [l.title].concat((l.sections || []).map(s => s.h)).join(' | ');
  const probes = l.probes || [];
  record('look: phrases to learn', band, phrases <= L.phrases[band], id, phrases + ' > ' + L.phrases[band]);
  record('look: English words', band, english(prose) <= L.enWords[band], id, english(prose) + ' > ' + L.enWords[band]);
  record('look: sections', band, (l.sections || []).length <= L.sections[band], id, (l.sections || []).length + ' > ' + L.sections[band]);
  record('lesson: no Spanish terminology A1–B1', band, jargon <= L.jargon[band], id, jargon + ' terms');
  record('lesson: no abbreviations in headings', band, !ABBREV.test(heads), id, (heads.match(ABBREV) || [])[0]);
  record('lesson: ≥3 probes', band, probes.length >= L.probes, id, probes.length + ' probes');
  const produced = probes.filter(p => p.kind === 'cloze').length;
  record('lesson: produced answers', band, produced >= L.produced[band], id, produced + ' typed');
});

/* ---- the grammar spine --------------------------------------------------
 * The headline target in TEACHING_STANDARDS.md: by which day each core tool
 * has been taught. A tool counts as taught on the first day any of its
 * lessons appears. A tool with no lesson (ir a + infinitive, today) is
 * reported as missing. Keep this table and the one in the standards together. */
const SPINE = [
  ['Present tense, regular verbs', 3, ['presente']],
  ['Ser and estar', 5, ['ser-estar']],
  ['Gender, articles, plurals', 6, ['gender-articles', 'gr-genero-sustantivos-a1', 'gr-numero-sustantivos-a1', 'gr-articulo-definido-a1']],
  ['Adjective agreement', 8, ['gr-genero-adjetivo-a1']],
  ['Questions and negation', 8, ['gr-interrogativos-a1']],
  ['Irregular and stem-changing present', 12, ['gr-presente-irregular-a2']],
  ['Gustar and verbs like it', 15, ['gr-verbos-predicativos-tipos-a2']],
  ['Ir a + infinitive', 15, []],
  ['Reflexive verbs', 18, ['gr-pronombre-se-a1']],
  ['Possessives and demonstratives', 20, ['gr-posesivos-forma-a1', 'gr-demostrativos-distribucion-a1']],
  ['Direct object pronouns, personal a', 25, ['gr-objeto-directo-a1', 'gr-pronombres-atonos-a2']],
  ['Preterite', 30, ['preterito']],
  ['Imperfect', 40, ['imperfecto']],
  ['Preterite vs imperfect', 45, ['preterite-imperfect']],
  ['Indirect object pronouns, se lo', 50, ['gr-objeto-indirecto-a2', 'gr-pronombres-combinados-b1']],
  ['Present perfect', 50, ['gr-preterito-perfecto-a2']],
  ['Affirmative commands', 55, ['gr-imperativo-forma-a2']],
  ['Comparatives; por and para', 60, ['gr-comparativos-a2', 'por-para']],
  ['Present subjunctive', 80, ['gr-presente-subjuntivo-b1']],
  ['Future and conditional', 90, ['futuro', 'condicional']],
  ['Negative commands; relative clauses', 100, ['impneg', 'gr-relativas-b1']],
  ['Imperfect subjunctive, compound tenses', 130, ['impsubj', 'gr-pluscuamperfecto-b1', 'futperf', 'condperf', 'perfsubj']]
];
const dayOf = {}; W.COURSE_DAYS.forEach((d, i) => { if (d.lesson && !(d.lesson in dayOf)) dayOf[d.lesson] = i; });
// a tool with several lessons is fully taught when its LAST lesson has appeared
const spine = SPINE.map(([tool, target, ids]) => {
  const days = ids.map(id => dayOf[id]).filter(x => x != null);
  return { tool, target, day: days.length === ids.length && ids.length ? Math.max(...days) : null };
});

/* ---- passages ------------------------------------------------------------ */
W.PASSAGES.forEach(p => {
  const band = BAND(p.level), L = LIMITS.passage, id = p.id;
  const toks = tokES(p.text);
  const glossed = new Set((p.gloss || []).flatMap(g => tokES(g.es)));
  // a capitalised word the list does not know is a name (Tom, Valencia), not vocabulary
  const names = new Set((strip(p.text).match(/[A-ZÁÉÍÓÚÑ][a-záéíóúüñ]+/g) || []).map(w => w.toLowerCase()).filter(w => !FREQ.has(w)));
  const known = KNOWN[band];
  const rare = toks.length ? 100 * toks.filter(t => !FREQ.has(t) && !glossed.has(t) && !names.has(t) && !known.has(t)).length / toks.length : 0;
  const sl = sentences(p.text).map(s => tokES(s).length);
  const mean = sl.length ? sl.reduce((a, b) => a + b, 0) / sl.length : 0;
  const [lo, hi] = L.words[band];
  record('passage: length in band range', band, toks.length >= lo && toks.length <= hi, id, toks.length + ' words, want ' + lo + '–' + hi);
  record('passage: words per sentence', band, mean <= L.sentLen[band], id, mean.toFixed(1) + ' > ' + L.sentLen[band]);
  record('passage: rare unglossed words', band, rare <= L.rare[band], id, rare.toFixed(1) + '% > ' + L.rare[band] + '%');
});

/* ---- writing: share of band-length tasks --------------------------------- */
const share = {};
W.WRITING_TASKS.forEach(w => {
  const band = BAND(w.level), model = (w.models || [w.model || ''])[0] || '';
  const s = share[band] = share[band] || { long: 0, n: 0 };
  s.n++; if (tokES(model).length >= LIMITS.writing.long[band][0]) s.long++;
});

/* ---- report --------------------------------------------------------------- */
const failsFor = process.argv[2] === '--fails' ? process.argv[3] : null;
if (failsFor) {
  Object.keys(results).forEach(check => {
    const b = results[check][failsFor]; if (!b || !b.fails.length) return;
    console.log('\n' + check + ' — ' + b.fails.length + ' of ' + b.n + ' fail');
    b.fails.forEach(f => console.log('  ' + f));
  });
  process.exit(0);
}
console.log('Grammar spine — day each core tool is fully taught (target in brackets)');
spine.forEach(r => console.log('  ' + (r.day != null && r.day <= r.target ? '✓' : '✗') + ' ' + String(r.tool).padEnd(42) +
  String(r.day == null ? 'missing' : 'day ' + r.day).padEnd(12) + '(' + r.target + ')'));
console.log('  ' + spine.filter(r => r.day != null && r.day <= r.target).length + ' of ' + spine.length + ' on time\n');
const pct = b => b ? Math.round(100 * b.pass / b.n) + '%' : '—';
const pad = (s, n) => String(s).padEnd(n);
console.log('"look:" rows are diagnostics, not targets.');
console.log(pad('check (share passing)', 40) + BANDS.map(b => pad(b, 7)).join(''));
Object.keys(results).forEach(check => console.log(pad(check, 40) + BANDS.map(b => pad(pct(results[check][b]), 7)).join('')));
console.log(pad('writing: tasks at band length', 40) + BANDS.map(b => {
  const s = share[b]; if (!s) return pad('—', 7);
  const got = Math.round(100 * s.long / s.n), want = LIMITS.writing.long[b][1];
  return pad(got + '%' + (got >= want ? '' : '✗'), 7);
}).join(''));
console.log('\nWriting target share: ' + BANDS.map(b => b + ' ' + LIMITS.writing.long[b][1] + '%').join(', ') + '. ✗ = below target.');
console.log('Details: node tools/audit-standards.js --fails A1');
