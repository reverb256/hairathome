const { test, expect } = require('@playwright/test');

test.describe('WhatsApp Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
  });

  test('WhatsApp buttons are present and functional', async ({ page }) => {
    // Check hero section WhatsApp button
    const heroWhatsAppBtn = page.locator('.hero-buttons .whatsapp-btn');
    await expect(heroWhatsAppBtn).toBeVisible();
    await expect(heroWhatsAppBtn).toContainText('Book via WhatsApp');
    
    // Check WhatsApp href
    const heroHref = await heroWhatsAppBtn.getAttribute('href');
    expect(heroHref).toContain('https://wa.me/12045550123');
    expect(heroHref).toContain('book%20a%20mobile%20hair%20appointment');
    
    // Check booking section WhatsApp button
    const bookingWhatsAppBtn = page.locator('.booking-buttons .whatsapp-btn');
    await expect(bookingWhatsAppBtn).toBeVisible();
    
    // Check floating WhatsApp button
    const floatingWhatsApp = page.locator('.whatsapp-float a');
    await expect(floatingWhatsApp).toBeVisible();
    
    const floatingHref = await floatingWhatsApp.getAttribute('href');
    expect(floatingHref).toContain('https://wa.me/12045550123');
  });

  test('WhatsApp links open in new tabs', async ({ page }) => {
    const whatsappBtns = page.locator('a[href*="wa.me"]');
    const count = await whatsappBtns.count();
    
    for (let i = 0; i < count; i++) {
      const btn = whatsappBtns.nth(i);
      const target = await btn.getAttribute('target');
      expect(target).toBe('_blank');
    }
  });

  test('Formspree form is configured', async ({ page }) => {
    const form = page.locator('#booking-form');
    await expect(form).toBeVisible();
    
    const action = await form.getAttribute('action');
    expect(action).toContain('https://formspree.io/f/');
  });

  test('WhatsApp contact info in footer', async ({ page }) => {
    const footerWhatsApp = page.locator('footer a[href*="wa.me"]');
    await expect(footerWhatsApp).toBeVisible();
    
    const whatsappSocial = page.locator('.whatsapp-social');
    await expect(whatsappSocial).toBeVisible();
  });

  test('WhatsApp styling is applied', async ({ page }) => {
    const whatsappBtn = page.locator('.whatsapp-btn').first();
    
    // Check WhatsApp green color
    const backgroundColor = await whatsappBtn.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).toBe('rgb(37, 211, 102)'); // #25D366
  });

  test('Floating WhatsApp button animation', async ({ page }) => {
    const floatingBtn = page.locator('.whatsapp-float a');
    await expect(floatingBtn).toBeVisible();
    
    // Check if pulse animation is applied
    const animation = await floatingBtn.evaluate(el => 
      window.getComputedStyle(el).animationName
    );
    expect(animation).toBe('pulse');
  });
});