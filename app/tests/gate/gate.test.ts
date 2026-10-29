// Each gate check on a small fixture.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { runGate, APP_DIR } from '../../tools/gate';
import { fmt } from '../../tools/gate/findings';
import { jaccard, normTokens } from '../../tools/gate/corpus';
import { bank, makeFixture } from './fixture';

const by = (r: ReturnType<typeof runGate>, check: string, sev?: 'error' | 'warning') =>
  r.findings.filter((f) => f.check === check && (!sev || f.severity === sev));

describe('(a) schema', () => {
  test('a bank row missing a field fails with its path', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [{ id: 'u01-1', es: 'Hola.' }]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r, 'schema', 'error').some((f) => f.path === '[0].en')).toBe(true);
    expect(r.errors).toBeGreaterThan(0);
  });
  test('story id must match the file name; answer indices must be in range', () => {
    const fx = makeFixture();
    const p = fx.write('story/ch001.json', { id: 'ch002', unit: 'u01', title: 't', text: 'Tomás habla español.', hook: 'h',
      questions: [{ q: 'a', options: ['x', 'y'], answer: 5 }, { q: 'b', options: ['x', 'y'], answer: 0 }, { q: 'c', answer: 'sí' }] });
    const r = runGate({ appDir: fx.app, paths: [p] });
    const msgs = by(r, 'schema').map((f) => f.problem).join(' | ');
    expect(msgs).toMatch(/does not match the file name/);
    expect(msgs).toMatch(/outside options/);
  });
  test('scene links must resolve', () => {
    const fx = makeFixture();
    const p = fx.write('scenes/s01.json', { id: 's01', unit: 'u01', title: 't', brief: 'b', turns: [
      { id: 't1', npc: 'Hola.', npcEn: 'Hi', intent: 'greet', accept: ['Hola.'], next: 't9' },
      { id: 't2', npc: '¿Café?', npcEn: 'Coffee?', intent: 'order', accept: ['Quiero un café.'], next: 't3' },
      { id: 't3', npc: 'Listo.', npcEn: 'OK', intent: 'thank', accept: ['Gracias.'], next: null }] });
    const r = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r, 'schema').some((f) => /t9/.test(f.problem))).toBe(true);
  });
});

describe('(b) accent, (c) dialect, (d) verb coverage', () => {
  test('findings carry file:path, problem and a fix', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u02.json', [bank('u02-1', 'Ayer Tomás comio en casa.', 'u02'), bank('u02-2', 'Ayer cogí el coche.', 'u02'), bank('u02-3', 'Ayer blorpearon mucho.', 'u02')]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const acc = by(r, 'accent', 'error')[0];
    expect(acc.path).toBe('[0].es');
    expect(acc.fix).toBe('comió');
    expect(fmt(acc)).toMatch(/^ERROR \[accent\] content\/bank\/u02\.json:\[0\]\.es → .* → fix: comió$/);
    expect(by(r, 'dialect', 'error').map((f) => f.fix).join()).toMatch(/carro/);
    expect(by(r, 'verbs', 'error').some((f) => /blorpearon/.test(f.problem))).toBe(true);
  });
});

