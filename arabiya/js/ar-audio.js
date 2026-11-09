/* ============================================================================
 * AR AUDIO: the recorded clips. window.AR_AUDIO maps "<vowelled text>|<variety>"
 * to "audio/<bundle>.bin#<offset>,<length>" (data/audio.js, built ahead of time;
 * nothing is synthesised here). Clips are packed about forty to a bundle so the
 * site has a few hundred files, not thousands. Each clip is a whole mp3 inside
 * its bundle.
 *
 * Playback goes through Web Audio: iPhones only let a page make sound after a
 * tap, and a clip fetched after the tap would be refused by an <audio> element.
 * The AudioContext is unlocked on the first touch, then any clip can play.
 * AR.play(text, variety) plays a clip (nothing when there is none);
 * AR.has(text, variety) says whether there is one. Variety: msa, lev or egy.
 * ========================================================================== */
(function () {
  var AR = window.AR;
  var ctx = null, current = null, bundles = {}, token = 0;
  var AC = window.AudioContext || window.webkitAudioContext;

  function keyOf(text, variety) { return String(text || '') + '|' + (variety || 'msa'); }
  function ref(text, variety) {
    var m = window.AR_AUDIO, r = m && m[keyOf(text, variety)];
    if (!r) return null;
    var h = r.indexOf('#'), parts = r.slice(h + 1).split(',');
    return { url: r.slice(0, h), off: +parts[0], len: +parts[1] };
  }
  function has(text, variety) { return !!ref(text, variety); }

  function context() {
    if (!ctx && AC) { try { ctx = new AC(); } catch (e) { ctx = null; } }
    return ctx;
  }
  // unlock on the first touch or key: iOS needs a sound started inside a gesture
  function unlock() {
    var c = context();
    if (!c) return;
    if (c.state === 'suspended' && c.resume) c.resume();
    try { var s = c.createBufferSource(); s.buffer = c.createBuffer(1, 1, 22050); s.connect(c.destination); s.start(0); } catch (e) {}
    document.removeEventListener('touchend', unlock, true);
    document.removeEventListener('click', unlock, true);
    document.removeEventListener('keydown', unlock, true);
  }
  document.addEventListener('touchend', unlock, true);
  document.addEventListener('click', unlock, true);
  document.addEventListener('keydown', unlock, true);

  function bundle(url) {
    if (!bundles[url]) {
      bundles[url] = fetch(url).then(function (r) {
        if (!r.ok) throw new Error('audio ' + r.status);
        return r.arrayBuffer();
      });
      bundles[url].catch(function () { delete bundles[url]; });
    }
    return bundles[url];
  }

  function stop() {
    if (current) { try { current.stop(0); } catch (e) {} current = null; }
  }

  function play(text, variety) {
    var r = ref(text, variety), c = context();
    if (!r || !c) return false;
    var mine = ++token;
    stop();
    if (c.state === 'suspended' && c.resume) c.resume();
    bundle(r.url).then(function (buf) {
      var clip = buf.slice(r.off, r.off + r.len);     // a copy: decoding detaches it
      return new Promise(function (ok, bad) { c.decodeAudioData(clip, ok, bad); });
    }).then(function (audio) {
      if (mine !== token) return;                       // a newer clip was asked for
      var s = c.createBufferSource();
      s.buffer = audio; s.connect(c.destination); s.start(0);
      current = s;
    }).catch(function () {});
    return true;
  }
  /* After an answer: only when the learner has autoplay on (the default). */
  function autoplay(text, variety) {
    if (window.ARCore && !window.ARCore.autoplay()) return false;
    return play(text, variety);
  }
  /* Fetch a bundle ahead of time (the round's prompts), so the clip is instant. */
  function warm(text, variety) { var r = ref(text, variety); if (r) bundle(r.url).catch(function () {}); }
  AR.has = has; AR.play = play; AR.autoplay = autoplay; AR.warm = warm;
})();
