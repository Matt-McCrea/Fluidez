// A tiny content/ tree in a temp dir: 2 units, a handful of graph nodes.
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

export interface Fixture { app: string; content: string; write: (rel: string, data: unknown) => string }

const node = (id: string, kind: string, priority: number, extra: Record<string, unknown> = {}) =>
  ({ id, kind, band: 'A1', priority, title: id, ...extra });

const day = (type: string, focus: string[] = [], chunks: string[] = [], lexemes: string[] = [], extra: Record<string, unknown> = {}) =>
  ({ type, focus, chunks, lexemes, ...extra });

export function makeFixture(opts: { lexemes?: boolean } = {}): Fixture {
  const app = mkdtempSync(join(tmpdir(), 'gate-'));
  const content = join(app, 'content');
  const write = (rel: string, data: unknown) => {
    const p = join(content, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, JSON.stringify(data, null, 2));
    return p;
  };
  const lex = opts.lexemes ? ['l:hablar', 'l:español', 'l:café', 'l:querer', 'l:ayer', 'l:mercado', 'l:ir', 'l:casa', 'l:grande', 'l:ser', 'l:vivir', 'l:bogotá'] : [];
  write('graph/grammar.json', [
    node('g:ser-identity', 'grammar', 1), node('g:gender-articles', 'grammar', 2), node('g:present-ar', 'grammar', 3),
    node('g:present-er-ir', 'grammar', 4), node('g:stem-boot', 'grammar', 20), node('g:preterite-ar', 'grammar', 12),
    node('g:preterite-ser-ir-hacer', 'grammar', 13), node('g:subj-wanting', 'grammar', 90), node('g:that-clauses', 'grammar', 80),
  ]);
  write('graph/chunks.json', [node('c:quiero', 'chunk', 1, { es: 'Quiero un café. / Quiero hablar con Vale.' }), node('c:me-llamo', 'chunk', 1, { es: 'Me llamo Tomás. ¿Cómo te llamas?' })]);
  if (opts.lexemes) write('graph/lexemes.json', lex.map((id, i) => node(id, 'lexeme', 1 + i, { es: id.slice(2) })));
  const quota = { bankSentences: 3, chapters: 1, scenes: 0, writingTasks: 0 };
  write('units/u01.json', {
    id: 'u01', band: 'A1', title: 'Hello', theme: 'identidad', canDo: 'I can say who I am', storyArc: 'Tomás arrives in Bogotá and meets Vale at the café. Vale shows Tomás the café.', quota,
    days: [
      day('introduce', ['g:ser-identity'], ['c:quiero', 'c:me-llamo'], lex.slice(0, 6)), day('drill', ['g:gender-articles']), day('introduce', ['g:present-ar'], [], lex.slice(6)),
      day('drill'), day('input', [], [], [], { chapter: 'ch001' }), day('patterns'), day('review'),
    ],
  });
  write('units/u02.json', {
    id: 'u02', band: 'A1', title: 'Past', theme: 'ocio', canDo: 'I can say what I did', storyArc: 'Tomás and Vale go to the market.', quota,
    days: [day('introduce', ['g:preterite-ar', 'g:preterite-ser-ir-hacer']), day('drill'), day('introduce', ['g:present-er-ir']), day('drill'), day('input'), day('patterns'), day('review')],
  });
  return { app, content, write };
}

export const bank = (id: string, es: string, unit = 'u01', extra: Record<string, unknown> = {}) => ({ id, es, en: 'x', unit, ...extra });
