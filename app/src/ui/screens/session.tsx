// The session player: one block at a time, a calm progress bar, and a way
// out. Content shown is recorded as each block opens; finishing the core
// advances the path; leaving early does not.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Mode } from '../../compiler';
import { BlockView } from '../blocks';
import { Close } from '../blocks/writing';
import { Continue } from '../components/card';
import { Bar, Heading } from '../components/text';
import { useApp } from '../context';
import { anotherAllowed, compilePlan, SessionRunner } from '../session/runner';

export function Session({ mode, onExit, onAnother }: { mode: Mode; onExit: () => void; onAnother: () => void }) {
  const app = useApp();
  const runner = useMemo(() => {
    const plan = compilePlan(app.learner, app.bundle, app.ui, { mode, now: app.now() });
    return new SessionRunner(app.learner, app.bundle, app.ui, plan, app.now);
  }, []);
  const plan = runner.plan;
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [another, setAnother] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  /** the block index an advance is in flight from: a double tap must not skip a block */
  const advancing = useRef<number | null>(null);
  const block = plan.blocks[idx];
  const coreBlocks = plan.blocks.filter((b) => b.kind !== 'close').length;

  useEffect(() => { runner.start(); }, []);
  useEffect(() => {
    if (block && block.kind !== 'close') runner.blockShown(block);
    top.current?.scrollIntoView({ block: 'start' });
    window.scrollTo(0, 0);
  }, [idx]);

  const next = async (from: number) => {
    if (advancing.current === from || from !== idx) return;
    advancing.current = from;
    const n = from + 1;
    if (n >= plan.blocks.length || plan.blocks[n].kind === 'close') {
      setFinishing(true);
      await runner.finish();
      setAnother(anotherAllowed(app.learner, app.bundle, app.ui, app.now()));
      setFinishing(false);
      app.refresh();
    }
    setIdx(n);
  };

  const leave = async () => { await runner.abandon(); onExit(); };

  return (
    <div class="session" ref={top}>
      <div class="session-top">
        <button class="btn icon" aria-label="Leave this session" onClick={() => (runner.finished ? onExit() : setLeaving(true))}>✕</button>
        <Bar value={Math.min(idx, coreBlocks)} of={coreBlocks} label="Session progress" />
      </div>
      <main class="session-main" id="main">
        {finishing ? <p class="small" aria-live="polite">Saving…</p> : null}
        {!block ? (
          <>
            <Heading title="Done for today" />
            <div class="actions"><Continue label="Back home" onClick={onExit} /></div>
          </>
        ) : block.kind === 'close' ? (
          <Close block={block} run={runner} ui={app.ui} onDone={onExit} another={another} onAnother={onAnother} onHome={onExit} />
        ) : finishing ? null : (
          <BlockView key={idx} block={block} run={runner} ui={app.ui} onDone={() => void next(idx)} />
        )}
      </main>
      {leaving ? (
        <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="leave-title">
          <div class="sheet">
            <h2 id="leave-title">Leave this session?</h2>
            <p>What you've practised is saved, but today's lesson won't count as done. You can start it again from home.</p>
            <div class="actions stack">
              <button class="btn primary" onClick={() => setLeaving(false)} autoFocus>Keep going</button>
              <button class="btn quiet" data-leave onClick={() => void leave()}>Leave</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
