// Render what a learner placed at unit N sees over a few sessions, using the app's own
// headless test driver (same card builders and runner as the UI). Read-only.
// usage: npx vite-node tools/playtest/render.ts <unit> <days> [right|wrong]
import { ContentLoader } from '../../src/ui/data/loader';
import { applyPlacement } from '../../src/ui/session/placement';
import { world, session } from '../../tests/ui/driver';

const [unitArg, daysArg, moodArg] = process.argv.slice(2);
const unit = Number(unitArg ?? 20);
const days = Number(daysArg ?? 2);
const mood = (moodArg ?? 'right') as 'right' | 'wrong';
const DAY = 86_400_000;

const w = await world();
const bundle = await new ContentLoader().load({ unit: unit - 1 });
(w as any).bundle = bundle;
const path = applyPlacement(w.learner, bundle, unit - 1, w.now());
await w.ui.setPath(path);
console.log(`# placed at unit ${unit}; path.unit=${path.unit} day=${(path as any).day}`);

for (let d = 1; d <= days; d++) {
  const r = await session(w, mood);
  const p = r.plan;
  console.log(`\n\n=========== DAY ${d}: type=${p.type} est=${p.estimatedMinutes}min budget=${p.budget.minutes} played=${r.minutes.toFixed(1)}min blocks=${p.blocks.map((b) => b.kind).join(',')}`);
  console.log(`new nodes: ${JSON.stringify(p.newNodes)}`);
  for (const d of (p as any).diagnostics ?? []) console.log(`diag [${d.code}] ${d.message ?? ''}`);
  let i = 0;
  for (const c of r.walk.cards) {
    i++;
    if (c.type === 'read') { console.log(`${i}. [read] ${c.es}  //  ${c.en}`); continue; }
    const prompt = typeof c.prompt === 'string' ? c.prompt : (c.prompt as any)?.text ?? JSON.stringify(c.prompt);
    const cue = (c as any).cue ? `  (cue: ${typeof (c as any).cue === 'string' ? (c as any).cue : (c as any).cue.text})` : '';
    if (c.type === 'mcq') {
      const opts = c.options.map((o, k) => `${k === c.answer ? '*' : ' '}${o.text}`).join(' | ');
      console.log(`${i}. [mcq] ${c.ask}: ${prompt}${cue}\n     ${opts}\n     why: ${c.why ?? ''}`);
    } else {
      const ans = c.check('zzz qqq').answer;
      const hint = c.check('zzz qqq').hint ?? '';
      console.log(`${i}. [type] ${c.ask}: ${prompt}${cue}\n     answer: ${ans}   | hint on junk: ${hint}\n     why: ${c.why ?? ''}`);
    }
  }
  if (r.walk.failures.length) console.log('FAILURES', r.walk.failures);
  w.clock.t += DAY;
}
