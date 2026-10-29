// One component per block kind. The switch is exhaustive: a new block kind
// in compiler/types.ts fails the type check here until it has a screen.
import type { Block } from '../../compiler';
import { PracticeRun, ReviewRun, TimedRecall } from './practice';
import { ReadChapter } from './read';
import { ScenePlay } from './scene';
import { Learn, Personal, RuleRecall, Teach } from './teach';
import type { BlockProps } from './types';
import { SelfCheck, Writing } from './writing';

export function BlockView(p: BlockProps<Exclude<Block, { kind: 'close' }>>) {
  const b = p.block;
  switch (b.kind) {
    case 'warmup': case 'leech': return <ReviewRun {...p} block={b} />;
    case 'learn': return <Learn {...p} block={b} />;
    case 'teach': return <Teach {...p} block={b} />;
    case 'ruleRecall': return <RuleRecall {...p} block={b} />;
    case 'structuredInput': case 'controlledOutput': case 'cuedProduction': case 'communicative':
    case 'remix': case 'readingCheck': case 'extraReading':
      return <PracticeRun {...p} block={b} />;
    case 'read': case 'reread': return <ReadChapter {...p} block={b} />;
    case 'personal': return <Personal {...p} block={b} />;
    case 'scene': case 'sceneRerun': return <ScenePlay {...p} block={b} />;
    case 'writing': return <Writing {...p} block={b} />;
    case 'selfCheck': return <SelfCheck {...p} block={b} />;
    case 'timedRecall': return <TimedRecall {...p} block={b} />;
    default: {
      const never: never = b;
      return never;
    }
  }
}

export type { BlockProps };
