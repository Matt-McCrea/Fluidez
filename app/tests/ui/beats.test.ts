// Chapters cut into beats: whole sentences, readable lengths, every question placed once.
import { beforeAll, describe, expect, it } from 'vitest';
import type { Bundle } from '../../src/ui/data/bundle';
import { ContentLoader } from '../../src/ui/data/loader';
import { countWords, sentencesOf, splitBeats } from '../../src/ui/session/beats';

let bundle: Bundle;
beforeAll(async () => { bundle = await new ContentLoader().load({ band: 'A1' }); }, 60_000);

const ids = Array.from({ length: 14 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

describe('splitBeats on the real chapters', () => {
  it.each(ids)('%s: 60 to 160 words a beat, no sentence broken, every question once', (id) => {
    const ch = bundle.chapters.get(id)!;
    const beats = splitBeats(ch.text, ch.questions);
    for (const b of beats) {
      expect(b.words).toBeGreaterThanOrEqual(60);
      expect(b.words).toBeLessThanOrEqual(160);
    }
    // the beats are the chapter's own sentences, in order, none cut
    expect(flat(beats.map((b) => b.text).join(' '))).toBe(flat(ch.text));
    const all = ch.text.split(/\n+/).flatMap((p) => sentencesOf(p.trim()));
    const got = beats.flatMap((b) => b.text.split(/\n+/).flatMap((p) => sentencesOf(p)));
    expect(got).toEqual(all);
    const placed = beats.flatMap((b) => b.questions).sort();
    expect(placed).toEqual(ch.questions.map((_, i) => i));
  });

  it('is deterministic', () => {
    const ch = bundle.chapters.get('ch008')!;
    expect(splitBeats(ch.text, ch.questions)).toEqual(splitBeats(ch.text, ch.questions));
  });
});

describe('splitBeats on small input', () => {
  const sentence = 'Tomás abre el café por la mañana y prepara el primer café del día para todos. ';
  it('a 90-word chapter is one beat holding every question', () => {
    const text = sentence.repeat(6).trim();
    expect(countWords(text)).toBeGreaterThanOrEqual(85);
    const beats = splitBeats(text, [{ q: 'Qué abre Tomás', answer: 0 }, { q: 'Who opens?', answer: 'Tomás' }]);
    expect(beats).toHaveLength(1);
    expect(beats[0].questions).toEqual([0, 1]);
  });
  it('questions that match nothing go after the last beat', () => {
    const text = (sentence.repeat(8) + '\n').repeat(3).trim();
    const beats = splitBeats(text, [{ q: 'Zzzz qqqq?', answer: 'xxxx' }]);
    expect(beats.length).toBeGreaterThan(1);
    expect(beats[beats.length - 1].questions).toEqual([0]);
  });
  it('assigns a question to the beat that holds its words', () => {
    const a = 'Valentina compra naranjas dulces en la plaza de mercado cada sábado. '.repeat(5);
    const b = 'Esteban repara bicicletas viejas en el garaje de su abuelo todos los días. '.repeat(5);
    const beats = splitBeats(`${a.trim()}\n${b.trim()}`, [{ q: 'Dónde repara bicicletas Esteban?', options: ['en el garaje', 'en la plaza'], answer: 0 }], { target: 60 });
    expect(beats).toHaveLength(2);
    expect(beats[1].questions).toEqual([0]);
  });
});
