// Misreads found while writing the first Fluidez 2 content (story ch001–ch006, banks u01–u03).
// Tagged with the real curriculum (graph lexemes, chunks, patterns), as the gate does.
import { describe, expect, test } from 'vitest';
import { tagSentence, type TagResult } from '../../src/engine/tagger';
import { loadCurriculum } from '../../tools/gate/load';
import { APP_DIR } from '../../tools/gate';

const cur = loadCurriculum(APP_DIR);
const tag = (s: string) => tagSentence(s, cur.tagOpts);
const pos = (r: TagResult, w: string) => r.tokens.find((t) => t.w === w.toLowerCase())?.pos;
const lemma = (r: TagResult, w: string) => r.tokens.find((t) => t.w === w.toLowerCase())?.lemma;
/** grammar nodes not covered by a chunk or pattern span (what legality would check) */
const free = (r: TagResult) => {
  const spans = r.features.filter((f) => f.key.startsWith('chunk.') || f.key.startsWith('pattern.')).map((f) => f.span);
  return r.features.filter((f) => f.node && !f.key.startsWith('chunk.') && !f.key.startsWith('pattern.') && !spans.some(([a, b]) => f.span[0] >= a && f.span[1] <= b)).map((f) => f.node!);
};

describe('sentence-initial words and fragments', () => {
  test('Don / La at the start of a line', () => {
    expect(pos(tag('Vale: Don Hernando vive en el centro.'), 'don')).toBe('noun');
    expect(pos(tag('Tomás: La verdad, no sé.'), 'la')).toBe('det');
  });
  test('¿Nombre? ¿Apellido? Nombre: … are nouns, not commands', () => {
    for (const s of ['¿Nombre?', '¿Apellido?', 'Nombre: Tomás.', 'Nombre y apellido, por favor.']) {
      const r = tag(s);
      expect(r.requires, s).not.toContain('g:commands-usted');
      expect(r.requires.some((x) => /nombrar|apellidar/.test(x)), s).toBe(false);
    }
    expect(tag('Nombre y apellido, por favor.').requires).toEqual(expect.arrayContaining(['l:nombre', 'l:apellido']));
  });
  test('"Trabajo y estudio." stays two verbs', () => {
    expect(tag('Trabajo y estudio.').requires).toEqual(expect.arrayContaining(['l:trabajar', 'l:estudiar']));
  });
  test('nada is nothing unless someone swims', () => {
    for (const s of ['Nada, gracias.', '¿Nada?', 'Tomás: Nada.', 'No hay nada.']) expect(tag(s).requires, s).not.toContain('l:nadar');
    expect(tag('Ella nada muy bien.').requires).toContain('l:nadar');
  });
  test('don before a name needs no word', () => {
    expect(tag('Vale habla con don Hernando.').requires).not.toContain('l:don');
  });
});

describe('chunks', () => {
  const covered = (s: string, chunk: string, words: string[] = []) => test(`${s} — ${chunk}`, () => {
    const r = tag(s);
    expect(r.requires).toContain(chunk);
    expect(free(r).filter((n) => !n.startsWith('l:'))).toEqual([]);
    for (const w of words) expect(free(r)).not.toContain(w);
  });
  covered('Me llamo Tomás.', 'c:me-llamo', ['l:llamarse']);
  covered('¿Cómo estás?', 'c:como-estas', ['l:estar']);
  covered('Me gusta el café.', 'c:me-gusta', ['l:gustar']);
  covered('¡Vamos!', 'c:vamos-a');
  covered('Mucho gusto. —Igualmente.', 'c:mucho-gusto');
  covered('Encantada.', 'c:mucho-gusto');
  covered('Disculpe, ¿dónde está el cine?', 'c:perdon-disculpe');
  covered('Con permiso.', 'c:perdon-disculpe');
  covered('¿Entiendes?', 'c:no-entiendo');
  covered('Fue un desastre.', 'c:estuvo');
  covered('Tengo que trabajar.', 'c:tengo-que');
  covered('Voy a comprar pan.', 'c:voy-a');
  covered('¿Me da un tinto?', 'c:me-regala');
  covered('¡Estuvo buenísimo!', 'c:estuvo');
  covered('Tengo treinta y dos años.', 'c:tengo-anos');
  covered('No sé, creo.', 'c:creo-que');
  test('tag questions are c:no-cierto', () => {
    for (const s of ['Hace frío, ¿no?', 'Es caro, ¿verdad?', 'Tú eres de Cali, ¿cierto?']) expect(tag(s).requires, s).toContain('c:no-cierto');
    expect(tag('Hace frío.').requires).not.toContain('c:no-cierto');
  });
  test('¡Quiubo! is c:quiubo', () => { expect(tag('¡Quiubo! ¿Qué más?').requires).toContain('c:quiubo'); });
  test('no matching across a sentence or over a noun', () => {
    expect(tag('¿Hay leche? Creo que no.').requires).not.toContain('c:hay-que');
    const r = tag('Soy el nieto de Rosa.');
    expect(r.requires).not.toContain('c:soy-de');
  });
  test('"Sí" alone is not c:si-soy-yo, "No." alone is not every chunk with a "no" in it', () => {
    expect(tag('Sí.').requires).not.toContain('c:si-soy-yo');
    expect(tag('No.').requires).not.toContain('c:has-estado');
  });
});

