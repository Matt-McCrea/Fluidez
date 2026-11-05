// ============================================================================
// Stage 6 re-sequence, the 640-day course:   nice npx tsx tools/reseq/build.ts --lean [--apply]
//
// Builds the proposed course spine from SEQ ("Fluidez Spanish course sequencing.md") and writes
//   tools/reseq/out/course.proposed.js          a copy of the course (same shape and derived block as data/course.js)
//   tools/reseq/out/lesson-aliases.proposed.js  SEQ's merges as {oldId: newId}, plus the cuts
//   docs/plan-2026-11-04/resequence.md  the report (units, counts, legality, supply, stubs, aliases,
//                                       reconciliation, judgement calls)
// With --apply it makes the course live: data/course.js, data/lesson-aliases.js (window.LESSON_ALIASES), status and
// `deeper` edits in data/strand-lessons.js (patch-lessons.ts) and the node rulings in tools/lesson-nodes.overrides.json;
// then run tag-data.ts, split-data.ts, build-game-index.js, gen-assets.js, bump-cache.js and validate-content.js (section 10).
// The generator reads week one and the old deep units from tools/reseq/base/course.pre-reseq.js, never from data/course.js,
// so it reruns to the same result. Without --apply it writes only the proposed copies and the report.
//
// Order: SEQ's positions, then
//   1. the Latin American correction (model.ts LATAM_SWAP, NODE_MOVES, the B2 recognition stub);
//   2. a1-u01 and a1-u02 copied verbatim (source text, comments and all);
//   3. the week: each SEQ unit is cut into weeks of Introduce, Drill, Input, Output, Mixed review
//      (4 to 6 sessions; see weekify below for the rules);
//   4. merges become aliases, splits and new lessons become stub days, make-optional lessons go to deep units.
// The simulation (legality, supply, runs, contrasts) is simulate.ts; the learner mapping is reconcile.ts.
// Flags: --no-write (print only), --quiet, --lean (the 640-day week shape), --apply (make it live).
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, BANDS, BASE_COURSE, loadApp, loadSeq, lessonKind, type SeqRow } from './data';
import { FROZEN_UNITS, OFF_PATH, MERGE_EXCLUDED, LATAM_SWAP, KEEP_ON_PATH, STUBS, B1_VERB_SETS, NEW_DEEP, INTO_DEEP, WEEK, NODE_MOVES, NODE_ADDS, PROPOSED_TEACHES, UNTAUGHT_28, DEEP_FOLD } from './model';
import { simulate, nodeModel, type Course, type SimResult } from './simulate';
import { patchStrandLessons, type Edit } from './patch-lessons';
import { reconcile, oldLearner } from './reconcile';

const args = new Set(process.argv.slice(2));
const W = loadApp();
const SEQ = loadSeq();
const lessonById: Record<string, any> = Object.fromEntries((W.ALL_LESSONS as any[]).map((l) => [l.id, l]));
// every lesson in data/strand-lessons.js, including the ones js/lessons.js MERGES folds into another for now
const rawById: Record<string, any> = Object.fromEntries((W.STRAND_LESSONS as any[]).map((l) => [l.id, l]));
const isDay = (v: string) => /^\d+$/.test(v);
const rowOf: Record<string, SeqRow> = Object.fromEntries(SEQ.rows.map((r) => [r.lesson_id, r]));

/* ---------------------------------------------------------------------------
 * 1. SEQ's 537 positions as slots
 * ------------------------------------------------------------------------- */
type Slot = { pos: number; unit: string; kind: 'lesson' | 'verbs' | 'gap'; id?: string; verbs?: string[]; gap?: 'practice' | 'review' | 'writing'; stub?: boolean; added?: string };
const verbSets: Record<string, string[]> = {};
(W.COURSE_DAYS as any[]).forEach((d) => { if (d.verbs) verbSets[d.verbs[0]] = d.verbs.slice(); });

const at: Record<number, Slot> = {};
SEQ.rows.filter((r) => isDay(r.new_day) && r.action !== 'merge')
  .forEach((r) => { at[+r.new_day] = { pos: +r.new_day, unit: r.new_unit.split(' ')[0], kind: 'lesson', id: r.lesson_id }; });
const unitRange: Record<string, { from: number; to: number; theme: string; goal: string; band: string }> = {};
SEQ.units.forEach((u) => { unitRange[u.id] = { from: u.from, to: u.to, theme: u.theme, goal: u.goal, band: u.band }; });
// B2 and C1 are tabled in aggregate: take each unit's range and theme from its rows
SEQ.rows.filter((r) => isDay(r.new_day) && /^[bc][12]-n\d\d/.test(r.new_unit)).forEach((r) => {
  const id = r.new_unit.split(' ')[0];
  if (SEQ.units.some((u) => u.id === id)) return;
  const u = unitRange[id] || (unitRange[id] = { from: 1e9, to: -1, theme: r.new_unit.slice(id.length + 1), goal: '', band: id.slice(0, 2).toUpperCase() });
  u.from = Math.min(u.from, +r.new_day); u.to = Math.max(u.to, +r.new_day);
});
const unitAt = (p: number) => Object.keys(unitRange).find((k) => unitRange[k].from <= p && p <= unitRange[k].to)!;
Object.entries(SEQ.NEW).forEach(([id, v]) => { at[v.day] = { pos: v.day, unit: unitAt(v.day), kind: 'lesson', id, stub: true }; });

const slots: Slot[] = [];
for (let p = 0; p <= 536; p++) {
  if (at[p]) { slots.push(at[p]); continue; }
  let u = unitAt(p);
  if (!u) { for (let q = p + 1; q <= 536; q++) if (at[q]) { u = at[q].unit; break; } }
  slots.push({ pos: p, unit: u, kind: 'gap', gap: 'practice' });
}
// name the gaps: A1-A2 from the unit tables (verb days with their set, the practice day); B1 verb days
// by B1_VERB_SETS, the rest writing then review; B2 and C1: writing, writing, review
SEQ.units.filter((u) => u.band !== 'B1').forEach((u) => {
  u.verbDays.forEach((p, i) => { const s = slots[p]; s.kind = 'verbs'; s.verbs = verbSets[u.verbHeads[i]]; delete s.gap; });
});
const byUnit: Record<string, Slot[]> = {};
slots.forEach((s) => (byUnit[s.unit] = byUnit[s.unit] || []).push(s));
Object.entries(byUnit).forEach(([u, ss]) => {
  if (/^a[12]-/.test(u)) return;
  const gaps = ss.filter((s) => s.kind === 'gap');
  const sets = (B1_VERB_SETS[u] || []).slice();
  gaps.forEach((s, i) => {
    if (sets.length) { s.kind = 'verbs'; s.verbs = verbSets[sets.shift()!]; delete s.gap; return; }
    s.gap = i === gaps.length - 1 ? 'review' : 'writing';
  });
});
for (const s of slots) if (s.kind === 'verbs' && !s.verbs) throw new Error('verb day without a set at ' + s.pos);

/* ---------------------------------------------------------------------------
 * 2. the Latin American swap, the two path keeps, the added stubs
 * ------------------------------------------------------------------------- */
let seqOrder = slots.slice();
{
  const [a, b] = LATAM_SWAP.map((u) => unitRange[u]);
  const A = seqOrder.filter((s) => s.pos >= a.from && s.pos <= a.to), B = seqOrder.filter((s) => s.pos >= b.from && s.pos <= b.to);
  seqOrder = [...seqOrder.filter((s) => s.pos < a.from), ...B, ...seqOrder.filter((s) => s.pos > a.to && s.pos < b.from), ...A, ...seqOrder.filter((s) => s.pos > b.to)];
}
function insertAfter(id: string, unit: string, after: string | null | undefined, extra: Partial<Slot>) {
  let i = after ? seqOrder.findIndex((s) => s.id === after) : seqOrder.findIndex((s) => s.unit === unit);
  if (i < 0) throw new Error(`cannot place ${id}: ${after || unit} not found`);
  const ref = seqOrder[i];
  const slot: Slot = { pos: ref.pos + (after ? 0.5 : -0.5), unit, kind: 'lesson', id, ...extra };
  seqOrder.splice(after ? i + 1 : i, 0, slot);
}
Object.entries(KEEP_ON_PATH).forEach(([id, k]) => insertAfter(id, k.unit, k.after, { added: 'phase 0: stays on the path' }));
Object.entries(STUBS).filter(([, s]) => s.unit).forEach(([id, s]) => insertAfter(id, s.unit!, s.after, { stub: true, added: 'this proposal' }));

/* ---------------------------------------------------------------------------
 * 3. the frozen week one
 * ------------------------------------------------------------------------- */
const frozen = (W.COURSE as any[]).filter((e) => FROZEN_UNITS.includes(e.unit));
const frozenLessons = new Set<string>(), frozenVerbs = new Set<string>();
frozen.forEach((u) => u.days.forEach((d: any) => { if (d.lesson) frozenLessons.add(d.lesson); if (d.verbs) frozenVerbs.add(d.verbs[0]); }));
const n01 = unitRange['a1-n01'];
const consumed: Slot[] = [];
seqOrder = seqOrder.filter((s) => {
  const out = (s.kind === 'lesson' && (frozenLessons.has(s.id!) || OFF_PATH.includes(s.id!)))
    || (s.kind === 'verbs' && frozenVerbs.has(s.verbs![0]))
    || (s.kind === 'gap' && s.pos >= n01.from && s.pos <= n01.to);   // week one has its own practice days
  if (out) consumed.push(s);
  return !out;
});

/* ---------------------------------------------------------------------------
 * 4. weeks
 *
 * A week is Introduce, Drill, Input (one or two), Output, Mixed review: five sessions, six where it
 * holds a second Input, four where it holds none. Each SEQ unit's order (tasks aside) is cut into
 * CONSECUTIVE runs of one to `maxItems` lessons and verb days, one run per week, choosing the cut with
 * the fewest weeks and, among those, the fewest moves. Inside a week:
 *   - the Introduce is its grammar lesson when it has one (the lesson moves to the front), else its
 *     first function, notion, genre or discourse lesson (the "big lesson"); a verb day never leads;
 *   - with `maxGrammar` 2 a week may hold a second grammar point, which goes last, just before the
 *     Output: the Drill or an Input sits between the two, so they are never on consecutive days, and
 *     the Output or Review day practises the second one a day or two later;
 *   - SEQ's task lessons stay where SEQ has them: a task ends the run before it and is that week's
 *     Output (two tasks in a row are two Outputs); a week with no task gets {practice, output};
 *   - weeks do not cross SEQ units, so a week keeps its unit's theme.
 * The Drill reuses a SEQ practice, writing or review day at most WEEK.drillReuseWithin positions after the
 * Introduce, else it is inserted; Output and Review reuse the unit's remaining writing and review days.
 * ------------------------------------------------------------------------- */
