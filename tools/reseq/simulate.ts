// Walks a course day by day with the known set rebuilt on THAT course's order, the way js/known.js
// builds it for the live one (reimplemented here; js/known.js is not loaded or changed):
//   firstDay(node)  the first day a lesson on the path teaches it; a taught chunk also teaches the
//                   grammar node it `unpacks` (lib/graph taughtAt)
//   taughtBy(d)     nodes with firstDay <= d
//   todayNodes(d)   a lesson's teaches; a verb day's present-tense nodes; a practice day's unit so far
//   serving rule    a grammar or contrast node in `r` must be known; a pattern or chunk blocks only when
//                   the course teaches it later; lexemes, can-dos and unknown ids never block
// and reports legality (lesson examples), bank supply per day, the grammar rhythm and contrast spacing.
// For the proposal the node model is LESSON_NODES with model.ts applied (NODE_MOVES, STUBS,
// PROPOSED_TEACHES, merged lessons' teaches moved to their target); for today's course it is LESSON_NODES.
import { loadBank, BANDS, lessonKind, type BankRow } from './data';
import { STUBS, NODE_MOVES, NODE_ADDS, PROPOSED_TEACHES, FROZEN_UNITS } from './model';

export type Course = { days: any[]; units: Record<string, any>; bands: Record<string, number> };
export type SimResult = ReturnType<typeof simulate>;

