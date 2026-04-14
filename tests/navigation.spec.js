const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('should highlight the active link in the navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-navbar .nav-link.active')).toHaveAttribute('href', 'index.html');

    await page.goto('/contact.html');
    await expect(page.locator('.site-navbar .nav-link.active')).toHaveAttribute('href', 'contact.html');

    await page.goto('/about.html');
    await expect(page.locator('.site-navbar .nav-link.active')).toHaveAttribute('href', 'about.html');
  });

  test('should auto-close mobile menu on link click', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile viewports');

    await page.goto('/');

    // Open the menu
    const toggler = page.locator('.navbar-toggler');
    await toggler.click();

    const navCollapse = page.locator('#mainNav');
    await expect(navCollapse).toHaveClass(/show/);

    // Click a link
    await page.locator('#mainNav .nav-link').first().click();

    // Verify it's closed (Bootstrap uses .collapsing then removes .show)
    await expect(navCollapse).not.toHaveClass(/show/);
  });
});
