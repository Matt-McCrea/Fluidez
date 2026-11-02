// Train it on a contrast (F10, F11, L5): every one of the 94 works for a learner who has reached it, trains the decision
// between its sides and not whichever verb a bank sentence happens to hold, and says so honestly, with a week of the
// course and never a number that is not one, for a learner who has not. The audit's reproductions: "Train it on por or para?"
// answered "It comes up in week 165", and Train it on por and para asked for the verb in `el bus ___ por la puerta (salir)`.
import { beforeAll, describe, expect, it } from 'vitest';
import { rng } from '../../src/exercises/rng';
import { Learner, MemoryStore } from '../../src/learner';
import { weakSpots } from '../../src/learner/weak';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import type { Card } from '../../src/ui/session/cards';
import { contrastCard, filled } from '../../src/ui/session/contrast-card';
import { CONTRAST_RUN, Freeplay } from '../../src/ui/session/freeplay';
import { applyPlacement } from '../../src/ui/session/placement';

const T = new Date(2026, 9, 1, 18).getTime();
let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ unit: 0 }); }, 120_000);

/** The unit index a contrast is taught in, from the course's own map. */
const unitOf = (node: string) => bundle.course.unitStart.filter((s) => s <= bundle.course.teachPos.get(node)!).length - 1;
const contrasts = () => [...bundle.course.nodes.values()].filter((n) => n.kind === 'contrast').map((n) => n.id);

async function learnerAt(unit: number): Promise<Learner> {
  const learner = await Learner.open(new MemoryStore(), { now: () => T });
  if (unit > 0) applyPlacement(learner, bundle, unit, T);
  return learner;
}
const run = (learner: Learner, nodes: string[], seed = 'x', b = bundle) => new Freeplay({ kind: 'nodes', nodes }, { learner, bundle: b, now: () => T, rng: rng(seed) });
/** Every card of a run, each answered right. */
function play(fp: Freeplay, max = 30): Card[] {
  const out: Card[] = [];
  for (let c = fp.next(); c && out.length < max; c = fp.next()) { out.push(c); fp.answer({ correct: true, tries: 1, ms: 800 }); }
  return out;
}

describe('Train it on a contrast the learner has reached', () => {
  it('works for all 94: a run of cards that ask for an answer, and no reason given for there being none', async () => {
    const all = contrasts();
    expect(all).toHaveLength(94);
    const bad: string[] = [];
    for (const x of all) {
      const fp = run(await learnerAt(unitOf(x) + 1), [x]);
      const cards = play(fp);
      if (cards.length < CONTRAST_RUN || fp.emptyReason || cards.some((c) => c.type === 'read')) bad.push(`${x}: ${cards.length} cards, ${fp.emptyReason ?? 'no reason'}`);
    }
    expect(bad).toEqual([]);
  }, 300_000);

  it('trains the decision between its sides: every card is one of the contrast\'s own items or its script\'s, and none is a bank sentence', async () => {
    for (const x of ['x:por-para', 'x:ser-estar-adj', 'x:pret-imp', 'x:lo-le', 'x:perdon-lo-siento']) {
      const learner = await learnerAt(unitOf(x) + 1);
      const cards = play(run(learner, [x]));
      const ids = new Set(bundle.contrastItems(x).map((i) => i.id));
      const script = bundle.scripts.get(x)!;
      for (const c of cards) {
        const item = [...ids].find((id) => c.key.includes(id));
        const fromScript = !item && c.prompt && (script.readAndPick.some((r) => r.es === c.prompt!.text) || script.yourTurn.length > 0);
        expect(!!item || !!fromScript, `${x} ${c.key}`).toBe(true);
      }
      expect(cards.filter((c) => [...ids].some((id) => c.key.includes(id))).length, x).toBeGreaterThan(0);
    }
  }, 120_000);

  it('por and para: every card sets por against para, and none asks for a verb (F11: the card was `el bus ___ por la puerta cuatro (salir)`)', async () => {
    const learner = await learnerAt(unitOf('x:por-para') + 1);
    const cards: Card[] = [];
    for (const seed of ['a', 'b', 'c']) cards.push(...play(run(learner, ['x:por-para'], seed)));
    expect(cards.length).toBeGreaterThanOrEqual(CONTRAST_RUN * 3);
    for (const c of cards) {
      const shown = [c.prompt?.text, c.sub?.text, ...(c.type === 'mcq' ? c.options.map((o) => o.text) : [])].join(' | ').toLowerCase();
      // a cue verb in brackets is the verb drill the audit found
      expect(shown, c.key).not.toMatch(/\([a-záéíóúñ]+\)\s*$/);
      // what is chosen or typed is por or para: a choice has both among its options, a typed gap is one of them (or the sentence holds one)
      if (c.type === 'mcq') expect(c.options.map((o) => o.text.toLowerCase()).join(' | '), c.key).toMatch(/\bpor\b.*\bpara\b|\bpara\b.*\bpor\b|\b(por|para)\b/);
      else if (c.type === 'type') expect(c.check('por').pass || c.check('para').pass || /\b(por|para)\b/.test(shown), c.key).toBe(true);
    }
    // the choices that blank a word set por against para
    for (const c of cards.filter((x) => x.type === 'mcq' && x.ask === 'Which one fits?')) if (c.type === 'mcq') expect(c.options.map((o) => o.text.toLowerCase()).sort().join('|'), c.key).toMatch(/para/);
  }, 120_000);

  it('a choice first and typed after for a cue or a meaning; typed throughout for aspect and near-synonyms', async () => {
    const shape = async (x: string) => (play(run(await learnerAt(unitOf(x) + 1), [x]))).slice(0, 6).map((c) => c.type);
    const lo = await shape('x:lo-le');
    expect(lo.slice(0, 3)).toEqual(['mcq', 'mcq', 'mcq']);
    expect(lo.slice(3)).toEqual(['type', 'type', 'type']);
    expect(new Set(await shape('x:pret-imp'))).toEqual(new Set(['type']));
    expect(new Set(await shape('x:perdon-lo-siento'))).toEqual(new Set(['type']));
  }, 120_000);

  it('a near-synonym is typed throughout, what fills the run included: it is the file that says so, and every contrast has one', async () => {
    for (const x of ['x:molesta-vs-no-soporto', 'x:orden-escalera']) {
      expect(bundle.contrasts.get(x)?.decides, x).toBe('synonym');
      const cards = play(run(await learnerAt(unitOf(x) + 1), [x]));
      expect(cards.length, x).toBe(CONTRAST_RUN);
      expect(new Set(cards.map((c) => c.type)), x).toEqual(new Set(['type']));
    }
  }, 120_000);

  it('asks what has not been asked first, and goes round the items over runs', async () => {
    const x = 'x:ser-estar-adj';
    const learner = await learnerAt(unitOf(x) + 1);
    const items = bundle.contrastItems(x).map((i) => i.id);
    const asked: string[] = [];
    for (let r = 0; r < 4; r++) for (const c of play(run(learner, [x], `run${r}`))) { const id = items.find((i) => c.key.endsWith(i)); if (id) asked.push(id); }
    // no item is asked a second time while there are others left to ask (those the learner can be shown: the rest wait for their words)
    const pool = new Set(asked).size;
    const once = new Set<string>();
    for (const id of asked) { if (once.has(id)) expect(once.size, `${id} asked again`).toBe(pool); once.add(id); }
    expect(pool).toBeGreaterThan(CONTRAST_RUN * 2);
  }, 120_000);

  it('an answer is charged to the contrast, with its side seen, and writes a train event; the bank\'s nodes are left alone', async () => {
    const x = 'x:por-para';
    const learner = await learnerAt(unitOf(x) + 1);
    const before = learner.events().length;
    const due = learner.card(x, 'receptive')?.due;
    const fp = run(learner, [x]);
    const c = fp.next()!;
    expect(c).toBeDefined();
    fp.answer({ correct: false, tries: 2, ms: 900 });
    const ev = learner.events().slice(before);
    expect(ev.map((e) => [e.node, e.op, e.scored])).toEqual([[x, 'train', 'exposure']]);
    expect(ev[0].tries).toBe(2);
    // it is not a scheduled review: the schedule is as it was
    expect(learner.card(x, 'receptive')?.due).toBe(due);
  }, 120_000);

  it('tops the run up from the contrast\'s script where its items run short, so a contrast with a few items still has a run', async () => {
    const x = 'x:pret-perfecto-latam';
    expect(bundle.contrastItems(x).length).toBeLessThan(CONTRAST_RUN);
    const cards = play(run(await learnerAt(unitOf(x) + 1), [x]));
    expect(cards.length).toBe(CONTRAST_RUN);
    expect(cards.every((c) => c.type !== 'read')).toBe(true);
  }, 120_000);
});

