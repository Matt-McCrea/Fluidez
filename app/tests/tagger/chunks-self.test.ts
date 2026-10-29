// Every chunk must match its own example forms: tagging a fragment of a chunk's `es`
// finds that chunk, and nothing in the fragment needs grammar beyond what the chunk
// covers (its words are lexemes, known separately).
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tagSentence, type ChunkSpec } from '../../src/engine/tagger';
import { APP_DIR } from '../../tools/gate';

const chunks = JSON.parse(readFileSync(join(APP_DIR, 'content/graph/chunks.json'), 'utf8')) as Array<{ id: string; es?: string }>;
const specs: ChunkSpec[] = chunks.filter((c) => c.es).map((c) => ({ id: c.id, es: c.es! }));

/** The chunk's example forms: fragments between / — … and punctuation, as the matcher cuts them
 *  ("Es caro, ¿verdad?" gives "Es caro" — context, not the chunk — and "verdad", the chunk). */
function examples(es: string): string[] {
  return es.replace(/\([^)]*\)/g, ' ').split(/\s*\/\s*|—|–|…|[.,?!¿¡;:]/).map((s) => s.trim()).filter((s) => /[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(s));
}

describe('every chunk matches its own es', () => {
  for (const c of specs) {
    test(c.id, () => {
      const bad: string[] = [];
      let matched = 0;
      for (const ex of examples(c.es)) {
        const r = tagSentence(ex, { chunks: specs });
        const own = r.features.filter((f) => f.node === c.id);
        if (!own.length) continue;              // context or a set-up line ("¿Un tinto?") is not the chunk
        matched++;
        const spans = r.features.filter((f) => f.key.startsWith('chunk.')).map((f) => f.span);
        for (const f of r.features) {
          if (!f.node || f.node.startsWith('l:') || f.key.startsWith('chunk.')) continue;
          if (!spans.some(([a, b]) => f.span[0] >= a && f.span[1] <= b)) bad.push(`${ex} → ${f.node} "${f.text}"`);
        }
      }
      expect(matched, `${c.id} matches none of: ${examples(c.es).join(' | ')}`).toBeGreaterThan(0);
      expect(bad).toEqual([]);
    });
  }
});
