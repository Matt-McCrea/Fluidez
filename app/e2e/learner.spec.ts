// One learner, one week of the fixture unit, on a 390×844 phone:
// onboarding → a session of every lesson type the fixtures allow (one day
// apart, plus a "Do another") → reload → everything persisted → offline
// reload still works.
import { expect, test, type Page } from '@playwright/test';

const DAY = 86_400_000;
const T0 = new Date(2026, 9, 5, 18, 0, 0).getTime();
const LONG = 'Hola, buenos días. Me llamo Matt. Soy de Toronto. Vivo en Bogotá y trabajo en un café. Es mi amiga Ana, es de Cali y es profesora.';

/** Play whatever is on screen until the close screen shows. Answers are honest guesses: some right, many wrong. */
async function playSession(page: Page): Promise<string[]> {
  const seen: string[] = [];
  for (let step = 0; step < 600; step++) {
    if (await page.locator('[data-home]').isVisible()) return seen;
    const h = (await page.locator('main h2').allTextContents())[0];
    if (h && seen[seen.length - 1] !== h) seen.push(h);

    const option = page.locator('main .option:not([disabled])').first();
    if (await option.isVisible().catch(() => false)) { await option.click({ timeout: 3000 }).catch(() => {}); continue; }

    const field = page.locator('main .field:not([disabled])').first();
    if (await field.isVisible().catch(() => false)) {
      const v = await field.inputValue();
      const multiline = await field.evaluate((el) => el.tagName === 'TEXTAREA');
      if (!v.trim()) { await field.fill(multiline ? LONG : 'Soy de Toronto', { timeout: 3000 }).catch(() => {}); continue; }
    }
    const primary = page.locator('main [data-primary]:enabled').first();
    if (await primary.isVisible().catch(() => false)) { await primary.click({ timeout: 3000 }).catch(() => {}); continue; }
    const chip = page.locator('main .chip:not(.on)').first();
    if (await chip.isVisible().catch(() => false)) { await chip.click({ timeout: 3000 }).catch(() => {}); continue; }
    await page.waitForTimeout(100);
  }
  throw new Error(`session did not finish; last screens: ${seen.slice(-5).join(' | ')}`);
}

test('fixtures: onboarding → a week of lessons → reload → offline', async ({ page, context }) => {
  await page.clock.setFixedTime(T0);
  await page.goto('/?fixtures=force');

  // onboarding
  await page.getByRole('button', { name: "Let's start" }).click();
  await page.getByRole('radio', { name: 'Travel in Latin America' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('radio', { name: /20 minutes/ }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('[data-zero]').click();

  // the service worker is in place before we rely on it
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });

  const labels: string[] = [];
  let day = 0;
  let usedAnother = false;
  while (labels.length < 7) { // the fixture unit is seven days; "Do another" takes the next day's lesson
    await expect(page.locator('[data-label]')).toBeVisible();
    labels.push((await page.locator('[data-label]').textContent())!.trim());
    const start = page.locator('[data-start], [data-another]').first();
    await start.click();
    const screens = await playSession(page);
    expect(screens.length, `${labels.join(' | ')} :: ${screens.join(' | ')}`).toBeGreaterThan(1);
    // no internal block names ever reached the screen
    for (const s of screens) expect(s).not.toMatch(/warmup|structuredInput|controlledOutput|cuedProduction|readingCheck|sceneRerun|timedRecall|selfCheck/);
    // "Do another" once, on the first day, when the compiler allows it
    if (!usedAnother && await page.locator('[data-another]').isVisible()) {
      usedAnother = true;
      await page.locator('[data-another]').click();
      await expect(page.locator('[data-home]')).toBeHidden();
      labels.push('(another)');
      await playSession(page);
    }
    await page.locator('[data-home]').click();
    day++;
    await page.clock.setFixedTime(T0 + day * DAY);
    await page.reload();
  }
  const all = labels.join(' | ');
  expect(all).toMatch(/New: /);
  expect(all).toMatch(/Practice: |\(another\)/); // the drill is the "Do another" when that is offered
  expect(all).toMatch(/Story time: /);
  expect(all).toMatch(/Patterns/);
  expect(all).toMatch(/Real conversation/);
  expect(all).toMatch(/Catch-up mix|Check-in/);

  // persisted across a reload: no onboarding, the course moved on, progress counted
  await page.reload();
  await expect(page.getByRole('heading', { name: /Hola|Nice work/ })).toBeVisible();
  await page.getByRole('button', { name: 'Progress' }).click();
  const sessions = Number(await page.locator('[data-stat="sessions"]').textContent());
  expect(sessions).toBe(labels.length); // seven days plus the "Do another"
  expect(Number(await page.locator('[data-stat="read"]').textContent())).toBeGreaterThan(50);
  expect(Number(await page.locator('[data-stat="written"]').textContent())).toBeGreaterThan(10);
  await page.getByRole('button', { name: 'Story' }).click();
  await expect(page.locator('.chapters li')).toHaveCount(2);

  // offline: the whole app (content chunks included) comes from the service worker
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Hola|Nice work/ })).toBeVisible();
  await page.getByRole('button', { name: 'Story' }).click();
  await page.locator('.chapters .row').first().click();
  await expect(page.getByText('Re-reading')).toBeVisible();
  await context.setOffline(false);
});

test('real content: onboarding and two sessions', async ({ page }) => {
  await page.clock.setFixedTime(T0);
  await page.goto('/?fixtures=0');
  await page.getByRole('button', { name: "Let's start" }).click();
  await page.getByRole('radio', { name: 'Just for me' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('[data-zero]').click();
  for (let d = 0; d < 2; d++) {
    await expect(page.locator('[data-label]')).toBeVisible();
    await page.locator('[data-start], [data-another]').first().click();
    const screens = await playSession(page);
    expect(screens.length).toBeGreaterThan(1);
    await page.locator('[data-home]').click();
    await page.clock.setFixedTime(T0 + (d + 1) * DAY);
    await page.reload();
  }
  await page.getByRole('button', { name: 'Progress' }).click();
  await expect(page.locator('[data-stat="sessions"]')).toHaveText('2');
});
