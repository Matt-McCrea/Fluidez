#!/usr/bin/env node
/* ============================================================================
 * syllabus.js — derive a full A1-C1 syllabus from spec/pcic.json.
 *
 *   node tools/harvest/syllabus.js
 *     -> spec/syllabus-draft.json    machine-readable, one record per lesson
 *     -> spec/syllabus-outline.txt   for reading and cutting
 *
 * A LESSON UNIT is one cluster of PCIC specification items that share a level
 * and a teaching point (section › subsection › first heading). That is the
 * natural grain: "9.1.3. Pretérito indefinido › Valores", "2.4. Valorar",
 * "1.2. Marcadores del discurso". Clusters below MIN_ITEMS are folded into
 * their parent rather than becoming a lesson of their own.
 *
 * LEVELS. The app gates content by level (content at or below your level can
 * appear). Levels 1-5 are already in use and are NOT disturbed — they stay the
 * A1-B1 tense ladder in js/lessons.js. Everything new lands at 6-10:
 *
 *   1-2   A1      presente, ser/estar, gender          (existing)
 *   2-3   A2      pasado, por/para                     (existing)
 *   3-5   B1      futuro/condicional/perfecto, subj.   (existing)
 *   6-7   B2      subordination, se-constructions, reported speech, register
 *   8-10  C1      argumentation, pragmatics, nuance, genre command
 *
 * ORDERING. The PCIC assigns a level but no order. Within a level we order by
 * type (grammar before the functions that use it), then by the inventory's own
 * numbering. Where an item cross-references another inventory, that becomes a
 * PREREQUISITE — 1,550 of those links were resolved at harvest time — and a
 * prerequisite landing at a HIGHER level than the lesson needing it is
 * reported as an ordering violation to fix by hand.
 * ========================================================================== */
'use strict';

const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const spec = require(path.join(ROOT, 'spec', 'pcic.json'));
const LEX = require('./lexis.js');

const MIN_ITEMS = 3;
/* PCIC level -> the app levels it may occupy. The existing ladder in
 * js/lessons.js already spends L1-L5 on the A1-B1 tense system, so new A1-B1
 * material (functions, discourse, notions — none of which the app teaches at
 * all) slots alongside it, and B2/C1 extends the ladder to L10. */
const BANDS = { A1: [1], A2: [2], B1: [3, 4, 5], B2: [6, 7], C1: [8, 9, 10] };

const TYPE = {
  gramatica: 'grammar', funciones: 'function', tacticas_pragmaticas: 'discourse',
  generos_discursivos: 'genre', nociones_generales: 'notion'
};
const TYPE_ORDER = { grammar: 0, notion: 1, function: 2, discourse: 3, genre: 4 };

/* PCIC repeats a handful of structural sub-headings under every point. On
 * their own they name nothing teachable, so the subsection carries the title. */
const GENERIC = /^(forma|valor|valores|significado|distribuci|recursos|irregularidad|clases|tipos|usos|otros|posici|estructura|combinat)/i;
function titleFor(section, subsection, leaf) {
  const L = stripNum(leaf || ''), S = stripNum(subsection || section || '');
  if (!L || GENERIC.test(L)) return S + (L ? ' — ' + L : '');
  return L;
}

const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const stripNum = s => String(s).replace(/^[\d.]+\s*/, '').trim();
const secNum = s => { const m = String(s || '').match(/^([\d.]+)/); return m ? m[1] : '99'; };
const numKey = s => secNum(s).split('.').map(n => String(n).padStart(3, '0')).join('.');

/* ---- 1. cluster the spec into lesson units ------------------------------- */
const units = new Map();
spec.filter(i => TYPE[i.inventory] && BANDS[i.level]).forEach(i => {
  const point = i.path[0] || i.subsection || i.section;
  const key = [i.inventory, i.level, i.section, i.subsection, i.path[0] || ''].join('||');
  let u = units.get(key);
  if (!u) {
    u = {
      id: [TYPE[i.inventory].slice(0, 4), i.level.toLowerCase(),
           slug(titleFor(i.section, i.subsection, i.path[0]))].join('-'),
      type: TYPE[i.inventory], inventory: i.inventory, pcicLevel: i.level,
      group: stripNum(i.section || ''), title: titleFor(i.section, i.subsection, i.path[0]),
      section: i.section, subsection: i.subsection, leaf: i.path[0] || null,
      items: [], examples: [], prereqs: new Set(), sort: numKey(i.section) + '/' + numKey(i.subsection)
    };
    units.set(key, u);
  }
  u.items.push({ pattern: i.pattern, examples: i.examples, path: i.path });
  (i.examples || []).forEach(e => { if (u.examples.length < 6) u.examples.push(e); });
  (i.xrefs || []).forEach(x => {
    // only a grammar/notion point is a real prerequisite, and it must resolve to
    // a specific subsection — matching a whole section matches half the syllabus
    if (!x.inventory || x.inventory === i.inventory || !x.subsection) return;
    if (x.inventory !== 'gramatica' && x.inventory !== 'nociones_generales') return;
    u.prereqs.add(x.inventory + '||' + x.section + '||' + x.subsection);
  });
});

