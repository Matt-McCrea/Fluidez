// Every chunk reaches a card as aligned pairs. The schema says a chunk's
// `forms` are "aligned translation pairs; cards use these", so every form must
// come out as a pair (before this only es/en reached a card: 229 of 607 forms),
// and no pair may put an English line beside a Spanish line that is not its
// translation (docs/swarm-audit, C18 and LG-048). The oracle here reads the
// raw strings itself and does not call the aligner's own helpers.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { GraphNode } from '../../src/content/schema';
import { alignedPairs } from '../../src/exercises/pairs';

const chunks = JSON.parse(readFileSync(join(__dirname, '../../content/graph/chunks.json'), 'utf8')) as GraphNode[];
const byId = new Map(chunks.map((n) => [n.id, n]));

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
const SENTENCE = /(?<=[.?!…])\s+(?=[¿¡"“«A-ZÁÉÍÓÚÑ])/u;
/** The sentences of a string, a sentence repeated straight after itself counted once. */
const sentences = (s: string) => s.split(SENTENCE).map((x) => x.trim()).filter(Boolean).filter((x, i, a) => i === 0 || norm(x) !== norm(a[i - 1]));

/** The (es, en) strings a chunk's author wrote as translations of each other: its forms, or the node's own es/en. */
const authored = (n: GraphNode) => (n.forms?.length ? n.forms : [{ es: n.es ?? '', en: n.en ?? n.title ?? '' }]);

/** Is this pair the whole of an authored line, or the same sentence of both sides of one? */
function authoredPair(n: GraphNode, es: string, en: string): boolean {
  return authored(n).some((f) => {
    if (norm(f.es) === norm(es) && norm(f.en) === norm(en)) return true;
    const a = sentences(f.es);
    const b = sentences(f.en);
    return a.length === b.length && a.some((x, i) => norm(x) === norm(es) && norm(b[i]) === norm(en));
  });
}

describe('chunk cards', () => {
  test('there are chunks, and forms on most of them', () => {
    expect(chunks.length).toBeGreaterThan(300);
    expect(chunks.filter((n) => n.forms?.length).length).toBeGreaterThan(200);
  });

  test('every form reaches a card', () => {
    const lost: string[] = [];
    let forms = 0;
    for (const n of chunks) {
      const reached = alignedPairs(n).flatMap((p) => [p.es, ...p.accept].map(norm)).join(' | ');
      for (const f of n.forms ?? []) {
        forms++;
        const en = sentences(f.en);
        sentences(f.es).forEach((sentence, i, all) => {
          // a name said on its own is the same in both languages: there is nothing to ask
          if (all.length === en.length && norm(sentence) === norm(en[i])) return;
          if (!reached.includes(norm(sentence))) lost.push(`${n.id}: ${sentence}`);
        });
      }
    }
    expect(forms).toBeGreaterThan(600);
    expect(lost.slice(0, 20)).toEqual([]);
  });

  test('no pair puts an English line beside a Spanish line that is not its translation', () => {
    const bad: string[] = [];
    let pairs = 0;
    for (const n of chunks) {
      for (const p of alignedPairs(n)) {
        pairs++;
        if (!authoredPair(n, p.es, p.en)) bad.push(`${n.id}: "${p.en}" -> "${p.es}"`);
        // the other Spanish accepted for a cue is the translation of that same English
        for (const alt of p.accept) if (!authoredPair(n, alt, p.en)) bad.push(`${n.id}: accepts "${alt}" for "${p.en}"`);
      }
    }
    expect(pairs).toBeGreaterThan(chunks.length);
    expect(bad.slice(0, 20)).toEqual([]);
  });

  test('a pair is never repeated', () => {
    const repeated: string[] = [];
    for (const n of chunks) {
      const seen = new Set<string>();
      for (const p of alignedPairs(n)) {
        for (const es of [p.es, ...p.accept].map(norm)) {
          if (seen.has(es)) repeated.push(`${n.id}: ${es}`);
          seen.add(es);
        }
      }
    }
    expect(repeated.slice(0, 20)).toEqual([]);
  });
});

describe('chunks the audit named', () => {
  const es = (id: string) => alignedPairs(byId.get(id)!).map((p) => p.es);
  const pair = (id: string, spanish: string) => alignedPairs(byId.get(id)!).find((p) => p.es === spanish);

  test('"Saying hello at any time of day" asks all four greetings', () => {
    expect(es('c:hola-buenos-dias')).toEqual(['Hola.', 'Buenos días.', 'Buenas tardes.', 'Buenas noches.']);
    expect(pair('c:hola-buenos-dias', 'Buenas tardes.')!.en).toBe('Good afternoon.');
  });

  test('the formal How are you? is its own card, marked formal', () => {
    expect(pair('c:como-estas', '¿Cómo está?')!.en).toBe('How are you? (formal)');
  });

  test('two Spanish for one English: the second answers the first', () => {
    const cost = alignedPairs(byId.get('c:cuanto-cuesta')!);
    const it = cost.find((p) => p.en === 'How much is it?')!;
    expect(it.es).toBe('¿Cuánto es?');
    expect(it.accept).toEqual(['¿Cuánto vale?']);
  });

  test('a repeated English sentence is not a third sentence', () => {
    expect(pair('c:a-largo-plazo', 'Es una inversión a largo plazo.')!.en).toBe("It's a long-term investment.");
    expect(pair('c:no-puedo-mas', '¡No lo aguanto más!')!.en).toBe('I can\'t stand it any more!');
  });

  test('a one-sentence Spanish form with a two-sentence English is paired whole, not by its first half', () => {
    expect(pair('c:que-pena', '¡Qué pena!')!.en).toBe('Sorry! How embarrassing!');
  });

  test('a chunk with no forms is never guessed at when its sides disagree', () => {
    const chunk = (es: string, en: string) => alignedPairs({ kind: 'chunk', es, en });
    // three sentences against two: which one is missing is not known, so nothing is asked
    expect(chunk('Uno. Dos. Tres.', 'One. Two.')).toEqual([]);
    // one sentence against two: the whole strings, not the first half of one of them
    expect(chunk('¡Qué pena!', 'Sorry! How embarrassing!')).toEqual([{ es: '¡Qué pena!', en: 'Sorry! How embarrassing!', accept: [] }]);
    // even counts pair sentence for sentence
    expect(chunk('Hola. Adiós.', 'Hi. Bye.').map((p) => p.en)).toEqual(['Hi.', 'Bye.']);
  });
});
