// The games' voice. A good round gets something specific and true, said like a person, and a round with nothing to say
// gets nothing. Every remark must be one of a few forms that can be checked against the round it is said about; none
// compares the learner with a lesson, a level or anyone else, none makes a score a debt, and none has a dash in it (R22).
import { describe, expect, it } from 'vitest';
import type { FlashResult } from '../../src/games/flash';
import { bestLine, cheer, flashReaction, rereadReaction, rescueLines, rescueReaction } from '../../src/games/reactions';
import type { RescueResult } from '../../src/games/rescue';
import { SKIP_SECONDS, WRONG_SECONDS } from '../../src/games/round';
import type { BestResult } from '../../src/games/store';

const DASH = /[—–]|\s-\s/;
/** what the games must never say: a debt, a level, a rank, a lesson, a currency, applause for nothing */
const NEVER = /\b(behind|ahead|catch up|overdue|late|lost|streak|xp|coins?|gems?|hearts?|lives|unlock\w*|rank\w*|league|level\b(?! with)|week|unit|lessons?|course|stage|amazing|awesome|incredible|congrat\w*|great job|well done|you(?:'| a)re (?:a|an|so|getting|doing|improving))\b/i;

const taught = { isIntroduced: (id: string) => id === 'c:que-bien' };
const untaught = { isIntroduced: () => false };
const result = (over: Partial<FlashResult> = {}): FlashResult => ({
  deck: 'preterito', score: 12, wrong: 1, skipped: 0, best: { isBest: false }, missed: [], verbs: [], words: [], before: [], ...over,
});

const everyFlash = () => {
  const out: Array<{ r: FlashResult; remark?: string; cheer?: { es: string; en: string } }> = [];
  for (const score of [0, 3, 5, 12, 20]) for (const wrong of [0, 1, 3, 6]) for (const skipped of [0, 2])
    for (const best of [{ isBest: false }, { isBest: true }, { isBest: true, was: 9 }, { isBest: false, was: 15 }, { isBest: false, was: score }] as BestResult[])
      for (const slipped of [undefined, { cell: 'preterito|ellos', times: 2 }, { cell: 'preterito|nosotros', times: 4 }])
        for (const before of [[], [5, 8], [9, 3], [4, 4]]) for (const deck of ['preterito', 'palabras']) {
          const r = result({ score, wrong, skipped, best, before, deck, ...(slipped ? { slipped } : {}) });
          for (const t of [cheer(taught), cheer(untaught)]) { const x = flashReaction(r, t); out.push({ r, ...x }); }
        }
  return out;
};

describe('what a Relámpago round says', () => {
  const all = everyFlash();

  it('says one of a few things, each true of the round it is said about', () => {
    const seen = new Set<string>();
    for (const { r, remark } of all) {
      if (!remark) continue;
      let m: RegExpExecArray | null;
      if ((m = /^Nothing wrong, and you passed on (\d+) instead of guessing\.$/.exec(remark))) { expect(r.wrong).toBe(0); expect(r.skipped).toBe(+m[1]); seen.add('pass'); }
      else if (remark === 'Not one wrong in the whole minute.') { expect([r.wrong, r.skipped]).toEqual([0, 0]); expect(r.score).toBeGreaterThanOrEqual(5); seen.add('clean'); }
      else if ((m = /^The (\S+) form slipped (twice|three times|\d+ times)\.$/.exec(remark))) {
        expect(r.slipped!.cell.split('|')[1]).toBe(m[1]);
        expect(m[2]).toBe(r.slipped!.times === 2 ? 'twice' : r.slipped!.times === 3 ? 'three times' : `${r.slipped!.times} times`);
        seen.add('slip');
      } else if (remark === 'Three rounds in a row, each better than the last.') {
        const [a, b] = r.before.slice(-2);
        expect(a < b && b < r.score).toBe(true);
        seen.add('climb');
      } else if ((m = /^The (\d+) wrong answers took (\d+) seconds off the clock\. Passing on them would have taken ([\d.]+) seconds\.$/.exec(remark))) {
        const per = WRONG_SECONDS[r.deck === 'palabras' ? 'choose' : 'type'];
        expect(+m[1]).toBe(r.wrong);
        expect(+m[2]).toBe(r.wrong * per);
        expect(+m[3]).toBeCloseTo(r.wrong * SKIP_SECONDS, 5);
        expect(r.wrong).toBeGreaterThanOrEqual(3);
        seen.add('cost');
      } else expect.unreachable(`a remark that is none of the forms: ${remark}`);
    }
    expect([...seen].sort()).toEqual(['clean', 'climb', 'cost', 'pass', 'slip']);
  });

  it('says nothing when there is nothing specific and true to say', () => {
    const quiet = flashReaction(result({ score: 3, wrong: 1, skipped: 0, before: [2, 9] }), cheer(taught));
    expect(quiet).toEqual({});
    expect(flashReaction(result({ score: 4, wrong: 0 }), undefined)).toEqual({});
  });

  it('has no dash, and none of the things the games must not say', () => {
    for (const { remark, cheer: c } of all) {
      for (const line of [remark, c?.es, c?.en]) if (line) { expect(line).not.toMatch(DASH); expect(line).not.toMatch(NEVER); }
    }
  });

  it('the one flourish is a word the learner was taught, with what it means, after a new best or a clean minute', () => {
    expect(cheer(taught)).toEqual({ es: '¡Qué bien!', en: 'Great!' });
    expect(cheer(untaught)).toBeUndefined();
    const best = result({ best: { isBest: true, was: 9 } });
    expect(flashReaction(best, cheer(taught)).cheer).toEqual({ es: '¡Qué bien!', en: 'Great!' });
    expect(flashReaction(best, cheer(untaught)).cheer).toBeUndefined();
    expect(flashReaction(result({ wrong: 0, score: 8 }), cheer(taught)).cheer).toBeDefined();
    // a first score, or an ordinary one, has no flourish
    expect(flashReaction(result({ best: { isBest: true } }), cheer(taught)).cheer).toBeUndefined();
    expect(flashReaction(result({ best: { isBest: false, was: 15 } }), cheer(taught)).cheer).toBeUndefined();
  });
});

describe('the score against the best', () => {
  it('says only what the numbers say', () => {
    expect(bestLine(12, { isBest: true })).toBe('That is your first score here.');
    expect(bestLine(12, { isBest: true, was: 9 })).toBe('A new best. The one before was 9.');
    expect(bestLine(12, { isBest: false, was: 15 })).toBe('3 short of your best of 15.');
    expect(bestLine(12, { isBest: false, was: 12 })).toBe('Level with your best.');
    expect(bestLine(12, { isBest: false })).toBe('');
    for (const l of [bestLine(1, { isBest: true }), bestLine(1, { isBest: false, was: 9 })]) { expect(l).not.toMatch(DASH); expect(l).not.toMatch(NEVER); }
  });
});

describe('what a rescue says', () => {
  const res = (over: Partial<RescueResult> = {}): RescueResult => ({ saved: 9, of: 12, missed: 3, within: { from: 2, to: 21 }, stillDue: 0, ...over });

  it('when the saved ones come back and that the missed ones come back sooner, and nothing about how many are left to do', () => {
    expect(rescueLines(res())).toEqual(['The ones you saved are set to come back in 2 to 21 days.', 'The 3 you missed come back sooner.']);
    expect(rescueLines(res({ missed: 1, within: { from: 1, to: 1 } }))).toEqual(['The ones you saved are set to come back in a day.', 'The one you missed comes back sooner.']);
    expect(rescueLines(res({ saved: 0, missed: 12, within: undefined }))).toEqual(['The 12 you missed come back sooner.']);
  });

  it('is pleased only when every one was remembered, and says so with a count of misses that is true', () => {
    expect(rescueReaction(res({ saved: 12, missed: 0 }), cheer(taught))).toEqual({ cheer: { es: '¡Qué bien!', en: 'Great!' }, remark: 'Not one missed.' });
    expect(rescueReaction(res({ saved: 12, missed: 0 }), undefined)).toEqual({ remark: 'Not one missed.' });
    expect(rescueReaction(res(), cheer(taught))).toEqual({});
    expect(rescueReaction(res({ saved: 2, of: 2, missed: 0 }), cheer(taught))).toEqual({});
  });

  it('has no dash and nothing that makes a due card a debt', () => {
    for (const r of [res(), res({ missed: 0 }), res({ saved: 0, missed: 12, within: undefined })]) {
      for (const l of [...rescueLines(r), rescueReaction(r, cheer(taught)).remark ?? '']) { expect(l).not.toMatch(DASH); expect(l).not.toMatch(NEVER); }
    }
  });
});

describe('what a reading says', () => {
  it('only that it was faster than the last time, by how much; never that it was slower', () => {
    expect(rereadReaction({ wpm: 150, counted: true }, { isBest: true, was: 140 }, cheer(taught), 120)).toEqual({ cheer: { es: '¡Qué bien!', en: 'Great!' }, remark: '30 words a minute faster than the last time.' });
    expect(rereadReaction({ wpm: 150, counted: true }, { isBest: false, was: 160 }, cheer(taught), 120)).toEqual({ remark: '30 words a minute faster than the last time.' });
    expect(rereadReaction({ wpm: 100, counted: true }, { isBest: false, was: 160 }, cheer(taught), 120)).toEqual({});
    expect(rereadReaction({ wpm: 120, counted: true }, { isBest: false, was: 160 }, cheer(taught), 120)).toEqual({});
    expect(rereadReaction({ wpm: 150, counted: true }, { isBest: true }, cheer(taught), undefined)).toEqual({});
  });

  it('says nothing about a reading that did not count', () => {
    expect(rereadReaction({ wpm: 500, counted: false }, null, cheer(taught), 120)).toEqual({});
  });

  it('has no dash and none of the things the games must not say', () => {
    const l = rereadReaction({ wpm: 150, counted: true }, { isBest: true, was: 140 }, cheer(taught), 120).remark!;
    expect(l).not.toMatch(DASH);
    expect(l).not.toMatch(NEVER);
  });
});

describe('what the screens add', () => {
  it('never compare the learner with their lessons, and the games hold no total, level or currency', async () => {
    const { readFileSync, readdirSync } = await import('node:fs');
    const { join } = await import('node:path');
    const files = [...readdirSync(join(__dirname, '../../src/games')).map((f) => `games/${f}`), ...readdirSync(join(__dirname, '../../src/ui/games')).map((f) => `ui/games/${f}`)];
    for (const f of files) {
      const code = readFileSync(join(__dirname, '../../src', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code, f).not.toMatch(/\b(xp|coins?|gems?|hearts?|currency|totalScore|theta)\b/i);
      expect(code, f).not.toMatch(/path\.unit.*(week|ahead|behind)|behind your lessons|your lessons/i);
    }
  });
});
