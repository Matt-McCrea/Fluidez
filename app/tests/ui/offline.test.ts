// Audit F17, P5. A learner who cached u16 to u21 and opens the app offline with the path at u22: the
// files for u22 onward fail to arrive, and the app used to teach u22 d0 with no script, mark it done and
// move on, with `net::ERR_FAILED` in the console as the only trace. Now the day waits, the app says why
// in plain words, and it tries again. Run on the real boot window (2 units before the learner, 3 after),
// with the network cut file by file the way a half-filled cache leaves it, not on the whole corpus.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { advancePath } from '../../src/compiler';
import { IdbStore, Learner } from '../../src/learner';
import { boot } from '../../src/ui/app';
import { CONTENT_FILES, ContentLoader, type ContentFiles, type FileMap } from '../../src/ui/data/loader';
import { prepareFor } from '../../src/ui/data/prepare';
import { OFFLINE_LINE, RELOAD_BUTTON, RELOAD_LINE, offlineLine, reloadLine } from '../../src/ui/screens/home';
import { applyPlacement } from '../../src/ui/session/placement';
import { sessionLabel } from '../../src/ui/session/labels';
import { compilePlan } from '../../src/ui/session/runner';
import { MemoryKV, PATH_KEY, UI_KEY, emptyUi } from '../../src/ui/store/ui';

const AT = Date.UTC(2026, 9, 1, 18);
const DAY = 86_400_000;
const UNITS = join(__dirname, '../../content/units');

/** What a learner who used the app through u16 to u21 has on the device. */
function cachedBy(first: number, last: number): (kind: string, path: string) => boolean {
  const names = new Set<string>();
  for (let n = first; n <= last; n++) {
    const u = JSON.parse(readFileSync(join(UNITS, `u${String(n).padStart(2, '0')}.json`), 'utf8')) as { days: Array<{ chapter?: string; focus: string[]; chunks: string[]; lexemes: string[] }> };
    for (const d of u.days) {
      if (d.chapter) names.add(d.chapter);
      for (const id of [...d.focus, ...d.chunks, ...d.lexemes]) names.add(id.replace(':', '_'));
    }
  }
  return (kind, path) => {
    const name = path.replace(/^.*\//, '').replace(/\.json$/, '');
    if (kind === 'story' || kind === 'scripts') return names.has(name) || name.startsWith('x_');
    const m = name.match(/\b(u\d{2})\b/);
    return !!m && Number(m[1].slice(1)) >= first && Number(m[1].slice(1)) <= last;
  };
}

/** The real files, with the network cut for whatever is not in the cache until `online` is set. */
function network(cached: (kind: string, path: string) => boolean) {
  const net = { online: false, attempts: 0 };
  const cut = (kind: string, map: FileMap): FileMap => Object.fromEntries(Object.entries(map).map(([p, load]) => [p, async () => {
    if (!net.online && !cached(kind, p)) { net.attempts++; throw new Error('net::ERR_FAILED'); }
    return load();
  }]));
  const files: ContentFiles = {
    ...CONTENT_FILES,
    bank: cut('bank', CONTENT_FILES.bank), scripts: cut('scripts', CONTENT_FILES.scripts), story: cut('story', CONTENT_FILES.story),
    scenes: cut('scenes', CONTENT_FILES.scenes), writing: cut('writing', CONTENT_FILES.writing),
  };
  return { net, files };
}

/** A learner placed at unit index `unit`, as onboarding leaves one (the seed is read with the network on). */
async function placed(unit: number) {
  const kv = new MemoryKV();
  const learner = await Learner.open(new IdbStore(kv), { now: () => AT });
  const seed = await new ContentLoader().load({ unit });
  const path = applyPlacement(learner, seed, unit, AT);
  learner.startSession(AT);
  await learner.flush();
  await kv.set(UI_KEY, { ...emptyUi('learner-1'), onboarded: true, placedAt: unit });
  await kv.set(PATH_KEY, path);
  return kv;
}

describe('a unit file that does not arrive', () => {
  // every unit after the gap is a place off: at index 21 the course said u23, and the learner was taught it and moved on
  const lost = () => ({ ...CONTENT_FILES, units: { ...CONTENT_FILES.units, '/content/units/u10.json': async () => { throw new Error('net::ERR_FAILED'); } } });

  it('leaves the learner in the app, on review, and the path does not move on a day that is not theirs', async () => {
    const kv = await placed(21);
    const w = await boot({ kv, loader: new ContentLoader(lost()), now: () => AT + DAY, fixtures: false });
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.type).toBe('review');
    expect(plan.advancesPath).toBe(false);
    expect(plan.converted?.reason).toBe('offline');
    expect(plan.blocks.some((b) => b.kind === 'teach' || b.kind === 'learn')).toBe(false);
    expect(advancePath(w.ui.path, plan, true)).toMatchObject({ unit: 21, day: 0 });
    expect(offlineLine(plan)).toBe(OFFLINE_LINE);
  }, 180_000);

  it('holds a day that is a review day too, since that one would move the path', async () => {
    const kv = await placed(21);
    const path = (await kv.get(PATH_KEY)) as { unit: number };
    const u23 = (await CONTENT_FILES.units['/content/units/u23.json']()) as { days: Array<{ type: string }> };
    const day = u23.days.findIndex((d) => d.type === 'review');
    await kv.set(PATH_KEY, { ...path, day });
    const w = await boot({ kv, loader: new ContentLoader(lost()), now: () => AT + DAY, fixtures: false });
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.dayType).toBe('review');
    expect(plan.advancesPath).toBe(false);
  }, 180_000);
});

