// The port's own behaviour: the fixes, the added verbs and tenses, variety,
// and invariants checked over every form of every verb.
import { describe, expect, test } from 'vitest';
import {
  IMP_PERSONS, PERSONS, PRODUCTION_IMP_PERSONS, PRODUCTION_PERSONS, TENSES, VERBS,
  acceptedForms, analyzeSentence, analyzeToken, attachEnclitic, conjugate, gerund, isReflexive,
  legacySpellings, participle, participles, reflexiveBase, verbByInf, voseoForms, type TenseKey,
} from '../../src/engine';

const P = (inf: string, tense: TenseKey) => conjugate(inf, tense);

describe('participle fixes', () => {
  test.each([
    ['resolver', 'resuelto'], ['devolver', 'devuelto'], ['absolver', 'absuelto'], ['disolver', 'disuelto'],
    ['revolver', 'revuelto'], ['envolver', 'envuelto'], ['componer', 'compuesto'], ['oponer', 'opuesto'],
    ['oponerse', 'opuesto'], ['descomponerse', 'descompuesto'], ['componerse', 'compuesto'],
    ['suscribirse', 'suscrito'], ['suscribir', 'suscrito'], ['inscribir', 'inscrito'], ['describir', 'descrito'],
    ['encubrir', 'encubierto'], ['deshacer', 'deshecho'], ['satisfacer', 'satisfecho'], ['predecir', 'predicho'],
    ['contradecir', 'contradicho'], ['prever', 'previsto'], ['freír', 'frito'], ['proveer', 'provisto'],
    // and the ones that must stay regular
    ['bendecir', 'bendecido'], ['corromper', 'corrompido'], ['mover', 'movido'], ['llover', 'llovido'],
    ['atreverse', 'atrevido'], ['promover', 'promovido'],
  ])('%s > %s', (inf, part) => {
    expect(participle(verbByInf(inf)!)).toBe(part);
  });

  test('compound tenses use the fixed participle', () => {
    expect(P('resolver', 'perfecto')[0]).toBe('he resuelto');
    expect(P('suscribirse', 'plusc')[2]).toBe('se había suscrito');
  });

  test('freír accepts both participles', () => {
    expect(participles(verbByInf('freír')!)).toEqual(['frito', 'freído']);
    expect(acceptedForms('freír', 'perfecto', 0)).toEqual(['he frito', 'he freído']);
    expect(analyzeSentence('he freído un huevo').compounds[0]?.tenses).toEqual(['perfecto']);
  });

  /* SYSTEMATIC: every verb in a derived family gets the family's participle,
   * however it was entered. A new -olver verb added without `part` is caught. */
  test('every derived-family verb has the irregular participle', () => {
    const families: Array<[RegExp, (b: string) => string]> = [
      [/olver$/, (b) => b.replace(/olver$/, 'uelto')],
      [/poner$/, (b) => b.replace(/poner$/, 'puesto')],
      [/scribir$/, (b) => b.replace(/scribir$/, 'scrito')],
      [/cubrir$/, (b) => b.replace(/cubrir$/, 'cubierto')],
      [/^(des|re)?hacer$/, (b) => b.replace(/hacer$/, 'hecho')],
      [/^(pre|contra|des)?decir$/, (b) => b.replace(/decir$/, 'dicho')],
      [/^(pre|entre|re)?ver$/, (b) => b.replace(/ver$/, 'visto')],
      [/^(entre|re)?abrir$/, (b) => b.replace(/abrir$/, 'abierto')],
      [/^romper$/, () => 'roto'], [/^morir$/, () => 'muerto'],
    ];
    const bad: string[] = [];
    for (const v of VERBS) {
      const b = isReflexive(v.inf) ? reflexiveBase(v.inf) : v.inf;
      for (const [re, want] of families) if (re.test(b) && participle(v) !== want(b)) bad.push(`${v.inf}: ${participle(v)}`);
    }
    expect(bad).toEqual([]);
  });
});