describe('(e) legality', () => {
  test('a past tense in u01 is not taught yet; in u02 it is', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Ayer hablé con Vale.', 'u01'), bank('u02-1', 'Ayer hablé con Vale en el café.', 'u02')]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const leg = by(r, 'legality', 'error');
    expect(leg).toHaveLength(1);
    expect(leg[0].path).toBe('[0].es');
    expect(leg[0].problem).toMatch(/g:preterite-ar .*taught u02 day 1/);
  });
  test('a chunk taught as a whole licenses its grammar', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Quiero un café.'), bank('u01-2', 'Quieres un café.')]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const leg = by(r, 'legality', 'error');
    expect(leg.map((f) => f.path)).toEqual(['[1].es']);        // "quieres" is not the chunk
    expect(leg[0].problem).toMatch(/g:stem-boot/);
  });
  test('teaching script: its own node is allowed', () => {
    const fx = makeFixture();
    const p = fx.write('scripts/g-present-ar.json', {
      node: 'g:present-ar', hook: { line: 'l', es: 'Hablo español.', en: 'I speak Spanish.' },
      examples: [{ es: 'Hablo español.', en: 'a' }, { es: 'Tomás habla inglés.', en: 'b' }, { es: '¿Hablas español?', en: 'c' }],
      rule: 'r', readAndPick: Array.from({ length: 6 }, () => ({ es: 'Hablo.', options: ['a', 'b'], answer: 0 })),
      yourTurn: Array.from({ length: 5 }, () => ({ prompt: 'p', answer: 'Hablo español.', accept: [], why: 'w' })),
      pitfalls: [{ wrong: 'Yo hablas.', right: 'Yo hablo.', why: 'w' }], personal: 'p',
    });
    const r = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r, 'legality', 'error')).toEqual([]);
    expect(by(r, 'accent')).toEqual([]);                          // pitfall "wrong" is never linted
  });
  test('legality is skipped (with a warning) when there are no units', () => {
    const fx = makeFixture();
    const { rmSync } = require('node:fs') as typeof import('node:fs');
    rmSync(join(fx.content, 'units'), { recursive: true });
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Ayer hablé con Vale.')]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r, 'legality', 'error')).toEqual([]);
    expect(by(r, 'legality', 'warning').some((f) => /no content\/units/.test(f.problem))).toBe(true);
  });
});

describe('(f) reading coverage', () => {
  const chapter = (text: string, gloss: Array<{ es: string; en: string }> = []) => ({
    id: 'ch001', unit: 'u01', title: 't', text, gloss, hook: 'h',
    questions: [{ q: 'a', options: ['x', 'y'], answer: 0 }, { q: 'b', options: ['x', 'y'], answer: 1 }, { q: 'c', options: ['x', 'y'], answer: 0 }],
  });
  test('skipped with a warning when there is no lexeme data', () => {
    const fx = makeFixture();
    const p = fx.write('story/ch001.json', chapter('Tomás habla español.'));
    const r = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r, 'reading', 'warning').length).toBe(1);
  });
  test('too many unknown words fail; known words pass', () => {
    const fx = makeFixture({ lexemes: true });
    const bad = fx.write('story/ch001.json', chapter('Tomás habla español. La montaña tiene nieve y el río lleva peces dorados.'));
    expect(by(runGate({ appDir: fx.app, paths: [bad] }), 'reading', 'error').length).toBe(1);
    const good = fx.write('story/ch001.json', chapter('Tomás habla español. Vale habla español. La casa es grande. Tomás vive en Bogotá.'));
    expect(by(runGate({ appDir: fx.app, paths: [good] }), 'reading', 'error')).toEqual([]);
  });
});

describe('(g) duplicates and frames', () => {
  test('exact and near-duplicates across files', () => {
    const fx = makeFixture();
    fx.write('bank/u01.json', [bank('u01-1', 'Tomás vive en Bogotá con su abuela y dos perros.')]);
    const p = fx.write('bank/u02.json', [
      bank('u02-1', 'Tomás vive en Bogotá con su abuela y dos perros!', 'u02'),
      bank('u02-2', 'Tomás vive en Bogotá con su abuela y tres gatos.', 'u02'),
      bank('u02-3', 'El mercado abre a las seis de la mañana.', 'u02'),
    ]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const d = by(r, 'dupe');
    expect(d.some((f) => f.path === '[0].es' && /exact duplicate of content\/bank\/u01\.json:\[0\]\.es/.test(f.problem))).toBe(true);
    expect(d.some((f) => f.path === '[1].es' && /near-duplicate/.test(f.problem))).toBe(true);
    expect(d.some((f) => f.path === '[2].es')).toBe(false);
  });
  test('jaccard on 4-grams', () => {
    const sh = (s: string) => { const t = normTokens(s); return new Set(t.slice(0, -3).map((_, i) => t.slice(i, i + 4).join(' '))); };
    expect(jaccard(sh('a b c d e f'), sh('a b c d e f'))).toBe(1);
    expect(jaccard(sh('a b c d e f'), sh('x y z w v u'))).toBe(0);
  });
  test('template-frame overuse in a unit is reported', () => {
    const fx = makeFixture();
    const rows = Array.from({ length: 14 }, (_, i) => bank(`u01-${i}`, `Me gusta mucho la comida número ${['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce'][i]} de mi casa ${i % 2 ? 'azul' : 'verde'}.`));
    const p = fx.write('bank/u01.json', rows);
    const r = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r, 'frames').some((f) => /me gusta/.test(f.problem))).toBe(true);
  });
});

