// C13 for writing: a constraint regex reads accented letters (LG-086), an avoided
// word is a whole word (LG-087), and a text that is English or word salad earns
// no tick but the counts.
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { checkWriting, type Constraint } from '../../src/check';
import { unicodeWord, usesForm } from '../../src/check/writing';
import { buildLexicon, englishShare, spanishShare } from '../../src/check/personal';

const run = (c: Constraint, text: string) => checkWriting({ constraints: [c] }, text).results[0].pass;
const rx = (pattern: string, flags?: string): Constraint => ({ type: 'regex', pattern, ...(flags ? { flags } : {}) });
const avoid = (...words: string[]): Constraint => ({ type: 'avoidsAny', words });

describe('regex constraints read accented letters (LG-086)', () => {
  test.each<[string, string, string, boolean]>([
    // the constraints below are the ones the verdict found refused or wrongly passed
    ['w-u57-12', '\\bme entr(ó|o|aron|aba|aban)\\b', 'Ayer me entró un mensaje del banco.', true],
    ['w-u38-09', '\\b(me enteré|nos enteramos|te enteraste|se enteró|me enteré)\\b', 'Hoy me enteré de todo.', true],
    ['w-u38-09', '\\b(me enteré|nos enteramos|te enteraste|se enteró|me enteré)\\b', 'Tomás se enteró.', true],
    ['sc-u57-a', '\\bse me (parte|partió|hizo|hace)\\b', 'Gracias por llamar. Se me partió el alma, Vale.', true],
    ['w-u30-07', '\\b(me dormí|me quedé)\\b', 'Anoche me dormí tarde.', true],
    ['w-u10-04', '\\bpara mí\\b', 'Un tinto para mí, por favor.', true],
    ['w-u29-05', '\\bquizá\\b', 'Quizá vuelva mañana.', true],
    ['w-u31-10', '\\bíbamos a\\b', 'Íbamos a salir temprano.', true],
    ['w-u08-07', '\\bba\\w+ndo\\b', 'Estaba bañando al perro.', true],
    ['\\w runs on across ñ', '\\bsue\\w+\\b', 'Sueño con un café.', true],
    ['a word does not start mid-word', '\\bsobre todo\\b', 'Es sobretodo un abrigo.', false],
    ['an accented letter ends a word', '\\bentr\\b', 'Ayer me entró algo.', false],
    ['\\b is not satisfied inside a word', '\\bmente\\b', 'Es solamente eso.', false],
  ])('%s: %s on "%s"', (_id, pattern, text, ok) => {
    expect(run(rx(pattern, 'i'), text)).toBe(ok);
  });

  test('the same on a pattern that already carries the u flag', () => {
    expect(run(rx('\\b(tinto|café)\\b', 'iu'), 'Ya le traigo el café.')).toBe(true);
    expect(run(rx('\\bse me (parte|partió)\\b', 'iu'), 'Se me partió.')).toBe(true);
  });

  test('a backreference and a class survive the rewrite', () => {
    expect(run(rx('\\b(\\w+) \\1\\b'), 'más más')).toBe(true);
    expect(run(rx('\\b[\\w-]+ó\\b'), 'canción')).toBe(false);
    expect(run(rx('\\b[\\w-]+\\b'), 'canción')).toBe(true);
  });

  test('\\w and \\b mean letters, digits and underscore, and nothing else is touched', () => {
    expect(unicodeWord('\\bme \\w+\\b')).toContain('\\p{L}\\p{N}_');
    expect(unicodeWord('\\d\\s\\.')).toBe('\\d\\s\\.');
    expect(unicodeWord('[\\w-]')).toBe('[\\p{L}\\p{N}_-]');
  });

  test('a pattern the u flag cannot read keeps its old meaning', () => {
    expect(run(rx('a\\-b'), 'a-b')).toBe(true);
  });

  test('the double object pronoun of its own label', () => {
    expect(run({ type: 'cliticCluster' }, 'Quiero dármelo mañana.')).toBe(true);
    expect(run({ type: 'cliticCluster' }, 'Se lo di ayer.')).toBe(true);
    expect(run({ type: 'cliticCluster' }, 'Quiero comerlo.')).toBe(false);
  });
});