describe('form fixes', () => {
  test('prever vosotros present is prevéis', () => { expect(P('prever', 'presente')[4]).toBe('prevéis'); });
  test('reír preterite 3sg is rio (RAE 2010), and rió is still recognised as exact', () => {
    expect(P('reír', 'preterito')[2]).toBe('rio');
    expect(P('freír', 'preterito')[2]).toBe('frio');
    expect(P('sonreír', 'preterito')[2]).toBe('sonrió');           // two syllables: keeps it
    expect(legacySpellings().get('rio')).toBe('rió');
    const a = analyzeToken('rió').find((x) => x.inf === 'reír' && x.tense === 'preterito');
    expect(a?.accentExact).toBe(true);
    expect(acceptedForms('reír', 'preterito', 2)).toEqual(['rio', 'rió']);
  });
  test('other 2010 monosyllables', () => {
    expect(P('guiar', 'preterito').slice(0, 3)).toEqual(['guie', 'guiaste', 'guio']);
    expect(P('huir', 'preterito')[0]).toBe('hui');
    expect(P('huir', 'presente')[4]).toBe('huis');
    expect(P('criar', 'presubj')[4]).toBe('crieis');
  });
  test('ñ absorbs the i', () => {
    expect(P('reñir', 'preterito')[2]).toBe('riñó');
    expect(P('teñirse', 'preterito')[5]).toBe('se tiñeron');
    expect(gerund(verbByInf('reñir')!)).toBe('riñendo');
  });
  test('reflexive gerunds keep the stem change', () => {
    expect(gerund(verbByInf('divertirse')!)).toBe('divirtiendo');
    expect(gerund(verbByInf('morirse')!)).toBe('muriendo');
  });
  test('enclitic accents', () => {
    expect(P('mantenerse', 'imperativo')[0]).toBe('mantente');
    expect(P('enfriarse', 'imperativo')[0]).toBe('enfríate');
    expect(P('darse', 'imperativo')[1]).toBe('dese');
    expect(P('pelearse', 'imperativo')[0]).toBe('peléate');
    expect(P('levantarse', 'imperativo')).toEqual(['levántate', 'levántese', 'levantémonos', 'levantaos', 'levántense']);
    expect(P('irse', 'imperativo')).toEqual(['vete', 'váyase', 'vámonos', 'idos', 'váyanse']);
    expect(attachEnclitic('dime', 'lo')).toBe('dímelo');
    expect(attachEnclitic('da', 'me')).toBe('dame');
  });
  test('contradecir / predecir tú command', () => {
    expect(P('contradecir', 'imperativo')[0]).toBe('contradice');
    expect(P('predecir', 'imperativo')[0]).toBe('predice');
  });
  test('reencontrarse conjugates like encontrarse', () => {
    expect(P('reencontrarse', 'presente')[0]).toBe('me reencuentro');
  });
});

describe('added verbs', () => {
  test.each([
    ['caber', 'presente', 0, 'quepo'], ['caber', 'preterito', 2, 'cupo'], ['caber', 'futuro', 0, 'cabré'],
    ['satisfacer', 'preterito', 2, 'satisfizo'], ['satisfacer', 'presente', 0, 'satisfago'],
    ['actuar', 'presente', 0, 'actúo'], ['actuar', 'presente', 3, 'actuamos'],
    ['averiguar', 'preterito', 0, 'averigüé'], ['averiguar', 'presubj', 3, 'averigüemos'],
    ['reunir', 'presente', 0, 'reúno'], ['reunir', 'presente', 3, 'reunimos'], ['reunir', 'presubj', 3, 'reunamos'],
    ['graduarse', 'presente', 0, 'me gradúo'], ['graduarse', 'imperativo', 0, 'gradúate'],
    ['freír', 'presente', 0, 'frío'], ['freír', 'presubj', 4, 'friais'],
    ['predecir', 'presente', 0, 'predigo'], ['predecir', 'preterito', 0, 'predije'], ['predecir', 'futuro', 0, 'prediré'],
    ['deshacer', 'preterito', 2, 'deshizo'], ['deshacer', 'imperativo', 0, 'deshaz'], ['deshacer', 'futuro', 0, 'desharé'],
    ['torcer', 'presente', 0, 'tuerzo'], ['torcer', 'presubj', 3, 'torzamos'], ['torcer', 'preterito', 2, 'torció'],
    ['soler', 'presente', 0, 'suelo'], ['almorzar', 'presubj', 0, 'almuerce'], ['volcar', 'preterito', 0, 'volqué'],
    ['medir', 'preterito', 2, 'midió'], ['mentir', 'gerund', 0, 'mintiendo'], ['ceñir', 'preterito', 2, 'ciñó'],
    ['sostener', 'imperativo', 0, 'sostén'], ['sobresalir', 'imperativo', 0, 'sobresal'],
    ['destruir', 'preterito', 2, 'destruyó'], ['perseguir', 'presente', 0, 'persigo'],
  ] as const)('%s %s[%i] = %s', (inf, tense, i, want) => {
    if (tense === 'gerund') expect(gerund(verbByInf(inf)!)).toBe(want);
    else expect(conjugate(inf, tense)[i]).toBe(want);
  });

  test('added verbs are flagged and unique', () => {
    const infs = VERBS.map((v) => v.inf);
    expect(new Set(infs).size).toBe(infs.length);
    expect(VERBS.filter((v) => v.added).length).toBeGreaterThanOrEqual(100);
  });
});

