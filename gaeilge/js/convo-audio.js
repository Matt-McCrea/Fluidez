/* ============================================================================
 * CONVERSATION AUDIO: the recorded lines of the example conversations.
 * window.ES_CONVO_AUDIO (Juegos) or GA_CONVO_AUDIO (Líofa) maps "<convo id>#<line>"
 * to "audio/<bundle>.bin#<offset>,<length>" (data/convo-audio.js, built by
 * tools/build-convo-audio.py; nothing is synthesised here). Each clip is a whole
 * mp3 inside its bundle, cut out as a Blob and played on one shared <audio> element.
 *
 * iPhones: a media element may only start sound inside a tap, but once one has
 * played inside a tap it stays allowed, so the shared element plays a silent
 * sound on the first tap. A media element, not Web Audio, because Web Audio is
 * muted by the ring/silent switch.
 * ConvoAudio.play(key, done) plays a line (false when there is no clip);
 * ConvoAudio.has(key); ConvoAudio.stop().
 * ========================================================================== */
(function () {
  var el = null, unlocked = false, bundles = {}, token = 0, lastUrl = null;

  // ask iOS for the media audio category, so the silent switch does not mute clips
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}

  function ref(key) {
    var m = window.ES_CONVO_AUDIO || window.GA_CONVO_AUDIO, r = m && m[key];
    if (!r) return null;
    var h = r.indexOf('#'), parts = r.slice(h + 1).split(',');
    return { url: r.slice(0, h), off: +parts[0], len: +parts[1] };
  }
  function has(key) { return !!ref(key); }

  function media() {
    if (!el && typeof Audio !== 'undefined') {
      try { el = new Audio(); el.preload = 'auto'; if (el.setAttribute) el.setAttribute('playsinline', ''); } catch (e) { el = null; }
    }
    return el;
  }
  function unlock() {
    if (unlocked) return;
    var a = media();
    if (!a) return;
    try {
      a.src = silentWav();
      var p = a.play();
      if (p && p.then) p.then(function () { unlocked = true; }, function () {});
      else unlocked = true;
    } catch (e) {}
  }
  ['touchend', 'click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, unlock, true); });

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

  function play(key, done) {
    var r = ref(key), a = media();
    if (!r || !a) return false;
    var mine = ++token;
    try { a.pause(); a.onended = null; } catch (e) {}
    bundle(r.url).then(function (buf) {
      if (mine !== token) return;                       // a newer clip was asked for
      var url = URL.createObjectURL(new Blob([buf.slice(r.off, r.off + r.len)], { type: 'audio/mpeg' }));
      if (lastUrl) { try { URL.revokeObjectURL(lastUrl); } catch (e) {} }
      lastUrl = url;
      a.src = url;
      a.onended = done || null;
      var p = a.play();
      if (p && p.catch) p.catch(function () {});
    }).catch(function () {});
    return true;
  }
  function stop() { token++; var a = media(); if (a) { try { a.pause(); a.onended = null; } catch (e) {} } }

  /* A short silent WAV (8 kHz, 8-bit, 0.1 s), built once. */
  var silentUrl = null;
  function silentWav() {
    if (silentUrl) return silentUrl;
    var n = 800, b = new Uint8Array(44 + n), i;
    function s(o, t) { for (i = 0; i < t.length; i++) b[o + i] = t.charCodeAt(i); }
    function u32(o, v) { b[o] = v & 255; b[o + 1] = (v >> 8) & 255; b[o + 2] = (v >> 16) & 255; b[o + 3] = (v >> 24) & 255; }
    function u16(o, v) { b[o] = v & 255; b[o + 1] = (v >> 8) & 255; }
    s(0, 'RIFF'); u32(4, 36 + n); s(8, 'WAVE'); s(12, 'fmt '); u32(16, 16); u16(20, 1); u16(22, 1);
    u32(24, 8000); u32(28, 8000); u16(32, 1); u16(34, 8); s(36, 'data'); u32(40, n);
    for (i = 44; i < b.length; i++) b[i] = 128;
    try { silentUrl = URL.createObjectURL(new Blob([b], { type: 'audio/wav' })); } catch (e) { silentUrl = ''; }
    return silentUrl;
  }
  window.ConvoAudio = { has: has, play: play, stop: stop };
})();
