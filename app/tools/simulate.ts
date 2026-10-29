// npm run simulate [-- --days 365 --profiles fast,average,forgetful,irregular --tier standard --synthetic --supply 1 --seed 1 --units N --warmup MIN --json out.json]
//
// Walks synthetic learners through compileSession + Learner over the real
// content (or a synthetic corpus with --synthetic, automatic when there are no
// units yet), prints the per-band report, and writes recommended per-unit
// quotas (3 × max demand) to content/_reports/quotas.json.
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
import { computeQuotas, formatReport } from './sim/report';
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
  const tier = (arg('tier', 'standard') ?? 'standard') as Tier;
  const seed = Number(arg('seed', '1'));
  const supply = Number(arg('supply', '1'));
  const maxUnits = arg('units') ? Number(arg('units')) : undefined;
  let synthetic = arg('synthetic') === 'true';
  // tuning knob (simulator only): the warm-up review budget in minutes for the chosen tier
  const warmup = arg('warmup');
  if (warmup) (budget.WARMUP_MINUTES as Record<Tier, number>)[tier] = Number(warmup);
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

  const runs = profiles.map((p) => {
    const t0 = Date.now();
    const r = simulateProfile(p, { days, tier, course, content, seed });
    console.error(`  ${p.name}: ${r.sessions.length} sessions in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    return r;
  });
  const quotas = computeQuotas(runs, course.units, {
    source: synthetic ? 'synthetic' : 'real', days, tier, profiles: profiles.map((p) => p.name),
  });
  console.log(formatReport(runs, quotas));

  const out = join(contentDir, '_reports', 'quotas.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(quotas, null, 2) + '\n');
  console.error(`\nquotas → ${out}`);
  const json = arg('json');
  if (json) writeFileSync(json, JSON.stringify({ quotas, runs: runs.map((r) => ({ ...r, sessions: undefined })) }, null, 2));

  const unintended = runs.reduce((a, r) => a + Object.values(r.unintendedRepeats).reduce((x, y) => x + y, 0), 0);
  if (unintended > 0) { console.error(`FAIL: ${unintended} unintended repeat(s)`); process.exitCode = 1; }
}

main();
