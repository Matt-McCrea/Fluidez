/* Node test for the A2 teaching scripts (data/scripts/a2.js). Run: node tools/test-scripts-a2.js
 * A copy of tools/test-scripts.js pointed at SCRIPTS_A2 and the first eight A2 units
 * (a2-u15, a2-u16, a2-u18 to a2-u23; a2-u14 and a2-u17 sit in the A1 band).
 * Every lesson on the path in those units has a script; every script
 * has the anatomy the evidence asks for (2 to 3 examples before a rule of under
 * 130 words, 4 to 6 read-and-pick items whose option lengths give nothing away,
 * 3 to 5 typed items whose expected Spanish passes the matcher, a personal
 * sentence whose model passes its own checklist); no dashes, no vosotros, no
 * grammar jargon on screen. Two A2 additions: no Peninsular words in the Spanish,
 * and no Spain-style recent past (*ha llegado hace…*, *hoy he…*) where Latin America
 * uses the event past. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js', 'data/course.js'].forEach(load);
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
window.LIB = globalThis.LIB;
load('data/scripts/a2.js');

const M = window.LIB.match, C = window.Checker, SC = window.SCRIPTS_A2;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

const UNITS = ['a2-u15', 'a2-u16', 'a2-u18', 'a2-u19', 'a2-u20', 'a2-u21', 'a2-u22', 'a2-u23'];
const DASH = /[—–]|\s-\s|^-\s|\s-$/m;
const JARGON = /\b(stress(ed)?|clitics?|register|conjugat\w*|infinitives?|pronouns?|adjectives?|nouns?|intonation|interrogatives?|subjunctive|indicative|imperative|masculine|feminine|morphemes?|syllables?|tenses?)\b/i;
const VOSOTROS_WORD = /(^|[^a-záéíóúñ])(vosotr[oa]s|vuestr[oa]s?|os)(?![a-záéíóúñ])/i;
const VOSOTROS_VERB = /[a-záéíóúñ]+(áis|éis|ís)(?![a-záéíóúñ])/i;   // habláis, coméis, vivís
// Latin American Spanish: words Spain has its own way of saying (tools/gate/dialect.ts has the full list).
const SPAIN_WORD = /(^|[^a-záéíóúñ])(coches?|m[oó]vil(es)?|ordenador(es)?|zumos?|aparcar|bol[ií]grafos?|gafas|vale|enfadad[oa]s?|camarer[oa]s?|pon(es|me|game))(?![a-záéíóúñ])/i;
// The perfecto is for experience and not yet; Spain's recent past (ha llegado hace un rato, hoy he comido) is not taught.
const SPAIN_PERFECTO = /\b(he|has|ha|hemos|han)\s+[a-záéíóúñ]+(ado|ido)\b[^.?!]*\bhace\b|\bhace\b[^.?!]*\b(he|has|ha|hemos|han)\s+[a-záéíóúñ]+(ado|ido)\b|\b(hoy|esta mañana|esta tarde)\b[^.?!]*\b(he|has|ha|hemos|han)\s+[a-záéíóúñ]+(ado|ido)\b/i;
const plain = (s) => String(s == null ? '' : s).replace(/\*/g, '');
const words = (s) => plain(s).split(/\s+/).filter(Boolean).length;
const lines = (s) => String(s).split('\n').length;

// ---- the lessons on the path, read from the course itself
const want = window.COURSE_DAYS.filter((d) => UNITS.indexOf(d.unit) >= 0 && d.lesson).map((d) => d.lesson);
ok(want.length === 42, 'expected 42 lessons on the path in the first eight A2 units, found ' + want.length);
want.forEach((id) => ok(!!SC[id], id + ': no script'));
Object.keys(SC).forEach((id) => ok(want.indexOf(id) >= 0, id + ': script for a lesson that is not on the path in the first eight A2 units'));

