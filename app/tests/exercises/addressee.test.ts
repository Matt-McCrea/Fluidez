// "Answer for yourself" asks a question the learner can answer about themselves:
// put to one person (tú or usted), with nobody else named in it. The audit's
// own examples were questions to a character, to a group, or about the story
// (docs/swarm-audit, H8).
import { describe, expect, test } from 'vitest';
import { askedOfYou } from '../../src/exercises/addressee';
import { namesOf, placesOf } from '../../src/exercises/licence';
import { rows } from './transform-sweep';

const names = namesOf(rows);
const places = placesOf(rows);
const asked = (es: string) => askedOfYou(es, names, places);

describe('questions a learner can answer for themselves', () => {
  test.each([
    '¿De dónde eres?',
    '¿Tienes hermanos?',
    '¿Cómo te llamas?',
    '¿Cómo es tu casa?',
    '¿Qué haces los domingos?',
    '¿Usted vive en Bogotá?',
    '¿De dónde es usted?',
    '¿Cómo se llama usted?',
    '¿Usted vive en Bogotá?',
    '¿Eres de Medellín?',
    '¿Eres de Bogotá o de Medellín?',
  ])('%s', (es) => expect(asked(es)).toBe(true));
});

describe('questions a learner cannot', () => {
  test.each([
    ['to a character by name', '¿De dónde eres, Vale?'],
    ['to a character by name, at the end', '¿Eres tú, Tomás?'],
    ['to a group', '¿Ustedes son Mariana y Hernando?'],
    ['about a character', '¿Tomás salva La Esquina de Rosa?'],
    ['about the story', '¿Qué dirá Altamira?'],
    ['about the time', '¿Qué hora es?'],
    ['a statement', 'Soy Tomás.'],
    ['a statement about a character', 'Don Hernando es de Bogotá.'],
    ['to a group, no name', '¿Ustedes tienen hijos?'],
    ['about someone else', '¿Dónde vive él?'],
    ['a friend of a character', '¿Eres amigo de Vale?'],
    ['a character\'s things', '¿Te gustan los libros de Rosa?'],
    ['a remark, then a question', 'Muchas gracias, señor. ¿Y usted?'],
  ])('%s: %s', (_what, es) => expect(asked(es)).toBe(false));
});

test('the places of the bank are places, and the people are not', () => {
  for (const place of ['bogotá', 'medellín', 'cali', 'toronto']) expect(places.has(place), place).toBe(true);
  for (const person of ['vale', 'tomás', 'rosa', 'mariana', 'hernando', 'simón']) expect(places.has(person), person).toBe(false);
});

test('over the whole bank, a question it accepts names nobody but a place', () => {
  let accepted = 0;
  const placed: string[] = [];
  for (const r of rows) {
    if (!asked(r.es)) continue;
    accepted++;
    // every capital past the first word is a place
    const capitals = (r.es.replace(/^[¿¡"«\s]+/, '').slice(1).match(/\p{Lu}[\p{L}]*/gu) ?? []).map((w) => w.toLowerCase());
    for (const w of capitals) expect(places.has(w), `${w} in ${r.es}`).toBe(true);
    if (capitals.length) placed.push(r.es);
  }
  expect(accepted).toBeGreaterThan(100);
  // the places are real ones and rare, not a door for the characters
  expect(placed.length).toBeLessThan(accepted / 4);
  expect(placed.filter((es) => /\b(Tomás|Vale|Rosa|Mariana|Hernando|Simón)\b/.test(es))).toEqual([]);
});
