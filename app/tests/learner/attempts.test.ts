// What a learner typed, what the checker made of it, and the shape of the card it was typed on were thrown
// away the moment the answer was graded, so no error pattern and no false rejection could ever be worked
// out afterwards. The attempts log keeps them, apart from the review events (an exposure writes one event
// per node, so the text would repeat up to nine times) and capped, and the learner's state keeps a small
// rollup that outlives the cap.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  ATTEMPTS_CAP, ATTEMPTS_VERSION, compact, IdbStore, Learner, MemoryStore, migrate, Rating, readAttempts, StoredDocumentError, STATE_VERSION,
  type AttemptRow, type KV, type ReviewEvent,
} from '../../src/learner';
import { backupText, makeBackup, provenBackup, readBackup, restoreBackup, BACKUP_NEWER, BackupError } from '../../src/learner/backup';
import { BACKUP_READERS, MemoryKV, UiStore } from '../../src/ui/store/ui';
import { clock, DAY } from './helpers';

function mapKV(): KV & { map: Map<string, unknown> } {
  const map = new Map<string, unknown>();
  return {
    map,
    async get(k) { return map.has(k) ? structuredClone(map.get(k)) : undefined; },
    async set(k, v) { map.set(k, structuredClone(v)); },
    async del(k) { map.delete(k); },
  };
}

const row = (o: Partial<AttemptRow> = {}): AttemptRow => ({ at: 1_000, node: 'l:a', op: 'type', fmt: 'type:en>es', given: 'el cafe', ...o });
const ev = (o: Partial<ReviewEvent>): ReviewEvent => ({
  at: 0, node: 'l:a', dir: 'receptive', grade: Rating.Good, op: 'warmup', tries: 1, novel: false, session: 1, scored: 'review', ...o,
});

beforeEach(() => { vi.spyOn(console, 'warn').mockImplementation(() => {}); });
afterEach(() => { vi.restoreAllMocks(); });

describe('the attempts log', () => {
  test('a row is kept under its own key, apart from the state and the review events, and comes back', async () => {
    const kv = mapKV();
    const L = await Learner.open(new IdbStore(kv));
    L.introduce('l:a', { results: [true, true, true] });
    L.recordAttempt(row({ given: 'el café', answer: 'el café', verdict: 'wrong', err: 'accents', firstKeyMs: 2100, contentRev: 'abc123' }));
    await L.flush();
    expect(kv.map.has('attempts')).toBe(true);
    expect(JSON.stringify(kv.map.get('state'))).not.toContain('el café');
    expect(JSON.stringify(kv.map.get('events'))).not.toContain('el café');
    expect(kv.map.get('attempts')).toMatchObject({ version: ATTEMPTS_VERSION, rows: [{ given: 'el café', err: 'accents', firstKeyMs: 2100, contentRev: 'abc123' }] });
    const M = await Learner.open(new IdbStore(kv));
    expect(M.attempts()).toEqual(L.attempts());
    expect(M.attempts()).toHaveLength(1);
  });

  test('keeps the newest rows up to the cap, in order, and the oldest go', () => {
    const L = Learner.fresh();
    for (let i = 0; i < ATTEMPTS_CAP + 200; i++) L.recordAttempt(row({ at: i, given: `g${i}` }));
    const rows = L.attempts();
    expect(rows).toHaveLength(ATTEMPTS_CAP);
    expect(rows[0].given).toBe('g200');
    expect(rows.at(-1)!.given).toBe(`g${ATTEMPTS_CAP + 199}`);
  });

  test('the rows ride in the same transaction as the state when a session closes', async () => {
    const store = new MemoryStore();
    const L = await Learner.open(store);
    L.recordAttempt(row());
    await L.commit({ path: { p: 1 }, ui: { u: 1 } });
    expect(await store.loadAttempts()).toMatchObject({ rows: [{ given: 'el cafe' }] });
    expect(store.extras.get('path')).toEqual({ p: 1 });
  });

  test('a log a newer build wrote is refused and left alone; one that is damaged is kept aside and starts again', async () => {
    const kv = mapKV();
    kv.map.set('attempts', { version: ATTEMPTS_VERSION + 1, rows: [row()] });
    const e = await Learner.open(new IdbStore(kv)).catch((x) => x);
    expect(e).toBeInstanceOf(StoredDocumentError);
    expect(e.fault).toBe('newer');
    expect(kv.map.get('attempts')).toEqual({ version: ATTEMPTS_VERSION + 1, rows: [row()] });

    kv.map.set('attempts', 'rubbish');
    const L = await Learner.open(new IdbStore(kv));
    expect(L.attempts()).toEqual([]);
    expect(kv.map.get('attempts.quarantine')).toBe('rubbish');
  });

  test('a row that is not a row is dropped, the rest are kept', () => {
    const log = readAttempts({ version: 1, rows: [row({ given: 'a' }), { nonsense: true }, row({ given: 'b' }), null] });
    expect(log.rows.map((r) => r.given)).toEqual(['a', 'b']);
    expect(() => readAttempts({ version: 1 })).toThrow(StoredDocumentError);
  });
});

