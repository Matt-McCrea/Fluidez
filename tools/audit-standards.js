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
    phrases:   { A1: 10, A2: 12, B1: 14, B2: 16, C1: 18 },
    keywords:  { A1: 8, A2: 8, B1: 10, B2: 10, C1: 12 },
    enWords:   { A1: 150, A2: 180, B1: 220, B2: 260, C1: 280 },
    sections:  { A1: 3, A2: 3, B1: 4, B2: 5, C1: 5 },
    jargon:    { A1: 0, A2: 0, B1: 2, B2: 4, C1: Infinity },
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
  record('lesson: phrases to learn', band, phrases <= L.phrases[band], id, phrases + ' > ' + L.phrases[band]);
  record('lesson: new keywords', band, (l.keywords || []).length <= L.keywords[band], id, (l.keywords || []).length + ' > ' + L.keywords[band]);
  record('lesson: English words', band, english(prose) <= L.enWords[band], id, english(prose) + ' > ' + L.enWords[band]);
  record('lesson: sections', band, (l.sections || []).length <= L.sections[band], id, (l.sections || []).length + ' > ' + L.sections[band]);
  record('lesson: Spanish grammar terms', band, jargon <= L.jargon[band], id, jargon + ' terms');
  record('lesson: no abbreviations in headings', band, !ABBREV.test(heads), id, (heads.match(ABBREV) || [])[0]);
  record('lesson: ≥3 probes', band, probes.length >= L.probes, id, probes.length + ' probes');
  const produced = probes.filter(p => p.kind === 'cloze').length;
  record('lesson: produced answers', band, produced >= L.produced[band], id, produced + ' typed');
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
const pct = b => b ? Math.round(100 * b.pass / b.n) + '%' : '—';
const pad = (s, n) => String(s).padEnd(n);
console.log(pad('check (share passing)', 40) + BANDS.map(b => pad(b, 7)).join(''));
Object.keys(results).forEach(check => console.log(pad(check, 40) + BANDS.map(b => pad(pct(results[check][b]), 7)).join('')));
console.log(pad('writing: tasks at band length', 40) + BANDS.map(b => {
  const s = share[b]; if (!s) return pad('—', 7);
  const got = Math.round(100 * s.long / s.n), want = LIMITS.writing.long[b][1];
  return pad(got + '%' + (got >= want ? '' : '✗'), 7);
}).join(''));
console.log('\nWriting target share: ' + BANDS.map(b => b + ' ' + LIMITS.writing.long[b][1] + '%').join(', ') + '. ✗ = below target.');
console.log('Details: node tools/audit-standards.js --fails A1');