// every string a learner sees, with whether it is Spanish
function* strs(id, s) {
  const S = (p, v, es) => ({ p: id + '.' + p, v: String(v == null ? '' : v), es });
  yield S('hook.line', s.hook && s.hook.line, false); yield S('hook.es', s.hook && s.hook.es, true); yield S('hook.en', s.hook && s.hook.en, false);
  for (const [i, e] of (s.examples || []).entries()) { yield S(`examples[${i}].es`, e.es, true); yield S(`examples[${i}].en`, e.en, false); }
  yield S('rule', s.rule, false);
  for (const [i, r] of (s.readAndPick || []).entries()) {
    yield S(`readAndPick[${i}].q`, r.q, false); yield S(`readAndPick[${i}].es`, r.es, true); yield S(`readAndPick[${i}].why`, r.why, false);
    for (const [k, o] of (r.options || []).entries()) yield S(`readAndPick[${i}].options[${k}]`, o, false);
  }
  for (const [i, t] of (s.yourTurn || []).entries()) {
    yield S(`yourTurn[${i}].en`, t.en, false); yield S(`yourTurn[${i}].es`, t.es, true);
    for (const [k, a] of (t.accept || []).entries()) yield S(`yourTurn[${i}].accept[${k}]`, a, true);
  }
  if (s.personal) {
    yield S('personal.prompt', s.personal.prompt, false); yield S('personal.model', s.personal.model, true);
    for (const [k, c] of (s.personal.constraints || []).entries()) yield S(`personal.constraints[${k}].label`, c.label, false);
  }
  for (const [i, p] of (s.pitfalls || []).entries()) yield S(`pitfalls[${i}]`, p, false);
}

let rpTotal = 0, rpLongest = 0, rpShortest = 0, rpChance = 0, ruleMax = 0;
const share = (opts, ans, pick) => { const m = pick(...opts.map((o) => o.length)); const tied = opts.filter((o) => o.length === m).length; return opts[ans].length === m ? 1 / tied : 0; };