describe('(h) typeability', () => {
  test('answers with blanks, ellipses or bracket-only alternatives fail', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Soy Tomás.', 'u01', { accept: ['Soy ___.', 'quizá(s)', 'Soy Tomás…'] })]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const t = by(r, 'typeable');
    expect(t.map((f) => f.path).sort()).toEqual(['[0].accept[0]', '[0].accept[2]']);   // quizá(s) has typeable forms
  });
});

describe('(i) bank requires is computed', () => {
  test('a wrong requires fails, --fix writes the computed one, then it passes', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Tomás habla español.', 'u01', { requires: ['g:wrong'], targets: ['g:present-ar'] })]);
    const r1 = runGate({ appDir: fx.app, paths: [p] });
    expect(by(r1, 'requires', 'error')[0].problem).toMatch(/-g:wrong/);
    const r2 = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(r2.fixed).toEqual(['content/bank/u01.json']);
    const written = JSON.parse(readFileSync(p, 'utf8'));
    expect(written[0].requires).toContain('g:present-ar');
    expect(Object.keys(written[0])).toEqual(['id', 'es', 'en', 'unit', 'requires', 'targets']);   // key order kept
    expect(by(runGate({ appDir: fx.app, paths: [p] }), 'requires')).toEqual([]);
  });
  test('targets must be in what the sentence contains', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Tomás habla español.', 'u01', { targets: ['g:preterite-ar'] })]);
    const r = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(by(r, 'requires', 'error').some((f) => /target g:preterite-ar/.test(f.problem))).toBe(true);
  });
});

describe('(e2) spare scenes', () => {
  test('a spare scene is gated at the end of its unit, a played one on its day', () => {
    const fx = makeFixture();
    const u = JSON.parse(readFileSync(join(fx.content, 'units/u01.json'), 'utf8'));
    u.days[0].scene = 's01';
    fx.write('units/u01.json', u);
    const scene = (spare: boolean) => ({ id: 's01', unit: 'u01', title: 't', brief: 'b', spare, turns: [
      { id: 't1', npc: 'Tomás habla español.', npcEn: 'Tomás speaks Spanish.', intent: 'greet', accept: ['Hola.'], next: 't2' },
      { id: 't2', npc: 'Tomás habla español.', npcEn: 'Tomás speaks Spanish.', intent: 'x', accept: ['Hola.'], next: 't3' },
      { id: 't3', npc: 'Listo.', npcEn: 'OK', intent: 'thank', accept: ['Gracias.'], next: null }] });
    const p = fx.write('scenes/s01.json', scene(false));
    const played = by(runGate({ appDir: fx.app, paths: [p], fix: true }), 'legality', 'error');
    expect(played.some((f) => /present-ar/.test(f.problem))).toBe(true);
    fx.write('scenes/s01.json', scene(true));
    const spare = by(runGate({ appDir: fx.app, paths: [p], fix: true }), 'legality', 'error');
    expect(spare).toEqual([]);
  });
});

describe('(j) supply', () => {
  test('below quota warns; --strict fails', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Tomás habla español.')]);
    const r = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(by(r, 'supply', 'warning').some((f) => /bankSentences 1\/3/.test(f.problem))).toBe(true);
    expect(by(runGate({ appDir: fx.app, paths: [p], strict: true }), 'supply', 'error').length).toBeGreaterThan(0);
  });
  test('a band listed as complete fails without --strict', () => {
    const fx = makeFixture();
    fx.write('units/_complete.json', ['A1']);
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Tomás habla español.')]);
    expect(by(runGate({ appDir: fx.app, paths: [p], fix: true }), 'supply', 'error').length).toBeGreaterThan(0);
  });
});

