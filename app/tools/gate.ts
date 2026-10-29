/* ============================================================================
 * THE CONTENT GATE —  npm run gate -- [--fix] [--strict] [--quiet] [paths...]
 *
 * No paths: every file under content/ (except _queue). With paths: those
 * files (or directories) are gated, but corpus-wide checks (near-duplicates,
 * legality context, supply) still read ALL of content/ — a new bank file is
 * compared against every sentence already written.
 *
 * Exit 0 = pass, 1 = errors, 2 = usage. Findings go to stdout, one line each:
 *   ERROR [check] content/bank/u03.json:[12].es → problem → fix: hint
 * concise enough to hand straight back to the generator that wrote the file
 * (the /burn runner does exactly that on a retry).
 *
 * Checks, in order:
 *   schema     zod per directory (graph, units, bank, scripts, story, scenes,
 *              writing), id/file agreement, answer indices, scene links,
 *              writing models meet their own word counts and constraints
 *   accent     accent/spelling lint against the engine's paradigms (+ ¿ ¡)
 *   dialect    vosotros/voseo forms and pronouns, Peninsular lexicon,
 *              perfecto for same-day narration (warning)
 *   verbs      every conjugated-looking word is analysable by the engine
 *   legality   tagger.requires ⊆ nodes taught by this unit/day (what a taught
 *              chunk or pattern covers is exempt); story chapters leave words to
 *              the reading check; gloss entries are not gated; a pattern before
 *              its day warns; skipped until content/units exists
 *   reading    story chapters: ≤2% unknown unglossed lexemes, ≤5% with gloss
 *              (words inside a taught chunk or pattern are known)
 *   dupe       exact and near-duplicates (token 4-gram Jaccard) corpus-wide
 *   frames     template-frame overuse per unit (warning; error with --strict)
 *   typeable   every answer/accept has a form a learner can type
 *   dashes     no em/en dash or spaced hyphen in any learner-facing string; graph
 *              node es/en/forms never pack variants with " / ", and es/en == forms[0]
 *   requires   bank requires, and chapter/scene/writing requires (+ chapter lexemes),
 *              == tagger output (--fix writes them); targets ⊆ requires (patterns,
 *              contrasts and undetectable nodes only warn)
 *   supply     per-unit counts vs Unit.quota (warning until the band is listed
 *              in content/units/_complete.json; error with --strict)
 *   tagger     low-confidence bank sentences (warning; error with --strict)
 * ========================================================================== */
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkBank, checkComputed, checkDashes, checkStrings, checkStructure, readingCoverage, type RunState } from './gate/checks';
import { collectItems, frameOveruse, nearDuplicates, supply } from './gate/corpus';
import { render, type Finding } from './gate/findings';
import { buildCurriculum, listJson, loadFile, resolveTargets, type Loaded } from './gate/load';
export { castNames } from './gate/load';
import type { BankSentence, StoryChapter, Scene, WritingTask } from '../src/content/schema';

export const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export interface GateOptions {
  appDir?: string;
  contentDir?: string;
  paths?: string[];
  fix?: boolean;
  strict?: boolean;
}
export interface GateResult {
  findings: Finding[];
  errors: number;
  warnings: number;
  files: number;
  fixed: string[];
  supply: string[];
  ms: number;
}

