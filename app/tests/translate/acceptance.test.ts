// The audit's batteries as one regression file. Four batteries of right answers (paraphrases.ts: 03, 05, 07 and the
// 33 correct answers of 02) and one of typical wrong ones (wrong-answers.ts), all through the real matcher with no
// help but each row's own accept list. Acceptance may rise and never fall; no wrong answer may pass, whatever the
// engine learns to accept; and a call costs milliseconds.
//
// The engine alone does not reach the end of the first list. What is left is other words for a thing (Hay que
// esperar and Tenemos que esperar), a subject after its verb, two phrases after a verb, a different construction:
// sentences that need an `accept` written for them, which is the sidecar's job (content/accept/uNN.json), sized by
// what this file still fails.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { expandAccepted, matchTranslation } from '../../src/check/translate';
import { PARAPHRASES, type Alt } from './paraphrases';
import { WRONG } from './wrong-answers';

const check = (a: { es: string; en: string; accept?: string[]; input: string }) =>
  matchTranslation(a.input, { es: a.es, en: a.en, accept: a.accept ?? [] }, { accents: 'lenient' });

/** What the matcher accepted of each source before the engine (F5): the floor acceptance has risen from. */
const BEFORE: Record<Alt['src'], number> = { '03': 9, '05': 9, '07': 1, '02': 0 };

describe('right answers: acceptance rises', () => {
  const taken = PARAPHRASES.filter((a) => a.ok);

  test.each(taken.map((a) => [a.src, a.cat ?? '', a.input, a] as const))('%s %s: %s', (_s, _c, _i, a) => {
    const r = check(a);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test('each source takes more than it did, and the whole takes at least twice as many', () => {
    const got: Record<string, number> = {};
    for (const a of PARAPHRASES) if (check(a).pass) got[a.src] = (got[a.src] ?? 0) + 1;
    for (const src of Object.keys(BEFORE) as Array<Alt['src']>) expect(got[src] ?? 0, src).toBeGreaterThanOrEqual(BEFORE[src]);
    const was = Object.values(BEFORE).reduce((s, n) => s + n, 0), now = Object.values(got).reduce((s, n) => s + n, 0);
    expect(PARAPHRASES.length).toBe(192);
    expect(now, `${now} of ${PARAPHRASES.length}, was ${was}`).toBeGreaterThanOrEqual(2 * was);
  });

  test('what is still refused is refused without a reason that is false', () => {
    const false_reason = /isn't the word here|check the meaning|xnum|spelling/;
    for (const a of PARAPHRASES.filter((x) => !x.ok)) {
      const r = check(a);
      if (!r.pass) expect(r.hint ?? '', `${a.es} / ${a.input}`).not.toMatch(false_reason);
    }
  });

  test('a right answer is not read as a slip of the accents it did not make', () => {
    for (const a of PARAPHRASES.filter((x) => x.ok)) expect(check(a).near, a.input).toBeFalsy();
  });
});

describe('wrong answers: no false accepts', () => {
  const all = WRONG.flatMap((w) => w.bad.map((input) => ({ tag: w.tag, es: w.es, en: w.en, accept: w.accept, input })));

  test('the battery is the contrastive review\'s, less the answers that are right', () => {
    expect(all.length).toBe(264);
  });

  test.each(all.map((a) => [a.tag, a.es, a.input, a] as const))('%s: "%s" is not "%s"', (_t, _e, _i, a) => {
    const r = check(a);
    expect(r.pass, JSON.stringify(r)).toBe(false);
  });
});

describe('a call costs milliseconds', () => {
  function bankSample(n: number): Array<{ es: string; en: string; accept?: string[] }> {
    const dir = new URL('../../content/bank/', import.meta.url);
    const rows = readdirSync(dir).filter((f) => /^u\d+\.json$/.test(f))
      .flatMap((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as Array<{ es: string; en: string; accept?: string[] }>)
      .filter((r) => !/\n/.test(r.es));
    const step = Math.floor(rows.length / n);
    return rows.filter((_, i) => i % step === 0).slice(0, n);
  }

  test('expanding a bank sentence into every accepted form', () => {
    const rows = bankSample(400);
    expandAccepted({ es: 'Hola.', en: 'Hi.' });                         // load the engine's tables first
    const times = rows.map((r) => {
      const t0 = performance.now();
      expandAccepted({ es: r.es, en: r.en, accept: r.accept });
      return performance.now() - t0;
    }).sort((a, b) => a - b);
    const p95 = times[Math.floor(times.length * 0.95)];
    expect(p95, `p95 ${p95.toFixed(2)} ms`).toBeLessThan(8);
    expect(times[times.length - 1], `max ${times[times.length - 1].toFixed(1)} ms`).toBeLessThan(250);
  });

  test('both batteries through the matcher', () => {
    const t0 = performance.now();
    for (const a of PARAPHRASES) check(a);
    for (const w of WRONG) for (const input of w.bad) check({ es: w.es, en: w.en, accept: w.accept, input });
    const ms = performance.now() - t0;
    expect(ms, `${ms.toFixed(0)} ms for ${PARAPHRASES.length + 264} answers`).toBeLessThan(4000);
  });
});
