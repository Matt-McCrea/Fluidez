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
// not on screen: the words in that sentence are not credited and it is not ledgered. A few cards more or fewer fit the minutes.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { fixtureBundle } from './driver';
import { dealt, freeplay, sessions, simulated, traceOf } from './replay';

const EXPECTED = {
  sessions: { events: 235, eventDigest: '7a4cf717388b16ea6cfdb8397de1d41b2ab826ecfc3f1e0901087938b92b95b3', memoryDigest: '2c124f819b8f1a8af4a91aea298e5b7ce14afc162934a33e4233ced281290a31' },
  dealt: { events: 181, eventDigest: 'afc58cb780e9652212aedbcd75f5c408cf6fc78a505eb4f7e72667531419c8b5', memoryDigest: '3d00e603453c232c812c53d3b88ef2fff4a45bdedc141f4e4249c7e92ddaa563' },
  freeplay: { events: 267, eventDigest: '9e8afa7baca6017f98f7f43d929dfe8a46e4f1e53d28889999bc6455095c4383', memoryDigest: '10e66f3d8a2c35699e7d9ee495574acb49c9ed2bc679ade470b821f558dd26c1' },
  average: { events: 5136, eventDigest: '88f5d23a032aa46c1563d6e3c46147af2576e00a01f0b6524752eb6d51cae4fb', memoryDigest: 'b50dce4ccdf3a3cfe0cc6ea284fe642b8c93f915d62a84593c49bac64f43b3af' },
  irregular: { events: 2942, eventDigest: '42ff7dd74cb3f650c7290ecac9dd2728bc42c064d043cc97d9c6c6ea353c23f9', memoryDigest: 'f93b6353877abd12db535244be9b0dcefa1da32564bdd69239bbf50e415b80f4' },
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
