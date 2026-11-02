// The card of a contrast item is asked in the form what decides the contrast calls for (R10): a forced choice and then
// a typed gap for a cue, a situation for a meaning, the whole sentence typed from the English for aspect, a phrase typed
// for a near-synonym. Nothing is a card that only shows, and nothing runs against a clock.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ContrastFile, type ContrastDecides, type ContrastItem } from '../../src/content/schema';
import { claimOffered } from '../../src/ui/components/card';
import { blanked, contrastCard, contrastForm, contrastFormAt, filled } from '../../src/ui/session/contrast-card';

const DIR = join(__dirname, '../../content/contrasts');
const files: ContrastFile[] = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort().map((f) => ContrastFile.parse(JSON.parse(readFileSync(join(DIR, f), 'utf8'))));
const item = (over: Partial<ContrastItem> = {}): ContrastItem => ({
  id: 'x:t#1', node: 'x:t', side: 'g:a', rung: 1, en: 'Thanks for the present.', es: 'Gracias por el regalo.', gap: [8, 11], options: ['para', 'por'], answer: 1, why: 'Thanks looks back at what someone did.', requires: [], ...over,
});

describe('how a contrast is asked', () => {
  it('a cue is a choice for recognition and a typed gap for production', () => {
    expect(contrastForm('local', 'receptive')).toBe('choose');
    expect(contrastForm('local', 'productive')).toBe('type');
    expect(contrastForm('meaning', 'receptive')).toBe('choose');
    expect(contrastForm('meaning', 'productive')).toBe('type');
  });

  it('aspect and near-synonyms are typed either way round, never a choice between two buttons', () => {
    for (const d of ['discourse', 'synonym'] as const) for (const dir of ['receptive', 'productive'] as const) expect(contrastForm(d, dir)).toBe('type');
    for (let k = 0; k < 6; k++) expect(contrastFormAt('discourse', k, 6)).toBe('type');
  });

  it('a run is a choice first and typed after, for a cue or a meaning', () => {
    expect([0, 1, 2, 3, 4, 5].map((k) => contrastFormAt('local', k, 6))).toEqual(['choose', 'choose', 'choose', 'type', 'type', 'type']);
    expect([0, 1].map((k) => contrastFormAt('meaning', k, 2))).toEqual(['choose', 'type']);
  });
});

