/* ============================================================================
 * REPORT — "Copy and send to Matthew": the end-of-session brag sheet.
 *
 * WHAT IT IS. When a session (or an on-demand lesson) finishes, everything
 * worth telling somebody about it already exists in memory — the lesson, the
 * passage, four stage scores — and then the completion screen throws it away.
 * This turns it into one block of plain text with a button that copies it, so
 * the learner can send the day to a person. Learning alone is the thing that
 * kills a daily habit; a person who is expecting your message is the cheapest
 * accountability there is, and it costs the app one modal.
 *
 * WHY A TEXTAREA AND NOT A <pre>. The copy button is the happy path, but the
 * clipboard API is unavailable over file:// and can be refused inside an
 * installed web app. A readonly textarea is still selectable and long-press
 * copyable on a phone when everything else fails, so the text is never
 * trapped behind an API.
 *
 * WHAT "RECALL" MEANS HERE, and why it is one measure and not an average of
 * all of them. Only the Repasar stage asks about material from previous days,
 * so it is the only stage whose score means "did it stick". Reading and cloze
 * scores move with how hard today's text was; averaging them into a single
 * "how you did" number would make a hard day look like forgetting. The
 * quick check at the end of Aprender is tracked as its OWN series for the
 * same reason — it is same-day recall of brand-new material, a different
 * question, and comparing one against the other would be noise dressed as a
 * trend.
 *
 * Store: inside 'fluidez.progress' (p.recall), NOT a key of its own. It is
 * session history and it belongs with the rest of the session history — and
 * it means export, import and "Empezar de cero" already carry it.
 * ========================================================================== */
