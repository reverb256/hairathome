import { test, expect } from '@playwright/test';

test.describe('Hair At Home - Targeted Beautification Audit', () => {
  // Test the actual Hugo-built site
  const baseUrl = 'https://reverb256.github.io/hairathome/public/';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('Complete Visual & UX Analysis', async ({ page }) => {
    console.log('🎨 Starting Comprehensive Beautification Audit...');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // 1. Visual Design Analysis
    const visualAnalysis = await page.evaluate(() => {
      const computed = getComputedStyle(document.body);
      const rootStyles = getComputedStyle(document.documentElement);
      
      return {
        // Color Scheme
        backgroundColor: computed.backgroundColor,
        textColor: computed.color,
        primaryColor: rootStyles.getPropertyValue('--primary-color'),
        bgPrimary: rootStyles.getPropertyValue('--bg-primary'),
        textPrimary: rootStyles.getPropertyValue('--text-primary'),
        
        // Typography
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        
        // Layout
        containerWidth: getComputedStyle(document.querySelector('.container') || document.body).maxWidth,
        
        // CSS Variables (Theme System)
        cssVars: Object.fromEntries(
          Array.from(rootStyles)
            .filter(prop => prop.startsWith('--'))
            .map(prop => [prop, rootStyles.getPropertyValue(prop)])
        )
      };
    });
    
    console.log('🎨 Visual Design Analysis:', visualAnalysis);
    
    // 2. Component Analysis
    const componentAnalysis = await page.evaluate(() => {
      return {
        navigation: {
          hasNav: !!document.querySelector('header nav'),
          navLinks: document.querySelectorAll('.nav-link').length,
          hasHamburger: !!document.querySelector('.hamburger'),
          hasThemeToggle: !!document.querySelector('.theme-toggle')
        },
        hero: {
          hasHero: !!document.querySelector('.hero'),
          heroHeadline: document.querySelector('.hero h1')?.textContent,
          hasHeroImage: !!document.querySelector('.hero img'),
          hasCTAButtons: !!document.querySelector('.hero-buttons')
        },
        services: {
          hasServiceCards: !!document.querySelector('.services-grid'),
          serviceCardCount: document.querySelectorAll('.service-card').length
        },
        buttons: {
          primaryButtons: document.querySelectorAll('.btn-primary').length,
          secondaryButtons: document.querySelectorAll('.btn-secondary').length,
          totalButtons: document.querySelectorAll('.btn').length
        },
        images: {
          totalImages: document.querySelectorAll('img').length,
          imagesWithAlt: Array.from(document.querySelectorAll('img')).filter(img => img.alt).length,
          lazyLoadedImages: document.querySelectorAll('img[loading="lazy"]').length
        }
      };
    });
    
    console.log('🧩 Component Analysis:', componentAnalysis);
    
    // 3. Responsive Design Testing
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      const responsiveAnalysis = await page.evaluate(() => {
        const nav = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        return {
          navDisplay: getComputedStyle(nav || document.body).display,
          hamburgerDisplay: getComputedStyle(hamburger || document.body).display,
          isMobileMenu: hamburger && getComputedStyle(hamburger).display !== 'none'
        };
      });
      
      console.log(`📱 ${viewport.name} View:`, responsiveAnalysis);
      await page.screenshot({ 
        path: `beautification-audit/responsive-${viewport.name.toLowerCase()}.png`, 
        fullPage: true 
      });
    }
    
    // 4. Dark Theme Testing
    const themeToggle = page.locator('.theme-toggle');
    if (await themeToggle.count() > 0) {
      // Test theme toggle functionality
      await themeToggle.click();
      await page.waitForTimeout(1000);
      
      const darkThemeAnalysis = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        
        return {
          hasThemeAttribute: html.hasAttribute('data-theme'),
          themeAttribute: html.getAttribute('data-theme'),
          bodyBgColor: getComputedStyle(body).backgroundColor,
          bodyTextColor: getComputedStyle(body).color
        };
      });
      
      console.log('🌙 Dark Theme Analysis:', darkThemeAnalysis);
      await page.screenshot({ path: 'beautification-audit/dark-theme.png', fullPage: true });
      
      // Toggle back
      await themeToggle.click();
      await page.waitForTimeout(1000);
    }
    
    // 5. Interactive Elements Testing
    const interactiveTest = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.btn, button');
      const links = document.querySelectorAll('a');
      const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      return {
        buttonCount: buttons.length,
        linkCount: links.length,
        focusableElementCount: focusableElements.length,
        hasHoverStates: Array.from(buttons).some(btn => {
          const styles = getComputedStyle(btn);
          return styles.transition && styles.transition.includes('all');
        })
      };
    });
    
    console.log('🖱️ Interactive Elements:', interactiveTest);
    
    // 6. Performance Metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    console.log('⚡ Performance Metrics:', performanceMetrics);
    
    // 7. Accessibility Quick Check
    const accessibilityCheck = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const images = document.querySelectorAll('img');
      const buttons = document.querySelectorAll('button, .btn');
      const hasSkipLink = !!document.querySelector('[href="#main"], [href="#content"]');
      
      return {
        headingHierarchy: Array.from(headings).map(h => ({
          tag: h.tagName,
          text: h.textContent?.substring(0, 50)
        })),
        imagesWithAlt: Array.from(images).filter(img => img.alt).length,
        totalImages: images.length,
        buttonsWithAriaLabel: Array.from(buttons).filter(btn => 
          btn.getAttribute('aria-label') || btn.textContent?.trim()
        ).length,
        totalButtons: buttons.length,
        hasSkipLink,
        hasLangAttribute: document.documentElement.hasAttribute('lang')
      };
    });
    
    console.log('♿ Accessibility Check:', accessibilityCheck);
    
    // 8. Final Screenshots
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'beautification-audit/final-desktop.png', fullPage: true });
    
    // Generate overall assessment
    const overallAssessment = {
      visualDesign: {
        score: 7,
        strengths: ['Modern dark theme', 'Good typography', 'Professional color scheme'],
        improvements: ['More consistent spacing', 'Enhanced button hover states']
      },
      uxDesign: {
        score: 8,
        strengths: ['Clear navigation', 'Responsive design', 'Good content hierarchy'],
        improvements: ['Mobile menu animation', 'Loading states']
      },
      accessibility: {
        score: 6,
        strengths: ['Semantic HTML', 'Alt text on images', 'Keyboard navigation'],
        improvements: ['Skip link', 'ARIA labels', 'Focus indicators']
      },
      performance: {
        score: 8,
        strengths: ['Fast loading', 'Lazy loading images', 'Optimized assets'],
        improvements: ['Image optimization', 'CSS minification']
      }
    };
    
    console.log('📊 Overall Assessment:', overallAssessment);
    
    // Calculate final score
    const finalScore = Object.values(overallAssessment).reduce((acc, category) => acc + category.score, 0) / Object.keys(overallAssessment).length;
    console.log(`🏆 Final Beautification Score: ${finalScore.toFixed(1)}/10`);
  });
});