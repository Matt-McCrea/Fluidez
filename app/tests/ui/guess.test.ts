// The Guess Test (audit F8, item 5), over real generated sessions: a learner placed at six points of the real
// course plays four days, and every choice card they meet is answered by someone who cannot read Spanish. Tapping
// the longest option, the shortest, the first, or the option that has the name in the prompt must score what chance
// scores, and no option may stand out by holding a name or a "(polite)" tag that the others lack.
//
// What the app builds is held to that. What a person wrote is measured beside it: the picks in a lesson script are
// held to it too (the app serves the ones that do not give themselves away where it chooses), but the chapter
// questions are not near chance (the right option is the longest 68 to 83% of the time by band, against 25%;
// 04-vocabulary-reading R5). That is authored, it needs a person to write the wrong options again, and the gate
// says where. The ceilings at the bottom only keep it from getting worse until then.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { longestShare } from '../../src/exercises/neighbours';
import { MEANS } from '../../src/ui/session/cards';
import { choiceCardsAt, type Seen } from './guess-world';
import { chance, first, longest, mean, nameMatch, noStrangers, sameWords, shortest, standsOut } from './guess-play';

/** How far above chance a strategy may score. About three standard errors over the cards sampled. */
const NEAR = 0.08;
const POINTS = [0, 8, 20, 32, 45, 58];
const DAYS = 4;

const seen: Seen[] = [];
let names: ReadonlySet<string> = new Set();
beforeAll(async () => {
  const all = new Set<string>();
  for (const unit of POINTS) {
    const r = await choiceCardsAt(unit, DAYS);
    seen.push(...r.seen);
    for (const n of r.names) all.add(n);
  }
  names = all;
}, 600_000);

const made = () => seen.filter((s) => s.source === 'made').map((s) => s.card);

describe('choice cards the app builds', () => {
  it('has enough of them to say anything', () => {
    expect(made().length).toBeGreaterThan(300);
  });

  for (const [label, play] of [['the longest option', longest], ['the shortest option', shortest], ['the first option', first]] as const) {
    it(`tapping ${label} scores near chance`, () => {
      const got = mean(made().map(play));
      const base = mean(made().map(chance));
      expect(got, `${label}: ${got.toFixed(3)} against chance ${base.toFixed(3)}`).toBeLessThanOrEqual(base + NEAR);
    });
  }

  it('tapping the longest option scores near chance in the upper half of the course too, where the audit measured it', () => {
    const upper = seen.filter((s) => s.source === 'made' && s.unit >= 32).map((s) => s.card);
    const got = mean(upper.map(longest));
    const base = mean(upper.map(chance));
    expect(got, `upper: ${got.toFixed(3)} against chance ${base.toFixed(3)} on ${upper.length} cards`).toBeLessThanOrEqual(base + NEAR + 0.02);
  });

  it('tapping the option with the name in the prompt scores near chance', () => {
    const named = made().filter((c) => nameMatch(c, names) !== null);
    expect(named.length).toBeGreaterThan(20);
    const got = mean(named.map((c) => nameMatch(c, names)!));
    const base = mean(named.map(chance));
    expect(got, `name match: ${got.toFixed(3)} against chance ${base.toFixed(3)} on ${named.length} cards`).toBeLessThanOrEqual(base + NEAR);
  });

  it('rules nothing out for holding a name the prompt lacks', () => {
    const named = made().filter((c) => noStrangers(c, names) !== null);
    const got = mean(named.map((c) => noStrangers(c, names)!));
    const base = mean(named.map(chance));
    expect(got, `no strangers: ${got.toFixed(3)} against chance ${base.toFixed(3)} on ${named.length} cards`).toBeLessThanOrEqual(base + NEAR);
  });

  it('solves no sentence by the word or the number it shares with the prompt', () => {
    // a word written alike in both languages (el hotel, la cumbia) is the same word: no option beside it can make it Spanish. A gap of forms shares a stem by design.
    const asked = made().filter((c) => (c.ask === MEANS || c.ask === 'Which one says this?') && (c.prompt?.text ?? '').split(/\s+/).length > 2);
    expect(asked.length).toBeGreaterThan(100);
    expect(asked.filter((c) => sameWords(c) === 1).map((c) => `${c.prompt?.text} -> ${c.options.map((o) => o.text).join(' | ')}`)).toEqual([]);
  });

  it('leaves no option standing out by a name or a tag the others lack', () => {
    const out = made().filter((c) => standsOut(c, names)).map((c) => `${standsOut(c, names)}: ${c.prompt?.text} -> ${c.options.map((o) => o.text).join(' | ')}`);
    expect(out).toEqual([]);
  });
});

describe('choice cards a person wrote', () => {
  it('the script picks a session serves score near chance on the longest option', () => {
    const script = seen.filter((s) => s.source === 'script').map((s) => s.card);
    expect(script.length).toBeGreaterThan(100);
    const got = mean(script.map(longest));
    const base = mean(script.map(chance));
    expect(got, `script: ${got.toFixed(3)} against chance ${base.toFixed(3)} on ${script.length} cards`).toBeLessThanOrEqual(base + NEAR + 0.04);
  });

  it('the chapter questions are measured, and no worse than they are', () => {
    const content = join(__dirname, '../../content');
    const band = new Map<string, string>();
    for (const f of readdirSync(join(content, 'units')).filter((x) => /^u\d+\.json$/.test(x))) {
      const u = JSON.parse(readFileSync(join(content, 'units', f), 'utf8')) as { id: string; band: string };
      band.set(u.id, u.band);
    }
    const tally = new Map<string, { n: number; got: number }>();
    for (const f of readdirSync(join(content, 'story')).filter((x) => /^ch\d+\.json$/.test(x))) {
      const ch = JSON.parse(readFileSync(join(content, 'story', f), 'utf8')) as { unit: string; questions: Array<{ options?: string[]; answer: number | string }>; rereadQuestions?: Array<{ options?: string[]; answer: number | string }> };
      const t = tally.get(band.get(ch.unit) ?? '?') ?? { n: 0, got: 0 };
      for (const q of [...ch.questions, ...(ch.rereadQuestions ?? [])]) {
        if (!q.options || typeof q.answer !== 'number') continue;
        t.n++;
        t.got += longestShare(q.options, q.answer);
      }
      tally.set(band.get(ch.unit) ?? '?', t);
    }
    // measured on 2 Nov 2026: A1 0.68, A2 0.73, B1 0.79, B2 0.83, C1 0.83; a ceiling only comes down when the questions are rewritten
    const CEILING: Record<string, number> = { A1: 0.7, A2: 0.75, B1: 0.81, B2: 0.85, C1: 0.85 };
    for (const [b, ceiling] of Object.entries(CEILING)) {
      const t = tally.get(b)!;
      expect(t.n, b).toBeGreaterThan(200);
      expect(t.got / t.n, `${b} chapter questions: tapping the longest option is right ${(100 * t.got / t.n).toFixed(0)}% of the time`).toBeLessThanOrEqual(ceiling);
    }
  });
});
