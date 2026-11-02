// Relámpago: sixty seconds of forms and words the learner already owns. See the
// meaning, type the form (or tap the word), and as many as you can.
//
// Only what is owned is dealt: a verb or word remembered after a wait, not on the
// day it was taught, and a tense the learner has been getting right when nothing
// is on the clock. A speed round is exposure and nothing more (credit.ts), so it
// can never cost a card its place, and nothing here looks at where the learner is
// in the course.
import { checkExact } from '../check';
import type { NodeId } from '../content/schema';
import { acceptedForms, PRODUCTION_IMP_PERSONS, PRODUCTION_PERSONS, personsFor, verbByInf, type TenseKey, type Verb } from '../engine';
import type { Rng } from '../exercises/rng';
import { Rating, State, type Direction, type Learner, type ReviewEvent } from '../learner';
import type { Bundle } from '../ui/data/bundle';
import { wordChoice, type Lang, type McqCard, type TypeCard } from '../ui/session/cards';
import { conjugationCard, taughtTenses, tenseNode, verbsMet } from '../ui/session/freeplay';
import { PICKER_TENSES, tenseShort } from '../ui/session/tenses';
import { creditFlash, FLASH_OP } from './credit';
import { scoreOf, startRound, step, secondsLeft, type Kind, type RoundState } from './round';
import { flashKey, type BestResult, type CellRow, type GamesStore } from './store';

/** A card the learner has remembered after a wait counts as owned: stable for at least this many days. */
export const OWNED_DAYS = 8;
/** Verbs a forms deck needs, and words the words deck needs, before it is dealt: fewer would come round in a minute. */
export const MIN_VERBS = 6;
export const MIN_WORDS = 12;
/** A tense is dealt once nine of the last ten attempts at it, with no clock, went well. */
export const CALM_OF = 10;
export const CALM_RIGHT = 9;

export const WORDS_DECK = 'palabras';

export interface FlashDeck {
  id: string;
  title: string;
  kind: 'forms' | 'words';
  tense?: TenseKey;
}

/** Whether the learner has remembered this after a wait, and has not forgotten it since (a lapsed card is in relearning). */
export function owns(learner: Learner, node: NodeId): boolean {
  if (learner.isLearning(node)) return false;
  return (['productive', 'receptive'] as const).some((d) => { const c = learner.card(node, d); return !!c && c.state === State.Review && c.stability >= OWNED_DAYS; });
}

const wentWell = (e: ReviewEvent) => e.grade !== Rating.Again && e.tries !== 2;

/** The last ten attempts at a node made with no clock (a speed round is not one), and how many went well. */
export function calmRecord(events: readonly ReviewEvent[], node: NodeId): { n: number; right: number } {
  const calm: ReviewEvent[] = [];
  for (let i = events.length - 1; i >= 0 && calm.length < CALM_OF; i--) {
    const e = events[i];
    // "mine says the same thing" is neither a right nor a wrong: the app could not tell (R9)
    if (e.node === node && e.scored !== 'intro' && e.op !== FLASH_OP && !e.claimed) calm.push(e);
  }
  return { n: calm.length, right: calm.filter(wentWell).length };
}

/**
 * Verbs a person is not the subject of. A cue of "(encantar, yo, now), I love" asks for "encanto", which is not how
 * "I love" is said (me encanta), and "I rain" is not a thing to say: typed at speed, each drills the wrong sentence.
 */
export const NO_PERSON = new Set(['gustar', 'encantar', 'doler', 'fascinar', 'apetecer', 'llover', 'nevar', 'lloviznar', 'granizar', 'tronar']);

/** The verbs a forms deck may deal: met, owned, and said of a person. */
export function ownedVerbs(learner: Learner): Verb[] {
  return verbsMet(learner).filter((inf) => !NO_PERSON.has(inf) && owns(learner, `l:${inf}`)).map((inf) => verbByInf(inf)).filter((v): v is Verb => !!v);
}

/** The words a words deck may deal: owned lexemes the course gives a pair for. */
export function ownedWords(learner: Learner, bundle: Bundle): NodeId[] {
  return learner.nodes().filter((id) => id.startsWith('l:') && bundle.node(id)?.kind === 'lexeme' && !!bundle.segments(id)[0] && owns(learner, id));
}

