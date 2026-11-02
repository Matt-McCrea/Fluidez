// Tap-to-gloss in the reader (audit C11, R1, LG-001, LG-004, LG-005, LG-007):
// a tap answers about the word tapped, in the sentence it was tapped in. A
// phrase note is shown only where its phrase covers the tapped word, a name
// is a name, and the loose lookup never swaps endings between unrelated words.
import { beforeAll, describe, expect, it } from 'vitest';
import type { StoryChapter } from '../../src/content/schema';
import { analyzeToken, deaccent } from '../../src/engine';
import { ContentLoader } from '../../src/ui/data/loader';
import { normWord, SMALL_WORDS, stripArticle, type Bundle, type Gloss, type TapAt } from '../../src/ui/data/bundle';

let b: Bundle;
beforeAll(async () => { b = await new ContentLoader().load({}); }, 120_000);

const wordsOf = (s: string): string[] => (s.match(/\p{L}+/gu) ?? []).map(normWord);

interface Tap { word: string; at: TapAt }
/** Every word of a chapter as the reader would send it: the word, its line and its place in that line. */
function taps(ch: StoryChapter): Tap[] {
  const out: Tap[] = [];
  for (const line of ch.text.split(/\n+/).filter((l) => l.trim())) {
    (line.match(/\p{L}+/gu) ?? []).forEach((word, index) => out.push({ word, at: { line, index } }));
  }
  return out;
}

/** The nth tap of `word` in the first line of the chapter that contains `inLine`. */
function tapIn(chapter: string, inLine: string, word: string, nth = 0): { ch: StoryChapter; tap: Tap } {
  const ch = b.chapters.get(chapter)!;
  const line = ch.text.split(/\n+/).find((l) => l.includes(inLine))!;
  expect(line, `${chapter} has a line with "${inLine}"`).toBeTruthy();
  const hits = taps(ch).filter((t) => t.at.line === line && t.word === word);
  return { ch, tap: hits[nth] };
}
const gloss = (chapter: string, inLine: string, word: string, nth = 0): Gloss | undefined => {
  const { ch, tap } = tapIn(chapter, inLine, word, nth);
  return b.gloss(tap.word, ch, tap.at);
};

describe('a phrase note belongs to the words it covers', () => {
  it('"la" in "Tomás lleva una carta en la mano." is not the note about the café door', () => {
    const g = gloss('ch001', 'Tomás lleva una carta', 'la');
    expect(g?.en).toBeTruthy();
    expect(g?.en).not.toMatch(/café/);
    expect(g?.phrase?.en ?? '').not.toMatch(/café/);
  });
  it('"la" inside the phrase it belongs to shows the word, then the phrase', () => {
    const g = gloss('ch001', 'Tomás está en la puerta', 'la');
    expect(g?.en).toBe('the');
    expect(g?.phrase?.es).toBe('en la puerta del café de Rosa');
  });
  it('a word with no word note of its own shows the phrase as the note', () => {
    const g = gloss('ch001', 'Don Hernando, buenos', 'Hernando');
    expect(g?.es).toBe('Don Hernando');
    expect(g?.en).toMatch(/^Mr Hernando/);
    expect(g?.name).toBeUndefined();
  });
  it('the same word twice in a line: only the occurrence inside the phrase gets the phrase', () => {
    const ch = { ...b.chapters.get('ch001')!, gloss: [{ es: 'en la puerta', en: 'at the door' }] } as StoryChapter;
    const line = 'Tomás está en la puerta y la carta llega.';
    expect(b.gloss('la', ch, { line, index: 3 })?.phrase?.en).toBe('at the door');
    const outside = b.gloss('la', ch, { line, index: 6 });
    expect(outside?.phrase).toBeUndefined();
    expect(outside?.en).toBe('the');
  });
  it('without a place in the text, no phrase note is shown at all', () => {
    const ch = b.chapters.get('ch001')!;
    expect(b.gloss('la', ch)?.phrase).toBeUndefined();
    expect(b.gloss('la', ch)?.en).toBe('the');
  });
  it('a phrase that runs over two sentences of one line still covers its words', () => {
    const ch = { ...b.chapters.get('ch001')!, gloss: [{ es: 'Herrera? ¿Usted es', en: 'Herrera? Are you' }] } as StoryChapter;
    const line = '¿Herrera? ¿Usted es el nieto?';
    expect(b.gloss('Usted', ch, { line, index: 1 })?.phrase?.en).toBe('Herrera? Are you');
    expect(b.gloss('nieto', ch, { line, index: 4 })?.phrase).toBeUndefined();
  });
});

