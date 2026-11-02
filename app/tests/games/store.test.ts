// What the games keep: a document of its own, tolerant at the door, compact, in a backup, gone on a reset. A score
// is a best in one game's own unit and nothing more: no total, no level, no currency.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IdbStore, Learner } from '../../src/learner';
import { backupText, provenBackup, readBackup, restoreBackup, BackupError } from '../../src/learner/backup';
import {
  emptyGames, flashKey, GAMES_KEY, GAMES_VERSION, GamesStore, READINGS_CAP, readGames, rereadKey, ROUNDS_CAP, type GamesDoc, type ReadingRow, type RoundRow,
} from '../../src/games/store';
import { BACKUP_READERS, MemoryKV, UiStore } from '../../src/ui/store/ui';

beforeEach(() => { vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { vi.restoreAllMocks(); });

const round = (over: Partial<RoundRow> = {}): RoundRow => ({ at: 1000, game: 'flash', deck: 'presente', score: 12, wrong: 1, skipped: 0, ...over });
const reading = (over: Partial<ReadingRow> = {}): ReadingRow => ({ at: 1000, chapter: 'ch010', band: 'A2', words: 200, secs: 90, wpm: 133, right: 3, of: 3, counted: true, ...over });
const stored = async (kv: MemoryKV) => (await kv.get(GAMES_KEY)) as GamesDoc | undefined;

describe('a round is kept', () => {
  it('as a row, and its score is the best of its deck when it beats the one before', async () => {
    const kv = new MemoryKV();
    const g = new GamesStore(kv);
    const a = await g.finishRound(round({ score: 12 }), flashKey('presente'));
    expect(a).toEqual({ isBest: true });
    const b = await g.finishRound(round({ score: 15, at: 2000 }), flashKey('presente'));
    expect(b).toEqual({ was: 12, isBest: true });
    const c = await g.finishRound(round({ score: 9, at: 3000 }), flashKey('presente'));
    expect(c).toEqual({ was: 15, isBest: false });
    const d = (await stored(kv))!;
    expect(d.bests[flashKey('presente')]).toEqual({ score: 15, at: 2000 });
    expect(d.rounds.map((r) => r.score)).toEqual([12, 15, 9]);
    expect(d.version).toBe(GAMES_VERSION);
  });

  it('a tie is not a new best, and a score of nothing is never one', async () => {
    const g = new GamesStore(new MemoryKV());
    await g.finishRound(round({ score: 10 }), flashKey('presente'));
    expect((await g.finishRound(round({ score: 10 }), flashKey('presente')))!.isBest).toBe(false);
    expect((await g.finishRound(round({ score: 0 }), flashKey('futuro')))!.isBest).toBe(false);
    expect((await g.read()).bests[flashKey('futuro')]).toBeUndefined();
  });

  it('each deck keeps its own best: a new verb in one changes nothing in another', async () => {
    const g = new GamesStore(new MemoryKV());
    await g.finishRound(round({ score: 14, deck: 'presente' }), flashKey('presente'));
    await g.finishRound(round({ score: 6, deck: 'palabras' }), flashKey('palabras'));
    const bests = (await g.read()).bests;
    expect(bests[flashKey('presente')].score).toBe(14);
    expect(bests[flashKey('palabras')].score).toBe(6);
  });

  it('how often each form was asked and missed adds up across rounds', async () => {
    const g = new GamesStore(new MemoryKV());
    await g.finishRound(round(), flashKey('presente'), { 'presente|yo': { n: 3, miss: 1 }, 'presente|ellos': { n: 2, miss: 0 } });
    await g.finishRound(round(), flashKey('presente'), { 'presente|yo': { n: 2, miss: 2 } });
    expect((await g.read()).cells).toEqual({ 'presente|yo': { n: 5, miss: 3 }, 'presente|ellos': { n: 2, miss: 0 } });
  });

  it('keeps the newest rounds and readings, and the bests do not depend on them', async () => {
    const kv = new MemoryKV();
    const g = new GamesStore(kv);
    await g.finishRound(round({ score: 99 }), flashKey('presente'));
    for (let i = 0; i < ROUNDS_CAP + 5; i++) await g.finishRound(round({ score: 1, at: 2000 + i }), flashKey('presente'));
    for (let i = 0; i < READINGS_CAP + 5; i++) await g.addReading(reading({ at: i, counted: false }));
    const d = (await stored(kv))!;
    expect(d.rounds).toHaveLength(ROUNDS_CAP);
    expect(d.reading).toHaveLength(READINGS_CAP);
    expect(d.bests[flashKey('presente')].score).toBe(99);
  });
});

describe('a reading is kept', () => {
  it('every one, and only a counted one can be the best of its stage', async () => {
    const g = new GamesStore(new MemoryKV());
    expect((await g.addReading(reading({ wpm: 400, counted: false })))!.isBest).toBe(false);
    expect((await g.read()).bests[rereadKey('A2')]).toBeUndefined();
    expect((await g.addReading(reading({ wpm: 120 })))!.isBest).toBe(true);
    expect((await g.addReading(reading({ wpm: 110, at: 2 })))!.isBest).toBe(false);
    expect((await g.addReading(reading({ wpm: 130, at: 3 })))).toEqual({ was: 120, isBest: true });
    expect((await g.addReading(reading({ wpm: 90, band: 'B1', at: 4 })))!.isBest).toBe(true);
    const d = await g.read();
    expect(d.reading).toHaveLength(5);
    expect(d.bests[rereadKey('A2')].score).toBe(130);
    expect(d.bests[rereadKey('B1')].score).toBe(90);
  });
});

describe('the document is read tolerantly', () => {
  it('drops a damaged row and keeps the rest', () => {
    const d = readGames({
      version: 1, bests: { good: { score: 3, at: 1 }, bad: { score: 'x' } }, rounds: [round(), { nonsense: 1 }], reading: [reading(), null],
      cells: { 'presente|yo': { n: 1, miss: 0 }, broken: 4 },
    });
    expect(Object.keys(d.bests)).toEqual(['good']);
    expect(d.rounds).toHaveLength(1);
    expect(d.reading).toHaveLength(1);
    expect(Object.keys(d.cells)).toEqual(['presente|yo']);
  });

  it('refuses a newer one, and one that is not a document', () => {
    expect(() => readGames({ ...emptyGames(), version: GAMES_VERSION + 1 })).toThrow(expect.objectContaining({ fault: 'newer' }));
    expect(() => readGames('rubbish')).toThrow(expect.objectContaining({ fault: 'unreadable' }));
    expect(() => readGames({ version: 1, bests: [], rounds: [], reading: [], cells: {} })).toThrow(expect.objectContaining({ fault: 'unreadable' }));
  });

  it('a newer document is left exactly as it is, and shows as empty', async () => {
    const kv = new MemoryKV();
    const newer = { ...emptyGames(), version: GAMES_VERSION + 1, future: true };
    await kv.set(GAMES_KEY, newer);
    const g = new GamesStore(kv);
    await g.finishRound(round(), flashKey('presente'));
    await g.tidy();
    expect(await kv.get(GAMES_KEY)).toEqual(newer);
    expect(await g.read()).toEqual(emptyGames());
  });

  it('a damaged one is put aside at boot and started again, so a backup can still open every document', async () => {
    const kv = new MemoryKV();
    await kv.set(GAMES_KEY, 'rubbish');
    const ui = await new UiStore(kv).load();
    expect(await kv.get(`${GAMES_KEY}.quarantine`)).toBe('rubbish');
    expect(await stored(kv)).toEqual(emptyGames());
    await ui.games.settled();
  });

  it('a store that refuses a write does not stop the round from ending', async () => {
    const kv = new MemoryKV();
    kv.set = async () => { throw new Error('quota'); };
    const g = new GamesStore(kv);
    await expect(g.finishRound(round(), flashKey('presente'))).resolves.toBeUndefined();
    await expect(g.addReading(reading())).resolves.toBeUndefined();
  });
});

describe('the games go where a learner\'s things go', () => {
  it('not in the ui document, which is cloned whole on every change', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    await ui.games.finishRound(round(), flashKey('presente'));
    expect(Object.keys(ui.state)).not.toContain('games');
    expect(JSON.stringify(await kv.get('ui'))).not.toContain('flash');
  });

  it('in a backup, restored by it, and gone when the learner starts over', async () => {
    const kv = new MemoryKV();
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    await L.flush();
    const ui = await new UiStore(kv).load();
    await ui.games.finishRound(round({ score: 17 }), flashKey('presente'));
    await ui.games.addReading(reading({ wpm: 140 }));
    const file = await provenBackup(store, BACKUP_READERS, 1);
    expect(Object.keys(file.documents)).toContain(GAMES_KEY);
    await store.clear();
    await ui.reset();
    expect([...kv.data.keys()]).toEqual([]);
    await restoreBackup(store, readBackup(backupText(file), BACKUP_READERS), BACKUP_READERS);
    const back = (await stored(kv))!;
    expect(back.bests[flashKey('presente')].score).toBe(17);
    expect(back.reading[0].wpm).toBe(140);
    expect(() => readBackup(backupText({ ...file, documents: { ...file.documents, [GAMES_KEY]: 'rubbish' } }), BACKUP_READERS)).toThrow(BackupError);
  });
});
