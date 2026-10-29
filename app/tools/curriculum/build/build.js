'use strict';
// Builds app/content/graph/*.json and app/content/units/uNN.json from the spine + mined nodes.
//
// RETIRED (Oct 2026). This produced the first cut only. Since then the JSON under app/content/graph and
// app/content/units has been edited directly (gate fixes, the pull-forward pass in
// tools/curriculum/pullforward.py, see docs/unit-map.md "Pull-forward pass"), and it is now the source of
// truth. Re-running this would silently undo those changes, so it refuses unless given --force-overwrite.
if (!process.argv.includes('--force-overwrite')) {
  console.error('build.js is retired: content/graph and content/units are the source of truth (docs/unit-map.md, "Pull-forward pass"). Pass --force-overwrite only to regenerate the first cut from scratch.');
  process.exit(1);
}
const fs = require('fs'), path = require('path');
const ROOT = '/Users/Matthew/Fluidez';
const MINE = path.join(__dirname, '..', 'mine');
const G = require('./grammar.js'), U = require('./units.js'), SURV = require('./survival.js'), XC = require('./contrasts.js');
const STORY = fs.existsSync(path.join(__dirname, 'story.js')) ? require('./story.js') : {};
const warn = []; const W = m => warn.push(m);
const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const bi = b => BANDS.indexOf(b);
const pad = n => String(n).padStart(2, '0');

