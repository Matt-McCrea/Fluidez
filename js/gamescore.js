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

  /* The ladder. Up one on a correct answer, down on a miss — asymmetric on
   * purpose, so a run of luck cannot park you above your actual level, and one
   * mistake at the top is a real setback without being a reset. A near miss
   * holds position: you knew the word.
   *
   * How far down depends on what the item COST. Minus two was written for
   * tapping one of four, where an item is three or four seconds and losing
   * two rungs costs eight; on a typed item at nine seconds the same penalty
   * costs eighteen, nearly a third of the round, for one slip of a thumb. A
   * guess is also worth punishing harder than an attempt: you can land a
   * four-way choice by luck, and you cannot type an imperfect subjunctive by
   * luck. So typing and building drop one, choosing and listening drop two. */
  function nextRung(rung, result, maxRung, play) {
    var cap = maxRung || MAX_RUNG;
    if (result === 'good') return Math.min(cap, rung + 1);
    if (result === 'near') return rung;
    var drop = (play === 'type' || play === 'build') ? 1 : 2;
    return Math.max(1, rung - drop);
  }

  /* Where a round STARTS: the bottom rung of the learner's own band.
   *
   * It used to start every round at rung 1 for everybody, which meant a B2
   * learner spent six correct answers climbing through A1 and A2 to reach
   * their own level. Measured against real typing speeds that is most of a
   * sixty-second round: a typed answer costs six to nine seconds including
   * reading and thinking, so a round is seven to ten items, and six of them
   * were the toll. On a phone, half of all rounds never reached B2 at all.
   *
   * This is not "sitting on easy items", which the ladder exists to prevent —
   * you still climb, a miss still drops you, and the ceiling is still one
   * band above you. It only stops charging you for the journey to your own
   * level every single time. The early rungs were never cheap to TYPE either
   * (an A1 answer averages 14 characters against 20 at B2); they were just
   * paid at 60 a go instead of 165. */
  function startRung() {
    var cefr = (window.Profile && window.Profile.params()) ? window.Profile.params().cefr : 'A1';
    return Math.max(1, bandIndex(cefr) * 2 + 1);
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

  function blank() {
    return { pb: 0, pbDay: null, plays: 0, bestCombo: 0, bestBand: null, bestRun: 0,
             seen: 0, right: 0, ms: 0, history: [] };
  }

  function stats(key) {
    var s = load()[key];
    if (!s) return blank();
    var out = blank();
    Object.keys(s).forEach(function (k) { out[k] = s[k]; });
    out.history = s.history || [];
    return out;
  }

  /* Evenly across TIME rather than across samples: answers cluster (a combo is
   * four in twelve seconds) and picking every nth sample would spend the
   * budget on the busy stretch and leave the quiet one unmapped. */
  function downsample(curve, n) {
    if (curve.length <= n) return curve.map(function (p) { return [p.t | 0, p.s | 0]; });
    var span = curve[curve.length - 1].t || 1, out = [];
    for (var i = 0; i < n; i++) {
      var want = span * (i / (n - 1)), best = curve[0];
      for (var j = 0; j < curve.length; j++) {
        if (Math.abs(curve[j].t - want) < Math.abs(best.t - want)) best = curve[j];
      }
      if (!out.length || out[out.length - 1][0] !== (best.t | 0)) out.push([best.t | 0, best.s | 0]);
    }
    return out;
  }

  /* The record round's score at `ms` into it, interpolated. Null when there is
   * no record to race — a first attempt has no ghost, and inventing a flat one
   * would be racing a fiction. */
  function ghostAt(key, ms) {
    var c = stats(key).curve;
    if (!c || c.length < 2) return null;
    if (ms <= c[0][0]) return c[0][1];
    for (var i = 1; i < c.length; i++) {
      if (ms <= c[i][0]) {
        var t0 = c[i - 1][0], t1 = c[i][0];
        var f = t1 === t0 ? 1 : (ms - t0) / (t1 - t0);
        return Math.round(c[i - 1][1] + (c[i][1] - c[i - 1][1]) * f);
      }
    }
    return c[c.length - 1][1];
  }
  function hasGhost(key) { var c = stats(key).curve; return !!(c && c.length >= 2); }

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
    if (isPb) {
      s.pb = r.score; s.pbDay = day;
      /* THE GHOST. Keep the shape of the record round, not just its total, so
       * the next attempt can be raced against it second by second. A score you
       * are chasing tells you whether you won at the end; a score you are
       * chasing IN TIME tells you whether you are winning now, which is the
       * difference between a leaderboard and an opponent.
       *
       * Downsampled to 24 points — enough to interpolate smoothly across a
       * two-minute round, and small enough that six games of it cost a couple
       * of kilobytes of a storage budget shared with the SRS. */
      if (r.curve && r.curve.length) s.curve = downsample(r.curve, 24);
    }

    /* HOW THE ROUND WENT, not just what it scored. The store kept the score
     * and nothing else, so nothing could answer the two questions a player
     * actually has — am I getting more accurate, and am I getting faster — and
     * a score conflates both with the difficulty you happened to be dealt.
     * Totals are lifetime; the per-round copies ride along in `history` so a
     * trend can be drawn. Old entries predate these fields and read as
     * undefined, which every consumer below treats as "not recorded". */
    s.seen = (s.seen || 0) + (r.seen || 0);
    s.right = (s.right || 0) + (r.right || 0);
    s.ms = (s.ms || 0) + (r.ms || 0);
    var entry = { d: day, s: r.score };
    if (r.seen) { entry.n = r.seen; entry.r = r.right || 0; }
    if (r.ms) entry.ms = r.ms;
    if (r.band) entry.b = r.band;
    s.history = (s.history || []).concat([entry]).slice(-60);
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

  /* What a player wants to know about a game, derived rather than stored, so
   * adding a question here never needs a migration. `null` where there is not
   * enough evidence yet — a number computed from two rounds is noise wearing a
   * decimal point, and showing it teaches people to distrust the screen. */
  function profileOf(key) {
    var st = stats(key);
    var h = (st.history || []).filter(function (x) { return x.n; });
    var recent = h.slice(-10);
    function acc(rows) {
      var n = 0, r = 0;
      rows.forEach(function (x) { n += x.n; r += x.r || 0; });
      return n >= 20 ? r / n : null;
    }
    var perMin = null;
    var timed = h.filter(function (x) { return x.ms; });
    if (timed.length >= 3) {
      var items = 0, ms = 0;
      timed.forEach(function (x) { items += x.n; ms += x.ms; });
      if (ms > 0) perMin = items / (ms / 60000);
    }
    return {
      plays: st.plays || 0,
      pb: st.pb || 0,
      bestBand: st.bestBand || null,
      bestCombo: st.bestCombo || 0,
      bestRun: st.bestRun || 0,
      accuracy: acc(h),
      recentAccuracy: acc(recent),
      perMin: perMin,
      scores: (st.history || []).map(function (x) { return x.s; }),
      /* The median of the last ten, not the average: one disastrous round
       * where the phone rang should not move the number you are chasing. */
      typical: recent.length >= 3 ? median(recent.map(function (x) { return x.s; })) : null
    };
  }
  function median(a) {
    var b = a.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(b.length / 2);
    return b.length % 2 ? b[m] : Math.round((b[m - 1] + b[m]) / 2);
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

  /* ---- "I can't listen right now" ------------------------------------------
   * A preference, not a per-round choice: somebody on a train without
   * headphones is not going to re-declare that on every tile. It hides the
   * listening game entirely and keeps spoken items out of every mixed round,
   * including the daily challenge.
   *
   * Kept in its own key rather than inside the per-game store, which is a map
   * of game -> record and would have to grow a guard in every loop over it. */
  var PREF_KEY = 'fluidez.gamePrefs';
  function prefs() { try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (e) { return {}; } }
  function silent() { return !!prefs().silent; }
  function setSilent(v) {
    var p = prefs();
    p.silent = !!v;
    try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch (e) {}
  }

  /* ---- the rating ----------------------------------------------------------
   * A personal best only moves when you beat it, so most rounds produce
   * nothing at all — which is the opposite of what makes a chess rating grip.
   * There, EVERY game moves the number, and it can go DOWN. That asymmetry is
   * the whole mechanic: losing 12 points stings about twice as much as gaining
   * 12 pleases, and it is why an ordinary round still matters.
   *
   * This is not XP and the difference is not cosmetic. XP only accumulates, so
   * it measures time served. A rating falls, so it measures how you are
   * playing now.
   *
   * The opponent is your own recent form. Each game keeps an expectation — an
   * exponential average of what you usually score at it — and a round is
   * scored against that, so the games stay comparable without having to
   * normalise a 60-second sprint against a 90-second one. The first round at
   * any game moves nothing: it sets the baseline, which also means a fresh
   * game cannot be farmed for rating. */
  var START_RATING = 1000, K = 32, FLOOR = 100;

  function rating() { var p = prefs(); return p.rating == null ? START_RATING : p.rating; }

  function rate(key, score) {
    var p = prefs();
    p.expect = p.expect || {};
    var prev = p.expect[key] || 0;
    var before = p.rating == null ? START_RATING : p.rating;
    var delta = 0;
    if (prev > 0) {
      // log2 of the ratio: half your usual is -1, double is +1, clamped there
      var perf = Math.log((score + 1) / (prev + 1)) / Math.LN2;
      delta = Math.round(K * Math.max(-1, Math.min(1, perf)));
    }
    p.expect[key] = prev ? Math.round(prev * 0.7 + score * 0.3) : score;
    p.rating = Math.max(FLOOR, before + delta);
    try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch (e) {}
    return { before: before, after: p.rating, delta: delta, first: !prev };
  }

  // When the tenses were last put through a retrieval round, so the prompt can
  // come round every few days instead of every time the app is opened.
  function lastTenseCheck() { var v = prefs().tenseDay; return v == null ? null : v; }
  /* Records the day AND which tenses were checked, so the next pick can ask
   * how long each one has actually been left alone rather than guessing from
   * a rotation. */
  function markTenseCheck(tenses) {
    var p = prefs();
    p.tenseDay = today();
    if (tenses && tenses.length) {
      p.tenseSeen = p.tenseSeen || {};
      tenses.forEach(function (t) { p.tenseSeen[t] = p.tenseDay; });
      // how many checks have actually been TAKEN — the cycle counts rounds,
      // not days, because the days a check lands on are not evenly spaced
      p.tenseRound = (p.tenseRound || 0) + 1;
    }
    try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch (e) {}
  }
  function tenseRound() { return prefs().tenseRound || 0; }
  function tenseSeen(t) {
    var o = prefs().tenseSeen || {};
    return Object.prototype.hasOwnProperty.call(o, t) ? o[t] : null;
  }

  // Thousands separators, because 8420 and 8,420 are not the same number to read.
  function fmt(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  return {
    BANDS: BANDS, MAX_RUNG: MAX_RUNG, BAND_VALUE: BAND_VALUE,
    bandForRung: bandForRung, bandIndex: bandIndex, ceilingRung: ceilingRung,
    startRung: startRung,
    baseValue: baseValue, award: award, nextRung: nextRung, limitFor: limitFor,
    stats: stats, record: record, pb: pb, todayBest: todayBest, nearMissScore: nearMissScore,
    profileOf: profileOf, ghostAt: ghostAt, hasGhost: hasGhost,
    dailySeed: dailySeed, dailyKey: dailyKey, dailyLabel: dailyLabel, dailyStreak: dailyStreak,
    weekSummary: weekSummary, today: today, fmt: fmt,
    silent: silent, setSilent: setSilent,
    rating: rating, rate: rate,
    lastTenseCheck: lastTenseCheck, markTenseCheck: markTenseCheck, tenseSeen: tenseSeen,
    tenseRound: tenseRound
  };
})();
