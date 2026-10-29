// The playtest, on the real course (?fixtures=0), on a phone: onboarding,
// session 1, session 2 (stopping early with "I need to stop"), and the
// placement check. Every distinct screen is saved under test-results/playtest
// for a human look, and every screen is checked for dashes.
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { playSession } from './play';

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
