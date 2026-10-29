// Hand-checked sentences for the feature tagger. Expectations are feature
// KEYS (not node ids), so the curriculum can be re-cut without touching them.
//   has:  keys that must be present (prefix match with a trailing '*')
//   not:  keys that must be absent (same matching)
//   pos:  { word: expected POS } for homograph decisions
//   lemma:{ word: expected lemma }
import { describe, expect, test } from 'vitest';
import { tagSentence, splitSentences, tagText } from '../../src/engine/tagger';

interface Case { es: string; has?: string[]; not?: string[]; pos?: Record<string, string>; lemma?: Record<string, string>; low?: boolean; trigger?: string }

const match = (keys: string[], k: string) => (k.endsWith('*') ? keys.some((x) => x.startsWith(k.slice(0, -1))) : keys.includes(k));

function run(cases: Case[]) {
  for (const c of cases) {
    test(c.es, () => {
      const r = tagSentence(c.es);
      const keys = r.features.map((f) => f.key);
      for (const k of c.has ?? []) expect(match(keys, k), `expected ${k} in [${keys.filter((x) => !x.startsWith('lex.')).join(', ')}]`).toBe(true);
      for (const k of c.not ?? []) expect(match(keys, k), `did not expect ${k} in [${keys.filter((x) => !x.startsWith('lex.')).join(', ')}]`).toBe(false);
      for (const [w, p] of Object.entries(c.pos ?? {})) {
        const tok = r.tokens.find((t) => t.w === w);
        expect(tok?.pos, `POS of "${w}"`).toBe(p);
      }
      for (const [w, l] of Object.entries(c.lemma ?? {})) {
        const tok = r.tokens.find((t) => t.w === w);
        expect(tok?.lemma, `lemma of "${w}"`).toBe(l);
      }
      if (c.low !== undefined) expect(r.confidence, r.lowReasons.join('; ')).toBe(c.low ? 'low' : 'high');
      if (c.trigger) expect(r.features.find((f) => f.trigger)?.trigger).toBe(c.trigger);
    });
  }
}

describe('homographs: function words', () => {
  run([
    { es: 'Como arroz con pollo.', pos: { como: 'verb' }, has: ['tense.presente.regular.er'] },
    { es: 'Como siempre, llegó tarde.', pos: { como: 'conj' } },
    { es: 'Es tan alto como su padre.', pos: { como: 'conj' }, has: ['comp.tan-como'] },
    { es: 'Yo como poco por la noche.', pos: { como: 'verb' } },
    { es: 'Cuando llego a casa, como.', pos: { como: 'verb' } },
    { es: 'No sé cómo se llama.', pos: { 'cómo': 'int' }, has: ['q.indirect'] },
    { es: 'El gato está bajo la mesa.', pos: { bajo: 'prep' }, has: ['estar.location'] },
    { es: 'Yo bajo la escalera despacio.', pos: { bajo: 'verb' }, lemma: { bajo: 'bajar' } },
    { es: 'El sobre está sobre la mesa.', pos: { el: 'det' }, has: ['estar.location'] },
    { es: 'Hablamos sobre el viaje.', pos: { sobre: 'prep' } },
    { es: 'Vive entre Bogotá y Cali.', pos: { entre: 'prep' } },
    { es: 'Entre, por favor.', pos: { entre: 'verb' }, has: ['cmd.usted.aff'] },
    { es: 'Esto es para ti.', pos: { para: 'prep' }, has: ['prep.para', 'pron.prep'] },
    { es: 'No hay nada en la nevera.', pos: { nada: 'pron' }, has: ['neg.double', 'hay'] },
    { es: 'Ella nada muy bien.', pos: { nada: 'verb' } },
    { es: 'Pese a la lluvia, salimos.', pos: { pese: 'prep' }, not: ['subj.unlicensed'] },
  ]);
});

