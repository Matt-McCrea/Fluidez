/* ============================================================================
 * UI — tiny shared helpers used across the session stages.
 * ========================================================================== */
window.UI = (function () {
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // An accent bar that inserts into the currently-relevant input/textarea.
  // `getInput` returns the element to insert into (so it can follow focus).
  var ACCENTS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
  function accentBar(getInput) {
    var bar = el('div', 'accent-bar');
    ACCENTS.forEach(function (ch) {
      var b = el('button', 'accent-btn', ch); b.type = 'button';
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

  // A primary "continue" button.
  function nextBtn(label, onClick) {
    var b = el('button', 'primary-btn', label || 'Continuar →');
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  // Deterministic RNG: same seed string -> same sequence every call. Used so a
  // lesson's content is reproducible the FIRST time it's seen (reload mid-lesson
  // and get the same passage/items), while repeats of an already-studied lesson
  // fall back to plain Math.random for variety. (mulberry32, seeded by FNV-1a.)
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
  function shuffle(a, rng) {
    rng = rng || Math.random;
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sample(arr, n, rng) { return shuffle(arr, rng).slice(0, n); }
  function pick(arr, rng) { rng = rng || Math.random; return arr.length ? arr[Math.floor(rng() * arr.length)] : null; }

  return { el: el, clear: clear, accentBar: accentBar, nextBtn: nextBtn,
    seededRandom: seededRandom, shuffle: shuffle, sample: sample, pick: pick };
})();
