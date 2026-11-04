// LC1-007: -ra and -se are one imperfect subjunctive, and in the result clause of a
// past unreal condition habría llegado and hubiera llegado are one thing. Neither
// swap may reach where it is not true: quisiera and pudiera standing for a
// conditional take no -se, the si clause keeps its hubiera, and a subjunctive
// after que is not a conditional.
import { describe, expect, test } from 'vitest';
import { expandAccepted, matchTranslation, subjunctiveVariants, resultClauseVariants } from '../../../lib/match';

type Row = [es: string, en: string, input: string];
const run = ([es, en, input]: Row) => matchTranslation(input, { es, en });

describe('-ra and -se', () => {
  test.each<Row>([
    ['Si tuviera dinero, viajaría.', 'If I had money, I would travel.', 'Si tuviese dinero, viajaría.'],
    ['Si tuviese dinero, viajaría.', 'If I had money, I would travel.', 'Si tuviera dinero, viajaría.'],
    ['El hecho de que no llamara me preocupa.', "The fact that he didn't call worries me.", 'El hecho de que no llamase me preocupa.'],
    ['El hecho de que no llamase me preocupa.', "The fact that he didn't call worries me.", 'El hecho de que no llamara me preocupa.'],
    ['Quería que vinieras temprano.', 'I wanted you to come early.', 'Quería que vinieses temprano.'],
    ['Ojalá tuvieras más tiempo.', 'I wish you had more time.', 'Ojalá tuvieses más tiempo.'],
    ['Si pudiera, quisiera ir.', 'If I could, I would like to go.', 'Si pudiese, quisiera ir.'],
    ['Si hubiera sabido, no habría venido.', "If I had known, I wouldn't have come.", 'Si hubiese sabido, no habría venido.'],
  ])('%s / "%s": %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.note).toBeUndefined();
  });

  test.each<Row>([
    ['Quisiera un café, por favor.', "I'd like a coffee, please.", 'Quisiese un café, por favor.'],
    ['Pudiera ayudarte.', 'I could help you.', 'Pudiese ayudarte.'],
    ['Si pudiera, quisiera ir.', 'If I could, I would like to go.', 'Si pudiese, quisiese ir.'],
    ['Si tuviera dinero, viajaría.', 'If I had money, I would travel.', 'Si tuviese dinero, viajase.'],
  ])('not for a main verb: %s / "%s": %s', (...row) => {
    expect(run(row).pass).toBe(false);
  });

  test('the variants are the same sentence with one form changed', () => {
    expect(subjunctiveVariants('Si tuviera dinero, viajaría.')).toEqual(['Si tuviese dinero, viajaría.']);
    expect(subjunctiveVariants('Quisiera un café.')).toEqual([]);
    expect(subjunctiveVariants('Viajaría si tuviese dinero.')).toEqual(['Viajaría si tuviera dinero.']);
  });

  test('fuera outside is an adverb, not a verb', () => {
    expect(subjunctiveVariants('¿Te gusta más cocinar que comer fuera?')).toEqual([]);
    expect(subjunctiveVariants('Prefiero que cenemos fuera de casa.')).toEqual([]);
    expect(subjunctiveVariants('Como si fuera la primera vez.')).toEqual(['Como si fuese la primera vez.']);
  });
});

describe('habría and hubiera in the result clause', () => {
  test.each<Row>([
    ['De haber llegado antes, habríamos visto a Hernando.', 'Had we arrived earlier, we would have seen Hernando.', 'De haber llegado antes, hubiéramos visto a Hernando.'],
    ['De haber llegado antes, hubiéramos visto a Hernando.', 'Had we arrived earlier, we would have seen Hernando.', 'De haber llegado antes, habríamos visto a Hernando.'],
    ['Si hubiera sabido, habría venido.', 'If I had known, I would have come.', 'Si hubiera sabido, hubiera venido.'],
    ['Si hubiera sabido, habría venido.', 'If I had known, I would have come.', 'Si hubiese sabido, hubiese venido.'],
    ['Habría sido mejor esperar.', 'It would have been better to wait.', 'Hubiera sido mejor esperar.'],
  ])('%s: %s', (...row) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
  });

  test('a pass through the swap says which form the card taught', () => {
    const r = run(['Si hubiera sabido, habría venido.', 'If I had known, I would have come.', 'Si hubiera sabido, hubiera venido.']);
    expect(r.note).toMatch(/habría and hubiera/i);
    expect(run(['Si hubiera sabido, habría venido.', 'If I had known, I would have come.', 'Si hubiera sabido, habría venido.']).note).toBeUndefined();
  });

  test.each<Row>([
    // the si clause is not a result clause
    ['Si hubiera sabido, habría venido.', 'If I had known, I would have come.', 'Si habría sabido, habría venido.'],
    // a subjunctive after que is not a conditional
    ['No creo que hubiera venido.', "I don't think he would have come.", 'No creo que habría venido.'],
    ['Ojalá hubiera venido.', 'I wish he had come.', 'Ojalá habría venido.'],
  ])('not for %s / "%s": %s', (...row) => {
    expect(run(row).pass).toBe(false);
  });

  test('the variants keep the si clause as it is', () => {
    expect(resultClauseVariants('Si hubiera sabido, habría venido.', 'If I had known, I would have come.')).toEqual(['Si hubiera sabido, hubiera venido.']);
    expect(resultClauseVariants('Si hubiera sabido, no habría venido.', "If I had known, I wouldn't have come.")).toEqual(['Si hubiera sabido, no hubiera venido.']);
  });

  test('every form of the model is still the first in the list', () => {
    const vs = expandAccepted({ es: 'Si hubiera sabido, habría venido.', en: 'If I had known, I would have come.' });
    expect(vs[0]).toMatchObject({ es: 'Si hubiera sabido, habría venido.', model: true });
    expect(vs.length).toBeGreaterThan(1);
  });
});