/** The tenses worth racing: taught, with the calm record to say the forms are there. */
export function armedTenses(learner: Learner, events: readonly ReviewEvent[]): TenseKey[] {
  const taught = new Set(taughtTenses(learner));
  return PICKER_TENSES.filter((t) => {
    if (!taught.has(t)) return false;
    const node = tenseNode(learner, t);
    if (!node) return false;
    const r = calmRecord(events, node);
    return r.n >= CALM_OF && r.right >= CALM_RIGHT;
  });
}

/** The decks that are open now, in the order they are offered. Nothing is listed that is not open. */
export function openDecks(learner: Learner, bundle: Bundle, events?: readonly ReviewEvent[]): FlashDeck[] {
  const out: FlashDeck[] = [];
  // the event log is copied whole to be read, so it is only asked for once there is a deck it could open
  if (ownedVerbs(learner).length >= MIN_VERBS) {
    for (const t of armedTenses(learner, events ?? learner.events())) out.push({ id: t, title: tenseShort(t), kind: 'forms', tense: t });
  }
  if (ownedWords(learner, bundle).length >= MIN_WORDS) out.push({ id: WORDS_DECK, title: 'Words', kind: 'words' });
  return out;
}

// ---------------------------------------------------------------- dealing

export interface FlashItem {
  kind: Kind;
  key: string;
  /** what was asked, apart from how it was dressed: the same id twice in a row is the same question */
  id: string;
  /** the node an answer is about, and everything the item showed that the learner owns */
  target: NodeId;
  credit: NodeId[];
  /** which way it was asked: Spanish given to be understood is receptive, Spanish to find or type is productive */
  direction: Direction;
  /** the form asked for (tense and person), to keep count of the ones that slip */
  cell?: string;
  card: TypeCard | McqCard;
  /** typed: whether this text is the form, the form with the accents wrong, or neither */
  match?: (input: string) => 'right' | 'near' | 'no';
  /** what the correction shows, and the language it is in */
  answer: string;
  answerLang: Lang;
  /** what the learner was asked, in a line, for the list of what slipped */
  cue: string;
  cueLang: Lang;
}

/** The weight of a form in the deal: the ones missed more often come up more often, never more than four times as much. */
export function weightOf(c: CellRow | undefined): number {
  return c && c.n >= 3 ? 1 + 3 * (c.miss / c.n) : 1;
}

/** A form to ask: a verb the learner owns, the deck's tense, and a person, never the same cue twice in a row. */
export function dealForm(verbs: readonly Verb[], tense: TenseKey, cells: Readonly<Record<string, CellRow>>, rng: Rng, last: string, key: string, learner: Learner): FlashItem | undefined {
  const people: readonly string[] = tense === 'imperativo' || tense === 'impneg' ? PRODUCTION_IMP_PERSONS : PRODUCTION_PERSONS;
  const weights = people.map((p) => weightOf(Object.hasOwn(cells, `${tense}|${p}`) ? cells[`${tense}|${p}`] : undefined));
  const total = weights.reduce((a, b) => a + b, 0);
  for (let tries = 0; tries < 30; tries++) {
    const verb = verbs[Math.floor(rng() * verbs.length)];
    let at = rng() * total, p = 0;
    while (p < people.length - 1 && at >= weights[p]) { at -= weights[p]; p++; }
    const idx = personsFor(tense).indexOf(people[p] as never);
    const cue = `${verb.inf}|${tense}|${idx}`;
    const answers = idx >= 0 ? acceptedForms(verb, tense, idx).filter(Boolean) : [];
    if (!answers.length || (cue === last && tries < 29)) continue;
    const card = conjugationCard(key, verb, tense, idx);
    const tenseOf = tenseNode(learner, tense);
    const target = tenseOf ?? `l:${verb.inf}`;
    return {
      kind: 'type', key, id: cue, target, credit: [...new Set([target, `l:${verb.inf}`])].filter((n) => learner.isIntroduced(n)), direction: 'productive', cell: `${tense}|${people[p]}`, card,
      match: (input) => { const r = checkExact(input, answers); return r.pass ? 'right' : r.near ? 'near' : 'no'; },
      answer: card.check(answers[0]).answer, answerLang: 'es', cue: card.sub?.text ?? card.prompt?.text ?? cue, cueLang: card.sub?.lang ?? 'en',
    };
  }
  return undefined;
}

