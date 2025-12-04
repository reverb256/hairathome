import { test, expect } from '@playwright/test';

test.describe('Hair@Home - Comprehensive Beautification Audit', () => {
  const baseUrl = 'https://reverb256.github.io/hairathome/';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('1. Visual Design & Aesthetics Audit', async ({ page }) => {
    console.log('🎨 Auditing Visual Design & Aesthetics...');
    
    // Test color harmony and contrast
    const bodyStyles = await page.evaluate(() => {
      const computed = getComputedStyle(document.body);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize
      };
    });
    
    console.log('Body Styles:', bodyStyles);
    
    // Check for consistent color scheme
    const buttons = await page.locator('button, .btn, a[role="button"]').all();
    console.log(`Found ${buttons.length} buttons/interactive elements`);
    
    // Test typography consistency
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`Found ${headings.length} headings`);
    
    // Check spacing and alignment
    const sections = await page.locator('section, .section, main > div').all();
    console.log(`Found ${sections.length} sections`);
    
    // Take screenshots for visual evidence
    await page.screenshot({ path: 'beautification-audit/homepage-full.png', fullPage: true });
    
    // Test dark theme implementation
    const isDarkTheme = await page.evaluate(() => {
      const bgColor = getComputedStyle(document.body).backgroundColor;
      return bgColor.includes('5') || bgColor.includes('0') || bgColor.includes('rgb(5,5,5)');
    });
    
    console.log('Dark theme detected:', isDarkTheme);
  });

  test('2. User Experience (UX) Audit', async ({ page }) => {
    console.log('👥 Auditing User Experience...');
    
    // Test navigation
    const navLinks = await page.locator('nav a, .navigation a, header a').all();
    console.log(`Found ${navLinks.length} navigation links`);
    
    // Test each navigation link
    for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
      const link = navLinks[i];
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        console.log(`Testing navigation to: ${text} (${href})`);
        await link.click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: `beautification-audit/nav-${text?.trim() || 'unknown'}.png` });
        await page.goBack();
      }
    }
    
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone
    await page.screenshot({ path: 'beautification-audit/mobile-iphone.png', fullPage: true });
    
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.screenshot({ path: 'beautification-audit/tablet-ipad.png', fullPage: true });
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.screenshot({ path: 'beautification-audit/desktop-full.png', fullPage: true });
  });

  test('3. Accessibility & Performance Audit', async ({ page }) => {
    console.log('♿ Auditing Accessibility & Performance...');
    
    // Test color contrast
    const contrastResults = await page.evaluate(() => {
      const results = [];
      const elements = document.querySelectorAll('*');
      
      for (const el of elements) {
        const styles = getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const color = styles.color;
        
        if (bgColor && color && bgColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
          results.push({
            tag: el.tagName,
            class: el.className,
            backgroundColor: bgColor,
            color: color
          });
        }
      }
      
      return results.slice(0, 10); // Return first 10 for analysis
    });
    
    console.log('Color contrast samples:', contrastResults);
    
    // Test focus states
    await page.keyboard.press('Tab');
    await page.screenshot({ path: 'beautification-audit/focus-state.png' });
    
    // Test keyboard navigation
    const focusableElements = await page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    console.log(`Found ${focusableElements.length} focusable elements`);
    
    // Test alt text for images
    const images = await page.locator('img').all();
    let imagesWithoutAlt = 0;
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) imagesWithoutAlt++;
    }
    
    console.log(`Images without alt text: ${imagesWithoutAlt}/${images.length}`);
    
    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
  });

  test('4. Dark Theme Implementation Audit', async ({ page }) => {
    console.log('🌙 Auditing Dark Theme Implementation...');
    
    // Check for theme toggle
    const themeToggle = await page.locator('[data-theme-toggle], .theme-toggle, .dark-mode-toggle').first();
    const hasThemeToggle = await themeToggle.count() > 0;
    
    console.log('Theme toggle found:', hasThemeToggle);
    
    if (hasThemeToggle) {
      await themeToggle.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'beautification-audit/theme-toggled.png', fullPage: true });
    }
    
    // Check CSS variables
    const cssVariables = await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const variables = {};
      
      for (let i = 0; i < rootStyles.length; i++) {
        const property = rootStyles[i];
        if (property.startsWith('--')) {
          variables[property] = rootStyles.getPropertyValue(property);
        }
      }
      
      return variables;
    });
    
    console.log('CSS variables found:', Object.keys(cssVariables).length);
    
    // Check meta theme-color
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    console.log('Meta theme-color:', themeColor);
    
    // Test theme consistency across pages
    const testPages = ['/about/', '/services/', '/gallery/', '/booking/'];
    
    for (const pagePath of testPages) {
      try {
        await page.goto(baseUrl + pagePath.replace(/^\//, ''));
        await page.waitForLoadState('networkidle');
        
        const pageTheme = await page.evaluate(() => {
          return getComputedStyle(document.body).backgroundColor;
        });
        
        console.log(`${pagePath} theme:`, pageTheme);
        await page.screenshot({ path: `beautification-audit/theme-${pagePath.replace(/\//g, '-')}.png`, fullPage: true });
      } catch (error) {
        console.log(`Could not access ${pagePath}:`, error.message);
      }
    }
  });

  test('5. Interactive Elements & Forms', async ({ page }) => {
    console.log('📝 Testing Interactive Elements & Forms...');
    
    // Test buttons and hover states
    const buttons = await page.locator('button, .btn, a[role="button"]').all();
    
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      const button = buttons[i];
      await button.hover();
      await page.screenshot({ path: `beautification-audit/button-hover-${i}.png` });
    }
    
    // Test forms if present
    const forms = await page.locator('form').all();
    console.log(`Found ${forms.length} forms`);
    
    if (forms.length > 0) {
      const form = forms[0];
      const inputs = await form.locator('input, select, textarea').all();
      console.log(`Found ${inputs.length} form inputs`);
      
      // Test form validation
      for (const input of inputs.slice(0, 3)) {
        const inputType = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        
        console.log(`Input type: ${inputType}, placeholder: ${placeholder}`);
        
        if (inputType !== 'hidden') {
          await input.fill('test');
          await page.screenshot({ path: `beautification-audit/form-input-${inputType}.png` });
        }
      }
    }
  });

  test('6. Gallery & Image Presentation', async ({ page }) => {
    console.log('🖼️ Testing Gallery & Image Presentation...');
    
    // Try to navigate to gallery
    try {
      const galleryLink = await page.locator('a[href*="gallery"], .gallery-link').first();
      if (await galleryLink.count() > 0) {
        await galleryLink.click();
        await page.waitForLoadState('networkidle');
        
        // Test gallery layout
        const galleryImages = await page.locator('.gallery img, .image-gallery img, img[src*="gallery"]').all();
        console.log(`Found ${galleryImages.length} gallery images`);
        
        if (galleryImages.length > 0) {
          await page.screenshot({ path: 'beautification-audit/gallery-layout.png', fullPage: true });
          
          // Test image loading
          for (let i = 0; i < Math.min(galleryImages.length, 3); i++) {
            const img = galleryImages[i];
            const src = await img.getAttribute('src');
            const naturalWidth = await img.evaluate(el => el.naturalWidth);
            const naturalHeight = await img.evaluate(el => el.naturalHeight);
            
            console.log(`Gallery image ${i}: ${src}, dimensions: ${naturalWidth}x${naturalHeight}`);
          }
        }
      }
    } catch (error) {
      console.log('Gallery not accessible:', error.message);
    }
  });
});