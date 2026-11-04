// Every bank sentence is a right answer to itself.
import { readdirSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { matchTranslation } from '../../../lib/match';

/** Rows that fail for content reasons (none known); this set must not grow. */
const KNOWN_FAILURES = new Set<string>([]);

it('every bank row passes its own check', () => {
  const dir = new URL('../../../app/content/bank/', import.meta.url);
  const failed: string[] = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.json') && !n.startsWith('_'))) {
    const rows = JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as Array<{ id: string; es: string; en: string; accept?: string[] }>;
    for (const r of rows) {
      if (!matchTranslation(r.es, { es: r.es, en: r.en, accept: r.accept }).pass) failed.push(r.id);
    }
  }
  expect(failed.filter((id) => !KNOWN_FAILURES.has(id))).toEqual([]);
}, 300000);