window.Report = (function () {
  var UI = window.UI;
  var PKEY = 'fluidez.progress';

  /* A sample this small is not a measurement. Two cards seen and one missed
   * is 50%, and it would report a 30-point collapse against a twenty-card
   * day. Below the floor the score is still SHOWN (it happened, it is true),
   * it is just neither recorded nor compared. */
  var MIN_SAMPLE = 3;
  // Points of movement below which "up" and "down" are both lies.
  var STEADY = 4;
  // How many previous sessions the comparison pools. Five is long enough that
  // one bad night does not become the baseline, short enough that improvement
  // over a month still shows up as improvement.
  var WINDOW = 5;
  var HISTORY_MAX = 30;

  function loadProg() { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }
  function dayNumber() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000); }
  function pct(c, s) { return s > 0 ? Math.round(100 * c / s) : 0; }
  function T(es, en) { return UI.t(es, en); }

  /* ---- the recall series -------------------------------------------------
   *
   * Compare first, record second. Recording today's sample before reading the
   * baseline would fold today into its own average and flatten every delta
   * towards zero — the better the day, the more it would hide it. */
  function trend(measure, seen, correct) {
    if (!seen) return null;
    var today = pct(correct, seen);
    var p = loadProg(), d = dayNumber();
    var all = (p.recall && p.recall[measure]) || [];
    /* Today is never part of its own baseline. Reopening the modal after the
     * sample has been written would otherwise pool today in with the previous
     * five and report a smaller delta than the first open did — the same
     * session, two different answers. */
    var prev = all.filter(function (x) { return x.d !== d; }).slice(-WINDOW);

    /* Pooled, not a mean of percentages: a 4-card day and a 40-card day are
     * not equally good evidence of what you remember, and averaging their
     * percentages says they are. */
    var ps = 0, pc = 0;
    prev.forEach(function (x) { ps += x.s; pc += x.c; });
    var avg = ps ? pct(pc, ps) : null;

    if (seen >= MIN_SAMPLE) record(measure, seen, correct);

    return {
      measure: measure, seen: seen, correct: correct, today: today,
      avg: avg, n: prev.length,
      delta: avg == null ? null : today - avg,
      counted: seen >= MIN_SAMPLE
    };
  }

  /* One sample per measure per day, and the FIRST one wins. "Hacerla otra
   * vez" re-asks cards you have just been shown the answers to, so a second
   * run scores near 100% on memory that is minutes old — recording it would
   * let anyone manufacture an improving trend by pressing the same button
   * twice. */
  function record(measure, seen, correct) {
    var p = loadProg(), d = dayNumber();
    p.recall = p.recall || {};
    var arr = p.recall[measure] = p.recall[measure] || [];
    for (var i = 0; i < arr.length; i++) if (arr[i].d === d) return;
    arr.push({ d: d, s: seen, c: correct });
    if (arr.length > HISTORY_MAX) p.recall[measure] = arr.slice(-HISTORY_MAX);
    saveProg(p);
  }

  // The one sentence the whole feature exists for. Jovial on the way up,
  // kind on the way down — a learner who gets told off by their own app on a
  // bad day stops opening it, and a bad day is exactly when they should.
  var LABEL = { review: 'Recall', check: 'The quick check' };
  var NOUN  = { review: 'cards', check: 'questions' };
  function trendLine(t) {
    if (!t) return null;
    var what = LABEL[t.measure] || 'Recall';
    var head = what + ': ' + t.correct + ' of ' + t.seen + ' (' + t.today + '%)';
    /* A sample below the floor is reported and not interpreted. One card
     * missed out of two is 50%, which against an 85% baseline would announce
     * a 35-point collapse on a day the learner did nothing wrong — and the
     * sample was not recorded either, so the "average" it was measured
     * against will never contain it. */
    if (!t.counted) {
      return '🙂 ' + head + '. Only ' + t.seen + ' ' + (NOUN[t.measure] || 'items') + ', so it doesn\'t say much either way.';
    }
    if (t.avg == null || !t.n) {
      return '🌱 ' + head + '. First one recorded, so there\'s nothing to compare it to yet.';
    }
    var d = t.delta;
    if (d >= STEADY)  return '📈 ' + head + '. That\'s ' + d + ' points up on my recent average of ' + t.avg + '%. ¡Vamos!';
    if (d <= -STEADY) return '📉 ' + head + '. That\'s ' + Math.abs(d) + ' points down on my recent average of ' + t.avg + '%. The ones I missed come back tomorrow.';
    return '➡️ ' + head + '. About the same as my recent average of ' + t.avg + '%.';
  }

  /* ---- the text ----------------------------------------------------------
   * English, deliberately, whatever the interface language is: the interface
   * is for the learner and this paragraph is for somebody who very probably
   * does not read Spanish. */
  var CHEERS = [
    '¡Otro día hecho!', '¡Hecho!', 'Another one done.',
    'That\'s today done.', '¡Un día más!'
  ];

  function themeLabel(id) {
    var t = window.TAXONOMY && window.TAXONOMY.theme ? window.TAXONOMY.theme(id) : null;
    return t ? (t.en || t.short) : null;
  }

  /* `data` is what the caller already had on screen — see Session.renderComplete
   * and LessonRun.finish. Everything is optional: a rapido session has no
   * lesson and no passage, and the report simply has fewer lines. */
  function build(data) {
    var r = data.results || {};
    var L = [];

    L.push('🌊 Fluidez · ' + (data.dateLabel || new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })));
    var head = [];
    if (data.band) head.push(data.band);
    if (data.dayNumber) head.push('day ' + data.dayNumber + ' of the course');
    if (data.unit && data.unit.title) {
      head.push('Unit: ' + data.unit.title +
        (data.unit.day ? ' (day ' + data.unit.day + ' of ' + data.unit.of + ')' : ''));
    }
    if (head.length) L.push(head.join(' · '));
    L.push('');

    if (data.lessonTitle) {
      L.push('📖 Today\'s lesson: ' + data.lessonTitle);
      if (data.lessonCanDo) L.push('    So I can ' + data.lessonCanDo + '.');
    }
    if (data.passage && data.passage.title) {
      var th = themeLabel(data.passage.theme);
      L.push('📚 Read: “' + data.passage.title + '”' + (th ? ' (' + th + ')' : '') +
        (r.comprehend ? '. Got ' + r.comprehend.correct + ' of ' + r.comprehend.total + ' questions right.' : ''));
    }

    /* Trends first: they are the answer to "how are you doing", and the raw
     * stage scores below are only the working.
     *
     * ONE trend claim per message, and Repasar wins it. Both series are
     * recorded either way — trend() is what records them, and a gap in the
     * quick-check series would show up weeks later as a comparison against
     * whatever happened to be in it. But the quick check is asked about
     * material first met ten minutes ago, so its score moves with how hard
     * today's lesson was; printed next to the recall line it reads as a
     * second verdict on the same question and contradicts it about half the
     * time. It gets its trend only when there is no Repasar stage to report —
     * an on-demand lesson (js/lessonrun.js), where it is the only measure
     * there is. */
    var lines = [];
    var tReview = r.review ? trend('review', r.review.seen, r.review.correct) : null;
    var tCheck  = r.learn && r.learn.total ? trend('check', r.learn.total, r.learn.correct) : null;
    if (tReview) {
      lines.push(trendLine(tReview));
      if (tCheck) lines.push('✅ Quick check on today\'s lesson: ' + tCheck.correct + ' of ' + tCheck.seen);
    } else if (tCheck) {
      lines.push(trendLine(tCheck));
    }
    if (lines.length) { L.push(''); lines.forEach(function (x) { L.push(x); }); }

    var work = [];
    if (r.apply) work.push('🧩 Grammar in context: ' + r.apply.correct + ' of ' + r.apply.total);
    if (r.produce) work.push('✍️ Wrote ' + r.produce.done + ' thing' + (r.produce.done === 1 ? '' : 's') + ' of my own');
    if (work.length) { L.push(''); work.forEach(function (x) { L.push(x); }); }

    /* One number for somebody skimming. It pools every question that had a
     * right answer — which is NOT the recall figure above and must not be
     * confused with it, hence the wording: "answered right today". */
    var s = 0, c = 0;
    ['review', 'learn', 'comprehend', 'apply'].forEach(function (k) {
      var x = r[k]; if (!x) return;
      s += (x.seen != null ? x.seen : x.total) || 0;
      c += x.correct || 0;
    });
    if (s) { L.push(''); L.push('📊 Overall: ' + c + ' of ' + s + ' right today (' + pct(c, s) + '%).'); }

    if (data.rhythm && data.rhythm.days30) {
      L.push('🔥 ' + data.rhythm.days30 + ' of the last 30 days.');
    }

    L.push('');
    // Picked by the day, not at random: reopening the modal must not hand the
    // learner a different message for the session they already copied.
    L.push(CHEERS[dayNumber() % CHEERS.length] + ' Sent from Fluidez 🇪🇸');
    /* Collapse runs of blank lines. The sections above each open with one, and
     * a rapido session has no lesson and no passage — so the header was
     * followed by three empty lines and the message looked broken before it
     * had said anything. */
    return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  }

  /* ---- the modal ---------------------------------------------------------
   * Appended to <body>, not into #stage-host: the completion card underneath
   * is still the screen the learner is on, and putting this inside it would
   * scroll with it and be cleared by the next render. */
  var open = null;

  function close() {
    if (!open) return;
    document.removeEventListener('keydown', open.onKey);
    if (open.node.parentNode) open.node.parentNode.removeChild(open.node);
    var back = open.returnTo;
    open = null;
    if (back && back.focus) { try { back.focus(); } catch (e) {} }
  }

  function copyText(area, btn) {
    var txt = area.value;
    function ok() {
      btn.textContent = T('¡Copiado! ✓', 'Copied ✓');
      setTimeout(function () { btn.textContent = T('📋 Copiar', '📋 Copy it'); }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok, function () { legacy(area, btn, ok); });
      return;
    }
    legacy(area, btn, ok);
  }

  /* iOS refuses execCommand('copy') on a readonly field, and setSelectionRange
   * alone selects nothing there — the field has to be briefly editable and
   * selected through a Range for the selection to be real. Ugly, and the only
   * thing that works on the device most of these sessions happen on. */
  function legacy(area, btn, ok) {
    try {
      var ro = area.readOnly;
      area.readOnly = false; area.contentEditable = 'true';
      var range = document.createRange();
      range.selectNodeContents(area);
      var sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      area.setSelectionRange(0, area.value.length);
      var done = document.execCommand('copy');
      area.readOnly = ro; area.contentEditable = 'false';
      if (done) { ok(); return; }
    } catch (e) {}
    // Last resort: it is selected and on screen — say so rather than fail mute.
    area.focus(); area.select();
    btn.textContent = T('Mantén pulsado → Copiar', 'Long-press → Copy');
  }

  function show(data) {
    if (!UI) return;
    close();
    var text = build(data);

    var back = UI.el('div', 'fz-modal-back');
    var box = UI.el('div', 'fz-modal');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'fz-modal-title');

    var x = UI.el('button', 'fz-modal-x', '✕');
    x.type = 'button'; x.setAttribute('aria-label', T('Cerrar', 'Close'));
    x.addEventListener('click', close);
    box.appendChild(x);

    var h = UI.el('h2', 'fz-modal-title', '📨 ' + T('Cópialo y mándaselo a Matthew', 'Copy and send to Matthew'));
    h.id = 'fz-modal-title';
    box.appendChild(h);
    box.appendChild(UI.el('p', 'muted', T(
      '¡Buen trabajo! Aquí tienes el día entero en un bloque de texto. Cópialo y mándaselo.',
      'Nice work. Here\'s the whole day in one block of text. Copy it and send it on.')));

    var area = UI.el('textarea', 'fz-report-text');
    area.readOnly = true; area.spellcheck = false; area.value = text;
    area.setAttribute('aria-label', T('Resumen de la sesión', 'Session summary'));
    box.appendChild(area);

    var row = UI.el('div', 'fz-modal-actions');
    var copyB = UI.el('button', 'primary-btn', T('📋 Copiar', '📋 Copy it'));
    copyB.type = 'button';
    copyB.addEventListener('click', function () { copyText(area, copyB); });
    row.appendChild(copyB);

    /* On a phone this is the real "send to Matthew" — the clipboard is a
     * detour through another app. Desktop Safari and Firefox have no
     * navigator.share, so it is offered, never relied on. */
    if (navigator.share) {
      var shareB = UI.el('button', 'ghost-btn', T('Enviar…', 'Send…'));
      shareB.type = 'button';
      shareB.addEventListener('click', function () {
        navigator.share({ text: text }).catch(function () {});
      });
      row.appendChild(shareB);
    }

    var laterB = UI.el('button', 'ghost-btn', T('Ahora no', 'Maybe later'));
    laterB.type = 'button';
    laterB.addEventListener('click', close);
    row.appendChild(laterB);
    box.appendChild(row);

    back.appendChild(box);
    // Only the backdrop itself dismisses — a click that started as a drag to
    // select the text must not close the thing being selected.
    back.addEventListener('click', function (e) { if (e.target === back) close(); });

    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
    document.addEventListener('keydown', onKey);

    document.body.appendChild(back);
    open = { node: back, onKey: onKey, returnTo: document.activeElement };
    try { copyB.focus(); } catch (e) {}
    return text;
  }

  /* Auto-open, a beat behind the render, so the ✓ and the scores are seen
   * first and the dialog reads as a reaction to them rather than as a thing
   * that happened instead of them.
   *
   * It takes the card it belongs to because that beat is long enough to press
   * "Volver al inicio": a dialog about the session you just finished, opening
   * by itself over the home screen a moment after you left, is a bug and not
   * a reminder. The overlay is HIDDEN rather than emptied on the way out (see
   * Shell.closeOverlay), so the node still has a parent — the visible test is
   * the one that answers the question. */
  function showAfter(data, node, ms) {
    setTimeout(function () {
      if (node && !node.parentNode) return;
      var stage = document.getElementById('stage-host');
      if (stage && stage.classList && stage.classList.contains('hidden')) return;
      show(data);
    }, ms == null ? 450 : ms);
  }

  return { show: show, showAfter: showAfter, close: close, build: build, trend: trend };
})();
