// "Answer for yourself" is only asked of a question a learner can answer for themselves (askedOfYou): the compiler picks
// those for the communicative block, so the card does not have to turn the others into some other kind of card (H8, M3).
import { describe, expect, test } from 'vitest';
import type { SessionPlan } from '../../src/compiler';
import { askedOfYou } from '../../src/exercises/addressee';
import { isMultiTurn, turnView } from '../../src/exercises/dialogue';
import { namesOf, placesOf } from '../../src/exercises/licence';
import { PROFILES } from '../../tools/sim/profiles';
import { simulateProfile } from '../../tools/sim/run';
import { realCourse } from './helpers';

describe('the communicative block asks what a learner can answer', () => {
  const real = realCourse(10);
  const names = namesOf(real.bank), places = placesOf(real.bank);
  const row = new Map(real.bank.map((s) => [s.id, s]));
  /** the question the card puts to the learner: a dialogue's first turn, else the row */
  const asked = (id: string) => {
    const s = row.get(id)!;
    return (isMultiTurn(s) ? turnView(s, 0)?.sentence.es : s.es) ?? '';
  };

  test('every respond item of every plan is a question put to the learner, alone', () => {
    const plans: SessionPlan[] = [];
    for (const name of ['fast', 'average'] as const) {
      simulateProfile(PROFILES[name], { days: 140, tier: 'standard', course: real.course, content: real.content, seed: 1, onPlan: (p) => plans.push(p) });
    }
    const respond = plans.flatMap((p) => p.blocks.flatMap((b) => (b.kind === 'communicative' ? b.items.filter((i) => i.op === 'respond') : [])));
    expect(respond.length).toBeGreaterThan(20);
    const bad = respond.filter((i) => !askedOfYou(asked(i.sentence), names, places)).map((i) => `${i.sentence}: ${asked(i.sentence)}`);
    expect(bad.slice(0, 8)).toEqual([]);
  });

  test('a question to a character, a group, or about the story is not picked, though the block then has fewer', () => {
    const questions = [...real.content.sentences.values()].filter((s) => s.question);
    const own = questions.filter((s) => s.own);
    expect(own.length).toBeGreaterThan(30);
    expect(own.length).toBeLessThan(questions.length);
    for (const s of own.slice(0, 200)) expect(askedOfYou(asked(s.id), names, places), s.id).toBe(true);
    for (const s of questions.filter((q) => !q.own).slice(0, 200)) expect(askedOfYou(asked(s.id), names, places), s.id).toBe(false);
  });
});
