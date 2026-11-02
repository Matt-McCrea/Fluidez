// The contract between a game and the learner (R23): only a due card, played with no clock, is graded; a speed game
// is exposure; `ms` never reaches `recordTime`; and no game changes the seconds a review takes, which every lesson
// budget divides by. A structural test then holds the rest of the games to credit.ts: nothing else may touch the learner.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { creditFlash, creditReading, creditRescue, FLASH_OP, isDue, RESCUE_OP } from '../../src/games/credit';
import { Rating } from '../../src/learner';
import { world } from '../ui/driver';

const DAY = 86_400_000;

/** A learner with two words and a tense known, a review of each already timed, so there is a timing to change. */
async function owned() {
  const w = await world();
  const { learner, clock } = w;
  for (const n of ['g:ser-identity', 'l:café', 'l:agua']) learner.introduce(n, { at: clock.t, results: [true, true, true], ms: [4000, 4000, 4000] });
  clock.t += 10 * DAY;
  learner.review('l:agua', 'receptive', Rating.Good, { at: clock.t, ms: 6000, op: 'warmup' });
  return w;
}

const cardsOf = (w: Awaited<ReturnType<typeof owned>>) => JSON.stringify(w.learner.toJSON().nodes);
const timingOf = (w: Awaited<ReturnType<typeof owned>>) => JSON.stringify(w.learner.toJSON().timing);

describe('a speed game is exposure', () => {
  it('moves no card, writes one event on the target, and counts what the item showed as seen', async () => {
    const w = await owned();
    const { learner, clock } = w;
    const cards = JSON.stringify(Object.fromEntries(Object.entries(learner.toJSON().nodes).map(([id, n]) => [id, { r: n.receptive, p: n.productive }])));
    const before = learner.events().length;
    creditFlash(learner, { target: 'g:ser-identity', credit: ['g:ser-identity', 'l:café'], right: false, at: clock.t });
    creditFlash(learner, { target: 'l:café', credit: ['l:café'], right: true, at: clock.t });
    const after = JSON.stringify(Object.fromEntries(Object.entries(learner.toJSON().nodes).map(([id, n]) => [id, { r: n.receptive, p: n.productive }])));
    expect(after).toBe(cards);
    const events = learner.events().slice(before);
    expect(events.map((e) => [e.node, e.op, e.scored, e.grade])).toEqual([
      ['g:ser-identity', FLASH_OP, 'exposure', Rating.Again],
      ['l:café', FLASH_OP, 'exposure', Rating.Good],
    ]);
    expect(learner.node('l:café')!.exposures).toBeGreaterThan(0);
    expect(events.every((e) => e.ms === undefined)).toBe(true);
  });

  it('never lets time reach recordTime: the timing and the seconds a review takes are the same after a hundred answers', async () => {
    const w = await owned();
    const spr = w.learner.secondsPerReview();
    const timing = timingOf(w);
    for (let i = 0; i < 100; i++) creditFlash(w.learner, { target: 'l:café', credit: ['l:café', 'g:ser-identity'], right: i % 3 !== 0, at: w.clock.t + i * 1000 });
    creditReading(w.learner, ['l:café', 'l:agua'], w.clock.t);
    expect(timingOf(w)).toBe(timing);
    expect(w.learner.secondsPerReview()).toBe(spr);
  });
});

describe('Rescate reviews what is due, and only that', () => {
  it('a due card gets a real review in its own direction, hit or miss, with no time on it', async () => {
    const w = await owned();
    const { learner, clock } = w;
    clock.t += 40 * DAY;
    const spr = learner.secondsPerReview();
    const timing = timingOf(w);
    const due = learner.due(clock.t);
    expect(due.length).toBeGreaterThan(1);
    const [hit, miss] = due;
    expect(creditRescue(learner, { node: hit.node, direction: hit.direction, grade: Rating.Good, at: clock.t, tries: 1 })).toBe(true);
    expect(creditRescue(learner, { node: miss.node, direction: miss.direction, grade: Rating.Again, at: clock.t, tries: 1 })).toBe(true);
    const reviews = learner.events().filter((e) => e.op === RESCUE_OP);
    expect(reviews.map((e) => [e.node, e.dir, e.scored, e.grade])).toEqual([
      [hit.node, hit.direction, 'review', Rating.Good], [miss.node, miss.direction, 'review', Rating.Again],
    ]);
    expect(reviews.every((e) => e.ms === undefined)).toBe(true);
    expect(learner.card(hit.node, hit.direction)!.due).toBeGreaterThan(clock.t);
    expect(learner.card(miss.node, miss.direction)!.lapses).toBeGreaterThan(0);
    expect(timingOf(w)).toBe(timing);
    expect(learner.secondsPerReview()).toBe(spr);
  });

  it('a card that is not due is not touched, whatever the caller meant', async () => {
    const w = await owned();
    const { learner, clock } = w;
    clock.t += 1 * DAY;
    const quiet = learner.nodes().map((n) => ({ n, d: (['receptive', 'productive'] as const).find((d) => learner.card(n, d) && !isDue(learner, n, d, clock.t)) })).find((x) => x.d)!;
    const before = cardsOf(w);
    const events = learner.events().length;
    expect(creditRescue(learner, { node: quiet.n, direction: quiet.d!, grade: Rating.Again, at: clock.t, tries: 1 })).toBe(false);
    expect(cardsOf(w)).toBe(before);
    expect(learner.events()).toHaveLength(events);
  });

  it('a card the learner does not have is not made up', async () => {
    const w = await owned();
    expect(creditRescue(w.learner, { node: 'l:nunca', direction: 'receptive', grade: Rating.Good, at: w.clock.t + 99 * DAY, tries: 1 })).toBe(false);
  });
});

describe('credit.ts is the only place a game touches the learner', () => {
  const root = join(__dirname, '../../src');
  const files = (dir: string): string[] => !existsSync(dir) ? [] : readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
  const games = [...files(join(root, 'games')), ...files(join(root, 'ui/games'))].filter((f) => !f.endsWith('games/credit.ts'));
  // what changes a card, an exposure, the ledger, the attempts log or the time: all of it is credit.ts's
  const WRITES = /\.(review|creditSentence|expose|learningStep|completeIntroduction|introduce|seedKnown|stepRung|recordAttempt|recordTime)\(|ledger\.markSeen|reviewSentence|reviewNode|seenWithEvent|seenAbout|\bsetSettings\b/;

  it('finds the games', () => {
    expect(games.length).toBeGreaterThan(0);
  });

  for (const f of games) {
    const rel = f.slice(f.indexOf('/src/') + 5);
    it(`${rel} writes nothing to the learner`, () => {
      const code = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code.match(WRITES), `${rel} reaches the learner on its own`).toBeNull();
    });
  }

  it('and no `ms` is a field of anything credit.ts writes', () => {
    const src = readFileSync(join(root, 'games/credit.ts'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(src).not.toMatch(/\bms\b/);
  });
});
