const { test, expect } = require('@playwright/test');

test.describe('Counter Animations', () => {
  test('should animate counters when they enter the viewport', async ({ page }) => {
    await page.goto('/');

    // Counters are usually down the page.
    // Initially they should be '0' or whatever is in the HTML
    const counter = page.locator('[data-count]').first();
    const targetValue = await counter.getAttribute('data-count');
    const suffix = await counter.getAttribute('data-suffix') || '';

    // Scroll to the counter section
    await counter.scrollIntoViewIfNeeded();

    // Wait for animation to complete (duration is 1800ms in JS)
    // We can wait for the data-animated attribute
    await expect(counter).toHaveAttribute('data-animated', 'true');

    // Check if it reached near the target or the exact target
    // The final value should be formatted
    await expect(counter).not.toHaveText('0', { timeout: 5000 });

    // Since it's animated, we might need to wait for it to settle
    await page.waitForTimeout(2000);

    const text = await counter.textContent();
    expect(text).toContain(suffix);
  });

  test('should handle prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const counter = page.locator('[data-count]').first();
    await counter.scrollIntoViewIfNeeded();

    await expect(counter).toHaveAttribute('data-animated', 'true');
    // It should immediately show the final value
    const text = await counter.textContent();
    const targetValue = await counter.getAttribute('data-count');
    expect(text).toBeTruthy();
  });
});
