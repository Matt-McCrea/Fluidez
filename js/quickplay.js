/* ============================================================================
 * QUICK PLAY — one button that decides for you.
 *
 * Everything this needs already existed and was spread across four modules:
 * what the scheduler wants back (SRS + Hub.reviewPool), what you keep getting
 * wrong (ErrorLog), which game you nearly beat (GameScore.nearMissScore), and
 * whether today's challenge is still standing (GameScore.todayBest). None of
 * it was ever put behind a single button, so using any of it meant knowing it
 * was there and choosing it — which is exactly the decision somebody with two
 * spare minutes does not want to make.
 *
 * The rules are deliberately plain, and in this order, because each one is a
 * better reason than the one after it:
 *
 *   1. the scheduler is owed a real batch          → quick review
 *   2. today's challenge has not been played       → the challenge
 *   3. you keep missing the same things            → a weak-spots round
 *   4. you came within a whisker of a record       → that game
 *   5. nothing is pressing                         → practice, rotated by day
 *
 * No weighting, no model. If a rule fires it also supplies the sentence that
 * says why, and the button never claims a reason it does not have.
 *
 * It is the app's ONLY recommender. The home screen briefly had three — this
 * card, a rotating practice box on the done card, and the games card — all
 * suggesting what to do next within one screen of each other, sometimes the
 * same thing twice. The other two are gone; the practice box calls pick()
 * with the things its own surface already shows ruled out.
 * ========================================================================== */
window.QuickPlay = (function () {
  var UI = window.UI;

  var DUE_ENOUGH = 8;        // fewer than this and a "review" round is mostly padding
  var STUCK_ENOUGH = 3;      // repeated misses worth a dedicated round
  var NEARLY = 0.9;          // within 10% of your own record

  function T(es, en) { return UI.t(es, en); }

  function dueNow() {
    if (!window.SRS || !window.Hub) return 0;
    try { return window.SRS.dueCount(window.Hub.reviewPool()); } catch (e) { return 0; }
  }

  /* The strongest available reason, as { label, why, cta, mins, run }.
   *
   * `opts` lets a caller rule things out that its own surface is already
   * showing, which is how the home screen avoids recommending the same thing
   * three times: the done-state Practice box passes skipReview (the due count
   * is in the strip above it) and skipDaily (the Games card below headlines
   * the challenge already).
   *
   * Null only if the app is too empty to have an opinion. */
  function pick(opts) {
    var GS = window.GameScore, G = window.Games, Sel = window.Selector;
    opts = opts || {};

    var due = dueNow();
    if (!opts.skipReview && due >= DUE_ENOUGH) {
      return {
        label: T('Repasar ' + due, 'Review ' + due),
        why: T('Es lo que toca hoy', 'These came due today'),
        cta: T('Repasar', 'Review'),
        mins: T('unos 4 min', 'about 4 min'),
        run: function () { window.App.go('session', 'rapido'); }
      };
    }

    if (!opts.skipDaily && GS && G && !GS.todayBest(GS.dailyKey())) {
      return {
        label: T('Reto de hoy', "Today's challenge"),
        why: T('Todavía no lo has jugado', 'You have not played it yet'),
        cta: T('Jugar', 'Play'),
        mins: '90 s',
        run: function () { G.open(GS.dailyKey()); }
      };
    }

    var stuck = window.ErrorLog ? window.ErrorLog.cards() : [];
    if (G && stuck.length >= STUCK_ENOUGH) {
      var topic = commonTopic(stuck);
      if (topic) {
        return {
          label: T('Puntos débiles', 'Weak spots'),
          why: T('Lo que se te sigue resistiendo', 'The things you keep missing'),
          cta: T('Practicar', 'Practise'),
          mins: '60 s',
          run: function () { G.openWeak(topic.key, G.topicLabel(topic.key)); }
        };
      }
    }

    if (GS && G && G.recommend) {
      var rec = G.recommend();
      if (rec) {
        var near = GS.nearMissScore(rec.game.key);
        return {
          label: rec.game.name,
          why: rec.why,
          cta: T('Jugar', 'Play'),
          mins: Math.round((rec.game.secs || 60) / 60) + ' min',
          hot: near > NEARLY && near < 1,
          run: function () { G.open(rec.game.key); }
        };
      }
    }

    /* Nothing is pressing, so offer practice, rotated by the day rather than
     * ranked — with no reason to prefer one there is no honest way to rank
     * them, and the same suggestion every evening is its own problem. */
    var rot = [];
    function overlay(fn) {
      return function () { window.Shell.openOverlay(); fn(document.getElementById('stage-host')); };
    }
    if (Sel && Sel.showTensePicker) {
      rot.push({ label: T('Gramática', 'Grammar'),
                 why: T('Elige un tiempo y practícalo', 'Pick a tense and drill it'),
                 cta: T('Elegir', 'Choose'), mins: '5 min', run: overlay(Sel.showTensePicker) });
    }
    if (Sel && Sel.showThemePicker) {
      rot.push({ label: T('Por tema', 'By topic'),
                 why: T('Escribe sobre algo concreto', 'Write about something specific'),
                 cta: T('Elegir', 'Choose'), mins: '5 min', run: overlay(Sel.showThemePicker) });
    }
    if (Sel && Sel.runMixed) {
      rot.push({ label: T('Repaso mixto', 'Mixed practice'),
                 why: T('Un poco de todo lo que llevas', 'A bit of everything you have met'),
                 cta: T('Empezar', 'Start'), mins: '5 min',
                 run: overlay(function (h) { Sel.runMixed(h, null, T('Repaso mixto', 'Mixed practice')); }) });
    }
    if (rot.length) {
      var day = window.SRS ? Math.abs(window.SRS.today()) : 0;
      return rot[day % rot.length];
    }
    return null;
  }

  // The topic behind the most logged misses, when one stands out at all.
  function commonTopic(cards) {
    var n = {};
    cards.forEach(function (c) { if (c.topic) n[c.topic] = (n[c.topic] || 0) + 1; });
    var best = null;
    Object.keys(n).forEach(function (k) { if (!best || n[k] > best.n) best = { key: k, n: n[k] }; });
    return best && best.n >= 2 ? best : null;
  }

  /* The home-screen card. Returns null rather than an empty shell, so the
   * caller can append it unconditionally. */
  function card() {
    var p = pick();
    if (!p) return null;

    var c = UI.el('button', 'quickplay' + (p.hot ? ' hot' : ''));
    c.type = 'button';

    var left = UI.el('span', 'qp-text');
    left.appendChild(UI.el('span', 'qp-eyebrow', T('Dos minutos', 'Got two minutes')));
    left.appendChild(UI.el('b', 'qp-label', p.label));
    left.appendChild(UI.el('span', 'qp-why', p.why));
    c.appendChild(left);

    var right = UI.el('span', 'qp-go');
    right.appendChild(UI.el('span', 'qp-mins', p.mins || ''));
    right.appendChild(UI.el('span', 'qp-arrow', '▸'));
    c.appendChild(right);

    c.addEventListener('click', p.run);
    return c;
  }

  return { pick: pick, card: card };
})();
