// Stable day keys: every day of the real course has one, no two share it, and the
// helpers read a hand-built course (no keys) by place.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { dayKeyOf, dayPlaces, nextDayKey } from '../../src/content/days';
import { DayKey, Unit } from '../../src/content/schema';

const DIR = fileURLToPath(new URL('../../content/units/', import.meta.url));
const units: Unit[] = readdirSync(DIR).filter((f) => /^u\d{2}\.json$/.test(f)).sort().map((f) => Unit.parse(JSON.parse(readFileSync(DIR + f, 'utf8'))));

describe('the real course', () => {
  it('gives every day a key', () => {
    const missing = units.flatMap((u) => u.days.map((d, i) => (d.key ? '' : `${u.id} day ${i}`)).filter(Boolean));
    expect(missing).toEqual([]);
  });

  it('keeps each key unique across the whole course, and in the form a key has', () => {
    const keys = units.flatMap((u) => u.days.map((_, i) => dayKeyOf(u, i)));
    expect(keys.length).toBeGreaterThan(400);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.filter((k) => !DayKey.safeParse(k).success)).toEqual([]);
  });

  it('numbers the days as they stood when the keys were given', () => {
    // no day had been moved by then: a key is where its day was born
    for (const u of units) u.days.forEach((d, i) => expect(d.key).toBe(`${u.id}-d${i}`));
  });
});

describe('the helpers', () => {
  const u = (id: string, keys: Array<string | undefined>): Unit => ({ id, days: keys.map((key) => ({ key, type: 'drill', focus: [], chunks: [], lexemes: [] })) }) as unknown as Unit;

  it('read a day with no key by its place', () => {
    const unit = u('u07', [undefined, undefined, undefined]);
    expect([0, 1, 2].map((i) => dayKeyOf(unit, i))).toEqual(['u07-d0', 'u07-d1', 'u07-d2']);
  });

  it('find a day wherever it has gone, including into another unit', () => {
    const places = dayPlaces([u('u01', ['u01-d1', 'u01-d0']), u('u02', ['u02-d0', 'u01-d2'])]);
    expect(places.get('u01-d0')).toEqual({ unit: 0, day: 1 });
    expect(places.get('u01-d2')).toEqual({ unit: 1, day: 1 });
    expect(places.get('u03-d0')).toBeUndefined();
  });

  it('give a new day the number after the highest its unit ever had', () => {
    expect(nextDayKey('u02', ['u02-d0', 'u02-d4', 'u01-d9'])).toBe('u02-d5');
    expect(nextDayKey('u09', ['u02-d0'])).toBe('u09-d0');
  });
});