export function runGate(o: GateOptions = {}): GateResult {
  const t0 = Date.now();
  const appDir = o.appDir ?? APP_DIR;
  const contentDir = o.contentDir ?? join(appDir, 'content');
  const findings: Finding[] = [];
  const all = listJson(contentDir);
  const targetPaths = resolveTargets(o.paths ?? [], appDir, contentDir);
  const targetSet = new Set(targetPaths);
  for (const p of targetPaths) if (!existsSync(p)) findings.push({ severity: 'error', check: 'schema', file: relative(appDir, p), problem: 'file does not exist', fix: 'write the declared output' });

  // Load everything once; schema findings are reported for targets only.
  const loaded: Loaded[] = [];
  for (const p of new Set([...all, ...targetPaths.filter(existsSync)])) loaded.push(loadFile(p, appDir, targetSet.has(p) ? findings : null));
  const brokenOthers = loaded.filter((f) => !f.ok && !targetSet.has(f.abs) && f.kind !== 'vocab').length;
  if (brokenOthers) findings.push({ severity: 'warning', check: 'schema', file: '', problem: `${brokenOthers} other content file(s) fail their schema and were left out of corpus checks`, fix: 'run npm run gate with no paths to see them' });

  const cur = buildCurriculum(loaded, contentDir, findings);
  const st: RunState = { cur, findings, strict: !!o.strict, unmapped: new Map(), missingLex: new Map(), noticed: new Set() };
  if (!cur.units.length) findings.push({ severity: 'warning', check: 'legality', file: '', problem: 'no content/units yet: legality (requires ⊆ taught) not checked' });

  const targets = loaded.filter((f) => targetSet.has(f.abs));
  const fixed: string[] = [];
  const touchedUnits = new Set<string>();
  for (const f of targets) {
    if (!f.ok) continue;
    checkStructure(st, f);
    checkStrings(st, f);
    checkDashes(st, f);
    if (f.kind === 'bank') {
      const rewrite = checkBank(st, f, !!o.fix);
      if (rewrite) { writeFileSync(f.abs, JSON.stringify(rewrite, null, 2) + '\n'); fixed.push(f.rel); }
      (f.data as BankSentence[]).forEach((b) => b.unit && touchedUnits.add(b.unit));
    }
    if (f.kind === 'story' || f.kind === 'scene' || f.kind === 'writing') {
      const rewrite = checkComputed(st, f, !!o.fix);
      if (rewrite) { writeFileSync(f.abs, JSON.stringify(rewrite, null, 2) + '\n'); fixed.push(f.rel); }
    }
    if (f.kind === 'story') { readingCoverage(st, f); touchedUnits.add((f.data as StoryChapter).unit); }
    if (f.kind === 'scene') touchedUnits.add((f.data as Scene).unit);
    if (f.kind === 'writing') (f.data as WritingTask[]).forEach((w) => touchedUnits.add(w.unit));
    if (f.kind === 'unit') touchedUnits.add((f.data as { id: string }).id);
  }

  // corpus-wide
  const items = collectItems(loaded);
  nearDuplicates(items, new Set(targets.map((f) => f.rel)), findings);
  frameOveruse(items, touchedUnits, findings, !!o.strict);
  const whole = !(o.paths ?? []).length;
  const sup = supply(loaded, cur.units, whole ? null : touchedUnits, findings, !!o.strict, cur.completeBands);

  if (st.unmapped.size) {
    const list = [...st.unmapped.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join(', ');
    findings.push({ severity: 'warning', check: 'legality', file: '', problem: `tagger nodes not in the graph (not gated): ${list}`, fix: 'add these nodes, or map their feature keys in content/graph/_featuremap.json' });
  }
  if (st.missingLex.size) {
    findings.push({ severity: 'warning', check: 'legality', file: '', problem: `${st.missingLex.size} lexeme(s) used but not in the graph, e.g. ${[...st.missingLex.keys()].slice(0, 15).join(', ')}` });
  }
  const errors = findings.filter((f) => f.severity === 'error').length;
  return { findings, errors, warnings: findings.length - errors, files: targets.length, fixed, supply: sup, ms: Date.now() - t0 };
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('usage: npm run gate -- [--fix] [--strict] [--quiet] [--supply] [paths...]');
    process.exit(0);
  }
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const paths = args.filter((a) => !a.startsWith('--'));
  // FLUIDEZ_APP_DIR points the gate at another app tree (tests use a fixture)
  const r = runGate({ appDir: process.env.FLUIDEZ_APP_DIR || undefined, paths, fix: flags.has('--fix'), strict: flags.has('--strict') });
  const lines = render(r.findings, flags.has('--quiet') ? 15 : 40);
  for (const l of lines) {
    if (flags.has('--quiet') && l.startsWith('warn')) continue;
    console.log(l);
  }
  if (flags.has('--supply') || !paths.length) for (const s of r.supply) console.log('supply ' + s);
  for (const f of r.fixed) console.log(`fixed requires in ${f}`);
  console.log(`gate: ${r.errors ? 'FAIL' : 'PASS'} — ${r.errors} error(s), ${r.warnings} warning(s) in ${r.files} file(s) (${(r.ms / 1000).toFixed(1)}s)`);
  process.exit(r.errors ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
