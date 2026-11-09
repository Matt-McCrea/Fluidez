/* ============================================================================
 * UI: tiny shared helpers (from Fluidez js/ui.js), with the Arabic pieces
 * Talaqa needs: .ar nodes, faded text you can hold to see in full, Arabic
 * inside English text, the speaker button. English UI, so no UI.t.
 * ========================================================================== */
window.UI = (function () {
  var HOLD_MS = 350;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // Deterministic RNG (mulberry32, FNV-1a seed).
  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function seededRandom(seedStr) {
    var s = hashSeed(String(seedStr));
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(a, rng) { return window.ARCore.shuffle(a, rng); }
  function sample(arr, n, rng) { return shuffle(arr, rng).slice(0, n); }
  function pick(arr, rng) { rng = rng || Math.random; return arr.length ? arr[Math.floor(rng() * arr.length)] : null; }

  /* ---- Arabic nodes ------------------------------------------------------------ */
  // An Arabic node: right to left, its own language, the .ar style.
  function ar(text, cls) {
    var n = document.createElement('span');
    n.className = 'ar' + (cls ? ' ' + cls : '');
    n.setAttribute('dir', 'rtl');
    n.setAttribute('lang', 'ar');
    n.textContent = text;
    return n;
  }

  /* Arabic shown at a vowel level (AR.fade). Faded text can be held for 350 ms
   * to show its full vowelling until release; that is never a miss, so the click
   * that follows a hold is swallowed. level null or 'full' draws it as stored. */
  function arText(text, level, help, cls) {
    var full = String(text == null ? '' : text);
    var shown = (!level || level === 'full') ? full : window.AR.fade(full, level, help);
    var n = ar(shown, cls);
    if (shown === full) return n;
    n.classList.add('faded');
    var timer = null, heldAt = 0;
    function down() {
      clearTimeout(timer);
      timer = setTimeout(function () { n.textContent = full; n.classList.add('held'); heldAt = Date.now(); }, HOLD_MS);
    }
    function up() {
      clearTimeout(timer);
      if (n.classList.contains('held')) {
        setTimeout(function () { n.textContent = shown; n.classList.remove('held'); }, 60);
      }
    }
    n.addEventListener('pointerdown', down);
    n.addEventListener('pointerup', up);
    n.addEventListener('pointercancel', up);
    n.addEventListener('pointerleave', up);
    n.addEventListener('click', function (e) {
      if (heldAt && Date.now() - heldAt < 700) { heldAt = 0; if (e.stopPropagation) e.stopPropagation(); if (e.preventDefault) e.preventDefault(); }
    });
    n.addEventListener('contextmenu', function (e) { if (e.preventDefault) e.preventDefault(); });
    return n;
  }

  var AR_RUN = /([؀-ۿݐ-ݿ]+(?:[  ]+[؀-ۿݐ-ݿ]+)*)/;
  function hasArabic(s) { return /[؀-ۿݐ-ݿ]/.test(String(s || '')); }
  /* Arabic inside English text: every run of Arabic gets its own .ar node. */
  function mixed(parent, text) {
    String(text == null ? '' : text).split(AR_RUN).forEach(function (part) {
      if (!part) return;
      if (hasArabic(part)) parent.appendChild(ar(part));
      else parent.appendChild(document.createTextNode(part));
    });
    return parent;
  }
  /* Card text: *word* marks Arabic inside English; the rest is run through mixed(). */
  function rich(parent, text) {
    String(text == null ? '' : text).split(/(\*[^*]+\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*[^*]+\*$/.test(part)) {
        var inner = part.slice(1, -1);
        if (hasArabic(inner)) parent.appendChild(ar(inner));
        else { var i = document.createElement('i'); i.textContent = inner; parent.appendChild(i); }
      } else mixed(parent, part);
    });
    return parent;
  }

  // The small grey transliteration line
  function tr(text, cls) {
    var n = document.createElement('span');
    n.className = 'tr' + (cls ? ' ' + cls : '');
    n.textContent = text;
    return n;
  }

  /* The speaker button: plays the clip for text in a variety. Null when there is
   * no clip, so a missing clip never leaves a dead button. */
  function speaker(text, variety, cls) {
    var AR = window.AR;
    if (!AR || !AR.has || !AR.has(text, variety)) return null;
    var b = document.createElement('button');
    b.className = 'spk' + (cls ? ' ' + cls : '');
    b.type = 'button';
    b.textContent = '🔊';
    b.setAttribute('aria-label', 'Hear it');
    b.addEventListener('click', function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      AR.play(text, variety);
    });
    return b;
  }

  return { el: el, clear: clear, seededRandom: seededRandom, shuffle: shuffle, sample: sample, pick: pick,
    ar: ar, arText: arText, mixed: mixed, rich: rich, hasArabic: hasArabic, tr: tr, speaker: speaker, HOLD_MS: HOLD_MS };
})();
