// F6, named traps at the miss. The rules (check/traps/rules.ts) have four outcomes: an Assert names the cause and is the only
// thing a "you keep ..." may count, an Ask says less because the answer may be right, a Note passes a right answer and says
// its point, and Silent is the plain location. This file holds the table, each rule with the answer it fires on and the right
// answer it must leave alone, the two batteries of the gate (known errors must not mislead; correct answers must produce no
// Assert), the pitfalls scoped to a card's nodes, and the gap entry point.
import { readdirSync, readFileSync } from 'node:fs';
import { afterEach, describe, expect, test } from 'vitest';
import { wordHint } from '../../src/check/wordhint';
import { matchTranslation, type TranslationResult } from '../../src/check/translate';
import { normEnglish } from '../../src/check/translate/english';
import { RULES, assertHits, pitfallKey, registerPitfalls, ruleOf } from '../../src/check/traps';
import { retryLead } from '../../src/ui/components/card';
import { itemCheck } from '../../src/ui/session/cards';
import { PARAPHRASES } from './paraphrases';
import { WRONG } from './wrong-answers';

type Row = [es: string, en: string, input: string];
const run = ([es, en, input]: Row, targets?: string[]): TranslationResult =>
  matchTranslation(input, { es, en }, { accents: 'lenient', ...(targets ? { targets } : {}) });

describe('the table', () => {
  test('is the review\'s 41 rows, in priority order', () => {
    expect(RULES).toHaveLength(41);
    expect(RULES.map((r) => r.n)).toEqual(Array.from({ length: 41 }, (_, i) => i + 1));
    expect(new Set(RULES.map((r) => r.id)).size).toBe(41);
  });
  test('rows 1 to 33 assert, 34 to 36 ask, 37 to 40 note and 41 is silent', () => {
    const tier = (a: number, b: number) => new Set(RULES.filter((r) => r.n >= a && r.n <= b).map((r) => r.tier));
    expect([...tier(1, 33)]).toEqual(['assert']);
    expect([...tier(34, 36)]).toEqual(['ask']);
    expect([...tier(37, 40)]).toEqual(['note']);
    expect([...tier(41, 41)]).toEqual(['silent']);
  });
  test('a rule that ships has its words, and one that does not says what it waits for', () => {
    for (const r of RULES) {
      if (r.ships) expect(r.text.length, r.id).toBeGreaterThan(10);
      else expect(r.waits?.length ?? 0, r.id).toBeGreaterThan(10);
    }
  });
  test('the rules the review would not ship stay out: no-extra-for with pagar, mirar or escuchar; Es feliz and Está feliz', () => {
    expect(run(['Pagué el almuerzo.', 'I paid for lunch.', 'Pagué por el almuerzo.']).rule).toBeUndefined();
    expect(run(['Miraba la ventana.', 'I was looking at the window.', 'Miraba para la ventana.']).rule).toBeUndefined();
    expect(run(['Escucho música.', "I'm listening to music.", 'Escucho para música.']).rule).toBeUndefined();
    expect(run(['Es feliz.', "She's happy.", 'Está feliz.']).pass).toBe(true);
    expect(run(['Está feliz.', "She's happy.", 'Es feliz.']).pass).toBe(true);
  });
  test('the words are plain: no dashes, no markup', () => {
    for (const r of RULES) expect(r.text, r.id).not.toMatch(/[—–*<>]|\s-\s/);
  });
});

