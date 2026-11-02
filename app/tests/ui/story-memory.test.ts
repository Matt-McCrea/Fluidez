// The story keeps what the learner has read across a fresh open, and tells a learner who joins it part
// way through where it stands (audit C4, F8). The library lists the whole story, so none of this depends
// on which units the tab happened to load. No DOM here: the screens are drawn the way the framework would
// (hooks keep their values between renders, effects do not run).
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Learner } from '../../src/learner';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { bringChapter } from '../../src/ui/data/prepare';
import { StoryCard } from '../../src/ui/screens/home';
import { sessionLabel } from '../../src/ui/session/labels';
import { ReadChapter } from '../../src/ui/blocks/read';
import { Story } from '../../src/ui/screens/story';
import { CHAPTER_OFFLINE, chaptersRead, storySoFar } from '../../src/ui/session/storyline';

const h = vi.hoisted(() => ({ slots: [] as unknown[], at: 0, app: undefined as unknown }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const i = h.at++;
    if (!(i in h.slots)) h.slots[i] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [h.slots[i], (v: unknown) => { h.slots[i] = v; }];
  },
  useMemo: (f: () => unknown) => f(),
  useRef: (init: unknown) => ({ current: init }),
  useEffect: () => {},
  useContext: () => h.app,
}));

const text = (node: any): string => (node == null || typeof node === 'boolean' ? '' : typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node.props?.children));
const expand = (node: any): any => {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(expand);
  if (typeof node.type === 'function') return expand(node.type(node.props));
  return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
};

const AT = Date.UTC(2026, 9, 1, 18);
const pad = (n: number) => `ch${String(n).padStart(3, '0')}`;
const DASH = /[–—]|\s-\s/;

let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ unit: 29 }); }, 120_000);

/** A learner who read the first four chapters weeks ago; the tab was closed since, so only the window around unit 30 is loaded. */
function reader(read: number[]) {
  const learner = Learner.fresh({ now: () => AT });
  for (const n of read) learner.ledger.markSeen('chapter', pad(n), { at: AT });
  return learner;
}
const ui = (placedAt?: number): any => ({ state: { saved: [], readSeconds: {}, ...(placedAt ? { placedAt } : {}) }, path: { unit: 29, day: 0 } });

describe('chapters read, from the library', () => {
  it('are all there after a fresh open, though the window holds none of them', () => {
    const learner = reader([1, 2, 3, 4]);
    expect(bundle.chapters.has('ch001')).toBe(false);
    const read = chaptersRead(bundle.story, (id) => learner.ledger.hasSeen('chapter', id));
    expect(read.map((c) => c.id)).toEqual(['ch001', 'ch002', 'ch003', 'ch004']);
    expect(read[0].title).toBe('Hola, Bogotá');
  });

  it('are listed on the Story screen with their titles', () => {
    const learner = reader([1, 2, 3, 4]);
    h.app = { learner, bundle, ui: ui() };
    h.slots = []; h.at = 0;
    const t = text(expand(Story({})));
    for (const c of bundle.story.slice(0, 4)) expect(t, c.id).toContain(c.title);
    expect(t).not.toContain('collect here');
    expect(t).not.toContain('ch005');
  });

  it('say nothing of themselves when the learner has read none', () => {
    h.app = { learner: reader([]), bundle, ui: ui() };
    h.slots = []; h.at = 0;
    expect(text(expand(Story({})))).toContain('collect here');
  });
});

describe('Home\'s story card', () => {
  const seen = (l: Learner) => (id: string) => l.ledger.hasSeen('chapter', id);
  const card = (learner: Learner, path: { unit: number }, placedAt: number | undefined) => text(expand(StoryCard({ bundle, learner, path, placedAt, onStory: () => {} })));

  it('counts the chapters read and names the last, for a learner at unit 30 after a fresh open', () => {
    const t = card(reader([1, 2, 3, 4]), { unit: 29 }, undefined);
    expect(t).toContain('The story so far');
    expect(t).toContain('4 chapters read');
    expect(t).toContain(bundle.story[3].title);
    expect(t).toContain(bundle.story[3].hook);
    expect(t).not.toMatch(/landed|first chapter soon|starts in Bogotá/);
  });

  it('tells a learner at the beginning where the story starts, as before', () => {
    expect(card(reader([]), { unit: 0 }, undefined)).toContain('The story starts in Bogotá');
  });

  it('tells a placed learner where the story stands at their unit, in the words of the chapter before it', () => {
    const learner = reader([]);
    const first = bundle.story.find((c) => c.unit === 'u45')!;
    const before = bundle.story[bundle.story.indexOf(first) - 1];
    const t = card(learner, { unit: 44 }, 44);
    expect(t).toContain('The story so far');
    expect(t).toContain(before.hook);
    expect(t).not.toMatch(/landed|first chapter soon|starts in Bogotá/);
    expect(seen(learner)(before.id)).toBe(false);
  });

  it('shows nothing for a learner with no chapter read and nothing true to say', () => {
    expect(card(reader([]), { unit: 12 }, undefined)).toBe('');
  });
});

