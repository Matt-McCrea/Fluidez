/* ============================================================================
 * APP — theme toggle + the small set of full-screen overlays that live
 * outside the tab bar (the daily session, the error deck, games). Everything
 * else is a tab, owned by window.Shell. `App.go(view)` is the seam every
 * overlay-triggering click still calls; it opens/closes the overlay and then
 * hands off to the view's own module.
 * ========================================================================== */
window.App = (function () {
  var THEME_KEY = 'fluidez.theme';
  var host, header;

  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    document.getElementById('theme-toggle').textContent = t === 'dark' ? '☀️' : '🌙';
  }

  function backToShell() { window.Shell.closeOverlay(); window.Shell.go('inicio'); }

  function go(view, arg) {
    switch (view) {
      case 'session':
        window.Shell.openOverlay(true);
        /* Resume only what is already running. Picking a different length from
         * the home screen is an explicit choice and starts that one instead —
         * otherwise tapping "Repaso rápido" mid-session silently resumes the
         * long one you were already in. */
        if (window.Session.isActive() && (!arg || arg === window.Session.mode().key)) window.Session.resume();
        else window.Session.start(arg);
        break;
      case 'errors':
        window.Shell.openOverlay(false);
        window.Hub.renderErrors(host, backToShell);
        break;
      case 'games':
        window.Shell.openOverlay(false);
        window.Games.render(host, backToShell);
        break;
      case 'home':
      default:
        window.Shell.closeOverlay();
        window.Shell.go('inicio');
        break;
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
    // paint the accent of the level you are studying (data/taxonomy.js)
    if (window.Profile && window.Profile.applyTheme) window.Profile.applyTheme();
    // clicking the brand returns to Inicio
    var brand = document.querySelector('.brand');
    if (brand) { brand.style.cursor = 'pointer'; brand.addEventListener('click', function () { go('home'); }); }

    window.Shell.init();

    // First launch: explain the app and place the learner, before anything else.
    if (window.Onboarding && !window.Onboarding.seen()) {
      window.Shell.openOverlay(false);
      window.Onboarding.run(host, function () {
        window.Shell.closeOverlay();
        window.Shell.go('inicio');
        if (window.Profile && window.Profile.applyTheme) window.Profile.applyTheme();
      });
    }
  });

  return { go: go };
})();