describe('an Assert names the cause, and says it only where it is certain', () => {
  /** [rule, a miss it fires on, a right answer or a near miss it must not fire on] */
  const CASES: Array<[string, Row, Row?]> = [
    ['mood-hard', ['Quiero que vengas.', 'I want you to come.', 'Quiero que vienes.'], ['Hernando no dijo que Rosa tenía deudas.', "Hernando didn't say Rosa had debts.", 'Hernando no dijo que Rosa tuviera deudas.']],
    ['mood-hard', ['Me alegra que estés aquí.', "I'm glad you're here.", 'Me alegra que estás aquí.']],
    ['mood-hard', ['No creo que venga.', "I don't think he's coming.", 'No creo que viene.']],
    ['mood-hard', ['Te llamo para que vengas.', "I'm calling so that you come.", 'Te llamo para que vienes.']],
    ['aspect-locked', ['Llovía cuando llegué.', 'It was raining when I arrived.', 'Llovió cuando llegué.'], ['Ayer estaba muy ocupada.', 'Yesterday I was very busy.', 'Ayer estuve muy ocupada.']],
    ['aspect-locked', ['Ayer fui al banco.', 'Yesterday I went to the bank.', 'Ayer iba al banco.']],
    ['ser-estar-locked', ['Estoy aburrido.', "I'm bored.", 'Soy aburrido.'], ['Estoy apurado.', "I'm in a hurry.", 'Soy apurado.']],
    ['ser-estar-locked', ['El café está en La Candelaria.', 'The café is in La Candelaria.', 'El café es en La Candelaria.']],
    ['ser-estar-locked', ['Está lloviendo.', "It's raining.", 'Es lloviendo.'], ['Está lloviendo.', "It's raining.", 'Es lluvia.']],
    ['exp-subject', ['Me gusta el café.', 'I like coffee.', 'Yo me gusta el café.']],
    ['exp-subject', ['Me gusta el café.', 'I like coffee.', 'Yo gusto el café.']],
    ['exp-agree', ['Me gustan los perros.', 'I like dogs.', 'Me gusta los perros.'], ['Me gustan la música y el cine.', 'I like music and movies.', 'Me gusta la música y el cine.']],
    ['inf-need', ['Voy a comer.', "I'm going to eat.", 'Voy a como.'], ['Vi a Yesid salir por la puerta de atrás.', 'I saw Yesid leave by the back door.', 'Vi a Yesid saliendo por la puerta de atrás.']],
    ['finite-need', ['No hablo francés.', "I don't speak French.", 'Yo no hablar francés.']],
    ['si-tense', ['Si tuviera tiempo, iría.', 'If I had time, I would go.', 'Si tendría tiempo, iría.']],
    ['se-drop', ['Se casó con Tomás.', 'She married Tomás.', 'Casó Tomás.'], ['Se abre a las ocho.', 'It opens at eight.', 'Abre a las ocho.']],
    ['lexical-pair:pedir-preguntar', ['Pedí la cuenta.', 'I asked for the bill.', 'Pregunté la cuenta.'], ['Pedí la cuenta.', 'I asked for the bill.', 'Pregunté por la cuenta.']],
    ['verb-prep', ['Aprendí a nadar.', 'I learned to swim.', 'Aprendí nadar.'], ['Debe ser tarde.', 'It must be late.', 'Debe de ser tarde.']],
    ['verb-prep', ['Quiero ir.', 'I want to go.', 'Quiero a ir.']],
    ['pers-a', ['Veo a Vale.', 'I see Vale.', 'Veo Vale.'], ['Voy a Bogotá.', "I'm going to Bogotá.", 'Voy Bogotá.']],
    ['article-job', ['Soy profesor.', "I'm a teacher.", 'Soy un profesor.']],
    ['article-general', ['Me gusta el café.', 'I like coffee.', 'Me gusta café.']],
    ['no-prep', ['Estoy buscando mi llave.', "I'm looking for my key.", 'Estoy buscando para mi llave.'], ['Pagué el almuerzo.', 'I paid for lunch.', 'Pagué por el almuerzo.']],
    ['be-tener', ['Tengo hambre.', "I'm hungry.", 'Estoy hambre.']],
    ['weather', ['Hoy hace frío.', "It's cold today.", 'Hoy es frío.']],
    ['cuando-future', ['Cuando llegues, llámame.', 'When you arrive, call me.', 'Cuando llegarás, llámame.']],
    ['neg-concord', ['No tengo nada.', "I don't have anything.", 'No tengo algo.'], ['Vale no quiere que Tomás firme nada.', "Vale doesn't want Tomás to sign anything.", 'Vale no quiere que Tomás firme algo.']],
    ['false-friend', ['Estoy emocionado.', "I'm excited.", 'Estoy excitado.']],
    ['would-habit', ['Cuando era niño, iba a la playa.', 'When I was a child, I would go to the beach.', 'Cuando era niño, iría a la playa.']],
    ['could', ['No pude abrir la puerta.', "I couldn't open the door.", 'No podría abrir la puerta.']],
    ['se-lo', ['Se lo di.', 'I gave it to him.', 'Le lo di.']],
    ['used-to', ['Antes vivía en Toronto.', 'I used to live in Toronto.', 'Usaba vivir en Toronto.']],
    ['strand', ['¿Con quién vives?', 'Who do you live with?', '¿Quién vives con?']],
    ['muy-noun', ['Tengo mucha hambre.', "I'm very hungry.", 'Tengo muy hambre.']],
    ['mas-num', ['Tengo más de diez libros.', 'I have more than ten books.', 'Tengo más que diez libros.']],
  ];

  test.each(CASES.filter(([, , good]) => !good).map(([rule, row]) => [rule, row[2], row] as const))('%s fires on "%s"', (rule, _input, row) => {
    const r = run(row);
    expect(r.pass).toBe(false);
    expect(r.rule, JSON.stringify(r)).toBe(rule);
    expect(ruleOf(r.rule!)).toBeTruthy();
    expect(r.ask).toBeUndefined();
  });

  test.each(CASES.map(([rule, row, near]) => [rule, row, near] as const).filter(([, , near]) => !!near))('%s fires, and not on its neighbour', (rule, row, near) => {
    expect(run(row).rule).toBe(rule);
    const n = run(near!);
    expect(n.rule, JSON.stringify(n)).not.toBe(rule);
  });

  test('a rule\'s words are its own, and an Assert of the plain diagnosis keeps the diagnosis\'s', () => {
    expect(run(['Quiero que vengas.', 'I want you to come.', 'Quiero que vienes.']).hint).toBe(ruleOf('mood-hard')!.text);
    expect(run(['Me gusta el café.', 'I like coffee.', 'Yo me gusta el café.']).hint).toBe(ruleOf('exp-subject')!.text);
    expect(run(['Pedí la cuenta.', 'I asked for the bill.', 'Pregunté la cuenta.']).hint).toBe('Pedir asks for something. Preguntar asks a question.');
  });
});

