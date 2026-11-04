/* Node test for the teaching scripts (data/scripts/a1.js). Run: node tools/test-scripts.js
 * Every lesson on the path in the A1 band (units a1-u01 to a1-u13, with a2-u14
 * and a2-u17, which sit inside it) has a script; every script
 * has the anatomy the evidence asks for (2 to 3 examples before a rule of under
 * 130 words, 4 to 6 read-and-pick items whose option lengths give nothing away,
 * 3 to 5 typed items whose expected Spanish passes the matcher, a personal
 * sentence whose model passes its own checklist); no dashes, no vosotros, no
 * grammar jargon on screen. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {};
function load(rel) { (0, eval)(fs.readFileSync(path.join(ROOT, rel), 'utf8')); }
['data/verbs.js', 'data/vocab.js', 'data/idioms.js', 'data/connectors.js', 'js/engine.js', 'js/checker.js', 'data/course.js'].forEach(load);
(0, eval)(fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8') + '\n;globalThis.LIB = LIB;');
window.LIB = globalThis.LIB;
load('data/scripts/a1.js');

const M = window.LIB.match, C = window.Checker, SC = window.SCRIPTS_A1;
let errors = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { errors++; console.error('  x ' + m); } }

const UNITS = ['a1-u01', 'a1-u02', 'a1-u03', 'a1-u04', 'a1-u05', 'a1-u06', 'a2-u14', 'a1-u07', 'a1-u08', 'a2-u17',
  'a1-u09', 'a1-u10', 'a1-u11', 'a1-u12', 'a1-u13'];
const DASH = /[—–]|\s-\s|^-\s|\s-$/m;
const JARGON = /\b(stress(ed)?|clitics?|register|conjugat\w*|infinitives?|pronouns?|adjectives?|nouns?|intonation|interrogatives?|subjunctive|indicative|imperative|masculine|feminine|morphemes?|syllables?|tenses?)\b/i;
const VOSOTROS_WORD = /(^|[^a-záéíóúñ])(vosotr[oa]s|vuestr[oa]s?|os)(?![a-záéíóúñ])/i;
const VOSOTROS_VERB = /[a-záéíóúñ]+(áis|éis|ís)(?![a-záéíóúñ])/i;   // habláis, coméis, vivís
const plain = (s) => String(s == null ? '' : s).replace(/\*/g, '');
const words = (s) => plain(s).split(/\s+/).filter(Boolean).length;
const lines = (s) => String(s).split('\n').length;

// ---- the lessons on the path, read from the course itself
const want = window.COURSE_DAYS.filter((d) => UNITS.indexOf(d.unit) >= 0 && d.lesson).map((d) => d.lesson);
ok(want.length === 76, 'expected 76 lessons on the path in the A1 band, found ' + want.length);
// the band ends where COURSE_BANDS says it does: every unit listed sits inside it, and none is left out
const bandEnd = window.COURSE_BANDS.A2;
const inBand = [...new Set(window.COURSE_DAYS.slice(0, bandEnd).map((d) => d.unit))];
ok(inBand.length === UNITS.length && inBand.every((u) => UNITS.indexOf(u) >= 0), 'the A1 band holds units ' + inBand.join(', '));
want.forEach((id) => ok(!!SC[id], id + ': no script'));
Object.keys(SC).forEach((id) => ok(want.indexOf(id) >= 0, id + ': script for a lesson that is not on the path in the A1 band'));

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
    } else {
      ok(!JARGON.test(plain(x.v)), x.p + ': grammar jargon on screen: "' + (plain(x.v).match(JARGON) || [''])[0] + '"');
      ok(!/vosotr|vuestr/i.test(x.v), x.p + ': names vosotros');
    }
  }
});

