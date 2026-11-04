// The port must tag exactly as the rebuild's tagger does: same options, same sentences, same output.
import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tagSentence } from '../../../lib/tagger';
import { tagSentence as appTag } from '../../../app/src/engine/tagger';
import { APP_DIR, loadCurriculum, readUnits } from './fixture';
import { castNames } from '../../../lib/graph';

describe('parity with app/src/engine/tagger', () => {
  const cur = loadCurriculum();                         // registers lexemes in the lib's lexicon
  const sents: string[] = [];
  const dir = join(APP_DIR, 'content/bank');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const d = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (Array.isArray(d)) for (const r of d) if (typeof r?.es === 'string') sents.push(r.es);
  }
  const sample = sents.filter((_, i) => i % Math.max(1, Math.floor(sents.length / 400)) === 0);
  test('sample of bank sentences tag identically', () => {
    // the app's lexicon needs the same registrations
    const opts = { ...cur.tagOpts };
    const lexemes = [...cur.nodes.values()].filter((n) => n.kind === 'lexeme');
    return import('../../../app/src/engine/tagger').then(({ registerLexemes, registerNames }) => {
      registerNames(castNames(readUnits().map((u) => u.storyArc ?? '').join(' ')));
      registerLexemes(lexemes.map((n) => ({ lemma: n.id.replace(/^l:/, '').replace(/#.*/, ''), pos: n.pos, gender: n.gender })));
      expect(sample.length).toBeGreaterThan(100);
      for (const s of sample) {
        const a = tagSentence(s, opts), b = appTag(s, opts);
        expect({ r: a.requires, c: a.confidence, l: a.lowReasons, f: a.features.map((f) => [f.key, f.node, f.span]) }, s)
          .toEqual({ r: b.requires, c: b.confidence, l: b.lowReasons, f: b.features.map((f) => [f.key, f.node, f.span]) });
      }
    });
  });
});