describe('participles, adjectives and noun/verb homographs', () => {
  test('states after estar are adjectives', () => {
    expect(tag('—Estoy cansado. —Yo también.').requires).toContain('l:cansado');
    expect(tag('Estoy ocupado.').requires).toContain('l:ocupado');
    const r = tag('Estoy ocupada.');
    expect(r.requires).toContain('l:ocupado');
    expect(r.requires).not.toContain('g:estar-participle');
  });
  test('a result state is still estar + participle', () => {
    expect(tag('La puerta estaba abierta.').requires).toContain('g:estar-participle');
  });
  test('ser + lexicalised adjective is not passive', () => {
    const r = tag('Las películas de Vale son aburridas.');
    expect(r.requires).not.toContain('g:passive-ser');
    expect(r.requires).toContain('l:aburrido');
  });
  test('bare nouns in object and list positions', () => {
    expect(tag('Hay partido el domingo.').requires).toContain('l:partido');
    expect(tag('¿Hay helado de chocolate?').requires).toContain('l:helado');
    expect(tag('¿Quién quiere helado?').requires).toContain('l:helado');
    expect(tag('Hay comida y bebida.').requires).toEqual(expect.arrayContaining(['l:comida', 'l:bebida']));
    expect(tag('Tengo frío y sueño.').requires).toContain('l:sueño');
    expect(tag('Tengo frío y sueño.').requires).not.toContain('g:stem-boot');
  });
  test('verbs where a verb sits', () => {
    expect(lemma(tag('Los sábados camino en el centro.'), 'camino')).toBe('caminar');
    expect(lemma(tag('Encuentro a Vale.'), 'encuentro')).toBe('encontrar');
    expect(lemma(tag('Paso el domingo con Vale.'), 'paso')).toBe('pasar');
    expect(lemma(tag('Los jueves cocina Vale.'), 'cocina')).toBe('cocinar');
    expect(lemma(tag('¿Qué compra Vale en la tienda?'), 'compra')).toBe('comprar');
    expect(lemma(tag('El barrio mejora.'), 'mejora')).toBe('mejorar');
    expect(lemma(tag('¿Ayudas a Tomás?'), 'ayudas')).toBe('ayudar');
  });
  test('practica is the verb, not práctico', () => {
    const r = tag('Don Hernando practica todo tipo de deporte.');
    expect(r.requires).toContain('l:practicar');
    expect(r.requires).not.toContain('l:práctico');
    expect(r.requires).not.toContain('g:adjective-agreement');
  });
  test('favorita is no diminutive', () => {
    expect(tag('¿Cuál es tu película favorita?').requires).not.toContain('g:diminutives');
  });
});

describe('grammar nodes that should not fire', () => {
  test('y … tampoco is no double negative', () => {
    expect(tag('Tomás no trabaja los lunes y Vale tampoco.').requires).not.toContain('g:negation-words');
    // the feature fires; inside the taught chunk c:no-hay-nada the chunk is what the sentence requires
    expect(tag('No hay nadie.').features.map((f) => f.node)).toContain('g:negation-words');
  });
  test('está is never a tú command', () => {
    expect(tag('Simón no está en el café: ¡está en la calle!').requires).not.toContain('g:commands-tu');
    expect(tag('¿Está el señor Ruiz, por favor?').requires).not.toContain('g:commands-tu');
  });
  test('entre before an article is the preposition', () => {
    expect(tag('Entre las dos y las tres.').requires).not.toContain('g:commands-usted');
    expect(tag('Entre, por favor.').requires).toContain('g:commands-usted');
  });
  test('irse is a word, not the se-meaning lesson', () => {
    expect(tag('Me voy.').requires).toContain('l:irse');
    expect(tag('Me voy.').requires).not.toContain('g:se-meaning-change');
  });
});

