const { chromium } = require('playwright');

async function minimalTest() {
  console.log('🧪 Minimal Theme Test');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`📝 ${msg.type()}: ${msg.text()}`);
  });
  
  try {
    await page.goto('http://localhost:1313?t=' + Date.now());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Extra wait for scripts
    
    // Check if script ran
    const scriptRan = await page.evaluate(() => {
      return window.themeToggleRan || false;
    });
    
    console.log('📦 Script ran:', scriptRan);
    
    // Check theme toggle manually
    const themeToggle = await page.evaluate(() => {
      const toggle = document.getElementById('theme-toggle');
      if (!toggle) return null;
      
      // Manually trigger click
      toggle.click();
      
      // Check result
      return {
        beforeTheme: document.documentElement.getAttribute('data-theme'),
        afterTheme: document.documentElement.getAttribute('data-theme'),
        localStorage: localStorage.getItem('theme')
      };
    });
    
    console.log('🔘 Manual toggle result:', themeToggle);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

minimalTest();