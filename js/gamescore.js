/* ============================================================================
 * GAME SCORE — what a point is, and who is winning.
 *
 * The old games scored `correct`: one point for guessing el/la, one point for
 * an imperfect subjunctive. That number cannot mean anything, so beating it
 * cannot feel like anything. The whole Juegos section now runs on ONE formula,
 * shared by every game, so a score in Verbos and a score in Escucha are the
 * same claim about your Spanish:
 *
 *      points = round( base × speed × combo )
 *
 *   base   the DIFFICULTY OF THE CONTENT, not of the game — the CEFR band the
 *          item came from, plus length (a 14-word sentence is not a word) and
 *          form (an irregular subjunctive is not a present-tense -ar verb),
 *          scaled by how much the interaction actually asks of you: typing is
 *          worth full value, tapping one of four is worth 0.6 of it.
 *   speed  1.0 … 1.5. Answer instantly for the full bonus, at the limit for
 *          none. A WRONG ANSWER SCORES ZERO whatever the speed, so a fast
 *          wrong answer can never beat a slow right one — the one guarantee a
 *          timed language game has to make.
 *   combo  1.0 … 2.0, +0.1 per consecutive correct answer, capped at ten.
 *
 * Nothing here can be farmed, because difficulty is not chosen: the LADDER
 * moves it. A correct answer climbs a rung, a miss drops two, and rungs map to
 * CEFR bands — so sitting on easy items is not a strategy, it is a ceiling
 * (~117 a go at rung 1 against ~570 at rung 10).
 *
 * An answer wrong only in its accents scores half and KEEPS the combo. It is a
 * real error and it is not the same error as not knowing the word.
 *
 * Store (localStorage 'fluidez.games'): per-game personal best, best today,
 * recent history, plus the daily challenge's own bests. No XP, no coins, no
 * unlocks, no streak that punishes a missed day — the only currency is the
 * score, and the only opponent is the last one you set.
 * ========================================================================== */
