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
