// A card that asks for no answer cannot grade one. A bare review (no fresh
// sentence left for a due node, and no aligned pair to ask) used to render
// "Remember this one?" with a Show English link, and Continue reported a
// correct first-try answer: a Good on a due card with no retrieval behind it.
import { beforeAll, describe, expect, it } from 'vitest';
import type { ReviewItem } from '../../src/compiler';
import { Learner, MemoryStore } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { readOutcome } from '../../src/ui/components/card';
import { reviewCard } from '../../src/ui/session/cards';
import { SessionRunner } from '../../src/ui/session/runner';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';

const DAY = 86_400_000;
let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ band: 'A1' }); }, 120_000);

const bare = (node: string, direction: ReviewItem['direction'] = 'receptive'): ReviewItem => ({
  op: 'review', id: `rv:${node}:${direction}:bare`, node, direction, scoring: 'review', credit: [node], novel: false,
});

async function world() {
  const clock = { t: new Date(2026, 9, 1, 18).getTime() };
  const now = () => clock.t;
  const learner = await Learner.open(new MemoryStore(), { now });
  const ui = await new UiStore(new MemoryKV()).load();
  const plan = { sessionIndex: 1, seed: 1, blocks: [], receptiveOnly: [], newNodes: { grammar: [], patterns: [], chunks: [], lexemes: [], contrasts: [] } } as any;
  return { clock, now, learner, ui, run: new SessionRunner(learner, bundle, ui, plan, now) };
}

describe('a read-only card is an exposure, never a grade', () => {
  it('a due grammar or pattern node with nothing to ask gets a read card, and answering it leaves the card as it was', async () => {
    const node = [...bundle.course.nodes.values()].find((n) => ['grammar', 'pattern'].includes(n.kind) && reviewCard(bare(n.id), bundle).type === 'read');
    expect(node, 'some A1 node has a bare read card').toBeTruthy();
    const w = await world();
    w.learner.introduce(node!.id, { results: [true, true, true] });
    w.clock.t += 30 * DAY;
    expect(w.learner.due(w.now()).map((d) => d.node)).toContain(node!.id);

    const item = bare(node!.id);
    const card = reviewCard(item, bundle);
    expect(card.type).toBe('read');
    const before = { card: w.learner.card(node!.id, 'receptive'), events: w.learner.events().length, exposures: w.learner.node(node!.id)!.exposures };
    w.run.score(item, readOutcome(1500));
    expect(w.learner.card(node!.id, 'receptive')).toEqual(before.card);
    expect(w.learner.events().length).toBe(before.events);
    expect(w.learner.node(node!.id)!.exposures).toBe(before.exposures + 1);
    expect(w.learner.due(w.now()).map((d) => d.node), 'still due: nothing was retrieved').toContain(node!.id);
    expect(w.run.tally).toEqual({ scored: 0, correct: 0, firstTry: 0 });
  });

  it('the outcome a read card reports says so', () => {
    expect(readOutcome(900)).toMatchObject({ correct: true, tries: 1, ms: 900, exposure: true });
  });

  it('the same outcome from a card that was asked is still graded: only read cards are exempt', async () => {
    const w = await world();
    w.learner.introduce('g:ser-identity', { results: [true, true, true] });
    w.clock.t += 30 * DAY;
    const before = w.learner.card('g:ser-identity', 'receptive')!;
    w.run.score(bare('g:ser-identity'), { correct: true, tries: 1, ms: 1500 });
    expect(w.learner.card('g:ser-identity', 'receptive')!.reps).toBe(before.reps + 1);
    expect(w.run.tally.scored).toBe(1);
  });

  it('a "Read it" card is exposure, and the close screen does not count it as an answer right first time', async () => {
    const w = await world();
    w.learner.introduce('g:ser-identity', { results: [true, true, true] });
    const before = w.learner.node('g:ser-identity')!.exposures;
    const item = { op: 'read', id: 'pr:u01-1', node: 'g:ser-identity', sentence: 'u01-1', direction: 'receptive', scoring: 'exposure', credit: ['g:ser-identity'] } as any;
    w.run.score(item, readOutcome(1200));
    expect(w.learner.node('g:ser-identity')!.exposures).toBe(before + 1);
    expect(w.run.tally).toEqual({ scored: 0, correct: 0, firstTry: 0 });
  });

  it('a read card in "Before you go" does not relearn a lapsed card either', async () => {
    const w = await world();
    w.learner.introduce('g:ser-identity', { results: [true, true, true] });
    const before = w.learner.card('g:ser-identity', 'receptive');
    w.run.scoreRecap({ id: 'recap:g:ser-identity:receptive', kind: 'lapsed', node: 'g:ser-identity', direction: 'receptive', credit: ['g:ser-identity'] }, readOutcome(900));
    expect(w.learner.card('g:ser-identity', 'receptive')).toEqual(before);
  });

  it('a read card in the learn pool is not a retrieval: no step is counted for the node', async () => {
    const w = await world();
    const done = w.run.learningStep('l:pan', readOutcome(900));
    expect(done, 'nothing to ask again').toBe(true);
    expect(w.learner.isIntroduced('l:pan'), 'shown, not answered: no record').toBe(false);
  });
});
