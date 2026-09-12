/* ============================================================================
 * SPEAK — the app had no audio at all.
 *
 * Every Spanish string in Fluidez was silent: no recordings, no synthesis,
 * nothing. A learner could finish all 332 days of A1-B1 reading and writing
 * Spanish accurately and still not recognise a word of it spoken, because they
 * had never heard any. Worse, some lessons TEACH sound — dc-entonacion-a1 is
 * about the rising voice that turns a statement into a question — so the app
 * was describing a noise the learner had no way to hear.
 *
 * This uses the browser's own speechSynthesis: offline, free, no network, no
 * files to ship, which is the only option that fits an offline-first PWA.
 * Quality varies by platform (macOS and iOS ship good Spanish voices; some
 * Linux browsers ship none) so every call degrades to silence rather than to
 * an error, and `available()` lets the UI hide the control when there is no
 * Spanish voice at all.
 *
 * Voice choice matters pedagogically: es-ES and es-MX differ in ways a beginner
 * will hear immediately (distinción vs seseo on ce/ci/z). We prefer whatever
 * the learner set, else es-ES, and expose the list so it can be changed.
 * ========================================================================== */
window.Speak = (function () {
  var KEY = 'fluidez.voice';
  var synth = window.speechSynthesis || null;
  var cached = null;

  function voices() {
    if (!synth) return [];
    try { return synth.getVoices().filter(function (v) { return /^es(-|_|$)/i.test(v.lang); }); }
    catch (e) { return []; }
  }
  function available() { return !!synth && voices().length > 0; }

  function preferred() {
    var list = voices();
    if (!list.length) return null;
    var want = null;
    try { want = localStorage.getItem(KEY); } catch (e) {}
    if (want) {
      var exact = list.filter(function (v) { return v.name === want; })[0];
      if (exact) return exact;
    }
    // es-ES first: the course's own content (vosotros, distinción) is peninsular
    return list.filter(function (v) { return /^es-ES/i.test(v.lang); })[0] || list[0];
  }

  /* Strip what should not be read aloud. Lesson strings carry markup and
   * teaching furniture — a cloze gap, a bracketed infinitive hint, the dash a
   * dialogue line opens with — and a synthesiser reads all of it literally
   * ("underscore underscore underscore"), which is worse than silence. */
  function clean(text) {
    return String(text || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[_＿]{2,}/g, ' … ')
      .replace(/\s*\([^)]*\)\s*/g, ' ')     // (revelar) style hints
      .replace(/^[—–-]\s*/gm, '')            // dialogue dashes
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speak(text, opts) {
    if (!synth) return false;
    var said = clean(text);
    if (!said) return false;
    var v = cached || (cached = preferred());
    if (!v) return false;
    try {
      synth.cancel();                        // never let two lines overlap
      var u = new SpeechSynthesisUtterance(said);
      u.voice = v; u.lang = v.lang;
      u.rate = (opts && opts.slow) ? 0.65 : 0.95;   // 0.95: native-ish, not rushed
      synth.speak(u);
      return true;
    } catch (e) { return false; }
  }
  function stop() { try { if (synth) synth.cancel(); } catch (e) {} }

  /* A speaker button for one Spanish string. Returns null when no Spanish
   * voice exists, so callers can append unconditionally and get nothing on a
   * platform that cannot speak. Shift-click (or long-press) plays it slowly —
   * the single most requested thing from a beginner hearing native pace. */
  function button(getText, cls) {
    if (!available()) return null;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'speak-btn' + (cls ? ' ' + cls : '');
    b.setAttribute('aria-label', 'Escuchar');
    b.title = 'Escuchar (shift = despacio)';
    b.textContent = '🔊';
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      speak(typeof getText === 'function' ? getText() : getText, { slow: e.shiftKey });
    });
    return b;
  }

  // Append a speaker to an element that already holds Spanish text.
  function attach(el, text) {
    if (!el) return el;
    var b = button(text != null ? text : function () { return el.textContent; });
    if (b) el.appendChild(b);
    return el;
  }

  function setVoice(name) {
    try { localStorage.setItem(KEY, name); } catch (e) {}
    cached = null;
  }
  // Chrome populates getVoices() asynchronously; drop the cache when it lands.
  if (synth && typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', function () { cached = null; });
  }

  return { speak: speak, stop: stop, button: button, attach: attach,
           available: available, voices: voices, setVoice: setVoice, clean: clean };
})();
