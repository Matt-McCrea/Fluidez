/* ============================================================================
 * UI: tiny shared helpers (from Fluidez js/ui.js, Irish keys on the fada bar).
 * ========================================================================== */
window.UI = (function () {
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // The fada keys and the n-/t- hyphen, one tap each, inserted where the caret is.
  var ACCENTS = ['á', 'é', 'í', 'ó', 'ú', '-'];
  function accentBar(getInput) {
    var bar = el('div', 'accent-bar');
    ACCENTS.forEach(function (ch) {
      var b = el('button', 'accent-btn', ch); b.type = 'button';
      b.setAttribute('aria-label', ch === '-' ? 'hyphen' : ch);
      b.addEventListener('mousedown', function (e) {
        e.preventDefault();                       // keep focus in the field
        var inp = getInput(); if (!inp) return;
        var s = inp.selectionStart, en = inp.selectionEnd;
        inp.value = inp.value.slice(0, s) + ch + inp.value.slice(en);
        inp.selectionStart = inp.selectionEnd = s + 1;
        inp.focus();
        inp.dispatchEvent(new Event('input'));
      });
      bar.appendChild(b);
    });
    return bar;
  }

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
  function shuffle(a, rng) { return window.GACore.shuffle(a, rng); }
  function sample(arr, n, rng) { return shuffle(arr, rng).slice(0, n); }
  function pick(arr, rng) { rng = rng || Math.random; return arr.length ? arr[Math.floor(rng() * arr.length)] : null; }

  /* Irish first from B1, English below (Profile.term). */
  function t(ga, en) {
    return (window.Profile && window.Profile.term) ? window.Profile.term(ga, en) : en;
  }

  return { el: el, clear: clear, accentBar: accentBar, t: t,
    seededRandom: seededRandom, shuffle: shuffle, sample: sample, pick: pick };
})();
