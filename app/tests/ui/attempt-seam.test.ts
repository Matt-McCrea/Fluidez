// Grading is one thing, whoever asks for it. This replays the same seeded learner through the session
// runner, free practice and the simulator, and compares every event and every card with a digest taken
// before the attempt seam was cut in. If a refactor moves a grade, a time, an exposure or a due date by
// one place, a digest here moves with it. See replay.ts for what the transcript holds.
//
// When grading is changed on purpose, take the new digests from the failing run and say why in the commit.
// 2 Nov 2026: the plans changed on purpose (contrasts taught from their scripts, the debt policy and the return plan, the first chapter before
// the lesson on day 1, the five-minute session's slice, respond items only for questions asked of the learner, recognition-only points
// receptive, misses that come back in the recap and at the start of the next session). Nothing in how an answer is graded moved: the
// same calls (gradeOf, reviewSentence, seen, climb) are made on different cards, and a miss in practice is now re-asked in the recap as
// an exposure. Later the same day: a return serves the cards likeliest still to be there and no run over misses, so the irregular learner, the one
// who goes away, is dealt different cards; the same calls again.
// Later again: the wrong options of a choice card are near neighbours with the same names in every option (a fixture bank with one
// unit and one name has none for many sentences, so those are typed, which takes longer, so a few cards fewer fit the minutes), and
// structured input that cannot make a minimal pair is the node's own read-and-pick or a typed card; the same calls on other cards.
// Later still: such a read-and-pick is not asked twice in a session and is scored on its node alone, since the sentence it stood in for was
// not on screen: the words in that sentence are not credited and it is not ledgered. A few cards more or fewer fit the minutes. And a wrong
// option holds no name or number the prompt lacks, and every word the prompt shares with the right one; the same calls on other cards.
// Later: a known contrast mixed into a drill or remix is one of its own items (shorter than a typed sentence, so more cards fit the minutes);
// the same grading calls on other cards (1ba8c36).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { fixtureBundle } from './driver';
import { dealt, freeplay, sessions, simulated, traceOf } from './replay';

const EXPECTED = {
  sessions: { events: 235, eventDigest: '31b713bf4e89df1fce9afa4553ad8623b20ec8d6468ccb862ad4812242555cec', memoryDigest: '5539493be1825b2c05a01899813b002e05363ede4cd82ed4610d14bb72075eed' },
  dealt: { events: 181, eventDigest: 'afc58cb780e9652212aedbcd75f5c408cf6fc78a505eb4f7e72667531419c8b5', memoryDigest: '3d00e603453c232c812c53d3b88ef2fff4a45bdedc141f4e4249c7e92ddaa563' },
  freeplay: { events: 267, eventDigest: 'a6412d7f21a9d177de6e8287455af3c829b9cb248e1180141cf155c97a887672', memoryDigest: '4e19a15823d2de84c19a902e876ca7bfab02fdddb6380a73636c0fc4c0f22363' },
  average: { events: 5437, eventDigest: '9870d460fbfe96e76f2264eb9bfe2674ed105ff4451a4c8e137f03690d38a8d7', memoryDigest: '5f2eee2830ee322d889e7587288cbcda80539e941b96c22af5f8c3a4f3c59edb' },
  irregular: { events: 3587, eventDigest: 'a1539d77d7158f1cde9d0e9e16aadbe2a4ecbf7f716ed5406ba7dade97bea888', memoryDigest: 'd3dee5ece18d8f3936ac6882a2200d21562f18320a1d6628d050cea384a87587' },
};

describe('grading is identical through the attempt seam', () => {
  it('the session runner: ten days, bad days among them', async () => {
    const w = await sessions(fixtureBundle());
    expect(traceOf(w.learner)).toEqual(EXPECTED.sessions);
  }, 60_000);

  it('outcomes the driver never makes: a retry pass, a lenient pass, a card that asked for nothing, evidence', async () => {
    expect(await dealt(fixtureBundle())).toEqual(EXPECTED.dealt);
  }, 60_000);

  it('free practice, of every kind, on top of those days', async () => {
    expect(freeplay(await sessions(fixtureBundle()))).toEqual(EXPECTED.freeplay);
  }, 60_000);

  it('the simulator: two profiles, sixty days each', () => {
    const got = simulated();
    expect(got.average).toEqual(EXPECTED.average);
    expect(got.irregular).toEqual(EXPECTED.irregular);
  }, 60_000);
});

// The point of a seam is that nothing goes round it. These are the learner's calls that turn an answer
// into a grade, an exposure or a ladder step; outside the learner itself, only attempt.ts may make them.
describe('only the seam credits an answer', () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => {
    const p = `${dir}/${f}`;
    return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
  const CREDIT = /\b(?:learner|L)\.(?:review|creditSentence|learningStep|stepRung|expose)\(/;

  it('has no other caller in the app or the simulator', () => {
    const files = [...walk(`${root}src`), ...walk(`${root}tools`)].filter((f) => !f.includes('/src/learner/') && !f.endsWith('/session/attempt.ts'));
    const around = files.filter((f) => readFileSync(f, 'utf8').split('\n').some((line) => CREDIT.test(line) && !/^\s*(\/\/|\*)/.test(line)));
    expect(around.map((f) => f.replace(root, ''))).toEqual([]);
  });
});
