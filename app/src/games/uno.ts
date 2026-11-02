// Uno u otro: a choice of two, on a contrast the learner has reached. It deals the contrast store's own items
// (content/contrasts), the sentence with its place left blank, and the learner taps the one that fits.
//
// A deck is one contrast and is balanced: every side of the contrast is the right answer equally often, in
// every stretch of the deal, and the right option sits in either place equally often. A deck is opened only if
// the words beside the gap and the commoner answer both lose to knowing (the Cue Test), so tapping what looks
// familiar does not pass it. Contrasts a meaning or earlier text decides are asked as the sentences to pick
// from; the ones earlier text decides run with no clock, since a minute is no way to weigh them. Near
// synonyms are never a choice of two buttons (R10), so they have no deck.
//
// It is exposure and nothing more (credit.ts): no card moves, whatever is tapped.
import { knownSet } from '../compiler';
import type { ContrastItem, NodeId } from '../content/schema';
import type { Rng } from '../exercises/rng';
import { rng as seeded, shuffle } from '../exercises/rng';
import type { Learner } from '../learner';
import type { Bundle } from '../ui/data/bundle';
import { blanked, contrastCard, contrastCredit, eligibleContrast, filled } from '../ui/session/contrast-card';
import type { Lang, McqCard } from '../ui/session/cards';
import { COMMONER_LIMIT, CUE_LIMIT, leaning, score as cueScores } from '../../tools/contrast/cue';
import { creditUno } from './credit';
import { startRound, step, secondsLeft, type RoundState } from './round';
import { unoKey, type BestResult, type GamesStore } from './store';

/** Items a deck needs before it is dealt: fewer would come round in a minute. */
export const MIN_DECK = 12;
/** Items in a round with no clock. */
export const UNTIMED_ITEMS = 12;

export interface UnoDeck {
  /** the contrast */
  id: NodeId;
  title: string;
  /** false for a contrast earlier text decides: no clock, a fixed number of items */
  timed: boolean;
  size: number;
}

const answerText = (it: ContrastItem) => it.options[it.answer];

/** The items of a contrast a choice of two can be made from: everything the sentence needs is known, two options. */
function pool(bundle: Bundle, node: NodeId, known: ReadonlySet<NodeId>): ContrastItem[] {
  return eligibleContrast(bundle, node, known).flatMap((r) => bundle.contrastItem(r.id) ?? []).filter((it) => it.options.length === 2);
}

/** Which two words an item sets against each other, and which of them is right. */
export const pairOf = (it: ContrastItem): string => it.options.map((o) => o.toLowerCase()).sort().join('|');

/** The items of a deck by the pair of words they set against each other, and in each pair by the word that is right. */
function byPair(items: readonly ContrastItem[]): Map<string, Map<string, ContrastItem[]>> {
  const out = new Map<string, Map<string, ContrastItem[]>>();
  for (const it of items) {
    const pair = out.get(pairOf(it)) ?? new Map<string, ContrastItem[]>();
    const word = answerText(it).toLowerCase();
    pair.set(word, [...(pair.get(word) ?? []), it]);
    out.set(pairOf(it), pair);
  }
  return out;
}

/**
 * The deck of a contrast: for every pair of words it sets against each other, each word is the right one equally often,
 * and the items are chosen the same way every time (so what opens a deck is what is dealt). Empty when a deck of
 * that kind would be too short to be one.
 */
export function balancedDeck(bundle: Bundle, node: NodeId, known: ReadonlySet<NodeId>): ContrastItem[] {
  const r = seeded(`uno:${node}`);
  const deck: ContrastItem[] = [];
  for (const words of byPair(pool(bundle, node, known).sort((a, b) => (a.id < b.id ? -1 : 1))).values()) {
    if (words.size < 2) continue;
    const n = Math.min(...[...words.values()].map((xs) => xs.length));
    for (const xs of words.values()) deck.push(...shuffle(xs, r).slice(0, n));
  }
  return deck.length >= MIN_DECK ? deck : [];
}

/** Whether a deck loses to a cue table and to the commoner answer, and no pair of options always has the same answer. */
export function fairDeck(deck: ContrastItem[]): boolean {
  if (!deck.length) return false;
  const s = cueScores(deck);
  return s.cue <= CUE_LIMIT && s.commoner <= COMMONER_LIMIT && !leaning(deck).some((p) => p.top === p.n || (p.n >= 4 && p.top / p.n > COMMONER_LIMIT));
}

