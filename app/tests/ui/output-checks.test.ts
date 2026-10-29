// Every block that claims to check, checks: the personal sentence, the answer to
// a question about you, scene turns, the writing self-rubric and the story questions.
import { describe, expect, it } from 'vitest';
import { checkPersonal, spanishShare } from '../../src/check/personal';
import { MemoryKV, UiStore } from '../../src/ui/store/ui';
import { respondCheck } from '../../src/ui/session/cards';
import { bundleLexicon, checkTurn } from '../../src/ui/session/scene';
import { lastTimeLine, lastWritingMark } from '../../src/ui/blocks/writing';
import { logComprehension, questionNodes } from '../../src/ui/blocks/read';
import { fixtureBundle, session, world } from './driver';

const G = 'g:ser-identity';

describe('checkPersonal', () => {
  const b = fixtureBundle();
  const opts = { node: G, script: b.scripts.get(G), nodes: b.course.nodes, lexicon: bundleLexicon(b) };

  it('an English sentence fails and is told so', () => {
    const r = checkPersonal('I am Matt and I am from Toronto', opts);
    expect(r.pass).toBe(false);
    expect(r.spanishShare).toBeLessThan(0.4);
    expect(r.hint).toMatch(/English/);
  });
  it('Spanish without the day\'s form fails with the form named', () => {
    const r = checkPersonal('Trabajo en un café', opts);
    expect(r.pass).toBe(false);
    expect(r.hint).toMatch(/Use \*[a-zé]+\*/i);
    expect(r.hint).toMatch(/\*(soy|eres|es|somos|son)\*/);
  });
  it('Spanish with the form passes (any person of the verb)', () => {
    const r = checkPersonal('Soy Matt. Soy de Toronto.', opts);
    expect(r.pass).toBe(true);
    expect(r.usedForm).toBeTruthy();
    expect(checkPersonal('Mi hermana es de Bogotá', opts).pass).toBe(true);
  });
  it('one word is not a sentence', () => {
    expect(checkPersonal('Soy', opts).pass).toBe(false);
  });
  it('the share threshold: 70% Spanish passes, less does not', () => {
    const lex = new Set(['cafe', 'tinto', 'agua']);
    expect(spanishShare('el café tinto', lex)).toBe(1);
    expect(spanishShare('el café the coffee', lex)).toBe(0.5);
    // 2 of 3 is under the floor, 3 of 4 over
    expect(checkPersonal('soy the Spanish', { noForm: true, lexicon: lex }).pass).toBe(false);
    expect(checkPersonal('soy de aquí hoy and', { noForm: true, lexicon: lex }).spanishShare).toBeGreaterThanOrEqual(0.7);
  });
  it('names do not count against the share', () => {
    expect(checkPersonal('Me llamo Matt Smith', { noForm: true }).pass).toBe(true);
  });
  it('a lexeme node wants the lexeme itself', () => {
    const o = { node: 'l:tinto', nodes: b.course.nodes, lexicon: bundleLexicon(b) };
    expect(checkPersonal('Quiero un tinto, por favor', o).pass).toBe(true);
    const miss = checkPersonal('Quiero un agua, por favor', o);
    expect(miss.pass).toBe(false);
    expect(miss.hint).toMatch(/\*tinto\*/);
  });
});

describe('respondCheck', () => {
  const b = fixtureBundle();
  const lex = bundleLexicon(b);
  it('a tú question wants the I form, in Spanish', () => {
    const c = respondCheck(b.sentence('u01-4')!, lex); // ¿De dónde eres?
    expect(c('Soy de Leeds.').pass).toBe(true);
    expect(c('Eres de Leeds.').pass).toBe(false);
    expect(c('I am from Leeds, soy').pass).toBe(false);
  });
  it('a usted question needs a form of the same verb, in Spanish', () => {
    const q = { ...b.sentence('u01-4')!, es: '¿De dónde es usted?', en: 'Where are you from?' };
    const c = respondCheck(q as any, lex);
    expect(c('Soy de Leeds.').pass).toBe(true);
    const miss = c('Vivo en Leeds.');
    expect(miss.pass).toBe(false);
    expect(miss.hint).toMatch(/same verb/);
    expect(c('I am from Leeds').pass).toBe(false);
  });
  it('English fails any question', () => {
    const q = b.bank.find((s) => /^¿/.test(s.es) && !/ eres| es usted/.test(s.es));
    if (q) expect(respondCheck(q, lex)('My name is Matt').pass).toBe(false);
  });
});