describe('(k) daySupply', () => {
  test('a node whose only rows need a later-day node warns; rows usable that day pass', () => {
    const fx = makeFixture();
    // g:ser-identity is introduced on day 1; g:present-ar only on day 3
    const late = Array.from({ length: 12 }, (_, i) => bank(`u01-${i + 1}`, `Tomás habla español ${i}.`, 'u01', { requires: ['g:ser-identity', 'g:present-ar'], targets: ['g:ser-identity'] }));
    const p = fx.write('bank/u01.json', late);
    const w = by(runGate({ appDir: fx.app, paths: [p] }), 'daySupply', 'warning');
    expect(w.some((f) => /g:ser-identity on introduce day 1 .*0 usable rows, needs 9/.test(f.problem))).toBe(true);
    const ok = Array.from({ length: 12 }, (_, i) => bank(`u01-${i + 1}`, `Tomás habla español ${i}.`, 'u01', { requires: ['g:ser-identity'], targets: ['g:ser-identity'] }));
    fx.write('bank/u01.json', ok);
    const w2 = by(runGate({ appDir: fx.app, paths: [p] }), 'daySupply', 'warning');
    expect(w2.some((f) => /introduce day 1/.test(f.problem))).toBe(false);
  });
});

describe('the CLI contract', () => {
  test('exit 0 on clean content, non-zero with findings on stdout', () => {
    const fx = makeFixture();
    const good = fx.write('bank/u01.json', [bank('u01-1', 'Tomás habla español.')]);
    runGate({ appDir: fx.app, paths: [good], fix: true });
    const bad = fx.write('bank/u02.json', [bank('u02-1', 'Mi coche es rojo.', 'u02')]);
    const run = (p: string) => {
      try { return { code: 0, out: execFileSync('npx', ['tsx', join(APP_DIR, 'tools/gate.ts'), p], { cwd: APP_DIR, encoding: 'utf8', env: { ...process.env, FLUIDEZ_APP_DIR: fx.app } }) }; }
      catch (e) { const x = e as { status: number; stdout: string }; return { code: x.status, out: x.stdout }; }
    };
    const ok = run(good);
    expect(ok.code, ok.out).toBe(0);
    expect(ok.out).toMatch(/gate: PASS/);
    const ko = run(bad);
    expect(ko.code).toBe(1);
    expect(ko.out).toMatch(/ERROR \[dialect\] content\/bank\/u02\.json:\[0\]\.es → "coche" is Peninsular → fix: carro/);
    expect(ko.out).toMatch(/gate: FAIL/);
  }, 30_000);
});

/* ---- regressions from the first story chapters (ch001–ch006) ---------------------- */
describe('(k) story chapters: words are governed by reading coverage', () => {
  const chapter = (id: string, unit: string, text: string, gloss: Array<{ es: string; en: string }> = []) => ({
    id, unit, title: 't', text, gloss, hook: 'h',
    questions: [{ q: 'a', options: ['x', 'y'], answer: 0 }, { q: 'b', options: ['x', 'y'], answer: 1 }, { q: 'c', options: ['x', 'y'], answer: 0 }],
  });
  const known = 'Tomás habla español. Vale habla español. La casa es grande. Tomás habla en Bogotá. El café es grande. Vale habla en Bogotá. Tomás habla.';
  const withLexemes = () => {
    const fx = makeFixture({ lexemes: true });
    // a graph word taught long after the chapter, and one a chunk carries
    const lex = ['l:hablar', 'l:español', 'l:café', 'l:querer', 'l:ayer', 'l:mercado', 'l:ir', 'l:casa', 'l:grande', 'l:ser', 'l:vivir', 'l:bogotá'];
    fx.write('graph/lexemes.json', [...lex.map((id, i) => ({ id, kind: 'lexeme', band: 'A1', priority: 1 + i, title: id, es: id.slice(2) })),
      { id: 'l:mar', kind: 'lexeme', band: 'A1', priority: 40, title: 'sea', es: 'el mar', pos: 'noun', gender: 'm' },
      { id: 'l:llamarse', kind: 'lexeme', band: 'A1', priority: 40, title: 'to be called', es: 'llamarse', pos: 'verb' }]);
    return fx;
  };
  test('a glossed graph word above the chapter day is no legality error; unglossed it fails coverage', () => {
    const fx = withLexemes();
    const text = `${known} El mar es grande.`;
    const ok = fx.write('story/ch001.json', chapter('ch001', 'u01', text, [{ es: 'el mar', en: 'the sea' }]));
    const r1 = runGate({ appDir: fx.app, paths: [ok], fix: true });
    expect(by(r1, 'legality', 'error').map(fmt)).toEqual([]);
    expect(by(r1, 'reading', 'error')).toEqual([]);
    const bad = fx.write('story/ch001.json', chapter('ch001', 'u01', text));
    const r2 = runGate({ appDir: fx.app, paths: [bad], fix: true });
    expect(by(r2, 'legality', 'error')).toEqual([]);
    expect(by(r2, 'reading', 'error')).toHaveLength(1);
  });
  test('grammar beyond the story lookahead is never rescued by a gloss', () => {
    const fx = withLexemes();
    const p = fx.write('story/ch001.json', chapter('ch001', 'u01', `${known} Quiero que Tomás hable español.`, [{ es: 'Quiero que Tomás hable español', en: 'x' }]));
    const leg = by(runGate({ appDir: fx.app, paths: [p], fix: true }), 'legality', 'error');
    expect(leg).toHaveLength(1);
    expect(leg[0].path).toMatch(/^text /);                    // the gloss entry itself is not gated
    expect(leg[0].problem).toMatch(/g:subj-wanting/);
  });
  test('grammar a little ahead (within the lookahead) is allowed in a story, and not a requirement', () => {
    const fx = withLexemes();
    const p = fx.write('story/ch001.json', chapter('ch001', 'u01', `${known} Ayer Tomás habló español.`, [{ es: 'Ayer Tomás habló español', en: 'x' }]));
    const r = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(by(r, 'legality', 'error')).toEqual([]);
    expect(JSON.parse(readFileSync(p, 'utf8')).requires).not.toContain('g:preterite-ar');
  });
  test('words inside a taught chunk are known (Me llamo → l:llamarse)', () => {
    const fx = withLexemes();
    const p = fx.write('story/ch001.json', chapter('ch001', 'u01', `${known} —Me llamo Vale. —Me llamo Tomás.`));
    const r = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(by(r, 'reading', 'error')).toEqual([]);
    expect(by(r, 'legality', 'error')).toEqual([]);
  });
  test('a running catchphrase across chapters is no duplicate; a bank sentence still is', () => {
    const fx = withLexemes();
    fx.write('story/ch001.json', chapter('ch001', 'u01', `${known} Simón: ¡Tomás habla español!`));
    const p = fx.write('story/ch002.json', chapter('ch002', 'u02', `${known} Simón: ¡Tomás habla español!`));
    expect(by(runGate({ appDir: fx.app, paths: [p], fix: true }), 'dupe', 'error')).toEqual([]);
    fx.write('bank/u01.json', [bank('u01-1', 'Vale vive en Bogotá con Tomás.')]);
    const b = fx.write('bank/u02.json', [bank('u02-1', 'Vale vive en Bogotá con Tomás.', 'u02')]);
    expect(by(runGate({ appDir: fx.app, paths: [b], fix: true }), 'dupe', 'error')).toHaveLength(1);
  });
  test('--fix writes a chapter\'s requires and lexemes, a scene\'s and a writing task\'s requires', () => {
    const fx = withLexemes();
    const ch = fx.write('story/ch001.json', chapter('ch001', 'u01', known));
    const sc = fx.write('scenes/s01.json', { id: 's01', unit: 'u01', title: 't', brief: 'b', turns: [
      { id: 't1', npc: 'Hola. ¿Habla español?', npcEn: 'Hi', intent: 'greet', accept: ['Sí, hablo español.'], next: 't2' },
      { id: 't2', npc: '¿Vive en Bogotá?', npcEn: 'x', intent: 'x', accept: ['Sí, vivo en Bogotá.'], next: 't3' },
      { id: 't3', npc: 'Listo.', npcEn: 'OK', intent: 'thank', accept: ['Gracias.'], next: null }] });
    const wr = fx.write('writing/u01.json', [{ id: 'w1', unit: 'u01', prompt: 'p', minWords: 3, maxWords: 20, model: 'Tomás habla español y vive en Bogotá.' }]);
    const r1 = runGate({ appDir: fx.app, paths: [ch, sc, wr] });
    expect(by(r1, 'requires', 'error').map((f) => f.file).sort()).toEqual(['content/scenes/s01.json', 'content/story/ch001.json', 'content/story/ch001.json', 'content/writing/u01.json']);
    const r2 = runGate({ appDir: fx.app, paths: [ch, sc, wr], fix: true });
    expect(r2.fixed.sort()).toEqual(['content/scenes/s01.json', 'content/story/ch001.json', 'content/writing/u01.json']);
    const c = JSON.parse(readFileSync(ch, 'utf8'));
    expect(c.requires).toContain('g:present-ar');
    expect(c.requires.some((x: string) => x.startsWith('l:'))).toBe(false);
    expect(c.lexemes).toEqual(expect.arrayContaining(['l:hablar', 'l:casa']));
    expect(JSON.parse(readFileSync(sc, 'utf8')).requires).toContain('g:present-er-ir');
    expect(JSON.parse(readFileSync(wr, 'utf8'))[0].requires).toContain('l:vivir');
    expect(by(runGate({ appDir: fx.app, paths: [ch, sc, wr] }), 'requires')).toEqual([]);
  });
  test('a lexeme met before its card day is known from its priority', () => {
    const fx = withLexemes();
    // l:casa is carded on u01 day 3 (session 3) but its priority says 1
    const lex = JSON.parse(readFileSync(join(fx.content, 'graph/lexemes.json'), 'utf8'));
    lex.find((n: { id: string }) => n.id === 'l:casa').priority = 1;
    fx.write('graph/lexemes.json', lex);
    const p = fx.write('bank/u01.json', [bank('u01-1', 'La casa es grande.')]);
    const r = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(by(r, 'legality', 'error').filter((f) => /l:casa/.test(f.problem))).toEqual([]);
  });
});

