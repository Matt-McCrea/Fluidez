// Long-running driver: keeps the browser open and takes action batches over HTTP.
// usage: node serve.mjs <profile> <port> [--desktop]   then  curl -s -X POST localhost:<port> -d '<actions json>'
import { createRequire } from 'node:module';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
const require = createRequire(new URL('../../package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const ROOT = process.env.PLAYTEST_DIR ?? new URL('./.runs/', import.meta.url).pathname;
const [profile, portArg, ...flags] = process.argv.slice(2);
const desktop = flags.includes('--desktop');
const userDataDir = path.join(ROOT, 'profiles', profile);
const shotDir = path.join(ROOT, 'shots', profile);
mkdirSync(shotDir, { recursive: true });
let shotN = Number((existsSync(path.join(shotDir, '.n')) && readFileSync(path.join(shotDir, '.n'), 'utf8')) || 0);

const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  viewport: desktop ? { width: 1280, height: 800 } : { width: 390, height: 844 },
  isMobile: !desktop, hasTouch: !desktop, deviceScaleFactor: desktop ? 1 : 2,
  serviceWorkers: 'block',
});
let page = ctx.pages()[0] ?? (await ctx.newPage());
let out = [];
const log = (...a) => { out.push(a.join(' ')); };
page.on('pageerror', (e) => log('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error') log('CONSOLE', m.type(), m.text().slice(0, 300)); });