describe('the cards', () => {
  it('a cue as a choice shows the sentence with its place blank and the English beneath, and the words as options', () => {
    const c = contrastCard(item(), 'local', { key: 'k', form: 'choose' });
    expect(c.type).toBe('mcq');
    if (c.type !== 'mcq') return;
    expect([c.prompt?.text, c.sub?.text]).toEqual(['Gracias ___ el regalo.', 'Thanks for the present.']);
    expect(c.options.map((o) => o.text)).toEqual(['para', 'por']);
    expect(c.options[c.answer].text).toBe('por');
    expect(c.why).toBe('Thanks looks back at what someone did.');
  });

  it('an item the sentence alone decides, for a cue, hides the English (the gap alone)', () => {
    const c = contrastCard(item({ rung: 2 }), 'local', { key: 'k', form: 'choose' });
    expect(c.sub).toBeUndefined();
    // but for a contrast a meaning decides, the English is the question
    expect(contrastCard(item({ rung: 2 }), 'meaning', { key: 'k', form: 'type' }).sub?.text).toBe('Thanks for the present.');
  });

  it('a meaning as a choice asks for the situation: the English is the question, the two whole sentences the answers', () => {
    const c = contrastCard(item(), 'meaning', { key: 'k', form: 'choose' });
    expect(c.type).toBe('mcq');
    if (c.type !== 'mcq') return;
    expect(c.prompt?.text).toBe('Thanks for the present.');
    expect(c.options.map((o) => o.text)).toEqual(['Gracias para el regalo.', 'Gracias por el regalo.']);
    expect(c.options[c.answer].text).toBe('Gracias por el regalo.');
    expect(new Set(c.options.map((o) => o.lang))).toEqual(new Set(['es']));
  });

  it('a typed gap takes the word, with its accents: que and qué are two words', () => {
    const c = contrastCard(item({ es: 'Creo que sí.', en: 'I think so.', gap: [5, 8], options: ['que', 'qué'], answer: 0 }), 'local', { key: 'k', form: 'type' });
    expect(c.type).toBe('type');
    if (c.type !== 'type') return;
    expect(c.prompt?.text).toBe('Creo ___ sí.');
    expect(c.check('que').pass).toBe(true);
    const slip = c.check('qué');
    expect(slip.pass).toBe(false);
    expect(slip.answer).toBe('que');
    expect(c.check('porque').pass).toBe(false);
  });

  it('the other side typed is the decision made wrongly: no hint about accents, and no second try, so it can lapse', () => {
    const q = item({ es: '¿Qué lees?', en: 'What are you reading?', gap: [1, 4], options: ['Qué', 'Que'], answer: 0 });
    const c = contrastCard(q, 'local', { key: 'k', form: 'type' });
    if (c.type !== 'type') throw new Error('not typed');
    // que for qué is the whole of this contrast, and "Check the accents" would give it away for a Hard
    expect(c.check('que')).toMatchObject({ pass: false, near: false, final: true, answer: 'Qué' });
    expect(c.check('Que').hint).toBeUndefined();
    const v = contrastCard(item(), 'meaning', { key: 'k', form: 'type' });
    if (v.type !== 'type') throw new Error('not typed');
    expect(v.check('para')).toMatchObject({ pass: false, final: true });
    // a slip of the fingers still gets its second try
    expect(v.check('pro')).toMatchObject({ pass: false });
    expect(v.check('pro').final).toBeUndefined();
    const accents = contrastCard(item({ es: 'Se fue.', en: 'He left.', gap: [0, 2], options: ['Se', 'Le'], answer: 0 }), 'local', { key: 'k', form: 'type' });
    if (accents.type !== 'type') throw new Error('not typed');
    expect(accents.check('Sé')).toMatchObject({ pass: false, near: true });
    expect(accents.check('Sé').final).toBeUndefined();
  });

  it('the other sentence typed whole is the same: aspect has no second try and no "mine says the same thing"', () => {
    for (const a of [0, 1]) {
      const c = contrastCard(item({ es: ['Comía a las dos.', 'Comí a las dos.'][a], en: ['I used to eat at two.', 'I ate at two.'][a], gap: [0, [5, 4][a]], options: ['Comía', 'Comí'], answer: a }), 'discourse', { key: 'k', form: 'type' });
      if (c.type !== 'type') throw new Error('not typed');
      const r = c.check(['Comí a las dos.', 'Comía a las dos.'][a]);
      expect(r).toMatchObject({ pass: false, final: true });
      expect(claimOffered({ card: c, allowed: true, typed: 'x', result: r })).toBe(false);
    }
  });

  it('a phrase for a gap is typed whole', () => {
    const c = contrastCard(item({ es: 'Lo hago por la mañana.', en: 'I do it in the morning.', gap: [8, 21], options: ['por la mañana', 'para mañana'], answer: 0 }), 'synonym', { key: 'k', form: 'type' });
    if (c.type !== 'type') throw new Error('not typed');
    expect(c.placeholder).toBe('The missing words');
    expect(c.check('por la mañana').pass).toBe(true);
  });

  it('aspect is typed from the English: the whole sentence, with the claim open, and the sentence in a different order is the matcher\'s to judge', () => {
    const c = contrastCard(item({ es: 'Comía a las dos.', en: 'I used to eat at two.', gap: [0, 5], options: ['Comía', 'Comí'], answer: 0 }), 'discourse', { key: 'k', form: 'type' });
    expect(c.type).toBe('type');
    if (c.type !== 'type') return;
    expect(c.prompt?.text).toBe('I used to eat at two.');
    expect(c.claim).toBe(true);
    expect(c.check('Comía a las dos.').pass).toBe(true);
    expect(c.check('Comí a las dos.').pass).toBe(false);
  });

  it('puts the gap back where it was', () => {
    const it = item();
    expect(blanked(it)).toBe('Gracias ___ el regalo.');
    expect(filled(it, 0)).toBe('Gracias para el regalo.');
    expect(filled(it, 1)).toBe(it.es);
  });
});

describe('every item in the store, in every form it may be asked', () => {
  it('makes a card that asks for an answer, with its own key, a valid answer and a reason', () => {
    const kinds = new Set<string>();
    let made = 0;
    for (const f of files) {
      for (const [k, it] of f.items.entries()) {
        for (const form of ['choose', 'type'] as const) {
          const c = contrastCard(it, f.decides, { key: `${it.id}:${form}`, form });
          kinds.add(`${f.decides} ${form} ${c.type}`);
          made++;
          expect(c.type, it.id).not.toBe('read');
          expect(c.why.length, it.id).toBeGreaterThan(0);
          if (c.type === 'mcq') {
            expect(c.answer, it.id).toBeGreaterThanOrEqual(0);
            expect(c.answer, it.id).toBeLessThan(c.options.length);
            expect(new Set(c.options.map((o) => o.text)).size, it.id).toBe(c.options.length);
          } else {
            // what is asked is typeable, and the right answer passes its own check
            const answer = it.es.slice(...it.gap);
            const typed = f.decides === 'discourse' ? it.es : answer;
            expect(c.check(typed).pass, `${it.id} typed ${typed}`).toBe(true);
          }
        }
        void k;
      }
    }
    expect(made).toBeGreaterThan(1000);
    // aspect and near-synonyms are never a choice between buttons, even when a choice is asked for
    for (const d of ['discourse', 'synonym'] as ContrastDecides[]) expect([...kinds].filter((x) => x.startsWith(`${d} `) && x.endsWith(' mcq'))).toEqual([]);
    expect([...kinds].filter((x) => x.startsWith('local choose') || x.startsWith('meaning choose')).every((x) => x.endsWith(' mcq'))).toBe(true);
  });
});
