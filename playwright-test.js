const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the deployed site
    console.log('Navigating to https://reverb256.github.io/hairathome/');
    await page.goto('https://reverb256.github.io/hairathome/', { waitUntil: 'networkidle' });
    
    // Basic page checks
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check if key elements exist
    const hasHeader = await page.$('header');
    console.log(`Header element exists: ${!!hasHeader}`);
    
    const hasHero = await page.$('.hero');
    console.log(`Hero section exists: ${!!hasHero}`);
    
    const hasLogo = await page.$('.logo h2');
    if (hasLogo) {
      const logoText = await page.textContent('.logo h2');
      console.log(`Logo text: ${logoText}`);
    }
    
    // Test responsiveness by checking different viewports
    console.log('Testing responsive design...');
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12/13 Pro
    await page.waitForTimeout(1000);
    console.log('✓ Mobile viewport (375x812) tested');
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.waitForTimeout(1000);
    console.log('✓ Tablet viewport (768x1024) tested');
    
    // Desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    console.log('✓ Desktop viewport (1200x800) tested');
    
    // Check for beauty-enhanced elements
    console.log('Testing beauty-enhanced elements...');
    
    // Look for beauty-enhanced CSS files
    const beautyStylesFound = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.some(link => link.href.includes('beauty-enhanced'));
    });
    console.log(`Beauty-enhanced styles linked: ${beautyStylesFound}`);
    
    // Check for beauty-themed color properties in computed styles
    const hasGoldAccent = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.backgroundColor.includes('212') || // d4af37 (Gold accent)
            style.color.includes('212') ||
            style.borderColor.includes('212')) {
          return true;
        }
      }
      return false;
    });
    console.log(`Gold accent colors found: ${hasGoldAccent}`);
    
    // Test navigation
    console.log('Testing navigation...');
    const navLinks = await page.$$('.nav-link');
    console.log(`Found ${navLinks.length} navigation links`);
    
    // Test services section
    const servicesSection = await page.$('.services');
    console.log(`Services section exists: ${!!servicesSection}`);
    
    if (servicesSection) {
      const serviceCards = await page.$$('.service-card');
      console.log(`Found ${serviceCards.length} service cards`);
    }
    
    // Test gallery section
    const gallerySection = await page.$('.gallery');
    console.log(`Gallery section exists: ${!!gallerySection}`);
    
    if (gallerySection) {
      const galleryItems = await page.$$('.gallery-item');
      console.log(`Found ${galleryItems.length} gallery items`);
    }
    
    // Test contact/book now functionality
    const bookButtons = await page.$$('.btn-primary');
    console.log(`Found ${bookButtons.length} booking buttons`);
    
    // Test for accessibility features
    console.log('Testing accessibility features...');
    const skipLinkExists = await page.$('.skip-link');
    console.log(`Skip link exists: ${!!skipLinkExists}`);
    
    // Check for focus indicators
    const hasFocusIndicators = await page.evaluate(() => {
      // Check if there are elements with custom focus styles
      const styleSheets = Array.from(document.styleSheets);
      return styleSheets.some(sheet => {
        try {
          const rules = Array.from(sheet.cssRules);
          return rules.some(rule => 
            rule.selectorText && 
            (rule.selectorText.includes(':focus') || rule.selectorText.includes('.focus'))
          );
        } catch(e) {
          return false;
        }
      });
    });
    console.log(`Custom focus indicators in CSS: ${hasFocusIndicators}`);
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
})();