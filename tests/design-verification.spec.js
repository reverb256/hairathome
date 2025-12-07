const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Design Verification - Live Site', () => {
  test('Navigate to live site and capture design screenshots', async ({ page }) => {
    // Navigate to the live site
    await page.goto('https://reverb256.github.io/hairathome/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait for any dynamic content
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'design-verification/full-page-live.png',
      fullPage: true 
    });
    
    // Check if Tailwind CSS classes are present in the HTML
    const htmlContent = await page.content();
    const hasTailwindClasses = /class="[^"]*\b(bg-|text-|flex|grid|p-|m-|w-|h-)/.test(htmlContent);
    console.log('Tailwind CSS classes detected:', hasTailwindClasses);
    
    // Check for specific modern design indicators
    const hasInterFont = htmlContent.includes('Inter') || htmlContent.includes('font-inter');
    const hasZincColors = htmlContent.includes('zinc-') || htmlContent.includes('bg-zinc') || htmlContent.includes('text-zinc');
    const hasMinimalistLayout = htmlContent.includes('max-w-4xl') || htmlContent.includes('mx-auto');
    
    console.log('Design indicators:');
    console.log('- Inter font:', hasInterFont);
    console.log('- Zinc colors:', hasZincColors);
    console.log('- Minimalist layout:', hasMinimalistLayout);
    
    // Take hero section screenshot
    const heroSection = await page.locator('header, .hero, .hero-section, h1').first();
    if (await heroSection.isVisible()) {
      await heroSection.screenshot({ 
        path: 'design-verification/hero-section-live.png' 
      });
    }
    
    // Take navigation screenshot
    const nav = await page.locator('nav, .navigation, .navbar, .menu').first();
    if (await nav.isVisible()) {
      await nav.screenshot({ 
        path: 'design-verification/navigation-live.png' 
      });
    }
    
    // Get computed styles for key elements to verify design
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        fontFamily: computed.fontFamily,
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    console.log('Body computed styles:', bodyStyles);
    
    // Check for main heading styles
    const mainHeading = await page.locator('h1').first();
    if (await mainHeading.isVisible()) {
      const headingStyles = await mainHeading.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          color: computed.color,
          fontWeight: computed.fontWeight
        };
      });
      console.log('Main heading styles:', headingStyles);
    }
    
    // Save HTML content for analysis
    await page.setContent(htmlContent);
    require('fs').writeFileSync('design-verification/live-site-html.html', htmlContent);
    
    // Create a design verification report
    const report = {
      url: 'https://reverb256.github.io/hairathome/',
      timestamp: new Date().toISOString(),
      designIndicators: {
        hasTailwindClasses,
        hasInterFont,
        hasZincColors,
        hasMinimalistLayout
      },
      bodyStyles,
      screenshots: [
        'design-verification/full-page-live.png',
        'design-verification/hero-section-live.png',
        'design-verification/navigation-live.png'
      ]
    };
    
    require('fs').writeFileSync(
      'design-verification/design-report.json', 
      JSON.stringify(report, null, 2)
    );
  });
  
  test('Compare with expected modern design elements', async ({ page }) => {
    await page.goto('https://reverb256.github.io/hairathome/');
    await page.waitForLoadState('networkidle');
    
    // Check for specific modern design elements we expect
    const modernDesignChecks = await page.evaluate(() => {
      return {
        // Check for zinc color palette
        hasZincBackground: Array.from(document.querySelectorAll('*')).some(el => 
          window.getComputedStyle(el).backgroundColor.includes('212') || // zinc-800
          window.getComputedStyle(el).backgroundColor.includes('241') || // zinc-100
          window.getComputedStyle(el).backgroundColor.includes('113')    // zinc-700
        ),
        
        // Check for Inter font
        hasInterFont: Array.from(document.querySelectorAll('*')).some(el => 
          window.getComputedStyle(el).fontFamily.includes('Inter')
        ),
        
        // Check for minimalist spacing
        hasConsistentSpacing: Array.from(document.querySelectorAll('*')).some(el => {
          const style = window.getComputedStyle(el);
          return style.padding.includes('rem') || style.margin.includes('rem');
        }),
        
        // Check for modern layout
        hasModernLayout: document.querySelector('.container, .max-w, .mx-auto') !== null,
        
        // Check for clean typography
        hasCleanTypography: document.querySelector('h1, h2, h3') !== null
      };
    });
    
    console.log('Modern design verification:', modernDesignChecks);
    
    // Take viewport-specific screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ 
      path: 'design-verification/desktop-view.png',
      fullPage: true 
    });
    
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone
    await page.screenshot({ 
      path: 'design-verification/mobile-view.png',
      fullPage: true 
    });
    
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
    await page.screenshot({ 
      path: 'design-verification/tablet-view.png',
      fullPage: true 
    });
  });
});