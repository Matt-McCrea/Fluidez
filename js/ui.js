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

  return { el: el, clear: clear, accentBar: accentBar, nextBtn: nextBtn };
})();