Object.keys(SC).forEach((id) => {
  const s = SC[id];
  ok(['old', 'merged', 'rebuild'].indexOf(s.source) >= 0, id + ': source must be old, merged or rebuild');
  ok(s.hook && s.hook.line && s.hook.es && s.hook.en, id + ': hook needs line, es and en');
  if (s.hook) ok(lines(s.hook.es) === lines(s.hook.en), id + ': hook es and en must have the same number of lines (aligned pairs)');
  ok(Array.isArray(s.examples) && s.examples.length >= 2 && s.examples.length <= 3, id + ': 2 to 3 examples, has ' + (s.examples || []).length);
  (s.examples || []).forEach((e, i) => ok(e.es && e.en && lines(e.es) === lines(e.en), id + ': examples[' + i + '] needs es and en with matching lines'));
  const rw = words(s.rule); ruleMax = Math.max(ruleMax, rw);
  ok(typeof s.rule === 'string' && rw > 0 && rw < 130, id + ': rule must be under 130 words, has ' + rw);

  const rp = s.readAndPick || [];
  ok(rp.length >= 4 && rp.length <= 6, id + ': 4 to 6 read-and-pick items, has ' + rp.length);
  rp.forEach((r, i) => {
    const at = id + '.readAndPick[' + i + ']';
    ok(r.q && r.es && r.why, at + ': needs q, es and why');
    ok(Array.isArray(r.options) && r.options.length >= 2 && Number.isInteger(r.answer) && r.answer >= 0 && r.answer < r.options.length, at + ': answer must index an option');
    if (!Array.isArray(r.options) || !r.options[r.answer]) return;
    ok(new Set(r.options).size === r.options.length, at + ': options repeat');
    const right = r.options[r.answer].length;
    ok(!r.options.every((o, k) => k === r.answer || right >= 1.5 * o.length), at + ': the right option is 1.5 times as long as every other');
    rpTotal++; rpChance += 1 / r.options.length;
    rpLongest += share(r.options, r.answer, Math.max); rpShortest += share(r.options, r.answer, Math.min);
    ok(words(r.why) <= 25, at + ': why should be one line (25 words at most)');
  });

  const yt = s.yourTurn || [];
  ok(yt.length >= 3 && yt.length <= 5, id + ': 3 to 5 your-turn items, has ' + yt.length);
  yt.forEach((t, i) => {
    const at = id + '.yourTurn[' + i + ']';
    ok(t.en && t.es && Array.isArray(t.accept), at + ': needs en, es and accept[]');
    const item = { es: t.es, en: t.en, accept: t.accept || [] };
    const r = M.matchTranslation(t.es, item, { accents: 'lenient' });
    ok(r.pass, at + ': the expected Spanish fails the matcher: "' + t.es + '" (' + (r.hint || '') + ')');
    (t.accept || []).forEach((a) => {
      let xs = [];
      try { xs = M.expandAccept(a); } catch (e) { ok(false, at + ': accept pattern does not parse: ' + a); }
      xs.forEach((x) => { const rx = M.matchTranslation(x, item, { accents: 'lenient' }); ok(rx.pass, at + ': accepted form fails the matcher: "' + x + '"'); });
    });
    ok(!M.matchTranslation('', item).pass, at + ': an empty answer passes');
    ok(!M.matchTranslation('zzz qqq', item).pass, at + ': nonsense passes');
    // the attempt machine gives one retry, then reveals
    let st = M.startAttempt(item, { accents: 'lenient' });
    const a1 = M.submitAttempt(st, 'zzz'); const a2 = M.submitAttempt(a1.state, 'zzz');
    ok(a1.status === 'retry' && a2.status === 'revealed', at + ': one retry, then the answer');
  });

  const p = s.personal || {};
  ok(p.prompt && Array.isArray(p.constraints) && p.constraints.length, id + ': personal needs a prompt and constraints');
  if (p.constraints && p.constraints.length) {
    const res = C.checkWriting({ constraints: p.constraints }, '');
    res.results.forEach((r, k) => ok(!/unknown constraint/.test(r.label || ''), id + ': personal.constraints[' + k + '] has an unknown type'));
    ok(p.constraints.every((c) => c.label), id + ': every personal constraint carries its own plain label');
    ok(!res.allPass, id + ': an empty personal sentence passes its checklist');
    if (p.model) {
      const m = C.checkWriting({ constraints: p.constraints }, p.model);
      ok(m.allPass, id + ': the personal model fails its own checklist: ' + m.results.filter((r) => !r.pass).map((r) => plain(r.label)).join('; '));
    }
  }
  ok(!s.pitfalls || (Array.isArray(s.pitfalls) && s.pitfalls.length <= 3), id + ': 0 to 3 pitfalls');

  for (const x of strs(id, s)) {
    ok(!DASH.test(x.v), x.p + ': dash: "' + x.v.slice(0, 60) + '"');
    if (x.es) {
      ok(!VOSOTROS_WORD.test(plain(x.v)), x.p + ': vosotros: "' + x.v.slice(0, 60) + '"');
      ok(!VOSOTROS_VERB.test(plain(x.v).replace(/\b(país|maíz|raíz|oís)\b/gi, '')), x.p + ': a vosotros verb form: "' + x.v.slice(0, 60) + '"');
      ok(!SPAIN_WORD.test(plain(x.v)), x.p + ': a Peninsular word: "' + (plain(x.v).match(SPAIN_WORD) || ['', ''])[2] + '"');
      ok(!SPAIN_PERFECTO.test(plain(x.v)), x.p + ': Spain-style recent past, use the event past: "' + x.v.slice(0, 60) + '"');
    } else {
      ok(!JARGON.test(plain(x.v)), x.p + ': grammar jargon on screen: "' + (plain(x.v).match(JARGON) || [''])[0] + '"');
      ok(!/vosotr|vuestr/i.test(x.v), x.p + ': names vosotros');
    }
  }
});

