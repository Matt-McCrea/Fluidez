/* ============================================================================
 * BUSCAR (the old Palabras tab, tab key still 'palabras'): one search box over
 * words, verbs, grammar and course units, a browse view when the box is empty,
 * and the learner's own words as a section. window.Lookup.open(query) opens it
 * with a query filled in. The code for it is in the second half of this file.
 *
 * USER WORDS — the learner's own vocabulary, treated identically
 * to built-in vocab everywhere in the app.
 *
 * Stored in localStorage under `fluidez.userWords` as
 *   [{ es, en, pos, cat, example, conj }]
 *     pos   : 'noun' | 'verb' | 'adj' | 'other'
 *     cat   : a theme tag (an existing vocab category, or 'mios' = my words)
 *     conj  : for verbs only — { regular:true } if the engine can conjugate it,
 *             else null (stored invariant, excluded from conjugation games)
 *
 * At load time these are MERGED into window.VOCAB (and conjugable verbs into
 * window.VERBS) so the SRS, the daily session, quizzes and games can't tell a
 * user word from a built-in one — same id shape (v:<es>:meaning), same review
 * schedule, same pools. The shared data FILES are never touched; the merge is
 * purely in-memory, so the companion Español app is unaffected.
 *
 * Supersedes the old Capture module: legacy `fluidez.captured` entries and
 * their `cap:<es>` SRS history are migrated in on first load (SRS renames
 * cap:<es> -> v:<es>:meaning under schema v3, so nothing is lost).
 * ========================================================================== */
