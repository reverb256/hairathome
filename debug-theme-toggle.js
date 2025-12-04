const { chromium } = require('playwright');

async function debugThemeToggle() {
  console.log('🔍 Debugging Theme Toggle Functionality');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navigate to the site
    await page.goto('http://localhost:1313');
    await page.waitForLoadState('networkidle');
    
    console.log('📄 Page loaded successfully');
    
    // Check for duplicate theme toggle buttons
    const themeToggles = await page.$$('#theme-toggle');
    console.log(`🔘 Found ${themeToggles.length} theme toggle buttons`);
    
    // Check HTML structure
    const htmlAttribute = await page.getAttribute('html', 'data-theme');
    console.log(`🎨 Current HTML data-theme: ${htmlAttribute}`);
    
    // Check localStorage
    const localStorageTheme = await page.evaluate(() => {
      return localStorage.getItem('theme');
    });
    console.log(`💾 localStorage theme: ${localStorageTheme}`);
    
    // Check if theme toggle buttons are visible
    for (let i = 0; i < themeToggles.length; i++) {
      const toggle = themeToggles[i];
      const isVisible = await toggle.isVisible();
      const ariaLabel = await toggle.getAttribute('aria-label');
      const parent = await toggle.evaluate(el => el.parentElement.tagName);
      
      console.log(`🔘 Toggle ${i + 1}: Visible=${isVisible}, Aria="${ariaLabel}", Parent=${parent}`);
    }
    
    // Try clicking the first toggle
    if (themeToggles.length > 0) {
      console.log('🖱️ Clicking first theme toggle...');
      await themeToggles[0].click();
      await page.waitForTimeout(500);
      
      // Check if theme changed
      const newHtmlAttribute = await page.getAttribute('html', 'data-theme');
      const newLocalStorageTheme = await page.evaluate(() => {
        return localStorage.getItem('theme');
      });
      
      console.log(`🎨 New HTML data-theme: ${newHtmlAttribute}`);
      console.log(`💾 New localStorage theme: ${newLocalStorageTheme}`);
      
      // Check icon and text changes
      const icon = await page.$eval('#theme-icon', el => el.className);
      const text = await page.$eval('#theme-text', el => el.textContent);
      
      console.log(`🌙 Icon class: ${icon}`);
      console.log(`📝 Text content: ${text}`);
    }
    
    // Check for JavaScript errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    // Check if theme toggle event listeners are attached
    const hasEventListener = await page.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) {
        return toggle._hasEventListener || toggle.onclick !== null;
      }
      return false;
    });
    console.log(`👂 Event listener attached: ${hasEventListener}`);
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await browser.close();
  }
}

debugThemeToggle();