#!/usr/bin/env node
/* ============================================================================
 * audit-tenses.js — when does the course first teach each tense, and what can
 * a learner read before it does?
 *
 *   node tools/audit-tenses.js
 *
 * The question this answers is the one that started the whole passage/tense
 * piece of work: A1 ran for 96 days with no past tense in any lesson and no
 * past tense in any of its 90 passages, so a beginner could describe their
 * routine for three months and still not say what they did at the weekend.
 *
 * "Day N" means the Nth day of COURSE_DAYS — the path a learner actually
 * walks, 1-based. It does NOT count the days inside optional units: those cost
 * no day and are offered rather than walked, so including them describes a
 * course nobody takes. (An earlier count that included them read 15 days
 * higher throughout — preterite on 112 rather than 97.)
 *
 * The reading column is the half that matters. A tense taught on day 72 is
 * only worth teaching if there is something to read that contains one, and the
 * `tenses` field on each passage (tools/tense-index.js) is what says so.
 * ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
['data/taxonomy.js', 'data/connectors.js', 'data/strand-lessons.js', 'data/course.js',
 'data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/grammar-docs.js', 'data/grammar.js',
 'data/passages.js', 'data/apply.js', 'data/writing.js', 'data/topics.js', 'data/resources.js',
 'js/engine.js', 'js/lessons.js'].forEach(f =>
  (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8')));

const E = window.ENGINE;
const DAYS = window.COURSE_DAYS || [];
const SEED = window.SEED_SYLLABUS || [];
const TENSE_LEVEL = {};
SEED.forEach(s => { if (E.TENSES.some(t => t.key === s.id)) TENSE_LEVEL[s.id] = s.level; });

// tense key -> the lesson that teaches it (the merge carries `tense` across)
const byId = {};
(window.ALL_LESSONS || []).forEach(l => { byId[l.id] = l; });
const firstDay = {}, firstLesson = {};
DAYS.forEach((d, i) => {
  const l = d.lesson && byId[d.lesson];
  if (!l) return;
  const tk = l.tense || (TENSE_LEVEL[l.id] != null ? l.id : null);
  if (tk && firstDay[tk] == null) { firstDay[tk] = i + 1; firstLesson[tk] = l.id; }
});

const bandStart = window.COURSE_BANDS || {};
const bandOfDay = n => {
  let out = '—';
  Object.keys(bandStart).sort((a, b) => bandStart[a] - bandStart[b])
    .forEach(c => { if (n - 1 >= bandStart[c]) out = c; });
  return out;
};

const PASSAGES = window.PASSAGES || [];
const needs = tk => PASSAGES.filter(p => (p.tenses || []).indexOf(tk) !== -1);

console.log(`Course: ${DAYS.length} walked days.  Bands: ` +
  Object.keys(bandStart).sort((a, b) => bandStart[a] - bandStart[b])
    .map(c => `${c}@${bandStart[c] + 1}`).join('  '));
console.log('');
console.log('tense         lvl  first taught          band   passages   readable before');
console.log('────────────────────────────────────────────────────────────────────────────');

SEED.filter(s => TENSE_LEVEL[s.id] != null)
  .sort((a, b) => (firstDay[a.id] || 9e9) - (firstDay[b.id] || 9e9))
  .forEach(s => {
    const tk = s.id, d = firstDay[tk];
    const ps = needs(tk);
    /* How many passages a learner could open on the day BEFORE this tense
     * arrives: every passage at or below their level whose tenses they have
     * all reached. A tense with a big number behind it is well supplied; a
     * small one means the learner is taught something and handed nothing
     * written in it. */
    const reached = new Set(SEED.filter(x => TENSE_LEVEL[x.id] != null &&
      firstDay[x.id] != null && firstDay[x.id] < (d || 9e9)).map(x => x.id));
    const readable = PASSAGES.filter(p =>
      (p.tenses || []).every(t => reached.has(t))).length;
    console.log(
      tk.padEnd(13) + String(s.level).padStart(3) +
      (d ? `  day ${String(d).padStart(3)} · ${firstLesson[tk]}`.slice(0, 24).padEnd(25)
         : '  (never placed)'.padEnd(25)) +
      (d ? bandOfDay(d) : '—').padEnd(7) +
      String(ps.length).padStart(8) + String(readable).padStart(11));
  });

/* The headline the work is judged on: what is there to read in the stretch
 * before the past tense arrives, and does any of it contain one. */
const pastDay = Math.min(firstDay.preterito || 9e9, firstDay.perfecto || 9e9);
const a1 = PASSAGES.filter(p => (p.level || 1) === 1);
const a1past = a1.filter(p => (p.tenses || []).some(t => t === 'preterito' || t === 'perfecto' ||
                                                         t === 'imperfecto'));
console.log('');
console.log(`First past tense: day ${pastDay === 9e9 ? '—' : pastDay} of ${DAYS.length}` +
            ` (${bandOfDay(pastDay)}).`);
console.log(`Level-1 passages: ${a1.length}, of which ${a1past.length} carry a past tense ` +
            `(${Math.round(100 * a1past.length / Math.max(1, a1.length))}%).`);