describe('an Ask does not claim an error', () => {
  test.each<Row>([
    ['Cuando llegues, llámame.', 'When you arrive, call me.', 'Cuando llegas, llámame.'],
    ['Hernando no dijo que Rosa tenía deudas.', "Hernando didn't say Rosa had debts.", 'Hernando no dijo que Rosa tuviera deudas.'],
    ['¡Qué bueno que tienes tiempo!', 'How good that you have time!', '¡Qué bueno que tengas tiempo!'],
  ])('a mood with no closed opener: %s / %s', (...row) => {
    const r = run(row);
    expect(r).toMatchObject({ pass: false, ask: true, hintKind: 'mood' });
    expect(r.rule).toBeUndefined();
    expect(r.hint).toBe(ruleOf('mood-open')!.text);
  });
  test.each<Row>([
    ['Ayer estaba muy ocupada.', 'Yesterday I was very busy.', 'Ayer estuve muy ocupada.'],
    ['¿Cómo era tu niñez?', 'What was your childhood like?', '¿Cómo fue tu niñez?'],
  ])('an aspect with nothing to lock it: %s', (...row) => {
    expect(run(row)).toMatchObject({ pass: false, ask: true, hintKind: 'aspect', hint: ruleOf('aspect-open')!.text });
  });
  test.each<Row>([
    ['Estoy apurado.', "I'm in a hurry.", 'Soy apurado.'],
    ['Este regalo es para ti.', 'This present is for you.', 'Este regalo es por ti.'],
  ])('a ser or estar and a por or para that only the card chose: %s', (...row) => {
    const r = run(row);
    expect(r).toMatchObject({ pass: false, ask: true });
    expect(r.rule).toBeUndefined();
  });
  test('so the retry does not say Almost, which would say it was wrong and close', () => {
    const asked = run(['Cuando llegues, llámame.', 'When you arrive, call me.', 'Cuando llegas, llámame.']);
    expect(retryLead(asked)).toBe('Not sure.');
    const named = run(['Quiero que vengas.', 'I want you to come.', 'Quiero que vienes.']);
    expect(retryLead(named)).toBe('Almost.');
  });
  test('and a hint that is a fact about a word stays one', () => {
    expect(run(['Come pescado.'.replace('Come', 'Como'), 'I eat fish.', 'Come pescado.'])).toMatchObject({ hintKind: 'verb-ending' });
    expect(run(['Como pescado.', 'I eat fish.', 'Come pescado.']).ask).toBeUndefined();
  });
});