describe('homographs: nouns and verbs', () => {
  run([
    { es: 'Trabajo en un banco.', pos: { trabajo: 'verb' }, lemma: { trabajo: 'trabajar' } },
    { es: 'El trabajo es difícil.', pos: { trabajo: 'noun' } },
    { es: 'Busco trabajo en Medellín.', pos: { trabajo: 'noun' } },
    { es: 'Mi trabajo me gusta mucho.', pos: { trabajo: 'noun' }, has: ['gustar'] },
    { es: 'Vino a casa muy tarde.', pos: { vino: 'verb' }, lemma: { vino: 'venir' }, has: ['tense.preterito.irregular'] },
    { es: 'Me gusta el vino tinto.', pos: { vino: 'noun' }, not: ['tense.preterito*'] },
    { es: 'Pedimos un vino blanco.', pos: { vino: 'noun' } },
    { es: 'La cocina es pequeña.', pos: { cocina: 'noun' } },
    { es: 'Mi abuela cocina muy bien.', pos: { cocina: 'verb' } },
    { es: 'Vivo en una casa grande.', pos: { casa: 'noun' } },
    { es: 'Te cuento un secreto.', pos: { cuento: 'verb' }, has: ['tense.presente.stem-ue'] },
    { es: 'Leí un cuento precioso.', pos: { cuento: 'noun' } },
    { es: 'El camino es largo.', pos: { camino: 'noun' } },
    { es: 'Camino al trabajo todos los días.', pos: { camino: 'verb' } },
    { es: 'La vista desde aquí es increíble.', pos: { vista: 'noun' }, not: ['subj.unlicensed', 'tense.presubj*'] },
    { es: 'Pásame la sal, por favor.', pos: { sal: 'noun' } },
    { es: 'Tengo mucha sed.', pos: { sed: 'noun' }, not: ['dialect.vosotros'] },
    { es: 'Este libro es mío.', pos: { este: 'dem' }, has: ['np.possessive.stressed'] },
    { es: 'Espero que esté bien.', has: ['tense.presubj*', 'subj.volition.hope'] },
    { es: 'Hay varias ocasiones para hablar.', pos: { ocasiones: 'x' }, not: ['subj.unlicensed'] },
    { es: 'La dificultad es el idioma.', not: ['dialect.vosotros', 'cmd.vosotros'] },
    { es: 'Fue a la tienda.', lemma: { fue: 'ir' } },
    { es: 'Fue un día difícil.', lemma: { fue: 'ser' }, has: ['ser.identity'] },
    { es: 'Ve a la tienda.', has: ['cmd.tu.aff.irregular'], lemma: { ve: 'ir' } },
    { es: 'Ella ve la televisión.', lemma: { ve: 'ver' }, not: ['cmd.*'] },
    { es: 'Ya lo sé.', lemma: { 'sé': 'saber' }, has: ['tense.presente.irregular-yo', 'clitic.do'] },
    { es: 'Era muy tarde.', lemma: { era: 'ser' }, has: ['tense.imperfecto.state'] },
    { es: 'Lo que dijo es cierto.', has: ['rel.lo-que'], pos: { lo: 'det' } },
  ]);
});

describe('tense and verb class', () => {
  run([
    { es: 'Hablo español.', has: ['tense.presente.regular.ar'] },
    { es: 'Vivimos en Bogotá.', has: ['tense.presente.regular.ir'] },
    { es: 'Hablamos ayer por teléfono.', has: ['tense.preterito.regular.ar'], not: ['tense.presente*'] },
    { es: 'Hablamos español en casa.', has: ['tense.presente.regular.ar'], not: ['tense.preterito*'] },
    { es: 'Quiero un café.', has: ['tense.presente.stem-ie'] },
    { es: 'Puedo ayudarte.', has: ['tense.presente.stem-ue', 'peri.poder', 'clitic.enclitic.inf'] },
    { es: 'Pido la cuenta.', has: ['tense.presente.stem-i'] },
    { es: 'Tengo dos hermanos.', has: ['tense.presente.irregular-yo'] },
    { es: 'Conozco a tu hermana.', has: ['tense.presente.irregular-yo', 'np.possessive.basic'] },
    { es: 'Soy de Toronto.', has: ['tense.presente.irregular.ser', 'ser.origin'] },
    { es: 'Estoy cansado.', has: ['tense.presente.irregular.estar', 'estar.state'] },
    { es: 'Voy al mercado.', has: ['tense.presente.irregular.ir'] },
    { es: 'Busqué las llaves.', has: ['tense.preterito.spelling'] },
    { es: 'Pidió un aumento.', has: ['tense.preterito.stem'] },
    { es: 'Tuve que salir temprano.', has: ['tense.preterito.irregular', 'peri.tener-que'] },
    { es: '¿Qué hiciste el sábado?', has: ['tense.preterito.irregular.hacer', 'q.wh'] },
    { es: 'De niño jugaba al fútbol.', has: ['tense.imperfecto.regular'] },
    { es: 'Íbamos a la playa cada verano.', has: ['tense.imperfecto.irregular', 'np.cada'] },
    { es: 'Mañana lloverá en Bogotá.', has: ['tense.futuro.regular'] },
    { es: 'Te diré la verdad.', has: ['tense.futuro.irregular'] },
    { es: 'Me encantaría ir.', has: ['tense.condicional.regular', 'gustar.like'] },
    { es: '¿Podrías ayudarme?', has: ['tense.condicional.irregular'] },
    { es: 'Nunca he probado el ajiaco.', has: ['tense.perfecto'], not: ['tense.presente*'] },
    { es: 'Cuando llegué, ya se había ido.', has: ['tense.plusc', 'tense.preterito*'] },
    { es: 'Ya habrá salido.', has: ['tense.futperf'] },
    { es: 'Yo lo habría hecho.', has: ['tense.condperf', 'participle.irregular', 'clitic.do'] },
    { es: 'Era tarde y llovía cuando sonó el teléfono.', has: ['tense.mix'] },
  ]);
});