async function mainText() {
  const main = page.locator('main');
  if (await main.count()) return (await main.innerText()).replace(/\n{3,}/g, '\n\n').trim();
  return (await page.locator('body').innerText()).trim();
}
async function shot(label) {
  shotN++;
  const file = path.join(shotDir, `${String(shotN).padStart(3, '0')}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}.png`);
  await page.screenshot({ path: file, fullPage: true });
  writeFileSync(path.join(shotDir, '.n'), String(shotN));
  log(`[shot ${file}]`);
}
async function dump(label = '') {
  const t = await mainText();
  log(`----- ${label} [${page.url().replace(/^https?:\/\/[^/]+/, '')}] -----\n${t.replace(/^(á|é|í|ó|ú|ñ|ü|¿|¡)\n/gm, '')}\n-----`);
}
const memFile = path.join(shotDir, 'memory.json');
const memory = existsSync(memFile) ? JSON.parse(readFileSync(memFile, 'utf8')) : {};
const norm = (s) => s.trim().replace(/\s+/g, ' ');
function remember(k, v) { if (k && v) { memory[norm(k)] = norm(v); } }
const ASKS = ['What does this mean?', 'How do you say this in Spanish?', 'Type the meaning in English', 'Read and pick', 'Which one says this?', 'Type the form', 'Choose the right form'];
function promptOf(lines) {
  for (let i = 0; i < lines.length; i++) if (ASKS.includes(lines[i]) || /^\d+ of \d+$/.test(lines[i]) && ASKS.includes(lines[i + 1])) { const j = ASKS.includes(lines[i]) ? i + 1 : i + 2; return lines[j]; }
  return lines[1];
}
function learnFrom(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const iNew = lines.indexOf('New');
  if (iNew >= 0 && lines[iNew + 1] && lines[iNew + 2]) { remember(lines[iNew + 2], lines[iNew + 1]); remember(lines[iNew + 1], lines[iNew + 2]); }
  for (const l of lines) {
    let m;
    if ((m = l.match(/^Here's the right version: (.+)$/))) remember(promptOf(lines), m[1]);
    if ((m = l.match(/^(?:Not quite|No problem)\. It's (.+?)\.?$/))) remember(promptOf(lines), m[1]);
    if ((m = l.match(/^"(.+)" is (.+)$/))) remember(m[1], m[2]);
    if ((m = l.match(/^(.+) means "(.+)"\.?$/))) remember(m[1], m[2]);
    if ((m = l.match(/^(.+) → (.+)$/))) remember(m[1], m[2]);
  }
  writeFileSync(memFile, JSON.stringify(memory, null, 1));
}
async function tapOnce(policy = 'first', fillText = 'no sé', preferPrimary = false) {
  if (preferPrimary) {
    const p = page.locator('main [data-primary]:not([data-home]):enabled').first();
    if (await p.isVisible().catch(() => false)) { const t = await p.textContent(); await p.click({ timeout: 3000 }).catch(() => {}); return `primary*="${t?.trim()}"`; }
  }
  const options = page.locator('main .option:not([disabled])');
  const n = await options.count();
  if (n > 0) {
    const labels = (await options.allTextContents()).map(norm);
    let idx = policy === 'last' ? n - 1 : policy === 'random' ? Math.floor(Math.random() * n) : 0;
    if (policy === 'learn') {
      const lines = (await mainText()).split('\n').map((l) => l.trim()).filter(Boolean);
      const want = memory[norm(promptOf(lines) ?? '')];
      const hit = want ? labels.findIndex((l) => l === want || l.replace(/[.!?¿¡]/g, '') === want.replace(/[.!?¿¡]/g, '')) : -1;
      idx = hit >= 0 ? hit : Math.floor(Math.random() * n);
    }
    await options.nth(idx).click({ timeout: 3000 }).catch(() => {});
    return `option[${idx}/${n}]="${labels[idx]}"`;
  }
  const spot = page.locator('main .spot button:not([disabled])').first();
  if (await spot.isVisible().catch(() => false)) { const t = await spot.textContent(); await spot.click({ timeout: 3000 }).catch(() => {}); return `spot="${t?.trim()}"`; }
  const field = page.locator('main .field:not([disabled])').first();
  if (await field.isVisible().catch(() => false)) {
    const v = await field.inputValue();
    if (!v.trim()) {
      let text = fillText;
      if (policy === 'learn') { const lines = (await mainText()).split('\n').map((l) => l.trim()).filter(Boolean); text = memory[norm(promptOf(lines) ?? '')] ?? fillText; }
      await field.fill(text, { timeout: 3000 }).catch(() => {});
      return `fill="${text}"`;
    }
  }
  const primary = page.locator('main [data-primary]:not([data-home]):enabled').first();
  if (await primary.isVisible().catch(() => false)) { const t = await primary.textContent(); await primary.click({ timeout: 3000 }).catch(() => {}); return `primary="${t?.trim()}"`; }
  const chip = page.locator('main .chip:not(.on)').first();
  if (await chip.isVisible().catch(() => false)) { const t = await chip.textContent(); await chip.click({ timeout: 3000 }).catch(() => {}); return `chip="${t?.trim()}"`; }
  return null;
}

async function run(actions) {
  for (const a of actions) {
    try {
      if (a.goto) { await page.goto(a.goto, { waitUntil: 'networkidle' }); await page.waitForTimeout(a.wait ?? 500); log(`goto ${a.goto}`); }
      else if (a.clock) { await page.clock.setFixedTime(new Date(a.clock)); log(`clock ${a.clock}`); }
      else if (a.realclock) { await page.clock.setSystemTime(new Date(a.realclock)); await page.clock.resume?.().catch(() => {}); log(`realclock ${a.realclock}`); }
      else if (a.reload) { await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(500); log('reload'); }
      else if (a.newpage) { page = await ctx.newPage(); log('new page'); }
      else if (a.viewport) { await page.setViewportSize(a.viewport); log(`viewport ${JSON.stringify(a.viewport)}`); }
      else if (a.click) { await page.locator(a.click).first().click({ timeout: 5000 }); await page.waitForTimeout(a.wait ?? 300); log(`click ${a.click}`); }
      else if (a.button) { await page.getByRole('button', { name: a.button, exact: a.exact ?? false }).first().click({ timeout: 5000 }); await page.waitForTimeout(a.wait ?? 300); log(`button "${a.button}"`); }
      else if (a.text) { await page.getByText(a.text, { exact: a.exact ?? false }).first().click({ timeout: 5000 }); await page.waitForTimeout(a.wait ?? 300); log(`text "${a.text}"`); }
      else if (a.fill !== undefined) { const f = page.locator(a.sel ?? 'main .field:not([disabled])').first(); await f.fill(a.fill, { timeout: 5000 }); log(`fill "${a.fill}"`); }
      else if (a.type !== undefined) { const f = page.locator(a.sel ?? 'main .field:not([disabled])').first(); await f.click(); await page.keyboard.type(a.type, { delay: 20 }); log(`type "${a.type}"`); }
      else if (a.press) { await page.keyboard.press(a.press); await page.waitForTimeout(300); log(`press ${a.press}`); }
      else if (a.shot) { await shot(a.shot); }
      else if (a.dump) { await dump(typeof a.dump === 'string' ? a.dump : ''); }
      else if (a.wait) { await page.waitForTimeout(a.wait); }
      else if (a.eval) { const r = await page.evaluate(a.eval); log(`eval => ${JSON.stringify(r)?.slice(0, 6000)}`); }
      else if (a.tap) {
        const n = a.tap === true ? 1 : a.tap;
        let lastHeading = '';
        let stale = false;
        for (let i = 0; i < n; i++) {
          if (a.stopAtHome && (await page.locator('[data-home]').isVisible().catch(() => false))) { log('[home button visible: session over]'); break; }
          const before = await mainText();
          const h = before.split('\n')[0];
          if (a.shots && h !== lastHeading) { await shot(h); lastHeading = h; }
          if (a.shotMatch && new RegExp(a.shotMatch).test(before)) await shot('match-' + h);
          const did = await tapOnce(a.policy ?? 'first', a.fillText, stale);
          if (!did) { log('[nothing tappable]'); await dump('stuck'); break; }
          await page.waitForTimeout(a.delay ?? 250);
          const after = await mainText();
          stale = after === before;
          if (a.policy === 'learn') learnFrom(after);
          if (a.verbose) log(`\n=== step ${i + 1}: ${did}\n${after === before ? '(unchanged)' : after.replace(/^(á|é|í|ó|ú|ñ|ü|¿|¡)\n/gm, '')}`);
          else log(`step ${i + 1}: ${did} | ${after.split('\n').filter(Boolean).slice(0, 3).join(' / ').slice(0, 160)}`);
          if (a.until && (await page.locator(a.until).first().isVisible().catch(() => false))) { log(`[until ${a.until} reached]`); await dump('until'); break; }
          if (a.untilText && after.includes(a.untilText)) { log(`[untilText "${a.untilText}" reached]`); await dump('until'); break; }
        }
      }
    } catch (e) {
      log(`ERROR on ${JSON.stringify(a)}: ${e.message.split('\n')[0]}`);
      await dump('at error');
    }
  }
}

createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', async () => {
    out = [];
    try { await run(JSON.parse(body || '[]')); } catch (e) { out.push('FATAL ' + e.message); }
    res.end(out.join('\n') + '\n');
  });
}).listen(Number(portArg));
console.log(`serving ${profile} on ${portArg}`);
