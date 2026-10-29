// Content loading, placement, scene turns, cards and the UI store.
import { describe, expect, it } from 'vitest';
import { ContentLoader, fileBand, loadBundle, records, type ContentFiles } from '../../src/ui/data/loader';
import { applyPlacement, contentProbe, placeFrom, type ProbeItem } from '../../src/ui/session/placement';
import { checkTurn } from '../../src/ui/session/scene';
import { chunkCheck, respondCheck, sentenceCheck } from '../../src/ui/session/cards';
import { MemoryKV, UiStore, UI_KEY, streak } from '../../src/ui/store/ui';
import { looksSpanish } from '../../src/ui/data/bundle';
import { fixtureContent } from '../../src/ui/fixtures';
import { fixtureBundle, world } from './driver';

const files = (over: Partial<ContentFiles> = {}): ContentFiles => {
  const f = fixtureContent();
  const one = (v: unknown) => () => Promise.resolve(v);
  return {
    graph: { '/content/graph/all.json': one(f.nodes) },
    units: { '/content/units/u01.json': one(f.units[0]) },
    bank: {}, scripts: {}, story: {}, scenes: {}, writing: {},
    ...over,
  };
};

describe('content loader', () => {
  it('tolerates empty directories and falls back to fixtures only when asked', async () => {
    const real = await loadBundle(new ContentLoader(files()), { fixtures: false });
    expect(real.empty).toBe(true);
    expect(real.fixture).toBe(false);
    expect(real.course.units).toHaveLength(1);
    const fx = await loadBundle(new ContentLoader(files()), { fixtures: true });
    expect(fx.fixture).toBe(true);
    expect(fx.sentences.size).toBeGreaterThan(40);
  });

  it('uses real content as soon as the bank has sentences; skips bad records and counts them', async () => {
    const f = fixtureContent();
    const loader = new ContentLoader(files({
      bank: { '/content/bank/u01.json': () => Promise.resolve({ sentences: [...f.source.sentences, { id: 'bad', es: 1 }] }) },
      story: { '/content/story/ch001.json': () => Promise.resolve(f.source.chapters[0]) },
    }));
    const b = await loadBundle(loader, { fixtures: true });
    expect(b.fixture).toBe(false);
    expect(b.sentences.size).toBe(f.source.sentences.length);
    expect(b.chapters.has('ch001')).toBe(true);
    expect(loader.problems.some((p) => p.includes('bank/u01.json'))).toBe(true);
  });

  it('loads lazily per band', async () => {
    let loadedB1 = false;
    const loader = new ContentLoader(files({
      units: {
        '/content/units/u01.json': () => Promise.resolve(fixtureContent().units[0]),
        '/content/units/u30.json': () => Promise.resolve({ ...fixtureContent().units[0], id: 'u30', band: 'B1' }),
      },
      bank: {
        '/content/bank/u01.json': () => Promise.resolve(fixtureContent().source.sentences.slice(0, 3)),
        '/content/bank/u30.json': () => { loadedB1 = true; return Promise.resolve([]); },
      },
    }));
    await loader.load({ band: 'A1' });
    expect(loadedB1).toBe(false);
    await loader.load({ band: 'A2' });
    expect(loadedB1).toBe(true);
  });

  it('reads a file band from a unit id or a band name', () => {
    const m = new Map([['u01', 'A1' as const], ['u30', 'B1' as const]]);
    expect(fileBand('/content/bank/u30-food.json', m)).toBe('B1');
    expect(fileBand('/content/bank/B2/x.json', m)).toBe('B2');
    expect(fileBand('/content/scripts/g-ser-identity.json', m)).toBeUndefined();
    expect(records({ sentences: [1, 2] })).toEqual([1, 2]);
    expect(records({ id: 'x', a: [1] })).toEqual([{ id: 'x', a: [1] }]);
  });
});

describe('placement', () => {
  it('draws probe items from content and places by level', () => {
    const b = fixtureBundle();
    const items = contentProbe(b).items(15);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(15);
    for (const it of items) expect(it.options[it.answer]).toBe(b.bank.find((s) => s.es === it.es)!.en);
    const syn = (unit: number): ProbeItem => ({ id: `p${unit}`, unit, es: '', options: ['a', 'b'], answer: 0 });
    const probe = [0, 0, 0, 5, 5, 5, 10, 10, 10].map(syn);
    expect(placeFrom(probe, [true, true, true, true, true, false, false, false, false], 60)).toBe(6);
    expect(placeFrom(probe, Array(9).fill(false), 60)).toBe(0);
    expect(placeFrom(probe, Array(9).fill(true), 60)).toBe(11);
  });

  it('starting later introduces the skipped weeks as known', async () => {
    const w = await world();
    const path = applyPlacement(w.learner, w.bundle, 1);
    expect(path.unit).toBe(1);
    expect(w.learner.isIntroduced('g:ser-identity')).toBe(true);
    expect(w.learner.isLearning('g:ser-identity')).toBe(false);
  });
});

describe('scene turns', () => {
  const turn = fixtureContent().source.scenes[0].turns[2]; // ¿De dónde eres?
  it('the model passes; a true answer of your own passes', () => {
    expect(checkTurn(turn, 'Soy de Toronto.').pass).toBe(true);
    expect(checkTurn(turn, 'soy de Manchester').pass).toBe(true);
  });
  it('a miss gets one plain reason', () => {
    const r = checkTurn(turn, 'Estoy en Toronto');
    expect(r.pass).toBe(false);
    expect(r.reason).toMatch(/soy/i);
    expect(r.model).toBe('Soy de Toronto.');
  });
});

describe('checkers', () => {
  it('sentence translation: pronoun drop and accents', () => {
    const c = sentenceCheck({ es: 'Soy de Toronto.', en: "I'm from Toronto.", accept: [] });
    expect(c('Yo soy de Toronto').pass).toBe(true);
    expect(c('Estoy de Toronto').pass).toBe(false);
  });
  it('chunks are lenient on accents and accept any listed form', () => {
    const c = chunkCheck(['¿Cómo estás?']);
    expect(c('como estas').pass).toBe(true);
    expect(c('que tal').pass).toBe(false);
  });
  it('answering a question about you: answer with the I form', () => {
    const q = fixtureBundle().sentence('u01-4')!; // ¿De dónde eres?
    const c = respondCheck(q);
    expect(c('Soy de Leeds.').pass).toBe(true);
    const r = c('Eres de Leeds.');
    expect(r.pass).toBe(false);
    expect(r.hint).toMatch(/soy/);
  });
  it('tells Spanish from English', () => {
    expect(looksSpanish('¿De dónde eres?')).toBe(true);
    expect(looksSpanish('Where are you from?')).toBe(false);
  });
});

describe('ui store', () => {
  it('persists the profile and tallies; counts a streak of days', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    await ui.sessionFinished('2026-10-27');
    await ui.sessionFinished('2026-10-28');
    await ui.sessionFinished('2026-10-28');
    const again = await new UiStore(kv).load();
    expect(again.state.stats.sessions).toBe(3);
    expect(again.state.stats.today).toBe(2);
    expect((await kv.get(UI_KEY) as any).learnerId).toBe(ui.state.learnerId);
    expect(streak(again.state.stats.days, '2026-10-29')).toBe(2);
    expect(streak(again.state.stats.days, '2026-10-30')).toBe(0);
    await again.reset();
    expect(await kv.get(UI_KEY)).toBeUndefined();
  });
});
