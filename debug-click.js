const { chromium } = require('playwright');

async function debugClick() {
  console.log('🖱️ Debugging Click Event');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`📝 Console: ${msg.text()}`);
  });
  
  try {
    await page.goto('http://localhost:1313?v=' + Date.now());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for script to fully load
    
    // Check initial state
    const initial = await page.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      return {
        exists: !!toggle,
        hasClickHandler: toggle.onclick !== null,
        eventListeners: toggle.getAttribute('data-listener')
      };
    });
    
    console.log('Initial toggle state:', initial);
    
    // Try to click
    console.log('Attempting to click...');
    await page.click('#theme-toggle');
    await page.waitForTimeout(1000);
    
    // Check state after click
    const afterClick = await page.evaluate(() => {
      const html = document.documentElement;
      const toggle = document.getElementById('theme-toggle');
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      return {
        htmlTheme: html.getAttribute('data-theme'),
        localStorage: window.localStorage.getItem('theme'),
        iconClass: icon ? icon.className : null,
        textContent: text ? text.textContent : null
      };
    });
    
    console.log('State after click:', afterClick);
    
    // Try manual click via JavaScript
    console.log('Trying manual JavaScript click...');
    const afterManualClick = await page.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) {
        toggle.click();
        return { clicked: true };
      }
      return { clicked: false };
    });
    
    console.log('Manual click result:', afterManualClick);
    await page.waitForTimeout(1000);
    
    // Check final state
    const finalState = await page.evaluate(() => {
      const html = document.documentElement;
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      return {
        htmlTheme: html.getAttribute('data-theme'),
        localStorage: window.localStorage.getItem('theme'),
        iconClass: icon ? icon.className : null,
        textContent: text ? text.textContent : null
      };
    });
    
    console.log('Final state:', finalState);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugClick();