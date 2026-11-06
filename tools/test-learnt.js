#!/usr/bin/env node
/* test-learnt.js — permanently learnt items in js/srs.js (owner's decision, 6 Nov 2026). */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const DAY = 86400000;
const BUNDLE = fs.readFileSync(path.join(ROOT, 'js/lib.bundle.js'), 'utf8');
const SRS_SRC = fs.readFileSync(path.join(ROOT, 'js/srs.js'), 'utf8');
let fails = 0;
function ok(c, m) { if (!c) { fails++; console.log('FAIL  ' + m); } else console.log('ok    ' + m); }
const clock = { t: Date.UTC(2026, 0, 5, 9, 0, 0) };
class FakeDate extends Date {
  constructor(...a) { if (a.length === 0) super(clock.t); else super(...a); }
  static now() { return clock.t; }
}
function world(store) {
  const sb = { Date: FakeDate, console, Math, JSON, Object, Array, String, Number, isFinite, parseInt, Promise,
    setTimeout: fn => { fn(); return 0; }, location: { search: '', hash: '' },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
  sb.window = sb; sb.Profile = { current: () => 'B1' };
  const ctx = vm.createContext(sb);
  vm.runInContext(BUNDLE, ctx); vm.runInContext(SRS_SRC, ctx);
  return sb;
}
const raw = s => JSON.parse(s['fluidez.srs'] || '{}');

{ // learn() leaves the due pool, counts as known
  const store = {}; const S = world(store).SRS;
  S.enrol('a'); ok(S.isDue('a'), 'enrolled card is due today');
  S.learn('a'); ok(S.isLearnt('a') && !S.isDue('a'), 'learn() makes it learnt and not due');
  S.learn('b'); ok(S.isLearnt('b') && raw(store).b.reps > 0 && raw(store).b.passed, 'learn() on an unseen id creates a known record');
  ok(S.dueCount([{ id: 'a' }, { id: 'b' }]) === 0, 'dueCount skips learnt');
  const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const batch = S.batch(pool, null, 5, false).map(x => x.id);
  ok(batch.join() === 'c', 'batch gives only the fresh item, not the learnt ones: ' + batch.join());
  ok(S.duePriority(pool).length === 0, 'duePriority skips learnt');
  ok(S.plan(pool, { fresh: true }).dueN === 0, 'plan dueN skips learnt');
  clock.t += 400 * DAY;
  ok(!S.isDue('a') && S.dueCount(pool) === 0, 'still not due 400 days later');
  clock.t -= 400 * DAY;
}
{ // rule (a)
  const store = {}; const S = world(store).SRS;
  S.grade('t1', true, { typed: true });
  ok(S.isLearnt('t1'), 'typed right with no earlier card -> learnt');
  S.enrol('t2'); S.grade('t2', true, { typed: true, fresh: true });
  ok(S.isLearnt('t2'), 'typed right, enrolled first but fresh:true -> learnt');
  S.grade('p1', true);
  ok(!S.isLearnt('p1'), 'tapped first-sight right -> not learnt');
  S.enrol('t3'); S.grade('t3', true, { typed: true });
  ok(!S.isLearnt('t3'), 'typed right on an existing card -> not learnt');
  S.grade('t4', false, { typed: true });
  ok(!S.isLearnt('t4'), 'typed wrong -> not learnt');
}
{ // rule (b)
  const store = {}; const S = world(store).SRS;
  S.grade('x', true); S.grade('y', true);
  clock.t += 100 * DAY; S.grade('x', true);
  ok(!S.isLearnt('x'), 'right after 100 days -> not learnt');
  clock.t += 180 * DAY; S.grade('y', true);
  ok(S.isLearnt('y'), 'right after 280 days -> learnt');
  clock.t += 180 * DAY; S.grade('x', true);
  ok(S.isLearnt('x'), 'right after exactly 180 days -> learnt');
  S.enrol('z'); S.grade('z', true); clock.t += 200 * DAY; S.grade('z', false);
  ok(!S.isLearnt('z'), 'wrong after 200 days -> not learnt');
}
{ // un-learn
  const store = {}; const S = world(store).SRS;
  S.learn('w'); const l0 = S.today();
  clock.t += 3 * DAY; S.grade('w', false);
  const r = raw(store).w;
  ok(!S.isLearnt('w') && r.learnt === undefined, 'wrong on a learnt card clears the flag');
  ok(r.lapses === 1 && r.due >= S.today() + 1 && r.due < S.today() + 3000, 'and it lapses to a normal due day (' + (r.due - S.today()) + ')');
  clock.t += 20 * DAY;
  ok(S.isDue('w') || r.due > S.today(), 'normal scheduling again');
  S.learn('v'); S.grade('v', true); ok(S.isLearnt('v') && !S.isDue('v'), 'right on a learnt card keeps it learnt');
  S.learn('u'); S.grade('u', true, { unsure: true }); ok(!S.isLearnt('u'), "'I don't know' on a learnt card un-learns it");
}
{ // migration keeps the field
  const store = { 'fluidez.srsSchema': '3', 'fluidez.srs': JSON.stringify({ 'v:casa': { box: 9, due: 40000, reps: 4, learnt: true, learntAt: 100, last: 90 } }) };
  const S = world(store).SRS;
  ok(S.isLearnt('v:casa:meaning') && !S.isDue('v:casa:meaning'), 'schema migration keeps learnt');
}
console.log(fails ? fails + ' FAILED' : 'all passed');
process.exit(fails ? 1 : 0);
