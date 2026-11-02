// What the games keep, under a key of their own ("games"): personal bests, the
// rounds played, the readings of De corrido and, per verb form, how often it was
// missed. Not in the ui document, which is cloned whole on every change, and not
// in the event log, which a round of twenty answers would swamp (a sentence
// answer writes up to nine events). Everything here is compact and capped.
//
// A score belongs to one game and one deck and means nothing outside it: there
// is no total across games, no level and no currency. A best is a number in the
// game's own unit (forms right, words a minute), kept only if it beats the last.
//
// Keeping must never cost a lesson. A document a newer build wrote is left alone,
// a damaged one is put aside and started again, and a store that refuses a write
// is reported on the console and carried on from (as in ui/store/keep.ts).
import { StoredDocumentError, type KV } from '../learner';

export const GAMES_KEY = 'games';
export const GAMES_VERSION = 1;
/** Newest rounds and readings kept. Bests do not depend on them. */
export const ROUNDS_CAP = 300;
export const READINGS_CAP = 300;

export type GameId = 'flash' | 'rescue' | 'reread' | 'uno';

/** A best, in the game's own unit. */
export interface Best { score: number; at: number }

/** One round, compact: what was played and how it went. */
export interface RoundRow {
  at: number;
  game: GameId;
  /** the fixed deck the score belongs to (see `flashKey`); none for a game with no score */
  deck: string;
  score: number;
  /** answers refused, and items passed over */
  wrong?: number;
  skipped?: number;
}

/** One De corrido reading: every one is kept, counted or not, so the pace can be seen over months. */
export interface ReadingRow {
  at: number;
  chapter: string;
  /** the stage the chapter belongs to; a best is compared within one */
  band: string;
  words: number;
  secs: number;
  wpm: number;
  right: number;
  of: number;
  /** passed the check at a pace a person can read at: only these set a best */
  counted: boolean;
}

/** How often one form (tense and person) was asked and missed, to deal the ones that slip more often. */
export interface CellRow { n: number; miss: number }

export interface GamesDoc {
  version: number;
  bests: Record<string, Best>;
  rounds: RoundRow[];
  reading: ReadingRow[];
  cells: Record<string, CellRow>;
}

export const emptyGames = (): GamesDoc => ({ version: GAMES_VERSION, bests: {}, rounds: [], reading: [], cells: {} });

/** The key a Relámpago best is kept under: one fixed deck per name ("presente", "palabras"). */
export const flashKey = (deck: string): string => `flash:${deck}`;
/** The key an Uno u otro best is kept under: one deck per contrast. */
export const unoKey = (contrast: string): string => `uno:${contrast}`;
/** The key a De corrido best is kept under: the stage of the chapter. */
export const rereadKey = (band: string): string => `reread:${band}`;

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const finite = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

const usableRound = (r: unknown): r is RoundRow =>
  isObject(r) && finite(r.at) && finite(r.score) && typeof r.deck === 'string' && (r.game === 'flash' || r.game === 'rescue' || r.game === 'reread' || r.game === 'uno');
const usableReading = (r: unknown): r is ReadingRow =>
  isObject(r) && finite(r.at) && typeof r.chapter === 'string' && typeof r.band === 'string' && finite(r.words) && finite(r.secs) && finite(r.wpm) && typeof r.counted === 'boolean';
const usableBest = (b: unknown): b is Best => isObject(b) && finite(b.score) && finite(b.at);
const usableCell = (c: unknown): c is CellRow => isObject(c) && finite(c.n) && finite(c.miss);

/** Open a stored games document the way boot opens the others: a newer one throws `newer`, one that is not a document throws `unreadable`, a damaged row is dropped. */
export function readGames(raw: unknown): GamesDoc {
  // the version first: a newer build may have moved the rows, and that is not damage to clear away
  const version = isObject(raw) && typeof raw.version === 'number' ? raw.version : 1;
  if (version > GAMES_VERSION) throw new StoredDocumentError('newer', GAMES_KEY, `v${version} is newer than this build (v${GAMES_VERSION})`);
  if (!isObject(raw) || !isObject(raw.bests) || !Array.isArray(raw.rounds) || !Array.isArray(raw.reading) || !isObject(raw.cells)) {
    throw new StoredDocumentError('unreadable', GAMES_KEY, 'not a games document');
  }
  const bests = Object.fromEntries(Object.entries(raw.bests).filter(([, b]) => usableBest(b))) as Record<string, Best>;
  const cells = Object.fromEntries(Object.entries(raw.cells).filter(([, c]) => usableCell(c))) as Record<string, CellRow>;
  const rounds = raw.rounds.filter(usableRound);
  const reading = raw.reading.filter(usableReading);
  const dropped = (raw.rounds.length - rounds.length) + (raw.reading.length - reading.length)
    + (Object.keys(raw.bests).length - Object.keys(bests).length) + (Object.keys(raw.cells).length - Object.keys(cells).length);
  if (dropped) console.warn(`fluidez: dropped ${dropped} damaged row(s) from the games document`);
  return { version: GAMES_VERSION, bests, rounds: rounds.slice(-ROUNDS_CAP), reading: reading.slice(-READINGS_CAP), cells };
}

