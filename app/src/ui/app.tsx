// The app shell: boot (learner, UI store, content), first-run onboarding,
// and the four places: Home, Story, Progress, Settings, plus the session
// player full-screen.
import { useEffect, useState } from 'preact/hooks';
import type { Mode } from '../compiler';
import { IdbStore, Learner, type LearnerStore } from '../learner';
import type { KV } from '../learner';
import { ContentLoader, loadBundle } from './data/loader';
import { Ctx, type AppCtx } from './context';
import { Home } from './screens/home';
import { Onboarding } from './screens/onboarding';
import { Progress } from './screens/progress';
import { Session } from './screens/session';
import { Settings } from './screens/settings';
import { Story } from './screens/story';
import { UiStore } from './store/ui';
import { MORE_MINUTES } from './session/more';

type Tab = 'home' | 'story' | 'progress' | 'settings';
type Route = { tab: Tab } | { session: Mode; key: number; cap?: number };

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
  const learnerStore = opts.learnerStore ?? new IdbStore(opts.kv);
  const now = opts.now ?? Date.now;
  const [learner, ui] = await Promise.all([Learner.open(learnerStore, { now }), new UiStore(opts.kv).load()]);
  const loader = opts.loader ?? new ContentLoader();
  const { units } = await loader.core();
  const band = units.slice().sort((a, b) => a.id.localeCompare(b.id))[ui.path.unit]?.band;
  const bundle = await loadBundle(loader, { band, fixtures: opts.fixtures });
  try { await globalThis.navigator?.storage?.persist?.(); } catch { /* not granted: fine */ }
  return { learner, learnerStore, ui, bundle, loader, now };
}

export function App({ opts }: { opts?: BootOptions }) {
  const [ctx, setCtx] = useState<AppCtx | null>(null);
  const [error, setError] = useState<string | null>(null);
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
          const band = c.bundle.course.units[c.ui.path.unit]?.band;
          if (c.bundle.fixture || !band) return;
          c.bundle = await loadBundle(c.loader, { band, fixtures: opts?.fixtures });
          refresh();
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
      setCtx(c);
    } catch (e) {
      setError((e as Error).message || String(e));
    }
  };

  useEffect(() => { void start(); }, []);
  useEffect(() => {
    const on = () => setUpdate(true);
    window.addEventListener('fluidez:update', on);
    return () => window.removeEventListener('fluidez:update', on);
  }, []);

  if (error) return <main class="screen" id="main"><h1>Something went wrong</h1><p>{error}</p><button class="btn primary" onClick={() => location.reload()}>Try again</button></main>;
  if (!ctx) return <main class="screen loading" id="main" aria-busy="true"><p>Loading…</p></main>;

  const goHome = () => { setRoute({ tab: 'home' }); void ctx.reloadBundle(); };
  let body;
  if (!ctx.ui.state.onboarded) {
    body = <Onboarding onDone={() => { setRoute({ tab: 'home' }); ctx.refresh(); }} />;
  } else if ('session' in route) {
    body = (
      <Session
        key={route.key} mode={route.session} onExit={goHome} capMinutes={route.cap}
        onAnother={() => setRoute({ session: 'another', key: ++sessionSeq, cap: MORE_MINUTES })}
      />
    );
  } else {
    const tab = route.tab;
    body = (
      <>
        {tab === 'home' ? <Home onStart={(m) => setRoute({ session: m, key: ++sessionSeq })} onStory={() => setRoute({ tab: 'story' })} /> : null}
        {tab === 'story' ? <Story /> : null}
        {tab === 'progress' ? <Progress /> : null}
        {tab === 'settings' ? <Settings /> : null}
        <nav class="tabs" aria-label="Main">
          {(['home', 'story', 'progress', 'settings'] as Tab[]).map((t) => (
            <button key={t} class={`tab${tab === t ? ' on' : ''}`} aria-current={tab === t ? 'page' : undefined} onClick={() => setRoute({ tab: t })}>
              {{ home: 'Home', story: 'Story', progress: 'Progress', settings: 'Settings' }[t]}
            </button>
          ))}
        </nav>
      </>
    );
  }
  return (
    <Ctx.Provider value={ctx}>
      <a class="skip" href="#main">Skip to content</a>
      {update ? (
        <div class="update" role="status">
          A new version is ready. <button class="btn link" onClick={() => window.dispatchEvent(new CustomEvent('fluidez:apply-update'))}>Update</button>
        </div>
      ) : null}
      {body}
    </Ctx.Provider>
  );
}