describe('subjunctive and its trigger', () => {
  run([
    { es: 'Quiero que vengas mañana.', has: ['tense.presubj', 'subj.volition.want'], trigger: 'quiero que' },
    { es: 'Necesito que me ayudes.', has: ['subj.volition.want'] },
    { es: 'Te recomiendo que hables con ella.', has: ['subj.volition.influence'] },
    { es: 'Me pidió que la llamara.', has: ['tense.impsubj', 'subj.volition.influence.past'] },
    { es: 'Dice que vengas.', has: ['subj.volition.reported'] },
    { es: 'Dice que viene mañana.', has: ['que.complement'], not: ['tense.presubj*', 'subj.*'] },
    { es: 'Es una pena que no puedas venir.', has: ['subj.evaluation', 'que.complement'], not: ['rel.que'] },
    { es: 'Es importante que lo leas.', has: ['subj.impersonal'] },
    { es: 'Es posible que llueva.', has: ['subj.doubt.possible'] },
    { es: 'Puede que tengas razón.', has: ['subj.doubt.possible'] },
    { es: 'Dudo que venga.', has: ['subj.doubt'] },
    { es: 'No creo que tengas razón.', has: ['subj.doubt.negated-belief'] },
    { es: 'Creo que tienes razón.', has: ['que.complement'], not: ['subj.*'] },
    { es: 'Me alegra que estés aquí.', has: ['subj.emotion.basic'], not: ['clitic.personal'] },
    { es: 'Me da miedo que vendan el edificio.', has: ['subj.emotion'] },
    { es: 'Ojalá llueva mañana.', has: ['subj.ojala'] },
    { es: 'Ojalá estuvieras aquí.', has: ['subj.ojala.past'] },
    { es: 'Quizás venga mañana.', has: ['subj.adverb-doubt'] },
    { es: 'Te lo digo para que lo sepas.', has: ['subj.purpose', 'clitic.combined'] },
    { es: 'Salió sin que nadie lo viera.', has: ['subj.conj'] },
    { es: 'Firmo con tal de que nos dejen quedarnos.', has: ['subj.conj.condition'] },
    { es: 'Cuando llegues, llámame.', has: ['subj.temporal', 'cmd.tu.aff', 'clitic.enclitic.cmd'] },
    { es: 'Cuando llego, Vale ya está aquí.', has: ['conj.cuando.ind'], not: ['subj.*'] },
    { es: 'En cuanto sepa algo, te aviso.', has: ['subj.temporal'] },
    { es: 'Aunque llueva, salgo.', has: ['subj.concessive'] },
    { es: 'Aunque es tarde, el café está lleno.', has: ['conj.aunque.ind'], not: ['subj.*'] },
    { es: 'Busco a alguien que hable inglés.', has: ['subj.relative'] },
    { es: 'Haz lo que quieras.', has: ['subj.relative.free', 'cmd.tu.aff.irregular'] },
    { es: 'Habla como si fuera el dueño.', has: ['subj.como-si'] },
    { es: 'Si tuviera dinero, viajaría.', has: ['cond.hypothetical', 'tense.impsubj'] },
    { es: 'Si hubiera sabido, habría venido.', has: ['cond.past', 'tense.pluscsubj', 'tense.condperf'] },
    { es: 'Si llueve, nos quedamos en casa.', has: ['cond.real'] },
    { es: 'No sé si viene.', has: ['q.indirect'], not: ['cond.*'] },
    { es: '¡Que te mejores!', has: ['subj.wish-que'] },
    { es: 'Espero que hayas llegado bien.', has: ['tense.perfsubj', 'subj.volition.hope'] },
    { es: 'Quisiera un café, por favor.', has: ['subj.courtesy'], low: false },
    { es: 'O sea, no lo podemos pagar.', has: ['subj.fixed'], low: false },
  ]);
});