describe('an avoided word is a whole word (LG-087)', () => {
  test.each<[string[], string, boolean]>([
    // inside other words: not an address
    [['tú', 'tienes', 'eres', 'piensas'], 'Don Hernando, me parece buena idea para los turistas.', true],
    [['tú', 'gracias a ti', 'contigo'], 'Gracias a usted. Estuvo muy bien.', true],
    [['tu'], 'La natilla de su familia está en el cuaderno. ¿Un tinto natural?', true],
    [['estás'], 'Podemos hablar de estas cartas.', true],
    [['vas'], 'Quiero ideas nuevas.', true],
    [['ves'], 'Nos vemos los jueves.', true],
    [['eres'], 'Las mujeres llegaron temprano.', true],
    // the word itself
    [['tú'], 'Si tú quieres, vamos.', false],
    [['tu'], 'Si tú quieres, vamos.', false],
    [['tu'], 'Tu casa es grande.', false],
    [['tú'], 'Tu casa es grande.', true],
    [['estás'], '¿Cómo estás?', false],
    [['estás'], 'Esas cartas, estas aquí.', true],
    [['ves'], '¿Ves eso?', false],
    [['vas', 'eres'], 'Dices que eres amable.', false],
    // several words, and the end of a phrase running on into a verb ("le agradecer" is "le agradecería")
    [['gracias a ti'], 'Todo fue posible gracias a ti, Camila.', false],
    [['le agradecer'], 'Le agradecería mucho su respuesta.', false],
    [['le agradecer'], 'Le agradezco su respuesta.', true],
    // an accentless entry is blind to accents, an accented one to nothing
    [['permitame'], 'Permítame ayudarle.', false],
    [['para mi '], 'Esto es para mí.', true],
    [['para mi '], 'Esto es para mi casa.', false],
    [['tienes'], 'Los tienes todos.', false],
    // a single word never runs on
    [['hable'], 'Hablemos mañana.', true],
    [['tienes'], 'Contienes demasiado.', true],
    // names, whatever the case
    [['Mariana'], 'Le escribo a mariana.', false],
  ])('%j on "%s": %s', (words, text, ok) => {
    expect(run(avoid(...words), text)).toBe(ok);
  });

  test('the detail names what was found, without the padding spaces', () => {
    const r = checkWriting({ constraints: [avoid(' tu ', 'eres')] }, 'Tu casa es grande.');
    expect(r.results[0].detail).toBe('found tu');
  });

  test('spaces at the edge of an entry add nothing', () => {
    expect(usesForm(['si', 'tú', 'vienes'], ' tú ')).toBe(true);
    expect(usesForm(['estuvo', 'bien'], ' tú ')).toBe(false);
  });
});

describe('text that is not Spanish sentences earns no tick but the counts', () => {
  const task = (words = 150): { constraints: Constraint[] } => ({
    constraints: [
      { type: 'minWords', n: words },
      { type: 'containsAny', words: ['al tiempo que', 'mientras'] },
      { type: 'avoidsPerson', person: 'tú' },
      { type: 'minSentences', n: 4 },
    ],
  });

  // the repro of F14: 212 words of word salad and then English
  const salad = Array.from({ length: 17 }, () => 'Yo gato al tiempo que perro. Cuanto más mesa, más silla.').join(' ');
  const gibberish = `${salad} the cat sat on the mat and then the dog ran in the park.`;

  test('the gibberish of the report has the length the task asks for', () => {
    expect(gibberish.split(/\s+/).length).toBeGreaterThan(200);
  });

  test('212 words of it do not pass, and say why', () => {
    const r = checkWriting(task(), gibberish);
    expect(r.floor.ok).toBe(false);
    expect(r.allPass).toBe(false);
    // only the counts hold: the ticks for al tiempo que and for not addressing a tú are not earned
    expect(r.results.map((x) => x.pass)).toEqual([true, false, false, true]);
    expect(r.passed).toBe(2);
    expect(r.floor.reason).toBeTruthy();
  });

  test('English with the right words sprinkled in is not a pass', () => {
    const english = 'Yesterday I went to the market with my sister and we bought some vegetables for dinner. '.repeat(14) + 'Mientras tanto me llamo Sam y soy de Toronto.';
    const r = checkWriting(task(100), english);
    expect(r.floor.ok).toBe(false);
    expect(r.floor.reason).toMatch(/not Spanish/);
    expect(r.allPass).toBe(false);
    expect(r.results[1].pass).toBe(false);
  });

  test('a long run of Spanish nouns with no verb is not a pass', () => {
    const nouns = ['gato', 'perro', 'mesa', 'silla', 'casa', 'carro', 'libro', 'puerta', 'ventana', 'camino', 'plato', 'vaso', 'cama', 'techo', 'suelo',
      'pared', 'lámpara', 'espejo', 'cuadro', 'reloj', 'llave', 'mapa', 'cesta', 'banco', 'plaza', 'calle', 'parque', 'tienda', 'cocina', 'jardín'];
    const lines = Array.from({ length: nouns.length / 2 }, (_, i) => `El ${nouns[2 * i]} y la ${nouns[2 * i + 1]}.`);
    const lexicon = buildLexicon([], [...lines, ...nouns]);
    const r = checkWriting({ constraints: [{ type: 'minSentences', n: 4 }, { type: 'avoidsPerson', person: 'tú' }] }, lines.join(' '), { lexicon });
    expect(r.floor.ok).toBe(false);
    expect(r.floor.reason).toMatch(/verb/);
    expect(r.results.map((x) => x.pass)).toEqual([true, false]);
  });

  test('the same sentence over and over is not a pass', () => {
    const r = checkWriting({ constraints: [{ type: 'minSentences', n: 4 }, { type: 'negation' }] }, 'No sé qué decir hoy. '.repeat(10));
    expect(r.floor.ok).toBe(false);
    expect(r.floor.reason).toMatch(/same lines/);
    expect(r.allPass).toBe(false);
  });

  test('real Spanish clears the floor and can pass', () => {
    const text = 'Anoche me quedé en casa y cociné algo sencillo. Mientras la comida estaba en el horno, llamé a mi hermana. Hablamos de nuestros planes para el fin de semana. No sé si vamos a viajar, pero me gustaría ir a la costa.';
    const r = checkWriting({ constraints: [{ type: 'minWords', n: 30 }, { type: 'containsAny', words: ['mientras'] }, { type: 'negation' }, { type: 'avoidsPerson', person: 'tú' }] }, text);
    expect(r.floor.ok).toBe(true);
    expect(r.allPass).toBe(true);
  });

  test('a short text is not judged, and a caller can switch the floor off', () => {
    expect(checkWriting({ constraints: [{ type: 'minSentences', n: 1 }] }, 'Un tinto, por favor.').floor.ok).toBe(true);
    expect(checkWriting(task(), gibberish, { floor: false }).floor.ok).toBe(true);
  });
});

