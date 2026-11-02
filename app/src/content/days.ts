// Stable day keys: the name a saved position keeps for a day while the course
// moves around it. A day is born with `<unit>-d<its index>` and keeps that for
// good, so reordering days, inserting one or moving one into another unit never
// changes what a learner's saved "I am on this day" means. The integer position
// the compiler walks is derived from the key (learner/reconcile.ts); a key is
// never reused for another day, whatever becomes of the one it named.
import type { Unit } from './schema';

type UnitDays = Pick<Unit, 'id' | 'days'>;

/** The key a day has: the one it declares, or, in a hand-built course that declares none, the one its place gives it. */
export function dayKeyOf(unit: UnitDays, index: number): string {
  return unit.days[index]?.key ?? `${unit.id}-d${index}`;
}

/** Where a day stands now: indexes into the course's units, and into that unit's days. */
export interface DayPlace { unit: number; day: number }

/** Every day of the course by key, units in the order given. A key that two days share names the first. */
export function dayPlaces(units: readonly UnitDays[]): Map<string, DayPlace> {
  const out = new Map<string, DayPlace>();
  units.forEach((u, unit) => u.days.forEach((_, day) => {
    const k = dayKeyOf(u, day);
    if (!out.has(k)) out.set(k, { unit, day });
  }));
  return out;
}

/** The key for a day newly added to `unit`: the number after the highest the unit was ever given (`taken`: every key any unit has had, shipped or not). */
export function nextDayKey(unit: string, taken: Iterable<string>): string {
  const prefix = `${unit}-d`;
  let top = -1;
  for (const k of taken) if (k.startsWith(prefix)) top = Math.max(top, Number(k.slice(prefix.length)) || 0);
  return `${prefix}${top + 1}`;
}
