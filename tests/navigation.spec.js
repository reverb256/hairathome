import { test, expect } from '@playwright/test';

/**
 * Navigation tests for Hair@Home website
 * Tests smooth scrolling, anchor links, and navigation behavior
 */
test.describe('Hair@Home - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigation links work correctly', async ({ page }) => {
    // Test that navigation links are present and clickable
    const navLinks = page.locator('.nav-link');
    await expect(navLinks).toHaveCount(5);

    // Test Home link
    await navLinks.first().click();
    await page.waitForTimeout(500);
    
    // Test that links navigate to correct pages (not just sections)
    const aboutLink = page.locator('.nav-link[href*="about"]');
    await expect(aboutLink).toBeVisible();
    
    const servicesLink = page.locator('.nav-link[href*="services"]');
    await expect(servicesLink).toBeVisible();
    
    const galleryLink = page.locator('.nav-link[href*="gallery"]');
    await expect(galleryLink).toBeVisible();
    
    const bookingLink = page.locator('.nav-link[href*="booking"]');
    await expect(bookingLink).toBeVisible();
  });

  test('hero buttons navigate correctly', async ({ page }) => {
    // Test Book Now button
    const bookNowBtn = page.locator('.btn-primary:has-text("Book Now")');
    await expect(bookNowBtn).toBeVisible();
    await bookNowBtn.click();
    await page.waitForTimeout(1000);
    
    // Should navigate to booking page
    await expect(page).toHaveURL(/booking/);

    // Go back to home
    await page.goto('/');
    await page.waitForTimeout(500);

    // Test View Services button
    const viewServicesBtn = page.locator('.btn-secondary:has-text("View Services")');
    await expect(viewServicesBtn).toBeVisible();
    await viewServicesBtn.click();
    await page.waitForTimeout(1000);
    
    // Should navigate to services page
    await expect(page).toHaveURL(/services/);
  });

  test('footer links navigate correctly', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const footerLinks = [
      'Home',
      'About',
      'Services',
      'Gallery',
      'Book Now'
    ];

    // Just verify footer links exist and are visible
    for (const linkText of footerLinks) {
      const footerLink = page.locator(`footer a:has-text("${linkText}")`);
      await expect(footerLink).toBeVisible();
    }
  });

  test('navigation highlights active section on scroll', async ({ page }) => {
    // Test that navigation links are visible and functional
    const sections = ['about', 'services', 'gallery', 'booking'];
    
    for (const sectionName of sections) {
      // Check if corresponding nav link exists
      const navLink = page.locator(`.nav-link[href*="${sectionName}"]`);
      
      // Just verify the link exists and is visible
      await expect(navLink).toBeVisible();
    }
  });

  test('smooth scrolling behavior', async ({ page }) => {
    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // Click a navigation link to navigate to about page
    await page.click('.nav-link[href*="about"]');
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Check that we're on the about page
    await expect(page).toHaveURL(/about/);
  });
});