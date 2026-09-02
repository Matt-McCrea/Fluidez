#!/usr/bin/env node
/* ============================================================================
 * pcic.js — harvest the Plan Curricular del Instituto Cervantes into JSON.
 *
 *   node tools/harvest/pcic.js fetch    download the 46 pages into cache/
 *   node tools/harvest/pcic.js parse    cache -> spec/pcic.json + a summary
 *   node tools/harvest/pcic.js          both
 *
 * WHY: the PCIC is not prose, it is a machine-readable A1-C2 specification —
 * every grammar point, communicative function, discourse genre and topical
 * vocabulary set the Instituto Cervantes assigns to each level, WITH worked
 * examples. It is the syllabus for everything above our current L5 ceiling.
 * We harvest the spec; we do not ship their text. spec/ is gitignored and the
 * app ships only content generated from it.
 *
 * The pages are 2006-era hand-written HTML: each inventory subsection is a
 * <table> whose COLUMNS ARE THE LEVELS (col 1 = B1, col 2 = B2), each cell an
 * <ul> of specification items. Inside an <li>: the plain text is the pattern,
 * <em> holds worked examples, <abbr title> expands grammar shorthand, and a
 * trailing [v. Gramática 15.3.5.] links to the related point in another
 * inventory. Nested <ul> means the parent <li> is a category label.
 * ========================================================================== */
'use strict';

const fs = require('fs'), path = require('path');
const H = require('./html.js');

const BASE = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/';
const ROOT = path.join(__dirname, '..', '..');
const CACHE = path.join(__dirname, 'cache');
const OUT = path.join(ROOT, 'spec');

const INVENTORIES = [
  ['02', 'gramatica'], ['03', 'pronunciacion'], ['04', 'ortografia'], ['05', 'funciones'],
  ['06', 'tacticas_pragmaticas'], ['07', 'generos_discursivos'], ['08', 'nociones_generales'],
  ['09', 'nociones_especificas']
];
const BANDS = ['a1-a2', 'b1-b2', 'c1-c2'];
// inventories 10-13 are not split by level (they use "fases", or no columns)
const UNLEVELLED = [['10', 'referentes_culturales'], ['11', 'saberes_y_comportamientos'],
                    ['12', 'habilidades_y_actitudes'], ['13', 'procedimientos_aprendizaje']];

