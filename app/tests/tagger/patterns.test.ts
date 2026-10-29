// Pattern specs (src/engine/tagger/patterns.ts): a pattern node is found by its construction, in any
// wording, not only in its example sentence. Tagged with the real curriculum, as the gate does.
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tagSentence, parseSpec, isSpec, type PatternSpec } from '../../src/engine/tagger';
import { loadCurriculum } from '../../tools/gate/load';
import { APP_DIR } from '../../tools/gate';

const cur = loadCurriculum(APP_DIR);
const tag = (s: string) => tagSentence(s, cur.tagOpts);
/** every node the sentence's features point at (a pattern inside a chunk still counts as found) */
const found = (s: string) => new Set(tag(s).features.map((f) => f.node));
const has = (s: string, id: string) => test(`${s} — ${id}`, () => expect([...found(s)], s).toContain(id));
const hasNot = (s: string, id: string) => test(`${s} — not ${id}`, () => expect([...found(s)], s).not.toContain(id));

describe('the spec language', () => {
  const only = (id: string, match: string[]): PatternSpec[] => [{ id, match }];
  const t = (s: string, match: string[]) => tagSentence(s, { patterns: only('p:t', match) }).features.some((f) => f.node === 'p:t');
  test('{lemma} matches any conjugation, {inf} any infinitive', () => {
    expect(t('Sentimos mucho llegar tarde.', ['{sentir} mucho? {inf}'])).toBe(true);
    expect(t('Siento la demora.', ['{sentir} {inf}'])).toBe(false);
  });
  test('optional tokens, groups, gaps, negation, anchors', () => {
    expect(t('Trabajo desde las ocho hasta las cinco.', ['desde {...} hasta'])).toBe(true);
    expect(t('Vivo en la casa.', ['(el|la)? casa'])).toBe(true);
    expect(t('Queda en el centro.', ['{quedar} en !(el|la) {*}'])).toBe(false);
    expect(t('Bueno, entonces nos vemos.', ['^ bueno , entonces'])).toBe(true);
    expect(t('Muy bueno, entonces sí.', ['^ bueno , entonces'])).toBe(false);
  });
  test('punctuation ends a match unless the spec has a comma', () => {
    expect(t('Gracias. Por favor, siéntese.', ['gracias por'])).toBe(false);
  });
  test('{num} takes words and digits; {np} a short noun phrase', () => {
    expect(t('Somos veintitrés.', ['somos {num}'])).toBe(true);
    expect(t('Somos 25.', ['somos {num}'])).toBe(true);
    expect(t('Perdón por la demora.', ['perdón por {np}'])).toBe(true);
  });
  test('diacritic pairs keep their accent', () => {
    expect(t('Es para mi abuela.', ['para mí {*}?'])).toBe(false);
    expect(t('Para mí, es caro.', ['para mí'])).toBe(true);
  });
  test('bad specs are rejected', () => {
    for (const s of ['¿qué {inf}?', '(a|b', 'a)', '{tener:foo} razón', '{...}', '{inf}?']) expect(() => parseSpec(s), s).toThrow();
  });
  test('legacy literal strings still work (lemma match, name slots)', () => {
    expect(isSpec('para mí')).toBe(false);
    expect(t('Es muy caro para mí.', ['para mí'])).toBe(true);
    expect(t('No tengo hambre.', ['tener hambre'])).toBe(true);
  });
});

describe('patterns in any wording (unit reviews)', () => {
  has('Siento llegar tarde.', 'p:siento-llegar-tarde');
  has('Siento llamar tan tarde.', 'p:siento-llegar-tarde');
  has('Siento no saber tu nombre.', 'p:siento-llegar-tarde');
  has('Perdón por la demora.', 'p:siento-llegar-tarde');
  has('Trabajo desde las ocho hasta las cinco.', 'p:desde-hasta');
  has('Caminamos desde el parque hasta el centro.', 'p:desde-hasta');
  has('Empiezo a trabajar a las siete.', 'p:empezar-terminar');
  has('Empezó a llover.', 'p:empezar-terminar');
  has('¿A qué hora terminas de estudiar?', 'p:empezar-terminar');
  has('Fue realmente divertido.', 'p:intensificadores');
  has('Es totalmente falso.', 'p:intensificadores');
  has('Tienes razón.', 'p:tener-razon');
  has('Mi madre siempre tiene razón.', 'p:tener-razon');
  has('En mi familia somos siete.', 'p:somos-cuatro');
  has('Somos cuatro.', 'p:somos-cuatro');
  has('Quedamos en vernos a las ocho.', 'p:quedar-en');
  has('Quedamos en que tú traías la torta.', 'p:quedar-en');
  has('¿En qué quedamos?', 'p:quedar-en');
  hasNot('La tienda queda en el centro.', 'p:quedar-en');
  hasNot('El café queda en La Candelaria.', 'p:quedar-en');
  has('La tienda queda en el centro.', 'p:quedar-cerca');
  hasNot('Hoy me quedo en casa.', 'p:quedar-cerca');
  has('Tengo mucha hambre.', 'p:tener-hambre');
  has('¿Juegas al tenis?', 'p:jugar-a');
  has('Cuesta más de veinte mil pesos.', 'p:mas-de-number');
  has('Había menos de diez personas.', 'p:mas-de-number');
  test('además is a word, not the discourse-structure node', () => {
    const r = tag('Además, el café es barato.');
    expect(r.requires).not.toContain('g:discourse-structure');
    expect([...found('Además, el café es barato.')]).not.toContain('p:presentation-frame');
  });
});

