// The app shell: boot (learner, UI store, content), first-run onboarding,
// and the four places: Home, Story, Progress, Settings, plus the session
// player full-screen.
import { Component, type ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import type { Mode } from '../compiler';
import { IdbStore, idbKV, Learner, type LearnerStore } from '../learner';
import type { KV, Tier } from '../learner';
import { ContentLoader, loadBundle } from './data/loader';
import { Ctx, type AppCtx } from './context';
import { Home } from './screens/home';
import { Onboarding } from './screens/onboarding';
import { Practice } from './screens/practice';
import { Progress } from './screens/progress';
import { Reference } from './screens/reference';
import { Session } from './screens/session';
import { Settings } from './screens/settings';
import { Story } from './screens/story';
import { Weak } from './screens/weak';
import type { PracticeSpec } from './session/practice-spec';
import { UiStore, type SavedSession } from './store/ui';
import { MORE_MINUTES } from './session/more';

type Tab = 'home' | 'story' | 'reference' | 'progress' | 'settings' | 'weak';
type Route = { tab: Tab; open?: string } | { session: Mode; key: number; cap?: number; resume?: SavedSession; tier?: Tier; quick?: boolean } | { practice: PracticeSpec | undefined; key: number };

/** Each session start gets a fresh key, so "Do another" always mounts a new player. */
let sessionSeq = 0;

export interface BootOptions {
  kv?: KV;
  learnerStore?: LearnerStore;
  loader?: ContentLoader;
  fixtures?: boolean;
  now?: () => number;
}

export async function boot(opts: BootOptions = {}): Promise<Omit<AppCtx, 'refresh' | 'reloadBundle' | 'resetAll'>> {
  const kv = opts.kv ?? idbKV();  // one KV for learner and UI, so a session save can be one transaction
  const learnerStore = opts.learnerStore ?? new IdbStore(kv);
  const now = opts.now ?? Date.now;
  const [learner, ui] = await Promise.all([Learner.open(learnerStore, { now }), new UiStore(kv).load()]);
  await ui.reconcile(learner.sessionIndex);
  const loader = opts.loader ?? new ContentLoader();
  const { units } = await loader.core();
  const bundle = await loadBundle(loader, { unit: Math.min(ui.path.unit, Math.max(0, units.length - 1)), fixtures: opts.fixtures });
  try { await globalThis.navigator?.storage?.persist?.(); } catch { /* not granted: fine */ }
  return { learner, learnerStore, ui, bundle, loader, now };
}

/** Why boot failed, for the screen. A stored document from a newer build says so (`fault`), and an update is the way out. */
export function bootTrouble(e: unknown): { message: string; newer: boolean } {
  return { message: (e as Error)?.message || String(e), newer: (e as { fault?: unknown } | null)?.fault === 'newer' };
}

/** The screen for something that went wrong: what happened, and the ways out, which the caller supplies. */
export function Trouble({ message, detail, children }: { message: string; detail?: string; children: ComponentChildren }) {
  return (
    <main class="screen" id="main">
      <h1>Something went wrong</h1>
      <p>{message}</p>
      {detail ? <p class="small">{detail}</p> : null}
      <div class="actions">{children}</div>
    </main>
  );
}

/**
 * A screen that throws while it draws must not leave a blank page. The tabs are
 * part of what it replaces, so Home is offered here, and Reload for the rest.
 */
export class ErrorBoundary extends Component<{ onHome: () => void; children?: ComponentChildren }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: unknown) { return { error: error instanceof Error ? error : new Error(String(error)) }; }
  componentDidCatch(error: unknown) { console.error('fluidez: a screen failed', error); }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <Trouble message="That screen couldn't be shown." detail={error.message}>
        <button class="btn primary" data-home onClick={() => { this.setState({ error: undefined }); this.props.onHome(); }}>Back to Home</button>
        <button class="btn quiet" data-reload onClick={() => location.reload()}>Reload</button>
      </Trouble>
    );
  }
}

