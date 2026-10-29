// Every card built from a real chunk or lexeme (content/graph/chunks.json,
// lexemes.json) asks about ONE aligned pair: the English shown is the exact
// translation of the Spanish expected. Checked structurally against the raw
// strings: the Spanish and the English come from the same turn, the same
// variant and the same sentence of their node; a lexeme's cue is its gloss
// and its answer the word itself (with article), never a sentence.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import type { LearnItem, ReviewItem, RecallItem } from '../../src/compiler';
import type { GraphNode } from '../../src/content/schema';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { learnRetrieval, MEANS, recallCard, reviewCard, SAY, type Card } from '../../src/ui/session/cards';

const GRAPH = join(__dirname, '../../content/graph');
const read = (f: string) => JSON.parse(readFileSync(join(GRAPH, f), 'utf8')) as GraphNode[];
const chunks = read('chunks.json');
const lexemes = read('lexemes.json');

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

/** Where a fragment sits in a raw node string: turn, variant, sentence (-1 = the whole variant). */
function position(fragment: string, rawIn: string): Array<[number, number, number]> {
  const out: Array<[number, number, number]> = [];
  const raw = rawIn.replace(/\/\s*[\u2014\u2013]\s*/g, '/ '); // "A. / \u2014B." is a variant, not a turn
  const turns = raw.split(/\s+[—–]\s*|^\s*[—–]\s*/).map((t) => t.trim()).filter(Boolean);
  turns.forEach((t, ti) => {
    t.split(/\s+\/\s+/).forEach((alt, ai) => {
      const a = alt.trim();
      const body = a.replace(/^[^.?!¿¡:]{1,140}:\s+/u, '');
      if (a === fragment || body === fragment) out.push([ti, ai, -1]);
      body.split(/(?<=[.?!…])\s+(?=[¿¡"“«A-ZÁÉÍÓÚÑ])/u).forEach((sent, si) => { if (sent.trim() === fragment) out.push([ti, ai, si]); });
      // the whole variant re-joined from its sentences
      if (body.replace(/\s+/g, ' ') === fragment.replace(/\s+/g, ' ')) out.push([ti, ai, -1]);
    });
  });
  return out;
}

/** The (Spanish, English) a card asks about, if it asks about one. */
function pairOf(card: Card): { es: string; en: string } | undefined {
  if (card.type === 'mcq' && card.prompt) {
    const right = card.options[card.answer];
    if (card.prompt.lang === 'es' && right.lang === 'en') return { es: card.prompt.text, en: right.text };
    if (card.prompt.lang === 'en' && right.lang === 'es') return { es: right.text, en: card.prompt.text };
  }
  if (card.type === 'type' && card.prompt?.lang === 'en' && card.answerLang === 'es') return { es: card.check('\u0000').answer, en: card.prompt.text };
  return undefined;
}

function cardsFor(n: GraphNode): Card[] {
  const learn: LearnItem = { op: 'learn', id: `ln:${n.id}`, node: n.id, nodeKind: n.kind, retrievals: 4, productive: true, scoring: 'learning', credit: [n.id] };
  const bare = (direction: 'receptive' | 'productive'): ReviewItem => ({ op: 'review', id: `rv:${n.id}:${direction}:bare`, node: n.id, direction, novel: false, scoring: 'review', credit: [n.id] });
  const recall: RecallItem = { op: 'recall', id: `tr:${n.id}`, node: n.id, direction: 'productive', scoring: 'exposure', credit: [n.id] };
  return [0, 1, 2, 3, 4].map((r) => learnRetrieval(learn, b, r)).concat(reviewCard(bare('receptive'), b), reviewCard(bare('productive'), b), recallCard(recall, b));
}

describe('chunk cards ask about aligned pairs only', () => {
  it('every chunk card', { timeout: 60_000 }, () => {
    const bad: string[] = [];
    let checked = 0;
    for (const n of chunks) {
      if (!b.node(n.id)?.es) continue;
      for (const card of cardsFor(b.node(n.id)!)) {
        const p = pairOf(card);
        if (!p) continue;
        checked++;
        const pe = position(p.es, n.es!);
        const pn = position(p.en, n.en ?? n.title);
        const same = pe.some(([t, a, s]) => pn.some(([t2, a2, s2]) => t === t2 && (a === a2 || (a === 0 && a2 === 0)) && (s === s2 || (s <= 0 && s2 <= 0))));
        if (!same) bad.push(`${n.id}: "${p.en}" -> "${p.es}"  (es ${JSON.stringify(pe)} en ${JSON.stringify(pn)})`);
        // the shown answer passes its own check
        if (card.type === 'type' && !card.check(p.es).pass) bad.push(`${n.id}: its own answer fails: ${p.es}`);
      }
    }
    expect(checked).toBeGreaterThan(chunks.length);
    expect(bad.slice(0, 20)).toEqual([]);
  });

  it('the examples from the playtest', () => {
    const avo = b.segments('c:a-como-esta');
    if (avo.length) {
      for (const p of avo) expect(p.es === '¿A cómo la libra?').toBe(p.en === 'How much a pound?');
    }
    for (const n of chunks) for (const p of b.segments(n.id)) expect(p.en, n.id).not.toMatch(/^the\b/); // never an elliptical fragment as a cue
  });
});

describe('lexeme cards: the gloss, and the word with its article', () => {
  it('every lexeme card', { timeout: 60_000 }, () => {
    const bad: string[] = [];
    for (const n of lexemes) {
      const node = b.node(n.id);
      if (!node?.es || !node.en) continue;
      const word = node.es.split(/\s*[/;]\s*/)[0].trim();
      const bare = word.replace(/^(el|la|los|las|un|una)\s+/i, '').toLowerCase();
      // the gloss, minus a parenthetical that would give the word away ("which (el cual)")
      const has = (x: string) => x.toLowerCase().split(/[^\p{L}]+/u).includes(bare);
      const gloss = (node.en.replace(/\s*\(([^)]*)\)/g, (m, inner: string) => (has(inner) ? '' : m))
        .split(/\s*;\s*/).filter((x) => x && !has(x)).join('; ').trim() || node.en)
        .split(/\s+\/\s+/).join(', ');
      for (const card of cardsFor(node)) {
        const p = pairOf(card);
        if (!p) continue;
        if (p.es !== word || p.en !== gloss) bad.push(`${n.id}: "${p.en}" -> "${p.es}" (want "${gloss}" -> "${word}")`);
        if (card.type === 'type' && !card.check(word).pass) bad.push(`${n.id}: its own answer fails`);
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
  });
});

describe('prompt wording', () => {
  it('asks naturally and never shows the answer in the prompt', { timeout: 60_000 }, () => {
    const asks = new Set<string>();
    for (const n of [...chunks, ...lexemes]) {
      const node = b.node(n.id);
      if (!node) continue;
      for (const card of cardsFor(node)) {
        asks.add(card.ask);
        const p = pairOf(card);
        // a gloss that is the same word in English ("grave": serious, grave) is not a giveaway
        const sameWord = /^[a-z]+$/.test(p?.es.toLowerCase() ?? '');
        if (p && card.prompt?.lang === 'en' && p.es.length >= 3 && !sameWord) {
          const esc = p.es.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          expect(card.prompt.text.toLowerCase(), n.id).not.toMatch(new RegExp(`(^|[^\\p{L}])${esc}($|[^\\p{L}])`, 'u'));
        }
      }
    }
    for (const a of asks) expect(a).not.toMatch(/which one means|translate:/i);
    expect([...asks]).toEqual(expect.arrayContaining([MEANS, SAY]));
  });
});