describe('a Note passes a right answer and says its point', () => {
  test.each<[Row, string]>([
    [['La fiesta es en mi casa.', 'The party is at my place.', 'La fiesta está en mi casa.'], 'event-estar'],
    [['La casa se vendió.', 'The house was sold.', 'La casa fue vendida.'], 'passive-calque'],
    [['Se vendieron las casas.', 'The houses were sold.', 'Las casas fueron vendidas.'], 'passive-calque'],
    [['Se firmará el contrato.', 'The contract will be signed.', 'El contrato será firmado.'], 'passive-calque'],
    [['Se me olvidaron las llaves.', 'I forgot the keys.', 'Olvidé las llaves.'], 'se-me-optional'],
    [['Se te olvidó la cita.', 'You forgot the appointment.', 'Olvidaste la cita.'], 'se-me-optional'],
  ])('%s', (row, rule) => {
    const r = run(row);
    expect(r.pass, JSON.stringify(r)).toBe(true);
    expect(r.note).toBe(ruleOf(rule)!.text);
    expect(r.rule).toBeUndefined();
  });
  test.each<Row>([
    ['Se me cayó el celular.', 'I dropped the phone.', 'Me cayó el celular.'],
    ['La puerta se abrió.', 'The door opened.', 'La puerta abrió.'],
    ['El vaso se rompió.', 'The glass broke.', 'El vaso rompió.'],
    ['Aquí se venden casas.', 'Houses are sold here.', 'Aquí se vende casas.'],
    ['La casa se vendió.', 'The house was sold.', 'La casa fue vendido.'],
  ])('and not these, which are not right: %s', (...row) => {
    expect(run(row).pass).toBe(false);
  });
  test('the note rides with a swap\'s note, and a model sentence has none', () => {
    expect(run(['La casa se vendió.', 'The house was sold.', 'La casa se vendió.']).note).toBeUndefined();
  });
  test('Es feliz and Está feliz are each right for the other, and say so on a card about ser and estar', () => {
    const r = run(['Es feliz.', "She's happy.", 'Está feliz.'], ['g:ser-estar-adjectives']);
    expect(r).toMatchObject({ pass: true, note: '"está" works too. This card was practising "es".' });
    expect(run(['Es feliz.', "She's happy.", 'Está feliz.'], ['l:feliz']).note).toBeUndefined();
    expect(run(['Soy aburrido.', "I'm boring.", 'Estoy aburrido.']).pass).toBe(false);
  });
});