/** The decks that are open now. Nothing is listed that is not open. */
export function openUnoDecks(learner: Learner, bundle: Bundle): UnoDeck[] {
  const known = knownSet(learner, bundle.course);
  const out: UnoDeck[] = [];
  for (const [node, file] of bundle.contrasts) {
    if (file.decides === 'synonym' || !known.has(node)) continue;
    const deck = balancedDeck(bundle, node, known);
    if (fairDeck(deck)) out.push({ id: node, title: bundle.title(node), timed: file.decides !== 'discourse', size: deck.length });
  }
  return out.sort((a, b) => (a.title < b.title ? -1 : 1));
}

// ---------------------------------------------------------------- dealing

export interface UnoItem {
  item: ContrastItem;
  card: McqCard;
  /** what the correction shows */
  answer: string;
  answerLang: Lang;
  /** what was asked, in a line, for the list of what slipped */
  cue: string;
  cueLang: Lang;
}

/**
 * The deck in the order of a round: the items go two at a time, one for each word of a pair, so after every second item
 * each word has been the right one as often as the other.
 */
export function dealOrder(deck: readonly ContrastItem[], r: Rng): ContrastItem[] {
  const couples: ContrastItem[][] = [];
  for (const words of byPair(deck).values()) {
    const lanes = [...words.values()].map((xs) => shuffle(xs, r));
    for (let i = 0; i < lanes[0].length; i++) couples.push(shuffle(lanes.map((l) => l[i]), r));
  }
  return shuffle(couples, r).flat();
}

/** The card of an item with the right option in place `at`: either place equally often over the deal. */
export function unoCard(it: ContrastItem, decides: 'local' | 'meaning' | 'discourse', key: string, at: 0 | 1): UnoItem {
  // a choice of two sentences to pick from, for what the speaker means and for what earlier text decides
  const card = contrastCard(it, decides === 'local' ? 'local' : 'meaning', { key, form: 'choose' }) as McqCard;
  const flip = card.answer !== at;
  const made: McqCard = flip ? { ...card, options: [...card.options].reverse(), answer: 1 - card.answer } : card;
  const local = decides === 'local';
  return {
    item: it, card: made,
    answer: local ? answerText(it) : filled(it, it.answer), answerLang: 'es',
    cue: local ? blanked(it) : it.en, cueLang: local ? 'es' : 'en',
  };
}

// ---------------------------------------------------------------- a round

export interface UnoDeps {
  learner: Learner;
  bundle: Bundle;
  rng: Rng;
  now: () => number;
  deck: UnoDeck;
}

export interface UnoResult {
  deck: string;
  timed: boolean;
  score: number;
  /** how many items there were, for a round with no clock */
  of?: number;
  wrong: number;
  skipped: number;
  best: BestResult;
  missed: Array<{ cue: string; cueLang: Lang; answer: string; answerLang: Lang }>;
  /** the scores of the rounds before this one in this deck, oldest first, the last few */
  before: number[];
  /** the word that was the right answer to more than one miss, in a contrast a word decides */
  slipped?: { word: string; times: number };
}

export class UnoGame {
  state: RoundState;
  item: UnoItem | undefined;
  correction?: { how: 'wrong' | 'skip'; picked?: number };
  private readonly order: ContrastItem[];
  private readonly decides: 'local' | 'meaning' | 'discourse';
  private at = 0;
  private seq = 0;
  /** items answered, in a round with no clock */
  private done = 0;
  private finished?: Promise<UnoResult | undefined>;
  private readonly missed: Array<{ cue: string; cueLang: Lang; answer: string; answerLang: Lang; word?: string; id: string }> = [];
  private readonly start: 0 | 1;

  constructor(private readonly d: UnoDeps) {
    this.state = startRound(d.now());
    const file = d.bundle.contrasts.get(d.deck.id);
    this.decides = file?.decides === 'meaning' ? 'meaning' : file?.decides === 'discourse' ? 'discourse' : 'local';
    this.order = dealOrder(balancedDeck(d.bundle, d.deck.id, knownSet(d.learner, d.bundle.course)), d.rng);
    this.start = d.rng() < 0.5 ? 0 : 1;
    this.item = this.deal();
  }

  get timed(): boolean { return this.d.deck.timed; }
  get total(): number { return Math.min(UNTIMED_ITEMS, this.order.length); }
  get right(): number { return this.state.right; }
  get left(): number { return secondsLeft(this.state); }
  get over(): boolean { return this.timed ? this.state.over || !this.item : this.done >= this.total && !this.correction || !this.item; }

