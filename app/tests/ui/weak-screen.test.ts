// The Weak spots screen lists a missed sentence once, however many nodes it
// credited or how often it was missed ("Perdón por la demora." four times).
import { describe, expect, it } from 'vitest';
import type { RecentMiss } from '../../src/learner/weak';
import { distinctMisses } from '../../src/ui/screens/weak';

const miss = (node: string, at: number, sentence?: string): RecentMiss => ({ node, label: node, op: 'type', at, ...(sentence ? { sentence } : {}) });

describe('recent misses', () => {
  it('shows a sentence once, at its newest miss', () => {
    const rows = [miss('g:a', 30, 's1'), miss('g:b', 30, 's1'), miss('g:a', 20, 's2'), miss('g:a', 10, 's1')];
    expect(distinctMisses(rows).map((m) => `${m.sentence}@${m.at}`)).toEqual(['s1@30', 's2@20']);
  });

  it('keeps misses that have no sentence, one per node', () => {
    const rows = [miss('g:a', 30), miss('g:a', 20), miss('g:b', 10)];
    expect(distinctMisses(rows).map((m) => m.node)).toEqual(['g:a', 'g:b']);
  });
});
