// prepare(): the async step before compile, so the pure compiler is handed what a session needs and
// not whatever the tab happened to have loaded (audit P5, P7, C4). These run on the real boot window,
// not the whole corpus: the window is 2 units before the learner and 3 after, which is exactly what
// a fresh open has.
import { describe, expect, it } from 'vitest';
import { initialPath } from '../../src/compiler';
import { IdbStore, Learner } from '../../src/learner';
import { boot } from '../../src/ui/app';
import { CONTENT_FILES, ContentLoader } from '../../src/ui/data/loader';
import { prepare, prepareFor } from '../../src/ui/data/prepare';
import { applyPlacement } from '../../src/ui/session/placement';
import { compilePlan } from '../../src/ui/session/runner';
import { MemoryKV, PATH_KEY, UI_KEY, emptyUi } from '../../src/ui/store/ui';

const AT = Date.UTC(2026, 9, 1, 18);
const DAY = 86_400_000;

/** The documents a learner placed at unit index `unit` leaves behind, as the onboarding writes them. */
async function placed(unit: number, day = 0) {
  const kv = new MemoryKV();
  const learner = await Learner.open(new IdbStore(kv), { now: () => AT });
  const seed = await new ContentLoader().load({ unit });
  const path = applyPlacement(learner, seed, unit, AT);
  learner.startSession(AT);
  await learner.flush();
  await kv.set(UI_KEY, { ...emptyUi('learner-1'), onboarded: true, placedAt: unit });
  await kv.set(PATH_KEY, { ...path, day });
  return kv;
}

const readOf = (plan: ReturnType<typeof compilePlan>) => plan.blocks.flatMap((b) => (b.kind === 'read' ? [b.chapter] : []));

describe('a placed learner opening the app fresh', () => {
  it('meets the chapter at their level, not the first chapter of the story', async () => {
    const kv = await placed(44);
    const w = await boot({ kv, loader: new ContentLoader(), now: () => AT + DAY, fixtures: false });
    expect(w.ui.state.placedAt).toBe(44);
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.unit).toBe('u45');
    expect(readOf(plan)).toEqual(['ch140']);
  }, 120_000);
});

describe('prepare', () => {
  it('brings the next unread chapters even when the window does not hold them', async () => {
    // at unit index 29 the window is u28 to u33; a learner who has read the story as far as ch009 is owed ch010
    const loader = new ContentLoader();
    const bundle = await loader.load({ unit: 29 });
    const learner = Learner.fresh({ now: () => AT });
    for (let n = 1; n <= 9; n++) learner.ledger.markSeen('chapter', `ch${String(n).padStart(3, '0')}`, { at: AT });
    expect(bundle.chapters.has('ch010')).toBe(false);
    await prepare(bundle, learner, { ...initialPath(), unit: 29 });
    for (const id of ['ch010', 'ch011', 'ch012', 'ch013']) expect(bundle.chapters.has(id), id).toBe(true);
    // the window's own chapters are there, and the library still lists the whole story
    expect(bundle.chapters.has('ch086')).toBe(true);
    expect(bundle.library).toHaveLength(219);
    // no more than a few ahead, and nothing the learner has read
    expect(bundle.chapters.has('ch014')).toBe(false);
    expect(bundle.chapters.has('ch005')).toBe(false);
  }, 120_000);

  it('starts from the learner\'s own unit when they were placed, not from the story\'s first chapter', async () => {
    const bundle = await new ContentLoader().load({ unit: 0 });
    const learner = Learner.fresh({ now: () => AT });
    await prepare(bundle, learner, { ...initialPath(), unit: 44 }, { placedAt: 44 });
    expect(bundle.chapters.has('ch140')).toBe(true);
    expect(bundle.chapters.has('ch001')).toBe(true); // u01 is in a window at 0, and stays: prepare adds
    const first = await new ContentLoader().load({ unit: 44 });
    await prepare(first, learner, { ...initialPath(), unit: 44 }, { placedAt: 44 });
    expect(first.chapters.has('ch001')).toBe(false);
    expect(first.chapters.has('ch140')).toBe(true);
  }, 120_000);

  it('brings the script of a due node that has no pair to ask about, whatever the window', async () => {
    const bundle = await new ContentLoader().load({ unit: 29 });
    const learner = Learner.fresh({ now: () => AT });
    // an A2 grammar point whose forms give nothing to ask: once its sentences are used, its script is all its review has
    const node = 'g:written-register-a2';
    expect(bundle.segments(node)).toEqual([]);
    learner.seedKnown(node, { at: AT - 90 * DAY, productive: true, receptive: { stability: 5, dueAt: AT - DAY }, productiveCard: { stability: 5, dueAt: AT - DAY } });
    expect(bundle.scripts.has(node)).toBe(false);
    await prepare(bundle, learner, { ...initialPath(), unit: 29 });
    expect(bundle.scripts.has(node)).toBe(true);
  }, 120_000);

  it('does nothing the second time, and says whether it brought anything', async () => {
    const bundle = await new ContentLoader().load({ unit: 29 });
    const learner = Learner.fresh({ now: () => AT });
    expect(await prepare(bundle, learner, { ...initialPath(), unit: 29 })).toBe(true);
    expect(await prepare(bundle, learner, { ...initialPath(), unit: 29 })).toBe(false);
  }, 120_000);

  it('leaves a sample course alone', async () => {
    const { fixtureBundle } = await import('../../src/ui/data/loader');
    const bundle = await fixtureBundle();
    expect(await prepare(bundle, Learner.fresh({ now: () => AT }), initialPath())).toBe(false);
  });
});