type Week = { seq: string; intro: Slot | null; inputs: Slot[]; g2: Slot | null; outputs: Slot[]; moved: number; drill?: Slot | null; outGap?: Slot | null; revGap?: Slot | null };
type Opts = { maxItems: number; maxGrammar: number };

function groups(order: Slot[]): Array<{ seq: string; items: Slot[] }> {
  const gs: Array<{ seq: string; items: Slot[] }> = [];
  order.forEach((s) => { const g = gs[gs.length - 1]; if (g && g.seq === s.unit) g.items.push(s); else gs.push({ seq: s.unit, items: [s] }); });
  // what week one leaves of a1-n01 (fn-no-entiendo-a1, gender-articles) opens a1-n02
  if (gs[0] && gs[0].seq === 'a1-n01' && gs[1]) { gs[1].items = [...gs[0].items, ...gs[1].items]; gs.shift(); }
  return gs;
}
const kindOf = (s: Slot) => (s.kind === 'verbs' ? 'verbs' : s.kind === 'gap' ? 'gap' : lessonKind(s.id!));

/** One run of SEQ items as a week, or null when it cannot be one. */
function asWeek(seq: string, run: Slot[], o: Opts): Week | null {
  const gi = run.map((s, i) => (kindOf(s) === 'grammar' ? i : -1)).filter((i) => i >= 0);
  if (gi.length > o.maxGrammar) return null;
  const lead = gi.length ? gi[0] : run.findIndex((s) => kindOf(s) !== 'verbs');
  if (lead < 0) return null;                       // verb days only
  const g2 = gi.length > 1 ? gi[1] : -1;
  const inputs = run.filter((_, i) => i !== lead && i !== g2);
  const moved = lead + (g2 >= 0 ? run.length - 1 - g2 : 0);
  return { seq, intro: run[lead], inputs, g2: g2 >= 0 ? run[g2] : null, outputs: [], moved };
}
/** Cut a run of SEQ items into the fewest weeks (then fewest four-session weeks, two-point weeks and moves). */
function partition(seq: string, xs: Slot[], o: Opts, lastMax = o.maxItems): Week[] {
  const n = xs.length, f: number[] = [0], back: number[] = [0], wk: Array<Week | null> = [null];
  for (let i = 1; i <= n; i++) {
    f[i] = Infinity;
    for (let size = 1; size <= (i === n ? lastMax : o.maxItems) && size <= i; size++) {
      const w = asWeek(seq, xs.slice(i - size, i), o);
      if (!w) continue;
      const pen = 1000 + (size === 1 ? 5 : 0) + (w.g2 ? 2 + (w.inputs.length ? 0 : 3) : 0) + w.moved;
      if (f[i - size] + pen < f[i]) { f[i] = f[i - size] + pen; back[i] = i - size; wk[i] = w; }
    }
    if (f[i] === Infinity) throw new Error(`${seq}: no week fits ${xs.slice(Math.max(0, i - o.maxItems), i).map((s) => s.id || s.verbs?.[0]).join(', ')}`);
  }
  const out: Week[] = [];
  for (let i = n; i > 0; i = back[i]) out.unshift(wk[i]!);
  return out;
}

function weekify(order: Slot[], o: Opts): Week[] {
  const out: Week[] = [];
  for (const g of groups(order)) {
    // split the unit's content at its tasks: a task closes the run before it
    const segs: Array<{ items: Slot[]; tasks: Slot[] }> = [];
    let run: Slot[] = [];
    for (const s of g.items) {
      const k = kindOf(s);
      if (k === 'gap') continue;
      if (k !== 'task') { run.push(s); continue; }
      if (run.length) { segs.push({ items: run, tasks: [s] }); run = []; }
      else if (segs.length) segs[segs.length - 1].tasks.push(s);
      else throw new Error(`${g.seq}: a task with nothing before it (${s.id})`);
    }
    if (run.length) segs.push({ items: run, tasks: [] });
    const weeks: Week[] = [];
    // a run that ends on two tasks keeps its last week to six sessions
    segs.forEach((sg) => {
      const cap = Math.max(1, o.maxItems - Math.max(0, sg.tasks.length - 1));
      let ws: Week[];
      try { ws = partition(g.seq, sg.items, o, cap); } catch { ws = partition(g.seq, sg.items, o); }   // the cap is a preference
      ws[ws.length - 1].outputs.push(...sg.tasks); weeks.push(...ws);
    });
    // reuse SEQ's practice, writing and review days
    const gaps = g.items.filter((s) => s.kind === 'gap');
    const used = new Set<Slot>();
    for (const wk of weeks) {
      if (!wk.intro) continue;
      const d = gaps.find((x) => !used.has(x) && x.pos > wk.intro!.pos && x.pos <= wk.intro!.pos + WEEK.drillReuseWithin);
      if (d) { used.add(d); wk.drill = d; }
    }
    for (const wk of weeks) {
      if (wk.outputs.length) continue;
      const d = gaps.find((x) => !used.has(x) && x.gap === 'writing');
      if (d) { used.add(d); wk.outGap = d; }
    }
    for (const wk of weeks.slice().reverse()) {
      const d = gaps.slice().reverse().find((x) => !used.has(x) && (x.gap === 'review' || x.gap === 'practice'));
      if (d) { used.add(d); wk.revGap = d; }
    }
    (out as any).dropped = ((out as any).dropped || 0) + gaps.filter((x) => !used.has(x)).length;
    out.push(...weeks);
  }
  return out;
}

/* ---------------------------------------------------------------------------
 * 5. units and days
 * ------------------------------------------------------------------------- */
const seqTheme = (u: string) => (unitRange[u] ? unitRange[u].theme : u);
/* learner-facing lines carry no dashes (the playtest rule): a dash becomes a comma or a colon */
const nodash = (s: string) => String(s || '').replace(/\s*[—–]\s*/g, ', ');
const seqGoal = (u: string) => (unitRange[u] ? unitRange[u].goal : '');
const titleOf = (id: string) => (lessonById[id] ? lessonById[id].title : STUBS[id]?.title || SEQ.NEW[id]?.title || id);
function lessonDay(s: Slot, kind: string): any {
  const d: any = { lesson: s.id, kind };
  if (!rawById[s.id!] && !lessonById[s.id!]) d.stub = true;   // a lesson nobody has written yet
  return d;
}
type Unit = { unit: string; band: string; title: string; goal: string; canDo: string[]; seq: string; week: string; days: any[] };
type Shape = { drillAfterInputLead: boolean; outputPractice: boolean };
function unitsOf(weeks: Week[], shape: Shape = { drillAfterInputLead: true, outputPractice: true }): Unit[] {
  const perSeq: Record<string, number> = {}, seen: Record<string, number> = {};
  weeks.forEach((w) => { perSeq[w.seq] = (perSeq[w.seq] || 0) + 1; });
  let n = 2;
  return weeks.map((w) => {
    n++;
    seen[w.seq] = (seen[w.seq] || 0) + 1;
    const band = (unitRange[w.seq] && unitRange[w.seq].band) || w.seq.slice(0, 2).toUpperCase();
    const days: any[] = [];
    if (w.intro) days.push(lessonDay(w.intro, 'introduce'));
    if (w.intro && (shape.drillAfterInputLead || lessonKind(w.intro.id!) === 'grammar')) days.push({ practice: true, drill: true, kind: 'drill', ...(w.drill ? {} : { inserted: true }) });
    w.inputs.forEach((s) => days.push(s.kind === 'verbs' ? { verbs: s.verbs, kind: 'input' } : lessonDay(s, 'input')));
    if (w.g2) days.push(lessonDay(w.g2, 'introduce'));
    if (w.outputs.length) w.outputs.forEach((s) => days.push(lessonDay(s, 'output')));
    else if (shape.outputPractice) days.push({ practice: true, output: true, kind: 'output', ...(w.outGap ? {} : { inserted: true }) });
    days.push({ practice: true, review: true, check: true, kind: 'review', ...(w.revGap ? {} : { inserted: true }) });
    const lessons = days.filter((d) => d.lesson).map((d) => d.lesson as string);
    const canDo: string[] = [];
    lessons.forEach((id) => { const c = lessonById[id] && lessonById[id].canDo; const t = Array.isArray(c) ? c[0] : c; if (t && !canDo.includes(t) && canDo.length < 4) canDo.push(t); });
    const k = perSeq[w.seq], i = seen[w.seq];
    const big = w.intro ? titleOf(w.intro.id!) : titleOf(lessons[0]);
    return {
      unit: `${band.toLowerCase()}-w${String(n).padStart(3, '0')}`, band,
      title: seqTheme(w.seq) + (k > 1 ? ` (${i} of ${k})` : ''),
      goal: nodash((() => {
        const introCan = w.intro && lessonById[w.intro.id!] && lessonById[w.intro.id!].canDo;
        const c = Array.isArray(introCan) ? introCan[0] : introCan;
        if (i === k && seqGoal(w.seq)) return seqGoal(w.seq);
        if (c) return 'I can ' + String(c).replace(/^I can /i, '');
        return seqGoal(w.seq) || (canDo[0] ? 'I can ' + canDo[0].replace(/^I can /i, '') : big);
      })()),
      canDo: canDo.map(nodash), seq: w.seq, week: `${i}/${k}`, days,
    };
  });
}

const PROPOSAL: Opts = { maxItems: WEEK.maxInputs + 1, maxGrammar: 2 };
const weeks = weekify(seqOrder, PROPOSAL);
const droppedGaps = (weeks as any).dropped as number;
// --lean: the 640-day calendar the owner chose on 5 November 2026: no Drill after a function, notion or
// genre big lesson, and no Output practice day in a week with no task.
const LEAN: Shape = { drillAfterInputLead: false, outputPractice: false };
const units = unitsOf(weeks, args.has('--lean') ? LEAN : undefined);

