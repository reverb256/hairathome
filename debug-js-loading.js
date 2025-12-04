const { chromium } = require('playwright');

async function debugJSLoading() {
  console.log('🔍 Debugging JavaScript Loading');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    bypassCSP: true
  });
  const page = await context.newPage();
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  try {
    await page.goto('http://localhost:1313');
    await page.waitForLoadState('networkidle');
    
    // Check if main.js loaded
    const jsLoaded = await page.evaluate(() => {
      return typeof window.themeManager !== 'undefined' || 
             typeof document.getElementById('theme-toggle')?.onclick !== 'undefined' ||
             document.getElementById('theme-toggle')?.hasAttribute('data-listener');
    });
    
    console.log('📦 JavaScript loaded:', jsLoaded);
    
    // Check if theme toggle element exists and has event listeners
    const toggleInfo = await page.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      if (!toggle) return { exists: false };
      
      return {
        exists: true,
        hasClickListener: toggle.onclick !== null,
        eventListeners: toggle.getAttribute('data-listener'),
        computedStyle: window.getComputedStyle(toggle).cursor
      };
    });
    
    console.log('🔘 Toggle info:', toggleInfo);
    
    // Manually trigger DOMContentLoaded to see if that helps
    await page.evaluate(() => {
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
    });
    
    await page.waitForTimeout(1000);
    
    // Check state after manual trigger
    const afterTrigger = await page.evaluate(() => {
      const html = document.documentElement;
      return {
        htmlTheme: html.getAttribute('data-theme'),
        localStorage: window.localStorage.getItem('theme'),
        textContent: document.getElementById('theme-text')?.textContent
      };
    });
    
    console.log('🔄 After manual DOMContentLoaded:', afterTrigger);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugJSLoading();