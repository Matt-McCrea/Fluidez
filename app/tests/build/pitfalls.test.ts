// The pitfalls file: every lesson script's wrong sentences, derived and shipped (R14: one derived file, scoped to the card's nodes).
// It is what the scripts say; it leaves out a pitfall the matcher would call right, a fragment, and one a verified claim still
// stands against; the gate fails one gone stale; the loader hands it to the checker beside the course.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { pitfallFor, pitfallKey, pitfallNodes, registerPitfalls } from '../../src/check/traps';
import { CONTENT_FILES, ContentLoader } from '../../src/ui/data/loader';
import { buildPitfalls, checkPitfalls, pitfallsFile, readPitfalls, serializePitfalls, standingClaims } from '../../tools/build/pitfalls';
import { makeFixture } from '../gate/fixture';

const CONTENT = join(__dirname, '../../content');

describe('the shipped pitfalls', () => {
  it('are what the scripts say, so a script written since is not missing from them', () => {
    const kept = readPitfalls(CONTENT);
    expect(kept, 'content/_pitfalls/pitfalls.json is missing: npm run pitfalls').toBeDefined();
    expect(kept).toEqual(buildPitfalls(CONTENT));
    expect(checkPitfalls(CONTENT)).toEqual([]);
  }, 60_000);

  it('hold nearly all of the 2,933, by node, with the lesson\'s reason', () => {
    const kept = readPitfalls(CONTENT)!;
    const n = Object.values(kept.nodes).reduce((s, r) => s + r.length, 0);
    expect(n).toBeGreaterThan(2700);
    expect(n).toBeLessThanOrEqual(2933);
    expect(Object.keys(kept.nodes).length).toBeGreaterThan(800);
    for (const rows of Object.values(kept.nodes).slice(0, 80)) for (const [key, why] of rows) { expect(key.split(' ').length).toBeGreaterThan(1); expect(why.length).toBeGreaterThan(10); }
  });

  it('leave out the pitfalls the audit found striking out correct Spanish, until the content is fixed', () => {
    const kept = readPitfalls(CONTENT)!;
    const keys = (node: string) => (kept.nodes[node] ?? []).map(([k]) => k);
    // pitfalls[1] of g:reported-past-basic: Mariana dijo que va a llamar is right, and the claim still stands
    expect(keys('g:reported-past-basic').some((k) => k.startsWith('mariana dijo que va a llamar'))).toBe(false);
    // No dijo que era urgente is right too
    expect(keys('g:subj-perception-negated').some((k) => k.startsWith('no dijo que era urgente'))).toBe(false);
  });

  it('stay small enough for a file fetched beside the course', () => {
    expect(Buffer.byteLength(serializePitfalls(readPitfalls(CONTENT)!))).toBeLessThan(400_000);
  });

  it('reach the checker through the loader, and speak on the card of their node', async () => {
    registerPitfalls(undefined);
    expect(Object.keys(CONTENT_FILES.pitfalls ?? {}).length).toBeGreaterThan(0);
    await new ContentLoader().core();
    // fetched beside the course, not in front of it
    for (let i = 0; i < 50 && !pitfallNodes(); i++) await new Promise((r) => setTimeout(r, 20));
    expect(pitfallNodes()).toBeGreaterThan(800);
    const [wrong, why] = readPitfalls(CONTENT)!.nodes['g:pret-vs-imperfect'][0];
    expect(pitfallFor(['g:pret-vs-imperfect'], wrong)?.why).toBe(why);
    expect(pitfallFor(['g:ser-identity'], wrong)).toBeUndefined();
    registerPitfalls(undefined);
  }, 30_000);
});

describe('what goes in the file', () => {
  const made: string[] = [];
  afterEach(() => { for (const d of made.splice(0)) rmSync(d, { recursive: true, force: true }); });
  const script = (pitfalls: Array<{ wrong: string; right: string; why: string }>) => ({ node: 'g:ser-identity', hook: {}, examples: [], rule: '', smallPrint: '', readAndPick: [], yourTurn: [], pitfalls, personal: {} });
  function tree(pitfalls: Array<{ wrong: string; right: string; why: string }>) {
    const fx = makeFixture();
    made.push(fx.app);
    fx.write('scripts/g_ser-identity.json', script(pitfalls));
    return fx;
  }
  const verdicts = (lines: unknown[]) => {
    const fx = makeFixture();
    made.push(fx.app);
    const file = join(fx.app, 'final.jsonl');
    writeFileSync(file, lines.map((l) => JSON.stringify(l)).join('\n'));
    return file;
  };

  it('is the wrong sentence as the matcher reads it, with the lesson\'s reason', () => {
    const fx = tree([{ wrong: 'Soy aburrido en la reunión.', right: 'Estoy aburrido en la reunión.', why: 'Bored takes estar.' }]);
    expect(buildPitfalls(fx.content, '/nowhere').nodes).toEqual({ 'g:ser-identity': [[pitfallKey('Soy aburrido en la reunión.'), 'Bored takes estar.']] });
  });

  it('leaves out one the matcher would accept as the right sentence, a fragment, and a wrong that is the right', () => {
    const fx = tree([
      { wrong: 'Te llamo mañana.', right: 'Mañana te llamo.', why: 'not wrong at all' },
      { wrong: 'Hola.', right: 'Buenas.', why: 'a fragment' },
      { wrong: 'Soy Tomás.', right: 'soy tomás', why: 'the same sentence' },
      { wrong: 'Estoy aburrido ayer.', right: 'Estuve aburrido ayer.', why: 'kept' },
    ]);
    expect(buildPitfalls(fx.content, '/nowhere').nodes['g:ser-identity']).toEqual([[pitfallKey('Estoy aburrido ayer.'), 'kept']]);
  });

  it('leaves out one a verified claim stands against, and takes it back once the text the claim quotes is gone', () => {
    const fx = tree([{ wrong: 'Había un accidente en la Séptima.', right: 'Hubo un accidente en la Séptima.', why: 'For one event that happened and is over, Spanish uses *hubo*.' }]);
    const claim = (verdict: string, quote: string) => verdicts([{ id: 'X-1', verdict, file: 'app/content/scripts/g_ser-identity.json', field: 'pitfalls[0].why', quote }]);
    expect(buildPitfalls(fx.content, claim('confirmed', 'For one event that happened and is over, Spanish uses *hubo*.')).nodes).toEqual({});
    expect(buildPitfalls(fx.content, claim('amended', 'Había un accidente en la Séptima.')).nodes).toEqual({});
    expect(buildPitfalls(fx.content, claim('refuted', 'For one event that happened and is over, Spanish uses *hubo*.')).nodes['g:ser-identity']).toHaveLength(1);
    // fixed: the text the claim quotes is no longer in it
    expect(buildPitfalls(fx.content, claim('confirmed', 'a sentence that is no longer in the script')).nodes['g:ser-identity']).toHaveLength(1);
  });

  it('reads a claim that quotes the pitfall as JSON by its wrong sentence', () => {
    const file = verdicts([{ id: 'X-2', verdict: 'amended', file: 'app/content/scripts/g_ser-identity.json', field: 'pitfalls[0]', quote: '{ "wrong": "No dijo que era urgente.", "right": "x", "why": "y" }' }]);
    expect(standingClaims(file).get('g_ser-identity.json')).toEqual([{ index: 0, quote: 'No dijo que era urgente.' }]);
  });

  it('is checked by the gate, which says how to mend a stale one', () => {
    const fx = tree([{ wrong: 'Soy aburrido en la reunión.', right: 'Estoy aburrido en la reunión.', why: 'Bored takes estar.' }]);
    expect(checkPitfalls(fx.content)).toEqual([]);                      // a course with none is not checked
    mkdirSync(join(fx.content, '_pitfalls'), { recursive: true });
    writeFileSync(pitfallsFile(fx.content), serializePitfalls(buildPitfalls(fx.content)));
    expect(checkPitfalls(fx.content)).toEqual([]);
    fx.write('scripts/g_ser-identity.json', script([{ wrong: 'Soy cansado en la reunión.', right: 'Estoy cansado en la reunión.', why: 'Tired takes estar.' }]));
    const found = checkPitfalls(fx.content);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ severity: 'error', check: 'pitfalls', file: 'content/_pitfalls/pitfalls.json' });
    expect(found[0].fix).toMatch(/npm run pitfalls/);
  });
});

describe('a pitfall in the checker', () => {
  it('names the lesson\'s reason on the card of its node, with the real file', () => {
    const kept = readPitfalls(CONTENT)!;
    registerPitfalls(kept);
    const r = matchTranslation('Fue tarde y llovió.', { es: 'Era tarde y llovía.', en: 'It was late and it was raining.' }, { targets: ['g:pret-vs-imperfect'] });
    expect(r.rule).toBe('pitfall');
    expect(r.hint).toBe(kept.nodes['g:pret-vs-imperfect'].find(([k]) => k === pitfallKey('Fue tarde y llovió.'))![1]);
    registerPitfalls(undefined);
  });
});
