// npm run simulate [-- --days 365 --profiles fast,average,forgetful,irregular --tiers standard,extended
//   --real | --synthetic --supply 1 --seed 1 --units N --warmup-scale X --placement u10,u20 [--placement-only]
//   --json out.json --no-write]       (runs under vite-node: the real loader uses Vite's import.meta.glob)
//
//   --real       the app's own ContentLoader over app/content, bands A1 and A2 (real sentences, scripts,
//                chapters, scenes, tasks); the course is the A1 and A2 units. Does not write quotas.json.
//   --synthetic  a synthetic corpus (on the real unit map and graph when they exist).
//   (neither)    the tolerant file reader over app/content (all bands), the original behaviour.
//   --placement  also run 30 days (--placement-days) from a learner placed at that unit through the
//                app's applyPlacement, one run per profile; reports the day-1 backlog in due minutes.
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
import { loadContent, loadRealBundle } from './sim/load';
import { profileList } from './sim/profiles';
import { computeQuotas, formatMarkdown, formatReport } from './sim/report';
import { simulateProfile, type ProfileRun } from './sim/run';
import { syntheticCorpus } from './sim/synthetic';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i < 0) return def;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? 'true' : v;
}

async function main() {
  const days = Number(arg('days', '365'));
  const profiles = profileList((arg('profiles', 'fast,average,forgetful,irregular') ?? '').split(',').filter(Boolean));
  const tiers = (arg('tiers') ?? arg('tier', 'standard') ?? 'standard').split(',').filter(Boolean) as Tier[];
  const tier = tiers.join('+');
  const seed = Number(arg('seed', '1'));
  const supply = Number(arg('supply', '1'));
  const maxUnits = arg('units') ? Number(arg('units')) : undefined;
  let synthetic = arg('synthetic') === 'true';
  const useReal = arg('real') === 'true';
  const placements = (arg('placement') ?? '').split(',').filter(Boolean);
  const placementOnly = arg('placement-only') === 'true';
  const placementDays = Number(arg('placement-days', '30'));
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
  const realBundle = useReal ? await loadRealBundle(['A1', 'A2'], maxUnits) : undefined;
  if (realBundle?.problems.length) console.error(`real content: ${realBundle.problems.length} record(s) skipped, e.g. ${realBundle.problems.slice(0, 3).join(' | ')}`);
  const corpus = realBundle ? { units: realBundle.units, nodes: realBundle.nodes, source: realBundle.source } : synthetic
    ? syntheticCorpus({ seed, supply, maxUnits, ...(real.units.length && real.nodes.length ? { units: real.units, nodes: real.nodes } : {}) })
    : { units: real.units, nodes: real.nodes, source: real.source };
  if ('injectedLexemes' in corpus && corpus.injectedLexemes) console.error(`unit map lists no lexemes: injected ${corpus.injectedLexemes} synthetic lexemes at BLUEPRINT weekly budgets`);
  const course = buildCourse(corpus.units, corpus.nodes);
  const content = buildContentIndex(corpus.source, course);
  console.error(`course: ${course.units.length} units, ${course.nodes.size} nodes; content: ${content.sentences.size} sentences, ${content.chapters.length} chapters, ${content.scenes.size} scenes, ${content.tasks.size} tasks`);

  const runs = placementOnly ? [] : tiers.flatMap((tr) => profiles.map((p) => {
    const t0 = Date.now();
    const r = simulateProfile(p, { days, tier: tr, course, content, seed });
    console.error(`  ${p.name}/${tr}: ${r.sessions.length} sessions in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    return r;
  }));
  const placed: ProfileRun[] = [];
  for (const spec of placements) {
    const idx = course.units.findIndex((u) => u.id === spec);
    if (idx < 0) throw new Error(`--placement ${spec}: no such unit in the course (${course.units.map((u) => u.id).join(', ')})`);
    for (const p of profiles) {
      const r = simulateProfile(p, { days: placementDays, tier: tiers[0], course, content, seed, placement: idx });
      console.error(`  placement ${spec} ${p.name}: day-1 due ${r.placement?.day1.dueMinutes.toFixed(1)} min`);
      placed.push(r);
    }
  }
  const quotas = computeQuotas(runs, course.units, {
    source: synthetic && !useReal ? 'synthetic' : 'real', days, tier, profiles: profiles.map((p) => p.name),
    reviewContextReuseDays: budget.REVIEW_REUSE_DAYS,
  });
  console.log(formatReport(runs, quotas, placed));

  if (arg('no-write') !== 'true') {
    const out = join(contentDir, '_reports', 'quotas.json');
    mkdirSync(dirname(out), { recursive: true });
    // --real covers only the A1 and A2 units: it must not replace the course-wide quotas the burn reads
    if (!useReal && !placementOnly) writeFileSync(out, JSON.stringify(quotas, null, 2) + '\n');
    const md = join(contentDir, '_reports', 'sim-summary.md');
    const corpusLine = useReal
      ? 'the real content through the app\'s ContentLoader (`--real`: bands A1 and A2 only; sentences, scripts, chapters, scenes and writing tasks as the app loads them)'
      : synthetic
      ? `synthetic content on ${real.units.length ? 'the real unit map and graph' : 'a synthetic course'}${'injectedLexemes' in corpus && corpus.injectedLexemes ? ` (+${corpus.injectedLexemes} synthetic lexemes: the unit map lists none yet)` : ''}`
      : 'the real content tree';
    writeFileSync(md, formatMarkdown(runs, quotas, summaryNotes({ days, tiers, seed, supply, synthetic, real: useReal, placements, placementDays, corpusLine, course: `${course.units.length} units, ${course.nodes.size} nodes, ${content.sentences.size} sentences` }), course.units, placed).replace(/ \u2014 /g, ': ').replace(/[\u2014\u2013]/g, '-') + '\n');
    console.error(`\nquotas → ${useReal || placementOnly ? '(not written)' : out}\nsummary → ${md}`);
  }
  const json = arg('json');
  if (json) writeFileSync(json, JSON.stringify({ quotas, runs: [...runs, ...placed].map((r) => ({ ...r, sessions: undefined })) }, null, 2));

  const unintended = runs.reduce((a, r) => a + Object.values(r.unintendedRepeats).reduce((x, y) => x + y, 0), 0);
  if (unintended > 0) { console.error(`FAIL: ${unintended} unintended repeat(s)`); process.exitCode = 1; }
}

function summaryNotes(o: { days: number; tiers: Tier[]; seed: number; supply: number; synthetic: boolean; real: boolean; placements: string[]; placementDays: number; corpusLine: string; course: string }): string {
  const b = budget;
  const bands = Object.keys(b.SESSION_MINUTES) as (keyof typeof b.SESSION_MINUTES)[];
  return [
    '# Fluidez 2: simulator summary',
    '',
    `Generated ${new Date().toISOString()} by \`npm run simulate --${o.real ? ' --real' : o.synthetic ? ' --synthetic' : ''}${o.supply !== 1 ? ` --supply ${o.supply}` : ''} --days ${o.days} --tiers ${o.tiers.join(',')}${o.placements.length ? ` --placement ${o.placements.join(',')}` : ''}\` (seed ${o.seed}).`,
    'Modes: `--real` runs the app\'s own `ContentLoader` over the real A1 and A2 content (real sentences, scripts, chapters; no quotas.json write); `--synthetic` generates a corpus on the real unit map and graph; `--placement uNN` adds 30-day runs of a learner placed at that unit through the app\'s `applyPlacement`.',
    'Model: grades follow the runner (`gradeOf`: first-try pass Good, retry pass Hard, miss Again; never Easy). A failed first draw is retried at P + (1 - P) x retryGain. Multi-target warm-up items are answered once, graded uniformly, and passed through `attributeGrades` (no card evidence in the simulator, so uniform). The recap block uses the runner\'s capacity rule and `planRecap`; lapsed re-asks are real reviews (op `recap`), new items exposure. Each choose/type/transform/recombine outcome steps the ladder (`stepRung`). Optional blocks are skipped and card runs cut when the plan\'s minutes are spent. Not modelled: "I don\'t know" (a miss either way), and the attribution evidence.',
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
    `Multi-item reviews: ≤ ${b.MULTI_REVIEW_MAX} due nodes per sentence, cost ${b.MULTI_REVIEW_COST}× a single review. Review-context reuse after ≥ ${b.REVIEW_REUSE_DAYS} days (\`${b.REVIEW_REUSE_REASON}\`). Production cards: grammar/pattern/chunk/contrast, lexemes with freqRank ≤ 3000 (no rank: A1-B1 productive, B2-C1 receptive-only). Learned nodes: productive card up to 365 d, receptive card suspended.`,
    '',
    '## Tuning log',
    '',
    ...b.TUNING_LOG.map((x) => `- ${x}`),
  ].join('\n');
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
