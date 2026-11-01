// npm run golden -- --scenario early|session|placed --out <file.json> [--build <label>] [--sessions N] [--unit N] [--stop-after N] [--no-prev]
//
// Writes a golden learner for tests/golden: the documents a real browser holds in IndexedDB (state,
// state.prev, events, path, ui, and session when one is open), made by running the app's own boot and
// session code over the real content. Nothing is written by hand. Runs under vite-node (the content
// loader's import.meta.glob).
//
//   early    a new learner after N sessions (default 8) on consecutive days, one in four answered wrong
//   session  the same, then one more session run to the block --stop-after (default 3) and saved the way
//            the player saves it when a learner leaves, so the plan is open
//   placed   a learner placed at unit index --unit (default 14) through applyPlacement, then 2 sessions
//
// --no-prev leaves out state.prev, the one-step backup the browser keeps beside state (it doubles the size of a big learner).
//
// The clock is fixed (1 October 2026, 18:00 UTC, a day on from the last session each time), so a run
// differs from another only in the learner id. The ee6aaec fixture was made by running this file in a
// checkout of that commit (see tests/golden/README.md); it uses only what both trees have.
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { boot } from '../src/ui/app';
import { ContentLoader } from '../src/ui/data/loader';
import { applyPlacement } from '../src/ui/session/placement';
import { SessionRunner, compilePlan, truncatable } from '../src/ui/session/runner';
import { MemoryKV } from '../src/ui/store/ui';
import { runBlock, session, type Walk } from '../tests/ui/driver';

const DAY = 86_400_000;
const START = Date.UTC(2026, 9, 1, 18);

function arg(name: string, def?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? def : process.argv[i + 1];
}

/** A booted app over an empty store, the way a first visit boots it. */
async function newWorld(loader: ContentLoader) {
  const clock = { t: START };
  const now = () => clock.t;
  const kv = new MemoryKV();
  const ctx = await boot({ kv, loader, now, fixtures: false });
  await ctx.ui.update((s) => { s.onboarded = true; });
  // session() types its world with the test driver's MemoryStore; the app's IdbStore is what a browser has
  return { clock, now, kv, store: ctx.learnerStore, learner: ctx.learner, ui: ctx.ui, bundle: ctx.bundle } as unknown as Parameters<typeof session>[0];
}
type World = Awaited<ReturnType<typeof newWorld>>;

const nextDay = (w: World) => { w.clock.t = Math.floor(w.clock.t / DAY) * DAY + DAY + 18 * 3_600_000; };

/** n sessions on consecutive days, as the learner reaches them; `wrongEvery` makes every kth one a bad day. */
async function days(w: World, n: number, wrongEvery = 4) {
  for (let i = 0; i < n; i++) {
    await session(w, wrongEvery && i % wrongEvery === wrongEvery - 1 ? 'wrong' : 'right');
    await w.bundle.ensureWindow(w.ui.path.unit);
    nextDay(w);
  }
}

/** A session begun and run to the start of block `stop`, then saved as Session.persist saves it. */
async function leaveMidSession(w: World, stop: number) {
  const plan = compilePlan(w.learner, w.bundle, w.ui, { now: w.now() });
  const run = new SessionRunner(w.learner, w.bundle, w.ui, plan, w.now);
  run.start();
  const walk: Walk = { cards: [], failures: [], screens: [], advance: (ms) => { w.clock.t += ms; } };
  const cardTimed = new Set(['warmup', 'leech', 'learn', 'teach', 'structuredInput', 'controlledOutput', 'cuedProduction', 'communicative', 'remix', 'readingCheck', 'extraReading', 'timedRecall', 'recap']);
  for (let i = 0; i < Math.min(stop, plan.blocks.length); i++) {
    const b = plan.blocks[i];
    if (b.kind === 'close') break;
    if (b.kind === 'recap' && !run.openRecap(b)) continue;
    if (truncatable(b)) run.enter(b); else run.blockShown(b);
    runBlock(b, run, 'right', walk);
    if (!cardTimed.has(b.kind)) w.clock.t += b.minutes * 60_000;
  }
  const elapsedMs = run.elapsed() * 60_000;
  await w.ui.saveSession({
    version: 1, learnerId: w.ui.state.learnerId, sessionIndex: w.learner.sessionIndex, mode: 'next', tier: plan.tier,
    capMinutes: run.capMinutes, startedAt: w.now() - elapsedMs, elapsedMs, savedAt: w.now(),
    plan, block: stop, cursor: run.cursor, runner: run.snapshot(),
  });
  await w.learner.flush();
  return plan.blocks.map((b) => b.kind);
}

async function main() {
  const scenario = arg('scenario');
  const out = arg('out');
  if (!scenario || !out) throw new Error('usage: golden --scenario early|session|placed --out <file.json> [--build label] [--sessions N] [--unit N] [--stop-after N]');
  const loader = new ContentLoader();
  const w = await newWorld(loader);
  let about: string;
  let blocks: string[] | undefined;
  if (scenario === 'early') {
    const n = Number(arg('sessions', '8'));
    await days(w, n);
    about = `A new learner after ${n} sessions on consecutive days, every fourth answered wrong.`;
  } else if (scenario === 'session') {
    const n = Number(arg('sessions', '3'));
    const stop = Number(arg('stop-after', '3'));
    await days(w, n);
    blocks = await leaveMidSession(w, stop);
    about = `A new learner after ${n} sessions, then a ${n + 1}th run to block ${stop} of ${blocks.length} and left open (the plan is saved under "session").`;
  } else if (scenario === 'placed') {
    const unit = Number(arg('unit', '14'));
    w.learner.setSettings({ tier: 'standard' });
    await w.ui.setPath(applyPlacement(w.learner, w.bundle, unit, w.now()));
    await w.ui.update((s) => { s.placedAt = unit; });
    await w.learner.flush();
    await w.bundle.ensureWindow(unit);
    nextDay(w);
    await days(w, 2, 0);
    about = `A learner placed at unit index ${unit} by applyPlacement, then 2 sessions.`;
  } else throw new Error(`unknown scenario ${scenario}`);
  await w.learner.flush();

  const build = arg('build') ?? execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  const noPrev = process.argv.includes('--no-prev');
  const kv = Object.fromEntries([...w.kv.data].filter(([k]) => !(noPrev && k === 'state.prev')).sort(([a], [b]) => (a < b ? -1 : 1)));
  const doc = { about: noPrev ? `${about} Without state.prev.` : about, build, scenario, madeAt: w.clock.t, plan: blocks, kv };
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(resolve(out), JSON.stringify(doc));
  const sizes = Object.entries(kv).map(([k, v]) => `${k} ${(JSON.stringify(v).length / 1024).toFixed(0)}K`).join(', ');
  console.error(`${out}: ${(JSON.stringify(doc).length / 1024).toFixed(0)} KB (${sizes})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
