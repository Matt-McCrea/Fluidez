// The onboarding goal, used once: Home's session lead says when today's unit
// fits it ("Handy for your trip."). Matched on the unit's title and can-do.
import type { Goal } from '../store/ui';

const THEMES: Record<Exclude<Goal, 'me'>, { re: RegExp; line: string }> = {
  travel: { re: /\b(order|food|drink|direction|transport|travel|bus|plane|hotel|room|ticket|luggage|shop|city|road|trip)/i, line: 'Handy for your trip.' },
  work: { re: /\b(work|job|colleague|meeting|workplace|email|formal|money|bank|client|business|institutional|price)/i, line: 'Handy for work.' },
  people: { re: /\b(family|friend|people|greet|feel|plans|news|conversation|opinion|agree|advice|story|anecdote)/i, line: 'Handy for the people you care about.' },
};

export function goalLine(goal: Goal | undefined, unit: { title: string; canDo: string } | undefined): string | undefined {
  if (!goal || goal === 'me' || !unit) return undefined;
  const t = THEMES[goal];
  return t.re.test(`${unit.title} ${unit.canDo}`) ? t.line : undefined;
}
