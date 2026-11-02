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
    // the library names a chapter this tab has not loaded (a lesson picked up after a fresh open)
    // a story day that has no chapter to read is not called one
    case 'input': return read ? `Story time: ${b.story.find((c) => c.id === read.chapter)?.title ?? 'the next chapter'}` : plan.blocks.some((x) => x.kind === 'learn') ? 'New words and phrases' : 'Practice what you know';
    case 'patterns': return 'Patterns: more ways to say it';
    case 'output': return scene ? `Real conversation: ${lc(b.scenes.get(scene.scene)?.title ?? 'a chat')}` : plan.blocks.some((x) => x.kind === 'writing') ? 'Practice: writing it down' : 'Practice what you know';
    case 'review': return plan.converted?.reason === 'offline' ? 'Review for today' : plan.converted?.reason === 'reentry' ? 'A gentle start' : 'Catch-up mix';
    case 'checkpoint': return 'Check-in: see how far you\'ve come';
    case 'minimum': return 'Quick warm-up';
  }
}

/** A unit day in plain words, for the week map on Home. */
export function dayWord(type: LessonType): string {
  switch (type) {
    case 'introduce': return 'Teach';
    case 'drill': return 'Practise';
    case 'input': return 'Story';
    case 'patterns': return 'Patterns';
    case 'output': return 'Conversation';
    case 'review': return 'Catch-up';
    case 'checkpoint': return 'Check-in';
  }
}

/** The week laid out day by day: done, today or still to come, with the grammar point under a teach day. */
export function weekMap(days: { type: LessonType; focus: string[] }[], current: number, b: Pick<Bundle, 'title'>): { word: string; state: 'done' | 'today' | 'later'; title?: string }[] {
  return days.map((d, i) => ({
    word: dayWord(d.type),
    state: i < current ? 'done' : i === current ? 'today' : 'later',
    title: d.type === 'introduce' && d.focus[0]?.startsWith('g:') ? lc(b.title(d.focus[0])) : undefined,
  }));
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
export function blockHeading(block: Block, b: Bundle, ctx?: { known?: number }): { title: string; lead: string } {
  switch (block.kind) {
    case 'warmup':
      return block.items.length
        ? { title: 'Quick warm-up', lead: 'A few things from the last few days. Just remember them.' }
        : { title: 'Quick warm-up', lead: (ctx?.known ?? 0) > 0 ? 'Nothing is due today. Straight in.' : "Nothing to look back at yet, so let's go straight in." };
    case 'learn': return { title: 'New words and phrases', lead: 'Read each one, then you\'ll use it a few times.' };
    case 'teach':
      if (block.reason === 'drill') return { title: block.parts.includes('readAndPick') ? 'Read and pick' : 'Your turn', lead: 'From the lesson, once more.' };
      // a contrast's title is already the question (tú or usted?); a return says it is one more look
      if (block.reason === 'contrast') return { title: b.title(block.node), lead: '' };
      if (block.reason === 'return') return { title: `One more look: ${lc(b.title(block.node))}`, lead: 'A few more from the lesson.' };
      return { title: `New: ${lc(b.title(block.node))}`, lead: block.script ? '' : 'A few examples first.' };
    case 'ruleRecall': return { title: 'Remember this?', lead: 'Try it before the reminder.' };
    case 'structuredInput': return { title: 'Read and pick', lead: 'Read carefully: the small words matter.' };
    case 'controlledOutput': if (block.remedial) return { title: 'Back to these', lead: 'A few you marked as shaky.' };
      return { title: 'Your turn', lead: 'First choose, then type, then change it around.' };
    case 'cuedProduction': return { title: 'Use the new words', lead: 'The words from the story, in new sentences.' };
    case 'communicative': return { title: 'Talk about you', lead: 'Real questions. Answer them for yourself.' };
    case 'remix': return { title: 'Remix', lead: 'A mix of things from the last few weeks.' };
    case 'readingCheck': return { title: 'Check-in: reading', lead: 'Sentences you have not seen before.' };
    case 'extraReading': return { title: 'A little extra reading', lead: 'No questions. Just read for the meaning.' };
    case 'leech': return { title: 'The tricky ones', lead: 'The ones that keep slipping, in new sentences.' };
    case 'read': return { title: b.chapters.get(block.chapter)?.title ?? 'The story', lead: 'Tap any word you don\'t know.' };
    case 'reread':
      return block.purpose === 'notice'
        ? { title: 'Read it again', lead: 'Read it again. Notice how much easier it is now.' }
        : block.purpose === 'fluency'
          ? { title: 'Read it again', lead: 'Same story, a little faster. Try to beat your first time.' }
          : { title: 'A story you know', lead: 'Read it again. Notice how much easier it is now.' };
    case 'personal': return { title: 'Say something true', lead: 'Use what you learned today, about you.' };
    case 'scene': return { title: b.scenes.get(block.scene)?.title ?? 'Chat', lead: block.purpose === 'checkpoint' ? 'A check-in, not an exam.' : 'A real conversation. Say what you need to say.' };
    case 'sceneRerun': return { title: 'Same chat, a bit faster', lead: 'You know how it goes now. Try it against the clock.' };
    case 'writing': return { title: 'Write it', lead: block.purpose === 'checkpoint' ? 'A check-in, not an exam.' : 'A few sentences of your own.' };
    case 'selfCheck': return { title: 'How does it feel?', lead: 'Be honest. What you mark here comes back for practice.' };
    case 'timedRecall': return { title: 'Two-minute sprint', lead: 'As many as you can. Speed over perfection.' };
    case 'recap': return { title: 'Before you go', lead: 'Once more, from today.' };
    case 'close': return { title: 'Done for today', lead: '' };
  }
}
