/* ============================================================================
 * SELECTOR — the 5-option chooser shown when entering practice ("any quiz or
 * game", per the brief): Repaso inteligente, Por tema, Gramática, Puntos
 * débiles, Siguiente paso. Beginner mode shows only 1, 2 and 5 — the other
 * two are noise before there's enough data to fill them.
 *
 * Every round except Puntos débiles and Siguiente paso draws from a fixed
 * Due / Focus / Stretch mix (see RATIOS): Due is genuinely scheduled review
 * (SRS.duePriority, read-only — this is a supplementary round, not the once-
 * daily Repasar stage, so it must NOT reschedule anything), Focus is whatever
 * the chosen option narrows to (a theme, a tense, or nothing for the default),
 * and Stretch is brand-new material. If a bucket can't be filled its share is
 * redistributed to the others rather than padding with trivially-known items.
 *
 * Puntos débiles pulls the worst items from the error log and the leech list
 * directly, ordered by miss count — no mixing. Siguiente paso surfaces the
 * next 1-3 items just beyond the learner's frontier (curriculum order for
 * beginner, mastery-derived for standard/refresher) with a reason shown, and
 * hands off to the existing LessonRun for whichever is tapped, since a
 * genuinely new grammar/vocab/verb focus needs teaching, not cold drilling.
 * ========================================================================== */
