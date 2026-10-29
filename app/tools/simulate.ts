// npm run simulate [-- --days 365 --profiles fast,average,forgetful,irregular --tiers standard,extended --synthetic --supply 1 --seed 1 --units N --warmup-scale X --json out.json --no-write]
//
// Walks synthetic learners through compileSession + Learner over the real
// content (or a synthetic corpus with --synthetic, automatic when there are no
// units yet), prints the per-band report, and writes recommended per-unit
// quotas (3 × p95 demand across all runs) to content/_reports/quotas.json and
// the markdown summary to content/_reports/sim-summary.md (--no-write: neither).
//
// With --synthetic and a real unit map present, the real units and graph are
// used and only the content is synthesised (that is how quotas are computed
// before the burn). Exit code 1 if any unintended repeat occurred.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { budget, buildContentIndex, buildCourse } from '../src/compiler';
import type { Tier } from '../src/learner';
import { loadContent } from './sim/load';
import { profileList } from './sim/profiles';
import { computeQuotas, formatMarkdown, formatReport } from './sim/report';
import { simulateProfile } from './sim/run';
import { syntheticCorpus } from './sim/synthetic';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i < 0) return def;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? 'true' : v;
}

function main() {
  const days = Number(arg('days', '365'));
  const profiles = profileList((arg('profiles', 'fast,average,forgetful,irregular') ?? '').split(',').filter(Boolean));
  const tiers = (arg('tiers') ?? arg('tier', 'standard') ?? 'standard').split(',').filter(Boolean) as Tier[];
  const tier = tiers.join('+');
  const seed = Number(arg('seed', '1'));
  const supply = Number(arg('supply', '1'));
  const maxUnits = arg('units') ? Number(arg('units')) : undefined;
  let synthetic = arg('synthetic') === 'true';
  // tuning knob (simulator only): scale every band's warm-up review budget
  const warmup = arg('warmup-scale');
  if (warmup) for (const b of Object.keys(budget.BAND_WARMUP_MINUTES) as (keyof typeof budget.BAND_WARMUP_MINUTES)[]) budget.BAND_WARMUP_MINUTES[b] *= Number(warmup);
  const contentDir = join(APP, 'content');

  const real = loadContent(contentDir);
  if (real.problems.length) console.error(`content: ${real.problems.length} record(s) skipped, e.g. ${real.problems.slice(0, 3).join(' | ')}`);
  if (!synthetic && real.units.length === 0) {
    console.error('no units in content/units: using the synthetic corpus (--synthetic)');
    synthetic = true;
  }
  const corpus = synthetic
    ? syntheticCorpus({ seed, supply, maxUnits, ...(real.units.length && real.nodes.length ? { units: real.units, nodes: real.nodes } : {}) })
    : { units: real.units, nodes: real.nodes, source: real.source };
  if ('injectedLexemes' in corpus && corpus.injectedLexemes) console.error(`unit map lists no lexemes: injected ${corpus.injectedLexemes} synthetic lexemes at BLUEPRINT weekly budgets`);
  const course = buildCourse(corpus.units, corpus.nodes);
  const content = buildContentIndex(corpus.source, course);
  console.error(`course: ${course.units.length} units, ${course.nodes.size} nodes; content: ${content.sentences.size} sentences, ${content.chapters.length} chapters, ${content.scenes.size} scenes, ${content.tasks.size} tasks`);

  const runs = tiers.flatMap((tr) => profiles.map((p) => {
    const t0 = Date.now();
    const r = simulateProfile(p, { days, tier: tr, course, content, seed });
    console.error(`  ${p.name}/${tr}: ${r.sessions.length} sessions in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    return r;
  }));
  const quotas = computeQuotas(runs, course.units, {
    source: synthetic ? 'synthetic' : 'real', days, tier, profiles: profiles.map((p) => p.name),
    reviewContextReuseDays: budget.REVIEW_REUSE_DAYS,
  });
  console.log(formatReport(runs, quotas));

  if (arg('no-write') !== 'true') {
    const out = join(contentDir, '_reports', 'quotas.json');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(quotas, null, 2) + '\n');
    const md = join(contentDir, '_reports', 'sim-summary.md');
    const corpusLine = synthetic
      ? `synthetic content on ${real.units.length ? 'the real unit map and graph' : 'a synthetic course'}${'injectedLexemes' in corpus && corpus.injectedLexemes ? ` (+${corpus.injectedLexemes} synthetic lexemes: the unit map lists none yet)` : ''}`
      : 'the real content tree';
    writeFileSync(md, formatMarkdown(runs, quotas, summaryNotes({ days, tiers, seed, supply, synthetic, corpusLine, course: `${course.units.length} units, ${course.nodes.size} nodes, ${content.sentences.size} sentences` }), course.units) + '\n');
    console.error(`\nquotas → ${out}\nsummary → ${md}`);
  }
  const json = arg('json');
  if (json) writeFileSync(json, JSON.stringify({ quotas, runs: runs.map((r) => ({ ...r, sessions: undefined })) }, null, 2));

  const unintended = runs.reduce((a, r) => a + Object.values(r.unintendedRepeats).reduce((x, y) => x + y, 0), 0);
  if (unintended > 0) { console.error(`FAIL: ${unintended} unintended repeat(s)`); process.exitCode = 1; }
}

function summaryNotes(o: { days: number; tiers: Tier[]; seed: number; supply: number; synthetic: boolean; corpusLine: string; course: string }): string {
  const b = budget;
  const bands = Object.keys(b.SESSION_MINUTES) as (keyof typeof b.SESSION_MINUTES)[];
  return [
    '# Fluidez 2 — simulator summary',
    '',
    `Generated ${new Date().toISOString()} by \`npm run simulate --${o.synthetic ? ' --synthetic' : ''}${o.supply !== 1 ? ` --supply ${o.supply}` : ''} --days ${o.days} --tiers ${o.tiers.join(',')}\` (seed ${o.seed}).`,
    `Corpus: ${o.corpusLine}; ${o.course}.`,
    '',
    '## Budgets in force (src/compiler/budget.ts)',
    '',
    `| band | ${bands.join(' | ')} |`, `|---|${bands.map(() => '---').join('|')}|`,
    `| standard session min | ${bands.map((x) => b.SESSION_MINUTES[x]).join(' | ')} |`,
    `| warm-up budget min | ${bands.map((x) => b.BAND_WARMUP_MINUTES[x]).join(' | ')} |`,
    `| extended session min | ${bands.map((x) => b.sessionMinutes('extended', x)).join(' | ')} |`,
    '',
    `Minimum tier ${b.MINIMUM_MINUTES} min (warm-up ${b.MINIMUM_WARMUP_MINUTES}). Extended = standard + ${b.EXTENDED_EXTRA_MINUTES} core minutes (over-budget reviews first, then ≤ ${b.EXTRA_READING_MAX} extra-reading sentences; no extra grammar). Throttle: due minutes > warm-up (+${b.EXTENDED_EXTRA_MINUTES} on extended); severe > ${b.SEVERE_FACTOR}×.`,
    `Multi-item reviews: ≤ ${b.MULTI_REVIEW_MAX} due nodes per sentence, cost ${b.MULTI_REVIEW_COST}× a single review. Review-context reuse after ≥ ${b.REVIEW_REUSE_DAYS} days (\`${b.REVIEW_REUSE_REASON}\`). Production cards: grammar/pattern/chunk/contrast, lexemes with freqRank ≤ 3000 (no rank: A1–B1 productive, B2–C1 receptive-only). Learned nodes: productive card up to 365 d, receptive card suspended.`,
    '',
    '## Tuning log',
    '',
    ...b.TUNING_LOG.map((x) => `- ${x}`),
  ].join('\n');
}

main();