describe('a contrast that trips the learner comes back as a weak spot, and its Train it works', () => {
  it('misses in Train it and in the warm-up are a spot on the contrast, and the spot\'s workout is the contrast\'s items', async () => {
    const x = 'x:ser-estar-adj';
    const learner = await learnerAt(unitOf(x) + 1);
    for (let r = 0; r < 2; r++) {
      const fp = run(learner, [x], `miss${r}`);
      for (let c = fp.next(); c; c = fp.next()) fp.answer({ correct: false, tries: 2, ms: 900 });
    }
    const spots = weakSpots(learner.events(), (id) => bundle.node(id), { now: T, introduced: (id) => learner.isIntroduced(id) });
    expect(spots.map((s) => s.key)).toEqual([x]);
    expect(spots[0].misses).toBe(spots[0].attempts);
    const cards = play(new Freeplay(spots[0].spec as never, { learner, bundle, now: () => T, rng: rng('again') }));
    expect(cards.length).toBeGreaterThanOrEqual(CONTRAST_RUN);
    expect(cards.every((c) => c.type !== 'read')).toBe(true);
  }, 120_000);
});

describe('Train it on a contrast the learner has not reached', () => {
  it('says so with the week the course teaches it, a real one, and no number from anywhere else (F10: week 165)', async () => {
    const learner = await learnerAt(0);
    const weeks = new Set<number>();
    for (const x of contrasts()) {
      const fp = run(learner, [x]);
      expect(fp.next(), x).toBeUndefined();
      const week = Number(fp.emptyReason?.match(/unit (\d+)/)?.[1] ?? 0);
      expect(fp.emptyReason, x).not.toMatch(/165/);
      expect(week, `${x}: ${fp.emptyReason}`).toBeGreaterThanOrEqual(1);
      expect(week, `${x}: ${fp.emptyReason}`).toBeLessThanOrEqual(bundle.course.units.length);
      expect(week, x).toBe(unitOf(x) + 1);
      weeks.add(week);
    }
    expect(weeks.size).toBeGreaterThan(30);
  }, 120_000);

  it('does not promise a week when the course does not place it', async () => {
    const learner = await learnerAt(0);
    const b = Object.create(bundle) as Bundle;
    Object.defineProperty(b, 'course', { value: { ...bundle.course, teachPos: new Map(bundle.course.teachPos) } });
    (b.course.teachPos as Map<string, number>).delete('x:por-para');
    const fp = run(learner, ['x:por-para'], 'x', b);
    expect(fp.next()).toBeUndefined();
    expect(fp.emptyReason).toBeTruthy();
    expect(fp.emptyReason).not.toMatch(/week \d/);
  }, 120_000);

  it('does not say the learner has not reached one they have, when there is nothing to show yet', async () => {
    const x = 'x:por-para';
    const learner = await learnerAt(unitOf(x) + 1);
    const b = Object.create(bundle) as Bundle;
    Object.defineProperty(b, 'contrasts', { value: new Map() });
    Object.defineProperty(b, 'scripts', { value: new Map() });
    Object.defineProperty(b, 'index', { value: { ...bundle.index, contrasts: new Map() } });
    const fp = run(learner, [x], 'x', b);
    expect(fp.next()).toBeUndefined();
    expect(fp.emptyReason).toBeTruthy();
    expect(fp.emptyReason).not.toMatch(/unit/);
    expect(fp.emptyReason).not.toMatch(/comes|come/);
  }, 120_000);
});

describe('Authored contrast items', () => {
  // "Hoy he dormido toda la tarde." passed its own card's check: an item the app itself calls right both ways is no contrast
  it('have one right side: what is written passes a typed card, and the other side does not', () => {
    const bad: string[] = [];
    for (const [node, file] of bundle.contrasts) {
      for (const item of file.items.filter((i) => i.id.includes('#a-'))) {
        const card = contrastCard(item, file.decides, { key: 'k', form: 'type' });
        if (card.type !== 'type') { bad.push(`${node}: ${item.id} is not typed`); continue; }
        const whole = file.decides === 'discourse';
        const typed = (k: number) => (whole ? filled(item, k) : item.options[k]);
        if (!card.check(typed(item.answer)).pass) bad.push(`${item.id} refuses its own answer`);
        item.options.forEach((_, k) => { if (k !== item.answer && card.check(typed(k)).pass) bad.push(`${item.id} takes ${typed(k)}`); });
      }
    }
    expect(bad).toEqual([]);
  });
});
