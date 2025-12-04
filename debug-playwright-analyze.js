const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Starting comprehensive analysis of the deployed Hair@Home site...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the live site
    await page.goto('https://reverb256.github.io/hairathome/', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    console.log('✅ Site loaded successfully');
    
    // Get page information
    const title = await page.title();
    console.log(`📋 Page Title: ${title}`);
    
    // Check for the presence of beauty theme CSS variables
    const cssVars = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        hasBeautyPrimary: styles.getPropertyValue('--beauty-primary').includes('f3e6d0'),
        hasBeautyGoldAccent: styles.getPropertyValue('--beauty-gold-accent').includes('d4af37'),
        hasBeautyTextDark: styles.getPropertyValue('--beauty-text-dark').includes('3d2e26'),
        hasOldDarkTheme: styles.getPropertyValue('--bg-primary').includes('050505')
      };
    });
    
    console.log('🎨 CSS Variables Check:');
    console.log(`  --beauty-primary exists: ${cssVars.hasBeautyPrimary}`);
    console.log(`  --beauty-gold-accent exists: ${cssVars.hasBeautyGoldAccent}`);
    console.log(`  --beauty-text-dark exists: ${cssVars.hasBeautyTextDark}`);
    console.log(`  --bg-primary (old) exists: ${cssVars.hasOldDarkTheme}`);
    
    // Check for beauty-themed elements
    const elementCounts = await page.evaluate(() => {
      return {
        serviceCards: document.querySelectorAll('.service-card').length,
        btnPrimary: document.querySelectorAll('.btn.btn-primary').length,
        header: document.querySelector('header') ? true : false,
        hero: document.querySelector('.hero') ? true : false,
        oldImages: Array.from(document.querySelectorAll('img')).filter(img => 
          img.src.includes('photo-1595675024853-0f3ec9098ac7') // Old laptop image
        ).length,
        newImages: Array.from(document.querySelectorAll('img')).filter(img => 
          img.src.includes('hero-beauty-stylist') || img.src.includes('beauty-stylist-professional')
        ).length
      };
    });
    
    console.log('🔍 Element Analysis:');
    console.log(`  Service cards: ${elementCounts.serviceCards}`);
    console.log(`  Primary buttons: ${elementCounts.btnPrimary}`);
    console.log(`  Header present: ${elementCounts.header}`);
    console.log(`  Hero section: ${elementCounts.hero}`);
    console.log(`  Old laptop images still present: ${elementCounts.oldImages}`);
    console.log(`  New beauty images: ${elementCounts.newImages}`);
    
    // Check loaded CSS files
    const stylesheets = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => link.href).filter(h => h.length > 0);
    });
    
    console.log('🔗 Loaded Stylesheets:');
    for (const sheet of stylesheets) {
      console.log(`  - ${sheet}`);
    }
    
    // Check for specific beauty styles in computed styles
    const hasBeautyStyles = await page.evaluate(() => {
      const body = document.querySelector('body');
      const btn = document.querySelector('.btn-primary');
      const logo = document.querySelector('.logo h2');
      
      if (!body) return { bodyFound: false };
      
      const bodyStyle = window.getComputedStyle(body);
      const hasBeautyBg = bodyStyle.backgroundImage.includes('linear-gradient') && 
                         (bodyStyle.background.includes('f0e6d9') || 
                          bodyStyle.background.includes('f3e6d0'));
                          
      const btnStyle = btn ? window.getComputedStyle(btn) : null;
      const hasBeautyBtn = btnStyle && btnStyle.backgroundImage.includes('linear-gradient') && 
                          btnStyle.background.includes('212, 175, 55'); // d4af37 (gold)
                          
      const logoStyle = logo ? window.getComputedStyle(logo) : null;
      const hasBeautyLogo = logoStyle && logoStyle.color.includes('212, 175, 55'); // gold accent
      
      return {
        bodyFound: true,
        hasBeautyBg,
        hasBeautyBtn,
        hasBeautyLogo
      };
    });
    
    console.log('💅 Beauty Theme Analysis:');
    console.log(`  Beauty background styling: ${hasBeautyStyles.hasBeautyBg}`);
    console.log(`  Beauty button styling: ${hasBeautyStyles.hasBeautyBtn}`);
    console.log(`  Beauty logo styling: ${hasBeautyStyles.hasBeautyLogo}`);
    
    // Check if the page is showing old content
    const isOldContent = await page.evaluate(() => {
      // Check if we see old dark-themed classes or styles
      const htmlClasses = document.querySelector('html').className;
      const bodyClasses = document.querySelector('body').className;
      
      return (htmlClasses.includes('dark') || bodyClasses.includes('dark') || 
              bodyClasses.includes('night') || bodyClasses.includes('theme-dark') ||
              document.querySelector('img[src*="photo-1595675024853-0f3ec9098ac7"]') !== null);
    });
    
    console.log(`🔄 Page showing old content: ${isOldContent}`);
    
    // Check the actual DOM elements related to the hero section
    const heroImageSrc = await page.evaluate(() => {
      const heroImg = document.querySelector('.hero-image img');
      return heroImg ? heroImg.src : null;
    });
    
    console.log(`🖼️ Current hero image: ${heroImageSrc}`);
    
    console.log('🔍 Issue Diagnosis:');
    if (elementCounts.oldImages > 0) {
      console.log('  ❌ Old laptop/desktop images are still present');
      console.log('  🎯 Need to ensure GitHub pages redeploys with new templates');
    }
    
    if (!cssVars.hasBeautyPrimary && !cssVars.hasBeautyGoldAccent) {
      console.log('  ❌ Beauty CSS variables are not present');
      console.log('  🎯 Need to verify GitHub Actions workflow is deploying correctly');
    }
    
    if (isOldContent) {
      console.log('  ❌ Site is still showing old dark theme content');
      console.log('  🎯 Need to trigger fresh deployment with all beauty enhancements');
    }
    
    console.log('');
    console.log('💡 Most Likely Causes:');
    console.log('  1. GitHub Actions workflow not triggering properly');
    console.log('  2. Old build cached in GitHub Pages CDN');
    console.log('  3. Build workflow not picking up latest template changes');
    console.log('  4. Different branch being deployed to GitHub Pages');
    
  } catch (error) {
    console.error('❌ Playwright analysis failed:', error);
  } finally {
    await browser.close();
    console.log('');
    console.log('🎯 Analysis complete. Ready to debug deployment issues.');
  }
})();