describe('added tenses', () => {
  test('pluperfect subjunctive, both forms', () => {
    expect(P('hablar', 'pluscsubj')).toEqual(['hubiera hablado', 'hubieras hablado', 'hubiera hablado', 'hubiéramos hablado', 'hubierais hablado', 'hubieran hablado']);
    expect(P('hacer', 'pluscsubjse')[3]).toBe('hubiésemos hecho');
    expect(P('levantarse', 'pluscsubj')[0]).toBe('me hubiera levantado');
    expect(acceptedForms('hablar', 'pluscsubj', 0)).toEqual(['hubiera hablado', 'hubiese hablado']);
  });
  test('-se imperfect subjunctive', () => {
    expect(P('tener', 'impsubjse')).toEqual(['tuviese', 'tuvieses', 'tuviese', 'tuviésemos', 'tuvieseis', 'tuviesen']);
    expect(acceptedForms('tener', 'impsubj', 3)).toEqual(['tuviéramos', 'tuviésemos']);
  });
  test('future subjunctive is recognition-only', () => {
    expect(P('ser', 'futsubj')).toEqual(['fuere', 'fueres', 'fuere', 'fuéremos', 'fuereis', 'fueren']);
    expect(TENSES.find((t) => t.key === 'futsubj')?.recognitionOnly).toBe(true);
    const a = analyzeToken('fuere');
    expect(a.some((x) => x.tense === 'futsubj' && x.target === false)).toBe(true);
  });
  test('compounds report the tense the haber form builds', () => {
    expect(analyzeSentence('He comido').compounds[0].tenses).toEqual(['perfecto']);
    expect(analyzeSentence('Si hubiera sabido').compounds[0].tenses).toEqual(['pluscsubj']);
    expect(analyzeSentence('Si hubiese sabido').compounds[0].tenses).toEqual(['pluscsubjse']);
    expect(analyzeSentence('Habíamos salido').compounds[0].tenses).toEqual(['plusc']);
  });
});