// The gate. A hint that names a cause is a claim, so the claims are measured: the errors a learner is known to make must
// not be told something untrue, and the answers that are right must never be told they are wrong in the voice of a rule.
describe('the gate: known errors must not mislead', () => {
  /** The rules that may name each tag of the contrastive review's battery. */
  const NAMES: Record<string, string[]> = {
    'ser/estar': ['ser-estar-locked'], age: ['be-tener'], 'to be state': ['be-tener'], weather: ['weather', 'ser-estar-locked'], 'ser/estar loc': ['ser-estar-locked'],
    'article job': ['article-job'], gustar: ['exp-subject', 'exp-agree', 'article-general'], 'verb+prep': ['no-prep', 'se-drop', 'inf-need', 'verb-prep'],
    'motion purpose': ['verb-prep'], just: ['verb-prep'], 'personal a': ['pers-a'], 'pedir/preguntar': ['lexical-pair:pedir-preguntar'], stranding: ['strand'],
    subj: ['mood-hard', 'cuando-future'], if: ['si-tense'], 'pret/imp': ['aspect-locked', 'ser-estar-locked'], 'lo le': ['se-lo'], 'do-support': ['finite-need'],
    negation: ['neg-concord'], '-ing': ['inf-need'], 'time noun': ['lexical-pair:tiempo-vez-hora'], 'mas de': ['mas-num'], 'muy/mucho': ['muy-noun'],
    'would habit': ['would-habit'], could: ['could'], 'false friend': ['false-friend'], 'used to': ['used-to'],
  };
  const all = WRONG.flatMap((w) => w.bad.map((input) => ({ w, input, r: matchTranslation(input, { es: w.es, en: w.en, accept: w.accept }, { accents: 'lenient' }) })));

  test('an Assert names a cause that belongs to the error', () => {
    const named = all.filter((x) => x.r.rule);
    expect(named.length).toBeGreaterThan(60);
    for (const x of named) expect(NAMES[x.w.tag] ?? [], `${x.w.es} / ${x.input}: ${x.r.rule}`).toContain(x.r.rule);
  });

  test('a rule that ships is right at least 19 times in 20', () => {
    const by = new Map<string, { n: number; right: number }>();
    for (const x of all.filter((y) => y.r.rule)) {
      const t = by.get(x.r.rule!) ?? { n: 0, right: 0 };
      t.n++; if ((NAMES[x.w.tag] ?? []).includes(x.r.rule!)) t.right++;
      by.set(x.r.rule!, t);
    }
    for (const [rule, t] of by) expect(t.right / t.n, rule).toBeGreaterThanOrEqual(0.95);
    expect(by.size).toBeGreaterThan(20);
  });

  test('no hint, of any tier, says what it cannot know', () => {
    const OVERCLAIM = /isn't the word here|check the meaning|Start with the verb|xnum|permanent|temporary/;
    for (const x of all) expect(x.r.hint ?? '', `${x.w.es} / ${x.input}`).not.toMatch(OVERCLAIM);
  });

  test('only an Assert carries a rule, and an Ask never does', () => {
    for (const x of all) { if (x.r.ask) expect(x.r.rule).toBeUndefined(); }
    const asked = all.filter((x) => x.r.ask);
    expect(asked.length).toBeGreaterThan(5);
  });

  test('the errors named are a good part of those a learner makes', () => {
    const named = all.filter((x) => x.r.rule).length;
    expect(named / all.length).toBeGreaterThan(0.25);
  });
});

describe('the gate: correct answers must produce no Assert', () => {
  /** Bank rows that share an English are right answers to each other. */
  function sameEnglish(): Array<{ model: { es: string; en: string; accept?: string[] }; input: string }> {
    const dir = new URL('../../content/bank/', import.meta.url);
    const by = new Map<string, Array<{ es: string; en: string; accept?: string[] }>>();
    for (const f of readdirSync(dir).filter((x) => /^u\d+\.json$/.test(x))) {
      for (const r of JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as Array<{ es: string; en: string; accept?: string[] }>) {
        if (/\n/.test(r.es)) continue;
        const k = normEnglish(r.en);
        by.set(k, [...(by.get(k) ?? []), r]);
      }
    }
    return [...by.values()].filter((rows) => rows.length > 1).flatMap((rows) => rows.flatMap((m) => rows.filter((o) => o.es !== m.es).map((o) => ({ model: m, input: o.es }))));
  }

  test('the audit\'s right answers that are still refused: no rule names them wrong', () => {
    const refused = PARAPHRASES.map((a) => ({ a, r: matchTranslation(a.input, { es: a.es, en: a.en, accept: a.accept ?? [] }, { accents: 'lenient' }) })).filter((x) => !x.r.pass);
    expect(refused.length).toBeGreaterThan(100);
    for (const x of refused) expect(x.r.rule, `${x.a.es} / ${x.a.input}: ${x.r.hint}`).toBeUndefined();
  });

  test('bank rows that share an English, one as the model and one as the answer', () => {
    const pairs = sameEnglish();
    expect(pairs.length).toBeGreaterThan(200);
    let refused = 0;
    for (const p of pairs) {
      const r = matchTranslation(p.input, { es: p.model.es, en: p.model.en, accept: p.model.accept }, { accents: 'lenient' });
      if (r.pass) continue;
      refused++;
      expect(r.rule, `${p.model.es} / ${p.input}: ${r.hint}`).toBeUndefined();
    }
    expect(refused).toBeGreaterThan(100);
  });

  test('a right answer is never asked about either: an Ask is for an answer the app could not check', () => {
    for (const a of PARAPHRASES.filter((x) => x.ok)) expect(matchTranslation(a.input, { es: a.es, en: a.en, accept: a.accept ?? [] }, { accents: 'lenient' }).ask, a.input).toBeUndefined();
  });
});

