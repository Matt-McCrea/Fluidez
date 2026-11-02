// Content defects the audit named, mended in place with their ids kept. These
// read the content files themselves, so a regeneration that brings one back fails.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { BankSentence, GraphNode } from '../../src/content/schema';

const CONTENT = join(__dirname, '../../content');
const chunks = JSON.parse(readFileSync(join(CONTENT, 'graph/chunks.json'), 'utf8')) as GraphNode[];
const chunk = (id: string) => chunks.find((n) => n.id === id)!;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
const SENTENCE = /(?<=[.?!…])\s+(?=[¿¡"“«A-ZÁÉÍÓÚÑ])/u;
const sentences = (s: string) => s.split(SENTENCE).map((x) => x.trim()).filter(Boolean);

describe('chunks: the English is the translation of the Spanish', () => {
  test('c:que-le-vamos-a-hacer is one question, in both languages', () => {
    const n = chunk('c:que-le-vamos-a-hacer');
    expect(sentences(n.es!)).toEqual(['¿Qué le vamos a hacer?']);
    expect(sentences(n.en!)).toEqual(['What can you do?']);
  });

  test.each(['c:a-largo-plazo', 'c:tienes-un-minutico', 'c:no-puedo-mas'])('%s does not say its last English line twice', (id) => {
    const n = chunk(id);
    expect(sentences(n.en!).length).toBe(sentences(n.es!).length);
  });

  test('no chunk repeats an English line straight after itself', () => {
    const repeated: string[] = [];
    for (const n of chunks) {
      for (const f of [{ es: n.es ?? '', en: n.en ?? n.title ?? '' }, ...(n.forms ?? [])]) {
        const en = sentences(f.en);
        if (en.some((x, i) => i > 0 && norm(x) === norm(en[i - 1]))) repeated.push(`${n.id}: ${f.en}`);
      }
    }
    expect(repeated).toEqual([]);
  });
});

describe('the "(polite)" tag is for usted', () => {
  test('u42-0758 speaks to a friend about "tu hijo", and says so', () => {
    const row = (JSON.parse(readFileSync(join(CONTENT, 'bank/u42.json'), 'utf8')) as BankSentence[]).find((r) => r.id === 'u42-0758')!;
    expect(row.es).toMatch(/\btu hijo\b/);
    expect(row.en).not.toMatch(/\(polite\)/);
    expect(row.en).toMatch(/\(to a friend\)/);
  });

  test('no line tagged "(polite)" addresses someone as tú, with tu, tus, ti or contigo', () => {
    // two rows are about the word itself ("de tú o de usted")
    const ABOUT_THE_WORD = new Set(['u42-1261', 'u42-1263']);
    const bad: string[] = [];
    for (const f of readdirSync(join(CONTENT, 'bank')).filter((n) => /^u\d+\.json$/.test(n))) {
      for (const r of JSON.parse(readFileSync(join(CONTENT, 'bank', f), 'utf8')) as BankSentence[]) {
        if (!r.en.includes('(polite)') || ABOUT_THE_WORD.has(r.id)) continue;
        const es = r.es.split('\n'), en = r.en.split('\n');
        es.forEach((line, i) => { if (en[i]?.includes('(polite)') && /\b(tu|tus|tú|ti|contigo)\b/i.test(line)) bad.push(`${r.id}: ${line}`); });
      }
    }
    expect(bad).toEqual([]);
  });
});