describe('commands', () => {
  run([
    { es: 'Abre la puerta, por favor.', has: ['cmd.tu.aff'] },
    { es: 'Habla con tu jefe.', has: ['tense.presente*'], not: ['cmd.*'] },
    { es: '¡Mira esto!', has: ['cmd.tu.aff'] },
    { es: 'Ven conmigo.', has: ['cmd.tu.aff.irregular', 'pron.prep'] },
    { es: 'No hables así.', has: ['cmd.tu.neg'] },
    { es: 'No toques eso.', has: ['cmd.tu.neg'] },
    { es: 'Siga derecho dos cuadras.', has: ['cmd.usted.aff'] },
    { es: 'Siéntese, por favor.', has: ['cmd.usted.aff', 'clitic.enclitic.cmd', 'reflexive'] },
    { es: 'No se preocupe.', has: ['cmd.usted.neg'] },
    { es: 'Dímelo.', has: ['cmd.tu.aff*', 'clitic.combined'] },
    { es: 'Levántate temprano.', has: ['cmd.tu.aff', 'reflexive'] },
    { es: 'Vengan mañana.', has: ['cmd.ustedes.aff'] },
  ]);
});

describe('pronouns, reflexives, gustar, se', () => {
  run([
    { es: 'Lo quiero sin azúcar.', has: ['clitic.do'] },
    { es: 'Le pregunté al señor.', has: ['clitic.io', 'clitic.io.doubling'] },
    { es: 'Te llamo luego.', has: ['clitic.personal'] },
    { es: 'Se lo di ayer.', has: ['clitic.se-lo', 'clitic.combined'], not: ['reflexive', 'se.impersonal'] },
    { es: 'Me lo compró mi mamá.', has: ['clitic.combined'] },
    { es: 'Voy a comprarlo mañana.', has: ['peri.ir-a', 'clitic.enclitic.inf', 'clitic.do'] },
    { es: 'Estoy haciéndolo.', has: ['peri.estar-ger', 'clitic.enclitic.ger'] },
    { es: 'Quiero dártelo.', has: ['clitic.enclitic.inf', 'clitic.combined'], not: ['reflexive'] },
    { es: 'Quiero levantarme temprano.', has: ['reflexive'] },
    { es: 'Me levanto a las cinco.', has: ['reflexive'], not: ['clitic.personal'] },
    { es: 'Se acuesta tarde.', has: ['reflexive'], not: ['se.impersonal'] },
    { es: 'Me llamo Tomás.', has: ['reflexive'] },
    { es: 'Me llama todos los días.', has: ['clitic.personal'], not: ['reflexive'] },
    { es: 'Me voy.', has: ['lex.irse'], not: ['reflexive*'] },          // irse is a word, not the se-meaning lesson
    { es: 'Me quedo en casa.', has: ['reflexive.meaning'] },
    { es: 'Se puso rojo.', has: ['reflexive.change'] },
    { es: 'Me gusta el café.', has: ['gustar'], not: ['clitic.*'] },
    { es: 'A mí me encanta bailar.', has: ['gustar.like', 'gustar.doubling'] },
    { es: 'Me parece una buena idea.', has: ['gustar.like.parecer'] },
    { es: 'Me duele la cabeza.', has: ['gustar.like'] },
    { es: 'Se habla inglés aquí.', has: ['se.passive.basic'], not: ['reflexive'] },
    { es: 'Se vive bien en Medellín.', has: ['se.impersonal'] },
    { es: 'Se vendieron todos los almuerzos.', has: ['se.passive'] },
    { es: 'Se me olvidaron las llaves.', has: ['se.accidental'], not: ['clitic.*'] },
    { es: 'Se le cayó el celular.', has: ['se.accidental'] },
  ]);
});

