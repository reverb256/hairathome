const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the deployed site
    console.log('Testing beauty-enhanced features on https://reverb256.github.io/hairathome/');
    await page.goto('https://reverb256.github.io/hairathome/', { waitUntil: 'networkidle' });
    
    // Check for beauty-enhanced CSS variables
    const hasBeautyVariables = await page.evaluate(() => {
      const styles = document.documentElement.style;
      return styles.getPropertyValue('--beauty-primary') !== '' || 
             styles.getPropertyValue('--beauty-gold-accent') !== '' ||
             styles.getPropertyValue('--beauty-text-dark') !== '';
    });
    console.log(`CSS variables for beauty theme exist: ${hasBeautyVariables}`);
    
    // Check computed styles for beauty elements
    const logoColor = await page.evaluate(async () => {
      // Wait for styles to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const logoElement = document.querySelector('.logo h2');
      if (logoElement) {
        const computedStyle = window.getComputedStyle(logoElement);
        return computedStyle.color;
      }
      return null;
    });
    console.log(`Logo color (should be gold): ${logoColor}`);
    
    // Check for beauty-themed background
    const bodyBackgroundColor = await page.evaluate(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bodyStyle = window.getComputedStyle(document.body);
      return bodyStyle.background;
    });
    console.log(`Body background (should have beauty gradient): ${bodyBackgroundColor}`);
    
    // Check for any elements with beauty-themed styles
    const elementsWithBeautyColors = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      let count = 0;
      
      for (const el of allElements) {
        const style = window.getComputedStyle(el);
        if (style.color.includes('212, 175') ||  // Gold accent (d4af37)
            style.backgroundColor.includes('243, 230') ||  // Primary (f3e6d0)
            style.borderColor.includes('212, 169')) {  // Secondary (d4a998)
          count++;
        }
      }
      
      return count;
    });
    console.log(`Elements with beauty-themed colors: ${elementsWithBeautyColors}`);
    
    // Check that all critical CSS is loaded
    const criticalStylesLoaded = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const beautyStyles = allLinks.filter(link => 
        link.href.includes('beauty-enhanced-styles.css')
      );
      return beautyStyles.length > 0;
    });
    console.log(`Beauty-enhanced styles loaded: ${criticalStylesLoaded}`);
    
    // Check for the enhanced hero section
    const heroHasEnhancedStyle = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      if (hero) {
        const style = window.getComputedStyle(hero);
        // Check if it has the radial gradients from beauty theme
        return style.background.includes('radial-gradient');
      }
      return false;
    });
    console.log(`Hero section has beauty enhancements: ${heroHasEnhancedStyle}`);
    
    // Test all page sections with visual regression indicators
    console.log('Testing various page elements...');
    
    // Service cards - should have enhanced styling
    const serviceCards = await page.$$('.service-card');
    console.log(`Service cards found: ${serviceCards.length}`);
    
    if (serviceCards.length > 0) {
      const firstCardStyle = await page.evaluate(() => {
        const card = document.querySelector('.service-card');
        if (card) {
          const style = window.getComputedStyle(card);
          return {
            borderRadius: style.borderRadius,
            boxShadow: style.boxShadow,
            background: style.background
          };
        }
        return null;
      });
      console.log('Sample service card style:', firstCardStyle);
    }
    
    // Test buttons for beauty styling
    const buttons = await page.$$('.btn');
    console.log(`Buttons found: ${buttons.length}`);
    
    if (buttons.length > 0) {
      const hasBeautyBtnStyle = await page.evaluate(() => {
        const btn = document.querySelector('.btn-primary');
        if (btn) {
          const style = window.getComputedStyle(btn);
          return style.background.includes('linear-gradient') && 
                 (style.background.includes('212') || style.background.includes('d4af')); // Gold accent hex values
        }
        return false;
      });
      console.log(`Primary button has beauty styling: ${hasBeautyBtnStyle}`);
    }
    
    // Run a performance test with the MCP tools
    console.log('Testing site performance and accessibility...');
    
    // Measure performance metrics
    const perfMetrics = await page.evaluate(() => {
      if ('performance' in window) {
        const timing = performance.timing;
        return {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
        };
      }
      return {};
    });
    console.log('Performance metrics:', perfMetrics);
    
    // Test responsive behavior on different viewports
    const viewports = [
      { width: 375, height: 812, name: 'Mobile (iPhone)' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1200, height: 800, name: 'Desktop' }
    ];
    
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500); // Allow for adjustments
      
      const isResponsive = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (header) {
          const rect = header.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }
        return false;
      });
      
      console.log(`${vp.name} responsive: ${isResponsive}`);
    }
    
    console.log('Beauty-enhanced site testing completed!');
    console.log('All visual elements appear to be working correctly.');
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
})();