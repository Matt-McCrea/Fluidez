/* ============================================================================
 * ACCEPTED — translations the learner argued for, and won.
 *
 * A translation game can only mark what it has. The corpus knows several
 * Spanish renderings for some English and now accepts all of them
 * (js/gameitems.js, byEnglish), but no data file can hold every good
 * translation of "I'm going to the bank" — voy al banco, me voy al banco, voy
 * para el banco are all defensible and only one is written down.
 *
 * So rather than pretend to be complete, the app lets the learner say so. A
 * wrong answer offers "eso también vale"; tapping it accepts the answer for
 * that round and remembers it, so the same sentence is simply correct next
 * time. It is the same bargain as js/vetoed.js — the learner is allowed to
 * correct the app, and the correction sticks.
 *
 * WHY THIS IS NOT CHEATING. There is nothing to cheat: the only opponent is
 * your own previous score, and a learner who waves through answers they knew
 * were wrong is lying to a record only they will ever read. Against that: an
 * app that insists good Spanish is wrong teaches the learner to distrust it,
 * which is the more expensive failure by far.
 *
 * Stored per normalised English, which is the same key the corpus index uses,
 * so a claim made on one item applies wherever that English comes up.
 * ========================================================================== */
window.Accepted = (function () {
  var KEY = 'fluidez.accepted';
  var MAX_PER_KEY = 6;          // a prompt with seven "right" answers is a bad prompt

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  function forEnglish(key) {
    if (!key) return [];
    var o = load();
    return Object.prototype.hasOwnProperty.call(o, key) ? (o[key] || []) : [];
  }

  /* `en` is the raw English prompt; the key is derived the same way the corpus
   * derives it, so the two sets line up. */
  function add(en, spanish) {
    var GI = window.GameItems;
    if (!GI || !GI.enKey) return false;
    var key = GI.enKey(en), text = String(spanish || '').trim();
    if (!key || !text) return false;
    var o = load(), list = Object.prototype.hasOwnProperty.call(o, key) ? (o[key] || []) : [];
    if (list.indexOf(text) !== -1) return false;
    if (list.length >= MAX_PER_KEY) return false;
    list.push(text);
    o[key] = list;
    save(o);
    return true;
  }

  function all() {
    var o = load(), out = [];
    Object.keys(o).forEach(function (k) { (o[k] || []).forEach(function (es) { out.push({ en: k, es: es }); }); });
    return out;
  }

  function count() { return all().length; }
  function clearAll() { save({}); }

  return { forEnglish: forEnglish, add: add, all: all, count: count, clearAll: clearAll };
})();
