// The session player: one block at a time, a calm progress bar with an
// honest "about N minutes left", and two ways out. Content shown is recorded
// as each block opens (card by card where a run may be cut short); finishing
// the core advances the path; "I need to stop" ends cleanly at the next block
// boundary without touching the streak; leaving outright does not advance.
// The session never runs much past its minutes: once over, optional blocks
// are skipped and card runs end early.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Block, Mode } from '../../compiler';
import { BlockView } from '../blocks';
import { Close } from '../blocks/writing';
import { Continue } from '../components/card';
import { Bar, Heading } from '../components/text';
import { useApp } from '../context';
import { compilePlan, SessionRunner, softBlock, STOP_AFTER_MINUTES, truncatable } from '../session/runner';
import { offerMore } from '../session/more';

export function Session({ mode, onExit, onAnother, capMinutes }: { mode: Mode; onExit: () => void; onAnother: () => void; capMinutes?: number }) {
  const app = useApp();
  const runner = useMemo(() => {
    const plan = compilePlan(app.learner, app.bundle, app.ui, { mode, now: app.now() });
    return new SessionRunner(app.learner, app.bundle, app.ui, plan, app.now, { capMinutes: capMinutes ? Math.min(capMinutes, plan.budget.minutes) : undefined });
  }, []);
  const plan = runner.plan;
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [more, setMore] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [stopAsked, setStopAsked] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [, setTick] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const openedAt = useRef(app.now());
  /** the block index an advance is in flight from: a double tap must not skip a block */
  const advancing = useRef<number | null>(null);
  const block = plan.blocks[idx];
  const coreBlocks = plan.blocks.filter((b) => b.kind !== 'close').length;

  useEffect(() => { runner.start(); }, []);
  useEffect(() => {
    openedAt.current = app.now();
    if (block && block.kind !== 'close') {
      if (truncatable(block)) runner.enter(block);
      else runner.blockShown(block);
    }
    top.current?.scrollIntoView({ block: 'start' });
    window.scrollTo(0, 0);
  }, [idx]);
  // the minutes-left line and the stop option follow the clock
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 20_000);
    return () => window.clearInterval(t);
  }, []);

  const closeIdx = plan.blocks.findIndex((b) => b.kind === 'close');
  const toClose = async () => {
    setFinishing(true);
    await runner.finish();
    setMore(offerMore(app.learner, app.bundle, app.ui, app.now()));
    setFinishing(false);
    app.refresh();
    setIdx(closeIdx >= 0 ? closeIdx : plan.blocks.length);
  };

  const next = async (from: number) => {
    if (advancing.current === from || from !== idx) return;
    advancing.current = from;
    // the blocks still to come; once over time, the optional ones go
    let n = from + 1;
    const rest = (k: number) => plan.blocks.slice(k).filter((b) => b.kind !== 'close');
    while (n < plan.blocks.length && plan.blocks[n].kind !== 'close') {
      const b = plan.blocks[n];
      if (softBlock(b) && runner.overBudget()) runner.skip(b);
      else if (b.kind === 'recap' && !stopAsked && !runner.openRecap(b)) { /* nothing to ask: skipped silently */ }
      else break;
      n++;
    }
    if (stopAsked) {
      // stop here: if only optional blocks are left the core is done and counts in full
      const left = rest(n);
      if (left.every(softBlock)) { left.forEach((b) => runner.skip(b)); await toClose(); return; }
      setFinishing(true);
      await runner.stop();
      setFinishing(false);
      setStopped(true);
      app.refresh();
      return;
    }
    if (n >= plan.blocks.length || plan.blocks[n].kind === 'close') { await toClose(); return; }
    setIdx(n);
  };

  const leave = async () => { await runner.abandon(); onExit(); };
  const elapsed = runner.elapsed();
  const left = block && block.kind !== 'close' ? Math.round(runner.minutesLeft(idx, openedAt.current)) : 0;
  const canStop = !runner.finished && !stopAsked && block && block.kind !== 'close' && elapsed >= STOP_AFTER_MINUTES;

  let body;
  if (stopped) {
    body = (
      <>
        <Heading title="Good place to stop" lead="Today counts. Your streak is safe." />
        <section class="card">
          <p>Everything you practised is saved. Next time you'll pick up right where you left off.</p>
        </section>
        <div class="actions"><Continue label="Back home" onClick={onExit} /></div>
      </>
    );
  } else if (finishing) {
    body = <p class="small" aria-live="polite">Saving…</p>;
  } else if (!block) {
    body = (
      <>
        <Heading title="Done for today" />
        <div class="actions"><Continue label="Back home" onClick={onExit} /></div>
      </>
    );
  } else if (block.kind === 'close') {
    body = <Close block={block} run={runner} ui={app.ui} onDone={onExit} more={more} onMore={onAnother} onHome={onExit} />;
  } else {
    body = <BlockView key={idx} block={block as Exclude<Block, { kind: 'close' }>} run={runner} ui={app.ui} onDone={() => void next(idx)} />;
  }

  return (
    <div class="session" ref={top}>
      <div class="session-top">
        <button class="btn icon" aria-label="Leave this session" onClick={() => (runner.finished ? onExit() : setLeaving(true))}>✕</button>
        <Bar value={stopped ? coreBlocks : Math.min(idx, coreBlocks)} of={coreBlocks} label="Session progress" />
      </div>
      {!runner.finished && block && block.kind !== 'close' ? (
        <div class="session-meta">
          <p class="small" data-left aria-live="off">
            {stopAsked ? "Stopping after this part." : left >= 2 ? `About ${left} minutes left` : 'Almost done'}
          </p>
          {canStop ? <button class="btn link small" data-stop onClick={() => setStopAsked(true)}>I need to stop</button> : null}
        </div>
      ) : null}
      <main class="session-main" id="main">{body}</main>
      {leaving ? (
        <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="leave-title">
          <div class="sheet">
            <h2 id="leave-title">Leave this session?</h2>
            <p>What you've practised is saved. If you finish this part first, today still counts.</p>
            <div class="actions stack">
              <button class="btn primary" onClick={() => setLeaving(false)} autoFocus>Keep going</button>
              <button class="btn quiet" data-stop-soon onClick={() => { setStopAsked(true); setLeaving(false); }}>Stop after this part</button>
              <button class="btn quiet" data-leave onClick={() => void leave()}>Leave now</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