/** What recording a score did to the best: the one before it, and whether this is a new one. */
export interface BestResult { was?: number; isBest: boolean }

export class GamesStore {
  /** every change runs on this chain, and no job on it rejects, so one refused write cannot end keeping */
  private chain: Promise<void> = Promise.resolve();

  constructor(private readonly kv: KV) {}

  /** Resolves once everything asked for so far has been written (or has failed and been reported). */
  settled(): Promise<void> { return this.chain; }

  private run(what: string, job: () => Promise<void>): Promise<void> {
    this.chain = this.chain.then(job).catch((e) => { console.warn(`fluidez: could not keep ${what}`, e); });
    return this.chain;
  }

  /** The stored document, or a new one. A damaged one is copied to `games.quarantine` first; a newer one throws, to be left exactly as it is. */
  private async open(): Promise<GamesDoc> {
    const raw = await this.kv.get(GAMES_KEY);
    if (raw === undefined || raw === null) return emptyGames();
    try { return readGames(raw); } catch (e) {
      if (!(e instanceof StoredDocumentError) || e.fault === 'newer') throw e;
      console.warn(`fluidez: ${GAMES_KEY} could not be read (${e.detail}); starting it again`);
      try { await this.kv.set(`${GAMES_KEY}.quarantine`, raw); } catch { /* best effort */ }
      return emptyGames();
    }
  }

  /** A damaged document is put aside and started again at boot, as the learner's are: a backup has to open every document, so one left lying refuses them all. */
  tidy(): Promise<void> {
    return this.run('its documents in order', async () => {
      const raw = await this.kv.get(GAMES_KEY);
      if (raw === undefined || raw === null) return;
      try { readGames(raw); } catch (e) {
        if (e instanceof StoredDocumentError && e.fault === 'unreadable') await this.kv.set(GAMES_KEY, await this.open());
      }
    });
  }

  /** What the games hold, once everything asked for so far is written. A document that cannot be read (a newer one) shows as empty and is never written over. */
  async read(): Promise<GamesDoc> {
    await this.chain;
    try { return await this.open(); } catch { return emptyGames(); }
  }

  /** Change the document and write it; resolves to what `job` returned, or undefined if the write did not happen. */
  private change<T>(what: string, job: (doc: GamesDoc) => T): Promise<T | undefined> {
    let out: T | undefined;
    return this.run(what, async () => {
      const doc = await this.open();
      const made = job(doc);
      await this.kv.set(GAMES_KEY, doc);
      out = made;
    }).then(() => out);
  }

  /** Keep a round that has no score to beat (a rescue): the row, and nothing else. */
  addRound(row: RoundRow): Promise<void> {
    return this.change('a round', (doc) => { pushRound(doc, row); }).then(() => undefined);
  }

  /** Keep a finished round, and its score as the best of its deck if it beats the one before. A score of 0 is never a best. */
  finishRound(row: RoundRow, key: string, cells: Record<string, CellRow> = {}): Promise<BestResult | undefined> {
    return this.change('a round', (doc) => {
      pushRound(doc, row);
      for (const [k, c] of Object.entries(cells)) {
        const cur = Object.hasOwn(doc.cells, k) ? doc.cells[k] : { n: 0, miss: 0 };
        doc.cells[k] = { n: cur.n + c.n, miss: cur.miss + c.miss };
      }
      return setBest(doc, key, row.score, row.at);
    });
  }

  /** Keep a reading of a chapter; a counted one is also the best of its stage if it is faster than the one before. */
  addReading(row: ReadingRow): Promise<BestResult | undefined> {
    return this.change('a reading', (doc) => {
      doc.reading.push(row);
      if (doc.reading.length > READINGS_CAP) doc.reading.splice(0, doc.reading.length - READINGS_CAP);
      return row.counted ? setBest(doc, rereadKey(row.band), row.wpm, row.at) : { isBest: false };
    });
  }
}

function pushRound(doc: GamesDoc, row: RoundRow): void {
  doc.rounds.push(row);
  if (doc.rounds.length > ROUNDS_CAP) doc.rounds.splice(0, doc.rounds.length - ROUNDS_CAP);
}

function setBest(doc: GamesDoc, key: string, score: number, at: number): BestResult {
  const was = Object.hasOwn(doc.bests, key) ? doc.bests[key].score : undefined;
  if (!(score > 0) || (was !== undefined && score <= was)) return { ...(was !== undefined ? { was } : {}), isBest: false };
  doc.bests[key] = { score, at };
  return { ...(was !== undefined ? { was } : {}), isBest: true };
}
