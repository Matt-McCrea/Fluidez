/* ============================================================================
 * AR AUDIO: the recorded clips. window.AR_AUDIO maps "<vowelled text>|<variety>"
 * to a file under audio/ (data/audio.js, built ahead of time; nothing is
 * synthesised here). AR.play(text, variety) plays the clip on one shared Audio
 * element and does nothing when there is none. AR.has(text, variety) says
 * whether there is one. Variety is msa (the default), lev or egy.
 * ========================================================================== */
(function () {
  var AR = window.AR;
  var el = null;
  function keyOf(text, variety) { return String(text || '') + '|' + (variety || 'msa'); }
  function file(text, variety) {
    var m = window.AR_AUDIO;
    return (m && m[keyOf(text, variety)]) || null;
  }
  function has(text, variety) { return !!file(text, variety); }
  function play(text, variety) {
    var f = file(text, variety);
    if (!f) return false;
    try {
      if (!el) el = new Audio();
      el.pause();
      el.src = f;
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { return false; }
    return true;
  }
  /* After an answer: only when the learner has autoplay on (the default). */
  function autoplay(text, variety) {
    if (window.ARCore && !window.ARCore.autoplay()) return false;
    return play(text, variety);
  }
  AR.has = has; AR.play = play; AR.autoplay = autoplay;
})();