describe('scene turns', () => {
  const b = fixtureBundle();
  const lex = bundleLexicon(b);
  const hello = b.scenes.get('sc-u01-a')!.turns[0]; // accept hola; require containsAny hola
  it('an English reply that holds the words fails', () => {
    const r = checkTurn(hello, 'I said hola to the man at the door', lex);
    expect(r.pass).toBe(false);
    expect(r.reason).toMatch(/English|Spanish/);
  });
  it('a Spanish reply that meets the constraints passes', () => {
    expect(checkTurn(hello, 'Hola, don Hernando', lex).pass).toBe(true);
    expect(checkTurn(hello, 'Hola.', lex).pass).toBe(true);
  });
});

describe('writing rubric persistence', () => {
  it('round-trips through the store, and "last time" reads it back', async () => {
    const kv = new MemoryKV();
    const ui = await new UiStore(kv).load();
    expect(lastTimeLine(lastWritingMark(ui.state.writing, 'w1'))).toBe('');
    await ui.update((s) => { s.writing = { ...s.writing, w1: { at: 5, rubric: ['yes', 'mostly', 'yes'], words: 40, met: 2, of: 3 } }; });
    const again = await new UiStore(kv).load();
    expect(again.state.writing.w1).toEqual({ at: 5, rubric: ['yes', 'mostly', 'yes'], words: 40, met: 2, of: 3 });
    expect(lastTimeLine(lastWritingMark(again.state.writing, 'w1'))).toBe('Last time: 2 of 3 yes');
    // another task still sees the most recent one
    expect(lastTimeLine(lastWritingMark(again.state.writing, 'w2'))).toBe('Last time: 2 of 3 yes');
  });
  it('an old document without the field loads with an empty one', async () => {
    const kv = new MemoryKV();
    await new UiStore(kv).load();
    const raw: any = await kv.get('ui');
    delete raw.writing;
    await kv.set('ui', raw);
    expect((await new UiStore(kv).load()).state.writing).toEqual({});
  });
});

describe('story comprehension', () => {
  it('each answer is a comprehend exposure event on the words in the question, and never a graded review', async () => {
    const w = await world();
    const { run } = await session(w, 'right');
    const base = { ...w.bundle.chapters.get('ch002')! };
    const ch = { ...base, lexemes: ['l:tinto', 'l:pan', 'l:agua'] };
    for (const id of ch.lexemes) if (!w.learner.isIntroduced(id)) w.learner.introduce(id, { at: w.now(), productive: false });
    const q = ch.questions[0]; // What is a tinto in Bogotá?
    expect(questionNodes(ch, q, w.bundle)).toEqual(['l:tinto']); // 'bread' is English text: only Spanish words match
    const before = w.learner.events().length;
    logComprehension(run, ch, q, { correct: true, tries: 1, ms: 3000 });
    const evs = w.learner.events().slice(before);
    expect(evs.length).toBe(1);
    expect(evs.every((e) => e.op === 'comprehend' && e.scored === 'exposure')).toBe(true);
    expect(new Set(evs.map((e) => e.node))).toEqual(new Set(['l:tinto']));
  });
  it('a question with none of the chapter words logs nothing and does not throw', async () => {
    const w = await world();
    const { run } = await session(w, 'right');
    const ch = { ...w.bundle.chapters.get('ch001')!, lexemes: ['l:agua'] };
    const before = w.learner.events().length;
    expect(logComprehension(run, ch, ch.questions[0], { correct: false, tries: 2, ms: 1000 })).toEqual([]);
    expect(w.learner.events().length).toBe(before);
  });
});