describe('relatives and que', () => {
  run([
    { es: 'El señor que vende arepas es mi vecino.', has: ['rel.que'], not: ['que.complement'] },
    { es: 'El libro que leo es bueno.', has: ['rel.que'], pos: { leo: 'verb' } },
    { es: 'Creo que es tarde.', has: ['que.complement'], not: ['rel.que'] },
    { es: 'Tengo que trabajar.', has: ['peri.tener-que'], not: ['rel.que', 'que.complement'] },
    { es: 'Hay que estudiar.', has: ['peri.hay-que'], not: ['hay'] },
    { es: 'Es más alta que yo.', has: ['comp.mas-que'], not: ['rel.que', 'que.complement'] },
    { es: 'Lo que necesito es tiempo.', has: ['rel.lo-que'] },
    { es: 'Es el lugar donde trabajé.', has: ['rel.donde'] },
    { es: 'Es la chica con quien hablé.', has: ['rel.prep'] },
    { es: 'Es el edificio en el que nació mi abuela.', has: ['rel.prep'] },
    { es: 'Firmaron un acuerdo, lo cual nos sorprendió.', has: ['rel.cual'] },
    { es: 'El edificio, cuyos dueños viven en Miami, será vendido.', has: ['rel.cuyo', 'ser.passive'] },
    { es: 'Mi tío, que tiene un huerto, vive en el campo.', has: ['rel.que'] },
    { es: 'Hace dos años que vivo aquí.', has: ['time.hace-que'], not: ['rel.que'] },
    { es: 'Me dijo que estaba cansado.', has: ['reported.past'] },
  ]);
});

describe('periphrases', () => {
  run([
    { es: 'Voy a abrir el café el lunes.', has: ['peri.ir-a'] },
    { es: 'Acabo de llegar.', has: ['peri.acabar-de'] },
    { es: 'Estoy trabajando.', has: ['peri.estar-ger'] },
    { es: 'Estaba cerrando el café cuando llegó.', has: ['peri.estar-ger.past'] },
    { es: 'Sigue lloviendo.', has: ['peri.seguir-ger'] },
    { es: 'Llevo dos años estudiando español.', has: ['peri.llevar-ger'] },
    { es: 'Volvió a llamar.', has: ['peri.volver-a'] },
    { es: 'Dejé de fumar.', has: ['peri.dejar-de'] },
    { es: 'Empezó a llover.', has: ['peri.empezar-a'] },
    { es: 'Suelo correr por la mañana.', has: ['peri.soler'] },
    { es: 'Deberías descansar.', has: ['peri.deber'] },
    { es: 'Necesito descansar.', not: ['peri.*'] },
  ]);
});

describe('ser and estar', () => {
  run([
    { es: 'Soy ingeniero.', has: ['ser.identity'] },
    { es: 'Es muy simpática.', has: ['ser.characteristic'] },
    { es: 'Son las tres.', has: ['ser.time'] },
    { es: 'La fiesta es en mi casa.', has: ['ser.event'] },
    { es: 'La casa fue construida en 1990.', has: ['ser.passive'] },
    { es: 'El café está en La Candelaria.', has: ['estar.location'] },
    { es: 'Estoy muy bien, gracias.', has: ['estar.state'] },
    { es: 'La puerta estaba abierta.', has: ['estar.result'] },
    { es: '¿Dónde está el baño?', has: ['estar.location', 'q.wh'] },
  ]);
});