// ---------- old lesson ids (for sources) ----------
global.window = {};
for (const f of ['data/strand-lessons.js', 'data/grammar.js', 'data/grammar-docs.js']) (0, eval)(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const OLD = {};
window.STRAND_LESSONS.forEach(l => OLD[l.id] = { cefr: l.cefr, strand: l.strand });
window.CONCEPT_LESSONS.forEach(l => OLD[l.id] = { cefr: 'A1', strand: 'concept' });
window.GRAMMAR.forEach(l => OLD[l.key] = { cefr: 'A1', strand: 'tense' });

// ---------- day layout ----------
const TYPE = { I: 'introduce', D: 'drill', In: 'input', P: 'patterns', O: 'output', R: 'review', C: 'checkpoint' };
let s = 0; const units = []; const sessionUnit = {};
for (const u of U) {
  const days = u.tpl.split(' ').map((t, i) => ({ t, type: TYPE[t], session: s + i + 1, focus: [], chunks: [], lexemes: [], pat: 0 }));
  days.forEach(d => sessionUnit[d.session] = u.n);
  s += days.length;
  units.push({ ...u, days, grammar: [] });
}
const TOTAL = s;
const unitOf = n => units[n - 1];

// ---------- graph ----------
const nodes = {}; const add = n => { if (nodes[n.id]) throw new Error('dup ' + n.id); nodes[n.id] = n; };
function base(o) {
  return { id: o.id, kind: o.kind, band: o.band, priority: o.priority, title: o.title, es: o.es, en: o.en,
    requires: o.requires || [], contrasts: o.contrasts || [], unpacks: o.unpacks, serves: o.serves || [],
    pcic: o.pcic || [], placement: o.placement || 'pcic', note: o.note, sources: o.sources || [] };
}

// grammar
const gSources = {};
for (const f of ['out-G1.json', 'out-G2.json']) {
  const o = JSON.parse(fs.readFileSync(path.join(MINE, f)));
  for (const [lesson, gs] of Object.entries(o.grammarSources || {})) for (const g of gs) (gSources[g] = gSources[g] || new Set()).add(lesson);
}
for (const u of units) {
  const gs = G.filter(g => g.u === u.n); let k = 0;
  for (const d of u.days) if (d.t === 'I') {
    const g = gs[k++]; d.focus.push(g.id); u.grammar.push(g.id);
    const src = new Set(g.src.filter(x => OLD[x])); (gSources[g.id] || []).forEach(x => src.add(x));
    const seqNew = g.src.filter(x => !OLD[x]);
    let note = g.note || '';
    if (seqNew.length) note += (note ? ' ' : '') + 'SEQ new lesson(s): ' + seqNew.join(', ') + '.';
    const placement = bi(u.band) !== bi(g.pb) ? 'teaching_choice' : 'pcic';
    if (placement === 'teaching_choice') note += (note ? ' ' : '') + `PCIC/programmes place this at ${g.pb}; taught at ${u.band} here.`;
    add(base({ id: g.id, kind: 'grammar', band: u.band, priority: d.session, title: g.t, es: g.es, en: g.en || undefined,
      requires: g.req, contrasts: g.contrasts || [], pcic: g.pcic, placement, note: note || undefined, sources: [...src].sort() }));
  }
}

// unit can-dos
const slug = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
for (const u of units) {
  const Os = u.days.filter(d => d.t === 'O'); let od = Os[Os.length - 1] || u.days[u.days.length - 1];
  const lastI = Math.max(...u.days.filter(d => d.t === 'I').map(d => d.session));
  if (od.session <= lastI) od = u.days[u.days.length - 1];
  u.candoId = `d:u${pad(u.n)}-${slug(u.title)}`;
  add(base({ id: u.candoId, kind: 'cando', band: u.band, priority: od.session, title: u.canDo, requires: [...u.grammar],
    note: `Unit ${u.n} goal; tested on the Output day${u.n % 4 === 0 ? ' and the checkpoint' : ''}.` }));
  for (const g of u.grammar) nodes[g].serves.push(u.candoId);
}

// survival kit
for (const [id, sess, title, es, en, unp] of SURV) {
  const u = unitOf(sessionUnit[sess]); const d = u.days.find(x => x.session === sess);
  if (['output', 'review', 'checkpoint'].includes(d.type)) W('survival chunk on no-new day ' + id);
  d.chunks.push(id);
  add(base({ id, kind: 'chunk', band: 'A1', priority: sess, title, es, en, unpacks: unp || undefined,
    serves: ['d:u01-hello-who-i-am'], note: 'Survival kit (sessions 1–11): learned whole, unpacked later.' + (unp ? '' : ' Pure social formula.') }));
}

// ---------- mined nodes ----------
const mined = {}; const triage = [];
for (const g of ['A', 'B', 'C', 'D', 'E', 'F', 'G1', 'G2']) {
  const o = JSON.parse(fs.readFileSync(path.join(MINE, 'out-' + g + '.json')));
  (o.triage || []).forEach(t => triage.push({ ...t, group: g }));
  for (const n of o.nodes) {
    if (nodes[n.id]) { W('mined id collides with spine: ' + n.id + ' (' + g + ') — merged sources'); (n.sources || []).forEach(x => nodes[n.id].sources.includes(x) || nodes[n.id].sources.push(x)); continue; }
    const m = mined[n.id];
    if (m) { // merge duplicate ids
      const un = (a, b) => [...new Set([...(a || []), ...(b || [])])];
      m.sources = un(m.sources, n.sources); m.pcic = un(m.pcic, n.pcic); m.serves = un(m.serves, n.serves);
      if (n.unit < m.unit) { m.requires = n.requires; m.title = n.title; m.es = n.es; m.en = n.en; } m.unit = Math.min(m.unit, n.unit); m._groups.push(g); continue;
    }
    mined[n.id] = { ...n, _groups: [g] };
  }
}
// near-duplicate merges
const MERGES = require('./merges.js');
for (const [drop, keep] of Object.entries(MERGES)) {
  const d = mined[drop]; if (!d) { W('merge: no ' + drop); continue; }
  const k = mined[keep] || nodes[keep]; if (!k) { W('merge: no keep ' + keep); continue; }
  for (const x of d.sources || []) if (!k.sources.includes(x)) k.sources.push(x);
  if (k.serves) for (const x of d.serves || []) if (!k.serves.includes(x)) k.serves.push(x);
  if (mined[keep] && d.unit < k.unit && !(mined[keep].requires || []).length) k.unit = d.unit;
  delete mined[drop];
  for (const n of Object.values(mined)) for (const f of ['requires', 'serves', 'contrasts']) if (n[f]) n[f] = [...new Set(n[f].map(x => x === drop ? keep : x))].filter(x => x !== n.id);
}
// contrast nodes (spine)
for (const [id, title, es, sides, note] of XC) {
  if (mined[id]) { W('mined contrast duplicates spine ' + id); delete mined[id]; }
  mined[id] = { id, kind: 'contrast', title, es, contrasts: sides, requires: [...sides], unit: 0, note, sources: [], _groups: ['spine'] };
}
// drop dangling references
const exists = id => nodes[id] || mined[id];
for (const n of Object.values(mined)) {
  for (const k of ['requires', 'serves', 'contrasts']) {
    const bad = (n[k] || []).filter(x => !exists(x) || x === n.id);
    if (bad.length) { W(`${n.id}: dropped missing ${k} ${bad.join(',')}`); n[k] = n[k].filter(x => exists(x) && x !== n.id); }
  }
  if (n.unpacks && !exists(n.unpacks)) { W(`${n.id}: dropped missing unpacks ${n.unpacks}`); delete n.unpacks; }
  n.sources = (n.sources || []).filter(x => { if (!OLD[x]) W(`${n.id}: unknown source ${x}`); return OLD[x]; });
  if (n.kind === 'contrast') for (const sd of n.contrasts) if (!n.requires.includes(sd)) n.requires.push(sd);
}

// ---------- allocation ----------
const pri = id => nodes[id] ? nodes[id].priority : undefined;
const PCAP = { A1: 4, A2: 4, B1: 6, B2: 8, C1: 8 };
const CCAP = { introduce: 3, drill: 4, input: 5, patterns: 5 };
const UCAP = { A1: 12, A2: 12, B1: 16, B2: 22, C1: 24 };
const PAT_DAYS = ['patterns', 'input', 'drill'];
// order: by unit, then dependencies first (repeat until stable)
let pending = Object.values(mined).filter(n => n.kind !== 'cando');
const placedDay = {};
let guard = 0;
while (pending.length && guard++ < 50) {
  const next = [];
  pending.sort((a, b) => (a.unit - b.unit) || (a.kind === 'contrast') - (b.kind === 'contrast'));
  for (const n of pending) {
    if (n.requires.some(r => !nodes[r] && r !== n.id)) { next.push(n); continue; } // wait for deps
    const minS = Math.max(0, ...n.requires.map(r => pri(r))) + 1;
    let placed = null;
    for (let un = Math.max(1, n.unit); un <= 60 && !placed; un++) {
      const u = unitOf(un);
      if (n.kind === 'pattern' && u.days.reduce((a, d) => a + d.pat, 0) >= UCAP[u.band]) continue;
      const order = n.kind === 'pattern' ? [...u.days].sort((a, b) => (PAT_DAYS.indexOf(a.type) - PAT_DAYS.indexOf(b.type)) || a.session - b.session) : u.days;
      for (const d of order) {
        if (d.session < minS) continue;
        if (n.kind === 'pattern') {
          if (PAT_DAYS.includes(d.type) && d.pat < PCAP[u.band] + (d.type === 'patterns' ? 2 : 0)) { d.pat++; d.focus.push(n.id); placed = d; break; }
        } else if (n.kind === 'chunk') {
          if (CCAP[d.type] && d.chunks.length < CCAP[d.type]) { d.chunks.push(n.id); placed = d; break; }
        } else if (n.kind === 'contrast') {
          if ((d.type === 'drill' || d.type === 'review') && n.unit <= un) { d.focus.push(n.id); placed = d; break; }
        }
      }
    }
    if (!placed) { W('could not place ' + n.id); continue; }
    const pu = unitOf(sessionUnit[placed.session]);
    if (n.unit && sessionUnit[placed.session] - n.unit >= 2) W(`${n.id}: pushed from u${n.unit} to u${pu.n}`);
    const srcBands = n.sources.map(x => OLD[x].cefr).filter(Boolean);
    const minSrc = srcBands.length ? BANDS[Math.min(...srcBands.map(bi))] : pu.band;
    const placement = (n.kind === 'pattern' || n.kind === 'chunk') && srcBands.length && bi(minSrc) !== bi(pu.band) ? 'teaching_choice' : 'pcic';
    const note = [n.note, placement === 'teaching_choice' ? `Source lesson is ${minSrc}; taught at ${pu.band} here.` : null].filter(Boolean).join(' ') || undefined;
    add(base({ id: n.id, kind: n.kind, band: pu.band, priority: placed.session, title: n.title, es: n.es, en: n.en,
      requires: n.requires, contrasts: n.contrasts, unpacks: n.unpacks, serves: n.serves, pcic: n.pcic, placement, note, sources: n.sources }));
    placedDay[n.id] = placed;
    if (nodes[n.id].unpacks && nodes[nodes[n.id].unpacks] && nodes[nodes[n.id].unpacks].priority < placed.session) { W(`${n.id}: unpacks ${nodes[n.id].unpacks} already taught; dropped (chunk practises it)`); delete nodes[n.id].unpacks; }
  }
  pending = next;
}
pending.forEach(n => W('unresolved deps ' + n.id + ' ' + n.requires.join(',')));
// review days also re-drill the unit grammar and all contrasts due; output days carry the unit grammar
for (const u of units) {
  for (const d of u.days) {
    if (d.type === 'review' || d.type === 'checkpoint') {
      d.focus.unshift(...u.grammar);
      // the big contrasts recur on review days once both sides are known
      if (d.type === 'review') for (const x of ['x:pret-imp', 'x:ser-estar-adj', 'x:por-para', 'x:creo-no-creo', 'x:lo-le'])
        if (nodes[x] && nodes[x].priority < d.session && !d.focus.includes(x) && u.n % 2 === ['x:pret-imp', 'x:ser-estar-adj', 'x:por-para', 'x:creo-no-creo', 'x:lo-le'].indexOf(x) % 2) d.focus.push(x);
    }
    if (d.type === 'output') d.focus.unshift(...u.grammar);
  }
  // drills: the point just introduced + the previous one (interleave)
  let last = [], prevUnitLast = units[u.n - 2] ? units[u.n - 2].grammar.slice(-1) : [];
  for (const d of u.days) {
    if (d.t === 'I') last.unshift(d.focus[0]);
    if (d.t === 'D') { const add2 = [last[0], last[1] || prevUnitLast[0]].filter(Boolean); d.focus.unshift(...add2.filter(x => !d.focus.includes(x))); }
  }
}
// a Patterns day with almost nothing to teach becomes an Input day (more story, more words)
for (const u of units) for (const d of u.days) if (d.type === 'patterns' && d.focus.filter(f => f.startsWith('p:')).length < 2) { d.type = 'input'; d.t = 'In'; W(`u${u.n}: thin patterns day → input`); }
// mined can-dos: priority at the unit's output day (or after requires)
for (const n of Object.values(mined).filter(n => n.kind === 'cando')) {
  const u = unitOf(Math.max(1, n.unit)); const od = u.days.find(d => d.t === 'O') || u.days[u.days.length - 1];
  const minS = Math.max(0, ...n.requires.map(r => pri(r) || 0)) + 1;
  let p = Math.max(od.session, minS);
  const band = unitOf(sessionUnit[Math.min(p, TOTAL)]).band;
  add(base({ id: n.id, kind: 'cando', band, priority: p, title: n.title, es: n.es, en: n.en, requires: n.requires, serves: [], pcic: n.pcic, note: n.note, sources: n.sources }));
}

// ---------- chapters, scenes, quotas ----------
let ch = 0;
const LEX = { A1: 35, A2: 32, B1: 30, B2: 27, C1: 25 };
for (const u of units) {
  const I = u.days.filter(d => d.t === 'I');
  let chDays;
  if (u.band === 'A1' && u.n <= 4) chDays = [I[0], ...u.days.filter(d => d.t === 'In')];
  else if (u.band === 'A1' || u.band === 'A2') chDays = [I[0], ...u.days.filter(d => d.t === 'In'), I[I.length - 1]];
  else if (u.band === 'B1') chDays = [I[0], ...u.days.filter(d => d.t === 'In'), I[1], I[I.length - 1]];
  else chDays = [...u.days.filter(d => d.t === 'In'), ...I, u.days.find(d => d.t === 'O')];
  chDays = [...new Set(chDays.filter(Boolean))].sort((a, b) => a.session - b.session);
  if (u.band === 'B1') chDays = chDays.slice(0, 3);
  chDays.forEach(d => d.chapter = 'ch' + String(++ch).padStart(3, '0'));
  const O = u.days.filter(d => d.t === 'O'); const D = u.days.filter(d => d.t === 'D');
  O[0].scene = `sc-u${pad(u.n)}-a`;
  if (bi(u.band) >= 2) (O[1] || D[D.length - 1]).scene = `sc-u${pad(u.n)}-b`;
  const C = u.days.find(d => d.t === 'C'); if (C) C.scene = `sc-u${pad(u.n)}-c`;
  const nG = u.grammar.length;
  const nP = u.days.reduce((a, d) => a + d.focus.filter(f => f.startsWith('p:') && nodes[f].priority === d.session).length, 0);
  const nC = u.days.reduce((a, d) => a + d.chunks.length, 0);
  u.counts = { g: nG, p: nP, c: nC, lex: LEX[u.band], x: u.days.reduce((a, d) => a + d.focus.filter(f => f.startsWith('x:') && nodes[f].priority === d.session).length, 0) };
  u.quota = {
    bankSentences: 40 * nG + 15 * nP + 6 * nC + 6 * LEX[u.band],
    chapters: u.days.filter(d => d.chapter).length,
    scenes: u.days.filter(d => d.scene).length,
    writingTasks: Math.max(3, bi(u.band) + 2),
  };
}

// ---------- validation ----------
const errs = [];
const all = Object.values(nodes);
for (const n of all) {
  for (const r of n.requires) { if (!nodes[r]) errs.push(`${n.id} requires missing ${r}`); else if (nodes[r].priority >= n.priority && n.kind !== 'cando') errs.push(`${n.id}@${n.priority} requires ${r}@${nodes[r].priority}`); else if (n.kind === 'cando' && nodes[r].priority > n.priority) errs.push(`cando ${n.id}@${n.priority} requires ${r}@${nodes[r].priority}`); }
  for (const k of ['serves', 'contrasts']) for (const r of n[k]) if (!nodes[r]) errs.push(`${n.id} ${k} missing ${r}`);
  if (n.unpacks && !nodes[n.unpacks]) errs.push(`${n.id} unpacks missing ${n.unpacks}`);
  if (n.kind === 'contrast') for (const sd of n.contrasts) if (nodes[sd] && nodes[sd].priority >= n.priority) errs.push(`contrast ${n.id} before side ${sd}`);
}
for (const u of units) {
  let lastI = -9;
  u.days.forEach((d, i) => {
    for (const f of [...d.focus, ...d.chunks]) if (!nodes[f]) errs.push(`u${u.n} day${i + 1} missing ${f}`);
    const newG = d.focus.filter(f => f.startsWith('g:') && nodes[f].priority === d.session);
    if (newG.length > 1) errs.push(`u${u.n} day${i + 1} >1 grammar`);
    if (d.t === 'I') { if (d.session - lastI === 1) errs.push(`u${u.n} consecutive introduce`); lastI = d.session;
      const nd = u.days.slice(i + 1, i + 4).find(x => x.t === 'D'); if (!nd) errs.push(`u${u.n} day${i + 1} intro without drill in 3`); }
    if (d.chunks.length > 5) errs.push(`u${u.n} day${i + 1} chunks ${d.chunks.length}`);
    if (['output', 'review', 'checkpoint'].includes(d.type) && (d.chunks.length)) errs.push(`u${u.n} new items on ${d.type}`);
  });
  if (u.n % 4 === 0 && u.days[u.days.length - 1].type !== 'checkpoint') errs.push(`u${u.n} no checkpoint`);
}
// unpacking order: chunk before its grammar
const lateUnpack = all.filter(n => n.unpacks && nodes[n.unpacks] && nodes[n.unpacks].priority <= n.priority).map(n => `${n.id}@${n.priority}→${n.unpacks}@${nodes[n.unpacks].priority}`);

// ---------- write ----------
const clean = n => { const o = {}; for (const [k, v] of Object.entries(n)) if (v !== undefined) o[k] = v; return o; };
const byKind = k => all.filter(n => n.kind === k).sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id)).map(clean);
const GD = path.join(ROOT, 'app/content/graph'), UD = path.join(ROOT, 'app/content/units');
const out = { grammar: 'grammar', pattern: 'patterns', chunk: 'chunks', contrast: 'contrasts', cando: 'candos' };
if (process.argv.includes('--write')) {
  for (const [k, f] of Object.entries(out)) fs.writeFileSync(path.join(GD, f + '.json'), JSON.stringify(byKind(k), null, 1) + '\n');
  for (const u of units) {
    const unit = { id: 'u' + pad(u.n), band: u.band, title: u.title, theme: u.theme, canDo: u.canDo,
      days: u.days.map(d => clean({ type: d.type, focus: d.focus, chunks: d.chunks, lexemes: [], chapter: d.chapter, scene: d.scene })),
      storyArc: STORY[u.n] || 'TODO', quota: u.quota };
    fs.writeFileSync(path.join(UD, 'u' + pad(u.n) + '.json'), JSON.stringify(unit, null, 1) + '\n');
  }
}
fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify({ total: TOTAL, units: units.map(u => ({ n: u.n, band: u.band, title: u.title, canDo: u.canDo, s0: u.days[0].session, s1: u.days[u.days.length - 1].session, grammar: u.grammar, counts: u.counts, quota: u.quota, days: u.days.map(d => ({ t: d.t, s: d.session, focus: d.focus, chunks: d.chunks, ch: d.chapter, sc: d.scene })) })), triage }, null, 1));
const kinds = {}; all.forEach(n => kinds[n.kind] = (kinds[n.kind] || 0) + 1);
console.log('sessions', TOTAL, 'nodes', all.length, kinds);
console.log('errors', errs.length); errs.slice(0, 40).forEach(e => console.log('  E', e));
console.log('warnings', warn.length); const wc = {}; warn.forEach(w => { const k = w.split(':')[0].split(' ').slice(0, 3).join(' '); wc[k] = (wc[k] || 0) + 1; });
console.log('late-unpack', lateUnpack.length, lateUnpack.slice(0, 15));
if (process.argv.includes('-v')) warn.forEach(w => console.log('  W', w));