describe('what counts as English', () => {
  test('"has" is the Spanish verb', () => {
    expect(spanishShare('¿Has estado alguna vez en Medellín?')).toBeGreaterThanOrEqual(0.7);
    expect(englishShare('¿Has estado alguna vez en Medellín?')).toBe(0);
  });
  test('English function words are seen without a lexicon', () => {
    expect(englishShare('Yesterday I went to the market with my sister')).toBeGreaterThan(0.3);
    expect(englishShare('Ayer fui al mercado con mi hermana')).toBe(0);
  });
});

describe('the authored models still clear their own checklists', () => {
  const base = new URL('../../content/', import.meta.url);
  const json = (dir: string) => readdirSync(new URL(`${dir}/`, base)).filter((n) => n.endsWith('.json') && !n.startsWith('_'))
    .map((n) => JSON.parse(readFileSync(new URL(`${dir}/${n}`, base), 'utf8')));
  const tasks = json('writing').flat() as Array<{ id: string; model: string; constraints?: Constraint[] }>;
  const scenes = json('scenes') as Array<{ id: string; turns: Array<{ id: string; accept: string[]; require?: Constraint[] }> }>;

  test('every writing task model, with and without the course lexicon', () => {
    const bank = readdirSync(new URL('bank/', base)).filter((n) => /^u\d+\.json$/.test(n))
      .flatMap((n) => JSON.parse(readFileSync(new URL(`bank/${n}`, base), 'utf8')) as Array<{ es: string }>).map((r) => r.es);
    const lexicon = buildLexicon([], bank);
    const failed: string[] = [];
    for (const t of tasks) {
      for (const ctx of [{}, { lexicon }]) {
        const r = checkWriting({ constraints: t.constraints }, t.model, ctx);
        if (!r.floor.ok || !r.allPass) failed.push(`${t.id}: ${r.floor.reason ?? r.results.filter((x) => !x.pass).map((x) => x.label).join('; ')}`);
      }
    }
    expect(tasks.length).toBeGreaterThan(800);
    expect(failed).toEqual([]);
  });

  test('every accepted reply of every scene turn meets that turn\'s requirements', () => {
    const failed: string[] = [];
    for (const sc of scenes) for (const turn of sc.turns) for (const a of turn.accept) {
      const r = checkWriting({ constraints: turn.require ?? [] }, a, { floor: false });
      if ((turn.require?.length ?? 0) > 0 && !r.allPass) failed.push(`${sc.id} ${turn.id}: ${a}`);
    }
    expect(failed).toEqual([]);
  });
});
