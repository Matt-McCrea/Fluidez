/* ============================================================================
 * USER WORDS — "Palabras": the learner's own vocabulary, treated identically
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

  function render(host, back) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h1', null, 'Palabras'));
    wrap.appendChild(UI.el('p', 'muted', 'Your own words — they join your reviews, quizzes and games exactly like the built-in ones.'));

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
      if (!a.length) { listWrap.appendChild(UI.el('p', 'muted', 'Nothing yet — add your first above.')); return; }
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
    host.appendChild(wrap);
    esIn.focus();
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

  // merge as soon as the script loads (data files are already in memory)
  mergeIntoData();

  return { add: add, update: update, remove: remove, bulkAdd: bulkAdd, all: all, count: count,
    srsState: srsState, addChip: addChip, render: render, mergeIntoData: mergeIntoData };
})();