/** A word to ask as a choice of four, either way round. Undefined when the course gives it too few neighbours. */
export function dealWord(bundle: Bundle, node: NodeId, rng: Rng, key: string): FlashItem | undefined {
  const side = rng() < 0.5 ? 'es' : 'en';
  const card = wordChoice(bundle, node, key, side);
  if (!card) return undefined;
  const right = card.options[card.answer];
  return { kind: 'choose', key, id: node, target: node, credit: [node], direction: side === 'en' ? 'receptive' : 'productive', card, answer: right.text, answerLang: right.lang, cue: card.prompt?.text ?? right.text, cueLang: card.prompt?.lang ?? 'en' };
}

// ---------------------------------------------------------------- a round

export interface FlashDeps {
  learner: Learner;
  bundle: Bundle;
  rng: Rng;
  now: () => number;
  deck: FlashDeck;
  /** how often each form has been missed before, to deal the ones that slip */
  cells?: Readonly<Record<string, CellRow>>;
}

/** What a round came to. */
export interface FlashResult {
  deck: string;
  score: number;
  wrong: number;
  skipped: number;
  best: BestResult;
  /** what slipped, each once: what was asked and the right answer, newest first, at most five */
  missed: Array<{ cue: string; cueLang: Lang; answer: string; answerLang: Lang }>;
  /** the verbs of the forms that slipped, and the words that did, to practise them */
  verbs: string[];
  words: NodeId[];
  /** the scores of the rounds before this one in this deck, oldest first, the last few */
  before: number[];
  /** the form missed most this round, when it was missed more than once */
  slipped?: { cell: string; times: number };
}

export class FlashGame {
  state: RoundState;
  item: FlashItem | undefined;
  /** the correction on screen, while the clock is stopped */
  correction?: { how: 'wrong' | 'skip'; answer: string; answerLang: Lang; picked?: number; given?: string };
  /** the last text refused for its accents, so the screen can say so without a penalty */
  hint?: string;
  private seq = 0;
  private last = '';
  private pool: NodeId[] = [];
  private poolAt = 0;
  private verbs: Verb[] = [];
  private readonly cells: Record<string, CellRow> = {};
  private readonly missed: Array<{ cue: string; cueLang: Lang; answer: string; answerLang: Lang; cell?: string; verb?: string; word?: NodeId }> = [];
  private finished?: Promise<FlashResult | undefined>;

  constructor(private readonly d: FlashDeps) {
    this.state = startRound(d.now());
    if (d.deck.kind === 'forms') this.verbs = ownedVerbs(d.learner);
    else this.pool = this.shuffled(ownedWords(d.learner, d.bundle));
    this.item = this.deal();
  }

  get over(): boolean { return this.state.over || !this.item; }
  get left(): number { return secondsLeft(this.state); }

