// Every learner-facing name for a lesson type or a block. Internal names
// (warmup, structuredInput, drill …) never reach the screen: they are mapped
// here, in the voice of the research doc's "say this, not that" table.
import type { Block, SessionPlan } from '../../compiler';
import type { LessonType } from '../../content/schema';
import type { Bundle } from '../data/bundle';

const lc = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);

/** The one-line label of a session on the Home card ("New: saying where things are"). */
export function sessionLabel(plan: Pick<SessionPlan, 'type' | 'blocks' | 'unit' | 'converted'>, b: Bundle): string {
  const teach = plan.blocks.find((x) => x.kind === 'teach');
  const focus = plan.blocks.find((x) => 'focus' in x && x.focus) as { focus?: string } | undefined;
  const read = plan.blocks.find((x) => x.kind === 'read') as { chapter: string } | undefined;
  const scene = plan.blocks.find((x) => x.kind === 'scene') as { scene: string } | undefined;
  switch (plan.type) {
    case 'introduce': return teach && 'node' in teach ? `New: ${lc(b.title(teach.node))}` : 'New words and phrases';
    case 'drill': return focus?.focus ? `Practice: ${lc(b.title(focus.focus))}` : 'Practice what you know';
    case 'input': return read ? `Story time: ${b.chapters.get(read.chapter)?.title ?? 'the next chapter'}` : 'New words, in a story';
    case 'patterns': return 'Patterns: more ways to say it';
    case 'output': return scene ? `Real conversation: ${lc(b.scenes.get(scene.scene)?.title ?? 'a chat')}` : 'Real conversation';
    case 'review': return 'Catch-up mix';
    case 'checkpoint': return 'Check-in: see how far you\'ve come';
    case 'minimum': return 'Quick warm-up';
  }
}

export function lessonTypeWord(t: LessonType | 'minimum' | undefined): string {
  switch (t) {
    case 'introduce': return 'something new';
    case 'drill': return 'practice';
    case 'input': return 'a story';
    case 'patterns': return 'patterns';
    case 'output': return 'a real conversation';
    case 'review': return 'a catch-up mix';
    case 'checkpoint': return 'a check-in';
    case 'minimum': return 'a quick warm-up';
    default: return 'more Spanish';
  }
}

/** A block's heading and one hand-off line. */
export function blockHeading(block: Block, b: Bundle): { title: string; lead: string } {
  switch (block.kind) {
    case 'warmup':
      return block.items.length
        ? { title: 'Quick warm-up', lead: 'A few things from the last few days. Just remember them.' }
        : { title: 'Quick warm-up', lead: "Nothing to look back at yet, so let's go straight in." };
    case 'learn': return { title: 'New words and phrases', lead: 'Read each one, then you\'ll use it a few times.' };
    case 'teach': return { title: `New: ${lc(b.title(block.node))}`, lead: block.script ? '' : 'A few examples first.' };
    case 'ruleRecall': return { title: 'Remember this?', lead: 'Try it before the reminder.' };
    case 'structuredInput': return { title: 'Read and pick', lead: 'Read carefully: the small words matter.' };
    case 'controlledOutput': return { title: 'Your turn', lead: 'First choose, then type, then change it around.' };
    case 'cuedProduction': return { title: 'Use the new words', lead: 'The words from the story, in new sentences.' };
    case 'communicative': return { title: 'Talk about you', lead: 'Real questions. Answer them for yourself.' };
    case 'remix': return { title: 'Remix', lead: 'A mix of things from the last few weeks.' };
    case 'readingCheck': return { title: 'Check-in: reading', lead: 'Sentences you have not seen before.' };
    case 'extraReading': return { title: 'A little extra reading', lead: 'No questions. Just read for the meaning.' };
    case 'leech': return { title: 'The tricky ones', lead: 'The ones that keep slipping, in new sentences.' };
    case 'read': return { title: b.chapters.get(block.chapter)?.title ?? 'The story', lead: 'Tap any word you don\'t know.' };
    case 'reread':
      return block.purpose === 'notice'
        ? { title: 'Read it again', lead: 'Read it again — notice how much easier it is.' }
        : block.purpose === 'fluency'
          ? { title: 'Read it again', lead: 'Same story, a little faster. Try to beat your first time.' }
          : { title: 'A story you know', lead: 'Read it again — notice how much easier it is.' };
    case 'personal': return { title: 'Say something true', lead: 'Use what you learned today, about you.' };
    case 'scene': return { title: b.scenes.get(block.scene)?.title ?? 'Chat', lead: block.purpose === 'checkpoint' ? 'A check-in, not an exam.' : 'A real conversation. Say what you need to say.' };
    case 'sceneRerun': return { title: 'Same chat, a bit faster', lead: 'You know how it goes now. Try it against the clock.' };
    case 'writing': return { title: 'Write it', lead: block.purpose === 'checkpoint' ? 'A check-in, not an exam.' : 'A few sentences of your own.' };
    case 'selfCheck': return { title: 'How does it feel?', lead: 'Be honest. It only changes what comes back for practice.' };
    case 'timedRecall': return { title: 'Two-minute sprint', lead: 'As many as you can. Speed over perfection.' };
    case 'close': return { title: 'Done for today', lead: '' };
  }
}