describe('the fingerprint', () => {
  test('counts each kind of slip that was named, and which of them ended as a miss', () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.recordAttempt(row({ at: 10, err: 'article', verdict: 'right' }));   // named, then fixed on the retry
    L.recordAttempt(row({ at: 20, err: 'article', verdict: 'wrong' }));   // named, and the answer had to be shown
    L.recordAttempt(row({ at: 30, err: 'accents', verdict: 'right' }));
    L.recordAttempt(row({ at: 40, verdict: 'right' }));                    // nothing named: no entry
    expect(L.toJSON().fingerprint).toEqual({ article: { n: 2, miss: 1, last: 20 }, accents: { n: 1, miss: 0, last: 30 } });
  });

  test('outlives the log: the cap drops rows, never counts', () => {
    const L = Learner.fresh();
    for (let i = 0; i < ATTEMPTS_CAP + 50; i++) L.recordAttempt(row({ at: i, err: 'verb-ending', verdict: 'wrong' }));
    expect(L.attempts()).toHaveLength(ATTEMPTS_CAP);
    expect(L.toJSON().fingerprint).toEqual({ 'verb-ending': { n: ATTEMPTS_CAP + 50, miss: ATTEMPTS_CAP + 50, last: ATTEMPTS_CAP + 49 } });
  });

  test('is an additive field: no version bump, and a state without it loads as it always did', async () => {
    expect(STATE_VERSION).toBe(2);
    const bare = Learner.fresh().toJSON();
    expect(bare.fingerprint).toBeUndefined();
    expect(migrate(bare).version).toBe(2);
    const L = Learner.fresh();
    L.recordAttempt(row({ err: 'article', verdict: 'wrong' }));
    const kept = migrate(JSON.parse(JSON.stringify(L.toJSON())));
    expect(kept.fingerprint).toEqual(L.toJSON().fingerprint);
    const M = await Learner.open(new MemoryStore(L.toJSON()));
    expect(M.toJSON().fingerprint).toEqual(L.toJSON().fingerprint);
  });

  test('a fingerprint that is not a table is replaced, not trusted', () => {
    const s: any = { ...Learner.fresh().toJSON(), fingerprint: 'oops' };
    const L = Learner.fromJSON(s);
    expect(() => L.recordAttempt(row({ err: 'article', verdict: 'wrong' }))).not.toThrow();
    expect(L.toJSON().fingerprint).toEqual({ article: { n: 1, miss: 1, last: 1_000 } });
  });
});

describe('the slip an answer made rides on its first event only', () => {
  const two = () => {
    const c = clock();
    const L = Learner.fresh({ now: c.now });
    L.introduce('l:a', { results: [true, true, true] });
    L.introduce('l:b', { results: [true, true, true] });
    c.advance(5 * DAY);
    return L;
  };

  test('a sentence that reviews two targets names the slip on the first of them', () => {
    const L = two();
    L.creditSentence(['l:a', 'l:b'], 'receptive', Rating.Again, { targets: ['l:a', 'l:b'], op: 'warmup', tries: 2, err: 'article', rule: 'por-para-time' });
    const rev = L.events().filter((e) => e.scored === 'review');
    expect(rev.map((e) => [e.node, e.err, e.rule])).toEqual([['l:a', 'article', 'por-para-time'], ['l:b', undefined, undefined]]);
  });

  test('an exposure that logs an event on two nodes names it on the first', () => {
    const L = two();
    L.expose(['l:a', 'l:b'], { event: { op: 'grind', grade: Rating.Again, err: 'tense' } });
    expect(L.events().filter((e) => e.scored === 'exposure').map((e) => [e.node, e.err])).toEqual([['l:a', 'tense'], ['l:b', undefined]]);
  });

  test('a review, an in-lesson step and an event that carry nothing stay as they were', () => {
    const L = two();
    L.review('l:a', 'receptive', Rating.Good, { op: 'warmup' });
    expect(Object.keys(L.events().at(-1)!)).not.toContain('err');
    L.review('l:b', 'receptive', Rating.Again, { op: 'warmup', err: 'accents' });
    expect(L.events().at(-1)!.err).toBe('accents');
  });

  test('the text of an answer never goes on an event', () => {
    const L = two();
    L.creditSentence(['l:a'], 'receptive', Rating.Again, { op: 'warmup', err: 'article', given: 'el cafe' } as never);
    expect(JSON.stringify(L.events())).not.toContain('el cafe');
  });
});