describe('names are names', () => {
  it('Ana is not "anus"', () => {
    const g = gloss('ch214', 'Doña Ana Rita', 'Ana');
    expect(g?.name).toBe(true);
    expect(g?.en).not.toMatch(/anus/);
    expect(g?.es).toBe('Ana');
  });
  it('Tomás is not "to take" and Vale is not "to be worth", at the start of a line and of a sentence', () => {
    for (const [word, bad] of [['Tomás', /take/], ['Vale', /worth/], ['Gloria', /glory/]] as const) {
      const ch = [...b.chapters.values()].find((c) => c.text.includes(`${word}:`))!;
      const hits = taps(ch).filter((t) => t.word === word);
      expect(hits.length).toBeGreaterThan(0);
      for (const t of hits) {
        const g = b.gloss(t.word, ch, t.at);
        expect(g?.en ?? '', `${word} in ${ch.id}`).not.toMatch(bad);
        expect(g?.name || g?.phrase || g?.en, `${word} in ${ch.id}`).toBeTruthy();
      }
    }
  });
  it('a verb form that looks like a plural stays a verb: estés is estar, not este', () => {
    expect(b.gloss('estés')?.es).toMatch(/estar/);
  });
  it('a role that speaks is a word, not a name: Vendedor, Policía', () => {
    expect(b.gloss('Vendedor')?.name).toBeUndefined();
    expect(b.gloss('Vendedor')?.en).toMatch(/seller/);
    expect(b.gloss('Policía')?.name).toBeUndefined();
  });
  it('a word that is also a name is still a word when it is not capitalised', () => {
    const g = b.gloss('vale');
    expect(g?.en).toMatch(/worth/);
    expect(b.gloss('gloria')?.en).toMatch(/glory/);
  });
  it('a chapter note on a name wins over the plain "a name"', () => {
    const g = gloss('ch001', 'Herrera? ¿Usted', 'Herrera');
    expect(g?.en).toMatch(/surname/);
  });
});

describe('the loose lookup does not swap endings between unrelated words', () => {
  // LG-007: each of these used to come back as an unrelated lemma, stated as a derivation
  const wrong: Array<[string, RegExp]> = [
    ['calla', /street/], ['callas', /street/], ['lentes', /slow/], ['pera', /but/], ['aceras', /steel/], ['Cuba', /bucket/],
    ['mama', /mom/], ['carné', /meat/], ['dañó', /damage/], ['daña', /damage/], ['cuarta', /room|bedroom/], ['dicha', /saying/],
    ['arrienda', /\brent\b|lease/], ['odia', /hat/], ['engaña', /deceit|trick/], ['clavó', /nail/],
  ];
  for (const [word, bad] of wrong) {
    it(`${word} is not glossed as an unrelated word`, () => {
      const g = b.gloss(word);
      expect(g?.en ?? '').not.toMatch(bad);
    });
  }
  it('still reads a feminine or plural adjective back to its masculine singular', () => {
    expect(b.gloss('alta')?.es).toBe('alto');
    expect(b.gloss('cuarta')?.en).toBe('fourth');
    expect(b.gloss('otras')?.es).toBe('otro');
    expect(b.gloss('mía')?.es).toBe('mío');
  });
  it('reads the feminine of a person back to the masculine, but not a look-alike', () => {
    expect(b.gloss('abogada')?.es).toMatch(/abogado/);
    expect(b.gloss('presidenta')?.es).toMatch(/presidente/);
    expect(b.gloss('socia')?.es).toMatch(/socio/);
    expect(b.gloss('vendedora')?.es).toMatch(/vendedor/);
    for (const word of ['pala', 'puesta', 'premia', 'acera']) expect(b.gloss(word)?.form, word).toBeUndefined();
  });
  it('still reads a plural noun back, even where the accent moves', () => {
    expect(b.gloss('casas')?.es).toMatch(/casa/);
    expect(b.gloss('habitaciones')?.es).toMatch(/habitaci/);
    expect(b.gloss('veces')?.es).toBe('la vez');
    expect(b.gloss('jóvenes')?.es).toMatch(/joven/);
  });
  it('a noun never takes the ending of another noun: la is not lo, and las is not la', () => {
    expect(b.gloss('la')?.en).toBe('the');
    expect(b.gloss('las')?.en).toBe('the');
    expect(b.gloss('los')?.en).toBe('the');
    expect(b.gloss('una')?.en).toMatch(/^a, an/);
  });
});