window.Selector = (function () {
  var UI = window.UI, S = window.SRS;

  var RATIOS = {
    standard: { due: 0.50, focus: 0.30, stretch: 0.20 },
    beginner: { due: 0.65, focus: 0.25, stretch: 0.10 },
    refresher: { due: 0.40, focus: 0.30, stretch: 0.30 }
  };

  var CAT_LABEL = {
    greetings: 'Greetings', people: 'People & family', food: 'Food & drink', home: 'Home',
    time: 'Time & days', numbers: 'Numbers', colors: 'Colours', places: 'Places',
    travel: 'Travel', body: 'The body', nature: 'Nature', adjectives: 'Describing things',
    weather: 'Weather', clothing: 'Clothing', animals: 'Animals', questions: 'Question words',
    connectors: 'Linking words', common: 'Everyday words', school: 'School', health: 'Health',
    shopping: 'Shopping', sports: 'Sports', kitchen: 'Kitchen', work: 'Work',
    technology: 'Technology', finance: 'Finance', career: 'Career', professions: 'Professions',
    relationships: 'Relationships', society: 'Society', bureaucracy: 'Bureaucracy'
  };
  function label(cat) { return CAT_LABEL[cat] || cat; }

  function loadProg() { try { return JSON.parse(localStorage.getItem('fluidez.progress')) || {}; } catch (e) { return {}; } }
  function isBeginner() { return !!(window.Profile && window.Profile.current() === 'beginner'); }
  function masterPool() { return window.StageReview ? window.StageReview.pool() : []; }

  // Flatten a master-pool item into a plain {front, back} card for Deck.run.
  // Fixed cards (grammar recall, verb-tense, error log) already carry front/
  // back; vocab/idiom/capture pairs always produce the Spanish here — Deck
  // only supports typed answers, matching how the rest of Practicar drills.
  function toCard(it) {
    if (it.fixed) return { id: it.id, front: it.front, back: it.back, kind: it.kind, hint: it.hint || null };
    return { id: it.id, front: it.en, back: it.es, kind: it.kind, hint: it.kind === 'idiom' && it.lit ? 'lit: ' + it.lit : (it.hint || null) };
  }

  // ---- the fixed 3-bucket mix ----------------------------------------------
  function mix(pool, focusPool, total) {
    var prName = window.Profile ? window.Profile.params().name : 'standard';
    var ratios = RATIOS[prName] || RATIOS.standard;
    var wantDue = Math.round(total * ratios.due);
    var wantFocus = Math.round(total * ratios.focus);
    var wantStretch = Math.max(0, total - wantDue - wantFocus);

    var used = {};
    function take(arr, n) {
      var out = [];
      for (var i = 0; i < arr.length && out.length < n; i++) {
        if (used[arr[i].id]) continue;
        used[arr[i].id] = 1; out.push(arr[i]);
      }
      return out;
    }

    var due = take(S.duePriority(pool), wantDue);
    var focus = take(focusPool || [], wantFocus);
    var stretch = take(S.freshItems(pool, pool.length, true), wantStretch);

    // redistribute any shortfall (e.g. an empty focus bucket) into due, then
    // stretch — both are genuinely due/new, never "trivially known" padding.
    var short = total - (due.length + focus.length + stretch.length);
    if (short > 0) { due = due.concat(take(S.duePriority(pool), due.length + short).slice(due.length)); }
    short = total - (due.length + focus.length + stretch.length);
    if (short > 0) { stretch = stretch.concat(take(S.freshItems(pool, pool.length, true), stretch.length + short).slice(stretch.length)); }

    return UI.shuffle(due.concat(focus).concat(stretch));
  }

  function backToTab() { window.Shell.closeOverlay(); window.Shell.refresh('practicar'); }

  function runDeck(host, title, cards, emptyMsg) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    var head = UI.el('div', 'stage-head');
    head.appendChild(UI.el('span', 'eyebrow', title));
    var exitB = UI.el('button', 'ghost-btn small', '✕ salir'); exitB.type = 'button'; exitB.style.marginTop = '0';
    exitB.addEventListener('click', backToTab);
    head.appendChild(exitB);
    wrap.appendChild(head);
    if (!cards.length) {
      wrap.appendChild(UI.el('p', 'muted', emptyMsg));
      var hb = UI.el('button', 'ghost-btn', '← Practicar'); hb.type = 'button'; hb.addEventListener('click', backToTab);
      wrap.appendChild(hb); host.appendChild(wrap); return;
    }
    cards.forEach(function (c) { S.enrol(c.id); });
    var deckHost = UI.el('div'); wrap.appendChild(deckHost);
    host.appendChild(wrap);
    window.Deck.run(deckHost, cards, function (stats) {
      UI.clear(deckHost);
      deckHost.appendChild(UI.el('h3', null, 'Listo — ' + stats.correct + ' / ' + stats.seen));
      var again = UI.el('button', 'ghost-btn', '← Practicar'); again.type = 'button'; again.addEventListener('click', backToTab);
      deckHost.appendChild(again);
    });
  }

  function runMixed(host, focusPool, title) {
    var pool = masterPool();
    var total = window.Profile ? window.Profile.reviewCap() : 15;
    var cards = mix(pool, focusPool || [], total).map(toCard);
    runDeck(host, title, cards, 'Nothing to practise here yet — come back once you\'ve met a few things.');
  }

  // ---- Por tema -------------------------------------------------------------
  function showThemePicker(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, 'Por tema'));
    wrap.appendChild(UI.el('p', 'muted', 'Pick a theme — most of this round will draw on it.'));
    var pool = masterPool();
    var byCat = {};
    pool.forEach(function (it) { if (it.kind === 'vocab') (byCat[it.cat] = byCat[it.cat] || []).push(it); });
    var chips = UI.el('div', 'chip-row');
    Object.keys(byCat).sort(function (a, b) { return label(a).localeCompare(label(b)); }).forEach(function (cat) {
      var c = UI.el('button', 'topic-chip', label(cat) + ' · ' + byCat[cat].length); c.type = 'button';
      c.addEventListener('click', function () { runMixed(host, byCat[cat], 'Por tema · ' + label(cat)); });
      chips.appendChild(c);
    });
    wrap.appendChild(chips);
    var backB = UI.el('button', 'ghost-btn', '← Practicar'); backB.type = 'button'; backB.addEventListener('click', backToTab);
    wrap.appendChild(backB);
    host.appendChild(wrap);
  }

  // ---- Gramática --------------------------------------------------------
  function showTensePicker(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, 'Gramática'));
    wrap.appendChild(UI.el('p', 'muted', 'Pick a tense or concept — its conjugations and usage contrasts together.'));
    var pool = masterPool();
    var studied = (loadProg().studied || {});
    var chips = UI.el('div', 'chip-row');
    var any = false;
    (window.GRAMMAR_LESSONS || []).filter(function (l) { return studied[l.id]; }).forEach(function (l) {
      var focusPool = pool.filter(function (it) {
        return (it.kind === 'verb-tense' && it.tense === l.id) || (it.kind === 'grammar' && it.id.indexOf('g:' + l.id + ':') === 0);
      });
      if (!focusPool.length) return;
      any = true;
      var c = UI.el('button', 'topic-chip', l.title + ' · ' + focusPool.length); c.type = 'button';
      c.addEventListener('click', function () { runMixed(host, focusPool, 'Gramática · ' + l.title); });
      chips.appendChild(c);
    });
    if (!any) wrap.appendChild(UI.el('p', 'muted', 'Nothing to drill yet — this fills in as you meet grammar in your daily session.'));
    wrap.appendChild(chips);
    var backB = UI.el('button', 'ghost-btn', '← Practicar'); backB.type = 'button'; backB.addEventListener('click', backToTab);
    wrap.appendChild(backB);
    host.appendChild(wrap);
  }

  // ---- Puntos débiles -------------------------------------------------------
  function runWeakSpots(host) {
    var pool = masterPool();
    var errCards = (window.ErrorLog ? window.ErrorLog.list() : [])
      .filter(function (e) { return e.reviewable; })
      .sort(function (a, b) { return b.count - a.count; })
      .map(function (e) { return { id: e.id, front: e.front, back: e.back, kind: 'error', hint: e.hint }; });
    var leechCards = pool.filter(function (it) { return S.isLeech(it.id); }).map(toCard);
    var seen = {}, cards = [];
    errCards.concat(leechCards).forEach(function (c) { if (!seen[c.id]) { seen[c.id] = 1; cards.push(c); } });
    var cap = window.Profile ? window.Profile.reviewCap() : 15;
    runDeck(host, 'Puntos débiles', cards.slice(0, cap), 'Nothing flagged yet — mistakes and repeated misses will show up here.');
  }

  // ---- Siguiente paso -------------------------------------------------------
  // The next 1-3 items just beyond the learner's frontier: for beginner, the
  // next steps on the curriculum path; for standard/refresher, the next
  // not-yet-introduced item in each independent track (grammar syllabus,
  // vocab catalogue, verb catalogue) — i.e. everything before it is mastered,
  // this is what "prerequisites all met, never introduced" concretely means
  // without a hand-authored prerequisite graph.
  function frontier() {
    var prog = loadProg(), studied = prog.studied || {}, out = [];

    if (isBeginner() && window.Curriculum) {
      var seq = window.Curriculum.seq(), day = prog.beginnerDay || 0;
      for (var i = day; i < seq.length && out.length < 2; i++) {
        var d = seq[i];
        if (d.type === 'practice') continue;
        if (d.type === 'grammar') {
          var l = (window.GRAMMAR_LESSONS || []).filter(function (x) { return x.id === d.id; })[0];
          if (l && !studied[d.id]) out.push({ focus: { type: 'grammar', id: d.id }, title: l.title, why: 'Next on your beginner path.' });
        } else if (d.type === 'vocab') {
          var vkey = 'vocab:' + d.cat + ':' + (d.words[0] || '');
          if (!studied[vkey]) out.push({ focus: { type: 'vocab', cat: d.cat, words: d.words }, title: 'New words · ' + label(d.cat), why: 'Next on your beginner path.' });
        } else if (d.type === 'verbs') {
          var gkey = 'verbs:' + d.verbs.join(',');
          if (!studied[gkey]) out.push({ focus: { type: 'verbs', verbs: d.verbs }, title: 'Verbs · ' + d.verbs.slice(0, 3).join(', '), why: 'Next on your beginner path.' });
        }
      }
      return out;
    }

    var lessons = window.GRAMMAR_LESSONS || [];
    var nextLesson = lessons.filter(function (l) { return !studied[l.id]; })[0];
    if (nextLesson) out.push({ focus: { type: 'grammar', id: nextLesson.id }, title: nextLesson.title, why: 'You\'ve completed every lesson before this — it\'s next in the syllabus.' });

    if (window.Progress) {
      var vl = window.Progress.vocabLessons().filter(function (v) { return !studied['vocab:' + v.cat + ':' + (v.words[0] || '')]; })[0];
      if (vl) out.push({ focus: { type: 'vocab', cat: vl.cat, words: vl.words }, title: vl.title, why: 'You know the categories before this — these haven\'t been introduced yet.' });

      var vg = window.Progress.verbLessons().filter(function (g) { return !studied['verbs:' + g.join(',')]; })[0];
      if (vg) out.push({ focus: { type: 'verbs', verbs: vg }, title: 'Verbs · ' + vg.slice(0, 3).join(', ') + (vg.length > 3 ? '…' : ''), why: 'The next batch of verbs you haven\'t met yet.' });
    }
    return out.slice(0, 3);
  }

  function showFrontier(host) {
    UI.clear(host);
    var wrap = UI.el('div', 'panel');
    wrap.appendChild(UI.el('h2', null, 'Siguiente paso'));
    wrap.appendChild(UI.el('p', 'muted', 'What to test next to progress — a little beyond where you are, not more of what you already know.'));
    var items = frontier();
    if (!items.length) {
      wrap.appendChild(UI.el('p', 'muted', 'You\'re caught up — nothing new to introduce right now. Nicely done.'));
    } else {
      var list = UI.el('div', 'syllabus');
      items.forEach(function (f) {
        var row = UI.el('button', 'syl-row'); row.type = 'button';
        row.innerHTML = '<span class="syl-mark">→</span><span class="syl-title">' + f.title + '<br><span class="muted small">' + f.why + '</span></span>';
        row.addEventListener('click', function () { window.LessonRun.run(f.focus, function () { showFrontier(host); }); });
        list.appendChild(row);
      });
      wrap.appendChild(list);
    }
    var backB = UI.el('button', 'ghost-btn', '← Practicar'); backB.type = 'button'; backB.addEventListener('click', backToTab);
    wrap.appendChild(backB);
    host.appendChild(wrap);
  }

  // ---- the chooser itself, injected into Practicar -------------------------
  // Reuses the Más menu's row styling (.mas-list/.mas-row) — same shape
  // (icon, title + subtitle, chevron), no need for a parallel set of classes.
  function renderChooser(container) {
    var beginner = isBeginner();
    var list = UI.el('div', 'mas-list');
    function row(icon, title, sub, onTap) {
      var b = UI.el('button', 'mas-row'); b.type = 'button';
      b.innerHTML = '<span class="mas-ico">' + icon + '</span><span class="mas-text"><b>' + title + '</b><br><span class="muted small">' + sub + '</span></span><span class="mas-chev">›</span>';
      b.addEventListener('click', function () { window.Shell.openOverlay(); onTap(document.getElementById('stage-host')); });
      list.appendChild(b);
    }
    row('🔀', 'Repaso inteligente', 'A mixed round — due items, plus a bit of new material', function (host) { runMixed(host, null, 'Repaso inteligente'); });
    row('🏷️', 'Por tema', 'Pick a theme to focus this round on', function (host) { showThemePicker(host); });
    if (!beginner) row('📖', 'Gramática', 'Pick a tense or concept to drill', function (host) { showTensePicker(host); });
    if (!beginner) row('🩹', 'Puntos débiles', 'Your worst items, ordered by miss count', function (host) { runWeakSpots(host); });
    row('🎯', 'Siguiente paso', 'What to test next to progress', function (host) { showFrontier(host); });
    container.appendChild(list);
  }

  return { renderChooser: renderChooser };
})();