describe('lexemes the tagger produces', () => {
  test('interrogatives are lexemes', () => {
    expect(tag('¿Adónde vas?').requires).toContain('l:adónde');
    expect(tag('¿Cuántas hermanas tienes?').requires).toContain('l:cuánto');
  });
  test('quoted foreign words are mentions, not unknown Spanish', () => {
    expect(tag('Dice «thank you» y se va.').confidence).toBe('high');
  });
  test('patterns are detected from their ids', () => {
    expect(tag('No tengo hambre.').requires).toContain('p:tener-hambre');
    expect(tag('¿Qué tipo de música te gusta?').requires).toContain('p:que-tipo-de');
  });
});

describe('fourth batch', () => {
  test('ayer / anoche alone are c:ayer-anoche', () => {
    expect(tag('Ayer trabajé mucho, y anoche también.').requires).toContain('c:ayer-anoche');
  });
  test('a verb coordinated after a predicate noun stays a verb', () => {
    expect(tag('Soy médico y trabajo en Bogotá.').requires).toContain('l:trabajar');
  });
  test('"No, no me gusta nada" is the chunk, not a double negative outside it', () => {
    expect(free(tag('—¿Te gusta el fútbol? —No, no me gusta nada.'))).not.toContain('g:negation-words');
  });
});

describe('more lexemes', () => {
  test('aburrido is the adjective', () => {
    expect(tag('Es un día aburrido.').requires).toContain('l:aburrido');
    expect(tag('Es un día aburrido.').requires).not.toContain('l:aburrirse');
  });
  test('irme is irse', () => {
    const r = tag('Tengo que irme.');
    expect(r.requires).toContain('l:irse');
    expect(r.requires).not.toContain('g:se-meaning-change');
  });
  test('a feminine person noun shares the masculine lexeme when it has none of its own', () => {
    expect(tag('Mi jefa es simpática.').requires).toContain('l:jefe');
  });
});
test('baila is the verb (no baile from a feminine guess)', () => {
  expect(tag('Vale siente la música y baila.').requires).toContain('l:bailar');
});

// Misreads the first unattended u04 writers hit (story ch007–ch008, scripts, bank u04).
describe('u04 market and time frames', () => {
  test('¿Cuánto cuesta…? is costar, covered by c:cuanto-cuesta', () => {
    for (const s of ['¿Cuánto cuesta el kilo de tomate?', '¿Cuánto cuesta?', '¿Cuánto cuestan los mangos?']) {
      const r = tag(s);
      expect(lemma(r, s.includes('cuestan') ? 'cuestan' : 'cuesta'), s).toBe('costar');
      expect(r.requires, s).not.toContain('l:cuesta');
    }
    expect(tag('¿Cuánto cuesta el kilo de tomate?').requires).toContain('c:cuanto-cuesta');
    // a verb after the noun keeps the noun reading
    expect(pos(tag('¿Cuánto trabajo tienes?'), 'trabajo')).toBe('noun');
  });
  test('[time noun] que viene is p:time-pasado-que-viene, not a relative clause', () => {
    for (const s of ['La semana que viene voy al mercado.', 'El año que viene viajo.', 'El sábado que viene abrimos.']) {
      const r = tag(s);
      expect(r.requires, s).not.toContain('g:relative-que');
      expect(r.requires, s).toContain('p:time-pasado-que-viene');
    }
    expect(tag('El mes pasado fui a Cali.').requires).toContain('p:time-pasado-que-viene');
    expect(tag('El señor que viene todos los días es Hernando.').requires).toContain('g:relative-que');
  });
  test('gracias por and pagar X por Y own their por', () => {
    for (const s of ['Gracias por el café.', 'Muchas gracias por venir.']) {
      const r = tag(s);
      expect(r.requires, s).not.toContain('g:por-para-1');
      expect(r.requires, s).toContain('p:gracias-por');
    }
    for (const s of ['Pagué veinte mil pesos por la papaya.', 'El mango está a cinco mil por kilo.']) {
      const r = tag(s);
      expect(r.requires, s).not.toContain('g:por-para-1');
      expect(r.requires, s).toContain('p:costar-pagar');
    }
    expect(tag('Caminamos por el parque.').requires).toContain('g:por-para-1');
  });
});
