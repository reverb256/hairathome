import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Haircuts');
});

test('dark mode toggle works', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('#theme-toggle');
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  // Click the "See Services" button in hero section which works on both desktop and mobile
  await page.click('a[href="#services"]:visible');
  // Check if scrolled to services (section exists)
  await expect(page.locator('#services')).toBeVisible();
});

test('service pages load', async ({ page }) => {
  await page.goto('/services/');
  await expect(page.locator('h1')).toContainText('What We Offer');

  // Click the "View All Services" link on homepage instead
  await page.goto('/');
  await page.click('a[href="/services/"]');
  await expect(page.locator('h1')).toContainText('What We Offer');
});

test('mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  const menuBtn = page.locator('#mobile-menu-btn');
  await menuBtn.click();

  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
});

test('about page loads', async ({ page }) => {
  await page.goto('/about/');
  // Check for any heading (h1, h2, or h3) since about page uses markdown with h2 as first heading
  await expect(page.locator('h1, h2, h3').first()).toBeVisible();
});

test('contact link works', async ({ page }) => {
  await page.goto('/');
  const contactLink = page.locator('a[href="tel:+12045572287"]').first();
  await expect(contactLink).toBeVisible();
});