describe('a note says only what the word can be in this sentence', () => {
  it('a form shared by "I" and "he or she" names both: the horario de Rosa is not "I"', () => {
    const era = gloss('ch004', 'El horario de Rosa era', 'era');
    expect(era?.how).toBe('I or he or she, imperfect');
    expect(b.gloss('tenía')?.how).toBe('I or he or she, imperfect');
    expect(b.gloss('habría')?.how).toBe('I or he or she, conditional');
    expect(b.gloss('sea')?.how).toBe('I or he or she, present subjunctive');
  });
  it('a form that has one person still names one', () => {
    expect(b.gloss('tengo')?.how).toBe('I, present');
    expect(b.gloss('tiene')?.how).toBe('he or she, present');
    expect(b.gloss('llegó')?.how).toBe('he or she, preterite');
  });
  it('no "I" alone on a form the engine also reads as he or she, in any chapter', () => {
    const bad: string[] = [];
    for (const ch of b.chapters.values()) {
      for (const t of taps(ch)) {
        const g = b.gloss(t.word, ch, t.at);
        if (!g?.how?.startsWith('I,')) continue;
        const exact = analyzeToken(normWord(t.word)).filter((r) => r.target && r.accentExact);
        if (exact.some((r) => r.person === 'él/ella')) bad.push(`${ch.id} ${t.word}: ${g.how}`);
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
  }, 180_000);
  it('sé is "I know": the story never uses it as the command of ser', () => {
    for (const word of ['sé', 'Sé']) {
      const g = b.gloss(word);
      expect(g?.es, word).toBe('saber');
      expect(g?.en, word).toMatch(/know/);
      expect(g?.how, word).toBe('I, present');
    }
    expect(gloss('ch004', 'No sé, don Hernando', 'sé')?.es).toBe('saber');
  });
  it('fue says it can be ser or ir: "fue a Medellín" is not "to be"', () => {
    for (const word of ['fue', 'fui', 'fueron', 'fuimos', 'fuiste']) {
      expect(b.gloss(word)?.how, word).toMatch(/or from ir: to go/);
    }
    expect(b.gloss('ve')?.how).toMatch(/or from ver: to see/);
    expect(b.gloss('siéntese')?.how).toMatch(/or from sentar/);
  });
  it('a rare look-alike does not crowd the note: vendo is vender, and nothing about bandages', () => {
    for (const word of ['vendo', 'vende', 'creo', 'pare']) expect(b.gloss(word)?.how, word).not.toMatch(/or from/);
  });
  it('a verb and its reflexive are one verb to the note: voy is not "or from irse"', () => {
    for (const word of ['voy', 'va', 'iba', 'sentó', 'sentía']) expect(b.gloss(word)?.how, word).not.toMatch(/or from/);
  });
  it('an adjective is not a verb with its accent ignored: seria, pública', () => {
    const seria = gloss('ch004', 'muy seria', 'seria');
    expect(seria?.es).toBe('serio');
    expect(seria?.en).toMatch(/serious/);
    expect(seria?.how).toBeUndefined();
    expect(b.gloss('pública')?.es).toBe('público');
    expect(b.gloss('pública')?.en).toMatch(/public/);
  });
  it('a verb with its accent ignored is still better than no note', () => {
    expect(b.gloss('pagare')?.es).toBe('pagar');
  });
  it('a name is not a note on a common noun: Rosa in the chapter that glosses a rose', () => {
    const name = gloss('ch185', 'la casa de Rosa', 'Rosa');
    expect(name?.en).not.toMatch(/rose/);
    expect(name?.name || name?.phrase).toBeTruthy();
    expect(gloss('ch185', 'una rosa roja', 'rosa')?.en ?? '').not.toBe('a name');
    expect(b.gloss('rosa', b.chapters.get('ch185'))?.en).toBe('rose');
  });
  it('a name in a chapter that glosses the name itself keeps that note', () => {
    expect(gloss('ch166', 'Soy Lucía', 'Lucía')?.en).toMatch(/Hernando's daughter/);
  });
});

describe('la, las and los before a verb are object pronouns', () => {
  const ch = () => b.chapters.get('ch001')!;
  const at = (line: string, word: string) => ({ line, index: [...line.matchAll(/\p{L}+/gu)].findIndex((m) => m[0] === word) });
  const en = (line: string, word: string) => b.gloss(word, ch(), at(line, word))?.en;
  it('"No la tengo" is not "the"', () => {
    for (const [line, word, re] of [['No la tengo.', 'la', /her, it/], ['Tomás la leyó.', 'la', /her, it/], ['Yo las conté.', 'las', /them/], ['Vale los miró.', 'los', /them/]] as const) {
      expect(en(line, word), line).toMatch(re);
    }
  });
  it('before a noun or an adjective it is the article', () => {
    for (const [line, word] of [['Tomás abre la puerta.', 'la'], ['Tomás abre la primera puerta.', 'la'], ['Son las cuentas.', 'las'], ['Son las siete.', 'las'], ['Vio los libros.', 'los']] as const) {
      expect(en(line, word), line).toBe('the');
    }
  });
  it('a word that only looks like a verb keeps the article in the note', () => {
    expect(en('Pagó la multa.', 'la')).toMatch(/\bthe\b/);
  });
  it('it is the article when the verb is not the next thing in the line', () => {
    expect(en('A las 8:20 llega Vale.', 'las')).toBe('the');
    expect(en('Ella busca la. Tengo', 'la')).toBe('the');
  });
  it('with no place in the text it says the article, the commonest reading', () => {
    expect(b.gloss('la', ch())?.en).toBe('the');
  });
});

describe('the small words have notes', () => {
  for (const [word, en] of [['del', /of the/], ['al', /to the/], ['hay', /there is/], ['Hay', /there is/], ['primer', /first/], ['ningún', /no|none/], ['veces', /time/]] as const) {
    it(word, () => { expect(b.gloss(word)?.en).toMatch(en); });
  }
});

/** The headwords of a note, the way the word list spells them ("el/la turista"). */
const headwords = (g: Gloss): string[] => g.es.split(/[/;,]/).map((x) => normWord(stripArticle(x))).filter(Boolean);
/** The word without its ending: plural, feminine or masculine (veces and vez, alta and alto, jóvenes and joven). */
const stem = (s: string): string => deaccent(s).replace(/z/g, 'c').replace(/[aeos]+$/, '');

/** Does this note, which names a word, belong to the word tapped? */
function relates(tapped: string, g: Gloss): boolean {
  const w = normWord(tapped);
  const heads = headwords(g);
  if (heads.includes(w) || heads.some((h) => stem(h) === stem(w))) return true;
  // the little words the word list has no headword for
  const small = SMALL_WORDS[w];
  if (small && (!small.of || heads.includes(small.of))) return true;
  if (g.form) {
    // a form of a verb: the engine reads the tapped word as that verb
    const infs = new Set(analyzeToken(w).filter((r) => r.target).map((r) => r.inf.replace(/se$/, '')));
    if (heads.some((h) => infs.has(h.replace(/se$/, '')))) return true;
  }
  return false;
}

describe('every tap in every chapter', () => {
  it('shows a note that belongs to the word tapped', () => {
    let taps_ = 0, none = 0, phrases = 0, names = 0, words = 0;
    const bad: string[] = [];
    for (const ch of b.chapters.values()) {
      for (const t of taps(ch)) {
        taps_++;
        const g = b.gloss(t.word, ch, t.at);
        if (!g) { none++; continue; }
        const tag = `${ch.id} ${t.word} (${t.at.index}) in "${t.at.line.slice(0, 60)}" -> ${g.es}: ${g.en}`;
        // 1. a phrase layer covers the word tapped, in this line
        const layer = g.phrase ?? (ch.gloss.includes(g as never) && wordsOf(g.es).length > 1 ? g : undefined);
        if (layer) {
          phrases++;
          const p = wordsOf(layer.es);
          const line = wordsOf(t.at.line);
          const covers = line.some((_, s) => s <= t.at.index && t.at.index < s + p.length && p.every((x, j) => line[s + j] === x));
          if (!covers) bad.push(`phrase off its word: ${tag}`);
        }
        if (g.phrase && g.name) bad.push(`name with a phrase layer: ${tag}`);
        if (layer === g) continue;
        // 2. a name is capitalised in the text
        if (g.name) { names++; if (t.word === t.word.toLowerCase()) bad.push(`lower case name: ${tag}`); continue; }
        // 3. anything else is about this very word
        words++;
        const single = ch.gloss.includes(g as never) && wordsOf(g.es).length === 1 && wordsOf(g.es)[0] === normWord(t.word);
        if (!single && !relates(t.word, g)) bad.push(`not this word: ${tag}`);
      }
    }
    console.log(`taps ${taps_}: phrase layer ${phrases}, names ${names}, word notes ${words}, no note ${none}`);
    expect(bad.slice(0, 40)).toEqual([]);
    expect(bad.length).toBe(0);
  }, 180_000);
});