export function App({ opts }: { opts?: BootOptions }) {
  const [ctx, setCtx] = useState<AppCtx | null>(null);
  const [error, setError] = useState<{ message: string; newer: boolean } | null>(null);
  const [route, setRoute] = useState<Route>({ tab: 'home' });
  const [, setTick] = useState(0);
  const [update, setUpdate] = useState(false);

  const start = async () => {
    try {
      const base = await boot(opts);
      const refresh = () => setTick((t) => t + 1);
      const c: AppCtx = {
        ...base,
        refresh,
        reloadBundle: async () => {
          if (c.bundle.fixture || !c.bundle.course.units.length) return;
          const unit = Math.min(c.ui.path.unit, c.bundle.course.units.length - 1);
          if (await c.bundle.ensureWindow(unit)) refresh();
        },
        resetAll: async () => {
          await c.learnerStore.clear();
          await c.ui.reset();
          setCtx(null);
          setRoute({ tab: 'home' });
          await start();
        },
      };
      c.ui.subscribe(refresh);
      c.learner.onSaveProblem(refresh);
      setCtx(c);
    } catch (e) {
      setError(bootTrouble(e));
    }
  };

  useEffect(() => { void start(); }, []);
  useEffect(() => {
    const on = () => setUpdate(true);
    window.addEventListener('fluidez:update', on);
    return () => window.removeEventListener('fluidez:update', on);
  }, []);

  if (error) {
    return (
      <Trouble message={error.message}>
        {error.newer && update ? <button class="btn primary" data-update onClick={() => window.dispatchEvent(new CustomEvent('fluidez:apply-update'))}>Update</button> : null}
        <button class={`btn ${error.newer && update ? 'quiet' : 'primary'}`} onClick={() => location.reload()}>Try again</button>
      </Trouble>
    );
  }
  if (!ctx) return <main class="screen loading" id="main" aria-busy="true"><p>Loading your Spanish</p></main>;

  const toPractice = (spec: PracticeSpec) => setRoute({ practice: spec, key: ++sessionSeq });
  const goHome = () => { setRoute({ tab: 'home' }); void ctx.reloadBundle(); };
  let body;
  if (!ctx.ui.state.onboarded) {
    body = <Onboarding onDone={() => { setRoute({ tab: 'home' }); ctx.refresh(); }} />;
  } else if ('session' in route) {
    body = (
      <Session
        key={route.key} mode={route.session} onExit={goHome} capMinutes={route.cap} tier={route.tier} quick={route.quick} resume={route.resume} onPractise={toPractice}
        onAnother={() => setRoute({ session: 'another', key: ++sessionSeq, cap: MORE_MINUTES })}
      />
    );
  } else if ('practice' in route) {
    body = <Practice key={route.key} spec={route.practice} onDone={goHome} />;
  } else {
    const tab = route.tab;
    body = (
      <>
        {tab === 'home' ? <Home onStart={(m, o) => setRoute({ session: m, key: ++sessionSeq, ...(o && 'plan' in o ? { resume: o } : o) })} onLook={(open) => setRoute({ tab: 'reference', open })} onStory={() => setRoute({ tab: 'story' })} onWeak={() => setRoute({ tab: 'weak' })} onPractise={(spec) => setRoute({ practice: spec, key: ++sessionSeq })} /> : null}
        {tab === 'story' ? <Story onPractise={toPractice} /> : null}
        {tab === 'reference' ? <Reference onPractise={toPractice} open={route.open} /> : null}
        {tab === 'progress' ? <Progress onPractise={toPractice} /> : null}
        {tab === 'settings' ? <Settings /> : null}
        {tab === 'weak' ? <Weak onPractise={toPractice} onBack={goHome} /> : null}
        <nav class="tabs" aria-label="Main">
          {(['home', 'story', 'reference', 'progress', 'settings'] as Exclude<Tab, 'weak'>[]).map((t) => (
            <button key={t} class={`tab${tab === t ? ' on' : ''}`} aria-current={tab === t ? 'page' : undefined} onClick={() => setRoute({ tab: t })}>
              {{ home: 'Home', story: 'Story', reference: 'Look up', progress: 'Progress', settings: 'Settings' }[t]}
            </button>
          ))}
        </nav>
      </>
    );
  }
  body = <ErrorBoundary onHome={goHome}>{body}</ErrorBoundary>;
  return (
    <Ctx.Provider value={ctx}>
      <a class="skip" href="#main">Skip to content</a>
      {update ? (
        <div class="update" role="status">
          A new version is ready. <button class="btn link" onClick={() => window.dispatchEvent(new CustomEvent('fluidez:apply-update'))}>Update</button>
        </div>
      ) : null}
      {ctx.learner.saveProblem ? <div class="update" role="status" data-save-problem>{ctx.learner.saveProblem}</div> : null}
      {body}
    </Ctx.Provider>
  );
}
