// L8: a miss shows the typed answer against the right version, word by word, using the alignment the hints use. Every miss with
// something typed gets one; the marks sit on the words that differ and on no others.
import type { ComponentChildren, VNode } from 'preact';
import { describe, expect, it } from 'vitest';
import { matchTranslation } from '../../src/check/translate';
import { DiffText } from '../../src/ui/components/card';
import { wordDiff } from '../../src/ui/session/diff';
import { WRONG } from '../translate/wrong-answers';

const marked = (pieces: Array<{ text: string; mark?: string }>) => pieces.filter((p) => p.mark).map((p) => `${p.text}:${p.mark}`);
const plain = (pieces: Array<{ text: string }>) => pieces.map((p) => p.text).join(' ');

describe('the words that differ are marked, and only those', () => {
  it('a word that is not the right one is marked on both sides', () => {
    const d = wordDiff('Soy aburrido.', 'Estoy aburrido.');
    expect(marked(d.typed)).toEqual(['Soy:off']);
    expect(marked(d.right)).toEqual(['Estoy:off']);
    expect(d.same).toBe(false);
  });
  it('an extra word is marked in the answer, and a missing one in the right version', () => {
    const extra = wordDiff('Estoy buscando para mi llave.', 'Estoy buscando mi llave.');
    expect(marked(extra.typed)).toEqual(['para:off']);
    expect(marked(extra.right)).toEqual([]);
    const missing = wordDiff('Voy comer.', 'Voy a comer.');
    expect(marked(missing.typed)).toEqual([]);
    expect(marked(missing.right)).toEqual(['a:off']);
  });
  it('the right word with the wrong accents is marked apart from a wrong word', () => {
    const d = wordDiff('Mañana te llamare.', 'Mañana te llamaré.');
    expect(marked(d.typed)).toEqual(['llamare.:accent']);
    expect(marked(d.right)).toEqual(['llamaré.:accent']);
  });
  it('case and punctuation are not differences, and the words keep what they were written with', () => {
    const d = wordDiff('¿dónde queda la estación', '¿Dónde queda la estación?');
    expect(d.same).toBe(true);
    expect(marked(d.typed)).toEqual([]);
    expect(plain(d.typed)).toBe('¿dónde queda la estación');
    expect(plain(d.right)).toBe('¿Dónde queda la estación?');
  });
  it('a mark that stands alone stays with the word beside it', () => {
    expect(plain(wordDiff('¿ Dónde está ?', 'Dónde está').typed)).toBe('¿Dónde está?');
  });
  it('a word moved is a word out of place on both sides', () => {
    const d = wordDiff('Llamo te mañana', 'Te llamo mañana');
    expect(d.same).toBe(false);
    expect(marked(d.typed).length).toBeGreaterThan(0);
    expect(marked(d.right).length).toBeGreaterThan(0);
  });
  it('nothing typed has nothing to compare, and an answer equal to the right version has no marks', () => {
    expect(wordDiff('', 'Hola.').typed).toEqual([]);
    expect(wordDiff('Hola.', 'Hola.').same).toBe(true);
  });
});

describe('every miss gets one', () => {
  const misses = WRONG.flatMap((w) => w.bad.map((input) => ({ w, input })));
  it('each wrong answer of the contrastive battery, against the right version the matcher shows', () => {
    expect(misses.length).toBeGreaterThan(200);
    for (const { w, input } of misses) {
      const r = matchTranslation(input, { es: w.es, en: w.en, accept: w.accept }, { accents: 'lenient' });
      expect(r.pass, input).toBe(false);
      const d = wordDiff(input, r.closest);
      expect(d.same, `${input} / ${r.closest}`).toBe(false);
      expect(marked(d.typed).length + marked(d.right).length, `${input} / ${r.closest}`).toBeGreaterThan(0);
    }
  });
});

/** The text and the marks a component's output carries, as the screen would show them. */
function shown(node: ComponentChildren): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(shown).join('');
  const v = node as VNode<{ children?: ComponentChildren; class?: string }>;
  const inner = shown(v.props.children);
  if (v.type === 'mark') return `[${inner}|${v.props.class}]`;
  if (typeof v.type === 'function') return shown((v.type as (p: unknown) => ComponentChildren)(v.props));
  return inner;
}

describe('DiffText', () => {
  it('writes the words as they were, a space between, and a mark element on the ones that differ', () => {
    const d = wordDiff('Soy aburrido.', 'Estoy aburrido.');
    expect(shown(DiffText({ pieces: d.typed }))).toBe('[Soy|diff off] aburrido.');
    expect(shown(DiffText({ pieces: d.right }))).toBe('[Estoy|diff off] aburrido.');
    expect(shown(DiffText({ pieces: wordDiff('llamare', 'llamaré').right }))).toBe('[llamaré|diff accent]');
  });
});