describe('variety', () => {
  test('production persons exclude vosotros; conjugate still has it', () => {
    expect(PRODUCTION_PERSONS).not.toContain('vosotros');
    expect(PRODUCTION_IMP_PERSONS).not.toContain('vosotros');
    expect(PRODUCTION_PERSONS.length).toBe(5);
    expect(PRODUCTION_IMP_PERSONS.length).toBe(4);
    expect(conjugate('hablar', 'presente')[PERSONS.indexOf('vosotros')]).toBe('habláis');
    expect(conjugate('hablar', 'imperativo')[IMP_PERSONS.indexOf('vosotros')]).toBe('hablad');
  });

  test('vosotros forms are recognised but not target', () => {
    const a = analyzeToken('habláis');
    expect(a).toHaveLength(1);
    expect(a[0]).toMatchObject({ inf: 'hablar', person: 'vosotros', target: false, variety: 'vosotros' });
    expect(analyzeToken('hablas')[0]).toMatchObject({ person: 'tú', target: true });
  });

  test.each([
    ['tenés', 'tener', 'presente'], ['sos', 'ser', 'presente'], ['hablás', 'hablar', 'presente'],
    ['podés', 'poder', 'presente'], ['vení', 'venir', 'imperativo'], ['decime', null, null],
  ])('voseo %s', (tok, inf, tense) => {
    const vos = analyzeToken(tok).filter((a) => a.variety === 'voseo');
    if (!inf) { expect(vos).toEqual([]); return; }     // clitic + voseo is not attempted (tomate problem)
    expect(vos[0]).toMatchObject({ inf, tense, person: 'vos', target: false, accentExact: true });
  });

  test('voseo never attaches to an unaccented tú form', () => {
    expect(analyzeToken('hablas').some((a) => a.variety === 'voseo')).toBe(false);
    expect(analyzeToken('tenes').some((a) => a.variety === 'voseo')).toBe(false);
  });

  test('voseo forms that equal tú forms are not separately indexed', () => {
    expect(voseoForms('ir')).toEqual({ presente: null, imperativo: null });
    expect(voseoForms('dar').presente).toBeNull();     // das
    expect(voseoForms('ser').presente).toBe('sos');
  });
});

describe('homographs of added verbs', () => {
  test.each(['una', 'unas', 'sobre', 'tarde', 'enfrente', 'frío', 'fría'])('%s is not read as an added verb', (w) => {
    expect(analyzeToken(w).filter((a) => verbByInf(a.inf)?.added)).toEqual([]);
  });
  test('the verbs themselves are still recognised elsewhere', () => {
    expect(analyzeToken('unimos')[0]?.inf).toBe('unir');
    expect(analyzeToken('tardó')[0]?.inf).toBe('tardar');
    expect(analyzeToken('frio').some((a) => a.inf === 'freír' && a.tense === 'preterito')).toBe(true);
  });
});

/* ---- invariants over every form of every verb ---------------------------- */
describe('invariants', () => {
  const all: Array<[string, string, string]> = [];
  for (const v of VERBS) for (const t of TENSES) conjugate(v, t.key).forEach((f) => all.push([v.inf, t.key, f]));

  test('no word carries two written accents', () => {
    expect(all.filter(([, , f]) => f.split(' ').some((w) => (w.match(/[áéíóú]/g) ?? []).length > 1))).toEqual([]);
  });
  test('no *ñió / *ñie- / *llió', () => {
    expect(all.filter(([, , f]) => /(ñ|ll)i[óe]/.test(f))).toEqual([]);
  });
  test('no accented orthographic monosyllable except dé and sé', () => {
    const mono = /^[^aeiouáéíóú]*(ió|ié|iá|uó|ué|uá|uí|iú|iái|iéi)s?$/;
    expect(all.filter(([, , f]) => f.split(' ').some((w) => mono.test(w.replace(/^(gu|qu)/, 'g'))))).toEqual([]);
  });
  test('every form is non-empty lower-case Spanish', () => {
    expect(all.filter(([, , f]) => !/^[a-záéíóúñü ]+$/.test(f))).toEqual([]);
  });
  const SUPPRESSED = new Set(['una', 'unas', 'sobre', 'tarde', 'tardes', 'enfrente', 'frío', 'fría', 'frías']);
  test('every generated single-word form analyses back to its own verb', () => {
    const bad: string[] = [];
    for (const v of VERBS) for (const t of TENSES) {
      if (t.key === 'impneg' || isReflexive(v.inf)) continue;
      const forms = conjugate(v, t.key).filter((f) => !f.includes(' '));
      for (const f of forms) {
        if (SUPPRESSED.has(f)) continue;               // deliberately not read as a verb (see analyze.ts)
        if (!analyzeToken(f).some((a) => a.inf === v.inf && a.accentExact)) bad.push(`${v.inf} ${t.key} ${f}`);
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
  }, 30000);
});