/* fold undersized clusters into the parent subsection rather than dropping */
const kept = [], folded = [];
for (const u of units.values()) (u.items.length >= MIN_ITEMS ? kept : folded).push(u);
folded.forEach(f => {
  const parent = kept.find(u => u.inventory === f.inventory && u.pcicLevel === f.pcicLevel &&
                                u.section === f.section && u.subsection === f.subsection);
  if (parent) { parent.items.push(...f.items); f.foldedInto = parent.id; }
});
folded.filter(f => !f.foldedInto).forEach(f => {
  const parent = kept.find(u => u.inventory === f.inventory && u.pcicLevel === f.pcicLevel && u.section === f.section);
  if (parent) { parent.items.push(...f.items); f.foldedInto = parent.id; }
});
const orphans = folded.filter(f => !f.foldedInto);

/* ---- 2. assign an app level --------------------------------------------- */
/* Each PCIC band owns 1-3 app levels. Distribute each type evenly across them in
 * the inventory's own order, so every level carries a mix of grammar, function
 * and discourse work rather than a level of nothing but genres. */
const buckets = {};
kept.forEach(u => { (buckets[u.pcicLevel + '||' + u.type] = buckets[u.pcicLevel + '||' + u.type] || []).push(u); });
Object.keys(buckets).forEach(k => {
  const [band, ] = k.split('||');
  const levels = BANDS[band], group = buckets[k];
  group.sort((a, b) => a.sort.localeCompare(b.sort) || a.title.localeCompare(b.title));
  const per = Math.ceil(group.length / levels.length);
  group.forEach((u, n) => { u.level = levels[Math.min(levels.length - 1, Math.floor(n / per))]; });
});

/* ---- 3. resolve prerequisites into lesson ids ---------------------------- */
const bySub = {};
kept.forEach(u => { const k = u.inventory + '||' + u.section + '||' + u.subsection;
  (bySub[k] = bySub[k] || []).push(u); });
const violations = [];
kept.forEach(u => {
  const ids = new Set();
  u.prereqs.forEach(k => {
    // A referenced point is taught once per level. Satisfy the prerequisite
    // with the latest copy at or below this lesson's level; only if EVERY copy
    // is taught later is the ordering genuinely wrong.
    const cands = (bySub[k] || []).filter(p => p.id !== u.id);
    if (!cands.length) return;
    const ok = cands.filter(p => p.level <= u.level).sort((a, b) => b.level - a.level)[0];
    if (ok) ids.add(ok.id);
    else violations.push([u, cands.sort((a, b) => a.level - b.level)[0]]);
  });
  u.prereqIds = [...ids].slice(0, 6);
  delete u.prereqs;
});

/* ---- 4. order ------------------------------------------------------------ */
kept.sort((a, b) => a.level - b.level ||
  TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.sort.localeCompare(b.sort) || a.title.localeCompare(b.title));
kept.forEach((u, n) => { u.seq = n + 1; });

/* ---- 5. vocabulary days -------------------------------------------------- */
const headwords = {}, collocs = {};
spec.filter(i => i.inventory === 'nociones_especificas' && BANDS[i.level]).forEach(i => {
  const k = i.level + '||' + (i.section || '?');
  (headwords[k] = headwords[k] || new Set());
  (collocs[k] = collocs[k] || new Set());
  LEX.headwords(i.pattern).forEach(w => headwords[k].add(w));
  LEX.collocations(i.pattern).forEach(c => collocs[k].add(c));
});
const vocabDays = [];
Object.keys(headwords).sort().forEach(k => {
  const [lvl, section] = k.split('||');
  const words = [...headwords[k]], colls = [...collocs[k]];
  const nDays = Math.ceil(words.length / 12);
  const lvls = BANDS[lvl];
  for (let i = 0; i < words.length; i += 12) {
    const d = Math.floor(i / 12);
    // spread a theme's days across the band, so L4/L5 are not left empty
    const level = lvls[Math.min(lvls.length - 1, Math.floor(d * lvls.length / nDays))];
    vocabDays.push({ type: 'vocab', pcicLevel: lvl, level, theme: stripNum(section),
      part: d + 1, of: nDays, words: words.slice(i, i + 12),
      // collocations for the theme, dealt out across its days
      collocations: colls.filter((_, ci) => ci % nDays === d).slice(0, 8) });
  }
});