describe('u22 d0 with the network gone', () => {
  it('is a day of review that does not move the path, not a lesson with no script', async () => {
    const kv = await placed(21);
    const { net, files } = network(cachedBy(16, 21));
    const w = await boot({ kv, loader: new ContentLoader(files), now: () => AT + DAY, fixtures: false });
    expect(net.attempts).toBeGreaterThan(0);
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.unit).toBe('u22');
    expect(plan.day).toBe(0);
    // what it did: introduce, a teach block with no script, advances true
    expect(plan.blocks.filter((b) => b.kind === 'teach')).toEqual([]);
    expect(plan.type).toBe('review');
    expect(plan.advancesPath).toBe(false);
    expect(plan.converted).toMatchObject({ from: 'introduce', to: 'review', reason: 'offline' });
    expect(Object.values(plan.newNodes).flat()).toEqual([]);
    // finishing it leaves the learner where they were
    expect(advancePath(w.ui.path, plan, true)).toMatchObject({ unit: 21, day: 0 });
    expect(plan.blocks[0].kind).toBe('warmup');
  }, 180_000);

  it('says so in plain words, on Home and in the lesson\'s name, with no dash', async () => {
    const kv = await placed(21);
    const { files } = network(cachedBy(16, 21));
    const w = await boot({ kv, loader: new ContentLoader(files), now: () => AT + DAY, fixtures: false });
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(offlineLine(plan)).toBe(OFFLINE_LINE);
    expect(OFFLINE_LINE).toBe('The next lessons need a connection. Today is review.');
    expect(OFFLINE_LINE).not.toMatch(/[–—]|\s-\s/);
    expect(sessionLabel(plan, w.bundle)).toBe('Review for today');
  }, 180_000);

  it('asks again and teaches the day once the network is back', async () => {
    const kv = await placed(21);
    const { net, files } = network(cachedBy(16, 21));
    const loader = new ContentLoader(files);
    const w = await boot({ kv, loader, now: () => AT + DAY, fixtures: false });
    expect(compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY }).converted?.reason).toBe('offline');
    // still offline: it tries again, finds nothing, and does not pile up the same complaint
    const complaints = loader.problems.length;
    await prepareFor(w);
    expect(loader.problems.length).toBe(complaints);
    expect(compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY }).converted?.reason).toBe('offline');
    // back online
    net.online = true;
    expect(await prepareFor(w)).toBe(true);
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.type).toBe('introduce');
    expect(plan.advancesPath).toBe(true);
    expect(plan.converted).toBeUndefined();
    const teach = plan.blocks.find((b) => b.kind === 'teach');
    expect(teach && 'script' in teach && teach.script).toBe(true);
    expect(offlineLine(plan)).toBeUndefined();
    expect(sessionLabel(plan, w.bundle)).not.toBe('Review for today');
  }, 180_000);

  it('does not touch a day whose content is here', async () => {
    // the learner is still inside what they cached: u21, and the window around it is partly cut, but this day's files came
    const kv = await placed(20);
    const { files } = network(cachedBy(16, 21));
    const w = await boot({ kv, loader: new ContentLoader(files), now: () => AT + DAY, fixtures: false });
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.unit).toBe('u21');
    expect(plan.converted?.reason).not.toBe('offline');
    expect(plan.advancesPath).toBe(true);
  }, 180_000);
});

describe('a connection that is there while Home says the lessons need one', () => {
  // a module that failed to load may stay cached on Safari: the files are on the server, the browser is online, and only a fresh page asks again
  const held = { converted: { reason: 'offline' } };

  it('offers a plain reload when the browser says it is online, and only then', () => {
    expect(reloadLine(held, true)).toBe(RELOAD_LINE);
    expect(reloadLine(held, false)).toBeUndefined();
    expect(reloadLine({ converted: { reason: 'reentry' } }, true)).toBeUndefined();
    expect(reloadLine(undefined, true)).toBeUndefined();
  });

  it('says it in human words, with no dash and nothing about the learner', () => {
    expect(RELOAD_LINE).toBe("You seem to be online, so the page may not have finished loading. Reloading usually fixes it.");
    expect(RELOAD_LINE).not.toMatch(/[–—]|\s-\s/);
    expect(RELOAD_BUTTON).toBe('Reload the page');
  });
});