let BANK: BankRow[] | null = null;
const bank = () => BANK || (BANK = loadBank());
const norm = (s: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();

export function nodeModel(W: any, opts: { aliases: Record<string, string>; proposal: boolean }) {
  const teaches = new Map<string, string[]>(), reviews = new Map<string, string[]>();
  Object.entries(W.LESSON_NODES as Record<string, any>).forEach(([id, e]) => teaches.set(id, (e.teaches || []).slice()));
  if (!opts.proposal) return { teaches, reviews };
  Object.entries(PROPOSED_TEACHES).forEach(([id, ns]) => { if (!teaches.has(id)) teaches.set(id, ns.slice()); });
  Object.entries(STUBS).forEach(([id, s]) => { teaches.set(id, s.teaches.slice()); if (s.reviews) reviews.set(id, s.reviews.slice()); });
  const add = (id: string, ns: string[]) => { const t = teaches.get(id) || []; ns.forEach((n) => { if (!t.includes(n)) t.push(n); }); teaches.set(id, t); };
  NODE_MOVES.forEach((m) => { teaches.set(m.from, (teaches.get(m.from) || []).filter((n) => !m.nodes.includes(n))); if (m.to) add(m.to, m.nodes); });
  NODE_ADDS.forEach((m) => add(m.to, m.nodes));
  Object.entries(opts.aliases).forEach(([a, b]) => add(b, teaches.get(a) || []));
  return { teaches, reviews };
}

const STEM_BOOT = 'querer poder dormir jugar preferir pensar volver encontrar empezar entender almorzar recordar costar sentir mostrar'.split(' ');
const STEM_EI = 'pedir servir seguir repetir decir'.split(' ');
function verbNodes(verbs: string[], ids: Set<string>) {
  const out = new Set<string>();
  verbs.forEach((v) => {
    let id: string | null = null;
    if (v === 'ser') id = 'g:ser-identity'; else if (v === 'estar') id = 'g:estar-location-states';
    else if (/ar(se)?$/.test(v)) id = 'g:present-ar'; else if (/(er|ir)(se)?$/.test(v)) id = 'g:present-er-ir';
    if (id) out.add(id);
    const b = v.replace(/se$/, '');
    if (STEM_BOOT.includes(b)) out.add('g:stem-boot');
    if (STEM_EI.includes(b)) out.add('g:stem-e-i');
  });
  return new Set([...out].filter((id) => ids.has(id)));
}

export function simulate(W: any, C: Course, opts: { aliases: Record<string, string>; proposal: boolean }) {
  const graph = new Map<string, any>((W.GRAPH.nodes as any[]).map((n) => [n.id, n]));
  const ids = new Set(graph.keys());
  const { teaches, reviews } = nodeModel(W, opts);
  const days = C.days;
  const bandOf = (i: number) => days[i].band as string;
  const frozenDay = (i: number) => FROZEN_UNITS.includes(days[i].unit);

  /* ---- the known set ---- */
  const firstDay = new Map<string, number>(), direct = new Map<string, number>(), via = new Map<string, { chunk: string; lesson: string }>();
  days.forEach((d, i) => {
    if (!d.lesson || !teaches.has(d.lesson)) return;
    for (const n of teaches.get(d.lesson)!) {
      if (!firstDay.has(n)) firstDay.set(n, i);
      if (!direct.has(n)) direct.set(n, i);
      const u = graph.get(n)?.unpacks;
      if (u && !firstDay.has(u)) { firstDay.set(u, i); via.set(u, { chunk: n, lesson: d.lesson }); }
    }
  });
  const lessonNodes = (id: string) => [...(teaches.get(id) || []), ...(reviews.get(id) || [])];
  function todayNodes(i: number): Set<string> {
    const d = days[i], s = new Set<string>();
    if (d.lesson) lessonNodes(d.lesson).forEach((n) => s.add(n));
    else if (d.verbs) return verbNodes(d.verbs, ids);
    else {
      let from = Math.max(0, i - 6);
      const u = d.unit && C.units[d.unit];
      if (u && u.from != null) from = u.from;
      for (let j = from; j <= i; j++) if (days[j].lesson) lessonNodes(days[j].lesson).forEach((n) => s.add(n));
    }
    return new Set([...s].filter((n) => ids.has(n) && !n.startsWith('l:')));
  }

  /* ---- legality: each lesson's example rows on its own day ---- */
  const exKeys = new Map<string, string[]>();
  Object.keys(W.REQUIRES).forEach((k) => { const m = /^lesson:(.+):ex:\d+$/.exec(k); if (m) (exKeys.get(m[1]) || exKeys.set(m[1], []).get(m[1])!).push(k); });
  const later: any[] = [], neverByNode = new Map<string, number>(), unchecked: any[] = [];
  let laterRows = 0, neverRows = 0, neverDays = 0;
  days.forEach((d, i) => {
    if (!d.lesson) return;
    const keys = exKeys.get(d.lesson) || (W.REQUIRES['lesson:' + d.lesson] ? ['lesson:' + d.lesson] : []);
    if (!keys.length) { unchecked.push({ day: i, id: d.lesson, stub: !!d.stub }); return; }
    const late = new Map<string, number>(); let never = false;
    keys.forEach((k) => {
      let rowLate = false, rowNever = false;
      for (const r of W.REQUIRES[k].r || []) {
        const n = graph.get(r);
        if (!n || n.kind === 'lexeme' || n.kind === 'cando') continue;
        const fd = firstDay.get(r);
        if (n.kind === 'grammar' || n.kind === 'contrast') {
          if (fd === undefined) { rowNever = true; neverByNode.set(r, (neverByNode.get(r) || 0) + 1); }
          else if (fd > i) { rowLate = true; late.set(r, fd); }
        } else if ((n.kind === 'pattern' || n.kind === 'chunk') && fd !== undefined && fd > i) { rowLate = true; late.set(r, fd); }
      }
      if (rowLate) laterRows++;
      if (rowNever) { neverRows++; never = true; }
    });
    if (never) neverDays++;
    if (late.size) {
      const nodes = [...late.entries()].sort((a, b) => a[1] - b[1]).map(([id, at]) => ({ id, at, hard: /^[gx]:/.test(id) }));
      later.push({ day: i, band: bandOf(i), unit: d.unit, lesson: d.lesson, frozen: frozenDay(i), nodes, hard: nodes.some((n) => n.hard) });
    }
  });

  /* ---- supply ---- */
  const rows = bank();
  const servableFrom = new Map<BankRow, number>(), gateFrom = new Map<BankRow, number>(), byNode = new Map<string, BankRow[]>();
  const blockedBy = new Map<string, number>();
  for (const row of rows) {
    let m = 0, g = 0, blocked = false;
    for (const r of row.r) {
      const n = graph.get(r);
      if (!n || n.kind === 'lexeme' || n.kind === 'cando') continue;
      const fd = firstDay.get(r);
      if (n.kind === 'grammar' || n.kind === 'contrast') { if (fd === undefined) { blocked = true; blockedBy.set(r, (blockedBy.get(r) || 0) + 1); } else { m = Math.max(m, fd); g = Math.max(g, fd); } }
      else if (fd !== undefined) { m = Math.max(m, fd); g = Math.max(g, fd); }
    }
    servableFrom.set(row, blocked ? Infinity : m); gateFrom.set(row, g);
    for (const t of row.t) if (!t.startsWith('l:')) (byNode.get(t) || byNode.set(t, []).get(t)!).push(row);
  }
  function supplyFor(today: Set<string>, i: number) {
    const seen = new Set<BankRow>(), es = new Set<string>(), esGate = new Set<string>();
    today.forEach((n) => (byNode.get(n) || []).forEach((row) => {
      if (seen.has(row)) return; seen.add(row);
      const k = norm(row.es);
      if (servableFrom.get(row)! <= i) es.add(k);
      if (gateFrom.get(row)! <= i) esGate.add(k);
    }));
    return { n: es.size, gate: esGate.size };
  }
  const byBand: Record<string, any> = {};
  BANDS.forEach((b) => { byBand[b] = { withNodes: 0, under8: 0, zero: 0, vals: [] as number[], gates: [] as number[], taskDays: 0, emptyDays: 0, candoOnly: 0 }; });
  const under: any[] = [];
  const taskAsPractice = { n: 0, under8: 0 };
  days.forEach((d, i) => {
    const B = byBand[bandOf(i)];
    if (!B) return;
    const today = todayNodes(i);
    if (!today.size) {
      if (d.lesson && lessonKind(d.lesson) === 'task') {
        B.taskDays++;
        const u = d.unit && C.units[d.unit]; const pr = new Set<string>();
        if (u && u.from != null) for (let j = u.from; j <= i; j++) if (days[j].lesson) lessonNodes(days[j].lesson).forEach((n) => { if (ids.has(n) && !/^[ld]:/.test(n)) pr.add(n); });
        if (pr.size) { taskAsPractice.n++; if (supplyFor(pr, i).n < 8) taskAsPractice.under8++; }
      } else B.emptyDays++;
      return;
    }
    const bankNodes = new Set([...today].filter((n) => !n.startsWith('d:')));
    if (!bankNodes.size) { B.candoOnly++; return; }   // the bank targets no can-do node
    const s = supplyFor(bankNodes, i);
    B.withNodes++; B.vals.push(s.n); B.gates.push(s.gate);
    if (s.n < 8) {
      B.under8++; if (!s.n) B.zero++;
      under.push({ day: i, band: bandOf(i), unit: d.unit, kind: d.kind || (d.lesson ? 'lesson' : d.verbs ? 'verbs' : 'practice'),
        what: d.lesson ? d.lesson + (d.stub ? ' (stub)' : '') : d.verbs ? 'verbs ' + d.verbs[0] + '…' : 'practice', nodes: [...bankNodes], n: s.n, gate: s.gate });
    }
  });
  const median = (a: number[]) => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  Object.values(byBand).forEach((B: any) => { B.median = median(B.vals); B.medianGate = median(B.gates); delete B.vals; delete B.gates; });
  const nodeSupply = new Map<string, number>();
  firstDay.forEach((at, n) => {
    if (n.startsWith('l:') || n.startsWith('d:')) return;
    const es = new Set<string>();
    (byNode.get(n) || []).forEach((row) => { if (servableFrom.get(row)! <= at + 14) es.add(norm(row.es)); });
    nodeSupply.set(n, es.size);
  });
  const underNodes = new Set<string>(); under.forEach((u) => u.nodes.forEach((n: string) => underNodes.add(n)));
  const shortNodes = [...nodeSupply.entries()].filter(([n]) => underNodes.has(n)).sort((a, b) => a[1] - b[1]);

  /* ---- rhythm ---- */
  const isG = (i: number) => !!days[i].lesson && lessonKind(days[i].lesson) === 'grammar';
  const isPractice = (i: number) => !!days[i] && !!days[i].practice;
  const consecutive: any[] = [], noDrill: any[] = [];
  let grammarIntro = 0;
  days.forEach((d, i) => {
    if (!isG(i)) return;
    grammarIntro++;
    if (i + 1 < days.length && isG(i + 1)) consecutive.push({ day: i, a: d.lesson, b: days[i + 1].lesson, frozen: frozenDay(i) });
    if (![1, 2, 3].some((k) => isPractice(i + k))) noDrill.push({ day: i, lesson: d.lesson, frozen: frozenDay(i) });
  });
  function longestRun(from: number, to: number) {
    let best = { len: 0, from }, run = 0, start = from;
    for (let i = from; i < to; i++) {
      if (isG(i)) { run = 0; start = i + 1; continue; }
      run++; if (run > best.len) best = { len: run, from: start };
    }
    return best;
  }
  const bandList = BANDS.filter((b) => C.bands[b] != null);
  const runs: any = { byBand: {} };
  bandList.forEach((b, k) => { const to = k + 1 < bandList.length ? C.bands[bandList[k + 1]] : days.length; runs.byBand[b] = longestRun(C.bands[b], to); });
  const lr = longestRun(0, days.length); runs.longest = { ...lr, band: bandOf(lr.from) };

  /* ---- contrasts ---- */
  const close: any[] = [], together: any[] = [], early: any[] = [];
  (W.GRAPH.nodes as any[]).filter((n) => n.kind === 'contrast' && n.contrasts && n.contrasts.length >= 2).forEach((x) => {
    const sides = (x.contrasts as string[]).filter((s) => firstDay.has(s)).map((s) => ({ id: s, at: firstDay.get(s)! })).sort((a, b) => a.at - b.at);
    if (sides.length < 2) return;
    const gap = sides[1].at - sides[0].at;
    if (gap === 0) together.push({ id: x.id, at: sides[0].at, lesson: days[sides[0].at].lesson, frozen: frozenDay(sides[0].at) });
    else if (gap < 3) close.push({ id: x.id, sides: sides.slice(0, 2), frozen: frozenDay(sides[0].at) });
    const xa = firstDay.get(x.id);
    if (xa !== undefined && xa < sides[sides.length - 1].at) early.push({ id: x.id, at: xa, side: sides[sides.length - 1].id, sideAt: sides[sides.length - 1].at });
  });
  const chunkEarly = [...via.entries()].filter(([n]) => n.startsWith('g:') && (!direct.has(n) || direct.get(n)! > firstDay.get(n)!))
    .map(([n, v]) => ({ node: n, chunk: v.chunk, lesson: v.lesson, at: firstDay.get(n), direct: direct.get(n) })).sort((a, b) => a.at! - b.at!);
  const neverTaught = (W.GRAPH.nodes as any[]).filter((n) => n.kind === 'grammar' && !firstDay.has(n.id))
    .map((n) => ({ id: n.id, rows: blockedBy.get(n.id) || 0 })).sort((a, b) => b.rows - a.rows);

  /* ---- counts ---- */
  const cnt = (k: string, ins: boolean) => days.filter((d) => d.kind === k && !!d.inserted === ins && d.practice).length;
  return {
    firstDay,
    legality: { later, laterDays: later.length, laterRows, neverDays, neverRows, unchecked,
      hardDays: later.filter((v) => v.hard).length, hardFrozen: later.filter((v) => v.hard && v.frozen).length,
      softOnlyDays: later.filter((v) => !v.hard).length,
      softByNode: (() => { const m = new Map<string, number>(); later.forEach((v) => v.nodes.filter((n: any) => !n.hard).forEach((n: any) => m.set(n.id, (m.get(n.id) || 0) + 1))); return [...m.entries()].sort((a, b) => b[1] - a[1]); })(),
      neverByNode: [...neverByNode.entries()].sort((a, b) => b[1] - a[1]) },
    supply: { byBand, under, withNodes: Object.values(byBand).reduce((a: number, B: any) => a + B.withNodes, 0),
      under8: under.length, taskAsPractice, shortNodes, candoOnly: Object.values(byBand).reduce((a: number, B: any) => a + B.candoOnly, 0) },
    runs, rules: { consecutive, noDrill },
    contrasts: { close, together, early }, chunkEarly, neverTaught,
    counts: { grammarIntro, drillReused: cnt('drill', false), drillInserted: cnt('drill', true), outputReused: cnt('output', false),
      outputInserted: cnt('output', true), reviewReused: cnt('review', false), reviewInserted: cnt('review', true) },
  };
}