/* ---- 6. write ------------------------------------------------------------ */
const draft = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'Plan Curricular del Instituto Cervantes (spec/pcic.json)',
  totals: { lessons: kept.length, vocabDays: vocabDays.length, lessonDays: kept.length + vocabDays.length },
  lessons: kept.map(u => ({
    seq: u.seq, id: u.id, type: u.type, level: u.level, cefr: u.pcicLevel,
    title: u.title, group: u.group, teaches: u.items.length,
    prereqs: u.prereqIds,
    source: { inventory: u.inventory, section: u.section, subsection: u.subsection, leaf: u.leaf },
    examples: u.examples.slice(0, 4),
    spec: u.items.map(i => i.pattern).slice(0, 40)
  })),
  vocabDays
};
fs.writeFileSync(path.join(ROOT, 'spec', 'syllabus-draft.json'), JSON.stringify(draft, null, 1));

const out = [];
const say = s => out.push(s);
say('FLUIDEZ — draft syllabus derived from the Plan Curricular del Instituto Cervantes');
say('='.repeat(94));
say('');
say(kept.length + ' lessons + ' + vocabDays.length + ' vocab days = ' +
    (kept.length + vocabDays.length) + ' lesson-days');
say('  (at one lesson-day per day, ' + (Math.round((kept.length + vocabDays.length) / 365 * 10) / 10) + ' years A1->C1)');
say('');
const byLevel = {}, byType = {};
kept.forEach(u => { byLevel[u.level] = byLevel[u.level] || { n: 0, t: {} }; byLevel[u.level].n++;
  byLevel[u.level].t[u.type] = (byLevel[u.level].t[u.type] || 0) + 1;
  byType[u.type] = (byType[u.type] || 0) + 1; });
vocabDays.forEach(v => { byLevel[v.level] = byLevel[v.level] || { n: 0, t: {} };
  byLevel[v.level].t.vocab = (byLevel[v.level].t.vocab || 0) + 1; });
say('level  CEFR   grammar  notion  function  discourse  genre   vocab   TOTAL');
say('-'.repeat(94));
const CEFR_OF = l => l <= 1 ? 'A1' : l <= 3 ? 'A2' : l <= 5 ? 'B1' : l <= 7 ? 'B2' : 'C1';
Object.keys(byLevel).map(Number).sort((a, b) => a - b).forEach(l => {
  const t = byLevel[l].t, tot = Object.values(t).reduce((a, b) => a + b, 0);
  say('  L' + String(l).padEnd(4) + CEFR_OF(l).padEnd(7) +
      ['grammar', 'notion', 'function', 'discourse', 'genre', 'vocab']
        .map(k => String(t[k] || '·').padStart(k === 'grammar' ? 7 : 8)).join('') +
      String(tot).padStart(8));
});
say('-'.repeat(94));
say('  existing app content occupies L1-L5 and is untouched; L6-L10 is all new.');
say('');
if (violations.length) {
  say('ORDERING VIOLATIONS — a lesson needs a prerequisite taught later (' + violations.length + '):');
  violations.slice(0, 12).forEach(([u, p]) =>
    say('  L' + u.level + ' ' + u.title.slice(0, 34).padEnd(36) + ' needs  L' + p.level + ' ' + p.title.slice(0, 34)));
  say('');
}
if (orphans.length) say(orphans.length + ' clusters below ' + MIN_ITEMS + ' items had no parent subsection and were dropped.\n');

say('='.repeat(94));
say('THE LADDER');
say('='.repeat(94));
let curLevel = null;
kept.forEach(u => {
  if (u.level !== curLevel) {
    curLevel = u.level;
    say('');
    say('─── L' + curLevel + '  (' + CEFR_OF(curLevel) + ')  ' + '─'.repeat(70));
  }
  say('  ' + String(u.seq).padStart(4) + '  ' + u.type.padEnd(10) + u.title.slice(0, 44).padEnd(46) +
      String(u.items.length).padStart(4) + ' pts   ' + (u.group || '').slice(0, 30));
});
fs.writeFileSync(path.join(ROOT, 'spec', 'syllabus-outline.txt'), out.join('\n') + '\n');
console.log(out.slice(0, 40).join('\n'));
console.log('\n→ spec/syllabus-draft.json   spec/syllabus-outline.txt (' + out.length + ' lines)');