describe('por/para, comparison, hay, misc', () => {
  run([
    { es: 'Gracias por todo.', has: ['por.gracias'], not: ['prep.por'] },
    { es: 'Salimos para Medellín por la mañana.', has: ['prep.para', 'por.fixed'] },
    { es: 'Por favor, cierra la puerta.', has: ['por.fixed', 'cmd.tu.aff'], not: ['prep.por'] },
    { es: '¿Por qué estás triste?', has: ['por.fixed'], not: ['prep.por'] },
    { es: 'Este café es mejor que el otro.', has: ['comp.irregular'] },
    { es: 'Es el café más viejo del barrio.', has: ['sup.relative'] },
    { es: 'Esos zapatos están carísimos.', has: ['sup.isimo'] },
    { es: 'Trabajo tanto como tú.', has: ['comp.tanto-como'] },
    { es: 'Hay una panadería en la esquina.', has: ['hay'] },
    { es: 'Había mucha gente.', has: ['hay.tense'] },
    { es: 'Llegué hace dos semanas.', has: ['time.hace'] },
    { es: 'Antes de salir, cierra la puerta, por favor.', has: ['nonfinite.prep-inf', 'cmd.tu.aff'] },
    { es: 'Antes de salir, cierra la puerta.', has: ['nonfinite.prep-inf', 'tense.presente.stem-ie'], not: ['cmd.*'] },
    { es: 'Al llegar, me llamó.', has: ['nonfinite.al-inf'] },
    { es: 'No es colombiano, sino canadiense.', has: ['conj.sino'] },
    { es: '¿Me regala un tintico?', has: ['np.diminutive'] },
    { es: 'Habla lentamente.', has: ['adv.mente'] },
    { es: 'Lo bueno es que tenemos clientes.', has: ['np.lo-adj'] },
    { es: '¿Con quién hablaste?', has: ['q.wh.prep'] },
    { es: '¡Qué bueno verte!', has: ['excl.que'] },
    { es: 'Como llovía, no salimos.', has: ['conn.cause'] },
  ]);
});

describe('confidence', () => {
  run([
    { es: 'Me gusta el café.', low: false },
    { es: 'El blorpo zingaba la mesa.', low: true },
    { es: 'Ella comio rápido.', low: true },
    { es: 'Vengas mañana.', low: true },
  ]);
  test('reasons name the word', () => {
    const r = tagSentence('El blorpo es grande.');
    expect(r.lowReasons.join()).toMatch(/blorpo/);
  });
  test('accent reason points at the engine form', () => {
    expect(tagSentence('Ella comio rápido.').lowReasons.join()).toMatch(/comió/);
  });
});

describe('requires and text', () => {
  test('requires is sorted, unique and includes lexemes', () => {
    const r = tagSentence('Quiero que vengas mañana.');
    expect(r.requires).toEqual([...new Set(r.requires)].sort());
    expect(r.requires).toContain('l:venir');
    expect(r.requires).toContain('l:querer');
  });
  test('lexemes can be switched off', () => {
    expect(tagSentence('Quiero un café.', { lexemes: false }).requires.some((x) => x.startsWith('l:'))).toBe(false);
  });
  test('graph ids pick the most specific mapped node that exists', () => {
    // tense.presente.stem-ie -> g:stem-boot; without it in the graph, the parent tense.presente -> g:present-ar
    const r = tagSentence('Quiero un café.', { graphIds: new Set(['g:present-ar', 'g:gender-articles']), lexemes: false });
    expect(r.requires).toEqual(['g:gender-articles', 'g:present-ar']);
    const r2 = tagSentence('Quiero un café.', { graphIds: new Set(['g:stem-boot', 'g:present-ar']), lexemes: false });
    expect(r2.requires).toContain('g:stem-boot');
  });
  test('featureMap overrides the table', () => {
    const r = tagSentence('Quiero un café.', { featureMap: { 'tense.presente.stem-ie': 'g:custom', 'np.article': null }, lexemes: false });
    expect(r.requires).toEqual(['g:custom']);
  });
  test('chunks: id slug, fragments with name wildcards, gaps', () => {
    const chunks = [{ id: 'c:me-llamo', es: 'Me llamo Tomás. ¿Cómo te llamas?' }, { id: 'c:tengo-anos', es: 'Tengo treinta y cuatro años.' }];
    expect(tagSentence('Me llamo Ana.', { chunks }).requires).toContain('c:me-llamo');
    expect(tagSentence('Tengo veinte años.', { chunks }).requires).toContain('c:tengo-anos');
    expect(tagSentence('¿Cómo te llamas?', { chunks }).features.some((f) => f.key === 'chunk.c:me-llamo')).toBe(true);
  });
  test('splitSentences and tagText', () => {
    expect(splitSentences('Hola. ¿Cómo estás? —Bien, gracias.')).toHaveLength(3);
    const r = tagText('Vino a casa. Me gusta el vino.');
    expect(r.sentences).toBe(2);
    expect(r.features.some((f) => f.key === 'gustar')).toBe(true);
  });
});
