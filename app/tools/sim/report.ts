// Aggregate profile runs into the per-band report and the per-unit quotas.
import type { Band, Unit } from '../../src/content/schema';
import { zeroDemand, type Demand, type ProfileRun, type RetentionStats } from './run';

const BANDS: Band[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const QUOTA_FACTOR = 3;

export interface BandRow {
  profile: string;
  tier: string;
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
  recvUnder3: string;
}

export function bandRows(runs: ProfileRun[]): BandRow[] {
  const rows: BandRow[] = [];
  for (const run of runs) {
    let prevFinish = -1;
    for (const band of BANDS) {
      const ss = run.sessions.filter((s) => s.band === band);
      const finish = run.bandFinish[band];
      const ur = run.underReviewed[band];
      const rr = run.underReviewedRecv[band];
      rows.push({
        profile: run.profile, tier: run.tier, band,
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
        recvUnder3: rr ? `${rr.under3}/${rr.judged} (${pct(rr.under3, rr.judged).toFixed(1)}%)` : '-',
      });
      if (finish !== undefined) prevFinish = finish;
    }
  }
  return rows;
}

export interface UnitQuota {
  bankSentences: number;
  /** of bankSentences, the part first used as review contexts (reused after REVIEW_REUSE_DAYS) */
  reviewSentences: number;
  chapters: number;
  scenes: number;
  writingTasks: number;
  /** p95 (nearest rank) demand across the runs (profiles × tiers) that finished the unit */
  p95Demand: Demand;
  maxDemand: Demand;
  /** true = no profile reached this unit; extrapolated from its band (or the course) */
  estimated: boolean;
  shortages: number;
}

export interface Quotas {
  generatedAt: string;
  factor: number;
  /** what the factor multiplies */
  basis: 'p95 across runs';
  source: 'synthetic' | 'real';
  days: number;
  tier: string;
  profiles: string[];
  /** review-context reuse rule in force when the demand was measured */
  reviewContextReuseDays: number;
  totals: { bankSentences: number; reviewSentences: number; chapters: number; scenes: number; writingTasks: number; byBand: Record<string, { bankSentences: number; reviewSentences: number; chapters: number; scenes: number; writingTasks: number; units: number }> };
  units: Record<string, UnitQuota>;
  /** sentences consumed with the node as the item's node, by node kind; quota = factor × p95 (the max is a leech outlier) */
  perNode: Record<string, { maxDemand: number; p95Demand: number; meanDemand: number; quota: number }>;
}

export function computeQuotas(runs: ProfileRun[], units: Unit[], meta: Omit<Quotas, 'units' | 'perNode' | 'factor' | 'generatedAt' | 'basis' | 'totals' | 'reviewContextReuseDays'> & { reviewContextReuseDays?: number }): Quotas {
  const out: Record<string, UnitQuota> = {};
  const measured = new Map<string, Demand>();
  const measuredMax = new Map<string, Demand>();
  for (const u of units) {
    // only runs that finished the unit measure it
    const ds = runs.filter((r) => r.finalUnit > units.indexOf(u)).map((r) => r.demand[u.id] ?? zeroDemand());
    if (ds.some((d) => d.sentences + d.chapters + d.scenes + d.tasks > 0)) { measured.set(u.id, p95Demand(ds)); measuredMax.set(u.id, maxDemand(ds)); }
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
      reviewSentences: Math.ceil(QUOTA_FACTOR * d.reviewSentences),
      // the story is linear: every chapter is read exactly once, so no multiplier: one per chapter slot
      chapters: Math.max(listed, d.chapters),
      scenes: Math.ceil(QUOTA_FACTOR * d.scenes),
      writingTasks: Math.ceil(QUOTA_FACTOR * d.tasks),
      p95Demand: d,
      maxDemand: measuredMax.get(u.id) ?? d,
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
  const totals: Quotas['totals'] = { bankSentences: 0, reviewSentences: 0, chapters: 0, scenes: 0, writingTasks: 0, byBand: {} };
  for (const u of units) {
    const q = out[u.id];
    const b = (totals.byBand[u.band] ??= { bankSentences: 0, reviewSentences: 0, chapters: 0, scenes: 0, writingTasks: 0, units: 0 });
    b.units++;
    for (const k of ['bankSentences', 'reviewSentences', 'chapters', 'scenes', 'writingTasks'] as const) { b[k] += q[k]; totals[k] += q[k]; }
  }
  return {
    generatedAt: new Date().toISOString(), factor: QUOTA_FACTOR, basis: 'p95 across runs', ...meta,
    reviewContextReuseDays: meta.reviewContextReuseDays ?? 0, totals, units: out, perNode,
  };
}

/** Nearest-rank p95 of each field. */
function p95Demand(ds: Demand[]): Demand {
  const pick = (k: keyof Demand) => {
    const xs = ds.map((d) => d[k]).sort((a, b) => a - b);
    return xs[Math.max(0, Math.ceil(0.95 * xs.length) - 1)] ?? 0;
  };
  return { sentences: pick('sentences'), reviewSentences: pick('reviewSentences'), chapters: pick('chapters'), scenes: pick('scenes'), tasks: pick('tasks') };
}

/** Target retention the scheduler aims at (Learner default settings.retention). */
export const TARGET_RETENTION = 0.9;
/** The average profile's first-try recall must sit within this many points of the target. */
export const RETENTION_TOLERANCE = 0.04;
/** Fewer scored reviews than this in a band is too thin to judge. */
const MIN_REVIEWS_TO_FLAG = 300;

export interface RetentionRow { profile: string; tier: string; band: string; stats: RetentionStats; flag: string }

/** One row per run and band (plus 'all'); the average profile is flagged when off the target. */
export function retentionRows(runs: ProfileRun[]): RetentionRow[] {
  const rows: RetentionRow[] = [];
  for (const run of runs) {
    const bands = Object.keys(run.retention).filter((b) => b !== 'all' && b !== '?').sort();
    for (const band of [...bands, 'all']) {
      const stats = run.retention[band];
      if (!stats || stats.reviews === 0) continue;
      let flag = '';
      if (run.profile === 'average' && stats.reviews >= MIN_REVIEWS_TO_FLAG && Math.abs(stats.firstTry - TARGET_RETENTION) > RETENTION_TOLERANCE) flag = `OFF TARGET (${stats.firstTry > TARGET_RETENTION ? '+' : ''}${((stats.firstTry - TARGET_RETENTION) * 100).toFixed(1)} pts)`;
      rows.push({ profile: run.profile, tier: run.tier, band, stats, flag });
    }
  }
  return rows;
}

const RET_HEAD = ['profile', 'tier', 'band', 'reviews', 'first-try %', 'not-Again %', 'mean R %', 'delayed >=7d first-try % / not-Again % (n)', 'recombine % (n)', 'production %', 'chapter coverage %', 'deferred chapters', 'flag'];
const pc = (x: number | undefined, d = 1) => (x === undefined || Number.isNaN(x) ? '-' : (x * 100).toFixed(d));
function retentionCells(r: RetentionRow): string[] {
  const s = r.stats;
  return [r.profile, r.tier, r.band, String(s.reviews), pc(s.firstTry), pc(s.recall), pc(s.meanR),
    s.delayed === undefined ? '-' : `${pc(s.delayedFirstTry)} / ${pc(s.delayed)} (${s.delayedN})`, s.recombine === undefined ? '-' : `${pc(s.recombine)} (${s.recombineN})`,
    pc(s.production), pc(s.coverage), s.chaptersRead ? `${s.chaptersDeferred}/${s.chaptersRead}` : '-', r.flag];
}

const PLACE_HEAD = ['profile', 'placed at', 'seeded nodes', 'day-1 due', 'day-1 due min', 'warm-up budget min', 'day-1 throttled', 'peak due min (day)', 'throttled sessions', 'within budget from day'];
function placementCells(r: ProfileRun): string[] {
  const p = r.placement!;
  return [r.profile, `${p.unitId ?? `unit ${p.unit}`} (index ${p.unit})`, String(p.seededNodes), String(p.day1.due), p.day1.dueMinutes.toFixed(1), p.day1.budgetMinutes.toFixed(1),
    p.day1.converted === 'throttle' || p.day1.throttled ? 'yes' : 'no', `${p.peakDueMinutes.toFixed(1)} (${p.peakDay})`, `${p.throttledSessions}/${p.sessions}`, fmt(p.settledDay)];
}

export function formatReport(runs: ProfileRun[], quotas: Quotas, placed: ProfileRun[] = []): string {
  const lines: string[] = [];
  const rows = bandRows(runs);
  lines.push(`Fluidez simulator: ${quotas.source} content, ${quotas.days} days, tier ${quotas.tier}`);
  lines.push('');
  lines.push(table(BAND_HEAD, rows.map(bandCells)));
  lines.push('');
  lines.push(table(RUN_HEAD, runs.map(runCells)));
  lines.push('');
  lines.push(`Retention (event log; target ${TARGET_RETENTION * 100}%; first-try = graded Good, not-Again = Good or Hard):`);
  lines.push(table(RET_HEAD, retentionRows(runs).map(retentionCells)));
  lines.push('');
  lines.push(`Grades: ${runs.map((r) => `${r.profile}/${r.tier} ${gradeText(r)}`).join('; ')}`);
  if (placed.length) { lines.push('', 'Placement backlog (30 days after placement):', table(PLACE_HEAD, placed.map(placementCells))); }
  lines.push('');
  lines.push('Shortages by block:what (per run):');
  for (const r of runs) lines.push(`  ${`${r.profile}/${r.tier}`.padEnd(18)} ${Object.entries(r.shortageKinds).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', ') || 'none'}`);
  lines.push('');
  lines.push('Sentences consumed per node (as the item\'s node, fresh only), worst run:');
  for (const [k, v] of Object.entries(quotas.perNode)) lines.push(`  ${k.padEnd(9)} mean ${v.meanDemand}  p95 ${v.p95Demand}  max ${v.maxDemand}  → quota ≥ ${v.quota} per node (${quotas.factor} × p95)`);
  lines.push('');
  lines.push(`Quotas per unit (${quotas.factor} × p95 demand across runs; chapters = chapter slots, read once; * = extrapolated, unit not finished by any run):`);
  lines.push(table(QUOTA_HEAD, quotaRows(quotas)));
  lines.push('');
  lines.push(totalsText(quotas));
  return lines.join('\n');
}

const BAND_HEAD = ['profile', 'tier', 'band', 'start', 'finish', 'cal.days', 'sessions', 'est.min', 'sim.min', 'load/budget', '%over', '%throttled', '%minimum', '<4 rev/60d', 'recv-only <3/60d'];
function bandCells(r: BandRow): string[] {
  return [r.profile, r.tier, r.band, fmt(r.startDay), fmt(r.finishDay), fmt(r.calendarDays), String(r.sessions),
    r.avgEstMinutes.toFixed(1), r.avgSimMinutes.toFixed(1), r.reviewLoad.toFixed(2), r.overBudgetPct.toFixed(1),
    r.throttledPct.toFixed(1), r.minimumPct.toFixed(1), r.under4, r.recvUnder3];
}

const RUN_HEAD = ['profile', 'tier', 'sessions', 'course done', 'unit reached', 'UNINTENDED REPEATS', 'item rep.60d %', '(deliberate)',
  'fresh sents', 'reused ctx', 'review items', 'multi %', 'targets/item', 'bare', 'shortages', 'recv-only', 'suspended', 'learned', 'owed'];
function runCells(r: ProfileRun): string[] {
  const unintended = Object.values(r.unintendedRepeats).reduce((a, b) => a + b, 0);
  const ri = r.reviewItems;
  return [r.profile, r.tier, String(r.sessions.length), fmt(r.courseFinishedDay), String(r.finalUnit),
    `${unintended}${unintended ? ' ✗' : ''}`, pct(r.itemRepeats60, r.itemServes).toFixed(2), String(r.itemRepeats60Deliberate),
    String(r.freshSentences), String(r.reusedSentences), String(ri.items), pct(ri.multi, ri.items).toFixed(1),
    (ri.items ? ri.targets / ri.items : 0).toFixed(2), String(ri.bare),
    String(sum(Object.values(r.shortages))), String(r.receptiveOnly), String(r.suspendedReceptive), String(r.learned), String(r.owedAtEnd)];
}

const QUOTA_HEAD = ['unit', 'sentences', '(review ctx)', 'chapters', 'scenes', 'tasks', 'p95 demand s/c/sc/t', 'max demand s', 'shortages'];
function quotaRows(q: Quotas): string[][] {
  return Object.entries(q.units).map(([id, u]) => [`${id}${u.estimated ? '*' : ''}`, String(u.bankSentences), String(u.reviewSentences),
    String(u.chapters), String(u.scenes), String(u.writingTasks),
    `${u.p95Demand.sentences}/${u.p95Demand.chapters}/${u.p95Demand.scenes}/${u.p95Demand.tasks}`, String(u.maxDemand.sentences), String(u.shortages)]);
}

function totalsText(q: Quotas): string {
  const t = q.totals;
  const out = [`TOTAL quotas: ${t.bankSentences} bank sentences (${t.reviewSentences} of them review contexts), ${t.chapters} chapters, ${t.scenes} scenes, ${t.writingTasks} writing tasks`];
  for (const [b, x] of Object.entries(t.byBand)) out.push(`  ${b}: ${x.bankSentences} sentences (${x.reviewSentences} review ctx) over ${x.units} units, ${x.chapters} chapters, ${x.scenes} scenes, ${x.writingTasks} tasks`);
  return out.join('\n');
}

/** The markdown summary (content/_reports/sim-summary.md). `notes` are prepended verbatim. */
export function formatMarkdown(runs: ProfileRun[], quotas: Quotas, notes: string, units?: Unit[], placed: ProfileRun[] = []): string {
  const md = (head: string[], rows: string[][]) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
  const L: string[] = [notes.trim(), ''];
  if (units) {
    const t = targets(runs, units);
    L.push('## Targets', '');
    L.push('Targets: average-profile A1 ≤ ~140 calendar days, fast ≤ ~112; B2 throttle conversions < 25%.', '');
    L.push(md(['profile', 'tier', 'A1 days', 'A1 target', 'B2 %throttled', '< 25%?'], t.rows), '');
    L.push(`**Where the A1 days go** (A1 path = ${t.pathDays} unit days; a day advances only on a completed non-minimum, non-converted session):`, '');
    L.push(md(['profile', 'tier', 'A1 cal. days', 'days studied', 'sessions', '"another"', 'minimum', 'throttle conv.', 'other conv.', 'advancing / cal. day', 'A1 days at 0 throttle', 'A1 path days for the target'], t.decomp), '');
    L.push('`A1 days at 0 throttle` = (A1 path days) ÷ (advancing sessions per calendar day, had the throttle conversions advanced). `A1 path days for the target` = what the A1 unit map would have to shrink to for this profile to meet its target (average ≤ 140, fast ≤ 112) at its attendance.', '');
  }
  L.push('## Calendar and load per profile, band and tier', '');
  L.push('`cal.days` = calendar days to finish the band (from the previous band\'s finish). `%throttled` = sessions converted to review by the backlog throttle. `load/budget` = mean due-review minutes ÷ the throttle threshold.', '');
  L.push(md(BAND_HEAD, bandRows(runs).map(bandCells)), '');
  L.push('## Retention', '');
  L.push(`Measured from the learner's event log (\`src/learner/events.ts\`). The simulated answer is circular by design: P(first try) = R^exponent plus noise, R the FSRS retrievability, so the **average** profile (exponent 1) must land near the ${TARGET_RETENTION * 100}% target if the scheduler, the review budget and the warm-up cuts hold the promise; a drift is flagged. Fast (exponent 0.7) should sit above, forgetful (1.6) and irregular (long gaps) below. \`first-try %\` = scored reviews graded Good; \`not-Again %\` = Good or Hard (a retry pass counts); \`mean R %\` = mean retrievability just before the rating; \`delayed >=7d\` = reviews of nodes introduced at least 7 days earlier: first-try share, and \`delayedAccuracy\` (not-Again); \`recombine\` = not-Again on novel-recombination reviews; \`production %\` = \`productionShare\`; \`chapter coverage %\` = mean share of a chapter's required words that were stable when it was read (chapters never weighed count 100%); \`deferred chapters\` = chapters that waited for coverage at least once / chapters read or deferred.`, '');
  L.push(md(RET_HEAD, retentionRows(runs).map(retentionCells)), '');
  L.push('Event grades per run (again / hard / good / easy): ' + runs.map((r) => `${r.profile}/${r.tier} ${gradeText(r)}`).join('; ') + '.', '');
  const opLine = (r: ProfileRun) => `${r.profile}/${r.tier} recap ${r.opCounts.recap ?? 0}, warmup ${r.opCounts.warmup ?? 0}, recombine ${r.opCounts.recombine ?? 0}`;
  L.push('Events by op: ' + runs.map(opLine).join('; ') + '. Recap blocks: ' + runs.map((r) => `${r.profile} ${r.recap.blocks} run (${r.recap.lapsed} lapsed, ${r.recap.fresh} new re-asked), ${r.recap.skipped} empty`).join('; ') + '. Time cap: ' + runs.map((r) => `${r.profile} ${r.timeCap.sessionsTruncated} sessions cut (${r.timeCap.blocksSkipped} blocks or runs)`).join('; ') + '.', '');
  if (placed.length) {
    L.push('## Placement backlog', '');
    L.push('A learner placed at the start of a unit through the app\'s `applyPlacement` (skipped units seeded as Review-state cards whose stability grows with each unit of distance, due dates spread over a window sized to the warm-up budget), no session on day 0, a session on day 1 (never skipped), then 30 days of the profile\'s normal attendance. `day-1 due min` = due-review minutes the compiler costs on the day after placement, against the warm-up budget (the throttle threshold); `within budget from day` = the first day after which every session fit the budget.', '');
    L.push(md(PLACE_HEAD, placed.map(placementCells)), '');
  }
  L.push('## Repeats, reviews and supply per run', '');
  L.push('`UNINTENDED REPEATS` must be 0 (stories, scenes, tasks, items, sentences re-shown without a label). `item rep.60d %` = non-deliberate exercise items repeated within 60 days (must be < 2%). `reused ctx` = review contexts re-served after ≥ 120 days (deliberate, `review-context-120d`). `multi %` = warm-up items reviewing 2-3 due nodes in one sentence.', '');
  L.push(md(RUN_HEAD, runs.map(runCells)), '');
  L.push('## Sentences consumed per node (fresh), worst run', '');
  L.push(md(['kind', 'mean', 'p95', 'max', `quota (${quotas.factor} × p95)`], Object.entries(quotas.perNode).map(([k, v]) => [k, String(v.meanDemand), String(v.p95Demand), String(v.maxDemand), String(v.quota)])), '');
  L.push('## Quota totals', '');
  const t = quotas.totals;
  L.push(md(['band', 'units', 'bank sentences', 'of which review ctx', 'chapters', 'scenes', 'writing tasks'], [
    ...Object.entries(t.byBand).map(([b, x]) => [b, String(x.units), String(x.bankSentences), String(x.reviewSentences), String(x.chapters), String(x.scenes), String(x.writingTasks)]),
    ['**all**', String(Object.values(t.byBand).reduce((a, x) => a + x.units, 0)), `**${t.bankSentences}**`, String(t.reviewSentences), String(t.chapters), String(t.scenes), String(t.writingTasks)],
  ]), '');
  L.push(`## Quotas per unit (${quotas.factor} × p95 demand across ${runs.length} runs; * = extrapolated)`, '');
  L.push(md(QUOTA_HEAD, quotaRows(quotas)), '');
  return L.join('\n');
}

function gradeText(r: ProfileRun): string { const g = r.gradeCounts; return `${g.again}/${g.hard}/${g.good}/${g.easy}`; }

function maxDemand(ds: Demand[]): Demand {
  return ds.reduce((a, d) => ({
    sentences: Math.max(a.sentences, d.sentences), reviewSentences: Math.max(a.reviewSentences, d.reviewSentences),
    chapters: Math.max(a.chapters, d.chapters), scenes: Math.max(a.scenes, d.scenes), tasks: Math.max(a.tasks, d.tasks),
  }), zero());
}
const zero = zeroDemand;

const A1_TARGET: Record<string, number> = { average: 140, fast: 112 };

function targets(runs: ProfileRun[], units: Unit[]): { rows: string[][]; decomp: string[][]; pathDays: number } {
  const pathDays = units.filter((u) => u.band === 'A1').reduce((a, u) => a + u.days.length, 0);
  const rows: string[][] = [];
  const decomp: string[][] = [];
  for (const r of runs) {
    const a1 = r.bandFinish.A1;
    const tgt = A1_TARGET[r.profile];
    const b2 = r.sessions.filter((s) => s.band === 'B2');
    const b2t = pct(b2.filter((s) => s.converted === 'throttle').length, b2.length);
    rows.push([r.profile, r.tier, fmt(a1 === undefined ? undefined : a1 + 1),
      tgt === undefined ? '-' : a1 === undefined ? '✗ not reached' : a1 + 1 <= tgt ? `✓ ≤ ${tgt}` : `✗ > ${tgt}`,
      b2.length ? b2t.toFixed(1) : '-', b2.length ? (b2t < 25 ? '✓' : '✗') : '-']);
    if (a1 === undefined) continue;
    const ss = r.sessions.filter((s) => s.day <= a1);
    const cal = a1 + 1;
    const adv = ss.filter((s) => s.advanced).length;
    const thr = ss.filter((s) => s.converted === 'throttle').length;
    const perDay = (adv + thr) / cal;
    decomp.push([r.profile, r.tier, String(cal), String(new Set(ss.map((s) => s.day)).size), String(ss.length),
      String(ss.filter((s) => s.mode === 'another').length), String(ss.filter((s) => s.type === 'minimum').length), String(thr),
      String(ss.filter((s) => s.converted && s.converted !== 'throttle').length),
      (adv / cal).toFixed(2), String(Math.round(pathDays / perDay)),
      tgt === undefined ? '-' : String(Math.floor(tgt * adv / cal))]);
  }
  return { rows, decomp, pathDays };
}
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
