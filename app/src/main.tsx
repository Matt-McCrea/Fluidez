import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import './styles/app.css';
import { App } from './ui/app';

// Offline: the service worker installs the shell, the graph, the units, the
// contrast scripts and the first window of lessons on first load, and caches every
// other content chunk the first time it is used (tools/build/pwa.ts). A new
// version waits for the learner's OK so a session in progress is never reloaded
// under them.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() { window.dispatchEvent(new CustomEvent('fluidez:update')); },
});
window.addEventListener('fluidez:apply-update', () => { void updateSW(true); });

render(<App />, document.getElementById('app')!);