// the typed items test their point: the slip each lesson warns about is not accepted
[['imperfecto', 2, 'Mi abuela fue muy alta.'], ['imperfecto', 3, 'No habían muchos carros.'], ['imperfecto', 1, 'Los domingos comimos en la casa de mi abuela.'],
 ['nt-localizacion-tiempo-a2', 1, 'Vivo en Bogotá hace dos años.'], ['nt-localizacion-tiempo-a2', 0, 'Llegué dos años hace.'], ['nt-localizacion-tiempo-a2', 0, 'He llegado hace dos años.'],
 ['nt-localizacion-tiempo-a2', 2, 'Trabajo desde las ocho a las cinco.'],
 ['nt-frecuencia-a2', 0, 'Voy al gimnasio tres vez a la semana.'], ['nt-frecuencia-a2', 0, 'Voy al gimnasio tres veces al semana.'], ['nt-frecuencia-a2', 3, 'Una botella agua, por favor.'],
 ['task-a2-antes', 0, 'Hace diez años viví en un pueblo pequeño.'], ['task-a2-antes', 3, 'Era veinte años.'], ['task-a2-antes', 1, 'La casa fue vieja.'],
 ['preterite-imperfect', 0, 'Fue tarde y llovió.'], ['preterite-imperfect', 1, 'De repente sonaba el teléfono.'], ['preterite-imperfect', 2, 'Estuve en la cocina cuando llegó Laura.'],
 ['preterite-imperfect', 3, 'De niño jugué fútbol todos los días.'], ['preterite-imperfect', 4, 'Ayer jugaba fútbol con Diego.'],
 ['gn-narrar-anecdota-a2', 0, 'De repente, alguien empezaba a gritar.'], ['gn-narrar-anecdota-a2', 1, 'Fue sábado y estuvimos en la playa.'], ['gn-narrar-anecdota-a2', 4, 'Empezó llover.'],
 ['dc-estructuradores-a2', 2, 'Dije nada.'], ['dc-estructuradores-a2', 0, 'Nadie no vino.'], ['dc-estructuradores-a2', 1, 'Nunca no voy.'],
 ['task-a2-anecdota', 1, 'Estuve en la cocina cuando sonó el timbre.'], ['task-a2-anecdota', 2, 'Abrí la puerta y no hubo nadie.'], ['task-a2-anecdota', 3, 'Mientras esperamos, hablábamos dos horas.'],
 ['gr-objeto-indirecto-a2', 0, 'Di la llave a Laura.'], ['gr-objeto-indirecto-a2', 1, 'Le escribí a mis papás.'], ['gr-objeto-indirecto-a2', 2, 'Me robaron mi billetera.'], ['gr-objeto-indirecto-a2', 4, 'Me duele mi cabeza.'],
 ['gr-pronombres-atonos-a2', 1, 'Le lo di a Diego.'], ['gr-pronombres-atonos-a2', 0, 'Sí, lo te presto.'], ['gr-pronombres-atonos-a2', 2, 'Le vi ayer.'], ['gr-pronombres-atonos-a2', 4, 'Lo dije la verdad.'],
 ['gr-pronombres-tonicos-a2', 0, 'Este café es para tú.'], ['gr-pronombres-tonicos-a2', 1, '¿Vienes con mí?'], ['gr-pronombres-tonicos-a2', 2, 'Sí, voy con ti.'], ['gr-pronombres-tonicos-a2', 4, 'A mí gusta el café, pero a ella no.'],
 ['gr-posesivos-tonicos-a2', 1, 'Sí, son mío.'], ['gr-posesivos-tonicos-a2', 2, 'Un amigo de mí vive en Cali.'], ['gr-posesivos-tonicos-a2', 3, 'Mi carro es azul; tuyo es rojo.'], ['gr-posesivos-tonicos-a2', 4, 'Señor, ¿esta maleta es tuya?'],
 ['task-a2-pronombres', 1, 'Le lo di a mi hermana.'], ['task-a2-pronombres', 2, 'Voy a la comprar mañana.'], ['task-a2-pronombres', 0, 'Compré el libro y leí el libro en dos días.'],
 ['gr-imperativo-forma-a2', 0, 'Hablas más despacio, por favor.'], ['gr-imperativo-forma-a2', 1, 'Habla más despacio, por favor.'], ['gr-imperativo-forma-a2', 2, '¡Viene aquí!'], ['gr-imperativo-forma-a2', 3, 'Dice me la verdad.'],
 ['fn-atenuar-orden-a2', 0, 'Tráeme la cuenta.'], ['fn-atenuar-orden-a2', 1, '¿Me pasa la sal?'], ['fn-atenuar-orden-a2', 2, '¿Puede cierra la ventana, por favor?'], ['fn-atenuar-orden-a2', 4, '¿Me hace el favor esperar un momento?'],
 ['fn-acceder-peticion-a2', 1, 'Qué pena, pero no quiero.'], ['fn-acceder-peticion-a2', 4, 'Vale, ya voy.'],
 ['dc-atenuacion-1apersona-a2', 1, '¿Se puede pago con tarjeta?'], ['dc-atenuacion-1apersona-a2', 3, 'Hay llegar a las ocho.'], ['dc-atenuacion-1apersona-a2', 0, '¿Yo puedo pasar?'],
 ['gn-instrucciones-a2', 0, 'Primero, abra la aplicación.'], ['gn-instrucciones-a2', 1, 'Luego, pone el café en el filtro.'], ['gn-instrucciones-a2', 2, 'Por último, aprieta el botón rojo.'],
 ['task-a2-pedir', 0, 'Abra la ventana, por favor.'], ['task-a2-pedir', 1, '¿Puede abrir la ventana?'], ['task-a2-pedir', 2, '¿Me hace el favor abrir la ventana?'], ['task-a2-pedir', 3, '¿Será que me pueda abrir la ventana?'],
 ['fn-preguntar-estado-animo-a2', 2, 'Me duele muy la cabeza.'], ['fn-preguntar-estado-animo-a2', 3, 'Estoy frío y sueño.'], ['fn-preguntar-estado-animo-a2', 4, 'Estoy dolor de estómago.'], ['fn-preguntar-estado-animo-a2', 4, 'Tengo duele el estómago.'],
 ['fn-felicitar-a2', 0, '¡Felicitaciones en el trabajo nuevo!'], ['fn-felicitar-a2', 0, '¡Felicitación por el trabajo nuevo!'], ['fn-felicitar-a2', 4, '¡Qué una suerte!'], ['fn-felicitar-a2', 3, '¡Felicitaciones por pasaste el examen!'],
 ['fn-preguntar-deseos-a2', 0, '¿Te gusta venir a la fiesta?'], ['fn-preguntar-deseos-a2', 2, '¡Bueno viaje!'], ['fn-preguntar-deseos-a2', 3, '¡Mucho suerte en la entrevista!'], ['fn-preguntar-deseos-a2', 4, '¿Qué te gustarías hacer el sábado?'],
 ['fn-acuerdo-a2', 1, 'Estoy de acuerdo con ti.'], ['fn-acuerdo-a2', 3, 'El examen no fue fácil nada.'],
 ['task-a2-animo', 1, 'Lo siento mucho. ¿Cómo es?'], ['task-a2-animo', 2, '¡Felicitaciones! ¿Cuándo empezas?'], ['task-a2-animo', 0, '¡No me dices! ¡Qué alegría!'],
 ['gr-comparativos-a2', 0, 'Bogotá es más fría de Medellín.'], ['gr-comparativos-a2', 1, 'Este café es más bueno que el otro.'], ['gr-comparativos-a2', 2, 'Mi hermana es tan alta que yo.'], ['gr-comparativos-a2', 2, 'Mi hermana es tan alta como mí.'],
 ['gr-comparativos-a2', 3, 'No hay tan carros como antes.'], ['gr-comparativos-a2', 3, 'No hay tanto carros como antes.'],
 ['nt-cualidad-material-a2', 0, 'La camisa es algodón.'], ['nt-cualidad-material-a2', 0, 'La camisa es de un algodón.'], ['nt-cualidad-material-a2', 1, 'Quiero una madera mesa.'], ['nt-cualidad-material-a2', 2, 'Cambié mi trabajo el año pasado.'],
 ['nt-cualidad-material-a2', 3, '¿Dónde puedo cambiar dólares para pesos?'], ['nt-cualidad-material-a2', 4, '¿La puedo cambiar de una más grande?'],
 ['gn-describir-persona-a2', 0, 'Me parezco mucho mi mamá.'], ['gn-describir-persona-a2', 0, 'Miro mucho como mi mamá.'], ['gn-describir-persona-a2', 2, 'Cuando la conocí, tuvo el pelo corto.'], ['gn-describir-persona-a2', 2, 'Cuando la conocía, tenía el pelo corto.'], ['gn-describir-persona-a2', 4, '¿A quién pareces?'],
 ['gn-describir-objeto-a2', 0, '¿Qué sirve esto para?'], ['gn-describir-objeto-a2', 1, 'Sirve para abre botellas.'], ['gn-describir-objeto-a2', 3, 'Este celular no trabaja.'],
 ['task-a2-comparar', 0, 'Es más caro que el otro, pero es más bueno.'], ['task-a2-comparar', 1, 'El nuevo es igual de rápido como el viejo.'], ['task-a2-comparar', 2, 'Es el más barato que todos.'], ['task-a2-comparar', 3, 'Me quedo con el de Chapinero porque es cerca.'],
 ['gn-conversacion-transaccional-a2', 1, '¿Me puedo lo medir?'], ['gn-conversacion-transaccional-a2', 2, 'Soy un poco grande.'], ['gn-conversacion-transaccional-a2', 2, 'Me es un poco grande.'],
 ['fn-responder-telefono-a2', 1, 'Sí, con él.'], ['fn-responder-telefono-a2', 1, 'Sí, yo.'], ['fn-responder-telefono-a2', 3, 'Un momento, ya le la paso.'], ['fn-responder-telefono-a2', 2, '¿Quién eres?'],
 ['fn-pedir-informacion-a2', 0, '¿Qué tipo de la música te gusta?'], ['fn-pedir-informacion-a2', 1, '¿Qué tipo de películas te gusta?'], ['fn-pedir-informacion-a2', 2, '¿Qué es tu color favorito?'], ['fn-pedir-informacion-a2', 3, '¿Quién vives con?'], ['fn-pedir-informacion-a2', 4, 'Por bus.'],
 ['fn-preguntar-preferencias-a2', 0, '¿Preferes tinto o jugo?'], ['fn-preguntar-preferencias-a2', 2, 'Me gusta más el campo más que la ciudad.'], ['fn-preguntar-preferencias-a2', 3, 'Me gusta más leer que la televisión.'], ['fn-preguntar-preferencias-a2', 4, 'Nos gusta más los perros que los gatos.'],
 ['nt-necesidad-obligacion-a2', 0, 'Me hacen falta una chaqueta.'], ['nt-necesidad-obligacion-a2', 2, 'Es necesario a reservar antes.'], ['nt-necesidad-obligacion-a2', 3, 'Me da igualmente.'],
 ['fn-preguntar-conocimiento-a2', 0, 'Sé cómo nadar.'], ['fn-preguntar-conocimiento-a2', 1, '¿Sabes Cartagena?'], ['fn-preguntar-conocimiento-a2', 2, 'No conozco tu hermano.'], ['fn-preguntar-conocimiento-a2', 3, 'Hablo un poco francés.'], ['fn-preguntar-conocimiento-a2', 4, '¿Conoce a qué hora pasa el bus?'],
 ['task-a2-gestion', 0, 'Buenos días, habla Sam. Llamo para el apartamento.'], ['task-a2-gestion', 1, 'Quería cambiar esta camisa. Es que me queda pequeño.'], ['task-a2-gestion', 2, 'Disculpe, ¿conoce si hay un bus al aeropuerto?'],
 ['gr-causales-a2', 0, 'No fui como estaba enfermo.'], ['gr-causales-a2', 0, 'No fui por qué estaba enfermo.'], ['gr-causales-a2', 2, 'No fui para la lluvia.'], ['gr-causales-a2', 3, 'Estoy cansado, así me voy a la casa.'],
 ['por-para', 0, 'Gracias para el regalo.'], ['por-para', 1, 'Este regalo es por ti.'], ['por-para', 2, 'Salgo por Medellín el viernes.'], ['por-para', 3, 'Pagué cincuenta mil pesos para el tiquete.'], ['por-para', 4, 'Lo necesito por el lunes.'],
 ['gr-condicionales-a2', 1, 'Si llover, nos quedamos en la casa.'], ['gr-condicionales-a2', 3, 'Te llamo si llegar tarde.'],
 ['fn-aconsejar-a2', 0, 'Tienes descansar.'], ['fn-aconsejar-a2', 0, 'Tienes que descansas.'], ['fn-aconsejar-a2', 2, 'Hay reservar antes.'], ['fn-aconsejar-a2', 4, 'No debes venir.'], ['fn-aconsejar-a2', 3, '¿Te ayude?'],
 ['fn-proponer-sugerir-a2', 0, '¿Qué tal si ir a cine?'], ['fn-proponer-sugerir-a2', 0, '¿Qué tal yendo a cine?'], ['fn-proponer-sugerir-a2', 1, '¿Porque no tomamos un tinto?'], ['fn-proponer-sugerir-a2', 2, '¿Y si pedir una pizza?'], ['fn-proponer-sugerir-a2', 3, '¿Nos vemos en el viernes?'],
 ['task-a2-razones', 0, 'Lo dejé para estaba cansado.'], ['task-a2-razones', 1, 'Vine a Bogotá por estudiar español.'], ['task-a2-razones', 2, 'Si me ofrecerán un buen trabajo aquí, me quedo.'], ['task-a2-razones', 3, 'Lo mejor es ahorro primero.']
].forEach(([id, i, wrong]) => {
  const t = SC[id] && SC[id].yourTurn[i];
  if (!t) { ok(false, id + '.yourTurn[' + i + '] missing'); return; }
  ok(!M.matchTranslation(wrong, { es: t.es, en: t.en, accept: t.accept }, { accents: 'lenient' }).pass, id + '.yourTurn[' + i + ']: the slip "' + wrong + '" is accepted');
});

// option length across the file: the gate's rule, a third at most
ok(rpTotal >= 160, 'expected at least 160 read-and-pick items, found ' + rpTotal);
ok(rpLongest / rpTotal <= 1 / 3, 'the right option is the longest ' + Math.round(100 * rpLongest / rpTotal) + '% of the time (a third at most)');
ok(rpShortest / rpTotal <= rpChance / rpTotal + 0.08, 'the right option is the shortest ' + Math.round(100 * rpShortest / rpTotal) + '% of the time (chance ' + Math.round(100 * rpChance / rpTotal) + '%)');

console.log('scripts: ' + Object.keys(SC).length + ', read-and-pick ' + rpTotal + ' (right is longest ' + Math.round(100 * rpLongest / rpTotal) + '%, shortest ' + Math.round(100 * rpShortest / rpTotal) + '%), longest rule ' + ruleMax + ' words');
console.log('Checks run: ' + checks);
if (errors) { console.error(errors + ' problem(s).'); process.exit(1); }
console.log('Scripts OK.');