function pages() {
  const out = [];
  INVENTORIES.forEach(([n, name]) => BANDS.forEach(b =>
    out.push({ file: `${n}_${name}_inventario_${b}.htm`, inv: name, invNum: n, levels: b.toUpperCase().split('-') })));
  UNLEVELLED.forEach(([n, name]) =>
    out.push({ file: `${n}_${name}_inventario.htm`, inv: name, invNum: n, levels: null }));
  return out;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchAll() {
  fs.mkdirSync(CACHE, { recursive: true });
  let got = 0, cached = 0, failed = [];
  for (const p of pages()) {
    const dest = path.join(CACHE, p.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) { cached++; continue; }
    try {
      const res = await fetch(BASE + p.file, { headers: { 'User-Agent': 'Fluidez-harvest/1.0 (personal study app)' } });
      if (!res.ok) { failed.push(`${p.file} (HTTP ${res.status})`); continue; }
      // the pages declare iso-8859-1 but are served as UTF-8 — decode as UTF-8
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      got++; process.stdout.write(`  ↓ ${p.file}\n`);
      await sleep(600);                       // be a polite guest
    } catch (e) { failed.push(`${p.file} (${e.message})`); }
  }
  console.log(`fetch: ${got} downloaded, ${cached} already cached` + (failed.length ? `, ${failed.length} FAILED` : ''));
  failed.forEach(f => console.error('  ✗ ' + f));
}

const LEVEL_RE = /^(A1|A2|B1|B2|C1|C2)$/;
const PHASE_RE = /^Fase de (aproximación|profundización|consolidación)$/i;

/* Read the level labels off a table's header row, if it has one. Falls back to
 * the levels implied by the filename, assigned left-to-right. */
function columnLevels(table, fallback) {
  for (const tr of H.find(table, 'tr')) {
    const cells = H.findChildren(tr, 'td').concat(H.findChildren(tr, 'th'));
    if (cells.length < 2) continue;
    const labels = cells.map(c => H.text(c).trim());
    if (labels.every(l => LEVEL_RE.test(l))) return { levels: labels, headerRow: tr };
    if (labels.every(l => PHASE_RE.test(l))) return { levels: labels, headerRow: tr };
  }
  return { levels: fallback, headerRow: null };
}

/* Pull the specification items out of one <td>. Nested <ul>s make a path:
 * "Lugar > Adv. lugar, locución adverbial". */
function itemsFromCell(cell, ctx, level, out) {
  // A <td> is not a flat list: the inventory's deepest headings (9.1.1. Presente,
  // 9.1.2. Pretérito perfecto…) sit INSIDE the cell, ahead of the <ul> they
  // label. Walk the cell's children in document order so each list inherits the
  // heading above it — without this the tense/point name is lost entirely.
  let cellHeading = null;
  function walkList(ul, trail) {
    for (const li of H.findChildren(ul, 'li')) {
      const pattern = H.directText(li, ['em', 'p', 'ul', 'ol']);
      const examples = H.find(li, 'em', ['ul', 'ol']).map(H.text).filter(Boolean);
      const xrefs = H.find(li, 'a', ['ul', 'ol']).map(a => ({ label: H.text(a), href: a.attrs.href || '' }))
        .filter(x => x.href);
      const abbrs = {};
      H.find(li, 'abbr', ['ul', 'ol']).forEach(a => { if (a.attrs.title) abbrs[H.text(a)] = a.attrs.title; });
      const nested = H.findChildren(li, 'ul').concat(H.findChildren(li, 'ol'));

      if (pattern || examples.length) {
        out.push({
          id: `${ctx.inv}:${level}:${out.length + 1}`,
          inventory: ctx.inv, invNum: ctx.invNum, level,
          section: ctx.section || null, subsection: ctx.subsection || null,
          path: (ctx.group ? [ctx.group] : []).concat(cellHeading ? [cellHeading] : []).concat(trail),
          pattern, examples,
          abbr: Object.keys(abbrs).length ? abbrs : undefined,
          xrefs: xrefs.length ? xrefs : undefined
        });
      }
      nested.forEach(n => walkList(n, pattern ? trail.concat(pattern) : trail));
    }
  }
  let sawList = false;
  (function scan(node) {
    for (const c of node.children || []) {
      if (typeof c === 'string') continue;
      if (/^h[1-6]$/.test(c.tag)) cellHeading = H.text(c) || cellHeading;
      else if (c.tag === 'ul' || c.tag === 'ol') { sawList = true; walkList(c, []); }
      else if (c.tag !== 'table') scan(c);      // descend through div/p wrappers
    }
  })(cell);

  // some cells hold a bare paragraph rather than a list
  if (!sawList) {
    const t = H.directText(cell, ['em']);
    const ex = H.find(cell, 'em').map(H.text).filter(Boolean);
    if (t && t.length > 2 && !LEVEL_RE.test(t)) {
      out.push({ id: `${ctx.inv}:${level}:${out.length + 1}`, inventory: ctx.inv, invNum: ctx.invNum,
        level, section: ctx.section || null, subsection: ctx.subsection || null,
        path: (ctx.group ? [ctx.group] : []).concat(cellHeading ? [cellHeading] : []),
        pattern: t, examples: ex });
    }
  }
}

function parsePage(p) {
  const html = fs.readFileSync(path.join(CACHE, p.file), 'utf8');
  const doc = H.parse(html);
  const ctx = { inv: p.inv, invNum: p.invNum, section: null, subsection: null, group: null };
  const items = [], anchors = {};

  (function walk(node) {
    if (typeof node === 'string') return;
    const tag = node.tag;
    const anchor = node.attrs && (node.attrs.name || node.attrs.id);
    // NB: record the anchor AFTER the heading it sits on has updated ctx —
    // <h2 id="p4">4. Los demostrativos</h2> must resolve to section 4, not to
    // whatever section preceded it.
    const stamp = () => { if (anchor) anchors[anchor] = { section: ctx.section, subsection: ctx.subsection }; };

    if (tag === 'h1' || tag === 'h2') { ctx.section = H.text(node) || ctx.section; ctx.subsection = ctx.group = null; }
    else if (tag === 'h3') { ctx.subsection = H.text(node) || null; ctx.group = null; }
    else if (tag === 'h4') { ctx.subsection = H.text(node) || ctx.subsection; ctx.group = null; }
    else if (tag === 'h5') { ctx.group = H.text(node) || null; }
    stamp();
    if (tag === 'ul' || tag === 'ol') {
      // Inventories 3, 12 and 13 have no tables at all — just lists under
      // headings — and so are not split into level columns. (The table-based
      // pages have no <ul> outside a table, so this never double-harvests.)
      itemsFromCell({ children: [node], attrs: {}, tag: 'td' }, ctx,
                    (p.levels || ['—']).join('/'), items);
      return;
    }
    else if (tag === 'table') {
      const { levels, headerRow } = columnLevels(node, p.levels || ['—']);
      for (const tr of H.find(node, 'tr')) {
        if (tr === headerRow) continue;
        const cells = H.findChildren(tr, 'td').concat(H.findChildren(tr, 'th'));
        if (!cells.length) continue;
        // a single cell spanning the whole table applies to every level in it
        const spans = cells.length === 1 && (Number(cells[0].attrs.colspan) > 1 || levels.length > 1);
        cells.forEach((cell, j) => {
          const level = spans ? levels.join('/') : (levels[j] || levels[levels.length - 1] || '—');
          itemsFromCell(cell, ctx, level, items);
        });
      }
      return;                                  // don't re-walk the table's insides
    }
    (node.children || []).forEach(walk);
  })(doc);

  return { items, anchors };
}

function parseAll() {
  fs.mkdirSync(OUT, { recursive: true });
  const all = [], anchorIndex = {};
  const missing = [];

  for (const p of pages()) {
    if (!fs.existsSync(path.join(CACHE, p.file))) { missing.push(p.file); continue; }
    const { items, anchors } = parsePage(p);
    Object.keys(anchors).forEach(a => { anchorIndex[p.file + '#' + a] = Object.assign({ inventory: p.inv }, anchors[a]); });
    items.forEach(it => all.push(it));
    console.log(`  ${p.file.padEnd(46)} ${String(items.length).padStart(5)} items`);
  }
  missing.forEach(f => console.error('  ✗ not cached: ' + f));

  // resolve cross-references ([v. Gramática 15.3.5.] -> the section it points at)
  let resolved = 0;
  all.forEach(it => (it.xrefs || []).forEach(x => {
    const key = x.href.replace(/^\.\//, '');
    const hit = anchorIndex[key] || anchorIndex[key.split('#')[0] + '#' + key.split('#')[1]];
    if (hit) { x.inventory = hit.inventory; x.section = hit.section; x.subsection = hit.subsection; resolved++; }
  }));

  fs.writeFileSync(path.join(OUT, 'pcic.json'), JSON.stringify(all, null, 1));
  writeSummary(all, resolved);
  return all;
}

function writeSummary(all, resolved) {
  const byInv = {}, byLevel = {};
  all.forEach(it => {
    (byInv[it.inventory] = byInv[it.inventory] || {})[it.level] = (byInv[it.inventory][it.level] || 0) + 1;
    byLevel[it.level] = (byLevel[it.level] || 0) + 1;
  });
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const lines = [];
  lines.push('PCIC harvest — ' + all.length + ' specification items, ' +
             all.filter(i => i.examples && i.examples.length).length + ' with worked examples, ' +
             resolved + ' cross-references resolved', '');
  lines.push('inventory'.padEnd(24) + levels.map(l => l.padStart(7)).join('') + '    other');
  Object.keys(byInv).sort().forEach(inv => {
    const other = Object.keys(byInv[inv]).filter(l => levels.indexOf(l) < 0)
      .reduce((n, l) => n + byInv[inv][l], 0);
    lines.push(inv.padEnd(24) + levels.map(l => String(byInv[inv][l] || '·').padStart(7)).join('') +
               '    ' + (other || '·'));
  });
  lines.push('', 'TOTAL'.padEnd(24) + levels.map(l => String(byLevel[l] || '·').padStart(7)).join(''));

  // topical vocabulary is the part we most need — break it out by theme
  const nos = all.filter(i => i.inventory === 'nociones_especificas' && /^(B2|C1)$/.test(i.level));
  const byTheme = {};
  nos.forEach(i => { const t = i.section || '?'; byTheme[t] = (byTheme[t] || 0) + 1; });
  lines.push('', 'Nociones específicas (topical lexis) at B2+C1, by theme:');
  Object.keys(byTheme).sort((a, b) => byTheme[b] - byTheme[a])
    .forEach(t => lines.push('  ' + String(byTheme[t]).padStart(5) + '  ' + t));

  const txt = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(OUT, 'pcic-summary.txt'), txt);
  console.log('\n' + txt);
}

(async function main() {
  const cmd = process.argv[2] || 'all';
  if (cmd === 'fetch' || cmd === 'all') await fetchAll();
  if (cmd === 'parse' || cmd === 'all') parseAll();
})();
