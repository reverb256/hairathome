const { chromium } = require('playwright');

async function debugThemeLogic() {
  console.log('🔍 Debugging Theme Logic');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:1313');
    await page.waitForLoadState('networkidle');
    
    // Check initial state
    const initialTheme = await page.evaluate(() => {
      const html = document.documentElement;
      const localStorage = window.localStorage.getItem('theme');
      const themeToggle = document.getElementById('theme-toggle');
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      return {
        htmlTheme: html.getAttribute('data-theme'),
        localStorage: localStorage,
        iconClass: icon ? icon.className : null,
        textContent: text ? text.textContent : null
      };
    });
    
    console.log('Initial state:', initialTheme);
    
    // Manually call updateThemeToggle to see what happens
    const afterUpdate = await page.evaluate(() => {
      const html = document.documentElement;
      const themeToggle = document.getElementById('theme-toggle');
      const icon = document.getElementById('theme-icon');
      const text = document.getElementById('theme-text');
      
      // Simulate updateThemeToggle function
      const currentTheme = localStorage.getItem('theme') || 'dark';
      html.setAttribute('data-theme', currentTheme);
      
      if (currentTheme === 'dark') {
        icon.className = 'fas fa-moon';
        if (text) text.textContent = 'Light';
      } else {
        icon.className = 'fas fa-sun';
        if (text) text.textContent = 'Dark';
      }
      
      return {
        htmlTheme: html.getAttribute('data-theme'),
        iconClass: icon ? icon.className : null,
        textContent: text ? text.textContent : null
      };
    });
    
    console.log('After manual update:', afterUpdate);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

debugThemeLogic();