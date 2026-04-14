const { test, expect } = require('@playwright/test');

test.describe('Forms', () => {
  test('should validate inquiry form and show success state', async ({ page }) => {
    await page.goto('/inquiry.html');

    const form = page.locator('#inquiryForm');
    const submitBtn = form.locator('button[type="submit"]');

    // Try submitting empty
    await submitBtn.click();
    await expect(form).toHaveClass(/was-validated/);

    // Fill required fields
    await page.fill('#inqName', 'John Doe');
    await page.fill('#inqCompany', 'Test Corp');
    await page.fill('#inqEmail', 'john@example.com');
    await page.fill('#inqCountry', 'USA');
    await page.selectOption('#inqProduct', 'terry-towels');

    // Submit again
    await submitBtn.click();

    // Check submitted state
    await expect(submitBtn).toHaveText(/Submitted/);
    await expect(submitBtn).toBeDisabled();

    // Wait for reset (3000ms in JS)
    await page.waitForTimeout(3500);
    await expect(submitBtn).not.toHaveText(/Submitted/);
    await expect(submitBtn).not.toBeDisabled();
    await expect(page.locator('#inqName')).toHaveValue('');
  });

  test('should validate contact form and show success state', async ({ page }) => {
    await page.goto('/contact.html');

    const form = page.locator('#contactForm');
    const submitBtn = form.locator('button[type="submit"]');

    // Fill required fields
    await page.fill('#contactName', 'Jane Doe');
    await page.fill('#contactEmail', 'jane@example.com');
    await page.fill('#contactSubject', 'Hello');
    await page.fill('#contactMessage', 'This is a test message');

    await submitBtn.click();

    await expect(submitBtn).toHaveText(/Submitted/);
    await expect(submitBtn).toBeDisabled();
  });
});
