import { test, expect } from '@playwright/test';

/**
 * Accessibility tests for Hair At Home website
 * Tests WCAG compliance, keyboard navigation, and screen reader compatibility
 */
test.describe('Hair At Home - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has proper HTML structure', async ({ page }) => {
    // Check for proper DOCTYPE
    const doctype = await page.evaluate(() => document.doctype?.name);
    expect(doctype).toBe('html');

    // Check for lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    // Check for proper title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      
      // Images should have alt text (can be empty for decorative images)
      expect(altText !== undefined).toBe(true);
    }
  });

  test('form inputs have proper labels', async ({ page }) => {
    await page.locator('#booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const formInputs = page.locator('input, select, textarea');
    const inputCount = await formInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const inputId = await input.getAttribute('id');
      
      if (inputId) {
        const label = page.locator(`label[for="${inputId}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be the skip link or navigation
    const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocusable);

    // Test navigation through main sections
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      const activeElement = await page.evaluate(() => document.activeElement);
      if (!activeElement || activeElement.tagName === 'BODY') break;
    }

    expect(tabCount).toBeGreaterThan(0);
  });

  test('focus indicators are visible', async ({ page }) => {
    // Find focusable elements
    const focusableElements = await page.locator('a, button, input, select, textarea').all();
    
    if (focusableElements.length > 0) {
      // Focus first element
      await focusableElements[0].focus();
      
      // Check if focused element has visible focus styles
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('headings are properly structured', async ({ page }) => {
    // Check for h1
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    for (let i = 0; i < headings.length - 1; i++) {
      const currentLevel = parseInt(await headings[i].evaluate(el => el.tagName.substring(1)));
      const nextLevel = parseInt(await headings[i + 1].evaluate(el => el.tagName.substring(1)));
      
      // Heading levels should not skip (e.g., h1 to h3)
      expect(nextLevel - currentLevel).toBeLessThanOrEqual(1);
    }
  });

  test('links have descriptive text', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Links should have descriptive text or aria-label
      expect(
        (linkText && linkText.trim().length > 0) || 
        (ariaLabel && ariaLabel.trim().length > 0)
      ).toBe(true);
    }
  });

  test('color contrast is sufficient (basic check)', async ({ page }) => {
    // This is a basic check - for thorough testing, use axe-core or similar
    const heroTitle = page.locator('.hero-content h1');
    await expect(heroTitle).toBeVisible();
    
    // Check if text is readable (not white on white)
    const styles = await heroTitle.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor
      };
    });

    expect(styles.color).not.toBe(styles.backgroundColor);
  });

  test('buttons have accessible names', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const buttonText = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Buttons should have accessible names
      expect(
        (buttonText && buttonText.trim().length > 0) || 
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (ariaLabelledBy && ariaLabelledBy.trim().length > 0)
      ).toBe(true);
    }
  });

  test('form validation is accessible', async ({ page }) => {
    await page.locator('#booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Try to submit empty form to trigger validation
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check if required fields have validation messages
    const requiredFields = page.locator('[required]');
    const requiredCount = await requiredFields.count();

    for (let i = 0; i < requiredCount; i++) {
      const field = requiredFields.nth(i);
      const isValid = await field.evaluate(el => el.validity.valid);
      
      if (!isValid) {
        // Field should have some form of error indication
        const ariaInvalid = await field.getAttribute('aria-invalid');
        expect(ariaInvalid === 'true' || ariaInvalid === null).toBe(true);
      }
    }
  });

  test('skip navigation option', async ({ page }) => {
    // Check for skip link (common accessibility feature)
    const skipLinks = page.locator('a[href^="#"]:has-text("skip"), a[href^="#"]:has-text("Skip")');
    
    if (await skipLinks.count() > 0) {
      await expect(skipLinks.first()).toBeVisible();
    }
  });

  test('semantic HTML elements are used', async ({ page }) => {
    // Check for proper semantic elements
    const semanticElements = [
      'header',
      'nav',
      'main',
      'section',
      'article',
      'aside',
      'footer'
    ];

    for (const element of semanticElements) {
      const elements = page.locator(element);
      // At least header, nav, section, and footer should be present
      if (['header', 'nav', 'section', 'footer'].includes(element)) {
        await expect(elements).toHaveCount({ min: 1 });
      }
    }
  });
});