describe('compaction keeps what cannot be worked out again', () => {
  const NOW = 1_000 * DAY;
  const old = (o: Partial<ReviewEvent>) => ev({ at: NOW - 400 * DAY, ...o });
  const log = (events: ReviewEvent[]) => ({ events, summary: { upTo: 0, counts: {} } });

  test('a year-old pass is folded into counts', () => {
    const out = compact(log([old({ node: 'l:p' })]), 365, NOW);
    expect(out.events).toEqual([]);
    expect(out.summary.counts['l:p']).toEqual({ receptive: 1, productive: 0 });
  });

  test('a miss, a claim and a probe are kept, whatever their age, and are not counted as folded', () => {
    const kept = [
      old({ node: 'l:miss', grade: Rating.Again }),
      old({ node: 'l:retry', tries: 2 }),
      old({ node: 'l:claim', claimed: true }),
      old({ node: 'l:probe', probe: true }),
    ];
    const out = compact(log([...kept, old({ node: 'l:pass' })]), 365, NOW);
    expect(out.events.map((e) => e.node)).toEqual(['l:miss', 'l:retry', 'l:claim', 'l:probe']);
    expect(Object.keys(out.summary.counts)).toEqual(['l:pass']);
  });

  test('what is kept is the whole event, with its slip', () => {
    const e = old({ grade: Rating.Again, err: 'ser-estar', rule: 'x' });
    expect(compact(log([e]), 365, NOW).events).toEqual([e]);
  });
});

describe('a backup carries the attempts', () => {
  async function learnerWithAttempts(kv: MemoryKV) {
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    L.recordAttempt(row({ at: 5, given: 'la casa', answer: 'la casa', err: 'article', verdict: 'wrong', firstKeyMs: 1800 }));
    L.recordAttempt(row({ at: 6, given: 'el agua', verdict: 'right' }));
    await L.flush();
    await new UiStore(kv).load();
    return { store, L };
  }

  test('export, wipe, restore: the rows and the rollup come back', async () => {
    const kv = new MemoryKV();
    const { store, L } = await learnerWithAttempts(kv);
    const file = await provenBackup(store, BACKUP_READERS, 99);
    expect(Object.keys(file.documents).sort()).toEqual(['attempts', 'events', 'state', 'ui']);
    expect(file.versions.attempts).toBe(ATTEMPTS_VERSION);

    await store.clear();
    await new UiStore(kv).reset();
    expect([...kv.data.keys()]).toEqual([]);

    await restoreBackup(store, readBackup(backupText(file), BACKUP_READERS), BACKUP_READERS);
    const M = await Learner.open(new IdbStore(kv));
    expect(M.attempts()).toEqual(L.attempts());
    expect(M.toJSON().fingerprint).toEqual(L.toJSON().fingerprint);
  });

  test('a backup whose attempts a newer build wrote is refused in words, and a damaged one is refused too', async () => {
    const { store } = await learnerWithAttempts(new MemoryKV());
    const file = await makeBackup(store, BACKUP_READERS, 99);
    const newer = backupText({ ...file, documents: { ...file.documents, attempts: { version: ATTEMPTS_VERSION + 1, rows: [] } } });
    expect((await Promise.resolve().then(() => readBackup(newer, BACKUP_READERS)).catch((e) => e)).message).toBe(BACKUP_NEWER);
    const damaged = backupText({ ...file, documents: { ...file.documents, attempts: 'rubbish' } });
    expect(() => readBackup(damaged, BACKUP_READERS)).toThrow(BackupError);
  });

  test('a learner with no attempts yet backs up exactly as before', async () => {
    const kv = new MemoryKV();
    const store = new IdbStore(kv);
    const L = await Learner.open(store);
    L.introduce('l:a', { results: [true, true, true] });
    await L.flush();
    await new UiStore(kv).load();
    expect(Object.keys((await makeBackup(store, BACKUP_READERS, 1)).documents).sort()).toEqual(['events', 'state', 'ui']);
  });
});

// Saved learners are sacred. The fingerprint and the attempts document are additive, so a learner saved before
// them boots as they were, gains only what is new, and a build that has not heard of the new field carries it.
describe.each(['live-ee6aaec', 'head-early', 'head-mid-session', 'head-placed'])('golden learner %s', (name) => {
  const g = JSON.parse(readFileSync(fileURLToPath(new URL(`../golden/${name}.json`, import.meta.url)), 'utf8')) as { madeAt: number; kv: Record<string, unknown> };
  const kvOf = () => { const kv = mapKV(); for (const [k, v] of Object.entries(g.kv)) kv.map.set(k, structuredClone(v)); return kv; };

  test('gains the attempts and the fingerprint and loses nothing', async () => {
    const was = await Learner.open(new IdbStore(kvOf()), { now: () => g.madeAt });
    const kv = kvOf();
    const L = await Learner.open(new IdbStore(kv), { now: () => g.madeAt });
    L.recordAttempt(row({ at: g.madeAt, err: 'article', verdict: 'wrong' }));
    await L.flush();
    const M = await Learner.open(new IdbStore(kv), { now: () => g.madeAt });
    const { fingerprint, ...rest } = M.toJSON();
    expect(rest).toEqual(was.toJSON());
    expect(fingerprint).toEqual({ article: { n: 1, miss: 1, last: g.madeAt } });
    expect(M.events()).toEqual(was.events());
    expect(M.attempts()).toHaveLength(1);
    expect(kv.map.get('events')).toEqual(g.kv.events);
  });
});
