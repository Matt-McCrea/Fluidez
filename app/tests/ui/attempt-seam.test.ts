// Grading is one thing, whoever asks for it. This replays the same seeded learner through the session
// runner, free practice and the simulator, and compares every event and every card with a digest taken
// before the attempt seam was cut in. If a refactor moves a grade, a time, an exposure or a due date by
// one place, a digest here moves with it. See replay.ts for what the transcript holds.
//
// When grading is changed on purpose, take the new digests from the failing run and say why in the commit.
import { describe, expect, it } from 'vitest';
import { fixtureBundle } from './driver';
import { dealt, freeplay, sessions, simulated, traceOf } from './replay';

const EXPECTED = {
  sessions: { events: 238, eventDigest: '7c15460bfd15bb96c2c9d5a01a91b5daca34d8f07ab28c0fcf205549a6c6a6ff', memoryDigest: '592b9513ba9c1cedf3728a8f02db35adcb8c948e5490851cb2cb4c23af28ef13' },
  dealt: { events: 169, eventDigest: '06350e97b96886bb9bebcf9090999f1fadc58562f8b1b1bd247fd91daa665894', memoryDigest: '1c0764ba34d49ce82ed667869380c83689c35518218d65cb0a139570d98614b1' },
  freeplay: { events: 270, eventDigest: 'f37fae44d4b9eedfa5a81e3068e6f5de1431b51d1bff96e2b754800a0c97092d', memoryDigest: 'f1d94c4ba6ad59a9ca7ba2df8fb8a8386eeda74792322a92b95c8a893f017315' },
  average: { events: 4726, eventDigest: '254afbd2088c11365ceb9bb458e61f6a6d2dd5b5bb5eb7f4e5430ccdacb2f6c8', memoryDigest: '449bae5632f6b8f58f1aba1bfe4be74b105903e0320f06bb05911ec91b02b622' },
  irregular: { events: 3351, eventDigest: '1af42e829ce0ebe0e7e5940aab4c0666b724082e1b5a8bd0e614f85b0ee163db', memoryDigest: '871a1693f8d68704b05a904f40efc558e938eefd255fe03d99102bf6714a0bef' },
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