describe('pitfalls speak on the card of their node and no other', () => {
  afterEach(() => registerPitfalls(undefined));
  const es = 'Era tarde y llovía.';
  const en = 'It was late and it was raining.';
  const wrong = 'Fue tarde y llovió.';
  const table = () => registerPitfalls({
    version: 1, about: 'test', nodes: { 'g:pret-vs-imperfect': [[pitfallKey(wrong), 'The time and the weather set the scene, so both take the describing past.']] },
  });

  test('on a card about that node, the lesson\'s reason is the hint, and it is an Assert', () => {
    table();
    const r = matchTranslation(wrong, { es, en }, { targets: ['g:pret-vs-imperfect', 'l:tarde'] });
    expect(r).toMatchObject({ pass: false, rule: 'pitfall', hintKind: 'pitfall', hint: 'The time and the weather set the scene, so both take the describing past.' });
  });
  test('on a card about another node, or one whose nodes are not known, it says nothing of the sort', () => {
    table();
    expect(matchTranslation(wrong, { es, en }, { targets: ['g:preterite-ar'] }).rule).not.toBe('pitfall');
    expect(matchTranslation(wrong, { es, en }).rule).not.toBe('pitfall');
  });
  test('the key is the matcher\'s own, so case, punctuation and a dropped subject pronoun find it', () => {
    table();
    expect(matchTranslation('fue tarde y llovió', { es, en }, { targets: ['g:pret-vs-imperfect'] }).rule).toBe('pitfall');
  });
  test('with no table in force there are no pitfalls, and a table that is not one is no table', () => {
    registerPitfalls(undefined);
    expect(matchTranslation(wrong, { es, en }, { targets: ['g:pret-vs-imperfect'] }).rule).not.toBe('pitfall');
    registerPitfalls({ version: 1, about: '', nodes: { 'g:x': 'rubbish' as never } });
    expect(matchTranslation(wrong, { es, en }, { targets: ['g:x'] }).rule).not.toBe('pitfall');
  });
  test('a pitfall that is right Spanish is not told it is wrong when the matcher accepts it', () => {
    registerPitfalls({ version: 1, about: 'test', nodes: { 'g:x': [[pitfallKey('Te llamo mañana.'), 'false pitfall']] } });
    expect(matchTranslation('Te llamo mañana.', { es: 'Mañana te llamo.', en: "I'll call you tomorrow." }, { targets: ['g:x'] }).pass).toBe(true);
  });
});