window.UserWords = (function () {
  var KEY = 'fluidez.userWords';
  var LEGACY_KEY = 'fluidez.captured';
  var UI = window.UI, S = window.SRS, E = window.ENGINE;

  var ARTICLE = /^(el|la|los|las|un|una|unos|unas)\s+/i;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function vid(es) { return 'v:' + es + ':meaning'; }

  function hasArticle(es) { return ARTICLE.test((es || '').trim()); }
  function looksVerb(es) { return /^[a-záéíóúñ]+(ar|er|ir|ír)$/i.test((es || '').trim()) && (es || '').trim().indexOf(' ') === -1; }

  // Guess a part of speech for a bulk-imported line with no explicit marking.
  function guessPos(es) {
    if (hasArticle(es)) return 'noun';
    if (looksVerb(es)) return 'verb';
    return 'other';
  }

  // ---- one-time migration of the old Capture store -------------------------
  function migrateLegacy() {
    var legacy;
    try { legacy = JSON.parse(localStorage.getItem(LEGACY_KEY)); } catch (e) { legacy = null; }
    if (!Array.isArray(legacy) || !legacy.length) return;
    var mine = load();
    var have = {}; mine.forEach(function (w) { have[w.es] = 1; });
    var added = false;
    legacy.forEach(function (c) {
      if (!c || !c.es || have[c.es]) return;
      mine.push({ es: c.es, en: c.en || '', pos: guessPos(c.es), cat: 'mios', example: c.note || '', conj: looksVerb(c.es) ? { regular: true } : null });
      have[c.es] = 1; added = true;
    });
    if (added) save(mine);
    // Leave fluidez.captured in place (harmless, and old backups can still be
    // imported); the SRS cap:<es> -> v:<es>:meaning rename is handled in srs.js.
  }

  // ---- merge into the in-memory datasets -----------------------------------
  var merged = false;
  function mergeIntoData() {
    if (merged) return; merged = true;
    migrateLegacy();
    window.VOCAB = window.VOCAB || [];
    window.VERBS = window.VERBS || [];
    var vocabHave = {}; window.VOCAB.forEach(function (w) { vocabHave[w.es] = 1; });
    var verbHave = {}; window.VERBS.forEach(function (v) { verbHave[v.inf] = 1; });
    load().forEach(function (w) {
      if (!vocabHave[w.es]) { window.VOCAB.push({ es: w.es, en: w.en, cat: w.cat || 'mios', userWord: true }); vocabHave[w.es] = 1; }
      if (w.pos === 'verb' && w.conj && w.conj.regular && !verbHave[w.es]) {
        window.VERBS.push({ inf: w.es, en: w.en, userWord: true }); verbHave[w.es] = 1;
      }
    });
  }

  // Re-merge a single freshly-added word without a reload (mergeIntoData only
  // runs once at boot). Keeps the live pools in sync as you add.
  function liveMerge(w) {
    window.VOCAB = window.VOCAB || []; window.VERBS = window.VERBS || [];
    if (!window.VOCAB.some(function (x) { return x.es === w.es; })) window.VOCAB.push({ es: w.es, en: w.en, cat: w.cat || 'mios', userWord: true });
    if (w.pos === 'verb' && w.conj && w.conj.regular && !window.VERBS.some(function (v) { return v.inf === w.es; })) window.VERBS.push({ inf: w.es, en: w.en, userWord: true });
  }
  function unmerge(es) {
    if (window.VOCAB) window.VOCAB = window.VOCAB.filter(function (x) { return !(x.userWord && x.es === es); });
    if (window.VERBS) window.VERBS = window.VERBS.filter(function (v) { return !(v.userWord && v.inf === es); });
  }

  // ---- CRUD ----------------------------------------------------------------
  function add(rec) {
    rec.es = (rec.es || '').trim(); rec.en = (rec.en || '').trim();
    if (!rec.es || !rec.en) return { ok: false, err: 'Need both Spanish and English.' };
    if (rec.pos === 'noun' && !hasArticle(rec.es)) return { ok: false, err: 'Nouns need their article (el/la/un/una…). That’s the point of learning them.' };
    var a = load();
    if (a.some(function (w) { return w.es === rec.es; })) return { ok: false, err: 'You already have that word.' };
    var w = { es: rec.es, en: rec.en, pos: rec.pos || 'other', cat: rec.cat || 'mios', example: (rec.example || '').trim(),
      conj: (rec.pos === 'verb' && rec.regular && looksVerb(rec.es)) ? { regular: true } : null };
    a.push(w); save(a);
    liveMerge(w);
    if (S) S.enrol(vid(w.es));
    return { ok: true, word: w };
  }

  function update(oldEs, rec) {
    var a = load();
    var i = a.findIndex(function (w) { return w.es === oldEs; });
    if (i === -1) return { ok: false, err: 'Not found.' };
    if (rec.pos === 'noun' && !hasArticle(rec.es)) return { ok: false, err: 'Nouns need their article.' };
    unmerge(oldEs);
    a[i] = { es: (rec.es || '').trim(), en: (rec.en || '').trim(), pos: rec.pos, cat: rec.cat || 'mios',
      example: (rec.example || '').trim(), conj: (rec.pos === 'verb' && rec.regular && looksVerb(rec.es)) ? { regular: true } : null };
    save(a); liveMerge(a[i]);
    if (S) S.enrol(vid(a[i].es));
    return { ok: true, word: a[i] };
  }

  function remove(es) { save(load().filter(function (w) { return w.es !== es; })); unmerge(es); }

  // Bulk paste: one entry per line, "palabra = meaning".
  function bulkAdd(text) {
    var lines = (text || '').split('\n'), n = 0, skipped = 0;
    lines.forEach(function (line) {
      var m = line.split('=');
      if (m.length < 2) { if (line.trim()) skipped++; return; }
      var es = m[0].trim(), en = m.slice(1).join('=').trim();
      if (!es || !en) { skipped++; return; }
      var pos = guessPos(es);
      var r = add({ es: es, en: en, pos: pos, cat: 'mios', regular: pos === 'verb' });
      if (r.ok) n++; else skipped++;
    });
    return { added: n, skipped: skipped };
  }

  function all() { return load(); }
  function count() { return load().length; }
  function srsState(es) {
    var id = vid(es);
    if (!S || !S.isEnrolled(id)) return { enrolled: false };
    return { enrolled: true, box: S.boxOf(id), leech: S.isLeech(id), dominado: S.isDominado(id) };
  }

  // A small "+ añadir" control usable from anywhere (a missed item, a glossed
  // passage word). Adds the pair as a user word on tap, then disables itself.
  function addChip(es, en, cat) {
    var b = UI.el('button', 'mini-btn add-chip', '+ añadir'); b.type = 'button';
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var r = add({ es: es, en: en, pos: guessPos(es), cat: cat || 'mios', regular: looksVerb(es) });
      b.textContent = r.ok ? '✓ añadida' : (r.err && /already/.test(r.err) ? '✓ ya la tienes' : '⚠');
      b.disabled = true; b.classList.add('done');
    });
    return b;
  }

  // ---- Palabras view -------------------------------------------------------
  var BOX_LABELS = ['new', '1d', '2d', '4d', '8d', '16d', '32d', '64d', '120d', '180d'];

  function myWords(wrap) {
    wrap.appendChild(UI.el('p', 'muted', 'Your own words. They join your reviews, quizzes and games exactly like the built-in ones.'));

    // ---- quick add ----
    var pos = 'other';
    var form = UI.el('div', 'capture-form');
    var esIn = UI.el('input', 'answer-input wide'); esIn.type = 'text'; esIn.placeholder = 'español (with article if a noun)'; esIn.spellcheck = false;
    var enIn = UI.el('input', 'answer-input wide'); enIn.type = 'text'; enIn.placeholder = 'English';
    var exIn = UI.el('input', 'answer-input wide'); exIn.type = 'text'; exIn.placeholder = 'example sentence (optional)';

    form.appendChild(UI.el('label', 'field-label', 'Spanish')); form.appendChild(esIn);
    form.appendChild(UI.accentBar(function () { return document.activeElement && document.activeElement.tagName === 'INPUT' ? document.activeElement : esIn; }));
    form.appendChild(UI.el('label', 'field-label', 'English')); form.appendChild(enIn);

    form.appendChild(UI.el('label', 'field-label', 'Part of speech'));
    var posBar = UI.el('div', 'segmented');
    var regularWrap;
    [['other', 'Otro'], ['noun', 'Sustantivo'], ['verb', 'Verbo'], ['adj', 'Adjetivo']].forEach(function (o) {
      var b = UI.el('button', 'seg' + (pos === o[0] ? ' active' : ''), o[1]); b.type = 'button';
      b.addEventListener('click', function () {
        pos = o[0];
        Array.prototype.forEach.call(posBar.children, function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        if (regularWrap) regularWrap.style.display = pos === 'verb' ? '' : 'none';
      });
      posBar.appendChild(b);
    });
    form.appendChild(posBar);

    regularWrap = UI.el('label', 'check-line'); regularWrap.style.display = 'none';
    var regChk = document.createElement('input'); regChk.type = 'checkbox'; regChk.checked = true;
    regularWrap.appendChild(regChk); regularWrap.appendChild(UI.el('span', null, ' Conjugación regular (so games can conjugate it)'));
    form.appendChild(regularWrap);

    form.appendChild(UI.el('label', 'field-label', 'Theme tag'));
    var catSel = UI.el('select', 'write-select');
    catSel.appendChild(new Option('mis palabras', 'mios'));
    catList().forEach(function (c) { catSel.appendChild(new Option(c, c)); });
    form.appendChild(catSel);

    form.appendChild(UI.el('label', 'field-label', 'Example')); form.appendChild(exIn);

    var fb = UI.el('div', 'feedback');
    var addB = UI.nextBtn('Add word', function () {
      var r = add({ es: esIn.value, en: enIn.value, pos: pos, cat: catSel.value, example: exIn.value, regular: regChk.checked });
      if (r.ok) {
        fb.textContent = '¡Añadida! “' + r.word.es + '” is in your deck.'; fb.className = 'feedback good';
        esIn.value = enIn.value = exIn.value = ''; esIn.focus(); renderList();
      } else { fb.textContent = r.err; fb.className = 'feedback bad'; }
    });
    form.appendChild(fb); form.appendChild(addB);
    wrap.appendChild(form);

    // ---- bulk paste ----
    var bulk = UI.el('details', 'catalog-more');
    bulk.appendChild(UI.el('summary', null, 'Bulk paste import'));
    var bt = UI.el('textarea', 'answer-area'); bt.rows = 5; bt.placeholder = 'one per line:\ngato = cat\nla mesa = the table\ncorrer = to run';
    var bfb = UI.el('div', 'feedback');
    var bBtn = UI.el('button', 'ghost-btn', 'Import lines'); bBtn.type = 'button';
    bBtn.addEventListener('click', function () {
      var r = bulkAdd(bt.value);
      bfb.textContent = 'Added ' + r.added + (r.skipped ? ', skipped ' + r.skipped : '') + '.'; bfb.className = 'feedback good';
      bt.value = ''; renderList();
    });
    bulk.appendChild(bt); bulk.appendChild(bBtn); bulk.appendChild(bfb);
    wrap.appendChild(bulk);

    // ---- list ----
    wrap.appendChild(UI.el('h3', null, 'Your words (' + count() + ')'));
    var listWrap = UI.el('div', 'capture-list');
    wrap.appendChild(listWrap);

    function renderList() {
      UI.clear(listWrap);
      var a = load();
      wrap.querySelector('h3').textContent = 'Your words (' + a.length + ')';
      if (!a.length) { listWrap.appendChild(UI.el('p', 'muted', 'Nothing yet. Add your first above.')); return; }
      a.slice().reverse().forEach(function (w) {
        var row = UI.el('div', 'capture-row');
        var st = srsState(w.es);
        var meta = w.pos + (w.cat && w.cat !== 'mios' ? ' · ' + w.cat : '') + (st.enrolled ? ' · ' + BOX_LABELS[Math.min(st.box, BOX_LABELS.length - 1)] : '') + (st.leech ? ' · leech' : '');
        row.appendChild(UI.el('span', 'cap-es', w.es));
        row.appendChild(UI.el('span', 'cap-en muted', w.en + '  (' + meta + ')'));
        var ed = UI.el('button', 'mini-btn', '✎'); ed.type = 'button';
        ed.addEventListener('click', function () { editWord(w, renderList); });
        var del = UI.el('button', 'mini-btn', '✕'); del.type = 'button';
        del.addEventListener('click', function () { remove(w.es); renderList(); });
        row.appendChild(ed); row.appendChild(del);
        listWrap.appendChild(row);
      });
    }
    renderList();
  }

  function editWord(w, onDone) {
    var es = prompt('Spanish:', w.es); if (es === null) return;
    var en = prompt('English:', w.en); if (en === null) return;
    var r = update(w.es, { es: es, en: en, pos: w.pos, cat: w.cat, example: w.example, regular: !!(w.conj && w.conj.regular) });
    if (!r.ok) alert(r.err);
    onDone();
  }

  // existing vocab categories, for the theme dropdown
  function catList() {
    var seen = {};
    (window.VOCAB || []).forEach(function (w) { if (w.cat && !w.userWord) seen[w.cat] = 1; });
    return Object.keys(seen).sort();
  }

  // ==========================================================================
  // BUSCAR: look up words, verbs, grammar and units
  // ==========================================================================
  var PERSON_EN = { 'yo': 'I', 'tú': 'you', 'él/ella': 'he, she', 'usted': 'you (formal)', 'nosotros': 'we',
    'vosotros': 'you all (Spain)', 'ellos': 'they', 'ustedes': 'you all' };
  var PERSON_LABEL = { 'yo': 'yo', 'tú': 'tú', 'él/ella': 'él / ella / usted', 'usted': 'usted', 'nosotros': 'nosotros',
    'ellos': 'ellos / ellas / ustedes', 'ustedes': 'ustedes', 'vosotros': 'vosotros' };
  var TOP_VERBS = ['ser', 'estar', 'haber', 'tener', 'hacer', 'ir', 'poder', 'decir', 'ver', 'dar', 'saber', 'querer',
    'llegar', 'pasar', 'deber', 'poner', 'parecer', 'quedar', 'creer', 'hablar', 'llevar', 'dejar', 'seguir', 'encontrar',
    'llamar', 'venir', 'pensar', 'salir', 'volver', 'tomar', 'conocer', 'vivir', 'sentir', 'tratar', 'mirar', 'contar',
    'empezar', 'esperar', 'buscar', 'existir'];

  var pendingQuery = null, lastHost = null, lastBack = null;
  var cache = { words: null, wordsN: -1, grammar: null, verbsEn: null };

  function LS() { return window.LIB && window.LIB.search; }
  function studiedMap() {
    try { return (JSON.parse(localStorage.getItem('fluidez.progress')) || {}).studied || {}; } catch (e) { return {}; }
  }
  function lessons() { return window.GRAMMAR_LESSONS || window.ALL_LESSONS || []; }
  function lessonById(id) { var ls = lessons(); for (var i = 0; i < ls.length; i++) if (ls[i].id === id) return ls[i]; return null; }

  function wordEntryList() {
    var V = window.VOCAB || [];
    if (!cache.words || cache.wordsN !== V.length) {
      var mine = {}; load().forEach(function (w) { mine[w.es] = 1; });
      cache.words = LS().wordEntries(V.map(function (w) { return { es: w.es, en: w.en }; }), {});
      cache.words.forEach(function (e) { e.mine = !!mine[e.word]; });
      cache.wordsN = V.length;
    }
    return cache.words;
  }
  function grammarEntryList() {
    if (!cache.grammar) {
      var ls = lessons();
      cache.grammar = LS().grammarEntries(ls.map(function (l, i) {
        return { id: l.id, title: l.title, tags: l.tags, pcic: l.pcic, es: l.es, en: l.summary || l.en, priority: i };
      }), {});
      var by = {}; ls.forEach(function (l) { by[l.id] = l; });
      cache.grammar.forEach(function (g) { g.lesson = by[g.id]; });
    }
    return cache.grammar;
  }
  function verbEntryList() {
    var V = window.VERBS || [];
    if (!cache.verbsEn || cache.verbsEn.n !== V.length) {
      cache.verbsEn = { n: V.length, list: V.map(function (v) { return { v: v, es: [v.inf], en: [v.en || ''] }; }) };
    }
    return cache.verbsEn.list;
  }
  function unitList() {
    var U = window.COURSE_UNITS || {};
    return Object.keys(U).map(function (k) { return U[k]; });
  }
  function unitLessonIds(u) {
    if (u.lessons) return u.lessons;
    var D = window.COURSE_DAYS || [], out = [];
    if (u.from == null) return out;
    for (var i = u.from; i < u.from + (u.length || 0) && i < D.length; i++) if (D[i] && D[i].lesson) out.push(D[i].lesson);
    return out;
  }
  function currentUnitId() {
    try {
      var t = window.Session && window.Session.today && window.Session.today();
      var title = t && t.unit && t.unit.title;
      if (!title) return null;
      var us = unitList();
      for (var i = 0; i < us.length; i++) if (us[i].title === title) return us[i].id;
    } catch (e) {}
    return null;
  }

  function openLesson(id, again) {
    if (!window.LessonRun || !window.Shell) return;
    window.Shell.openOverlay();
    window.LessonRun.run({ type: 'grammar', id: id }, again);
  }

  function lessonRow(l, studied, again) {
    var row = UI.el('button', 'syl-row ' + (studied[l.id] ? 'done' : 'open')); row.type = 'button';
    row.appendChild(UI.el('span', 'syl-mark', studied[l.id] ? '✓' : '·'));
    var tx = UI.el('span', 'bq-text');
    tx.appendChild(UI.el('span', 'syl-title', l.title));
    if (l.summary) tx.appendChild(UI.el('span', 'bq-sub muted small', l.summary));
    row.appendChild(tx);
    row.appendChild(UI.el('span', 'syl-level muted', (l.cefr || '') + ' ›'));
    row.addEventListener('click', function () { openLesson(l.id, again); });
    return row;
  }

  // learner-typed text must not go through innerHTML (UI.el sets it that way)
  function txt(tag, cls, s) { var e = UI.el(tag, cls); e.textContent = s; return e; }

  function section(title, count) {
    var s = UI.el('section', 'bq-section');
    s.appendChild(UI.el('h3', 'bq-h', title + (count != null ? ' (' + count + ')' : '')));
    return s;
  }

  // ---- the verb table ------------------------------------------------------
  function verbTable(inf, back) {
    var S = LS(), v = E.verbByInf ? E.verbByInf(inf) : null;
    var box = UI.el('div', 'panel bq-verb');
    var top = UI.el('button', 'ghost-btn', '‹ Back'); top.type = 'button';
    top.addEventListener('click', back);
    box.appendChild(top);
    box.appendChild(UI.el('h1', null, inf));
    box.appendChild(UI.el('p', 'muted', (v && v.en) || ''));
    var grid = UI.el('div', 'bq-tenses');
    var spain = [];
    S.TENSE_ORDER.forEach(function (tk) {
      var persons = E.personsFor(tk), cells = S.cellsFor(inf, tk);
      if (!cells.length) return;
      var se = S.seCellsFor(inf, tk);
      var card = UI.el('div', 'bq-tense');
      card.appendChild(UI.el('div', 'bq-tense-name', S.tenseName(tk)));
      var vos = null;
      persons.forEach(function (p, i) {
        if (p === 'vosotros') { vos = cells[i]; return; }
        var r = UI.el('div', 'bq-cell');
        r.appendChild(UI.el('span', 'bq-person muted', PERSON_LABEL[p] || p));
        r.appendChild(UI.el('span', 'bq-form', cells[i] + (se[i] && se[i] !== cells[i] ? ' / ' + se[i] : '')));
        card.appendChild(r);
      });
      if (vos) spain.push([tk, vos]);
      grid.appendChild(card);
    });
    box.appendChild(grid);
    if (spain.length) {
      var d = UI.el('details', 'catalog-more');
      d.appendChild(UI.el('summary', null, 'Spain: vosotros'));
      var g2 = UI.el('div', 'bq-tenses');
      spain.forEach(function (x) {
        var c = UI.el('div', 'bq-cell');
        c.appendChild(UI.el('span', 'bq-person muted', S.tenseShort(x[0])));
        c.appendChild(UI.el('span', 'bq-form', x[1]));
        g2.appendChild(c);
      });
      d.appendChild(g2); box.appendChild(d);
    }
    return box;
  }

  function personEn(p) { return PERSON_EN[p] || p; }

  // ---- results for a typed query -------------------------------------------
  function searchResults(q, ctx) {
    var S = LS(), out = UI.el('div', 'bq-results'), any = false;
    var nq = S.norm(q);
    if (!nq) return out;

    // a conjugated form: "pudimos: poder, we, preterite"
    if (nq.indexOf(' ') === -1) {
      var an = []; try { an = E.analyzeToken(q.trim().toLowerCase()) || []; } catch (e) { an = []; }
      if (an.length) {
        var ban = UI.el('div', 'bq-banner');
        an.slice(0, 3).forEach(function (a) {
          var b = UI.el('button', 'bq-banner-row', a.form + ': ' + a.inf + ', ' + personEn(a.person) + ', ' + S.tenseShort(a.tense).toLowerCase());
          b.type = 'button';
          b.addEventListener('click', function () { ctx.openVerb(a.inf); });
          ban.appendChild(b);
        });
        out.appendChild(ban); any = true;
      }
    }

    // words
    var words = S.searchEntries(wordEntryList(), q).slice(0, 12);
    if (words.length) {
      any = true;
      var sw = section('Words', words.length);
      words.forEach(function (w) {
        var isVerb = (window.VERBS || []).some(function (v) { return v.inf === w.word; });
        var row = UI.el(isVerb ? 'button' : 'div', 'bq-row' + (isVerb ? ' tappable' : ''));
        if (isVerb) { row.type = 'button'; row.addEventListener('click', function () { ctx.openVerb(w.word); }); }
        row.appendChild(txt('span', 'cap-es', w.word));
        row.appendChild(txt('span', 'cap-en muted', w.gloss + (w.mine ? '  (my word)' : '')));
        sw.appendChild(row);
      });
      out.appendChild(sw);
    }

    // verbs
    var vm = S.findVerbs(q, 8, window.VERBS || []), seen = {}, vlist = [];
    vm.forEach(function (m) { seen[m.verb.inf] = 1; vlist.push(m.verb); });
    if (nq.length >= 3) S.searchEntries(verbEntryList(), q).slice(0, 8).forEach(function (e) {
      if (!seen[e.v.inf] && vlist.length < 10) { seen[e.v.inf] = 1; vlist.push(e.v); }
    });
    if (vlist.length) {
      any = true;
      var sv = section('Verbs', vlist.length);
      vlist.forEach(function (v) {
        var row = UI.el('button', 'bq-row tappable'); row.type = 'button';
        row.appendChild(UI.el('span', 'cap-es', v.inf));
        row.appendChild(UI.el('span', 'cap-en muted', (v.en || '') + '  ›'));
        row.addEventListener('click', function () { ctx.openVerb(v.inf); });
        sv.appendChild(row);
      });
      out.appendChild(sv);
    }

    // grammar, grouped by topic
    var gr = S.searchEntries(grammarEntryList(), q).slice(0, 24);
    if (gr.length) {
      any = true;
      var sg = section('Grammar', gr.length), studied = studiedMap();
      S.groupByTopic(gr).forEach(function (g) {
        sg.appendChild(UI.el('div', 'bq-topic muted', g.label));
        g.entries.forEach(function (e) { sg.appendChild(lessonRow(e.lesson || { id: e.id, title: e.title }, studied, ctx.again)); });
      });
      out.appendChild(sg);
    }

    // units
    var ue = unitList().map(function (u) { return { u: u, title: u.title, es: [], en: [u.goal || ''].concat(u.canDo || []) }; });
    var un = S.searchEntries(ue, q).slice(0, 6);
    if (un.length) {
      any = true;
      var su = section('Units', un.length);
      un.forEach(function (e) { su.appendChild(unitBlock(e.u, ctx, false)); });
      out.appendChild(su);
    }

    if (!any) out.appendChild(txt('p', 'muted', 'Nothing found for “' + q + '”. Try the Spanish or the English, or a part of the word.'));
    return out;
  }

  // a unit that opens to list its lessons
  function unitBlock(u, ctx, isCurrent) {
    var d = UI.el('details', 'bq-unit' + (isCurrent ? ' current' : ''));
    var sm = UI.el('summary', null, u.title + (u.band ? ' · ' + u.band : '') + (isCurrent ? ' · you are here' : ''));
    d.appendChild(sm);
    if (u.goal) d.appendChild(UI.el('p', 'muted small', u.goal));
    var studied = studiedMap(), list = UI.el('div', 'syllabus');
    d.addEventListener('toggle', function () {
      if (!d.open || list.childNodes.length) return;
      unitLessonIds(u).forEach(function (id) {
        var l = lessonById(id);
        if (l) list.appendChild(lessonRow(l, studied, ctx.again));
      });
      if (!list.childNodes.length) list.appendChild(UI.el('p', 'muted small', 'No lessons listed for this unit.'));
    });
    d.appendChild(list);
    return d;
  }

  // ---- browse (empty box) --------------------------------------------------
  function browse(ctx) {
    var S = LS(), out = UI.el('div', 'bq-results'), studied = studiedMap();

    var sg = section('Grammar by topic');
    S.groupByTopic(grammarEntryList()).forEach(function (g) {
      var d = UI.el('details', 'catalog-more');
      var done = g.entries.filter(function (e) { return studied[e.id]; }).length;
      d.appendChild(UI.el('summary', null, g.label + ' (' + done + '/' + g.entries.length + ')'));
      var list = UI.el('div', 'syllabus');
      d.addEventListener('toggle', function () {
        if (!d.open || list.childNodes.length) return;
        g.entries.forEach(function (e) { list.appendChild(lessonRow(e.lesson || { id: e.id, title: e.title }, studied, ctx.again)); });
      });
      d.appendChild(list); sg.appendChild(d);
    });
    out.appendChild(sg);

    var sv = section('Verbs');
    var chips = UI.el('div', 'chip-row');
    TOP_VERBS.forEach(function (inf) {
      var c = UI.el('button', 'vocab-chip', inf); c.type = 'button';
      c.addEventListener('click', function () { ctx.openVerb(inf); });
      chips.appendChild(c);
    });
    sv.appendChild(chips); out.appendChild(sv);

    var su = section('Units'), cur = currentUnitId();
    unitList().forEach(function (u) { su.appendChild(unitBlock(u, ctx, u.id === cur)); });
    out.appendChild(su);

    var sm = UI.el('details', 'catalog-more bq-mine');
    sm.appendChild(UI.el('summary', null, 'My words (' + count() + ')'));
    var inner = UI.el('div', 'bq-mine-body');
    var built = false;
    sm.addEventListener('toggle', function () { if (sm.open && !built) { built = true; myWords(inner); } });
    sm.appendChild(inner);
    out.appendChild(sm);
    return out;
  }

  // ---- the screen ----------------------------------------------------------
  function renderBuscar(host, back, opts) {
    if (!LS()) { UI.clear(host); var np = UI.el('div', 'panel'); np.appendChild(UI.el('p', 'muted', 'Search is not available.')); host.appendChild(np); return; }
    lastHost = host; lastBack = back;
    var start = (opts && opts.query) || pendingQuery || '';
    pendingQuery = null;
    UI.clear(host);
    var wrap = UI.el('div', 'panel bq-screen');
    wrap.appendChild(UI.el('h1', null, 'Buscar'));
    var inputRow = UI.el('div', 'bq-search');
    var input = UI.el('input', 'answer-input wide bq-input'); input.type = 'search';
    input.placeholder = 'Search a word, a verb, a grammar point or a unit'; input.spellcheck = false;
    input.setAttribute('autocomplete', 'off'); input.setAttribute('aria-label', 'Search');
    input.value = start;
    inputRow.appendChild(input);
    wrap.appendChild(inputRow);
    wrap.appendChild(UI.accentBar(function () { return input; }));
    var body = UI.el('div', 'bq-body');
    wrap.appendChild(body);
    host.appendChild(wrap);

    var timer = null;
    var ctx = {
      again: function () { renderBuscar(host, back, { query: input.value }); },
      openVerb: function (inf) {
        UI.clear(host);
        host.appendChild(verbTable(inf, function () { renderBuscar(host, back, { query: input.value }); }));
        window.scrollTo && window.scrollTo(0, 0);
      }
    };
    function show() {
      UI.clear(body);
      var q = input.value;
      body.appendChild(S_norm(q) ? searchResults(q, ctx) : browse(ctx));
    }
    function S_norm(q) { return LS().norm(q); }
    input.addEventListener('input', function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(show, 180);
    });
    show();
    if (start) { try { input.focus(); } catch (e) {} }
  }

  // Entry point for Gloss or any screen: Lookup.open('pudimos')
  window.Lookup = {
    open: function (query) {
      pendingQuery = query == null ? '' : String(query);
      if (window.Shell && window.Shell.closeOverlay) { try { window.Shell.closeOverlay(); } catch (e) {} }
      if (window.Shell && window.Shell.go) window.Shell.go('palabras');
      // the tab is only built once; if it already exists, rebuild it with the query
      if (pendingQuery !== null && lastHost && document.body.contains(lastHost)) renderBuscar(lastHost, lastBack, { query: pendingQuery });
    }
  };

  // merge as soon as the script loads (data files are already in memory)
  mergeIntoData();

  return { add: add, update: update, remove: remove, bulkAdd: bulkAdd, all: all, count: count,
    srsState: srsState, addChip: addChip, render: renderBuscar, mergeIntoData: mergeIntoData };
})();
