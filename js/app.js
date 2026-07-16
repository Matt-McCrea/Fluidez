/* ============================================================================
 * APP — shell + router. The home hub is the launcher; the daily session and
 * the other areas (progress, capture, errors, resources, free writing) are
 * views mounted into #stage-host. `App.go(view)` switches between them.
 * ========================================================================== */
window.App = (function () {
  var THEME_KEY = 'fluidez.theme';
  var host, header;

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    document.getElementById('theme-toggle').textContent = t === 'dark' ? '☀️' : '🌙';
  }

  function go(view, arg) {
    var back = function () { go('home'); };
    // the progress bar belongs to the session only
    header.classList.toggle('in-session', view === 'session');
    switch (view) {
      case 'session':   window.Session.start(); break;
      case 'progress':  window.Progress.render(host, back); break;
      case 'capture':   window.Capture.render(host, back); break;
      case 'errors':    window.Hub.renderErrors(host, back); break;
      case 'resources': window.Resources.render(host, back); break;
      case 'write':     window.WriteSpace.render(host, back); break;
      case 'home':
      default:          window.Hub.render(host); break;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    host = document.getElementById('stage-host');
    header = document.querySelector('.app-header');

    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    document.getElementById('theme-toggle').addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
    // clicking the brand returns home
    var brand = document.querySelector('.brand');
    if (brand) { brand.style.cursor = 'pointer'; brand.addEventListener('click', function () { go('home'); }); }

    go('home');
  });

  return { go: go };
})();
