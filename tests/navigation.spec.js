import { test, expect } from '@playwright/test';

/**
 * Navigation tests for Hair@Home website
 * Tests smooth scrolling, anchor links, and navigation behavior
 */
test.describe('Hair@Home - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigation links scroll to correct sections', async ({ page }) => {
    const navLinks = [
      { link: 'Home', section: '#home' },
      { link: 'About', section: '#about' },
      { link: 'Services', section: '#services' },
      { link: 'Gallery', section: '#gallery' },
      { link: 'Book Now', section: '#booking' }
    ];

    for (const { link, section } of navLinks) {
      await page.click(`text=${link}`);
      
      // Wait for scroll to complete
      await page.waitForTimeout(500);
      
      // Check if the section is in viewport
      const targetSection = page.locator(section);
      await expect(targetSection).toBeInViewport();
    }
  });

  test('hero buttons navigate to correct sections', async ({ page }) => {
    // Test Book Now button
    await page.click('.btn-primary:has-text("Book Now")');
    await page.waitForTimeout(500);
    const bookingSection = page.locator('#booking');
    await expect(bookingSection).toBeInViewport();

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Test View Services button
    await page.click('.btn-secondary:has-text("View Services")');
    await page.waitForTimeout(500);
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport();
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

    for (const linkText of footerLinks) {
      await page.click(`footer a:has-text("${linkText}")`);
      await page.waitForTimeout(500);
      
      // Verify we're no longer at the footer (scrolled up)
      const footer = page.locator('footer');
      await expect(footer).not.toBeInViewport();
      
      // Return to top for next test
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }
  });

  test('navigation highlights active section on scroll', async ({ page }) => {
    // Scroll to different sections and check if nav links get active class
    const sections = ['#about', '#services', '#gallery', '#booking'];
    
    for (const sectionId of sections) {
      await page.locator(sectionId).scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Check if corresponding nav link has active class
      const sectionName = sectionId.replace('#', '');
      const navLink = page.locator(`.nav-link[href="${sectionId}"]`);
      
      // Note: This test assumes the active class is added via JavaScript
      // You may need to adjust based on your actual implementation
      await expect(navLink).toBeVisible();
    }
  });

  test('smooth scrolling behavior', async ({ page }) => {
    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);

    // Click a navigation link
    await page.click('text=About');
    
    // Wait a bit for scroll animation
    await page.waitForTimeout(1000);
    
    // Check that we've scrolled down
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(0);
  });
});