describe('grammar owed from outside the window', () => {
  // u30's grammar, owed to a learner at u22: its script is outside the window, and nothing is wrong with the network
  const owed = 'g:subj-emotion';
  async function learnerOwing() {
    const kv = await placed(21);
    const path = (await kv.get(PATH_KEY)) as Record<string, unknown>;
    await kv.set(PATH_KEY, { ...path, owedGrammar: [owed] });
    return kv;
  }

  it('is taught from its script: the script is fetched before the compiler runs', async () => {
    const kv = await learnerOwing();
    const w = await boot({ kv, loader: new ContentLoader(), now: () => AT + DAY, fixtures: false });
    expect(w.bundle.scripts.has(owed)).toBe(true);
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.blocks.find((b) => b.kind === 'teach')).toMatchObject({ node: owed, script: true });
  }, 120_000);

  it('waits when this device cannot get that script, instead of teaching it with nothing', async () => {
    const kv = await learnerOwing();
    const file = `/content/scripts/${owed.replace(':', '_')}.json`;
    const scripts = { ...CONTENT_FILES.scripts, [file]: async () => { throw new Error('net::ERR_FAILED'); } };
    const w = await boot({ kv, loader: new ContentLoader({ ...CONTENT_FILES, scripts }), now: () => AT + DAY, fixtures: false });
    const plan = compilePlan(w.learner, w.bundle, w.ui, { now: AT + DAY });
    expect(plan.converted?.reason).toBe('offline');
    expect(plan.advancesPath).toBe(false);
    expect(plan.blocks.some((b) => b.kind === 'teach')).toBe(false);
  }, 120_000);
});

describe('prepare is part of the app', () => {
  it('boot hands the first compile the chapters the learner has not read, wherever they are in the story', async () => {
    const kv = await placed(29);
    const seen = await Learner.open(new IdbStore(kv), { now: () => AT });
    // a learner at week 30 who read the story to ch009 and has been skipping since: their next chapter is far behind the window
    for (let n = 1; n <= 9; n++) seen.ledger.markSeen('chapter', `ch${String(n).padStart(3, '0')}`, { at: AT });
    await seen.flush();
    const ui = (await kv.get(UI_KEY)) as Record<string, unknown>;
    await kv.set(UI_KEY, { ...ui, placedAt: undefined });
    const w = await boot({ kv, loader: new ContentLoader(), now: () => AT + DAY, fixtures: false });
    expect(w.bundle.chapters.has('ch010')).toBe(true);
    expect(w.bundle.chapters.size).toBeLessThan(40);
  }, 120_000);

  it('follows the learner when the path moves on: the next window and the next chapters come with it', async () => {
    const kv = await placed(10);
    const w = await boot({ kv, loader: new ContentLoader(), now: () => AT + DAY, fixtures: false });
    const units = () => new Set([...w.bundle.sentences.values()].map((x) => x.unit));
    expect(units().has('u11')).toBe(true);
    expect(units().has('u20')).toBe(false);
    await w.ui.setPath({ ...w.ui.path, unit: 19 });
    expect(await prepareFor(w)).toBe(true);
    expect(units().has('u20')).toBe(true);
  }, 120_000);
});
