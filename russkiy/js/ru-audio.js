/* ============================================================================
 * RU AUDIO: the recorded clips. window.RU_AUDIO maps "<stressed text>|ru"
 * to "audio/<bundle>.bin#<offset>,<length>" (data/audio.js, built ahead of time;
 * nothing is synthesised here). Clips are packed about forty to a bundle so the
 * site has a few hundred files, not thousands. Each clip is a whole mp3 inside
 * its bundle; it is cut out as a Blob and played on one shared <audio> element.
 *
 * iPhones: a media element may only start sound inside a tap, but once one has
 * played inside a tap it stays allowed, so the shared element plays a silent
 * sound on the first tap (and again on any tap until that works). A media
 * element is used, not Web Audio, because Web Audio is muted by the ring/silent
 * switch and suspended when the app goes to the background.
 * RU.play(text) plays a clip (nothing when there is none);
 * RU.has(text) says whether there is one. The second argument is always 'ru'.
 * ========================================================================== */
(function () {
  var RU = window.RU;
  var el = null, unlocked = false, bundles = {}, token = 0, lastUrl = null;

  // ask iOS for the media audio category, so the silent switch does not mute clips
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}

  function keyOf(text, variety) { return String(text || '') + '|' + (variety || 'ru'); }
  function ref(text, variety) {
    var m = window.RU_AUDIO, r = m && m[keyOf(text, variety)];
    if (!r) return null;
    var h = r.indexOf('#'), parts = r.slice(h + 1).split(',');
    return { url: r.slice(0, h), off: +parts[0], len: +parts[1] };
  }
  function has(text, variety) { return !!ref(text, variety); }

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

  function play(text, variety, done) {
    var r = ref(text, variety), a = media();
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
  /* After an answer: only when the learner has autoplay on (the default). */
  function autoplay(text, variety) {
    if (window.RUCore && !window.RUCore.autoplay()) return false;
    return play(text, variety);
  }
  /* Fetch a bundle ahead of time, so the clip is instant. */
  function warm(text, variety) { var r = ref(text, variety); if (r) bundle(r.url).catch(function () {}); }

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
  RU.has = has; RU.play = play; RU.autoplay = autoplay; RU.warm = warm;
})();
