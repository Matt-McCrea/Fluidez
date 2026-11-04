import { describe, expect, test } from 'vitest';
import { tagAll } from '../../../lib/tagger/tagAll';
import { tagSentence, splitSentences } from '../../../lib/tagger';
import { loadCurriculum, readGraphFiles } from './fixture';

describe('tagAll', () => {
  const rows = [
    { id: 'a', es: 'Quiero que vengas mañana.' },
    { id: 'b', es: 'Me llamo Ana. Tengo veinte años.' },
    { id: 'c', es: 'El blorpo es grande.' },
    { id: 'd', es: 'Quiero un café.', targets: ['g:present-ar'] },
  ];
  const out = tagAll(readGraphFiles(), rows);
  test('one result per row, matching direct tagging of each sentence', () => {
    const cur = loadCurriculum();
    expect(out.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd']);
    for (const [i, row] of rows.entries()) {
      const want = new Set<string>();
      for (const s of splitSentences(row.es)) for (const x of tagSentence(s, cur.tagOpts).requires) want.add(x);
      expect(out[i].requires).toEqual([...want].sort());
    }
  });
  test('multi-sentence rows union their requires', () => {
    expect(out[1].requires.some((x) => x.startsWith('c:'))).toBe(true);
  });
  test('unknown words make the row low confidence with a reason', () => {
    expect(out[2].confidence).toBe('low');
    expect(out[2].lowReasons.length).toBeGreaterThan(0);
    expect(out[0].confidence).toBe('high');
  });
  test('focus is a span into the row text for the first target, null when absent', () => {
    const f = out[0].focus;
    expect(f).not.toBeNull();
    expect(rows[0].es.slice(...f!.span).length).toBeGreaterThan(0);
    const second = out[1].focus;
    if (second) expect(rows[1].es.slice(...second.span).length).toBeGreaterThan(0);
    expect(tagAll(readGraphFiles(), [{ id: 'z', es: 'Hola.', targets: ['g:nope'] }])[0].focus).toBeNull();
  });
});
