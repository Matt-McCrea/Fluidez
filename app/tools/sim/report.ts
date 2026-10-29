// Aggregate profile runs into the per-band report and the per-unit quotas.
import type { Band, Unit } from '../../src/content/schema';
import type { Demand, ProfileRun } from './run';

const BANDS: Band[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const QUOTA_FACTOR = 3;

export interface BandRow {
  profile: string;
  band: Band;
  startDay?: number;
  finishDay?: number;
  /** calendar days spent in the band (finish − previous finish), undefined if not finished */
  calendarDays?: number;
  sessions: number;
  avgEstMinutes: number;
  avgSimMinutes: number;
  /** mean of dueMinutes / review budget */
  reviewLoad: number;
  /** % of sessions whose due minutes exceeded the budget */
  overBudgetPct: number;
  /** % of sessions converted by the throttle */
  throttledPct: number;
  minimumPct: number;
  under4: string;
}

export function bandRows(runs: ProfileRun[]): BandRow[] {
  const rows: BandRow[] = [];
  for (const run of runs) {
    let prevFinish = -1;
    for (const band of BANDS) {
      const ss = run.sessions.filter((s) => s.band === band);
      const finish = run.bandFinish[band];
      const ur = run.underReviewed[band];
      rows.push({
        profile: run.profile, band,
        startDay: run.bandStart[band],
        finishDay: finish,
        calendarDays: finish !== undefined ? finish - prevFinish : undefined,
        sessions: ss.length,
        avgEstMinutes: avg(ss.map((s) => s.estMinutes)),
        avgSimMinutes: avg(ss.map((s) => s.simMinutes)),
        reviewLoad: avg(ss.map((s) => s.dueMinutes / s.budgetMinutes)),
        overBudgetPct: pct(ss.filter((s) => s.dueMinutes > s.budgetMinutes).length, ss.length),
        throttledPct: pct(ss.filter((s) => s.converted === 'throttle').length, ss.length),
        minimumPct: pct(ss.filter((s) => s.type === 'minimum').length, ss.length),
        under4: ur ? `${ur.under4}/${ur.judged} (${pct(ur.under4, ur.judged).toFixed(1)}%)` : '-',
      });
      if (finish !== undefined) prevFinish = finish;
    }
  }
  return rows;
}

export interface UnitQuota {
  bankSentences: number;
  chapters: number;
  scenes: number;
  writingTasks: number;
  /** max demand across profiles that reached the unit */
  maxDemand: Demand;
  /** true = no profile reached this unit; extrapolated from its band (or the course) */
  estimated: boolean;
  shortages: number;
}

export interface Quotas {
  generatedAt: string;
  factor: number;
  source: 'synthetic' | 'real';
  days: number;
  tier: string;
  profiles: string[];
  units: Record<string, UnitQuota>;
  /** sentences consumed with the node as the item's node, by node kind; quota = factor × p95 (the max is a leech outlier) */
  perNode: Record<string, { maxDemand: number; p95Demand: number; meanDemand: number; quota: number }>;
}

export function computeQuotas(runs: ProfileRun[], units: Unit[], meta: Omit<Quotas, 'units' | 'perNode' | 'factor' | 'generatedAt'>): Quotas {
  const out: Record<string, UnitQuota> = {};
  const measured = new Map<string, Demand>();
  for (const u of units) {
    const ds = runs.map((r) => r.demand[u.id]).filter((d): d is Demand => !!d && d.sentences + d.chapters + d.scenes + d.tasks > 0);
    // only count a unit as measured when some profile finished it
    const finished = runs.some((r) => r.finalUnit > units.indexOf(u));
    if (ds.length && finished) measured.set(u.id, maxDemand(ds));
  }
  const bandMax = new Map<Band, Demand>();
  for (const u of units) {
    const m = measured.get(u.id);
    if (m) bandMax.set(u.band, maxDemand([bandMax.get(u.band) ?? zero(), m]));
  }
  // unreached band: the last few measured units (demand tapers with level; the course max would overstate it)
  const lastMeasured = units.filter((u) => measured.has(u.id)).slice(-5).map((u) => measured.get(u.id)!);
  const recent = maxDemand([...lastMeasured, zero()]);
  for (const u of units) {
    const m = measured.get(u.id);
    const d = m ?? bandMax.get(u.band) ?? recent;
    const listed = u.days.filter((x) => x.chapter).length;
    out[u.id] = {
      bankSentences: Math.ceil(QUOTA_FACTOR * d.sentences),
      // the story is linear: every chapter is read exactly once, so no multiplier — one per chapter slot
      chapters: Math.max(listed, d.chapters),
      scenes: Math.ceil(QUOTA_FACTOR * d.scenes),
      writingTasks: Math.ceil(QUOTA_FACTOR * d.tasks),
      maxDemand: d,
      estimated: !m,
      shortages: Math.max(0, ...runs.map((r) => r.shortages[u.id] ?? 0)),
    };
  }
  const perNode: Quotas['perNode'] = {};
  for (const k of new Set(runs.flatMap((r) => Object.keys(r.nodeDemand)))) {
    const max = Math.max(...runs.map((r) => r.nodeDemand[k]?.max ?? 0));
    const p95 = Math.max(...runs.map((r) => r.nodeDemand[k]?.p95 ?? 0));
    const mean = Math.max(...runs.map((r) => r.nodeDemand[k]?.mean ?? 0));
    perNode[k] = { maxDemand: max, p95Demand: p95, meanDemand: round1(mean), quota: Math.ceil(QUOTA_FACTOR * p95) };
  }
  return { generatedAt: new Date().toISOString(), factor: QUOTA_FACTOR, ...meta, units: out, perNode };
}

export function formatReport(runs: ProfileRun[], quotas: Quotas): string {
  const lines: string[] = [];
  const rows = bandRows(runs);
  lines.push(`Fluidez simulator — ${quotas.source} content, ${quotas.days} days, tier ${quotas.tier}`);
  lines.push('');
  lines.push(table(
    ['profile', 'band', 'start', 'finish', 'cal.days', 'sessions', 'est.min', 'sim.min', 'load/budget', '%over', '%throttled', '%minimum', '<4 rev/60d'],
    rows.map((r) => [r.profile, r.band, fmt(r.startDay), fmt(r.finishDay), fmt(r.calendarDays), String(r.sessions),
      r.avgEstMinutes.toFixed(1), r.avgSimMinutes.toFixed(1), r.reviewLoad.toFixed(2), r.overBudgetPct.toFixed(1),
      r.throttledPct.toFixed(1), r.minimumPct.toFixed(1), r.under4]),
  ));
  lines.push('');
  lines.push(table(
    ['profile', 'sessions', 'course done', 'unit reached', 'UNINTENDED REPEATS', 'item rep.60d %', '(deliberate)', 'shortages', 'bare reviews', 'owed at end'],
    runs.map((r) => {
      const unintended = Object.values(r.unintendedRepeats).reduce((a, b) => a + b, 0);
      return [r.profile, String(r.sessions.length), fmt(r.courseFinishedDay), String(r.finalUnit),
        `${unintended}${unintended ? ' ✗' : ''}`, pct(r.itemRepeats60, r.itemServes).toFixed(2), String(r.itemRepeats60Deliberate),
        String(sum(Object.values(r.shortages))), String(sum(Object.values(r.bareReviews))), String(r.owedAtEnd)];
    }),
  ));
  lines.push('');
  lines.push('Shortages by block:what (per profile):');
  for (const r of runs) lines.push(`  ${r.profile.padEnd(9)} ${Object.entries(r.shortageKinds).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}`);
  lines.push('');
  lines.push('Sentences consumed per node (as the item\'s node), worst profile:');
  for (const [k, v] of Object.entries(quotas.perNode)) lines.push(`  ${k.padEnd(9)} mean ${v.meanDemand}  p95 ${v.p95Demand}  max ${v.maxDemand}  → quota ≥ ${v.quota} per node (${quotas.factor} × p95)`);
  lines.push('');
  lines.push(`Quotas per unit (sentences/scenes/tasks = ${quotas.factor} × max demand across profiles; chapters = chapter slots, read once; * = extrapolated, unit not reached):`);
  lines.push(table(
    ['unit', 'sentences', 'chapters', 'scenes', 'tasks', 'max demand s/c/sc/t', 'shortages'],
    Object.entries(quotas.units).map(([id, q]) => [`${id}${q.estimated ? '*' : ''}`, String(q.bankSentences), String(q.chapters), String(q.scenes), String(q.writingTasks),
      `${q.maxDemand.sentences}/${q.maxDemand.chapters}/${q.maxDemand.scenes}/${q.maxDemand.tasks}`, String(q.shortages)]),
  ));
  return lines.join('\n');
}

function maxDemand(ds: Demand[]): Demand {
  return ds.reduce((a, d) => ({
    sentences: Math.max(a.sentences, d.sentences), chapters: Math.max(a.chapters, d.chapters),
    scenes: Math.max(a.scenes, d.scenes), tasks: Math.max(a.tasks, d.tasks),
  }), zero());
}
function zero(): Demand { return { sentences: 0, chapters: 0, scenes: 0, tasks: 0 }; }
function avg(xs: number[]) { return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0; }
function sum(xs: number[]) { return xs.reduce((a, b) => a + b, 0); }
function pct(a: number, b: number) { return b ? (100 * a) / b : 0; }
function round1(x: number) { return Math.round(x * 10) / 10; }
function fmt(x: number | undefined) { return x === undefined ? '-' : String(x); }

function table(head: string[], rows: string[][]): string {
  const w = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i]?.length ?? 0)));
  const line = (r: string[]) => r.map((c, i) => c.padEnd(w[i])).join('  ');
  return [line(head), line(w.map((n) => '-'.repeat(n))), ...rows.map(line)].join('\n');
}
