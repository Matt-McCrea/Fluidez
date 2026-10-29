// The playtest, on the real course (?fixtures=0), on a phone: onboarding,
// session 1, session 2 (stopping early with "I need to stop"), and the
// placement check. Every distinct screen is saved under test-results/playtest
// for a human look, and every screen is checked for dashes.
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { playSession, tapOnce } from './play';

const DAY = 86_400_000;
const MIN = 60_000;
const T0 = new Date(2026, 9, 5, 18, 0, 0).getTime();
const OUT = 'test-results/playtest';

function shooter(page: Page, prefix: string) {
  mkdirSync(OUT, { recursive: true });
  const seen = new Set<string>();
  let n = 0;
  return async (label: string, force = false) => {
    const ask = (await page.locator('main .ask').allTextContents())[0] ?? '';
    const key = `${label}|${ask}`;
    // no dashes on any screen, ever
    const text = await page.locator('body').innerText();
    expect(text, `dash on screen "${label}"`).not.toMatch(/[—–]|\s-\s/);
    if (seen.has(key) && !force) return;
    seen.add(key);
    n++;
    const slug = `${label} ${ask}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
    await page.screenshot({ path: `${OUT}/${prefix}-${String(n).padStart(2, '0')}-${slug}.png`, fullPage: true });
  };
}

test('real content: onboarding, session 1, session 2 with an early stop', async ({ page }) => {
  await page.clock.setFixedTime(T0);
  await page.goto('/?fixtures=0');
  const shot = shooter(page, 'a');

  await expect(page.getByRole('heading', { name: 'Welcome to Fluidez' })).toBeVisible();
  await shot('welcome');
  await page.getByRole('button', { name: 'Get started' }).click();
  await shot('goal');
  await page.getByRole('radio', { name: 'Personal interest' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await shot('start');
  await page.locator('[data-zero]').click();

  // session 1
  await expect(page.locator('[data-label]')).toBeVisible();
  await shot('home');
  await page.locator('[data-start]').click();
  const s1 = await playSession(page, (h) => shot(`s1 ${h}`));
  expect(s1.length).toBeGreaterThan(1);
  await shot('s1 close', true);
  await page.locator('[data-home]').click();

  // session 2, next day: a few screens in, eleven minutes pass, and the learner needs to stop
  await page.clock.setFixedTime(T0 + DAY);
  await page.reload();
  await expect(page.locator('[data-label]')).toBeVisible();
  await shot('home day 2', true);
  await page.locator('[data-start]').click();
  await expect(page.locator('[data-left]')).toBeVisible();
  await shot('s2 start');
  await page.clock.setFixedTime(T0 + DAY + 11 * MIN);
  // any answer re-renders the session top: the stop option is there now
  for (let k = 0; k < 40 && !(await page.locator('[data-stop]').isVisible()); k++) {
    const option = page.locator('main .option:not([disabled])').first();
    if (await option.isVisible().catch(() => false)) { await option.click(); continue; }
    const primary = page.locator('main [data-primary]:enabled').first();
    if (await primary.isVisible().catch(() => false)) { await primary.click(); continue; }
    const field = page.locator('main .field:not([disabled])').first();
    if (await field.isVisible().catch(() => false)) { await field.fill('no sé'); continue; }
  }
  await expect(page.locator('[data-stop]')).toBeVisible();
  await shot('s2 stop offered', true);
  await page.locator('[data-stop]').click();
  await expect(page.locator('[data-left]')).toHaveText(/Stopping after this part/);
  for (let k = 0; k < 400 && !(await page.getByRole('heading', { name: 'Good place to stop' }).isVisible()); k++) {
    const option = page.locator('main .option:not([disabled])').first();
    if (await option.isVisible().catch(() => false)) { await option.click().catch(() => {}); continue; }
    const field = page.locator('main .field:not([disabled])').first();
    if (await field.isVisible().catch(() => false) && !(await field.inputValue())) { await field.fill('Soy de Toronto').catch(() => {}); continue; }
    const primary = page.locator('main [data-primary]:enabled').first();
    if (await primary.isVisible().catch(() => false)) { await primary.click().catch(() => {}); continue; }
    await page.waitForTimeout(50);
  }
  await expect(page.getByRole('heading', { name: 'Good place to stop' })).toBeVisible();
  await shot('s2 stopped', true);
  await page.getByRole('button', { name: 'Back home' }).click();
  await expect(page.getByRole('heading', { name: 'Nice work today' })).toBeVisible();
  await shot('home after stop', true);
  await page.getByRole('button', { name: 'Settings' }).click();
  await shot('settings', true);
  await expect(page.getByText('Daily practice')).toHaveCount(0);
});

test('real content: the placement check', async ({ page }) => {
  await page.clock.setFixedTime(T0);
  await page.goto('/?fixtures=0');
  const shot = shooter(page, 'b');
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('radio', { name: 'Travel' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('[data-some]').click();
  let asked = 0;
  for (; asked < 20 && await page.getByRole('heading', { name: 'Quick check' }).isVisible(); asked++) {
    await shot(`probe ${asked}`);
    // a learner who knows the first unit well and little else: right on unit-1 items is unknown here, so tap the first option
    const options = page.locator('main [data-option]');
    if (!(await options.count())) break;
    await options.first().click();
  }
  expect(asked).toBeGreaterThanOrEqual(4);
  expect(asked).toBeLessThanOrEqual(15);
  await expect(page.getByRole('button', { name: 'Start learning' })).toBeVisible();
  await shot('placed', true);
  await page.getByRole('button', { name: 'Start learning' }).click();
  await expect(page.locator('[data-label]')).toBeVisible();
  await shot('home after placement', true);
});

// ---------------------------------------------------------------------------
// Ten consecutive days on the real course, then the reference, free practice
// and the story. Deterministic: a fixed learner id and a seeded Math.random.

const norm = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();

test('real content: ten sessions, then look up, practice, story', async ({ page }) => {
  test.setTimeout(480_000);
  const problems: string[] = [];
  // open product findings, reported but not failing the run (see the playtest report)
  const known: string[] = [];
  const consoleErrors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  await page.addInitScript(() => {
    // fixed learner id and a seeded Math.random, so the run repeats
    try { crypto.randomUUID = () => '00000000-0000-4000-8000-000000000001'; } catch { /* keep the real one */ }
    let a = 0x9e3779b9;
    Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  });
  await page.clock.setFixedTime(T0);
  await page.goto('/?fixtures=0');
  const shot = shooter(page, 'c');

  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('radio', { name: 'Personal interest' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('[data-zero]').click();

  // PLAYTEST_SESSIONS=3 shortens the run while debugging the tail of the test
  const SESSIONS = Number(process.env.PLAYTEST_SESSIONS ?? 10);
  for (let day = 0; day < SESSIONS; day++) {
    const n = day + 1;
    await page.clock.setFixedTime(T0 + day * DAY);
    if (day > 0) await page.reload();
    await expect(page.locator('[data-label]'), `session ${n}: home`).toBeVisible();
    if (day === 0 || day === SESSIONS - 1) await shot(`home day ${n}`, true);
    await page.locator('[data-start]').click();

    let sawWrong = false;
    let prompt = '';
    let unsureMissing = 0;
    const screens = await playSession(page, {
      onScreen: (h) => shot(`session ${h}`), // one picture per screen type, not per day
      beforeOption: async () => {
        if (!(await page.locator('main [data-option]').count())) return; // not a pick card (self-check, spot-it)
        if (!(await page.locator('main [data-unsure]').isVisible().catch(() => false))) unsureMissing++;
        prompt = await page.evaluate(() => {
          const c = document.querySelector('main section.card');
          if (!c) return '';
          const k = c.cloneNode(true) as HTMLElement;
          k.querySelectorAll('.options, .feedback, .actions').forEach((e) => e.remove());
          return k.innerText;
        });
      },
      afterOption: async () => {
        if (!prompt) return;
        const right = (await page.locator('main .option.right').first().innerText().catch(() => '')).trim();
        if (await page.locator('main .option.wrong').count()) sawWrong = true;
        const r = norm(right);
        if (r.length >= 4 && ` ${norm(prompt)} `.includes(` ${r} `)) problems.push(`session ${n}: answer "${right}" is inside its prompt "${prompt.replace(/\s+/g, ' ').slice(0, 120)}"`);
        prompt = '';
      },
    });

    // the session finished on the close screen
    await expect(page.getByRole('heading', { name: 'Done for today' }), `session ${n}: close screen`).toBeVisible();
    // the bar is full
    const bar = page.locator('[role=progressbar][aria-label="Session progress"]');
    expect(await bar.getAttribute('aria-valuenow'), `session ${n}: bar`).toBe(await bar.getAttribute('aria-valuemax'));
    // the first-time line
    await expect(page.locator('main'), `session ${n}: first-time line`).toContainText(/\d+ of \d+ right first time\./);
    // no block errored
    await expect(page.getByText('Something went wrong'), `session ${n}: error screen`).toHaveCount(0);
    expect(screens.join('|')).not.toMatch(/warmup|structuredInput|controlledOutput|cuedProduction|readingCheck|sceneRerun|timedRecall|selfCheck/);
    // the recap, when something was missed
    if (sawWrong && !screens.includes('Before you go')) problems.push(`session ${n}: a miss, but no "Before you go" (${screens.join(' | ')})`);
    if (unsureMissing) problems.push(`session ${n}: ${unsureMissing} pick cards without "I don't know"`);
    if (n === 1 || n === SESSIONS) await shot(`session ${n} close`, true);
    await page.locator('[data-home]').click();

    if (n === 7 || n === SESSIONS) {
      // the retention line needs reviews of items at least 7 days old, so with one session a day it cannot
      // show before session 8; it is logged after 7 and asserted after the last session
      await page.getByRole('button', { name: 'Progress' }).click();
      await shot(`progress after ${n}`, true);
      const delayed = await page.locator('[data-delayed]').innerText();
      console.log(`after session ${n}: ${delayed}`);
      if (n === SESSIONS && SESSIONS >= 10 && /Not enough yet/.test(delayed)) problems.push(`after session ${n} the retention line says "${delayed}"`);
      await page.getByRole('button', { name: 'Home' }).click();
    }
  }

  // ---- Look up
  await page.getByRole('button', { name: 'Look up' }).click();
  await shot('reference', true);
  const search = page.getByLabel('Search the reference');
  await search.fill('pudimos');
  await expect(page.locator('main')).toContainText('poder');
  await shot('reference verb pudimos', true);
  await search.fill('me gusta');
  await page.getByRole('tab', { name: /^Grammar/ }).click();
  // "Practise this" must lead to cards (or, for something whose examples are beyond reach, say so honestly).
  const backToLookUp = async (q: string, tab: RegExp) => {
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await page.getByRole('button', { name: 'Look up' }).click();
    await page.getByLabel('Search the reference').fill(q);
    await page.getByRole('tab', { name: tab }).click();
  };
  const emptyRun = async () => {
    await page.locator('[data-clock], h2:has-text("Not yet"), h2:has-text("Nothing to practise yet")').first().waitFor();
    return !(await page.locator('[data-clock]').isVisible());
  };
  const entries = page.locator('main details.entry');
  await expect(entries.first(), 'a grammar entry for "me gusta"').toBeVisible();
  let practised = false;
  for (let i = 0; i < Math.min(await entries.count(), 4) && !practised; i++) {
    const entry = entries.nth(i);
    const title = (await entry.locator('summary').innerText()).trim();
    await entry.locator('summary').click();
    if (i === 0) await shot('reference grammar entry', true);
    await entry.getByRole('button', { name: 'Practise this' }).click();
    if (await emptyRun()) {
      expect(await page.locator('main').innerText(), `"${title}" explains why there is nothing to practise`).toContain('comes up in week');
      await backToLookUp('me gusta', /^Grammar/);
    } else practised = true;
  }
  if (!practised) {
    const empties: string[] = [];
    for (let i = 0; i < 12 && !practised; i++) {
      await page.getByLabel('Search the reference').fill('');
      await page.getByRole('tab', { name: /^Words/ }).click();
      if (i === 0) await shot('reference words', true);
      const btn = page.getByRole('button', { name: /^Practise / }).nth(i);
      const label = await btn.getAttribute('aria-label');
      await btn.click();
      if (await emptyRun()) {
        empties.push(label ?? String(i));
        await page.getByRole('button', { name: 'Done', exact: true }).click();
        await page.getByRole('button', { name: 'Look up' }).click();
      } else practised = true;
    }
    expect(empties, 'no word opens an empty run').toEqual([]);
    expect(practised, 'some word could be practised').toBe(true);
  }
  await expect(page.locator('[data-clock]')).toBeVisible();
  for (let k = 0; k < 12 && await page.locator('[data-clock]').isVisible(); k++) await tapOnce(page);
  await shot('practise this', true);
  await page.getByRole('button', { name: 'Finish now' }).click().catch(() => {});
  await expect(page.locator('[data-score]')).toBeVisible();
  await shot('practise done', true);
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  // ---- Home: Quick review
  await page.getByRole('button', { name: 'Home' }).click();
  await page.locator('[data-quick]').click();
  await expect(page.locator('[data-clock]')).toBeVisible();
  const until = Date.now() + 60_000;
  let answered = 0;
  while (Date.now() < until && answered < 25 && await page.locator('[data-clock]').isVisible()) { if (await tapOnce(page)) answered++; else await page.waitForTimeout(50); }
  await shot('quick review', true);
  await page.getByRole('button', { name: 'Finish now' }).click();
  await expect(page.locator('[data-score]')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  // ---- Verb workout
  await page.locator('[data-more-practice]').click();
  await shot('more practice', true);
  await page.locator('[data-workout]').click();
  await expect(page.locator('[data-clock]')).toBeVisible();
  for (let k = 0; k < 20 && await page.locator('[data-clock]').isVisible(); k++) await tapOnce(page);
  await shot('verb workout', true);
  await page.getByRole('button', { name: 'Finish now' }).click();
  await expect(page.locator('[data-score]')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  // ---- Story reread
  await page.getByRole('button', { name: 'Story' }).click();
  await shot('story', true);
  await page.locator('.chapters .row').first().click();
  await expect(page.getByText('Re-reading')).toBeVisible();
  for (let k = 0; k < 60 && !(await page.locator('.chapters').isVisible()); k++) { if (!(await tapOnce(page))) await page.waitForTimeout(50); if (k === 2) await shot('story reread', true); }
  await expect(page.locator('.chapters')).toBeVisible();

  console.log(`console errors (${consoleErrors.length}):\n${[...new Set(consoleErrors)].join('\n')}`);
  for (const k of known) test.info().annotations.push({ type: 'known issue', description: k });
  console.log(`known issues:\n${known.join('\n')}`);
  expect(problems, problems.join('\n')).toEqual([]);
});
