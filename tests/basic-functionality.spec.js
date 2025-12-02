import { test, expect } from '@playwright/test';

/**
 * Basic functionality tests for Hair At Home website
 * Tests core navigation, page elements, and responsive design
 */
test.describe('Hair At Home - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1313/hairathome/');
  });

   test('page loads correctly with proper title', async ({ page }) => {
     await expect(page).toHaveTitle(/Hair At Home/);
   });

   test('navigation menu is present and functional', async ({ page }) => {
     const navMenu = page.locator('#nav-menu');
     await expect(navMenu).toBeVisible();

     const navLinks = page.locator('.nav-link');
     await expect(navLinks).toHaveCount(5);

     // Test navigation links
     const expectedLinks = ['Home', 'About', 'Services', 'Gallery', 'Book Now'];
     for (let i = 0; i < expectedLinks.length; i++) {
       await expect(navLinks.nth(i)).toHaveText(expectedLinks[i]);
     }
   });

   test('hero section displays correctly', async ({ page }) => {
     const heroSection = page.locator('.hero');
     await expect(heroSection).toBeVisible();

     const heroTitle = page.locator('.hero-content h1');
     await expect(heroTitle).toContainText('Professional Hair Styling');

     const heroButtons = page.locator('.hero-buttons .btn');
     await expect(heroButtons).toHaveCount(2);
   });

   test('mobile hamburger menu works on small screens', async ({ page }) => {
     // Set mobile viewport
     await page.setViewportSize({ width: 375, height: 667 });

     const hamburger = page.locator('#hamburger');
     await expect(hamburger).toBeVisible();

     // Test menu toggle
     await hamburger.click();
     const navMenu = page.locator('#nav-menu');
     await expect(navMenu).toHaveClass(/active/);
    await expect(navMenu).toHaveClass(/active/);
    
    await hamburger.click();
    await expect(navMenu).not.toHaveClass(/active/);
  });

  test('all sections are present on the page', async ({ page }) => {
    const sections = [
      '.hero',
      '.about',
      '.services',
      '.gallery',
      '.testimonials',
      '.booking',
      '.winnipeg-areas',
      '.faq',
      'footer'
    ];
    
    for (const section of sections) {
      await expect(page.locator(section)).toBeVisible();
    }
  });

  test('contact information is displayed', async ({ page }) => {
    const phone = page.locator('footer').getByText('(204) 555-0123');
    const email = page.locator('footer').getByText('info@hairathome.ca');
    
    await expect(phone).toBeVisible();
    await expect(email).toBeVisible();
  });
});