// Learners do not choose lesson length. Settings used to offer "How much each
// day" (the essentials, the regular lesson, extra reading), saved as
// settings.tier. With the control gone, a tier an earlier build saved must not
// hold a learner to a short day with no way back, and must not break anything.
import { describe, expect, test } from 'vitest';
import { IdbStore, Learner, migrate, STATE_VERSION } from '../../src/learner';
import { MemoryKV } from '../../src/ui/store/ui';
import { clock } from './helpers';

const saved = (tier: unknown) => {
  const doc: any = Learner.fresh({ now: clock().now }).toJSON();
  doc.settings.tier = tier;
  doc.settings.retention = 0.92; // something that is still a choice, to see it survive
  return doc;
};

describe('a tier saved by an earlier build', () => {
  test.each(['minimum', 'extended', 'standard', 'something else', 7])('%s is the regular lesson, and the rest of the settings are kept', (tier) => {
    const s = migrate(saved(tier));
    expect(s.settings.tier).toBe('standard');
    expect(s.settings.retention).toBe(0.92);
    expect(s.version).toBe(STATE_VERSION);
  });

  test('opens as the regular lesson from a store too, and nothing else about the document changes', async () => {
    const kv = new MemoryKV();
    const doc = saved('minimum');
    await kv.set('state', doc);
    const L = await Learner.open(new IdbStore(kv));
    expect(L.settings.tier).toBe('standard');
    expect({ ...L.toJSON(), settings: undefined }).toEqual({ ...doc, settings: undefined });
  });
});