describe('a gap has the same guards', () => {
  test('a mood is asserted after an opener of the closed list and asked about after any other', () => {
    expect(wordHint('vienes', ['vengas'], undefined, { before: ['quiero', 'que'], en: 'I want you to come.', answer: 'vengas' })).toMatchObject({ kind: 'mood', rule: 'mood-hard' });
    expect(wordHint('vienes', ['vengas'], undefined, { before: ['cuando'], en: 'When you come.', answer: 'vengas' })).toMatchObject({ kind: 'mood', ask: true });
    expect(wordHint('vienes', ['vengas'], undefined, { before: ['cuando'], en: 'When you come.', answer: 'vengas' })?.rule).toBeUndefined();
  });
  test('an aspect is asserted only when the English locks it', () => {
    expect(wordHint('llovió', ['llovía'], undefined, { before: [], en: 'It was raining when I arrived.', answer: 'llovía' })).toMatchObject({ kind: 'aspect', rule: 'aspect-locked' });
    expect(wordHint('estuve', ['estaba'], undefined, { before: ['ayer'], en: 'Yesterday I was busy.', answer: 'estaba' })).toMatchObject({ kind: 'aspect', ask: true });
  });
  test('ser or estar and por or para are asked about, and a person or a tense is a fact about the word', () => {
    expect(wordHint('soy', ['estoy'])).toMatchObject({ kind: 'ser-estar', ask: true });
    expect(wordHint('por', ['para'])).toMatchObject({ kind: 'por-para', ask: true });
    expect(wordHint('como', ['comes'])?.ask).toBeUndefined();
    expect(wordHint('como', ['comes'])?.rule).toBeUndefined();
  });
  test('with no sentence around it, a lone word never asserts a mood', () => {
    expect(wordHint('vienes', ['vengas'])).toMatchObject({ kind: 'mood', ask: true });
  });
});

describe('a gap card, through the card\'s own check', () => {
  const gap = (gapped: string, en: string, cue: string, answer: string) =>
    ({ id: 'g', generator: 'ladder', nodes: [], kind: 'typeForm', gapped, en, cue, answer, accept: [] }) as Parameters<typeof itemCheck>[0];
  test('after quiero que, an indicative in the gap is an Assert, and the claim is not offered for it', () => {
    const check = itemCheck(gap('Quiero que ___ mañana.', 'I want you to come tomorrow.', '(venir, tú)', 'vengas'));
    expect(check('vienes')).toMatchObject({ pass: false, hintKind: 'mood', rule: 'mood-hard' });
    expect(check('vienes').ask).toBeUndefined();
  });
  test('after cuando it asks, and says nothing is wrong', () => {
    const check = itemCheck(gap('Cuando ___, llámame.', 'When you arrive, call me.', '(llegar, tú)', 'llegues'));
    expect(check('llegas')).toMatchObject({ pass: false, hintKind: 'mood', ask: true });
    expect(check('llegas').rule).toBeUndefined();
  });
  test('the English that locks an aspect asserts it, and one that does not asks', () => {
    expect(itemCheck(gap('___ cuando llegué.', 'It was raining when I arrived.', '(llover)', 'Llovía'))('llovió')).toMatchObject({ hintKind: 'aspect', rule: 'aspect-locked' });
    expect(itemCheck(gap('Ayer ___ muy ocupada.', 'Yesterday I was very busy.', '(estar, yo)', 'estaba'))('estuve')).toMatchObject({ hintKind: 'aspect', ask: true });
  });
  test('a person or a tense stays a fact about the word', () => {
    const r = itemCheck(gap('Tomás ___ pescado.', 'Tomás eats fish.', '(comer)', 'come'))('como');
    expect(r.rule).toBeUndefined();
    expect(r.ask).toBeUndefined();
  });
});

describe('Weak spots count Assert hits', () => {
  test('a row with a rule is a hit, and a row that only names a slip is not', () => {
    const rows = [{ rule: 'mood-hard' }, { rule: 'mood-hard' }, { rule: 'strand' }, {}, { rule: undefined }];
    expect([...assertHits(rows)]).toEqual([['mood-hard', 2], ['strand', 1]]);
  });
  test('an Ask carries no rule, so a log of Asks is no hits', () => {
    const r = run(['Cuando llegues, llámame.', 'When you arrive, call me.', 'Cuando llegas, llámame.']);
    expect(assertHits([{ rule: r.rule }]).size).toBe(0);
  });
});