/* ---------------------------------------------------------------------------
 * 6. deep units, aliases, cuts, and the accounting that every id lands once
 * ------------------------------------------------------------------------- */
const aliases: Record<string, string> = {}, excludedMerges: string[] = [];
SEQ.rows.filter((r) => r.action === 'merge').forEach((r) => { if (MERGE_EXCLUDED[r.lesson_id]) excludedMerges.push(r.lesson_id); else aliases[r.lesson_id] = r.target; });
const cuts = SEQ.rows.filter((r) => r.action === 'cut').map((r) => r.lesson_id);
const pathIds = new Set<string>([...frozenLessons]);
units.forEach((u) => u.days.forEach((d) => { if (d.lesson) pathIds.add(d.lesson); }));

const oldDeep = (W.COURSE as any[]).filter((e) => e.optional);
const newDeepIds = new Set(Object.values(NEW_DEEP).flatMap((d) => d.lessons));
const deepUnits: any[] = oldDeep.map((u) => ({ ...u, days: u.days.filter((d: any) => !pathIds.has(d.lesson) && !aliases[d.lesson] && !INTO_DEEP[d.lesson] && !newDeepIds.has(d.lesson)).map((d: any) => ({ ...d })) }));
Object.entries(INTO_DEEP).forEach(([id, uid]) => { const u = deepUnits.find((x) => x.unit === uid); if (!u) throw new Error('no deep unit ' + uid); u.days.push({ lesson: id }); });
Object.entries(NEW_DEEP).forEach(([uid, d]) => deepUnits.push({ unit: uid, band: d.band, optional: true, triggers: d.triggers, title: d.title, goal: d.goal, canDo: [], days: d.lessons.map((id) => ({ lesson: id })), added: true }));

/* Alias sources (the merged lessons) leave the path and become reference lessons that their target's page links to
 * (`deeper`), so the target reaches what it absorbed. A source whose target cannot carry the link (a ladder lesson
 * that is not in data/strand-lessons.js, or no lesson yet) goes to a deep unit instead, with the catch-all below. */
const finalTarget = (id: string): string => { const seen = new Set<string>(); while (aliases[id] && !seen.has(id)) { seen.add(id); id = aliases[id]; } return id; };
const deeperAdd: Record<string, string[]> = {};
const aliasToShelf: string[] = [];      // alias sources reached through a deep unit instead of a deeper link
const aliasPending: string[] = [];      // alias sources js/lessons.js MERGES still folds away: they get status + link once un-merged
const oldDeepOf: Record<string, string> = {};
oldDeep.forEach((u) => u.days.forEach((d: any) => { oldDeepOf[d.lesson] = u.unit; }));
// the path as the learner meets it, to find a strand lesson next to a target that is a ladder lesson (presente, condperf, ...)
const pathSeq: string[] = [...frozen.flatMap((u: any) => u.days.map((d: any) => d.lesson).filter(Boolean)), ...units.flatMap((u) => u.days.map((d: any) => d.lesson).filter(Boolean))];
const carrierFor = (t: string, a: string): string | null => {
  if (rawById[t] && lessonById[t] && t !== a && (pathIds.has(t) || deepUnits.some((u) => u.days.some((d: any) => d.lesson === t)))) return t;
  const i = pathSeq.indexOf(t);
  if (i < 0) return null;
  for (let k = 1; k <= 6; k++) for (const j of [i - k, i + k]) { const c = pathSeq[j]; if (c && c !== a && rawById[c] && lessonById[c] && lessonById[c].strand !== 'task') return c; }
  return null;
};
Object.keys(aliases).forEach((a) => {
  if (!lessonById[a]) { aliasPending.push(a); return; }
  if (oldDeepOf[a]) { deepUnits.find((u) => u.unit === oldDeepOf[a])!.days.push({ lesson: a }); return; }   // it was in a deep unit: it stays there
  const c = carrierFor(finalTarget(a), a);
  if (c) (deeperAdd[c] = deeperAdd[c] || []).push(a); else aliasToShelf.push(a);
});

/* The catch-all: every lesson in the app that SEQ neither puts on the path, nor in a deep unit, nor merges, nor cuts,
 * and that is not kept off the path on purpose, goes to a deep unit of its band grouped by its `theme`. */
const homed = new Set<string>([...pathIds, ...Object.keys(aliases), ...OFF_PATH, ...excludedMerges]);
deepUnits.forEach((u) => u.days.forEach((d: any) => homed.add(d.lesson)));
const themeLabel: Record<string, string> = Object.fromEntries(((W.THEMES as any[]) || []).map((t) => [t.id, t.label || t.title || t.id]));
const orphans = (W.ALL_LESSONS as any[]).filter((l) => !homed.has(l.id));
{
  const groups: Record<string, any[]> = {};
  orphans.forEach((l) => { const b = BANDS.includes(l.cefr) ? l.cefr : 'A1'; (groups[`${b}|${l.theme || l.strand}`] = groups[`${b}|${l.theme || l.strand}`] || []).push(l); });
  const lone: Record<string, any[]> = {};
  Object.entries(groups).forEach(([k, ls]) => {
    const [b, th] = k.split('|');
    if (ls.length >= 2) {
      const lab = themeLabel[th] || th;
      deepUnits.push({ unit: `deep-${b.toLowerCase()}-${th}`, band: b, optional: true, triggers: [], title: `More ${b} reference: ${lab}`, goal: `I can look up the finer points of ${lab} at ${b}.`, canDo: [], days: ls.map((l) => ({ lesson: l.id })), added: true });
    } else (lone[b] = lone[b] || []).push(...ls);
  });
  Object.entries(lone).forEach(([b, ls]) => {
    const home = deepUnits.find((u) => u.band === b && u.added) || deepUnits.find((u) => u.band === b);
    if (ls.length >= 2 || !home) deepUnits.push({ unit: `deep-${b.toLowerCase()}-other`, band: b, optional: true, triggers: [], title: `More ${b} reference`, goal: `I can look up the finer points of ${b} Spanish.`, canDo: [], days: ls.map((l) => ({ lesson: l.id })), added: true });
    else home.days.push(...ls.map((l) => ({ lesson: l.id })));
  });
}
aliasToShelf.forEach((a) => {
  const l = lessonById[a]; const b = BANDS.includes(l.cefr) ? l.cefr : 'A1';
  const home = deepUnits.find((u) => u.band === b && u.added) || deepUnits.find((u) => u.band === b);
  if (!home) throw new Error('no deep unit to take ' + a);
  home.days.push({ lesson: a });
});

/* A deep unit needs two lessons: fold the single ones (model.ts DEEP_FOLD, else the first deep unit of the band). */
for (const u of deepUnits.slice()) {
  if (u.days.length >= 2) continue;
  const into = deepUnits.find((x) => x.unit === DEEP_FOLD[u.unit]) || deepUnits.find((x) => x !== u && x.band === u.band && x.days.length >= 2);
  if (!into) throw new Error('cannot fold single-lesson deep unit ' + u.unit);
  into.days.push(...u.days); into.triggers = [...new Set([...(into.triggers || []), ...(u.triggers || [])])];
  deepUnits.splice(deepUnits.indexOf(u), 1);
}