describe('a lesson picked up after a fresh open', () => {
  it('is named for its chapter though the tab has not loaded the chapter', () => {
    expect(bundle.chapters.has('ch150')).toBe(false);
    const plan = { type: 'input', unit: 'u47', blocks: [{ kind: 'read', chapter: 'ch150' }] } as any;
    expect(sessionLabel(plan, bundle)).toBe(`Story time: ${bundle.story.find((c) => c.id === 'ch150')!.title}`);
  });
});

describe('the story so far, going into a chapter', () => {
  const never = () => false;

  it('is the hook of the chapter before it, which is where the story stands', () => {
    const i = bundle.story.findIndex((c) => c.id === 'ch140');
    expect(storySoFar(bundle.story, 'ch140', never)).toBe(`The story so far: ${bundle.story[i - 1].hook}`);
  });

  it('is left out when the learner read that chapter, since they know', () => {
    expect(storySoFar(bundle.story, 'ch140', (id) => id === 'ch139')).toBeUndefined();
  });

  it('is left out for the first chapter, and for one the library does not know', () => {
    expect(storySoFar(bundle.story, 'ch001', never)).toBeUndefined();
    expect(storySoFar(bundle.story, 'ch999', never)).toBeUndefined();
  });

  it('is real chapter metadata, for every chapter, and carries no dash', () => {
    const lines = bundle.story.slice(1).map((c) => storySoFar(bundle.story, c.id, never)!);
    expect(lines.every((l) => l.startsWith('The story so far: ') && l.length > 40)).toBe(true);
    expect(lines.filter((l) => DASH.test(l))).toEqual([]);
  });
});

describe('the chapter on the reading screen', () => {
  const screen = (learner: Learner, chapter: string, b = bundle) => {
    h.slots = []; h.at = 0;
    const run: any = { bundle: b, learner, reads: new Map(), expose: () => {}, addWords: async () => {} };
    return expand(ReadChapter({ block: { kind: 'read', part: 'core', deliberate: false, chapter, questions: 5, minutes: 4 } as any, run, ui: ui(), onDone: () => {} }));
  };

  it('opens a placed learner\'s first chapter with where the story stands', async () => {
    const b = await new ContentLoader().load({ unit: 44 });
    expect(b.chapters.has('ch140')).toBe(true);
    const t = text(screen(reader([]), 'ch140', b));
    const prev = b.story[b.story.findIndex((c) => c.id === 'ch140') - 1];
    expect(t).toContain(`The story so far: ${prev.hook}`);
  }, 120_000);

  it('says nothing extra to a learner who read the chapter before it', async () => {
    const b = await new ContentLoader().load({ unit: 44 });
    const t = text(screen(reader([139]), 'ch140', b));
    expect(t).not.toContain('The story so far');
  }, 120_000);

  it('says so when the chapter is not here and cannot be got, instead of showing a blank page', async () => {
    const files = { ...(await import('../../src/ui/data/loader')).CONTENT_FILES };
    files.story = Object.fromEntries(Object.keys(files.story).map((p) => [p, async () => { throw new Error('net::ERR_FAILED'); }]));
    const b = await new ContentLoader(files).load({ unit: 29 });
    expect(await bringChapter(b, 'ch150')).toBe('lacking');
    h.slots = ['read', 0, 0, 'lacking']; h.at = 0;
    const run: any = { bundle: b, learner: reader([]), reads: new Map() };
    const t = text(expand(ReadChapter({ block: { kind: 'read', part: 'core', deliberate: false, chapter: 'ch150', questions: 5, minutes: 4 } as any, run, ui: ui(), onDone: () => {} })));
    expect(t).toContain(CHAPTER_OFFLINE);
  }, 120_000);
});

describe('a chapter that is not in hand', () => {
  it('is fetched when it is opened', async () => {
    const b = await new ContentLoader().load({ unit: 29 });
    expect(b.chapters.has('ch001')).toBe(false);
    expect(await bringChapter(b, 'ch001')).toBe('ready');
    expect(b.chapters.has('ch001')).toBe(true);
  }, 120_000);

  it('is lacking, not blank, when this device cannot get it', async () => {
    const files = { ...(await import('../../src/ui/data/loader')).CONTENT_FILES };
    files.story = Object.fromEntries(Object.keys(files.story).map((p) => [p, async () => { throw new Error('net::ERR_FAILED'); }]));
    const b = await new ContentLoader(files).load({ unit: 29 });
    expect(await bringChapter(b, 'ch001')).toBe('lacking');
    expect(b.chapters.has('ch001')).toBe(false);
  }, 120_000);
});
