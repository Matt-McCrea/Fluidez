// One learner, one week of the fixture unit, on a 390×844 phone:
// onboarding → a session of every lesson type the fixtures allow (one day
// apart, plus a "Do another") → reload → everything persisted → offline
// reload still works.
import { expect, test } from '@playwright/test';
import { playSession } from './play';

const DAY = 86_400_000;
const T0 = new Date(2026, 9, 5, 18, 0, 0).getTime();
test('fixtures: onboarding → a week of lessons → reload → offline', async ({ page, context }) => {
  await page.clock.setFixedTime(T0);
  await page.goto('/?fixtures=force');

  // onboarding
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('radio', { name: 'Travel' }).click();
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
    // "Keep going" once, when the close screen suggests it (a streak of 3 days, a light backlog)
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
  expect(all).toMatch(/Practice: /);
  expect(all).toMatch(/Story time: /);
  // day 3 is the first with a 3-day streak: the close screen suggests a few more minutes, and "Keep going" plays the patterns day
  expect(all).toMatch(/Patterns|\(another\)/);
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