describe('(l) targets are author intent', () => {
  test('a pattern, contrast or undetectable node as a target only warns', () => {
    const fx = makeFixture();
    fx.write('graph/patterns.json', [{ id: 'p:ser-profession-no-article', kind: 'pattern', band: 'A1', priority: 1, title: 't' }]);
    const p = fx.write('bank/u01.json', [bank('u01-1', 'Tomás habla español.', 'u01', { targets: ['p:ser-profession-no-article', 'x:muy-mucho'] })]);
    const r = runGate({ appDir: fx.app, paths: [p], fix: true });
    expect(by(r, 'requires', 'error')).toEqual([]);
    expect(by(r, 'requires', 'warning')).toHaveLength(2);
  });
});

describe('(m) dashes and packed variants', () => {
  test('an em dash, en dash or spaced hyphen in learner-facing text is an error; notes are not checked', () => {
    const fx = makeFixture();
    const p = fx.write('bank/u01.json', [
      bank('u01-1', '¿Quiero un café? —Sí.', 'u01'),
      bank('u01-2', 'Quiero un café.', 'u01', { en: 'I want a coffee – now.' }),
      bank('u01-3', 'Quiero un café.\nMe llamo Tomás.', 'u01', { en: 'I want a coffee - thanks.' }),
      bank('u01-4', 'Me llamo Tomás.', 'u01', { en: 'My name is Tomás.', theme: 'names — intro' }),
    ]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const paths = by(r, 'dashes', 'error').map((f) => f.path);
    expect(paths).toEqual(expect.arrayContaining(['[0].es', '[1].en', '[2].en']));
    expect(paths.some((x) => x?.startsWith('[3]'))).toBe(false);
  });
  test('a graph node packing variants with " / " fails; es/en must be forms[0]', () => {
    const fx = makeFixture();
    const p = fx.write('graph/chunks.json', [
      { id: 'c:quiero', kind: 'chunk', band: 'A1', priority: 1, title: 'Wanting', es: 'Quiero un café. / Quiero té.', en: 'I want a coffee.' },
      { id: 'c:me-llamo', kind: 'chunk', band: 'A1', priority: 1, title: 'Names', es: 'Me llamo Tomás.', en: 'My name is Tomás.',
        forms: [{ es: '¿Cómo te llamas?', en: "What's your name?" }, { es: 'Me llamo Tomás.', en: 'My name is Tomás.' }] },
    ]);
    const r = runGate({ appDir: fx.app, paths: [p] });
    const msgs = by(r, 'dashes', 'error').map((f) => `${f.path} ${f.problem}`).join(' | ');
    expect(msgs).toMatch(/\[0\]\.es c:quiero packs variants/);
    expect(msgs).toMatch(/\[1\]\.forms\[0\] c:me-llamo: es\/en must be the main form/);
  });
  test('a chunk is matched by its aligned forms, not only its es', () => {
    const run = (forms: boolean) => {
      const fx = makeFixture();
      fx.write('graph/chunks.json', [
        { id: 'c:me-llamo', kind: 'chunk', band: 'A1', priority: 1, title: 'Names', es: 'Me llamo Tomás.', en: 'My name is Tomás.',
          ...(forms ? { forms: [{ es: 'Me llamo Tomás.', en: 'My name is Tomás.' }, { es: 'Quiero hablar con Vale.', en: 'I want to talk to Vale.' }] } : {}) },
      ]);
      const p = fx.write('bank/u01.json', [bank('u01-1', 'Quiero hablar con Vale.', 'u01')]);
      return by(runGate({ appDir: fx.app, paths: [p] }), 'legality', 'error');
    };
    expect(run(false).length).toBeGreaterThan(0);
    expect(run(true)).toEqual([]);
  });
});

describe('(n) chapter length by band', () => {
  const words = (n: number) => Array.from({ length: n }, () => 'casa').join(' ');
  const chapter = (n: number) => ({
    id: 'ch001', unit: 'u01', title: 't', text: words(n), gloss: [], hook: 'h',
    questions: [{ q: 'a', options: ['x', 'y'], answer: 0 }, { q: 'b', options: ['x', 'y'], answer: 1 }, { q: 'c', options: ['x', 'y'], answer: 0 }],
  });
  const run = (n: number, strict = false) => {
    const fx = makeFixture();
    const p = fx.write('story/ch001.json', chapter(n));
    return runGate({ appDir: fx.app, paths: [p], strict });
  };
  test('an A1 chapter of 200 words warns, and errors under --strict', () => {
    const w = by(run(200), 'length');
    expect(w.map((f) => f.severity)).toEqual(['warning']);
    expect(w[0].problem).toContain('200 words');
    expect(w[0].problem).toContain('80 to 180');
    expect(by(run(200, true), 'length').map((f) => f.severity)).toEqual(['error']);
  });
  test('120 words passes', () => {
    expect(by(run(120), 'length')).toEqual([]);
    expect(by(run(120, true), 'length')).toEqual([]);
  });
  test('60 words warns under the minimum, even under --strict', () => {
    expect(by(run(60), 'length').map((f) => f.severity)).toEqual(['warning']);
    expect(by(run(60, true), 'length').map((f) => f.severity)).toEqual(['warning']);
  });
});