// Every pattern node's own Spanish (es + forms) is found by its specs (or by the grammar feature the
// node map sends to it). The few exceptions are contrast forms, not the pattern: each is named here.
const EXCEPTIONS: Record<string, string[]> = {
  'p:ir-a-venir-de-place': ['¿Dónde estás?'],                              // static location, the contrast
  'p:personal-a': ['Tengo dos hermanos.', 'Busco un mesero.'],              // no personal a: the counter-examples
  'p:te-presento-a': ['Mucho gusto.\nIgualmente.'],                         // the reply formula
  'p:no-es-nada-adj': ['La comida es muy rica.'],                           // the neutral bottom rung
  'p:dentro-de-vs-despues': ['La semana pasada fui a Cali.'],              // contrast
  'p:me-encanta-que': ['Me gusta el silencio.'],                            // contrast: gustar + noun
  'p:podriamos-deberiamos': ['Tenemos que salir ya.'],                      // plain tener que is A1 grammar
  'p:cumplir-anos': ['Tengo treinta años.'],                                // contrast: tener años
  'p:te-lo-agradezco': ['Gracias por venir.'],                              // p:gracias-por's
  'p:me-harias-un-favor': ['Este mueble pesa muchísimo.'],                  // the hint, no construction
  'p:turning-it-up': ['Aquí sí sirven café café.'],                         // repetition: no backreference
  'p:synonym-hypernym': ['Juan llevó a su perro al veterinario: el animal tenía una pata rota.', 'Mario ganó el Nobel en 2010 y le dedicó el premio a su madre.'],
  'p:ojo-con-no-confies': ['Si no lo termina mañana, está despedido.'],    // a bare first conditional
  'p:yo-ni-loco': ['¡Descansar tres meses! ¡Qué suerte!'],                  // bare infinitive exclamation
  'p:si-quieres-que': ['Si quieres comprártelo, cómpratelo.'],              // needs the same verb twice
  'p:fruto-fruta': ['Compré fruta en Paloquemao.'],                         // plain fruta is A1 vocabulary
  'p:presentation-frame': ['Además, la ciudad tiene muchos museos.'],       // además alone is everyday narrative (c:ademas)
};
type PNode = { id: string; es: string; forms: Array<{ es: string }>; match?: string[] };
const nodes = JSON.parse(readFileSync(join(APP_DIR, 'content/graph/patterns.json'), 'utf8')) as PNode[];

describe('every pattern spec parses', () => {
  test('no spec syntax errors', () => {
    const bad: string[] = [];
    for (const n of nodes) for (const m of n.match ?? []) if (isSpec(m)) { try { parseSpec(m); } catch (e) { bad.push(`${n.id}: ${(e as Error).message}`); } }
    expect(bad).toEqual([]);
  });
});

describe('every pattern finds its own forms', () => {
  const opts = { ...cur.tagOpts };
  for (const n of nodes) {
    test(n.id, () => {
      const forms = [...new Set([n.es, ...n.forms.map((f) => f.es)])];
      const miss = forms.filter((f) => !tagSentence(f, opts).features.some((x) => x.node === n.id));
      expect(miss.filter((f) => !(EXCEPTIONS[n.id] ?? []).includes(f))).toEqual([]);
    });
  }
  test('at least 95% of pattern nodes find every one of their forms', () => {
    expect(nodes.length - Object.keys(EXCEPTIONS).length).toBeGreaterThanOrEqual(0.95 * nodes.length);
  });
});