  private deal(): UnoItem | undefined {
    if (!this.order.length) return undefined;
    const i = this.seq++;
    // the right option is in the first place twice, then the second twice: the side takes turns with the place, so the two are not tied
    const place = ((Math.floor(i / 2) + this.start) % 2) as 0 | 1;
    return unoCard(this.order[i % this.order.length], this.decides, `uno:${i}`, place);
  }

  tick(): RoundState { return this.timed ? (this.state = step(this.state, { t: 'tick', at: this.d.now() })) : this.state; }

  choose(picked: number): boolean {
    const it = this.item;
    if (!it || this.over || this.correction) return false;
    if (picked === it.card.answer) { this.settle(true); return true; }
    this.settle(false, { how: 'wrong', picked });
    return false;
  }

  /** "I don't know": cheaper than a wrong answer on the clock, and the answer is shown. */
  pass(): void {
    if (!this.item || this.over || this.correction) return;
    this.settle(false, { how: 'skip' });
  }

  /** The correction has been read: on to the next item, and a clock runs again. */
  resume(): void {
    if (!this.correction || (this.timed && this.state.over)) return;
    if (this.timed) this.state = step(this.state, { t: 'resume', at: this.d.now() });
    this.correction = undefined;
    this.item = this.deal();
  }

  private settle(right: boolean, correction?: NonNullable<UnoGame['correction']>): void {
    const it = this.item!;
    const at = this.d.now();
    if (this.timed) {
      const was = this.state;
      this.state = step(this.state, right ? { t: 'right', at } : correction!.how === 'skip' ? { t: 'skip', at } : { t: 'wrong', at, kind: 'choose' });
      // an answer the clock had already run out on is not an answer, and nothing is credited for it
      if (this.state.right === was.right && this.state.wrong === was.wrong && this.state.skipped === was.skipped) return;
    } else {
      this.done += 1;
      this.state = { ...this.state, right: this.state.right + (right ? 1 : 0), wrong: this.state.wrong + (!right && correction!.how === 'wrong' ? 1 : 0), skipped: this.state.skipped + (!right && correction!.how === 'skip' ? 1 : 0) };
    }
    const credit = contrastCredit(it.item).filter((n) => this.d.learner.isIntroduced(n));
    creditUno(this.d.learner, { contrast: it.item.node, credit, right, at });
    if (right) { if (this.timed ? !this.state.over : this.done < this.total) this.item = this.deal(); return; }
    this.missed.unshift({ id: it.item.id, cue: it.cue, cueLang: it.cueLang, answer: it.answer, answerLang: it.answerLang, ...(this.decides === 'local' ? { word: answerText(it.item).toLowerCase() } : {}) });
    this.correction = correction;
  }

  private slipped(): UnoResult['slipped'] {
    const counts = new Map<string, number>();
    for (const m of this.missed) if (m.word) counts.set(m.word, (counts.get(m.word) ?? 0) + 1);
    const top = [...counts].sort((a, b) => b[1] - a[1])[0];
    return top && top[1] > 1 ? { word: top[0], times: top[1] } : undefined;
  }

  /** Keep the round and its best, once. Resolves to what it came to, or undefined if nothing was answered. */
  finish(games: GamesStore): Promise<UnoResult | undefined> {
    return (this.finished ??= (async () => {
      this.tick();
      const answered = this.state.right + this.state.wrong + this.state.skipped;
      if (!answered) return undefined;
      const score = this.state.right;
      const before = (await games.read()).rounds.filter((r) => r.game === 'uno' && r.deck === this.d.deck.id).map((r) => r.score).slice(-5);
      const row = { at: this.d.now(), game: 'uno' as const, deck: this.d.deck.id, score, wrong: this.state.wrong, skipped: this.state.skipped };
      const best = (await games.finishRound(row, unoKey(this.d.deck.id))) ?? { isBest: false };
      const seen = new Set<string>();
      const once = this.missed.filter((m) => !seen.has(m.id) && !!seen.add(m.id));
      const missed = once.slice(0, 5).map(({ cue, cueLang, answer, answerLang }) => ({ cue, cueLang, answer, answerLang }));
      const slipped = this.slipped();
      return {
        deck: this.d.deck.id, timed: this.timed, score, ...(this.timed ? {} : { of: this.done }), wrong: this.state.wrong, skipped: this.state.skipped,
        best, missed, before, ...(slipped ? { slipped } : {}),
      };
    })());
  }
}