/* A deep unit says what the learner can do after it: its lessons' own can-dos, else a plain line from the first lesson's summary. */
const plain = (h: string) => String(h || '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/[–—]/g, ',').replace(/\s+/g, ' ').trim();
const canDoOf = (ids: string[]): string[] => {
  const out: string[] = [];
  ids.forEach((id) => { const c = (lessonById[id] || rawById[id] || {}).canDo; const t = (Array.isArray(c) ? c[0] : c) as string; if (t) { const x = plain(t).replace(/^I can /i, ''); if (!out.includes(x) && out.length < 4) out.push(x); } });
  if (!out.length) {
    const l = lessonById[ids[0]] || rawById[ids[0]] || {};
    const first = plain(l.summary || l.title).split(/(?<=[.!?])\s/)[0].replace(/[.!?]$/, '');
    out.push(`read about ${first.charAt(0).toLowerCase() + first.slice(1)}`.slice(0, 160));
  }
  return out;
};
deepUnits.forEach((u) => { if (!u.canDo || !u.canDo.length) u.canDo = canDoOf(u.days.map((d: any) => d.lesson)); });

const deepIds = new Set<string>();
deepUnits.forEach((u) => u.days.forEach((d: any) => {
  if (deepIds.has(d.lesson)) throw new Error('twice in deep units: ' + d.lesson);
  deepIds.add(d.lesson);
  const l = lessonById[d.lesson];
  if (!l) throw new Error('deep lesson missing from the app: ' + d.lesson);
  if (l.status !== 'reference') d.status = 'reference';
}));
// every id in the app lands exactly once: path, deep, alias, cut (in a deep unit) or off the path
const placed: Record<string, string> = {};
const land = (id: string, where: string) => { if (placed[id]) throw new Error(`${id} placed twice (${placed[id]}, ${where})`); placed[id] = where; };
pathIds.forEach((id) => land(id, 'path'));
deepIds.forEach((id) => land(id, cuts.includes(id) ? 'deep (cut)' : 'deep'));
Object.keys(aliases).filter((id) => !deepIds.has(id)).forEach((id) => land(id, 'alias'));
cuts.filter((id) => !deepIds.has(id)).forEach((id) => land(id, 'cut'));
OFF_PATH.concat(excludedMerges.filter((id) => !pathIds.has(id))).forEach((id) => land(id, 'off-path reference'));
const unplaced = (W.ALL_LESSONS as any[]).map((l) => l.id).filter((id: string) => !placed[id]);
if (unplaced.length) throw new Error('lessons the proposal does not place: ' + unplaced.join(', '));
const stubIds = [...pathIds].filter((id) => !lessonById[id]);
const missingStub = stubIds.filter((id) => !STUBS[id]);
if (missingStub.length) throw new Error('stubs with no model entry: ' + missingStub.join(', '));
const notOptional = SEQ.rows.filter((r) => r.action === 'make optional' && !KEEP_ON_PATH[r.lesson_id] && !deepIds.has(r.lesson_id));
if (notOptional.length) throw new Error('make-optional lessons with no deep unit: ' + notOptional.map((r) => r.lesson_id).join(', '));
// lessons in data/strand-lessons.js that MERGES hides from the app and that nothing homes yet (they get a home once un-merged and this reruns)
const hidden = Object.keys(rawById).filter((id) => !lessonById[id] && !placed[id] && !aliases[id] && !pathIds.has(id));

/* What the lesson file must say: reference for the shelf, path for the lifted, and the deeper links. */
const shelf = new Set<string>([...deepIds, ...Object.keys(aliases), ...cuts, ...OFF_PATH, ...excludedMerges.filter((id) => !pathIds.has(id))]);
const lessonEdits: Edit[] = [];
Object.keys(rawById).forEach((id) => {
  const r = rawById[id], isRef = r.status === 'reference';
  const e: Edit = { id };
  if (shelf.has(id) && !isRef) e.status = 'reference';
  if (pathIds.has(id) && isRef) e.status = null;
  if (deeperAdd[id]) e.addDeeper = deeperAdd[id];
  const drop = ((r.deeper as string[]) || []).filter((x) => pathIds.has(x));      // a deeper link to a lesson now on the path is a no-op the gate refuses
  if (drop.length) e.dropDeeper = drop;
  if (e.status !== undefined || e.addDeeper || e.dropDeeper) lessonEdits.push(e);
});

/* ---------------------------------------------------------------------------
 * 7. write the proposed course (a drop-in for data/course.js) and the aliases
 * ------------------------------------------------------------------------- */
const courseSrc = readFileSync(join(ROOT, BASE_COURSE), 'utf8');
const frozenSrc = courseSrc.slice(courseSrc.indexOf('  /* Unit 1 · Meet someone'), courseSrc.indexOf("  { unit: 'a1-u03'"));
const derivedSrc = courseSrc.slice(courseSrc.lastIndexOf('/* ===', courseSrc.indexOf(' * DERIVED — the flat day list')));
if (!frozenSrc.includes("unit: 'a1-u01'") || !frozenSrc.includes("unit: 'a1-u02'") || !derivedSrc.includes('window.COURSE_BANDS')) throw new Error('course.js layout changed; update the slice markers');

const q = (s: string) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const val = (v: any): string => (Array.isArray(v) ? `[${v.map(val).join(', ')}]` : typeof v === 'string' ? q(v) : String(v));
const dayStr = (d: any) => '{ ' + Object.entries(d).map(([k, v]) => `${k}: ${val(v)}`).join(', ') + ' }';
function unitStr(u: any): string {
  const head = [`unit: ${q(u.unit)}`, `band: ${q(u.band)}`]
    .concat(u.optional ? ['optional: true', `triggers: ${val(u.triggers || [])}`] : [])
    .concat([`title: ${q(u.title)}`]);
  const lines = [`  { ${head.join(', ')},`];
  if (u.seq) lines.push(`    seq: ${q(u.seq)}, week: ${q(u.week)},`);
  if (u.goal) lines.push(`    goal: ${q(u.goal)},`);
  if (u.canDo && u.canDo.length) lines.push(`    canDo: [${u.canDo.map(q).join(',\n            ')}],`);
  lines.push('    days: [');
  u.days.forEach((d: any) => {
    const note = d.lesson && (d.stub ? `   // STUB: ${titleOf(d.lesson)}` : '');
    lines.push(`      ${dayStr(d)},${note || ''}`);
  });
  lines.push('    ] },');
  return lines.join('\n');
}
const bandHead = (b: string, n: number) => `\n  /* ==== ${b} · ${n} weeks ${'='.repeat(60)} */\n`;
let body = '';
let lastBand = 'A1';
units.forEach((u) => {
  if (u.band !== lastBand) { body += bandHead(u.band, units.filter((x) => x.band === u.band).length); lastBand = u.band; }
  body += unitStr(u) + '\n\n';
});
const headerFor = (live: boolean) => `/* ============================================================================
 * COURSE — the 640-day re-sequence (Stage 6). GENERATED by ${live ? '`nice npx tsx tools/reseq/build.ts --lean --apply`' : 'tools/reseq/build.ts'}; do not edit by hand.
 *
 * ${live ? 'This IS the live course: index.html loads it, and everything that reads COURSE, COURSE_DAYS, COURSE_UNITS and COURSE_BANDS reads it.\n * Change the generator (tools/reseq/build.ts, tools/reseq/model.ts) and rerun it; the course before the re-sequence is kept as\n * tools/reseq/base/course.pre-reseq.js, which the generator reads for week one and the old deep units.' : 'A review copy of the course the generator would write to data/course.js (run it with --apply to make it live).'}
 * It is SEQ's order (docs/research/Fluidez Spanish course sequencing.md) with
 * the Latin American correction, a1-u01 and a1-u02 exactly as they were, and every other unit cut into
 * weeks of Introduce, Input and a closing review (the lean 640-day calendar the owner chose on 5 November 2026):
 *   introduce  the week's big lesson (its grammar point when it has one)
 *   drill      { practice: true, drill: true } after a grammar Introduce (inserted: true where no SEQ practice day was near)
 *   input      a function, notion, genre or discourse lesson, or a verb day: reading and theme
 *   output     the unit's task lesson, where SEQ has one
 *   review     { practice: true, review: true, check: true }: mixed review and the unit check; a week ends here
 * A day with stub: true names a lesson that does not exist yet. Deep-unit days with status: 'reference' are lessons
 * this re-sequence takes off the path; a deep unit costs no day. Merges are not concatenated: they are aliases, in
 * data/lesson-aliases.js (window.LESSON_ALIASES).
 *
 * Report: docs/plan-2026-11-04/resequence.md
 * ========================================================================== */
window.COURSE = [

  /* ==== A1 ============================================================== */

  /* ---- week one, copied verbatim from data/course.js (redesigned 4 November) ---- */

${frozenSrc}
  /* ---- from here on, SEQ's order in weeks ---------------------------------- */

${body}
  /* ==== OPTIONAL DEEP UNITS ===============================================
   * These cost no day (the derived block skips optional units). The twelve the course had, with SEQ's
   * re-homings, and ${Object.keys(NEW_DEEP).length} new ones for the lessons SEQ makes optional. */
${deepUnits.map(unitStr).join('\n\n')}

];



${derivedSrc}`;
const header = headerFor(false), headerLive = headerFor(true);

const aliasHeader = (live: boolean) => `/* ============================================================================
 * LESSON ALIASES${live ? '' : ' (review copy)'}. GENERATED by ${live ? '`nice npx tsx tools/reseq/build.ts --lean --apply`' : 'tools/reseq/build.ts'}; do not edit by hand.
 *
 * SEQ's merges as redirects, not concatenation: a merged lesson's id resolves to the lesson it merges
 * into, and so do its progress (fluidez.progress.studied) and its review records. The merged lesson stays in the
 * app as a reference lesson, linked from its target's \`deeper\` list. The target lesson
 * needs a rewrite that absorbs what the merged one taught (SEQ: the hubs "need rewriting rather than
 * concatenation"). Not merged here: ${excludedMerges.join(', ')} (see the report).
 * Targets that are stubs (lessons not written yet): ${[...new Set(Object.values(aliases))].filter((t) => !rawById[t]).join(', ') || 'none'}.
 * The six SEQ cuts (${cuts.join(', ')}) are not redirected: they are reference lessons in deep units.
 * ========================================================================== */
`;
const aliasBody = `{\n${Object.entries(aliases).map(([a, b]) => `  ${q(a)}: ${q(b)},`).join('\n')}\n};\n`;
const aliasSrc = aliasHeader(false) + 'window.LESSON_ALIASES_PROPOSED = ' + aliasBody + `\n/* SEQ's cuts: no redirect; a learner who studied one keeps nothing to redirect. */\nwindow.LESSON_CUTS_PROPOSED = [${cuts.map(q).join(', ')}];\n`;
const aliasLive = aliasHeader(true) + 'window.LESSON_ALIASES = ' + aliasBody;

if (!args.has('--no-write')) {
  writeFileSync(join(ROOT, 'tools/reseq/out/course.proposed.js'), header);
  writeFileSync(join(ROOT, 'tools/reseq/out/lesson-aliases.proposed.js'), aliasSrc);
}

/* ---------------------------------------------------------------------------
 * 8. simulate, reconcile, variants
 * ------------------------------------------------------------------------- */
// the proposed course exactly as the file derives it (re-run the written source when it was written)
function deriveCourse(src: string): Course {
  const ctx: any = { window: {} };
  new Function('window', src)(ctx.window);
  return { days: ctx.window.COURSE_DAYS, units: ctx.window.COURSE_UNITS, bands: ctx.window.COURSE_BANDS };
}
const proposed = deriveCourse(header);
const current: Course = { days: W.COURSE_DAYS, units: W.COURSE_UNITS, bands: W.COURSE_BANDS };
const sim = simulate(W, proposed, { aliases, proposal: true });
const base = simulate(W, current, { aliases: {}, proposal: false });

const learners = [60, 150, 300].map((d) => {
  const before = oldLearner(current, d);
  return { oldDay: d, before, after: reconcile(before.progress, proposed, aliases) };
});

function lengths(o: Opts, shape?: Shape) {
  const ws = weekify(seqOrder, o), us = unitsOf(ws, shape);
  const per: Record<string, number> = { A1: 19 };
  us.forEach((u) => { per[u.band] = (per[u.band] || 0) + u.days.length; });
  return { per, total: Object.values(per).reduce((a, b) => a + b, 0), units: us.length + 2 };
}
const variants = [
  { name: 'this proposal: up to 6 sessions, a second grammar point may take the sixth', o: PROPOSAL },
  { name: 'up to 6 sessions, one grammar point per week', o: { maxItems: 3, maxGrammar: 1 } },
  { name: 'strict 5 sessions (one Input), one grammar point per week', o: { maxItems: 2, maxGrammar: 1 } },
  { name: 'as proposed, but no Drill after a function, notion or genre big lesson', o: PROPOSAL, shape: { drillAfterInputLead: false, outputPractice: true } },
  { name: 'as proposed, no such Drill, and no Output practice day in a week without a task', o: PROPOSAL, shape: { drillAfterInputLead: false, outputPractice: false } },
].map((v: any) => ({ ...v, ...lengths(v.o, v.shape) }));

/* ---------------------------------------------------------------------------
 * 9. the report
 * ------------------------------------------------------------------------- */
const R: string[] = [];
const dayOf = (id: string) => proposed.days.findIndex((d: any) => d.lesson === id);
const P = (s = '') => R.push(s);
const bandOrder = BANDS.filter((b) => proposed.bands[b] != null);
const bandLen = (c: Course, b: string) => { const i = BANDS.indexOf(b); const from = c.bands[b]; const nexts = BANDS.slice(i + 1).map((x) => c.bands[x]).filter((x) => x != null); return (nexts.length ? Math.min(...nexts) : c.days.length) - from; };
const allUnits = [...frozen.map((u: any) => ({ ...u, seq: 'week one', week: '' })), ...units];
const kindCount = (b: string) => { const c: Record<string, number> = {}; proposed.days.forEach((d: any) => { if (d.band !== b) return; const k = d.kind || 'week one'; c[k] = (c[k] || 0) + 1; }); return c; };
// days that the re-sequence added: SEQ's new lessons and splits, plus the three this proposal adds (written since as reference lessons, now on the path)
const isNewLesson = (id: string) => !!(STUBS[id] || SEQ.NEW[id]);
const stubDays = proposed.days.map((d: any, i: number) => ({ d, i })).filter((x: any) => x.d.lesson && isNewLesson(x.d.lesson));

P('# Stage 6 re-sequence: the 640-day spine');
P();
P('Generated by `nice npx tsx tools/reseq/build.ts --lean` (add `--apply` to make it live) on the `next` branch. The owner chose the 640-day lean calendar on 5 November 2026, and with `--apply` the generator writes it as `data/course.js` and `data/lesson-aliases.js`, edits `status` and `deeper` in `data/strand-lessons.js` (`tools/reseq/patch-lessons.ts`, entry heads only) and merges the node rulings into `tools/lesson-nodes.overrides.json`; without it, only `tools/reseq/out/course.proposed.js`, `tools/reseq/out/lesson-aliases.proposed.js` and this report are written. Inputs: SEQ (the sequencing document and its 674-row CSV), the evidence note (sections 2 and 3), the plan (the week as a chain; Stage 6), the course before the re-sequence (`tools/reseq/base/course.pre-reseq.js`, a copy of the old `data/course.js` that the generator reads for week one, the old deep units and the baseline), `data/lesson-nodes.js`, `data/graph.js`, `data/requires.js`, the bank and the tagging report. The legality and supply numbers come from `tools/reseq/simulate.ts`, which rebuilds `Known.taughtBy` on the proposed order (first day each node is taught, a chunk also teaching what it unpacks) and applies the serving rule of `js/known.js` without loading or changing it.');
P();
P('## Headline');
P();
P(`| | proposed | today (data/course.js) | SEQ as written |`);
P(`|---|---|---|---|`);
bandOrder.forEach((b) => P(`| ${b} days | ${bandLen(proposed, b)} | ${current.bands[b] != null ? bandLen(current, b) : ''} | ${{ A1: 107, A2: 88, B1: 134, B2: 112, C1: 96 }[b]} |`));
P(`| **total days** | **${proposed.days.length}** | ${current.days.length} | 537 |`);
P(`| units on the path | ${allUnits.length} | ${Object.values(current.units).filter((u: any) => !u.optional).length} | 58 |`);
P(`| lesson days | ${proposed.days.filter((d: any) => d.lesson).length} (${stubDays.length} stubs) | ${current.days.filter((d: any) => d.lesson).length} | 399 |`);
P(`| legality: lesson days whose examples need a grammar or contrast node taught later (week one) | ${sim.legality.hardDays} (${sim.legality.hardFrozen}) | ${base.legality.hardDays} | |`);
P(`| legality: lesson days whose examples need only a pattern or chunk taught later | ${sim.legality.softOnlyDays} | ${base.legality.softOnlyDays} | |`);
P(`| legality: lesson days whose examples need a grammar or contrast node no lesson teaches | ${sim.legality.neverDays} | ${base.legality.neverDays} | |`);
P(`| supply: days under 8 servable bank rows for their nodes | ${sim.supply.under8} of ${sim.supply.withNodes} | ${base.supply.under8} of ${base.supply.withNodes} | |`);
P(`| supply: days whose only nodes are can-dos (the bank targets none) | ${sim.supply.candoOnly} | ${base.supply.candoOnly} | |`);
P(`| longest run with no grammar Introduce | ${sim.runs.longest.len} days (${sim.runs.longest.band}, from day ${sim.runs.longest.from}) | ${base.runs.longest.len} days | |`);
P(`| grammar Introduces on consecutive days | ${sim.rules.consecutive.length} | ${base.rules.consecutive.length} | |`);
P(`| grammar Introduces with no practice day within 3 days | ${sim.rules.noDrill.length} | ${base.rules.noDrill.length} | |`);
P(`| contrasts whose two sides are introduced 1 or 2 days apart | ${sim.contrasts.close.length} | ${base.contrasts.close.length} | |`);
P(`| contrasts whose two sides one lesson introduces together | ${sim.contrasts.together.length} | ${base.contrasts.together.length} | |`);
P();
P(`**The calendar is the decision.** SEQ's 399 path lessons in weeks of Introduce, Drill, Input, Output and Mixed review cannot fit SEQ's 537 days: each week spends three of its five or six sessions on practice (Drill, Output when there is no task, Review), so a lesson costs about two days. The variants, all on the same order and the same cut into weeks unless the row says otherwise:`);
P();
P('| week rule | A1 | A2 | B1 | B2 | C1 | total | units |');
P('|---|---|---|---|---|---|---|---|');
variants.forEach((v) => P(`| ${v.name} | ${BANDS.map((b) => v.per[b] || 0).join(' | ')} | **${v.total}** | ${v.units} |`));
P();
P('The proposal takes the first row: the most compact cut the brief\'s rules allow, each week keeping all five kinds of session. The last two rows keep the cut and drop practice days the brief asks for; they are there to show what the owner would be trading. Getting near 537 needs both of those and more, or fewer lessons: above A2, SEQ\'s units are runs of six to eleven function and genre lessons with no grammar point between them.');
P();

P('## Rules as applied');
P();
P(`- **Order.** SEQ's positions 0 to 536 (${SEQ.rows.filter((r) => isDay(r.new_day) && r.action !== 'merge').length} existing lessons, ${Object.keys(SEQ.NEW).length} new, 28 verb days, 110 practice, writing and review days). B1 verb sets are placed by meaning (model.ts B1_VERB_SETS): ${Object.entries(B1_VERB_SETS).map(([u, s]) => `${u} ${s.join(', ')}`).join('; ')}.`);
P(`- **Latin American correction.** SEQ's units ${LATAM_SWAP[0]} (perfecto, "Today and ever", 33 to 37) and ${LATAM_SWAP[1]} (indefinido and the state imperfects, "What happened", 60 to 65) trade places whole, so the preterite takes the perfecto's slot and the perfecto lands where SEQ had the preterite, 27 SEQ positions after its prerequisite g:preterite-ser-ir-hacer (on this spine: preterito day ${dayOf('preterito')}, gr-preterito-perfecto-a2 day ${dayOf('gr-preterito-perfecto-a2')}). This also removes a problem SEQ itself flagged: the perfecto now comes after gustar (38) and reflexives (52), so *me he levantado* and *me ha gustado* are available. The stubs gr-perfecto-vs-indefinido-a2, task-a2-hoy-ayer and gr-pasados-repaso-b1 are retitled to the Latin American split (preterite for anything finished, perfecto for experience and "not yet"). Vosotros and Spain\'s "today" perfecto leave A1 in the node model (g:vosotros-recognition off presente and gr-pronombre-sujeto-a1, g:spain-pasts off the perfecto lesson) and go to a new B2 recognition stub, gr-vosotros-espana-b2, in "Reading the news".`);
P(`- **Week one.** a1-u01 and a1-u02 are copied from data/course.js as source text (comments, \`passage\` and \`write\` fields, dlg-presentarse and gr-cognados-a1 included). They consume ${consumed.filter((s) => s.kind === 'lesson').length} of SEQ's lessons and both irregular verb days; gr-sonidos-a1 stays the off-path reference card. What SEQ's first unit has left (fn-no-entiendo-a1, gender-articles) opens the next unit.`);
P(`- **Weeks.** Every other unit is a week: Introduce (the grammar point, else the big lesson), Drill, Input (one, or two in a six-session week), Output (the task, else output practice), Mixed review with the unit check. Each SEQ unit is cut into consecutive runs of one to three lessons and verb days, one run per week, with the fewest weeks (then the fewest four-session weeks and the fewest moves): the order inside a SEQ unit changes only where a grammar lesson moves to the front of its week. A week may hold a second grammar point; it goes last, just before the Output, so the Drill or an Input sits between the two and the Output or Review day practises it a day or two later. Weeks do not cross SEQ units, so each keeps its theme; SEQ's task lessons end the run before them and are that week's Output. A verb day is always an Input and never leads.`);
P(`- **Drills.** ${sim.counts.drillReused} Drill days reuse a SEQ practice, writing or review day at most ${WEEK.drillReuseWithin} positions after the Introduce; ${sim.counts.drillInserted} are inserted. Output practice: ${sim.counts.outputReused} reused, ${sim.counts.outputInserted} inserted. Reviews: ${sim.counts.reviewReused} reused, ${sim.counts.reviewInserted} inserted. SEQ non-lesson days not reused: ${droppedGaps}.`);
P(`- **Merges** are ${Object.keys(aliases).length} aliases in tools/reseq/out/lesson-aliases.proposed.js; ${excludedMerges.length} SEQ merges are not applied (${excludedMerges.map((id) => `${id}: ${MERGE_EXCLUDED[id]}`).join('; ')}). In the node model a merged lesson's teaches move to its target.`);
P(`- **Splits and new lessons** are path days with \`stub: true\` (${stubDays.length}, listed below). In the node model each split part takes the nodes SEQ names for it (model.ts NODE_MOVES).`);
P(`- **Make optional.** ${SEQ.rows.filter((r) => r.action === 'make optional').length - Object.keys(KEEP_ON_PATH).length} lessons go to deep units with \`status: 'reference'\` where they are not already reference lessons: the twelve deep units the course has, with SEQ's re-homings, plus ${Object.keys(NEW_DEEP).length} new ones (the B1-B2 vocabulary track as four themed units and the C1 track as seven, so neither is one shelf of seventy). ${Object.keys(KEEP_ON_PATH).join(' and ')} stay on the path (phase 0 ruling): ${Object.entries(KEEP_ON_PATH).map(([id, k]) => `${id} in ${k.unit}`).join(', ')}.`);
P(`- **Cuts**: ${cuts.join(', ')}.`);
P();

P('## Counts');
P();
P('| band | days | weeks | introduce | drill | input | output | review | week one | stubs |');
P('|---|---|---|---|---|---|---|---|---|---|');
bandOrder.forEach((b) => { const k = kindCount(b); P(`| ${b} | ${bandLen(proposed, b)} | ${allUnits.filter((u: any) => u.band === b).length} | ${k.introduce || 0} | ${k.drill || 0} | ${k.input || 0} | ${k.output || 0} | ${k.review || 0} | ${k['week one'] || 0} | ${stubDays.filter((x: any) => x.d.band === b).length} |`); });
const lens: Record<number, number> = {}; units.forEach((u) => { lens[u.days.length] = (lens[u.days.length] || 0) + 1; });
P();
P(`Week lengths: ${Object.entries(lens).map(([l, n]) => `${n} of ${l} sessions`).join(', ')} (plus week one: a1-u01 12, a1-u02 7). Weeks with two grammar points: ${units.filter((u) => u.days.filter((d) => d.kind === 'introduce' && lessonKind(d.lesson) === 'grammar').length > 1).length}, of which ${units.filter((u) => u.days.filter((d) => d.kind === 'introduce').length > 1 && !u.days.some((d) => d.kind === 'input')).length} have no Input day (SEQ runs of grammar lessons with nothing between them, mostly A2). Grammar Introduces: ${sim.counts.grammarIntro}.`);
P();

P('## Legality: lesson examples against what the spine has taught');
P();
P('Every `lesson:<id>:ex:<n>` row in data/requires.js against the known set on the lesson\'s own day (everything taught up to and including that day). Serving rule: a grammar or contrast node must be known; a pattern or chunk blocks only when the spine teaches it later. Lessons with no requires rows (stubs, and the lessons the proposal brings onto the path from the shelf) cannot be checked.');
P();
P(`- **A grammar or contrast node taught later on the spine:** ${sim.legality.hardDays} lesson days, ${sim.legality.hardFrozen} of them in week one. Today's course: ${base.legality.hardDays}. These are the ordering problems; the table below lists them.`);
P(`- **Only a pattern or chunk taught later:** ${sim.legality.softOnlyDays} more lesson days (today: ${base.legality.softOnlyDays}). Patterns are tagged on most example sentences and many are taught late or by B1+ lessons, so these are mostly the examples\' incidental phrasing. Most frequent: ${sim.legality.softByNode.slice(0, 15).map(([n, c]: any) => `${n} ${c}`).join(', ')}.`);
P(`- **Never taught by any lesson** (grammar or contrast): ${sim.legality.neverDays} lesson days (${sim.legality.neverRows} rows). Today's course: ${base.legality.neverDays}. These need the example changed or the node homed; by node: ${sim.legality.neverByNode.slice(0, 25).map(([n, c]: any) => `${n} ${c}`).join(', ')}.`);
P(`- Not checkable (no requires rows): ${sim.legality.unchecked.length} lesson days (${sim.legality.unchecked.filter((x: any) => x.stub).length} stubs; the rest: ${sim.legality.unchecked.filter((x: any) => !x.stub).map((x: any) => x.id).join(', ')}).`);
P();
P('Lesson days whose examples need a grammar or contrast node the spine teaches later. "Needs" gives the node and the day it is first taught (grammar and contrast nodes only):');
P();
P('| day | band | unit | lesson | needs (first taught) |');
P('|---|---|---|---|---|');
sim.legality.later.filter((v: any) => v.hard).forEach((v: any) => P(`| ${v.day} | ${v.band} | ${v.unit}${v.frozen ? ' (week one)' : ''} | ${v.lesson} | ${v.nodes.filter((n: any) => n.hard).map((n: any) => `${n.id} (${n.at})`).join(', ')} |`));
P();

P('## Supply: bank rows per day for the day\'s nodes');
P();
P('For each day, the bank rows (all five band files; the band a row was filed under came from the old spine) whose targets `t` include one of the day\'s nodes, deduplicated by normalised Spanish, that are servable that day: every grammar or contrast node in `r` taught by then, and no pattern or chunk in `r` that the spine teaches later. A row\'s legal day is recomputed on the proposed order. The day\'s nodes follow `Known.todayNodes`: a lesson\'s teaches (a stub\'s model teaches and reviews), a verb day\'s present-tense nodes, a practice day\'s unit so far. "Gate-legal" uses the content gate\'s looser rule (never-taught nodes do not block).');
P();
P('| band | days with bank-targetable nodes | under 8 servable | of them none | median servable | median gate-legal | can-do-only days | task days |');
P('|---|---|---|---|---|---|---|---|');
bandOrder.forEach((b) => { const s = sim.supply.byBand[b]; P(`| ${b} | ${s.withNodes} | ${s.under8} | ${s.zero} | ${s.median} | ${s.medianGate} | ${s.candoOnly} | ${s.taskDays} |`); });
P();
P(`Today's course for comparison: ${base.supply.under8} of ${base.supply.withNodes} days under 8 (${bandOrder.map((b) => `${b} ${base.supply.byBand[b] ? base.supply.byBand[b].under8 : 0}`).join(', ')}). Can-do-only days are lessons (and practice days after them) whose node map holds only \`d:\` can-do nodes: the bank targets no can-do, so the session falls back to the unit's rows on those days (mostly C1 discourse and function lessons; the fix is a tagging ruling that gives them their patterns). Task days take nothing targeted from the bank under today's rule (a task teaches no node of its own); if they drew on their week as a practice day does, ${sim.supply.taskAsPractice.under8} of ${sim.supply.taskAsPractice.n} would be under 8.`);
P();
P('Days under 8 servable rows:');
P();
P('| day | band | unit | kind | lesson or day | nodes | servable | gate-legal |');
P('|---|---|---|---|---|---|---|---|');
sim.supply.under.forEach((x: any) => P(`| ${x.day} | ${x.band} | ${x.unit} | ${x.kind} | ${x.what} | ${x.nodes.join(', ')} | ${x.n} | ${x.gate} |`));
P();
P(`Nodes on these days with the fewest servable rows across the spine (top-up candidates for the burn): ${sim.supply.shortNodes.slice(0, 40).map(([n, c]: any) => `${n} ${c}`).join(', ')}.`);
P();

P('## Rhythm and contrasts');
P();
P(`- Longest run with no grammar Introduce, per band: ${bandOrder.map((b) => { const r = sim.runs.byBand[b]; return `${b} ${r.len} (days ${r.from} to ${r.from + r.len - 1})`; }).join('; ')}. Upper-band units are function and genre runs by SEQ's design (B1 has 14 grammar points, B2 9, C1 4).`);
P(`- Grammar Introduces on consecutive days: ${sim.rules.consecutive.length ? sim.rules.consecutive.map((x: any) => `${x.a} and ${x.b} (days ${x.day}, ${x.day + 1}${x.frozen ? ', week one' : ''})`).join('; ') : 'none'}.`);
P(`- Grammar Introduces with no practice day in the next 3: ${sim.rules.noDrill.length ? sim.rules.noDrill.map((x: any) => `${x.lesson} (day ${x.day}${x.frozen ? ', week one' : ''})`).join('; ') : 'none'}.`);
P(`- Contrasts whose sides are introduced 1 or 2 days apart: ${sim.contrasts.close.length ? sim.contrasts.close.map((c: any) => `${c.id} (${c.sides.map((s: any) => `${s.id} day ${s.at}`).join(', ')})`).join('; ') : 'none'}.`);
P(`- Contrasts whose sides one lesson introduces together (a contrast lesson; separated-then-mixed would need a content split): ${sim.contrasts.together.map((c: any) => `${c.id} (${c.lesson}, day ${c.at})`).join('; ') || 'none'}.`);
P(`- Contrasts taught before one of their sides: ${sim.contrasts.early.map((c: any) => `${c.id} day ${c.at} (side ${c.side} day ${c.sideAt})`).join('; ') || 'none'}.`);
P(`- Grammar nodes first "taught" by a chunk that unpacks them (the gate's rule, which known.js follows), before their own lesson: ${sim.chunkEarly.map((c: any) => `${c.node} by ${c.chunk} (${c.lesson}, day ${c.at}; own lesson day ${c.direct ?? 'none'})`).join('; ') || 'none'}.`);
P(`- Grammar nodes no lesson on the proposed spine teaches: ${sim.neverTaught.length} (${sim.neverTaught.map((x: any) => `${x.id} ${x.rows}`).join(', ')}; the number is bank rows that need it and so are never served).`);
P();

P('## Lessons the re-sequence added (stub days, now written)');
P();
P('| day | band | unit | id | title | from | node model |');
P('|---|---|---|---|---|---|---|');
stubDays.forEach(({ d, i }: any) => {
  const id = d.lesson, s = STUBS[id], split = SEQ.rows.find((r) => r.action === 'split' && r.target.split(' + ').includes(id));
  const from = SEQ.NEW[id] ? (split ? `SEQ, split from ${split.lesson_id}` : 'SEQ new lesson') : `this proposal: ${s.why}`;
  const title = s.latam ? `${SEQ.NEW[id]?.title || s.title} *(Latin American: ${s.latam})*` : (SEQ.NEW[id]?.title || s.title);
  P(`| ${i} | ${d.band} | ${d.unit} | ${id} | ${title} | ${from} | ${s.teaches.join(', ') || '(none)'}${s.reviews ? '; reviews ' + s.reviews.join(', ') : ''} |`);
});
P();
P('Lessons the re-sequence brings onto the path from the shelf or a deep unit (`--apply` lifts their `status` from `reference` and writes their node ruling from model.ts PROPOSED_TEACHES): ' + [...pathIds].filter((id) => rawById[id] && rawById[id].status === 'reference' && !isNewLesson(id)).join(', ') + '. The stubs written since (' + stubDays.map(({ d }: any) => d.lesson).join(', ') + ') are lifted the same way, with the rulings of tools/reseq/out/pending-overrides.json.');
P();

P('## Node model changes the simulation uses');
P();
P('LESSON_NODES is not edited. The simulation applies these on top of it (model.ts); each needs a ruling in tools/lesson-nodes.overrides.json when the proposal is applied.');
P();
P('| lesson | change | why |');
P('|---|---|---|');
NODE_MOVES.forEach((m) => P(`| ${m.from} | gives ${m.nodes.join(', ')} to ${m.to} | ${m.why} |`));
NODE_ADDS.forEach((m) => P(`| ${m.to} | also teaches ${m.nodes.join(', ')} | ${m.why} |`));
Object.entries(PROPOSED_TEACHES).filter(([id]) => pathIds.has(id)).forEach(([id, ns]) => P(`| ${id} | teaches ${ns.join(', ') || '(nothing: no node fits)'} | not in LESSON_NODES (it was off the path); provisional, from its title and summary |`));
P(`| every alias target | also teaches what its merged lessons taught | SEQ: the merged lesson's content moves into the target |`);
P();

P('## Aliases');
P();
P(`${Object.keys(aliases).length} merges, in tools/reseq/out/lesson-aliases.proposed.js. Grouped by target (the targets need a rewrite that absorbs the merged lessons; the four B1 emotion hubs and the C1 hubs most of all):`);
P();
const byTarget: Record<string, string[]> = {};
Object.entries(aliases).forEach(([a, b]) => (byTarget[b] = byTarget[b] || []).push(a));
P('| target | where | merged into it |');
P('|---|---|---|');
Object.entries(byTarget).forEach(([t, as]) => P(`| ${t}${lessonById[t] ? '' : ' (stub)'} | ${placed[t] === 'path' ? 'day ' + proposed.days.findIndex((d: any) => d.lesson === t) : placed[t] || 'stub'} | ${as.join(', ')} |`));
P();

P('## Reconciliation: where an existing learner lands');
P();
P('`tools/reseq/reconcile.ts` keeps a learner\'s place by the number of path lessons they have studied (aliases resolved), never rewinds them, and queues every lesson the new spine puts before that place which they have not studied as `fluidez.progress.catchUp`, in spine order. A learner is simulated as having studied every path lesson of today\'s course before their day.');
P();
learners.forEach(({ oldDay, before, after }) => {
  P(`- **Old day ${oldDay}** (${before.band}, beginnerDay ${before.progress.beginnerDay}, ${before.studiedCount} lessons studied, ${after.counted} of them on the new path once aliases resolve): lands on new day ${after.position} (${after.band}, beginnerDay ${after.beginnerDay}, unit ${after.unit} "${after.unitTitle}"). Catch-up queue: ${after.catchUp.length} lessons (${after.catchUp.filter((x: any) => x.stub).length} stubs): ${after.catchUp.slice(0, 30).map((x: any) => x.id + (x.stub ? '*' : '')).join(', ')}${after.catchUp.length > 30 ? ', …' : ''}. Already studied further on: ${after.aheadStudied}. Today\'s rebuild (walk to the first gap) would put them at new day ${after.firstGap}.`);
});
P();
P('(* a stub.) The queue holds what SEQ moved earlier than the learner\'s place plus the new lessons. How fast to serve it (for example one catch-up lesson every other session, alongside the path) is a Stage 6 implementation choice. For B1 and above the session serves the next unstudied lesson of the band, so there the queue matters only for gaps in earlier bands.');
P();

P('## The proposed units');
P();
P('Day numbers are indices into the proposed path. Kinds: I introduce, D drill, In input, O output, R review; \\* a stub; (+) an inserted practice day.');
P();
bandOrder.forEach((b) => {
  P(`### ${b} (from day ${proposed.bands[b]}, ${bandLen(proposed, b)} days)`);
  P();
  P('| unit | title | SEQ unit | days |');
  P('|---|---|---|---|');
  allUnits.filter((u: any) => u.band === b).forEach((u: any) => {
    const cu = proposed.units[u.unit];
    const ds = proposed.days.slice(cu.from, cu.from + cu.length).map((d: any, j: number) => {
      const k = d.kind ? { introduce: 'I', drill: 'D', input: 'In', output: 'O', review: 'R' }[d.kind as string] : '';
      const what = d.lesson ? d.lesson + (d.stub ? '\\*' : '') : d.verbs ? 'verbs ' + d.verbs[0] + '…' : d.practice ? 'practice' : '?';
      return `${cu.from + j} ${k ? k + ' ' : ''}${what}${d.inserted ? ' (+)' : ''}`;
    });
    P(`| ${u.unit} | ${u.title} | ${u.seq}${u.week ? ' ' + u.week : ''} | ${ds.join('; ')} |`);
  });
  P();
});
P('### Deep units (optional, no day)');
P();
P('| unit | band | title | lessons |');
P('|---|---|---|---|');
deepUnits.forEach((u) => P(`| ${u.unit}${u.added ? ' (new)' : ''} | ${u.band} | ${u.title} | ${u.days.map((d: any) => d.lesson + (d.status ? '°' : '')).join(', ')} |`));
P();
P('(° newly optional: the day carries `status: \'reference\'`; the lesson\'s own `status` in data/strand-lessons.js changes when this is applied.)');
P();

P('## Judgement calls');
P();
[
  `The week rule that sets the calendar: each SEQ unit cut into the fewest consecutive weeks of one to three items (${Object.entries(lens).sort((a, b) => +b[0] - +a[0]).map(([l, n]) => `${n} weeks of ${l} sessions`).join(', ')}), with a second grammar point allowed at the end of a week. Without that allowance the course is ${variants[1].total} days (A1 ${variants[1].per.A1} instead of ${variants[0].per.A1}); with strict five-session weeks it is ${variants[2].total}. It keeps both of the evidence note's per-day rules (never two grammar Introduces on consecutive days; a practice day within three days), but the second point's practice is the week's Output or Review day, not a dedicated Drill, and ${units.filter((u) => u.days.filter((d) => d.kind === 'introduce').length > 1 && !u.days.some((d) => d.kind === 'input')).length} two-point weeks have no Input day.`,
  `The Latin American swap moves two whole SEQ units rather than two lessons, so the state imperfects (gr-imperfecto-estados-a1) stay beside the first preterite as SEQ intended and the perfecto keeps "ya / todavía no" (nt-anterioridad-a2) and its task. SEQ\'s irregular-preterite split (gr-indefinido-irregular-a2) stays at its position (start of A2): on this spine that is day ${dayOf('gr-indefinido-irregular-a2')}, ${dayOf('gr-indefinido-irregular-a2') - dayOf('preterito')} days after the preterite (SEQ had 47 positions; the rebuild 21 sessions). The brief named only the two lessons, so it is listed under "Needs the owner" rather than moved.`,
  'Vosotros and Spain\'s "today" perfecto are moved in the node model only. presente and gr-pronombre-sujeto-a1 are in the frozen week one and still show vosotros in their content; that needs a content edit, not a move.',
  'SEQ\'s splits are applied to the node model even for the frozen ser-estar (estar + adjective goes to the A2 stub). Its examples do not use estar + adjective, so week one stays legal.',
  'Two SEQ merges are not aliased: dc-entonacion-a1 (a live day of frozen a1-u02) and gr-acentuacion-a1 (the redesign keeps it behind the sounds card).',
  'Weeks never cross SEQ units, so a week keeps its theme and SEQ\'s tasks keep their place; the cost is some four-session weeks at unit ends.',
  `A grammar lesson moves to the front of its week and a second one to its end, so inside a SEQ unit the order changes by at most two positions; ${weeks.filter((w) => w.moved > 0).length} weeks have such a move.`,
  `Three stubs are added beyond SEQ's seventeen: gr-vosotros-espana-b2 (the recognition lesson the correction needs), gr-se-cambio-significado-b1 and gr-para-que-sin-que-b1 (homes for the two grammar nodes that have no lesson at all). Of the tagging report's 28 untaught grammar nodes, ${UNTAUGHT_28.filter((n) => sim.firstDay.has(n)).length} are taught on this spine (${UNTAUGHT_28.filter((n) => sim.firstDay.has(n)).map((n) => `${n} day ${sim.firstDay.get(n)}`).join(', ')}: by stubs, by gr-el-que-relativos-b2 which SEQ brings onto the path for relatives after prepositions, or through merges and chunks) and ${UNTAUGHT_28.filter((n) => !sim.firstDay.has(n)).length} are not; they are left for Stage 5 rather than given guessed homes.`,
  'Stub node models are provisional (model.ts STUBS). Teaching c:me-gustaria, c:ojala and c:que-te-mejores as chunks makes the gate\'s unpack rule count g:conditional and g:subj-wishes as taught from those days; the list above shows where that happens. That is the gate\'s rule, kept as is; whether a chunk should unpack a whole paradigm is a Stage 1 question.',
  'The B1 verb sets are placed by meaning (opinion verbs in What I think, señalar and indicar in Agreeing and arguing, the feeling verbs in Feelings, mejorar and empeorar in Joining ideas up, participar and reciclar in Writing at length, pesar and calcular in The physical world).',
  'The make-optional notion lessons are grouped into themed deep units rather than two long tracks. The B2 ones were not triaged lesson by lesson here, against the standing rule (notion lessons teach patterns; triage per lesson); see below.',
  'Task days keep today\'s rule (no nodes of their own, so no targeted bank rows); the supply section shows what changes if they drew on their week.',
].forEach((s, i) => P(`${i + 1}. ${s}`));
P();

const needing = (node: string) => [...new Set(sim.legality.later.filter((v: any) => v.nodes.some((n: any) => n.id === node)).map((v: any) => `${v.lesson} (${v.day})`))] as string[];
P('## Needs the owner');
P();
[
  `**The calendar.** ${proposed.days.length} days against SEQ's 537 and today's ${current.days.length}. Accept it (more retrieval days at every band, and SEQ itself says the course is short of hours), or drop the Drill after a non-grammar big lesson (${variants[3].total} days), and also the Output practice day in weeks with no task (${variants[4].total}), or cut and merge more B1 to C1 function lessons to get nearer 537. build.ts computes each variant on the same cut.`,
  '**The B2 notion lessons going optional** (38, plus nt-textura-consistencia-b1 kept). The standing rule is per-lesson triage; phase 0 found pattern content in many of them (nt-cualidad-general-b2, nt-formas-figuras-b2, nt-peso-b2, nt-orientacion-direccion-b2, nt-distancia-b2). This proposal follows the brief and SEQ; the triage should happen before it is applied.',
  `**The stubs.** ${stubDays.length} path days are lessons the re-sequence added; they are written (as reference lessons first) and now on the path, but the burn still has to give them scripts, scenes and bank rows. Days that still name a lesson nobody has written: ${proposed.days.filter((d: any) => d.stub).map((d: any) => d.lesson).join(', ') || 'none'}.`,
  `**Legality.** ${sim.legality.hardDays} lesson days have examples that need a grammar or contrast node the spine teaches later (${sim.legality.hardFrozen} of them in week one), and ${sim.legality.softOnlyDays} more need only a pattern or chunk taught later; ${sim.legality.neverDays} need a grammar node no lesson teaches. Most are lessons SEQ pulls earlier (listed above). Each needs an example audit before the move ships, which the plan already requires ("course moves wait for the legality gate").`,
  `**Catch-up size.** A learner at old day 150 would be queued ${learners[1].after.catchUp.length} catch-up lessons. Decide the serving rate, and whether stubs are queued before they exist.`,
  `**Irregular preterites earlier?** The preterite is day ${dayOf('preterito')} and SEQ's irregular-preterite day is ${dayOf('gr-indefinido-irregular-a2')}. The Latin American default past needs tuve, estuve, pude, dije far sooner, and the preterite lesson's own examples already use them (see the legality table). Moving gr-indefinido-irregular-a2 into "What happened", after the state imperfects, would cost no days.`,
  `**Spain-only examples before B2.** With vosotros recognition at B2 (day ${sim.firstDay.get('g:vosotros-recognition')}), these lessons\' examples use vosotros or Spain\'s past earlier and need the Latin American pass: ${needing('g:vosotros-recognition').concat(needing('g:spain-pasts')).join(', ') || 'none'}. The frozen presente and gr-pronombre-sujeto-a1 still show vosotros in their tables.`,
  `**Parecer with gustar.** SEQ teaches gustar, encantar, parecer and quedar as one construction on its day 38 (here gr-verbos-predicativos-tipos-a2, day ${proposed.days.findIndex((d: any) => d.lesson === 'gr-verbos-predicativos-tipos-a2')}), but that lesson covers encantar and doler, and the map puts g:parecer-quedar on nt-evaluacion-valor-b1 (day ${sim.firstDay.get('g:parecer-quedar')}). Examples that use it earlier: ${needing('g:parecer-quedar').join(', ')}. Rewriting the gustar lesson as SEQ describes clears them.`,
  `**The article in week one.** Week one\'s examples use el and la (g:gender-articles) from day 0; the lesson comes on day ${sim.firstDay.get('g:gender-articles')}, the first day after week one (SEQ had it on day 8). Either accept that week one meets articles as chunks, or move gender-articles into the frozen units.`,
  `**Week shape in the gate.** The lean weeks end on the review check, and ${units.filter((u) => !u.days.some((d) => d.lesson && lessonKind(d.lesson) === 'task')).length} of the ${units.length} weeks have no task lesson and no output practice day (that is what the 640-day calendar drops). tools/validate-content.js now accepts a unit that ends on a task lesson or on a review check day, and still holds week one (a1-u01, a1-u02) to its task.`,
  `**Lessons js/lessons.js MERGES hides.** ${hidden.length} lessons in data/strand-lessons.js are folded into another lesson by the MERGES table, so they are not in ALL_LESSONS and have no home in any unit; this generator homes them (by theme, in a deep unit of their band) the next time it runs after they are un-merged.`,
].forEach((s) => P(`- ${s}`));
P();
P('## Reproduce');
P();
P('```');
P('nice npx tsx tools/reseq/build.ts --lean          # writes the two proposed data files and this report');
P('nice npx tsx tools/reseq/build.ts --lean --apply  # also writes data/course.js, data/lesson-aliases.js, the lesson edits and the node rulings');
P('nice npx tsx tools/tag-data.ts                      # regenerates data/lesson-nodes.js, requires.js and the band split');
P('nice npx tsx tools/reseq/reconcile.ts      # prints the three learners');
P('```');

if (!args.has('--no-write')) writeFileSync(join(ROOT, 'docs/plan-2026-11-04/resequence.md'), R.join('\n') + '\n');

if (!args.has('--quiet')) {
  console.log(`proposed: ${proposed.days.length} days, ${allUnits.length} units; ${bandOrder.map((b) => `${b} ${bandLen(proposed, b)}`).join(', ')}`);
  console.log(`stubs ${stubDays.length}; aliases ${Object.keys(aliases).length}; deep units ${deepUnits.length}`);
  console.log(`legality: later ${sim.legality.laterDays} days, never ${sim.legality.neverDays} days (today: ${base.legality.laterDays}, ${base.legality.neverDays})`);
  console.log(`supply: ${sim.supply.under8}/${sim.supply.withNodes} days under 8 (today ${base.supply.under8}/${base.supply.withNodes})`);
  console.log(`runs: longest ${sim.runs.longest.len}; consecutive ${sim.rules.consecutive.length}; no drill ${sim.rules.noDrill.length}; close contrasts ${sim.contrasts.close.length}`);
  variants.forEach((v) => console.log(`variant ${v.total} ${JSON.stringify(v.per)} — ${v.name}`));
  learners.forEach((l) => console.log(`learner old ${l.oldDay} -> new ${l.after.position} (${l.after.band}), catch-up ${l.after.catchUp.length}, first-gap ${l.after.firstGap}`));
}

/* ---------------------------------------------------------------------------
 * 10. --apply: make it the live course
 *   data/strand-lessons.js          status and `deeper` edits (patch-lessons.ts), nothing else in the file
 *   data/course.js                  the generated course, header saying it is live
 *   data/lesson-aliases.js          window.LESSON_ALIASES
 *   tools/lesson-nodes.overrides.json   the node-model rulings the simulation used (NODE_MOVES, NODE_ADDS, PROPOSED_TEACHES,
 *                                   alias targets taking what their merged lessons taught, the written stubs' rulings)
 * Then run: nice npx tsx tools/tag-data.ts; nice npx tsx tools/split-data.ts; node tools/build-game-index.js;
 *           node tools/gen-assets.js; node tools/bump-cache.js; node tools/validate-content.js
 * ------------------------------------------------------------------------- */
if (args.has('--apply')) {
  const edit = patchStrandLessons(ROOT, lessonEdits, true);
  writeFileSync(join(ROOT, 'data/course.js'), headerLive);
  writeFileSync(join(ROOT, 'data/lesson-aliases.js'), aliasLive);

  const OVR = join(ROOT, 'tools/lesson-nodes.overrides.json');
  const overrides: Record<string, { teaches: string[]; note?: string }> = existsSync(OVR) ? JSON.parse(readFileSync(OVR, 'utf8')) : {};
  const PENDING = join(ROOT, 'tools/reseq/out/pending-overrides.json');
  const pending: Record<string, { teaches: string[]; note?: string }> = existsSync(PENDING) ? JSON.parse(readFileSync(PENDING, 'utf8')) : {};
  const model = nodeModel(W, { aliases, proposal: true }).teaches;
  const why: Record<string, string[]> = {};
  const note = (id: string, t: string) => (why[id] = why[id] || []).push(t);
  NODE_MOVES.forEach((m) => { note(m.from, `gives ${m.nodes.join(', ')} to ${m.to}`); if (m.to) note(m.to, `takes ${m.nodes.join(', ')} from ${m.from}`); });
  NODE_ADDS.forEach((m) => note(m.to, `also teaches ${m.nodes.join(', ')}`));
  Object.entries(aliases).forEach(([a, b]) => { if ((W.LESSON_NODES[a]?.teaches || []).length) note(b, `absorbs ${a}`); });
  const same = (x: string[], y: string[]) => x.length === y.length && x.every((n) => y.includes(n));
  const wrote: string[] = [], stubDiff: string[] = [];
  for (const id of pathIds) {
    if (!rawById[id]) continue;
    const have = overrides[id] ? overrides[id].teaches : W.LESSON_NODES[id]?.teaches;
    const stubModel = STUBS[id]?.teaches;
    if (pending[id] && stubModel && !same(pending[id].teaches, stubModel)) stubDiff.push(id);
    const want: string[] | undefined = pending[id]?.teaches ?? PROPOSED_TEACHES[id] ?? (model.get(id) as string[] | undefined);
    if (!want) continue;
    if (have && same(want, have)) continue;
    if (!have && !pending[id] && !PROPOSED_TEACHES[id]) continue;
    const prior = overrides[id]?.note;
    const tag = pending[id]?.note || (why[id] ? `Re-sequence: ${why[id].join('; ')}.` : PROPOSED_TEACHES[id] ? 'Re-sequence: lifted onto the path; provisional, from its title and summary.' : 'Re-sequence node model.');
    overrides[id] = { teaches: want.slice(), note: prior && !pending[id] ? `${prior} ${tag}` : tag };
    wrote.push(id);
  }
  writeFileSync(OVR, JSON.stringify(overrides, null, 2));
  console.log(`apply: strand-lessons.js ${edit.changed.length} lessons edited${edit.missing.length ? ', NOT FOUND: ' + edit.missing.join(', ') : ''}; data/course.js, data/lesson-aliases.js written; ${wrote.length} node overrides written (${Object.keys(overrides).length} in file)`);
  if (stubDiff.length) console.log(`apply: pending ruling differs from model.ts STUBS for ${stubDiff.join(', ')} (the pending ruling is used)`);
}
if (!args.has('--quiet')) {
  if (aliasToShelf.length) console.log(`alias sources placed in deep units because the target cannot carry a link: ${aliasToShelf.map((a) => a + ' -> ' + finalTarget(a)).join(', ')}`);
  console.log(`deep units ${deepUnits.length} (${deepIds.size} lessons); alias sources linked by deeper ${Object.values(deeperAdd).reduce((a, v) => a + v.length, 0)}, to deep units ${aliasToShelf.length}, pending un-merge ${aliasPending.length}${aliasPending.length ? ' (' + aliasPending.join(', ') + ')' : ''}; lesson edits ${lessonEdits.length}`);
  if (hidden.length) console.log(`${hidden.length} lessons that js/lessons.js MERGES folds into another have no home yet (they get one when un-merged and this reruns): ${hidden.slice(0, 6).join(', ')}, ...`);
}
export type { SimResult };
