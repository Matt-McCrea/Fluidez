/* ============================================================================
 * GLOSS — tap any word in a Spanish text to see what it means.
 *
 *   Gloss.render(host, text, { gloss, names })   words become tappable spans
 *   Gloss.resolve(token, ctx)                    the note for a word (pure)
 *   Gloss.canSave() / Gloss.save(es, en)         the 3-a-day save cap
 *
 * The note comes from LIB.gloss.resolveGloss: the text's own gloss list first,
 * then names, small words, VOCAB and VERBS as the word list, then the verb
 * engine ("pudimos: poder, we, past"). One popover at a time; a tap anywhere
 * else closes it. "Name:" speaker labels at the start of a line are not words.
 * ========================================================================== */
window.Gloss = (function () {
  var PROG_KEY = 'fluidez.progress';
  var DAILY_SAVES = 3;
  var lexCache = null, lexSrc = null;
  var pop = null, popFor = null;

  function dayNumber() {
    if (window.SRS && window.SRS.today) return window.SRS.today();
    return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  }

  /* VOCAB entries (nouns keep their article, which the resolver strips) plus
   * every verb as an infinitive, in one list. Rebuilt only if VOCAB grew
   * (a saved word is merged into VOCAB live). */
  function lexemes() {
    var v = window.VOCAB || [], vb = window.VERBS || [];
    var key = v.length + ':' + vb.length;
    if (lexCache && lexSrc === key) return lexCache;
    var out = [];
    v.forEach(function (w) {
      if (!w || !w.es || !w.en) return;
      var g = /^(el|un)\s/i.test(w.es) ? 'm' : (/^(la|una)\s/i.test(w.es) ? 'f' : undefined);
      out.push({ es: w.es, en: w.en, pos: g ? 'noun' : undefined, gender: g });
    });
    vb.forEach(function (w) { if (w && w.inf && w.en) out.push({ es: w.inf, en: w.en, pos: 'verb' }); });
    lexCache = out; lexSrc = key;
    return out;
  }

  var LABEL = /^([A-ZÁÉÍÓÚÑ][^:\n]{0,24}):\s+/;
  var WORD = /\p{L}+/gu;

  /* Capitalised words that are not just the first word of a sentence, plus the
   * speaker labels: these are names of people and places. */
  function namesOf(text) {
    var set = new Set();
    String(text || '').split('\n').forEach(function (line) {
      var m = LABEL.exec(line);
      if (m) m[1].split(/\s+/).forEach(function (w) { set.add(w.toLowerCase()); });
      var body = m ? line.slice(m[0].length) : line;
      var re = /(^|[.!?¿¡«"'\s]\s*)(\p{Lu}\p{Ll}+)/gu, r;
      var starts = /(^|[.!?]\s+|[¿¡«]\s*)$/;
      while ((r = re.exec(body))) {
        var idx = r.index + r[1].length;
        if (starts.test(body.slice(0, idx))) continue;
        set.add(r[2].toLowerCase());
      }
    });
    return set;
  }

  function plainHow(how) {
    return String(how || '').replace(/\bpreterite\b/gi, 'past').replace(/\bimperfect\b/gi, 'past, ongoing')
      .replace(/\bpresent subjunctive\b/gi, 'subjunctive');
  }

  function resolve(token, ctx) {
    ctx = ctx || {};
    var L = window.LIB && window.LIB.gloss;
    if (!L) return null;
    var g;
    try {
      g = L.resolveGloss(token, {
        gloss: ctx.gloss || [], names: ctx.names, lexemes: lexemes(),
        at: ctx.at   // the library's own engine is the default: the old ENGINE does not mark targets
      });
    } catch (e) { g = null; }
    return g || null;
  }

  /* ---- the save cap, kept in fluidez.progress.savesToday = { <day>: n } ---- */
  function loadProg() { try { return JSON.parse(localStorage.getItem(PROG_KEY)) || {}; } catch (e) { return {}; } }
  function savedToday() {
    var s = loadProg().savesToday || {};
    return s[dayNumber()] || 0;
  }
  function canSave() { return savedToday() < DAILY_SAVES; }
  function recordSave() {
    var p = loadProg(), d = dayNumber(), keep = {};
    keep[d] = ((p.savesToday || {})[d] || 0) + 1;   // older days are dropped
    p.savesToday = keep;
    try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch (e) {}
    return keep[d];
  }
  /* Adds the word to the learner's own words (and so the review deck) through
   * UserWords.addChip. Returns true if it was saved or already there. */
  function save(es, en) {
    if (!canSave() || !window.UserWords) return false;
    var chip = window.UserWords.addChip(es, en, 'mios');
    chip.click();
    var t = String(chip.textContent || '');
    var already = /ya la tienes/.test(t);
    if (!already) recordSave();
    return true;
  }

  /* ---- popover ---------------------------------------------------------- */
  function closePop() {
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
    if (popFor) popFor.classList.remove('gw-open');
    pop = null; popFor = null;
  }
  var wired = false;
  function wire() {
    if (wired || typeof document === 'undefined') return;
    wired = true;
    document.addEventListener('click', function (e) {
      if (!pop) return;
      if (pop.contains(e.target) || (popFor && popFor.contains(e.target))) return;
      closePop();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
  }

  function openPop(span, g, token) {
    closePop();
    var UI = window.UI;
    pop = UI.el('div', 'gw-pop');
    pop.setAttribute('role', 'dialog');
    if (g.form && g.es && g.form.toLowerCase() !== g.es.toLowerCase()) {
      // a verb form or an agreeing word: show the form, then what it comes from
      pop.appendChild(UI.el('div', 'gw-line', '<b>' + esc(g.form) + '</b>: ' + esc(g.es)));
      pop.appendChild(UI.el('div', 'gw-en', esc(g.en)));
      if (g.how) pop.appendChild(UI.el('div', 'gw-how muted small', esc(plainHow(g.how))));
    } else {
      pop.appendChild(UI.el('div', 'gw-line', '<b>' + esc(g.es || token) + '</b>'));
      pop.appendChild(UI.el('div', 'gw-en', esc(g.en)));
    }
    if (g.phrase && !g.name && g.es !== g.phrase.es) {
      pop.appendChild(UI.el('div', 'gw-phrase muted small', 'in this phrase: <b>' + esc(g.phrase.es) + '</b> ' + esc(g.phrase.en)));
    }
    if (!g.name && !g.none && window.UserWords) {
      var es = g.es || token, en = g.en;
      var b = UI.el('button', 'mini-btn gw-save', 'Save'); b.type = 'button';
      if (!canSave()) { b.textContent = '3 saved today, more tomorrow'; b.disabled = true; }
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (save(es, en)) { b.textContent = 'Saved'; b.disabled = true; b.classList.add('done'); }
        else { b.textContent = '3 saved today, more tomorrow'; b.disabled = true; }
      });
      pop.appendChild(b);
    }
    document.body.appendChild(pop);
    popFor = span; span.classList.add('gw-open');
    // under the word, kept inside the viewport
    var r = span.getBoundingClientRect(), pw = pop.offsetWidth || 220;
    var left = Math.max(8, Math.min(r.left + window.pageXOffset, window.pageXOffset + document.documentElement.clientWidth - pw - 8));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + window.pageYOffset + 4) + 'px';
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Render `text` into `host`: one block per line, every word tappable. */
  function render(host, text, opts) {
    opts = opts || {};
    wire();
    var UI = window.UI;
    var names = opts.names || namesOf(text);
    var lines = String(text == null ? '' : text).split('\n');
    var wrap = UI.el('div', 'gw-text');
    lines.forEach(function (line) {
      var row = UI.el('div', 'gw-line-row' + (lines.length > 1 ? ' multi' : ''));
      if (!line.trim()) { row.classList.add('gap'); wrap.appendChild(row); return; }
      var m = LABEL.exec(line), body = line;
      if (m) {
        row.appendChild(UI.el('span', 'gw-speaker', esc(m[1]) + ': '));
        body = line.slice(m[0].length);
      }
      var idx = 0, last = 0, re = new RegExp(WORD.source, 'gu'), r;
      function plain(s) { if (s) row.appendChild(document.createTextNode(s)); }
      while ((r = re.exec(body))) {
        plain(body.slice(last, r.index));
        (function (tok, index) {
          var s = UI.el('span', 'gw'); s.textContent = tok;
          s.tabIndex = 0; s.setAttribute('role', 'button');
          function tap(ev) {
            ev.stopPropagation();
            if (popFor === s) { closePop(); return; }
            var g = resolve(tok, { gloss: opts.gloss, names: names, at: { line: body, index: index } });
            if (!g) g = { es: tok, en: 'no note for this word yet', none: true };
            openPop(s, g, tok);
          }
          s.addEventListener('click', tap);
          s.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tap(ev); } });
          row.appendChild(s);
        })(r[0], idx);
        idx++;
        last = r.index + r[0].length;
      }
      plain(body.slice(last));
      wrap.appendChild(row);
    });
    host.appendChild(wrap);
    return wrap;
  }

  return { render: render, resolve: resolve, namesOf: namesOf, lexemes: lexemes,
           canSave: canSave, save: save, savedToday: savedToday, recordSave: recordSave, close: closePop,
           DAILY_SAVES: DAILY_SAVES };
})();
