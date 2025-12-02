import { test, expect } from '@playwright/test';

/**
 * Responsive design tests for Hair At Home website
 * Tests website behavior across different screen sizes and devices
 */
test.describe('Hair At Home - Responsive Design', () => {
  const devices = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  devices.forEach(device => {
    test(`${device.name} layout displays correctly`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');

      // Test hero section
      const heroSection = page.locator('.hero');
      await expect(heroSection).toBeVisible();

      if (device.width <= 768) {
        // Mobile/tablet: hamburger menu should be visible
        const hamburger = page.locator('#hamburger');
        await expect(hamburger).toBeVisible();
        
        // Navigation menu should be hidden by default
        const navMenu = page.locator('#nav-menu');
        await expect(navMenu).not.toHaveClass(/active/);
      } else {
        // Desktop: full navigation should be visible
        const navMenu = page.locator('.nav-menu');
        await expect(navMenu).toBeVisible();
        
        const hamburger = page.locator('#hamburger');
        await expect(hamburger).not.toBeVisible();
      }
    });
  });

  test('mobile navigation menu functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hamburger = page.locator('#hamburger');
    const navMenu = page.locator('#nav-menu');

    // Menu should be hidden initially
    await expect(navMenu).not.toHaveClass(/active/);

    // Click to open menu
    await hamburger.click();
    await expect(navMenu).toHaveClass(/active/);

    // Click to close menu
    await hamburger.click();
    await expect(navMenu).not.toHaveClass(/active/);
  });

  test('services grid adapts to screen size', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const servicesGrid = page.locator('.services-grid');
    await expect(servicesGrid).toBeVisible();

    const serviceCards = page.locator('.service-card');
    await expect(serviceCards).toHaveCount(6);

    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(servicesGrid).toBeVisible();
    await expect(serviceCards).toHaveCount(6);
  });

  test('gallery grid is responsive', async ({ page }) => {
    await page.goto('/');
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const galleryGrid = page.locator('.gallery-grid');
    await expect(galleryGrid).toBeVisible();

    const galleryItems = page.locator('.gallery-item');
    await expect(galleryItems).toHaveCount(6);

    // Test on different screen sizes
    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.waitForTimeout(300);
      
      await expect(galleryGrid).toBeVisible();
      await expect(galleryItems).toHaveCount(6);
    }
  });

  test('booking form is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.locator('#booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const bookingForm = page.locator('#booking-form');
    await expect(bookingForm).toBeVisible();

    // Test form field accessibility on mobile
    const formFields = [
      '#name',
      '#email',
      '#phone',
      '#service',
      '#date',
      '#time',
      '#location',
      '#message'
    ];

    for (const fieldSelector of formFields) {
      const field = page.locator(fieldSelector);
      await expect(field).toBeVisible();
      
      // Test field focus
      await field.focus();
      await expect(field).toBeFocused();
    }
  });

  test('text readability across screen sizes', async ({ page }) => {
    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');

      // Test main headings
      const heroTitle = page.locator('.hero-content h1');
      await expect(heroTitle).toBeVisible();
      
      const titleText = await heroTitle.textContent();
      expect(titleText?.length).toBeGreaterThan(0);

      // Test service descriptions
      await page.locator('#services').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const serviceDescriptions = page.locator('.service-card p:not(.price)');
      await expect(serviceDescriptions.first()).toBeVisible();
    }
  });

  test('buttons are clickable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test hero buttons
    const bookNowBtn = page.locator('.btn-primary:has-text("Book Now")');
    await expect(bookNowBtn).toBeVisible();
    await bookNowBtn.click();
    await page.waitForTimeout(500);

    const bookingSection = page.locator('#booking');
    await expect(bookingSection).toBeInViewport();

    // Test navigation
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const hamburger = page.locator('#hamburger');
    await hamburger.click();
    await page.waitForTimeout(300);

    const servicesLink = page.locator('text=Services');
    await servicesLink.click();
    await page.waitForTimeout(500);

    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport();
  });

  test('images load and are responsive', async ({ page }) => {
    await page.goto('/');

    // Test hero image
    const heroImage = page.locator('.hero-image img');
    await expect(heroImage).toBeVisible();
    
    // Wait for image to load
    await heroImage.waitForElementState('stable');
    
    // Test on different screen sizes
    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.waitForTimeout(300);
      await expect(heroImage).toBeVisible();
    }

    // Test gallery images
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const galleryImages = page.locator('.gallery-item img');
    await expect(galleryImages.first()).toBeVisible();
  });
});