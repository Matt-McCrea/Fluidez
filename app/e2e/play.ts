// Playing a session in the browser the way a learner might: tap the first
// option, type something plausible, press the main button.
import type { Page } from '@playwright/test';

export const LONG = 'Hola, buenos días. Me llamo Matt. Soy de Toronto. Vivo en Bogotá y trabajo en un café. Es mi amiga Ana, es de Cali y es profesora.';

/** Play whatever is on screen until the close screen shows. Answers are honest guesses: some right, many wrong. */
export interface PlayHooks {
  onScreen?: (heading: string) => Promise<void>;
  /** called before a pick card's option is tapped; returns nothing */
  beforeOption?: () => Promise<void>;
  /** called right after an option was tapped (the card now shows its answer) */
  afterOption?: () => Promise<void>;
}

export async function playSession(page: Page, hooksOrScreen?: PlayHooks | ((heading: string) => Promise<void>)): Promise<string[]> {
  const hooks: PlayHooks = typeof hooksOrScreen === 'function' ? { onScreen: hooksOrScreen } : hooksOrScreen ?? {};
  const onScreen = hooks.onScreen;
  const seen: string[] = [];
  for (let step = 0; step < 600; step++) {
    if (await page.locator('[data-home]').isVisible()) return seen;
    const h = (await page.locator('main h2').allTextContents())[0];
    if (h && seen[seen.length - 1] !== h) seen.push(h);
    if (onScreen) {
      await onScreen(h ?? seen[seen.length - 1] ?? '');
      if (await page.locator('[data-home]').isVisible()) return seen;
    }

    const option = page.locator('main .option:not([disabled])').first();
    if (await option.isVisible().catch(() => false)) {
      await hooks.beforeOption?.();
      await option.click({ timeout: 3000 }).catch(() => {});
      await hooks.afterOption?.();
      continue;
    }

    // the "spot it" tap in a teaching card (plain buttons, not options)
    const spot = page.locator('main .spot button:not([disabled])').first();
    if (await spot.isVisible().catch(() => false)) { await spot.click({ timeout: 3000 }).catch(() => {}); continue; }

    const field = page.locator('main .field:not([disabled])').first();
    if (await field.isVisible().catch(() => false)) {
      const v = await field.inputValue();
      const multiline = await field.evaluate((el) => el.tagName === 'TEXTAREA');
      if (!v.trim()) { await field.fill(multiline ? LONG : 'Soy de Toronto', { timeout: 3000 }).catch(() => {}); continue; }
    }
    const primary = page.locator('main [data-primary]:not([data-home]):enabled').first();
    if (await primary.isVisible().catch(() => false)) { await primary.click({ timeout: 3000 }).catch(() => {}); continue; }
    const chip = page.locator('main .chip:not(.on)').first();
    if (await chip.isVisible().catch(() => false)) { await chip.click({ timeout: 3000 }).catch(() => {}); continue; }
    await page.waitForTimeout(100);
  }
  throw new Error(`session did not finish; last screens: ${seen.slice(-5).join(' | ')}`);
}


/** One tap of whatever is on screen (option, spot-it, field, main button, chip). False when nothing was tappable. */
export async function tapOnce(page: Page, scope = 'main'): Promise<boolean> {
  const option = page.locator(`${scope} .option:not([disabled])`).first();
  if (await option.isVisible().catch(() => false)) { await option.click({ timeout: 3000 }).catch(() => {}); return true; }
  const spot = page.locator(`${scope} .spot button:not([disabled])`).first();
  if (await spot.isVisible().catch(() => false)) { await spot.click({ timeout: 3000 }).catch(() => {}); return true; }
  const field = page.locator(`${scope} .field:not([disabled])`).first();
  if (await field.isVisible().catch(() => false)) {
    const v = await field.inputValue();
    if (!v.trim()) { await field.fill('Soy de Toronto', { timeout: 3000 }).catch(() => {}); return true; }
  }
  const primary = page.locator(`${scope} [data-primary]:not([data-home]):enabled`).first();
  if (await primary.isVisible().catch(() => false)) { await primary.click({ timeout: 3000 }).catch(() => {}); return true; }
  const chip = page.locator(`${scope} .chip:not(.on)`).first();
  if (await chip.isVisible().catch(() => false)) { await chip.click({ timeout: 3000 }).catch(() => {}); return true; }
  return false;
}
