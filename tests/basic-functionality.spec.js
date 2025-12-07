import { test, expect } from '@playwright/test';

/**
 * Basic functionality tests for Hair@Home website
 * Tests core features after design system refactor
 */

test.describe('Hair@Home Website - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Hair@Home/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation menu works correctly', async ({ page }) => {
    // Test desktop navigation (only visible links)
    const desktopNavLinks = page.locator('.hidden.md\\:flex a[href^="#"]');
    await expect(desktopNavLinks).toHaveCount(4);
    
    // Test mobile menu toggle
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
    
    await mobileMenuBtn.click();
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();
  });

  test('Theme switcher functionality', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // Check initial state (light mode)
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Toggle to dark mode
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back to light mode
    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('Hero section content is visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('salon experience');
    await expect(page.locator('text=Accepting new clients in Winnipeg')).toBeVisible();
    await expect(page.locator('.inline-flex.justify-center:has-text("Book Appointment")')).toBeVisible();
    await expect(page.locator('.inline-flex.justify-center:has-text("View Service Menu")')).toBeVisible();
  });

  test('Services section displays correctly', async ({ page }) => {
    // Click the main services link in desktop nav
    await page.locator('.hidden.md\\:flex a[href="#services"]').first().click();
    
    const serviceCards = page.locator('.group.bg-white');
    await expect(serviceCards).toHaveCount(4);
    
    // Check service content
    await expect(page.locator('text=Curated Services')).toBeVisible();
    await expect(page.locator('#services h3:has-text("Haircut & Style")')).toBeVisible();
    await expect(page.locator('#services h3:has-text("Color & Highlights")')).toBeVisible();
  });

  test('Pricing section shows services', async ({ page }) => {
    // Click the main pricing link in desktop nav
    await page.locator('.hidden.md\\:flex a[href="#pricing"]').first().click();
    
    await expect(page.locator('text=Transparent Pricing')).toBeVisible();
    await expect(page.locator('#pricing h4:has-text("Haircut & Style")')).toBeVisible();
    await expect(page.locator('#pricing span:has-text("$60")')).toBeVisible();
  });

  test('Contact form is functional', async ({ page }) => {
    // Click to contact section
    await page.locator('.hidden.md\\:flex a[href="#contact"]').first().click();
    
    await expect(page.locator('text=Ready to Book?')).toBeVisible();
    
    // Test form inputs
    await page.fill('input[placeholder="Jane Doe"]', 'Test User');
    await page.fill('input[placeholder="204-555-0123"]', '204-555-0123');
    await page.fill('input[placeholder="jane@example.com"]', 'test@example.com');
    
    // Test checkbox
    const checkbox = page.locator('#terms');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test('WhatsApp button is present', async ({ page }) => {
    const whatsappBtn = page.locator('a[href*="wa.me"]');
    await expect(whatsappBtn).toBeVisible();
    
    // Test hover tooltip
    await whatsappBtn.hover();
    await expect(page.locator('text=Book via WhatsApp')).toBeVisible();
  });

  test('Responsive design works', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Smooth scrolling works', async ({ page }) => {
    const aboutLink = page.locator('.hidden.md\\:flex a[href="#about"]').first();
    await aboutLink.click();
    
    // Check if page scrolled to about section
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('Footer links are present', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    await expect(page.locator('text=© 2025 Hair@Home')).toBeVisible();
    const footerLinks = page.locator('footer a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Dark Mode Persistence', () => {
  test('Theme preference persists across navigation', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark mode
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Navigate to different section
    await page.locator('.hidden.md\\:flex a[href="#services"]').first().click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Reload page
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});