  private shuffled(xs: NodeId[]): NodeId[] {
    const out = xs.slice();
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(this.d.rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }

  private deal(): FlashItem | undefined {
    const key = `flash:${++this.seq}`;
    if (this.d.deck.kind === 'forms') {
      const it = dealForm(this.verbs, this.d.deck.tense!, this.d.cells ?? {}, this.d.rng, this.last, key, this.d.learner);
      if (it) this.last = it.id;
      return it;
    }
    // each word once before any comes round again; a word the course cannot make a choice of is passed over
    for (let tries = 0; tries < this.pool.length; tries++) {
      const node = this.pool[this.poolAt++ % this.pool.length];
      const it = dealWord(this.d.bundle, node, this.d.rng, `${key}:${node}`);
      if (it) return it;
    }
    return undefined;
  }

  /** Bring the clock up to now. */
  tick(): RoundState { return (this.state = step(this.state, { t: 'tick', at: this.d.now() })); }

  /** Every change to the typed text: the form, once it is typed, is the answer, with no Enter. */
  typed(input: string): boolean {
    const it = this.item;
    if (!it || it.kind !== 'type' || this.state.over || this.state.paused) return false;
    this.hint = undefined;
    if (it.match!(input) !== 'right') return false;
    this.settle(true);
    return true;
  }

  /** Enter on a typed form that is not there yet. Accents are strict, and an accent slip is told so and costs nothing. */
  submit(input: string): 'right' | 'near' | 'wrong' | 'empty' | 'ignored' {
    const it = this.item;
    if (!it || it.kind !== 'type' || this.state.over || this.state.paused) return 'ignored';
    if (!input.trim()) return 'empty';
    const m = it.match!(input);
    if (m === 'right') { this.settle(true); return 'right'; }
    if (m === 'near') { this.hint = 'Check the accents.'; this.tick(); return 'near'; }
    this.settle(false, { how: 'wrong', answer: it.answer, answerLang: it.answerLang, given: input });
    return 'wrong';
  }

  /** A tap on one of the four. */
  choose(picked: number): boolean {
    const it = this.item;
    if (!it || it.kind !== 'choose' || this.state.over || this.state.paused) return false;
    const card = it.card as McqCard;
    if (picked === card.answer) { this.settle(true); return true; }
    this.settle(false, { how: 'wrong', answer: it.answer, answerLang: it.answerLang, picked });
    return false;
  }

  /** "I don't know": cheaper than a wrong answer, and the answer is shown. */
  pass(): void {
    const it = this.item;
    if (!it || this.state.over || this.state.paused) return;
    this.settle(false, { how: 'skip', answer: it.answer, answerLang: it.answerLang });
  }

  /** The correction has been read: on to the next item, and the clock runs again. */
  resume(): void {
    if (!this.state.paused || this.state.over) return;
    this.state = step(this.state, { t: 'resume', at: this.d.now() });
    this.correction = undefined;
    this.hint = undefined;
    this.item = this.deal();
  }

  private settle(right: boolean, correction?: NonNullable<FlashGame['correction']>): void {
    const it = this.item!;
    const at = this.d.now();
    const was = this.state;
    this.state = step(this.state, right ? { t: 'right', at } : correction!.how === 'skip' ? { t: 'skip', at } : { t: 'wrong', at, kind: it.kind });
    // an answer the clock had already run out on is not an answer, and nothing is credited for it
    if (this.state.right === was.right && this.state.wrong === was.wrong && this.state.skipped === was.skipped) return;
    creditFlash(this.d.learner, { target: it.target, credit: it.credit, right, at, direction: it.direction });
    if (it.cell) {
      const c = (this.cells[it.cell] ??= { n: 0, miss: 0 });
      c.n += 1;
      if (!right) c.miss += 1;
    }
    if (right) { this.hint = undefined; this.item = this.state.over ? this.item : this.deal(); return; }
    this.missed.unshift({ cue: it.cue, cueLang: it.cueLang, answer: it.answer, answerLang: it.answerLang, ...(it.cell ? { cell: it.cell, verb: it.id.split('|')[0] } : { word: it.target }) });
    this.correction = correction;
  }

  /** What slipped most this round: a form missed more than once. */
  private slipped(): FlashResult['slipped'] {
    const counts = new Map<string, number>();
    for (const m of this.missed) if (m.cell) counts.set(m.cell, (counts.get(m.cell) ?? 0) + 1);
    const top = [...counts].sort((a, b) => b[1] - a[1])[0];
    return top && top[1] > 1 ? { cell: top[0], times: top[1] } : undefined;
  }

  /** Keep the round and its best, once. Resolves to what it came to, or undefined if it never ran. */
  finish(games: GamesStore): Promise<FlashResult | undefined> {
    return (this.finished ??= (async () => {
      this.tick();
      const answered = this.state.right + this.state.wrong + this.state.skipped;
      if (!answered) return undefined;
      const score = scoreOf(this.state);
      const before = (await games.read()).rounds.filter((r) => r.game === 'flash' && r.deck === this.d.deck.id).map((r) => r.score).slice(-5);
      const row = { at: this.d.now(), game: 'flash' as const, deck: this.d.deck.id, score, wrong: this.state.wrong, skipped: this.state.skipped };
      const best = (await games.finishRound(row, flashKey(this.d.deck.id), this.cells)) ?? { isBest: false };
      const seen = new Set<string>();
      const once = this.missed.filter((m) => !seen.has(m.cue) && !!seen.add(m.cue));
      const missed = once.slice(0, 5).map(({ cue, cueLang, answer, answerLang }) => ({ cue, cueLang, answer, answerLang }));
      const verbs = [...new Set(once.flatMap((m) => (m.verb ? [m.verb] : [])))].slice(0, 6);
      const words = [...new Set(once.flatMap((m) => (m.word ? [m.word] : [])))].slice(0, 6);
      const slipped = this.slipped();
      return { deck: this.d.deck.id, score, wrong: this.state.wrong, skipped: this.state.skipped, best, missed, verbs, words, before, ...(slipped ? { slipped } : {}) };
    })());
  }
}