// the typed items test their point: the slip each lesson warns about is not accepted
[['presente', 3, 'Laura no hablas francés.'], ['fn-responder-saludo-a2', 3, '¿Cómo estás?'], ['fn-responder-saludo-a2', 1, 'Bien, gracias. ¿Y tú?'],
 ['ser-estar', 1, 'La sopa es fría.'], ['ser-estar', 4, 'Somos en casa.'], ['nt-origen-a1', 4, 'Soy veinte años.'],
 ['fn-agradecer-a1', 1, 'Gracias para la ayuda.'], ['fn-agradecer-a1', 2, 'Gracias por vienes.'], ['fn-agradecer-a1', 0, 'Muy gracias.'],
 ['gr-interrogativos-a1', 4, '¿Cuántos hermanas tienes?'], ['gr-pronombre-sujeto-a1', 1, '¿Vives aquí?'], ['gr-pronombre-sujeto-a1', 2, '¿Vive aquí?'],
 ['fn-pedir-informacion-a1', 3, 'Estudio español para quiero vivir aquí.'], ['gr-adverbios-afirmacion-negacion-a1', 1, 'Yo también.'],
 ['gr-adverbios-afirmacion-negacion-a1', 0, 'Yo tampoco.'], ['fn-dirigirse-a1', 2, 'Encantado.'], ['task-cortesia', 0, 'Oye, ¿tiene hora?'],
 ['task-cortesia', 1, 'Disculpe, ¿tienes hora, por favor?'], ['fn-establecer-comunicacion-a1', 3, '¡Hasta lunes!'], ['fn-identificar-a1', 0, 'Sí, yo.'],
 // units 4 to 8
 ['nt-cantidad-numerica-a1', 2, 'Hay mucho gente en la calle.'], ['nt-cantidad-numerica-a1', 1, 'Vivo en el cuatro piso.'],
 ['gr-numerales-a1', 0, 'Tengo veintiuno años.'], ['gr-numerales-a1', 2, 'Es mi primero día.'], ['gr-numerales-a1', 3, 'Es la tercer vez.'], ['gr-numerales-a1', 4, 'Cuesta ciento mil pesos.'],
 ['nt-referencias-generales-a1', 0, 'Son la una.'], ['nt-referencias-generales-a1', 3, 'No trabajo en sábado.'], ['nt-referencias-generales-a1', 4, 'Nunca no como pescado.'],
 ['nt-valor-precio-a1', 1, '¿Cuánto cuesta los mangos?'], ['nt-valor-precio-a1', 4, 'La mesa es dos metros.'], ['task-quedar', 3, 'Nos vemos en el viernes a las siete.'],
 ['gr-verbos-predicativos-tipos-a2', 0, 'Yo gusto el café.'], ['gr-verbos-predicativos-tipos-a2', 1, 'Me gusta los perros.'], ['gr-verbos-predicativos-tipos-a2', 3, 'Me duelen mis pies.'],
 ['fn-preguntar-gustos-a2', 2, 'Mi hermano gusta el fútbol.'], ['fn-preguntar-gustos-a2', 2, 'A mi hermano gusta el fútbol.'],
 ['nt-evaluacion-general-a1', 0, 'Es un bueno libro.'], ['nt-evaluacion-general-a1', 1, 'Canta muy buena.'], ['nt-evaluacion-general-a1', 2, 'Estoy bueno, gracias.'],
 ['fn-valorar-a1', 3, 'Soy en un hospital.'], ['task-gustos', 2, 'A mí tampoco.'], ['gn-conversacion-transaccional-a1', 2, 'Aquí tienes.'],
 ['gr-articulo-indefinido-a1', 0, 'Hay el banco en la plaza.'], ['gr-articulo-indefinido-a1', 4, 'El este libro es muy bueno.'],
 ['nt-existencia-a1', 1, 'Mi barrio hay dos parques.'], ['nt-existencia-a1', 1, 'En mi barrio están dos parques.'], ['nt-existencia-a1', 4, 'La tienda es cerrada.'], ['task-cafe', 4, '¿Cuánto te debo?'],
 ['gr-genero-adjetivo-a1', 1, 'Ana es muy feliza.'], ['gr-genero-adjetivo-a1', 2, 'Es inglés.'], ['gr-genero-adjetivo-a1', 3, 'Mis amigos son muy simpático.'],
 ['gr-adjetivos-calificativos-a1', 1, 'De los dos suéteres, prefiero la negra.'], ['gr-adjetivos-calificativos-a1', 3, 'La comida está muy riquísima.'],
 ['gr-posesivos-forma-a1', 0, 'Mi papás viven en Cali.'], ['gr-posesivos-forma-a1', 2, '¿Quién es esto?'], ['gr-posesivos-forma-a1', 3, 'Nuestro casa es pequeña.'],
 ['gr-demostrativos-distribucion-a1', 0, 'La esta camisa es muy bonita.'], ['gr-demostrativos-distribucion-a1', 1, 'Estas zapatos son nuevos.'], ['gr-demostrativos-distribucion-a1', 4, 'Ese, por favor.'],
 ['nt-familia-a1', 2, 'Somos cuatro de nosotros.'], ['nt-familia-a1', 3, 'Mi abuelo es ochenta años.'],
 ['gn-describir-persona-a1', 0, 'Es alto y es el pelo corto.'], ['gn-describir-persona-a1', 1, 'Tiene sus ojos azules.'],
 ['gn-describir-objeto-a1', 0, 'La mesa es madera.'], ['gn-describir-objeto-a1', 1, 'Sirve para abre botellas.'],
 ['task-describir', 1, 'Su zapatos son rojos.'], ['task-describir', 2, 'Es al lado de la ventana.'],
 ['nt-localizacion-a1', 1, 'El banco está al lado de el parque.'], ['nt-localizacion-a1', 2, 'Mi casa está cerca la estación.'], ['nt-localizacion-a1', 2, 'Mi casa es cerca de la estación.'],
 ['dc-deixis-espacial-a1', 2, '¿Vas a mi casa?'], ['dc-deixis-espacial-a1', 3, '¿Dónde tu hermano trabaja?'],
 ['nt-movimiento-estabilidad-a1', 1, '¡Ya vengo!'], ['nt-movimiento-estabilidad-a1', 2, 'Voy al trabajo en pie.'], ['nt-movimiento-estabilidad-a1', 4, 'Es la segunda calle a la derecho.'],
 ['gn-describir-lugar-a1', 1, 'Están dos cuartos y un baño.'], ['gn-describir-lugar-a1', 2, '¿Dónde hay el baño?'],
 ['task-direcciones', 3, 'Es enfrente del parque.'], ['task-direcciones', 2, 'Después volteas a la derecha.'],
 // a2-u14 and a2-u17, the two pasts inside the band
 ['preterito', 0, 'Ayer trabajo hasta las nueve.'], ['preterito', 2, '¿Qué hizo el sábado?'], ['preterito', 3, 'El domingo fue al mercado.'], ['preterito', 4, 'Estuvo en casa todo el día.'],
 ['dc-deixis-temporal-a2', 1, 'Después de comiendo, fuimos al parque.'], ['dc-deixis-temporal-a2', 2, 'Antes salir, llamo a mi mamá.'],
 ['nt-expresion-verbal-a2', 0, 'Le pedí la hora.'], ['nt-expresion-verbal-a2', 2, 'Laura dijo viene a las ocho.'], ['nt-expresion-verbal-a2', 4, 'Le dije a Diego si quiere venir.'],
 ['task-a2-ayer', 1, 'El domingo no hizo nada.'], ['task-a2-ayer', 2, 'Estuvo en casa toda la tarde.'],
 ['gr-preterito-perfecto-a2', 1, 'Nunca he comí ajiaco.'], ['gr-preterito-perfecto-a2', 1, 'Nunca tengo comido ajiaco.'], ['gr-preterito-perfecto-a2', 3, 'Sí, he ido el año pasado.'], ['gr-preterito-perfecto-a2', 4, 'Hoy he ido al banco.'],
 ['nt-anterioridad-a2', 0, 'Acabo de llegué.'], ['nt-anterioridad-a2', 0, 'Acabo llegar.'], ['nt-anterioridad-a2', 3, 'Todavía no trabajo allí.'], ['nt-anterioridad-a2', 4, '¿Cuánto es la clase?'],
 ['nt-existencia-inexistencia-a2', 1, 'Fui nacido en 1990.'], ['nt-existencia-inexistencia-a2', 4, 'Mi abuela ya es antigua.'],
 ['task-a2-experiencia', 2, '¿Cuándo has ido?'], ['task-a2-experiencia', 3, 'Nunca he veído esa película.'],
 // units 9 to 13
 ['gr-pronombre-se-a1', 0, 'Levanto a las siete.'], ['gr-pronombre-se-a1', 2, 'Mi hermano me levanta a las diez.'], ['gr-pronombre-se-a1', 4, 'Me no levanto temprano.'],
 ['gr-presente-indicativo-valores-a1', 4, 'El viernes no puedemos.'], ['gr-presente-indicativo-valores-a1', 3, 'Quero ir, pero no podo.'],
 ['gr-adverbios-lugar-tiempo-cantidad-a1', 1, 'Estoy mucho cansado.'], ['gr-adverbios-lugar-tiempo-cantidad-a1', 2, 'Sí, muy.'], ['gr-adverbios-lugar-tiempo-cantidad-a1', 3, 'Tengo muy hambre.'], ['gr-adverbios-lugar-tiempo-cantidad-a1', 4, 'Canta muy bueno.'],
 ['nt-duracion-transcurso-a1', 0, 'Empiezo de trabajar a las nueve.'], ['nt-duracion-transcurso-a1', 1, 'Termino a trabajar a las cinco.'], ['nt-duracion-transcurso-a1', 4, 'Hoy hace muy frío.'], ['nt-duracion-transcurso-a1', 4, 'Hoy es frío.'],
 ['task-rutina', 0, 'Levanto a las seis y media.'], ['task-rutina', 3, 'Casi nunca me acosto antes de las doce.'],
 ['gr-infinitivo-usos-a1', 2, 'Necesitamos compramos pan.'], ['gr-infinitivo-usos-a1', 1, 'No puedo. Tengo trabajar.'], ['gr-infinitivo-usos-a1', 3, 'Aprendiendo un idioma es difícil.'], ['gr-infinitivo-usos-a1', 4, 'Es importante de dormir bien.'],
 ['gr-oraciones-finales-a1', 0, 'Estudio español por viajar.'], ['gr-oraciones-finales-a1', 0, 'Estudio español viajar.'], ['gr-oraciones-finales-a1', 2, 'Para compro un carro.'],
 ['fn-corregir-informacion-a1', 3, 'No conozco nadar.'], ['fn-corregir-informacion-a1', 4, 'No conozco tu hermano.'], ['fn-corregir-informacion-a1', 4, 'No sé a tu hermano.'],
 ['task-pedir', 1, '¿Me puedes ayudar, por favor?'], ['task-pedir', 3, 'Tengo trabajar el domingo.'], ['task-pedir', 4, 'Quiero cambio esta camisa.'],
 ['dc-conectores-a1', 1, 'Estudio español para quiero vivir aquí.'], ['dc-conectores-a1', 1, 'Estudio español por que quiero vivir aquí.'],
 ['gr-relativo-que-a1', 1, 'El libro leo es muy bueno.'], ['gr-relativo-que-a1', 3, 'La profesora tengo es de Cali.'], ['gr-relativo-que-a1', 0, 'Tengo una amiga quien vive en Medellín.'],
 ['gr-objeto-directo-a1', 0, 'Visito mis abuelos los domingos.'], ['gr-objeto-directo-a1', 1, 'Tengo a dos hermanos.'], ['gr-objeto-directo-a1', 2, '¿Conoces mi hermana?'], ['gr-objeto-directo-a1', 3, 'Creo tienes razón.'],
 ['gr-cuantificadores-no-universales-a1', 0, 'Hablo un poca de español.'], ['gr-cuantificadores-no-universales-a1', 1, 'Hay mucho gente.'], ['gr-cuantificadores-no-universales-a1', 3, 'Estoy un poco de cansado.'], ['gr-cuantificadores-no-universales-a1', 4, 'El arriendo es demasiada cara.'],
 ['task-contar', 0, 'Tengo una hermana vive en Cali.'],
 ['gender-articles', 0, 'el casa blanca'], ['gender-articles', 1, 'las casas blanca'], ['gender-articles', 3, 'Los carros nuevos son caro.'], ['gender-articles', 4, 'La cocina es muy pequeño.'],
 ['gr-genero-sustantivos-a1', 0, 'la problema'], ['gr-genero-sustantivos-a1', 1, 'el mano'], ['gr-genero-sustantivos-a1', 3, 'El agua está frío.'], ['gr-genero-sustantivos-a1', 4, 'El español es una idioma bonita.'],
 ['gr-numero-sustantivos-a1', 0, 'los hotels'], ['gr-numero-sustantivos-a1', 1, 'dos lápizes'], ['gr-numero-sustantivos-a1', 3, 'Hay tres hoteles nuevo.'],
 ['gr-articulo-definido-a1', 0, 'Me gusta café.'], ['gr-articulo-definido-a1', 1, 'Voy a el banco.'], ['gr-articulo-definido-a1', 2, 'Vengo de el trabajo.'], ['gr-articulo-definido-a1', 4, 'Mi hermana es una médica.'],
 ['task-revisar', 0, 'Tengo una casa pequeño.'], ['task-revisar', 3, 'Hay dos gatos negro en el jardín.'],
 ['gn-generos-escritos-a1', 2, 'Vuelvo en las seis.'], ['gn-generos-escritos-a1', 1, 'Voy al supermercado.'],
 ['task-escribir', 0, 'En el final no puedo el sábado.'], ['task-escribir', 1, 'Hace muy calor y la comida es muy buena.']
].forEach(([id, i, wrong]) => {
  const t = SC[id] && SC[id].yourTurn[i];
  if (!t) { ok(false, id + '.yourTurn[' + i + '] missing'); return; }
  ok(!M.matchTranslation(wrong, { es: t.es, en: t.en, accept: t.accept }, { accents: 'lenient' }).pass, id + '.yourTurn[' + i + ']: the slip "' + wrong + '" is accepted');
});

// option length across the file: the gate's rule, a third at most
ok(rpTotal >= 20, 'expected at least 20 read-and-pick items, found ' + rpTotal);
ok(rpLongest / rpTotal <= 1 / 3, 'the right option is the longest ' + Math.round(100 * rpLongest / rpTotal) + '% of the time (a third at most)');
ok(rpShortest / rpTotal <= rpChance / rpTotal + 0.08, 'the right option is the shortest ' + Math.round(100 * rpShortest / rpTotal) + '% of the time (chance ' + Math.round(100 * rpChance / rpTotal) + '%)');

console.log('scripts: ' + Object.keys(SC).length + ', read-and-pick ' + rpTotal + ' (right is longest ' + Math.round(100 * rpLongest / rpTotal) + '%, shortest ' + Math.round(100 * rpShortest / rpTotal) + '%), longest rule ' + ruleMax + ' words');
console.log('Checks run: ' + checks);
if (errors) { console.error(errors + ' problem(s).'); process.exit(1); }
console.log('Scripts OK.');