window.GameScore = (function () {
  var KEY = 'fluidez.games';
  var BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  // What a correct answer at each band is worth before any adjustment. The
  // steps widen deliberately: the distance from B2 to C1 Spanish is bigger
  // than the distance from A1 to A2, and the score should say so.
  var BAND_VALUE = { A1: 60, A2: 85, B1: 120, B2: 165, C1: 220 };

  // Ten rungs over five bands — two rungs per band, so climbing feels
  // continuous rather than jumping a whole level at a time.
  var RUNG_BAND = ['A1', 'A1', 'A2', 'A2', 'B1', 'B1', 'B2', 'B2', 'C1', 'C1'];
  var MAX_RUNG = 10;

  // Recognition is genuinely easier than production, and the score says so.
  var PLAY_FACTOR = { type: 1, build: 0.85, choose: 0.6, listen: 0.6 };

  // How long you get before the speed bonus is gone. Not a deadline — the
  // round clock is the deadline; this is only the curve the bonus decays on.
  var PLAY_LIMIT = { type: 11000, build: 15000, choose: 6000, listen: 8000 };

  var COMBO_STEP = 0.1, COMBO_CAP = 10;
  var SPEED_MAX = 0.5;

  function bandForRung(r) { return RUNG_BAND[Math.max(0, Math.min(MAX_RUNG - 1, (r | 0) - 1))]; }
  function bandIndex(b) { var i = BANDS.indexOf(b); return i === -1 ? 0 : i; }
  function limitFor(item) { return item.limitMs || PLAY_LIMIT[item.play] || 9000; }

  /* The base value of one item, before speed and combo. `bonus` is what the
   * generator adds for length and form — it knows things the band does not
   * (that this C1 sentence is fourteen words long, that this verb is
   * suppletive in a compound subjunctive). */
  function baseValue(item) {
    var band = BAND_VALUE[item.cefr] || BAND_VALUE.A1;
    var f = PLAY_FACTOR[item.play] != null ? PLAY_FACTOR[item.play] : 1;
    return (band + (item.bonus || 0)) * f;
  }

  function speedFactor(ms, item) {
    var limit = limitFor(item);
    var left = Math.max(0, limit - Math.max(0, ms)) / limit;
    return 1 + SPEED_MAX * left;
  }

  function comboFactor(combo) {
    return 1 + COMBO_STEP * Math.min(combo, COMBO_CAP);
  }

  /* Score one answer. `result` is 'good' | 'near' | 'wrong'; `combo` is the
   * run BEFORE this answer. Returns the points and the reasons, because the
   * HUD shows the reasons ("+340 · ×1.6 · rápido") and a total that arrives
   * with no explanation is just a number going up. */
  function award(item, result, ms, combo) {
    if (result === 'wrong') return { points: 0, tags: [] };
    var speed = speedFactor(ms, item);
    var cf = comboFactor(combo);
    var pts = baseValue(item) * speed * cf * (result === 'near' ? 0.5 : 1);
    var tags = [];
    if (cf > 1.05) tags.push('×' + cf.toFixed(1));
    if (speed > 1.3) tags.push('rápido');
    if (result === 'near') tags.push('casi');
    return { points: Math.round(pts), tags: tags, speed: speed, combo: cf };
  }

  /* The ladder. Up one on a correct answer, DOWN TWO on a miss — asymmetric on
   * purpose, so a run of luck cannot park you above your actual level, and one
   * mistake at the top is a real setback without being a reset. A near miss
   * holds position: you knew the word. */
  function nextRung(rung, result, maxRung) {
    var cap = maxRung || MAX_RUNG;
    if (result === 'good') return Math.min(cap, rung + 1);
    if (result === 'near') return rung;
    return Math.max(1, rung - 2);
  }

  /* The highest rung this learner should ever be dealt: their own level plus
   * one band, so there is always somewhere to climb and a learner three weeks
   * in is never handed a C1 clitic cluster. */
  function ceilingRung() {
    var cefr = (window.Profile && window.Profile.params()) ? window.Profile.params().cefr : 'A1';
    var i = bandIndex(cefr);
    return Math.min(MAX_RUNG, (i + 1) * 2 + 2);
  }

  // ---- the store -----------------------------------------------------------
  function today() { return window.SRS ? window.SRS.today() : Math.floor(Date.now() / 86400000); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  function blank() { return { pb: 0, pbDay: null, plays: 0, bestCombo: 0, bestBand: null, bestRun: 0, history: [] }; }

  function stats(key) {
    var s = load()[key];
    if (!s) return blank();
    var out = blank();
    Object.keys(s).forEach(function (k) { out[k] = s[k]; });
    out.history = s.history || [];
    return out;
  }

  function playsOn(key, day) {
    return stats(key).history.filter(function (h) { return h.d === day; });
  }
  function bestOn(key, day) {
    return playsOn(key, day).reduce(function (m, h) { return Math.max(m, h.s); }, 0);
  }
  function todayBest(key) { return bestOn(key, today()); }
  function pb(key) { return stats(key).pb || 0; }

  /* File a finished round. Returns what the end screen needs to say, including
   * the one line that decides whether there is another round: how far off the
   * personal best you were. */
  function record(key, r) {
    var all = load();
    var s = all[key] || blank();
    var prevPb = s.pb || 0;
    var day = today();
    var isPb = r.score > prevPb;

    s.plays = (s.plays || 0) + 1;
    s.bestCombo = Math.max(s.bestCombo || 0, r.combo || 0);
    s.bestRun = Math.max(s.bestRun || 0, r.run || 0);
    if (!s.bestBand || bandIndex(r.band) > bandIndex(s.bestBand)) s.bestBand = r.band || s.bestBand;
    if (isPb) { s.pb = r.score; s.pbDay = day; }
    s.history = (s.history || []).concat([{ d: day, s: r.score }]).slice(-60);
    all[key] = s;
    save(all);

    return {
      score: r.score, isPb: isPb, pb: s.pb, prevPb: prevPb,
      gap: isPb ? r.score - prevPb : prevPb - r.score,
      todayBest: bestOn(key, day), todayPlays: playsOn(key, day).length,
      bestBand: s.bestBand
    };
  }

  /* Was the last handful of rounds close to the best? This is what decides
   * which game the landing page recommends — "you were 290 off" is a far
   * better reason to open a game than "you have not played this one". */
  function nearMissScore(key) {
    var s = stats(key);
    if (!s.pb || s.history.length < 2) return 0;
    /* The LAST round against the best, not the best of the last few — which
     * was the bug: the round that SET the personal best is one of the last
     * few, so the ratio came out at exactly 1.0 and the game was never
     * offered. "Your last game was 290 off" is the line that makes somebody
     * play again anyway; the best of the last three is not a sentence. */
    var last = s.history[s.history.length - 1].s;
    return last / s.pb;            // 0…1, where ~0.95 means "one more round"
  }

  // ---- the daily challenge -------------------------------------------------
  // Seeded from the date, so today's ninety seconds are the same ninety
  // seconds for everyone, every attempt, until midnight.
  function dailySeed() { return 'juego-' + today(); }
  function dailyKey() { return 'reto'; }
  // es-ES, not the browser's locale: the card around it is in Spanish, and an
  // English date beside "Reto de hoy · Mixto · 90 segundos" reads as a bug.
  function dailyLabel() {
    return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  /* Days running with a daily challenge played. It counts UP and is never
   * mentioned when it is zero: a number that only appears once you have one is
   * an observation, where a number that warns you about losing it is a debt. */
  function dailyStreak() {
    var h = stats(dailyKey()).history, day = today(), days = {}, n = 0;
    h.forEach(function (x) { days[x.d] = 1; });
    while (days[day - n]) n++;
    if (!n && days[day - 1]) { n = 0; while (days[day - 1 - n]) n++; }
    return n;
  }

  /* Everything the learner did this week, for the one quiet line at the foot
   * of the Games page. */
  function weekSummary() {
    var all = load(), day = today(), plays = 0, records = 0, bestRun = 0;
    Object.keys(all).forEach(function (k) {
      (all[k].history || []).forEach(function (h) {
        if (day - h.d > 6) return;
        plays++;
        if (h.s === all[k].pb && all[k].pbDay != null && day - all[k].pbDay <= 6) records++;
      });
      bestRun = Math.max(bestRun, all[k].bestRun || 0);
    });
    return { plays: plays, records: Math.min(records, plays), bestRun: bestRun };
  }

  // Thousands separators, because 8420 and 8,420 are not the same number to read.
  function fmt(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  return {
    BANDS: BANDS, MAX_RUNG: MAX_RUNG, BAND_VALUE: BAND_VALUE,
    bandForRung: bandForRung, bandIndex: bandIndex, ceilingRung: ceilingRung,
    baseValue: baseValue, award: award, nextRung: nextRung, limitFor: limitFor,
    stats: stats, record: record, pb: pb, todayBest: todayBest, nearMissScore: nearMissScore,
    dailySeed: dailySeed, dailyKey: dailyKey, dailyLabel: dailyLabel, dailyStreak: dailyStreak,
    weekSummary: weekSummary, today: today, fmt: fmt
  };
})();
