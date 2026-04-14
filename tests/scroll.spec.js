const { test, expect } = require('@playwright/test');

test.describe('Scroll Effects', () => {
  test('should add "scrolled" class to navbar on scroll', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('.site-navbar');

    await expect(navbar).not.toHaveClass(/scrolled/);

    await page.evaluate(() => window.scrollTo(0, 100));
    // Need to wait a bit or use expect with polling/retry
    await expect(navbar).toHaveClass(/scrolled/);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(navbar).not.toHaveClass(/scrolled/);
  });

  test('should smooth scroll to internal anchors', async ({ page }) => {
    await page.goto('/');

    // The "Why Us" link in the home page (if any) or any # link
    // index.html has #why-us
    const anchorLink = page.locator('a[href="#why-us"]');
    if (await anchorLink.count() > 0) {
        await anchorLink.click();

        // Check if we scrolled. We can check window.scrollY
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);

        // Check if the target is in view
        const target = page.locator('#why-us');
        await expect(target).toBeInViewport();
    }
  });
});
