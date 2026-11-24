import { expect, test } from '@playwright/test';
import { pagesURL } from './playwright.config.mjs';

for (const width of [390, 1440]) {
  test(`keeps every animation step inside its code panels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(pagesURL);
    await expect(page.getByText('This demo uses API Contract Kit', { exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See auto-generated docs' })).toHaveAttribute('href', './openapi/');

    const animation = page.frameLocator('iframe');
    const steps = animation.locator('.timeline-step');
    await expect(steps).toHaveCount(8);
    let checkedKeyboardScroll = false;

    for (let step = 0; step < 8; step++) {
      await steps.nth(step).click();
      await expect(animation.locator('.progress')).toHaveText(`${step + 1}/8`);
      await expect(animation.locator('.shiki-magic-move-container').first()).toBeVisible();
      const layout = await animation.locator('.workspace').evaluate(workspace => ({
        pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        codeFits: [...workspace.querySelectorAll('.code-scroll')].every(panel => {
          const card = panel.closest('article').getBoundingClientRect();
          const bounds = panel.getBoundingClientRect();
          return card.left <= bounds.left && bounds.right <= card.right
            && (panel.scrollWidth <= panel.clientWidth || getComputedStyle(panel).overflowX === 'auto');
        }),
      }));
      expect(layout, `Step ${step + 1}`).toEqual({ pageFits: true, codeFits: true });

      const panels = animation.locator('.code-scroll');
      for (const panel of await panels.all()) {
        const isScrollable = await panel.evaluate(element => element.scrollWidth > element.clientWidth);
        if (isScrollable && !checkedKeyboardScroll) {
          await panel.focus();
          await page.keyboard.press('ArrowRight');
          await expect.poll(() => panel.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
          checkedKeyboardScroll = true;
        }
      }
    }
    if (width === 390) expect(checkedKeyboardScroll).toBe(true);
  });
}
